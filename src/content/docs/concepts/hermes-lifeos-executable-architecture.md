---
title: AI Agent LifeOS Executable Architecture
created: 2026-04-21
updated: 2026-11-26
type: concept
tags:
  - agent
  - lifeos
  - architecture
  - workflow
  - governance
  - model-profiles
sources:
  - concepts/companyos-to-lifeos-filesystem-philosophy.md
  - concepts/hermes-knowledge-architecture.md
  - concepts/hermes-memory-skills-wiki-boundaries.md
  - docs:https://hermes-agent.nousresearch.com/docs
  - https://www.infraculture.org/2020-09-10-text-notes-architecture-of-complexity/
  - https://pages.gseis.ucla.edu/faculty/agre/simon.html
  - https://9p.io/sys/doc/names.html
status: stable
description: 结合 Simon 近可分解系统（快慢时间尺度解耦与稳定中间形态）与进程级命名空间隔离思想，定义 AI Agent LifeOS
  将知识、记忆、技能、工具、调度和隔离环境组织为可执行系统的参考架构。
aliases:
  - lifeos-executable-architecture
  - agent-lifeos-executable-architecture
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# AI Agent LifeOS Executable Architecture

## Summary

本页将“LifeOS 统一语义层在上、AI Agent 执行原语在下、独立 `profile` 仅承担高摩擦运行时隔离”整理为可移植的参考架构。它规定各层职责、越界禁令、渐进式演进顺序（Phase 0–5）与验收判据，不表示任何具体 AI Agent 实例已按此部署或默认启用相关外部连接。

## 能力与术语边界

文中的 `memory / skill / cron / MCP / profile` 是职责层的通用简称，在不同宿主中可分别由受控偏好存储、标准作业程序（SOP）、系统定时调度器、授权 API/CLI/连接器以及独立运行环境承担；目标系统缺少某项原生原语时无需强行补齐。`profile` 名称本身不证明凭证、权限或状态已经隔离，真实隔离必须由目标系统的进程命名空间、配置与验证测试证实。定时任务（`cron`）应保持输入自包含，但是否在独立会话（fresh session）中启动取决于具体调度器实现。

## 理论与系统根基：近可分解系统、快慢时间尺度解耦与稳定中间形态

将跨领域的个人与工程系统组织为“单一主语义层 + 分工明确的执行原语 + 极少数运行时隔离边界”，在系统科学中对应 Herbert A. Simon（1962，*Proceedings of the American Philosophical Society* 106(6): 467–482，*The Architecture of Complexity*，参见 [Infraculture 论文笔记](https://www.infraculture.org/2020-09-10-text-notes-architecture-of-complexity/) 与 [Agre 2003 学术评述](https://pages.gseis.ucla.edu/faculty/agre/simon.html)）提出的两类理论视角；以下对 Agent 分层的映射是工程类比，不是原文对本架构的证明：

### 1. 近可分解系统（Nearly Decomposable Systems）与快慢频率分层

Simon 指出，真实世界中能够稳定存续的复杂系统并非所有节点两两紧密纠缠的均匀网络，而是具有**近可分解性（Near-Decomposability）**：子系统内部的交互强度与频率远高于子系统之间的交互，从而在动态行为上实现**时间尺度解耦（Time-Scale Decoupling）**：
- **短期高频动态（High-Frequency Intra-Component Dynamics）**发生在局部执行层内部，彼此短期近似独立，局部扰动不会立即击穿全局；
- **长期低频动态（Low-Frequency Inter-Component Dynamics）**发生在慢速架构与领域层之间，各子系统仅通过**汇总属性（Aggregative Properties）**而非细碎的逐轮原始轨迹发生耦合。

**[推论]** 映射到 AI Agent LifeOS 时，应区分**运行期活动频率**与**持久契约变更频率**，而非给七类职责指定天然固定的时间尺度排序：

- **运行期活动**：`session` 的探索、`MCP` 的调用与 `cron` 的触发可能高频发生，但它们的配置、权限和工作流定义可以长期不变；
- **持久事实与方法**：`skill` / `memory` 的变更应由复用证据与事实变化驱动，不能仅凭层名假定其快于或慢于其他层（归类边界见 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 与 [hermes-layer-routing-edge-cases](/queries/hermes-layer-routing-edge-cases)）；
- **语义主干（`wiki`）**：维护可公开复用的概念模型、决策规则与跨域约束的参数定义；具体个人财务、职业或教育参数值仍留在受控私有状态（总体架构见 [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)）。共同语义模型可减少跨上下文协调成本，但不要求合并所有私有状态。未经验证的运行轨迹不应直接晋升为持久知识；具体更新节奏以目标系统的实测依赖与变化为准。

### 2. 钟表匠 Hora 与 Tempus 寓言：稳定中间形态决定演进收敛速度

Simon 在同文中用钟表匠 **Hora 与 Tempus 的寓言**说明稳定子组件为何有助于抵抗中断：两人同样制造由 1,000 个零件组成的精密手表，其间频繁受到顾客来电打断，一旦放下手中的活，未完成为稳定组件的部分就会散落归零。Tempus 采用一次性全量拼装，每次被打断都前功尽弃；Hora 则先将 10 个零件装成稳定子组件、再将 10 个子组件装成大组件，被打断时最多只损失当前正在装配的 10 个零件，因而以数千倍的效率优势胜出。

**[推论]** 这一类比支持先建立可验证组件、再扩大自动化范围，但不证明 Phase 0–5 是不可调整的线性依赖。实时连接器可能是验证工作流的前提，安全隔离更不能推迟到高风险接入之后：
- 在 AI Agent 系统中，**正式领域知识页（`wiki`）**与**经人工多轮验证的技能（`skill`）**正是 Hora 的**稳定中间形态（Stable Intermediate Forms）**；
- 只有当上一阶段的子组件具备明确的回滚边界与验收证据后，下一阶段的调度与外部连接才不会把未收敛的提示词噪声成倍放大。

## 核心架构决策

### 主判断

LifeOS 不是由多个按主题切碎的 `profile` 拼凑而成的，而是由**一个统一语义协调层 + 少量受控执行与接入层 + 极少数高摩擦运行时隔离边界**组成（文件系统状态思想见 [companyos-to-lifeos-filesystem-philosophy](/concepts/companyos-to-lifeos-filesystem-philosophy)）。

### 参考拓扑

- **主协调上下文**：承载 LifeOS 统一语义层与跨领域综合决策；具体名称和宿主能力以目标版本为准
- **`$WIKI_ROOT`（`wiki`）**：正式公共知识、领域模型与结构化决策页面
- **`memory`**：短小稳定的偏好、路径约定与环境事实
- **`skills`**：高频重复工作流的方法层
- **`cron`**：已稳定方法的定时调度层
- **`MCP`**：外部实时系统的受控接入层
- **少量专用 `profiles`**：仅在确有运行时状态、凭证或权限隔离需求时启用

## 分层边界契约摘要

完整的逐层准入、越界禁令与保护域矩阵见子页 [hermes-lifeos-layer-boundary-contract](/concepts/hermes-lifeos-layer-boundary-contract)。本总览页保留架构级职责速查表：

| 层级标识 | 架构职责定位 | 默认承载内容 |
| :--- | :--- | :--- |
| **`wiki`** | 正式知识与领域模型层 | 概念定义、领域 operating model、对比分析、可复用决策问答与公共操作手册 |
| **`memory`** | 短小稳定事实与偏好层 | 单句可表达的长期偏好、环境事实、固定路径约定与已确认工具特性 |
| **`skill`** | 可复用程序性方法层 | 具备明确触发条件、执行步骤、避坑红线与验证契约的重复工作流 |
| **`cron`** | 时间触发调度层 | 输入自包含、失败可见、已人工跑顺的稳定方法定时任务 |
| **`MCP`** | 外部实时系统能力层 | 日历、邮件、文档、地图、代码仓库或监控系统等窄接口外部访问 |
| **`profile`** | 运行时状态与权限隔离层 | 工作/个人凭证强隔离、多人公共 Bot 身份、高风险实验沙箱（参考 [Plan 9 进程级命名空间](https://9p.io/sys/doc/names.html) 思想） |
| **`session`** | 临时探索与任务工作区 | 当次会话的在途推理、未证实假设、临时工具输出与一次性中间状态 |

### LifeOS 专属边界准则

- 将 LifeOS 的主语义层保持在**主协调上下文**中统一维护；
- 优先使用 `wiki / memory / skill / cron / MCP` 完成领域知识与执行方法解耦，最后才评估是否需要拆分 `profile`；
- 仅当运行时状态（`memory`、凭证、定时任务、外部网关身份或实验性模型/提示词表面）若不隔离会产生真实污染或安全代价时，才新建 `profile`；
- **严禁为每个人生领域（如家庭、投资、健身、阅读）分别新建一个 `profile`**。

### 反越界速查底线

- 不把长篇领域背景或策略塞进 `memory`；
- 不把未验证的复杂业务逻辑硬塞进 `cron` 提示词；
- 不把概念百科直接写成 `skill`；
- 不把 `profile` 当作主题分类文件夹；
- 不因为某次会话结论“看起来很重要”就直接跳过验证晋升到持久层。

## 参考部署形态（合成示例）

- **单一协调实例**：适合没有跨身份或高风险运行时隔离需求的常规部署；
- **工作隔离实例（Work Profile）**：仅在企业凭证、合规边界、工作记忆或调度必须与个人环境物理隔离时采用；
- **公共入口实例（Public Bot Profile）**：仅在多用户可触发的聊天入口需要独立最小权限与独立会话状态时采用；
- **实验沙箱实例（Lab Profile）**：仅在测试新模型、激进提示词或未审技能可能污染稳定主路径时采用。

以上名称均为合成架构示例，不代表任何实例已被创建或授权。默认演进策略是先用 `wiki`、`skill`、项目上下文与工具权限白名单分层，只有真实隔离收益大于跨实例同步摩擦时再引入新 `profile`。

## 分阶段演进路径（Phase 0–5：基于稳定中间形态构建）

以下编号是参考路线，不是安全措施的排队顺序：若早期已存在凭证、身份或高风险状态隔离需求，应先落实 Phase 5 的隔离与授权，再连接外部系统；Phase 4 的只读连接器也可按工作流验证需要提前评估。

### Phase 0：冻结分层架构契约
- **目标**：以本页与 [hermes-lifeos-layer-boundary-contract](/concepts/hermes-lifeos-layer-boundary-contract) 作为后续新增需求的分层裁决基线。
- **核心动作**：任何新需求进入前先回答“它属于正式知识、稳定偏好、重复方法、定时调度、外部连接、运行时隔离，还是临时会话过程”；写入持久层前必须能说明为何不放在其他层。
- **准出判据**：新需求能够按正交职责稳定落层，不再出现“因为重要所以全部塞进 `memory` 或新建 `profile`”的混放。

### Phase 1：在 `wiki` 中构建统一领域语义地图
- **目标**：先搭建慢变语义主干（稳定中间形态 1），不急于配置自动化或拆分运行环境。
- **可选领域模板示例**：以领域总览 [lifeos-overview](/concepts/lifeos-overview) 为统一入口，按需展开家庭教育、家庭资金分层、职业发展、个人成长与系统治理五个子领域模型。
- **写作规则**：只定义“是什么、为什么、跨域约束参数的定义与适用边界”，个人实际取值另存私有状态，不混写具体某天的个人台账或临时 SOP；各领域页之间通过双向关系链接形成可导航图谱（维护流程见 [hermes-knowledge-base-operating-flow](/concepts/hermes-knowledge-base-operating-flow)）。
- **准出判据**：核心领域拥有清晰的正式知识页，且跨域决策约束可通过图谱互链回查。

### Phase 2：将高频重复动作提炼为 `skills`
- **目标**：把反复出现的聊天任务收敛为受治理的程序性方法（稳定中间形态 2）。
- **候选方向示例**：家庭教育资料收集与周度复盘、目标资金分层核对、多方案结构化对比、外部公开资料入库与摘要核验。
- **构建规则**：`skill` 只写触发条件、不适用范围、执行步骤、常见陷阱与完成验证契约，背景理论通过链接指向 `wiki` owner。
- **准出判据**：同类任务不再依赖每次临场拼凑提示词，输出结构与验证证据稳定可复现。

### Phase 3：仅在方法稳定后接入 `cron` 定时调度
- **目标**：只为已在 Phase 2 人工跑顺且边界清楚的方法添加时间触发器。
- **候选方向示例**：只读公开信息周期摘要、固定周期的知识库健康与新鲜度巡检。
- **构建规则**：无稳定方法与失败处理机制前严禁启用定时调度；`cron` 提示词必须输入自包含，且具备明确的投递目标、超时限制与失败告警可见性。
- **准出判据**：定时任务低噪稳定运行，失败可审计且不静默吞没错误。

### Phase 4：仅在手工导入成为真实瓶颈时按需接入 `MCP`
- **目标**：以最小权限接入必要的外部实时系统。
- **候选方向示例**：日历、邮件、文档/表格、任务系统或代码仓库的受控连接器。
- **构建规则**：遵循“先验证外部接口安全性 → 再封装进 `skill` 工作流 → 最后才评估是否允许 `cron` 调用”的顺序，不为追求技术复杂度而提前引入连接器。
- **准出判据**：外部实时数据拉取稳定，且读写权限与审批边界保持显式受控。

### Phase 5：仅为真实运行时隔离需求启用独立 `profile`
- **目标**：将 `profile` 保持为稀缺的保护域资源，而非主题目录。
- **准入条件（至少满足其一）**：需要独立的凭证/网关身份；需要防止高风险实验或外部多用户入口污染主 `memory / cron / skill` 状态；存在刚性的工作与个人合规隔离要求。
- **拒绝条件**：仅仅是新增一个人生领域、新增一个知识主题，或完全可通过单个 `skill` / `wiki` 页面解决的问题。
- **准出判据**：`profile` 数量极少且每个实例都能明确说明其不可替代的隔离收益。

## 运行与治理策略

### 1. 准入路由策略（Intake Policy）
新请求到达时，按以下正交维度组合判断，不在首个匹配处提前终止（边界案例裁决见 [hermes-layer-routing-edge-cases](/queries/hermes-layer-routing-edge-cases)）：
1. **涉及外部实时系统读写？** $\to$ 优先复用已授权 API/CLI/连接器；需要标准协议封装时选 `MCP`
2. **属于可跨次复用的操作步骤？** $\to$ `skill`
3. **需要按固定时间周期触发？** $\to$ `cron`（调用已稳定的 `skill` 或脚本）
4. **属于单句可表达的长期稳定事实/偏好？** $\to$ `memory`
5. **属于可跨项目复用的概念、模型或决策框架？** $\to$ `wiki`
6. **存在刚性的凭证、身份或运行时状态隔离需求？** $\to$ `profile`
7. **以上皆非或尚处于探索未定型阶段？** $\to$ 留在 `session`

### 2. 晋升策略（Promotion Policy）
- 会话中产生的新想法默认先留在 `session`；
- 经真实复用与验证后，再按职责晋升至对应持久层；
- 同一内容只设一个主维护层（canonical owner），辅层仅通过引用配合，严禁跨层全文复制。

### 3. 减脂与清理策略（Deletion Policy）
当某项内容同时跨占两个层时，优先删除职责错位的冗余承载：
- 长篇解释或领域策略塞在 `memory` $\to$ 提炼公共部分迁入 `wiki`，删除 `memory` 长文；
- 可复用公开操作指南混在私有配置中 $\to$ 通用方法迁入 `operations/`，宿主触发约束由 `skill` 引用；
- 复杂业务步骤硬编码在 `cron` 提示词中 $\to$ 抽离为独立 `skill` 或脚本，`cron` 仅保留轻量触发入口；
- 按人生领域拆出的冗余 `profile` $\to$ 收回主协调上下文统一管理。

## 架构健康度与退化信号

- **健康收敛信号**：系统主要依靠主协调上下文、`wiki` 与 `skills` 稳定运转；新需求能迅速按职责落层；会话中的高价值发现在验证后沉淀为正式资产；定时任务数量精简且失败可追踪；每个 `profile` 都有清晰的权限隔离理由。
- **架构退化信号**：每关注一个新领域就新建一个 `profile`；`memory` 越写越长沦为杂乱笔记；`cron` 提示词堆满未经测试的复杂分支；将私有执行状态或凭证混入公开知识库；`skill` 退化为缺乏可执行步骤的概念散文。

## Relations

- depends_on: [companyos-to-lifeos-filesystem-philosophy](/concepts/companyos-to-lifeos-filesystem-philosophy), [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- related: [lifeos-overview](/concepts/lifeos-overview), [hermes-lifeos-layer-boundary-contract](/concepts/hermes-lifeos-layer-boundary-contract), [hermes-knowledge-base-operating-flow](/concepts/hermes-knowledge-base-operating-flow), [hermes-layer-routing-edge-cases](/queries/hermes-layer-routing-edge-cases)

