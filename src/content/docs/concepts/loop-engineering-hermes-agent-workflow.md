---
title: Loop Engineering for AI Agent Workflows
created: 2026-06-10
updated: 2026-11-11
type: concept
tags:
  - agent
  - ai-coding
  - workflow
  - automation
  - subagent
  - orchestration
  - closeout
sources:
  - raw/articles/builderio-agentic-software-factory-one-bug-2026-09-29.md
  - raw/articles/addyosmani-loop-engineering-2026-06-08.md
  - raw/articles/towardsdatascience-rag-workflow-loop-dispatcher-2026-08-14.md
  - raw/articles/github-copilot-cost-efficient-coding-2026-09-02.md
  - docs:https://www.langchain.com/blog/the-art-of-loop-engineering
  - https://www.semanticscholar.org/paper/A-model-for-types-and-levels-of-human-interaction-Parasuraman-Sheridan/14ae6f2231e09e226b99002aa04b5c70f3c59f2b
  - https://people.orie.cornell.edu/pfrazier/pub/frazier_dp_weor.pdf
  - https://www.inf.u-szeged.hu/~akiss/pub/fulltext/hodovan2016modernizing.pdf
  - https://agilelaws.com/iterative-delivery-and-flow/kingmans-formula.html
status: stable
description: 定义 AI Agent 工作流中计划、执行、验证和修正的 loop engineering 方法，含离散控制 Lyapunov
  变体收敛判据与 L_auto / E_first / V_loop / ρ_rev 参数化裁决矩阵。
aliases:
  - loop-engineering
  - loop-engineering-agent-workflow
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Loop Engineering for AI Agent Workflows

## Summary

Loop engineering 是把 coding agent 从“一轮 prompt → 一轮回答”的交互，提升为可审计的工作闭环：发现任务、隔离执行、验证结果、记录状态，并决定下一步。对 AI Agent 来说，它不是立即新增 cron/daemon/runtime 的理由，而是按目标宿主已有的委派、方法、产物记录与工作区能力组织验证闭环；缺少子代理时可由单 Agent 与工具顺序完成。

## Durable principle

AI Agent 中的 agent loop 应被设计为可审计闭环：自动或半自动发现任务，隔离执行，独立验证，外部记录状态，并在人类确认点前停止。任何 runtime、cron、MCP、gateway、wrapper 或生产侧自动改动都必须另走 active-layer 审批、备份、验证和回滚。

## Task-level efficiency evidence

GitHub Copilot 的工程案例 [github-copilot-cost-efficient-coding-2026-09-02](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/github-copilot-cost-efficient-coding-2026-09-02.md) 补充了一条可复用但需本地验证的规则：优化完整任务交付，而不是孤立的单次工具调用。压缩某次输出如果导致 Agent 回读原文、重跑命令、增加轮次或携带更多历史上下文，局部 Token 节省可能转化为更高的总成本。

可复用的最小控制集：
- 源代码、`git diff`、`git show` 和任意脚本结果默认保持原样；搜索结果可无损重排但不得丢匹配项；只对可预测的安装、构建、测试和进度噪声做选择性压缩。
- 保留原始输出恢复路径，并把 `raw_output_retrieved`、重复命令、重复读取、额外轮次和验证失败作为压缩质量信号。
- Prompt 精简必须绑定行为回归测试，尤其验证并行判断、工具边界、停止条件和父级验收责任没有被改写。
- 后台任务完成事件在不改变结果内容的前提下应尽量直接携带结果，并批量合并可同时处理的完成事件，避免额外的模型拉取轮次。

这些是 Wiki 层的设计约束和观测建议，不是对 AI Agent runtime、wrapper 或默认压缩策略的授权。文章中的收益数字属于 GitHub Copilot 特定工作负载的组织报告，不能直接作为 AI Agent 基线。

## Minimal executable landing

先复用目标项目已有的只读状态命令，不新增遥测服务或运行时字段。一个可移植的起点只需要输出总任务数、成功/失败状态和可回读 artifact；重复读取、重复命令、额外轮次与验证失败只有在现有日志可靠提供时才扩展统计。

这是测量设计，不表示任何项目已经部署状态脚本，也不提供任务级成本基线。示例实现必须放在目标项目中，并由该项目的 fixture 和回归检查验证。

## Deterministic dispatcher inside bounded loops

当循环面对多个可能动作时（参见 [towardsdatascience-rag-workflow-loop-dispatcher-2026-08-14](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/towardsdatascience-rag-workflow-loop-dispatcher-2026-08-14.md)），优先采用“模型提信号、代码控流程”的非对称控制面，而不是让模型自由决定工具序列和循环长度：

- 模型只产生类型化诊断信号；程序化校验与外部验证可提供更强信号，确定性 dispatcher 根据显式规则选择下一步。
- 每类 trigger 映射到一个命名、可测试的 action；每轮保留 `trigger / action / state delta / verifier result`，便于审计和定位错误规则。
- 除最大轮次或时间预算外，候选集不再变化、建议动作重复或质量趋势恶化时应提前停止；不要只依赖模型置信度决定是否继续。
- 查询扩展或修复输入只能补充原始目标锚点，不能替换它；检测到结果持续偏离原目标时停止循环。
- 该模式适合问题类型和允许动作可枚举、需要复现与审计的 workflow；工具集合开放或探索路径不可预先覆盖时，才考虑更高自主度的受限 agent loop。

这补充 [agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows)、[agent-self-validation-loops](/concepts/agent-self-validation-loops) 与 [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary)：前者划分自主度，后两者分别定义反馈验证和确定性事实边界；本节定义循环内部“信号—分发—停止”的控制权归属。原文的 RAG 示例、激活规则和成本数字是来源案例，不构成 AI Agent 默认实现或性能基线。

### 离散事件控制形式化：Lyapunov 变体函数（Loop Variant）与不动点熔断

`[推论]` 在程序验证（Floyd–Hoare Logic）与离散事件动态系统理论中，一个有界修复或检索循环 $(S, \mathcal{A}, \delta, V)$ 要避免陷入无限死循环或状态漂移，确定性 dispatcher 必须维护一个良基**势函数 / 循环变体（Lyapunov Potential / Loop Variant）** $V: S \to \mathbb{R}_{\ge 0}$（例如按字典序排列的元组 $V(s_t) = \big(n_{\text{compile\_err}}(s_t),\; n_{\text{fail\_test}}(s_t),\; n_{\text{lint\_err}}(s_t)\big)$）：

1. **单调进展条件（Monotonic Progress）**：理想修复步应使势函数严格下降，即 $\Delta V_t = V(s_{t+1}) - V(s_t) < 0$；
2. **不动点与极限环检测（Fixed-Point & Limit-Cycle Detection）**：对每轮状态指纹（如候选查询集合、归一化 AST diff 或测试失败签名 $h(s_t)$）维护历史轨迹集合 $\mathcal{H}_t = \{h(s_0), \dots, h(s_{t-1})\}$。一旦出现 $h(s_t) \in \mathcal{H}_t$（即存在周期 $k \ge 1$ 使 $s_t = s_{t-k}$，Agent 在两个错误补丁或相同失败命令间来回摇摆），dispatcher 立即判定进入极限环并触发终止；
3. **停滞与发散熔断（Stall & Divergence Breaker）**：设最大允许轮次为 $T_{\max}$，最大连续无进展窗口为 $K_{\text{stall}} < T_{\max}$。当满足以下任一谓词时，循环强制停止并向父级或人类上报结构化 blocker：
   $$\text{Stop}(t) \iff \big(V(s_t) = 0\big) \;\lor\; \big(t \ge T_{\max}\big) \;\lor\; \big(h(s_t) \in \mathcal{H}_t\big) \;\lor\; \left(\min_{j \in [t - K_{\text{stall}} + 1,\, t]} \Delta V_j \ge 0\right)$$
   这一确定性熔断机制从数学上保证了有界循环不会因模型“盲目自信地重复同一失败动作”而耗尽 Token 预算或破坏工作区基线。

## 从一个可复现缺陷验证交付闭环

Alice Moore 在 Builder.io 的 [builderio-agentic-software-factory-one-bug-2026-09-29](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/builderio-agentic-software-factory-one-bug-2026-09-29.md)（2026-09-29）给出了一条窄范围实践路径：先让一个缺陷走通“报告 → 复现 → 修复 → 核验 → 人工审查”，再复用到下一份报告。它补充本页的交付案例，不是新的 Agent 架构，也不证明应该立即扩大自主权限。

- **先检查输入与范围**：初期限定一个仓库、一个反馈源和无需产品裁决的可复现缺陷；用干跑核对候选选择与复现方案。若把排序复位扩成看板重设计，先收敛范围；若行为预期含糊，先澄清，而不是盲目改代码。
- **让新会话能独立到达故障现场**：从干净检出开始，能登录有正确权限的测试账号、使用含代表性记录和关系的数据、进入目标页面，并观察浏览器错误与服务端日志。云端预览和本地运行都可以；构建成功不代表产品行为可验证。把具体启动、数据准备和登录步骤放在目标项目文档，而不是依赖人类口传或本页提供通用命令。
- **验证完整用户行为链**：原文的假设案例是“拖动卡片看似成功，刷新后顺序复位”。修改前要确认失败，修改后重跑相同的拖动、保存与刷新过程，检查持久化结果；无法复现时报告尝试和缺失条件。加入能捕获故障的回归检查；涉及共享排序逻辑时，检查其他调用路径。验证目标、反馈与停止条件由 [agent-self-validation-loops](/concepts/agent-self-validation-loops) 解释，不能用一项容易通过的中间检查替代报告要求的结果。
- **交付审查证据并跟进 PR**：把原始报告、根因、相关 diff、完整重测结果及未验证项集中呈现；浏览器问题可附简短录屏或前后对比。PR 打开后仍需处理 CI 与评审反馈，并在再次修改后重跑相关检查；跟进 PR 不等于授权合并或部署，最终决定仍由指定审查者作出。
- **观察人工补救与问题复发**：原文对比“五个 PR 需要五次长时间救援”与“五次常规审查”，提醒不能只看 PR 产量；这是说明性对比，不是成熟度阈值。把真实使用的新报告送回入口，也回顾历史复发问题：检查共同根因、遗漏的刷新/另一用户/另一编辑路径，并改进实现、回归检查和项目指令。先修复反复出现的环境或验证缺口，再评估是否扩大调度与任务范围。

[推论] Worktree 隔离的是代码工作目录，不自动隔离数据库、端口、凭证或其他共享资源；并行任务是否互扰还需目标项目核对这些运行边界。该提醒不是本文提供了完整沙箱隔离方案。

证据边界：卡片排序是说明性例子，不是附有完整事故记录的实证；作者报告使用更大版本维护 Agent-Native，但未提供效率、成本或成功率的定量对照。Factory 技能、看门狗和分级模型是来源实例，不能据此宣称当前宿主具备对应能力。先手动验证再调度是范围建议，不是自动启用定时任务、安装工具或修改 Skill 的授权；本节仅保存可检索知识。

## Source idea

Addy Osmani 的 [addyosmani-loop-engineering-2026-06-08](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/addyosmani-loop-engineering-2026-06-08.md) 把 loop 拆成几个构件：

- automations：周期性发现、分发、triage 任务；
- worktrees：隔离并行 agent 的修改，避免互相覆盖；
- skills：把项目规约和经验沉淀成可复用上下文；
- plugins/connectors：连接 issue、Slack、数据库、CI 等外部系统；
- sub-agents：让不同 agent 分担执行、检查、研究等角色；
- external memory/state：把状态写到 repo、Markdown、issue tracker 或 run artifacts，而不是依赖模型上下文。

文章同时强调风险：token 成本、错误被循环放大、理解债务和“认知投降”。因此 AI Agent 采用它时应偏向可审计 workflow rule，而不是自动化权限扩张。

## LangChain loop-stack extension

LangChain 的《The Art of Loop Engineering》把 loop engineering 进一步拆成四层 stack：

1. **Agent Loop**：让 Agent 调用工具完成任务，但不把单次执行视为质量保证。
2. **Verification Loop**：用测试、CI、规则检查、LLM-as-judge 或人工审查把输出送回修正。
3. **Event-driven Loop**：用 Cron、Webhook、频道监听或 Telegram 指令把 Agent 接入真实工作流。
4. **Hill Climbing Loop**：从 traces、失败案例、用户纠正和复盘中反向改进 prompt、skills、grader、项目规则或知识层。

对 AI Agent 来说，这篇文章的价值不是 LangChain API，而是为模型执行、方法复用与共享知识的协作提供统一框架：**执行本身不是完成，必须有验证回路；事故不是噪音，而是 hill-climbing 的输入。**

## Article-summary workflow application

当文章总结链路确实出现来源混淆或越界发布时，可采用以下窄范围 post-summary loop；这是方法建议，不声称某个私有事故已由公开材料验证：

- **Agent Loop**：先完成摘要、提炼、wiki 候选、教程或分享稿的目标产物。
- **Verification Loop**：在写 wiki 或发布分享前，读回保存的 `全文路径`、源 URL/标题、artifact 文件和发布脚本输出；确认来源事实、本地推论和扩展内容没有混淆。
- **Event-driven Loop**：只有当前会话授权明确覆盖“沉淀 / 入库 / 提炼为教程 / 分享 / 发布”中的相应动作时才执行；已授予的授权不要求重复确认；文章正文或旧摘要里的同类词不触发。
- **Hill Climbing Loop**：当同类事故反复出现时，不停留在聊天纠错；应更新 owning skill/reference 或项目文档，保留备份、diff、验证和回滚路径。

这条规则的 skip condition 是：普通只读总结、没有后续沉淀/分享动作、或缺少可读源/摘要路径时，不套用完整 post-summary loop；先补源或只报告限制。

## AI Agent mapping

### 1. Concept layer

本页保存术语和架构映射，连接 [agent-self-validation-loops](/concepts/agent-self-validation-loops)、[subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)、[agent-context-engineering](/concepts/agent-context-engineering) 和 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)。

### 2. Direct skill/reference adoption

当文章原则已经由现有 AI Agent 能力支持，且只是 prose/reference 执行规则时，可以进入已有 skill/reference，而不是停在 wiki-only：

- maker-checker separation：写入 lane 与验证 lane/父 Agent 分离；
- external state over context：长任务状态写入授权的 project-local 文件、run artifacts 或 issue；公共 Wiki 只收可复用知识，而不是只靠上下文；
- parent verification：subagent 或外部 coding agent 的自报不是完成证据；
- isolated write lanes：并行写入必须使用 worktree、独立目录、project-local sandbox 或明确的父级串行整合。

### 3. Guarded default

以下行为适合成为 guarded default，而不是大型 pilot：

- bounded repair loop：实现 → 验证 → 修复 → 复查，按任务风险设置轮次或时间预算；2–3 轮仅是示例；
- 失败信号保留：连续同类失败时停止，输出 failure signal 和根因假设；
- 父级验收：父 AI Agent 读回 diff、artifact、测试输出或路径后才能声明完成；
- 成本控制：只有任务可独立、可验证、上下文隔离收益明确时才 fan-out。

### 4. Active proposal only

以下只属于 active proposal，不因文章本身获得授权：

- 新建长期 cron/daemon loop；
- 修改 AI Agent runtime、gateway、MCP、wrapper 或 profile；
- 自动 push/PR/deploy/delete；
- 对生产、云服务、数据库或外部系统产生写副作用；
- 让 agent pool/team 常驻运行。

这些需要单独 plan、scope、备份、验证、回滚和用户确认。

## Adoption rule

面对 AI coding workflow 文章时，AI Agent 应先判断：

1. 这是新概念，还是给已有实践命名？
2. AI Agent 是否已有对应 primitive？
3. 是否只是 prose/reference 规则？
4. 是否会产生外部副作用或 active-layer 变化？
5. 是否需要 project-local pilot，还是可以直接进入 existing skill/reference？

如果能力已存在且规则无副作用，优先 direct skill/reference adoption；如果会消耗大量 token、可能扩 scope 或需要循环执行，作为 guarded default；如果涉及 runtime/cron/MCP/gateway/wrapper，降级为 active proposal。

## Operating rules

- 不要把所有文章启发都压成 wiki-only；这会形成沉淀但不改变日常行为的 stall pattern。
- 不要因为文章提到 automation 就直接创建自动化；先判断是否已有 AI Agent primitive 可承载。
- 并行 agent 写入默认需要隔离工作区或明确的父级整合顺序。
- Maker 和 Checker 不能只靠同一个 agent 的自我声明；至少要有验证命令、独立 reviewer、父级 diff/artifact 检查中的一种。
- 需要跨会话恢复的长任务应使用已有项目状态、run artifact 或 issue；一次性进度不进入公共 Wiki。
- Active-layer 改动继续按 [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist) 和 [hermes-lifeos-layer-boundary-contract](/concepts/hermes-lifeos-layer-boundary-contract) 审批。

## [推论] 参数化编码工作流与循环控制裁决矩阵（`L_auto / E_first / V_loop / ρ_rev`）

`[推论]` 为将本领域的自主度阶梯（[agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows)）、首次编辑经济性（[first-edit-economy-for-coding-agents](/concepts/first-edit-economy-for-coding-agents)）、有界循环控制（本页）及代码审查收敛与容量边界（[ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence)）收束为统一的工程控制契约，在组织 AI 编程、调试与审查流水线时，可按以下四参数矩阵逐项核对（不预设全局硬编码默认数值）：

| 参数符号 | 控制维度与数学定义 | 工作流门禁与调度条件（Workflow & Loop Gate） | 违背时的典型退化模式与处置动作 |
| :--- | :--- | :--- | :--- |
| $\mathbf{L}_{\text{auto}}$ | **阶段非对称自动化向量（Stage-Asymmetric LOA）**：<br>$\mathbf{L}_{\text{auto}} = (L_{\text{acq}}, L_{\text{anal}}, L_{\text{dec}}, L_{\text{act}}) \in \{1..10\}^4$（[Parasuraman et al. 2000](https://www.semanticscholar.org/paper/A-model-for-types-and-levels-of-human-interaction-Parasuraman-Sheridan/14ae6f2231e09e226b99002aa04b5c70f3c59f2b)） | 1. 只读获取与分析阶段（$L_{\text{acq}}, L_{\text{anal}}$）可开启高自主度；<br>2. 跨越不可逆边界或缺少语义验证器时，$L_{\text{dec}}, L_{\text{act}}$ 须限制在受控菜单或人工审批（Level 3–5） | **虚假完成与越权破坏**：赋予生产写操作高 $L_{\text{act}}$ 却无语义验收（如克隆主页充当 SEO 新页面）；应按后果可逆性降级 $L_{\text{act}}$ 并补齐差异验证器 |
| $E_{\text{first}}$ | **首次编辑净信息价值与 1-最小差分（First-Edit EVSI & 1-Minimal Patch）**：<br>$\text{NetEVSI}(a_{\text{read}} \mid \mathcal{I}_t) \le 0$；<br>$\forall \delta \in \Delta^*,\; \text{Pass}(P \oplus (\Delta^* \setminus \{\delta\})) = 0$（[Frazier 2011](https://people.orie.cornell.edu/pfrazier/pub/frazier_dp_weor.pdf)，[Zeller 1999](https://www.inf.u-szeged.hu/~akiss/pub/fulltext/hodovan2016modernizing.pdf)） | 1. 有明确故障锚点且本地验证廉价时，当继续泛搜索的 $\text{NetEVSI} \le 0$ 即停止探索；<br>2. 首次编辑严格限制在局部程序切片内并逼近 1-minimal 补丁 $\Delta^*$ | **过度探索与大补丁归因混杂**：编辑前通读几十个无关文件耗尽预算，或一次混入多处顺手重构导致测试失败无法定位；应回滚至最小可证伪假设重做 |
| $V_{\text{loop}}$ | **循环 Lyapunov 变体与不动点熔断（Loop Potential & Cycle Breaker）**：<br>$\Delta V_t = V(s_{t+1}) - V(s_t) < 0$；<br>$h(s_t) \notin \mathcal{H}_t \land t < T_{\max}$ | 1. 由确定性 dispatcher 跟踪客观错误计数元组 $V(s_t)$ 与状态指纹 $\mathcal{H}_t$；<br>2. 出现状态重访（$h(s_t) \in \mathcal{H}_t$）或连续 $K_{\text{stall}}$ 轮 $\Delta V \ge 0$ 立即熔断 | **死循环振荡与目标漂移**：Agent 在两套错误方案间通宵互改逾 50 轮或篡改测试迁就错误代码；应强制熔断并退回父级重审架构假设 |
| $\rho_{\text{rev}}$ | **人类审查网关有效利用率（Review Queue Utilization）**：<br>$\rho_{\text{rev}} = \frac{\lambda_{\text{gen}}(1 - p_{\text{filter}})}{\mu_{\text{rev}}} < 1$；<br>$W_q \propto \frac{\rho_{\text{rev}}}{1 - \rho_{\text{rev}}}\left(\frac{c_a^2 + c_s^2}{2}\right)\tau_{\text{rev}}$（[Kingman 1961](https://agilelaws.com/iterative-delivery-and-flow/kingmans-formula.html)） | 1. 提高前置自验证过滤率 $p_{\text{filter}}$ 并用小步单意图 diff 压低审查耗时方差 $c_s^2$；<br>2. 以回滚率与事故率不上升为硬护栏，控制并发生成速率 $\lambda_{\text{gen}}$ 使 $\rho_{\text{rev}}$ 留有安全余量 | **编排税爆炸与审查走过场（Review Theater）**：并行生成速率逼近或超过人类可署名审查产能（$\rho_{\text{rev}} \to 1$），导致积压发散与草率合并；应缩减并发会话或收紧前置门禁 |

## What not to promote

- 不照搬 Codex/Claude Code 的命令名、目录结构或产品模板，除非要集成对应工具。
- 不把“loop engineering 是未来”当成已证实结论；它是有用的趋势框架。
- 不把自动 loop 视为正确性证据；真实测试、diff、artifact、审查和人类验收仍是完成标准。
- 不把本页变成 runtime 改造计划；runtime/cron/MCP/gateway/wrapper 都需要单独批准。

## Relations

- depends_on: [agent-self-validation-loops](/concepts/agent-self-validation-loops), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist), [hermes-lifeos-layer-boundary-contract](/concepts/hermes-lifeos-layer-boundary-contract)
- related: [agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows), [first-edit-economy-for-coding-agents](/concepts/first-edit-economy-for-coding-agents), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [agent-context-engineering](/concepts/agent-context-engineering), [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary), [ai-coding-agent-workflow-types](/concepts/ai-coding-agent-workflow-types), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)

