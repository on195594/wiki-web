---
title: AI Agent Memory Governance Notes
created: 2026-04-22
updated: 2026-11-13
type: concept
tags:
  - agent
  - memory
  - governance
  - orchestration
  - knowledge-base
sources:
  - raw/articles/machinelearningmastery-ai-agent-memory-strategy-decision-tree-2026-07-11.md
  - concepts/hermes-memory-skills-wiki-boundaries.md
  - concepts/hermes-layer-routing-decision-checklist.md
  - https://alexpetrov.com/pub/iccm06/PetrovICCM06.pdf
  - https://zoo.cs.yale.edu/classes/cs671/12f/12f-papers/anderson-act-r.pdf
  - https://andymatuschak.org/prompts/Bjork1992.pdf
  - https://bjorklab.psych.ucla.edu/research/
status: stable
description: 记录 AI Agent memory 的写入、更新、遗忘、ACT-R 幂律激活衰减、Bjork 存储强度 vs. 检索强度双维解耦与跨层治理注意事项。
aliases:
  - memory-governance
  - agent-memory-governance-notes
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# AI Agent Memory Governance Notes

## Summary
这页提供用户偏好与持久事实存储的精简和跨层路由规则：哪些内容适合留在 `memory`，哪些应进入公开 wiki、受治理的 skill、项目私有状态或仅留在 session。它不描述任何人的当前 memory 内容或容量。`USER.md` / `MEMORY.md` 仅是实现示例；宿主可以采用其他文件、设置或存储接口。

## Why this page exists
在实际使用里，最容易发生的漂移不是“不知道 memory 是什么”，而是：
- 明明知道边界，还是把重要但过长的规则塞进 `memory`
- 把方法、架构原则、治理说明和用户事实混在一起
- 因为最近刚讨论过，就把尚未稳定的内容提前写入 `memory`

常见经验是：`memory` 的问题通常不是缺内容，而是缺少准入和替换纪律。这个判断是方法建议，不是公开实验结论。

## What should stay in memory
只有满足下面四点，才应该继续留在 `memory`：
- 能压成一句高密度表达
- 在相关任务的复用周期内仍有明确有效性；不使用统一 30 天阈值
- 会在很多不同任务里默认起作用
- 不需要多段结构、来源说明或交叉链接

### 认知心理学依据：基础水平激活（Base-Level Activation）与幂律衰减

为什么常驻 `memory` 必须同时要求“跨任务高频调用”与“随时间淘汰一次性碎片”？在 John R. Anderson 与 Lael J. Schooler（1991）的理性记忆分析及 ACT-R 认知架构（Anderson et al.，2004，[An Integrated Theory of the Mind](https://zoo.cs.yale.edu/classes/cs671/12f/12f-papers/anderson-act-r.pdf)；Petrov，2006，[Computationally Efficient Approximation of the Base-Level Learning Equation](https://alexpetrov.com/pub/iccm06/PetrovICCM06.pdf)）中，一条记忆块 $i$ 在当前时刻被再次需要的对数奇数（Log-odds of need）由**基础水平激活方程（Base-Level Activation）**决定：

$$B_i = \ln\!\left(\sum_{j=1}^{n} t_j^{-d}\right) \approx \ln\!\left(\frac{n}{1 - d}\right) - d \ln(L)$$

其中 $n$ 为该条目在历史任务中被实际激活使用的次数，$t_j$ 为第 $j$ 次使用距今的时间间隔，$L$ 为该条目的总存活时长，$d \in (0, 1)$ 为幂律遗忘率参数（ACT-R 默认取 $d = 0.5$）。

**[推论]** 该公式揭示了常驻记忆治理的两个定量边界：
1. **单次近期讨论不等于高长期激活（$n = 1$ 时 $B_i = -d \ln t_1$ 随时间迅速衰减）**：刚刚在当前会话讨论过一次的临时判断或配置尝试，虽然短期内 $t_1$ 很小，但若缺乏跨任务重复调用（$n$ 极小），其未来需求对数奇数会按幂律快速跌破检索阈值，因此应留在 `session` 而非提前写入常驻 `memory`；
2. **高频稳定事实具备抗衰减增益（$\ln n$ 项补偿时间衰减）**：只有跨越多个任务周期反复被用到的用户偏好与环境稳定事实（高 $n$），才能持续维持正的基础激活水平 $B_i$，配得上占用每轮默认注入的上下文预算（见 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) 中的 `B_act` 门禁）。

### 双维解耦补充：存储强度（Storage Strength）vs. 检索强度（Retrieval Strength）

若仅用单一激活标量 $B_i$ 裁决所有长期知识的存废，容易陷入两难：要么将“低频触发但经严格验证的关键规程/架构边界”当作过期噪音误删，要么将“近期高频读写但很快失效的局部状态”误晋升为常驻记忆。Robert A. Bjork 与 Elizabeth L. Bjork（1992，[*A New Theory of Disuse and an Old Theory of Stimulus Fluctuation*](https://andymatuschak.org/prompts/Bjork1992.pdf)；参见 [Storage Strength and Retrieval Strength](https://bjorklab.psych.ucla.edu/research/)）提出的**失用新理论（New Theory of Disuse）**将记忆表征解耦为两个相互作用但可区分的维度：

- **存储强度（Storage Strength，$S_{\text{store}}$）**：描述记忆的学习与关联程度；理论假定它不因未使用而衰减，但熟记的内容也可能错误，不能据此推定证据质量或事实可靠性；
- **检索强度（Retrieval Strength，$S_{\text{retr}}$）**：描述当前提取的容易程度，会随时间和情境变化；它与 ACT-R 激活讨论相近问题，但不能直接把两个模型的量等同。

**[推论]** 工程上可借用双维区分，另行评估“经核验的持久复用价值”与“跨任务默认需要程度”，而非直接测量人类的 $S_{\text{store}}$、$S_{\text{retr}}$。以下高低标签仅指这两个工程代理指标；证据可靠性必须独立检查。将该矩阵用于 AI Agent 跨层治理（对照 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 与 [agent-memory-reflection-planning-pipeline](/concepts/agent-memory-reflection-planning-pipeline)），可得到四象限路由准则：
1. **高 $S_{\text{store}}$ + 高 $S_{\text{retr}}$（跨任务高频且已验证的稳定事实/偏好）** $\rightarrow$ 留在常驻 `memory`（或默认注入层头部索引）；
2. **高 $S_{\text{store}}$ + 低 $S_{\text{retr}}$（经严格验证但仅在特定领域/故障下需要的架构知识或 SOP）** $\rightarrow$ **禁止按 $B_i$ 衰减直接删除**，而应从常驻 `memory` 移出，下沉至按需检索的 `wiki` 或按需加载（JIT）的 `skill`，通过轻量索引指针在需要时重激活 $S_{\text{retr}}$，免交每轮默认上下文房租（Context Rent）；
3. **低 $S_{\text{store}}$ + 高 $S_{\text{retr}}$（当前任务高频访问的瞬时进度、临时假设或单次排障上下文）** $\rightarrow$ 留在 `session` 或 `project state`（可配合单次间隔指数衰减 $\gamma^{\Delta t_i}$ 在会话内检索），任务结束后不进入常驻层；
4. **低 $S_{\text{store}}$ + 低 $S_{\text{retr}}$（未经验证且过期的历史噪音）** $\rightarrow$ 直接淘汰或留在冷归档。

### 用户偏好载体
- 用户长期沟通偏好
- 用户稳定的系统修改偏好与风险偏好
- 用户对 AI Agent 落地方式的长期取向
- 用户持续有效的项目/技术栈默认值
- 用户长期生活与决策背景中会反复影响判断的事实

### 持久事实载体
- 运行环境中的稳定事实
- 经多次验证的工具 quirks
- 不容易重新发现、但会反复影响执行结果的运行限制
- 少量高价值的 provider / endpoint 行为结论

## What should move out of memory
下面这些东西即使重要，也不应该默认常驻 `memory`：

### Move to wiki
适合迁移到 `wiki` 的内容：
- 需要分段解释的治理原则
- 需要和其他页面互相引用的架构规则
- “为什么这样分层”的说明
- 一次治理后沉淀出来的正式判断框架

这类内容的问题不是“不重要”，而是太长、太结构化，放进 `memory` 会挤占默认上下文预算。

### Move to skill
适合迁移到 `skill` 的内容：
- 可重复执行的清理流程
- 配置修复、巡检、备份、组合命令等 SOP
- 需要触发条件、步骤、坑点、验证方式的方法

如果一条内容在回答“以后该怎么做”，它通常更像 `skill` 而不是 `memory`。

### Keep only in session
适合只留在 session 的内容：
- 尚未验证的新想法
- 一次性排障过程
- 本周临时计划状态
- 还没有跨任务复用价值的短期判断

## Compression rules
### Rule 1: Merge by role, not by wording
如果多条记忆都在表达同一个角色，应合并为一条：
- 多条都在表达同一项稳定工作偏好 → 合并
- 多条都在表达“官方文档是 AI Agent 相关设计的校准基线” → 合并
- 多条都在表达同一个 tool quirk → 合并

### Rule 2: Prefer one durable sentence over several nearby fragments
`memory` 更适合一句高密度结论，而不是三四条邻近碎片。碎片越多，越容易让真正重要的新信息写不进去。

### Rule 3: Keep method out of memory unless it compresses into a durable policy
“具体怎么做”通常不该进 `memory`；只有当它能压成一条长期有效的工作政策时，才值得留下。

### Rule 4: If it needs headings, it probably belongs in wiki
一条规则如果需要：
- 背景
- 例外
- 反例
- 相关链接
那么它大概率已经不适合 `memory`。

## Synthetic routing examples
### 例 1：关于 memory 只保留稳定事实的原则
- `memory` 中保留一句压缩版政策
- `wiki` 中保留完整治理说明
- 原因：短政策适合常驻，完整说明适合查阅

### 例 2：关于 skill 应保持窄职责的偏好
- `USER.md` 保留一句稳定偏好
- 具体拆分原则放到相关 `skill` 或 `wiki`
- 原因：偏好和方法不能混放


## Minimal operating policy
以后做 memory 治理时，固定按这个顺序判断：
1. 这条内容能否压成一句？不能 → 不进 `memory`
2. 它是偏好/事实，还是方法/知识？
3. 如果是方法 → `skill`
4. 如果是正式知识或治理说明 → `wiki`
5. 如果还不稳定 → 留在 session

## Current fact versus historical event

[machinelearningmastery-ai-agent-memory-strategy-decision-tree-2026-07-11](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/machinelearningmastery-ai-agent-memory-strategy-decision-tree-2026-07-11.md) 提醒：稳定事实与历史事件需要不同的写入和读取规则。

- 新偏好或环境事实写入前，检查是否替代现有条目；优先更新当前事实，而不是并列追加冲突版本。
- 需要保留变更历史时，把旧值及其时间范围放进获授权的项目记录或历史证据；只有适合公开的通用结论才进入 Wiki，不让它继续作为默认当前事实注入。
- 每条高影响事实尽量保留来源、更新时间和有效性；无法判断当前有效版本时，先检索或向用户确认。
- 成功运行日志属于情境证据，不是程序内存；只有重复、可泛化且有验证门槛的方法才进入 skill/reference。

## Relations
- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- related: [hermes-layer-routing-edge-cases](/queries/hermes-layer-routing-edge-cases), [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops), [agent-memory-reflection-planning-pipeline](/concepts/agent-memory-reflection-planning-pipeline), [hermes-active-surface-lifecycle-governance](/concepts/hermes-active-surface-lifecycle-governance)

