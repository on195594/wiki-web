---
title: "Agent Context: History, State and Bounded Processing"
created: 2026-10-17
updated: 2026-10-20
type: concept
tags:
  - agent
  - llm
  - context-engineering
  - workflow
sources:
  - raw/articles/langchain-context-engineering-deep-agents-remember.md
  - raw/papers/arxiv-2608-26263-skill-state.md
  - raw/articles/langchain-organizing-context-multi-agent-harness-2026-09-08.md
  - raw/articles/langchain-scaledown-deep-agents-2026-10-13.md
  - concepts/hermes-context-engineering-design-priorities.md
  - concepts/hermes-memory-skills-wiki-boundaries.md
status: stable
description: 说明 Agent 消息历史与运行状态如何裁剪：转储与摘要分工、SKILL.state
  状态契约、子代理交接，以及专用模型承担的有界上下文加工及其恢复与评测边界。
volatility: medium
review_by: 2026-12-06
---

# Agent Context: History, State and Bounded Processing

## Summary

本页是 [agent-context-engineering](/concepts/agent-context-engineering) 的子主题，处理“随执行推进而增长的上下文”：消息历史、运行状态、子代理交接和专用模型的有界加工。核心结论是：历史是有损且随任务变化的动态面，应把未来决策依赖从自然语言历史迁到经校验的当前状态，完整轨迹留在外部证据层，转储（offloading）与摘要（summarization）解决不同问题，不能互相替代。静态上下文面（system prompt、tools、examples）见 [agent-context-prompt-tools-and-examples](/concepts/agent-context-prompt-tools-and-examples)。

## Message history and state: dynamic, lossy, and task-scoped

历史消息不是越全越好。长历史会引入旧目标、旧错误、重复工具输出和无关上下文，让模型注意力被稀释。

Agent 运行状态应从“完整聊天记录”转成结构化状态：当前目标、已做决策、已验证事实、待办步骤、失败尝试、风险和停止条件。旧过程保留在获授权的项目记录或私有日志中，不应默认继续压进 prompt。只有适合公开、获准保留且有复用价值的来源才进入 Wiki raw；私有执行记录不因压缩上下文而获得公开准入。

AI Agent 映射：
- session context 保存当前对话的活跃意图。
- memory 只保存短小、稳定、跨任务默认有价值的事实。
- wiki 保存长期概念、raw source 和可检索知识。
- project logs / run artifacts 保存可审计过程证据。
- cron/log 保存 recurring 运行结果，不等于默认上下文。

这只是 Agent 运行状态视角下的简要映射；内容归属以 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 为准，跨执行方法、触发、外部能力和运行状态的组合路由以 [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist) 为准。

### 转储控制输入尖峰，摘要控制历史累积

[langchain-context-engineering-deep-agents-remember](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/langchain-context-engineering-deep-agents-remember.md) 将两类增长问题分开：**转储（offloading）**在大工具结果或超长用户输入进入对话前保存原文，只让预览与指针进入上下文；**摘要（summarization）**在模型调用前检查累计预算，压缩旧交互并保留近期消息原文。前者挡住单次输入尖峰，后者处理多轮累积，不能互相替代。技能按需加载减少无关规程进入窗口；子代理的独立上下文则隔离已知高噪声工作，不等于安全沙箱。

文章以 Deep Agents 中间件说明这些介入位置，不要求所有宿主采用中间件架构。**可恢复依赖原始结果或消息仍被保存、指针可访问且允许回读；摘要本身不是无损保存。** 相关恢复与总成本评测边界沿用下文“专用模型承担有界上下文加工”及 [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities)，内容归属仍以 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 为准。

来源边界：Jess Weng 的 LangChain 文章，发布于 2026-10-14，2026-10-16 从原站可读正文提取为选择性来源笔记；作者与发布日期已在原页面核对。文中的 Token 与窗口占用阈值只保留在来源层，属于文中实现说明，不是通用默认。未核对产品源码、版本或复现收益；纯文本记忆可迁移不证明跨模型行为一致，也不授权自动学习、扩大保留范围或修改运行配置。

### SKILL.state：状态成为执行真相源，而不是历史摘要

[arxiv-2608-26263-skill-state](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/papers/arxiv-2608-26263-skill-state.md) 把“状态卡优于 transcript”推进成了明确的运行时契约。每一步只向模型提供不可变 Skill 规范 `P`、当前结构化状态 `Σ_t` 和最新观察 `O_t`；模型提出状态补丁与动作，确定性运行时负责校验、合并和执行。上一步的推理、旧观察和旧动作不再自动进入下一轮 Prompt，但仍可保留在外部日志中供审计、调试和恢复。

论文的核心增量不是“再做一次摘要”，而是把未来决策依赖从自然语言历史迁移为经校验的当前状态。其 Warehouse 实验在 100 步时报告 Stateful 基线使用 1,062,387 Token，而 SKILL.state 使用 65,408 Token；在约 1,800 Token 的等预算对照中，滑动窗口、LLMLingua 与 SKILL.state 分别得到 0.18、0.22 和 0.94。InterCode CTF 与 τ-Bench 结果进一步表明该机制不只适用于合成库存状态。所有数字仍受论文实现、Schema、Prompt、模型和评测环境约束，不是 AI Agent 的收益承诺。

对 AI Agent，长程状态应至少分开：

- **不可变契约**：目标、Skill/Spec、权限边界、验收与停止条件；
- **可变执行状态**：当前阶段、已验证事实、已做决策、待办、失败尝试、风险和下一动作；
- **状态补丁**：只表达本轮新增、修改和删除，禁止模型隐式重写完整状态；
- **证据指针**：状态结论指向必要的文件、工具输出或日志位置，不把大证据块复制进状态；
- **外部轨迹**：完整动作、观察、审批和副作用结果进入 append-only artifact，不默认回灌 Prompt。

[推论] 状态更新需要版本、Schema 校验、merge/null-delete 语义、失败回滚和关键事实保留 probe；涉及写操作时还应记录授权与副作用账本。论文验证了 JSON patch 与回滚重试方向，但没有评估 AI Agent 的权限模型或持久化格式。

这不是所有任务的默认模式。以下任一条件成立时应保留历史检索或混合执行：Schema 需要动态发现；早期观察可能延迟显现价值；任务目标本身要求审计、溯源或解释历史；状态会随步数无界增长；多个写者缺少冲突解决；模型经常产生语义错误但 Schema 合法的 patch。论文中 Gemma-4-31B-it 的失败有 68% 来自意外覆盖或删除，说明“结构化”不等于“可靠更新”。

## Subagent handoff: causal continuation vs independent judgment

[langchain-organizing-context-multi-agent-harness-2026-09-08](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/langchain-organizing-context-multi-agent-harness-2026-09-08.md) distinguishes forked subagents, which inherit a supervisor's conversation, from isolated subagents, which receive a fresh context. Its durable contribution is not “always copy history”, but a role-aware test: does the child need to continue an already established causal chain, or independently evaluate a frozen object?

Without assuming that AI Agent provides a literal conversation fork, the practical mapping is a bounded handoff:

- **Worker / fixer continuing diagnosed work**: pass the verified diagnosis, exact paths or SHAs, accepted decisions, failing check, constraints and expected artifact. This preserves prior evidence without forcing rediscovery or copying unrelated transcript noise.
- **Reviewer / verifier**: pass the frozen artifact, acceptance criteria and necessary project rules, but omit the parent's diagnosis, confidence and desired verdict so the review remains meaningfully independent.
- **Researcher**: pass a self-contained question, source requirements and output contract. Parallel researchers should not receive a duplicated parent history unless the question truly depends on it.
- **Memory extraction**: conversation may be the evidence, but AI Agent storage boundaries and explicit write authorization still apply. The article's forked memorizer example does not authorize copying private history broadly or granting unrestricted writes.

The article argues that prompt caching can make full-context forks cheaper than repeated discovery. That is implementation-specific and workload-dependent: without measured cache hits, relevant-context quality and latency, AI Agent should prefer explicit evidence packets over a new fork runtime.

## 专用模型承担有界上下文加工

[langchain-scaledown-deep-agents-2026-10-13](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/langchain-scaledown-deep-agents-2026-10-13.md) 提供了一个上下文加工分工实例：主模型继续负责规划、代码与开放式生成，专用模型处理总结、按问题压缩、字段抽取和分类。文章描述的 LangChain / Deep Agents 集成有三款现成中间件；漂移检测另用自定义中间件，不是第四款现成组件。这里保留机制，不指定产品依赖，也不要求每轮增加一次模型调用。

- **历史总结**：按窗口预算触发，保留近期消息，将旧历史整理为意图、摘要、产出物和下一步。原文称总结失败时保留原历史继续运行；这不保证后续调用不会超窗，也不替代经校验状态与外部轨迹。
- **定向工具输出压缩**：主模型用 `compression_query` 指定关注点；中间件在工具执行前移除此参数，再压缩工具结果。结果标明压缩意图、前后长度及不带参数重新获取全文的方法，避免把局部内容伪装成完整观察。
- **有来源边界的字段抽取**：只读用户消息、不读助手回复，未出现字段保留为空；抽取原值和业务有效性、真实性、授权是不同问题。类别归属仍是概率性语义判断，不能因值来自用户或结构合法就直接执行高风险动作。
- **辅助漂移检测**：用 `progressing / looping / drifting` 判断轨迹，可先提示改道，再按明确策略停止。分类得分不自动等于已校准正确概率；行为漂移治理仍归 [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering)，不能由分类理由替代权限、迭代和资源硬边界。

选择顺序和总成本验收沿用 [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities)，确定性规则与语义模型的分工沿用 [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary)，不因专用模型便宜就先把所有材料压缩一遍。

**[推论]** 可恢复压缩应保留可访问的原始结果或稳定证据指针。重新调用工具不保证恢复同一份观察：动态网页可能变化，有副作用的工具可能不能安全重放。评估时同时检查任务正确率、关键约束遗漏、回读与重试、总延迟/费用和误停；敏感历史或标识符发往新提供方前，还需核对授权与数据处理边界。

来源边界：这是 2026-10-13 的厂商集成说明，2026-10-14 从可读原文编译为有选择的来源笔记；图示仅读取文字说明，未检查图像、运行代码或复现模型结果。性能倍数、百万 Token 输入、免费额度、API 配置，以及 80% 总结触发、10% 保留预算和 `0.8` 熔断阈值只保留在来源笔记，不成为通用默认。其熔断示例没有展示超时、HTTP 状态检查和响应结构校验，不能视为生产模板；本文不证明压缩信息完整性、中文任务质量、分数校准或端到端收益，也不授权改变 Skill、运行时或总结后端。

## Relations
- refines: [agent-context-engineering](/concepts/agent-context-engineering)
- depends_on: [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities)
- related: [agent-context-prompt-tools-and-examples](/concepts/agent-context-prompt-tools-and-examples), [langchain-context-engineering-deep-agents-remember](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/langchain-context-engineering-deep-agents-remember.md), [arxiv-2608-26263-skill-state](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/papers/arxiv-2608-26263-skill-state.md), [langchain-organizing-context-multi-agent-harness-2026-09-08](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/langchain-organizing-context-multi-agent-harness-2026-09-08.md), [langchain-scaledown-deep-agents-2026-10-13](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/langchain-scaledown-deep-agents-2026-10-13.md), [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary), [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)

