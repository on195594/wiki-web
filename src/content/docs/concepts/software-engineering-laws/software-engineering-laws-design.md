---
title: Software Engineering Laws — Design
created: 2026-08-10
updated: 2026-08-10
type: concept
tags:
  - research
  - architecture
  - decision
sources:
  - raw/articles/laws-of-software-engineering/index.md
  - raw/articles/laws-of-software-engineering/dry-principle.md
  - raw/articles/laws-of-software-engineering/kiss-principle.md
  - raw/articles/laws-of-software-engineering/law-of-demeter.md
  - raw/articles/laws-of-software-engineering/principle-of-least-astonishment.md
  - raw/articles/laws-of-software-engineering/solid-principles.md
  - raw/articles/laws-of-software-engineering/yagni.md
status: stable
description: 用于检索和比较软件设计中控制重复、复杂度、耦合、意外行为与过度实现的经验法则。
aliases:
  - software-engineering-laws-design
---

# Software Engineering Laws — Design

## Summary

本页汇总六条 Design 类软件工程法则，用于设计评审时识别知识重复、不必要复杂度、结构耦合、违背预期的行为、面向对象设计缺陷和超前实现。它们是强度与适用条件各异的经验性指导，不是脱离上下文即可强制执行的规则。完整来源入口见 [来源总索引](../../raw/articles/laws-of-software-engineering/index.md)，跨类别决策入口见 [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)。

## 使用边界

- 法则应服务于当前需求、可维护性和变更风险，不应仅凭形式特征机械套用。
- 相似代码不必然表达同一知识，更多接口或抽象层也不必然改善设计。
- 评审结论应结合实际调用关系、用户预期、当前需求以及测试与重构能力。
- 来源站点将这些条目主要描述为经验法则；不同条目的证据强度并不一致。

## 法则记录

### DRY (Don't Repeat Yourself)

- **ID**：lse-dry-principle
- **原陈述**：Every piece of knowledge must have a single, unambiguous, authoritative representation.
- **核心机制**：DRY 针对同一知识、事实或业务逻辑的重复表达。多个副本会使一次需求变更需要同步修改多处，并增加遗漏、不一致和缺陷风险；集中实现或配置可形成唯一权威表示。它关注的是意图重复，而不只是代码外观相似。
- **适用与评审问题**：[综合] 当前实现是否在多个位置表达同一规则、公式或配置？规则变化时能否只修改一处？看似相同的代码是否实际承担不同职责，因而不应合并？
- **误用与限制**：不能仅因代码形态相似就抽象合并；来源明确指出，不同用途的相似代码若被强行统一，反而可能增加复杂度。来源未系统给出其他反例。
- **来源**：`dry-principle`；[canonical URL](https://lawsofsoftwareengineering.com/laws/dry-principle/)

### KISS (Keep It Simple, Stupid)

- **ID**：lse-kiss-principle
- **原陈述**：Designs and systems should be as simple as possible.
- **核心机制**：KISS 将满足当前需求的简单设计视为优先选择，因为更少的代码和结构通常更容易理解、调试、维护与修改，也更少产生连锁影响。它反对为尚未出现的问题引入聪明但不必要的复杂方案。
- **适用与评审问题**：[综合] 是否存在更短、更直接且同样满足需求的实现？当前抽象或扩展机制是否解决了真实问题？团队成员能否快速理解、定位并修改该设计？
- **误用与限制**：来源强调的是避免“不必要”的复杂度，而非忽略已存在的需求；来源未系统给出简单性与其他质量目标冲突时的反例。
- **来源**：`kiss-principle`；[canonical URL](https://lawsofsoftwareengineering.com/laws/kiss-principle/)

### Law of Demeter

- **ID**：lse-law-of-demeter
- **原陈述**：An object should only interact with its immediate friends, not strangers.
- **核心机制**：对象应主要与自身、直接组件、函数参数或自己创建的对象交互，避免穿过一个对象访问更深层对象。这样可减少调用方对内部结构的了解，使内部关系变化不易向外传播；常见做法是由直接邻居提供委托方法。
- **适用与评审问题**：[综合] 调用方是否通过连续导航依赖了邻居的内部结构？能否由直接邻居暴露表达业务意图的接口？被访问对象的内部关系变化是否会迫使远端调用方同步修改？
- **误用与限制**：遵循该法则可能增加包装或委托方法的数量，来源认为这可换取更清晰的交互。来源未系统给出何时不应增加委托层的反例。
- **来源**：`law-of-demeter`；[canonical URL](https://lawsofsoftwareengineering.com/laws/law-of-demeter/)

### Principle of Least Astonishment

- **ID**：lse-principle-of-least-astonishment
- **原陈述**：Software and interfaces should behave in a way that least surprises users and other developers.
- **核心机制**：软件、界面和 API 的名称、默认值、行为及副作用应符合用户或开发者基于平台惯例与上下文形成的心理模型。可预测性能够降低误用概率，并改善易用性、开发体验和信任。
- **适用与评审问题**：[综合] 名称、类型和上下文是否足以让使用者正确预测行为？默认值与错误处理是否符合平台惯例？接口是否存在未被名称或契约揭示的副作用？
- **误用与限制**：来源说明违背该原则未必破坏功能，但会损害信任和易用性；来源未系统说明不同用户群体预期冲突时应如何取舍。
- **来源**：`principle-of-least-astonishment`；[canonical URL](https://lawsofsoftwareengineering.com/laws/principle-of-least-astonishment/)

### SOLID Principles

- **ID**：lse-solid-principles
- **原陈述**：Five main guidelines that enhance software design, making code more maintainable and scalable.
- **核心机制**：SOLID 以单一职责、开放封闭、里氏替换、接口隔离和依赖倒置五项面向对象设计指导，推动模块化、封装和松耦合，使系统较易测试、重构和扩展，并降低局部变化引发连锁破坏的风险。
- **适用与评审问题**：[综合] 类是否混合了多个变化原因？扩展是否总要修改稳定代码？子类型能否替代父类型？调用方是否被迫依赖不用的接口？高层逻辑是否直接绑定具体实现？
- **误用与限制**：SOLID 不保证完美设计。来源明确指出，过多的小接口或抽象层可能超过问题需要并制造额外复杂度。
- **来源**：`solid-principles`；[canonical URL](https://lawsofsoftwareengineering.com/laws/solid-principles/)

### YAGNI (You Aren't Gonna Need It)

- **ID**：lse-yagni
- **原陈述**：Don't add functionality until it is necessary.
- **核心机制**：YAGNI 要求聚焦当前已提出或立即需要的功能，避免为不确定的未来需求预设钩子、参数和抽象层。通过先实现最小方案、在需求出现后再迭代扩展，可将复杂度推迟到信息更充分的时候。
- **适用与评审问题**：[综合] 这项功能或扩展点是否对应当前明确需求？若删除它，现有验收目标是否仍能满足？团队是否具备测试、持续集成和重构能力，以便在真实需求出现后安全扩展？
- **误用与限制**：来源指出，成功采用 YAGNI 依赖对后续低成本重构的信心，并以良好测试、重构工具和持续集成作为安全网；来源未系统给出缺少这些条件时的具体取舍规则。
- **来源**：`yagni`；[canonical URL](https://lawsofsoftwareengineering.com/laws/yagni/)

## 类别内关系

- [综合] KISS 与 YAGNI 共同抑制当前需求之外的设计复杂度：前者审视方案是否足够简单，后者审视功能或扩展是否现在就有必要。`supporting_ids: [lse-kiss-principle, lse-yagni]`
- [综合] DRY 与 SOLID 都试图降低变更传播：DRY 集中同一知识的表示，SOLID 通过职责、接口、替换与依赖关系控制结构性影响；二者也在来源的 related_laws 中互相关联。`supporting_ids: [lse-dry-principle, lse-solid-principles]`
- [综合] Law of Demeter 与 SOLID 都通过减少不必要的结构知识和耦合来隔离变化，并由来源声明为相关法则。`supporting_ids: [lse-law-of-demeter, lse-solid-principles]`
- [综合] Law of Demeter 与 Principle of Least Astonishment 都关注接口使用者可见的交互：前者限制跨层导航，后者要求行为符合名称、上下文和惯例；二者由来源声明为相关法则。`supporting_ids: [lse-law-of-demeter, lse-principle-of-least-astonishment]`
- [综合] KISS 可作为应用 DRY、SOLID 和 Law of Demeter 时的复杂度校验，避免为了形式合规而引入超过当前问题所需的抽象或委托。`supporting_ids: [lse-kiss-principle, lse-dry-principle, lse-solid-principles, lse-law-of-demeter]`

## 使用方法

1. 从当前评审风险出发选择法则：重复知识看 DRY，方案复杂度看 KISS，跨对象导航看 Law of Demeter，接口预期看 Least Astonishment，面向对象结构看 SOLID，未来功能看 YAGNI。
2. 将对应的“适用与评审问题”用于代码、API 或架构评审，并以实际变更路径和当前需求作答。
3. 同时检查“误用与限制”；若采用一条法则会引入新的复杂度，应比较其维护收益与新增成本。
4. 将结论记录为上下文相关的设计判断，而不是无条件的合规判定；跨类别权衡参见 [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)。

## Relations

- refines: [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)
- related: [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering)

