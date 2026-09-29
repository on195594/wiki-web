---
title: Dijkstra on AI Programming Formalization
created: 2026-04-16
updated: 2026-08-04
type: concept
tags:
  - llm
  - workflow
  - research
  - note
sources:
  - raw/articles/arixzone-dijkstra-ai-programming-2026-03-31.md
  - raw/articles/infoworld-ai-coding-three-skills-2026-04-16.md
  - raw/articles/towardsdatascience-vibe-coding-spec-driven-development-2026-05-12.md
status: stable
description: 整理 Dijkstra 思想对 AI 编程中规格化、形式化和自然语言边界的启发。
aliases:
  - dijkstra-ai-programming
---

# Dijkstra on AI Programming Formalization

## Summary
这篇文章的核心结论是：AI 编程并没有推翻 Dijkstra 对“自然语言编程”的批判，反而再次证明了形式化约束的重要性。
真正可持续的 AI 编程模式不是让自然语言取代规格、测试和接口，而是用 AI 把模糊意图更快地转化为可验证的形式化产物。

## Core thesis
作者把 Dijkstra 的历史观点重新放到 2026 年的 AI 编程环境中，得到一个很强的结论：
- 自然语言适合表达意图
- 但不适合直接承载完整的工程约束
- AI 的价值不在于“听懂模糊话术就自动写对代码”
- 而在于帮助人类把模糊意图收敛成 spec、测试、验收标准和接口定义

## Dijkstra's three claims
文章提炼出的三个关键判断：
- 形式化符号不是负担，而是文明进步的必要工具
- 自然语言的“自然”会掩盖矛盾与逻辑空洞
- 接口越宽，沟通和验证成本越高

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
``towardsdatascience-vibe-coding-spec-driven-development-2026-05-12`` 补充了这个方向的更具体工程证据：当项目跨多轮会话、多 agent 或多人协作时，spec / roadmap / validation 文档应成为持久 source of truth，而不是聊天历史。

这带来三条实践判断：
- spec / roadmap / validation documents are the durable source of truth across sessions and agents, not chat history
- implementation discoveries should update the spec first, then rework implementation and tests
- agent speed amplifies spec debt because ambiguous requirements propagate faster and wider than with manual coding

## Practical implication
对 AI 编程工作流的直接启示是：
- 不要把提示词当成完整规格
- 重要任务必须落到 spec、测试和验收标准
- TDD、CI/CD、接口定义在 AI 时代更重要，而不是更不重要
- AI 最适合降低形式化生产成本，而不是替代形式化本身

## AI coding shifts skill upstream
InfoWorld 的文章 ``infoworld-ai-coding-three-skills-2026-04-16`` 补充了同一原则的工程表述：当 AI 接管更多代码生成后，开发者的能力重心会从“直接敲代码”上移到三件事：
- 把需求、架构、接口、异常、性能和资源约束表达成高质量上下文
- 审查和验证 AI 输出，而不是相信模型自称正确
- 保持对代码和系统复杂性的独立判断，避免长期依赖生成器形成认知负债

这不是和“形式化约束仍是核心”相冲突，而是它的实践后果：prompt/context 可以作为意图入口，但真正承担工程可靠性的仍然是 spec、测试、接口、review 和可回滚验证。

## Why it matters for Hermes
这篇文章的观点和 `[hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)` 很一致：
- 长期知识不能只停留在聊天层
- 模糊输入需要被压缩成稳定结构
- 可靠系统依赖分层、约束和验证

它也能解释为什么 `[hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)` 要求先查 wiki、再补外部资料、再回写：
因为真正可靠的系统，必须不断把模糊对话收敛为结构化资产。

## Takeaway
最重要的一句可以概括成：
AI 没有让形式化消失，而是让形式化变得更便宜。

## Related
- [dijkstra-ewd667-vs-ai-programming-article](/comparisons/dijkstra-ewd667-vs-ai-programming-article)
- `infoworld-ai-coding-three-skills-2026-04-16`
- [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation)
- `towardsdatascience-vibe-coding-spec-driven-development-2026-05-12`
- [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`

