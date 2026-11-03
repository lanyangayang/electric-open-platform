"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TIMEOUT_MS = void 0;
exports.parseBody = parseBody;
exports.assertHttpOk = assertHttpOk;
/**
 * Pluggable HTTP transport.
 *
 * The plugin must run unchanged on three very different hosts:
 *
 * | 宿主 | 推荐实现 | 为什么不能用 fetch |
 * | --- | --- | --- |
 * | Capacitor App | {@link createCapacitorTransport} | WebView origin 跨域，平台不返回 CORS 头 |
 * | Cordova App | `cordova.plugins.electricOpenPlatform.request`（原生） | 同上，且要避开 WebView CORS |
 * | 浏览器 / Node / 测试 | {@link createFetchTransport} | 同源或已有代理 |
 *
 * 所有实现只负责「发出去、拿回来、把 HTTP 状态映射成异常」，
 * 解析 JSON 与业务错误码由上层统一处理，保证三种宿主行为一致。
 */
const errors_js_1 = require("./errors.js");
exports.DEFAULT_TIMEOUT_MS = 20000;
function parseBody(raw) {
    const trimmed = raw.trim();
    if (trimmed === '')
        return null;
    try {
        return JSON.parse(trimmed);
    }
    catch {
        return raw;
    }
}
/** 非 2xx 统一转成可识别的异常。 */
function assertHttpOk(status, raw) {
    if (status < 200 || status >= 300) {
        throw new errors_js_1.ElectricOpenPlatformError(errors_js_1.TransportCodes.HTTP, `服务器返回 HTTP ${status}`, {
            httpStatus: status,
            details: raw,
        });
    }
}
//# sourceMappingURL=transport.js.map