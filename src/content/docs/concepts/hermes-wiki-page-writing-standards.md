---
title: Wiki Page Writing Standards
created: 2026-04-16
updated: 2026-10-17
type: concept
tags:
  - agent
  - knowledge-base
  - workflow
  - configuration
  - note
sources:
  - repository:SCHEMA.md
  - concepts/wiki-ingestion-workflow.md
  - https://diataxis.fr/
status: stable
description: 定义 AI Agent wiki 正式页面的命名、frontmatter、结构、wikilinks、Relations 和质量检查规则。
aliases:
  - page-writing-standards
  - wiki-writing-standards
  - agent-wiki-page-writing-standards
volatility: medium
review_by: 2027-01-31
---

# Wiki Page Writing Standards

## Summary
AI Agent wiki 页面不是随手笔记，而是正式知识资产。
写作规范的目标是让公共页面脱离作者私有环境仍可读、可链接、可维护、可增量更新，并能被后续回答直接复用。

本页服务人类与 AI Agent 两类读者：人类从摘要、解释、例子和下一步理解内容，Agent 利用同一正文及 metadata 定位与取证。文档按读者任务区分解释、操作指南和参考，不要求为每种读者复制页面；这一组织思路参考 [Diátaxis](https://diataxis.fr/)，本仓库的具体约定以 `SCHEMA.md` 为准。

## Canonical principle
一篇合格页面至少要满足：
- 主题明确
- 结构统一
- frontmatter 完整
- 至少有 2 个有效 wikilinks
- 能持续更新
- 不等于原始资料，也不等于聊天记录

## File naming
- 文件名使用小写英文加连字符
- 不用空格，不用中文文件名
- 新文件名应直接表达主题；历史 `hermes-*` 路径保留兼容，通用主题使用中性标题和索引显示名

中性命名示例：
- `agent-context-engineering.md`
- `wiki-ingestion-workflow.md`
- `agent-development-lifecycle.md`

## Frontmatter
必填字段、枚举、可选 metadata 及其校验规则只在 `SCHEMA.md` 的 Frontmatter 一节维护，本页不复述。写作时注意：
- `type` 与所在目录职责一致；`status` 只表达生命周期，日期写进 `updated`、`review_by` 或正文
- 修改日期时只编辑页面首个 frontmatter，不替换正文或代码块中的示例日期
- `description` 一句话说明页面用途，帮助 Agent 路由，不能替代 `## Summary`；`aliases` 只放少量高价值同义词

## Recommended structure
推荐默认结构：
1. `## Summary`
2. 主体内容（按层次分节）
3. `## Practical checklist` 或 `## Decision rules`（如适用）
4. `## Anti-patterns`（如适用）
5. `## Relations`

最少也要有：摘要、主体结构、关联链接。

## Writing style
- 先给结论：开头先写 Summary，第一屏就回答“这页在讲什么”
- 结构先于堆料：先分层，再展开；优先使用小节和列表
- 可扫描：段落短、标题清晰、30 秒内能抓到重点
- 面向复用：页面服务未来回答与维护，而不是只记录一次

## Wikilinks and relations
每个正式页面至少应包含 2 个 `[[wikilinks]]`。
链接应指向上位概念、相邻概念或被引用的方法页。不链接 `[[index]]` / `[[log]]` 来凑数：导航页不携带关系信息，索引成员资格由 `index.md` 自身维护。

页面级链接列表统一写在 `## Relations`，用 `SCHEMA.md` 允许的受控关系词表达页面之间的语义关系；不再另设纯链接的 `## Related` 列表（`_meta/catalog.json` 只读取 Relations）：
- `refines`：细化某个上位页面
- `depends_on`：依赖某个前置规范或概念
- `conflicts_with`：与某页存在显式冲突或取舍
- `supersedes`：替代旧页面或旧结论
- `related`：存在明确的横向参考或语义关联，但不构成前置依赖或上下位细化

关系值必须为 `[]` 或以逗号分隔的 `[[page-name]]` 列表，不附加自由文本说明。某条关系需要解释时，在正文或 `## Related` 中用带说明的条目写明，该链接同时列入 Relations。关系区块用于检索和维护；证据仍写入 `sources`，不要把推断关系伪装成来源。

避免：孤立页面没有关联；链接堆砌但没有语义关系；为旧页面批量补关系导致大规模无意义 diff。

## Directory-specific rules
### `concepts/`
适合：架构、方法论、原理说明、边界规范

写法重点：先定义，再拆结构，再给规则。

### `entities/`
适合：产品、项目、组织、模型、人物

写法重点：它是什么、关键事实、与其他实体/概念的关系。

### `comparisons/`
适合：横向比较、方案对比、决策分析

写法重点：比较对象、比较维度、结论与取舍。

### `operations/`
适合：人类与 Agent 共用的操作指南、runbook 和维护契约。

写法重点：说明前提、权限、步骤、预期结果与失败处理；Wiki 中的命令示例不构成执行授权。

### `queries/`
适合：值得长期保存的问题与答案

写法重点：问题本身、结构化回答、为什么值得保存。

## What NOT to write
以下内容不应直接成为正式 wiki 页面：
- 原样复制聊天记录
- 没有整理的 raw 资料
- 一次性临时状态
- 没有长期价值的碎片信息
- 只有命令没有上下文的执行日志

## Update rules
更新页面时遵循：
- 保留原主题，不要越改越漂移
- `updated` 日期必须刷新
- 新增信息优先并入现有结构
- 只有页面混合多个职责或检索成本明显上升时才考虑拆页，不按行数机械拆分
- 主题已经分叉时建立新页面并互链

## Quality checklist
落库前至少检查：
- 文件名规范
- frontmatter 完整
- tags 来自 `SCHEMA.md`
- 页面有 Summary
- 至少有 2 个 wikilinks
- 页面可在 30 秒内扫描理解
- 内容确实有长期复用价值

## Anti-patterns
- 把 wiki 写成日记
- 把 wiki 写成 raw 仓库镜像
- 只写标题，不写摘要
- 没有 Relations，导致知识孤岛
- 一个页面塞成超长杂烩
- 用临时会话结论直接覆盖长期知识

## Minimal template
最小模板只需保留：frontmatter、`# 标题`、`## Summary`、主体内容、`## Relations`。

## Source and freshness guidance

对于重要结论，优先在同段或相邻句放具体 Wiki、raw 或官方来源；数字、当前外部行为、规范性规则、争议结论和多来源综合结论尤其如此。普通背景段落保留页面级 `sources` 即可。

来源事实与本地推导分开；本地推导使用 `[推论]`。凡外部变化可能导致 Agent 错误行动的知识均可设置 `review_by`；纯方法论不为年龄加日期。

页面局部复核只说明相关段落，不代表整页已复核；`updated` 仅表示文件最近编辑时间。无法确认时保留限制，不把未确认内容写成当前规则。

低风险、来源清楚且已有 Wiki owner 的外部知识，可以直接按最小改动沉淀到现有正式页面或入库规则；不因缺少 active workflow 证据而另建验证项目、试点门槛或新基础设施。涉及 Schema、active skill、runtime、cron、MCP、memory 或批量迁移时，另行走对应治理流程。

## Optional freshness and local claims

`volatility`、`verified_at`、`review_by` 与局部 `[!volatile]` block 的格式、日期边界和校验级别见 `SCHEMA.md`。写作上只需记住：
- 只有实际核验后才填写 `verified_at` 或 volatile block，模板不预填日期；局部核验紧邻具体断言，并标明版本/环境范围
- block 使用的新来源同步加入页面级 `sources`；局部通过不代表整页已复核
- `_As of: 日期 · Source: 来源_` 只是核对线索，不能替代 `verified_at` + `review_by`

## Relationship to other rules
这页定义“怎么写页面”，不是“信息该放哪里”。
- 内容归类边界见 `[[hermes-memory-skills-wiki-boundaries]]`
- 检索与回答顺序见 `[[hermes-retrieval-priority-and-answer-path]]`
- 入库流程见 `[[wiki-ingestion-workflow]]`
- 整体架构见 `[[hermes-knowledge-architecture]]`
- 健康检查规范见 `[[hermes-wiki-lint-and-health-check-standards]]`

## Relations
- refines: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- depends_on: [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- related: [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path), [hermes-wiki-lint-and-health-check-standards](/concepts/hermes-wiki-lint-and-health-check-standards)

