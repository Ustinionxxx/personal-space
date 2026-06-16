# 个人数字空间

## 关于

一个极简风格的个人数字空间（Personal Digital Space）。本项目不是传统的简历网站或作品集，而是一个以"克制表达 + 分层内容"为核心的展示平台。访问者进入后会先看到 CRT 终端风格的开机动画，随后渐隐过渡到主页，通过浮动呆萌小人、一句话标签、GitHub/Email 社交链接，在 3 秒内建立"有点惊喜、这个人有点意思"的第一印象。

站点包含四大核心模块——**Work**（项目展示）、**Life**（杂志排版生活图墙）、**About**（关于页 + 🗝️ 秘密入口）、**404**（迷路小人兜底）。所有内容以 Markdown 驱动，支持模块间交叉引用（Work ↔ Life 互链），亮/暗双模式通过 CSS Variables 无闪烁切换。构建产物为纯静态 HTML/CSS/JS，可部署到任意 Web 服务器。

## 技术栈

**Astro 5** + TypeScript + CSS Variables + Markdown Content Collections

- 零 JS 运行时，纯静态输出（Islands 架构）
- 亮/暗双模式（CSS 自定义属性驱动，localStorage 持久化，首次访问跟随系统）
- CRT 终端开机动画（逐行浮现、扫描线、暗角、ASCII 艺术字，按任意键跳过）
- 4 个手绘 SVG 呆萌小人（首页浮动、Work 敲代码、Life 等待、404 迷路）
- Life 杂志排版（CSS Grid dense 自适应，hover 渐变遮罩揭示标题/标签）
- 秘密角落（密码弹窗前验，轻量隐私保护）
- 设计令牌系统（4px 基底间距、6 级字号、单强调色 `#2E6F6A`）

## 本地开发

```bash
npm install
npm run dev        # 开发服务器 → http://localhost:4321
npm run build      # 类型检查 + 构建 → dist/
npm run preview    # 预览构建产物
```

## 部署

`dist/` 目录为纯静态文件，上传到任意 Web 服务器即可：

```bash
# 示例：rsync 到自有服务器
rsync -avz dist/ user@your-server:/var/www/personal-site/
```

Nginx 参考配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/personal-site;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    error_page 404 /404.html;
}
```

## 内容更新

所有内容以 Markdown 存放在 `src/content/` 下，新增或修改后重建即可：

```bash
# 添加新项目
vim src/content/work/my-new-project.md
npm run build
rsync -avz dist/ user@your-server:/var/www/personal-site/
```

## 目录结构

```
src/
├── content/               # Markdown 内容（Work / Life / About）
│   ├── config.ts          # Content Collections schema（Zod 校验）
│   ├── work/              # 项目 .md
│   ├── life/              # 生活记录 .md
│   └── about.md           # 关于页
├── pages/                 # 路由页面（文件系统路由）
│   ├── index.astro        # Home（开机动画 + 主页）
│   ├── work/              # Work 列表 + [slug] 详情
│   ├── life/              # Life 网格 + [slug] 详情
│   ├── about.astro        # About + 秘密入口
│   ├── secret.astro       # 私人角落
│   └── 404.astro          # 404 迷路小人
├── components/            # 可复用组件
│   ├── BootSplash.astro   # CRT 终端开机动画
│   ├── Nav.astro          # 导航栏（含亮暗切换）
│   ├── Character.astro    # SVG 小人（4 种角色）
│   ├── WorkCard.astro     # 项目卡片
│   ├── LifeCard.astro     # 生活记录卡片（hover 遮罩）
│   ├── EmptyState.astro   # 空状态（等待小人）
│   ├── SecretModal.astro  # 🗝️ 密码弹窗
│   └── icons/             # SVG 图标（GitHub / Email / SunMoon）
├── layouts/
│   └── BaseLayout.astro   # HTML 骨架 + 主题持久化脚本
├── styles/
│   └── global.css         # CSS Variables、设计令牌、reset
└── config.ts              # 站点全局配置
```
