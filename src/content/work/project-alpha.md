---
title: "Project Alpha"
description: "一个帮助开发者快速生成 API 文档的命令行工具"
tech: ["Go", "TypeScript", "OpenAPI"]
links:
  github: "https://github.com/Ustinionxxx/project-alpha"
  demo: "https://alpha.example.com"
lifeRef: "record-one"
---

## 项目概述

Project Alpha 是一个命令行工具，可以从代码注释中自动生成符合 OpenAPI 3.0 规范的 API 文档。

支持 Go 和 TypeScript 两种语言的注释解析，输出美观的交互式文档页面。

## 技术细节

- 使用 Go 编写的 AST 解析器提取注释
- TypeScript 编译器 API 处理类型推导
- 基于 Swagger UI 渲染文档页面
