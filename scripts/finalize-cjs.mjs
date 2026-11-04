#!/usr/bin/env node
/**
 * 让 dist/cjs 里的 .js 被 Node 当成 CommonJS 解析。
 *
 * 根 package.json 声明了 `"type": "module"`（这样 ESM 产物 dist/esm/*.js 才能被
 * `import` 直接加载），因此 dist/cjs/*.js 需要一个就近的 package.json 覆盖解析方式。
 * tsc 不会生成它，所以构建后补一份。
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'dist/cjs');

mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'package.json'), `${JSON.stringify({ type: 'commonjs' }, null, 2)}\n`);
console.log('✓ dist/cjs/package.json（type: commonjs）');
