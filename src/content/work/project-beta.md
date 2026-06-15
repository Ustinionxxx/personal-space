---
title: "BiliNote"
description: "AI 视频笔记生成工具 — 让 AI 为你的视频做笔记"
tech: ["React 19", "FastAPI", "Python", "LLM", "Docker"]
links:
  github: "https://github.com/Ustinionxxx/BiliNote"
  demo: "https://www.bilinote.app/"
---

## 项目概述

BiliNote 是一个开源的 AI 视频笔记助手，支持哔哩哔哩、YouTube、抖音、快手等平台。只需粘贴视频链接，即可自动提取内容并生成结构清晰、重点明确的 Markdown 笔记。

核心能力包括 AI 摘要总结、自动插入截图、原片时间戳跳转、基于 RAG 的笔记内容问答。

## 技术细节

- 前端 React 19 + Vite，后端 FastAPI
- 支持 OpenAI / DeepSeek / Qwen 等多种大模型
- 本地 Whisper 音频转写（Fast-Whisper / MLX-Whisper）
- Docker 一键部署，GitHub Container Registry 预构建镜像
- 浏览器插件（Chrome / Edge / Firefox）+ Tauri 桌面客户端
- 基于 RAG + Function Calling 的 AI 问答系统

## 相关链接

- 在线体验：[www.bilinote.app](https://www.bilinote.app/)
- 使用文档：[docs.bilinote.app](https://docs.bilinote.app/)
