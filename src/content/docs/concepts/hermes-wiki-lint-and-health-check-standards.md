---
title: Wiki Lint and Health Check Standards
created: 2026-04-16
updated: 2026-09-29
type: concept
tags:
  - agent
  - knowledge-base
  - workflow
  - configuration
  - debugging
sources:
  - repository:SCHEMA.md
  - repository:_meta/scripts/wiki_health_check.py
  - repository:_meta/scripts/wiki_tag_audit.py
status: stable
description: 定义 AI Agent wiki 的只读健康检查范围、严重性、通过标准，以及可选 metadata/Relations 的验证方向。
aliases:
  - wiki-health-check
  - wiki-lint-standards
  - agent-wiki-lint-and-health-check-standards
---

# Wiki Lint and Health Check Standards

## Summary
AI Agent wiki 的健康检查不是“看看文件还在不在”，而是持续验证知识库是否仍然可检索、可维护、可导航、可扩展。
lint 的目标是尽早发现知识孤岛、结构漂移、标签失控、索引失真和陈旧内容。

## Canonical goal
一次合格的 wiki lint / 健康检查，至少要回答这几个问题：
- 页面之间还能不能连起来
- 索引还能不能正确导航
- 页面结构是否仍符合规范
- 标签是否还受控
- 页面是否已经陈旧或过大
- 日志是否还能继续维护

## Lint scope
默认检查范围包括：
- `index.md`
- `log.md`
- `SCHEMA.md`
- `entities/`
- `concepts/`
- `comparisons/`
- `queries/`
- `operations/`

`raw/` 不套用正式页写作模板，但仍受链接、公开边界和原始快照 hash 检查约束。结构通过不代表事实正确或对两类读者都易用。

## Core checks
### 1. Broken wikilinks
检查 `[[wikilinks]]` 是否指向不存在的页面。

目标：
- 避免页面可读但不可跳转
- 防止知识网络断裂

### 2. Orphan pages
检查哪些正式页面没有任何 inbound links，以及哪些页面只有主索引入链。

目标：
- 找出知识孤岛
- 避免页面存在但永远检索不到
- 让主题页进入知识网络，而不只是目录列表

说明：
- 新页面短期内可能是“暂时孤立”
- 只有 `index.md` 入链的页面属于语义孤岛，应补充主题相关入链
- 长期孤立页应被补链、合并或归档

### 3. Index completeness
检查所有正式页面是否都列在 `[[index]]` 中。

目标：
- 保证目录仍是有效导航入口
- 防止页面实际存在但索引缺失

### 4. Frontmatter and summary validation
检查页面是否具备完整 frontmatter：
- `title`
- `created`
- `updated`
- `type`
- `tags`
- `sources`
- `status`

同时检查正式页存在 `## Summary`，并验证 `type` 与 `status` 使用 `SCHEMA.md` 声明的枚举；日期化状态应改用 `updated`、`review_by` 或正文说明。

目标：
- 保持页面结构统一
- 保证后续筛选、治理和自动化处理可行

### 5. Tag audit
检查页面 tags 是否都来自 `SCHEMA.md` 的 taxonomy。

目标：
- 防止 tag 漫游
- 防止同义标签并存造成检索分裂

### 6. Page size triage
页面长度只作为人工分诊信号，不设机械行数阈值。

目标：
- 防止一个页面变成无法维护的大杂烩
- 只有页面混合多个职责、检索成本明显上升时才拆分

### 7. Staleness check
检查页面是否长时间未更新，且主题已被更晚资料覆盖。

目标：
- 发现看似存在、实则过期的知识
- 提醒进行增量维护，而不是继续引用旧结论

### 8. Contradiction check
检查相近主题页面之间是否存在互相冲突的结论。

目标：
- 防止知识库表面整齐、内部互相打架
- 要求显式记录冲突，而不是静默覆盖

### 9. Log health
检查 `[[log]]` 是否保持精简、日期是否按降序排列、历史条目是否按年度归档，以及普通摄取是否误生成大量 review sidecar。

目标：
- 保持维护历史可追踪
- 防止日志无限增长后失去可读性

### 10. Schema drift
检查页面实际写法是否偏离 `SCHEMA.md` 与 `[[hermes-wiki-page-writing-standards]]`。

目标：
- 防止规范写在文档里，但页面实际早已失控

### 11. Agent-readable metadata and relations
对采用机器可读增强的页面做只读检查：
- `description` 存在时应短、具体，不能替代 `## Summary`
- `aliases` 不应与 tag taxonomy 或文件名规范冲突
- `## Relations` 中的 wikilinks 应可解析
- `Relations` 不应替代 `sources` 或混淆事实来源与推断关系

目标：
- 让 Agent 可消费的结构增强保持轻量、可验证、可回滚

## Deterministic freshness checks

以下日期边界中的 `today` 统一指 UTC 日历日。

- `volatility` 可选，取 `low | medium | high`，表达现实变化速度，不是质量评分。缺失不代表 low：当前外部事实或适用性未知按 YELLOW，明确稳定方法或时间范围内的历史知识可为 GREEN。
- `verified_at` 可选，必须为合法的 `YYYY-MM-DD` 且不晚于 UTC 当日；只在实际核对所有页面级易变结论后填写。普通编辑只更新 `updated`。只验证局部时使用局部标记，不刷新页面级验证日期。
- `review_by` 可用于任何外部变化可能导致 Agent 错误行动的知识。`verified_at <= today <= review_by` 才在日期窗口内；到期当天仍有效，次日起需复核。无法验证时不得删除到期字段来消除告警。
- `status` 仅表达生命周期，`stable` 不等于当前可信。实时核验要求优先于未到期日期；运行时资格见 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)。
- 校验：正式知识页（formal page）中的非法 `volatility`、非法/未来 `verified_at`、非法 `review_by` 为 P1；到期 `review_by`、high 页有 `verified_at` 却无 `review_by`、`verified_at > updated` 为 P2。缺省字段兼容历史页面，不批量迁移。

以上页面级日期/枚举检查继续生效。脚本还逐个检查局部 `[!volatile]` block 的支持格式、日期格式与顺序、未来验证日期、到期提醒和 `block source ⊆ page sources`；代码示例忽略。局部通过不提升整页资格，到期只产生该 claim 范围的 P2 复核提醒。语义冲突和当前适用性仍由检索 Agent 判断，不设固定 stale 天数。关系目标缺失继续归现有 `broken_wikilink` P0。

## Severity levels
建议把 lint 结果按严重性分级：

### P0
必须立即修：
- broken wikilinks
- 丢失 index 主入口
- frontmatter 严重缺失

### P1
应尽快修：
- 未进入主索引的非 `closed` 正式页面
- tag taxonomy 失控
- 明显结构漂移
- 重要页面陈旧
- 高价值页面的关系块断链或语义混淆

### P2
常规维护：
- 只有主索引入链的语义孤岛页
- 经人工确认需要拆分的多职责页面
- 日志接近轮转阈值
- 页面可读性一般但仍可用
- 可选 metadata 缺失但未影响检索

## Recommended lint workflow
1. 先读 `SCHEMA.md`
2. 读 `[[index]]`
3. 读最近的 `[[log]]`
4. 扫描所有正式知识页
5. 输出 broken links / orphan / missing index / frontmatter / tag / stale / size / contradictions / optional metadata and relations
6. 按严重性排序
7. 明确给出每项对应文件路径
8. 若允许修复，再按优先级修
9. 记录 lint 结果到 `[[log]]`

## Human and Agent usability review

在结构检查后抽查真实任务：人类能否从索引找到解释、操作与参考入口，第一屏能否理解范围和结论；Agent 能否凭标题/description 找到同一页、追到来源并识别权限和产品边界。检查 Wiki 是否误把操作指南一律排除、是否把产品特有工具当通用能力、是否只有机器元数据而缺少可读解释。此项是人工语义审查，现有脚本不自动证明通过。

## Health check frequency
建议频率：
- 日常增量维护后：轻量 lint
- 每新增一批页面后：结构 lint
- 每周或每月：全量健康检查
- 在大规模重构前后：完整 lint + 对比

## Pass criteria
一个健康的 AI Agent wiki，至少应满足：
- 没有 broken wikilinks
- 没有长期 orphan pages
- 所有非历史关闭页面都进入 `[[index]]`
- frontmatter 完整
- tags 受控
- 页面可扫描
- 日志持续可追踪

## Anti-patterns
- 只看文件存在就算健康
- 只检查链接，不检查结构和标签
- lint 结果不写回 `[[log]]`
- 发现问题但长期不处理
- 每次都全量大修，缺少日常轻量维护

## Output format
一份好的 lint 报告至少包含：
- 检查范围
- 问题统计
- 按严重性分组的问题列表
- 每个问题的具体文件路径
- 建议动作
- 是否需要立即修复

## Relationship to other rules
这页定义“怎么检查 wiki 是否健康”。
- 页面怎么写，见 `[[hermes-wiki-page-writing-standards]]`
- 内容怎么入库，见 `[[wiki-ingestion-workflow]]`
- 回答时怎么检索，见 `[[hermes-retrieval-priority-and-answer-path]]`
- 整体架构，见 `[[hermes-knowledge-architecture]]`

## Relations
- refines: [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)
- depends_on: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- depends_on: [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)

## Related
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`

