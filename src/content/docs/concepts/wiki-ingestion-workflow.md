---
title: Wiki Ingestion Workflow
created: 2026-04-16
updated: 2026-11-13
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
  - raw/articles/towardsdatascience-persistent-knowledge-layer-2026-08-16.md
  - docs:https://www.cs.cornell.edu/~shmat/courses/cs6434/fellegi-sunter.pdf
  - docs:https://en.wikipedia.org/wiki/Record_linkage
  - docs:https://en.wikipedia.org/wiki/Belief_revision
status: stable
description: 定义公开材料进入 AI Agent wiki 的标准路径：先过公开边界，再保存 raw、提炼正式页面、补链接并验证。
aliases:
  - wiki-ingestion
  - knowledge-ingestion
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Wiki Ingestion Workflow

## Goal
把适合公开的链接、文档、视频摘要等外部信息，稳定转化为可跨用户复用的长期知识。

## Summary
这页定义人类与受授权的 AI Agent 把外部材料编译进公开 wiki 的共享入库路径：先判断是否适合公开，再保存 raw、提炼主题与结论，随后更新正式页面、补充链接，并同步主题目录、受影响的任务入口与 `[[log]]`。

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
   - 重要结论、数字、当前外部行为和规范性规则尽量在同段或相邻句放具体来源（多来源综合页应在对应段落显式链接具体 `[[raw-...]]` 或 `docs:` 来源，避免只在 frontmatter `sources` 汇总导致取证退化，见 [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence)）；本地推导使用 `[推论]`
   - 外部变化可能导致错误行动的知识按需添加 volatility/review_by，真实核验才填写 verified_at
   - NEW / CONFIRM / UPDATE 中若局部 `[!volatile]` claim 写入 `> source: X`，必须同时满足 `X ∈ page.frontmatter.sources`，否则该次 ingest 不算闭环；已有来源不重复添加，也不因此刷新整页 `verified_at`
6. 为页面补充正文 `[[wikilinks]]`（正式页链接不用反引号包裹）与按需 `## Relations`（同类关系键合并为单行逗号分隔列表、省略空 `[]` 占位、`depends_on` / `refines` 仅指向正式知识页）
7. 更新 `_meta/topic-index.md` 的条目与 `Indexed pages` 计数，任务入口变化时再同步 `[[index]]`（使用标准相对 Markdown 链接；`status: draft` 标注草稿，已关闭的历史 plan/audit 不必进入主索引）
8. 在 `[[log]]` 顶部按日期倒序记录公共仓库的 durable delta、证据边界和验证结果
9. 按 `wiki-health-check-runbook` 的 Safe metadata synchronization 执行同步与检查；先审查 raw 新增/删除，不能用同步清单掩盖误删。

## 来源变化、候选发现与实体消歧（Fellegi–Sunter 记录链接模型）

摄取新材料时，最大的结构性风险是在未加载现有知识库目录的情况下盲目新建页面——[towardsdatascience-persistent-knowledge-layer-2026-08-16](https://github.com/on195594/wiki/blob/e8407157b061dc6eb64a54385558e1255061c12c/raw/articles/towardsdatascience-persistent-knowledge-layer-2026-08-16.md) 的实测表明，若抽取模型看不见现有 Wiki 概念与 `aliases`，仅靠字面名称处理 21 份文档就会产生 `149` 个概念节点（相比 19 个规范概念出现 `~7.8x` 碎片化膨胀）。

可借 Ivan P. Fellegi 与 Alan B. Sunter（1969，*Journal of the American Statistical Association* 64(328): 1183–1210，[*A Theory for Record Linkage*](https://www.cs.cornell.edu/~shmat/courses/cs6434/fellegi-sunter.pdf)，[Record linkage](https://en.wikipedia.org/wiki/Record_linkage)）提出的**三区段概率记录链接准则（Three-Zone Record Linkage）**理解“匹配 / 待复核 / 非匹配”的区别。其理论使用似然比 $W(\gamma) = \log_2 \frac{P(\gamma \mid \text{Match})}{P(\gamma \mid \text{Unmatched})}$ 与阈值划区；**本仓库没有估计这些概率或校准阈值**，下面只是 `[推论]` 确定性依赖发现与启发式候选复核，不能把名称命中直接宣称为高概率实体匹配：
1. **精确依赖与名称命中发现**：已被引用来源需重审时，在仓库根运行 `python3 _meta/scripts/wiki_reverse_lookup.py --root "$WIKI_ROOT" --source <精确来源字符串>` 列出全部直接依赖正式页；或新概念精确命中现有页面的 `slug / title / aliases`，先定位为候选 owner，再核对实体身份、claim、范围与时间；同名或别名命中不自动授权合并。只有精确 `sources` 边证明直接来源依赖。`WIKI_ROOT` 是调用者选择的仓库根；raw 快照不可覆盖，新快照保留新路径，旧来源路径只用于反查依赖。
2. **启发式候选与人工/Agent 语义复核（`heuristic candidate`）**：新来源尚未被引用时，精确反查可以返回 `[]`；继续按产品/实体/aliases/窄主题词搜索正式页 title、aliases、正文，并对受影响页运行 `python3 _meta/scripts/wiki_reverse_lookup.py --root "$WIKI_ROOT" --page <页面相对路径>` 读取关系出入边，结合正文中声明的适用范围（Scope）与生效时间裁决并入现有页还是拆分子页。记录每页命中字段、具体词、对应 claim 和需复查原因；反查失败必须报告，不当成没有依赖。
3. **不相关候选排除**：仅有 `agent`、`AI`、`workflow` 等高频宽泛词重合的干扰页明确排除并解释；候选不是确定性依赖，更不等于失效。

每次输出：`来源 | exact dependent/heuristic candidate | 页面 | 命中字段/词或精确 sources 边 | claim/范围 | 分类 | 修改/不修改理由`。无需新建永久 needs-review 字段或持久化索引。

## 五种分类与最小补丁（AGM 信念修正与次协调冲突保留）

`[推论]` 以下五类是本地编辑分类，可借 Carlos E. Alchourrón、Peter Gärdenfors 与 David Makinson（1985，*Journal of Symbolic Logic*，[*AGM Belief Revision*](https://en.wikipedia.org/wiki/Belief_revision)）及 Katsuno & Mendelzon（1991）的 revision/update 区分理解，但不实现这些逻辑算子。经典 AGM 在其前提下要求修正结果接纳新命题，并在新命题一致时保持一致性；Levi 恒等式 $K * P = (K \div \neg P) + P$ 本身不决定应删除哪条来源记录。本 Wiki 不是演绎闭合的信念集，保留冲突记录也不等于实现了次协调逻辑推理。**当两个同样处于有效期内的权威来源发生真实矛盾（`CONFLICT`）时，系统必须拒绝自动消解（Fail-Closed）**，绝不靠“新文档优先”静默覆盖旧结论：

| 分类 | 概念类比（非形式算子） | 判据 | 最小补丁操作 |
|---|---|---|---|
| **NEW** | 增添候选知识 | 无对应旧 claim，且核对后未发现同范围冲突 | 按页面阈值并入现有 owner 或新建正式页 |
| **CONFIRM** | 既有 claim 的证据增强；不只是逻辑蕴涵 | 新证据独立复现并确认既有 claim | 无需正文语义 diff；追加来源证据，只刷新真正复核范围的日期，局部核验不升级整页 |
| **UPDATE** | 限定范围的结论更新；不等同于 KM update | 旧知识在原范围成立，新证据反映局部演进或新增子范围（如 `Zone H3` 特例） | 只修改受影响段落并显式标注各自适用范围与时间窗 $[t_{\text{eff}}, t_{\text{sup}})$ |
| **CONFLICT** | 保留双方来源记录并暂停确定性采纳 | 新旧证据在同一适用范围与时点无法统一 | **禁止自动选边**：保留双方原话、来源与生效日期；影响当前事实时在正式页 `## Relations` 建立 `conflicts_with`，触发检索门禁降级（[hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)） |
| **SUPERSEDE** | 按替代证据更新当前结论，历史记录保留 | 权威新规则/新版本明确废止同范围旧结论 | 新页/当前页建立 `supersedes` 指向旧页，正文说明生效范围与替代依据，旧页保留历史可回溯性 |

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
- 新建页面后不更新主题目录与 `[[log]]`
- 普通低风险摄取也默认生成独立 AI review、exit/stderr 和前后 hash sidecar

## Review trigger

独立 AI 审查不是普通摄取的默认步骤。只在 Schema/治理规则变更、跨层推广、高风险事实、多来源冲突或确定性检查不足时触发；其他情况由现有 health check、Git diff 和父级事实核验收口。

## Relations
- refines: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- depends_on: [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards), [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path), [hermes-wiki-lint-and-health-check-standards](/concepts/hermes-wiki-lint-and-health-check-standards)
- related: [hermes-knowledge-base-operating-flow](/concepts/hermes-knowledge-base-operating-flow), [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence)

