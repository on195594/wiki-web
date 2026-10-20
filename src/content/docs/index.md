---
title: Wiki Index
created: 2026-04-16
updated: 2026-10-20
type: meta
status: current
---

# Wiki Index

> 可跨用户、跨项目复用的公开知识目录。
> 这里记录正式知识页面，不记录个人运行状态、私有会话或任务台账。
> 使用知识前按 [AI Agent Retrieval Priority and Answer Path](/concepts/hermes-retrieval-priority-and-answer-path) 执行 Freshness Gate；摄取分类见 [Wiki Ingestion Workflow](/concepts/wiki-ingestion-workflow)。
> Last updated: 2026-10-20 | Indexed pages: 120

## 按任务进入

人类与 AI Agent 共用以下正文和证据。按需要选择入口，无需通读目录。

| 现在要做什么 | 入口 |
|---|---|
| 理解知识库如何分层 | [共享知识架构](/concepts/hermes-knowledge-architecture) |
| 找概念、方法或决策 | 下方分类目录；先读页面 Summary，再按需要追来源 |
| 判断知识是否仍适用 | [检索与新鲜度规则](/concepts/hermes-retrieval-priority-and-answer-path) |
| 判断内容与证据是否可入库 | [Wiki Schema](/schema)：准入、主维护位置、证据范围与历史保留 |
| 新增或更新知识 | [入库流程](/concepts/wiki-ingestion-workflow) · [写作规范](/concepts/hermes-wiki-page-writing-standards) |
| 检查链接、来源与结构 | [健康检查操作指南](https://github.com/on195594/wiki/blob/main/_meta/wiki-health-check-runbook.md) |
| 接入 AI Agent | [Agent 按需检索入口](/operations/agent-shared-wiki-index) |
| 组织 AI 编程任务 | [工作流入口选择](/concepts/ai-coding-agent-workflow-types) · [类型边界与验证](/queries/how-i-should-use-hermes-for-ai-coding-with-typed-boundaries) |
| 评估 Agent 架构方案 | [编排取舍](/concepts/agent-orchestration-production-tradeoffs) · [评测框架](/concepts/production-ai-agent-evaluation-framework) |
| 查工具配置与能力边界 | [Claude Code 工作流](/concepts/claude-code-practical-workflow-tips) · [Codex 工作流分层](/concepts/codex-agent-workflow-layering)；具体命令先核对页面的局部证据与官方文档 |
| 排查生产事故 | [SRE 事故响应模式](/concepts/google-sre-gemini-cli-incident-response)：方法参考，执行仍以目标项目 runbook 为准 |
| 查看治理与变更 | [Schema](/schema) · [变更日志](https://github.com/on195594/wiki/blob/main/log.md) |

历史 `hermes-*` 文件路径保留以兼容引用；标题和摘要定义当前通用知识范围。Hermes 产品评估与历史决策仍保留产品名，不能当作所有 Agent 的能力声明。

## Entities
- [Flutter Open-Source UI Framework](/entities/flutter) — 跨平台 UI 开发选型：问题导向决策入口、真实纵切验收、架构与采用边界；区分独立设计包、SwiftPM、Wasm、FFI 与实验多窗口，并限定可选 AI 生态的版本和权限范围
- [Nimbus 文档站点框架](/entities/nimbus-docs) — 基于 Astro 的文档站点方案：仓库可编辑文件、Agent 可读端点、内容校验、公开边界及采用限制

## Concepts

### 1. 智能体架构与认知上下文 (Agent Architecture & Context Engineering)
- [Agent 闭环学习：从用户纠错到规则升级](/concepts/agent-closed-loop-learning-from-corrections-to-rules) — Agent 闭环学习：把用户纠错先保存为结构化记忆，再经规则蒸馏、影子/离线评估和显式推广，升级为默认行为
- [Agent Context Engineering](/concepts/agent-context-engineering) — Agent 上下文工程总原则：用最小必要上下文防止偏航；上下文腐败与即时加载防御、上下文与记忆工程边界、出处债务；静态上下文面（prompt/工具/示例）与历史、状态及有界加工分别见两个子页；产品示例不是默认依赖，过程记录仍受公开准入约束
- [Agent Context: System Prompt, Tools and Examples](/concepts/agent-context-prompt-tools-and-examples) — 上下文静态面：system prompt 作操作简报、窄工具面与反向边界、可见不等于可用、以行为为主的示例
- [Agent Context: History, State and Bounded Processing](/concepts/agent-context-history-state-and-bounded-processing) — 上下文动态面：转储与摘要分工、SKILL.state 状态契约、子代理交接，以及专用模型的有界加工与恢复边界
- [Agent Development Lifecycle](/concepts/agent-development-lifecycle) — Agent 开发生命周期：连接 Build → Test → Deploy → Monitor，以 Govern 横切治理；涵盖 harness 权威状态与 Tetral 云端运行时、持久投递、沙箱解耦的边界
- [Agent Experience Consolidation Loops](/concepts/agent-experience-consolidation-loops) — Agent 经验固化闭环：证据收集、模式识别、按层职责路由、复用与重验证；只把公开、长期可复用的发现编译进正式页；Skill 治理与知识演化/元技能分别见两个子页；研究增益不当作默认执行授权
- [Agent Skill Governance and Reversible Skill State](/concepts/agent-skill-governance-and-reversible-state) — Skill 治理：使用漏斗与归因、生命周期状态机、可回滚 Skill 与持久知识分离、演化知识评估边界
- [Agent Knowledge Evolution and Meta-Skills](/concepts/agent-knowledge-evolution-and-meta-skills) — 知识演化与元技能：整合与加权、外部知识复用 vs 权重学习、任务技能 vs 支持设计元技能
- [Agent Harness 搜索正则化](/concepts/agent-harness-search-regularization) — Agent harness 搜索正则化：约束候选提案与采纳，并用未见任务、噪声和成本检验改动是否可迁移；RRSI 数值只限其评测条件
- [Agent Resource Optimization](/concepts/agent-resource-optimization) — Agent 资源优化：用集合覆盖、分配、背包和网络流视角建模资源约束；以 Open SWE 线上案例解释任务上下文驱动的模型分层、低价替代反例与证据边界
- [Agentic Programming as System Engineering](/concepts/agentic-programming-system-engineering) — Agentic programming 的系统工程边界：把 Agent 视为带状态、工具、记忆和目标管理的执行系统，用负向工具约束、最小上下文、行为漂移治理和分层记忆降低生产风险
- [AI Agent Document Fidelity Risk](/concepts/ai-agent-document-fidelity-risk) — AI Agent 文档保真风险：多轮委托式工作流中模型可能悄悄重写、扭曲或幻觉原文，需用短步骤、diff、可逆验证、受限工具和中间态审计控制风险
- [AI Agent Human Outcome Design Principle](/concepts/ai-agent-human-outcome-design-principle) — AI Agent 项目设计的人类结果优先原则：先验证真实问题、可衡量结果和人类信任边界，再决定模型、自动化和 human-in-the-loop 范围
- [AI Agent Tool Selection Architecture](/concepts/ai-agent-tool-selection-architecture) — AI Agent 工具选择架构：分离资源发现、工具可用性、候选集缩减、具体选择和失败回退，并以本地评测决定是否需要动态路由
- [AI Assistance, Cognitive Substitution, and Skill Formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation) — AI 辅助与能力形成：用补偿、支架、替代及撤除辅助后的独立表现，区分即时产出改善与真实学习或判断能力
- [AI Assumption Challenger Before Execution](/concepts/ai-assumption-challenger-before-execution) — AI 执行前假设挑战者：在复杂创意、写作、方案设计或 AI Agent PM 编排前，用反迎合角色澄清意图、挑战假设、发现盲点，再由人或受控工具执行
- [Audience-Situation Content Briefs](/concepts/audience-situation-content-briefs) — 受众情境内容简报：用 CEP 与 7W 框架从真实决策场景出发，而不是把搜索量直接当成内容需求
- [Constrained Toolbox Evaluator Loop](/concepts/constrained-toolbox-evaluator-loop) — 受限工具箱评估闭环：把创造型 Agent 拆成候选生成、可执行转换、客观 evaluator 和反馈迭代，降低幻觉并保留审计边界
- [From Coping Skill Acquisition to Real-World Application（草稿）](/concepts/coping-skill-application-and-imaginal-exposure) — 应对技能从习得到现实应用：识别伪应对，以有界想象暴露检验技能是否减少回避并提升不适中的行动能力
- [Deterministic Analytics and LLM Reasoning Boundary](/concepts/deterministic-analytics-llm-reasoning-boundary) — 确定性分析与语义推理边界：分开候选筛选、概率性分类与可复现计算；多源证据先对齐共同对象，不把类型、模型共识、落表标签或透明融合当作真实性证明
- [文档解析的结构保真与中间表示](/concepts/document-parsing-structural-fidelity) — 检查内容与章节、表头、单位、脚注的关系；按职责组合 Markdown、HTML、JSON、图片与坐标，不把格式正确当作语义正确
- [Dijkstra on AI Programming Formalization](/concepts/dijkstra-ai-programming-formalization) — Dijkstra 对自然语言编程的批判在 AI 编程时代的再验证：形式化约束仍是核心
- [Entropy and Entropy Increase](/concepts/entropy-and-entropy-increase) — 区分热力学熵、统计熵与信息熵，说明熵增的系统边界、开放系统例外和软件类比边界
- [Family Education Operating Model](/concepts/family-education-operating-model) — 家庭教育域的 operating model：以孩子适配、家庭可持续和教育兜底能力为核心，而不是单点名校最优化
- [AI Agent Context Engineering Design Priorities](/concepts/hermes-context-engineering-design-priorities) — 面向 AI Agent 的 context engineering 设计优先级：先做 budget、ranking、compression，再做 history decay
- [Wiki 知识新鲜度与断言证据绑定](/concepts/hermes-knowledge-freshness-and-claim-evidence) — AI Agent 知识新鲜度与来源精度：复用 sources、review_by、updated 和 [推论] 改善可复用 Wiki 知识
- [AI Agent Layer Routing Decision Checklist](/concepts/hermes-layer-routing-decision-checklist) — AI Agent 快速组合路由：按五种职责拆分需求，外部接入优先复用授权工具，MCP 可选
- [AI Agent Memory Skills Wiki Boundaries](/concepts/hermes-memory-skills-wiki-boundaries) — AI Agent 内容归属主规则：用正反例区分 memory、skills、wiki、sessions/project state 与历史证据
- [AI Agent Model-Specific Harness Profiles](/concepts/hermes-model-specific-harness-profiles) — AI Agent 的 model/role-specific harness 原则：把模型差异和 AGY Custom Agent 角色边界转成 skill、project context、窄工具面与 verification overlay，而不是扩张 runtime profile 或预建角色目录
- [AI Agent Skill Refactoring Methodology](/concepts/hermes-skill-refactoring-methodology) — AI Agent Skill 重构方法论：以窄职责、前置安全边界、可发现的 reference 路由和父级验证收敛默认路径
- [Human-Machine Scientific Discovery and Verification Scarcity](/concepts/human-machine-scientific-discovery-verification-scarcity) — 人机科学发现中的验证稀缺：以分层验证、负面结果和专家评审约束知识准入；ScientistTwo 展示自主实验闭环及其评审与成本边界
- [LLM Context Engineering Layer](/concepts/llm-context-engineering-layer) — Context engineering 管理 memory、compression、re-ranking 与 token budget；涵盖 Agentic RAG 的证据信任边界，以及语义漂移、未知候选和专家复核的概念级参考，不将 oRAG 设想当作已验证效果
- [LLM Engineering Knowledge Map](/concepts/llm-engineering-knowledge-map) — LLM 工程知识地图：系统分层导航及 AI Engineer Notebooks 的评测、RAG、工具循环、架构对照与交付练习入口；教程描述不等于实验验证
- [LLM Summary Identification Step](/concepts/llm-summary-identification-step) — LLM 摘要的识别步骤：先判断来源能否支撑 claim，再生成带证据类型的摘要，并让审查阶段只能削弱或留白
- [Local-First 同步中的确认镜像、Outbox 与冲突政策](/concepts/local-first-sync-confirmed-mirror-outbox-conflict-policy) — Local-First 同步中的确认镜像、持久化 Outbox、乐观视图、游标、幂等与显式冲突政策；仅在真实离线和恢复需求下采用
- [Public Info Monitoring Automation Methodology](/concepts/public-info-monitoring-automation-methodology) — 公开信息监控自动化方法论：从信息源建模、结构化快照、变化判断、低噪音通知到健康检查和可选调度
- [Repository-Level Code Intelligence Layer](/concepts/repository-level-code-intelligence-layer) — 仓库级代码智能层：用索引、依赖图和任务级上下文编译，把目标代码、可达接口、项目约束与显式未知项装配成低噪音 Agent 上下文
- [Stateful Agent Environments and Grounded Verification](/concepts/stateful-agent-environments-and-grounded-verification) — 有状态 Agent 评测单元：结合环境、任务与验证器，并从权威 session/run/job 状态核验恢复、取消、清理和外部副作用
- [Typed AI Agent Boundaries](/concepts/typed-ai-agent-boundaries) — 用 structured output、分阶段语义分解、固定候选空间、typed tools 与 dependency injection 把 LLM 不确定性收进可验证的工程边界

### 2. 工作流编排与代码工程 (Workflows, Orchestration & Coding)
- [Agent Autonomy Ladder for AI Agent Workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows) — AI Agent 工作流中的 Agent 自主度阶梯：按确定性 workflow、编排 workflow、受限 reactive loop 和 bounded multi-agent 判断任务应给 agent 多少控制流自主权
- [Agent Memory–Reflection–Planning Pipeline](/concepts/agent-memory-reflection-planning-pipeline) — Agent 记忆–反思–规划流水线：将经历处理为事件流、多因素检索、反思推断与分层计划，区分应用事件存储与 AI Agent 默认 memory
- [Agent Orchestration Production Tradeoffs](/concepts/agent-orchestration-production-tradeoffs) — Agent 编排的生产取舍：以单 Agent 基线、任务可分解性、协调成本和错误相关性选择最小拓扑，并验证持久化与副作用恢复语义
- [Agentic Content Pipeline Design Patterns](/concepts/agentic-content-pipeline-design-patterns) — Agentic 内容生产 pipeline 的设计模式：专家流程、skill files、MCP 数据源、中间产物、人工审核与可调试迭代
- [AI Coding Agent Workflow Types](/concepts/ai-coding-agent-workflow-types) — AI coding agent 的协作与入口选择：先定义目标、上下文、约束、验收和验证，再按 IDE、Terminal、PR、Cloud 交互模式执行并保留人工审查
- [AI Coding Assistant Context Budget Management](/concepts/ai-coding-assistant-context-budget-management) — AI coding assistant 的上下文预算管理：限制历史、文件、工具输出、日志和全局指令进入模型，降低 token 成本和上下文漂移
- [AI Task Delegation Patterns from Local-Cloud Hybrid LLMs](/concepts/ai-task-delegation-patterns-from-local-cloud-hybrid-llms) — 从端云混合 LLM 模式抽象出的 AI Agent PM/subagent 调度模式：任务包、计划落地、困难升级、草稿精修和交叉审查
- [Claude Code Practical Workflow Tips](/concepts/claude-code-practical-workflow-tips) — Claude Code 的实用工作流要点：侧问（`/btw`）、浏览器验证（`/chrome`）、任务调度（`/loop`、`/schedule`）、多目录访问（`--add-dir`）与跨设备接续（`/teleport`、`/remote-control`）；官方接口说明已局部核验，具体客户端运行仍需在目标环境确认
- [Codex Agent Workflow Layering](/concepts/codex-agent-workflow-layering) — Codex 的分层 agent 工作流：prompt、planning、AGENTS.md、skill、MCP 与 automation 各司其职；限定指令链的发现、候选文件与拼接覆盖规则
- [First-edit Economy for Coding Agents](/concepts/first-edit-economy-for-coding-agents) — Coding agent 的首次编辑经济性：有明确锚点和便宜验证时，减少宽泛探索，形成可证伪局部假设后小步编辑并立即验证
- [Google SRE Gemini CLI Incident Response Pattern](/concepts/google-sre-gemini-cli-incident-response) — Google SRE 如何把 Gemini CLI 接入事故响应：标准 playbook、受控执行、人机协作止血
- [AI Agent Workflow Layering and Adoption Order](/concepts/hermes-agent-workflow-layering-and-adoption-order) — AI Agent 分层工作流：指令、知识、skills、MCP/tools、Code Mode 程序化执行、验证与 cron 的职责和落地顺序
- [AI Agent Workflow Formalization Principles](/concepts/hermes-ai-workflow-formalization-principles) — AI Agent 的规格与规划按风险留痕；结合双向追溯、分层验证、审查收敛与风险分级审批分配人类注意力，以回滚与事故率为护栏并保留共享理解与人工责任
- [AI Agent Python Engineering Capability Checklist](/concepts/hermes-python-engineering-capability-checklist) — AI Agent Python 工程能力检查清单：流式输入、资源生命周期、有界并发、类型化工具边界与验证闭环
- [Loop Engineering for AI Agent Workflows](/concepts/loop-engineering-hermes-agent-workflow) — Loop Engineering 在 AI Agent 中的映射：以类型化信号、确定性 dispatcher 和有界重试组织工作闭环；从单个缺陷验证完整用户行为链、可重复环境与人工补救负担，保留 active-layer 审批边界
- [多智能体系统性失效模式](/concepts/multiagent-systemic-failure-modes) — 多智能体系统性失效模式：区分行为低方差、认识论失调、资源共谋与目标冲突升级，并把 Agent 数量和有效独立证据分开
- [Subagent Orchestration Patterns](/concepts/subagent-orchestration-patterns) — Subagent 编排模式：先验证单 Agent 基线、真实瓶颈和可分解性，再选择 inline tool、fan-out、agent pool 或 team
- [Chat to Agent Session Routing](/concepts/chat-to-agent-session-routing) — 聊天平台到有状态 AI Agent 运行时的会话路由与边界隔离设计原则

### 3. 评测、验证与知识治理 (Evaluation, Verification & Governance)
- [Agent Evaluation Rubric Calibration](/concepts/agent-evaluation-rubric-calibration) — Agent 评测 Rubric 校准：分数只作诊断指针；效率判断尊重必要前置与结果核验，分数与证据冲突时先审计锚点和错误激励
- [Agent 失败闭环评估](/concepts/agent-failure-closed-loop-evaluation) — Agent 失败闭环评估：把可复发失败从失败信号、中立证据、根因分类推进到最小修复和防回归 evaluator/case
- [Agent Research Evidence Gate](/concepts/agent-research-evidence-gate) — 研究型 Agent 的证据质量闸门：Manager 编排、工具取证、Judge 评分和缺口补证，达标后 Analyst 才生成报告
- [Agent Self-Validation Loops](/concepts/agent-self-validation-loops) — Agent 自我验证闭环：用 baseline、测试、浏览器/MCP 反馈和停止条件，把 coding agent 任务变成可验证迭代回路
- [Agent Skill Provider Governance Boundary](/concepts/agent-skill-provider-governance-boundary) — Agent Skill Provider 治理边界：把文件、类和内联技能统一到 provider 抽象下，同时用分层来源、过滤、去重、审批和沙箱控制 active skill 风险
- [AI Agent Active-Surface Lifecycle Governance](/concepts/hermes-active-surface-lifecycle-governance) — AI Agent 活跃面的生命周期治理：从基线、校准、晋升和验证推进到事件触发的重基线与可回滚退役，避免规则和自动化只增不减
- [AI Agent Context Layer Operating Rules](/concepts/hermes-context-layer-operating-rules) — AI Agent 上下文装配规则：控制检索与注入预算、历史压缩、长任务 project state、最新观察和隔离 handoff
- [Human and AI Agent Shared Knowledge Architecture](/concepts/hermes-knowledge-architecture) — 人类与 AI Agent 共享知识架构与导航：连接运行时知识栈、Wiki 文件层、冲突感知对象、LLM 候选事实抽取与证据边界及各分层规则入口
- [Shared Wiki Operating Flow](/concepts/hermes-knowledge-base-operating-flow) — 共享知识库端到端操作流：公开准入、可选能力、operations、检索门禁与授权回写
- [AI Agent Memory Governance Notes](/concepts/hermes-memory-governance-notes) — Memory 减脂与跨层路由规则：什么适合留在 memory，什么应进入 wiki、skill、项目状态或 session
- [AI Agent Retrieval Priority and Answer Path](/concepts/hermes-retrieval-priority-and-answer-path) — 人类与 Agent 检索路径：先判断范围与新鲜度，按需补证据，公开且授权才回写
- [Wiki Lint and Health Check Standards](/concepts/hermes-wiki-lint-and-health-check-standards) — 共享 Wiki lint / 健康检查规范：链接、索引、frontmatter、标签、页面及局部 claim 新鲜度与结构健康
- [Wiki Page Writing Standards](/concepts/hermes-wiki-page-writing-standards) — 人类与 AI Agent 共用的 Wiki 页面写作规范：命名、frontmatter、日期模板、结构、wikilinks、可选 Relations、局部 `[!volatile]` claim 与质量检查
- [Production Agent Evaluation Baselines](/concepts/production-agent-evaluation-baselines) — 生产 Agent 评估基线：拆分延迟、Token、调用、缓存与工具耗时；区分路由质量代理、非显著与等价、中位成本与整体预算，并限制外部阈值的适用范围
- [Production AI Agent Evaluation Framework](/concepts/production-ai-agent-evaluation-framework) — 生产级 AI Agent 评估框架：分层评估检索、生成、行为和运营；结合广覆盖评分、条件性诊断和多 Agent 基线比较，区分 RAG 决策变化与有真实值支持的质量增益
- [Progressive Knowledge System Growth](/concepts/progressive-knowledge-system-growth) — 知识系统的渐进式生长原则：先用真实问题产生内容，再让结构、链接和自动化从反复出现的摩擦中生长
- [少样本 AI 评测中的重复任务、伪重复与统计功效](/concepts/repeated-measures-statistical-power-for-ai-evaluation) — 少样本 AI 评测的重复测量与统计功效：区分主体、任务和有效独立证据，避免把相关观测当成独立样本
- [System Governance Operating Model](/concepts/system-governance-operating-model) — 系统治理域的 operating model：管理 AI Agent LifeOS 的分层边界、沉淀路径、扩张节奏与结构健康
- [Wiki Ingestion Workflow](/concepts/wiki-ingestion-workflow) — 把外部信息编译进知识库的标准入库流程：公开边界、raw 固化、候选反查、Relations 与链接卫生、index/log/catalog 同步及门禁闭环

### 4. 个人操作系统与投资决策 (LifeOS, Systems & Investment)
- [CompanyOS to LifeOS Filesystem Philosophy](/concepts/companyos-to-lifeos-filesystem-philosophy) — 将公司和人生建模为文件系统：统一命名空间、文件即状态、权限即治理、读写即操作
- [AI Agent LifeOS Executable Architecture](/concepts/hermes-lifeos-executable-architecture) — AI Agent 版 LifeOS 的参考架构：协调 profile、wiki/memory/skills/cron/MCP/profiles 按版本和权限边界推进
- [AI Agent LifeOS Layer Boundary Contract](/concepts/hermes-lifeos-layer-boundary-contract) — AI Agent LifeOS 的层边界契约：以主协调上下文组织语义层，明确知识、可选执行与接入能力、隔离和临时状态的职责与越界规则
- [Trend-Following Trading System (Leontraveller Public Notes)](/concepts/leontraveller-trading-and-investment-system) — Leontraveller 公开笔记中的交易系统观：不抄底、不和市场争辩，转向顺势、止损、控回撤与简单可执行规则
- [LifeOS Overview](/concepts/lifeos-overview) — LifeOS 可配置总览模板：定义可选领域、系统层次、公开/私有边界和 AI Agent 的可选执行角色
- [Money as Tool and Investment-vs-Consumption Framework](/concepts/money-as-tool-and-investment-vs-consumption-framework) — 财富决策框架：把钱当作工具，区分资产投资、自我投资与纯消费
- [Ordinary Investor Investment System](/concepts/ordinary-investor-investment-system) — 普通人投资方法论：先搭建长期系统，再谈标的、仓位与执行
- [Household Fund Layering Model](/concepts/household-fund-layering-model) — 财务与教育基金 operating model：把家庭安全层、配置层和目标层分开，让教育基金按目标导向独立建模
- [Personal Growth Operating Model](/concepts/personal-growth-operating-model) — 个人成长域的 operating model：把成长作为职业升级、家庭沟通与判断质量的底层引擎
- [Investment Risk Control Framework](/concepts/investment-risk-control-framework) — 投资风险控制框架：分离配置与进攻资金，先定义风险预算和退出规则再行动
- [Work and Career Operating Model](/concepts/work-and-career-operating-model) — 工作与职业域的 operating model：兼顾现金流、能力复利、时间预算与家庭兼容性

### 5. 软件工程基础法则 (Software Engineering Laws)
- [Software Engineering Laws — Architecture](/concepts/software-engineering-laws/software-engineering-laws-architecture) — 软件工程 Architecture 法则地图：分布式取舍、抽象边界、复杂度分配、兼容性与系统演化风险
- [Software Engineering Laws — Decisions](/concepts/software-engineering-laws/software-engineering-laws-decisions) — 软件工程 Decisions 法则地图：认知偏差、问题建模、技术选择与资源分配
- [Software Engineering Laws — Design](/concepts/software-engineering-laws/software-engineering-laws-design) — 软件工程 Design 法则地图：重复、复杂度、耦合、可预期行为与提前建设边界
- [Software Engineering Laws — Planning](/concepts/software-engineering-laws/software-engineering-laws-planning) — 软件工程 Planning 法则地图：估算、期限、收尾成本、指标约束与优化时机
- [Software Engineering Laws — Quality](/concepts/software-engineering-laws/software-engineering-laws-quality) — 软件工程 Quality 法则地图：渐进维护、测试策略、协议兼容、技术债与长期演化
- [Software Engineering Laws — Scale](/concepts/software-engineering-laws/software-engineering-laws-scale) — 软件工程 Scale 法则地图：固定工作量、扩展工作量、串行瓶颈与网络效应
- [Software Engineering Laws — Teams](/concepts/software-engineering-laws/software-engineering-laws-teams) — 软件工程 Teams 法则地图：团队规模、知识集中、组织结构、晋升机制与协作成本

## Operations
- [Agent Shared Wiki Index](/operations/agent-shared-wiki-index) — Agent 共享 Wiki 的产品无关接入模板：根目录可配置、先做公开边界检查、先筛选目录再按需读正文、项目规则优先且默认只读

## Comparisons
- [Dijkstra EWD667 vs 2026 AI Programming Article](/comparisons/dijkstra-ewd667-vs-ai-programming-article) — 对照 EWD667 原文与 2026 AI 编程文章：哪些原则不变，哪些是 AI 时代的新变量
- [Hermes vs Google SRE Agentic Incident Response](/comparisons/hermes-vs-google-sre-agentic-incident-response) — Hermes/SRE 历史对照主题：区分 Google 来源案例、本仓库知识设计和通用 Agent 的待验证接入建议，不作当前产品排名
- [Leontraveller vs Ordinary Investor Investment System](/comparisons/leontraveller-vs-ordinary-investor-investment-system) — 对照两套投资框架：长期配置制度 vs 主动交易纪律

## Queries
- [Agent Architecture Primary-Paper Map](/queries/agent-architecture-primary-paper-map) — Agent 架构一手论文地图：按设计问题检索 ReAct、Toolformer、Generative Agents、Voyager 与 AutoGen 的机制、证据和外推边界
- [Software Engineering Laws Decision Map](/queries/software-engineering-laws-decision-map) — 56 条软件工程法则的全量问题导向入口：按真实工程场景检索适用法则、误用边界、跨类别张力和来源记录
- [OKF Concepts for AI Agent Wiki Governance Assessment](/queries/okf-for-hermes-wiki-governance-assessment) — OKF/LLM-wiki 的采纳边界、已完成的核心页试点、本地 catalog 与 OKF 字段对照，以及企业 Catalog 规模化实现的触发条件；不替代现有 Markdown wiki 架构
- [Hermes Wiki 知识新鲜度改造计划（历史）](/queries/hermes-wiki-knowledge-freshness-improvement-plan) — 2026-08-26 已关闭的新鲜度改造决策；保留历史约定并指向现行 Schema 与 Freshness Gate
- [Hermes Agent Experience Consolidation Capability Assessment — 2026-05-11 / v0.13.0 Snapshot（历史）](/queries/hermes-agent-experience-consolidation-capability-assessment) — 2026-05-11 / v0.13.0 的 Hermes 经验固化能力历史快照；版本、命令和原生能力结论使用前必须重新核验
- [AI Agent Layer Routing Edge Cases](/queries/hermes-layer-routing-edge-cases) — AI Agent 路由边界案例：区分可选接入、执行契约与公开操作指南
- [AI Agent Layer Routing Sample Cases](/queries/hermes-layer-routing-sample-cases) — AI Agent 路由样例：按职责和授权选择载体，环境记忆不替代当前核验
- [Using AI Agent for AI Coding with Typed Boundaries](/queries/how-i-should-use-hermes-for-ai-coding-with-typed-boundaries) — AI Agent 编程中的 typed output、窄工具、显式依赖和验证 gate；示例不表示已经部署
- [Combining Two Investment Frameworks](/queries/combining-two-investment-frameworks) — 分层组合两套教育性投资框架：长期制度管底盘，主动纪律管进攻
- [Investment Pre-Trade Risk Checklist](/queries/pre-trade-risk-checklist) — 通用交易前风险清单：先分清资金层、动作类型、退出计划，再决定是否出手
- [When Not to Trade](/queries/when-not-to-trade) — 通用停手条件：补亏损、情绪单、越权单或无退出计划时默认不行动
- [Reviewing a Losing Position](/queries/losing-position-review-method) — 亏损仓复盘方法：区分正常回撤、失效判断和伪装成再平衡的情绪补仓
- [Scaling Into and Out of a Position](/queries/position-scaling-method) — 分批进出方法：对了再加、错了不补、减仓服务于风险预算
- [Position Sizing by Risk Budget](/queries/position-sizing-method) — 参数化仓位预算：先限定最大可承受损失，再计算规模
- [Managing a Winning Position](/queries/winning-position-risk-management) — 盈利仓风险管理：区分结构、风险预算与利润焦虑
- [Deciding Between Inaction and Action](/queries/inaction-vs-action-decision-framework) — 不行动与行动的裁决框架：动作只是在缓解不适时默认等待
- [Building a Post-Trade Review Loop](/queries/post-trade-review-loop) — 交易后复盘闭环：先评价过程，再把重复问题压成可执行修正
- [Detecting Repeat Trading Mistakes](/queries/repeat-mistake-detection-in-trading) — 重复错误识别：只有可命名、可复现、可归因的问题才升级规则
- [Converting Trading Lessons into Hard Rules](/queries/trading-lessons-to-hard-rules) — 教训到硬规则的转化：仅制度化反复、高代价且可执行的问题
- [Keeping a Trading System Small and Executable](/queries/minimal-executable-trading-system) — 交易系统做减法：保留少数高阻断力规则，删除不可快速调用的说明书式规则

