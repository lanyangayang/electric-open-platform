#!/usr/bin/env node
/**
 * 版本一致性检查。
 *
 * 现在只发布一个包，所以这里做两件事：
 *   1. package.json 的 name / version 是否齐全且符合预期；
 *   2. 如果传了期望版本（CI 里传 tag），要求与 package.json 完全一致。
 *
 * 用法：
 *   node scripts/check-versions.mjs               # 只做基本校验
 *   node scripts/check-versions.mjs 1.0.0         # 额外要求等于指定版本（CI 里传 tag）
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const expected = process.argv[2]?.replace(/^v/, '');

const rows = [
  ['package.json  name', pkg.name],
  ['package.json  version', pkg.version],
  ['package.json  type', pkg.type],
  ['package.json  exports', pkg.exports?.['.'] ? 'yes' : '(缺失)'],
];

console.log('发布前检查：');
for (const [label, value] of rows) console.log(`  ${label.padEnd(24)} ${value ?? '(缺失)'}`);

let failed = false;
if (!pkg.name || !pkg.version) {
  console.error('✗ package.json 缺少 name 或 version');
  failed = true;
}
if (pkg.peerDependencies && Object.keys(pkg.peerDependencies).length) {
  console.error('✗ 本包应为零运行时依赖，但仍有 peerDependencies');
  failed = true;
}
if (pkg.dependencies && Object.keys(pkg.dependencies).length) {
  console.error('✗ 本包应为零运行时依赖，但仍有 dependencies');
  failed = true;
}
if (expected && pkg.version !== expected) {
  console.error(`✗ 版本与期望 ${expected}（来自 tag）不一致`);
  failed = true;
}

if (failed) process.exit(1);
console.log(`✓ ${pkg.name}@${pkg.version}`);
