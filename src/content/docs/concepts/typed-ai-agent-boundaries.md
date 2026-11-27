---
title: Typed AI Agent Boundaries
created: 2026-05-01
updated: 2026-11-26
type: concept
tags:
  - agent
  - ai-coding
  - typed-boundary
  - structured-output
  - pydantic
  - governance
sources:
  - raw/articles/machinelearningmastery-pydantic-ai-agents-2026-04-29.md
  - raw/articles/microsoft-developer-ai-coding-agents-use-technology-2026-05-27.md
  - raw/articles/kdnuggets-constraining-output-space-slm-narrow-automation-2026-08-13.md
  - raw/articles/towardsdatascience-structured-output-local-llms-2026-08-09.md
  - raw/articles/x-lanlance-code-mode-json-plumbing-2026-08-24.md
  - concepts/dijkstra-ai-programming-formalization.md
  - concepts/hermes-ai-workflow-formalization-principles.md
  - https://arxiv.org/abs/2307.09702
  - https://www.cs.tufts.edu/~nr/cs257/archive/john-hughes/quick.pdf
  - https://arxiv.org/abs/2402.01030
  - https://blog.cloudflare.com/code-mode/
  - https://www.anthropic.com/research/advanced-tool-use
  - https://arxiv.org/abs/2503.18813
  - https://arxiv.org/abs/2506.08837
  - https://arxiv.org/html/2510.20270v1
status: stable
description: 说明通过 typed input/output、FSM 约束解码、规格冲突的显式返回类型、窄工具面、强类型沙箱能力绑定（Code
  Mode Bindings）、显式依赖注入和属性测试降低 AI Agent 不确定性的边界设计。
aliases:
  - typed-agent-boundaries
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Typed AI Agent Boundaries

## Summary

Pydantic AI 这篇文章 [machinelearningmastery-pydantic-ai-agents-2026-04-29](https://github.com/on195594/wiki/blob/8fc75f578e5f04cf77cd6af64297151a38749bad/raw/articles/machinelearningmastery-pydantic-ai-agents-2026-04-29.md) 的长期价值，不是“又一个 Python agent 框架教程”，而是给出了一种降低 AI 编程不确定性的工程边界：把 LLM 的自然语言输出、工具调用和外部依赖，压进 typed schema、typed function tools 和 dependency injection 里。模型仍然不确定，但系统边界变得更可验证、可测试、可替换。

这页补充 [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization) 与 [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)：前者说明 AI 编程仍需要形式化，后者说明 AI Agent 应采用“自然语言输入 + 形式化约束 + 验证闭环”；本页把这个原则落到 agent runtime 内部的三个窄接口上。

## Core pattern

### 1. Structured output turns language into objects

普通 LLM 调用返回自然语言字符串，工程系统随后需要用正则、脆弱 JSON 解析或 prompt 约定去猜格式。Pydantic AI 的 `output_type` 把期望输出定义为 Pydantic `BaseModel`：字段、类型、约束和说明都成为模型必须满足的 schema。

这降低了两类不确定性：

- 输出形状不确定：字段是否存在、类型是否正确、列表/布尔/枚举是否可用。
- 下游处理不确定：业务代码拿到的是已验证 Python 对象，而不是一段待解释文本。

重要细节：`Field(description=...)` 不只是文档，也是在给模型提供字段级约束。字段说明越明确，校验失败和自动重试越少。

### 1.0 语法约束解码与有限状态机掩码（FSM / CFG Logits Masking）

在运行时底层，类型化输出的可靠性不仅依赖事后 Pydantic 解析，更可由**语法约束解码（Grammar-Constrained Decoding / Guided Generation）**在推理阶段直接保障：
- Brandon T. Willard 与 Rémi Louf（2023，*Efficient Guided Generation for Large Language Models*，[arXiv:2307.09702](https://arxiv.org/abs/2307.09702)、开源库 Outlines）证明，神经文本生成可等价重构为**确定性有限状态机（FSM）或下推自动机（PDA / CFG）的状态转移过程**。通过在模型词表上离线构建索引，解码引擎在生成每个 Token 时以 $\mathcal{O}(1)$ 平均开销直接对其 Logits 施加状态掩码（Logits Mask），将所有会导致违反目标正则表达式、JSON Schema 或上下文无关文法（CFG / GBNF）的非法 Token 概率置为 $-\infty$。
- **构造即合法（Correct by Construction）**：与传统的“生成自由文本 → 正则提取 → JSON 反序列化 → 失败报错重试”相比，状态机约束解码使模型在推理采样阶段即被物理限制在目标 Schema 的合法转移路径内，彻底消除了语法错误与格式畸变（malformed JSON）。
- **[推论] 语法合法性不替代语义有效性（Syntactic vs. Semantic Correctness）**：约束解码能保证输出严格符合类型定义（例如字段存在且符合正则表达式），但**无法保证字段取值的真实性与业务语义合理性**。结构合法的 `delete_account(user_id=123)` 依然可能是误触发；Schema 约束减少了下游门禁需要处理的畸形候选率，但业务规则校验、权限检查与逻辑评估（见下文属性测试与依赖注入）依然必须独立存在。

### 1.1 Stage scope selection before nested extraction

[towardsdatascience-structured-output-local-llms-2026-08-09](https://github.com/on195594/wiki/blob/8fc75f578e5f04cf77cd6af64297151a38749bad/raw/articles/towardsdatascience-structured-output-local-llms-2026-08-09.md) 提供了一个结构正确但语义错误的本地小模型案例：单次调用既要判断哪些设备仍需调度，又要提取属性、映射字段并组装嵌套对象；结果通过 Pydantic 校验，却错误保留了已经完成任务的设备。作者把流程拆成两个窄契约后修正了该案例：第一阶段只输出当前处理范围，第二阶段只为已锁定对象填充完整字段。

这个模式适合主动作为可选设计候选，而不是等生产失败后才考虑。当一次调用同时承担前置筛选、状态判断和复杂嵌套提取，尤其使用本地小模型时，应比较 one-shot 与“范围判定 → 细节填充”两种路径。分阶段会增加调用与跨阶段一致性成本，因此不是所有结构化输出的默认门禁；最小验证应同时检查语义正确率、schema 成功率、调用次数和延迟。单篇智能家居案例证明了可行性，不证明普遍优越性。

### 2. Candidate scoring constrains the semantic output space

Schema 约束回答“输出对象是否合法”，但固定标签分类还可以进一步约束“模型究竟允许选择什么”。KDnuggets 的窄任务自动化案例不调用多 Token `generate()`，而是在一次前向传播后读取 next-token Logits，只比较已知候选标签对应的 Token ID。这样，工单分类、文档标签或复核路由不再生成自由文本后用正则修补格式，而是从有限集合中直接选择。

这个模式只适用于推理层暴露 Logits、候选集预先已知且标签稳定的本地或自托管场景。实现时必须满足：

- 按实际 Chat Template 的输出边界编码标签；带空格与不带空格的 Token 可能不同。
- 首 Token 打分要求候选首 Token 互异；存在共享前缀时应改用单 Token 别名或完整序列打分。
- 候选集合内的 Softmax 只是相对分数，不是自动校准的真实置信度；人工复核阈值必须用代表性标注数据校准。
- “结构上一定可解析”不等于分类正确；仍要分别评估准确率、混淆矩阵、延迟、校准和分布外输入。

来源在 `Qwen2.5-0.5B-Instruct`、600 条重复构造样本和一台 M2 MacBook Air 上报告约 30% 耗时下降，但没有给出独立测试集、重复运行方差或置信度校准，因此该数字和文中的 `0.6` 阈值都不能成为 AI Agent 默认值。详见 [kdnuggets-constraining-output-space-slm-narrow-automation-2026-08-13](https://github.com/on195594/wiki/blob/8fc75f578e5f04cf77cd6af64297151a38749bad/raw/articles/kdnuggets-constraining-output-space-slm-narrow-automation-2026-08-13.md)。

### 3. Tool functions define a narrow action surface

Agent 需要调用外部世界时，最危险的不是“能不能调工具”，而是工具边界是否宽到足以被误用。Pydantic AI 用普通 Python 函数注册工具，让类型提示和 docstring 成为模型理解工具用途的主要依据。

这带来一个直接规则：暴露给 agent 的工具函数必须像 public API 一样写。

- 参数类型要精确。
- 返回值要稳定。
- docstring 要说明何时使用、输入含义、限制和失败语义。
- 工具应尽量小而窄，避免一个函数同时承担查询、修改、删除、推断多种职责。

Microsoft Developer 的 AX 文章（[microsoft-developer-ai-coding-agents-use-technology-2026-05-27](https://github.com/on195594/wiki/blob/8fc75f578e5f04cf77cd6af64297151a38749bad/raw/articles/microsoft-developer-ai-coding-agents-use-technology-2026-05-27.md)）补充了工具边界的发现层：好工具不仅要有 typed schema，还要能在 harness 装配、模型语义匹配和真实组合工具面中被正确发现。docstring/description 应优先覆盖“何时使用、何时不用、失败时返回什么”，否则模型可能跳过工具，转而用过时训练知识生成看似合理的错误代码。

### 3.1 Programmatic tool composition and capability-bound sandboxes (Code Mode / PTC)

当任务需要串联多个工具处理大体积中间数据（如拉取 100 条记录过滤排序后再逐条更新）时，传统的逐轮 JSON `tool_call` 会迫使大模型充当高成本、易出错的“JSON 搬运工”。结合 [x-lanlance-code-mode-json-plumbing-2026-08-24](https://github.com/on195594/wiki/blob/8fc75f578e5f04cf77cd6af64297151a38749bad/raw/articles/x-lanlance-code-mode-json-plumbing-2026-08-24.md)、[Cloudflare Code Mode](https://blog.cloudflare.com/code-mode/)、[Anthropic Programmatic Tool Calling (PTC)](https://www.anthropic.com/research/advanced-tool-use) 与 [CodeAct（Wang et al., ICML 2024）](https://arxiv.org/abs/2402.01030)，可将窄工具接口升级为**强类型 SDK 沙箱绑定（Typed SDK Bindings in Sandbox）**（工作流分层与损益判据见 [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)）：

- **从 JSON Schema 到强类型语言 API 桩（Typed Stubs）**：将 MCP Server 或内部工具的 JSON Schema 自动转译为带完整类型签名与文档注释的 TypeScript `.d.ts` 或 Python `typing.Protocol` / Pydantic 函数桩。Cloudflare 报告以 TypeScript API 暴露工具时可处理更多、更复杂的工具，并将更丰富的真实代码训练语料列为可能解释；这支持尝试用代码表达循环、过滤与错误处理，但不是对所有模型和任务准确率的普遍保证。
- **能力绑定隔离（Capability Bindings over Raw Network / Credentials）**：沙箱内的生成代码绝不能拥有任意外网访问权限或直接读取原始 API Key。如 [Cloudflare Code Mode](https://blog.cloudflare.com/code-mode/) 所示，沙箱完全断网，仅能调用宿主注入的强类型 RPC Binding 对象（如 `env.mcp_server.call(...)`）；凭证注入、OAuth 令牌刷新与网络通信严格保留在沙箱外的受信任宿主（Supervisor / Harness）中。
- **[推论] 沙箱内代码编排不豁免逐次调用的 Tool Gate 授权**：将多个工具调用合并进一段 Python/TypeScript 脚本只改变了**控制流与中间数据驻留位置**，绝不改变外部副作用的安全等级。宿主在接收沙箱发出的每一次 RPC 工具调用时，仍必须独立执行 Schema 校验、参数值级权限检查（如 `ScopeGate` 防范 Confused Deputy，见 [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary)）以及不可逆写操作（枢轴事务）前的人工审批（见 [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries)），严禁因为代码在沙箱内运行就默认放行其发起的外部写请求。
- **[推论] 从沙箱能力绑定衔接数据流污点与控制流隔离（CaMeL 边界）**：强类型 Stub 与断网 RPC Binding 能隔离原始凭据，但如果同一上下文同时读取不可信外部内容并持有外发通道，仅靠类型合法性无法阻断间接提示注入。高风险场景可用 [CaMeL](https://arxiv.org/abs/2503.18813) 式控制流隔离与数据来源追踪，或参考 [Beurer-Kellner 等提出的六类模式](https://arxiv.org/abs/2506.08837) 选择适合任务的隔离方式；如果敏感参数仍可由不可信内容影响，就必须在模型外逐次校验和授权，完整选型与威胁模型见 [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense)。

### 4. Dependency injection removes hidden global state

生产 agent 往往需要数据库连接、API client、session 信息、租户权限或运行时配置。如果这些依赖隐藏在全局变量里，agent 行为会变得难测试、难复现，也更难做权限治理。

Pydantic AI 的 `RunContext` 模式把依赖作为运行时参数注入工具函数。它的价值不只是代码整洁，而是把外部环境显式化：

- 测试时可以替换成 mock / fake service。
- 不同用户、租户、权限上下文可以隔离。
- 工具函数不需要读取隐式全局状态。
- 失败可以被定位到模型输出、工具实现或依赖服务，而不是混在一起。

### 5. 属性测试与不变量生成式检验（Property-based Invariant Testing）

单靠固定的单元测试样例容易让 Agent 编写的代码在未见输入上崩溃。Koen Claessen 与 John Hughes（2000，ACM SIGPLAN ICFP，*QuickCheck: A Lightweight Tool for Random Testing of Haskell Programs*，[Tufts CS Archive](https://www.cs.tufts.edu/~nr/cs257/archive/john-hughes/quick.pdf)）开创的**属性测试（Property-based Testing）**为类型化 Agent 提供了更高阶的验证边界：
- 程序员或 Agent 不只指定特定输入输出对（如 `f(2) == 4`），而是用代数性质形式化表达在任意合法输入 $x \in \mathcal{X}$ 下必须始终成立的**系统不变量（Invariants）**（如逆操作对称性 $f^{-1}(f(x)) = x$、幂等性 $g(g(x)) = g(x)$、单调性或保持数据守恒）。
- 结合随机生成与**收缩（Shrinking）**机制：当测试引擎在大量随机生成的结构化测试用例中探测到违反不变量的样本时，自动执行贪婪搜索将其收缩为导致失败的**局部最小反例（minimal failing test case）**。
- **[推论] 在 AI 编程中的应用**：对 Agent 生成的复杂数据转换、序列化或解析逻辑，强制其配套提供属性测试（例如使用 Python `hypothesis` 库）；利用收缩出的最小反例可直接阻断有缺陷的代码合入，并为上下文压缩提供极低噪声的精确调试用例。
- **为规格冲突预留返回类型**：[*ImpossibleBench* §5.3](https://arxiv.org/html/2510.20270v1) 在 Conflicting-SWEbench 上允许 GPT-5 停止并上报冲突后，作弊率从 `54%` 降至 `9%`；测试只读是另一个实验。[推论] 把 `SpecificationConflict` 和 `MissingPrerequisite` 与 `PatchResult` 并列为合法返回类型。这样调用方能按 [agent-self-validation-loops](/concepts/agent-self-validation-loops) 的停止条件请求裁决，而不必把无法完成的任务伪装成补丁。

## What uncertainty this solves

它主要解决 agent 工程中的“边界不确定性”：

- 输出是否符合业务可消费结构。
- 固定标签任务是否能从有限候选集合中直接选择，而不是生成后解析。
- 工具是否被以正确参数调用。
- 外部依赖是否可替换、可测试、可审计。
- 验证失败时是否能重试或报错，而不是把坏数据继续传下去。

它不解决所有 AI 不确定性：

- 模型仍可能误解任务。
- 多步推理仍可能漂移。
- 工具选择策略仍可能错误。
- 自动重试会增加 token 成本和延迟。
- 权限、安全、审计、回滚仍需要平台层设计。

因此更准确的结论是：typed boundaries 不会让模型确定，但会让模型和业务系统之间的接口更确定。

## AI Agent mapping

### Wiki

这类文章应进入 wiki，而不是 memory：它需要来源、结构、交叉链接和后续扩写。raw source 保留在 `raw/articles/`，可复用模式沉淀为本页概念。

### Skill

当外部方案补足现有 structured-output 工作流的明确空白，且低成本、可逆、可验证时，可以主动沉淀为带触发和跳过条件的 optional reference；不必等待 AI Agent 先出现同类生产失败。缺少本地证据限制的是默认推广强度，不阻止可选模式进入现有 owner skill。

### MCP / internal tools

对企业内网 AI 编程集成，这个模式可以翻译成：不要让 agent 直接访问数据库或业务系统；应暴露窄工具接口，并让每个工具继承原系统权限、记录审计日志、返回 typed result。

### Verification

AI Agent 现有规则“写完要验证”可以进一步细化为：agent 输出进入业务系统前必须经过 schema validation；工具调用必须有类型边界；依赖必须能在测试环境替换（单次工具调用六步调试证据链与结构化输出依从性回归探针见 [agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging)）。

如果未来 AI Agent 项目确实出现本地、高频、固定标签分类瓶颈，最低成本验证是用同一代表性标注集对比自由生成、schema/enum 约束生成和候选 Logits 打分，并分别记录准确率、解析失败率、P50/P95 延迟、吞吐、校准和人工复核成本。没有该需求时不创建新分类器项目，也不修改 active workflow。

## Operating rules

- 对任何进入生产链路的 LLM 输出，优先定义 schema，而不是信任自然语言格式。
- 当一次调用同时承担范围筛选、状态判断和复杂嵌套提取时，主动评估“先定范围、再填细节”的分阶段 schema，并与 one-shot 基线比较后选择。
- 对自托管的固定标签窄任务，先判断一次前向传播的候选打分能否替代自由生成；托管端不暴露 Logits 或任务输出开放时跳过。
- 对任何暴露给 agent 的工具，优先当成 public API 设计，而不是临时 helper。
- 对任何外部依赖，优先通过显式上下文注入，而不是全局变量。
- 对任何自动重试机制，都要设置成本、延迟和失败上限。
- 对任何 agent workflow，都要区分“模型不确定性”和“接口不确定性”：前者只能降低，后者必须工程化约束。

## What this adds to the existing wiki

- [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization) 说明为什么 AI 编程仍需要形式化。
- [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles) 说明 AI Agent 应把模糊自然语言收敛成可验证结构。
- 本页补上 agent 内部的具体工程边界：structured output、候选语义空间约束、function tools、dependency injection。
- [ai-coding-agent-workflow-types](/concepts/ai-coding-agent-workflow-types) 关注 agent 放在哪种执行入口中；本页关注 agent 进入工程系统时接口如何收窄。

## Relationship to document fidelity risk

[ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk) explains why wide file read/write tools are not sufficient safety controls for autonomous document work. Typed boundaries should be paired with narrow, domain-specific tools and explicit validation of content preservation.

## Applied AI Agent practice

- [how-i-should-use-hermes-for-ai-coding-with-typed-boundaries](/queries/how-i-should-use-hermes-for-ai-coding-with-typed-boundaries) 将本页原则转成使用 AI Agent 编程时的可选方法指南：先压 contract，再选择 execution lane，再用 typed output、窄工具、显式依赖和分层验证控制不确定性。
- [hermes-python-engineering-capability-checklist](/concepts/hermes-python-engineering-capability-checklist) 维护本页原则在 Python 运行时与 Pydantic v2 中的具体检查项（`S_strict` 与 `C_cancel`）：涵盖嵌套子模型非递归 `strict=True` 基类约束、`extra='forbid'`、判别联合 $O(1)$ 工具分派、模块级单例 `TypeAdapter`，以及异步取消屏蔽清理与有界队列背压。
- [flutter-version-evolution-and-platform-boundaries](/concepts/flutter-version-evolution-and-platform-boundaries) 将类型化协议与客户端凭证隔离原则延伸至跨平台 UI 的原生互操作（Pigeon / FFI）与可选 AI 生态（GenUI / Genkit Dart）评估边界。

## Relations
- depends_on: [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization), [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)
- related: [ai-coding-agent-workflow-types](/concepts/ai-coding-agent-workflow-types), [agent-context-engineering](/concepts/agent-context-engineering), [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture), [how-i-should-use-hermes-for-ai-coding-with-typed-boundaries](/queries/how-i-should-use-hermes-for-ai-coding-with-typed-boundaries), [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk), [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary), [agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging), [flutter-version-evolution-and-platform-boundaries](/concepts/flutter-version-evolution-and-platform-boundaries), [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order), [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense), [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary), [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [hermes-python-engineering-capability-checklist](/concepts/hermes-python-engineering-capability-checklist)

