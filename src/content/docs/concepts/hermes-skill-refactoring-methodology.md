---
title: AI Agent Skill Refactoring Methodology
author: Hermes Agent
created: 2026-05-15
updated: 2026-09-29
type: concept
tags:
  - agent
  - skills
  - workflow
  - governance
  - verification
  - ai-coding
  - subagent
sources:
  - raw/articles/claude-warp-self-improving-agent-skills-2026-08-26.md
  - raw/papers/arxiv-2608-26263-skill-state.md
  - raw/papers/arxiv-2608-27454-wikiskill.md
  - concepts/agent-self-validation-loops.md
  - concepts/subagent-orchestration-patterns.md
  - docs:https://hermes-agent.nousresearch.com/docs
status: stable
description: 总结 AI Agent skill 重构时从边界收敛、分层到回归验证的可移植方法。
aliases:
  - skill-refactoring
  - agent-skill-refactoring-methodology
---

# AI Agent Skill Refactoring Methodology

## Summary

Skill 重构不应从大重写开始。先明确单一职责、触发与跳过条件、硬安全线、合法例外和验证合约；主 `SKILL.md` 只保留执行时必须看到的规则，长案例和条件细节才进入 `references/`。

证据边界：本页综合公开的 Skill 演化材料和通用验证原则。它没有公开基准证明某种目录结构必然提高成功率，也不表示任何本地 Skill 已按此改造、审查或发布。Skill 格式、加载及执行命令应以目标宿主为准；`SKILL.md` / `references/` 是常见文件式实例，不是所有 Agent 的必要接口。

## When this method applies

适用于一个 Skill 已出现以下信号时：

- 主入口混入大量项目特例；
- 与其他 Skill 的职责边界模糊；
- 合法例外散落，快速扫描时容易误判；
- 安全或授权边界只藏在 reference；
- 完成声明缺少可重复的命令、输出或 artifact。

不适用于仅因“未来可能需要”而做的预防性重构。

## Phase 0: Read-only baseline

先读取主文档、关联 references、调用入口和现有验证器，记录：

- Skill 的实际单一职责；
- 当前触发、跳过和升级条件；
- 常驻规则与条件细节的分布；
- 已存在的测试、静态检查和回滚点；
- 哪些内容只是一次项目经验，不能直接升级为通用规则。

## Phase 1: Tighten the main contract

只修改共享 owner 能解决的问题：

- 把 `When to use / When not to use` 前置；
- 把数据、权限、生产副作用和不可逆操作边界放在主路径；
- 明确合法例外及其额外证据要求；
- 定义完成报告最少需要的可回读证据；
- 删除已被平台能力或其他 Skill owner 覆盖的重复规则。

不要先移动所有文件，也不要为一个实现新建接口或注册表。

## Phase 2: Move conditional detail behind discoverable routes

只有当主入口已过重时才下沉 references。每条路由都应包含任务可识别的触发词，而不只是文件名。

例如：

- run ID collision / atomic report write / lock → CLI reliability reference；
- placeholder URL / source normalization / deduplication → search post-processing reference；
- production state / payment / notification → high-risk test boundary reference。

安全、授权、触发和验证底线仍留在主文档；reference 不能成为隐藏关键约束的地方。

## Phase 3: Preserve behavioral evidence

重构前后至少验证：

1. 代表性任务仍会触发该 Skill；
2. 明确跳过条件仍不会误触发；
3. 主路径能找到必要 reference；
4. 风险边界没有被下沉或弱化；
5. 原有验证器和最小回归检查通过。

对于委派任务，子 Agent 的自述不是证据。父级应回读变更并重跑关键检查；无法复验时把结果标为 provisional，而不是“通过”。

## Phase 4: Bounded review and convergence

独立审查应针对实际变更，而不是只审计划。审查重点：

- 职责是否变窄而没有丢失必要行为；
- 触发词和 reference 是否可发现；
- 安全、授权和回滚是否仍显式；
- 合法例外是否在所有快速扫描位置一致；
- 完成声明能否由真实命令或 artifact 复验。

只修复经父级复核成立的具体问题。没有阻塞或重要问题后停止，不为“更完整”继续扩写。

## Reusable checklist

- 是否确有重构需要，而不是规格性预建？
- 是否先查找并修改现有 owner？
- 主文档前部能否看见适用范围、跳过条件和硬边界？
- 哪些规则必须常驻，哪些只是条件细节？
- references 是否由任务语义触发？
- 是否保留一条可运行的回归检查？
- 子 Agent 或审查结论是否由父级读回验证？
- 变更是否减少重复、替换旧规则或退役过时入口？

## Anti-patterns

- 把一次成功经验直接膨胀成长期通用规则；
- 用“更完整”为理由堆积项目特例；
- 把安全和授权边界藏到 reference；
- 只审计划，不审最终文件；
- 用审查标签替代父级验证；
- 只新增规则，不删除、合并或替换旧规则；
- 把示例配置写成已经部署或获得执行授权。

## Takeaway

Skill 重构的目标不是写更多规则，而是让默认路径更短、责任更清楚、风险边界更可见、例外更明确、证据更可复验。

## Relations
- depends_on: [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- depends_on: [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)
- related: [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- related: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)

## Related
- [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)
- [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [index](/)
- `log`

