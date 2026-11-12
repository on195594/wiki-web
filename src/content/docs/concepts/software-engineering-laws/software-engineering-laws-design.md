---
title: Software Engineering Laws — Design
created: 2026-08-10
updated: 2026-11-10
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
  - docs:https://en.wikipedia.org/wiki/Don%27t_repeat_yourself
  - docs:https://en.wikipedia.org/wiki/Law_of_Demeter
  - docs:https://en.wikipedia.org/wiki/Liskov_substitution_principle
  - docs:https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it
status: stable
description: 用于检索和比较软件设计中控制知识重复（DRY vs AHA）、复杂度、调用耦合（Law of
  Demeter）、里氏行为子类型（LSP）与超前实现（YAGNI）的经验法则。
volatility: low
aliases:
  - se-laws-design
  - design-engineering-laws
---

# Software Engineering Laws — Design

## Summary

本页汇总六条 Design 类软件工程法则，用于设计评审时识别知识重复、不必要复杂度、结构耦合、违背预期的行为、面向对象设计缺陷和超前实现。它们是强度与适用条件各异的经验性指导，不是脱离上下文即可强制执行的规则。完整来源入口见 [来源总索引](https://github.com/on195594/wiki/blob/main/raw/articles/laws-of-software-engineering/index.md)，跨类别决策入口见 [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)。

## 使用边界

- 法则应服务于当前需求、可维护性和变更风险，不应仅凭形式特征机械套用。
- 相似代码不必然表达同一知识，更多接口或抽象层也不必然改善设计。
- 评审结论应结合实际调用关系、用户预期、当前需求以及测试与重构能力。
- 来源站点将这些条目主要描述为经验法则；不同条目的证据强度并不一致。

## 法则记录

### DRY (Don't Repeat Yourself)

- **ID**：lse-dry-principle
- **原陈述**：Every piece of knowledge must have a single, unambiguous, authoritative representation.
- **核心机制**：由 Andy Hunt 与 Dave Thomas 在《程序员修炼之道》（*The Pragmatic Programmer*，1999，p. 27）中提出：“系统中的每一项知识都必须具有唯一、无歧义、权威的表示”（[Don't repeat yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)），并与 Bertrand Meyer 的**单一选择原则（Single Choice Principle）**（《面向对象软件构造》第 2 版，p. 63）一脉相承。DRY 针对同一知识、事实或业务逻辑（含数据库 Schema、测试计划、构建脚本与文档）的重复表达：多个副本会使一次需求变更需要同步修改多处，增加遗漏与不一致风险。它关注的是**业务知识与意图重复**，而非偶发的代码外观相似。
- **适用与评审问题**：[综合] 当前实现是否在多个位置表达同一规则、公式或配置？规则变化时能否只修改一处？看似相同的代码是否实际承担不同职责、具有独立演化原因，因而不应合并？[推论] 在 Agentic 编程与系统工程（[agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering)）中，跨 Prompt、Skill 与校验器的同一契约是否收敛为单一权威定义，而非靠手工复制同步？
- **误用与限制**：不能仅因代码形态相似就草率抽象合并；来源明确指出，不同用途的相似代码若被强行统一，反而会制造紧耦合与额外复杂度。Sandi Metz 提出“重复远比错误的抽象便宜（prefer duplication over the wrong abstraction）”，Cher Scarlett 与 Kent C. Dodds 亦将其概括为 **AHA（Avoid Hasty Abstractions，避免草率抽象）**（[Don't repeat yourself — AHA](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)）。
- **来源**：[dry-principle](https://github.com/on195594/wiki/blob/00cf290ec7d8f6f016d6cc1d22197bf5d281689e/raw/articles/laws-of-software-engineering/dry-principle.md)；[canonical URL](https://lawsofsoftwareengineering.com/laws/dry-principle/)；[Don't repeat yourself (Wikipedia)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)

### KISS (Keep It Simple, Stupid)

- **ID**：lse-kiss-principle
- **原陈述**：Designs and systems should be as simple as possible.
- **核心机制**：KISS 将满足当前需求的简单设计视为优先选择，因为更少的代码和结构通常更容易理解、调试、维护与修改，也更少产生连锁影响。它反对为尚未出现的问题引入聪明但不必要的复杂方案。
- **适用与评审问题**：[综合] 是否存在更短、更直接且同样满足需求的实现？当前抽象或扩展机制是否解决了真实问题？团队成员能否快速理解、定位并修改该设计？
- **误用与限制**：来源强调的是避免“不必要”的复杂度，而非忽略已存在的需求；来源未系统给出简单性与其他质量目标冲突时的反例。
- **来源**：[kiss-principle](https://github.com/on195594/wiki/blob/00cf290ec7d8f6f016d6cc1d22197bf5d281689e/raw/articles/laws-of-software-engineering/kiss-principle.md)；[canonical URL](https://lawsofsoftwareengineering.com/laws/kiss-principle/)

### Law of Demeter

- **ID**：lse-law-of-demeter
- **原陈述**：An object should only interact with its immediate friends, not strangers.
- **核心机制**：又称**最少知识原则（Principle of Least Knowledge）**，由 Ian Holland 与 Karl J. Lieberherr 等人于 1987 年在东北大学 Demeter 项目中提出（OOPSLA '88 及 1989 年 *IEEE Software* 论文，[Law of Demeter](https://en.wikipedia.org/wiki/Law_of_Demeter)）。其函数级形式化规则要求：对象 $a$ 的方法 $m$ 只能调用以下五类对象的方法：（1）对象 $a$ 自身；（2）$m$ 的形式参数；（3）在 $m$ 内部创建/实例化的对象；（4）$a$ 的直接成员属性/组件；（5）$m$ 作用域内可由 $a$ 访问的全局变量。调用方应避免穿过一个对象的返回值继续导航深层对象（如 `a.getB().getC().doSomething()`），以隔离内部结构变化。
- **适用与评审问题**：[综合] 调用方是否通过连续导航依赖了邻居的内部结构？能否由直接邻居暴露表达业务意图的接口？被访问对象的内部关系变化是否会迫使远端调用方同步修改？[推论] 在 Agent 工具与上下文边界设计（[agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering)）中，工具与子代理是否仅访问显式传入的参数和局部状态，而非穿透宿主全局会话或上游内部中间结构？
- **误用与限制**：Basili、Briand 与 Melo（1996，*IEEE Transactions on Software Engineering*）的实证研究表明（[Law of Demeter — Advantages and Disadvantages](https://en.wikipedia.org/wiki/Law_of_Demeter)），遵循该法则虽能降低**类响应集（Response For a Class，RFC）**从而减少软件缺陷率，但若机械添加大量薄委托包装方法，会推高**类加权方法数（Weighted Methods per Class，WMC）**并扩大类接口宽度，反而增加维护开销与缺陷风险。
- **来源**：[law-of-demeter](https://github.com/on195594/wiki/blob/00cf290ec7d8f6f016d6cc1d22197bf5d281689e/raw/articles/laws-of-software-engineering/law-of-demeter.md)；[canonical URL](https://lawsofsoftwareengineering.com/laws/law-of-demeter/)；[Law of Demeter (Wikipedia)](https://en.wikipedia.org/wiki/Law_of_Demeter)

### Principle of Least Astonishment

- **ID**：lse-principle-of-least-astonishment
- **原陈述**：Software and interfaces should behave in a way that least surprises users and other developers.
- **核心机制**：软件、界面和 API 的名称、默认值、行为及副作用应符合用户或开发者基于平台惯例与上下文形成的心理模型。可预测性能够降低误用概率，并改善易用性、开发体验和信任。
- **适用与评审问题**：[综合] 名称、类型和上下文是否足以让使用者正确预测行为？默认值与错误处理是否符合平台惯例？接口是否存在未被名称或契约揭示的副作用？
- **误用与限制**：来源说明违背该原则未必破坏功能，但会损害信任和易用性；来源未系统说明不同用户群体预期冲突时应如何取舍。
- **来源**：[principle-of-least-astonishment](https://github.com/on195594/wiki/blob/00cf290ec7d8f6f016d6cc1d22197bf5d281689e/raw/articles/laws-of-software-engineering/principle-of-least-astonishment.md)；[canonical URL](https://lawsofsoftwareengineering.com/laws/principle-of-least-astonishment/)

### SOLID Principles

- **ID**：lse-solid-principles
- **原陈述**：Five main guidelines that enhance software design, making code more maintainable and scalable.
- **核心机制**：由 Robert C. Martin 汇编的五项面向对象设计原则（单一职责 SRP、开放封闭 OCP、里氏替换 LSP、接口隔离 ISP、依赖倒置 DIP）。其中 **里氏替换原则（Liskov Substitution Principle，LSP）** 由 Barbara Liskov（1987 年 OOPSLA 主题演讲）提出，并由 Barbara Liskov 与 Jeannette Wing（1994 年 *ACM TOPLAS* 论文 *A Behavioral Notion of Subtyping*，[Liskov substitution principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle)）形式化定义为**强行为子类型（Strong Behavioral Subtyping）**：
  $$\texttt{S} \le \texttt{T} \implies (\forall x : \texttt{T}.\;\phi(x) \implies \forall y : \texttt{S}.\;\phi(y))$$
  除方法参数逆变、返回类型协变与异常受限外，行为子类型还须满足四项契约约束：（1）前置条件不得强化；（2）后置条件不得弱化；（3）类型不变量必须保持；（4）**历史约束（History Constraint）**——子类型新增方法不得产生超类型契约不允许的状态变迁（例如可变点不能作为不可变点的子类型，可变 `Square` 继承可变 `Rectangle` 会破坏独立修改宽高的后置条件断言）。
- **适用与评审问题**：[综合] 类是否混合了多个变化原因？扩展是否总要修改稳定代码？子类型能否在不破坏前置条件、后置条件、不变量与历史约束的前提下替代父类型？调用方是否被迫依赖不用的接口？高层逻辑是否直接绑定具体实现？[推论] 在 Agent 工具与模型路由替换（[agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering)）中，新工具版本或低成本替代模型是否保持了原有的输入容忍度、输出后置保证与副作用历史约束？
- **误用与限制**：SOLID 不保证完美设计，且通用行为子类型在理论上不可判定（例如停机性质无法由编译器普适证明）。来源明确指出，过多的小接口或抽象层可能超过问题需要并制造额外复杂度。
- **来源**：[solid-principles](https://github.com/on195594/wiki/blob/00cf290ec7d8f6f016d6cc1d22197bf5d281689e/raw/articles/laws-of-software-engineering/solid-principles.md)；[canonical URL](https://lawsofsoftwareengineering.com/laws/solid-principles/)；[Liskov substitution principle (Wikipedia)](https://en.wikipedia.org/wiki/Liskov_substitution_principle)

### YAGNI (You Aren't Gonna Need It)

- **ID**：lse-yagni
- **原陈述**：Don't add functionality until it is necessary.
- **核心机制**：源自极限编程（Extreme Programming，XP），由 Ron Jeffries（1998 年提出；2001 年 *Extreme Programming Installed*，p. 190）与 Kent Beck（*Extreme Programming Explained*，第 17 章）系统阐述：“始终在实际需要时才实现功能，绝不仅因预见未来需要而提前实现”（[You aren't gonna need it](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)）。YAGNI 支撑 XP 的“做可能奏效的最简单之事（DTSTTCPW）”，避免为不确定的未来需求预设钩子、参数和抽象层，将复杂度推迟到信息更充分的时候。
- **适用与评审问题**：[综合] 这项功能或扩展点是否对应当前明确需求？若删除它，现有验收目标是否仍能满足？团队是否具备测试、持续集成和重构能力，以便在真实需求出现后安全扩展？
- **误用与限制**：来源与 XP 原始定义均强调，YAGNI **必须与持续重构（Continuous Refactoring）、自动化单元测试和持续集成配套使用**；若脱离持续重构而单纯省略设计，代码会迅速退化为杂乱的技术债（[You aren't gonna need it — Context](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)）。
- **来源**：[yagni](https://github.com/on195594/wiki/blob/00cf290ec7d8f6f016d6cc1d22197bf5d281689e/raw/articles/laws-of-software-engineering/yagni.md)；[canonical URL](https://lawsofsoftwareengineering.com/laws/yagni/)；[You aren't gonna need it (Wikipedia)](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)

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

