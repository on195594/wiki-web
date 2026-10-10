---
title: Agent Shared Wiki
---

# Wiki Index

> 可跨用户、跨项目复用的公开知识目录。
> 这里记录正式知识页面，不记录个人运行状态、私有会话或任务台账。
> 使用知识前按 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 执行 Freshness Gate；摄取分类见 [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)。
> Last updated: 2026-10-10 | Indexed pages: 116

## 按任务进入

人类与 AI Agent 共用以下正文和证据。按需要选择入口，无需通读目录。

| 现在要做什么 | 入口 |
|---|---|
| 理解知识库如何分层 | [共享知识架构](concepts/hermes-knowledge-architecture.md) |
| 找概念、方法或决策 | 下方分类目录；先读页面 Summary，再按需要追来源 |
| 判断知识是否仍适用 | [检索与新鲜度规则](concepts/hermes-retrieval-priority-and-answer-path.md) |
| 判断内容与证据是否可入库 | [Wiki Schema](SCHEMA.md)：准入、主维护位置、证据范围与历史保留 |
| 新增或更新知识 | [入库流程](concepts/wiki-ingestion-workflow.md) · [写作规范](concepts/hermes-wiki-page-writing-standards.md) |
| 检查链接、来源与结构 | [健康检查操作指南](_meta/wiki-health-check-runbook.md) |
| 接入 AI Agent | [Agent 按需检索入口](operations/agent-shared-wiki-index.md) |
| 查看治理与变更 | [Schema](SCHEMA.md) · [变更日志](log.md) |

历史 `hermes-*` 文件路径保留以兼容引用；标题和摘要定义当前通用知识范围。Hermes 产品评估与历史决策仍保留产品名，不能当作所有 Agent 的能力声明。

## Entities
- [flutter](/entities/flutter) — Google 管理的开源跨平台 UI 框架：Dart/Engine/Embedder 分层、声明式 Widget 模型、平台互操作、工程实践与采用边界
- [nimbus-docs](/entities/nimbus-docs) — 基于 Astro 的文档站点方案：仓库可编辑文件、Agent 可读端点、内容校验、公开边界及采用限制

## Concepts

### 1. 智能体架构与认知上下文 (Agent Architecture & Context Engineering)
- [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules) — Agent 闭环学习：把用户纠错先保存为结构化记忆，再经规则蒸馏、影子/离线评估和显式推广，升级为默认行为
- [agent-context-engineering](/concepts/agent-context-engineering) — Agent 上下文工程：用最小必要上下文、工具反向边界和显式长程状态防止偏航；以 Impeccable 为 UI 产品背景与定向设计意图的实例，不把命令意图当作执行或效果保证；过程记录仍受公开准入约束
- [agent-development-lifecycle](/concepts/agent-development-lifecycle) — Agent 开发生命周期：连接 Build → Test → Deploy → Monitor，以 Govern 横切治理；涵盖 harness 权威状态与 Tetral 云端运行时、持久投递、沙箱解耦的边界
- [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) — Agent 经验与 Skill 生命周期闭环：区分任务技能与支持设计元技能；只把公开、长期可复用的发现编译进正式页，治理候选验证、准入与回滚，不把研究增益当作默认执行授权
- [agent-harness-search-regularization](/concepts/agent-harness-search-regularization) — Agent harness 搜索正则化：约束候选提案与采纳，并用未见任务、噪声和成本检验改动是否可迁移；RRSI 数值只限其评测条件
- [agent-resource-optimization](/concepts/agent-resource-optimization) — Agent 资源优化：用集合覆盖、分配、背包和网络流视角建模资源约束；以 Open SWE 线上案例解释任务上下文驱动的模型分层、低价替代反例与证据边界
- [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering) — Agentic programming 的系统工程边界：把 Agent 视为带状态、工具、记忆和目标管理的执行系统，用负向工具约束、最小上下文、行为漂移治理和分层记忆降低生产风险
- [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk) — AI Agent 文档保真风险：多轮委托式工作流中模型可能悄悄重写、扭曲或幻觉原文，需用短步骤、diff、可逆验证、受限工具和中间态审计控制风险
- [ai-agent-human-outcome-design-principle](/concepts/ai-agent-human-outcome-design-principle) — AI Agent 项目设计的人类结果优先原则：先验证真实问题、可衡量结果和人类信任边界，再决定模型、自动化和 human-in-the-loop 范围
- [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture) — AI Agent 工具选择架构：分离资源发现、工具可用性、候选集缩减、具体选择和失败回退，并以本地评测决定是否需要动态路由
- [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation) — AI 辅助与能力形成：用补偿、支架、替代及撤除辅助后的独立表现，区分即时产出改善与真实学习或判断能力
- [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution) — AI 执行前假设挑战者：在复杂创意、写作、方案设计或 AI Agent PM 编排前，用反迎合角色澄清意图、挑战假设、发现盲点，再由人或受控工具执行
- [audience-situation-content-briefs](/concepts/audience-situation-content-briefs) — 受众情境内容简报：用 CEP 与 7W 框架从真实决策场景出发，而不是把搜索量直接当成内容需求
- [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop) — 受限工具箱评估闭环：把创造型 Agent 拆成候选生成、可执行转换、客观 evaluator 和反馈迭代，降低幻觉并保留审计边界
- [coping-skill-application-and-imaginal-exposure](/concepts/coping-skill-application-and-imaginal-exposure) — 应对技能从习得到现实应用：识别伪应对，以有界想象暴露检验技能是否减少回避并提升不适中的行动能力
- [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary) — 确定性分析与语义推理边界：分开候选筛选、概率性分类与可复现计算，保留不明确类别与复核，不把类型、模型共识或落表标签当作真实性证明
- [文档解析的结构保真与中间表示](/concepts/document-parsing-structural-fidelity) — 检查内容与章节、表头、单位、脚注的关系；按职责组合 Markdown、HTML、JSON、图片与坐标，不把格式正确当作语义正确
- [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization) — Dijkstra 对自然语言编程的批判在 AI 编程时代的再验证：形式化约束仍是核心
- [entropy-and-entropy-increase](/concepts/entropy-and-entropy-increase) — 区分热力学熵、统计熵与信息熵，说明熵增的系统边界、开放系统例外和软件类比边界
- [family-education-operating-model](/concepts/family-education-operating-model) — 家庭教育域的 operating model：以孩子适配、家庭可持续和教育兜底能力为核心，而不是单点名校最优化
- [AI Agent Context Engineering Design Priorities](/concepts/hermes-context-engineering-design-priorities) — 面向 AI Agent 的 context engineering 设计优先级：先做 budget、ranking、compression，再做 history decay
- [Wiki 知识新鲜度与断言证据绑定](/concepts/hermes-knowledge-freshness-and-claim-evidence) — AI Agent 知识新鲜度与来源精度：复用 sources、review_by、updated 和 [推论] 改善可复用 Wiki 知识
- [AI Agent Layer Routing Decision Checklist](/concepts/hermes-layer-routing-decision-checklist) — AI Agent 快速组合路由：按五种职责拆分需求，外部接入优先复用授权工具，MCP 可选
- [AI Agent Memory Skills Wiki Boundaries](/concepts/hermes-memory-skills-wiki-boundaries) — AI Agent 内容归属主规则：用正反例区分 memory、skills、wiki、sessions/project state 与历史证据
- [AI Agent Model-Specific Harness Profiles](/concepts/hermes-model-specific-harness-profiles) — AI Agent 的 model/role-specific harness 原则：把模型差异和 AGY Custom Agent 角色边界转成 skill、project context、窄工具面与 verification overlay，而不是扩张 runtime profile 或预建角色目录
- [AI Agent Skill Refactoring Methodology](/concepts/hermes-skill-refactoring-methodology) — AI Agent Skill 重构方法论：以窄职责、前置安全边界、可发现的 reference 路由和父级验证收敛默认路径
- [human-machine-scientific-discovery-verification-scarcity](/concepts/human-machine-scientific-discovery-verification-scarcity) — 人机科学发现中的验证稀缺：以分层验证、负面结果和专家评审约束知识准入；ScientistTwo 展示自主实验闭环及其评审与成本边界
- [llm-context-engineering-layer](/concepts/llm-context-engineering-layer) — Context engineering 管理 memory、compression、re-ranking 与 token budget，并定义 Agentic RAG 的可重放检索证据、权限硬约束和主张支撑边界
- [llm-engineering-knowledge-map](/concepts/llm-engineering-knowledge-map) — LLM 工程知识地图：系统分层导航及 AI Engineer Notebooks 的评测、RAG、工具循环、架构对照与交付练习入口；教程描述不等于实验验证
- [llm-summary-identification-step](/concepts/llm-summary-identification-step) — LLM 摘要的识别步骤：先判断来源能否支撑 claim，再生成带证据类型的摘要，并让审查阶段只能削弱或留白
- [local-first-sync-confirmed-mirror-outbox-conflict-policy](/concepts/local-first-sync-confirmed-mirror-outbox-conflict-policy) — Local-First 同步中的确认镜像、持久化 Outbox、乐观视图、游标、幂等与显式冲突政策；仅在真实离线和恢复需求下采用
- [public-info-monitoring-automation-methodology](/concepts/public-info-monitoring-automation-methodology) — 公开信息监控自动化方法论：从信息源建模、结构化快照、变化判断、低噪音通知到健康检查和可选调度
- [repository-level-code-intelligence-layer](/concepts/repository-level-code-intelligence-layer) — 仓库级代码智能层：用索引、依赖图和任务级上下文编译，把目标代码、可达接口、项目约束与显式未知项装配成低噪音 Agent 上下文
- [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification) — 有状态 Agent 评测单元：结合环境、任务与验证器，并从权威 session/run/job 状态核验恢复、取消、清理和外部副作用
- [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) — 用 structured output、分阶段语义分解、固定候选空间、typed tools 与 dependency injection 把 LLM 不确定性收进可验证的工程边界

### 2. 工作流编排与代码工程 (Workflows, Orchestration & Coding)
- [Agent Autonomy Ladder for AI Agent Workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows) — AI Agent 工作流中的 Agent 自主度阶梯：按确定性 workflow、编排 workflow、受限 reactive loop 和 bounded multi-agent 判断任务应给 agent 多少控制流自主权
- [agent-memory-reflection-planning-pipeline](/concepts/agent-memory-reflection-planning-pipeline) — Agent 记忆–反思–规划流水线：将经历处理为事件流、多因素检索、反思推断与分层计划，区分应用事件存储与 AI Agent 默认 memory
- [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs) — Agent 编排的生产取舍：以单 Agent 基线、任务可分解性、协调成本和错误相关性选择最小拓扑，并验证持久化与副作用恢复语义
- [agentic-content-pipeline-design-patterns](/concepts/agentic-content-pipeline-design-patterns) — Agentic 内容生产 pipeline 的设计模式：专家流程、skill files、MCP 数据源、中间产物、人工审核与可调试迭代
- [ai-coding-agent-workflow-types](/concepts/ai-coding-agent-workflow-types) — AI coding agent 的协作与入口选择：先定义目标、上下文、约束、验收和验证，再按 IDE、Terminal、PR、Cloud 交互模式执行并保留人工审查
- [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management) — AI coding assistant 的上下文预算管理：限制历史、文件、工具输出、日志和全局指令进入模型，降低 token 成本和上下文漂移
- [ai-task-delegation-patterns-from-local-cloud-hybrid-llms](/concepts/ai-task-delegation-patterns-from-local-cloud-hybrid-llms) — 从端云混合 LLM 模式抽象出的 AI Agent PM/subagent 调度模式：任务包、计划落地、困难升级、草稿精修和交叉审查
- [claude-code-practical-workflow-tips](/concepts/claude-code-practical-workflow-tips) — Claude Code 的实用工作流要点：侧边提问、浏览器验证、自动循环、多目录访问与跨设备延续
- [codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering) — Codex 的分层 agent 工作流：prompt、planning、AGENTS.md、skill、MCP 与 automation 各司其职
- [first-edit-economy-for-coding-agents](/concepts/first-edit-economy-for-coding-agents) — Coding agent 的首次编辑经济性：有明确锚点和便宜验证时，减少宽泛探索，形成可证伪局部假设后小步编辑并立即验证
- [google-sre-gemini-cli-incident-response](/concepts/google-sre-gemini-cli-incident-response) — Google SRE 如何把 Gemini CLI 接入事故响应：标准 playbook、受控执行、人机协作止血
- [AI Agent Workflow Layering and Adoption Order](/concepts/hermes-agent-workflow-layering-and-adoption-order) — AI Agent 分层工作流：指令、知识、skills、MCP/tools、Code Mode 程序化执行、验证与 cron 的职责和落地顺序
- [AI Agent Workflow Formalization Principles](/concepts/hermes-ai-workflow-formalization-principles) — AI Agent 的规格与规划按风险留痕；重复规范优先确定性检查，自动验证不替代共享理解、决策理由与人工责任
- [AI Agent Python Engineering Capability Checklist](/concepts/hermes-python-engineering-capability-checklist) — AI Agent Python 工程能力检查清单：流式输入、资源生命周期、有界并发、类型化工具边界与验证闭环
- [Loop Engineering for AI Agent Workflows](/concepts/loop-engineering-hermes-agent-workflow) — Loop Engineering 在 AI Agent 中的映射：以类型化信号、确定性 dispatcher 和有界重试组织工作闭环；从单个缺陷验证完整用户行为链、可重复环境与人工补救负担，保留 active-layer 审批边界
- [multiagent-systemic-failure-modes](/concepts/multiagent-systemic-failure-modes) — 多智能体系统性失效模式：区分行为低方差、认识论失调、资源共谋与目标冲突升级，并把 Agent 数量和有效独立证据分开
- [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns) — Subagent 编排模式：先验证单 Agent 基线、真实瓶颈和可分解性，再选择 inline tool、fan-out、agent pool 或 team
- [chat-to-agent-session-routing](/concepts/chat-to-agent-session-routing) — 聊天平台到有状态 AI Agent 运行时的会话路由与边界隔离设计原则

### 3. 评测、验证与知识治理 (Evaluation, Verification & Governance)
- [agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration) — Agent 评测 Rubric 校准：分数只作诊断指针；效率判断尊重必要前置与结果核验，分数与证据冲突时先审计锚点和错误激励
- [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation) — Agent 失败闭环评估：把可复发失败从失败信号、中立证据、根因分类推进到最小修复和防回归 evaluator/case
- [agent-research-evidence-gate](/concepts/agent-research-evidence-gate) — 研究型 Agent 的证据质量闸门：Manager 编排、工具取证、Judge 评分和缺口补证，达标后 Analyst 才生成报告
- [agent-self-validation-loops](/concepts/agent-self-validation-loops) — Agent 自我验证闭环：用 baseline、测试、浏览器/MCP 反馈和停止条件，把 coding agent 任务变成可验证迭代回路
- [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary) — Agent Skill Provider 治理边界：把文件、类和内联技能统一到 provider 抽象下，同时用分层来源、过滤、去重、审批和沙箱控制 active skill 风险
- [AI Agent Active-Surface Lifecycle Governance](/concepts/hermes-active-surface-lifecycle-governance) — AI Agent 活跃面的生命周期治理：从基线、校准、晋升和验证推进到事件触发的重基线与可回滚退役，避免规则和自动化只增不减
- [AI Agent Context Layer Operating Rules](/concepts/hermes-context-layer-operating-rules) — AI Agent 上下文装配规则：控制检索与注入预算、历史压缩、长任务 project state、最新观察和隔离 handoff
- [Human and AI Agent Shared Knowledge Architecture](/concepts/hermes-knowledge-architecture) — 人类与 AI Agent 共享知识架构与导航：连接运行时知识栈、Wiki 文件层、冲突感知对象、LLM 候选事实抽取与证据边界及各分层规则入口
- [Shared Wiki Operating Flow](/concepts/hermes-knowledge-base-operating-flow) — 共享知识库端到端操作流：公开准入、可选能力、operations、检索门禁与授权回写
- [AI Agent Memory Governance Notes](/concepts/hermes-memory-governance-notes) — Memory 减脂与跨层路由规则：什么适合留在 memory，什么应进入 wiki、skill、项目状态或 session
- [AI Agent Retrieval Priority and Answer Path](/concepts/hermes-retrieval-priority-and-answer-path) — 人类与 Agent 检索路径：先判断范围与新鲜度，按需补证据，公开且授权才回写
- [Wiki Lint and Health Check Standards](/concepts/hermes-wiki-lint-and-health-check-standards) — 共享 Wiki lint / 健康检查规范：链接、索引、frontmatter、标签、页面及局部 claim 新鲜度与结构健康
- [Wiki Page Writing Standards](/concepts/hermes-wiki-page-writing-standards) — 人类与 AI Agent 共用的 Wiki 页面写作规范：命名、frontmatter、日期模板、结构、wikilinks、局部 `[!volatile]` claim 与质量检查
- [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines) — 生产 Agent 评估基线：拆分延迟、Token、调用、缓存与工具耗时；区分路由质量代理、非显著与等价、中位成本与整体预算，并限制外部阈值的适用范围
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) — 生产级 AI Agent 评估框架：分层评估检索、生成、行为和运营；区分确定性计数与语义判断，结合广覆盖评分、条件性诊断和多 Agent 基线比较
- [progressive-knowledge-system-growth](/concepts/progressive-knowledge-system-growth) — 知识系统的渐进式生长原则：先用真实问题产生内容，再让结构、链接和自动化从反复出现的摩擦中生长
- [repeated-measures-statistical-power-for-ai-evaluation](/concepts/repeated-measures-statistical-power-for-ai-evaluation) — 少样本 AI 评测的重复测量与统计功效：区分主体、任务和有效独立证据，避免把相关观测当成独立样本
- [system-governance-operating-model](/concepts/system-governance-operating-model) — 系统治理域的 operating model：管理 AI Agent LifeOS 的分层边界、沉淀路径、扩张节奏与结构健康
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow) — 把外部信息编译进知识库的标准入库流程

### 4. 个人操作系统与投资决策 (LifeOS, Systems & Investment)
- [companyos-to-lifeos-filesystem-philosophy](/concepts/companyos-to-lifeos-filesystem-philosophy) — 将公司和人生建模为文件系统：统一命名空间、文件即状态、权限即治理、读写即操作
- [AI Agent LifeOS Executable Architecture](/concepts/hermes-lifeos-executable-architecture) — AI Agent 版 LifeOS 的参考架构：协调 profile、wiki/memory/skills/cron/MCP/profiles 按版本和权限边界推进
- [AI Agent LifeOS Layer Boundary Contract](/concepts/hermes-lifeos-layer-boundary-contract) — AI Agent LifeOS 的层边界契约：以主协调上下文组织语义层，明确知识、可选执行与接入能力、隔离和临时状态的职责与越界规则
- [leontraveller-trading-and-investment-system](/concepts/leontraveller-trading-and-investment-system) — Leontraveller 的交易系统观：不抄底、不和市场争辩，转向顺势、止损、控回撤与简单可执行规则
- [lifeos-overview](/concepts/lifeos-overview) — LifeOS 可配置总览模板：定义可选领域、系统层次、公开/私有边界和 AI Agent 的可选执行角色
- [money-as-tool-and-investment-vs-consumption-framework](/concepts/money-as-tool-and-investment-vs-consumption-framework) — 财富决策框架：把钱当作工具，区分资产投资、自我投资与纯消费
- [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system) — 普通人投资方法论：先搭建长期系统，再谈标的、仓位与执行
- [personal-finance-and-education-fund-model](/concepts/personal-finance-and-education-fund-model) — 财务与教育基金 operating model：把家庭安全层、配置层和目标层分开，让教育基金按目标导向独立建模
- [personal-growth-operating-model](/concepts/personal-growth-operating-model) — 个人成长域的 operating model：把成长作为职业升级、家庭沟通与判断质量的底层引擎
- [personal-investment-operating-rules](/concepts/personal-investment-operating-rules) — 投资风险控制框架：分离配置与进攻资金，先定义风险预算和退出规则再行动
- [work-and-career-operating-model](/concepts/work-and-career-operating-model) — 工作与职业域的 operating model：兼顾现金流、能力复利、时间预算与家庭兼容性

### 5. 软件工程基础法则 (Software Engineering Laws)
- [software-engineering-laws-architecture](/concepts/software-engineering-laws/software-engineering-laws-architecture) — 软件工程 Architecture 法则地图：分布式取舍、抽象边界、复杂度分配、兼容性与系统演化风险
- [software-engineering-laws-decisions](/concepts/software-engineering-laws/software-engineering-laws-decisions) — 软件工程 Decisions 法则地图：认知偏差、问题建模、技术选择与资源分配
- [software-engineering-laws-design](/concepts/software-engineering-laws/software-engineering-laws-design) — 软件工程 Design 法则地图：重复、复杂度、耦合、可预期行为与提前建设边界
- [software-engineering-laws-planning](/concepts/software-engineering-laws/software-engineering-laws-planning) — 软件工程 Planning 法则地图：估算、期限、收尾成本、指标约束与优化时机
- [software-engineering-laws-quality](/concepts/software-engineering-laws/software-engineering-laws-quality) — 软件工程 Quality 法则地图：渐进维护、测试策略、协议兼容、技术债与长期演化
- [software-engineering-laws-scale](/concepts/software-engineering-laws/software-engineering-laws-scale) — 软件工程 Scale 法则地图：固定工作量、扩展工作量、串行瓶颈与网络效应
- [software-engineering-laws-teams](/concepts/software-engineering-laws/software-engineering-laws-teams) — 软件工程 Teams 法则地图：团队规模、知识集中、组织结构、晋升机制与协作成本

## Operations
- [agent-shared-wiki-index](/operations/agent-shared-wiki-index) — Agent 共享 Wiki 的产品无关接入模板：根目录可配置、先做公开边界检查、正文按需、项目规则优先且默认只读

## Comparisons
- [dijkstra-ewd667-vs-ai-programming-article](/comparisons/dijkstra-ewd667-vs-ai-programming-article) — 对照 EWD667 原文与 2026 AI 编程文章：哪些原则不变，哪些是 AI 时代的新变量
- [hermes-vs-google-sre-agentic-incident-response](/comparisons/hermes-vs-google-sre-agentic-incident-response) — Hermes/SRE 历史对照主题：区分 Google 来源案例、本仓库知识设计和通用 Agent 的待验证接入建议，不作当前产品排名
- [leontraveller-vs-ordinary-investor-investment-system](/comparisons/leontraveller-vs-ordinary-investor-investment-system) — 对照两套投资框架：长期配置制度 vs 主动交易纪律

## Queries
- [agent-architecture-primary-paper-map](/queries/agent-architecture-primary-paper-map) — Agent 架构一手论文地图：按设计问题检索 ReAct、Toolformer、Generative Agents、Voyager 与 AutoGen 的机制、证据和外推边界
- [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map) — 56 条软件工程法则的全量问题导向入口：按真实工程场景检索适用法则、误用边界、跨类别张力和来源记录
- [OKF Concepts for AI Agent Wiki Governance Assessment](/queries/okf-for-hermes-wiki-governance-assessment) — OKF/LLM-wiki 在 AI Agent wiki 中的采纳边界，以及企业 Catalog 规模化实现的触发条件；不替代现有 Markdown wiki 架构
- [hermes-wiki-knowledge-freshness-improvement-plan](/queries/hermes-wiki-knowledge-freshness-improvement-plan) — 2026-08-26 已关闭的新鲜度改造决策；保留历史约定并指向现行 Schema 与 Freshness Gate
- [hermes-agent-experience-consolidation-capability-assessment](/queries/hermes-agent-experience-consolidation-capability-assessment) — 2026-05-11 / v0.13.0 的 Hermes 经验固化能力历史快照；版本、命令和原生能力结论使用前必须重新核验
- [AI Agent Layer Routing Edge Cases](/queries/hermes-layer-routing-edge-cases) — AI Agent 路由边界案例：区分可选接入、执行契约与公开操作指南
- [AI Agent Layer Routing Sample Cases](/queries/hermes-layer-routing-sample-cases) — AI Agent 路由样例：按职责和授权选择载体，环境记忆不替代当前核验
- [Using AI Agent for AI Coding with Typed Boundaries](/queries/how-i-should-use-hermes-for-ai-coding-with-typed-boundaries) — AI Agent 编程中的 typed output、窄工具、显式依赖和验证 gate；示例不表示已经部署
- [how-i-should-use-these-two-investment-frameworks](/queries/how-i-should-use-these-two-investment-frameworks) — 分层组合两套教育性投资框架：长期制度管底盘，主动纪律管进攻
- [my-investment-pre-trade-checklist](/queries/my-investment-pre-trade-checklist) — 通用交易前风险清单：先分清资金层、动作类型、退出计划，再决定是否出手
- [when-i-should-not-trade](/queries/when-i-should-not-trade) — 通用停手条件：补亏损、情绪单、越权单或无退出计划时默认不行动
- [how-i-should-review-a-losing-position](/queries/how-i-should-review-a-losing-position) — 亏损仓复盘方法：区分正常回撤、失效判断和伪装成再平衡的情绪补仓
- [how-i-should-scale-into-and-out-of-a-position](/queries/how-i-should-scale-into-and-out-of-a-position) — 分批进出方法：对了再加、错了不补、减仓服务于风险预算
- [how-i-should-size-a-position](/queries/how-i-should-size-a-position) — 参数化仓位预算：先限定最大可承受损失，再计算规模
- [how-i-should-handle-a-winning-position](/queries/how-i-should-handle-a-winning-position) — 盈利仓风险管理：区分结构、风险预算与利润焦虑
- [how-i-should-decide-between-doing-nothing-and-taking-action](/queries/how-i-should-decide-between-doing-nothing-and-taking-action) — 不行动与行动的裁决框架：动作只是在缓解不适时默认等待
- [how-i-should-build-a-post-trade-review-loop](/queries/how-i-should-build-a-post-trade-review-loop) — 交易后复盘闭环：先评价过程，再把重复问题压成可执行修正
- [how-i-should-detect-repeat-mistakes-in-my-trading](/queries/how-i-should-detect-repeat-mistakes-in-my-trading) — 重复错误识别：只有可命名、可复现、可归因的问题才升级规则
- [how-i-should-convert-trading-lessons-into-hard-rules](/queries/how-i-should-convert-trading-lessons-into-hard-rules) — 教训到硬规则的转化：仅制度化反复、高代价且可执行的问题
- [how-i-should-keep-my-trading-system-small-and-executable](/queries/how-i-should-keep-my-trading-system-small-and-executable) — 交易系统做减法：保留少数高阻断力规则，删除不可快速调用的说明书式规则

