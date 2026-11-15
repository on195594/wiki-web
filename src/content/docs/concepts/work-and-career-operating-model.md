---
title: Work and Career Operating Model
created: 2026-04-21
updated: 2026-11-15
type: concept
tags:
  - lifeos
  - operating-model
  - workflow
  - decision
  - project
sources:
  - concepts/lifeos-overview.md
  - concepts/hermes-lifeos-executable-architecture.md
  - docs:https://academic.oup.com/ej/article-abstract/125/589/2052/5078088
  - docs:https://docs.iza.org/dp8129.pdf
  - docs:https://www.aeaweb.org/articles?id=10.1257/0002828041301579
  - docs:https://pubsonline.informs.org/doi/10.1287/orsc.2.1.71
  - docs:https://en.wikipedia.org/wiki/Human_capital
  - docs:https://en.wikipedia.org/wiki/Organizational_learning
status: stable
description: 定义工作与职业在 LifeOS 中的目标、人力资本分层（通用/任务特定/企业特定）、探索—利用平衡与家庭约束协调模型。
volatility: low
aliases:
  - work-career-model
  - career-operating-model
---

# Work and Career Operating Model

## Summary
这页提供工作与职业域的通用建模模板：把收入稳定性、能力复利、时间预算、家庭兼容性和未来选择权作为显式变量，而不保存某个人的雇佣、薪酬或求职状态。

证据边界：这是决策框架，不保证职业结果；具体判断需结合行业、地区、劳动关系与个人约束。

## Core objective
工作与职业系统的核心目标是：
- 提供稳定现金流和向上空间
- 保持与你长期能力栈一致的成长路径
- 不因短期收益把家庭节奏与长期竞争力一起透支
- 为家庭教育与资产配置提供可预期支撑

## What this domain governs
这个领域主要管理：
- 工作稳定性
- 收入能力与增长曲线
- 核心能力栈
- 职业选择权
- 时间与精力预算
- 与家庭目标的兼容性

## Core questions
1. 当前工作是否在提供可接受的稳定性与成长性？
2. 现有能力栈是否在持续增值，还是在折旧？
3. 工作强度是否已经侵蚀家庭教育与个人成长？
4. 如果出现职业冲击，家庭是否仍有缓冲空间？
5. 下一阶段应提升的，不是“更忙”，而是哪种更稀缺的能力？

## Decision principles
### 1. Career is a long-duration asset
职业不是短期收益机器，而是长期资产。它的质量决定未来数年的收入上限、选择权和家庭安全边界。

### 2. Optionality matters
好的职业系统应保留选择权，而不是用当前收入最大化换来后续高度锁死。

### 3. Sustainability beats heroic sprinting
长期透支换短期产出，不是真正可持续的职业策略。按劳动经济学家 John Pencavel（2014/2015，*The Economic Journal* 125(589): 2052–2076，[OUP 论文摘要](https://academic.oup.com/ej/article-abstract/125/589/2052/5078088)、[IZA DP No. 8129 全文 PDF](https://docs.iza.org/dp8129.pdf)）对历史军需工人样本的实证研究，周工时与产出呈非线性关系：部分估计在约 $48\text{–}50$ 小时之后出现边际产出递减。该样本与产出指标不能确定当代知识工作者的通用工时阈值，也不能据此声称错误率或健康损耗在该点急剧上升。[推论] 应根据岗位、恢复情况与家庭约束设定可持续投入上限 `E`，并根据实际表现复盘，不把历史样本的拐点用作仓库默认上限。

### 4. Capability compounding over task accumulation
优先积累可迁移、可复利的能力，而不是只堆任务量和忙碌感。按 Gary Becker（1964，《Human Capital》）与 Robert Gibbons & Michael Waldman（2004，*American Economic Review* 94(2): 203–207，[*Task-Specific Human Capital*](https://www.aeaweb.org/articles?id=10.1257/0002828041301579)、[Human capital](https://en.wikipedia.org/wiki/Human_capital)）的人力资本分类，职业技能可分为三层：**通用人力资本（General Human Capital）**（跨行业、跨雇主普遍增值的底层能力）、**任务特定人力资本（Task-Specific Human Capital）**（在同类岗位或专业任务上可跨组织迁移的技艺）与**企业特定人力资本（Firm-Specific Human Capital）**（仅在单一雇主内部流程、审批关系或私有工具上生效的经验）。过度堆砌企业特定资本会放大组织变动或行业下行时的不可迁移风险（“金手铐”与锁定效应）；同时，教育与履历回报也受劳动力市场分割与信号效应（Spence / Stiglitz）约束，不能将人力资本投入简化为线性薪资保证。

### 5. Balance exploitation and exploration across career stages
借鉴 James G. March（1991，*Organization Science* 2(1): 71–87，[*Exploration and Exploitation in Organizational Learning*](https://pubsonline.informs.org/doi/10.1287/orsc.2.1.71)、[Organizational learning](https://en.wikipedia.org/wiki/Organizational_learning)）的**探索与利用权衡（Exploration vs. Exploitation）**，职业配置需同时避免两种退化：一是**利用陷阱（Exploitation Trap）**——因短期可预测回报而把全部时间投入既有存量技能的重复变现，导致能力栈随技术范式转移而折旧；二是**失败陷阱（Failure Trap）**——在缺乏验证闭环与代表作沉淀的情况下频繁切换方向，无法形成复利累积。

## Parameterized decision variables
[推论] 以下是基于本页原则的可选职业决策参数，不是来源验证过的评分模型。参数无仓库默认值，由使用者在私有环境填写；定量比较前须明确单位、周期与分母：
- 现金流缓冲期 `B`（单位：月）：在不侵蚀家庭应急安全垫与近期教育专款（对应 [household-fund-layering-model](/concepts/household-fund-layering-model) 的 `L` 与 `T`）的前提下，以职业可用储备估计收入中断后的支撑时长。月支出近似稳定且总支出大于零时，$B = L_{\text{career\_buffer}} / (\text{Burn}_{\text{base}} + \text{Spend}_{\text{education+housing}})$；两项支出单位均为本币/月且互不重叠，不以支出占比直接相加。正常期净流入为正时，后项可用 $\text{Inflow}_{\text{norm}} \cdot F_e$ 表达；否则直接核算支出，大额非均匀付款须逐月检查（详见 [lifeos-overview](/concepts/lifeos-overview)）。`B` 为探索试错窗口提供约束，而非结果保证；
- 可持续投入上限 `E`（$\mathbb{R}_{\ge 0}$，单位：小时/周）：扣除睡眠恢复、家庭通勤与陪伴（对应 [family-education-operating-model](/concepts/family-education-operating-model) 的 `T_c`）、非职业向成长工时（`P` 的 $H_P$）及用餐、家务、个人照护等活动后，每周可长期维持的工作与职业深度学习总上限；按同一人的互斥时间口径核算，时间可行不等于认知负荷可承受，不设通用 $48\text{–}50\text{ h/wk}$ 阈值；
- 能力复利比 `C`（$[0, 1]$，无量纲比例）：选定同一回顾期与可比计量单位后，可迁移的通用与任务特定能力建设活动占全部所选职业活动的比例；可用投入时长核算，不能将异质产出数量混作分母，无活动时记为不适用。结合代表作、独立任务表现及 [personal-growth-operating-model](/concepts/personal-growth-operating-model) 的 `V` 判断沉淀证据；它不是直接测量人力资本存量的实证量表，也不将所有企业特定经验判作无价值消耗；
- 转换摩擦与锁定成本 `S`：地域/通勤变动、期权或合同锁定期、企业特定资本占比过高或赛道变窄对未来选择权造成的折价。

## Interfaces with other domains
### 与 [household-fund-layering-model](/concepts/household-fund-layering-model) 的关系
收入稳定性和成长曲线会影响教育基金投入能力、家庭现金流安全边界和资产配置风险承受度。

### 与 [family-education-operating-model](/concepts/family-education-operating-model) 的关系
工作时间、通勤与精神负荷会直接影响家庭陪伴质量和教育执行能力。

### 与 [personal-growth-operating-model](/concepts/personal-growth-operating-model) 的关系
成长系统为职业系统提供底层升级燃料；职业系统又反过来为成长提供素材、压力测试与现实反馈。

### 与 [system-governance-operating-model](/concepts/system-governance-operating-model) 的关系
当职业工时长期逼近或突破上限 `E`、或转型计划需动用安全缓冲期 `B` 时，由系统治理域执行跨域约束核查与双环复盘，避免局部职业冲刺静默击穿家庭与健康底线。

## Boundary
本页不承载：
- 求职步骤 SOP
- 单个项目执行计划
- 绩效沟通模板
- 简历优化细节

这些更适合后续 skill 或项目页。

## Optional assistant support
在获得相应数据访问授权后，AI 助手可以支持：
- 职业决策对比
- 能力栈盘点
- 项目/成果整理
- 周期性职业回顾
- 与家庭和财务约束联动的职业选择评估

这些能力示例不表示任何工作、家庭或财务资料已经接入。

## Success criteria
这个 operating model 成立时，应出现：
- 工作决策不再只看短期薪资或情绪波动
- 职业系统能被显式看成家庭与财务系统的一部分
- 能力栈演化有更清晰的主线
- 时间预算能反映家庭优先级，而不是总被工作吞掉

## Relations
- depends_on: [lifeos-overview](/concepts/lifeos-overview), [hermes-lifeos-executable-architecture](/concepts/hermes-lifeos-executable-architecture)
- related: [family-education-operating-model](/concepts/family-education-operating-model), [household-fund-layering-model](/concepts/household-fund-layering-model), [personal-growth-operating-model](/concepts/personal-growth-operating-model), [system-governance-operating-model](/concepts/system-governance-operating-model), [ai-assistance-cognitive-substitution-and-skill-formation](/concepts/ai-assistance-cognitive-substitution-and-skill-formation)

