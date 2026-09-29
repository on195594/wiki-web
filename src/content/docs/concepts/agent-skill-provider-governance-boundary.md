---
title: Agent Skill Provider Governance Boundary
created: 2026-05-25
updated: 2026-09-29
type: concept
tags:
  - agent
  - skills
  - governance
  - architecture
sources:
  - raw/articles/microsoft-devblogs-agent-skills-python-provider-2026-05-24.md
  - docs:https://devblogs.microsoft.com/agent-framework/agent-skills-for-python-file-code-and-class-composed-in-one-provider/
status: stable
description: 说明多形态 Agent skill 进入统一 provider 前需要保持的命名、暴露和审批边界。
---

# Agent Skill Provider Governance Boundary

## Summary

Agent skill 系统的长期价值不在于把所有技能塞进同一个目录，而在于把多种物理形态统一到一个可治理的 provider 抽象下。文件技能、类封装技能和运行时内联技能可以共享发现、组合、过滤、去重与执行入口；但进入统一注册池前，必须先定义命名、暴露范围、审批、沙箱和审计边界。

这页把 Microsoft Dev Blogs 的 Agent Framework Python Skills 文章编译成 AI Agent 可复用的治理原则。它连接 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)、[hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)、[hermes-skill-refactoring-methodology](/concepts/hermes-skill-refactoring-methodology) 和 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)。

## Durable principle

先统一 skill 抽象，再分层治理 skill 来源。

一个 Agent 可以同时消费多种 skill 形态：
- file-based skill：`SKILL.md`、`scripts/`、`references/` 等文件资产；
- class-based skill：由 Python 类和装饰器暴露 resource/script；
- inline/code-defined skill：运行时用代码或闭包生成临时能力。

这些形态可以通过 provider/source 组合向 Agent 暴露同一类能力。但“可组合”只解决接入问题，不自动解决治理问题。

## Governance boundary

### 1. Skill source composition is not skill promotion

聚合多个 skill source 只能说明它们能被同一个 provider 读取，不说明它们都应该进入 active 层。对 AI Agent 来说，project-local skill、实验 skill、一次性桥接逻辑和 active skill 应继续分层，不能因为技术上可合并就混成一个默认注册池。

### 2. Filtering is the explicit permission layer

过滤层应回答“这个 Agent 当前允许看见哪些 skill”。白名单、任务域过滤和 profile/project 边界，比单纯依赖自然语言描述更可靠。没有过滤层时，skill 数量越多，误路由和越权调用的风险越高。

### 3. Deduplication is a convenience, not a governance model

微软示例里的去重机制说明重名 skill 可以按注册顺序遮蔽，但这只是工程便利。AI Agent 不应把“先注册者优先”当成治理规则；更稳妥的做法是显式命名空间、冲突检测、来源记录和审查。

### 4. Script execution requires a separate safety boundary

文章展示了脚本执行前审批能力，并提醒示例 runner 仍需沙箱、资源限制、输入验证和日志。对 AI Agent 的映射是：skill 文档、参考材料、脚本和工具调用不应拥有同等风险等级；能执行代码或写外部系统的 skill 必须有更强的审批、回滚和审计要求。

## What to preserve from the source

- Microsoft Agent Framework Python Skills 支持 file-based、class-based、inline/code-defined 三种技能形态。
- 多来源 skill 可以通过 aggregation、deduplication、filtering 组合成统一 provider。
- `require_script_approval` 体现了高风险脚本执行前的人类审批模式。
- 官方示例仍明确提示：生产执行器不能只用简单 `subprocess.run`，必须补沙箱、资源限制、输入验证和日志。

## What not to promote

- 不把 Microsoft Agent Framework 的具体 API、类名、装饰器顺序沉淀为 AI Agent 默认实现规范。
- 不把微软的 `require_script_approval` 等价为 AI Agent 当前审批机制；它只是一个外部案例。
- 不把示例脚本 runner 当作生产实践。
- 不从这篇文章直接推广 active skill、runtime、MCP、cron、wrapper 或 AI Agent core 改动。

## AI Agent implication

这篇文章适合作为 AI Agent skill 分层治理的外部佐证：

- active skill 是默认运行层，必须轻、窄、可验证；
- project-local skill 是验证层，可以承载实验和项目上下文；
- inline/temporary bridge 适合短期连接能力，但不应无审查进入 active 注册池；
- skill provider 或 loader 设计应优先支持来源标记、白名单过滤、冲突检测和执行审批，而不是只追求统一加载。

## Related

- [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [hermes-skill-refactoring-methodology](/concepts/hermes-skill-refactoring-methodology)
- [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)

