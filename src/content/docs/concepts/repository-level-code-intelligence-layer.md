---
title: Repository-Level Code Intelligence Layer
created: 2026-05-17
updated: 2026-11-26
type: concept
tags:
  - ai-coding
  - architecture
  - workflow
  - context-engineering
  - agent
  - project
sources:
  - raw/articles/marktechpost-repowise-repository-code-intelligence-2026-05-15.md
  - raw/articles/towardsdatascience-context-compiler-coding-agents-2026-08-01.md
  - https://arxiv.org/abs/2407.01489
  - https://aider.chat/2023/10/22/repomap.html
  - https://aider.chat/docs/repomap.html
  - https://sourcegraph.com/blog/announcing-scip
  - https://arxiv.org/abs/2404.05427
  - https://arxiv.org/abs/2503.09089
  - https://arxiv.org/abs/2506.15655
  - https://arxiv.org/abs/2602.11988
  - https://arxiv.org/abs/2601.20404
  - https://thomas-zimmermann.com/publications/files/zimmermann-icse-2004.pdf
status: stable
description: 定义仓库级代码智能层：区分词法、句法 AST（Tree-sitter）与编译器语义索引（LSP /
  SCIP），对比图引导/SBFL/结构分块定位范式，结合版本共变耦合（ROSE）与 AGENTS.md 正反实证及 R_loc / P_sym /
  H_ctx / C_co 参数化门禁装配低噪音上下文。
aliases:
  - repo-code-intelligence
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Repository-Level Code Intelligence Layer

## Summary

仓库级代码智能层把代码库从“文件集合”转成可排序、可查询、可验证的工程图谱，为 AI coding agent 提供比全仓扫描更稳定、更低噪音的上下文入口。它的核心不是某个工具，而是按任务复杂度选择**词法检索、句法 AST（Tree-sitter）或编译器语义索引（LSP / SCIP）**，结合结构依赖与版本共变风险排序，再把高密度信号压缩为按需上下文，而非无条件堆砌常驻仓库概览。

这页编译自 [marktechpost-repowise-repository-code-intelligence-2026-05-15](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/marktechpost-repowise-repository-code-intelligence-2026-05-15.md) 与 [towardsdatascience-context-compiler-coding-agents-2026-08-01](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/towardsdatascience-context-compiler-coding-agents-2026-08-01.md)，并补充 [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management)、[codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering) 和 [claude-code-practical-workflow-tips](/concepts/claude-code-practical-workflow-tips)：这些页面分别关注上下文预算、agent 工作流分层和 Claude Code 使用方式；本页关注代码仓库本身如何变成可分析、可验证的知识层。

## Core principle

不要让 coding agent 以“读整个仓库”作为理解项目的默认入口。

更稳的入口是：先把仓库变成结构化信号，再把高价值信号按任务范围交给 agent。仓库结构、符号引用、调用/继承图、共变历史、死代码候选和架构决策记录，应当先被分析、排序、筛选，再按需装配进任务上下文；而常驻的 `AGENTS.md` / `CLAUDE.md` 只应承载非标准约束与验收命令，不应用大段静态仓库概览挤占每次会话的推理预算。

## Task-scoped context compilation

[towardsdatascience-context-compiler-coding-agents-2026-08-01](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/towardsdatascience-context-compiler-coding-agents-2026-08-01.md) 补充了一个更窄的任务层原则：coding agent 的上下文应围绕当前目标编译，而不是把检索到的材料持续累加。

1. **目标驱动**：先确定要修改、审查或解释的文件、符号与行为，再选择上下文。
2. **分层装配**：目标代码、相关测试、错误与验收条件保留全文；可达依赖优先保留接口、类型、docstring 和关键约束；不可达且没有项目级约束作用的材料默认排除。
3. **扩展依赖定义**：AI Agent 的“依赖”不只包括 import/call graph，还包括 `AGENTS.md`、README、ADR、fixture、配置/schema、CLI/API 契约、当前 diff 和用户边界。
4. **显式不确定性**：动态派发、反射、插件注册、事件订阅、同名符号与配置驱动入口应标记为 unknown，并保留扩大读取范围的回退路径。
5. **选择可解释**：上下文包应说明为什么保留全文、为什么只保留接口、为什么排除其他材料，以及哪里可能遗漏。

这是一种任务上下文装配原则，不是对文章 Python 静态分析器的默认采用，也不能替代项目规则读取、根因调查或父级验证。

## 代码定位与检索范式对照（实证边界）

在大型代码库中，单一检索方式往往在召回率、精度与构建成本间失衡。结合四项一手研究及其基准结果，可按任务形态与可用测试资产选择代码定位与检索范式（以下指标均为特定基准与模型设置下的实验观测，不作为跨仓库通用默认阈值）：

| 定位 / 检索范式 | 代表工作与机制 | 一手实验观测（特定基准） | 适用场景与边界 |
| :--- | :--- | :--- | :--- |
| **静态三阶段层级漏斗** | [Agentless（Xia et al., 2024，arXiv:2407.01489）](https://arxiv.org/abs/2407.01489)：文件目录 → AST 类/函数签名骨架 → 行级窗口 + 紧凑 Diff + 回归/复现测试过滤 | SWE-bench Lite 修复率 `32.00%`（96/300），单次约 `$0.70` | 目标明确的局部缺陷修复基线；跨服务架构权衡或动态运行时调试仍需受控工具循环 |
| **AST 结构检索 + 频谱故障定位（SBFL）** | [AutoCodeRover（Zhang et al., ISSTA 2024，arXiv:2404.05427）](https://arxiv.org/abs/2404.05427)：按 AST 类/方法结构迭代搜索，有测试集时叠加 SBFL 收窄可疑代码位置 | SWE-bench Lite（300 题，原文表 2）：常规 AutoCodeRover `@1` 解出 `19%`（57/300），平均每题 `$0.43`；启用 SBFL 的 `ACR-sbfl` 解出 `22%`（66/300），平均每题 `$0.47` | 具备可运行测试套件的缺陷定位；缺少复现测试时退化为纯 AST 结构搜索 |
| **异构代码图多跳定位** | [LocAgent（Chen et al., ACL 2025，arXiv:2503.09089）](https://arxiv.org/abs/2503.09089)：将代码库解析为有向异构图（文件/类/函数节点 + `imports` / `invocations` / `inheritance` 边），支持 Agent 多跳推理 | 原文表 4–5：微调 Qwen2.5-Coder-32B 的文件级 `Acc@10` 为 `92.70%`，平均定位成本 `$0.09`，同框架 Claude 3.5 为 `$0.66`（约低 `86%`）。表 8：下游 `Pass@10` 从 Agentless 的 `33.58%` 升至微调 Qwen 的 `36.13%`（+2.55 个百分点），或定位模型为 Claude 3.5 时的 `37.59%`（+4.01 个百分点，约 +12% 的相对增幅） | 需跨越多个文件调用链与继承链的复杂问题；动态反射与配置路由仍需显式未知标记 |
| **AST 结构感知分块 Code RAG** | [cAST（Zhang et al., 2025，arXiv:2506.15655）](https://arxiv.org/abs/2506.15655)：按 AST 递归拆分超大节点并合并同级小节点，替代破坏语义的固定行数切分 | RepoEval 检索 `Recall@5` 提升 `4.3` 个百分点；SWE-bench 生成 `Pass@1` 提升 `2.67` 个百分点 | 超大仓库向量/混合检索底座；语义分块提高召回质量，但不替代精确符号引用图 |

**[推论] 对 AI Agent 代码定位的工程启发**：
- **先走结构化层级定位，再决定是否开启自由探索循环**：任务目标明确时，优先按“文件索引 → AST 签名骨架 / 异构图多跳 → 目标行窗口”收窄范围，而不是默认全仓无界 `grep`（与 [agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows) 及 [first-edit-economy-for-coding-agents](/concepts/first-edit-economy-for-coding-agents) 的 EVSI 探索停止边界一致）。
- **有测试时优先叠加动态信号**：纯静态图在动态派发、多态和配置驱动入口处存在盲区；当仓库具备可运行复现测试时，可借鉴 [AutoCodeRover](https://arxiv.org/abs/2404.05427) 将测试覆盖与失败栈作为定位优先线索。
- **接口骨架与实现正文分离**：对仅提供调用契约的依赖模块，优先传入类/函数签名与类型定义；对修改目标区域输出最小 Diff 而非整文件重写。

## Repository intelligence layers

### 1. Indexing layer: 词法 → 句法 AST → 编译器语义（LSP / SCIP）

建立仓库级索引时，需明确**句法级索引**与**编译器级语义索引**的能力边界，按仓库规模和语言特性分层选用：

1. **词法检索层（ripgrep / BM25）**：零预处理、延迟最低，适合精确字面量、报错字符串与配置键查找，但无法理解作用域、别名和继承关系。
2. **句法 AST 层（Tree-sitter）**：如 Paul Gauthier 在 Aider 中实现的 [Tree-sitter Repository Map](https://aider.chat/2023/10/22/repomap.html) 与 [RepoMap 文档](https://aider.chat/docs/repomap.html)，利用 Tree-sitter 与 `tags.scm` 提取类、函数、方法签名及跨文件引用，相比传统 `universal-ctags` 保留更丰富的接口签名上下文且无需外部编译器配置。但其本质属于基于搜索的句法导航（Search-based），在同名符号重载、类型推导、接口多实现与跨仓库引用上存在误报与漏报（参见 [Sourcegraph SCIP](https://sourcegraph.com/blog/announcing-scip)）。
3. **编译器级语义索引层（SCIP / LSP）**：[Sourcegraph SCIP（SCIP Code Intelligence Protocol，2022-06-08 公告）](https://sourcegraph.com/blog/announcing-scip) 依托语言类型检查器或编译器插件（如 `scip-typescript`、`scip-java`）生成编译器级精确的“跳转定义 / 查找引用”索引。相比旧格式 LSIF 的不透明数字图 ID，SCIP 采用 Protobuf 强类型 Schema 与人类可读符号 ID；Sourcegraph 报告压缩后索引体积约为 LSIF 的 `1/4`（未压缩约 `1/5`），`scip-typescript` 替换 `lsif-node` 在其 CI 中提速约 `10x`（作者同时注明该提速并非单纯由协议差异所致）。该公告还将按变更文件增量索引与跨语言导航（如 Protobuf 到生成绑定代码）列为 SCIP 预期解锁的后续能力（`once implemented`），而非该文发布时已完成验证的现成特性；具体仓库落地前须核对目标语言索引器的当前实现状态。代价是需要匹配目标语言的构建与类型检查配置。

作用：
- 给后续图谱、搜索和 AI 上下文生成提供统一底座。
- 避免每次任务都重新做全仓探索。
- `[推论]` 小型单仓或快速原型以“词法 + Tree-sitter”即可覆盖大部分需求；大型多语言 Monorepo 或强类型高耦合重构可优先结合 IDE/编辑器侧 LSP 实时语义查询或预构建 SCIP 索引（LSP 实时查询属于工程架构对照，并非上述 SCIP 公告的实测内容），避免 Agent 在同名符号和动态引用上产生静默误改。

### 2. Dependency graph layer

把文件、模块、导入关系、调用关系、继承关系或符号引用建成有向图（单类引用图见 [Aider RepoMap](https://aider.chat/2023/10/22/repomap.html)；多关系有向异构图见 [LocAgent](https://arxiv.org/abs/2503.09089)）。

作用：
- 把代码库从目录树转成依赖网络。
- 帮助识别核心文件、边界模块和高耦合区域。
- 为可视化、风险排序、多跳定位和上下文裁剪提供依据。

### 3. Centrality ranking layer

用 PageRank、degree centrality 或类似图指标识别“高影响节点”。例如 [Aider RepoMap](https://aider.chat/2023/10/22/repomap.html) 在文件引用有向图上运行图排序算法（结合当前对话已打开文件作为个性化重启权重），再按用户给定的 Token 预算（如 `--map-tokens`，默认 1k tokens）动态筛选出被最广泛引用的核心类与函数签名送入模型窗口。

作用：
- 接手陌生项目时，优先阅读高权重文件。
- 修改前识别潜在高风险区域。
- 给 agent 明确起始文件与固定预算下的全局接口骨架，而不是让它盲目搜索或塞入整文件源码。

注意：中心性高只表示结构影响大，不等于业务重要性一定最高；仍需要测试、Git 历史和人工判断校准。

### 4. Community detection layer

用社区检测识别代码图中的自然模块群。

作用：
- 辅助理解模块边界。
- 发现目录结构和实际依赖结构不一致的地方。
- 为重构、拆分、文档组织和 agent 任务分区提供线索。

### 5. Git intelligence layer（演化共变耦合与降噪边界）

静态 AST 或 SCIP 依赖图无法捕捉不经过直接源码 import 的隐式契约（如配置文件、数据库迁移、跨语言 RPC Schema、文档与测试夹具之间的联动）。Thomas Zimmermann、Peter Weißgerber、Stephan Diehl 与 Andreas Zeller（ICSE 2004，*Mining Version Histories to Guide Software Changes*，[论文 PDF](https://thomas-zimmermann.com/publications/files/zimmermann-icse-2004.pdf)）用版本历史挖掘**演化/逻辑共变耦合**。按原文表 2–3 的导航实验（8 个项目），给定一处初始改动，ROSE 在文件级的平均召回率和精确率分别为 `26%` 与 `30%`，在函数或变量级分别为 `15%` 与 `26%`。这些结果支持把共变用于发现静态分析可能遗漏的候选关系，不等于已证实其能防止漏改。

作用：
- 找出经常一起变化的文件与跨层隐式依赖。
- 判断某个修改的潜在影响半径（衔接 [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence) 的影响半径审查）。
- 帮助区分“结构上相连”和“维护上相连”。

`[推论]` **共变分析降噪边界**：统计共变前须过滤全仓代码格式化、批量重命名、锁文件/依赖自动升级等超大提交，否则虚假高频共变会淹没真实信号；共变结果只能作为“受影响文件/测试候选提示”，不得自动触发无审查修改。

### 6. Dead-code candidate layer

死代码检测应输出候选，不应直接触发删除。

正确使用方式：
- 标记可能未使用的函数、文件或路径。
- 按安全度排序。
- 要求测试、静态分析和人工审查确认。
- 对生产脚本、插件入口、反射调用、CLI 入口、配置驱动代码保持保守。

### 7. Inline decision layer

把架构决策记录在靠近代码的位置，再自动汇总。

示例模式：
- `# DECISION:` 记录为什么这样设计。
- `# TECH_DEBT:` 记录已知债务和触发条件。
- `# SAFETY:` 记录不能随意修改的边界。

价值：决策离代码更近，不容易变成过期文档；同时又能被工具提取成全局 ADR 或项目上下文。

### 8. AI context generation layer（`AGENTS.md` / `CLAUDE.md` 实证边界）

将仓库智能结果写入常驻上下文文件（如 `AGENTS.md`、`CLAUDE.md`）并非无条件有益。2026 年两项一手实证研究揭示了其收益与税负的清晰分界：

- **反证与推理成本税**：Thibaud Gloaguen 等（2026，[*Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?*，arXiv:2602.11988v3](https://arxiv.org/abs/2602.11988)）在 SWE-bench（LLM 生成上下文文件）与含开发者提交上下文文件的真实仓库两类场景下评测，发现提供上下文文件**总体上并未提升任务成功率，反而使推理成本平均增加超过 20%**；尽管 Agent 会认真遵循文件中的指令，但模型厂商常推荐的“仓库概览（repository overviews）”并无帮助，其真正价值集中在声明**非标准编码实践与约束**，任何旨在提效的改动都应在部署前严格评测。
- **效率正例与口径区分**：Jai Lal Lulla 等（2026，[*On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents*，arXiv:2601.20404v2](https://arxiv.org/abs/2601.20404)）分析 10 个仓库的 124 个 GitHub PR 发现，存在 `AGENTS.md` 与更低的中位运行耗时（降低 `28.64%`）和更少的**输出 Token**消耗（降低 `16.58%`）相关，同时保持相当的任务完成表现。注意该摘要报告的是**输出 Token**与中位耗时关联，而非包含常驻输入提示词在内的总推理费用；这与上文 [arXiv:2602.11988](https://arxiv.org/abs/2602.11988) 的总推理成本上升观测并不必然矛盾。

`[推论]` **常驻文件与按需图谱的职责切分**：
- **应放入常驻 `AGENTS.md` / `CLAUDE.md`（短而硬）**：非标准构建/测试/验证命令、特殊工具链与环境前提、高风险禁止触碰边界、无法从代码自明推断的团队特异约定。
- **不应塞入常驻文件（改由按需仓库智能提供）**：冗长的目录树与静态仓库概览（易腐化且每轮缴纳上下文房租，见 [hermes-active-surface-lifecycle-governance](/concepts/hermes-active-surface-lifecycle-governance)）、全量源码解释、过长工具输出、未验证的死代码删除建议、一次性任务细节。
- 任何新增常驻规则应遵循“先做本地基线对照（成本、耗时与完成率），确认净收益后再保留”，避免用自动生成的长篇仓库摘要拖累上下文预算（参见 [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management)）。

## `[推论]` 参数化代码智能与上下文治理裁决矩阵（`R_loc / P_sym / H_ctx / C_co`）

`[推论]` 为将本页的索引分层、代码定位范式、演化共变与常驻上下文实证边界收束为可审计的工程契约，在为代码库引入检索工具、图索引或修改 `AGENTS.md` 时，可按以下四参数核对（不预设跨项目硬编码默认数值）：

| 参数符号 | 治理维度与评估口径 | 工程准入与切换边界 | 违背时的退化模式与处置动作 |
| :--- | :--- | :--- | :--- |
| `R_loc` | **定位召回与探索成本比**（目标文件/函数召回率 vs. 首次编辑前探索 Token 与轮次） | 存在明确锚点时先走层级漏斗（目录/索引 → AST 骨架/异构图 → 行窗口）并结合可运行测试（SBFL / 失败栈），满足 [first-edit-economy-for-coding-agents](/concepts/first-edit-economy-for-coding-agents) 的探索停止判据后再编辑 | 无界全仓 `grep` 耗尽预算，或过度截断导致漏改核心依赖；应切换结构化定位并记录回读/返工率 |
| `P_sym` | **符号解析精度边界**（句法 AST 匹配 vs. 编译器语义 LSP / SCIP 解析） | 小型单仓优先“词法 + Tree-sitter”；遇到同名重载、泛化接口、多语言边界或大型 Monorepo 高风险重构时升级为 LSP / SCIP 精确导航，动态反射入口显式标为 `unknown` | 把 Tree-sitter 句法命中当作完整调用链，导致重构漏改或误删“假死代码”；应降级为保守候选并交由编译器/测试与人工核验 |
| `H_ctx` | **常驻仓库上下文净效用**（引入 `AGENTS.md` / `CLAUDE.md` 后的任务完成率与端到端成本/耗时变化） | 优先保留非标准命令、安全红线与特异约定；用代表性任务对照增删前后的完成率、总成本与耗时，不能证明净收益的概览改为按需读取。论文中的 `>20%` 是实验观测，不是本地容许阈值 | 常驻文件膨胀成易腐化的项目百科，挤压注意力并推高成本；按 [hermes-active-surface-lifecycle-governance](/concepts/hermes-active-surface-lifecycle-governance) 将概览下沉为按需查询 |
| `C_co` | **静动态联合爆炸半径**（静态依赖图影响面 $\cup$ 去噪后 Git 共变耦合候选） | 高风险或跨层变更前，除沿静态调用图追踪调用方外，用剔除超大格式化提交后的共变记录核查配置、Schema 与测试夹具是否遗漏同步（[ROSE，ICSE 2004](https://thomas-zimmermann.com/publications/files/zimmermann-icse-2004.pdf)） | 仅看单文件 diff 导致跨配置/跨语言契约断裂；将联合影响面作为 [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence) 的人工审查与回归测试输入 |

## AI Agent mapping

### Wiki

本页是概念层：回答“代码仓库如何成为 AI 可用的结构化知识层”。它不等同于 Repowise、Aider、SCIP 或 LocAgent 使用手册，也不直接授权安装工具或修改 AI Agent runtime。

### Coding workflow

对 AI Agent coding 任务的启发：
- 子任务开始前，先给 agent 起始文件和结构化上下文。
- 对陌生仓库，优先按层级或图谱生成按需摘要，而不是让 agent 全仓扫描或把长篇概览固化进常驻指令。
- 高噪音探索适合交给 subagent，主会话只接收核心文件、风险和验证建议。
- `AGENTS.md` / `CLAUDE.md` 应短而硬，聚焦非标准命令与红线，并经真实任务对照验证。

### Skill/reference mapping

跨工具、任务级的上下文装配可由目标项目已有开发方法或按需参考文档承接。只在目标入口明确且上下文可能过载时使用，不假定预装某个 Skill，也不要求新增静态分析门或多份重复规则。

## Relationship to existing concepts

- [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management) 关注减少无关上下文进入模型；本页补充“如何先把仓库压成高密度按需信号，并防止常驻上下文文件反噬预算”。
- [codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering) 说明 prompt、`AGENTS.md`、skills、MCP 和 automation 的分层；本页补充 `AGENTS.md` 的实证成本边界及底层代码智能支撑。
- [claude-code-practical-workflow-tips](/concepts/claude-code-practical-workflow-tips) 强调 coding agent 要能验证和拿到正确上下文；本页补充结构化仓库图谱与语义索引的分层选择。
- [first-edit-economy-for-coding-agents](/concepts/first-edit-economy-for-coding-agents) 关注有明确锚点时何时停止前置探索并执行最小编辑；本页提供压低前置探索成本的代码定位底座。
- [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 关注运行时接口与类型化契约；本页补充静态类型检查器/编译器语义索引（LSP / SCIP）在代码理解侧的对应边界。
- [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence) 强调按变更影响半径决定人工审查深度；本页的静态依赖图与 Git 共变耦合为其提供影响面识别依据。
- [hermes-active-surface-lifecycle-governance](/concepts/hermes-active-surface-lifecycle-governance) 治理常驻指令的上下文房租与重基线退役；本页补齐 `AGENTS.md` 场景下的一手实证依据。
- [llm-engineering-knowledge-map](/concepts/llm-engineering-knowledge-map) 是更上层的 LLM 工程总览；本页是 AI coding 场景下的仓库知识层。

## What to preserve, what not to preserve

保留：
- 仓库是静动态混合图谱（词法 / 句法 AST / 语义 LSP-SCIP + 演化共变），不只是目录树。
- PageRank / centrality 与异构图多跳可辅助定位高影响文件，存在测试时优先结合动态故障定位信号。
- 社区检测可辅助识别模块边界，Git 共变关系（经超大提交降噪后）可提示静态图不可见的修改风险。
- 死代码检测只能作为候选发现。
- 源码邻近的架构决策标签可以降低 ADR 腐化。
- `AGENTS.md` / `CLAUDE.md` 应聚焦非标准约定与验收命令，而非堆砌静态仓库概览，并须经效果与成本对照。

不保留为核心知识：
- Repowise、SCIP 或 LocAgent 的完整安装教程。
- `itsdangerous` 示例细节。
- `safe_to_delete_threshold: 0.7` 这类工具默认值作为通用标准。
- 特定论文在 SWE-bench Lite / RepoEval / 124 个 PR 上的精确百分比作为跨仓库保证。
- 将 Repowise 或特定图索引器直接纳入 AI Agent 默认 coding workflow。
- 自动删除死代码或自动接受 AI 架构解释。

## Practical checklist

接手陌生项目或准备让 agent 处理大型仓库前：

1. 是否明确当前任务只需词法 + Tree-sitter，还是因多态/跨仓/强类型耦合需要 LSP / SCIP 语义解析？
2. 是否已通过层级漏斗、图排序或失败测试栈锁定高影响文件与主要模块边界？
3. 是否区分了静态依赖图与去噪后的 Git 共变耦合，避免漏改配置、Schema 或测试夹具？
4. 是否有可验证的测试/构建入口与源码邻近的架构决策/安全边界记录？
5. `AGENTS.md` / `CLAUDE.md` 是否仅保留非标准约定与验证命令，并已剔除高税负的冗余仓库概览？
6. 死代码候选是否经过测试、静态分析与人工审查，而不是直接删除？

## Limits

Repowise 文章的示例只覆盖较小的 Python 项目 `itsdangerous`；Context Compiler 文章也只报告两个较小 Python 仓库，以 naive full-repo dump 为基线，并用 `characters // 4` 估算 token。2026-11-19 局部补证的 [AutoCodeRover](https://arxiv.org/abs/2404.05427)、[LocAgent](https://arxiv.org/abs/2503.09089)、[cAST](https://arxiv.org/abs/2506.15655)、[Evaluating AGENTS.md](https://arxiv.org/abs/2602.11988)、[AGENTS.md Efficiency](https://arxiv.org/abs/2601.20404) 与 [ROSE（ICSE 2004）](https://thomas-zimmermann.com/publications/files/zimmermann-icse-2004.pdf) 等研究均未做独立复现。本次核对了公开摘要，以及 AutoCodeRover 表 2、LocAgent 表 4–5 与表 8、ROSE 表 2–3 的指标口径（因此保留页面级 `verified_at: 2026-11-02` 不变）；[SCIP](https://sourcegraph.com/blog/announcing-scip) 的体积与 CI 提速数据属于 Sourcegraph 2022-06-08 第一方公告（作者明确提速并非仅源于协议差异，增量索引与跨语言导航在公告时尚属预期能力）。上述与 [Agentless](https://arxiv.org/abs/2407.01489) 均为特定基准、语言或时间点工具链下的观测结果；因此，本页只沉淀仓库智能、语义索引与上下文治理的分层原则和裁决框架，不把任一论文指标、工具栈或默认参数固化为全局运行规则。

## Relations

- refines: [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management), [codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering), [claude-code-practical-workflow-tips](/concepts/claude-code-practical-workflow-tips)
- related: [llm-engineering-knowledge-map](/concepts/llm-engineering-knowledge-map), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [first-edit-economy-for-coding-agents](/concepts/first-edit-economy-for-coding-agents), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence), [hermes-active-surface-lifecycle-governance](/concepts/hermes-active-surface-lifecycle-governance), [agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows)

