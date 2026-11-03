/**
 * 纯 Cordova 工程里不存在 `@capacitor/preferences`。
 * 构建时指向此 shim：探测必然失败，核心会退回 Cordova 原生存储或 localStorage。
 */
export const Preferences = {
  async get(_options: { key: string }): Promise<{ value: string | null }> {
    throw new Error('纯 Cordova 环境不使用 @capacitor/preferences');
  },
  async set(_options: { key: string; value: string }): Promise<void> {
    throw new Error('纯 Cordova 环境不使用 @capacitor/preferences');
  },
  async remove(_options: { key: string }): Promise<void> {
    throw new Error('纯 Cordova 环境不使用 @capacitor/preferences');
  },
};

export default { Preferences };
