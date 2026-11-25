---
title: OKF Concepts for AI Agent Wiki Governance Assessment
created: 2026-06-18
updated: 2026-11-25
type: query
tags:
  - agent
  - knowledge-base
  - governance
  - context-engineering
sources:
  - raw/articles/google-cloud-okf-knowledge-catalog-2026-08-26.md
  - docs:https://github.com/open-knowledge-format/open-knowledge-format
  - docs:https://cloud.google.com/blog/products/data-analytics/introducing-okf-v0-3
  - docs:https://okf.md/spec/
  - docs:https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/main/SPEC.md
  - docs:https://www.marktechpost.com/2026/06/16/google-cloud-introduces-open-knowledge-format-okf-a-vendor-neutral-markdown-spec-for-giving-ai-agents-curated-context/
  - repository:SCHEMA.md
  - repository:_meta/scripts/wiki_catalog.py
  - repository:_meta/scripts/wiki_maintain.py
  - concepts/hermes-memory-skills-wiki-boundaries.md
status: stable
description: 评估 OKF/LLM-wiki 思路如何作为 AI Agent wiki 的机器可读治理增强，而不是替代现有 wiki 架构。
aliases:
  - okf
  - open-knowledge-format
  - knowledge-object
  - llm-wiki
  - okf-for-agent-wiki-governance-assessment
volatility: low
---

# OKF Concepts for AI Agent Wiki Governance Assessment

## Summary
OKF 对 AI Agent wiki 有用，但只应作为机器可读治理增强参考，不应替代由部署者配置的 `$WIKI_ROOT` 三层结构。优先采用可选 `description`、保守 `aliases`、可读 `## Relations` 和只读 validator；示例不表示已迁移、已启用图数据库或已修改 active skill/runtime/memory。

## Decision
采纳“知识对象增强”而不是“迁移到 OKF”：

- AI Agent wiki 的 canonical 架构仍是 [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture) 定义的 raw / compiled wiki / schema 分层。
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

- refines: [[hermes-knowledge-architecture]]
- depends_on: [[hermes-wiki-page-writing-standards]]
- related: [[agent-shared-wiki-index]]
```

边界：`Relations` 是推理/维护关系；证据仍写入 `sources`。

### Machine-readable `_meta/catalog.json`

本仓库已使用 `_meta/catalog.json` 汇总正式页的受支持 metadata 与显式 `Relations`，供 Agent 先筛选候选页，再按需读取正文。清单由 `_meta/scripts/wiki_catalog.py` 生成，保留 `okf-bundle-catalog` / `0.2` 这一历史本地格式标识；它不是 OKF 官方定义的 catalog 交换格式，也不表示符合全部 OKF v0.2 规范。对接方须按本地脚本契约读取，不能仅凭名称推定兼容。

同步清单前审查 raw 新增、删除及其授权，操作与验证步骤集中在 [Safe metadata synchronization](https://github.com/on195594/wiki/blob/main/_meta/wiki-health-check-runbook.md#safe-metadata-synchronization)。catalog 不收录 `sources` 或普通出链，不能替代页面来源、核验记录或完整知识图谱；具体字段以 `repository:_meta/scripts/wiki_catalog.py` 为准。

### Field mapping instead of look-alike fields

本地字段与 OKF（v0.2 / v0.3）的对照只在 [SCHEMA](/schema) 的 "Local fields vs OKF (v0.2 / v0.3)" 表中唯一维护。此前 SCHEMA 定义过一个自称参考 OKF 的 `attestation{generated_by, verified_by}`，但其形状与 OKF 原生 `generated{by, at}` / `verified[]{by, at}` 不同，且没有页面或脚本使用，已于 2026-10-17 删除。需要区分生成与核验职责时直接采用 OKF 原生字段；字段本身不证明事实正确，也不能用结构门禁通过代替事实核验。

### OKF v0.3 演进与本地治理吸收（2026-11）

2026-11-19 发布的 [OKF v0.3](https://cloud.google.com/blog/products/data-analytics/introducing-okf-v0-3)（规范已迁至独立跨组织仓库 [open-knowledge-format/open-knowledge-format](https://github.com/open-knowledge-format/open-knowledge-format)，参见 [OKF 注释规范](https://okf.md/spec/)）保持“`type` 为概念唯一必填字段”的极简互操作面，同时明确了若干对本知识库有直接参考价值的治理边界：

- **YAML 1.2 严格可解析与非概念文件共存**：v0.3 要求所有 frontmatter 块符合 YAML 1.2 映射规则，无 `type` 的文档（如 `SCHEMA.md`、`README.md`）由消费者自动跳过共存。本地约定适用于正式页，不追溯历史 `raw/` 快照。正式页中含 `?` 查询参数或 `#` 锚点的 `sources` 采用多行 YAML 块序列、标题避免外层双引号包裹，保证标准 YAML 1.2 解析器与本地脚本输出一致。
- **当前核验事件（Current-only verification）**：缺省 `generated` 时，所有有效核验事件均计入当前信任层级；有 `generated` 时，仅计入 `verified[].at >= generated.at` 的事件。实质内容变更推进 `generated.at` 后，早于它的签字仅作历史记录；排版或链接修复不推进该时间。只有当前有效的 `human:` 核验能赋予 `human-reviewed`，`team:` 核验不能。本库不计算这一层级：普通编辑只改 `updated`，局部核验用 `[!volatile]` 或正文说明，不刷新整页 `verified_at`。
- **根 `index.md` 自描述、退役转发与 `x-` 扩展空间**：v0.3 允许根 `index.md` 携带路由 `description` 等元数据（本库已在根 `index.md` 采用一句话路由 `description`，但不声明 `okf_version` 以免混淆 wikilink 语法），新增 `superseded_by` 正向退役指针（对应本库现行页 `## Relations` 的 `supersedes` 反向入边查询），并将类型化关系（typed relationships）与有效期窗口（validity windows）明确列为延后特性、推荐实验字段使用 `x-<producer>-<name>` 前缀——印证本库以 `## Relations` 与 `review_by` 作为本地增强而非伪装成上游核心字段的合理性。
- **生成与消费技能职责分离（`okf-generate` vs `okf-consume`）**：上游仓库随 v0.3 提供两个开放 Agent Skills——生成端逐断言引源且仅在本人确认时记录 `human:`，消费端逐概念报告信任层级、新鲜度与状态。在本库中，这两项职责已分别由 [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)（摄取引源与门禁）和 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)（Freshness Gate 消费门禁）承载，无需额外部署上游 BigQuery 参考代理或同名 Skill。

### Read-only validation first
先扩展只读健康检查，再决定是否把新约定变成强规则。

首批检查重点：
- `Relations` 中的受控关系键与 wikilinks 是否可解析；
- `description` 是否短且具体；
- `aliases` 是否与 tags 或文件命名冲突；
- `_meta/catalog.json` 是否与正式页 metadata 及 `Relations` 保持同步；
- `sources` 是否可复验。

## 企业规模化实现证据：Google Cloud Knowledge Catalog

Google Cloud 的官方实现说明 [google-cloud-okf-knowledge-catalog-2026-08-26](https://github.com/on195594/wiki/blob/de741c89ebb2d63e691256a55ca32adf5294db1a/raw/articles/google-cloud-okf-knowledge-catalog-2026-08-26.md) 表明，OKF bundle 可以在不改变其 Markdown/YAML 交付形态的前提下映射到企业 Catalog，但这是供应商特定的规模化方案，不改变 AI Agent 当前的本地架构裁决。

### 来源中的实现事实

- **对象映射**：EntryGroup 承载一个 bundle；`okf-bundle` EntryType 表示概念；`overview` Aspect 保存 Markdown 正文；`okf` Aspect 保存来源、验证、状态、失效时间、运行时与证明等 13 类结构化信号。
- **三级检索**：`searchEntries` 先找候选；`LookupContext` 每次最多读取 10 个条目并用 `context_budget` 限制格式化上下文；需要完整结构化信号时再调用 `entries.get(view=ALL)`。
- **权限分离**：读取 Agent 使用 `roles/dataplex.catalogViewer`；发布身份使用 `roles/dataplex.catalogEditor`；EntryGroup IAM 向条目继承。
- **生命周期**：`kcmd push` 是幂等 upsert，但每次重写全部条目；概念删除需要显式 `kcmd delete`，整个 bundle 可删除 EntryGroup，而共享 EntryType/AspectType 保留。
- **检索边界**：数组字段的子字段不能直接做服务端谓词过滤；时间谓词不能使用完整 RFC3339 时间戳；`LookupContext` 不会沿正文链接自动遍历，而且一次调用只解析同一 Region 的条目。

### 对 AI Agent 的边界化含义

- 这篇文章补充的是“当 bundle 数量、身份边界和跨项目发现成为真实问题时，Catalog 如何承载”的实现证据，不是本地接入 Google Cloud 的授权。
- `[推论]` 如果未来出现多个团队分别拥有知识包、Agent 需要跨项目搜索、不同读取身份必须看到不同条目，才值得把 Catalog 作为项目级候选，并先比较本地 Markdown 检索、权限和运维成本。
- `[推论]` 可复用的本地原则只有三点：候选搜索与正文/证明读取分层、读写身份分离、删除与退役显式化；这些原则继续由现有 Wiki/检索/生命周期 owner 承载，不创建新 Skill、MCP 或运行时服务。

## Scoped verification note

- **2026-11-06（v0.2 核对）**：Codex AI 审查 Agent（底层模型版本未记录，非人类复核）对照 [OKF SPEC v0.2](https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/main/SPEC.md) 的 §4–5 与本仓库 `SCHEMA.md` 对照表、`wiki_catalog.py`，核对了字段兼容范围：本地 `sources` 是字符串列表，`verified_at` 只有日期，正文关系使用 wikilinks；这些不能直接当作 OKF 原生来源对象、核验身份与标准 Markdown 链接。
- **2026-11-25（v0.3 演进与全库一致性复核）**：AI 审查 Agent 在线核对 Google Cloud 官方发布说明 [Introducing OKF v0.3](https://cloud.google.com/blog/products/data-analytics/introducing-okf-v0-3)（2026-11-19）、[OKF 注释规范 v0.3](https://okf.md/spec/)（2026-11-18）及迁移后的独立组织仓库 [open-knowledge-format/open-knowledge-format](https://github.com/open-knowledge-format/open-knowledge-format)（确认旧仓 `GoogleCloudPlatform/open-knowledge-format` 已标为 deprecated），同步 `SCHEMA.md` 的 v0.2/v0.3 对照表并核验全库 138 篇正式页的 YAML 1.2 可解析性与 `_meta/catalog.json` 同步状态。

以上两次均为针对规范文本与本地治理脚本的范围化复核，不重验上文企业 Catalog 的产品接口、不作原生 OKF 全 bundle 合规认证，也不补写整页 `verified_at`。`closed` 表示完成或被替代的本地生命周期，导出时须读实际语义，不能统一映射为 `deprecated` 或自动填写 `superseded_by`。

## Defer or reject

### Defer `resource`
暂不默认新增 `resource` 字段。当前页面身份已经由相对路径承担，证据由 `sources` 承担。只有在 validator 和检索层证明具体价值后，再考虑兼容映射。

### Defer full `aliases` rollout
不批量补旧页面。只在新页面或高频页面使用。

### Reject full migration
不为格式统一而将现有页面一次性迁移到 OKF 风格；这会制造大量无意义 diff、审计噪声和回滚压力。

### Export only for an actual consumer

只有出现明确的外部消费者时才评估窄范围导出：转换 wikilinks、来源与日期字段，并按语义处理生命周期。`closed` 可能表示决策已完成，也可能表示结论被替代，不能一律映射为 OKF `deprecated`；具体对照仍由 [SCHEMA](/schema) 唯一维护。当前未实现导出器，不为潜在兼容需求修改整库正文。

### Reject default external graph/runtime dependencies
默认不引入图数据库、外部向量库或专有 catalog。Google Cloud 的实现说明证明了企业 Catalog 是可行的规模化选项，但没有证明当前 AI Agent 存在该规模问题；只有真实的跨团队发现、权限隔离或数据共置需求出现后，才按项目级方案另行比较和授权。

## Pilot scope and current rollout status

知识对象增强最早在首批 5 个治理核心页完成试点（[Human and AI Agent Shared Knowledge Architecture](/concepts/hermes-knowledge-architecture)、[Wiki Ingestion Workflow](/concepts/wiki-ingestion-workflow)、[Wiki Page Writing Standards](/concepts/hermes-wiki-page-writing-standards)、[Wiki Lint and Health Check Standards](/concepts/hermes-wiki-lint-and-health-check-standards)、[AI Agent Memory Skills Wiki Boundaries](/concepts/hermes-memory-skills-wiki-boundaries)）。经日常任务触达下的渐进维护，截至 2026-11-25，`_meta/catalog.json` 收录的全部 **138 篇正式页**已覆盖一句话 `description`、受控 `aliases`、`volatility` 与仅指向正式页的 `## Relations`。

后续维护继续遵循按需最小补丁原则：新建或触达页面时保持 YAML 1.2 兼容写法、简洁路由 `description` 与正式页关系边界，不为追求原生 OKF 字段外观而启动破坏性格式迁移。每次修改后同步 catalog、运行门禁并更新 `log`；结构元数据齐备不代表页面事实已获全面核验。

## Governance risks

### Naming drift
不要并行使用 OKF、LLM-wiki、Knowledge Object、AI Agent object 多套名字。对外统一称为“知识对象增强”。

### Source vs inference mixing
`sources` 表示证据来源；`Relations` 表示页面关系。不能把推断关系当成事实来源。

### Active-layer bleed
该方案只属于 wiki/schema/validator 层。不得因此修改 memory、active skills、cron、MCP、runtime、wrapper 或 gateway。

### Migration pressure
不承诺自动补齐旧页。只有页面被真实任务触达，才增量补充可选 metadata。

## Relations

- refines: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- depends_on: [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow), [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards), [hermes-wiki-lint-and-health-check-standards](/concepts/hermes-wiki-lint-and-health-check-standards), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- related: [agent-shared-wiki-index](/operations/agent-shared-wiki-index), [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence), [agent-context-engineering](/concepts/agent-context-engineering), [progressive-knowledge-system-growth](/concepts/progressive-knowledge-system-growth)

