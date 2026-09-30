---
title: Agent 闭环学习：从用户纠错到规则升级
created: 2026-05-18
updated: 2026-09-29
type: concept
tags:
  - agent
  - memory
  - optimization
  - evaluation
  - workflow
  - governance
sources:
  - raw/articles/microsoft-power-apps-mcp-closed-loop-learning-2026-05-12.md
status: stable
description: 说明如何把用户纠错转化为可验证的 Agent 规则升级闭环。
aliases:
  - closed-loop-learning
---

# Agent 闭环学习：从用户纠错到规则升级

## Summary

Agent 闭环学习是一种把真实使用中的用户纠错转化为可验证系统改进的机制：先保存个案纠正，再从重复模式中提炼规则，通过离线或影子评估验证后，才把规则升级为默认行为。它补充了 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) 的经验固化路径，也为 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 提供“从反馈到新基线”的改进闭环。

一句话原则：**不要把一次用户纠正直接写成全局规则；先记忆、再泛化、再验证、最后推广。**

## Source anchor

本页由 Microsoft Power Platform Blog 文章 `microsoft-power-apps-mcp-closed-loop-learning-2026-05-12` 触发。文章介绍 Power Apps MCP server 的 data entry tool 如何从 Agent feed 中的用户纠正学习，并通过 memory-based optimization 与 Genetic-Pareto optimization 把个案纠错升级为组织级模式。

## Core principle

闭环学习的核心不是“模型自动变聪明”，而是建立一条可审计的改进链：

```text
production action
→ user correction
→ structured memory
→ pattern/rule distillation
→ shadow/offline evaluation
→ baseline promotion
→ future action improves
```

这条链路解决两个常见失败模式：

- **太保守**：用户纠正只影响当前任务，未来仍重复犯错。
- **太激进**：用户纠正一次就变成全局规则，污染其他场景。

成熟做法是在两者之间增加分层晋升：单次反馈先作为证据保留，只有当它可复现、可泛化、可验证时，才升级为默认行为。

## Reusable pattern

### 1. Capture corrections as structured memory

用户纠正必须保留上下文，而不是只保存一句自然语言建议。

至少应记录：

- 原始输入和任务类型。
- Agent 原始输出。
- 用户修正后的值。
- 字段、场景、来源和时间。
- 修正是否代表个人偏好、组织标准、法规要求或一次性例外。

在微软案例中，发票里的 `UK` 被用户改成 `United Kingdom`。这不是聊天偏好，而是组织数据规范。

### 2. Retrieve similar memories for immediate improvement

第一层改进是 memory-based optimization：未来遇到类似任务时，系统召回相关纠正并应用。

它适合处理：

- 高频字段格式修正。
- 相似供应商、地区、表单或文档类型。
- 需要立即从少量真实反馈中受益的场景。

风险是：检索不到时规则不会生效；检索到错误相似项时会误用。

### 3. Distill repeated corrections into rules

第二层改进是把重复纠正提炼成规则。微软文章称其为 Genetic-Pareto optimization：通过进化提示词优化，把具体纠正蒸馏进 Agent 指令，使原则成为默认行为，而不是每次依赖记忆召回。

可迁移到一般 Agent 系统的表达是：

```text
many correction examples
→ candidate rule/prompt
→ regression/evaluation set
→ statistical or threshold validation
→ promoted default instruction
```

这一步的重点是“从 case 到 rule”，不是把所有 case 原样塞进上下文。

### 4. Validate before promotion

新规则必须经过评估门槛。微软文中提到影子实验：真实请求仍用当前基线给用户结果，同时并行评分候选提示词；只有候选显著更好时才升级为新基线。

对 AI Agent 来说，等价 gate 可以是：

- 固定 fixture 上的输出差异对比。
- 真实历史任务的 replay。
- 独立 reviewer / grader 只读审查。
- 关键质量指标不回退。
- 新规则有 rollback path。

这与 [agent-self-validation-loops](/concepts/agent-self-validation-loops) 和 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 的思想一致：先验证，再推广。

## Directional evidence from the source

以下数字来自微软文章中的预上线离线模拟，应视为数量级参考，不应硬编码为 AI Agent 标准：

- 数据集：英国选举委员会 100 张发票，10 次独立运行。
- 字段实例：4277 个。
- 人工编辑字段比例：从 64% 降至 48%，减少 1045 个需人工修正字段。
- F1：从 66.4% 提升到 74.6%，提升 8.2 个百分点。
- 一个抽样运行中：Genetic-Pareto 解决 76/583 个基线差距，约 13% reduction。
- 国家字段准确率：从 11% 提升到 78%，主要来自学会展开国家缩写。

这些数据的价值在于说明：闭环学习最先改善的往往不是“能不能读懂文档”，而是“输出是否符合组织标准”。

## AI Agent mapping

### Session correction

单次用户纠正默认留在 session 或当前任务证据里，除非它满足更高层的晋升条件。

适合留在 session 的内容：

- 当次输出风格修正。
- 一次性上下文误解。
- 当前任务局部约束。

### Memory

只有短小、稳定、跨任务长期有效、且默认注入上下文有收益的事实才进入 memory。

不应进入 memory：

- 文章摘要。
- 复杂方法论。
- 需要来源解释的概念。
- 尚未验证的一次性纠正。

这与 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules) 和 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 的边界一致。

### Skill

当多次纠正指向同一类可重复操作流程时，才考虑 patch skill。

升级条件：

- 能写成触发条件、步骤、坑点和验证。
- 已在至少一个真实任务中跑通。
- 修改后有明确 regression/smoke gate。
- 旧行为有回滚路径。

### Wiki

当纠正背后是跨工具、跨项目的概念或判断框架时，进入 wiki concept。

本页本身就是 wiki 层：它不授权修改 runtime、skill、cron 或 memory，只提供“如何判断反馈是否应升级”的概念模型。

### Evaluation / pilot

从 memory 或 skill candidate 到默认行为之间，应有项目级 pilot 或 eval lane。

推荐链路：

```text
candidate correction pattern
→ project-local fixture / replay set
→ candidate rule or prompt
→ read-only review / evaluation report
→ explicit promotion decision
→ active skill/runtime patch if approved
```

这也呼应 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)：验证项目先在 project-local 层证明价值，再考虑 active 层推广。

## When to promote a correction

可以考虑推广：

- 同类纠正反复出现。
- 纠正能压成明确规则。
- 规则适用边界清楚。
- 失败代价足够高。
- 有可重复测试样本。
- 对其他场景的负面影响可评估。

不要推广：

- 只有一次发生。
- 只是个人即时偏好。
- 规则边界模糊。
- 无法构造验证样本。
- 会覆盖其他用户或其他任务的合理差异。
- 只是产品宣传，缺少本地验证。

## Limitations

微软文章的数据来自单一客户、单一发票处理场景，且是预上线离线模拟。它说明闭环学习在结构化数据录入中有潜力，但不能直接证明该方法适用于所有 Agent 工作流。

对 AI Agent 的使用也应保守：文章只能支持“建立闭环学习概念和晋升门槛”，不能直接支持新增自动自改、自动写 memory、自动 patch skill 或自动 cron 推广。

## Local operating rule

在 AI Agent 中处理用户纠正时，先按 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 裁决纠正内容的归属；若还涉及执行方法、触发、外部能力或运行状态，再按 [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist) 组合路由；最后参考本页 “When to promote a correction” 判断是否满足晋升条件。

## Relations

- refines: [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops)
- related: [agent-self-validation-loops](/concepts/agent-self-validation-loops), [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)

## Related pages

- [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops)
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`

