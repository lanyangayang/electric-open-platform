/**
 * Token / config persistence.
 *
 * The platform's own guidance is to keep one "central controller" that owns the
 * access token, so tokens are persisted across restarts and renewed with the
 * refresh token.
 *
 * 本包**不依赖任何平台 SDK**。存储后端由 {@link KeyValueStore} 抽象：
 *
 * | 模式 | 实现 | 说明 |
 * | --- | --- | --- |
 * | `auto`（默认） | `localStorage` → 内存 | 浏览器/Electron 渲染进程可用；Node 里退到内存 |
 * | `localStorage` | `localStorage` | 拿不到时退到内存 |
 * | `memory` | 内存 | 进程结束即丢，适合测试或一次性脚本 |
 * | 自定义 | `config.store` | 想写入文件、Redis、数据库、iOS `UserDefaults`／Android
 *   `SharedPreferences` 时，自己实现 4 个方法传给 `configure({ store })` 即可 |
 *
 * 之前版本内置的宿主原生存储（Cordova SharedPreferences、Capacitor Preferences）已移除：
 * 它们需要宿主桥接或额外依赖，与「纯 npm 包、任何项目都能用」的目标冲突。
 * 同样的能力可以用自定义 store 在 10 行内实现，见 README。
 */
import type { StorageMode } from './types.js';

/**
 * 最小键值存储契约。
 *
 * 实现只需保证 4 个方法；写入失败请抛出异常，调用方会降级处理而不是崩溃。
 */
export interface KeyValueStore {
  /** 便于诊断：`client.storageBackend()` 与 `describe()` 会返回该名字。 */
  readonly name: string;
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

const memory = new Map<string, string>();

/** 内存后端：进程内共享，适合测试与一次性脚本。 */
export function createMemoryStore(): KeyValueStore {
  return {
    name: 'memory',
    async get(key) {
      return memory.has(key) ? (memory.get(key) as string) : null;
    },
    async set(key, value) {
      memory.set(key, value);
    },
    async remove(key) {
      memory.delete(key);
    },
  };
}

export const memoryBackend: KeyValueStore = createMemoryStore();

/** 探活 localStorage：隐私模式/服务端渲染下读写都会抛错，此时返回 null。 */
export function createLocalStorageStore(): KeyValueStore | null {
  try {
    if (typeof globalThis.localStorage === 'undefined') return null;
    const probe = '__eop_probe__';
    globalThis.localStorage.setItem(probe, '1');
    globalThis.localStorage.removeItem(probe);
  } catch {
    return null;
  }
  return {
    name: 'localStorage',
    async get(key) {
      return globalThis.localStorage.getItem(key);
    },
    async set(key, value) {
      globalThis.localStorage.setItem(key, value);
    },
    async remove(key) {
      globalThis.localStorage.removeItem(key);
    },
  };
}

let resolved: KeyValueStore | null = null;
let defaultStore: KeyValueStore | undefined;

/**
 * 注入全局默认存储后端（如 iOS `UserDefaults` / Android `SharedPreferences`）。
 *
 * 与 `setTransport()` 对称：宿主应用在 bootstrap 阶段调用一次，之后所有
 * `configure()` 都会用它，业务代码（组件、页面、共享模块）**不需要知道宿主是什么**。
 * 传了 `config.store` 时以 `config.store` 为准。
 */
export function setDefaultStore(store: KeyValueStore): void {
  defaultStore = store;
}

/** 当前注入的全局默认存储后端（未注入为 undefined）。 */
export function getDefaultStore(): KeyValueStore | undefined {
  return defaultStore;
}

/** 撤销全局默认存储后端（测试用）。 */
export function clearDefaultStore(): void {
  defaultStore = undefined;
}

/**
 * 解析存储后端，优先级：
 * `config.store`（最高）> `setDefaultStore()` 注入的全局后端 > `storage` 模式对应的内置后端。
 *
 * @param mode   配置里的 `storage`（默认 `auto`）
 * @param custom 调用方在 `configure({ store })` 里传入的自定义 store
 */
export function resolveBackend(
  mode: StorageMode = 'auto',
  custom?: KeyValueStore,
): KeyValueStore | Promise<KeyValueStore> {
  if (custom) return custom;
  if (defaultStore) return defaultStore;
  if (mode === 'memory') return memoryBackend;
  if (mode === 'localStorage') return createLocalStorageStore() ?? memoryBackend;

  // auto：localStorage → 内存（Node/SSR 没有 localStorage）
  if (resolved) return resolved;
  resolved = createLocalStorageStore() ?? memoryBackend;
  return resolved;
}

/** Resets the cached backend — used by tests and after a `storage` config change. */
export function resetStorageBackend(): void {
  resolved = null;
}

export class TokenStore {
  constructor(
    private readonly backend: KeyValueStore,
    private readonly namespace: string,
  ) {}

  private key(name: string): string {
    return `eop:${this.namespace}:${name}`;
  }

  async readTokens<T>(): Promise<T | null> {
    let raw: string | null = null;
    try {
      raw = await this.backend.get(this.key('tokens'));
    } catch {
      // 自定义后端读失败不应让 App 启动即崩：当作没有 token，走重新登录。
      return null;
    }
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      // Corrupt payload: drop it rather than crashing the app on boot.
      await this.safeRemove();
      return null;
    }
  }

  async writeTokens(tokens: unknown): Promise<void> {
    try {
      await this.backend.set(this.key('tokens'), JSON.stringify(tokens));
    } catch {
      // 持久化失败不影响本次会话（内存里仍有 token），下次请求会自然重登。
    }
  }

  async clear(): Promise<void> {
    await this.safeRemove();
  }

  /** The backend actually in use, for diagnostics screens. */
  get backendName(): string {
    return this.backend.name;
  }

  private async safeRemove(): Promise<void> {
    try {
      await this.backend.remove(this.key('tokens'));
    } catch {
      /* ignore */
    }
  }
}
