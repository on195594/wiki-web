---
title: AI Agent Human Outcome Design Principle
created: 2026-06-20
updated: 2026-08-04
type: concept
tags:
  - agent
  - product
  - workflow
  - decision
  - governance
  - debugging
sources:
  - raw/articles/forbes-ai-implementation-startup-founders-human-needs-2026-06-16.md
  - concepts/agentic-programming-system-engineering.md
  - concepts/typed-ai-agent-boundaries.md
  - concepts/agent-development-lifecycle.md
status: stable
description: 用真实问题、可衡量结果和人类信任边界约束 AI Agent 项目设计，避免从模型能力出发制造漂亮但不可用的自动化。
aliases:
  - human-outcome-first-ai-agent-design
  - ai-automation-human-needs
---

# AI Agent Human Outcome Design Principle

## Summary

AI Agent 项目设计不能从“模型能做什么”开始，而应从“要改善哪个真实问题、哪个可衡量结果、哪类人类信任或行为边界”开始。否则系统可能技术上正确、demo 很漂亮，却在真实用户决策中不可用。

Forbes 这篇创业公司 AI 落地文章的价值不是介绍某个工具，而是提供了两个反面案例：Fund Expo 的融资路径推荐在表格上合理、但对创始人的现实生活和心理压力不可执行；Wobble 则明确把 AI 放在工程、研究和后台行政中，却不让 AI 直接承担心理健康回应，因为用户信任边界不允许。

这页补充 `[[agentic-programming-system-engineering]]`、`[[typed-ai-agent-boundaries]]` 和 `[[agent-development-lifecycle]]`：那些页面主要约束 Agent 的系统工程、接口和生命周期；本页约束更前置的产品/工作流起点——不要把 AI 能力误当成用户价值。

## Core principle

> AI 应优先作为兑现用户结果的后台能力，而不是产品承诺本身。

判断一个 AI Agent 项目是否值得做，先问：

- 它解决的真实问题是什么？
- 用户是否愿意改变行为来采用它？
- 改善的可衡量结果是什么？
- 哪些环节需要人类信任、责任或情感承载？
- AI 是在支撑承诺，还是被包装成承诺本身？

如果这些问题答不清，继续堆模型、工具、subagent、MCP 或自动化权限，只会扩大错误方向。

## Failure case 1: technically sound, emotionally unworkable

Fund Expo 的早期原型试图根据企业概况、行业和财务数字，生成融资选项排序和推荐路径。这个系统在技术上看起来优雅：输入结构化数据，输出融资路径、权益融资、债务、IRR 等分析。

真实问题是：创始人的融资决策不是纯财务优化题。它会影响家庭、房贷、婚姻、孩子接送、心理压力和对投资人的信任。文章中的反馈是：方案可能在 spreadsheet 上成立，但用户“没有办法这么做”。

可复用教训：

- 不要把现实世界决策压扁成技术输入字段。
- 高压力决策里，“正确答案”如果不能被用户接受，就不是有效方案。
- AI 原型验证不能只看输出是否合理，还要看用户是否愿意按它行动。
- 产品问题应先用人类语言定义，再翻译成技术问题。

## Failure case 2: full automation breaks trust too early

Wobble 是心理健康支持服务。创始人 Jack Murphy 早期曾关闭一个由 AI 提供心理支持的产品，因为他认为这不合适。新产品中，他做了三轮消费者研究：96% 的用户认为回应来自真实人类是“关键或非常重要”的。

这并不意味着 Wobble 不用 AI。相反，它积极把 AI 用在工程、研究分析和日常后台行政里：Claude Code 维护平台，Claude 做研究分析和 back office。但 AI 不直接对用户提供治疗回应；临床和伦理侧由人类负责人监督。

可复用教训：

- “AI 可以做”不等于“AI 应该直接面对用户”。
- 高信任/高责任场景中，来源是谁会改变同一条建议的分量。
- 自动化可以先进入后台和辅助层，等信任机制建立后再扩大边界。
- Human-in-the-loop 不是低效，而是某些场景的产品核心。

## Human design gap

文章用 “Human Design Gap” 描述技术规格和人类实际工作/决策方式之间的脱节。AI 只有在改变行为、加速决策、减少摩擦或改善客户结果时才产生价值。否则就是昂贵的剧场效果。

在 Agent 项目中，这个 gap 常表现为：

- agent 能完成任务，但用户不敢信；
- agent 给出建议，但用户无法执行；
- workflow 减少了人工步骤，却也移除了必要责任人；
- 输出看起来更快，但没有改善最终决策质量；
- 自动化能力被当作卖点，而不是后台能力。

## Hermes mapping

### Wiki

这类文章应进入 wiki：它是来源明确、可复用、可检索的外部失败案例，能为后续 AI Agent 项目设计提供反例和设计原则。

### Skill / reference

暂不直接升级为 active skill 默认门禁。更合适的路径是：先在 wiki 中稳定表达原则；后续如果在 1-2 个真实 Agent 项目设计中实际阻止了“技术先行、问题后补”的错误，再把它晋级为某个设计/评审 reference 的 optional checklist。

### Memory

不写 memory。它不是用户偏好、环境事实或工具 quirk，而是需要来源、边界和案例解释的知识。

### Runtime / MCP / cron

不直接改变 runtime、MCP、cron、wrapper 或 gateway 行为。本文只能提供设计原则，不能授权任何自动化能力扩大。

## AI Agent project design checklist

在启动或推广 AI Agent 项目前，至少回答：

1. **Problem-first**：真实问题是什么？不是“AI 能做什么”。
2. **Outcome-first**：要改善哪个可衡量结果？速度、成本、错误率、等待时间、召回率、决策质量还是用户满意度？
3. **Behavior change**：用户需要改变什么行为？他们为什么愿意改？
4. **Human trust boundary**：哪些输出必须由人类承担信任、解释或责任？
5. **Human-in-the-loop**：哪些环节可以后台自动化，哪些环节必须保留确认、审核或人工回应？
6. **AI as plumbing**：对外承诺的是用户结果，还是只是在炫耀 AI 能力？
7. **Pilot evidence**：有没有真实用户/真实任务反馈，而不只是 demo 或模型输出？

## What not to overgeneralize

- 文中 “95% 生成式 AI 试点失败”缺少详细样本和口径，只能作为风险数量级提示，不作为 Hermes 的事实基线。
- 文章案例集中在融资和心理健康这类高情绪、高信任场景；低情绪、强规则、强数据逻辑的后台优化任务不必机械套用完整检查。
- 不应因为文章强调人类信任，就否定后台自动化；Wobble 的案例恰恰说明 AI 可以积极承担工程、分析和行政后台工作。

## Relations

- depends_on: [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering)
- depends_on: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)
- depends_on: [agent-development-lifecycle](/concepts/agent-development-lifecycle)
- related: [agent-context-engineering](/concepts/agent-context-engineering)
- related: [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation)
- related: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)

## Related sources

- `forbes-ai-implementation-startup-founders-human-needs-2026-06-16`

