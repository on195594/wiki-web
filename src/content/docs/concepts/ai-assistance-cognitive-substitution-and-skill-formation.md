---
title: AI Assistance, Cognitive Substitution, and Skill Formation
created: 2026-08-04
updated: 2026-11-27
type: concept
tags:
  - agent
  - llm
  - research
  - workflow
  - governance
sources:
  - raw/articles/psychologytoday-ai-cognitive-substitution-skill-formation-2026-08-03.md
  - raw/articles/psychologytoday-ai-two-forms-authorship-2026-07-30.md
  - raw/articles/addyosmani-critical-thinking-when-agents-do-the-work-2026-11-03.md
  - concepts/ai-assumption-challenger-before-execution.md
  - concepts/ai-agent-human-outcome-design-principle.md
  - concepts/dijkstra-ai-programming-formalization.md
  - concepts/agent-autonomy-ladder-for-hermes-workflows.md
  - https://doi.org/10.1016/0005-1098(83)90046-8
  - https://pubmed.ncbi.nlm.nih.gov/9203702/
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635/
  - https://www.anthropic.com/research/AI-assistance-coding-skills
  - https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic
  - https://readwise-assets.s3.amazonaws.com/media/wisereads/articles/thinking-fast-slow-and-artific/1184.pdf
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC11860214/
  - https://www.microsoft.com/en-us/research/wp-content/uploads/2025/01/lee_2025_ai_critical_thinking_survey.pdf
  - https://research.vu.nl/ws/portalfiles/portal/291201748/Dratsch_et_al._2023_-_Automation_Bias_in_Mammography_-_The_Impact_of_Artificial_Intelligence_BI-RADS_Suggestions_on_Reader_Performance.pdf
  - https://doi.org/10.1056/NEJMra2503232
status: stable
description: 结合 Bainbridge 自动化讽刺、Parasuraman–Riley 误用/弃用分类与 2023–2026
  技能形成/认知投降/监督悖论一手实证，区分即时辅助表现、撤除后独立能力与持续委派中的按需理解重建及责任边界。
aliases:
  - ai-scaffolding-vs-substitution
  - cognitive-offloading-with-ai
  - accomplishment-hallucination
  - cognitive-surrender
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# AI Assistance, Cognitive Substitution, and Skill Formation

## Summary

评价 AI 辅助不能只看即时产出是否更快、更完整，还要判断人在撤除辅助后是否仍能独立形成问题、作出判断、发现错误并完成修正。

这页把 AI 帮助区分为补偿、支架、替代和增强。核心风险不是所有“省力”都会让能力退化，而是把替代误认为支架，把漂亮输出误认为学习或判断已经发生。

持续使用 Agent 时，还需区分“脱离工具的独立能力”与“借助工具仍能重建理解并为结果负责”：后者不能证明技能已学会，前者也不是低风险自动化的普遍前提。

它补充 [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution) 的角色设计、[ai-agent-human-outcome-design-principle](/concepts/ai-agent-human-outcome-design-principle) 的人类结果边界，以及 [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization) 对独立工程判断和认知负债的讨论；本页负责人的能力形成、理解与判断权，工程审查的证据和吞吐边界见 [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence)。

## Core distinction: performance is not learning

AI 可以同时提高当前任务表现、缩短等待时间并降低认知负担，但这些结果不能单独证明人的能力有所增长。

更有区分力的问题是：

- 人是否亲自形成了问题，而不只是选择 AI 给出的框架；
- 人是否经历了不确定性、错误发现、修正和取舍；
- 人能否解释为什么接受最终答案；
- 撤除 AI 后，人能否在相近任务上独立完成；
- AI 的贡献是否可见，还是被误记成自己的理解与成就。

文章 [psychologytoday-ai-cognitive-substitution-skill-formation-2026-08-03](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/psychologytoday-ai-cognitive-substitution-skill-formation-2026-08-03.md) 把最后一种错觉称为 **Accomplishment Hallucination（成就幻觉）**：工具产出了计划、句子或解释，使用者因此误以为自己完成了对应的思考过程。

### 人因工程经典理论：Bainbridge 自动化讽刺与 Parasuraman–Riley 四元分类

上述“即时表现提升但独立能力退化、并在复杂异常时失去接管能力”的现象，在人因工程（Human Factors）中有两项奠基性理论支撑：

1. **Bainbridge 的《自动化的讽刺（Ironies of Automation）》**（Lisanne Bainbridge, 1983, *Automatica*, 19(6), 775–779，[DOI 10.1016/0005-1098(83)90046-8](https://doi.org/10.1016/0005-1098(83)90046-8)）：
   Bainbridge 指出了自动化系统设计的核心悖论——设计者将常规、高频、结构良好的子任务全部交给自动化执行，只把自动化无法处理的罕见、高风险、跨边界异常留给人类操作员监控和接管；然而，**恰恰因为人类被剥夺了在常规任务中持续练习、更新心理模型（Mental Model）和保持情境意识（Situation Awareness）的机会，当自动化在最困难的边缘案例中突然失效时，已经发生技能退化（Deskilling）的人类反而最无力完成接管与排障**。
2. **Parasuraman & Riley 的人类—自动化交互四分类（Use, Misuse, Disuse, Abuse）**（Raja Parasuraman & Victor Riley, 1997, *Human Factors*, 39(2), 230–253，[PubMed 9203702](https://pubmed.ncbi.nlm.nih.gov/9203702/)）：
   - **合理使用（Use）**：按任务边界与风险自愿启用或撤除自动化；
   - **误用（Misuse / 过度依赖）**：由自动化偏差（Automation Bias）与监控懈怠驱动，盲目采信错误输出（对应后文的判断递延与认知投降）；
   - **弃用（Disuse / 使用不足）**：因不信任而弃用，典型如高误报率（False Alarms）导致人类关闭或忽略真正有用的自动化警报；
   - **滥用（Abuse / 设计不当）**：系统设计者或管理者在不考虑对人类技能保持、工作负荷与责任边界影响的情况下，强行自动化本应保留人类主动认知参与的环节。
3. **[推论] 辅助表现增益与撤除后技能保持的剪刀差判据**：
   设基准无辅助表现为 $P_0$，使用 AI 辅助期间的即时表现为 $P_{\text{on}}$，撤除辅助后在同分布未见任务上的独立表现为 $P_{\text{off}}$。定义**即时辅助增益** $\Delta P_{\text{assist}} = P_{\text{on}} - P_0$ 与**净技能保持/形成量** $\Delta S_{\text{retain}} = P_{\text{off}} - P_0$：
   - **有效支架（Scaffolding）**：$\Delta P_{\text{assist}} \ge 0 \;\land\; \Delta S_{\text{retain}} > 0$（辅助过程促进了内部心理模型与产生式规则的形成）；
   - **认知替代与能力透支（Cognitive Substitution）**：$\Delta P_{\text{assist}} \gg 0 \;\land\; \Delta S_{\text{retain}} \le 0$（甚至因丧失练习而出现 $P_{\text{off}} < P_0$ 的负迁移，导致在 Bainbridge 式的复杂故障接管中失去排障能力）。对于无需人类保留独立技能的纯后台低风险任务，$\Delta S_{\text{retain}}$ 可豁免；但对于核心架构裁决、安全审查与专业能力训练，必须同时监控 $\Delta S_{\text{retain}}$ 或按需重建理解的能力。

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

## 一手实证锚点：从撤除后负迁移、编程技能折损到自动化偏差

来源评论文章转引的实验线索，经回溯原始论文后可严格界定其效应量与适用边界：

- **高中数学现场随机对照试验（无护栏代答 vs. 教学护栏支架）**：Hamsa Bastani、Osbert Bastani、Alp Sungu 等（2025，*PNAS* 122(26): e2422633122，[*Generative AI without guardrails can harm learning: Evidence from high school mathematics*，PMC12232635](https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635/)）在近 1,000 名高中生（4 轮共 `2,848` 个非荣誉班学生—课时观测）中对比两类 GPT-4 辅助。练习阶段相对无 AI 对照组（基线 `0.284`），无限制 `GPT Base` 提升 **`+48%`**（`+0.137`），带教师提示护栏、拒绝直接给答案的 `GPT Tutor` 提升 **`+127%`**（`+0.361`）；**撤除 AI 后的闭卷考试**中（对照组 `0.321`），`GPT Base` 组反而较对照组显著下降 **`-17%`**（`-0.054`，$p < 0.05$，满足 $\Delta P_{\text{assist}} > 0 \land \Delta S_{\text{retain}} < 0$ 的认知替代判据），而 `GPT Tutor` 组无统计显著惩罚（`-0.004`）。仅看首节课每道题的首次交互，直接索要答案的比例在 `GPT Base` 组为 `67%`，在 `GPT Tutor` 组为 `37%`。
- **软件工程师新异步库习得随机对照实验**：Judy Hanwen Shen 与 Alex Tamkin（2026，Anthropic，[*How AI assistance impacts the formation of coding skills*](https://www.anthropic.com/research/AI-assistance-coding-skills)，`arXiv:2601.20245`）对 $N=52$ 名学习 Python 异步库 `trio` 的工程师进行受控实验：AI 辅助组完成任务仅快约 2 分钟（无统计显著性），但**撤除辅助后的概念、代码阅读与排障测验平均分较纯手写对照组低 `17` 个百分点**（**`50%` vs `67%`**，Cohen's $d = 0.738, p = 0.01$），其中**调试与排障（Debugging）维度跌幅最大**。轨迹分群显示，全盘委派或机械粘贴报错的参与者测验均分低于 `40%`，而将 AI 用于概念追问或“生成后追问理解”的参与者均分保持在 `65%` 以上。
- **人机反馈回路对感知与社会判断偏差的放大**：Moshe Glickman 与 Tali Sharot（2025，*Nature Human Behaviour* 9(2): 345–359，[*How human–AI feedback loops alter human perceptual, emotional and social judgements*，PMC11860214](https://pmc.ncbi.nlm.nih.gov/articles/PMC11860214/)）在 $n=1,401$ 名受试者中证明，人类微弱的初始判断偏差（如情绪识别中 `53.08%` 的悲伤倾向）经模型训练放大至 `65.33%` 后，反过来将人类后续独立判断从基线 `49.9%` 推偏至 `56.3%`（末轮达 `61.44%`，$p < 0.001$；同等人类—人类交互为 `51.45%` vs `50.6%`，$p = 0.48$）；更隐蔽的是，尽管有偏 AI 与有偏人类造成的客观判断偏移幅度相当（$p = 0.90$），受试者却显著低估了 AI 对自身判断的影响（$p < 0.001$）。
- **知识工作者工具信心与批判性思维调查**：Hao-Ping (Hank) Lee 等（2025，Microsoft Research & CMU，ACM *CHI '25*，[*The Impact of Generative AI on Critical Thinking*，公开全文 PDF](https://www.microsoft.com/en-us/research/wp-content/uploads/2025/01/lee_2025_ai_critical_thinking_survey.pdf)）调查 `319` 名知识工作者的 `936` 个真实任务实例发现，对 GenAI 的信心与自报批判性思维努力呈显著负相关（$\beta = -0.69, p < 0.001$），而对自身领域能力的信心与之呈正相关（$\beta = 0.26, p = 0.026$）；定性分析表明认知劳动并未消失，而是从信息搜集转向**结果核验（Verification）、整合与任务督导（Task Stewardship）**。该研究为横截面自报调查，揭示角色转移与相关关系，不单独构成长期能力萎缩的纵向因果证明。
- **乳腺影像自动化偏差与资历非免疫边界**：Thomas Dratsch 等（2023，*Radiology* 307(4): e222176，[*Automation Bias in Mammography*，公开全文 PDF](https://research.vu.nl/ws/portalfiles/portal/291201748/Dratsch_et_al._2023_-_Automation_Bias_in_Mammography_-_The_Impact_of_Artificial_Intelligence_BI-RADS_Suggestions_on_Reader_Performance.pdf)）对 `27` 名放射科医师判读 `50` 例乳腺影像的受控实验显示，当 AI 给出的 BI-RADS 建议正确 vs. 错误时，三组医师的准确率全线跳水：初级组（$n=11$）由 `79.7%` 跌至 **`19.8%`**（$p < 0.001$），中级组（$n=11$）由 `81.3%` 跌至 **`24.8%`**（$p < 0.001$），高年资专家组（$n=5$）亦由 `82.3%` 跌至 **`45.5%`**（$p = 0.003$），且遗漏错误（Omission errors）在各资历组间无显著差异（$p = 0.16$）。Raja-Elie E. Abdulnour 等（2025，*NEJM* 393(8): 786–797，[*Educational Strategies for Clinical Supervision of Artificial Intelligence Use*](https://doi.org/10.1056/NEJMra2503232)）进一步将临床 AI 依赖风险归纳为**技能退化（deskilling）、错误习得（mis-skilling）与从未习得（never-skilling）**三类不同的督导缺口。
- **学习科学的有益困难边界**：间隔练习、提取练习与有益困难（Desirable Difficulties）说明即时顺畅度不是长期留存的可靠代理指标，但这并不意味着无差别的机械摩擦越多越好。

## Withdrawal and contribution tests

在学习、训练、写作或需要保持专业判断的场景，可用两个问题判断帮助方式：

1. **Withdrawal test**：撤除 AI 后，使用者能否在相近任务上独立完成并解释判断？
2. **Contribution test**：使用者能否指出哪些问题、证据、取舍、错误修正和最终判断由自己完成？

这两个问题是诊断框架，不是所有任务的默认硬门禁。若任务目标是可及性补偿或彻底自动化，撤除辅助后的个人能力可能不是主要评价指标。

## 持续委派中的理解所有权：按需重建，而非默认接受

Addy Osmani 的 [addyosmani-critical-thinking-when-agents-do-the-work-2026-11-03](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/addyosmani-critical-thinking-when-agents-do-the-work-2026-11-03.md)（“Offloading, deferral and surrender”）描述了一条经验性光谱：**认知卸载（offloading）**把执行交给 AI、仍保有结果所有权；**判断递延（deferral）**把工具输出直接作为后续输入、不再当作待检验的假设；**认知投降（surrender）**则把 AI 输出默认为自己的结论、觉得无需核查。这是作者的风险辨识框架，不是本页独立验证的心理测量量表。

该文的增量不是要求记住整个系统。作者允许在复杂代码库中按需重建局部理解，并将“即使借助 Agent 仍无法解释答案”作为交出所有权的警讯；同时明确允许在出错代价低的事务上彻底委派，在会让他人承担后果的决定上保留推理与责任。不能将警讯外推为所有自动化都须由人逐项解释。

[推论] 结合本页的 Withdrawal / Contribution tests，可将三个问题分开使用：

- **能力保持**：撤除 AI 后能否独立完成相近任务？适合学习与技能保持目标。
- **理解重建**：在需要修改或决策的局部，能否借助原始材料、工具与 Agent 重建关键行为及取舍，并说明接受理由？适合复杂系统中的持续委派；流畅复述模型说明不等于独立核验。
- **责任归属**：哪些判断由人接受或覆写、关键依据是什么、后果由谁承担？辅助下可解释不证明独立技能，更不免除领域验证或责任。

原文“笃信未来模型更擅长发现错误”的讨论承认这种检测能力提升可能发生，并不主张人永远更擅长检查；它保留的是目标、影响、牺牲与最终问责的判断。模型检测能力、人的独立能力与结果责任不能互相替代。

**一手机制实证：三系统“认知投降”与“监督悖论”**：
- **Wharton 三系统推理与认知投降实验**：Steven D. Shaw 与 Gideon Nave（2026，Wharton 预印本 SSRN 6097646；按[预印本全文](https://readwise-assets.s3.amazonaws.com/media/wisereads/articles/thinking-fast-slow-and-artific/1184.pdf)核对）在 3 项预注册认知反射测试（CRT，共 $N=1,372$、`9,593` 次试次）中将人工推理器建模为外部**系统 3（System 3）**：在咨询了错误 AI 建议的试次中，**`73.2%` 照搬错误建议**（论文以此作为认知投降的行为指标），`19.7%` 拒绝建议且自行答对。研究 1（$N=359$）中，AI 正确时人类准确率升至 `71.0%`，AI 错误时跌至 **`31.5%`**（低于无 AI 基线 `45.8%`，`79.8%` 试次直接照搬错误答案），主观信心却反常膨胀至 `77.0%`（对照组 `65.3%`）；研究 2（$N=485$）中，在 30 秒时限且实际咨询到错误 AI 建议的试次里，参与者答对率为 **`12.1%`**（不限时对照为 `20.4%`）；研究 3（$N=450$）中，在咨询到错误建议的试次里，奖金加逐题反馈把拒绝错误建议的比例从 `20.0%` 提至 `42.3%`，拒绝后仍可能答错。
- **Anthropic 内部工程“监督悖论（Paradox of Supervision）”**：Saffron Huang 等（2025-12，Anthropic，[*How AI is transforming work at Anthropic*](https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic)）结合 `132` 名工程师/研究员问卷、`53` 次深度访谈与 `200,000` 条 Claude Code 内部会话轨迹记录：AI 参与了约 `59%` 的日常工作（自报效率增益 `+50%`），Claude Code 单次无人工介入的连续工具调用次数在半年内翻倍（**`9.8` 步升至 `21.2` 步，`+116%`**），每条会话的平均人工轮次减少 **`33%`**（`6.2` 轮降至 `4.1` 轮）。受访工程师普遍指出核心张力——**有效监督长链 Agent 恰恰依赖在亲手编码与排障中习得的敏锐直觉，但高频长链委派本身正在侵蚀维持该直觉所需的日常练习机会**（运行时阶段非对称授权与生产遥测详见 [agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows)）。

证据与采用边界：Osmani 原文是工程实践反思，本身未提供特定工作习惯防止技能退化的受控对照；上述增补的一手研究验证了短期负迁移、单次会话认知投降与监督张力，但仍不等同于数年尺度的职业纵向因果证明。原文的先写假设、请求反方或盲点扫描，可作为高不确定性任务的可选提示，具体角色见 [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution)；每周脱机练习、每月盘点、满分测验后合并和每次子代理自审均不成为默认门禁。原文六个自问问题与八条结尾原则保留在来源快照，本页只提炼其职责内的概念。

## Fluency is not cognitive authorship

[psychologytoday-ai-two-forms-authorship-2026-07-30](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/psychologytoday-ai-two-forms-authorship-2026-07-30.md) 把作者身份区分为两层：**语言作者身份**是可见的措辞、结构和表达，**认知作者身份**是决定什么值得表达以及哪些推理和取舍支撑表达。这个区分补充了 Contribution test：流畅文本只能证明语言结果存在，不能单独证明对应的问题框架、价值判断和推理由人完成。

[推论] 在 AI 辅助写作或研究中，可进一步追问：

- 最终问题和核心判断由谁提出；
- 哪些证据、反对意见和取舍可追溯到人；
- AI 只是改善表达，还是也供应了问题框架与结论；
- 作者能否说明自己接受、拒绝和修改模型建议的理由。

这是贡献归因与读者信任的诊断框架，不是 AI 文本检测法。原文关于 LLM “没有认知作者身份”的说法是作者的哲学立场，文章没有提供实验、披露标准或可靠识别方法。写作中的具体角色边界仍由 [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution) 负责，本页不把它升级为所有 AI Agent 输出的强制披露门禁。

## Practical implications by context

以下学习、写作、专业判断和产品设计应用是基于来源机制的本地推论，不是 Psychology Today 文章直接验证的跨领域结论。

### Learning and training

优先使用提示、反问、分步反馈和延迟答案，并在没有 AI 的情况下单独测量迁移和保持，而不是只看练习阶段的得分。

### Writing and research

让 AI 先做批评者、证据缺口检查者或备选材料生成器，再由作者决定问题框架、核验来源并完成表达。具体角色边界由 [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution) 负责。

### Professional judgment

高风险建议应先记录人的初始判断，再显示 AI 建议和理由，最后保留差异、覆写及复核证据。本文只提供认知风险框架，不替代领域验证或责任制度。

### AI product and workflow design

[推论] 除速度、成本和完成率外，可按任务目的选择性测量撤除辅助后的独立表现、人工覆写、错误发现和解释质量。产品价值、信任和 human-in-the-loop 的完整边界仍由 [ai-agent-human-outcome-design-principle](/concepts/ai-agent-human-outcome-design-principle) 负责。

## What not to overgeneralize

- Psychology Today 与工程反思文章属于二级综合评论；本页虽已回查 [Bastani et al. (2025)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635/)、[Shen & Tamkin (2026)](https://www.anthropic.com/research/AI-assistance-coding-skills) 等一手实验，但短期课堂或单库习得 RCT 的负迁移幅度（`-17%` / `-17` 个百分点）仍不能直接外推为所有职业在数年尺度上的永久能力退化常数。
- [Lee et al. (2025)](https://www.microsoft.com/en-us/research/wp-content/uploads/2025/01/lee_2025_ai_critical_thinking_survey.pdf) 调查中的批判性思维变化来自横截面自报相关关系，[Dratsch et al. (2023)](https://research.vu.nl/ws/portalfiles/portal/291201748/Dratsch_et_al._2023_-_Automation_Bias_in_Mammography_-_The_Impact_of_Artificial_Intelligence_BI-RADS_Suggestions_on_Reader_Performance.pdf) 衡量的是单次错误建议下的即时自动化偏差而非长期 deskilling，均须按各自实验口径使用。
- 康复机器人和肌肉负荷只是有边界的类比，不是 AI 导致脑损伤的证据。
- 不必要的摩擦可能造成疲劳、排斥和可及性下降；“保留摩擦”必须服从任务目的和使用者需要。
- 不把这套框架升级为所有 AI Agent 任务的额外仪式，也不据此否定低风险、可验证的后台自动化。

## Layer boundary

- **Wiki**：保留来源、概念、证据边界及跨场景判断框架。
- **Memory**：不写；这不是用户偏好或环境事实。
- **Skill/reference / prompt**：暂不升级；单篇外部综合文章不足以成为默认门禁或提示词规则。
- **Runtime/config / cron / MCP / wrapper / gateway / provider / profile/plugin**：不改变；Wiki 内容不构成执行授权。
- **Credentials / deployment / dependencies / external services**：不改变，也不因本文扩大权限或外部副作用。

## Relations

- depends_on: [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution), [ai-agent-human-outcome-design-principle](/concepts/ai-agent-human-outcome-design-principle), [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization)
- related: [personal-growth-operating-model](/concepts/personal-growth-operating-model), [work-and-career-operating-model](/concepts/work-and-career-operating-model), [lifeos-overview](/concepts/lifeos-overview), [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework), [coping-skill-application-and-imaginal-exposure](/concepts/coping-skill-application-and-imaginal-exposure), [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows)

