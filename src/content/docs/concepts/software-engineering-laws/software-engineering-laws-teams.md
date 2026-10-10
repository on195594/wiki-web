---
title: Software Engineering Laws — Teams
created: 2026-08-10
updated: 2026-08-10
type: concept
tags:
  - research
  - architecture
  - decision
sources:
  - raw/articles/laws-of-software-engineering/index.md
  - raw/articles/laws-of-software-engineering/brooks-law.md
  - raw/articles/laws-of-software-engineering/bus-factor.md
  - raw/articles/laws-of-software-engineering/conways-law.md
  - raw/articles/laws-of-software-engineering/dilbert-principle.md
  - raw/articles/laws-of-software-engineering/dunbars-number.md
  - raw/articles/laws-of-software-engineering/peter-principle.md
  - raw/articles/laws-of-software-engineering/prices-law.md
  - raw/articles/laws-of-software-engineering/putts-law.md
  - raw/articles/laws-of-software-engineering/ringelmann-effect.md
status: stable
description: 用于检索和评审团队规模、知识分布、组织结构、晋升机制与协作成本相关的软件工程经验法则。
aliases:
  - software-engineering-laws-teams
---

# Software Engineering Laws — Teams

## Summary

本页汇总 9 条与团队有关的软件工程经验法则，覆盖延期项目增员、关键知识集中、组织沟通结构、管理岗位匹配、群体规模及个人贡献变化等问题。这些条目主要是启发式模型，适合用于提出评审问题，不应被当作普遍成立的强制规则。

## 使用边界

- 来源将这些条目主要描述为经验法则，其证据强度因条目而异。
- 数字模型用于识别风险和形成假设，不能直接代替对交付质量、职责差异、系统复杂度及团队环境的实际调查。
- 讽刺性组织原则用于暴露潜在机制，不足以单独判断个人能力或决定任免。
- 本页只综合给定来源中的机制与关联，不引入其他法则或扩展理论。

## 法则记录

### Brooks's Law

- **ID**：lse-brooks-law
- **原陈述**：Adding manpower to a late software project makes it later.
- **核心机制**：软件工作不能被完全线性拆分。向已经延期的项目加入新人，会产生培训、沟通和集成成本，并占用原团队成员的时间；这些成本在一段时间内可能超过新增人员的贡献。来源建议优先重新评估范围或时间，而非假定增员能够立即追回进度。
- **适用与评审问题**：[综合] 当前延期是否主要受人员数量限制？新人达到有效产出前需要哪些培训与协调投入，这些投入会占用哪些关键成员？是否应先调整范围、时间或工作安排？
- **误用与限制**：该法则并不声称增员永远无效，而是指出把增员作为延期项目的即时补救通常适得其反；具体影响取决于上手成本、任务可分割性和沟通负担。
- **来源**：`brooks-law`；[canonical URL](https://lawsofsoftwareengineering.com/laws/brooks-law/)

### Bus Factor

- **ID**：lse-bus-factor
- **原陈述**：The minimum number of team members whose loss would put the project in serious trouble.
- **核心机制**：Bus Factor 衡量关键知识是否集中在人类单点故障上。数值较低意味着少数成员一旦离开，系统维护、部署或关键工作就可能停滞；文档、代码评审、结对、指导和职责轮换有助于分散知识。
- **适用与评审问题**：[综合] 哪些系统、算法或运维流程只有一两个人能够处理？若相关成员突然不可用，其他人能否凭现有文档、评审记录和实践经验接手？
- **误用与限制**：它衡量的是知识分布与连续性风险，不等同于个人绩效排名；来源未给出适用于所有团队的统一目标数值。
- **来源**：`bus-factor`；[canonical URL](https://lawsofsoftwareengineering.com/laws/bus-factor/)

### Conway's Law

- **ID**：lse-conways-law
- **原陈述**：Organizations design systems that mirror their own communication structure.
- **核心机制**：软件边界往往沿组织中的沟通路径和团队分工形成；组织孤岛可能对应难以协作的软件模块。来源提出可通过有意调整团队结构，使其与期望的系统架构相匹配。
- **适用与评审问题**：[综合] 当前团队和部门之间的沟通边界会映射成哪些系统边界？期望的架构是否得到相应所有权与沟通路径支持，还是会在交接处形成集成摩擦？
- **误用与限制**：来源将其描述为常见映射关系，而非组织结构能够单独决定架构的绝对因果规则；组织调整也不保证自动得到目标架构。
- **来源**：`conways-law`；[canonical URL](https://lawsofsoftwareengineering.com/laws/conways-law/)

### Dilbert Principle

- **ID**：lse-dilbert-principle
- **原陈述**：Companies tend to promote incompetent employees to management to limit the damage they can do.
- **核心机制**：该原则以讽刺方式批评用晋升代替绩效处理的组织行为：把不适合当前岗位的人转入管理层，可能同时失去执行能力并引入缺乏技术可信度或领导能力的管理者。技术能力和人员领导能力是不同技能。
- **适用与评审问题**：[综合] 此次管理晋升是在确认领导能力，还是在回避当前岗位的绩效问题？候选人的技术背景、人员领导能力和意愿是否分别得到评估？
- **误用与限制**：来源明确指出其表达具有夸张和讽刺性质，不能据此推断管理者普遍无能，也不能把晋升当作个人能力不足的证据。
- **来源**：`dilbert-principle`；[canonical URL](https://lawsofsoftwareengineering.com/laws/dilbert-principle/)

### Dunbar's Number

- **ID**：lse-dunbars-number
- **原陈述**：There is a cognitive limit of about 150 stable relationships one person can maintain.
- **核心机制**：当组织接近或超过约 150 人时，成员更难依靠非正式认知了解彼此身份与职责，因而需要更明确的沟通渠道、规则和分组。日常高信任协作所需的工作组通常远小于这一社区规模上限。
- **适用与评审问题**：[综合] 当前规模是否已经让成员难以知道“应找谁处理什么”？是否需要把部门划分为更小的协作单元，并为跨组联系建立清晰渠道？
- **误用与限制**：约 150 指稳定社会关系的近似上限，不是软件团队的精确最佳人数；来源还区分了社区规模与更小的日常协作群体。
- **来源**：`dunbars-number`；[canonical URL](https://lawsofsoftwareengineering.com/laws/dunbars-number/)

### Peter Principle

- **ID**：lse-peter-principle
- **原陈述**：In a hierarchy, every employee tends to rise to their level of incompetence.
- **核心机制**：若晋升只奖励当前岗位的成功，员工可能不断被提升，直至进入能力不匹配的角色。工程能力不会自动转化为管理能力；双轨职业路径、任前验证和新经理培训可降低这种错配。
- **适用与评审问题**：[综合] 晋升标准是在评价目标岗位所需能力，还是只依据候选人在当前岗位的成绩？是否存在技术晋升路径、试任机会和必要培训？
- **误用与限制**：该原则描述晋升制度可能产生的倾向，不表示每位员工都会变得不胜任，也不应被用于给个人贴固定能力标签。
- **来源**：`peter-principle`；[canonical URL](https://lawsofsoftwareengineering.com/laws/peter-principle/)

### Price's Law

- **ID**：lse-prices-law
- **原陈述**：The square root of the total number of participants does 50% of the work.
- **核心机制**：团队产出可能集中于少数成员，人数增加并不意味着产出线性增长；关键贡献者离开会造成显著影响，因此需要识别知识与交付集中风险，并关注留任和过载问题。
- **适用与评审问题**：[综合] 关键交付是否长期集中在少数成员？采用的产出指标是否遗漏了可靠性、安全、支持或文档等必要工作？关键贡献者离开或过载时会出现什么缺口？
- **误用与限制**：来源称其更接近模型而非绝对规则，并警告不能据此认定其他成员无用；提交数等可见指标也可能低估重要但不显眼的工作。
- **来源**：`prices-law`；[canonical URL](https://lawsofsoftwareengineering.com/laws/prices-law/)

### Putt's Law

- **ID**：lse-putts-law
- **原陈述**：Those who understand technology don't manage it, and those who manage it don't understand it.
- **核心机制**：管理职责与深度技术理解常由不同人员承担，角色分离可能造成期限预期脱离技术复杂度，也可能使工程人员忽视业务语境。来源建议通过管理者掌握技术基础或由兼具技术理解的领导者连接两侧。
- **适用与评审问题**：[综合] 决策者是否理解实现复杂度、质量与测试成本？技术人员是否理解业务目标和约束？团队是否有能够在管理与技术语境之间进行双向解释的角色？
- **误用与限制**：来源明确说明这一描述并非普遍成立；它用于提示理解鸿沟，不足以证明管理者必然不懂技术或技术专家必然不适合管理。
- **来源**：`putts-law`；[canonical URL](https://lawsofsoftwareengineering.com/laws/putts-law/)

### The Ringelmann Effect

- **ID**：lse-ringelmann-effect
- **原陈述**：Individual productivity decreases as group size increases.
- **核心机制**：群体扩大后，沟通、会议、对齐和集成成本增加，个人贡献也可能因责任感或可见性下降而减少，因此人均产出可能降低。明确职责和采用小而聚焦的团队可缓解这一效应。
- **适用与评审问题**：[综合] 增员带来的产出是否超过新增协调成本？成员是否拥有清晰、可见的责任边界？能否用更小且聚焦的协作单元完成工作？
- **误用与限制**：该效应描述团队扩大时的常见倾向，不表示每次扩组都会降低总产出；来源未给出适用于所有软件团队的固定最佳规模。
- **来源**：`ringelmann-effect`；[canonical URL](https://lawsofsoftwareengineering.com/laws/ringelmann-effect/)

## 类别内关系

- [综合] 延期项目增员与团队扩张都可能增加沟通和协调成本，使产出无法按人数线性增长。`supporting_ids: [lse-brooks-law, lse-ringelmann-effect]`
- [综合] Dunbar's Number 描述关系规模的认知边界，Ringelmann Effect 描述群体扩大后的人均投入与协调损耗，Conway's Law 则说明形成的沟通结构可能进一步映射为系统边界。`supporting_ids: [lse-dunbars-number, lse-ringelmann-effect, lse-conways-law]`
- [综合] Bus Factor 与 Price's Law 都提示关键贡献或知识可能集中于少数成员；前者聚焦人员流失造成的连续性风险，后者聚焦贡献分布及关键成员流失或过载的影响。`supporting_ids: [lse-bus-factor, lse-prices-law]`
- [综合] Peter Principle、Dilbert Principle 与 Putt's Law 从不同机制描述技术组织中的岗位错配：按旧岗位成绩晋升、用晋升回避绩效处理，以及管理权与技术理解之间的分离。`supporting_ids: [lse-peter-principle, lse-dilbert-principle, lse-putts-law]`
- [综合] Brooks's Law、Bus Factor、Conway's Law、Dunbar's Number 与 Ringelmann Effect 的来源均声明了类别内关联，可共同用于检查增员、知识分布、沟通边界和团队规模之间的相互影响。`supporting_ids: [lse-brooks-law, lse-bus-factor, lse-conways-law, lse-dunbars-number, lse-ringelmann-effect]`

## 使用方法

1. 先从 [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map) 定位当前决策涉及的是规模、知识、组织边界还是岗位机制。
2. 选择对应记录，把“适用与评审问题”用于访谈、方案评审或复盘，并收集团队自身证据。
3. 将法则视为风险线索：若观察与法则一致，再制定小范围、可验证的调整；若不一致，则保留实际证据，不强行套用。
4. 需要核对原始摘录和来源范围时，进入 [来源总索引](../../raw/articles/laws-of-software-engineering/index.md) 或各记录的 canonical URL。

## Relations

- refines: [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)
- related: [llm-engineering-knowledge-map](/concepts/llm-engineering-knowledge-map)

