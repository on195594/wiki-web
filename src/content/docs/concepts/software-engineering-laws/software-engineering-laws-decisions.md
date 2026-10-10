---
title: Software Engineering Laws — Decisions
created: 2026-08-10
updated: 2026-09-21
type: concept
tags:
  - research
  - architecture
  - decision
sources:
  - raw/articles/laws-of-software-engineering/index.md
  - raw/articles/laws-of-software-engineering/confirmation-bias.md
  - raw/articles/laws-of-software-engineering/cunninghams-law.md
  - raw/articles/laws-of-software-engineering/dunning-kruger-effect.md
  - raw/articles/laws-of-software-engineering/first-principles-thinking.md
  - raw/articles/laws-of-software-engineering/hanlons-razor.md
  - raw/articles/laws-of-software-engineering/hype-cycle-amaras-law.md
  - raw/articles/laws-of-software-engineering/inversion.md
  - raw/articles/laws-of-software-engineering/lindy-effect.md
  - raw/articles/laws-of-software-engineering/map-is-not-the-territory.md
  - raw/articles/laws-of-software-engineering/occams-razor.md
  - raw/articles/laws-of-software-engineering/pareto-principle.md
  - raw/articles/laws-of-software-engineering/sunk-cost-fallacy.md
status: stable
description: 汇总软件工程决策类经验法则，供方案评审、风险检查与技术选择时检索。
aliases:
  - software-engineering-laws-decisions
---

# Software Engineering Laws — Decisions

## Summary

本页整理 [来源总索引](../../raw/articles/laws-of-software-engineering/index.md) 中 12 条与判断偏差、问题分析、技术选择和资源配置有关的经验法则，并将其转化为可在 [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map) 中检索的评审问题。

## 使用边界

这些条目主要是经验法则、认知模型或观察，并非法律或普遍成立的科学定律，证据强度因条目而异。使用时应结合当前系统的运行证据、约束和风险，不应以法则名称替代验证，也不应把启发式建议写成强制规则。

## 法则记录

### Confirmation Bias

- **ID**：lse-confirmation-bias
- **原陈述**：A tendency to favor information that supports our existing beliefs or ideas.
- **核心机制**：形成初步判断后，人会更注意支持该判断的信息而忽略反证；在调试、评审和技术选型中，可主动寻找替代解释、引入不同意见，并用测试、性能标准或实验校正判断。
- **适用与评审问题**：[综合] 当前调查是否只验证了最初假设？如果该假设错误，预期会观察到什么？是否检查了其他模块、边界输入和反对方案，并使用客观证据比较？
- **误用与限制**：意识到偏差不能自动消除偏差；来源建议以反证问题、不同意见和客观标准缓解，但未声称这些方法能够保证无偏判断。
- **来源**：`confirmation-bias`；[canonical URL](https://lawsofsoftwareengineering.com/laws/confirmation-bias/)

### Cunningham's Law

- **ID**：lse-cunninghams-law
- **原陈述**：The best way to get the correct answer on the Internet is not to ask a question, it's to post the wrong answer.
- **核心机制**：具体断言、草稿或原型比抽象提问更容易引发纠正和讨论，因此可用一个可评审的初始答案推动知识反馈。
- **适用与评审问题**：[综合] 当前问题是否因过于抽象而缺少反馈？能否提交一个明确标为草稿的方案或原型，让参与者针对具体内容纠正和改进？
- **误用与限制**：该观察依赖他人愿意参与纠正，不能保证获得回应或正确答案；来源未系统给出反例。
- **来源**：`cunninghams-law`；[canonical URL](https://lawsofsoftwareengineering.com/laws/cunninghams-law/)

### Dunning-Kruger Effect

- **ID**：lse-dunning-kruger-effect
- **原陈述**：The less you know about something, the more confident you tend to be.
- **核心机制**：领域知识不足时，人也缺少准确评估自身能力所需的知识，容易高估理解程度；随着未知复杂性被发现，信心可能先下降，再随经验和基础理解而恢复。
- **适用与评审问题**：[综合] 当前信心是否有领域经验、验证结果和同伴评审支撑？估算是否表达了范围、权衡、概率以及尚未识别的未知因素？
- **误用与限制**：原始研究关注相对同伴的自我排名；来源明确指出，流行的“信心峰值曲线”是后来的简化，不能据此断言低表现者必然比专家更自信。
- **来源**：`dunning-kruger-effect`；[canonical URL](https://lawsofsoftwareengineering.com/laws/dunning-kruger-effect/)

### First Principles Thinking

- **ID**：lse-first-principles-thinking
- **中文别名**：第一性原理
- **原陈述**：Breaking a complex problem into its most basic blocks and then building up from there.
- **核心机制**：把复杂问题拆成基础需求、固有组成和真实约束，区分事实与沿袭的假设，再从这些基础重新构造方案，而不是直接复制既有实现或估算。
- **适用与评审问题**：[综合] 我们真正要实现的目标是什么？哪些条件是硬约束，哪些只是惯例或类比？从基本工作项重新估算后，既有框架或方案仍然必要吗？
- **误用与限制**：来源明确指出这种思考耗费心力且并非总有必要；许多问题已有成熟模式，不应为了从零推导而忽略可复用的可靠方案。
- **来源**：`first-principles-thinking`；[canonical URL](https://lawsofsoftwareengineering.com/laws/first-principles-thinking/)

### Hanlon's Razor

- **ID**：lse-hanlons-razor
- **原陈述**：Never attribute to malice that which is adequately explained by stupidity or carelessness.
- **核心机制**：面对故障或有问题的代码时，先检查错误、误解、疏忽和配置遗漏等普通原因，以问题和证据替代未经验证的恶意归因。
- **适用与评审问题**：[综合] 在推断攻击、破坏或恶意行为前，是否已检查误配置、拼写错误、认知缺口和流程疏漏？对同事的反馈是否以调查问题而非指控开始？
- **误用与限制**：来源明确说明该法则不意味着忽视确有依据的恶意可能；安全分析仍须考虑恶意行为者。
- **来源**：`hanlons-razor`；[canonical URL](https://lawsofsoftwareengineering.com/laws/hanlons-razor/)

### The Hype Cycle & Amara's Law

- **ID**：lse-hype-cycle-amaras-law
- **原陈述**：We tend to overestimate the effect of a technology in the short run and underestimate the impact in the long run.
- **核心机制**：新技术早期容易承载过高的短期期待，现实落差随后带来失望；部分技术会在降温后逐步成熟并形成长期价值，因此采用决策应依据已验证的问题适配性。
- **适用与评审问题**：[综合] 当前收益预期来自实际证据还是市场热度？该技术是否解决了明确问题？团队能否以稳定技术覆盖大多数需求，并把有限的创新预算用于可验证的差异价值？
- **误用与限制**：来源只说明部分技术会在现实检验后成熟，并未断言所有经历炒作的技术最终都会产生长期价值。
- **来源**：`hype-cycle-amaras-law`；[canonical URL](https://lawsofsoftwareengineering.com/laws/hype-cycle-amaras-law/)

### Inversion

- **ID**：lse-inversion
- **原陈述**：Solving a problem by considering the opposite outcome and working backward from it.
- **核心机制**：从目标的相反结果或系统失败状态反向推导原因，可暴露乐观规划遗漏的风险；预演失败、最坏情况和滥用方式，有助于形成防御性设计。
- **适用与评审问题**：[综合] 如果项目延期、系统失效或接口被滥用，最可能由什么造成？预演失败后发现的风险，是否需要通过验证、限流、重试、故障转移或其他针对性措施处理？
- **误用与限制**：来源将反演作为发现风险的方法，但未声称所有想象出的失败都应转化为功能；来源未系统给出反例。
- **来源**：`inversion`；[canonical URL](https://lawsofsoftwareengineering.com/laws/inversion/)

### The Lindy Effect

- **ID**：lse-lindy-effect
- **原陈述**：The longer something has been in use, the more likely it is to continue being used.
- **核心机制**：时间会淘汰一部分脆弱或缺乏价值的技术与观念，因此长期存续可作为未来继续存续的启发式信号，并支持优先投资基础能力和经受时间检验的技术。
- **适用与评审问题**：[综合] 候选技术是否已有足够长的实际使用记录？其基础概念、协议或技能是否比短期流行框架更可能持续？选择新方案的收益是否足以抵消成熟度差异？
- **误用与限制**：长期存续只是倾向性信号，不是质量或未来存续的保证；来源未系统给出反例。
- **来源**：`lindy-effect`；[canonical URL](https://lawsofsoftwareengineering.com/laws/lindy-effect/)

### The Map Is Not the Territory

- **ID**：lse-map-is-not-the-territory
- **原陈述**：Our representations of reality are not the same as reality itself.
- **核心机制**：需求文档、架构图、性能模型和个人理解都是现实的抽象；它们有助于规划，却可能遗漏运行环境、延迟、数据分布等真实因素，因此必须随实现和测试证据修正。
- **适用与评审问题**：[综合] 方案依赖了哪些尚未验证的模型假设？运行系统是否已出现与文档、架构图或容量估算相矛盾的证据？发现新情况后是否更新了决策？
- **误用与限制**：来源并不否定模型和设计的价值，而是要求认识其边界；不能因模型不完整而放弃必要的规划与抽象。
- **来源**：`map-is-not-the-territory`；[canonical URL](https://lawsofsoftwareengineering.com/laws/map-is-not-the-territory/)

### Occam's Razor

- **ID**：lse-occams-razor
- **原陈述**：The simplest explanation is often the most accurate one.
- **核心机制**：当多个解释或方案都能覆盖目标时，优先检查或选择不必要假设和组件更少者，以减少理解、维护、调试、集成与协调成本。
- **适用与评审问题**：[综合] 是否存在满足同一目标但组件、数据库、服务或假设更少的方案？调试时是否先验证了拼写、配置和其他简单原因？
- **误用与限制**：“最简单”是优先考虑而非正确性保证；来源使用“often”而非绝对表述，不能据此删除实现目标所必需的复杂性。
- **来源**：`occams-razor`；[canonical URL](https://lawsofsoftwareengineering.com/laws/occams-razor/)

### Pareto Principle (80/20 Rule)

- **ID**：lse-pareto-principle
- **原陈述**：80% of the problems result from 20% of the causes.
- **核心机制**：影响通常分布不均，少量功能、缺陷、代码热点或任务可能贡献大部分使用量、故障、耗时或价值；应通过分析、剖析和数据收集识别高影响部分并优先投入。
- **适用与评审问题**：[综合] 当前资源是否平均分配给了影响不同的事项？哪些功能、缺陷或代码路径贡献了大部分使用量、崩溃、耗时或价值？这一集中度是否有数据支持？
- **误用与限制**：来源明确说明比例不一定恰好是 80/20；它是观察和优先级启发，实际不均衡程度应由数据验证。
- **来源**：`pareto-principle`；[canonical URL](https://lawsofsoftwareengineering.com/laws/pareto-principle/)

### Sunk Cost Fallacy

- **ID**：lse-sunk-cost-fallacy
- **原陈述**：Sticking with a choice because you've invested time or energy in it, even when walking away helps you.
- **核心机制**：已经投入且无法收回的时间、金钱和精力会扭曲后续判断，使团队仅因“已经走了这么远”而继续低价值项目；决策应转向当前事实、未来成本和预期收益。
- **适用与评审问题**：[综合] 如果忽略既有投入，仅比较从现在开始的成本与收益，我们仍会继续该方案吗？是否预先设置了可衡量的复评或终止节点？
- **误用与限制**：该法则针对“仅因过去投入而继续”的理由，不表示已有方案都应放弃；是否转向仍须依据未来成本、收益和当前证据。
- **来源**：`sunk-cost-fallacy`；[canonical URL](https://lawsofsoftwareengineering.com/laws/sunk-cost-fallacy/)

## 类别内关系

- [综合] **校准判断**：Confirmation Bias 要求主动寻找反证，Dunning-Kruger Effect 要求用证据校准信心，Hanlon's Razor 要求先检验普通原因；三者共同减少未经验证的归因。`supporting_ids: [lse-confirmation-bias, lse-dunning-kruger-effect, lse-hanlons-razor]`
- [综合] **从问题到候选方案**：First Principles Thinking 从基础约束重构问题，Inversion 从失败结果反推风险，Occam's Razor 在可行解释或方案间优先较少假设者；来源将 Inversion 与 First Principles Thinking、Hanlon's Razor 与 Occam's Razor 声明为相关。`supporting_ids: [lse-first-principles-thinking, lse-inversion, lse-hanlons-razor, lse-occams-razor]`
- [综合] **用现实证据修正技术判断**：The Map Is Not the Territory 区分模型与运行现实，The Hype Cycle & Amara's Law 区分短期热度与长期价值，The Lindy Effect 以存续时间提供成熟度信号；来源明确声明后两者相关。`supporting_ids: [lse-map-is-not-the-territory, lse-hype-cycle-amaras-law, lse-lindy-effect]`
- [综合] **资源继续投入决策**：Pareto Principle 用实测影响识别高回报部分，Sunk Cost Fallacy 要求忽略不可回收的过去投入，Occam's Razor 检查是否存在更少复杂度的可行路径。`supporting_ids: [lse-pareto-principle, lse-sunk-cost-fallacy, lse-occams-razor]`
- [综合] **以具体产物获得校正**：Cunningham's Law 用草稿或原型触发反馈，Confirmation Bias 则要求反馈包含反对意见和反证，而非只强化原判断。`supporting_ids: [lse-cunninghams-law, lse-confirmation-bias]`

## 使用方法

在方案评审中，先用 Confirmation Bias、Dunning-Kruger Effect 和 Hanlon's Razor 检查判断基础，再用 First Principles Thinking、Inversion 与 Occam's Razor形成和筛选方案。技术选型可结合 The Map Is Not the Territory、The Hype Cycle & Amara's Law 与 The Lindy Effect；资源分配和继续投入决策则结合 Pareto Principle 与 Sunk Cost Fallacy。所有结论都应回到当前证据，不以法则名称单独裁决。

## Relations

- refines: [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)
- related: [llm-engineering-knowledge-map](/concepts/llm-engineering-knowledge-map)

