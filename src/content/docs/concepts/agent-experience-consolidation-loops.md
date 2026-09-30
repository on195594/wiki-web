---
title: Agent Experience Consolidation Loops
created: 2026-05-11
updated: 2026-09-29
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
  - raw/papers/arxiv-2608-14036-demystifying-agent-skills.md
  - raw/papers/arxiv-2608-27454-wikiskill.md
  - docs:https://alloomi.ai/reports/sea.pdf
  - docs:https://agentskills.io/specification
status: stable
description: 定义把 Agent 历史经验提炼为可复用知识、持续整合重验证，并路由到 memory、skills、wiki 或评估资产的闭环。
---

# Agent Experience Consolidation Loops

## Summary
Agent experience consolidation loop 是一种让 agent 从历史任务、失败、成功路径和用户纠正中提取可复用经验，并将其路由到 memory、skills、公共 Wiki 正式页、项目内状态、evaluator 或 runtime automation 的闭环。它的目标不是把更多历史塞进上下文，而是把经验转成可审计、可复用、可验证的未来任务支撑。

一句话原则：**不要把所有历史经验直接写进 memory 或公共 Wiki；先复盘，再按职责与公开边界路由。** 私有状态、会话记录、执行记录和一次性 closeout 仍留在原有私有或项目载体；只有适合公开且长期可复用的发现才编译进对应正式页面。

## Source anchor
本页由 VentureBeat 对 Anthropic Claude Managed Agents `dreaming`、`outcomes` 与 multi-agent orchestration 的报道触发：`venturebeat-anthropic-dreaming-ai-agents-2026-05-07`。

文章中的 `dreaming` 不是模型权重训练，而是让 agent 回顾过去 session 和 memory，写出 plain-text notes / playbooks 供未来 session 使用。

Microsoft Research 的 `microsoft-research-evolib-evolving-knowledge-2026-07-30` 进一步区分了“经验归档”和“知识演化”：EvoLib 从成功尝试中提炼可复用技能、从失败中提炼反思见解，再通过 consolidation 与 dynamic weighting 持续更新知识库。

Xudong Han 的 `xudong-han-self-evolving-agent-alloomi-2026-08-13` 及其链接的 Alloomi 技术报告进一步区分了外部知识复用与模型权重学习：前者依赖 memory、skills、向量检索或上下文注入，后者把筛选后的任务轨迹用于 LoRA、跨任务 replay 和教师蒸馏，并以评测准入与回滚控制更新。

`arxiv-2608-27454-wikiskill` 进一步用受控实验区分不可变执行轨迹、持续累积的 Wiki 知识和可回滚的 Skill 状态。它补充的关键不是另一种存储格式，而是：候选 Skill 可以回滚，支持后续搜索的证据、拒绝原因和结构化知识不能随之丢失。

Anthropic 发布的 Warp 案例 `claude-warp-self-improving-agent-skills-2026-08-26` 给出了这一闭环的文件化实现：内层 Base Skill 执行领域任务，人工反馈直接留在 PR/Issue 工作现场，外层 Improver Skill 定期比较 Agent 输出与人类响应，只提出小而可审查的 Skill diff；候选变更经过正常 PR 审核并由人决定是否合并，下一次执行才继承更新。它的增量价值是把反馈入口、候选生成和文件变更控制面连成一条简单链路，而不是证明无人监管的自动自改。该文没有准确率增量、误修改率、审核工时或长期回归数据，因此只能作为企业实践证据；本地映射仍应允许 add、delete、replace、merge、move、split、retire 或 keep，而非把 self-improvement 理解为规则累积。

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

### 3a. Evolve knowledge instead of only appending experience

EvoLib 给出了一个比“保存更多历史”更严格的知识演化模型：

```text
experience → extract skill/insight → retrieve similar knowledge
→ consolidate/keep separate/supersede/reject → reweight → reuse/revalidate
```

- **Consolidation（来源机制）**：新经验产生候选知识后，检索相似条目并尝试整合成更通用的知识。[推论] 只有适用边界确实可泛化时才应合并，不能把语义相似直接当作可替代。
- **Weighting（来源机制）**：知识价值同时考虑当前任务效用和对后续知识生成的贡献。[推论] 访问次数和最近使用时间只能作为弱信号。
- **Lifecycle metadata**：`source`、适用范围、验证时间、supersession、当前状态和冲突关系是 AI Agent 的本地映射，不是博客公开的 EvoLib schema，均应视为 `[推论]`。

### 3b. Distinguish external consolidation from weight-level learning

Alloomi 报告提出的 Self-Evolving Agent 把每次任务组织为 `(context, decision, feedback)` 三元组，经质量筛选后进入经验池，再执行在线 LoRA、跨任务 replay、强教师能力蒸馏和多指标验证。这个闭环的关键不是“把更多历史塞回上下文”，而是让候选经验经过保留旧能力的回放、准入检查和失败回滚后进入模型参数。

这与 AI Agent 当前知识层互补而非替代：

- memory、skills、wiki 和 project context 让经验可检索、可读、可编辑和可审计；
- 权重后训练尝试让经验无需每次显式召回即可影响模型行为，但其错误泛化、灾难性遗忘和数据污染更难人工检查；
- 两者都需要来源、质量筛选、历史回放、独立评估和回滚，不能把模型或知识库的自评分数当作准入证据。

报告给出的同底座 CL-Bench rubric pass rate 从 24.5% 提升至 47.6%，可作为方向性系统证据，但不能直接成为 AI Agent 基线：主要结果只有 3 个 seeds，集中在一个 Qwen MoE 底座，教师蒸馏依赖付费外部模型；超过 10 个连续任务的长期效果、更多 seeds、无教师消融和更强对抗实验仍被列为待完成工作。

[推论] 对当前 AI Agent 的最小映射不是引入自动训练，而是继续使用现有可审计闭环：

```text
session_search / project evidence / user corrections
→ quality triage
→ candidate rule or knowledge unit
→ historical replay or focused fixture
→ explicit promotion decision
→ wiki / narrow skill patch / evaluator
→ rollback or removal when evidence regresses
```

除非后续出现本地开源模型、可隔离训练环境、明确数据授权和可复验收益，权重后训练、OpenContext 安装、自动 skill 修改及无人审批的知识晋升都不进入 AI Agent 默认工作流。

### 3c. Treat Skills as governed procedural assets

`arxiv-2608-14036-demystifying-agent-skills` 对同一来源轨迹的 Raw、Workflow Memory 与 Skill 表示进行受控比较。其最重要的机制结论不是“Skill 一定提高成功率”，而是 Skill 主要把噪声经验压缩成程序锚点：前置条件、环境检查、动作顺序、服务生命周期、格式契约和运行验证。528 个匹配三元组中，Skill 相对 Workflow Memory 提升 6.06 个百分点，95% CI 为 `[+0.76, +11.36]`；Skill 相对 Raw 的 +2.84 个百分点区间跨零，不能外推为普遍优势。

论文将 Skill 使用拆成表示、识别、调用、适配和结果，而不是只看最终成功率。候选池从 5 扩到 100 时，实际使用 precision 从 29.6% 降至 3.3%，但任务成功率相对稳定；相似干扰项比纯数量更容易破坏排序。Skill 组另有 10.0% 的 guidance misapplied or ignored。由此得到的本地治理映射是：

```text
available candidates
→ identified / loaded
→ materially applied
→ applicable to current model, harness and environment
→ externally verified outcome
→ contribution / misuse / cost attribution
```

这些维度必须分别记录。`skill_view` 命中、正确 Skill 排第一、最终任务成功和 Skill 对结果的因果贡献不是同一个指标。

#### Frontier-model implication

[推论] 百万 Token 上下文、tool search、computer use 和更长执行时域不会消除 Skill，而会把它从“知识补丁”推向“跨模型操作契约”。基础模型越来越能完成一般推理，环境特定的权限、路径、工具顺序、验收、回滚和 source of truth 仍需外部化。Agent Skills 规范及 Claude、Codex、Gemini、Hermes 对 `SKILL.md` 风格包的支持表明文件格式正在收敛，但工具、权限、依赖、路由和执行效果仍由宿主决定；包可移植不等于行为可移植。

[推论] 强模型也会放大陈旧或错误 Skill 的影响：长周期任务、子 Agent 和真实工具让一个不兼容前提传播得更远。因此 Skill 应按 `Skill × model × harness × tool environment` 复验；模型升级时不应假设旧指令仍保持相同服从度、成本或验证行为。

#### Lifecycle and promotion boundary

长期 Skill 库不应是 append-only 目录，而应采用可审计状态机：

```text
observed evidence
→ candidate
→ source/outcome attribution
→ overlap and compatibility review
→ verifier + counter-case + held-out check
→ active
→ monitor / degrade / quarantine
→ deprecate or retire with redirect and rollback
```

- **来源与归因**：保存轨迹来源、Skill 版本、模型/harness、环境、外部 verifier、支持证据和反证；成功不能全部归因于 Skill，失败也可能来自环境或评估器。
- **受控更新**：失败轨迹可以暴露缺口，但未标注或无法归因的失败不能直接变成规则；自动提炼只能生成 candidate。
- **组合与重叠**：优先一个明确 owner 加窄适配层；创建新 Skill 前检查语义相似、边界冲突和可组合性，不以全局固定数量上限替代判断。
- **发布与退役**：只有候选通过外部验证、反例和回滚检查后才晋升；无证据的频繁修订、按调用次数自动降级和过早退役都可能伤害表现。
- **安全边界**：经验进入持久指令是一次授权操作。外部、共享或多用户轨迹必须保留 provenance 和 trust level，不能仅因重复出现就自动晋升。

同期预印本给出方向一致但仍有限的补充证据：多轮 Skill 演化更像稀疏、验证过滤的搜索；Library Drift 将无界积累与错误注入及性能停滞联系起来；SkillsVote 主张把结果归因到 Skill、Agent 探索、环境和结果信号；SkillEvolBench 则显示当前模型的局部适应经常无法稳定迁移到冻结部署、上下文变化、对抗捷径和组合任务。它们共同支持生命周期治理，但都不足以授权无人监管的 Active 自进化。

本页建议的采用边界是：把上述框架用于非平凡 Skill 创建、合并、路由或性能改动；小型确定性文本修正继续走 Direct。项目级证据进入目标项目已有评测记录，不创建新的治理工程；Active 晋升仍由独立授权、备份、验证和回滚控制。

### 3d. Separate persistent knowledge from reversible Skill state

WikiSkill 将每轮状态表示为活动 Skill 集合与持久 Wiki 的组合。Raw Layer 保存不可变轨迹，Wiki Layer 汇总成功策略、失败模式、演化日志、被拒绝方案和 Skill 影响，Skill Layer 承载实际执行指令。候选 Skill 因验证分数下降而回滚时，Wiki 不回滚；后续提案仍可读取失败证据和拒绝理由，避免重复搜索同一无效路径。

这为 AI Agent 增加了一个明确的不变量：

```text
rollback(active candidate) != erase(evidence and rejected reasoning)
```

[推论] 对应到本地工作流，session、项目轨迹、测试结果和 reviewer 结论先留在其原有会话、项目或评估载体中；只有通过公共边界且长期可复用的发现才编译进公共 Wiki 的正式 owner。Skill 候选在项目内接受冻结基线、held-out、反例和邻近能力检查；Active 发布失败或回滚时，在合适的项目证据载体中保留候选版本、验证结果和拒绝原因，但不把被拒绝内容继续作为活动指令，也不把“保留证据”误读为“公开全部执行记录”。

#### Role-specific knowledge access

论文主配置只让 Wiki Maintainer 与 Skill Proposer 读取 Wiki，不让生成训练轨迹的 Inference Agent 直接读取。Gemini-3.5-Flash 消融中，无持久 Wiki、Wiki 供 Proposer 使用、Wiki 同时供 Inference Agent 使用的平均分分别为 48.7、63.7 和 60.9。该结果支持一个窄的诊断原则，而不是“执行 Agent 永不查 Wiki”的全局规则：

- **触发**：rollout 轨迹将用于判断当前 Skill 的缺口或生成后续 Skill 候选；
- **候选规则**：默认让维护者/提案者使用持久知识，让 rollout actor 只使用当前待测 Skill，以免额外知识掩盖 Skill 缺口；
- **跳过**：普通知识任务、生产执行，或实验目标本身就是比较 Wiki 检索策略；
- **最低验证**：冻结同一任务集、模型、Skill、validator 与预算，对比 Skill-only 和 Skill+Wiki rollout 的失败归因、held-out 结果与成本；
- **毕业条件**：本地 A/B 证明隔离能稳定改善诊断或后续 Skill 演化，且不会造成不可接受的任务质量损失，才进入 `skill-optimization-workflows` 默认指导。

在本地证据出现前，这只是 `OPTIONAL_REFERENCE` 候选，不是 Active Skill、runtime 或 cron 改动。

#### Transfer requires compatibility evidence

WikiSkill 报告跨模型正迁移，也报告明显负迁移：Qwen-3.6-27B 演化的 Skill 可让 Qwen-3.5-9B 在 SpreadsheetBench 从无 Skill 的 24.3% 和自演化的 33.6% 提升到 50.5%；但 Qwen-3.5-4B 形成的碎片化命令约束用于 Gemini-3.5-Flash 时，成绩可从 50.5% 降到 18.1%。这加强了现有 `Skill × model × harness × tool environment` 复验要求：来源模型更强或文件格式兼容都不能替代目标环境的 held-out、误用和成本检查。

#### Evidence boundary

该论文直接把所有活动 Skill 注入系统提示以隔离 Skill 质量，因此没有验证真实生产中的检索、触发和选择；即时提升门槛可能拒绝有延迟收益的中间修改；Wiki 没有自动清理机制；任务没有覆盖数百步或数小时执行，也没有研究单次长任务中的在线适应。因此它为“持久知识 + 可回滚 Skill”的治理架构提供了强方向性证据，但不授权自动 Wiki→Skill 晋升、无人审批自修改或定时 Active 发布。

### 4. Route by layer responsibility
经验固化的核心治理问题是路由，而不是保存。`[[agent-closed-loop-learning-from-corrections-to-rules]]` 进一步补充了纠错晋升门槛：不要把一次用户纠正直接写成全局规则，先记忆、再泛化、再验证、最后推广。

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

### Evaluation boundary for evolving knowledge

[推论] 评估经验固化不能只看“是否检索到旧记录”。还要检查后续任务是否改善、Token 和测试时计算是否换来相称收益、随机混合任务顺序下是否稳定、是否产生错误泛化或陈旧规则，以及提炼、合并、评分和重验证本身的成本。

对 Skill 类资产，最低评价面应明确区分：`available`、`identified/loaded`、`applied`、`applicable`、`verified outcome`、`misuse/negative transfer` 与 `cost`。只有在变更声称跨模型或跨 harness 可移植时才扩展矩阵；不能因单一平台 Skill 而默认运行全模型评测。

EvoLib 博客报告了数学、代码效率约束和长程环境交互三类实验，以及 Token 效率和任务顺序鲁棒性，但没有在博客中给出完整数值、超参数、并发成本或生产运行证据。它提供研究方向和评估维度，不能直接证明 AI Agent 应采用该框架。

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

- related: [agent-self-validation-loops](/concepts/agent-self-validation-loops), [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)

## Related pages
- `arxiv-2608-27454-wikiskill`
- `arxiv-2608-14036-demystifying-agent-skills`
- `xudong-han-self-evolving-agent-alloomi-2026-08-13`
- `microsoft-research-evolib-evolving-knowledge-2026-07-30`
- [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules)
- [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)
- [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs)
- [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [agentic-content-pipeline-design-patterns](/concepts/agentic-content-pipeline-design-patterns)
- [progressive-knowledge-system-growth](/concepts/progressive-knowledge-system-growth)

