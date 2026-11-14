---
title: Investment Risk Control Framework
created: 2026-04-17
updated: 2026-11-14
type: concept
tags:
  - investment
  - governance
  - risk-control
sources:
  - concepts/leontraveller-trading-and-investment-system.md
  - concepts/ordinary-investor-investment-system.md
  - docs:https://vantharpinstitute.com/tools/position-sizing-calculator/
  - docs:https://blog.traderspost.io/article/kelly-criterion-position-sizing-automated-trading
  - docs:https://investor.vanguard.com/investor-resources-education/portfolio-management/rebalancing-your-portfolio
  - https://buildingarks.files.wordpress.com/2014/06/dynamics-of-leveraged-etfs-bgi-2009.pdf
  - https://doi.org/10.1111/j.1540-6261.1952.tb01525.x
  - https://www.nobelprize.org/uploads/2018/06/markowitz-lecture.pdf
status: stable
description: 汇总可参数化的长期配置、主动交易、回撤恢复双曲方程、杠杆 ETF 二次方方差损耗边界与行为纪律运行规则。
aliases:
  - investment-operating-rules
  - personal-investment-operating-rules
volatility: low
---

# Investment Risk Control Framework

## Summary
这一页把 [leontraveller-trading-and-investment-system](/concepts/leontraveller-trading-and-investment-system) 的交易纪律，与 [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system) 的长期系统观，压缩成可跨账户参数化的风险控制框架。它不保存真实账户、持仓或交易记录。

证据边界：内容用于教育和流程设计，不构成投资建议；任何阈值都应由采用者按法规、目标、期限和风险承受能力重新验证。

## Core principle
先保护本金，再争取收益；先做配置，再做进攻；先定义规则，再做判断。

## Account structure
把账户分成两个层次：
- 核心仓：以 ETF / 大类资产配置为主，承担长期复利任务
- 进攻仓：只用小部分资金做趋势交易或个股 alpha

这样做的目的不是追求绝对最优，而是把“长期增长”和“主动出击”从心理上、资金上、规则上分开。

## Non-negotiable rules
以下规则默认不可破：
- 不借钱投机
- 不碰看不懂收益来源的结构化产品
- 不用情绪补仓替代原有计划，也不混用核心仓与进攻仓规则
- 不在没有预设风险预算、仓位和适用退出条件的情况下开仓
- 不把主账户变成高波动试验田

适用范围：进攻仓遵守下文的趋势、禁止摊平和止损纪律；核心仓按既定配置、再平衡与配置失效条件执行，不统一强加价格或时间止损。制度化再平衡可能买入下跌资产，但不能临时改目标权重或风险上限来包装情绪摊平；分层裁决见 [combining-two-investment-frameworks](/queries/combining-two-investment-frameworks)。

## Core account rules
核心仓只做几件事：
- 根据目标、期限和风险承受能力做资产配置
- 用再平衡而不是情绪做买卖
- 控制费用、换手和不必要交易
- 在看不懂市场阶段时，优先少动而不是乱动

核心仓关注的是：
- 长期复利
- 大回撤控制
- 行为稳定
- 持续可执行

## Tactical account rules
进攻仓不抄底、不摊平亏损仓位，也不因为“觉得便宜”就买弱势标的；没有预设止损和仓位就不开仓。

进攻仓只在以下条件更清楚时行动：
- 趋势已经出现，而不是仅凭主观预测
- 结构强，最好是创新高或浅回调后的延续
- 盈亏比和胜率至少有一个占优，而不是两头都幻想完美
- 入场前已经定义仓位、价格止损、时间止损和失效条件

进攻仓的要求是：
- 少做
- 做自己看得懂的 setup
- 亏得快而小
- 对了就尽量拿住

## Entry rules
每次买入前先回答四个问题：
1. 买入对象属于长期配置资产，还是主动交易标的？
2. 现在的理由是基于趋势/系统，还是基于情绪/想象？
3. 退出或调整条件是什么？核心仓按再平衡或配置失效条件；进攻仓预设价格止损、时间止损和结构失效条件。
4. 若该笔交易触发止损，是否会影响后续继续执行系统？

只要有一个问题答不上来，就不下单。

## Exit rules
卖出不靠感觉，靠预先定义的情形：
- 核心仓：到再平衡点、配置逻辑失效、或资产属性发生变化
- 进攻仓：止损触发、时间止损触发、趋势结构破坏、或达到既定退出计划

对进攻仓尤其重要：
- 盈利后主动上移止损
- 不把浮盈硬拿成亏损
- 交易失效后立即退出，不和市场争辩

## Product filter
默认回避以下东西，除非自己确实理解结构与风险：
- 2x / 3x 杠杆 ETF
- 伪分红衍生品
- 复杂多腿 options 策略
- 高分红但靠侵蚀 NAV 维持分配的产品
- 流动性差、条款复杂的品种

一句话标准：
收益怎么来的讲不清楚，就当成不该碰。

### 杠杆 ETF 的路径依赖与二次方方差损耗（Cheng & Madhavan, 2009）

Minder Cheng 与 Ananth Madhavan（2009，[*The Dynamics of Leveraged and Inverse Exchange-Traded Funds*](https://buildingarks.files.wordpress.com/2014/06/dynamics-of-leveraged-etfs-bgi-2009.pdf)）分析了每日重置杠杆的复利路径依赖。忽略费用、融资成本与跟踪误差时，每日收益为 $r_d$ 的产品满足 $A_N/A_0=\prod_{d=1}^N(1+kr_d)$，并不等于底层累计收益的 $k$ 倍。

在连续重平衡近似下，若 $dS_t/S_t=\mu\,dt+\sigma\,dW_t$、$\mu$ 与 $\sigma$ 为常数且 $t$ 以年计，则：

$$A_t = A_0 \left(\frac{S_t}{S_0}\right)^k \exp\!\left(-\frac{1}{2}k(k-1)\sigma^2 t\right), \qquad \frac{1}{t}\mathbb{E}\!\left[\ln\!\left(\frac{A_t}{A_0}\right)\right] = k\mu - \frac{1}{2}k^2\sigma^2$$

**[推论]** 两个方差项使用不同参照，不能作为两笔损耗叠加：
1. **期望对数增长率中的方差拖累**为 $-\frac{1}{2}k^2\sigma^2$；$2\times$ 与 $3\times$ 的该项分别为 $1\times$ 的 4 倍与 9 倍，但漂移项也随 $k$ 改变。
2. **相对底层累计毛收益的 $k$ 次幂的路径修正**为 $-\frac{1}{2}k(k-1)\sigma^2t$。若在上述近似中一年后 $S_t=S_0$、$\sigma=30\%$，则 $3\times$ 净值为 $e^{-0.27}A_0$，亏损约 `23.7%`。另设 $\mu=0$ 时，期望对数收益为 $-0.405$；其指数对应几何平均净值约 $0.667A_0$，不能将 `33.3%` 当作“指数回到原点”条件下的另一损失端点，也不是期望简单收益亏损。

实际每日重置产品不严格满足连续模型等式。路径依赖不意味着所有长期区间都亏损；强趋势可能抵消方差拖累。**[推论]** 本框架默认不将这类工具视为普通指数基金的长期被动替代品，具体风险仍需结合重置频率、行情路径、融资和费用评估。

## Risk framework
风险管理优先级：
1. 避免致命亏损
2. 控制年度回撤
3. 控制单笔仓位
4. 控制连续错误时的净值损伤
5. 最后才是提高收益率

这意味着：
- 大亏一次，往往会抹掉很多次小赚：设账户回撤比例为 $D \in (0, 1)$，恢复至初始净值所需的后续收益率为 $G = \frac{D}{1 - D}$（例如回撤 `20%` 需上涨 `25%` 回本，回撤 `50%` 需上涨 `100%` 回本，回撤 `80%` 则需上涨 `400%`）；回撤越深，回本所需收益率按该双曲函数凸性上升，并在 $D\to1$ 时发散，而非指数函数
- 好系统首先要能连续活下去
- 收益率高但回撤失控，不算真正可用系统

## Parameterized risk-control variables

[推论] 以下参数将本页风控原则与 [Van Tharp 固定比例风险模型](https://vantharpinstitute.com/tools/position-sizing-calculator/)、[凯利判据风险边界](https://blog.traderspost.io/article/kelly-criterion-position-sizing-automated-trading) 及 [Vanguard 组合再平衡框架](https://investor.vanguard.com/investor-resources-education/portfolio-management/rebalancing-your-portfolio) 结合为可配置模板，与其余 LifeOS 领域模型对齐。参数无仓库默认值，由采用者在私有载体中维护：

- **单笔风险预算率 `r`**：进攻仓单笔交易的计划止损损失占账户净值比例，给出风险预算 $B = E \times r$，不是实际亏损保证上限；初始风险单位 $1R$ 按最终数量与初始止损的实际计划风险记录且不得超过 $B$（数量核算与适用限制见 [position-sizing-method](/queries/position-sizing-method)）；
- **组合在途总风险上限 `R_open`**：从当前净值出发，各未平仓进攻头寸按现价至有效止损的距离、数量、点值和预计退出成本计算，再将非负风险相加并除以当前净值；不以其他头寸相对买入成本的浮盈抵扣。实际计算值须低于配置上限 `R_open`，不能把保本止损记成零在途风险：例如多仓成本 100、现价 120、止损 100，每股仍有约 20 的净值回吐风险。该指标仅是按计划成交的风险估计，另需评估跳空、相关性和流动性压力；上移止损释放部分预算并不自动允许加仓；
- **最大可承受回撤阈值 `D_max`**：触发进攻仓强制降档缩仓或暂停交易的账户回撤红线（受 $G = \frac{D}{1 - D}$ 非线性回本成本约束）；
- **核心仓偏离重平衡带宽 `δ`**：核心仓大类资产实际权重偏离目标配置的触发阈值（如偏离目标权重 `±5` 个百分点，而非相对变动 `±5%`；机构目标带不可直接照搬，结合定期检查窗口执行，见 [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system)）。

## Diversification, common drivers and stress checks

**来源与核对范围。** Markowitz（1952），《Portfolio Selection》，*The Journal of Finance* 7(1)，77–91，是分散化与均值—方差组合分析的原始文献。2026-11-14 核对出版信息；原论文 PDF 返回 403，未完成逐页核验。另实际读取作者 1990 年诺奖讲座《Foundations of Portfolio Theory》开头关于不确定性、组合整体风险、加权收益方差包含全部协方差项的段落及其 1952 年论文书目；**这支持以下原理，不冒充已读 1952 全文**。原论文细节仍待补核，未据此刷新整页验证日期。

**理论与恒等式。** 若权重为 $w_i$，各资产收益标准差为 $\sigma_i$，两两相关系数为 $\rho_{ij}$，则组合收益方差为

$$
\sigma_p^2 = \sum_i w_i^2\sigma_i^2 + 2\sum_{i<j}w_iw_j\sigma_i\sigma_j\rho_{ij}.
$$

这是加权随机变量的方差恒等式，不是组合收益或回撤的保证。分散化取决于收益的共同变动，而不只是证券数量；共同风险不会仅因增加高度同向的持仓就消失。均值—方差描述给定分布下的风险收益取舍，不等于极端亏损、违约和退出流动性的完整模型。

**本页推论：账户侧检查，不新增参数或交易动作。**

- 先辨共同经营驱动：不同公司、行业或市场可能共同暴露于同一商品价格、下游需求、信用/利率、汇率、客户或融资条件。列出驱动与方向，不能把“名字不同”当独立。
- 历史相关性只是样本估计。对期间、频率和状态变化保持敏感，比较正常期与压力期；压力中相关性可能上升或关系反转，不能假设一定不变，也不能无证据一律设成 1。
- 用有依据的压力情景检查共同需求下滑、原料/融资成本上升、回款变慢、相关头寸同时跳空或流动性收缩时的合计影响；不知道冲击大小就保留情景缺口，不编造相关矩阵或收益分布。不将该检查伪装成 1952 年论文给出的具体做法。

**三个风险量不可互换。** `r` 和按有效止损距离汇总的 `R_open` 是计划成交条件下的风险预算/估计，并非波动率；跳空、滑点和同时退出可能使实际损失更大。组合波动是特定期间/分布下收益离散程度，需要方差与协方差，不可把各止损风险相加叫组合波动。最大回撤是净值从历史峰值到之后低谷的路径损失；`D_max` 是采用者设定的可承受红线，不是按波动率算出的保证上限。低历史波动不保证低未来回撤，分散化也不保证止损按计划成交。原 `r / R_open / D_max / δ` 定义和边界保持不变，不在企业分析方法卡目录挂载组合风控。

## Behavioral rules
需要持续防守的不是市场，而是自己：
- 不用 hindsight 神化过去机会
- 不因为“这次特别像机会”就放大仓位
- 不用“基本面很好”当作持有弱势标的的借口
- 不因短期赚钱就认为系统已被证明
- 不因短期亏钱就连续改规则

## Weekly review checklist
每周只复盘这几项：
- 有没有违反不可破规则
- 核心仓是否偏离目标配置过多
- 进攻仓的亏损是否都可解释、可承受
- 是否出现情绪驱动交易
- 当前回撤是否仍在系统可承受范围内

## Takeaway
真正适合长期执行的投资风控系统，不是“最聪明”的系统，而是：
- 能保护本金
- 能穿越情绪波动
- 能在工作与家庭节奏下长期坚持
- 能把配置和交易分开处理

## Relations
- depends_on: [leontraveller-trading-and-investment-system](/concepts/leontraveller-trading-and-investment-system), [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system)
- related: [combining-two-investment-frameworks](/queries/combining-two-investment-frameworks), [leontraveller-vs-ordinary-investor-investment-system](/comparisons/leontraveller-vs-ordinary-investor-investment-system), [money-as-tool-and-investment-vs-consumption-framework](/concepts/money-as-tool-and-investment-vs-consumption-framework), [household-fund-layering-model](/concepts/household-fund-layering-model), [pre-trade-risk-checklist](/queries/pre-trade-risk-checklist), [when-not-to-trade](/queries/when-not-to-trade), [inaction-vs-action-decision-framework](/queries/inaction-vs-action-decision-framework), [position-sizing-method](/queries/position-sizing-method), [position-scaling-method](/queries/position-scaling-method), [losing-position-review-method](/queries/losing-position-review-method), [winning-position-risk-management](/queries/winning-position-risk-management), [post-trade-review-loop](/queries/post-trade-review-loop), [repeat-mistake-detection-in-trading](/queries/repeat-mistake-detection-in-trading), [trading-lessons-to-hard-rules](/queries/trading-lessons-to-hard-rules), [minimal-executable-trading-system](/queries/minimal-executable-trading-system)

