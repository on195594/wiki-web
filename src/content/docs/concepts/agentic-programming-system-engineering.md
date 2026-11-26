---
title: Agentic Programming as System Engineering
created: 2026-05-21
updated: 2026-11-26
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
  - concepts/agent-production-harness-and-cloud-runtime-boundaries.md
  - concepts/agent-pre-deploy-regression-and-trace-debugging.md
  - concepts/hermes-python-engineering-capability-checklist.md
  - https://arxiv.org/abs/2406.12045
  - https://www.cs.princeton.edu/techreports/1987/070.pdf
  - https://www.vldb.org/cidrdb/2026/consistency-and-correctness-in-data-oriented-workflow-systems.html
  - https://arxiv.org/html/2611.23353v2
  - https://github.com/open-telemetry/semantic-conventions-genai
status: stable
description: 定义把 Agentic programming 作为确定性宿主控制面包裹有界随机推理算子的软件系统工程原则，并路由 D_replay
  / I_idem / T_otel / C_cancel / S_strict 五参数运行时契约。
aliases:
  - agentic-programming
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Agentic Programming as System Engineering

## Summary

Agentic programming 的长期价值不在于“更会写 prompt”，而在于把 Agent 视为**由确定性宿主状态机包裹有界非确定性模型算子**的软件工程系统。可靠 Agent 需要分层工程边界：窄工具与递归严格解析（`S_strict`）、最小上下文、受控取消与内存背压（`C_cancel`）、确定性重放或超步检查点（`D_replay`）、预落盘幂等与崩溃后对账（`I_idem`），以及带外可观测追踪与人类审批治理（`T_otel`）。

本页来自 [machinelearningmastery-agentic-programming-roadmap-2026-05-20](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/machinelearningmastery-agentic-programming-roadmap-2026-05-20.md)，并与 [agent-context-engineering](/concepts/agent-context-engineering)、[typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)、[agent-development-lifecycle](/concepts/agent-development-lifecycle) 衔接。原文中的市场数字、框架生态判断和“2026 视角”只作为作者背景，不作为 AI Agent 的事实基线或选型标准。

## Core principle

> Agent 不是一次性回答器，而是带状态、工具、记忆和目标管理的执行系统；因此它的可靠性问题要用软件工程治理解决，而不是只靠提示词优化。

这条原则把 Agent 设计的问题重心从“怎么让模型说对”转成：

- 当前步骤是否有明确目标和停止条件？
- 可见工具面是否足够窄？
- 工具说明是否写清楚何时用、何时不用、失败后怎么办？
- 历史和上下文是否被裁剪成当前步骤所需的最小状态？
- 多步轨迹是否可观测、可复现、可回滚？

### Built backwards anti-pattern: model-as-orchestrator

Benjamin Nweke 的 Towards Data Science 文章 [towardsdatascience-most-ai-agents-built-backwards-2026-05-27](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/towardsdatascience-most-ai-agents-built-backwards-2026-05-27.md) 给这类失败补了一个好用的诊断标签：**built backwards**。它指的是从“想让 Agent 做什么”出发，挂工具、写 prompt，然后假设模型推理会自动补齐上下文准备、状态同步、重试、工具失败恢复和验证归因。

AI Agent 映射：模型可以负责“在已准备好的上下文里决定下一步”，但不应拥有整个 workflow 架构。上下文准备、状态同步、工具执行、重试、可观测性、验证和回滚都应有显式归属；如果一个 workflow 说不清这些职责分别在哪一层，它就不适合进入 active skill、cron、runtime 或 gateway。

这条反模式连接但不替代已有页面：[agent-context-engineering](/concepts/agent-context-engineering) 继续负责上下文装配和状态裁剪，[typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 继续负责 typed output / typed tools / dependency injection，[production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 继续负责可观测评估与多步轨迹检查，[agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs) 继续负责按约束选择编排拓扑。

## Durable units from the article

### 1. Tool descriptions need negative constraints

工具定义不能只写“这个工具能做什么”。对 Agent 来说，更重要的是写清：

- 什么时候应该使用；
- 什么时候不要使用；
- 输入范围和成本边界；
- 失败时返回什么；
- 是否会产生外部副作用。

这补充 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)：typed schema 可以约束输入输出形状，但工具仍需要语义边界，尤其是 `Do NOT use when...` 这类负向约束。详细工具边界设计规则见 [agent-context-engineering](/concepts/agent-context-engineering) 的工具上下文面与 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)；本节只记录系统工程视角的原则来源。

### 2. Behavioral drift is a first-class failure mode

传统软件经常以异常、超时或错误码暴露失败；Agent 更危险的失败是行为漂移：它仍在权限范围内行动，但目标、上下文、工具选择、成本或循环次数已经偏离预期。

常见信号：

- 重复调用同一类工具；
- 把旧上下文或低质量检索结果当成事实继续推理；
- 完成了一个看似合理但偏离用户目标的产物；
- 在没有报错的情况下消耗过多 token、时间或外部资源；
- 将一次局部失败扩散成后续步骤的错误前提。

AI Agent 映射：这类风险应由 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation)、trace-like evidence、人类审批、最大迭代边界和可回滚交付来治理，而不是只靠模型“自觉”。

**[推论] 多步串联成功率与检查点恢复边界**：设长程任务包含 $L$ 个顺序依赖步骤，$S_t$ 表示第 $t$ 步满足验收条件，定义 $p_t = P(S_t \mid S_1 \cap \dots \cap S_{t-1})$（$p_1 = P(S_1)$），即此前各步均成功时本步成功的条件概率。由概率链式法则，整条轨迹首次即正确的概率为 $P_{\text{traj}} = \prod_{t=1}^{L} p_t$；若只知道各步骤无条件的边际成功率，在缺少独立性假设时不能直接相乘。仅当上述条件成功率均为 $0.95$ 时，$20$ 步连续成功概率才是 $0.95^{20} \approx 35.8\%$。对同一固定任务做 $k$ 次独立同分布运行，全部成功概率为 $P_{\text{traj}}^k$；跨任务的 $\text{pass}^k$ 则需对各任务的该概率取均值（参见 [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification) 与 [Yao et al. 2024](https://arxiv.org/abs/2406.12045)）。**[推论]** 在关键状态跃迁与不可逆枢轴动作（Pivot transaction，参见 [Garcia-Molina & Salem 1987](https://www.cs.princeton.edu/techreports/1987/070.pdf) 与 [Stonebraker 等 CIDR 2026](https://www.vldb.org/cidrdb/2026/consistency-and-correctness-in-data-oriented-workflow-systems.html)）前配置确定性校验、局部重试和语义补偿，旨在把整条链路的崩溃爆炸半径截断到单步持久化单元内；它们是否提高成功率及增加多少吞吐开销仍需实测，不能由乘积公式直接保证。

### 3. Multi-agent systems should minimize shared context

多 Agent 协作不应默认共享完整父上下文。Worker 应只接收：

- 当前子任务目标；
- 必要输入材料；
- 明确边界和禁止动作；
- 输出契约；
- 验证或停止条件。

这与 [agent-context-engineering](/concepts/agent-context-engineering) 的 minimal shared context 一致；AI Agent 操作映射以该页的 Context rot and JIT defense 为主。传递完整历史会增加成本、稀释注意力，并把父任务中的旧错误传播给子任务。

### 4. Agent memory is layered, not one bucket

文章的短期记忆、长期记忆和情景记忆可以翻译为 AI Agent 的层级责任：

- 短期记忆：当前 session context，只保存当前任务所需状态；
- 长期知识：wiki、raw sources、skills、project docs，按来源和职责分层；
- 情景记忆：session_search、run logs、validation records、regression cases，用来复盘成功/失败路径；
- default memory：只放短小稳定的用户偏好、环境事实和工具 quirk，不放文章方法论。

结论：Agent 经验不应被粗暴写入 memory；需要来源和解释的知识进 wiki，需要执行步骤的 workflow 进 skill，需要复发失败防护的经验进 evaluator/fixture/log。

## Control pattern: reasoning, action, and observation

ReAct ([arxiv-2210-03629-react](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/papers/arxiv-2210-03629-react.md)) provides primary evidence for interleaving language reasoning with task-specific actions and environment observations. Its benchmark results are mixed rather than universal: external interaction can reduce unsupported internal reasoning, but search failures, wrong subgoals and repeated steps create new error paths. AI Agent should therefore treat ReAct as an optional trajectory shape for tasks that need iterative environment evidence, not as a default for deterministic, low-risk or already well-specified work. See [agent-architecture-primary-paper-map](/queries/agent-architecture-primary-paper-map).

## [推论] 确定性宿主与有界随机算子分层及五参数运行时契约路由

`[推论]` 从系统工程视角消除“built backwards”反模式的公理化做法，是将大语言模型严格建模为**有界随机推理算子** $M_\theta: \mathcal{C}_{\text{min}} \to \mathcal{Y}_{\text{schema}}$，而将所有状态持久化、外部写操作账本（[arXiv:2611.23353v2](https://arxiv.org/html/2611.23353v2)）、并发任务生命周期及跨协议遥测（[OpenTelemetry GenAI Semantic Conventions](https://github.com/open-telemetry/semantic-conventions-genai)）保留在**确定性宿主状态机** $(S, \Sigma, \delta_{\text{det}})$ 内。具体工程落地由以下五个正交运行时契约参数在各自单一事实源（SSOT）页面主维护，本页负责顶层架构路由而不重复展开细则：

| 契约参数 | 系统职责分层与核心不变量 | 违背时的典型退化现象 | 规则主维护页（SSOT） |
| :--- | :--- | :--- | :--- |
| `D_replay` | **持久化恢复与版本钉扎**：非确定性操作封装入持久步，在途运行绑定不可变 `BuildID / SchemaHash` 且检查点覆盖工作区文件态 | 热更代码报 `NonDeterminismError`，热更工具量纲引发静默语义损坏，或回滚撕裂工作区连续性 | [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries) |
| `I_idem` | **预落盘幂等与对账闭环**：满足 $\text{Persist}(k, \text{intent}) \prec \text{Exec}(k) \prec \text{Reconcile}(k)$ | 裸执行造成重复副作用，或仅靠目标幂等遗留孤儿副作用与永久 `Ambiguous` 未知终态 | [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries) |
| `T_otel` | **带外语义追踪与载荷隔离**：默认 `CAPTURE_CONTENT=NO_CONTENT`；MCP 经 `params._meta` 传 `traceparent` | 将 `traceparent` 塞入工具业务参数触发严格 Schema 报错，或敏感载荷直泄遥测后端 | [agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging) |
| `C_cancel` | **取消安全与队列内存背压**：保护 `CancelledError` 传播、电平触发有界屏蔽清理、有界队列背压及自由线程构建导入生产依赖后的 GIL 状态检查 | 吞取消损坏 `TaskGroup`，仅用 `Semaphore` 撑爆待执行内存，或 C 扩展静默重开 GIL | [hermes-python-engineering-capability-checklist](/concepts/hermes-python-engineering-capability-checklist) |
| `S_strict` | **递归严格解析与 $O(1)$ 分派**：共享 `strict=True, extra='forbid'` 基类、判别联合、单例 `TypeAdapter` 与截断完整性校验 | 子模型退回 Lax 吞掉幻觉字段，无标签联合报错冲垮上下文，或静默摄取 HTTP 200 截断载荷编造结论 | [hermes-python-engineering-capability-checklist](/concepts/hermes-python-engineering-capability-checklist), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) |

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

- depends_on: [agent-context-engineering](/concepts/agent-context-engineering), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [agent-development-lifecycle](/concepts/agent-development-lifecycle)
- related: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework), [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs), [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [agent-architecture-primary-paper-map](/queries/agent-architecture-primary-paper-map), [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification), [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries), [agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging), [hermes-python-engineering-capability-checklist](/concepts/hermes-python-engineering-capability-checklist)

