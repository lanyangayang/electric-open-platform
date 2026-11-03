#!/usr/bin/env node
/**
 * 版本一致性检查。
 *
 * 这个仓库会发布两个 npm 包，版本必须完全对齐，否则会出现
 * 「npm 上是最新版、cordova 子包还是旧版」这类难查的问题：
 *   1. 根 package.json            → @mantunsci/cordova-electric-open-platform
 *   2. cordova/package.json       → cordova-plugin-mantunsci-electric
 *   3. cordova/plugin.xml         → Cordova 安装时记录的版本（cordova_plugins.js metadata）
 *
 * 用法：
 *   node scripts/check-versions.mjs               # 只检查三者是否一致
 *   node scripts/check-versions.mjs 0.2.3         # 额外要求等于指定版本（CI 里传 tag）
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');

const rootPkg = JSON.parse(read('package.json'));
const cordovaPkg = JSON.parse(read('cordova/package.json'));
const pluginXml = read('cordova/plugin.xml');

// 注意：plugin.xml 第一行的 <?xml version="1.0"?> 也会匹配 version=，
// 所以必须锚定在 <plugin ... id="..." version="..."> 上。
const xmlVersion = pluginXml.match(/<plugin[\s\S]*?\bversion="([^"]+)"/)?.[1];
const xmlId = pluginXml.match(/<plugin[\s\S]*?\bid="([^"]+)"/)?.[1];

const expected = process.argv[2]?.replace(/^v/, '');

const rows = [
  ['package.json', rootPkg.name, rootPkg.version],
  ['cordova/package.json', cordovaPkg.name, cordovaPkg.version],
  ['cordova/plugin.xml', xmlId, xmlVersion],
];

let failed = false;
const versions = new Set(rows.map((r) => r[2]));

console.log('版本检查：');
for (const [file, name, version] of rows) {
  console.log(`  ${file.padEnd(22)} ${String(name).padEnd(48)} ${version ?? '(缺失)'}`);
}

if (!xmlVersion) {
  console.error('✗ cordova/plugin.xml 里找不到 <plugin version="…">');
  failed = true;
}
if (versions.size !== 1 || !xmlVersion) {
  console.error(`✗ 版本不一致：${[...versions].join(' / ')}`);
  failed = true;
}
// cordova.id 必须与 cordova/package.json 的 cordova.id 一致（Cordova 按它找原生类）
if (cordovaPkg.cordova?.id !== xmlId) {
  console.error(`✗ 插件 id 不一致：cordova/package.json=${cordovaPkg.cordova?.id} / plugin.xml=${xmlId}`);
  failed = true;
}
if (expected && (versions.size !== 1 || !versions.has(expected))) {
  console.error(`✗ 与期望版本 ${expected}（来自 tag）不一致`);
  failed = true;
}

if (failed) process.exit(1);
console.log(`✓ 三个文件版本一致：${[...versions][0]}`);
