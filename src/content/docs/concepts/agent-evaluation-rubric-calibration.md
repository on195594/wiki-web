---
title: Agent Evaluation Rubric Calibration
created: 2026-07-31
updated: 2026-11-05
type: concept
tags:
  - agent
  - evaluation
  - validation
  - harness
  - workflow
sources:
  - raw/articles/langchain-similarweb-long-form-agent-report-evaluation-2026-07-29.md
  - raw/articles/motherduck-jev-analytics-use-cases-2026-10-06.md
  - raw/articles/langchain-human-insight-strategic-advantage-agents.md
status: stable
description: 说明如何为开放式 Agent 输出选择、诊断和校准评测 Rubric，并把有上下文和理由的专家反馈转化为可复用评估数据。
aliases:
  - rubric-calibration
  - evaluator-calibration
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Agent Evaluation Rubric Calibration

## Summary

Agent 评测器本身也是需要调试的测量系统。聚合分数只能指出“哪里可能变化”，不能单独证明真实回归；当分数、逐项评语、人工复核或 Trace 互相冲突时，应先校准 Rubric，再修改 Agent。

本页提炼自 [langchain-similarweb-long-form-agent-report-evaluation-2026-07-29](https://github.com/on195594/wiki/blob/83e0850981a043bc16535b828e1f9e4aabfad5a7/raw/articles/langchain-similarweb-long-form-agent-report-evaluation-2026-07-29.md)，并与 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 和 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation) 衔接。

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

这与 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation) 的失败信号 → 证据 → 根因 → 最小修复闭环相接：评分异常只是失败信号，逐例评语、Trace、确定性检查和人工复核才是定位根因的证据。

## Audit the ruler before changing the Agent

出现以下任一信号时，应暂停仅依据该分数做发布或回滚决定，并先审计 Rubric：

- 聚合分数与逐例人工复核持续冲突；
- evaluator 评语指出明显缺陷，但对应分数仍然较高；
- 两个维度奖励相反行为，例如“来源广度”奖励数量，而“归因精度”惩罚模糊来源；
- “简洁度”权重压过“完整性”，导致需要方法、限制和上下文的战略报告被错误缩短；
- 调整 Agent 后只有总分变化，却无法从具体 Case、分项评语或 Trace 解释变化原因。

## Efficiency rubric must respect the execution contract

[motherduck-jev-analytics-use-cases-2026-10-06](https://github.com/on195594/wiki/blob/83e0850981a043bc16535b828e1f9e4aabfad5a7/raw/articles/motherduck-jev-analytics-use-cases-2026-10-06.md) 的工具效率评估明列“不计浪费”的产品动作：首次使用前各读一次指南、保存后立即查看结果、每次异步运行后等待一次；失败调用后一次纠正重试也不计浪费。它同时展示效率评分与主要浪费标签不一致的轮次，将其作为回查信号，而不是用任一标签自动裁定根因。

**[推论]** 将此方法迁移到其他 Agent 时，先明确其实际执行契约，再评价可省步骤：

- 必要的授权、前置读取与结果核验不应因增加调用而被惩罚；不能用“少调用”奖励跳过验证。
- 一次合理纠正重试与无新证据的重复失败应分开评价；案例的免罚清单与重试次数不作为通用豁免。
- 调用计数由确定性轨迹分析产生；是否必要仍需结合用户目标、依赖顺序与当时可见证据判断。
- 用“省略必要核验但调用更少”和“保留核验且完成任务”的相邻反例检查错误激励；分项标签冲突时回查 Trace，不直接修改 Agent。

条件性诊断的流程由 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 维护。本例只提供 Rubric 设计方法，未证明 judge 准确性或省略步骤的安全性，也不授权更改任何执行规则。

## Turn expert review into reusable evaluation data

[langchain-human-insight-strategic-advantage-agents](https://github.com/on195594/wiki/blob/83e0850981a043bc16535b828e1f9e4aabfad5a7/raw/articles/langchain-human-insight-strategic-advantage-agents.md) 提出三个原则：专家定义特定任务中的质量标准；审查上下文应支持该判断；将专家判断转化为可复用评估数据。文章展示的标注包含评分及其理由，既可暴露 Agent 的问题，也可指出 evaluator 奖励了错误行为或 Rubric 存在空白。

- **审查相关会话与工具结果，而不只看最终答案。** 原文建议以完整会话作为多轮 Agent 的审查单元；其 Fetch Rewards 案例也说明，单轮输入输出只是起点，还需核对真实工具调用、商品规格和该用户实际可用的优惠。流畅或局部正确不等于符合用户意图。
- **保存理由与未确定事项，不只保存分数。** 把标签绑定到对应交互，并记录核对了什么、哪项证据支撑评分、哪里仍有歧义，以及什么行为才算合格；不把“未通过”直接当成根因。
- **用人工与自动评分的分歧校准评测器。** 原文给出对齐 LLM judge、修正反复漏检的在线 evaluator、将高质量人工标注样本纳入 golden dataset 的路径。更新后的评测仍需在相应交互或后续数据上核对，不能仅凭标签增加就声称 Agent 改善。
- **把核验后的代表性案例变成可复用参照。** 后续 Agent 或提示词变动时，用这些案例做离线比较，而不是每次从零询问专家。如何修复具体失败及选择回归工件，继续由 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation) 维护，不另建一套闭环。

**[推论]** 将此方法迁移到其他工作流时，审查范围应覆盖足以解释该错误的用户目标、会话和工具证据，不等于对每个任务固定安排完整人工审查。人工与 judge 不一致时，先区分 Agent 行为、工具/数据结果与评分标准的问题；专家标注是有适用范围、可能存在分歧的参照，不是无需核验的客观真值。上述方法不要求采用 LangSmith 或默认新增标注平台、人工门禁或自动评测任务。

## Calibration loop

1. 明确当前改动假设和预期改善的质量维度。
2. 先运行小规模评估，定位发生变化的 Case。
3. 检查分项得分、评语、忠实度结果和 Trace，而不是只看平均分。
4. 审计维度是否重复、冲突或产生错误激励。
5. 将评分锚点改写为真正需要的行为。例如，与其奖励来源数量，不如奖励“具名、相关、可验证，并绑定具体论断”的来源。
6. 用同一批 Case 重跑并与已接受基线比较，确认分数和评语对齐后，再决定合并、迭代或回滚。

## Evidence boundary

Similarweb 案例来自单一内部工作流，文章没有公开 Benchmark 数据集、统计不确定性、跨模型对照实验或可泛化的权重配置。因此应保留“评测器本身需要校准”的方法论，不把 Similarweb 的具体 Rubric、分数锚点或 LangSmith 产品依赖直接设为 AI Agent 默认规则。

Human insight 文章是围绕 LangSmith 功能和一个客户案例的厂商方法说明，没有提供人工审查成本、效果提升或专家一致性的量化对照；它支持上述方法线索，不足以证明人工审查必然优于自动评估、已提升通过率或在所有业务中划算。

## AI Agent mapping

- Wiki：本页保存评测尺失准的概念、诊断信号和校准步骤。
- Project/evaluator：只有真实评测出现分数与证据冲突时，才在所属项目按原 Case 加一个相邻反向 Case 做有界校准。
- Active workflow：本页不授权修改 AI Agent skills、memory、runtime、cron、MCP、gateway、wrapper 或 provider 路由。

## Relations

- refines: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- depends_on: [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation)

