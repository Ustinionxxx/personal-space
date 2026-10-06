# 首次接入与发布

公开仓库保存站点代码和配置模板；文字、原图、草稿放进独立的 `Ustinionxxx/personal-space-content` **私有仓库**。不要把内容目录加入公开仓库。

## 一次性的准备

1. 将这一版代码提交并推送到 GitHub。记录完整的 40 位提交 SHA。
2. 本地执行 `npm run content:init -- ../personal-space-content`，生成中文 Pages CMS 配置、原示例草稿和发布工作流。目标目录必须为空。初始化会读取原站历史提交，因此需要保留该历史。
3. 把内容仓库 `.github/workflows/publish.yml` 中站点代码的 `ref` 设为第 1 步的 SHA。不能使用 `main` 或其他浮动分支。以后更新前台时，也由开发者明确更新这个 SHA。
4. 在 GitHub 创建 `personal-space-content`，选择 **Private**，再推送准备好的内容。不要为此创建公开仓库。工作流在仓库为公开或分支不是 main 时拒绝部署。
5. 在 [Pages CMS](https://app.pagescms.org/) 登录 GitHub。安装 GitHub App 时选 **Only select repositories → personal-space-content**，选择 main。首版不邀请协作者。
6. 在 Cloudflare **Workers & Pages → Create application → Pages → Direct Upload** 创建项目，生产分支使用 `main`。记下项目名称及平台分配的 `*.pages.dev` 地址。不要连接公开代码仓库自动部署，也不要上传私有仓库目录。
7. 在 Cloudflare 创建只对所需账户授权的 API Token，权限为 **Account → Cloudflare Pages → Edit**。在内容仓库 **Settings → Secrets and variables → Actions** 保存以下配置；不要把 Token 放入文件或聊天：

| 类型 | 名称 | 值 |
| --- | --- | --- |
| Secret | `CLOUDFLARE_API_TOKEN` | Cloudflare API Token |
| Secret | `CLOUDFLARE_ACCOUNT_ID` | 目标账户 ID |
| Variable | `PAGES_PROJECT` | Direct Upload 项目名称 |
| Variable | `SITE_URL` | 实际 `https://项目名称.pages.dev` 地址 |

8. 在内容仓库 **Actions → 发布个人网站 → Run workflow** 启动第一次发布。成功摘要和 production 环境会显示网站链接。第一次发布只含已确认的首页短介绍，生活、项目和 About 保持空白，直到你选定内容。

## 日常使用

见 [编辑指南](editor-guide.md)。保存草稿只改变私有源文件；工作流可能仍运行，但只构建已发布内容。发布、撤回、编辑已发布内容都通过下一次成功部署生效。这里不部署公开草稿预览。

保存状态显示在 Pages CMS；自动部署状态显示在 GitHub Actions。后台「重新发布 / 查看运行结果」可以发起一次带运行结果的手动重试。Pages CMS 并不是托管平台，不能把保存提示当成上线提示。

## 构建与隐私边界

私有仓库工作流分别检出私有内容和固定 SHA 的公开代码。`scripts/content.mjs` 先检查发布状态，再按白名单提取字段、渲染 Markdown，输出 `.generated/content.json`。它只处理已发布正文、图集及项目封面引用的图片，并把处理后的 WebP 输出到 `public/media`。原文件名不会沿用，EXIF、IPTC、XMP 不保留。未使用的 Markdown 图片定义不会触发图片输出。

生产构建必须指定 `CONTENT_DIR`，缺失时停止。每次构建先清除旧的生成内容和 `dist`；图片错误或字段校验失败即停止，失败后无可上传的 `dist`。`audit-dist.mjs` 检查输出文件类型与图片元数据，部署脚本再次检查，只有成功后才执行 `wrangler pages deploy dist`。不上传 GitHub Actions 构建包或私有源文件。

同一生产站点的发布任务串行执行。构建失败时不会调用上传步骤，上一版站点继续可用。已公开内容可能保留在 Cloudflare 历史部署、缓存及第三方副本中，撤回不是恢复保密。

静态网站没有私密页面访问控制。旧 `/secret` 地址只显示公开说明，不承担存储或认证功能。

## 验收

- `npm test` 覆盖无标题短记录、倒序/首页三条、About 同源、固定链接、草稿/未知字段隔离、图片引用与 EXIF、恶意路径、撤回路由及失败构建。
- `CONTENT_DIR=../personal-space-content npm run build` 执行类型检查、正式构建与产物检查。
- 登录后台做一次真实的“新建 → 保存草稿 → 发布 → Actions 成功 → 打开网站”，核对手机图文、键盘焦点、亮暗主题和减少动画。账户授权前，这一项不能视为通过。

参考：[Pages CMS 配置](https://pagescms.org/docs/configuration/)、[Cloudflare Direct Upload CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/)。
