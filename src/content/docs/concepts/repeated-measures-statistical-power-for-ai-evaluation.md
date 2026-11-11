---
title: 少样本 AI 评测中的重复任务、伪重复与统计功效
created: 2026-08-09
updated: 2026-11-11
type: concept
tags:
  - agent
  - evaluation
  - validation
  - research
sources:
  - raw/articles/towardsdatascience-statistical-power-more-problems-2026-08-04.md
  - https://en.wikipedia.org/wiki/Pseudoreplication
  - https://en.wikipedia.org/wiki/Design_effect
  - https://acs.ist.psu.edu/papers/clark73.pdf
  - https://arxiv.org/abs/2411.00640
status: stable
description: 结合 Hurlbert 伪重复、Kish 设计效应（DEFF）、Clark 语言固定效应谬误（min F'）与 Miller
  聚类标准误，区分参与主体数、任务数与有效独立样本量。
aliases:
  - repeated-measures-power
  - pseudo-replication-in-ai-evaluation
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# 少样本 AI 评测中的重复任务、伪重复与统计功效

## Summary

在 AI、Agent 或人机交互评测中，增加任务数量不等于增加同等数量的独立样本。被试间设计仍受主体基线差异限制；被试内设计让同一主体跨条件比较，可以抵消部分主体噪声，但同一主体和相似任务产生的观测彼此相关，必须显式建模，不能把它们当成独立样本堆高置信度。

这页基于 [towardsdatascience-statistical-power-more-problems-2026-08-04](https://github.com/on195594/wiki/blob/de3629683a9a95dfdb0601b614fcee7d7812aa4a/raw/articles/towardsdatascience-statistical-power-more-problems-2026-08-04.md) 补充 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 的实验设计与统计功效层，也与 [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification) 关于“任务数量不等于评测多样性”的边界相连。

## 核心问题：更多数据点是否真的增加证据

设有 `N` 个参与主体，每个主体完成 `M` 个任务。表面观测数是 `N × M`，但有效证据量取决于这些观测共享多少主体、任务和条件结构。

- 同一主体的多次结果共享能力、经验、疲劳等基线因素。
- 同一任务或同一模板生成的题目共享难度与结构。
- 主体可能对不同条件反应不同，任务也可能与条件发生交互。
- 因而 `N × M` 个观测通常不是 `N × M` 个独立样本。

把相关观测直接当成独立样本属于伪重复，会低估不确定性，并可能虚高显著性或统计功效。

### 伪重复、设计效应（DEFF）与有效样本量渐近上限

Stuart H. Hurlbert（1984, *Ecological Monographs* 54(2): 187–211, *Pseudoreplication and the Design of Ecological Field Experiments*, [Pseudoreplication](https://en.wikipedia.org/wiki/Pseudoreplication)）将把同一实验单元内的多次子抽样或重复测量误作独立处理复制的统计错误定义为**伪重复（Pseudoreplication）**，并区分为简单伪重复（每条件仅一个独立单元）、牺牲性伪重复（将多单元数据混池并按单元内方差检验处理效应）、时间伪重复（同一单元随时间的自相关测量）与隐式伪重复（仅在单单元内部估计置信区间）。

结合 Leslie Kish（1965, *Survey Sampling*, [Design effect](https://en.wikipedia.org/wiki/Design_effect)）的聚类抽样理论，设有 $N$ 个独立实验单元（如独立被试、独立模型配置或互不重叠的任务簇），每个单元产生 $m$ 次重复或同模板观测，单元内观测的**组内相关系数（Intraclass Correlation Coefficient, ICC）**为 $\rho = \frac{\sigma_{\text{between}}^2}{\sigma_{\text{between}}^2 + \sigma_{\text{within}}^2} \in [0, 1]$。此时样本均值方差相对于同等规模简单随机抽样（SRS）的膨胀倍数即**设计效应（Design Effect, $\text{DEFF}$）**：

$$\text{DEFF} = 1 + (m - 1)\rho, \quad \text{Deft} = \sqrt{\text{DEFF}}$$

对应的**有效独立样本量（Effective Sample Size, $N_{\text{eff}}$）**为：

$$N_{\text{eff}} = \frac{N \cdot m}{\text{DEFF}} = \frac{N \cdot m}{1 + (m - 1)\rho}$$

- 当 $\rho = 0$（单元内观测完全独立）时，$\text{DEFF} = 1$，$N_{\text{eff}} = N \cdot m$。
- 当 $\rho = 1$（同一单元或同一题干改写模板的观测完全共线）时，$\text{DEFF} = m$，$N_{\text{eff}} = N$，增加 $m$ 不产生任何新信息。
- 当 $0 < \rho \le 1$ 且无限增加每个单元内的题目数或重跑次数 $m \to \infty$ 时，有效样本量受严格渐近上界约束：

$$\lim_{m \to \infty} N_{\text{eff}} = \frac{N}{\rho}$$

该上界从数学上解释了为何在被试间设计或高相似度的 LLM 模板扩题中，忽略 $\text{DEFF}$ 直接按 $N \cdot m$ 计算 $p$ 值会使标准误被低估 $\sqrt{1 + (m - 1)\rho}$ 倍，且单纯增加 $m$ 永远无法突破 $N / \rho$ 的信息天花板。

## 被试间设计：多做任务不能消除主体差异

在被试间设计中，不同主体只进入一个条件。增加每人的任务数可以更准确地估计该主体能力和任务难度，却不能排除两个条件恰好招募到不同能力主体的可能性。

因此，当主体数量较少且主体差异较大时，单纯增加任务通常只能有限改善条件效应的识别。文章中的数学分析与 Monte Carlo 模拟都呈现了这一现象，但其数值只适用于对应模拟参数。

## 被试内设计：重复任务何时能增加功效

在被试内设计中，同一主体完成多个条件，分析关注同一主体跨条件的差异。主体稳定基线可以部分抵消，多任务观测也能提供额外信息。

这种增益成立需要三个条件：

1. 使用多层模型、交叉随机效应或其他合适方法控制重复观测的依赖关系；
2. 任务具有足够多样性，不能只是同一模板的批量改写；
3. 顺序、学习、疲劳和条件污染得到平衡、建模或明确披露。

即使条件满足，增加任务的收益通常也会递减；不能用更多任务无限替代更多主体。

### 语言固定效应谬误、交叉随机效应与 Clark's $\min F'$

Herbert H. Clark（1973, *Journal of Verbal Learning and Verbal Behavior* 12(4): 335–359, *The Language-as-Fixed-Effect Fallacy*, [Clark 1973 PDF](https://acs.ist.psu.edu/papers/clark73.pdf)）证明：在心理语言学与提示词/任务评测中，如果只把被试（或模型运行）视为随机效应（计算 $F_1$），而把所选的语言材料、Prompt 或评测题目视为固定效应（Fixed Effect），一旦题目与条件之间存在真实交互变异（$\sigma_{\text{item}\times\text{cond}}^2 > 0$），随着被试或重复运行数增加，第一类错误率（False Positive Rate）将逼近 $1.0$，结论无法外推到未见的新题目。

为同时向“被试/配置总体”与“任务/题目总体”外推，完整线性混合效应模型（Linear Mixed-Effects Model）需将主体 $u_i \sim \mathcal{N}(0, \sigma_u^2)$ 与任务 $v_j \sim \mathcal{N}(0, \sigma_v^2)$ 建模为**交叉随机效应（Crossed Random Effects）**：

$$Y_{ijk} = \mu + \alpha_k + u_i + v_j + (\alpha u)_{ik} + (\alpha v)_{jk} + \varepsilon_{ijk}$$

在不便直接拟合混合效应模型的场景下，Clark 提出结合按主体聚合的方差比 $F_1$ 与按题目聚合的方差比 $F_2$，计算准 $F$ 统计量的保守下界 $\min F'$：

$$\min F' = \frac{F_1 \cdot F_2}{F_1 + F_2} \le F'$$

其对应的 Satterthwaite 近似分母自由度为 $df_{\text{denom}} = \text{round}\!\left(\frac{(F_1 + F_2)^2}{\frac{F_1^2}{df_2} + \frac{F_2^2}{df_1}}\right)$。只要 $F_1$ 或 $F_2$ 任一维度缺乏统计把握（例如题目数 $M$ 极少且题目间差异巨大导致 $F_2$ 很小），$\min F'$ 就会自动压低显著性，防止把仅在个别特定题目上成立的偶然优势误判为普遍系统收益。

## 对 AI 与 Agent 评测的映射

以下是对 AI Agent/AI 评测的本地映射，均为 `[推论]`：

- 比较两个模型、Prompt、Agent harness 或工具策略时，如果同一批任务都由两个条件执行，优先考虑配对或被试内比较，而不是把两组结果当成互不相关。
- 同一模型在同一任务上的多次运行可用于估计随机性，但不能自动当成更多独立任务。
- 由 LLM 按模板扩增出的题目应按任务簇或子量表处理；在证明多样性前，不应按题目数量等比例增加置信度。
- 评测记录至少应区分主体/模型配置、任务或任务簇、条件、运行次数和顺序，才能判断适合的统计单元。
- 与 [agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration)、[production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines) 及 [agent-self-validation-loops](/concepts/agent-self-validation-loops) 配合使用：先确认评分尺稳定与单任务自验证边界清晰，再对照生产延迟/成本基线讨论样本结构和功效；错误的 Rubric 不会因样本增多而自动变正确。

### LLM 与 Agent 基准评测的聚类标准误与配对差值方差（Evan Miller 2024）

Anthropic 研究者 Evan Miller（2024, *Adding Error Bars to Evals: A Statistical Approach to Language Model Evaluations*, [arXiv:2411.00640](https://arxiv.org/abs/2411.00640)）针对语言模型与 Agent 基准评测给出了以下三项核心统计规范：

1. **区分题间方差与题内重采样方差**：设评测集包含 $M$ 道独立题目，每道题通过采样（如思维链 CoT 或多轮工具轨迹）独立运行 $K$ 次，第 $i$ 题观测得分为 $\bar{y}_i = \frac{1}{K}\sum_{k=1}^K y_{ik}$。总体平均分 $\bar{y}$ 的方差由题间真实异质性 $\sigma_{\text{between}}^2$ 与题内采样噪声 $\sigma_{\text{within}}^2$ 共同决定：
   $$\text{SE}_{\text{eval}}(\bar{y}) = \sqrt{\frac{s_{\text{between}}^2}{M} + \frac{s_{\text{within}}^2}{M \cdot K}}$$
   增加每题重跑次数 $K$ 只能压缩第二项（题内随机采样方差），无法减小第一项 $\frac{s_{\text{between}}^2}{M}$；基准题目数 $M$ 决定了跨题泛化精度的硬下限。
2. **同源题目簇须使用聚类标准误（Clustered Standard Errors）**：当基准中包含来自同一长文档、同一代码仓库或同一母题模板的多道子题（设共有 $C$ 个簇，第 $c$ 簇有 $m_c$ 题）时，应按簇级残差和计算 Liang–Zeger 聚类稳健方差 $\widehat{\text{Var}}_{\text{cluster}}(\hat{\mu}) = \frac{C}{C - 1}\frac{\sum_{c=1}^C \left(\sum_{j=1}^{m_c}(y_{cj} - \hat{\mu})\right)^2}{\left(\sum_{c=1}^C m_c\right)^2}$，而不能使用假设题目 i.i.d. 的二项标准误 $\sqrt{\hat{p}(1-\hat{p})/N_{\text{total}}}$。
3. **跨模型/Harness 比较优先采用配对分析（Paired Analysis）**：当两个模型或 Agent 架构 $A$、$B$ 在完全相同的 $M$ 道题目上评测时，各题难度基线高度正相关（$\text{Cov}(\hat{p}_A, \hat{p}_B) > 0$）。按题级差值 $d_i = \bar{y}_{i,A} - \bar{y}_{i,B}$ 计算配对标准误：
   $$\text{SE}(\hat{\Delta}_{A - B}) = \sqrt{\text{SE}(\hat{p}_A)^2 + \text{SE}(\hat{p}_B)^2 - 2\,\text{Cov}(\hat{p}_A, \hat{p}_B)} = \sqrt{\frac{s_d^2}{M}}$$
   （对 $K=1$ 的二值通过/失败结果可直接对不一致对 $(n_{10}, n_{01})$ 执行配对 McNemar 检验），相比非配对双样本检验可大幅削减题目难度噪声并提升统计功效。

## 最小设计检查

在设计小样本评测时先回答：

- 真正独立的实验单位是什么：人、团队、模型配置、会话，还是任务簇？
- 重复运行共享了哪些主体、任务、Prompt、上下文或环境状态？
- 条件是否由同一单位跨条件完成，能否进行配对比较？
- 任务之间是否足够不同，还是同一模板的近重复？
- 是否存在顺序、学习、污染、疲劳或缓存效应？
- 统计方法是否与主体 × 任务 × 条件结构一致？

## PIPS 的适用边界

原文提供 PIPS（Project Impossible Power Simulation）作为直觉工具和功效分析起点。它允许调整主体数、任务数、效应量、信度及主体/任务与条件的交互变异。

PIPS 没有同行评审或独立验证，浏览器实现使用 Clark's min F' 近似而非完整混合效应模型。它适合探索参数敏感性、形成试点假设和理解权衡，不适合直接生成 AI Agent 的固定样本量标准。

`[推论]` 高风险研究应由合格统计人员审查设计与模型。

## Evidence boundary

- 主要证据是一篇作者实践文章和其开源模拟器，不是系统综述或经过独立复现的研究。
- 文中 `N=32、M=16` 等结果来自默认模拟配置，不能外推为通用阈值。
- 文章没有验证 PIPS 对真实 AI/Agent 基准的预测准确性。
- 本页不授权修改 AI Agent skill、评测门禁、runtime、cron、MCP、memory 或默认工作流。

## Relations

- refines: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- depends_on: [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- related: [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification), [agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration), [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)

