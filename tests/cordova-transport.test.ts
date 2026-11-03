import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createCordovaTransport } from '../src/core/transport-cordova';
import { createFetchTransport } from '../src/core/transport-fetch';
import { ElectricOpenPlatformError, TransportCodes } from '../src/core/errors';
import { setTransport, resetTransport, currentTransportName, postForm } from '../src/core/http';
import { resolveBackend, resetStorageBackend } from '../src/core/storage';

/** 模拟 cordova.exec：把调用记录下来，并按 action 决定回包。 */
function makeFakeExec(handler: (service: string, action: string, args: unknown[]) => unknown) {
  const calls: { service: string; action: string; args: unknown[] }[] = [];
  const exec = (
    success: (d: unknown) => void,
    error: (e: unknown) => void,
    service: string,
    action: string,
    args: unknown[],
  ) => {
    calls.push({ service, action, args });
    Promise.resolve()
      .then(() => handler(service, action, args))
      .then(
        (v) => success(v),
        (e) => error(e),
      );
  };
  return { exec, calls };
}

describe('CordovaTransport', () => {
  it('调用原生 request 动作并解析响应', async () => {
    const { exec, calls } = makeFakeExec(() => ({
      status: 200,
      body: '{"code":"0","data":{"ok":true}}',
    }));
    const transport = createCordovaTransport({ exec });

    const res = await transport.postForm({
      url: 'https://open.snd02.com/invoke/router.as',
      body: 'a=1&b=2',
    });

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ code: '0', data: { ok: true } });

    expect(calls).toHaveLength(1);
    expect(calls[0].service).toBe('ElectricOpenPlatform');
    expect(calls[0].action).toBe('request');
    const payload = calls[0].args[0] as { url: string; body: string; headers: Record<string, string> };
    expect(payload.url).toBe('https://open.snd02.com/invoke/router.as');
    expect(payload.body).toBe('a=1&b=2');
    expect(payload.headers['Content-Type']).toContain('x-www-form-urlencoded');
  });

  it('非 2xx 转成 HTTP 异常', async () => {
    const { exec } = makeFakeExec(() => ({ status: 500, body: 'boom' }));
    const transport = createCordovaTransport({ exec });

    await expect(
      transport.postForm({ url: 'https://x/y', body: '' }),
    ).rejects.toMatchObject({ code: TransportCodes.HTTP, httpStatus: 500 });
  });

  it('原生返回 error 时抛 NETWORK', async () => {
    const { exec } = makeFakeExec(() => ({ error: '连接被拒绝' }));
    const transport = createCordovaTransport({ exec });

    await expect(transport.postForm({ url: 'https://x/y', body: '' })).rejects.toMatchObject({
      code: TransportCodes.NETWORK,
    });
  });

  it('缺少有效 status 时抛 NETWORK', async () => {
    const { exec } = makeFakeExec(() => ({ body: 'no status' }));
    const transport = createCordovaTransport({ exec });

    await expect(transport.postForm({ url: 'https://x/y', body: '' })).rejects.toMatchObject({
      code: TransportCodes.NETWORK,
    });
  });

  it('原生 exec 抛错时转成 NETWORK 异常', async () => {
    const exec = () => {
      throw new Error('bridge not ready');
    };
    const transport = createCordovaTransport({ exec: exec as never });

    await expect(transport.postForm({ url: 'https://x/y', body: '' })).rejects.toMatchObject({
      code: TransportCodes.NETWORK,
    });
  });

  it('找不到 cordova.exec 时给出可读提示', async () => {
    const transport = createCordovaTransport({ exec: undefined as never });
    // 显式传 undefined 会回退到全局探测；测试环境无 cordova，应报未就绪
    await expect(transport.postForm({ url: 'https://x/y', body: '' })).rejects.toMatchObject({
      code: TransportCodes.NETWORK,
    });
  });

  it('已取消的 request 直接拒绝', async () => {
    const { exec } = makeFakeExec(() => ({ status: 200, body: '{}' }));
    const transport = createCordovaTransport({ exec });
    const controller = new AbortController();
    controller.abort();

    await expect(
      transport.postForm({ url: 'https://x/y', body: '', signal: controller.signal }),
    ).rejects.toMatchObject({ code: TransportCodes.ABORTED });
  });
});

describe('transport 切换', () => {
  beforeEach(() => {
    resetTransport();
  });

  it('默认是 fetch', () => {
    expect(currentTransportName()).toBe('fetch');
  });

  it('setTransport 后 postForm 走新实现', async () => {
    const { exec, calls } = makeFakeExec(() => ({ status: 200, body: '{"code":"0"}' }));
    setTransport(createCordovaTransport({ exec }));

    expect(currentTransportName()).toBe('cordova-exec');
    const res = await postForm({ url: 'https://x/y', body: 'k=v' });
    expect(res.data).toEqual({ code: '0' });
    expect(calls).toHaveLength(1);
  });

  it('resetTransport 恢复 fetch', () => {
    setTransport(createCordovaTransport({ exec: (() => {}) as never }));
    resetTransport();
    expect(currentTransportName()).toBe('fetch');
  });
});

describe('Cordova 存储后端', () => {
  beforeEach(() => {
    resetStorageBackend();
  });

  it('通过 cordova.exec 读写 token', async () => {
    const store = new Map<string, string>();
    const { exec, calls } = makeFakeExec((_service, action, args) => {
      const { key, value } = (args[0] ?? {}) as { key: string; value?: string };
      switch (action) {
        case 'storageGet':
          return { value: store.get(key) ?? null };
        case 'storageSet':
          store.set(key, value ?? '');
          return null;
        case 'storageRemove':
          store.delete(key);
          return null;
        default:
          throw new Error(`unknown action ${action}`);
      }
    });

    // 注入全局 cordova
    (globalThis as { cordova?: unknown }).cordova = { exec };
    try {
      const backend = await resolveBackend('cordova');
      expect(backend.name).toBe('cordova-preferences');

      await backend.set('k1', 'v1');
      expect(await backend.get('k1')).toBe('v1');
      await backend.remove('k1');
      expect(await backend.get('k1')).toBe(null);

      expect(calls.some((c) => c.action === 'storageSet')).toBe(true);
    } finally {
      delete (globalThis as { cordova?: unknown }).cordova;
    }
  });

  it('无原生桥时退回 localStorage 或内存', async () => {
    const backend = await resolveBackend('cordova');
    expect(['localStorage', 'memory']).toContain(backend.name);
  });
});

describe('fetch 传输', () => {
  it('非 2xx 抛 HTTP 异常', async () => {
    vi.stubGlobal('fetch', async () => new Response('nope', { status: 502 }));
    try {
      await expect(
        createFetchTransport().postForm({ url: 'https://x/y', body: '' }),
      ).rejects.toBeInstanceOf(ElectricOpenPlatformError);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
