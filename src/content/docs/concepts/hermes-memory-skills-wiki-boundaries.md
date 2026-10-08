---
title: AI Agent Memory Skills Wiki Boundaries
created: 2026-04-16
updated: 2026-09-29
type: concept
tags:
  - agent
  - knowledge-base
  - workflow
  - configuration
sources:
  - raw/articles/machinelearningmastery-ai-agent-memory-strategy-decision-tree-2026-07-11.md
status: stable
description: 定义 AI Agent memory、skills、wiki 和 sessions 的归类边界，避免把偏好、流程、正式知识和临时上下文混放。
aliases:
  - layer-boundaries
  - memory-skill-wiki-boundaries
  - agent-memory-skills-wiki-boundaries
---

# AI Agent Memory Skills Wiki Boundaries

## Summary
`memory`、`skills`、`wiki` 是可选的长期信息载体，三者职责不同；它们不要求由某个 Agent 产品原生提供。本页集中维护内容归属、正反例和从认知记忆术语到本地载体的映射。

判断边界的核心原则不是“这个信息重不重要”，而是“它属于偏好与事实、可复用流程，还是正式知识资产”。组合触发与外部能力见 [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)；上下文加载与长任务状态见 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)；当前适用性见 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)。

客户端缺少原生 memory、skill 或历史搜索时，可复用受授权的偏好设置、项目 SOP 和已有记录；无需为了符合本页新建这些能力。`USER.md`、`MEMORY.md`、`SKILL.md` 是实现示例，加载、写入和权限语义须按宿主核对。

## One-line definitions
- `memory`：短小、稳定、长期有效的偏好与事实
- `skills`：可复用的操作流程与方法手册
- `wiki`：结构化、可检索、可链接、可持续维护的正式知识资产

## Boundary rule
可以用一句话判断：
- 如果是“以后我需要记住这个人/环境/偏好”，进 `memory`
- 如果是“以后我还会照着这套方法执行”，进 `skills`
- 如果是“以后我还会查阅、扩展、交叉引用这份知识”，进 `wiki`

## What belongs in memory
### 适合进入 memory
- 用户长期偏好
- 机器环境中的稳定事实
- 长期工作规则
- 未来多次任务中都需要快速调用的简短结论

### memory 的特征
- 短
- 稳定
- 高复用
- 不是长文档
- 不是过程记录

### memory 例子
- 用户偏好默认用中文回复
- 下载文件保存到 `~/download`
- 某个固定路径是系统 canonical path
- 用户不希望视频下载通过 xitter，而要走 video-downloader

## What belongs in skills
### 适合进入 skills
- 一套多步、可重复执行的流程
- 某种工具的标准操作方式
- 容易忘，但适合沉淀为“步骤说明书”的方法
- 多次验证过、值得标准化复用的做法

### skills 的特征
- 面向执行
- 强调步骤和验证
- 通常包含触发条件、命令、注意事项、验收方式
- 本质是程序化经验，而不是主题知识

### skills 例子
- 如何安全修改 AI Agent 配置
- 如何下载视频并生成短文件名
- 如何测试 fallback model
- 如何做系统化调试

## What belongs in wiki
### 适合进入 wiki
- 概念说明
- 架构设计
- 研究结论
- 横向比较
- 值得长期沉淀的问题与答案
- 需要交叉链接、持续更新、长期查阅的内容

重要结论、数字、当前外部行为和规范性规则应尽量附上相邻的具体来源；本地推导继续使用 `[推论]`。这改善来源精度，但不新增 Wiki 状态枚举或强制模板。

### wiki 的特征
- 面向知识消费与复盘
- 可与其他页面建立 wikilinks
- 能被后续问题复用
- 可以不断增量更新
- 是正式知识层，而不是临时缓存

### wiki 例子
- `[[hermes-knowledge-architecture]]`
- AI Agent 的检索优先级与回写闭环
- 某类工具的架构比较
- 经过多轮沉淀后形成的方法论总结

## What does NOT belong
### 不该进 memory 的内容
- 长篇摘要
- 原始文档
- 一次性任务结果
- 临时错误日志
- 会话里的中间推理

### 不该进 skills 的内容
- 纯概念介绍
- 仅在一个任务中出现一次的临时步骤
- 缺少稳定触发条件的偶发经验

人类需要的公开操作指南可以保留在 `operations/`；步骤化内容不自动等同于 Agent Skill。Skill 承载宿主中的触发、工具调用和执行约束，Wiki 承载共享解释与可追溯方法。

### 不该进 wiki 的内容
- 原样复制整段聊天记录
- 没有长期价值的临时问题
- 完全没有结构整理的原始资料

## Relationship between the three
三者不是替代关系，而是分工关系：
- `memory` 让 AI Agent 更懂用户和环境
- `skills` 让 AI Agent 更会做事
- `wiki` 让 AI Agent 更会积累知识

只有当前任务授权且满足对应载体准入时，一个主题才可能产生三层资产：
- 用户提出长期偏好 → 写入 `memory`
- 形成稳定工作流 → 写入 `skills`
- 沉淀成架构/方法论/对比分析 → 写入 `wiki`

## Cognitive memory labels mapped to AI Agent layers

Machine Learning Mastery 的 `machinelearningmastery-ai-agent-memory-strategy-decision-tree-2026-07-11` 用 working、semantic、episodic、procedural memory 描述 Agent 信息生命周期。这里的 `memory` 是认知架构总称，不能全部等同于 AI Agent 的 `memory` 工具：

| 外部术语 | 信息特征 | AI Agent 主要落点 | 不应误放到 |
|---|---|---|---|
| Working memory | 当前轮次或会话状态、工具中间结果 | 当前 session；长任务的 project state | 长期 `memory`、wiki |
| Semantic memory | 当前有效、稳定、跨任务复用的事实与偏好 | 短小事实进入宿主支持的偏好或持久记忆载体；需来源和结构的知识进入 wiki | 原始事件日志 |
| Episodic memory | 历史事件、决策、交互和运行证据 | session history、project logs、run artifacts；只有适合公开且有长期价值的材料才可能进入 wiki raw source | 默认注入的长期 `memory` |
| Procedural memory | 已验证、可重复执行的规程 | skills、references、项目 SOP 和 fixtures | 单次成功日志、未经验证的经验 |

映射原则：

- 历史事件不自动成为当前事实；查询时应区分“曾经发生”与“现在仍有效”。
- 新事实写入前应检查来源、更新时间及是否替代旧事实；冲突版本不能无标记并存。
- 程序内存不是自动从成功日志升级而来；只有触发条件、步骤、失败边界和验证方式稳定后，才进入 skill/reference。
- Zep、Mem0、Memory Bank 等是来源中的实现示例，不是 AI Agent 默认技术选型。

## Scope handoff

本页只裁决内容是什么、应由哪类载体长期承担：

- 是否需要跨轮或跨会话保留，以及它是稳定事实、历史事件还是可复用规程，属于内容归属判断。
- 是否在本轮全量加载、检索裁剪或压缩后注入，属于 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules) 的上下文装配判断。
- 是否定时触发、接入外部工具或与其他层组合，属于 [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)。
- 历史记录是否仍能回答当前问题，属于 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 的 Freshness Gate。

因此，内容被检索到、被本轮加载或被定时任务使用，都不会自动改变它的长期归属。

## Operational policy
实际工作中默认遵循：
- 偏好和长期规则，优先压缩成一句写入 `memory`
- 可复用流程，优先沉淀为 `skills`
- 正式知识，优先沉淀为 `wiki`
- 临时进度、一次性排障过程、短期状态，不进入这三者
- 私有偏好、环境记录和历史不得直接搬进公共 Wiki；先去标识化并判断公开可复用性

## Anti-patterns
- 把 memory 当 changelog
- 把 skills 写成百科
- 把 wiki 写成聊天记录仓库
- 同一内容同时塞进 memory、skills、wiki，导致边界混乱

## Practical examples
### 例 1：用户说“以后默认用中文回复”
- 归类：`memory`
- 原因：这是稳定偏好，不是流程，也不是知识页

### 例 2：完成了一套“安全修改 AI Agent 配置”的固定流程
- 归类：`skills`
- 原因：这是可重复执行的方法

### 例 3：总结出“AI Agent 知识库整体架构”
- 归类：`wiki`
- 原因：这是正式知识资产，适合长期查阅和扩展

## Relations
- refines: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- depends_on: [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- depends_on: [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)

## Related
- `machinelearningmastery-ai-agent-memory-strategy-decision-tree-2026-07-11`
- [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- [hermes-memory-governance-notes](/concepts/hermes-memory-governance-notes)
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`
- [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary)
- [chat-to-agent-session-routing](/concepts/chat-to-agent-session-routing)

