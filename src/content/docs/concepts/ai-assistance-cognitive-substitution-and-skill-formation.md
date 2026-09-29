---
title: AI Assistance, Cognitive Substitution, and Skill Formation
created: 2026-08-04
updated: 2026-08-04
type: concept
tags:
  - llm
  - research
  - workflow
  - governance
sources:
  - raw/articles/psychologytoday-ai-cognitive-substitution-skill-formation-2026-08-03.md
  - raw/articles/psychologytoday-ai-two-forms-authorship-2026-07-30.md
  - concepts/ai-assumption-challenger-before-execution.md
  - concepts/ai-agent-human-outcome-design-principle.md
  - concepts/dijkstra-ai-programming-formalization.md
status: stable
description: 用补偿、支架、替代和撤除辅助后的能力，判断 AI 是扩展人的思考还是跳过能力形成过程。
aliases:
  - ai-scaffolding-vs-substitution
  - cognitive-offloading-with-ai
  - accomplishment-hallucination
---

# AI Assistance, Cognitive Substitution, and Skill Formation

## Summary

评价 AI 辅助不能只看即时产出是否更快、更完整，还要判断人在撤除辅助后是否仍能独立形成问题、作出判断、发现错误并完成修正。

这页把 AI 帮助区分为补偿、支架、替代和增强。核心风险不是所有“省力”都会让能力退化，而是把替代误认为支架，把漂亮输出误认为学习或判断已经发生。

它补充 `[ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution)` 的角色设计、`[ai-agent-human-outcome-design-principle](/concepts/ai-agent-human-outcome-design-principle)` 的人类结果边界，以及 `[dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization)` 对独立工程判断和认知负债的讨论；本页只负责“人的能力是否仍在形成和保持”这一层。

## Core distinction: performance is not learning

AI 可以同时提高当前任务表现、缩短等待时间并降低认知负担，但这些结果不能单独证明人的能力有所增长。

更有区分力的问题是：

- 人是否亲自形成了问题，而不只是选择 AI 给出的框架；
- 人是否经历了不确定性、错误发现、修正和取舍；
- 人能否解释为什么接受最终答案；
- 撤除 AI 后，人能否在相近任务上独立完成；
- AI 的贡献是否可见，还是被误记成自己的理解与成就。

文章把最后一种错觉称为 **Accomplishment Hallucination（成就幻觉）**：工具产出了计划、句子或解释，使用者因此误以为自己完成了对应的思考过程。

## Four modes of assistance

### 1. Compensation

补偿让存在持续限制的人仍能完成任务。它可能需要长期存在，不应因为“无法逐步撤除”就被判断为失败。

判断重点是功能可及性和真实结果，而不是强迫所有人承担同等认知负荷。

### 2. Scaffolding

支架保留人的参与、尝试和纠错，同时提供提示、反馈、分步引导或受限材料。能力形成后，支架通常可以逐渐撤除。

支架的关键不是“AI 少做一点”，而是帮助方式仍让人的思考过程可见、可练习、可评估。

### 3. Substitution

替代发生在 AI 完整供应问题框架、判断或修正路径，而人主要接受输出。它可能提高短期表现，并可能伴随已有技能退化、技能学错或未形成的风险；本页不将单一来源视为长期因果证明。

替代并非一律不合理：对没有学习价值的重复任务，它可能正是自动化目标。风险出现在任务本来承担学习、专业判断、责任或创造性发展的功能时。

### 4. Augmentation

增强让人完成原本无法完成的比较、搜索或综合，但不能仅凭任务规模扩大就认定人的能力也同步增长。增强仍需检查人的判断权、理解和错误发现能力是否保留。

## Evidence carried by the source

- 高中数学随机试验：文章称，无限制 GPT-4 助手提高练习成绩，但撤除后考试成绩低于对照组；只给提示、不直接给答案的版本没有出现同样的撤除后惩罚。这是“同一模型、不同帮助方式可能带来不同学习结果”的直接证据线索。
- 人机判断实验：文章引用 1,401 名参与者的实验，指出带偏向的 AI 可能放大感知、情绪和社会判断偏移，而且参与者低估了自己的偏移程度。
- 知识工作者调查：319 名受访者中，对工具信心越高与较少批判性思维相关，对自身信心越高与较多批判性思维相关。该结果是自报和相关关系，不能单独证明因果。
- 放射科自动化偏差：文章转述一项乳腺影像研究，在错误 AI 建议条件下报告准确率由 82% 降至 45.5%；该结果不应推广为一般医疗场景或长期 deskilling 结论，原论文尚未在本次入库中独立复核。
- 学习科学：间隔、提取练习和有益困难说明当前表现不是长期学习的可靠替代指标，但这不等于摩擦越多越好。

这些研究的原始论文未在本次入库中逐篇复核；具体数值和研究设计应回到 raw 页保存的 DOI 进一步验证。

## Withdrawal and contribution tests

在学习、训练、写作或需要保持专业判断的场景，可用两个问题判断帮助方式：

1. **Withdrawal test**：撤除 AI 后，使用者能否在相近任务上独立完成并解释判断？
2. **Contribution test**：使用者能否指出哪些问题、证据、取舍、错误修正和最终判断由自己完成？

这两个问题是诊断框架，不是所有任务的默认硬门禁。若任务目标是可及性补偿或彻底自动化，撤除辅助后的个人能力可能不是主要评价指标。

## Fluency is not cognitive authorship

``psychologytoday-ai-two-forms-authorship-2026-07-30`` 把作者身份区分为两层：**语言作者身份**是可见的措辞、结构和表达，**认知作者身份**是决定什么值得表达以及哪些推理和取舍支撑表达。这个区分补充了 Contribution test：流畅文本只能证明语言结果存在，不能单独证明对应的问题框架、价值判断和推理由人完成。

[推论] 在 AI 辅助写作或研究中，可进一步追问：

- 最终问题和核心判断由谁提出；
- 哪些证据、反对意见和取舍可追溯到人；
- AI 只是改善表达，还是也供应了问题框架与结论；
- 作者能否说明自己接受、拒绝和修改模型建议的理由。

这是贡献归因与读者信任的诊断框架，不是 AI 文本检测法。原文关于 LLM “没有认知作者身份”的说法是作者的哲学立场，文章没有提供实验、披露标准或可靠识别方法。写作中的具体角色边界仍由 `[ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution)` 负责，本页不把它升级为所有 Hermes 输出的强制披露门禁。

## Practical implications by context

以下学习、写作、专业判断和产品设计应用是基于来源机制的本地推论，不是 Psychology Today 文章直接验证的跨领域结论。

### Learning and training

优先使用提示、反问、分步反馈和延迟答案，并在没有 AI 的情况下单独测量迁移和保持，而不是只看练习阶段的得分。

### Writing and research

让 AI 先做批评者、证据缺口检查者或备选材料生成器，再由作者决定问题框架、核验来源并完成表达。具体角色边界由 `[ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution)` 负责。

### Professional judgment

高风险建议应先记录人的初始判断，再显示 AI 建议和理由，最后保留差异、覆写及复核证据。本文只提供认知风险框架，不替代领域验证或责任制度。

### AI product and workflow design

[推论] 除速度、成本和完成率外，可按任务目的选择性测量撤除辅助后的独立表现、人工覆写、错误发现和解释质量。产品价值、信任和 human-in-the-loop 的完整边界仍由 `[ai-agent-human-outcome-design-principle](/concepts/ai-agent-human-outcome-design-principle)` 负责。

## What not to overgeneralize

- 这篇 Psychology Today 文章是研究综合与反思性评论，不是系统综述。
- 单个数学学习试验不能推广到所有年龄、职业和任务。
- 调查中的批判性思维下降是相关关系，不足以独立证明 AI 导致长期能力萎缩。
- 康复机器人和肌肉负荷只是有边界的类比，不是 AI 导致脑损伤的证据。
- 不必要的摩擦可能造成疲劳、排斥和可及性下降；“保留摩擦”必须服从任务目的和使用者需要。
- 不把这套框架升级为所有 Hermes 任务的额外仪式，也不据此否定低风险、可验证的后台自动化。

## Layer boundary

- **Wiki**：保留来源、概念、证据边界及跨场景判断框架。
- **Memory**：不写；这不是用户偏好或环境事实。
- **Skill/reference / prompt**：暂不升级；单篇外部综合文章不足以成为默认门禁或提示词规则。
- **Runtime/config / cron / MCP / wrapper / gateway / provider / profile/plugin**：不改变；Wiki 内容不构成执行授权。
- **Credentials / deployment / dependencies / external services**：不改变，也不因本文扩大权限或外部副作用。

## Relations

- related: [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution)
- related: [ai-agent-human-outcome-design-principle](/concepts/ai-agent-human-outcome-design-principle)
- related: [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization)
- related: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)

## Related sources

- `psychologytoday-ai-cognitive-substitution-skill-formation-2026-08-03`
- `psychologytoday-ai-two-forms-authorship-2026-07-30`

