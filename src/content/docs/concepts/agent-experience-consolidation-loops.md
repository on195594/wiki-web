---
title: Agent Experience Consolidation Loops
created: 2026-05-11
updated: 2026-11-11
type: concept
tags:
  - agent
  - memory
  - skills
  - knowledge-base
  - validation
  - workflow
  - multi-agent
  - closeout
sources:
  - raw/articles/venturebeat-anthropic-dreaming-ai-agents-2026-05-07.md
  - raw/articles/microsoft-research-evolib-evolving-knowledge-2026-07-30.md
  - raw/articles/xudong-han-self-evolving-agent-alloomi-2026-08-13.md
  - raw/articles/claude-warp-self-improving-agent-skills-2026-08-26.md
  - raw/papers/arxiv-2608-27454-wikiskill.md
  - docs:https://alloomi.ai/reports/sea.pdf
  - raw/articles/anthropic-components-of-agent-memory-2026-11-07.md
  - https://stanford.edu/~jlmcc/papers/McCMcNaughtonOReilly95.pdf
  - https://pubmed.ncbi.nlm.nih.gov/7624455/
status: stable
description: 定义 Agent 经验固化闭环：结合互补学习系统（CLS）双系统分工、在线捕捉与离线对账、按层职责路由及 B_act /
  P_skill / G_promo / I_rev 参数化治理裁决矩阵；Skill 治理与知识演化/元技能细节见两个子页。
volatility: medium
review_by: 2026-12-13
aliases:
  - experience-consolidation-loop
  - agent-experience-consolidation
---

# Agent Experience Consolidation Loops

## Summary
Agent experience consolidation loop 是一种让 agent 从历史任务、失败、成功路径和用户纠正中提取可复用经验，并将其路由到 memory、skills、公共 Wiki 正式页、项目内状态、evaluator 或 runtime automation 的闭环。它的目标不是把更多历史塞进上下文，而是把经验转成可审计、可复用、可验证的未来任务支撑。

一句话原则：**不要把所有历史经验直接写进 memory 或公共 Wiki；先复盘，再按职责与公开边界路由。** 在线捕捉重要信息、离线依据原始观察对账与选择性维护的分工见下文。私有状态、会话记录、执行记录和一次性 closeout 仍留在原有私有或项目载体；只有适合公开且长期可复用的发现才编译进对应正式页面。

经验既可以成为执行者的任务技能，也可以成为构建者的支持设计原则，再落实为工具、状态或验证机制；两种用途需要分别评估，不能把文字交付等同于可靠执行。具体机制与证据范围见 [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills)。

## Source anchor
本页由 VentureBeat 对 Anthropic Claude Managed Agents `dreaming`、`outcomes` 与 multi-agent orchestration 的报道触发：[venturebeat-anthropic-dreaming-ai-agents-2026-05-07](https://github.com/on195594/wiki/blob/2caa5ff913d3b184ec1996a270cee3117c92c76c/raw/articles/venturebeat-anthropic-dreaming-ai-agents-2026-05-07.md)。

文章中的 `dreaming` 不是模型权重训练，而是让 agent 回顾过去 session 和 memory，写出 plain-text notes / playbooks 供未来 session 使用。

Microsoft Research 的 [microsoft-research-evolib-evolving-knowledge-2026-07-30](https://github.com/on195594/wiki/blob/2caa5ff913d3b184ec1996a270cee3117c92c76c/raw/articles/microsoft-research-evolib-evolving-knowledge-2026-07-30.md) 进一步区分了“经验归档”和“知识演化”：EvoLib 从成功尝试中提炼可复用技能、从失败中提炼反思见解，再通过 consolidation 与 dynamic weighting 持续更新知识库。

Xudong Han 的 [xudong-han-self-evolving-agent-alloomi-2026-08-13](https://github.com/on195594/wiki/blob/2caa5ff913d3b184ec1996a270cee3117c92c76c/raw/articles/xudong-han-self-evolving-agent-alloomi-2026-08-13.md) 及其链接的 Alloomi 技术报告（`sea.pdf` 保留自 2026-08 采集快照，本页 5 份本地 `raw/` 快照已于 2026-11-02 复核，因外部 PDF 直链未在线重抓故页面级 `verified_at` 保持留空）进一步区分了外部知识复用与模型权重学习：前者依赖 memory、skills、向量检索或上下文注入，后者把筛选后的任务轨迹用于 LoRA、跨任务 replay 和教师蒸馏，并以评测准入与回滚控制更新。

> [!volatile]
> verified_at: 2026-08-14
> review_by: 2026-12-13
> source: docs:https://alloomi.ai/reports/sea.pdf
>
> Alloomi Self-Evolving Agent 技术报告（经 [xudong-han-self-evolving-agent-alloomi-2026-08-13](https://github.com/on195594/wiki/blob/2caa5ff913d3b184ec1996a270cee3117c92c76c/raw/articles/xudong-han-self-evolving-agent-alloomi-2026-08-13.md) 于 2026-08-14 采集记录）将真实任务上下文、专家修改与反馈组织为轨迹，经筛选与后训练后在 CL-Bench 上报告同底座成绩从 24.5% 升至 47.6%（3 seeds 第一方报告，长周期与更强消融列为待完成工作）；2026-11-06 在线尝试访问 `alloomi.ai/reports/sea.pdf` 时直链不可达，按 `SCHEMA.md` 保留原核验日期 `2026-08-14` 与 `review_by: 2026-12-13`，不刷新整页 `verified_at`。

[arxiv-2608-27454-wikiskill](https://github.com/on195594/wiki/blob/2caa5ff913d3b184ec1996a270cee3117c92c76c/raw/papers/arxiv-2608-27454-wikiskill.md) 进一步用受控实验区分不可变执行轨迹、持续累积的 Wiki 知识和可回滚的 Skill 状态。它补充的关键不是另一种存储格式，而是：候选 Skill 可以回滚，支持后续搜索的证据、拒绝原因和结构化知识不能随之丢失。

Anthropic 发布的 Warp 案例 [claude-warp-self-improving-agent-skills-2026-08-26](https://github.com/on195594/wiki/blob/2caa5ff913d3b184ec1996a270cee3117c92c76c/raw/articles/claude-warp-self-improving-agent-skills-2026-08-26.md) 给出了这一闭环的文件化实现：内层 Base Skill 执行领域任务，人工反馈直接留在 PR/Issue 工作现场，外层 Improver Skill 定期比较 Agent 输出与人类响应，只提出小而可审查的 Skill diff；候选变更经过正常 PR 审核并由人决定是否合并，下一次执行才继承更新。它的增量价值是把反馈入口、候选生成和文件变更控制面连成一条简单链路，而不是证明无人监管的自动自改。该文没有准确率增量、误修改率、审核工时或长期回归数据，因此只能作为企业实践证据；本地映射仍应允许 add、delete、replace、merge、move、split、retire 或 keep，而非把 self-improvement 理解为规则累积。

[推论] 该机制补充的是知识单元进入持久层后的演化方式，不改变本页原有的 AI Agent 层间路由和审批边界。

## Online capture and offline consolidation

Anthropic 的第一方研究文章 [anthropic-components-of-agent-memory-2026-11-07](https://github.com/on195594/wiki/blob/2caa5ff913d3b184ec1996a270cee3117c92c76c/raw/articles/anthropic-components-of-agent-memory-2026-11-07.md)（“Memory notes”“Dreaming can correct memory”“Thinking backward, looking forward”）补充了闭环的时间分工：执行时记录显著观察，使其能及时用于后续步骤；离线 dreaming 再回看原始记录，纠正笔记、组织知识表示或调整后续会话的注入内容。这里的 memory 是跨会话知识的总称，不只指宿主的默认 memory 工具，也不涉及模型权重更新。

在认知与计算神经科学中，这一双阶段架构对应 James L. McClelland、Bruce L. McNaughton 与 Randall C. O'Reilly（1995, *Psychological Review*，[Why there are complementary learning systems in the hippocampus and neocortex](https://stanford.edu/~jlmcc/papers/McCMcNaughtonOReilly95.pdf)，[PubMed 7624455](https://pubmed.ncbi.nlm.nih.gov/7624455/)）提出的**互补学习系统（Complementary Learning Systems, CLS）**理论：海马体（Hippocampus）采用快速、稀疏、正交化的表征完成单次情景编码（Episodic Encoding），防止新旧经历互相覆盖；新皮层（Neocortex）则通过慢速、交错回放（Interleaved Replay）从多轮历史样本中逐步提取潜在语义结构与程序规律。若将单次特定轨迹直接以大步长写入共享知识层或模型参数，就会破坏既有结构（即灾难性干扰，见 [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills)）。**[推论]** 对应到 AI Agent 架构，在线 `session / raw trajectory` 承担快速情景捕获职责，而离线复盘、对账与门禁验证则承担慢速交错整合职责；不能跳过离线对账与反例检验直接把单次轨迹写成全局常驻指令。

### Capture less, but preserve what cannot be cheaply recovered

宝可梦案例中，Sonnet 3.7 记录了大量每轮可从屏幕重新读取的状态，维护工作挤占了游戏行动；Fable 5 则主要保存策略、计划和自行发现的规律。原文比较的是不同模型各一次运行，不能独立证明“文件越少越好”或“删掉笔记就能提高成绩”。其可迁移启发是：**[推论] 优先保留未来有用、难以重新取得的知识，避免把易变且随时可读的状态重复归档。** 当前进度仍属于项目状态，不因此进入公共 Wiki。

### Reconcile notes against observations, not against another summary

在月见山案例中，错误笔记将地标方向写反；离线核对 transcript 后，模型纠正笔记并抵达目标城市，未纠正的运行则继续绕路。这支持“回看原始记录可以纠正部分错误”，不证明 dreaming 普遍解决了记忆漂移。**[推论] 对账时必须区分环境/工具观察、模型当时的陈述和事后推断；日志里出现过的判断不自动成为事实。** 变化后的当前状态仍需重新观察，不能只凭历史记录裁决。

### Organize for the task, and avoid shared-page write collisions

同一来源的“Dreaming can focus memory on a specific goal”报告：合同任务先由多个 Agent 并发维护共享条款表，发生覆盖且遗漏关键内容；改为每份合同独立页面、单一写入者并逐字引用条款后，依据 Wiki 生成的简报可满足的评分标准由 72% 提升至 100%。这是特定任务的联合改动结果，不是通用成功率，也不能单独归因于反思。**[推论] 需要精确保留措辞时，应按证据单元组织页面、明确写入归属，再综合引用，不以压缩摘要替代关键原文。** 这不要求每次知识维护都引入多 Agent。

### Maintain selectively; do not promote every reflection

原文指出：在线记笔记会分散执行注意力；离线整理的产物可能无法立即生效；持续核查全部记忆可能不实际，可考虑关注易变信息并按访问频率调整节奏。这是尚待验证的设计方向，不是已给定的调度公式。**[推论] 整理应允许纠正、合并、删除和下沉，只在未来收益明确时晋升；默认注入层不是所有反思的终点。** Wiki 与搜索的取舍见 [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)，注入预算见 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)；本节不新增自动写入、定时整理或宿主能力假设。

以上只核对该公开文章的正文与提取图注，不表示独立复现实验，也不刷新本页其他来源的核验日期。

## Core pattern

### 1. Collect historical task evidence
经验固化从证据开始，而不是从抽象反思开始。

可用证据包括：
- completed sessions and transcripts
- tool outputs and test results
- user corrections
- repeated failures
- successful work paths
- project closeouts
- evaluator / reviewer notes
- runtime incidents and recovery evidence

这些证据可以来自 `session_search`、项目 closeout、logs、git diffs 或 test artifacts，但证据可用不等于有资格公开。私有或一次性材料只在原授权范围内参与复盘，不因“经验固化”而进入公共 Wiki；公开、长期可复用的结论应去标识化后编译进对应正式 owner，具有长期检索价值的公共历史决策可以保留。

### 2. Detect recurring failures and successful workflows
复盘的重点不是“发生了什么”，而是识别可以改变未来行为的模式。

高价值信号：
- 同类错误反复发生
- 某个验证步骤显著降低返工
- 用户多次纠正同一边界
- 某个 workflow 在多个项目中复用
- 某个工具/模型/子 agent 组合稳定有效
- 某个经验如果不沉淀，未来很容易再次踩坑

低价值信号：
- 一次性的任务进展
- 临时文件路径
- 单个 PR / issue / commit 的完成状态
- 没有复用场景的新闻事实
- 没有验证过的产品宣传

### 3. Convert lessons into reusable artifacts
经验必须转成未来 agent 能调用的形式。

常见 artifact：
- **memory**：短小、稳定、每个 session 都值得看到的事实
- **skill**：可重复执行的方法、命令、坑点和验证步骤
- **wiki concept**：符合公共边界、跨工具或跨项目复用的长期知识模式
- **wiki query**：适合公开、带时间范围且有长期检索价值的问题答案或历史决策；一次性验证记录与任务 closeout 不因此进入公共 Wiki
- **project context / closeout**：某个 repo / workspace 的局部规则、状态和一次性收尾记录，留在项目载体或 Git 历史
- **evaluator rubric**：判断结果是否合格的标准
- **cron candidate report**：周期性提醒或只读复盘报告
- **runtime automation**：已验证、可回滚、低噪音的稳定流程


### 3a-3e. Deeper topics (split into sub-pages)

经验转成 artifact 之后的两类深入问题已拆为子页，本页保留主干闭环。

- [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills)：知识演化与元技能。结论：知识演化需要整合/加权/取代/拒绝，语义相似不等于可替代；外部知识复用与权重后训练互补，当前只采用可审计的外部闭环；任务技能（指导 Target 解题）与支持设计元技能（指导 Builder 搭环境）要分别评估，元技能证据有明确的预算与泛化边界。涉及 EvoLib、Alloomi、元技能论文时打开。
- [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state)：Skill 治理与可回滚状态。结论：Skill 是受治理的程序性资产，命中、应用、成功是不同指标；Skill 库应是带来源归因、反例与回滚检查的状态机；回滚候选 Skill 不删除证据与拒绝理由；跨模型/harness 迁移须复验；另含演化知识的评估边界。设计 Skill 生命周期、晋升与退役规则时打开。

### 4. Route by layer responsibility
经验固化的核心治理问题是路由，而不是保存。[agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules) 进一步补充了纠错晋升门槛：不要把一次用户纠正直接写成全局规则，先记忆、再泛化、再验证、最后推广。

```text
lesson candidate
→ Is it always-needed stable context? → memory
→ Is it repeatable procedure? → skill
→ Is it a public-eligible, durable conclusion? → corresponding wiki formal owner
→ Is it private or project-local? → authorized session/project carrier, not public wiki
→ Is it a one-off closeout? → project state/history, not public wiki
→ Is it a quality gate? → evaluator / test / rubric
→ Is it scheduled and stable? → cron/runtime after approval
→ Otherwise → leave in session history
```

参考：[hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)。

### 5. Reuse in future tasks
固化后的经验必须能被未来任务触发。

触发方式包括：
- system prompt memory injection
- skill discovery and `skill_view`
- wiki retrieval before answering
- project context auto-load
- cron skill injection
- subagent context handoff
- evaluator rubric reuse

如果经验沉淀后无法被未来任务检索或调用，它只是归档，不是经验闭环。

### 6. Revalidate and prune stale lessons
学习系统不能只积累不遗忘。

应定期检查：
- skill 是否仍然可用
- negative claims 是否过期
- memory 是否重复或陈旧
- wiki concept 是否已有更好的验证结论
- cron 是否仍低噪音、低风险
- runtime automation 是否有 rollback path

2026-05-11 / v0.13.0 的历史快照记录过部分 skill lifecycle 能力；curator、memory consolidation / Auto Dream 等能力的当前状态仍需按目标版本重新核验。

## AI Agent mapping

Hermes 产品实例 [hermes-agent-experience-consolidation-capability-assessment](/queries/hermes-agent-experience-consolidation-capability-assessment) 仅记录 2026-05-11 / v0.13.0 的历史能力快照，不是当前能力清单。该产品目标部署是否具有 `session_search`、skills、memory、验证工具、`/goal`、`delegate_task`、cron 或 Auto Dream，必须按当前官方文档与实际工具列表重新核验；本页只保留知识闭环边界：

```text
session_search / project evidence → audited review
→ public, durable finding → corresponding wiki formal owner
→ private or project-local record → original authorized session/project carrier
→ one-off closeout → project state/history, not public wiki
→ narrow skill patch only when a reusable procedure changed
→ memory only for compact stable facts
→ runtime/cron only after separate approval
```

- `/goal`、fresh-context reviewer 和确定性工具证据可以提供结果验证，详见 [agent-self-validation-loops](/concepts/agent-self-validation-loops)。
- 多 Agent 只用于适合拆分的复杂工作，不替代明确验收标准；编排边界见 [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)。
- 定时复盘默认只生成候选报告，不自动修改 memory、skills 或 runtime。

## Anti-patterns
- 把每篇文章都变成一个 skill。
- 把未经验证的外部产品概念写进 memory。
- 把所有 session 复盘结果直接塞进 `MEMORY.md`。
- 用“Dreaming”包装不可审计的自动自改。
- 让 cron 无人确认地修改 durable knowledge layers。
- 把一次任务的进展日志当作长期经验。
- 以“经验固化”或“保留证据”为由，把私有状态、会话记录、执行记录或一次性 closeout 写入公共 Wiki。
- 用多 agent 取代明确验收标准。
- [推论] 把语义相似但适用边界不同的知识强行合并。
- [推论] 让同一个模型同时负责提炼、加权和验收，再把其自评分数当作有效性证明。
- [推论] 把 Skill 命中率、实际使用率或最终成功率中的任一项当作完整生命周期质量。
- [推论] 让外部或共享轨迹绕过来源授权，因重复出现而自动成为 Active 指令。

## Operating rules
1. 经验候选必须先问：未来会在哪类任务中复用？
2. 能写成验证步骤的，优先进入 skill 或 project gate，而不是 memory。
3. 能作为跨项目概念复用且符合公共边界的，进入对应 wiki concept。
4. 公开、带必要时间范围且有长期检索价值的能力判断可进入 query；一次性验证记录和任务 closeout 留在项目载体或 Git 历史。
5. 只有稳定、短小、经常需要的事实进入 memory。
6. 自动化只读复盘可以先做；自动写入 durable layer 要等真实验证和单独批准。
7. 所有经验固化都要保留 provenance 和 rollback path。

## [推论] 参数化经验固化与技能治理裁决矩阵（`B_act / P_skill / G_promo / I_rev`）

`[推论]` 为将本页的互补学习系统（CLS）双阶段分工与子页的记忆激活衰减（[hermes-memory-governance-notes](/concepts/hermes-memory-governance-notes)）、Skill 使用漏斗与可回滚状态（[agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state)）及知识演化与元技能边界（[agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills)）收束为统一的可审计工程契约，在评估记忆留存、Skill 库扩容或候选规则晋升时，可按以下四参数矩阵逐项核对（不预设跨项目硬编码默认数值）：

| 参数符号 | 治理维度与数学定义 | 门禁裁决条件（Consolidation & Promotion Gate） | 违背时的典型退化模式与处置动作 |
| :--- | :--- | :--- | :--- |
| $B_{\text{act}}$ | **记忆基础激活与扇出信噪比（Activation & Fan Signal-to-Noise）**：<br>$A_i = \ln\!\left(\sum_{j=1}^{n} t_j^{-d}\right) + \sum_{j \in \mathcal{C}} W_j \big(S_{\max} - \ln(\text{fan}_j)\big)$ | 1. 常驻 `memory` 条目须具备跨任务高频激活（高 $n$、低衰减 $t_j$）且单句高密度；<br>2. 共享同一触发线索 $j$ 的候选条目数 $\text{fan}_j$ 受控，避免无界堆积 | **扇出稀释与常驻膨胀**：将一次性长篇反思或高度重叠条目塞入默认层，导致 $\ln(\text{fan}_j)$ 增大、检索精度暴跌；应合并同角色条目或下沉至按需检索的 `wiki` |
| $P_{\text{skill}}$ | **技能漏斗有效转化率（Skill Funnel Conversion）**：<br>$P_{\text{eff}}(s) = P(\text{id} \mid \mathcal{C}_M) \cdot P(\text{apply} \mid \text{id}) \cdot \Delta P(\text{succ} \mid \text{apply}, \mathcal{E})$ | 1. 分别记录候选集召回 $P(\text{id})$、实质遵循 $P(\text{apply} \mid \text{id})$ 与外部验证净增益 $\Delta P(\text{succ})$；<br>2. 跨 `Skill × model × harness × environment` 迁移前独立复验 | **高命中低转化与负迁移**：把 `skill_view` 命中率当作成功率，或将小模型碎片化规则直接迁移至强模型引发遵循冲突；应隔离失败阶段并按目标环境重做 held-out 验证 |
| $G_{\text{promo}}$ | **候选晋升净效用门禁（Promotion Net-Utility Gate）**：<br>$G_{\text{promo}}(s_{\text{cand}}) = \Delta \hat{\mu}_{\text{held-out}} - \lambda_{\text{neg}} R_{\text{regress}} - \lambda_{\text{cost}} \Delta C_{\text{token}} > 0$ | 1. 候选规则在冻结基线、原失败案例与相邻反向案例上无回归（$R_{\text{regress}} = 0$）；<br>2. 性能增益足以覆盖额外上下文 Token 与控制器开销 $\Delta C_{\text{token}}$ | **单次痛点过拟合与库漂移（Library Drift）**：因单次失败盲目追加规则，导致邻近任务回归或 Token 预算被挤占；应拒绝晋升，保留为局部 fixture 或合并进既有 owner |
| $I_{\text{rev}}$ | **可逆技能状态与持久证据分离不变量（Reversible-State Invariant）**：<br>$S_{k+1} = \text{Rollback}(S_k, s_{\text{cand}}),\; W_{k+1} = W_k \cup \{e_k, \text{reason}_k\}$ | 1. 候选 Skill $s_{\text{cand}}$ 验证回退时立即恢复上一活动状态 $S_k$；<br>2. 原始轨迹证据 $e_k$ 与被拒绝原因 $\text{reason}_k$ 持久保留在证据/知识层 $W_{k+1}$ | **回滚失忆与重复无效搜索**：回滚失败 Skill 时一并删掉测试记录与拒绝理由，导致后续迭代重复探索同一死胡同；应严格分离活动指令层 $S_k$ 与不可变证据/知识层 $W_k$ |

## Relations

- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- related: [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state), [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills), [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules), [agent-harness-search-regularization](/concepts/agent-harness-search-regularization), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs), [agentic-content-pipeline-design-patterns](/concepts/agentic-content-pipeline-design-patterns), [progressive-knowledge-system-growth](/concepts/progressive-knowledge-system-growth), [hermes-agent-experience-consolidation-capability-assessment](/queries/hermes-agent-experience-consolidation-capability-assessment)

