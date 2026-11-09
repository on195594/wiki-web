---
title: Position Sizing by Risk Budget
created: 2026-04-17
updated: 2026-11-09
type: query
tags:
  - investment
  - trading
  - position-sizing
  - risk-control
sources:
  - queries/pre-trade-risk-checklist.md
  - queries/when-not-to-trade.md
  - queries/position-scaling-method.md
  - concepts/investment-risk-control-framework.md
  - concepts/leontraveller-trading-and-investment-system.md
  - docs:https://vantharpinstitute.com/tools/position-sizing-calculator/
  - docs:https://blog.traderspost.io/article/kelly-criterion-position-sizing-automated-trading
status: stable
description: 回答如何根据风险预算、1R 单位风险、固定比例公式与分数凯利边界决定单笔仓位大小。
aliases:
  - how-i-should-size-a-position
volatility: low
---

# Position Sizing by Risk Budget

## Summary
这页回答的不是“这票有多好”，而是“就算它很好，我最多能下多大”。目标是把仓位从主观兴奋里拿出来，重新放回风险预算里。因为大多数重伤，不是来自看错一次，而是来自在看错时下得太大。
Public boundary: this is educational risk-control material, not investment advice or a record of any real account, holding or trade.
First-person wording in checklists and questions is a reusable self-check script, not a record of any author's experience.


## Question
我应该怎么决定一笔仓位的大小，避免超仓、重仓硬扛，或者把 conviction 当成放大风险的理由？

## One-line rule
仓位大小先由风险承受能力决定，再由 setup 质量微调；不能反过来因为“很看好”就先放大仓位。

## First principle: position size is a risk decision, not a confidence statement
先记住：

仓位首先表达的是“错了能亏多少”，不是“我有多看好”。

所以：
- 仓位不是情绪表达工具
- 仓位不是自我证明工具
- 仓位也不是 conviction 的奖杯

如果一个仓位大到一旦出错就会扰乱整个系统，那它从定义上就已经过大。

## Step 1: classify the capital layer first
先确认这笔仓位属于：
- 核心仓
- 进攻仓

### 对核心仓
仓位大小通常由：
- 目标资产配置
- 组合权重上限
- 再平衡规则
- 家庭风险承受能力
决定。

### 对进攻仓
仓位大小通常由：
- 单笔可承受亏损
- 当前止损距离
- 账户总风险预算
- 是否还要给后续确认式加仓留空间
决定。

如果把这两层混了，仓位会天然失真。

## Step 2: decide the maximum pain before deciding the size
下单前先问：

这笔如果错了，我最多愿意损失什么？

要看的不是“可能赚多少”，而是：
- 亏损会不会伤到账户底盘
- 会不会影响后续继续执行系统
- 会不会让我情绪失控
- 会不会逼我去补仓、扛单、临时改规则

如果一笔亏损会把你带偏，那仓位就已经太大。

## Step 3: separate normal size from oversized conviction
### 正常仓位
正常仓位的特征通常是：
- 就算止损触发，你也能平静执行
- 亏损不会改变你的生活和账户节奏
- 连续错几次仍能继续按系统出手
- 你不需要为了保住这笔仓位去发明新理由

### 超仓
超仓的典型信号是：
- 还没跌到止损，你已经开始难受
- 你开始频繁盯盘
- 你开始希望市场赶紧回本
- 你不愿执行原本愿意执行的止损
- 你已经在想“要不再补一点摊低”

一句话判断：
让你变形的仓位，就是超仓。

## Step 4: conviction cannot replace sizing discipline
“我很看好”不是超仓理由。

因为：
- 你最容易在最顺眼的地方高估自己
- 再好的 setup 也可能失败
- 市场不会因为你更有信心就少给你亏损

更合理的做法是：
- 先用标准仓位进
- 如果走势验证你是对的，再考虑按计划加仓
- 不要在还没被市场验证前，把最大风险先打满

所以，conviction 最多影响执行顺序，不能直接推翻仓位纪律。

## Step 5: what should affect size
真正可以影响仓位大小的，通常只有这些：
- 这是核心仓还是进攻仓
- 单笔风险预算有多大
- 止损距离有多远
- 当前是否处于高波动或事件前后
- 相关持仓是否已经很多，是否会让风险集中
- 账户当前是否正处在回撤期

也就是说，仓位应该和风险结构绑定，而不是和叙事强度绑定。

## Quantitative sizing formulas and boundaries

以下公式基于 [Van Tharp 固定比例风险与 R 倍数框架](https://vantharpinstitute.com/tools/position-sizing-calculator/) 及 [凯利判据仓位管理指南](https://blog.traderspost.io/article/kelly-criterion-position-sizing-automated-trading) 整理，作为进攻仓的定量核算基准（核心仓按目标配置权重与再平衡带管理，不套用单笔止损公式）：

1. **单笔风险预算（$1R$）与固定比例仓位公式**：
   - 设账户总净值为 $E$，单笔计划风险比例为 $r$（由采用者自行设定，比例示例不是通用安全阈值），则单笔风险预算如下；这是计划金额，不是实际亏损保证上限，实际初始风险 $1R$ 须按最终成交数量另行记录：
     $$R_{\text{dollar}} = E \times r$$
   - 对线性计价工具，设入场价为 $P_{\text{entry}}$、预设止损价为 $P_{\text{stop}}$，每单位价格变动对应的账户币种金额为 $q$，每股/每份合约的预估往返费用与滑点为 $c$，最小交易批量为 $\ell$。每股或每份合约的计划风险金额为 $d = |P_{\text{entry}} - P_{\text{stop}}|q + c$，对应数量上限为：
     $$N = \ell\left\lfloor\frac{E \times r}{\ell d}\right\rfloor$$
   - **[推论]** 同币种普通股票可取 $q=1$；期货须纳入合约乘数/每点价值，跨币种须换算汇率。要求 $E>0$、$0<r<1$、$q>0$、$\ell>0$、$c\ge0$、止损距离为正且止损方向有效；向下取整后不足一批则不开仓。忽略费用与批量时，股票简式才是 $N=(E\times r)/|P_{\text{entry}}-P_{\text{stop}}|$。还须受可用资金、保证金、杠杆与组合风险约束；期权等非线性工具不能直接套用。止损距离变宽时应相应缩量，但不能因此将计划风险当作保证损失上限。
2. **R 倍数（R-Multiple）统一绩效标尺**：
   - 按最终成交数量与初始止损记录实际计划风险 $R_{\text{initial}}=Nd\le R_{\text{dollar}}$，以它作为该笔交易的 $1R$，而不是把因批量或资金约束未使用的预算也算作已承担风险；无成交或初始风险为零时不计算 R 倍数。最终盈亏采用同一费用口径：
     $$\text{R-Multiple} = \frac{\text{Realized PnL}_{\text{net}}}{R_{\text{initial}}}$$
   - 例如承担 $1R$ 风险博取 $3R$ 收益即对应 `3:1` 盈亏比；通过 R 倍数分布可跨标的、跨波动率评估策略期望，而不被不同仓位的绝对金额干扰。
3. **凯利判据（Kelly Criterion）与分数凯利边界**：
   - **二元固定赔率模型**：每次独立下注以概率 $W$ 获得所押风险金额的 $b$ 倍、否则损失全部所押金额（$0\le W\le1$、$b>0$），则最优风险比例为：
     $$f^* = W - \frac{1 - W}{b}$$
   - **正期望门禁**：在该模型且仅允许做多/下注时，若 $f^*\le0$，最优下注比例取零。真实交易具有可变盈亏、跳空和相关性；以历史平均盈亏比代入只是简化估计，并非一般收益分布下精确的几何增长最优解，也不能证明未来存在优势。
   - **估计误差与分数凯利（Fractional Kelly）**：分数凯利（如全额的 `1/4` 或 `1/2`，仅为示例）只能降低下注规模，不能消除模型误设和尾部风险。少量滚动样本不能证明胜率和盈亏比稳定；还需考虑费用、样本外表现、市场状态与相关性，并始终受独立风险上限约束。对样本不足或主观裁量交易，不据此动态放大仓位；固定比例风控同样不证明策略具有正期望。
4. **公式适用限制（跳空与相关性风险）**：
   - 上述公式假设价格在触及 $P_{\text{stop}}$ 时能按计划成交；重大事件、盘后交易或流动性枯竭引发的跳空缺口（Gap Risk）可能使实际亏损超过 $1R$，因此不能因算出了精确股数就在高跳空风险前打满仓位，且必须同时核算组合在途总风险（Open Risk）。

## Step 6: when to deliberately size smaller
以下情况，更应该主动缩小仓位：
- 新 setup，还没建立足够执行把握
- 市场波动很大
- 事件风险临近
- 当前已经连续亏损几笔
- 自己状态不稳、疲劳、分心
- 这笔仓位与现有持仓高度相关

仓位缩小不代表看空自己，而是承认当前误差带更大。

## Step 7: when size becomes concentration risk
有时单笔仓位本身未必夸张，但组合层已经过度集中。

要警惕：
- 多个持仓本质上押的是同一方向
- 表面分散，实际高度相关
- 一旦市场风格切换，会一起受伤

所以仓位管理不只看单笔，还要看：
- 总暴露
- 行业集中度
- 主题集中度
- beta 集中度

如果多个仓位会一起出事，那它们在风险上就是一个大仓位。

## Step 8: signs I should cut size even before the stop
如果还没到硬止损，但出现以下情况，也要考虑主动减仓：
- 自己明显拿不稳
- 当前仓位已开始扭曲判断
- 市场环境突然显著恶化
- 事件临近而你不愿承受完整波动
- 仓位已经影响你执行其他决策

这不是软弱，而是在防止仓位先毁掉执行，再毁掉账户。

## Quick checklist
下单前快速过一遍：
- 这笔是核心仓还是进攻仓？
- 如果错了，我最多愿意损失多少？
- 这个仓位错掉后，会不会让我变形？
- 我是不是因为“很看好”就在放大仓位？
- 这笔和现有持仓加起来，会不会其实已经很集中？
- 我现在状态是否支持我拿这个仓位？

只要第 3 或第 4 问答不干净，就缩小。

## Minimal version for immediate use
下单前先问自己三句：
1. 这笔错了，我会不会难受到不愿认错？
2. 这笔仓位是在表达风险预算，还是在表达情绪？
3. 如果今天已经有类似暴露，我是不是又在堆同一种风险？

只要有一句答案不舒服，就减小仓位。

## Takeaway
好仓位的标准，不是赚的时候最爽，而是错的时候你仍然像平常一样执行。

真正成熟的仓位管理，核心不是“我看多准”，而是：
- 即使看错，我也不会被这一笔带偏
- 即使连续错，我也还能继续活在系统里

## Relations
- depends_on: [pre-trade-risk-checklist](/queries/pre-trade-risk-checklist), [when-not-to-trade](/queries/when-not-to-trade), [position-scaling-method](/queries/position-scaling-method), [investment-risk-control-framework](/concepts/investment-risk-control-framework), [leontraveller-trading-and-investment-system](/concepts/leontraveller-trading-and-investment-system)

