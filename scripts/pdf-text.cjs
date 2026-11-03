/**
 * 用 pdfjs-dist 提取 PDF 文本（不依赖 Word/LibreOffice）。
 * PDF 是中文文档，需要 ToUnicode 映射，pdfjs 会自动处理。
 */
const fs = require('fs');
const path = require('path');

async function main() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const desktop = process.env.USERPROFILE + '\\Desktop';
  const outDir = path.join(__dirname, '..', '_pdf_txt');
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs
    .readdirSync(desktop)
    .filter((f) => f.toLowerCase().endsWith('.pdf') && /^(UDP|485)/i.test(f));

  for (const name of files) {
    const src = path.join(desktop, name);
    const key = /^UDP/i.test(name) ? 'udp' : 'rs485';
    console.log(`\n=== ${name} ===`);

    const data = new Uint8Array(fs.readFileSync(src));
    const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
    console.log(`页数: ${doc.numPages}`);

    const pages = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      // 按 y 坐标聚行，尽量保持表格布局
      const items = content.items.filter((it) => it.str !== undefined && it.str !== '');
      const lines = new Map();
      for (const it of items) {
        const y = Math.round(it.transform[5]);
        if (!lines.has(y)) lines.set(y, []);
        lines.get(y).push({ x: it.transform[4], str: it.str });
      }
      const sortedY = [...lines.keys()].sort((a, b) => b - a);
      const text = sortedY
        .map((y) => lines.get(y).sort((a, b) => a.x - b.x).map((o) => o.str).join(' '))
        .join('\n');
      pages.push(`--- 第 ${i} 页 ---\n${text}`);
    }

    const full = pages.join('\n\n');
    const dest = path.join(outDir, `${key}.txt`);
    fs.writeFileSync(dest, full, 'utf8');
    console.log(`已保存 ${dest} (${full.length} 字符)`);
  }
}

main().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
