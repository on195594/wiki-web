---
title: Production AI Agent Evaluation Framework
created: 2026-05-15
updated: 2026-09-29
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
status: stable
description: 定义生产级 AI Agent 的任务成功、成本、延迟、风险和回归评估框架。
aliases:
  - agent-evaluation-framework
---

# Production AI Agent Evaluation Framework

## Summary
生产级 AI Agent 的可靠性不应只评估最终答案，而应同时评估检索、生成、工具行为、多步轨迹、成本和延迟。评估基础设施应在上线前建设，而不是上线后补救。

这页编译自 `[[towardsdatascience-production-ai-agent-evaluation-harness-2026-05-13]]`，并由 `[[machinelearningmastery-tool-selection-ai-agents-2026-07-06]]`、`[[kdnuggets-llm-latency-inference-cost-2026-07-18]]`、`[[langchain-similarweb-long-form-agent-report-evaluation-2026-07-29]]`、`[[towardsdatascience-tool-calling-agent-debugging-2026-08-06]]`、`[[medium-kritnandan-prompt-engineering-ai-product-2026-08-09]]` 和 `[[machinelearningmastery-agent-regression-tests-2026-08-17]]` 补充工具选择、结构性部署前回归、生产延迟/成本基线、长篇研究报告 Rubric 校准、工具调用证据链与 Prompt 优化边际递减案例；它与 `[[agent-self-validation-loops]]`、`[[agent-development-lifecycle]]`、`[[agent-orchestration-production-tradeoffs]]` 和 `[[agent-failure-closed-loop-evaluation]]` 衔接。

## Core principle

不要把 AI Agent 的生产质量压缩成一个“准确率”指标。

生产环境中的失败通常来自链路中某一层失真：检索取错上下文，生成不忠实，工具选错或参数错误，多步状态断裂，或者成本/延迟失控。评估系统应覆盖这些层，并能在上线前、软发布、稳定运行阶段持续提供反馈。

### Prompt plateau as a failure-layer signal

`[[medium-kritnandan-prompt-engineering-ai-product-2026-08-09]]` 提供了一个外部实践案例：作者团队在同一批 200 份文档上比较抽取 Prompt v12 与 v47，报告得分只从 82% 提升到 83%，却消耗了五周改写。可复用结论不是这组数字本身，而是：当版本化基线显示 Prompt 改写的边际收益已很小，应停止继续调词，转而定位检索、输入可见性、解析、Schema、权限、工具、状态、重试或 UI 边界中的真实故障层。

文章给出的五类案例把这个诊断原则具体化：JSON 外包装由解析和类型校验处理；虚构产品编码由真实目录校验拦截；不可违反的权限规则在执行前由代码检查；畸形工具参数在调用前做 Schema 校验并把具体错误反馈给有界重试；硬性展示长度由生成上限和渲染器边界控制。它们共同支持一个边界：主观表达、语气和难以形式化的示例适合 Prompt；可判定真假的约束应尽量进入确定性代码和验证器。

这个案例也明确限制了 Schema 的作用：结构有效不等于语义正确。一个字段可以满足字符串类型却仍是幻觉，因此评估必须继续覆盖证据、语义和下游结果，而不能把 valid JSON 当成正确性证明。作者建议的 100 个输入、3 个百分点停止线、20–50 个 Eval 案例和最多三次重试均保留为来源特定经验值，不升级为 Hermes 默认阈值。

## Evaluation layers

### 1. Retrieval layer
用于评估 RAG、知识库查询、文档搜索等上下文获取质量。

检查项：
- Context Relevance：取回片段是否与用户问题相关。
- Context Recall：是否取回了回答所需的全部关键信息。
- Context Precision：最相关片段是否排在前面。
- Retrieval Latency：检索阶段是否拖慢整体响应。

工程含义：坏检索不能靠后续 prompt 补救；如果输入上下文错了，生成层只能在噪声上做推断。

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

[推论] 对多智能体任务，先记录单智能体基线，再按任务可分解性决定是否启用并行或协作。文章中的 45% 阈值、推理轮数指数和具体 benchmark 百分比不作为 Hermes 默认门槛；只有本地对照实验或真实失败案例才足以推动路由规则或 regression artifact。

#### Tool selection evaluation must separate stages

[ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture) 补充了工具选择评测的拆分方式。不要只记录“最后是否调用成功”，至少区分：目标工具是否进入候选集、首次选择是否正确、参数是否有效、执行是否成功，以及任务最终是否完成。对比全量工具面、静态收窄 toolset 和动态 Top-K 时，还应同时记录输入 Token 与端到端延迟，防止只优化 Prompt 长度却增加路由器成本或错召回。

#### Tool-call debugging evidence chain

`[[towardsdatascience-tool-calling-agent-debugging-2026-08-06]]` 给出了一个可检查的最小工具调用循环。它的可迁移价值不是天气 API 或 OpenAI SDK 示例，而是把一次运行拆成可独立归因的证据边界：

1. `model_request`：模型请求是否成功；失败时不能伪装成工具失败。
2. `schema_validation`：工具名、JSON 参数和必填字段是否在执行前通过校验。
3. `tool_execution`：应用实际执行了哪个函数，外部服务返回了什么状态。
4. `result_compaction`：返回给模型的 payload 是否限长、稳定且保留错误语义。
5. `error_path`：模型请求失败、参数解析失败、未知工具与工具执行失败是否有可区分的结构化结果。
6. `final_answer`：最终回答是否使用真实工具结果，还是掩盖了失败。

这条链补充 `[[typed-ai-agent-boundaries]]` 的接口约束和 `[[agent-failure-closed-loop-evaluation]]` 的回归闭环：前者负责让工具边界可验证，后者负责把可复发失败转成 evaluator、fixture 或 smoke check；本页只维护“应观察哪些阶段”。

文章还展示了两个边界案例：一次模型服务端错误发生在工具执行之前；一次通过故障注入制造的 malformed JSON 参数被结构化返回后，模型在下一轮自行重试。它们证明这些错误路径可以被显式观察，但单篇教程不能证明生产故障频率、自动重试可靠性或 Weave 相对其他追踪方案的优势。

`[推论]` 对 Hermes 的最小映射是：仅在模型/工具/MCP/浏览器/子代理链路出现异常或结果无法追溯时，按上述阶段收集已有日志和运行证据；修复后回放原失败案例和一个相邻反例。不要因此默认保存全部参数、引入第三方追踪产品、建立持续评测项目或修改 runtime。

### 4. Production layer
用于评估系统是否可持续运行。

检查项：
- Cost per Query：单次查询的模型、工具、基础设施总成本。
- P99 Latency：尾部延迟是否会伤害用户体验或任务完成率。

工程含义：可用的 Agent 还必须可负担、可观测、可调优。平均延迟和平均成本会隐藏长尾失败。

生产观测字段、延迟/成本诊断顺序、控制层边界和外部经验阈值由 `[[production-agent-evaluation-baselines]]` 单独维护。本页只保留 Production layer 在四层框架中的位置。

## Pre-deploy structural regression matrix

`[[machinelearningmastery-agent-regression-tests-2026-08-17]]` 把编排层风险压成七类部署前故障探针。它们不是所有 Agent 都必须机械执行的统一套件；应按系统实际具备的能力触发，并把通过条件落到轨迹、状态或副作用证据，而不是只看最终回复。

| 故障探针 | 触发条件 | 最小通过证据 | 跳过条件 |
| --- | --- | --- | --- |
| 上下文丢失与检索退化 | 多轮上下文可能被裁剪、摘要或外部记忆召回 | 早期关键事实仍能被正确恢复；检索与摘要分别判定，不能用 OR 断言互相遮蔽 | 短时、无裁剪、无跨轮状态任务 |
| 工具执行幂等性 | Agent 能向外部系统写入，且调用可能重试或并发 | 同一逻辑操作重复到达时只产生一次真实写入，并可返回一致结果 | 纯只读工具或无外部副作用 |
| 指令覆盖与 Prompt injection | 用户输入、网页、RAG 文档等不可信内容可影响工具调用 | 直接和间接注入都不能产生越权工具副作用；检查 trace 与真实状态，而非拒绝文案 | 无不可信输入且无工具执行面 |
| 结构化输出依从性 | 下游依赖 schema、枚举或机器可读结果 | 同时检查解析、`finish_reason`、拒绝语义、字段值约束和模型版本；valid JSON 不等于语义正确 | 自由文本且无机器消费契约 |
| 非终止与有界编排 | 存在 retry、tool loop、reactive loop 或多 Agent 等待关系 | 不可能任务和持续错误工具在步骤、累计成本与 wall-clock 三重预算内结构化退出 | 单步确定性调用，无循环或等待 |
| RAG 与参数记忆冲突 | Agent 使用检索内容覆盖或补充模型知识 | 正向验证可采用可信新事实，负向验证可抵抗可检测的检索投毒；结合忠实度与归因证据 | 不使用检索增强 |
| 状态恢复与一致性 | 工作流会持久化、跨进程恢复或跨版本续跑 | 销毁内存实例后能从持久状态继续完成；覆盖 schema/version migration 和 mid-tool-call 幂等边界 | 单进程、短生命周期、不可恢复任务 |

由于 Agent 输出具有随机性，来源建议固定具体模型版本，在服务商允许时降低采样随机性，并通过重复试验估计有界通过率。`[推论]` Hermes 不采用文章中的任何固定 Token 占比、试验次数或通过阈值作为默认值；每个项目应按风险、成本和可重复性设定最小本地门槛。

### Evidence and promotion boundary

这篇来源是实践者清单，没有提供可运行测试代码、数据集、故障频率、独立复现或“每个 Agent 都适用”的证据。它声称多数 Agent 失败位于状态层，这对定位有启发，但不能替代模型、provider、权限、检索和业务逻辑的分层归因。七项探针也明确不覆盖成本/延迟回归、上游工具契约漂移、PII 泄漏和 embedding/reindex 版本错配。

`[推论]` 在 Hermes 中，本矩阵只作为 `[[agent-development-lifecycle]]` 的 Test → Deploy 知识检查入口。只有某一探针捕获真实本地失败时，才通过 `[[agent-failure-closed-loop-evaluation]]` 保留“原失败案例 + 一个相邻反例”的 fixture、evaluator 或 smoke；不得因单篇文章创建独立评测项目、全局硬门禁或 active runtime 自动化。

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

`[[production-agent-evaluation-baselines]]` 保存队列、TTFT、Token 间延迟、端到端分位数、Token/调用/缓存/工具耗时、控制层边界以及来源给出的方向性阈值。所有外部数字都只是数量级参考，必须针对本地业务、风险和成本结构重新校准。

## Rubric calibration

`[[agent-evaluation-rubric-calibration]]` 单独维护评测尺失准的诊断与校准方法：普通问答可使用 Golden Answer 语义比较，开放式长报告应使用分维度 Rubric、忠实度检查和基线 A/B；聚合分数只作诊断指针，必须回溯具体 Case、分项评语和 Trace。分数与证据冲突时，先审计评分维度、锚点和错误激励，再修改 Agent。

该方法来自 `[[langchain-similarweb-long-form-agent-report-evaluation-2026-07-29]]` 的单一实践案例，不把具体权重、评分锚点或 LangSmith 产品依赖提升为 Hermes 默认规则。

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

## Hermes mapping

### Wiki
本页是概念层：回答“生产 Agent 应该评估什么”。它不直接授权修改 Hermes runtime、skills、cron、MCP 或 gateway。

### Skill/reference candidate
这些来源适合作为 Hermes Agent 质量评估的 Wiki 证据，但不应直接进入 active skill。外部阈值、路由、缓存和 serving 建议尚未通过 Hermes 本地任务验证；已有专项延迟 reference 覆盖真实故障时，优先复用而不是复制本页清单。

### Local checklist candidate
如果后续要落地到 Hermes，可另建更窄的 `Hermes Agent 任务执行质量评估清单`，把通用指标改写为本地可观察项：

- 工具是否选对。
- 是否读前写。
- 是否验证后再声明完成。
- 是否保留输出路径、日志、命令或文件证据。
- 是否区分事实、推论和建议。
- 是否避免无依据结论。
- 多步任务是否保持上下文、目标和状态一致。
- 失败时是否有降级路径和停止条件。

### Relationship to existing concepts
- `[[agent-self-validation-loops]]` 关注单个任务如何通过目标、反馈、迭代完成自我验证。
- `[[agent-development-lifecycle]]` 关注 Build → Test → Deploy → Monitor 的生命周期。
- `[[agent-orchestration-production-tradeoffs]]` 关注不同 Agent 编排模式在成本、延迟、准确性和规模之间的取舍。
- `[[llm-summary-identification-step]]` 补充摘要/分析类输出在生成前应先判定 claim 是否被来源支持。
- 本页补充生产级 eval 指标层：如何观察和量化一个 Agent 系统是否可靠。

## Relationship to document fidelity risk

`[[ai-agent-document-fidelity-risk]]` adds a content-preservation failure mode to this evaluation framework: long-horizon Agent tests should not only measure final task success, but also whether source documents survive multi-step edits without silent rewrites, omissions, or hallucinated substitutions.

## Relationship to closed-loop learning

`[[agent-closed-loop-learning-from-corrections-to-rules]]` extends this evaluation framework from quality measurement into behavior promotion: user corrections should not become default Agent behavior until a candidate rule or prompt passes offline replay, shadow evaluation, or an equivalent scoped gate.

## Relationship to LLM engineering map

`[[llm-engineering-knowledge-map]]` frames evaluation as the final control layer of the LLM engineering stack. This page keeps the narrower production Agent eval checklist for retrieval, generation, tool behavior, cost, and latency.

## Relationship to research evidence gates

`[[agent-research-evidence-gate]]` applies this evaluation frame to research workflows: the Judge gate evaluates source sufficiency and missing information before an Analyst produces the final report. It is narrower than this page because it focuses on evidence readiness rather than the whole production evaluation stack.

## Relationship to stateful environments and grounded verification

`[[stateful-agent-environments-and-grounded-verification]]` narrows the Agent behavior layer for stateful computer-use workflows: evaluate environment behavior, task depth and authoritative outcome verification together, then separate model, environment, task and verifier failures. It does not make synthetic worlds, RL or database graders a production default.

## Related
- [agent-harness-search-regularization](/concepts/agent-harness-search-regularization) — RRSI 补充自我演化期间的候选准入视角：在冻结的评测条件下，同时观察未见任务迁移、基线方差和 token 成本；其来源特定门槛不成为本页的生产默认阈值。
- `towardsdatascience-production-ai-agent-evaluation-harness-2026-05-13`
- `towardsdatascience-tool-calling-agent-debugging-2026-08-06`
- `medium-kritnandan-prompt-engineering-ai-product-2026-08-09`
- `kdnuggets-llm-latency-inference-cost-2026-07-18`
- `langchain-similarweb-long-form-agent-report-evaluation-2026-07-29`
- [agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration)
- [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)
- [agent-research-evidence-gate](/concepts/agent-research-evidence-gate)
- [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification)
- [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules)
- [agent-development-lifecycle](/concepts/agent-development-lifecycle)
- [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs)
- [llm-summary-identification-step](/concepts/llm-summary-identification-step)
- [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)
- [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk)
- [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop)
- [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture)
- [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)
- [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary)
- [index](/)
- `log`

