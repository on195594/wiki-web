---
title: Agent Security Architecture and Prompt Injection Defense
created: 2026-11-19
updated: 2026-11-25
type: concept
tags:
  - agent
  - architecture
  - governance
  - risk-control
  - mcp
  - verification
sources:
  - https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
  - https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
  - https://arxiv.org/abs/2404.13208
  - https://arxiv.org/abs/2406.13352
  - https://arxiv.org/abs/2503.18813v2
  - https://arxiv.org/abs/2504.11703
  - https://arxiv.org/abs/2505.23643
  - https://arxiv.org/abs/2506.08837
  - https://arxiv.org/abs/2510.09023
  - https://arxiv.org/abs/2503.03704
  - https://arxiv.org/pdf/2609.13889
  - https://arxiv.org/abs/2605.29960
  - https://arxiv.org/abs/2606.24322
  - https://arxiv.org/abs/2605.05440
  - https://arxiv.org/abs/2608.15888
  - https://arxiv.org/abs/2603.15727
  - https://invariantlabs.ai/blog/mcp-security-notification
  - https://invariantlabs.ai/blog/introducing-mcp-scan
  - https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices
  - https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization
  - https://arxiv.org/html/2610.23449v1
  - https://arxiv.org/html/2609.10871v1
  - concepts/agent-skill-provider-governance-boundary.md
  - concepts/typed-ai-agent-boundaries.md
  - concepts/mcp-stateless-architecture-and-authorization-boundaries.md
  - comparisons/agent-tool-and-interoperability-paradigms.md
status: stable
volatility: medium
verified_at: 2026-11-19
review_by: 2027-03-19
description: 结合 OWASP Agentic Top 10 与致命三角，比较 CaMeL/FIDES/Progent 抗注入边界，覆盖 MCP
  供应链、记忆投毒、ASI07 委托传播及五维安全裁决矩阵。
aliases:
  - agent-security-architecture
  - prompt-injection-defense
  - lethal-trifecta
---

# Agent Security Architecture and Prompt Injection Defense

## Summary

AI Agent 的核心安全脆弱性不在于某一特定模型“不够聪明”，而在于架构允许**同一个推理上下文同时读取不可信外部内容并选择特权动作**。因此，提示注入与工具劫持无法仅靠改写系统提示词、指令微调或前置分类器根治；工程上必须把关键安全不变量从模型内部的概率性识别，转移到模型外部的确定性控制流隔离、数据流能力追踪与逐次参数授权上。

本页作为对抗性安全边界的主维护页，串联并补齐已有页面中的安全拼图：[agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary) 的动作层最小权威（PoLA）与 `ScopeGate` 困惑副手拦截、[typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 的类型化契约与 Code Mode 沙箱能力绑定、[agent-execution-sandboxing-and-browser-isolation](/concepts/agent-execution-sandboxing-and-browser-isolation) 的 `ASI05` 代码执行隔离谱系与浏览器/GUI 语义沙箱、[agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging) 的部署前注入探针，以及 [agent-memory-reflection-planning-pipeline](/concepts/agent-memory-reflection-planning-pipeline) 与 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) 的持久化记忆边界。

## 1. 威胁模型：OWASP Agentic Top 10 与“致命三角”

### 1.1 系统级风险分类（OWASP Top 10 for Agentic Applications 2026）

[OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) 将自主型 AI Agent 面临的关键安全风险归纳为十类（`ASI01`–`ASI10`），覆盖从单步劫持到多智能体级联的完整攻击面：

- **指令与执行劫持**：`ASI01` Agent Goal Hijack（目标劫持）、`ASI02` Tool Misuse & Exploitation（工具滥用）、`ASI05` Unexpected Code Execution（意外代码执行 / RCE）。
- **权限与供应链**：`ASI03` Identity & Privilege Abuse（身份与权限滥用）、`ASI04` Agentic Supply Chain Vulnerabilities（工具、MCP Server、Skill 与插件供应链漏洞）。
- **状态与群体扩散**：`ASI06` Memory & Context Poisoning（长期记忆与上下文投毒）、`ASI07` Insecure Inter-Agent Communication（不安全的智能体间通信）、`ASI08` Cascading Failures（级联失效）、`ASI09` Human-Agent Trust Exploitation（人机信任利用）、`ASI10` Rogue Agents（偏离预期或授权行为的代理）。

`ASI01` 关注目标是否被劫持，`ASI06` 关注上下文或记忆是否受污染（包括跨会话影响），`ASI10` 关注代理是否偏离预期行为。它们不是互斥类别：被污染的记忆也可能导致目标劫持或代理失控（群体失效见 [multiagent-systemic-failure-modes](/concepts/multiagent-systemic-failure-modes)）。

### 1.2 致命三角（The Lethal Trifecta）

Simon Willison 提出的 [The Lethal Trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) 是一项针对**间接提示注入导致私有数据外泄**的威胁判据：当同一个 Agent 工作流同时具备以下三项能力，且不可信内容能够影响外发结果时，就存在数据外泄风险。即使缺少其中一项，提示注入仍可能导致越权写入、错误操作或误导性回复：

1. **私有数据访问（Private Data）**：可读取收件箱、私有仓库、内部数据库、环境变量或受保护文件；
2. **不可信外部输入（Untrusted Content）**：可接触攻击者可控的网页、邮件正文、工单、第三方文档或工具返回结果；
3. **外部通信通道（External Communication / Egress）**：具备发邮件、调用外部 Webhook、提交公开评论、发起任意 HTTP 请求或渲染带查询参数的外部图片 URL 等外发路径。

**[推论] 架构级降维原则**：安全审查的首要问题不是“提示词是否写得足够强硬”，而是**能否在会话或子代理层面主动拆掉三要素中的至少一条边**。三要素必须同时存在的高风险业务流（如处理外部客服工单、查询内部账单后外发回复），应同时隔离规划与不可信内容，并在模型之外限制外发目的地与可披露字段；仅固定计划不等于授权其运行期参数。

## 2. 为何模型层与检测层防御不足

- **指令层级（Instruction Hierarchy）的收益与边界**：Wallace 等（OpenAI，2024，[*The Instruction Hierarchy*](https://arxiv.org/abs/2404.13208)）通过训练让模型按 `system > user > third-party/tool` 的信任等级处理冲突指令，在静态与泛化评测中显著提升了鲁棒性。但它本质上仍是模型权重内部的概率性偏好，而非硬性访问控制。
- **自适应攻击下的经验下限**：Nasr、Carlini、Tramèr 等来自 Google DeepMind、Anthropic、OpenAI 与 ETH Zurich 的研究者在 [*The Attacker Moves Second*](https://arxiv.org/abs/2510.09023)（2025）中证明，使用针对具体防御定制的梯度、强化学习、搜索与人工红队自适应攻击，在越狱与提示注入两类评测中，测试的 12 种近期防御大多以**超过 90% 的攻击成功率（ASR）**被绕过——尽管其中多数防御在静态基线上曾报告接近 0% 的失败率。

**[推论] 不可达性优先于识别率**：检测类护栏与指令微调适合作为纵深缓解与告警信号，但不能充当唯一安全边界。面向生产副作用的防御应把核心问题从“模型能否认出这段文本是恶意指令”转化为“**即使模型被完全诱导，被污染的数据路径在系统代码层也无法触达特权动作**”。

## 3. 确定性架构防御：控制流/数据流隔离与六类模式

### 3.1 CaMeL：控制流/数据流分离与能力安全

Debenedetti 等（Google DeepMind 与 ETH Zurich，2025，[*Defeating Prompt Injections by Design*](https://arxiv.org/abs/2503.18813v2)）提出的 **CaMeL（Capabilities for Machine Learning）** 在 LLM 外围构建了一层确定性系统保护层：

- **特权/隔离双 LLM 分工（Privileged vs. Quarantined LLM）**：特权 LLM 仅读取可信的用户请求，负责生成受限子集 Python 控制流程序并调用工具，**绝不直接阅读不可信工具返回文本**；需要从非结构化外部文本中提取字段时，交由无任何工具权限的隔离 LLM（Quarantined LLM）输出受 Schema 约束的数据值。
- **自定义解释器与能力污点传播（Capability & Provenance Tracking）**：每个运行期变量都携带来源与读者权限元数据（Capabilities）；当外部数据参与计算或拼接时，污点沿数据流自动传播。在调用具备外部副作用的工具前，确定性安全策略（Security Policies）核验实参的来源与允许读者集合，阻断未授权数据外发。
- **实证范围与边界**：论文 v2 在 [AgentDojo](https://arxiv.org/abs/2406.13352)（NeurIPS 2024，97 项任务、629 个安全用例）上报告，最佳配置在论文威胁模型与安全策略下可证明安全地完成约 **77%** 的任务（无防御基线约 **84%**）。该保证假设用户请求可信、记忆未被投毒，不保证已授权的数据流在语义上正确，例如不保证摘要忠实于原文。

**[推论] 与 Code Mode / `ScopeGate` 的架构衔接**：[typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 中的 Code Mode 沙箱与 [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary) 中的 `ScopeGate` 分别解决了“凭据隔离”与“带外参数白名单校验”，但尚未追踪参数值的**数据来源（Provenance）**。在高风险工作流中，可将三者组合为分层防线：沙箱断网能力绑定负责凭证隔离，数据流标记保留来源与许可信息，`ScopeGate` 等模型外门禁据此在动作出口核验来源、目的地与字段，并执行带外白名单、金额上限与幂等约束。

### 3.2 六类抗提示注入架构模式选型

Beurer-Kellner 等（2025，[*Design Patterns for Securing LLM Agents against Prompt Injections*](https://arxiv.org/abs/2506.08837)）系统总结了六种在效用与安全性之间显式权衡的架构模式：

| 架构模式 | 核心隔离机制 | 安全保证边界 | 适用场景与效用代价 |
| :--- | :--- | :--- | :--- |
| **Action-Selector** | LLM 仅充当自然语言到预定义动作列表的翻译器，不接收工具输出回流。 | 免疫来自工具输出的间接注入。 | 固定任务集、无需基于外部结果做开放多步推理。 |
| **Plan-Then-Execute** | 接收可信指令后先固化工具调用计划，再执行；工具输出不可更改既定动作序列。 | 保障控制流完整性（CFI），但仍需防范数据流参数篡改。 | 步骤可预先确定的多步流水线（参考 [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)）。 |
| **LLM Map-Reduce** | 为每份不可信文档派发独立隔离、输出受严格约束（如布尔值/固定枚举）的 Map LLM，由控制节点汇总。 | 限制单份恶意文档向汇总阶段传递任意指令，但错误枚举值仍可影响聚合结果，不得充当特权动作的授权依据。 | 批量文档分类、筛选与受限字段提取。 |
| **Dual LLM** | 特权 LLM 规划并调用工具，隔离 LLM 处理不可信文本，两者通过符号引用（Symbolic Handles）交互。 | 阻断不可信文本直接进入特权规划器上下文。 | 必须同时读写外部内容与调用工具的复杂助手。 |
| **Code-Then-Execute** | 特权 LLM 先生成程序，再由隔离的执行层运行，按需调用无特权的解析器。 | 固定程序不等于约束运行期数据流；需要额外的参数授权或 CaMeL 式能力策略。 | 需要循环、过滤与跨工具编排的场景。 |
| **Context-Minimization** | 完成工具查询或前置路由后，在生成最终回复或进入下游阶段前从上下文中移除原始用户输入或不可信片段。 | 削弱用户侧直接注入或复制粘贴恶意文本对后续阶段的持续影响。 | 客服报价、受限查询转译等分阶段交互。 |

### 3.3 动态权限控制与双格信息流控制（FIDES / Progent 与 CaMeL / ScopeGate 对照）

CaMeL 需要将任务规划编译为受限 Python 子集，对高度交互、动态探索型 Agent 存在表达力与改造成本约束。近期研究从**信息流控制（IFC）**与**动态单调权限策略**两条路径补齐了确定性防护谱系：

- **FIDES（机密性 + 完整性双格 IFC）**：Costa、Köpf、Russinovich 等（Microsoft Research，2025，[*Securing AI Agents with Information-Flow Control*，arXiv:2505.23643](https://arxiv.org/abs/2505.23643)）在 Agent 规划器中建立形式化信息流模型，同时追踪变量的**机密性（Confidentiality）**与**完整性（Integrity）**标签，确定性执行安全策略；同时引入对不可信规划器变量的**选择性隐藏（Selective Hiding）**机制并配合隔离 LLM 查询，在 [AgentDojo](https://arxiv.org/abs/2406.13352) 上平衡了任务完成范围与安全保证。
- **Progent（SMT 验证的单调权限收紧）**：Shi、Song 等（2025/2026 v3，[*Progent: Securing AI Agents with Privilege Control*，arXiv:2504.11703](https://arxiv.org/abs/2504.11703)）将工具级权限表示为关于工具名与参数的符号规则；由 LLM 根据用户任务自动生成初始策略，并在执行中随新信息提议更新。关键在于**每次提议更新均交由 SMT 求解器判定**：若属于**权限收紧（Narrowing）**则自动生效，若属于**权限扩张（Expansion）**则必须获得显式审批。这一机制保证了**单调收紧（Monotonic Confinement）**——在无人工批准时，即使面对对抗输入，Agent 的有效动作空间也只能缩小、不能静默扩张。论文在 AgentDojo 与 ASB 上报告了显著降低攻击成功率同时保持高效用，并在 LangChain 与 OpenAI Agents SDK 中验证了可集成性。

| 防御范式 | 核心强制层 | 策略来源与可变性 | 关键安全不变量 | 适用场景与主要代价 |
| :--- | :--- | :--- | :--- | :--- |
| **CaMeL**（[arXiv:2503.18813v2](https://arxiv.org/abs/2503.18813v2)） | 特权/隔离双 LLM + 自定义解释器 | 预定义能力策略 | 控制流与数据流分离 + 变量能力污点传播 | 可编译为受限程序流的高敏任务；需改造执行引擎 |
| **FIDES**（[arXiv:2505.23643](https://arxiv.org/abs/2505.23643)） | 规划器级双格 IFC + 隔离查询 | 预定义机密性/完整性策略 | 机密性与完整性双标签追踪 + 选择性隐藏不可信变量 | 需同时防泄密与防篡改的多步规划器；依赖准确标签标注 |
| **Progent**（[arXiv:2504.11703](https://arxiv.org/abs/2504.11703)） | 工具调用拦截层 + SMT 策略校验 | 任务初始生成 + 运行期受控更新 | **单调收紧**：无显式审批只允许缩小动作空间 | 开放式多工具 Agent（LangChain 等）；依赖初始策略质量 |
| **`ScopeGate`**（[agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary)） | 副作用出口 PDP/PEP（五阶段默认拒绝） | 操作员带外固定配置 | 带外策略不变性 + 逐次参数值/金额/幂等校验 | 资金、账户与高危外部写入出口；不自动追踪多跳数据污点 |

## 4. MCP 工具供应链与持久记忆投毒边界

### 4.1 MCP 协议与工具元数据攻击面

[Invariant Labs](https://invariantlabs.ai/blog/mcp-security-notification) 与 [MCP-Scan](https://invariantlabs.ai/blog/introducing-mcp-scan) 披露了 MCP 生态的三类结构性攻击，其共同根源在于客户端将外部 Server 提供的自由文本元数据直接混入高信任度的工具选择上下文：

1. **工具描述投毒（Tool Poisoning）**：在 MCP 工具的 `description` 或参数说明中隐藏恶意指令（UI 常折叠或截断，但模型完整读取），诱导 Agent 秘密读取本地敏感文件并借合法参数外传。
2. **批准后静默篡改（Rug Pull）**：MCP Server 在首次接入审查时提供良性工具定义，通过用户确认后在运行期动态改写描述或行为，使一次性审批失效。
3. **跨服务器遮蔽（Cross-Server Shadowing）**：同一 Agent 连接多个 MCP Server 时，低信任 Server 在自身工具描述中植入指令，劫持或重定向发往另一可信 Server（如邮件或代码仓库）的调用。

对照 [Model Context Protocol Security Best Practices (2026-07-28)](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) 与 [MCP Authorization 规范](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)（完整无状态请求模型、OAuth 2.1 受众绑定与 `V_proto / A_aud / H_bind / T_trust` 门禁由 [mcp-stateless-architecture-and-authorization-boundaries](/concepts/mcp-stateless-architecture-and-authorization-boundaries) 单点主维护），MCP 接入层至少应具备以下硬边界：
- **OAuth 2.1 受众绑定、防令牌透传与跨步状态句柄隔离**：远程 Server 强制执行 PKCE `S256`、RFC 8707 `aud` 受众精确匹配与 RFC 9207 `iss` 防混淆，严禁将客户端上游令牌直接透传至下游 API；在 `2026-07-28` 移除 `Mcp-Session-Id` 后，所有分页、MRTR 或异步任务句柄必须与已鉴权主体（`<principal_id>:<handle>`）绑定；第三方 OAuth 代理须按用户维护已批准 `client_id` 同意记录。
- **本地进程沙箱与完整命令确认**：支持一键配置的客户端必须展示完整、未截断的待执行命令和参数，并要求显式确认。规范另建议以最小权限沙箱限制本地进程的文件系统与网络访问；`stdio` 只约束通信方式，本身不是沙箱。
- **工具定义哈希固定、悲观默认注解与分层网关降噪**：`[推论]` 未验证源的 `ToolAnnotations` 一律采用悲观默认（忽略自报 `readOnlyHint: true` 豁免），并对 Schema 与 `description` 做哈希固定（Pinning），发现变化即暂停并重审。[GatewayBench（arXiv:2610.23449v1）](https://arxiv.org/html/2610.23449v1) 实证表明，在 `1,500` 个噪声工具注入场景下，两级分层发现网关相比扁平全量暴露可将间接提示注入攻击成功率（ASR）从 `47.2%` 压降至 `30.9%`（GPT-5.1 上从 `51%` 降至 `16%`），但仍须配合 [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary) 的 `ScopeGate` 按调用校验参数（范式横向对照见 [agent-tool-and-interoperability-paradigms](/comparisons/agent-tool-and-interoperability-paradigms)）。

### 4.2 持久记忆与经验固化投毒（MINJA / PMPA / MemPoison）

当 Agent 具备跨会话长期记忆或经验固化闭环时，一次性注入可转化为持久化后门。三类前提不同的威胁模型需要一并纳入防御假设：

- **仅查询交互投毒（MINJA）**：NeurIPS 2025 论文 [*Memory Injection Attacks on LLM Agents via Query-Only Interaction*（MINJA）](https://arxiv.org/abs/2503.03704) 在实验中发现，无需直接访问记忆数据库，仅通过查询与观察输出也能诱导具备自动记忆写入的 Agent 保存恶意记录。在三类任务 Agent、四类受害者与目标配对的实验设置中，平均记忆注入成功率为 **98.2%**，后续恶意推理诱发成功率为 **76.8%**；后一指标不等于外部系统实际发生越权操作的概率。
- **无直接交互的 Harness 持久投毒（PMPA）**：[*When Malicious Instructions Persist: Persistent Memory Poisoning Attack on Harness-Based Agents*（PMPA，2026-09，arXiv:2609.13889）](https://arxiv.org/pdf/2609.13889) 进一步削弱攻击者前提——攻击者不与受害 Agent 直接对话，只在外部良性来源中嵌入恶意指令；在 OpenClaw 与 Claude Code 上跨多类模型与触发场景评测，平均注入成功率（ISR）与跨会话攻击成功率（C-ASR）分别达到 **73.7% / 55.5%**（OpenClaw）与 **66.9% / 81.7%**（Claude Code）。ISR 的分母是注入试验；C-ASR 的分母是跨会话试验，衡量新会话中已存规则被触发并造成泄露的比例，不是一次外部输入最终造成泄露的概率。论文报告良性任务表现得以维持，但提示级防御对已污染记忆的保护有限。
- **绕过选择性记忆提取与改写（MemPoison）**：ACM CCS 2026 论文 [*MemPoison: Bypassing Selective Memory Mechanisms to Plant Backdoors in LLM Agents*（arXiv:2605.29960）](https://arxiv.org/abs/2605.29960) 通过语义关系桥接、实体伪装与联合嵌入优化，绕过现代 Agent 的选择性记忆提取与重写机制，在评测域与记忆机制中达到最高 **0.95** 的攻击成功率；这表明不能把 LLM 选择性摘要或离线 dreaming 当作唯一安全过滤层。
- **来源洗白与不可变造权限绑定（TMA-NM）**：[*Securing LLM-Agent Long-Term Memory Against Poisoning: Non-Malleable, Origin-Bound Authority with Machine-Checked Guarantees*（2026-06，arXiv:2606.24322）](https://arxiv.org/abs/2606.24322) 揭示了三条 Agent 特有的**来源洗白（Origin Laundering）通道**——自摘要（`L-a`，模型改写外部恶意内容成自有笔记并丢弃来源边）、可信工具回显（`L-b`）与伪造多源印证（`L-c`）。论文使用 TLC 检查有界模型的分离结果 `T1–T3`（`Slots = 3, sessions <= 2, k = 2`；其中 `T3` 检查覆盖 `3,270` 个可达状态）。TLC 检查了归纳不变量的初始条件与保持步骤；参数无关性由作者手工论证，并非对任意参数的机器证明。实验中的内容检测或谱系追踪基线在洗白条件下仍有失败（统一基准中内容/能力 IFC 基线洗白攻击成功率达 **68%**，谱系基线达 **47%**）。TMA-NM 由监控层在写入时按已鉴权通道绑定完整性标签（$\text{untrusted} \sqsubset \text{agent} \sqsubset \text{trusted}$），跨来源派生保留低完整性约束。不可信来源驱动的高影响动作，须获得达到阈值 $k$ 的独立可信印证（论文有界模型取 $k=2$），或取得绑定该动作的一次性用户授权。其构造 `TMA-NM` 在跨模型触发研究中达到 **0% 攻击成功率（0/4,032 次触发）**并保持 **95.9%** 任务效用（对应 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) 中的前向不变量 $I_{\text{taint}}$）；其保证前提是写入通道标注可靠，**不覆盖**跨智能体共享记忆、不触发动作的纯回答偏置，且已受信任工具本身被攻陷仍是主要残余风险。

**[推论] 记忆与经验固化层的抗投毒门禁**：
- **写入路径信任分级**：凡源自外部不可信输入（网页、邮件、第三方工单、未知用户查询）的会话轨迹或未鉴权反馈，不得直接自动写入高信任度的持久记忆、系统规则或活跃 Skill（衔接 [agent-memory-reflection-planning-pipeline](/concepts/agent-memory-reflection-planning-pipeline)、[agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) 与 [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules)）。
- **检索态去特权化**：从长期记忆或向量库召回的历史记录应保留来源元数据（Provenance / Trust Tier），默认视为待核实参考数据而非可执行指令；多租户或共享记忆键必须严格按主体隔离，防止跨用户投毒（五类记忆写入范式的爆炸半径与控制面治理状态完整性评测对照见 [agent-memory-architectures-and-evaluation-benchmarks](/comparisons/agent-memory-architectures-and-evaluation-benchmarks)）。

### 4.3 多智能体委托授权传播与自我复制蠕虫（`ASI07`）

在多智能体编排与跨节点协作场景中（编排拓扑与非对抗性群体失效见 [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns) 与 [multiagent-systemic-failure-modes](/concepts/multiagent-systemic-failure-modes)），安全问题不再局限于单个上下文的提示注入，而是升级为**跨主体权限衰减**与**跨节点自主传播**：

- **授权传播（Authorization Propagation）的独立性**：Tallam（2026-05，[*Authorization Propagation in Multi-Agent AI Systems*，arXiv:2605.05440](https://arxiv.org/abs/2605.05440)）指出，非人类主体在检索、委托与综合过程中维持授权不变量，不能归约为提示注入，也无法仅靠传统 RBAC/ABAC/ReBAC 解决。论文将其拆解为三类子问题——**传递委托（Transitive Delegation）**、**聚合推断（Aggregation Inference）**与**时效有效性（Temporal Validity）**——并指出在企业级生产平台中，即便没有恶意攻击者，普通工作流行为也会触发授权传播失效。
- **委托链与组合闭包（Bounded Agents / APC）**：Muruaga（2026-08，[*Bounded Agents: Delegation Security for Multi-Agent AI Systems*，arXiv:2608.15888](https://arxiv.org/abs/2608.15888)）指出，若仅在会话开始静态赋权并孤立检查单次调用，Agent 仍可将多个单独合法的动作组合成越权结果，或向子代理无衰减地转授权限。其提出的 **Agentic Principal Chain（APC）** 沿委托链逐跳传递并收窄权限与预算，利用**组合闭包（Composition Closure）**对照累积会话状态在模型外执行六项授权检查，并在完备限制集与串行准入前提下证明了**爆炸半径单调性（Blast Radius Monotonicity）**与组合可靠性。在涵盖 InjecAgent、AgentDojo 与 ASB 的 **3,154** 个评测实例中（含跳过模型判断直接插入攻击调用的失陷模型测试），APC 将 AgentDojo 四个领域的数据外泄率从 **75–100%** 降至 **0%**，拦截了全部 **544** 例 InjecAgent 窃密用例；意图绑定将破坏类攻击从 **38.6%** 降至 **4.0%**、操纵类攻击从 **90.5%** 降至 **12.1%**；空闲宿主 p99 授权延迟为 **0.24 ms**，在 949 组 AgentDojo 任务—注入对上的效用代价为 **8.6** 与 **13.9** 个百分点。
- **跨生态自我复制蠕虫（AgentWorm）**：Zhang 等（2026-03/07 v3，[*AgentWorm: Self-Propagating Attacks Across LLM Agent Ecosystems*，arXiv:2603.15727](https://arxiv.org/abs/2603.15727)）在 OpenClaw（超过 40,000 活跃实例的开源 Agent 平台）上展示了首个生产级自我复制蠕虫：单条消息先劫持受害者的核心配置以建立跨重启持久化驻留，再在每次重启执行任意载荷，并自动向所有新接触的对等节点传播。在 5 个 LLM 底座、3 类感染向量与 3 类载荷的受控测试床上，综合攻击成功率达 **63%**；虽然执行级过滤可缓解休眠载荷，但 **Skill 供应链普遍脆弱**，且对公开配置的生态级测量显示能够打断感染环的关键安全控制**在观测部署中均未启用**。论文在 **Hermes Agent** 上的跨框架迁移实验进一步证实，该脆弱性源于自主 Agent 的持久化配置 + 跨节点通信设计模式，而非单一实现缺陷。

**[推论] 多智能体跨边界委托与断链门禁**：
- **默认衰减委托与跨协议身份保持**：父 Agent 派发子 Agent 或跨 A2A 边界调用时，必须显式签发范围与预算严格收窄的委托上下文（$P_{\text{child}} \subseteq P_{\text{parent}}$），禁止隐式继承完整会话凭据或无上限预算；针对 [A2ABreak（ACSAC '26，arXiv:2609.10871v1）](https://arxiv.org/html/2609.10871v1) 在 37 态协议状态机模型检验中检出的 11 类规范级漏洞，网关须额外强制 `<principal, contextId>` 归属绑定、跨多跳执行 RFC 8693 OBO 换票（同时保留原始主体 `sub` 与代理链 `act`）且不把 `AgentCard` 的 JWS 域名签名当作能力真实性背书（详见 [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns) 与 [agent-tool-and-interoperability-paradigms](/comparisons/agent-tool-and-interoperability-paradigms)）。
- **跨步组合检查**：对高敏会话在模型外维护累积状态账本，拦截“读高敏数据 → 外发”等跨步禁止组合，而不只检查单个工具是否在白名单内。
- **核心配置与跨节点通信隔离**：禁止由外部入站消息或未鉴权对等节点触发的会话直接修改核心持久化配置、启动钩子或活跃 Skill；跨节点自动转发须受显式速率限制与人工/策略审批约束。

## 5. `[推论]` 生产 Agent 安全评估与落地检查表

结合 [AgentDojo](https://arxiv.org/abs/2406.13352) 与 [The Attacker Moves Second](https://arxiv.org/abs/2510.09023) 的评测教训，评估安全边界时不得只看“模型是否口头拒绝静态注入模板”，而应同步度量**良性效用（Benign Utility）、受攻击效用与真实工具轨迹攻击成功率（ASR）**，并在高风险场景下引入自适应红队测试（部署前探针归属见 [agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging)）：

| 检查层 | 核心问题 | 最小工程门禁 |
| :--- | :--- | :--- |
| **1. 致命三角审计** | 同一上下文是否同时拥有私有数据、不可信输入与外发通道？ | 优先拆断其中一条边；必须保留三项能力时，隔离不可信内容与规划器，并在外发出口按来源、目的地和可披露字段独立授权。 |
| **2. 控制流与数据流边界** | 不可信文本能否直接决定下游工具选择或填充敏感参数？ | 分离规划器与文本解析器；对敏感外发/写入动作实施来源校验与 `ScopeGate` 带外参数白名单。 |
| **3. MCP 与 Skill 供应链** | 工具定义或脚本在批准后是否可能静默变更或跨源遮蔽？ | 按来源固定工具元数据、沙箱限制本地进程的文件系统和网络权限、高风险动作前置人工审批（见 [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries)）。 |
| **4. 记忆与反思写入隔离** | 外部不可信内容能否经由摘要或反思沉淀为长期规则？ | 对记忆写入强制标注来源与信任等级，禁止未经核验的外部会话自动晋升至默认注入层或活跃 Skill。 |
| **5. 自适应回归验证** | 安全测试是否仅覆盖固定话术且只检查回复文本？ | 检查真实工具调用轨迹与权威系统状态有无越权副作用，按风险等级定期运行变体/自适应攻击用例。 |

### 5.1 `[推论]` 参数化安全架构裁决矩阵（`E_tri / M_mono / I_iso / S_gui / I_taint`）

`[推论]` 为将本页的威胁模型、确定性隔离模式与相邻页面的治理边界（[agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary) 的 `ScopeGate`、[agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries) 的枢轴事务 $T_{\text{pivot}}$ 与凭据隔离、[agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) 的 $I_{\text{taint}}$）收束为统一审查口径，在评估高自主权 Agent 接入或变更权限时，可按以下五项架构判据逐项核验（不预设跨项目硬编码默认数值）：

| 参数符号 | 治理维度 | 门禁裁决条件（Security Architecture Gate） | 违背时的典型退化与处置动作 |
| :--- | :--- | :--- | :--- |
| $E_{\text{tri}}$ | **致命三角暴露度（Lethal Trifecta Exposure）** | 优先在会话或子代理层面拆断“私有数据 × 不可信输入 × 外发通道”至少一条边；三边必须共存时，强制规划与解析隔离（CaMeL / FIDES / Dual LLM）+ 外发出口白名单 | 仅靠提示词防线导致自适应攻击高 ASR 外泄；降级为隔离解析并收紧外发目的地与字段白名单 |
| $M_{\text{mono}}$ | **单调权限收敛与组合闭包（Monotonic Confinement & Delegation）** | 运行期策略更新与跨 Agent 委托满足 $P_{\text{child}} \subseteq P_{\text{parent}}$ 且无显式审批只能收紧不能扩张（Progent SMT / APC 委托链），并在模型外校验跨步禁止组合 | 静默提权、跨步组合越权或子代理继承环境权威；引入带外单调校验、预算上限与串行组合闭包门禁 |
| $I_{\text{iso}}$ | **执行隔离与凭据边界（`ASI05` Sandbox & Secret Boundary）** | 执行不可信代码或外部脚本的运行面与宿主机内核及控制面凭据隔离，明文密钥留在沙箱外网关/代理层，出口按目标域名或端点最小化放行（隔离谱系见 [agent-execution-sandboxing-and-browser-isolation](/concepts/agent-execution-sandboxing-and-browser-isolation)） | 沙箱逃逸或环境变量凭据遭注入外泄；升级至强隔离运行时并将凭据移出执行环境 |
| $S_{\text{gui}}$ | **非文本/浏览器语义中介（GUI & Browser Action Mediation）** | 鉴权浏览器或 GUI 会话不以裸点击/视觉判断充当安全边界，对高风险写操作与站点权限在协议或动作语义层实施最小授权与会话隔离（视觉注入与 HTTP 语义沙箱见 [agent-execution-sandboxing-and-browser-isolation](/concepts/agent-execution-sandboxing-and-browser-isolation)） | 视觉/DOM 间接注入劫持已登录账户执行越权操作；拆分独立无鉴权浏览上下文并对写端点前置确认 |
| $I_{\text{taint}}$ | **跨会话与跨代理防洗白（Non-Malleable Origin Binding）** | 继承 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) 的完整性格约束 $D(\tau(x)) \sqsubseteq D(x)$，并将来源绑定延伸至跨节点消息、核心持久化配置与活跃 Skill 写入路径 | 持久记忆投毒或 AgentWorm 级配置劫持与自我复制扩散；阻断不可信轨迹自动改写核心配置/活跃规则并打断自动转发环 |

## 证据边界与不推广事项

- 本文引用的 CaMeL v2（最佳配置约 77% 安全完成率）、MINJA（98.2% 注入率 / 76.8% ASR）、PMPA（OpenClaw 73.7% ISR / 55.5% C-ASR、Claude Code 66.9% ISR / 81.7% C-ASR）、MemPoison（最高 0.95 ASR）、TMA-NM（0/4,032 攻击成功 / 95.9% 效用；依赖可信通道标注前提且排除跨智能体共享记忆与纯回答偏置）、Bounded Agents / APC（3,154 实例、AgentDojo 0% 外泄、544/544 InjecAgent 拦截、p99 延迟 0.24 ms 与 8.6–13.9 pp 效用代价；组合可靠性限定在完备限制集与串行准入前提）、AgentWorm（63% 综合 ASR 及 Hermes Agent 跨框架迁移实证）与自适应攻击绕过率（>90%）均为特定论文基准、模型、框架与攻击协议下的实验观测值，不代表任意生产系统的固定安全指标或默认验收阈值。
- 2026-11-24 局部增补的 5 篇预印本（[FIDES](https://arxiv.org/abs/2505.23643)、[Progent](https://arxiv.org/abs/2504.11703)、[Authorization Propagation](https://arxiv.org/abs/2605.05440)、[Bounded Agents / APC](https://arxiv.org/abs/2608.15888)、[AgentWorm](https://arxiv.org/abs/2603.15727)）核对范围为公开 arXiv 摘要页，2026-11-25 局部增补的 [GatewayBench](https://arxiv.org/html/2610.23449v1) 与 [A2ABreak](https://arxiv.org/html/2609.10871v1) 核对范围为公开 arXiv HTML 正文，均不表示独立复现实验，也不刷新本页原有页面级 `verified_at` 与 `review_by`。
- [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) 与 [MCP Security Best Practices (2026-07-28)](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) 属于持续演进的行业规范；接入具体框架或协议版本时须核对当前官方规范与实际 SDK 行为。
- 本页提供架构审查与安全设计参照，不构成对任何现有 Agent 运行时、MCP 配置或沙箱策略的自动修改授权。

## Relations

- depends_on: [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)
- related: [agent-execution-sandboxing-and-browser-isolation](/concepts/agent-execution-sandboxing-and-browser-isolation), [agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging), [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries), [agent-memory-reflection-planning-pipeline](/concepts/agent-memory-reflection-planning-pipeline), [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops), [agent-memory-architectures-and-evaluation-benchmarks](/comparisons/agent-memory-architectures-and-evaluation-benchmarks), [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules), [multiagent-systemic-failure-modes](/concepts/multiagent-systemic-failure-modes), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order), [mcp-stateless-architecture-and-authorization-boundaries](/concepts/mcp-stateless-architecture-and-authorization-boundaries), [agent-tool-and-interoperability-paradigms](/comparisons/agent-tool-and-interoperability-paradigms)

