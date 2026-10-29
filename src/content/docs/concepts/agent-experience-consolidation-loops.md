---
title: Agent Experience Consolidation Loops
created: 2026-05-11
updated: 2026-10-29
type: concept
tags:
  - agent
  - memory
  - skills
  - knowledge-base
  - validation
  - workflow
  - multi-agent
sources:
  - raw/articles/venturebeat-anthropic-dreaming-ai-agents-2026-05-07.md
  - raw/articles/microsoft-research-evolib-evolving-knowledge-2026-07-30.md
  - raw/articles/xudong-han-self-evolving-agent-alloomi-2026-08-13.md
  - raw/articles/claude-warp-self-improving-agent-skills-2026-08-26.md
  - raw/papers/arxiv-2608-27454-wikiskill.md
  - docs:https://alloomi.ai/reports/sea.pdf
status: stable
description: 定义 Agent 经验固化闭环：证据收集、模式识别、按层职责路由、复用与重验证；Skill 治理与知识演化/元技能细节见两个子页。
volatility: medium
review_by: 2026-12-13
---

# Agent Experience Consolidation Loops

## Summary
Agent experience consolidation loop 是一种让 agent 从历史任务、失败、成功路径和用户纠正中提取可复用经验，并将其路由到 memory、skills、公共 Wiki 正式页、项目内状态、evaluator 或 runtime automation 的闭环。它的目标不是把更多历史塞进上下文，而是把经验转成可审计、可复用、可验证的未来任务支撑。

一句话原则：**不要把所有历史经验直接写进 memory 或公共 Wiki；先复盘，再按职责与公开边界路由。** 私有状态、会话记录、执行记录和一次性 closeout 仍留在原有私有或项目载体；只有适合公开且长期可复用的发现才编译进对应正式页面。

经验既可以成为执行者的任务技能，也可以成为构建者的支持设计原则，再落实为工具、状态或验证机制；两种用途需要分别评估，不能把文字交付等同于可靠执行。具体机制与证据范围见 [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills)。

## Source anchor
本页由 VentureBeat 对 Anthropic Claude Managed Agents `dreaming`、`outcomes` 与 multi-agent orchestration 的报道触发：[venturebeat-anthropic-dreaming-ai-agents-2026-05-07](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/venturebeat-anthropic-dreaming-ai-agents-2026-05-07.md)。

文章中的 `dreaming` 不是模型权重训练，而是让 agent 回顾过去 session 和 memory，写出 plain-text notes / playbooks 供未来 session 使用。

Microsoft Research 的 [microsoft-research-evolib-evolving-knowledge-2026-07-30](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/microsoft-research-evolib-evolving-knowledge-2026-07-30.md) 进一步区分了“经验归档”和“知识演化”：EvoLib 从成功尝试中提炼可复用技能、从失败中提炼反思见解，再通过 consolidation 与 dynamic weighting 持续更新知识库。

Xudong Han 的 [xudong-han-self-evolving-agent-alloomi-2026-08-13](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/xudong-han-self-evolving-agent-alloomi-2026-08-13.md) 及其链接的 Alloomi 技术报告进一步区分了外部知识复用与模型权重学习：前者依赖 memory、skills、向量检索或上下文注入，后者把筛选后的任务轨迹用于 LoRA、跨任务 replay 和教师蒸馏，并以评测准入与回滚控制更新。

[arxiv-2608-27454-wikiskill](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/papers/arxiv-2608-27454-wikiskill.md) 进一步用受控实验区分不可变执行轨迹、持续累积的 Wiki 知识和可回滚的 Skill 状态。它补充的关键不是另一种存储格式，而是：候选 Skill 可以回滚，支持后续搜索的证据、拒绝原因和结构化知识不能随之丢失。

Anthropic 发布的 Warp 案例 [claude-warp-self-improving-agent-skills-2026-08-26](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/claude-warp-self-improving-agent-skills-2026-08-26.md) 给出了这一闭环的文件化实现：内层 Base Skill 执行领域任务，人工反馈直接留在 PR/Issue 工作现场，外层 Improver Skill 定期比较 Agent 输出与人类响应，只提出小而可审查的 Skill diff；候选变更经过正常 PR 审核并由人决定是否合并，下一次执行才继承更新。它的增量价值是把反馈入口、候选生成和文件变更控制面连成一条简单链路，而不是证明无人监管的自动自改。该文没有准确率增量、误修改率、审核工时或长期回归数据，因此只能作为企业实践证据；本地映射仍应允许 add、delete、replace、merge、move、split、retire 或 keep，而非把 self-improvement 理解为规则累积。

[推论] 该机制补充的是知识单元进入持久层后的演化方式，不改变本页原有的 AI Agent 层间路由和审批边界。

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

## Relations

- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- related: [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state), [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules), [agent-harness-search-regularization](/concepts/agent-harness-search-regularization), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs), [agentic-content-pipeline-design-patterns](/concepts/agentic-content-pipeline-design-patterns), [progressive-knowledge-system-growth](/concepts/progressive-knowledge-system-growth), [hermes-agent-experience-consolidation-capability-assessment](/queries/hermes-agent-experience-consolidation-capability-assessment)

