---
title: AI Code Review Governance, Traceability, and Convergence
created: 2026-11-02
updated: 2026-11-26
type: concept
tags:
  - agent
  - ai-coding
  - workflow
  - governance
  - verification
  - evaluation
sources:
  - raw/articles/thenewstack-kill-code-review-theater-2026-09-30.md
  - docs:https://www.oreilly.com/radar/code-review-after-code-gets-cheap/
  - raw/articles/claude-dev-solving-code-review-at-anthropic-2026-10-15.md
  - raw/articles/addyosmani-critical-thinking-when-agents-do-the-work-2026-11-03.md
  - concepts/hermes-ai-workflow-formalization-principles.md
  - concepts/agent-self-validation-loops.md
  - https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification/
  - https://davisjam.github.io/model-based-agentic-software-engineering/book/se-handbook/software-engineering-handbook.pdf
  - https://sback.it/publications/icse2013.pdf
  - https://sback.it/publications/icse2018seip.pdf
  - https://dora.dev/ai/gen-ai-report/dora-impact-of-generative-ai-in-software-development.pdf
  - https://dora.dev/dora-report-2025/
  - https://services.google.com/fh/files/misc/dora-roi-of-ai-assisted-software-development-2026.pdf
  - https://arxiv.org/html/2611.18939v1
  - https://arxiv.org/html/2509.14745v3
  - https://www.faros.ai/blog/ai-acceleration-whiplash-takeaways
  - docs:http://csis.pace.edu/~ogotel/research/GOTEL94%20An%20Analysis%20of%20the%20Requirements%20Traceability%20Problem.pdf
  - https://swehb.nasa.gov/plugins/viewsource/viewpagesrc.action?pageId=215777306
  - https://swehb.nasa.gov/plugins/viewsource/viewpagesrc.action?pageId=32604549
  - https://www.computer.org/csdl/magazine/co/1978/04/01646911/13rRUILLkyp
  - https://web.eecs.umich.edu/~weimerw/2022-481F/readings/mutation-testing.pdf
  - https://arxiv.org/html/2102.11378v2
  - https://arxiv.org/html/2103.07189v1
  - https://arxiv.org/html/2501.12862v1
  - https://engineering.fb.com/2026/10/29/security/catching-bugs-before-they-land-jittestings-human-on-the-loop-approach-at-full-scale/
  - https://pubsonline.informs.org/doi/10.1287/opre.9.3.383
  - https://www.informs.org/content/download/255808/2414681/file/little_paper.pdf
  - https://www.cambridge.org/core/journals/mathematical-proceedings-of-the-cambridge-philosophical-society/article/single-server-queue-in-heavy-traffic/81C55BC00A68FE6D5385638AA0B0AF37
  - https://academic.oup.com/jrsssb/article/24/2/383/7035157
status: stable
description: 定义 AI 生成代码的分层审查、Gotel/NASA 双向追溯、Google/Meta
  增量变异测试与风险分级收敛，并以微软/Google 审查原典及 Little 定律、Kingman 重负载公式约束审查容量边界。
aliases:
  - ai-code-review-governance
  - code-review-convergence
  - agentic-code-review
  - orchestration-tax
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# AI Code Review Governance, Traceability, and Convergence

## Summary

本页是 [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)（Principle 4：验证与审查边界）的子主题，专门处理当大量代码由 AI Agent 生成时，团队如何避免“形式化走过场（review theater）”与“Agent 互审死循环”：以需求与实现的双向追溯识别行为偏移，以测试断言有效性和变更影响半径决定人工审查深度，并用前置自验证、多 Agent 共识降噪、风险分级人类审批、三轮收敛上限与快速回滚构建分层防线，将**回滚率与事故率不上升**作为减少逐行通读时间的硬护栏。

## 1. 自动验证不替代共享理解：保留决策、讨论与责任

Ankit Jain 在 The New Stack 的 [thenewstack-kill-code-review-theater-2026-09-30](https://github.com/on195594/wiki/blob/f50b497161edfca34aa32dd28d5515c0b8c491cc/raw/articles/thenewstack-kill-code-review-theater-2026-09-30.md)（2026-09-30）反思其此前用多层 AI 验证替代逐行审查的设想：检查“实现是否正确、是否符合意图”仍遗漏“是否在解决正确问题”，也可能删除审查原本承担的知识传递。其所谓 review theater 是“Agent 编写 → AI 评论 → Agent 修改 → 人类略看后合并”，而没有人真正理解和裁决关键决策。

作者提出 Argue（前置方案争论）、Capture（捕获意图与验收）、Codify（重复规范转成检查）、Debate（人类讨论决策）、Own（明确所有权）五层方案。此处保留它的职责区分，不把五层设为每项任务的必经流程。

可迁移判断（以下为 Wiki 综合与工程推论，不是效果验证或现行客户端行为证明）：

1. **分开验实现与判目标。** 测试、类型和契约只能覆盖其编码的条件；通过检查不等于需求合理、业务取舍正确或团队已经理解系统。与 [agent-self-validation-loops](/concepts/agent-self-validation-loops) 的能力边界一致；尚未解决的目标与取舍应回到有责任的参与者，而非用模型一致意见替代裁决。
2. **保留决策理由，不堆积对话。** 跨会话交接、多人协作或难以反悔的决策，在现有 spec、ADR 或 PR 中保留为什么选择、为什么拒绝备选、未决分歧，以及新约束如何改变原决定；实现中发现变化时更新原契约。明确且局部可逆的小修无需为留痕新增文档，静态 spec 的缺陷也不构成取消必要规格或授权的理由。
3. **将反馈分流到合适的检查面。** 方案取舍与例外需要判断；可判定的重复规范优先复用类型、测试、契约或静态检查，而不是只追加提示词。原文“金额用专用类型而非浮点数”等是团队规则示例，不是跨项目通用禁令；规则仍需明确适用边界和反例，晋升依据参见 [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules)。
4. **自动检查通过不构成免责。** 明确谁维护检查规则、谁裁决未覆盖风险、谁按项目规则批准发布。作者、审查者和发布者的责任不会因为“AI 审过”或“CI 通过”自动消失；高风险代码仍按安全、权限与生产数据边界决定人工检查范围，而非一律把 diff 留给机器。

证据与采用边界：
- **微软与 Google 现代代码审查原典实证**：Alberto Bacchelli 与 Christian Bird（ICSE 2013，[*Expectations, Outcomes, and Challenges of Modern Code Review*](https://sback.it/publications/icse2013.pdf)）对微软 CodeFlow 的 570 条人工分类审查评论及 873 名开发者调查表明，尽管“发现缺陷”被列为首要主观动机，实际评论中 **29%（165/570）针对代码可维护性改进，仅 14%（78/570）涉及功能或逻辑缺陷**（且多为浅层局部错误），审查的核心瓶颈在于**理解变更意图与上下文**。Caitlin Sadowski 等（ICSE-SEIP 2018，[*Modern Code Review: A Case Study at Google*](https://sback.it/publications/icse2018seip.pdf)）对 Google Critique 约 900 万个变更列表（CL）的统计进一步显示，高效审查依赖极小批量与自动化分流：**中位修改仅 24 行**（逾 35% 仅触及 1 个文件）、中位审查者 1 人、中位端到端周转延迟低于 4 小时，机械风格与常见缺陷由 Tricorder 静态分析前置拦截。
- **AI 时代审查积压与交付稳定性的多源证据**：[DORA 2024 报告](https://dora.dev/ai/gen-ai-report/dora-impact-of-generative-ai-in-software-development.pdf)测得 AI 采用率每提高 25% 关联交付吞吐 `-1.5%` 与交付稳定性 `-7.2%`；[DORA 2025](https://dora.dev/dora-report-2025/) 与 [DORA ROI 2026](https://services.google.com/fh/files/misc/dora-roi-of-ai-assisted-software-development-2026.pdf) 报告了 AI 应用与吞吐的正向关系，但这不是对同一团队磨合过程的纵向测量；缺乏小批量拆分与自动化测试时，**验证税（Verification Tax）与不稳定税（Instability Tax）**仍使交付稳定性承压。PR 观察研究提供了另一种口径：Watanabe 等（ACM TOSEM 2026，[arXiv:2509.14745v3](https://arxiv.org/html/2509.14745v3)）研究 567 个 Claude Code PR。初次提交的**新增行数**中位数为 48（人工为 24），删除行数中位数分别为 7 和 8。在人工标注的已合并子样本中，85/213 个 Agent PR 有多个目标（人工为 27/221），包括功能与配套测试。475 个已合并 Agent PR 中有 214 个在合入前改过，不能据此断定是人工返工；Newman、Bird 等（微软 2026-11，[arXiv:2611.18939v1](https://arxiv.org/html/2611.18939v1)，$N=2,590$）的调查中，82% 的受访者亲自用过 AI 辅助审查；这个比例不是团队采用率。调查也未证明采用 AI 审查会缓解或造成积压。商业遥测 [Faros AI（2026-04，22,000 名开发者观测）](https://www.faros.ai/blog/ai-acceleration-whiplash-takeaways)报告的首次审查等待时间中位数 `+156.6%`、审查阶段停留时间中位数 `+441.5%` 与免审合并 `+31.3%` 属非随机观测相关性，不作为跨组织因果阈值。
- 作者是 Aviator 联合创始人兼 CEO，页面明确标注 Aviator 赞助，并披露 TNS 所有者投资 CrewAI；五层方案与产品工具推荐不能当作独立效果证据。文章没有给出替代流程的受控评估；“最近 1000 条评论、前 20 类问题”是建议，不是准入标准。
- [推论] 多模型可能共享盲点，前置辩论也可能变成新的作秀；记录的价值在于保留理由并促进真实理解，不在于生成更多文档、模型共识或审查标签。执行前假设挑战可参考 [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution)，不能替代真实来源、测试和人工判断。
- 本节只补充可检索知识，不新增默认多 Agent 辩论、审查门禁、Skill、运行配置或自动化；是否采用具体机制仍由目标项目的需求、风险、证据和授权决定。

## 2. 以双向追溯、测试有效性与影响半径决定审查深度

Markus Eisele 在 O’Reilly Radar 的 [Code Review After Code Gets Cheap](https://www.oreilly.com/radar/code-review-after-code-gets-cheap/)（发布于 2026-10-16；2026-10-17 提取并于 2026-11-02 重新在线核对可读正文，未核验流程图图像）补充了审查的操作层：**先约定行为与预期影响范围，再用证据识别偏移，把直接代码检查投入后果严重或证据不足的路径。** 以下为作者方法的归纳，不是已验证的效率承诺。

1. **追溯要双向，审查从实际变更出发。** 需求应能对应实现与验证；每项新增行为也应能解释为何属于本次变更。从实际 diff 追到共享组件及其调用方，包括未被编辑的代码，不能让 Agent 的改动摘要决定审查范围。额外行为不一定错误，但在后果和检查方式得到认可前，仍是未决决策。
2. **代码与测试可能共享同一种误解。** CI 全绿只能证明所运行的检查通过，不能证明预期结果符合需求。审查边界断言及其观察点，必要时在受控测试中临时移除关键检查，确认测试确实变红；同时对照约定基准审查验收测试和验收标准自身的变更。规则确需改变时记录业务决定，而不是无解释地让规格与测试迁就代码。换一个模型也可能重复同样的误读，模型意见不能替代可检查的断言与人的裁决；这补充了 [agent-self-validation-loops](/concepts/agent-self-validation-loops) 的验证边界。
3. **影响半径、可逆性与证据强度共同决定检查深度。** 小 diff 不等于低风险。资金路径等后果严重的变更需要直接检查；影响范围不明时先查清再批准。只有影响已知、检查可靠的常规变更才可减少逐行还原，并通过抽检校准这种信任。拆分 PR 有助于区分决策，但不自动隔离共享实现的影响。
4. **证据绑定正在批准的修订。** 将关键主张连接到具体测试断言及该修订的 CI 结果，而不是一句“测试通过”；实现再次变化后刷新证据。提交者对审查记录的准确性负责，审查者对接受决定负责，缺乏证据的重要主张继续保持未决。

**虚构退款示例。** 原文规定超过 100 欧元须经授权员工批准，恰好 100 欧元无需这项额外批准，原有申请权限规则仍然有效。测试应区分 100 与 100.01 欧元，并观察批准前是否真的阻止了付款请求，不能只检查审批单是否创建。若 Agent 顺带在共享支付客户端加入超时重试，渠道可能已经完成退款、只是响应丢失；重复请求能否安全处理取决于渠道机制及代码用法。审查应要求覆盖该不确定场景的证据，或移除重试；回滚部署无法追回已经重复退付的资金。

**可选 PR 提示（Wiki 综合，非固定模板）：** 约定行为是什么？当前修订有什么证据？额外行为影响哪些调用方？还有什么未决风险？复用现有 PR、spec 或测试记录即可，不要求为局部可逆的小修新增文档。

**验证要覆盖主张成立的层级，证据要配得上判断出错的后果。** James C. Davis 在 [*The Software Engineering Handbook: A Judgment and Decision-Making Approach*](https://davisjam.github.io/model-based-agentic-software-engineering/book/se-handbook/software-engineering-handbook.pdf)（第一版，2026-11-19 修订，第 9 章，书内第 92–93、98–99、103–104 页）指出：组件测试可以支持局部结论；若主张涉及组件交互或端到端行为，就要在相应层级取证。两项检查若依赖同一个未经证实的关键假设，即使都通过，也可能漏掉同一问题。若误判后果严重或难以挽回，优先补能识别关键失败的证据，或先限制失败的影响范围，再判断剩余风险是否可接受。这里保留的是审查时的判断依据，而非固定的证据分数或发布门禁。

证据与采用边界：
- 退款案例及 100 欧元阈值均为作者的虚构教学示例，不是生产事故、通用风控阈值或安全性证明。文章是工程方法建议，没有受控数据证明吞吐量或缺陷率改善。
- **双向可追溯性的原典定义与工程分工**：Orlena C. Z. Gotel 与 Anthony C. W. Finkelstein（ICRE 1994，[*An Analysis of the Requirements Traceability Problem*](http://csis.pace.edu/~ogotel/research/GOTEL94%20An%20Analysis%20of%20the%20Requirements%20Traceability%20Problem.pdf)）基于逾百名从业者调研区分了**需求规约前追溯（pre-RS traceability，需求源于何处、为何取舍、谁参与裁决）**与**规约后追溯（post-RS traceability，规约如何落实到设计、代码与测试）**，发现其调查中许多被归因于需求追溯不良的问题来自 pre-RS 追溯不足。[NASA 软件工程手册 SWE-052](https://swehb.nasa.gov/plugins/viewsource/viewpagesrc.action?pageId=215777306) 与 [SWE-072](https://swehb.nasa.gov/plugins/viewsource/viewpagesrc.action?pageId=32604549) 则在安全关键验证中明确双向语义：**前向追溯**（需求 → 代码/测试）检验实现与测试是否遗漏约定职责（完备性）；**反向追溯**（实际代码/测试 → 上游需求）识别未经授权的“镀金”、孤儿逻辑或隐式副作用（越界性）。O'Reilly 文中所引 2026 年 LLM 需求一致性基准研究仍受限于合成题目分布，不外推为生产仓库免审依据。
- 减少常规逐行检查以明确影响范围和可信检查为前提，不是默认免审；受控灰度或 A/B 发布也不能代替真实付款前的充分验证。
- James C. Davis《The Software Engineering Handbook》（第一版，2026-11-19 修订，第 9 章）为教学与工程判断框架，用于区分主张层级、共同假设与后果分级，不是受控实证数据或统一发布门禁。
- 本节只沉淀可检索的审查判断，不新增默认多 Agent 审查、必填 PR 模板、Skill、权限、发布门禁或运行时改动。

### 用增量与 LLM 引导变异测试验证关键断言

行覆盖率只能证明代码在测试运行期间被执行过，无法证明测试包含能够识别错误结果的断言（无断言测试同样可获得高覆盖率）。变异测试（Mutation Testing）的理论与大规模工程落地包含三层机制：

1. **理论基础与等价变异体边界**：Richard A. DeMillo、Richard J. Lipton 与 Frederick G. Sayward（1978，*IEEE Computer*，[*Hints on Test Data Selection: Help for the Practicing Programmer*](https://www.computer.org/csdl/magazine/co/1978/04/01646911/13rRUILLkyp)；出版社全文受付费墙限制，核心公理经 IEEE 摘要与 [Jia & Harman 2011 综述 PDF](https://web.eecs.umich.edu/~weimerw/2022-481F/readings/mutation-testing.pdf) 交叉核实）提出**称职程序员假设**（真实故障多为偏离正确程序的微小语法/逻辑偏移）与**耦合效应**（能杀死简单一阶变异体的测试集高概率同时捕获复杂高阶复合故障）。变异得分须排除在所有合法输入上外部行为与原程序完全一致的**等价变异体**（Jia & Harman 统计约占随机变异体的 `10%–40%`，通用等价判定不可判定）。
2. **工业级差分限定与贫瘠节点过滤（Google 实践）**：Goran Petrović 等（2021，*IEEE TSE*，[*Practical Mutation Testing at Scale*](https://arxiv.org/html/2102.11378v2)）在 Google 776,740 个变更列表（1,690 万个变异体）上证明，全量变异在大型仓库不可行；通过**仅变异当前 PR 新增/修改行（Diff-scoped）+ AST 贫瘠节点抑制（跳过日志、缓存提示等非功能语句）+ 每行最多保留 1 个代表性变异体**，可将单次评审中位变异体从 **820 个压降至 7 个**，工程师确认的有效动作占比从 `15%` 提升至 `89%`。其团队对 Google 六年间 1,502 个高优先级生产缺陷的回溯（ICSE 2021，[arXiv:2103.07189v1](https://arxiv.org/html/2103.07189v1)）证实 **70% 的真实高危故障与变异体存在故障耦合**。
3. **LLM 定向变异与即时测试推送（Meta ACH / JiTTesting）**：Christopher Foster 等（2025，[*Mutation-Guided LLM-based Test Generation at Meta*](https://arxiv.org/html/2501.12862v1)）将 LLM 定向生成合规故障变异体与经预处理的 LLM 等价变异体检测器（精确率 `0.95`、召回率 `0.96`）结合，直接向评审界面推送能杀死存活变异体的候选单元测试而非裸变异告警：系统处理了 10,795 个生产 Kotlin 类；在 Messenger 与 WhatsApp 的测试活动中，工程师接受了所评候选测试的 **73%**，且 **49%（277/571）杀死变异体的新增测试未增加任何一行行覆盖率**。[Meta 2026-10 规模化报告](https://engineering.fb.com/2026/10/29/security/catching-bugs-before-they-land-jittestings-human-on-the-loop-approach-at-full-scale/)进一步采用不入库但随每个 PR 即时运行的短生命周期测试（JiTTesting，配合确定性桩工具），取得 `60%` 真阳性率并在半年内上线前拦截了 74 起严重隐私故障（SEV 下降 `20%`）。

`[推论]` 在审查 AI 生成代码时，优先在资金结算、权限边界或反复回归的核心路径实施**差分范围定向变异抽检**。以前文虚构退款案例为例，将 `金额 > 100` 变异为 `金额 >= 100` 若仍绿灯通过，即可定位 `100` 边界用例或真实付款拦截断言缺失。只对改变约定业务行为的存活变异补强断言，变异测试仍不能替代与上游业务需求的对齐。

## 3. 分层防线、风险分级审批与审查收敛：以回滚率约束人类注意力

Addy Osmani、Morgan Westlee Lunt 与 Qing Wang 在 Anthropic 工程博客 [claude-dev-solving-code-review-at-anthropic-2026-10-15](https://github.com/on195594/wiki/blob/f50b497161edfca34aa32dd28d5515c0b8c491cc/raw/articles/claude-dev-solving-code-review-at-anthropic-2026-10-15.md)（发布于 2026-10-15；2026-10-18 提取完整可读正文，未独立核验图表像素）给出了 Claude Code 团队在约 90% 代码由 Agent 生成时的审查架构：不再用“人类是否逐行读完代码”充当单一门禁，而是用七层防线（前置自验证、PR 多 Agent 审查、阻断式安全审查、阻断式 CI、按风险分级的人类审批、合并队列与特性开关灰度、快速检测与回滚）替代单点把关，并以**回滚率（revert rate）与事故率不上升**作为减少人类审查时间的硬护栏。以下为可迁移机制归纳，不是默认免审或自动合并授权：

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

### 按变更触发验证：从观察到拦截

Addy Osmani 记录了 Claude Code 团队如何为审查配置独立规则、观察新门禁和评估漏检。[How the Claude Code team thinks about verification（2026-11-16）](https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification/)

1. **按 diff 触发检查，隔离裁判规则。** 每项可靠性检查记录「从 diff 可识别的触发条件 → 要检查的行为 → 相关事故或 PR」，由代码负责人维护。例如，会话存储或消息类型变化时，检查旧会话记录能否安全加载。审查读取基准或默认分支的 `REVIEW.md`；PR 可以提议修改规则，但本次审查不用它刚改过的版本裁判自己。
2. **新门禁先观察，再决定是否拦截。** 先记录哪些提交本会被挡，不实际阻断；回看误报后再决定是否启用强制模式。团队还记录每个提交采用何种验证方式，包括未验证的情况。**[推论]** 验证方式记录不是通过证据；验收仍应核对绑定到当前修订的实际结果。
3. **分阶段诊断漏检。** 在已有的历史事故评测中，分别衡量「初次发现 → 验证后保留 → 最终报告」的召回率，区分一开始未发现缺陷，还是后续验证或筛选丢掉了真实问题。保留稳定变更作为对照以监测误报，不用一个端到端分数掩盖差异。

**证据与采用边界：** 这是 Claude Code 团队的实践自述，不是对前述团队工程博客的独立验证。清单规模、重试与放行阈值属于该团队的实现选项，不作为通用标准；本节不启用新的 Hook、Skill 或审查门禁。

## 4. 先读证据，并让生成吞吐服从可承担责任的处理能力

Addy Osmani 的 [addyosmani-critical-thinking-when-agents-do-the-work-2026-11-03](https://github.com/on195594/wiki/blob/f50b497161edfca34aa32dd28d5515c0b8c491cc/raw/articles/addyosmani-critical-thinking-when-agents-do-the-work-2026-11-03.md)（“Verification as a habit”与“Actually paying attention to what's generated”）补充了证据消费与注意力容量两个侧面，而不是另一套审查防线：

1. **先看执行证据，再看完成摘要。** 作者建议收到 Agent 完成通知时，先读实际运行的命令及其输出，再读汇报，并追问检查证明了什么、没有证明什么。这是核对关键证据的阅读顺序建议，不要求所有任务生成固定报告，也不能用命令返回成功代替对目标行为的观察。代码与测试共享误解的问题由本页第 2 节解释，不重复扩展成新检查表。
2. **查看 Agent 替人作出的决定。** 原文建议让 Agent 列出默认值、排除范围和冲突需求取舍，而不只汇报改动成功；关键决定仍应对照实际 diff 和需求。本页第 1 节已有决策理由的维护位置，此处不新增独立文档。
3. **生成吞吐不等于可接受吞吐。** 作者以“编排税”（orchestration tax）描述 Agent 产量与人敢于署名承担责任的产量之间的落差。完成项积压超出核查能力时，继续增加会话不能解决瓶颈；应先改进检查以减少必要人工量，或放慢生成。

[推论] 将第三点用于任务组织时，可先缩小批次或降低并发，直到现有核验和责任承接能够跟上；自动检查应覆盖真实风险，而不是为了减少积压而降低证据标准。这是容量判断，不是固定并发上限，也不证明人工参与越多越好。人的理解与责任诊断见 [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation)，Agent 自行运行与反馈的机制仍由 [agent-self-validation-loops](/concepts/agent-self-validation-loops) 维护。

### 排队论形式化：Little 定律、Kingman 拥塞公式与审查容量边界

`[推论]` 上述“编排税（生成吞吐超出人类可承担责任的审查吞吐时，继续增加并发会话只会制造积压）”与“多轮互审必须收敛”的现象，可用运筹学原典中的 **Little 定律**（John D. C. Little, 1961，[*Operations Research* 9(3)](https://pubsonline.informs.org/doi/10.1287/opre.9.3.383)；五十周年严格适用条件见 [Little 2011 INFORMS 全文](https://www.informs.org/content/download/255808/2414681/file/little_paper.pdf)）与 **Kingman 重负载近似公式**（J. F. C. Kingman, 1961，[*Math. Proc. Cambridge Philos. Soc.*](https://www.cambridge.org/core/journals/mathematical-proceedings-of-the-cambridge-philosophical-society/article/single-server-queue-in-heavy-traffic/81C55BC00A68FE6D5385638AA0B0AF37)；1962，[*JRSS-B*](https://academic.oup.com/jrsssb/article/24/2/383/7035157)，两篇早期原文受出版社付费墙限制，公式前提经官方摘要核对）给出严格数学刻画：

1. **有效审查利用率与积压发散条件**：
   设并行 Agent 生成候选变更（PR / Diff）的总到达率为 $\lambda_{\text{gen}}$，前置确定性自验证（CI、类型检查、属性测试与自动共识过滤）在进入人工队列前拦截并退回的劣质比例为 $p_{\text{filter}} \in [0, 1)$，人类审查者在保持真实理解与责任标准下的有效服务率为 $\mu_{\text{rev}} = 1 / \tau_{\text{rev}}$（$\tau_{\text{rev}}$ 为平均实质审查耗时）。则人类审查网关的有效利用率 $\rho_{\text{rev}}$ 与平均排队等待时间 $W_q$ 满足：
   $$\rho_{\text{rev}} = \frac{\lambda_{\text{gen}}(1 - p_{\text{filter}})}{\mu_{\text{rev}}} < 1, \qquad W_q \approx \left(\frac{\rho_{\text{rev}}}{1 - \rho_{\text{rev}}}\right)\left(\frac{c_a^2 + c_s^2}{2}\right)\tau_{\text{rev}}$$
   且在途未决 PR 积压量由 Little 定律给出：$L_{\text{WIP}} = \lambda_{\text{eff}}(W_q + \tau_{\text{rev}})$，其中 $c_a^2, c_s^2$ 分别为到达间隔与人工审查耗时的变异系数平方（Squared Coefficient of Variation）。模型前提区分：[Little (2011)](https://www.informs.org/content/download/255808/2414681/file/little_paper.pdf) 证明样本均值版 $L = \lambda W$ 在起点与终点系统均为空、且至少有一个任务完成的有限观测窗内均为无需稳态或泊松假设的精确守恒恒等式，同时在 §4.1.1 指出队列积压带来的上下文切换与管理开销会反向侵蚀有效服务率 $\mu_{\text{rev}}$；而 Kingman 公式本为单服务台 $G/G/1$ 在 $\rho \to 1^-$ 时的重负载渐近近似——多人团队虽属 $G/G/c$ 池，但敏感模块的代码所有权（CODEOWNERS）绑定常使局部路径退化为单评审员 $G/G/1$ 瓶颈。
2. **三个直接工程推论**：
   - **高利用率下的非线性爆炸（$\frac{\rho}{1-\rho}$ 项）**：当团队因“代码生成变便宜”而盲目拉高 $\lambda_{\text{gen}}$，使 $\rho_{\text{rev}}$ 从 `0.70` 推高至 `0.95` 时，拥塞乘子 $\frac{\rho_{\text{rev}}}{1-\rho_{\text{rev}}}$ 从 `2.33` 暴涨至 `19.0`（上升逾 8 倍）。此时若强行要求消化积压，审查者只能被迫压缩 $\tau_{\text{rev}}$，即退化为走过场的 **Review Theater**；
   - **控制批次方差（$c_s^2$ 项）**：跨模块、混杂多重意图的大 PR 会急剧放大人工审查时间的不确定性 $c_s^2$；将改动拆分为小步、单一意图且附带明确验证证据的 diff，可直接压低 $c_s^2$ 与 $\tau_{\text{rev}}$；
   - **多轮互审的压缩收敛条件**：设第 $k$ 轮审查后未消解的实质性缺陷数为 $D_k$，单轮修复引入新缺陷的再生率为 $\gamma_{\text{regen}}$、消解率为 $\beta_{\text{fix}}$。仅当净收缩率 $r_{\text{conv}} = 1 - \beta_{\text{fix}} + \gamma_{\text{regen}} < 1$ 时，期望缺陷数 $E[D_k] = D_0 \cdot r_{\text{conv}}^k$ 才单调收敛；若两个 Agent 在风格或局部偏好上反复互改导致 $r_{\text{conv}} \ge 1$，系统即陷入无限振荡，因此必须设置硬性轮次上限（如 $K_{\max} = 3$）并强制仅重审增量 diff（见 [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow) 的 `V_loop / ρ_rev` 门禁）。

证据与采用边界：文章是实践反思，没有给出审查产能阈值或受控效果数据；不能将“编排税”当作已经测得的通用指标。本文确认已有的测试边界与责任原则，新增的是阅读顺序和容量视角；不据此启用默认子代理审查、答题后合并、必填 PR 模板、Skill、自动化或权限变更。

## Relations

- refines: [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles)
- depends_on: [agent-self-validation-loops](/concepts/agent-self-validation-loops), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)
- related: [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules), [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation), [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution), [ai-coding-agent-workflow-types](/concepts/ai-coding-agent-workflow-types), [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow), [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation)

