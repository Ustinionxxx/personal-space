import { content } from '@/lib/content';
export const siteConfig = content.home;

export const navItems = [
  { label: "首页", href: "/" },
  { label: "折腾", href: "/work" },
  { label: "生活", href: "/life" },
  { label: "关于", href: "/about" },
] as const;
