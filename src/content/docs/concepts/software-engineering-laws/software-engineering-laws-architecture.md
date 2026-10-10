---
title: Software Engineering Laws — Architecture
created: 2026-08-10
updated: 2026-09-21
type: concept
tags:
  - research
  - architecture
  - decision
sources:
  - raw/articles/laws-of-software-engineering/index.md
  - raw/articles/laws-of-software-engineering/cap-theorem.md
  - raw/articles/laws-of-software-engineering/fallacies-of-distributed-computing.md
  - raw/articles/laws-of-software-engineering/galls-law.md
  - raw/articles/laws-of-software-engineering/hyrums-law.md
  - raw/articles/laws-of-software-engineering/law-of-leaky-abstractions.md
  - raw/articles/laws-of-software-engineering/law-of-unintended-consequences.md
  - raw/articles/laws-of-software-engineering/second-system-effect.md
  - raw/articles/laws-of-software-engineering/teslers-law.md
  - raw/articles/laws-of-software-engineering/zawinskis-law.md
status: stable
description: 用于检索分布式权衡、复杂性演化、抽象边界与架构范围控制相关的软件工程经验法则。
aliases:
  - software-engineering-laws-architecture
---

# Software Engineering Laws — Architecture

## Summary

本页汇集 9 条 Architecture 类法则，用于识别分布式系统约束、复杂系统演化、接口兼容风险、抽象泄漏、复杂性分配与功能膨胀。它们主要是设计和评审中的经验性检查工具，不是能够脱离上下文直接执行的强制规则。

## 使用边界

- 来源将这些条目主要描述为经验法则，其证据强度因条目而异。
- 法则适合帮助提出问题、暴露假设和比较权衡，不能代替需求、运行数据、故障模型与具体架构约束。
- CAP 的取舍发生在网络分区期间；来源同时明确它只是分布式设计空间的简化起点。
- “复杂性不可消除”“抽象必然泄漏”等表述应作为设计提醒使用，不应推导为拒绝简化或抽象的理由。
- 具体决策入口参见 [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)，来源导航参见 [来源总索引](../../raw/articles/laws-of-software-engineering/index.md)。

## 法则记录

### CAP Theorem

- **ID**：lse-cap-theorem
- **原陈述**：A distributed system can guarantee only two of: consistency, availability, and partition tolerance.
- **核心机制**：分布式系统无法同时保证一致性、可用性与分区容错；在网络健康时三者可以同时表现良好，但实际不可避免的分区会迫使系统在一致性与可用性之间取舍：要么拒绝部分请求以维持节点一致，要么继续响应并接受数据暂时不一致。
- **适用与评审问题**：[综合] 系统发生网络分区时选择一致性还是可用性？哪些请求会失败，哪些数据可能暂时陈旧，这一行为是否被明确设计和验证？
- **误用与限制**：不能将其误读为系统在所有时刻只能拥有三者中的两个；来源把它称为设计起点，并明确指出它没有覆盖全部设计空间。
- **来源**：`cap-theorem`；[canonical](https://lawsofsoftwareengineering.com/laws/cap-theorem/)

### Fallacies of Distributed Computing

- **ID**：lse-fallacies-of-distributed-computing
- **原陈述**：A set of eight false assumptions that new distributed system designers often make.
- **核心机制**：把远程调用当作本地调用，会忽略消息丢失、延迟、有限带宽、安全风险、拓扑变化与异构环境。由此产生的错误可能表现为未处理故障、聊天式远程调用造成的性能下降，或缺少认证和输入验证带来的安全问题。
- **适用与评审问题**：[综合] 设计是否显式处理超时、重试、延迟、容量、安全边界和成员变化，而不是默认网络可靠、快速、安全且拓扑固定？
- **误用与限制**：这些谬误是检查“不应假设什么”的清单，不保证加入缓存、冗余或重试就自动得到正确系统；来源未系统给出各措施的副作用与适用阈值。
- **来源**：`fallacies-of-distributed-computing`；[canonical](https://lawsofsoftwareengineering.com/laws/fallacies-of-distributed-computing/)

### Gall's Law

- **ID**：lse-galls-law
- **原陈述**：A complex system that works is invariably found to have evolved from a simple system that worked.
- **核心机制**：可工作的复杂系统通常从可工作的简单核心逐步演化而来。先验证小型架构，再按真实使用反馈增加能力，可以逐阶段检验假设并适应未知交互；从零一次性设计复杂系统则难以预见全部关系。
- **适用与评审问题**：[综合] 当前方案能否先交付一个可运行、可验证的简单核心，并让后续复杂性由实际需求和反馈逐步驱动？
- **误用与限制**：它支持增量演化而非保证所有简单系统最终都会成功，也不意味着任何复杂需求都能省略；来源未系统给出反例。
- **来源**：`galls-law`；[canonical](https://lawsofsoftwareengineering.com/laws/galls-law/)

### Hyrum's Law

- **ID**：lse-hyrums-law
- **原陈述**：With a sufficient number of API users, all observable behaviors of your system will be depended on by somebody.
- **核心机制**：随着使用者增多，正式契约之外的可观察行为——包括顺序、时序、错误信息、格式、性能特征乃至缺陷——也可能成为依赖。实际接口因此会扩展到线上可观察行为，使看似内部的修改产生兼容性风险。
- **适用与评审问题**：[综合] 这次变更会改变哪些可观察行为，是否存在消费者依赖未文档化的顺序、格式、时序、错误码或旧缺陷，需要怎样发现和控制兼容风险？
- **误用与限制**：该法则提示“可能有人依赖”，不等于任何行为都必须永久保留；来源未提供判断依赖是否值得兼容的统一标准。
- **来源**：`hyrums-law`；[canonical](https://lawsofsoftwareengineering.com/laws/hyrums-law/)

### The Law of Leaky Abstractions

- **ID**：lse-law-of-leaky-abstractions
- **原陈述**：All non-trivial abstractions, to some degree, are leaky.
- **核心机制**：非平凡抽象会在边界条件、故障或性能问题中暴露底层细节。抽象仍然必要，但使用者需要具备最低限度的底层理解，设计者则应减少泄漏并记录抽象失效的情形；例如 ORM 性能异常时仍需检查生成的 SQL。
- **适用与评审问题**：[综合] 抽象在哪些性能、故障或边界场景下会暴露底层机制，团队能否诊断这些场景，相关限制是否已被记录？
- **误用与限制**：该法则并非反对抽象，也不表示所有泄漏程度相同；来源强调抽象不可或缺，只需为其失效做好准备。
- **来源**：`law-of-leaky-abstractions`；[canonical](https://lawsofsoftwareengineering.com/laws/law-of-leaky-abstractions/)

### Law of Unintended Consequences

- **ID**：lse-law-of-unintended-consequences
- **原陈述**：Whenever you change a complex system, expect surprise.
- **核心机制**：复杂依赖与人的行为使重大变更无法被完全预测；结果可能是意外收益、不利副作用，或令原问题恶化的反向效果。软件中常表现为功能或修复影响无关模块的正确性、性能或负载。
- **适用与评审问题**：[综合] 变更可能通过哪些模块依赖或用户行为产生间接影响，验证和观测是否覆盖性能退化、回归及与目标相反的结果？
- **误用与限制**：它要求预期意外，而不是声称具体后果不可分析或测试；来源未系统给出反例，也未规定统一的验证强度。
- **来源**：`law-of-unintended-consequences`；[canonical](https://lawsofsoftwareengineering.com/laws/law-of-unintended-consequences/)

### Second-System Effect

- **ID**：lse-second-system-effect
- **原陈述**：Small, successful systems tend to be followed by overengineered, bloated replacements.
- **核心机制**：首个系统受约束而保持精简，成功后团队容易高估能力，把此前省略的功能、通用性、模块和愿望清单集中放入继任系统，从而低估范围增长带来的复杂度，损害进度、性能与可维护性。
- **适用与评审问题**：[综合] 替换或重写方案中的能力是否来自已验证需求，还是在首次成功后的信心驱动下集中加入了额外通用性、配置和功能？
- **误用与限制**：该效应警示宏大重设计，不表示所有第二版或重写必然失败；来源未系统给出安全重写的判定条件。
- **来源**：`second-system-effect`；[canonical](https://lawsofsoftwareengineering.com/laws/second-system-effect/)

### Tesler's Law (Conservation of Complexity)

- **ID**：lse-teslers-law
- **原陈述**：Every application has an inherent amount of irreducible complexity that can only be shifted, not eliminated.
- **核心机制**：问题中存在无法继续消除的固有复杂性，设计的关键在于由谁、在哪一层承担。智能默认值和内部算法可让用户操作更简单；反之，内部实现的简化可能把设置与手工步骤转嫁给用户。
- **适用与评审问题**：[综合] 当前设计把不可约的复杂性放在用户、应用、数据库或其他层中的哪里，由该承担者处理是否比替代位置更合适？
- **误用与限制**：不能用“复杂性守恒”否定可消除的偶然复杂性；[推论] 应先确认复杂性确属问题本身固有，再讨论如何分配。来源未提供区分固有与偶然复杂性的系统方法。
- **来源**：`teslers-law`；[canonical](https://lawsofsoftwareengineering.com/laws/teslers-law/)

### Zawinski's Law

- **ID**：lse-zawinskis-law
- **原陈述**：Every program attempts to expand until it can read mail.
- **核心机制**：这是对软件演化的幽默观察：产品流行后会持续承受增加能力和平台化的压力，“再加一个功能”逐渐扩大范围并增加复杂性，最终可能削弱原有焦点与用户价值。
- **适用与评审问题**：[综合] 新能力是否强化产品的核心价值，还是主要源于平台化、竞品追赶或零散请求，并会因此增加多少用户与维护复杂性？
- **误用与限制**：“直到能读邮件”是强调功能蔓延的修辞，不应作为所有程序必然演化路径的字面预测；来源将其明确描述为幽默观察。
- **来源**：`zawinskis-law`；[canonical](https://lawsofsoftwareengineering.com/laws/zawinskis-law/)

## 类别内关系

- [综合] **分布式约束链**：网络并不理想的事实要求设计故障、延迟与拓扑变化；发生分区时，CAP 进一步聚焦一致性与可用性的选择。`supporting_ids: [lse-fallacies-of-distributed-computing, lse-cap-theorem]`
- [综合] **演化优先与重写膨胀**：Gall's Law 支持从已验证的简单核心演化，Second-System Effect 则警示成功后的继任系统集中吸收未经验证的复杂性；来源也将二者声明为相关。`supporting_ids: [lse-galls-law, lse-second-system-effect]`
- [综合] **可观察行为与抽象边界**：抽象泄漏会让底层行为暴露给使用者，使用规模扩大后，这些可观察细节可能变成实际依赖；两条来源互相声明相关。`supporting_ids: [lse-law-of-leaky-abstractions, lse-hyrums-law]`
- [综合] **变更风险链**：消费者对非正式行为的依赖，是复杂系统变更产生意外回归的一种来源；来源将两条法则声明为相关。`supporting_ids: [lse-hyrums-law, lse-law-of-unintended-consequences]`
- [综合] **范围与复杂性累积**：持续功能扩张会推动产品膨胀，继任系统若一次性吸收这些诉求，更容易形成过度设计；来源将两条法则声明为相关。`supporting_ids: [lse-zawinskis-law, lse-second-system-effect]`
- [综合] **复杂性的去向**：抽象可以隐藏和转移复杂性，却无法保证底层细节永不暴露；因此既要选择合适的复杂性承担层，也要保留诊断泄漏的能力。`supporting_ids: [lse-teslers-law, lse-law-of-leaky-abstractions]`

## 使用方法

1. 先从 [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map) 按决策情境选择相关法则，而非把九条法则全部套用。
2. 将每条“适用与评审问题”转成当前方案的可回答问题，并用需求、故障模型、兼容性调查或运行数据支撑答案。
3. 同时记录法则提示的风险、当前取舍及适用边界；若法则之间形成张力，以具体系统约束决定优先级。
4. 回到 [来源总索引](../../raw/articles/laws-of-software-engineering/index.md) 与各 canonical 页面核对原始陈述，避免把经验观察升级为绝对规则。
5. [推论] 评估跨平台 UI 框架时，可将“复杂性的去向”和“抽象泄漏”落到平台适配、插件边界与发布链路；[flutter](/entities/flutter) 提供一个按官方架构整理的具体实例。

## Relations

- refines: [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)
- related: [llm-engineering-knowledge-map](/concepts/llm-engineering-knowledge-map), [flutter](/entities/flutter)

