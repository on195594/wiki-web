---
title: Constrained Toolbox Evaluator Loop
created: 2026-05-22
updated: 2026-05-22
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
status: stable
description: 定义受限工具箱配合 evaluator 的多 Agent 闭环，用于降低高风险任务的错误扩散。
---

# Constrained Toolbox Evaluator Loop

## Summary

Constrained toolbox evaluator loop 是一种可靠 Agent 工作流模式：让模型在受限、可审计的工具/算子集合内生成候选方案，再用确定性或量化 evaluator 对候选结果打分，并把失败原因反馈给生成阶段继续迭代。它的核心不是“多 Agent 更强”，而是把创造性、执行边界和质量判断分开。

本页编译自 NVIDIA Technical Blog 文章 ``nvidia-financial-signal-discovery-multi-agent-2026-05-21``。原文场景是量化金融信号发现，但可迁移的 Hermes 知识是：**受限工具箱 + 结构化输出 + 可量化评估指标 + 反馈闭环**。

## Core pattern

### 1. Generator proposes only inside a bounded design space

Signal Agent 负责生成候选 alpha signal，但它不能随意发明公式。文章给它提供一个包含 66 个数学算子的 `calculator.json`：每个算子都有名称、签名、含义和代码实现。

Hermes 迁移原则：

- 不靠 prompt 反复要求“不要编造”。
- 先把可用动作压成有限工具箱、枚举、schema 或 fixture。
- 模型只负责在合法积木之间组合，而不是发明下游无法验证的动作。

这补充 `[typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)`：typed boundaries 约束接口形状；constrained toolbox 进一步约束模型可组合的语义空间。

### 2. Translator / executor turns blueprint into runnable artifact

Code Agent 把 Signal Agent 生成的 JSON 蓝图转成可执行 Python，并内联算子实现。它的职责不是重新发明策略，而是把结构化意图翻译成可运行、可回测的 artifact。

Hermes 迁移原则：

- 将“创意生成”和“可执行转换”拆开。
- 中间产物要可保存、可审计、可独立验证。
- 生成阶段输出 blueprint，执行阶段只负责按 blueprint 实现。

### 3. Evaluator supplies objective feedback, not aesthetic critique

Evaluation Agent 运行回测并计算 Rank IC、Mean IC、T 统计量、p-value 等指标。未达阈值时，反馈不是“再试试”，而是把表现、失败原因和优化建议返回给 Signal Agent。

Hermes 迁移原则：

- evaluator 必须有可重复运行的检查、分数、阈值或缺口清单。
- 反馈要能指导下一轮改进，而不是只做自然语言点评。
- 如果没有可观察指标，循环容易变成风格化重写或无限迭代。

这补充 `[production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)`：后者说明生产 Agent 应评估哪些层；本页说明 evaluator 如何嵌入生成闭环，成为下一轮改进信号。

### 4. Config centralizes experiment boundaries

文章用 YAML 配置集中管理 agent personas、模型、工具、IC 阈值、迭代次数和 forward-return periods。配置驱动让实验可复现，也让风险边界更容易审查。

Hermes 迁移原则：

- Agent 工作流的模型、工具、阈值、最大迭代次数、停止条件应显式配置。
- 修改实验边界应优先改配置和记录，而不是散落在 prompt 或脚本中。
- 对高延迟闭环，必须保留 trace、输入、输出、评分和失败分类。

## Hermes mapping

### Wiki

本页属于概念层，回答“如何把创造型 Agent 工作流变成受限、可评估、可迭代的系统”。raw source 保留金融细节和 NVIDIA 工具栈，概念页只保留可迁移模式。

### Skill

暂不升级为 skill。只有当 Hermes 在某个本地项目中反复使用“候选生成 → artifact 转换 → evaluator 评分 → 反馈修订”并形成稳定命令、fixture、阈值和失败分类后，才值得沉淀为具体执行 skill 或 reference。

### Memory

不进入 memory。本文没有新的用户偏好、环境事实或短句规则；它需要来源、限制和交叉链接，适合 wiki。

### Cron / MCP / runtime

不推广到 cron、MCP、profile、runtime 或 wrapper。NVIDIA NIM、NeMo Agent Toolkit、Nemotron、Arize Phoenix 都只是原文工具栈，不是 Hermes 默认选型。

## Operating rules for future Hermes workflows

- 先定义候选方案的合法空间，再让模型生成。
- 对模型输出使用结构化 schema，而不是自然语言约定。
- 将生成、转换/执行、评估拆成可审计阶段。
- evaluator 应返回分数、失败原因、缺口清单或可操作反馈。
- 循环必须有最大迭代次数、停止条件、成本/延迟边界和人工接管路径。
- 保留每轮输入、候选 artifact、评估结果和最终采纳/拒绝原因。
- 外部文章的领域指标只能作为源内事实保存；不能直接变成 Hermes 阈值。

## What to preserve from the source

保留：

- 三阶段 agent 分工：Signal Agent、Code Agent、Evaluation Agent。
- 受限算子库降低公式/代码幻觉的设计。
- JSON 蓝图作为中间合同。
- Rank IC 等客观指标驱动下一轮优化的闭环结构。
- YAML 配置集中管理模型、工具、阈值和迭代边界。
- Trace/observability 对长链路调试的重要性。

不保留为 Hermes 默认：

- Rank IC 0.02–0.05 作为通用质量阈值。
- NVIDIA NIM / NeMo / Nemotron 作为默认技术选型。
- 文章生成的具体金融公式。
- “该信号可用于实盘”的暗示；原文结果未覆盖滑点、佣金、市场冲击和跨市场泛化。

## Relationship to existing concepts

- `[typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)` 关注 typed schema、typed tools 和依赖注入；本页补充“可组合语义空间”也要受限。
- `[production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)` 关注评估层级；本页补充 evaluator 如何作为生成闭环的反馈信号。
- `[agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs)` 关注选择 sequential、fan-out、supervisor-worker 或 reflexive loop 的取舍；本页是低容量、高价值探索任务中的 generator → executor → evaluator specialization。
- `[agent-resource-optimization](/concepts/agent-resource-optimization)` 关注多 Agent 能力、成本和路由建模；本页关注单个探索闭环如何让每轮迭代可评估。
- `[agent-research-evidence-gate](/concepts/agent-research-evidence-gate)` 用 Judge gate 判断研究证据是否足够；本页用量化 evaluator 判断候选 artifact 是否值得保留或迭代。

## Related

- `nvidia-financial-signal-discovery-multi-agent-2026-05-21`
- [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs)
- [agent-resource-optimization](/concepts/agent-resource-optimization)
- [agent-research-evidence-gate](/concepts/agent-research-evidence-gate)
- [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary)

