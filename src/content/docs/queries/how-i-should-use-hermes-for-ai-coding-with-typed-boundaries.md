---
title: Using Hermes for AI Coding with Typed Boundaries
created: 2026-05-01
updated: 2026-05-01
type: query
status: stable
description: 回答如何用 Hermes 以 typed boundaries、窄工具面和验证门执行 AI 编程任务。
tags:
  - hermes
  - ai-coding
  - typed-boundary
  - workflow
  - verification
sources:
  - concepts/typed-ai-agent-boundaries.md
  - concepts/hermes-ai-workflow-formalization-principles.md
  - concepts/ai-coding-agent-workflow-types.md
  - concepts/hermes-context-layer-operating-rules.md
---

# Using Hermes for AI Coding with Typed Boundaries

## Summary

我用 Hermes 做 AI 编程时，默认最佳实践不是“让 agent 自由写代码”，而是把任务不断收窄成可验证边界：先把自然语言需求压成规格和验收标准，再选择执行入口，再要求实现围绕 typed output、narrow tool surface、explicit dependency context 和 verification gate 展开。
Public boundary: this is a version-sensitive method guide. Examples do not prove that a profile, provider, tool or policy is deployed or authorized.


核心原则来自 `[[typed-ai-agent-boundaries]]`：模型仍然不确定，但我可以让模型和工程系统之间的接口更确定。

## Default workflow

### 1. Start with intent, then force a contract

不要直接说“帮我实现 X”。先让 Hermes 把需求压成一个小 contract：

- 目标：这次到底要交付什么。
- 输入：用户、文件、API、数据源、环境变量来自哪里。
- 输出：必须返回什么结构、写入什么文件、暴露什么接口。
- 禁止项：不能访问什么、不能修改什么、不能猜什么。
- 验收：怎样证明完成。

推荐起手式：

```text
把这个需求先压成实现 contract：目标、输入、输出、禁止项、验收标准、风险。不要开始改代码。
```

### 2. Choose the Hermes execution lane

先按任务性质选择执行入口，而不是默认让同一个 agent 扛所有事：

- 小范围解释、方案判断：当前 Hermes session。
- 多文件修改、需要跑测试：Hermes terminal + todo + verification。
- 需要隔离上下文的复杂子任务：`delegate_task` subagent。
- 需要正式实现计划：`writing-plans` / plan page。
- 需要预提交质量检查：code review / requesting-code-review 类 workflow。
- 稳定重复流程：先验证，再考虑沉淀 skill；不要直接上 cron。

参考：`[[ai-coding-agent-workflow-types]]`。

### 3. Convert uncertain model output into typed artifacts

凡是 AI 输出会被程序消费，优先要求结构化：

- JSON schema / Pydantic model / TypedDict / dataclass。
- 明确字段含义和约束。
- 明确错误返回结构。
- 明确空值、缺省值和未知状态。

Hermes 任务要求可以这样写：

```text
如果实现中需要 LLM 输出被程序消费，先定义 Pydantic model 或等价 schema；不要依赖自然语言解析、正则或脆弱 json.loads。
```

### 4. Treat tools as public APIs, not helper functions

任何给 agent 调用的工具都要窄：

- 一个工具只做一类动作。
- 参数类型明确。
- 返回值结构稳定。
- docstring 写清楚何时使用、限制、失败语义。
- 读操作和写操作分开。
- 高风险写操作必须有 dry-run / preview / approval gate。

Hermes 任务要求可以这样写：

```text
如果要新增 agent/tool 函数，把它当 public API 设计：类型提示、docstring、错误语义、权限边界和测试都要补齐。
```

### 5. Inject dependencies; do not hide global state

涉及数据库、API client、文件系统、用户上下文、权限或租户信息时，禁止让实现偷偷读全局变量。应使用显式上下文对象传入。

实践要求：

- 依赖通过参数、context object、RunContext 或项目内等价模式注入。
- 测试能替换 fake / mock。
- 不把 API key 写进配置或代码。
- 权限、用户身份、数据范围必须作为显式输入。

这条直接服务于你关心的企业内网 AI 编程：agent 不应直接访问数据库；它应调用继承权限、可审计、返回 typed result 的窄工具。

### 6. Make verification mandatory and layered

完成不能只看 agent 自报。Hermes 必须读回、运行、验证。

最低验证层：

- 静态检查：lint / type check / format check。
- 单元测试：覆盖 schema validation、tool boundary、dependency injection。
- 回归测试：bug fix 必须有失败先行或等价回归用例。
- 行为 smoke：跑一次真实入口或最小可复现命令。
- 安全检查：确认没有 secrets、越权访问、破坏性默认动作。

推荐结束语：

```text
完成前请给出：修改文件、验证命令、验证结果、仍然未覆盖的风险。不要只说 done。
```

## Best-practice prompt templates

### Implementation request

```text
我要用 Hermes 实现这个功能：<需求>。
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
- 这个任务是否跨文件、跨命令、跨验证？是则使用 todo / plan / subagent。
- 这个流程是否已经重复且跑顺？是才考虑 skill；否则只写 wiki/query 或项目计划。

## Anti-patterns

- 直接让 Hermes “帮我写一个 agent”，但没有输入输出 contract。
- 让 LLM 返回一段自然语言，再用正则从里面抠字段。
- 一个 tool 同时查询、修改、删除、推理，且没有权限边界。
- 在工具函数里偷偷读取全局数据库连接、全局用户、全局环境。
- 只让 agent 自测，不读回 diff、不跑测试、不做 smoke。
- 把一次项目里的临时写法直接沉淀成 skill 或 memory。

## Promotion path

这页先作为我的 Hermes AI 编程最佳实践查询页。只有当这些规则在真实项目中反复跑通后，才进一步拆成：

- skill：例如“Hermes typed-boundary AI coding workflow”。
- project template：Python 项目中的 agent contract / Pydantic model / tool boundary 模板。
- code review checklist：专门检查 LLM 输出、tool surface、dependency injection。

当前不直接创建 skill，因为最佳实践还需要在真实项目中验证。

## Relations
- depends_on: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)
- depends_on: [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)
- depends_on: [ai-coding-agent-workflow-types](/concepts/ai-coding-agent-workflow-types)
- depends_on: [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)

## Related

- [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)
- [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)
- [ai-coding-agent-workflow-types](/concepts/ai-coding-agent-workflow-types)
- [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- [index](/)
- `log`

