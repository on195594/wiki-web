---
title: Dijkstra EWD667 vs 2026 AI Programming Article
created: 2026-04-16
updated: 2026-11-13
type: comparison
tags:
  - comparison
  - llm
  - workflow
  - research
sources:
  - raw/articles/dijkstra-ewd667-natural-language-programming-1978.md
  - raw/articles/arixzone-dijkstra-ai-programming-2026-03-31.md
  - raw/articles/kdnuggets-specification-engineering-2026-08-10.md
  - raw/articles/thenewstack-codeplain-spec-driven-regenerative-code-2026-06-26.md
  - docs:https://www.cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html
  - docs:http://www.cs.toronto.edu/~chechik/courses05/csc410/readings/dijkstra.pdf
status: stable
description: 比较 Dijkstra EWD667 与 2026 AI 编程观点在自然语言、形式化和程序可靠性上的异同。
aliases:
  - ewd667-vs-ai-programming
volatility: low
---

# Dijkstra EWD667 vs 2026 AI Programming Article

## Summary
这页对照 Dijkstra 在 EWD667 中对“自然语言编程”的原始论证，和 AriXZone 在 2026 年对 AI 编程现实的再解释。
结论是：后者并没有推翻前者，而是在 AI 辅助编程场景中重新验证了“形式化约束优先于自然语言便利”的核心判断。

## Comparison frame
对照对象：
- EWD667 原文 [dijkstra-ewd667-natural-language-programming-1978](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/dijkstra-ewd667-natural-language-programming-1978.md)（Edsger W. Dijkstra，1978，[*On the foolishness of "natural language programming"*](https://www.cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html)）及其形式化程序演算基础（[Dijkstra 1975 `wp(S, R)`](http://www.cs.toronto.edu/~chechik/courses05/csc410/readings/dijkstra.pdf)）
- [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization) 所基于的 2026 文章 [arixzone-dijkstra-ai-programming-2026-03-31](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/arixzone-dijkstra-ai-programming-2026-03-31.md)，并结合 2026 规约工程与再生式代码讨论（[kdnuggets-specification-engineering-2026-08-10](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/kdnuggets-specification-engineering-2026-08-10.md)、[thenewstack-codeplain-spec-driven-regenerative-code-2026-06-26](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/thenewstack-codeplain-spec-driven-regenerative-code-2026-06-26.md)）

对照问题：
- Dijkstra 当年真正说了什么（含其窄接口定性成本论证与数学史论证）
- 2026 文章在 LLM 编码时代扩展了什么
- 哪些核心不变量跨越 48 年保持一致
- 哪些是 2026 环境下的新变量（形式化生产成本下降 vs. 规约投机与出处债务）

## Structured comparison matrix

| 对比维度 | Dijkstra EWD667 (1978) 与形式化演算 | 2026 AI 编程文章与规约工程实践 | 跨时代不变性与新变量裁决 |
| --- | --- | --- | --- |
| **自然语言的本质缺陷** | 母语的“自然性”源于人们能轻易写出荒谬性不显眼的句子；把口述模糊性交给机器不会自动产生精确语义 | 提示词制造“需求已说清”的幻觉；欠定输入诱发模型盲目脑补与规约投机（[kdnuggets-specification-engineering-2026-08-10](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/kdnuggets-specification-engineering-2026-08-10.md)） | **同向印证**：自然语言适合低门槛启发，不适合直接充当完备执行契约 |
| **跨接口工作量规律** | 接口选择不是固定工作量的零和转移；改变接口可能增加两侧工作量，因此偏好 **Narrow Interfaces**。原文未给成本方程 | 对话拉长与上下文放宽可能增加消歧和返工；可用类型化窄接口约束边界（[typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)） | **工程推论**：更大的 Token 窗口不自动消除沟通成本；成本变化需实测 |
| **形式化符号的角色** | 从古希腊几何与中世纪经院修辞到 Vieta/Descartes/Leibniz/Boole 代数符号及 $wp(S, R)$ 最弱前置条件，形式符号是排除 nonsense 的特权工具 | Spec、JSON Schema、类型签名、单元测试（TDD）与 CI/CD 成为约束 AI 生成物、防止回归的持久锚点（[hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)） | **工程类比**：类型/测试门禁提供部分机械检验，但测试通过不等于形式化正确性证明 |
| **错误暴露与失败模式** | 批评把“编程容易度”等同于“犯下未被察觉错误的容易度”；推崇编译期/形式化显式报错而非静默错误结果 | “Vibe Coding”产出局部能跑但架构缺失的代码；手改生成代码而不更新 spec 会累积出处债务（[thenewstack-codeplain-spec-driven-regenerative-code-2026-06-26](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/thenewstack-codeplain-spec-driven-regenerative-code-2026-06-26.md)） | **新变量显现**：AI 降低了生成代码门槛，却抬高了隐蔽逻辑错误与出处断层的审查压力 |
| **形式化的生产成本** | EWD667 论证形式符号的价值，未量化形式化成本，也未断言当时完全没有机械化辅助 | LLM 可协助草拟候选 spec、接口定义与测试用例，人负责审查 | **工程推论**：AI 可能降低草拟成本，但不能据此认定总验证成本已下降 |
| **人类能力与“新文盲”警示** | EWD667 末段警示“The New Illiteracy”：缺乏智识训练使许多人连母语精确表达都退化，技术报告充斥无意义空话 | 长期无批判接受 AI 生成代码会导致认知替代与验证能力退化（[ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation)） | **风险升级**：LLM 能规模化生产流畅空话与似是而非的代码，人类独立规格化与核验能力更稀缺 |

## Side-by-side comparison
### 1. 对自然语言的判断
Dijkstra：
- 自然语言擅长隐藏模糊和荒谬
- “自然”并不意味着适合精确控制机器

2026 文章：
- 提示词和对话式编程会制造“已经说清楚”的错觉
- 需求幻觉和上下文污染是这一点在 AI 编程时代的具体表现

结论：
- 两者完全同向
- 2026 文章只是把 Dijkstra 的抽象批判翻译成了现代开发者能感知的失败模式

### 2. 对形式化的判断
Dijkstra：
- 形式化符号不是负担，而是特权
- 精确定义和窄接口能减少 nonsense

2026 文章：
- spec、测试、验收标准、接口定义才是稳定工作流的支点
- TDD 和 CI/CD 在 AI 时代更重要

结论：
- 2026 文章基本是在工程实践层重复 Dijkstra 的思想
- 只不过把“形式化符号”翻译成了现代软件工程中的可执行约束

### 3. 对接口宽度的判断
Dijkstra：
- 宽接口不只是转移工作量，往往会增加总工作量
- 因而更偏好 narrow interfaces

2026 文章：
- 对话越长、上下文越宽，AI 越容易被污染
- 需求和架构约束不收窄，就会导致返工

结论：
- 宽接口代价在 LLM 时代体现得更明显
- token 上下文窗口并没有消灭这条规律，只是把它概率化了

### 4. AI 是否推翻了 Dijkstra
Dijkstra 原文没有预见 LLM，但他的逻辑并未被推翻。

2026 环境新增的变量是：
- AI 可以帮助人类更快地生成形式化产物
- 自然语言可以成为低门槛输入层
- 但最终仍需落到 formal artifacts 才能可靠执行

结论：
- AI 推翻的不是形式化
- AI 可能降低规约与测试的草拟成本；是否降低总成本仍需计入审查、验证与返工，不能由这些观点文章直接断定

## What the 2026 article adds
2026 文章相对 EWD667 的新增价值主要有三点：
- 把抽象批判映射到需求幻觉、架构缺失、上下文污染
- 明确提出从 Vibe Coding 转向 Planned Coding
- 提出 AI 的最佳角色是“把模糊意图翻译成可验证结构”

## What remains unchanged
不变的核心规律：
- 编程不是说话，而是消除模糊
- 形式化不是历史包袱，而是认知压缩工具
- 接口变宽通常意味着成本上升，而不是自动简化

## Verdict
最终判断：
- EWD667 给出的是原则层结论
- 2026 文章给出的是 AI 时代的症状描述与工程化翻译
- 两者不是冲突关系，而是“原理 → 现代实践映射”的关系

## Relations

- refines: [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization)
- related: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)

