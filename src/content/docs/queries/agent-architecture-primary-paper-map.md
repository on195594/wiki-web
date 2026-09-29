---
title: Agent Architecture Primary-Paper Map
created: 2026-08-15
updated: 2026-09-29
type: query
tags:
  - agent
  - research
  - architecture
  - decision
sources:
  - raw/papers/arxiv-2210-03629-react.md
  - raw/papers/arxiv-2302-04761-toolformer.md
  - raw/papers/arxiv-2304-03442-generative-agents.md
  - raw/papers/arxiv-2305-16291-voyager.md
  - raw/papers/arxiv-2308-08155-autogen.md
status: stable
description: 按 Agent 设计问题检索 ReAct、Toolformer、Generative Agents、Voyager 与 AutoGen
  的机制、证据和外推边界。
aliases:
  - agent-primary-paper-map
  - agent-architecture-paper-map
---

# Agent Architecture Primary-Paper Map

## Summary

这五篇论文分别提供推理—行动轨迹、训练时工具学习、记忆—反思—规划、环境反馈与可执行技能、多 Agent 会话编排的一手证据。它们适合作为 Agent 架构设计的检索坐标，但研究对象分属提示范式、训练方法、行为架构、具身系统和应用框架，并不是互斥且完备的 taxonomy。

## Problem-oriented map

| 设计问题 | 一手论文 | 研究层级 | 可复用机制 | 论文证据边界 |
| --- | --- | --- | --- | --- |
| 推理何时应与环境取证交替？ | `arxiv-2210-03629-react` | 提示与轨迹控制 | `Thought → Action → Observation`；在纯推理和外部取证之间按失败状态切换 | ReAct 不在所有知识任务上优于 CoT；搜索失败和循环推理仍会传播 |
| 模型怎样在训练中获得工具调用行为？ | `arxiv-2302-04761-toolformer` | 训练与数据构造 | 候选 API 调用→执行→未来 token loss 过滤→微调 | 不支持工具链、交互搜索或调用成本；不等于 AI Agent 运行时路由 |
| 经历怎样形成持续行为状态？ | `arxiv-2304-03442-generative-agents` | 记忆与行为架构 | memory stream→多因素检索→reflection→hierarchical planning | 主要验证短期模拟中的行为可信度，不是事实正确性或真实人类预测 |
| 可执行能力怎样通过环境反馈积累？ | `arxiv-2305-16291-voyager` | 具身持续学习系统 | 自动课程→程序生成→环境/错误反馈→验证→技能库→检索复用 | Minecraft、高层 API 与 GPT-4 依赖；课程、代码和自验证都可能失败 |
| 多 Agent 交互怎样成为可编程工作流？ | `arxiv-2308-08155-autogen` | 应用编排框架 | conversable agents + conversation programming；组合 LLM、人、工具和代码 | 案例证据异质；不能推出复杂任务默认需要多 Agent |

## Cross-paper distinctions

### Capability is not one layer

- ReAct changes an inference trajectory.
- Toolformer changes how a model is trained to emit and consume API calls.
- Generative Agents defines a state-processing architecture for simulated behavior.
- Voyager builds an environment-coupled program and skill-acquisition system.
- AutoGen supplies an application framework for message-based coordination.

A workflow may combine several of these ideas, but combining labels does not prove that the resulting system is reliable.

### External evidence creates new failure paths

ReAct and Voyager show why environment interaction can ground or correct model behavior. They also show that retrieval, environment feedback, generated code and success verification can themselves be wrong. AI Agent should therefore prefer executable checks and authoritative readback over model confidence alone. See [agent-self-validation-loops](/concepts/agent-self-validation-loops) and [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification).

### Tool learning is not tool governance

Toolformer studies training-time acquisition. AI Agent must additionally control tool visibility, schema, permissions, cost, execution results and fallback at runtime. See [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture) and [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries).

### Memory for simulated behavior is not AI Agent default memory

The Generative Agents memory stream is an application-owned event store used to generate behavior. AI Agent routes session state, durable knowledge, procedures and stable user/environment facts to different layers. See [agent-memory-reflection-planning-pipeline](/concepts/agent-memory-reflection-planning-pipeline) and [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries).

### Multi-agent is a topology choice

AutoGen shows that roles and message patterns can modularize applications, while its open questions preserve the need to choose topology by cost, latency, verification and risk. See [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs) and [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns).

## How to use this map

1. Start from the design problem, not the paper or framework name.
2. Read the corresponding raw paper record and its evidence boundary.
3. Follow the linked concept page for the portable Agent design interpretation.
4. Treat source-specific thresholds, benchmarks and model results as historical evidence, not current defaults.
5. Require project-local evidence before changing active skills, runtime, delegation, memory, MCP, cron or gateway behavior.

## Relations

- refines: [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering)
- related: [agent-development-lifecycle](/concepts/agent-development-lifecycle)
- related: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- related: [llm-engineering-knowledge-map](/concepts/llm-engineering-knowledge-map)
- conflicts_with: []
- supersedes: []

## Related

- [agent-memory-reflection-planning-pipeline](/concepts/agent-memory-reflection-planning-pipeline)
- [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture)
- [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs)
- [index](/)
- `log`

