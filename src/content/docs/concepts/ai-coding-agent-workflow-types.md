---
title: AI Coding Agent Workflow Types
created: 2026-04-30
updated: 2026-11-26
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
  - raw/articles/anthropic-ai-native-sdlc-playbook-2026-08-21.md
  - docs:https://hermes-agent.nousresearch.com/docs
  - https://arxiv.org/abs/2302.06590
  - https://economics.mit.edu/sites/default/files/inline-files/draft_copilot_experiments.pdf
  - https://metr.org/Early_2025_AI_Experienced_OS_Devs_Study-paper.pdf
  - https://metr.org/blog/2026-02-24-uplift-update/
  - https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/
  - https://arxiv.org/html/2505.23419v1
  - https://arxiv.org/abs/2608.09802v1
  - https://arxiv.org/abs/2602.10975
  - https://arxiv.org/abs/2509.22237
  - https://arxiv.org/abs/2605.22526v1
  - https://arxiv.org/abs/2611.07166v1
  - https://arxiv.org/html/2412.01769v1
status: stable
volatility: medium
review_by: 2027-03-02
description: 分类 AI coding agent 的四类交互模式，结合受控生产力 RCT（绿地提速 vs 成熟大仓减速与感知错觉）、2026
  去污染基准边界及 AI-Native SDLC 阶段工件链选择协作方式。
aliases:
  - coding-agent-workflow-types
verified_at: 2026-11-02
---

# AI Coding Agent Workflow Types

## Summary

AI coding agent 的选型不应先按品牌判断，而应先按交互模式判断（[realpython-ai-coding-agents-four-workflow-types-2026-04-29](https://github.com/on195594/wiki/blob/f50b497161edfca34aa32dd28d5515c0b8c491cc/raw/articles/realpython-ai-coding-agents-four-workflow-types-2026-04-29.md)）：IDE、Terminal、Pull Request、Cloud 四类工作流分别对应不同的控制方式、执行环境、自主程度和风险边界。这个分类补充了 [codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering) 和 [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)：后者回答“agent 工作流内部应如何分层”，本页回答“当前任务该放在哪种 agent 交互模式里执行”。

## Core thesis

Agent 与普通 chatbot 的差异在于持续执行循环：read → reason → act → evaluate。真正影响使用方式的不是这个循环本身，而是 agent 被放在哪个执行环境中。

因此，选择 coding agent 时应先问：

- 我是否要在编辑器里实时协作？
- 我是否要在本机 shell 中逐步控制复杂改动？
- 我是否只需要 PR 层面的异步审查？
- 我是否愿意把边界清楚的任务交给远端环境后台执行？

## Collaboration loop and human review gate

[towardsdatascience-work-with-ai-coding-agents-2026-08-27](https://github.com/on195594/wiki/blob/f50b497161edfca34aa32dd28d5515c0b8c491cc/raw/articles/towardsdatascience-work-with-ai-coding-agents-2026-08-27.md) 补充了交互模式选择之前的协作闭环：一份可执行的 coding-agent 任务应至少给出目标、需要读取的上下文、不可越过的约束、验收标准和验证命令；“让代码更好”这类没有问题定义与成功标准的请求，应先澄清而不是直接交给 Agent。

对需要修改仓库的任务，采用 **Ask → Inspect → Plan → Implement → Test → Review**：先让 Agent 只读检查代码位置、相关测试与架构约束，再确认计划并进入小步实现。任务应拆成可独立检查的小单元，每一步尽早运行相关验证，避免在错误理解上一次修改大量文件。

测试通过只说明实现满足了当前可执行检查，不代表设计已经合理。最终人工审查仍需检查：是否符合现有架构、是否出现无关改动或隐藏假设、是否新增了依赖、异常输入是否被处理，以及可维护性和安全影响。该来源是实践者经验总结，不提供不同模型或工作流的量化对照，因此这些内容作为协作检查项，而不是证明某种流程必然提升固定比例的性能。

## AI-Native SDLC artifact chain and bottleneck shift

Anthropic 的 [anthropic-ai-native-sdlc-playbook-2026-08-21](https://github.com/on195594/wiki/blob/f50b497161edfca34aa32dd28d5515c0b8c491cc/raw/articles/anthropic-ai-native-sdlc-playbook-2026-08-21.md)（Louis Claxton，2026-08-21）从软件开发全生命周期（Plan → Design → Build → Test → Deploy → Maintain）视角指出了 Coding Agent 普及后的结构性瓶颈转移：**当 Build（编码实现）阶段从数周被压缩至数小时后，系统瓶颈向左右两侧仍以人类速度运行的阶段（需求规划、跨团队设计对齐、代码/安全审查与发布审批）转移**。如果仅加速代码生成而保持传统手工交接，审查队列会迅速积压或迫使代码在审查不足下上线（排队论容量边界见 [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence)）。

为消除阶段间的手工转译损耗与责任断层，该指南提出用**提交到版本控制的机器可读工件链（Committed Artifact Chain）**串联六个阶段：

1. **阶段交接即提交工件（Stage Handoff via Committed Artifacts）**：
   - **Plan（`intent.md`）**：发起人与 Agent 脑暴澄清范围、受影响系统与约束，生成原型规约 `intent.md`，由产品负责人审阅修正后提交入库；
   - **Design（`spec.md`）**：在加载组织级安全、合规与 UX Skills 的会话中读取 `intent.md`，在同一工作会话内合一生成需求与设计规约 `spec.md`，显式标出冲突政策与风险点并交由策略所有者拍板；
   - **Build（`plan.md` → `diff & tests`）**：工程师先在只读 Plan Mode 下基于 `spec.md` 生成包含变更文件、执行顺序、潜在破坏点与证明测试的 `plan.md`；计划获批入库后再切换至执行模式（小爆炸半径且有测试覆盖的常规改动可配合 git worktree 开启并行会话与 auto mode），偏离计划时必须在同一 commit 同步更新 `plan.md`；
   - **Test / Deploy / Maintain（`PR review findings` → 新 `intent.md`）**：PR 审查对照 `spec.md` 与 `plan.md` 核验实际 diff；生产维护由确定性监控脚本按滚动基线标准差（如 Western Electric 规则）分级触发——`1σ` 仅记录日志，`2σ` 唤醒只读 Agent 诊断，`3σ` 仅允许通过受控路由提 PR 或触发预批回滚 runbook，并将异常诊断写回新的 `intent.md` 闭合循环。
2. **与存量系统的事实源对齐（Single Source of Truth Alignment）**：
   指南建议已有 Jira、ServiceNow 或合规需求管理工具的企业优先为每个阶段工件指定唯一事实源；双向链接则是仍保留两个事实源的过渡方案：
   - **Repo-as-SoT**：仓库内 Markdown 工件为权威记录，外部工单系统仅保存指向 commit 文件的链接；
   - **Legacy-as-SoT**：外部合规系统为权威记录，Agent 在会话开始时通过 MCP 读取工单，并将生成的规约或计划在同一会话内写回；
   - **双向标识绑定（Linkage as minimum bar）**：过渡期至少要求 Markdown 工件记录外部工单 ID，且外部工单记录对应 Markdown 文件的 commit SHA。原文明确承认此时仍有两个事实源，链接本身不解决内容冲突。本 wiki 建议采用此方案时另行指定冲突裁决责任人与同步规则，并逐步收敛到唯一权威记录。

**证据与采用边界**：该来源是 Anthropic Applied AI 团队的官方工程指南，属于厂商方法论总结，未提供跨组织独立受控实验数据集；文中提及的 `Claude Design`、`Claude Security`、`Claude Tag` 及 `1σ/2σ/3σ` 响应分级为特定产品与配置示例，不代表通用默认阈值或已部署能力。可迁移的核心原则是：**按任务风险与跨阶段交接需求保留最小版本化工件链，将人类注意力集中于阶段门禁裁决（Intent / Spec / Plan / Release Gate），并确保 Agent 的写权限严格止步于生产发布门禁之前**（补充 [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles) 与 [agent-development-lifecycle](/concepts/agent-development-lifecycle)）。

## Empirical productivity boundaries and 2025–2026 benchmark cliffs

选工作流时，先看研究测的是完成耗时、团队吞吐，还是基准解题率。以下实验使用的工具、任务、参与者不同；不能只凭跨研究差异断定仓库规模造成了提速或减速。

1. **不同开发场景中的随机对照试验（RCT）**：
   - **绿地隔离任务显著提速**：Sida Peng 等（2023，[arXiv:2302.06590](https://arxiv.org/abs/2302.06590)）招募 95 名开发者独立实现标准 HTTP 服务器，在完成任务的人中，使用 GitHub Copilot 组平均耗时缩短 **55.8%**（`71.17` 分钟 vs 对照组 `160.89` 分钟，$p = 0.0017$）。
   - **企业项目中的吞吐与构建质量**：Cui 等（2025，[三企业现场实验，表 2](https://economics.mit.edu/sites/default/files/inline-files/draft_copilot_experiments.pdf)，共 4,867 名开发者）的合并估计显示，每周完成的 PR 数增加 `26.08%`，构建次数增加 `38.38%`。提交数 `+13.55%` 与构建成功率 `−5.53%` 是相对于对照组均值的点估计，两者均未达到统计显著；不能据此断言构建质量下降。
   - **成熟百万行大仓资深维护者实测减速与 39pp 认知错觉**：Joel Becker 等（[METR 2025-07 受控实验](https://metr.org/Early_2025_AI_Experienced_OS_Devs_Study-paper.pdf)）对 16 名资深开源维护者（平均拥有目标仓库 5 年经验、仓库规模均值逾 `110` 万行代码）的 246 个真实任务进行随机分派：允许使用 Cursor Pro（Claude 3.5/3.7 Sonnet 等）使实际完成时间**增加 19%**（95% CI: `+2%` 至 `+39%`），开发者仅接受不到 `44%` 的生成结果并耗费约 `9%` 总时间审查与清理 AI 代码——然而同一批开发者在实验前预测 AI 能提速 `24%`，实验结束后仍主观认为自己快了 `20%`（主观体感与客观计时相差 **39 个百分点**）。[METR 2026-02 追踪更新](https://metr.org/blog/2026-02-24-uplift-update/)虽在新一代 CLI Agent 上观测到原参与者和新参与者的耗时点估计分别为 `−18%`、`−4%`（两个置信区间均跨零），但指出 `30%–50%` 参与者拒绝将自判高提速任务纳入随机对照，存在显著选择偏差。
2. **基准去污染与长链路工程任务断崖（2025–2026）**：
   - **单点 Bug 修复基准污染与停用**：[OpenAI 于 2026-02-23 宣布停用 SWE-bench Verified](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)，对 o3 在 64 次运行中未能稳定解决的 138 题进行审计，发现**该子集中 59.4% 的测试设计或题目描述有实质问题**（`35.5%` 断言过窄绑定未声明内部实现，`18.8%` 超范围测试未要求特性）且存在训练记忆污染。独立研究在 [*SWE-bench-Live*](https://arxiv.org/html/2505.23419v1)（1,319 题）上比较了同一配置：Claude 3.7 + OpenHands 解决率从 Verified 的 `43.20%` 跌至 **19.25%**。
   - **跨文件重构、特性开发与多步演进瓶颈**：在平均跨 11.4 个文件的 [*SWE-Bench ProMax*（COLM 2026）](https://arxiv.org/abs/2608.09802v1) 上，GPT-5.2 配合完整 `OpenHands` 脚手架（`41.2%`）显著优于极简 `mini-swe-agent`（`21.8%`），说明跨文件重构高度依赖环境脚手架；另据 Tian 等（[arXiv:2605.22526v1](https://arxiv.org/abs/2605.22526v1)）在 Multi-SWE-bench 样本中测得 **21.43%** 的 Agent 补丁含纠缠重构，低于人工补丁的 `36.72%`（Tangled Refactorings）。一旦转向端到端新特性或从零构建，[*FeatureBench*（ICLR 2026）](https://arxiv.org/abs/2602.10975) 上 Claude 4.5 Opus 从 SWE-bench 的 `74.4%` 骤降至 **11.0%**；纯自然语言需求基准 [*FeatBench*](https://arxiv.org/abs/2509.22237) 最优仅 **29.94%**（常死于越界激进实现）；5–15 步长链演进 [*Multi-step SWE*（2026-11）](https://arxiv.org/abs/2611.07166v1) 最优仅 **18.5%**（版本升级子集仅 `2.9%`）；[*Commit0*](https://arxiv.org/html/2412.01769v1) 收录 54 个 Python 库，论文评测主要使用 16 库的 Lite 子集；当时受测的 Agent 均未完整复现一个库。

`[推论]` 工作流选型不能凭主观“体感变快”拍板：在熟悉度极高、隐性不变量密集的成熟核心模块，优先采用低摩擦 **IDE 局部辅助**或遵循 [first-edit-economy-for-coding-agents](/concepts/first-edit-economy-for-coding-agents) 的窄范围 **Terminal 受控循环**，避免宽泛后台委托制造高于手写成本的清理税；仅当边界清晰、可独立回滚且配有进程外验证闭环（[agent-self-validation-loops](/concepts/agent-self-validation-loops)）时，才升级至高自主度 Cloud 或多步后台模式。

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

## AI Agent interpretation

对支持相应 gateway、delegation 和调度能力的 AI Agent 版本，这个分类可以作为入口选择参考。具体命令和运行语义必须在目标版本对照官方文档核验：

- 消息 gateway 可形成“远程触发的 terminal/cloud 混合模式”；是否启用及其执行位置由部署决定。
- delegation/subagent 可形成受控 handoff，但上下文、隔离和生命周期语义以目标版本为准，输出仍需父级验证。
- 对代码修改，AI Agent 应继续优先按任务复杂度决定是否走 plan、subagent、terminal verification，而不是把所有任务都当成同一种聊天请求。
- 对 PR review 类任务，应把目标限定为 review / comment / risk finding，不应默认直接改本地工作区。
- 对 cron，应只承接已经稳定的 workflow；这与 cloud agent 的高自主性类似，都要求边界清楚、失败代价可控、输出可审查。

上述示例不表示 Telegram、gateway、delegation 或 cron 已经部署或授权。

内部编排层见 [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)：本页按用户与执行环境的交互方式分类；subagent 编排页按主 agent 对 worker 生命周期的控制方式分类。两者应组合使用，避免把“远程/后台执行”误等同于“需要复杂多智能体团队”。

## Anti-patterns

- 用 IDE agent 做大型跨仓修改，却不给完整上下文。
- 用 terminal agent 跑高权限 auto mode，却不验证 diff 和测试。
- 把 PR agent 当成最终质量责任人。
- 把 cloud agent 用在权限模糊、输出难审查、密钥复杂的任务上。
- 按品牌选 agent，而不是按工作流选 agent。

## Relation to existing wiki pages

- [codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering)：回答 agent 工作流内部的层次：prompt、planning、AGENTS.md、config、verification、MCP、skills、automation。
- [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)：把分层思想翻译成 AI Agent 的知识层、方法层、工具层、验证层与 cron。
- 本页：补上“外部执行环境 / 交互模式”的分类，用于判断任务应该走 IDE、terminal、PR 还是 cloud-style handoff。

## Relations

- refines: [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order), [codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering)
- related: [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [first-edit-economy-for-coding-agents](/concepts/first-edit-economy-for-coding-agents), [agent-development-lifecycle](/concepts/agent-development-lifecycle), [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles), [agent-self-validation-loops](/concepts/agent-self-validation-loops)

