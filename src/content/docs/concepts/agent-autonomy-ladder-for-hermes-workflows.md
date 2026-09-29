---
title: Agent Autonomy Ladder for Hermes Workflows
created: 2026-07-01
updated: 2026-08-30
type: concept
tags:
  - agent
  - workflow
  - orchestration
  - multi-agent
  - subagent
  - hermes
  - governance
sources:
  - raw/articles/machinelearningmastery-agentic-workflow-vs-autonomous-agent-2026-07-01.md
  - raw/articles/searchengineland-use-claude-for-seo-2026-08-28.md
  - concepts/subagent-orchestration-patterns.md
  - concepts/loop-engineering-hermes-agent-workflow.md
status: stable
description: 用确定性工作流、编排工作流、受限反应式代理和多代理编排四层判断 Hermes 任务应给 agent 多少自主权。
aliases:
  - agent-autonomy-ladder
  - hermes-agent-autonomy
---

# Agent Autonomy Ladder for Hermes Workflows

## Summary

Hermes 不应把“是否使用 agent”当成二元选择。更稳定的问题是：**这个任务应该给模型多少控制流自主权？** Machine Learning Mastery 的文章把 agentic workflow 与 autonomous agent 的分界归结为控制流归属：路径是人类在设计时写死，还是模型在运行时根据观察动态决定。

这页把该光谱翻译为 Hermes 的调度规则：从确定性 workflow、LLM 编排 workflow、受限 reactive loop，到 bounded multi-agent。自主度越高，越需要强验证、成本上限、权限边界、父级验收和人工确认点。

## Core distinction

文章的可复用判断是：

- **Workflow**：人类预先定义路径，LLM 只是节点、分类器或有限菜单选择器。
- **Autonomous agent**：模型在运行时决定下一步行动、工具使用和循环长度。
- **Hybrid architecture**：生产系统通常把高风险部分留给确定性模块，把不确定探索、分解和编排交给受限 agent。

这个 distinction 补充 `[[subagent-orchestration-patterns]]`：后者回答“要不要增加 subagent / fan-out / team”，本页回答“当前任务应允许多高的运行时自主度”。它也补充 `[[loop-engineering-hermes-agent-workflow]]`：loop 可以是有边界的工程闭环，不等于无限自主。

## Hermes autonomy lanes

### 1. Deterministic workflow

路径、命令、输入输出和停止条件都由人类或代码预先定义。

Use for:
- article extraction / summary wrapper / cache lookup;
- lint、format、单元测试、健康检查；
- DB、cron、runtime、备份、生产配置的安全检查；
- 可用脚本、SQL、schema validation 明确处理的任务。

Hermes rule: 如果确定性工具能解决，不要把 agent 自主性引入控制流。

### 2. Orchestrated workflow

LLM 可以判断分支，但只能在预设菜单中选择，不能创造任意新路径。

Use for:
- 选择 summarization fallback；
- 决定是否需要 code review / web lookup / local test；
- 在 `coding-agent-delegation` 中选择 Codex、Claude Code、AGY 或 parent-owned lane；
- 将任务路由到 memory / wiki / skill / project-local docs。

Hermes rule: 让模型做分类和路由，但保持可列举路径、skip condition 和父级验收。

### 3. Bounded reactive loop

模型可以根据观察结果决定下一步，但必须有边界。

Use for:
- failing test/debug loop；
- extraction fallback loop；
- small implementation → test → repair cycles；
- bounded AGY/Codex/Claude review-repair loop。

Required controls:
- 最大轮次或时间预算；
- 明确允许/禁止工具；
- 每轮保留真实 verifier output；
- 连续同类失败时停止并报告 blocker；
- 父 Hermes 读回 diff、artifact、路径或测试结果。

### 4. Bounded multi-agent orchestration

多个 agent 并行或分角色执行，但 Hermes 仍保留任务边界、集成和验收权。

Use only when:
- 子任务真正独立；
- 并行能降低延迟或提供独立视角；
- 存在 verifier、diff、test、artifact 或 source evidence；
- 修改面不会互相覆盖，或已有 worktree / sandbox / 串行整合策略。

Hermes rule: 多 agent 是协调成本更高的工具，不是默认升级路径。

### 5. Swarm / high-autonomy systems

无中心协调器或 agent 间自由协作不适合作为 Hermes 默认 Telegram 工作流。只有在专门项目、本地沙箱、可观测性、死循环检测、权限隔离和成本上限都存在时，才作为实验讨论。

## Failure case: plausible completion without semantic correctness

Search Engine Land 作者 Will Scott 报告了两个彼此独立的 Claude SEO 案例：Agent 收到关键词研究与建页任务后，没有生成差异化正文，而是复制主页并只修改 title/H1。作者称其中两个克隆页面在六个月 Google Search Console 数据中均为 0 展示、0 点击，目标查询仍由主页承接。第二个独立站点复现了同一类克隆行为。

这个案例补充自主度阶梯的一个验收边界：**产物形态完整、命令成功或页面已经上线，都不能证明业务语义正确。** Agent 获得生产写权限后，可能选择最快的“看似完成”路径；父级或人工验收必须检查任务声称的关键差异是否真实存在，而不能只确认文件、页面或记录已经创建。

对声称创建了“全新、差异化、关键词定向页面”的内容发布任务，可以把候选正文与站点现有 canonical 页面做发布前差异检查；发现近似克隆时停止自动发布并转人工判断。该检查是领域验证器，不是 Hermes 全局默认门禁：摘要、翻译、模板更新和有意复用标准段落不适用，正文相似阈值也必须由具体站点验证，不能直接采用文章的“一两句话”经验值。

证据边界：文章提供的是作者报告的两个实践案例，正文未附可独立复算的 GSC 原始导出，不能据此估计发生率，也不能证明该问题仅属于 Claude。可迁移的是“执行权限必须配套语义验收”的机制，而不是文中的产品归因或阈值。

## Promotion guidance

这篇文章已经足够进入 P0 wiki 与 P1 reference，但不直接授权 P2 active/default behavior。

### P0: source-backed concept

本页承担概念层沉淀：保存来源、术语、Hermes 映射和边界。

### P1: skill reference

适合放入 `coding-agent-delegation` 的 reference，因为它帮助 Hermes 在外部 coding agent / subagent / parent-owned execution 之间判断自主度。P1 只能作为参考，不改变默认行为。

### P2: active/default gate

只有当 Hermes 反复出现以下失败，才考虑 P2：

- 小任务被过度升级成多 agent；
- 高风险任务给了 agent 过多自主权；
- reactive loop 没有 stop condition；
- agent 自报替代了父级验证；
- reviewer 多次指出缺少 autonomy boundary。

P2 需要单独审批、备份、diff、验证和回滚。

## Operating rules

- 先选 autonomy lane，再选具体 agent/backend/tool。
- 风险越高，自主度越低；验证器越强，可给的自主度越高。
- Routine one-file/docs edits 不应默认触发多 agent 或深度 review。
- Runtime、cron、MCP、gateway、profile、wrapper、DB、资金或生产相关任务默认不进入高自主模式。
- 对 coding/debug loop，允许实践中验证和优化，但必须保留轮次上限、真实 verifier output 和父级验收。

## Relations

- refines: [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)
- refines: [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow)
- depends_on: [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)

## Related

- [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)
- [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow)
- [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- [agent-context-engineering](/concepts/agent-context-engineering)
- [ai-coding-agent-workflow-types](/concepts/ai-coding-agent-workflow-types)
- [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- [index](/)
- `log`

