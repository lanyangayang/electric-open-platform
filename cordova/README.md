# Cordova 接入说明

这是**同一套核心逻辑**的 Cordova 封装。业务代码（签名、OAuth、全部 29 个接口、错误码映射）
与 Capacitor 版完全共用 `src/core/`，区别只在「怎么发 HTTP 请求」和「怎么拿到全局对象」。

```
src/core/            ← 共用核心（Capacitor / Cordova 都从这里取）
src/index.ts         ← Capacitor 入口（import 使用）
cordova/src/         ← Cordova 入口（挂到 window / cordova.plugins）
cordova/www/         ← 构建产物（单文件，Cordova 直接注入）
cordova/plugin.xml   ← Cordova 插件清单
```

## 安装

```bash
# 从本地目录
cordova plugin add /path/to/cordova-mantunsci-electric/cordova

# 或从 Git（插件在仓库的 cordova/ 子目录）
cordova plugin add https://github.com/lanyangayang/cordova-mantunsci-electric.git#master:cordova
```

> 注意：Cordova 的 `plugin add` 需要目录下存在 `plugin.xml`。
> 本仓库根目录是 Capacitor 包，Cordova 插件在 `cordova/` 子目录。

安装后 `cordova prepare` 会：
- 把 `www/electric-open-platform.js` 注入到 App；
- 编译 `src/android/*.java` 到你的 Android 工程；
- 添加 `INTERNET` / `ACCESS_NETWORK_STATE` 权限。

## 快速开始

### 1. 引入类型（TypeScript 项目）

```jsonc
// tsconfig.json
{
  "include": [
    "src/**/*.ts",
    "node_modules/cordova-plugin-mantunsci-electric/types/electric-open-platform.d.ts"
  ]
}
```

纯 JS 项目可跳过这一步。

### 2. 等待 deviceready

```js
document.addEventListener('deviceready', async () => {
  await ElectricOpenPlatform.configure({
    appKey: 'O000093290',
    appSecret: '你的 appSecret',      // 不要提交到仓库，见「安全」
    redirectUri: 'http://yourserverurl/receive',
    projectCode: 'P00000104893',
    storage: 'cordova',              // 用 SharedPreferences / UserDefaults
  });

  await ElectricOpenPlatform.login('yfdq01', '******');

  const boxes = await ElectricOpenPlatform.box.list();
  console.log(boxes);
});
```

`cordova.plugins.electricOpenPlatform` 与 `window.ElectricOpenPlatform` 是同一个对象。

### 3. Angular / Vue 项目

不用改写法，全局对象直接可用：

```ts
declare var ElectricOpenPlatform: any;   // 或用上面 d.ts 的类型

@Injectable({ providedIn: 'root' })
export class PowerApiService {
  private ready?: Promise<void>;

  private ensure(): Promise<void> {
    this.ready ??= ElectricOpenPlatform.configure({ /* ... */ });
    return this.ready;
  }

  async dashboard() {
    await this.ensure();
    const boxes = await ElectricOpenPlatform.box.listOnline();
    const live = await ElectricOpenPlatform.channel.realtimeChannels({
      mac: boxes.map((b) => b.mac),
    });
    return { boxes, live };
  }
}
```

## 与 Capacitor 版的能力对照

| 能力 | Capacitor 版 | Cordova 版 |
| --- | --- | --- |
| 全部业务接口 | ✅ | ✅ 完全一致 |
| OAuth / 签名 / 错误码 | ✅ | ✅ 同一份代码 |
| 网络传输 | `CapacitorHttp` | 原生 `HttpURLConnection` / `URLSession` |
| token 存储 | `@capacitor/preferences` | `SharedPreferences` / `UserDefaults` |
| 调用方式 | `import { ElectricOpenPlatform }` | `window.ElectricOpenPlatform` 全局 |
| 类型 | `.d.ts` 自动 | `cordova/types/*.d.ts` 手动引用 |

### 为什么要原生发请求

平台 `open.snd02.com` **不返回 CORS 头**。在 WebView 里用 `fetch`/XHR 调用会被同源策略拦截，
所以 Cordova 侧由原生层用 `HttpURLConnection`（Android）/ `URLSession`（iOS）直接请求，
与 Capacitor 的 `CapacitorHttp` 目的相同。

原生只做「收发」，签名与业务逻辑都在 JS，因此两种封装的返回值和错误完全一致。

## 传输实现如何选择

`configure()` 会自动判断宿主：

| 宿主 | 选用的传输 |
| --- | --- |
| 有 `cordova.exec` | `cordova-exec`（原生桥） |
| Capacitor 原生 | `capacitor-http` |
| 浏览器 / Node | `fetch` |

也可以强制指定：

```js
await ElectricOpenPlatform.configure({
  /* ... */
  transport: {
    name: 'my-proxy',
    postForm: (req) => fetch('/api/proxy', { method: 'POST', body: req.body }).then(/* ... */),
  },
});
```

排查时看 `ElectricOpenPlatform.describe()` 里的 `host` 与 `transport` 字段。

## 安全

1. **不要硬编码 appSecret**。Cordova 没有构建期环境变量，建议：
   - 从自己的后端在运行时下发；或
   - 用 `cordova-plugin-...` 的配置读取；或
   - 至少确保 `www/` 的构建产物不提交到仓库。
2. 已打包进 App 的密钥**无法真正保密**。若威胁模型要求保密，
   应让自建后端代持密钥并转发签名请求（可用 `transport` 切到自家代理）。
3. token 存在 `SharedPreferences` / `UserDefaults`。需要更高安全级别时，
   可把 `TokenStorage.java` 换成 `EncryptedSharedPreferences`，接口不变。
4. 控制类接口（分合闸）会真实操作现场设备，务必二次确认。

## 自行构建 Cordova 产物

修改 `src/` 后需要重新生成 `cordova/www/electric-open-platform.js`：

```bash
npm install
npm run build:cordova
```

产物是自包含的单文件 IIFE（约 78 KB），不依赖任何打包器或模块系统。

## 平台支持情况

| 平台 | 状态 |
| --- | --- |
| Android | ✅ 已实现（`HttpURLConnection` + `SharedPreferences`） |
| iOS | ✅ 已实现（`URLSession` + `UserDefaults`），需 Cordova iOS ≥ 6 |
| Browser | ⚠️ 调试用；受 CORS 限制，需代理 |

## 已验证

- 单元测试 104 项全部通过（含 Cordova 传输、存储、传输选择优先级）
- **真实平台联调**：用模拟的 `cordova.exec` 桥跑完整链路
  （登录 → 项目 → 设备 → 实时线路 → 统计 → 刷新 token），全部成功
- 复现：`node scripts/verify-cordova-transport.mjs`（需 `EOP_*` 环境变量）

未在真机验证的部分：Android/iOS 原生侧的编译与运行（需要你的工程执行 `cordova build`）。
