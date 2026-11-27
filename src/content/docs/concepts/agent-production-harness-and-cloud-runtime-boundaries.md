---
title: Agent 生产级 Harness 与云端运行时边界
created: 2026-11-02
updated: 2026-11-27
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
  - concepts/agent-autonomy-ladder-for-hermes-workflows.md
  - https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf
  - https://www.cs.princeton.edu/techreports/1987/070.pdf
  - https://dblp.org/rec/conf/sigmod/ZhangNBB94.html
  - https://adapt.ls.fi.upm.es/transactions.pdf/@@download/file/transactions.pdf
  - https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html
  - https://arxiv.org/html/2610.41453v1
  - https://docs.temporal.io/workflow-definition
  - https://docs.temporal.io/workflow-execution/limits
  - https://docs.temporal.io/workflow-execution/continue-as-new
  - https://docs.temporal.io/production-deployment/worker-deployments/worker-versioning
  - https://docs.temporal.io/develop/python/workflows/versioning
  - https://docs.restate.dev/foundations/key-concepts
  - https://restate.dev/vs/temporal
  - https://restate.dev/blog/dealing-with-versioning-in-long-running-agents
  - https://www.dbos.dev/durable-execution
  - https://www.vldb.org/cidrdb/2026/consistency-and-correctness-in-data-oriented-workflow-systems.html
  - https://docs.langchain.com/oss/python/langgraph/checkpointers
  - https://docs.langchain.com/oss/javascript/langgraph/checkpointers
  - https://docs.langchain.com/oss/javascript/langgraph/fault-tolerance
  - https://docs.langchain.com/oss/python/langgraph/functional-api
  - https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header-09
  - https://docs.stripe.com/api/idempotent_requests
  - https://docs.stripe.com/api-v2-overview
  - https://arxiv.org/html/2611.23353v2
  - https://arxiv.org/html/2608.29381v1
  - https://arxiv.org/html/2611.20711v1
status: stable
volatility: medium
verified_at: 2026-11-02
review_by: 2027-03-02
description: 定义生产级 Agent Harness
  的有状态执行边界、事件溯源确定性重放与图超步检查点对照、跨版本钉扎与静默语义损坏防御、五窗口幂等对账恢复（D_replay / I_idem），以及
  Agent-as-Code 的 PR 控制面。
aliases:
  - production-agent-harness
  - cloud-agent-runtime-boundaries
  - harness-execution-boundary
---

# Agent 生产级 Harness 与云端运行时边界

## Summary

本页是 [agent-development-lifecycle](/concepts/agent-development-lifecycle) 在 Build / Deploy / Govern 交界处的架构子主题，综合 Stencil [stencil-the-harness-playbook-2026-09-05](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/stencil-the-harness-playbook-2026-09-05.md)、Tetral [tetral-next-scaling-problem-2026-09-06](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/tetral-next-scaling-problem-2026-09-06.md)、Microsoft Agent Framework [microsoft-devblogs-agent-harness-production-ready-2026-08-27](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/microsoft-devblogs-agent-harness-production-ready-2026-08-27.md) 与 ABC Legal [claude-abc-legal-managed-agents-2026-08-17](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/claude-abc-legal-managed-agents-2026-08-17.md) 四个公开工程案例，并结合持久化执行规范与 2026 年崩溃恢复实证，定义当 Agent 从单机原型走向生产环境时必须立住的四条边界：

1. **Harness 是围绕模型/工具循环的有状态执行边界**：拥有单一权威会话状态、控制面与执行面分离、有界工作单元，并按恢复粒度与跨版本演进约束在**事件溯源确定性重放**与**图超步状态快照**之间明确选型（`D_replay`）。
2. **共享 Agent 定义与薄宿主（Thin Host）分离**：将指令、工具、权限和生命周期集中在单一 factory，由 CLI、托管服务和评测器作为薄宿主消费，避免多份副本漂移。
3. **云端长程运行时与沙箱计算分离**：逐个核对意图提交、外部副作用、结果确认、重试身份与旧执行者隔离（代际绑定）的故障窗口，用预落盘幂等键与崩溃后对账闭环（`I_idem`）约束跨系统写操作，区分凭据隔离与 Tool Gate 操作授权。
4. **Agent-as-Code 与 PR 变更控制面**：把 prompt、工具列表、配置与调优提案纳入版本控制与人工 PR 审批，禁止模型直接在线改写生产规则。

## 1. Harness 作为有状态执行边界

Stencil 的 [stencil-the-harness-playbook-2026-09-05](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/stencil-the-harness-playbook-2026-09-05.md) 指出，Agent Harness 不是外围胶水脚本，而是围绕模型与工具循环的有状态执行边界：它持有权威会话状态、控制面策略、有界工作单元、子代理/后台作业生命周期、兼容性规则、可观测性以及由状态派生的投影视图。

**[推论] AI Agent 可迁移映射：**

- **单一权威状态（Single authoritative state）**：凡影响 rewind、fork、resume、retry、子代理生命周期或崩溃恢复的状态，必须持久化或可从权威 run/session 状态重建；不得依赖插件闭包、进程局部计数器或内存级工具注册表。客户端与本地状态同步边界参见 [local-first-sync-confirmed-mirror-outbox-conflict-policy](/concepts/local-first-sync-confirmed-mirror-outbox-conflict-policy)。
- **控制面与执行面分离（Control plane vs execution plane）**：受信任的父进程/宿主拥有状态、路由、审批、策略、凭据和审计证据；Worker 与沙箱只执行有界指令，不成为策略权威。
- **有界工作单元（Bounded work units）**：Shell 命令、子代理、后台作业与长生命周期服务必须具备显式归属、超时、取消、资源上限、清理逻辑与可观测终态。
- **投影视图与权威回读（Projection and verification）**：TUI、Web、聊天消息、日志和检查视图只是状态投影；完成、取消、恢复、清理及外部副作用应优先从最强的可用权威状态回读（参见 [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification)）。
- **最小充分表面（Smallest sufficient surface）**：在没有具体本地故障、明确项目 owner 与独立验证路径前，不因单篇架构文章引入新的状态树、Director、动态 CLI、工具数量指标、沙箱实现或渲染协议。

**[证据边界]** 原文的架构细节、基准测试、延迟、插件数量和技术选型保留为来源特定主张；上述映射不授权修改 runtime/config、active Skill、MCP、cron、gateway 或 provider。

### 1.1 两类有状态持久化范式对照：事件溯源确定性重放 vs. 图超步状态快照（`D_replay`）

当“单一权威状态”落地为长程持久化引擎时，工业界主要分化为两条形式化路径，二者在恢复粒度、存储膨胀与热更新风险上呈现严格对偶：

1. **事件溯源确定性重放（Event-Sourced Deterministic Replay）**：
   以 [Temporal](https://docs.temporal.io/workflow-definition)、[Restate](https://docs.restate.dev/foundations/key-concepts) 和 [DBOS](https://www.dbos.dev/durable-execution) 为代表，不直接序列化内存栈帧，而是仅持久化外部非确定性操作的结果日志 $H_{1..t-1} = \langle e_1, \dots, e_{t-1} \rangle$，通过确定性折叠 $S_t = \text{FoldL}(f_{\text{det}}, x_0, H_{1..t-1})$ 重建内存态。重放时，编排代码必须按完全一致的顺序发出相同命令序列：命中已记录事件 $e_t$ 则直接注入结果而不重复触发外部动作；若混入未封装的本地时钟、随机 UUID、外部读取或 LLM 采样导致命令失配，则立即抛出 `Non-Determinism Error`（[Temporal Workflow Definition](https://docs.temporal.io/workflow-definition)）。
   - **三类实现取舍**：Temporal 采用外部编排集群与 Worker 轮询分离，单次执行 Event History 硬上限为 **51,200 个事件或 50 MB**（10,240 事件 / 10 MB 告警，并发未决 Activity / 子工作流 / Signal 上限各 2,000），超长程会话必须调用 [`Continue-As-New`](https://docs.temporal.io/workflow-execution/continue-as-new) 原子截断重开（[Temporal Execution Limits](https://docs.temporal.io/workflow-execution/limits)）；Restate 以内嵌共识日志配合 HTTP/2 双向流将单步持久化 P99 压至 `< 10 ms`，并提供按键串行化的 Virtual Objects（[Restate vs Temporal](https://restate.dev/vs/temporal)）；DBOS 将步骤检查点与 `@DBOS.transaction()` 内的业务写合并入同一 PostgreSQL 本地 ACID 事务——Michael Stonebraker 等在 [CIDR 2026（AC/DC 一致性）](https://www.vldb.org/cidrdb/2026/consistency-and-correctness-in-data-oriented-workflow-systems.html)中指出，低并发冲突下数据库物理回退（Physical Backout）优于 Saga，高并发或长耗时外部步骤下仍需依赖 Saga 语义补偿。
   - **跨版本钉扎与 Agent 特有的静默语义损坏（Silent Semantic Corruption）**：[Restate 2026 年 3 月生产报告](https://restate.dev/blog/dealing-with-versioning-in-long-running-agents)指出，Prompt、工具描述与参数 Schema 构成了模型解读历史日志的“度量说明书”。若长程 Agent 挂起期间原地热更新工具契约（例如将风险评分量纲由 `0–10` 改为 `0–100`），恢复后的模型会把历史事件中的 `8` 误读为低风险——**既不抛异常也不触发重放校验错误，而是发生静默语义损坏**。因此生产环境推荐用基础设施级执行钉扎（[Temporal Worker Versioning `PINNED`](https://docs.temporal.io/production-deployment/worker-deployments/worker-versioning) 配合 `Continue-As-New` 升级，或不可变 Serverless 端点绑定）替代繁琐的代码内 [`patched()`](https://docs.temporal.io/develop/python/workflows/versioning) 分支。

2. **图超步状态快照检查点（Graph Superstep Checkpointing）**：
   以受 Pregel 启发的 [LangGraph Checkpointers](https://docs.langchain.com/oss/python/langgraph/checkpointers) 为代表，按离散超步（Superstep）推进双表持久化：`checkpoints` 表存储按字典序 ULID 标识的 `StateSnapshot`，`writes` 表记录并行节点已完成的中间写入（同超步内兄弟节点 B 失败时无需重跑已成功的节点 A）。提供 `"exit"`、`"async"` 与 `"sync"` 三档模式（需注意 [JS SDK 文档](https://docs.langchain.com/oss/javascript/langgraph/checkpointers)说明其首节点前早期 tick 调度可能异步等待）。
   - **节点内局部重放盲区与存储膨胀**：恢复粒度默认停留在**超步/节点边界**。若单节点函数内串联多次外部写操作并在中途崩溃或触发 `interrupt()`，恢复时整个节点函数会从头重跑并重复执行前置副作用，除非显式拆分为独立节点或用 [Functional API `@task`](https://docs.langchain.com/oss/python/langgraph/functional-api) 封装并配合幂等键（[LangGraph Fault Tolerance](https://docs.langchain.com/oss/javascript/langgraph/fault-tolerance)）。若每个超步追加固定大小的数据并保留全部历史，逐步保存全量快照的累计存储为 $O(N^2)$。`langgraph>=1.2` 的测试版 `DeltaChannel` 改为记录增量：在同一假设下，每步新增 $O(1)$，保留 $N$ 步累计 $O(N)$；恢复时需要读取祖先增量。

| 对照维度 | 事件溯源确定性重放（Temporal / Restate / DBOS） | 图超步状态快照（LangGraph Checkpointer） | `[推论]` 运行时契约 `D_replay` 门禁 |
| :--- | :--- | :--- | :--- |
| **最小恢复粒度** | 亚节点级：单个 `Activity` / `ctx.run()` / `@DBOS.step()` | 超步/节点级；节点内多工具调用须拆节点或套 `@task` | 严禁在单恢复单元内裸串联多个非幂等外部写操作 |
| **存储增长与硬限** | 随事件数 $O(N)$ 增长；Temporal 硬限 51,200 事件 / 50 MB | 每步追加固定大小的数据、保留 $N$ 步历史：全量快照累计 $O(N^2)$；`DeltaChannel` 增量累计 $O(N)$ | 长程循环须绑定 `Continue-As-New` 或增量快照裁剪策略 |
| **跨版本演进风险** | 指令序列变更报 `NonDeterminismError`；量纲热更致静默语义损坏 | 允许旧快照直接跑新图，易发反序列化失败或静默语义错位 | 在途运行绑定不可变 `BuildID / SchemaHash`（`PINNED` 钉扎） |

## 2. 共享 Agent 定义与薄宿主分层

Microsoft Agent Framework 的生产化案例 [microsoft-devblogs-agent-harness-production-ready-2026-08-27](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/microsoft-devblogs-agent-harness-production-ready-2026-08-27.md) 补充了 Build 与 Deploy/Test 之间的结构契约：把 instructions、tools、skills、memory、approvals 和资源生命周期集中到一个共享 Agent factory，再由 console、hosted service 和 eval runner 三个薄宿主消费同一份定义。可迁移的核心机制是**“核心定义一次、宿主只负责运行环境”**，从而保证观测、治理、部署和评测面对的是同一个 Agent，而不是三份逐渐漂移的副本。

- **环境策略显式隔离**：本地宿主可保留交互式调试能力；托管宿主默认关闭容器本地文件访问与 shell，需要文件时显式注入外部持久存储；代码执行只有在外部隔离沙箱成立时才可启用，子进程执行器（如原文中的 `LocalCodeAct`）本身不能被称为安全沙箱。
- **评测宿主复用同一定义**：先运行便宜、确定性的本地检查，再按需增加模型评分；trace 中暴露的真实失败应回流为下一轮 eval，而不是直接在线改写 Agent。
- **[推论] 按实际载体数量采用**：只有确实存在 console、runtime、eval 等多个运行载体时才需要共享 factory / thin-host 结构；单入口、局部且可验证的脚本继续保持单一入口，避免为尚不存在的部署形态预建抽象。

## 3. 云端长程 Agent：运行时与计算机分离及故障窗口

Yang Li 的 Tetral 架构叙述 [tetral-next-scaling-problem-2026-09-06](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/tetral-next-scaling-problem-2026-09-06.md) 为上述 harness 边界提供了云端长程实例：Agent 循环作为可替换的无状态计算运行时，沙箱/计算机按需调用而非承载会话身份。Gateway 持有模型连接与凭据，Bridge 负责 PostgreSQL 中的状态提交和回执，Queue/Inbox 负责持久投递，Sandbox Service 负责隔离执行环境。会话中的 thread 是独立有序的执行路径；跨 thread 并行不等于共享上下文，跨 session 共享 workspace 也不等于共享执行历史（会话路由边界另见 [chat-to-agent-session-routing](/concepts/chat-to-agent-session-routing)）。

### 跨进程恢复的五个核对窗口

长程 Agent 的关键失败窗口是**“外部操作已经发生，但运行时未收到确认”**。Tetral 先提交带稳定身份的声明、取得回执，才调度模型或工具；结果也须先提交，reducer 才能用它继续。输入与投递作业同事务登记，丢失唤醒通知靠轮询补偿，接受投递与实际处理分开记录，并用运行时绑定代际（generation binding）防止超时后旧 Pod 仍在处理时错误重投。

**[推论]** 若项目确有跨进程恢复需求，应逐个核对以下五个故障窗口，而非仅增加队列或保存聊天记录：
1. **意图提交（Intent commit）**：调度前是否已落盘唯一操作身份？
2. **外部效果（External side effect）**：目标系统是否支持幂等键或事前状态查询？
3. **结果确认（Result receipt）**：工具返回后但 reducer 更新前崩溃，恢复时如何避免重复执行？
4. **重试身份（Retry identity）**：重试是否复用原操作身份而非生成新请求？
5. **旧执行者隔离（Stale worker fencing）**：超时重投后，旧进程迟到的写入是否会被代际号拒绝？

**单调代际隔离令牌（Fencing Tokens）硬拒绝不变量**：针对窗口 5，Martin Kleppmann（2016，[*How to do distributed locking*](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)）证明：在可能发生 GC 暂停、容器挂起或网络延迟重排的异步系统中，仅靠 Worker 在执行前自检租约到期时间（TTL）无法阻止超时后的僵尸覆盖写入。`[推论]` 安全的跨进程代际隔离要求调度队列每次分配租约时发放严格单调递增的代际号 $g_1 < g_2 < \dots$，并由状态存储层（如 Bridge 数据库）或受控资源端维护目标会话 $s$ 已接受的最大代际号 $g_{\max}(s)$，对每次携带 $g_{\text{req}}$ 的状态转移或回执登记强制执行原子校验：
受控资源拒绝 $g_{\text{req}} < g_{\max}(s)$ 的写入。满足 $g_{\text{req}} \ge g_{\max}(s)$ 仅通过代际校验，提交仍须满足授权、业务前置条件和幂等约束。存储端将代际比较、受保护写入与 $g_{\max}(s)$ 的更新置于同一原子操作中。新代际在受控资源生效后，旧执行者的迟到写入才会因代际过时而被拒绝。

此机制不让任意外部系统自动具备事务性，也不保证副作用恰好执行一次；持久化载体的成本与复杂度取舍见 [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs)。

### 长程副作用的 Saga 补偿事务、柔性长事务枢轴与模糊远程结果恢复

当长程 Agent 跨多个外部 API、代码仓库或 SaaS 服务执行写操作时，由于无法跨外部系统维持传统数据库的分布式 ACID 锁，其恢复语义应联合锚定两代数据库长事务原典：Hector Garcia-Molina 与 Kenneth Salem（1987，[Princeton 技术报告 CS-TR-070-87](https://www.cs.princeton.edu/techreports/1987/070.pdf) 与 ACM SIGMOD [*SAGAS* 原文 PDF](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf)）提出的 **Saga 语义补偿与向后恢复模式**，以及 Sharad Mehrotra 等（1992 ICDCS）与 Aidong Zhang、Marian Nodine、Bharat Bhargava、Omran Bukhres（1994，[ACM SIGMOD DBLP 记录](https://dblp.org/rec/conf/sigmod/ZhangNBB94.html)；定义综述见 [IST Transaction Support Survey §2.4](https://adapt.ls.fi.upm.es/transactions.pdf/@@download/file/transactions.pdf)）在 **柔性长事务（Flexible Transactions）** 中正式确立的“可补偿 / 枢轴 / 可重试”三元子事务划分（1987 年原始 Saga 论文仅定义了全部带补偿函数 $C_i$ 的向后恢复与纯向前重试，并未包含 `Pivot` 子事务分类），据此将工具调用序列 $T_1, T_2, \dots, T_n$ 按可逆性划分为三类操作单元：
1. **可补偿事务（Compensable transactions）**：已提交的局部写操作具备明确的业务逆操作 $C_i$（例如创建临时分支对应删除分支、预占日程对应取消预约）。当后续步骤 $T_k$ 失败或被用户取消时，Harness 协调器按逆序调用 $C_{k-1}, \dots, C_1$ 执行**向后恢复（Backward recovery）**，使外部环境回到语义等价状态，而非仅清理本地会话内存。需注意 [Garcia-Molina & Salem (1987)](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf) 将 $C_i$ 定义为业务语义补偿而非物理回滚，不能抹除 $T_i$ 曾对外部可见的中间状态；其恢复机制由事务执行组件与持久日志记录补偿是否提交，并非要求所有业务补偿函数本身都幂等。**[推论]** 跨外部 API 的补偿必须另行保证安全重试，可采用业务幂等，或稳定操作键配合服务端原子去重；仅携带一个键并不足够。遇到补偿结果未知时仍需按下述在途效果边界取证，不能盲目重复补偿；无法安全恢复时转人工介入。
2. **枢轴事务（Pivot transaction）**：柔性长事务中的**不可逆分界点（Go/No-Go point）**——即既不可自动补偿、也不可无副作用撤回的动作（例如对外发送正式邮件、发布公开包、执行生产环境破坏性迁移或资金扣划）。一旦枢轴事务提交，工作流便不可向后回滚；因此 **Tool Gate 人工审批、阶段非对称授权降级（[agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows)）、只读预检（dry-run）与权威状态快照必须严格前置在枢轴事务提交之前**（生产事故止血中的具体应用见 [google-sre-gemini-cli-incident-response](/concepts/google-sre-gemini-cli-incident-response)）。
3. **可重试事务（Retryable transactions）**：位于枢轴事务之后的收尾步骤（如同步本地索引、写入归档日志、发送完成回执），必须设计为幂等操作（配合上述窗口 1–4 的唯一操作身份），以便在断连恢复时通过**向前恢复（Forward recovery）**重试直至收敛。
4. **模糊远程结果（Ambiguous Tool Outcomes）的先取证后恢复边界**：结合近期针对工具结果未知的恢复研究（[*Evidence-Guided Recovery for AI Agents with Ambiguous Tool Outcomes*, arXiv:2610.41453v1](https://arxiv.org/html/2610.41453v1)），当窗口 2 与窗口 3 之间因网络超时、网关断连或部分批量失败导致远端副作用处于**结果未知（Unknown Outcome）**状态时，盲目重跑整条工作流可能重复触发不可逆外部副作用，而直接终止则会遗留未完成的业务义务。该论文 §2.3 明确指出：若旧请求仍可能提交，一次负向回读不足以允许非幂等重试。**[推论]** 恢复时先核对下游操作身份、幂等回执账本与权威状态（[stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification)），但必须区分“当前未查到效果”与“原请求已终止且不会再生效”：后者需要服务端明确的未提交终态、保证阻止未来提交的取消确认，或已知请求终止界限加上可见性延迟界限；仅等过本地超时或可见性延迟，不证明在途请求已经终止。确认结果与残余在途效果后，才裁决依赖该结果的继续执行或补偿；重试须有仍有效的服务端幂等契约或已证明不会重复效果，补偿也须排除旧请求随后提交造成的竞态。无法取得这些保证时保留 `unknown`、停止相关不安全动作并升级人工确认，不将资源暂不存在记为“确认未执行”，也不要求重跑整条工作流。

### 跨外部系统幂等标准契约与 2026 恢复连续性实证（`I_idem`）

运行时内部的 Effectively-Once 保证绝不自动延伸至外部异构 HTTP API（[DBOS Durable Execution Guide](https://www.dbos.dev/durable-execution)）。跨系统写操作需对齐外部幂等协议并补齐预落盘账本与事后对账：

- **外部 HTTP 幂等头与失败缓存语义差异**：[IETF `draft-ietf-httpapi-idempotency-key-header-09`（2026-11-21）](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header-09)为非幂等 `POST`/`PATCH` 请求定义结构化 `Idempotency-Key` 字符串请求头与载荷指纹校验契约——缺失必填键返回 `400`，同键不同载荷返回 `422`，并发在途请求冲突返回 `409`。工业界实现还需区分失败缓存策略（最长 255 字符、保留期至少 24 小时）：[Stripe API v1](https://docs.stripe.com/api/idempotent_requests) 直接重放首次响应（含缓存的首次 `500` 报错），而 [Stripe API v2](https://docs.stripe.com/api-v2-overview) 则推进未完成或部分失败的操作继续重试直至收敛。幂等键必须在副作用**发生之前**持久落盘（例如前置节点配合 `durability="sync"`，[LangGraph Fault Tolerance](https://docs.langchain.com/oss/javascript/langgraph/fault-tolerance)）。
- **“幂等不等于恢复”定量消融**：[*Idempotency Is Not Recovery*（arXiv:2611.23353v2，2026-11）](https://arxiv.org/html/2611.23353v2) 在 Windows 与 Linux 各执行 `7,513` 次受控故障试验（F1–F10）：完整防护配置 `B3`（预留账本 + 稳定标识 + 目标端幂等 + 崩溃后对账 + 密封证据）将后置崩溃与重放下的重复副作用从简化基线的 `117/200` 压至 **`0/200`**（F4 响应丢失实验由 `66/100` 降至 `0/100`）。消融实验证明，仅保留目标端幂等而移除本地预留/完成账本（`A1`）虽无重复，却产生 **`170/170` 个孤儿副作用**（恢复率由 `300/300` 跌至 `200/300`）；仅禁用崩溃后对账（`A2`）则使 **`100/100`** 后置崩溃陷入永久 `Ambiguous` 态。代价是 `B3` 吞吐量降至无持久化基线的**约 1/7**（Windows `3.00` vs `20.57 ops/s`，Linux `41.94` vs `318.81 ops/s`，单动作中位增加 `4` 个 SQLite 事务与 `10,204` 字节），且在证据写入 I/O 故障（F6）下因拒绝无证据提交导致 `75/100` 试验挂起未决。
- **回滚撕裂执行连续性与盲目恢复提示词负迁移**：[*Safe to Resume?*（arXiv:2608.29381v1，2026-08）](https://arxiv.org/html/2608.29381v1) 在 `1,735` 次真实运行中定义五类连续性失效（SF1–SF5）：框架检查点遗漏工作区文件态（SF1）发生率达 **`67.2%`（1,166/1,735）**，非绑定随机重放（SF4）达 `67.7%`（OS/VM 级快照如 E2B 可将 SF1/SF2 降至 `0`，但仍残留 `55` 例外部状态失配 SF3）；在外部动作与检查点提交之间注入崩溃时，裸 `Execute → Commit` 重复执行率达 **`93.8%`（90/96）**，裸 `Commit → Execute` 漏执行率达 **`96.9%`（93/96）**。此外，[*AgentFaultBench*（arXiv:2611.20711v1，2026-11）](https://arxiv.org/html/2611.20711v1) 在隔离 GitLab CE 环境的 `1,944` 次主实验显示，向系统提示词泛化注入恢复建议反而令 GPT-4o mini 的严格安全成功率下降 `8.33` 个百分点（`124/216` vs `142/216`），且 `318/1,879` 次运行虽达成目标物理终态却违背前置读取或当前真实校验契约。

`[推论]` 结合本页与系统工程总纲（[agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering)），跨系统写操作应遵循预落盘幂等与对账不变量 `I_idem`：$\text{Persist}(k, \text{fingerprint}) \prec \text{Exec}(k) \prec \text{Reconcile}(k)$，并在恢复检查点中同步对齐内存会话态与工作区文件态；吞吐敏感的只读路径豁免完整账本开销。

### 凭据隔离与 Tool Gate 授权分离

Tetral 将模型与 MCP 凭据留在连接服务，由 Tool Gate 在执行前评估操作（参数值级策略拦截与 Confused Deputy 防御边界见 [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary)；代码执行沙箱的内核隔离谱系、微虚拟机状态恢复、出口授权与代理层凭据注入详见 [agent-execution-sandboxing-and-browser-isolation](/concepts/agent-execution-sandboxing-and-browser-isolation)），需审查的提议必须先记录决定，才能成为可调度工具调用。作者还提出以候选产物的对抗复核和人工接受代替无边界的多 Agent 聊天（这属于设计主张，不能从并行线程数量推断质量提升，编排边界见 [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)）。

**[适用限制]** Tetral 原文是作者对个人 k3s 集群 Alpha 的描述，未证明持续多节点恢复、容量感知调度或端到端反压；上述 2026 预印本实验基于单机故障注入或受控基准，不自动构成跨云多租户 SLA 承诺，也不作为单机短任务照搬重型持久化引擎的默认要求。

## 4. Agent-as-Code 与 PR 变更控制面

ABC Legal 的企业案例 [claude-abc-legal-managed-agents-2026-08-17](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/claude-abc-legal-managed-agents-2026-08-17.md) 展示了如何用现有软件工程控制面治理生产 Agent：每个 Agent 的 prompt、工具列表、调度、凭据引用和 memory 配置都进入 Git；任何行为变更先成为 Pull Request，经人工审批后才部署，使版本历史、审查、回滚和审计复用同一控制面。新 Agent 先在 human-in-the-loop 模式中给出建议并积累标注反馈与 eval，只有在特定任务上达到设定门槛后才逐步获得自动执行权限。

对需要持续反馈调优的 Agent，该案例使用 `Initial Agent → Harvester → Tuner` 三段式分离：运行 Agent 留下审计轨迹，Harvester 从 Slack 回复和 Emoji 收集标签，Tuner 周期性提出 prompt 或 YAML 配置 PR；**模型不直接在线改写生产规则，合并权仍由人类掌握**。规则晋升与经验固化边界分别见 [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules) 与 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops)，与模型/角色级 harness 配置原则（[hermes-model-specific-harness-profiles](/concepts/hermes-model-specific-harness-profiles)）互补。

**[推论]** 可迁移的是四个控制点：可审查的文本资产、PR/diff 作为变更边界、基于真实反馈的离线 eval，以及人工批准后的分级放权。ABC Legal 报告的 Agent 数量、约 98% 一致性及最高约 50% 成本下降仅属该公司特定业务案例，不作为通用阈值。

## Relations

- refines: [agent-development-lifecycle](/concepts/agent-development-lifecycle)
- depends_on: [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification), [local-first-sync-confirmed-mirror-outbox-conflict-policy](/concepts/local-first-sync-confirmed-mirror-outbox-conflict-policy)
- related: [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs), [hermes-model-specific-harness-profiles](/concepts/hermes-model-specific-harness-profiles), [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules), [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [chat-to-agent-session-routing](/concepts/chat-to-agent-session-routing), [google-sre-gemini-cli-incident-response](/concepts/google-sre-gemini-cli-incident-response), [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary), [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense), [agent-execution-sandboxing-and-browser-isolation](/concepts/agent-execution-sandboxing-and-browser-isolation), [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering), [agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows)

