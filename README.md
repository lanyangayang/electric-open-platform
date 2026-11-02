# @mantunsci/capacitor-electric-open-platform

面向 **智慧式用电数据开放平台**（Mtsci Open Platform，`open.snd02.com`）的 Capacitor 插件。
纯 JS 实现（无原生代码），一行 `configure()` 后即可调用平台全部 `router.as` 接口。

- **OAuth2 全流程**：headless 登录（`authverify2.as`）与重定向登录两种授权方式，`accessToken` / `refreshToken` 自动维护与提前续期，并发请求只刷新一次。
- **签名自动完成**：按平台规范对参数名排序、拼接参数值、追加 `appSecret` 做 MD5，业务代码无需关心。
- **CORS 无关**：iOS / Android 走 `CapacitorHttp` 原生请求；Web 走 `fetch`，行为一致。
- **类型完整**：全部枚举、字段（含 `aTUp` / `mxgl` 这类线上原始字段名）与 `.d.ts` 声明。
- **错误可编排**：统一 `ElectricOpenPlatformError`，携带平台返回码，可判断「设备离线」「token 过期」「接口未开通」等。
- **已对真实平台联调验证**：见 [验证结果](#已验证行为)。

---

## 安装

```bash
npm install @mantunsci/capacitor-electric-open-platform @capacitor/preferences
npx cap sync
```

`@capacitor/preferences` 是可选的（`peerDependenciesMeta.optional`）：不装时插件自动退回
`localStorage` 或内存存储。推荐装上，token 才能跨重启安全保存。

## 快速开始

```ts
import { ElectricOpenPlatform } from '@mantunsci/capacitor-electric-open-platform';

// 1) 配置（appSecret 不要写进源码，见「安全」）
await ElectricOpenPlatform.configure({
  appKey: 'O000093290',
  appSecret: import.meta.env.VITE_EOP_APP_SECRET,
  redirectUri: 'http://yourserverurl/receive',
  projectCode: 'P00000104893',
  storage: 'preferences',
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

## 认证

### 方式一：headless 登录（推荐给 App）

```ts
const result = await ElectricOpenPlatform.login(username, password);
// → { success, code, expiresIn, expiresAt }
```

内部依次调用 `POST /oauth/authverify2.as`（取 code）与 `POST /oauth/token.as`（换 token）。

### 方式二：浏览器重定向登录

```ts
// 打开该 URL 让用户登录，平台会带回 ?code=
const url = ElectricOpenPlatform.getAuthorizeUrl({ state: 'csrf-1' });

// 你的 redirectUri 收到回调后（或在 App 里用 deep link 接住）
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
| 持久化 | `preferences` → `localStorage` → 内存 |

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
import { ThirdPartyEquipmentType, MeterQueryType } from '@mantunsci/capacitor-electric-open-platform';

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

平台约束（插件已内置校验）：
- `equipmentType` 传 1（微断）或 2（电气火灾）会被拒绝 → 改用 `channel.realtime()`
- 智能水表(16) 必须带 `dataType`；`dataType=1` 时必须带 `startDate`/`endDate`

### `scene` / `push`
`scene.list()` / `scene.execute()`；`push.query/subscribe/unsubscribe/failedCheck/failedReset`，
并导出 `verifyPushKey()` 供你的后端校验平台推送的 `key`。

### 逃生舱
```ts
// 平台新增接口、插件还没包时直接用：
const data = await ElectricOpenPlatform.invoke<MyType>('NEW_METHOD', { foo: 'bar' });
```
同样自动签名、自动续期、自动解包。

## 错误处理

```ts
import { ElectricOpenPlatformError, PlatformCodes, TransportCodes } from '@mantunsci/capacitor-electric-open-platform';

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

1. **不要提交 `appSecret`**。用构建期环境变量注入（Vite 的 `import.meta.env.VITE_EOP_APP_SECRET`／
   Angular 的 `environment.ts` + CI 变量），并确保 `.env` 在 `.gitignore` 里。
   已签入前端的密钥无法真正隐藏——若威胁模型要求保密，应把签名放到自建后端中转。
2. **token 存储**：`preferences` 使用 iOS `UserDefaults` / Android SharedPreferences。
   如需硬件级保护，可包一层自定义存储后再交给插件，或改用「后端代持 token」模式。
3. **控制类接口**（`PUT_BOX_CONTROL` 等）会真实操作现场设备，务必加二次确认。
4. 插件**从不**把 `accessToken` / `appSecret` 写进日志；`logger` 回调里已做脱敏。

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
| **`GET_BOXES_DAY_STATS` / `_HOUR_STATS` / `_MON_STATS`** | ✅ 均返回真实数据（**本轮修复**） |
| `oauth/refresh.as` | ✅ 刷新后再次调用正常 |

**当前 appKey 唯一未开通的接口：`GET_BOX`**。已用对照实验确认（`GET_BOXES` 同一签名算法成功、
`GET_BOX` 换三组参数均失败、故意破坏签名会得到同样文案），属于接口级未授权，
不是插件实现或签名问题。需要时请联系平台商务开通。

### 接口命名陷阱（务必注意）

| 现象 | 真实原因 |
| --- | --- |
| `接口名称(X)无效！` | 方法名写错 **或** 该 appKey 未开通 |
| `无效的接口方法参数签名！` | 既可能是签名错，**也可能是接口未开通**——平台复用同一文案 |

典型踩坑：把 `GET_BOXES_DAY_STATS` 写成 `GET_BOXS_DAY_STATS`（少一个 `E`），
返回 `接口名称(GET_BOXS_DAY_STATS)无效！`，极易误判为“未开通”而放弃接入。
插件已按文档修正，并有回归测试锁定三个统计接口的方法名。

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
npm test          # 86 个单测：MD5 向量、签名样例、token 生命周期、接口参数、方法名回归
npm run build     # 产出 dist/esm + dist/plugin.cjs + d.ts
npm run demo      # 打开 http://localhost:5178 调试台
```

> 浏览器里直接跑会被 **CORS** 拦截（平台不返回 CORS 头）。调试台用于看 UI 与错误路径，
> 真实请求请在 Capacitor 真机/模拟器里跑——那里走原生 `CapacitorHttp`，不受同源策略限制。

## 在 Ionic/Angular 项目里接入

```bash
npm install ../capacitor-mantunsci-electric   # 本地联调
# 或 npm install @mantunsci/capacitor-electric-open-platform
npx cap sync
```

```ts
// app.module.ts 里注册 service 后，页面中：
import { Injectable } from '@angular/core';
import { ElectricOpenPlatform } from '@mantunsci/capacitor-electric-open-platform';

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
      storage: 'preferences',
    });
    return this.ready;
  }

  async dashboard(): Promise<{ boxes: unknown; live: unknown }> {
    await this.ensure();
    const boxes = await ElectricOpenPlatform.box.listOnline();
    const live = await ElectricOpenPlatform.channel.realtimeChannels({ mac: boxes.map((b) => b.mac) });
    return { boxes, live };
  }

  /** 60s 自刷新（插件已处理 token，无需自己管过期） */
  startPolling(onData: (data: unknown) => void): () => void {
    let timer: ReturnType<typeof setInterval> | undefined;
    const tick = () => this.dashboard().then(onData).catch(console.error);
    tick();
    timer = setInterval(tick, 60_000);
    return () => clearInterval(timer);
  }
}
```

页面销毁时记得 `ElectricOpenPlatform.dispose()` 释放续期定时器（或直接调 `logout()`）。

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
