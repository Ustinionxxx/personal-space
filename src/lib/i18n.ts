export const locales = ['zh-cn', 'zh-tw', 'en'] as const;
export type Locale = typeof locales[number];
export const localeLabels: Record<Locale, string> = { 'zh-cn': '简体中文', 'zh-tw': '繁體中文', en: 'English' };
export const languageTags: Record<Locale, string> = { 'zh-cn': 'zh-CN', 'zh-tw': 'zh-Hant', en: 'en' };
export function localeFromPath(path: string): Locale {
  const prefix = path.split('/')[1];
  return prefix === 'en' || prefix === 'zh-tw' ? prefix : 'zh-cn';
}
export function unlocalizedPath(path: string) {
  return path.replace(/^\/(en|zh-tw)(?=\/|$)/, '') || '/';
}
export function localizedPath(path: string, locale: Locale) {
  const base = unlocalizedPath(path);
  return locale === 'zh-cn' ? base : `/${locale}${base === '/' ? '/' : base}`;
}
export function formatDate(date: string, locale: Locale = 'zh-cn') {
  return new Intl.DateTimeFormat(locale === 'zh-tw' ? 'zh-TW' : languageTags[locale], {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Shanghai',
  }).format(new Date(`${date}T00:00:00+08:00`));
}
const simplified = {
  home: '首页', work: '折腾', life: '生活', about: '关于', mainNav: '主导航', skip: '跳到内容',
  theme: '切换亮暗主题', language: '选择语言', space: '一个个人空间', now: '最近在', recent: '最近留下的',
  moreLife: '去生活里看看', emptyRecent: '还没有公开的记录。这里先留一点空白。', recentWork: '最近的折腾',
  moreWork: '更多折腾', contact: '关于与联系', knowMe: '再认识我一点', email: '写封邮件',
  lifeIntro: '照片、随手记，和一些还没想完的事。', lifeEmpty: '这里还没有公开的记录。',
  workIntro: '做过的、还在做的，也有暂时放下的。', workEmpty: '项目还在整理，先留个位置。',
  aboutMe: '关于我', aboutEmpty: '这部分还在整理。', tags: '标签', tech: '技术', photo: '照片',
  allPhotos: '查看全部照片', viewPhoto: '查看照片', record: '的记录', relatedWork: '相关折腾', relatedLife: '相关生活记录',
  source: '源码', demo: '在线演示', process: '过程记录', projectImage: '项目画面',
  stages: { 'in-progress': '进行中', completed: '已完成', paused: '暂时搁置' },
  original: '这段内容暂时保留原文。', boot: '播放开场', bootClose: '跳过 / 关闭 ×', reduceMotion: '减少动画',
  bootHint: '按 Esc 或点击“跳过 / 关闭”返回。', bootLines: ['$ open personal-space', '[ok] 文字', '[ok] 照片', '[ok] 还没完成的想法', '', '空间已打开。', '$ _'],
  retired: '旧入口', retiredTitle: '这个入口已经停用了', retiredBody: '这里是公开网页，不再用来存放私密内容。',
  notFound: '页面不存在', nothing: '这里什么都没有', backHome: '返回首页',
};
export const messages: Record<Locale, typeof simplified> = {
  'zh-cn': simplified,
  'zh-tw': {
    home: '首頁', work: '折騰', life: '生活', about: '關於', mainNav: '主導覽', skip: '跳到內容',
    theme: '切換亮暗主題', language: '選擇語言', space: '一個個人空間', now: '最近在', recent: '最近留下的',
    moreLife: '去生活裡看看', emptyRecent: '還沒有公開的記錄。這裡先留一點空白。', recentWork: '最近的折騰',
    moreWork: '更多折騰', contact: '關於與聯絡', knowMe: '再認識我一點', email: '寫封郵件',
    lifeIntro: '照片、隨手記，和一些還沒想完的事。', lifeEmpty: '這裡還沒有公開的記錄。',
    workIntro: '做過的、還在做的，也有暫時放下的。', workEmpty: '專案還在整理，先留個位置。',
    aboutMe: '關於我', aboutEmpty: '這部分還在整理。', tags: '標籤', tech: '技術', photo: '照片',
    allPhotos: '查看全部照片', viewPhoto: '查看照片', record: '的記錄', relatedWork: '相關折騰', relatedLife: '相關生活記錄',
    source: '原始碼', demo: '線上展示', process: '過程記錄', projectImage: '專案畫面',
    stages: { 'in-progress': '進行中', completed: '已完成', paused: '暫時擱置' },
    original: '這段內容暫時保留原文。', boot: '播放開場', bootClose: '跳過 / 關閉 ×', reduceMotion: '減少動畫',
    bootHint: '按 Esc 或點選「跳過 / 關閉」返回。', bootLines: ['$ open personal-space', '[ok] 文字', '[ok] 照片', '[ok] 還沒完成的想法', '', '空間已開啟。', '$ _'],
    retired: '舊入口', retiredTitle: '這個入口已經停用了', retiredBody: '這裡是公開網頁，不再用來存放私密內容。',
    notFound: '頁面不存在', nothing: '這裡什麼都沒有', backHome: '返回首頁',
  },
  en: {
    home: 'Home', work: 'Projects', life: 'Life', about: 'About', mainNav: 'Main navigation', skip: 'Skip to content',
    theme: 'Toggle light and dark theme', language: 'Choose a language', space: 'A personal space', now: 'Lately,', recent: 'Recent notes',
    moreLife: 'More from life', emptyRecent: 'No public notes yet. A little room to start.', recentWork: 'Recent projects',
    moreWork: 'More projects', contact: 'About and contact', knowMe: 'A little more about me', email: 'Send an email',
    lifeIntro: 'Photos, short notes, and thoughts still taking shape.', lifeEmpty: 'No public notes here yet.',
    workIntro: 'Things I have made, things in progress, and things set aside.', workEmpty: 'Projects are still being gathered. Saving a place for them.',
    aboutMe: 'About me', aboutEmpty: 'This part is still taking shape.', tags: 'Tags', tech: 'Technologies', photo: 'Photo',
    allPhotos: 'View all photos', viewPhoto: 'View photo', record: ' — a note', relatedWork: 'Related project', relatedLife: 'Related note',
    source: 'Source code', demo: 'Live demo', process: 'Process notes', projectImage: 'Project image',
    stages: { 'in-progress': 'In progress', completed: 'Completed', paused: 'On hold' },
    original: 'This content is shown in its original language. An English version has not been added yet.',
    boot: 'Play intro', bootClose: 'Skip / Close ×', reduceMotion: 'Reduce motion',
    bootHint: 'Press Esc or choose “Skip / Close” to return.',
    bootLines: ['$ open personal-space', '[ok] words', '[ok] photos', '[ok] unfinished ideas', '', 'Space is open.', '$ _'],
    retired: 'Retired page', retiredTitle: 'This page has been retired', retiredBody: 'This is a public website. It does not store private content.',
    notFound: 'Page not found', nothing: 'Nothing here yet', backHome: 'Back to home',
  },
};
