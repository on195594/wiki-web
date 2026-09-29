---
title: AI Agent Tool Selection Architecture
created: 2026-07-11
updated: 2026-09-29
type: concept
tags:
  - agent
  - tool
  - context-engineering
  - evaluation
  - workflow
sources:
  - raw/articles/machinelearningmastery-tool-selection-ai-agents-2026-07-06.md
  - raw/papers/arxiv-2302-04761-toolformer.md
  - raw/articles/thenewstack-ard-agent-discovery-specification-2026-08-31.md
  - docs:https://hermes-agent.nousresearch.com/docs/user-guide/features/tools
  - docs:https://hermes-agent.nousresearch.com/docs/reference/toolsets-reference
status: stable
description: 区分资源发现、工具可用性、候选集缩减、逐步选择与失败回退，并用本地评测决定是否需要动态工具路由。
aliases:
  - agent-tool-selection
  - tool-routing-for-ai-agents
---

# AI Agent Tool Selection Architecture

## Summary

AI Agent 的工具选择不是“把所有工具交给模型后让它自己决定”，而是一个分层控制问题：先决定本轮是否需要工具，再缩小候选范围，然后选择并执行具体工具，最后对低置信度和失败结果进行回退。工具 Schema 同时也是上下文，因此工具越多、描述越相似，模型的注意力、Token 成本和选择难度越可能上升。

本页编译自 Machine Learning Mastery 的 `machinelearningmastery-tool-selection-ai-agents-2026-07-06`，结合工具可用性与权限边界给出可迁移设计。文章提供的是架构候选和外部实验线索，不是 AI Agent runtime 的直接改造依据。

## Discovery precedes availability

`thenewstack-ard-agent-discovery-specification-2026-08-31` 补充了工具调用之前的上游问题：当资源分散在多个组织、云或目录中时，Agent 如何发现可能相关的能力。ARD（Agentic Resource Discovery）将此定义为独立的 discovery layer；文中描述的 v0.91 草案使用 JSON-LD 与 REST，以 `POST /search` 在联邦注册表中返回候选资源。

这与本页的 **Availability** 不同：discovery 产生“可能存在什么”，availability/admission 决定“本环境允许并信任什么”。随后才是每一步的候选缩减、具体调用与失败回退。多候选搜索不是 DNS 式的单点解析，不能绕过本地凭证、权限、Schema、审批、执行结果校验或回退。

这只是架构边界的补充，不证明目标系统当前缺少能力。应先检查已有工具注册和权限配置是否提供有界候选面；只有出现跨目录发现摩擦或重复手工配置的本地证据，才值得评估外部 catalog/discovery 方案。

## Four distinct decisions

### 1. Availability: 系统允许使用什么

工具注册、权限、凭证、平台配置和运行时能力检查决定工具是否可用。这个层面处理的是能力与安全边界，不负责判断当前请求最相关的工具。

目标系统可以按平台、会话或任务控制可见工具，但具体分组与能力需实际核对。工具注册不等于调用授权，高风险动作仍需权限与运行时检查。详见 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)。

### 2. Candidate reduction: 本轮让模型看到什么

即使工具已经可用，也不代表它必须进入每一轮模型请求。候选集缩减可以来自：

- 静态 toolset：按平台、项目或任务预先选择工具组；
- 语义路由：先选择数据、通信、开发等工具域；
- 检索式选择：根据查询召回 Top-K 个工具描述；
- 规划式选择：先拆分步骤，再为当前步骤暴露少量工具。

这属于上下文装配问题，与 [agent-context-engineering](/concepts/agent-context-engineering) 的“最小必要可见面”原则一致。缩减候选集的目标不是追求更少工具本身，而是在不损害召回的前提下减少歧义、Token 和误选。

### 3. Selection and execution: 在候选集中调用哪个工具

模型仍需把用户意图映射到工具语义，并生成正确参数。工具描述应写清楚：

- 何时使用；
- 何时不要使用；
- 输入、输出和失败语义；
- 成本、风险及审批边界；
- 与相似工具的区别。

仅缩小工具数量不能修复含糊 Schema、参数契约错误或模型不愿调用工具的问题。工具选择准确率与执行成功率应分开测量，详见 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)。

### 4. Fallback: 低置信度或失败后怎么办

合理的失败路由通常是：

1. 候选明确且风险可接受时执行；
2. 候选不足时改写查询或扩大候选集，最多进行有限重试；
3. 信息仍不足时请求澄清或拒绝猜测；
4. 高风险、不可逆或需凭证的操作进入审批边界。

“置信度阈值”不能仅依赖模型自报。除非通过本地标注集校准，否则应优先使用可观察信号：候选分数差距、Schema 校验、参数缺失、执行错误、权限检查及用户输入是否足够。

## Six controls from the source

文章提出六类控制，应按职责理解，而不是全部叠加为默认流水线：

1. **Gating**：在工具选择前过滤纯对话或无需工具的请求。
2. **Retrieval-based selection**：只向模型提供语义相关的 Top-K 工具。
3. **Semantic routing**：先路由到一个工具域，再在域内选择。
4. **Planner-based selection**：多步任务先分解，再按步骤选择工具。
5. **Fallback logic**：低置信度时重检索、澄清或停止猜测。
6. **Benchmarking**：比较准确率、Token、延迟和任务完成率。

这些机制解决的层次不同，但组合越多，路由器、索引、阈值、追踪和维护成本也越高。没有本地失败证据时，优先使用静态工具集与清晰描述，而不是直接引入向量检索和规划器。

## Training-time acquisition is not runtime tool routing

Toolformer learns tool-call behavior by sampling candidate API calls, executing them, filtering for future-token loss reduction and fine-tuning the model. That mechanism is upstream of this page's runtime decisions. It does not replace tool visibility control, schema validation, permissions, cost accounting, execution-result checking or fallback. Its stated inability to chain tools, interactively browse results or account for call cost is direct evidence against treating learned tool propensity as sufficient runtime governance. See [agent-architecture-primary-paper-map](/queries/agent-architecture-primary-paper-map).

## Evidence and limitations

### Source-backed claims

文章引用 RAG-MCP 研究，报告检索式工具选择在其实验设置下将准确率从 `13.62%` 提升至 `43.13%`，同时减少一半以上 Prompt Token；文章自己的 10 工具、8 查询微型测试也报告了约 `70%` 的 Token 成本下降。

这些数字只能视为特定案例结果：

- 数据集、模型、工具描述质量与 AI Agent 当前环境不同；
- 8 条查询不足以证明生产可靠性；
- 候选召回、最终选择、参数生成与任务成功不是同一指标；
- 检索和规划自身也会增加延迟、成本与失败路径；
- 文中“10～15 个工具后准确率下降”不应成为 AI Agent 的硬阈值。

### What the article cannot establish

文章不能证明动态 Top-K 一定优于 AI Agent 的静态 toolset，也不能证明统一置信度阈值适用于不同模型、工具域和风险等级。它提供的是值得验证的架构假设，而不是生产默认值。

## AI Agent mapping

### Existing coverage

先核对目标系统实际提供的工具分组、会话配置、单工具禁用、子任务约束、审批与失败处理。存在这些能力时优先复用；不存在时说明缺口，不将 Hermes 文档中的 toolset 分类外推为通用 API。

### True local gap

应从真实目标任务建立对照基线，避免仅凭产品功能表推断存在缺口：

- 全量工具面是否真的造成误选；
- 收窄 toolset 是否改善首次选择；
- 哪些工具描述最容易混淆；
- Schema Token 占比及对端到端延迟的影响；
- 工具不可用、信息不足时是否正确澄清或回退。

这个缺口属于评测证据层，不自动授权修改 runtime、config 或 active skill。

## Minimal evaluation path

若后续验证工具选择优化，应复用目标项目已有评测或回放工具，不假定预装某个私有工作区。最低成本对照为：

1. 从真实会话整理查询—目标工具样本，包括无需工具、单工具、相似工具、多步任务、信息不足和工具不可用场景；
2. 对比当前全量工具面与人工收窄的任务型 toolset；
3. 分别记录候选召回、首次选择、参数有效性、执行成功、任务完成、输入 Token 和端到端延迟；
4. 只有静态收窄仍无法解决重复误选时，才评估 Top-K 检索；
5. 动态方案必须具备无结果、错召回和高风险工具的安全回退；
6. 本地结果不足时保持 `NO_ACTION`，不把外部阈值写入默认配置。

## Adoption boundary

- **Wiki：已采纳。** 保存分层模型、证据边界和本地评测路径。
- **Project-local pilot：候选。** 只有出现可复现误选或明确 Token/延迟负担时才启动。
- **Skill/reference：暂不推广。** 已有上下文、工具边界和评测页面覆盖大部分原则。
- **Runtime/config/MCP/cron/memory：不推广。** 动态工具检索、逐轮路由和置信度阈值都需要单独验证、审批和回滚证据。

## Relations

- refines: [agent-context-engineering](/concepts/agent-context-engineering)
- depends_on: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)
- depends_on: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)

## Related

- `machinelearningmastery-tool-selection-ai-agents-2026-07-06`
- [agent-context-engineering](/concepts/agent-context-engineering)
- [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop)
- [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs)
- [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities)
- [agent-architecture-primary-paper-map](/queries/agent-architecture-primary-paper-map)
- `thenewstack-ard-agent-discovery-specification-2026-08-31`

