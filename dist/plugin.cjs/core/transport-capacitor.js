"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCapacitorTransport = createCapacitorTransport;
/**
 * 基于 CapacitorHttp 的传输实现。
 *
 * CapacitorHttp 走原生网络栈，不受 WebView 同源策略限制，平台不返回 CORS 头也能通。
 * 与 `@capacitor/core` 的耦合收敛在这个文件里，Cordova 构建不会引入它。
 */
const errors_js_1 = require("./errors.js");
const transport_js_1 = require("./transport.js");
function createCapacitorTransport(core) {
    const { Capacitor, CapacitorHttp } = core;
    return {
        name: 'capacitor-http',
        async postForm(req) {
            if (req.signal?.aborted) {
                throw new errors_js_1.ElectricOpenPlatformError(errors_js_1.TransportCodes.ABORTED, '请求已取消');
            }
            if (!Capacitor.isNativePlatform()) {
                throw new errors_js_1.ElectricOpenPlatformError(errors_js_1.TransportCodes.NETWORK, '当前不是原生平台，CapacitorHttp 不可用；请改用 fetch 传输');
            }
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                Accept: 'application/json, text/plain, */*',
                ...req.headers,
            };
            const timeoutMs = req.timeoutMs ?? transport_js_1.DEFAULT_TIMEOUT_MS;
            const res = await CapacitorHttp.post({
                url: req.url,
                headers,
                data: req.body,
                connectTimeout: timeoutMs,
                readTimeout: timeoutMs,
                responseType: 'text',
            });
            const raw = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
            (0, transport_js_1.assertHttpOk)(res.status, raw);
            return { status: res.status, data: (0, transport_js_1.parseBody)(raw), raw };
        },
    };
}
//# sourceMappingURL=transport-capacitor.js.map