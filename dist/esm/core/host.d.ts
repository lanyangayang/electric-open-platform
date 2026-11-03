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
export type Host = 'cordova' | 'capacitor-native' | 'web' | 'node';
/** 判断当前宿主，不抛错。 */
export declare function detectHost(): Host;
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
export declare function resolveTransport(explicit?: Transport, preset?: Transport): Promise<Transport>;
