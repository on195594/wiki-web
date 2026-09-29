---
title: Hermes 知识新鲜度与断言证据绑定
created: 2026-08-26
updated: 2026-09-09
type: concept
tags:
  - hermes
  - knowledge-base
  - memory
  - verification
  - architecture
  - workflow
sources:
  - raw/articles/langchain-self-correcting-memory-openwiki-2026-08-26.md
  - concepts/hermes-knowledge-architecture.md
  - concepts/hermes-memory-skills-wiki-boundaries.md
status: draft
description: 用现有来源、复查日期和推论标记改善 Hermes Wiki 的知识新鲜度。
aliases:
  - knowledge freshness
  - claim evidence
  - stale knowledge
---

# Hermes 知识新鲜度与断言证据绑定

## Summary

外部来源沉淀到 Hermes Wiki 后，不应只记录“页面来自哪里”，还应尽可能让重要结论回到具体来源，并区分来源事实、Hermes 推论和待确认内容。OpenWiki 提供了一个设计启发：知识维护应关注证据是否仍然适用；Hermes 采用现有的 `sources`、可选 `volatility/verified_at/review_by`、`updated` 和 `[推论]` 表达这一点，不采用 OpenWiki 的 claims 状态机或运行时。

## 可迁移原则

1. **结论与来源相邻**：数字、当前外部行为、规范性规则、争议结论和多来源综合结论，应在同段或相邻句放具体 Wiki/raw/官方来源；普通背景段落保留页面级 `sources` 即可。
2. **证据与推论分离**：来源事实、Hermes 本地推导和待确认内容必须明确区分；本地推导使用已有的 `[推论]` 标记。
3. **变化促成复查**：来源或项目证据变化后，不应静默继续把旧内容写成当前规则；直接检查受影响段落，无法确认时保留限制说明。
4. **按需局部维护**：优先修正被检索、引用或编辑的相关段落，避免没有收益的全库重写。
5. **不伪造验证状态**：Hermes 不采用 OpenWiki 的 `verified`、`stale`、`unverified`、`inferred` 正文状态枚举；页面生命周期仍由 `status` 表达，易变事实使用可选新鲜度字段；GREEN/YELLOW/RED 只作为检索时资格，不写入 status。

## Hermes 适用边界

- 这是 Wiki 写作、来源和复查方式的优化方向，不是对 OpenWiki 实现的照搬。
- 当前 canonical model 仍是 Markdown、不可变 raw source、正式页面、`SCHEMA.md`、`index.md` 和 `log.md`。
- 使用现有 `sources`、可选 `volatility/verified_at/review_by`、`updated`、`[推论]` 和普通正文说明表达来源与不确定性；不新增状态枚举或强制章节。
- 不因本文自动新增数据库、向量库、claims sidecar、runtime 同步、全库扫描 cron；Wiki 消费必须执行 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 中的 Freshness Gate，不因此新增 runtime 门禁。
- 任何 active skill、runtime、cron、MCP、wrapper、gateway 或 memory 改造都必须另行评估和授权。

## 建议的页面实践

对高复用或确实受外部版本控制的页面，逐步补充：

- 关键结论附近的具体来源；
- 来源版本、提交或文档日期（若可获得）；
- `[推论]` 标记和必要的限制说明；
- 对外部变化可能改变 Agent 行动的知识按需设置 `review_by`；
- 与相邻概念的 `Relations`。

这些是现有写作规则的应用，不要求历史页面批量迁移。

## 当前规则与历史边界

2026-09-09 起，检索按 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 判断时效、关系出入边与局部 claim 资格。到期不等于错误；被当前范围内替代的旧页保持 RED，即使替代页也到期。局部验证不提升整页。写作规则见 [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)，来源事件与候选分类见 [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)。

已 closed 的新鲜度改进计划保留当时决策，不作为现行检索契约；这里同步现行规则，不追改历史语义。

## Related

- `[hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)`：补充知识对象和证据路由的维护维度。
- `[hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)`：补充 Wiki 知识如何保持新鲜，而非改变层边界。
- `[hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)`：候选的写作规范落点。
- `[hermes-wiki-lint-and-health-check-standards](/concepts/hermes-wiki-lint-and-health-check-standards)`：候选的验证落点。
- `[wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)`：候选的入库流程落点。
- [hermes-wiki-knowledge-freshness-improvement-plan](/queries/hermes-wiki-knowledge-freshness-improvement-plan)

## Relations

- refines: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- refines: [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)
- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)

