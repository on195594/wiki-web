---
title: Dijkstra EWD667 vs 2026 AI Programming Article
created: 2026-04-16
updated: 2026-04-16
type: comparison
tags:
  - comparison
  - llm
  - workflow
  - research
sources:
  - raw/articles/dijkstra-ewd667-natural-language-programming-1978.md
  - raw/articles/arixzone-dijkstra-ai-programming-2026-03-31.md
status: stable
description: 比较 Dijkstra EWD667 与 2026 AI 编程观点在自然语言、形式化和程序可靠性上的异同。
aliases:
  - ewd667-vs-ai-programming
---

# Dijkstra EWD667 vs 2026 AI Programming Article

## Summary
这页对照 Dijkstra 在 EWD667 中对“自然语言编程”的原始论证，和 AriXZone 在 2026 年对 AI 编程现实的再解释。
结论是：后者并没有推翻前者，而是在 AI 辅助编程场景中重新验证了“形式化约束优先于自然语言便利”的核心判断。

## Comparison frame
对照对象：
- `[[dijkstra-ai-programming-formalization]]` 所基于的 2026 文章
- EWD667 原文 `raw/articles/dijkstra-ewd667-natural-language-programming-1978.md`

对照问题：
- Dijkstra 当年真正说了什么
- 2026 文章扩展了什么
- 哪些观点是一致的
- 哪些是 2026 环境下的新变量

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
- AI 推翻的是“形式化很贵，所以大家不做”的现实成本

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
- related: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)

## Related
- [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization)
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`

