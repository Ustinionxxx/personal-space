import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import matter from 'gray-matter';
import { parse, stringify } from 'yaml';
import { defaultHome } from './content.mjs';

const destination = path.resolve(process.argv[2] ?? '../personal-space-content');
const code = path.resolve('.');
if (destination === code || destination.startsWith(code + path.sep)) throw new Error('私有内容必须放在公开代码仓库之外');
await fs.mkdir(destination, { recursive: true, mode: 0o700 });
if ((await fs.readdir(destination)).length) throw new Error('目标目录不是空目录，已停止，避免覆盖内容');
for (const dir of ['life', 'work', 'media', '.github/workflows']) await fs.mkdir(path.join(destination, dir), { recursive: true });
await fs.writeFile(path.join(destination, 'media/.gitkeep'), '');
await fs.copyFile('content-template/.pages.yml', path.join(destination, '.pages.yml'));
await fs.writeFile(path.join(destination, 'home.yml'), stringify({ status: 'published', ...defaultHome }));
// Recover only the four original examples from the known pre-migration commit.
// These are never included in public builds until the owner explicitly publishes them.
const baseline = '59cd89fe466d04dbb478feeaed3267b2b203e781';
const original = file => execFileSync('git', ['show', `${baseline}:src/content/${file}`], { encoding: 'utf8' });
const names = ['life/record-one', 'life/record-two', 'work/project-alpha', 'work/project-beta'];
const ids = Object.fromEntries(names.map(name => [name.split('/')[1], randomUUID()]));
for (const name of names) {
  const [collection, permalink] = name.split('/');
  const { data, content } = matter(original(name + '.md'), { engines: { yaml: s => parse(s) } });
  delete data.cardLayout;
  if (data.workRef) data.workRef = ids[data.workRef];
  if (data.lifeRef) data.lifeRef = ids[data.lifeRef];
  const fields = { id: ids[permalink], permalink, status: 'draft', date: '', ...data };
  if (collection === 'work') fields.stage = 'in-progress';
  const note = permalink === 'project-beta'
    ? '> 待整理：这是开源项目的介绍，请补充原项目来源，以及你实际使用、修改或贡献的部分，再决定是否发布。\n\n'
    : '> 待整理：这是旧站示例，请确认是真实经历或改成你自己的内容后再发布。\n\n';
  await fs.writeFile(path.join(destination, collection, `${fields.id}.md`), `---\n${stringify(fields)}---\n\n${note}${content.trim()}\n`);
}
const about = matter(original('about.md'), { engines: { yaml: s => parse(s) } });
await fs.writeFile(path.join(destination, 'about.md'), `---\nstatus: draft\n---\n\n> 待整理：请确认并修改这份旧站个人介绍，再发布。\n\n${about.content.trim()}\n`);
const sha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const workflow = (await fs.readFile('content-template/publish.yml', 'utf8')).replace('__SITE_CODE_SHA__', sha);
await fs.writeFile(path.join(destination, '.github/workflows/publish.yml'), workflow);
await fs.copyFile('docs/editor-guide.md', path.join(destination, 'README.md'));
await fs.writeFile(path.join(destination, '.gitignore'), '.DS_Store\n.env\n.env.*\n');
console.log(`私有内容已准备：${destination}。请在推送前确认远端仓库为 private，并把发布工作流固定到已推送的新代码提交。`);
