---
title: Agent 失败闭环评估
created: 2026-05-20
updated: 2026-09-20
type: concept
tags:
  - agent
  - evaluation
  - hermes
  - monitoring
  - closeout
  - workflow
sources:
  - docs:https://venturebeat.com/orchestration/langsmith-engine-closes-the-agent-debugging-loop-automatically-but-multi-model-enterprises-still-need-a-neutral-layer
status: stable
description: 说明如何把可复发 Agent 失败转化为 evaluator、fixture 或防回归工件。
aliases:
  - failure-loop-evaluation
---

# Agent 失败闭环评估

## Summary

本页定义如何把可复发的 Agent 失败转化为中立证据、根因分类、最小修复和防回归评估工件。

## 定义

Agent 失败闭环评估是指：当 Agent 或 Hermes 工作流出现可复发失败时，不只修复当前问题，还要把失败模式转化为 evaluator、fixture、smoke check、skill pitfall 或其他 regression artifact。

## 背景

源自 LangSmith Engine 文章中的工程闭环：失败信号 → 中立证据 → 根因分类 → 候选修复 → 防回归 evaluator → 人类审批。文章里的生产准确率和产品能力主张应保留为厂商发布语境下的未独立验证信息；Hermes 只迁移方法论，不迁移产品依赖。

多模型/多工具工作流还需要可复验的审计链：证据不能只停留在某一个模型或厂商后台，否则跨模型失败会形成审计断层。

## Hermes 适配原则

- 使用本地中立证据层，不依赖单一模型厂商后台。
- 修复必须判断是否需要 regression artifact。
- active-layer 修改必须经用户批准。
- 不自动生成并合并 PR。
- 不把 workflow 规则写入 memory。

## Hermes 层级映射

- session：每次复盘使用 closeout 模板。
- skill：把 closeout 和 regression artifact 判断制度化。
- wiki：保存概念、背景和架构原则。
- memory：不保存 workflow 规则。
- cron：仅在规则稳定后做低频只读检查。
- MCP：仅在需要接外部 live trace/source 时考虑。
- profile：仅在 eval-only runtime 隔离明确时考虑。
- runtime config：不因该原则直接修改。

## 失败信号类型

- 显式错误
- evaluator failure
- trace/log anomaly
- negative user feedback
- out-of-scope behavior
- unverifiable artifact
- active-layer boundary violation

## 根因分类

- extraction
- routing
- prompt
- tool
- model/provider
- context compression
- cache
- permission
- delivery
- governance

## Closeout 模板

```text
失败信号：
证据：
根因分类：
最小修复：
防回归 evaluator/case：
影响层级：
是否需要 active-layer 修改：
是否需要用户审批：
```

## Related pages

- [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules)：相邻但不同；该页关注“用户纠错 → 规则沉淀”，本页关注“失败 → regression artifact”。
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops)
- [index](/)
- `log`

## 边界

本页是概念页，不授权修改 active skills、memory、cron、MCP、profile、runtime config 或 Hermes core。

