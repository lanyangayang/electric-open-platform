/**
 * 基于 `fetch` 的传输实现。
 *
 * 适用：浏览器（同源或已配代理）、Node/Electron、单元测试。
 * 在 Capacitor/Cordova 的 WebView 里会因平台不返回 CORS 头而失败，
 * 那两个环境请用各自的原生传输实现。
 */
import { ElectricOpenPlatformError, TransportCodes } from './errors.js';
import { assertHttpOk, DEFAULT_TIMEOUT_MS, parseBody, } from './transport.js';
export function createFetchTransport() {
    return {
        name: 'fetch',
        async postForm(req) {
            if (req.signal?.aborted) {
                throw new ElectricOpenPlatformError(TransportCodes.ABORTED, '请求已取消');
            }
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                Accept: 'application/json, text/plain, */*',
                ...req.headers,
            };
            const timeoutMs = req.timeoutMs ?? DEFAULT_TIMEOUT_MS;
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
                assertHttpOk(res.status, raw);
                return { status: res.status, data: parseBody(raw), raw };
            }
            catch (err) {
                if (err instanceof ElectricOpenPlatformError)
                    throw err;
                const aborted = err?.name === 'AbortError';
                throw new ElectricOpenPlatformError(aborted ? TransportCodes.ABORTED : TransportCodes.NETWORK, aborted ? '请求超时或已取消' : `网络请求失败：${err?.message ?? err}`, { cause: err });
            }
            finally {
                clearTimeout(timer);
                req.signal?.removeEventListener('abort', onAbort);
            }
        },
    };
}
//# sourceMappingURL=transport-fetch.js.map