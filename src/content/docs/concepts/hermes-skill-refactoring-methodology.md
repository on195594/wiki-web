---
title: AI Agent Skill Refactoring Methodology
created: 2026-05-15
updated: 2026-11-14
type: concept
tags:
  - agent
  - skills
  - workflow
  - governance
  - verification
  - ai-coding
  - subagent
sources:
  - raw/articles/claude-warp-self-improving-agent-skills-2026-08-26.md
  - raw/papers/arxiv-2608-26263-skill-state.md
  - raw/papers/arxiv-2608-27454-wikiskill.md
  - concepts/agent-self-validation-loops.md
  - concepts/subagent-orchestration-patterns.md
  - docs:https://hermes-agent.nousresearch.com/docs
  - docs:https://agentskills.io/specification
  - https://wstomv.win.tue.nl/edu/2ip30/references/criteria_for_modularization.pdf
  - https://blog.acolyer.org/2016/09/05/on-the-criteria-to-be-used-in-decomposing-systems-into-modules/
  - https://www.nngroup.com/articles/progressive-disclosure/
status: stable
description: 结合 Parnas 信息隐藏、Nielsen 渐进式披露与 Agent Skills 三层加载、SKILL.state 状态分离及
  Warp/WikiSkill 双环演化机制，总结 AI Agent skill 重构与回归验证的可移植方法。
aliases:
  - skill-refactoring
  - agent-skill-refactoring-methodology
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# AI Agent Skill Refactoring Methodology

## Summary

Skill 重构不应从大重写或按执行流程图机械切分文件开始。应先明确单一职责、触发与跳过条件、硬安全线、合法例外和验证契约；主 `SKILL.md` 只保留执行时必须看到的稳定主契约，高波动的领域细节、脚本和长案例按**信息隐藏（Information Hiding）**与**渐进式披露（Progressive Disclosure）**下沉到单跳可达的 `references/` 与 `scripts/`。

证据边界：本页综合公开的 Skill 演化与状态治理材料（[claude-warp-self-improving-agent-skills-2026-08-26](https://github.com/on195594/wiki/blob/f50b497161edfca34aa32dd28d5515c0b8c491cc/raw/articles/claude-warp-self-improving-agent-skills-2026-08-26.md)、[arxiv-2608-26263-skill-state](https://github.com/on195594/wiki/blob/f50b497161edfca34aa32dd28d5515c0b8c491cc/raw/papers/arxiv-2608-26263-skill-state.md)、[arxiv-2608-27454-wikiskill](https://github.com/on195594/wiki/blob/f50b497161edfca34aa32dd28d5515c0b8c491cc/raw/papers/arxiv-2608-27454-wikiskill.md)）、[Agent Skills 开放规范](https://agentskills.io/specification) 以及软件工程模块化与交互设计一手文献（[Parnas 1972](https://wstomv.win.tue.nl/edu/2ip30/references/criteria_for_modularization.pdf)、[Nielsen 2006](https://www.nngroup.com/articles/progressive-disclosure/)）。它没有公开基准证明某种目录结构必然提高所有任务成功率，也不表示任何本地 Skill 已按此改造、审查或发布。Skill 格式、加载及执行命令应以目标宿主为准；`SKILL.md` / `references/` / `scripts/` 是常见文件式实例，不是所有 Agent 的必要接口。

## 理论与工程根基：信息隐藏、三层渐进式披露与程序—状态解耦

### 1. Parnas 信息隐藏准则：按变更轴而非执行流程图拆分

David L. Parnas（1972，*Communications of the ACM* 15(12): 1053–1058，[*On the Criteria To Be Used in Decomposing Systems into Modules*](https://wstomv.win.tue.nl/edu/2ip30/references/criteria_for_modularization.pdf)，参见 [The Morning Paper 综述](https://blog.acolyer.org/2016/09/05/on-the-criteria-to-be-used-in-decomposing-systems-into-modules/)）通过经典的 KWIC 索引系统对比证明：**按执行步骤流程图（flowchart）拆分模块是错误的默认起点**，因为一旦底层数据格式、外部环境或策略细节变化，所有步骤模块都会被迫同步修改；正确的分解标准是**信息隐藏（Information Hiding）**——先列出最可能变化或最困难的设计决策（volatile secrets），让每个子模块封装一个独立变更轴，仅向调用方暴露稳定、抽象的接口契约。

**[推论]** 映射到 AI Agent Skill 重构：
- **主入口（`SKILL.md`）承载低波动不变量**：单一职责边界、触发与跳过条件（`When to use / When not to use`）、权限与生产副作用硬红线、输出验收契约；
- **子模块（`references/`、`scripts/`、`assets/`）封装高波动秘密**：特定平台 CLI 参数、长篇 Schema 映射表、领域边缘案例清单或确定性校验代码。当外部 API、数据格式或单点领域规则变化时，只需局部修订对应 reference 或 script，而不破坏主 `SKILL.md` 的路由与安全契约。

### 2. 渐进式披露（Progressive Disclosure）与三层上下文预算

Jakob Nielsen（2006，[Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)）指出，渐进式披露能同时改善系统的易学性、执行效率与错误率，但必须满足两条刚性可用性判据：
1. **正确的首屏/次级分割（Primary vs. Secondary Split）**：首屏必须包含高频核心指令与安全不变量，避免执行者为常规任务频繁跳转，同时严禁塞入低频特例干扰注意力聚焦；
2. **强信息气味（Strong Information Scent）与层级上限**：从主层指向次级层的路由链接必须用具体任务触发语义标识“点开后会得到什么”，且原文以可用性经验指出，超过两层时用户通常更容易迷失；这不是定量显著性结论，也不是对 Agent 资源加载的统一硬限制（区别于每步必须顺序走完的向导式 Staged Disclosure）。

[Agent Skills 规范](https://agentskills.io/specification) 将这一原则实例化为三层按需加载结构（上下文装配规则参见 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)，候选池扇出衰减见 [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state)）：

| 披露层级 | 载体与规范约束 | 加载时机与上下文复杂度 | 核心职责边界 |
| :--- | :--- | :--- | :--- |
| **Level 1：目录元数据（Metadata）** | `SKILL.md` frontmatter（`name` 1–64 字符，限小写字母、数字与连字符，不得首尾或连续连字符，且须与父目录名一致；`description` 1–1,024 字符） | 会话启动时全量加载（约 `~100 tokens / skill`，$\mathcal{O}(M)$） | 同时声明“做什么（What）”与“何时触发/跳过（When）”，提供高鉴别度触发词以降低候选池扇出冲突 |
| **Level 2：核心指令（Instructions）** | `SKILL.md` 正文（规范建议 `< 5,000 tokens` 且 `< 500 lines`） | 仅在任务命中并激活该 Skill 时加载（$\mathcal{O}(1)$） | 承载前置检查、主工作流步骤、不可逆操作审批红线、合法例外与完成证据契约 |
| **Level 3：按需资源（Bundled Resources）** | `references/`（细分文档）、`scripts/`（自包含可执行脚本）、`assets/`（模板/Schema） | 仅在主流程条件分支实际需要时按需读取或调用 | 保持距 `SKILL.md` **单跳可达（one level deep）**，禁止深层嵌套引用链（`A → B → C`） |

### 3. 程序性规范与可变执行状态解耦（`SKILL.state`）

Sanket Badhe 等（2026，EMNLP，*SKILL.state: Scalable Long-Horizon Agent Skills*，[arxiv-2608-26263-skill-state](https://github.com/on195594/wiki/blob/f50b497161edfca34aa32dd28d5515c0b8c491cc/raw/papers/arxiv-2608-26263-skill-state.md)）证明，长程技能执行退化的核心原因之一是把“不可变的程序性规范 $P$”与“随步数增长的对话历史和单步推理 $R_t$”混杂在追加式上下文中（单步窗口 $\mathcal{O}(t)$，累计 Token 复杂度 $\mathcal{O}(T^2)$）。通过将每步模型输入重构为：

$$A_t = (P,\; \Sigma_t,\; O_t), \qquad \Sigma_{t+1} = \Sigma_t \oplus \Delta\Sigma_t$$

其中 $P$ 为只读技能规范，$\Sigma_t$ 为由确定性运行时校验并合并的**有界领域状态**（如 InterCode CTF 复用的 5 字段 Schema），$O_t$ 为最新观察，当步推理 $R_t$ 在状态更新后即移出下一轮提示词。在状态保持有界的假设下，单步提示体积收敛为 $\mathcal{O}(1)$、累计复杂度降为 $\mathcal{O}(T)$（Warehouse $T=100$ 场景下 `Gemini-3-Flash` 累计 Token 从 `1,062,387` 降至 `65,408`，降幅 `16.2×`；噪声注入下保持 `>= 0.97` 准确率；InterCode CTF `pass@1` 达 `54.2%`）。

**模型能力边界与反例**：该架构对底座模型的结构化补丁能力高度敏感——论文记录 `Gemma-4-31B-it` 在 $T=100$ 时得分仅为 `0.42`，其失败分布为 **`68%` 过早覆写或删除有效状态、`20%` Schema 理解或类型转换错误、`12%` JSON 语法错误**。**[推论]** 重构复杂长程 Skill 时，应把运行期中间状态外化为带确定性校验的结构化状态文件或脚本，而不是靠扩写 `SKILL.md` 提示词要求模型在聊天历史中靠记忆维护状态；同时对小模型或弱结构化模型保留确定性回滚与原始证据日志。

### 4. 双环反馈演化（Warp Inner/Outer Loop）与诊断隔离（WikiSkill）

- **在线执行与离线修订单环分离**（[claude-warp-self-improving-agent-skills-2026-08-26](https://github.com/on195594/wiki/blob/f50b497161edfca34aa32dd28d5515c0b8c491cc/raw/articles/claude-warp-self-improving-agent-skills-2026-08-26.md)）：Warp 的生产实践指出，手动改写单体 prompt 或无限追加 `AGENTS.md` 无法规模化扩展。其自改进架构拆分为两个职责正交的 Skill：**Inner/Base Skill** 仅负责按当前领域规则执行任务（如 PR 审查或 Issue 分流）；**Outer/Improver Skill** 作为按计划运行的观察者，通过技能内打包的确定性脚本（bundled Python script，避免每次临时生成抓取代码）收集带具体理由的人类反馈，定位最小修改锚点并向 Base Skill 发起 Git Pull Request，**由人类完成最终审查与合并**。Warp 总结了六条可迁移的 Skill 编写与重构原则：（1）写可泛化的原则而非穷举死规则；（2）解释规则背后的 Why；（3）在原有工作流（PR/Issue）内低摩擦收集带理由的高质量反馈；（4）保持 Skill 短小并用渐进式披露引用脚本与资源；（5）专家带因果解释的反馈优于大量二元投票；（6）先建确定性验证基线再迭代 Skill，且多 Agent 可共用模板化的 Improver 机制。
- **诊断轨迹隔离与跨模型负迁移防御**（[arxiv-2608-27454-wikiskill](https://github.com/on195594/wiki/blob/f50b497161edfca34aa32dd28d5515c0b8c491cc/raw/papers/arxiv-2608-27454-wikiskill.md)）：WikiSkill 将演进状态拆为可回滚的活动技能集 $S_k$ 与单调积累的持久知识库 $W_k$（`rollback(S_k) != erase(W_k)`，状态转移方程见 [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state)）。其消融实验表明，在 `Gemini-3.5-Flash` 上，当 rollout 轨迹用于诊断现有 Skill 缺口并提议重构时，**仅向 Wiki Maintainer 与 Skill Proposer 开放持久 Wiki（`63.7`）优于同时向执行任务的 Inference Agent 注入 Wiki（`60.9`，无 Wiki 基线为 `48.7`）**——因为执行期额外注入背景百科会掩盖 Skill 本身的指令缺口。同时，跨模型迁移实验揭示了显著的**负迁移风险**：由 `Qwen-3.5-4B` 演化出的包含碎片化单行 Python 约束的 SpreadsheetBench 技能，在迁移到更强的 `Gemini-3.5-Flash` 时反而限制了其完整脚本生成能力，使成绩从 `50.5%` 暴跌至 `18.1%`。**[推论]** 重构时应定位模型特定的碎片化补丁，只有经对照验证确认冗余或有害后才删除，并按 `Skill × model × harness × tool environment` 复验；不能仅因底座模型更强就移除既有安全或兼容约束。

## When this method applies

适用于一个 Skill 已出现以下信号时：

- 主入口混入大量项目特例或超过合理扫描长度（如逼近或超过 `500` 行 / `5,000 tokens`）；
- 与其他 Skill 的职责边界模糊，导致候选池扇出冲突（Fan Effect）上升；
- 合法例外散落，快速扫描时容易误判；
- 安全、授权或不可逆副作用边界只藏在深层 reference；
- 把应由 `scripts/` 或结构化状态承载的确定性逻辑写成了冗长的自然语言提示；
- 完成声明缺少可重复的命令、输出或 artifact。

不适用于仅因“未来可能需要”而做的预防性重构。

## Phase 0: Read-only baseline

先读取主文档、关联 references、调用入口和现有验证器，记录：

- Skill 的实际单一职责与稳定契约（Parnas 不变量）；
- 当前触发、跳过和升级条件（Level 1 `description` 与首屏路由的鉴别度）；
- 常驻规则、高波动条件细节与可执行脚本的分布；
- 已存在的测试、静态检查和回滚点；
- 哪些内容只是一次项目经验或旧模型补丁，不能直接升级为通用常驻规则。

## Phase 1: Tighten the main contract

只修改共享 owner 能解决的问题：

- 把 `When to use / When not to use` 前置，确保 Level 1 `description` 与首屏摘要同时交代动作范围与触发场景；
- 把数据、权限、生产副作用和不可逆操作边界留在 `SKILL.md` 主路径（多源加载与执行审批边界见 [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary)）；
- 明确合法例外及其额外证据要求；
- 定义完成报告最少需要的可回读证据；
- 删除已被平台原生能力、底座模型通识或其他 Skill owner 覆盖的重复规则。

不要先移动所有文件，也不要为一个实现新建接口或注册表。

## Phase 2: Move conditional detail behind discoverable routes

只有当主入口已过重或存在独立高频变更轴时，才按信息隐藏与渐进式披露下沉 `references/` 与 `scripts/`：

- **强信息气味路由**：每条路由都必须包含任务可识别的触发条件，而不只是裸文件名。例如：
  - `run ID collision / atomic report write / lock` → CLI reliability reference；
  - `placeholder URL / source normalization / deduplication` → search post-processing reference；
  - `production state / payment / notification` → high-risk test boundary reference。
- **单跳扁平约束（One-Level-Deep Invariant）**：所有 reference 与 script 从 `SKILL.md` 直接单跳引用，禁止 `SKILL.md → ref_A.md → ref_B.md` 的多级链式跳转。
- **确定性逻辑外化为脚本**：重复的数据拉取、格式校验或状态合并优先封装进 `scripts/`，不在 `SKILL.md` 中用长篇自然语言模拟确定性代码。
- **安全底线不外移**：安全、授权、触发和验证底线仍留在主文档；reference 不能成为隐藏关键约束的地方。

## Phase 3: Preserve behavioral evidence

重构前后至少验证（自我验证闭环见 [agent-self-validation-loops](/concepts/agent-self-validation-loops)）：

1. **正向触发与负向跳过**：代表性任务仍会触发该 Skill，明确跳过条件仍不会误触发；
2. **单跳路由可达性**：主路径能凭信息气味准确找到必要 reference 或 script，且无断链；
3. **安全与审批不降级**：风险边界没有被下沉、遮蔽或弱化；
4. **回归与反例检查**：原有验证器、最小正例与相邻反例检查通过；若涉及跨模型/跨宿主复用，核对是否存在过度刚性指令导致的负迁移；
5. **父级独立回读**：对于委派任务（见 [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)），子 Agent 的自述不是证据。父级应回读变更并重跑关键检查；无法复验时把结果标为 provisional，而不是“通过”。

## Phase 4: Bounded review and convergence

独立审查应针对实际变更，而不是只审计划。审查重点：

- 职责是否变窄而没有丢失必要行为；
- 触发词和 reference 是否具备清晰的信息气味且保持单跳可达；
- 安全、授权和回滚是否仍显式留在主文档；
- 合法例外是否在所有快速扫描位置一致；
- 完成声明能否由真实命令或 artifact 复验。

只修复经父级复核成立的具体问题。没有阻塞或重要问题后停止，不为“更完整”继续扩写；若候选修改在验证基线上回退，回滚 Skill 变更但在持久层保留失败原因与证据（见 [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state) 与 [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)）。

## `[推论]` Skill 重构四维诊断矩阵（`I_hide / D_disc / S_sep / V_reg`）

以下矩阵将本页重构原则汇总为结构化自检项（属于工程推导，不含未经验证的普适硬阈值）：

| 诊断维度 | 符号与检查问题 | 退化信号（Refactor Trigger） | 收敛目标（Target Invariant） |
| :--- | :--- | :--- | :--- |
| **信息隐藏边界** | $I_{\text{hide}}$：高波动细节是否与主契约解耦？ | 外部 CLI 参数、Schema 字段或单项目特例变更时，每次都需大改主 `SKILL.md` | 主文档仅保留稳定契约与红线，易变细节封装于独立 `references/` 或 `scripts/` |
| **渐进披露深度** | $D_{\text{disc}}$：分层是否满足首屏聚焦与单跳可达？ | `SKILL.md` 塞满低频分支，或出现 `SKILL.md → A → B` 多跳引用链、无触发词裸链接 | 启动仅载入紧凑 `name + description`，正文按信息气味单跳路由至按需资源 |
| **程序与状态分离** | $S_{\text{sep}}$：长程可变状态与确定性操作是否外化？ | 靠扩写自然语言指令让模型在长对话历史中手工记忆中间状态或重算固定逻辑 | 不可变程序规范 $P$ 与受校验的结构化状态 $\Sigma_t$ / 自包含脚本分离 |
| **回归与迁移验证** | $V_{\text{reg}}$：改动是否经回读验证且保留拒绝证据？ | 仅凭单次对话主观感觉或子代理自述宣称“重构成功”，或删除失败实验记录 | 至少验证正/反例触发、边界保持与父级回读；回滚候选时保留失败归因 |

## Reusable checklist

- 是否确有重构需要，而不是规格性预建？
- 是否先查找并修改现有 owner？
- 主文档前部能否看见适用范围、跳过条件和硬边界？
- 哪些规则是不变契约（必须常驻 `SKILL.md`），哪些是高波动秘密（应下沉 `references/` 或 `scripts/`）？
- references 是否由明确的任务语义（信息气味）触发，且保持单跳可达（one level deep）？
- 模型特定补丁是否经对照验证后再保留或删除，且未削弱安全与兼容约束？
- 是否保留一条可运行的回归检查，并由父级读回验证？
- 变更是否减少重复、替换旧规则或退役过时入口？

## Anti-patterns

- 按流程图步骤把一个紧凑 Skill 切碎成多层互相跳转的小文件，破坏单跳可达性；
- 把一次成功经验或针对旧模型的局部补丁直接膨胀成长期通用死规则；
- 用“更完整”为理由在主 `SKILL.md` 堆积项目特例，耗尽上下文预算；
- 把安全、权限和不可逆操作审批边界藏到次级 reference；
- 只审计划，不审最终文件，或用子代理审查标签替代父级验证；
- 只新增规则，不删除、合并或替换旧规则；
- 把示例配置写成已经部署或获得执行授权。

## Takeaway

Skill 重构的目标不是写更多规则，而是通过信息隐藏与单跳渐进式披露，让默认路径更短、责任更清楚、风险边界更可见、例外更明确、证据更可复验。

## Relations
- depends_on: [agent-self-validation-loops](/concepts/agent-self-validation-loops), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)
- related: [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary), [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state)

