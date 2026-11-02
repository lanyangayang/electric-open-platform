/**
 * 判定 GET_BOX 失败的真实原因。
 *
 * 平台对「未开通接口」的提示是 `无效的接口方法参数签名！`，与真正的签名错误
 * 文字完全一样，所以必须用对照实验区分：
 *   A. 同参数用 GET_BOXES 调用 -> 若成功，说明签名机制正常；
 *   B. GET_BOX 变换参数组合 -> 若全部以相同文案失败，指向接口级不可用；
 *   C. 故意破坏签名调 GET_BOXES -> 应得到同样的文案，证明该文案有两种含义。
 */
import { ElectricOpenPlatform, ElectricOpenPlatformError, signParams, formatTimestamp, md5 } from '../dist/esm/index.js';

const KEY = process.env.EOP_APP_KEY;
const SECRET = process.env.EOP_APP_SECRET;
const P = process.env.EOP_PROJECT;
const MAC = process.env.EOP_MAC ?? '98CC4D13AE24';

await ElectricOpenPlatform.configure({
  appKey: KEY,
  appSecret: SECRET,
  redirectUri: process.env.EOP_REDIRECT,
  projectCode: P,
  storage: 'memory',
});
await ElectricOpenPlatform.login(process.env.EOP_USER, process.env.EOP_PASS);
const token = ElectricOpenPlatform.currentToken.accessToken;

async function raw(method, extra, badSign = false) {
  const params = {
    client_id: KEY,
    method,
    access_token: token,
    timestamp: formatTimestamp(),
    projectCode: P,
    ...extra,
  };
  const sign = badSign ? md5('deliberately-wrong') : signParams({ params, appSecret: SECRET });
  const body = new URLSearchParams({ ...params, sign }).toString();
  const res = await fetch('https://open.snd02.com/invoke/router.as', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
    body,
  });
  return (await res.text()).replace(/\s+/g, ' ').slice(0, 130);
}

console.log('A. 对照：GET_BOXES 正常签名');
console.log('   ', await raw('GET_BOXES', {}));

console.log('\nB. GET_BOX 多种参数组合');
for (const extra of [{ mac: MAC }, { mac: MAC, projectCode: P }, { mac: MAC, nodeType: 'COMM' }]) {
  console.log(`    ${JSON.stringify(extra).padEnd(48)}`, await raw('GET_BOX', extra));
}

console.log('\nC. 故意破坏签名（GET_BOXES）');
console.log('   ', await raw('GET_BOXES', {}, true));

console.log('\nD. 一个确定不存在的方法（对照「接口名称无效」文案）');
console.log('   ', await raw('GET_BOX_DOES_NOT_EXIST', {}));

process.exit(0);
