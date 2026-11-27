---
title: AI Agent Python Engineering Capability Checklist
created: 2026-06-16
updated: 2026-11-26
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
  - pydantic
  - typed-boundary
sources:
  - raw/articles/machinelearningmastery-python-concepts-ai-engineer-2026-06-12.md
  - raw/articles/realpython-python-performance-optimization-guide-2026-10-21.md
  - raw/articles/kdnuggets-advanced-python-design-patterns-for-data-scientists.md
  - https://peps.python.org/pep-0343/
  - https://vorpus.org/blog/notes-on-structured-concurrency-or-go-statement-considered-harmful/
  - https://vorpus.org/blog/timeouts-and-cancellation-for-humans/
  - https://peps.python.org/pep-0654/
  - https://peps.python.org/pep-3156/
  - https://docs.python.org/3.13/library/asyncio-task.html#task-groups
  - https://docs.python.org/3.13/library/contextlib.html#contextlib.contextmanager
  - https://docs.python.org/3/library/asyncio-exceptions.html
  - https://docs.python.org/3/library/asyncio-task.html
  - https://docs.python.org/3/library/asyncio-sync.html
  - https://docs.python.org/3/library/asyncio-queue.html
  - https://docs.python.org/3/library/asyncio-threading.html
  - https://anyio.readthedocs.io/en/stable/cancellation.html
  - https://trio.readthedocs.io/en/stable/reference-core.html
  - https://peps.python.org/pep-0703/
  - https://peps.python.org/pep-0779/
  - https://peps.python.org/pep-0803/
  - https://docs.python.org/3/whatsnew/3.14.html
  - https://docs.python.org/3/whatsnew/3.15.html
  - https://docs.python.org/3/howto/free-threading-python.html
  - https://docs.python.org/3/builtins/threadsafety.html
  - https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/
  - https://pydantic.dev/docs/validation/2.0/usage/strict_mode/
  - https://pydantic.dev/docs/validation/dev/api/pydantic/config/
  - https://pydantic.dev/docs/validation/dev/concepts/unions/
  - https://pydantic.dev/docs/validation/dev/concepts/type_adapter/
  - https://pydantic.dev/docs/validation/dev/errors/errors/
aliases:
  - agent-python-engineering-capability-checklist
status: stable
description: 列出 AI Agent 执行 Python
  工程任务时的流式输入、边沿与电平触发取消清理、队列内存背压（C_cancel）、Pydantic v2
  递归严格解析与判别联合（S_strict）、Python 3.14–3.15 自由线程 GIL 门禁及按变更压力选择最小设计边界。
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# AI Agent Python Engineering Capability Checklist

## Summary

AI Agent 执行 Python 工程任务时，应按输入规模、资源生命周期和并发失败语义选择实现，在工具与配置入口保留严格解析得到的类型约束（`S_strict`），并用有界屏蔽清理与队列背压（`C_cancel`）收紧异步及自由线程运行边界。性能改动先测量、定位，再做最小优化并复测。设计模式按真实变更压力选择，以调用方更简单、边界更容易测试衡量价值。

这页把 MachineLearningMastery 文章 [machinelearningmastery-python-concepts-ai-engineer-2026-06-12](https://github.com/on195594/wiki/blob/8fc75f578e5f04cf77cd6af64297151a38749bad/raw/articles/machinelearningmastery-python-concepts-ai-engineer-2026-06-12.md) 转换为 AI Agent 工作流检查清单，结合 Python 3.13–3.15 官方文档、PEP 规范与 Pydantic v2 文档补齐取消安全、自由线程和严格解析不变量，并用 Real Python 的 [realpython-python-performance-optimization-guide-2026-10-21](https://github.com/on195594/wiki/blob/8fc75f578e5f04cf77cd6af64297151a38749bad/raw/articles/realpython-python-performance-optimization-guide-2026-10-21.md) 补充性能诊断顺序、用 Nahla Davies 的 KDnuggets 文章 [kdnuggets-advanced-python-design-patterns-for-data-scientists](https://github.com/on195594/wiki/blob/8fc75f578e5f04cf77cd6af64297151a38749bad/raw/articles/kdnuggets-advanced-python-design-patterns-for-data-scientists.md) 补充代码边界选择方法。教学示例中的加速数据不充当生产基准，也不声称模式已证明特定项目收益。

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

- 摘要与内容提取工作流应优先保持 source packet 可追溯；
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
- 异常与取消发生时是否一定释放资源？
- 异步清理是否考虑外层取消作用域的二次打断？
- 是否写入必要审计信息？
- 是否能 rollback 或安全重试？

AI Agent 映射：

- runtime 操作中，浏览器、进程、缓存、锁不应依赖人工清理；
- 工作流脚本中，临时资源应封装为 context manager 或等价的 cleanup boundary；
- 失败路径必须和成功路径一样维护 metadata。

[PEP 343](https://peps.python.org/pep-0343/) 定义了 `with` 的进入和退出协议。`__enter__` 成功返回后，正常退出、`return`、循环跳转或语句块抛异常都会调用 `__exit__`。进入途中已经取得的资源由进入逻辑自行清理。`__exit__` 返回真值可以有意抑制预期异常，其他异常应继续传播。[`@contextmanager`](https://docs.python.org/3.13/library/contextlib.html#contextlib.contextmanager) 包装的生成器只能 `yield` 一次。重试需要显式循环或由调用方调度，见 [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow)。

### 3. Network-bound workflows should use bounded concurrency (`C_cancel`)

适用场景：

- 多 URL 提取
- 多 API 查询
- 多 agent / subagent 执行
- 向量库查询
- LLM 批量调用
- 状态巡检

检查项：

- 瓶颈是否是网络 I/O？
- 是否仅用 `Semaphore` 而遗漏待执行队列内存上限？
- 是否设置绝对截止时间（deadline / timeout）并正确传播 `CancelledError`？
- 是否设置 retry 和 backoff？
- 部分失败是否能隔离？
- 输出是否保持可复现排序？
- 是否记录每个子任务的状态和证据？

AI Agent 映射：

- subagent/workflow 并发不应只是“同时发出去”；
- 需要有并发上限、有界队列背压、失败归并、证据 readback 和停止条件；
- 对外部 API 或付费调用，必须保留 side-effect 和成本边界。

[Nathaniel J. Smith 的 Nursery 设计](https://vorpus.org/blog/notes-on-structured-concurrency-or-go-statement-considered-harmful/) 把子任务寿命限制在任务组作用域内。Python 3.11+ 的 [`asyncio.TaskGroup`](https://docs.python.org/3.13/library/asyncio-task.html#task-groups) 等待组内任务结束后再退出（Python 3.15 新增 [`TaskGroup.cancel()`](https://docs.python.org/3/whatsnew/3.15.html) 支持非异常早退取消）。首个非 `CancelledError` 的子任务异常会触发其他任务取消，未处理的非取消异常按 [PEP 654](https://peps.python.org/pep-0654/) 聚合为 `ExceptionGroup` / `BaseExceptionGroup`（注意同一 `try` 禁止混用 `except` 与 `except*`，且 `except*` 块内禁止 `return` / `break` / `continue`）。

**取消安全与队列内存背压不变量（`C_cancel`）**：
- **`CancelledError` 继承链与 `Task.uncancel()` 契约**：自 Python 3.8 起，`asyncio.CancelledError` 直接继承自 `BaseException` 而非 `Exception`（[PEP 3156](https://peps.python.org/pep-3156/)；[asyncio Exceptions](https://docs.python.org/3/library/asyncio-exceptions.html)）。严禁用裸 `except BaseException:` 吞掉取消异常；在 `asyncio` 的**边沿触发（Edge-Triggered）**模型下，吞掉单次注入的 `CancelledError` 而不重新抛出或配套调用 [`Task.uncancel()`](https://docs.python.org/3/library/asyncio-task.html)，会直接损坏外层 `TaskGroup` 与 `asyncio.timeout()` 的取消计数状态机（导致悬挂任务或后续无关 `await` 误取消）。
- **电平触发取消下的有界屏蔽清理**：在 [Trio](https://trio.readthedocs.io/en/stable/reference-core.html) 与 [AnyIO](https://anyio.readthedocs.io/en/stable/cancellation.html) 的**电平触发（Level-Triggered）**模型中（设计动机见 [Timeouts and cancellation for humans](https://vorpus.org/blog/timeouts-and-cancellation-for-humans/)），只要任务处于已取消的 `CancelScope` 内，清理块中直接执行 `await resource.aclose()` 会在首个挂起点再次触发取消异常并导致连接泄漏；异步资源释放必须包裹在带超时的屏蔽作用域内（如 `with move_on_after(t, shield=True): await resource.aclose()`），且禁止在异步生成器内跨越 `yield` 持有 `CancelScope` 或 `TaskGroup`。
- **并发上限不等于内存背压**：[`asyncio.Semaphore`](https://docs.python.org/3/library/asyncio-sync.html) 仅限制同时进入临界区的活跃协程数，若上游循环无节制调用 `tg.create_task()`，百万级待执行协程仍会瞬间撑爆内存。真正的生产者背压必须使用有界队列 [`asyncio.Queue(maxsize=N)`](https://docs.python.org/3/library/asyncio-queue.html)（队列满时挂起生产者，配合 Python 3.13+ `queue.shutdown()` 优雅停机）加固定数量 Worker 消费；同步线程池映射可使用 Python 3.14 新增的 [`Executor.map(..., buffersize=N)`](https://docs.python.org/3/whatsnew/3.14.html)。

### 4. Tool and config boundaries should be typed (`S_strict`)

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
- 是否存在静默默认值或静默忽略拼写错误字段？
- 嵌套子模型是否统一继承了严格基类而非退回 Lax 隐式转换？
- 多工具联合路由是否声明了判别器（Discriminator）？
- 错误信息回传给 LLM 前是否剥离了大体积原始输入与外链 URL？

AI Agent 映射：

- dataclass 适合受信任内部状态；
- Pydantic 适合外部边界校验、配置解析和 tool schema（接口设计原则见 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)）；
- 不应把 Pydantic 强推到所有纯内部函数；新三方依赖仍需项目级确认。

[Alexis King 的 Parse, don’t validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/) 建议在系统入口把外部输入解析成能表达既定不变量的类型，先解析完整输入再产生副作用。在 Pydantic v2 中落地反熵边界（`S_strict`）需核对以下精确机制：

- **显式拒绝未知字段与严格模式的两大陷阱**：默认 Lax 模式会将字符串 `'false'` / `'0'` / `'no'` 隐式转换为布尔值，且默认 `extra='ignore'` 会静默吞掉 LLM 幻觉或拼写错误的字段。工具与配置入口应启用 [`ConfigDict(strict=True, extra='forbid', hide_input_in_errors=True)`](https://pydantic.dev/docs/validation/dev/api/pydantic/config/)，但必须防范两处规范边界：（1）严格类型校验与拒绝未知字段是两项独立约束。外层模型的配置不会传给嵌套 `BaseModel`；入口调用 `model_validate(..., strict=True)` 可严格校验嵌套字段的类型，但不会拒绝多余的键。需要封闭字段集的每个嵌套模型都应声明 `extra='forbid'`，或继承配置了该项的基类；（2）[`model_validate_json(..., strict=True)`](https://pydantic.dev/docs/validation/2.0/usage/strict_mode/) 为兼容 JSON 原生类型集，仍允许从 JSON 字符串解析 `UUID`、`date`、`datetime` 与 `Decimal`。
- **判别联合（Discriminated Unions）实现 $O(1)$ 工具分派**：无标签 `Union` 在校验失败时会遍历全部分支并聚合抛出所有成员的错误列表，极易撑爆 Agent 重试上下文并误导模型改错分支。多工具参数联合应声明共享字面量判别字段 [`Field(discriminator='tool_name')` 或 `Tag` + `Discriminator`](https://pydantic.dev/docs/validation/dev/concepts/unions/)（注意自定义可调用 `Discriminator(fn)` 在序列化阶段同样会被调用，须兼容 `dict` 与模型实例）。
- **模块级单例复用 `TypeAdapter` 与错误裁剪**：对 `TypedDict`、标准库 `dataclass` 或判别联合列表，可用 [`TypeAdapter`](https://pydantic.dev/docs/validation/dev/concepts/type_adapter/) 直接执行 `validate_json`（注意其 `dump_json()` 返回 `bytes`，不同于 `BaseModel.model_dump_json()` 返回 `str`）；因初始化会编译 `pydantic-core` schema，**严禁在每次工具调用热路径内重复实例化 `TypeAdapter`**，应在模块导入期构造单例复用。将 [`ValidationError`](https://pydantic.dev/docs/validation/dev/errors/errors/) 回传给 LLM 自修正时，不要直接转发 `e.errors()`：`hide_input_in_errors=True` 只影响错误的文本展示，不会从结构化错误中移除 `input`。按白名单构造响应，只返回 `loc`、`type` 和安全的 `msg`；若位置含用户提交的未知键，或自定义消息含原始值，先替换为字段路径或固定提示。

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

### 6. Performance work should be measurement-led (with Free-Threading Guardrails)

来源：[realpython-python-performance-optimization-guide-2026-10-21](https://github.com/on195594/wiki/blob/8fc75f578e5f04cf77cd6af64297151a38749bad/raw/articles/realpython-python-performance-optimization-guide-2026-10-21.md)（Mostafa Ibrahim，Real Python，页面更新于 2026-10-21）。它补充的是性能诊断与优化顺序，不替代前述资源、并发和类型边界。

**原文原则：**

- **先区分定位与计时。** 不知道程序哪里慢时，用 `cProfile` 等 profiler 找热点；已怀疑某段函数时，再用 `timeit` 比较候选。微基准不能单独证明该函数是端到端瓶颈。
- **按成本逐级处理，够用就停。** 先检查算法和数据结构，再找内置函数/标准库，随后考虑重复计算缓存；内存布局、并发和 C 扩展留给简单修复不足的情况，不是必须走完的步骤。
- **数据结构看访问模式与总成本。** `list` 成员查找通常为 O(n)，`set` 平均为 O(1)，但构建集合有成本；单次查询不应假定转换一定获益。原文的构建成本估算不作为通用盈亏平衡点。
- **标准库不等于自动提速。** 原文中 CPython 的 `Counter` 可把逐项计数交给 C helper，但把循环改写为 `any()` 仍可能保留 Python 层逐项工作；替换后照样测量。
- **缓存先保正确，再看速度。** 重复参数且结果稳定时才考虑缓存；原例读取全局列表，但 key 只有 `target`，列表改变后会返回陈旧答案。`cache` 无界保留条目；有容量约束时考虑有界 `lru_cache`，不照抄示例容量。
- **冷启动与命中分开。** 原文缓存计时前已调用一次函数；测到的是热缓存命中，而非第一次计算变快。不可把两种工作量的比较描述为算法本身加速。

**Python 3.13–3.15 自由线程（Free-Threaded CPython）演进与并发安全红线：**

当热点确属 CPU 密集型 Python 代码且评估启用无 GIL 构建（`python3.14t` / `python3.15t`）时，必须核对一手解释器边界：
- **Phase II 支持状态与版本避坑**：自由线程由 Python 3.13 实验性阶段（[PEP 703](https://peps.python.org/pep-0703/)）在 Python 3.14 进入正式受支持的 **Phase II（可选非默认）**（[PEP 779](https://peps.python.org/pep-0779/)，单线程性能损耗上限 15%、内存增幅上限 20%；[Free-Threading HOWTO](https://docs.python.org/3/howto/free-threading-python.html) 实测 `pyperformance` 单线程开销在 macOS aarch64 约 `1%`、x86-64 Linux 约 `8%`），并在 Python 3.15 引入跨自由线程与传统构建的稳定 ABI **`abi3t`**（[PEP 803](https://peps.python.org/pep-0803/)；[What's New in 3.15](https://docs.python.org/3/whatsnew/3.15.html)）。若采用 Python 3.14，须选 **`>= 3.14.5`**（3.14.0–3.14.4 的增量 GC 因生产环境内存压力已在 3.14.5 回退至分代 GC，见 [What's New in 3.14](https://docs.python.org/3/whatsnew/3.14.html)）。
- **检测 C 扩展是否重开 GIL**：在自由线程构建上，不设置 `-X gil` 或 `PYTHON_GIL`，按生产路径导入实际使用的扩展（含延迟加载项），再检查 `sys._is_gil_enabled()`。若要求无 GIL 运行而结果为 `True`，应排查导入警告和扩展版本。强制 `-X gil=0` 会阻止解释器为未声明支持的扩展重开 GIL；此时检查为 `False` 不能证明扩展线程安全（[Free-Threading HOWTO](https://docs.python.org/3/howto/free-threading-python.html)）。
- **容器单操作锁局限与每线程单事件循环不变量**：自由线程仅为 `dict`、`list`、`set` 提供**单操作级**内部锁（`ob_mutex`），读-改-写（`d[k] += 1`）、检查后删除（TOCTOU）及并发遍历可变容器或共享迭代器仍存在数据竞态，跨线程可变缓存须加显式 `threading.Lock`（[Thread Safety Guarantees](https://docs.python.org/3/builtins/threadsafety.html)）。混用 `asyncio` 时必须遵守**每线程独立事件循环（One Event Loop Per Thread）**：`Task`、`Future` 与 `asyncio.Queue` 均非线程安全，跨线程投递必须走 `asyncio.run_coroutine_threadsafe()` 或 `loop.call_soon_threadsafe()`（[asyncio and Free-Threaded Python](https://docs.python.org/3/library/asyncio-threading.html)）。

**[推论] 项目落地的最小检查闭环：**

1. 先定义要改善的端到端指标与可接受目标，保留正确性基线；区分 CPU、I/O、等待和内存压力。
2. 使用有代表性的输入、相同解释器/环境建立基线；记录总耗时、调用次数和单次耗时，不混淆量纲。重复测量，并分别说明数据结构构建、I/O 与缓存预热是否计入。
3. 一次只改一个已测热点，优先消除重复工作、选择现成容器或标准库；复用现有测试验证输出、异常和资源生命周期不变。
4. 如需缓存，核对参数可哈希、隐藏状态/外部数据变化、失效与容量，以及返回可变对象的共享风险；测冷缓存、热缓存和实际命中率，不只测理想命中路径。
5. 在相同条件下复测微基准与端到端指标；达标即停止。并发仍受第 3 节的超时、限流、失败隔离约束，不能为提速删除这些边界。

**适用边界：** 原文是概念性教程，不是生产基准研究；本页未运行示例或复现加速倍数。生成器主要降低峰值内存，并不保证更快；线程、进程和异步的收益受解释器构建、原生库、任务粒度及通信成本影响，不能只凭 CPU/I/O 标签定方案。这里的检查闭环是本页推导，不声称原文已证明项目收益，也不授权增加依赖、改生产代码或运行配置。

这与 [software-engineering-laws-planning](/concepts/software-engineering-laws/software-engineering-laws-planning) 中“避免过早优化”的原则一致；结果验收沿用 [agent-self-validation-loops](/concepts/agent-self-validation-loops)，缓存命中与端到端成本的评估范围另见 [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)。

### 7. 按变更压力选择最小设计边界

来源：[kdnuggets-advanced-python-design-patterns-for-data-scientists](https://github.com/on195594/wiki/blob/8fc75f578e5f04cf77cd6af64297151a38749bad/raw/articles/kdnuggets-advanced-python-design-patterns-for-data-scientists.md)（Nahla Davies，KDnuggets；保留七项原文摘录，未确定发布日期）。原文讨论的是 Notebook 演进为多人依赖的 Python 代码时的选择方法，不是必须引入类层次的要求。

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
| Strict typed boundary & $O(1)$ union (`S_strict`) | project templates / tool wrappers | shared strict base model + singleton `TypeAdapter` | P0 |
| Shielded cleanup & queue backpressure (`C_cancel`) | runtime operations / async orchestration | bounded `Queue(maxsize)` + shielded teardown | P1 |
| Post-import GIL check & per-thread event loop | CPU-bound multi-threaded Python >= 3.14.5 | CI / startup assertion checklist | P1 |
| Python protocol compatibility | reusable Python project code | template note | P2 |

## Non-goals

- 不把原文作为 Python 语法教程维护；
- 不把示例 benchmark 当成 AI Agent 性能基准；
- 不把 Pydantic 引入所有项目，也不默认切换自由线程解释器；
- 不新增 runtime dependency；
- 不改 active workflow 行为，除非后续有单独实现计划和验证。

## Promotion rules

当未来改 AI Agent workflow 或 Python 项目模板时，使用本页作为检查清单（在反熵编程主流程中的调用入口见 [how-i-should-use-hermes-for-ai-coding-with-typed-boundaries](/queries/how-i-should-use-hermes-for-ai-coding-with-typed-boundaries)，系统级契约总表见 [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering)）：

1. 大输入：是否流式？
2. 资源与取消清理：是否区分边沿/电平触发取消并用有界屏蔽保护异步释放？
3. 并发与背压：是否用 `Queue(maxsize=N)` 限制待执行队列内存而非仅靠 `Semaphore`？
4. 参数解析：嵌套模型是否继承统一 `strict=True, extra='forbid'` 基类并使用判别联合与单例 `TypeAdapter`？
5. 抽象：是否遵守必要 Python protocol？
6. 验证：是否有测试、readback 或 smoke evidence？
7. 性能与自由线程：是否已定位热点、保留基线，并在启用自由线程时检查生产依赖导入后的 GIL 状态，并保持每线程独立事件循环？
8. 设计边界：是否存在具体变更压力、稳定契约和新增失效风险？普通函数是否已足够，所选边界是否让调用方更简单且更容易测试（形式化收敛与审查边界见 [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization) 与 [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence)）？

## [推论] Python 工程边界检查

| 场景 | 要核对的行为 |
| --- | --- |
| 流式输入 | 峰值内存满足实际预算，限制分块、缓冲和并发工作集。截断或读取失败应能追溯到对应输入。 |
| 资源与取消安全（`C_cancel`） | 严禁吞掉 `CancelledError` 损坏 `TaskGroup` / `timeout()`；电平触发取消下异步释放置于有界屏蔽作用域内。 |
| 并发与自由线程 | 用有界队列限制待执行任务内存；自由线程构建不强制关闭 GIL，在导入生产依赖后检查其状态、共享可变状态显式加锁且每线程独立事件循环。 |
| 严格类型解析（`S_strict`） | 嵌套参数共享 `strict=True, extra='forbid'` 基类，多工具分支启用判别器，热路径复用单例 `TypeAdapter` 并裁剪错误回显。 |

## Relations

- refines: [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)
- depends_on: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization)
- related: [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence), [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering), [agent-context-engineering](/concepts/agent-context-engineering), [software-engineering-laws-planning](/concepts/software-engineering-laws/software-engineering-laws-planning), [software-engineering-laws-design](/concepts/software-engineering-laws/software-engineering-laws-design), [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines), [ai-coding-agent-workflow-types](/concepts/ai-coding-agent-workflow-types), [how-i-should-use-hermes-for-ai-coding-with-typed-boundaries](/queries/how-i-should-use-hermes-for-ai-coding-with-typed-boundaries), [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow)

