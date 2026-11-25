---
title: Position Sizing by Risk Budget
created: 2026-04-17
updated: 2026-11-25
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
  - queries/tactical-trading-execution-decision-map.md
  - concepts/investment-risk-control-framework.md
  - concepts/leontraveller-trading-and-investment-system.md
  - docs:https://vantharpinstitute.com/tools/position-sizing-calculator/
  - https://www.princeton.edu/~wbialek/rome/refs/kelly_56.pdf
  - https://gwern.net/doc/statistics/decision/2006-thorp.pdf
  - https://econpapers.repec.org/RePEc:bla:mathfi:v:3:y:1993:i:3:p:241-276
  - https://arxiv.org/pdf/1603.06183
status: stable
description: 回答如何根据风险预算、1R 单位风险、固定比例公式、Thorp (2006) 连续分数凯利定律与回撤约束模型决定单笔仓位大小。
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

以下公式基于 [Van Tharp 固定比例风险与 R 倍数框架](https://vantharpinstitute.com/tools/position-sizing-calculator/)、[J. L. Kelly Jr. (1956) 信息率与对数增长率原始论文](https://www.princeton.edu/~wbialek/rome/refs/kelly_56.pdf)、[Edward O. Thorp (2006) 连续与分数凯利推导](https://gwern.net/doc/statistics/decision/2006-thorp.pdf)、[Grossman & Zhou (1993) 回撤约束投资组合定理](https://econpapers.repec.org/RePEc:bla:mathfi:v:3:y:1993:i:3:p:241-276) 及 [Busseti, Ryu & Boyd (2016) 风险约束凯利模型](https://arxiv.org/pdf/1603.06183) 整理，作为进攻仓的定量核算基准（核心仓按目标配置权重与再平衡带管理，不套用单笔止损公式）：

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
3. **凯利判据（Kelly Criterion）、连续分数凯利三定律与回撤约束边界**：
   - **离散二元赔率与连续高斯扩散模型**：在独立二元固定赔率模型（获胜概率 $W \in [0, 1]$、净赔率 $b > 0$）下，[Kelly (1956)](https://www.princeton.edu/~wbialek/rome/refs/kelly_56.pdf) 给出最大化对数财富增长率的下注比例 $f^* = W - \frac{1 - W}{b}$（当 $f^* \le 0$ 时不下注）。在连续时间几何布朗运动（瞬时算术漂移率 $m$、无风险利率 $r_f$、瞬时方差率 $s^2$，无杠杆几何增长率 $g_{\infty}(1) = m - s^2/2$，且假设连续无摩擦调仓、借贷同率无跳空）近似下，[Thorp (2006)](https://gwern.net/doc/statistics/decision/2006-thorp.pdf) 给出最优杠杆比例与最大渐近超额对数增长率：
     $$f^* = \frac{m - r_f}{s^2}, \qquad g_{\infty}(f^*) - r_f = \frac{(m - r_f)^2}{2s^2} = \frac{\text{SR}^2}{2}$$
   - **分数凯利（$f = c f^*, 0 < c < 2$）的精确前提与过量下注惩罚**：令实际仓位为全凯利的 $c$ 倍，在连续扩散近似下：（a）保留的**超额**对数增长率比例恒为 $\frac{g_{\infty}(cf^*) - r_f}{g_{\infty}(f^*) - r_f} = c(2 - c)$；（b）组合对数收益方差比例恒降为 $c^2$；（c）在 $r_f = 0$（或等价地对按无风险利率贴现后的相对财富 $\tilde{V}(t) \equiv V(t)e^{-r_f t}$ 而言，见 Thorp 2006 式 7.7–7.13）条件下，未来任意时刻跌破**固定初始本金 $V_0$** 的比例 $x \in (0, 1)$ 的概率为 $\Pr\!\left[\inf_{t \ge 0} \frac{\tilde{V}(t)}{V_0} \le x\right] = x^{\frac{2}{c} - 1}$（若 $r_f > 0$ 且考察名义财富 $V(t)/V_0$，式 7.8 给出指数增大为 $\frac{2}{c} - 1 + \frac{2 r_f s^2}{c^2(m - r_f)^2}$；注意 $V_0$ 为固定起算本金而非无限期滚动历史峰值 $M_t$）。据此，在零利率或相对无风险资产基准下，全凯利（$c = 1$）跌破初始本金一半（$x = 0.5$）的概率高达 `50%`；**半凯利（Half-Kelly，$c = 0.5$）仅承担 `25%` 的方差、保留 `75%` 的最优超额增长率，并将相对初始本金腰斩的概率压低至 `12.5%`**；一旦高估真实漂移率导致实际下注超过两倍凯利（$c > 2$），渐近**超额**对数增长率 $g_{\infty}(cf^*) - r_f$ 将严格转负（跑输无风险资产，若继续越过总增长零根 $f_+ > 2f^*$ 则名义本金渐近归零）。
   - **滚动峰值回撤约束与凸优化扩展**：针对路径上从任意滚动历史最高净值 $M_t = \sup_{u \le t} W_u$ 计算的最大回撤约束，[Grossman & Zhou (1993)](https://econpapers.repec.org/RePEc:bla:mathfi:v:3:y:1993:i:3:p:241-276) 证明在财富不得跌破 $\alpha M_t$（最大允许回撤 $1-\alpha$）条件下，最优风险敞口与当前回撤缓冲垫 $W_t - \alpha M_t$ 成正比；[Busseti, Ryu & Boyd (2016)](https://arxiv.org/pdf/1603.06183) 进一步将风险厌恶参数 $\lambda > 0$ 引入凸约束 $\mathbb{E}[(r^T b)^{-\lambda}] \le 1$（Risk-Constrained Kelly；在连续扩散极限下对应 $\lambda = \frac{2}{c} - 1$ 的回撤风险厌恶），在离散分布、肥尾与参数估计不确定性下显式控制回撤风险。真实交易存在样本外漂移衰减与非高斯跳空，对样本不足或主观裁量交易不套用凯利公式放大仓位。
4. **公式适用限制（名义敞口上限 `G_max`、同驱动簇上限 `R_cluster` 与跳空风险）**：
   - 固定比例公式假设价格在触及 $P_{\text{stop}}$ 时能按计划成交；若设置极窄初始止损（$|P_{\text{entry}} - P_{\text{stop}}|$ 很小），公式会推算出极大的名义股数 $N$，一旦遭遇财报、宏观事件或流动性枯竭引发的隔夜跳空缺口（Gap Risk），实际亏损将远超 $1R$。因此按 [investment-risk-control-framework](/concepts/investment-risk-control-framework) 的强类型契约，最终仓位须同时满足组合总名义敞口上限 `G_max`、所属共同驱动簇在途风险上限 `R_cluster` 与组合总在途风险上限 `R_open`。

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
- depends_on: [investment-risk-control-framework](/concepts/investment-risk-control-framework), [leontraveller-trading-and-investment-system](/concepts/leontraveller-trading-and-investment-system)
- related: [tactical-trading-execution-decision-map](/queries/tactical-trading-execution-decision-map), [pre-trade-risk-checklist](/queries/pre-trade-risk-checklist), [when-not-to-trade](/queries/when-not-to-trade), [position-scaling-method](/queries/position-scaling-method), [winning-position-risk-management](/queries/winning-position-risk-management), [post-trade-review-loop](/queries/post-trade-review-loop)

