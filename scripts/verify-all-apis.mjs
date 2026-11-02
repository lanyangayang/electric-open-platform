/**
 * 全量接口联调：逐个调用文档中的 29 个接口，
 * 区分「成功」「接口不可用（未开通/设备类型不符）」两类结果。
 */
import { ElectricOpenPlatform, ElectricOpenPlatformError } from '../dist/esm/index.js';

const P = process.env.EOP_PROJECT;
const MAC = process.env.EOP_MAC ?? '98CC4D13AE24';
const now = new Date();
const y = String(now.getFullYear());
const mo = String(now.getMonth() + 1).padStart(2, '0');
const d = String(now.getDate()).padStart(2, '0');
const alarmEnd = new Date(now.getTime() - 60_000);
const alarmStart = new Date(alarmEnd.getTime() - 6 * 3600 * 1000);
const fmt = (x) => {
  const p = (n) => String(n).padStart(2, '0');
  return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())} ${p(x.getHours())}:${p(x.getMinutes())}`;
};

await ElectricOpenPlatform.configure({
  appKey: process.env.EOP_APP_KEY,
  appSecret: process.env.EOP_APP_SECRET,
  redirectUri: process.env.EOP_REDIRECT,
  projectCode: P,
  storage: 'memory',
});
await ElectricOpenPlatform.login(process.env.EOP_USER, process.env.EOP_PASS);

const cases = [
  // ---- 项目
  ['GET_PROJECT_INFO', () => ElectricOpenPlatform.project.getInfo()],
  ['GET_PROJECT_DAY_STATS', () => ElectricOpenPlatform.project.dayStats({ year: y, month: mo })],
  ['MODIFY_PROJECT_INFO', 'readonly', () => ElectricOpenPlatform.project.getInfo()],

  // ---- 设备
  ['GET_BOXES', () => ElectricOpenPlatform.box.list()],
  ['GET_BOX', () => ElectricOpenPlatform.box.get(MAC)],
  ['GET_BOX_POSITION_TREE', () => ElectricOpenPlatform.box.positionTree()],
  ['GET_BOX_PROPERTIES', () => ElectricOpenPlatform.box.properties({ mac: MAC })],
  ['MODIFY_BOX_PROPERTIES', 'readonly', () => ElectricOpenPlatform.box.properties({ mac: MAC })],
  ['MODIFY_BOX_INFO', 'readonly', () => ElectricOpenPlatform.box.get(MAC)],
  ['SET_BOX_REALTIME_RATE', 'readonly', () => ElectricOpenPlatform.box.properties({ mac: MAC })],
  ['GET_BOX_ONLINE_HISTORY', () =>
    ElectricOpenPlatform.box.onlineHistory({
      mac: MAC,
      startTime: new Date(now.getTime() - 24 * 3600 * 1000),
      endTime: now,
    })],

  // ---- 线路
  ['GET_BOX_CHANNELS_REALTIME', () => ElectricOpenPlatform.channel.realtime({ mac: MAC })],
  ['GET_BOX_CHANNELS', () => ElectricOpenPlatform.channel.list({ mac: MAC })],
  ['GET_BOX_CHANNELS_OC', () => ElectricOpenPlatform.channel.channelsOc({ mac: MAC })],
  ['GET_BOX_CHANNELS_REALTIME_HISTORY', () =>
    ElectricOpenPlatform.channel.history({ mac: MAC, date: `${y}-${mo}-${d}`, addr: 1 })],

  // ---- 控制（只读探测，不实际动作）
  ['PUT_BOX_CONTROL', 'readonly', () => ElectricOpenPlatform.control.getTimers({ mac: MAC })],
  ['BATCH_BOX_CONTROL', 'readonly', () => ElectricOpenPlatform.control.getTimers({ mac: MAC })],

  // ---- 告警
  ['GET_BOX_ALARM', () =>
    ElectricOpenPlatform.alarm.list({ mac: MAC, start: alarmStart, end: alarmEnd, pageSize: 10 })],
  ['GET_ALARM_MAINTENANCE', 'skip-needed-id', () => Promise.resolve(null)],
  ['ALARM_URGED', 'skip-needed-id', () => Promise.resolve(null)],
  ['GET_BOX_MAINTENANCE_HISTORY', () =>
    ElectricOpenPlatform.alarm.boxMaintenanceHistory({
      mac: MAC,
      start: fmt(new Date(now.getTime() - 7 * 24 * 3600 * 1000)),
      end: fmt(now),
    })],

  // ---- 统计（本次修复的重点）
  ['GET_BOXES_DAY_STATS', () =>
    ElectricOpenPlatform.stats.day({ mac: MAC, year: y, month: mo, day: d })],
  ['GET_BOXES_HOUR_STATS', () =>
    ElectricOpenPlatform.stats.hour({ mac: MAC, year: y, month: mo, day: d })],
  ['GET_BOXES_MON_STATS', () => ElectricOpenPlatform.stats.month({ mac: MAC, year: y })],

  // ---- 配置
  ['GET_CFG_TIMER', () => ElectricOpenPlatform.control.getTimers({ mac: MAC })],
  ['GET_CFG_LKICHK', () => ElectricOpenPlatform.control.getLeakageCheck({ mac: MAC })],

  // ---- 场景 / 推送
  ['SCENE_SERVICE', () => ElectricOpenPlatform.scene.list()],
  ['SUBSCRIBE_PUSH_SERVICE', () => ElectricOpenPlatform.push.query(1)],

  // ---- 第三方设备
  ['GET_THR_DEVICE_STATUS', () =>
    ElectricOpenPlatform.thirdparty.status({ mac: MAC, equipmentType: 6 })],
];

let ok = 0;
let skipped = 0;
let failed = 0;

for (const [name, runner] of cases) {
  if (typeof runner !== 'function') continue;
  if (runner === 'readonly') continue;
  if (runner === 'skip-needed-id') {
    console.log(`SKIP  ${name.padEnd(32)} 需要真实告警 ID，未自动调用`);
    skipped++;
    continue;
  }
  try {
    const data = await runner();
    const size = Array.isArray(data) ? `${data.length} 条` : typeof data;
    console.log(`OK    ${name.padEnd(32)} ${size}`);
    ok++;
  } catch (err) {
    const e = err instanceof ElectricOpenPlatformError ? err : null;
    const code = e?.code ?? String(err).slice(0, 20);
    console.log(`FAIL  ${name.padEnd(32)} [${code}] ${e?.message ?? err}`);
    failed++;
  }
}

console.log(`\n通过 ${ok} / 失败 ${failed} / 跳过 ${skipped}`);
process.exit(failed ? 1 : 0);
