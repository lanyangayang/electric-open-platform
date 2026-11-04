# @wdywdy/electric-open-platform

面向 **智慧式用电数据开放平台**（Mtsci Open Platform，`open.snd02.com`）的纯 TypeScript SDK。

**零运行时依赖** —— 不依赖 Capacitor、Cordova，也不含任何原生工程。`npm install` 之后，
在 Node 后端、Electron、浏览器（配代理）、任意前端框架里都能直接 `import`。

- **OAuth2 全流程**：headless 登录（`authverify2.as`）与重定向登录两种授权方式，
  `accessToken` / `refreshToken` 自动维护与提前续期，并发请求只刷新一次。
- **签名自动完成**：按平台规范对参数名排序、拼接参数值、追加 `appSecret` 做 MD5，
  业务代码无需关心。
- **类型完整**：全部枚举、字段（含 `aTUp` / `mxgl` 这类线上原始字段名）与 `.d.ts` 声明。
- **错误可编排**：统一 `ElectricOpenPlatformError`，携带平台返回码，可判断「设备离线」
  「token 过期」「接口未开通」等。
- **可插拔**：网络传输（`Transport`）与 token 存储（`KeyValueStore`）都是接口，
  需要走原生网络栈、自建网关、Redis、文件时注入自己的实现即可。
- **已对真实平台联调验证**：见 [验证结果](#已验证行为)。

> ### 从 0.2.x 升级到 1.0.0
>
> | 项 | 0.2.x | 1.0.0 |
> | --- | --- | --- |
> | 包名 | `@mantunsci/cordova-electric-open-platform` | `@wdywdy/electric-open-platform` |
> | Capacitor / Cordova | 双形态，含原生工程与可选 peer 依赖 | **全部移除**，纯 JS/TS |
> | `storage: 'preferences' \| 'cordova'` | 内置平台存储 | 改为传 `store`（自定义实现）或 `'localStorage' \| 'memory'` |
> | `describe().host` | `cordova` / `capacitor-native` / `web` / `node` | `describe().runtime` → `node` / `browser` / `unknown` |
> | 传输选择 | 宿主探测自动装配三套实现 | 只认 `config.transport` / `setTransport()` / 内置 `fetch` |
> | 已删除的导出 | `createCapacitorTransport`、`createCordovaTransport`、`detectHost`、`CORDOVA_PLUGIN_ID` | 用 `Transport` 接口自行实现，见下文 |
>
> 原来的 Capacitor / Cordova 实现各约 70/120 行，迁移成本很低，本文给了现成片段。

---

## 安装

```bash
npm install @wdywdy/electric-open-platform
```

零依赖、无 peer 依赖、无需 `cap sync` / `cordova prepare`。要求 Node ≥ 18（需要全局 `fetch`），
或任何支持 ES2020 的浏览器/打包器。

## 快速开始

```ts
import { ElectricOpenPlatform } from '@wdywdy/electric-open-platform';

// 1) 配置（appSecret 不要写进源码，见「安全」）
await ElectricOpenPlatform.configure({
  appKey: 'O000093290',
  appSecret: process.env.EOP_APP_SECRET!,
  redirectUri: 'http://yourserverurl/receive',
  projectCode: 'P00000104893',
});

// 2) 登录（换取 accessToken，有效期 3600s，之后自动续期）
await ElectricOpenPlatform.login('yfdq01', '******');

// 3) 调用接口
const project = await ElectricOpenPlatform.project.getInfo();
const boxes = await ElectricOpenPlatform.box.listOnline();
const live = await ElectricOpenPlatform.channel.realtimeChannels({ mac: boxes.map((b) => b.mac) });

// 4) 控制（合闸/分闸，会真实作用于现场设备）
await ElectricOpenPlatform.control.switchCircuit({
  mac: boxes[0].mac,
  action: 'close',        // 'open' 合闸 | 'close' 分闸
  addr: 1,
  skipWhenAbnormalLock: true,
});
```

---

## 在任何环境里使用

包本身只做「签名 + 认证 + 解析」，网络出口默认是标准 `fetch`。**唯一需要留意的坑是 CORS**：
平台不返回 CORS 头，浏览器的同源策略会拦掉直连请求。

| 环境 | 能否直连 | 做法 |
| --- | --- | --- |
| Node 后端 / 定时任务 / 数据中台 | ✅ | 直接用，默认 `fetch` |
| Electron 主进程 | ✅ | 直接用 |
| Electron 渲染进程 | ⚠️ | 走 IPC 到主进程，或在主进程建一个 transport |
| 浏览器单页应用 | ❌ | `baseUrl` 指向你自己的反向代理 / 后端中转 |
| Capacitor / Cordova / 小程序等有原生网络的容器 | ⚠️ | 注入一个走原生网络的 `transport`（10 行） |

### 浏览器：用反向代理（推荐）

```nginx
# nginx：把 /eop/ 转发到平台，浏览器只请求自己的域名
location /eop/ {
    proxy_pass https://open.snd02.com/;
    proxy_set_header Host open.snd02.com;
}
```

```ts
await ElectricOpenPlatform.configure({
  // ...
  baseUrl: 'https://your-site.com/eop',   // 只改这一行
});
```

> `redirectUri` 参与签名，必须与平台登记的地址完全一致 —— **不要**因为走代理就顺手改它。

### 注入自己的传输实现

`Transport` 只有两个成员：`name` 和 `postForm()`。任何能发 POST 的通道都可以接进来。

```ts
import type { Transport } from '@wdywdy/electric-open-platform';

// 例：在 Electron 主进程里用 Node 的 http 模块（绕过渲染进程的 CORS）
const viaMainProcess: Transport = {
  name: 'electron-ipc',
  async postForm(req) {
    return globalThis.electronBridge.request({
      url: req.url,
      body: req.body,
      headers: req.headers,
      timeoutMs: req.timeoutMs,
    });
  },
};

await ElectricOpenPlatform.configure({ ...cfg, transport: viaMainProcess });
```

原来的 Capacitor 实现等价写法（在 Capacitor App 里用 `CapacitorHttp`）：

```ts
import { CapacitorHttp } from '@capacitor/core';
import { parseBody, type Transport } from '@wdywdy/electric-open-platform';

const capacitorHttp: Transport = {
  name: 'capacitor-http',
  async postForm(req) {
    const res = await CapacitorHttp.post({
      url: req.url,
      headers: req.headers ?? {},
      data: req.body,
      responseType: 'text',
      connectTimeout: req.timeoutMs,
      readTimeout: req.timeoutMs,
    });
    const raw = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
    return { status: res.status, data: parseBody(raw), raw };
  },
};

await ElectricOpenPlatform.configure({ ...cfg, transport: capacitorHttp });
```

Cordova 工程同理：把 `cordova.exec` 包一层 `postForm()` 即可，不再需要本包提供原生工程。

### 注入自己的存储实现

默认 `auto` 是 `localStorage → 内存`。想持久化到文件、Redis、数据库，或容器提供的原生偏好：

```ts
import { readFile, writeFile, rm } from 'node:fs/promises';
import type { KeyValueStore } from '@wdywdy/electric-open-platform';

const fileStore: KeyValueStore = {
  name: 'file',
  async get(key) {
    try { return await readFile(`./.eop/${key}`, 'utf8'); } catch { return null; }
  },
  async set(key, value) {
    await import('node:fs/promises').then((fs) => fs.mkdir('./.eop', { recursive: true }));
    await writeFile(`./.eop/${key}`, value, 'utf8');
  },
  async remove(key) {
    await rm(`./.eop/${key}`, { force: true });
  },
};

await ElectricOpenPlatform.configure({ ...cfg, store: fileStore });
```

`store` 的读写失败不会让进程崩溃：读失败当作「没有 token」，写失败只影响本次持久化
（内存里的 token 仍然可用）。

### 包里带的两个现成后端

```ts
import { createMemoryStore, createLocalStorageStore } from '@wdywdy/electric-open-platform';

createMemoryStore();        // 进程内 Map，适合测试/一次性脚本
createLocalStorageStore();  // 探活失败（隐私模式、SSR）时返回 null
```

---

## 网络传输与诊断

传输实现的选择顺序**只有三条**，不存在「按宿主猜」：

| 优先级 | 来源 | 说明 |
| --- | --- | --- |
| 1 | `configure({ transport })` | 最高，已知宿主时推荐显式指定 |
| 2 | `configure()` 之前 `setTransport()` | 调用方提前注入，不会被覆盖 |
| 3 | 内置 `fetch` | 默认实现 |

```ts
import { currentTransportName, detectRuntime, hasGlobalFetch } from '@wdywdy/electric-open-platform';

currentTransportName();   // 'fetch' / 你注入的名字
detectRuntime();          // 'node' | 'browser' | 'unknown'（仅诊断）
hasGlobalFetch();         // 当前运行时有没有全局 fetch
ElectricOpenPlatform.describe();
// → { configured, appKey, appSecret:'****xxxx', redirectUri, baseUrl, projectCode,
//     storage:'auto', storageBackend:'memory', runtime:'node', transport:'fetch', token:{…} }
```

`describe()` 里的密钥已脱敏，可以直接打印到诊断页。

## 认证

### 方式一：headless 登录（推荐给服务端 / 可信客户端）

```ts
const result = await ElectricOpenPlatform.login(username, password);
// → { success, code, expiresIn, expiresAt }
```

内部依次调用 `POST /oauth/authverify2.as`（取 code）与 `POST /oauth/token.as`（换 token）。

### 方式二：浏览器重定向登录

```ts
// 打开该 URL 让用户登录，平台会带回 ?code=
const url = ElectricOpenPlatform.getAuthorizeUrl({ state: 'csrf-1' });

// 你的 redirectUri 收到回调后
await ElectricOpenPlatform.handleRedirect('http://yourserverurl/receive?code=xxxx');
```

### token 生命周期

| 事项 | 行为 |
| --- | --- |
| 有效期 | 平台返回 `expiresIn`（当前 3600s） |
| 提前续期 | 默认提前 60s 用 `refreshToken` 刷新（`tokenRefreshSkewMs` 可调） |
| 接口返回 `code:"2"` | 自动刷新一次并重放原请求，对调用方透明 |
| refresh 也失效 | 若配置了账号密码则自动重登；否则抛 `E_NOT_CONFIGURED` |
| 并发 | 同一时刻只有一个刷新请求在飞，其余等待复用 |
| 持久化 | `store`（自定义）→ `localStorage` → 内存 |

## API 一览

所有分组都挂在 `ElectricOpenPlatform` 上。

### `project`
| 方法 | 平台接口 |
| --- | --- |
| `getInfo()` | `GET_PROJECT_INFO` |
| `modifyInfo(fields)` | `MODIFY_PROJECT_INFO` |
| `dayStats({year,month,day?})` | `GET_PROJECT_DAY_STATS` |

### `box`
| 方法 | 平台接口 |
| --- | --- |
| `list({equipmentType?,build?,unit?,room?})` | `GET_BOXES` |
| `listOnline()` | `GET_BOXES` + 本地过滤 `online === 1` |
| `get(mac)` | `GET_BOX` |
| `positionTree()` | `GET_BOX_POSITION_TREE` |
| `properties({mac,nodeType?,addr?})` | `GET_BOX_PROPERTIES` |
| `modifyProperties({mac,params})` | `MODIFY_BOX_PROPERTIES` |
| `modifyInfo({mac,...fields})` | `MODIFY_BOX_INFO` |
| `setRealtimeRate({mac,enable,rate})` | `SET_BOX_REALTIME_RATE` |
| `onlineHistory({mac,startTime,endTime})` | `GET_BOX_ONLINE_HISTORY` |

### `channel`
| 方法 | 平台接口 |
| --- | --- |
| `realtime({mac})` | `GET_BOX_CHANNELS_REALTIME`（≤20 台，自动归一化返回结构） |
| `realtimeChannels({mac})` | 同上，拍平为带 `mac` 的线路数组 |
| `list({mac\|param})` | `GET_BOX_CHANNELS` |
| `channelsOc({mac})` | `GET_BOX_CHANNELS_OC` |
| `history({mac,date,addr?})` | `GET_BOX_CHANNELS_REALTIME_HISTORY`（**仅按天**，`date` 格式 `yyyy-MM-dd`） |

### `control`
| 方法 | 命令 |
| --- | --- |
| `switchCircuit({mac,action,addr})` | `OCSWITCH` |
| `batchSwitch({items,action})` | `BATCH_BOX_CONTROL` |
| `updateCircuit({mac,addr,title,maxPowerW})` | `SWITCHSET` |
| `remoteLock({mac,addr,locked})` | `REMOTE_SWITCH_LOCK` |
| `unlockAbnormal({mac,addr})` | `ABNORMAL_SWITCH_UNLOCK` |
| `setVisibility` / `setControl` | `SETVISIBILITY` / `SETCONTROL` |
| `setAutoLeakage({enable,day,hour,minute})` | `SETAUTOLEAK` |
| `getTimers({mac})` / `getLeakageCheck({mac})` | `GET_CFG_TIMER` / `GET_CFG_LKICHK` |
| `control({mac,cmd,options})` | `PUT_BOX_CONTROL`（任意命令，类型安全） |

### `alarm`
| 方法 | 说明 |
| --- | --- |
| `list({start,end,mac?,page?})` | `GET_BOX_ALARM`，返回 `{total,page,totalPage,datas}` |
| `listAll(opts)` | 自动翻页 |
| `byType({...,typeNumbers})` | 本地按告警类型过滤（配合 `AlarmType` 枚举） |
| `maintenance({alarmId})` | `GET_ALARM_MAINTENANCE`（支持数组，最多 20 个） |
| `urged({mac,alarmId})` | `ALARM_URGED`（`mac` 为**必填**） |
| `boxMaintenanceHistory({mac?,start,end})` | `GET_BOX_MAINTENANCE_HISTORY`（`start`/`end` 必填，`pageSize` ≤100） |

### `stats`
`day()` / `hour()` / `month()` 对应 **`GET_BOXES_DAY_STATS`** / `_HOUR_` / `_MON_STATS`，
另有 `totalElectricity(rows)` 帮你从 `addr=0` 那一行取设备总电量。

> ⚠️ 方法名是 `GET_BOXES_*`（BOX + **ES**），不是 `GET_BOXS_*`。
> 少一个 E 时平台返回「接口名称(X)无效！」，很容易被误判成「接口未开通」。已修正并加回归测试。

### `thirdparty` — 第三方设备
烟感 / 燃气 / 水表 / 温湿度 / 光照等（`equipmentType ≠ 1/2`）走独立接口：

| 方法 | 平台接口 |
| --- | --- |
| `status({mac,equipmentType,dataType?,startDate?,endDate?})` | `GET_THR_DEVICE_STATUS` |
| `statusParsed(...)` | 同上，并把 `data` 的 JSON 字符串解析成对象 |
| `listDevices({equipmentType})` | `GET_BOXES` 按类型过滤 |

```ts
import { ThirdPartyEquipmentType, MeterQueryType } from '@wdywdy/electric-open-platform';

// 感烟
const rows = await ElectricOpenPlatform.thirdparty.statusParsed({
  mac: '866971033551412',
  equipmentType: ThirdPartyEquipmentType.SmokeForSafe, // 6
});
// rows[0] = { devType:'FS3031', msgType:'BatVol', data:{ BatLow:0, Voltage:'2.78' }, mac:'…' }

// 智能水表必须指定 dataType
await ElectricOpenPlatform.thirdparty.status({
  mac: 'W1',
  equipmentType: ThirdPartyEquipmentType.SmartWaterMeter, // 16
  dataType: MeterQueryType.Range,
  startDate: '2026-11-01',
  endDate: '2026-11-02',
});
```

平台约束（SDK 已内置校验）：
- `equipmentType` 传 1（微断）或 2（电气火灾）会被拒绝 → 改用 `channel.realtime()`
- 智能水表(16) 必须带 `dataType`；`dataType=1` 时必须带 `startDate`/`endDate`

### `scene` / `push`
`scene.list()` / `scene.execute()`；`push.query/subscribe/unsubscribe/failedCheck/failedReset`，
并导出 `verifyPushKey()` 供你的后端校验平台推送的 `key`。

### 逃生舱
```ts
// 平台新增接口、SDK 还没包时直接用：
const data = await ElectricOpenPlatform.invoke<MyType>('NEW_METHOD', { foo: 'bar' });
```
同样自动签名、自动续期、自动解包。

## 错误处理

```ts
import { ElectricOpenPlatformError, PlatformCodes, TransportCodes } from '@wdywdy/electric-open-platform';

try {
  await ElectricOpenPlatform.control.switchCircuit({ mac, action: 'open', addr: 1 });
} catch (err) {
  if (err instanceof ElectricOpenPlatformError) {
    switch (err.code) {
      case PlatformCodes.BOX_OFFLINE:            // '1001'
        return showToast('设备不在线');
      case PlatformCodes.REMOTE_CONTROL_FORBIDDEN: // '1004'
        return showToast('该线路不允许远程控制');
      case TransportCodes.NOT_PROVISIONED:
        return showToast('该接口未开通，请联系平台商务');
      case TransportCodes.NETWORK:
        return showToast('网络异常，请稍后重试');
      default:
        return showToast(err.message);          // 已含平台中文提示
    }
  }
  throw err;
}
```

`err` 上还有 `isTokenExpired`、`isRetryable`、`method`、`details`、`toJSON()`。

## 安全

1. **`appSecret` 只应存在于服务端**。它参与 MD5 签名，放进浏览器/前端包等于公开。
   推荐架构：前端 → 你自己的后端（持有 secret，用本 SDK 签名并转发）→ 平台。
2. **token 存储**：默认 `localStorage`（浏览器）或内存（Node）。需要更强保护时传自定义
   `store`（如加密文件、系统密钥链、Redis）。`store` 只负责存取字符串，加密策略由你决定。
3. **控制类接口**（`PUT_BOX_CONTROL` 等）会真实操作现场设备，务必加二次确认。
4. SDK **从不**把 `accessToken` / `appSecret` 写进日志；`logger` 回调里已做脱敏。

## 已验证行为

以下结论来自对真实平台（`projectCode=P00000104893`）的联调，不是纸面推导：

| 接口 | 结果 |
| --- | --- |
| `GET_PROJECT_INFO` | ✅ 佛山市毅丰电器实业有限公司（AUDITED） |
| `GET_PROJECT_DAY_STATS` | ✅ |
| `GET_BOXES` | ✅ 11 台设备，在线 2 台 |
| `GET_BOX_POSITION_TREE` | ✅ 2 个顶层层级 |
| `GET_BOX_CHANNELS_REALTIME` | ✅ → 线路实时电压/电流/温度/漏电 |
| `GET_BOX_CHANNELS` / `_OC` | ✅ 28 个有效节点 |
| `GET_BOX_CHANNELS_REALTIME_HISTORY` | ✅ 88 条（参数是 `date`，**不是**区间） |
| `GET_BOX_ALARM` | ✅ 近 24h 数十条告警 |
| `GET_BOX_PROPERTIES` | ✅（**必须**带 `nodeType=COMM`） |
| `GET_BOX_ONLINE_HISTORY` | ✅（参数是 `startTime`/`endTime`，**不是** `start`/`end`） |
| `GET_BOX_MAINTENANCE_HISTORY` | ✅（`start`/`end` 必填） |
| `GET_CFG_TIMER` / `GET_CFG_LKICHK` | ✅ |
| `SCENE_SERVICE` / `SUBSCRIBE_PUSH_SERVICE` | ✅ |
| `GET_THR_DEVICE_STATUS` | ✅（按 `equipmentType` 调用，本项目无第三方设备故返回空） |
| `GET_BOXES_DAY_STATS` / `_HOUR_STATS` / `_MON_STATS` | ✅ 均返回真实数据 |
| `oauth/refresh.as` | ✅ 刷新后再次调用正常 |

**当前 appKey 唯一未开通的接口：`GET_BOX`**。已用对照实验确认（`GET_BOXES` 同一签名算法成功、
`GET_BOX` 换三组参数均失败、故意破坏签名会得到同样文案），属于接口级未授权，
不是 SDK 实现或签名问题。需要时请联系平台商务开通。

### 接口命名陷阱（务必注意）

| 现象 | 真实原因 |
| --- | --- |
| `接口名称(X)无效！` | 方法名写错 **或** 该 appKey 未开通 |
| `无效的接口方法参数签名！` | 既可能是签名错，**也可能是接口未开通**——平台复用同一文案 |

典型踩坑：把 `GET_BOXES_DAY_STATS` 写成 `GET_BOXS_DAY_STATS`（少一个 `E`），
返回 `接口名称(GET_BOXS_DAY_STATS)无效！`，极易误判为“未开通”而放弃接入。
SDK 已按文档修正，并有回归测试锁定三个统计接口的方法名。

复现验证：

```bash
npm run build
# 先设置 EOP_* 环境变量，见 scripts/verify-live.mjs 顶部注释
node scripts/verify-live.mjs       # 端到端 16 项检查
node scripts/verify-all-apis.mjs   # 全量接口逐个调用（20/21 通过，GET_BOX 未开通）
node scripts/diff-api-coverage.cjs # 文档 vs 实现 覆盖率对照（应为「未封装: 0 个」）
node scripts/diagnose-getbox.mjs   # 对照实验：证明 GET_BOX 是未开通而非签名错
```

## 本地调试

```bash
npm install
npm test          # 99 个单测：MD5 向量、签名样例、token 生命周期、接口参数、
                  # 传输/存储注入优先级，以及「不得再出现 Capacitor/Cordova」的防回潮守卫
npm run build     # 产出 dist/esm（ESM）+ dist/cjs（CJS）+ 完整 .d.ts
npm run demo      # 打开 http://localhost:5178 调试台
```

> 浏览器里直接跑会被 **CORS** 拦截（平台不返回 CORS 头）。调试台用来看 UI 与错误路径；
> 真实请求请配反向代理，或在 Node 里跑。

## 接入示例

### Node 后端（最贴合本包的用法）

```ts
// server.mjs —— Node ≥ 18，无需任何额外依赖
import { ElectricOpenPlatform } from '@wdywdy/electric-open-platform';

await ElectricOpenPlatform.configure({
  appKey: process.env.EOP_APP_KEY!,
  appSecret: process.env.EOP_APP_SECRET!,
  redirectUri: process.env.EOP_REDIRECT_URI!,
  projectCode: process.env.EOP_PROJECT_CODE,
  username: process.env.EOP_USERNAME,
  password: process.env.EOP_PASSWORD,
  storage: 'memory',
});

export async function dashboard() {
  const boxes = await ElectricOpenPlatform.box.listOnline();
  const live = await ElectricOpenPlatform.channel.realtimeChannels({ mac: boxes.map((b) => b.mac) });
  return { boxes, live };
}
```

### Ionic / Angular / React / Vue

```ts
// Angular service 示例；React/Vue 把 Injectable 换成 hook / composable 即可
import { Injectable } from '@angular/core';
import { ElectricOpenPlatform } from '@wdywdy/electric-open-platform';

@Injectable({ providedIn: 'root' })
export class PowerApiService {
  private ready?: Promise<void>;

  private ensure(): Promise<void> {
    // configure() 幂等，但只需执行一次
    this.ready ??= ElectricOpenPlatform.configure({
      appKey: environment.eopAppKey,
      appSecret: environment.eopAppSecret,
      redirectUri: environment.eopRedirectUri,
      projectCode: environment.eopProjectCode,
      baseUrl: environment.eopBaseUrl,   // 指向自己的反向代理
    });
    return this.ready;
  }

  async dashboard(): Promise<{ boxes: unknown; live: unknown }> {
    await this.ensure();
    const boxes = await ElectricOpenPlatform.box.listOnline();
    const live = await ElectricOpenPlatform.channel.realtimeChannels({ mac: boxes.map((b) => b.mac) });
    return { boxes, live };
  }

  /** 60s 自刷新（token 由 SDK 维护，无需自己管过期） */
  startPolling(onData: (data: unknown) => void): () => void {
    let timer: ReturnType<typeof setInterval> | undefined;
    const tick = () => this.dashboard().then(onData).catch(console.error);
    tick();
    timer = setInterval(tick, 60_000);
    return () => clearInterval(timer);
  }
}
```

组件销毁时记得 `ElectricOpenPlatform.dispose()` 释放续期定时器（或直接调 `logout()`）。

## 发布到 npm

包名 **`@wdywdy/electric-open-platform`**（`@wdywdy` 是 npm 个人账号 `wdywdy` 的用户名 scope，
无需建组织即可发布）。只发布**一个**包，版本以 `package.json` 为准：

```bash
# 首次发布
npm login                                  # 或 npm adduser
npm whoami                                 # 应打印 wdywdy
node scripts/check-versions.mjs             # 版本 / exports / 零依赖自检
npm publish                                # publishConfig.access=public，无需再传 --access
#   账号开了 2FA 的话：npm publish --otp=六位动态码

npm view @wdywdy/electric-open-platform version   # 验证

# 之后每次发版（推荐：打 tag 自动发）
node scripts/check-versions.mjs 1.0.1
git commit -am "chore(release): v1.0.1"
git tag v1.0.1 && git push && git push --tags
```

工作流 `.github/workflows/publish-npm.yml` 会依次：装依赖 → 跑单测 → 重建产物并校验产物已提交
→ 校验版本与零依赖 → **grep 断言产物里没有 Capacitor/Cordova 残留** → 打包自检 → 发布
（已发布过的版本自动跳过，便于重跑）。

**CI 自动发布需要配认证**，二选一：

1. **Trusted Publishing（推荐，无需存 token）**：npm 包页面 → Settings → Trusted Publisher →
   绑定 GitHub 仓库 `lanyangayang/cordova-mantunsci-electric` 与 workflow 文件名
   `publish-npm.yml`（workflow 里已有 `id-token: write` 与 `--provenance`）。
   注意：包必须先手动发布过一次才能绑定。
2. **Access Token**：仓库 Settings → Secrets and variables → Actions → `NPM_TOKEN`，
   值取 npmjs.com → Access Tokens 生成的 **Granular token**（限制为只读+发布、限定此包）。
   npm 正在收紧「绕过 2FA 的 token」，长期建议走方案 1。

## 平台接口速查

| 项 | 值 |
| --- | --- |
| 基础地址 | `https://open.snd02.com` |
| 取 code | `POST /oauth/authverify2.as` |
| 取 token | `POST /oauth/token.as` |
| 刷新 token | `POST /oauth/refresh.as` |
| 业务接口 | `POST /invoke/router.as`（`application/x-www-form-urlencoded`，UTF-8） |
| 公共参数 | `client_id`(=appKey)、`method`、`access_token`、`timestamp`(`yyyyMMddHHmmss` 本地时间)、`sign` |
| `client_secret` | `MD5(appKey + grant_type + redirect_uri + code\|refreshToken + appSecret)` |
| 签名 | 除 `sign` 外所有参数按**参数名升序**拼接**参数值** + `appSecret`，再 MD5 |

## License

MIT
