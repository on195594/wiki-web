---
title: Investment Risk Control Framework
created: 2026-04-17
updated: 2026-11-19
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
  - http://solnik.people.ust.hk/Articles/A6-JoFLongin.pdf
  - https://amoreira2.github.io/alan-moreira.github.io/VolPortfolios_published.pdf
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

**[推论] 基本面选股的账户归属与预期失效退出契约**：当投资者基于企业基本面分析（总入口见 [company-analysis-decision-map](/queries/company-analysis-decision-map)，含 [earnings-quality-and-cash-conversion](/concepts/company-analysis/earnings-quality-and-cash-conversion)、[balance-sheet-solvency-and-distress-risk](/concepts/company-analysis/balance-sheet-solvency-and-distress-risk)、[cyclical-earnings-normalization](/concepts/company-analysis/cyclical-earnings-normalization)、[growth-reinvestment-and-return-on-capital](/concepts/company-analysis/growth-reinvestment-and-return-on-capital)、[competitive-advantage-period-and-capital-allocation](/concepts/company-analysis/competitive-advantage-period-and-capital-allocation)、[free-cash-flow-and-valuation-basis](/concepts/company-analysis/free-cash-flow-and-valuation-basis) 与 [price-implied-expectations-analysis](/concepts/company-analysis/price-implied-expectations-analysis)）交易单家公司股票时，必须预先明确其账户层契约：
- 若划入**进攻仓**，基本面分析仅充当催化剂或基本面筛选器，入场、仓位规模（`1R`）与退出仍无条件服从价格/时间止损纪律，严禁在跌破止损后以“估值便宜、现金流好”为由就地转为长期死扛；
- 若事前配置方案允许将其划入**核心仓长期配置**，则须受单一个股集中度上限约束；不得在进攻仓止损触发后重新归类以逃避退出。买入前应书面记录支撑估值的可证伪基本面假设（如 ROIC 高于 WACC 的竞争壁垒、自由现金流转化率、隐含预期关键驱动）。核心仓不设短线窄幅价格止损，但必须设定**基本面失效退出条件（Thesis Stop）**：一旦后续定期财报证实核心盈利质量恶化、护城河受损或长期配置逻辑证伪，应按配置失效规则退出，不得在亏损后改写原假设来规避退出；同时应区分可预期的周期回落与长期价值受损，不能把正常周期波动自动判作永久失效。

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

### 强类型风控参数契约表（Single Source of Truth）

**[推论]** 下表汇总本框架的风控门禁，供下游决策与检查清单页面（`queries/`）引用；家庭参数及期限分桶由 [household-fund-layering-model](/concepts/household-fund-layering-model) 主维护，数量核算及工具适用限制由 [position-sizing-method](/queries/position-sizing-method) 主维护。这里不另设默认值，也不放宽原页约束。

| 参数符号 | 所属账户层 | 类型与定义域 | 规范定义与核算公式 | 刚性不变量与门禁约束（Invariants） |
| :--- | :--- | :--- | :--- | :--- |
| `T, H, L, D` | 家庭底盘 / 目标层 | $T, L > 0$, $H > 0$, $D \in (0, 1)$ | 目标金额 `T`、使用期限 `H`、最低流动性安全垫 `L`、目标池最大可承受回撤 `D`（见 [household-fund-layering-model](/concepts/household-fund-layering-model)） | 任何风险资产配置前须先足额留存 `L` 与近期刚性支出桶（$H \le 2$ 年）；禁止挪用目标层资金填补交易亏损 |
| `δ` | 核心仓（Core） | $\delta \in (0, 1)$，以权重小数表示（`0.05` = `5` 个百分点） | 核心仓大类资产实际权重 $w_i$ 偏离目标配置权重 $w_i^*$ 的触发带宽 | 采用日历+阈值混合再平衡时，在预定检查窗口且 $\lvert w_i - w_i^*\rvert \ge \delta$ 时触发调仓（优先用新增现金流/分红）；制度化定投、新增资金分配不以超带为前提；严禁临时篡改 $w_i^*$ 包装情绪摊平 |
| `E, r, B` | 进攻仓（Tactical） | $E > 0$, $r \in (0, 1)$, $B = E \times r$ | 账户当前净值 $E$、单笔风险预算率 `r` 与单笔最大计划风险金额 $B = E \times r$ | $B$ 是开仓前允许承担的计划止损上限，不是实际亏损保证上限（跳空与滑点可致实际亏损超限） |
| `N, d, 1R` | 进攻仓（Tactical） | $\ell > 0, q > 0, c \ge 0, d > 0$；止损距离为正且方向有效 | 仅适用于线性计价工具：$d = \lvert P_{\text{entry}} - P_{\text{stop}}\rvert q + c$；$\ell$ 为最小交易批量，$q$ 为换算到账户币种的点值，$c$ 为单位往返费用及滑点。数量上限 $N_{\max} = \ell\lfloor B/(\ell d)\rfloor$，实际成交数量 $N \le N_{\max}$，$1R = Nd$ | $N$ 必须是批量的整数倍，且受可用资金、保证金、杠杆和组合风险约束；不足一批则不开仓。无成交或初始风险为零不算 R 倍数；有成交时记录 $0 < 1R \le B$，该笔交易 R 倍数的分母保持不变；期权等非线性工具不能直接套用 |
| `R_open` | 进攻仓（Tactical） | $R_{\text{open}} \in (0, 1)$ | 对有效保护性止损的线性头寸，$\text{OpenRisk} = \frac{1}{E}\sum_k N_k(\lvert P_{\text{curr},k} - P_{\text{stop},k}\rvert q_k + c_{\text{exit},k})$ 的配置上限；$N_k$ 为绝对数量，$c_{\text{exit},k}$ 为单位预计剩余退出成本 | 以同一账户范围、币种的**当前净值 $E$**核算，**计入本次拟新增风险后**须满足 $\text{OpenRisk} < R_{\text{open}}$；不以其他头寸的浮盈抵扣，保本止损不等于零在途风险。无有效止损、止损已触发未成交或工具不适用时，不能按零风险放行；另查跳空与流动性压力 |
| `D_max` | 进攻仓 / 账户总览 | $D_{\max} \in (0, 1)$ | 触发进攻仓强制降档缩减 `r` 或暂停开新仓的账户回撤红线。当前回撤记为 $DD$，与家庭目标池的容忍度 `D` 区分；回本关系为 $G = DD/(1-DD)$ | 当当前回撤 $DD \ge D_{\max}$ 时停止开新仓并按预案降档；恢复条件须事前定义，重新满足回撤与在途风险门禁，不得仅因冷静期结束自动满仓重启 |

## Diversification, common drivers and stress checks

**来源与核对范围。** Markowitz（1952），《Portfolio Selection》，*The Journal of Finance* 7(1)，77–91，是现代均值—方差组合分析的原始文献。2026-11-14 核对出版信息；原论文 PDF 返回 403，未完成逐页核验。另实际读取作者 1990 年诺奖讲座《Foundations of Portfolio Theory》开头关于不确定性、组合整体风险、加权收益方差包含全部协方差项的段落及其 1952 年论文书目；**这支持以下原理，不冒充已读 1952 全文**。原论文细节仍待补核，未据此刷新整页验证日期。

**理论与恒等式。** 若权重为 $w_i$，各资产收益标准差为 $\sigma_i$，两两相关系数为 $\rho_{ij}$，则组合收益方差为

$$
\sigma_p^2 = \sum_i w_i^2\sigma_i^2 + 2\sum_{i<j}w_iw_j\sigma_i\sigma_j\rho_{ij}.
$$

这是加权随机变量的方差恒等式，不是组合收益或回撤的保证。分散化取决于收益的共同变动，而不只是证券数量；共同风险不会仅因增加高度同向的持仓就消失。均值—方差描述给定分布下的风险收益取舍，不等于极端亏损、违约和退出流动性的完整模型。

**本页推论：账户侧检查，不新增参数或交易动作。**

- 先辨共同经营驱动：不同公司、行业或市场可能共同暴露于同一商品价格、下游需求、信用/利率、汇率、客户或融资条件。列出驱动与方向，不能把“名字不同”当独立。
- 历史相关性只是样本估计。对期间、频率和状态变化保持敏感，比较正常期与压力期；压力中相关性可能上升或关系反转，不能假设一定不变，也不能无证据一律设成 1。
- 用有依据的压力情景检查共同需求下滑、原料/融资成本上升、回款变慢、相关头寸同时跳空或流动性收缩时的合计影响；不知道冲击大小就保留情景缺口，不编造相关矩阵或收益分布。不将该检查伪装成 1952 年论文给出的具体做法。

**三个风险量不可互换。** `r` 和按有效止损距离汇总的 `R_open` 是计划成交条件下的风险预算/估计，并非波动率；跳空、滑点和同时退出可能使实际损失更大。组合波动是特定期间/分布下收益离散程度，需要方差与协方差，不可把各止损风险相加叫组合波动。最大回撤是净值从历史峰值到之后低谷的路径损失；`D_max` 是采用者设定的可承受红线，不是按波动率算出的保证上限。低历史波动不保证低未来回撤，分散化也不保证止损按计划成交。原 `r / R_open / D_max / δ` 定义和边界保持不变。

### 非对称极端相关性（Longin & Solnik, 2001）与波动率管理组合边界（Moreira & Muir, 2017）

上述方差恒等式仍成立，但将静态样本估计外推到极端行情与时变波动率环境，面临两项关键实证约束（2026-11-15 在线核对两篇《Journal of Finance》原文）：

1. **熊市左尾相关性激增与正态尾部渐近独立假设的失效**：François Longin 与 Bruno Solnik（2001，*The Journal of Finance* 56(2)，649–676，[*Extreme Correlation of International Equity Markets*](http://solnik.people.ust.hk/Articles/A6-JoFLongin.pdf)）利用多变量极值理论（EVT，将超越阈值 $u$ 的尾部建模为广义帕累托分布 GPD 与 Gumbel 逻辑斯蒂依赖函数）检验了 1959–1996 年美、英、法、德、日五大股市的月度收益（456 个月）。理论上，若资产收益服从二元正态分布（且 $|\rho| < 1$），当单侧阈值 $u \to \infty$ 时，极端收益的条件相关性渐近收敛于 `0`。实证结果强烈拒绝了负尾（左尾）的多变量正态假设，而未拒绝正尾（右尾）假设：按最优尾部阈值估计，各国与美股在极端下跌尾部的平均相关性达 `0.505`，显著高于极端上涨尾部的 `0.124`（例如英美股市常规月度相关性为 `0.519`，在最优正尾阈值下为 `0.226`，而在最优负尾阈值下升至 `0.578`，负尾超越 `-10%` 阈值时达 `0.676`；美法负尾超越 `-10%` 阈值时高达 `0.845`）。作者指出，**驱动相关性上升的核心并非单纯的高波动率（大绝对收益），而是熊市下跌趋势本身**。
2. **时变波动率缩放（Volatility Scaling）的机制与实时局限**：Alan Moreira 与 Tyler Muir（2017，*The Journal of Finance* 72(4)，1611–1644，[*Volatility-Managed Portfolios*](https://amoreira2.github.io/alan-moreira.github.io/VolPortfolios_published.pdf)）考察了按上一月已实现方差倒数动态缩放风险敞口的组合 $f_{t+1}^{\sigma} = \frac{c}{\hat{\sigma}_t^2(f)}f_{t+1}$。由于短期波动率高度持续而预期超额收益未随方差同比例上升（即 $\operatorname{cov}(\mu_t/\sigma_t^2, \sigma_t^2) < 0$），在 1926–2015 年美股样本中，波动率管理市场组合产生了 `4.86%` 的年化 alpha（评估比率 `0.34`，夏普比率相对买入持有提升约 `25%`），并在 NBER 衰退期将市场 beta 从非衰退期的 `0.83` 降至 `0.32`（VAR 脉冲响应显示，面对 1 个标准差的方差冲击，均值—方差投资者最优敞口在冲击当期缩减约 `50%`）。但需注意样本内与样本外边界：原论文常数 $c$ 使用全样本标准差归一化；常数缩放本身不改变无约束、未计成本组合的夏普比率。**[推论]** 实时策略仍须只用当时可得数据确定规模，并另验杠杆、保证金、交易成本和样本外表现，不能把论文样本内指标直接当作可实现净收益。

**[推论]** 将这两项实证映射到本框架的风控规则：
- **单笔波动率/止损缩放不能替代组合尾部上限**：按止损距离核算单笔仓位 $N$ 针对计划止损风险，按近期波动率缩放敞口针对估计波动；二者并不等价，也不保证尾部损失受控，但在系统性熊市冲击下，多只原本低相关的股票或跨市场头寸可能同时触发左尾正相关跳空，导致实际合并损失突破按线性止损距离累加的 `R_open`；因此必须保留账户级回撤熔断 `D_max` 与跨头寸共同驱动压力检查。
- **区分核心仓定投/再平衡与进攻仓波动率收缩**：Moreira & Muir 的波动率择时针对的是因子/战术风险敞口，不否定普通投资者在留足安全垫 `L` 的前提下按 [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system) 执守长期股债配置；对主动进攻仓而言，可按事前风控方案在高波动或事件风险上升时缩减风险预算（见 [position-sizing-method](/queries/position-sizing-method) Step 6）；该论文并未直接检验本框架的止损仓位、回撤熔断或“衰退初期缩仓”规则，不能据此宣称这些规则在统计上普遍优于其他做法。

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
- related: [combining-two-investment-frameworks](/queries/combining-two-investment-frameworks), [leontraveller-vs-ordinary-investor-investment-system](/comparisons/leontraveller-vs-ordinary-investor-investment-system), [money-as-tool-and-investment-vs-consumption-framework](/concepts/money-as-tool-and-investment-vs-consumption-framework), [household-fund-layering-model](/concepts/household-fund-layering-model), [company-analysis-decision-map](/queries/company-analysis-decision-map), [free-cash-flow-and-valuation-basis](/concepts/company-analysis/free-cash-flow-and-valuation-basis), [earnings-quality-and-cash-conversion](/concepts/company-analysis/earnings-quality-and-cash-conversion), [balance-sheet-solvency-and-distress-risk](/concepts/company-analysis/balance-sheet-solvency-and-distress-risk), [growth-reinvestment-and-return-on-capital](/concepts/company-analysis/growth-reinvestment-and-return-on-capital), [competitive-advantage-period-and-capital-allocation](/concepts/company-analysis/competitive-advantage-period-and-capital-allocation), [cyclical-earnings-normalization](/concepts/company-analysis/cyclical-earnings-normalization), [price-implied-expectations-analysis](/concepts/company-analysis/price-implied-expectations-analysis), [pre-trade-risk-checklist](/queries/pre-trade-risk-checklist), [when-not-to-trade](/queries/when-not-to-trade), [inaction-vs-action-decision-framework](/queries/inaction-vs-action-decision-framework), [position-sizing-method](/queries/position-sizing-method), [position-scaling-method](/queries/position-scaling-method), [losing-position-review-method](/queries/losing-position-review-method), [winning-position-risk-management](/queries/winning-position-risk-management), [post-trade-review-loop](/queries/post-trade-review-loop), [repeat-mistake-detection-in-trading](/queries/repeat-mistake-detection-in-trading), [trading-lessons-to-hard-rules](/queries/trading-lessons-to-hard-rules), [minimal-executable-trading-system](/queries/minimal-executable-trading-system)

