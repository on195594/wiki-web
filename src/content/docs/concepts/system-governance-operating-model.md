---
title: System Governance Operating Model
created: 2026-04-21
updated: 2026-09-20
type: concept
tags:
  - hermes
  - governance
  - lifeos
  - operating-model
sources:
  - concepts/lifeos-overview.md
  - concepts/hermes-lifeos-executable-architecture.md
  - concepts/hermes-knowledge-architecture.md
  - concepts/hermes-memory-skills-wiki-boundaries.md
status: stable
description: 定义 LifeOS 和 Hermes 系统治理中的层级边界、变更控制和长期维护模型。
---

# System Governance Operating Model

## Summary
这页提供一个 system governance 参考域：它描述 Hermes 类系统如何保持可治理、可审计、可演化，而不记录某个实例今天的运行状态或待办。

## Core objective
system governance 的核心目标是：
- 保持 LifeOS 的分层边界清晰，不把知识、方法、调度、接入和隔离混成一团
- 让新信息、新需求和新流程能稳定落到正确层，而不是继续堆在聊天里
- 让 Hermes 的能力扩张保持受控，避免 profile、prompt、cron 和外部接入无节制膨胀
- 让系统修改有可追踪的知识依据、操作依据和验证闭环

## What this domain governs
这个领域主要管理：
- `wiki / memory / skills / cron / MCP / profiles / session` 的边界治理
- Hermes 知识资产的组织、索引、日志和检索路径
- 新 workflow 的形式化与沉淀路径
- 自动化启用顺序与升级节奏
- profile 新增的准入条件
- 系统健康检查与结构性复盘

## Core questions
1. 一个新内容应该进 wiki、memory、skill、cron、MCP、profile 还是只留在 session？
2. 一个新流程是否已经足够稳定，可以从聊天技巧升级为 skill 或 cron？
3. 一个新需求是否真的需要新 profile，还是只是知识层/方法层问题？
4. 现有知识库是否仍然可导航、可链接、可维护？
5. Hermes 当前的自动化和外部接入，是否已经超过治理能力？

## Decision principles
### 1. Architecture before convenience
先守结构，再追求省事。短期看方便的混放，长期一定增加系统摩擦。

### 2. Knowledge before automation
先有稳定知识和方法，再上自动化。没有稳定方法的 cron，只会把噪音周期化。

### 3. Minimal sufficient isolation
隔离只在真实风险、真实污染或真实身份边界出现时使用；不要把 profile 当目录树。

### 4. Durable artifacts over chat residue
重要结论先判断公开性和目标 owner：公共通用知识才进入公开页面；私有事实进入其私有 owner；可复用方法可进入受治理的 skill。任何层都不应长期依赖会话残留。

### 5. Governance is an enabling layer
治理不是为了增加流程，而是为了让 LifeOS 能持续扩展而不塌陷。

### 6. Aggressive evolution without durable bloat

低风险、局部、可逆且能立即验证的改进默认直接落到现有 owner；不因缺少历史故障而自动转成试点、观察期或多轮审查。更快演进必须同时更快替换、合并和退役，不能只加速新增。

每次 durable 修改优先回答：更新哪个 owner、替换什么旧内容、能否合并重复规则、能否退出 closed/superseded 入口。默认目标是同一概念族 `net durable growth <= 0`；确需新增 canonical owner 时，必须说明现有 owner 为何无法承载。

评估必须收敛到四种结果之一：

- `APPLY_NOW`：低风险、可逆、可立即验证，直接执行；
- `APPLY_BOUNDED`：方向有价值，直接窄落到现有 owner；
- `DEFER_EXACT`：明确缺少的事实或授权、最小补证动作和重新触发事件；
- `REJECT`：收益低于成本或与当前架构不匹配，不进入模糊 backlog。

资金、安全、凭证、生产、破坏性操作、不可逆迁移和无人监管的 active/runtime 自修改仍保持严格门禁。激进演进反转的是低风险任务的举证责任，不削弱高风险安全边界。

## Interfaces with other domains
### 与 [lifeos-overview](/concepts/lifeos-overview) 的关系
[lifeos-overview](/concepts/lifeos-overview) 定义整个 LifeOS 的一级域和总层次；本页负责解释系统运行层本身如何被治理。

### 与 [family-education-operating-model](/concepts/family-education-operating-model) 的关系
家庭教育域产生的知识、方法、比较框架和周期回顾，最终都要经过 system governance 的分层裁决，才能变成正式资产。

### 与 [personal-finance-and-education-fund-model](/concepts/personal-finance-and-education-fund-model) 的关系
财务与教育基金域中的规则、记录和回顾，需要 system governance 保证其分别落在知识层、方法层和调度层，而不是混写。

### 与 [work-and-career-operating-model](/concepts/work-and-career-operating-model) 的关系
工作与职业域会不断产生项目复盘、能力盘点和决策支持需求；system governance 负责决定哪些成为页面、哪些成为 skill、哪些只保留在 session。

### 与 [personal-growth-operating-model](/concepts/personal-growth-operating-model) 的关系
个人成长域会带来大量输入、想法和方法尝试；system governance 负责把“收藏”压缩成正式知识，把“做法”压缩成技能。

### 与 [hermes-lifeos-executable-architecture](/concepts/hermes-lifeos-executable-architecture) 的关系
[hermes-lifeos-executable-architecture](/concepts/hermes-lifeos-executable-architecture) 提供总边界合同；本页把其中的系统治理域单独抽成一级 operating model，作为 LifeOS 域图的一部分。

## Boundary
这页不直接承载：
- 具体配置改动步骤
- 单个 skill 的完整 SOP
- 某个 cron job 的 prompt 细节
- 某次系统故障排障记录
- 临时实验方案

这些内容应分别进入配置变更、skill、cron、query 或 session。

## Success criteria
这个 operating model 成立时，应看到：
- 新信息能更稳定地落到正确层，而不是先塞进聊天或 memory
- 新 workflow 更容易被收敛成 skill，而不是长期靠提示词手工维持
- 新自动化只有在方法稳定后才上线
- 新 profile 变少但更有明确边界价值
- wiki 的 index/log/related links 能持续支撑导航和审计

## Relations
- depends_on: [lifeos-overview](/concepts/lifeos-overview)
- depends_on: [hermes-lifeos-executable-architecture](/concepts/hermes-lifeos-executable-architecture)
- depends_on: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)

## Related
- [lifeos-overview](/concepts/lifeos-overview)
- [hermes-lifeos-executable-architecture](/concepts/hermes-lifeos-executable-architecture)
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [family-education-operating-model](/concepts/family-education-operating-model)
- [personal-finance-and-education-fund-model](/concepts/personal-finance-and-education-fund-model)
- [work-and-career-operating-model](/concepts/work-and-career-operating-model)
- [personal-growth-operating-model](/concepts/personal-growth-operating-model)
- [index](/)
- `log`
- [hermes-active-surface-lifecycle-governance](/concepts/hermes-active-surface-lifecycle-governance)

