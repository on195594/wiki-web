---
title: LLM Engineering Knowledge Map
created: 2026-05-17
updated: 2026-05-17
type: concept
tags:
  - llm
  - architecture
  - workflow
  - evaluation
  - deployment
sources:
  - raw/articles/towardsdatascience-must-know-topics-llm-engineer-2026-05-09.md
status: stable
description: 提供 LLM 工程知识主题地图，用于定位模型、数据、评估、部署和治理能力。
aliases:
  - llm-knowledge-map
---

# LLM Engineering Knowledge Map

## Summary

LLM 工程不是一次模型调用，也不是单点 prompt 技巧，而是一条从文本表示、模型架构、训练对齐、推理优化、事实约束到生产评估的系统链路。可靠的 LLM 系统需要同时理解这些层的职责边界：输入如何变成向量，模型如何生成，输出如何被约束，质量如何被评估，线上行为如何被持续监控。

这页编译自 `[[towardsdatascience-must-know-topics-llm-engineer-2026-05-09]]`，并作为 `[[llm-context-engineering-layer]]`、`[[production-ai-agent-evaluation-framework]]` 和 `[[llm-summary-identification-step]]` 的上层导航地图。

## Core principle

不要把 LLM 能力理解成“一个大模型会回答问题”。

更准确的工程视角是：LLM 系统由多层转换和控制组成，每层都可能引入失败模式，也都需要独立的验证和治理。模型本身只负责概率生成；工程系统必须补上上下文选择、事实约束、推理成本、输出格式、评估和监控。

## LLM engineering layers

### 1. Representation layer

负责把离散文本转成模型可处理的向量输入。

关键组件：
- Tokenization：常见做法是 Byte-Pair Encoding，将文本拆为常见且有用的子词单元。
- Embeddings：把 token ID 映射到连续向量空间，让语义相近的 token 在向量空间中接近。
- Positional encoding：给 Transformer 注入顺序信息，使模型能区分 token 的相对或绝对位置。

工程含义：如果不了解 token、embedding 和位置编码，就很难判断上下文长度、分块策略、检索片段和成本为什么会影响系统行为。

### 2. Model architecture layer

负责建模 token 之间的关系。

关键组件：
- Transformer：现代 LLM 的核心架构。
- Attention：通过 Query、Key、Value 计算 token 间相关性。
- Multi-head attention：让不同注意力头学习不同关系。
- Encoder-only、decoder-only、encoder-decoder：分别适合不同任务形态。

工程含义：标准 attention 的计算复杂度随序列长度快速上升，因此长上下文能力不是免费资源，后续必须有推理优化和上下文治理。

### 3. Training and alignment layer

负责让模型先获得语言能力，再接近人类偏好的行为。

典型阶段：
- Pretraining：用大规模无标签文本学习基础语言规律。
- Supervised fine-tuning：用高质量指令、问答或对话数据教模型按任务响应。
- Parameter-efficient fine-tuning：如 LoRA，冻结主干权重，只训练低秩适配矩阵以降低资源成本。
- Preference optimization：如 RLHF、PPO、DPO、GRPO、KTO，用偏好数据调整输出行为。

工程含义：模型“会说”来自预训练，但“按人期望的方式说”来自对齐。把两者混为一谈，会误判模型能力和失败原因。

### 4. Inference optimization layer

负责让模型在可接受的成本、延迟和资源下运行。

常见技术：
- KV-cache：缓存历史 Key/Value，避免重复计算。
- FlashAttention：优化 attention 的显存读写和计算效率。
- Quantization：降低数值精度以节省显存和提升吞吐。
- Distillation / pruning：用更小模型或更少参数逼近可用能力。
- Mixture of Experts：每次只激活部分专家，以降低单次推理成本。
- Speculative decoding：用小模型草拟、大模型验证，提升生成速度。

工程含义：生产系统不能只看模型质量，也要看延迟、吞吐、显存、成本和长尾失败。

### 5. Grounding and context layer

负责把外部事实、任务背景和历史状态变成模型当前可用的上下文。

关键组件：
- RAG：分块、嵌入、召回、重排、生成。
- Re-ranking：把“召回到的内容”重新排序，筛掉低价值上下文。
- Context engineering：决定哪些信息进入上下文窗口、如何压缩、如何分配 token budget。
- Hallucination mitigation：通过外部资料、工具验证、拒答策略和证据约束降低编造风险。

工程含义：幻觉不是单纯的 prompt bug。LLM 优化的是概率续写，不等于事实验证；事实约束必须由系统层补上。

### 6. Interface and prompt layer

负责把任务意图、上下文、输出格式和约束传给模型。

实践规则：
- 分离指令、背景数据、输出格式和示例。
- 把 prompt 当作代码管理：版本控制、变更记录、测试集和回归检查。
- Few-shot 示例应服务于格式和边界，不应隐式引入未说明的事实。
- 对高风险输出，要求结构化字段、证据类型或来源指针。

工程含义：prompt engineering 不是写漂亮话，而是定义模型接口。接口越清晰，后续评估和调试越容易。

### 7. Evaluation and monitoring layer

负责判断系统是否可靠，并在上线后持续发现漂移。

评估方式：
- 有标准答案的任务：可用 BLEU、ROUGE、perplexity、准确率等传统指标。
- 开放式生成任务：可用 LLM-as-judge，但必须提供明确 rubric，并警惕同模型自评导致分数虚高。
- RAG/Agent 系统：应分别评估检索质量、回答忠实度、工具选择、执行成功率、多步连贯性、成本和延迟。
- 线上监控：持续观察输入分布、输出拒绝率、幻觉类型、用户反馈和行为漂移。

工程含义：一次离线 benchmark 不能代表生产可靠。生产质量需要离线回归测试和在线监控闭环。

## Relationship to existing Hermes wiki concepts

- `[[llm-context-engineering-layer]]`：本页提供 LLM 工程全景；该页聚焦 RAG 与 prompt 之间的上下文治理层。
- `[[production-ai-agent-evaluation-framework]]`：本页把评估放在工程链路末端；该页展开生产 Agent 的检索、生成、行为和运行指标。
- `[[llm-summary-identification-step]]`：本页说明输出可信度需要评估；该页把摘要任务进一步压成 evidence-backed claim object。
- `[[hermes-ai-workflow-formalization-principles]]`：本页补充 LLM 系统层知识；该页强调 Hermes 应把自然语言意图压缩成可验证产物。

## Hermes mapping

### Wiki

本页是概念导航层，用来回答“LLM 工程有哪些层、每层负责什么、失败通常从哪里来”。它适合链接到更窄的 Hermes wiki 页面，而不是替代它们。

### Skill/reference candidate

本页不应直接升级为 active skill。只有当某个子层在 Hermes 中反复被执行，例如 RAG 评估、prompt 回归测试、gsummary claim 支撑检查，才应把对应窄切片沉淀到 skill/reference。

### Project checklist candidate

如果后续要做 LLM/Agent 项目，可以把本页压缩成项目启动检查：
1. 输入表示和上下文长度是否清楚？
2. 是否区分模型能力、对齐行为和系统约束？
3. 是否有 RAG/工具/外部事实来源来约束输出？
4. 是否定义了 prompt 接口和输出 schema？
5. 是否有离线 eval、线上监控和失败复盘闭环？

## What to preserve, what not to preserve

保留：
- LLM 工程的分层地图。
- 从表示、架构、训练、推理、上下文到评估的系统链路。
- “幻觉需要系统层治理，而不是只靠 prompt 修补”的判断。
- prompt、RAG、evaluation 在工程系统中的边界。

不保留为核心知识：
- 文章完整摘要。
- 每个术语的百科式展开。
- 具体模型时间线作为主要结论。
- 对某个算法或模型的绝对优劣判断。
- 未经本地验证的性能阈值或工具选型建议。

## Practical use

使用这页时，先定位问题属于哪一层：
- 输入、chunk、token 成本问题：representation / context layer。
- 长上下文慢或贵：architecture / inference layer。
- 模型不按格式或偏好输出：alignment / prompt layer。
- 回答编造事实：grounding / evaluation layer。
- 上线后表现变差：monitoring / production layer。

定位层级后，再进入对应的窄页面或项目验证，而不是在一个大页面里解决所有问题。

## Related

- `towardsdatascience-must-know-topics-llm-engineer-2026-05-09`
- [llm-context-engineering-layer](/concepts/llm-context-engineering-layer)
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- [llm-summary-identification-step](/concepts/llm-summary-identification-step)
- [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)
- [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities)
- [index](/)
- `log`

