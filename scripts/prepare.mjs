import { prepareContent } from './content.mjs';
try {
  const empty = process.argv.includes('--empty') || process.argv.includes('--dev') && !process.env.CONTENT_DIR;
  const content = await prepareContent({ source: process.env.CONTENT_DIR,
    destination: '.generated/content.json', mediaDestination: 'public/media', empty });
  console.log(`公开内容已准备：${content.life.length} 条生活记录，${content.work.length} 个项目。`);
} catch (error) {
  console.error(`内容准备失败：${error.message}`);
  process.exitCode = 1;
}
