import { afterEach, describe, expect, it } from 'vitest';

import { ElectricOpenPlatformClient } from '../src/client';
import { currentTransportName, resetTransport, setTransport } from '../src/core/http';
import { createCordovaTransport } from '../src/core/transport-cordova';
import { detectHost } from '../src/core/host';

const config = {
  appKey: 'O000093290',
  appSecret: 's',
  redirectUri: 'http://yourserverurl/receive',
  baseUrl: 'https://open.snd02.com',
  projectCode: 'P00000104893',
  storage: 'memory' as const,
};

/** 伪造一个永远成功的原生 exec。 */
const fakeExec = (ok: (d: unknown) => void) =>
  ok({ status: 200, body: '{"code":"0","data":{}}' });

afterEach(() => {
  resetTransport();
  delete (globalThis as { cordova?: unknown }).cordova;
  delete (globalThis as { Capacitor?: unknown }).Capacitor;
});

describe('传输选择优先级', () => {
  /**
   * 回归测试：曾经 configure() 无条件按宿主探测并 setTransport，
   * 把调用方在 configure 之前注入的实现在 Node/Web 下静默覆盖成 fetch。
   */
  it('configure 不会覆盖 configure 之前 setTransport 注入的实现', async () => {
    setTransport(createCordovaTransport({ exec: fakeExec as never }));
    expect(currentTransportName()).toBe('cordova-exec');

    const client = new ElectricOpenPlatformClient();
    await client.configure(config);

    expect(currentTransportName()).toBe('cordova-exec');
    expect(client.describe().transport).toBe('cordova-exec');
    client.dispose();
  });

  it('config.transport 优先级最高', async () => {
    setTransport(createCordovaTransport({ exec: fakeExec as never }));

    const client = new ElectricOpenPlatformClient();
    await client.configure({
      ...config,
      transport: {
        name: 'custom',
        postForm: async () => ({ status: 200, data: {}, raw: '' }),
      },
    });

    expect(currentTransportName()).toBe('custom');
    client.dispose();
  });

  it('未注入时按宿主探测：无 cordova 的环境回退 fetch', async () => {
    resetTransport();
    const client = new ElectricOpenPlatformClient();
    await client.configure(config);
    // 测试环境是 node，没有 cordova.exec → fetch
    expect(detectHost()).toBe('node');
    expect(currentTransportName()).toBe('fetch');
    client.dispose();
  });

  it('存在 cordova.exec 时探测为 cordova 宿主', async () => {
    resetTransport();
    (globalThis as { cordova?: unknown }).cordova = { exec: () => {} };
    expect(detectHost()).toBe('cordova');

    const client = new ElectricOpenPlatformClient();
    await client.configure(config);
    expect(currentTransportName()).toBe('cordova-exec');
    client.dispose();
  });

  /**
   * 回归测试（0.2.1）：Capacitor 应用自带 Cordova 兼容层，WebView 里
   * `window.cordova.exec` 是存在的，但插件原生类并没有注册。若先判 cordova，
   * 会把纯 Capacitor 工程误判成 Cordova 宿主，真机抛「原生请求失败：Class not found」，
   * 而浏览器里（没有 cordova.exec）一切正常。
   */
  it('Capacitor 原生优先于 cordova.exec', async () => {
    resetTransport();
    (globalThis as { Capacitor?: unknown }).Capacitor = {
      isNativePlatform: () => true,
      getPlatform: () => 'android',
    };
    (globalThis as { cordova?: unknown }).cordova = { exec: () => {} };

    expect(detectHost()).toBe('capacitor-native');

    const client = new ElectricOpenPlatformClient();
    await client.configure(config);
    expect(currentTransportName()).toBe('capacitor-http');
    client.dispose();
  });

  it('Capacitor 原生平台下，config.transport 仍然优先级最高', async () => {
    resetTransport();
    (globalThis as { Capacitor?: unknown }).Capacitor = {
      isNativePlatform: () => true,
      getPlatform: () => 'android',
    };

    const client = new ElectricOpenPlatformClient();
    await client.configure({
      ...config,
      transport: {
        name: 'custom',
        postForm: async () => ({ status: 200, data: {}, raw: '' }),
      },
    });
    expect(currentTransportName()).toBe('custom');
    client.dispose();
  });
});

describe('describe() 诊断信息', () => {
  it('暴露 host 与 transport 便于排查', async () => {
    resetTransport();
    const client = new ElectricOpenPlatformClient();
    await client.configure(config);
    const d = client.describe();
    expect(d).toHaveProperty('host');
    expect(d).toHaveProperty('transport');
    // 不应泄露明文密钥
    expect(String(d.appSecret)).not.toContain(config.appSecret + 'x');
    client.dispose();
  });
});
