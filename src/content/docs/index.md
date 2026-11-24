---
title: Wiki Index
created: 2026-04-16
updated: 2026-11-24
type: meta
status: current
---

# Wiki Index

> 可跨用户、跨项目复用的公开知识目录。
> 这里记录正式知识页面，不记录个人运行状态、私有会话或任务台账。
> 使用知识前按 [AI Agent Retrieval Priority and Answer Path](/concepts/hermes-retrieval-priority-and-answer-path) 执行 Freshness Gate；摄取分类见 [Wiki Ingestion Workflow](/concepts/wiki-ingestion-workflow)。
> Last updated: 2026-11-24

## 按任务进入

人类与 AI Agent 共用以下正文和证据。按需要选择入口，无需通读目录。

| 现在要做什么 | 入口 |
|---|---|
| 理解知识库如何分层 | [共享知识架构](/concepts/hermes-knowledge-architecture) |
| 找概念、方法或决策 | [完整主题目录](https://github.com/on195594/wiki/blob/main/_meta/topic-index.md)；先读页面 Summary，再按需要追来源 |
| 判断知识是否仍适用 | [检索与新鲜度规则](/concepts/hermes-retrieval-priority-and-answer-path) |
| 判断内容与证据是否可入库 | [Wiki Schema](/schema)：准入、主维护位置、证据范围与历史保留 |
| 新增或更新知识 | [入库流程](/concepts/wiki-ingestion-workflow) · [写作规范](/concepts/hermes-wiki-page-writing-standards) |
| 检查链接、来源与结构 | [健康检查操作指南](https://github.com/on195594/wiki/blob/main/_meta/wiki-health-check-runbook.md) |
| 接入 AI Agent | [Agent 按需检索入口](/operations/agent-shared-wiki-index) |
| 组织 AI 编程任务 | [工作流入口选择](/concepts/ai-coding-agent-workflow-types) · [类型边界与验证](/queries/how-i-should-use-hermes-for-ai-coding-with-typed-boundaries) |
| 评估 Agent 架构方案 | [编排取舍](/concepts/agent-orchestration-production-tradeoffs) · [评测框架](/concepts/production-ai-agent-evaluation-framework) |
| 优化 Agent 成本、缓存与模型路由 | [资源优化与路由](/concepts/agent-resource-optimization) · [生产延迟与成本基线](/concepts/production-agent-evaluation-baselines) |
| 设计与评测 Agent 记忆与经验固化 | [经验固化闭环](/concepts/agent-experience-consolidation-loops) · [记忆架构与评测基准对照](/comparisons/agent-memory-architectures-and-evaluation-benchmarks) |
| 评估 Agent 安全与防提示注入边界 | [安全架构与提示注入防御](/concepts/agent-security-architecture-and-prompt-injection-defense) · [执行沙箱与浏览器隔离](/concepts/agent-execution-sandboxing-and-browser-isolation) · [Skill Provider 治理边界](/concepts/agent-skill-provider-governance-boundary) |
| 查工具配置与能力边界 | [Claude Code 工作流](/concepts/claude-code-practical-workflow-tips) · [Codex 工作流分层](/concepts/codex-agent-workflow-layering)；具体命令先核对页面的局部证据与官方文档 |
| 排查生产事故 | [SRE 事故响应模式](/concepts/google-sre-gemini-cli-incident-response)：方法参考，执行仍以目标项目 runbook 为准 |
| 构建投资风控与评估企业基本面 | [投资风险控制框架](/concepts/investment-risk-control-framework) · [普通人长期投资系统](/concepts/ordinary-investor-investment-system) · [公司基本面分析决策地图](/queries/company-analysis-decision-map) |
| 规划个人成长、职业跃迁、家庭教育与资金协同（LifeOS） | [LifeOS 总览](/concepts/lifeos-overview) · [工作与职业模型](/concepts/work-and-career-operating-model) · [家庭教育模型](/concepts/family-education-operating-model) · [个人成长模型](/concepts/personal-growth-operating-model) |
| 查看治理与变更 | [Schema](/schema) · [变更日志](https://github.com/on195594/wiki/blob/main/log.md) |

历史 `hermes-*` 文件路径保留以兼容引用；标题和摘要定义当前通用知识范围。Hermes 产品评估与历史决策仍保留产品名，不能当作所有 Agent 的能力声明。

## 浏览主题目录

[产品与工具](https://github.com/on195594/wiki/blob/main/_meta/topic-index.md#entities) · [概念与方法](https://github.com/on195594/wiki/blob/main/_meta/topic-index.md#concepts) · [维护与接入](https://github.com/on195594/wiki/blob/main/_meta/topic-index.md#operations) · [对比分析](https://github.com/on195594/wiki/blob/main/_meta/topic-index.md#comparisons) · [问题与决策](https://github.com/on195594/wiki/blob/main/_meta/topic-index.md#queries)

完整页面清单与摘要集中在[主题目录](https://github.com/on195594/wiki/blob/main/_meta/topic-index.md)维护；新增或更新页面时同步对应条目，任务入口变化时再更新本页。Agent 可先筛选 `_meta/catalog.json`，再读取少量正文。

