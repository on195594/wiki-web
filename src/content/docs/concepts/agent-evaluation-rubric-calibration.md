---
title: Agent Evaluation Rubric Calibration
created: 2026-07-31
updated: 2026-09-29
type: concept
tags:
  - agent
  - evaluation
  - validation
  - harness
  - workflow
sources:
  - raw/articles/langchain-similarweb-long-form-agent-report-evaluation-2026-07-29.md
status: stable
description: 说明如何为开放式 Agent 输出选择、诊断和校准评测 Rubric，避免聚合分数把正常改进误判为回归。
aliases:
  - rubric-calibration
  - evaluator-calibration
---

# Agent Evaluation Rubric Calibration

## Summary

Agent 评测器本身也是需要调试的测量系统。聚合分数只能指出“哪里可能变化”，不能单独证明真实回归；当分数、逐项评语、人工复核或 Trace 互相冲突时，应先校准 Rubric，再修改 Agent。

本页提炼自 `[[langchain-similarweb-long-form-agent-report-evaluation-2026-07-29]]`，并与 `[[production-ai-agent-evaluation-framework]]` 和 `[[agent-failure-closed-loop-evaluation]]` 衔接。

## Match the evaluator to the output shape

- 答案形状明确的普通问答，可以组合确定性工具/结构检查与基于 Golden Answer 的语义等价判断。
- 开放式长篇报告不存在唯一正确文本，应按来源整合、忠实度、论证质量、完整性等维度分别设置带锚点的 Rubric，并与已接受基线做 A/B 比较。
- 基线是比较参照，不是 Ground Truth；新旧报告可以采用不同但同样有效的分析路径。

## Treat the score as a diagnostic pointer

一次可信诊断至少应能下钻到：

1. 哪些 Case 发生变化；
2. 哪些评分维度发生变化；
3. evaluator 的评语如何解释该分数；
4. 来源忠实度检查发现了什么；
5. Trace 中的工具选择、检索和合成行为发生了什么。

这与 `[[agent-failure-closed-loop-evaluation]]` 的失败信号 → 证据 → 根因 → 最小修复闭环相接：评分异常只是失败信号，逐例评语、Trace、确定性检查和人工复核才是定位根因的证据。

## Audit the ruler before changing the Agent

出现以下任一信号时，应暂停仅依据该分数做发布或回滚决定，并先审计 Rubric：

- 聚合分数与逐例人工复核持续冲突；
- evaluator 评语指出明显缺陷，但对应分数仍然较高；
- 两个维度奖励相反行为，例如“来源广度”奖励数量，而“归因精度”惩罚模糊来源；
- “简洁度”权重压过“完整性”，导致需要方法、限制和上下文的战略报告被错误缩短；
- 调整 Agent 后只有总分变化，却无法从具体 Case、分项评语或 Trace 解释变化原因。

## Calibration loop

1. 明确当前改动假设和预期改善的质量维度。
2. 先运行小规模评估，定位发生变化的 Case。
3. 检查分项得分、评语、忠实度结果和 Trace，而不是只看平均分。
4. 审计维度是否重复、冲突或产生错误激励。
5. 将评分锚点改写为真正需要的行为。例如，与其奖励来源数量，不如奖励“具名、相关、可验证，并绑定具体论断”的来源。
6. 用同一批 Case 重跑并与已接受基线比较，确认分数和评语对齐后，再决定合并、迭代或回滚。

## Evidence boundary

Similarweb 案例来自单一内部工作流，文章没有公开 Benchmark 数据集、统计不确定性、跨模型对照实验或可泛化的权重配置。因此应保留“评测器本身需要校准”的方法论，不把 Similarweb 的具体 Rubric、分数锚点或 LangSmith 产品依赖直接设为 AI Agent 默认规则。

## AI Agent mapping

- Wiki：本页保存评测尺失准的概念、诊断信号和校准步骤。
- Project/evaluator：只有真实评测出现分数与证据冲突时，才在所属项目按原 Case 加一个相邻反向 Case 做有界校准。
- Active workflow：本页不授权修改 AI Agent skills、memory、runtime、cron、MCP、gateway、wrapper 或 provider 路由。

## Relations

- refines: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- depends_on: [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation)
- depends_on: `langchain-similarweb-long-form-agent-report-evaluation-2026-07-29`

## Related

- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation)
- `langchain-similarweb-long-form-agent-report-evaluation-2026-07-29`

