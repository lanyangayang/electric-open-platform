/**
 * 纯 Cordova 工程里不存在 `@capacitor/core`。
 * 构建时把该模块指向此 shim，让共用核心代码照常编译。
 *
 * 语义对齐真实实现：`isNativePlatform()` 返回 false，
 * 因此核心会自动选择 Cordova 原生桥或 fetch 传输。
 */
export const Capacitor = {
  isNativePlatform(): boolean {
    return false;
  },
  getPlatform(): string {
    return 'cordova';
  },
};

export const CapacitorHttp = {
  async post(): Promise<never> {
    throw new Error('纯 Cordova 环境不可用 CapacitorHttp，请使用 Cordova 原生桥');
  },
};

export default { Capacitor, CapacitorHttp };
