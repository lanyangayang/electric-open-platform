"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCapacitorTransport = exports.CORDOVA_PLUGIN_ID = exports.createCordovaTransport = exports.createFetchTransport = exports.DEFAULT_TIMEOUT_MS = exports.assertHttpOk = exports.parseBody = void 0;
exports.currentTransportName = currentTransportName;
exports.currentTransport = currentTransport;
exports.hasExplicitTransport = hasExplicitTransport;
exports.setTransport = setTransport;
exports.resetTransport = resetTransport;
exports.postForm = postForm;
/**
 * 兼容入口：保留 `postForm` 这一函数式 API。
 *
 * 历史上所有调用都走 `postForm`，现在它转发到「当前选定的 Transport」。
 * 这样：
 *  - 既有调用点与测试无需改动；
 *  - Capacitor / Cordova / fetch 的差异被收敛到 transport-*.ts；
 *  - 宿主可用 `setTransport()` 显式指定实现。
 */
const errors_js_1 = require("./errors.js");
const transport_fetch_js_1 = require("./transport-fetch.js");
var transport_js_1 = require("./transport.js");
Object.defineProperty(exports, "parseBody", { enumerable: true, get: function () { return transport_js_1.parseBody; } });
Object.defineProperty(exports, "assertHttpOk", { enumerable: true, get: function () { return transport_js_1.assertHttpOk; } });
Object.defineProperty(exports, "DEFAULT_TIMEOUT_MS", { enumerable: true, get: function () { return transport_js_1.DEFAULT_TIMEOUT_MS; } });
var transport_fetch_js_2 = require("./transport-fetch.js");
Object.defineProperty(exports, "createFetchTransport", { enumerable: true, get: function () { return transport_fetch_js_2.createFetchTransport; } });
var transport_cordova_js_1 = require("./transport-cordova.js");
Object.defineProperty(exports, "createCordovaTransport", { enumerable: true, get: function () { return transport_cordova_js_1.createCordovaTransport; } });
Object.defineProperty(exports, "CORDOVA_PLUGIN_ID", { enumerable: true, get: function () { return transport_cordova_js_1.CORDOVA_PLUGIN_ID; } });
var transport_capacitor_js_1 = require("./transport-capacitor.js");
Object.defineProperty(exports, "createCapacitorTransport", { enumerable: true, get: function () { return transport_capacitor_js_1.createCapacitorTransport; } });
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
/** 替换传输实现（插件在 configure 时按宿主环境自动选择）。 */
function setTransport(transport) {
    current = transport;
    explicit = true;
}
/** 恢复默认的 fetch 实现（测试用）。 */
function resetTransport() {
    current = (0, transport_fetch_js_1.createFetchTransport)();
    explicit = false;
}
/** 用当前传输发送一次 form-urlencoded POST。 */
function postForm(req) {
    if (!current) {
        return Promise.reject(new errors_js_1.ElectricOpenPlatformError(errors_js_1.TransportCodes.NETWORK, '未配置网络传输实现'));
    }
    return current.postForm(req);
}
//# sourceMappingURL=http.js.map