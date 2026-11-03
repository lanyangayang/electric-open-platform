/**
 * 用模拟的 Cordova exec 桥，跑完整的真实平台调用。
 *
 * 目的：证明「Cordova 传输 → 核心签名/认证 → 真实 open.snd02.com」这条链路
 * 是通的，而不是只有单元测试层面的 mock 通过。
 *
 * 这里在 Node 里用 https 模块模拟原生侧的 HttpURLConnection 行为：
 * 发 POST form-urlencoded，返回 { status, body }。
 */
import https from 'node:https';
import { createCordovaTransport } from '../dist/esm/core/transport-cordova.js';
import { setTransport } from '../dist/esm/core/http.js';

/** 等价于 Android 的 HttpURLConnection POST。 */
function nativePost({ url, body, headers }) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: 'POST',
        headers: { ...headers, 'Content-Length': Buffer.byteLength(body) },
        timeout: 20000,
      },
      (res) => {
        let text = '';
        res.setEncoding('utf8');
        res.on('data', (d) => (text += d));
        res.on('end', () => resolve({ status: res.statusCode, body: text }));
      },
    );
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/** 模拟 cordova.exec(成功, 失败, 服务名, 动作, 参数) */
function fakeCordovaExec(success, error, service, action, args) {
  if (service !== 'ElectricOpenPlatform') return error(`unknown service ${service}`);
  if (action !== 'request') return error(`unknown action ${action}`);
  nativePost(args[0]).then(success, (e) => error(e.message));
}

// ---- 把 Cordova 传输装进插件 ----
setTransport(createCordovaTransport({ exec: fakeCordovaExec }));

const { ElectricOpenPlatform } = await import('../dist/esm/index.js');

await ElectricOpenPlatform.configure({
  appKey: process.env.EOP_APP_KEY,
  appSecret: process.env.EOP_APP_SECRET,
  redirectUri: process.env.EOP_REDIRECT,
  projectCode: process.env.EOP_PROJECT,
  storage: 'memory',
});

console.log('宿主/传输:', ElectricOpenPlatform.describe().transport);

const login = await ElectricOpenPlatform.login(process.env.EOP_USER, process.env.EOP_PASS);
console.log(`✓ login — expiresIn=${login.expiresIn}s`);

const project = await ElectricOpenPlatform.project.getInfo();
console.log(`✓ GET_PROJECT_INFO — ${project.projectName}`);

const boxes = await ElectricOpenPlatform.box.list();
console.log(`✓ GET_BOXES — ${boxes.length} 台设备`);

const mac = boxes[0].mac;
const channels = await ElectricOpenPlatform.channel.realtimeChannels({ mac });
console.log(`✓ GET_BOX_CHANNELS_REALTIME — ${channels.length} 条线路`);

const stats = await ElectricOpenPlatform.stats.day({
  mac,
  year: String(new Date().getFullYear()),
  month: String(new Date().getMonth() + 1).padStart(2, '0'),
});
console.log(`✓ GET_BOXES_DAY_STATS — ${Object.keys(stats).length} 台有数据`);

const refreshed = await ElectricOpenPlatform.refreshToken();
console.log(`✓ oauth/refresh.as — 新 token ${refreshed.accessToken.slice(0, 6)}…`);

console.log('\nCordova 传输链路验证通过。');
