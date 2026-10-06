import OpenCC from 'opencc-js';

// Build-time conversion only. URLs, IDs, Markdown syntax and code stay intact.
export const toTraditional = OpenCC.Converter({ from: 'cn', to: 'tw' });
export const contentLocales = ['zh-cn', 'zh-tw', 'en'];
export const htmlLanguage = { 'zh-cn': 'zh-CN', 'zh-tw': 'zh-Hant', en: 'en' };
export function translatedField(original, english, locale) {
  if (locale === 'zh-tw') return { value: toTraditional(original), lang: htmlLanguage[locale], fallback: false };
  if (locale === 'en' && original && !english) return { value: original, lang: 'zh-CN', fallback: true };
  return { value: locale === 'en' ? english || original : original, lang: htmlLanguage[locale], fallback: false };
}

export function localContentLink(href, locale) {
  if (locale === 'zh-cn' || !/^(?:\/(?:life|work|about|secret)(?:\/|[?#]|$)|\/(?:[?#]|$))/.test(href)) return href;
  return `/${locale}${href}`;
}
