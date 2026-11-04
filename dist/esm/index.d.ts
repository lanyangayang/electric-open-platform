/**
 * @packageDocumentation
 * 智慧式用电数据开放平台（Mtsci Open Platform，open.snd02.com）的纯 TypeScript SDK。
 *
 * 零运行时依赖，Node ≥ 18 / 浏览器 / Electron / 任意前端框架通用；
 * 需要走原生网络或自建网关时，注入一个 {@link Transport} 即可。
 *
 * ```ts
 * import { ElectricOpenPlatform } from '@wdywdy/electric-open-platform';
 *
 * await ElectricOpenPlatform.configure({
 *   appKey: 'O000093290',
 *   appSecret: process.env.EOP_APP_SECRET!,   // keep out of source control
 *   redirectUri: 'http://yourserverurl/receive',
 *   projectCode: 'P00000104893',
 * });
 *
 * await ElectricOpenPlatform.login('yfdq01', '…');
 * const boxes = await ElectricOpenPlatform.box.listOnline();
 * const [live] = await ElectricOpenPlatform.channel.realtime({ mac: boxes[0].mac });
 * await ElectricOpenPlatform.control.switchCircuit({ mac: boxes[0].mac, action: 'close', addr: 1 });
 * ```
 */
export { ElectricOpenPlatform, ElectricOpenPlatformClient } from './client.js';
export { md5, formatTimestamp, formatAlarmTime } from './core/crypto.js';
export { signParams, buildSignedRequest, encodeForm, signAuthCodeSecret, signRefreshSecret, type ParamValue, } from './core/sign.js';
export { postForm, parseBody, createFetchTransport, resolveTransport, setTransport, resetTransport, currentTransport, currentTransportName, hasExplicitTransport, type HttpRequest, type HttpResponse, type Transport, } from './core/http.js';
export { detectRuntime, hasGlobalFetch, type Runtime } from './core/runtime.js';
export { ElectricOpenPlatformError, PlatformCodes, TransportCodes, describeCode, isElectricOpenPlatformError, type PlatformCode, type TransportCode, } from './core/errors.js';
export { DEFAULT_BASE_URL, type ElectricConfig, type ElectricLogger, type ElectricLogEvent, type StorageMode, type TokenSet, type LoginResult, type ApiEnvelope, } from './core/types.js';
export { TokenStore, resolveBackend, resetStorageBackend, createMemoryStore, createLocalStorageStore, memoryBackend, setDefaultStore, getDefaultStore, clearDefaultStore, type KeyValueStore, } from './core/storage.js';
export { AuthManager } from './core/auth.js';
export { RouterClient, type CallOptions } from './core/router.js';
export { verifyPushKey, type PushCmd } from './core/push.js';
export { ProjectApi, BoxApi, ChannelApi, ControlApi, AlarmApi, StatsApi, SceneApi, ThirdPartyDeviceApi, parseThirdPartyData, } from './core/api.js';
export { PushApi } from './core/push.js';
export * from './core/models.js';
