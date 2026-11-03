/**
 * Cordova 入口：把共用核心包装成「全局对象 + Promise 方法」。
 *
 * Cordova 没有 ESM 模块解析，调用方通过：
 *   window.ElectricOpenPlatform.xxx()   或
 *   cordova.plugins.electricOpenPlatform.xxx()
 *
 * 用法与 Capacitor 版一致，只是不 import：
 *   await ElectricOpenPlatform.configure({...});
 *   await ElectricOpenPlatform.login('u', 'p');
 *   const boxes = await ElectricOpenPlatform.box.list();
 */
import { ElectricOpenPlatformClient } from '../../src/client.js';
import { detectHost } from '../../src/core/host.js';
import { setTransport } from '../../src/core/http.js';
import { createCordovaTransport } from '../../src/core/transport-cordova.js';
import {
  ElectricOpenPlatformError,
  PlatformCodes,
  TransportCodes,
} from '../../src/core/errors.js';
import { md5, formatTimestamp, formatAlarmTime } from '../../src/core/crypto.js';
import { signParams } from '../../src/core/sign.js';
import {
  AlarmType,
  EquipmentType,
  PushType,
  ThirdPartyEquipmentType,
} from '../../src/core/models.js';

const client = new ElectricOpenPlatformClient();

/** 单例配置。 */
export async function configure(config: Parameters<ElectricOpenPlatformClient['configure']>[0]) {
  return client.configure(config);
}

export function login(username: string, password: string) {
  return client.login(username, password);
}

export function logout() {
  return client.logout();
}

export function getAuthorizeUrl(options?: { state?: string }) {
  return client.getAuthorizeUrl(options);
}

export function handleRedirect(urlOrCode: string) {
  return client.handleRedirect(urlOrCode);
}

export function refreshToken() {
  return client.refreshToken();
}

/** 当前 accessToken（未登录返回 null）。 */
export function getAccessToken(): string | null {
  return client.currentToken?.accessToken ?? null;
}

export function invoke<T = unknown>(method: string, params?: Record<string, unknown>) {
  return client.invoke<T>(method, params as never);
}

export function describe() {
  return client.describe();
}

export async function storageBackend() {
  return client.storageBackend();
}

/** 诊断信息：宿主、传输实现、脱敏配置。 */
export async function diagnostics() {
  return {
    host: detectHost(),
    storage: await client.storageBackend(),
    ...client.describe(),
  };
}

export function dispose() {
  client.dispose();
}

/**
 * 业务分组访问器。
 *
 * Cordova 侧没有 ES 模块解析，所以不能在加载时解构 client 的字段
 * （那时还未 configure）。这里用 getter 包一层，让每次访问都取到
 * configure() 之后注入的真实实例。
 */
export const project = {
  getInfo: (pc?: string) => client.project.getInfo(pc),
  modifyInfo: (f: never) => client.project.modifyInfo(f),
  dayStats: (a: never) => client.project.dayStats(a),
};

export const box = {
  list: (a?: never) => client.box.list(a),
  listOnline: (a?: never) => client.box.listOnline(a),
  get: (mac: string, pc?: string) => client.box.get(mac, pc),
  positionTree: (pc?: string) => client.box.positionTree(pc),
  properties: (a: never) => client.box.properties(a),
  modifyProperties: (a: never) => client.box.modifyProperties(a),
  modifyInfo: (a: never) => client.box.modifyInfo(a),
  setRealtimeRate: (a: never) => client.box.setRealtimeRate(a),
  onlineHistory: (a: never) => client.box.onlineHistory(a),
};

export const channel = {
  realtime: (a: never) => client.channel.realtime(a),
  realtimeChannels: (a: never) => client.channel.realtimeChannels(a),
  list: (a: never) => client.channel.list(a),
  channelsOc: (a: never) => client.channel.channelsOc(a),
  history: (a: never) => client.channel.history(a),
};

export const control = {
  control: (a: never) => client.control.control(a),
  switchCircuit: (a: never) => client.control.switchCircuit(a),
  batchSwitch: (a: never) => client.control.batchSwitch(a),
  updateCircuit: (a: never) => client.control.updateCircuit(a),
  remoteLock: (a: never) => client.control.remoteLock(a),
  unlockAbnormal: (a: never) => client.control.unlockAbnormal(a),
  setVisibility: (a: never) => client.control.setVisibility(a),
  setControl: (a: never) => client.control.setControl(a),
  setAutoLeakage: (a: never) => client.control.setAutoLeakage(a),
  getTimers: (a: never) => client.control.getTimers(a),
  getLeakageCheck: (a: never) => client.control.getLeakageCheck(a),
};

export const alarm = {
  list: (a: never) => client.alarm.list(a),
  listAll: (a: never) => client.alarm.listAll(a),
  byType: (a: never) => client.alarm.byType(a),
  maintenance: (a: never) => client.alarm.maintenance(a),
  urged: (a: never) => client.alarm.urged(a),
  boxMaintenanceHistory: (a: never) => client.alarm.boxMaintenanceHistory(a),
};

export const stats = {
  day: (a: never) => client.stats.day(a),
  hour: (a: never) => client.stats.hour(a),
  month: (a: never) => client.stats.month(a),
  totalElectricity: (rows: never) => client.stats.totalElectricity(rows),
};

export const scene = {
  list: (pc?: string) => client.scene.list(pc),
  execute: (a: never) => client.scene.execute(a),
};

export const push = {
  query: (t: never) => client.push.query(t),
  subscribe: (a: never) => client.push.subscribe(a),
  unsubscribe: (pc?: string) => client.push.unsubscribe(pc),
  failedCheck: (t: never) => client.push.failedCheck(t),
  failedReset: (t: never, e?: never) => client.push.failedReset(t, e),
};

export const thirdparty = {
  status: (a: never) => client.thirdparty.status(a),
  statusParsed: (a: never) => client.thirdparty.statusParsed(a),
  listDevices: (a: never) => client.thirdparty.listDevices(a),
};

/** 强制指定传输实现（一般无需调用，configure 会自动选择）。 */
export function setTransportImpl(transport: Parameters<typeof setTransport>[0]) {
  setTransport(transport);
}

export {
  client,
  createCordovaTransport,
  ElectricOpenPlatformError,
  PlatformCodes,
  TransportCodes,
  md5,
  signParams,
  formatTimestamp,
  formatAlarmTime,
  AlarmType,
  EquipmentType,
  PushType,
  ThirdPartyEquipmentType,
  detectHost,
};
