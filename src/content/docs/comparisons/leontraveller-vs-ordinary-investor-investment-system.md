---
title: Leontraveller vs Ordinary Investor Investment System
created: 2026-04-17
updated: 2026-11-25
type: comparison
tags:
  - investment
  - comparison
  - trading
  - position-sizing
sources:
  - concepts/leontraveller-trading-and-investment-system.md
  - concepts/ordinary-investor-investment-system.md
  - docs:https://www.cambridge.org/core/journals/journal-of-financial-and-quantitative-analysis/article/behavioral-portfolio-theory/87E1D1AE8C8A8365B38CEA952EC28DF6
  - docs:https://en.wikipedia.org/wiki/Behavioral_portfolio_theory
  - https://web.stanford.edu/class/msande348/papers/PeroldSharpe.pdf
  - https://people.duke.edu/~charvey/Research/Published_Papers/P145_Strategic_rebalancing.pdf
status: stable
description: 结合行为投资组合理论（BPT-MA）与 Perold-Sharpe 恒定混合凹性/趋势凸性对偶，比较两套投资系统的心理账户分工、参数矩阵和冲突边界。
aliases:
  - leontraveller-vs-ordinary-investor
volatility: low
---

# Leontraveller vs Ordinary Investor Investment System

## Summary
这两页都反对情绪化投资，也都强调先有系统再做决策，但重心不同：[ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system) 更偏长期配置与普通人制度建设，[leontraveller-trading-and-investment-system](/concepts/leontraveller-trading-and-investment-system) 更偏主动交易、趋势跟随与回撤控制。

## Shared ground
两者重合度最高的地方有四个：
- 投资不能靠情绪和临场感觉
- 系统比单次判断更重要
- 行为失控是亏损的重要来源
- 风险控制比追求短期暴利更重要

也就是说，它们都反对“拍脑袋投资”。

## Main difference in one sentence
- Ordinary Investor：先搭长期制度，再谈资产与执行
- Leontraveller：先尊重市场价格，再用纪律做主动交易

## Difference 1: starting point
[ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system) 的起点是“你是谁”：
- 目标
- 能力圈
- 风险承受能力
- 资产配置
- 再平衡制度

[leontraveller-trading-and-investment-system](/concepts/leontraveller-trading-and-investment-system) 的起点则更像“市场现在怎么走”：
- 趋势是否形成
- 价格行为是否强势
- 对手盘与卖压结构如何
- 现在出手是否有正期望

前者是 investor-centered，后者是 market-centered。

## Difference 2: main source of return
Ordinary Investor 认为长期回报主要来自：
- 基本面增长
- 复利
- 资产配置
- 再平衡
- 低成本、少犯错

Leontraveller 认为可操作 alpha 更主要来自：
- 趋势跟随
- 价格行为
- 强势结构
- 纪律执行
- 止损与低回撤

前者强调“制度带来的长期收益”，后者强调“执行带来的交易优势”。

## Difference 3: attitude toward FA and TA
Ordinary Investor 对基本面、经济周期、企业盈利与长期回报机制更重视。

Leontraveller 明显更偏 TA：
- 认为个体难在 FA 上胜过机构
- 认为价格与成交量是最直接决策接口
- 对创新高、浅回调、支撑阻力和趋势结构更敏感

所以两者并不是简单冲突，而是时间尺度和操作目标不同。

## Difference 4: who each framework fits
Ordinary Investor 更适合：
- 主业繁忙、没有太多盯盘时间的人
- 希望长期稳步积累资产的人
- 更偏被动投资和制度化执行的人

Leontraveller 更适合：
- 愿意做主动交易的人
- 接受频繁小亏、追求低回撤正期望的人
- 能执行止损、时间止损和仓位纪律的人

如果没有交易纪律，直接照搬 Leontraveller 往往会变形；如果只想做被动长期投资，Ordinary Investor 的适配度更高。

## Difference 5: biggest risk of misuse
误用 Ordinary Investor，常见风险是：
- 把“长期主义”误用成死扛
- 只讲配置，不管执行
- 把再平衡理解成任何下跌都继续加仓

误用 Leontraveller，常见风险是：
- 把趋势交易做成追涨杀跌
- 只学 TA 外壳，不学止损与仓位纪律
- 把“尊重市场”误用成过度短线化

## How they can be combined
更实用的做法不是二选一，而是分层结合：
- 用 Ordinary Investor 管核心仓与长期制度
- 用 Leontraveller 管进攻仓与交易纪律

组合后的结构大致是：
1. 先按 Ordinary Investor 建立资产配置与再平衡制度
2. 再从总资金里切出小部分，按 Leontraveller 规则做主动交易
3. 用核心仓保证长期复利底盘
4. 用进攻仓争取额外 alpha，但不影响整体生存

### 行为投资组合理论（BPT-MA）与双层参数化分工矩阵

Hersh Shefrin 与 Meir Statman 在 [《Behavioral Portfolio Theory》（JFQA, 2000）](https://www.cambridge.org/core/journals/journal-of-financial-and-quantitative-analysis/article/behavioral-portfolio-theory/87E1D1AE8C8A8365B38CEA952EC28DF6) 及 [行为投资组合理论综述](https://en.wikipedia.org/wiki/Behavioral_portfolio_theory) 中提出的多心理账户模型（BPT-MA，源于 Lola Lopes 1987 的 SP/A 安全—潜力/抱负理论与 Roy 安全第一准则）为两套系统的分层组合提供了理论解释：真实投资者并非在单一均值—方差账户上做全局协方差优化，而是将财富划分为**底层安全保障账户**（防范财务灾难、保障底线目标）与**上层潜力进取账户**（在受控预算内博取正偏态超额回报）。

**[推论]** 对照 [household-fund-layering-model](/concepts/household-fund-layering-model) 与 [investment-risk-control-framework](/concepts/investment-risk-control-framework)，可将两套框架映射为互不越界的参数化双层结构（参数无仓库默认值，由采用者在私有载体中维护）：

| 对比维度 | Ordinary Investor（核心仓 / BPT 安全与底盘层） | Leontraveller（进攻仓 / BPT 潜力与主动层） |
| :--- | :--- | :--- |
| **核心职责与目标** | 在独立保障家庭流动性安全垫 `L` 的前提下，匹配目标金额 `T` 与期限 `H` 进行长期配置；核心仓仍有市场风险 | 在不影响核心仓生存的前提下，顺势捕捉正偏态价格趋势与主动交易 alpha |
| **控制变量与门禁** | 目标配置权重、可接受最大回撤 `D`、重平衡触发带宽 `δ`（如偏离目标权重若干百分点） | 单笔风险预算率 `r`（确定计划初始风险 $1R$）、总名义敞口上限 `G_max`、同驱动簇上限 `R_cluster`、组合在途总风险上限 `R_open`、账户回撤停手红线 `D_max` |
| **下跌时的合法动作** | 按既定定投/新增现金流计划配置；采用混合再平衡时，在检查窗口达到带宽 `δ` 才调仓（优先使用新增现金流或分红），禁止临时改计划摊平 | 严禁逆势摊平亏损仓位；触及价格止损、时间止损或结构失效条件时无条件认错退出 |
| **认知偏差防御重点** | 防御高位追涨申购、低位恐慌赎回与无配置裸奔 | 防御左侧抄底、与市场争辩（argue）、回本执念（Get-even-itis）与超仓硬扛 |

证据边界：BPT-MA 是对投资者分层心理账户行为的描述性建模，本身不证明某种分仓比例或主动交易策略能跑赢均值—方差最优组合或市场基准；具体日常分流与越界阻断规则见 [combining-two-investment-frameworks](/queries/combining-two-investment-frameworks)。

### 动态资产配置收益凹凸对偶：为什么两套系统在跨行情状态上互补（Perold & Sharpe, 1988）

从资产定价几何结构看，两套框架恰好对应 André F. Perold 与 William F. Sharpe（1988，[*Dynamic Strategies for Asset Allocation*](https://web.stanford.edu/class/msande348/papers/PeroldSharpe.pdf)）定义的风险资产持有额方程 $E_{\text{risk}} = m(A - F)$（$A$ 为总资产，$F$ 为底线，$m$ 为乘数；下标区分风控契约中的账户净值 $E$）中两类对偶策略：
- **Ordinary Investor（恒定混合 Constant-Mix，$F = 0, 0 < m < 1$）具有凹性收益曲线（Concave Payoff）**：通过逆势再平衡（涨卖跌买）向市场提供流动性，在均值回归与宽幅震荡行情（两期相对超额收益异号 $\kappa_1\kappa_2 < 0$）中赚取再平衡溢价，但在跨月持续单边崩盘中会因逆势加仓风险资产而承受额外回撤损耗（[Rattray 等, 2020](https://people.duke.edu/~charvey/Research/Published_Papers/P145_Strategic_rebalancing.pdf)）。
- **Leontraveller（趋势跟随与止损保护，近似 CPPI 结构 $F > 0, m > 1$）具有凸性收益曲线（Convex Payoff）**：通过“顺势持有/加码、跌破止损砍仓”向市场购买流动性，在无趋势震荡市中持续支付小额止损磨损（Whipsaw Cost），换取在极端单边趋势与持续危机中的截断保护与正偏态右尾爆发。

**[推论]** 将大资金底盘交给恒定混合凹性系统收集长期风险溢价，将严格受 `G_max / R_cluster / R_open / D_max` 隔离的小比例进攻资金交给趋势凸性系统，实质是在“均值回归状态”与“持续趋势/危机状态”之间做了跨制度收益结构对冲；但若在同一个仓位上“盈利时按恒定混合早早卖掉、亏损时放弃趋势止损死扛摊平”，就会把两套系统最坏的一侧拼成负期望的倒置凹曲线。

## Final judgment
如果只能保留一页给大多数普通人，优先保留 [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system)；
如果已经确定要做主动交易，则必须补上 [leontraveller-trading-and-investment-system](/concepts/leontraveller-trading-and-investment-system)。

一句话收束：
- Ordinary Investor 解决“钱怎么长期长大”
- Leontraveller 解决“主动交易时怎么少犯大错”

## Relations
- depends_on: [leontraveller-trading-and-investment-system](/concepts/leontraveller-trading-and-investment-system), [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system)
- related: [investment-risk-control-framework](/concepts/investment-risk-control-framework), [combining-two-investment-frameworks](/queries/combining-two-investment-frameworks), [household-fund-layering-model](/concepts/household-fund-layering-model)

