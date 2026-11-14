---
title: Dijkstra on AI Programming Formalization
created: 2026-04-16
updated: 2026-11-13
type: concept
tags:
  - llm
  - workflow
  - research
  - note
sources:
  - raw/articles/dijkstra-ewd667-natural-language-programming-1978.md
  - raw/articles/arixzone-dijkstra-ai-programming-2026-03-31.md
  - raw/articles/infoworld-ai-coding-three-skills-2026-04-16.md
  - raw/articles/towardsdatascience-vibe-coding-spec-driven-development-2026-05-12.md
  - raw/articles/thenewstack-codeplain-spec-driven-regenerative-code-2026-06-26.md
  - raw/articles/kdnuggets-specification-engineering-2026-08-10.md
  - docs:https://www.cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html
  - docs:http://www.cs.toronto.edu/~chechik/courses05/csc410/readings/dijkstra.pdf
  - docs:https://arxiv.org/abs/2406.12952
  - docs:https://arxiv.org/html/2610.12289v1
  - docs:https://doi.org/10.1145/363235.363259
status: stable
description: 整理 Dijkstra 思想对 AI 编程中规格化、形式化和自然语言边界的启发。
aliases:
  - dijkstra-ai-programming
volatility: low
---

# Dijkstra on AI Programming Formalization

## Summary
这篇文章（[arixzone-dijkstra-ai-programming-2026-03-31](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/arixzone-dijkstra-ai-programming-2026-03-31.md)）对照 Edsger W. Dijkstra 1978 年的经典手稿 [dijkstra-ewd667-natural-language-programming-1978](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/dijkstra-ewd667-natural-language-programming-1978.md)（[EWD667 原文转录](https://www.cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html)），给出一个核心结论：AI 编程并没有推翻 Dijkstra 对“自然语言编程”的批判，反而再次证明了形式化约束与窄接口（Narrow Interfaces）的重要性。
真正可持续的 AI 编程模式不是让自然语言取代规格、类型、测试和接口，而是将 LLM 作为从模糊自然语言意图到可验证形式化契约（前置/后置条件谓词、类型签名、可执行测试与规约文档）的启发式编译器。

## Core thesis
作者把 Dijkstra 的历史观点重新放到 2026 年的 AI 编程环境中，得到一个很强的结论：
- 自然语言适合表达意图
- 但不适合直接承载完整的工程约束
- AI 的价值不在于“听懂模糊话术就自动写对代码”
- 而在于帮助人类把模糊意图收敛成 spec、测试、验收标准和接口定义

## Dijkstra's interface argument and formal verification roots
以下关键判断，均可直接回溯至 Dijkstra 的一手文献与形式化程序推导体系：
- **形式化符号不是负担，而是认知压缩的特权**：在 [dijkstra-ewd667-natural-language-programming-1978](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/dijkstra-ewd667-natural-language-programming-1978.md)（[EWD667](https://www.cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html)）中，Dijkstra 回顾数学史指出，古希腊数学因停留在口述与图形活动而陷入停滞，中世纪经院哲学试图用日常言辞追求精确也归于徒劳，近代科学之所以能兴起，正得益于 Vieta、Descartes、Leibniz 与 Boole 建立的形式化符号系统——形式文本的合法变换只需满足极少数简单语法规则，能高效排除日常语言中极易混入的荒谬（nonsense）。
- **自然语言的“自然”会掩盖矛盾与逻辑空洞**：EWD667 指出，母语之所以让人觉得“自然”，恰恰在于人们可以用它毫不费力地写出“荒谬性并不显眼”的句子，甚至把“编程的容易程度”错误等同于“犯下未被察觉错误的容易程度”（equating the ease of programming with the ease of making undetected mistakes）。
- **接口改变可能同时增加两侧工作量**：EWD667 指出，选择人机接口不是对固定工作量的零和切分，跨接口协同与沟通也有成本；接口改变可能使两侧工作量都增加。这是定性论证，不是“接口越宽成本必然单调增加”的定律。`[推论]` 若将沟通成本单独记账，可用以下示意分解（不是 EWD667 原文方程）：
  $$W_{\text{total}}(I) = W_{\text{human}}(I) + W_{\text{machine}}(I) + W_{\text{comm}}(I)$$
  其中人机工作项不重复计入单列的沟通成本。在 LLM 工作流中，无约束自然语言可能增加意图消歧与结果核查负担，具体变化需要项目证据。
- **公理语义与最弱前置条件谓词变换器（Weakest Precondition, $wp(S, R)$）**：结合 C. A. R. Hoare（1969，*Communications of the ACM*，[*An Axiomatic Basis for Computer Programming*](https://doi.org/10.1145/363235.363259)，`{P} S {Q}`）与 Dijkstra（1975，*Communications of the ACM*，[*Guarded Commands, Nondeterminacy and Formal Derivation of Programs*](http://www.cs.toronto.edu/~chechik/courses05/csc410/readings/dijkstra.pdf)）的形式化程序演算，程序 $S$ 的语义由**最弱前置条件算子** $wp(S, R)$ 严格刻画——即保证 $S$ 正常终止且终态满足后置谓词 $R$ 的全部初始状态集合（例如 $wp(\texttt{skip}, R) = R$，$wp(\texttt{x := E}, R) = R_E^x$，循环构造 $\texttt{DO}$ 则依赖不变量关系 $P$ 与严格递减的整数变体函数 $t$ 证明终止性与正确性）。`[推论]` 在 AI 编程中，自然语言提示词 $u \in \mathcal{L}_{\text{nat}}$ 是文本，并非概率分布，也不能自动替代明确的前置/后置条件。可先将意图整理为窄接口契约 $(P_{\text{pre}}, R_{\text{post}}, \mathcal{T}_{\text{schema}}, \mathcal{E}_{\text{tests}})$，为生成与验收提供锚点；类型或有限测试通过不等于完成 $wp$ 意义上的正确性证明，也不保证迭代收敛（参见 [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles) 与 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)）。

这些判断放到 AI 编程里，仍然成立。

## How the article maps to AI coding reality
### 1. 需求幻觉
人在提示词里以为自己表达清楚了，AI 也像是“理解了”，但最后交付往往漏关键约束。
这说明自然语言很擅长制造“已经沟通完成”的错觉。

### 2. 架构缺失
当约束没有被形式化，AI 往往更容易生成“局部能跑”的代码，而不是长期可维护的工程结构。

### 3. 上下文污染
对话拉长后，错误上下文会持续污染后续生成，导致反复返工。

## From vibe coding to planned coding
这篇文章最有价值的地方，不是单纯批评 Vibe Coding，而是给出了一个更稳的替代思路：

自然语言描述意图 → AI 协助细化 → 人把结果收敛为 spec、测试、验收标准。

也就是说：
- 自然语言负责低门槛输入
- 形式化产物负责高强度验证
- AI 负责把两者连接起来

## Spec as the durable source of truth (2026 evidence)
[towardsdatascience-vibe-coding-spec-driven-development-2026-05-12](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/towardsdatascience-vibe-coding-spec-driven-development-2026-05-12.md)、[kdnuggets-specification-engineering-2026-08-10](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/kdnuggets-specification-engineering-2026-08-10.md) 与 [thenewstack-codeplain-spec-driven-regenerative-code-2026-06-26](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/thenewstack-codeplain-spec-driven-regenerative-code-2026-06-26.md) 从不同工程切面补充了同一原则的现代证据：当项目跨多轮会话、多 agent 或多人协作时，结构化规约（spec / roadmap / validation criteria）应成为持久 source of truth，而不是易腐的聊天历史。

这带来四条关键实践与验证边界：
- **从 Prompt Engineering 转向 Specification Engineering**（[kdnuggets-specification-engineering-2026-08-10](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/kdnuggets-specification-engineering-2026-08-10.md)）：提示工程关注“如何发问以获得回答”，而规约工程定义“模型、用户与评测器如何就正确完成达成一致”（涵盖目标、上下文、允许输入、输出结构、负向约束、评测标准、边界条件与验证步骤八要素）。
- **防范规约投机（Specification Gaming）与单参考测试盲区**：当规约或测试欠定时，编码 Agent 常生成仅通过表面测试却破坏隐含约束的补丁。Niels Mündler 等（2024/2025，NeurIPS 2024，[*SWT-Bench: Testing and Validating Real-World Bug-Fixes with Code Agents*](https://arxiv.org/abs/2406.12952)）基于真实 Python Issue–PR 构造 SWT-Bench（当前论文 §3.2 报告筛选后 1,983 个实例），并在其受测配置中发现，将自然语言 Issue 转化为“修复前失败、修复后通过”（$\text{Fail}\to\text{Pass}$）的可执行复现测试并用其过滤候选补丁，可将 SWE-Agent 的精确率翻倍；而 [*TestPrism: Rethinking Test Evaluation Beyond a Single Reference*](https://arxiv.org/html/2610.12289v1)（2026）对 286 条失败测试生成轨迹的拆解进一步警示，单参考测试仍会因覆盖缺口（`34.6%`）、错误/过弱断言（`50.0%`）和执行逻辑错误（`15.4%`）漏判无效补丁，因此测试规约还需兼顾邻近反例与多候选交叉核验。
- **规避手改生成代码的出处债务（Provenance Debt）**（[thenewstack-codeplain-spec-driven-regenerative-code-2026-06-26](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/thenewstack-codeplain-spec-driven-regenerative-code-2026-06-26.md)）：若把模型生成代码当作主维护物并直接手改代码而不回写规约，修改背后的业务原因与约束会在下一轮 Agent 对话或重新生成中丢失（形成出处债务）。实现中发现的新约束应先回写 spec，再同步更新代码与测试；但数据库迁移、生产配置、密钥与安全策略等不可逆高风险面绝不能盲目依赖全量代码重生成。
- **Agent 速度对规约债务的放大效应**（[towardsdatascience-vibe-coding-spec-driven-development-2026-05-12](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/towardsdatascience-vibe-coding-spec-driven-development-2026-05-12.md)）：Agent 的高吞吐生成会让模糊需求比人工编码更快、更广地扩散为结构性返工。

## Practical implication
对 AI 编程工作流的直接启示是：
- 不要把提示词当成完整规格
- 重要任务必须落到 spec、测试和验收标准
- TDD、CI/CD、接口定义在 AI 时代更重要，而不是更不重要
- AI 最适合降低形式化生产成本，而不是替代形式化本身

## AI coding shifts skill upstream
InfoWorld 的文章 [infoworld-ai-coding-three-skills-2026-04-16](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/infoworld-ai-coding-three-skills-2026-04-16.md) 补充了同一原则的工程表述：当 AI 接管更多代码生成后，开发者的能力重心会从“直接敲代码”上移到三件事：
- 把需求、架构、接口、异常、性能和资源约束表达成高质量上下文
- 审查和验证 AI 输出，而不是相信模型自称正确
- 保持对代码和系统复杂性的独立判断，避免长期依赖生成器形成认知负债

这不是和“形式化约束仍是核心”相冲突，而是它的实践后果：prompt/context 可以作为意图入口，但真正承担工程可靠性的仍然是 spec、测试、接口、review 和可回滚验证。

## Why it matters for AI Agent
这篇文章的观点和 [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture) 很一致：
- 长期知识不能只停留在聊天层
- 模糊输入需要被压缩成稳定结构
- 可靠系统依赖分层、约束和验证

它也能解释为什么 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 要求先查 wiki、再补外部资料、再回写：
因为真正可靠的系统，必须不断把模糊对话收敛为结构化资产。

## Takeaway
最重要的一句可以概括成：
AI 可以协助草拟形式化产物，但不替代形式化；是否降低总成本，仍须计入审查与验证。

## Relations

- depends_on: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- related: [dijkstra-ewd667-vs-ai-programming-article](/comparisons/dijkstra-ewd667-vs-ai-programming-article), [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation), [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)

