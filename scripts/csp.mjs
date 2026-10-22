import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

// The theme and language scripts are inlined into each page. Instead of allowing every inline
// script, the security header lists the exact fingerprint (hash) of each one found in the build.
const placeholder = /'__INLINE_(SCRIPT|STYLE)_HASHES__'/g;
const hash = code => `'sha256-${createHash('sha256').update(code, 'utf8').digest('base64')}'`;

export async function applyCsp(directory = 'dist') {
  const found = { SCRIPT: new Set(), STYLE: new Set() };
  for (const entry of await fs.readdir(directory, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const html = await fs.readFile(path.join(entry.parentPath, entry.name), 'utf8');
    for (const [, attributes, code] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (!/\bsrc=/i.test(attributes) && code) found.SCRIPT.add(hash(code));
    }
    for (const [, code] of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) found.STYLE.add(hash(code));
    if (/\sstyle="/i.test(html) || /\son[a-z]+="/i.test(html)) throw new Error(`${entry.name}：页面里有内联 style 或 on* 属性，会被安全策略拦下，请改用样式类或脚本。`);
  }
  const file = path.join(directory, '_headers');
  const headers = await fs.readFile(file, 'utf8');
  if (!headers.includes("'__INLINE_SCRIPT_HASHES__'") || !headers.includes("'__INLINE_STYLE_HASHES__'")) throw new Error('_headers 里缺少 Content-Security-Policy 占位符');
  const result = headers.replace(placeholder, (_, kind) => [...found[kind]].sort().join(' ') || "'none'");
  // Cloudflare Pages ignores header lines longer than 2,000 characters.
  if (result.split('\n').some(line => line.length > 2000)) throw new Error('Content-Security-Policy 太长，超过 Cloudflare 的 2000 字符限制');
  await fs.writeFile(file, result);
  return found;
}
if (process.argv[1]?.endsWith('csp.mjs')) {
  const found = await applyCsp();
  console.log(`安全策略已生成：${found.SCRIPT.size} 个内联脚本、${found.STYLE.size} 段内联样式已登记。`);
}
