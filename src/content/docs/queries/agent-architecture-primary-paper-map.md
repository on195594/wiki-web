---
title: Agent Architecture Primary-Paper Map
created: 2026-08-15
updated: 2026-11-25
type: query
tags:
  - agent
  - research
  - architecture
  - decision
sources:
  - raw/papers/arxiv-2210-03629-react.md
  - raw/papers/arxiv-2302-04761-toolformer.md
  - raw/papers/arxiv-2304-03442-generative-agents.md
  - raw/papers/arxiv-2305-16291-voyager.md
  - raw/papers/arxiv-2308-08155-autogen.md
  - docs:https://arxiv.org/abs/2310.01798
  - docs:https://arxiv.org/html/2304.05128v2
  - docs:https://arxiv.org/html/2303.11366v4
  - docs:https://arxiv.org/html/2409.12917
  - https://arxiv.org/abs/2402.01030
  - https://arxiv.org/abs/2504.13171
  - https://arxiv.org/abs/2503.18813v2
  - https://arxiv.org/abs/2504.11703
  - https://arxiv.org/abs/2506.07982
  - https://arxiv.org/html/2602.12670v4
  - https://arxiv.org/html/2610.41905v1
status: stable
description: 按 Agent 设计问题检索第一代架构奠基论文（ReAct、Toolformer、Generative
  Agents、Voyager、AutoGen）与 2024–2026 第二代生产原语（CodeAct、Sleep-time
  Compute、CaMeL/Progent、τ²-Bench、SkillsBench、COLT）的机制与定量边界。
aliases:
  - agent-primary-paper-map
  - agent-architecture-paper-map
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Agent Architecture Primary-Paper Map

## Summary

这五篇论文分别提供推理—行动轨迹、训练时工具学习、记忆—反思—规划、环境反馈与可执行技能、多 Agent 会话编排的一手证据。它们适合作为 Agent 架构设计的检索坐标，但研究对象分属提示范式、训练方法、行为架构、具身系统和应用框架，并不是互斥且完备的 taxonomy。

## Problem-oriented map

表中公式用于概括机制；除论文明确给出的目标或评分规则外，动作轨迹与会话图等记号为本页的工程化表达，不是可靠性定理。

| 设计问题 | 一手论文 | 研究层级 | 可复用机制与形式化核心 | 论文定量证据与外推边界 |
| --- | --- | --- | --- | --- |
| 推理何时应与环境取证交替？ | [arxiv-2210-03629-react](https://github.com/on195594/wiki/blob/4d684be23833410aa458f656d542e1a691d5ca08/raw/papers/arxiv-2210-03629-react.md) | 提示与轨迹控制 | 扩展动作空间 $\hat{\mathcal{A}} = \mathcal{A} \cup \mathcal{L}$，基于轨迹 $c_t = (o_1, a_1, \dots, o_t)$ 交替执行稀疏内部推理（$a_t \in \mathcal{L}$）与外部动作（$a_t \in \mathcal{A}$） | HotpotQA 上 ReAct EM 为 `27.4%`（低于 CoT 的 `29.4%`），FEVER 上为 `60.9%`（高于 CoT 的 `56.3%`）；检索为空或噪声会诱发循环偏航，需 `ReAct ↔ CoT-SC` 混合回退 |
| 模型怎样在训练中获得工具调用行为？ | [arxiv-2302-04761-toolformer](https://github.com/on195594/wiki/blob/4d684be23833410aa458f656d542e1a691d5ca08/raw/papers/arxiv-2302-04761-toolformer.md) | 训练与数据构造 | 自监督采样候选 API 调用 $c_i$、执行得结果 $r_i$，按加权未来 token 交叉熵损失下降 $\min(L_i(\varepsilon), L_i(e(c_i))) - L_i(e(c_i, r_i)) \ge \tau_f$ 过滤微调集 | 启用/禁用 API 时语言建模困惑度基本不退化（Table 8），但仅支持单步独立调用，不支持多步工具链、交互重查、Schema 门禁或调用成本路由 |
| 经历怎样形成持续行为状态？ | [arxiv-2304-03442-generative-agents](https://github.com/on195594/wiki/blob/4d684be23833410aa458f656d542e1a691d5ca08/raw/papers/arxiv-2304-03442-generative-agents.md) | 记忆与行为架构 | 记忆流 + 三因子 Min–Max 归一化检索 $s(m_i, q) = \alpha_{\text{rec}}\widehat{\text{Rec}} + \alpha_{\text{imp}}\widehat{\text{Imp}} + \alpha_{\text{rel}}\widehat{\text{Rel}}$（$\text{Rec} = 0.995^{\Delta t}$）+ 累积重要性超阈值（`150`）触发反思与分层规划 | 25 个智能体在 Smallville 模拟 2 天耗费数千美元 Token；100 名人类评估者验证的是短期行为可信度（Believability），而非事实准确性或抗提示注入能力 |
| 可执行能力怎样通过环境反馈积累？ | [arxiv-2305-16291-voyager](https://github.com/on195594/wiki/blob/4d684be23833410aa458f656d542e1a691d5ca08/raw/papers/arxiv-2305-16291-voyager.md) | 具身持续学习系统 | 自动课程 + 可执行 JS 代码生成 + 环境状态/解释器报错反馈；由 GPT-4 自验证 Critic 判断任务成功后入库，并非独立环境 oracle 与 Critic 的双重布尔验收 | 在 Minecraft 高层 Mineflayer API 下解锁更多独特物品并支持跨新世界迁移；但 GPT-4 成本约为 GPT-3.5 的 `15` 倍，且课程、生成代码与自验证 Critic 均可能误判 |
| 多 Agent 交互怎样成为可编程工作流？ | [arxiv-2308-08155-autogen](https://github.com/on195594/wiki/blob/4d684be23833410aa458f656d542e1a691d5ca08/raw/papers/arxiv-2308-08155-autogen.md) | 应用编排框架 | 可对话智能体图 $\mathcal{G} = (\mathcal{V}_{\text{agents}}, \mathcal{E}_{\text{conv}}, \Pi_{\text{reply}})$，用自然语言与代码混合编排 LLM、人类与工具执行器 | ALFWorld 引入 Grounding Agent 较双 Agent 平均提升 `15%`；100 题安全编码集分离 Writer 与 Safeguard 使不安全代码识别 F1 在 GPT-4 上提升 `8%`、GPT-3.5 上提升 `35%`，但不证明多 Agent 默认优于单 Agent |

## 第二代生产架构与安全评测原语映射（2024–2026）

2024–2026 年的研究重心从“能否让模型调工具、记流水账、做多代理对话”转向**程序化动作空间、离线经验重整、确定性权限隔离、双控状态验证与技能/工具规模化检索边界**。下表增补对应的一手文献坐标（公开摘要与 HTML 正文于 `2026-11-25` 局部核对，本页既有页面级 `verified_at` 保持不变）：

| 生产工程问题 | 一手论文与会议 | 归属 Wiki 主维护页 | 核心机制与形式化抽象 | 论文定量证据与外推边界 |
| --- | --- | --- | --- | --- |
| 多步确定性数据流如何避免逐轮 JSON 搬运？ | [CodeAct（ICML 2024，arXiv:2402.01030）](https://arxiv.org/abs/2402.01030) | [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)、[agent-tool-and-interoperability-paradigms](/comparisons/agent-tool-and-interoperability-paradigms) | 将动作空间统一为受控沙箱内的可执行 Python 代码，原生复用控制流、变量存储与报错自调试 | 评估 17 个 LLM；M3ToolEval（82 任务）上最高提升 **`20%`** 成功率并缩减 **`30%`** 轮次（`gpt-4-1106-preview` 达 `74.4%` vs JSON `52.4%`，平均 `5.5` 轮）；强依赖执行沙箱隔离 |
| 何时用离线空闲算力换取在线推理延迟与成本下降？ | [Sleep-time Compute（2025，arXiv:2504.13171）](https://arxiv.org/abs/2504.13171) | [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops)、[hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture) | 在交互间隙预先重组上下文与派生表示，将计算从测试期前移至离线睡眠期 | Stateful GSM-Symbolic / AIME 同等准确率下测试期计算降约 **`5×`**；Multi-Query（单上下文 10 查询、测试/睡眠单价比 $10\times$）单查询成本降 **`2.5×`（即降至 `40%`）**；收益取决于未来查询可预测性 |
| 如何在系统代码层阻断间接提示注入与越权工具调用？ | [CaMeL（IEEE SaTML 2026，arXiv:2503.18813v2）](https://arxiv.org/abs/2503.18813v2) · [Progent（v3 2026，arXiv:2504.11703）](https://arxiv.org/abs/2504.11703) | [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense) | CaMeL 分离特权 P-LLM 与无权限 Q-LLM 并追踪变量能力污点；Progent 用 Z3 SMT 求解器保证策略更新满足**单调收紧** $\mathcal{A}(P') \subseteq \mathcal{A}(P)$ | CaMeL v2 在 AgentDojo 以可证明安全完成 **`77%`** 任务（无防御 `84%`）；Progent 在 Auto-Approve 最坏假设下将 AgentDojo ASR 从 **`39.9%` 压至 `1.0%`**、ASB 从 **`70.3%` 压至 `3.9%`**；均不覆盖纯文本回答偏置 |
| 用户与 Agent 共同修改世界状态时如何可靠评测？ | [$\tau^2$-Bench（2025，arXiv:2506.07982）](https://arxiv.org/abs/2506.07982) | [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification) | 基于 Dec-POMDP 的**双控环境**：Agent 与用户模拟器各自调用专属工具共同修改共享世界状态 $\mathcal{S}_{\text{world}}$，并以 $\text{pass}^k$ 度量连续可靠率 | Telecom 域（114 任务）`gpt-4.1` $\text{pass}^1$ 仅 **`34%`**（Retail `74%`），且从单控（No-User）切至双控下降 **`18` 个百分点**（`o4-mini` 降 `25` pp）；揭示协调用户动作是主要生产瓶颈 |
| 程序性 `SKILL.md` 模块粒度与运行时自生成效果如何？ | [SkillsBench（2026，arXiv:2602.12670v4）](https://arxiv.org/html/2602.12670v4) | [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state)、[agent-tool-and-interoperability-paradigms](/comparisons/agent-tool-and-interoperability-paradigms) | 在 87 任务 × 18 配置（`9,396` 次试验）上对照无 Skill、人工精编不同粒度 Skill 与运行时模型自生成 Skill | 精编 Skill 平均提分 **`+16.6` pp**（`1–3` 个紧凑模块最优 `+19.0~21.5` pp，长文档仅 `+0.7` pp），而**运行时自生成 Skill 反降 `-8.1~-11.5` pp** |
| 百级以上工具池检索为何在多步任务上频繁失效？ | [Multi-Tool Retrieval / COLT（2026，arXiv:2610.41905v1）](https://arxiv.org/html/2610.41905v1) | [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture) | 将单工具相似度检索升级为覆盖隐式“生产者 → 消费者”依赖链的集合完备召回 $P(\mathcal{T}_q^* \subseteq \mathcal{C}_K)$ | 单步 Top-$K$ 在 AppWorld（$k=16$）完备率 **`≤9.6%`**（`162/241` 漏掉前置生产者工具）；集合级 COLT 零 LLM 调用达 **`32.8%`**（MCP-Bench 达 **`58.3%`**） |

## Cross-paper distinctions

### Capability is not one layer

- ReAct changes an inference trajectory.
- Toolformer changes how a model is trained to emit and consume API calls.
- Generative Agents defines a state-processing architecture for simulated behavior.
- Voyager builds an environment-coupled program and skill-acquisition system.
- AutoGen supplies an application framework for message-based coordination.

A workflow may combine several of these ideas, but combining labels does not prove that the resulting system is reliable.

### External evidence creates new failure paths (and separates grounded debugging from intrinsic self-correction)

ReAct and Voyager show why environment interaction can ground or correct model behavior. Prompt-only **intrinsic self-correction** degraded accuracy in several settings evaluated by [Huang et al. (`arXiv:2310.01798`)](https://arxiv.org/abs/2310.01798), but this is not a universal impossibility result: [SCoRe (`arXiv:2409.12917`)](https://arxiv.org/html/2409.12917) improves intrinsic correction through multi-turn RL training without requiring external correctness feedback at test time. [Self-Debugging (`arXiv:2304.05128`)](https://arxiv.org/html/2304.05128v2) studies explanation and feedback mechanisms, reporting gains of 2–3 percentage points on Spider and up to 12 on code benchmarks with unit tests. [Reflexion (`arXiv:2303.11366`)](https://arxiv.org/html/2303.11366v4) converts evaluation signals into episodic verbal reflections; those signals may come from environments, heuristics or LLM self-evaluation, not necessarily a deterministic oracle. Retrieval, environment feedback, generated code and success verification can themselves be wrong. `[推论]` For engineering delivery, prefer executable checks, paired `Fail-to-Pass` / `Pass-to-Pass` regression artifacts ([agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation)), and authoritative readback over model confidence alone, without treating tool access as a correctness guarantee. See [agent-self-validation-loops](/concepts/agent-self-validation-loops) and [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification).

### Tool learning is not tool governance

Toolformer studies training-time acquisition. AI Agent must additionally control tool visibility, schema, permissions, cost, execution results and fallback at runtime. See [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture) and [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries).

### Memory for simulated behavior is not AI Agent default memory

The Generative Agents memory stream is an application-owned event store used to generate behavior. AI Agent routes session state, durable knowledge, procedures and stable user/environment facts to different layers. See [agent-memory-reflection-planning-pipeline](/concepts/agent-memory-reflection-planning-pipeline) and [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries).

### Multi-agent is a topology choice

AutoGen shows that roles and message patterns can modularize applications, while its open questions preserve the need to choose topology by cost, latency, verification and risk. See [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs) and [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns).

## How to use this map

1. Start from the design problem, not the paper or framework name.
2. Read the corresponding raw paper record and its evidence boundary.
3. Follow the linked concept page for the portable Agent design interpretation.
4. Treat source-specific thresholds, benchmarks and model results as historical evidence, not current defaults.
5. Require project-local evidence before changing active skills, runtime, delegation, memory, MCP, cron or gateway behavior.

## Relations

- refines: [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering)
- related: [agent-development-lifecycle](/concepts/agent-development-lifecycle), [agent-memory-reflection-planning-pipeline](/concepts/agent-memory-reflection-planning-pipeline), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture), [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs), [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework), [llm-engineering-knowledge-map](/concepts/llm-engineering-knowledge-map), [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense), [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops), [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state), [agent-tool-and-interoperability-paradigms](/comparisons/agent-tool-and-interoperability-paradigms)

