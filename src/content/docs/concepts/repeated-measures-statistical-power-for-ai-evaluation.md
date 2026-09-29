---
title: 少样本 AI 评测中的重复任务、伪重复与统计功效
created: 2026-08-09
updated: 2026-08-09
type: concept
tags:
  - agent
  - evaluation
  - validation
  - research
sources:
  - raw/articles/towardsdatascience-statistical-power-more-problems-2026-08-04.md
status: stable
description: 区分参与主体数、任务数与有效独立证据，说明何时重复任务能提高统计功效，以及如何避免把相关观测误当独立样本。
aliases:
  - repeated-measures-power
  - pseudo-replication-in-ai-evaluation
---

# 少样本 AI 评测中的重复任务、伪重复与统计功效

## Summary

在 AI、Agent 或人机交互评测中，增加任务数量不等于增加同等数量的独立样本。被试间设计仍受主体基线差异限制；被试内设计让同一主体跨条件比较，可以抵消部分主体噪声，但同一主体和相似任务产生的观测彼此相关，必须显式建模，不能把它们当成独立样本堆高置信度。

这页补充 `[[production-ai-agent-evaluation-framework]]` 的实验设计与统计功效层，也与 `[[stateful-agent-environments-and-grounded-verification]]` 关于“任务数量不等于评测多样性”的边界相连。

## 核心问题：更多数据点是否真的增加证据

设有 `N` 个参与主体，每个主体完成 `M` 个任务。表面观测数是 `N × M`，但有效证据量取决于这些观测共享多少主体、任务和条件结构。

- 同一主体的多次结果共享能力、经验、疲劳等基线因素。
- 同一任务或同一模板生成的题目共享难度与结构。
- 主体可能对不同条件反应不同，任务也可能与条件发生交互。
- 因而 `N × M` 个观测通常不是 `N × M` 个独立样本。

把相关观测直接当成独立样本属于伪重复，会低估不确定性，并可能虚高显著性或统计功效。

## 被试间设计：多做任务不能消除主体差异

在被试间设计中，不同主体只进入一个条件。增加每人的任务数可以更准确地估计该主体能力和任务难度，却不能排除两个条件恰好招募到不同能力主体的可能性。

因此，当主体数量较少且主体差异较大时，单纯增加任务通常只能有限改善条件效应的识别。文章中的数学分析与 Monte Carlo 模拟都呈现了这一现象，但其数值只适用于对应模拟参数。

## 被试内设计：重复任务何时能增加功效

在被试内设计中，同一主体完成多个条件，分析关注同一主体跨条件的差异。主体稳定基线可以部分抵消，多任务观测也能提供额外信息。

这种增益成立需要三个条件：

1. 使用多层模型、交叉随机效应或其他合适方法控制重复观测的依赖关系；
2. 任务具有足够多样性，不能只是同一模板的批量改写；
3. 顺序、学习、疲劳和条件污染得到平衡、建模或明确披露。

即使条件满足，增加任务的收益通常也会递减；不能用更多任务无限替代更多主体。

## 对 AI 与 Agent 评测的映射

以下是对 Hermes/AI 评测的本地映射，均为 `[推论]`：

- 比较两个模型、Prompt、Agent harness 或工具策略时，如果同一批任务都由两个条件执行，优先考虑配对或被试内比较，而不是把两组结果当成互不相关。
- 同一模型在同一任务上的多次运行可用于估计随机性，但不能自动当成更多独立任务。
- 由 LLM 按模板扩增出的题目应按任务簇或子量表处理；在证明多样性前，不应按题目数量等比例增加置信度。
- 评测记录至少应区分主体/模型配置、任务或任务簇、条件、运行次数和顺序，才能判断适合的统计单元。
- 与 `[[agent-evaluation-rubric-calibration]]` 配合使用：先确认评分尺稳定，再讨论样本结构和功效；错误的 Rubric 不会因样本增多而自动变正确。

## 最小设计检查

在设计小样本评测时先回答：

- 真正独立的实验单位是什么：人、团队、模型配置、会话，还是任务簇？
- 重复运行共享了哪些主体、任务、Prompt、上下文或环境状态？
- 条件是否由同一单位跨条件完成，能否进行配对比较？
- 任务之间是否足够不同，还是同一模板的近重复？
- 是否存在顺序、学习、污染、疲劳或缓存效应？
- 统计方法是否与主体 × 任务 × 条件结构一致？

## PIPS 的适用边界

原文提供 PIPS（Project Impossible Power Simulation）作为直觉工具和功效分析起点。它允许调整主体数、任务数、效应量、信度及主体/任务与条件的交互变异。

PIPS 没有同行评审或独立验证，浏览器实现使用 Clark's min F' 近似而非完整混合效应模型。它适合探索参数敏感性、形成试点假设和理解权衡，不适合直接生成 Hermes 的固定样本量标准。

`[推论]` 高风险研究应由合格统计人员审查设计与模型。

## Evidence boundary

- 主要证据是一篇作者实践文章和其开源模拟器，不是系统综述或经过独立复现的研究。
- 文中 `N=32、M=16` 等结果来自默认模拟配置，不能外推为通用阈值。
- 文章没有验证 PIPS 对真实 AI/Agent 基准的预测准确性。
- 本页不授权修改 Hermes skill、评测门禁、runtime、cron、MCP、memory 或默认工作流。

## Relations

- refines: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- related: [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification)
- related: [agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration)

## Related

- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification)
- [agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration)
- `towardsdatascience-statistical-power-more-problems-2026-08-04`

