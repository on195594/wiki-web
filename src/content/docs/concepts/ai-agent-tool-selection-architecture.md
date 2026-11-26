---
title: AI Agent Tool Selection Architecture
created: 2026-07-11
updated: 2026-11-25
type: concept
tags:
  - agent
  - mcp
  - tool
  - context-engineering
  - evaluation
  - workflow
sources:
  - raw/articles/machinelearningmastery-tool-selection-ai-agents-2026-07-06.md
  - raw/papers/arxiv-2302-04761-toolformer.md
  - raw/articles/thenewstack-ard-agent-discovery-specification-2026-08-31.md
  - raw/articles/x-lanlance-code-mode-json-plumbing-2026-08-24.md
  - docs:https://hermes-agent.nousresearch.com/docs/user-guide/features/tools
  - docs:https://hermes-agent.nousresearch.com/docs/reference/toolsets-reference
  - https://arxiv.org/abs/2402.01030
  - https://blog.cloudflare.com/code-mode/
  - https://www.anthropic.com/research/advanced-tool-use
  - https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling
  - https://arxiv.org/html/2610.23707v1
  - https://arxiv.org/html/2610.41905v1
  - https://arxiv.org/html/2610.23449v1
  - https://arxiv.org/html/2602.14878v1
  - concepts/mcp-stateless-architecture-and-authorization-boundaries.md
  - comparisons/agent-tool-and-interoperability-paradigms.md
status: stable
description: 区分资源发现、工具可用性、候选集缩减、逐步选择与失败回退，形式化四阶条件概率漏斗、前缀缓存折算损益、生产者—消费者集合完备召回与三代工具调用演进边界。
aliases:
  - agent-tool-selection
  - tool-routing-for-ai-agents
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# AI Agent Tool Selection Architecture

## Summary

AI Agent 的工具选择不是“把所有工具交给模型后让它自己决定”，而是一个分层控制问题：先决定本轮是否需要工具，再缩小候选范围，然后选择并执行具体工具，最后对低置信度和失败结果进行回退。工具 Schema 同时也是上下文，因此工具越多、描述越相似，模型的注意力、Token 成本和选择难度越可能上升。

本页编译自 Machine Learning Mastery 的 [machinelearningmastery-tool-selection-ai-agents-2026-07-06](https://github.com/on195594/wiki/blob/f50b497161edfca34aa32dd28d5515c0b8c491cc/raw/articles/machinelearningmastery-tool-selection-ai-agents-2026-07-06.md)，结合工具可用性与权限边界给出可迁移设计。文章提供的是架构候选和外部实验线索，不是 AI Agent runtime 的直接改造依据。

## Discovery precedes availability

[thenewstack-ard-agent-discovery-specification-2026-08-31](https://github.com/on195594/wiki/blob/f50b497161edfca34aa32dd28d5515c0b8c491cc/raw/articles/thenewstack-ard-agent-discovery-specification-2026-08-31.md) 补充了工具调用之前的上游问题：当资源分散在多个组织、云或目录中时，Agent 如何发现可能相关的能力。ARD（Agentic Resource Discovery）将此定义为独立的 discovery layer；文中描述的 v0.91 草案使用 JSON-LD 与 REST，以 `POST /search` 在联邦注册表中返回候选资源。

这与本页的 **Availability** 不同：discovery 产生“可能存在什么”，availability/admission 决定“本环境允许并信任什么”。随后才是每一步的候选缩减、具体调用与失败回退。多候选搜索不是 DNS 式的单点解析，不能绕过本地凭证、权限、Schema、审批、执行结果校验或回退。

这只是架构边界的补充，不证明目标系统当前缺少能力。应先检查已有工具注册和权限配置是否提供有界候选面；只有出现跨目录发现摩擦或重复手工配置的本地证据，才值得评估外部 catalog/discovery 方案。

## Four distinct decisions

### 1. Availability: 系统允许使用什么

工具注册、权限、凭证、平台配置和运行时能力检查决定工具是否可用。这个层面处理的是能力与安全边界，不负责判断当前请求最相关的工具。

目标系统可以按平台、会话或任务控制可见工具，但具体分组与能力需实际核对。工具注册不等于调用授权，高风险动作仍需权限与运行时检查。详见 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)。

### 2. Candidate reduction: 本轮让模型看到什么

即使工具已经可用，也不代表它必须进入每一轮模型请求。候选集缩减可以来自：

- 静态 toolset：按平台、项目或任务预先选择工具组；
- 语义路由：先选择数据、通信、开发等工具域；
- 检索式选择：根据查询召回 Top-K 个工具描述；
- 规划式选择：先拆分步骤，再为当前步骤暴露少量工具。

这属于上下文装配问题，与 [agent-context-engineering](/concepts/agent-context-engineering) 的“最小必要可见面”原则一致。缩减候选集的目标不是追求更少工具本身，而是在不损害召回的前提下减少歧义、Token 和误选。

### 3. Selection and execution: 在候选集中调用哪个工具

模型仍需把用户意图映射到工具语义，并生成正确参数。工具描述应写清楚：

- 何时使用；
- 何时不要使用；
- 输入、输出和失败语义；
- 成本、风险及审批边界；
- 与相似工具的区别。

仅缩小工具数量不能修复含糊 Schema、参数契约错误或模型不愿调用工具的问题。工具选择准确率与执行成功率应分开测量，详见 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)。

### 4. Fallback: 低置信度或失败后怎么办

合理的失败路由通常是：

1. 候选明确且风险可接受时执行；
2. 候选不足时改写查询或扩大候选集，最多进行有限重试；
3. 信息仍不足时请求澄清或拒绝猜测；
4. 高风险、不可逆或需凭证的操作进入审批边界。

“置信度阈值”不能仅依赖模型自报。除非通过本地标注集校准，否则应优先使用可观察信号：候选分数差距、Schema 校验、参数缺失、执行错误、权限检查及用户输入是否足够。

### 形式化：工具选择四阶条件概率漏斗与 Top-K 损益边界

`[推论]` 为避免把“检索召回率”“模型选对率”和“最终执行成功率”混为一谈，可将全量注册工具池 $\mathcal{T}_N$（规模 $N$）下针对请求 $q$ 成功调用目标工具 $t^*$ 的端到端概率分解为四阶乘积漏斗：

$$P(\text{succ} \mid q, \mathcal{T}_N) = \underbrace{P(t^* \in \mathcal{A}_q)}_{\text{1. Availability}} \cdot \underbrace{P(t^* \in \mathcal{C}_K \mid t^* \in \mathcal{A}_q, q)}_{\text{2. Candidate Recall } R_K} \cdot \underbrace{P(\hat{t} = t^* \mid t^* \in \mathcal{C}_K, q)}_{\text{3. In-Context Selection } S_K} \cdot \underbrace{P(\text{valid\_args} \land \text{exec} \mid \hat{t} = t^*, q)}_{\text{4. Schema & Execution } E_{t^*}}$$

这一分解直接给出两项工程裁决准则：
1. **Top-K 候选缩减（$N \to K$）的成立前提**：
   将全量工具集 $\mathcal{A}_q$（$|\mathcal{A}_q| = N$，$R_N = 1$）缩减为规模 $K < N$ 的候选子集 $\mathcal{C}_K$ 时，一方面因减少相似工具干扰（可类比 ACT-R 扇出 $\text{fan}_j$ 降低，见 [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state)；这是类比，不是对 LLM 的已证机制）使模型上下文内选择准确率从 $S_N$ 提升至 $S_K$，并节省 Schema Token 成本 $\Delta C_{\text{schema}}(N - K)$；但另一方面引入了检索器的漏召回风险（$R_K < 1$）与路由器开销 $C_{\text{router}}$。因此，可用下面这个保守的充分判据判断动态 Top-K 缩减是否优于全量暴露（同时要求端到端选择质量不降、Schema 节省覆盖新增开销；它不是充要条件，也不覆盖与静态分组的比较，后者需用静态分组的 $R \cdot S$ 替换 $S_N$ 另行比较）：
   $$R_K \cdot S_K > S_N \quad \land \quad \Delta C_{\text{schema}}(N - K) > C_{\text{router}} + (1 - R_K) C_{\text{fallback}}$$
   若工具描述含糊导致检索器首轮漏召回（$R_K$ 偏低），缩减候选集反而会直接封死模型的正确路径。
2. **基于 Top-2 分数间隔（Score Margin）与必填槽位的确定性回退**：
   相比依赖模型在生成文本中自报校准度差的口头置信度，更稳健的 Fallback 触发条件是结合候选排序得分差（Logit 或余弦相似度间隔 $\Delta s_{1,2}(q) = s_{(1)}(q) - s_{(2)}(q)$）与参数 Schema 校验器 $\mathcal{V}_{\text{schema}}$：
   $$\text{TriggerFallback}(q) \iff \big(s_{(1)}(q) < \tau_{\min}\big) \;\lor\; \big(\Delta s_{1,2}(q) < \tau_{\text{margin}}\big) \;\lor\; \big(\neg \mathcal{V}_{\text{schema}}(\hat{\mathbf{a}})\big)$$
   当最高分低于绝对门槛 $\tau_{\min}$ 时走无工具分支或扩展检索；当头两名候选工具得分过于接近（$\Delta s_{1,2} < \tau_{\text{margin}}$，即存在歧义竞争工具）或缺少必填参数时，优先将并列候选同时暴露给模型或向用户发起澄清，严禁在低间隔下静默执行高风险写工具（对应 [agent-resource-optimization](/concepts/agent-resource-optimization) 中的 `P_tool / M_margin` 门禁）。
3. **2026 实证修正：前缀缓存折扣、集合完备召回与分层网关能力门槛**：
   - **前缀缓存折算定律**：[Arcade 工具推荐研究（arXiv:2610.23707v1）](https://arxiv.org/html/2610.23707v1) 对企业编码工作流的计费测量表明，固定顺序的静态工具列表前缀享有 `85%–87%` 的提示缓存命中率 $K_{\text{hit}}$（按基础输入单价比例 $\alpha_r \approx 0.1$ 计费），因此名义 Schema 节省项须乘以缓存折扣因子 $1 - K_{\text{hit}}(1 - \alpha_r)$：`17.2%–39.6%` 的输入 Token 削减仅折合 **`5.5%–21.8%`（池化均值 `13.6%`）** 的真实账单节省；在该实验计费模型下，候选工具少于约 `25–28` 个，或平均每次工具调用的搜索次数超过约 `0.63` 时，静态预载比动态检索更便宜。
   - **生产者—消费者集合完备召回（$R_{\text{set}}$）**：多步任务往往依赖一组协同工具 $\mathcal{T}_q^*$，此时单目标召回 $R_K$ 须收紧为集合完备召回 $R_{\text{set}}(q) = P(\mathcal{T}_q^* \subseteq \mathcal{C}_K \mid \mathcal{T}_q^* \subseteq \mathcal{A}_q, q)$。[Multi-Tool Retrieval Structures（arXiv:2610.41905v1）](https://arxiv.org/html/2610.41905v1) 发现单步 Top-$K$ 在 AppWorld（$k=16$）上的集合完备率不超过 `9.6%`（MCP-Bench 不超过 `35.9%`），`162/241` 的缺口源于漏掉获取前置 ID/句柄的**生产者工具（Producer APIs）**；完备集合下任务 `21/21` 成功，缺失时仅 `2/39` 成功，而集合级协同检索器 COLT 在零 LLM 开销下将完备率推升至 `32.8% / 58.3%`。
   - **分层网关推理门槛与描述异味信噪比**：[GatewayBench（arXiv:2610.23449v1）](https://arxiv.org/html/2610.23449v1) 显示在 `1,500` 个噪声工具下，两级分层发现网关在强推理模型（GPT-5.4）上将每轮上下文由 `233.3k` 压至 `12.6k` tok（维持 `85.6%` 成功率并压降间接注入 ASR `47.2% → 30.9%`），但较弱模型（GPT-5.1）易跳过发现直接幻觉工具名而暴跌 `37.6` 个百分点。同时，[MCP 工具描述异味审计（arXiv:2602.14878v1）](https://arxiv.org/html/2602.14878v1) 检出 `97.1%`（856 个工具）存在描述缺陷：补齐清晰的**用途与调用边界（Purpose + Guidelines）**显著提分，但**移除 Few-shot `Examples` 无统计显著退化（$p > 0.20$）**，盲目堆砌全量长描述反而使中位执行步数膨胀 `+67.46%`。

### 三代工具调用架构演进：全量预载、动态搜索与程序化编排（Code Mode / PTC）

结合 [x-lanlance-code-mode-json-plumbing-2026-08-24](https://github.com/on195594/wiki/blob/f50b497161edfca34aa32dd28d5515c0b8c491cc/raw/articles/x-lanlance-code-mode-json-plumbing-2026-08-24.md)、[Cloudflare Code Mode](https://blog.cloudflare.com/code-mode/)、[Anthropic Advanced Tool Use (Tool Search & Programmatic Tool Calling)](https://www.anthropic.com/research/advanced-tool-use) 与 [CodeAct（Wang et al., ICML 2024）](https://arxiv.org/abs/2402.01030)，Agent 工具调用架构按**“Schema 如何进入上下文”**与**“多步控制流由谁驱动”**可分为三代互补形态（详见 [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)）：

1. **第一代：全量预载逐轮调用（Static Full-Schema Function Calling）**：将所有工具 JSON Schema 常驻在静态预算 $B_{\text{sys}}$ 中，由模型逐轮输出 JSON 调用单个工具。仅适合工具总数少（如 $N \lesssim 10\text{–}15$）、描述正交且单步即可完成的任务；当 API 端点扩展至数百或数千个时，常驻 Schema 会直接耗尽上下文窗口并拉低 $S_N$。
2. **第二代：按需工具搜索（Dynamic Tool Search / Progressive Disclosure）**：只常驻轻量检索入口（如 `search_tools` 或目录索引），根据当前子任务动态召回 Top-$K$ 个工具 Schema。这解决了 $B_{\text{sys}}$ 静态膨胀（优化了漏斗第 2 阶 $R_K \cdot S_K$），但**多步工作流仍由模型逐轮驱动**——若任务需连续调用 20 次工具搬运中间 JSON，仍会产生高昂的跨轮推理延迟与中间数据上下文污染。
3. **第三代：沙箱程序化工具编排（Code Mode / Programmatic Tool Calling）**：模型通过 `search()` 按需获取目标 API 的强类型签名（如 TypeScript / Python SDK 接口），随后编写一段可执行代码交由受控沙箱 `execute()` 一次性完成循环、分页、过滤与跨工具参数拼接，仅向主上下文返回最终精简结果。这把多步确定性编排从“逐轮概率性选择（$\prod_{m=1}^M S_{K,m} E_m$）”收敛为单次代码生成与确定性执行（[Anthropic PTC 文档](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling)报告多工具大输出过滤省 `24%–38%` 输入 Token，但 `1–2` 步顺序交互反增约 `+8%` 成本；无状态协议边界与全维选型分别见 [mcp-stateless-architecture-and-authorization-boundaries](/concepts/mcp-stateless-architecture-and-authorization-boundaries)、[agent-tool-and-interoperability-paradigms](/comparisons/agent-tool-and-interoperability-paradigms)、[typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 与 [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management)）。

## Six controls from the source

文章提出六类控制，应按职责理解，而不是全部叠加为默认流水线：

1. **Gating**：在工具选择前过滤纯对话或无需工具的请求。
2. **Retrieval-based selection**：只向模型提供语义相关的 Top-K 工具。
3. **Semantic routing**：先路由到一个工具域，再在域内选择。
4. **Planner-based selection**：多步任务先分解，再按步骤选择工具。
5. **Fallback logic**：低置信度时重检索、澄清或停止猜测。
6. **Benchmarking**：比较准确率、Token、延迟和任务完成率。

这些机制解决的层次不同，但组合越多，路由器、索引、阈值、追踪和维护成本也越高。没有本地失败证据时，优先使用静态工具集与清晰描述，而不是直接引入向量检索和规划器。

## Training-time acquisition is not runtime tool routing

Toolformer ([arxiv-2302-04761-toolformer](https://github.com/on195594/wiki/blob/f50b497161edfca34aa32dd28d5515c0b8c491cc/raw/papers/arxiv-2302-04761-toolformer.md)) learns tool-call behavior by sampling candidate API calls, executing them, filtering for future-token loss reduction and fine-tuning the model. That mechanism is upstream of this page's runtime decisions. It does not replace tool visibility control, schema validation, permissions, cost accounting, execution-result checking or fallback. Its stated inability to chain tools, interactively browse results or account for call cost is direct evidence against treating learned tool propensity as sufficient runtime governance. See [agent-architecture-primary-paper-map](/queries/agent-architecture-primary-paper-map).

## Evidence and limitations

### Source-backed claims

文章引用 RAG-MCP 研究，报告检索式工具选择在其实验设置下将准确率从 `13.62%` 提升至 `43.13%`，同时减少一半以上 Prompt Token；文章自己的 10 工具、8 查询微型测试也报告了约 `70%` 的 Token 成本下降。

这些数字只能视为特定案例结果：

- 数据集、模型、工具描述质量与 AI Agent 当前环境不同；
- 8 条查询不足以证明生产可靠性；
- 候选召回、最终选择、参数生成与任务成功不是同一指标；
- 检索和规划自身也会增加延迟、成本与失败路径；
- 文中“10～15 个工具后准确率下降”不应成为 AI Agent 的硬阈值。

### What the article cannot establish

文章不能证明动态 Top-K 一定优于 AI Agent 的静态 toolset，也不能证明统一置信度阈值适用于不同模型、工具域和风险等级。它提供的是值得验证的架构假设，而不是生产默认值。

## AI Agent mapping

### Existing coverage

先核对目标系统实际提供的工具分组、会话配置、单工具禁用、子任务约束、审批与失败处理。存在这些能力时优先复用；不存在时说明缺口，不将 Hermes 文档中的 toolset 分类外推为通用 API。

### True local gap

应从真实目标任务建立对照基线，避免仅凭产品功能表推断存在缺口：

- 全量工具面是否真的造成误选；
- 收窄 toolset 是否改善首次选择；
- 哪些工具描述最容易混淆；
- Schema Token 占比及对端到端延迟的影响；
- 工具不可用、信息不足时是否正确澄清或回退。

这个缺口属于评测证据层，不自动授权修改 runtime、config 或 active skill。

## Minimal evaluation path

若后续验证工具选择优化，应复用目标项目已有评测或回放工具，不假定预装某个私有工作区。最低成本对照为：

1. 从真实会话整理查询—目标工具样本，包括无需工具、单工具、相似工具、多步任务、信息不足和工具不可用场景；
2. 对比当前全量工具面与人工收窄的任务型 toolset；
3. 分别记录候选召回、首次选择、参数有效性、执行成功、任务完成、输入 Token 和端到端延迟；
4. 只有静态收窄仍无法解决重复误选时，才评估 Top-K 检索；
5. 动态方案必须具备无结果、错召回和高风险工具的安全回退；
6. 本地结果不足时保持 `NO_ACTION`，不把外部阈值写入默认配置。

## Adoption boundary

- **Wiki：已采纳。** 保存分层模型、证据边界和本地评测路径。
- **Project-local pilot：候选。** 只有出现可复现误选或明确 Token/延迟负担时才启动。
- **Skill/reference：暂不推广。** 已有上下文、工具边界和评测页面覆盖大部分原则。
- **Runtime/config/MCP/cron/memory：不推广。** 动态工具检索、逐轮路由和置信度阈值都需要单独验证、审批和回滚证据。

## Relations

- refines: [agent-context-engineering](/concepts/agent-context-engineering)
- depends_on: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- related: [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop), [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs), [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities), [agent-architecture-primary-paper-map](/queries/agent-architecture-primary-paper-map), [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state), [agent-resource-optimization](/concepts/agent-resource-optimization), [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order), [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management), [how-i-should-use-hermes-for-ai-coding-with-typed-boundaries](/queries/how-i-should-use-hermes-for-ai-coding-with-typed-boundaries), [mcp-stateless-architecture-and-authorization-boundaries](/concepts/mcp-stateless-architecture-and-authorization-boundaries), [agent-tool-and-interoperability-paradigms](/comparisons/agent-tool-and-interoperability-paradigms)

