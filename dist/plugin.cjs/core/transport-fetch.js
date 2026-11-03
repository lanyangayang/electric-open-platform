"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFetchTransport = createFetchTransport;
/**
 * 基于 `fetch` 的传输实现。
 *
 * 适用：浏览器（同源或已配代理）、Node/Electron、单元测试。
 * 在 Capacitor/Cordova 的 WebView 里会因平台不返回 CORS 头而失败，
 * 那两个环境请用各自的原生传输实现。
 */
const errors_js_1 = require("./errors.js");
const transport_js_1 = require("./transport.js");
function createFetchTransport() {
    return {
        name: 'fetch',
        async postForm(req) {
            if (req.signal?.aborted) {
                throw new errors_js_1.ElectricOpenPlatformError(errors_js_1.TransportCodes.ABORTED, '请求已取消');
            }
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                Accept: 'application/json, text/plain, */*',
                ...req.headers,
            };
            const timeoutMs = req.timeoutMs ?? transport_js_1.DEFAULT_TIMEOUT_MS;
            // AbortController 让超时行为不依赖运行时的具体实现
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);
            const onAbort = () => controller.abort();
            req.signal?.addEventListener('abort', onAbort);
            try {
                const res = await fetch(req.url, {
                    method: 'POST',
                    headers,
                    body: req.body,
                    signal: controller.signal,
                });
                const raw = await res.text();
                (0, transport_js_1.assertHttpOk)(res.status, raw);
                return { status: res.status, data: (0, transport_js_1.parseBody)(raw), raw };
            }
            catch (err) {
                if (err instanceof errors_js_1.ElectricOpenPlatformError)
                    throw err;
                const aborted = err?.name === 'AbortError';
                throw new errors_js_1.ElectricOpenPlatformError(aborted ? errors_js_1.TransportCodes.ABORTED : errors_js_1.TransportCodes.NETWORK, aborted ? '请求超时或已取消' : `网络请求失败：${err?.message ?? err}`, { cause: err });
            }
            finally {
                clearTimeout(timer);
                req.signal?.removeEventListener('abort', onAbort);
            }
        },
    };
}
//# sourceMappingURL=transport-fetch.js.map