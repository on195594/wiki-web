---
title: Hermes Wiki 知识新鲜度改造计划
created: 2026-08-26
updated: 2026-09-29
type: query
tags:
  - hermes
  - governance
  - knowledge-base
  - verification
  - workflow
  - architecture
sources:
  - concepts/hermes-knowledge-freshness-and-claim-evidence.md
  - raw/articles/langchain-self-correcting-memory-openwiki-2026-08-26.md
  - concepts/hermes-wiki-page-writing-standards.md
  - concepts/hermes-wiki-lint-and-health-check-standards.md
status: closed
description: 保留 2026-08-26 已关闭的新鲜度改造决策；当前执行以 Schema、写作规范和 Freshness Gate 为准。
aliases:
  - wiki freshness plan
  - claim evidence workflow
---

# Hermes Wiki 知识新鲜度改造计划

> 历史范围：本页保留 2026-08-26 的已关闭决策，下文“立即生效”等措辞仅描述当时约定。当前规则见 [SCHEMA.md](../SCHEMA.md)、[hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards) 与 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)；易变性不再仅限外部厂商产品，局部 claim 可使用现行 volatile block。不要将本页当作当前执行入口。

## Summary

立即复用现有 `sources`、`review_by`、`updated` 和 `[推论]`，改善重要结论的来源精度与易变页面的复查提醒；不新增状态枚举、正文模板、验证项目或自动化工具。


## Decision

立即把 OpenWiki 中有价值的内核吸收到 Hermes Wiki 的日常写作和维护中，但只复用现有 Wiki 机制，不引入新的状态机、正文微语法或验证项目。

具体采用：

- 重要结论尽量写成可独立判断的事实、规则或结论；
- `sources` 尽量指向具体 raw 文件、概念页或官方来源；数字、当前外部行为、规范性规则、争议结论和多来源综合结论，应在同段或相邻句放具体来源；普通背景段落保留页面级 `sources` 即可；
- 本地推导继续使用已有的 `[推论]` 标记；
- 仅对外部厂商控制的产品行为、接口或命令集页面使用已有的 `review_by`，稳定的方法论或仅提及工具的页面不为了形式添加日期；
- 发现来源或行为变化时，只检查并更新受影响段落；`updated` 只表示文件最近编辑时间，不代表整页已复核；必要时在相关段落保留依据、截至日期和复核范围；
- 未解决的新旧来源冲突按现有规则并列保留日期、来源和冲突，不直接删除旧说法；
- 保留历史来源，不因局部变化整页重写或删除。

这是一条立即生效的 Wiki 写作约定，不是验证项目、试点项目或新的 workflow gate。

## 日常执行规则

### 新建或实际编辑页面时

1. 先写结论，再写必要的机制和边界。
2. 将高价值结论拆成短而明确的段落，避免把多个事实混成一个无法追溯的总判断。
3. 在 frontmatter 的 `sources` 中保留页面级 provenance；正文需要精确来源时直接引用已有 Wiki 链接或 raw 来源。
4. 来源事实与 Hermes 本地推导分开；推导使用 `[推论]`，不使用新的 `inferred` 状态。
5. 对受外部版本影响的页面填写合理的 `review_by`；稳定的方法论页面不为了形式添加日期。
6. 保持页面 30 秒可扫读，不为每个普通段落建立证据表格或重复元数据。

### 发现内容可能过时时

- 直接检查相关来源、项目证据或工具文档；
- 只有当前任务明确授权 Wiki 写入时，才修正页面；否则只报告页面、段落和证据；
- 获得写入授权后，确认仍成立：更新相关依据或日期，并刷新文件的 `updated`；
- 已失效：修改相关段落，同时在必要处说明变更原因；无法确认：保留原始来源和限制说明，不把未经确认的内容写成当前规则；
- 页面确属外部厂商控制的易变行为时使用或更新 `review_by`，让现有 health check 提示到期页面；
- 所有 Wiki 写入继续遵守 `index.md`、`log.md`、health check 和 `git diff --check` 的既有闭环。

不要求每次编辑都进行全页审计，也不要求 Agent 承担无法完成的自动事实证明责任。

## 既有页面的处理顺序

不进行全库迁移，也不建立覆盖率或验收门槛。以后实际编辑以下页面时直接采用上述规则：

- Hermes 运行规则、层边界和知识架构；
- Agent、memory、skill、context、Wiki 工作流；
- 工具、命令、配置和外部产品行为；
- 会被多个 Agent 反复引用的决策页。

没有实际编辑需求的历史页面不为追求格式统一而改动。

## 与 OpenWiki 的关系

OpenWiki 的可迁移价值是“知识要能回到证据，来源变化应促使复查”，不是要求 Hermes 复制其 claims、sidecar、版本图或运行时。文章报告的实验数字是来源特定结果，不是 Hermes 指标、阈值或质量保证。

## 不改变的内容

- Markdown-first Wiki、不可变 `raw/`、正式页面、`SCHEMA.md`、`index.md` 和 `log.md` 仍是 canonical model；
- `sources`、`review_by`、`updated` 和 `[推论]` 继续承担来源、新鲜度和推论边界；
- 不新增 `verified`、`stale`、`unverified`、`inferred` 等正文状态枚举；
- 不新增 `## Evidence` / `## Verification` 强制章节；
- 不引入数据库、向量库、知识图谱运行时、claims sidecar、watcher 或全库扫描；
- 不修改 memory、active skills、runtime、cron、MCP、wrapper、gateway 或 provider。

## 维护责任

Wiki 作者在有实际编辑时遵守上述写作约定；发现明确过时内容的 Agent，在获得当前任务的 Wiki 写入授权后修正文段或补充限制，否则只报告页面、段落和证据。

Wiki health check 继续负责现有的 frontmatter、链接、索引、标签、raw hash 和 `review_by` 检查，不把格式检查冒充语义真值证明。

## 目标

- 重要内容能追溯到更具体的来源；
- 来源事实、本地推论和不确定性更容易区分；
- 易变页面有可复用的复查提醒；
- 页面发生局部变化时可以直接局部修正；
- 改造不会变成新的验证项目、全库迁移或维护负担。

## Relations

- refines: [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence)
- depends_on: [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)
- depends_on: [hermes-wiki-lint-and-health-check-standards](/concepts/hermes-wiki-lint-and-health-check-standards)

## Related

- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)

