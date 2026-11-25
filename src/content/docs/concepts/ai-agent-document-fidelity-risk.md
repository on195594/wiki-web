---
title: AI Agent Document Fidelity Risk
created: 2026-05-17
updated: 2026-11-16
type: concept
tags:
  - agent
  - llm
  - workflow
  - research
  - risk-control
  - evaluation
  - verification
  - ai-coding
sources:
  - raw/articles/venturebeat-frontier-ai-document-fidelity-risk-2026-05-13.md
  - https://arxiv.org/abs/2604.15597
  - https://arxiv.org/html/2604.15597v1
  - https://www.microsoft.com/en-us/research/blog/further-notes-on-our-recent-research-on-ai-delegation-and-long-horizon-reliability/
  - https://github.com/microsoft/DELEGATE52
  - https://www.researchgate.net/publication/43921655_Combinators_for_bidirectional_tree_transformations_A_linguistic_approach_to_the_view-update_problem
  - https://royalsocietypublishing.org/rspa/article/478/2264/20220156/56657/A-mathematical-foundation-to-support-bidirectional
status: stable
description: 结合微软 DELEGATE-52 一手论文（arXiv:2604.15597）、双向变换 Lens 往返定律与复合跳跃退化模型，说明
  AI Agent 多轮文档处理的领域就绪度差异、静默改写机制及工程验证边界。
aliases:
  - document-fidelity-risk
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# AI Agent Document Fidelity Risk

## Summary

多轮 AI Agent 文档工作流的核心风险，不只是模型删掉内容，而是模型会在看似完成任务的过程中重写、扭曲或幻觉原有内容；越强的模型越可能把错误伪装成合理改写，导致只看最终产物的人类审查失效。

本页编译自 [venturebeat-frontier-ai-document-fidelity-risk-2026-05-13](https://github.com/on195594/wiki/blob/4d684be23833410aa458f656d542e1a691d5ca08/raw/articles/venturebeat-frontier-ai-document-fidelity-risk-2026-05-13.md)，并补充 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)、[agent-self-validation-loops](/concepts/agent-self-validation-loops)、[typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 与 [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)：长链路 Agent 可靠性要靠短步骤、可逆验证、差异检查、受限工具和中间态审计，而不是靠结束后的信任式检查。

## Core principle

不要把多轮 AI Agent 文档处理交给模型后，只在最后检查结果。

在长链路委托式工作中，模型可能连续数步看似保持正确，然后在某一次交互中发生灾难性内容损坏。更危险的是，前沿模型失败时不一定直接删除内容，而是把原文改写成“看起来合理但已经失真”的内容。这类错误对人类审查者更难发现。

## Source-backed evidence

以下数字来自微软研究院 Philippe Laban、Tobias Schnabel 与 Jennifer Neville 发表的 **DELEGATE-52** 一手论文（2026-04-17，[*LLMs Corrupt Your Documents When You Delegate*，arXiv:2604.15597](https://arxiv.org/abs/2604.15597)，[HTML 全文](https://arxiv.org/html/2604.15597v1)，[官方仓库 microsoft/DELEGATE52](https://github.com/microsoft/DELEGATE52)）、[微软研究院方法学补充说明（2026-05-15）](https://www.microsoft.com/en-us/research/blog/further-notes-on-our-recent-research-on-ai-delegation-and-long-horizon-reliability/)及 VentureBeat 报道 [venturebeat-frontier-ai-document-fidelity-risk-2026-05-13](https://github.com/on195594/wiki/blob/4d684be23833410aa458f656d542e1a691d5ca08/raw/articles/venturebeat-frontier-ai-document-fidelity-risk-2026-05-13.md)，应作为方向性 benchmark，而不是 AI Agent 本地强制阈值：

- DELEGATE-52 覆盖 `52` 个专业领域、`310` 个工作环境（Hugging Face 公开可重分发子集含 `48` 个领域、`234` 个工作环境），评测 `19` 个主流闭源与开源权重模型。
- 种子文档长度约 `2,000–5,000 tokens`，每个环境配 `5–10` 对可逆编辑任务，干扰文档约 `8,000–12,000 tokens`。
- 主实验模拟 `20` 次连续编辑交互（即 `10` 轮 `forward + backward` 往返接力）。
- 全部模型在模拟结束时平均文档退化约 `50%`；顶级前沿模型（如 `Gemini 3.1 Pro`、`Claude 4.6 Opus`、`GPT 5.4`）平均仍会损坏约 `25%` 文档内容。
- **领域就绪度高度偏斜（`1/52` vs. `11/52`）**：论文将 20 轮交互后保留得分 $\ge 98\%$ 定义为该领域的“委托就绪（Ready）”状态。在 `52` 个领域中，**Python 是唯一大多数被测模型达到就绪状态的领域**；即便综合表现第一的模型也仅在 `11/52` 个领域达标，而在财报（earning statements）、会计账本（`.ledger`）、晶体学、乐谱与自然语言散文等领域退化尤为严重。
- **稀疏灾难性失败与延迟效应（论文 §5）**：约 `80%` 的总退化来自少数灾难性关键失败，论文按**一次完整往返（正向与逆向两次交互）后重构得分下降至少 10 个百分点**识别 critical failure；这不是单次交互损失原始文档 `10%` 字数或内容的指标。前沿模型的关键失败出现更晚且轮次更少；**2 次交互（1 次往返）的表现不总能预测 20 次交互的长链路表现**。
- **基础工具实验与作者解释分开（论文 §4.2）**：在含通用文件读写与 Python 执行的基础 agentic harness（`model_agentic.py`）下，四个被测模型的最终重构得分平均比无工具设置低约 **6 个百分点**，不代表全部 `19` 个模型或生产级 harness 的效果。论文讨论了交互上下文开销和任务需要文本理解、不能仅用短程序完成等因素，但未通过独立干预隔离出唯一因果机制。另据 [venturebeat-frontier-ai-document-fidelity-risk-2026-05-13](https://github.com/on195594/wiki/blob/4d684be23833410aa458f656d542e1a691d5ca08/raw/articles/venturebeat-frontier-ai-document-fidelity-risk-2026-05-13.md) 的采访，Laban 解释：模型难以临时写出跨领域的可靠处理程序，不能程序化完成时会转向整文件重写；这是作者接受媒体采访时的解释，不是论文已实验证明的“脚本先失败再重写”因果链。
- **检索噪声的复利放大**：嘈杂上下文在短链路（2 轮交互）可能只造成约 `1%` 性能下降，但在 20 轮长链路中会复利放大到约 `2–8%`。
- **企业自建评测的三组件蓝图与方法学边界**：[venturebeat-frontier-ai-document-fidelity-risk-2026-05-13](https://github.com/on195594/wiki/blob/4d684be23833410aa458f656d542e1a691d5ca08/raw/articles/venturebeat-frontier-ai-document-fidelity-risk-2026-05-13.md) 引述 Laban 建议自建 `(a) 可逆编辑任务对 + (b) 领域解析器 + (c) 结构化相似度函数`，并报道团队在 `30/52` 个领域复用了现有解析库；这个精确数量来自媒体报道，论文附录 K.2 仅说明实现时优先复用现成库，未给出该数量。同时 [微软研究院补充说明](https://www.microsoft.com/en-us/research/blog/further-notes-on-our-recent-research-on-ai-delegation-and-long-horizon-reliability/) 明确指出，DELEGATE-52 是人工中间干预有限的长程压力测试，基础工具实验不代表生产级专用 harness，不能据此外推具备步进验证、人工监督与领域专用工作流的生产系统必然发生同等退化。

这些数字的长期价值是提醒风险数量级与长短程评测脱节现象；具体模型名称、排名和版本不应沉淀为长期判断。

## Mechanism

### 1. 委托式工作让审查天然变弱

用户把文档拆分、重排、改写、归档、代码编辑等知识工作交给模型时，往往没有时间或专业能力复查每一次修改。系统因此从“人类逐步确认”滑向“模型完成、用户信任”。

### 2. 多轮交互会放大微小失真

单轮测试低估风险。RAG 噪声、无关文件、格式理解偏差和上下文漂移，在短任务里可能只是轻微误差，在 20 步工作流中会累积成明显退化。

### 3. 前沿模型的错误更隐蔽

弱模型失败时更可能直接删除内容；强模型失败时更可能保留文本外观，但重写细节、改变含义、混入幻觉。后者更符合人类对“流畅文档”的预期，因此更难被最终审查捕捉。

### 4. 通用工具不是安全边界

给 Agent 宽泛文件读写或通用代码执行能力，不等于让它可靠。[venturebeat-frontier-ai-document-fidelity-risk-2026-05-13](https://github.com/on195594/wiki/blob/4d684be23833410aa458f656d542e1a691d5ca08/raw/articles/venturebeat-frontier-ai-document-fidelity-risk-2026-05-13.md) 中作者将跨领域程序化处理困难与整文件重写作为解释；**[推论]** 整文件重写可能扩大损坏面，但不能把这一解释写成论文已经隔离验证的退化因果机制。

### 5. 形式化模型：双向往返定律（Round-Trip Lenses）与复合跳跃退化

1. **双向变换往返一致性（Bidirectional Lens Laws）**：在编程语言与视图更新理论中，J. Nathan Foster、Benjamin C. Pierce 等人（2007, *ACM TOPLAS*, *Combinators for Bidirectional Tree Transformations*, [ResearchGate PDF](https://www.researchgate.net/publication/43921655_Combinators_for_bidirectional_tree_transformations_A_linguistic_approach_to_the_view-update_problem)；[Royal Society Bidirectional Mappings](https://royalsocietypublishing.org/rspa/article/478/2264/20220156/56657/A-mathematical-foundation-to-support-bidirectional)）用正向映射 $\text{get}: S \to V$ 与逆向回写 $\text{put}: V \times S \to S$ 的**往返定律（Round-Tripping Laws：$\text{GetPut}$ 与 $\text{PutGet}$）**刻画无损结构变换。`[推论]` 这些定律可作为理解 DELEGATE-52“往返接力（Round-Trip Relay）”的类比，但来源未证明该评测是 Lens 理论的推广。其多步代理评测可表示为：令领域解析器为 $\pi: \mathcal{D} \to \mathcal{R}$，每轮正向编辑 $T_k$ 配对独立新会话中尝试恢复原文的操作 $U_k$；$U_k$ 不是已证明存在的数学逆函数。经过 $m$ 对往返（$2m$ 步交互）后的文档保真度定义为解析表示的相似度：
   $$\text{Fidelity}_{2m}(D_0) = \text{Sim}\!\left(\pi(D_0),\; \pi\!\left((U_m \circ T_m \circ \dots \circ U_1 \circ T_1)(D_0)\right)\right) \in [0, 1]$$
   当正向拆分与逆向合并由不同会话独立执行时，可检查 $U_k(T_k(D)) \approx D$ 是否成立；结果仍受解析器与相似度覆盖范围限制。相互抵消的错误或解析器未捕获的语义变化可能逃过检查，往返通过也不证明中间步骤正确。
2. **渐进漂移与灾难性跳跃复合退化（Jump-Degradation Dynamics）**：`[推论]` 多轮委托工作流中的剩余保真度 $F_T$ 可用“背景漂移 + 稀疏灾难性跳跃”的复合乘积过程作示意模型；这不是实验拟合得到的退化定律，且暂不考虑后续修复：
   $$F_T = F_0 \prod_{t=1}^{T} \left[(1 - \epsilon_t^{\text{drift}})(1 - \delta_t \cdot \mathbb{I}[\text{jump}_t])\right]$$
   其中 $\epsilon_t^{\text{drift}}, \delta_t \in [0, 1]$ 是相对于当步剩余保真度的示意损耗，$\mathbb{I}[\text{jump}_t]$ 表示跳跃事件。前述噪声、灾难性失败与通用工具的数字均是来源报告的汇总现象，不能直接作为这些逐步参数的估计；基础工具实验平均额外约 6 个百分点的得分下降尤其不能推出跳跃发生率显著上升。若工作流允许修复，保真度还可能回升，此乘积模型不再充分。
3. **静默语义失真与长度守恒盲区**：弱模型失效以显式删除为主（字符/行计数差分 $|\Delta |D_t|| \gg 0$，易被简单统计拦截）；前沿强模型失效则表现为**表观结构守恒下的语义替换**（$|\Delta |D_t|| \approx 0$ 且表面语法流畅，但结构化解析表示的距离 $1 - \text{Sim}(\pi(D_t), \pi(D_{t-1})) \gg 0$），导致仅依赖末尾人工通读的审查机制失效。

## Reusable pattern

把长链路文档任务改造成可审计工作流：

1. **短步骤**：把 20 步长任务拆成可单独检查的小任务。
2. **差异检查**：每步保留输入、输出、diff、日志或结构化变更摘要。
3. **可逆任务**：能设计逆向操作的地方，用 round-trip / 往返接力检验内容保真。
4. **受限工具**：用领域专用函数替代宽泛文件读写，例如“移动 ledger 条目”而不是“让模型重写 ledger 文件”。
5. **中间态审计**：人工审查应出现在关键中间节点，而不是只看最终结果。
6. **噪声隔离**：RAG/上下文检索要评估多步工作流中的长期影响，不只看单轮 retrieval 分数。

## AI Agent mapping

### Wiki

本页属于概念层：记录一种跨任务可复用的 Agent 风险模型。原文和抽取结果保存在 [venturebeat-frontier-ai-document-fidelity-risk-2026-05-13](https://github.com/on195594/wiki/blob/4d684be23833410aa458f656d542e1a691d5ca08/raw/articles/venturebeat-frontier-ai-document-fidelity-risk-2026-05-13.md)。

### Skills

本页暂不直接授权修改 active skills。若后续在 AI Agent 的代码改写、wiki 入库、文章转写或多 agent 协作中多次遇到内容保真问题，可以把本页原则升级为对应 skill 的 reference 或 checklist。

### Runtime / tools

不要据此禁止 Agent 或多轮工作流。更合适的本地落点是：

- 对真实文件写入任务保留 read-back 和 diff 证据。
- 对长文档变换任务保留原文、清洗输入、输出和校验记录。
- 对工具权限采用窄工具、typed result 和 explicit dependency。
- 对 RAG/context-heavy 任务做多步验证，而不是只测单轮检索。

## Relationship to existing concepts

- [document-parsing-structural-fidelity](/concepts/document-parsing-structural-fidelity) 解释解析阶段的章节、表头及数值关系丢失；本页讨论其后的多轮编辑失真，两者分别需要检查输入表示与变换过程。
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 说明生产 Agent 要评估检索、生成、工具行为和运营指标；本页补充“文档内容保真”这一长链路风险维度。
- [agent-self-validation-loops](/concepts/agent-self-validation-loops) 说明单个任务如何形成目标-反馈-迭代闭环；本页强调验证目标必须覆盖文档内容是否被悄悄改写。
- [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 说明用 typed schema 和窄工具降低接口不确定性；本页说明为什么宽泛文件工具会放大内容损坏。
- [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary) 说明把过滤、聚合与格式抽取交给确定性执行器、仅让模型承担规约与解释；本页进一步说明在多轮文档变换中，通用代码执行或整文件重写仍可能引入静默改写，需改用受限领域函数与可逆往返校验。
- [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles) 说明自然语言任务要转成形式化产物和验证闭环；本页提供了可逆任务和往返评估的具体评估思路。

## What to preserve, what not to preserve

保留：

- 多轮委托式工作中的文档保真风险。
- “前沿模型错误更隐蔽”这个失败模式。
- DELEGATE-52 的 round-trip relay / 可逆任务评估方法。
- 上面的数量级 benchmark，且必须标注为来源实验结果。
- 短步骤、受限工具、中间态审计和多步 RAG 评估这些本地可迁移原则。

不保留为长期规则：

- 具体模型排名或版本优劣。
- “所有 Agent 都不可靠”这类过度泛化。
- 把 DELEGATE-52 数字硬编码成 AI Agent 阈值。
- 只因这篇文章就修改 runtime、cron、MCP、gateway 或 active skill。

## Relations

- refines: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework), [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- depends_on: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)
- related: [document-parsing-structural-fidelity](/concepts/document-parsing-structural-fidelity), [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary), [llm-summary-identification-step](/concepts/llm-summary-identification-step), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)

