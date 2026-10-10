---
title: Software Engineering Laws — Scale
created: 2026-08-10
updated: 2026-08-10
type: concept
tags:
  - research
  - architecture
  - decision
sources:
  - raw/articles/laws-of-software-engineering/index.md
  - raw/articles/laws-of-software-engineering/amdahls-law.md
  - raw/articles/laws-of-software-engineering/gustafsons-law.md
  - raw/articles/laws-of-software-engineering/metcalfes-law.md
status: stable
description: 用于检索和比较软件系统扩展中的串行瓶颈、工作负载增长与网络效应。
aliases:
  - software-engineering-laws-scale
---

# Software Engineering Laws — Scale

## Summary

本页汇集 Scale 类别的三条经验法则，分别说明固定工作量下的并行上限、随资源扩大问题规模的扩展方式，以及网络参与者增长带来的潜在连接价值。它们适合用于架构评审、容量规划与平台增长讨论；分类入口见 [来源总索引](../../raw/articles/laws-of-software-engineering/index.md)，决策入口见 [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)。

## 使用边界

这些记录主要是经验法则，而非法律或具有统一证据强度的科学定律。使用时应先确认讨论对象、工作负载假设和价值度量，不应把模型中的趋势直接当作系统必然结果。

## 法则记录

### Amdahl's Law

- **ID**：lse-amdahls-law
- **原陈述**：The speedup from parallelization is limited by the fraction of work that cannot be parallelized.
- **核心机制**：增加处理器、机器或人员时，只有可并行部分能够随资源增长而加速；串行部分保持不变，并逐渐主导总耗时。若串行比例为 `s`，无限并行资源下的最大加速比为 `1/s`。同一机制也适用于单一数据库、共享服务或集中决策者形成的瓶颈。
- **适用与评审问题**：[综合] 当前流程中哪些工作必须串行执行？新增资源是否仍会经过同一数据库、共享依赖或决策节点？在扩大资源投入前，能否先缩短或拆除这些串行路径？
- **误用与限制**：不能据此断言增加并行资源完全无效；它描述的是串行部分对固定工作量加速上限的约束。来源未系统给出反例。
- **来源**：`amdahls-law`；[canonical URL](https://lawsofsoftwareengineering.com/laws/amdahls-law/)

### Gustafson's Law

- **ID**：lse-gustafsons-law
- **原陈述**：It is possible to achieve significant speedup in parallel processing by increasing the problem size.
- **核心机制**：当计算资源增加时，可以扩大待处理的问题规模，让并行部分随处理器数量增长，而串行部分大致保持不变。扩展的目标因此可以是相同时间内处理更多数据或更高分辨率的问题，而不只是更快完成同一固定任务。
- **适用与评审问题**：[综合] 新增核心或机器后，工作负载能否按资源拆分并扩大？额外容量是否承担了更多有效计算？系统设计是否允许通过增加分区、数据量或模型精度来利用扩展资源？
- **误用与限制**：该机制依赖问题规模能够增长、并行部分能够持续占用新增资源，以及串行部分大致稳定；不能据此假定任意工作负载都可获得近线性的规模化加速。来源未系统给出反例。
- **来源**：`gustafsons-law`；[canonical URL](https://lawsofsoftwareengineering.com/laws/gustafsons-law/)

### Metcalfe's Law

- **ID**：lse-metcalfes-law
- **原陈述**：The value of a network is proportional to the square of the number of users.
- **核心机制**：网络用户增加时，潜在的成对连接数量增长得比用户数量更快；每个新用户可以为既有用户增加新的互动机会，因此网络效应可能推动平台价值快速增长。反向来看，用户流失也会减少其余用户之间的潜在连接。
- **适用与评审问题**：[综合] 产品价值是否确实来自用户之间的连接与互动？新增用户能否为既有用户创造可用的连接机会？评估增长或流失时，是否区分了用户数、潜在连接数与实际产生的增量价值？
- **误用与限制**：这是简化模型，并非所有用户都会彼此连接，新增连接的边际价值也可能递减；因此不能把用户数平方直接视为实际业务价值。
- **来源**：`metcalfes-law`；[canonical URL](https://lawsofsoftwareengineering.com/laws/metcalfes-law/)

## 类别内关系

- [综合] Amdahl's Law 与 Gustafson's Law 从不同工作负载假设观察并行扩展：前者关注固定问题规模下串行部分形成的上限，后者关注资源增加时扩大问题规模所获得的规模化吞吐。`supporting_ids: [lse-amdahls-law, lse-gustafsons-law]`
- [综合] Amdahl's Law 提醒评审者先识别不会随资源增长而缩短的瓶颈；Gustafson's Law 则说明，当问题能够拆分和扩大时，新增资源仍可承担有效工作。`supporting_ids: [lse-amdahls-law, lse-gustafsons-law]`
- [综合] Metcalfe's Law 衡量的是参与者增长带来的潜在连接价值，而 Amdahl's Law 与 Gustafson's Law 衡量的是计算或组织工作随资源变化的扩展表现；三者均被来源互列为相关法则，但分析对象不同。`supporting_ids: [lse-amdahls-law, lse-gustafsons-law, lse-metcalfes-law]`

## 使用方法

1. 先明确扩展对象是固定工作量、可增长的工作量，还是由用户连接形成的网络。
2. 对固定工作量检查串行路径与共享瓶颈；对可增长工作量检查新增资源能否承载更多有效任务；对网络检查潜在连接是否会转化为实际互动价值。
3. 将结论作为评审问题和趋势判断，不把模型直接转换为强制规则或未经验证的容量承诺。
4. 需要跨类别选择法则时，转到 [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)。

## Relations

- refines: [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)
- related: [llm-engineering-knowledge-map](/concepts/llm-engineering-knowledge-map)

