---
title: Software Engineering Laws — Planning
created: 2026-08-10
updated: 2026-08-10
type: concept
tags:
  - research
  - architecture
  - decision
sources:
  - raw/articles/laws-of-software-engineering/index.md
  - raw/articles/laws-of-software-engineering/gilbs-law.md
  - raw/articles/laws-of-software-engineering/goodharts-law.md
  - raw/articles/laws-of-software-engineering/hofstadters-law.md
  - raw/articles/laws-of-software-engineering/ninety-ninety-rule.md
  - raw/articles/laws-of-software-engineering/parkinsons-law.md
  - raw/articles/laws-of-software-engineering/premature-optimization.md
status: stable
description: 用于检索软件工程规划中关于度量、估算、期限、收尾成本与优化时机的经验法则。
aliases:
  - software-engineering-laws-planning
---

# Software Engineering Laws — Planning

## Summary

本页汇总六条与规划有关的软件工程经验法则，覆盖如何建立并约束度量、理解估算偏差、安排项目收尾、设置现实期限，以及决定何时投入性能优化。它们主要用于形成评审问题和校准判断，不是具有普遍保证的科学定律或强制流程。

## 使用边界

- 来源将这些条目主要定位为经验法则，不同条目的证据强度并不一致。
- 法则中的数字、递归表述和绝对措辞常用于强调风险，不应直接解释为精确预测。
- 应结合项目历史数据、当前约束和定性判断使用，不能由单一指标或法则替代具体分析。
- 本页是类别级检索入口；原始条目索引见 [来源总索引](../../raw/articles/laws-of-software-engineering/index.md)，跨类别决策入口见 [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)。

## 法则记录

### Gilb's Law

- **ID**：lse-gilbs-law
- **原陈述**：Anything you need to quantify can be measured in some way better than not measuring it.
- **核心机制**：即使只能得到近似或间接指标，测量仍能提供客观反馈、趋势线索和改进起点；可从基础指标开始，再根据局限持续修正。其重点不是宣称代理指标完整，而是避免因测量困难而保持完全不可见。
- **适用与评审问题**：[综合] 对性能、客户满意度或可维护性等重要目标，团队是否至少建立了可解释的代理指标？是否明确指标的局限，并安排了根据反馈逐步修正指标的方式？
- **误用与限制**：代理指标只能呈现局部情况；一旦把指标直接变成目标，可能产生 Goodhart's Law 所描述的行为扭曲。来源未系统给出反例。
- **来源**：`gilbs-law`；[canonical URL](https://lawsofsoftwareengineering.com/laws/gilbs-law/)

### Goodhart's Law

- **ID**：lse-goodharts-law
- **原陈述**：When a measure becomes a target, it ceases to be a good measure.
- **核心机制**：指标通常只是生产力、质量等目标的代理。一旦它成为考核目标，人们会优化指标本身，即使这种优化损害原始意图；例如以关闭工单数为目标，可能诱发拆分或过早关闭工单。
- **适用与评审问题**：[综合] 当前指标是在辅助观察，还是已经成为需要被直接完成的目标？团队是否结合多个指标、业务上下文与定性判断，检查数字改善是否对应真实结果改善？
- **误用与限制**：该法则并不否定度量本身；来源明确认为指标仍可用于洞察，但不宜脱离上下文或被单独用于驱动行为。来源未系统给出反例。
- **来源**：`goodharts-law`；[canonical URL](https://lawsofsoftwareengineering.com/laws/goodharts-law/)

### Hofstadter's Law

- **ID**：lse-hofstadters-law
- **原陈述**：It always takes longer than you expect, even when you take into account Hofstadter's Law.
- **核心机制**：复杂、创造性的工作会在实施中暴露隐藏任务、集成问题和需求变化，因此人们即使知道自己容易低估，仍可能低估工期。历史数据和缓冲能够改善规划，但无法消除未知因素。
- **适用与评审问题**：[综合] 估算是否显式考虑隐藏任务、集成风险和需求变化？时间表是否参考历史数据并保留应急空间，同时向相关方说明延误仍可能发生？
- **误用与限制**：递归措辞强调估算的不确定性，并不提供固定延期倍数；过度增加缓冲还可能与 Parkinson's Law 所描述的时间膨胀相互作用。来源未系统给出反例。
- **来源**：`hofstadters-law`；[canonical URL](https://lawsofsoftwareengineering.com/laws/hofstadters-law/)

### The Ninety-Ninety Rule

- **ID**：lse-ninety-ninety-rule
- **原陈述**：The first 90% of the code accounts for the first 90% of development time; the remaining 10% accounts for the other 90%.
- **核心机制**：核心功能快速成形容易制造“接近完成”的乐观感，但集成、边界情况、性能调优和缺陷修复可能消耗与前期开发相当甚至更多的时间。因此，“大部分功能已完成”不能直接推导出“大部分交付工作已完成”。
- **适用与评审问题**：[综合] 项目进度是否把集成测试、边界情况、性能、缺陷修复和交付准备作为真实工作估算？“90% 完成”的判断依据是功能数量，还是剩余风险与工作量？
- **误用与限制**：“90% + 90%”是用于凸显尾部工作被低估的修辞，不是要求采用 180% 的固定估算系数。来源未系统给出反例。
- **来源**：`ninety-ninety-rule`；[canonical URL](https://lawsofsoftwareengineering.com/laws/ninety-ninety-rule/)

### Parkinson's Law

- **ID**：lse-parkinsons-law
- **原陈述**：Work expands to fill the time available for its completion.
- **核心机制**：过宽的期限可能使工作放慢、推迟启动，或吸收并非交付所必需的打磨和细节争论。清晰、现实的时间限制与时间盒能够集中注意力，但期限仍需顾及工作的真实复杂度。
- **适用与评审问题**：[综合] 当前期限是否宽松到会容纳拖延、非必要打磨或细节争论？能否用清晰且现实的时间盒聚焦必要成果，同时避免把期限压缩到持续延期或团队耗竭？
- **误用与限制**：该法则不能用来证明期限越短越好；来源明确要求谨慎使用，并与现实排期及 Hofstadter's Law 所揭示的低估风险平衡。来源未系统给出反例。
- **来源**：`parkinsons-law`；[canonical URL](https://lawsofsoftwareengineering.com/laws/parkinsons-law/)

### Premature Optimization (Knuth's Optimization Principle)

- **ID**：lse-premature-optimization
- **原陈述**：Premature optimization is the root of all evil.
- **核心机制**：性能优化通常以复杂度、可读性和可维护性为代价，而多数代码并非性能热点。先实现清晰、正确的设计，再通过测量和剖析定位真正瓶颈，可以把复杂度成本限制在确有收益的位置。
- **适用与评审问题**：[综合] 当前优化是否由测量或剖析确认的瓶颈驱动？若尚未确认，简单实现是否已经满足实际数据规模和性能要求？优化带来的复杂度是否与可验证收益相称？
- **误用与限制**：原陈述是强调性表述，不意味着拒绝所有早期性能考虑；来源保留了应把握真正关键优化机会的限定。关于大部分代码与少数热点的数字是来源中的经验性表达，不应作为项目的固定比例。
- **来源**：`premature-optimization`；[canonical URL](https://lawsofsoftwareengineering.com/laws/premature-optimization/)

## 类别内关系

- [综合] Gilb's Law 鼓励建立可迭代的度量，Goodhart's Law 则约束指标被直接目标化；二者共同支持“先获得反馈，再持续检查代理指标是否扭曲行为”的度量策略。`supporting_ids: [lse-gilbs-law, lse-goodharts-law]`
- [综合] Hofstadter's Law 提醒规划者为未知因素保留空间，Parkinson's Law 提醒过宽空间可能被工作消耗；二者共同要求期限既考虑不确定性，也保持明确和现实。`supporting_ids: [lse-hofstadters-law, lse-parkinsons-law]`
- [综合] The Ninety-Ninety Rule 将 Hofstadter's Law 的估算偏差具体化到项目尾部，指出“基本可用”之后的集成、边界情况和修复仍需显著投入。`supporting_ids: [lse-hofstadters-law, lse-ninety-ninety-rule]`
- [综合] The Ninety-Ninety Rule 与 Parkinson's Law 都影响时间安排：前者要求为收尾保留真实工作量，后者要求这些时间有清晰边界，避免被非必要工作填满。`supporting_ids: [lse-ninety-ninety-rule, lse-parkinsons-law]`
- [综合] Premature Optimization 与 Hofstadter's Law 的来源关系提示：未经测量的提前优化既增加复杂度，也可能成为估算中未被正确识别的额外工作。`supporting_ids: [lse-premature-optimization, lse-hofstadters-law]`

## 使用方法

1. 先明确规划对象：度量体系、交付估算、期限设置、收尾阶段或性能优化。
2. 选择对应法则提出评审问题，不把法则本身当作结论。
3. 用项目历史数据、当前测量和定性证据校准判断。
4. 同时检查互补风险，例如“没有指标”与“指标目标化”、缓冲不足与期限过宽。
5. 将最终决策及其证据记录到 [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map) 所对应的决策上下文中。

## Relations

- refines: [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)
- related: [llm-engineering-knowledge-map](/concepts/llm-engineering-knowledge-map)

