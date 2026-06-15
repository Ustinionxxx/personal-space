# Personal Digital Space — Design Spec

> Date: 2026-06-15
> Status: Approved, ready for implementation plan
> Reference: `/home/xingsijia/projects/claude/项目设计方案.md` (full design document)

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Project location | `/home/xingsijia/projects/personal-site/`, independent git repo | Fully separate from excel-compare; own version control and deployment |
| Content strategy | Placeholder content first, real content later | Skeleton first, fill later |
| Development phases | 7 merged phases (original 10 condensed) | Insert illustration & responsive into per-page phases |
| Visual companion | Browser-based mockup review | Used for visual decisions during development |

## Architecture

```
Astro 5 (Static Site Generator)
├── TypeScript (type safety)
├── CSS Variables (light/dark dual mode + design tokens)
├── Markdown/MDX (content authoring)
├── Astro Content Collections (content management)
├── Inline SVG (illustrations, zero HTTP requests)
├── CSS Animations (micro-interactions only)
└── Build output → dist/ pure static files → Nginx deploy on own server
```

## Project Structure

```
/home/xingsijia/projects/personal-site/
├── src/
│   ├── content/           # All Markdown content
│   │   ├── work/          # Project posts
│   │   ├── life/          # Life records
│   │   └── about.md       # About page
│   ├── components/        # Reusable .astro components
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── ThemeToggle.astro
│   │   ├── WorkCard.astro
│   │   ├── LifeCard.astro
│   │   ├── TagPill.astro
│   │   ├── Character.astro
│   │   └── EmptyState.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PageLayout.astro
│   ├── pages/             # Route pages
│   │   ├── index.astro          # Home
│   │   ├── work/
│   │   │   ├── index.astro      # Work list
│   │   │   └── [slug].astro     # Work detail
│   │   ├── life/
│   │   │   ├── index.astro      # Life wall
│   │   │   └── [slug].astro     # Life detail
│   │   ├── about.astro
│   │   ├── secret.astro
│   │   └── 404.astro
│   ├── styles/
│   │   └── global.css     # CSS Variables + reset + light/dark
│   ├── config.ts
│   └── utils/
│       └── content.ts
├── public/
│   └── images/
├── astro.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

## 7-Phase Development Plan

| Phase | Scope | Key Deliverables |
|-------|-------|------------------|
| **1. Foundation** | Astro init, global styles, CSS Variables, Nav bar, dark mode toggle | Project runs, nav visible, theme switch works |
| **2. Home** | Homepage layout, name, tagline, hero SVG, social links | Complete homepage with floating character |
| **3. Work** | Project card list, detail pages, Markdown rendering | Can add projects and display them |
| **4. Life** | Magazine layout, hover effects, lazy loading, single record page | Life records display with interactions |
| **5. About/404** | About page, background image, secret entrance, 404 page | All pages complete |
| **6. Cross-linking** | Module cross-references, site-wide consistency | Links work, visual consistency |
| **7. Build & Deploy** | `astro build`, upload to server, verify | Live site accessible |

## Design Principles (from original doc)

1. Minimalism — one thing per page
2. Restraint — single accent color, used sparingly
3. Whitespace — breathing room between elements
4. Typography-first — distinguish via weight/size/color, not borders/backgrounds
5. No shadows, no gradients (except Life hover overlay)
6. Minimal animations — theme switch, hover feedback, character float only
7. Content-driven — Markdown first, styling second

## Content Placeholder Strategy

- **Work projects**: "Project Alpha", "Project Beta", etc. with gray placeholder cover images
- **Life records**: Solid gray blocks representing photos, lorem ipsum captions
- **Illustrations**: Simple CSS/SVG geometric shapes, refined in later iterations
- **About text**: Placeholder copy reflecting the document's intent

## Workflow Rule

After each phase completes, update the original design document (`项目设计方案.md`) to reflect current state — marking completed items and any deviations from the original plan.
