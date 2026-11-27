---
title: AI Agent Human Outcome Design Principle
created: 2026-06-20
updated: 2026-11-27
type: concept
tags:
  - agent
  - product
  - workflow
  - decision
  - governance
  - debugging
sources:
  - raw/articles/forbes-ai-implementation-startup-founders-human-needs-2026-06-16.md
  - raw/articles/langchain-building-proactive-agents-2026-11-17.md
  - concepts/agentic-programming-system-engineering.md
  - concepts/typed-ai-agent-boundaries.md
  - concepts/agent-development-lifecycle.md
  - concepts/ai-task-delegation-patterns-from-local-cloud-hybrid-llms.md
  - docs:https://pubmed.ncbi.nlm.nih.gov/15151155/
  - https://arxiv.org/abs/2605.26128
  - https://erichorvitz.com/chi99horvitz.pdf
  - https://www.interruptions.net/literature/Iqbal-CHI05-p1489-iqbal.pdf
  - https://interruptions.net/literature/Iqbal-CHI06-p741-iqbal.pdf
  - https://interruptions.net/literature/Mark-CHI08.pdf
  - https://arxiv.org/html/2410.12361v3
  - https://arxiv.org/html/2602.01532v2
  - https://arxiv.org/pdf/2605.30152
  - https://arxiv.org/html/2611.05731v1
status: stable
description: 用真实问题、可衡量结果和 Lee & See 三维信任边界约束 AI Agent 项目设计，结合 Horvitz
  混合主动期望效用、任务边界中断成本与 2025–2026 主动式 Agent 基准校准打断门禁（含 I_iso / M_ctx / T_tax /
  G_human / U_interrupt 裁决矩阵）。
aliases:
  - human-outcome-first-ai-agent-design
  - ai-automation-human-needs
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# AI Agent Human Outcome Design Principle

## Summary

AI Agent 项目设计不能从“模型能做什么”开始，而应从“要改善哪个真实问题、哪个可衡量结果、哪类人类信任或行为边界”开始。否则系统可能技术上正确、demo 很漂亮，却在真实用户决策中不可用。

Forbes 这篇创业公司 AI 落地文章 [forbes-ai-implementation-startup-founders-human-needs-2026-06-16](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/forbes-ai-implementation-startup-founders-human-needs-2026-06-16.md) 的价值不是介绍某个工具，而是提供了两个反面案例：Fund Expo 的融资路径推荐在表格上合理、但对创始人的现实生活和心理压力不可执行；Wobble 则明确把 AI 放在工程、研究和后台行政中，却不让 AI 直接承担心理健康回应，因为用户信任边界不允许。

这页补充 [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering)、[typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 和 [agent-development-lifecycle](/concepts/agent-development-lifecycle)：那些页面主要约束 Agent 的系统工程、接口和生命周期；本页约束更前置的产品/工作流起点——不要把 AI 能力误当成用户价值。

## Core principle

> AI 应优先作为兑现用户结果的后台能力，而不是产品承诺本身。

判断一个 AI Agent 项目是否值得做，先问：

- 它解决的真实问题是什么？
- 用户是否愿意改变行为来采用它？
- 改善的可衡量结果是什么？
- 哪些环节需要人类信任、责任或情感承载？
- AI 是在支撑承诺，还是被包装成承诺本身？

如果这些问题答不清，继续堆模型、工具、subagent、MCP 或自动化权限，只会扩大错误方向。

## Failure case 1: technically sound, emotionally unworkable

Fund Expo 的早期原型试图根据企业概况、行业和财务数字，生成融资选项排序和推荐路径。这个系统在技术上看起来优雅：输入结构化数据，输出融资路径、权益融资、债务、IRR 等分析。

真实问题是：创始人的融资决策不是纯财务优化题。它会影响家庭、房贷、婚姻、孩子接送、心理压力和对投资人的信任。文章中的反馈是：方案可能在 spreadsheet 上成立，但用户“没有办法这么做”。

可复用教训：

- 不要把现实世界决策压扁成技术输入字段。
- 高压力决策里，“正确答案”如果不能被用户接受，就不是有效方案。
- AI 原型验证不能只看输出是否合理，还要看用户是否愿意按它行动。
- 产品问题应先用人类语言定义，再翻译成技术问题。

## Failure case 2: full automation breaks trust too early

Wobble 是心理健康支持服务。创始人 Jack Murphy 早期曾关闭一个由 AI 提供心理支持的产品，因为他认为这不合适。新产品中，他做了三轮消费者研究：96% 的用户认为回应来自真实人类是“关键或非常重要”的。

这并不意味着 Wobble 不用 AI。相反，它积极把 AI 用在工程、研究分析和日常后台行政里：Claude Code 维护平台，Claude 做研究分析和 back office。但 AI 不直接对用户提供治疗回应；临床和伦理侧由人类负责人监督。

可复用教训：

- “AI 可以做”不等于“AI 应该直接面对用户”。
- 高信任/高责任场景中，来源是谁会改变同一条建议的分量。
- 自动化可以先进入后台和辅助层，等信任机制建立后再扩大边界。
- Human-in-the-loop 不是低效，而是某些场景的产品核心。

## Human design gap and appropriate reliance calibration

文章用 “Human Design Gap” 描述技术规格和人类实际工作/决策方式之间的脱节。从人因工程与自动化信任经典研究看，这一脱节直接对应 John D. Lee 与 Katrina A. See（2004，*Human Factors* 46(1): 50–80，[*Trust in Automation: Designing for Appropriate Reliance*，PubMed 15151155](https://pubmed.ncbi.nlm.nih.gov/15151155/)）提出的**适度依赖与三维信任校准模型（Purpose / Process / Performance）**：
- 人类对自动化的信任并非仅由算法客观准确率（**Performance**，如 Fund Expo 的 IRR 计算）决定，还同时受过程可理解性（**Process**）与设计意图/角色伦理边界（**Purpose**，如 Wobble 中 `96%` 受访者要求心理支持来自真实人类）通过分析性（Analytic）、类比性（Analogical）与情感性（Affective）三条路径共同支配；
- 当技术团队只优化 `Performance` 而忽视 `Purpose` 与现实生活约束时，就会触发 Parasuraman & Riley 所说的**弃用（Disuse）**或因越界自动化破坏信任。AI 只有在改变行为、加速决策、减少摩擦或改善客户结果时才产生价值，否则就是昂贵的剧场效果。

在 Agent 项目中，这个 gap 常表现为：

- agent 能完成任务，但用户不敢信；
- agent 给出建议，但用户无法执行；
- workflow 减少了人工步骤，却也移除了必要责任人；
- 输出看起来更快，但没有改善最终决策质量；
- 自动化能力被当作卖点，而不是后台能力。

### `[推论]` 多智能体委派、上下文交接、人类信任与主动打断参数化裁决矩阵（`I_iso / M_ctx / T_tax / G_human / U_interrupt`）

`[推论]` 为把本页的人类信任与注意力保护边界同 [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)、[ai-task-delegation-patterns-from-local-cloud-hybrid-llms](/concepts/ai-task-delegation-patterns-from-local-cloud-hybrid-llms)、[ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution) 及 [agentic-content-pipeline-design-patterns](/concepts/agentic-content-pipeline-design-patterns) 串成可核对的工程契约，在设计多 Agent 协作、端云混合委派、内容流水线或主动提醒时，可按以下五个参数化维度裁决（具体阈值按项目场景设定）：

| 参数符号 | 治理维度 | 形式化判据与定义 | 满足条件时的推荐设计 | 违反条件时的降级/拦截规则 |
| --- | --- | --- | --- | --- |
| `I_iso` | **并发子代理执行隔离度** | 并发 worker $i \neq j$ 的外部读写状态集满足 Bernstein 不交条件 $\mathcal{W}_i \cap \mathcal{W}_j = \emptyset \land \mathcal{R}_i \cap \mathcal{W}_j = \emptyset$ 且具独立机械完成判据 $\Phi_{\text{done}}(w_i)$ | 允许采用 `Fan-out` 并行分片（[subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)），各子代理写独立输出路径并由父级汇总核验 | 严禁共享同一输出路径或单一全局 `done` 标志；若子任务存在状态耦合，回退至单 Agent 或顺序流水线 |
| `M_ctx` | **角色上下文交接模式** | 按重发现成本 $C_{\text{rediscover}}$ 与锚定偏差 $\text{Bias}_{\text{anchor}}$ 选择 `fork/packet` 或 `isolated` | 延续已验证诊断的 `fixer` 传有界证据包；独立 `verifier` / 并行 `researcher` 强制 `isolated`（不传父级结论） | 禁止把父级完整历史和预设结论传给独立审查者或反方挑战者（[ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution)） |
| `T_tax` | **端云脱敏与小模型约束税** | 出域前按威胁模型核查直接标识符、作息等准标识符与重识别风险（化名化不等于零信息泄露），且核查小模型硬 Schema 解码是否引发关键字段漏提（Constraint Tax，[arXiv:2605.26128](https://arxiv.org/abs/2605.26128)） | 云端结构化输出使用 Schema 校验并另验业务约束；容量受限端侧提取层可用示例软引导 + 宿主 JSON 解析、Schema/业务校验与有界重试 | 禁止外发私有映射表 $M_{\text{local}}$ 或未满足隐私要求的任务包；无法确认出域安全时本地求解或停止。不得因格式合法而忽略业务截止时间 |
| `G_human` | **人类信任与前置方向门禁** | 明确区分后台可自动化的技术执行（`Performance`）与必须由人类前置定义或承担伦理/情感责任的边界（`Purpose`） | 在流水线入口前置注入人类情境/7W 方向与低成本中间产物检查点（如故事板/大纲，[agentic-content-pipeline-design-patterns](/concepts/agentic-content-pipeline-design-patterns)） | 当高信任/高情感负载场景要求人类担责，或基座模型升级使旧补丁规则冗余（$\Delta Q \le \epsilon$）时，禁止盲目全自动对外发布或保留僵化规则 |
| `U_interrupt` | **主动打断期望效用与双信号门禁** | 满足 Horvitz 干预临界概率 $P(G \mid E) > p^*$ 且同时跨过客观需求与主观可接受度双信号阈值 $p_{\text{accept}, t} \ge \tau(p_{\text{need}, t})$（[Horvitz 1999](https://erichorvitz.com/chi99horvitz.pdf)；[PRISM 2026](https://arxiv.org/html/2602.01532)） | 优先在粗粒度子任务边界推送实时提醒（[Iqbal & Bailey 2005](https://www.interruptions.net/literature/Iqbal-CHI05-p1489-iqbal.pdf)），落入双阈值不确定区间时降级为异步简报或非侵入状态提示，并退役已兑现的 `ONCE` 单次意图 | 禁止让大容量生成模型在热路径上高频无界轮询事件流，亦禁止把“未收到用户投诉”直接计为无漏报或阈值校准合格 |

## AI Agent mapping

### Wiki

这类文章应进入 wiki：它是来源明确、可复用、可检索的外部失败案例，能为后续 AI Agent 项目设计提供反例和设计原则。

### Skill / reference

暂不直接升级为 active skill 默认门禁。更合适的路径是：先在 wiki 中稳定表达原则；后续如果在 1-2 个真实 Agent 项目设计中实际阻止了“技术先行、问题后补”的错误，再把它晋级为某个设计/评审 reference 的 optional checklist。

### Memory

不写 memory。它不是用户偏好、环境事实或工具 quirk，而是需要来源、边界和案例解释的知识。

### Runtime / MCP / cron

不直接改变 runtime、MCP、cron、wrapper 或 gateway 行为。本文只能提供设计原则，不能授权任何自动化能力扩大。

## 主动式 Agent：什么时候值得打断用户？

LangChain 的 Sydney Runkle 在 [langchain-building-proactive-agents-2026-11-17](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/langchain-building-proactive-agents-2026-11-17.md)（2026-11-17）中区分了四种结果：该提醒时提醒、不该提醒时保持沉默、误扰、漏报。**事件真实不等于需要这个人现在处理。** [public-info-monitoring-automation-methodology](/concepts/public-info-monitoring-automation-methodology) 讨论如何检测真实变化和过滤噪声；这里关注检测之后，是否值得占用人的注意力。

### 混合主动决策与注意力打断的经典理论根基

1. **Horvitz 混合主动（Mixed-Initiative）期望效用临界方程**：Eric Horvitz（1999，ACM *CHI '99*，[*Principles of Mixed-Initiative User Interfaces*，公开全文 PDF](https://erichorvitz.com/chi99horvitz.pdf)）将主动辅助建模为目标不确定性 $P(G \mid E)$ 下的决策问题。记目标真实存在时主动介入相对静默的净收益为 $\Delta u_{\text{TP}} = u(A, G) - u(\neg A, G)$，目标不存在时误扰造成的注意力代价为 $\Delta u_{\text{FP}} = u(\neg A, \neg G) - u(A, \neg G)$，则只有当后验概率跨过临界阈值时直接介入才具正期望效用：
   $$P(G \mid E) > p^* = \frac{u(\neg A, \neg G) - u(A, \neg G)}{[u(A, G) - u(\neg A, G)] + [u(\neg A, \neg G) - u(A, \neg G)]}$$
   当引入轻量级对话确认或非侵入摘要 $D$ 时，形成双阈值带 $p^*_{\neg A, D} < p^*_{D, A}$：低于 $p^*_{\neg A, D}$ 保持静默，介于 $(p^*_{\neg A, D}, p^*_{D, A}]$ 降级为低打扰确认或异步简报，高于 $p^*_{D, A}$ 才主动推送高显著性干预。当高频误扰反复侵蚀信任时，即触发 Parasuraman & Riley 所定义的警报弃用（Disuse，见 [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation)）。
2. **子任务边界恢复延迟与速度代偿压力代价**：
   - Shamsi T. Iqbal 与 Brian P. Bailey（2005，*CHI '05*，[*Investigating the Effectiveness of Mental Workload as a Predictor of Opportune Moments for Interruption*，PDF](https://www.interruptions.net/literature/Iqbal-CHI05-p1489-iqbal.pdf)；2006，*CHI '06*，[*Leveraging Characteristics of Task Structure to Predict the Cost of Interruption*，PDF](https://interruptions.net/literature/Iqbal-CHI06-p741-iqbal.pdf)）测得：在心理负荷骤降的**最佳子任务边界（Best boundary）**打断，用户主任务恢复延迟（Resumption lag）仅为 **`2.06 s`**，而在高工作记忆驻留的**最差内部节点（Worst point）**打断飙升至 **`6.69 s`**（超过 `3×`，随机打断为 `5.66 s`）；在粗、中、细三级任务层级边界上的中断成本分别可预测地分层为 `464 ms`、`1,012 ms` 与 `1,702 ms`（调整后 $R^2 = 0.26$）。
   - Gloria Mark、Daniela Gudith 与 Ulrich Klocke（2008，*CHI '08*，[*The Cost of Interrupted Work: More Speed and Stress*，PDF](https://interruptions.net/literature/Mark-CHI08.pdf)）在 $N=48$ 受控实验中揭示了容易被表面吞吐指标掩盖的隐性代价：被打断者会通过加快单位时间操作速度来追赶进度（纯工作耗时甚至缩短至 `20.31 min` vs. 基线 `22.77 min`，$p < 0.05$），但付出了 NASA-TLX **心理压力（$p < 0.001$）、挫败感（$p < 0.007$）、时间压力与努力程度全面飙升**的代价（注：常被混引的“被打断任务平均耗时约 `23 min 15 s` 才恢复原工作”出自 Mark 等 CHI 2005 现场观察研究，并非 CHI 2008 实验室结论，二者不可混同）。

### 2025–2026 主动式 Agent 基准与双信号门控实证

以下离线基准显示，若干未校准模型提出的主动帮助中，有相当比例被评审判为不需要：

- **ProactiveBench 误扰基线**：Yaxi Lu 等（ICLR 2025，[*Proactive Agent: Shifting LLM Agents from Reactive Responses to Active Assistance*](https://arxiv.org/html/2410.12361v3)）在 `233` 个测试事件上以奖励模型代理用户判断。按论文表 3，被判不需要的提议占所有提议的比例，`GPT-4o` 为 **`51.85%`**，`Claude-3.5-Sonnet` 为 **`54.63%`**，`GPT-4o-mini` 为 **`64.73%`**。
- **PRISM 双信号动态阈值与边界慢思考**：Yuxuan Fu 等（2026，预印本 [*PRISM: Festina Lente Proactivity—Risk-Sensitive, Uncertainty-Aware Deliberation for Proactive Agents*](https://arxiv.org/html/2602.01532v2)）联合估计**需要帮助的概率 $p_{\text{need}, t}$** 与**提议被接受的概率 $p_{\text{accept}, t}$**，以误扰与漏报成本设定动态阈值：
  $$p_{\text{accept}, t} \ge \tau(p_{\text{need}, t}) = \frac{C_{\text{FA}}}{C_{\text{FA}} + p_{\text{need}, t} \cdot C_{\text{FN}}}$$
  主结果表中，`Qwen3-8B-PRISM` 的自动评估误扰率为 **`22.94%`**、F1 为 **`86.61%`**；同表人工标注评估为 `25.91%` 和 `84.85%`。附录 F.1 在误扰与漏报成本比 `1:1` 时，慢推理占 **`11.15%`**、F1 为 `83.96%`。表 3 的另一项消融中，近阈值才调用慢推理相对仅快推理，F1 从 `83.09%` 到 `88.15%`，P95 延迟从 `176 ms` 到 `196 ms`。动态门控依赖概率校准：未校准的消融中，固定阈值表现更好。
- **轻量级非生成式触发器与前瞻意图退役**：在高频事件流中，**TGL**（[arXiv:2605.30152](https://arxiv.org/pdf/2605.30152)，2026-05）用时序图网络判定何时介入，GPU 服务器上触发阶段单事件耗时 **`11.13 ms`**，相对两种单次前向 LLM 触发基线快约 **`4–7×`**，相对最慢协议快约 `353×`；14 个下游骨干模型的 F1 平均提升 `16.7` 个百分点。**Pro-Memory**（[arXiv:2611.05731v1](https://arxiv.org/html/2611.05731v1)，2026-11）为待办事项建立前瞻意图生命周期，区分单次意图（`ONCE`）与周期意图（`PERIODIC`），以便在完成后正确退役。

### 工程落地原则

- **[推论] 把触发、通知门控和外部执行权限三层解耦。** 新邮件、定时任务或状态变更可先经轻量规则或小模型门控（如 TGL / 双信号评分）筛选，而非每条事件都唤醒重型生成 Agent；要不要立即推送还是归入异步简报，按 `U_interrupt` 与子任务边界决定；能主动检查或起草绝不等于能发送邮件、修改日程，外部写动作仍遵循 [agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows) 的阶段非对称授权边界。
- **让用户在原有工作流里快速判断。** [langchain-building-proactive-agents-2026-11-17](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/langchain-building-proactive-agents-2026-11-17.md) 中，Robin 在 Slack 用一两句话说明重点，细节放在线程里；GTM Agent 则因在 Slack 处理积压的邮件草稿太慢，改用专门的审核界面。**[推论]** 首屏交代“发生了什么、为什么现在需要你、要你做什么”，证据按需展开。选现有渠道还是专用界面，取决于哪种做法更省审核与切换恢复时间，而不是统一采用某个渠道。反馈复用和记忆维护分别见 [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules#反馈之前按可审阅性设计任务范围) 与 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops)。
- **[推论] 沉默也要双盲验收，并显式退役一次性提醒意图。** 用事先约定的“需要人工处理”标准抽样复核已通知与被静默过滤的事件（同步监控 False-Alarm 与 Miss Rate，参见 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)）；对已兑现的单次跟进意图立即标记退役，避免状态滞留造成二次误扰。推送量、点击率或礼貌采纳率只反映已推送子集，不能单独证明漏报少或未引发隐性压力代偿。

证据边界：LangChain 文章是对两个内部 Agent 的实践叙述，未附通知效果或审阅耗时的受控对照，文中定时运行占比不作为行业基准；ProactiveBench、PRISM、TGL 与 Pro-Memory 的数值受各自合成/半真实事件集与奖励权重（$C_{\text{FA}}, C_{\text{FN}}$）约束，仅作门控架构设计证据，不直接据此调高现有生产自主度或变更调度配置。

## AI Agent project design checklist

在启动或推广 AI Agent 项目前，至少回答：

1. **Problem-first**：真实问题是什么？不是“AI 能做什么”。
2. **Outcome-first**：要改善哪个可衡量结果？速度、成本、错误率、等待时间、召回率、决策质量还是用户满意度？
3. **Behavior change**：用户需要改变什么行为？他们为什么愿意改？
4. **Human trust boundary**：哪些输出必须由人类承担信任、解释或责任？
5. **Human-in-the-loop**：哪些环节可以后台自动化，哪些环节必须保留确认、审核或人工回应？
6. **AI as plumbing**：对外承诺的是用户结果，还是只是在炫耀 AI 能力？
7. **Pilot evidence**：有没有真实用户/真实任务反馈，而不只是 demo 或模型输出？

## What not to overgeneralize

- 文中 “95% 生成式 AI 试点失败”缺少详细样本和口径，只能作为风险数量级提示，不作为 AI Agent 的事实基线。
- 文章案例集中在融资和心理健康这类高情绪、高信任场景；低情绪、强规则、强数据逻辑的后台优化任务不必机械套用完整检查。
- 不应因为文章强调人类信任，就否定后台自动化；Wobble 的案例恰恰说明 AI 可以积极承担工程、分析和行政后台工作。

## Relations

- depends_on: [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [agent-development-lifecycle](/concepts/agent-development-lifecycle)
- related: [agent-context-engineering](/concepts/agent-context-engineering), [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation), [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework), [public-info-monitoring-automation-methodology](/concepts/public-info-monitoring-automation-methodology), [agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows), [ai-task-delegation-patterns-from-local-cloud-hybrid-llms](/concepts/ai-task-delegation-patterns-from-local-cloud-hybrid-llms), [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules), [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops), [agentic-content-pipeline-design-patterns](/concepts/agentic-content-pipeline-design-patterns), [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)

