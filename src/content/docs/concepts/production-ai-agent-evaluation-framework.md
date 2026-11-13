---
title: Production AI Agent Evaluation Framework
created: 2026-05-15
updated: 2026-11-11
type: concept
tags:
  - agent
  - evaluation
  - validation
  - monitoring
  - harness
  - workflow
sources:
  - raw/articles/towardsdatascience-production-ai-agent-evaluation-harness-2026-05-13.md
  - raw/articles/machinelearningmastery-tool-selection-ai-agents-2026-07-06.md
  - raw/articles/kdnuggets-llm-latency-inference-cost-2026-07-18.md
  - raw/articles/langchain-similarweb-long-form-agent-report-evaluation-2026-07-29.md
  - raw/articles/towardsdatascience-tool-calling-agent-debugging-2026-08-06.md
  - raw/articles/medium-kritnandan-prompt-engineering-ai-product-2026-08-09.md
  - raw/articles/machinelearningmastery-agent-regression-tests-2026-08-17.md
  - raw/articles/nature-capable-language-models-can-outgrow-the-benefits-of-collaboration-2026.md
  - raw/articles/rrsi-harness-search-regularization-2026-09.md
  - raw/articles/motherduck-jev-analytics-use-cases-2026-10-06.md
  - raw/articles/nature-rag-multi-agent-structural-health-monitoring-2026-10-15.md
  - raw/articles/langchain-agent-memory-openwiki-graphs-2026-10-28.md
status: stable
description: 定义生产级 AI Agent 的检索、生成、行为与运营四层评估框架，含 N_eff / J_judge / Δ_NI /
  C_amort 参数化评估与发布门禁裁决矩阵；工具轨迹六步调试与结构回归探针见子页。
aliases:
  - agent-evaluation-framework
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Production AI Agent Evaluation Framework

## Summary
生产级 AI Agent 的可靠性不应只评估最终答案，而应同时评估检索、生成、工具行为、多步轨迹、成本和延迟。评估基础设施应在上线前建设，而不是上线后补救。

这页编译自 [towardsdatascience-production-ai-agent-evaluation-harness-2026-05-13](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/towardsdatascience-production-ai-agent-evaluation-harness-2026-05-13.md)，并由 [machinelearningmastery-tool-selection-ai-agents-2026-07-06](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/machinelearningmastery-tool-selection-ai-agents-2026-07-06.md)、[kdnuggets-llm-latency-inference-cost-2026-07-18](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/kdnuggets-llm-latency-inference-cost-2026-07-18.md)、[langchain-similarweb-long-form-agent-report-evaluation-2026-07-29](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/langchain-similarweb-long-form-agent-report-evaluation-2026-07-29.md)、[towardsdatascience-tool-calling-agent-debugging-2026-08-06](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/towardsdatascience-tool-calling-agent-debugging-2026-08-06.md)、[medium-kritnandan-prompt-engineering-ai-product-2026-08-09](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/medium-kritnandan-prompt-engineering-ai-product-2026-08-09.md) 和 [machinelearningmastery-agent-regression-tests-2026-08-17](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/machinelearningmastery-agent-regression-tests-2026-08-17.md) 补充工具选择、结构性部署前回归、生产延迟/成本基线、长篇研究报告 Rubric 校准、工具调用证据链与 Prompt 优化边际递减案例；它与 [agent-self-validation-loops](/concepts/agent-self-validation-loops)、[agent-development-lifecycle](/concepts/agent-development-lifecycle)、[agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs) 和 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation) 衔接。

## Core principle

不要把 AI Agent 的生产质量压缩成一个“准确率”指标。

生产环境中的失败通常来自链路中某一层失真：检索取错上下文，生成不忠实，工具选错或参数错误，多步状态断裂，或者成本/延迟失控。评估系统应覆盖这些层，并能在上线前、软发布、稳定运行阶段持续提供反馈。

### Prompt plateau as a failure-layer signal

[medium-kritnandan-prompt-engineering-ai-product-2026-08-09](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/medium-kritnandan-prompt-engineering-ai-product-2026-08-09.md) 提供了一个外部实践案例：作者团队在同一批 200 份文档上比较抽取 Prompt v12 与 v47，报告得分只从 82% 提升到 83%，却消耗了五周改写。可复用结论不是这组数字本身，而是：当版本化基线显示 Prompt 改写的边际收益已很小，应停止继续调词，转而定位检索、输入可见性、解析、Schema、权限、工具、状态、重试或 UI 边界中的真实故障层。

文章给出的五类案例把这个诊断原则具体化：JSON 外包装由解析和类型校验处理；虚构产品编码由真实目录校验拦截；不可违反的权限规则在执行前由代码检查；畸形工具参数在调用前做 Schema 校验并把具体错误反馈给有界重试；硬性展示长度由生成上限和渲染器边界控制。它们共同支持一个边界：主观表达、语气和难以形式化的示例适合 Prompt；可判定真假的约束应尽量进入确定性代码和验证器。

这个案例也明确限制了 Schema 的作用：结构有效不等于语义正确。一个字段可以满足字符串类型却仍是幻觉，因此评估必须继续覆盖证据、语义和下游结果，而不能把 valid JSON 当成正确性证明。作者建议的 100 个输入、3 个百分点停止线、20–50 个 Eval 案例和最多三次重试均保留为来源特定经验值，不升级为 AI Agent 默认阈值。

## Evaluation layers

### 1. Retrieval layer
用于评估 RAG、知识库查询、文档搜索等上下文获取质量。

检查项：
- Context Relevance：取回片段是否与用户问题相关。
- Context Recall：是否取回了回答所需的全部关键信息。
- Context Precision：最相关片段是否排在前面。
- Retrieval Latency：检索阶段是否拖慢整体响应。
- Citation / Evidence Consistency（跨运行引用一致性）：同一问题重复运行多次时，Agent 所引用支撑证据集合的重合度（如 [langchain-agent-memory-openwiki-graphs-2026-10-28](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/langchain-agent-memory-openwiki-graphs-2026-10-28.md) 使用的三次运行引用集合平均成对 Jaccard 相似度）。在跨源复杂问题中，仅靠编译知识可能提高平均准确率但出现引用路径漂移（原文合成保险实验中引用重合度从简单查询的 `0.74` 降至跨文档问题的 `0.25`，引入显式证据图边后翻倍）。该指标衡量取证路径的可重复性与可审计性，不直接等同于答案正确性（详见 [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence) 与 [wiki-cross-source-evidence-navigation-benchmark](/queries/wiki-cross-source-evidence-navigation-benchmark)）。

工程含义：坏检索不能靠后续 prompt 补救；如果输入上下文错了，生成层只能在噪声上做推断。对存在版本替代或条款冲突的多源场景，还应同时观察取证集合是否稳定，避免不同运行因随机命中的证据片段不同而翻转结论。

### 2. Generation layer
用于评估模型最终回答是否可靠、贴题、少幻觉。

检查项：
- Answer Faithfulness：回答中的原子事实是否被上下文支持。
- Answer Relevance：回答是否真正回应了用户问题。
- Hallucination Rate：回答是否编造事实、数字、人名或不存在的依据。

工程含义：高准确率 benchmark 不代表真实流量可靠。真实用户问题会偏离评估集，必须单独看忠实度、相关性和幻觉率。

### 3. Agent behavior layer
用于评估多工具、多步骤、目标导向 Agent 的过程质量。

检查项：
- Tool Selection Accuracy：是否为当前意图选择了正确工具。
- Tool Execution Success：工具调用参数、格式、返回是否成功。
- Multi-Step Coherence：多步执行是否保持逻辑、状态和目标一致。
- Multi-Agent Baseline Delta: 多智能体相对单智能体是否有可验证的增益。
- Coordination Cost: 额外消息、Token、调用、延迟和合并成本是否超过收益。
- Error Correlation: 多个 Agent 是否重复同一种错误，导致“多数意见”被误当成独立证据。

工程含义：Agent 不只会“答题”，还会行动。工具越多、步骤越长，错误可能断崖式增加，因此要单独评估过程轨迹，而不是只看最终输出。

[推论] 对多智能体任务，先记录单智能体基线，再按任务可分解性决定是否启用并行或协作。[nature-capable-language-models-can-outgrow-the-benefits-of-collaboration-2026](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/nature-capable-language-models-can-outgrow-the-benefits-of-collaboration-2026.md) 中的 45% 阈值、推理轮数指数和具体 benchmark 百分比不作为 AI Agent 默认门槛；只有本地对照实验或真实失败案例才足以推动路由规则或 regression artifact。

#### Tool selection evaluation must separate stages

[ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture) 补充了工具选择评测的拆分方式。不要只记录“最后是否调用成功”，至少区分：目标工具是否进入候选集、首次选择是否正确、参数是否有效、执行是否成功，以及任务最终是否完成。对比全量工具面、静态收窄 toolset 和动态 Top-K 时，还应同时记录输入 Token 与端到端延迟，防止只优化 Prompt 长度却增加路由器成本或错召回。

#### Tool-call debugging evidence chain（子页导航）

[towardsdatascience-tool-calling-agent-debugging-2026-08-06](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/towardsdatascience-tool-calling-agent-debugging-2026-08-06.md) 将单次工具调用拆为 `model_request`、`schema_validation`、`tool_execution`、`result_compaction`、`error_path` 和 `final_answer` 六个可独立归因的证据阶段，衔接 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 与 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation)；完整阶段说明、边界案例与排障回放约定已拆入子概念页 [agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging)。

#### Broad scoring, conditional diagnosis

[motherduck-jev-analytics-use-cases-2026-10-06](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/motherduck-jev-analytics-use-cases-2026-10-06.md) 描述一种生产轨迹评估实现：先对各轮评估请求完成度，对有工具调用的轮次评估效率；低分才触发失败模式或主要浪费类型判断，失败工具调用则另做原因分类。精确调用次数、重复调用与额外等待由 SQL 从 spans 计算，模型只承担“是否完成请求”“哪些步骤不必要”等语义判断。

可迁移的是 **广覆盖的低成本评分 → 条件性原因诊断 → 回查原始轨迹**，不是每天运行 Flight、采用 Jev 或复制其评分阈值。效率评分如何排除必要前置、核验与合理重试，由 [agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration) 维护。

**[推论]** 采用低分触发诊断时仍应抽查高分轮次，避免漏掉被 judge 误判为成功的失败；保留评分输入截断与未评分状态，不能把未诊断等同无问题。文章只读取截断后的请求、轨迹和最终答案开头，未证明完整结果与副作用均已核验。

这是厂商第一方案例，未独立复现；文中离线 eval 每模型仅 12 个案例，不足以据此形成可靠模型排名。是否节省总成本或提升故障检出率，仍需目标工作流的人工对照与预算验证，本页不引入自动评测任务或运行时改动。

### 4. Production layer
用于评估系统是否可持续运行。

检查项：
- Cost per Query / Cost per Correct Answer：单次查询或单次正确回答的模型、工具、基础设施成本；若引入编译知识库或索引，还需区分查询期回答成本与离线编译/增量维护成本的摊销边界（[langchain-agent-memory-openwiki-graphs-2026-10-28](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/langchain-agent-memory-openwiki-graphs-2026-10-28.md)）。
- P99 Latency：尾部延迟是否会伤害用户体验或任务完成率。

工程含义：可用的 Agent 还必须可负担、可观测、可调优。平均延迟和平均成本会隐藏长尾失败。

生产观测字段、延迟/成本诊断顺序、控制层边界和外部经验阈值由 [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines) 单独维护。本页只保留 Production layer 在四层框架中的位置。

## 部署前结构回归与 RAG 决策敏感性边界（子页导航）

围绕部署前七类结构回归探针、工具调用六步调试证据链，以及检索上下文引发决策数值变化与质量增益的区分清单，已独立维护于子概念页 [agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging)，核心约束包括：

1. **部署前七类结构回归探针**（[machinelearningmastery-agent-regression-tests-2026-08-17](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/machinelearningmastery-agent-regression-tests-2026-08-17.md)）：按系统能力条件触发上下文丢失与检索退化、工具执行幂等性、指令覆盖与注入、结构化输出依从性、非终止与有界编排、RAG 与参数记忆冲突、状态恢复与一致性七类探针；作为 [agent-development-lifecycle](/concepts/agent-development-lifecycle) 的 Test → Deploy 检查入口，仅在捕获真实本地失败时通过 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation) 固化“原失败案例 + 相邻反例”。
2. **RAG 决策敏感性不等于质量增益**（[nature-rag-multi-agent-structural-health-monitoring-2026-10-15](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/nature-rag-multi-agent-structural-health-monitoring-2026-10-15.md)）：检索上下文导致的风险或得分变化在缺乏独立真实值时只代表输出差异与上下文敏感性，不能冒充准确率提升或安全确认；职责分离与上下文信任边界分别衔接 [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary) 与 [llm-context-engineering-layer](/concepts/llm-context-engineering-layer)。

## Phased implementation

### Phase 1: Pre-launch
优先建设：
- Context Relevance
- Context Recall
- Context Precision
- Answer Faithfulness

目的：上线前先拦截最常见的检索错误和不忠实回答。

### Phase 2: Soft launch
新增：
- Hallucination Rate
- Answer Relevance
- Tool Selection Accuracy

目的：用真实流量暴露评估集覆盖不到的用户意图、幻觉类型和工具选择错误。

### Phase 3: Production stable
新增或强化：
- Cost per Query
- P99 Latency
- Queue time / TTFT / Inter-token latency
- Input/output Token、LLM calls per task、Cache-hit rate
- Tool Execution Success
- Multi-Step Coherence
- Retrieval Latency

目的：优化运行系统，而不是只判断能否上线。

## Production baselines and source thresholds

[production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines) 保存队列、TTFT、Token 间延迟、端到端分位数、Token/调用/缓存/工具耗时、控制层边界以及来源给出的方向性阈值。所有外部数字都只是数量级参考，必须针对本地业务、风险和成本结构重新校准。

## Rubric calibration

[agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration) 单独维护评测尺失准的诊断与校准方法：普通问答可使用 Golden Answer 语义比较，开放式长报告应使用分维度 Rubric、忠实度检查和基线 A/B；聚合分数只作诊断指针，必须回溯具体 Case、分项评语和 Trace。分数与证据冲突时，先审计评分维度、锚点和错误激励，再修改 Agent。

该方法来自 [langchain-similarweb-long-form-agent-report-evaluation-2026-07-29](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/langchain-similarweb-long-form-agent-report-evaluation-2026-07-29.md) 的单一实践案例，不把具体权重、评分锚点或 LangSmith 产品依赖提升为 AI Agent 默认规则。

## [推论] 参数化评估与门禁裁决矩阵（`N_eff / J_judge / Δ_NI / C_amort`）

`[推论]` 为将本页的四层评估框架与子页的统计功效（[repeated-measures-statistical-power-for-ai-evaluation](/concepts/repeated-measures-statistical-power-for-ai-evaluation)）、裁判校准（[agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration)）、生产成本非劣效基线（[production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)）及多轮状态一致性（[stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification)）收束为统一的可核验工程契约，在设计离线基准、在线抽检或模型/Harness 降级试验时，可按以下四参数矩阵逐项核对（不预设跨项目硬编码默认数值）：

| 参数符号 | 评估维度与数学定义 | 门禁裁决条件（Release / Routing Gate） | 违背时的典型退化模式与处置动作 |
| :--- | :--- | :--- | :--- |
| $N_{\text{eff}}$ | **有效独立样本量与聚类配对设计**：<br>$N_{\text{eff}} = \frac{N \cdot m}{1 + (m - 1)\rho} \le \frac{N}{\rho}$；<br>配对差值标准误 $\text{SE}(\hat{\Delta}) = \sqrt{\text{SE}_A^2 + \text{SE}_B^2 - 2\text{Cov}(\hat{p}_A, \hat{p}_B)}$ | 1. 同一模板扩题或同题重跑按簇计算 $\text{DEFF}$ 与聚类标准误；<br>2. 跨条件比较满足交叉随机效应（或 $\min F'$）且优先采用同题配对比较 | **牺牲性/隐式伪重复**：把同题 $K$ 次采样或同模板改写当作独立样本，虚高显著性；应扩充独立任务簇 $N$ 而非堆叠同质重跑 $m$ |
| $J_{\text{judge}}$ | **自动裁判区分度与偏差校准**：<br>Youden 指数 $J = \hat{q}_1 + \hat{q}_0 - 1 > 0$；<br>$\hat{\theta}_{\text{RG}} = \text{clip}_{[0,1]}\!\left(\frac{\hat{p}_{\text{raw}} + \hat{q}_0 - 1}{J}\right)$ 或 $\hat{\theta}_{\text{PPI}}$ | 1. 小样本专家审查集 $n$ 实测 $J > 0$，且成对比较通过正反位置互换一致性检查；<br>2. 报告经 Rogan–Gladen 或 PPI 修正后的正确率及置信区间 | **评测尺失准与奖励黑客**：位置/冗长/自我偏好或低特异度 $\hat{q}_0$ 导致表观分数与人工复核背离；应暂停修改 Agent，先重修 Rubric 锚点 |
| $\Delta_{\text{NI}}$ | **非劣效/等效检验与多轮可靠率**：<br>TOST 下界 $L_{1-2\alpha}(\mu_{\text{new}} - \mu_{\text{base}}) > -\delta_{\text{NI}}$；<br>有状态多轮 $\text{pass}^k = \mathbb{E}[(c_i/n_i)^k]$ | 1. 路由降级或 Prompt 压缩的 $(1-2\alpha)$ 置信区间下限严格高于预设容忍退化界 $-\delta_{\text{NI}}$；<br>2. 工具与数据库终态满足幂等与 $\text{pass}^k$ 连续可靠门槛 | **把未显著误当等价**：小样本 $p > \alpha$ 掩盖真实质量滑坡或长链路复合衰减（$\prod p_t$）；应标记为“未决（Inconclusive）”并阻断自动全量切换 |
| $C_{\text{amort}}$ | **全周期摊销成本与尾部延迟分布**：<br>$C_{\text{amort}} = \frac{\mathbb{E}[C_{\text{query}}] + (C_{\text{compile}} + C_{\text{maint}})/N_{\text{queries}}}{\hat{\theta}_{\text{correct}}}$；<br>监控 $\mathbb{E}[C]$ 与 P50/P95/P99 | 1. 同时披露算术均值 $\mathbb{E}[C]$（含重试/回退长尾）与分位数，不以中位数代替总预算；<br>2. 含编译知识库或 Judge 抽检时计入离线编译与裁判摊销成本 | **长尾预算爆炸与编译倒挂**：中位成本下降但尾部失败重试拉高 $\mathbb{E}[C]$，或低频查询无法摊销离线编译开销；应退回轻量基线或收紧有界重试 |

## What to preserve, what not to preserve

保留：
- 四层评估结构。
- 12 项检查项的定义。
- 阶段化建设路径。
- 队列、TTFT、Token 间、端到端分位数与 Token/调用/缓存组成的生产基线。
- 应用可控层、托管 provider 内部层与自托管 serving 层的边界。
- 经验阈值的数量级参考。
- “离线 eval 防回归，在线 eval 捕捉真实流量漂移”的闭环。
- Prompt 改写收益趋平时先定位系统故障层，并把可确定检查的约束放到代码、Schema、权限门禁或渲染边界。

不保留为核心知识：
- 文章完整摘要。
- 具体阈值的硬编码版本。
- 未经本地验证的路由、缓存、批处理、量化或 serving 优化默认值。
- 工具评价的主观排序。
- “模型是商品，评估是差异化”这类口号。
- 单篇实践文章给出的固定 Eval 数量、分数差、重试次数或 Prompt 文件组织方式。

工具线索可作为延伸阅读：Ragas、TruLens、DeepEval、LangSmith、OpenTelemetry。是否选型应另做项目级验证。

## AI Agent mapping

### Wiki
本页是概念层：回答“生产 Agent 应该评估什么”。它不直接授权修改 AI Agent runtime、skills、cron、MCP 或 gateway。

### Skill/reference candidate
这些来源适合作为 AI Agent 质量评估的 Wiki 证据，但不应直接进入 active skill。外部阈值、路由、缓存和 serving 建议尚未通过 AI Agent 本地任务验证；已有专项延迟 reference 覆盖真实故障时，优先复用而不是复制本页清单。

### Local checklist candidate
如果后续要落地到 AI Agent，可另建更窄的 `AI Agent 任务执行质量评估清单`，把通用指标改写为本地可观察项：

- 工具是否选对。
- 是否读前写。
- 是否验证后再声明完成。
- 是否保留输出路径、日志、命令或文件证据。
- 是否区分事实、推论和建议。
- 是否避免无依据结论。
- 多步任务是否保持上下文、目标和状态一致。
- 失败时是否有降级路径和停止条件。

### Relationship to existing concepts
- [agent-self-validation-loops](/concepts/agent-self-validation-loops) 关注单个任务如何通过目标、反馈、迭代完成自我验证。
- [agent-development-lifecycle](/concepts/agent-development-lifecycle) 关注 Build → Test → Deploy → Monitor 的生命周期。
- [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs) 关注不同 Agent 编排模式在成本、延迟、准确性和规模之间的取舍。
- [llm-summary-identification-step](/concepts/llm-summary-identification-step) 补充摘要/分析类输出在生成前应先判定 claim 是否被来源支持。
- [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk) 补充长程编辑中的内容保真失败模式：测试不仅要看最终任务是否成功，还要核验源文档在多步编辑中是否发生静默改写、遗漏或幻觉替换。
- [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules) 将评测框架从质量测量延伸到行为晋升：用户纠正在通过离线回放、影子评测或等效门禁前，不应直接成为默认 Agent 行为。
- [llm-engineering-knowledge-map](/concepts/llm-engineering-knowledge-map) 将评测定位为 LLM 工程栈的最终控制层；本页保留面向检索、生成、工具行为、成本与延迟的生产级检查清单。
- [agent-research-evidence-gate](/concepts/agent-research-evidence-gate) 将该评测框架应用于研究型工作流：由 Judge 门禁在生成最终报告前先行裁决来源充分性与缺失信息。
- [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification) 收窄有状态计算机操作工作流的行为层：联合评估环境行为、任务深度与权威状态结果，并将模型、环境、任务和验证器失败解耦。
- 本页补充生产级 eval 指标层：如何观察和量化一个 Agent 系统是否可靠。

## Relations

- refines: [llm-engineering-knowledge-map](/concepts/llm-engineering-knowledge-map), [agent-development-lifecycle](/concepts/agent-development-lifecycle)
- depends_on: [agent-self-validation-loops](/concepts/agent-self-validation-loops), [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary)
- related: [agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging), [agent-harness-search-regularization](/concepts/agent-harness-search-regularization), [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence), [wiki-cross-source-evidence-navigation-benchmark](/queries/wiki-cross-source-evidence-navigation-benchmark), [agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration), [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines), [repeated-measures-statistical-power-for-ai-evaluation](/concepts/repeated-measures-statistical-power-for-ai-evaluation), [agent-research-evidence-gate](/concepts/agent-research-evidence-gate), [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification), [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules), [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs), [llm-summary-identification-step](/concepts/llm-summary-identification-step), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk), [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop), [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture), [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles), [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation), [llm-context-engineering-layer](/concepts/llm-context-engineering-layer)

## Related

- [agent-harness-search-regularization](/concepts/agent-harness-search-regularization)（来源见 [rrsi-harness-search-regularization-2026-09](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/rrsi-harness-search-regularization-2026-09.md)）— RRSI 补充自我演化期间的候选准入视角：在冻结的评测条件下，同时观察未见任务迁移、基线方差和 token 成本；其来源特定门槛不成为本页的生产默认阈值。

