import { beforeEach, describe, expect, it, vi } from 'vitest';

const postFormMock = vi.fn();
vi.mock('../src/core/http', () => ({
  postForm: (req: unknown) => postFormMock(req),
}));

import { ElectricOpenPlatformClient } from '../src/client';
import { parseThirdPartyData } from '../src/core/api';
import { MeterQueryType, ThirdPartyEquipmentType } from '../src/core/models';

const config = {
  appKey: 'O000093290',
  appSecret: 'apsecret',
  redirectUri: 'http://yourserverurl/receive',
  baseUrl: 'https://open.snd02.com',
  projectCode: 'P00000104893',
  storage: 'memory' as const,
};

function tokenResponse() {
  return {
    status: 200,
    data: {
      code: '0',
      success: true,
      data: { expiresIn: 3600, tokenType: 'BEARER', accessToken: 'TOK', refreshToken: 'REF' },
    },
    raw: '',
  };
}

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
  postFormMock.mockResolvedValue(tokenResponse());
  client = new ElectricOpenPlatformClient();
  await client.configure(config);
  await client.login('u', 'p');
  postFormMock.mockReset();
});

describe('统计接口方法名', () => {
  /**
   * 回归测试：插件曾把 GET_BOXES_* 写成 GET_BOXS_*，
   * 平台回「接口名称(X)无效！」而被误判为「未开通」。已对真实服务器验证。
   */
  it('day/hour/month 都使用 GET_BOXES_ 前缀（BOX + ES）', async () => {
    postFormMock.mockResolvedValue(ok({}));

    await client.stats.day({ mac: 'M1', year: '2026', month: '11', day: '02' });
    expect(lastParams().method).toBe('GET_BOXES_DAY_STATS');

    await client.stats.hour({ mac: 'M1', year: '2026', month: '11', day: '02' });
    expect(lastParams().method).toBe('GET_BOXES_HOUR_STATS');

    await client.stats.month({ mac: 'M1', year: '2026' });
    expect(lastParams().method).toBe('GET_BOXES_MON_STATS');
  });

  it('不会发送 GET_BOXS_ 这种拼写', async () => {
    postFormMock.mockResolvedValue(ok({}));
    await client.stats.day({ mac: 'M1', year: '2026', month: '11' });
    await client.stats.hour({ mac: 'M1', year: '2026', month: '11', day: '02' });
    await client.stats.month({ mac: 'M1', year: '2026' });

    for (const call of postFormMock.mock.calls) {
      const body = new URLSearchParams((call[0] as { body: string }).body);
      expect(body.get('method')).not.toMatch(/^GET_BOXS_/);
    }
  });

  it('多设备 mac 用逗号拼接', async () => {
    postFormMock.mockResolvedValue(ok({}));
    await client.stats.day({ mac: ['A', 'B'], year: '2026', month: '11' });
    expect(lastParams().mac).toBe('A,B');
  });
});

describe('ThirdPartyDeviceApi', () => {
  it('调用 GET_THR_DEVICE_STATUS 并传 equipmentType', async () => {
    postFormMock.mockResolvedValue(ok([]));
    await client.thirdparty.status({
      mac: '86xx',
      equipmentType: ThirdPartyEquipmentType.SmokeForSafe,
    });

    const p = lastParams();
    expect(p.method).toBe('GET_THR_DEVICE_STATUS');
    expect(p.equipmentType).toBe('6');
    expect(p.mac).toBe('86xx');
  });

  it('拒绝微断(1)/电气火灾(2)：这两类不走该接口', () => {
    expect(() => client.thirdparty.status({ mac: 'M', equipmentType: 1 })).toThrow(/微断/);
    expect(() => client.thirdparty.status({ mac: 'M', equipmentType: 2 })).toThrow(/微断/);
  });

  it('智能水表(16)必须提供 dataType', () => {
    expect(() =>
      client.thirdparty.status({ mac: 'M', equipmentType: ThirdPartyEquipmentType.SmartWaterMeter }),
    ).toThrow(/dataType/);
  });

  it('dataType=1 时必须提供起止日期', () => {
    expect(() =>
      client.thirdparty.status({
        mac: 'M',
        equipmentType: ThirdPartyEquipmentType.SmartWaterMeter,
        dataType: MeterQueryType.Range,
      }),
    ).toThrow(/startDate/);
  });

  it('时间范围查询会把日期透传', async () => {
    postFormMock.mockResolvedValue(ok([]));
    await client.thirdparty.status({
      mac: 'M',
      equipmentType: ThirdPartyEquipmentType.SmartWaterMeter,
      dataType: MeterQueryType.Range,
      startDate: '2026-11-01',
      endDate: '2026-11-02',
    });
    const p = lastParams();
    expect(p.dataType).toBe('1');
    expect(p.startDate).toBe('2026-11-01');
    expect(p.endDate).toBe('2026-11-02');
  });

  it('statusParsed 把 data 的 JSON 字符串解析成对象', async () => {
    postFormMock.mockResolvedValue(
      ok([
        { devType: 'FS3031', msgType: 'BatVol', data: '{"BatLow":0,"Voltage":"2.78"}', mac: 'M' },
        { devType: 'FS3031', msgType: 'Status', data: '0', mac: 'M' },
      ]),
    );

    const rows = await client.thirdparty.statusParsed({
      mac: 'M',
      equipmentType: ThirdPartyEquipmentType.SmokeForSafe,
    });

    expect(rows[0].data).toEqual({ BatLow: 0, Voltage: '2.78' });
    expect(rows[1].data).toBe(0);
  });

  it('listDevices 按类型过滤 GET_BOXES 结果', async () => {
    postFormMock.mockResolvedValue(
      ok([
        { mac: 'A', equipmentType: 6 },
        { mac: 'B', equipmentType: 1 },
      ]),
    );
    const devices = await client.thirdparty.listDevices({
      equipmentType: ThirdPartyEquipmentType.SmokeForSafe,
    });
    expect(devices.map((d) => d.mac)).toEqual(['A']);
  });
});

describe('parseThirdPartyData', () => {
  it('解析 JSON 对象', () => {
    expect(parseThirdPartyData('{"a":1}')).toEqual({ a: 1 });
  });

  it('解析纯数字字面量', () => {
    expect(parseThirdPartyData('0')).toBe(0);
    expect(parseThirdPartyData('-3.5')).toBe(-3.5);
  });

  it('无法解析时原样返回字符串', () => {
    expect(parseThirdPartyData('not json')).toBe('not json');
  });

  it('空串返回 null，非字符串原样返回', () => {
    expect(parseThirdPartyData('')).toBeNull();
    expect(parseThirdPartyData({ already: 'object' })).toEqual({ already: 'object' });
  });
});
