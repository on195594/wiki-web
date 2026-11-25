---
title: AI Coding Assistant Context Budget Management
created: 2026-05-09
updated: 2026-11-20
type: concept
tags:
  - ai-coding
  - agent
  - context-engineering
  - optimization
  - claude-code
sources:
  - raw/articles/analyticsvidhya-claude-code-token-saving-2026-05-08.md
  - raw/articles/microsoft-developer-ai-coding-agents-use-technology-2026-05-27.md
  - raw/articles/github-copilot-cost-efficient-coding-2026-09-02.md
  - raw/articles/x-lanlance-code-mode-json-plumbing-2026-08-24.md
  - https://aider.chat/2023/10/22/repomap.html
  - https://arxiv.org/abs/2407.01489
  - https://blog.cloudflare.com/code-mode/
  - https://blog.cloudflare.com/code-mode-mcp/
  - https://www.anthropic.com/research/advanced-tool-use
  - https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus
  - docs:https://code.claude.com/docs/en/prompt-caching
  - https://arxiv.org/abs/2610.28577
status: stable
volatility: medium
review_by: 2027-03-02
description: 总结 coding assistant 控制上下文预算、规避单次调用局部指标陷阱、选择性压缩工具输出、通过 Code Mode /
  PTC 隔离多步工具中间载荷和减少无效 token 消耗的方法。
aliases:
  - coding-context-budget
  - context-budget-management
verified_at: 2026-11-02
---

# AI Coding Assistant Context Budget Management

## Summary
AI coding assistant 的成本与稳定性主要受上下文输入治理影响，而不只是模型价格或 prompt 文案。文章《23 Tips for Smart Claude Code Token Saving》（[analyticsvidhya-claude-code-token-saving-2026-05-08](https://github.com/on195594/wiki/blob/de741c89ebb2d63e691256a55ca32adf5294db1a/raw/articles/analyticsvidhya-claude-code-token-saving-2026-05-08.md)）把 Claude Code 的省 token 技巧组织成一套更通用的原则：把上下文窗口当作预算资源，主动限制历史、文件、工具输出、日志和全局指令进入模型。

## Core principle
上下文窗口不是“越大越好”的垃圾桶，而是有限预算。

进入上下文的每一类内容都会产生成本和漂移风险：
- 历史对话
- 文件读取
- terminal / MCP / server tool 输出
- 测试日志
- 全局系统提示和项目指令
- 重复探索路径
- 无关目录和生成产物

因此，AI coding workflow 的首要设计问题不是“让模型多看一点”，而是“让模型只看当前任务真正需要的高密度证据”。

## Operating model
### 1. Session history is a liability after task boundaries
切换任务时，旧 debugging log、旧假设和旧探索路径通常不再提供价值。Claude Code 的 `/clear`、`/compact` 代表两种边界动作：
- `/clear`：任务边界明确时清空上下文
- `/compact`：同一长任务中压缩历史，只保留目标、已改文件、失败测试、决策和下一步

AI Agent 映射：长任务不要依赖完整聊天历史延续；应把 durable knowledge 写回 wiki/skill/project doc，把短期状态留在 session。

### 1.1 Prefix-cache compatibility: append-only, rewind, and tool masking

在支持前缀 Prompt Caching 的长会话中，“删减旧上下文”并不自动等价于省钱：改写既有消息会使变更点之后的前缀无法按原样命中，未变且仍有效的上游部分则可能继续复用（[Cache Engineering for Agents，arXiv:2610.28577](https://arxiv.org/abs/2610.28577)；完整缓存经济学与回本公式见 [agent-resource-optimization](/concepts/agent-resource-optimization)）：

- **区分保缓存操作与重建前缀操作**：如 [Claude Code Prompt Caching 文档](https://code.claude.com/docs/en/prompt-caching)所示，按消息尾部追加技能指令或运行 `/recap` 不破坏上游前缀；当会话仍在缓存 TTL 活跃窗口内且需放弃一条错误探索分支时，使用 `/rewind` 回退到已缓存的早期热前缀通常比 `/compact` 生成新摘要更省成本（若对应缓存已过期，两者都无法复用该缓存；`/compact` 会重建会话层和项目上下文层，但未变且仍有效的系统提示层可继续复用）；`/compact` 更适合放在明确的任务自然断点，且在缓存尚温热时执行摘要读取成本远低于冷会话恢复后压缩。
- **收窄工具面优先采用“掩码或延迟加载”而非中途增删定义**：工具 Schema 位于前缀前端，会话中途动态添加或删除 MCP 工具定义（以及在未开启工具搜索时添加裸工具名拒绝规则）会直接击穿全量缓存。**[推论]** 遵循 [Manus 工程实践（Mask, Don't Remove）](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)与延迟工具发现机制，保持静态工具前缀稳定，仅通过状态机约束、作用域权限规则或延迟加载收窄动作空间。

### 2. Instructions should be layered, not global
`CLAUDE.md` / `AGENTS.md` 这类全局或仓库常驻指令每次都会占用上下文。文章建议保持短小，并把 API、测试、模块规则迁移到路径级规则或按需 skills。2026 年实证研究亦提示：常驻上下文文件中堆砌静态仓库概览往往不提升成功率反而推高推理成本，应仅保留非标准约定与验收命令并在部署前对照验证（完整正反实证边界统一由 [repository-level-code-intelligence-layer](/concepts/repository-level-code-intelligence-layer) 维护）。

AI Agent 映射：
- 全局 developer/SOUL 只放稳定边界
- class-level skills 放可复用流程
- project AGENTS/CLAUDE 只放项目局部规则
- wiki 存概念和来源，不进默认 prompt 全量展开

### 3. Tool output needs hard caps and pre-filtering
工具输出是最容易失控的上下文污染源。文章建议限制 MCP/server output、terminal output，并在把测试日志交给模型前先过滤失败行。

可迁移规则：
- 不把完整日志直接贴给模型
- 先用 CLI 过滤错误摘要
- 限制 tool/server output token
- 要求 agent 只返回决策所需字段

AI Agent 映射：subagent 和 terminal 输出应优先返回压缩后的 evidence summary，而不是把完整探索过程灌回主会话。

Microsoft Developer 的 AX 文章（[microsoft-developer-ai-coding-agents-use-technology-2026-05-27](https://github.com/on195594/wiki/blob/de741c89ebb2d63e691256a55ca32adf5294db1a/raw/articles/microsoft-developer-ai-coding-agents-use-technology-2026-05-27.md)）把同一原则推广到 MCP/extension 返回值：工具返回太长、太少或格式混乱，都会让模型错过关键段落或用假设补空白。对 AI Agent 来说，agent-facing 工具输出不应追求“把所有资料都给模型”，而应优先返回当前任务决策所需的短结构：结论、必要字段、失败语义、下一步验证线索。

### 3.1 The local metric trap and selective output compaction

GitHub Copilot 团队的受控实验文章 [github-copilot-cost-efficient-coding-2026-09-02](https://github.com/on195594/wiki/blob/de741c89ebb2d63e691256a55ca32adf5294db1a/raw/articles/github-copilot-cost-efficient-coding-2026-09-02.md)（Erik Kristensen & Napalys Klicius，2026-09-02）揭示了上下文预算优化中最常见的反模式——**局部指标陷阱（The Local Metric Trap）**：如果只以“单次工具调用返回的 Token 数”作为优化目标，激进截断或压缩 shell 输出（例如早期实验直接压缩 `git diff` 或盲目套用通用输出裁剪器），会导致模型因丢失关键上下文而打开保存的原始输出、重跑命令或增加探索轮次。单次响应看似变短，但恢复步骤携带了更多历史上下文跨越额外轮次，反而推高了**完整任务的端到端总 Token 消耗与总耗时**（与 [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities) 的 $C_{\text{total}}$ 总成本模型及 $R_{\text{probe}}$ 回读探针一致）。

该团队基于离线基准与线上 A/B 实验采用了以下四项策略。这是来源中的实现选择，不是所有宿主的强制规则；本 wiki 建议迁移前先验证关键信息可恢复、行为不退化和端到端成本确有改善：

1. **按输出代表的信息类型做三分类处理，而非一刀切截断**：
   - **不对源码与任意脚本输出做有损压缩**：该实现保留 `cat`、`git diff`、`git show` 及自定义脚本结果，避免通用压缩器猜测哪些内容可丢弃；这不排斥调用前缩小查询范围，或通过分页读取保留完整原文；
   - **无损重排搜索结果**：该实现将 `grep` 等工具的匹配项与文件列表分组呈现，不在压缩阶段静默删除匹配；
   - **仅对可预测的重复噪声做选择性压缩，并保留直接恢复路径**：仅当 `install / build / test / lint` 进度日志节省显著时才予以压缩，同时提供直接回读完整原文的路径，并将“模型打开原文、重跑命令、重复搜索或增加轮次”的频率作为压缩器是否误删有效信息的监控信号。
2. **先移除无用格式开销，再考虑删减信息（Remove formatting before removing information）**：
   当文件编辑工具已改为基于上下文代码段匹配而非行号定位时，`view` 工具在每次读文件时为每行附加的行号前缀就变成了跨全会话累积的纯格式冗余。移除 `view` 行号前缀在不损失任何源码信息的前提下，使 Copilot 离线基准推理成本下降约 `5%`、CLI 线上实验日均每用户模型推理成本下降约 `3%`（代码审查场景单次评审平均 prompt tokens 亦下降约 `5%`），且未出现编辑失败率上升或质量退化。
3. **提示词压缩必须绑定行为回归测试（Compress prompts without compressing intent）**：
   元提示（meta-prompting）循环虽能将 `task` 工具提示词压缩约一半，但在首次线上实验中曾将“谨慎并行”指导静默改写为“强制串行调度策略”，导致独立子代理退化为顺序执行。只有针对并行调度补齐行为回归测试、并将冗长的允许/禁止列表精简为一句保留模型判断权的原则（`Independent agents can run in parallel; consider side effects.`）后，才安全实现了每轮减少约 `1,300` 个 prompt tokens（会话总 prompt tokens 减少约 `1.8%`，每活跃小时归一化成本降低约 `2.9%`）。
4. **由 Harness 直接投递后台完成结果，消除纯拉取轮次**：
   当后台 shell 命令与子代理相继完成时，若通知仅唤醒模型而不附带结果，模型必须额外消耗多轮调用去拉取已就绪的输出（每次拉取都重复携带全会话上下文）。由 Harness 批量合并就绪通知并直接以标准 `tool-result` 格式注入完整结果，可将处理两项并发结果的模型调用从 4 次减至 1 次（报告 AI Credits 消耗降低约 `2.3%`）。

证据边界：上述百分比（`3.1% / 5.5% / 2.9% / 2.3%` AI Credits 节省等）为 GitHub Copilot CLI 与代码审查特定工作负载的第一方实验报告，各项改进并非严格线性可加，且在代码审查有效的精简文件工具指令移植到 CLI 时曾导致成本上升而被放弃。因此，任何上下文压缩或提示词精简都必须在目标工作流中独立复验端到端完成率与回读率（详见 [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow)）。

### 3.2 Eliminate multi-turn JSON plumbing via programmatic tool execution (Code Mode / PTC)

除了裁剪单次工具输出，多工具工作流中另一项主要的上下文膨胀源是**跨工具中间载荷的逐轮回传**。如 [x-lanlance-code-mode-json-plumbing-2026-08-24](https://github.com/on195594/wiki/blob/de741c89ebb2d63e691256a55ca32adf5294db1a/raw/articles/x-lanlance-code-mode-json-plumbing-2026-08-24.md)、[Cloudflare Code Mode](https://blog.cloudflare.com/code-mode/) 与 [Anthropic Programmatic Tool Calling (PTC)](https://www.anthropic.com/research/advanced-tool-use) 所示（形式化损益不等式见 [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)）：

- **用 `Search + Execute` 替代全量 MCP Schema 预载**：当外部 API 或 MCP Server 拥有数百至上千个端点时，全量预载工具定义可在任务开始前即耗尽数十万至上百万 Tokens（[Cloudflare 续篇](https://blog.cloudflare.com/code-mode-mcp/)报告 2,500+ 端点全量 Schema 约 `117 万` Tokens）；其 `search()` + `execute()` 方案按需发现接口，可将常驻工具定义压降至约 `1,000` Tokens（参见 [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture)）。
- **将中间数据留在执行沙箱，仅向主上下文回传终态摘要**：当任务需要对多步工具返回的数据做分页拉取、过滤、排序或关联（如在 200KB 原始记录中筛出 1KB 异常项）时，由模型编写脚本在受控沙箱内完成循环与过滤，避免中间 JSON 反复进入模型历史消息（Anthropic 报告复杂研究任务平均 Token 消耗下降 `37%`，并消除 19+ 次模型前向推理往返）。这同样属于特定工作负载的第一方报告，迁移时须遵守 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 的宿主凭据隔离与逐次调用 Tool Gate 授权边界。

### 4. File access should be explicit and deny noisy surfaces
“读整个仓库”通常是上下文预算灾难。文章建议从明确文件开始，只允许读取 import/调用链相关文件，并 deny `.env`、secrets、`node_modules`、build、coverage、logs 等噪音目录。

结合代码智能与软件工程实证研究，控制文件读取预算还有两条高杠杆机制：
- **用 AST 符号签名图替代全量依赖文件正文**：如 [Aider RepoMap](https://aider.chat/2023/10/22/repomap.html) 所示，利用 Tree-sitter 提取跨文件类与函数调用签名并在引用图上按 PageRank 排序，在固定小预算（如 1k tokens）内即可向模型传达模块接口契约，仅对需要实际修改的文件加载完整实现源码。
- **按“文件 → 类/函数骨架 → 目标行窗口”三级漏斗定位**：如 [Agentless（Xia et al., 2024）](https://arxiv.org/abs/2407.01489) 在 SWE-bench Lite 上验证的层级化定位流水线，先根据问题与仓库结构筛出候选文件，再查看 AST 签名压缩视图定位具体函数，最后只读取目标行窗口并生成紧凑 Diff 补丁，从而避免无界探索循环打爆上下文窗口。

AI Agent 映射：子任务委派 / coding agent prompt 应明确：
- 起始文件
- 禁止全仓扫描
- 允许扩展读取的条件
- 禁止读取或回显的敏感/噪音路径

### 5. Model and agent choice is part of budget management
文章建议日常任务用便宜模型，复杂架构再用昂贵模型；重阅读任务用 subagent 隔离，主会话只接收清洁摘要。

AI Agent 映射：
- inline tool：低上下文、确定性动作
- subagent：重阅读、并行调查、隔离探索
- main agent：决策、集成、验证
- expensive model：只用于高不确定性或高风险推理

## Practical prompt skeleton
```text
Task: 修复/分析 [具体问题]，涉及 [具体文件]。

Scope:
- 从 [file1], [file2] 开始。
- 不要扫描整个仓库。
- 只有被这些文件 import、调用或测试直接引用时，才读取额外文件。

Token discipline:
- 命令输出保持简短。
- 测试日志只保留失败部分。
- 修改前先总结发现和证据。
- 上下文过长时先 compact / summarize。

Verification:
- 先跑 targeted test。
- targeted test 通过后再跑 broader test。
- 最终说明验证命令和结果。
```

## AI Agent implications
这页补充 [llm-context-engineering-layer](/concepts/llm-context-engineering-layer) 和 [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities) 的 coding-agent 侧落地：
- context budget 不只是系统内部 prompt assembly 问题，也是日常 agent 使用纪律
- skills 和 project rules 应减少默认上下文，而不是把所有经验都塞进全局提示
- subagent 的价值之一是隔离高噪音探索，只把结论带回主会话
- wiki 的作用是保存可检索原则，避免长期知识常驻 prompt

## What not to copy blindly
文章里一些 Claude Code 开关、隐藏设置或版本特性可能随版本变化，不应未经验证就写入 AI Agent 默认操作规则：
- `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT`
- `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS`
- `CLAUDE_CODE_DISABLE_THINKING`
- 具体 `/effort`、`/statusline`、auto-compact 环境变量行为

这些更适合在项目或工具版本验证后进入 skill/reference，而不是直接变成全局规范。

## Relationship to repository intelligence

[repository-level-code-intelligence-layer](/concepts/repository-level-code-intelligence-layer) complements context budget management by changing the input source: instead of letting an AI coding assistant scan broad repository surfaces, first derive high-density repository signals such as core files, module communities, co-change risks, and decision notes.

## Relations

- refines: [llm-context-engineering-layer](/concepts/llm-context-engineering-layer), [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities)
- related: [claude-code-practical-workflow-tips](/concepts/claude-code-practical-workflow-tips), [repository-level-code-intelligence-layer](/concepts/repository-level-code-intelligence-layer), [agent-context-engineering](/concepts/agent-context-engineering), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [first-edit-economy-for-coding-agents](/concepts/first-edit-economy-for-coding-agents), [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow), [how-i-should-use-hermes-for-ai-coding-with-typed-boundaries](/queries/how-i-should-use-hermes-for-ai-coding-with-typed-boundaries), [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order), [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture), [agent-resource-optimization](/concepts/agent-resource-optimization)

