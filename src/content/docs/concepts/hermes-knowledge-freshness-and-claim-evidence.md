---
title: Wiki 知识新鲜度与断言证据绑定
created: 2026-08-26
updated: 2026-10-29
type: concept
tags:
  - agent
  - knowledge-base
  - memory
  - verification
  - architecture
  - workflow
sources:
  - raw/articles/langchain-self-correcting-memory-openwiki-2026-08-26.md
  - raw/articles/langchain-agent-memory-openwiki-graphs-2026-10-28.md
  - repository:_meta/catalog.json
  - concepts/hermes-knowledge-architecture.md
  - concepts/hermes-memory-skills-wiki-boundaries.md
status: stable
description: 定义 AI Agent Wiki 的知识新鲜度、断言级来源绑定，以及基于 locate/expand 的两步证据导航与编译记忆适用边界。
aliases:
  - knowledge freshness
  - claim evidence
  - stale knowledge
  - agent-knowledge-freshness-and-claim-evidence
volatility: medium
review_by: 2027-01-24
---

# Wiki 知识新鲜度与断言证据绑定

## Summary

外部来源沉淀到 AI Agent Wiki 后，不应只记录“页面来自哪里”，还应尽可能让重要结论回到具体来源，并区分来源事实、AI Agent 推论和待确认内容。OpenWiki（[langchain-self-correcting-memory-openwiki-2026-08-26](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/langchain-self-correcting-memory-openwiki-2026-08-26.md)、`langchain-agent-memory-openwiki-graphs-2026-10-28`）提供了两个核心启发：其一，知识维护应将重要结论绑定到具体证据并在来源行变化时触发复查；其二，编译后的知识页负责领域关系综合，而显式类型化边负责稳定证据导航。AI Agent 采用现有的 `sources`、正文具体来源链接、规范 `## Relations`、可选 `volatility/verified_at/review_by`、`updated` 和 `[推论]` 表达这两层职责，不照搬 OpenWiki 的 claims 状态机或图运行时。

## 可迁移原则

1. **结论与来源相邻**：数字、当前外部行为、规范性规则、争议结论和多来源综合结论，应在同段或相邻句放具体 Wiki/raw/官方来源；普通背景段落保留页面级 `sources` 即可。
2. **证据与推论分离**：来源事实、AI Agent 本地推导和待确认内容必须明确区分；本地推导使用已有的 `[推论]` 标记。
3. **变化促成复查**：来源或项目证据变化后，不应静默继续把旧内容写成当前规则；直接检查受影响段落，无法确认时保留限制说明。
4. **按需局部维护**：优先修正被检索、引用或编辑的相关段落，避免没有收益的全库重写。
5. **不伪造验证状态**：AI Agent 不采用 OpenWiki 的 `verified`、`stale`、`unverified`、`inferred` 正文状态枚举；页面生命周期仍由 `status` 表达，易变事实使用可选新鲜度字段；GREEN/YELLOW/RED 只作为检索时资格，不写入 status。

## 知识综合与证据导航

编译后的知识页负责解释概念与跨源关系（综合层）；证据导航负责沿稳定路径回到支撑结论的具体材料（取证层），两者不能互相替代。详见 `langchain-agent-memory-openwiki-graphs-2026-10-28`。

### 来源实验的机制与诊断信号

- **编译 Wiki 的收益与盲区**：在 111 份合成保险文档（972 条受控事实、含版本修订与交叉引用冲突）的基准中，跨文档关联问题的准确率从纯关键词搜索的 `0.10` 提升至编译 Wiki 的 `0.52`（约 5 倍），单次正确回答的模型成本从约 `$0.55` 降至 `$0.19`；但在单段落简单查询上，搜索与 Wiki 准确率相当（`0.84` vs `0.83`），且 Wiki 延迟更高（`9s` vs `12s`）。同时，Wiki 代理在跨文档问题上的**引用一致性**（三次重复运行引用证据集合的平均成对 Jaccard 相似度）从简单查询的 `0.74` 骤降至 `0.25`——当引用仅以自由文本散落时，代理每次仍需重新搜索证据路径，而在多源冲突或条款修订场景中，支撑证据漂移会直接改变最终结论。
- **轻量证据图与两步导航（`locate` → `expand`）**：作者以确定性分段的段落（paragraph）为原子证据单元，将已有文本引用与文档显式交叉引用物化为类型化边（`cites`、`refers_to`、`supersedes`、`amends`、`attaches_to` 及其逆边），无需额外模型调用。代理通过两个原语导航：`locate` 匹配问题词与标题、小节、知识页及断言以定位起点；`expand` 打开节点并遍历类型化边（单一路径时自动沿边推进，遇到多路分支时停下由代理判断走向）。相比单独使用 Wiki，附加证据图后报告准确率再升 `27%`、引用一致性翻倍、中位回答耗时降 `40%`、单次正确回答模型成本降 `58%`。
- **证据与成本边界**：上述数据来自厂商合成保险语料实验，不是生产基准或对所有 RAG 形态的比较；引用一致性衡量重复取证的稳定性与可审计性，不等于事实正确性；确定性构图不校验上游模型生成引用的真伪；回答成本不含离线编译（111 份文档 `$4.15`）与增量更新（每篇约 `$0.09`）。

### 在本 Wiki 中的可迁移映射

- **[推论] 按问题复杂度分流（编译记忆的投资回报边界）**：编译 Wiki 与关系遍历应集中用于**高频跨源综合、依赖追踪、版本替代与规则冲突裁决**；单源简单查找或实时状态核验直接走窄词搜索、目标文件或实时工具，避免为简单查询增加多跳遍历延迟。
- **[推论] 用现有原语实现 `locate` → `expand` 两步证据导航**：
  1. `locate`（定位起点）：先用 `_meta/catalog.json`（匹配 `title`、`description`、`aliases`、`tags`）与窄词搜索定位主维护页及小节标题，不把整库或全量目录塞入上下文。
  2. `expand`（沿类型化边展开）：跨源问题按显式 `## Relations`（区分 `depends_on` 前置依赖、`refines` 上下位细化、`supersedes` 替代、`conflicts_with` 冲突与 `related` 横向参考）及 `wiki_reverse_lookup.py --page` 入边展开；单链依赖可沿出边检查；`A supersedes B` 表示 A 替代 B，从旧页 B 查找现行页须沿该关系入边到 A，并检查 A 的适用范围与 Freshness Gate，不能沿出边退回旧页，遇到多分支或 `conflicts_with` 时停下核对适用范围、版本与生效日期，再沿正文相邻来源链接（`[[raw-...]]` 或局部 `[!volatile]` block）回读具体证据段落。
- **[推论] 区分页面关系图与断言证据链**：页面级 `## Relations` 只记录正式知识页之间的语义边，不能把 `raw/` 原始材料塞入 `depends_on` 或 `refines`；多来源综合页应在具体结论或小节旁显式写出对应 `[[raw-...]]` 或 `docs:` 来源，避免只在 frontmatter `sources` 汇总导致取证路径退化为全库重搜。检索门禁与评测指标分别见 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 与 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)。
- **[推论] 跨记忆层的证据锚定边界**：原文提出未来可用“断言 + 类型化证据边 + 变更检测”锚定语义记忆（事实）、情景记忆（事件）与程序记忆（规程）；在本知识库中，三者仍严格按 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 分层治理，不将事件日志或未经验证的单次轨迹自动晋升为长期规则。

### 本仓库跨源检索离线评测方案（待执行）

**验证状态：NOT_RUN。** 当前仓库未提供与此前数值对应的可执行评测脚本、治理前后固定快照、逐题结果和运行记录，因此不再将此前报告的改善数值作为已验证结论。下列双入口问题集仅作为待验证方案；外部文章实验不能代替本仓库实测。

#### 1. 评测口径与证据边界

- 固定治理前后 commit 或内容哈希清单，提交机器可读的入口、黄金正式页和黄金原始来源集合；黄金集须独立复核，不按治理后遍历结果倒推。
- 对照无类型关系展开与类型化展开时，统一跳数、边方向、来源提取范围、停止条件和候选预算；若分别测单向与双向遍历，逐项标明。多分支与冲突不能默认为全部适用。
- 对每个入口保留完整可达正式页及来源集合，不先与黄金集求交再计算 Jaccard。**跨入口可达证据重合度**是图结构指标，不是模型回答的引用一致性；两端皆空时标记 N/A，并报告空结果数，不能记为完全一致。
- 黄金证据召回率可用可达集合与黄金集的交集计算；另报精确率，防止靠扩大全库候选虚增召回。空黄金集的指标标记 N/A。
- **引用一致性**必须对同一问题重复运行真实回答流程，保存实际引用的段落 ID，再计算完整引用集合的平均成对 Jaccard；同时独立评估引用正确性和答案正确性。
- 上下文开销应统计实际加载的全部跳数、正式页与原始证据；仅统计一跳页面字节数时只能称为一跳体积代理，不能推导完整问答的 Token、延迟或成本节省。
- 发布结论前提交可执行命令、环境版本、逐题候选/来源清单、汇总算法与结果文件；结构健康检查不能替代本评测。

#### 2. 8 组双入口候选问题（黄金集待独立复核）

| 编号与跨源问题域 | 双入口种子页 | 拟用黄金正式页与原始证据 |
| --- | --- | --- |
| **Q1：上下文工程 × 状态契约 × 专用模型压缩** | [agent-context-engineering](/concepts/agent-context-engineering) ↔ [agent-context-history-state-and-bounded-processing](/concepts/agent-context-history-state-and-bounded-processing) | 正式页：上述两页 + [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)<br>原始源：[arxiv-2608-26263-skill-state](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/papers/arxiv-2608-26263-skill-state.md), [langchain-scaledown-deep-agents-2026-10-13](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/langchain-scaledown-deep-agents-2026-10-13.md), [machinelearningmastery-effective-context-engineering-ai-agents-2026-04-28](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/machinelearningmastery-effective-context-engineering-ai-agents-2026-04-28.md)  |
| **Q2：知识新鲜度 × 两步证据导航 × 旧计划替代** | [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence) ↔ [hermes-wiki-knowledge-freshness-improvement-plan](/queries/hermes-wiki-knowledge-freshness-improvement-plan) | 正式页：本页 + [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)<br>原始源：`langchain-agent-memory-openwiki-graphs-2026-10-28`, [langchain-self-correcting-memory-openwiki-2026-08-26](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/langchain-self-correcting-memory-openwiki-2026-08-26.md)  |
| **Q3：生产级评测 × 统计功效 × Rubric 校准 × 成本基线** | [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) ↔ [repeated-measures-statistical-power-for-ai-evaluation](/concepts/repeated-measures-statistical-power-for-ai-evaluation) | 正式页：上述两页 + [agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration), [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines), [agent-self-validation-loops](/concepts/agent-self-validation-loops)<br>原始源：[towardsdatascience-statistical-power-more-problems-2026-08-04](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/towardsdatascience-statistical-power-more-problems-2026-08-04.md), [langchain-similarweb-long-form-agent-report-evaluation-2026-07-29](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/langchain-similarweb-long-form-agent-report-evaluation-2026-07-29.md), [kdnuggets-llm-latency-inference-cost-2026-07-18](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/kdnuggets-llm-latency-inference-cost-2026-07-18.md)  |
| **Q4：形式化工作流 × 分层代码审查 × Python 工程清单** | [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles) ↔ [hermes-python-engineering-capability-checklist](/concepts/hermes-python-engineering-capability-checklist) | 正式页：上述两页 + [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [agent-self-validation-loops](/concepts/agent-self-validation-loops)<br>原始源：[claude-dev-solving-code-review-at-anthropic-2026-10-15](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/claude-dev-solving-code-review-at-anthropic-2026-10-15.md), [aymannadeem-plan-mode-is-dead-2026-09-24](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/aymannadeem-plan-mode-is-dead-2026-09-24.md), [realpython-python-performance-optimization-guide-2026-10-21](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/realpython-python-performance-optimization-guide-2026-10-21.md)  |
| **Q5：子代理编排 × 生产拓扑取舍 × 资源路由与证据门** | [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns) ↔ [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs) | 正式页：上述两页 + [agent-resource-optimization](/concepts/agent-resource-optimization), [agent-research-evidence-gate](/concepts/agent-research-evidence-gate), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)<br>原始源：[philschmid-subagent-patterns-2026-05-05](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/philschmid-subagent-patterns-2026-05-05.md), [alphasignal-agent-orchestration-patterns-2026-05-05](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/alphasignal-agent-orchestration-patterns-2026-05-05.md), [langchain-model-router-in-harness-2026-10-01](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/langchain-model-router-in-harness-2026-10-01.md)  |
| **Q6：静态工具上下文 × 工具选择架构 × 类型化边界** | [agent-context-prompt-tools-and-examples](/concepts/agent-context-prompt-tools-and-examples) ↔ [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) | 正式页：上述两页 + [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture), [agent-context-engineering](/concepts/agent-context-engineering)<br>原始源：[microsoft-developer-ai-coding-agents-use-technology-2026-05-27](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/microsoft-developer-ai-coding-agents-use-technology-2026-05-27.md), [machinelearningmastery-tool-selection-ai-agents-2026-07-06](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/machinelearningmastery-tool-selection-ai-agents-2026-07-06.md), [langchain-paid-media-agent-2026-09-13](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/langchain-paid-media-agent-2026-09-13.md)  |
| **Q7：经验固化闭环 × Skill 可逆状态机 × 知识演化元技能** | [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) ↔ [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state) | 正式页：上述两页 + [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)<br>原始源：[arxiv-2608-27454-wikiskill](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/papers/arxiv-2608-27454-wikiskill.md), [microsoft-research-evolib-evolving-knowledge-2026-07-30](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/microsoft-research-evolib-evolving-knowledge-2026-07-30.md), [xudong-han-self-evolving-agent-alloomi-2026-08-13](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/xudong-han-self-evolving-agent-alloomi-2026-08-13.md)  |
| **Q8：文档解析结构保真 × 文档失真风险 × 确定性计算边界** | [document-parsing-structural-fidelity](/concepts/document-parsing-structural-fidelity) ↔ [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk) | 正式页：上述两页 + [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)<br>原始源：[llamaindex-markdown-is-all-you-need-2026-10-08](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/llamaindex-markdown-is-all-you-need-2026-10-08.md), [venturebeat-frontier-ai-document-fidelity-risk-2026-05-13](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/venturebeat-frontier-ai-document-fidelity-risk-2026-05-13.md), [motherduck-jev-for-analytics-2026-09-29](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/motherduck-jev-for-analytics-2026-09-29.md)  |

#### 3. 采用边界

类型化关系与正文来源锚定提供可审计导航路径，但其对召回、引用稳定性和成本的改善仍是待验证假设。先用上述固定问题集回归，不能以“链接更多”或结构检查通过宣称任务质量提升。

## AI Agent 适用边界

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

## Relations

- refines: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)
- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- supersedes: [hermes-wiki-knowledge-freshness-improvement-plan](/queries/hermes-wiki-knowledge-freshness-improvement-plan)
- related: [hermes-wiki-lint-and-health-check-standards](/concepts/hermes-wiki-lint-and-health-check-standards), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow), [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path), [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework), [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)

## Related

- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)：补充知识对象和证据路由的维护维度。
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)：补充 Wiki 知识如何保持新鲜，而非改变层边界。
- [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)：现行写作规范落点。
- [hermes-wiki-lint-and-health-check-standards](/concepts/hermes-wiki-lint-and-health-check-standards)：现行验证与健康检查落点。
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)：现行入库流程落点。
- [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)：现行检索与 Freshness Gate 落点。
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)：补充跨源问答中的引用一致性（Citation Consistency）与编译成本摊销评估维度。
- [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)：区分跨源证据导航的待执行拓扑评测与真实回答引用一致性。

