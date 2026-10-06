import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { stringify } from 'yaml';
import sharp from 'sharp';
import { prepareContent, defaultHome } from '../scripts/content.mjs';

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'personal-content-test-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const source = path.join(root, 'private');
  for (const dir of ['life', 'work', 'media']) await fs.mkdir(path.join(source, dir), { recursive: true });
  await fs.writeFile(path.join(source, 'home.yml'), stringify({ status: 'published', ...defaultHome }));
  await fs.writeFile(path.join(source, 'about.md'), '---\nstatus: draft\n---\nPRIVATE_ABOUT_SENTINEL');
  const write = (collection, id, data, body = '') => fs.writeFile(path.join(source, collection, `${id}.md`), `---\n${stringify({ id, ...data })}---\n${body}`);
  const photo = async (name, width = 40, height = 60, color = '#88aa99') => {
    await sharp({ create: { width, height, channels: 3, background: color } }).jpeg()
      .withExif({ IFD0: { Copyright: 'PRIVATE_EXIF_SENTINEL' } }).toFile(path.join(source, 'media', name));
  };
  const options = { source, destination: path.join(root, 'generated/content.json'), mediaDestination: path.join(root, 'public/media') };
  return { root, source, write, photo, options, build: () => prepareContent(options) };
}

test('untitled text publishes; dates sort; draft and unknown metadata never leave private input', async t => {
  const f = await fixture(t);
  await f.write('life', 'older', { status: 'published', date: '2026-09-30', internalNote: 'PRIVATE_METADATA_SENTINEL' }, '两句话。\n\n还没想完也可以留下。');
  await f.write('life', 'newer', { status: 'published', date: '2026-10-05' }, '新的记录');
  await f.write('life', 'draft', { status: 'draft', images: [{ src: '/media/missing.jpg' }] }, 'PRIVATE_BODY_SENTINEL');
  await f.write('life', 'missing-status', {}, 'PRIVATE_MISSING_STATUS');
  await f.write('life', 'wrong-status', { status: 'publish' }, 'PRIVATE_WRONG_STATUS');
  const output = await f.build();
  assert.deepEqual(output.life.map(v => v.id), ['newer', 'older']);
  assert.equal(output.life[1].title, '');
  assert.match(output.life[1].html, /两句话/);
  assert.doesNotMatch(JSON.stringify(output), /PRIVATE_/);
});

test('mixed photos preserve ratio, remove EXIF, resize, exclude orphan and draft images; withdrawal removes old assets', async t => {
  const f = await fixture(t);
  await f.photo('landscape.jpg', 3000, 1500);
  await f.photo('portrait.jpg', 1000, 3000, '#99bbcc');
  await f.photo('orphan.jpg', 30, 30, '#ddaa88');
  await f.write('life', 'photos', { status: 'published', date: '2026-10-01', images: [
    { src: '/media/landscape.jpg', caption: '横图' }, { src: '/media/portrait.jpg', alt: '竖图' },
  ] });
  await f.write('life', 'private-photos', { status: 'draft', images: [{ src: '/media/orphan.jpg' }] });
  const output = await f.build();
  const [landscape, portrait] = output.life[0].images;
  assert.equal(landscape.width / landscape.height, 2);
  assert.equal(portrait.height / portrait.width, 3);
  assert.equal(landscape.caption, '横图');
  assert.equal((await fs.readdir(f.options.mediaDestination)).length, 2);
  for (const photo of output.life[0].images) {
    const metadata = await sharp(path.join(f.options.mediaDestination, path.basename(photo.src))).metadata();
    assert.equal(metadata.exif, undefined);
    assert.ok(metadata.width <= 1920 && metadata.height <= 2400);
    assert.ok(!photo.src.includes('.jpg'));
  }
  await f.write('life', 'photos', { status: 'draft' });
  const withdrawn = await f.build();
  assert.equal(withdrawn.life.length, 0);
  await assert.rejects(fs.access(f.options.mediaDestination));
});

test('Markdown images and referenced definitions are optimized, unused definitions are not; HTML is removed', async t => {
  const f = await fixture(t);
  await f.photo('inline.jpg');
  await f.write('life', 'markdown', { status: 'published', date: '2026-10-01' }, '![画面][p]\n\n[p]: /media/inline.jpg\n[unused]: /media/missing.jpg\n\n<script>PRIVATE_SCRIPT_SENTINEL</script>');
  const output = await f.build();
  assert.match(output.life[0].html, /<img src="\/media\/[a-f0-9]{24}\.webp"/);
  assert.doesNotMatch(output.life[0].html, /PRIVATE_|\.jpg|script/);
  assert.equal((await fs.readdir(f.options.mediaDestination)).length, 1);
});

test('About updates from its source; renamed titles preserve stable and migrated paths; draft references disappear', async t => {
  const f = await fixture(t);
  await f.write('life', 'stable', { status: 'published', date: '2026-10-01', title: '原标题', workRef: 'private-work' }, '记录');
  await f.write('life', 'legacy-id', { status: 'published', date: '2026-10-01', permalink: 'record-one' }, '旧记录');
  await f.write('work', 'private-work', { status: 'draft' }, 'PRIVATE_WORK');
  await fs.writeFile(path.join(f.source, 'home.yml'), stringify({ status: 'published', ...defaultHome, featuredWork: 'private-work' }));
  const first = await f.build();
  await f.write('life', 'stable', { status: 'published', date: '2026-10-01', title: '新标题' }, '记录');
  await fs.writeFile(path.join(f.source, 'about.md'), '---\nstatus: published\n---\n更新后的介绍');
  const second = await f.build();
  assert.equal(first.life.find(v => v.id === 'stable').slug, second.life.find(v => v.id === 'stable').slug);
  assert.equal(second.life.find(v => v.id === 'legacy-id').slug, 'record-one');
  assert.match(second.about.html, /更新后的介绍/);
  assert.equal(first.home.featuredWork, '');
  assert.equal(first.life.find(v => v.id === 'stable').workRef, '');
  assert.doesNotMatch(JSON.stringify(first), /private-work|PRIVATE_WORK/);
});

test('invalid published content fails clearly, drafts do not require complete fields', async t => {
  const f = await fixture(t);
  await f.write('life', 'bad', { status: 'published', date: '2026-02-30' }, '记录');
  await assert.rejects(f.build(), /date/);
  await f.write('life', 'bad', { status: 'published', date: '2026-10-01' });
  await assert.rejects(f.build(), /正文/);
  await f.write('life', 'bad', { status: 'published', date: '2026-10-01', images: [{ src: '/media/missing.jpg' }] });
  await assert.rejects(f.build(), /图片不存在/);
  await f.write('life', 'bad', { status: 'draft' });
  assert.equal((await f.build()).life.length, 0);
});

test('image paths, remote images, symlinks and disguised formats cannot bypass the media pipeline', async t => {
  const f = await fixture(t);
  await fs.writeFile(path.join(f.root, 'outside.jpg'), 'PRIVATE_FILE');
  await fs.symlink(path.join(f.root, 'outside.jpg'), path.join(f.source, 'media/link.jpg'));
  for (const src of ['/media/../outside.jpg', '/media/%2e%2e/outside.jpg', 'https://example.com/photo.jpg', '/media/link.jpg']) {
    await f.write('life', 'unsafe', { status: 'published', date: '2026-10-01', images: [{ src }] });
    await assert.rejects(f.build(), /图片|路径/);
  }
  await f.write('life', 'unsafe', { status: 'published', date: '2026-10-01' }, '![外部照片](https://example.com/photo.jpg)');
  await assert.rejects(f.build(), /图片库/);
  await fs.writeFile(path.join(f.source, 'media/fake.jpg'), '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>');
  await f.write('life', 'unsafe', { status: 'published', date: '2026-10-01', images: [{ src: '/media/fake.jpg' }] });
  await assert.rejects(f.build(), /静态 JPEG/);
});

test('production build: draft text/files absent in every artifact; latest three only; withdrawal removes routes; failure leaves no deployable dist', async t => {
  const f = await fixture(t);
  await f.photo('public.jpg');
  await f.photo('PRIVATE_ORPHAN.jpg', 50, 50, '#ff0000');
  await fs.writeFile(path.join(f.source, '.env'), 'PRIVATE_CREDENTIAL_SENTINEL');
  await f.write('life', 'private-record', { status: 'draft', images: [{ src: '/media/PRIVATE_ORPHAN.jpg' }] }, 'PRIVATE_DRAFT_SENTINEL');
  for (let n = 1; n <= 4; n++) await f.write('life', `entry-${n}`, {
    status: 'published', date: `2026-10-0${n}`, images: n === 4 ? [{ src: '/media/public.jpg' }] : [],
  }, `VISIBLE_ENTRY_${n}`);
  const build = () => spawnSync(process.execPath, ['scripts/build.mjs'], { encoding: 'utf8', env: { ...process.env, CONTENT_DIR: f.source } });
  const first = build();
  assert.equal(first.status, 0, first.stdout + first.stderr);
  const home = await fs.readFile('dist/index.html', 'utf8');
  assert.doesNotMatch(home, /VISIBLE_ENTRY_1/);
  for (const n of [2, 3, 4]) assert.match(home, new RegExp(`VISIBLE_ENTRY_${n}`));
  for (const file of await fs.readdir('dist', { recursive: true, withFileTypes: true })) {
    if (!file.isFile()) continue;
    assert.doesNotMatch(file.name, /PRIVATE_|\.md$|\.yml$|\.env|\.map$/);
    assert.doesNotMatch((await fs.readFile(path.join(file.parentPath, file.name))).toString(), /PRIVATE_/);
  }
  await f.write('life', 'entry-4', { status: 'draft' });
  const withdrawn = build();
  assert.equal(withdrawn.status, 0, withdrawn.stdout + withdrawn.stderr);
  await assert.rejects(fs.access('dist/life/entry-4/index.html'));
  await assert.rejects(fs.access('dist/media'));
  await f.write('life', 'invalid', { status: 'published', date: '2026-10-01', images: [{ src: '/media/missing.jpg' }] });
  const failed = build();
  assert.notEqual(failed.status, 0);
  assert.match(failed.stderr, /图片不存在/);
  await assert.rejects(fs.access('dist'));
});
