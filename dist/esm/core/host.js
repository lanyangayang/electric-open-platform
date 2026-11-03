import { createFetchTransport } from './transport-fetch.js';
import { createCordovaTransport, resolveCordovaExec } from './transport-cordova.js';
import { createCapacitorTransport } from './transport-capacitor.js';
/** 判断当前宿主，不抛错。 */
export function detectHost() {
    if (resolveCordovaExec())
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
export async function resolveTransport(explicit, preset) {
    if (explicit)
        return explicit;
    if (preset)
        return preset;
    const host = detectHost();
    if (host === 'cordova')
        return createCordovaTransport();
    if (host === 'capacitor-native') {
        try {
            const core = (await import('@capacitor/core'));
            return createCapacitorTransport({ Capacitor: core.Capacitor, CapacitorHttp: core.CapacitorHttp });
        }
        catch {
            // 没有 @capacitor/core（纯 Cordova 工程的构建产物）→ 退回 fetch
            return createFetchTransport();
        }
    }
    return createFetchTransport();
}
//# sourceMappingURL=host.js.map