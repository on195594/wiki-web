---
title: Agent 生产级 Harness 与云端运行时边界
created: 2026-11-02
updated: 2026-11-11
type: concept
tags:
  - agent
  - harness
  - lifecycle
  - deployment
  - orchestration
  - governance
  - verification
  - linux
sources:
  - raw/articles/stencil-the-harness-playbook-2026-09-05.md
  - raw/articles/tetral-next-scaling-problem-2026-09-06.md
  - raw/articles/microsoft-devblogs-agent-harness-production-ready-2026-08-27.md
  - raw/articles/claude-abc-legal-managed-agents-2026-08-17.md
  - concepts/agent-development-lifecycle.md
  - https://en.wikipedia.org/wiki/Long-running_transaction
status: stable
volatility: medium
verified_at: 2026-11-02
review_by: 2027-03-02
description: 定义生产级 Agent Harness 的有状态执行边界、共享定义与薄宿主分层、云端长程运行时与沙箱分离，以及 Agent-as-Code 的 PR 控制面。
aliases:
  - production-agent-harness
  - cloud-agent-runtime-boundaries
  - harness-execution-boundary
---

# Agent 生产级 Harness 与云端运行时边界

## Summary

本页是 [agent-development-lifecycle](/concepts/agent-development-lifecycle) 在 Build / Deploy / Govern 交界处的架构子主题，综合 Stencil [stencil-the-harness-playbook-2026-09-05](https://github.com/on195594/wiki/blob/83e0850981a043bc16535b828e1f9e4aabfad5a7/raw/articles/stencil-the-harness-playbook-2026-09-05.md)、Tetral [tetral-next-scaling-problem-2026-09-06](https://github.com/on195594/wiki/blob/83e0850981a043bc16535b828e1f9e4aabfad5a7/raw/articles/tetral-next-scaling-problem-2026-09-06.md)、Microsoft Agent Framework [microsoft-devblogs-agent-harness-production-ready-2026-08-27](https://github.com/on195594/wiki/blob/83e0850981a043bc16535b828e1f9e4aabfad5a7/raw/articles/microsoft-devblogs-agent-harness-production-ready-2026-08-27.md) 与 ABC Legal [claude-abc-legal-managed-agents-2026-08-17](https://github.com/on195594/wiki/blob/83e0850981a043bc16535b828e1f9e4aabfad5a7/raw/articles/claude-abc-legal-managed-agents-2026-08-17.md) 四个公开工程案例，定义当 Agent 从单机原型走向生产环境时必须立住的四条边界：

1. **Harness 是围绕模型/工具循环的有状态执行边界**：拥有单一权威会话状态、控制面与执行面分离、有界工作单元及从权威状态派生的视图。
2. **共享 Agent 定义与薄宿主（Thin Host）分离**：将指令、工具、权限和生命周期集中在单一 factory，由 CLI、托管服务和评测器作为薄宿主消费，避免多份副本漂移。
3. **云端长程运行时与沙箱计算分离**：逐个核对意图提交、外部副作用、结果确认、重试身份与旧执行者隔离（代际绑定）的故障窗口，区分凭据隔离与 Tool Gate 操作授权。
4. **Agent-as-Code 与 PR 变更控制面**：把 prompt、工具列表、配置与调优提案纳入版本控制与人工 PR 审批，禁止模型直接在线改写生产规则。

## 1. Harness 作为有状态执行边界

Stencil 的 [stencil-the-harness-playbook-2026-09-05](https://github.com/on195594/wiki/blob/83e0850981a043bc16535b828e1f9e4aabfad5a7/raw/articles/stencil-the-harness-playbook-2026-09-05.md) 指出，Agent Harness 不是外围胶水脚本，而是围绕模型与工具循环的有状态执行边界：它持有权威会话状态、控制面策略、有界工作单元、子代理/后台作业生命周期、兼容性规则、可观测性以及由状态派生的投影视图。

**[推论] AI Agent 可迁移映射：**

- **单一权威状态（Single authoritative state）**：凡影响 rewind、fork、resume、retry、子代理生命周期或崩溃恢复的状态，必须持久化或可从权威 run/session 状态重建；不得依赖插件闭包、进程局部计数器或内存级工具注册表。客户端与本地状态同步边界参见 [local-first-sync-confirmed-mirror-outbox-conflict-policy](/concepts/local-first-sync-confirmed-mirror-outbox-conflict-policy)。
- **控制面与执行面分离（Control plane vs execution plane）**：受信任的父进程/宿主拥有状态、路由、审批、策略、凭据和审计证据；Worker 与沙箱只执行有界指令，不成为策略权威。
- **有界工作单元（Bounded work units）**：Shell 命令、子代理、后台作业与长生命周期服务必须具备显式归属、超时、取消、资源上限、清理逻辑与可观测终态。
- **投影视图与权威回读（Projection and verification）**：TUI、Web、聊天消息、日志和检查视图只是状态投影；完成、取消、恢复、清理及外部副作用应优先从最强的可用权威状态回读（参见 [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification)）。
- **最小充分表面（Smallest sufficient surface）**：在没有具体本地故障、明确项目 owner 与独立验证路径前，不因单篇架构文章引入新的状态树、Director、动态 CLI、工具数量指标、沙箱实现或渲染协议。

**[证据边界]** 原文的架构细节、基准测试、延迟、插件数量和技术选型保留为来源特定主张；上述映射不授权修改 runtime/config、active Skill、MCP、cron、gateway 或 provider。

## 2. 共享 Agent 定义与薄宿主分层

Microsoft Agent Framework 的生产化案例 [microsoft-devblogs-agent-harness-production-ready-2026-08-27](https://github.com/on195594/wiki/blob/83e0850981a043bc16535b828e1f9e4aabfad5a7/raw/articles/microsoft-devblogs-agent-harness-production-ready-2026-08-27.md) 补充了 Build 与 Deploy/Test 之间的结构契约：把 instructions、tools、skills、memory、approvals 和资源生命周期集中到一个共享 Agent factory，再由 console、hosted service 和 eval runner 三个薄宿主消费同一份定义。可迁移的核心机制是**“核心定义一次、宿主只负责运行环境”**，从而保证观测、治理、部署和评测面对的是同一个 Agent，而不是三份逐渐漂移的副本。

- **环境策略显式隔离**：本地宿主可保留交互式调试能力；托管宿主默认关闭容器本地文件访问与 shell，需要文件时显式注入外部持久存储；代码执行只有在外部隔离沙箱成立时才可启用，子进程执行器（如原文中的 `LocalCodeAct`）本身不能被称为安全沙箱。
- **评测宿主复用同一定义**：先运行便宜、确定性的本地检查，再按需增加模型评分；trace 中暴露的真实失败应回流为下一轮 eval，而不是直接在线改写 Agent。
- **[推论] 按实际载体数量采用**：只有确实存在 console、runtime、eval 等多个运行载体时才需要共享 factory / thin-host 结构；单入口、局部且可验证的脚本继续保持单一入口，避免为尚不存在的部署形态预建抽象。

## 3. 云端长程 Agent：运行时与计算机分离及故障窗口

Yang Li 的 Tetral 架构叙述 [tetral-next-scaling-problem-2026-09-06](https://github.com/on195594/wiki/blob/83e0850981a043bc16535b828e1f9e4aabfad5a7/raw/articles/tetral-next-scaling-problem-2026-09-06.md) 为上述 harness 边界提供了云端长程实例：Agent 循环作为可替换的无状态计算运行时，沙箱/计算机按需调用而非承载会话身份。Gateway 持有模型连接与凭据，Bridge 负责 PostgreSQL 中的状态提交和回执，Queue/Inbox 负责持久投递，Sandbox Service 负责隔离执行环境。会话中的 thread 是独立有序的执行路径；跨 thread 并行不等于共享上下文，跨 session 共享 workspace 也不等于共享执行历史（会话路由边界另见 [chat-to-agent-session-routing](/concepts/chat-to-agent-session-routing)）。

### 跨进程恢复的五个核对窗口

长程 Agent 的关键失败窗口是**“外部操作已经发生，但运行时未收到确认”**。Tetral 先提交带稳定身份的声明、取得回执，才调度模型或工具；结果也须先提交，reducer 才能用它继续。输入与投递作业同事务登记，丢失唤醒通知靠轮询补偿，接受投递与实际处理分开记录，并用运行时绑定代际（generation binding）防止超时后旧 Pod 仍在处理时错误重投。

**[推论]** 若项目确有跨进程恢复需求，应逐个核对以下五个故障窗口，而非仅增加队列或保存聊天记录：
1. **意图提交（Intent commit）**：调度前是否已落盘唯一操作身份？
2. **外部效果（External side effect）**：目标系统是否支持幂等键或事前状态查询？
3. **结果确认（Result receipt）**：工具返回后但 reducer 更新前崩溃，恢复时如何避免重复执行？
4. **重试身份（Retry identity）**：重试是否复用原操作身份而非生成新请求？
5. **旧执行者隔离（Stale worker fencing）**：超时重投后，旧进程迟到的写入是否会被代际号拒绝？

此机制不让任意外部系统自动具备事务性，也不保证副作用恰好执行一次；持久化载体的成本与复杂度取舍见 [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs)。

### 长程副作用的 Saga 补偿事务与枢轴事务边界

当长程 Agent 跨多个外部 API、代码仓库或 SaaS 服务执行写操作时，由于无法跨外部系统维持传统数据库的分布式 ACID 锁，其恢复语义应锚定 Hector Garcia-Molina 与 Kenneth Salem（1987，ACM SIGMOD，*SAGAS*；[Long-running transaction](https://en.wikipedia.org/wiki/Long-running_transaction)）提出的 **Saga 长事务模式**，将工具调用序列 $T_1, T_2, \dots, T_n$ 按可逆性划分为三类操作单元：
1. **可补偿事务（Compensable transactions）**：已提交的局部写操作具备明确的业务逆操作 $C_i$（例如创建临时分支对应删除分支、预占日程对应取消预约）。当后续步骤 $T_k$ 失败或被用户取消时，Harness 协调器按逆序调用 $C_{k-1}, \dots, C_1$ 执行**向后恢复（Backward recovery）**，使外部环境回到等价初始状态，而非仅清理本地会话内存。
2. **枢轴事务（Pivot transaction）**：整条工作流的**不可逆分界点（Go/No-Go point）**——即既不可自动补偿、也不可无副作用撤回的动作（例如对外发送正式邮件、发布公开包、执行生产环境破坏性迁移或资金扣划）。一旦枢轴事务提交，工作流便不可向后回滚；因此 **Tool Gate 人工审批、只读预检（dry-run）与权威状态快照必须严格前置在枢轴事务提交之前**。
3. **可重试事务（Retryable transactions）**：位于枢轴事务之后的收尾步骤（如同步本地索引、写入归档日志、发送完成回执），必须设计为幂等操作（配合上述窗口 1–4 的唯一操作身份），以便在断连恢复时通过**向前恢复（Forward recovery）**重试直至收敛。

### 凭据隔离与 Tool Gate 授权分离

Tetral 将模型与 MCP 凭据留在连接服务，由 Tool Gate 在执行前评估操作，需审查的提议必须先记录决定，才能成为可调度工具调用。作者还提出以候选产物的对抗复核和人工接受代替无边界的多 Agent 聊天（这属于设计主张，不能从并行线程数量推断质量提升，编排边界见 [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)）。

**[适用限制]** 原文是作者对个人 k3s 集群 Alpha 的描述，未证明持续多节点恢复、容量感知调度或端到端反压，滚动发布尚会中断进行中的轮次；不是已验证的生产标准架构，也不是单机或短任务应照搬的默认拓扑。

## 4. Agent-as-Code 与 PR 变更控制面

ABC Legal 的企业案例 [claude-abc-legal-managed-agents-2026-08-17](https://github.com/on195594/wiki/blob/83e0850981a043bc16535b828e1f9e4aabfad5a7/raw/articles/claude-abc-legal-managed-agents-2026-08-17.md) 展示了如何用现有软件工程控制面治理生产 Agent：每个 Agent 的 prompt、工具列表、调度、凭据引用和 memory 配置都进入 Git；任何行为变更先成为 Pull Request，经人工审批后才部署，使版本历史、审查、回滚和审计复用同一控制面。新 Agent 先在 human-in-the-loop 模式中给出建议并积累标注反馈与 eval，只有在特定任务上达到设定门槛后才逐步获得自动执行权限。

对需要持续反馈调优的 Agent，该案例使用 `Initial Agent → Harvester → Tuner` 三段式分离：运行 Agent 留下审计轨迹，Harvester 从 Slack 回复和 Emoji 收集标签，Tuner 周期性提出 prompt 或 YAML 配置 PR；**模型不直接在线改写生产规则，合并权仍由人类掌握**。规则晋升与经验固化边界分别见 [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules) 与 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops)，与模型/角色级 harness 配置原则（[hermes-model-specific-harness-profiles](/concepts/hermes-model-specific-harness-profiles)）互补。

**[推论]** 可迁移的是四个控制点：可审查的文本资产、PR/diff 作为变更边界、基于真实反馈的离线 eval，以及人工批准后的分级放权。ABC Legal 报告的 Agent 数量、约 98% 一致性及最高约 50% 成本下降仅属该公司特定业务案例，不作为通用阈值。

## Relations

- refines: [agent-development-lifecycle](/concepts/agent-development-lifecycle)
- depends_on: [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification), [local-first-sync-confirmed-mirror-outbox-conflict-policy](/concepts/local-first-sync-confirmed-mirror-outbox-conflict-policy)
- related: [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs), [hermes-model-specific-harness-profiles](/concepts/hermes-model-specific-harness-profiles), [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules), [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [chat-to-agent-session-routing](/concepts/chat-to-agent-session-routing)

