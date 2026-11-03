/**
 * 宿主环境探测与传输自动选择。
 *
 * 目标：同一份代码在 Capacitor、Cordova、浏览器、Node 里都能跑，
 * 且优先选择「能绕开 WebView 同源策略」的实现。
 *
 * 选择顺序：
 *   1. 显式配置的 `transport`（config.transport）
 *   2. Cordova：检测到 `cordova.exec` → cordova-exec
 *   3. Capacitor：原生平台 → capacitor-http；Web → fetch
 *   4. 其它：fetch
 */
import type { Transport } from './transport.js';
import { createFetchTransport } from './transport-fetch.js';
import { createCordovaTransport, resolveCordovaExec } from './transport-cordova.js';
import { createCapacitorTransport } from './transport-capacitor.js';

export type Host = 'cordova' | 'capacitor-native' | 'web' | 'node';

/** 判断当前宿主，不抛错。 */
export function detectHost(): Host {
  if (resolveCordovaExec()) return 'cordova';

  const cap = (globalThis as unknown as {
    Capacitor?: { isNativePlatform?: () => boolean; getPlatform?: () => string };
  }).Capacitor;
  if (cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform()) {
    return 'capacitor-native';
  }
  if (typeof (globalThis as { window?: unknown }).window !== 'undefined') return 'web';
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
export async function resolveTransport(explicit?: Transport, preset?: Transport): Promise<Transport> {
  if (explicit) return explicit;
  if (preset) return preset;

  const host = detectHost();

  if (host === 'cordova') return createCordovaTransport();

  if (host === 'capacitor-native') {
    try {
      const core = (await import('@capacitor/core')) as unknown as {
        Capacitor: { isNativePlatform(): boolean };
        CapacitorHttp: Parameters<typeof createCapacitorTransport>[0]['CapacitorHttp'];
      };
      return createCapacitorTransport({ Capacitor: core.Capacitor, CapacitorHttp: core.CapacitorHttp });
    } catch {
      // 没有 @capacitor/core（纯 Cordova 工程的构建产物）→ 退回 fetch
      return createFetchTransport();
    }
  }

  return createFetchTransport();
}
