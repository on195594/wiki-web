---
title: Using AI Agent for AI Coding with Typed Boundaries
created: 2026-05-01
updated: 2026-11-26
type: query
aliases:
  - how-i-should-use-agent-for-ai-coding-with-typed-boundaries
status: stable
description: 回答如何用 AI Agent 以类型化边界、仓库复杂度分流、首次编辑经济性、受控沙箱程序化编排（防 JSON
  搬运工）、只读测试与冲突显式上报门禁及有界单意图清理执行反熵 AI 编程任务。
tags:
  - agent
  - ai-coding
  - typed-boundary
  - structured-output
  - pydantic
  - validation
  - workflow
sources:
  - concepts/typed-ai-agent-boundaries.md
  - concepts/hermes-ai-workflow-formalization-principles.md
  - concepts/ai-coding-agent-workflow-types.md
  - concepts/ai-code-review-governance-and-convergence.md
  - concepts/hermes-context-layer-operating-rules.md
  - concepts/first-edit-economy-for-coding-agents.md
  - concepts/agent-self-validation-loops.md
  - concepts/loop-engineering-hermes-agent-workflow.md
  - concepts/entropy-and-entropy-increase.md
  - concepts/hermes-agent-workflow-layering-and-adoption-order.md
  - concepts/ai-agent-tool-selection-architecture.md
  - https://arxiv.org/abs/2307.09702
  - https://www.cs.tufts.edu/~nr/cs257/archive/john-hughes/quick.pdf
  - https://arxiv.org/abs/2402.01030
  - https://blog.cloudflare.com/code-mode/
  - https://www.anthropic.com/research/advanced-tool-use
  - https://metr.org/Early_2025_AI_Experienced_OS_Devs_Study-paper.pdf
  - https://arxiv.org/html/2510.20270v1
  - https://arxiv.org/html/2509.14745v3
  - https://arxiv.org/abs/2605.22526v1
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Using AI Agent for AI Coding with Typed Boundaries

## Summary

适用范围：本文的 Skill、plan、todo 与历史检索名称仅表示职责或实现示例；按目标宿主和项目现有能力映射，不假定预装同名工具。所有建议服从当前授权与项目规则。

使用 AI Agent 做编程任务时，本 wiki 建议先明确范围与验收，再按风险选择类型边界、最小上下文、窄工具、显式依赖和分层验证。首次编辑流程与验证回路由对应概念页主维护；本页聚焦如何组合这些实践，并设置重试预算、有界清理和证据交接。“反熵工程（Anti-Entropy Engineering）”是工程比喻，不保证消除架构漂移。
Public boundary: this is a version-sensitive method guide. Examples do not prove that a profile, provider, tool or policy is deployed or authorized.

以下是本 wiki 综合 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)、[first-edit-economy-for-coding-agents](/concepts/first-edit-economy-for-coding-agents) 与 [entropy-and-entropy-increase](/concepts/entropy-and-entropy-increase) 的实践建议，不是对效果的数学保证。类型边界与验证可减少接口错误，但不保证实际信息熵降低或业务正确；按任务风险和项目约定选择流程，保留权限、凭据与高风险写入的安全边界。

## Default workflow

### 1. Start with intent, then force a contract

先从已有请求和项目资料确认小 contract；范围清楚的小任务可直接执行，只有实质歧义才先澄清：

- 目标：这次到底要交付什么。
- 输入：用户、文件、API、数据源、环境变量来自哪里。
- 输出：必须返回什么结构、写入什么文件、暴露什么接口。
- 禁止项：不能访问什么、不能修改什么、不能猜什么。
- 验收：怎样证明完成。

推荐起手式：

```text
把这个需求先压成实现 contract：目标、输入、输出、禁止项、验收标准、风险。不要开始改代码。
```

### 2. Choose the AI Agent execution lane

先按任务性质选择执行入口，而不是默认让同一个 agent 扛所有事：

- 小范围解释、方案判断：当前 AI Agent session。
- 多文件修改、需要跑测试：AI Agent terminal + todo + verification。
- 需要隔离上下文且宿主支持的独立子任务：受控委派；否则顺序执行。
- 需要正式实现计划：`writing-plans` / plan page。
- 需要预提交质量检查：code review / requesting-code-review 类 workflow。
- 稳定重复流程：先验证，再考虑沉淀 skill；不要直接上 cron。

校准代码库复杂度预期：在熟悉度高、历史隐性约束密集的大型存量仓库中，[METR 2025 受控实验](https://metr.org/Early_2025_AI_Experienced_OS_Devs_Study-paper.pdf)测得资深维护者使用早期编码 Agent 实测耗时反而增加 `19%`（主观体感却误判提速 `20%`）。对此类核心模块应优先采取窄范围定位与局部辅助，而非盲目发起宽泛全自动委托。完整选型依据见 [ai-coding-agent-workflow-types](/concepts/ai-coding-agent-workflow-types)。

### 3. Convert uncertain model output into typed artifacts

凡是 AI 输出会被程序消费，优先要求结构化：

- JSON schema / Pydantic model / TypedDict / dataclass。
- 明确字段含义和约束。
- 明确错误返回结构。
- 明确空值、缺省值和未知状态。

AI Agent 任务要求可以这样写：

```text
如果 LLM 输出被程序消费，定义输出 schema 并校验类型与业务约束；JSON 解析成功不等于有效。优先复用现有校验能力，不为此默认新增 Pydantic。
```

当单次调用必须同时承担“范围筛选 / 状态判断”和“深层嵌套对象提取”时（尤其在小模型或复杂数据管线中），主动评估拆分为两个窄契约：（1）先锁定候选范围，（2）再对已锁定对象提取明细字段（详见 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)）。

### 3.5 Apply First-Edit Economy to keep context focused

有报错、失败测试、符号名或目标文件等锚点时，从附近证据形成可验证假设，再做小步修改；完整流程由 [first-edit-economy-for-coding-agents](/concepts/first-edit-economy-for-coding-agents) 主维护，不在此重复定义。新增辅助函数前检查既有模式，并在同一 diff 同步受影响的 docstring、注释和类型桩。

### 4. Treat tools as public APIs, not helper functions

任何给 agent 调用的工具都要窄：

- 一个工具只做一类动作。
- 参数类型明确。
- 返回值结构稳定。
- docstring 写清楚何时使用、限制、失败语义。
- 读操作和写操作分开。
- 高风险写操作必须有 dry-run / preview / approval gate。

AI Agent 任务要求可以这样写：

```text
如果要新增 agent/tool 函数，把它当 public API 设计：类型提示、docstring、错误语义、权限边界和测试都要补齐。
```

当任务需要串联多步工具并对大体积中间输出做分页、过滤、排序或关联时，**不要让 LLM 通过多轮 JSON `tool_call` 充当中间数据的“JSON 搬运工”**；若宿主提供受控沙箱或代码执行层（Code Mode / Programmatic Tool Calling，参见 [CodeAct](https://arxiv.org/abs/2402.01030)、[Cloudflare Code Mode](https://blog.cloudflare.com/code-mode/) 与 [Anthropic PTC](https://www.anthropic.com/research/advanced-tool-use)），应让模型编写强类型代码在沙箱内完成确定性数据搬运与聚合，仅将精简后的终态结果返回主上下文，同时保持宿主侧的凭据隔离与逐次 Tool Gate 权限校验（详见 [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)、[ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture) 与 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)）。

### 5. Inject dependencies; do not hide global state

涉及数据库、API client、文件系统、用户上下文、权限或租户信息时，禁止让实现偷偷读全局变量。应使用显式上下文对象传入。

实践要求：

- 依赖通过参数、context object、RunContext 或项目内等价模式注入。
- 测试能替换 fake / mock。
- 不把 API key 写进配置或代码。
- 权限、用户身份、数据范围必须作为显式输入。

这条适用于企业内网 AI 编程：agent 不应直接访问数据库；它应调用继承权限、可审计、返回 typed result 的窄工具。

### 6. Select layered verification by risk

完成不能只看 agent 自报；具体回路与职责边界由 [agent-self-validation-loops](/concepts/agent-self-validation-loops) 主维护。以下是按改动选择的验证层，不要求每次任务全部执行：

- 静态检查：复用项目已有的 lint / type check / format check；纯文档改动优先检查格式、链接和元数据。
- 语法与模式约束：宿主支持时可采用 FSM / JSON Schema 约束解码（参见 [Willard & Louf 2023](https://arxiv.org/abs/2307.09702)）；只保证受支持、已编码的结构约束，不替代业务校验或权限控制。
- 单元测试：涉及 schema validation、tool boundary 或 dependency injection 时覆盖相应边界。
- 属性测试（Property-based Testing）：适用于有明确不变量的核心转换（如 `hypothesis`，参见 [Claessen & Hughes 2000](https://www.cs.tufts.edu/~nr/cs257/archive/john-hughes/quick.pdf)），用收缩后的反例辅助排查缺陷。
- 回归测试：bug fix 优先建立失败先行或等价回归用例；无法执行时披露原因。
- 行为 smoke：入口或运行行为受影响时，运行真实入口或最小可复现命令。
- 安全检查：检查 secrets、越权访问及破坏性默认动作；未验证项须在交接中说明。

推荐结束语：

```text
完成前请给出：修改文件、验证命令、验证结果、仍然未覆盖的风险。不要只说 done。
```

### 7. Bounded self-correction, blast-radius cleanup, and Exit Evidence Block

- **有界自修正与防篡改冲突上报**：事先按项目规则和任务风险确定重试预算（例如最多 3 轮，不是通用阈值）；重复出现相同失败时先诊断或换方法，预算耗尽则停止并交接证据。修复实现期间应将现有测试视为只读约束，严禁弱化断言、删除测试、提前 `sys.exit(0)` 或宽泛 `try/except pass`；当发现需求规约与现有测试直接矛盾时，显式上报契约冲突请人工裁决，而非硬编码特殊分支凑绿灯（[ImpossibleBench](https://arxiv.org/html/2510.20270v1) 在冲突任务上单独评估了上报出口；GPT-5 作弊率从 `54%` 降至 `9%`；回路定义见 [agent-self-validation-loops](/concepts/agent-self-validation-loops) 与 [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow)）。
- **单意图小步粒度与爆炸半径内有界清理（Bounded Cleanup）**：在所研究的 Claude Code PR 初稿中，新增行数中位数为 48（人工 PR 为 24）；标注子样本中近四成有多个目标，含功能与配套测试（[Watanabe 等 2026](https://arxiv.org/html/2509.14745v3)），另一个 Multi-SWE-bench 样本中 `21.43%` 的 Agent 补丁含纠缠重构（人工补丁为 `36.72%`；[Tian 等 2026](https://arxiv.org/abs/2605.22526v1)）。两项研究均未测量审查队列方差（[ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence)）。应仅在本次任务实际触及的文件内清理未使用的导入、死变量和临时调试日志；严禁顺手跨文件重构无关模块，超出范围的技术债统一记入 `Residual Risk`。
- **退出证据块（Exit Evidence Block）**：对非平凡编码或审查任务，建议按以下结构交接；简单任务可压缩为一句话：
  - `Modified Files`：变更文件路径列表及每文件一句话职责说明；
  - `Verification Executed`：实际运行的完整命令及其通过/失败结果；
  - `Residual Risk`：未覆盖的边界条件、跳过的检查或待跟进的跨模块技术债。

## Gotchas & Anti-rationalization interceptors

根据 [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles) 的反合理化原则，使用下表拦截容易引入软件熵增的常见捷径：

| 常见偷懒借口（Shortcut Rationalization） | 本 wiki 建议的应对方式 |
| :--- | :--- |
| “这次改动很小，不需要跑类型检查或测试。” | 按第 6 节选择与改动相关的廉价检查；不能运行时披露，不把改动大小当作质量证明。 |
| “JSON 已经成功解析成 dict，说明输出是合法的。” | JSON 语法合法不等于领域语义有效；必须对照显式 schema 校验字段类型、枚举、取值范围与必填键。 |
| “我先把整个仓库读一遍，确保 100% 稳妥。” | 无锚点的全仓扫描会污染上下文内存并稀释注意力；从具体故障锚点出发，仅沿直接调用边按需扩展（[first-edit-economy-for-coding-agents](/concepts/first-edit-economy-for-coding-agents)）。 |
| “修这个 Bug 的同时，我顺手把旁边三个文件也重构了。” | 将缺陷修复与未授权的跨文件重构混在一起会增加审查与回滚难度；将范围外技术债记入 `Residual Risk`。 |
| “测试又挂了，我把断言放宽一点或者加个 `try/except pass`。” | 严禁通过弱化断言或吞掉异常来伪造门禁通过；按第 7 节的既定预算诊断、修复或停止交接。 |
| “我直接用十几次 `tool_call` 把 100 条 JSON 拉进上下文再逐条筛选转发。” | 禁止让大模型充当按 Token 计费的 JSON 搬运工；多步确定性过滤、排序与参数拼接应下沉至受控代码执行层（[hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)），仅向主上下文回传精简结果与验证证据。 |

## Best-practice prompt templates

### Implementation request

```text
我要用 AI Agent 实现这个功能：<需求>。
先不要写代码。请先输出：
1. scope / non-scope
2. typed input/output contract
3. tool/API boundary
4. dependency injection plan
5. tests and verification gates
6. files likely to change
等我确认后再执行。
```

### Code modification request

```text
按已确认 contract 修改代码。
要求：
- 先读现有实现和测试；不要凭空新建架构。
- LLM/agent 输出必须有 schema 或 typed model。
- 外部依赖必须显式注入，不能藏全局状态。
- 新增工具函数必须有类型提示、docstring、错误语义和测试。
- 完成后运行 lint/type/test/smoke，并报告证据。
```

### Review request

```text
请按 typed-boundary 视角 review 这次改动：
- 是否仍依赖自然语言格式解析？
- schema 是否足够表达业务约束？
- tool surface 是否过宽？
- 是否有隐藏全局状态？
- 权限/审计/错误语义是否明确？
- 测试是否覆盖 validation failure 和工具失败？
```

## Decision checklist

开始前问：

- 这个需求是否能用一句 contract 表达？不能则先拆。
- 这个输出是否会被程序消费？是则必须 typed。
- 这个工具是否可能产生副作用？是则必须 preview / approval / audit。
- 这个依赖是否和用户、权限、租户、环境有关？是则必须显式注入。
- 这个任务是否需要依赖跟踪或上下文隔离？按需使用现有 todo / plan / subagent，不因跨文件就自动升级。
- 这个流程是否已经重复且跑顺？是才考虑 skill；否则只写 wiki/query 或项目计划。

## Anti-patterns

- 直接让 AI Agent “帮我写一个 agent”，但没有输入输出 contract。
- 让 LLM 返回一段自然语言，再用正则从里面抠字段。
- 一个 tool 同时查询、修改、删除、推理，且没有权限边界。
- 在工具函数里偷偷读取全局数据库连接、全局用户、全局环境。
- 只让 agent 自测，不读回 diff、不跑测试、不做 smoke。
- 把一次项目里的临时写法直接沉淀成 skill 或 memory。

## Promotion path

这页作为 AI Agent 反熵编程与类型化边界的主查询入口，连接可复用的工作流规范、项目模板（agent contract / Pydantic model / tool boundary）与代码审查清单（见 [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence)）。具体宿主是否已安装同名 Skill 或自动化门禁以目标环境配置为准，本页不自动授予运行时执行权限。

## Relations
- depends_on: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles), [ai-coding-agent-workflow-types](/concepts/ai-coding-agent-workflow-types), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [first-edit-economy-for-coding-agents](/concepts/first-edit-economy-for-coding-agents), [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- related: [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow), [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence), [entropy-and-entropy-increase](/concepts/entropy-and-entropy-increase), [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order), [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture)

