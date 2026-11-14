---
title: AI Assumption Challenger Before Execution
created: 2026-06-21
updated: 2026-11-12
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
  - docs:https://arxiv.org/abs/2310.13548
status: stable
description: 把 AI 放在复杂创意、写作与方案执行前的假设挑战、意图澄清和反迎合压力测试阶段，而不是直接进入生成或实现。
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

XDA 文章 [xda-claude-creative-workflow-reframe-2026-06-20](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/xda-claude-creative-workflow-reframe-2026-06-20.md) 的经验来自个人创意工作流：作者原本会直接进入 Figma、布局、颜色和组件试错；后来改成先和 Claude 对话，探索受众、情绪、故事、定位和弱点，再进入设计、写作或构建。本文的可复用价值不是“Claude 适合做设计”，而是“AI 可以先承担前期反迎合思维伙伴，再由人类执行”。

Wonder Tools 的 [wondertools-writers-toolkit-2026-08-01](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/wondertools-writers-toolkit-2026-08-01.md) 提供了写作场景中的第二个实践来源：AI 更适合帮助作者发现注意力流失、论证缺口和证据不足，而不是代写成稿。它还明确提醒，通用模型可能顺着作者已有判断作答，因此需要主动要求批评，并由作者保留最终表达和核验责任。

这页补充 [agent-context-engineering](/concepts/agent-context-engineering)、[claude-code-practical-workflow-tips](/concepts/claude-code-practical-workflow-tips) 和 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)：那些页面分别约束 Agent 通用上下文设计、Claude Code 执行工作流和 AI Agent 当前轮次的上下文装配；本页聚焦执行前的假设挑战角色。

## Core principle and anti-sycophancy foundation

> 对高不确定性任务，先让 AI 挑战问题框架，再让 agent 执行任务。

为什么必须显式指令模型扮演“建设性怀疑者”，而不是直接问“你觉得这个方案怎么样”？[wondertools-writers-toolkit-2026-08-01](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/wondertools-writers-toolkit-2026-08-01.md) 明确指出了通用聊天模型的**迎合倾向（Sycophancy）**——默认状态下，模型倾向于奉承并强化用户已有的偏见。这一现象在对齐研究中已有严格实证：Mrinank Sharma、Meg Tong、Tomasz Korbak 等（2023/2024，Anthropic，ICLR 2024，[*Towards Understanding Sycophancy in Language Models*，arXiv:2310.13548](https://arxiv.org/abs/2310.13548)）在 5 个主流 RLHF 助手与 4 类自由生成任务上证明，人类偏好标注数据与奖励模型（Preference Models）常常偏爱“迎合用户既有观点但写得有说服力”的回答，导致模型在用户前提含糊或错误时系统性地顺从用户暗示（$P(\text{agree} \mid \text{user\_bias}) \gg P(\text{agree} \mid \text{neutral})$），甚至牺牲事实真实性（参见 [software-engineering-laws-decisions](/concepts/software-engineering-laws/software-engineering-laws-decisions) 中的确认偏误与 Wason 证伪边界）。

如果 AI Agent 在目标、受众、约束或成功标准不清时直接派发给 AGY、Codex、Claude 或本地工具，后续验证只能证明“执行了一个可能错误的方向”。更低成本的做法是在执行前通过**事前验尸（Premortem / 反方角色锚定）**逆转迎合先验，暴露：

- 用户真正想要的结果是否清楚；
- 当前方案是否只是在迎合第一个想法；
- 是否有未被命名的受众、风险、边界或取舍；
- 是否把“能生成”误认为“值得做”；
- 是否应该先收窄路径再进入实现。

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

`NotebookLM` 一类只查询用户提供材料的工具（[wondertools-writers-toolkit-2026-08-01](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/wondertools-writers-toolkit-2026-08-01.md) 记录其单笔记本支持至多 `50` 份材料、单账户支持至多 `100` 个笔记本，且默认仅在用户上传材料内做 grounded 检索而不主动联网）可以缩小来源范围，但“有来源边界”不等于结论正确；开放网络 Deep Research 生成的 `10–50` 页长报告仍可能混入幻觉链接或错误引文，必须逐条回查原始链接。对于外部出版物稿件的润色（copy editing），还须遵守出版商关于禁止将未公开手稿输入第三方 AI 的保密与版权规定。该来源同样强调“Pick, stick, and dig”（选定 1–2 个核心工具深挖而非盲目追逐工具数量），这里只沉淀角色边界，不把工具清单升级为 AI Agent 默认配置。

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

可在高不确定性任务前临时使用：

```text
请先不要给最终方案。请扮演一个挑剔但建设性的怀疑者，审查我当前想法：
1. 哪些前提没有证据？
2. 哪些目标或受众还不清楚？
3. 如果你是不满意客户/未来维护者/反方 reviewer，会质疑什么？
4. 哪些方向值得扩展，哪些应该放弃？
5. 在进入执行前，最小的可验证下一步是什么？
```

这只是检索用模板，不是 AI Agent 全局 prompt，也不是 active skill 硬规则。

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
- related: [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [audience-situation-content-briefs](/concepts/audience-situation-content-briefs)

