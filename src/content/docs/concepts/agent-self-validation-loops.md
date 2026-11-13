---
title: Agent Self-Validation Loops
created: 2026-05-06
updated: 2026-11-12
type: concept
tags:
  - agent
  - ai-coding
  - validation
  - claude-code
  - mcp
  - browser
  - workflow
sources:
  - raw/articles/towardsdatascience-claude-code-self-validation-2026-05-05.md
  - raw/papers/arxiv-2305-16291-voyager.md
  - docs:https://arxiv.org/abs/2310.01798
  - docs:https://arxiv.org/html/2304.05128v2
  - docs:https://arxiv.org/html/2305.11738v4
  - docs:https://arxiv.org/html/2303.11366v4
  - docs:https://arxiv.org/html/2409.12917
status: stable
description: 定义让 Agent 通过可观察反馈实现、运行、比较和修正结果的自我验证闭环。
aliases:
  - self-validation-loop
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Agent Self-Validation Loops

## Summary
Agent 自我验证闭环（[towardsdatascience-claude-code-self-validation-2026-05-05](https://github.com/on195594/wiki/blob/e8407157b061dc6eb64a54385558e1255061c12c/raw/articles/towardsdatascience-claude-code-self-validation-2026-05-05.md)）的核心不是让模型“凭空自省把代码写对”，而是把任务设计成**带外部可观察反馈（External Oracle / Environment Feedback）**、可比较、有界迭代的工程回路：人类给出目标、基准或可观察环境，agent 负责实现、运行、比较、修正，并在无法验证或重试不收敛时报告差异。相关研究表明，未经专门训练、只靠提示驱动的内生自我修正（Intrinsic Self-Correction）在部分推理任务上会降低准确率（[Huang et al., ICLR 2024](https://arxiv.org/abs/2310.01798)）；但这不是所有模型的能力上限，[SCoRe](https://arxiv.org/html/2409.12917) 展示了经多轮强化学习训练后的内生自我修正增益。工程上仍应优先使用编译器、测试、解释器或 DOM 等可回读证据，且不能把任何反馈通道本身视为正确性保证。

## Core pattern

### 1. Give the agent a verifiable target
自我验证需要一个可判断的目标，而不是只给模糊描述。

常见目标形式：
- 旧实现的输入/输出样本
- 测试命令和预期结果
- API response fixture
- 设计截图或视觉目标
- 日志、性能指标或延迟门槛
- lint/type/test gate

没有目标时，agent 只能自信地猜；有目标时，它可以把输出和现实世界对齐。

### 2. Give the agent a feedback channel
验证闭环必须能让 agent 看到结果，而不是完全依赖人类转述。

反馈通道包括：
- terminal：运行测试、脚本、benchmark、lint、type check
- browser/MCP：打开页面、点击、截图、读 console、检查 DOM
- file artifacts：读回生成文件、比较中间产物、检查日志
- API/tool calls：对比新旧接口输出、检查状态码和结构

这也是 MCP/tooling 的真正价值：不是“工具越多越好”，而是为关键步骤提供可观察反馈面。

### 3. Make iteration explicit
Agent 应被明确要求：验证失败就修改，再运行验证，直到通过或遇到不可解决的歧义。

闭环应包含：
1. implement
2. run validation
3. compare actual vs expected
4. fix discrepancy
5. rerun validation
6. report final evidence or unresolved issue

### 4. Define equivalence, not always exact equality
有些任务可以要求精确一致，例如确定性函数、schema、测试输出。有些任务只能要求语义或视觉近似，例如 LLM 输出重构、UI 还原、摘要质量。

可迁移规则：
- 确定性代码：要求 exact match 或测试全绿
- LLM pipeline：要求结构、字段、关键事实和业务结论一致
- UI：要求 layout、spacing、color、component hierarchy 接近，并列出剩余差异
- 性能：要求达到明确阈值，而不是主观“更快”

### 5. Stop conditions are part of safety
自我验证不等于无限重试。好的 agent loop 必须知道什么时候停止。

停止条件：
- 验证通过并能给出证据
- 验证工具不可用
- 目标定义有歧义
- 需求与现有系统约束冲突
- 重试多轮后差异仍不收敛
- 下一步需要权限、产品裁决或外部副作用

## What uncertainty this solves
自我验证闭环主要降低这些不确定性：
- 代码是否真的运行
- refactor 是否保持行为等价
- UI 是否接近目标设计
- 生成文件是否符合格式和内容要求
- agent 是否遗漏了明显错误
- “完成”是否有证据支撑

它不能完全解决：
- 目标本身是否正确
- 产品/业务取舍是否合理
- 安全权限、回滚、部署风险
- 复杂视觉判断的主观差异
- LLM 输出的长期漂移和成本问题

人的理解重建与责任归属见 [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation)；如何阅读验证证据并让产出量匹配可核验的处理能力，见 [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence)。本页维护验证回路，不重复这些人的判断与审查职责。

## Theoretical foundation: intrinsic self-correction failure vs. external-feedback grounding

为何工程交付应优先使用可回读的验证证据，而不只要求模型“仔细检查自己的答案”？以下研究说明不同训练与反馈条件下的经验边界，不构成“无外部反馈必然失败”或“有工具必然成功”的定理：

1. **提示驱动修正的局限与专门训练的区别**：[*Large Language Models Cannot Self-Correct Reasoning Yet*](https://arxiv.org/abs/2310.01798)（ICLR 2024）发现，其评估的模型在缺少外部反馈时常把正确答案改错。`[推论]` 在同一批配对样本上，将错误改正确与正确改错误的比例分别记为 $p_{i \to c}$ 与 $p_{c \to i}$，则净准确率变化为：
   $$\Delta = P(\text{correct}_{t_2}) - P(\text{correct}_{t_1}) = p_{i \to c} - p_{c \to i}$$
   该等式不预设 $\Delta$ 的符号。[*Training Language Models to Self-Correct via Reinforcement Learning*（SCoRe）](https://arxiv.org/html/2409.12917) 则通过多轮 RL 训练改善内生自我修正：训练阶段使用奖励信号，但测试时不需要逐轮外部正确性反馈。不能把训练期监督与推理期 oracle 混为一谈。
2. **三类调试与反馈机制（反馈来源及可靠性并不相同）**：
   - **Self-Debugging（代码生成 → 小黄鸭/执行轨迹解释 → 单元测试或执行表反馈）**：Xinyun Chen 等（2023/2024，ICLR 2024，[*Teaching Large Language Models to Self-Debug*](https://arxiv.org/html/2304.05128v2)）将单轮调试拆为 `Generation → Explanation → Feedback` 三步：在有单元测试的 TransCoder（C++ 转 Python）与 MBPP 上，结合单元测试执行结果与逐行自然语言/模拟轨迹解释，准确率提升最高达 `12` 个百分点，且样本效率匹敌或超越生成 $10\times$ 候选程序的基线；在无现成单元测试的 Spider Text-to-SQL 上，先推断预期返回列数并执行 SQL 读取返回表前 2 行样本再做子句解释比对，报告整体准确率提升 `2–3` 个百分点（最难级别问题提升 `9` 个百分点）。
   - **CRITIC（工具交互式验证批评）**：Zhibin Gou 等（2023/2024，ICLR 2024，[*CRITIC: Large Language Models Can Self-Correct with Tool-Interactive Critiquing*](https://arxiv.org/html/2305.11738v4)）让模型通过解释器、检索等工具验证并批评输出。工具结果可以帮助发现部分错误，但解释器正常执行不能排除题意理解或算法错误，检索内容本身也需核验；不能将工具可用等同于输出可靠。
   - **Reflexion（评估反馈转语言化反思记忆）**：Noah Shinn 等（2023，NeurIPS 2023，[*Reflexion: Language Agents with Verbal Reinforcement Learning*](https://arxiv.org/html/2303.11366v4)）将环境反馈、启发式规则或 LLM 自评转为语言化反思并保存在情节记忆中，指导后续尝试。评估器可以是模型或自生成测试，不必是确定性外部 oracle，也没有普遍成功保证。
3. **确定性精确等价 vs. 随机流水线的容差等价与有界停止判据**：
   - 在 [towardsdatascience-claude-code-self-validation-2026-05-05](https://github.com/on195594/wiki/blob/e8407157b061dc6eb64a54385558e1255061c12c/raw/articles/towardsdatascience-claude-code-self-validation-2026-05-05.md) 的后端重构案例中，作者因单体长 Token LLM 调用平均耗时约 `30s`、但约每 `10` 次就有 `1` 次尾部延迟飙升至 `>120s`，将其拆分为 3 个并行子调用；由于 LLM 输出具有随机性，验证目标是与拆分前输出作近似等价比较，而非字节级全等。`[推论]` 可用**结构与语义容差** $\mathcal{D}_{\text{sem}}(y_{\text{split}}, y_{\text{ref}}) \le \epsilon_{\text{tol}}$ 并结合尾部延迟指标表示项目验收目标；具体度量与阈值需另行定义，不是原文给出的公式。
   - `[推论]` 借用 [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow) 的控制回路类比，可在验收指标可靠时跟踪不一致度量 $V(y_t) \ge 0$，但随机输出或多步修复不保证每轮严格下降。重试预算 $B_{\text{retry}}$ 与停滞窗口应由项目预先设定（本页提示模板以连续 3 轮不收敛为例），而非论文给出的全局常数。预算耗尽、同类失败在停滞窗口内重复且无新证据、验证器不可用或需要权限裁决时，应停止并上交失败证据；状态重复可作为诊断信号，严禁弱化测试断言伪造通过。

## Environment-grounded skill admission

Voyager（[arxiv-2305-16291-voyager](https://github.com/on195594/wiki/blob/e8407157b061dc6eb64a54385558e1255061c12c/raw/papers/arxiv-2305-16291-voyager.md)）展示了比纯文本自我批评（prose self-critique）更强的闭环：生成可执行代码、在环境中运行、反馈中间状态与执行报错、校验任务完成度，仅在验证通过后才将程序沉淀至可检索的技能库。同时其自身的失败案例也表明验证器不可被盲目视为权威：课程可能生成不可能完成的任务，程序可能调用不存在的 API，自我验证 critic 亦会漏判真实成功。可迁移原则是“先有环境证据再做技能准入”；AI Agent active skill 的自主修改仍被严格排除在本模式之外。参见 [agent-architecture-primary-paper-map](/queries/agent-architecture-primary-paper-map) 与 [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification)。

## AI Agent mapping

### Tool-use discipline
本页建议目标工作流要求“工具优先、验证后再声明完成”。这篇文章把同一原则映射到 coding agent：prompt 里不只写需求，还要写验证路径。

### Skills
如果某类任务反复出现，应把验证方法写进对应 skill：
- 修改代码：测试、lint、type check、read-back
- 前端/UI：browser screenshot、DOM/console、视觉差异说明
- 数据处理：fixture、golden output、schema comparison
- 长流程：中间 artifact、阶段 gate、失败恢复点

### Wiki
该模式适合进入 wiki，因为它是跨工具、跨项目可复用的工程概念。具体命令或项目 gate 仍应留在项目文档或 skills 中。

### MCP/browser
浏览器类 MCP 应被视为验证面，而不是只用于“看网页”。它适合 Web/UI/可视化任务，但不应替代测试、类型检查或后端 smoke test。

## Operating rules
1. 给 coding agent 派任务时，同时给出验收方法。
2. 能给 baseline output，就不要只给自然语言描述。
3. 能让 agent 自己运行测试，就不要让人类转述错误。
4. 视觉任务必须尽量有截图、浏览器或 DOM 反馈面。
5. LLM pipeline 重构要比较语义等价，不要假装随机输出能字节级一致。
6. 任何“完成”都应附带验证证据：命令、日志、截图、文件路径或差异说明。
7. 如果无法验证，agent 应停止并报告限制，而不是继续猜。

## Prompt template
适合直接放进 coding-agent 任务描述：

```text
完成实现后不要直接声明完成。请先运行约定验证命令，读取输出；如果失败，基于错误继续修改并重跑验证。循环直到验证通过，或遇到无法自行解决的歧义/权限/环境问题。

最终回复必须包含：
- 改了什么
- 运行了哪些验证命令或浏览器检查
- 验证结果证据
- 仍未解决的限制或需要我决策的问题

如果连续 3 轮验证仍不收敛，请停止修改，汇报每轮失败证据和你判断的根因，不要继续猜。
```

UI/Web 任务追加：

```text
启动本地服务后，用浏览器访问目标页面，检查 console/DOM/截图；将实际页面与设计稿或目标描述对比，修复可确认差异。无法从截图/DOM 判断的设计取舍要列为待确认问题。
```

## Relationship to document fidelity risk

[ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk) narrows what “verified” must mean for document-transform tasks: the agent should prove not only that the task completed, but also that source content was not silently deleted, rewritten, or hallucinated across steps.

## What this adds to the existing wiki
已有 [claude-code-practical-workflow-tips](/concepts/claude-code-practical-workflow-tips) 覆盖 Claude Code 的使用入口和浏览器验证价值；[agentic-content-pipeline-design-patterns](/concepts/agentic-content-pipeline-design-patterns) 覆盖生产级 agent pipeline 的中间产物与人工审核；[hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles) 覆盖自然语言到形式化约束的路线。

本页补充的是更小、更通用的验证模式：如何把一次 coding task 包装成 agent 可以自行闭环的目标-反馈-迭代结构。

## Relations

- refines: [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)
- related: [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence), [claude-code-practical-workflow-tips](/concepts/claude-code-practical-workflow-tips), [agentic-content-pipeline-design-patterns](/concepts/agentic-content-pipeline-design-patterns), [ai-coding-agent-workflow-types](/concepts/ai-coding-agent-workflow-types), [first-edit-economy-for-coding-agents](/concepts/first-edit-economy-for-coding-agents), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow), [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop), [agent-architecture-primary-paper-map](/queries/agent-architecture-primary-paper-map), [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification), [human-machine-scientific-discovery-verification-scarcity](/concepts/human-machine-scientific-discovery-verification-scarcity), [google-sre-gemini-cli-incident-response](/concepts/google-sre-gemini-cli-incident-response), [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation)

