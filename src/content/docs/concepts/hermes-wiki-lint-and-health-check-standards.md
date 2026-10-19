---
title: Wiki Lint and Health Check Standards
created: 2026-04-16
updated: 2026-10-19
type: concept
tags:
  - agent
  - knowledge-base
  - workflow
  - configuration
  - debugging
sources:
  - repository:SCHEMA.md
  - repository:_meta/wiki-health-check-runbook.md
  - repository:_meta/scripts/wiki_maintain.py
  - repository:_meta/scripts/wiki_health_check.py
  - repository:_meta/scripts/wiki_tag_audit.py
  - repository:_meta/scripts/wiki_catalog.py
  - repository:_meta/scripts/wiki_public_content_check.py
status: stable
description: 定义 AI Agent wiki 健康检查要回答的问题、自动检查与人工审查的分工、严重性原则和通过标准；具体检查码与命令见 runbook 和脚本。
aliases:
  - wiki-health-check
  - wiki-lint-standards
  - agent-wiki-lint-and-health-check-standards
volatility: medium
review_by: 2027-02-07
---

# Wiki Lint and Health Check Standards

## Summary
AI Agent wiki 的健康检查不是“看看文件还在不在”，而是持续验证知识库是否仍然可检索、可维护、可导航、可扩展，尽早发现知识孤岛、结构漂移、标签失控、索引失真和陈旧内容。

本页只定义方法与判据。具体检查码、严重性映射、命令和退出码以 `_meta/scripts/` 下的脚本为准，操作步骤见 `wiki-health-check-runbook`；字段与枚举规则见 `SCHEMA.md`。本页不复述检查清单，避免脚本更新后文档过期。

## Canonical goal
一次合格的健康检查至少要回答：
- 页面之间还能不能连起来，索引还能不能正确导航
- 页面结构、frontmatter 和标签是否仍受 `SCHEMA.md` 约束
- 原始快照是否被改动，机器可读清单是否与页面同步
- 是否有越过公开边界的内容
- 哪些页面已经陈旧、过大或相互矛盾

## Scope
检查覆盖 `index.md`、`log.md`、`SCHEMA.md` 和全部正式页目录。`raw/` 不套用正式页写作模板，但仍受链接、公开边界和原始快照 hash 检查约束。结构通过不代表事实正确或对两类读者都易用。

## Automated vs human checks

| 类别 | 由谁判断 | 说明 |
|---|---|---|
| 断链、索引覆盖、语义入链、frontmatter 与枚举、标签登记、Relations 语法、raw hash、catalog 同步、日期字段格式与到期、近重复页、公开边界规则 | 确定性脚本（`wiki_maintain.py --check`） | 只证明脚本覆盖的规则；新增检查前先确认不破坏脚本的确定性、只读、可离线属性 |
| 外链存活 | 网络检查（lychee，周期运行） | 与确定性门禁分开，结果随网络变化 |
| 事实陈旧、跨页矛盾、页面是否混合多个职责、description 是否具体、两类读者是否能用 | 人工或审查 Agent | 脚本 PASS 不覆盖这些；结论须回到原文核实 |

页面长度只作人工分诊信号，不设机械行数阈值；只有页面混合多个职责、检索成本明显上升时才拆分。语义冲突和当前适用性由检索 Agent 按 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 判断，不设固定 stale 天数。

## Severity principles
- **P0**：核心文件或索引缺失、wikilink 断裂、行前缀污染，导航本身已不可信
- **P1**：门禁失败，规则与内容已经错配（如未登记标签、raw 快照漂移、非法日期字段）
- **P2**：维护提醒，不阻断无关修改（如到期复核、近重复候选、只有索引入链的页面）

每条检查码属于哪一级以脚本为准；调整级别时同步改脚本、测试和 runbook，而不是只改本页。

## Recommended workflow
1. 运行 `wiki_maintain.py --check`，按严重性处理 P0/P1
2. 对改动涉及的页面做人工语义审查：来源、矛盾、适用范围
3. 若允许修复，按优先级修复并重跑门禁
4. 有长期意义的结果写入 `log`，不记录个人运行状态

频率：日常修改后跑确定性门禁；每周 CI 跑全量门禁、freshness 扫描和外链检查；大规模重构前后做完整检查并对比。

## Human and Agent usability review
在结构检查后抽查真实任务：人类能否从索引找到解释、操作与参考入口，第一屏能否理解范围和结论；Agent 能否凭标题/description 找到同一页、追到来源并识别权限和产品边界。此项是人工语义审查，现有脚本不自动证明通过。

## Pass criteria
- 确定性门禁无 P0/P1
- 没有长期只靠索引入链的孤立页
- 所有非 `closed` 正式页进入 `[[index]]`
- 到期复核提醒有人处理，而不是通过删除日期字段消除
- 日志持续可追踪

## Anti-patterns
- 只看文件存在或脚本 PASS 就算健康
- 规则写在文档里却没有执行器，或执行器改了文档没跟上
- 发现问题但长期不处理
- 每次都全量大修，缺少日常轻量维护

## Output format
一份 lint 报告至少包含：检查范围、问题统计、按严重性分组的问题与文件路径、建议动作、是否需要立即修复，以及哪些项目未被检查。

## Relationship to other rules
这页定义“怎么检查 wiki 是否健康”。页面怎么写见 [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)，内容怎么入库见 [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)，整体架构见 [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)。

## Relations
- refines: [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)
- depends_on: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- related: [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path), `wiki-health-check-runbook`

