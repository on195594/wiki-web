---
title: Hermes Layer Routing Edge Cases
created: 2026-04-17
updated: 2026-05-18
type: query
tags:
  - hermes
  - workflow
  - decision
  - configuration
  - automation
  - mcp
sources:
  - concepts/hermes-layer-routing-decision-checklist.md
  - queries/hermes-layer-routing-sample-cases.md
  - docs:hermes-agent/user-guide/features/memory
  - docs:hermes-agent/user-guide/features/skills
  - docs:hermes-agent/user-guide/features/cron
  - docs:hermes-agent/user-guide/features/mcp
status: stable
description: 沉淀 Hermes layer routing 中容易混淆的边界案例和判定结果。
aliases:
  - layer-routing-edge-cases
---

# Hermes Layer Routing Edge Cases

## Summary
这页专门处理最容易误判的边界场景：`skill + cron`、`memory vs wiki`、`MCP vs skill`、`session vs 长期层`。目标不是给出抽象定义，而是回答“看起来两个层都能放时，到底该怎么裁决”。校准原则仍然是：`memory / skills / cron / MCP` 先对齐 Hermes 官方文档，`wiki` 视作当前本地知识库的正式知识层。

## Question
当一个信息或需求同时看起来像两层甚至三层都能承载时，Hermes 应该如何避免误放？

## Edge case 1: `skill + cron`
### 场景
“每天 30 分钟检查一次站点状态，异常时通知我。”

### 正确拆分
- `skill`：定义检查方法
- `cron`：定义调度频率

### 为什么容易误判
很多人会直接把整件事理解成“定时任务”，于是只想到 `cron`。

### 裁决规则
先问：如果把定时拿掉，这件事本身是否还是一个可复用方法？
- 是 → 先做 `skill`
- 再看是否已经稳定到值得定时化 → 再上 `cron`

### 官方校准点
- Hermes 官方把 `skills` 定义为 procedural memory
- 官方把 `cron` 定义为 fresh-session scheduler
- 所以 `cron` 不是方法层，只是调度层

## Edge case 2: `memory vs wiki`
### 场景
“以后 Hermes 相关规划要先参考官方文档。”

### 正确拆分
- 短版行为提醒 → `memory`
- 如果进一步整理成“官方文档优先的设计准则与使用方法” → `wiki`

### 为什么容易误判
因为它既像一个长期规则，也像一个值得长期查阅的设计原则。

### 裁决规则
先问两个问题：
1. 能不能压成一句稳定规则？
2. 是否需要来源、结构、小节和交叉链接？

如果：
- 能压成一句，且主要作用是长期提醒 → `memory`
- 需要结构化解释、边界、案例、扩写 → `wiki`

### 官方校准点
- 官方 memory 文档强调 strict character limits 和 curated memory
- 超过“短小稳定事实”的内容，不该硬塞进 memory

## Edge case 3: `MCP vs skill`
### 场景
“让 Hermes 能读 GitHub issues，并按我们的标准生成 triage 结果。”

### 正确拆分
- GitHub 能力接入 → `MCP`
- triage 流程与判断方法 → `skill`

### 为什么容易误判
因为用户经常把“接能力”和“怎么用能力做事”混成一句话。

### 裁决规则
拆成两问：
1. 这个问题是不是在请求外部实时能力？是 → `MCP`
2. 这个问题是不是在请求固定工作方法？是 → `skill`

### 反例
如果只做 `skill`，没有 MCP，方法写得再好也拿不到实时 GitHub 数据。
如果只做 `MCP`，没有 `skill`，Hermes 只能“能访问 GitHub”，但不会稳定按你的 triage 标准工作。

### 官方校准点
- 官方 MCP 文档把 MCP 定义成外部 tool server 接入层
- 官方 skills 文档把 skill 定义成可复用的方法文档

## Edge case 4: `session vs memory`
### 场景
“这次排障里临时决定先绕过方案 A，用方案 B，后续未必还会这样做。”

### 正确拆分
- 默认留在 `session`
- 只有反复验证后，才考虑升到 `memory`

### 为什么容易误判
因为它看起来“很重要”，人很容易把“重要”误当成“应该长期保存”。

### 裁决规则
不要问“重不重要”，要问“稳不稳定”。
- 只是这轮会话里的临时决策 → `session`
- 已经被反复验证为长期规则 → `memory`

### 官方校准点
- 官方 memory 文档明确跳过 session-specific ephemera
- 临时决策、一次性上下文，不该污染持久记忆层

## Edge case 5: `session vs wiki`
### 场景
“刚讨论出一个架构想法，但还没验证，也没有形成稳定结论。”

### 正确拆分
- 默认先留在 `session`
- 等结构和结论稳定后，再编译进 `wiki`

### 为什么容易误判
因为它“听起来很像方法论”，容易过早正式化。

### 裁决规则
如果还处在探索态、争议态、未验证态，不要急着变正式知识页。
只有当它已经能被写成：
- 有明确主题
- 有稳定结论
- 有长期复用价值
- 能和其他页面交叉链接

才值得升 `wiki`。

## Edge case 6: `wiki vs skill`
### 场景
“我们总结出一套 Hermes 知识入库原则。”

### 正确拆分
- 原理、边界、架构理解 → `wiki`
- 真正的入库执行流程 → `skill`

### 为什么容易误判
因为“原则”与“执行方法”经常长得很像。

### 裁决规则
看它回答的问题：
- 回答“是什么 / 为什么这样” → `wiki`
- 回答“具体怎么做、按什么步骤做” → `skill`

### 实战判断
如果一页内容里大量出现：
- step 1 / step 2 / verification / pitfalls
那大概率更适合 `skill`。

如果一页内容里大量出现：
- summary / principles / boundaries / related concepts
那大概率更适合 `wiki`。

## Edge case 7: `memory vs skill`
### 场景
“不要把 API keys 写进配置文件，统一放环境变量文件。”

### 正确拆分
- 用户级长期安全偏好 → `memory`
- 如果扩展成完整 secrets handling 流程 → 另做 `skill`

### 为什么容易误判
因为安全规则常常既像偏好，又像操作流程。

### 裁决规则
如果它只是一个短规则，未来每次都需要默认记住 → `memory`。
如果它已经变成多步操作方法、需要检查与验证 → `skill`。

## Edge case 8: `MCP vs cron`
### 场景
“我想每天从外部监控系统抓错误并汇总。”

### 正确拆分
- 监控系统接入 → `MCP`
- 每天执行 → `cron`
- 如果汇总格式有稳定方法 → 还需要 `skill`

### 为什么容易误判
因为用户说的是一个完整结果，里面实际混了接入、方法、调度三层。

### 裁决规则
按顺序拆：
1. 没接入能力前，先别谈自动化 → `MCP`
2. 有了能力后，确定方法是否稳定 → `skill`
3. 最后才是定时化 → `cron`

## Edge case 9: `wiki + memory`
### 场景
“先查 wiki，再补 memory / skills / sessions / external。”

### 正确拆分
- 系统级检索原则全文 → `wiki`
- 压缩成一条长期行为提醒 → 可补一条 `memory`

### 为什么容易误判
因为它既是系统架构知识，也是 agent 的长期默认行为。

### 裁决规则
主承载层看“内容体积和结构需求”：
- 需要完整解释和扩写 → `wiki`
- 只需要一句默认提醒 → `memory`

通常：
- `wiki` 为主
- `memory` 为辅
而不是反过来。

## Edge case 10: 先留 `session`，别急着升长期层
### 场景
“这次任务里刚试出一个 workaround，但还不知道是不是通用。”

### 正确做法
先留在 `session`，继续观察。

### 升级条件
只有满足以下之一再升级：
- 重复出现，已证实是稳定 quirk → `memory`
- 提炼成固定处理流程 → `skill`
- 抽象成长期架构或知识结论 → `wiki`

### 核心原则
长期层不是“重要信息回收站”，而是“稳定资产层”。

## Quick arbitration rules
遇到纠结时，用这 6 条裁决：
1. 接外部能力 → `MCP`
2. 定义方法 → `skill`
3. 定义调度 → `cron`
4. 短小稳定事实 → `memory`
5. 正式知识资产 → `wiki`
6. 还不稳定 → `session`

## Common edge-case mistakes
- 把“重要但未稳定”的内容过早写进 memory
- 把“方法”误写成 wiki，导致只剩概念没有执行性
- 把“接入能力”误写成 skill，结果没有真实工具可用
- 把“定时需求”直接做成 cron，却没有先收敛方法
- 把 `wiki` 当默认收纳层，导致知识页里混进大量未验证的任务态内容

## Takeaway
一句话总结：
- 当两个层都像能装下时，不要按“重要性”选，而要按“职责”选；职责仍然是：`MCP` 管能力、`skill` 管方法、`cron` 管调度、`memory` 管短小稳定事实、`wiki` 管正式知识、`session` 管未稳定过程。

## Relations
- depends_on: [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- depends_on: [hermes-layer-routing-sample-cases](/queries/hermes-layer-routing-sample-cases)

## Related
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- [hermes-layer-routing-sample-cases](/queries/hermes-layer-routing-sample-cases)
- [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [index](/)
- `log`

