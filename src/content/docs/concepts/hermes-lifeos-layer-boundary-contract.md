---
title: AI Agent LifeOS Layer Boundary Contract
created: 2026-05-18
updated: 2026-11-14
type: concept
tags:
  - agent
  - lifeos
  - architecture
  - workflow
  - governance
sources:
  - concepts/hermes-lifeos-executable-architecture.md
  - concepts/hermes-context-layer-operating-rules.md
  - concepts/hermes-layer-routing-decision-checklist.md
  - concepts/hermes-memory-skills-wiki-boundaries.md
  - concepts/hermes-knowledge-architecture.md
  - https://www.cs.cornell.edu/fbs/publications/chptr.enfMech.refMonitor.pdf
  - https://arxiv.org/html/2304.10600v1
  - https://9p.io/sys/doc/names.html
status: stable
description: 结合 Lampson 保护域与访问控制矩阵（Access Control Matrix）及 Plan 9 命名空间隔离模型，规定 AI
  Agent LifeOS 七层架构的职责、准入、越界禁令与升降级契约。
aliases:
  - lifeos-layer-boundary
  - agent-lifeos-layer-boundary-contract
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# AI Agent LifeOS Layer Boundary Contract

## Summary

本页定义 AI Agent LifeOS 七类核心原语——`wiki`、`memory`、`skill`、`cron`、`MCP`、`profile` 与 `session`——之间的职责边界、准入条件与越界裁决契约。

与通用上下文路由检查表不同，本页的核心差异点在于 **LifeOS 的拓扑不变量**：默认将完整的跨领域语义层保留在**主协调上下文**中，优先通过知识（`wiki`）、稳定事实（`memory`）、方法（`skill`）、调度（`cron`）和外部工具接入（`MCP`）实现功能解耦，仅在确有**运行时状态与权限保护域隔离**需求时才引入独立的 `profile`。上下文窗口预算与项目状态规则见 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)；总体演进阶段见 [hermes-lifeos-executable-architecture](/concepts/hermes-lifeos-executable-architecture)。

## 能力与术语边界

`memory / skill / cron / MCP / profile` 在此是职责简称，可分别由目标宿主受授权的偏好存储、SOP、系统调度器、API/CLI/连接器和独立运行环境承担；缺少某项原生能力时不必强行补齐。`profile` 名称不证明凭证、权限或状态已隔离，真实隔离必须由目标系统配置和测试证实。调度任务应自包含，但是否创建独立新会话（fresh session）取决于具体调度器。

## 理论与安全根基：Lampson 保护域、访问控制矩阵与命名空间视图

LifeOS 默认通过 `wiki / skill` 区分领域，仅为真实的运行时状态或权限隔离需求评估独立 `profile`。这一工程取舍可借助 Butler W. Lampson（1971/1974，*ACM SIGOPS Operating Systems Review* 8(1): 18–24，*Protection*，参见 [Cornell Reference Monitors 文献综述](https://www.cs.cornell.edu/fbs/publications/chptr.enfMech.refMonitor.pdf) 与 [访问控制模型综述 `arXiv:2304.10600v1`](https://arxiv.org/html/2304.10600v1)）的**访问控制矩阵（Access Control Matrix）**及 Rob Pike 等人的 **Plan 9 进程命名空间模型**（[Pike et al. 1993](https://9p.io/sys/doc/names.html)）解释，但不是这些模型证明的唯一拓扑：

### 1. 保护域（Protection Domains，矩阵行）vs. 知识/方法对象（Objects，矩阵列）

Lampson 将系统的保护状态定义为三元组 $(\mathcal{D}, \mathcal{O}, \mathbf{A})$：
- **保护域集合 $\mathcal{D}$（矩阵的行）**：代表主体或执行环境（如不同的 `profile` 或进程），每一行 $\mathbf{A}[d, \cdot]$ 定义该执行环境对所有资源拥有的权限集合（按行提取即为能力表 `Capability List`）；
- **受保护对象集合 $\mathcal{O}$（矩阵的列）**：代表被访问的知识文档、记忆条目、技能文件或外部工具通道（按列提取即为访问控制表 `ACL`）；
- **矩阵元 $\mathbf{A}[d, o] \subseteq \{\text{read}, \text{write}, \text{execute}, \text{call}, \text{control}\}$**：定义保护域 $d$ 对对象 $o$ 允许执行的操作。

**[推论] 这一模型可帮助区分两类设计问题，而非给出 `profile` 的充要条件：**
1. **领域分类与访问权限正交**：家庭教育、资产配置、职业规划与个人成长可作为对象集合的分类，领域之间也可能共享对象。同属 `wiki` 或同一主题不意味着权限相同；应逐对象确定 $\mathbf{A}[d, o]$。在权限与状态需求相同的前提下，仅为主题分类复制 `profile` 通常增加配置同步与上下文协调成本，但访问控制矩阵本身不提供治理漂移的复杂度结论。
2. **隔离需求由威胁模型与状态约束决定**：权限行不等可以通过对象级授权实现，不必然需要新 `profile`；权限行相同也可能因会话、凭证存储或实验状态串扰而需要隔离。公共 Bot 应满足 $\forall o \in \mathcal{O}_{\text{private}},\; \mathbf{A}[d_{\text{bot}}, o] = \emptyset$；工作与个人环境则按合规策略限制访问，不要求所有公共对象也彼此不相交。Plan 9 的 `rfork(RFNAMEG)` 可复制命名空间组，但仅分离路径视图不等于撤销既有文件描述符、凭证或重挂载能力；真正的安全隔离仍须限制这些权威并测试拒绝路径。

## 核心拓扑契约

AI Agent LifeOS 默认保持单一主协调上下文：

```text
主协调上下文 (Main Coordination Protection Domain d_main)
├── wiki      -> 正式知识、领域模型、对比分析与公共操作手册 (慢速持久语义层)
├── memory    -> 短小稳定的偏好、路径约定与环境事实 (默认注入事实层)
├── skills    -> 带触发条件、步骤与验证契约的可复用方法 (程序性方法层)
├── cron      -> 输入自包含的已稳定方法定时触发器 (时间调度层)
├── MCP       -> 外部实时系统受控读写接口 (外部能力接入层)
└── sessions  -> 当前任务的探索推理、未证实假设与临时状态 (瞬态工作区)
```

独立 `profile` 是稀缺的运行时保护域边界，绝不是领域分类文件夹。

## 七层职责与越界契约详解

### 1. `wiki`（正式知识与领域模型层）

- **核心职责**：承载 LifeOS 架构、领域 operating models、跨源对比分析、长期有效的决策问答与面向人类/Agent 共用的操作规范（整体架构见 [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)，运行闭环见 [hermes-knowledge-base-operating-flow](/concepts/hermes-knowledge-base-operating-flow)）。
- **准入内容**：脱离私有会话仍可理解的架构原则、参数化领域模型、带来源归因与双向关系链接（`## Relations`）的正式 Markdown 页面。
- **严禁放入**：一次性任务待办、未经提炼的原始聊天记录、个人私有账目/健康实测值、定时任务运行状态及任何密钥凭证。
- **裁决一句话**：如果内容回答的是**“这是什么、为什么这样设计、遵循什么边界、与其他知识有何关系”**，归入 `wiki`。

### 2. `memory`（短小稳定事实与偏好层）

- **核心职责**：保存值得跨会话默认注入的高价值、低波动环境事实与个人偏好（与 `skill` / `wiki` 的边界见 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)）。
- **准入内容**：长期输出偏好、固定目录路径约定、已核实的宿主环境事实、已验证的工具特性与单句硬约束。
- **严禁放入**：长篇概念解释、项目阶段性进展、文章摘要、临时规避补丁（workaround），以及任何需要分节或举例说明的复杂流程。
- **裁决一句话**：如果一条信息**无法压缩成一句长期稳定的事实或约束**，就不要放进 `memory`。

### 3. `skill`（可复用程序性方法层）

- **核心职责**：封装具有明确触发条件、前置检查、有序步骤、常见陷阱与完成验证契约的重复工作流。
- **准入内容**：知识入库流程、代码审查清单、周期性复盘模板等已经过多次真实执行并证明稳定的操作方法。
- **严禁放入**：泛泛而谈的概念散文、纯个人偏好事实、单纯的外部工具可用性说明，或仅针对某一次任务的临时决定。
- **裁决一句话**：如果内容回答的是**“下次遇到同类任务应按什么步骤执行并如何验收”**，归入 `skill`。

### 4. `cron`（时间触发调度层）

- **核心职责**：为已经稳定且输入自包含的方法提供基于时间的周期性触发。
- **准入内容**：定期公开信息摘要、周期性仓库健康与新鲜度检查、具备明确投递目标与失败告警机制的巡检任务。
- **严禁放入**：尚未人工跑通的实验性工作流、直接把数千字复杂业务逻辑硬编码在调度提示词中、依赖当前聊天窗口上下文的任务，以及静默吞没错误的后台作业。
- **裁决一句话**：`cron` 只回答**“何时运行及如何报告结果”**，不回答“业务方法本身如何实现”。

### 5. `MCP`（外部实时系统能力层）

- **核心职责**：为 Agent 提供访问或操作外部实时系统的受控窄接口（或其他经授权的 API / CLI / 连接器）。
- **准入内容**：日历、邮件、云端文档/表格、地图、GitHub、监控系统、任务管理等需要实时拉取或受控写入的外部通道。
- **严禁放入**：长期知识存储、工作流方法定义、定时策略定义，或完全可以用本地静态文件表达的参考资料。
- **裁决一句话**：如果核心瓶颈是**“Agent 需要读取或操作某个外部实时系统”**，评估使用已授权连接器或 `MCP`。

### 6. `profile`（运行时状态与保护域隔离层）

- **核心职责**：当配置、`memory`、会话历史、`skills`、`cron`、网关身份或实验性模型表面需要经验证的运行时状态或权限隔离时，提供独立的运行时保护域。
- **准入内容**：工作与个人环境强隔离、多人可触发的公共 Bot 独立身份、高风险实验沙箱，或任何一旦状态串扰就会造成真实合规/安全损失的场景。
- **严禁放入**：按人生领域（如家庭、投资、运动）拆分一个又一个 `profile`、把 `profile` 当作主题文件夹、割裂 LifeOS 主语义层，或仅仅因为某个主题“很重要”就新建 `profile`。
- **刚性守则**：
  1. 无明确且经核实的运行时隔离收益，严禁新建 `profile`；
  2. 领域与方法解耦一律优先使用 `wiki / skill / cron / MCP`；
  3. 除非存在具体的运行时状态冲突或权限互斥，LifeOS 主语义层始终留在**主协调上下文**中。
- **裁决一句话**：`profile` 只回答**“运行时状态与权限保护域是否必须隔离”**，绝不回答“这是不是一个新领域”。

### 7. `session`（临时探索与任务工作区）

- **核心职责**：承载当次任务的探索推理、在途假设、工具原始输出与一次性中间状态（上下文裁剪与转储规则见 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)）。
- **准入内容**：当前任务的待验假设、决策过程中的临时比较、未定型的草稿与一次性澄清。
- **验证后晋升路径（Upgrade Routes）**：
  - 提炼为单句长期稳定事实 $\to$ `memory`
  - 收敛为可重复执行的标准步骤 $\to$ 既有 SOP 或 `skill`
  - 编译为可跨项目复用的概念、模型或对比结论 $\to$ `wiki`
  - 需要周期性自动运行 $\to$ 稳定方法（SOP / `skill` / 脚本）+ 经授权的调度器 / `cron`
  - 需要连接外部实时系统 $\to$ 经授权的 API / CLI / 连接器 / `MCP`
  - 暴露出真实的运行时权限/状态冲突 $\to$ 评估独立 `profile`
- **裁决一句话**：**重要不等于持久**；凡尚未验证或仅服务于当次任务的中间过程，一律留在 `session`。

## `[推论]` 七层契约一屏裁决矩阵

当一项新需求涉及多个部分时，应按正交职责拆解到不同层协同配合，而不是将同一内容复制到所有层（五维正交路由向量见 [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)）：

| 原语层级 | 核心判别问题 | 状态持久度与变更频率 | 保护域与权限要求 | 典型越界反模式（Forbidden） |
| :--- | :--- | :--- | :--- | :--- |
| **`wiki`** | 是否为跨项目/跨周期复用的概念、模型或规范？ | 持久文件层（低频慢变） | 公开边界准入 + 确定性门禁校验 | 把临时会话记录、私有账单或未验猜想写成正式页 |
| **`memory`** | 是否为单句可表达的长期稳定事实或偏好？ | 持久注入层（低频变更） | 绑定当前保护域 $d$ 默认加载 | 把长篇领域策略、复杂步骤或临时排障过程塞入 `memory` |
| **`skill`** | 是否为带触发词、步骤与验证门的重复工作流？ | 持久程序层（中频迭代） | 按需渐进披露，脚本执行需独立授权 | 把百科概念散文写成 `skill`，或隐藏安全审批边界 |
| **`cron`** | 是否为输入自包含、已跑顺方法的定时触发？ | 持久调度配置（按周期触发） | 显式投递目标 + 失败告警 + 超时上限 | 在 `cron` 提示词里直接堆砌未经测试的复杂业务逻辑 |
| **`MCP`** | 是否需要读写外部实时系统？ | 实时通道（高频调用） | 最小权限过滤 + 带外逐次参数授权 | 用重型连接器替代静态文档，或无白名单裸露写入接口 |
| **`profile`** | 是否存在刚性的凭证、身份或状态污染隔离需求？ | 独立保护域 $d_i$（极少变动） | 经验证的状态隔离与最小权限，不仅是独立名称或矩阵行 | 按人生领域（家庭/投资/健身）各自新建 `profile` |
| **`session`** | 是否属于在途探索、未定型草稿或单次任务状态？ | 瞬态上下文（高频快变） | 当前会话有界窗口，按需转储与折叠 | 把未验证的会话结论直接当作长期权威规则 |

**协同拆分示例**：一项“每周家庭教育资料汇总与复盘”需求，其公开领域模型与压力余量参数的定义放在 `wiki`，家庭实际参数值留在受控私有状态，信息收集与核验步骤封装在 `skill`，每周固定触发时间配置在 `cron`，日历与文档读取通过授权工具或 `MCP` 完成，而简短的固定排版偏好保存在 `memory`——全部在同一个主协调上下文中完成，无需新建 `family` profile。

## LifeOS 典型反模式清单

- 因为家庭、投资或健身“很重要”，就分别为它们创建独立的 `family`、`investment`、`workout` profile，导致跨领域上下文断裂；
- 把数千字的家庭财务或教育规划长文塞进 `memory`，长期挤占每次对话的默认上下文窗口；
- 不先沉淀并验证 `skill` 或脚本，直接把整套复杂审查逻辑写进 `cron` 提示词；
- 将个人私有执行状态、真实账户数据或凭证混入公开 `wiki` 或 `operations/` 操作指南；
- 把 `skill` 写成没有触发边界和验证命令的架构议论文；
- 把当次 `session` 中的试探性讨论直接当作已获批准的长期规则。

## 与相邻规范页面的关系

- [hermes-lifeos-executable-architecture](/concepts/hermes-lifeos-executable-architecture)：上层总览页，定义 LifeOS 总体拓扑与 Phase 0–5 渐进实施顺序；
- [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)：规定上下文窗口预算、历史压缩、长任务状态文件与子代理交接规则；
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)：提供面向任意 Agent 任务的五维正交路由检查表与晋升门禁；
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)：深入定义 `memory`、`skills`、`wiki` 与 `session` 四者之间的认知分类学与去情境化晋升边界；
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)：定义人类与 AI Agent 共享知识栈的总体分层与检索边界。

## Relations
- depends_on: [hermes-lifeos-executable-architecture](/concepts/hermes-lifeos-executable-architecture), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- related: [hermes-knowledge-base-operating-flow](/concepts/hermes-knowledge-base-operating-flow)

