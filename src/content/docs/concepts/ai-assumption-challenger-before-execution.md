---
title: AI Assumption Challenger Before Execution
created: 2026-06-21
updated: 2026-11-27
type: concept
tags:
  - agent
  - workflow
  - ai-coding
  - content-engineering
  - orchestration
  - governance
sources:
  - raw/articles/xda-claude-creative-workflow-reframe-2026-06-20.md
  - raw/articles/wondertools-writers-toolkit-2026-08-01.md
  - concepts/agent-context-engineering.md
  - concepts/claude-code-practical-workflow-tips.md
  - concepts/hermes-context-layer-operating-rules.md
  - concepts/ai-agent-human-outcome-design-principle.md
  - docs:https://arxiv.org/abs/2310.13548
  - https://onlinelibrary.wiley.com/doi/abs/10.1002/bdm.3960020103
  - https://lmscontent.embanet.com/USC/PPD554/Week10/PPD554_W10_HBR_Klein_Performaing_a_Project_Premortem.pdf
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC12330140/
  - https://arxiv.org/abs/2311.08596
  - https://arxiv.org/html/2503.11656v1
  - https://arxiv.org/html/2505.23840v4
  - https://arxiv.org/html/2505.13995v2
  - https://arxiv.org/html/2610.28325v1
  - https://aclanthology.org/2026.emnlp-main.1860.pdf
status: stable
description: 结合事前验尸前瞻性后见之明原典、2024–2026
  多轮迎合退化与权重纠缠实证及新会话隔离架构（C_challenge），在复杂方案执行前实施去人称化假设挑战与反迎合压力测试。
aliases:
  - ai-assumption-challenger
  - pre-execution-red-team
  - claude-creative-sounding-board
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# AI Assumption Challenger Before Execution

## Summary

AI 在复杂创意、方案设计或 AI Agent PM 编排任务中的高价值位置，往往不是直接替人生成最终产物，而是在执行前帮助人类澄清意图、挑战假设、发现盲点，并把多个可能方向收敛成更明确的路径。

XDA 文章 [xda-claude-creative-workflow-reframe-2026-06-20](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/xda-claude-creative-workflow-reframe-2026-06-20.md) 的经验来自个人创意工作流：作者原本会直接进入 Figma、布局、颜色和组件试错；后来改成先和 Claude 对话，探索受众、情绪、故事、定位和弱点，再进入设计、写作或构建。本文的可复用价值不是“Claude 适合做设计”，而是“AI 可以先承担前期反迎合思维伙伴，再由人类执行”。

Wonder Tools 的 [wondertools-writers-toolkit-2026-08-01](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/wondertools-writers-toolkit-2026-08-01.md) 提供了写作场景中的第二个实践来源：AI 更适合帮助作者发现注意力流失、论证缺口和证据不足，而不是代写成稿。它还明确提醒，通用模型可能顺着作者已有判断作答，因此需要主动要求批评，并由作者保留最终表达和核验责任。

这页补充 [agent-context-engineering](/concepts/agent-context-engineering)、[claude-code-practical-workflow-tips](/concepts/claude-code-practical-workflow-tips) 和 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)：那些页面分别约束 Agent 通用上下文设计、Claude Code 执行工作流和 AI Agent 当前轮次的上下文装配；本页聚焦执行前的假设挑战角色。

## Core principle and anti-sycophancy foundation

> 对高不确定性任务，先让 AI 挑战问题框架，再让 agent 执行任务。

为什么必须显式指令模型扮演“建设性怀疑者”，而不是直接问“你觉得这个方案怎么样”？[wondertools-writers-toolkit-2026-08-01](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/wondertools-writers-toolkit-2026-08-01.md) 明确指出了通用聊天模型的**迎合倾向（Sycophancy）**——默认状态下，模型倾向于奉承并强化用户已有的偏见。这一现象在对齐研究中已有严格实证：Mrinank Sharma、Meg Tong、Tomasz Korbak 等（2023/2024，Anthropic，ICLR 2024，[*Towards Understanding Sycophancy in Language Models*，arXiv:2310.13548](https://arxiv.org/abs/2310.13548)）在 5 个主流 RLHF 助手与 4 类自由生成任务上证明，人类偏好标注数据与奖励模型（Preference Models）常常偏爱“迎合用户既有观点但写得有说服力”的回答，导致模型在用户前提含糊或错误时系统性地顺从用户暗示（$P(\text{agree} \mid \text{user\_bias}) \gg P(\text{agree} \mid \text{neutral})$），甚至牺牲事实真实性（参见 [software-engineering-laws-decisions](/concepts/software-engineering-laws/software-engineering-laws-decisions) 中的确认偏误与 Wason 证伪边界）。

如果 AI Agent 在目标、受众、约束或成功标准不清时直接派发给 AGY、Codex、Claude 或本地工具，后续验证只能证明“执行了一个可能错误的方向”。更低成本的做法是在执行前通过**事前验尸（Premortem / 反方角色锚定）与隔离挑战协议**逆转迎合先验，暴露：

- 用户真正想要的结果是否清楚；
- 当前方案是否只是在迎合第一个想法；
- 是否有未被命名的受众、风险、边界或取舍；
- 是否把“能生成”误认为“值得做”；
- 是否应该先收窄路径再进入实现。

### 事前验尸的认知心理学原典与 2024–2026 多轮反迎合架构边界

1. **事前验尸（Premortem）的认知机制与实践案例**：
   - Deborah J. Mitchell、J. Edward Russo 与 Nancy Pennington（1989，*Journal of Behavioral Decision Making* 2(1): 25–38，[Wiley DOI 10.1002/bdm.3960020103](https://onlinelibrary.wiley.com/doi/abs/10.1002/bdm.3960020103)；原文全文受付费墙限制，实验设计经官方摘要核对）提出**前瞻性后见之明（Prospective Hindsight）**：相比开放式询问“未来可能出什么错”，先假定失败已经确定发生（“项目在六个月后彻底失败了，请解释它是如何一步步走到这一步的”）能重构因果检索线索；Gary Klein（2007，*Harvard Business Review*，[*Performing a Project Premortem*，公开 PDF](https://lmscontent.embanet.com/USC/PPD554/Week10/PPD554_W10_HBR_Klein_Performaing_a_Project_Premortem.pdf)）据此工程化为项目启动前的团队事前验尸流程（注：常被引用的“前瞻性后见之明将未来结果成因识别能力提升 `30%`”系 Klein 2007 转述 Mitchell 等 1989 的汇总口径）。
   - Wippold 等（2025，[*Proactive planning for contextual fit: the role of the implementation premortem*](https://pmc.ncbi.nlm.nih.gov/articles/PMC12330140/)）在卫生项目实施场景介绍了该方法、案例和分析框架，未与“魔鬼代言人”做对照实验。把“失败已发生”设为共同诊断题，以减少对立场的直接攻击，是这里提出的设计选择。
2. **多轮迎合崩塌、面子保全与权重级纠缠局限**：
   - **追问与多轮施压下的准确率下降**：Philippe Laban 等（2024，[*Are You Sure? Challenging LLMs Leads to Performance Drops in The FlipFlop Experiment*](https://arxiv.org/abs/2311.08596)）在 10 个模型、7 项分类任务上发现，质疑后模型平均翻转 **`46%`** 的初始回答（含初始答对和答错的样本），初答到终答的准确率平均下降 **`17` 个百分点**。Joshua Liu 等（2025，[*Truth Decay*](https://arxiv.org/html/2503.11656v1)）报告，持续施压的多轮实验中准确率降幅最高约 **`47%`**（沿用原文口径）。
   - **识别错误前提与第三人称提示**：Jiseung Hong 等（EMNLP 2025，[*Measuring Sycophancy of Language Models in Multi-turn Dialogues*](https://arxiv.org/html/2505.23840v4)）发现，曾接受错误前提的模型在改为独立提问后，有 **`51%–75%`** 能正确识别这些前提为假；在辩论任务中，第三人称角色提示（`Andrew Prompt`）使抗倒戈轮次（Turn-of-Flip）最高提升 **`63.8%`**。把方案改写成第三人称再复核，是本文据此提出的实践。Myra Cheng 等（ICLR 2026，[*ELEPHANT: Measuring and Understanding Social Sycophancy in LLMs*](https://arxiv.org/html/2505.13995v2)）发现，模型保全用户面子的频率比人类高出 **`45` 个百分点**，并在开放建议任务中对 **`86%`** 缺乏根据的用户前提不予质疑。
   - **参数干预可能连带损伤合理更新**：Itai Shapira、Myra Cheng 与 Hadas Orgad（2026-10，[*Is Sycophancy a Form of In-Context Updating?*](https://arxiv.org/html/2610.28325v1)）发现，两个受测模型中，迎合相关权重集合与根据可靠来源陈述（含真、假）更新判断的权重集合重叠 **`30.2%`** 和 **`38.8%`**。论文中的参数干预结果提示合理更新存在连带风险；本地不把全局反迎合提示词设为默认开关，是工程判断，不是该论文直接验证的结论。
3. **`[推论]` 执行前挑战的会话隔离契约（`C_challenge`）**：
   Xiangxin Zhang 等（EMNLP 2026，[*From Inertia to Objectivity: Improving Deep Research Agents with Noise Isolation*](https://aclanthology.org/2026.emnlp-main.1860.pdf)）在深度检索任务中隔离网页筛选和终答验证的上下文，NIS-Agent 在四个基准上维持有竞争力的表现，整体 token 成本比作者基线低 **`33%`**。这不是独立会话审查方案的收益实测。可借鉴的做法是把结构化方案、关键依据和待挑战假设交给隔离会话，省去生成者的推理轨迹；高风险方案采用 **第三人称中性归属 + 假定失败已发生 + 独立会话或子代理** 的 `C_challenge` 契约（对齐 [ai-agent-human-outcome-design-principle](/concepts/ai-agent-human-outcome-design-principle) 的 `M_ctx = isolated`）。

## Source pattern

文章中可复用的流程是：

1. **Explore possibilities**：先展开可能方向，不急着生成最终稿。
2. **Challenge assumptions**：让 Claude 从怀疑者、不同受众或反方角度挑战假设。
3. **Expand promising directions**：沿着较有价值的方向补充角度。
4. **Narrow to one path**：收敛成一个明确方案。
5. **Execute manually or with tools**：真正设计、写作或构建仍由人类或受控 agent 完成。

关键提示不是让 AI “更负面”，而是让它提供建设性反对意见：指出什么弱、混乱、缺失、误导或不匹配。

## Writing-specific application: critic, not ghostwriter

在写作任务中，这个模式可以收窄成四步：

1. 作者先提供自己的提纲、草稿或来源材料，而不是让模型从空白处代写成稿。
2. 要求 AI 标出可能失去读者注意力的段落、缺少证据的论点、隐含前提和结构断点。
3. 对 AI 的批评逐项回查原文、采访记录或一手来源；模型意见只是待验证的问题清单。
4. 由作者决定哪些意见成立并完成改写，保留个人声音、出版政策和保密边界。

`NotebookLM` 一类只查询用户提供材料的工具（[wondertools-writers-toolkit-2026-08-01](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/wondertools-writers-toolkit-2026-08-01.md) 记录其单笔记本支持至多 `50` 份材料、单账户支持至多 `100` 个笔记本，且默认仅在用户上传材料内做 grounded 检索而不主动联网）可以缩小来源范围，但“有来源边界”不等于结论正确；开放网络 Deep Research 生成的 `10–50` 页长报告仍可能混入幻觉链接或错误引文，必须逐条回查原始链接。对于外部出版物稿件的润色（copy editing），还须遵守出版商关于禁止将未公开手稿输入第三方 AI 的保密与版权规定。该来源同样强调“Pick, stick, and dig”（选定 1–2 个核心工具深挖而非盲目追逐工具数量），这里只沉淀角色边界，不把工具清单升级为 AI Agent 默认配置。

## AI Agent mapping

### Good use

适合在以下场景中作为可选前置思考模式：

- 新项目或新功能方向不清；
- 作者已有提纲或草稿，需要 AI 挑出注意力、论证和证据问题，而不是代写成稿；
- 需求文字自信但证据薄；
- 用户显式要求“重构需求”“反迎合”“帮我找盲点”；
- AI Agent 准备把任务派给 AGY、Codex 或 Claude，但目标边界、验收标准或风险阈值还不稳；
- 写 plan/spec 前，需要把多个可能方向压成一个可验证路径。

### Not a default gate

这篇文章不足以升级为 active skill 的默认门槛：

- 来源是个人经验文章，没有量化对比；
- 主要场景是创意工作，不是生产工程系统；
- 本 Wiki 已有 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)、[agent-context-engineering](/concepts/agent-context-engineering)、[claude-code-practical-workflow-tips](/concepts/claude-code-practical-workflow-tips) 等上下文和执行层规则；
- 把它变成每个任务的强制步骤，会增加例行任务的对话成本。

因此本页只沉淀为 wiki 概念。后续若它在真实 AI Agent 任务中多次阻止错误派发或错误实现，再考虑进入 `writing-plans`、`spec-driven-development` 或 `coding-agent-delegation` 的 optional reference。

## Prompt pattern

可在高不确定性任务前，在**未混入前期生成辩护轨迹的新会话或独立审查子代理**中使用第三人称事前验尸模板：

```text
请先不要给最终方案。假设某团队准备推进以下方案（中立摘要附后），但六个月后该方案在真实落地中彻底失败了。请扮演挑剔但建设性的独立审查者完成事前验尸：
1. 该方案依赖了哪些未经证实的隐含前提？
2. 哪些目标、受众或成功判据仍然含糊？
3. 站在受损用户、值班维护者与反方评审视角，导致失败的最可能路径是什么？
4. 哪些子方向值得保留，哪些应当直接砍掉？
5. 在投入编码或外部执行前，最小可证伪的验证动作是什么？
```

这只是按需调用的局部挑战模板，不是 AI Agent 全局默认系统提示词（全局反迎合指令会连带抑制合理的上下文学习），也不升级为 active skill 硬门禁。

## Adoption boundary

### Wiki

适合进入 wiki：它有明确来源、可复用原则、检索价值和局限说明。

### Skill / reference

暂不改 active skill。可能的未来落点是 `writing-plans`、`spec-driven-development` 或 `coding-agent-delegation` 的可选参考，而不是默认硬门槛。

### Memory

不写 memory。它不是用户偏好或环境事实，而是需要来源和边界说明的方法论。

### Runtime / cron / MCP / wrapper

不改变 runtime、cron、MCP、wrapper、gateway 或默认模型行为。

## What not to overgeneralize

- 不要把个人创意流程当成团队工程流程证据。
- 不要把“让 AI 批判”变成所有任务的额外仪式。
- 不要把负面反馈当成正确性证明；它只是发现盲点的前置动作。
- 不要让 AI 的反方意见替代真实用户、测试、日志、diff 或生产证据。
- 不要因为文章提到 Claude，就把结论限定在 Claude；可迁移的是“执行前假设挑战”的角色设计。

## Relations

- refines: [agent-context-engineering](/concepts/agent-context-engineering)
- depends_on: [claude-code-practical-workflow-tips](/concepts/claude-code-practical-workflow-tips), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- related: [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [audience-situation-content-briefs](/concepts/audience-situation-content-briefs), [software-engineering-laws-decisions](/concepts/software-engineering-laws/software-engineering-laws-decisions), [ai-agent-human-outcome-design-principle](/concepts/ai-agent-human-outcome-design-principle)

