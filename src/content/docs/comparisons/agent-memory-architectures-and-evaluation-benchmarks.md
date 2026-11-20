---
title: Agent 记忆写入范式与长期评测基准对照
created: 2026-11-20
updated: 2026-11-20
type: comparison
tags:
  - agent
  - memory
  - comparison
  - evaluation
  - architecture
  - governance
sources:
  - https://arxiv.org/abs/2504.19413
  - https://arxiv.org/html/2502.12110v11
  - https://arxiv.org/html/2501.13956v1
  - https://wal.sh/research/2026-agent-memory-systems/
  - https://arxiv.org/html/2609.25054v1
  - https://arxiv.org/html/2410.10813v1
  - https://arxiv.org/abs/2605.12493
  - https://arxiv.org/html/2602.16313v1
  - https://arxiv.org/abs/2507.05257
  - https://arxiv.org/pdf/2610.09193
  - https://arxiv.org/abs/2610.30698
status: stable
description: 比较五类 Agent 记忆写入与状态演化范式（CRUD、原地演化、双时态图、离线巩固与类型化溯源图 MoM/P-Mem），并对照
  LongMemEval v1/V2、MemoryArena、MemoryAgentBench 审计陷阱与控制面治理状态损坏评测。
aliases:
  - agent-memory-architectures-comparison
  - agent-memory-evaluation-benchmarks
volatility: medium
verified_at: 2026-11-20
review_by: 2027-03-20
---

# Agent 记忆写入范式与长期评测基准对照

## Summary

本页从 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) 拆出，集中维护两类横向对照：一是长期记忆系统在“何时裁决当前值”与“如何处置被替代值”上的五类写入范式取舍；二是长期记忆评测基准的适用维度、精度—延迟权衡、控制面状态完整性与基准有效性陷阱。

核心结论：
- **写入范式不能只看检索延迟**：无版本保留的 CRUD 覆盖可能丢失误提交前的状态；Zep/Graphiti 保留失效历史，但论文所述实现对已识别的矛盾优先采纳新摄入的信息，未提供显式 `contested` 冲突态；[Memory of Memory / P-Mem (arXiv:2609.25054)](https://arxiv.org/html/2609.25054v1) 补齐了“写入时提交 + 保留替代值 + 显式冲突态”的设计点，但同时暴露了**状态覆写键与累加事件键不可混用**的硬边界。
- **评测不能只看被动回忆聚合分**：长期记忆回归须同时覆盖环境轨迹经验（[LongMemEval-V2](https://arxiv.org/abs/2605.12493)）、行动耦合闭环（[MemoryArena](https://arxiv.org/html/2602.16313v1)）与**控制面治理状态完整性**（[Governance-State Corruption](https://arxiv.org/abs/2610.30698)），并在采信外部冲突消解基准前完成逐题可达性与零学习基线审计（[arXiv:2610.09193](https://arxiv.org/pdf/2610.09193)）。

## 1. 五类记忆写入与状态演化范式对照

下表按“当前值裁决时机”与“被替代值处置方式”比较五类可组合范式。最后一列包含无额外版本控制或门禁时的工程风险判断，并非所有论文均做过同条件对照实验。

| 写入范式与代表方案 | 核心更新机制 | 收益与实证边界 | 审计、冲突与爆炸半径风险 |
| :--- | :--- | :--- | :--- |
| **反应式 CRUD**<br>（[Mem0，arXiv:2504.19413](https://arxiv.org/abs/2504.19413)） | 提取事实后与相似旧记忆一起交由 LLM 裁决 `ADD / UPDATE / DELETE / NOOP` | 在 LoCoMo 上相对全上下文降低 `91%` p95 延迟并节省 `90%+` Token（较 OpenAI 记忆在 LLM-as-a-Judge 指标相对提升 `26%`） | 无版本或其他副本时，原地覆写会使误提交不可逆（[P-Mem](https://arxiv.org/html/2609.25054v1) §4.2.2 中关闭前序版本保留的对照组恢复率为 `0%`，该数字不是 Mem0 的实测恢复率）；抽取逻辑与存储状态紧耦合 |
| **自组织原地演化**<br>（[A-MEM，arXiv:2502.12110](https://arxiv.org/html/2502.12110v11)） | 借鉴 Zettelkasten，新记忆写入时建立关联链接并可改写历史笔记的上下文属性 | 无需预定义固定 Schema 即可形成动态知识网络 | 属于**原地变更（Place-Oriented）**：缺乏版本记录时会静默丢失原状态（参见 [wal.sh 2026](https://wal.sh/research/2026-agent-memory-systems/)） |
| **双时态知识图谱**<br>（[Zep / Graphiti，arXiv:2501.13956](https://arxiv.org/html/2501.13956v1)） | 分离事件时间轴 $T$ 与事务时间轴 $T'$，通过情景边与双向溯源索引执行非破坏性失效 | LongMemEval_S 上 `gpt-4o` 准确率从全文基线的 `60.2%` 升至 `71.2%`，响应时间从 `28.9s` 降至 `2.58s`；DMR 上 `gpt-4-turbo` 达 `94.8%` | 论文所述实现以 LLM 识别矛盾，对有效期重叠的矛盾优先采纳较晚摄入的信息；未描述显式 `contested` 状态或重新启用已失效边的机制（详见 [hermes-memory-governance-notes](/concepts/hermes-memory-governance-notes)） |
| **主动离线巩固**<br>（Dreaming / 后台重组织） | 脱离在线回合，批量回看历史轨迹并重排或重写长期记忆基底 | 将整理成本移出在线回合；实际检索收益须做前后对照验证 | 具有**存储级爆炸半径（Store-Scoped Blast Radius）**：原地覆写共享存储且无版本隔离时，一次误整理会影响后续多个会话，单会话回滚无法消除共享变更（[wal.sh 2026](https://wal.sh/research/2026-agent-memory-systems/)） |
| **类型化溯源图**<br>（[Memory of Memory / P-Mem，arXiv:2609.25054](https://arxiv.org/html/2609.25054v1)） | 写入时提交当前值并保留被替代值为溯源历史；通过类型化操作（`supports / supersedes / contests / rejects / revokes / resolves`）维护六态状态机 `{active, contested, superseded, contradicted, revoked, historical}` | LongMemEval-s 知识更新子集（$n=78$）中，轮次级读取加读时剪枝相对 MemoryOS 将过时回答率从 `19.4%` 降至 `10.9%`（准确率 `60.3% → 65.4%`）；在构造的 `ALFWorld-Revision` 键值流中，写入时提交的当前值准确率保持 `100%`，相似度排序的原始检索在八次修订时降至 `25%`，同一证据按到达顺序提供则为 `94.3%`；撤回探针中，保留前序版本的方案在已误提交的样本中恢复率为 `100%`。LongMemEval-s 每题平均读入约 `3k` Token，而 MemoryOS 约 `11k`，这是**轮次与会话的检索粒度差异**，不是图谱压缩收益 | **关键反证边界**：(1) 在较大干扰池 `LongMemEval-s` 上，启用图谱剪枝相对不剪枝虽将过时率从 `23.6%` 降至 `10.9%`，但因误删部分仍需证据牺牲了 `3.8` 个百分点准确率（`69.2% → 65.4%`）；(2) 将替代剪枝直接套用于全量基准时，聚合类问题（如“看过多少部电影”）被误剪，聚合准确率暴跌至 `15.2%`（总体 `45.6%`；35B 问题路由将总体准确率恢复至 `51.8%`，聚合准确率与未剪枝基线相同，为 `29.3%`）；(3) 自然语言历史上的键规范化仍难随提取器规模自动解决（35B 提取器在 `20,141` 条事实中产出 `18,050` 个单元） |

`[推论]` **状态覆写键与累加事件键的隔离原则**：采用写入时提交或图谱替代剪枝前，必须按数据语义显式拆分**状态覆写键（State Key，如当前住址、生效配置，适用 `supersedes` 与剪枝）**与**累加事件键（Event / Aggregation Key，如单次观影、故障发生记录，应按事件身份追加并聚合，不能因同类新事件到来而剪掉旧事件；同一事件的勘误和撤回应单独处理）**；对无法确定主次的冲突更新，保留 `contested` 状态与双向证据指针，不静默择一覆盖。

## 2. 长期记忆评测基准与有效性陷阱对照

长期记忆系统的评估正从“静态对话回忆”转向“长程环境轨迹、行动闭环与控制面状态完整性”：

| 评测基准 / 审计研究 | 评测对象与规模 | 核心能力维度 | 关键实证与工程启示 |
| :--- | :--- | :--- | :--- |
| **[LongMemEval v1](https://arxiv.org/html/2410.10813v1)**<br>（ICLR 2025） | 500 道跨会话对话问答 | 信息提取（IE）、多会话推理（MR）、时序推理（TR）、知识更新（KU）、拒答（ABS） | LongMemEval-s 上，受测模型直接读取完整历史，相比只提供证据会话的理想检索，表现相对下降约 `30%–60%`；验证了会话分解、事实增强键扩展与时间感知查询扩展三项优化 |
| **[LongMemEval-V2](https://arxiv.org/abs/2605.12493)**<br>（2026-05） | 451 道人工策展题；单题最高配对 `500` 条历史轨迹、`115M` Token（Small 25M / Medium 115M） | 面向 Web/环境 Agent 的 5 项经验记忆：静态状态召回、动态状态追踪、工作流知识、环境坑点（Environment Gotchas）、前提感知（Premise Awareness） | 揭示**精度—延迟帕累托前沿**：文件化沙箱编码代理 `AgentRunbook-C` 准确率达 `72.5%`，高于最强外部 RAG 基线（`48.5%`；简单状态切片 RAG 为 `40.1%`）、作者提出的分层知识池 RAG `AgentRunbook-R`（`57.8%`）与现成 Codex（`69.3%`），但编码代理查询延迟高昂（Codex 约 `182s/query`，慢于 `AgentRunbook-R` 约 `6.9×`；`AgentRunbook-C` 较 Codex 快 `32%`） |
| **[MemoryArena](https://arxiv.org/html/2602.16313v1)**<br>（2026-02） | 网页导航、偏好约束规划、渐进式信息检索、顺序形式推理四类多会话闭环 | 行动耦合记忆（从早期动作与环境反馈提炼经验并指导后续动作） | 在 LoCoMo 等被动问答基准接近饱和的 Agent，在行动耦合闭环中仍表现不佳（参见 [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state)） |
| **[MemoryAgentBench](https://arxiv.org/abs/2507.05257)**<br>（2025-07 / v3 2026-03）及**[审计反证](https://arxiv.org/pdf/2610.09193)**（2026-10） | 增量多轮交互（LongMemEval S* 约 `355K` Token 等） | 准确检索（AR）、测试时学习（TTL）、长程理解（LRU）、冲突消解/选择性遗忘（CR/SF） | **基准有效性陷阱**：[arXiv:2610.09193](https://arxiv.org/pdf/2610.09193) 表明，在一份事实列表上定规则并冻结、无需模型学习的“最后写入获胜”基线，按官方评分答对冲突消解题 `642/800`（`80.25%`）；三份留出列表为 `447/600`（`74.5%`），且有 `67` 条题目的官方金标在最后写入图上**不可达**（占 262K 多跳题三分之一，被覆写的旧值反而是金标） |
| **[Governance-State Corruption](https://arxiv.org/abs/2610.30698)**<br>（2026-10） | 覆盖 6 家模型提供商、`731` 个基准样例及其 `2,080` 组配对故障；下游 LongMemEval/Memora 面板纳入 `298/300` 个完整三元组 | **控制面治理状态完整性**（底层存储与任务固定，仅破坏“哪些记录有效并进入模型可见上下文”的状态） | 离线控制面检查中，治理状态损坏改变了 `96.25%` 故障对的有效投影（用已知正确状态强制执行后，`100%` 的配对恢复了正确投影，不代表系统能自主修复）；下游干净减损坏差值在 LongMemEval 二元正确率达 **`40.54` 个百分点**（95% CI `[30.32, 50.71]`），在重标定 Memora FAMA 达 **`30.60` 分**（`[23.31, 37.69]`） |

`[推论]` **记忆系统回归评测的三条工程纪律**：
1. **将控制面完整性与检索准确率并列**：即使底层仍保留正确证据，错误的有效性状态也可能让它未进入模型上下文，或让已失效证据重新进入。回归应分别检查证据召回、实际进入模型上下文的记录和下游作答，并将已知正确状态下的恢复与系统自主修复分开计量。
2. **按延迟预算选择记忆形态**：高频低延迟查询优先使用结构化索引或轻量 RAG（类似 `AgentRunbook-R`），仅在低频高价值、需跨多条原始轨迹深度取证时触发文件化沙箱代理检索（类似 `AgentRunbook-C`），对应 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 的 `locate → expand` 分流。
3. **基准接入前先做可达性与零学习基线审计**：采信任何外部冲突消解或遗忘基准的聚合分前，应抽检其金标是否与声明的更新语义一致，并以确定性规则基线分离“简单簿记”与“真实组合推理”。

## 3. 证据边界与不推广事项

- 本页汇总的实验数字（Mem0 的 `91%` 延迟降幅、Zep 的 `11.0` 个百分点准确率增益、P-Mem 的 `19.4% → 10.9%` 过时率、`69.2% → 65.4%` 剪枝准确率权衡与 `15.2%` 聚合退化、LongMemEval-V2 的 `72.5%` vs 外部 RAG `48.5%` / `AgentRunbook-R` `57.8%`、Governance-State Corruption 的 `40.54` 个百分点与 `30.60` 分）均绑定各自论文的数据集、模型与评测协议，不构成跨系统的默认性能承诺或固定阈值。
- 本页新增的 2026 预印本来源（P-Mem、LongMemEval-V2、MemoryAgentBench 审计论文与 Governance-State Corruption）均核对自公开 arXiv 摘要及 HTML/PDF 关键章节与表格，未进行独立代码复现，且预印本尚未等同于同行评审定稿结论。
- Governance-State Corruption 的下游面板属于确定性选取的非概率样本，其区间刻画面板内稳定性，不外推为任意生产总体的精确效应量。
- 本页为架构选型与评测设计参考，不自动改变现有运行时存储引擎、记忆检索链路或评测脚本。

## Relations

- depends_on: [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops), [hermes-memory-governance-notes](/concepts/hermes-memory-governance-notes), [agent-memory-reflection-planning-pipeline](/concepts/agent-memory-reflection-planning-pipeline)
- related: [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state), [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense), [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework), [llm-summary-identification-step](/concepts/llm-summary-identification-step), [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)

