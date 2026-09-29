---
title: Hermes Knowledge Architecture
created: 2026-04-16
updated: 2026-09-22
type: concept
tags:
  - hermes
  - knowledge-base
  - agent
  - mcp
  - workflow
  - configuration
sources:
  - raw/articles/towardsdatascience-persistent-knowledge-layer-2026-08-16.md
status: stable
description: 定义 Hermes 长期知识系统的总体架构、层间关系与分层规则导航。
aliases:
  - knowledge-architecture
  - hermes-wiki-architecture
---

# Hermes Knowledge Architecture

## Summary
Hermes 的知识体系不是单一“记忆库”，而是分层协作系统。
其中，`wiki` 是正式知识资产层；`memory`、`skills`、`sessions`、`tools/MCP` 分别承担不同职责，共同组成可持续积累、可检索、可回写的知识闭环。

## Architecture at a glance
可以把 Hermes 的知识体系拆成两层：

1. Hermes 运行时知识栈
2. Wiki 文件系统结构

二者关系是：Hermes 通过工具和流程读写 wiki，而不是把长期知识直接塞进 prompt memory。

## Continue by question

本页维护总体结构和层间关系；具体规则按问题进入对应页面：

- 内容属于 memory、skill、wiki 还是 session：[hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- 一个需求如何组合内容、方法、触发、外部能力和运行状态：[hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- 哪些材料进入当前上下文、如何压缩历史、长任务状态如何推进：[hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- Wiki 结论能否用于当前回答、何时必须实时核验：[hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- 内容能否进入公共 Wiki：`SCHEMA.md`

各页可以保留理解当前主题所需的短定义和安全边界，但详细规则只在上述对应页面维护。

## Layer 1: Hermes runtime knowledge stack
### 1. memory
- 保存短小、稳定、长期有效的用户偏好与环境事实
- 适合：沟通偏好、固定路径约定、长期工作规则
- 不适合：长文档、研究材料、一次性任务结果

### 2. skills
- 保存可复用流程与操作方法
- 适合：配置修复流程、下载流程、审计流程、调试流程
- 本质上是“程序化知识”而不是“内容知识”

### 3. sessions / session_search
- 保存历史会话与阶段性上下文
- 适合：回忆上次做过什么、查找某次排障经过
- 不应作为正式知识库替代品

### 4. wiki
- 正式知识资产层
- 保存结构化、可维护、可交叉链接的 Markdown 页面
- 是回答知识问题时的首选来源，也是长期沉淀的 canonical layer

### 5. tools / MCP
- 负责把外部系统、检索能力、写回能力暴露给 Hermes
- 当知识库继续扩展时，可把 wiki search/read/write 进一步工具化
- 这层负责“连接”，不是知识本体

## Layer 2: Wiki filesystem architecture
### 1. Navigation layer
- `[index](/)`：知识目录与入口
- ``log``：知识库变更历史
- `SCHEMA.md`：结构规则、标签体系、页面规范

### 2. Raw source layer
- `raw/articles/`
- `raw/papers/`
- `raw/transcripts/`
- `raw/assets/`

这一层只保存原始材料，原则上不直接改写。

### 3. Compiled knowledge layer
- `entities/`：实体页，例如产品、组织、模型、项目
- `concepts/`：概念页，例如架构、方法论、机制
- `comparisons/`：横向比较
- `queries/`：值得长期保留的问题与答案

这一层才是知识沉淀的主战场。

## Conflict-aware knowledge primitives and temporal scoping

知识层不能只保存整理后的结论，还必须表达结论的适用边界、来源冲突和当前未知项。重要结论、数字、当前外部行为和规范性规则应尽量在同段或相邻句回到具体 Wiki、raw 或官方来源；页面级 `sources` 仍承担正式 provenance。否则，一条写入错误的长期结论会持续污染后续检索与回答。

来源文章给出三类可复用的知识对象：

- **Decision**：保存规则或结论、适用范围、生效时间、替代关系、决策理由和原始来源。仅凭“文档更新”不能推断新规则适用于所有对象或历史时点。
- **Contradiction**：并列保存相互冲突的主张、各自来源与有效时间、责任方及未解决原因。冲突未被权威证据消解前，不按文档新旧或语义相似度自动选边。
- **Open Question**：显式记录因证据缺失、范围不清或冲突未决而无法回答的问题，以及形成结论仍需补充的证据。

由此得到的本地知识写入约束是：

- `[推论]` 最新来源不自动等于当前适用来源；必须同时检查对象范围、生效日期和替代关系。
- `[推论]` 来源或项目证据发生变化时，优先检查受影响段落；无法确认时保留限制，不把旧内容继续写成当前规则。`updated` 只表示文件最近编辑时间，不代表整页已经复核。
- `[推论]` 遇到无法确定性解决的来源冲突时，知识编译应 fail closed：保留冲突并停止生成确定性结论，而不是让模型自行调和。
- `[推论]` 模型可提出知识补丁，但持久化写入仍由可验证规则和明确授权控制；文章中的 Azure、Cosmos DB、向量或图存储仅是实现示例，不构成本地技术选型。

### Retrieval routing and structural principles

- `[推论]` 需要原始措辞、精确引注或新鲜度判断时读取 raw evidence；需要决策理由、跨来源综合或连续知识时读取 compiled knowledge。只有问题确实同时依赖两者时才走双层检索。
- `[推论]` 时间范围应在相似度排序前约束候选集；矛盾检查则是所有检索路径共用的输出门禁。
- `[推论]` 术语漂移应通过一个 canonical entity page 及其 `aliases` 对齐，避免同一概念拆成多个互相遗漏的页面。
- `[推论]` 多跳解释应沿 `refines`、`depends_on`、`conflicts_with`、`supersedes` 等类型化关系遍历；top-k 相似度排序只能排名，不能替代关系链遍历。

## Cross-layer invariants

- 内容归属先按 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 判定；同一主题可以产生不同职责的资产，但不复制同一正文。
- 执行方法、触发方式和外部能力可按 [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist) 组合；skill、cron、MCP 与 wiki 不是互斥层。
- 上下文装配只决定本轮加载什么，不改变资产归属；长任务状态按 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules) 维护。
- Wiki 是正式知识层，但不是当前事实的豁免证据；回答前按 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 执行 Freshness Gate。
- raw 保存合格来源，sessions 保存历史轨迹；二者都不能自动替代编译后的正式知识。

## Retrieval and write-back loop
标准闭环如下：
1. 用户提出问题、链接、文档或主题
2. 按 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 查找并检查现有知识的当前适用性
3. 若 Wiki 不足，再读取合格 raw 或外部资料
4. 经提炼且符合公共准入时，更新对应正式页面
5. 同步更新 `[index](/)` 与 ``log``
6. 后续问题继续复用经过范围与新鲜度检查的知识

摄取细节由 `[wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)` 维护；内容归属不在本页重复展开。

## Design constraints
- 不把长文档直接塞进 memory
- 不把聊天记录原样当知识库
- 不只堆 raw 而不生成正式页面
- 每个正式页面都应可检索、可链接、可增量维护
- 知识问题默认先查 wiki，再外部补充，再回写 wiki

## Integration points
### Obsidian
- 作为浏览与编辑前端
- 使用 wikilinks 和 frontmatter 直接消费 wiki 目录
- 与部署者选择的 `OBSIDIAN_VAULT_PATH=/path/to/wiki` 对齐；示例路径不表示已经部署

### MCP / native tools
- 当 wiki 规模扩大后，可把 search/read/write 封装成原生工具
- 让 Hermes 不是“知道 wiki 在哪里”，而是“可以直接调用 wiki 能力”

## Relations
- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- depends_on: [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- depends_on: [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)

## Related
- [okf-for-hermes-wiki-governance-assessment](/queries/okf-for-hermes-wiki-governance-assessment)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`
- [agent-shared-wiki-index](/operations/agent-shared-wiki-index)

