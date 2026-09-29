---
title: AI Agent Layer Routing Sample Cases
created: 2026-04-17
updated: 2026-09-29
type: query
tags:
  - agent
  - workflow
  - decision
  - configuration
  - automation
  - mcp
sources:
  - concepts/hermes-layer-routing-decision-checklist.md
  - concepts/hermes-memory-skills-wiki-boundaries.md
  - docs:hermes-agent/user-guide/features/memory
  - docs:hermes-agent/user-guide/features/skills
  - docs:hermes-agent/user-guide/features/cron
  - docs:hermes-agent/user-guide/features/mcp
status: stable
description: 提供 AI Agent layer routing 的典型样例，用于校准 wiki、memory、skill、cron 和 MCP 归类。
aliases:
  - layer-routing-samples
  - agent-layer-routing-sample-cases
---

# AI Agent Layer Routing Sample Cases

## Summary
这页把 `[[hermes-layer-routing-decision-checklist]]` 从规则页推进到实战页：不给抽象定义，直接给样板案例。目标不是证明某一层“更重要”，而是训练稳定路由直觉——一个新信息、新需求或新流程出现时，为什么它应该进 `wiki`、`memory`、`skill`、`cron`、`MCP`，或者只留在 session。

## Applicability

以下为合成案例。`skill` 可由项目 SOP 承担，`cron` 泛指定时触发，`MCP` 仅是外部接入的一种实现，API/CLI/已有连接器同样可用；不要求安装任何新组件。写入任何持久层都需要对应授权，公共 Wiki 还需通过公开准入。人类操作指南可放在 `operations/`，不能仅因包含步骤就排除出 Wiki。

## Question
在真实使用 AI Agent 时，常见信息和需求应该如何稳定分流到正确层，而不是在 memory、wiki、skill、cron、MCP 之间混放？

## Case 1: “以后默认参考 AI Agent 官方文档，避免方案跑偏”
- 归类：`memory`
- 为什么：这是稳定工作偏好与长期校准规则，短、小、长期有效
- 为什么不是 wiki：它不是一篇需要长期扩写的知识页
- 为什么不是 skill：它不是可执行步骤本身

## Case 2: “这个服务器是 Debian 13，时区 Asia/Shanghai，运行 AI Agent 和 Caddy”
- 归类：`memory`
- 为什么：这是稳定环境事实，未来很多任务会复用
- 为什么不是 wiki：实例环境事实保留在私有或项目记录；只有脱离实例且适合公开的方法可进入 Wiki
- 为什么不是 session：这不是一次性状态，而是长期有效背景

## Case 3: “把安全修改 AI Agent 配置的做法标准化”
- 归类：`skill`
- 为什么：核心是重复执行的方法，有明确步骤、备份要求、验证要求
- 为什么不是 memory：太长，不适合压成短记忆
- 为什么不是 wiki：它回答的是“怎么做”，不是“这是什么”

## Case 4: “总结 AI Agent 当前知识库架构和层次关系”
- 归类：`wiki`
- 为什么：这是长期查阅、持续扩写、需要交叉链接的正式知识
- 为什么不是 skill：它不是操作 SOP
- 为什么不是 memory：信息量太大，且需要结构化章节

## Case 5: “接入 GitHub issue、PR、code search 到 AI Agent”
- 归类：`MCP`
- 为什么：这是外部实时能力接入，应优先复用已有授权工具，只有适配时才使用 MCP
- 为什么不是 wiki：wiki 只能记知识，不能提供实时操作能力
- 为什么不是 skill：skill 可以规定怎么用 GitHub，但不能替代接入本身

## Case 6: “每天早上 9 点检查 CI 失败并给我发摘要”
- 归类：`skill` + `cron`
- 为什么：先需要一套稳定检查方法，再需要定时调度
- 为什么不是单独 cron：cron 只负责什么时候跑，不负责方法定义
- 为什么不是 memory：这不是偏好或事实，而是自动化任务

## Case 7: “最近某次排障里临时发现一个奇怪报错，最后一次性修掉了”
- 归类：默认留在 `session`
- 为什么：如果它没有形成稳定规则、知识或方法，大概率不该入长期层
- 什么时候升级：
  - 如果暴露了稳定环境事实 → `memory`
  - 如果形成固定排障流程 → `skill`
  - 如果抽象成长期结论 → `wiki`

## Case 8: “把一篇外部 agent 架构文章整理成 AI Agent 可复用资产”
- 归类：`wiki`，必要时再加 `skill`
- 为什么：文章结论通常先沉淀成正式知识页
- 什么时候加 skill：如果“外部文章入库流程”本身变成稳定可复用方法
- 为什么不是 memory：文章内容通常过长，不适合记忆预算

## Case 9: “某个 quick command 的参数展开有坑，需要长期记住这个工具 quirks”
- 归类：`memory`
- 为什么：这是短小但高价值的工具怪癖，未来会反复影响判断
- 为什么不是 wiki：如果只是一个简短 quirk，升成页面成本过高
- 为什么不是 skill：除非它演化成完整处理流程

## Case 10: “如何把外部监控、工单、知识库一起编排成巡检工作流”
- 归类：`MCP` + `skill`
- 为什么：
  - 外部系统接入本身 → `MCP`
  - 利用这些能力执行固定巡检方法 → `skill`
- 为什么不是 cron：如果方法还没跑稳，先别定时化

## Case 11: “每次回答知识问题时，先查 wiki，再补 memory / skills / sessions / external”
- 归类：`wiki`，必要时可辅以 `memory`
- 为什么：这是系统级检索路径规则，适合成为正式知识页
- 什么时候也进 memory：如果要把它压成一条长期行为提醒，可保留一条简短 rule
- 不建议只放 memory：太容易丢掉结构化上下文

## Case 12: “用户说：以后 API keys 统一放环境变量文件，不写进配置文件”
- 归类：`memory`
- 为什么：这是稳定偏好和长期安全约束
- 为什么不是 wiki：它更像用户级工作规则，而非一页公共知识
- 为什么不是 skill：除非未来要扩展成完整 secrets 管理流程

## Case 13: “把层间路由规则写成正式判定清单”
- 归类：`wiki`
- 为什么：这是高复用、可链接、可维护的正式知识页
- 为什么不是 skill：它定义的是判断框架，不是执行步骤
- 为什么不是 memory：信息超出记忆层的合理密度

## Case 14: “某个重复巡检流程已经人工跑顺十几次，输入输出都很稳定”
- 归类：先 `skill`，后 `cron`
- 为什么：
  - 先固化方法
  - 再上调度
- 反例：如果直接跳到 cron，方法一变就会把噪声自动化

## Case 15: “这一轮聊天里临时决定先用 A，再不用 B，后续未必还成立”
- 归类：`session`
- 为什么：这属于当前线程的临时决策态，不该立刻污染长期层
- 什么时候升级：只有当它被反复验证为稳定规则或稳定偏好时，才考虑进 `memory` / `wiki`

## Distilled routing heuristics
从这些样板里，可以压出 5 条最实用启发：
1. 外部能力接入，先想 `MCP`
2. 重复方法，先想 `skill`
3. 定时执行，先问方法是不是已经稳定到足以上 `cron`
4. 短小稳定事实，才进 `memory`
5. 需要长期查阅、扩写、交叉链接的，才进 `wiki`

## Common mistakes these cases prevent
- 把短期决策过早写进 memory
- 把方法说明误写成 wiki，导致“会看不会做”
- 把外部接入需求误当知识页处理
- 在方法未成熟时急着上 cron
- 把本该正式沉淀的知识只留在 session 里

## Takeaway
一句话总结：
- `MCP` 管能力接入，`skill` 管做事方法，`cron` 管调度，`memory` 管短小稳定事实，`wiki` 管正式知识资产；分不清时，宁可先留在 session，也不要急着污染长期层。

## Relations
- depends_on: [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)

## Related
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- [index](/)
- `log`

