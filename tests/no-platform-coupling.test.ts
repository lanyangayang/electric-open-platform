/**
 * 防回潮守卫。
 *
 * 这个包曾经同时是 Capacitor 插件和 Cordova 插件，靠宿主探测自动装配传输与存储实现，
 * 于是引入了 `@capacitor/core`、`@capacitor/preferences` 两个可选 peer 依赖，以及一整套
 * `cordova/` 原生工程。剥离成纯 npm 包之后，用这个测试把结论钉住：
 *
 *   - 源码与构建产物里不得再出现任何平台耦合的代码特征；
 *   - package.json 不得重新出现 dependencies / peerDependencies / cordova 字段；
 *   - 发布白名单不得再把原生工程目录打进去。
 *
 * 注释里提到「旧版本曾依赖 Capacitor / Cordova」属于正常的历史说明，不在禁止之列 ——
 * 这里检查的是**能被 import / require 到的代码**。
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

/** 平台耦合的代码特征。 */
const FORBIDDEN_SOURCE = [
  { label: '@capacitor 依赖', re: /(?:from|require\(|import\()\s*['"]@capacitor/ },
  { label: 'cordova.exec 桥', re: /cordova\s*\.\s*exec/ },
  { label: 'window.cordova', re: /window\s*\.\s*cordova/ },
  { label: '宿主探测 detectHost', re: /detectHost\s*\(/ },
  { label: '平台专属传输实现', re: /createCapacitorTransport|createCordovaTransport/ },
];

const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8')) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  cordova?: unknown;
  files?: string[];
};

describe('包内不得出现 Capacitor / Cordova 耦合', () => {
  it('src 里没有平台耦合代码', () => {
    const files = walk(resolve(ROOT, 'src')).filter((f) => f.endsWith('.ts'));
    expect(files.length).toBeGreaterThan(10);

    const offenders: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      for (const { label, re } of FORBIDDEN_SOURCE) {
        if (re.test(text)) offenders.push(`${file.replace(ROOT + '/', '')} → ${label}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('源码里不存在的平台文件也确实不存在', () => {
    for (const gone of [
      'src/core/host.ts',
      'src/core/transport-capacitor.ts',
      'src/core/transport-cordova.ts',
    ]) {
      expect(existsSync(resolve(ROOT, gone))).toBe(false);
    }
    expect(existsSync(resolve(ROOT, 'cordova'))).toBe(false);
  });

  it('构建产物（若已构建）同样干净', () => {
    const files = walk(resolve(ROOT, 'dist')).filter((f) => /\.(?:js|cjs|d\.ts)$/.test(f));
    if (!files.length) return; // 未构建时跳过

    const offenders: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      for (const { label, re } of FORBIDDEN_SOURCE) {
        if (re.test(text)) offenders.push(`${file.replace(ROOT + '/', '')} → ${label}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('package.json 是零运行时依赖，且没有 cordova 字段', () => {
    expect(pkg.dependencies ?? {}).toEqual({});
    expect(pkg.peerDependencies ?? {}).toEqual({});
    expect(pkg.cordova).toBeUndefined();
    expect(pkg.files ?? []).not.toContain('cordova/');
  });
});
