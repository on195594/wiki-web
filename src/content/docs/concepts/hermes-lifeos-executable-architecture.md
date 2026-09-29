---
title: Hermes LifeOS Executable Architecture
created: 2026-04-21
updated: 2026-09-20
type: concept
tags:
  - hermes
  - lifeos
  - architecture
  - workflow
  - governance
sources:
  - concepts/companyos-to-lifeos-filesystem-philosophy.md
  - concepts/hermes-knowledge-architecture.md
  - concepts/hermes-memory-skills-wiki-boundaries.md
  - queries/hermes-layer-routing-edge-cases.md
  - docs:https://hermes-agent.nousresearch.com/docs
status: stable
description: 定义 Hermes LifeOS 如何把知识、记忆、技能、工具和自动化组织为可执行架构。
aliases:
  - lifeos-executable-architecture
---

# Hermes LifeOS Executable Architecture

## Summary
这页把“LifeOS 在上、Hermes primitives 在下、profiles 只做少量边界隔离”整理成可移植参考架构。它描述职责、越界规则、采用顺序和验收条件，不表示某个 Hermes 实例已按此部署。

## Goal
在适用的 Hermes 版本中，可以用一个协调 profile 组织 LifeOS：
- 正式知识沉淀到部署者选择的 `$WIKI_ROOT`
- 稳定偏好与长期事实只保留在 `memory`
- 可复用方法沉淀为 `skills`
- 周期性动作通过 `cron` 运行
- 外部系统能力通过 `MCP` 接入
- `profiles` 只在确有隔离必要时使用

## Core design decision
### 主判断
LifeOS 不是由多个 profile 拼出来的，而是由一个统一语义层 + 少量受控执行层组成。

### 参考拓扑
- 协调 profile：承载 LifeOS 主语义层；名称和能力以目标版本为准
- `$WIKI_ROOT`：正式知识与结构化页面
- `memory`：短小稳定规则、偏好、环境事实
- `skills`：重复工作的方法层
- `cron`：已稳定方法的调度层
- `MCP`：外部系统接入层
- 少量专用 `profiles`：只承担高摩擦隔离边界

## Layer boundary contract

The full layer-by-layer contract now lives in [hermes-lifeos-layer-boundary-contract](/concepts/hermes-lifeos-layer-boundary-contract).

This hub keeps only the architecture-level summary:

| Layer | Architecture role | Default route |
|---|---|---|
| `wiki` | Formal LifeOS knowledge layer | Concepts, domain models, decision records, cross-linked reference pages |
| `memory` | Short stable user/environment facts | One-sentence preferences, durable constraints, tool quirks |
| `skill` | Repeatable method layer | Reusable workflows with triggers, steps, pitfalls, and verification |
| `cron` | Scheduling layer | Stable methods running in fresh sessions |
| `MCP` | External live-system capability layer | Calendar, mail, docs, maps, GitHub, monitoring, or other tool access |
| `profile` | Runtime-state isolation layer | Work/personal separation, public bot identity, lab experiments, high-risk isolation |
| `session` | Temporary working context | Exploration, in-flight reasoning, one-off state |

LifeOS-specific boundary rule:

- Keep the main LifeOS semantic layer in the `default profile`.
- Use `wiki / memory / skill / cron / MCP` for domain and method separation before considering profile separation.
- Create a new `profile` only when runtime state needs isolation: memory, cron, gateway identity, experimental model/prompt surface, or high-risk automation.
- Do not create one profile per life domain.

Anti-boundary-crossing summary:

- Do not put long knowledge into `memory`.
- Do not shrink a method into a `cron` prompt.
- Do not turn a concept page into a `skill`.
- Do not use `profile` as a topic folder.
- Do not promote a session conclusion just because it feels important.

## Reference deployment choices

- 单一协调 profile：适合没有明确运行时隔离需求的部署。
- 工作隔离 profile：只在工作记忆、凭证、调度或身份必须与其他域隔离时采用。
- 公共 bot profile：只在多人可触发入口需要独立权限和状态时采用。
- 实验 profile：只在新模型、prompt、skill 或 provider 可能影响稳定路径时采用。

这些名称是合成示例；不表示 profile 已创建。默认选择是先用 wiki、skill、project context 和权限边界分层，只有真实隔离收益经过验证后再增加 profile。

## Execution plan

### Phase 0: Freeze the architecture contract
**Goal**
把这一页作为当前 Hermes LifeOS 的总边界文档。

**Actions**
1. 把本页作为后续新增 workflow 的判定基线
2. 新需求先回答“这是知识、方法、调度、能力、隔离，还是临时过程”
3. 任何新增长期层内容都必须能说明为什么不放到其他层

**Exit criteria**
- 后续新需求都能按层裁决
- 不再出现“重要所以先塞进去”的混放

### Phase 1: Build the LifeOS domain map in wiki
**Goal**
先建统一语义层，不急着开 profile。

**Optional domain-page examples**
- `concepts/lifeos-overview.md`
- `concepts/family-education-operating-model.md`
- `concepts/personal-finance-and-education-fund-model.md`
- `concepts/work-and-career-operating-model.md`
- `concepts/personal-growth-operating-model.md`

**Rules**
- 这些页面写“是什么/为什么/边界/关系”
- 不写成 SOP
- 每页都要能被其他页面链接

**Exit criteria**
- 主要人生域有正式知识页
- 领域之间关系能通过 wiki 链接表达

### Phase 2: Extract repeatable methods into skills
**Goal**
把高频动作从聊天技巧升级成可复用方法。

**Priority skill candidates**
- 家庭教育信息收集与周回顾
- 教育基金月度检查
- 重要决策对比分析
- 外部文章/信息入库与摘要标准化
- 家庭例会前的状态汇总

**Rules**
- skill 只写做法，不写大段背景百科
- 每个 skill 明确 trigger / do not use / workflow / pitfalls / verification

**Exit criteria**
- 主要高频动作不再依赖临场 prompt
- 同类任务输出结构明显收敛

### Phase 3: Add automation only after method stability
**Goal**
只给已经跑顺的方法加调度。

**Possible cron candidates**
- 周期性公开信息摘要
- 经授权的目标检查
- 已稳定方法的低风险状态报告

**Rules**
- 没有稳定 skill，不上 cron
- cron prompt 必须自包含
- 每个 cron 都要有明确投递目标与失败可见性

**Exit criteria**
- 自动化任务稳定运行
- 失败可审计，且不会默默丢失输出

### Phase 4: Add MCP where external live systems become bottlenecks
**Goal**
只有当手工导入成为瓶颈时，才接实时系统。

**Priority MCP directions**
- Calendar
- Mail
- Docs/Sheets
- Maps
- Task system

**Rules**
- 先接能力，再定义 skill，再考虑 cron
- 不因“看起来高级”而提前引入 MCP

**Exit criteria**
- 外部实时信息能被稳定拉取
- 接入后的方法和调度边界仍然清晰

### Phase 5: Add profiles only for real isolation needs
**Goal**
把 profile 保持为稀缺资源，而不是默认分层手段。

**Create a new profile only if one of these is true**
- 需要独立 token / gateway 身份
- 需要独立 memory / cron / skill 污染隔离
- 需要实验性环境
- 需要工作与个人强隔离

**Do not create a new profile if**
- 只是一个新人生领域
- 只是一个新知识主题
- 只是一个可通过 skill 或 wiki 解决的方法问题

**Exit criteria**
- profile 数量少而清晰
- 每个 profile 都能说清楚隔离收益

## Operating policy
### Intake policy
所有新请求先过这一串判断：
1. 是外部能力问题吗？-> `MCP`
2. 是重复方法问题吗？-> `skill`
3. 是周期执行问题吗？-> `cron`
4. 是短小稳定事实吗？-> `memory`
5. 是正式知识吗？-> `wiki`
6. 是运行时隔离问题吗？-> `profile`
7. 都不是且未稳定 -> `session`

### Promotion policy
- chat 里形成的结论，先留 `session`
- 经过复用验证，再升级到长期层
- 升级时只进一个主层；必要时允许辅层配合，但角色必须不同

### Deletion policy
如果某项内容同时像两个层，先删掉“职责不对”的承载：
- 长文在 memory -> 拆去 wiki
- 方法在 wiki -> 抽成 skill
- 调度写死在 skill 里 -> 拆到 cron
- 领域拆成 profile -> 收回主脑

## Adoption sequence
1. 定义需要管理的领域和公开/私有边界。
2. 为确有复用价值的领域建立概念页；私有状态留在其私有 owner。
3. 抽一条重复方法做成 skill，并用合成或公开 fixture 验证。
4. 多次人工跑通后，再决定是否增加调度。
5. 只有出现明确隔离痛点时，再评估新 profile。

## Success criteria
如果这个架构跑对了，会看到：
- 部署主要靠协调 profile、wiki 与 skills 运转，而不是 profile 泛滥
- 新需求能快速落层，不再反复讨论“放哪里”
- 聊天产出更少停留在会话里，更多进入正式资产层
- 自动化数量不多，但稳定可控
- 每个 profile 都有明确隔离价值

## Failure signs
如果出现这些现象，说明架构在跑偏：
- 为每个主题新建 profile
- memory 越写越长、越来越像笔记
- cron 里堆复杂业务逻辑
- wiki 页面里塞步骤化 SOP
- skill 变成概念散文

## Relations
- depends_on: [companyos-to-lifeos-filesystem-philosophy](/concepts/companyos-to-lifeos-filesystem-philosophy)
- depends_on: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- depends_on: [hermes-layer-routing-edge-cases](/queries/hermes-layer-routing-edge-cases)

## Related
- [hermes-lifeos-layer-boundary-contract](/concepts/hermes-lifeos-layer-boundary-contract)
- [companyos-to-lifeos-filesystem-philosophy](/concepts/companyos-to-lifeos-filesystem-philosophy)
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [hermes-layer-routing-edge-cases](/queries/hermes-layer-routing-edge-cases)
- [hermes-knowledge-base-operating-flow](/concepts/hermes-knowledge-base-operating-flow)
- [index](/)
- `log`

