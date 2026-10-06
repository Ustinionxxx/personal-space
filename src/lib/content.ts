import fs from 'node:fs';
import type { Locale } from './i18n';
interface TranslationInfo { titleLang: string; bodyLang: string; translationFallback: boolean }
export interface Photo { src: string; width: number; height: number; alt: string; altLang: string; caption: string; captionLang: string }
export interface LifeRecord extends TranslationInfo {
  id: string; slug: string; title: string; date: string; tags: string[];
  html: string; images: Photo[]; workRef: string;
}
export interface Project extends TranslationInfo {
  id: string; slug: string; title: string; date: string; description: string;
  stage: 'in-progress' | 'completed' | 'paused'; tech: string[]; html: string;
  descriptionLang: string;
  cover: Pick<Photo, 'src' | 'width' | 'height'> | null; lifeRef: string;
  links?: { github: string; demo: string; process: string };
}
interface PublishedContent {
  home: { name: string; intro: string; now: string; github: string; email: string; featuredWork: string; introLang: string; nowLang: string; translationFallback: boolean };
  about: { html: string; bodyLang: string; translationFallback: boolean }; life: LifeRecord[]; work: Project[];
}
// Build-time only: allowlisted published data, never private source.
export const content: PublishedContent & { locales: Record<'zh-tw' | 'en', PublishedContent> } = JSON.parse(fs.readFileSync('.generated/content.json', 'utf8'));
export function getContent(locale: Locale = 'zh-cn'): PublishedContent {
  return locale === 'zh-cn' ? content : content.locales[locale];
}
