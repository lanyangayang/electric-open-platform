/**
 * 运行时探测 —— **只用于诊断输出，不参与任何能力选择**。
 *
 * 旧版本会按宿主环境自动装配三套传输实现（原生 HTTP / 原生桥 / fetch），
 * 那是本包与 Capacitor、Cordova 耦合的唯一来源。现在传输实现只来自：
 *
 *   1. `configure({ transport })` 显式指定
 *   2. `configure()` 之前用 `setTransport()` 注入
 *   3. 默认 {@link createFetchTransport}
 *
 * 也就是说：**同一个包在 Node、浏览器、Electron、小程序容器里行为完全一致**，
 * 差异只由使用方注入的 transport / store 决定，而不是由运行时的全局对象猜出来。
 */
/**
 * 判断当前运行时，不抛错。
 *
 * Electron 渲染进程同时有 `window` 与 `process.versions.node`，这里归为 `browser`
 * （它的网络能力仍然受 WebView 同源策略限制）；主进程归为 `node`。
 */
export function detectRuntime() {
    const g = globalThis;
    const hasWindow = typeof g.window !== 'undefined' && typeof g.document !== 'undefined';
    if (hasWindow)
        return 'browser';
    if (typeof g.process?.versions?.node === 'string')
        return 'node';
    return 'unknown';
}
/** 当前运行时是否有可用的全局 `fetch`（Node ≥ 18 / 现代浏览器都有）。 */
export function hasGlobalFetch() {
    return typeof globalThis.fetch === 'function';
}
//# sourceMappingURL=runtime.js.map