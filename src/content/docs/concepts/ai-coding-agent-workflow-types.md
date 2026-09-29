---
title: AI Coding Agent Workflow Types
created: 2026-04-30
updated: 2026-09-20
type: concept
tags:
  - agent
  - ai-coding
  - workflow
  - tool
  - deployment
  - governance
sources:
  - raw/articles/realpython-ai-coding-agents-four-workflow-types-2026-04-29.md
  - raw/articles/towardsdatascience-work-with-ai-coding-agents-2026-08-27.md
  - docs:https://hermes-agent.nousresearch.com/docs
status: stable
description: 分类 AI coding agent 的常见工作流类型，用于选择合适的协作和验证方式。
aliases:
  - coding-agent-workflow-types
---

# AI Coding Agent Workflow Types

## Summary

AI coding agent 的选型不应先按品牌判断，而应先按交互模式判断：IDE、Terminal、Pull Request、Cloud 四类工作流分别对应不同的控制方式、执行环境、自主程度和风险边界。这个分类补充了 `[codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering)` 和 `[hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)`：后者回答“agent 工作流内部应如何分层”，本页回答“当前任务该放在哪种 agent 交互模式里执行”。

## Core thesis

Agent 与普通 chatbot 的差异在于持续执行循环：read → reason → act → evaluate。真正影响使用方式的不是这个循环本身，而是 agent 被放在哪个执行环境中。

因此，选择 coding agent 时应先问：

- 我是否要在编辑器里实时协作？
- 我是否要在本机 shell 中逐步控制复杂改动？
- 我是否只需要 PR 层面的异步审查？
- 我是否愿意把边界清楚的任务交给远端环境后台执行？

## Collaboration loop and human review gate

``towardsdatascience-work-with-ai-coding-agents-2026-08-27`` 补充了交互模式选择之前的协作闭环：一份可执行的 coding-agent 任务应至少给出目标、需要读取的上下文、不可越过的约束、验收标准和验证命令；“让代码更好”这类没有问题定义与成功标准的请求，应先澄清而不是直接交给 Agent。

对需要修改仓库的任务，采用 **Ask → Inspect → Plan → Implement → Test → Review**：先让 Agent 只读检查代码位置、相关测试与架构约束，再确认计划并进入小步实现。任务应拆成可独立检查的小单元，每一步尽早运行相关验证，避免在错误理解上一次修改大量文件。

测试通过只说明实现满足了当前可执行检查，不代表设计已经合理。最终人工审查仍需检查：是否符合现有架构、是否出现无关改动或隐藏假设、是否新增了依赖、异常输入是否被处理，以及可维护性和安全影响。该来源是实践者经验总结，不提供不同模型或工作流的量化对照，因此这些内容作为协作检查项，而不是证明某种流程必然提升固定比例的性能。

## Four workflow types

### 1. IDE agents: realtime editing companion

IDE agent 适合紧贴当前代码编辑的任务：补全、局部重构、解释附近代码、生成小范围 diff、在编辑器内接受或拒绝修改。

常见形态：

- AI-native IDE：Cursor、Windsurf、Kiro。
- IDE integration：GitHub Copilot extension、Claude Code in VS Code、Gemini Code Assist。

适合：

- 文件局部修改。
- 需要即时视觉 diff 的改动。
- 开发者仍主导编辑节奏的任务。

主要风险：

- 云端 IDE agent 可能把代码发往外部服务。
- 对隐私敏感代码，应优先确认团队政策、本地模型或批准工具链。

### 2. Terminal agents: controlled local execution loop

Terminal agent 运行在 shell 中，适合跨文件、跨命令、跨验证步骤的工程任务。用户通常逐步批准其读文件、改文件、跑测试或调用工具。

常见工具：Claude Code、Aider、Gemini CLI、OpenCode、Codex CLI。

适合：

- 多文件修改。
- 大代码库导航。
- 接手陌生项目。
- 需要读日志、跑测试、链式执行 CLI 的任务。

主要优势：

- 与已有开发环境兼容。
- 控制感强。
- 能把 build/test/verify 纳入同一执行闭环。

主要风险：

- 权限过宽会放大误操作。
- auto mode 必须配合更强的验证和 review。
- 外部模型仍可能触发代码外传合规问题；本地模型或受控环境可作为替代。

### 3. Pull request agents: asynchronous review layer

PR agent 不负责陪你实时编码，而是在 PR 打开或更新后异步检查共享分支。它更像 reviewer safety net，而不是实时 pair programmer。

常见工具：CodeRabbit、GitHub Copilot code review。

适合：

- 合并前发现 edge case、缺测试、风格问题、逻辑漏洞。
- 给团队 review 流程加一层自动筛查。
- 对已经形成 diff 的代码做第二视角检查。

主要边界：

- 作用对象是共享分支，不是本地工作区。
- 人类 reviewer 仍是最终 merge gate。
- 隐私与权限通常由组织或 repo 级策略决定。

### 4. Cloud agents: autonomous remote execution

Cloud agent 的自主性最高。用户描述任务，agent 在远端或托管环境中执行，稍后交付 branch、PR 或 prototype。

常见工具：Devin、Claude Code on the web、Codex web、Cursor Cloud Agents。

适合：

- 边界清楚的原型。
- 可以后台跑、稍后 review 的任务。
- 输出容易审查的 branch、PR 或 demo。

主要风险：

- 实时控制最弱。
- 执行环境通常不在本机。
- 安全、合规、密钥、权限边界必须提前确认。
- 自主程度越高，人工 review 越不能省。

## Product categories blur

这四类不是产品分类，而是工作模式分类。同一工具可能覆盖多种模式：

- Claude Code：terminal、IDE extension、web/cloud、PR review。
- Cursor：IDE、CLI、Cloud Agents、Bugbot PR review。
- GitHub Copilot：IDE、CLI、PR review、cloud agent。

所以“选哪个工具”之前，应先确定“我现在要的是哪种交互模式”。

## Decision rules

### Use an IDE agent when

- 修改范围贴近当前文件或少量文件。
- 你希望边写边看 diff。
- 任务需要频繁人工判断而不是后台长跑。

### Use a terminal agent when

- 任务跨多个文件、命令或验证步骤。
- 需要本机上下文、日志、测试、脚本和文件系统。
- 你希望 agent 执行，但仍保留逐步控制。

### Use a PR agent when

- 代码已经形成 PR 或可 review diff。
- 目标是发现问题，而不是实时生成实现。
- 需要团队合并流程中的自动安全网。

### Use a cloud agent when

- 任务边界明确、可隔离、可回滚。
- 输出可以通过 branch / PR / prototype 审查。
- 你接受较低实时控制，并已处理权限与合规问题。

## Hermes interpretation

对支持相应 gateway、delegation 和调度能力的 Hermes 版本，这个分类可以作为入口选择参考。具体命令和运行语义必须在目标版本对照官方文档核验：

- 消息 gateway 可形成“远程触发的 terminal/cloud 混合模式”；是否启用及其执行位置由部署决定。
- delegation/subagent 可形成受控 handoff，但上下文、隔离和生命周期语义以目标版本为准，输出仍需父级验证。
- 对代码修改，Hermes 应继续优先按任务复杂度决定是否走 plan、subagent、terminal verification，而不是把所有任务都当成同一种聊天请求。
- 对 PR review 类任务，应把目标限定为 review / comment / risk finding，不应默认直接改本地工作区。
- 对 cron，应只承接已经稳定的 workflow；这与 cloud agent 的高自主性类似，都要求边界清楚、失败代价可控、输出可审查。

上述示例不表示 Telegram、gateway、delegation 或 cron 已经部署或授权。

内部编排层见 `[subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)`：本页按用户与执行环境的交互方式分类；subagent 编排页按主 agent 对 worker 生命周期的控制方式分类。两者应组合使用，避免把“远程/后台执行”误等同于“需要复杂多智能体团队”。

## Anti-patterns

- 用 IDE agent 做大型跨仓修改，却不给完整上下文。
- 用 terminal agent 跑高权限 auto mode，却不验证 diff 和测试。
- 把 PR agent 当成最终质量责任人。
- 把 cloud agent 用在权限模糊、输出难审查、密钥复杂的任务上。
- 按品牌选 agent，而不是按工作流选 agent。

## Relation to existing wiki pages

- `[codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering)`：回答 agent 工作流内部的层次：prompt、planning、AGENTS.md、config、verification、MCP、skills、automation。
- `[hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)`：把分层思想翻译成 Hermes 的知识层、方法层、工具层、验证层与 cron。
- 本页：补上“外部执行环境 / 交互模式”的分类，用于判断任务应该走 IDE、terminal、PR 还是 cloud-style handoff。

## Related

- [codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering)
- [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)
- [claude-code-practical-workflow-tips](/concepts/claude-code-practical-workflow-tips)
- `towardsdatascience-work-with-ai-coding-agents-2026-08-27`
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`
- [first-edit-economy-for-coding-agents](/concepts/first-edit-economy-for-coding-agents)

