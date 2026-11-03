/**
 * Token / config persistence.
 *
 * The platform's own guidance is to keep one "central controller" that owns the
 * access token. On a Capacitor app the device *is* that controller, so tokens are
 * persisted across app restarts and renewed with the refresh token.
 *
 * Ordering preference: Cordova 原生存储（SharedPreferences / UserDefaults）→
 * `@capacitor/preferences`（native shared prefs / user defaults，works on web too）
 * → `localStorage` → in-memory. Both native backends are optional, so a bare
 * install without either plugin still works.
 */
import { StorageMode } from './types.js';

interface KeyValueBackend {
  /** `cordova-preferences` 是 cordova 模式下的具体实现名。 */
  readonly name: StorageMode | 'cordova-preferences' | 'none';
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

const memory = new Map<string, string>();

const memoryBackend: KeyValueBackend = {
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

function localStorageBackend(): KeyValueBackend | null {
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

/** Lazily resolved so that `@capacitor/preferences` stays a true optional peer. */
async function preferencesBackend(): Promise<KeyValueBackend | null> {
  try {
    const mod = await import('@capacitor/preferences');
    const { Preferences } = mod as typeof import('@capacitor/preferences');
    await Preferences.get({ key: '__eop_probe__' });
    return {
      name: 'preferences',
      async get(key) {
        const { value } = await Preferences.get({ key });
        return value ?? null;
      },
      async set(key, value) {
        await Preferences.set({ key, value });
      },
      async remove(key) {
        await Preferences.remove({ key });
      },
    };
  } catch {
    return null;
  }
}

/**
 * Cordova 原生存储（Android SharedPreferences / iOS UserDefaults）。
 *
 * 由插件原生部分提供 `storageGet` / `storageSet` / `storageRemove` 三个动作。
 * 找不到原生桥时返回 null，调用方退回 localStorage。
 */
async function cordovaBackend(): Promise<KeyValueBackend | null> {
  const g = globalThis as unknown as {
    cordova?: {
      exec?: (
        ok: (d: unknown) => void,
        fail: (e: unknown) => void,
        service: string,
        action: string,
        args: unknown[],
      ) => void;
    };
  };
  const exec = g.cordova?.exec;
  if (typeof exec !== 'function') return null;

  const call = (action: string, args: unknown[]): Promise<unknown> =>
    new Promise((resolve, reject) => {
      try {
        exec(resolve, reject, 'ElectricOpenPlatform', action, args);
      } catch (err) {
        reject(err);
      }
    });

  try {
    // 探活：能取到（哪怕 null）就说明原生动作存在
    await call('storageGet', [{ key: '__eop_probe__' }]);
  } catch {
    return null;
  }

  return {
    name: 'cordova-preferences',
    async get(key) {
      const res = (await call('storageGet', [{ key }])) as { value?: string | null } | string | null;
      if (res && typeof res === 'object' && 'value' in res) return res.value ?? null;
      return typeof res === 'string' ? res : null;
    },
    async set(key, value) {
      await call('storageSet', [{ key, value }]);
    },
    async remove(key) {
      await call('storageRemove', [{ key }]);
    },
  };
}

let resolved: KeyValueBackend | null = null;

export async function resolveBackend(mode: StorageMode = 'auto'): Promise<KeyValueBackend> {
  if (mode === 'memory') return memoryBackend;
  if (mode === 'localStorage') return localStorageBackend() ?? memoryBackend;
  if (mode === 'preferences') return (await preferencesBackend()) ?? memoryBackend;
  if (mode === 'cordova') return (await cordovaBackend()) ?? localStorageBackend() ?? memoryBackend;

  if (resolved) return resolved;
  // auto：Cordova 原生存储 → Capacitor Preferences → localStorage → 内存
  resolved =
    (await cordovaBackend()) ??
    (await preferencesBackend()) ??
    localStorageBackend() ??
    memoryBackend;
  return resolved;
}

/** Resets the cached backend — used by tests and after a `storage` config change. */
export function resetStorageBackend(): void {
  resolved = null;
}

export class TokenStore {
  constructor(
    private readonly backend: KeyValueBackend,
    private readonly namespace: string,
  ) {}

  private key(name: string): string {
    return `eop:${this.namespace}:${name}`;
  }

  async readTokens<T>(): Promise<T | null> {
    const raw = await this.backend.get(this.key('tokens'));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      // Corrupt payload: drop it rather than crashing the app on boot.
      await this.backend.remove(this.key('tokens'));
      return null;
    }
  }

  async writeTokens(tokens: unknown): Promise<void> {
    await this.backend.set(this.key('tokens'), JSON.stringify(tokens));
  }

  async clear(): Promise<void> {
    await this.backend.remove(this.key('tokens'));
  }

  /** The backend actually in use, for diagnostics screens. */
  get backendName(): string {
    return this.backend.name;
  }
}
