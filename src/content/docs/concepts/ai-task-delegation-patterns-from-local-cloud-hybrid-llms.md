---
title: AI Task Delegation Patterns from Local-Cloud Hybrid LLMs
created: 2026-07-03
updated: 2026-11-13
type: concept
tags:
  - agent
  - orchestration
  - subagent
  - decision
  - workflow
  - llm
sources:
  - raw/articles/towardsdatascience-local-cloud-llm-hybrid-patterns-2026-07-02.md
  - concepts/agent-autonomy-ladder-for-hermes-workflows.md
  - concepts/subagent-orchestration-patterns.md
  - concepts/agent-context-engineering.md
  - docs:https://arxiv.org/abs/2605.26128
status: stable
volatility: medium
review_by: 2027-03-02
description: 将端云混合 LLM 的 5 种模式抽象为 AI Agent PM/subagent/外部 AI 调度模式：任务包、计划落地、困难升级、草稿精修、交叉审查。
aliases:
  - ai-delegation-patterns
  - local-cloud-llm-delegation-patterns
  - pm-agent-delegation-patterns
verified_at: 2026-11-02
---

# AI Task Delegation Patterns from Local-Cloud Hybrid LLMs

## Summary

Towards Data Science 的 `Stop Choosing Between Local and Cloud LLMs`（[towardsdatascience-local-cloud-llm-hybrid-patterns-2026-07-02](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/towardsdatascience-local-cloud-llm-hybrid-patterns-2026-07-02.md)）表面讨论本地模型与云端模型的混合架构，但对 AI Agent 更可迁移的结论是：**父 Agent / PM 不应把完整上下文无差别交给一个强模型，而应根据任务方向、触发条件、风险和目的，把最小任务包交给合适的 AI 执行者，并保留本地 grounding、复核和验收权。**

本页把原文 5 种 local-cloud 模式抽象为 AI Agent 的 PM/subagent/coding-agent delegation 模式。它补充 [agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows)：后者先判断自治级别，本页进一步说明任务包如何构造、何时升级、何时精修或交叉审查。

## Core mapping and three-axis coordinate space

原文将端云混合工作流置于三维正交坐标空间 $\text{HybridSpec} = (\text{Direction},\; \text{Trigger},\; \text{Purpose})$ 中：
- **Direction（首发方向）**：`Local-First`（父级/本地先裁剪或起草）、`Cloud-First`（外部/强模型先出抽象规划）或 `Bidirectional`（双向对等交叉核验）；
- **Trigger（触发条件）**：`Always`（固定流水线步骤）或 `Conditional`（仅在跨越复杂度、不确定性或风险阈值时触发升级）；
- **Purpose（拆分目标）**：`Privacy`（敏感上下文不出域）、`Cost & Latency`（高频简单请求本地吸收、降低首字延迟）或 `Trust & Reliability`（异构第二视角防单点盲区）。

| 原文模式 | 三维坐标（Direction / Trigger / Purpose） | AI Agent 调度模式 | 核心用途与原文证据强度 |
|---|---|---|---|
| Sanitize-and-Solve | `Local-First` / `Always` / `Privacy` | task packet + minimal context + parent rehydration | 把敏感/复杂上下文压成匿名最小任务包交给子 Agent 或云端强模型，父 Agent 结合本地映射还原并验收（**强证据**：原文提供 `Gemma 4 E4B` + `GPT-5.4` 完整家居电费排程代码与实测输出） |
| Plan-then-Ground | `Cloud-First` / `Always` / `Privacy` | external plan + AI Agent local grounding | 让外部 AI 根据抽象目标生成通用计划，AI Agent 根据本地 repo/wiki/memory/project context 裁剪和执行（**概念架构图**：需本地落地校验约束） |
| Escalate-on-Hard | `Local-First` / `Conditional` / `Cost & Latency` | risk/complexity-triggered delegation | 父 Agent 先处理，遇到复杂度、失败次数、风险或不确定性阈值再升级（**概念架构图**：量化路由阈值须结合 [agent-resource-optimization](/concepts/agent-resource-optimization) 的 FrugalGPT / RouteLLM 标定） |
| Draft-then-Refine | `Local-First` / `Conditional` / `Cost & Latency` | fast parent draft + external refinement/review | AI Agent 先产出低延迟可用草稿，再在高收益场景异步或按需引入外部 AI 精修（**概念架构图**：须验证合并开销是否低于质量增益） |
| Cross-Check | `Bidirectional` / `Always` / `Trust & Reliability` | independent read-only review + parent arbitration | 一个执行者产出，另一个独立审查，父 Agent 最终裁决（**概念架构图**：须隔离上下文以防 [multiagent-systemic-failure-modes](/concepts/multiagent-systemic-failure-modes) 中的同源相关错误 $c_{\text{err}}$） |

## Pattern 1: Sanitize-and-Solve → task packet delegation

原文模式是“本地脱敏 → 云端求解 → 本地还原”。AI Agent 对应为：

```text
AI Agent 父 Agent 提取最小任务包
→ 去除敏感、无关或会污染判断的上下文
→ 交给 AGY/Codex/Claude/subagent
→ AI Agent 复核证据、还原到真实项目语境、决定是否采纳
```

适用场景：
- AGY/Codex/Claude 只读审查，只需要 diff、目标、风险边界和问题清单；
- subagent 负责局部调研、测试失败分析、候选方案比较；
- 外部 AI 做抽象架构建议，但不需要完整用户偏好、历史对话或敏感项目状态。

关键规则：子 Agent 只拿“可执行任务包”，不继承父 Agent 的完整上下文。敏感映射、最终解释和执行验收留在父 Agent。

### 形式化脱敏—求解—还原映射与小模型“约束税”（Constraint Tax）边界

在原文唯一的端到端实测案例（智能家居多负载分时电价排程，本地运行 Ollama `gemma4:e4b`，云端调用 Azure OpenAI `gpt-5.4`）中，`Sanitize-and-Solve` 构成三阶段工程闭环（以下函数记号是本页抽象，并非同态或隐私证明）：
1. **本地脱敏与无关负载剪枝（$\sigma: X_{\text{private}} \mapsto (X_{\text{anon}}, M_{\text{local}})$）**：本地模型读取含姓名与作息的家庭记忆（如“Maya 睡眠浅、`22:30` 后洗碗机禁运行”“Mark `07:00` 前需充满电”“扫地机 `16:10` 已完成清洁且电量 `78%`”），自动剔除与当前排程无关的扫地机，将敏感实体替换为匿名标识符 `load_A`（`1.2 kWh`，`90 min`，硬截止 `06:30`，软截止 `22:30`）与 `load_B`（`14 kWh`，`120 min`，硬截止 `07:00`）及四档分时电价（`$0.45 / $0.22 / $0.12 / $0.25` per kWh），并将映射表 $M_{\text{local}} = \{\texttt{load\_A}: \text{dishwasher}, \texttt{load\_B}: \text{EV charger}\}$ 留在本地。**这只是化名化与数据最小化，不证明匿名包与个人信息统计独立**；作息、设备特征和时间约束仍可能泄露敏感属性或支持重识别。出域前须按具体威胁模型检查保留字段和旁路信息；不能确认满足隐私要求时，继续删减、改为本地求解或停止外发。
2. **云端结构化推理（$y_{\text{anon}} = f_{\text{cloud}}(X_{\text{anon}})$）**：云端强模型仅在匿名约束空间上通过强类型 Schema（`CloudScheduleReasoning`）求解最优时间窗（`load_A: 20:00–21:30` 避开 `$0.45` 尖峰与 `22:30` 睡眠禁令；`load_B: 00:00–02:00` 命中 `$0.12` 低谷电价）。
3. **本地语境还原与冲突优先裁决（$\hat{y} = \rho(y_{\text{anon}}, M_{\text{local}}, X_{\text{private}})$）**：本地模型将匿名排程还原为自然语言建议，且明确遵循**“若云端结果与本地私有约束冲突，以本地真实上下文为准并显式指出”**的防御规则。
4. **大小模型在结构化输出上的非对称“约束税”（Constraint Tax）**：原文引用 Ray（2026，[*The Constraint Tax: Measuring Validity-Correctness Tradeoffs in Structured Outputs for Small Language Models*，arXiv:2605.26128](https://arxiv.org/abs/2605.26128)）并结合实验指出：对容量受限的端侧小模型（如 `Gemma 4 E4B`）直接施加硬语法解码约束（`format=PydanticSchema.model_json_schema()`），可能提高 JSON/Schema 合法率，却仍遗漏关键业务约束（如截止时间 `22:30`）；来源案例不能确证“挤占推理注意力”的因果机制。云端强模型（`GPT-5.4`）上的严格 Schema 解析（`responses.parse`）也只约束输出结构，不保证语义正确或排程最优，仍须验证业务约束。这为 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 补充了重要的容量边界：**在强模型或确定性工具边界坚持强类型 Schema 校验；在轻量提取子模型若观测到明显约束税，可采用提示词示例软引导 + 宿主侧 JSON 解析、Pydantic 等 Schema 后置校验及业务约束检查与有界重试（`json.loads` 单独不足以完成校验）替代解码期硬掩码。**

## Pattern 2: Plan-then-Ground → external plan, local execution

原文模式是“云端规划 → 本地结合真实数据执行”。AI Agent 对应为：

```text
外部 AI / subagent 产出通用计划
→ AI Agent 用本地约束校准
→ AI Agent 决定可执行切片、拒绝项、验证命令和回滚路径
```

适用场景：
- Claude Code plan mode 或 AGY 做只读方案审查；
- Codex/Claude 给出 refactor plan；
- 外部 AI 分析通用技术选型；
- AI Agent 结合 `CLAUDE.md`、`AGENTS.md`、项目测试、用户偏好和安全红线裁剪。

边界：外部计划不是授权；AI Agent 才是 grounding 和执行裁决者。

## Pattern 3: Escalate-on-Hard → thresholded delegation

原文模式是“简单任务本地做，困难任务升级云端”。AI Agent 对应为：

```text
AI Agent 先用直接工具/自身推理处理
→ 触发复杂度、风险、失败或不确定性阈值
→ 升级给 AGY/Codex/Claude/subagent
```

好触发条件：
- 多文件行为变更或复杂重构；
- 父 Agent 两轮修复后仍失败；
- 需要独立审查或第二视角；
- 涉及生产、凭证、DB、cron、runtime、MCP、外部副作用；
- 需要并行阅读大量材料或拆成非重叠任务。

跳过条件：
- 一行低风险改动；
- 普通总结或简单 lookup；
- 已有确定命令可直接验证的任务；
- 子任务会编辑重叠文件但没有集成计划。

## Pattern 4: Draft-then-Refine → fast draft, bounded refinement

原文模式是“本地先给草稿，云端后台精修”。AI Agent 对应为：

```text
AI Agent 先给可用草稿 / plan / patch
→ 外部 AI 或 subagent 做严格审查、改写或补盲点
→ AI Agent 合并最终版本并验证
```

适用场景：
- 写计划、prompt、文章、架构方案；
- 初步实现后交给 AGY/Codex review；
- 用户需要快反馈，但最终质量仍重要。

边界：refine 不是默认步骤；只有质量收益大于延迟、成本和上下文负担时触发。

## Pattern 5: Cross-Check → independent review with parent arbitration

原文模式是“两种模型交叉校验”。AI Agent 对应为：

```text
一个 agent / 父 Agent 产出
→ 另一个 agent 只读审查真实证据
→ AI Agent 父级裁决、接受/拒绝/修复
```

适用场景：
- active skill/reference 修改；
- runtime/config 风险；
- wiki 重要概念入库；
- 复杂方案决策；
- 代码审查或用户显式要求 AGY/Codex/Claude 审查。

边界：Cross-check 必须有父级仲裁和真实证据；两个模型意见不同不会自动提升可靠性。

## Relation to existing AI Agent workflows

- [agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows)：先决定自治级别；本页决定同一自治级别内任务如何打包、升级、精修和交叉审查。
- [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)：讲 subagent 生命周期选择；本页补充 task packet 与父级 rehydration。
- [agent-context-engineering](/concepts/agent-context-engineering)：讲最小上下文与 context rot；本页把最小上下文原则用于委托任务包。
- [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management)：讲工具输出、文件、历史的预算；本页补充跨 AI 执行者的上下文裁剪。

## What not to promote blindly

- 不把 5 种模式变成固定步骤链。
- 不默认每个任务都派 subagent、AGY 或 Codex。
- 不把 Cross-Check 变成普通小任务默认审查。
- 不把外部 AI 的计划当成执行授权。
- 不把完整父上下文交给子 Agent，只因为“它更强”。
- 不从这篇文章直接推广本地 LLM runtime、provider routing、cron、MCP 或 active gateway 变更。

## Operating rule

当 AI Agent 要决定“是否把任务交给另一个 AI”时，先回答三个问题：

1. **方向**：谁先做，父 Agent、子 Agent、外部 AI，还是确定性工具？
2. **触发**：什么条件才升级、精修或交叉审查？
3. **收益**：这样拆分带来的隐私、质量、速度、成本或可控性收益是否大于上下文/流程成本？

## Relations

- refines: [agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows)
- depends_on: [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [agent-context-engineering](/concepts/agent-context-engineering)
- related: [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management), [codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)

