import { Transport } from './transport.js';
export declare const CORDOVA_PLUGIN_ID = "ElectricOpenPlatform";
/** Cordova exec 的最小形状（避免把 cordova 类型带进构建产物）。 */
export interface CordovaExecLike {
    (success: (data: unknown) => void, error: (err: unknown) => void, service: string, action: string, args: unknown[]): void;
}
export interface CordovaTransportOptions {
    /** 默认从 `cordova.exec` 解析；测试可注入。 */
    exec?: CordovaExecLike;
}
/** 读取全局 `cordova.exec`，取不到返回 null。 */
export declare function resolveCordovaExec(): CordovaExecLike | null;
/**
 * 是否存在 `cordova` 全局对象（不要求 `exec` 已就绪）。
 *
 * `cordova.js` 会先挂出 `cordova` 对象，`exec` 要等原生桥就绪后才补上；
 * 只按 `cordova.exec` 判断宿主，会把「已经加载 cordova、但还在 deviceready 之前」
 * 的 App 误判成 web 宿主（进而选 fetch，被 WebView 的 CORS 拦死）。
 */
export declare function hasCordovaGlobal(): boolean;
export declare function createCordovaTransport(options?: CordovaTransportOptions): Transport;
