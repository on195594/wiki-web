---
title: Wiki Ingestion Workflow
created: 2026-04-16
updated: 2026-09-29
type: concept
tags:
  - knowledge-base
  - workflow
  - research
  - automation
sources:
  - repository:SCHEMA.md
  - concepts/hermes-wiki-page-writing-standards.md
  - concepts/hermes-wiki-lint-and-health-check-standards.md
status: stable
description: 定义公开材料进入 AI Agent wiki 的标准路径：先过公开边界，再保存 raw、提炼正式页面、补链接并验证。
aliases:
  - wiki-ingestion
  - knowledge-ingestion
---

# Wiki Ingestion Workflow

## Goal
把适合公开的链接、文档、视频摘要等外部信息，稳定转化为可跨用户复用的长期知识。

## Summary
这页定义人类与受授权的 AI Agent 把外部材料编译进公开 wiki 的共享入库路径：先判断是否适合公开，再保存 raw、提炼主题与结论，随后更新正式页面、补充链接，并同步维护 `[[index]]` 与 `[[log]]`。

## Standard flow
1. 先过公开边界
   - 不接收私密对话、本机状态、真实持仓、家庭资料、凭证、私有配置或个人任务台账
   - 公共知识必须脱离作者环境仍可理解；本机路径和私有会话不能充当公众可复验证据
   - 边界适用于 `raw/`、正式页、附件、`_meta/`、脚本和日志，不允许“先存 raw 再判断”
2. 获取公开原始材料
   - URL → `raw/articles/`
   - PDF → `raw/papers/`
   - 公开会议/音视频整理 → `raw/transcripts/`
3. 提炼主题、实体、概念、可复用结论
4. 搜索现有正式页，区分精确依赖和启发式候选，按下表逐 claim 输出分类与匹配依据
5. 按 NEW/CONFIRM/UPDATE/CONFLICT/SUPERSEDE 做最小补丁：
   - `entities/`
   - `concepts/`
   - `comparisons/`
   - `queries/`
   - `operations/`（可复用操作指南或维护契约）
   - 重要结论、数字、当前外部行为和规范性规则尽量在同段或相邻句放具体来源；本地推导使用 `[推论]`
   - 外部变化可能导致错误行动的知识按需添加 volatility/review_by，真实核验才填写 verified_at
   - NEW / CONFIRM / UPDATE 中若局部 `[!volatile]` claim 写入 `> source: X`，必须同时满足 `X ∈ page.frontmatter.sources`，否则该次 ingest 不算闭环；已有来源不重复添加，也不因此刷新整页 `verified_at`
6. 为页面补充 `[[wikilinks]]`
7. 更新 `[[index]]`；已关闭的历史 plan/audit 不必进入主索引
8. 在 `[[log]]` 只记录公共仓库的 durable delta、证据边界和验证结果
9. 运行 Wiki health check、公开内容检查与 `git diff --check`

## 来源变化与候选发现

摄取时先抽取产品名、实体名、别名及窄主题词，再搜索现有正式页。两种证据不可混用：

- **exact dependent**：已被引用来源需重审时，在仓库根运行 `python3 _meta/scripts/wiki_reverse_lookup.py --root "$WIKI_ROOT" --source <精确来源字符串>` 列出全部直接依赖正式页。`WIKI_ROOT` 是调用者选择的仓库根；raw 快照不可覆盖，新快照保留新路径，旧来源路径只用于反查依赖。
- **heuristic candidate**：新来源尚未被引用时，精确反查可以返回 `[]`；继续按产品/实体/aliases/窄主题词搜索正式页 title、aliases、正文。记录每页命中字段、具体词、对应 claim 和需复查原因。仅有 agent、AI、workflow 等宽泛词的干扰页排除并解释；候选不是确定性依赖，更不等于失效。
- 对受影响页运行 `python3 _meta/scripts/wiki_reverse_lookup.py --root "$WIKI_ROOT" --page <页面相对路径>`，读取关系出入边及其范围，再按 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 判断。反查失败必须报告，不当成没有依赖。

每次输出：`来源 | exact dependent/heuristic candidate | 页面 | 命中字段/词或精确 sources 边 | claim/范围 | 分类 | 修改/不修改理由`。无需新建永久 needs-review 字段或持久化索引。

## 五种分类与最小补丁

| 分类 | 判据 | 操作 |
|---|---|---|
| NEW | 无对应旧结论且无冲突 | 按页面阈值并入 owner 或建页 |
| CONFIRM | 新证据确认旧 claim | 无需正文 diff；只刷新真正复核范围的日期，局部不升级整页 |
| UPDATE | 旧知识大体成立，局部变化 | 只改受影响段落，保留证据/范围 |
| CONFLICT | 新旧证据在同一范围无法统一 | 保留双方；影响当前事实时必须在正式页 Relations 建立 conflicts_with，正文说明范围/理由，不自动选边 |
| SUPERSEDE | 明确新规则/版本替代旧结论 | 新页/当前页建立 supersedes 指向旧页，正文说明生效范围，旧页保留历史 |

若旧页只说明主题而没有对应旧 claim，新断言归 NEW（可并入现有 owner）；不能仅凭 sources 中的版本名推断正文发生 UPDATE 或 SUPERSEDE。

不能为凑分类制造变更：同一来源可确认一个 claim、更新另一个；每项分别解释。只有实际验证后才填 `verified_at`；不能仅凭材料进入 raw 就把候选页视为当前已验证。

## Filing rules
- 值得长期复用的问答，归档到 `queries/`
- 横向分析放到 `comparisons/`
- 方法论与架构放到 `concepts/`
- 具体项目、模型、组织、产品放到 `entities/`

## Quality bar
满足以下至少一项才进入正式知识层：
- 以后高概率会再次用到
- 需要跨来源综合才能得到
- 对系统设计、配置、决策有长期价值
- 人类重新整理的成本较高

## Anti-patterns
- 把整段聊天直接复制进 wiki
- 把私密材料先写入 raw，再用“尚未提炼”解释公开边界缺失
- 把本机路径、私有 session 或未公开项目写成公众可复验来源
- 把合成示例描述成已经部署或获得授权的配置
- 没有来源就写死结论
- 只堆 raw，不更新正式页面
- 新建页面后不更新 `[[index]]` 与 `[[log]]`
- 普通低风险摄取也默认生成独立 AI review、exit/stderr 和前后 hash sidecar

## Review trigger

独立 AI 审查不是普通摄取的默认步骤。只在 Schema/治理规则变更、跨层推广、高风险事实、多来源冲突或确定性检查不足时触发；其他情况由现有 health check、Git diff 和父级事实核验收口。

## Relations
- refines: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- depends_on: [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)
- depends_on: [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)

## Related
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [hermes-knowledge-base-operating-flow](/concepts/hermes-knowledge-base-operating-flow)
- [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)
- [index](/)
- `log`

