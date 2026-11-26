---
title: Agent 部署前结构回归与工具轨迹调试
created: 2026-11-04
updated: 2026-11-26
type: concept
tags:
  - agent
  - mcp
  - evaluation
  - validation
  - debugging
  - harness
  - workflow
  - monitoring
sources:
  - raw/articles/towardsdatascience-tool-calling-agent-debugging-2026-08-06.md
  - raw/articles/machinelearningmastery-agent-regression-tests-2026-08-17.md
  - raw/articles/nature-rag-multi-agent-structural-health-monitoring-2026-10-15.md
  - concepts/production-ai-agent-evaluation-framework.md
  - https://www.w3.org/TR/trace-context/
  - https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/
  - https://arxiv.org/abs/2406.13352
  - https://arxiv.org/abs/2510.09023
  - https://opentelemetry.io/docs/specs/semconv/gen-ai/
  - https://github.com/open-telemetry/semantic-conventions-genai
  - https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md
  - https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md
  - https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/client-inference.md
  - https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/execute-tool.md
  - https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-token-metrics.md
  - https://github.com/open-telemetry/semantic-conventions-genai/blob/main/changelog.d/440.breaking.md
  - https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/mcp.md
  - https://github.com/open-telemetry/semantic-conventions-genai/issues/309
  - https://arxiv.org/abs/2607.16200
  - https://arxiv.org/html/2608.06790v1
  - https://arxiv.org/pdf/2610.32555
  - https://arxiv.org/html/2611.28341v1
  - https://arxiv.org/html/2611.20711v1
  - https://arxiv.org/html/2607.18754v1
  - https://arxiv.org/html/2601.06112v1
status: stable
description: 定义工具调用六步调试证据链、OpenTelemetry GenAI 语义约定与 MCP
  带外追踪契约（T_otel）、部署前确定性零出站回放与 HTTP 200 静默截断混沌探针矩阵，以及检索上下文敏感性评估边界。
aliases:
  - agent-pre-deploy-regression
  - tool-call-trace-debugging
volatility: medium
verified_at: 2026-11-04
review_by: 2027-03-02
---

# Agent 部署前结构回归与工具轨迹调试

## Summary

本页是 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 的子主题，聚焦部署前与异常排障阶段的**可归因证据检查**：把单次工具调用拆成六步可独立定位的调试证据链（[towardsdatascience-tool-calling-agent-debugging-2026-08-06](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/towardsdatascience-tool-calling-agent-debugging-2026-08-06.md)），对齐 [OpenTelemetry GenAI 语义约定](https://github.com/open-telemetry/semantic-conventions-genai)的跨进程/MCP 带外追踪与隐私载荷门禁（`T_otel`），把编排层风险压成区分确定性零出站回放与 HTTP 200 静默截断混沌探针的结构回归矩阵（[machinelearningmastery-agent-regression-tests-2026-08-17](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/machinelearningmastery-agent-regression-tests-2026-08-17.md)），并区分检索上下文引发的决策数值变化与有独立真实值支持的质量增益（[nature-rag-multi-agent-structural-health-monitoring-2026-10-15](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/nature-rag-multi-agent-structural-health-monitoring-2026-10-15.md)）。

## 1. 工具调用六步调试证据链

[towardsdatascience-tool-calling-agent-debugging-2026-08-06](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/towardsdatascience-tool-calling-agent-debugging-2026-08-06.md) 给出了一个可检查的最小工具调用循环。它的可迁移价值不是天气 API 或 OpenAI SDK 示例，而是把一次运行拆成可独立归因的证据边界：

1. `model_request`：模型请求是否成功；失败时不能伪装成工具失败。
2. `schema_validation`：工具名、JSON 参数和必填字段是否在执行前通过校验。
3. `tool_execution`：应用实际执行了哪个函数，外部服务返回了什么状态。
4. `result_compaction`：返回给模型的 payload 是否限长、稳定且保留错误语义。
5. `error_path`：模型请求失败、参数解析失败、未知工具与工具执行失败是否有可区分的结构化结果。
6. `final_answer`：最终回答是否使用真实工具结果，还是掩盖了失败。

这条链补充 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 的接口约束和 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation) 的回归闭环：前者负责让工具边界可验证，后者负责把可复发失败转成 evaluator、fixture 或 smoke check；本页只维护“应观察哪些阶段”。

文章还展示了两个边界案例：一次模型服务端错误发生在工具执行之前；一次通过故障注入制造的 malformed JSON 参数被结构化返回后，模型在下一轮自行重试。它们证明这些错误路径可以被显式观察，但单篇教程不能证明生产故障频率、自动重试可靠性或 Weave 相对其他追踪方案的优势。

`[推论]` 对 AI Agent 的最小映射是：仅在模型/工具/MCP/浏览器/子代理链路出现异常或结果无法追溯时，按上述阶段收集已有日志和运行证据；修复后回放原失败案例和一个相邻反例（验证闭环见 [agent-self-validation-loops](/concepts/agent-self-validation-loops)）。不要因此默认保存全部参数、引入第三方追踪产品、建立持续评测项目或修改 runtime。

### 跨服务追踪与首个可证实异常

[W3C Trace Context 1](https://www.w3.org/TR/trace-context/) 定义 HTTP 追踪上下文。版本 `00` 的 `traceparent` 包含版本、16 字节非全零的 `trace-id`、8 字节非全零的 `parent-id` 和标志位，最低位 `sampled` 表达采样建议。参与追踪的服务通常沿用 `trace-id`，并将出站 `parent-id` 更新为当前操作的 ID。透传服务可原样传递头部。`tracestate` 承载厂商相关状态，最多 32 项。规范建议至少支持传播 512 个字符的合并头部。

两个头部均不得携带个人可识别信息或其他敏感数据。信任边界可按策略重启追踪，重新生成 `trace-id`、`parent-id` 和 `trace-flags`，通常同时清理 `tracestate`。采样决策还应遵守本地预算。非 HTTP 调用按各自的传输契约传播关联信息。规范覆盖上下文传播，实际可见的 Span 取决于埋点和采样。

**[推论] 定位步骤。** 按调用尝试关联六个检查点，以 `trace-id` 和父子 Span 关系串联跨服务证据，保留各步骤所需的状态、错误码或脱敏结果。对成功路径、错误分支和重试分别判断。每个检查点记为通过、失败、证据缺失或不适用。例如输入解析正确拒绝非法参数时，工具执行和结果裁剪不适用，此时应检查结构化错误是否送达调用方。边界解析见 [Parse, don’t validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/) 和 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)。

沿实际路径找首个有证据表明违反契约的检查点。若更早的步骤缺证，保留定位缺口。并发分支分别核对，只有回查输入、依赖和运行状态后才能确认根因。在超过 20 步的长轨迹中，显式报错步骤往往滞后于致错根因步骤：[AgentDebugX（arXiv:2607.18754v1）](https://arxiv.org/html/2607.18754v1) 在 `Who&When` 基准（$n=184$）上通过结构引导的二分回溯与交接边界质询，将严格 `Agent + Exact Step` 归因准确率从单次诊断基线的 `21.7%` 提升至 `28.8%`（仍远低于饱和，证明自动日志归因只能辅助缩小排查区间而不能替代状态回查）。

| 检查点 | 查证方向 |
| --- | --- |
| `model_request` | 回查模型请求和响应，区分限流、超时、上下文超限与正常响应。 |
| `schema_validation` | 对照原始调用、实际生效的工具 Schema 与解析器，区分参数不合法、契约漂移与解析缺陷。 |
| `tool_execution` | 超时且结果不明时，先确认远程终态和幂等边界。见 [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries)。 |
| `result_compaction` | 对照裁剪前后结果，确认必要字段和错误语义是否保留。见 [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management)。 |
| `error_path` | 对照错误来源、结构和接收方实际收到的内容，检查是否发生误分类或丢失。 |
| `final_answer` | 对照模型实际收到的上下文和回答，区分上游结果未送达与回答未忠实反映结果。多 Agent 场景还应查交接，见 [multiagent-systemic-failure-modes](/concepts/multiagent-systemic-failure-modes)。 |

### OpenTelemetry GenAI 语义约定、隐私载荷门禁与 MCP 带外传播（`T_otel`）

当六步调试证据链需要跨模型网关、编排框架与 MCP Server 统一埋点时，应锚定已从主站 `1.45.0` 迁至独立官方仓库的 [`open-telemetry/semantic-conventions-genai`](https://github.com/open-telemetry/semantic-conventions-genai)（[主站迁移公告](https://opentelemetry.io/docs/specs/semconv/gen-ai/)；截至 2026 年 11 月，`gen_ai.*` 与 `mcp.*` 处于 `Development` 状态，`error.type` 与 `exception.*` 为 `Stable`）：

1. **核心 Span 层级与字段重命名避坑**：
   - 标准操作覆盖客户端推理 [`{gen_ai.operation.name} {gen_ai.request.model}`](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/client-inference.md)（`chat`、`generate_content`、`text_completion`、`realtime_inference`）、智能体调用 [`invoke_agent {gen_ai.agent.name}`](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md)（`gen_ai.agent.name` 须保持低基数，避免填入瞬态内存 ID）以及工具执行 [`execute_tool {gen_ai.tool.name}`](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/execute-tool.md)（关联 `gen_ai.tool.call.id`；MCP `CallToolResult` 返回 `isError: true` 时置 `error.type="tool_error"`）。
   - **废弃属性对齐**：旧版 `gen_ai.system` 已废弃并替换为 `gen_ai.provider.name`；`prompt_tokens` / `completion_tokens` 替换为 `gen_ai.usage.input_tokens` / `output_tokens`；早期 `cache_creation.input_tokens` 已统一更名为 **`gen_ai.usage.cache_write.input_tokens`**（[PR 440 破坏性变更说明](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/changelog.d/440.breaking.md)），与 `gen_ai.usage.cache_read.input_tokens`（均作为 `input_tokens` 子集）及 `gen_ai.usage.reasoning.output_tokens`（作为 `output_tokens` 子集）配对。
   - **Token 成本防双计规则**：同一轮推理的 Token 常同时挂载于外层 `invoke_agent` 与内层 `chat` Span；核算成本与缓存命中时（参见 [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)），**必须**限定过滤底层推理 `gen_ai.operation.name` 或直接聚合单调计数器 [`gen_ai.client.inference.usage.*`](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-token-metrics.md)。
2. **默认零敏感载荷门禁（`CAPTURE_CONTENT`）**：
   环境变量 `OTEL_INSTRUMENTATION_GENAI_CAPTURE_CONTENT` 默认取 **`NO_CONTENT`**（非法配置自动回退至此），默认屏蔽 `gen_ai.input.messages`、`gen_ai.output.messages`、`gen_ai.system_instructions`、`gen_ai.tool.call.arguments`、`gen_ai.tool.call.result`、`gen_ai.retrieval.query.text` 等 9 类高敏感载荷，仅采集延迟、Token、模型与状态码等低基数结构化元数据；生产排障如需留存载荷，规范推荐通过外部对象存储异步上传并仅在 Span 上记录**不含签名凭据**的 `gen_ai.*_ref` URI（[gen-ai-spans.md](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md)）。
3. **跨 MCP JSON-RPC 的带外追踪红线（SEP-414 与 Issue `#309`）**：
   在无状态 Streamable HTTP 或 `stdio` 传输下（协议边界见 [mcp-stateless-architecture-and-authorization-boundaries](/concepts/mcp-stateless-architecture-and-authorization-boundaries)），单次 HTTP 连接可能复用或重试多条 JSON-RPC 消息。规范要求客户端将未加前缀的 `traceparent`、`tracestate` 与 `baggage` 注入 JSON-RPC 请求的 **`params._meta`** 属性包，服务端提取后作为 Remote Parent 并用 Span Links 关联底层传输 Span；若外层框架已创建 `execute_tool` Span，MCP 层直接附加上下文属性而不重复建 Span（[mcp.md](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/mcp.md)）。**严禁将 `traceparent` 塞入模型可见的 Tool Call Arguments 字典**：跨 7 个主流 Agent 框架的实测表明，其中 3 个框架会在严格 Schema（`additionalProperties: false`）下直接抛出 `ValidationError` 或静默剥离字段（[Issue 309](https://github.com/open-telemetry/semantic-conventions-genai/issues/309)）。

## 2. 部署前结构回归探针矩阵与混沌故障注入

[machinelearningmastery-agent-regression-tests-2026-08-17](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/machinelearningmastery-agent-regression-tests-2026-08-17.md) 把编排层风险压成七类部署前故障探针；结合 2026 年协议级混沌实验，必须额外单列第 8 类**部分成功与 HTTP 200 静默截断探针**。它们按系统实际具备的能力触发，并把通过条件落到轨迹、状态或副作用证据，而不是只看最终回复。

| 故障探针 | 触发条件 | 最小通过证据 | 跳过条件 |
| --- | --- | --- | --- |
| 上下文丢失与检索退化 | 多轮上下文可能被裁剪、摘要或外部记忆召回 | 早期关键事实仍能被正确恢复；检索与摘要分别判定，不能用 OR 断言互相遮蔽 | 短时、无裁剪、无跨轮状态任务 |
| 工具执行幂等性 | Agent 能向外部系统写入，且调用可能重试或并发 | 同一逻辑操作重复到达时只产生一次真实写入，并可返回一致结果 | 纯只读工具或无外部副作用 |
| 指令覆盖与 Prompt injection | 用户输入、网页、RAG 文档等不可信内容可影响工具调用 | 区分静态模板与自适应攻击（[arXiv:2510.09023](https://arxiv.org/abs/2510.09023) 表明仅测静态模板易产生安全错觉）；分别测量良性和受攻击时的任务完成率，检查工具轨迹与真实状态中的越权读写或披露，而非只看拒绝文案（[AgentDojo](https://arxiv.org/abs/2406.13352)，架构隔离见 [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense)） | 只有在确认不存在不可信输入到特权动作或敏感输出的路径时，才跳过对应副作用探针；仍应按风险验证回复完整性 |
| 结构化输出依从性 | 下游依赖 schema、枚举或机器可读结果 | 同时检查解析、`finish_reason`、拒绝语义、字段值约束和模型版本；valid JSON 不等于语义正确 | 自由文本且无机器消费契约 |
| 部分成功与 HTTP 200 静默截断 | 依赖外部工具、搜索、文件读取或 MCP 载荷返回 | 注入空列表、字段截断或部分成功回执时，Harness 显式校验完整性或上报缺口，禁止静默摄取残缺数据编造结论（[AgentChaos](https://arxiv.org/html/2608.06790v1)；[RetryRealistic](https://arxiv.org/html/2611.28341v1)） | 无外部数据读取且无工具返回消费 |
| 非终止与有界编排 | 存在 retry、tool loop、reactive loop 或多 Agent 等待关系 | 不可能任务和持续错误工具在步骤、累计成本与 wall-clock 三重预算内结构化退出 | 单步确定性调用，无循环或等待 |
| RAG 与参数记忆冲突 | Agent 使用检索内容覆盖或补充模型知识 | 正向验证可采用可信新事实，负向验证可抵抗可检测的检索投毒；结合忠实度与归因证据 | 不使用检索增强 |
| 状态恢复与一致性 | 工作流会持久化、跨进程恢复或跨版本续跑 | 销毁内存实例后能从持久状态继续完成；覆盖 schema/version migration、工作区文件连续性与 mid-tool-call 幂等对账边界 | 单进程、短生命周期、不可恢复任务 |

### 确定性零出站回放门禁 vs. 随机在线能力评测及 2026 混沌实证

将上述探针接入工程流水线时，必须严格解耦两类不同性质的验证（总体契约路由见 [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering)）：

- **确定性契约回归门禁（CI Gate）**：针对 Harness 路由、Schema 严格解析、权限拦截与已知故障恢复，使用零网络出站的传输层录制回放与确定性代码断言。例如 [`agrepl`（arXiv:2607.16200）](https://arxiv.org/abs/2607.16200) 在传输层截获外部交互并以噪声感知请求键匹配在零出站环境下重放，在 5 类工作负载（$n=250$）上实现回放保真度 $F=1.0$、中位单步延迟降低 **`98.3%`**；配合代码级终态验证器（如 [RetryRealistic](https://arxiv.org/html/2611.28341v1) 的 S1–S3 代码核验器，跨评判一致性 $\kappa=0.91$，远高于单靠 LLM 裁判的 $\kappa=0.58$），可在无采样抖动条件下阻断契约漂移。随机在线能力评测（如 [ReliabilityBench，arXiv:2601.06112v1](https://arxiv.org/html/2601.06112v1) 测量的 $R(k, \epsilon, \lambda)$ 三维可靠性曲面与 $\text{pass}^k$ 波动）则留作发布候选或夜间基线，不充当每次提交的脆弱阻塞锁。
- **HTTP 200 静默截断比显式 HTTP 500 更致命**：
  - [AgentChaos（ASE '26，arXiv:2608.06790v1）](https://arxiv.org/html/2608.06790v1) 在 HTTP 层非侵入注入 6 类故障发现，返回 HTTP 200 但内容为空或截断的遗漏故障（Omission）可使 `pass@1` 暴跌最高 **`49.66` 个百分点**，不仅完全绕过常规传输重试，且基于规则的截断诊断准确率仅 **`4.3%`**。
  - [MCP-Injector（NeurIPS 2026，arXiv:2610.32555）](https://arxiv.org/pdf/2610.32555) 基于 `1,774` 个开源 MCP 仓库的 `57,240` 条真实 Issue/PR 校准故障分布（显式错误 `71.2%`、静默内容错误 `19.1%`、时序故障 `9.7%`）：注入后任务完成分下降 **`60%`**（`8.08 → 3.23`），且 `120B` 大模型相比 `20B` 并未保留更高基线分数比例（$p=0.96$），证明**模型参数规模无法替代编排层的容错契约**。
  - [RetryRealistic（arXiv:2611.28341v1，2026-11）](https://arxiv.org/html/2611.28341v1) 在真实文件系统、SQLite 与受限 Shell 的 `2,100` 次故障运行中揭示：`partial_success`（截断/不完整返回）诱发高达 **`38.3%` 的自信编造（Fabrication）**，根因是 **`91%` 的部分数据故障被模型静默摄取（Silent Ingestion）而未触发重试**；引入代码验证优先的监控级联可将编造率由 `17.3%` 压至 `10.8%`。同时，[AgentFaultBench（arXiv:2611.20711v1）](https://arxiv.org/html/2611.20711v1) 提醒切勿盲目堆砌冗长恢复提示词（在限流故障下曾使小模型过早放弃、严格安全成功率下降 `8.33` pp）。

### 证据与晋升边界

[machinelearningmastery-agent-regression-tests-2026-08-17](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/machinelearningmastery-agent-regression-tests-2026-08-17.md) 本身是实践者清单，没有提供可运行测试代码或生产故障率分布；2026 年各混沌基准的失效率数值受限于各自的注入强度与任务集。`[推论]` 在 AI Agent 中，本矩阵只作为 [agent-development-lifecycle](/concepts/agent-development-lifecycle) 的 Test → Deploy 知识检查入口：只有某一探针捕获真实本地失败或目标系统确有对应外部写入/MCP 依赖时，才通过 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation) 沉淀“原失败案例 + 一个相邻反例”的确定性 fixture、evaluator 或 smoke；不得因外部文章或基准默认开启全量载荷采集、创建独立重型评测平台或直接修改 active runtime。

## 3. RAG 决策敏感性不等于质量增益

[nature-rag-multi-agent-structural-health-monitoring-2026-10-15](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/nature-rag-multi-agent-structural-health-monitoring-2026-10-15.md) 报告了一个历史宣礼塔中的对比：引入结构记忆后，融合全局风险从 `0.816`（High）变为 `0.491`（Medium），部分区域的视觉得分归零。研究使用四通道、前 1–12 组操作性健康参考记录与后 13–20 组评估记录，没有评估期独立同步的损伤真实值。因此，这些数值证明的是所报告运行中决策输出发生变化，不能据此判定减少了误报、提高了准确率，或确认归零区域安全。

作者指出，检索提供的建筑纹理、装饰和修缮语境可能抑制含混视觉线索，也可能压制微弱的真实异常；前期“健康参考”不等于独立认证无损伤，“全局异常优先”门控也可能延迟识别早期局部劣化。风险、异常、模型自报置信度、真实损伤和工程安全状态必须分开。原文融合权重描述存在未解冲突，训练未固定随机种子，本文未独立复现；不能用该对比确认某一融合实现或三智能体相对单智能体的收益。

**[推论] 条件性评估清单：** 仅在目标系统确实用检索上下文改变判断或风险分流时采用，不建立全局默认门禁：

- 在有独立标注或现场复核依据时，分开检查误报与漏报；缺乏真实值时，将结果限定为输出差异、上下文敏感性与待复核项，不冒充准确率。
- 固定可控的模型、输入和数值管线，比较无上下文、相关上下文及含混或冲突上下文，并按可接受预算重复运行；区分随机波动与上下文效应。
- 检查低分、归零和高置信度样本，确认真正异常没有被“合理解释”压掉；用独立标签检查置信度校准，不把模型自信当正确概率。
- 沿既有证据链回查是哪项视觉判断、检索片段、可靠性值或实际融合权重改变了结果；数值下降、输出更一致或报告更流畅都不单独算收益。

职责分离与共同对象映射参见 [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary)；检索来源与主张支撑参见 [llm-context-engineering-layer](/concepts/llm-context-engineering-layer)。本案例不提供通用融合权重、置信度阈值、自动放行规则或结构安全鉴定方法。

## Relations

- refines: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- depends_on: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation), [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary)
- related: [agent-development-lifecycle](/concepts/agent-development-lifecycle), [llm-context-engineering-layer](/concepts/llm-context-engineering-layer), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [multiagent-systemic-failure-modes](/concepts/multiagent-systemic-failure-modes), [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense), [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries), [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management), [mcp-stateless-architecture-and-authorization-boundaries](/concepts/mcp-stateless-architecture-and-authorization-boundaries), [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines), [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering)

