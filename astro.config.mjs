import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Pages that tell search engines not to index them (noindex) stay out of the sitemap.
const hiddenPages = /^\/(?:(?:en|zh-tw)\/)?(?:secret|404)\/?$/;

export default defineConfig({
  site: process.env.SITE_URL || 'https://personal-space-ustinionxxx.pages.dev',
  output: 'static',
  i18n: {
    locales: ['zh-cn', 'zh-tw', 'en'],
    defaultLocale: 'zh-cn',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: page => !hiddenPages.test(new URL(page).pathname),
      i18n: {
        defaultLocale: 'zh-cn',
        locales: { 'zh-cn': 'zh-CN', 'zh-tw': 'zh-Hant', en: 'en' },
      },
    }),
  ],
});
