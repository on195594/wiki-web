---
title: AI Coding Assistant Context Budget Management
created: 2026-05-09
updated: 2026-08-18
type: concept
tags:
  - ai-coding
  - agent
  - context-engineering
  - optimization
  - claude-code
  - hermes
sources:
  - raw/articles/analyticsvidhya-claude-code-token-saving-2026-05-08.md
  - raw/articles/microsoft-developer-ai-coding-agents-use-technology-2026-05-27.md
status: stable
description: 总结 coding assistant 控制上下文预算、压缩历史和减少无效 token 消耗的方法。
---

# AI Coding Assistant Context Budget Management

## Summary
AI coding assistant 的成本与稳定性主要受上下文输入治理影响，而不只是模型价格或 prompt 文案。文章《23 Tips for Smart Claude Code Token Saving》把 Claude Code 的省 token 技巧组织成一套更通用的原则：把上下文窗口当作预算资源，主动限制历史、文件、工具输出、日志和全局指令进入模型。

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

Hermes 映射：长任务不要依赖完整聊天历史延续；应把 durable knowledge 写回 wiki/skill/project doc，把短期状态留在 session。

### 2. Instructions should be layered, not global
`CLAUDE.md` 这类全局指令每次都会占用上下文。文章建议保持短小，并把 API、测试、模块规则迁移到路径级规则或按需 skills。

Hermes 映射：
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

Hermes 映射：subagent 和 terminal 输出应优先返回压缩后的 evidence summary，而不是把完整探索过程灌回主会话。

Microsoft Developer 的 AX 文章把同一原则推广到 MCP/extension 返回值：工具返回太长、太少或格式混乱，都会让模型错过关键段落或用假设补空白。对 Hermes 来说，agent-facing 工具输出不应追求“把所有资料都给模型”，而应优先返回当前任务决策所需的短结构：结论、必要字段、失败语义、下一步验证线索。

### 4. File access should be explicit and deny noisy surfaces
“读整个仓库”通常是上下文预算灾难。文章建议从明确文件开始，只允许读取 import/调用链相关文件，并 deny `.env`、secrets、`node_modules`、build、coverage、logs 等噪音目录。

Hermes 映射：delegate_task / coding agent prompt 应明确：
- 起始文件
- 禁止全仓扫描
- 允许扩展读取的条件
- 禁止读取或回显的敏感/噪音路径

### 5. Model and agent choice is part of budget management
文章建议日常任务用便宜模型，复杂架构再用昂贵模型；重阅读任务用 subagent 隔离，主会话只接收清洁摘要。

Hermes 映射：
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

## Hermes implications
这页补充 `[[llm-context-engineering-layer]]` 和 `[[hermes-context-engineering-design-priorities]]` 的 coding-agent 侧落地：
- context budget 不只是系统内部 prompt assembly 问题，也是日常 agent 使用纪律
- skills 和 project rules 应减少默认上下文，而不是把所有经验都塞进全局提示
- subagent 的价值之一是隔离高噪音探索，只把结论带回主会话
- wiki 的作用是保存可检索原则，避免长期知识常驻 prompt

## What not to copy blindly
文章里一些 Claude Code 开关、隐藏设置或版本特性可能随版本变化，不应未经验证就写入 Hermes 默认操作规则：
- `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT`
- `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS`
- `CLAUDE_CODE_DISABLE_THINKING`
- 具体 `/effort`、`/statusline`、auto-compact 环境变量行为

这些更适合在项目或工具版本验证后进入 skill/reference，而不是直接变成全局规范。

## Relationship to repository intelligence

`[[repository-level-code-intelligence-layer]]` complements context budget management by changing the input source: instead of letting an AI coding assistant scan broad repository surfaces, first derive high-density repository signals such as core files, module communities, co-change risks, and decision notes.

## Related
- [claude-code-practical-workflow-tips](/concepts/claude-code-practical-workflow-tips)
- [repository-level-code-intelligence-layer](/concepts/repository-level-code-intelligence-layer)
- [agent-context-engineering](/concepts/agent-context-engineering)
- `microsoft-developer-ai-coding-agents-use-technology-2026-05-27`
- [llm-context-engineering-layer](/concepts/llm-context-engineering-layer)
- [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities)
- [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)
- [index](/)
- `log`

