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
export type Host = 'cordova' | 'capacitor-native' | 'web' | 'node';
/** 判断当前宿主，不抛错。 */
export declare function detectHost(): Host;
/**
 * 按宿主挑选传输实现。
 *
 * @param explicit 配置里显式指定的实现（最高优先级）
 * @param preset   调用方在 configure() 之前用 setTransport 注入的实现；
 *                 传了就直接沿用，避免被宿主探测覆盖
 */
export declare function resolveTransport(explicit?: Transport, preset?: Transport): Promise<Transport>;
