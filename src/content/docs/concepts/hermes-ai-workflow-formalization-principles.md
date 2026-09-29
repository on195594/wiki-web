---
title: Hermes AI Workflow Formalization Principles
created: 2026-04-16
updated: 2026-09-27
type: concept
tags:
  - hermes
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
  - https://github.blog/ai-and-ml/github-copilot/when-chat-is-the-wrong-ui/
  - raw/articles/aymannadeem-plan-mode-is-dead-2026-09-24.md
status: stable
description: 把形式化思想转译为 Hermes AI 工作流中的规格、边界、验证和可回滚原则。
---

# Hermes AI Workflow Formalization Principles

## Summary
基于 EWD667 与 2026 AI 编程文章的双来源对照，Hermes 的工作流应明确采用“自然语言输入 + 形式化约束 + 验证闭环”的路线。
Hermes 不应把对话本身当作最终控制面，而应不断把模糊意图压缩为 spec、检查清单、测试、结构化知识和可执行约束。

## Principle 1: language is for intent, not for final control
自然语言适合表达目标、背景、偏好和方向。
但在 Hermes 工作流里，真正决定质量的不是“说了什么”，而是最后有没有被收敛成可验证结构。

实践含义：
- 用户消息是起点，不是终点
- 只有当任务需要跨会话交接、共享决策或可复核的验收边界时，才把必要结论留在其现有 owner（如项目 spec / todo）；任务长短本身不要求新建 wiki、skill 或配置

### 交互面也应按任务收窄

GitHub Blog 的 [When chat is the wrong UI](https://github.blog/ai-and-ml/github-copilot/when-chat-is-the-wrong-ui/)（Burke Holland，2026-09-24）从界面角度补充了这条原则：聊天适合提出意图和探索未知任务；任务及操作明确、又需要反复执行时，继续让模型代点按钮或代跑固定命令未必合算。文中用 Copilot app 的 Canvas 演示包管理、SQLite 查询和写作界面。可迁移的判断是**优先复用已有确定性工具或窄界面；确有反复交互缺口时，才考虑生成新界面**，而不是把 Canvas 产品形态当作通用要求。

证据边界：这是一篇产品实践与观点文章，没有成本或效率的对照测量；只有无需再次调用 Agent 的常规 UI 操作才可能不消耗模型 Token，生成、维护工具及再次调用 Agent 仍有成本。文中展示的 AI 对工作流截图的赞语不能证明 GitHub Issue、确定性协调器或人工门禁已经作为完整架构得到验证。此处仅沉淀界面选择的判断，不引入新默认工作流、权限或自动化。

## Principle 2: prefer narrow interfaces
接口越宽，歧义越多，返工越多。
在 Hermes 里，窄接口意味着：
- 明确的任务边界
- 简短而稳定的工具调用输入
- 可复查的文件化产物
- 明确的验收标准

实践含义：
- 需要跨会话维护的决策和契约落到现有文件；局部、可回滚的短任务可在对话中澄清并验证，不为留痕而造文档
- 能拆成小页面、小技能、小检查项就不要做成大杂烩

## Principle 2.5: durable projects need a spec source of truth
`[[towardsdatascience-vibe-coding-spec-driven-development-2026-05-12]]` 对 Hermes 的补充是：当工作跨多轮会话、多 agent 或多人协作时，聊天历史不能承担 source of truth。真正稳定的控制面应该是项目内 docs/spec 文件、计划、验收标准和验证记录。

实践含义：
- durable agent/project work should use docs/spec files as the source of truth, not chat history
- 需求或实现过程中发现约束变化时，先更新 spec，再调整实现和测试
- 临时聊天指令不能成为唯一决策记录
- 具体 spec 目录形态参考 `writing-plans` skill 的 “Spec-driven development for agentic projects”，不要在 wiki concept 里重复维护文件清单

## Principle 2.6: specification is an agreement, not an eight-field ritual

`[[kdnuggets-specification-engineering-2026-08-10]]` 把 prompt 与 specification 的边界说得更直接：prompt 解决“如何提问”，specification 解决“参与者如何共同判断做对了”。可复用的最小检查面是目标、必要上下文与输入、输出契约、约束、验收标准、边缘情况和验证方式；但这些是风险检查面，不是每个任务必须填写的固定模板。

Hermes 映射：
- 需求、边界或验收不清，或任务跨模块、跨会话、跨 agent、涉及 active/high-risk surface 时，进入 `spec-driven-development`；
- 规格草案应让 AI 指出缺失条件，但生成者的自检不能替代独立测试、结构化校验或人工判断；
- 只针对失败的验收项定向修正，并记录最终假设、已知局限和 contract 变化；
- 明确、局部、可回滚且有便宜确定性验证的小修继续走 `coding-agent-workflow` 的 Direct 路径，不为形式完整度增加仪式。

`[[towardsdatascience-right-problem-agentic-ai-2026-09-03]]` 增加了一个用于分配前置投入的维度：**验证投入应随决策的反悔成本增加**。优先验证可能推翻数据契约、系统边界、集成方案或权限边界的假设；文案等便宜、局部、可逆的细节保留弹性。验证手段可以是已有证据、用户确认、真实样本或最小 Spike，结论回写原有 spec / ADR，而不是为文章提出的六个领域分别建立必填文档。

这是一条风险比例原则，不是“消除全部不确定性”的硬门禁，也不意味着默认增加多 Agent 审查。文章主要提供工程师经验案例与假设性推演，没有受控数据证明工时不增加或返工必然下降；其中“理想情况下不会花更多时间”不能转写成 Hermes 的效果承诺或阈值。

证据边界：原文是二手工程综述；ROPE、SWE-bench/SWT-Bench 和 DORA 数字在成为强制门禁或本地阈值前，需要回到原论文或官方报告核验。

### 规划是过程，不必总有计划文档

[Plan mode is dead](https://www.aymannadeem.com/artificial/intelligence,/developer/tools/2026/09/24/plan-mode-is-dead.html)（Ayman Nadeem，2026-09-24；2026-09-26 直接提取到完整可读正文，图片仅有替代文本）复盘其 AI 编程工具 Nuanced：早期用户不愿阅读长篇 AI 生成规格，Spec Tour 又增加一层文本；强制“澄清 → 生成规格 → 审批 → 实现”的单向流程，令实现中发现的新问题难以自然回到讨论。作者因此主张在“理解 → 行动 → 检查 → 澄清 → 调整”的循环里持续规划，而非默认生成静态计划。文章同时指出，多 Agent 并行时如何保持人的系统理解仍未解决。

Hermes 应用建议（推论，非原文结论或现行 Skill 行为证明）：在对话中持续规划，仅当用户要求留档或存在真实跨会话交接需求时保存计划；清楚、局部且可验证的修复不必为写计划而暂停执行。跨 Agent 契约、难以反悔的架构决定、生产数据、安全或权限边界仍需按各自现行规则保留必要的 spec、验收、独立验证和授权。这里反对的是**无必要的长篇产物与强制模式切换**，不是取消思考或风险门禁。

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
所以 Hermes 必须强调验证。

实践含义：
- 写完文件后要读回验证
- 改完配置后要跑 check 或 smoke test
- 建完知识页后要更新 index 和 log
- 长流程要有显式 completion criteria

## Principle 5: use AI to reduce the cost of formalization
AI 最有价值的地方不是取代结构，而是更快地生成结构。

实践含义：
- 用 AI 草拟 spec、总结要点、生成测试框架、补充分类与交叉链接
- 但最后仍由人或规则层负责验收与裁决

## Principle 6: context should be compressed, not endlessly widened
长上下文会污染后续输出。
Hermes 的更优路径不是无限追加聊天，而是持续压缩。

实践含义：
- 复杂对话结论写回 wiki
- 重复流程沉淀为 skills
- 需要跨回合跟踪且步骤确有依赖的任务才写入 todo；其余保留在当前对话
- 历史事项用 session_search 回忆，而不是把整段旧上下文塞回来

## Principle 7: skills should be executable workflows, not explanatory prose
Addy Osmani 的 `Agent Skills` 文章对 Hermes 的补充是：面向 AI coding agent 的长期规则不能只写成“最佳实践说明书”。如果规则希望约束 agent 行为，它必须变成可触发、可执行、可验证、有退出条件的 workflow。

实践含义：
- `skills` 主路径应优先写触发条件、步骤、检查点、证据和退出条件，而不是堆叠背景理念。
- 说明性原则可以进入 wiki/concept；重复执行流程才适合进入 skill。
- 原文的 `/spec`、`/plan`、`/build`、`/test`、`/review`、`/ship`、`/code-simplify` 是 Osmani 项目的 SDLC 命令设计，只能作为生命周期类比，不应直接沉淀为 Hermes 命令方案。
- GitHub stars、安装命令、具体 skill 数量属于来源背景，不是 Hermes 质量标准。

### Anti-rationalization tables as agent shortcut interceptors
`Anti-rationalization tables` 的价值不是口号，而是 agent 行为拦截器：先列出 agent 或疲劳工程师可能用来跳过流程的借口，再写出预设反驳和停止条件。

Hermes skill 自查时应单独问：
- 这个 skill 是否写明了常见偷懒路径？
- 当 agent 说“太简单不用 spec / 测试之后补 / 手动验证够了 / 顺手重构一下”时，skill 是否有明确阻断规则？
- 这些阻断规则是否连接到可验证证据，而不是只停留在价值判断？

### Read-only check against current Hermes skills
本次只读抽查 3 个现有 skill，作为概念页有效性的最小本地验证；这不是 active skill 修改授权。

- `test-driven-development`：强匹配。已有 `When to Use / When Not to Use`、RED/GREEN/REFACTOR workflow、验证清单、completion report，并包含 `Common Rationalizations` 表，能直接拦截“测试之后补”“太简单不用测”等借口。
- `gsummary`：基本匹配。它是 thin entrypoint，已有触发条件、payload capture workflow、pending-payload verification 和 compaction regression pitfalls；但它的反合理化机制主要写在 pitfalls 中，不是显式表格。当前无需修改 active skill，除非后续复盘证明 agent 仍会把入口任务扩张成治理/开发任务。
- `gemini-summary`：基本匹配。它有明确 backend workflow、cache/source/gate/`全文路径` contract 和 failure fallback；反偷懒规则以 non-negotiable gates / pitfalls 呈现，适合 backend skill。当前无需因为外部文章直接改动。

### Promotion boundary
本原则只在以下情况才考虑升级为 active skill/reference 修改依据：
- 复盘发现某个 skill 因缺少检查点、退出条件或反合理化规则，导致 agent 实际走了捷径；
- 新建或重构 skill 时，需要质量自查清单；
- 独立审查指出某个 skill 已退化为说明性散文，缺少可执行证据链。

未满足这些条件时，本页只作为 wiki 概念与评审标准，不自动触发 memory、skill、cron、MCP、runtime、wrapper 或 Hermes core 变更。

## Principle 8: let the model route, let deterministic code execute
LangChain 的 `[[langchain-interpreter-skills-2026-05-30]]` 对本页的增量价值不是提出“再加一个 skill 形态”，而是给 Hermes 已有实践命名：**外层由模型判断是否适用、如何传参；内层由可审查代码执行确定性流程并返回可验证结构**。

这与 Hermes 当前的 `gsummary` → `gemini-summary` → wrapper/scripts/validators 模式相近，但 LangChain 的形式更明确：`SKILL.md` 描述何时使用，TypeScript module 承载可执行 API。对 Hermes 的可迁移原则是声明层和执行层分离，而不是照搬 TypeScript interpreter。

### Candidate status
- concept: “模型路由 + 确定性执行”适合保留在 wiki，作为 agent workflow 设计概念。
- rule candidate: 当某个 Hermes 子流程高频、可复用、容易跑偏，且已经有 schema / fixture / validator / rollback 证据时，才考虑把该原则提炼进对应 skill/reference。
- active proposal: 当前没有。本文不授权修改 Hermes runtime、cron、MCP、gateway、wrapper、active skill 或 core。

### Design checks before promotion
- 这个流程是否已经重复出现，而不是一次文章启发？
- 模型负责的是路由/参数选择，还是被迫在上下文里手动维护大量状态？
- 确定性代码是否有输入 schema、输出 shape、错误路径和回滚/重试边界？
- 现有 Hermes skill/script 是否已经覆盖该实践，只需要命名或链接，而不是新增规则？
- 如果沉淀进 wiki 后长期不用，是否应标记为 stale 或归档，而不是继续充当 active 依据？

### What not to promote
- 不把 LangChain 的 TypeScript interpreter 当作 Hermes 当前实现目标。
- 不把 `SKILL.md + module` 直接等价为 Hermes active skill 规范。
- 不因本文直接增加工具面、子代理权限、MCP、cron 或 runtime capability。
- 不把“确定性执行”理解为跳过模型判断；外层路由错误仍会让内部确定性流程失效。

## Practical rules for Hermes
可以直接执行的规则：
- 先用自然语言获取需求，再尽快转成结构化表示
- 重要任务必须有显式验收标准
- 重要知识必须文件化，而不是只停留在聊天里
- 默认先查 wiki，再补外部，再回写 wiki
- 复杂流程优先复用 skills，而不是重复临场发挥
- 对 AI 生成内容保持“默认需要验证”的态度
- 写新 skill 或重构旧 skill 时，检查它是否是可执行 workflow，而不是说明性散文
- 对高风险/高频偷懒路径，优先写反合理化规则和停止条件

## Concrete mapping inside Hermes
把原则映射到 Hermes 内部：
- `memory`：保存稳定事实与偏好
- `skills`：保存可复用方法
- `wiki`：保存正式知识
- `todo`：保存进行中的结构化任务
- `session_search`：提供历史回忆，不替代知识层
- `tools`：执行动作并提供外部验证能力

## Takeaway
如果用一句话概括 Hermes 的实践原则：
不要让 AI 直接统治模糊上下文；要让 AI 帮你更快地产出、维护和验证形式化结构。

## Related
- `aymannadeem-plan-mode-is-dead-2026-09-24`
- [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization)
- [dijkstra-ewd667-vs-ai-programming-article](/comparisons/dijkstra-ewd667-vs-ai-programming-article)
- `towardsdatascience-vibe-coding-spec-driven-development-2026-05-12`
- [llm-summary-identification-step](/concepts/llm-summary-identification-step)
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [hermes-knowledge-base-operating-flow](/concepts/hermes-knowledge-base-operating-flow)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary)
- `langchain-interpreter-skills-2026-05-30`
- `kdnuggets-specification-engineering-2026-08-10`
- `towardsdatascience-right-problem-agentic-ai-2026-09-03`
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`
- [hermes-python-engineering-capability-checklist](/concepts/hermes-python-engineering-capability-checklist)

