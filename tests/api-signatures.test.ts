import { beforeEach, describe, expect, it, vi } from 'vitest';

const postFormMock = vi.fn();
vi.mock('../src/core/http', () => ({ postForm: (req: unknown) => postFormMock(req) }));

import { ElectricOpenPlatformClient } from '../src/client';

const config = {
  appKey: 'O000093290',
  appSecret: 's',
  redirectUri: 'http://yourserverurl/receive',
  baseUrl: 'https://open.snd02.com',
  projectCode: 'P00000104893',
  storage: 'memory' as const,
};

const ok = (data: unknown) => ({
  status: 200,
  data: { code: '0', message: '成功', success: true, data },
  raw: '',
});

const lastParams = () => {
  const body = new URLSearchParams((postFormMock.mock.calls.at(-1)?.[0] as { body: string }).body);
  const out: Record<string, string> = {};
  body.forEach((v, k) => (out[k] = v));
  return out;
};

let client: ElectricOpenPlatformClient;

beforeEach(async () => {
  postFormMock.mockReset();
  postFormMock.mockResolvedValue({
    status: 200,
    data: {
      code: '0',
      success: true,
      data: { expiresIn: 3600, tokenType: 'BEARER', accessToken: 'T', refreshToken: 'R' },
    },
    raw: '',
  });
  client = new ElectricOpenPlatformClient();
  await client.configure(config);
  await client.login('u', 'p');
  postFormMock.mockReset();
});

describe('GET_BOX_CHANNELS_REALTIME_HISTORY', () => {
  /** 平台只支持按天查（date），旧实现误用了 start/end 区间。 */
  it('发送 date 而不是 start/end', async () => {
    postFormMock.mockResolvedValue(ok({}));
    await client.channel.history({ mac: 'M', date: '2026-11-02', addr: 1 });

    const p = lastParams();
    expect(p.method).toBe('GET_BOX_CHANNELS_REALTIME_HISTORY');
    expect(p.date).toBe('2026-11-02');
    expect(p.start).toBeUndefined();
    expect(p.end).toBeUndefined();
  });

  it('date 格式非法时提前拦截', () => {
    expect(() => client.channel.history({ mac: 'M', date: '2026/11/02' })).toThrow(/yyyy-MM-dd/);
  });

  it('isReturnTotal 转成平台要的 true/false 字符串', async () => {
    postFormMock.mockResolvedValue(ok({}));
    await client.channel.history({ mac: 'M', date: '2026-11-02', isReturnTotal: true });
    expect(lastParams().isReturnTotal).toBe('true');
  });
});

describe('GET_BOX_MAINTENANCE_HISTORY', () => {
  /** start/end 是必填：旧实现只传 mac，平台报「请检查必传参数」。 */
  it('start/end 为必填并格式化为 yyyy-MM-dd HH:mm', async () => {
    postFormMock.mockResolvedValue(ok({ total: 0, page: 1, totalPage: 0, datas: [] }));

    await client.alarm.boxMaintenanceHistory({
      mac: 'M',
      start: new Date(2026, 10, 1, 9, 5),
      end: new Date(2026, 10, 2, 18, 30),
    });

    const p = lastParams();
    expect(p.start).toBe('2026-11-01 09:05');
    expect(p.end).toBe('2026-11-02 18:30');
    expect(p.pageSize).toBe('100');
  });

  it('pageSize 超出 1~100 时拦截', () => {
    expect(() =>
      client.alarm.boxMaintenanceHistory({
        start: '2026-11-01 00:00',
        end: '2026-11-02 00:00',
        pageSize: 200,
      }),
    ).toThrow(/1~100/);
  });
});

describe('ALARM_URGED', () => {
  /** mac 是必填，旧实现漏传。 */
  it('必须携带 mac', async () => {
    postFormMock.mockResolvedValue(ok(null));
    await client.alarm.urged({ mac: 'M', alarmId: 123 });
    const p = lastParams();
    expect(p.method).toBe('ALARM_URGED');
    expect(p.mac).toBe('M');
    expect(p.alarmId).toBe('123');
  });
});

describe('GET_ALARM_MAINTENANCE', () => {
  it('支持多个 alarmId（逗号分隔）', async () => {
    postFormMock.mockResolvedValue(ok({}));
    await client.alarm.maintenance({ alarmId: [1, 2, 3] });
    expect(lastParams().alarmId).toBe('1,2,3');
  });

  it('超过 20 个时拦截（平台上限）', () => {
    const ids = Array.from({ length: 21 }, (_, i) => i + 1);
    expect(() => client.alarm.maintenance({ alarmId: ids })).toThrow(/20/);
  });

  it('空 id 拦截', () => {
    expect(() => client.alarm.maintenance({ alarmId: [] })).toThrow(/不能为空/);
  });
});
