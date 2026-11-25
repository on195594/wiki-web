---
title: 主动交易执行与复盘决策地图
created: 2026-11-25
updated: 2026-11-25
type: query
tags:
  - investment
  - trading
  - decision
  - risk-control
  - workflow
sources:
  - concepts/investment-risk-control-framework.md
  - concepts/leontraveller-trading-and-investment-system.md
  - concepts/ordinary-investor-investment-system.md
  - queries/combining-two-investment-frameworks.md
  - queries/pre-trade-risk-checklist.md
  - queries/when-not-to-trade.md
  - queries/inaction-vs-action-decision-framework.md
  - queries/position-sizing-method.md
  - queries/position-scaling-method.md
  - queries/losing-position-review-method.md
  - queries/winning-position-risk-management.md
  - queries/post-trade-review-loop.md
  - queries/repeat-mistake-detection-in-trading.md
  - queries/trading-lessons-to-hard-rules.md
  - queries/minimal-executable-trading-system.md
  - queries/company-analysis-decision-map.md
  - https://gwern.net/doc/statistics/decision/2006-thorp.pdf
  - https://www.smallake.kr/wp-content/uploads/2017/02/When_Do_Stop-Loss_Rules_Stop_Losses.pdf
  - https://faculty.haas.berkeley.edu/odean/papers%20current%20versions/areinvestorsreluctant.pdf
  - https://www.davidhbailey.com/dhbpapers/deflated-sharpe.pdf
status: stable
description: 按四阶段交易生命周期（开仓前分流与停手门禁、仓位核算与顺势分层、持仓处置效应防御与止损有效域、盘后 R 倍数复盘与规则修剪）路由 11
  篇主动交易查询页的总入口。
aliases:
  - tactical-trading-decision-map
  - active-trading-execution-map
  - 交易执行决策地图
volatility: low
verified_at: 2026-11-25
review_by: 2027-11-25
---

# 主动交易执行与复盘决策地图

## Summary

本页把 `queries/` 下与主动交易执行、仓位管理、持仓处置及盘后复盘相关的 11 篇问题导向页面组织为统一检索入口，与面向个股尽调的 [company-analysis-decision-map](/queries/company-analysis-decision-map) 形成“基本面研究入口 vs. 交易执行入口”的对称分工。它回答两个核心问题：**一笔主动交易从动念到复盘应按什么生命周期顺序过门禁？遇到特定仓位、止损或复盘问题时，应优先调用哪一页？**

公开与证据边界：本页仅汇总可复用的风险控制与决策路由规则，不包含任何真实账户、持仓或交易记录，也不构成投资建议；所有风控参数定义域与刚性约束以 [investment-risk-control-framework](/concepts/investment-risk-control-framework) 的强类型参数契约表为单一事实源。

## 使用边界

- 本地图主要面向进攻仓（Tactical Layer）的趋势跟随与主动交易执行；核心仓（Core Layer）的长期大类资产配置与定期再平衡由 [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system) 主导，两者分流裁决先看 [combining-two-investment-frameworks](/queries/combining-two-investment-frameworks)。
- 风险门禁与流程合规是降低毁灭性回撤的必要工程约束，但不自动赋予任何交易策略正数学期望；若标的涉足单家公司基本面催化，须配合 [company-analysis-decision-map](/queries/company-analysis-decision-map) 区分短期交易止损契约与长期配置失效条件（Thesis Stop）。

## 四阶段交易执行与复盘生命周期

`[综合]` 完整的主动交易闭环按时间与状态顺序分为四个阶段，新开仓或增险订单须先通过前两阶段；已有持仓的止损、减险与盘后复盘不受开仓门禁阻断：

| 阶段 | 核心裁决问题 | 主调用页面 | 刚性门禁与阻断条件 |
| :--- | :--- | :--- | :--- |
| **第一阶段：账户分流与停手门禁** | 当前资金归属核心仓还是进攻仓？是否存在情绪驱动、越权摊平或应当保持条件化等待的情形？ | [combining-two-investment-frameworks](/queries/combining-two-investment-frameworks) · [pre-trade-risk-checklist](/queries/pre-trade-risk-checklist) · [when-not-to-trade](/queries/when-not-to-trade) · [inaction-vs-action-decision-framework](/queries/inaction-vs-action-decision-framework) | 仅对新开仓或增加风险的订单检查门禁：账户当前回撤 $DD \ge D_{\max}$、缺乏预设退出条件，或拟成交后的组合在途风险 $\text{OpenRisk} \ge R_{\text{open}}$、同驱动簇风险超 `R_cluster`、总名义敞口超 `G_max` 时，不得下单。已有持仓仍按计划止损或减险。 |
| **第二阶段：仓位核算与分批边界** | 在给定止损距离、费用滑点与最小批量下最多买多少？后续什么条件下才允许顺势分层加仓？ | [position-sizing-method](/queries/position-sizing-method) · [position-scaling-method](/queries/position-scaling-method) | 线性工具按 $N = \ell\lfloor (E \times r)/(\ell d)\rfloor$ 核算初始 $1R$，不足一批则放弃；严禁对浮亏进攻仓逆势补仓，顺势加仓不把账面浮盈当免费风险资本。 |
| **第三阶段：持仓管理与认知纠偏** | 头寸出现浮亏或浮盈后，如何防御处置效应、回本执念与赌场钱效应，按结构执行退出或移动止损？ | [losing-position-review-method](/queries/losing-position-review-method) · [winning-position-risk-management](/queries/winning-position-risk-management) | 触及价格止损、时间止损或结构失效条件时立即退出，禁止把短线亏损单就地重分类为核心仓；上移止损或部分减仓后保持初始 $1R$ 分母恒定。 |
| **第四阶段：盘后复盘与规则治理** | 单笔过程是否合规？多笔样本是否存在可复现的过程违背？如何编译为 `IF-THEN` 硬规则并控制规则膨胀？ | [post-trade-review-loop](/queries/post-trade-review-loop) · [repeat-mistake-detection-in-trading](/queries/repeat-mistake-detection-in-trading) · [trading-lessons-to-hard-rules](/queries/trading-lessons-to-hard-rules) · [minimal-executable-trading-system](/queries/minimal-executable-trading-system) | 先按过程合规性分流再统计净 R 分布；仅将跨独立样本重复出现的高代价机制编译为 `IF-THEN` 规则，定期修剪低阻断力的说明书式条文。 |

## 按具体执行问题快速路由

`[综合]` 交易准备或盘后诊断遇到以下具体情境时，直接跳转对应页面核对细则：

| 具体执行或复盘问题 | 优先阅读页面 | 关键核查动作 |
| :--- | :--- | :--- |
| 想加仓 ETF 或个股，分不清该按长期配置规则还是短线止损规则执行？ | [combining-two-investment-frameworks](/queries/combining-two-investment-frameworks) | 先核查资金归属层与心理账户防火墙，确认属于带宽 `δ` 再平衡还是 `1R` 进攻交易。 |
| 准备下单前最后一分钟，如何快速筛掉冲动单与无计划单？ | [pre-trade-risk-checklist](/queries/pre-trade-risk-checklist) | 逐项核对资金层、动作分类、入场触发、退出条件及 `1R / G_max / R_cluster / R_open / D_max` 硬指标。 |
| 连续亏损、疲劳分心或想补亏损仓位时，什么信号要求立即停手？ | [when-not-to-trade](/queries/when-not-to-trade) | 核对 10 类高危情境与四条硬熔断红线，阻断高换手摩擦损耗与回撤期赌博式翻本。 |
| 市场波动但信号未完全确认，该继续等待还是立即行动？ | [inaction-vs-action-decision-framework](/queries/inaction-vs-action-decision-framework) | 区分条件化等待与错失焦虑（FOMO）；开仓默认等待确认，止损与到点再平衡禁止拖延。 |
| 非常看好某个形态时，如何按风险预算算清最大可买股数或合约数？ | [position-sizing-method](/queries/position-sizing-method) | 用含点值与费用的单位风险 $d$ 核算批量上限 $N$，结合分数凯利边界防范参数估计误差与跳空风险。 |
| 底仓已有浮盈想加码，或临近事件想分批止盈，怎样避免伪分批？ | [position-scaling-method](/queries/position-scaling-method) | 区分核心仓定期投入与进攻仓非递增顺势分层（Pyramiding），按当前总净值重算合并风险。 |
| 持仓陷入浮亏，如何判断是系统允许的正常波动还是推迟认错？ | [losing-position-review-method](/queries/losing-position-review-method) | 拆解初始买入逻辑与预设止损，防御损失区风险寻求与回本效应（Break-Even Effect）。 |
| 持仓已有可观浮盈，如何平衡“过早卖飞”与“利润全部回吐”？ | [winning-position-risk-management](/queries/winning-position-risk-management) | 防御盈利区过早落袋与赌场钱效应摆动，用结构移动止损替代猜顶并维持初始 $1R$ 分母。 |
| 单笔平仓后如何复盘，避免“赚了夸自己、亏了怪市场”的结果导向？ | [post-trade-review-loop](/queries/post-trade-review-loop) | 分离过程合规性与结果盈亏，按含零收益交易的净 R 倍数样本分布追踪期望值 $\widehat{E[R]}$。 |
| 怀疑近期反复犯同类执行错误，如何排除小样本巧合与合规回撤噪声？ | [repeat-mistake-detection-in-trading](/queries/repeat-mistake-detection-in-trading) | 按错误机制而非标的代码归组，分离过程违背（Process Bug）与风险模型缺口（System Bug）。 |
| 复盘总结出的教训总是记不住或执行变形，如何写成有约束力的规则？ | [trading-lessons-to-hard-rules](/queries/trading-lessons-to-hard-rules) | 用执行意图（Implementation Intentions）将高频高代价教训编译为绑定风控参数的 `IF-THEN` 动作。 |
| 交易规则越积越厚、临场根本来不及调用，如何给系统做减法？ | [minimal-executable-trading-system](/queries/minimal-executable-trading-system) | 依据快省启发式与多重检验过拟合边界，将零散禁令合并为上层门禁并定期退役低效规则。 |
| 交易标的涉及财报盈利质量、偿债风险或估值预期差，如何做基本面排雷？ | [company-analysis-decision-map](/queries/company-analysis-decision-map) | 按四步尽调顺序调用七张公司分析方法卡，并在下单前锁定账户归属与退出契约。 |

## 核心定量不变量与行为防御联动

- `[综合]` **分数凯利缩放与破产尾部抑制**：[Thorp（2006）](https://gwern.net/doc/statistics/decision/2006-thorp.pdf) 证明在连续高斯扩散近似下，分数凯利 $f = c f^*$（$0 < c < 2$）保留 $c(2-c)$ 比例的最优超额对数增长率、仅承担 $c^2$ 比例的方差，并在零利率（或相对无风险利率贴现财富 $\tilde{V}(t) = V(t)e^{-r_f t}$）基准下将跌破固定初始本金 $V_0$ 比例 $x$ 的概率压低为 $x^{2/c-1}$（半凯利 $c=0.5$ 以 `25%` 方差保留 `75%` 超额增长率，相对初始本金腰斩概率由全凯利的 `50%` 降至 `12.5%`）；滚动历史峰值最大回撤与实战参数误差仍须叠加 [position-sizing-method](/queries/position-sizing-method) 与 [investment-risk-control-framework](/concepts/investment-risk-control-framework) 的 `r / G_max / R_cluster / R_open / D_max` 硬上限。
- `[综合]` **止损规则的序列相关与制度依赖**：[Kaminski & Lo（2014）](https://www.smallake.kr/wp-content/uploads/2017/02/When_Do_Stop-Loss_Rules_Stop_Losses.pdf) 证明纯随机游走与均值回归（$\rho < 0$）下机械止损的期望停止溢价为负（被反复打止损损耗），仅在同采样频率动量延续（$\rho \ge \pi/\sigma \equiv \text{SR}$）或熊市负溢价状态切换（$\mu_2 < r_f$ 且识别率达标）中产生非负停止溢价；因此止损纪律必须与 [leontraveller-trading-and-investment-system](/concepts/leontraveller-trading-and-investment-system) 的趋势结构筛选配合使用，不宜在震荡噪声区间设极窄止损频繁进出。
- `[综合]` **处置效应双侧纠偏**：[Odean（1998）](https://faculty.haas.berkeley.edu/odean/papers%20current%20versions/areinvestorsreluctant.pdf) 实证显示个人账户实现浮盈比例（`PGR = 0.148`）显著高于实现浮亏比例（`PLR = 0.098`），且被卖出的赢家在随后一年平均跑赢被死扛的输家 `+3.41` 个百分点；[losing-position-review-method](/queries/losing-position-review-method) 与 [winning-position-risk-management](/queries/winning-position-risk-management) 分别从亏损侧认错与盈利侧移动止损两端阻断该逆向选择。
- `[综合]` **防回测过拟合与规则精简**：[Bailey & López de Prado（2014）](https://www.davidhbailey.com/dhbpapers/deflated-sharpe.pdf) 指出反复基于近期亏损修补参数会推高隐性试验次数 $N$ 与样本外失效概率；[repeat-mistake-detection-in-trading](/queries/repeat-mistake-detection-in-trading) 与 [minimal-executable-trading-system](/queries/minimal-executable-trading-system) 据此限制单次痛点立法，保持活跃规则集短小可执行。

## AI Agent 使用方式

- `[推论]` 当用户提出开仓、加减仓、止损犹豫或复盘诉求时，先按“四阶段生命周期”定位所处阶段，再抽取 `1–2` 篇目标查询页与 [investment-risk-control-framework](/concepts/investment-risk-control-framework) 参数表交叉核对。
- `[推论]` 若输入缺少账户分层（核心仓 vs. 进攻仓）、预设止损位或当前组合风险占用，优先提示补齐缺失约束，不替采用者预设具体风险比例或生成买卖指令。

## Relations

- depends_on: [investment-risk-control-framework](/concepts/investment-risk-control-framework), [leontraveller-trading-and-investment-system](/concepts/leontraveller-trading-and-investment-system), [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system)
- related: [company-analysis-decision-map](/queries/company-analysis-decision-map), [combining-two-investment-frameworks](/queries/combining-two-investment-frameworks), [pre-trade-risk-checklist](/queries/pre-trade-risk-checklist), [when-not-to-trade](/queries/when-not-to-trade), [inaction-vs-action-decision-framework](/queries/inaction-vs-action-decision-framework), [position-sizing-method](/queries/position-sizing-method), [position-scaling-method](/queries/position-scaling-method), [losing-position-review-method](/queries/losing-position-review-method), [winning-position-risk-management](/queries/winning-position-risk-management), [post-trade-review-loop](/queries/post-trade-review-loop), [repeat-mistake-detection-in-trading](/queries/repeat-mistake-detection-in-trading), [trading-lessons-to-hard-rules](/queries/trading-lessons-to-hard-rules), [minimal-executable-trading-system](/queries/minimal-executable-trading-system)

