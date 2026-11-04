const memory = new Map();
/** 内存后端：进程内共享，适合测试与一次性脚本。 */
export function createMemoryStore() {
    return {
        name: 'memory',
        async get(key) {
            return memory.has(key) ? memory.get(key) : null;
        },
        async set(key, value) {
            memory.set(key, value);
        },
        async remove(key) {
            memory.delete(key);
        },
    };
}
export const memoryBackend = createMemoryStore();
/** 探活 localStorage：隐私模式/服务端渲染下读写都会抛错，此时返回 null。 */
export function createLocalStorageStore() {
    try {
        if (typeof globalThis.localStorage === 'undefined')
            return null;
        const probe = '__eop_probe__';
        globalThis.localStorage.setItem(probe, '1');
        globalThis.localStorage.removeItem(probe);
    }
    catch {
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
let resolved = null;
let defaultStore;
/**
 * 注入全局默认存储后端（如 iOS `UserDefaults` / Android `SharedPreferences`）。
 *
 * 与 `setTransport()` 对称：宿主应用在 bootstrap 阶段调用一次，之后所有
 * `configure()` 都会用它，业务代码（组件、页面、共享模块）**不需要知道宿主是什么**。
 * 传了 `config.store` 时以 `config.store` 为准。
 */
export function setDefaultStore(store) {
    defaultStore = store;
}
/** 当前注入的全局默认存储后端（未注入为 undefined）。 */
export function getDefaultStore() {
    return defaultStore;
}
/** 撤销全局默认存储后端（测试用）。 */
export function clearDefaultStore() {
    defaultStore = undefined;
}
/**
 * 解析存储后端，优先级：
 * `config.store`（最高）> `setDefaultStore()` 注入的全局后端 > `storage` 模式对应的内置后端。
 *
 * @param mode   配置里的 `storage`（默认 `auto`）
 * @param custom 调用方在 `configure({ store })` 里传入的自定义 store
 */
export function resolveBackend(mode = 'auto', custom) {
    if (custom)
        return custom;
    if (defaultStore)
        return defaultStore;
    if (mode === 'memory')
        return memoryBackend;
    if (mode === 'localStorage')
        return createLocalStorageStore() ?? memoryBackend;
    // auto：localStorage → 内存（Node/SSR 没有 localStorage）
    if (resolved)
        return resolved;
    resolved = createLocalStorageStore() ?? memoryBackend;
    return resolved;
}
/** Resets the cached backend — used by tests and after a `storage` config change. */
export function resetStorageBackend() {
    resolved = null;
}
export class TokenStore {
    constructor(backend, namespace) {
        this.backend = backend;
        this.namespace = namespace;
    }
    key(name) {
        return `eop:${this.namespace}:${name}`;
    }
    async readTokens() {
        let raw = null;
        try {
            raw = await this.backend.get(this.key('tokens'));
        }
        catch {
            // 自定义后端读失败不应让 App 启动即崩：当作没有 token，走重新登录。
            return null;
        }
        if (!raw)
            return null;
        try {
            return JSON.parse(raw);
        }
        catch {
            // Corrupt payload: drop it rather than crashing the app on boot.
            await this.safeRemove();
            return null;
        }
    }
    async writeTokens(tokens) {
        try {
            await this.backend.set(this.key('tokens'), JSON.stringify(tokens));
        }
        catch {
            // 持久化失败不影响本次会话（内存里仍有 token），下次请求会自然重登。
        }
    }
    async clear() {
        await this.safeRemove();
    }
    /** The backend actually in use, for diagnostics screens. */
    get backendName() {
        return this.backend.name;
    }
    async safeRemove() {
        try {
            await this.backend.remove(this.key('tokens'));
        }
        catch {
            /* ignore */
        }
    }
}
//# sourceMappingURL=storage.js.map