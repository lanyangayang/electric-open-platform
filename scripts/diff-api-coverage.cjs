/**
 * 对照「文档声明的接口」与「插件实际封装的接口」。
 *
 * 数据来源：
 *  - 文档：_docs2_txt/*.txt（由 parse-docs.cjs 生成）
 *  - 源码：src/core/*.ts 中含大写方法名字面量的调用
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TXT_DIR = path.join(ROOT, '_docs2_txt');
const SRC_DIR = path.join(ROOT, 'src/core');

/** 非业务接口页面 */
const NON_API = new Set([
  'intro',
  'applicationAccess',
  'getAccessToken',
  'apiCallDescription',
  'interfaceCommonParameters',
  'globalReturnCode',
  'apiInterfaceDateLimit',
  'frequentlyAskedQuestions',
  'alarmMessagePush',
  'channelMessagePush',
  'eventNoticePush',
]);

const TYPE_WORDS = new Set([
  'string', 'String', 'int', 'Int', 'long', 'Long', 'byte', 'Byte',
  'boolean', 'Boolean', 'float', 'Float', 'double', 'Double',
  'array', 'Array', 'List', 'Date', 'json', 'JSON',
]);

/** 提取单页文档的接口信息。 */
function parsePage(pgn) {
  const text = fs.readFileSync(path.join(TXT_DIR, `${pgn}.txt`), 'utf8');
  const nameMatch = text.match(/接口名称\s*\|\s*([A-Z][A-Z0-9_]{2,})/);
  const method = nameMatch ? nameMatch[1] : null;
  if (!method || NON_API.has(pgn)) return null;

  const start = text.indexOf('提交参数');
  const end = text.indexOf('返回值');
  const params = [];

  if (start >= 0) {
    const lines = text
      .slice(start, end > start ? end : undefined)
      .split('\n')
      .map((l) => l.trim().replace(/\s*\|\s*$/, '').trim());

    for (let i = 0; i + 2 < lines.length; i++) {
      const name = lines[i];
      const type = lines[i + 1];
      const required = lines[i + 2];
      if (!/^[a-zA-Z][\w.]*$/.test(name)) continue;
      if (!TYPE_WORDS.has(type)) continue;
      if (required !== '是' && required !== '否') continue;
      if (params.some((p) => p.name === name)) continue;
      params.push({ name, type, required: required === '是' });
      i += 2;
    }
  }

  return { pgn, method, params };
}

/** 源码中出现的所有 platform 方法名字面量。 */
function collectImplemented() {
  const found = new Set();
  for (const file of fs.readdirSync(SRC_DIR)) {
    if (!file.endsWith('.ts')) continue;
    const text = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');
    // 只认全大写的标识符字面量，避免把类名/字段名算进来。
    // 每个文件新建一个正则：带 g 标志的正则会在多次 exec 间保留 lastIndex，
    // 复用同一个正则跨文件扫描会漏匹配。
    const re = /['"`]([A-Z][A-Z0-9]*_[A-Z0-9_]+|[A-Z]{4,})['"`]/g;
    let hit;
    while ((hit = re.exec(text)) !== null) found.add(hit[1]);
  }
  return found;
}

const documented = fs
  .readdirSync(TXT_DIR)
  .filter((f) => f.endsWith('.txt'))
  .map((f) => parsePage(path.basename(f, '.txt')))
  .filter(Boolean)
  .sort((a, b) => a.method.localeCompare(b.method));

const implemented = collectImplemented();
const missing = documented.filter((a) => !implemented.has(a.method));

console.log(`文档接口总数: ${documented.length}`);
console.log('');
console.log('方法名'.padEnd(36) + '封装'.padEnd(8) + '必选参数 / 全部参数');
console.log('-'.repeat(64));
for (const a of documented) {
  const done = implemented.has(a.method);
  const req = a.params.filter((p) => p.required).map((p) => p.name);
  const all = a.params.map((p) => p.name);
  const summary = `${req.join(',') || '-'} / ${all.join(',') || '-'}`;
  console.log(a.method.padEnd(36) + (done ? '✓' : '✗').padEnd(8) + summary);
}

console.log('');
console.log(`未封装: ${missing.length} 个`);
for (const m of missing) {
  console.log(`  - ${m.method} (${m.pgn})`);
  for (const p of m.params) {
    console.log(`      ${p.required ? '*' : ' '} ${p.name}: ${p.type}`);
  }
}

fs.writeFileSync(
  path.join(ROOT, '_api-manifest.json'),
  JSON.stringify({ documented, missing: missing.map((m) => m.method) }, null, 2),
  'utf8',
);
console.log('\n清单已写入 _api-manifest.json');
