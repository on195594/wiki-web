---
title: Deterministic Analytics and LLM Reasoning Boundary
author: Hermes Agent
created: 2026-05-25
updated: 2026-09-30
type: concept
tags:
  - agent
  - llm
  - architecture
  - structured-output
  - verification
sources:
  - raw/articles/towardsdatascience-hybrid-ai-deterministic-analytics-2026-05-22.md
  - raw/articles/motherduck-jev-for-analytics-2026-09-29.md
status: stable
description: 区分概率性语义判断与确定性分析，将有界分类结果复用、复核，不把结构化标签当作已验证事实。
aliases:
  - deterministic-llm-boundary
---

# Deterministic Analytics and LLM Reasoning Boundary

## Summary

AI 分析系统应把概率性语义判断和确定性数据分析分开：模型可以理解意图、生成结构化分析规约、进行有界语义分类并解释结果；按明确规则执行的过滤、列选择、聚合、数值计算和按格式抽取由可复现的程序承担。自由文本中的诉求归类不是按格式抽取，仍可能判断错误；落成强类型列不会自动使标签成为已验证事实。

本页编译自 Towards Data Science 文章 `[[towardsdatascience-hybrid-ai-deterministic-analytics-2026-05-22]]`。原文场景是制造业运营成熟度评估，但可迁移的 AI Agent 知识是：**自然语言问题 → 结构化分析规约 → 确定性执行器 → LLM 解释层**。

MotherDuck 的 `motherduck-jev-for-analytics-2026-09-29` 补充了自由文本入口：**定义候选类别 → 概率性分类与复核 → 保存结果 → 确定性聚合**。两个模式解决不同输入问题，不要求每个分析任务都经过模型分类。

## Core pattern

### 1. LLM plans, but does not directly analyze raw data

在原文的结构化表格分析模式中，LLM 的职责是把用户问题翻译成受限的结构化规则，例如分析类型、章节、数据类别和行过滤条件。它不直接读取高维 Excel 并自行决定哪些行列相关；这不排除在另一种有界任务中将单条自由文本交给分类模型。

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

这补充 `[[constrained-toolbox-evaluator-loop]]`：后者强调受限工具箱和 evaluator；本页强调计算结果应由确定性执行器生成，输入质量与语义判断则需另行验证。程序可复现不代表输入标签正确。

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

## 自由文本的有界语义分类：概率性加工，确定性聚合

### 适用条件与职责

`motherduck-jev-for-analytics-2026-09-29`（Mehdi Ouazza，MotherDuck，2026-09-29）演示：从 40 条金融投诉样本提出七个诉求类别，再用 Jev 对十万条文本分类，保存 `choice`、`confidence` 与 `probabilities`，后续用 SQL 分析。值得复用的是任务分工，不是厂商默认选型：

- 明确、可靠的规则或解析器已经能完成任务时，优先复用，不增加语义模型。
- 需要发现新类别、生成总结或解释时，生成式模型更符合任务形态。
- 同一种语义判断反复发生、候选答案可列举且定义清楚时，可评估有界分类；不强制将重叠意图塞入不合适的单标签体系。
- 分类结果落表后复用，过滤与聚合不重复调用模型；类别定义含混或遗漏时，受限模型仍会输出格式正确的错误标签。

### 质量分流与追溯

原文将 `confidence` 解释为候选分数的集中程度，用 SQL 将低于示例阈值 `0.8` 的记录送人工或更强模型复核；高于阈值仍可能出错，阈值需在目标数据上验证。作者还建议将需要跨查询复用的类别维护在表中并版本化。

工程建议（以下为 **[推论]**，不是文章已完成的验证）：

- 使用代表性人工标注样本，检查各类别错误、自动接受覆盖率和复核负担，而非只用模型共识代替正确性。
- 抽查高置信度样本；不把分数集中程度直接解释为已校准的正确概率。
- 需要重算或追溯时，为落表标签保留源记录标识、类别定义版本、模型版本和处理时间；类别或模型变更后重新评估适用性。
- 比较端到端成本时纳入分类、复核和重算，而非只比较单次推理报价；复用 [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines) 与 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 的评估边界。

### 案例证据与不能外推的结论

- **作者报告的投诉测试**：十万行 Jev 分类为 `82.2 秒`；一万行 Jev 为 `12.5 秒`，gpt-5-nano 为 `6 分 9 秒`；一次下游 SQL 聚合为 `0.9 秒`。这些不保证所有文本、语言或查询具有相同性能。
- **另一项发布基准**：十万篇短新闻为 `40 秒`；文中引用每十万行 API 成本 Jev `$0.50`、gpt-5-nano `$1.58`、GPT-5.6 Terra `$37.58`。这些不是投诉测试的实测账单；“约 1%”是相对该前沿模型，不是相对 nano。
- **一致率不是准确率**：300 条样本中，两大模型一致率为 `72.7%`；Jev 在两者先达成共识的 218 条上为 `90.4%`，进一步筛到 Jev 置信度至少 `0.8` 的 161 条才为 `96.9%`。该筛选子集没有证明全量准确率，模型共识也不是人工金标准。
- **来源与产品边界**：这是厂商发布的实践文章，未独立复现；模型名称按原文保留。“System 1 / System 2”只是解释类比，不是严谨能力分类。快照保留正文、静态表格和代码，未保留交互图的完整呈现。
- **合规与采用边界**：按发表时的文章，`prompt_jev()` 属于 MotherDuck 付费计划，文本发往 TypeSafe 推理；实际采用前需核实当前接口和数据处理政策。文章不能证明中文任务质量或任一目标项目的适配性，本页不引入产品依赖、默认阈值、Skill 或运行配置。

核心判断：**把语义判断限制在必要环节；确定性聚合可以稳定地计算错误标签，却不能替它们证明真实性。** 类型与语义保证的区别参见 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)。

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
- `[[constrained-toolbox-evaluator-loop]]` 关注受限工具箱、候选生成和 evaluator 反馈；本页补充企业分析系统中可计算结果由确定性执行器承担，上游语义判断仍需验证。
- `[[hermes-ai-workflow-formalization-principles]]` 关注自然语言到形式化产物的整体原则；本页提供一个面向结构化数据分析的具体架构模式。
- `[[production-ai-agent-evaluation-framework]]` 关注生产 Agent 的评估层级；本页关注计算结果的可追溯性与上游语义标签的独立质量验证。

## Related

- `towardsdatascience-hybrid-ai-deterministic-analytics-2026-05-22`
- [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)
- [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop)
- [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)
- `motherduck-jev-for-analytics-2026-09-29`

