---
title: Agent Memory–Reflection–Planning Pipeline
created: 2026-08-15
updated: 2026-08-15
type: concept
tags:
  - agent
  - memory
  - architecture
  - research
sources:
  - raw/papers/arxiv-2304-03442-generative-agents.md
status: stable
description: 将 Agent 经历处理为可检索记忆、受证据约束的反思和可修订计划，同时区分应用事件存储与 Hermes 默认 memory。
aliases:
  - agent-memory-pipeline
  - memory-reflection-planning
---

# Agent Memory–Reflection–Planning Pipeline

## Summary

长期行为不能只靠无限增长的对话历史。一个可检查的状态流水线应把经历保存为应用事件，按当前任务检索少量相关记录，在证据基础上形成高层反思，再把反思与当前环境转成可修订计划。Generative Agents 为这一组合提供了早期实现与消融证据，但其目标是短期社会模拟中的行为可信度，不是通用事实记忆或 Hermes 的默认 memory 设计。

## Source-backed pipeline

```text
observation / interaction
→ append to memory stream
→ retrieve by recency + importance + relevance
→ synthesize reflection from retrieved evidence
→ build and decompose a plan
→ act and observe again
→ store new events, reflections and plans
```

论文实现将观察、反思和计划都写回 memory stream，再根据上下文窗口检索子集。反思不是定时摘要，而是从近期高重要性经历生成更高层问题和推断；计划则从日级大纲逐步分解到更细行动。

## What the evidence supports

- 记忆、反思和计划是可分离且可消融的组件。
- 在论文的人类评估设置中，完整架构的行为可信度高于去掉反思、去掉反思与计划、或缺少事件记忆的对照。
- 检索、反思和规划形成反馈：高层推断会影响未来计划，未来经历又会改变后续检索与反思。
- 长期状态需要检索选择；把完整历史持续塞进 Prompt 既不是该论文的方法，也不是可靠扩展路径。

## What the evidence does not support

- `recency + importance + relevance` 的等权组合不是普适检索公式。
- 论文使用的重要性刻度和反思触发阈值是模拟实现参数，不是 Hermes 默认值。
- 行为看起来可信，不代表事实正确、价值对齐、长期稳定或能预测真实人类。
- LLM 生成的反思可能继承幻觉、偏见、错误检索和被植入的虚假记忆。
- 模拟 Agent 不能替代真实用户、领域专家或利益相关方。

## Hermes layer mapping

Generative Agents 的 memory stream 是**应用拥有的事件存储**。Hermes 的持久层按职责拆分：

| 状态或产物 | Hermes 主要落点 | 不应误放 |
| --- | --- | --- |
| 当前任务状态 | session context / project state | default memory |
| 可检索历史经历 | session search / run logs / validation records | 无来源的概括性 memory |
| 来源支持的长期知识 | wiki + raw sources | 运行时聊天历史 |
| 可重复执行方法 | skill / project docs | 概念页或 memory |
| 稳定用户偏好、环境事实 | default memory | 长篇方法论 |
| 反思生成的候选推断 | 带来源的 wiki 草稿、项目证据或 session | 未验证即升级为稳定事实 |

这与 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 和 [agent-context-engineering](/concepts/agent-context-engineering) 的分层原则一致：反思可以生成候选知识，但不能绕过来源、验证与晋升边界。

## Design questions

在采用类似流水线前，应回答：

1. 事件记录的权威来源是什么？
2. 检索相关性、时间性和重要性如何校准？
3. 反思能否回链到支持它的具体事件？
4. 错误反思如何撤回或降权？
5. 计划如何响应新观察而不无限重写历史？
6. 哪些状态包含个人数据、敏感信息或可被提示注入污染？
7. 完成判断来自模型自评，还是更权威的环境状态？

## Evaluation boundary

评估时应把至少四类指标分开：

- retrieval：是否召回支持当前决策的经历；
- synthesis：反思是否忠于被召回证据；
- planning：计划是否可执行并响应环境变化；
- outcome：行为结果是否达到任务目标，而不只是“看起来合理”。

生产采用还需要权限、保留期限、隐私、审计、删除和回滚设计；原论文的两天模拟不能替代这些验证。

## Relations

- refines: [agent-context-engineering](/concepts/agent-context-engineering)
- related: [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops)
- related: [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- related: [agent-architecture-primary-paper-map](/queries/agent-architecture-primary-paper-map)
- conflicts_with: []
- supersedes: []

## Related

- `arxiv-2304-03442-generative-agents`
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering)
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- [index](/)
- `log`

