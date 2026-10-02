---
title: Agent Resource Optimization
created: 2026-05-21
updated: 2026-10-02
type: concept
tags:
  - agent
  - multi-agent
  - orchestration
  - optimization
  - architecture
  - evaluation
sources:
  - raw/articles/towardsdatascience-agent-planning-operations-research-2026-05-20.md
  - raw/articles/langchain-model-router-in-harness-2026-10-01.md
status: stable
description: 说明预算与能力约束下的 Agent 资源规划，并以 Open SWE 案例解释任务上下文驱动的模型分层及证据边界。
---

# Agent Resource Optimization

## Summary

多 Agent / 自动化系统的规划问题可以先视为资源约束下的优化问题：在预算、能力覆盖、延迟、容量和风险限制内，决定保留哪些 Agent、把任务分配给谁、以及请求如何路由。这个概念补充 `[[agent-orchestration-production-tradeoffs]]` 的拓扑取舍和 `[[production-ai-agent-evaluation-framework]]` 的成本/延迟观测层。

模型分层的目标不是最低调用单价，而是在质量约束下降低任务完成成本。Open SWE 的线上案例提供了任务差异化路由的有限证据，不证明所有系统需要分类器或能够获得相同收益。

## Core principle

不要凭直觉堆 Agent、模型或工具。先把系统约束翻译成：

- 决策变量：哪些 Agent 被启用，任务分给谁，请求走哪条路径。
- 约束条件：预算、能力覆盖、Token、延迟、容量、人类审核负担、失败风险。
- 目标函数：最小化成本、最大化任务价值、最大化能力覆盖，或在给定预算下最大化产出。

这页编译自 `[[towardsdatascience-agent-planning-operations-research-2026-05-20]]`。原文使用 Python + Gurobi 展示运筹学建模方式，但工具不是本页重点；可复用的是建模边界。

## Four optimization frames

### 1. Set covering: ability coverage

问题：用尽量少的 Agent 覆盖所有必要能力。

AI Agent 含义：当 skill、脚本、subagent 角色变多时，不应只问“还缺哪个 Agent”，还要问“现有 Agent 是否已经覆盖需求、是否有冗余重叠”。集合覆盖适合做能力盘点和合并候选识别。

### 2. Assignment: task-to-agent matching

问题：把每个任务或项目分配给最合适的 Agent，以最大化总价值或成功率。

AI Agent 含义：复杂任务不一定需要更多 Agent，而是需要更清楚的分派准则：哪个 worker 处理研究、哪个处理代码审查、哪个处理验证；父 agent 仍负责综合与最终验证。

### 3. Knapsack: budget-constrained selection

问题：在固定预算内选择收益最高的一组 Agent。

AI Agent 含义：预算不只包含 API 成本，也包括上下文窗口、执行时间、人类注意力、验证成本和失败恢复成本。适合评估哪些 automation 值得保留，哪些只能作为候选或手动流程。

### 4. Network flow / routing: constrained request movement

问题：在节点容量、通信成本和需求量约束下规划请求流向。

AI Agent 含义：如果未来出现高频路由、模型分层、轻重任务分流或本地/云模型混合调用，网络流视角比简单 round-robin 更合适。但它必须先经过项目级验证，不能直接变成 runtime 默认规则。

## 任务上下文驱动的模型分层：Open SWE 案例

### 来源与机制

LangChain 的 Sydney Runkle、Eugene Yurtsev 在 `langchain-model-router-in-harness-2026-10-01`（2026-10-01）报告其内部编码 Agent Open SWE 的路由实验。这是工程博客与作者自报的线上结果，不是学术论文或独立复现。

其路径是：分析真实任务与成本 → 沿能力/成本曲线选择少量候选模型 → 用任务特定准则分类 → 同时跟踪成本与任务结果。成本和调用次数只是复杂度代理；调用多也可能源于模型能力不足。实现仅在首条用户消息选择模型，并沿用整个会话。

作者主张将选模放在 Harness，因为它通常拥有任务、提示词、工具和领域上下文。**[推论] 可迁移原则是由拥有足够任务上下文的层负责适配决策，而不是禁止网关参与。** 如果网关获得了必要上下文，物理位置本身不能决定路由质量。

### 作者报告的证据与反例

- 973 个会话的 50/50 A/B 测试，对照组始终使用最强模型；路由组会话 LLM 成本中位数下降 64%，平均成本下降 42%，P90 下降 37%。这是相对该基线的案例结果，不是总运营成本或跨场景收益承诺。
- 每会话产生已合并 PR 的比例为路由组 29.2%、对照组 27.3%（p = 0.49）。未发现显著差异不证明质量等价，也不覆盖问答质量、缺陷、返工或人工审查负担；评估口径见 [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)。
- 另一轮 50/50 路由与全量快速模型对照，因快速模型组输出质量影响工程师效率，在一天内提前结束，没有统计意义的结果。它是该场景下反对无差别低价替代的定性警示，不是所有轻量模型不可用的证明。

### 适用判断与局限

**[推论]** 任务差异明显且真实成本问题值得处理时，可把任务到模型的匹配作为候选优化；先确认已有固定规则或分流是否够用，再考虑分类器。判断收益应计入分类、重试、验证、返工与人工负担，不能只比较每 Token 单价或成功样本。

首轮静态选模不能应对后续意图变更；子 Agent 在该实现中独立选模；中途换模可能折损上下文缓存。缓存 TTL、三档具体模型和流量占比只属于案例时点信息，不转成推荐或默认预算。受控编码评测与自适应换模仍是作者提出的未来工作。可检索的机制和失败案例值得保存，但不因此创建分类器、试验项目、默认路由或新的执行授权。

## What to preserve

- Agent 规划应显式建模决策变量、约束和目标函数。
- 能力覆盖、任务分配、预算选择、请求路由是四类不同问题，不应混在一个“多 Agent 更强”的口号里。
- 成本管理不只是缩短 prompt；也包括角色合并、任务分派、路由路径、验证开销和失败恢复。
- 运筹学模型适合做离线规划、候选方案比较和 checklist，不等同于运行时自适应调度。

## What not to preserve as defaults

- 原文中的 `$20k`、`$4,000`、`215M Token`、`40.6%`、`33%` 等数字只来自 synthetic data。它们可作为数量级示例，不是 AI Agent 阈值。
- `gurobipy` / Gurobi 是候选工具线索，不是默认依赖或强制技术栈。
- 文章示例不能直接授权修改 AI Agent runtime、skills、cron、MCP、profile 或 router。

## AI Agent mapping

### Wiki

本页属于概念层：回答“如何把 Agent 能力、成本、预算和路由建模为优化问题”。

### Skill / memory / runtime

暂不升级。只有当本地项目反复需要 Agent ROI、能力覆盖或路由规划，并且已有可复验 checklist / fixture / run log，才考虑提炼为 skill reference 或项目模板。

### Project validation candidate

可在 Agent 应用 项目中做一个只读检查：列出现有 skills、scripts、cron、subagent 用法，按能力覆盖、重叠、成本、验证负担做一次人工评分。验证目标是发现冗余和候选合并点，而不是自动删除或重构。

## Relationship to existing concepts

- `[[agent-orchestration-production-tradeoffs]]` 关注 orchestration topology 的生产取舍；本页补充“在选择拓扑之前，如何建模资源与约束”。
- `[[production-ai-agent-evaluation-framework]]` 关注生产 Agent 的质量、成本和延迟指标；本页把这些指标进一步转成规划约束或目标函数。
- `[[subagent-orchestration-patterns]]` 关注 subagent 生命周期和执行方式；本页提醒 subagent 数量本身也需要成本/覆盖度约束。
- `[[hermes-layer-routing-decision-checklist]]` 约束知识和工作流沉淀层级；本页不改变 active 层规则，只提供规划视角。

## Related

- `towardsdatascience-agent-planning-operations-research-2026-05-20`
- `langchain-model-router-in-harness-2026-10-01`
- [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)
- [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs)
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop)
- [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)

