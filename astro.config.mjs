import { defineConfig } from 'astro/config';

export default defineConfig({
  ...(process.env.SITE_URL ? { site: process.env.SITE_URL } : {}),
  output: 'static',
  i18n: {
    locales: ['zh-cn', 'zh-tw', 'en'],
    defaultLocale: 'zh-cn',
    routing: { prefixDefaultLocale: false },
  },
});
