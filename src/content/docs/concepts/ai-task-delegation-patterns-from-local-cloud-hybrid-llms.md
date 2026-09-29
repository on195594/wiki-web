---
title: AI Task Delegation Patterns from Local-Cloud Hybrid LLMs
created: 2026-07-03
updated: 2026-07-03
type: concept
tags:
  - agent
  - orchestration
  - subagent
  - decision
  - workflow
  - hermes
  - llm
sources:
  - raw/articles/towardsdatascience-local-cloud-llm-hybrid-patterns-2026-07-02.md
  - concepts/agent-autonomy-ladder-for-hermes-workflows.md
  - concepts/subagent-orchestration-patterns.md
  - concepts/agent-context-engineering.md
status: stable
description: 将端云混合 LLM 的 5 种模式抽象为 Hermes PM/subagent/外部 AI 调度模式：任务包、计划落地、困难升级、草稿精修、交叉审查。
aliases:
  - ai-delegation-patterns
  - local-cloud-llm-delegation-patterns
  - pm-agent-delegation-patterns
---

# AI Task Delegation Patterns from Local-Cloud Hybrid LLMs

## Summary

Towards Data Science 的 `Stop Choosing Between Local and Cloud LLMs` 表面讨论本地模型与云端模型的混合架构，但对 Hermes 更可迁移的结论是：**父 Agent / PM 不应把完整上下文无差别交给一个强模型，而应根据任务方向、触发条件、风险和目的，把最小任务包交给合适的 AI 执行者，并保留本地 grounding、复核和验收权。**

本页把原文 5 种 local-cloud 模式抽象为 Hermes 的 PM/subagent/coding-agent delegation 模式。它补充 `[[agent-autonomy-ladder-for-hermes-workflows]]`：后者先判断自治级别，本页进一步说明任务包如何构造、何时升级、何时精修或交叉审查。

## Core mapping

| 原文模式 | Hermes 调度模式 | 核心用途 |
|---|---|---|
| Sanitize-and-Solve | task packet + minimal context + parent rehydration | 把敏感/复杂上下文压成最小任务包交给子 Agent 或外部 AI，父 Agent 还原语境并验收 |
| Plan-then-Ground | external plan + Hermes local grounding | 让外部 AI 生成通用计划，Hermes 根据本地 repo/wiki/memory/project context 裁剪和执行 |
| Escalate-on-Hard | risk/complexity-triggered delegation | 父 Agent 先处理，遇到复杂度、失败次数、风险或不确定性阈值再升级 |
| Draft-then-Refine | fast parent draft + external refinement/review | Hermes 先产出可用草稿，再在高收益场景引入外部 AI 精修或审查 |
| Cross-Check | independent read-only review + parent arbitration | 一个执行者产出，另一个独立审查，父 Agent 最终裁决 |

## Pattern 1: Sanitize-and-Solve → task packet delegation

原文模式是“本地脱敏 → 云端求解 → 本地还原”。Hermes 对应为：

```text
Hermes 父 Agent 提取最小任务包
→ 去除敏感、无关或会污染判断的上下文
→ 交给 AGY/Codex/Claude/subagent
→ Hermes 复核证据、还原到真实项目语境、决定是否采纳
```

适用场景：
- AGY/Codex/Claude 只读审查，只需要 diff、目标、风险边界和问题清单；
- subagent 负责局部调研、测试失败分析、候选方案比较；
- 外部 AI 做抽象架构建议，但不需要完整用户偏好、历史对话或敏感项目状态。

关键规则：子 Agent 只拿“可执行任务包”，不继承父 Agent 的完整上下文。敏感映射、最终解释和执行验收留在父 Agent。

## Pattern 2: Plan-then-Ground → external plan, local execution

原文模式是“云端规划 → 本地结合真实数据执行”。Hermes 对应为：

```text
外部 AI / subagent 产出通用计划
→ Hermes 用本地约束校准
→ Hermes 决定可执行切片、拒绝项、验证命令和回滚路径
```

适用场景：
- Claude Code plan mode 或 AGY 做只读方案审查；
- Codex/Claude 给出 refactor plan；
- 外部 AI 分析通用技术选型；
- Hermes 结合 `CLAUDE.md`、`AGENTS.md`、项目测试、用户偏好和安全红线裁剪。

边界：外部计划不是授权；Hermes 才是 grounding 和执行裁决者。

## Pattern 3: Escalate-on-Hard → thresholded delegation

原文模式是“简单任务本地做，困难任务升级云端”。Hermes 对应为：

```text
Hermes 先用直接工具/自身推理处理
→ 触发复杂度、风险、失败或不确定性阈值
→ 升级给 AGY/Codex/Claude/subagent
```

好触发条件：
- 多文件行为变更或复杂重构；
- 父 Agent 两轮修复后仍失败；
- 需要独立审查或第二视角；
- 涉及生产、凭证、DB、cron、runtime、MCP、外部副作用；
- 需要并行阅读大量材料或拆成非重叠任务。

跳过条件：
- 一行低风险改动；
- 普通总结或简单 lookup；
- 已有确定命令可直接验证的任务；
- 子任务会编辑重叠文件但没有集成计划。

## Pattern 4: Draft-then-Refine → fast draft, bounded refinement

原文模式是“本地先给草稿，云端后台精修”。Hermes 对应为：

```text
Hermes 先给可用草稿 / plan / patch
→ 外部 AI 或 subagent 做严格审查、改写或补盲点
→ Hermes 合并最终版本并验证
```

适用场景：
- 写计划、prompt、文章、架构方案；
- 初步实现后交给 AGY/Codex review；
- 用户需要快反馈，但最终质量仍重要。

边界：refine 不是默认步骤；只有质量收益大于延迟、成本和上下文负担时触发。

## Pattern 5: Cross-Check → independent review with parent arbitration

原文模式是“两种模型交叉校验”。Hermes 对应为：

```text
一个 agent / 父 Agent 产出
→ 另一个 agent 只读审查真实证据
→ Hermes 父级裁决、接受/拒绝/修复
```

适用场景：
- active skill/reference 修改；
- runtime/config 风险；
- wiki 重要概念入库；
- 复杂方案决策；
- 代码审查或用户显式要求 AGY/Codex/Claude 审查。

边界：Cross-check 必须有父级仲裁和真实证据；两个模型意见不同不会自动提升可靠性。

## Relation to existing Hermes workflows

- `[[agent-autonomy-ladder-for-hermes-workflows]]`：先决定自治级别；本页决定同一自治级别内任务如何打包、升级、精修和交叉审查。
- `[[subagent-orchestration-patterns]]`：讲 subagent 生命周期选择；本页补充 task packet 与父级 rehydration。
- `[[agent-context-engineering]]`：讲最小上下文与 context rot；本页把最小上下文原则用于委托任务包。
- `[[ai-coding-assistant-context-budget-management]]`：讲工具输出、文件、历史的预算；本页补充跨 AI 执行者的上下文裁剪。

## What not to promote blindly

- 不把 5 种模式变成固定步骤链。
- 不默认每个任务都派 subagent、AGY 或 Codex。
- 不把 Cross-Check 变成普通小任务默认审查。
- 不把外部 AI 的计划当成执行授权。
- 不把完整父上下文交给子 Agent，只因为“它更强”。
- 不从这篇文章直接推广本地 LLM runtime、provider routing、cron、MCP 或 active gateway 变更。

## Operating rule

当 Hermes 要决定“是否把任务交给另一个 AI”时，先回答三个问题：

1. **方向**：谁先做，父 Agent、子 Agent、外部 AI，还是确定性工具？
2. **触发**：什么条件才升级、精修或交叉审查？
3. **收益**：这样拆分带来的隐私、质量、速度、成本或可控性收益是否大于上下文/流程成本？

## Related

- `towardsdatascience-local-cloud-llm-hybrid-patterns-2026-07-02`
- [agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows)
- [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)
- [agent-context-engineering](/concepts/agent-context-engineering)
- [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management)
- [codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`

