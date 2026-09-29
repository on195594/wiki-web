---
title: Agent Harness 搜索正则化
created: 2026-09-29
updated: 2026-09-29
type: concept
tags:
  - agent
  - harness
  - optimization
  - evaluation
  - validation
sources:
  - raw/articles/rrsi-harness-search-regularization-2026-09.md
  - https://arxiv.org/abs/2609.24972v2
status: stable
description: 区分可编辑的 Agent harness 与受约束的候选搜索、评估和采纳过程，避免演化基准过拟合。
aliases:
  - agent-harness-search-regularization
  - RRSI
---

# Agent Harness 搜索正则化

## Summary

自动演化 Agent harness 时，训练基准上的分数上涨并不等于可迁移的改进。RRSI 的思路是**不预先锁死提示词、工具、控制流或上下文组件，而约束“提出什么改动、如何筛选、何时保留”**。这是一项特定模型和评测条件下的研究机制，不是通用的自动修改授权。

## 两侧约束

- **提案侧**：前期允许少量协同编辑，后期收缩到容易归因的单项编辑；保留候选假设、diff、分数与 token 成本的账本；在收益落入噪声带且搜索停滞时，转向未探索组件。
- **采纳侧**：在昂贵评估前审查任务答案或基准特化逻辑；用未修改 harness 的重复试验估计噪声，而非采信单次微小增益；让额外推理 token 接受收益约束，并审视已失去边际价值的组件。项目主页**演化探索器末尾**明示：噪声带内候选仅因节省 token 或新增结构组件而可获采纳；这是采纳例外，不是前述“停滞时探索未修改组件”的提案策略。
- **迁移检验**：冻结模型、工具和评测设置，将只在一个拆分上演化的最终 harness 原样放到未见任务，连同成功率、推理成本和候选搜索成本一起看；避免把演化集分数当成唯一目标。

## 来源证据与读数边界

`rrsi-harness-search-regularization-2026-09` 记录了项目主页的结构化数据：Harvey LAB 相关表格中 agentic-workspace OOD 平均分由 H0 的 39.7 到 RRSI 的 43.6；Terminal-Bench 2.1 的 40 个候选中 5 个获采纳、35 个被筛掉。这些是作者在指定 benchmark、Claude Opus 4.8 等设置下报告的结果，不是任何新任务上的保证。首个获采纳编辑增加了 token，而最终 harness 相比未正则化演化更省 token；必须分清单项增量与最终对照。主页与 arXiv v2 摘要在 OOD benchmark 数量及 token 节省幅度上表述不同，不能混算或将任何一个数值当成通用阈值。

## 适用判断与限制

[推论] 当一个项目已经有可重复的基线、未见任务集、成本计量与回滚边界，却发现连续优化只抬高演化集分数时，可借鉴“候选账本 → 防泄漏 → 噪声与成本对照 → 未见任务检验”的**评估视角**。单篇外部结果不证明在不同模型、harness、预算或生产流量中同样有效；critic 也可能误判，重复评估本身有成本。没有本地对照实验和单独授权，不据此建立自动改写 Skill、prompt、runtime 或全局采纳门禁。

## 与邻近概念的边界

- [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) 管经验与 Skill 如何留证、晋升或回滚；此页只讨论 harness 候选搜索和性能迁移。
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 管应该观察哪些质量与成本维度；此页补充自我改动期间如何筛选候选。
- [agent-self-validation-loops](/concepts/agent-self-validation-loops) 管单次任务的目标—反馈—验证；此页不把一次任务验证等同于跨任务分布外泛化。

## Related

- [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops)
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- [index](/)

