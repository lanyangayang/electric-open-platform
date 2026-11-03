import { Transport } from './transport.js';
/** 只声明用到的形状，避免本文件强依赖 @capacitor/core 的类型。 */
interface CapacitorHttpLike {
    post(options: {
        url: string;
        headers: Record<string, string>;
        data: string;
        connectTimeout: number;
        readTimeout: number;
        responseType: string;
    }): Promise<{
        status: number;
        data: unknown;
    }>;
}
interface CapacitorLike {
    isNativePlatform(): boolean;
}
export declare function createCapacitorTransport(core: {
    Capacitor: CapacitorLike;
    CapacitorHttp: CapacitorHttpLike;
}): Transport;
export {};
