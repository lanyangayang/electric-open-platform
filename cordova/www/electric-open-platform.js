/*! cordova-plugin-mantunsci-electric — 智慧式用电开放平台。构建产物，请勿手改。 */
"use strict";
var __EOP = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // cordova/src/shims/capacitor-core-stub.ts
  var capacitor_core_stub_exports = {};
  __export(capacitor_core_stub_exports, {
    Capacitor: () => Capacitor,
    CapacitorHttp: () => CapacitorHttp,
    default: () => capacitor_core_stub_default
  });
  var Capacitor, CapacitorHttp, capacitor_core_stub_default;
  var init_capacitor_core_stub = __esm({
    "cordova/src/shims/capacitor-core-stub.ts"() {
      "use strict";
      Capacitor = {
        isNativePlatform() {
          return false;
        },
        getPlatform() {
          return "cordova";
        }
      };
      CapacitorHttp = {
        async post() {
          throw new Error("\u7EAF Cordova \u73AF\u5883\u4E0D\u53EF\u7528 CapacitorHttp\uFF0C\u8BF7\u4F7F\u7528 Cordova \u539F\u751F\u6865");
        }
      };
      capacitor_core_stub_default = { Capacitor, CapacitorHttp };
    }
  });

  // cordova/src/shims/capacitor-preferences-stub.ts
  var capacitor_preferences_stub_exports = {};
  __export(capacitor_preferences_stub_exports, {
    Preferences: () => Preferences,
    default: () => capacitor_preferences_stub_default
  });
  var Preferences, capacitor_preferences_stub_default;
  var init_capacitor_preferences_stub = __esm({
    "cordova/src/shims/capacitor-preferences-stub.ts"() {
      "use strict";
      Preferences = {
        async get(_options) {
          throw new Error("\u7EAF Cordova \u73AF\u5883\u4E0D\u4F7F\u7528 @capacitor/preferences");
        },
        async set(_options) {
          throw new Error("\u7EAF Cordova \u73AF\u5883\u4E0D\u4F7F\u7528 @capacitor/preferences");
        },
        async remove(_options) {
          throw new Error("\u7EAF Cordova \u73AF\u5883\u4E0D\u4F7F\u7528 @capacitor/preferences");
        }
      };
      capacitor_preferences_stub_default = { Preferences };
    }
  });

  // cordova/src/entry-cordova.ts
  var entry_cordova_exports = {};
  __export(entry_cordova_exports, {
    AlarmType: () => AlarmType,
    ElectricOpenPlatformError: () => ElectricOpenPlatformError,
    EquipmentType: () => EquipmentType,
    PlatformCodes: () => PlatformCodes,
    PushType: () => PushType,
    ThirdPartyEquipmentType: () => ThirdPartyEquipmentType,
    TransportCodes: () => TransportCodes,
    alarm: () => alarm,
    box: () => box,
    channel: () => channel,
    client: () => client,
    configure: () => configure,
    control: () => control,
    createCordovaTransport: () => createCordovaTransport,
    describe: () => describe,
    detectHost: () => detectHost,
    diagnostics: () => diagnostics,
    dispose: () => dispose,
    formatAlarmTime: () => formatAlarmTime,
    formatTimestamp: () => formatTimestamp,
    getAccessToken: () => getAccessToken,
    getAuthorizeUrl: () => getAuthorizeUrl,
    handleRedirect: () => handleRedirect,
    invoke: () => invoke,
    login: () => login,
    logout: () => logout,
    md5: () => md5,
    project: () => project,
    push: () => push,
    refreshToken: () => refreshToken,
    scene: () => scene,
    setTransportImpl: () => setTransportImpl,
    signParams: () => signParams,
    stats: () => stats,
    storageBackend: () => storageBackend,
    thirdparty: () => thirdparty
  });

  // src/core/models.ts
  var EquipmentType = /* @__PURE__ */ ((EquipmentType2) => {
    EquipmentType2[EquipmentType2["MicroBreaker"] = 1] = "MicroBreaker";
    EquipmentType2[EquipmentType2["ElectricalFire"] = 2] = "ElectricalFire";
    EquipmentType2[EquipmentType2["LiquidLevel"] = 4] = "LiquidLevel";
    EquipmentType2[EquipmentType2["Pressure"] = 5] = "Pressure";
    EquipmentType2[EquipmentType2["SmokeForSafe"] = 6] = "SmokeForSafe";
    EquipmentType2[EquipmentType2["GasForSafe"] = 7] = "GasForSafe";
    EquipmentType2[EquipmentType2["SmokeZac"] = 10] = "SmokeZac";
    EquipmentType2[EquipmentType2["TempHumidity"] = 11] = "TempHumidity";
    EquipmentType2[EquipmentType2["SmartMeter"] = 12] = "SmartMeter";
    EquipmentType2[EquipmentType2["GasZac"] = 13] = "GasZac";
    EquipmentType2[EquipmentType2["Lux"] = 14] = "Lux";
    EquipmentType2[EquipmentType2["SmartWaterMeter"] = 16] = "SmartWaterMeter";
    EquipmentType2[EquipmentType2["SmokeWanlin"] = 29] = "SmokeWanlin";
    EquipmentType2[EquipmentType2["TempWanlin"] = 39] = "TempWanlin";
    EquipmentType2[EquipmentType2["SmokeHaiman"] = 42] = "SmokeHaiman";
    EquipmentType2[EquipmentType2["GasHaiman"] = 45] = "GasHaiman";
    return EquipmentType2;
  })(EquipmentType || {});
  var AlarmType = {
    ShortCircuit: 1,
    LeakageMonitor: 2,
    Overload: 3,
    Overcurrent: 4,
    Overvoltage: 5,
    Undervoltage: 6,
    Temperature: 7,
    Surge: 8,
    LeakageProtectOk: 9,
    LeakageSelfTestIncomplete: 10,
    Arc: 11,
    LeakageWarning: 12,
    CurrentWarning: 13,
    OvervoltageWarning: 14,
    UndervoltageWarning: 15,
    CommWarning: 16,
    PhaseLoss: 17,
    ThreePhaseUnbalance: 18,
    ThreePhaseSequence: 19,
    PowerLoss: 53,
    BoxOpen: 54,
    TemperatureWarning: 55,
    Humidity: 56,
    Input: 57,
    PowerNormal: 58,
    MalignantLoad: 62,
    Config: 1001,
    Offline: 1002,
    SwitchOffNotice: 1003,
    SwitchOnNotice: 1004,
    AbnormalOpen: 1005,
    LeakageProtection: 1016,
    Smoke: 2002,
    Gas: 2006,
    Pressure: 2003,
    LiquidLevel: 2004,
    DeviceFault: 9e3,
    CommFault: 9001
  };
  var PushType = /* @__PURE__ */ ((PushType2) => {
    PushType2[PushType2["Alarm"] = 1] = "Alarm";
    PushType2[PushType2["ChannelStatus"] = 2] = "ChannelStatus";
    PushType2[PushType2["Event"] = 3] = "Event";
    return PushType2;
  })(PushType || {});
  var ThirdPartyEquipmentType = /* @__PURE__ */ ((ThirdPartyEquipmentType2) => {
    ThirdPartyEquipmentType2[ThirdPartyEquipmentType2["LiquidLevel"] = 4] = "LiquidLevel";
    ThirdPartyEquipmentType2[ThirdPartyEquipmentType2["Pressure"] = 5] = "Pressure";
    ThirdPartyEquipmentType2[ThirdPartyEquipmentType2["SmokeForSafe"] = 6] = "SmokeForSafe";
    ThirdPartyEquipmentType2[ThirdPartyEquipmentType2["GasForSafe"] = 7] = "GasForSafe";
    ThirdPartyEquipmentType2[ThirdPartyEquipmentType2["SmokeZac"] = 10] = "SmokeZac";
    ThirdPartyEquipmentType2[ThirdPartyEquipmentType2["TempHumidity"] = 11] = "TempHumidity";
    ThirdPartyEquipmentType2[ThirdPartyEquipmentType2["SmartMeter"] = 12] = "SmartMeter";
    ThirdPartyEquipmentType2[ThirdPartyEquipmentType2["GasZac"] = 13] = "GasZac";
    ThirdPartyEquipmentType2[ThirdPartyEquipmentType2["Lux"] = 14] = "Lux";
    ThirdPartyEquipmentType2[ThirdPartyEquipmentType2["SmartWaterMeter"] = 16] = "SmartWaterMeter";
    ThirdPartyEquipmentType2[ThirdPartyEquipmentType2["SmokeWanlin"] = 29] = "SmokeWanlin";
    ThirdPartyEquipmentType2[ThirdPartyEquipmentType2["TempWanlin"] = 39] = "TempWanlin";
    ThirdPartyEquipmentType2[ThirdPartyEquipmentType2["SmokeHaiman"] = 42] = "SmokeHaiman";
    ThirdPartyEquipmentType2[ThirdPartyEquipmentType2["GasHaiman"] = 45] = "GasHaiman";
    return ThirdPartyEquipmentType2;
  })(ThirdPartyEquipmentType || {});

  // src/core/api.ts
  var ApiBase = class {
    constructor(client2) {
      this.client = client2;
    }
    call(method, params = {}, projectCode) {
      return this.client.call(method, { params, projectCode });
    }
    /** Normalises a comma list / array into the platform's comma-joined string. */
    static list(value) {
      if (value === void 0) return void 0;
      const arr = Array.isArray(value) ? value : value.split(",");
      const cleaned = arr.map((s) => s.trim()).filter(Boolean);
      if (cleaned.length === 0) return void 0;
      return cleaned.join(",");
    }
  };
  var ProjectApi = class extends ApiBase {
    getInfo(projectCode) {
      return this.call("GET_PROJECT_INFO", {}, projectCode);
    }
    modifyInfo(fields) {
      const _a = fields, { projectCode } = _a, rest = __objRest(_a, ["projectCode"]);
      return this.call("MODIFY_PROJECT_INFO", rest, projectCode);
    }
    /** 项目日统计 GET_PROJECT_DAY_STATS */
    dayStats(args) {
      return this.call(
        "GET_PROJECT_DAY_STATS",
        { year: args.year, month: args.month, day: args.day },
        args.projectCode
      );
    }
  };
  var BoxApi = class extends ApiBase {
    list(args = {}) {
      const _a = args, { projectCode } = _a, rest = __objRest(_a, ["projectCode"]);
      return this.call("GET_BOXES", rest, projectCode);
    }
    /** Only online (-1 未连接 / 0 离线 / 1 在线). */
    async listOnline(args = {}) {
      const all = await this.list(args);
      return all.filter((b) => b.online === 1);
    }
    get(mac, projectCode) {
      return this.call("GET_BOX", { mac }, projectCode);
    }
    positionTree(projectCode) {
      return this.call("GET_BOX_POSITION_TREE", {}, projectCode);
    }
    /**
     * GET_BOX_PROPERTIES — 设备节点属性 (暂仅支持微断/A 系列设备).
     *
     * `nodeType` is **required** by the platform; the documented value for the
     * communication module is `COMM`. `addr` optionally targets one circuit.
     */
    properties(args) {
      var _a;
      return this.call(
        "GET_BOX_PROPERTIES",
        { mac: args.mac, nodeType: (_a = args.nodeType) != null ? _a : "COMM", addr: args.addr },
        args.projectCode
      );
    }
    modifyProperties(args) {
      const { mac, params = {}, projectCode } = args;
      return this.call("MODIFY_BOX_PROPERTIES", __spreadValues({ mac }, params), projectCode);
    }
    modifyInfo(args) {
      const _a = args, { projectCode } = _a, rest = __objRest(_a, ["projectCode"]);
      return this.call("MODIFY_BOX_INFO", rest, projectCode);
    }
    /**
     * 调节上报频率 SET_BOX_REALTIME_RATE.
     * `rate` is seconds between uploads — 5..180 for UDP modules, 5..600 for HTTP.
     */
    setRealtimeRate(args) {
      if (args.rate < 5) {
        throw new Error("rate \u5FC5\u987B >= 5 \u79D2");
      }
      const mac = ApiBase.list(args.mac);
      if (!mac) throw new Error("mac \u4E0D\u80FD\u4E3A\u7A7A");
      return this.call(
        "SET_BOX_REALTIME_RATE",
        { mac, enable: args.enable ? "true" : "false", rate: args.rate },
        args.projectCode
      );
    }
    /**
     * 设备在线轨迹 GET_BOX_ONLINE_HISTORY.
     *
     * Note the platform wants `startTime` / `endTime` here — **not** the
     * `start`/`end` pair used by GET_BOX_ALARM. Format `yyyy-MM-dd HH:mm`;
     * only the last ~6 months are retained.
     */
    onlineHistory(args) {
      var _a, _b;
      return this.call(
        "GET_BOX_ONLINE_HISTORY",
        {
          mac: args.mac,
          startTime: toAlarmTime(args.startTime),
          endTime: toAlarmTime(args.endTime),
          page: (_a = args.page) != null ? _a : 1,
          pageSize: (_b = args.pageSize) != null ? _b : 100
        },
        args.projectCode
      );
    }
  };
  var ChannelApi = class extends ApiBase {
    /**
     * GET_BOX_CHANNELS_REALTIME.
     *
     * Accepts 1..20 macs. The platform returns a **different shape** for one mac
     * (flat channel array) than for many (array of `{ mac, channelList }`); this
     * method always normalises to {@link BoxRealtime}[] so UI code never branches.
     */
    async realtime(args) {
      const macList = (Array.isArray(args.mac) ? args.mac : args.mac.split(",")).map((m) => m.trim()).filter(Boolean);
      if (macList.length === 0) throw new Error("mac \u4E0D\u80FD\u4E3A\u7A7A");
      if (macList.length > 20) throw new Error("GET_BOX_CHANNELS_REALTIME \u4E00\u6B21\u6700\u591A 20 \u4E2A\u8BBE\u5907");
      const raw = await this.call(
        "GET_BOX_CHANNELS_REALTIME",
        { mac: macList.join(",") },
        args.projectCode
      );
      return normaliseRealtime(raw, macList);
    }
    /** Flattened convenience: every circuit of every requested device. */
    async realtimeChannels(args) {
      const boxes = await this.realtime(args);
      const out = [];
      for (const box2 of boxes) {
        for (const ch of box2.channelList) out.push(__spreadProps(__spreadValues({}, ch), { mac: box2.mac }));
      }
      return out;
    }
    /** GET_BOX_CHANNELS — the list of valid circuits (title/oc/updateTime only). */
    async list(args) {
      var _a;
      const params = {};
      if ((_a = args.param) == null ? void 0 : _a.length) {
        params.param = JSON.stringify(args.param);
      } else if (args.mac) {
        params.mac = ApiBase.list(args.mac);
      } else {
        throw new Error("mac \u4E0E param \u5FC5\u987B\u4F20\u5176\u4E00");
      }
      return this.call("GET_BOX_CHANNELS", params, args.projectCode);
    }
    /** GET_BOX_CHANNELS_OC — 开关状态（比 realtime 轻量）。 */
    channelsOc(args) {
      return this.call(
        "GET_BOX_CHANNELS_OC",
        { mac: ApiBase.list(args.mac) },
        args.projectCode
      );
    }
    /**
     * 历史节点数据 GET_BOX_CHANNELS_REALTIME_HISTORY.
     *
     * 平台**仅支持按天**查询：参数是 `date`（yyyy-MM-dd，默认当天），
     * 不是开始/结束区间。
     */
    history(args) {
      var _a, _b;
      if (args.date && !/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
        throw new Error("date \u683C\u5F0F\u5E94\u4E3A yyyy-MM-dd");
      }
      return this.call(
        "GET_BOX_CHANNELS_REALTIME_HISTORY",
        {
          mac: args.mac,
          date: args.date,
          addr: args.addr,
          isReturnTotal: args.isReturnTotal === void 0 ? void 0 : args.isReturnTotal ? "true" : "false",
          page: (_a = args.page) != null ? _a : 1,
          pageSize: (_b = args.pageSize) != null ? _b : 100
        },
        args.projectCode
      );
    }
  };
  function normaliseRealtime(raw, requested) {
    if (!Array.isArray(raw)) return [];
    const first = raw[0];
    const isWrapped = !!first && Array.isArray(first.channelList);
    if (isWrapped) {
      return raw.map((b) => {
        var _a;
        return {
          mac: b.mac,
          channelList: ((_a = b.channelList) != null ? _a : []).map((ch) => {
            var _a2;
            return __spreadProps(__spreadValues({}, ch), { mac: (_a2 = ch.mac) != null ? _a2 : b.mac });
          })
        };
      });
    }
    const mac = requested[0];
    return [
      {
        mac,
        channelList: raw.map((ch) => {
          var _a;
          return __spreadProps(__spreadValues({}, ch), { mac: (_a = ch.mac) != null ? _a : mac });
        })
      }
    ];
  }
  var ControlApi = class extends ApiBase {
    /**
     * Generic control dispatcher.
     *
     * `PUT_BOX_CONTROL` takes `cmd` plus a flat set of `value1..value5` (and, for
     * device/timer commands, dotted keys such as `device.autoid`).
     */
    control(args) {
      return this.call("PUT_BOX_CONTROL", __spreadValues({
        mac: args.mac,
        cmd: args.cmd
      }, args.options), args.projectCode);
    }
    /** 合闸/分闸. Addresses are 1-based circuit addresses. */
    switchCircuit(args) {
      const addr = Array.isArray(args.addr) ? args.addr.join(",") : String(args.addr);
      return this.control({
        mac: args.mac,
        cmd: "OCSWITCH",
        options: __spreadValues({
          value1: args.action,
          value2: addr
        }, args.skipWhenAbnormalLock ? { value3: "ABNORMAL_LOCK_CHECK" } : {}),
        projectCode: args.projectCode
      });
    }
    /** 批量控制 BATCH_BOX_CONTROL */
    batchSwitch(args) {
      return this.call(
        "BATCH_BOX_CONTROL",
        { cmd: "OCSWITCH", value1: args.action, param: JSON.stringify(args.items) },
        args.projectCode
      );
    }
    /** 改线路名称 / 功率限定 (SWITCHSET) */
    updateCircuit(args) {
      var _a;
      const options = { value1: args.addr, value2: (_a = args.title) != null ? _a : "" };
      if (args.maxPowerW !== void 0) options.value4 = args.maxPowerW;
      if (args.overCurrentThreshold !== void 0) options.value5 = args.overCurrentThreshold;
      return this.control({ mac: args.mac, cmd: "SWITCHSET", options, projectCode: args.projectCode });
    }
    /** 远程锁定/解锁一条线路 */
    remoteLock(args) {
      return this.control({
        mac: args.mac,
        cmd: "REMOTE_SWITCH_LOCK",
        options: { value1: args.addr, value2: args.locked ? "true" : "false" },
        projectCode: args.projectCode
      });
    }
    /** 对异常分闸锁定的线路执行远程解锁 */
    unlockAbnormal(args) {
      return this.control({
        mac: args.mac,
        cmd: "ABNORMAL_SWITCH_UNLOCK",
        options: { value1: args.addr },
        projectCode: args.projectCode
      });
    }
    /** 线路/设备显隐标记 */
    setVisibility(args) {
      return this.control({
        mac: args.mac,
        cmd: "SETVISIBILITY",
        options: { value1: args.addr, value2: args.visible ? 1 : 0 },
        projectCode: args.projectCode
      });
    }
    /** 是否允许控制标记 */
    setControl(args) {
      return this.control({
        mac: args.mac,
        cmd: "SETCONTROL",
        options: { value1: args.addr, value2: args.controllable ? 1 : 0 },
        projectCode: args.projectCode
      });
    }
    /** 自动漏电自检 */
    setAutoLeakage(args) {
      return this.control({
        mac: args.mac,
        cmd: "SETAUTOLEAK",
        options: { value1: args.enable ? "true" : "false", value2: args.day, value3: args.hour, value4: args.minute },
        projectCode: args.projectCode
      });
    }
    /** 设备定时配置 GET_CFG_TIMER (autoid = 0 返回全部) */
    getTimers(args) {
      var _a;
      return this.call("GET_CFG_TIMER", { mac: args.mac, autoid: (_a = args.autoid) != null ? _a : 0 }, args.projectCode);
    }
    /** 漏电自检记录 GET_CFG_LKICHK */
    getLeakageCheck(args) {
      return this.call("GET_CFG_LKICHK", { mac: args.mac }, args.projectCode);
    }
  };
  var AlarmApi = class extends ApiBase {
    /**
     * GET_BOX_ALARM.
     *
     * Platform limits: `start` within the last month, `end - start` <= 48 h, and
     * these windows are **storage time**, not alarm time.
     */
    async list(args) {
      var _a, _b, _c, _d, _e, _f, _g;
      const start = toAlarmTime(args.start);
      const end = toAlarmTime(args.end);
      assertWindows(start, end);
      const data = await this.call("GET_BOX_ALARM", {
        start,
        end,
        mac: args.mac,
        page: (_a = args.page) != null ? _a : 1,
        pageSize: (_b = args.pageSize) != null ? _b : 50,
        type: (_c = args.type) != null ? _c : "W",
        includeCalm: args.includeCalm ? "true" : "false"
      }, args.projectCode);
      if (Array.isArray(data)) {
        return { total: data.length, page: 1, totalPage: 1, datas: data };
      }
      const page = data != null ? data : {};
      return {
        total: (_d = page.total) != null ? _d : 0,
        page: (_e = page.page) != null ? _e : 1,
        totalPage: (_f = page.totalPage) != null ? _f : 1,
        datas: (_g = page.datas) != null ? _g : []
      };
    }
    /** Walks every page of a window (capped by `maxPages`). */
    async listAll(args) {
      var _a;
      const maxPages = (_a = args.maxPages) != null ? _a : 20;
      const first = await this.list(__spreadProps(__spreadValues({}, args), { page: 1 }));
      const all = [...first.datas];
      const pages = Math.min(first.totalPage, maxPages);
      for (let p = 2; p <= pages; p++) {
        const next = await this.list(__spreadProps(__spreadValues({}, args), { page: p }));
        all.push(...next.datas);
      }
      return all;
    }
    /** 按告警类型/设备过滤 (client side — the API has no such filter). */
    async byType(args) {
      const _a = args, { typeNumbers } = _a, rest = __objRest(_a, ["typeNumbers"]);
      const rows = await this.listAll(rest);
      const set = new Set(typeNumbers);
      return rows.filter((r) => set.has(r.typeNumber));
    }
    /**
     * 告警维护记录 GET_ALARM_MAINTENANCE.
     * `alarmId` 支持单个或数组（平台最多 20 个，逗号分隔）。
     */
    maintenance(args) {
      return this.call(
        "GET_ALARM_MAINTENANCE",
        { alarmId: toIdList(args.alarmId, "GET_ALARM_MAINTENANCE") },
        args.projectCode
      );
    }
    /**
     * 催办/处理告警 ALARM_URGED.
     * 注意 `mac` 是必填项（文档与旧实现不一致处，已按平台实测修正）。
     */
    urged(args) {
      return this.call(
        "ALARM_URGED",
        { mac: args.mac, alarmId: toIdList(args.alarmId, "ALARM_URGED") },
        args.projectCode
      );
    }
    /**
     * 设备维保工单处理历史 GET_BOX_MAINTENANCE_HISTORY.
     * `start`/`end` 必填（yyyy-MM-dd HH:mm）：start 需在最近一个月内，end 不得晚于今天。
     */
    boxMaintenanceHistory(args) {
      var _a, _b;
      if (args.pageSize !== void 0 && (args.pageSize < 1 || args.pageSize > 100)) {
        throw new Error("pageSize \u53D6\u503C\u8303\u56F4 1~100");
      }
      return this.call(
        "GET_BOX_MAINTENANCE_HISTORY",
        {
          mac: args.mac,
          start: toAlarmTime(args.start),
          end: toAlarmTime(args.end),
          page: (_a = args.page) != null ? _a : 1,
          pageSize: (_b = args.pageSize) != null ? _b : 100
        },
        args.projectCode
      );
    }
  };
  function toIdList(value, method) {
    const list = (Array.isArray(value) ? value : String(value).split(",")).map((v) => String(v).trim()).filter(Boolean);
    if (list.length === 0) throw new Error(`${method}: alarmId \u4E0D\u80FD\u4E3A\u7A7A`);
    if (list.length > 20) throw new Error(`${method}: alarmId \u4E00\u6B21\u6700\u591A 20 \u4E2A`);
    return list.join(",");
  }
  function toAlarmTime(value) {
    if (typeof value === "string") return value;
    const pad = (n) => String(n).padStart(2, "0");
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}`;
  }
  function assertWindows(start, end) {
    const s = new Date(start.replace(" ", "T"));
    const e = new Date(end.replace(" ", "T"));
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
      throw new Error("start/end \u683C\u5F0F\u5E94\u4E3A yyyy-MM-dd HH:mm");
    }
    if (e <= s) throw new Error("end \u5FC5\u987B\u5927\u4E8E start");
    if (e.getTime() - s.getTime() > 48 * 3600 * 1e3) {
      throw new Error("end \u4E0E start \u7684\u95F4\u9694\u4E0D\u80FD\u8D85\u8FC7 48 \u5C0F\u65F6");
    }
  }
  var StatsApi = class extends ApiBase {
    period(method, args) {
      return this.call(
        method,
        { mac: ApiBase.list(args.mac), year: args.year, month: args.month, day: args.day },
        args.projectCode
      );
    }
    /**
     * 日区间统计 GET_BOXES_DAY_STATS.
     * 不传 `day` 时返回当月每天的数据。
     */
    day(args) {
      return this.period("GET_BOXES_DAY_STATS", args);
    }
    /** 小时区间统计 GET_BOXES_HOUR_STATS. */
    hour(args) {
      return this.period("GET_BOXES_HOUR_STATS", args);
    }
    /** 月区间统计 GET_BOXES_MON_STATS. */
    month(args) {
      return this.call("GET_BOXES_MON_STATS", { mac: ApiBase.list(args.mac), year: args.year }, args.projectCode);
    }
    /** Sum of `electricity` for a day across circuits (addr=0 row is the device total). */
    totalElectricity(stats2) {
      const deviceTotal = stats2.find((s) => s.addr === 0);
      if (deviceTotal && typeof deviceTotal.electricity === "number") return deviceTotal.electricity;
      return stats2.reduce((sum, s) => {
        var _a;
        return sum + ((_a = s.electricity) != null ? _a : 0);
      }, 0);
    }
  };
  var SceneApi = class extends ApiBase {
    list(projectCode) {
      return this.call("SCENE_SERVICE", { cmd: "SCENE_QUERY" }, projectCode);
    }
    execute(args) {
      var _a;
      return this.call("SCENE_SERVICE", __spreadValues({ cmd: "SCENE_EXEC", sceneId: args.sceneId }, (_a = args.params) != null ? _a : {}), args.projectCode);
    }
  };
  var ThirdPartyDeviceApi = class extends ApiBase {
    /**
     * 获取第三方设备状态 GET_THR_DEVICE_STATUS.
     *
     * @param args.equipmentType 必填，且必须是**第三方**设备类型
     *   （4/5/6/7/10/11/12/13/14/16/29/39/42/45）。传 1 或 2 会被平台以
     *   「设备类型无效！」拒绝——微断请用 {@link ChannelApi.realtime}。
     * @param args.dataType 仅智能水表(16)必填：0 实时抄表 / 1 时间范围
     * @param args.startDate / endDate `dataType=1` 时必填，格式 yyyy-MM-dd
     */
    status(args) {
      const type = Number(args.equipmentType);
      if (type === 1 || type === 2) {
        throw new Error(
          "equipmentType 1\uFF08\u5FAE\u65AD\uFF09/ 2\uFF08\u7535\u6C14\u706B\u707E\uFF09\u4E0D\u652F\u6301 GET_THR_DEVICE_STATUS\uFF0C\u8BF7\u4F7F\u7528 channel.realtime()"
        );
      }
      if (type === 16 /* SmartWaterMeter */ && args.dataType === void 0) {
        throw new Error("\u667A\u80FD\u6C34\u8868(equipmentType=16)\u5FC5\u987B\u6307\u5B9A dataType\uFF080 \u5B9E\u65F6 / 1 \u65F6\u95F4\u8303\u56F4\uFF09");
      }
      if (args.dataType === 1 /* Range */ && (!args.startDate || !args.endDate)) {
        throw new Error("dataType=1 \u65F6\u5FC5\u987B\u63D0\u4F9B startDate \u4E0E endDate\uFF08yyyy-MM-dd\uFF09");
      }
      return this.call(
        "GET_THR_DEVICE_STATUS",
        {
          mac: args.mac,
          equipmentType: type,
          dataType: args.dataType,
          startDate: args.startDate,
          endDate: args.endDate
        },
        args.projectCode
      );
    }
    /**
     * 同上，但把每条记录的 `data` JSON 字符串解析成对象，
     * 便于直接绑定到 UI（解析失败时保留原始字符串）。
     */
    async statusParsed(args) {
      const rows = await this.status(args);
      return rows.map((r) => __spreadProps(__spreadValues({}, r), { data: parseThirdPartyData(r.data) }));
    }
    /** 列出项目中某类型的第三方设备（从 GET_BOXES 过滤）。 */
    async listDevices(args) {
      const boxes = await this.call(
        "GET_BOXES",
        { equipmentType: Number(args.equipmentType) },
        args.projectCode
      );
      return boxes.filter((b) => Number(b.equipmentType) === Number(args.equipmentType));
    }
  };
  function parseThirdPartyData(raw) {
    if (typeof raw !== "string") return raw;
    const text = raw.trim();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (e) {
      if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
      return text;
    }
  }

  // src/core/errors.ts
  var PlatformCodes = {
    OK: "0",
    NOT_LOGGED_IN: "-1",
    FAILED: "1",
    TOKEN_EXPIRED: "2",
    BOX_OFFLINE: "1001",
    ILLEGAL_PARAM: "1002",
    ILLEGAL_OWNERSHIP: "1003",
    REMOTE_CONTROL_FORBIDDEN: "1004",
    INCOMPLETE_PROPERTY: "1005",
    VERIFY_FAILED: "1006",
    ALREADY_EXISTS: "1007",
    NOT_FOUND: "1008",
    OVER_LIMIT: "1009",
    DUPLICATE_OPERATION: "1010"
  };
  var CODE_MESSAGES = {
    "-1": "\u672A\u767B\u5F55\u6216\u4F1A\u8BDD\u5DF2\u8FC7\u671F",
    "1": "\u63A5\u53E3\u8C03\u7528\u5931\u8D25",
    "2": "accessToken \u5DF2\u8FC7\u671F",
    "1001": "\u8BBE\u5907\u4E0D\u5728\u7EBF",
    "1002": "\u4E0D\u5408\u6CD5\u7684\u53C2\u6570",
    "1003": "\u4E0D\u5408\u6CD5\u7684\u5F52\u5C5E",
    "1004": "\u4E0D\u5141\u8BB8\u8FDC\u7A0B\u63A7\u5236",
    "1005": "\u4E0D\u5B8C\u6574\u7684\u8BBE\u5907\u5C5E\u6027",
    "1006": "\u6821\u9A8C\u5931\u8D25\uFF08\u4F8B\u5982\u5BC6\u7801\u9519\u8BEF\uFF09",
    "1007": "\u8D44\u6E90\u5DF2\u5B58\u5728",
    "1008": "\u76F8\u5173\u8D44\u6E90\u4E0D\u5B58\u5728",
    "1009": "\u8D44\u6E90\u8D85\u8FC7\u6700\u5927\u9650\u5236",
    "1010": "\u4E0D\u80FD\u91CD\u590D\u64CD\u4F5C"
  };
  var TransportCodes = {
    /** The device could not reach the server at all. */
    NETWORK: "E_NETWORK",
    /** The server answered with a non-2xx status. */
    HTTP: "E_HTTP",
    /** Response body was not the expected JSON envelope. */
    PARSE: "E_PARSE",
    /** The plugin was used before `configure()` / `login()`. */
    NOT_CONFIGURED: "E_NOT_CONFIGURED",
    /** Local guard rail rejected the call before hitting the network. */
    INVALID_ARGUMENT: "E_INVALID_ARGUMENT",
    /** OAuth handshake (authverify2 / token / refresh) failed. */
    OAUTH: "E_OAUTH",
    /** Daily per-interface quota exhausted (platform rejects with "限额"). */
    QUOTA: "E_QUOTA",
    /**
     * The method exists but this appKey is not authorized for it.
     *
     * The platform reports unprovisioned methods in two misleading ways:
     *  - `接口名称(X)无效！`
     *  - `无效的接口方法参数签名！` — which looks like a signing bug but, verified
     *    against the live server, is what you get for a method that is not
     *    enabled for the key. Only treat it as this code when the same key's
     *    other calls succeed, which the client knows.
     */
    NOT_PROVISIONED: "E_NOT_PROVISIONED",
    /** The call was aborted by the caller (AbortSignal). */
    ABORTED: "E_ABORTED"
  };
  var ElectricOpenPlatformError = class extends Error {
    constructor(code, message, options = {}) {
      super(message || CODE_MESSAGES[code] || `\u8C03\u7528\u5931\u8D25 (code=${code})`);
      this.name = "ElectricOpenPlatformError";
      this.code = code;
      this.method = options.method;
      this.details = options.details;
      this.httpStatus = options.httpStatus;
      if (options.cause !== void 0) this.cause = options.cause;
    }
    /** True when the platform says the access token must be renewed. */
    get isTokenExpired() {
      return this.code === PlatformCodes.TOKEN_EXPIRED || this.code === PlatformCodes.NOT_LOGGED_IN;
    }
    /** True when a retry after a short delay is likely to succeed. */
    get isRetryable() {
      return this.code === TransportCodes.NETWORK || this.code === PlatformCodes.BOX_OFFLINE || this.httpStatus !== void 0 && this.httpStatus >= 500;
    }
    toJSON() {
      return {
        name: this.name,
        code: this.code,
        message: this.message,
        method: this.method,
        httpStatus: this.httpStatus,
        details: this.details
      };
    }
  };

  // src/core/transport.ts
  var DEFAULT_TIMEOUT_MS = 2e4;
  function parseBody(raw) {
    const trimmed = raw.trim();
    if (trimmed === "") return null;
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      return raw;
    }
  }
  function assertHttpOk(status, raw) {
    if (status < 200 || status >= 300) {
      throw new ElectricOpenPlatformError(TransportCodes.HTTP, `\u670D\u52A1\u5668\u8FD4\u56DE HTTP ${status}`, {
        httpStatus: status,
        details: raw
      });
    }
  }

  // src/core/transport-fetch.ts
  function createFetchTransport() {
    return {
      name: "fetch",
      async postForm(req) {
        var _a, _b, _c, _d, _e;
        if ((_a = req.signal) == null ? void 0 : _a.aborted) {
          throw new ElectricOpenPlatformError(TransportCodes.ABORTED, "\u8BF7\u6C42\u5DF2\u53D6\u6D88");
        }
        const headers = __spreadValues({
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          Accept: "application/json, text/plain, */*"
        }, req.headers);
        const timeoutMs = (_b = req.timeoutMs) != null ? _b : DEFAULT_TIMEOUT_MS;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        const onAbort = () => controller.abort();
        (_c = req.signal) == null ? void 0 : _c.addEventListener("abort", onAbort);
        try {
          const res = await fetch(req.url, {
            method: "POST",
            headers,
            body: req.body,
            signal: controller.signal
          });
          const raw = await res.text();
          assertHttpOk(res.status, raw);
          return { status: res.status, data: parseBody(raw), raw };
        } catch (err) {
          if (err instanceof ElectricOpenPlatformError) throw err;
          const aborted = (err == null ? void 0 : err.name) === "AbortError";
          throw new ElectricOpenPlatformError(
            aborted ? TransportCodes.ABORTED : TransportCodes.NETWORK,
            aborted ? "\u8BF7\u6C42\u8D85\u65F6\u6216\u5DF2\u53D6\u6D88" : `\u7F51\u7EDC\u8BF7\u6C42\u5931\u8D25\uFF1A${(_d = err == null ? void 0 : err.message) != null ? _d : err}`,
            { cause: err }
          );
        } finally {
          clearTimeout(timer);
          (_e = req.signal) == null ? void 0 : _e.removeEventListener("abort", onAbort);
        }
      }
    };
  }

  // src/core/transport-cordova.ts
  var CORDOVA_PLUGIN_ID = "ElectricOpenPlatform";
  function resolveCordovaExec() {
    var _a;
    const g = globalThis;
    return typeof ((_a = g.cordova) == null ? void 0 : _a.exec) === "function" ? g.cordova.exec : null;
  }
  function hasCordovaGlobal() {
    const g = globalThis;
    return typeof g.cordova !== "undefined" && g.cordova !== null;
  }
  function createCordovaTransport(options = {}) {
    return {
      name: "cordova-exec",
      async postForm(req) {
        var _a, _b, _c, _d;
        const exec = (_a = options.exec) != null ? _a : resolveCordovaExec();
        if (!exec) {
          throw new ElectricOpenPlatformError(
            TransportCodes.NETWORK,
            "Cordova \u73AF\u5883\u672A\u5C31\u7EEA\uFF08\u627E\u4E0D\u5230 cordova.exec\uFF09\u3002\u8BF7\u786E\u8BA4\u5DF2\u5B89\u88C5\u672C\u63D2\u4EF6\u3001\u5DF2\u6267\u884C cordova prepare\uFF0C\u5E76\u5728 deviceready \u4E4B\u540E\u518D\u8C03\u7528\u3002"
          );
        }
        if ((_b = req.signal) == null ? void 0 : _b.aborted) {
          throw new ElectricOpenPlatformError(TransportCodes.ABORTED, "\u8BF7\u6C42\u5DF2\u53D6\u6D88");
        }
        const headers = __spreadValues({
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          Accept: "application/json, text/plain, */*"
        }, req.headers);
        const timeoutMs = (_c = req.timeoutMs) != null ? _c : DEFAULT_TIMEOUT_MS;
        const native = await new Promise((resolve, reject) => {
          var _a2;
          try {
            exec(
              (data) => resolve(data != null ? data : {}),
              (err) => {
                var _a3;
                const message = typeof err === "string" ? err : (_a3 = err == null ? void 0 : err.message) != null ? _a3 : JSON.stringify(err);
                reject(new ElectricOpenPlatformError(TransportCodes.NETWORK, `\u539F\u751F\u8BF7\u6C42\u5931\u8D25\uFF1A${message}`));
              },
              CORDOVA_PLUGIN_ID,
              "request",
              [{ url: req.url, body: req.body, headers, timeoutMs }]
            );
          } catch (err) {
            reject(
              new ElectricOpenPlatformError(
                TransportCodes.NETWORK,
                `\u8C03\u7528\u539F\u751F\u8BF7\u6C42\u5931\u8D25\uFF1A${(_a2 = err == null ? void 0 : err.message) != null ? _a2 : err}`,
                { cause: err }
              )
            );
          }
        });
        if (native.error) {
          throw new ElectricOpenPlatformError(TransportCodes.NETWORK, `\u7F51\u7EDC\u8BF7\u6C42\u5931\u8D25\uFF1A${native.error}`);
        }
        const raw = (_d = native.body) != null ? _d : "";
        const status = typeof native.status === "number" && native.status > 0 ? native.status : 0;
        if (status === 0) {
          throw new ElectricOpenPlatformError(TransportCodes.NETWORK, "\u539F\u751F\u8BF7\u6C42\u672A\u8FD4\u56DE\u6709\u6548 HTTP \u72B6\u6001");
        }
        assertHttpOk(status, raw);
        return { status, data: parseBody(raw), raw };
      }
    };
  }

  // src/core/transport-capacitor.ts
  function createCapacitorTransport(core) {
    const { Capacitor: Capacitor2, CapacitorHttp: CapacitorHttp2 } = core;
    return {
      name: "capacitor-http",
      async postForm(req) {
        var _a, _b;
        if ((_a = req.signal) == null ? void 0 : _a.aborted) {
          throw new ElectricOpenPlatformError(TransportCodes.ABORTED, "\u8BF7\u6C42\u5DF2\u53D6\u6D88");
        }
        if (!Capacitor2.isNativePlatform()) {
          throw new ElectricOpenPlatformError(
            TransportCodes.NETWORK,
            "\u5F53\u524D\u4E0D\u662F\u539F\u751F\u5E73\u53F0\uFF0CCapacitorHttp \u4E0D\u53EF\u7528\uFF1B\u8BF7\u6539\u7528 fetch \u4F20\u8F93"
          );
        }
        const headers = __spreadValues({
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          Accept: "application/json, text/plain, */*"
        }, req.headers);
        const timeoutMs = (_b = req.timeoutMs) != null ? _b : DEFAULT_TIMEOUT_MS;
        const res = await CapacitorHttp2.post({
          url: req.url,
          headers,
          data: req.body,
          connectTimeout: timeoutMs,
          readTimeout: timeoutMs,
          responseType: "text"
        });
        const raw = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
        assertHttpOk(res.status, raw);
        return { status: res.status, data: parseBody(raw), raw };
      }
    };
  }

  // src/core/http.ts
  var current = createFetchTransport();
  var explicit = false;
  function currentTransportName() {
    return current.name;
  }
  function currentTransport() {
    return current;
  }
  function hasExplicitTransport() {
    return explicit;
  }
  function setTransport(transport) {
    current = transport;
    explicit = true;
  }
  function postForm(req) {
    if (!current) {
      return Promise.reject(
        new ElectricOpenPlatformError(TransportCodes.NETWORK, "\u672A\u914D\u7F6E\u7F51\u7EDC\u4F20\u8F93\u5B9E\u73B0")
      );
    }
    return current.postForm(req);
  }

  // src/core/crypto.ts
  var HEX = "0123456789abcdef";
  function md5(input) {
    const bytes = utf8Bytes(input);
    const words = toWords(bytes);
    const digest = md5Words(words, bytes.length);
    let out = "";
    for (let i = 0; i < 4; i++) {
      const word = digest[i];
      for (let j = 0; j < 4; j++) {
        out += HEX.charAt(word >>> j * 8 + 4 & 15);
        out += HEX.charAt(word >>> j * 8 & 15);
      }
    }
    return out;
  }
  function utf8Bytes(input) {
    const out = [];
    for (let i = 0; i < input.length; i++) {
      let cp = input.charCodeAt(i);
      if (cp >= 55296 && cp <= 56319 && i + 1 < input.length) {
        const next = input.charCodeAt(i + 1);
        if (next >= 56320 && next <= 57343) {
          cp = (cp - 55296 << 10) + (next - 56320) + 65536;
          i++;
        }
      }
      if (cp < 128) {
        out.push(cp);
      } else if (cp < 2048) {
        out.push(192 | cp >> 6, 128 | cp & 63);
      } else if (cp < 65536) {
        out.push(224 | cp >> 12, 128 | cp >> 6 & 63, 128 | cp & 63);
      } else {
        out.push(
          240 | cp >> 18,
          128 | cp >> 12 & 63,
          128 | cp >> 6 & 63,
          128 | cp & 63
        );
      }
    }
    return out;
  }
  function toWords(bytes) {
    const bitLen = bytes.length * 8;
    const withPadding = bytes.slice();
    withPadding.push(128);
    while (withPadding.length % 64 !== 56) withPadding.push(0);
    withPadding.push(bitLen & 255, bitLen >>> 8 & 255, bitLen >>> 16 & 255, bitLen >>> 24 & 255);
    withPadding.push(0, 0, 0, 0);
    const words = [];
    for (let i = 0; i < withPadding.length; i += 4) {
      words.push(
        withPadding[i] | withPadding[i + 1] << 8 | withPadding[i + 2] << 16 | withPadding[i + 3] << 24
      );
    }
    return words;
  }
  var S = [
    7,
    12,
    17,
    22,
    7,
    12,
    17,
    22,
    7,
    12,
    17,
    22,
    7,
    12,
    17,
    22,
    5,
    9,
    14,
    20,
    5,
    9,
    14,
    20,
    5,
    9,
    14,
    20,
    5,
    9,
    14,
    20,
    4,
    11,
    16,
    23,
    4,
    11,
    16,
    23,
    4,
    11,
    16,
    23,
    4,
    11,
    16,
    23,
    6,
    10,
    15,
    21,
    6,
    10,
    15,
    21,
    6,
    10,
    15,
    21,
    6,
    10,
    15,
    21
  ];
  var K = (() => {
    const k = [];
    for (let i = 0; i < 64; i++) k.push(Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0);
    return k;
  })();
  function md5Words(words, byteLen) {
    let a0 = 1732584193;
    let b0 = 4023233417;
    let c0 = 2562383102;
    let d0 = 271733878;
    for (let chunk = 0; chunk < words.length; chunk += 16) {
      const M = words.slice(chunk, chunk + 16);
      let A = a0;
      let B = b0;
      let C = c0;
      let D = d0;
      for (let i = 0; i < 64; i++) {
        let F;
        let g;
        if (i < 16) {
          F = B & C | ~B & D;
          g = i;
        } else if (i < 32) {
          F = D & B | ~D & C;
          g = (5 * i + 1) % 16;
        } else if (i < 48) {
          F = B ^ C ^ D;
          g = (3 * i + 5) % 16;
        } else {
          F = C ^ (B | ~D);
          g = 7 * i % 16;
        }
        F = F + A + K[i] + M[g] | 0;
        A = D;
        D = C;
        C = B;
        B = B + (F << S[i] | F >>> 32 - S[i]) | 0;
      }
      a0 = a0 + A | 0;
      b0 = b0 + B | 0;
      c0 = c0 + C | 0;
      d0 = d0 + D | 0;
    }
    return [a0, b0, c0, d0];
  }
  function formatTimestamp(date = /* @__PURE__ */ new Date()) {
    const pad = (n) => String(n).padStart(2, "0");
    return String(date.getFullYear()) + pad(date.getMonth() + 1) + pad(date.getDate()) + pad(date.getHours()) + pad(date.getMinutes()) + pad(date.getSeconds());
  }
  function formatAlarmTime(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  // src/core/sign.ts
  function signParams({ params, appSecret }) {
    const keys = Object.keys(params).filter((k) => k !== "sign" && params[k] !== null && params[k] !== void 0).sort();
    let raw = "";
    for (const key of keys) raw += stringifyParam(params[key]);
    return md5(raw + appSecret);
  }
  function stringifyParam(value) {
    if (value === null || value === void 0) return "";
    if (typeof value === "boolean") return value ? "true" : "false";
    return String(value);
  }
  function buildSignedRequest(args) {
    var _a, _b;
    const { appKey, appSecret, method, accessToken, params = {} } = args;
    const timestamp = (_b = args.timestamp) != null ? _b : formatTimestamp((_a = args.now) != null ? _a : /* @__PURE__ */ new Date());
    const merged = __spreadProps(__spreadValues({}, params), {
      client_id: appKey,
      method,
      access_token: accessToken,
      timestamp
    });
    const sign = signParams({ params: merged, appSecret });
    const finalParams = { sign };
    for (const [k, v] of Object.entries(merged)) {
      if (v === null || v === void 0) continue;
      finalParams[k] = stringifyParam(v);
    }
    return { body: encodeForm(finalParams), params: finalParams, sign, timestamp };
  }
  function encodeForm(params) {
    return Object.keys(params).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join("&");
  }
  function signAuthCodeSecret(args) {
    return md5(`${args.appKey}authorization_code${args.redirectUri}${args.code}${args.appSecret}`);
  }
  function signRefreshSecret(args) {
    return md5(`${args.appKey}refresh_token${args.redirectUri}${args.refreshToken}${args.appSecret}`);
  }

  // src/core/types.ts
  var DEFAULT_BASE_URL = "https://open.snd02.com";

  // src/core/auth.ts
  var MIN_EXPIRES_IN_SECONDS = 60;
  var AuthManager = class {
    constructor(store, config) {
      this.tokens = null;
      this.inflight = null;
      this.timer = null;
      var _a, _b, _c;
      this.store = store;
      this.logger = config.logger;
      this.config = {
        appKey: config.appKey,
        appSecret: config.appSecret,
        redirectUri: config.redirectUri,
        baseUrl: ((_a = config.baseUrl) != null ? _a : DEFAULT_BASE_URL).replace(/\/+$/, ""),
        timeoutMs: (_b = config.timeoutMs) != null ? _b : 2e4,
        tokenRefreshSkewMs: (_c = config.tokenRefreshSkewMs) != null ? _c : 6e4
      };
    }
    /** Hydrates tokens persisted by a previous app session. */
    async restore() {
      const saved = await this.store.readTokens();
      if (saved && saved.accessToken) {
        this.tokens = saved;
        if (!this.isExpired(saved)) this.scheduleRefresh();
        else this.tokens = null;
        return this.tokens;
      }
      return null;
    }
    get current() {
      return this.tokens;
    }
    /** The redirect-flow login URL, for opening in a browser / InAppBrowser. */
    getAuthorizeUrl(options = {}) {
      const qs = encodeForm(__spreadValues({
        client_id: this.config.appKey,
        response_type: "code",
        redirect_uri: this.config.redirectUri
      }, options.state ? { state: options.state } : {}));
      return `${this.config.baseUrl}/oauth/authorize.as?${qs}`;
    }
    /** Extracts `code` from a redirect URL such as `http://host/receive?code=abc`. */
    static extractCode(url) {
      const match = /[?&#]code=([^&#]+)/.exec(url);
      return match ? decodeURIComponent(match[1]) : null;
    }
    /** Step 1 of the headless flow: POST `/oauth/authverify2.as` for a temporary code. */
    async fetchCode(credentials) {
      var _a;
      const body = encodeForm({
        response_type: "code",
        client_id: this.config.appKey,
        redirect_uri: this.config.redirectUri,
        uname: credentials.username,
        passwd: credentials.password
      });
      const res = await postForm({
        url: `${this.config.baseUrl}/oauth/authverify2.as`,
        body,
        timeoutMs: this.config.timeoutMs
      });
      const payload = res.data;
      if (!payload || typeof payload !== "object" || !payload.code || String(payload.success) !== "true") {
        throw new ElectricOpenPlatformError(
          TransportCodes.OAUTH,
          `\u83B7\u53D6\u6388\u6743\u7801\u5931\u8D25\uFF1A${payload && payload.message || "\u8D26\u53F7\u6216\u5BC6\u7801\u4E0D\u6B63\u786E"}`,
          { details: res.data }
        );
      }
      (_a = this.logger) == null ? void 0 : _a.call(this, { type: "token", message: "\u5DF2\u83B7\u53D6\u4E34\u65F6\u6388\u6743\u7801 code", at: (/* @__PURE__ */ new Date()).toISOString() });
      return payload.code;
    }
    /**
     * Steps 1+2 in one call: headless login with username/password, then store the token.
     * Concurrent calls share the same in-flight handshake.
     */
    async loginWithPassword(username, password) {
      const code = await this.fetchCode({ username, password });
      return this.exchangeCode(code);
    }
    /** Step 2: exchange a code for an access token (`POST /oauth/token.as`). */
    async exchangeCode(code) {
      if (this.inflight) return this.inflight;
      this.inflight = this.doExchangeCode(code).finally(() => {
        this.inflight = null;
      });
      return this.inflight;
    }
    async doExchangeCode(code) {
      const clientSecret = signAuthCodeSecret({
        appKey: this.config.appKey,
        appSecret: this.config.appSecret,
        redirectUri: this.config.redirectUri,
        code
      });
      const body = encodeForm({
        client_id: this.config.appKey,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: this.config.redirectUri,
        code
      });
      const res = await postForm({
        url: `${this.config.baseUrl}/oauth/token.as`,
        body,
        timeoutMs: this.config.timeoutMs
      });
      return this.absorb(res.data, "accessToken");
    }
    /**
     * Returns a usable access token, renewing it first when it is within the skew
     * window. Falls back to a full re-login when the refresh token is gone.
     */
    async getAccessToken(credentials) {
      var _a;
      if (this.tokens && !this.isExpired(this.tokens)) return this.tokens.accessToken;
      if (this.inflight) return (await this.inflight).accessToken;
      if ((_a = this.tokens) == null ? void 0 : _a.refreshToken) {
        try {
          return (await this.refresh()).accessToken;
        } catch (err) {
          this.emit("error", `\u5237\u65B0 accessToken \u5931\u8D25\uFF1A${err.message}`);
          this.tokens = null;
        }
      }
      if ((credentials == null ? void 0 : credentials.username) && credentials.password) {
        return (await this.loginWithPassword(credentials.username, credentials.password)).accessToken;
      }
      throw new ElectricOpenPlatformError(TransportCodes.NOT_CONFIGURED, "accessToken \u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55");
    }
    /** `POST /oauth/refresh.as` */
    async refresh() {
      if (this.inflight) return this.inflight;
      this.inflight = this.doRefresh().finally(() => {
        this.inflight = null;
      });
      return this.inflight;
    }
    async doRefresh() {
      var _a;
      const refreshToken2 = (_a = this.tokens) == null ? void 0 : _a.refreshToken;
      if (!refreshToken2) {
        throw new ElectricOpenPlatformError(TransportCodes.OAUTH, "\u7F3A\u5C11 refreshToken\uFF0C\u65E0\u6CD5\u5237\u65B0");
      }
      const clientSecret = signRefreshSecret({
        appKey: this.config.appKey,
        appSecret: this.config.appSecret,
        redirectUri: this.config.redirectUri,
        refreshToken: refreshToken2
      });
      const body = encodeForm({
        client_id: this.config.appKey,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        redirect_uri: this.config.redirectUri,
        refresh_token: refreshToken2
      });
      const res = await postForm({
        url: `${this.config.baseUrl}/oauth/refresh.as`,
        body,
        timeoutMs: this.config.timeoutMs
      });
      return this.absorb(res.data, "refresh");
    }
    /** Invalidates the platform-side session? No such endpoint exists — clear locally. */
    async logout() {
      this.tokens = null;
      this.clearTimer();
      await this.store.clear();
      this.emit("token", "\u5DF2\u6E05\u9664\u672C\u5730\u6388\u6743");
    }
    /**
     * Converts a platform "token invalid" answer into a fresh access token.
     *
     * Prefers the refresh token (no credential round-trip); falls back to a full
     * headless login when credentials were configured.
     */
    async recover(credentials) {
      var _a;
      if ((_a = this.tokens) == null ? void 0 : _a.refreshToken) {
        try {
          return (await this.refresh()).accessToken;
        } catch (err) {
          this.emit("error", `refresh \u5931\u8D25\uFF0C\u6539\u7528\u8D26\u53F7\u5BC6\u7801\u91CD\u65B0\u767B\u5F55\uFF1A${err.message}`);
        }
      }
      if ((credentials == null ? void 0 : credentials.username) && credentials.password) {
        return (await this.loginWithPassword(credentials.username, credentials.password)).accessToken;
      }
      await this.invalidate();
      throw new ElectricOpenPlatformError(TransportCodes.NOT_CONFIGURED, "\u4F1A\u8BDD\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55");
    }
    /** Called by the client after the platform answers with code `"2"`. */
    async invalidate() {
      this.tokens = null;
      this.clearTimer();
      await this.store.clear();
    }
    dispose() {
      this.clearTimer();
    }
    absorb(payload, origin) {
      var _a, _b, _c, _d, _e;
      const envelope = payload;
      if (!envelope || typeof envelope !== "object" || !envelope.data) {
        throw new ElectricOpenPlatformError(TransportCodes.OAUTH, "\u6388\u6743\u54CD\u5E94\u683C\u5F0F\u5F02\u5E38", { details: payload });
      }
      if (envelope.code !== void 0 && envelope.code !== PlatformCodes.OK) {
        throw new ElectricOpenPlatformError(envelope.code, envelope.message || "\u6388\u6743\u5931\u8D25", {
          details: payload
        });
      }
      const d = envelope.data;
      const accessToken = (_a = d.accessToken) != null ? _a : d.access_token;
      const refreshToken2 = (_c = (_b = d.refreshToken) != null ? _b : d.refresh_token) != null ? _c : "";
      const rawExpires = (_d = d.expiresIn) != null ? _d : d.expires_in;
      const expiresIn = Number(rawExpires != null ? rawExpires : 3600);
      if (!accessToken) {
        throw new ElectricOpenPlatformError(TransportCodes.OAUTH, "\u6388\u6743\u54CD\u5E94\u4E2D\u7F3A\u5C11 accessToken", {
          details: payload
        });
      }
      const ttlSeconds = Number.isFinite(expiresIn) && expiresIn > 0 ? expiresIn : 3600;
      const tokens = {
        accessToken,
        refreshToken: refreshToken2,
        tokenType: ((_e = d.tokenType) != null ? _e : "BEARER").toUpperCase(),
        expiresAt: Date.now() + Math.max(ttlSeconds, MIN_EXPIRES_IN_SECONDS) * 1e3
      };
      this.tokens = tokens;
      this.scheduleRefresh();
      void this.store.writeTokens(tokens);
      this.emit("token", origin === "refresh" ? "accessToken \u5DF2\u5237\u65B0" : "accessToken \u5DF2\u83B7\u53D6", {
        expiresIn: ttlSeconds
      });
      return tokens;
    }
    isExpired(tokens) {
      return tokens.expiresAt - this.config.tokenRefreshSkewMs <= Date.now();
    }
    /**
     * Proactively refreshes shortly before expiry so that a 60 s poller never
     * hits code `"2"`. Browsers throttle long timers, so the client *also* checks
     * lazily on every request — belt and braces.
     */
    scheduleRefresh() {
      var _a, _b, _c;
      this.clearTimer();
      if (!((_a = this.tokens) == null ? void 0 : _a.refreshToken)) return;
      const delay = this.tokens.expiresAt - this.config.tokenRefreshSkewMs - Date.now();
      if (delay <= 0 || delay > 2 ** 31 - 1) return;
      this.timer = setTimeout(() => {
        this.refresh().catch((err) => {
          this.emit("error", `\u5B9A\u65F6\u5237\u65B0\u5931\u8D25\uFF1A${err.message}`);
        });
      }, delay);
      (_c = (_b = this.timer).unref) == null ? void 0 : _c.call(_b);
    }
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }
    emit(type, message, detail) {
      var _a;
      (_a = this.logger) == null ? void 0 : _a.call(this, { type, message, detail, at: (/* @__PURE__ */ new Date()).toISOString() });
    }
  };

  // src/core/host.ts
  function isCapacitorNative() {
    const cap = globalThis.Capacitor;
    return !!cap && typeof cap.isNativePlatform === "function" && cap.isNativePlatform();
  }
  function detectHost() {
    if (isCapacitorNative()) return "capacitor-native";
    if (hasCordovaGlobal() || resolveCordovaExec()) return "cordova";
    if (typeof globalThis.window !== "undefined") return "web";
    return "node";
  }
  async function tryCreateCapacitorTransport() {
    try {
      const core = await Promise.resolve().then(() => (init_capacitor_core_stub(), capacitor_core_stub_exports));
      if (!(core == null ? void 0 : core.CapacitorHttp)) return null;
      return createCapacitorTransport({
        Capacitor: core.Capacitor,
        CapacitorHttp: core.CapacitorHttp
      });
    } catch (e) {
      return null;
    }
  }
  async function resolveTransport(explicit2, preset) {
    if (explicit2) return explicit2;
    if (preset) return preset;
    const host = detectHost();
    if (host === "capacitor-native") {
      const capacitorTransport = await tryCreateCapacitorTransport();
      if (capacitorTransport) return capacitorTransport;
      return resolveCordovaExec() ? createCordovaTransport() : createFetchTransport();
    }
    if (host === "cordova") return createCordovaTransport();
    return createFetchTransport();
  }

  // src/core/push.ts
  var PushApi = class {
    constructor(client2) {
      this.client = client2;
    }
    call(cmd, params = {}) {
      return this.client.call("SUBSCRIBE_PUSH_SERVICE", { params: __spreadValues({ cmd }, params) });
    }
    /** QUERY — inspect the current subscription for a push type. */
    query(pushType) {
      return this.call("QUERY", { pushType });
    }
    /**
     * SUBSCRIBE — also used to modify (same pushType replaces the previous one).
     * IMPORTANT: the platform immediately POSTs a `detect` probe to `url` and
     * fails the call ("url请求错误") unless your endpoint answers `{code:0, msg:<detect>}`.
     */
    subscribe(args) {
      var _a, _b;
      const typeNumbers = Array.isArray(args.typeNumbers) ? args.typeNumbers.join(",") : (_a = args.typeNumbers) != null ? _a : args.pushType === 1 /* Alarm */ ? "-1" : "0";
      return this.call("SUBSCRIBE", {
        pushType: args.pushType,
        url: args.url,
        salt: args.salt,
        timeRanges: args.timeRanges,
        projectCode: (_b = args.projectCode) != null ? _b : "*",
        pushEnable: args.pushEnable,
        typeNumbers,
        pushMode: args.pushMode,
        equipmentTypes: Array.isArray(args.equipmentTypes) ? args.equipmentTypes.join(",") : args.equipmentTypes
      });
    }
    unsubscribe(projectCode = "*") {
      return this.call("UNSUBSCRIBE", { projectCode });
    }
    /** FAILED_CHECK — is the endpoint still healthy? */
    failedCheck(pushType) {
      return this.call("FAILED_CHECK", { pushType });
    }
    /** FAILED_RESET — re-enable pushing after the platform auto-disabled it. */
    failedReset(pushType, pushEnable = 1) {
      return this.call("FAILED_RESET", { pushType, pushEnable });
    }
  };

  // src/core/router.ts
  var ROUTER_PATH = "/invoke/router.as";
  var RESERVED_PARAMS = /* @__PURE__ */ new Set(["client_id", "method", "access_token", "timestamp", "sign"]);
  var RouterClient = class {
    constructor(config, auth, credentials) {
      /** Once any signed call succeeds we can attribute 签名 errors to provisioning. */
      this.hasAnySuccess = false;
      var _a, _b;
      this.auth = auth;
      this.logger = config.logger;
      this.credentials = credentials;
      this.config = {
        appKey: config.appKey,
        appSecret: config.appSecret,
        baseUrl: ((_a = config.baseUrl) != null ? _a : DEFAULT_BASE_URL).replace(/\/+$/, ""),
        timeoutMs: (_b = config.timeoutMs) != null ? _b : 2e4,
        projectCode: config.projectCode
      };
    }
    /**
     * Calls one platform method and returns its `data` payload.
     *
     * @throws ElectricOpenPlatformError for transport failures and non-zero codes.
     */
    async call(method, options = {}) {
      var _a, _b, _c, _d, _e, _f;
      const params = __spreadValues({}, (_a = options.params) != null ? _a : {});
      for (const key of Object.keys(params)) {
        if (RESERVED_PARAMS.has(key)) {
          throw new ElectricOpenPlatformError(
            TransportCodes.INVALID_ARGUMENT,
            `\u53C2\u6570 ${key} \u7531\u63D2\u4EF6\u81EA\u52A8\u751F\u6210\uFF0C\u8BF7\u52FF\u624B\u52A8\u4F20\u5165`,
            { method }
          );
        }
      }
      const projectCode = (_b = options.projectCode) != null ? _b : this.config.projectCode;
      if (projectCode !== void 0 && params.projectCode === void 0) {
        params.projectCode = projectCode;
      }
      const accessToken = await this.auth.getAccessToken(this.credentials());
      const { body, params: signed } = buildSignedRequest({
        appKey: this.config.appKey,
        appSecret: this.config.appSecret,
        method,
        accessToken,
        params
      });
      this.emit("request", method, {
        timestamp: signed.timestamp,
        params: redact(signed)
      });
      const res = await postForm({
        url: `${this.config.baseUrl}${ROUTER_PATH}`,
        body,
        timeoutMs: (_c = options.timeoutMs) != null ? _c : this.config.timeoutMs,
        signal: options.signal
      });
      const envelope = res.data;
      if (!envelope || typeof envelope !== "object") {
        throw new ElectricOpenPlatformError(
          TransportCodes.PARSE,
          "\u63A5\u53E3\u8FD4\u56DE\u683C\u5F0F\u5F02\u5E38\uFF08\u975E JSON \u5BF9\u8C61\uFF09",
          { method, details: res.raw }
        );
      }
      const code = String((_d = envelope.code) != null ? _d : PlatformCodes.FAILED);
      if (code === PlatformCodes.OK) {
        this.hasAnySuccess = true;
        this.emit("response", method, { code, success: envelope.success });
        return envelope.data;
      }
      if ((code === PlatformCodes.TOKEN_EXPIRED || code === PlatformCodes.NOT_LOGGED_IN) && !options._retried) {
        this.emit("error", method, { code, message: "accessToken \u5931\u6548\uFF0C\u6B63\u5728\u5237\u65B0\u540E\u91CD\u8BD5" });
        await this.renewToken(code);
        return this.call(method, __spreadProps(__spreadValues({}, options), { _retried: true }));
      }
      const err = new ElectricOpenPlatformError(code, envelope.message, {
        method,
        details: res.data
      });
      this.emit("error", method, { code, message: envelope.message });
      if (envelope.message && /限额|超过.*次数|quota/i.test(envelope.message)) {
        throw new ElectricOpenPlatformError(TransportCodes.QUOTA, envelope.message, {
          method,
          details: res.data
        });
      }
      const notProvisionedHint = /接口方法参数签名/.test((_e = envelope.message) != null ? _e : "") || /接口名称\(.*\)无效/.test((_f = envelope.message) != null ? _f : "");
      if (notProvisionedHint && this.hasAnySuccess) {
        throw new ElectricOpenPlatformError(
          TransportCodes.NOT_PROVISIONED,
          `\u63A5\u53E3 ${method} \u672A\u5BF9\u5F53\u524D appKey \u5F00\u901A\uFF08\u5E73\u53F0\u63D0\u793A\uFF1A${envelope.message}\uFF09\u3002\u8BF7\u8054\u7CFB\u5E73\u53F0\u5546\u52A1\u5F00\u901A\u8BE5\u63A5\u53E3\u6743\u9650\u3002`,
          { method, details: res.data }
        );
      }
      throw err;
    }
    /** Convenience: call a method that returns a paginated `data` object. */
    async callPaged(method, options = {}) {
      return this.call(method, options);
    }
    async renewToken(code) {
      this.emit("token", "router", { reason: `code=${code}` });
      await this.auth.recover(this.credentials());
    }
    emit(type, method, detail) {
      var _a;
      (_a = this.logger) == null ? void 0 : _a.call(this, { type, method, detail, message: `${type} ${method}`, at: (/* @__PURE__ */ new Date()).toISOString() });
    }
  };
  function redact(params) {
    const copy = __spreadValues({}, params);
    if (copy.sign) copy.sign = `${copy.sign.slice(0, 6)}\u2026`;
    if (copy.access_token) copy.access_token = `${copy.access_token.slice(0, 6)}\u2026`;
    if (copy.passwd) copy.passwd = "***";
    if (copy.client_secret) copy.client_secret = `${copy.client_secret.slice(0, 6)}\u2026`;
    return copy;
  }

  // src/core/storage.ts
  var memory = /* @__PURE__ */ new Map();
  var memoryBackend = {
    name: "memory",
    async get(key) {
      return memory.has(key) ? memory.get(key) : null;
    },
    async set(key, value) {
      memory.set(key, value);
    },
    async remove(key) {
      memory.delete(key);
    }
  };
  function localStorageBackend() {
    try {
      if (typeof globalThis.localStorage === "undefined") return null;
      const probe = "__eop_probe__";
      globalThis.localStorage.setItem(probe, "1");
      globalThis.localStorage.removeItem(probe);
    } catch (e) {
      return null;
    }
    return {
      name: "localStorage",
      async get(key) {
        return globalThis.localStorage.getItem(key);
      },
      async set(key, value) {
        globalThis.localStorage.setItem(key, value);
      },
      async remove(key) {
        globalThis.localStorage.removeItem(key);
      }
    };
  }
  async function preferencesBackend() {
    try {
      const mod = await Promise.resolve().then(() => (init_capacitor_preferences_stub(), capacitor_preferences_stub_exports));
      const { Preferences: Preferences2 } = mod;
      await Preferences2.get({ key: "__eop_probe__" });
      return {
        name: "preferences",
        async get(key) {
          const { value } = await Preferences2.get({ key });
          return value != null ? value : null;
        },
        async set(key, value) {
          await Preferences2.set({ key, value });
        },
        async remove(key) {
          await Preferences2.remove({ key });
        }
      };
    } catch (e) {
      return null;
    }
  }
  async function cordovaBackend() {
    var _a;
    const g = globalThis;
    const exec = (_a = g.cordova) == null ? void 0 : _a.exec;
    if (typeof exec !== "function") return null;
    const call = (action, args) => new Promise((resolve, reject) => {
      try {
        exec(resolve, reject, "ElectricOpenPlatform", action, args);
      } catch (err) {
        reject(err);
      }
    });
    try {
      await call("storageGet", [{ key: "__eop_probe__" }]);
    } catch (e) {
      return null;
    }
    return {
      name: "cordova-preferences",
      async get(key) {
        var _a2;
        const res = await call("storageGet", [{ key }]);
        if (res && typeof res === "object" && "value" in res) return (_a2 = res.value) != null ? _a2 : null;
        return typeof res === "string" ? res : null;
      },
      async set(key, value) {
        await call("storageSet", [{ key, value }]);
      },
      async remove(key) {
        await call("storageRemove", [{ key }]);
      }
    };
  }
  var resolved = null;
  async function resolveBackend(mode = "auto") {
    var _a, _b, _c, _d, _e, _f, _g;
    if (mode === "memory") return memoryBackend;
    if (mode === "localStorage") return (_a = localStorageBackend()) != null ? _a : memoryBackend;
    if (mode === "preferences") return (_b = await preferencesBackend()) != null ? _b : memoryBackend;
    if (mode === "cordova") return (_d = (_c = await cordovaBackend()) != null ? _c : localStorageBackend()) != null ? _d : memoryBackend;
    if (resolved) return resolved;
    resolved = (_g = (_f = (_e = await cordovaBackend()) != null ? _e : await preferencesBackend()) != null ? _f : localStorageBackend()) != null ? _g : memoryBackend;
    return resolved;
  }
  var TokenStore = class {
    constructor(backend, namespace) {
      this.backend = backend;
      this.namespace = namespace;
    }
    key(name) {
      return `eop:${this.namespace}:${name}`;
    }
    async readTokens() {
      const raw = await this.backend.get(this.key("tokens"));
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch (e) {
        await this.backend.remove(this.key("tokens"));
        return null;
      }
    }
    async writeTokens(tokens) {
      await this.backend.set(this.key("tokens"), JSON.stringify(tokens));
    }
    async clear() {
      await this.backend.remove(this.key("tokens"));
    }
    /** The backend actually in use, for diagnostics screens. */
    get backendName() {
      return this.backend.name;
    }
  };

  // src/client.ts
  var ElectricOpenPlatformClient = class {
    constructor() {
      this.credentials = {};
    }
    /**
     * Configures the plugin. Safe to call again (e.g. after the user switches
     * project) — previous timers are released and tokens for the old `appKey` are
     * left untouched on disk.
     */
    async configure(config) {
      var _a;
      assertConfig(config);
      this.dispose();
      this.config = config;
      this.credentials = { username: config.username, password: config.password };
      const backend = await resolveBackend((_a = config.storage) != null ? _a : "auto");
      const store = new TokenStore(backend, config.appKey);
      const auth = new AuthManager(store, config);
      const router = new RouterClient(config, auth, () => this.credentials);
      setTransport(
        await resolveTransport(
          config.transport,
          hasExplicitTransport() ? currentTransport() : void 0
        )
      );
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
      var _a, _b;
      const mode = (_b = (_a = this.config) == null ? void 0 : _a.storage) != null ? _b : "auto";
      return (await resolveBackend(mode)).name;
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
      var _a;
      const auth = this.requireAuth();
      const code = (_a = AuthManager.extractCode(urlOrCode)) != null ? _a : urlOrCode;
      return auth.exchangeCode(code);
    }
    /** Renews the token now instead of waiting for the timer. */
    async refreshToken() {
      return this.requireAuth().refresh();
    }
    get currentToken() {
      var _a, _b;
      return (_b = (_a = this.auth) == null ? void 0 : _a.current) != null ? _b : null;
    }
    async logout() {
      var _a;
      this.credentials = {};
      this.config = this.config ? __spreadProps(__spreadValues({}, this.config), { username: void 0, password: void 0 }) : this.config;
      await ((_a = this.auth) == null ? void 0 : _a.logout());
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
      var _a, _b, _c;
      const c = this.config;
      if (!c) return { configured: false };
      return {
        configured: true,
        appKey: c.appKey,
        appSecret: c.appSecret ? `****${c.appSecret.slice(-4)}` : "",
        redirectUri: c.redirectUri,
        baseUrl: (_a = c.baseUrl) != null ? _a : "https://open.snd02.com",
        projectCode: c.projectCode,
        storage: (_b = c.storage) != null ? _b : "auto",
        /** 运行宿主：cordova / capacitor-native / web / node */
        host: detectHost(),
        /** 实际生效的网络传输实现 */
        transport: currentTransportName(),
        token: ((_c = this.auth) == null ? void 0 : _c.current) ? __spreadProps(__spreadValues({}, this.auth.current), { accessToken: mask(this.auth.current.accessToken) }) : null
      };
    }
    /** Releases timers; call from `ngOnDestroy` / `useEffect` cleanup. */
    dispose() {
      var _a;
      (_a = this.auth) == null ? void 0 : _a.dispose();
      this.auth = void 0;
      this.router = void 0;
    }
    requireAuth() {
      if (!this.auth) throw new Error("\u63D2\u4EF6\u5C1A\u672A\u521D\u59CB\u5316\uFF0C\u8BF7\u5148\u8C03\u7528 configure({ appKey, appSecret, redirectUri })");
      return this.auth;
    }
    requireRouter() {
      if (!this.router) throw new Error("\u63D2\u4EF6\u5C1A\u672A\u521D\u59CB\u5316\uFF0C\u8BF7\u5148\u8C03\u7528 configure()");
      return this.router;
    }
  };
  function assertConfig(config) {
    const missing = [];
    if (!config.appKey) missing.push("appKey");
    if (!config.appSecret) missing.push("appSecret");
    if (!config.redirectUri) missing.push("redirectUri");
    if (missing.length) throw new Error(`\u7F3A\u5C11\u5FC5\u586B\u914D\u7F6E\uFF1A${missing.join(", ")}`);
    if (config.redirectUri && !/^https?:\/\//i.test(config.redirectUri)) {
      throw new Error("redirectUri \u5FC5\u987B\u662F http(s) \u7EDD\u5BF9\u5730\u5740\uFF08\u4F1A\u53C2\u4E0E\u7B7E\u540D\uFF0C\u9700\u4E0E\u5E73\u53F0\u767B\u8BB0\u4E00\u81F4\uFF09");
    }
  }
  function secondsUntil(epochMs) {
    return Math.max(0, Math.round((epochMs - Date.now()) / 1e3));
  }
  function mask(token) {
    return token.length <= 8 ? "****" : `${token.slice(0, 6)}\u2026${token.slice(-4)}`;
  }
  var ElectricOpenPlatform = new ElectricOpenPlatformClient();

  // cordova/src/entry-cordova.ts
  var client = new ElectricOpenPlatformClient();
  async function configure(config) {
    return client.configure(config);
  }
  function login(username, password) {
    return client.login(username, password);
  }
  function logout() {
    return client.logout();
  }
  function getAuthorizeUrl(options) {
    return client.getAuthorizeUrl(options);
  }
  function handleRedirect(urlOrCode) {
    return client.handleRedirect(urlOrCode);
  }
  function refreshToken() {
    return client.refreshToken();
  }
  function getAccessToken() {
    var _a, _b;
    return (_b = (_a = client.currentToken) == null ? void 0 : _a.accessToken) != null ? _b : null;
  }
  function invoke(method, params) {
    return client.invoke(method, params);
  }
  function describe() {
    return client.describe();
  }
  async function storageBackend() {
    return client.storageBackend();
  }
  async function diagnostics() {
    return __spreadValues({
      host: detectHost(),
      storage: await client.storageBackend()
    }, client.describe());
  }
  function dispose() {
    client.dispose();
  }
  var project = {
    getInfo: (pc) => client.project.getInfo(pc),
    modifyInfo: (f) => client.project.modifyInfo(f),
    dayStats: (a) => client.project.dayStats(a)
  };
  var box = {
    list: (a) => client.box.list(a),
    listOnline: (a) => client.box.listOnline(a),
    get: (mac, pc) => client.box.get(mac, pc),
    positionTree: (pc) => client.box.positionTree(pc),
    properties: (a) => client.box.properties(a),
    modifyProperties: (a) => client.box.modifyProperties(a),
    modifyInfo: (a) => client.box.modifyInfo(a),
    setRealtimeRate: (a) => client.box.setRealtimeRate(a),
    onlineHistory: (a) => client.box.onlineHistory(a)
  };
  var channel = {
    realtime: (a) => client.channel.realtime(a),
    realtimeChannels: (a) => client.channel.realtimeChannels(a),
    list: (a) => client.channel.list(a),
    channelsOc: (a) => client.channel.channelsOc(a),
    history: (a) => client.channel.history(a)
  };
  var control = {
    control: (a) => client.control.control(a),
    switchCircuit: (a) => client.control.switchCircuit(a),
    batchSwitch: (a) => client.control.batchSwitch(a),
    updateCircuit: (a) => client.control.updateCircuit(a),
    remoteLock: (a) => client.control.remoteLock(a),
    unlockAbnormal: (a) => client.control.unlockAbnormal(a),
    setVisibility: (a) => client.control.setVisibility(a),
    setControl: (a) => client.control.setControl(a),
    setAutoLeakage: (a) => client.control.setAutoLeakage(a),
    getTimers: (a) => client.control.getTimers(a),
    getLeakageCheck: (a) => client.control.getLeakageCheck(a)
  };
  var alarm = {
    list: (a) => client.alarm.list(a),
    listAll: (a) => client.alarm.listAll(a),
    byType: (a) => client.alarm.byType(a),
    maintenance: (a) => client.alarm.maintenance(a),
    urged: (a) => client.alarm.urged(a),
    boxMaintenanceHistory: (a) => client.alarm.boxMaintenanceHistory(a)
  };
  var stats = {
    day: (a) => client.stats.day(a),
    hour: (a) => client.stats.hour(a),
    month: (a) => client.stats.month(a),
    totalElectricity: (rows) => client.stats.totalElectricity(rows)
  };
  var scene = {
    list: (pc) => client.scene.list(pc),
    execute: (a) => client.scene.execute(a)
  };
  var push = {
    query: (t) => client.push.query(t),
    subscribe: (a) => client.push.subscribe(a),
    unsubscribe: (pc) => client.push.unsubscribe(pc),
    failedCheck: (t) => client.push.failedCheck(t),
    failedReset: (t, e) => client.push.failedReset(t, e)
  };
  var thirdparty = {
    status: (a) => client.thirdparty.status(a),
    statusParsed: (a) => client.thirdparty.statusParsed(a),
    listDevices: (a) => client.thirdparty.listDevices(a)
  };
  function setTransportImpl(transport) {
    setTransport(transport);
  }
  return __toCommonJS(entry_cordova_exports);
})();


// ===================== Cordova 全局挂载 =====================
(function (root, ns) {
  if (!ns) return;
  var api = {
    configure: ns.configure,
    login: ns.login,
    logout: ns.logout,
    getAuthorizeUrl: ns.getAuthorizeUrl,
    handleRedirect: ns.handleRedirect,
    refreshToken: ns.refreshToken,
    getAccessToken: ns.getAccessToken,
    invoke: ns.invoke,
    describe: ns.describe,
    diagnostics: ns.diagnostics,
    storageBackend: ns.storageBackend,
    dispose: ns.dispose,
    setTransport: ns.setTransport,
    detectHost: ns.detectHost,
    // 业务分组：每个方法都转成 Promise，返回值与 Capacitor 版一致
    project: ns.project,
    box: ns.box,
    channel: ns.channel,
    control: ns.control,
    alarm: ns.alarm,
    stats: ns.stats,
    scene: ns.scene,
    push: ns.push,
    thirdparty: ns.thirdparty,
    // 工具与错误类型
    md5: ns.md5,
    signParams: ns.signParams,
    formatTimestamp: ns.formatTimestamp,
    ElectricOpenPlatformError: ns.ElectricOpenPlatformError,
    PlatformCodes: ns.PlatformCodes,
    TransportCodes: ns.TransportCodes,
    AlarmType: ns.AlarmType,
    PushType: ns.PushType,
    EquipmentType: ns.EquipmentType,
    ThirdPartyEquipmentType: ns.ThirdPartyEquipmentType
  };

  if (root.cordova) {
    root.cordova.plugins = root.cordova.plugins || {};
    root.cordova.plugins.electricOpenPlatform = api;
  }
  root.ElectricOpenPlatform = api;

  // Cordova deviceready 之前 cordova 可能尚未注入，补一次
  document.addEventListener && document.addEventListener('deviceready', function () {
    if (root.cordova) {
      root.cordova.plugins = root.cordova.plugins || {};
      root.cordova.plugins.electricOpenPlatform = api;
    }
    root.ElectricOpenPlatform = api;
  }, false);
})(typeof window !== 'undefined' ? window : this, __EOP);
