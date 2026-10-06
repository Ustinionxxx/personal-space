import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import sharp from 'sharp';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';

export const defaultHome = {
  name: '邢思佳', intro: '毕竟网站已经建了，总得往里放点本人。',
  now: '', github: 'https://github.com/Ustinionxxx', email: '', featuredWork: '',
};
const text = z.string().trim();
const optionalText = text.nullish().transform(v => v ?? '');
const strings = z.array(text).nullish().transform(v => v ?? []);
const identifier = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const date = text.regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => {
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.valueOf()) && d.toISOString().slice(0, 10) === v;
}, '请填写有效的记录日期');
const url = optionalText.refine(v => !v || /^https?:\/\//.test(v) && URL.canParse(v), '链接须以 https:// 或 http:// 开头');
const photoSchema = z.object({ src: text.min(1), alt: optionalText, caption: optionalText });
const baseSchema = z.object({
  id: identifier, permalink: optionalText.refine(v => !v || identifier.safeParse(v).success),
  title: optionalText, date, body: optionalText,
});
const lifeSchema = baseSchema.extend({
  images: z.array(photoSchema).nullish().transform(v => v ?? []), tags: strings, workRef: optionalText,
}).refine(v => v.body || v.images.length, '生活记录至少需要正文或一张照片');
const workSchema = baseSchema.extend({
  title: text.min(1), description: optionalText, stage: z.enum(['in-progress', 'completed', 'paused']),
  body: text.min(1, '请写下项目是什么、你参与了什么'), cover: optionalText, tech: strings, lifeRef: optionalText,
  links: z.object({ github: url, demo: url, process: url }).nullish(),
});
const homeSchema = z.object({
  name: text.min(1), intro: optionalText, now: optionalText, github: url,
  email: optionalText.refine(v => !v || z.string().email().safeParse(v).success), featuredWork: optionalText,
});

// Never return private values in validation errors or build logs.
function validate(schema, data, label) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const fields = [...new Set(result.error.issues.map(i => i.path.join('.') || '正文'))];
    throw new Error(`${label}：请检查字段 ${fields.join('、')}。草稿不会被发布。`);
  }
  return result.data;
}
function inside(root, target) {
  const relative = path.relative(root, target);
  return relative && !relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative);
}
async function safeRead(root, relative) {
  const target = await fs.realpath(path.join(root, relative));
  if (!inside(root, target)) throw new Error('内容路径超出仓库范围');
  return fs.readFile(target, 'utf8');
}
function readMarkdown(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) throw new Error('请使用 YAML frontmatter');
  const data = parseYaml(match[1]);
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('内容字段必须是对象');
  return { ...data, body: match[2].trim() };
}
async function readCollection(root, collection) {
  const directory = await fs.realpath(path.join(root, collection));
  if (!inside(root, directory)) throw new Error('内容目录超出仓库范围');
  const result = [];
  for (const file of (await fs.readdir(directory)).sort()) {
    if (!file.endsWith('.md')) continue;
    let data;
    try { data = readMarkdown(await safeRead(root, `${collection}/${file}`)); }
    catch { throw new Error(`${collection}/${file}：Markdown 或 YAML 无法读取，请检查格式。`); }
    // Missing and unknown statuses fail closed. Do not validate/copy a draft's body or assets.
    if (data.status !== 'published') continue;
    const entry = validate(collection === 'life' ? lifeSchema : workSchema, data, `${collection}/${file}`);
    if (file !== `${entry.id}.md`) throw new Error(`${collection}/${file}：文件名须与稳定 ID 一致。`);
    result.push({ ...entry, slug: entry.permalink || entry.id });
  }
  if (new Set(result.map(v => v.slug)).size !== result.length || new Set(result.map(v => v.id)).size !== result.length) throw new Error(`${collection}：存在重复的 ID 或固定链接。`);
  return result.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}
function mediaProcessor(root, output) {
  const assets = new Map();
  return async function image(src) {
    if (assets.has(src)) return assets.get(src);
    if (!/^\/media\/.+\.(jpe?g|png|webp)$/i.test(src) || /[\\?#%]/.test(src) || src.split('/').includes('..')) throw new Error('图片须来自后台图片库，并使用 JPEG、PNG 或 WebP 格式。');
    const mediaRoot = await fs.realpath(path.join(root, 'media'));
    const file = await fs.realpath(path.join(root, src.slice(1))).catch(() => { throw new Error('引用的图片不存在，请在后台重新选择图片。'); });
    if (!inside(root, mediaRoot) || !inside(mediaRoot, file)) throw new Error('图片路径超出图片库范围。');
    const bytes = await fs.readFile(file);
    const metadata = await sharp(bytes, { limitInputPixels: 80_000_000 }).metadata();
    if (!['jpeg', 'png', 'webp'].includes(metadata.format) || (metadata.pages ?? 1) > 1) throw new Error('请上传静态 JPEG、PNG 或 WebP 图片。');
    // Sharp strips EXIF/IPTC/XMP by default; rotate applies orientation first.
    const { data, info } = await sharp(bytes, { limitInputPixels: 80_000_000 }).rotate()
      .resize({ width: 1920, height: 2400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 84 }).toBuffer({ resolveWithObject: true });
    const name = `${createHash('sha256').update(data).digest('hex').slice(0, 24)}.webp`;
    await fs.mkdir(output, { recursive: true });
    await fs.writeFile(path.join(output, name), data);
    const value = { src: `/media/${name}`, width: info.width, height: info.height };
    assets.set(src, value);
    return value;
  };
}
async function markdown(body, image) {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(body);
  const definitions = new Map();
  visit(tree, 'definition', node => definitions.set(node.identifier, node));
  const references = new Set();
  visit(tree, node => { if (node.type === 'imageReference' || node.type === 'linkReference') references.add(node.identifier); });
  const jobs = [];
  visit(tree, node => {
    if (node.type === 'definition' && !references.has(node.identifier)) return;
    const imageRef = node.type === 'imageReference' ? definitions.get(node.identifier) : undefined;
    if (imageRef && !imageRef.url.startsWith('/media/')) throw new Error('正文图片请通过后台图片库上传。');
    if (node.type === 'image' && !node.url.startsWith('/media/')) throw new Error('正文图片请通过后台图片库上传。');
    if (['image', 'link', 'definition'].includes(node.type) && node.url.startsWith('/media/')) jobs.push(image(node.url).then(asset => { node.url = asset.src; }));
  });
  await Promise.all(jobs);
  // Raw HTML is not enabled. Markdown supports links, lists, photos and code.
  const renderer = unified().use(remarkRehype).use(rehypeSanitize).use(rehypeStringify);
  return renderer.stringify(await renderer.run(tree));
}
export async function prepareContent({ source, destination, mediaDestination, empty = false }) {
  await fs.rm(destination, { force: true });
  await fs.rm(mediaDestination, { recursive: true, force: true });
  const result = { home: { ...defaultHome }, about: { html: '' }, life: [], work: [] };
  if (!empty) {
    if (!source) throw new Error('未指定私有内容目录 CONTENT_DIR；已停止构建。空站预览请用 npm run build:empty。');
    const root = await fs.realpath(source);
    const image = mediaProcessor(root, mediaDestination);
    const home = parseYaml(await safeRead(root, 'home.yml'));
    if (home?.status === 'published') result.home = validate(homeSchema, home, '首页设置');
    const about = readMarkdown(await safeRead(root, 'about.md'));
    if (about.status === 'published') result.about.html = await markdown(about.body, image);
    const life = await readCollection(root, 'life');
    const work = await readCollection(root, 'work');
    for (const entry of life) {
      const { id, slug, title, date, tags, body, images, workRef } = entry;
      const photos = [];
      for (const photo of images) photos.push({ ...await image(photo.src), alt: photo.alt, caption: photo.caption });
      result.life.push({ id, slug, title, date, tags, html: await markdown(body, image), images: photos,
        workRef: work.find(v => v.id === workRef)?.slug ?? '' });
    }
    for (const entry of work) {
      const { id, slug, title, date, description, stage, tech, links, body, cover, lifeRef } = entry;
      result.work.push({ id, slug, title, date, description, stage, tech, links,
        html: await markdown(body, image), cover: cover ? await image(cover) : null,
        lifeRef: life.find(v => v.id === lifeRef)?.slug ?? '' });
    }
    result.home.featuredWork = work.find(v => v.id === result.home.featuredWork)?.id ?? '';
  }
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, JSON.stringify(result));
  return result;
}
