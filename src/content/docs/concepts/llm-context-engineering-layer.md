---
title: LLM Context Engineering Layer
created: 2026-04-16
updated: 2026-09-06
type: concept
tags:
  - llm
  - agent
  - workflow
  - research
sources:
  - raw/articles/tds-rag-isnt-enough-context-engineering-2026-04-14.md
  - raw/articles/thenewstack-building-trust-agentic-rag-2026-09-05.md
status: stable
description: 定义 LLM 检索和 prompt 之间的上下文工程层，包括记忆、压缩、排序和预算控制。
aliases:
  - context-engineering-layer
---

# LLM Context Engineering Layer

## Summary
这篇文章提出的关键结论是：RAG 只能解决“检索到什么”，但生产级 LLM 系统还必须有一层独立的 context engineering，来决定什么内容真正进入上下文窗口、以什么顺序进入、被压缩成什么形式，以及 token 预算如何分配。

## Core distinction
可以把三层职责分开理解：
- Prompt engineering：定义系统提示词、输出格式、few-shot 等“怎么问”问题
- RAG：从外部知识库里“找什么”
- Context engineering：决定“最后塞进模型窗口里的是什么”

文章的中心判断是：很多系统失败，不是因为检索没命中，而是因为上下文治理失控。

## Why plain RAG breaks down
在真实系统里，RAG 很快会遇到几个结构性问题：
- 历史对话一长，相关文档可能被旧上下文挤掉
- 多篇检索结果重复，白白浪费 token
- token 不够时只能粗暴截断，导致关键信息丢失
- 旧错误上下文持续污染后续推理
- 系统 prompt、历史、检索结果之间没有明确预算边界

这类问题并不是检索器本身能单独解决的。

## Proposed architecture
作者给出的 context engineering 流水线包括 5 层：

### 1. Retriever
负责找候选资料。
支持 keyword、TF-IDF 和 hybrid。文章偏向 hybrid，因为它能同时覆盖关键词匹配和语义相似度。

### 2. Re-ranker
检索命中的候选文档不等于最终放进上下文的顺序。
Re-ranker 会结合领域标签与相关性，再次决定优先级。

### 3. Memory with decay
系统不应机械保留全部历史，而应保留重要信息，并让旧信息逐步衰减。
这让多轮对话既有记忆，又不会被历史淹没。

### 4. Context compression
当候选上下文超出预算时，不应只做硬截断。
更好的做法是先压缩内容，尽量保留关键事实和结构。

### 5. Token budget enforcement
上下文窗口是稀缺资源，需要明确分配给：
- system prompt
- conversation history
- retrieved documents
- memory / compressed context

没有预算治理，任何单一部分都可能挤爆窗口。

## Practical implications
这篇文章最实用的启发不是“换更强检索算法”，而是：
- 把上下文当作正式系统资源管理
- 把 memory、compression、re-ranking、budgeting 从隐式行为变成显式架构
- 用策略决定保留什么、删除什么、压缩什么，而不是默认把所有东西都塞进去

这意味着 LLM 系统从 demo 走向 production，核心工作会从“继续堆检索”转向“治理有限上下文”。

## When this matters
更适合引入 context engineering 的场景：
- 多轮聊天机器人
- 大知识库 RAG
- 需要长期记忆的 AI copilot / agent
- 上下文很长、任务需要持续迭代的工作流

不太值得上这层的场景：
- 单轮查询
- 小型知识库
- 极低延迟服务
- 强确定性、可审计优先的规则型流程

## Agentic RAG trust boundary

Agentic RAG 不只返回检索结果，还会改写查询、选择数据源、组合检索方式、重排、拒绝候选并循环搜索。来源文章据此主张：可信度需要覆盖这些中间决策，而不能只看最终答案和 Top-k 切片。

可复用的设计原则（以下为基于来源的 **[推论]**）：
- **保留可重放的检索证据链**：记录原始请求、查询改写、实际过滤条件、检索方式、候选来源、排名数据、时间戳、接受或拒绝原因、工具分支和未核实项。工程师仅凭请求与 trace 应能回答“为什么选它、当时为何有效、替代项为何被拒绝”。
- **硬约束先于相似度**：租户、调用者权限、有效期、地域、文档类型和审核状态决定候选是否有资格被返回；相似度只在允许集合内排序。身份和 scope 应由工具或数据库注入并强制执行，不能信任模型从检索内容或用户文本中自行推导。
- **验证主张而不只展示引用**：生成期间保留来源 provenance，并建立 `claim → excerpt/source` 映射。无支撑主张应删除或降格；有效来源相互冲突时应揭示冲突、收窄到共同证据，或转人工复核。
- **检索内容是数据，不是策略**：文档正文即使来自内部库也属于不可信模型输入，不得修改权限、检索政策、工具调用或记忆晋升规则；查询改写和后续工具调用仍需通过应用层校验。

**[推论] Hermes 本地映射：** 本页定义上下文与检索信任边界；[production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 负责将语料选择、召回、租户隔离、引用覆盖和主张支撑拆分验证；[agent-development-lifecycle](/concepts/agent-development-lifecycle) 负责把失败案例送回评测与迭代；[agent-context-engineering](/concepts/agent-context-engineering) 负责更宽的上下文装配与工具选择边界。

### Evidence boundary

- 上述机制来自一篇 Oracle 赞助的架构文章；它没有公开数据集、基准测试、生产事故材料或独立对照。
- “Oracle AI Vector Search 靠近业务数据可减少副本并在数据库层执行访问控制”只保留为来源示例，不构成 Hermes 技术选型结论。
- Hermes 尚未用本地生产失败案例验证全量 retrieval trace、claim-support gate 或对应指标阈值；在此之前，这些内容是概念级评审原则，不是 active-layer 默认门禁。

## Why it matters for Hermes
这个观点和 Hermes 当前知识架构是对齐的：
- `[[hermes-retrieval-priority-and-answer-path]]` 说明检索顺序只是第一步，不等于最终上下文装配
- `[[hermes-knowledge-architecture]]` 强调长期知识需要分层与可维护结构，而不是把所有材料都停留在对话层
- 对 agent 来说，真正稀缺的不是“能不能取到资料”，而是“能不能在有限窗口里持续保留正确上下文”

所以这篇文章可以视为对 Hermes 后续 context compression、memory decay、budget control 等机制的一次外部理论支撑。

## Takeaway
一句话概括：
RAG 解决“找到信息”，context engineering 解决“让模型在有限上下文里持续做对事”。

## Relationship to LLM engineering map

`[[llm-engineering-knowledge-map]]` places context engineering inside the broader LLM system stack: after representation, architecture, training, and inference constraints, but before final evaluation and monitoring. This page remains the narrower reference for the context/RAG boundary.

## Related
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`

