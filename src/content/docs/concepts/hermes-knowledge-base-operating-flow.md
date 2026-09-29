---
title: Shared Wiki Operating Flow
created: 2026-04-16
updated: 2026-09-29
type: concept
tags:
  - agent
  - knowledge-base
  - workflow
  - note
sources:
  - repository:SCHEMA.md
  - concepts/wiki-ingestion-workflow.md
  - concepts/hermes-knowledge-architecture.md
status: stable
description: 定义人类与 AI Agent 共享知识库从摄取、分类、编译、检索到维护的端到端运行流程。
aliases:
  - knowledge-base-operating-flow
  - agent-knowledge-base-operating-flow
---

# Shared Wiki Operating Flow

## Summary
这页把当前共享知识库流程压成一个可执行的端到端操作流：
人类或受授权的 AI Agent 都可以维护这条流程。输入先过公开准入，再被分类，再落到正确 artifact，随后进入 raw / 正式页面 / 检索 / 回写 / lint 的闭环。
目标是让知识库运行依赖文件化结构，而不是依赖越来越长的聊天上下文。

## The operating loop
当前知识库流程可以压成 6 步：
1. intake
2. classify
3. capture
4. compile
5. retrieve
6. maintain

## Step 1: intake
输入来源主要有四类：
- 链接
- PDF / 文档
- 一个值得长期保存的问题
- 一个需要持续扩展的主题

进入系统后，第一判断不是“怎么回答”，而是“它最终该落在哪一层”。

## Step 2: classify
分类规则：
- 稳定偏好 / 长期事实 -> `memory`
- 可复用方法 -> 项目 SOP 或 `skills`；公开操作指南可进 Wiki `operations/`
- 正式知识 -> `wiki`
- 正在执行的多步任务 -> `todo`
- 临时过程 -> `sessions / session_search`

memory、skills、历史检索等只在宿主支持且已获授权时使用，缺少能力不必补齐。

这一层的作用是先收窄接口，避免把所有东西都继续堆在对话里。

## Step 3: capture
只有已有 Wiki 写入授权、材料适合公开且允许保留时，才保存原始材料：
- URL -> `raw/articles/`
- PDF -> `raw/papers/`
- 会议/音视频整理 -> `raw/transcripts/`
- 附件/截图 -> `raw/assets/`

规则：
- 公开准入先于 raw；仓库规范与自有方法可以引用现有公开 owner，不伪造 raw 来源
- raw 不直接替代正式知识
- raw 支撑引文和证据回溯，不替代正式页的综合结论

## Step 4: compile
把 raw 或对话结论编译成正式页面：
- `concepts/`：架构、方法论、原理、边界规范
- `entities/`：项目、产品、组织、模型、人物
- `comparisons/`：横向对比与取舍
- `queries/`：值得长期保存的问题与答案
- `operations/`：适合公开、可复用的操作指南

编译时必须同步完成：
- frontmatter
- Summary
- wikilinks
- `index.md`
- `log.md`

## Step 5: retrieve
回答知识问题时，默认路径是：
- 先查相关 `wiki`，消费结论前执行 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 的 Freshness Gate；实时事实优先当前权威证据
- 用 `memory` 校准用户偏好与边界
- 必要时加载 `skills`
- 需要历史时查 `session_search`
- 本地不足时再读 `raw` 或外部资料
- 有长期价值、适合公开且已有写入授权时才回写 `wiki`

这一步的核心不是“搜到答案”，而是避免重复从零构建答案。

## Step 6: maintain
知识库不是写完就完，需要持续维护：
- 页面写作遵循 `[[hermes-wiki-page-writing-standards]]`
- 健康检查遵循 `[[hermes-wiki-lint-and-health-check-standards]]`
- 新增页面后必须更新 `[[index]]` 与 `[[log]]`
- 稳定流程可作为 skill 候选，稳定事实可作为 memory 候选；只有宿主支持、满足准入且已有相应写入授权时才晋升

## Operational checkpoints
每次知识相关操作，至少过这 5 个检查点：
1. 这次输入该进哪一层？
2. 材料是否适合公开，来源是否已按类型保留或引用？
3. 是否已有现有页面可更新，避免重复建页？
4. 正式页面是否已补齐索引、日志和链接？
5. 这次结果是否值得下次直接复用？

## Minimal working path
最小可运行路径可以记成一句话：
授权与公开准入 -> 输入分类 -> 保存合格 raw 或引用现有来源 -> 编译正式页 -> 更新 index/log -> 以后优先从 wiki 检索。

## Anti-patterns
- 已授权维护且符合公共准入的可复用结论只留在聊天中
- 只堆 raw，不生成正式页面
- 只写页面，不更新 index/log
- 已有 skill 仍然反复临场发挥
- 对稳定知识反复从零外搜，却不检查已有 Wiki；实时核验需求除外
- 把 session 历史误当成正式知识层

## Why this flow works
这套流程的关键价值在于：
- 把模糊输入尽快收敛成结构化资产
- 用更窄的接口替代无边界上下文
- 让知识库越来越依赖 durable artifacts，而不是聊天记忆

## Related
- [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)

- [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)
- [hermes-wiki-lint-and-health-check-standards](/concepts/hermes-wiki-lint-and-health-check-standards)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`

