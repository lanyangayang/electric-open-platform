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
export declare function createCordovaTransport(options?: CordovaTransportOptions): Transport;
