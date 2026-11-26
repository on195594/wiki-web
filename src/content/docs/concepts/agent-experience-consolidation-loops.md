---
title: Agent Experience Consolidation Loops
created: 2026-05-11
updated: 2026-11-26
type: concept
tags:
  - agent
  - memory
  - skills
  - knowledge-base
  - validation
  - workflow
  - multi-agent
  - closeout
sources:
  - raw/articles/venturebeat-anthropic-dreaming-ai-agents-2026-05-07.md
  - raw/articles/microsoft-research-evolib-evolving-knowledge-2026-07-30.md
  - raw/articles/xudong-han-self-evolving-agent-alloomi-2026-08-13.md
  - raw/articles/claude-warp-self-improving-agent-skills-2026-08-26.md
  - raw/papers/arxiv-2608-27454-wikiskill.md
  - raw/articles/anthropic-components-of-agent-memory-2026-11-07.md
  - docs:https://arxiv.org/abs/2504.13171
  - https://stanford.edu/~jlmcc/papers/McCMcNaughtonOReilly95.pdf
  - https://pubmed.ncbi.nlm.nih.gov/7624455/
  - https://pubmed.ncbi.nlm.nih.gov/10963596/
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC4588064/
  - https://arxiv.org/html/2611.21648v1
  - https://arxiv.org/abs/2602.16313
  - https://arxiv.org/html/2602.16313v1
  - https://arxiv.org/abs/2504.19413
  - https://arxiv.org/html/2502.12110v11
  - https://wal.sh/research/2026-agent-memory-systems/
  - https://arxiv.org/abs/2410.10813
  - https://arxiv.org/html/2410.10813v1
  - https://arxiv.org/html/2602.17692v2
  - https://arxiv.org/html/2608.28978v1
  - https://arxiv.org/abs/2606.24322
  - https://arxiv.org/html/2606.24322
  - https://arxiv.org/html/2609.25054v1
  - https://arxiv.org/abs/2610.30698
  - docs:https://www.langchain.com/blog/knowledge-factory
status: stable
description: 定义 Agent 经验固化闭环：从现场缺口捕获到离线对账与分层路由，结合互补学习系统（CLS）、Sleep-Time
  Compute、记忆再巩固、CL-Bench 1.0 及六项治理裁决矩阵。
volatility: medium
verified_at: 2026-11-25
review_by: 2027-03-25
aliases:
  - experience-consolidation-loop
  - agent-experience-consolidation
---

# Agent Experience Consolidation Loops

## Summary
Agent experience consolidation loop 是一种让 agent 从历史任务、失败、成功路径和用户纠正中提取可复用经验，并将其路由到 memory、skills、公共 Wiki 正式页、项目内状态、evaluator 或 runtime automation 的闭环。它的目标不是把更多历史塞进上下文，而是把经验转成可审计、可复用、可验证的未来任务支撑。

一句话原则：**不要把所有历史经验直接写进 memory 或公共 Wiki；先复盘，再按职责与公开边界路由。** 在线捕捉重要信息、离线依据原始观察对账与选择性维护的分工见下文。私有状态、会话记录、执行记录和一次性 closeout 仍留在原有私有或项目载体；只有适合公开且长期可复用的发现才编译进对应正式页面。

经验既可以成为执行者的任务技能，也可以成为构建者的支持设计原则，再落实为工具、状态或验证机制；两种用途需要分别评估，不能把文字交付等同于可靠执行。具体机制与证据范围见 [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills)。

## Source anchor
本页由 VentureBeat 对 Anthropic Claude Managed Agents `dreaming`、`outcomes` 与 multi-agent orchestration 的报道触发：[venturebeat-anthropic-dreaming-ai-agents-2026-05-07](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/venturebeat-anthropic-dreaming-ai-agents-2026-05-07.md)。

文章中的 `dreaming` 不是模型权重训练，而是让 agent 回顾过去 session 和 memory，写出 plain-text notes / playbooks 供未来 session 使用。

Microsoft Research 的 [microsoft-research-evolib-evolving-knowledge-2026-07-30](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/microsoft-research-evolib-evolving-knowledge-2026-07-30.md) 进一步区分了“经验归档”和“知识演化”：EvoLib 从成功尝试中提炼可复用技能、从失败中提炼反思见解，再通过 consolidation 与 dynamic weighting 持续更新知识库。

[xudong-han-self-evolving-agent-alloomi-2026-08-13](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/xudong-han-self-evolving-agent-alloomi-2026-08-13.md) 链接的 Alloomi 技术报告提供了权重后训练的对照案例。方案筛选任务轨迹用于 LoRA、跨任务回放和教师蒸馏，并用评测与回滚控制更新；CL-Bench 的具体基线分值、随机种子与时效核验块统一由子页 [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills) 单点维护。

[arxiv-2608-27454-wikiskill](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/papers/arxiv-2608-27454-wikiskill.md) 进一步用受控实验区分不可变执行轨迹、持续累积的 Wiki 知识和可回滚的 Skill 状态。它补充的关键不是另一种存储格式，而是：候选 Skill 可以回滚，支持后续搜索的证据、拒绝原因和结构化知识不能随之丢失。

Anthropic 发布的 Warp 案例 [claude-warp-self-improving-agent-skills-2026-08-26](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/claude-warp-self-improving-agent-skills-2026-08-26.md) 给出了这一闭环的文件化实现：内层 Base Skill 执行领域任务，人工反馈直接留在 PR/Issue 工作现场，外层 Improver Skill 定期比较 Agent 输出与人类响应，只提出小而可审查的 Skill diff；候选变更经过正常 PR 审核并由人决定是否合并，下一次执行才继承更新。它的增量价值是把反馈入口、候选生成和文件变更控制面连成一条简单链路，而不是证明无人监管的自动自改。该文没有准确率增量、误修改率、审核工时或长期回归数据，因此只能作为企业实践证据；本地映射仍应允许 add、delete、replace、merge、move、split、retire 或 keep，而非把 self-improvement 理解为规则累积。

[推论] 该机制补充的是知识单元进入持久层后的演化方式，不改变本页原有的 AI Agent 层间路由和审批边界。

## Online capture and offline consolidation

Anthropic 的第一方研究文章 [anthropic-components-of-agent-memory-2026-11-07](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/anthropic-components-of-agent-memory-2026-11-07.md)（“Memory notes”“Dreaming can correct memory”“Thinking backward, looking forward”）补充了闭环的时间分工：执行时记录显著观察，使其能及时用于后续步骤；离线 dreaming 再回看原始记录，纠正笔记、组织知识表示或调整后续会话的注入内容。这里的 memory 是跨会话知识的总称，不只指宿主的默认 memory 工具，也不涉及模型权重更新。

在认知与计算神经科学中，这一双阶段架构对应 James L. McClelland、Bruce L. McNaughton 与 Randall C. O'Reilly（1995, *Psychological Review*，[Why there are complementary learning systems in the hippocampus and neocortex](https://stanford.edu/~jlmcc/papers/McCMcNaughtonOReilly95.pdf)，[PubMed 7624455](https://pubmed.ncbi.nlm.nih.gov/7624455/)）提出的**互补学习系统（Complementary Learning Systems, CLS）**理论：海马体（Hippocampus）采用快速、稀疏、正交化的表征完成单次情景编码（Episodic Encoding），防止新旧经历互相覆盖；新皮层（Neocortex）则通过慢速、交错回放（Interleaved Replay）从多轮历史样本中逐步提取潜在语义结构与程序规律。若将单次特定轨迹直接以大步长写入共享知识层或模型参数，就会破坏既有结构（即灾难性干扰，见 [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills)）。可与离线阶段对照的计算研究是 Kevin Lin、Charlie Snell 等（2025，Letta & UC Berkeley，[*Sleep-time Compute: Beyond Inference Scaling at Test-time*，arXiv:2504.13171](https://arxiv.org/abs/2504.13171)）提出的**离线睡眠计算（Sleep-time Compute）**：在交互间隙预先整理上下文与知识表示，可在 Stateful GSM-Symbolic 与 Stateful AIME 上将达到同等准确率的测试期推理计算降至约五分之一（约 `5×` 削减），或在多问题共享上下文的 Multi-Query GSM-Symbolic 场景（单上下文 10 个查询、测试期 token 单价按睡眠期 10 倍建模）下将单次问题平均成本降低 `2.5×`（即降至约 40%），论文还观察到收益与**未来查询相对当前上下文的可预测性（Query Predictability）**相关；测试期节省不等于包含离线预计算的总成本同幅下降。

更进一步，已固化的长期记忆并非永久静态档案：Karim Nader、Glenn E. Schafe 与 Joseph E. LeDoux（2000，*Nature*，[*Fear memories require protein synthesis in the amygdala for reconsolidation after retrieval*](https://pubmed.ncbi.nlm.nih.gov/10963596/)；综述见 [Karim Nader, 2015, PMC4588064](https://pmc.ncbi.nlm.nih.gov/articles/PMC4588064/)）在大鼠恐惧条件化实验中发现，提取后的记忆可重新对蛋白质合成抑制敏感，支持**记忆再巩固（Memory Reconsolidation）**。这不等于所有检索都会使记忆失稳，也不证明再巩固必然纠正错误。**[推论]** 借此可为 AI Agent 设计三阶段维护流程：在线 `session / raw trajectory` 承担快速情景捕获职责；离线复盘、对账与门禁验证承担受查询可预测性约束的慢速交错整合职责；而在后续任务调用既有 `memory / skill / wiki` 遭遇执行报错、测试回归或用户纠正时，可触发受影响条目的证据复核与回归验证（对应 [hermes-active-surface-lifecycle-governance](/concepts/hermes-active-surface-lifecycle-governance) 的 `Rebase`），不能跳过离线对账与反例检验直接把单次轨迹写成全局常驻指令。

### Hypothesis testing and rule verification across model generations (CL-Bench 1.0)

[anthropic-components-of-agent-memory-2026-11-07](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/anthropic-components-of-agent-memory-2026-11-07.md)（“Memory can be a prediction about what the future will need”与“Steering Claude to write memory”，Figure 3 & Figure 5）将记忆定义为“对未来会话所需规律的预测”，并在 Continual Learning Bench（CL-Bench）1.0 数据库长程问答任务（30 道连续问题、每题独立新会话但共享持久化记忆目录）中对比了无状态基线（Stateless Baseline）与启用记忆目录（Memory Store）的均值奖励得分：

- **仅生成未验证猜测（`Sonnet 4.6`：`0.330` $\to$ `0.364`）**：模型在答错后仅将多个未经检验的错误原因猜测散落在不同文件中，且不到一半回合主动读取记忆目录；当显式在提示词中要求其“回答前先读取记忆文件并显式验证假设”后，得分由 `0.364` 提升约 76% 至 `0.641`；
- **确认标记与纠错记录（`Sonnet 5`：`0.306` $\to$ `0.610`；`Opus 4.7`：`0.383` $\to$ `0.700`）**：`Sonnet 5` 在无额外提示下约 `9/10` 回合主动读取记忆，并在判分器确认后标记已验证答案或写入纠错；`Opus 4.7` 进一步将分散笔记整合为单一参考文档，显式区分已核验事实（`checked`）与待确认事实（`unconfirmed`）；
- **原生跑通规则与陷阱闭环（`Opus 5`：`0.564` $\to$ `0.828`；`Sonnet 5.5`：`0.644` $\to$ `0.833`；`Opus 5.5`：`0.655` $\to$ `0.838`）**：原文观察到 `Opus 5` 的多数记忆条目同时包含**可复用规则、如何确认该规则成立的证据来源、历史问题答案以及已发现的陷阱警告（Trap Warnings）**；而当人为施加僵化预设规则（如强制“只允许记录失败 `record only failures`”）时，`Opus 5` 与 `Opus 4.7` 的记忆增益反而分别变化 `-0.234` 与 `-0.150`（`Sonnet 4.6` 微降 `-0.020`）。

这组第一方评测是特定基准上的模型表现，不能外推为所有任务的具体分值。其可迁移启发是：**[推论] 高质量的经验沉淀必须区分“未经验证的失败猜想”与“带验证依据和反例陷阱的已确认规则”；可对缺少检索或验证行为的模型评估显式流程提示的收益；对已能有效利用记忆的模型，也应通过任务评测决定约束粒度，避免未经验证地套用“只准记失败”等内容禁令。**

### Capture less, but preserve what cannot be cheaply recovered

宝可梦案例中，Sonnet 3.7 记录了大量每轮可从屏幕重新读取的状态，维护工作挤占了游戏行动；Fable 5 则主要保存策略、计划和自行发现的规律。原文比较的是不同模型各一次运行，不能独立证明“文件越少越好”或“删掉笔记就能提高成绩”。其可迁移启发是：**[推论] 优先保留未来有用、难以重新取得的知识，避免把易变且随时可读的状态重复归档。** 当前进度仍属于项目状态，不因此进入公共 Wiki。

### Reconcile notes against observations, not against another summary

在月见山案例中，错误笔记将地标方向写反；离线核对 transcript 后，模型纠正笔记并抵达目标城市，未纠正的运行则继续绕路。这支持“回看原始记录可以纠正部分错误”，不证明 dreaming 普遍解决了记忆漂移。反证方面，Eric Zou（2026-10，论文页眉标注 `14 Oct 2026`、arXiv 编号前缀为 `2611`，[*Can an LLM dream? Testing the overfitted brain hypothesis on an agent with text memory*，arXiv:2611.21648](https://arxiv.org/html/2611.21648v1)）在 Claude Opus 5.5 的 30 次运行（10 种条件 × 3 组历史，含不重写对照）中观察到：同一容量限制下，最终召回率在不重写时为 `14 ± 4%`，在干净记录上重写时为 `76 ± 5%`。模型通常能排除来自《白鲸》的无关文本，但当对话记录中混入似是而非的错误细节（Detail Corruption）时，离线重写会像人类“误导信息效应（Misinformation Effect）”一样将错误细节当作事实写入持久记忆（即便另一轮对话包含正确值），使对应问题正确率从 `75%` 降至 `40%`（40% 细节污染下整体召回降至 `60 ± 4%`）。该实验仅测试固定权重的单一模型（Claude Opus 5.5）与三组历史，不代表所有模型或经微调学习器的普遍表现。**[推论] 对账时必须区分环境/工具观察、模型当时的陈述和事后推断；日志里出现过的判断不自动成为事实。跨轮存在冲突值时，离线整合应保留冲突标记与出处指针，而不是由重写模型静默择一覆盖。** 变化后的当前状态仍需重新观察，不能只凭历史记录裁决。

### Organize for the task, and avoid shared-page write collisions

同一来源的“Dreaming can focus memory on a specific goal”报告：合同任务先由多个 Agent 并发维护共享条款表，发生覆盖且遗漏关键内容；改为每份合同独立页面、单一写入者并逐字引用条款后，依据 Wiki 生成的简报可满足的评分标准由 72% 提升至 100%。此外，“Dreaming can fill in gaps a session leaves behind”（Figure 15）记录了跨会话拓扑修复：单次会话写入时只看到局部上下文，导致首轮构建的 38 页 Wiki（225 条链接）中出现 6 个页面指向不存在页面 `escrow-agreement` 的 **9 条悬空死链**；第二轮离线 dreaming 扫描跨会话上下文后，将全部 9 条死链重指向已存在的规范页 `buyer-form-escrow-agreement`，并补齐 `index` 等 3 个页面（扩至 41 页、278 条链接）。这是特定任务的联合改动结果，不是通用成功率，也不能单独归因于反思。**[推论] 需要精确保留措辞时，应按证据单元组织页面、明确写入归属，再综合引用，不以压缩摘要替代关键原文；跨会话构建知识库时，应配合离线二阶段断链对账与 canonical 页面重指向（见 [hermes-knowledge-base-operating-flow](/concepts/hermes-knowledge-base-operating-flow) 与 [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence)）。** 这不要求每次知识维护都引入多 Agent。

### Maintain selectively; do not promote every reflection

原文指出：在线记笔记会分散执行注意力；离线整理的产物可能无法立即生效；持续核查全部记忆可能不实际，可考虑关注易变信息并按访问频率调整节奏。这是尚待验证的设计方向，不是已给定的调度公式。**[推论] 整理应允许纠正、合并、删除和下沉，只在未来收益明确时晋升；默认注入层不是所有反思的终点。** Wiki 与搜索的取舍见 [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)，注入预算见 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)；本节不新增自动写入、定时整理或宿主能力假设。

### 记忆写入策略与影响范围

五类记忆写入与状态演化范式——反应式 CRUD（[Mem0](https://arxiv.org/abs/2504.19413)）、自组织原地演化（[A-MEM](https://arxiv.org/html/2502.12110v11)）、双时态知识图谱（Zep/Graphiti）、主动离线巩固（Dreaming，[wal.sh 2026](https://wal.sh/research/2026-agent-memory-systems/)）与类型化溯源图（[Memory of Memory / P-Mem，arXiv:2609.25054](https://arxiv.org/html/2609.25054v1)）——的完整机制、实证数据与聚合键边界对照统一由 [agent-memory-architectures-and-evaluation-benchmarks](/comparisons/agent-memory-architectures-and-evaluation-benchmarks) 单点维护。

`[推论]` **离线巩固与状态写入护栏**：离线整理产物应以版本化快照或读时覆层（Overlay）形式输出并通过回归门禁后再生效，禁止直接原地覆写底层原始证据基底；对需要审计轨迹的场景，优先采用值导向双时态失效或类型化溯源图（保留被替代值与一等 `contested` 冲突态，见 [hermes-memory-governance-notes](/concepts/hermes-memory-governance-notes)），并严格隔离“状态覆写键”与“累加事件键”。

**全页来源核验说明（2026-11-25）**：本页引用的 6 份仓库 `raw/` 快照与全部外部公开文献（含 CLS、记忆再巩固、Sleep-time Compute、Can an LLM dream?、MemoryArena v2、Mem0、A-MEM v11、wal.sh、LongMemEval v2、Agentic Unlearning v2、Selective Forgetting、TMA-NM、P-Mem、Governance-State Corruption 与 LangChain Knowledge Factory）已于 `2026-11-25` 完成页面级在线核对，但均不表示本地独立代码复现，且第 6 节提及的 `2026-05-11 / v0.13.0` 仍保留为历史快照记录。

## Core pattern

### 1. Collect historical task evidence
经验固化从证据开始，而不是从抽象反思开始。

可用证据包括：
- completed sessions and transcripts
- tool outputs and test results
- user corrections
- repeated failures
- successful work paths
- project closeouts
- evaluator / reviewer notes
- runtime incidents and recovery evidence

这些证据可以来自 `session_search`、项目 closeout、logs、git diffs 或 test artifacts，但证据可用不等于有资格公开。私有或一次性材料只在原授权范围内参与复盘，不因“经验固化”而进入公共 Wiki；公开、长期可复用的结论应去标识化后编译进对应正式 owner，具有长期检索价值的公共历史决策可以保留。

#### 从重复任务中发现知识缺口

Harrison Chase 的 [《How to build a knowledge factory》](https://www.langchain.com/blog/knowledge-factory)（LangChain，2026-11-21，见 “The pieces of the factory” 与 “Putting it all together”）把反馈入口前移到执行现场：除了接收用户纠错，Agent 遇到缺失或疑似过时的知识时也可以当场上报，有线索时附上候选修正；知识维护者再结合原始来源、反馈和执行证据决定如何更新。

原文用营收报告举例：BigQuery 列名变更，更新取数指南；财务负责人要求使用新标题，更新写作 Skill；ARR 计算口径留在 Wiki，营收数字仍从 BigQuery 和 Salesforce 现取。这个例子区分了取数方法、写作规程、稳定业务口径和实时数据，便于判断一条反馈应该改哪里。

**[推论]** 可从一个重复任务做起：在原工作流记录「哪里卡住、依据在哪、哪份知识可能受影响」；核对后只修正对应的知识单元。营收报告是厂商文章里的说明性示例，原文未量化效果或维护成本；定时策展、自动写回和存储选型均不由此推出。

### 2. Detect recurring failures and successful workflows
复盘的重点不是“发生了什么”，而是识别可以改变未来行为的模式。

高价值信号：
- 同类错误反复发生
- 某个验证步骤显著降低返工
- 用户多次纠正同一边界
- 某个 workflow 在多个项目中复用
- 某个工具/模型/子 agent 组合稳定有效
- 某个经验如果不沉淀，未来很容易再次踩坑

低价值信号：
- 一次性的任务进展
- 临时文件路径
- 单个 PR / issue / commit 的完成状态
- 没有复用场景的新闻事实
- 没有验证过的产品宣传

### 3. Convert lessons into reusable artifacts
经验必须转成未来 agent 能调用的形式。

常见 artifact：
- **memory**：短小、稳定、每个 session 都值得看到的事实
- **skill**：可重复执行的方法、命令、坑点和验证步骤
- **wiki concept**：符合公共边界、跨工具或跨项目复用的长期知识模式
- **wiki query**：适合公开、带时间范围且有长期检索价值的问题答案或历史决策；一次性验证记录与任务 closeout 不因此进入公共 Wiki
- **project context / closeout**：某个 repo / workspace 的局部规则、状态和一次性收尾记录，留在项目载体或 Git 历史
- **evaluator rubric**：判断结果是否合格的标准
- **cron candidate report**：周期性提醒或只读复盘报告
- **runtime automation**：已验证、可回滚、低噪音的稳定流程

### 3a-3e. Deeper topics (split into sub-pages)

经验转成 artifact 之后的两类深入问题已拆为子页，本页保留主干闭环。

- [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills)：知识演化与元技能。结论：知识演化需要整合/加权/取代/拒绝，语义相似不等于可替代；外部知识复用与权重后训练互补，当前只采用可审计的外部闭环；任务技能（指导 Target 解题）与支持设计元技能（指导 Builder 搭环境）要分别评估，元技能证据有明确的预算与泛化边界。涉及 EvoLib、Alloomi、元技能论文时打开。
- [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state)：Skill 治理与可回滚状态。结论：Skill 是受治理的程序性资产，命中、应用、成功是不同指标；Skill 库应是带来源归因、反例与回滚检查的状态机；回滚候选 Skill 不删除证据与拒绝理由；跨模型/harness 迁移须复验；另含演化知识的评估边界。设计 Skill 生命周期、晋升与退役规则时打开。

### 4. Route by layer responsibility
经验固化的核心治理问题是路由，而不是保存。[agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules) 进一步补充了纠错晋升门槛：不要把一次用户纠正直接写成全局规则，先记忆、再泛化、再验证、最后推广。

[推论] 经验固化之前，还应检查任务范围是否便于人工审阅，以及反馈是否具有明确的复用边界；案例、适用条件与证据限制统一见 [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules#反馈之前按可审阅性设计任务范围)，本页不重复维护。

[推论] **抗记忆投毒的写入信任门禁**：持久记忆投毒的威胁模型、实证边界与防御门禁统一由 [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense) 主维护。凡接触过外部不可信输入（网页、邮件、第三方工单或未知用户查询）的会话轨迹，不得仅因重复出现或经过 LLM 选择性摘要/重写就自动晋升至默认注入层 `memory` 或活跃 `skill`；离线整合须核验来源信任等级（Trust Tier）并严格隔离多主体命名空间。

```text
lesson candidate
→ Is it always-needed stable context? → memory
→ Is it repeatable procedure? → skill
→ Is it a public-eligible, durable conclusion? → corresponding wiki formal owner
→ Is it private or project-local? → authorized session/project carrier, not public wiki
→ Is it a one-off closeout? → project state/history, not public wiki
→ Is it a quality gate? → evaluator / test / rubric
→ Is it scheduled and stable? → cron/runtime after approval
→ Otherwise → leave in session history
```

参考：[hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)。

### 5. Reuse in future tasks
固化后的经验必须能被未来任务触发。

触发方式包括：
- system prompt memory injection
- skill discovery and `skill_view`
- wiki retrieval before answering
- project context auto-load
- cron skill injection
- subagent context handoff
- evaluator rubric reuse

如果经验沉淀后无法被未来任务检索或调用，它只是归档，不是经验闭环。

### 6. Revalidate and prune stale lessons
学习系统不能只积累不遗忘。

应定期检查：
- skill 是否仍然可用
- negative claims 是否过期
- memory 是否重复或陈旧
- wiki concept 是否已有更好的验证结论
- cron 是否仍低噪音、低风险
- runtime automation 是否有 rollback path

2026-05-11 / v0.13.0 的历史快照记录过部分 skill lifecycle 能力；curator、memory consolidation / Auto Dream 等能力的当前状态仍需按目标版本重新核验。

## AI Agent mapping

经验闭环按职责接入任意 Agent 或人工辅助流程：证据获取、候选提炼、持久化载体、效果验证和后续复用分别检查，不要求存在特定的会话搜索命令、Skill 格式、记忆 API、子代理或调度器。[hermes-agent-experience-consolidation-capability-assessment](/queries/hermes-agent-experience-consolidation-capability-assessment) 提供通用能力核查框架，并将具体产品能力限定在版本历史案例中；当前部署能力仍须查目标版本资料和实际证据。

可采用的知识闭环边界是：

```text
authorized session / project evidence → audited review
→ public, durable finding → corresponding wiki formal owner
→ private or project-local record → original authorized session/project carrier
→ one-off closeout → project state/history, not public wiki
→ narrow skill patch only when a reusable procedure changed
→ memory only for compact stable facts
→ runtime/cron only after separate approval
```

- 结果验证可由测试、确定性工具证据或独立评审承担，详见 [agent-self-validation-loops](/concepts/agent-self-validation-loops)；产品内置的目标判定命令只是可选实现。
- 多 Agent 只用于适合拆分的复杂工作，不替代明确验收标准；编排边界见 [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)。
- 定时复盘默认只生成候选报告，不自动修改 memory、skills 或 runtime。

## Anti-patterns
- 把每篇文章都变成一个 skill。
- 把未经验证的外部产品概念写进 memory。
- 把所有 session 复盘结果直接塞进 `MEMORY.md`。
- 用“Dreaming”包装不可审计的自动自改。
- 让 cron 无人确认地修改 durable knowledge layers。
- 把一次任务的进展日志当作长期经验。
- 以“经验固化”或“保留证据”为由，把私有状态、会话记录、执行记录或一次性 closeout 写入公共 Wiki。
- 用多 agent 取代明确验收标准。
- [推论] 把语义相似但适用边界不同的知识强行合并。
- [推论] 让同一个模型同时负责提炼、加权和验收，再把其自评分数当作有效性证明。
- [推论] 把 Skill 命中率、实际使用率或最终成功率中的任一项当作完整生命周期质量。
- [推论] 让外部或共享轨迹绕过来源授权，因重复出现而自动成为 Active 指令。
- [推论] 把 LLM 选择性摘要或离线 dreaming 当作足够的抗投毒过滤或事实核验手段，忽视似是而非细节被静默固化或被绕过的风险。

## Operating rules
1. 经验候选必须先问：未来会在哪类任务中复用？
2. 能写成验证步骤的，优先进入 skill 或 project gate，而不是 memory。
3. 能作为跨项目概念复用且符合公共边界的，进入对应 wiki concept。
4. 公开、带必要时间范围且有长期检索价值的能力判断可进入 query；一次性验证记录和任务 closeout 留在项目载体或 Git 历史。
5. 只有稳定、短小、经常需要的事实进入 memory。
6. 自动化只读复盘可以先做；自动写入 durable layer 要等真实验证和单独批准。
7. 所有经验固化都要保留 provenance 和 rollback path。

## [推论] 参数化经验固化与技能治理裁决矩阵（`B_act / P_skill / G_promo / I_rev / I_taint / I_retract`）

`[推论]` 为将本页的互补学习系统（CLS）双阶段分工与子页的记忆激活衰减（[hermes-memory-governance-notes](/concepts/hermes-memory-governance-notes)）、Skill 使用漏斗与可回滚状态（[agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state)）、知识演化与元技能边界（[agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills)）及防来源洗白安全契约（[agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense)）收束为统一的可审计工程契约，在评估记忆留存、Skill 库扩容或候选规则晋升时，可按以下矩阵（激活、候选、晋升三项判据和三项状态不变量）逐项核对（不预设跨项目硬编码默认数值）：

| 参数符号 | 治理维度与数学定义 | 门禁裁决条件（Consolidation & Promotion Gate） | 违背时的典型退化模式与处置动作 |
| :--- | :--- | :--- | :--- |
| $B_{\text{act}}$ | **记忆基础激活与扇出信噪比（Activation & Fan Signal-to-Noise）**：<br>$A_i = \ln\!\left(\sum_{j=1}^{n} t_j^{-d}\right) + \sum_{j \in \mathcal{C}} W_j \big(S_{\max} - \ln(\text{fan}_j)\big)$ | 1. 常驻 `memory` 条目须具备跨任务高频激活（高 $n$、低衰减 $t_j$）且单句高密度；<br>2. 共享同一触发线索 $j$ 的候选条目数 $\text{fan}_j$ 受控，避免无界堆积 | **扇出稀释与常驻膨胀**：将一次性长篇反思或高度重叠条目塞入默认层，导致 $\ln(\text{fan}_j)$ 增大、检索精度暴跌；应合并同角色条目或下沉至按需检索的 `wiki` |
| $P_{\text{skill}}$ | **技能漏斗的执行增益估计**：分别测量候选命中率、命中后实质使用率与外部验证成功率的有符号差值；乘积是诊断量，不是单个任务成功的概率。定义见 [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state) | 1. 另做启用与禁用 Skill 的端到端对照，不能只比较实际使用 Skill 的成功样本；<br>2. 跨 `Skill × model × harness × environment` 迁移前独立复验，且区分被动回忆基准与行动耦合多会话闭环（见 [MemoryArena，ICML 2026，arXiv:2602.16313 v2](https://arxiv.org/abs/2602.16313)） | **高命中低转化与负迁移**：把 `skill_view` 命中率或被动长上下文 QA 高分当作行动闭环成功率，或将小模型碎片化规则直接迁移至强模型引发遵循冲突；应隔离失败阶段并按目标环境重做 held-out 验证 |
| $G_{\text{promo}}$ | **候选晋升净效用门禁（Promotion Net-Utility Gate）**：<br>$G_{\text{promo}}(s_{\text{cand}}) = \Delta \hat{\mu}_{\text{held-out}} - \lambda_{\text{neg}} R_{\text{regress}} - \lambda_{\text{cost}} \Delta C_{\text{token}} > 0$ | 1. 候选规则在冻结基线、原失败案例与相邻反向案例上无回归（$R_{\text{regress}} = 0$），可用配对置信下界 $\operatorname{LCB}_{1-\alpha}(\Delta M)$ 实例化（[agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules)）；<br>2. 性能增益足以覆盖额外上下文 Token 与控制器开销 $\Delta C_{\text{token}}$；模型升级至 $M_{t+1}$ 时转为反向消融检验 $\Delta U(r_j \mid M_{t+1})$（[hermes-active-surface-lifecycle-governance](/concepts/hermes-active-surface-lifecycle-governance)） | **单次痛点过拟合与库漂移（Library Drift）**：因单次失败盲目追加规则，导致邻近任务回归或 Token 预算被挤占；应拒绝晋升，保留为局部 fixture 或合并进既有 owner |
| $I_{\text{rev}}$ | **可逆技能状态与持久证据分离不变量（Reversible-State Invariant）**：<br>$S_{k+1} = \text{Rollback}(S_k, s_{\text{cand}}),\; W_{k+1} = W_k \cup \{e_k, \text{reason}_k\}$ | 1. 候选 Skill $s_{\text{cand}}$ 验证回退时仅在上一活动状态 $S_k$ 仍满足来源授权与信任门禁时恢复，否则停用受影响部分；<br>2. 原始轨迹证据 $e_k$ 与被拒绝原因 $\text{reason}_k$ 在保留政策允许时存入证据/知识层 $W_{k+1}$ | **回滚失忆与重复无效搜索**：回滚失败 Skill 时一并删掉测试记录与拒绝理由，导致后续迭代重复探索同一死胡同；应严格分离活动指令层 $S_k$ 与证据/知识层 $W_k$ |
| $I_{\text{taint}}$ | **写入期来源绑定与防溯源洗白不变量（Non-Malleable Origin Binding）**：<br>在完整性格 $\text{untrusted} \sqsubset \text{agent} \sqsubset \text{trusted}$ 上，未获真实可信印证或用户授权的变换 $\tau$ 不得提高记忆项 $x$ 的有效权限 $D(x)$，即 $D(\tau(x)) \sqsubseteq D(x)$ | 1. 写入期由监控层按已鉴权通道而非文本内容绑定来源权限（[TMA-NM，arXiv:2606.24322](https://arxiv.org/abs/2606.24322)），阻断自摘要、可信工具回显与伪造多源印证三条洗白通道；<br>2. 含不可信来源的离线 dreaming 或摘要产物不得自动提权进入可执行动作或默认规则层；用户确认仅授权一次具体动作，不给整个会话或记忆条目永久提权 | **来源洗白与隐式提权**：Agent 将外部网页/邮件内容改写成自己的笔记后丢失不可信标签，后续会话将其当作自身可信记忆触发高危操作；应强制保留不可变造的来源格标签并要求独立可信主体的印证达到策略阈值，或由用户单次授权该动作。该门禁不覆盖跨智能体共享记忆或纯回答偏置，信任基础设施失陷仍是残余风险 |
| $I_{\text{retract}}$ | **溯源级联撤回不变量**：撤回上游证据后，所有仍依赖它的派生版本均不得继续服务 | 1. 记录从原始证据到 `memory / reflection / skill` 的派生依赖，沿边查找直接与间接受影响项；<br>2. 隔离受影响版本，包括默认召回、缓存和可回滚快照；仅用仍可信且获授权的证据重算，通过验证门禁才可重新启用；证据不足则保持停用 | **删源留毒与回滚复活**：只删原始日志，不阻断派生条目召回；或回滚到仍含撤回证据的旧版本 |

`[推论]` **撤回与保留的边界**：事实过时但历史记录仍可信且获准保留时，按有效时间失效，不等同于撤回证据。权限撤回或有删除义务时，按适用政策处理源、派生内容及副本；隔离不等于删除，墓碑若获准保留也不应包含被撤回内容。依赖闭包失效可参考 [Agentic Unlearning](https://arxiv.org/html/2602.17692v2) 的记忆路径；[Selective Forgetting](https://arxiv.org/html/2608.28978v1) 研究的是基于评分的图剪枝，不验证此处的跨层撤回契约。

`[推论]` **长期记忆回归与控制面完整性门禁**：离线巩固前后的回归评测除覆盖 [LongMemEval（ICLR 2025，arXiv:2410.10813 v2）](https://arxiv.org/abs/2410.10813) 的五项核心能力（IE / MR / TR / KU / ABS）外，还须同步检验**控制面治理状态完整性**（[Governance-State Corruption，arXiv:2610.30698](https://arxiv.org/abs/2610.30698) 在固定底层存储的配对故障实验中观察到 LongMemEval 下游面板的正确率下降数十个百分点），并区分对话回忆、长程环境轨迹经验与行动耦合闭环（完整基准对照与可达性审计规则见 [agent-memory-architectures-and-evaluation-benchmarks](/comparisons/agent-memory-architectures-and-evaluation-benchmarks)）。可另设本地指标：分别统计“需要回答当前值时选中最新有效事实”和“缺少证据时正确拒答”的比例，并验证历史时点查询仍可返回当时有效的事实（参见 [llm-summary-identification-step](/concepts/llm-summary-identification-step)）。这些是本地回归判据，不是论文定义的指标。

## Relations

- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- related: [agent-memory-architectures-and-evaluation-benchmarks](/comparisons/agent-memory-architectures-and-evaluation-benchmarks), [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state), [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills), [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [hermes-knowledge-base-operating-flow](/concepts/hermes-knowledge-base-operating-flow), [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence), [hermes-memory-governance-notes](/concepts/hermes-memory-governance-notes), [hermes-active-surface-lifecycle-governance](/concepts/hermes-active-surface-lifecycle-governance), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [hermes-agent-experience-consolidation-capability-assessment](/queries/hermes-agent-experience-consolidation-capability-assessment), [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense), [llm-summary-identification-step](/concepts/llm-summary-identification-step)

