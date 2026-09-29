---
title: LLM Summary Identification Step
created: 2026-05-16
updated: 2026-05-17
type: concept
tags:
  - llm
  - workflow
  - validation
  - risk-control
  - architecture
sources:
  - raw/articles/towardsdatascience-llm-summarizers-identification-step-2026-05-10.md
status: stable
description: 说明摘要任务前先识别文档类型、意图和证据边界的必要步骤。
aliases:
  - summary-identification
---

# LLM Summary Identification Step

## Summary
LLM 摘要的核心风险不是“写得不够好”，而是把来源中没有被识别和支撑的内容包装成确定结论。可靠摘要应先判断原始材料能支持哪些 claim，再生成结构化输出；审查阶段应只能削弱、删除或标记证据不足，不能补写更顺滑的新内容。

这页编译自 `towardsdatascience-llm-summarizers-identification-step-2026-05-10`，并与 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)、[agent-self-validation-loops](/concepts/agent-self-validation-loops) 和 [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles) 衔接。

## Core principle
不要先生成完整摘要，再事后找证据。

更可靠的顺序是：
1. 识别来源能支撑什么。
2. 只生成带证据类型和证据指针的 claim。
3. 审查时只允许让 claim 变弱、变少或显式留白。
4. 最终渲染时保留“不知道 / 未提及 / 证据不足”。

该原则来自因果推断中的区分：
- identification：现有数据是否能支撑想要声明的结论。
- estimation：在已经证明可识别后，再计算或生成结果。

LLM 摘要常见失败是跳过 identification，直接 estimation：模板需要“决策、行动项、风险、开放问题”，模型就填满这些栏目，即使原文没有足够证据。

## Claim support categories
每条摘要 claim 应至少落入以下类别之一：

### 1. Observed
原文直接支持的事实。

要求：
- 能指向具体原文片段。
- 不超出来源字面含义。
- 不把模糊表达包装成确定承诺。

### 2. Inferred
基于原文和显式假设得到的推断。

要求：
- 标明这是推断，不是原文直述。
- 说明连接证据和结论的假设。
- 允许读者质疑该假设是否合理。

### 3. Recommendation
模型或系统给出的建议。

要求：
- 明确标为建议。
- 不写成参与者已经决定或承诺的事项。
- 不和原文事实混在同一 claim 里。

### 4. Insufficient evidence
如果 claim 不能放入上述类别，正确输出不是更圆滑的说法，而是无 claim 或“证据不足”。

## Architecture pattern
推荐用于摘要、会议纪要、客服分析、代码审查总结、医疗/法律文档摘要等来源约束型工作流。

### 1. Conservative extraction
先从来源中保守提取结构化事实：
- speaker turns / 段落 / 引文位置。
- 明确承诺。
- 明确决策。
- 明确数字。
- 明确风险或问题。

提取层允许漏掉内容，但不允许编造。

### 2. Claim synthesis with evidence pointers
合成层可以组织信息，但每条 claim 必须携带：
- support category。
- evidence pointer。
- assumption（仅 inferred 需要）。
- target section。

合成层是最容易漂移的一层，因此不能直接作为最终输出。

### 3. Monotonic weakening audit
审查层只能做减法或降级，不能“帮忙写得更好”。

允许操作：
- 删除 claim。
- 从 observed 降级为 inferred。
- 从 inferred 降级为 recommendation。
- 移动到更合适的 section。
- 替换为 insufficient-evidence placeholder。
- 折叠没有 surviving claim 的 section。

禁止操作：
- 增加新 claim。
- 强化 claim 语气。
- 补充缺失上下文。
- 为了完整性填满模板栏目。
- 把证据不足改写成看似合理的推断。

### 4. Deterministic rendering
最终渲染层只负责把已审计对象转成文本，不再调用模型自由生成核心事实。

## Design rule: honest emptiness
“空白”不是低质量信号；在来源很薄时，空白是质量信号。

如果一段五分钟对话没有明确行动项，摘要就应该显示没有行动项，而不是为了满足模板生成三个行动项。诚实留白把发现信息缺失的成本前置，避免用户后续基于伪完整摘要行动。

## Directional observations from the source
以下数字只作为作者 fixture 的现象，不作为通用阈值：

- 作者用 3 个会议记录 fixture 测试该架构。
- 结果中出现 0 个伪造承诺和 0 个无根据数量。
- 留白率随输入信号变薄升高：约 17% → 25% → 58%。

这些结果只能说明该设计在小样本中产生了预期的保守行为，不能证明它普遍优于其他摘要系统。

## Hermes / gsummary mapping
### Prompt rule
摘要任务可以要求每条关键结论标注：
- `[原文直述]`
- `[推断]`
- `[建议]`
- `[证据不足]`

### Workflow rule
不要要求模型“必须输出 3 个核心观点 / 5 个行动项”。更好的要求是：
- 如果原文没有明确支持，输出“未提及”。
- 如果只是弱推断，必须标为推断。
- 如果是模型建议，不能写成作者或会议参与者的决定。

### Review-agent rule
审查 agent 或审查阶段只负责：
- 查证。
- 降级。
- 删除。
- 标注证据不足。

它不负责润色、不负责补洞、不负责把结构补完整。

### Wiki / skill routing
- 作为 wiki concept：保存长期设计原则。
- 作为 skill 候选：如果后续多次用于 gsummary 或会议纪要流程，可把“claim support categories + monotonic audit”沉淀进对应 summary skill/reference。
- 不应直接把本文的小样本数字升级为 Hermes 的强制质量阈值。

## Relationship to existing concepts
- `[[production-ai-agent-evaluation-framework]]` 关注生产 AI Agent 要评估哪些层；本页补充“生成前先识别 claim 是否可被来源支撑”。
- `[[agent-self-validation-loops]]` 关注 agent 如何用反馈闭环验证任务结果；本页补充摘要/分析类任务中“证据类型”这个验证对象。
- `[[hermes-ai-workflow-formalization-principles]]` 关注将自然语言意图压缩为形式化产物；本页把摘要也形式化为带证据标签的 claim objects。
- `[[wiki-ingestion-workflow]]` 可使用本页原则来判断外部文章摘要是否应保留证据等级和来源限制。

## Practical checklist
用于设计摘要或来源分析工作流时：

1. 是否允许输出“未提及 / 证据不足”？
2. 每条关键 claim 是否有来源位置或证据片段？
3. 推断是否显式声明了假设？
4. 建议是否和事实分开？
5. 审查阶段是否被禁止新增或强化 claim？
6. 模板是否会诱导模型填满不存在的栏目？
7. 最终输出是否保留来源限制，而不是只给流畅结论？

## Relationship to LLM engineering map

`[[llm-engineering-knowledge-map]]` describes evaluation and grounding as system layers. This page is the narrower pattern for summary tasks: convert source-backed outputs into claim objects before rendering fluent prose.

## Related
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`

