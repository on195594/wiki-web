---
title: OKF Concepts for Hermes Wiki Governance Assessment
created: 2026-06-18
updated: 2026-09-20
type: query
tags:
  - hermes
  - knowledge-base
  - governance
  - context-engineering
sources:
  - raw/articles/google-cloud-okf-knowledge-catalog-2026-08-26.md
  - docs:https://www.marktechpost.com/2026/06/16/google-cloud-introduces-open-knowledge-format-okf-a-vendor-neutral-markdown-spec-for-giving-ai-agents-curated-context/
  - docs:hermes-llm-wiki
  - docs:hermes-skills
  - docs:hermes-memory
status: stable
description: 评估 OKF/LLM-wiki 思路如何作为 Hermes wiki 的机器可读治理增强，而不是替代现有 wiki 架构。
aliases:
  - okf
  - open-knowledge-format
  - knowledge-object
  - llm-wiki
---

# OKF Concepts for Hermes Wiki Governance Assessment

## Summary
OKF 对 Hermes wiki 有用，但只应作为机器可读治理增强参考，不应替代由部署者配置的 `$WIKI_ROOT` 三层结构。优先采用可选 `description`、保守 `aliases`、可读 `## Relations` 和只读 validator；示例不表示已迁移、已启用图数据库或已修改 active skill/runtime/memory。

## Decision
采纳“知识对象增强”而不是“迁移到 OKF”：

- Hermes wiki 的 canonical 架构仍是 [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture) 定义的 raw / compiled wiki / schema 分层。
- OKF 只提供设计参考：Markdown 文件、YAML metadata、文件链接图谱、Agent 可消费上下文。
- 本地命名采用“知识对象增强”或“Agent-readable knowledge object convention”，不把 OKF 作为本地规范名。

## Adopt now

### Optional `description`
用于 Agent 路由和页面预览，适合新页面和高价值治理页。

边界：不能替代 `## Summary`，也不能作为事实来源。

### Conservative `aliases`
仅用于明显同义词和高频缩写，例如 `OKF` / `Open Knowledge Format`。

边界：不能替代 canonical 文件名、tag taxonomy 或 index 导航。

### `## Relations`
用于表达页面之间的语义关系：

```markdown
## Relations

- refines: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- depends_on: [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)
- conflicts_with: []
- supersedes: []
```

边界：`Relations` 是推理/维护关系；证据仍写入 `sources`。

### Read-only validation first
先扩展只读健康检查，再决定是否把新约定变成强规则。

首批检查重点：
- `Relations` 中的 wikilinks 是否可解析；
- `description` 是否短且具体；
- `aliases` 是否与 tags 或文件命名冲突；
- context pack 引用是否存在；
- `sources` 是否可复验。

## 企业规模化实现证据：Google Cloud Knowledge Catalog

Google Cloud 的官方实现说明表明，OKF bundle 可以在不改变其 Markdown/YAML 交付形态的前提下映射到企业 Catalog，但这是供应商特定的规模化方案，不改变 Hermes 当前的本地架构裁决。

### 来源中的实现事实

- **对象映射**：EntryGroup 承载一个 bundle；`okf-bundle` EntryType 表示概念；`overview` Aspect 保存 Markdown 正文；`okf` Aspect 保存来源、验证、状态、失效时间、运行时与证明等 13 类结构化信号。
- **三级检索**：`searchEntries` 先找候选；`LookupContext` 每次最多读取 10 个条目并用 `context_budget` 限制格式化上下文；需要完整结构化信号时再调用 `entries.get(view=ALL)`。
- **权限分离**：读取 Agent 使用 `roles/dataplex.catalogViewer`；发布身份使用 `roles/dataplex.catalogEditor`；EntryGroup IAM 向条目继承。
- **生命周期**：`kcmd push` 是幂等 upsert，但每次重写全部条目；概念删除需要显式 `kcmd delete`，整个 bundle 可删除 EntryGroup，而共享 EntryType/AspectType 保留。
- **检索边界**：数组字段的子字段不能直接做服务端谓词过滤；时间谓词不能使用完整 RFC3339 时间戳；`LookupContext` 不会沿正文链接自动遍历，而且一次调用只解析同一 Region 的条目。

### 对 Hermes 的边界化含义

- 这篇文章补充的是“当 bundle 数量、身份边界和跨项目发现成为真实问题时，Catalog 如何承载”的实现证据，不是本地接入 Google Cloud 的授权。
- `[推论]` 如果未来出现多个团队分别拥有知识包、Agent 需要跨项目搜索、不同读取身份必须看到不同条目，才值得把 Catalog 作为项目级候选，并先比较本地 Markdown 检索、权限和运维成本。
- `[推论]` 可复用的本地原则只有三点：候选搜索与正文/证明读取分层、读写身份分离、删除与退役显式化；这些原则继续由现有 Wiki/检索/生命周期 owner 承载，不创建新 Skill、MCP 或运行时服务。

## Defer or reject

### Defer `resource`
暂不默认新增 `resource` 字段。当前页面身份已经由相对路径承担，证据由 `sources` 承担。只有在 validator 和检索层证明具体价值后，再考虑兼容映射。

### Defer full `aliases` rollout
不批量补旧页面。只在新页面或高频页面使用。

### Reject full migration
不把 85+ 现有页面一次性迁移到 OKF 风格；这会制造大量无意义 diff、审计噪声和回滚压力。

### Reject default external graph/runtime dependencies
默认不引入图数据库、外部向量库或专有 catalog。Google Cloud 的实现说明证明了企业 Catalog 是可行的规模化选项，但没有证明当前 Hermes 存在该规模问题；只有真实的跨团队发现、权限隔离或数据共置需求出现后，才按项目级方案另行比较和授权。

## Pilot scope

首批只试点 5 个治理核心页：

1. [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
2. [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
3. [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)
4. [hermes-wiki-lint-and-health-check-standards](/concepts/hermes-wiki-lint-and-health-check-standards)
5. [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)

试点只允许小步更新：补 `description` / 少量 `aliases` / `## Relations`。每次修改后运行健康检查并更新 `log`。

## Governance risks

### Naming drift
不要并行使用 OKF、LLM-wiki、Knowledge Object、Hermes object 多套名字。对外统一称为“知识对象增强”。

### Source vs inference mixing
`sources` 表示证据来源；`Relations` 表示页面关系。不能把推断关系当成事实来源。

### Active-layer bleed
该方案只属于 wiki/schema/validator 层。不得因此修改 memory、active skills、cron、MCP、runtime、wrapper 或 gateway。

### Migration pressure
不承诺自动补齐旧页。只有页面被真实任务触达，才增量补充可选 metadata。

## Relations

- refines: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- depends_on: [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)
- depends_on: [hermes-wiki-lint-and-health-check-standards](/concepts/hermes-wiki-lint-and-health-check-standards)
- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)

## Related
- [agent-context-engineering](/concepts/agent-context-engineering)
- [progressive-knowledge-system-growth](/concepts/progressive-knowledge-system-growth)
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)
- [hermes-wiki-lint-and-health-check-standards](/concepts/hermes-wiki-lint-and-health-check-standards)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [index](/)
- `log`

