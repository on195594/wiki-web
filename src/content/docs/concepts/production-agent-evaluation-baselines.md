---
title: Production Agent Evaluation Baselines
created: 2026-07-31
updated: 2026-10-29
type: concept
tags:
  - agent
  - evaluation
  - validation
  - monitoring
  - optimization
sources:
  - raw/articles/towardsdatascience-production-ai-agent-evaluation-harness-2026-05-13.md
  - raw/articles/kdnuggets-llm-latency-inference-cost-2026-07-18.md
  - raw/articles/langchain-model-router-in-harness-2026-10-01.md
  - repository:_meta/catalog.json
  - concepts/hermes-knowledge-freshness-and-claim-evidence.md
status: stable
description: 定义生产 Agent 的延迟、成本、调用和缓存观测基线，并约束外部经验阈值与控制层边界。
aliases:
  - agent-production-baselines
  - llm-latency-cost-baselines
volatility: medium
review_by: 2027-02-21
---

# Production Agent Evaluation Baselines

## Summary

生产 Agent 的成本和延迟不能只看平均端到端耗时。可诊断基线应拆分排队、首 Token、生成节奏、端到端分位数、Token、模型调用、缓存命中以及工具/检索耗时；外部文章给出的阈值只保留为数量级参考，不能直接成为 AI Agent 默认门槛。

本页从 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 拆出生产观测与经验阈值子主题，依据 [towardsdatascience-production-ai-agent-evaluation-harness-2026-05-13](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/towardsdatascience-production-ai-agent-evaluation-harness-2026-05-13.md) 和 [kdnuggets-llm-latency-inference-cost-2026-07-18](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/kdnuggets-llm-latency-inference-cost-2026-07-18.md)。

## Latency and cost baseline

优化前应先记录能够定位瓶颈的统一基线，而不是只看平均端到端耗时：

- Queue time：请求进入系统后等待处理的时间。
- TTFT：用户看到首个流式 Token 前的等待时间。
- Inter-token latency：首 Token 后的生成节奏。
- End-to-end P50/P95/P99：典型、尾部和极端请求的完整耗时。
- Input/output Token：上下文与生成长度的成本和延迟负担。
- LLM calls per task：一项任务经过多少次串行或并行模型调用。
- Cache-hit rate：prompt、响应、检索和工具结果缓存减少了多少重复工作。
- Tool/retrieval latency：模型以外的工具调用和检索耗时。
- Cost per Query / Cost per Correct Answer：模型、工具和基础设施的单任务总成本及按正确回答折算的成本；若架构包含离线知识编译或增量更新（参见 [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence)），应分开报告查询期成本与编译维护摊销成本。

诊断顺序应从链路分解开始：高 TTFT 不等于模型生成慢，可能来自排队、长提示词或检索；端到端耗时高也可能来自串行工具、provider 等待或发送链路。没有分段基线时，不应直接把问题归因于模型大小、Gemini、GPU 或某一提取器。

## Control-layer boundary

- 应用/AI Agent 可控层：输出长度、上下文预算、模型调用数、确定性步骤替换、缓存、任务优先级、后台隔离、请求与重试边界，以及经验证的模型/provider 路由和降级。
- 托管 provider 内部层：GPU 调度、KV-cache 布局、FlashAttention、张量/流水线并行、连续批处理和推测解码。使用托管 API 时，这些只作为解释和选型知识，不进入 AI Agent 日常执行清单。
- 自托管推理项目：只有项目实际控制 serving stack 时，才把量化、批处理、KV-cache 和并行策略转成项目级基准测试。

模型路由、provider fallback、admission control、语义缓存和调用合并不是默认优化。只有真实链路出现重复的成本、延迟或可用性问题时，才在所属项目做窄试验；provider fallback 首先解决可用性，不能预设它会降低成本或延迟。

## 知识库跨源证据导航评测方案（待执行）

针对编译型知识库，可用离线图拓扑评测检测断链与候选膨胀（8 组双入口候选问题和验证要求见 [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence)）。当前缺少可复现运行产物，状态为 **NOT_RUN**，不将此前报告的本仓库改善数值视为已验证基线。

- **结构指标**：完整可达证据集合的跨入口 Jaccard、黄金证据召回率与精确率、实际加载范围的上下文体积。不得先过滤到黄金集再将重合度称作引用一致性。
- **回答指标**：同一问题重复运行后的实际段落引用集合一致性、引用正确性、Answer Faithfulness 与任务成功率，须独立于静态图遍历测量。
- **发布门槛**：固定治理前后快照、独立复核黄金集、统一跳数与边方向，并提交脚本、逐题结果和运行记录；一跳体积代理不能代表完整回答成本。

## 模型路由的结果与成本口径

[langchain-model-router-in-harness-2026-10-01](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/langchain-model-router-in-harness-2026-10-01.md) 的 Open SWE 实验提供一个有限案例：作者用每会话产生已合并 PR 的比例和会话 LLM 成本比较路由组与单模型组。机制、数值和实现局限统一保留在 [agent-resource-optimization](/concepts/agent-resource-optimization)，本页不重复案例数据。

**[推论]** 路由评估应同时跟踪任务结果与成本分布，并说明基线、分母和质量代理指标未覆盖的维度。质量指标差异不显著不等于质量等价；会话成本中位数降幅不等于整体预算降幅。若要声称质量非劣或等效，应事先定义可接受差异与相应评估方法，而不是仅凭 p 值未显著。文章没有证明所有代码质量维度等价，也没有完整衡量返工、人工审查与总运营成本。

## Directional benchmarks from the source

以下阈值只作为“数量级参考”，不要当成强制标准。不同业务、风险等级、成本结构和用户体验目标都可能需要重新校准。

- Context Relevance：作者建议目标约 `>0.85`，低于 `0.70` 需要调查。
- Context Recall：作者建议 benchmark queries 约 `>0.90`。
- Context Precision / MRR：作者建议约 `>0.80`。
- Retrieval Latency：作者建议 p95 小于约 `200ms`，p99 小于约 `500ms`。
- Answer Faithfulness：监管行业约 `>0.95`，一般场景约 `>0.90`。
- Hallucination Rate：生产 Agent 约 `<2%`，监管行业约 `<0.5%`。
- Tool Selection Accuracy：二选一工具约 `>0.92`，5+ 工具场景约 `>0.85`。
- Tool Execution Success：作者建议约 `>0.98`。
- P99 Latency：对话型 Agent 约 `<3s`，分析型 Agent 可放宽到约 `<10s`。
- LLM-as-judge 成本：作者经验约为推理成本的 `30%–50%`。

## Source-backed cautionary claims

这些数字也应视为作者团队经验，而不是普适定律：

- MVP 后补评估通常要 4–6 周，期间信任损害可能已经发生。
- 测试集 95% accuracy 的 RAG Agent，真实用户问题仍可能高幻觉。
- 工具从 3 个增至 12 个时，工具选择准确率可能显著下降。
- 多步 trace 从 2 步扩展到 6 步时，多步连贯性可能大幅下降。
- 用同一模型同时做生成和裁判，可能导致评估分数虚高。
- [kdnuggets-llm-latency-inference-cost-2026-07-18](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/kdnuggets-llm-latency-inference-cost-2026-07-18.md) 提供的是实践清单而非对照实验；其路由、缓存、批处理和 serving 建议没有固定收益、阈值或平台基准，必须结合代表性流量和质量门槛验证。

## AI Agent mapping

- Wiki：保存可诊断的生产基线、控制层边界和外部经验阈值。
- Project：只有出现真实延迟、成本或可用性问题时，才在所属项目测量并校准本地阈值。
- Active workflow：本页不授权修改 provider 路由、缓存、runtime、cron、MCP、gateway、wrapper、skills 或 memory。

## Relations

- refines: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- related: [agent-resource-optimization](/concepts/agent-resource-optimization), [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence), [agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration)

