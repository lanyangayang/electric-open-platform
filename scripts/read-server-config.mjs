/**
 * 读取设备当前的「服务器指向」相关属性。
 * GET_BOX_PROPERTIES (nodeType=COMM) 返回的设备属性中，
 * server / serverPort 即设备上报的目标服务器。
 */
import { ElectricOpenPlatform, ElectricOpenPlatformError } from '../dist/esm/index.js';

const P = process.env.EOP_PROJECT;

await ElectricOpenPlatform.configure({
  appKey: process.env.EOP_APP_KEY,
  appSecret: process.env.EOP_APP_SECRET,
  redirectUri: process.env.EOP_REDIRECT,
  projectCode: P,
  storage: 'memory',
});
await ElectricOpenPlatform.login(process.env.EOP_USER, process.env.EOP_PASS);

const boxes = await ElectricOpenPlatform.box.list();
console.log(`项目设备: ${boxes.length} 台\n`);

// 只读：不改任何配置
for (const b of boxes.slice(0, 4)) {
  try {
    const props = await ElectricOpenPlatform.box.properties({ mac: b.mac, nodeType: 'COMM' });
    const node = props?.['0'] ?? Object.values(props ?? {})[0] ?? props;
    const pick = (k) => (node && typeof node === 'object' ? node[k] : undefined);
    console.log(
      `${b.mac}  ${String(b.aliasName || '').padEnd(10)}  ` +
        `server=${String(pick('server') ?? '-').padEnd(16)} ` +
        `port=${String(pick('serverPort') ?? '-').padEnd(6)} ` +
        `protocol=${String(pick('protocol') ?? '-').padEnd(5)} ` +
        `localIp=${pick('localIp') ?? '-'}`,
    );
  } catch (err) {
    const e = err instanceof ElectricOpenPlatformError ? err : null;
    console.log(`${b.mac}  读取失败 [${e?.code}] ${e?.message}`);
  }
}
