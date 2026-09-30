---
title: Nimbus 文档站点框架
created: 2026-09-29
updated: 2026-09-29
type: entity
tags:
  - product
  - agent
  - content-engineering
sources:
  - https://nimbus-docs.com/index.md
  - https://nimbus-docs.com/get-started/index.md
  - https://nimbus-docs.com/philosophy/index.md
  - https://nimbus-docs.com/ai/docs-for-agents/index.md
status: current
description: Nimbus 基于 Astro 的文档站点方案：可编辑文件、Agent 可读端点、内容校验、公开边界与采用限制。
aliases:
  - Nimbus
  - Nimbus Docs
volatility: high
verified_at: 2026-09-29
review_by: 2026-12-28
---

# Nimbus 文档站点框架

## Summary

Nimbus 是基于 Astro 的文档站点方案：运行管线留在 npm 包中，脚手架把布局、组件、样式和内容写为仓库内可编辑文件；同时默认提供面向 Agent 的 Markdown 页面、索引和结构化数据。[1][2] 这是产品设计与文档能力的记录，**不是**对生产可用性、性能或安全性的独立测评。

## 核心设计

- **文件归使用者所有**：可见的站点代码落在仓库，不必为了改主题而维护上游主题的 fork。`src/content/` 目录树同时决定路由和侧边栏；frontmatter 管排序、草稿等细节。多版本、多语言和多产品可用不同内容集合组织。[2][3]
- **Agent 可读取源格式**：可发现的页面生成 `/<slug>/index.md`（组件转换为文本）及 `/<slug>/index.mdx`（保留导入、JSX 和指令）。API 参考页只有 `.md`；隐藏版本不输出两者。`/llms.txt` 提供当前文档索引，`/llms-full.txt` 汇集当前可发现页面，顶层分区也有各自的 `llms.txt`。页面头部带 JSON-LD；配置 `site` 后还接入 `robots.txt` 和 sitemap。[2][4]
- **组件复制与功能配方分开**：`nimbus-docs add` 将组件或工具文件复制到项目，而 feature recipe 交由 coding agent 按项目情况实施；不能把“有配方”理解为功能已自动安装或通过验证。[2][3]
- **质量与来源**：预构建检查配置、frontmatter、MDX 组件及注册表引用中的站点错误；prose lint 提示写作问题，但不阻断构建。文档展示通过扩展内容 schema 添加 `aiGenerated` 来标记待人工审阅的页面；不是自动完成审阅。[3]

## 起步与边界

官方首页和起步页给出的脚手架命令是 `npx @cloudflare/create-nimbus-docs@latest`，随后选择目录、模板、输出模式和目标，再在生成目录运行 `pnpm install`、`pnpm dev`；命令是**文档示例，不表示本 Wiki 已安装或采用 Nimbus**。[1][2]

公开的 Agent 端点不能用请求时鉴权来保护私密内容；私密资料应留在公开内容集合之外。`draft` 和 `noindex` 影响索引可见性，但不能代替内容准入判断。[4] [推论] 选型时先用目标项目验证构建、生成端点、私密内容隔离与实际维护成本，再决定是否迁移现有文档。

## 来源范围与限制

2026-09-29 直接读取站点提供的首页、Get started、Philosophy、Docs for agents 四个 Markdown 页面；首页显示更新于 2026-07-24，其余页面未取得作者和发布日期。这里只覆盖四页的文档宣称，未通读完整组件/API/安装文档，也未运行脚手架或独立验证输出。产品行为会变化；实际使用前重新核对官方文档和目标版本。

## Relations

- related: [agentic-content-pipeline-design-patterns](/concepts/agentic-content-pipeline-design-patterns), [agent-shared-wiki-index](/operations/agent-shared-wiki-index)

## Related

- [agentic-content-pipeline-design-patterns](/concepts/agentic-content-pipeline-design-patterns)：Agent 参与内容生产与人工审核的相邻方法，不等于 Nimbus 的功能证明。
- [agent-shared-wiki-index](/operations/agent-shared-wiki-index)：共享 Wiki 的按需检索与公开写入边界，不表示当前 Wiki 已使用 Nimbus。
- [index](/)：知识库导航。

## Sources

1. [Nimbus 首页](https://nimbus-docs.com/index.md)
2. [Get started](https://nimbus-docs.com/get-started/index.md)
3. [Philosophy](https://nimbus-docs.com/philosophy/index.md)
4. [Docs for agents](https://nimbus-docs.com/ai/docs-for-agents/index.md)

