"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFetchTransport = exports.DEFAULT_TIMEOUT_MS = exports.assertHttpOk = exports.parseBody = void 0;
exports.currentTransportName = currentTransportName;
exports.currentTransport = currentTransport;
exports.hasExplicitTransport = hasExplicitTransport;
exports.setTransport = setTransport;
exports.resetTransport = resetTransport;
exports.resolveTransport = resolveTransport;
exports.postForm = postForm;
/**
 * 当前传输实现的注册表 + `postForm` 兼容入口。
 *
 * 历史上所有调用都走 `postForm`，现在它转发到「当前选定的 Transport」。
 * 这样：
 *  - 既有调用点与测试无需改动；
 *  - 传输实现由使用方通过 `config.transport` / `setTransport()` 注入；
 *  - 未注入时一律用内置 `fetch`，不按宿主环境猜。
 */
const errors_js_1 = require("./errors.js");
const transport_fetch_js_1 = require("./transport-fetch.js");
var transport_js_1 = require("./transport.js");
Object.defineProperty(exports, "parseBody", { enumerable: true, get: function () { return transport_js_1.parseBody; } });
Object.defineProperty(exports, "assertHttpOk", { enumerable: true, get: function () { return transport_js_1.assertHttpOk; } });
Object.defineProperty(exports, "DEFAULT_TIMEOUT_MS", { enumerable: true, get: function () { return transport_js_1.DEFAULT_TIMEOUT_MS; } });
var transport_fetch_js_2 = require("./transport-fetch.js");
Object.defineProperty(exports, "createFetchTransport", { enumerable: true, get: function () { return transport_fetch_js_2.createFetchTransport; } });
let current = (0, transport_fetch_js_1.createFetchTransport)();
/** 是否由调用方显式 setTransport 指定过（区别于默认的 fetch）。 */
let explicit = false;
/** 当前实际使用的传输实现名称，供诊断使用。 */
function currentTransportName() {
    return current.name;
}
/** 当前传输实现的引用。 */
function currentTransport() {
    return current;
}
/** 调用方是否显式设置过传输实现。 */
function hasExplicitTransport() {
    return explicit;
}
/** 替换传输实现（插件在 configure 时按 config.transport / 已注入的实现决定）。 */
function setTransport(transport) {
    current = transport;
    explicit = true;
}
/** 恢复默认的 fetch 实现（测试用）。 */
function resetTransport() {
    current = (0, transport_fetch_js_1.createFetchTransport)();
    explicit = false;
}
/**
 * 按优先级挑选传输实现：
 * `config.transport`（最高）> configure() 之前 setTransport 注入的实现 > 内置 fetch。
 *
 * 这里**不做任何宿主探测**：同一个包在 Node、浏览器、Electron 里行为一致，
 * 差异只来自使用方显式注入的实现。
 */
function resolveTransport(explicitTransport, preset) {
    return explicitTransport ?? preset ?? (0, transport_fetch_js_1.createFetchTransport)();
}
/** 用当前传输发送一次 form-urlencoded POST。 */
function postForm(req) {
    if (!current) {
        return Promise.reject(new errors_js_1.ElectricOpenPlatformError(errors_js_1.TransportCodes.NETWORK, '未配置网络传输实现'));
    }
    return current.postForm(req);
}
//# sourceMappingURL=http.js.map