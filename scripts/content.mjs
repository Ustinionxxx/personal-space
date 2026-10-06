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
import { contentLocales, htmlLanguage, toTraditional, translatedField, localContentLink } from './localization.mjs';

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
const englishWriting = z.object({ title: optionalText, body: optionalText, description: optionalText }).nullish();
const photoSchema = z.object({ src: text.min(1), alt: optionalText, caption: optionalText, altEn: optionalText, captionEn: optionalText });
const baseSchema = z.object({
  id: identifier, permalink: optionalText.refine(v => !v || identifier.safeParse(v).success),
  title: optionalText, date, body: optionalText, english: englishWriting,
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
  english: z.object({ name: optionalText, intro: optionalText, now: optionalText }).nullish(),
});
const aboutSchema = z.object({ body: optionalText, english: z.object({ body: optionalText }).nullish() });

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
async function markdown(body, image, locale = 'zh-cn') {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(body);
  visit(tree, node => {
    if (locale === 'zh-tw') {
      if (node.type === 'text') node.value = toTraditional(node.value);
      if (typeof node.alt === 'string') node.alt = toTraditional(node.alt);
      if (typeof node.title === 'string') node.title = toTraditional(node.title);
    }
    if (['link', 'definition'].includes(node.type)) node.url = localContentLink(node.url, locale);
  });
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
  const bundles = Object.fromEntries(contentLocales.map(locale => [locale, {
    home: { ...defaultHome, intro: locale === 'en' ? 'The website is here. Might as well put a little of myself in it.' : locale === 'zh-tw' ? toTraditional(defaultHome.intro) : defaultHome.intro,
      introLang: htmlLanguage[locale], nowLang: htmlLanguage[locale], translationFallback: false },
    about: { html: '', bodyLang: htmlLanguage[locale], translationFallback: false }, life: [], work: [],
  }]));
  const result = bundles['zh-cn'];
  if (!empty) {
    if (!source) throw new Error('未指定私有内容目录 CONTENT_DIR；已停止构建。空站预览请用 npm run build:empty。');
    const root = await fs.realpath(source);
    const image = mediaProcessor(root, mediaDestination);
    const home = parseYaml(await safeRead(root, 'home.yml'));
    if (home?.status === 'published') {
      const entry = validate(homeSchema, home, '首页设置');
      for (const locale of contentLocales) {
        const intro = translatedField(entry.intro, entry.english?.intro, locale);
        const now = translatedField(entry.now, entry.english?.now, locale);
        const { english, ...publicHome } = entry;
        bundles[locale].home = { ...publicHome, name: locale === 'en' ? english?.name || entry.name : locale === 'zh-tw' ? toTraditional(entry.name) : entry.name,
          intro: intro.value, now: now.value, introLang: intro.lang, nowLang: now.lang, translationFallback: intro.fallback || now.fallback };
      }
    }
    const about = readMarkdown(await safeRead(root, 'about.md'));
    if (about.status === 'published') {
      const entry = validate(aboutSchema, about, '个人介绍');
      for (const locale of contentLocales) {
        const body = translatedField(entry.body, entry.english?.body, locale);
        bundles[locale].about = { html: await markdown(locale === 'en' ? body.value : entry.body, image, locale), bodyLang: body.lang, translationFallback: body.fallback };
      }
    }
    const life = await readCollection(root, 'life');
    const work = await readCollection(root, 'work');
    for (const entry of life) {
      const { id, slug, date, tags, images, workRef } = entry;
      for (const locale of contentLocales) {
        const title = translatedField(entry.title, entry.english?.title, locale);
        const body = translatedField(entry.body, entry.english?.body, locale);
        const photos = [];
        let fallback = title.fallback || body.fallback;
        for (const photo of images) {
          const alt = translatedField(photo.alt, photo.altEn, locale);
          const caption = translatedField(photo.caption, photo.captionEn, locale);
          photos.push({ ...await image(photo.src), alt: alt.value, altLang: alt.lang, caption: caption.value, captionLang: caption.lang });
          fallback ||= alt.fallback || caption.fallback;
        }
        bundles[locale].life.push({ id, slug, title: title.value, titleLang: title.lang, bodyLang: body.lang, date,
          tags: locale === 'zh-tw' ? tags.map(toTraditional) : tags, translationFallback: fallback,
          html: await markdown(locale === 'en' ? body.value : entry.body, image, locale), images: photos,
          workRef: work.find(v => v.id === workRef)?.slug ?? '' });
      }
    }
    for (const entry of work) {
      const { id, slug, date, stage, tech, links, cover, lifeRef } = entry;
      for (const locale of contentLocales) {
        const title = translatedField(entry.title, entry.english?.title, locale);
        const body = translatedField(entry.body, entry.english?.body, locale);
        const description = translatedField(entry.description, entry.english?.description, locale);
        bundles[locale].work.push({ id, slug, title: title.value, titleLang: title.lang, bodyLang: body.lang, date,
          description: description.value, descriptionLang: description.lang, stage, tech, links,
          translationFallback: title.fallback || body.fallback || description.fallback,
          html: await markdown(locale === 'en' ? body.value : entry.body, image, locale), cover: cover ? await image(cover) : null,
          lifeRef: life.find(v => v.id === lifeRef)?.slug ?? '' });
      }
    }
    for (const bundle of Object.values(bundles)) bundle.home.featuredWork = work.find(v => v.id === bundle.home.featuredWork)?.id ?? '';
  }
  result.locales = { 'zh-tw': bundles['zh-tw'], en: bundles.en };
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, JSON.stringify(result));
  return result;
}
