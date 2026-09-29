---
title: Hermes Active-Surface Lifecycle Governance
created: 2026-08-01
updated: 2026-09-22
type: concept
tags:
  - hermes
  - governance
  - workflow
  - context-engineering
sources:
  - raw/articles/xda-claude-md-anthropic-engineers-2026-07-31.md
  - concepts/system-governance-operating-model.md
  - concepts/hermes-context-layer-operating-rules.md
  - concepts/agent-failure-closed-loop-evaluation.md
status: stable
description: 定义 Hermes 活跃治理面的基线、校准、晋升、验证、运行、重基线与退役生命周期，避免规则和自动化只增不减。
aliases:
  - active-surface-lifecycle
  - hermes-governance-lifecycle
---

# Hermes Active-Surface Lifecycle Governance

## Summary

Hermes 的 active surface 不是只增不减的配置集合。`SOUL.md`、USER/MEMORY、`AGENTS.md`、skills、MCP/tools、wrappers、quick commands、cron、plugins、profiles 和 runtime config 都会持续影响后续任务，因此必须同时治理其创建、晋升、验证、重基线和退役。

本页把 XDA 关于 `CLAUDE.md` 的经验抽象为跨 Hermes 层的生命周期：**Bootstrap → Calibrate → Promote → Validate → Operate → Rebase → Retire**。它补充 [system-governance-operating-model](/concepts/system-governance-operating-model) 对扩张节奏的原则，但不授权任何 active-layer 修改。

## What counts as an active surface

只要一个对象会持续改变后续任务的可见上下文、候选能力、执行路径、权限或调度，就属于 active surface：

- 默认指令与身份边界：`SOUL.md`、USER/MEMORY、全局或项目 `AGENTS.md`；
- 按需方法与路由：skills、skill references、quick commands；
- 能力与权限面：MCP、tools、plugins、profiles；
- 执行与调度面：wrappers、gateway hooks、cron、runtime config；
- 项目局部规则：项目 context、README、ADR、spec；
- Wiki 不直接执行，但可能成为检索与晋升候选，应治理重复和陈旧概念。

这与 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules) 的上下文装配边界互补：装配规则回答“哪些资产进入本轮上下文”，生命周期回答“活跃治理面如何演化和退出”。

## Why active surfaces accumulate debt

活跃面会形成三类债务：

1. **上下文债务**：常驻规则、长 skill 正文或重复 project context 挤占注意力和 token 预算。
2. **路由债务**：enabled skills、相似 tools 和重叠 triggers 增加误选、漏选和冲突。
3. **行为债务**：cron、hooks、wrappers、MCP 和 runtime 默认值继续执行已经失去原始需求的行为。

一条规则曾经正确，不代表它应永久保持相同权威。它可能只是对旧模型缺陷、旧工具语义或旧项目结构的临时补丁。

## Lifecycle

### 1. Bootstrap

从 live state 建立事实基线，不从旧报告或文章模板推断当前状态：

- 枚举当前启用的指令、skills、tools、MCP、cron、wrappers、plugins 和 profiles；
- 记录 owner、作用层、权限、外部副作用和当前验证入口；
- 自动扫描只能形成初稿，不能代替人工边界判断。

### 2. Calibrate

人工补充扫描无法知道的内容：

- 设计意图和非目标；
- 凭证、生产、资金、隐私与破坏性边界；
- 为什么采用该规则，以及什么现象说明它已经失效；
- 应常驻、按需加载，还是只保留为 Wiki/项目证据。

### 3. Promote

按风险与证据晋升，而不是因文章“看起来有用”直接上线：

- 安全、凭证、资金、生产和破坏性操作可以预防性设置硬边界；
- 一般工作流改进应由真实摩擦、用户纠正或可复发失败触发；
- 外部文章默认先进入 Wiki、session 或 project-local candidate；
- 优先补现有 owner，避免创建新的微型 skill 或重复 gate。

### 4. Validate

验证行为，不只验证文本存在：

- 普通窄修复默认使用“原失败案例 + 一个最相关反向边界案例”；
- routing、tool、MCP、wrapper 和 cron 需要验证实际发现或执行路径；
- 高风险变更保留审批、备份、停止条件和回滚；
- 不用长时间观察代替一个已经可判定的最小行为检查。

参见 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation)。

### 5. Operate

从真实使用收集低噪声证据：

- 是否命中正确 trigger；
- 是否减少重复纠正；
- 是否制造路由冲突、延迟、token 成本或维护负担；
- 是否仍有明确 owner 和当前需求。

不要为健康工作流默认建立持续 observer；真实失败和用户纠正优先。

### 6. Rebase

出现实质变化时重新建立基线：

- 主模型或 provider 能力明显变化；
- Hermes runtime、tool schema 或权限语义改变；
- 项目结构、验证命令或责任边界改变；
- skill 路由、默认上下文或 active surface 发生可观测冲突；
- 原规则防范的问题已无法复现，或新失败表明旧规则方向错误。

Rebase 是事件触发的重新验证，不是固定周期清空。文章中的“约每半年删除一次”只能作为提醒，不能成为 cron 或硬阈值。

### 7. Retire

对候选项做 `keep / move-to-JIT / merge / downgrade-to-wiki / archive / retire` 分类：

- 高风险安全边界不能因为模型升级而自动删除；
- 退役前先检查调用者、cron/script/reference、fallback 和历史证据；
- 保留可回滚备份和 copy-pasteable rollback；
- 历史结论标记为 superseded，不伪装成从未存在；
- 删除、归档和 live behavior 变更仍受 active-layer 风险分级与审批约束。

## Decision rules

对每个重要 active surface，至少能回答：

- Owner：由哪个 skill、配置、项目或运行组件负责？
- Trigger：何时进入上下文或执行路径？
- Evidence：解决了什么真实失败或风险？
- Skip：何时不应应用？
- Authority：背景知识、可选指导、默认行为还是硬边界？
- Supersession：哪些模型、runtime 或项目变化会触发重审？
- Rollback：如何恢复？

不要把这组问题扩展成全系统强制台账。它只应用于高频默认指令、active skills、MCP/tools、wrappers、cron、plugins/profiles 和 runtime config；普通 Wiki 页面与临时 session 状态不需要承担同等仪式成本。

## Anti-patterns

- 定期无差别清空 skills、memory、hooks 或配置；
- 把“出现三次”固化为所有规则的统一硬阈值；
- 每次模型升级都重建全部活跃面；
- 仅根据文件大小或规则年龄自动删除；
- 为规则清理新增 cron、持续 observer 或复杂评分系统；
- 把治理建议复制进多个 skills，形成第二套重复规则；
- 用文本 validator 通过代替注册发现、实际执行或负向边界验证。

## Practical checklist

发生模型/runtime 大版本变化或真实治理摩擦时：

1. 读取 live state，而不是复用旧审计结论；
2. 定位 owner 与原始失败/风险证据；
3. 选择 keep、JIT、merge、downgrade 或 retire；
4. 对变更候选做备份和最小 diff；
5. 执行最小相关行为验证；
6. 记录 superseded、rollback 和明确未触及的 active layers；
7. 验证通过即结束，不扩大为预防性治理项目。

## Source boundary

XDA 原文讨论的是 Claude Code 的项目上下文文件，并转述 Boris Cherny 关于定期删除 `CLAUDE.md`、skills 和 hooks 的经验建议。将其映射到 Hermes 全活跃面属于本地推论；原文没有验证 Hermes 的层级设计，也没有提供跨模型、跨项目的定量数据。固定半年周期因此不进入 Hermes 默认行为。

## Relations

- refines: [system-governance-operating-model](/concepts/system-governance-operating-model)
- depends_on: [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- depends_on: [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation)
- related: [agent-context-engineering](/concepts/agent-context-engineering)
- related: [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management)

## Related

- [system-governance-operating-model](/concepts/system-governance-operating-model)
- [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- [agent-context-engineering](/concepts/agent-context-engineering)
- [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management)
- [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation)
- [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities)
- [index](/)
- `log`

