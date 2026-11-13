---
title: Constrained Toolbox Evaluator Loop
created: 2026-05-22
updated: 2026-11-11
type: concept
tags:
  - agent
  - multi-agent
  - evaluation
  - workflow
  - structured-output
  - governance
sources:
  - raw/articles/nvidia-financial-signal-discovery-multi-agent-2026-05-21.md
  - https://people.csail.mit.edu/asolar/papers/thesis.pdf
  - https://www.kroening.com/papers/cav2018-synthesis.pdf
  - https://www.cis.upenn.edu/~alur/SyGuS13.pdf
status: stable
description: 结合语法制导综合（SyGuS）与反例制导归纳综合（CEGIS）形式化受限工具箱配合客观 evaluator 的多 Agent
  闭环，控制高风险任务的错误扩散与多重检验过拟合。
volatility: medium
review_by: 2027-03-02
aliases:
  - constrained-toolbox-loop
  - toolbox-evaluator-loop
verified_at: 2026-11-02
---

# Constrained Toolbox Evaluator Loop

## Summary

Constrained toolbox evaluator loop 是一种可靠 Agent 工作流模式：让模型在受限、可审计的工具/算子集合内生成候选方案，再用确定性或量化 evaluator 对候选结果打分，并把失败原因反馈给生成阶段继续迭代。它的核心不是“多 Agent 更强”，而是把创造性、执行边界和质量判断分开。

本页编译自 NVIDIA Technical Blog 文章 [nvidia-financial-signal-discovery-multi-agent-2026-05-21](https://github.com/on195594/wiki/blob/e8407157b061dc6eb64a54385558e1255061c12c/raw/articles/nvidia-financial-signal-discovery-multi-agent-2026-05-21.md)。原文场景是量化金融信号发现，但可迁移的 AI Agent 知识是：**受限工具箱 + 结构化输出 + 可量化评估指标 + 反馈闭环**。

## Core pattern

### 1. Generator proposes only inside a bounded design space

Signal Agent 负责生成候选 alpha signal，但它不能随意发明公式。文章给它提供一个包含 66 个数学算子的 `calculator.json`：每个算子都有名称、签名、含义和代码实现。

AI Agent 迁移原则：

- 不靠 prompt 反复要求“不要编造”。
- 先把可用动作压成有限工具箱、枚举、schema 或 fixture。
- 模型只负责在合法积木之间组合，而不是发明下游无法验证的动作。

这补充 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)：typed boundaries 约束接口形状；constrained toolbox 进一步约束模型可组合的语义空间。

### 2. Translator / executor turns blueprint into runnable artifact

Code Agent 把 Signal Agent 生成的 JSON 蓝图转成可执行 Python，并内联算子实现。它的职责不是重新发明策略，而是把结构化意图翻译成可运行、可回测的 artifact。

AI Agent 迁移原则：

- 将“创意生成”和“可执行转换”拆开。
- 中间产物要可保存、可审计、可独立验证。
- 生成阶段输出 blueprint，执行阶段只负责按 blueprint 实现。

### 3. Evaluator supplies objective feedback, not aesthetic critique

Evaluation Agent 运行回测并计算 Rank IC、Mean IC、T 统计量、p-value 等指标。未达阈值时，反馈不是“再试试”，而是把表现、失败原因和优化建议返回给 Signal Agent。

AI Agent 迁移原则：

- evaluator 必须有可重复运行的检查、分数、阈值或缺口清单。
- 反馈要能指导下一轮改进，而不是只做自然语言点评。
- 如果没有可观察指标，循环容易变成风格化重写或无限迭代。

这补充 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)：后者说明生产 Agent 应评估哪些层；本页说明 evaluator 如何嵌入生成闭环，成为下一轮改进信号。

### 4. Config centralizes experiment boundaries

文章用 YAML 配置集中管理 agent personas、模型、工具、IC 阈值、迭代次数和 forward-return periods。配置驱动让实验可复现，也让风险边界更容易审查。

AI Agent 迁移原则：

- Agent 工作流的模型、工具、阈值、最大迭代次数、停止条件应显式配置。
- 修改实验边界应优先改配置和记录，而不是散落在 prompt 或脚本中。
- 对高延迟闭环，必须保留 trace、输入、输出、评分和失败分类。

### 理论根基：语法制导综合（SyGuS）与反例制导归纳综合（CEGIS）

在形式化方法与程序综合领域，“受限算子工具箱 + 可执行转换 + 客观 Evaluator 反馈闭环”在架构模式上对应 Rajeev Alur 等（2013，*FMCAD*，[Syntax-Guided Synthesis (SyGuS)](https://www.cis.upenn.edu/~alur/SyGuS13.pdf)）的语法制导综合，以及 Armando Solar-Lezama 等（2006，*ASPLOS*；2008，[Program Synthesis by Sketching](https://people.csail.mit.edu/asolar/papers/thesis.pdf)）与 Alessandro Abate、Daniel Kroening 等（2018，*CAV*，[CEGIS Modulo Theories](https://www.kroening.com/papers/cav2018-synthesis.pdf)）形式化的**反例制导归纳综合（Counterexample-Guided Inductive Synthesis, CEGIS）**范式：

1. **语法空间约束（SyGuS Grammar Space $\mathcal{L}(G)$）**：
   不让生成器在无界自然语言或任意代码空间 $\Sigma^*$ 中自由搜索，而是预先定义一个由类型安全的原语算子集合组成的上下文无关文法 $G$（如原文中含 66 个确定性算子的 `calculator.json`）。综合目标被约束为在合法语言 $\mathcal{L}(G) \subset \Sigma^*$ 中寻找满足规约 $\Phi$ 的程序蓝图 $P$：
   $$\text{Find } P \in \mathcal{L}(G) \quad \text{s.t.} \quad \forall x \in \mathcal{X},\;\; \Phi(P, x) \ge \tau_{\text{spec}}$$
   由于 $\mathcal{L}(G)$ 内的每个算子都具有预先验证过的确定性实现，Translator 将蓝图 $P$ 编译为可执行代码的步骤在语法与算子语义上是保真的（消除了底层 API 编造与算子实现幻觉）。
2. **归纳生成与验证器反例反馈闭环（CEGIS Loop）**：
   在第 $k$ 轮迭代中，Generator 根据已积累的失败诊断/反例约束集 $E_k = \{(P_1, r_1), \dots, (P_{k-1}, r_{k-1})\}$ 提出候选蓝图 $P_k \in \mathcal{L}(G)$；随后确定性 Evaluator（Verification / Backtest Oracle）在评估集 $\mathcal{D}_{\text{val}}$ 上计算客观指标向量 $\mathbf{m}(P_k)$（如 Rank IC、$t$-stat、错误切片）。若未达标（$\neg \Phi(P_k)$），Evaluator 提取结构化失败归因 $r_k = \text{Diagnose}(P_k, \mathcal{D}_{\text{val}})$ 并更新约束集：
   $$E_{k+1} = E_k \cup \big\{(P_k,\; \mathbf{m}(P_k),\; r_k)\big\}$$
3. **[推论] 统计评估器下的多重假设检验偏差（Multiple Testing / Data Snooping Boundary）**：
   经典逻辑 CEGIS 使用的是真值确定性验证器（SMT Solver），而量化信号或机器学习闭环使用的是有限样本统计评估器 $\hat{\Phi}(P_k, \mathcal{D}_{\text{val}})$。当闭环连续迭代 $K$ 轮搜索最优候选 $\max_{1 \le k \le K} \hat{T}(P_k)$ 时，即使所有候选真实期望为零，最大统计量超越名义单次阈值 $z_{\alpha}$ 的族系假阳性率（Family-Wise Error Rate）也会随尝试次数 $K$ 增长（$\approx 1 - (1 - \alpha)^{K_{\text{eff}}}$）。因此，受限工具箱评估闭环必须遵循两条硬约束：① 记录全部尝试次数 $K$（含被淘汰候选）而非只报告最终胜出者；② 最终晋升必须通过未参与闭环反馈的独立样本外冻结集（Holdout / Out-of-Sample $\mathcal{D}_{\text{test}}$）检验（衔接 [agent-harness-search-regularization](/concepts/agent-harness-search-regularization) 与 [agent-resource-optimization](/concepts/agent-resource-optimization)）。

## AI Agent mapping

### Wiki

本页属于概念层，回答“如何把创造型 Agent 工作流变成受限、可评估、可迭代的系统”。raw source 保留金融细节和 NVIDIA 工具栈，概念页只保留可迁移模式。

### Skill

暂不升级为 skill。只有当 AI Agent 在某个本地项目中反复使用“候选生成 → artifact 转换 → evaluator 评分 → 反馈修订”并形成稳定命令、fixture、阈值和失败分类后，才值得沉淀为具体执行 skill 或 reference。

### Memory

不进入 memory。本文没有新的用户偏好、环境事实或短句规则；它需要来源、限制和交叉链接，适合 wiki。

### Cron / MCP / runtime

不推广到 cron、MCP、profile、runtime 或 wrapper。NVIDIA NIM、NeMo Agent Toolkit、Nemotron、Arize Phoenix 都只是原文工具栈，不是 AI Agent 默认选型。

## Operating rules for future AI Agent workflows

- 先定义候选方案的合法空间，再让模型生成。
- 对模型输出使用结构化 schema，而不是自然语言约定。
- 将生成、转换/执行、评估拆成可审计阶段。
- evaluator 应返回分数、失败原因、缺口清单或可操作反馈。
- 循环必须有最大迭代次数、停止条件、成本/延迟边界和人工接管路径。
- 保留每轮输入、候选 artifact、评估结果和最终采纳/拒绝原因。
- 外部文章的领域指标只能作为源内事实保存；不能直接变成 AI Agent 阈值。

## What to preserve from the source

保留：

- 三阶段 agent 分工：Signal Agent、Code Agent、Evaluation Agent。
- 受限算子库降低公式/代码幻觉的设计。
- JSON 蓝图作为中间合同。
- Rank IC 等客观指标驱动下一轮优化的闭环结构。
- YAML 配置集中管理模型、工具、阈值和迭代边界。
- Trace/observability 对长链路调试的重要性。

不保留为 AI Agent 默认：

- Rank IC 0.02–0.05 作为通用质量阈值。
- NVIDIA NIM / NeMo / Nemotron 作为默认技术选型。
- 文章生成的具体金融公式。
- “该信号可用于实盘”的暗示；原文结果未覆盖滑点、佣金、市场冲击和跨市场泛化。

## Relationship to existing concepts

- [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 关注 typed schema、typed tools 和依赖注入；本页补充“可组合语义空间”也要受限。
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 关注评估层级；本页补充 evaluator 如何作为生成闭环的反馈信号。
- [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs) 关注选择 sequential、fan-out、supervisor-worker 或 reflexive loop 的取舍；本页是低容量、高价值探索任务中的 generator → executor → evaluator specialization。
- [agent-resource-optimization](/concepts/agent-resource-optimization) 关注多 Agent 能力、成本和路由建模；本页关注单个探索闭环如何让每轮迭代可评估。
- [agent-research-evidence-gate](/concepts/agent-research-evidence-gate) 用 Judge gate 判断研究证据是否足够；本页用量化 evaluator 判断候选 artifact 是否值得保留或迭代。

## Relations

- refines: [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs), [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- depends_on: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)
- related: [agent-resource-optimization](/concepts/agent-resource-optimization), [agent-research-evidence-gate](/concepts/agent-research-evidence-gate), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary), [agent-harness-search-regularization](/concepts/agent-harness-search-regularization)

