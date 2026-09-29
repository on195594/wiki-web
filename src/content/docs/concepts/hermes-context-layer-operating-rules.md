---
title: AI Agent Context Layer Operating Rules
created: 2026-04-29
updated: 2026-09-29
type: concept
tags:
  - agent
  - lifeos
  - context-engineering
  - knowledge-base
  - workflow
  - governance
sources:
  - raw/articles/machinelearningmastery-effective-context-engineering-ai-agents-2026-04-28.md
  - raw/articles/machinelearningmastery-ai-agent-memory-strategy-decision-tree-2026-07-11.md
  - raw/papers/arxiv-2608-26263-skill-state.md
  - concepts/hermes-context-engineering-design-priorities.md
  - concepts/hermes-lifeos-executable-architecture.md
  - concepts/hermes-layer-routing-decision-checklist.md
  - concepts/hermes-memory-skills-wiki-boundaries.md
  - docs:https://hermes-agent.nousresearch.com/docs
status: stable
description: 定义 AI Agent context layer 在检索、压缩、路由和执行前装配中的操作规则。
aliases:
  - context-layer-rules
  - agent-context-layer-operating-rules
---

# AI Agent Context Layer Operating Rules

## Summary
这页把 context engineering 文章对当前 AI Agent 的启发压成一套上下文装配规则：在资产归属已经确定后，决定本轮加载什么、压缩什么、如何保持长任务状态。内容应进入 memory、skill、wiki 还是 session 由 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 维护；组合路由由 [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist) 维护。

Machine Learning Mastery 这篇文章提供的底层原则是：上下文窗口不是资料仓库，而是每轮推理的工作内存。AI Agent 的 wiki、文件、日志和项目状态应承担外部长期资产角色；当前 session 只承担即时工作内存角色。

## Goal
让 AI Agent 在长期使用中避免三类退化：
- 上下文污染：临时状态、旧结论、长摘要、过期工具输出和早期错误推理进入默认上下文
- 层间串味：公共 Wiki 混入私有执行状态或宿主专属执行契约、skill 写成百科、memory 变成 changelog
- 长任务漂移：任务推进依赖聊天历史，越聊越偏离原始目标

## Core principles
### 1. Context window is RAM, not archive
上下文窗口快、贵、有限，只放当前步骤需要的高信号内容；wiki、文件、数据库和 raw source 更像 disk，需要时再显式取回。

### 2. Static and dynamic context must be separated
系统规则、工具 schema、固定边界属于静态层；用户当前目标、最近工具结果、检索片段和当前状态属于动态层。静态层应尽量稳定，动态层应尽量小而准。

### 3. History requires compression and decay
历史不是越全越好。旧错误、过期工具输出、已解决分支和冗余检索结果会造成 context poisoning，应压成状态卡、移出当前窗口，或写回合适的长期载体。

### 4. Retrieval is a budget decision
检索命中不等于应该注入 prompt。每个候选片段都要按相关性、密度、可信度、去重后价值和 token 成本裁决。

### 5. Context quality must be testable
不能只看最终回答是否“看起来不错”。压缩、检索和状态更新后，应能用 probe 检查关键事实是否仍被保留，例如当前目标、已做决策、已处理文件、下一步。

### 6. Long-horizon execution state is a validated projection, not a rolling recap
`arxiv-2608-26263-skill-state` 为长程程序性任务增加了更强约束：下一步默认只消费不可变执行契约、经校验的当前状态和最新观察。模型只提议状态 patch；确定性层拥有 Schema、merge、删除、版本和回滚语义。完整历史是外部审计与恢复证据，不是每轮 Prompt 的默认运行时真相源。

启用条件：任务确实长程且状态密集、存在有界领域 Schema、patch 可确定性校验、历史轨迹不是任务输出。跳过或采用混合模式：动态 Schema、延迟相关观察、审计/解释型任务、并发写状态、无界状态或低可靠结构化输出。不得把论文中的 Token/准确率结果直接设为 AI Agent 阈值。

## Context assembly by source

### 1. Current session
只保留当前目标、必要假设、最新工具观察和尚未收敛的工作集。已解决分支、重复说明和过期结果应移出，而不是靠完整对话维持状态。

### 2. Memory
只注入与当前任务相关的短小稳定约束；memory 的内容资格由 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 裁决。默认可见不等于全部相关，也不允许用 memory 中的旧环境事实替代实时检查。

### 3. Skill
只加载与当前操作匹配的程序性资产，并保留其触发条件、边界和验证步骤。skill 是否应存在属于内容与执行方法路由；本页只决定它是否需要进入本轮上下文。

### 4. Wiki and raw
按问题范围检索少量正式页面或段落，先执行 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 的 Freshness Gate。只有需要原始措辞、证据范围或 Wiki 缺口时才补 raw；命中不等于全部注入。

### 5. Project state
长任务的当前状态应成为聊天历史之外的经校验投影。建议只保留：

- 当前目标和不可变契约 / Skill / Spec 版本
- 已确认决策与已验证事实的证据指针
- 未决问题、已完成步骤和下一步
- 风险、约束、状态版本、最近 patch 与回滚点
- 相关文件、skill 与 Wiki 页面

下一步默认消费这份状态、最新观察和不可变契约；完整历史留作审计与恢复证据，不作为每轮运行时真相源。

### 6. Cron and logs
若目标版本和部署支持周期触发，每次运行以自包含输入装配稳定方法、必要状态和输入；logs 只在与当前判断相关时裁剪进入上下文。调度资格与组合方式由 [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist) 维护。

### 7. Subagent
子任务适合独立完成且能返回有界结果时，用 subagent 隔离细节。主 agent 保留目标、约束、决策权和验证责任；subagent 返回结论、证据指针、风险和未决点，而不是完整过程。

生命周期复杂度规则见 `[[subagent-orchestration-patterns]]`：默认把 subagent 当作一次性 inline tool；只有在任务真正独立且并发有收益时才 fan-out；agent pool 和 team 模式需要项目级验证、清理机制和可观测性后再考虑。

## Retrieval and history budget

`machinelearningmastery-ai-agent-memory-strategy-decision-tree-2026-07-11` 的本地内容映射由 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 维护；本页只保留装配约束：

- session 是当前工作内存，不是档案；
- 历史事件只有在当前步骤相关时才检索进入 context，不默认注入；
- 稳定事实优先读取当前有效版本，旧版本仅在查询历史时暴露；
- 检索规模由 context budget 约束，大历史库不能因为“命中”就全量注入；
- 程序性资产只在任务匹配时按需加载，不把整个 skill 库塞入上下文。

## One-screen assembly checklist

1. 固定当前目标、不可变约束和验收标准。
2. 长任务先读取并校验 project state；短任务只保留必要 session 工作集。
3. 注入与任务相关的短小 memory 约束，不加载无关 profile 历史。
4. 检索少量相关 Wiki 段落并执行 Freshness Gate；只在需要时补 raw 或 live evidence。
5. 操作任务加载匹配的 skill；复杂独立子任务才隔离给 subagent。
6. 加入最新工具观察，移除过期输出、已解决分支和重复背景。
7. 用 probe 检查目标、关键决策、已处理对象和下一步是否仍完整。

若问题是“内容长期放哪”或“是否组合 cron/MCP”，分别回到 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 与 [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)，不在本页另维护一套晋升规则。

## Promotion is separate from assembly

内容被加载、压缩或写入 project state，不自动获得进入 memory、skill 或公共 Wiki 的资格。阶段收敛后只提炼可复用结论；完整过程日志仍留在原有项目或审计载体。

## Drift signals
出现这些信号时，说明上下文治理需要介入：
- AI Agent 重复询问已经稳定的偏好
- memory 里出现任务进度或一次性结论
- skill 变成长篇概念说明
- Wiki 混入私有聊天记录或当前任务台账；公开 runbook 不属于这种混放
- 长任务靠翻聊天历史才能继续
- subagent 返回大量过程而非结论和证据
- cron 任务依赖当前线程上下文
- AI Agent 重复读取已处理文件或重述旧决策

## Repair actions
- 过期工具输出或已解决分支 → 移出当前上下文
- 检索结果过多 → 按范围、可信度和 token 预算裁剪
- 长任务依赖聊天回放 → 重建并校验 project state
- 操作步骤反复解释 → 按需加载已有 skill；是否新建 skill 交给路由规则
- 上下文过载 → 保留状态与验收后开 fresh session
- 独立复杂子任务串味 → 用有界 handoff 隔离 subagent

需要把发现持久化或增加调度/外部接入时，转到对应规则页，不在修复上下文时顺手晋升。

## Reference deployment policy

以下 profile、gateway、cron、memory 和 subagent 均为可选能力类别；不存在时跳过，具体名称和隔离语义以宿主为准。
在目标 AI Agent 版本支持相关能力时，可采用以下保守策略：
- 没有明确隔离收益时不增加 profile；协调 profile 的名称由部署者决定
- 消息入口、CLI 或其他 gateway 只是可选接入面，不应成为知识正确性的前提
- 新 workflow 先用公开或合成 fixture 验证，再决定是否 skill 化或调度
- 修改 AI Agent 本体前先核对目标版本和升级覆盖风险，必要时走上游 issue/PR

这些是参考规则，不表示任何 profile、gateway、skill 或 cron 已经部署或获得授权。

## Source integration note
Machine Learning Mastery 文章的处理结果：
- 原文和 Gemini 摘要保存在 `[[machinelearningmastery-effective-context-engineering-ai-agents-2026-04-28]]`，作为可追溯 raw source。
- 可复用原则已整合进本页 Summary、Goal 和 Core principles，不再作为独立文章摘要重复出现。
- memory 的内容资格由 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 维护；本页只约束相关条目何时进入当前 context。
- 若未来多次需要执行上下文审计，再提炼为专门 skill；当前不提前创建。

## Relations
- depends_on: [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities)
- depends_on: [hermes-lifeos-executable-architecture](/concepts/hermes-lifeos-executable-architecture)
- depends_on: [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)

## Related
- `machinelearningmastery-ai-agent-memory-strategy-decision-tree-2026-07-11`
- [agent-context-engineering](/concepts/agent-context-engineering)
- [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities)
- [llm-context-engineering-layer](/concepts/llm-context-engineering-layer)
- [hermes-lifeos-executable-architecture](/concepts/hermes-lifeos-executable-architecture)
- [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution)
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [index](/)
- `log`

