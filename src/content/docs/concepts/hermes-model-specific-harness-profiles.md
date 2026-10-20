---
title: AI Agent Model-Specific Harness Profiles
created: 2026-04-30
updated: 2026-10-20
type: concept
tags:
  - agent
  - harness
  - model-profiles
  - skills
  - context-engineering
  - verification
sources:
  - docs:https://docs.langchain.com/oss/python/deepagents/profiles
  - docs:https://hermes-agent.nousresearch.com/docs
  - raw/articles/langchain-tuning-deep-agents-different-models-2026-04-29.md
  - raw/articles/google-antigravity-custom-agents-2026-08-12.md
  - concepts/hermes-agent-workflow-layering-and-adoption-order.md
  - concepts/hermes-context-layer-operating-rules.md
status: stable
volatility: high
description: 定义 AI Agent 针对不同模型配置 harness profile 的适配原则和验证路径。
aliases:
  - model-specific-harness
  - harness-profiles
  - agent-model-specific-harness-profiles
verified_at: 2026-10-20
review_by: 2026-12-20
---

# AI Agent Model-Specific Harness Profiles

## Freshness scope

本页为混合知识：通用模型适配与验证方法论可独立复用；LangChain `deepagents` 的 `HarnessProfile` 接口面与 Hermes 官方配置边界已于 2026-10-20 对照官方文档核验（见下方 `[!volatile]` 块），页面级 `verified_at` 仅覆盖官方文档接口边界核对，不代表已在本地复现外部评测或执行客户端测试；`tau2-bench` 分数与 Google Antigravity Custom Agents 字段保留为对应发布日期的来源记录。使用前按 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 检查关系及适用范围。

## Summary
LangChain 的 Deep Agents 文章给 AI Agent 的核心启发是：Agent 的能力不是裸模型能力，而是 `模型 + harness` 的组合能力。对 AI Agent 来说，harness 不只是 runtime profile；它包括 system/developer 指令、skills、工具暴露方式、subagent 使用、项目上下文、verification 纪律、cron 入口和 wiki/memory 注入策略。

默认先保留目标项目已验证的模型与执行配置；只有出现可复现差异时，才以窄范围指令或工具适配层做对照验证。模型名称不直接决定职责或优劣，产品接口也不是通用配置标准。

## Source article in one paragraph
`langchain-tuning-deep-agents-different-models-2026-04-29`（2026-04-29 发布）介绍 Deep Agents 新增 `HarnessProfile`：按模型或 provider 声明式调整 prompt、tool naming、middleware、subagent 和 skills。文章给出的作者自报证据是，在 `tau2-bench` 挑选的困难子集上，custom profile 让 GPT 5.3 Codex 从 33% 提升到 53%，Claude Opus 4.7 从 43% 提升到 53%。这说明模型切换不能只换 model name，还要换外部执行环境。

> [!volatile]
> verified_at: 2026-10-20
> review_by: 2026-12-20
> source: docs:https://docs.langchain.com/oss/python/deepagents/profiles
>
> 当前 LangChain Deep Agents 官方 Profiles 文档说明：`HarnessProfile` 与 `register_harness_profile` 支持按 provider 键（如 `"openai"`）或 `provider:model` 键定制 `base_system_prompt`、`system_prompt_suffix`、`tool_description_overrides`、`excluded_tools`、`excluded_middleware`、`extra_middleware` 与 `general_purpose_subagent`（`GeneralPurposeSubagentProfile`），并在解析时将 model 级覆盖合并到 provider 级默认项之上；YAML/JSON 声明式配置通过 `HarnessProfileConfig` 加载，插件通过 `deepagents.harness_profiles` entry point 注册；模型初始化参数则由独立的 `ProviderProfile` 与 `register_provider_profile` 管理。

## AI Agent translation
### 1. Harness 是职责集合

按实际宿主识别指令、偏好、Skill/SOP、项目上下文、工具、子任务、调度与 Wiki 接入。文件名、存储位置、默认注入和权限继承不能从一个产品推断到另一个产品；只有实际支持的部分参与适配。

### 1.1 Agent-level harness profile：角色范围比模型范围更窄

Google Antigravity 的官方博客文章 `google-antigravity-custom-agents-2026-08-12`（2026-08-12 发布）补充了一个更窄的 harness 单元：同一模型和 provider 内，可以用文件化角色配置限定 system instruction、默认工具、Skill/MCP 子集、模型、权限（如 `permissionMode`、`commandExecutionPolicy`）与生命周期 Hook（如 `PreInvocation`、`PreToolUse`），并通过 `mainAgent` / `subagent` 标志选择该角色能作为主 Agent、子 Agent 或两者运行。文章记载的项目级角色路径为 `.agents/agents/`，用户级路径为 `~/.gemini/config/agents/`；这些路径和字段属于 2026-08-12 发布时的外部产品接口记录，实际使用前仍需核对目标版本官方文档。

可迁移的原则是：项目特有的测试、依赖和构建约定留在项目；跨项目角色只在真实复用需求下设置。子 Agent 的启动形态或 provider 侧 Hook 不替代父级授权、证据检查和最终验收。此处不假定存在 `coding-agent-delegation` 或任何预装执行通道。

### 2. 当前不应马上新建 AI Agent runtime profile

> [!volatile]
> verified_at: 2026-10-20
> review_by: 2026-12-20
> source: docs:https://hermes-agent.nousresearch.com/docs
>
> 当前 Hermes Agent 官方文档说明其配置入口为 `~/.hermes/config.yaml`、`.env`、`SOUL.md` 及 `hermes model`、`hermes setup`、`hermes tools` 等 CLI 命令，用于切换 provider/model 与工具配置，并未内置上述 LangChain `deepagents` 式的按模型自动切换 `HarnessProfile` 注册表。

AI Agent 的 profile 能力、命令和存储位置属于版本化产品接口；部署前应查当前官方文档并在目标版本运行只读帮助命令。本页不声称 profile 已创建、某个 provider 已配置或 Gateway 健康，也不授权改变这些状态。

稳定原则仍是：不因为一篇文章或一组模型分数就增加 runtime profile。下面的顺序是参考治理方法，不是已部署拓扑。

更合理的顺序是：
1. 先在 wiki 记录模型差异原则。
2. 再在现有 skills 中做窄范围 prompt/tool 适配。
3. 用小型 eval project 验证某个适配是否真的改善结果。
4. 只有当稳定收益明确时，才考虑 quick command、skill、cron 或 AI Agent profile 层的推广。

### 3. 按任务失败模式选择适配项

- 检索不足：明确读取范围、证据来源和必要工具。
- 修改后自报完成：补入最小可运行验证与产物回读。
- 工具误用：收窄暴露面、参数约束和失败语义。
- 摘要遗漏来源限制：分离抽取与综合，标明截断和不可读范围。

这些是待验证的适配方向，不是对 Codex、Claude、Gemini 或任一模型能力的固定排名。使用同一代表性任务集比较 baseline 与 overlay 的正确性、成本和边界遵守情况。

## Engineering principles for AI Agent
### Principle 1: Model swap requires harness review
切换模型前必须问：当前 prompt、tools、skills、verification 是否适配这个模型？不能只看 benchmark 或模型名。

### Principle 2: Optimize overlays before core changes
先通过 skill、project context、wrapper script、quick command 形成窄 overlay。只有 overlay 经验证反复有效，才考虑改 AI Agent core 或 runtime profile。

### Principle 3: Eval before promotion
任何 model-specific harness 改动都必须有小型可复现 eval：同一任务、同一输入、同一验收标准，对比 base 与 overlay。

### Principle 4: Do not bloat global prompt
模型差异不应全部塞进全局系统提示。能放 skill 的放 skill，能放项目上下文的放项目上下文，能放 wrapper 的放 wrapper。

### Principle 5: Verification is part of the harness
对 AI Agent 来说，verification 不是任务末尾的一句话，而是 harness 的组成部分：读取、测试、状态检查、日志检查和输出路径确认都应成为模型适配的一部分。

## Promotion ladder
1. `session note`：一次性观察，默认不沉淀。
2. `wiki concept`：有长期架构价值的原则。
3. `skill patch`：已在同类任务中多次复用的执行方法。
4. `wrapper / quick command`：输入输出稳定、适合封装的流程。
5. `validation project`：需要 A/B 比较或多轮评估的 harness 改动。
6. `cron`：方法稳定且适合定时执行。
7. `AI Agent runtime profile`：只有当运行时隔离有真实价值时才创建。

## Anti-patterns
- 因为读到“profile 有用”就马上创建多个 AI Agent runtime profiles
- 把 Codex、Claude、Gemini 的所有差异塞进 memory 或全局 SOUL
- 没有 eval 就把 prompt overlay 推广到所有任务
- 用模型 benchmark 替代本地 workflow 评估
- 让 cron 运行还没稳定的 model-specific prompt 实验


## Evidence boundary and promotion

旧版页面曾记录本地规划、审查与摘要 overlay 的验证和晋升结果，但缺少公众可回读的实验材料，不能作为已验证效果继续引用。本页仅保留方法建议，不宣称任何 Skill 已被改造或发布。

可采用的顺序是：Wiki 概念 → 项目内可复验证据 → 窄适配补丁 → 回归验证；调度、运行配置或核心代码变更仅在独立需求、证据与授权具备时进行。

## Relations
- depends_on: [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- related: `langchain-tuning-deep-agents-different-models-2026-04-29`, [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities), [codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering), [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)

