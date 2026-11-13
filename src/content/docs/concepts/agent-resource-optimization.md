---
title: Agent Resource Optimization
created: 2026-05-21
updated: 2026-11-11
type: concept
tags:
  - agent
  - llm
  - optimization
  - workflow
  - research
  - model-profiles
sources:
  - raw/articles/towardsdatascience-agent-planning-operations-research-2026-05-20.md
  - raw/articles/langchain-model-router-in-harness-2026-10-01.md
  - https://arxiv.org/abs/2305.05176
  - https://arxiv.org/html/2406.18665v4
status: stable
description: 说明预算与能力约束下的 Agent 运筹规划（ILP），结合 FrugalGPT 级联停止与 RouteLLM
  偏好阈值路由形式化模型分层及 C_cov / R_route / P_tool / M_margin 裁决矩阵。
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
aliases:
  - agent-resource-routing
  - model-routing-optimization
---

# Agent Resource Optimization

## Summary

多 Agent / 自动化系统的规划问题可以先视为资源约束下的优化问题：在预算、能力覆盖、延迟、容量和风险限制内，决定保留哪些 Agent、把任务分配给谁、以及请求如何路由。这个概念补充 [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs) 的拓扑取舍和 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 的成本/延迟观测层。

模型分层的目标不是最低调用单价，而是在质量约束下降低任务完成成本。Open SWE 的线上案例提供了任务差异化路由的有限证据，不证明所有系统需要分类器或能够获得相同收益。

## Core principle

不要凭直觉堆 Agent、模型或工具。先把系统约束翻译成：

- 决策变量：哪些 Agent 被启用，任务分给谁，请求走哪条路径。
- 约束条件：预算、能力覆盖、Token、延迟、容量、人类审核负担、失败风险。
- 目标函数：最小化成本、最大化任务价值、最大化能力覆盖，或在给定预算下最大化产出。

这页编译自 [towardsdatascience-agent-planning-operations-research-2026-05-20](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/towardsdatascience-agent-planning-operations-research-2026-05-20.md)。原文使用 Python + Gurobi 展示运筹学建模方式，但工具不是本页重点；可复用的是建模边界。

## Four optimization frames

### 1. Set covering: ability coverage

问题：用尽量少的 Agent 覆盖所有必要能力。

AI Agent 含义：当 skill、脚本、subagent 角色变多时，不应只问“还缺哪个 Agent”，还要问“现有 Agent 是否已经覆盖需求、是否有冗余重叠”。集合覆盖适合做能力盘点和合并候选识别。

### 2. Assignment: task-to-agent matching

问题：把每个任务或项目分配给最合适的 Agent，以最大化总价值或成功率。

AI Agent 含义：复杂任务不一定需要更多 Agent，而是需要更清楚的分派准则：哪个 worker 处理研究、哪个处理代码审查、哪个处理验证；父 agent 仍负责综合与最终验证。

### 3. Knapsack: budget-constrained selection

问题：在固定预算内选择收益最高的一组 Agent。

AI Agent 含义：预算不只包含 API 成本，也包括上下文窗口、执行时间、人类注意力、验证成本和失败恢复成本。适合评估哪些 automation 值得保留，哪些只能作为候选或手动流程。

### 4. Network flow / routing: constrained request movement

问题：在节点容量、通信成本和需求量约束下规划请求流向。

AI Agent 含义：如果未来出现高频路由、模型分层、轻重任务分流或本地/云模型混合调用，网络流视角比简单 round-robin 更合适。但它必须先经过项目级验证，不能直接变成 runtime 默认规则。

### 运筹学整数规划（ILP）与 FrugalGPT / RouteLLM 路由形式化

将上述四类规划视角与模型分层结合，可在运筹学与机器学习路由理论（Lingjiao Chen, Matei Zaharia & James Zou, *FrugalGPT*, arXiv 2023 / *TMLR* 2024, [arXiv:2305.05176](https://arxiv.org/abs/2305.05176)；Isaac Ong et al., arXiv 2024 / ICLR 2025, *RouteLLM: Learning to Route LLMs with Preference Data*, [arXiv:2406.18665v4](https://arxiv.org/html/2406.18665v4)）下写出显式数学形式：

1. **能力覆盖与预算背包的整数线性规划（Set-Covering & Knapsack ILP）**：
   设候选 Agent/Skill 集合为 $j \in \{1, \dots, M\}$（启用成本 $c_j$，受预算约束的资源占用如上下文 token 或并发槽位 $w_j$，能力覆盖矩阵 $a_{ij} \in \{0, 1\}$ 表示候选 $j$ 是否具备必需能力 $i \in \{1, \dots, K\}$），决策变量 $x_j \in \{0, 1\}$ 表示是否启用候选 $j$。最小成本全覆盖问题为：
   $$\min_{\mathbf{x} \in \{0,1\}^M} \sum_{j=1}^{M} c_j x_j \quad \text{s.t.} \quad \sum_{j=1}^{M} a_{ij} x_j \ge 1 \;\; (\forall i \in \{1, \dots, K\}), \quad \sum_{j=1}^{M} w_j x_j \le B_{\text{budget}}$$
   **[推论]** 当两个 Skill 或 Subagent 的能力列向量 $\mathbf{a}_{\cdot, j_1} \approx \mathbf{a}_{\cdot, j_2}$ 高度共线时，同时保留两者不会扩大约束左端覆盖度，反而平白消耗预算 $B_{\text{budget}}$ 并推高工具选择的扇出干扰（见 [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture)）。
2. **偏好阈值二元路由（RouteLLM）与级联停止（FrugalGPT）**：
   - **单步阈值路由（RouteLLM，[arXiv:2406.18665v4](https://arxiv.org/html/2406.18665v4)）**：在强模型 $M_{\text{strong}}$ 与弱模型 $M_{\text{weak}}$ 之间，路由器用偏好数据学习强模型回答优于弱模型的概率 $\hat{P}_\theta(\text{win}_{\text{strong}} \mid q)$，按成本阈值 $\alpha \in [0, 1]$ 选择模型：$R_\alpha(q) = M_{\text{strong}}$ 若 $\hat{P}_\theta(\text{win}_{\text{strong}} \mid q) \ge \alpha$，否则选 $M_{\text{weak}}$（$\alpha$ 越高，调用强模型的比例越低）；
   - **序贯级联（FrugalGPT，[arXiv:2305.05176](https://arxiv.org/abs/2305.05176)）**：按成本递增顺序 $M_1, \dots, M_L$ 依次调用，每步由可靠性评分函数 $g_l(q, y_l) \ge \theta_l$ 决定是否提前停止返回，否则升级至下一模型 $M_{l+1}$；
   - **[推论] 含返工与缓存折损的全链路期望成本**：单看单次 Token 差价会高估路由收益。计入路由器开销 $C_{\text{router}}$、弱模型失败引发的重试/升级概率 $p_{\text{escalate}}(q)$、中途换模导致的 Prompt Cache 失效惩罚 $\Delta C_{\text{cache}}$ 以及工程师返工成本 $C_{\text{rework}}$ 后，路由策略对查询 $q$ 的真实期望成本为：
     $$\mathbb{E}[C_{\text{route}}(q)] = C_{\text{router}} + \mathbb{I}(R_\alpha(q) = M_{\text{weak}})\Big(C_{\text{weak}}(q) + p_{\text{escalate}}(q)\big(C_{\text{strong}}(q) + \Delta C_{\text{cache}} + C_{\text{rework}}\big)\Big) + \mathbb{I}(R_\alpha(q) = M_{\text{strong}})C_{\text{strong}}(q)$$
     只有当 $\mathbb{E}_{q}[C_{\text{route}}(q)] < \mathbb{E}_{q}[C_{\text{strong}}(q)]$ 且质量通过非劣效检验（见 [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines) 的 $\delta_{\text{NI}}$）时，动态模型路由才成立。

## 任务上下文驱动的模型分层：Open SWE 案例

### 来源与机制

LangChain 的 Sydney Runkle、Eugene Yurtsev 在 [langchain-model-router-in-harness-2026-10-01](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/langchain-model-router-in-harness-2026-10-01.md)（2026-10-01）报告其内部编码 Agent Open SWE 的路由实验。这是工程博客与作者自报的线上结果，不是学术论文或独立复现。

其路径是：分析真实任务与成本 → 沿能力/成本曲线选择少量候选模型 → 用任务特定准则分类 → 同时跟踪成本与任务结果。成本和调用次数只是复杂度代理；调用多也可能源于模型能力不足。实现仅在首条用户消息选择模型，并沿用整个会话。

作者主张将选模放在 Harness，因为它通常拥有任务、提示词、工具和领域上下文。**[推论] 可迁移原则是由拥有足够任务上下文的层负责适配决策，而不是禁止网关参与。** 如果网关获得了必要上下文，物理位置本身不能决定路由质量。

### 作者报告的证据与反例

- 973 个会话的 50/50 A/B 测试，对照组始终使用最强模型；路由组会话 LLM 成本中位数下降 64%，平均成本下降 42%，P90 下降 37%。这是相对该基线的案例结果，不是总运营成本或跨场景收益承诺。
- 每会话产生已合并 PR 的比例为路由组 29.2%、对照组 27.3%（p = 0.49）。未发现显著差异不证明质量等价，也不覆盖问答质量、缺陷、返工或人工审查负担；评估口径见 [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)。
- 另一轮 50/50 路由与全量快速模型对照，因快速模型组输出质量影响工程师效率，在一天内提前结束，没有统计意义的结果。它是该场景下反对无差别低价替代的定性警示，不是所有轻量模型不可用的证明。

### 适用判断与局限

**[推论]** 任务差异明显且真实成本问题值得处理时，可把任务到模型的匹配作为候选优化；先确认已有固定规则或分流是否够用，再考虑分类器。判断收益应计入分类、重试、验证、返工与人工负担，不能只比较每 Token 单价或成功样本。

首轮静态选模不能应对后续意图变更；子 Agent 在该实现中独立选模；中途换模可能折损上下文缓存。缓存 TTL、三档具体模型和流量占比只属于案例时点信息，不转成推荐或默认预算。受控编码评测与自适应换模仍是作者提出的未来工作。可检索的机制和失败案例值得保存，但不因此创建分类器、试验项目、默认路由或新的执行授权。

## What to preserve

- Agent 规划应显式建模决策变量、约束和目标函数。
- 能力覆盖、任务分配、预算选择、请求路由是四类不同问题，不应混在一个“多 Agent 更强”的口号里。
- 成本管理不只是缩短 prompt；也包括角色合并、任务分派、路由路径、验证开销和失败恢复。
- 运筹学模型适合做离线规划、候选方案比较和 checklist，不等同于运行时自适应调度。

## What not to preserve as defaults

- 原文中的 `$20k`、`$4,000`、`215M Token`、`40.6%`、`33%` 等数字只来自 synthetic data。它们可作为数量级示例，不是 AI Agent 阈值。
- `gurobipy` / Gurobi 是候选工具线索，不是默认依赖或强制技术栈。
- 文章示例不能直接授权修改 AI Agent runtime、skills、cron、MCP、profile 或 router。

## AI Agent mapping

### Wiki

本页属于概念层：回答“如何把 Agent 能力、成本、预算和路由建模为优化问题”。

### Skill / memory / runtime

暂不升级。只有当本地项目反复需要 Agent ROI、能力覆盖或路由规划，并且已有可复验 checklist / fixture / run log，才考虑提炼为 skill reference 或项目模板。

### Project validation candidate

可在 Agent 应用 项目中做一个只读检查：列出现有 skills、scripts、cron、subagent 用法，按能力覆盖、重叠、成本、验证负担做一次人工评分。验证目标是发现冗余和候选合并点，而不是自动删除或重构。

## Relationship to existing concepts

- [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs) 关注 orchestration topology 的生产取舍；本页补充“在选择拓扑之前，如何建模资源与约束”。
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 关注生产 Agent 的质量、成本和延迟指标；本页把这些指标进一步转成规划约束或目标函数。
- [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns) 关注 subagent 生命周期和执行方式；本页提醒 subagent 数量本身也需要成本/覆盖度约束。
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist) 约束知识和工作流沉淀层级；本页不改变 active 层规则，只提供规划视角。

## [推论] 参数化资源优化与工具选择裁决矩阵（`C_cov / R_route / P_tool / M_margin`）

`[推论]` 为将本页的运筹规划与模型路由、[ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture) 的分层工具选择漏斗，以及 [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop) 的受限算子评估闭环收束为统一的架构边界契约，在设计多模型路由、工具集裁剪或受限合成循环时，可按以下四参数矩阵逐项核对（不预设跨项目硬编码默认数值）：

| 参数符号 | 优化维度与数学定义 | 架构准入与门禁条件（Resource & Tool Gate） | 违背时的典型退化模式与处置动作 |
| :--- | :--- | :--- | :--- |
| $C_{\text{cov}}$ | **最小能力覆盖与冗余度（Set-Cover Redundancy）**：<br>$\min \sum_j c_j x_j \text{ s.t. } \mathbf{A}\mathbf{x} \ge \mathbf{1},\; \mathbf{w}^\top\mathbf{x} \le B_{\text{budget}}$ | 1. 新增 Agent/Skill/Tool 必须填补未覆盖能力行（$\exists i,\; \sum_j a_{ij} x_j = 0$）；<br>2. 能力列向量高度重叠的候选优先合并进既有 owner | **工具/角色膨胀与注意力稀释**：堆叠功能重叠的微小型 Skill 或 Tool，不增加能力覆盖却推高上下文成本与误选率；应通过集合覆盖盘点合并冗余项 |
| $R_{\text{route}}$ | **含返工与缓存折损的路由净节省（Net Routing Savings）**：<br>$\Delta C_{\text{net}} = \mathbb{E}[C_{\text{strong}}] - \mathbb{E}[C_{\text{route}}(q)] > 0$ 且质量满足预先指定边界 $\delta_{\text{NI}}$ 的非劣效检验（[arXiv:2305.05176](https://arxiv.org/abs/2305.05176)，[arXiv:2406.18665v4](https://arxiv.org/html/2406.18665v4)） | 1. 计入分类器延迟 $C_{\text{router}}$、升级重跑 $p_{\text{escalate}}$、中途换模缓存失效 $\Delta C_{\text{cache}}$ 与人工返工 $C_{\text{rework}}$；<br>2. 优先在会话级或独立子任务边界路由，避免同一长上下文频繁换模 | **廉价模型假节省（False Economy）**：单次 Token 变便宜但触发多轮重试、缓存击穿或降低工程师效率；应退回单模型基线或仅在边界清晰的子任务做静态分流 |
| $P_{\text{tool}}$ | **工具选择四阶漏斗与 Top-K 净损益（Tool Funnel & Top-K Gain）**：<br>$P_{\text{succ}} = P_{\text{avail}} \cdot P(t^* \in \mathcal{C}_K) \cdot P(\text{sel} \mid \mathcal{C}_K) \cdot P(\text{exec} \mid \text{sel})$ | 1. 动态 Top-K 检索须满足 $R_K \cdot S_K > S_N$（召回 $R_K = P(t^* \in \mathcal{C}_K)$ 与缩减后选择准确率 $S_K$ 的乘积优于全量选择准确率，见 [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture)）；<br>2. Schema Token 节省须覆盖检索器延迟与维护成本 | **过早引入向量工具路由**：在工具总数较小（静态分组即可解决）时盲目引入 Top-K 检索，因检索漏召回导致首轮无可用工具；应优先使用静态任务型 toolset |
| $M_{\text{margin}}$ | **候选区分度间隔与反例综合门禁（Score Margin & CEGIS Gate）**：<br>$\Delta s_{1,2}(q) = s_{(1)}(q) - s_{(2)}(q) \ge \tau_{\text{margin}}$；<br>$\exists P \in \mathcal{L}(G),\; \forall x \in E_k,\; \Phi(P, x)$ | 1. 相近工具竞争（$\Delta s_{1,2} < \tau_{\text{margin}}$）或必填参数缺失时触发澄清/扩集，禁止强猜高风险工具；<br>2. 创造型生成限制在合法算子文法 $\mathcal{L}(G)$ 内并经样本外 Evaluator 验证 | **相似工具误调与回测过拟合**：在两个语义相近的写工具间静默猜错，或在受限闭环中多轮拟合训练集噪声；应基于 $\Delta s_{1,2}$ 阻断强猜并强制样本外（Holdout）复核 |

## Relations

- refines: [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs), [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- related: [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines), [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist), [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture)

