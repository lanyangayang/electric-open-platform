/**
 * 宿主环境探测与传输自动选择。
 *
 * 目标：同一份代码在 Capacitor、Cordova、浏览器、Node 里都能跑，
 * 且优先选择「能绕开 WebView 同源策略」的实现。
 *
 * 选择顺序（**Capacitor 必须排在 Cordova 之前**）：
 *   1. 显式配置的 `transport`（config.transport）
 *   2. 调用方在 configure() 之前用 setTransport 注入的实现
 *   3. Capacitor 原生平台 → capacitor-http
 *      （取不到 CapacitorHttp 时，依次回退 cordova-exec / fetch）
 *   4. Cordova：检测到 `cordova.exec` → cordova-exec
 *   5. Web / Node → fetch
 *
 * 为什么 Capacitor 要排在 Cordova 前面（0.2.1 修复）：
 * Capacitor 应用自带 Cordova 兼容层，WebView 里 `window.cordova.exec` **是存在的**，
 * 但只有真正通过 Capacitor 装上的 Cordova 插件才有对应原生类。如果先判 cordova，
 * 一个纯 Capacitor 工程会被误判成 Cordova 宿主，去调用从未注册的原生类，抛出
 * 「原生请求失败：Class not found」；而同一份代码在浏览器里没有 cordova.exec，
 * 反而走 fetch 一切正常 —— 这类误判极难定位，因此判断顺序必须是 Capacitor 优先。
 */
import type { Transport } from './transport.js';
import { createFetchTransport } from './transport-fetch.js';
import { createCordovaTransport, hasCordovaGlobal, resolveCordovaExec } from './transport-cordova.js';
import { createCapacitorTransport } from './transport-capacitor.js';

export type Host = 'cordova' | 'capacitor-native' | 'web' | 'node';

/** Capacitor 运行时是否认为自己是原生平台（浏览器/Node 里没有全局 Capacitor）。 */
function isCapacitorNative(): boolean {
  const cap = (globalThis as unknown as {
    Capacitor?: { isNativePlatform?: () => boolean };
  }).Capacitor;
  return !!cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform();
}

/** 判断当前宿主，不抛错。 */
export function detectHost(): Host {
  // Capacitor 优先：它自带 cordova 兼容层，先判 cordova 会误判（见文件头注释）。
  if (isCapacitorNative()) return 'capacitor-native';

  // 有 cordova 全局就算 Cordova 宿主：cordova.js 先挂出 cordova 对象，exec 要
  // deviceready 之后才补上。只看 exec 会把「已加载 cordova、仍在 deviceready 之前」
  // 的 App 误判为 web → 选 fetch → 被 WebView 的 CORS 拦死。
  if (hasCordovaGlobal() || resolveCordovaExec()) return 'cordova';

  if (typeof (globalThis as { window?: unknown }).window !== 'undefined') return 'web';
  return 'node';
}

/**
 * 尝试构造 CapacitorHttp 传输实现。
 *
 * Capacitor 的 CapacitorHttp 需要运行时注入（避免强依赖 @capacitor/core），
 * 所以只在宿主确认为 capacitor-native 时才尝试加载，取不到就返回 null 交给调用方回退。
 */
async function tryCreateCapacitorTransport(): Promise<Transport | null> {
  try {
    const core = (await import('@capacitor/core')) as unknown as {
      Capacitor: { isNativePlatform(): boolean };
      CapacitorHttp?: Parameters<typeof createCapacitorTransport>[0]['CapacitorHttp'];
    };
    if (!core?.CapacitorHttp) return null;
    return createCapacitorTransport({
      Capacitor: core.Capacitor,
      CapacitorHttp: core.CapacitorHttp,
    });
  } catch {
    // 没有 @capacitor/core（纯 Cordova 工程的构建产物），或加载失败
    return null;
  }
}

/**
 * 按宿主挑选传输实现。
 *
 * @param explicit 配置里显式指定的实现（最高优先级）
 * @param preset   调用方在 configure() 之前用 setTransport 注入的实现；
 *                 传了就直接沿用，避免被宿主探测覆盖
 */
export async function resolveTransport(explicit?: Transport, preset?: Transport): Promise<Transport> {
  if (explicit) return explicit;
  if (preset) return preset;

  const host = detectHost();

  if (host === 'capacitor-native') {
    const capacitorTransport = await tryCreateCapacitorTransport();
    if (capacitorTransport) return capacitorTransport;
    // Capacitor 原生平台却拿不到 CapacitorHttp（老版本 / 被宿主裁剪）：
    // 有 cordova.exec 就用它（说明 cordova 兼容层的插件确实装上了），否则退回 fetch。
    return resolveCordovaExec() ? createCordovaTransport() : createFetchTransport();
  }

  if (host === 'cordova') return createCordovaTransport();

  return createFetchTransport();
}
