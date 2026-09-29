---
title: Agentic Programming as System Engineering
created: 2026-05-21
updated: 2026-09-29
type: concept
tags:
  - agent
  - ai-coding
  - architecture
  - tool
  - context-engineering
  - governance
  - debugging
sources:
  - raw/articles/machinelearningmastery-agentic-programming-roadmap-2026-05-20.md
  - raw/articles/towardsdatascience-most-ai-agents-built-backwards-2026-05-27.md
  - raw/papers/arxiv-2210-03629-react.md
  - concepts/agent-context-engineering.md
  - concepts/typed-ai-agent-boundaries.md
  - concepts/agent-development-lifecycle.md
status: stable
description: 定义把 Agentic programming 作为带状态、工具、边界和治理的软件系统来设计的原则。
aliases:
  - agentic-programming
---

# Agentic Programming as System Engineering

## Summary

Agentic programming 的长期价值不在于“更会写 prompt”，而在于把 Agent 视为一个会循环决策、调用工具、维护状态并产生外部结果的软件系统。可靠 Agent 需要工程边界：窄工具、负向约束、最小上下文、状态管理、可观测 trace、人类审批和可回滚治理。

本页来自 `[[machinelearningmastery-agentic-programming-roadmap-2026-05-20]]`，并与 `[[agent-context-engineering]]`、`[[typed-ai-agent-boundaries]]`、`[[agent-development-lifecycle]]` 衔接。原文中的市场数字、框架生态判断和“2026 视角”只作为作者背景，不作为 AI Agent 的事实基线或选型标准。

## Core principle

> Agent 不是一次性回答器，而是带状态、工具、记忆和目标管理的执行系统；因此它的可靠性问题要用软件工程治理解决，而不是只靠提示词优化。

这条原则把 Agent 设计的问题重心从“怎么让模型说对”转成：

- 当前步骤是否有明确目标和停止条件？
- 可见工具面是否足够窄？
- 工具说明是否写清楚何时用、何时不用、失败后怎么办？
- 历史和上下文是否被裁剪成当前步骤所需的最小状态？
- 多步轨迹是否可观测、可复现、可回滚？

### Built backwards anti-pattern: model-as-orchestrator

Benjamin Nweke 的 Towards Data Science 文章 `[[towardsdatascience-most-ai-agents-built-backwards-2026-05-27]]` 给这类失败补了一个好用的诊断标签：**built backwards**。它指的是从“想让 Agent 做什么”出发，挂工具、写 prompt，然后假设模型推理会自动补齐上下文准备、状态同步、重试、工具失败恢复和验证归因。

AI Agent 映射：模型可以负责“在已准备好的上下文里决定下一步”，但不应拥有整个 workflow 架构。上下文准备、状态同步、工具执行、重试、可观测性、验证和回滚都应有显式归属；如果一个 workflow 说不清这些职责分别在哪一层，它就不适合进入 active skill、cron、runtime 或 gateway。

这条反模式连接但不替代已有页面：`[[agent-context-engineering]]` 继续负责上下文装配和状态裁剪，`[[typed-ai-agent-boundaries]]` 继续负责 typed output / typed tools / dependency injection，`[[production-ai-agent-evaluation-framework]]` 继续负责可观测评估与多步轨迹检查，`[[agent-orchestration-production-tradeoffs]]` 继续负责按约束选择编排拓扑。

## Durable units from the article

### 1. Tool descriptions need negative constraints

工具定义不能只写“这个工具能做什么”。对 Agent 来说，更重要的是写清：

- 什么时候应该使用；
- 什么时候不要使用；
- 输入范围和成本边界；
- 失败时返回什么；
- 是否会产生外部副作用。

这补充 `[[typed-ai-agent-boundaries]]`：typed schema 可以约束输入输出形状，但工具仍需要语义边界，尤其是 `Do NOT use when...` 这类负向约束。详细工具边界设计规则见 `[[agent-context-engineering]]` 的工具上下文面与 `[[typed-ai-agent-boundaries]]`；本节只记录系统工程视角的原则来源。

### 2. Behavioral drift is a first-class failure mode

传统软件经常以异常、超时或错误码暴露失败；Agent 更危险的失败是行为漂移：它仍在权限范围内行动，但目标、上下文、工具选择、成本或循环次数已经偏离预期。

常见信号：

- 重复调用同一类工具；
- 把旧上下文或低质量检索结果当成事实继续推理；
- 完成了一个看似合理但偏离用户目标的产物；
- 在没有报错的情况下消耗过多 token、时间或外部资源；
- 将一次局部失败扩散成后续步骤的错误前提。

AI Agent 映射：这类风险应由 `[[agent-failure-closed-loop-evaluation]]`、trace-like evidence、人类审批、最大迭代边界和可回滚交付来治理，而不是只靠模型“自觉”。

### 3. Multi-agent systems should minimize shared context

多 Agent 协作不应默认共享完整父上下文。Worker 应只接收：

- 当前子任务目标；
- 必要输入材料；
- 明确边界和禁止动作；
- 输出契约；
- 验证或停止条件。

这与 `[[agent-context-engineering]]` 的 minimal shared context 一致；AI Agent 操作映射以该页的 Context rot and JIT defense 为主。传递完整历史会增加成本、稀释注意力，并把父任务中的旧错误传播给子任务。

### 4. Agent memory is layered, not one bucket

文章的短期记忆、长期记忆和情景记忆可以翻译为 AI Agent 的层级责任：

- 短期记忆：当前 session context，只保存当前任务所需状态；
- 长期知识：wiki、raw sources、skills、project docs，按来源和职责分层；
- 情景记忆：session_search、run logs、validation records、regression cases，用来复盘成功/失败路径；
- default memory：只放短小稳定的用户偏好、环境事实和工具 quirk，不放文章方法论。

结论：Agent 经验不应被粗暴写入 memory；需要来源和解释的知识进 wiki，需要执行步骤的 workflow 进 skill，需要复发失败防护的经验进 evaluator/fixture/log。

## Control pattern: reasoning, action, and observation

ReAct provides primary evidence for interleaving language reasoning with task-specific actions and environment observations. Its benchmark results are mixed rather than universal: external interaction can reduce unsupported internal reasoning, but search failures, wrong subgoals and repeated steps create new error paths. AI Agent should therefore treat ReAct as an optional trajectory shape for tasks that need iterative environment evidence, not as a default for deterministic, low-risk or already well-specified work. See [agent-architecture-primary-paper-map](/queries/agent-architecture-primary-paper-map).

## AI Agent layer routing

- Wiki：适合保存本文的概念框架和来源。
- Skill：暂不直接升级；只有当某个具体 AI Agent skill/tool 审查任务验证出可复用修改，才 patch 负向边界或最大迭代规则。
- Memory：不写。本文不是用户偏好或稳定环境事实。
- Cron：不写。本文不定义周期任务。
- MCP：不写。本文不引入外部 live data/tooling bottleneck。
- Runtime/config：不改。最大迭代次数和审批边界是合理候选，但需要单独方案、验证和明确批准。

## What not to copy blindly

- 不把文章里的市场比例、Gartner 预测、企业投产率当作当前事实基线。
- 不把 LangGraph、CrewAI、AutoGen、Semantic Kernel 的生态判断当作 AI Agent 默认选型。
- 不把“6 个月学习路线图”写成 AI Agent 路线图。
- 不把 ReAct、reflection 或多 Agent 模式固化为所有任务的默认执行方式。
- 不因为文章强调生产 Agent，就绕过 AI Agent 的 active-layer 审批边界。

## Relations
- depends_on: [agent-context-engineering](/concepts/agent-context-engineering)
- depends_on: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)
- depends_on: [agent-development-lifecycle](/concepts/agent-development-lifecycle)

## Related

- `machinelearningmastery-agentic-programming-roadmap-2026-05-20`
- `towardsdatascience-most-ai-agents-built-backwards-2026-05-27`
- [agent-context-engineering](/concepts/agent-context-engineering)
- [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs)
- [agent-development-lifecycle](/concepts/agent-development-lifecycle)
- [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation)
- [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)
- [agent-architecture-primary-paper-map](/queries/agent-architecture-primary-paper-map)

