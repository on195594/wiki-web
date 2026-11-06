---
title: Agent Development Lifecycle
created: 2026-05-11
updated: 2026-11-05
type: concept
tags:
  - agent
  - lifecycle
  - evaluation
  - deployment
  - monitoring
  - governance
sources:
  - raw/articles/langchain-agent-development-lifecycle-2026-05-09.md
  - raw/articles/machinelearningmastery-agent-regression-tests-2026-08-17.md
  - raw/articles/claude-abc-legal-managed-agents-2026-08-17.md
  - raw/articles/anthropic-ai-native-sdlc-playbook-2026-08-21.md
  - raw/articles/microsoft-devblogs-agent-harness-production-ready-2026-08-27.md
  - raw/articles/thenewstack-agent-context-development-lifecycle-2026-08-31.md
  - raw/articles/stencil-the-harness-playbook-2026-09-05.md
  - raw/articles/tetral-next-scaling-problem-2026-09-06.md
  - docs:https://commandline.microsoft.com/new-agentic-software-delivery-primitives/
status: stable
description: 定义 Agent 从构建、测试、部署、监控到治理的工程生命周期。
aliases:
  - agent-lifecycle
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Agent Development Lifecycle

## Summary

适用范围：本文的 Skill、plan、todo 与历史检索名称仅表示职责或实现示例；按目标宿主和项目现有能力映射，不假定预装同名工具。所有建议服从当前授权与项目规则。
Agent 工程化的核心不是让模型一次跑通，而是建立 `Build → Test → Deploy → Monitor` 的闭环，并用 `Govern` 横切管理成本、权限、上下文、工具和复用资产。

核心原则：可靠 agent 不是一次性 demo，而是一个可循环改进的工程系统：先构建明确边界，再用 eval 和场景测试验证，受控部署到可恢复运行时，用 trace 和反馈监控真实行为，并由治理层管理成本、权限、上下文和资产复用。

## Source anchor
本页最初来自 LangChain 文章 [langchain-agent-development-lifecycle-2026-05-09](https://github.com/on195594/wiki/blob/99264e093374efa53018ff5b8905a9038c3588a2/raw/articles/langchain-agent-development-lifecycle-2026-05-09.md)，后续由回归测试 [machinelearningmastery-agent-regression-tests-2026-08-17](https://github.com/on195594/wiki/blob/99264e093374efa53018ff5b8905a9038c3588a2/raw/articles/machinelearningmastery-agent-regression-tests-2026-08-17.md)、企业案例 [claude-abc-legal-managed-agents-2026-08-17](https://github.com/on195594/wiki/blob/99264e093374efa53018ff5b8905a9038c3588a2/raw/articles/claude-abc-legal-managed-agents-2026-08-17.md)、[anthropic-ai-native-sdlc-playbook-2026-08-21](https://github.com/on195594/wiki/blob/99264e093374efa53018ff5b8905a9038c3588a2/raw/articles/anthropic-ai-native-sdlc-playbook-2026-08-21.md)、Microsoft Agent Framework 的 [microsoft-devblogs-agent-harness-production-ready-2026-08-27](https://github.com/on195594/wiki/blob/99264e093374efa53018ff5b8905a9038c3588a2/raw/articles/microsoft-devblogs-agent-harness-production-ready-2026-08-27.md)、The New Stack 的 [thenewstack-agent-context-development-lifecycle-2026-08-31](https://github.com/on195594/wiki/blob/99264e093374efa53018ff5b8905a9038c3588a2/raw/articles/thenewstack-agent-context-development-lifecycle-2026-08-31.md) 和 [stencil-the-harness-playbook-2026-09-05](https://github.com/on195594/wiki/blob/99264e093374efa53018ff5b8905a9038c3588a2/raw/articles/stencil-the-harness-playbook-2026-09-05.md) 补充。

该文有产品导向：LangGraph、LangSmith、Deep Agents 等是 LangChain 生态中的参考实现，不应直接等同于 AI Agent 的默认方案。本页只沉淀可迁移的生命周期模型。

## Core lifecycle

### 生产级 Harness、薄宿主与云端运行时边界（子页导航）

围绕模型/工具循环的有状态执行边界、共享 Agent 定义与薄宿主分层、云端长程运行时与沙箱计算分离，以及 Agent-as-Code 的 PR 变更控制面已拆分为独立子概念页 [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries)，核心约束包括：

1. **Harness 作为有状态执行边界**（[stencil-the-harness-playbook-2026-09-05](https://github.com/on195594/wiki/blob/99264e093374efa53018ff5b8905a9038c3588a2/raw/articles/stencil-the-harness-playbook-2026-09-05.md)）：持久化单一权威会话状态（客户端同步见 [local-first-sync-confirmed-mirror-outbox-conflict-policy](/concepts/local-first-sync-confirmed-mirror-outbox-conflict-policy)），分离父级控制面与沙箱执行面，为后台作业设置显式超时、取消与清理契约，并从权威状态而非 UI 投影回读完成与副作用。
2. **共享 Agent 定义与薄宿主**（[microsoft-devblogs-agent-harness-production-ready-2026-08-27](https://github.com/on195594/wiki/blob/99264e093374efa53018ff5b8905a9038c3588a2/raw/articles/microsoft-devblogs-agent-harness-production-ready-2026-08-27.md)）：将指令、工具、权限与生命周期集中在单一 factory，由 CLI、托管服务与评测器作为薄宿主按环境策略消费同一定义；子进程执行器（如 `LocalCodeAct`）不等于安全沙箱。
3. **云端长程运行时与计算机分离**（[tetral-next-scaling-problem-2026-09-06](https://github.com/on195594/wiki/blob/99264e093374efa53018ff5b8905a9038c3588a2/raw/articles/tetral-next-scaling-problem-2026-09-06.md)）：解耦 Gateway、Bridge、Queue 与 Sandbox，跨进程恢复需逐项核对**意图提交、外部效果、结果确认、重试身份与旧执行者代际隔离**五个故障窗口（持久化取舍见 [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs)），并区分凭据隔离与 Tool Gate 操作授权。
4. **Agent-as-Code 与 PR 控制面**（[claude-abc-legal-managed-agents-2026-08-17](https://github.com/on195594/wiki/blob/99264e093374efa53018ff5b8905a9038c3588a2/raw/articles/claude-abc-legal-managed-agents-2026-08-17.md)）：将 Agent 配置纳入 Git 与人工 PR 审批，通过 `Initial Agent → Harvester → Tuner` 离线提议变更，禁止模型直接在线改写生产规则（晋升与固化边界见 [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules) 与 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops)）。

### Context Development Lifecycle：上下文资产的聚焦视角

The New Stack 文章把 skills、agent 配置、prompt 指令和规则文件视为软件资产，并提出 `Generate → Evaluate → Distribute → Observe` 的 Context Development Lifecycle（CDLC）。它不是另一套 AI Agent 总工作流，而是对本页生命周期中“上下文资产”这一子集的聚焦映射：

- Generate → Build：编写 skill、prompt 配置和 agent 规则；
- Evaluate → Test：验证 frontmatter/语法、触发准确性、场景输出、跨模型与版本回归，以及是否重复模型已知内容；
- Distribute → Deploy：通过版本控制、可发现入口和权限边界发布，而不是聊天中复制文件；
- Observe → Monitor：从真实使用、人工纠正和完成任务所需轮次中识别缺失、错误或过时的上下文。

[推论] 对 AI Agent，这四阶段由现有 owner 分担：知识与方法维护者决定生成与分层，项目评测流程提供证据，运行配置维护者负责受控发布与退役，post-session / scheduled knowledge review 只在相应触发下收集反馈。映射的价值是补足交接，不是再建一个 `CDLC` skill 或中央 registry。

### 1. Build
Build 阶段先决定 agent 系统的抽象层级，而不是直接堆 prompt 或工具。

常见层级：
- agent framework：组合 model calls、tools、prompts、retrieval、structured outputs 和 loops
- agent runtime：管理 state、control flow、durability、branching、pause/resume 和 human intervention
- agent harness：提供 prompts、skills、MCP servers、hooks、middleware、filesystem 等执行周边
- no-code / low-code builder：让领域专家参与 prompt、workflow 和 context 编辑

可迁移原则：简单任务可以只需要 tool-calling loop；复杂 agent 需要工程师保留 hooks、middleware、auth、approval 和业务规则控制权。

共享 Agent factory 与 console / hosted / eval 薄宿主的分层边界见子页 [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries)。

### 2. Test
Test 阶段必须在生产前发生，但不必等完美评估集。

起点可以是：
- dogfooding 中发现的失败案例
- 真实用户反馈
- 边缘任务
- 多轮对话场景
- 工具调用失败路径
- 版本对比样本

多轮 agent 不能只靠单轮问答测试。客服、编程、检索、操作型 agent 都需要场景模拟，因为它们的关键能力是追问、查状态、调用工具、从歧义中恢复并完成端到端任务。

进入 Deploy 前，按系统实际能力选用 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)（子页 [agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging)）的结构性回归矩阵：上下文裁剪、外部写入、非可信检索、结构化输出、循环编排、RAG 和持久状态分别触发对应测试；不存在该能力时跳过，不把七项清单机械升级为所有 Agent 的统一门禁。真实失败再交给 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation) 形成回归工件。

### 3. Deploy
Deploy 阶段不同于普通无状态应用部署。

生产级 agent 通常需要：
- durable execution：任务中断、报错或等待审批后可以恢复
- sandbox：隔离代码执行、文件写入和高风险工具调用
- human-in-the-loop：敏感动作、低置信度或外部副作用前暂停等待人工审批
- state persistence：跨步骤保存必要状态，而不是依赖聊天历史
- rollback boundary：输出、配置、权限和调度可回滚

### 4. Monitor
Monitor 阶段不能只看 uptime、latency、cost 或 API error rate。

Agent 可能没有报错，但在几步前选错工具、拿错上下文或传错参数，最后输出一个看似合理的答案。生产监控必须保留 trace：
- 用户输入
- 模型调用
- 工具调用
- 工具返回
- 中间判断
- 最终输出或动作
- 用户反馈或人工审查结果

Trace 的价值不是归档过程，而是让失败能被定位、复现，并转化成下一轮 eval。

#### 上下文资产的方向性观测信号

[thenewstack-agent-context-development-lifecycle-2026-08-31](https://github.com/on195594/wiki/blob/99264e093374efa53018ff5b8905a9038c3588a2/raw/articles/thenewstack-agent-context-development-lifecycle-2026-08-31.md) 提出两个可选信号：`human touch` 观察开发者纠正、补充或接管 agent 的频率，`reuse multiplier` 观察一次 skill/context 改进能被多少使用者或工作流复用。它们适合帮助定位上下文质量和分发问题，但文章没有给出独立基线、统一口径或普适阈值，因此不作为 AI Agent KPI 或自动晋升条件。任务结果正确性、边界遵守和可验证交付仍优先于单纯减少人工介入。

### 5. Govern
Govern 横跨 Build、Test、Deploy、Monitor。

治理不是为了减速，而是为了让快速迭代不失控。核心对象包括：
- 成本追踪和预算
- 工具访问权限与审计
- 人类审批点
- prompt / skill / context / agent 资产的复用和版本化
- 领域 owner 负责内容正确性，平台/治理 owner 负责验证、分发、安全扫描和退役机制
- 生产行为可见性
- 多团队、多 agent 之间的一致边界

Agent-as-code、Git/PR 变更控制面与 `Initial Agent → Harvester → Tuner` 反馈调优闭环见子页 [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries)。

### 补充：提交工件驱动的 AI-native SDLC

Anthropic 的 AI-native SDLC playbook 把 Plan、Design、Build、Test、Deploy、Maintain 从线性交接改写为由已提交工件连接的循环：`intent → spec → plan → code/tests → PR/review → incident record → new intent`。每个阶段读取上一阶段已批准的产物，并把自己的产物提交到版本控制；提交历史同时承担需求、决策、实现和批准的审计轨迹。

这套框架补充了三个可迁移原则：

- **瓶颈随代码生成速度迁移**：当 Build 压缩到小时级，Plan、验证、审批和生产反馈会成为主要约束；增加更多编码 Agent 不能解决上下游拥堵。
- **建议性控制与确定性控制分层**：Prompt、`CLAUDE.md` 和 Skills 用于传递上下文与策略，但不能保证执行；必须成立的边界应由测试、Hooks、CI、沙箱、权限和人工批准负责。
- **生产反馈重新进入生命周期**：监控信号应先由确定性规则检测，再触发有权限边界的诊断或候选变更，并把结果写回下一轮可审查工件，而不是让模型直接在线改写生产规则。

[推论] 对 AI Agent，价值不在于强制采用这些文件名或新增一套总工作流，而在于保持现有 owner 间的可审查交接：用户请求或项目问题承载 intent，项目规格定义契约，必要的计划承载依赖步骤，既有开发流程负责实现与验证路由，active-layer/runtime owner 负责发布、回滚和生产权限。只有跨会话、委派或多阶段任务才值得保存独立工件；清晰、局部、可逆且有便宜验证的小改动继续走 Direct。

#### 阶段契约与共享知识的效果

[微软对智能体软件交付的讨论](https://commandline.microsoft.com/new-agentic-software-delivery-primitives/)（Tim Bozarth，2026-10-27）以 `Plan → Build → Verify → Observe` 描述软件交付，而本页的 `Build → Test → Deploy → Monitor` 侧重 Agent 系统的工程生命周期；两者关注对象和阶段划分不同，并非必须互相替换。前者建议明确各阶段的输入、人和 Agent 的职责、输出工件与成功标准；交接时传递产物、支撑证据和尚未解决的问题。Verify 包含验证与交付，Observe 将使用和运行结果反馈到下一轮目标。

文章将目标、设计决策、实现背景、验证证据、发布记录和生产信号连接为共享知识，并要求保留来源与版本、区分观察和解释、按权限提供上下文。文章还提出用具体任务比较**有与无合成知识**时的效果、速度和效率，而不是以数据量代替价值判断；经验如何路由、复用和重验证由 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) 维护，知识层归属见 [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)。

[证据边界] 这是微软的架构主张及产品实践介绍，原文未提供支持普遍提效的端到端对照实验；该比较是评估问题，不是已证实的效果。人类与自动化验证的具体分工应按风险和真实证据决定，不能据此免除必要的人类审查。

[推论] 先复用现有项目文档、测试和运行证据，在实际交接或检索出现问题时再补机制；简单任务仍可直接完成并验证，不必为四阶段新建流程、统一数据库或自动总结器。评估知识增益时应尽量保持任务和条件可比，同时观察正确性、耗时与成本，避免只看命中率或速度。

## AI Agent interpretation
这篇文章给 AI Agent 的价值，是把已有零散原则放进一条生命周期总线。

AI Agent 映射：
- Build：skills、project context、MCP、subagent、wrapper、runtime profile、wiki/context 层
- Test：fixture、eval、code review、browser/terminal verification、project validation lane
- Deploy：quick command、cron、gateway route、runtime profile；都需要单独批准和回滚边界
- Monitor：run logs、output paths、health checks、trace-like evidence、session/project closeout
- Govern：memory/skill/wiki/project/cron 分层、权限边界、人工审批、成本和工具暴露控制

## Relation to existing wiki
本页不是替代已有页面，而是提供上层 lifecycle frame：
- [agent-self-validation-loops](/concepts/agent-self-validation-loops)：落在 Test / Monitor 的目标-反馈-迭代结构
- [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)：落在 Build 阶段的 agent 生命周期复杂度选择
- [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs)：落在 Build / Deploy 阶段的成本、延迟、准确率和复杂度取舍
- [hermes-model-specific-harness-profiles](/concepts/hermes-model-specific-harness-profiles)：落在 Build 阶段的模型与 harness 适配
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)：落在 Govern 层的内容归属、执行方法、触发、外部能力和运行状态组合路由
- [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops)：落在 Monitor 之后，把失败、反馈和经验回灌成未来资产

## What not to copy blindly
- 不要因为文章强调 LangGraph / LangSmith / Deep Agents，就把它们视为 AI Agent 的必选架构。
- 不要把 `intent.md`、`spec.md`、`plan.md` 固化为所有任务的必填文件；工件形式应服从任务跨度、审查和交接需求。
- 不要把 20–50 个历史任务、1σ/2σ/3σ 响应层级、“一页 CLAUDE.md”或“错误两次即写规则”升级为 AI Agent 默认阈值；它们是来源中的起步建议，需要本地证据。
- 不要因官方来源直接采用 Claude Security、Claude Tag、Cowork、Managed Settings 或其他 Anthropic 产品；产品选择、凭证、运行时和自动化仍需独立评估与授权。
- 不要因为 Microsoft 示例把 OpenTelemetry、Purview、Foundry、Blob Storage 或 `LocalCodeAct` 当成 AI Agent 默认选型；其中 `LocalCodeAct` 明确不是沙箱，任何托管、凭证、遥测内容捕获或代码执行能力都需要独立项目证据和授权。
- 不要把生命周期页直接变成 skill；它当前是架构概念，不是本地已验证 SOP。
- 不要把 Monitor 理解成“保存全部聊天记录”；应保存足以定位失败和构造 eval 的 trace-like evidence。
- 不要因 CDLC 文章倡导集中观测，就默认新增全量日志、dashboard、registry 或常驻 observer；先复用现有 session evidence、项目验证和按触发运行的知识审查。
- 不要把 `human touch` 或 `reuse multiplier` 直接设成 KPI；二者来自赞助文章中的经验框架，缺少独立比较和统一测量边界。
- 不要把 Govern 理解成重流程审批；治理的目标是低风险快速迭代。

## Validation outcome
本仓库不包含可公开复验的项目级验证 artifact，因此不把私有试运行写成“已验证”的公共事实。以下映射是由公开来源综合出的检查框架，应用到具体项目时仍需留下该项目自己的公开 fixture、测试、部署回读和监控证据：

- Build：需求、接口、权限和运行时边界清楚；
- Test：行为、失败路径与回归检查可重复；
- Deploy：发布路径、版本和回滚点明确；
- Monitor：健康、运行报告和静默/告警合约可检查；
- Govern：数据、凭证、外部副作用与晋升授权有显式边界。

经验局限：这是一套设计综合，不是某个未公开项目的成功率或生产适用性证明。

## Validation and promotion path
当前状态：wiki concept 已形成公开方法框架，但未附带公共项目验证；它不授权修改 memory、skill、cron 或 runtime。

后续若要转成 AI Agent 操作实践，应继续在真实小项目或 Agent 应用 项目中验证 lifecycle checklist：
1. Build artifact 是否明确？
2. Test/eval 是否存在？
3. Deploy 边界是否可回滚？
4. Monitor/trace/log 是否能定位失败？
5. Govern 权限、成本、人工审批和资产复用是否明确？

只有当该 checklist 在更多真实项目中证明可复用，再考虑 patch 现有 skills 或新增窄职责 `agent-lifecycle-review` skill；任何 active-layer 变更都需要单独决策、备份、回滚和用户批准。

## Relations

- depends_on: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- related: [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries), [agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [local-first-sync-confirmed-mirror-outbox-conflict-policy](/concepts/local-first-sync-confirmed-mirror-outbox-conflict-policy), [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [hermes-model-specific-harness-profiles](/concepts/hermes-model-specific-harness-profiles), [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops), [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow), [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation), [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules)

