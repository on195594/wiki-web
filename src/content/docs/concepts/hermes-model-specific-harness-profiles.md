---
title: Hermes Model-Specific Harness Profiles
created: 2026-04-30
updated: 2026-09-20
type: concept
tags:
  - hermes
  - agent
  - harness
  - model-profiles
  - skills
  - context-engineering
  - verification
sources:
  - raw/articles/langchain-tuning-deep-agents-different-models-2026-04-29.md
  - raw/articles/google-antigravity-custom-agents-2026-08-12.md
  - concepts/hermes-agent-workflow-layering-and-adoption-order.md
  - concepts/hermes-context-layer-operating-rules.md
  - docs:https://hermes-agent.nousresearch.com/docs
status: stable
volatility: high
description: 定义 Hermes 针对不同模型配置 harness profile 的适配原则和验证路径。
aliases:
  - model-specific-harness
  - harness-profiles
review_by: 2026-11-11
---

# Hermes Model-Specific Harness Profiles

## Freshness scope

本页为混合知识：稳定方法论可独立复用；API、命令、产品能力和模型行为会变化，使用前必须对照当前 Hermes 与相关 provider 官方文档。页面级 review_by 未到期不代表已核验，本页也不记录任何作者机器的当前运行状态。

## Summary
LangChain 的 Deep Agents 文章给 Hermes 的核心启发是：Agent 的能力不是裸模型能力，而是 `模型 + harness` 的组合能力。对 Hermes 来说，harness 不只是 runtime profile；它包括 system/developer 指令、skills、工具暴露方式、subagent 使用、项目上下文、verification 纪律、cron 入口和 wiki/memory 注入策略。

因此 Hermes 下一阶段不应先扩张更多模型或更多 profile，而应建立“按模型适配执行方式”的治理规则：默认仍保持 `default` 主脑稳定，但把 Codex、Claude、Gemini 等模型的差异沉淀成可测试的 harness overlay，再用小项目验证是否值得升为 skill、quick command、cron 或 runtime profile。

## Source article in one paragraph
``langchain-tuning-deep-agents-different-models-2026-04-29`` 介绍 Deep Agents 新增 `HarnessProfile`：按模型或 provider 声明式调整 prompt、tool naming、middleware、subagent 和 skills。文章给出的证据是，在 `tau2-bench` 困难子集上，custom profile 让 GPT 5.3 Codex 从 33% 提升到 53%，Claude Opus 4.7 从 43% 提升到 53%。这说明模型切换不能只换 model name，还要换外部执行环境。

## Hermes translation
### 1. Hermes 的 harness 层在哪里
在当前 Hermes 中，类似 Deep Agents harness 的东西分散在这些层：
- `SOUL.md` / developer rules：全局执行纪律、工具优先、验证要求
- memory / user profile：短小长期事实和偏好
- skills：某类任务的可重复方法
- project context / `AGENTS.md`：项目局部规则
- tools / MCP：可用动作空间
- subagents：上下文隔离和并行执行方式
- cron：稳定 workflow 的调度入口
- wiki：长期概念、架构原则和决策依据

所以 Hermes 的 model-specific harness 不是一个单点配置文件，而是一组跨层 overlay。

### 1.1 Agent-level harness profile：角色范围比模型范围更窄

Google Antigravity 的 Custom Agents 补充了一个更窄的 harness 单元：同一模型和 provider 内，可以用文件化角色配置限定 system instruction、默认工具、Skill/MCP 子集、模型、权限与生命周期 Hook，并选择该角色能作为主 Agent、子 Agent或两者运行。项目级角色放在 `.agents/agents/`，稳定的用户级角色放在 `~/.gemini/config/agents/`；这些路径和字段属于随产品演进的外部接口，使用前仍需核对当前官方文档。

Hermes 映射不是增加一套通用编排层，而是让现有 `coding-agent-delegation` 的 AGY lane 在确有重复角色时获得更小的上下文和工具面：

- 优先把项目测试、依赖或构建约定放进仓库级角色，不复制到 Hermes 全局指令。
- 用户级角色只承载跨项目稳定职责，例如只读审查；不要预建架构师、测试员、文档员等角色目录。
- `mainAgent` / `subagent` 只决定 AGY 内的启动形态，不改变 Hermes 作为父级的范围、授权、验证和最终裁决责任。
- `commandExecutionPolicy` 和 Hook 是 provider 侧执行控制，不是 Hermes 的批准替代品；写操作、生产、凭证、DB、cron、runtime 与外部副作用仍受原有边界约束。
- 先用真实重复配置或上下文膨胀证明角色值得存在；一次性任务继续使用 bounded task packet 或普通 subagent。

这强化了本页的 `overlay before core` 原则，但没有提供创建新 Hermes runtime profile、自动路由器或默认多 Agent 工作流的证据。

### 2. 当前不应马上新建 Hermes runtime profile

Hermes 的 profile 能力、命令和存储位置属于版本化产品接口；部署前应查当前官方文档并在目标版本运行只读帮助命令。本页不声称 profile 已创建、某个 provider 已配置或 Gateway 健康，也不授权改变这些状态。

稳定原则仍是：不因为一篇文章或一组模型分数就增加 runtime profile。下面的顺序是参考治理方法，不是已部署拓扑。

更合理的顺序是：
1. 先在 wiki 记录模型差异原则。
2. 再在现有 skills 中做窄范围 prompt/tool 适配。
3. 用小型 eval project 验证某个适配是否真的改善结果。
4. 只有当稳定收益明确时，才考虑 quick command、skill、cron 或 Hermes profile 层的推广。

### 3. 不同模型的 Hermes 适配方向
#### OpenAI Codex / gpt-5.5 默认主脑
适合强化：
- 先读文件、搜索、列资源，再行动
- 独立读取和搜索尽量并行批量执行
- 文件修改优先用结构化 patch，而不是 shell 文本替换
- coding / config 任务必须有前后验证

落点：主要写进软件开发、Hermes runtime、project execution 类 skills，而不是 memory。

#### Claude / Claude Code 类工作流
适合强化：
- 工具结果后显式反思质量
- 用 XML/结构化段落约束工具使用和验证
- 不凭记忆断言文件、测试、系统状态
- 更适合长文档、代码审查、计划评审等需要反思的环节

落点：Claude Code / code review / planning skills 的 prompt overlay。

#### Gemini / gsummary 类工作流
适合强化：
- 抽取源文本与执行总结分离
- 对 share links、blocked pages、partial snippets 显式声明限制
- 输出稳定 schema，避免跨模型漂移
- 保留全文路径和 run logs，便于回放

落点：`gemini-summary`、`gsummary`、文章总结 workflow。

## Engineering principles for Hermes
### Principle 1: Model swap requires harness review
切换模型前必须问：当前 prompt、tools、skills、verification 是否适配这个模型？不能只看 benchmark 或模型名。

### Principle 2: Optimize overlays before core changes
先通过 skill、project context、wrapper script、quick command 形成窄 overlay。只有 overlay 经验证反复有效，才考虑改 Hermes core 或 runtime profile。

### Principle 3: Eval before promotion
任何 model-specific harness 改动都必须有小型可复现 eval：同一任务、同一输入、同一验收标准，对比 base 与 overlay。

### Principle 4: Do not bloat global prompt
模型差异不应全部塞进全局系统提示。能放 skill 的放 skill，能放项目上下文的放项目上下文，能放 wrapper 的放 wrapper。

### Principle 5: Verification is part of the harness
对 Hermes 来说，verification 不是任务末尾的一句话，而是 harness 的组成部分：读取、测试、状态检查、日志检查和输出路径确认都应成为模型适配的一部分。

## Promotion ladder
1. `session note`：一次性观察，默认不沉淀。
2. `wiki concept`：有长期架构价值的原则。
3. `skill patch`：已在同类任务中多次复用的执行方法。
4. `wrapper / quick command`：输入输出稳定、适合封装的流程。
5. `validation project`：需要 A/B 比较或多轮评估的 harness 改动。
6. `cron`：方法稳定且适合定时执行。
7. `Hermes runtime profile`：只有当运行时隔离有真实价值时才创建。

## Anti-patterns
- 因为读到“profile 有用”就马上创建多个 Hermes runtime profiles
- 把 Codex、Claude、Gemini 的所有差异塞进 memory 或全局 SOUL
- 没有 eval 就把 prompt overlay 推广到所有任务
- 用模型 benchmark 替代本地 workflow 评估
- 让 cron 运行还没稳定的 model-specific prompt 实验


## Validation outcome — 2026-04-30
The first Hermes harness-profile validation project is now closed. The result confirms the core principle but narrows the promotion path:

- Planning overlay produced repeated evidence and was promoted as a narrow `writing-plans` skill patch.
- Code review overlay produced repeated evidence and was promoted as a narrow `requesting-code-review` skill patch.
- Article summary overlay is useful but not promoted yet; source/extraction limitation handling needs a separate summary-only validation.
- Coding/config overlay is deferred because the baseline was already strong and no repeat round was run.
- No Hermes core, `SOUL.md`, runtime profile, cron, or memory changes were justified.

The validated promotion sequence is now:

```text
wiki concept → project-local evidence → repeated lane evidence → narrow skill patch → post-patch regression → wrapper/cron/runtime/core only with separate evidence
```

这是建议的证据晋升顺序，不是某个私有验证项目的完成记录。

## Relations
- depends_on: [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)
- depends_on: [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)

## Related
- `langchain-tuning-deep-agents-different-models-2026-04-29`
- [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)
- [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities)
- [codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering)
- `gemini-summary` skill（摘要 workflow overlay 参考，不是 wiki 页面）
- [index](/)
- `log`

