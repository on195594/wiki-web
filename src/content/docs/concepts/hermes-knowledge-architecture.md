---
title: Human and AI Agent Shared Knowledge Architecture
created: 2026-04-16
updated: 2026-11-13
type: concept
tags:
  - agent
  - knowledge-base
  - mcp
  - workflow
  - configuration
sources:
  - raw/articles/towardsdatascience-persistent-knowledge-layer-2026-08-16.md
  - raw/articles/machinelearningmastery-llm-spoc-extraction-2026-09-29.md
  - raw/articles/anthropic-components-of-agent-memory-2026-11-07.md
  - docs:https://arxiv.org/abs/2504.13171
  - docs:https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf
status: stable
description: 定义 AI Agent 长期知识系统的总体架构、层间关系、Wiki 与原始搜索的适用边界及分层规则导航。
aliases:
  - knowledge-architecture
  - hermes-wiki-architecture
  - agent-knowledge-architecture
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Human and AI Agent Shared Knowledge Architecture

## Summary
本页定义人类与 AI Agent 共用的知识架构：人类负责阅读、判断和编辑，Agent 在授权范围内检索、综合与维护；二者共享同一份正式知识与证据。
其中，`wiki` 是正式知识资产层；`memory`、`skills`、`sessions`、`tools/MCP` 分别承担不同职责，共同组成可持续积累、可检索、可回写的知识闭环。Wiki 是按需构建的知识表示，不替代原始搜索；是否值得编译，应按跨源综合需求与未来复用价值判断，证据与限制见下文。

## Architecture at a glance
可以把接入 Wiki 的系统拆成两层；以下是职责模型，不要求每个客户端具备所有能力：

1. AI Agent 运行时知识栈
2. Wiki 文件系统结构

人类通过编辑器和链接浏览 Wiki；AI Agent 通过受支持的文件或检索工具按需读取，在获授权时维护。两条路径共享正文、来源和 Git 历史，不维护人用与机用两套事实。

## Continue by question

本页维护总体结构和层间关系；具体规则按问题进入对应页面：

- 内容属于 memory、skill、wiki 还是 session：[hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- 一个需求如何组合内容、方法、触发、外部能力和运行状态：[hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- 哪些材料进入当前上下文、如何压缩历史、长任务状态如何推进：[hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- Wiki 结论能否用于当前回答、何时必须实时核验：[hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- 内容能否进入公共 Wiki：`SCHEMA.md`

各页可以保留理解当前主题所需的短定义和安全边界，但详细规则只在上述对应页面维护。

## Layer 1: AI Agent runtime knowledge stack
### 1. memory
- 保存短小、稳定、长期有效的用户偏好与环境事实
- 适合：沟通偏好、固定路径约定、长期工作规则
- 不适合：长文档、研究材料、一次性任务结果

### 2. skills
- 保存可复用流程与操作方法
- 适合：配置修复流程、下载流程、审计流程、调试流程
- 本质上是“程序化知识”而不是“内容知识”

### 3. 会话历史 / 历史检索
- 若宿主支持，保存并按需检索历史会话与阶段性上下文；不依赖名为 `session_search` 的工具
- 适合：回忆上次做过什么、查找某次排障经过
- 不应作为正式知识库替代品

### 4. wiki
- 正式知识资产层
- 保存结构化、可维护、可交叉链接的 Markdown 页面
- 是稳定知识问题的优先参考层；当前项目证据、适用来源和实时核验要求仍优先

### 5. tools / MCP
- 负责把外部系统、检索能力、写回能力暴露给 AI Agent
- 当知识库继续扩展时，可把 wiki search/read/write 进一步工具化
- 这层负责“连接”，不是知识本体

## Layer 2: Wiki filesystem architecture
### 1. Navigation layer
- `[[index]]`：知识目录与入口
- `[[log]]`：知识库变更历史
- `SCHEMA.md`：结构规则、标签体系、页面规范

### 2. Raw source layer
- `raw/articles/`
- `raw/papers/`
- `raw/transcripts/`
- `raw/assets/`

这一层只保存原始材料，原则上不直接改写。

### 3. Compiled knowledge layer
- `entities/`：实体页，例如产品、组织、模型、项目
- `concepts/`：概念页，例如架构、方法论、机制
- `comparisons/`：横向比较
- `queries/`：值得长期保留的问题与答案
- `operations/`：供人类与 Agent 共同使用的操作指南、runbook 与维护契约

这一层才是知识沉淀的主战场。

## Wiki is a selective representation, not a replacement for search

Anthropic 的 [anthropic-components-of-agent-memory-2026-11-07](https://github.com/on195594/wiki/blob/e8407157b061dc6eb64a54385558e1255061c12c/raw/articles/anthropic-components-of-agent-memory-2026-11-07.md)（“Dreaming can build new memory representations”）把 transcript、memory notes、Wiki 等知识表示和默认注入上下文区分为层级。这是信息加工与可见性的划分，不与本地 memory、skill、Wiki 载体一一对应；其在线记录与离线维护分工由 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) 维护。

该来源为“何时值得编译成 Wiki”提供了有边界的第一方实验结果：

- **Wiki 与搜索互补**：Stainless 约 35 万份文件的语料上，25 道问题按评分标准计分，仅 Wiki 的最佳得分为 48%，仅搜索为 53%；随着 Wiki 构建增加，Wiki＋搜索从 54% 升至 61%，每题约节省 20,000 tokens。仅 Wiki 不优于搜索，不能把这组结果解释成应取消原始检索。
- **跨文档综合更可能受益**：另一并购任务的 24 道问题中，多数需要跨文档；在需要跨文档综合、判断或运算的相关题项上，Wiki 得分为 87%，仅搜索为 73%。这些数字不是所有任务的平均效果。
- **单文档查找未必受益，且存在“博尔赫斯地图陷阱”（Borges Map Trap）**：某个 LAB 任务的多数评分点能在单一文档中检索，Wiki 无明确增益；另一任务的 10 份源文档（`115 KB`）被编译为 68 页 Wiki、255 条链接（`203 KB`，体积膨胀至原始语料的 $\rho_{\text{comp}} = |W| / |D| = 1.77\times$），组织形式增加了，却像博尔赫斯《论科学的精确性》中与帝国等大的地图一样没有形成有效抽象。在 *Pokémon Red* 10,000 步长程测试中，`Sonnet 3.7` 无差别写入 `413` 个文件（`977,930` 字符、`225` 个目录）仅获 `1` 枚徽章，并在第 10,000 步附近连续耗费 `17` 步整理目录而未执行任何游戏动作；而具备显著性判断（Salience Judgment）的 `Fable 5` 仅维护 `10` 个文件（`43,406` 字符）即获 `4` 枚徽章。来源只比较两个模型各一次运行，并非控制模型能力后的记忆策略消融，不能将徽章差异单独归因于文件数量。

### 知识编译的摊销损益模型与离线计算（Sleep-Time Compute）理论基础

从计算经济学角度看，将原始语料编译为持久 Wiki 层本质上是**用离线/入库期的写放大（Write Amplification）换取查询期的多轮推理摊销**。这一机制对应 Kevin Lin、Charlie Snell 等（2025，Letta & UC Berkeley，[*Sleep-time Compute: Beyond Inference Scaling at Test-time*，arXiv:2504.13171](https://arxiv.org/abs/2504.13171)）提出的**离线重组织计算（Sleep-time Compute）**：在交互间隙预先整理上下文与知识表示，可在保持同等准确率下将测试期推理开销降低约 $5\times$（在多问题共享同一上下文的 Multi-Query 场景下将单次查询均摊成本降低 $2.5\times$），且收益与未来查询的可预测性正相关。

结合 [towardsdatascience-persistent-knowledge-layer-2026-08-16](https://github.com/on195594/wiki/blob/e8407157b061dc6eb64a54385558e1255061c12c/raw/articles/towardsdatascience-persistent-knowledge-layer-2026-08-16.md) 的 Token 损益方程，设语料含 $D$ 篇文档（均长 $T_{\text{doc}}$ tokens）、编译写放大倍数为 $M_{\text{write}}$，单次纯检索 RAG 消耗 $T_{\text{rag}}$ tokens，而混合 Wiki 检索仅消耗 $T_{\text{wiki}}$ tokens 并以比例 $v \in [0, 1]$ 触发原始证据核验 $T_{\text{verify}}$，则 `[推论]` 在忽略维护成本、固定语料且各类 token 等权的简化模型中，累计 $Q$ 次查询的 token 量与盈亏平衡查询量 $Q^*$ 为（不能直接视为货币成本或延迟）：
$$C_{\text{RAG}}(Q) = Q \cdot T_{\text{rag}}, \qquad C_{\text{Hybrid}}(Q) = \underbrace{D \cdot T_{\text{doc}} \cdot M_{\text{write}}}_{C_{\text{compile}}} + Q \cdot \bigl(T_{\text{wiki}} + v \cdot T_{\text{verify}}\bigr)$$
$$Q^* = \frac{D \cdot T_{\text{doc}} \cdot M_{\text{write}}}{T_{\text{rag}} - (T_{\text{wiki}} + v \cdot T_{\text{verify}})} \quad \Bigl(\text{前提：}\rho_{\text{ctx}} = \frac{T_{\text{wiki}} + v \cdot T_{\text{verify}}}{T_{\text{rag}}} < 1\Bigr)$$
（在原文示例中，$D=50, T_{\text{doc}}=6{,}000, M_{\text{write}}=1.67 \Rightarrow C_{\text{compile}}=501{,}000$ tokens，$T_{\text{rag}}=6{,}000$ vs. $T_{\text{wiki}}+v T_{\text{verify}}=1{,}725$，约在 $Q^* \approx 117$ 次查询处收回编译成本；实测部署中概念页平均上下文约为 `500` tokens，较原始证据块 `1,750` tokens 压缩约 `3.5x`。）

据此形成的使用判断是：**[推论] 重复出现、可预测性高且需要跨来源综合的问题更值得评估编译；是否达到 $Q > Q^*$ 且 $\rho_{\text{ctx}} < 1$，仍须估计实际复用次数与成本，不能只由问题类型推断；一次性的精确定位问题优先直接检索；需要原始措辞、合同逐字条款（[anthropic-components-of-agent-memory-2026-11-07](https://github.com/on195594/wiki/blob/e8407157b061dc6eb64a54385558e1255061c12c/raw/articles/anthropic-components-of-agent-memory-2026-11-07.md) 中多 Agent 摘要共享合同表曾导致得分从 `57/57` 跌至 `41/57`，改为按合同分立页面并逐字引述条款后才恢复 `100%`）、最新状态或补足编译遗漏时，仍回到来源。** Wiki 的价值应看检索、判断或执行成本是否下降，而不是页面和链接是否增加；结构与自动化从真实需求生长，见 [progressive-knowledge-system-growth](/concepts/progressive-knowledge-system-growth)。

上述结果是来源文章的特定任务报告，已核对正文与提取图注，未独立复现，也未据此设定本地规模、收益或构建预算阈值；本页原有来源的核验日期不变。

## Conflict-aware knowledge primitives and temporal scoping

知识层不能只保存整理后的结论，还必须表达结论的适用边界、来源冲突和当前未知项。重要结论、数字、当前外部行为和规范性规则应尽量在同段或相邻句回到具体 Wiki、raw 或官方来源；页面级 `sources` 仍承担正式 provenance。否则，一条写入错误的长期结论会持续污染后续检索与回答。

持久知识层来源文章 [towardsdatascience-persistent-knowledge-layer-2026-08-16](https://github.com/on195594/wiki/blob/e8407157b061dc6eb64a54385558e1255061c12c/raw/articles/towardsdatascience-persistent-knowledge-layer-2026-08-16.md) 给出三类可复用的知识对象：

- **Decision**：保存规则或结论、适用范围、生效时间、替代关系、决策理由和原始来源。仅凭“文档更新”不能推断新规则适用于所有对象或历史时点。
- **Contradiction**：并列保存相互冲突的主张、各自来源与有效时间、责任方及未解决原因。冲突未被权威证据消解前，不按文档新旧或语义相似度自动选边。
- **Open Question**：显式记录因证据缺失、范围不清或冲突未决而无法回答的问题，以及形成结论仍需补充的证据。

由此得到的本地知识写入约束是：

- `[推论]` 最新来源不自动等于当前适用来源；必须同时检查对象范围、生效日期和替代关系。
- `[推论]` 来源或项目证据发生变化时，优先检查受影响段落；无法确认时保留限制，不把旧内容继续写成当前规则。`updated` 只表示文件最近编辑时间，不代表整页已经复核。
- `[推论]` 遇到无法确定性解决的来源冲突时，知识编译应 fail closed：保留冲突并停止生成确定性结论，而不是让模型自行调和。
- `[推论]` 模型可提出知识补丁，但持久化写入仍由可验证规则和明确授权控制；文章中的 Azure、Cosmos DB、向量或图存储仅是实现示例，不构成本地技术选型。

### 从文本抽取候选事实：结构约束与证据边界

**LLM 抽取的是候选事实，不是已经验证的知识。** MachineLearningMastery 的 SPOC 教程 [machinelearningmastery-llm-spoc-extraction-2026-09-29](https://github.com/on195594/wiki/blob/e8407157b061dc6eb64a54385558e1255061c12c/raw/articles/machinelearningmastery-llm-spoc-extraction-2026-09-29.md) 展示了“原始文本 → JSON 形式的主谓宾（SPO）→ 程序注入来源上下文（Context）→ 四元组存储”的入口。原文使用 Ollama 与 Llama 3.2、输出示例及 JSON 模式，并在后处理中检查主谓宾字段；来源标签由调用方提供，而不是让模型生成。可迁移的是职责拆分，不是某个模型或存储产品。

需要区分三个层次：
- **格式可解析**：JSON 模式与字段后处理约束输出形状；`[推论]` 不能据此证明语义正确、抽取完整或原文确实支持该关系。
- **来源可识别**：示例中的 `Wikipedia_Alan_Turing` 标识来源；从原文代码可见，该标签没有记录支撑句、文档版本或有效时间，也没有实施真假验证。`[推论]` 来源标签不能自动升级为完整证据链。
- **事实可采纳**：`[推论]` 用于正式知识编译时，候选应能定位到支撑原文，按需记录来源版本及事实适用时间，并经语义核对与冲突检查后再采纳；未解决冲突沿用本页的 fail-closed 边界。具体 Wiki 入库仍由 [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow) 维护。

原文示例从两段文本（报告为 1244 字符）抽取约 11 条记录并放入内存列表；它没有提供准确率、召回率或下游幻觉率评测。`QuadStore` 的列表去重与字段匹配也不是多跳检索或冲突裁决验证。因此，这些结果仅证明作者展示了抽取和装载路径，不能作为“可靠知识生成”或“消除幻觉”的证据。

`[推论]` 生产应用不宜照搬示例的宽松解析：缺少 `facts` 时取第一个列表、将字段值一律字符串化、异常返回空列表，都可能掩盖格式或运行失败。应检查候选形状与非空字段，并区分“成功但无候选”和“抽取失败”；不因兜底成功而跳过证据核对。本文不据此引入图数据库、自动写入或新的默认执行门禁；自动化仍应服从 [progressive-knowledge-system-growth](/concepts/progressive-knowledge-system-growth) 的真实需求原则。

### Retrieval routing and structural principles (Six RAG failure modes & hybrid fusion)

[towardsdatascience-persistent-knowledge-layer-2026-08-16](https://github.com/on195594/wiki/blob/e8407157b061dc6eb64a54385558e1255061c12c/raw/articles/towardsdatascience-persistent-knowledge-layer-2026-08-16.md) 通过 21 份财产险合成文档实证总结了纯查询期 RAG 会自信答错、而编译知识层必须拦截的**六类结构性失效模式**：
1. **局部范围替代（Scoped Supersession）**：如仅在 `Zone H3` 新业务将屋顶检查阈值从 20 年收紧至 15 年，纯检索极易丢失限定词并误推至全量保单；
2. **真实跨团队矛盾（Genuine Contradiction）**：理赔手册（标准覆盖 `≤ €5,000`）与批单目录（需付费附加险 `HS-TA-01`）同时有效却相互冲突，模型在“乐于助人”提示下会静默选边；
3. **术语漂移与概念碎片化（Terminology Drift）**：同一概念以 `Actual Cash Value / ACV / cash settlement basis / depreciated value` 出现，若入库时不加载现有 Wiki 别名表做实体消歧，实测 21 份文档会裂变出 `149` 个概念节点（相比人工整理的 `19` 个核心概念碎片化达 `~7.8x`）；
4. **生效日期错配（Effective-Date / `as_of` Scoping）**：出险日为 `2026-02-20` 的案件不适用 `2026-03-01` 才生效的新规，而向量余弦相似度完全不包含时间序；
5. **决策理由丢失（Rationale Loss）**：规则写在正式指南中，但“为何定在 15 年（强风带位移率高 `3.4x`）”的唯一解释留在低排名邮件线程里；
6. **多跳关系断裂（Multi-Hop Traversal）**：Top-$k$ 相似度只做扁平打分而不沿因果/引用链遍历。

为防御上述失效，检索路由应遵循四条形式化原则：
- `[推论]` **按问题性质路由并采用混合检索融合（Hybrid RRF）**：需要原始措辞、精确引注、条款编号（如 `HS-TA-01`）或新鲜度判断时读取 raw evidence；需要决策理由、跨来源综合或连续知识时读取 compiled knowledge。若现有检索已暴露精确词或语义召回缺口，可比较词法精确匹配（如 BM25）与向量语义检索的融合收益；这是候选实现，不表示本仓库已具备这些检索器，也不要求为普通查找新增它们。可通过 Gordon V. Cormack 等（2009，ACM SIGIR，[*Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods*](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)）的倒数排名融合公式合并候选：
  $$\text{RRF}(d) = \sum_{m:\,d \in L_m} \frac{1}{k_0 + r_m(d)}$$
  其中 $L_m$ 是实际参与的候选列表，$r_m(d)$ 从 1 开始；未返回文档的列表贡献 0。$k_0$ 是参数（论文采用 60），候选深度也需评估；catalog 仅在实际产出排名列表时参与融合。
- `[推论]` **时间与权限过滤必须在 Top-$k$ 排序之前执行（Pre-Ranking Temporal & Security Filter）**：先满足公开/权限边界，再根据证据确认的生效区间 $t_{\text{as\_of}} \in [t_{\text{eff}}(d), t_{\text{sup}}(d))$ 限定适用候选，再排名截断；这些区间记号不是必填字段，时间范围未知的授权候选应保留为待核验项并按 Freshness Gate 降级，而非静默排除；若先取 Top-$k$ 后过滤时间，失效或越权文档会挤占配额导致有效证据饥饿（Top-$k$ Starvation）。矛盾检查则是所有检索路径共用的输出门禁。
- `[推论]` **术语漂移通过 canonical page + `aliases` 归并**：入库与检索时通过唯一主维护页及其 `aliases` 对齐同义词，避免同一概念拆成多个互相遗漏的页面。
- `[推论]` **多跳解释采用 `locate` → `expand` 两步路径**：先定位主维护页，再沿 `refines`、`depends_on`、`conflicts_with`、`supersedes` 等显式类型化关系与正文具体来源边展开；top-k 相似度排序只能排名，不能替代关系链遍历，而单源简单查询也不必强制做多跳图展开（见 [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence)）。

## Cross-layer invariants

- 内容归属先按 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 判定；同一主题可以产生不同职责的资产，但不复制同一正文。
- 执行方法、触发方式和外部能力可按 [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist) 组合；skill、cron、MCP 与 wiki 不是互斥层。
- 上下文装配只决定本轮加载什么，不改变资产归属；长任务状态按 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules) 维护。
- Wiki 是正式知识层，但不是当前事实的豁免证据；回答前按 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 执行 Freshness Gate。
- raw 保存合格来源，sessions 保存历史轨迹；二者都不能自动替代编译后的正式知识。

## Retrieval and write-back loop
标准闭环如下：
1. 用户提出问题、链接、文档或主题
2. 按 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 查找并检查现有知识的当前适用性
3. 若 Wiki 不足，再读取合格 raw 或外部资料
4. 经提炼且符合公共准入时，更新对应正式页面
5. 同步更新 `[[index]]` 与 `[[log]]`
6. 后续问题继续复用经过范围与新鲜度检查的知识

摄取细节由 [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow) 维护；内容归属不在本页重复展开。

## Design constraints
- 不把长文档直接塞进 memory
- 不把聊天记录原样当知识库
- 不只堆 raw 而不生成正式页面
- 每个正式页面都应可检索、可链接、可增量维护
- 稳定知识先查适用 Wiki；必要时补证据，符合公开准入且获得写入授权才回写

## Integration points
### Obsidian
- 作为浏览与编辑前端
- 使用 wikilinks 和 frontmatter 直接消费 wiki 目录
- 与部署者选择的 `OBSIDIAN_VAULT_PATH=/path/to/wiki` 对齐；示例路径不表示已经部署

### MCP / native tools
- 当 wiki 规模扩大后，可把 search/read/write 封装成原生工具
- 让 AI Agent 不是“知道 wiki 在哪里”，而是“可以直接调用 wiki 能力”

## Relations
- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow), [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- related: [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence), [okf-for-hermes-wiki-governance-assessment](/queries/okf-for-hermes-wiki-governance-assessment), [agent-shared-wiki-index](/operations/agent-shared-wiki-index), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [progressive-knowledge-system-growth](/concepts/progressive-knowledge-system-growth), [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops)

