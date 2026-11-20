---
title: Agent 闭环学习：从用户纠错到规则升级
created: 2026-05-18
updated: 2026-11-19
type: concept
tags:
  - agent
  - memory
  - optimization
  - evaluation
  - workflow
  - governance
sources:
  - raw/articles/microsoft-power-apps-mcp-closed-loop-learning-2026-05-12.md
  - docs:https://arxiv.org/html/2507.19457v2
  - docs:https://dspy.ai/3.1.3/api/optimizers/GEPA/overview/
  - docs:https://arxiv.org/abs/2310.03714
  - docs:https://www.langchain.com/blog/goal-engineering
status: stable
description: 从便于人工审阅与反馈复用的任务范围设计，到用户纠错的记录、泛化、验证与规则晋升。
aliases:
  - closed-loop-learning
  - goal-engineering
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Agent 闭环学习：从用户纠错到规则升级

## Summary

Agent 闭环学习是一种把真实使用中的用户纠错转化为可验证系统改进的机制：先保存个案纠正，再从重复模式中提炼规则，通过离线或影子评估验证后，才把规则升级为默认行为。它补充了 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) 的经验固化路径，也为 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 提供“从反馈到新基线”的改进闭环。

一句话原则：**不要把一次用户纠正直接写成全局规则；先记忆、再泛化、再验证、最后推广。**

闭环还有一个上游设计问题：任务范围是否便于人类审阅，以及反馈能否在明确边界内复用。下文以 LangChain 的“目标工程”（Goal Engineering）案例补充这一环节，不将其视为替代上下文工程的新架构。

## Source anchor

本页由 Microsoft Power Platform Blog 文章 [microsoft-power-apps-mcp-closed-loop-learning-2026-05-12](https://github.com/on195594/wiki/blob/bde6d85cc5bb24531b1b030b1627bf7533168437/raw/articles/microsoft-power-apps-mcp-closed-loop-learning-2026-05-12.md) 触发。文章介绍 Power Apps MCP server 的 data entry tool 如何从 Agent feed 中的用户纠正学习，并通过 memory-based optimization 与 Genetic-Pareto optimization 把个案纠错升级为组织级模式。

## Core principle

闭环学习的核心不是“模型自动变聪明”，而是建立一条可审计的改进链：

```text
production action
→ user correction
→ structured memory
→ pattern/rule distillation
→ shadow/offline evaluation
→ baseline promotion
→ future action improves
```

这条链路解决两个常见失败模式：

- **太保守**：用户纠正只影响当前任务，未来仍重复犯错。
- **太激进**：用户纠正一次就变成全局规则，污染其他场景。

成熟做法是在两者之间增加分层晋升：单次反馈先作为证据保留，只有当它可复现、可泛化、可验证时，才升级为默认行为。

## Reusable pattern

### 反馈之前：按可审阅性设计任务范围

**来源观点与案例：** Harrison Chase、Mihir Garimella 与 Anshul Gupta 在 LangChain 的 [Goal Engineering: How to Design Goals](https://www.langchain.com/blog/goal-engineering)（2026-11-14）中主张，设计 Agent 的工作范围时，应考虑人工提供高质量反馈是否方便，尤其是品牌审美、表达尺度和工作方法等尚未写成文档的判断。

文中 Actively AI 起初按潜在客户账户配置 Agent，由同一 Agent 提交外联、回复、销售机会推进策略等不同类型的行动供销售人员批准。团队发现审阅工作分散、切换频繁，而且跨账户的同类经验不易共享；第二版改为按具体工作类型组织跨账户的 motions，例如外联或早期销售机会推进，使相似成果可以集中审阅。同一来源仍强调客户事实上下文的重要性：后台 Agent 收集各账户信息，motions 执行时按需调用，并非舍弃对象上下文。

**[推论] 适用条件与取舍：** 当任务重复、专家判断重要，且一条反馈在一组任务中具有共同适用范围时，可考虑按工作类型组织审阅和经验复用；如果端到端责任、权限隔离或对象特异性更重要，按客户、项目或案件组织仍可能更合适。先检查现有审阅入口和任务分组即可，不必据此增加 Agent 数量、改变权限或重构运行拓扑。同类任务也不能自动共享全部偏好，仍须区分个人偏好、组织标准和一次性例外，再沿用下文的验证与晋升流程。

**[推论] 轻量检查问题：** 仅在需要改进重复任务的反馈效率时使用，不为简单任务强制新增人工审批：

- 人能否集中审阅一组同类成果，而不必反复切换背景？
- 一条反馈适用于哪些任务和用户，又明确不适用于哪些场景？
- 哪些信息是对象事实，哪些是可复用的工作方法或偏好？
- 调整后，审阅耗时、重复纠错和结果质量是否实际改善，而不只是反馈数量增加？

**证据边界：** 该来源是包含案例团队署名的产品实践叙述，没有提供审阅耗时、任务质量或反馈迁移效果的量化对照，不能证明按工作类型组织普遍优于按对象组织。文中的“学习”未详细交代持久化与更新机制，不支持推断模型权重更新或反馈自动成为默认规则；末句“提示工程和上下文工程会消失”是作者预测，本页不将其采纳为事实。2026-11-16 核对范围为该来源的正文与页面署名/日期，未复现实效或核验配图，不刷新本页其他来源的核验日期。

### 1. Capture corrections as structured memory

用户纠正必须保留上下文，而不是只保存一句自然语言建议。

至少应记录：

- 原始输入和任务类型。
- Agent 原始输出。
- 用户修正后的值。
- 字段、场景、来源和时间。
- 修正是否代表个人偏好、组织标准、法规要求或一次性例外。

在微软案例中，发票里的 `UK` 被用户改成 `United Kingdom`。这不是聊天偏好，而是组织数据规范。

### 2. Retrieve similar memories for immediate improvement

第一层改进是 memory-based optimization：未来遇到类似任务时，系统召回相关纠正并应用。

它适合处理：

- 高频字段格式修正。
- 相似供应商、地区、表单或文档类型。
- 需要立即从少量真实反馈中受益的场景。

风险是：检索不到时规则不会生效；检索到错误相似项时会误用。

### 3. Distill repeated corrections into rules (DSPy & GEPA reflective Pareto evolution)

第二层改进是把重复纠正提炼成规则。微软文章（[microsoft-power-apps-mcp-closed-loop-learning-2026-05-12](https://github.com/on195594/wiki/blob/bde6d85cc5bb24531b1b030b1627bf7533168437/raw/articles/microsoft-power-apps-mcp-closed-loop-learning-2026-05-12.md)）明确说明其底层通过斯坦福 **DSPy** 框架（Omar Khattab 等，2023/2024，ICLR 2024，[*DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines*](https://arxiv.org/abs/2310.03714)）集成了 **GEPA（Genetic-Pareto）** 优化器（Lakshya A. Agrawal、Omar Khattab 等，2025/2026，UC Berkeley & Stanford，[*GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning*](https://arxiv.org/html/2507.19457v2)，[DSPy GEPA Overview](https://dspy.ai/3.1.3/api/optimizers/GEPA/overview/)）：通过反思式进化提示词优化，把具体纠正蒸馏进 Agent 指令，使原则成为默认行为，而不是每次依赖记忆召回。

从算法机制看，GEPA 的可迁移要点是：
- **用自然语言轨迹诊断生成候选**：相较于只提供标量奖励的优化设置，GEPA 利用执行轨迹和文本反馈，通过反思式变异生成候选提示词。`[推论]` 在用户纠错场景，可将纠正差异与上下文作为反馈；这不意味着所有 RL 都缺少错误信息，或文本反馈一定正确。
- **保留不同样本上的互补候选**：Pareto 候选选择避免只按一个平均分过早淘汰有局部优势的候选；具体前沿与选择策略应以论文及所用实现版本为准，不能把任意任务簇上的非支配集合公式当作微软系统的已知实现。合并互补候选是一种可选操作，并非每轮必然发生。候选的验证集优势仍需独立评估，不能直接视为泛化保证。

可迁移到一般 Agent 系统的表达是：

```text
many correction examples
→ candidate rule/prompt (via reflective trace analysis)
→ multi-dimension / Pareto regression & evaluation set
→ statistical shadow or offline validation
→ promoted default instruction
```

这一步的重点是“从 case 到 rule”，不是把所有 case 原样塞进上下文（参见 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) 的 `B_act / P_skill / G_promo / I_rev` 门禁）。

### 4. Validate before promotion (Shadow experiment & statistical gate)

新规则必须经过评估门槛。微软文中提到影子实验（Shadow Experiment）：真实请求仍用当前基线 $\pi_{\text{base}}$ 给用户返回结果，同时在后台并行对同一输入评估候选 $\pi_{\text{cand}}$，通过假设检验与统计功效分析判断是否升级。文中另报告离线实验的置信区间不重叠及差值区间为正，但没有给出下面这样的通用晋升公式。

`[推论]` 项目可以预先约定如下工程门禁（参见 [repeated-measures-statistical-power-for-ai-evaluation](/concepts/repeated-measures-statistical-power-for-ai-evaluation) 与 [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)）：
$$\text{Promote}(\pi_{\text{cand}}) = \mathbb{I}\!\Bigl[\operatorname{LCB}_{1-\alpha}(\Delta M) > \delta_{\min} \;\land\; \text{Regress}(\pi_{\text{cand}}, \mathcal{F}_{\text{gold}}) = 0 \;\land\; \Delta C_{\text{amort}} \le \varepsilon_C\Bigr]$$
这里 $\Delta M$ 是候选相对基线的目标指标差值，$\delta_{\min}$ 为最低实际收益，$\mathcal{F}_{\text{gold}}$ 为预先选定的受保护回归集，$\varepsilon_C$ 为允许的摊销成本增量。置信下界应按同一输入的配对设计估计（例如配对 bootstrap），不能用两个独立置信区间是否重叠替代；有限回归集零回退不证明所有场景零风险。成本门槛与统计方法均为项目选择，并非 GEPA 或微软系统的固定规则。`[推论]` 在规则生命周期上，该式将 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) 的候选晋升净效用门禁 $G_{\text{promo}}$ 具体化为配对置信下界与零回归硬约束；当规则晋升后遇基座模型升级至 $M_{t+1}$ 时，则转为 [hermes-active-surface-lifecycle-governance](/concepts/hermes-active-surface-lifecycle-governance) 的反向移除消融检验 $\Delta U(r_j \mid M_{t+1})$。

对 AI Agent 来说，等价 gate 可以是：

- 固定 fixture 上的输出差异对比。
- 真实历史任务的 replay。
- 独立 reviewer / grader 只读审查。
- 关键质量指标不回退（历史金标集零回归）。
- 新规则有 rollback path。

这与 [agent-self-validation-loops](/concepts/agent-self-validation-loops)、[agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation) 和 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 的思想一致：先验证，再推广。

## Directional evidence from the source

以下数字来自微软文章中的预上线离线模拟，应视为数量级参考，不应硬编码为 AI Agent 标准：

- 数据集：英国选举委员会 100 张发票，10 次独立运行。
- 来源报告 4277 个字段实例，人工编辑字段比例从 64% 降至 48%，同时称减少 1045 个需人工修正字段。**口径待核实：** 若使用同一分母，`4277 × (64% − 48%) = 684.32`，与 1045 不相容，不能用整数百分比四舍五入解释。本页不将这组数字作为相互印证的效果估算，也不擅自把原文的 1045 改成 684；需由来源澄清分母或计数口径，raw 原文保留不改。
- F1：从 66.4% 提升到 74.6%，提升 8.2 个百分点。
- 一个抽样运行中：Genetic-Pareto 解决 76/583 个基线差距，约 13% reduction。
- 国家字段准确率：从 11% 提升到 78%，主要来自学会展开国家缩写。

这些数据的价值在于说明：闭环学习最先改善的往往不是“能不能读懂文档”，而是“输出是否符合组织标准”。

## AI Agent mapping

### Session correction

单次用户纠正默认留在 session 或当前任务证据里，除非它满足更高层的晋升条件。

适合留在 session 的内容：

- 当次输出风格修正。
- 一次性上下文误解。
- 当前任务局部约束。

### Memory

只有短小、稳定、跨任务长期有效、且默认注入上下文有收益的事实才进入 memory。

不应进入 memory：

- 文章摘要。
- 复杂方法论。
- 需要来源解释的概念。
- 尚未验证的一次性纠正。

这与 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules) 和 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 的边界一致。

### Skill

当多次纠正指向同一类可重复操作流程时，才考虑 patch skill。

升级条件：

- 能写成触发条件、步骤、坑点和验证。
- 已在至少一个真实任务中跑通。
- 修改后有明确 regression/smoke gate。
- 旧行为有回滚路径。

### Wiki

当纠正背后是跨工具、跨项目的概念或判断框架时，进入 wiki concept。

本页本身就是 wiki 层：它不授权修改 runtime、skill、cron 或 memory，只提供“如何判断反馈是否应升级”的概念模型。

### Evaluation / pilot

从 memory 或 skill candidate 到默认行为之间，应有项目级 pilot 或 eval lane。

推荐链路：

```text
candidate correction pattern
→ project-local fixture / replay set
→ candidate rule or prompt
→ read-only review / evaluation report
→ explicit promotion decision
→ active skill/runtime patch if approved
```

这也呼应 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)：验证项目先在 project-local 层证明价值，再考虑 active 层推广。

## When to promote a correction

可以考虑推广：

- 同类纠正反复出现。
- 纠正能压成明确规则。
- 规则适用边界清楚。
- 失败代价足够高。
- 有可重复测试样本。
- 对其他场景的负面影响可评估。

不要推广：

- 只有一次发生。
- 只是个人即时偏好。
- 规则边界模糊。
- 无法构造验证样本。
- 会覆盖其他用户或其他任务的合理差异。
- 只是产品宣传，缺少本地验证。
- `[推论]` 纠错来源未经鉴权、混杂了外部不可信输入或跨主体共享上下文：反馈晋升前须核验纠错主体权限与来源信任等级，不得将选择性摘要当作唯一过滤屏障（完整持久记忆投毒威胁模型与防御门禁统一见 [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense)）。

## Limitations

微软文章的数据来自单一客户、单一发票处理场景，且是预上线离线模拟。它说明闭环学习在结构化数据录入中有潜力，但不能直接证明该方法适用于所有 Agent 工作流。

对 AI Agent 的使用也应保守：文章只能支持“建立闭环学习概念和晋升门槛”，不能直接支持新增自动自改、自动写 memory、自动 patch skill 或自动 cron 推广。

## Local operating rule

在 AI Agent 中处理用户纠正时，先按 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 裁决纠正内容的归属；若还涉及执行方法、触发、外部能力或运行状态，再按 [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist) 组合路由；最后参考本页 “When to promote a correction” 判断是否满足晋升条件。

## Relations

- refines: [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops)
- related: [agent-self-validation-loops](/concepts/agent-self-validation-loops), [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow), [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation), [repeated-measures-statistical-power-for-ai-evaluation](/concepts/repeated-measures-statistical-power-for-ai-evaluation), [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines), [hermes-active-surface-lifecycle-governance](/concepts/hermes-active-surface-lifecycle-governance), [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense)

