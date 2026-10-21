---
title: Agent Skill Governance and Reversible Skill State
created: 2026-10-17
updated: 2026-10-19
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
  - raw/papers/arxiv-2608-14036-demystifying-agent-skills.md
  - raw/papers/arxiv-2608-27454-wikiskill.md
  - raw/articles/microsoft-research-evolib-evolving-knowledge-2026-07-30.md
  - docs:https://agentskills.io/specification
status: stable
description: 说明如何把 Skill 作为受治理的程序性资产：使用漏斗与归因、生命周期状态机与晋升边界、可回滚 Skill 状态与持久知识的分离，以及演化知识的评估边界。
volatility: medium
review_by: 2026-12-20
---

# Agent Skill Governance and Reversible Skill State

## Summary

本页是 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) 的子主题，回答“经验变成 Skill 之后怎么治理”。核心结论：Skill 的价值主要来自把噪声经验压缩成程序锚点，但“被命中、被应用、任务成功”是不同指标；Skill 库应是可审计的状态机而非 append-only 目录；回滚候选 Skill 不等于删除证据与被拒绝的理由；声称可迁移时要按 `Skill × model × harness × tool environment` 复验。知识演化与元技能见 [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills)。

## Treat Skills as governed procedural assets

[arxiv-2608-14036-demystifying-agent-skills](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/papers/arxiv-2608-14036-demystifying-agent-skills.md) 对同一来源轨迹的 Raw、Workflow Memory 与 Skill 表示进行受控比较。其最重要的机制结论不是“Skill 一定提高成功率”，而是 Skill 主要把噪声经验压缩成程序锚点：前置条件、环境检查、动作顺序、服务生命周期、格式契约和运行验证。528 个匹配三元组中，Skill 相对 Workflow Memory 提升 6.06 个百分点，95% CI 为 `[+0.76, +11.36]`；Skill 相对 Raw 的 +2.84 个百分点区间跨零，不能外推为普遍优势。

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

### Frontier-model implication

[推论] 百万 Token 上下文、tool search、computer use 和更长执行时域不会消除 Skill，而会把它从“知识补丁”推向“跨模型操作契约”。基础模型越来越能完成一般推理，环境特定的权限、路径、工具顺序、验收、回滚和 source of truth 仍需外部化。Agent Skills 规范及 Claude、Codex、Gemini、Hermes 对 `SKILL.md` 风格包的支持表明文件格式正在收敛，但工具、权限、依赖、路由和执行效果仍由宿主决定；包可移植不等于行为可移植。

[推论] 强模型也会放大陈旧或错误 Skill 的影响：长周期任务、子 Agent 和真实工具让一个不兼容前提传播得更远。因此 Skill 应按 `Skill × model × harness × tool environment` 复验；模型升级时不应假设旧指令仍保持相同服从度、成本或验证行为。

### Lifecycle and promotion boundary

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

## Separate persistent knowledge from reversible Skill state

WikiSkill 将每轮状态表示为活动 Skill 集合与持久 Wiki 的组合。Raw Layer 保存不可变轨迹，Wiki Layer 汇总成功策略、失败模式、演化日志、被拒绝方案和 Skill 影响，Skill Layer 承载实际执行指令。候选 Skill 因验证分数下降而回滚时，Wiki 不回滚；后续提案仍可读取失败证据和拒绝理由，避免重复搜索同一无效路径。

这为 AI Agent 增加了一个明确的不变量：

```text
rollback(active candidate) != erase(evidence and rejected reasoning)
```

[推论] 对应到本地工作流，session、项目轨迹、测试结果和 reviewer 结论先留在其原有会话、项目或评估载体中；只有通过公共边界且长期可复用的发现才编译进公共 Wiki 的正式 owner。Skill 候选在项目内接受冻结基线、held-out、反例和邻近能力检查；Active 发布失败或回滚时，在合适的项目证据载体中保留候选版本、验证结果和拒绝原因，但不把被拒绝内容继续作为活动指令，也不把“保留证据”误读为“公开全部执行记录”。

### Role-specific knowledge access

论文主配置只让 Wiki Maintainer 与 Skill Proposer 读取 Wiki，不让生成训练轨迹的 Inference Agent 直接读取。Gemini-3.5-Flash 消融中，无持久 Wiki、Wiki 供 Proposer 使用、Wiki 同时供 Inference Agent 使用的平均分分别为 48.7、63.7 和 60.9。该结果支持一个窄的诊断原则，而不是“执行 Agent 永不查 Wiki”的全局规则：

- **触发**：rollout 轨迹将用于判断当前 Skill 的缺口或生成后续 Skill 候选；
- **候选规则**：默认让维护者/提案者使用持久知识，让 rollout actor 只使用当前待测 Skill，以免额外知识掩盖 Skill 缺口；
- **跳过**：普通知识任务、生产执行，或实验目标本身就是比较 Wiki 检索策略；
- **最低验证**：冻结同一任务集、模型、Skill、validator 与预算，对比 Skill-only 和 Skill+Wiki rollout 的失败归因、held-out 结果与成本；
- **毕业条件**：本地 A/B 证明隔离能稳定改善诊断或后续 Skill 演化，且不会造成不可接受的任务质量损失，才进入 `skill-optimization-workflows` 默认指导。

在本地证据出现前，这只是 `OPTIONAL_REFERENCE` 候选，不是 Active Skill、runtime 或 cron 改动。

### Transfer requires compatibility evidence

WikiSkill 报告跨模型正迁移，也报告明显负迁移：Qwen-3.6-27B 演化的 Skill 可让 Qwen-3.5-9B 在 SpreadsheetBench 从无 Skill 的 24.3% 和自演化的 33.6% 提升到 50.5%；但 Qwen-3.5-4B 形成的碎片化命令约束用于 Gemini-3.5-Flash 时，成绩可从 50.5% 降到 18.1%。这加强了现有 `Skill × model × harness × tool environment` 复验要求：来源模型更强或文件格式兼容都不能替代目标环境的 held-out、误用和成本检查。

### Evidence boundary

该论文直接把所有活动 Skill 注入系统提示以隔离 Skill 质量，因此没有验证真实生产中的检索、触发和选择；即时提升门槛可能拒绝有延迟收益的中间修改；Wiki 没有自动清理机制；任务没有覆盖数百步或数小时执行，也没有研究单次长任务中的在线适应。因此它为“持久知识 + 可回滚 Skill”的治理架构提供了强方向性证据，但不授权自动 Wiki→Skill 晋升、无人审批自修改或定时 Active 发布。

## Evaluation boundary for evolving knowledge

[推论] 评估经验固化不能只看“是否检索到旧记录”。还要检查后续任务是否改善、Token 和测试时计算是否换来相称收益、随机混合任务顺序下是否稳定、是否产生错误泛化或陈旧规则，以及提炼、合并、评分和重验证本身的成本。

对 Skill 类资产，最低评价面应明确区分：`available`、`identified/loaded`、`applied`、`applicable`、`verified outcome`、`misuse/negative transfer` 与 `cost`。只有在变更声称跨模型或跨 harness 可移植时才扩展矩阵；不能因单一平台 Skill 而默认运行全模型评测。

EvoLib 博客报告了数学、代码效率约束和长程环境交互三类实验，以及 Token 效率和任务顺序鲁棒性，但没有在博客中给出完整数值、超参数、并发成本或生产运行证据。它提供研究方向和评估维度，不能直接证明 AI Agent 应采用该框架。

## Relations
- refines: [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops)
- related: [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills), [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary), [hermes-active-surface-lifecycle-governance](/concepts/hermes-active-surface-lifecycle-governance), [hermes-agent-experience-consolidation-capability-assessment](/queries/hermes-agent-experience-consolidation-capability-assessment), [arxiv-2608-14036-demystifying-agent-skills](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/papers/arxiv-2608-14036-demystifying-agent-skills.md), [arxiv-2608-27454-wikiskill](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/papers/arxiv-2608-27454-wikiskill.md), [microsoft-research-evolib-evolving-knowledge-2026-07-30](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/microsoft-research-evolib-evolving-knowledge-2026-07-30.md), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)

