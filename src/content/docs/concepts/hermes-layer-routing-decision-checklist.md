---
title: Hermes Layer Routing Decision Checklist
created: 2026-04-17
updated: 2026-09-22
type: concept
tags:
  - hermes
  - knowledge-base
  - workflow
  - configuration
  - decision
  - automation
  - mcp
sources:
  - raw/articles/openai-codex-best-practices-2026-04-17.md
  - concepts/hermes-memory-skills-wiki-boundaries.md
  - docs:hermes-agent/user-guide/features/memory
  - docs:hermes-agent/user-guide/features/skills
  - docs:hermes-agent/user-guide/features/cron
  - docs:hermes-agent/user-guide/features/mcp
status: stable
description: 以内容归属、执行方法、触发方式、外部能力和运行状态五个可组合维度判断 Hermes 层间路由。
aliases:
  - layer-routing-checklist
---

# Hermes Layer Routing Decision Checklist

## Summary
这页把 `[hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)` 再往前推进一层，变成可执行的路由判定清单。它不是要求在 `wiki`、`memory`、`skill`、`cron` 与 `MCP` 中五选一，而是把需求拆成五个可组合维度：内容归属、执行方法、触发方式、外部能力和运行状态。`memory`、`skills`、`cron`、`MCP` 的角色以目标 Hermes 版本的官方文档和实际工具列表为准；`wiki` 是这套知识库架构里的本地长期知识层，不是 Hermes 官方内置 primitive。

## Official baseline first
本页引用的 Hermes 文档把这些角色区分为：

- `memory`：受预算约束的持久记忆层，用于短小偏好、环境事实和长期约束
- `skills`：按需加载的程序化知识与方法文档
- `cron`：为稳定重复任务提供定时触发
- `MCP`：连接外部工具服务器与动态能力
- `wiki`：不是 Hermes 官方原生特性；它是当前这套本地知识库架构中的正式知识资产层

这些是路由角色，不证明目标部署当前已启用、支持或授权对应能力。执行前应核对目标版本的官方文档与实际工具列表；讨论 `wiki` 时则遵守本仓库规则。

## One-screen routing rule
对同一需求分别回答五个问题，不在第一个“是”处停止：

1. **内容归属**：公开且长期可复用的正式知识进 `wiki`；短小稳定且适合默认保留的事实进 `memory`；项目局部内容进项目文档或状态；临时、私有或一次性内容留在 session、项目记录或 Git 历史。
2. **执行方法**：重复、已验证的方法可形成 `skill`；一次性操作不必为了留痕而 skill 化。
3. **触发方式**：默认人工或按需触发；只有方法稳定、失败边界清楚且目标部署确认支持并授权时，才考虑 `cron`。
4. **外部能力**：需要动态外部数据或操作时，先确认已有且获准的连接方式；只有目标部署实际支持且适配时才选择 `MCP`。
5. **运行状态**：当前结果、队列、故障和执行进度从 live system、project state 或 logs 读取，不写成 Wiki 当前事实。

一个场景可以同时得到 `wiki + skill + cron + MCP`，但每层只承载自己的部分；组合不等于复制同一内容。

## Guardrails kept in the quick path

本页不再重复维护 memory、skill、wiki 的完整正反例；内容归属以 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 为准。快速判断时仍保留以下会改变行动的边界：

- **内容归属**：私有、项目局部、一次性或运行中状态不因流程重要而进入公共 Wiki；公共准入以 `SCHEMA.md` 为准。
- **执行方法**：只有可重复、已验证且需要步骤与验收的方法才形成 `skill`；一次性指令保持一次性。
- **触发方式**：`cron` 只决定何时启动。方法、输入输出和失败处理先稳定；本页引用的文档把 job 描述为 fresh-session 运行，prompt 自包含或配合 attached skill，实际启用前仍需按目标版本核对并取得授权。
- **外部能力**：`MCP` 只解决外部动态数据或动作接入。先确认已有获准工具是否足够；本页引用的文档提到 stdio / HTTP 与 per-server filtering，实际传输、过滤和权限以目标版本为准，并保持最小暴露面。
- **运行状态**：当前结果、故障和进度始终从 live system、project state 或 logs 读取，不从 Wiki 推断。

本页引用的 Hermes 文档为 memory、skills、cron 与 MCP 的角色提供来源，但不证明目标部署已启用或授权这些能力。

## Anti-confusion rules
### memory vs wiki
- 短小稳定事实 → `memory`
- 长期查阅知识 → `wiki`
- 如果需要多段结构、来源、链接、持续扩写，通常就不该进 `memory`

### skill vs wiki
- 回答“怎么做” → `skill`
- 回答“这是什么 / 为什么这样分层” → `wiki`

### skill vs cron
- 定义方法 → `skill`
- 定义什么时候自动跑 → `cron`

### MCP vs wiki
- 外部实时能力 → `MCP`
- 整理后的稳定知识 → `wiki`

### MCP vs skill
- 接工具能力 → `MCP`
- 用这能力怎么稳定做一类事 → `skill`

## Synthetic examples
以下只演示职责组合，不表示某个连接器、任务或调度已经部署或获批。

### 例 1：周期性检查外部 CI 并形成摘要
- **内容归属**：通用且适合公开的判定原则可进 `wiki`；目标仓库配置和收件人留在项目或私有配置
- **执行方法**：重复且验证过的检查步骤可进 `skill`
- **触发方式**：先人工或按需运行；目标版本支持、风险可控且另有授权时才使用 `cron`
- **外部能力**：按实际部署选择已获准的工具；需要且已核验时才可能是 `MCP`
- **运行状态**：每次 CI 结果留在 CI、project state 或运行日志，不写成 Wiki 当前事实

### 例 2：一次私有故障暴露出通用恢复原则
- **内容归属**：私有日志、会话和 closeout 留在原载体；只有去标识化、适合公开且长期可复用的原则才编译进对应 Wiki 正式页
- **执行方法**：若恢复步骤重复验证后稳定，可另行形成 `skill`
- **触发与外部能力**：没有独立需求就保持为空，不为凑齐层次而增加 `cron` 或 `MCP`
- **运行状态**：故障是否仍存在必须实时核验

### 例 3：整理一篇公开 agent 架构文章
- **内容归属**：有长期价值的来源与综合结论可进入 `wiki`
- **执行方法**：只有文章整理流程确实重复且已验证时才需要 `skill`
- **其余维度**：没有定时、外部动态操作或运行状态需求时，不需要 `cron`、`MCP` 或状态页

## Relations
- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)

## Related
- [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`

