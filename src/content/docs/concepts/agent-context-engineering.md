---
title: Agent Context Engineering
created: 2026-05-20
updated: 2026-10-17
type: concept
tags:
  - agent
  - llm
  - context-engineering
  - workflow
sources:
  - raw/articles/machinelearningmastery-prompt-engineering-agentic-ai-2026-05-19.md
  - raw/articles/machinelearningmastery-effective-context-engineering-ai-agents-2026-04-28.md
  - raw/articles/machinelearningmastery-context-vs-memory-engineering-agentic-ai-systems-2026-07-03.md
  - raw/articles/machinelearningmastery-ai-agent-memory-strategy-decision-tree-2026-07-11.md
  - raw/articles/thenewstack-codeplain-spec-driven-regenerative-code-2026-06-26.md
  - raw/articles/towardsdatascience-context-engineering-data-scientists-2026-08-30.md
  - concepts/llm-context-engineering-layer.md
  - concepts/hermes-context-engineering-design-priorities.md
status: stable
description: 定义 Agent
  执行过程中的上下文装配总原则：最小可见信息、上下文腐败与即时加载防御、上下文与记忆工程边界、出处债务；静态上下文面与历史/状态加工见两个子页。
aliases:
  - agent-context-engineering
  - context-engineering-for-agents
volatility: medium
review_by: 2026-12-06
---

# Agent Context Engineering

## Summary

可靠 Agent 的核心是“上下文工程”而非“修辞学”：通过即时装配（Just-in-time）系统指令、明确工具边界、精选 Few-shot 示例并动态裁剪消息历史，严格控制模型每一步的可见信息，从而避免上下文腐败（Context Rot）与多步执行偏航。

这页综合 `machinelearningmastery-prompt-engineering-agentic-ai-2026-05-19` 与 `towardsdatascience-context-engineering-data-scientists-2026-08-30` 等来源对 AI Agent 的可迁移原则。它补充 `[[llm-context-engineering-layer]]` 与 `[[hermes-context-engineering-design-priorities]]`：前者讲 RAG 与 prompt 之间的上下文层，后者讲 AI Agent 的预算、排序、压缩优先级；本页聚焦 Agent 执行过程中的上下文装配：system prompt、tools、examples、message history/state 在每一步如何被选择、裁剪和隔离。

## Core principle

Agent prompt engineering 不是把一次性聊天 prompt 写得更漂亮，而是设计一个会反复运行的上下文装配系统。

聊天 prompt 的失败通常会马上暴露，用户下一轮可以纠正；Agent 的失败会在多步任务中延迟显现：早期歧义、过宽工具、错误历史、冗余检索和过期状态会被后续步骤当成事实继续使用，最后表现为工具选择漂移、目标偏航、重复操作或看似合理但不可信的交付物。

因此 Agent 的默认问题应从“我该怎么措辞”改成：

> 模型在当前步骤需要看到哪些最小、最高密度、最可信的信息，才能做对下一步？

## Sub-topics

上下文面按“静态装配”与“随执行增长”拆成两个子页；本页保留总原则、防腐策略和边界。

- [agent-context-prompt-tools-and-examples](/concepts/agent-context-prompt-tools-and-examples)：system prompt、tools、examples 三个静态面。结论：prompt 是保持恰当高度的操作简报，工具面要窄并写明反向边界，示例展示行为而非只展示答案；工具“已安装”不等于模型“会选、会用”。需要设计或审查某个 Agent 的 prompt、工具集或示例时打开。
- [agent-context-history-state-and-bounded-processing](/concepts/agent-context-history-state-and-bounded-processing)：消息历史、运行状态、子代理交接与专用模型加工。结论：转储控制输入尖峰、摘要控制历史累积，二者不可互换；长程任务让“不可变契约 + 经校验状态 + 最新观察”成为最小输入，完整轨迹留在外部证据层；压缩须可恢复且按总成本验收。需要处理长任务、状态卡、子代理上下文传递时打开。

## Context rot and JIT defense

Context rot 不是单纯 token 不够，而是上下文质量随长度和噪音下降：旧错误被保留、重复输出占位、无关材料挤掉关键事实、模型在“看起来相关”的历史中迷路。

AI Agent 的防腐原则：

1. **Just-in-time over pre-loaded**
   - 需要时再读取 wiki、文件、日志或 tool result。
   - 不把所有可能有用的资料预先塞进 prompt。

2. **State card over raw transcript**
   - 对长任务保留结构化状态卡，而不是完整消息历史。
   - 状态卡必须区分已验证事实、推论、待验证问题和下一步。

3. **Role-aware shared context for subagents**
   - 接续型 worker 接收自己的任务、边界、输出契约和已验证前序证据。
   - 独立 reviewer / researcher 接收冻结对象与验收契约，但不接收父级推理结论。
   - 默认不转交主 Agent 的全部历史；只有未来本地证据证明完整 fork 比有界证据包更好时才考虑升级。
   - 这与 `[[subagent-orchestration-patterns]]` 的“从最简单编排开始”原则一致。

4. **Context choice should be explainable**
   - 对复杂任务，应能回答为什么选了某段上下文、为什么丢弃某段上下文。
   - 这与 `[[hermes-context-engineering-design-priorities]]` 的 budget、ranking、compression 顺序一致。

## Context vs. memory engineering boundary

Machine Learning Mastery 的 `Context vs. Memory Engineering in Agentic AI Systems` 把本页的一个隐含规则说得更清楚：**memory 决定可取信息集合，context assembly 决定本轮模型真正看到什么、放在哪里、占多少预算**。

AI Agent 映射（参见 `[[hermes-memory-skills-wiki-boundaries]]`）：
- `memory` 只保存短小、稳定、跨任务默认有价值的事实；它不是文章、工作流、项目状态或历史日志的默认仓库。
- `wiki` 保存来源可追溯的概念和 raw source；适合承载本文这类外部架构原则。
- `skills` 保存可重复执行的方法、触发/跳过条件、pitfalls 和验证方式；文章启发只有在真实 AI Agent 任务中证明可复用后，才考虑进入 skill reference。
- 当前任务状态、工具输出和 session 历史应先被压缩成结构化状态卡，再决定是否进入下一轮上下文。

这篇文章补充了两个可操作原则：
1. **预算先于检索**：检索条数不应只由 Top-K 或相似度阈值决定，而应先由上下文装配器计算当前步骤的 token 预算。
2. **位置是上下文质量的一部分**：关键指令靠前；当前任务、高相关检索结果和需要马上使用的状态靠近生成位置；不要把重要信息随机拼接到长上下文中间。

后续文章 `machinelearningmastery-ai-agent-memory-strategy-decision-tree-2026-07-11` 又补充了检索前的分类步骤：当前状态、稳定事实、历史事件和可复用规程应先进入不同候选层，再由 context assembly 决定本轮是否读取。这里最重要的边界是：检索得到的历史事件不等于当前事实；程序性经验也不能因单次成功就自动进入 system prompt 或 skill。

文章原则可以在 Wiki 之外进入现有 active reference，但应按风险分层：低成本、可逆、触发/跳过条件明确且能立即验证的 optional guidance 可直接窄落现有 owner，不因缺少历史故障而强制试点；默认门禁、runtime、classifier、权限或无人监管自修改仍需要更强证据、明确授权和回滚。

### Agent-maintained context assets

`towardsdatascience-context-engineering-data-scientists-2026-08-30` 还建议根据反馈更新 `CLAUDE.md` 或 skill，并让 Agent 按需读取 JSON、Python、Notebook 与 HTML artifact。可迁移机制是把配置、偏好和交付物视为可检查、可版本化的上下文资产，而不是把模型原生 memory 当唯一长期载体。

[推论] 对 AI Agent，用户明确指出某个低风险、精确且可逆的上下文缺口时，Agent 可以生成并应用窄 diff，再用原案例和邻近反例验证；不需要把每次小改动都降级成观察期。未经授权的宽范围修改、生产/权限/凭证边界和无人监管的 active/runtime 自修改仍禁止。项目级上下文文件的 owner 与清理路径按目标项目既有约定维护。

## Provenance debt in generated code

The New Stack 对 Codeplain 的报道给这页补充了一个上下文工程视角：AI 生成代码被手工连续补丁后，容易产生 **provenance debt（出处债务）**。问题不只是代码变复杂，而是代码与它背后的需求、约束、spec、prompt、推理记录和验收证据之间的来源关系断开；后续 agent 再看到这段代码时，只能从实现反推意图，容易把临时修补当成设计事实。

AI Agent 的对应规则：
- 对 AI 生成或 agent 修改的代码，优先保留“为什么改”的来源：spec、acceptance criteria、ADR、project doc、测试或审查记录。
- 行为逻辑变更应先回写 spec / contract，再派生代码修改；不要让代码 diff 成为唯一事实源。
- 当只剩实现代码而没有来源上下文时，后续 agent 应把意图判断标为推论，并用测试、文档或用户确认补齐事实源。
- 不把外部文章中的全量 regenerate-code 主张直接推广为 AI Agent 默认。出处债务用于提醒上下文保真，不等于允许 agent 无边界重写实现。

## Relationship to existing wiki

- `[[llm-context-engineering-layer]]`：讲 context engineering 作为 RAG 与 prompt 之间的系统层；本页讲 Agent 多步执行中各类上下文面的即时装配。
- `[[hermes-context-engineering-design-priorities]]`：讲 AI Agent 应先做 budget、ranking、compression、history decay；本页补充为什么这些能力对 Agent prompt/context 稳定性必要。
- `[[hermes-context-layer-operating-rules]]`：把通用原则落实为 AI Agent 的上下文装配、历史压缩和长任务状态规则；本页聚焦 Agent 执行过程中 prompt 四个上下文面的即时装配设计。
- `[[hermes-layer-routing-decision-checklist]]`：定义内容归属之外的组合路由；本页不重复维护通用层路由决策。
- `[[typed-ai-agent-boundaries]]`：讲 typed output、typed tools、dependency injection；本页只引用工具边界原则，不重复展开实现细节。
- `[[ai-coding-assistant-context-budget-management]]`：讲工具输出、日志、文件和历史如何占用上下文预算；本页补充工具是否能被发现和正确选择的 upstream 级联。
- `[[agent-development-lifecycle]]`：把 context、tool、prompt、monitor 放进 Build/Test/Deploy/Monitor/Govern 生命周期；本页提供 Build/Test 阶段的上下文装配原则。
- `[[subagent-orchestration-patterns]]`：讲 subagent 生命周期选择；本页补充子 Agent 应接收最小共享上下文，避免跨任务污染。
- `[[codex-agent-workflow-layering]]`：讲 prompt、AGENTS、skill、MCP、automation 以及 spec/generation layer 的职责分离；本页补充 provenance debt 如何导致 agent 上下文保真下降。
- `[[machinelearningmastery-context-vs-memory-engineering-agentic-ai-systems-2026-07-03]]`：补充 memory engineering 与 context engineering 的时间维度边界，强化“候选记忆库 ≠ 当前 prompt 输入”的原则。
- `[[hermes-memory-skills-wiki-boundaries]]`：定义长期能力归类边界；本页引用其对 memory/skills/wiki 的分类规则以防止概念漂移。

## What not to promote blindly

- 不把 CoT、ReAct、Reflexion 固化为 AI Agent 默认执行模式；它们是可选推理架构，不是每个任务的最低成本路径。
- 不因为强调 context engineering 就扩大默认上下文窗口或默认注入更多历史。
- 不因为强调 memory engineering 就扩大长期 memory 写入范围；外部文章中的方法论优先进入 wiki 或 skill reference 候选，而不是用户/环境 memory。
- 不把文章中的经验值、示例 prompt 或 Few-shot 直接写入 `SOUL.md`、`AGENTS.md` 或全局 skill。
- 不把“每个微任务一个 Skill”升级为 AI Agent 默认拓扑；拆分必须减少当前任务的可见噪声，并保留清晰 owner、路由和验证边界。
- 不把“模型失败主要因为上下文错误”当成排他性根因；工具、权限、数据、模型/provider、实现和验收问题仍需分别诊断。
- 不把作者让 Claude 直接更新 Skill 的个人做法推广为无人监管自修改；精确授权的低风险变更可以直接落地，但必须有 diff、验证和回滚。
- 不把本页直接升级为 skill；只有当某个具体 AI Agent 工作流在真实项目中验证出稳定 SOP，才考虑新增或补丁相关 skill。
- 不把工具边界内容复制成第二套规则；工具接口治理以 `[[typed-ai-agent-boundaries]]` 为主。

## Operating rules

- 对 Agent 任务，先定义当前步骤需要的最小上下文，再读取材料。
- 对多模式项目，用短模式声明表达 EDA / 研究 / 生产等高密度差异，同时保留不可推断的硬边界。
- 对长任务，维护结构化状态卡，定期裁剪原始历史。
- 对真正长程、状态密集的任务，让“不可变契约 + 经校验当前状态 + 最新观察”成为下一步的最小输入；完整轨迹留在外部证据层，必要时按指针恢复，不默认重放。
- 对工具集，优先减少可见工具面，再优化工具描述。
- 对 Few-shot，优先展示澄清、失败处理和验证行为，而不是只展示成功输出。
- 对 subagent，按角色传递上下文：接续型 worker 继承有界已验证证据；独立 reviewer / researcher 只接收冻结对象与验收契约；默认不传完整父上下文。
- 对任何 active-layer 变更，先走项目级验证和显式审批，不从外部文章直接推广。

## Relations
- depends_on: [llm-context-engineering-layer](/concepts/llm-context-engineering-layer)
- depends_on: [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities)
- related: [agent-context-prompt-tools-and-examples](/concepts/agent-context-prompt-tools-and-examples), `machinelearningmastery-prompt-engineering-agentic-ai-2026-05-19`, `machinelearningmastery-effective-context-engineering-ai-agents-2026-04-28`, `machinelearningmastery-context-vs-memory-engineering-agentic-ai-systems-2026-07-03`, `machinelearningmastery-ai-agent-memory-strategy-decision-tree-2026-07-11`, `thenewstack-codeplain-spec-driven-regenerative-code-2026-06-26`, `towardsdatascience-context-engineering-data-scientists-2026-08-30`, [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [agent-development-lifecycle](/concepts/agent-development-lifecycle), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist), [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- related: [agent-context-history-state-and-bounded-processing](/concepts/agent-context-history-state-and-bounded-processing)

