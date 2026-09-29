---
title: Wiki Schema
---

# Wiki Schema

本页规定公开 Wiki 的内容准入、证据、结构和维护边界，不代替项目内规则、运行状态或执行授权。维护时先判断是否值得公开复用，再找现有主维护页，按受影响范围修改并验证；不为整理知识额外建立项目管理流程。

## Domain
这个公开知识库用于沉淀可跨用户、跨项目复用的长期知识资产，覆盖：
- AI / LLM / Agent / MCP / 自动化工作流
- DevOps / Linux / 网络 / 部署 / 故障处理
- 工具链、配置经验、最佳实践
- 值得长期保留的研究摘录、对比分析、决策记录
- 可公开复用的研究方法、数据质量与风险分析原则；不承载个人投资记录或当前交易指令

目标不是保存聊天原文、个人运行状态或私有配置，而是把公开可理解的高价值信息编译成可复用、可交叉链接、可持续维护的 Markdown 知识层。

公开边界适用于所有目录，包括 `raw/`、`_meta/`、附件、脚本、日志和日志归档。写入任何层之前，先判断材料是否适合公开；不适合公开的内容不得先落入 `raw/` 再等待后续清理。

## Human and AI Agent readers

人类与 AI Agent 是同一知识库的一等读者和受授权的贡献者，共享同一份正式正文、来源与修订历史。

- 人类从 `index.md` 的任务导航进入，页面首屏说明结论、适用范围与下一步；无需先理解 Agent 工具名或 YAML。
- Agent 从 [agent-shared-wiki-index](/operations/agent-shared-wiki-index) 按需检索；metadata 用于发现，Summary 与正文用于理解，`sources` 用于取证，不能相互替代。
- 通用知识按职责描述，不假设特定品牌、memory 工具、skill 格式、调度器或子代理存在；产品接口、命令与版本事实明确标注为实例。
- 双一等公民指同等可发现、可理解、可贡献与可追溯，不意味着同等执行权限。知识内容不授予工具权限；贡献仍服从当前用户授权、公开边界和既有验证。
- Wiki 可以承载面向人类的操作指南与 runbook；可执行 Skill 按需引用知识 owner，不另复制一套正文。自动化可读性不能以牺牲人的解释、证据和导航为代价。

## Conventions
- 仓库根目录可配置；维护脚本统一按 `--root`、`OBSIDIAN_VAULT_PATH`、脚本所在仓库根目录的优先级解析，不依赖用户名或调用工作目录
- 文件名统一使用小写英文加连字符，例如：`agent-context-engineering.md`
- 已有 `hermes-*` 路径保留为稳定兼容标识，避免破坏 raw 快照与外部链接；其通用知识通过标题、description、tags 和索引显示名识别。新通用页采用中性命名，旧路径不表示产品依赖。
- 正式知识页放在 `entities/`、`concepts/`、`comparisons/`、`queries/`、`operations/`
- 只有适合公开的原始材料才进入 `raw/`，且不得随意修改原文内容。此条已强制：`_meta/raw-source-hashes.json` 记录每个 raw 文件的 SHA-256，`wiki_health_check.py` 比对不符即 P1 `raw_source_drift`（正式页引用的快照被改动后，引用仍能解析但已不指向当初读到的内容）。新 ingest 后运行 `_meta/scripts/wiki_raw_hashes.py` 更新清单并连同内容一起提交；已有文件的 hash 变化是要解释的发现，不是重新生成就能抹掉的噪音。公开边界整改可删除私有指针或移除不适合公开的 raw，但必须在公共日志中记录不含个人信息的例外理由，并只更新对应 manifest 项。
- 每个正式知识页必须包含 YAML frontmatter
- 每个正式知识页至少包含 2 个 `[[wikilinks]]` 指向其他页面或索引页
- 新建或更新可检索的正式页面后，必须同步更新 `index.md`；`queries/` 中 `status: closed` 的历史计划/审查记录可退出主索引
- 每次影响公开仓库知识或验证契约的关键操作都必须追加到 `log.md`；不记录个人运行状态、会话过程、授权对话或私有任务台账
- `memory` 只存适合保留的稳定偏好与长期事实；Wiki 承载可复用知识，项目实际行为仍以适用的项目规则、源码和当前证据为准，不能从 Wiki 或记忆推断部署状态
- 公共知识必须脱离作者私有环境仍可理解。私有会话、本机路径、未公开项目、个人任务状态和本机检查结果不能充当公众可复验的证据。
- 个人实践仅保留可复用的方法、适用条件和经验局限；第一人称经历、真实家庭数据、持仓、账户、调度和当前系统状态不得进入仓库。
- 示例配置、命令和拓扑必须明确为可配置或合成示例；它们不表示作者已经部署，也不提供执行授权。

## Frontmatter
```yaml
---
title: 页面标题
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: entity | concept | comparison | query | plan | closeout | validation-case | operation | summary
tags: [tag1, tag2]
sources: [raw/articles/source-name.md]
status: draft | stable | active | closed | current

# Wiki self-governance / normative pages may use:
source_policy: normative

# Raw-source files under raw/ may use:
type: raw-source
status: raw | captured
---
```

Frontmatter rules:
- 正式页必须包含 `title`、`created`、`updated`、`type`、`tags`、`sources`、`status`；health check 会校验字段存在性以及 `type` / `status` 枚举。
- `status` 只使用 `draft | stable | active | closed | current`。日期属于 `created`、`updated`、`review_by` 或正文，不编码进 status。
- `plan`、`closeout`、`validation-case` 等枚举保留用于历史兼容，不是要求新建计划或验收产物。新页面按内容职责选择类型，并受下文公开准入与保留规则约束；本次规范编辑不触发历史页面重分类。
- `source_policy: normative` is only for wiki rules, standards, operating policies, and self-authored governance pages. It is a documentation marker only; current health-check scripts do not enforce that policy value.
- Current health checks validate `sources` forms as P2 maintenance warnings, including unexpected source prefixes and non-durable `/tmp/...` paths.
- 正式页遵守上述枚举；raw、`_meta/` 和根目录文件的历史字段不因此成为新正式页模板，也不构成默认待办。只有实际修改需要时才处理相关兼容问题。

### Agent-readable knowledge object convention

This wiki remains a public Markdown knowledge base for reusable LLM and agent knowledge; OKF is only a design reference, not a replacement schema. New or touched high-value formal pages may add optional machine-readable metadata when it improves routing or review:

```yaml
description: One-sentence page purpose for agent routing and preview.
aliases: [optional-synonym, common-abbreviation]
volatility: low | medium | high
verified_at: YYYY-MM-DD
review_by: YYYY-MM-DD
```

Rules:
- 日期比较统一使用 UTC 日历日；下文的 `today` 均指 UTC 当日。
- `description` is a routing aid, not a substitute for the page `## Summary`.
- `volatility` 可选，取 `low | medium | high`，表达现实变化速度，不是质量评分。缺失不代表 low：当前外部事实或适用性未知按 YELLOW，明确稳定方法或时间范围内的历史知识可为 GREEN。
- `verified_at` 可选，必须为合法的 `YYYY-MM-DD` 且不晚于 UTC 当日；只在实际核对所有页面级易变结论后填写。普通编辑只更新 `updated`。只验证局部时使用局部标记，不刷新页面级验证日期。
- `review_by` 可用于任何外部变化可能导致 Agent 错误行动的知识。`verified_at <= today <= review_by` 才在日期窗口内；到期当天仍有效，次日起需复核。无法验证时不得删除到期字段来消除告警。
- `status` 仅表达生命周期，`stable` 不等于当前可信。实时核验要求优先于未到期日期；运行时资格见 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)。
- 校验：正式知识页（formal page）中的非法 `volatility`、非法/未来 `verified_at`、非法 `review_by` 为 P1；到期 `review_by`、high 页有 `verified_at` 却无 `review_by`、`verified_at > updated` 为 P2。缺省字段兼容历史页面，不批量迁移。
- `aliases` are for obvious high-value synonyms only; do not use them to bypass canonical lowercase-hyphen filenames or tag taxonomy.
- 可选 metadata 保持可选。若确需改变必填字段、枚举或关系语法，应先确认现有页面与检查器的兼容性，并在获准范围内同步更新；不因普通内容编辑启动全库迁移。
- Do not introduce a separate `resource` identity field by default; the canonical identity remains the relative wiki path plus `sources` provenance. Reconsider only after a compatibility plan proves concrete value.

Formal pages may also include an optional `## Relations` section when the relationship is useful for agent retrieval or maintenance:

```markdown
## Relations

- refines: [[page-name]]
- depends_on: [[page-name]]
- conflicts_with: []
- supersedes: []
- related: [[page-name]]
```

`Relations` records semantic links between wiki pages. Evidence still belongs in `sources`; inferred relationships must not be presented as source provenance.

Rules:
- Allowed relation keys are strictly limited to: `depends_on`, `refines`, `conflicts_with`, `supersedes`, `related`.
- Values must be `[]` or a comma-separated list of `[[page-name]]` wikilinks. Free text, trailing non-link comments, or unregistered keys are rejected.

### Sources

Allowed `sources` forms:
- `raw/...`：wiki 内保留的原始材料
- `concepts/...`、`queries/...`、`comparisons/...`、`operations/...`：wiki 内派生来源
- `repository:<relative-path-or-commit>`：本 Wiki 仓库内可回读的规范、代码或提交证据；外部仓库使用公开 URL，引用历史行为时尽量定位到具体提交和文件，不能只给本机仓库名或未公开 ref
- `docs:<name-or-url>`：官方或外部文档来源
- `https://...`：公开可访问的外部来源

页面级 `sources` 是 canonical provenance，也是 source reverse lookup 与来源失效传播的唯一确定性入口。局部 `[!volatile]` block 的 `source:` 只标识该 claim 的具体证据，并且必须同时存在于页面 frontmatter 的 `sources` 中，即 `block source ⊆ page sources`；不得把 block `source:` 作为页面唯一的来源记录。

### Local `[!volatile]` claims

局部 block 本身可选，不要求历史页面添加。使用时只支持以下 claim-scoped 形式；三个 metadata 字段各出现一次，metadata 与正文之间保留一个带 `>` 的空行：

```markdown
> [!volatile]
> verified_at: YYYY-MM-DD
> review_by: YYYY-MM-DD
> source: docs:具体来源
>
> 已核验的具体 claim、版本和环境范围。
```

确定性检查规则：

- `verified_at` 与 `review_by` 必须为真实的 `YYYY-MM-DD` 日期，且 `verified_at <= review_by`；晚于 UTC 当日的 `verified_at`、非法日期、非法顺序和不支持的 block 格式为 P1。
- `review_by` 到期当天仍有效，次日起产生 claim-scoped P2 复核提醒；提醒不证明内容错误，也不阻断无关修改。
- `source` 必须逐字符串包含于页面 frontmatter `sources`；遗漏为 P1。页面级 `sources` 仍是 canonical provenance。
- 多个 block 独立检查；fenced、inline 或 indented code 中的示例忽略。局部 block 通过只说明该 claim 的结构与日期窗口通过，不刷新或验证整页。
- 页面级可选字段继续可选；本规则不要求批量补 block、刷新日期或迁移历史页面。

本机路径、私有会话、私有 skill 和未公开项目不得列为公共 provenance。可复用但不可公开复验的内容必须在正文中明确标为有限经验或推论；失去依据的事实断言应删除或降级，不得用无关公开链接、`source_policy: normative`、清空 `sources` 或刷新 `verified_at` 掩盖缺口。

### Evidence scope

- **按问题选择权威来源**：概念与方法读 Wiki 主维护页，项目规则读该项目现行规则与合同，实现行为核对相应版本的源码和测试，部署与运行状态读当前部署记录或实时证据。相邻项目 README、模型记忆和历史计划不能代替被描述项目的当前证据。
- **区分时间含义**：正文按需写明事实的发生/公告/生效时间、适用版本或数据期间；`verified_at` 是实际核查时间，`updated` 是页面编辑时间，两者不能代替事实时间。刷新页面日期不使旧事实成为新事实，也不要求新增固定 metadata。
- **结论不超过验证范围**：格式/文本 QA、确定性测试、合成数据回放、真实客户端行为和实际使用效果是不同证据。通过前一种不证明后一种；报告通过项、覆盖范围及未验证部分。项目有结构化状态合同的，以其当前有效数据为准，不能从 Markdown 摘要反推缺失的机器状态。
- **保留缺口与失败**：未找到不等于不存在，缺失不等于零，未证明有效不等于证明无效。部分证据不得拼成完整成功；本次核验失败时保留旧结论的原日期和限制，不刷新验证日期冒充成功，并按 Freshness Gate 降级使用。
- **经验不冒充证明**：项目经验可以启发通用规则，但迁移到 Wiki 时必须去除私有状态并说明适用条件；没有公开可回读依据时，只保留有限经验、推论或明确的规范性选择，不声称已经证明效果。Wiki 自身的检查结果只证明对应仓库检查范围。

## Tag Taxonomy

Tags are grouped by purpose. Use lowercase kebab-case. Add a new tag here before using it on pages.

Scope: this taxonomy governs formal pages only. `raw/`, `_meta/` and the root core files (`index.md`, `log.md`, `SCHEMA.md`) are exempt, because raw captures carry vocabulary from their own sources and would otherwise force a SCHEMA change on every ingestion. Everything else is a formal page — the exemption list is what `_meta/scripts/wiki_health_check.py` actually implements, so a new top-level directory is governed by default rather than silently unchecked; today that means `entities/`, `concepts/`, `comparisons/`, `queries/` and `operations/`. The scope is enforced: an unregistered tag on a formal page is P1, which fails the health check.

**Core tags** describe broad, cross-wiki categories:

- hermes
- knowledge-base
- agent
- llm
- mcp
- automation
- workflow
- tool
- configuration
- debugging
- research
- comparison
- decision
- note

`hermes` 标签仅用于 Hermes 产品事实、实现实例或历史评估；通用方法使用 `agent`。

**Domain tags** name the main subject area of a page:

- devops
- linux
- networking
- product
- investment
- trading
- governance
- validation
- project
- monitoring
- memory
- skills
- cron
- browser
- context-engineering
- content-engineering
- position-sizing
- architecture
- risk-control
- deployment
- lifecycle
- optimization
- lifeos

**Facet tags** describe a cross-cutting angle, method, tool mode, or evaluation lens that can apply across multiple subject areas:

- ai-coding
- claude-code
- multi-agent
- subagent
- orchestration
- evaluation
- verification
- operating-model
- model-profiles
- harness
- closeout
- pydantic
- structured-output
- typed-boundary

**Reconciliation tags (registered 2026-08-11, retired 2026-09-03)**:
Historically registered to tolerate single-use legacy tags. On 2026-09-03, all 55 reconciliation tags were fully converged into canonical Core, Domain, and Facet tags across all formal pages. Formal pages now strictly adhere to the curated Core, Domain, and Facet taxonomy above.

Rules:
- Register a tag in this file before using it on a formal page. This is enforced, not advisory: an unregistered tag fails the health check.
- Before registering a new tag, check whether an existing broader tag already covers it. A tag that will only ever apply to one page usually belongs to a broader existing tag instead.
- If two tags mean the same thing, keep one canonical spelling and replace the other.
- Reserved but currently unused tags are allowed when they match stable future page areas, e.g. `devops`, `linux`, `networking`, `product`.

## Page Thresholds
- 先满足公开准入与长期复用价值，再判断是否需要独立页面；来源数量不是自动建页条件。主题需要独立解释或反复检索、且现有页面无法清楚承载时才新建；单一充分来源也可支撑页面
- 已存在页面则优先增量更新。同一规则保留一个主维护位置；索引、摘要、示例和快捷入口引用它，并保留会改变行动的必要边界，不复制完整规则制造多个版本
- 只被顺手提及一次的内容，不单独建页

## Directory Roles
- `raw/articles/`：网页、博客、文档摘录
- `raw/papers/`：论文、PDF 提取内容
- `raw/transcripts/`：会议记录、视频/语音转写
- `raw/assets/`：图片、截图、附件
- `entities/`：人、组织、产品、项目、模型
- `concepts/`：概念、架构、方法论、机制
- `comparisons/`：横向对比
- `queries/`：值得沉淀的问题与答案；历史上也保留部分 plan / closeout / validation case，未来新页面应优先按语义路由到更准确的位置
- `operations/`：健康检查方法、runbook、维护契约和 recurring governance surface；不保存某个作者实例今天的健康状态，也不放一次性项目计划或 raw review artifact
- `_meta/`：导航与维护文档
- `_meta/scripts/`：wiki 只读检查、审计和维护脚本

## Lifecycle and Review Retention

- `draft` 在来源、适用范围和结论足以支持复用后可转为 `stable`；一次真实使用本身不证明稳定。结束或被替代的历史决策可标为 `closed`，正文区分成功、失败、未证明或被替代，不把生命周期当成有效性结论。
- `queries/` 中只有公开可复用的历史决策或 superseded 方法可以保留；个人计划、一次性审查、会话输出和任务 closeout 不进入工作树。合格的公开变更由 Git 历史追溯，私有材料不能借归档写入 Git。仍有长期检索价值的历史页可保留，但首屏应指向现行规则，旧计划不再作为当前任务或授权。
- 退役页面前检查正式页、索引和 raw 引用，修复活动入口；有不可变快照或外部兼容需要时保留最小历史说明，不能为清理而制造断链。需要依赖 Git 恢复的公开证据须有可回读的提交与路径，仅本机归档 ref 不算公开来源。
- 普通低风险维护默认闭环是：按需保存合格 raw 或引用现有来源 → 修改正式页与受影响入口 → 同步 index/log → health、标签、公开内容检查和 `git diff --check`。只检查与改动相关的语义路径；不为普通修改新增 spec、审查台账或验证项目。独立 AI 审查仅在 Schema/治理规则、跨层推广、高风险事实、多来源冲突或确定性验证不足时触发，其发现须回到原文核实，PASS 仅覆盖实际审查范围。
- 审查 prompt、会话输出、前后 hash sidecar、个人执行计划和任务 closeout 不进入公开知识库；稳定发现合并到其正式 owner，提交历史承担变更追踪。
- `log.md` 每项只记录公开仓库的 durable delta、证据边界和验证结果，避免复制完整审查过程或个人环境状态。

## Update Policy
当新信息与旧信息不一致时，先区分范围、版本和时间，再修改：
1. 范围不同或仅时间推进：保留各自适用范围，不制造矛盾或拼成同一时点的结论。
2. 同一范围存在未解冲突：记录双方来源与日期，按 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 处理，不作为当前确定结论；具体摄取分类见 [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)。
3. 已证实错误或明确替代：修正现行正文和相关快捷入口，必要时简述更正依据；公开历史由 Git 或确有复用价值的历史段落保留，不让失效指令与当前规则并列生效。涉及整页替代时按既有 `supersedes` 约定处理。
4. 优先修正原主维护页。只有冲突本身有独立复用价值时才新建 comparison / query；文档整理不顺带改变项目业务规则、权限或运行状态。

## Core navigation
保持以下入口可用；任务导航和项目规则决定后续读取范围，不要求每次全读：
- `index.md`
- `log.md`
- `concepts/hermes-knowledge-architecture.md`
- `concepts/wiki-ingestion-workflow.md`

## Operating Rule
回答知识相关问题时，优先顺序为：
1. 按 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 执行 freshness-qualified wiki first，检查关系出入边。
2. 当前/实时事实先核对当前项目、live tool 或权威来源；历史问题先限定时间范围。
3. 有长期价值、适合公开且有写入授权时才回写 Wiki；不把 Wiki 维护授权外推为项目安装、部署、数据库变更或发布授权。历史计划与过去的切换许可不自动授权新动作；当前会话已明确授权的同一动作无需重复确认。

