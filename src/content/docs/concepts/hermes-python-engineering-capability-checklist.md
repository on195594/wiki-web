---
title: Hermes Python Engineering Capability Checklist
created: 2026-06-16
updated: 2026-08-18
type: concept
tags:
  - hermes
  - tool
  - ai-coding
  - workflow
  - governance
  - optimization
  - architecture
  - validation
sources:
  - raw/articles/machinelearningmastery-python-concepts-ai-engineer-2026-06-12.md
status: stable
description: 列出 Hermes 执行 Python 工程任务时需要检查的语言、测试、工具和交付能力。
---

# Hermes Python Engineering Capability Checklist

## Summary

Hermes 的 AI 能力提升不只来自更强模型，也来自更可靠的 Python 工程边界：大输入要流式处理，资源要有生命周期管理，网络型任务要支持有界并发，工具参数要结构化校验，自定义对象要遵守 Python 协议。

这页把 MachineLearningMastery 文章 `Python Concepts Every AI Engineer Must Master` 转换为 Hermes 工作流检查清单。原文是 Python 教学文章；本页只保留对 Hermes 有长期价值的工程原则，不把示例性能数据当作生产基准。

## Core principle

> AI agent 的可靠性取决于工具边界、资源状态、输入规模、并发控制和验证闭环；Python 代码应把这些约束显式化，而不是依赖模型临场判断。

## Durable units from the article

### 1. Large inputs should default to streaming

适用场景：

- 网页正文提取
- `/gsummary` 长文本输入
- 日志分析
- JSONL / CSV / 数据库导出
- 批量文件处理
- 大规模 API 响应聚合

检查项：

- 输入是否可能超过几 MB？
- 是否先构造了完整 list 再处理？
- 是否可以改成 iterator / generator / chunk pipeline？
- 是否保留 source metadata 和 extraction note？
- 是否有截断、摘要化、抽取失败的质量标记？

Hermes 映射：

- `gemini-summary` 和 `article-and-content-summarization` 应优先保持 source packet 可追溯；
- 大输入清洗应避免一次性粗暴拼接；
- 需要清楚区分 full source、partial source、extractor-generated digest。

### 2. Resource state needs context-managed boundaries

适用场景：

- 浏览器 / CDP session
- 临时目录和缓存
- 文件句柄
- 数据库连接
- API client session
- 锁文件
- 长任务 runner
- 模型状态或推理上下文

检查项：

- 是否有 setup / teardown？
- 异常发生时是否一定释放资源？
- 是否恢复原状态？
- 是否写入必要审计信息？
- 是否能 rollback 或安全重试？

Hermes 映射：

- runtime 操作中，浏览器、进程、缓存、锁不应依赖人工清理；
- 工作流脚本中，临时资源应封装为 context manager 或等价的 cleanup boundary；
- 失败路径必须和成功路径一样维护 metadata。

### 3. Network-bound workflows should use bounded concurrency

适用场景：

- 多 URL 提取
- 多 API 查询
- 多 agent / subagent 执行
- 向量库查询
- LLM 批量调用
- 状态巡检

检查项：

- 瓶颈是否是网络 I/O？
- 是否存在无界并发？
- 是否设置 timeout？
- 是否设置 retry 和 backoff？
- 是否有 rate limit？
- 部分失败是否能隔离？
- 输出是否保持可复现排序？
- 是否记录每个子任务的状态和证据？

Hermes 映射：

- subagent/workflow 并发不应只是“同时发出去”；
- 需要有并发上限、失败归并、证据 readback 和停止条件；
- 对外部 API 或付费调用，必须保留 side-effect 和成本边界。

### 4. Tool and config boundaries should be typed

适用场景：

- Hermes tool wrapper
- CLI 参数
- YAML / JSON 配置
- LLM tool calling schema
- 项目模板
- 批处理任务参数
- Agent handoff contract

检查项：

- 参数是否仍是裸 dict？
- 是否存在静默默认值？
- 是否校验枚举、范围、路径、URL、布尔开关？
- 内部结构是否适合 dataclass？
- 边界输入是否需要 Pydantic / schema？
- 错误信息是否能指导 AI 修正调用？

Hermes 映射：

- dataclass 适合内部状态；
- Pydantic 适合边界校验、配置解析和 tool schema；
- 不应把 Pydantic 强推到所有纯内部函数；
- 新三方依赖仍需项目级确认，已有依赖才可直接使用。

### 5. Custom abstractions should follow Python protocols

适用场景：

- task queue
- artifact collection
- dataset-like wrapper
- callable workflow object
- validation result container
- model/tool adapter

检查项：

- 对象是否应该支持 `len()`？
- 是否应该支持索引或迭代？
- 是否应该是 callable？
- 是否需要 context manager？
- 是否会被外部框架或通用工具消费？
- magic methods 是否只是提升协议兼容，而不是炫技？

Hermes 映射：

- 适合长期复用的内部对象应优先遵守 Python 协议；
- 不要为一次性脚本过度设计 magic methods；
- 当对象进入框架、模板、队列、runner 时，再补协议边界。

## Hermes adoption matrix

| Capability | Primary layer | Recommended artifact | Priority |
|---|---|---|---|
| Streaming large input | summary / extraction workflows | skill reference checklist | P0 |
| Typed tool/config boundary | project templates / tool wrappers | template + skill reference | P0 |
| Context-managed resources | runtime operations or Python project templates | wiki concept or template note | P1 |
| Bounded concurrency | subagent/workflow orchestration | skill reference checklist | P1 |
| Python protocol compatibility | reusable Python project code | template note | P2 |

## Non-goals

- 不把原文作为 Python 语法教程维护；
- 不把示例 benchmark 当成 Hermes 性能基准；
- 不把 Pydantic 引入所有项目；
- 不新增 runtime dependency；
- 不改 active workflow 行为，除非后续有单独实现计划和验证。

## Promotion rules

当未来改 Hermes workflow 或 Python 项目模板时，使用本页作为检查清单：

1. 大输入：是否流式？
2. 资源：是否有 cleanup boundary？
3. 并发：是否有 timeout/rate-limit/failure isolation？
4. 参数：是否有 typed validation？
5. 抽象：是否遵守必要 Python protocol？
6. 验证：是否有测试、readback 或 smoke evidence？

## Related pages

- [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)
- [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering)
- [agent-context-engineering](/concepts/agent-context-engineering)
- [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)

