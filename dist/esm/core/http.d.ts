import { Transport, HttpRequest, HttpResponse } from './transport.js';
export type { HttpRequest, HttpResponse, Transport } from './transport.js';
export { parseBody, assertHttpOk, DEFAULT_TIMEOUT_MS } from './transport.js';
export { createFetchTransport } from './transport-fetch.js';
export { createCordovaTransport, CORDOVA_PLUGIN_ID } from './transport-cordova.js';
export { createCapacitorTransport } from './transport-capacitor.js';
/** 当前实际使用的传输实现名称，供诊断使用。 */
export declare function currentTransportName(): string;
/** 当前传输实现的引用。 */
export declare function currentTransport(): Transport;
/** 调用方是否显式设置过传输实现。 */
export declare function hasExplicitTransport(): boolean;
/** 替换传输实现（插件在 configure 时按宿主环境自动选择）。 */
export declare function setTransport(transport: Transport): void;
/** 恢复默认的 fetch 实现（测试用）。 */
export declare function resetTransport(): void;
/** 用当前传输发送一次 form-urlencoded POST。 */
export declare function postForm(req: HttpRequest): Promise<HttpResponse>;
