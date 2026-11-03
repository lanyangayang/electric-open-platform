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
export declare function resolveBackend(mode?: StorageMode): Promise<KeyValueBackend>;
/** Resets the cached backend — used by tests and after a `storage` config change. */
export declare function resetStorageBackend(): void;
export declare class TokenStore {
    private readonly backend;
    private readonly namespace;
    constructor(backend: KeyValueBackend, namespace: string);
    private key;
    readTokens<T>(): Promise<T | null>;
    writeTokens(tokens: unknown): Promise<void>;
    clear(): Promise<void>;
    /** The backend actually in use, for diagnostics screens. */
    get backendName(): string;
}
export {};
