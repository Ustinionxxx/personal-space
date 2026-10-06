# 个人数字空间

邢思佳的个人网站。保留小人、留白、青绿色和亮暗主题，让随手记、生活照片与项目都能自然放进来。

网站地址：[personal-space-ustinionxxx.pages.dev](https://personal-space-ustinionxxx.pages.dev/)。[网页后台](https://app.pagescms.org/ustinionxxx/personal-space-content/main)与自动发布已接通；首条生活记录已通过后台发布，见 [接入状态](docs/setup-status.md)。

- 首页：简短介绍、最近三条记录、选中的项目、关于与联系。
- `/life`：按日期倒序的图文记录，标题/照片/标签可选；图集保留比例和说明。
- `/work`：进行中、已完成或暂时搁置的项目。
- `/about`：从同一份后台可编辑 Markdown 生成。
- 终端开场是主动播放的彩蛋，支持关闭、Esc、键盘和减少动画。

## 内容与代码

本仓库只放公开代码，使用 Astro、TypeScript、Markdown 和静态输出。Pages CMS 的内容、原图与草稿放在独立的 **私有仓库** `personal-space-content`。

只提取已发布内容、只生成其引用图片的网页版本，去除图片 EXIF。没有公开草稿预览，也没有前端密码保护。旧 `/secret` 入口已停用。

## 本地运行

需要 Node.js 22.12+。

```bash
npm ci
npm run dev               # 无私有内容时启动空站，http://localhost:4321
npm run build:empty       # 只构建已确认介绍与空页面，用于代码检查
npm test                  # 内容隔离、图片、固定链接和真实构建测试
```

使用真实内容时：

```bash
CONTENT_DIR=../personal-space-content npm run dev
CONTENT_DIR=../personal-space-content npm run build
npm run preview
```

本地内容在启动/构建时生成。修改私有内容后重新启动开发服务器；线上由保存触发自动构建。生产 `build` 未指定内容目录会停止，避免误发布空站。

## 后台与上线

第一次配置看 [部署说明](docs/deployment.md)，日常写字看 [编辑指南](docs/editor-guide.md)。部署由私有内容仓库中的 GitHub Actions 读取固定提交的站点代码，再上传 `dist` 到 Cloudflare Pages。

```text
scripts/content.mjs         发布状态筛选、Markdown、图片处理
src/lib/content.ts          前台读取已发布内容
src/pages/                  保持原有地址的页面
content-template/           中文后台配置与私有仓库工作流模板
scripts/init-content.mjs    将旧示例迁成私有草稿
tests/content.test.mjs      包含实际 Astro 构建的隐私验收
```

原示例与 BiliNote 仅作为待整理草稿。首发内容由本人确认，不用示例代替真实经历。
