---
title: Hermes vs Google SRE Agentic Incident Response
created: 2026-04-16
updated: 2026-04-16
type: comparison
tags:
  - agent
  - mcp
  - workflow
  - tool
  - comparison
sources:
  - concepts/google-sre-gemini-cli-incident-response.md
  - concepts/hermes-knowledge-architecture.md
  - concepts/hermes-knowledge-base-operating-flow.md
status: stable
description: 比较 Hermes 通用 Agent 底座与 Google SRE Gemini CLI 事故响应模式的能力差距。
aliases:
  - hermes-vs-google-sre
---

# Hermes vs Google SRE Agentic Incident Response

## Summary
这个对照页的核心结论是：Google 展示的是一套“面向生产事故”的 agentic incident response copilot，而 Hermes 现在更像一个“通用个人/运维代理框架”。
两者在架构方向上高度相似：都依赖工具调用、MCP 扩展、人类审批和流程编排；但在落地重心上不同——Google 重点优化的是事故缓解链路，Hermes 当前重点优化的是通用执行、知识沉淀与多场景工具协作。

## Comparison at a glance
一句话压缩：
- Google SRE 方案 = 窄场景、强约束、面向 incident mitigation 的生产 copilot
- Hermes 方案 = 广场景、强工具化、面向个人与运维工作的通用 agent shell

## Shared design pattern
两者最像的地方不在“模型名”，而在系统设计：
- 都不是纯聊天机器人
- 都强调工具调用而不是只靠自然语言回答
- 都把 MCP / 外部工具接入视为关键扩展层
- 都需要人类审批或策略约束来处理高风险动作

从架构思想上看，Hermes 并不偏离 Google 展示的方向，反而已经具备很多同类组件。

## Main difference: scope and optimization target
### Google SRE 方案
核心优化目标：
- 缩短 MTTM
- 更快止血
- 降低事故中的认知负担
- 把 postmortem 和 action items 纳入自动化闭环

### Hermes 当前方案
Hermes 的目标更宽，覆盖：文件读写、shell、web/browser、MCP、cron、skills、wiki、memory、delegate_task。
因此它更像通用 agent runtime，而不是专门围绕故障处理设计的单一产品。

对照结论：
- Hermes 更灵活
- 但默认事故处理路径没有 Google 那么窄、那么流程化、那么预编排

## Tooling model
### Google
Gemini CLI 借助 `fetch_playbook` 一类高层函数，直接串起 incident details、时序分析、日志分析、相关性分析，最后输出标准化 mitigation playbook。

特点：
- 高层抽象强
- 工具接口更贴近 incident domain
- 输出直接面向“执行哪个缓解动作”

### Hermes
Hermes 的工具层更通用：`terminal`、`browser`、`web_search/web_extract`、`MCP`、`process`、`cronjob`、文件工具、`delegate_task`。

特点：
- 基础能力广
- 组合自由度高
- incident domain 的高层工具抽象较少

也就是说，Google 给模型的是“更接近 SRE 语言”的工具，Hermes 给模型的是“更接近通用操作系统”的工具。

## Action space design
### Google: closed mitigation set
Google 强调 Generic Mitigations：`drain traffic`、`rollback`、`restart`、`add capacity`。
核心是把生产动作压缩成有限集合，让模型在窄动作空间里选最优动作。

### Hermes: open-ended execution space
Hermes 更接近开放动作空间：可执行 shell、调浏览器、调用任意可接入 MCP，并跨文件、网络、进程、调度器协作。

对照结论：
- Google 更像“先收窄接口，再让模型决策”
- Hermes 更像“先提供足够多的可组合能力，再通过审批和规则兜底”

## Safety and approval model
### Google
Google 的安全模型是事故场景专用的：
- 确定性工具，而不是自由 shell
- 工具风险元数据
- policy enforcement
- human-in-the-loop
- audit trails

### Hermes
Hermes 已具备部分对应机制：
- approval 检测危险命令
- terminal 工具支持危险操作审批
- MCP 与原生工具提供结构化调用入口
- cron / process / todo / skills 支持流程编排
- session / wiki / log 形成结果留痕

差异在于：
- Google 的约束直接贴着 incident 场景设计
- Hermes 的约束更偏“通用危险命令与通用工具治理”

因此 Hermes 当前更像“具备安全底座”，但还不是“专门为 incident playbook 定制的安全系统”。

## MCP and workflow mapping
Google 文中强调 MCP Servers 可接入 Grafana、Prometheus、PagerDuty、Kubernetes。
Hermes 在这部分映射很直接：
- 原生 MCP client 已存在
- 可以把监控、告警、集群、工单系统接成 MCP servers
- 可以围绕 MCP 工具封装高层工作流

如果把 Google 文中的链路映射到 Hermes，大致是：
- incident / alert -> MCP / web / terminal 获取上下文
- metrics / logs -> MCP tools 或 terminal 调监控系统
- mitigation proposal -> skill / quick command / structured tool recommendation
- approval -> Hermes approval pipeline
- execution -> terminal / MCP action tool
- postmortem -> wiki 页面 / query 页面 / send_message / cron follow-up

因此 Hermes 不缺“接系统”的接口，缺的是“围绕 incident 场景预先封装好的 playbook 层”。

## Knowledge and postmortem handling
### Google
postmortem 是事故流程的标准末端，强调无责复盘、行动项和工程闭环。

### Hermes
Hermes 当前在知识沉淀上反而更强：
- wiki 是 canonical 知识层
- raw / concepts / comparisons / queries 已形成结构化知识库
- log 记录写入与变更
- session_search 保留过程回忆
- skills 可以沉淀可复用流程

也就是说：
- Google 更突出“如何在 incident 中行动”
- Hermes 更突出“如何把结果沉淀成长期资产”

这意味着 Hermes 如果往 incident copilot 方向演进，postmortem / write-back 基础设施已经比较占优。

## Where Hermes is already strong
相对 Google 文章里的模式，Hermes 当前已经较强的地方有：
- 通用工具种类更丰富
- 本地文件与知识库沉淀能力更强
- 可以把流程固化为 skills
- 可以通过 cron 和 send_message 做持续跟进
- 可以用 delegate_task 做多代理分工
- 可以同时覆盖研究、运维、知识管理和自动化执行

## Where Hermes is still missing an incident-specific layer
按 Google 文章的标准看，Hermes 还缺几块 incident-specific 封装：
- 预定义的 generic mitigations 集合
- 贴近 incident 语义的高层工具，而不只是基础工具
- 面向事故场景的 policy engine
- 更强的审计视图，把提议、批准、执行串成事故时间线
- 一键生成 postmortem + action items + follow-up 的专用命令

这些不是底层能力缺失，而是产品层、工作流层还没有专门收敛。

## Practical implication for Hermes
对 Hermes 最现实的启发不是“做一个 Gemini CLI 克隆”，而是：

把现有能力按 incident response 视角重新打包。

最合适的方向可能是：
1. 先定义有限的 mitigation classes
2. 为每类动作提供结构化工具或 skill
3. 在 approval 之上叠一层 incident policy
4. 把 metrics / logs / deploy / restart / rollback 接成 MCP servers
5. 增加一个 postmortem / incident summary 专用写回流

这样 Hermes 就能从“通用 agent”继续演进成“可控的 incident copilot”。

## Decision summary
如果只看事故处理场景：
- Google 当前方案更成熟、更窄、更接近生产一线工作流
- Hermes 当前方案更通用、更灵活、更适合二次封装

如果看长期平台潜力：
- Google 展示的是一个强垂直模板
- Hermes 更像一个可向多个垂直场景延伸的 agent substrate

## Takeaway
最关键的结论是：

Hermes 与 Google 这篇文章展示的方向并不冲突，差别主要不在“有没有 agent / MCP / human approval”，而在“是否已经把 incident response 这一垂直场景做成了窄接口、高层 playbook 和专用安全层”。

换句话说：
- Google 已经把 incident copilot 做成产品化工作流
- Hermes 已经有底座，但还需要 incident-specific packaging

## Relations
- depends_on: [google-sre-gemini-cli-incident-response](/concepts/google-sre-gemini-cli-incident-response)
- depends_on: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- depends_on: [hermes-knowledge-base-operating-flow](/concepts/hermes-knowledge-base-operating-flow)

## Related
- [google-sre-gemini-cli-incident-response](/concepts/google-sre-gemini-cli-incident-response)
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [hermes-knowledge-base-operating-flow](/concepts/hermes-knowledge-base-operating-flow)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`

