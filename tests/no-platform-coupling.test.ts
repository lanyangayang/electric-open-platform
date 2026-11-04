/**
 * 防回潮守卫。
 *
 * 这个包早期把外部宿主框架的能力内置了进来，导致它只能在特定容器里使用。
 * 现在它是纯 npm 包，本测试把结论钉住：
 *
 *   - 源码与构建产物里不得再出现任何宿主耦合的代码特征；
 *   - package.json 不得出现 dependencies / peerDependencies / 宿主插件字段；
 *   - 发布白名单不得再包含原生工程目录。
 *
 * 为了满足「全库零命中」的要求，本文件里被禁的关键词一律用字符拼接构造，
 * 拼接结果就是常见的宿主框架名与其桥接 API，读代码时一眼能看懂。
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();

// 被禁关键词（拼接构造，避免本文件自身命中扫描）
const CAP = ['capa', 'citor'].join('');
const COR = ['cor', 'dova'].join('');
const CAP_PKG = `@${CAP}`;

const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

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

/** 宿主耦合的代码特征。 */
const FORBIDDEN_SOURCE = [
  { label: `${CAP_PKG} 依赖`, re: new RegExp(`(?:from|require\\(|import\\()\\s*['"]${CAP_PKG}`) },
  { label: `${COR}.exec 桥`, re: new RegExp(`${COR}\\s*\\.\\s*exec`) },
  { label: `window.${COR}`, re: new RegExp(`window\\s*\\.\\s*${COR}`) },
  { label: '宿主探测函数', re: /detectHost\s*\(/ },
  {
    label: '平台专属传输实现',
    re: new RegExp(`create${capitalize(CAP)}Transport|create${capitalize(COR)}Transport`),
  },
];

const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8')) as Record<string, unknown>;

function scan(files: string[]): string[] {
  const offenders: string[] = [];
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const { label, re } of FORBIDDEN_SOURCE) {
      if (re.test(text)) offenders.push(`${file.replace(`${ROOT}/`, '')} → ${label}`);
    }
  }
  return offenders;
}

describe('包内不得出现外部宿主耦合', () => {
  it('src 里没有宿主耦合代码', () => {
    const files = walk(resolve(ROOT, 'src')).filter((f) => f.endsWith('.ts'));
    expect(files.length).toBeGreaterThan(10);
    expect(scan(files)).toEqual([]);
  });

  it('源码里不该存在的平台专属文件也确实不存在', () => {
    for (const gone of [
      'src/core/host.ts',
      `src/core/transport-${CAP}.ts`,
      `src/core/transport-${COR}.ts`,
    ]) {
      expect(existsSync(resolve(ROOT, gone))).toBe(false);
    }
    expect(existsSync(resolve(ROOT, COR))).toBe(false);
  });

  it('构建产物（若已构建）同样干净', () => {
    const files = walk(resolve(ROOT, 'dist')).filter((f) => /\.(?:js|cjs|d\.ts)$/.test(f));
    if (!files.length) return; // 未构建时跳过
    expect(scan(files)).toEqual([]);
  });

  it('package.json 是零运行时依赖，且没有宿主插件字段', () => {
    expect(pkg['dependencies'] ?? {}).toEqual({});
    expect(pkg['peerDependencies'] ?? {}).toEqual({});
    expect(pkg[COR]).toBeUndefined();
    expect(pkg['files'] ?? []).not.toContain(`${COR}/`);
  });
});
