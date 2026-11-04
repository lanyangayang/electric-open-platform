import { afterEach, describe, expect, it } from 'vitest';

import { ElectricOpenPlatformClient } from '../src/client';
import {
  currentTransportName,
  postForm,
  resetTransport,
  setTransport,
  type HttpRequest,
  type Transport,
} from '../src/core/http';
import { detectRuntime, hasGlobalFetch } from '../src/core/runtime';
import { clearDefaultStore, resetStorageBackend, resolveBackend, setDefaultStore } from '../src/core/storage';

const config = {
  appKey: 'O000093290',
  appSecret: 's',
  redirectUri: 'http://yourserverurl/receive',
  baseUrl: 'https://open.snd02.com',
  projectCode: 'P00000104893',
  storage: 'memory' as const,
};

/** 记录被调用的假传输实现。 */
function fakeTransport(name = 'fake'): Transport & { calls: HttpRequest[] } {
  const calls: HttpRequest[] = [];
  return {
    name,
    calls,
    async postForm(req) {
      calls.push(req);
      return { status: 200, data: { code: '0', data: {} }, raw: '{"code":"0","data":{}}' };
    },
  };
}

afterEach(() => {
  resetTransport();
  resetStorageBackend();
  clearDefaultStore();
});

describe('传输选择优先级（无宿主探测）', () => {
  /**
   * 回归测试：configure() 曾经无条件按宿主探测并 setTransport，
   * 把调用方在 configure 之前注入的实现在 Node/Web 下静默覆盖成 fetch。
   */
  it('configure 不会覆盖 configure 之前 setTransport 注入的实现', async () => {
    setTransport(fakeTransport('preset'));
    expect(currentTransportName()).toBe('preset');

    const client = new ElectricOpenPlatformClient();
    await client.configure(config);

    expect(currentTransportName()).toBe('preset');
    expect(client.describe().transport).toBe('preset');
    client.dispose();
  });

  it('config.transport 优先级最高', async () => {
    setTransport(fakeTransport('preset'));

    const client = new ElectricOpenPlatformClient();
    await client.configure({ ...config, transport: fakeTransport('from-config') });

    expect(currentTransportName()).toBe('from-config');
    client.dispose();
  });

  it('未注入时一律用内置 fetch（不读取任何全局对象）', async () => {
    const client = new ElectricOpenPlatformClient();
    await client.configure(config);

    expect(currentTransportName()).toBe('fetch');
    expect(hasGlobalFetch()).toBe(true);
    client.dispose();
  });

  it('注入的实现会被真正用于发请求', async () => {
    const transport = fakeTransport('spy');
    const client = new ElectricOpenPlatformClient();
    await client.configure({ ...config, transport });

    await postForm({ url: 'https://open.snd02.com/invoke/router.as', body: 'a=1' });

    expect(transport.calls).toHaveLength(1);
    expect(transport.calls[0].url).toContain('/invoke/router.as');
    client.dispose();
  });
});

describe('存储后端', () => {
  it('config.store 优先级最高，且 storageBackend() 报出它的名字', async () => {
    const map = new Map<string, string>();
    const store = {
      name: 'my-redis',
      async get(key: string) {
        return map.get(key) ?? null;
      },
      async set(key: string, value: string) {
        map.set(key, value);
      },
      async remove(key: string) {
        map.delete(key);
      },
    };

    const client = new ElectricOpenPlatformClient();
    await client.configure({ ...config, storage: 'localStorage', store });

    expect(await client.storageBackend()).toBe('my-redis');
    expect(client.describe().storageBackend).toBe('my-redis');
    client.dispose();
  });

  it('storage: memory 时不去碰 localStorage', async () => {
    const backend = await resolveBackend('memory');
    expect(backend.name).toBe('memory');
  });

  /**
   * 关键解耦点：宿主应用在 bootstrap 阶段 setDefaultStore() 注入原生偏好后，
   * 共享页面/组件里的 configure() 完全不需要知道宿主是什么 ——
   * 这就是 remote-dashboard 这类「可移植目录」能保持零平台依赖的原因。
   */
  it('setDefaultStore 注入的全局后端优先于 storage 模式，且无需写进 configure', async () => {
    const map = new Map<string, string>();
    setDefaultStore({
      name: 'native-preferences',
      async get(key) {
        return map.get(key) ?? null;
      },
      async set(key, value) {
        map.set(key, value);
      },
      async remove(key) {
        map.delete(key);
      },
    });

    const client = new ElectricOpenPlatformClient();
    await client.configure({ ...config, storage: 'localStorage' });

    expect(await client.storageBackend()).toBe('native-preferences');
    // config.store 仍然高于全局默认后端
    const explicit = new ElectricOpenPlatformClient();
    await explicit.configure({
      ...config,
      store: { name: 'per-call', get: async () => null, set: async () => {}, remove: async () => {} },
    });
    expect(await explicit.storageBackend()).toBe('per-call');

    client.dispose();
    explicit.dispose();
  });

  it('Node 环境没有 localStorage 时 auto 退回内存', async () => {
    resetStorageBackend();
    const backend = await resolveBackend('auto');
    expect(['localStorage', 'memory']).toContain(backend.name);
  });
});

describe('describe() 诊断信息', () => {
  it('暴露 runtime / transport / storageBackend，且不泄露明文密钥', async () => {
    resetTransport();
    const client = new ElectricOpenPlatformClient();
    await client.configure(config);

    const d = client.describe();
    expect(d).toHaveProperty('runtime');
    expect(d).toHaveProperty('transport');
    expect(d).toHaveProperty('storageBackend');
    expect(String(d.appSecret)).not.toContain(`${config.appSecret}x`);
    expect(String(d.appSecret).startsWith('****')).toBe(true);
    client.dispose();
  });

  it('runtime 探测不依赖任何平台 SDK', () => {
    // 测试跑在 Node 里
    expect(detectRuntime()).toBe('node');
  });
});
