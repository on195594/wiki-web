---
title: Software Engineering Laws — Quality
created: 2026-08-10
updated: 2026-09-21
type: concept
tags:
  - research
  - architecture
  - decision
sources:
  - raw/articles/laws-of-software-engineering/index.md
  - raw/articles/laws-of-software-engineering/boy-scout-rule.md
  - raw/articles/laws-of-software-engineering/broken-windows-theory.md
  - raw/articles/laws-of-software-engineering/kernighans-law.md
  - raw/articles/laws-of-software-engineering/lehmans-laws.md
  - raw/articles/laws-of-software-engineering/linuss-law.md
  - raw/articles/laws-of-software-engineering/murphys-law.md
  - raw/articles/laws-of-software-engineering/pesticide-paradox.md
  - raw/articles/laws-of-software-engineering/postels-law.md
  - raw/articles/laws-of-software-engineering/sturgeons-law.md
  - raw/articles/laws-of-software-engineering/technical-debt.md
  - raw/articles/laws-of-software-engineering/testing-pyramid.md
status: stable
description: 汇总软件质量、演化、测试与技术债相关经验法则，供设计和评审时快速检索。
aliases:
  - software-engineering-laws-quality
---

# Software Engineering Laws — Quality

## Summary

本页整理 Quality 类别的 11 条软件工程经验法则，覆盖增量改善、代码退化、可调试性、软件演化、协作审查、防御性设计、测试更新、互操作性、价值筛选与技术债管理。它们是启发评审的问题框架，不是具有统一证据强度的科学定律；原始条目索引见 [来源总索引](../../raw/articles/laws-of-software-engineering/index.md)，跨类别决策入口见 [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)。

## 使用边界

- 这些法则主要是经验性启发，不应脱离系统风险、团队能力和业务约束机械执行。
- 原陈述中的 “twice”“all”“anything”“90%” 等表达不应直接当作可验证的固定系数或绝对保证。
- 质量改善应与当前变更范围相称；来源支持持续的小步改进，不支持借题进行无限清理或大规模重写。
- 测试、容错和协作审查各自只能降低部分风险，不能替代明确的协议、安全边界、错误处理或维护责任。

## 法则记录

### The Boy Scout Rule

- **ID**：lse-boy-scout-rule
- **原陈述**：Leave the code better than you found it.
- **核心机制**：在功能开发或缺陷修复所触及的局部持续进行小幅清理，例如改善命名、简化逻辑、消除重复或补充关键测试；这些低成本改进会逐步提高可读性、可扩展性和共同所有权，并减少技术债积累。
- **适用与评审问题**：[综合] 当前变更附近是否存在一个范围明确、可随本次工作安全完成的小型质量改进？
- **误用与限制**：来源明确指出该规则不要求一次实现完美，也不主张大爆炸式重写或无止境的琐碎清理。
- **来源**：`boy-scout-rule`；[canonical](https://lawsofsoftwareengineering.com/laws/boy-scout-rule/)

### Broken Windows Theory

- **ID**：lse-broken-windows-theory
- **原陈述**：Don't leave broken windows (bad designs, wrong decisions, or poor code) unrepaired.
- **核心机制**：可见但长期未处理的缺陷、失败测试、过时代码或文档会传递“质量并不重要”的信号，促使更多绕过流程和草率修改，形成代码健康度下降的循环；及时修复小问题有助于维持质量规范。
- **适用与评审问题**：[综合] 当前可见的小缺陷是否正在降低团队对测试、设计或维护标准的预期，并可能诱发进一步退化？
- **误用与限制**：来源未系统给出反例；该条目描述的是质量问题可能滚雪球的机制，不应被写成每个小问题都会必然导致系统性衰退的保证。
- **相关概念**：[Entropy and Entropy Increase](/concepts/entropy-and-entropy-increase) 区分物理熵、信息熵与 “software entropy” 工程类比。
- **来源**：`broken-windows-theory`；[canonical](https://lawsofsoftwareengineering.com/laws/broken-windows-theory/)

### Kernighan's Law

- **ID**：lse-kernighans-law
- **原陈述**：Debugging is twice as hard as writing the code in the first place.
- **核心机制**：编写代码时拥有的上下文和心智模型会消退，而调试还需同时理解代码行为及其失败原因；接近理解能力极限的聪明或复杂实现，会给后续定位问题设置更高障碍。
- **适用与评审问题**：[综合] 实现是否足够清晰，使缺少原始上下文的维护者仍能理解执行路径、定位失败并安全修改？
- **误用与限制**：“twice”是强调调试负担的经验性表达，来源未将其定义为可普遍测量的固定倍数；可维护性与优化之间仍需结合实际约束判断。
- **来源**：`kernighans-law`；[canonical](https://lawsofsoftwareengineering.com/laws/kernighans-law/)

### Lehman's Laws of Software Evolution

- **ID**：lse-lehmans-laws
- **原陈述**：Software that reflects the real world must evolve, and that evolution has predictable limits.
- **核心机制**：长期运行并映射现实环境的软件必须持续变化才能保持有用；变化会累积内部复杂度，除非投入重构或重组加以抵消。组织的知识、协调和熟悉度限制了单位周期可吸收的变化量，系统感知质量也可能随环境和期待变化而下降。
- **适用与评审问题**：[综合] 本次演化是否同时评估了复杂度增量、维护投入，以及团队在当前周期能够理解和吸收的变化规模？
- **误用与限制**：来源将适用对象限定为长期存在、与现实环境互动的软件系统；它没有声称增加人员便能消除知识、协调或熟悉度约束。
- **来源**：`lehmans-laws`；[canonical](https://lawsofsoftwareengineering.com/laws/lehmans-laws/)

### Linus's Law

- **ID**：lse-linuss-law
- **原陈述**：Given enough eyeballs, all bugs are shallow.
- **核心机制**：让更多具有不同经验的人使用、审查和复现软件，会提高某个人识别缺陷、找到复现条件或提出修复的机会；内部代码评审和结对编程也可利用这一机制。
- **适用与评审问题**：[综合] 关键代码是否真正获得了足够且有效的关注，并有渠道把发现、复现信息和修复转化为受控变更？
- **误用与限制**：来源明确说明该法则并非绝对成立；开放源码本身不会自动修复缺陷，还需要活跃审查、协调和质量控制。Heartbleed 被用来说明“可见”不等于“有人在看”。
- **来源**：`linuss-law`；[canonical](https://lawsofsoftwareengineering.com/laws/linuss-law/)

### Murphy's Law / Sod's Law

- **ID**：lse-murphys-law
- **原陈述**：Anything that can go wrong will go wrong.
- **核心机制**：在大规模或长期运行中，空值、竞态、网络中断、异常输入等可发生的失败最终可能暴露；因此应在边界处验证输入、处理异常、优雅失败，并准备监控、回滚、备份和应急方案。
- **适用与评审问题**：[综合] 已识别的可行失败路径是否具有相称的校验、错误处理、测试和恢复措施？
- **误用与限制**：该陈述是用于促使防御性设计的经验性提醒，来源未提供“所有可能失败必然发生”的系统证据，也未要求不计成本地覆盖一切想象场景。
- **来源**：`murphys-law`；[canonical](https://lawsofsoftwareengineering.com/laws/murphys-law/)

### Pesticide Paradox

- **ID**：lse-pesticide-paradox
- **原陈述**：Repeatedly running the same tests becomes less effective over time.
- **核心机制**：固定测试集会持续覆盖已知行为和回归，但在已暴露缺陷被修复后，对新功能、新输入组合和新边界问题的发现能力会下降；测试集需根据版本变化及生产遗漏持续补充，并结合探索性测试。
- **适用与评审问题**：[综合] 测试是否随着功能、缺陷模式和生产反馈更新，而非只重复执行已经稳定通过的既有用例？
- **误用与限制**：来源明确说明该悖论不意味着回归测试无用；旧测试仍用于捕获回归，只是不能独自承担发现新缺陷的任务。
- **来源**：`pesticide-paradox`；[canonical](https://lawsofsoftwareengineering.com/laws/pesticide-paradox/)

### Postel's Law

- **ID**：lse-postels-law
- **原陈述**：Be conservative in what you do, be liberal in what you accept from others.
- **核心机制**：系统输出应严格遵循协议和标准；输入端可在能够安全解释时容纳顺序、格式等轻微差异，以提高不同实现之间的互操作性和韧性。
- **适用与评审问题**：[综合] 输出是否明确合规，输入容错是否具有确定、安全且一致的解释规则，而不会隐藏生产者错误？
- **误用与限制**：来源明确指出过度宽容可能掩盖错误、纵容不合规生产者、造成长期互操作问题，并在安全场景中扩大畸形输入风险；因此“liberal”不能越过安全边界。
- **来源**：`postels-law`；[canonical](https://lawsofsoftwareengineering.com/laws/postels-law/)

### Sturgeon's Law

- **ID**：lse-sturgeons-law
- **原陈述**：90% of everything is crap.
- **核心机制**：大量代码、功能、实验或技术投入可能只产生有限价值，少数部分才形成主要影响；承认噪声的存在，有助于持续筛选、精炼并聚焦高价值工作，避免把所有产出视为等价。
- **适用与评审问题**：[综合] 当前功能、代码路径或项目组合中，哪些部分有实际价值证据，哪些部分只在增加复杂度和维护成本？
- **误用与限制**：“90%”是来源中的概括性表达，不是用于项目验收或人员评价的固定比例；来源未提供可跨场景直接套用的量化方法。
- **来源**：`sturgeons-law`；[canonical](https://lawsofsoftwareengineering.com/laws/sturgeons-law/)

### Technical Debt

- **ID**：lse-technical-debt
- **原陈述**：Technical Debt is everything that slows us down when developing software.
- **核心机制**：捷径以未来修复成本换取当前交付速度；未偿还的低质量代码、缺失测试和临时绕行会持续增加修改成本，形成“利息”。有意识承担、记录并通过重构、补测和设计改善偿还时，技术债也可服务于原型验证或市场时机。
- **适用与评审问题**：[综合] 当前捷径带来的即时收益、后续本金与持续利息是否可见，并有明确的重访条件或偿还安排？
- **误用与限制**：来源明确说明技术债并非天然有害；在原型或时限场景中可以有意承担，但若忽视偿还，其影响会累积。
- **来源**：`technical-debt`；[canonical](https://lawsofsoftwareengineering.com/laws/technical-debt/)

### Testing Pyramid

- **ID**：lse-testing-pyramid
- **原陈述**：A project should have many fast unit tests, fewer integration tests, and only a small number of UI tests.
- **核心机制**：以数量多、执行快的单元测试构成基础，以较少的集成测试验证模块协作，再以少量昂贵且易脆弱的端到端或 UI 测试覆盖真实用户路径，从而以较低成本获得快速反馈。
- **适用与评审问题**：[综合] 测试组合是否让大多数缺陷在成本较低的层级暴露，同时保留足够的集成与端到端验证来覆盖真实协作和关键旅程？
- **误用与限制**：来源只给出层级间的相对数量与成本方向，没有规定固定比例；端到端测试虽应较少，但仍被视为必要。
- **来源**：`testing-pyramid`；[canonical](https://lawsofsoftwareengineering.com/laws/testing-pyramid/)

## 类别内关系

- [综合] 小步清理能够偿还局部技术债，并减少可见缺陷持续传递质量松懈信号的机会。`supporting_ids: [lse-boy-scout-rule, lse-broken-windows-theory, lse-technical-debt]`
- [综合] 长期软件的持续变化会增加复杂度和修改成本；重构、补测与设计改善分别提供复杂度控制和债务偿还手段。`supporting_ids: [lse-lehmans-laws, lse-technical-debt, lse-boy-scout-rule]`
- [综合] 清晰实现降低调试负担，而有效同行审查增加发现和解释缺陷的机会；二者共同改善缺陷处理能力，但都不构成无缺陷保证。`supporting_ids: [lse-kernighans-law, lse-linuss-law]`
- [综合] 防御性设计处理可预见失败，测试金字塔控制验证成本，农药悖论要求测试随缺陷模式持续更新。`supporting_ids: [lse-murphys-law, lse-testing-pyramid, lse-pesticide-paradox]`
- [综合] Postel's Law 的输入宽容需要服从 Murphy's Law 所强调的失败处理；可解释的兼容偏差可以接受，危险或歧义输入仍需拒绝。`supporting_ids: [lse-postels-law, lse-murphys-law]`
- [综合] 价值筛选可用于识别不值得继续维护的低价值功能或路径，从源头减少复杂度与技术债，但“90%”不能被当作删除配额。`supporting_ids: [lse-sturgeons-law, lse-technical-debt, lse-lehmans-laws]`

## 使用方法

1. 先按问题类型选择法则：局部维护看 Boy Scout Rule、Broken Windows 与 Technical Debt；可理解性和协作审查看 Kernighan's Law 与 Linus's Law；测试策略看 Testing Pyramid 与 Pesticide Paradox。
2. 将“适用与评审问题”作为讨论入口，结合当前系统的风险、证据和约束回答，不直接把原陈述转写成强制门禁。
3. 对含绝对措辞或数字的条目，优先使用其“核心机制”和“误用与限制”，避免把修辞性表达当作量化结论。
4. 涉及跨类别权衡时，转到 [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map) 查找相关决策入口和来源链。

## Relations

- refines: [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)
- related: [llm-engineering-knowledge-map](/concepts/llm-engineering-knowledge-map)

