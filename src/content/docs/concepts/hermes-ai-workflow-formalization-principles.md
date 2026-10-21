---
title: AI Agent Workflow Formalization Principles
created: 2026-04-16
updated: 2026-10-20
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
aliases:
  - agent-ai-workflow-formalization-principles
status: stable
description: 把形式化思想转译为 AI Agent 工作流中的规格、边界、验证和可回滚原则。
volatility: medium
review_by: 2027-01-24
---

# AI Agent Workflow Formalization Principles

## Summary

适用范围：本文的 Skill、plan、todo 与历史检索名称仅表示职责或实现示例；按目标宿主和项目现有能力映射，不假定预装同名工具。所有建议服从当前授权与项目规则。
基于 EWD667 与 2026 AI 编程文章的双来源对照，AI Agent 的工作流应明确采用“自然语言输入 + 形式化约束 + 验证闭环”的路线。
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
[towardsdatascience-vibe-coding-spec-driven-development-2026-05-12](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/towardsdatascience-vibe-coding-spec-driven-development-2026-05-12.md) 对 AI Agent 的补充是：当工作跨多轮会话、多 agent 或多人协作时，聊天历史不能承担 source of truth。真正稳定的控制面应该是项目内 docs/spec 文件、计划、验收标准和验证记录。

实践含义：
- durable agent/project work should use docs/spec files as the source of truth, not chat history
- 需求或实现过程中发现约束变化时，先更新 spec，再调整实现和测试
- 临时聊天指令不能成为唯一决策记录
- 具体 spec 目录复用目标项目既有约定，不依赖名为 `writing-plans` 的 Skill

## Principle 2.6: specification is an agreement, not an eight-field ritual

[kdnuggets-specification-engineering-2026-08-10](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/kdnuggets-specification-engineering-2026-08-10.md) 把 prompt 与 specification 的边界说得更直接：prompt 解决“如何提问”，specification 解决“参与者如何共同判断做对了”。可复用的最小检查面是目标、必要上下文与输入、输出契约、约束、验收标准、边缘情况和验证方式；但这些是风险检查面，不是每个任务必须填写的固定模板。

AI Agent 映射：
- 需求、边界或验收不清，或任务跨模块、跨会话、跨 agent、涉及 active/high-risk surface 时，先按项目现有方法澄清规格与验收；
- 规格草案应让 AI 指出缺失条件，但生成者的自检不能替代独立测试、结构化校验或人工判断；
- 只针对失败的验收项定向修正，并记录最终假设、已知局限和 contract 变化；
- 明确、局部、可回滚且有便宜确定性验证的小修可直接实现并验证，不为形式完整度增加仪式。

[towardsdatascience-right-problem-agentic-ai-2026-09-03](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/towardsdatascience-right-problem-agentic-ai-2026-09-03.md) 增加了一个用于分配前置投入的维度：**验证投入应随决策的反悔成本增加**。优先验证可能推翻数据契约、系统边界、集成方案或权限边界的假设；文案等便宜、局部、可逆的细节保留弹性。验证手段可以是已有证据、用户确认、真实样本或最小 Spike，结论回写原有 spec / ADR，而不是为文章提出的六个领域分别建立必填文档。

这是一条风险比例原则，不是“消除全部不确定性”的硬门禁，也不意味着默认增加多 Agent 审查。文章主要提供工程师经验案例与假设性推演，没有受控数据证明工时不增加或返工必然下降；其中“理想情况下不会花更多时间”不能转写成 AI Agent 的效果承诺或阈值。

证据边界：原文是二手工程综述；ROPE、SWE-bench/SWT-Bench 和 DORA 数字在成为强制门禁或本地阈值前，需要回到原论文或官方报告核验。

### 规划是过程，不必总有计划文档

[Plan mode is dead](https://www.aymannadeem.com/artificial/intelligence,/developer/tools/2026/09/24/plan-mode-is-dead.html)（Ayman Nadeem，2026-09-24；2026-09-26 直接提取到完整可读正文，图片仅有替代文本）复盘其 AI 编程工具 Nuanced：早期用户不愿阅读长篇 AI 生成规格，Spec Tour 又增加一层文本；强制“澄清 → 生成规格 → 审批 → 实现”的单向流程，令实现中发现的新问题难以自然回到讨论。作者因此主张在“理解 → 行动 → 检查 → 澄清 → 调整”的循环里持续规划，而非默认生成静态计划。文章同时指出，多 Agent 并行时如何保持人的系统理解仍未解决。

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

### 自动验证不替代共享理解：审查应保留决策、讨论与责任

Ankit Jain 在 The New Stack 的 [thenewstack-kill-code-review-theater-2026-09-30](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/thenewstack-kill-code-review-theater-2026-09-30.md)（2026-09-30）反思其此前用多层 AI 验证替代逐行审查的设想：检查“实现是否正确、是否符合意图”仍遗漏“是否在解决正确问题”，也可能删除审查原本承担的知识传递。其所谓 review theater 是“Agent 编写 → AI 评论 → Agent 修改 → 人类略看后合并”，而没有人真正理解和裁决关键决策。

作者提出 Argue（前置方案争论）、Capture（捕获意图与验收）、Codify（重复规范转成检查）、Debate（人类讨论决策）、Own（明确所有权）五层方案。此处保留它的职责区分，不把五层设为每项任务的必经流程。

可迁移判断（以下为 Wiki 综合与工程推论，不是效果验证或现行客户端行为证明）：

1. **分开验实现与判目标。** 测试、类型和契约只能覆盖其编码的条件；通过检查不等于需求合理、业务取舍正确或团队已经理解系统。与 [agent-self-validation-loops](/concepts/agent-self-validation-loops) 的能力边界一致；尚未解决的目标与取舍应回到有责任的参与者，而非用模型一致意见替代裁决。
2. **保留决策理由，不堆积对话。** 跨会话交接、多人协作或难以反悔的决策，在现有 spec、ADR 或 PR 中保留为什么选择、为什么拒绝备选、未决分歧，以及新约束如何改变原决定；实现中发现变化时更新原契约。明确且局部可逆的小修无需为留痕新增文档，静态 spec 的缺陷也不构成取消必要规格或授权的理由。
3. **将反馈分流到合适的检查面。** 方案取舍与例外需要判断；可判定的重复规范优先复用类型、测试、契约或静态检查，而不是只追加提示词。原文“金额用专用类型而非浮点数”等是团队规则示例，不是跨项目通用禁令；规则仍需明确适用边界和反例，晋升依据参见 [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules)。
4. **自动检查通过不构成免责。** 明确谁维护检查规则、谁裁决未覆盖风险、谁按项目规则批准发布。作者、审查者和发布者的责任不会因为“AI 审过”或“CI 通过”自动消失；高风险代码仍按安全、权限与生产数据边界决定人工检查范围，而非一律把 diff 留给机器。

证据与采用边界：
- 文章引用的 Microsoft 研究中“14% 的评论涉及缺陷”是评论分布，不是找 Bug 只贡献 14% 价值的证明；Google、Faros AI 和 DORA 均为文章转述，本页未独立核验原报告的方法、比较基线或因果关系，不把事故增幅写成 AI 的因果效果或本地阈值。
- 作者是 Aviator 联合创始人兼 CEO，页面明确标注 Aviator 赞助，并披露 TNS 所有者投资 CrewAI；五层方案与产品工具推荐不能当作独立效果证据。文章没有给出替代流程的受控评估；“最近 1000 条评论、前 20 类问题”是建议，不是准入标准。
- [推论] 多模型可能共享盲点，前置辩论也可能变成新的作秀；记录的价值在于保留理由并促进真实理解，不在于生成更多文档、模型共识或审查标签。执行前假设挑战可参考 [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution)，不能替代真实来源、测试和人工判断。
- 本节只补充可检索知识，不新增默认多 Agent 辩论、审查门禁、Skill、运行配置或自动化；是否采用具体机制仍由目标项目的需求、风险、证据和授权决定。

### 以双向追溯、测试有效性与影响半径决定审查深度

Markus Eisele 在 O’Reilly Radar 的 [Code Review After Code Gets Cheap](https://www.oreilly.com/radar/code-review-after-code-gets-cheap/)（发布于 2026-10-16；2026-10-17 从原站提取并核对可读正文，未核验流程图图像）补充了审查的操作层：**先约定行为与预期影响范围，再用证据识别偏移，把直接代码检查投入后果严重或证据不足的路径。** 以下为作者方法的归纳，不是已验证的效率承诺。

1. **追溯要双向，审查从实际变更出发。** 需求应能对应实现与验证；每项新增行为也应能解释为何属于本次变更。从实际 diff 追到共享组件及其调用方，包括未被编辑的代码，不能让 Agent 的改动摘要决定审查范围。额外行为不一定错误，但在后果和检查方式得到认可前，仍是未决决策。
2. **代码与测试可能共享同一种误解。** CI 全绿只能证明所运行的检查通过，不能证明预期结果符合需求。审查边界断言及其观察点，必要时在受控测试中临时移除关键检查，确认测试确实变红；同时对照约定基准审查验收测试和验收标准自身的变更。规则确需改变时记录业务决定，而不是无解释地让规格与测试迁就代码。换一个模型也可能重复同样的误读，模型意见不能替代可检查的断言与人的裁决；这补充了 [agent-self-validation-loops](/concepts/agent-self-validation-loops) 的验证边界。
3. **影响半径、可逆性与证据强度共同决定检查深度。** 小 diff 不等于低风险。资金路径等后果严重的变更需要直接检查；影响范围不明时先查清再批准。只有影响已知、检查可靠的常规变更才可减少逐行还原，并通过抽检校准这种信任。拆分 PR 有助于区分决策，但不自动隔离共享实现的影响。
4. **证据绑定正在批准的修订。** 将关键主张连接到具体测试断言及该修订的 CI 结果，而不是一句“测试通过”；实现再次变化后刷新证据。提交者对审查记录的准确性负责，审查者对接受决定负责，缺乏证据的重要主张继续保持未决。

**虚构退款示例。** 原文规定超过 100 欧元须经授权员工批准，恰好 100 欧元无需这项额外批准，原有申请权限规则仍然有效。测试应区分 100 与 100.01 欧元，并观察批准前是否真的阻止了付款请求，不能只检查审批单是否创建。若 Agent 顺带在共享支付客户端加入超时重试，渠道可能已经完成退款、只是响应丢失；重复请求能否安全处理取决于渠道机制及代码用法。审查应要求覆盖该不确定场景的证据，或移除重试；回滚部署无法追回已经重复退付的资金。

**可选 PR 提示（Wiki 综合，非固定模板）：** 约定行为是什么？当前修订有什么证据？额外行为影响哪些调用方？还有什么未决风险？复用现有 PR、spec 或测试记录即可，不要求为局部可逆的小修新增文档。

证据与采用边界：
- 退款案例及 100 欧元阈值均为作者的虚构教学示例，不是生产事故、通用风控阈值或安全性证明。文章是工程方法建议，没有受控数据证明吞吐量或缺陷率改善。
- 原文引用 NASA 双向追溯指南、Google 审查指南与一项 2026 年 LLM 需求一致性判断研究；此处未独立核验这些引用。原文所述研究使用编程基准，不能外推为所有生产仓库的审查表现。
- 减少常规逐行检查以明确影响范围和可信检查为前提，不是默认免审；受控灰度或 A/B 发布也不能代替真实付款前的充分验证。
- 本节只沉淀可检索的审查判断，不新增默认多 Agent 审查、必填 PR 模板、Skill、权限、发布门禁或运行时改动。

### 分层防线、风险分级审批与审查收敛：以回滚率约束人类注意力

Addy Osmani、Morgan Westlee Lunt 与 Qing Wang 在 Anthropic 工程博客 [claude-dev-solving-code-review-at-anthropic-2026-10-15](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/claude-dev-solving-code-review-at-anthropic-2026-10-15.md)（发布于 2026-10-15；2026-10-18 提取完整可读正文，未独立核验图表像素）给出了 Claude Code 团队在约 90% 代码由 Agent 生成时的审查架构：不再用“人类是否逐行读完代码”充当单一门禁，而是用七层防线（前置自验证、PR 多 Agent 审查、阻断式安全审查、阻断式 CI、按风险分级的人类审批、合并队列与特性开关灰度、快速检测与回滚）替代单点把关，并以**回滚率（revert rate）与事故率不上升**作为减少人类审查时间的硬护栏。以下为可迁移机制归纳，不是默认免审或自动合并授权：

1. **前置自验证与规则源头治理。** 大部分常规错误在打开 PR 前消化：作者侧 Agent 必须运行测试、构建、Lint 或 UI 截图比对并展示实际输出，再由独立新鲜上下文的 subagent 审阅 diff（参见 [agent-self-validation-loops](/concepts/agent-self-validation-loops) 与 [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)）。审查器反复指出的问题不在评论区重复人工纠正，而是下沉为 Lint、Skill、简短的 `CLAUDE.md`（审查器同时检查变更是否令既有约定过期）或代码所有者编写的 `REVIEW.md`（定义该模块的失败形态、限制 Nit 数量、列出跳过路径、要求具体文件与行号证据而非凭名称猜测，并在无问题时直接给出计数与结论）。
2. **多 Agent 投票降噪与显式结案。** PR 级自动审查按仓库配置深度（`Quick` / `Standard` / `Deep`），由多个并行寻错 Agent 与独立验证投票 Agent 组合运行，仅发出达成共识的发现并丢弃纯风格或清理类意见；评论按严重度排序并标记 `Important`、`Nit` 或 `Pre-existing`（避免将历史遗留问题归咎于当前变更）。缺陷审查或独立安全审查只要存在未结案发现即阻断合并，作者必须修复或写明理由关闭线程（后续提交修复后可自动消解）。
3. **按变更风险而非作者身份设定审批层级，保留四条责任硬边界。** 分类器根据变更内容与敏感路径划分低风险（文档、文案、内部功能、特性开关后的纯增量）、中风险（常规产品变更及缓存、自动更新器、系统提示词等敏感区域）与高风险（最高风险代码及少数明确要求两人审批的路径），第二个分类器复核低风险变更是否仍需人工介入。原文另规定所有者标为敏感的路径及 CI 工作流文件至少需要一人审核，不能据此将这些路径全部归为两人审批。分级放权受四条硬约束限制：
   - 轻审批路径仅对仓库受信任作者列表开放，其余作者一律需额外人工批准；
   - Agent 的审查通过永远不计入人类审批名额；
   - 发起并指导 Agent 编写 PR 的人类计入必需审查者与责任人（“Whoever prompted the change is on the hook for it”）；
   - 审批绑定单一具体 commit，若合入未经系统担保的新提交（如 Agent 再次推送或手工解冲突），原审批失效并须重审。
4. **强制审查收敛，用事故集与处置反馈迭代审查器。** 当作者与审查者均为 Agent 时，低价值指摘会引发“修改 → 新提交 → 再审查”的无限循环（原文记录某内部 PR 曾通宵运行逾 50 轮，且 `git blame` 显示约 59% 的反复指摘在首轮时就已存在）。收敛规则包括：**三轮上限**（超过 3 轮即要求退回重审整体方案）、**最初几轮之后仅重审新增 diff**、**按缺陷类别报错以一次修复全部同类实例**、**禁止重复张贴已发意见**（补充 [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow)），并由夜间 Agent 异步扫描存量代码以分流老缺陷。同时把历史事故与回滚 PR 经专家确认缺陷位置后建成日常回归评测集（参见 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation)），结合人类对评论的处置分布（修复、误报、有意行为、忽略）及已知干净 PR 上的有害误报率持续校准审查器。
5. **人类聚焦五类高阶裁决，用按需解释与快速回滚替代逐行通读。** 人类注意力保留给机器不擅长的五项决定：**是否应该构建**（方向、品味与范围，尽早在公开频道纠偏而非等 PR 写完再阻断）、**高风险代码**、**确立范式的架构**、**核对验证证据**（若说不出自动检查会漏掉什么，就不应走过场式快速批准）与**对结果负责（You land it, you own it）**。合并队列（基于最新 `main` 重跑检查）、特性开关、内部员工先行使用、分阶段发布通道与无需重部署的秒级关停共同兜底漏网缺陷；团队代码库理解则通过公开频道协作与针对待改模块的按需代码解释/可视化教学工件补足，而非依赖通读琐碎 diff。

证据与采用边界：
- 原文中的吞吐与质量指标（如 Anthropic monorepo 日均变更从 2026 年 5 月约 2,500 增至 9 月逾 30,000；Claude Code 仓库 6–9 月合并 PR 翻倍而回滚占比下降逾 40%；实质性评论占比从 16% 升至 54%；收敛改造后一轮通过率从 65% 升至 78%、五轮以上从 8.9% 降至 1.5%、平均轮次从 2.08 降至 1.32）均为 Anthropic 内部工程复盘数据，无公开原始数据集或跨组织受控对照，不作为 AI Agent 的通用基线或固定阈值。
- 2026-10-19 对照[原文正文](https://claude.dev/blog/solving-code-review-at-anthropic/)局部复核了审批路径与重审条件：raw 摘要表将 CI 路径并入高风险示例的表述过强，适用边界以上述原文区分为准。raw 保留采集时内容；收敛比例与平均轮次数值沿用 2026-10-18 采集记录，本次未重新核验图表。
- 原文明确指出团队尚未实现当回滚率或事故率波动时自动收紧审批层级的熔断器（circuit breakers）；在缺少阻断式 CI/安全检查、合并队列、特性开关、内部灰度与快速回滚能力前，不得照搬“低风险变更零人工审批合并”。
- `CLAUDE.md`、`REVIEW.md`、`Code Review for Claude Code`、`/code-review` 与 `/security-review` 是来源中的产品与仓库约定；本节仅补充可检索的审查分层与收敛原则，不新增默认自动合并、强制文件模板、active Skill、权限放宽或运行时改动。

## Principle 5: use AI to reduce the cost of formalization
AI 最有价值的地方不是取代结构，而是更快地生成结构。

实践含义：
- 用 AI 草拟 spec、总结要点、生成测试框架、补充分类与交叉链接
- 但最后仍由人或规则层负责验收与裁决

## Principle 6: context should be compressed, not endlessly widened
长上下文会污染后续输出。
AI Agent 的更优路径不是无限追加聊天，而是持续压缩。

实践含义：
- 复杂对话结论写回 wiki
- 重复流程沉淀为 skills
- 需要跨回合跟踪且步骤确有依赖的任务才写入 todo；其余保留在当前对话
- 历史事项用 session_search 回忆，而不是把整段旧上下文塞回来

## Principle 7: skills should be executable workflows, not explanatory prose
Addy Osmani 的 `Agent Skills` 文章对 AI Agent 的补充是：面向 AI coding agent 的长期规则不能只写成“最佳实践说明书”。如果规则希望约束 agent 行为，它必须变成可触发、可执行、可验证、有退出条件的 workflow。

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
LangChain 的 [langchain-interpreter-skills-2026-05-30](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/langchain-interpreter-skills-2026-05-30.md) 对本页的增量价值不是提出“再加一个 skill 形态”，而是说明一种可复用的职责分离：**外层由模型判断是否适用、如何传参；内层由可审查代码执行确定性流程并返回可验证结构**。

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

- related: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules), [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow), [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution), [aymannadeem-plan-mode-is-dead-2026-09-24](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/aymannadeem-plan-mode-is-dead-2026-09-24.md), [claude-dev-solving-code-review-at-anthropic-2026-10-15](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/claude-dev-solving-code-review-at-anthropic-2026-10-15.md), [dijkstra-ewd667-vs-ai-programming-article](/comparisons/dijkstra-ewd667-vs-ai-programming-article), [towardsdatascience-vibe-coding-spec-driven-development-2026-05-12](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/towardsdatascience-vibe-coding-spec-driven-development-2026-05-12.md), [llm-summary-identification-step](/concepts/llm-summary-identification-step), [hermes-knowledge-base-operating-flow](/concepts/hermes-knowledge-base-operating-flow), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path), [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary), [langchain-interpreter-skills-2026-05-30](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/langchain-interpreter-skills-2026-05-30.md), [kdnuggets-specification-engineering-2026-08-10](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/kdnuggets-specification-engineering-2026-08-10.md), [towardsdatascience-right-problem-agentic-ai-2026-09-03](https://github.com/on195594/wiki/blob/2fcad2f16266c7d4f9d65adbcc49b13414a154be/raw/articles/towardsdatascience-right-problem-agentic-ai-2026-09-03.md), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow), [hermes-python-engineering-capability-checklist](/concepts/hermes-python-engineering-capability-checklist)

