---
title: Human-Machine Scientific Discovery and Verification Scarcity
created: 2026-08-18
updated: 2026-09-28
type: concept
tags:
  - agent
  - research
  - workflow
  - evaluation
  - verification
  - decision
sources:
  - raw/articles/towardsdatascience-mathematical-experiments-human-machine-teaming-2026-08-15.md
  - https://arxiv.org/pdf/2609.19644
status: stable
description: 当机器让科学候选生成变得丰沛时，以分层验证、状态账本、负面结果和人类评审约束可信知识形成。
aliases:
  - verification-scarcity
  - abundant-experiments-scarce-review
  - human-machine-mathematical-discovery
---

# Human-Machine Scientific Discovery and Verification Scarcity

## Summary

当模型、并行 Agent 和符号工具使候选假设、程序、反例与证明草稿的生成成本下降后，瓶颈会从“能否产生另一个候选”迁移到“验证覆盖是否完整、结果是否新颖、失败是否可复用、专家是否理解并愿意承担判断”。

这不是“AI 已经自动化科学发现”的结论，而是一条更窄的工作原则：**实验产量增加不会自动增加可信知识；验证器、形式化工具和同行评审各自只覆盖不同的证明义务。**

原有数学案例来自 Sean Moran 的个人实验：原文不是同行评审研究，其 Hadamard 搜索范围和四平衡点 Maxwell 候选均保留为作者自述，不能升级为数学事实。下文另以 ScientistTwo 预印本提供机器学习研究闭环的实证案例，同样区分作者报告与独立验证。

## Core distinction: abundance is not acceptance

人机协作可以显著降低以下成本：

- 并行生成候选路线；
- 把猜想转成小规模精确计算；
- 用确定性程序快速证伪；
- 对同一论证进行多表示重写；
- 让 fresh-context critic 攻击局部薄弱点；
- 把可形式化部分交给证明助手；
- 记录失败分支和未决义务。

但这些能力不会自动完成：

- 完整证明链的覆盖；
- 文献优先权和真正原创性的确认；
- 领域意义与问题价值判断；
- 对隐藏假设、翻译桥梁和形式化边界的专家审查；
- 人机贡献、依赖链和责任的归属；
- 将候选结果编译成共同体可理解、可检索的知识。

因此应把“研究产物生成成功”和“知识准入”建模为两个不同状态。

## Verification is a coverage lattice, not one score

文章中的两个数学案例揭示了不同验证器的覆盖范围。

### Complete deterministic certificate

对一个具体 Hadamard 候选矩阵，验收谓词可以被完整编码：用精确整数计算 `H × Hᵀ`，要求结果等于 `668I`。如果输入候选完整、实现正确，这个检查可以对该候选给出无歧义裁决。

这种门禁适合：

- 有限候选；
- 完整可计算谓词；
- 精确算术；
- 可重复执行；
- 失败能定位到具体违反项。

它不能证明搜索空间已经穷尽，也不能从“未找到”推出“不存在”。

### Partial formal certificate

对涵盖任意三角形、任意正电荷和任意正指数的 Maxwell 候选，Lean 只检查已经编码的代数核心。即使形式化片段通过，也不能自动覆盖：

- 从物理问题到数学表示的翻译；
- 几何、分析和拓扑之间的桥梁；
- 量词、退化情况和边界条件；
- 被遗漏但未进入形式系统的假设；
- 结果是否已经存在于文献中。

**可复用规则：验证器只能证明其合同所表达的义务，不能替代未编码的证明桥梁。**

### Independent expert review

专家评审负责检查形式化与计算之外的内容：问题表述是否正确、论证链是否完整、概念翻译是否有效、反例空间是否充分、结果是否新颖且重要。专家判断仍可能出错，因此它不是绝对权威，但它覆盖的义务不能由一次程序通过代替。

[推论] 对一般 Agent 工作流，可把验证证据写成覆盖向量，而不是单一 `passed=true`：

```text
claim_scope
input_coverage
deterministic_checks
formalized_obligations
unformalized_bridges
counterexample_search
prior_art_status
independent_review_status
known_failures
```

这只是知识表示建议，不是新的 Hermes 默认 schema。

## Negative results are bounded knowledge assets

“失败”只有在范围明确时才具有长期价值。Hadamard 案例的可迁移价值不在于作者没有找到矩阵，而在于他报告了已排除区域、失败构造族、无效的非存在性工具、校准检查和仍未解决的问题。

可复用的负面记录至少应说明：

- 检验的精确命题或搜索区域；
- 使用的构造族、约束与对称性；
- 执行的验证器和版本；
- 失败意味着候选错误、路线不适用，还是预算耗尽；
- 哪些空间从未被搜索；
- 哪些结论明确不能推出；
- 下一步需要新算力、新数据，还是新结构/前提。

未界定范围的“我们试过了”不是知识；有可重放边界的证伪和失败分支可以防止重复劳动。

## Status ledger before narrative confidence

高通量研究循环应让每个主张携带显式状态，而不是让流畅论述替代证据。最小状态可以区分：

- `candidate`：模型或人提出，尚未通过目标门禁；
- `falsified`：在声明范围内被确定性反例或检查否定；
- `finite-verified`：指定有限实例通过完整检查；
- `partially-formalized`：部分义务进入形式系统并通过；
- `expert-reviewed`：独立领域专家检查了完整主张；
- `novelty-checked`：完成了足以支持当前优先权判断的文献审查；
- `accepted`：满足目标共同体约定的证据与发布门槛。

状态之间不是自动晋级关系。例如，`partially-formalized` 不能隐式升级成 `expert-reviewed` 或 `accepted`。

## Human role moves upstream and downstream

当候选生成变便宜，人类工作的稀缺部分会集中在：

- 选择值得研究的问题；
- 提出或识别有解释力的新前提；
- 设计覆盖真实主张的验证器；
- 判断局部结果是否改变整体理论地图；
- 消化、重构并解释机器生成的论证；
- 发现未形式化桥梁和不恰当外推；
- 分配有限的同行评审注意力；
- 对贡献、错误和发布承担责任。

原文借用“归纳—演绎—溯因”解释这种分工，但该部分来自一篇 position paper，不应固化成“LLM 无法溯因”的能力定理。更稳妥的保留方式是：**没有明确评价函数或现成框架时，扩大搜索并不等于提出了正确的新问题结构。**

## Skill formation and reviewer supply

模型可通过多表示解释帮助非专家形成 working literacy，但“能够跟随解释”不等于“能够独立重构、证伪和评审”。这与 [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation) 的撤除辅助与贡献测试一致。

数学研究还增加了一个制度层风险：初级文献工作、简单引理和首次证明既是产出，也是培养未来研究者与审稿人的训练。如果这些阶段被完全替代，短期吞吐增加可能伴随长期评审供给下降。

该风险目前是合理担忧而非已证实因果结论。适合保留的检查问题是：

- 撤除 AI 后，研究者能否重构核心论证？
- 能否指出最薄弱的桥梁并设计证伪条件？
- 能否区分自身判断、模型建议和确定性证据？
- 工作流是在提供支架，还是跳过形成专业判断的过程？

## Knowledge infrastructure implications

当候选主张增长快于同行评审能力时，仅保存聊天记录或 PDF 会造成重复工作和错误扩散。长期知识对象更适合包含：

- 规范化主张与显式假设；
- 状态、日期和 novelty 边界；
- 依赖的定义、引理与外部结果；
- 精确计算范围和形式化覆盖；
- 人机贡献与 artifact provenance；
- 已知反例、攻击、失败分支和开放义务；
- 面向专家与普通读者的不同解释层。

这与 [agent-research-evidence-gate](/concepts/agent-research-evidence-gate) 的“证据达标后再综合”、[agent-self-validation-loops](/concepts/agent-self-validation-loops) 的“目标—反馈—迭代—停止”、[constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop) 的“受限候选空间加客观 evaluator”互补。本页只负责**科学候选丰沛后，知识准入与评审注意力变得稀缺**这一层，不复制这些页面的工程规则。

## Empirical case: ScientistTwo and the cost of closing the loop

Jaehyun Nam 等人的 [ScientistTwo 预印本](https://arxiv.org/pdf/2609.19644)（arXiv:2609.19644v1，2026-09-17）研究的是给定已有顶会论文对应的问题后，自动提出改进方案，而不是由系统独立选择值得研究的问题。其流程将局限诊断、假设生成、子集筛选与完整基准测试、消融剪枝、模拟同行评审及补充实验串成有界循环；这为“候选生成之后，验证和评审仍是瓶颈”提供一个具体工程案例，不替代本页对知识准入的分层判断。

**作者报告的范围内结果**：在选取的 107 个机器学习研究问题中，86 个相对原有人类方法取得改进（80.4%），平均相对提升 25.2%。论文用 ScholarPeer 和开发时未使用的 Stanford Agentic Reviewer 评估生成论文，分别报告 91.9% 和 72.1% 的模拟接受率；这不是实际会议录用率，前者还参与了论文迭代。另有 9 名人类评审者评价 33 篇生成论文：整体成熟度单独评分为 3.7/5，与人类论文比较的整体偏好为 3.0/5（持平），不能概括为“超越人类评审”。同一批 NeurIPS 来源问题的成本分析报告平均每项约 2.5 天、3,765 美元（模型调用及虚拟机），说明多轮实验和评审反馈并非低成本默认流程。

**证据边界**：上述数字是作者在自选任务、模型和评审器下的报告；本页未重跑代码、核查全部 71 页附录，亦未获得真实会议录用结果。PDF 正文至结论已核读，图表及嵌入的样例论文页存在文本提取局限；早先自动摘要误称正文没有成本分析和人类评审，不能将该摘要当作原始证据。可迁移的是“子集筛选后再扩大实验、把消融和反驳落成可执行验证、区分模拟评分与专家/共同体认可”的判断框架，不是其成功率、评审阈值或整套昂贵多智能体流程。

## Evidence boundary

### Primary-source points independently checked

- arXiv:2607.27197 的摘要确实报告五个正点电荷产生至少 24 个非退化临界点，并反驳一般 Maxwell 猜想；论文披露构造想法由模型建议、数学细节由作者验证。
- arXiv:2607.28785 的摘要和 Theorem 1.1 确实把三个正电荷的上界从 12 改进到 6，并披露 Claude 辅助及作者独立验证。
- Google DeepMind 官方 AlphaEvolve 文章确实报告“50 多个问题、约 75% 重现已知最佳、约 20% 改进”，但这是组织自报结果，只能保留为来源特定证据。
- OpenAI 官方页面确实报告模型提出单位距离反例并由外部数学家检查；这不能外推为一般自治科研能力。

### Not independently established

- 作者的 Hadamard 44 个关闭区域、9 个开放问题和全部代码校准结果未在本次入库中重跑。
- 四平衡点 Maxwell 候选没有专家评审或完整形式化，因此保持 `candidate`。
- “LLM 不能溯因”、AI 会削弱数学家培养管线，以及未来 claim registry 的制度效果都不是本文证明的经验事实。

## Layer routing

- **Wiki**：保留来源、概念、验证层级、负面结果边界与制度问题。
- **Memory**：不写；这不是用户偏好、环境事实或工具 quirk。
- **Skill/reference**：暂不升级；现有验证、研究证据和 evaluator 页面已拥有工程规则，单篇个人案例不足以新增默认门禁。
- **Runtime/config/cron/MCP/wrapper/gateway/provider/profile**：不改变；本文不授权任何自动化扩张。
- **Project validation**：不新建；只有真实科研或 Agent 项目出现“候选产量超过验证能力”的重复问题时，才值得定义项目级 claim ledger 或覆盖向量。

## Relations

- refines: [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- related: [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop)
- related: [agent-research-evidence-gate](/concepts/agent-research-evidence-gate)
- related: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- related: [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation)
- related: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)

