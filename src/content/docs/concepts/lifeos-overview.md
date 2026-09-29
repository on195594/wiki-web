---
title: LifeOS Overview
created: 2026-04-21
updated: 2026-09-29
type: concept
tags:
  - lifeos
  - operating-model
  - agent
  - governance
sources:
  - concepts/companyos-to-lifeos-filesystem-philosophy.md
  - concepts/hermes-lifeos-executable-architecture.md
status: stable
description: 概述可配置 LifeOS 的核心层次、可选领域和治理边界，不保存个人状态。
aliases:
  - lifeos
---

# LifeOS Overview

## Summary
这页提供一个可配置 LifeOS 的总览模板。它定义可选领域、跨域关系、AI Agent 可承担的角色，以及公开知识、私有状态和执行层的边界；它不描述作者当前生活或系统状态。

## Core thesis
这里的 LifeOS 不是“一个万能助手”，而是“一个受治理的语义空间 + 一套受控执行机制”。

一个采用者通常需要它满足四件事：
- 能沉淀长期知识，而不是只留下聊天记录
- 能把高频决策压成可重复方法，而不是每次重新想
- 能在家庭、教育、工作、资产、成长之间做跨域协同
- 能保持简单、可治理、可审计，而不是堆越来越多 profile 和 prompt

## Optional domain map
以下五个页面是可复用的领域模板，不表示任何采用者必须启用或已接入这些领域：
- [family-education-operating-model](/concepts/family-education-operating-model)
- [personal-finance-and-education-fund-model](/concepts/personal-finance-and-education-fund-model)
- [work-and-career-operating-model](/concepts/work-and-career-operating-model)
- [personal-growth-operating-model](/concepts/personal-growth-operating-model)
- [system-governance-operating-model](/concepts/system-governance-operating-model)：即 AI Agent 本身的知识、方法、自动化与边界治理

前四类可作为对象层示例，最后一类是系统运行层。采用者应删除不需要的域，而不是把私有资料复制进公共 Wiki。

## AI Agent role in the system
AI Agent 在当前 LifeOS 里不是替代你做人生决策的主体，而是执行内核：
- `wiki` 保存正式知识
- `memory` 保存短小稳定偏好与长期事实
- `skills` 保存重复方法
- `cron` 负责周期执行
- `MCP` 负责接入外部实时系统
- 主协调上下文负责承载统一语义层；不要求存在名为 `default` 的 profile

所以 AI Agent 更像 LifeOS 的“操作系统内核 + 自动化编排器”，不是一个无边界的大脑盒子。

## Domain relationships
### 家庭教育 -> 财务模型
教育路径不是独立问题，它直接影响教育基金、现金流安全边界、家庭时间配置和居住/择校决策。

### 工作职业 -> 财务模型
工作收入稳定性决定教育基金与长期配置的风险承受能力；职业升级空间也决定是否需要为孩子教育目标预留更大的兜底预算。

### 个人成长 -> 工作职业
成长不是兴趣附属品，而是职业上升、判断质量、表达能力和长期竞争力的底层变量。

### 个人成长 -> 家庭教育
你的表达、判断、耐心、学习方式，会反过来塑造家庭沟通质量与孩子的成长环境。

## System layers
LifeOS 当前按以下层次运行：
1. 正式知识层：`$WIKI_ROOT`
2. 稳定事实层：`memory`
3. 方法层：`skills`
4. 调度层：`cron`
5. 接入层：`MCP`
6. 隔离层：`profiles`
7. 探索层：`session`

更完整的边界定义见 [hermes-lifeos-executable-architecture](/concepts/hermes-lifeos-executable-architecture)。

## Design principles
### 1. Unified semantic layer first
先统一语义层，再扩执行层。也就是先回答“人生系统里有什么对象、关系、约束”，再谈 cron、MCP 或更多 profile。

### 2. Small and governable
系统应优先可治理，而不是看起来强大。能用一个协调 profile 跑通的，不拆第二个；profile 或其他运行环境的名称、权限与隔离能力以目标宿主为准。

### 3. Knowledge before automation
先形成正式知识和稳定方法，再自动化。没有稳定方法的自动化，只会把噪音放大。

### 4. Cross-domain coherence
任何重要决策都应允许跨域回看：教育问题不能脱离现金流，财务问题不能脱离职业稳定性，职业问题不能脱离家庭节奏。

## What this page is not
这页不是：
- 每日/每周 SOP
- cron 设计页
- 家庭教育具体策略页
- 投资操作手册

它只是总览页，回答的是“LifeOS 整体长什么样”。

## Success criteria
如果 LifeOS 总览层跑对了，会出现这些特征：
- 新主题能快速落到已有一级领域，而不是临时发散
- 新知识能找到明确挂载点
- 新方法能知道应该沉淀为 skill 而不是继续堆在聊天里
- 重要决策会自然跨到相邻领域回看，而不是单点局部最优

## Relations
- depends_on: [companyos-to-lifeos-filesystem-philosophy](/concepts/companyos-to-lifeos-filesystem-philosophy)
- depends_on: [hermes-lifeos-executable-architecture](/concepts/hermes-lifeos-executable-architecture)

## Related
- [hermes-lifeos-executable-architecture](/concepts/hermes-lifeos-executable-architecture)
- [companyos-to-lifeos-filesystem-philosophy](/concepts/companyos-to-lifeos-filesystem-philosophy)
- [family-education-operating-model](/concepts/family-education-operating-model)
- [personal-finance-and-education-fund-model](/concepts/personal-finance-and-education-fund-model)
- [work-and-career-operating-model](/concepts/work-and-career-operating-model)
- [personal-growth-operating-model](/concepts/personal-growth-operating-model)
- [system-governance-operating-model](/concepts/system-governance-operating-model)
- [index](/)
- `log`

