---
title: "Agent Context: System Prompt, Tools and Examples"
created: 2026-10-17
updated: 2026-10-20
type: concept
tags:
  - agent
  - llm
  - context-engineering
  - workflow
sources:
  - raw/articles/machinelearningmastery-prompt-engineering-agentic-ai-2026-05-19.md
  - raw/articles/machinelearningmastery-tool-selection-ai-agents-2026-07-06.md
  - raw/articles/microsoft-developer-ai-coding-agents-use-technology-2026-05-27.md
  - raw/articles/towardsdatascience-context-engineering-data-scientists-2026-08-30.md
  - raw/articles/langchain-paid-media-agent-2026-09-13.md
  - docs:https://impeccable.style/docs/
  - concepts/ai-agent-tool-selection-architecture.md
status: stable
description: 说明 Agent 静态上下文面的设计：system prompt 作为操作简报、窄工具面与反向边界、可见不等于可用的级联，以及以行为为主的示例。
volatility: medium
review_by: 2026-12-06
---

# Agent Context: System Prompt, Tools and Examples

## Summary

本页是 [agent-context-engineering](/concepts/agent-context-engineering) 的子主题，处理每次运行都要装配的静态上下文面：system prompt、tools 与 examples。核心结论是：system prompt 是保持“恰当高度”的操作简报而非穷举脚本；工具面越窄、边界越清晰越好，且工具“可见”不等于“可用”；示例应展示澄清、停止、失败处理与验证行为。随执行增长的历史与状态见 [agent-context-history-state-and-bounded-processing](/concepts/agent-context-history-state-and-bounded-processing)。

## System prompt: operating brief, not exhaustive script

System prompt 应定义角色、权限边界、工具使用原则、停止条件和输出契约，但不应试图用 if-else 穷举所有场景。

过度指定会让提示词脆弱、难维护，并压低模型处理新情况的能力；指定不足会让 Agent 用隐含假设补空白。更好的做法是保持“恰当高度”：少量高优先级原则 + 清晰验收标准 + 明确越界停止条件。

AI Agent 映射：
- `SOUL.md`、`CLAUDE.md`、`AGENTS.md` 提供全局/项目级行为边界。
- skill 的 `Trigger`、`Workflow`、`Pitfalls`、`Verification` 提供任务级操作边界。
- 不应把某篇文章的 prompt 模板直接硬编码进全局提示词。

### Project mode declaration as high-density context

`towardsdatascience-context-engineering-data-scientists-2026-08-30` 给出一个数据科学场景：与其在项目入口穷举实现规则，不如先声明工作区当前属于 EDA、研究还是生产交付，让 Agent 据此选择 Notebook / 脚本、探索速度和工程严谨度。可迁移机制是**短模式声明 + 不可省略边界**，不是要求模型猜测生产约束。

AI Agent 映射：
- 已有 `AGENTS.md`、`CLAUDE.md`、README 或 project context owner 时，在原 owner 中声明当前模式，不新建平行文件。
- 模式声明只承载会改变多数任务决策的高密度差异；数据权限、验收标准、安全、生产写入和回滚边界仍需明确写出。
- 项目只有一种稳定模式，或源码、测试与现有文档已足以表达时跳过；不要把模式标签变成所有目录的必填模板。

### UI 设计上下文：产品目标与定向改进意图

[Impeccable 官方文档](https://impeccable.style/docs/)提供了一个 UI 任务实例：初始化时记录目标受众与产品目标；改进现有页面时描述具体问题，保留已经有效的设计决策。文档允许直接用自然语言描述结果，不要求记忆专用命令。

其定向词汇将不同意图区分开来，例如 `typeset` 改善文字可读性与层级，`layout` 调整视线引导与内容分组，`quieter` 在保留设计个性的同时降低视觉噪声。这些是 Impeccable 的产品命令示例，不是通用 Agent 原生接口，也不代表确定的执行结果。

文档还区分效果图先行（comp-led）与直接编码（code-led）：前者被描述为更容易探索大胆视觉方向，但需要多轮将图片转为代码；后者倾向于得到更连贯的首版实现，视觉表现则较保守。这是产品文档给出的经验取舍，不是跨模型、技术栈或项目验证过的规律，也不证明代码健壮性。

[推论] 当 UI 任务的设计意图不清楚时，可将任务上下文组织为“受众与目标 + 本轮改进维度 + 应保留的决策”，而不是反复要求“再好看一点”。产品背景优先复用现有项目文档，不因该产品采用 `PRODUCT.md` 就新增平行文件；是否先看效果图，应由当前任务需要决定，不强制增加阶段。结果验证沿用 [agent-self-validation-loops](/concepts/agent-self-validation-loops) 的浏览器、截图与交互反馈；设计意图不能替代功能、可访问性和性能验收。

来源范围：2026-10-01 通过直接网页提取核对 Impeccable 的 “Start with Impeccable” 文档首页正文及命令概览；站点署名创建者 Paul Bakaus，页面未显示发布日期或适用版本。未将其链接的子页面视为已核验，也未安装产品、执行命令或复现实效。这里只保留上下文组织实例，不镜像完整命令清单、安装配置或客户端支持说明；实际采用前应重新核对官方文档。该来源不授权修改全局指令、Skill 或运行时。

### On-demand skill decomposition, not one microtask per file

文章主张把数据加载、清洗、训练等微任务拆成子技能，再由短上层技能路由。对 AI Agent，可迁移标准不是“每个微任务创建 Skill”，而是：拆分后当前任务能省略无关上下文、子流程有独立触发/验证边界，并且现有 owner 无法继续清晰承载时才拆。否则继续使用一个 owner 加按需 reference；具体瘦身方法见 [hermes-skill-refactoring-methodology](/concepts/hermes-skill-refactoring-methodology)，不在本页复制。

## Tools: narrow action surface with negative boundaries

Agent 能调用工具不等于应该暴露更多工具。工具越宽、越相似、越缺少失败语义，模型越容易在多步执行中选错工具。

本页只保留上下文装配层的原则：工具描述应让模型知道“何时使用、何时不用、失败后怎么办、成本/风险是什么”。工具类型、schema、dependency injection 与 public API 边界详见 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)，不要在本页重复维护。

AI Agent 映射：
- 工具说明应包含用途、限制、失败语义和反向边界。
- 高风险工具不应靠 prompt 自觉控制，应配合权限、审批、审计和回滚。
- 给一个 Agent 挂载工具前，先问：当前任务真的需要它进入可见工具面吗？

### AX 级联补充：可见不等于可用

Microsoft Developer 的 AX 文章补充了一个容易误判的点：工具安装或注册成功，只说明它可能进入 harness 的候选面，不说明模型一定能看到、理解、选择并正确使用它。工具可用性至少经过一条级联链：

1. harness 是否把工具描述装进上下文；
2. 模型是否把用户意图语义匹配到该工具；
3. 模型是否愿意调用工具，而不是用过时训练知识高置信猜测；
4. 工具 schema、参数和返回内容是否足够短、清楚、可执行；
5. 生成后，CLI/LSP/test 错误是否能让 agent 自修复。

AI Agent 映射：评估 skill/tool/MCP 不应只看“是否被暴露”或“是否被调用”，还要看在真实组合上下文里是否被正确选择、低噪声返回、失败后可诊断。这条规则补充 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 的工具接口原则和 [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management) 的上下文预算原则。

### 工具可用性与逐轮候选集分离

[ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture) 进一步区分“系统允许使用哪些工具”和“当前推理步骤应让模型看到哪些工具”。若目标宿主的工具配置支持平台、会话和任务级静态边界，应先复用这些边界；动态 Top-K、语义路由或规划式选择只有在真实会话基线证明静态收窄仍不足时，才值得进入项目级试验。外部文章中的工具数量和阈值不应直接变成 active runtime 默认值。

### Paid Media Agent：按需工具与确定性计算案例

LangChain 的 `langchain-paid-media-agent-2026-09-13` 是上述原则的生产案例，而不是新的默认架构。其早期周报把原始广告和 pipeline 数据全部交给模型计算；作者报告单次约 390 万输入 Token、1,112 秒。改由 Python 对齐时间窗、计算指标并应用固定规则后，模型只解释原因和提出建议，运行时间降至 85 秒，成本约降 40 倍。这些数字只适用于该冻结测试集，但支持“模型负责判断，代码负责可复现计算”的边界。

同一案例把 200 多个广告接口隐藏在 Search → Read schema → Run 三步之后，仅披露当前问题需要的定义；作者报告首轮工具上下文由约 38,000 Token 降至 12,000 Token。可迁移规则仍是渐进披露并以任务完成率和答案质量共同验收，不是照搬 Top-K、Token 阈值或 LangChain 产品栈。

该案例还说明权威源应按指标而非整套系统指定：广告平台负责 spend、impressions、clicks，warehouse 负责 leads、opportunities、pipeline；无法可靠关联时保留来源、时间窗、归因模型和缺口，不用模型制造统一答案。

## Examples: demonstrate behavior, not only answers

Agent 的 Few-shot 示例不应只展示“输入 → 正确输出”。对多步任务，更有价值的是展示行为模式：如何澄清范围、何时暂停、如何处理工具失败、如何验证结果、如何在证据不足时降级回答。

AI Agent 映射：
- skills 的 references、fixtures、validation records 可以承载局部 Few-shot。
- 示例应按任务即时加载，而不是塞进全局上下文。
- 至少为复杂工作流保留一个“识别歧义 → 停止执行 → 请求澄清”的样例。

## Relations
- refines: [agent-context-engineering](/concepts/agent-context-engineering)
- depends_on: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)
- related: [agent-context-history-state-and-bounded-processing](/concepts/agent-context-history-state-and-bounded-processing), `machinelearningmastery-prompt-engineering-agentic-ai-2026-05-19`, `machinelearningmastery-tool-selection-ai-agents-2026-07-06`, `microsoft-developer-ai-coding-agents-use-technology-2026-05-27`, `towardsdatascience-context-engineering-data-scientists-2026-08-30`, `langchain-paid-media-agent-2026-09-13`, [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture), [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management), [hermes-skill-refactoring-methodology](/concepts/hermes-skill-refactoring-methodology), [agent-self-validation-loops](/concepts/agent-self-validation-loops)

