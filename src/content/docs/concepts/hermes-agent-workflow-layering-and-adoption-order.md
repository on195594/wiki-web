---
title: AI Agent Workflow Layering and Adoption Order
created: 2026-04-17
updated: 2026-09-29
type: concept
tags:
  - agent
  - mcp
  - automation
  - workflow
  - configuration
  - decision
sources:
  - raw/articles/openai-codex-best-practices-2026-04-17.md
  - raw/articles/x-lanlance-code-mode-json-plumbing-2026-08-24.md
status: stable
description: 定义 AI Agent 采用 Agent 工作流分层时的优先顺序和落地边界。
aliases:
  - hermes-agent-layering
  - agent-workflow-layering-and-adoption-order
---

# AI Agent Workflow Layering and Adoption Order

## Summary

本页从 [codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering) 等来源提炼可移植的职责分层：指令与任务边界、长期知识、方法、工具、确定性编排、验证和可选调度。它是设计参考，不说明任一 Agent 已具备全部能力；先复用现有组件，有真实缺口才扩展。

## Capability-based layer mapping
### 1. Instruction layer
指令与上下文应区分权威级别，按目标宿主支持的规则入口装配：
- system prompt
- developer rules
- 用户请求与显式偏好
- 按需参考的 memory / skills catalog（存在时；不自动获得系统指令权威）
- repo 或项目内本地上下文

这一层决定：语言风格、安全边界、工具纪律、验证要求，以及什么该写入 memory / wiki / skill。

### 2. Task framing layer
进入执行前，任务仍需收敛成：
- 目标
- 上下文
- 约束
- 完成标准

在 AI Agent 里，这通常来自用户当前消息、当前线程已形成的决策，以及必要时的 plan / TODO / 子任务拆解。任务没收敛时，更多工具只会把模糊执行得更快。

### 3. Durable knowledge layer
AI Agent 的长期知识并不只靠一个文件系统位点：

#### Wiki
适合：概念、架构、对比、长期问答、外部文章编译结果。

#### Memory
适合：稳定用户偏好、持久环境事实、短小但长期有用的约束。

#### Sessions recall
适合：跨会话找回最近处理过的问题背景，以及还不值得正式入库的过程经验。

应区分 durable knowledge 和 runtime context；这是设计要求，不是所有 Agent 已实现的产品事实。

### 4. Method layer: skills
当宿主支持 Skill 或项目已有 SOP 时，可复用方法应承载：
- 某一类任务的稳定方法
- 触发条件
- 步骤顺序
- 常见坑
- 验证方式
- 明确边界与 handoff

设计原则应继续保持：窄 scope、明确输入输出、少做大而全、出现重复 prompt 或重复纠错后再沉淀。

### 5. Live capability layer: MCP + tools
AI Agent 的外部实时能力由两部分组成：
- MCP server / external integration
- 本机与内建工具调用

这层适合处理 repo 外数据、动态系统状态、外部平台动作和自动化执行接口。关键约束不是“能接多少”，而是是否真的减少手工往返、是否有稳定收益、是否会放大错误权限。

### 6. Programmatic execution layer: Code Mode

`[[x-lanlance-code-mode-json-plumbing-2026-08-24]]` 补充了 live capability 与 verification 之间缺失的一层：工具负责提供能力和权限边界，代码负责把这些能力组合成一次可重跑、可检查的执行。

职责分工：

- LLM 负责理解目标、处理歧义、规划、生成程序和语义判断。
- `execute_code` 或等价沙箱负责分页、循环、过滤、排序、连接、重试、格式转换和工具间参数搬运。
- MCP / API / CLI 继续负责连接、文档、鉴权和外部动作；Code Mode 改变消费方式，不取消协议与权限边界。
- 只把压缩后的结果、异常和验证证据交回模型，而不是让完整中间 JSON 反复穿过上下文。

路由依据是数据流，不是调用次数：即使只有少量工具调用，只要中间载荷很大且处理是确定性的，也应程序化；反之，即使调用很多，只要每一步都需要新的语义判断，就仍应由模型逐步控制。单次调用已经能直接返回答案时，不增加脚本包装。

确定性编排交给目标项目已有脚本、代码执行工具或工作流 owner，不依赖特定名称的私有 Skill。这一层与 `[[deterministic-analytics-llm-reasoning-boundary]]` 的原则一致，但覆盖范围从数据分析扩展到通用工具编排。

证据边界：来源中 `99.9%` token 降幅、endpoint 数量、产品成熟度和厂商比较均受原始场景限制，不能成为 AI Agent 的固定阈值；可迁移的是“模型做判断，代码做确定性搬运与编排”的机制。

### 7. Verification layer
这篇 Codex 文章里最值得 AI Agent 吸收的，不是名词，而是验证闭环。可迁移的验证原则是：
- 修改后要验证
- 不能靠“做了”推断“成功了”
- 要用 read/check/list/test/tool output 做 grounding

因此 verification 不应只是附属动作，而应被视为独立层。任何 write / patch / config / external action 后，都要回到验证层闭环。

### 8. Scheduling layer: cron
目标系统支持且已授权调度时，才引入自动触发。它只适合承接：
- 输入稳定
- 方法稳定
- 失败代价可控
- 交付目标明确

如果 workflow 还依赖人工纠偏，就不该直接升到 cron；应先让 skill 成熟。

## What this means for AI Agent today
### Inspect actual capabilities first

先确认目标宿主已提供哪些指令、存储、方法、工具、编排与调度能力。缺少某一层不构成缺陷；没有相应需求就跳过。

### Biggest failure mode: layer mixing
最常见的退化路径是：
- 把一次性任务规则写进 memory
- 把长期概念只留在 session 里
- 把 repo 外动态数据硬塞进 wiki
- 把还不稳定的流程急着做成 cron
- 把本应拆成 skill 的方法继续靠临时 prompt 维持

AI Agent 下一阶段更重要的是“层间路由正确”，不是“层数更多”。

### Missing piece: stronger routing discipline
`[[hermes-memory-skills-wiki-boundaries]]` 已经定义了边界，但从这篇文章反推，后续最值得加强的是更显式的路由判断：
- 这是规则，还是方法？
- 这是长期知识，还是当前任务状态？
- 这是外部实时数据，还是应落库的稳定资料？
- 这是适合 skill，还是已足够成熟可上 cron？

## Adoption order for AI Agent
更适合当前 AI Agent 的推进顺序是：
1. 先把 instruction / verification 纪律守住
2. 再把 wiki / memory / skill 的边界路由守稳
3. 再扩 MCP，把高价值外部能力接进来
4. 把无需模型理解的工具编排和中间载荷交给已有脚本或受控代码执行器
5. 最后才把已稳定的 skill 升级为 cron automation

原因很简单：边界没守住时，更多外部源只会让上下文更乱；验证不严格时，自动化只会放大错误；skill 还没稳定时，cron 只会把人工噪声周期化。

## Concrete decision rules
### Put it in wiki when
- 这是可长期复用的概念、架构、案例、对比、编译结果
- 回答未来问题时值得被检索与引用

### Put it in memory when
- 这是稳定偏好、长期事实、环境约束
- 信息很短，但未来反复有用

### Put it in a skill when
- 这是一类任务的固定方法
- 已经出现重复 prompt 或重复纠错
- 需要稳定 handoff 和验证步骤

### Use MCP/tooling when
- 信息在 repo / wiki / session 之外
- 数据会变
- 需要直接调用工具而不是只读描述

### Use programmatic execution when
- 多步工具间存在分页、过滤、排序、连接、重试或参数搬运
- 中间结果不需要模型理解，代码可直接得到下一步输入或最终值
- 把流程放入 `execute_code` 能减少模型可见载荷、往返次数或机械调用
- 若每一步都依赖新的语义判断，或单次直接调用已经足够，则不进入该层

### Use cron when
- 方法已稳定
- 输入模式稳定
- 输出目标清晰
- 不需要频繁人工纠偏

## Anti-patterns for AI Agent
- 用 memory 代替 wiki
- 用 session 代替 skill
- 用 prompt 代替方法沉淀
- 用 cron 代替流程设计
- 用 MCP 代替知识建模
- 用“做过了”代替“验证过了”

## Practical interpretation of the Codex article
把 Codex 原文翻成更符合 AI Agent 的一句话就是：
- AI Agent 不该把所有能力都压进一次会话里临时协调，而应把规则、知识、方法、外部能力、验证和调度分层治理。

## Related
- [codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering)
- `x-lanlance-code-mode-json-plumbing-2026-08-24`
- [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`

