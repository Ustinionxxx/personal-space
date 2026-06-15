# Personal Digital Space Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal personal digital space website using Astro 5 with light/dark mode, 4 main pages (Home/Work/Life/About), magazine-style Life layout, and inline SVG illustrations.

**Architecture:** Astro 5 static site generator with TypeScript, CSS Variables for theming, Markdown content collections, zero-JS-by-default islands architecture. All content placeholder-first, illustrations as inline SVG.

**Tech Stack:** Astro 5, TypeScript, CSS Variables (light/dark), Markdown (Content Collections), SVG (inline), CSS Animations only.

**Reference Spec:** `docs/superpowers/specs/2026-06-15-personal-site-design.md`

---

## File Structure Map

```
/home/xingsijia/projects/personal-site/
├── astro.config.mjs              # Astro config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
├── src/
│   ├── config.ts                 # Site-wide configuration
│   ├── env.d.ts                  # TypeScript env declarations
│   ├── styles/
│   │   └── global.css            # CSS Variables, reset, theme, typography, spacing
│   ├── layouts/
│   │   └── BaseLayout.astro      # HTML skeleton, global styles, theme persistence
│   ├── components/
│   │   ├── Nav.astro             # Navigation bar with theme toggle
│   │   ├── Footer.astro          # Minimal footer
│   │   ├── Character.astro       # SVG character component (props: id, size)
│   │   ├── EmptyState.astro      # Empty state with character + message
│   │   ├── TagPill.astro         # Tech stack / tag pill
│   │   ├── WorkCard.astro        # Project card for Work list
│   │   ├── LifeCard.astro        # Photo card for Life grid
│   │   ├── SecretModal.astro     # Password modal for secret corner
│   │   └── icons/                # SVG icon components
│   │       ├── GitHubIcon.astro
│   │       ├── EmailIcon.astro
│   │       └── SunMoonIcon.astro
│   ├── pages/
│   │   ├── index.astro           # Home page
│   │   ├── work/
│   │   │   ├── index.astro       # Work list
│   │   │   └── [slug].astro      # Work detail
│   │   ├── life/
│   │   │   ├── index.astro       # Life grid
│   │   │   └── [slug].astro      # Life detail
│   │   ├── about.astro           # About page
│   │   ├── secret.astro          # Private corner
│   │   └── 404.astro             # 404 page
│   ├── content/
│   │   ├── config.ts             # Content collections schema
│   │   ├── work/
│   │   │   ├── project-alpha.md
│   │   │   └── project-beta.md
│   │   ├── life/
│   │   │   ├── record-one.md
│   │   │   └── record-two.md
│   │   └── about.md
│   └── utils/
│       └── content.ts            # Content query helpers
├── public/
│   └── images/                   # Static images (placeholder PNGs)
└── README.md
```

---

## Phase 1: Foundation

**Goal:** Astro project initialized, global styles with CSS Variables, navigation bar, dark mode toggle working.

### Task 1.1: Initialize Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/env.d.ts`, `.gitignore`

- [ ] **Step 1: Create project directory and initialize git**

```bash
cd /home/xingsijia/projects/personal-site
git init
```

- [ ] **Step 2: Create package.json**

```json
{
  "name": "personal-site",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 3: Install dependencies**

```bash
cd /home/xingsijia/projects/personal-site
npm install
```

- [ ] **Step 4: Create astro.config.mjs**

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://your-domain.com',
  output: 'static',
});
```

- [ ] **Step 5: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.astro"]
}
```

- [ ] **Step 6: Create src/env.d.ts**

```typescript
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

- [ ] **Step 7: Create .gitignore**

```
node_modules/
dist/
.astro/
.env
```

- [ ] **Step 8: Create README.md placeholder**

```markdown
# Personal Digital Space

A minimal personal digital space built with Astro.
```

- [ ] **Step 9: Verify project runs**

```bash
npm run dev
# Visit http://localhost:4321 — should show Astro default page
```

Expected: Astro dev server starts, empty project with default page.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: initialize Astro project

Initialized Astro 5 project with TypeScript and strict tsconfig.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 1.2: Create global CSS with design tokens

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create global.css with CSS reset, variables, typography, utilities**

```css
/* ===== CSS Reset ===== */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  transition: background-color 300ms ease, color 300ms ease;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

a {
  color: inherit;
  text-decoration: none;
}

ul, ol {
  list-style: none;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
}

/* ===== Design Tokens ===== */
:root {
  /* Colors - Light (default) */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --bg-card: #FFFFFF;
  --text-primary: #1A1A1A;
  --text-secondary: #666666;
  --text-muted: #999999;
  --accent: #2E6F6A;
  --accent-light: #3D8B84;
  --border: #E5E5E5;
  --shadow: rgba(0, 0, 0, 0.05);

  /* Typography */
  --font-sans: system-ui, -apple-system, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace;

  /* Font Sizes */
  --text-display: 48px;
  --text-h1: 32px;
  --text-h2: 24px;
  --text-h3: 20px;
  --text-body: 16px;
  --text-small: 14px;
  --text-caption: 12px;

  /* Spacing (4px base) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;

  /* Radii */
  --radius-pill: 999px;
  --radius-card: 12px;
  --radius-image: 8px;

  /* Max content width */
  --max-width: 1200px;
  --max-width-narrow: 720px;
}

/* ===== Dark Theme ===== */
[data-theme="dark"] {
  --bg-primary: #0A0A0A;
  --bg-secondary: #121212;
  --bg-card: #1A1A1A;
  --text-primary: #F0F0F0;
  --text-secondary: #888888;
  --text-muted: #555555;
  --accent: #4A9E96;
  --accent-light: #5CB5AD;
  --border: #2A2A2A;
  --shadow: rgba(0, 0, 0, 0.3);
}

/* ===== Typography Utility ===== */
.text-display { font-size: var(--text-display); font-weight: 400; }
.text-h1     { font-size: var(--text-h1);     font-weight: 400; }
.text-h2     { font-size: var(--text-h2);     font-weight: 400; }
.text-h3     { font-size: var(--text-h3);     font-weight: 400; }
.text-body   { font-size: var(--text-body);   font-weight: 400; }
.text-small  { font-size: var(--text-small);  font-weight: 400; }
.text-caption{ font-size: var(--text-caption);font-weight: 400; }
.text-mono   { font-family: var(--font-mono); }

.text-secondary { color: var(--text-secondary); }
.text-muted     { color: var(--text-muted); }
.text-accent    { color: var(--accent); }

/* ===== Container Utility ===== */
.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.container-narrow {
  max-width: var(--max-width-narrow);
}

/* ===== Responsive Font Sizes ===== */
@media (max-width: 768px) {
  :root {
    --text-display: 32px;
    --text-h1: 24px;
    --text-h2: 20px;
    --text-h3: 18px;
  }
}
```

- [ ] **Step 2: Verify dev server still runs**

```bash
npm run dev
```

Expected: No errors, server starts.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add global CSS with design tokens and light/dark theme

Includes CSS reset, typography scale, spacing system (4px base),
design tokens via CSS custom properties, and responsive font sizes.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 1.3: Create site configuration

**Files:**
- Create: `src/config.ts`

- [ ] **Step 1: Create config.ts**

```typescript
export const siteConfig = {
  name: "邢思佳",
  tagline: "一个试图把生活变成代码注释的人类",
  github: "https://github.com/Ustinionxxx",
  email: "your.email@example.com",
  secretPassword: "changeme",
} as const;

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Life", href: "/life" },
  { label: "About", href: "/about" },
] as const;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx astro check
```

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add src/config.ts
git commit -m "feat: add site configuration

Site name, tagline, social links, password, and navigation items.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 1.4: Create BaseLayout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create BaseLayout.astro with HTML skeleton, theme script, global CSS import**

```astro
---
import "@/styles/global.css";

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="zh-CN" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </head>
  <body>
    <script is:inline>
      // Apply saved theme before paint to prevent flash
      (function () {
        const saved = localStorage.getItem("theme");
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        const theme = saved || (prefersDark ? "dark" : "light");
        document.documentElement.setAttribute("data-theme", theme);
      })();
    </script>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Verify**

```bash
npx astro check
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add BaseLayout with theme persistence

HTML skeleton with flash-free dark mode via inline script that reads
localStorage before paint, respecting system prefers-color-scheme.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 1.5: Create icon components

**Files:**
- Create: `src/components/icons/GitHubIcon.astro`
- Create: `src/components/icons/EmailIcon.astro`
- Create: `src/components/icons/SunMoonIcon.astro`

- [ ] **Step 1: Create GitHubIcon.astro**

```astro
---
interface Props {
  size?: number;
}

const { size = 24 } = Astro.props;
---

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  xmlns="http://www.w3.org/2000/svg"
  aria-label="GitHub"
  role="img"
>
  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
</svg>
```

- [ ] **Step 2: Create EmailIcon.astro**

```astro
---
interface Props {
  size?: number;
}

const { size = 24 } = Astro.props;
---

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  xmlns="http://www.w3.org/2000/svg"
  aria-label="Email"
  role="img"
>
  <rect width="20" height="16" x="2" y="4" rx="2" />
  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
</svg>
```

- [ ] **Step 3: Create SunMoonIcon.astro**

```astro
---
interface Props {
  size?: number;
  theme: "light" | "dark";
}

const { size = 24, theme } = Astro.props;
---

{
  theme === "light" ? (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Switch to dark mode"
      role="img"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ) : (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Switch to light mode"
      role="img"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}
```

- [ ] **Step 4: Verify icons render**

```bash
npx astro check
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/icons/
git commit -m "feat: add SVG icon components

GitHubIcon, EmailIcon, and SunMoonIcon (theme toggle).
All icons are inline SVG using currentColor for theme compatibility.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 1.6: Create Navigation component with theme toggle

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Create Nav.astro**

```astro
---
import { navItems, siteConfig } from "@/config";
import SunMoonIcon from "@/components/icons/SunMoonIcon.astro";

const currentPath = Astro.url.pathname;
---

<nav class="nav">
  <div class="nav-inner container">
    <a href="/" class="nav-logo">{siteConfig.name}</a>

    <ul class="nav-links">
      {
        navItems.map((item) => (
          <li>
            <a
              href={item.href}
              class={`nav-link ${currentPath === item.href ? "nav-link--active" : ""}`}
            >
              {item.label}
            </a>
          </li>
        ))
      }
    </ul>

    <button
      class="nav-theme-btn"
      id="theme-toggle"
      aria-label="Toggle dark mode"
      type="button"
    >
      <span class="nav-theme-icon nav-theme-icon--light">
        <SunMoonIcon theme="light" size={20} />
      </span>
      <span class="nav-theme-icon nav-theme-icon--dark">
        <SunMoonIcon theme="dark" size={20} />
      </span>
    </button>
  </div>
</nav>

<script>
  const btn = document.getElementById("theme-toggle")!;
  btn.addEventListener("click", () => {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
</script>

<style>
  .nav {
    padding: var(--space-lg) 0;
  }

  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-logo {
    font-size: var(--text-h3);
    font-weight: 400;
    color: var(--text-primary);
    transition: color 200ms ease;
  }

  .nav-logo:hover {
    color: var(--accent);
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: var(--space-xl);
  }

  .nav-link {
    font-size: var(--text-body);
    color: var(--text-secondary);
    transition: color 200ms ease;
    position: relative;
    padding-bottom: 2px;
  }

  .nav-link:hover {
    color: var(--text-primary);
  }

  .nav-link--active {
    color: var(--accent);
  }

  .nav-link--active::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--accent);
    border-radius: 1px;
  }

  .nav-theme-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-pill);
    color: var(--text-secondary);
    transition: color 200ms ease, background-color 200ms ease;
  }

  .nav-theme-btn:hover {
    color: var(--text-primary);
    background-color: var(--bg-secondary);
  }

  /* Show/hide correct icon based on theme */
  [data-theme="light"] .nav-theme-icon--dark,
  [data-theme="dark"] .nav-theme-icon--light {
    display: none;
  }

  /* Mobile nav */
  @media (max-width: 768px) {
    .nav-links {
      gap: var(--space-md);
    }

    .nav-link {
      font-size: var(--text-small);
    }
  }
</style>
```

- [ ] **Step 2: Verify builds**

```bash
npx astro check
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: add navigation bar with theme toggle

Capsule-style nav with logo, page links, active indicator, and
dark mode toggle button. Light/dark icon auto-switches via CSS.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 1.7: Create Footer component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create Footer.astro**

```astro
---
import { siteConfig } from "@/config";
---

<footer class="footer">
  <p class="footer-text">&copy; {new Date().getFullYear()} {siteConfig.name}</p>
</footer>

<style>
  .footer {
    padding: var(--space-2xl) 0;
    text-align: center;
  }

  .footer-text {
    font-size: var(--text-caption);
    color: var(--text-muted);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add minimal footer component

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 1.8: Create test home page to verify foundation

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create index.astro to verify everything works together**

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import Nav from "@/components/Nav.astro";
import { siteConfig } from "@/config";
---

<BaseLayout title={siteConfig.name}>
  <Nav />
  <main class="container" style="padding-top: var(--space-4xl); text-align: center;">
    <h1 class="text-display">{siteConfig.name}</h1>
    <p class="text-body text-secondary" style="margin-top: var(--space-md);">
      {siteConfig.tagline}
    </p>
  </main>
</BaseLayout>
```

- [ ] **Step 2: Run dev server and verify**

```bash
npm run dev
```

Expected: Visit http://localhost:4321 — see name, tagline, navigation with theme toggle working.

- [ ] **Step 3: Test theme toggle**
    - Click theme button → dark mode activates (background dark, text light)
    - Refresh page → dark mode persists (localStorage)
    - Verify no flash on reload

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add test home page to verify foundation

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 1.9: Update design document

**Files:**
- Modify: `/home/xingsijia/projects/claude/项目设计方案.md`

- [ ] **Step 1: Add Phase 1 completion marker to design document**

Append to the end of the design document:

```markdown
## 修订历史

| 日期 | 修订内容 |
|------|----------|
| 2026-06-15 | Phase 1 完成：Astro 项目初始化、全局样式（CSS Variables 亮暗双模式）、导航栏（含主题切换）、页脚、BaseLayout、站点配置 |
```

- [ ] **Step 2: Commit**

```bash
git -C /home/xingsijia/projects/claude add 项目设计方案.md
git -C /home/xingsijia/projects/claude commit -m "docs: mark Phase 1 complete

Personal site foundation: Astro init, global styles, nav, theme toggle.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Phase 2: Home Page

**Goal:** Complete homepage with floating character SVG, name, tagline, social links.

### Task 2.1: Create Character component

**Files:**
- Create: `src/components/Character.astro`

- [ ] **Step 1: Create Character.astro with SVG templates for different characters**

```astro
---
export type CharacterId = "hero" | "coder" | "waiting" | "lost";

interface Props {
  id: CharacterId;
  size?: number;
  animate?: boolean;
}

const { id, size = 120, animate = false } = Astro.props;

// Simple geometric characters — refined in later iterations
function getCharacter(id: CharacterId) {
  switch (id) {
    case "hero":
      return {
        viewBox: "0 0 80 120",
        body: `<circle cx="40" cy="30" r="16" fill="none" stroke="currentColor" stroke-width="2"/>
               <line x1="40" y1="46" x2="40" y2="80" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
               <line x1="20" y1="60" x2="60" y2="60" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
               <line x1="40" y1="80" x2="28" y2="108" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
               <line x1="40" y1="80" x2="52" y2="108" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
               <circle cx="34" cy="28" r="2.5" fill="currentColor"/>
               <circle cx="46" cy="28" r="2.5" fill="currentColor"/>`,
      };
    case "coder":
      return {
        viewBox: "0 0 80 80",
        body: `<rect x="12" y="30" width="56" height="36" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
               <rect x="22" y="36" width="36" height="22" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
               <line x1="30" y1="72" x2="28" y2="78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
               <line x1="50" y1="72" x2="52" y2="78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
               <circle cx="40" cy="16" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
               <circle cx="36" cy="14" r="2" fill="currentColor"/>
               <circle cx="44" cy="14" r="2" fill="currentColor"/>`,
      };
    case "waiting":
      return {
        viewBox: "0 0 120 120",
        body: `<circle cx="60" cy="40" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
               <path d="M30 100 Q30 70 60 70 Q90 70 90 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
               <line x1="50" y1="85" x2="50" y2="105" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
               <line x1="70" y1="85" x2="70" y2="105" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
               <circle cx="52" cy="36" r="2.5" fill="currentColor"/>
               <circle cx="68" cy="36" r="2.5" fill="currentColor"/>`,
      };
    case "lost":
      return {
        viewBox: "0 0 120 120",
        body: `<circle cx="60" cy="36" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
               <line x1="60" y1="54" x2="60" y2="85" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
               <line x1="36" y1="60" x2="84" y2="60" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
               <line x1="60" y1="85" x2="48" y2="110" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
               <line x1="60" y1="85" x2="72" y2="110" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
               <circle cx="52" cy="32" r="2.5" fill="currentColor"/>
               <circle cx="68" cy="32" r="2.5" fill="currentColor"/>
               <text x="78" y="30" font-size="14" fill="currentColor">?</text>
               <text x="90" y="38" font-size="10" fill="currentColor">?</text>`,
      };
  }
}

const char = getCharacter(id);
---

<svg
  width={size}
  height={size * (parseInt(char.viewBox.split(" ")[3]) / parseInt(char.viewBox.split(" ")[2]))}
  viewBox={char.viewBox}
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class={animate ? "character--float" : ""}
  aria-hidden="true"
>
  <set:html>{char.body}</set:html>
</svg>

<style>
  .character--float {
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
</style>
```

- [ ] **Step 2: Verify**

```bash
npx astro check
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Character.astro
git commit -m "feat: add SVG Character component

Four character variants: hero, coder, waiting, lost.
Minimal line-art style using currentColor for theme compatibility.
Hero variant supports CSS float animation.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 2.2: Build complete Home page

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Rewrite index.astro with full homepage layout**

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import Nav from "@/components/Nav.astro";
import Character from "@/components/Character.astro";
import GitHubIcon from "@/components/icons/GitHubIcon.astro";
import EmailIcon from "@/components/icons/EmailIcon.astro";
import { siteConfig } from "@/config";
---

<BaseLayout title={siteConfig.name} description={siteConfig.tagline}>
  <Nav />
  <main class="home">
    <div class="home-hero">
      <div class="home-character">
        <Character id="hero" size={120} animate={true} />
      </div>

      <h1 class="home-name text-display">{siteConfig.name}</h1>

      <p class="home-tagline text-body text-secondary">
        {siteConfig.tagline}
      </p>

      <div class="home-social">
        <a
          href={siteConfig.github}
          target="_blank"
          rel="noopener noreferrer"
          class="home-social-link"
          aria-label="GitHub"
        >
          <GitHubIcon size={24} />
        </a>
        <a
          href={`mailto:${siteConfig.email}`}
          class="home-social-link"
          aria-label="Email"
        >
          <EmailIcon size={24} />
        </a>
      </div>
    </div>
  </main>

  <style>
    .home {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 200px);
    }

    .home-hero {
      text-align: center;
    }

    .home-character {
      color: var(--text-primary);
      margin-bottom: var(--space-lg);
    }

    .home-name {
      color: var(--text-primary);
      margin-bottom: var(--space-md);
    }

    .home-tagline {
      margin-bottom: var(--space-xl);
      font-style: italic;
    }

    .home-social {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-lg);
    }

    .home-social-link {
      color: var(--text-secondary);
      transition: color 200ms ease;
      display: flex;
      align-items: center;
    }

    .home-social-link:hover {
      color: var(--text-primary);
    }
  </style>
</BaseLayout>
```

- [ ] **Step 2: Run dev server and verify**

```bash
npm run dev
```

Expected: Home page shows floating character, name, tagline, GitHub + Email icons.
Verify: character floats, social icon hover works, theme toggle works.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: complete Home page with character and social links

Floating hero SVG character, display name, italic tagline,
GitHub and Email social links with hover transitions.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 2.3: Update design document

- [ ] **Step 1: Add Phase 2 completion marker**

```bash
# Edit 项目设计方案.md, append to revision history:
# | 2026-06-15 | Phase 2 完成：首页完整布局、浮动小人 SVG、名字/一句话、社交链接（GitHub + Email）、响应式适配 |
```

- [ ] **Step 2: Commit**

```bash
git -C /home/xingsijia/projects/claude add 项目设计方案.md
git -C /home/xingsijia/projects/claude commit -m "docs: mark Phase 2 complete

Home page with character, name, tagline, social links.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Phase 3: Work Section

**Goal:** Project card list page, project detail pages with Markdown rendering.

### Task 3.1: Create Content Collections config

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: Create content collection schema**

```typescript
import { defineCollection, z } from "astro:content";

const workCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    cover: z.string().optional(),
    tech: z.array(z.string()).default([]),
    links: z
      .object({
        github: z.string().optional(),
        demo: z.string().optional(),
      })
      .optional(),
    lifeRef: z.string().optional(),
  }),
});

const lifeCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    images: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    workRef: z.string().optional(),
    layout: z.enum(["featured", "normal"]).default("normal"),
  }),
});

export const collections = {
  work: workCollection,
  life: lifeCollection,
};
```

- [ ] **Step 2: Verify types generated**

```bash
npx astro check
```

Expected: Types generated, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: add Content Collections schema for Work and Life

Work: title, description, cover, tech stack, links, lifeRef.
Life: title, images, tags, workRef, layout (featured/normal).

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 3.2: Create placeholder content

**Files:**
- Create: `src/content/work/project-alpha.md`
- Create: `src/content/work/project-beta.md`
- Create: `src/content/about.md`

- [ ] **Step 1: Create project-alpha.md**

```markdown
---
title: "Project Alpha"
description: "一个帮助开发者快速生成 API 文档的命令行工具"
tech: ["Go", "TypeScript", "OpenAPI"]
links:
  github: "https://github.com/Ustinionxxx/project-alpha"
  demo: "https://alpha.example.com"
---

## 项目概述

Project Alpha 是一个命令行工具，可以从代码注释中自动生成符合 OpenAPI 3.0 规范的 API 文档。

支持 Go 和 TypeScript 两种语言的注释解析，输出美观的交互式文档页面。

## 技术细节

- 使用 Go 编写的 AST 解析器提取注释
- TypeScript 编译器 API 处理类型推导
- 基于 Swagger UI 渲染文档页面
```

- [ ] **Step 2: Create project-beta.md**

```markdown
---
title: "Project Beta"
description: "基于大模型的代码审查助手"
tech: ["Python", "LLM", "GitHub API"]
links:
  github: "https://github.com/Ustinionxxx/project-beta"
---

## 项目概述

Project Beta 是一个集成到 GitHub PR 流程中的代码审查助手。

利用大语言模型分析代码变更，自动生成 review comments，帮助团队提高代码质量。

## 技术细节

- 基于 LangChain 的 Agent 框架
- GitHub Webhook 事件驱动
- 支持可配置的审查规则
```

- [ ] **Step 3: Create about.md**

```markdown
---
title: "关于我"
---

写后端代码，玩 AI 模型。
闲暇时爬山、逛博物馆、打游戏。
试图用技术记录生活，
也试图让生活成为技术的灵感来源。

## 技术方向

- 后端开发
- AI 大模型
```

- [ ] **Step 4: Commit**

```bash
git add src/content/
git commit -m "feat: add placeholder content for Work and About

Two sample projects and about page content.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 3.3: Create TagPill component

**Files:**
- Create: `src/components/TagPill.astro`

- [ ] **Step 1: Create TagPill.astro**

```astro
---
interface Props {
  label: string;
}

const { label } = Astro.props;
---

<span class="tag-pill">{label}</span>

<style>
  .tag-pill {
    display: inline-block;
    padding: 2px var(--space-sm);
    font-size: var(--text-small);
    font-family: var(--font-mono);
    color: var(--text-secondary);
    background: var(--bg-secondary);
    border-radius: var(--radius-pill);
    transition: transform 200ms ease;
  }

  .tag-pill:hover {
    transform: scale(1.05);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TagPill.astro
git commit -m "feat: add TagPill component

Monospace pill tag for tech stack display with hover scale effect.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 3.4: Create WorkCard component

**Files:**
- Create: `src/components/WorkCard.astro`

- [ ] **Step 1: Create WorkCard.astro**

```astro
---
import type { CollectionEntry } from "astro:content";
import TagPill from "@/components/TagPill.astro";

interface Props {
  project: CollectionEntry<"work">;
}

const { project } = Astro.props;
const { title, description, tech, cover } = project.data;
---

<a href={`/work/${project.slug}`} class="work-card">
  <div class="work-card-cover">
    {
      cover ? (
        <img src={cover} alt={title} loading="lazy" />
      ) : (
        <div class="work-card-placeholder">
          <span class="text-muted text-small">封面占位</span>
        </div>
      )
    }
  </div>
  <div class="work-card-info">
    <h3 class="work-card-title text-h3">{title}</h3>
    <p class="work-card-desc text-body text-secondary">{description}</p>
    <div class="work-card-tags">
      {tech.map((t) => <TagPill label={t} />)}
    </div>
  </div>
</a>

<style>
  .work-card {
    display: grid;
    grid-template-columns: 40% 60%;
    gap: var(--space-lg);
    align-items: center;
    cursor: pointer;
    padding: var(--space-md) 0;
    border-bottom: 1px solid var(--border);
    text-decoration: none;
  }

  .work-card:first-of-type {
    border-top: 1px solid var(--border);
  }

  .work-card-cover img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: var(--radius-image);
  }

  .work-card-placeholder {
    width: 100%;
    aspect-ratio: 16 / 9;
    background: var(--bg-secondary);
    border-radius: var(--radius-image);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .work-card-title {
    color: var(--text-primary);
    margin-bottom: var(--space-xs);
  }

  .work-card-desc {
    margin-bottom: var(--space-sm);
  }

  .work-card-tags {
    display: flex;
    gap: var(--space-xs);
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .work-card {
      grid-template-columns: 1fr;
      gap: var(--space-md);
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/WorkCard.astro
git commit -m "feat: add WorkCard component

Horizontal card with 16:9 cover image placeholder, title,
description, and tech stack pills. Responsive: stacks vertically
on mobile.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 3.5: Create Work list page

**Files:**
- Create: `src/pages/work/index.astro`

- [ ] **Step 1: Create work/index.astro**

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import Nav from "@/components/Nav.astro";
import Footer from "@/components/Footer.astro";
import Character from "@/components/Character.astro";
import WorkCard from "@/components/WorkCard.astro";
import { getCollection } from "astro:content";

const projects = await getCollection("work");
---

<BaseLayout title="Work">
  <Nav />
  <main class="container container-narrow" style="padding-top: var(--space-4xl); padding-bottom: var(--space-4xl);">
    <div class="work-header">
      <Character id="coder" size={40} />
      <h1 class="text-h1">Work</h1>
    </div>
    <hr class="work-divider" />

    <div class="work-list">
      {projects.length === 0 ? (
        <p class="text-body text-muted">暂无项目</p>
      ) : (
        projects.map((project) => <WorkCard project={project} />)
      )}
    </div>
  </main>
  <Footer />

  <style>
    .work-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .work-divider {
      border: none;
      border-top: 1px solid var(--border);
      margin-bottom: var(--space-xl);
    }

    .work-list {
      display: flex;
      flex-direction: column;
    }
  </style>
</BaseLayout>
```

- [ ] **Step 2: Verify**

```bash
npx astro check && npm run dev
```

Expected: Visit http://localhost:4321/work — see Work page with coder character, project cards.

- [ ] **Step 3: Commit**

```bash
git add src/pages/work/index.astro
git commit -m "feat: add Work list page

Coder character header, project cards from content collection,
responsive layout.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 3.6: Create Work detail page

**Files:**
- Create: `src/pages/work/[slug].astro`

- [ ] **Step 1: Create [slug].astro**

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import Nav from "@/components/Nav.astro";
import Footer from "@/components/Footer.astro";
import TagPill from "@/components/TagPill.astro";
import { getCollection, type CollectionEntry } from "astro:content";

export async function getStaticPaths() {
  const projects = await getCollection("work");
  return projects.map((p) => ({ params: { slug: p.slug } }));
}

const { slug } = Astro.params;
const projects = await getCollection("work");
const project = projects.find((p) => p.slug === slug);

if (!project) {
  return Astro.redirect("/404");
}

const { title, description, tech, links, lifeRef } = project.data;
const { Content } = await project.render();
---

<BaseLayout title={title} description={description}>
  <Nav />
  <main class="container container-narrow" style="padding-top: var(--space-4xl); padding-bottom: var(--space-4xl);">
    <article>
      <header class="detail-header">
        <h1 class="text-h1">{title}</h1>
        <p class="text-body text-secondary" style="margin-top: var(--space-sm);">
          {description}
        </p>
      </header>

      <hr class="detail-divider" />

      <div class="detail-content">
        <Content />
      </div>

      <hr class="detail-divider" />

      <div class="detail-meta">
        <div class="detail-tags">
          <span class="text-small text-muted">技术栈：</span>
          <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap; margin-top: var(--space-xs);">
            {tech.map((t) => <TagPill label={t} />)}
          </div>
        </div>

        {links && (
          <div class="detail-links" style="margin-top: var(--space-lg);">
            {links.github && (
              <a href={links.github} target="_blank" rel="noopener noreferrer" class="detail-link">
                🔗 GitHub
              </a>
            )}
            {links.demo && (
              <a href={links.demo} target="_blank" rel="noopener noreferrer" class="detail-link">
                🔗 在线演示
              </a>
            )}
          </div>
        )}

        {lifeRef && (
          <p class="text-small" style="margin-top: var(--space-lg);">
            💡 灵感来自 <a href={`/life/${lifeRef}`} class="detail-crosslink">Life 区记录</a>
          </p>
        )}
      </div>
    </article>
  </main>
  <Footer />

  <style>
    .detail-header {
      margin-bottom: var(--space-lg);
    }

    .detail-divider {
      border: none;
      border-top: 1px solid var(--border);
      margin: var(--space-xl) 0;
    }

    .detail-content :global(h2) {
      font-size: var(--text-h2);
      font-weight: 400;
      color: var(--text-primary);
      margin: var(--space-lg) 0 var(--space-md);
    }

    .detail-content :global(h3) {
      font-size: var(--text-h3);
      font-weight: 400;
      color: var(--text-primary);
      margin: var(--space-md) 0 var(--space-sm);
    }

    .detail-content :global(p) {
      font-size: var(--text-body);
      color: var(--text-secondary);
      line-height: 1.8;
      margin-bottom: var(--space-md);
    }

    .detail-content :global(ul), .detail-content :global(ol) {
      list-style: disc;
      padding-left: var(--space-lg);
      color: var(--text-secondary);
      margin-bottom: var(--space-md);
    }

    .detail-content :global(li) {
      margin-bottom: var(--space-xs);
    }

    .detail-content :global(code) {
      font-family: var(--font-mono);
      font-size: var(--text-small);
      background: var(--bg-secondary);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .detail-content :global(pre) {
      background: var(--bg-secondary);
      padding: var(--space-md);
      border-radius: var(--radius-image);
      overflow-x: auto;
      margin-bottom: var(--space-md);
    }

    .detail-content :global(pre code) {
      background: none;
      padding: 0;
    }

    .detail-link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      color: var(--accent);
      font-size: var(--text-body);
      margin-right: var(--space-lg);
      transition: text-decoration 200ms ease;
    }

    .detail-link:hover {
      text-decoration: underline;
    }

    .detail-crosslink {
      color: var(--accent);
      transition: text-decoration 200ms ease;
    }

    .detail-crosslink:hover {
      text-decoration: underline;
    }
  </style>
</BaseLayout>
```

- [ ] **Step 2: Verify**

```bash
npx astro check && npm run dev
```

Expected: Visit http://localhost:4321/work/project-alpha — see full project detail with Markdown content rendered.

- [ ] **Step 3: Test 404 redirect for unknown slug**

Visit /work/nonexistent → redirects to /404.

- [ ] **Step 4: Commit**

```bash
git add src/pages/work/[slug].astro
git commit -m "feat: add Work detail page with Markdown rendering

Dynamic route [slug], full article layout with content rendering,
tech stack tags, external links, and cross-reference to Life.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 3.7: Update design document

- [ ] **Step 1: Append to revision history in 项目设计方案.md**

- [ ] **Step 2: Commit**

```bash
git -C /home/xingsijia/projects/claude add 项目设计方案.md
git -C /home/xingsijia/projects/claude commit -m "docs: mark Phase 3 complete

Work section: project list with cards, detail pages, Markdown rendering.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Phase 4: Life Section

**Goal:** Magazine-style photo grid, hover text reveal, lazy loading, single record page.

### Task 4.1: Create placeholder Life content

**Files:**
- Create: `src/content/life/record-one.md`
- Create: `src/content/life/record-two.md`

- [ ] **Step 1: Create record-one.md**

```markdown
---
title: "在博物馆看到了一只超可爱的陶俑"
tags: ["博物馆", "旅行"]
layout: "featured"
---

那天阳光很好，博物馆的人也不多。这只陶俑的表情像是在说"我几千岁了，你拍照经过我同意了吗"。
```

- [ ] **Step 2: Create record-two.md**

```markdown
---
title: "通关了！历时三个月"
tags: ["游戏"]
layout: "normal"
---

终于把之前买的那个 RPG 打通了。最后 Boss 战打了四遍才过，手柄差点扔出去。
```

- [ ] **Step 3: Commit**

```bash
git add src/content/life/
git commit -m "feat: add placeholder Life content

Two sample life records with tags and layout metadata.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 4.2: Create EmptyState component

**Files:**
- Create: `src/components/EmptyState.astro`

- [ ] **Step 1: Create EmptyState.astro**

```astro
---
import Character from "@/components/Character.astro";
import type { CharacterId } from "@/components/Character.astro";

interface Props {
  character: CharacterId;
  message: string;
}

const { character, message } = Astro.props;
---

<div class="empty-state">
  <div class="empty-state-char">
    <Character id={character} size={120} />
  </div>
  <p class="empty-state-msg text-small text-muted">{message}</p>
</div>

<style>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-4xl) 0;
  }

  .empty-state-char {
    color: var(--text-muted);
    margin-bottom: var(--space-md);
  }

  .empty-state-msg {
    font-style: italic;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EmptyState.astro
git commit -m "feat: add EmptyState component

Character + italic message for empty content states.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 4.3: Create LifeCard component

**Files:**
- Create: `src/components/LifeCard.astro`

- [ ] **Step 1: Create LifeCard.astro**

```astro
---
import type { CollectionEntry } from "astro:content";

interface Props {
  record: CollectionEntry<"life">;
  variant: "featured" | "normal";
}

const { record, variant } = Astro.props;
const { title, tags } = record.data;
const isFeatured = variant === "featured";
---

<a href={`/life/${record.slug}`} class={`life-card ${isFeatured ? "life-card--featured" : ""}`}>
  <div class="life-card-image">
    <div class="life-card-placeholder">
      <span class="text-muted text-small">照片占位</span>
    </div>
    <div class="life-card-overlay">
      <p class="life-card-title text-body">{title}</p>
      <div class="life-card-tags">
        {tags.map((t) => (
          <span class="life-card-tag text-caption">{t}</span>
        ))}
      </div>
    </div>
  </div>
</a>

<style>
  .life-card {
    display: block;
    cursor: pointer;
  }

  .life-card--featured {
    grid-column: span 2;
    grid-row: span 2;
  }

  .life-card-image {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 200px;
    border-radius: var(--radius-image);
    overflow: hidden;
  }

  .life-card--featured .life-card-image {
    min-height: 420px;
  }

  .life-card-placeholder {
    width: 100%;
    height: 100%;
    min-height: inherit;
    background: var(--bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .life-card-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--space-lg) var(--space-md) var(--space-md);
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
    opacity: 0;
    transition: opacity 300ms ease-out;
  }

  .life-card:hover .life-card-overlay {
    opacity: 1;
  }

  .life-card-title {
    color: #fff;
    margin-bottom: var(--space-xs);
  }

  .life-card-tags {
    display: flex;
    gap: var(--space-xs);
    flex-wrap: wrap;
  }

  .life-card-tag {
    color: rgba(255, 255, 255, 0.7);
    padding: 1px var(--space-sm);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: var(--radius-pill);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LifeCard.astro
git commit -m "feat: add LifeCard component with hover overlay

Magazine-style card with gradient overlay on hover showing title
and tags. Featured variant spans 2x2 grid cells.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 4.4: Create Life index page with magazine grid

**Files:**
- Create: `src/pages/life/index.astro`

- [ ] **Step 1: Create life/index.astro**

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import Nav from "@/components/Nav.astro";
import Footer from "@/components/Footer.astro";
import LifeCard from "@/components/LifeCard.astro";
import EmptyState from "@/components/EmptyState.astro";
import { getCollection } from "astro:content";

const records = await getCollection("life");
---

<BaseLayout title="Life">
  <Nav />
  <main class="container" style="padding-top: var(--space-4xl); padding-bottom: var(--space-4xl);">
    <div class="life-header">
      <h1 class="text-h1">🌿 Life</h1>
    </div>
    <hr class="life-divider" />

    {
      records.length === 0 ? (
        <EmptyState character="waiting" message="这里还在等待新的故事" />
      ) : (
        <div class="life-grid">
          {records.map((record) => (
            <LifeCard
              record={record}
              variant={record.data.layout === "featured" ? "featured" : "normal"}
            />
          ))}
        </div>
      )
    }
  </main>
  <Footer />

  <style>
    .life-header {
      margin-bottom: var(--space-lg);
    }

    .life-divider {
      border: none;
      border-top: 1px solid var(--border);
      margin-bottom: var(--space-xl);
    }

    .life-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-md);
      grid-auto-rows: 200px;
      grid-auto-flow: dense;
    }

    @media (max-width: 1024px) {
      .life-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .life-grid {
        grid-template-columns: 1fr;
        grid-auto-rows: 240px;
      }

      .life-card--featured {
        grid-column: span 1;
        grid-row: span 2;
      }
    }
  </style>
</BaseLayout>
```

- [ ] **Step 2: Verify**

```bash
npx astro check && npm run dev
```

Expected: Visit http://localhost:4321/life — magazine grid with hover overlay on cards.

- [ ] **Step 3: Commit**

```bash
git add src/pages/life/index.astro
git commit -m "feat: add Life magazine grid page

3-column dense grid with featured cards spanning 2x2.
Hover overlay reveals title and tags. Empty state with
waiting character when no records.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 4.5: Create Life detail page

**Files:**
- Create: `src/pages/life/[slug].astro`

- [ ] **Step 1: Create [slug].astro**

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import Nav from "@/components/Nav.astro";
import Footer from "@/components/Footer.astro";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const records = await getCollection("life");
  return records.map((r) => ({ params: { slug: r.slug } }));
}

const { slug } = Astro.params;
const records = await getCollection("life");
const record = records.find((r) => r.slug === slug);

if (!record) {
  return Astro.redirect("/404");
}

const { title, tags, images, workRef } = record.data;
const { Content } = await record.render();
---

<BaseLayout title={title}>
  <Nav />
  <main class="container container-narrow" style="padding-top: var(--space-4xl); padding-bottom: var(--space-4xl);">
    <article>
      <div class="detail-images">
        {images.length > 0 ? (
          images.map((img) => <img src={img} alt={title} loading="lazy" />)
        ) : (
          <div class="detail-img-placeholder">
            <span class="text-muted text-small">图片占位</span>
          </div>
        )}
      </div>

      <h1 class="text-h3" style="margin-top: var(--space-xl);">{title}</h1>

      <div class="detail-content" style="margin-top: var(--space-lg);">
        <Content />
      </div>

      <div class="detail-tags" style="margin-top: var(--space-xl);">
        {tags.map((t) => (
          <span class="life-tag text-small text-muted">🏷️ {t}</span>
        ))}
      </div>

      {workRef && (
        <p class="text-small" style="margin-top: var(--space-lg);">
          🛠️ 相关工具：<a href={`/work/${workRef}`} class="detail-crosslink">见 Work 区</a>
        </p>
      )}
    </article>
  </main>
  <Footer />

  <style>
    .detail-images {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-md);
    }

    .detail-images img {
      width: 100%;
      border-radius: var(--radius-image);
      object-fit: cover;
      max-height: 60vh;
    }

    .detail-img-placeholder {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: var(--bg-secondary);
      border-radius: var(--radius-image);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .detail-content :global(p) {
      font-size: var(--text-body);
      color: var(--text-secondary);
      line-height: 1.8;
      margin-bottom: var(--space-md);
    }

    .life-tag {
      display: inline-block;
      margin-right: var(--space-md);
    }

    .detail-crosslink {
      color: var(--accent);
      transition: text-decoration 200ms ease;
    }

    .detail-crosslink:hover {
      text-decoration: underline;
    }
  </style>
</BaseLayout>
```

- [ ] **Step 2: Verify**

```bash
npx astro check && npm run dev
```

Expected: Visit http://localhost:4321/life/record-one — see detail page with title, content, tags.

- [ ] **Step 3: Commit**

```bash
git add src/pages/life/[slug].astro
git commit -m "feat: add Life detail page

Image display area, title, Markdown content, tags, and
cross-reference to Work section.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 4.6: Update design document

- [ ] **Step 1: Append Phase 4 completion to 项目设计方案.md**

- [ ] **Step 2: Commit**

```bash
git -C /home/xingsijia/projects/claude add 项目设计方案.md
git -C /home/xingsijia/projects/claude commit -m "docs: mark Phase 4 complete

Life section: magazine grid, hover overlay, detail pages.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Phase 5: About & 404 Pages

**Goal:** About page with background image, secret entrance modal, 404 page with lost character.

### Task 5.1: Create About page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create about.astro**

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import Nav from "@/components/Nav.astro";
import Footer from "@/components/Footer.astro";
import { siteConfig } from "@/config";

// Inline content until about collection is wired
const aboutContent = {
  body: `写后端代码，玩 AI 模型。
闲暇时爬山、逛博物馆、打游戏。
试图用技术记录生活，
也试图让生活成为技术的灵感来源。`,
  skills: ["后端开发", "AI 大模型"],
};
---

<BaseLayout title="About">
  <Nav />
  <main class="about-page">
    <div class="about-bg"></div>
    <div class="about-content container container-narrow">
      <h1 class="text-h1">关于我</h1>
      <hr class="about-divider" />

      <div class="about-body text-body">
        {aboutContent.body.split("\n").map((line) => (
          <p>{line}</p>
        ))}
      </div>

      <h2 class="text-h3" style="margin-top: var(--space-xl); margin-bottom: var(--space-md);">
        技术方向
      </h2>
      <ul class="about-skills text-body text-secondary">
        {aboutContent.skills.map((s) => <li>{s}</li>)}
      </ul>
    </div>

    <Footer />
  </main>

  <style>
    .about-page {
      position: relative;
      padding-top: var(--space-4xl);
      padding-bottom: var(--space-4xl);
      min-height: 100vh;
    }

    .about-bg {
      position: absolute;
      inset: 0;
      background: var(--bg-secondary);
      /* placeholder for game screenshot background */
      opacity: 0.5;
      z-index: -1;
    }

    [data-theme="dark"] .about-bg {
      opacity: 0.3;
    }

    .about-content {
      position: relative;
      z-index: 1;
    }

    .about-divider {
      border: none;
      border-top: 1px solid var(--border);
      margin: var(--space-lg) 0 var(--space-xl);
    }

    .about-body p {
      margin-bottom: var(--space-sm);
      color: var(--text-primary);
      line-height: 1.8;
    }

    .about-skills {
      list-style: disc;
      padding-left: var(--space-lg);
    }

    .about-skills li {
      margin-bottom: var(--space-xs);
    }
  </style>
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add About page

Self-introduction text, tech direction list, placeholder
background with reduced opacity.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 5.2: Create SecretModal component

**Files:**
- Create: `src/components/SecretModal.astro`

- [ ] **Step 1: Create SecretModal.astro**

```astro
---
import { siteConfig } from "@/config";
---

<button class="secret-trigger" id="secret-trigger" title="私人角落" type="button">
  🗝️
</button>

<dialog class="secret-modal" id="secret-modal">
  <div class="secret-modal-inner">
    <h2 class="text-h3" style="margin-bottom: var(--space-lg);">🔒 私人角落</h2>
    <form id="secret-form" method="dialog">
      <input
        type="password"
        id="secret-password"
        class="secret-input"
        placeholder="输入密码..."
        autocomplete="off"
      />
      <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-md);">
        <button type="submit" class="secret-btn secret-btn--submit">进入</button>
        <button type="button" class="secret-btn secret-btn--cancel" id="secret-cancel">取消</button>
      </div>
    </form>
    <p id="secret-error" class="text-small" style="color: #d32f2f; margin-top: var(--space-sm); display: none;">
      密码错误
    </p>
  </div>
</dialog>

<script>
  const trigger = document.getElementById("secret-trigger")!;
  const modal = document.getElementById("secret-modal") as HTMLDialogElement;
  const form = document.getElementById("secret-form")!;
  const passwordInput = document.getElementById("secret-password") as HTMLInputElement;
  const cancelBtn = document.getElementById("secret-cancel")!;
  const errorEl = document.getElementById("secret-error")!;

  trigger.addEventListener("click", () => {
    modal.showModal();
    passwordInput.focus();
  });

  cancelBtn.addEventListener("click", () => {
    modal.close();
    errorEl.style.display = "none";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (passwordInput.value === "${siteConfig.secretPassword}") {
      window.location.href = "/secret";
    } else {
      errorEl.style.display = "block";
      passwordInput.value = "";
    }
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.close();
      errorEl.style.display = "none";
    }
  });
</script>

<style>
  .secret-trigger {
    font-size: 16px;
    color: var(--text-muted);
    opacity: 0.3;
    transition: opacity 200ms ease;
    padding: var(--space-xs);
  }

  .secret-trigger:hover {
    opacity: 0.7;
  }

  .secret-modal {
    border: 1px solid var(--border);
    border-radius: var(--radius-card);
    padding: var(--space-xl);
    background: var(--bg-card);
    color: var(--text-primary);
    max-width: 360px;
    width: 90vw;
  }

  .secret-modal::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }

  .secret-modal-inner {
    text-align: center;
  }

  .secret-input {
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: var(--text-body);
    font-family: var(--font-sans);
    outline: none;
    transition: border-color 200ms ease;
  }

  .secret-input:focus {
    border-color: var(--accent);
  }

  .secret-btn {
    flex: 1;
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-pill);
    font-size: var(--text-body);
    transition: opacity 200ms ease;
  }

  .secret-btn--submit {
    background: var(--text-primary);
    color: var(--bg-primary);
  }

  .secret-btn--cancel {
    background: var(--bg-secondary);
    color: var(--text-secondary);
  }

  .secret-btn:hover {
    opacity: 0.8;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SecretModal.astro
git commit -m "feat: add SecretModal component

Hidden 🗝️ trigger, password dialog with validation,
redirects to /secret on correct password.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 5.3: Create Secret page

**Files:**
- Create: `src/pages/secret.astro`

- [ ] **Step 1: Create secret.astro**

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
---

<BaseLayout title="私人角落">
  <main class="secret-page">
    <div class="container container-narrow">
      <a href="/about" class="secret-back text-small text-muted">&larr; 返回</a>
      <h1 class="text-h2" style="margin-top: var(--space-xl);">私人角落</h1>
      <hr class="secret-divider" />
      <p class="text-body text-secondary">
        这里是你的私人空间。写日记、存想法、放不想公开的照片。
      </p>
    </div>
  </main>

  <style>
    .secret-page {
      padding: var(--space-4xl) 0;
      min-height: 100vh;
      background: var(--bg-secondary);
    }

    .secret-back {
      transition: color 200ms ease;
    }

    .secret-back:hover {
      color: var(--accent);
    }

    .secret-divider {
      border: none;
      border-top: 1px solid var(--border);
      margin: var(--space-lg) 0 var(--space-xl);
    }
  </style>
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/secret.astro
git commit -m "feat: add Secret page

Private corner with back navigation, placeholder content area.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 5.4: Create 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create 404.astro**

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import Nav from "@/components/Nav.astro";
import Character from "@/components/Character.astro";
---

<BaseLayout title="404 - 页面不存在">
  <Nav />
  <main class="not-found">
    <div class="not-found-content">
      <Character id="lost" size={140} />
      <h1 class="text-h2 text-secondary" style="margin-top: var(--space-lg);">
        这里什么都没有
      </h1>
      <a href="/" class="not-found-btn">返回首页</a>
    </div>
  </main>

  <style>
    .not-found {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 200px);
    }

    .not-found-content {
      text-align: center;
    }

    .not-found-btn {
      display: inline-block;
      margin-top: var(--space-xl);
      padding: var(--space-sm) var(--space-xl);
      background: var(--text-primary);
      color: var(--bg-primary);
      border-radius: var(--radius-pill);
      font-size: var(--text-body);
      transition: opacity 200ms ease;
    }

    .not-found-btn:hover {
      opacity: 0.8;
    }
  </style>
</BaseLayout>
```

- [ ] **Step 2: Verify all pages exist**

```bash
npx astro check && npm run build
```

Expected: Build succeeds. All pages generated. Visit /about, /404-test, /secret to verify.

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: add 404 page with lost character

Lost SVG character, message, and return-home pill button.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 5.5: Update design document

- [ ] **Step 1: Append Phase 5 completion to 项目设计方案.md**

- [ ] **Step 2: Commit**

```bash
git -C /home/xingsijia/projects/claude add 项目设计方案.md
git -C /home/xingsijia/projects/claude commit -m "docs: mark Phase 5 complete

About page, secret entrance modal, 404 page.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Phase 6: Cross-linking & Polish

**Goal:** Verify all cross-references work, ensure visual consistency across pages.

### Task 6.1: Wire cross-references between pages

**Files:**
- Modify: `src/content/work/project-alpha.md` — add lifeRef
- Modify: `src/content/life/record-one.md` — add workRef

- [ ] **Step 1: Add lifeRef to project-alpha.md**

```markdown
---
title: "Project Alpha"
description: "一个帮助开发者快速生成 API 文档的命令行工具"
tech: ["Go", "TypeScript", "OpenAPI"]
links:
  github: "https://github.com/Ustinionxxx/project-alpha"
  demo: "https://alpha.example.com"
lifeRef: "record-one"
---
```

- [ ] **Step 2: Add workRef to record-one.md**

```markdown
---
title: "在博物馆看到了一只超可爱的陶俑"
tags: ["博物馆", "旅行"]
layout: "featured"
workRef: "project-alpha"
---
```

- [ ] **Step 3: Verify cross-links work**

```bash
npm run build
# Check dist/ for correct href links between work and life pages
```

Expected: Project Alpha detail page shows link to Life record. Life record shows link to Project Alpha.

- [ ] **Step 4: Do visual consistency pass**
    - Verify all pages use same nav
    - Verify font sizes consistent
    - Verify spacing consistent
    - Verify color tokens used consistently
    - Verify dark mode works on all pages

- [ ] **Step 5: Commit**

```bash
git add src/content/
git commit -m "feat: wire cross-references between Work and Life

Project Alpha → record-one, record-one → project-alpha.
Visual consistency verified across all pages.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 6.2: Update design document

- [ ] **Step 1: Append Phase 6 completion**

- [ ] **Step 2: Commit**

```bash
git -C /home/xingsijia/projects/claude add 项目设计方案.md
git -C /home/xingsijia/projects/claude commit -m "docs: mark Phase 6 complete

Cross-linking verified, visual consistency confirmed.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Phase 7: Build & Deploy

**Goal:** Build production bundle, verify output, prepare for deployment.

### Task 7.1: Final build verification

- [ ] **Step 1: Clean build**

```bash
npm run build
```

Expected: Build succeeds with no errors. Output in `dist/`.

- [ ] **Step 2: Verify build output**

```bash
ls dist/
# Should see: index.html, work/index.html, work/project-alpha/index.html, etc.
# All HTML files, CSS bundled, zero JS except theme toggle inline script
```

- [ ] **Step 3: Verify no broken links or missing pages**

```bash
find dist/ -name "*.html" | sort
```

Expected output:
```
dist/index.html
dist/work/index.html
dist/work/project-alpha/index.html
dist/work/project-beta/index.html
dist/life/index.html
dist/life/record-one/index.html
dist/life/record-two/index.html
dist/about/index.html
dist/secret/index.html
dist/404.html
```

### Task 7.2: Add deployment documentation

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update README.md with deployment instructions**

```markdown
# Personal Digital Space

A minimal personal digital space built with Astro.

## Development

```bash
npm install
npm run dev        # http://localhost:4321
```

## Build

```bash
npm run build      # Output to dist/
npm run preview    # Preview built site
```

## Deploy

Upload `dist/` directory to any static file server:

```bash
# Example: rsync to own server
rsync -avz dist/ user@your-server:/var/www/personal-site/
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/personal-site;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # 404 page
    error_page 404 /404.html;
}
```

## Content Updates

1. Write Markdown files in `src/content/work/` or `src/content/life/`
2. Run `npm run build`
3. Upload new `dist/`
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add deployment and content update instructions

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Task 7.3: Update design document — final

- [ ] **Step 1: Mark Phase 7 complete in 项目设计方案.md**

Append to revision history:

```markdown
| 2026-06-15 | Phase 7 完成：构建验证通过、部署文档就绪、项目可上线 |
```

- [ ] **Step 2: Commit**

```bash
git -C /home/xingsijia/projects/claude add 项目设计方案.md
git -C /home/xingsijia/projects/claude commit -m "docs: mark Phase 7 complete — project ready for deploy

All 7 phases done. Site builds successfully.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Verification Checklist

After all phases complete, verify:

- [ ] `npm run build` succeeds
- [ ] Home page: floating character, name, tagline, social links
- [ ] Work list: project cards, coder character
- [ ] Work detail: Markdown rendered, tech tags, links
- [ ] Life grid: magazine layout, hover overlay, empty state
- [ ] Life detail: content, tags, workRef link
- [ ] About: introduction, skills list, background placeholder
- [ ] Secret: 🗝️ opens modal, correct password redirects, wrong password shows error
- [ ] 404: lost character, return button
- [ ] Dark mode: toggle works, persists across refresh, no flash
- [ ] Mobile responsive: all pages usable at < 768px
- [ ] Cross-links: Work→Life and Life→Work links functional
- [ ] No console errors
