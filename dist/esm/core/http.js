/**
 * 当前传输实现的注册表 + `postForm` 兼容入口。
 *
 * 历史上所有调用都走 `postForm`，现在它转发到「当前选定的 Transport」。
 * 这样：
 *  - 既有调用点与测试无需改动；
 *  - 传输实现由使用方通过 `config.transport` / `setTransport()` 注入；
 *  - 未注入时一律用内置 `fetch`，不按宿主环境猜。
 */
import { ElectricOpenPlatformError, TransportCodes } from './errors.js';
import { createFetchTransport } from './transport-fetch.js';
export { parseBody, assertHttpOk, DEFAULT_TIMEOUT_MS } from './transport.js';
export { createFetchTransport } from './transport-fetch.js';
let current = createFetchTransport();
/** 是否由调用方显式 setTransport 指定过（区别于默认的 fetch）。 */
let explicit = false;
/** 当前实际使用的传输实现名称，供诊断使用。 */
export function currentTransportName() {
    return current.name;
}
/** 当前传输实现的引用。 */
export function currentTransport() {
    return current;
}
/** 调用方是否显式设置过传输实现。 */
export function hasExplicitTransport() {
    return explicit;
}
/** 替换传输实现（插件在 configure 时按 config.transport / 已注入的实现决定）。 */
export function setTransport(transport) {
    current = transport;
    explicit = true;
}
/** 恢复默认的 fetch 实现（测试用）。 */
export function resetTransport() {
    current = createFetchTransport();
    explicit = false;
}
/**
 * 按优先级挑选传输实现：
 * `config.transport`（最高）> configure() 之前 setTransport 注入的实现 > 内置 fetch。
 *
 * 这里**不做任何宿主探测**：同一个包在 Node、浏览器、Electron 里行为一致，
 * 差异只来自使用方显式注入的实现。
 */
export function resolveTransport(explicitTransport, preset) {
    return explicitTransport ?? preset ?? createFetchTransport();
}
/** 用当前传输发送一次 form-urlencoded POST。 */
export function postForm(req) {
    if (!current) {
        return Promise.reject(new ElectricOpenPlatformError(TransportCodes.NETWORK, '未配置网络传输实现'));
    }
    return current.postForm(req);
}
//# sourceMappingURL=http.js.map