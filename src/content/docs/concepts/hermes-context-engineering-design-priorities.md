---
title: AI Agent Context Engineering Design Priorities
created: 2026-04-16
updated: 2026-11-11
type: concept
tags:
  - agent
  - llm
  - workflow
  - decision
sources:
  - raw/articles/tds-rag-isnt-enough-context-engineering-2026-04-14.md
  - raw/articles/github-copilot-cost-efficient-coding-2026-09-02.md
  - https://arxiv.org/abs/2307.03172
  - https://en.wikipedia.org/wiki/Information_bottleneck_method
status: stable
description: 定义 AI Agent 上下文工程的预算控制、排序、压缩和历史衰减优先级。
aliases:
  - hermes-context-engineering
  - agent-context-engineering-design-priorities
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# AI Agent Context Engineering Design Priorities

## Summary
基于 [llm-context-engineering-layer](/concepts/llm-context-engineering-layer)（及 [tds-rag-isnt-enough-context-engineering-2026-04-14](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/tds-rag-isnt-enough-context-engineering-2026-04-14.md)）的结论，AI Agent 后续如果要提升长对话、复杂任务和 agent 工作流的稳定性，重点不该只放在“再接更多检索源”，而应优先建设一层 context engineering：明确决定哪些信息进入上下文、如何压缩、如何衰减、以及如何分配 token 预算。

## Diagnose before adding controls

先在目标任务中确认是否存在上下文超限、重复回读、旧状态污染或关键约束丢失，再检查宿主已有的压缩、检索和预算能力。下面列出候选改进方向，不声称任何 Agent 当前缺少这些组件，也不要求新增统一调度器。

GitHub Copilot 的公开工程案例 [github-copilot-cost-efficient-coding-2026-09-02](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/github-copilot-cost-efficient-coding-2026-09-02.md) 提供了一个校准：上下文优化的目标应是任务总成本和结果质量，而不是单次 tool result 的 Token 数。压缩后若触发回读、重跑或额外交互，便是失败信号；源码和任意脚本结果应优先保真，搜索结果应无损重排，只有重复性噪声适合选择性压缩。

## Improvement priorities when a gap is observed
优先级建议按收益 / 实施难度排序，而不是按概念完整度排序。

### Priority 1: token budget control
先做预算治理。

目标：
- 为 system prompt、conversation history、wiki / retrieval、memory / skills 设定明确预算上限
- 在组装 prompt 时避免单一来源挤爆窗口
- 当超限时，按固定策略裁剪，而不是隐式截断

为什么先做：
- 这是最基础的稳定性杠杆
- 不需要先解出完美 memory 问题，也能立即减少长对话退化
- 它能给后续 compression 和 re-ranking 提供硬边界

落地形态：
- 在 prompt assembly 前增加 budget planner
- 输出每类上下文的 token allocation 与实际占用
- 超预算时记录被裁掉的来源和原因

### Priority 2: context source ranking
第二步做跨来源优先级排序。

目标：
- 不只决定“查哪些源”，还决定“哪些结果最终值得进入 prompt”
- 统一比较 wiki、session recall、memory、skills、external retrieval 的价值
- 优先保留和当前任务最相关、密度最高、可信度最高的上下文片段

为什么第二个做：
- 本 Wiki 的 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)，但更偏路径级顺序，不是片段级排序
- 真正占满窗口的不是“源”，而是具体片段

落地形态：
- 为每个候选片段打分：相关性、长期性、可信度、去重后价值、成本
- 输出 top-N context blocks，而不是简单拼接结果

### Priority 3: context compression
第三步做压缩，而不是一开始就做复杂记忆系统。

目标：
- 对长 wiki 页面、长 session 摘要、冗余 external docs 做压缩
- 让 prompt 中保留“关键事实 + 当前任务相关段”
- 避免为了保留全部原文而浪费窗口

为什么排第三：
- 没有预算和排序，压缩会变成无目标压缩
- 一旦预算和排序稳定，compression 的目标才明确：压缩哪些内容、保留哪些结构

落地形态：
- 对不同来源用不同压缩策略：
  - wiki：保留 summary + related rules
  - session：保留 user intent、decision、unfinished thread
  - external docs：保留 claim、evidence、applicability

### Priority 4: memory decay and carry-forward rules
第四步才是显式做历史衰减。

目标：
- 区分短期任务状态、当前 thread 记忆、长期 durable memory
- 避免旧上下文无限叠加
- 把真正应长期保留的东西写回 wiki / memory，而不是一直挂在 prompt 里

为什么不先做：
- 如果预算、排序、压缩都没定，先做 decay 很容易变成拍脑袋删历史
- 先把“哪些内容值得留下”标准化，再做“多久衰减一次”更稳

落地形态：
- 会话历史分层：active / warm / cold
- active 留全量，warm 留摘要，cold 默认不进 prompt
- 通过 write-back 把 durable knowledge 从运行时上下文转为 [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow) 下的长期资产

## Design rule
AI Agent 的 context engineering 应遵循 4 条规则：

1. 先预算，后拼装
- 先决定配额，再决定装什么

2. 先排序，后压缩
- 不要先把所有材料都压一遍，再临时决定取哪段

3. 先把长期知识写回外部载体，再减少 prompt 负担
- 能进入 wiki / memory 的，不要无限停留在运行时上下文里

4. 让上下文选择过程可解释
- 至少在调试模式下，应能回答：
  - 为什么选了这段
  - 为什么丢了那段
  - 哪类来源占满了预算

## Suggested implementation order
一个更实际的迭代顺序：
1. budget planner
2. candidate block scoring / ranking
3. source-specific compression
4. active/warm/cold history model
5. observability / debug view for context assembly

这个顺序的好处是：
- 每一步都能独立验证收益
- 不需要一次性重写整条 agent loop
- 便于按已观察到的缺口逐步改进

## 参数化上下文预算与总成本评估模型（`B_ctx / U_blk / C_total / R_probe`）

**[推论]** 为将上述四级优先级转化为可审计的工程契约，可结合长上下文位置退化实验（[Liu et al., TACL 2024](https://arxiv.org/abs/2307.03172)）、信息瓶颈原理（[Tishby et al. 1999](https://en.wikipedia.org/wiki/Information_bottleneck_method)）与总成本校准原则（[github-copilot-cost-efficient-coding-2026-09-02](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/github-copilot-cost-efficient-coding-2026-09-02.md)），定义四个可选参数化治理变量（具体配额由目标项目与模型实验标定，不预设全局硬编码默认值）：

| 参数符号 | 名称与定义 | 形式化关系与装配约束 | 越界信号与治理动作 |
| :--- | :--- | :--- | :--- |
| **`B_ctx`** | **分层有效窗口预算（Partitioned Effective Window Budget）** | $B_{\text{ctx}} = B_{\text{sys}} + B_{\text{state}} + B_{\text{ret}} + B_{\text{obs}} + B_{\text{res}} \le W_{\text{eff}}$，其中 $W_{\text{eff}}$ 为模型保持高遵循率的有效窗口上限（受中间段退化影响，通常显著小于标称最大窗口 $W_{\max}$）；依次划拨给静态指令与窄工具面 $B_{\text{sys}}$、经校验任务状态 $B_{\text{state}}$、检索片段 $B_{\text{ret}}$、最新工具观察 $B_{\text{obs}}$ 及生成推理余量 $B_{\text{res}}$。 | 单一分项（如未过滤的工具输出 $B_{\text{obs}}$ 或历史对话）挤占 $B_{\text{state}}$ 与 $B_{\text{res}}$ 时，先触发输入转储（offloading）或状态折叠，禁止隐式截断系统硬边界。 |
| **`U_blk`** | **候选片段边际价值密度（Marginal Utility Density）** | 对候选块 $i$（Token 成本 $c_i$，相对已选集合 $S$ 的去重信息新颖度 $\nu_i(S) \in [0, 1]$），按背包密度 $u_i(S) = \frac{\text{Rel}_i \cdot \text{Trust}_i \cdot \nu_i(S)}{c_i}$ 排序准入；并在空间排布上将不可违反约束置于首部（primacy）、当前步骤直接消费的状态与观察置于尾部（recency），规避长上下文中段盲区（[arXiv:2307.03172](https://arxiv.org/abs/2307.03172)）。 | 高相似度但高重复（$\nu_i(S) \to 0$）的检索切片或长文件正文占满 $B_{\text{ret}}$ 时，降级为 AST 接口签名骨架或摘要指针。 |
| **`C_total`** | **任务端到端总成本（End-to-End Task Cost）** | $C_{\text{total}} = \sum_{t=1}^{T_{\text{turns}}} \left( C_{\text{input}}(t) + C_{\text{output}}(t) + C_{\text{tool}}(t) \right) + P_{\text{reread}} \cdot \Delta C_{\text{recovery}}$，度量完成并通过验证的累计成本（含因上下文过度压缩导致的漏改、重读文件或重跑测试惩罚 $P_{\text{reread}} \cdot \Delta C_{\text{recovery}}$）。 | 单轮输入 $C_{\text{input}}(t)$ 下降但总轮数 $T_{\text{turns}}$ 或回读率 $P_{\text{reread}}$ 上升时，说明压缩越过率失真安全边界，需放宽关键源码或错误上下文的保真配额。 |
| **`R_probe`** | **关键事实保留率探针（Fact-Retention Probe Ratio）** | $R_{\text{probe}} = \frac{\lvert \mathcal{F}_{\text{retained}}(T) \rvert}{\lvert \mathcal{F}_{\text{mandatory}} \rvert}$，衡量历史摘要或状态补丁合并后，必保不变量集合 $\mathcal{F}_{\text{mandatory}}$（当前目标、禁止事项、已改文件路径、未通过验证项）在压缩后上下文 $T$ 中的完整保留比例。 | 当 $R_{\text{probe}} < 1$（任意硬约束或未决失败项在压缩后丢失）时，阻断写操作并从外部证据层或 project state 回填缺失字段。 |

## What not to do
不建议一开始就做这些：
- 一上来就训练复杂 memory model
- 把所有历史都做 embedding 再指望自动解决上下文问题
- 没有预算上限就不断扩大 context window 使用
- 只强调 retrieval recall，而忽略最终 prompt composition

这些做法会让系统看上去更强，但不一定更稳。

## Why this matters
如果 AI Agent 后续目标包括更长任务链、更复杂 agent orchestration 和更稳定的多轮协作，那么 context engineering 不是“锦上添花”，而是从工具拼装走向系统化 agent 的关键中间层。

## Relations

- depends_on: [llm-context-engineering-layer](/concepts/llm-context-engineering-layer)
- related: [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path), [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [agent-context-engineering](/concepts/agent-context-engineering), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)

