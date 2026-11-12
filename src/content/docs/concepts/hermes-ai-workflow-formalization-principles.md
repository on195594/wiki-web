---
title: AI Agent Workflow Formalization Principles
created: 2026-04-16
updated: 2026-11-11
type: concept
tags:
  - agent
  - llm
  - workflow
  - decision
  - note
  - skills
  - governance
sources:
  - raw/articles/dijkstra-ewd667-natural-language-programming-1978.md
  - raw/articles/arixzone-dijkstra-ai-programming-2026-03-31.md
  - raw/articles/towardsdatascience-vibe-coding-spec-driven-development-2026-05-12.md
  - raw/articles/addyosmani-agent-skills-2026-05-03.md
  - raw/articles/langchain-interpreter-skills-2026-05-30.md
  - raw/articles/kdnuggets-specification-engineering-2026-08-10.md
  - raw/articles/towardsdatascience-right-problem-agentic-ai-2026-09-03.md
  - docs:https://github.blog/ai-and-ml/github-copilot/when-chat-is-the-wrong-ui/
  - raw/articles/aymannadeem-plan-mode-is-dead-2026-09-24.md
  - raw/articles/thenewstack-kill-code-review-theater-2026-09-30.md
  - docs:https://www.oreilly.com/radar/code-review-after-code-gets-cheap/
  - raw/articles/claude-dev-solving-code-review-at-anthropic-2026-10-15.md
  - https://arxiv.org/abs/2307.09702
  - https://www.inf.unibz.it/~franconi/teaching/2006/kbdb/Codd72a.pdf
  - https://www.cs.tufts.edu/~nr/cs257/archive/john-hughes/quick.pdf
aliases:
  - agent-ai-workflow-formalization-principles
status: stable
description: 把形式化思想转译为 AI Agent 工作流中的规格、边界、验证和可回滚原则。
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# AI Agent Workflow Formalization Principles

## Summary

适用范围：本文的 Skill、plan、todo 与历史检索名称仅表示职责或实现示例；按目标宿主和项目现有能力映射，不假定预装同名工具。所有建议服从当前授权与项目规则。
基于 [dijkstra-ewd667-natural-language-programming-1978](https://github.com/on195594/wiki/blob/3e4e451e6fce73edab27c6eb3cf737bcb810d162/raw/articles/dijkstra-ewd667-natural-language-programming-1978.md) 与 2026 AI 编程文章 [arixzone-dijkstra-ai-programming-2026-03-31](https://github.com/on195594/wiki/blob/3e4e451e6fce73edab27c6eb3cf737bcb810d162/raw/articles/arixzone-dijkstra-ai-programming-2026-03-31.md) 的双来源对照，AI Agent 的工作流应明确采用“自然语言输入 + 形式化约束 + 验证闭环”的路线。
AI Agent 不应把对话本身当作最终控制面，而应不断把模糊意图压缩为 spec、检查清单、测试、结构化知识和可执行约束。
自动检查通过不能替代团队对目标、关键决策和系统的共享理解；必要的决策理由与责任边界仍应保留在项目既有载体中。
审查以需求与实现的双向追溯核对行为漂移，以断言和当前修订的证据检验测试，结合前置自验证、审查收敛控制与快速回滚，按影响半径与错误的可逆性分级投入人类注意力，并以回滚与事故率作为护栏。

## Principle 1: language is for intent, not for final control
自然语言适合表达目标、背景、偏好和方向。
但在 AI Agent 工作流里，真正决定质量的不是“说了什么”，而是最后有没有被收敛成可验证结构。

实践含义：
- 用户消息是起点，不是终点
- 只有当任务需要跨会话交接、共享决策或可复核的验收边界时，才把必要结论留在其现有 owner（如项目 spec / todo）；任务长短本身不要求新建 wiki、skill 或配置

### 交互面也应按任务收窄

GitHub Blog 的 [When chat is the wrong UI](https://github.blog/ai-and-ml/github-copilot/when-chat-is-the-wrong-ui/)（Burke Holland，2026-09-24）从界面角度补充了这条原则：聊天适合提出意图和探索未知任务；任务及操作明确、又需要反复执行时，继续让模型代点按钮或代跑固定命令未必合算。文中用 Copilot app 的 Canvas 演示包管理、SQLite 查询和写作界面。可迁移的判断是**优先复用已有确定性工具或窄界面；确有反复交互缺口时，才考虑生成新界面**，而不是把 Canvas 产品形态当作通用要求。

证据边界：这是一篇产品实践与观点文章，没有成本或效率的对照测量；只有无需再次调用 Agent 的常规 UI 操作才可能不消耗模型 Token，生成、维护工具及再次调用 Agent 仍有成本。文中展示的 AI 对工作流截图的赞语不能证明 GitHub Issue、确定性协调器或人工门禁已经作为完整架构得到验证。此处仅沉淀界面选择的判断，不引入新默认工作流、权限或自动化。

## Principle 2: prefer narrow interfaces
接口越宽，歧义越多，返工越多。
在 AI Agent 里，窄接口意味着：
- 明确的任务边界
- 简短而稳定的工具调用输入
- 可复查的文件化产物
- 明确的验收标准

实践含义：
- 需要跨会话维护的决策和契约落到现有文件；局部、可回滚的短任务可在对话中澄清并验证，不为留痕而造文档
- 能拆成小页面、小技能、小检查项就不要做成大杂烩

## Principle 2.5: durable projects need a spec source of truth
[towardsdatascience-vibe-coding-spec-driven-development-2026-05-12](https://github.com/on195594/wiki/blob/3e4e451e6fce73edab27c6eb3cf737bcb810d162/raw/articles/towardsdatascience-vibe-coding-spec-driven-development-2026-05-12.md) 对 AI Agent 的补充是：当工作跨多轮会话、多 agent 或多人协作时，聊天历史不能承担 source of truth。真正稳定的控制面应该是项目内 docs/spec 文件、计划、验收标准和验证记录。

实践含义：
- durable agent/project work should use docs/spec files as the source of truth, not chat history
- 需求或实现过程中发现约束变化时，先更新 spec，再调整实现和测试
- 临时聊天指令不能成为唯一决策记录
- 具体 spec 目录复用目标项目既有约定，不依赖名为 `writing-plans` 的 Skill

## Principle 2.6: specification is an agreement, not an eight-field ritual

[kdnuggets-specification-engineering-2026-08-10](https://github.com/on195594/wiki/blob/3e4e451e6fce73edab27c6eb3cf737bcb810d162/raw/articles/kdnuggets-specification-engineering-2026-08-10.md) 把 prompt 与 specification 的边界说得更直接：prompt 解决“如何提问”，specification 解决“参与者如何共同判断做对了”。可复用的最小检查面是目标、必要上下文与输入、输出契约、约束、验收标准、边缘情况和验证方式；但这些是风险检查面，不是每个任务必须填写的固定模板。

AI Agent 映射：
- 需求、边界或验收不清，或任务跨模块、跨会话、跨 agent、涉及 active/high-risk surface 时，先按项目现有方法澄清规格与验收；
- 规格草案应让 AI 指出缺失条件，但生成者的自检不能替代独立测试、结构化校验或人工判断；
- 只针对失败的验收项定向修正，并记录最终假设、已知局限和 contract 变化；
- 明确、局部、可回滚且有便宜确定性验证的小修可直接实现并验证，不为形式完整度增加仪式。

[towardsdatascience-right-problem-agentic-ai-2026-09-03](https://github.com/on195594/wiki/blob/3e4e451e6fce73edab27c6eb3cf737bcb810d162/raw/articles/towardsdatascience-right-problem-agentic-ai-2026-09-03.md) 增加了一个用于分配前置投入的维度：**验证投入应随决策的反悔成本增加**。优先验证可能推翻数据契约、系统边界、集成方案或权限边界的假设；文案等便宜、局部、可逆的细节保留弹性。验证手段可以是已有证据、用户确认、真实样本或最小 Spike，结论回写原有 spec / ADR，而不是为文章提出的六个领域分别建立必填文档。

这是一条风险比例原则，不是“消除全部不确定性”的硬门禁，也不意味着默认增加多 Agent 审查。文章主要提供工程师经验案例与假设性推演，没有受控数据证明工时不增加或返工必然下降；其中“理想情况下不会花更多时间”不能转写成 AI Agent 的效果承诺或阈值。

证据边界：原文是二手工程综述；ROPE、SWE-bench/SWT-Bench 和 DORA 数字在成为强制门禁或本地阈值前，需要回到原论文或官方报告核验。

### 规划是过程，不必总有计划文档

[Plan mode is dead](https://www.aymannadeem.com/artificial/intelligence,/developer/tools/2026/09/24/plan-mode-is-dead.html)（[aymannadeem-plan-mode-is-dead-2026-09-24](https://github.com/on195594/wiki/blob/3e4e451e6fce73edab27c6eb3cf737bcb810d162/raw/articles/aymannadeem-plan-mode-is-dead-2026-09-24.md)，Ayman Nadeem，2026-09-24；2026-09-26 直接提取到完整可读正文，图片仅有替代文本）复盘其 AI 编程工具 Nuanced：早期用户不愿阅读长篇 AI 生成规格，Spec Tour 又增加一层文本；强制“澄清 → 生成规格 → 审批 → 实现”的单向流程，令实现中发现的新问题难以自然回到讨论。作者因此主张在“理解 → 行动 → 检查 → 澄清 → 调整”的循环里持续规划，而非默认生成静态计划。文章同时指出，多 Agent 并行时如何保持人的系统理解仍未解决。

AI Agent 应用建议（推论，非原文结论或现行 Skill 行为证明）：在对话中持续规划，仅当用户要求留档或存在真实跨会话交接需求时保存计划；清楚、局部且可验证的修复不必为写计划而暂停执行。跨 Agent 契约、难以反悔的架构决定、生产数据、安全或权限边界仍需按各自现行规则保留必要的 spec、验收、独立验证和授权。这里反对的是**无必要的长篇产物与强制模式切换**，不是取消思考或风险门禁。

证据局限与沉淀级别：这是作者对自身产品和早期用户的定性复盘，没有跨团队对照数据；“计划模式已死”不能外推到所有项目。此处只作 Wiki 反例及比例原则说明，不因单篇文章修改 active skill、默认门禁或运行配置；若未来发现现行路由反复制造无用文档，再按实际案例定向删改。

## Principle 3: formal artifacts are the real memory of work
真正可靠的长期资产不是聊天记录，而是形式化产物：
- `wiki` 页面
- `skills`
- 配置文件
- 测试
- 检查清单
- 结构化日志

实践含义：
- 复杂结论进 wiki
- 可复用方法进 skills
- 偏好与稳定事实进 memory
- 临时过程只留在 sessions

## Principle 4: verification is mandatory
AI 输出的最大风险不是不会说，而是会在模糊处自动补全。
所以 AI Agent 必须强调验证。

实践含义：
- 写完文件后要读回验证
- 改完配置后要跑 check 或 smoke test
- 建完知识页后要更新 index 和 log
- 长流程要有显式 completion criteria

### 代码审查分层、双向追溯与收敛治理（子页导航）

当大量代码由 AI Agent 生成时，单靠自动检查容易退化为无人真正理解决策的“审查作秀（review theater）”，而作者与审查者均为 Agent 时又容易陷入反复指摘的死循环。详细机制与证据边界已拆分为子概念页 [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence)，核心准则包括：

1. **自动验证不替代共享理解**（[thenewstack-kill-code-review-theater-2026-09-30](https://github.com/on195594/wiki/blob/3e4e451e6fce73edab27c6eb3cf737bcb810d162/raw/articles/thenewstack-kill-code-review-theater-2026-09-30.md)）：分开验实现与判目标（配合 [agent-self-validation-loops](/concepts/agent-self-validation-loops) 与 [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution)）；在现有 spec/ADR/PR 中保留决策理由与未决分歧；将可判定的重复规范下沉为静态检查或测试（晋升边界见 [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules)），保留作者、审查者与发布者的明确责任。
2. **以双向追溯、测试有效性与影响半径决定审查深度**（[Code Review After Code Gets Cheap](https://www.oreilly.com/radar/code-review-after-code-gets-cheap/)）：需求与实际 diff 双向追溯到共享组件及调用方；核查边界断言以防代码与测试共享同一误解；按影响半径、可逆性与当前修订的 CI 断言证据分配直接代码检查精力。
3. **分层防线、风险分级审批与审查收敛**（[claude-dev-solving-code-review-at-anthropic-2026-10-15](https://github.com/on195594/wiki/blob/3e4e451e6fce73edab27c6eb3cf737bcb810d162/raw/articles/claude-dev-solving-code-review-at-anthropic-2026-10-15.md)）：组合前置自验证、独立 subagent 审查（[subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)）、多 Agent 投票降噪与按变更风险分级的人类审批（Agent 审查永不计入人类审批名额、发起者担责、审批绑定单一 commit）；通过三轮上限、仅重审新增 diff 与按类报错强制审查收敛（补充 [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow) 与 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation)），并以回滚率与事故率不上升作为硬护栏。

## Principle 5: use AI to reduce the cost of formalization
AI 最有价值的地方不是取代结构，而是更快地生成结构。

实践含义：
- 用 AI 草拟 spec、总结要点、生成测试框架、补充分类与交叉链接
- 但最后仍由人或规则层负责验收与裁决

### 参数化类型契约与确定性验证裁决矩阵（`C_spec / D_fsm / A_add / P_prop`）

**[推论]** 为将形式化思想切实落地为可审计的 Agent 软件工程契约，结合语法约束有限状态机（[Willard & Louf 2023](https://arxiv.org/abs/2307.09702)）、关系代数的形式化查询语义（[Codd 1970/1972](https://www.inf.unibz.it/~franconi/teaching/2006/kbdb/Codd72a.pdf)）与 QuickCheck 属性测试（[Claessen & Hughes 2000](https://www.cs.tufts.edu/~nr/cs257/archive/john-hughes/quick.pdf)），可定义四个参数化工程核验维度：

| 契约参数 | 定义与形式化机制 | 适用分工与防御边界 | 越界信号与降级规则 |
| :--- | :--- | :--- | :--- |
| **`C_spec`** | **规格完备性与双向追溯契约**：变更需求与代码实现、测试用例之间的双向映射覆盖度（Bidirectional Traceability）。 | 在变更前显式定义输入约束、输出对象、禁止边界与验收条件；重要变更必须在现有 spec / doc 中留档，避免“先写代码、再补规格、审查走过场”的 review theater。 | 当存在未绑定义图的隐式实现扩展时，阻断合并并要求补充业务理由或将其剔除。 |
| **`D_fsm`** | **状态机约束解码比率**：结构化输出中由 FSM / CFG Logits 掩码直接保证语法的接口覆盖率（Correct by Construction）。 | 对所有进入自动化管线的中间对象（工具参数、分类标签、路由指令）采用语法约束解码，在推理层杜绝格式畸变与 JSON 语法错误。 | 约束解码仅解决形式合法性；若出现语义跑偏或越权调用，必须由外层 Tool Gate 业务规则拦截，禁止将格式合法误认为执行授权。 |
| **`A_add`** | **度量代数可加性分级**：区分完全可加（Additive）、半可加（Semi-additive）与非可加（Non-additive）计算逻辑。 | 所有加总、过滤、均值与指标比率计算严格下沉至确定性执行器（Python / SQL）；禁止模型对明细比率直接平均；仅当分子与分母在目标粒度上均可加、分区互不重叠且口径一致时，才按 $\sum \text{num} / \text{nullif}(\sum \text{den}, 0)$ 计算；否则先按指标定义重算组成量。 | 当数据源缺少必要明细列时，显式留白并披露原因，严禁模型擅自插值填零或捏造未测量数据。 |
| **`P_prop`** | **属性测试不变量覆盖度**：核心算法与状态转换逻辑通过生成式属性测试（Property-based Testing）检验的比例。 | 为复杂数据处理逻辑配备不变量（对称性、幂等性、守恒性），利用随机输入与收缩算法（Shrinking）探查最小边界反例。 | 仅通过固定单测示例但属性测试失败的代码，视为尚未收敛，要求基于最小反例重构。 |

## Principle 6: context should be compressed, not endlessly widened
长上下文会污染后续输出。
AI Agent 的更优路径不是无限追加聊天，而是持续压缩。

实践含义：
- 复杂对话结论写回 wiki
- 重复流程沉淀为 skills
- 需要跨回合跟踪且步骤确有依赖的任务才写入 todo；其余保留在当前对话
- 历史事项用 session_search 回忆，而不是把整段旧上下文塞回来

## Principle 7: skills should be executable workflows, not explanatory prose
Addy Osmani 的 `Agent Skills` 文章 [addyosmani-agent-skills-2026-05-03](https://github.com/on195594/wiki/blob/3e4e451e6fce73edab27c6eb3cf737bcb810d162/raw/articles/addyosmani-agent-skills-2026-05-03.md) 对 AI Agent 的补充是：面向 AI coding agent 的长期规则不能只写成“最佳实践说明书”。如果规则希望约束 agent 行为，它必须变成可触发、可执行、可验证、有退出条件的 workflow。

实践含义：
- `skills` 主路径应优先写触发条件、步骤、检查点、证据和退出条件，而不是堆叠背景理念。
- 说明性原则可以进入 wiki/concept；重复执行流程才适合进入 skill。
- 原文的 `/spec`、`/plan`、`/build`、`/test`、`/review`、`/ship`、`/code-simplify` 是 Osmani 项目的 SDLC 命令设计，只能作为生命周期类比，不应直接沉淀为 AI Agent 命令方案。
- GitHub stars、安装命令、具体 skill 数量属于来源背景，不是 AI Agent 质量标准。

### Anti-rationalization tables as agent shortcut interceptors
`Anti-rationalization tables` 的价值不是口号，而是 agent 行为拦截器：先列出 agent 或疲劳工程师可能用来跳过流程的借口，再写出预设反驳和停止条件。

AI Agent skill 自查时应单独问：
- 这个 skill 是否写明了常见偷懒路径？
- 当 agent 说“太简单不用 spec / 测试之后补 / 手动验证够了 / 顺手重构一下”时，skill 是否有明确阻断规则？
- 这些阻断规则是否连接到可验证证据，而不是只停留在价值判断？

### Review a Skill by its contract

检查目标 Skill 是否有触发/跳过条件、验证步骤、完成证据与必要的失败边界。旧版列出的私有 Skill 抽查不具备公开可复验依据，不作为任何客户端当前实现的证明。无需为了表格形式改写已有有效规则。

### Promotion boundary
本原则只在以下情况才考虑升级为 active skill/reference 修改依据：
- 复盘发现某个 skill 因缺少检查点、退出条件或反合理化规则，导致 agent 实际走了捷径；
- 新建或重构 skill 时，需要质量自查清单；
- 独立审查指出某个 skill 已退化为说明性散文，缺少可执行证据链。

未满足这些条件时，本页只作为 wiki 概念与评审标准，不自动触发 memory、skill、cron、MCP、runtime、wrapper 或 AI Agent core 变更。

## Principle 8: let the model route, let deterministic code execute
LangChain 的 [langchain-interpreter-skills-2026-05-30](https://github.com/on195594/wiki/blob/3e4e451e6fce73edab27c6eb3cf737bcb810d162/raw/articles/langchain-interpreter-skills-2026-05-30.md) 对本页的增量价值不是提出“再加一个 skill 形态”，而是说明一种可复用的职责分离：**外层由模型判断是否适用、如何传参；内层由可审查代码执行确定性流程并返回可验证结构**。

以“入口路由 → 摘要方法 → 脚本/校验器”为合成示例，LangChain 的具体形式是：`SKILL.md` 描述何时使用，TypeScript module 承载可执行 API。对 AI Agent 的可迁移原则是声明层和执行层分离，而不是照搬 TypeScript interpreter。

### Candidate status
- concept: “模型路由 + 确定性执行”适合保留在 wiki，作为 agent workflow 设计概念。
- rule candidate: 当某个 AI Agent 子流程高频、可复用、容易跑偏，且已经有 schema / fixture / validator / rollback 证据时，才考虑把该原则提炼进对应 skill/reference。
- active proposal: 当前没有。本文不授权修改 AI Agent runtime、cron、MCP、gateway、wrapper、active skill 或 core。

### Design checks before promotion
- 这个流程是否已经重复出现，而不是一次文章启发？
- 模型负责的是路由/参数选择，还是被迫在上下文里手动维护大量状态？
- 确定性代码是否有输入 schema、输出 shape、错误路径和回滚/重试边界？
- 现有 AI Agent skill/script 是否已经覆盖该实践，只需要命名或链接，而不是新增规则？
- 如果沉淀进 wiki 后长期不用，是否应标记为 stale 或归档，而不是继续充当 active 依据？

### What not to promote
- 不把 LangChain 的 TypeScript interpreter 当作 AI Agent 当前实现目标。
- 不把 `SKILL.md + module` 直接等价为 AI Agent active skill 规范。
- 不因本文直接增加工具面、子代理权限、MCP、cron 或 runtime capability。
- 不把“确定性执行”理解为跳过模型判断；外层路由错误仍会让内部确定性流程失效。

## Practical rules for AI Agent
可在现有授权与项目规则内采用的原则：
- 先用自然语言获取需求，再尽快转成结构化表示
- 重要任务必须有显式验收标准
- 重要知识必须文件化，而不是只停留在聊天里
- 稳定知识先查适用 Wiki，必要时补证据，符合公开准入且获授权才回写 Wiki
- 复杂流程优先复用 skills，而不是重复临场发挥
- 对 AI 生成内容保持“默认需要验证”的态度
- 写新 skill 或重构旧 skill 时，检查它是否是可执行 workflow，而不是说明性散文
- 对高风险/高频偷懒路径，优先写反合理化规则和停止条件

## Concrete mapping inside AI Agent
把原则映射到 AI Agent 内部：
- `memory`：保存稳定事实与偏好
- `skills`：保存可复用方法
- `wiki`：保存正式知识
- `todo`：保存进行中的结构化任务
- `session_search`：提供历史回忆，不替代知识层
- `tools`：执行动作并提供外部验证能力

## Takeaway
如果用一句话概括 AI Agent 的实践原则：
不要让 AI 直接统治模糊上下文；要让 AI 帮你更快地产出、维护和验证形式化结构。

## Relations

- refines: [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization)
- depends_on: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- related: [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules), [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow), [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution), [dijkstra-ewd667-vs-ai-programming-article](/comparisons/dijkstra-ewd667-vs-ai-programming-article), [llm-summary-identification-step](/concepts/llm-summary-identification-step), [hermes-knowledge-base-operating-flow](/concepts/hermes-knowledge-base-operating-flow), [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path), [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow), [hermes-python-engineering-capability-checklist](/concepts/hermes-python-engineering-capability-checklist)

