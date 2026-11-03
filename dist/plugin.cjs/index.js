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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushApi = exports.parseThirdPartyData = exports.ThirdPartyDeviceApi = exports.SceneApi = exports.StatsApi = exports.AlarmApi = exports.ControlApi = exports.ChannelApi = exports.BoxApi = exports.ProjectApi = exports.verifyPushKey = exports.RouterClient = exports.AuthManager = exports.resetStorageBackend = exports.resolveBackend = exports.TokenStore = exports.DEFAULT_BASE_URL = exports.isElectricOpenPlatformError = exports.describeCode = exports.TransportCodes = exports.PlatformCodes = exports.ElectricOpenPlatformError = exports.resolveTransport = exports.detectHost = exports.hasExplicitTransport = exports.currentTransportName = exports.currentTransport = exports.resetTransport = exports.setTransport = exports.CORDOVA_PLUGIN_ID = exports.createFetchTransport = exports.createCordovaTransport = exports.createCapacitorTransport = exports.postForm = exports.signRefreshSecret = exports.signAuthCodeSecret = exports.encodeForm = exports.buildSignedRequest = exports.signParams = exports.formatAlarmTime = exports.formatTimestamp = exports.md5 = exports.ElectricOpenPlatformClient = exports.ElectricOpenPlatform = void 0;
/**
 * @packageDocumentation
 * Capacitor plugin for the Mtsci 智慧式用电数据开放平台 (open.snd02.com).
 *
 * ```ts
 * import { ElectricOpenPlatform } from '@mantunsci/cordova-electric-open-platform';
 *
 * await ElectricOpenPlatform.configure({
 *   appKey: 'O000093290',
 *   appSecret: '…',                    // keep out of source control
 *   redirectUri: 'http://yourserverurl/receive',
 *   projectCode: 'P00000104893',
 *   storage: 'preferences',
 * });
 *
 * await ElectricOpenPlatform.login('yfdq01', '…');
 * const boxes = await ElectricOpenPlatform.box.listOnline();
 * const [live] = await ElectricOpenPlatform.channel.realtime({ mac: boxes[0].mac });
 * await ElectricOpenPlatform.control.switchCircuit({ mac: boxes[0].mac, action: 'close', addr: 1 });
 * ```
 */
var client_js_1 = require("./client.js");
Object.defineProperty(exports, "ElectricOpenPlatform", { enumerable: true, get: function () { return client_js_1.ElectricOpenPlatform; } });
Object.defineProperty(exports, "ElectricOpenPlatformClient", { enumerable: true, get: function () { return client_js_1.ElectricOpenPlatformClient; } });
// Core building blocks — exported so host apps can sign their own calls or
// reuse the primitives in a backend.
var crypto_js_1 = require("./core/crypto.js");
Object.defineProperty(exports, "md5", { enumerable: true, get: function () { return crypto_js_1.md5; } });
Object.defineProperty(exports, "formatTimestamp", { enumerable: true, get: function () { return crypto_js_1.formatTimestamp; } });
Object.defineProperty(exports, "formatAlarmTime", { enumerable: true, get: function () { return crypto_js_1.formatAlarmTime; } });
var sign_js_1 = require("./core/sign.js");
Object.defineProperty(exports, "signParams", { enumerable: true, get: function () { return sign_js_1.signParams; } });
Object.defineProperty(exports, "buildSignedRequest", { enumerable: true, get: function () { return sign_js_1.buildSignedRequest; } });
Object.defineProperty(exports, "encodeForm", { enumerable: true, get: function () { return sign_js_1.encodeForm; } });
Object.defineProperty(exports, "signAuthCodeSecret", { enumerable: true, get: function () { return sign_js_1.signAuthCodeSecret; } });
Object.defineProperty(exports, "signRefreshSecret", { enumerable: true, get: function () { return sign_js_1.signRefreshSecret; } });
var http_js_1 = require("./core/http.js");
Object.defineProperty(exports, "postForm", { enumerable: true, get: function () { return http_js_1.postForm; } });
// 传输层：宿主可以显式指定实现（config.transport / setTransport），
// 避免被 detectHost() 的宿主探测误判。
Object.defineProperty(exports, "createCapacitorTransport", { enumerable: true, get: function () { return http_js_1.createCapacitorTransport; } });
Object.defineProperty(exports, "createCordovaTransport", { enumerable: true, get: function () { return http_js_1.createCordovaTransport; } });
Object.defineProperty(exports, "createFetchTransport", { enumerable: true, get: function () { return http_js_1.createFetchTransport; } });
Object.defineProperty(exports, "CORDOVA_PLUGIN_ID", { enumerable: true, get: function () { return http_js_1.CORDOVA_PLUGIN_ID; } });
Object.defineProperty(exports, "setTransport", { enumerable: true, get: function () { return http_js_1.setTransport; } });
Object.defineProperty(exports, "resetTransport", { enumerable: true, get: function () { return http_js_1.resetTransport; } });
Object.defineProperty(exports, "currentTransport", { enumerable: true, get: function () { return http_js_1.currentTransport; } });
Object.defineProperty(exports, "currentTransportName", { enumerable: true, get: function () { return http_js_1.currentTransportName; } });
Object.defineProperty(exports, "hasExplicitTransport", { enumerable: true, get: function () { return http_js_1.hasExplicitTransport; } });
var host_js_1 = require("./core/host.js");
Object.defineProperty(exports, "detectHost", { enumerable: true, get: function () { return host_js_1.detectHost; } });
Object.defineProperty(exports, "resolveTransport", { enumerable: true, get: function () { return host_js_1.resolveTransport; } });
var errors_js_1 = require("./core/errors.js");
Object.defineProperty(exports, "ElectricOpenPlatformError", { enumerable: true, get: function () { return errors_js_1.ElectricOpenPlatformError; } });
Object.defineProperty(exports, "PlatformCodes", { enumerable: true, get: function () { return errors_js_1.PlatformCodes; } });
Object.defineProperty(exports, "TransportCodes", { enumerable: true, get: function () { return errors_js_1.TransportCodes; } });
Object.defineProperty(exports, "describeCode", { enumerable: true, get: function () { return errors_js_1.describeCode; } });
Object.defineProperty(exports, "isElectricOpenPlatformError", { enumerable: true, get: function () { return errors_js_1.isElectricOpenPlatformError; } });
var types_js_1 = require("./core/types.js");
Object.defineProperty(exports, "DEFAULT_BASE_URL", { enumerable: true, get: function () { return types_js_1.DEFAULT_BASE_URL; } });
var storage_js_1 = require("./core/storage.js");
Object.defineProperty(exports, "TokenStore", { enumerable: true, get: function () { return storage_js_1.TokenStore; } });
Object.defineProperty(exports, "resolveBackend", { enumerable: true, get: function () { return storage_js_1.resolveBackend; } });
Object.defineProperty(exports, "resetStorageBackend", { enumerable: true, get: function () { return storage_js_1.resetStorageBackend; } });
var auth_js_1 = require("./core/auth.js");
Object.defineProperty(exports, "AuthManager", { enumerable: true, get: function () { return auth_js_1.AuthManager; } });
var router_js_1 = require("./core/router.js");
Object.defineProperty(exports, "RouterClient", { enumerable: true, get: function () { return router_js_1.RouterClient; } });
var push_js_1 = require("./core/push.js");
Object.defineProperty(exports, "verifyPushKey", { enumerable: true, get: function () { return push_js_1.verifyPushKey; } });
// Domain APIs (for typing custom wrappers) and every wire model / enum.
var api_js_1 = require("./core/api.js");
Object.defineProperty(exports, "ProjectApi", { enumerable: true, get: function () { return api_js_1.ProjectApi; } });
Object.defineProperty(exports, "BoxApi", { enumerable: true, get: function () { return api_js_1.BoxApi; } });
Object.defineProperty(exports, "ChannelApi", { enumerable: true, get: function () { return api_js_1.ChannelApi; } });
Object.defineProperty(exports, "ControlApi", { enumerable: true, get: function () { return api_js_1.ControlApi; } });
Object.defineProperty(exports, "AlarmApi", { enumerable: true, get: function () { return api_js_1.AlarmApi; } });
Object.defineProperty(exports, "StatsApi", { enumerable: true, get: function () { return api_js_1.StatsApi; } });
Object.defineProperty(exports, "SceneApi", { enumerable: true, get: function () { return api_js_1.SceneApi; } });
Object.defineProperty(exports, "ThirdPartyDeviceApi", { enumerable: true, get: function () { return api_js_1.ThirdPartyDeviceApi; } });
Object.defineProperty(exports, "parseThirdPartyData", { enumerable: true, get: function () { return api_js_1.parseThirdPartyData; } });
var push_js_2 = require("./core/push.js");
Object.defineProperty(exports, "PushApi", { enumerable: true, get: function () { return push_js_2.PushApi; } });
__exportStar(require("./core/models.js"), exports);
//# sourceMappingURL=index.js.map