/**
 * 兼容入口：保留 `postForm` 这一函数式 API。
 *
 * 历史上所有调用都走 `postForm`，现在它转发到「当前选定的 Transport」。
 * 这样：
 *  - 既有调用点与测试无需改动；
 *  - Capacitor / Cordova / fetch 的差异被收敛到 transport-*.ts；
 *  - 宿主可用 `setTransport()` 显式指定实现。
 */
import { ElectricOpenPlatformError, TransportCodes } from './errors.js';
import { createFetchTransport } from './transport-fetch.js';
export { parseBody, assertHttpOk, DEFAULT_TIMEOUT_MS } from './transport.js';
export { createFetchTransport } from './transport-fetch.js';
export { createCordovaTransport, CORDOVA_PLUGIN_ID } from './transport-cordova.js';
export { createCapacitorTransport } from './transport-capacitor.js';
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
/** 替换传输实现（插件在 configure 时按宿主环境自动选择）。 */
export function setTransport(transport) {
    current = transport;
    explicit = true;
}
/** 恢复默认的 fetch 实现（测试用）。 */
export function resetTransport() {
    current = createFetchTransport();
    explicit = false;
}
/** 用当前传输发送一次 form-urlencoded POST。 */
export function postForm(req) {
    if (!current) {
        return Promise.reject(new ElectricOpenPlatformError(TransportCodes.NETWORK, '未配置网络传输实现'));
    }
    return current.postForm(req);
}
//# sourceMappingURL=http.js.map