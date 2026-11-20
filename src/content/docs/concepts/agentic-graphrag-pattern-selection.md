---
title: Agentic GraphRAG：架构选型与适用边界
created: 2026-11-19
updated: 2026-11-20
type: concept
tags:
  - agent
  - architecture
  - knowledge-base
  - context-engineering
  - memory
sources:
  - docs:https://towardsdatascience.com/a-practitioners-guide-to-6-agentic-graphrag-patterns/
  - concepts/hermes-knowledge-freshness-and-claim-evidence.md
  - queries/wiki-cross-source-evidence-navigation-benchmark.md
status: stable
description: 按问题选择固定查询、纵向下钻或有界横向多跳，并区分值得建模的四类历史记录及其适用限制。
aliases:
  - agentic-graphrag
  - hierarchical-graphrag
  - multi-hop-graph-retrieval
volatility: low
---

# Agentic GraphRAG：架构选型与适用边界

## Summary

Agentic GraphRAG 让智能体根据已经查到的证据决定下一步查什么，而不只消费一次固定查询的结果。**先看问题缺的是哪种证据，再决定要不要增加检索步骤**：已知对象的单点查找通常用搜索或固定查询；从总体异常定位细节，用纵向下钻；从已知对象追踪未知关联，用有界横向多跳。是否把历史记录建成可查询的关系，是另一个独立决策。

## 先选检索方式

以下选型是对[原文 Pattern 5–6](https://towardsdatascience.com/a-practitioners-guide-to-6-agentic-graphrag-patterns/)的归纳，例子为假设场景。

| 问题 | 先选 | 主要限制 |
| --- | --- | --- |
| 已知要查哪个对象或哪条规定 | 窄词搜索或固定查询；直接打开权威记录 | 结果足以支持答案时，不额外遍历关系。 |
| 先判断哪个区域异常，再确认具体记录 | **纵向下钻**：从高层摘要定位候选分组，逐层打开原始证据 | 摘要可能过期或掩盖局部异常。用原始记录核实，不把摘要当终局证据。 |
| 从已知工单确认哪些对象受同一故障影响 | **横向多跳**：按关系类型逐步查找，每一步核对中间结果；走不通时回溯 | 顺序调用会抬高延迟，过宽的关系会让候选膨胀。设跳数和调用预算，检测循环；证据已足或预算用尽时停止，明确剩余缺口。 |

纵向下钻解决的是**先在哪个层级找**，横向多跳解决的是**沿哪条关系找**。两者可以组合，但不需要为简单查询支付多步检索的代价。证据怎么绑定到具体断言，见 [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence)。

## 再选要记什么

[原文 Pattern 1–4](https://towardsdatascience.com/a-practitioners-guide-to-6-agentic-graphrag-patterns/)区分四类可关联的历史记录。值得持久化的是以后确实需要查询的关系，而不是把所有事件或对话都放进图里。

| 记录 | 以后要回答的问题 | 复用边界 |
| --- | --- | --- |
| 决策先例 | 以前在什么条件下批准过类似例外？ | 保留审批记录、适用条件和有效期；旧先例不替代现行政策或授权。 |
| 工具执行轨迹 | 类似任务中，哪种调用路径成功，哪些失败？ | 保留调用条件与结果；暂时性超时不等于该工具持续不可用。 |
| 用户与项目约束 | 哪些已确认的偏好或项目要求对本轮仍适用？ | 按用户、角色和项目限定作用域与访问权限；新规则可替代旧偏好。存得下不等于本轮该加载，见 [agent-context-engineering](/concepts/agent-context-engineering)。 |
| 事故历史 | 相似症状曾关联哪些组件、影响对象和处理团队？ | 症状相似只提供分诊线索，不等于当前根因已确认；用当前证据复核。 |

## 在现有 Wiki 中怎么采用

**[推论]** 沿用 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 已有的 `locate → expand`。只有反复遇到固定一跳漏掉关键证据时，才用同一批问题对照一跳基线与有界多跳：固定证据与调用预算的口径，比较关键证据召回、引用是否支持答案、耗时与上下文成本。复用 [wiki-cross-source-evidence-navigation-benchmark](/queries/wiki-cross-source-evidence-navigation-benchmark) 的评测口径；既有固定证据包结果不是自由检索的端到端验证。这是评测建议，不要求引入图数据库、自动写回知识或改变默认检索流程。

## 来源与证据边界

Partha Sarkar，[A Practitioner's Guide to 6 Agentic GraphRAG Patterns](https://towardsdatascience.com/a-practitioners-guide-to-6-agentic-graphrag-patterns/)，*Towards Data Science*，2026-11-15。原文用于识别六种架构模式及其取舍；示例不等于生产部署验证。作者估计的耗时、token 与成本降幅未给出测量方法和对照基线，不作为选型阈值或预期收益。

## Relations

- related: [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence), [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path), [agent-context-engineering](/concepts/agent-context-engineering), [wiki-cross-source-evidence-navigation-benchmark](/queries/wiki-cross-source-evidence-navigation-benchmark)

