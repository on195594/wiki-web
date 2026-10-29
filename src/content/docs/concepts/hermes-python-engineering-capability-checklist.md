---
title: AI Agent Python Engineering Capability Checklist
created: 2026-06-16
updated: 2026-10-29
type: concept
tags:
  - agent
  - tool
  - ai-coding
  - workflow
  - governance
  - optimization
  - architecture
  - validation
sources:
  - raw/articles/machinelearningmastery-python-concepts-ai-engineer-2026-06-12.md
  - raw/articles/realpython-python-performance-optimization-guide-2026-10-21.md
  - raw/articles/kdnuggets-advanced-python-design-patterns-for-data-scientists.md
aliases:
  - agent-python-engineering-capability-checklist
status: stable
description: 列出 AI Agent 执行 Python 工程任务时的输入、资源、并发、类型与性能检查项，并按真实变更压力选择最小设计边界。
volatility: medium
review_by: 2027-01-31
---

# AI Agent Python Engineering Capability Checklist

## Summary

AI Agent 的 AI 能力提升不只来自更强模型，也来自更可靠的 Python 工程边界：大输入要流式处理，资源要有生命周期管理，网络型任务要支持有界并发，工具参数要结构化校验，自定义对象要遵守 Python 协议；性能改动先测量、定位，再做最小优化并复测。设计模式按真实变更压力选择，以调用方更简单、边界更容易测试衡量价值，不作为项目必须采用的架构清单。

这页把 MachineLearningMastery 文章 [machinelearningmastery-python-concepts-ai-engineer-2026-06-12](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/machinelearningmastery-python-concepts-ai-engineer-2026-06-12.md) 转换为 AI Agent 工作流检查清单，用 Real Python 的 `Python Performance Optimization: A Practical Guide` 补充性能诊断顺序，并用 Nahla Davies 的 KDnuggets 文章 `7 Advanced Python Design Patterns for Data Scientists` 补充代码边界的选择方法。这些都是教学来源；本页只保留可复用工程原则，不把示例性能数据当作生产基准，也不声称模式已证明项目收益。

## Core principle

> AI agent 的可靠性取决于工具边界、资源状态、输入规模、并发控制和验证闭环；Python 代码应把这些约束显式化，而不是依赖模型临场判断。

## Durable units from the article

### 1. Large inputs should default to streaming

适用场景：

- 网页正文提取
- 摘要工作流的长文本输入
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

AI Agent 映射：

- 摘要与内容提取工作流 应优先保持 source packet 可追溯；
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

AI Agent 映射：

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

AI Agent 映射：

- subagent/workflow 并发不应只是“同时发出去”；
- 需要有并发上限、失败归并、证据 readback 和停止条件；
- 对外部 API 或付费调用，必须保留 side-effect 和成本边界。

### 4. Tool and config boundaries should be typed

适用场景：

- AI Agent tool wrapper
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

AI Agent 映射：

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

AI Agent 映射：

- 适合长期复用的内部对象应优先遵守 Python 协议；
- 不要为一次性脚本过度设计 magic methods；
- 当对象进入框架、模板、队列、runner 时，再补协议边界。

### 6. Performance work should be measurement-led

来源：[realpython-python-performance-optimization-guide-2026-10-21](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/realpython-python-performance-optimization-guide-2026-10-21.md)（Mostafa Ibrahim，Real Python，页面更新于 2026-10-21）。它补充的是性能诊断与优化顺序，不替代前述资源、并发和类型边界。

**原文原则：**

- **先区分定位与计时。** 不知道程序哪里慢时，用 `cProfile` 等 profiler 找热点；已怀疑某段函数时，再用 `timeit` 比较候选。微基准不能单独证明该函数是端到端瓶颈。
- **按成本逐级处理，够用就停。** 先检查算法和数据结构，再找内置函数/标准库，随后考虑重复计算缓存；内存布局、并发和 C 扩展留给简单修复不足的情况，不是必须走完的步骤。
- **数据结构看访问模式与总成本。** `list` 成员查找通常为 O(n)，`set` 平均为 O(1)，但构建集合有成本；单次查询不应假定转换一定获益。原文的构建成本估算不作为通用盈亏平衡点。
- **标准库不等于自动提速。** 原文中 CPython 的 `Counter` 可把逐项计数交给 C helper，但把循环改写为 `any()` 仍可能保留 Python 层逐项工作；替换后照样测量。
- **缓存先保正确，再看速度。** 重复参数且结果稳定时才考虑缓存；原例读取全局列表，但 key 只有 `target`，列表改变后会返回陈旧答案。`cache` 无界保留条目；有容量约束时考虑有界 `lru_cache`，不照抄示例容量。
- **冷启动与命中分开。** 原文缓存计时前已调用一次函数；测到的是热缓存命中，而非第一次计算变快。不可把两种工作量的比较描述为算法本身加速。

**[推论] 项目落地的最小检查闭环：**

1. 先定义要改善的端到端指标与可接受目标，保留正确性基线；区分 CPU、I/O、等待和内存压力。
2. 使用有代表性的输入、相同解释器/环境建立基线；记录总耗时、调用次数和单次耗时，不混淆量纲。重复测量，并分别说明数据结构构建、I/O 与缓存预热是否计入。
3. 一次只改一个已测热点，优先消除重复工作、选择现成容器或标准库；复用现有测试验证输出、异常和资源生命周期不变。
4. 如需缓存，核对参数可哈希、隐藏状态/外部数据变化、失效与容量，以及返回可变对象的共享风险；测冷缓存、热缓存和实际命中率，不只测理想命中路径。
5. 在相同条件下复测微基准与端到端指标；达标即停止。并发仍受第 3 节的超时、限流、失败隔离约束，不能为提速删除这些边界。

**适用边界：** 原文是概念性教程，不是生产基准研究；本页未运行示例或复现加速倍数。生成器主要降低峰值内存，并不保证更快；线程、进程和异步的收益受解释器构建、原生库、任务粒度及通信成本影响，不能只凭 CPU/I/O 标签定方案。这里的检查闭环是本页推导，不声称原文已证明项目收益，也不授权增加依赖、改生产代码或运行配置。

这与 [software-engineering-laws-planning](/concepts/software-engineering-laws/software-engineering-laws-planning) 中“避免过早优化”的原则一致；结果验收沿用 [agent-self-validation-loops](/concepts/agent-self-validation-loops)，缓存命中与端到端成本的评估范围另见 [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)。

### 7. 按变更压力选择最小设计边界

来源：[kdnuggets-advanced-python-design-patterns-for-data-scientists](https://github.com/on195594/wiki/blob/6f710d5154797c0076657438ea257404a888a56b/raw/articles/kdnuggets-advanced-python-design-patterns-for-data-scientists.md)（Nahla Davies，KDnuggets；保留七项原文摘录，未确定发布日期）。原文讨论的是 Notebook 演进为多人依赖的 Python 代码时的选择方法，不是必须引入类层次的要求。

**先回答原文三个问题：** 什么在反复变化？什么契约必须保持稳定？新抽象会引入什么失效方式？判断收益看调用方是否更简单、边界是否更容易独立测试，而不是模式数量。

**七类压力、最小形态与边界：**

1. **Strategy（策略）**：评估指标或验证策略不断增加分支 → 把评分行为作为 callable 传给 `evaluate(y_true, y_pred, scorer)`。无状态行为保持普通函数；只有配置或相关方法需要随行为一起传递时，再考虑对象。
2. **Adapter（适配器）**：不同模型库的方法或输出结构不一致 → 定义一个本地 `typing.Protocol` 与薄包装，隔离下游对库接口的判断。协议主要提供静态约束，`@runtime_checkable` 不校验方法签名；输出形状一致仍不证明类别顺序、阈值或概率校准一致。结构与语义验证的区别见 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)。
3. **Template Method（模板方法）**：同类实验复制编排代码后顺序漂移 → 基类集中维护 `run()` 的固定步骤，子类只实现差异钩子。继承会耦合变体与生命周期；步骤需要独立变化或自由组合时，优先比较策略组合，而不是继续加深继承树。
4. **Observer（观察者）**：训练循环硬编码日志、仪表盘或其他消费者 → 发送事件给显式回调列表，消费者各自处理。原文使用字段为标量的 `frozen` dataclass；回调增多前需明确执行顺序、异常处理与单次成本，不让简单列表变成不可追踪的事件总线。
5. **Command（命令）**：运行请求需要延后、排队、重试或跨机器执行 → 用包含数据集、模型与配置标识的 dataclass 表示请求，由 `execute(runner)` 交给执行器。它分离“做什么”与“何时、何处做”，不自动保存执行环境；精确复现仍要绑定数据与代码版本、随机种子及平台假设。
6. **Facade（外观）**：调用一个任务需要反复导入、装配多个组件 → 用薄的任务级入口委托预处理、训练与报告组件。它简化的是整个子系统的使用，不是转换单个不兼容对象；不要让入口吞并业务验证、重试策略与状态，形成新单体。
7. **Proxy（代理）**：昂贵模型或数据在尚未使用时就加载 → 保持调用契约，在第一次实际访问时加载并复用实例。它控制访问时机，不解决失效、线程/进程安全或加载失败；缓存正确性沿用第 6 节，不能以静默使用陈旧产物换取启动速度。

**[推论] 对原文示例的工程校准：**

- “没有其他调用者就不需要模式”是克制抽象的启发式，不是绝对门禁；单一调用者仍可能有真实资源生命周期或变更隔离需求。与 [software-engineering-laws-design](/concepts/software-engineering-laws/software-engineering-laws-design) 的 KISS/YAGNI 一样，判断当前必要性，不压制必要边界。
- `ABC` 与集中维护 `run()` 不会自动禁止子类覆写，也不会自动处理异常清理；原文仅列出调用顺序，没有实现清理保障。资源释放仍按第 2 节显式设计与验证。
- `frozen=True` 不代表深度不可变；若事件或命令以后包含可变容器，其内部仍可能变化，不能据此保证消费隔离或记录与执行完全一致。
- 命令可转为数据不等于安全重试、幂等或完整复现；这些需要执行器与业务契约单独保证。

**适用边界：** 本节未运行示例，也未验证生产效果。将数据科学示例用于其他 Python 工作流属于条件性迁移；先确认真实压力，再选一个足够的边界，不要求七种模式全部落地，不由此授权新增依赖、改 active workflow 或运行配置。新增边界的项目验证仍沿用 [agent-self-validation-loops](/concepts/agent-self-validation-loops)。

## AI Agent adoption matrix

| Capability | Primary layer | Recommended artifact | Priority |
|---|---|---|---|
| Streaming large input | summary / extraction workflows | skill reference checklist | P0 |
| Typed tool/config boundary | project templates / tool wrappers | template + skill reference | P0 |
| Context-managed resources | runtime operations or Python project templates | wiki concept or template note | P1 |
| Bounded concurrency | subagent/workflow orchestration | skill reference checklist | P1 |
| Python protocol compatibility | reusable Python project code | template note | P2 |

## Non-goals

- 不把原文作为 Python 语法教程维护；
- 不把示例 benchmark 当成 AI Agent 性能基准；
- 不把 Pydantic 引入所有项目；
- 不新增 runtime dependency；
- 不改 active workflow 行为，除非后续有单独实现计划和验证。

## Promotion rules

当未来改 AI Agent workflow 或 Python 项目模板时，使用本页作为检查清单：

1. 大输入：是否流式？
2. 资源：是否有 cleanup boundary？
3. 并发：是否有 timeout/rate-limit/failure isolation？
4. 参数：是否有 typed validation？
5. 抽象：是否遵守必要 Python protocol？
6. 验证：是否有测试、readback 或 smoke evidence？
7. 性能：是否已定位热点、保留基线，并区分冷/热缓存、微基准与端到端复测？
8. 设计边界：是否存在具体变更压力、稳定契约和新增失效风险？普通函数是否已足够，所选边界是否让调用方更简单且更容易测试？

## Relations

- refines: [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)
- depends_on: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- related: [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering), [agent-context-engineering](/concepts/agent-context-engineering), [software-engineering-laws-planning](/concepts/software-engineering-laws/software-engineering-laws-planning), [software-engineering-laws-design](/concepts/software-engineering-laws/software-engineering-laws-design), [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)

