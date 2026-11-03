/**
 * 把 apiDocs 的静态页面转成纯文本。
 *
 * 该站点的 HTML 是「双重编码」：文件是 UTF-8，但内容是原始文本再被当作
 * Latin1 编码过一遍的 UTF-8 字节序列，所以读出来是乱码，必须反转码。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, '_docs2');
const OUT = path.join(ROOT, '_docs2_txt');

/** 把「UTF-8 字节被当成 Latin1 字符」的字符串还原成正常文本。 */
function fixDoubleEncoded(s) {
  const out = [];
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 0x80) {
      out.push(c);
      continue;
    }
    let cp = -1;
    let len = 0;
    if ((c & 0xe0) === 0xc0 && i + 1 < s.length) {
      cp = (c & 0x1f) << 6 | (s.charCodeAt(i + 1) & 0x3f);
      len = 2;
    } else if ((c & 0xf0) === 0xe0 && i + 2 < s.length) {
      cp = (c & 0x0f) << 12 | (s.charCodeAt(i + 1) & 0x3f) << 6 | (s.charCodeAt(i + 2) & 0x3f);
      len = 3;
    } else if ((c & 0xf8) === 0xf0 && i + 3 < s.length) {
      cp = (c & 0x07) << 18 | (s.charCodeAt(i + 1) & 0x3f) << 12 | (s.charCodeAt(i + 2) & 0x3f) << 6 | (s.charCodeAt(i + 3) & 0x3f);
      len = 4;
    }
    if (cp < 0) {
      out.push(c);
      continue;
    }
    out.push(cp);
    i += len - 1;
  }
  return String.fromCodePoint(...out);
}

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&emsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function toText(html) {
  let h = html.replace(/\uFEFF/g, '');
  h = h.replace(/<script[\s\S]*?<\/script>/gi, '');
  h = h.replace(/<style[\s\S]*?<\/style>/gi, '');
  h = h.replace(/<pre[^>]*>/gi, '\n[CODE]\n');
  h = h.replace(/<\/pre>/gi, '\n[/CODE]\n');
  h = h.replace(/<br\s*\/?>/gi, '\n');
  h = h.replace(/<\/tr>/gi, '\n');
  h = h.replace(/<\/t[dh]>/gi, ' | ');
  h = h.replace(/<\/p>/gi, '\n');
  h = h.replace(/<h\d>/gi, '\n');
  h = h.replace(/<[^>]+>/g, '');
  h = decodeEntities(h);
  return h
    .split('\n')
    .map((l) => l.trimEnd())
    .filter((l) => l.trim() !== '' && l.trim() !== '|')
    .join('\n');
}

fs.mkdirSync(OUT, { recursive: true });
const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.html'));
for (const f of files) {
  const raw = fs.readFileSync(path.join(SRC, f), 'utf8');
  const text = toText(fixDoubleEncoded(raw));
  fs.writeFileSync(path.join(OUT, f.replace(/\.html$/, '.txt')), text, 'utf8');
}
console.log('转换完成:', files.length, '页');
