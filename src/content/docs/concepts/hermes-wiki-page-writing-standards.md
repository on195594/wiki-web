---
title: Hermes Wiki Page Writing Standards
created: 2026-04-16
updated: 2026-09-22
type: concept
tags:
  - hermes
  - knowledge-base
  - workflow
  - configuration
  - note
sources:
  - repository:SCHEMA.md
  - concepts/wiki-ingestion-workflow.md
status: stable
description: 定义 Hermes wiki 正式页面的命名、frontmatter、结构、wikilinks、Relations 和质量检查规则。
aliases:
  - page-writing-standards
  - wiki-writing-standards
---

# Hermes Wiki Page Writing Standards

## Summary
Hermes wiki 页面不是随手笔记，而是正式知识资产。
写作规范的目标是让公共页面脱离作者私有环境仍可读、可链接、可维护、可增量更新，并能被后续回答直接复用。

## Canonical principle
一篇合格页面至少要满足：
- 主题明确
- 结构统一
- frontmatter 完整
- 至少有 2 个有效 wikilinks
- 能持续更新
- 不等于原始资料，也不等于聊天记录

## File naming
- 文件名使用小写英文加连字符
- 不用空格，不用中文文件名
- 文件名应直接表达主题

示例：
- `hermes-knowledge-architecture.md`
- `hermes-memory-skills-wiki-boundaries.md`
- `hermes-retrieval-priority-and-answer-path.md`

## Required frontmatter
每个正式页面必须包含：
```yaml
---
title: Page Title
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: entity | concept | comparison | query | plan | closeout | validation-case | operation | summary
tags: [tag1, tag2]
sources: []
status: draft | stable | active | closed | current
---
```

字段要求：
- `title`：人类可读标题
- `created`：首次创建日期
- `updated`：最近更新时间
- `type`：必须匹配目录职责
- `tags`：只能使用 `SCHEMA.md` 中已定义的标签
- `sources`：来源路径；无来源时可先留空数组
- `status`：只使用 Schema 枚举；历史日期放入 `updated`、`review_by` 或正文

可选机器可读字段：
- `description`：一句话说明页面用途，帮助 Agent 路由和预览；不能替代 `## Summary`
- `aliases`：少量高价值同义词，避免制造新 taxonomy

暂不默认新增 `resource` 字段；页面稳定身份仍是相对路径，证据来源仍写入 `sources`。

## Recommended structure
推荐默认结构：
1. `## Summary`
2. 主体内容（按层次分节）
3. `## Practical checklist` 或 `## Decision rules`（如适用）
4. `## Anti-patterns`（如适用）
5. `## Related`

最少也要有：摘要、主体结构、关联链接。

## Writing style
- 先给结论：开头先写 Summary，第一屏就回答“这页在讲什么”
- 结构先于堆料：先分层，再展开；优先使用小节和列表
- 可扫描：段落短、标题清晰、30 秒内能抓到重点
- 面向复用：页面服务未来回答与维护，而不是只记录一次

## Wikilinks and relations
每个正式页面至少应包含 2 个 `[[wikilinks]]`。
推荐最低配置：
- 1 个指向主题相关页面
- 1 个指向导航页，如 `[[index]]` 或 `[[log]]`

适合链接到：上位概念、相邻概念、被引用的方法页、导航页。

高价值治理页或概念页可增加 `## Relations`，用少量关系词表达页面之间的语义关系：
- `refines`：细化某个上位页面
- `depends_on`：依赖某个前置规范或概念
- `conflicts_with`：与某页存在显式冲突或取舍
- `supersedes`：替代旧页面或旧结论

关系区块用于检索和维护；证据仍写入 `sources`，不要把推断关系伪装成来源。

避免：孤立页面没有关联；链接堆砌但没有语义关系；为旧页面批量补关系导致大规模无意义 diff。

## Directory-specific rules
### `concepts/`
适合：架构、方法论、原理说明、边界规范

写法重点：先定义，再拆结构，再给规则。

### `entities/`
适合：产品、项目、组织、模型、人物

写法重点：它是什么、关键事实、与其他实体/概念的关系。

### `comparisons/`
适合：横向比较、方案对比、决策分析

写法重点：比较对象、比较维度、结论与取舍。

### `queries/`
适合：值得长期保存的问题与答案

写法重点：问题本身、结构化回答、为什么值得保存。

## What NOT to write
以下内容不应直接成为正式 wiki 页面：
- 原样复制聊天记录
- 没有整理的 raw 资料
- 一次性临时状态
- 没有长期价值的碎片信息
- 只有命令没有上下文的执行日志

## Update rules
更新页面时遵循：
- 保留原主题，不要越改越漂移
- `updated` 日期必须刷新
- 新增信息优先并入现有结构
- 只有页面混合多个职责或检索成本明显上升时才考虑拆页，不按行数机械拆分
- 主题已经分叉时建立新页面并互链

## Quality checklist
落库前至少检查：
- 文件名规范
- frontmatter 完整
- tags 来自 `SCHEMA.md`
- 页面有 Summary
- 至少有 2 个 wikilinks
- 页面可在 30 秒内扫描理解
- 内容确实有长期复用价值

## Anti-patterns
- 把 wiki 写成日记
- 把 wiki 写成 raw 仓库镜像
- 只写标题，不写摘要
- 没有 Related，导致知识孤岛
- 一个页面塞成超长杂烩
- 用临时会话结论直接覆盖长期知识

## Minimal template
最小模板只需保留：frontmatter、`# 标题`、`## Summary`、主体内容、`## Related`。

## Source and freshness guidance

对于重要结论，优先在同段或相邻句放具体 Wiki、raw 或官方来源；数字、当前外部行为、规范性规则、争议结论和多来源综合结论尤其如此。普通背景段落保留页面级 `sources` 即可。

来源事实与本地推导分开；本地推导使用 `[推论]`。凡外部变化可能导致 Agent 错误行动的知识均可设置 `review_by`；纯方法论不为年龄加日期。

页面局部复核只说明相关段落，不代表整页已复核；`updated` 仅表示文件最近编辑时间。无法确认时保留限制，不把未确认内容写成当前规则。

低风险、来源清楚且已有 Wiki owner 的外部知识，可以直接按最小改动沉淀到现有正式页面或入库规则；不因缺少 active workflow 证据而另建验证项目、试点门槛或新基础设施。涉及 Schema、active skill、runtime、cron、MCP、memory 或批量迁移时，另行走对应治理流程。

## Optional freshness and local claims

以下日期边界中的 `today` 统一指 UTC 日历日。

- `volatility` 可选，取 `low | medium | high`，表达现实变化速度，不是质量评分。缺失不代表 low：当前外部事实或适用性未知按 YELLOW，明确稳定方法或时间范围内的历史知识可为 GREEN。
- `verified_at` 可选，必须为合法的 `YYYY-MM-DD` 且不晚于 UTC 当日；只在实际核对所有页面级易变结论后填写。普通编辑只更新 `updated`。只验证局部时使用局部标记，不刷新页面级验证日期。
- `review_by` 可用于任何外部变化可能导致 Agent 错误行动的知识。`verified_at <= today <= review_by` 才在日期窗口内；到期当天仍有效，次日起需复核。无法验证时不得删除到期字段来消除告警。
- `status` 仅表达生命周期，`stable` 不等于当前可信。实时核验要求优先于未到期日期；运行时资格见 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)。
- 校验：正式知识页（formal page）中的非法 `volatility`、非法/未来 `verified_at`、非法 `review_by` 为 P1；到期 `review_by`、high 页有 `verified_at` 却无 `review_by`、`verified_at > updated` 为 P2。缺省字段兼容历史页面，不批量迁移。

混合页面的局部核验紧邻具体断言，标明版本/环境范围与证据。`_As of: 日期 · Source: 来源_` 仅提供核对时间线索，不能替代 `verified_at` + `review_by`。

只有实际核验后才填写以下 block；模板不预填日期。block 仅覆盖其内部明确写出的 claim：

```markdown
> [!volatile]
> verified_at: YYYY-MM-DD
> review_by: YYYY-MM-DD
> source: docs:具体权威地址或 project:具体证据路径
>
> 已核验的具体行为及版本/环境范围。
```

其余易变段落仍待验证；稳定方法论可独立使用。Health check 会忽略代码示例，并逐 block 检查三个 metadata 字段、日期格式与顺序、未来日期、到期提醒和来源包含关系；不支持的 block 格式显式报 P1。到期当天仍有效，次日起只产生该 claim 范围的 P2 提醒，不证明内容错误，也不阻断无关修改。

添加 block 前先检查页面级 `sources`：block 使用的新来源必须同步加入，已有来源不重复添加。页面级 `sources` 是 canonical provenance；加入局部来源只表示页面包含依赖该来源的 claim，不表示来源支撑整页，也不能据此刷新整页 `verified_at`。因此 `block source ⊆ page sources`，block `source:` 不得成为页面唯一的来源记录。block 可选；一旦使用，受支持格式要求 `verified_at`、`review_by`、`source` 各出现一次，并用带 `>` 的空行分隔 metadata 与 claim。

## Relationship to other rules
这页定义“怎么写页面”，不是“信息该放哪里”。
- 内容归类边界见 `[[hermes-memory-skills-wiki-boundaries]]`
- 检索与回答顺序见 `[[hermes-retrieval-priority-and-answer-path]]`
- 入库流程见 `[[wiki-ingestion-workflow]]`
- 整体架构见 `[[hermes-knowledge-architecture]]`
- 健康检查规范见 `[[hermes-wiki-lint-and-health-check-standards]]`

## Relations
- refines: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- depends_on: [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)

## Related
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- [hermes-wiki-lint-and-health-check-standards](/concepts/hermes-wiki-lint-and-health-check-standards)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`

