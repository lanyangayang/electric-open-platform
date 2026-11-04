import { HttpRequest, HttpResponse, Transport } from './transport.js';
export type { HttpRequest, HttpResponse, Transport } from './transport.js';
export { parseBody, assertHttpOk, DEFAULT_TIMEOUT_MS } from './transport.js';
export { createFetchTransport } from './transport-fetch.js';
/** 当前实际使用的传输实现名称，供诊断使用。 */
export declare function currentTransportName(): string;
/** 当前传输实现的引用。 */
export declare function currentTransport(): Transport;
/** 调用方是否显式设置过传输实现。 */
export declare function hasExplicitTransport(): boolean;
/** 替换传输实现（插件在 configure 时按 config.transport / 已注入的实现决定）。 */
export declare function setTransport(transport: Transport): void;
/** 恢复默认的 fetch 实现（测试用）。 */
export declare function resetTransport(): void;
/**
 * 按优先级挑选传输实现：
 * `config.transport`（最高）> configure() 之前 setTransport 注入的实现 > 内置 fetch。
 *
 * 这里**不做任何宿主探测**：同一个包在 Node、浏览器、Electron 里行为一致，
 * 差异只来自使用方显式注入的实现。
 */
export declare function resolveTransport(explicitTransport?: Transport, preset?: Transport): Transport;
/** 用当前传输发送一次 form-urlencoded POST。 */
export declare function postForm(req: HttpRequest): Promise<HttpResponse>;
