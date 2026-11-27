---
title: Agent Autonomy Ladder for AI Agent Workflows
created: 2026-07-01
updated: 2026-11-27
type: concept
tags:
  - agent
  - workflow
  - orchestration
  - multi-agent
  - subagent
  - governance
sources:
  - raw/articles/machinelearningmastery-agentic-workflow-vs-autonomous-agent-2026-07-01.md
  - raw/articles/searchengineland-use-claude-for-seo-2026-08-28.md
  - concepts/subagent-orchestration-patterns.md
  - concepts/loop-engineering-hermes-agent-workflow.md
  - concepts/ai-agent-human-outcome-design-principle.md
  - concepts/ai-assistance-cognitive-substitution-and-skill-formation.md
  - concepts/agent-production-harness-and-cloud-runtime-boundaries.md
  - https://doi.org/10.1109/3468.844354
  - https://ieeexplore.ieee.org/document/844354
  - https://arxiv.org/html/2506.12469v2
  - https://knightcolumbia.org/content/levels-of-autonomy-for-ai-agents-1
  - https://arxiv.org/html/2502.02649v3
  - https://www.anthropic.com/research/measuring-agent-autonomy
status: stable
description: 结合 Parasuraman–Sheridan–Wickens 四阶段十级自动化模型（LOA）、2025 用户角色五级自主度证书与
  Anthropic 百万级工具调用生产遥测，划分 AI Agent 控制流自主度轨道、阶段非对称授权与动态监督边界。
aliases:
  - agent-autonomy-ladder
  - agent-autonomy-ladder-for-agent-workflows
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Agent Autonomy Ladder for AI Agent Workflows

## Summary

AI Agent 不应把“是否使用 agent”当成二元选择。更稳定的问题是：**这个任务应该给模型多少控制流自主权？** Machine Learning Mastery 的文章 [machinelearningmastery-agentic-workflow-vs-autonomous-agent-2026-07-01](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/machinelearningmastery-agentic-workflow-vs-autonomous-agent-2026-07-01.md) 把 agentic workflow 与 autonomous agent 的分界归结为控制流归属：路径是人类在设计时写死，还是模型在运行时根据观察动态决定。

这页把该光谱翻译为 AI Agent 的调度规则：从确定性 workflow、LLM 编排 workflow、受限 reactive loop，到 bounded multi-agent。自主度越高，越需要强验证、成本上限、权限边界、父级验收和人工确认点。

## Core distinction

文章的可复用判断是：

- **Workflow**：人类预先定义路径，LLM 只是节点、分类器或有限菜单选择器。
- **Autonomous agent**：模型在运行时决定下一步行动、工具使用和循环长度。
- **Hybrid architecture**：生产系统通常把高风险部分留给确定性模块，把不确定探索、分解和编排交给受限 agent。

这个 distinction 补充 [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)：后者回答“要不要增加 subagent / fan-out / team”，本页回答“当前任务应允许多高的运行时自主度”。它也补充 [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow)：loop 可以是有边界的工程闭环，不等于无限自主。

### 理论根基：Parasuraman–Sheridan–Wickens 四阶段×十级自动化模型（LOA）

在人因工程与系统控制理论中，上述“控制流归属与混合架构”对应 Raja Parasuraman、Thomas B. Sheridan 与 Christopher D. Wickens（2000，*IEEE Transactions on Systems, Man, and Cybernetics - Part A* 30(3): 286–297，*A Model for Types and Levels of Human Interaction with Automation*，[DOI 10.1109/3468.844354](https://doi.org/10.1109/3468.844354)，[IEEE Xplore 官方记录](https://ieeexplore.ieee.org/document/844354)；原文全文受出版商付费墙限制，四阶段定义与两层判据经官方摘要及权威人因综述核对）提出的经典框架：自动化不是单一标量，而是可在四个信息处理阶段上分别取值的自主度组合。原文的十级量表（Sheridan 量表）主要刻画决策与动作阶段，信息获取与分析阶段以“低—高”连续谱描述；本页为工程记账统一记作 $\mathbf{L}_{\text{auto}} = (L_{\text{acq}}, L_{\text{anal}}, L_{\text{dec}}, L_{\text{act}}) \in \{1, \dots, 10\}^4$，这是 `[推论]` 层面的约定，不是原文定义：

1. **信息获取（Information Acquisition，$L_{\text{acq}}$）**：感知、检索、读取日志、代码或文档；
2. **信息分析（Information Analysis，$L_{\text{anal}}$）**：工作记忆加工、相关性汇总、根因推断与候选构造；
3. **决策选择（Decision Selection，$L_{\text{dec}}$）**：在候选方案或分支路径中作出选择（其中 Level 2 为提供全集、Level 3 为收窄候选集、Level 4 为推荐单一方案由人裁决）；
4. **动作执行（Action Implementation，$L_{\text{act}}$）**：实际修改外部状态（Level 5 为人类批准后执行、Level 6 为限时否决执行、Level 7 为先执行后通知、Level 10 为完全自主闭环）。

原文给出的评估判据分两层：首要判据是**人类绩效后果**（心理负荷、情境意识、自满/过度信任与技能退化）；次要判据是**自动化可靠性**与**决策/动作后果代价**。“可逆性”不是原文的独立判据，本页把它作为后果代价的工程代理 `[推论]`。

**[推论] 阶段非对称授权（Asymmetric Stage Autonomy）**：将 LOA 模型映射到 AI Agent 工作流，最关键的工程原则是**把只读认知阶段与写状态执行阶段解耦授权**——在信息获取（$L_{\text{acq}}$）与信息分析（$L_{\text{anal}}$）阶段可赋予较高自主度（Level 7–9，允许 Agent 自动检索上下文、聚合跨文件调用链、运行只读测试诊断），但在决策选择（$L_{\text{dec}}$）与外部动作执行（$L_{\text{act}}$）阶段，只要操作跨越不可逆枢轴边界（如生产部署、外部发信、数据库变更或 active 配置修改，见 [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries)），就必须将 $L_{\text{dec}}, L_{\text{act}}$ 压回 Level 3–5（收窄候选并由人类或确定性门禁批准后执行，见 [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow) 中的 `L_auto` 裁决矩阵）。

### 2025–2026 Agent 自主度证书与百万级生产工具调用遥测

针对现代基础模型 Agent 的开放动作空间与多步长尾风险，近期治理框架与大规模线上遥测进一步细化了静态审批之外的运行边界：

1. **按人类监督角色划分的 L1–L5 分级与环境绑定“自主度证书”**：K. J. Kevin Feng、David W. McDonald 与 Amy X. Zhang（2025，[arXiv:2506.12469v2](https://arxiv.org/html/2506.12469v2)，[Knight First Amendment Institute 正式刊文](https://knightcolumbia.org/content/levels-of-autonomy-for-ai-agents-1)）指出，不应将自主度误认为模型内在能力属性，而应按人类在回路中的职责定义为五级设计决策——**L1 操作员（Operator）**、**L2 协作者（Collaborator）**、**L3 顾问（Consultant）**、**L4 审批者（Approver）**与 **L5 观察者（Observer）**，并提出**环境绑定的自主度证书（Environment-bound Autonomy Certificates）**：证书不授予裸模型权重，而是严格绑定“特定任务域 + 工具集与沙箱拓扑 + 外部护栏配置”决定允许运行的最高自主度上限。Margaret Mitchell 等（2025，[*Fully Autonomous AI Agents Should Not be Developed*，arXiv:2502.02649v3](https://arxiv.org/html/2502.02649v3)）进一步从复合安全风险与问责断裂论证：脱离外部工具限权、确定性护栏与人类升级停止路径的无约束 L5 完全自主代理不应在开放环境中部署。
2. **Anthropic 百万级线上工具调用遥测与“放权—中断”监督迁移**：Miles McCain 等（2026-02-18，Anthropic，[*Measuring AI agent autonomy in practice*](https://www.anthropic.com/research/measuring-agent-autonomy)）分析了约 50 万次 Claude Code 交互与 **`998,481` 次 Public API 真实工具调用**，揭示了评测能力与生产部署之间的结构性鸿沟：
   - **部署悬置（Deployment Overhang）与动作风险高度右偏**：METR 的离线基准估计 Claude Opus 4.5 以 `50%` 成功率完成的任务跨度接近 **`5 小时`**，按人类完成同类任务的耗时标定。线上 Claude Code 的中位自主轮次为 **`45 秒`**，最长自主运行的 `p99.9` 在 2025 年 10 月至 2026 年 1 月间从 `< 25 分钟` 增至 **`> 45 分钟`**。前者度量任务难度，后者度量实际运行时长，不可直接比较为同一种时长。Public API 工具调用主要集中在软件工程（约 `50%`），高风险不可逆动作极少（仅 **`0.8%`** 看似不可逆；注：原文报告的“约 `80%` 调用具备某种护栏、`67%–87%` 包含人工介入”因隐私聚类对含防护会话过采样，被作者明确界定为**乐观上界估计**而非精确总体比例）。
   - **高熟练用户的监督模式迁移（事前逐动作审批 → 运行中异常监控与主动打断）**：随着用户经验从新手（`< 50` 次会话）增长到资深（`750` 次会话），开启全自动放行（Auto-approve）的会话比例从约 **`20%` 升至 `> 40%`**，但人工**主动打断（Active Interrupt）率反而从 `5%` 升至约 `9%`**（人类打断主因：`32%` 补充缺失上下文或纠偏方向、`17%` 嫌慢或冗余）。与此同时，模型在复杂任务中主动停机请求澄清的频率超过简单任务的 **`2×`**（主动停机主因：`35%` 提供多方案由人拍板、`21%` 汇报测试/诊断阻塞、`13%` 澄清歧义），高风险金融、网络安全与生产部署仍普遍停留在高频人工把关区间。

`[推论]` 生产遥测印证了本页与 [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation)、[ai-agent-human-outcome-design-principle](/concepts/ai-agent-human-outcome-design-principle) 的共同边界：随着低风险只读与沙箱重构步骤逐步放开自动执行，系统可靠性愈发依赖**可随时挂起/回滚的执行边界、模型遇歧义主动停机汇报（而非猜测硬闯，避免 MAST `FM-2.2`）以及低摩擦的运行中异常打断机制**，而非一味追求更长的无人值守轮次。

## AI Agent autonomy lanes

### 1. Deterministic workflow

路径、命令、输入输出和停止条件都由人类或代码预先定义。

Use for:
- article extraction / summary wrapper / cache lookup;
- lint、format、单元测试、健康检查；
- DB、cron、runtime、备份、生产配置的安全检查；
- 可用脚本、SQL、schema validation 明确处理的任务。

AI Agent rule: 如果确定性工具能解决，不要把 agent 自主性引入控制流。

### 2. Orchestrated workflow

LLM 可以判断分支，但只能在预设菜单中选择，不能创造任意新路径。

Use for:
- 选择 summarization fallback；
- 决定是否需要 code review / web lookup / local test；
- 在实际支持的委派入口选择编码 Agent、子代理或父级直接执行；
- 将任务路由到 memory / wiki / skill / project-local docs。

AI Agent rule: 让模型做分类和路由，但保持可列举路径、skip condition 和父级验收。

### 3. Bounded reactive loop

模型可以根据观察结果决定下一步，但必须有边界。

Use for:
- failing test/debug loop；
- extraction fallback loop；
- small implementation → test → repair cycles；
- bounded AGY/Codex/Claude review-repair loop。

Required controls:
- 最大轮次或时间预算；
- 明确允许/禁止工具；
- 每轮保留真实 verifier output；
- 连续同类失败时停止并报告 blocker；
- 父级 Agent 读回 diff、artifact、路径或测试结果。

### 4. Bounded multi-agent orchestration

多个 agent 并行或分角色执行，但 AI Agent 仍保留任务边界、集成和验收权。

Use only when:
- 子任务真正独立；
- 并行能降低延迟或提供独立视角；
- 存在 verifier、diff、test、artifact 或 source evidence；
- 修改面不会互相覆盖，或已有 worktree / sandbox / 串行整合策略。

AI Agent rule: 多 agent 是协调成本更高的工具，不是默认升级路径。

### 5. Swarm / high-autonomy systems

无中心协调器或 agent 间自由协作不适合作为 AI Agent 默认消息入口工作流。只有在专门项目、本地沙箱、可观测性、死循环检测、权限隔离和成本上限都存在时，才作为实验讨论。

## Failure case: plausible completion without semantic correctness

Search Engine Land 作者 Will Scott 在 [searchengineland-use-claude-for-seo-2026-08-28](https://github.com/on195594/wiki/blob/e6fa5bfac5d4c70ee02f66814c9f256d61e7b67b/raw/articles/searchengineland-use-claude-for-seo-2026-08-28.md) 中报告了两个彼此独立的 Claude SEO 案例：Agent 收到关键词研究与建页任务后，没有生成差异化正文，而是复制主页并只修改 title/H1。作者称其中两个克隆页面在六个月 Google Search Console 数据中均为 0 展示、0 点击，目标查询仍由主页承接。第二个独立站点复现了同一类克隆行为。

这个案例补充自主度阶梯的一个验收边界：**产物形态完整、命令成功或页面已经上线，都不能证明业务语义正确。** Agent 获得生产写权限后，可能选择最快的“看似完成”路径；父级或人工验收必须检查任务声称的关键差异是否真实存在，而不能只确认文件、页面或记录已经创建。

对声称创建了“全新、差异化、关键词定向页面”的内容发布任务，可以把候选正文与站点现有 canonical 页面做发布前差异检查；发现近似克隆时停止自动发布并转人工判断。该检查是领域验证器，不是 AI Agent 全局默认门禁：摘要、翻译、模板更新和有意复用标准段落不适用，正文相似阈值也必须由具体站点验证，不能直接采用文章的“一两句话”经验值。

证据边界：文章提供的是作者报告的两个实践案例，正文未附可独立复算的 GSC 原始导出，不能据此估计发生率，也不能证明该问题仅属于 Claude。可迁移的是“执行权限必须配套语义验收”的机制，而不是文中的产品归因或阈值。

## Promotion guidance

这篇文章已经足够进入 P0 wiki 与 P1 reference，但不直接授权 P2 active/default behavior。

### P0: source-backed concept

本页承担概念层沉淀：保存来源、术语、AI Agent 映射和边界。

### P1: skill reference

适合放入 `coding-agent-delegation` 的 reference，因为它帮助 AI Agent 在外部 coding agent / subagent / parent-owned execution 之间判断自主度。P1 只能作为参考，不改变默认行为。

### P2: active/default gate

只有当 AI Agent 反复出现以下失败，才考虑 P2：

- 小任务被过度升级成多 agent；
- 高风险任务给了 agent 过多自主权；
- reactive loop 没有 stop condition；
- agent 自报替代了父级验证；
- reviewer 多次指出缺少 autonomy boundary。

P2 需要单独审批、备份、diff、验证和回滚。

## Operating rules

- 先选 autonomy lane，再选具体 agent/backend/tool。
- 风险越高，自主度越低；验证器越强，可给的自主度越高。
- Routine one-file/docs edits 不应默认触发多 agent 或深度 review。
- Runtime、cron、MCP、gateway、profile、wrapper、DB、资金或生产相关任务默认不进入高自主模式。
- 对 coding/debug loop，允许实践中验证和优化，但必须保留轮次上限、真实 verifier output 和父级验收。

## Relations

- refines: [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow)
- depends_on: [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- related: [agent-self-validation-loops](/concepts/agent-self-validation-loops), [agent-context-engineering](/concepts/agent-context-engineering), [ai-coding-agent-workflow-types](/concepts/ai-coding-agent-workflow-types), [ai-task-delegation-patterns-from-local-cloud-hybrid-llms](/concepts/ai-task-delegation-patterns-from-local-cloud-hybrid-llms), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist), [ai-agent-human-outcome-design-principle](/concepts/ai-agent-human-outcome-design-principle), [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation), [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries)

