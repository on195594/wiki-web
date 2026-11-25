---
title: Agent Evaluation Rubric Calibration
created: 2026-07-31
updated: 2026-11-23
type: concept
tags:
  - agent
  - evaluation
  - validation
  - harness
  - workflow
sources:
  - raw/articles/langchain-similarweb-long-form-agent-report-evaluation-2026-07-29.md
  - raw/articles/motherduck-jev-analytics-use-cases-2026-10-06.md
  - raw/articles/langchain-human-insight-strategic-advantage-agents.md
  - https://arxiv.org/abs/2306.05685
  - https://arxiv.org/abs/2301.09633
  - https://arxiv.org/abs/2605.06939
  - https://machinelearningmastery.com/the-complete-guide-to-llm-evaluation/
  - https://arxiv.org/abs/2601.08654
  - https://arxiv.org/abs/2601.04171
  - https://arxiv.org/abs/2605.18261
status: stable
description: 说明评分器选择、可执行锁定 Rubric（Rulers）、上下文动态验证器（Agentic Rubrics）与裁判回归，并结合
  MT-Bench 偏差分类、Rogan–Gladen 与 PPI 诊断和校准 Agent 评测器。
aliases:
  - rubric-calibration
  - evaluator-calibration
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Agent Evaluation Rubric Calibration

## Summary

Agent 评测器本身也是需要调试的测量系统。聚合分数只能指出“哪里可能变化”，不能单独证明真实回归；当分数、逐项评语、人工复核或 Trace 互相冲突时，应先校准 Rubric，再修改 Agent。

本页提炼自 [langchain-similarweb-long-form-agent-report-evaluation-2026-07-29](https://github.com/on195594/wiki/blob/4d684be23833410aa458f656d542e1a691d5ca08/raw/articles/langchain-similarweb-long-form-agent-report-evaluation-2026-07-29.md)，并与 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 和 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation) 衔接。

## Match the evaluator to the output shape

- 答案形状明确的普通问答，可以组合确定性工具/结构检查与基于 Golden Answer 的语义等价判断。
- 开放式长篇报告不存在唯一正确文本，应按来源整合、忠实度、论证质量、完整性等维度分别设置带锚点的 Rubric，并与已接受基线做 A/B 比较。
- 基线是比较参照，不是 Ground Truth；新旧报告可以采用不同但同样有效的分析路径。

## 评分器选择与可审计 Rubric

Bala Priya C 的 [The Complete Guide to LLM Evaluation](https://machinelearningmastery.com/the-complete-guide-to-llm-evaluation/)（2026-11-13）补充以下设计方法；于 2026-11-15 核对原文相应章节，仅核对本节新增内容，不刷新全页验证日期。

- **选择足以表达约束的最低复杂度评分器。** 格式、长度、必填字段等确定性约束交给代码；有参考答案时检查任务所需的精确匹配或语义等价；忠实度、帮助性等难以形式化的标准才引入模型裁判。结构合法、语义相似与事实正确是不同结论，不能互相代替。
- **Rubric 写清四项。** 评价标准、允许使用的输入与证据、逐项检查步骤、严格输出结构。用可观察行为和正反锚点代替“答案好不好”；主张支持判断应能回溯到具体证据。
- **模型判断，程序聚合。** 逐条记录事实主张及其支持标签，由代码计算聚合结果，而非只让模型凭整体印象给分。确定性聚合不使上游的主张拆分和支持判断变得确定。

**[推论] 工程边界：** 空主张列表需区分确实不适用与拆分失败；证据不足、输出截断、解析失败应保留为未决或评测失败，不默认计为通过。汇总时同时披露未评分状态与覆盖范围，避免仅删除异常样本后报告高通过率。主张支持率只衡量已表达内容的忠实度，不能证明来源真实、时效正确或答案完整；关键遗漏应另设完整性检查。

### 裁判也需要回归测试

原文建议将人工标注集作为裁判自身的回归集，修改裁判提示或模型后重新比较。**[推论]** 比较时固定并记录案例、被评输出、可见证据、标签依据及裁判模型、Rubric、聚合规则版本；先保持被评系统输出不变以定位尺子变化，再评估系统版本差异。保留逐例分歧，不只比较平均分；调参集与独立复核集分开，避免反复迎合相同标签。

温度设为零或多数投票只能缓解部分波动，不能消除系统偏差，也不构成独立事实验证。本文不要求为每个任务新增裁判或评测平台。

## Treat the score as a diagnostic pointer

一次可信诊断至少应能下钻到：

1. 哪些 Case 发生变化；
2. 哪些评分维度发生变化；
3. evaluator 的评语如何解释该分数；
4. 来源忠实度检查发现了什么；
5. Trace 中的工具选择、检索和合成行为发生了什么。

这与 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation) 的失败信号 → 证据 → 根因 → 最小修复闭环相接：评分异常只是失败信号，逐例评语、Trace、确定性检查和人工复核才是定位根因的证据。

## Audit the ruler before changing the Agent

出现以下任一信号时，应暂停仅依据该分数做发布或回滚决定，并先审计 Rubric：

- 聚合分数与逐例人工复核持续冲突；
- evaluator 评语指出明显缺陷，但对应分数仍然较高；
- 两个维度奖励相反行为，例如“来源广度”奖励数量，而“归因精度”惩罚模糊来源；
- “简洁度”权重压过“完整性”，导致需要方法、限制和上下文的战略报告被错误缩短；
- 调整 Agent 后只有总分变化，却无法从具体 Case、分项评语或 Trace 解释变化原因。

### LLM-as-a-Judge 的三大系统性偏差（MT-Bench 分类学）

Lianmin Zheng 等（2023, NeurIPS Datasets and Benchmarks Track, *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena*, [arXiv:2306.05685](https://arxiv.org/abs/2306.05685)）系统实证了大模型作为自动裁判（LLM-as-a-Judge）时的三类固有偏差，它们直接对应 Rubric 失准的高发机理：

1. **位置偏差（Position Bias）**：在成对基线 A/B 比较中，LLM 裁判往往倾向于固定偏爱排在前面（或后面）的候选回答。**[推论]** 执行基线 A/B 评测时，应对同一案例执行正反双向位置调换（$(A, B)$ 与 $(B, A)$），仅将两次顺序下均判定同一版本胜出的结果计为一致胜出。换序后结论不一致应保留为待审信号，不能仅凭两次结果断定偏差根因或答案质量相同；若汇总时计为平局（Tie），须另行报告不一致率，与内容等质的平局区分。
2. **冗长偏差（Verbosity Bias）**：LLM 裁判普遍偏爱篇幅更长、结构看似饱满或罗列更多泛化引用的输出，即便额外内容属于冗余套话或无出处断言。这直接解释了 Similarweb 案例中“堆砌 9 个无名来源仍拿 0.7 高分”以及“简洁度与完整性维度相互拉扯”的根源——评分锚点必须显式考核**单位关键主张的具名可核验支撑率**，而非表面字数或引用计数。
3. **自我强化偏差（Self-Enhancement Bias）**：裁判模型倾向于偏好与其自身同属一个模型家族生成的文本分布（印证 [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines) 关于“同一模型兼任生成与裁判会虚高分数”的警示）。跨模型选型或路由评估时，应优先依靠确定性工具/状态断言，或使用经人工校准的独立裁判族。

## Efficiency rubric must respect the execution contract

[motherduck-jev-analytics-use-cases-2026-10-06](https://github.com/on195594/wiki/blob/4d684be23833410aa458f656d542e1a691d5ca08/raw/articles/motherduck-jev-analytics-use-cases-2026-10-06.md) 的工具效率评估明列“不计浪费”的产品动作：首次使用前各读一次指南、保存后立即查看结果、每次异步运行后等待一次；失败调用后一次纠正重试也不计浪费。它同时展示效率评分与主要浪费标签不一致的轮次，将其作为回查信号，而不是用任一标签自动裁定根因。

**[推论]** 将此方法迁移到其他 Agent 时，先明确其实际执行契约，再评价可省步骤：

- 必要的授权、前置读取与结果核验不应因增加调用而被惩罚；不能用“少调用”奖励跳过验证。
- 一次合理纠正重试与无新证据的重复失败应分开评价；案例的免罚清单与重试次数不作为通用豁免。
- 调用计数由确定性轨迹分析产生；是否必要仍需结合用户目标、依赖顺序与当时可见证据判断。
- 用“省略必要核验但调用更少”和“保留核验且完成任务”的相邻反例检查错误激励；分项标签冲突时回查 Trace，不直接修改 Agent。

条件性诊断的流程由 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 维护。本例只提供 Rubric 设计方法，未证明 judge 准确性或省略步骤的安全性，也不授权更改任何执行规则。

## Turn expert review into reusable evaluation data

[langchain-human-insight-strategic-advantage-agents](https://github.com/on195594/wiki/blob/4d684be23833410aa458f656d542e1a691d5ca08/raw/articles/langchain-human-insight-strategic-advantage-agents.md) 提出三个原则：专家定义特定任务中的质量标准；审查上下文应支持该判断；将专家判断转化为可复用评估数据。文章展示的标注包含评分及其理由，既可暴露 Agent 的问题，也可指出 evaluator 奖励了错误行为或 Rubric 存在空白。

- **审查相关会话与工具结果，而不只看最终答案。** 原文建议以完整会话作为多轮 Agent 的审查单元；其 Fetch Rewards 案例也说明，单轮输入输出只是起点，还需核对真实工具调用、商品规格和该用户实际可用的优惠。流畅或局部正确不等于符合用户意图。
- **保存理由与未确定事项，不只保存分数。** 把标签绑定到对应交互，并记录核对了什么、哪项证据支撑评分、哪里仍有歧义，以及什么行为才算合格；不把“未通过”直接当成根因。
- **用人工与自动评分的分歧校准评测器。** 原文给出对齐 LLM judge、修正反复漏检的在线 evaluator、将高质量人工标注样本纳入 golden dataset 的路径。更新后的评测仍需在相应交互或后续数据上核对，不能仅凭标签增加就声称 Agent 改善。
- **把核验后的代表性案例变成可复用参照。** 后续 Agent 或提示词变动时，用这些案例做离线比较，而不是每次从零询问专家。如何修复具体失败及选择回归工件，继续由 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation) 维护，不另建一套闭环。

**[推论]** 将此方法迁移到其他工作流时，审查范围应覆盖足以解释该错误的用户目标、会话和工具证据，不等于对每个任务固定安排完整人工审查。人工与 judge 不一致时，先区分 Agent 行为、工具/数据结果与评分标准的问题；专家标注是有适用范围、可能存在分歧的参照，不是无需核验的客观真值。上述方法不要求采用 LangSmith 或默认新增标注平台、人工门禁或自动评测任务。

### 小样本专家标注与大规模自动裁判的统计偏差校正（Rogan–Gladen 与 PPI）

当使用自动裁判对大规模样本（容量 $N$）打分，并辅以小样本专家审查集（容量 $n \ll N$）进行对齐时，不能仅靠反复改写裁判 Prompt 追求表面一致，还应区分**表观裁判通过率**与**经校准的真实通过率**（参见 W. J. Rogan & B. Gladen 1978, *American Journal of Epidemiology* 107(1): 71–76；以及 [*Bias and Uncertainty in LLM-as-a-Judge Estimation*, arXiv:2605.06939](https://arxiv.org/abs/2605.06939)）：

- **未校准表观通过率的固有偏差**：设真实质量标签为 $Z \in \{0, 1\}$（真值通过率为 $\theta = \Pr(Z = 1)$），自动裁判预测为 $\hat{Z} \in \{0, 1\}$。设在小样本专家校准集 $n$ 上测得裁判的**灵敏度（Sensitivity / TPR）**为 $\hat{q}_1 = \Pr(\hat{Z} = 1 \mid Z = 1)$，**特异度（Specificity / TNR）**为 $\hat{q}_0 = \Pr(\hat{Z} = 0 \mid Z = 0)$。则自动裁判在 $N$ 个样本上的原始表观通过率 $\hat{p}_{\text{raw}} = \frac{1}{N}\sum_{j=1}^N \hat{Z}_j$ 的期望值为：
  $$\mathbb{E}[\hat{p}_{\text{raw}}] = \theta \hat{q}_1 + (1 - \theta)(1 - \hat{q}_0)$$
  只要 $\hat{q}_1 < 1$ 或 $\hat{q}_0 < 1$，$\hat{p}_{\text{raw}}$ 就是有偏估计（尤其当真实故障率很低而假阳性 $1 - \hat{q}_0$ 不可忽略时，表观故障率会被严重夸大）。
- **Rogan–Gladen 线性反转偏差校正**：利用校准集估计的 $(\hat{q}_1, \hat{q}_0)$ 对表观通过率做无偏校正：
  $$\hat{\theta}_{\text{RG}} = \text{clip}_{[0, 1]}\!\left(\frac{\hat{p}_{\text{raw}} + \hat{q}_0 - 1}{\hat{q}_1 + \hat{q}_0 - 1}\right), \quad J = \hat{q}_1 + \hat{q}_0 - 1 > 0$$
  其中分母 $J = \hat{q}_1 + \hat{q}_0 - 1$ 为 **Youden 指数（Youden's $J$ statistic）**，度量裁判的信息区分能力。若 $J \le 0$，说明裁判不优于随机抛硬币，必须重修 Rubric；且由于校正方差按 $1 / J^2$ 放大，低区分度裁判会显著拉宽置信区间。
- **预测驱动推断（Prediction-Powered Inference, PPI）**：对于多维连续评分或非二值 Rubric，Anastasios N. Angelopoulos 等（2023, *Science* 382(6671): 669–674, *Prediction-Powered Inference*, [arXiv:2301.09633](https://arxiv.org/abs/2301.09633)）提出的 PPI 框架通过从大规模自动裁判均值中减去小样本配对专家集上的经验偏差整流项（Rectifier），构造渐近无偏估计与有效置信区间：
  $$\hat{\theta}_{\text{PPI}} = \underbrace{\frac{1}{N}\sum_{j=1}^{N} f(X_j)}_{\text{大规模自动裁判均值}} + \underbrace{\frac{1}{n}\sum_{i=1}^{n} \bigl(Y_i - f(X_i)\bigr)}_{\text{小样本专家配对偏差修正项}}$$
  **[推论]** 这为“把有上下文的专家审查转化为可复用评估资产”提供了严格的数学闭环：小样本黄金标注集 $n$ 不仅用于定性启发 Prompt 修改，还可直接量化自动裁判的灵敏度 $\hat{q}_1$、特异度 $\hat{q}_0$ 与经验偏差 $\frac{1}{n}\sum(Y_i - f(X_i))$，防止把裁判漂移误判为 Agent 回归。

### 可执行锁定 Rubric 与上下文动态验证器（Rulers / Agentic Rubrics）

当评分对象从二值/单均值转向多档有序量表、复杂代码仓库或开放式知识推理时，仅靠自由文本 Rubric 提示词与事后均值校正仍面临尺度漂移与上下文失焦两类瓶颈：
- **可执行锁定 Rubric 编译器（Rulers）**：[*Rulers: Locked Rubrics and Evidence-Anchored Scoring for Robust LLM Judging*](https://arxiv.org/abs/2601.08654)（2026-01）将裁判对齐重构为“编译—执行”问题，直接针对三类高发失效——提示词敏感导致的 Rubric 不稳定、缺乏可审计证据的推理，以及与人类分档边界错位的尺度漂移——提出三步收敛方案：将自然语言标准编译为版本化不可变包（Locked Bundle）、强制结构化解码并绑定确定性证据核验、最后施加轻量 **Wasserstein 分布后校准**以对齐人工评分尺度（在不更新模型参数的前提下，补齐了二值 Rogan–Gladen 与均值 PPI 之外的有序分档校准）。
- **上下文感知动态验证器（Agentic Rubrics 与回答门控清单）**：对依赖仓库上下文的软件工程任务，[*Agentic Rubrics as Contextual Verifiers for SWE Agents*](https://arxiv.org/abs/2601.04171)（2026-01）让专家代理先交互式读取代码库，再针对具体问题合成结构化 `rubrics.yaml` 对候选补丁评分重排，弥补静态通用 Rubric 对局部约束不敏感的短板；对开放知识推理任务，[*Exploring RLVR for LLMs in Knowledge-Intensive Domains*](https://arxiv.org/abs/2605.18261)（2026-05）将推理过程拆解为可逐项判定“是/否”的子任务核验清单，并引入**终态答案门控（Answer-Gated Reward）**——仅在最终答案正确时才计入过程推理分，防止模型在错误结论上靠形式流畅套取过程奖励（Reward Hacking）。

**[推论]** 动态生成的上下文 Rubric 仍须继承本页的审计纪律：生成物（如 `rubrics.yaml` 或核验清单）应与被评轨迹一并落盘留证，并抽查清单本身是否遗漏关键约束或过度偏向表面格式，避免把一次性的上下文提取错误伪装成客观评分尺。

## Calibration loop

1. 明确当前改动假设和预期改善的质量维度。
2. 先运行小规模评估，定位发生变化的 Case。
3. 检查分项得分、评语、忠实度结果和 Trace，而不是只看平均分。
4. 审计维度是否重复、冲突或产生错误激励。
5. 将评分锚点改写为真正需要的行为。例如，与其奖励来源数量，不如奖励“具名、相关、可验证，并绑定具体论断”的来源。
6. 用同一批 Case 重跑并与已接受基线比较，确认分数和评语对齐后，再决定合并、迭代或回滚。

## Evidence boundary

Similarweb 案例来自单一内部工作流，文章没有公开 Benchmark 数据集、统计不确定性、跨模型对照实验或可泛化的权重配置。因此应保留“评测器本身需要校准”的方法论，不把 Similarweb 的具体 Rubric、分数锚点或 LangSmith 产品依赖直接设为 AI Agent 默认规则。

Human insight 文章是围绕 LangSmith 功能和一个客户案例的厂商方法说明，没有提供人工审查成本、效果提升或专家一致性的量化对照；它支持上述方法线索，不足以证明人工审查必然优于自动评估、已提升通过率或在所有业务中划算。

Machine Learning Mastery 的文章是方法教程，未给出自身系统性对照实验或完整可运行评测实现。其“标注 30–50 条”“Cohen’s kappa 约 0.6 以上”等数值仅作来源特定起步参考，不是覆盖充分、裁判可靠或允许发布的通用门槛；还需检查类别覆盖、误放过与误拦截及统计不确定性。文章涉及的 QAG、G-Eval 仅作延伸阅读，本页不据此定义统一算法或声称多次评分平均与原论文实现等价；具体实现须另核一手论文与接口能力。

本次新增的三篇 2026 年 arXiv 预印本——Rulers（[arXiv:2601.08654](https://arxiv.org/abs/2601.08654)）、Agentic Rubrics（[arXiv:2601.04171](https://arxiv.org/abs/2601.04171)）与知识密集型清单验证（[arXiv:2605.18261](https://arxiv.org/abs/2605.18261)）——于 2026-11-23 核对公开摘要与方法章节，未在本地复跑代码；其架构机制作为 Rubric 设计与校准范式参考，不直接设定全局默认评测框架。

## AI Agent mapping

- Wiki：本页保存评测尺失准的概念、诊断信号和校准步骤。
- Project/evaluator：只有真实评测出现分数与证据冲突时，才在所属项目按原 Case 加一个相邻反向 Case 做有界校准。
- Active workflow：本页不授权修改 AI Agent skills、memory、runtime、cron、MCP、gateway、wrapper 或 provider 路由。

## Relations

- refines: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- depends_on: [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation)

