# 当前接入状态

更新于 2026-10-07。

## 日常入口

- [网站](https://personal-space-ustinionxxx.pages.dev/)
- [Pages CMS 网页后台](https://app.pagescms.org/ustinionxxx/personal-space-content/main)
- [自动发布结果](https://github.com/Ustinionxxx/personal-space-content/actions/workflows/publish.yml)
- [新版正式代码](https://github.com/Ustinionxxx/personal-space/tree/main)
- [已合并的代码更新 PR #1](https://github.com/Ustinionxxx/personal-space/pull/1)

## 已完成

- 前台支持随手记、完整比例图集、项目进展、统一 About 内容源、亮暗主题与主动播放的终端彩蛋。
- 网站与 README 均提供简体中文、繁體中文和 English。网站切换语言时保留当前记录；繁体从原文转换，英语可在后台填写，缺少译文时标注原文。原简体地址继续有效。
- 新版已通过 PR #1 合并到原 `personal-space` 仓库的 `main` 主分支，替换原页面。本地开发目录也已切换到 `main`；仍是同一个网站项目。
- `Ustinionxxx/personal-space-content` 已建立并确认私有。旧示例与 BiliNote 保留为待整理草稿，首页使用本人已确认的介绍。
- Pages CMS 已登录、安装并只选择该私有内容仓库。本人已确认安装页实际要求的文件、Actions、工作流及仓库管理读写权限。
- 自动生成 ID、默认今天的日期、无标题纯文字草稿、横竖图片上传、说明和再次保存均已在实际后台验收。
- 本人提供的“尝试自媒体中”先保存草稿，再在后台改为已发布。对应 [自动部署](https://github.com/Ustinionxxx/personal-space-content/actions/runs/37483474927) 成功；首页和固定详情链接均已在浏览器确认。
- 在真实内容构建中确认草稿文字、草稿 ID 和未发布测试图片不进入公开文件。临时验收草稿和色块测试图已从内容仓库当前版本清理。
- 8 项测试通过，涵盖三语言页面、译文图片、原文回退与草稿隔离；类型检查无错误，正式构建和产物检查通过。Astro 已升级到 7，依赖审计为 0 条已知漏洞。
- Cloudflare Pages Direct Upload 项目为 `personal-space-ustinionxxx`。经本人确认创建的指定账户 Pages Write Token 仅保存到私有内容仓库的 `CLOUDFLARE_API_TOKEN` Secret。
- 首次缺少 Token 的运行在上传前明确失败，旧站保持可访问；配置后自动部署成功。

## 发布配置

内容仓库的工作流固定引用 `personal-space` 主分支上经过检查的完整提交 SHA，具体版本记录在私有仓库的 `.github/workflows/publish.yml`。只有已发布文字及其引用照片进入构建，原图、草稿与凭据不进入公开产物。`personal-space-content` 只保存本站内容，不是另一套网站。

| 类型 | 名称 | 值或说明 |
| --- | --- | --- |
| Variable | `PAGES_PROJECT` | `personal-space-ustinionxxx` |
| Variable | `SITE_URL` | `https://personal-space-ustinionxxx.pages.dev` |
| Secret | `CLOUDFLARE_ACCOUNT_ID` | 指定 Cloudflare 账户 |
| Secret | `CLOUDFLARE_API_TOKEN` | 经确认创建的专用 Pages Write Token |

后台保存成功只表示文件进入 GitHub。自动部署结果查看内容仓库的 GitHub Actions；Pages CMS 的 Actions 页只展示从后台手动发起的任务。日常操作见 [编辑指南](editor-guide.md)。

本人尚需独立操作一次完整发布流程，作为易用性确认；这不需要编辑代码。About、照片和项目的真实内容由本人继续提供，待整理草稿不会自动公开。
