---
title: AI Agent Memory Governance Notes
created: 2026-04-22
updated: 2026-09-29
type: concept
tags:
  - agent
  - memory
  - governance
  - orchestration
  - knowledge-base
sources:
  - raw/articles/machinelearningmastery-ai-agent-memory-strategy-decision-tree-2026-07-11.md
  - concepts/hermes-memory-skills-wiki-boundaries.md
  - concepts/hermes-layer-routing-decision-checklist.md
status: stable
description: 记录 AI Agent memory 的写入、更新、遗忘和跨层治理注意事项。
aliases:
  - memory-governance
  - agent-memory-governance-notes
---

# AI Agent Memory Governance Notes

## Summary
这页提供用户偏好与持久事实存储的精简和跨层路由规则：哪些内容适合留在 `memory`，哪些应进入公开 wiki、受治理的 skill、项目私有状态或仅留在 session。它不描述任何人的当前 memory 内容或容量。`USER.md` / `MEMORY.md` 仅是实现示例；宿主可以采用其他文件、设置或存储接口。

## Why this page exists
在实际使用里，最容易发生的漂移不是“不知道 memory 是什么”，而是：
- 明明知道边界，还是把重要但过长的规则塞进 `memory`
- 把方法、架构原则、治理说明和用户事实混在一起
- 因为最近刚讨论过，就把尚未稳定的内容提前写入 `memory`

常见经验是：`memory` 的问题通常不是缺内容，而是缺少准入和替换纪律。这个判断是方法建议，不是公开实验结论。

## What should stay in memory
只有满足下面四点，才应该继续留在 `memory`：
- 能压成一句高密度表达
- 在相关任务的复用周期内仍有明确有效性；不使用统一 30 天阈值
- 会在很多不同任务里默认起作用
- 不需要多段结构、来源说明或交叉链接

### 用户偏好载体
- 用户长期沟通偏好
- 用户稳定的系统修改偏好与风险偏好
- 用户对 AI Agent 落地方式的长期取向
- 用户持续有效的项目/技术栈默认值
- 用户长期生活与决策背景中会反复影响判断的事实

### 持久事实载体
- 运行环境中的稳定事实
- 经多次验证的工具 quirks
- 不容易重新发现、但会反复影响执行结果的运行限制
- 少量高价值的 provider / endpoint 行为结论

## What should move out of memory
下面这些东西即使重要，也不应该默认常驻 `memory`：

### Move to wiki
适合迁移到 `wiki` 的内容：
- 需要分段解释的治理原则
- 需要和其他页面互相引用的架构规则
- “为什么这样分层”的说明
- 一次治理后沉淀出来的正式判断框架

这类内容的问题不是“不重要”，而是太长、太结构化，放进 `memory` 会挤占默认上下文预算。

### Move to skill
适合迁移到 `skill` 的内容：
- 可重复执行的清理流程
- 配置修复、巡检、备份、组合命令等 SOP
- 需要触发条件、步骤、坑点、验证方式的方法

如果一条内容在回答“以后该怎么做”，它通常更像 `skill` 而不是 `memory`。

### Keep only in session
适合只留在 session 的内容：
- 尚未验证的新想法
- 一次性排障过程
- 本周临时计划状态
- 还没有跨任务复用价值的短期判断

## Compression rules
### Rule 1: Merge by role, not by wording
如果多条记忆都在表达同一个角色，应合并为一条：
- 多条都在表达同一项稳定工作偏好 → 合并
- 多条都在表达“官方文档是 AI Agent 相关设计的校准基线” → 合并
- 多条都在表达同一个 tool quirk → 合并

### Rule 2: Prefer one durable sentence over several nearby fragments
`memory` 更适合一句高密度结论，而不是三四条邻近碎片。碎片越多，越容易让真正重要的新信息写不进去。

### Rule 3: Keep method out of memory unless it compresses into a durable policy
“具体怎么做”通常不该进 `memory`；只有当它能压成一条长期有效的工作政策时，才值得留下。

### Rule 4: If it needs headings, it probably belongs in wiki
一条规则如果需要：
- 背景
- 例外
- 反例
- 相关链接
那么它大概率已经不适合 `memory`。

## Synthetic routing examples
### 例 1：关于 memory 只保留稳定事实的原则
- `memory` 中保留一句压缩版政策
- `wiki` 中保留完整治理说明
- 原因：短政策适合常驻，完整说明适合查阅

### 例 2：关于 skill 应保持窄职责的偏好
- `USER.md` 保留一句稳定偏好
- 具体拆分原则放到相关 `skill` 或 `wiki`
- 原因：偏好和方法不能混放


## Minimal operating policy
以后做 memory 治理时，固定按这个顺序判断：
1. 这条内容能否压成一句？不能 → 不进 `memory`
2. 它是偏好/事实，还是方法/知识？
3. 如果是方法 → `skill`
4. 如果是正式知识或治理说明 → `wiki`
5. 如果还不稳定 → 留在 session

## Current fact versus historical event

`machinelearningmastery-ai-agent-memory-strategy-decision-tree-2026-07-11` 提醒：稳定事实与历史事件需要不同的写入和读取规则。

- 新偏好或环境事实写入前，检查是否替代现有条目；优先更新当前事实，而不是并列追加冲突版本。
- 需要保留变更历史时，把旧值及其时间范围放进获授权的项目记录或历史证据；只有适合公开的通用结论才进入 Wiki，不让它继续作为默认当前事实注入。
- 每条高影响事实尽量保留来源、更新时间和有效性；无法判断当前有效版本时，先检索或向用户确认。
- 成功运行日志属于情境证据，不是程序内存；只有重复、可泛化且有验证门槛的方法才进入 skill/reference。

## Relations
- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- depends_on: [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)

## Related
- `machinelearningmastery-ai-agent-memory-strategy-decision-tree-2026-07-11`
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- [hermes-layer-routing-edge-cases](/queries/hermes-layer-routing-edge-cases)
- [index](/)
- `log`

