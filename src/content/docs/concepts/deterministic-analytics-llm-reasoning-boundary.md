---
title: Deterministic Analytics and LLM Reasoning Boundary
author: Hermes Agent
created: 2026-05-25
updated: 2026-09-29
type: concept
tags:
  - agent
  - llm
  - architecture
  - structured-output
  - verification
sources:
  - raw/articles/towardsdatascience-hybrid-ai-deterministic-analytics-2026-05-22.md
status: stable
description: 划分确定性分析与 LLM 推理的职责边界，避免把可计算事实交给模型猜测。
aliases:
  - deterministic-llm-boundary
---

# Deterministic Analytics and LLM Reasoning Boundary

## Summary

生产级 AI 分析系统应把 LLM 的概率性推理和确定性数据分析分开：LLM 可以理解自然语言意图、生成结构化分析规约并解释结果，但原始表格过滤、列选择、聚合、数值计算和文本抽取应由可复现的确定性程序执行。

本页编译自 Towards Data Science 文章 `[[towardsdatascience-hybrid-ai-deterministic-analytics-2026-05-22]]`。原文场景是制造业运营成熟度评估，但可迁移的 AI Agent 知识是：**自然语言问题 → 结构化分析规约 → 确定性执行器 → LLM 解释层**。

## Core pattern

### 1. LLM plans, but does not directly analyze raw data

LLM 的职责是把用户问题翻译成受限的结构化规则，例如分析类型、章节、数据类别和行过滤条件。它不直接读取高维 Excel 并自行决定哪些行列相关。

AI Agent 迁移原则：

- 不让模型直接在复杂数据集上“自由推理”。
- 先让模型输出可检查的 JSON / schema / selection rule。
- 模糊输入应返回 warning 或 error，而不是猜测。

这补充 `[[typed-ai-agent-boundaries]]`：typed schema 不只是输出格式约束，也可以成为 LLM 与确定性分析层之间的合同。

### 2. Deterministic engine owns filtering, aggregation, and extraction

原文的 Analysis Engine 使用预置 Python / Pandas 脚本执行规则：读取评估 Excel、语义映射文件和 Selection Rule，然后做列匹配、行过滤、均值计算或文本抽取。它不改写规则、不推断额外列，也不输出解释性自然语言。

AI Agent 迁移原则：

- 数值计算、过滤、聚合、去重、抽样和文件解析应优先落到确定性代码。
- 执行器只消费结构化输入并输出结构化结果。
- 如果执行器找不到匹配列、规则冲突或数据为空，应显式失败，而不是让 LLM 补全。

这补充 `[[constrained-toolbox-evaluator-loop]]`：后者强调受限工具箱和 evaluator；本页强调数据分析链路中“事实生成层”必须是确定性执行器。

### 3. Semantic mapping decouples natural language from physical columns

原文数据集包含 800+ 列和 160+ 自由文本字段。作者没有把全部列名直接交给 LLM，而是维护 Mapping File，把物理列映射到 `data_category`、`chapter_id`、`concept_execution` 等语义属性。

AI Agent 迁移原则：

- 高维表格不应直接暴露给模型作为上下文。
- 用语义映射层连接用户语言和物理数据结构。
- 映射文件是生产依赖，必须版本化、校验并随数据 schema 更新。

这补充 `[[hermes-ai-workflow-formalization-principles]]`：自然语言是入口，真正的控制面应尽快收敛为可验证结构。

### 4. LLM returns as interpreter, not source of truth

执行器输出真实数据后，Parent Agent 再把结果改写成用户能读的解释、建议或报告。此时 LLM 的价值是解释、沟通和排序，而不是创造底层事实。

AI Agent 迁移原则：

- 报告层可以用 LLM，但要引用确定性结果。
- 用户可读建议应能追溯到执行器输出。
- 解释层不得把缺失数据包装成确定结论。

## What to preserve from the source

保留：

- LLM 在高维表格分析中会产生“看似合理但错误”的输出。
- Code Interpreter 不能自动解决所有复杂分析可靠性问题。
- Planner 只生成结构化规则，不直接分析评估数据。
- Engine 使用预置 Python / Pandas 确定性执行规则。
- Mapping File 将自然语言意图与 800+ 物理列解耦。
- Parent Agent 只在确定性结果之后进行解释和沟通。

不保留为 AI Agent 默认：

- Microsoft Copilot Studio 作为默认平台选型。
- 原文的制造业成熟度评估字段和章节体系。
- `numeric_mean` / `text_summary` 作为 AI Agent 通用分析类型集合。
- Mapping File 的具体 SharePoint 托管方式。

## AI Agent mapping

### Wiki

本页属于概念层，回答“什么时候必须把 LLM 推理与确定性数据分析隔离”。raw source 保留文章细节和平台实现；概念页只保留可迁移的架构边界。

### Skill

暂不升级为 skill。只有当 AI Agent 在本地项目中反复实现“自然语言 → 分析规约 → 确定性执行器 → LLM 解释”的数据分析链路，并形成稳定命令、schema、fixture 和失败处理后，才值得沉淀为具体开发 skill 或 reference。

### Memory

不进入 memory。本文没有新的用户偏好或环境事实；它是需要来源、局限和交叉链接的工程概念。

### Runtime / cron / MCP

不推广到 runtime、cron、MCP、wrapper 或 active prompt。任何 active-layer 采用都需要单独方案、项目验证和审批。

## Operating rules for future AI Agent workflows

- 结构化数据分析任务默认先问：哪些步骤必须由确定性代码产生事实？
- LLM 可以生成分析计划，但计划必须是结构化、可校验、可拒绝的。
- 执行器必须只执行结构化规则，并输出可追溯结果。
- 高维表格应通过语义映射层暴露给模型，而不是把全部列名直接塞进上下文。
- 模糊用户请求应进入澄清或 warning 状态，不应让模型猜测过滤条件。
- 报告层的自然语言解释必须能追溯到底层执行结果。
- 外部文章中的平台实现和数值规模只作为来源经验值，不能直接变成 AI Agent 标准。

## Relationship to existing concepts

- `[[typed-ai-agent-boundaries]]` 关注 typed schema、typed tools 和依赖注入；本页补充 typed schema 在数据分析链路中可以作为 Planner 与 Engine 的合同。
- `[[constrained-toolbox-evaluator-loop]]` 关注受限工具箱、候选生成和 evaluator 反馈；本页补充企业分析系统中事实生成层应由确定性执行器承担。
- `[[hermes-ai-workflow-formalization-principles]]` 关注自然语言到形式化产物的整体原则；本页提供一个面向结构化数据分析的具体架构模式。
- `[[production-ai-agent-evaluation-framework]]` 关注生产 Agent 的评估层级；本页关注评估之前的数据事实应如何可靠生成。

## Related

- `towardsdatascience-hybrid-ai-deterministic-analytics-2026-05-22`
- [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)
- [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop)
- [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- [agent-self-validation-loops](/concepts/agent-self-validation-loops)

