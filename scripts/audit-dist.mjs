import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
export async function auditDist(directory = 'dist') {
  const files = await fs.readdir(directory, { recursive: true, withFileTypes: true });
  for (const entry of files) {
    if (entry.isSymbolicLink()) throw new Error('公开产物不能包含符号链接');
    if (!entry.isFile()) continue;
    const file = path.join(entry.parentPath, entry.name);
    const relative = path.relative(directory, file).replaceAll(path.sep, '/');
    if (!/\.html$/.test(relative) && !/^_astro\/[\w.-]+\.(js|css)$/.test(relative)
      && !/^media\/[a-f0-9]{24}\.webp$/.test(relative) && relative !== '_headers') throw new Error(`公开产物出现非预期文件：${relative}`);
    if (relative.startsWith('media/')) {
      const meta = await sharp(file).metadata();
      if (meta.exif || meta.xmp || meta.iptc || meta.width > 1920 || meta.height > 2400) throw new Error('图片输出包含元信息或超过尺寸限制');
    }
  }
}
if (process.argv[1]?.endsWith('audit-dist.mjs')) {
  await auditDist();
  console.log('公开产物检查通过：仅网页、样式、脚本及处理后的图片。');
}
