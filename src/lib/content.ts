import fs from 'node:fs';
export interface Photo { src: string; width: number; height: number; alt: string; caption: string }
export interface LifeRecord {
  id: string; slug: string; title: string; date: string; tags: string[];
  html: string; images: Photo[]; workRef: string;
}
export interface Project {
  id: string; slug: string; title: string; date: string; description: string;
  stage: 'in-progress' | 'completed' | 'paused'; tech: string[]; html: string;
  cover: Omit<Photo, 'alt' | 'caption'> | null; lifeRef: string;
  links?: { github: string; demo: string; process: string };
}
interface PublishedContent {
  home: { name: string; intro: string; now: string; github: string; email: string; featuredWork: string };
  about: { html: string }; life: LifeRecord[]; work: Project[];
}
// Build-time only: allowlisted published data, never private source.
export const content: PublishedContent = JSON.parse(fs.readFileSync('.generated/content.json', 'utf8'));
export const stageLabels = { 'in-progress': '进行中', completed: '已完成', paused: '暂时搁置' };
export function formatDate(date: string) {
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Shanghai' }).format(new Date(`${date}T00:00:00+08:00`));
}
