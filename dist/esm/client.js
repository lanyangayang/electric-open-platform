/**
 * The SDK facade.
 *
 * Everything is composed here so the public surface stays a single object:
 *
 * ```ts
 * import { ElectricOpenPlatform } from '@wdywdy/electric-open-platform';
 *
 * await ElectricOpenPlatform.configure({ appKey, appSecret, redirectUri, projectCode });
 * await ElectricOpenPlatform.login('yfdq01', '******');
 * const boxes = await ElectricOpenPlatform.box.list();
 * ```
 */
import { AlarmApi, BoxApi, ChannelApi, ControlApi, ProjectApi, SceneApi, StatsApi, ThirdPartyDeviceApi, } from './core/api.js';
import { AuthManager } from './core/auth.js';
import { currentTransport, currentTransportName, hasExplicitTransport, resolveTransport, setTransport, } from './core/http.js';
import { PushApi } from './core/push.js';
import { detectRuntime } from './core/runtime.js';
import { RouterClient } from './core/router.js';
import { resolveBackend, TokenStore } from './core/storage.js';
export class ElectricOpenPlatformClient {
    constructor() {
        this.credentials = {};
    }
    /**
     * Configures the SDK. Safe to call again (e.g. after the user switches
     * project) — previous timers are released and tokens for the old `appKey` are
     * left untouched on disk.
     */
    async configure(config) {
        assertConfig(config);
        this.dispose();
        this.config = config;
        this.credentials = { username: config.username, password: config.password };
        // 存储：config.store（自定义后端，最高）> config.storage 指定的内置后端
        const backend = await resolveBackend(config.storage ?? 'auto', config.store);
        this.backend = backend;
        const store = new TokenStore(backend, config.appKey);
        const auth = new AuthManager(store, config);
        const router = new RouterClient(config, auth, () => this.credentials);
        // 传输：config.transport（最高）> 调用方 setTransport 注入的实现 > 内置 fetch
        setTransport(resolveTransport(config.transport, hasExplicitTransport() ? currentTransport() : undefined));
        this.auth = auth;
        this.router = router;
        this.project = new ProjectApi(router);
        this.box = new BoxApi(router);
        this.channel = new ChannelApi(router);
        this.control = new ControlApi(router);
        this.alarm = new AlarmApi(router);
        this.stats = new StatsApi(router);
        this.scene = new SceneApi(router);
        this.push = new PushApi(router);
        this.thirdparty = new ThirdPartyDeviceApi(router);
        await auth.restore();
    }
    /** True once `configure()` succeeded. */
    get isConfigured() {
        return !!this.router;
    }
    /** Where tokens are persisted — useful on a diagnostics screen. */
    async storageBackend() {
        return this.backend?.name ?? 'none';
    }
    // --------------------------------------------------------------------- auth
    /** Headless login with the platform account (POST /oauth/authverify2.as). */
    async login(username, password) {
        const auth = this.requireAuth();
        this.credentials = { username, password };
        const code = await auth.fetchCode({ username, password });
        const tokens = await auth.exchangeCode(code);
        return { success: true, code, expiresIn: secondsUntil(tokens.expiresAt), expiresAt: tokens.expiresAt };
    }
    /** Redirect-flow: the URL to open in a browser for the platform's login page. */
    getAuthorizeUrl(options = {}) {
        return this.requireAuth().getAuthorizeUrl(options);
    }
    /**
     * Redirect-flow step 2: pass the full redirect URL (or the bare code) received
     * by your `redirectUri` endpoint.
     */
    async handleRedirect(urlOrCode) {
        const auth = this.requireAuth();
        const code = AuthManager.extractCode(urlOrCode) ?? urlOrCode;
        return auth.exchangeCode(code);
    }
    /** Renews the token now instead of waiting for the timer. */
    async refreshToken() {
        return this.requireAuth().refresh();
    }
    get currentToken() {
        return this.auth?.current ?? null;
    }
    async logout() {
        this.credentials = {};
        this.config = this.config ? { ...this.config, username: undefined, password: undefined } : this.config;
        await this.auth?.logout();
    }
    /**
     * Escape hatch for platform methods that are not (yet) wrapped, e.g. new
     * `GET_*` endpoints added after this release. Signs, retries and unwraps for
     * you, so prefer it over hand-rolling `fetch`.
     */
    async invoke(method, params = {}) {
        return this.requireRouter().call(method, { params });
    }
    /** Current configuration with the secret masked. */
    describe() {
        const c = this.config;
        if (!c)
            return { configured: false };
        return {
            configured: true,
            appKey: c.appKey,
            appSecret: c.appSecret ? `****${c.appSecret.slice(-4)}` : '',
            redirectUri: c.redirectUri,
            baseUrl: c.baseUrl ?? 'https://open.snd02.com',
            projectCode: c.projectCode,
            storage: c.storage ?? 'auto',
            /** 实际生效的存储后端名（内置 memory/localStorage，或自定义 store 的 name） */
            storageBackend: this.backend?.name ?? 'none',
            /** 运行宿主：node / browser / unknown（仅诊断用，不参与能力选择） */
            runtime: detectRuntime(),
            /** 实际生效的网络传输实现 */
            transport: currentTransportName(),
            token: this.auth?.current
                ? { ...this.auth.current, accessToken: mask(this.auth.current.accessToken) }
                : null,
        };
    }
    /** Releases timers; call from `ngOnDestroy` / `useEffect` cleanup. */
    dispose() {
        this.auth?.dispose();
        this.auth = undefined;
        this.router = undefined;
    }
    requireAuth() {
        if (!this.auth)
            throw new Error('SDK 尚未初始化，请先调用 configure({ appKey, appSecret, redirectUri })');
        return this.auth;
    }
    requireRouter() {
        if (!this.router)
            throw new Error('SDK 尚未初始化，请先调用 configure()');
        return this.router;
    }
}
function assertConfig(config) {
    const missing = [];
    if (!config.appKey)
        missing.push('appKey');
    if (!config.appSecret)
        missing.push('appSecret');
    if (!config.redirectUri)
        missing.push('redirectUri');
    if (missing.length)
        throw new Error(`缺少必填配置：${missing.join(', ')}`);
    if (config.redirectUri && !/^https?:\/\//i.test(config.redirectUri)) {
        throw new Error('redirectUri 必须是 http(s) 绝对地址（会参与签名，需与平台登记一致）');
    }
}
function secondsUntil(epochMs) {
    return Math.max(0, Math.round((epochMs - Date.now()) / 1000));
}
function mask(token) {
    return token.length <= 8 ? '****' : `${token.slice(0, 6)}…${token.slice(-4)}`;
}
/** Default singleton instance. Also exported as the named `ElectricOpenPlatform`. */
export const ElectricOpenPlatform = new ElectricOpenPlatformClient();
//# sourceMappingURL=client.js.map