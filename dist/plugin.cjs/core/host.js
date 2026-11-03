"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectHost = detectHost;
exports.resolveTransport = resolveTransport;
const transport_fetch_js_1 = require("./transport-fetch.js");
const transport_cordova_js_1 = require("./transport-cordova.js");
const transport_capacitor_js_1 = require("./transport-capacitor.js");
/** 判断当前宿主，不抛错。 */
function detectHost() {
    if ((0, transport_cordova_js_1.resolveCordovaExec)())
        return 'cordova';
    const cap = globalThis.Capacitor;
    if (cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform()) {
        return 'capacitor-native';
    }
    if (typeof globalThis.window !== 'undefined')
        return 'web';
    return 'node';
}
/**
 * 按宿主挑选传输实现。
 *
 * Capacitor 的 CapacitorHttp 需要运行时注入（避免强依赖 @capacitor/core），
 * 所以只在宿主确认为 capacitor-native 时才尝试加载，加载失败回退 fetch。
 *
 * @param explicit 配置里显式指定的实现（最高优先级）
 * @param preset   调用方在 configure() 之前用 setTransport 注入的实现；
 *                 传了就直接沿用，避免被宿主探测覆盖
 */
async function resolveTransport(explicit, preset) {
    if (explicit)
        return explicit;
    if (preset)
        return preset;
    const host = detectHost();
    if (host === 'cordova')
        return (0, transport_cordova_js_1.createCordovaTransport)();
    if (host === 'capacitor-native') {
        try {
            const core = (await Promise.resolve().then(() => __importStar(require('@capacitor/core'))));
            return (0, transport_capacitor_js_1.createCapacitorTransport)({ Capacitor: core.Capacitor, CapacitorHttp: core.CapacitorHttp });
        }
        catch {
            // 没有 @capacitor/core（纯 Cordova 工程的构建产物）→ 退回 fetch
            return (0, transport_fetch_js_1.createFetchTransport)();
        }
    }
    return (0, transport_fetch_js_1.createFetchTransport)();
}
//# sourceMappingURL=host.js.map