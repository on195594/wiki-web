---
title: Agent Memory–Reflection–Planning Pipeline
created: 2026-08-15
updated: 2026-11-20
type: concept
tags:
  - agent
  - memory
  - architecture
  - research
sources:
  - raw/papers/arxiv-2304-03442-generative-agents.md
  - https://arxiv.org/abs/2304.03442
  - https://zoo.cs.yale.edu/classes/cs671/12f/12f-papers/anderson-act-r.pdf
  - https://alexpetrov.com/pub/iccm06/PetrovICCM06.pdf
  - https://arxiv.org/html/2410.10813v1
  - https://arxiv.org/abs/2610.30698
status: stable
description: 将 Agent 经历处理为可检索记忆、受证据约束的反思和可修订计划，补充三因子检索评分、反思触发方程及与 ACT-R
  全历史幂律激活的适用边界对比，同时区分应用事件存储与 AI Agent 默认 memory。
aliases:
  - agent-memory-pipeline
  - memory-reflection-planning
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Agent Memory–Reflection–Planning Pipeline

## Summary

长期行为不能只靠无限增长的对话历史。一个可检查的状态流水线应把经历保存为应用事件，按当前任务检索少量相关记录，在证据基础上形成高层反思，再把反思与当前环境转成可修订计划。Generative Agents（[arxiv-2304-03442-generative-agents](https://github.com/on195594/wiki/blob/de741c89ebb2d63e691256a55ca32adf5294db1a/raw/papers/arxiv-2304-03442-generative-agents.md)）为这一组合提供了早期实现与消融证据，但其目标是短期社会模拟中的行为可信度，不是通用事实记忆或 AI Agent 的默认 memory 设计。

## Source-backed pipeline

```text
observation / interaction
→ append to memory stream
→ retrieve by recency + importance + relevance
→ synthesize reflection from retrieved evidence
→ build and decompose a plan
→ act and observe again
→ store new events, reflections and plans
```

论文实现将观察、反思和计划都写回 memory stream，再根据上下文窗口检索子集。反思不是定时摘要，而是从近期高重要性经历生成更高层问题和推断；计划则从日级大纲逐步分解到更细行动。

### 形式化检索评分与反思触发条件（Park et al., 2023）

在原论文（[arXiv:2304.03442](https://arxiv.org/abs/2304.03442)，[arxiv-2304-03442-generative-agents](https://github.com/on195594/wiki/blob/de741c89ebb2d63e691256a55ca32adf5294db1a/raw/papers/arxiv-2304-03442-generative-agents.md)）的实现中，面对当前查询或情境 $q$，记忆流中每条记录 $m_i$ 的检索得分由三项经 Min–Max 归一化至 $[0, 1]$ 的信号线性加权合成：

$$s(m_i, q) = \alpha_{\text{rec}} \cdot \widehat{\text{Rec}}(m_i) + \alpha_{\text{imp}} \cdot \widehat{\text{Imp}}(m_i) + \alpha_{\text{rel}} \cdot \widehat{\text{Rel}}(m_i, q)$$

- **新近度（Recency）**：按距上次访问的小时数 $\Delta t_i$ 呈指数衰减，$\text{Rec}(m_i) = \gamma^{\Delta t_i}$（原实现取衰减因子 $\gamma = 0.995$）；
- **重要性（Importance）**：写入时由模型在 $1 \sim 10$ 整数刻度上评估事件对主体的长期意义（如日常琐事为 `1`，重大转折为 `10`）；
- **相关性（Relevance）**：记忆文本嵌入 $\mathbf{e}_{m_i}$ 与查询嵌入 $\mathbf{e}_q$ 的余弦相似度，$\text{Rel}(m_i, q) = \frac{\mathbf{e}_{m_i}^\top \mathbf{e}_q}{\|\mathbf{e}_{m_i}\| \cdot \|\mathbf{e}_q\|}$；
- **反思触发阈值（Reflection Gate）**：当最近写入事件的累积重要性得分满足 $\sum_{i \in \mathcal{W}_{\text{recent}}} \text{Imp}(m_i) > \tau_{\text{reflect}}$（原实现取 $\tau_{\text{reflect}} = 150$，且检索权重取 $\alpha_{\text{rec}} = \alpha_{\text{imp}} = \alpha_{\text{rel}} = 1$）时，触发反思树合成并将高层推断连同指向底层证据的指针写回记忆流。

**[推论] 新近度与历史频次是不同信号**：$\text{Rec}(m_i)=\gamma^{\Delta t_i}$ 只度量距最后访问的时间，不能单独区分一次近期观察与长期反复调用的条目。ACT-R 的 $B_i=\ln(\sum_{j=1}^{n}t_j^{-d})$ 可作为结合频次与时间的候选评分（[Anderson et al. 2004](https://zoo.cs.yale.edu/classes/cs671/12f/12f-papers/anderson-act-r.pdf)、[Petrov 2006](https://alexpetrov.com/pub/iccm06/PetrovICCM06.pdf)；见 [hermes-memory-governance-notes](/concepts/hermes-memory-governance-notes)）。两种公式并不分别限定于短期和长期存储，跨会话晋升也不必强制切换公式；重复访问不等于重复验证，默认注入仍应依据稳定性、跨任务适用性、证据与预算（见 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops)）。

## What the evidence supports

- 记忆、反思和计划是可分离且可消融的组件。
- 在论文的人类评估设置中，完整架构的行为可信度高于去掉反思、去掉反思与计划、或缺少事件记忆的对照。
- 检索、反思和规划形成反馈：高层推断会影响未来计划，未来经历又会改变后续检索与反思。
- 长期状态需要检索选择；把完整历史持续塞进 Prompt 既不是该论文的方法，也不是可靠扩展路径。

## What the evidence does not support

- `recency + importance + relevance` 的等权组合不是普适检索公式。
- 论文使用的重要性刻度和反思触发阈值是模拟实现参数，不是 AI Agent 默认值。
- 行为看起来可信，不代表事实正确、价值对齐、长期稳定或能预测真实人类。
- LLM 生成的反思可能继承幻觉、偏见、错误检索和被植入的虚假记忆。
- 模拟 Agent 不能替代真实用户、领域专家或利益相关方。

## AI Agent layer mapping

Generative Agents 的 memory stream 是**应用拥有的事件存储**。AI Agent 的持久层按职责拆分：

| 状态或产物 | AI Agent 主要落点 | 不应误放 |
| --- | --- | --- |
| 当前任务状态 | session context / project state | default memory |
| 可检索历史经历 | session search / run logs / validation records | 无来源的概括性 memory |
| 来源支持的长期知识 | wiki + raw sources | 运行时聊天历史 |
| 可重复执行方法 | skill / project docs | 概念页或 memory |
| 稳定用户偏好、环境事实 | default memory | 长篇方法论 |
| 反思生成的候选推断 | 带来源的 wiki 草稿、项目证据或 session | 未验证即升级为稳定事实 |

这与 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 和 [agent-context-engineering](/concepts/agent-context-engineering) 的分层原则一致：反思可以生成候选知识，但不能绕过来源、验证与晋升边界。

## Design questions

在采用类似流水线前，应回答：

1. 事件记录的权威来源是什么？
2. 检索相关性、时间性和重要性如何校准？
3. 反思能否回链到支持它的具体事件？
4. 错误反思如何撤回或降权？
5. 计划如何响应新观察而不无限重写历史？
6. 哪些状态包含个人数据、敏感信息或可被提示注入污染？（持久记忆投毒的威胁模型、跨会话污染实证与写入信任分级门禁统一由 [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense) 主维护；`[推论]` 召回内容默认作为待核实数据而非可执行指令，不依赖选择性摘要充当唯一安全屏障。）
7. 完成判断来自模型自评，还是更权威的环境状态？

## Evaluation boundary

评估时应把至少四类指标分开：

- retrieval：是否召回支持当前决策的经历；
- synthesis：反思是否忠于被召回证据；
- planning：计划是否可执行并响应环境变化；
- outcome：行为结果是否达到任务目标，而不只是“看起来合理”。

生产采用还需要权限、保留期限、隐私、审计、删除和回滚设计；原论文的两天模拟不能替代这些验证。

在长期交互评测上，[LongMemEval（ICLR 2025，arXiv:2410.10813）](https://arxiv.org/html/2410.10813v1) 通过 500 道跨会话问题测试五项核心能力——**信息提取（IE）、多会话推理（MR）、时序推理（TR）、知识更新（KU）与拒答（ABS）**，在 LongMemEval-s 上，受测长上下文模型读取完整历史时，表现比只提供含证据会话的理想检索设置相对低约 `30%–60%`（§3.5），并验证了三项检索与索引优化：**会话分解（Session Decomposition）**、**事实增强键扩展（Fact-Augmented Key Expansion）**与**时间感知查询扩展（Time-Aware Query Expansion）**。此外，[Governance-State Corruption（2026-10，arXiv:2610.30698）](https://arxiv.org/abs/2610.30698) 在底层存储与任务固定的配对故障实验中，观察到有效性状态损坏后，LongMemEval 下游面板的二元正确率比干净条件低 `40.54` 个百分点；该差值不外推为生产效应。`[推论]` 流水线落地时应同步评估当前事实更新、控制面有效性投影、历史时点正确性与无证据拒答（参见 [llm-summary-identification-step](/concepts/llm-summary-identification-step)），长程轨迹基准（LongMemEval-V2）与基准可达性审计见 [agent-memory-architectures-and-evaluation-benchmarks](/comparisons/agent-memory-architectures-and-evaluation-benchmarks)。

## Relations

- refines: [agent-context-engineering](/concepts/agent-context-engineering)
- related: [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops), [agent-memory-architectures-and-evaluation-benchmarks](/comparisons/agent-memory-architectures-and-evaluation-benchmarks), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [hermes-memory-governance-notes](/concepts/hermes-memory-governance-notes), [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering), [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [agent-architecture-primary-paper-map](/queries/agent-architecture-primary-paper-map), [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense), [llm-summary-identification-step](/concepts/llm-summary-identification-step)

