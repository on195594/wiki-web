---
title: Converting Trading Lessons into Hard Rules
created: 2026-04-17
updated: 2026-11-12
type: query
tags:
  - investment
  - trading
  - governance
  - workflow
sources:
  - queries/repeat-mistake-detection-in-trading.md
  - queries/post-trade-review-loop.md
  - queries/pre-trade-risk-checklist.md
  - queries/when-not-to-trade.md
  - concepts/investment-risk-control-framework.md
  - concepts/hermes-active-surface-lifecycle-governance.md
  - concepts/agent-closed-loop-learning-from-corrections-to-rules.md
  - docs:https://en.wikipedia.org/wiki/Implementation_intention
  - docs:https://sparq.stanford.edu/sites/g/files/sbiybj19021/files/media/file/gollwitzer_brandstatter_1997_-_implementation_intentions_effective_goal_pursuit.pdf
status: stable
description: 回答哪些交易教训应升级成硬规则，并结合执行意图（Implementation Intentions）的 If-Then 结构与活跃面治理保持规则可执行。
aliases:
  - how-i-should-convert-trading-lessons-into-hard-rules
volatility: low
---

# Converting Trading Lessons into Hard Rules

## Summary
这页不是继续讲“学到了什么”，而是讲什么时候一条教训应该真正升级成硬规则。目标是防止两种极端：一种是什么都不制度化，问题永远重复；另一种是什么都想写成规则，结果规则越来越多、越来越空、越来越没人执行。
Public boundary: this is educational risk-control material, not investment advice or a record of any real account, holding or trade.
First-person wording in checklists and questions is a reusable self-check script, not a record of any author's experience.


## Question
哪些交易教训应该升级成硬规则？硬规则应该写到什么颗粒度，才既有约束力，又不会把系统写烂？

## One-line rule
只有反复出现、代价足够大、并且能压成明确动作的教训，才值得升级成硬规则。

## Step 1: separate lesson from rule
先区分两个东西：

### Lesson
是你从交易里得到的认识，例如：
- 我太容易在回撤期放大仓位
- 我总在没确认时抢跑
- 我常把补仓说成再平衡

### Rule
是你下一次必须执行的动作，例如：
- 回撤期内，进攻仓单笔仓位自动缩小一级
- 未确认前不得提前入场
- 任何补仓动作都必须先写明：这是再平衡还是情绪补仓

很多复盘只停在 lesson，没走到 rule，所以问题才会继续重复。

## Step 2: know which lessons are strong enough to become rules
不是每个感受都值得升规则。

更适合升级的通常满足三点：
- 反复出现
- 代价明显
- 可以被明确执行

也就是说，一条 lesson 只有同时满足：
- 它不是偶发
- 它确实伤系统
- 它能被改写成具体动作

才值得进入硬规则层。

## Step 3: do not create rules out of single-trade pain
一笔特别痛的单子，很容易让人冲动立规矩。

比如：
- 以后再也不做这种票
- 以后再也不隔夜
- 以后见到回撤就先跑

这种通常是情绪化立法。

更好的判断是：
- 这是单次特例，还是重复模式？
- 我是在堵漏洞，还是在发泄？
- 这个规则如果长期执行，会不会把系统一起误伤？

硬规则不是用来安抚这次亏损的，而是用来处理未来高概率重复问题的。

## Step 4: write rules as behavior constraints, not abstract virtues
坏规则通常很像口号：
- 要冷静
- 不要贪心
- 尽量等确认
- 以后更谨慎

这些都不算规则，因为没有执行接口。

好规则则应该是行为约束：
- 连续两笔非计划交易后，停手一天
- 没有退出计划，不得开仓
- 回撤期内禁止放大进攻仓总风险
- 任何减仓前，必须先写出剩余仓位处理计划

一句话：
规则必须能告诉未来的你“具体做什么或不做什么”。

### 执行意图（Implementation Intentions）与 `IF-THEN` 规则编译范式

心理学家 Peter M. Gollwitzer 提出的 [执行意图理论（Implementation Intentions, 1993/1999）](https://en.wikipedia.org/wiki/Implementation_intention) 及 [Gollwitzer & Brandstätter (1997) 实验研究](https://sparq.stanford.edu/sites/g/files/sbiybj19021/files/media/file/gollwitzer_brandstatter_1997_-_implementation_intentions_effective_goal_pursuit.pdf) 严格区分了两种心理结构：
- **目标意图（Goal Intention）**：形式为“我打算达到结果 Z”（如“我要保持冷静”、“我要控制回撤”）。在高市场波动、时间压力或情绪激活状态下，抽象目标意图高度依赖临场工作记忆与意志力，极易被当下冲动覆盖。
- **执行意图（Implementation Intention）**：形式为 **`IF 遇到特定情境线索 X，THEN 我将执行具体目标导向动作 Y`**。通过预先将“可观测环境/状态线索 X”与“确定性动作 Y”在记忆中建立强联结，行为控制权从耗竭的临场自控转移给情境触发器，显著提高复杂或抗拒性任务的目标达成率。

**[推论]** 对照 [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules) 的规则蒸馏流程与 [hermes-active-surface-lifecycle-governance](/concepts/hermes-active-surface-lifecycle-governance) 的活跃面治理边界，每一条拟晋升的交易硬规则都应编译为可验证的 `IF-THEN` 契约，并遵守活跃规则容量约束（见 [minimal-executable-trading-system](/queries/minimal-executable-trading-system)）：

| 失败的口号式教训（Goal Intention） | 编译后的 `IF-THEN` 硬规则（Implementation Intention） | 绑定风控参数 / 门禁 |
| :--- | :--- | :--- |
| “回撤期不要急着翻本，要更谨慎” | **IF** 账户回撤触及 `D_max` 或达到预先设定的违规次数阈值（不论盈亏），**THEN** 按预定停手/降档方案处理；完成复盘且重新满足回撤、在途风险等开仓门禁后，才可按预设降档 `r` 复工，不能仅因冷静期结束就自动重启 | `D_max`、`r`（[investment-risk-control-framework](/concepts/investment-risk-control-framework)） |
| “不要把亏损补仓当成长期价值投资” | **IF** 准备对浮亏头寸追加买入，**THEN** 先核验该标的登记账户层：进攻仓一律禁止买入；核心仓仅可依据既定定投/新增现金流计划，或在预定检查窗口达到带宽 `δ` 时按再平衡计划执行 | `δ`（[combining-two-investment-frameworks](/queries/combining-two-investment-frameworks)） |
| “看好也不要一下子重仓赌太大” | **IF** 准备提交进攻仓买单，**THEN** 必须按 [position-sizing-method](/queries/position-sizing-method) 的线性工具适用条件核算数量上限 $N = \ell\lfloor (E \times r)/(\ell d)\rfloor$（$d$ 含点值/汇率与费用滑点，$\ell$ 为最小交易批量），再核查资金、保证金与合并在途风险严格 `< R_open`，不满足则缩量或撤单；非线性工具不直接套用 | `1R`、`R_open`（[position-sizing-method](/queries/position-sizing-method)） |

证据边界：心理学中的执行意图研究（如 Gollwitzer & Sheeran 2006 元分析）支持特定任务中“情境—动作绑定”有助于计划执行，但不直接证明交易场景中的遵守率改善，更不保证策略具有正市场期望。表中是工程规则示例，不提供通用停手时长或复工参数，实际门禁须预先定义并验证。

## Step 5: keep the granularity executable
规则太粗，会没约束力；
规则太细，会执行崩溃。

### 太粗的例子
- 不要冲动
- 要尊重趋势
- 要管理风险

### 太细的例子
- 只要 5 分钟级别某线和某线交叉且成交量达到某值就必须……
如果细到必须靠当下临时解释才能执行，也容易漂。

更合适的颗粒度通常是：
- 足够明确
- 能在当下直接判断是否触发
- 不依赖情绪解释
- 不需要长篇补充说明

## Step 6: prioritize only a few live hard rules at a time
最常见的问题不是规则太少，而是一次加太多。

更有效的做法是：
- 当前只盯最伤系统的 2-3 条硬规则
- 先让它们真正进入执行肌肉记忆
- 等稳定后再补下一批

因为如果你同时新增十条：
- 很快就会记不住
- 更容易在执行时挑着遵守
- 最后系统表面更完整，实际更空心

## Step 7: distinguish hard rules from soft reminders
不是所有东西都该进硬规则层。

### 适合做硬规则的
- 一旦违反，代价很高
- 边界清楚
- 能明确判断触发与否
- 对执行结果影响大

### 更适合做软提醒的
- 需要因市场状态灵活判断
- 更像方向性提醒，而不是刚性约束
- 边界模糊，难以机械判定

例如：
- “没有退出计划不得开仓”更适合硬规则
- “在剧烈波动期更保守一点”更像软提醒

## Step 8: check whether the rule is actually preventing the original mistake
规则写完后，要反过来验证：
- 它真的能拦住原问题吗？
- 还是只是写得很像在管，但实际上仍可绕过去？

比如：
- 如果你写“尽量别补仓”，那它拦不住任何事
- 如果你写“任何补仓前必须先写明这是不是制度化再平衡”，它才开始有约束力

真正有效的规则，应该能让未来的你更难自我解释、自我开脱。

## Step 9: retire or rewrite rules that no longer work
硬规则不是越多越好，也不是一写永远不动。

如果一条规则出现以下情况，就该考虑调整：
- 长期不再对应当前主要问题
- 边界模糊，执行时总在解释
- 副作用开始大于收益
- 已被更高质量规则覆盖

系统健康，不靠规则越积越厚，而靠规则不断更新、压缩、去重。

## Simple hard-rule template
当你准备把一条 lesson 升级成硬规则时，至少写清：
- 这条规则要防什么问题？
- 触发条件是什么？
- 具体禁止或强制什么动作？
- 违反它通常会带来什么代价？

## Quick checklist
判断一条教训是否值得升成硬规则时，快速问自己：
- 这问题是不是反复出现？
- 它是不是足够伤系统？
- 我能不能把它写成一句具体动作约束？
- 这条规则会不会真的拦住原错误，而不只是显得很聪明？

只要后两问答不清楚，就先不要升。

## Minimal version for immediate use
准备立一条新规则前，先问三句：
1. 这真的是重复问题吗？
2. 我能把它写成明确动作吗？
3. 这条规则真的能拦住下次同类错误吗？

三句都答清楚，再进硬规则层。

## Takeaway
交易教训的价值，不在于你当下感触多深，而在于它能不能被压成未来会执行的约束。

真正好的硬规则，不是更多，而是：
- 更少
- 更清楚
- 更难被自己绕开
- 更直接地拦住高代价重复错误

## Relations
- depends_on: [repeat-mistake-detection-in-trading](/queries/repeat-mistake-detection-in-trading), [post-trade-review-loop](/queries/post-trade-review-loop), [pre-trade-risk-checklist](/queries/pre-trade-risk-checklist), [when-not-to-trade](/queries/when-not-to-trade), [investment-risk-control-framework](/concepts/investment-risk-control-framework)
- related: [minimal-executable-trading-system](/queries/minimal-executable-trading-system), [combining-two-investment-frameworks](/queries/combining-two-investment-frameworks), [position-sizing-method](/queries/position-sizing-method), [hermes-active-surface-lifecycle-governance](/concepts/hermes-active-surface-lifecycle-governance), [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules)

