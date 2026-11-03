/**
 * 基于 Cordova 原生桥的传输实现。
 *
 * Cordova 没有 CapacitorHttp 的等价物，所以由本插件的 Android 原生部分提供
 * `request` 动作：用 `HttpURLConnection` 发请求，绕开 WebView 的同源策略。
 *
 * 原生端返回 `{ status, body }`；这里负责把它规范成 {@link HttpResponse}。
 * 若原生桥不可用（例如在纯浏览器里跑 Cordova 构建），给出明确错误而不是静默失败。
 */
import { ElectricOpenPlatformError, TransportCodes } from './errors.js';
import { assertHttpOk, DEFAULT_TIMEOUT_MS, parseBody, } from './transport.js';
export const CORDOVA_PLUGIN_ID = 'ElectricOpenPlatform';
/** 读取全局 `cordova.exec`，取不到返回 null。 */
export function resolveCordovaExec() {
    const g = globalThis;
    return typeof g.cordova?.exec === 'function' ? g.cordova.exec : null;
}
/**
 * 是否存在 `cordova` 全局对象（不要求 `exec` 已就绪）。
 *
 * `cordova.js` 会先挂出 `cordova` 对象，`exec` 要等原生桥就绪后才补上；
 * 只按 `cordova.exec` 判断宿主，会把「已经加载 cordova、但还在 deviceready 之前」
 * 的 App 误判成 web 宿主（进而选 fetch，被 WebView 的 CORS 拦死）。
 */
export function hasCordovaGlobal() {
    const g = globalThis;
    return typeof g.cordova !== 'undefined' && g.cordova !== null;
}
export function createCordovaTransport(options = {}) {
    return {
        name: 'cordova-exec',
        async postForm(req) {
            // 惰性解析 exec：cordova.exec 要 deviceready 之后才可用。若在创建 transport
            // （configure 时）就捕获，早于 deviceready 会永久拿不到桥 → 之后所有请求都失败。
            const exec = options.exec ?? resolveCordovaExec();
            if (!exec) {
                throw new ElectricOpenPlatformError(TransportCodes.NETWORK, 'Cordova 环境未就绪（找不到 cordova.exec）。请确认已安装本插件、已执行 cordova prepare，并在 deviceready 之后再调用。');
            }
            if (req.signal?.aborted) {
                throw new ElectricOpenPlatformError(TransportCodes.ABORTED, '请求已取消');
            }
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                Accept: 'application/json, text/plain, */*',
                ...req.headers,
            };
            const timeoutMs = req.timeoutMs ?? DEFAULT_TIMEOUT_MS;
            const native = await new Promise((resolve, reject) => {
                try {
                    exec((data) => resolve((data ?? {})), (err) => {
                        const message = typeof err === 'string'
                            ? err
                            : err?.message ?? JSON.stringify(err);
                        reject(new ElectricOpenPlatformError(TransportCodes.NETWORK, `原生请求失败：${message}`));
                    }, CORDOVA_PLUGIN_ID, 'request', [{ url: req.url, body: req.body, headers, timeoutMs }]);
                }
                catch (err) {
                    reject(new ElectricOpenPlatformError(TransportCodes.NETWORK, `调用原生请求失败：${err?.message ?? err}`, { cause: err }));
                }
            });
            if (native.error) {
                throw new ElectricOpenPlatformError(TransportCodes.NETWORK, `网络请求失败：${native.error}`);
            }
            const raw = native.body ?? '';
            const status = typeof native.status === 'number' && native.status > 0 ? native.status : 0;
            if (status === 0) {
                throw new ElectricOpenPlatformError(TransportCodes.NETWORK, '原生请求未返回有效 HTTP 状态');
            }
            assertHttpOk(status, raw);
            return { status, data: parseBody(raw), raw };
        },
    };
}
//# sourceMappingURL=transport-cordova.js.map