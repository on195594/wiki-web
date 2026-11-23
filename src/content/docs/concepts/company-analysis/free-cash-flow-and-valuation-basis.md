---
title: 自由现金流与估值口径
created: 2026-11-14
updated: 2026-11-23
type: concept
tags:
  - investment
  - research
sources:
  - https://pages.stern.nyu.edu/~adamodar/New_Home_Page/definitions.html
  - https://pages.stern.nyu.edu/~adamodar/pdfiles/valn2ed/ch15.pdf
  - https://pages.stern.nyu.edu/~adamodar/pdfiles/valn2ed/ch14.pdf
  - https://www.berkshirehathaway.com/letters/1986.html
  - https://www.berkshirehathaway.com/letters/1992.html
  - https://cas.xmu.edu.cn/info/2083/4954.htm
  - https://www.shui5.cn/article/9e/24800.html
  - https://www.morganstanley.com/im/publication/insights/articles/article_stockbasedcompensation.pdf
  - https://www.morganstanley.com/im/en-us/individual-investor/insights/consilient-observer/which-one-is-it-equity-issuance-retirement.html
  - https://www.morganstanley.com/content/dam/im/assets/publication/thought-leadership/consilient-observer/article_tofreeornottofree_ltr.pdf
  - docs:https://zenodo.org/records/20650537
status: stable
description: 公司分析方法卡：区分 CFO 减资本开支、FCFF、FCFE 与 owner earnings（已核对巴菲特 1986/1992
  股东信与第 31 号现金流量表准则），匹配现金流对象、折现率、股权激励稀释与高 ROIC 负 FCF 边界。
aliases:
  - 现金流估值口径
  - 自由现金流
  - 所有者盈余
volatility: low
review_by: 2027-11-15
verified_at: 2026-11-15
---

# 自由现金流与估值口径

## Summary

先确认现金流属于哪些资本提供者，再匹配折现率、价值口径与再投资要求。CFO 减购建支出不是天然的 FCFF 或 FCFE；维护性资本开支拆不可靠时保留未知。本卡已完成 Damodaran 估值口径、巴菲特 1986/1992 股东信原文及中国《企业会计准则第 31 号——现金流量表》正文与应用指南核对。

关键词：CFO、经营现金流、资本开支、FCFF、FCFE、owner earnings、所有者盈余、维护性资本开支、增长性资本开支、营运资本、税盾、WACC、股权成本、企业价值、股权价值、终值、安全边际。

## 问题

公司产生的现金究竟属于谁？增长消耗多少现金？估值结果是经营资产价值还是股东权益价值？本卡避免把利润、现金流量表的净额和可分配现金混为一谈；方法不是公司事实，也不是新的计算或交易规则。

## 来源与实际核对范围

- 2026-11-14 读取 Damodaran《Financial Measures and Ratios》中的现金流、再投资与资本成本定义，以及《Investment Valuation》第 15 章开头 FCFF 定义、稳定增长、终值和企业价值到股权价值的相关段落；第 14 章取得正文并核对 FCFE 定义段。未逐项复算书中公司算例。
- 2026-11-15 在线核对 Warren Buffett [1986 年致股东信](https://www.berkshirehathaway.com/letters/1986.html)（含附录《Purchase-Price Accounting Adjustments and the "Cash Flow" Fallacy》）与 [1992 年致股东信](https://www.berkshirehathaway.com/letters/1992.html)（《Common Stock Investments》章节）：
  - **1986 年信（Owner Earnings 定义与“现金流”谬误）**：以收购 Scott Fetzer（账面净资产 `1.724` 亿美元、收购价 `3.15` 亿美元，产生 `1.426` 亿美元收购溢价及每年 `1,160` 万美元非现金公允价值摊销/折旧）为例，正式定义“所有者盈余（owner earnings）”等于：**`(a)` 报告盈余（reported earnings），加上 `(b)` 折旧、损耗、摊销及特定其他非现金费用，减去 `(c)` 企业为完全维持其长期竞争地位和单位产销量所需的厂房设备等年均资本化支出（若维持竞争地位和产销量需额外营运资本，该增量也应计入 `(c)`）**。巴菲特指出，由于 `(c)` 必然包含估计，该方程无法提供 GAAP 那种“欺骗性的精确（deceptively precise）”，但他引用凯恩斯名言（宁可模糊地正确，也不要精确地错误）强调所有者盈余才是估值相关项，并批判华尔街报告经常只算 `(a) + (b)` 却不扣减 `(c)`，仿佛企业是永远无需更换翻新的金字塔。
  - **1992 年信（内在价值方程、增长与安全边际）**：引用 John Burr Williams（1938，《The Theory of Investment Value》）的价值方程——任何股票、债券或企业的今日价值，均由其剩余存续期内预期产生的现金流入与流出按适当利率折现决定；明确指出“价值投资”与“成长投资”本质一体（增长始终是价值计算的组成部分，仅当增量资本回报率高于成本时增长才创造价值，如高资本消耗低回报的航空业越增长越毁灭价值）；并强调预测未来“息票（coupons）”极易出错，因此必须同时依赖**能力圈（简单且稳定的业务）**与本杰明·格雷厄姆的**安全边际（margin of safety）**。
- 2026-11-15 在线核对 [《企业会计准则第 31 号——现金流量表》全文](https://www.shui5.cn/article/9e/24800.html) 及 [《企业会计准则第 31 号——现金流量表》应用指南（会企 03 表及补充资料格式）](https://cas.xmu.edu.cn/info/2083/4954.htm)：第四条至第十五条规定按经营、投资、筹资三类列报；主表中“支付的各项税费”属经营活动流出，“购建固定资产、无形资产和其他长期资产支付的现金”属投资活动流出，而**“分配股利、利润或偿付利息支付的现金”统一归入筹资活动现金流出**；第十六条及应用指南补充资料要求在附注中按间接法披露由净利润调节为经营活动现金流量的调节明细（含资产减值准备、折旧摊销、财务费用、投资损益、递延所得税及存货/经营性应收应付变动）。
- 2026-11-19 核对 Michael J. Mauboussin & Dan Callahan（Morgan Stanley Counterpoint Global）三篇研究的核心论点与公开数据节选（未逐项复算全文模型）：
  - 《[Stock-Based Compensation](https://www.morganstanley.com/im/publication/insights/articles/article_stockbasedcompensation.pdf)》（2023-04-18）：指出股权激励（SBC）既是员工薪酬也是股权融资方式（作者估计 2022 年 Russell 3000 公司 SBC 约为 2,700 亿美元，Russell 3000 信息技术板块 SBC 占经营现金流的 18.8%），并对比两种一致的估值处理方式——把 SBC 作为费用扣减（FCFE 较低但索取权仅归现有股东）或把 SBC 作为员工对股权的索取权单列（FCFE 较高但索取权由现有股东与员工共享）。
  - 《[Which One Is It? Equity Issuance and Retirement](https://www.morganstanley.com/im/en-us/individual-investor/insights/consilient-observer/which-one-is-it-equity-issuance-retirement.html)》（2024-07-24）：按 SBC 发行与股票回购的中位数划分四象限，指出同时大量发行 SBC 又进行回购的公司可能违背资本配置低买高卖原则，样本内发行股票公司的历史股东回报平均偏弱。
  - 《[To Free or Not to Free (Cash Flow)](https://www.morganstanley.com/content/dam/im/assets/publication/thought-leadership/consilient-observer/article_tofreeornottofree_ltr.pdf)》（2026-09-17）：将 FCF 与 ROIC 绑定，指出当新增投资的预期回报高于资本成本，阶段性负 FCF 并不必然损害价值；以五大超大规模云厂商（Amazon、Alphabet、Microsoft、Meta、Oracle）的 AI 资本开支周期为例，其合计过去四季（TTM）FCF 从 2024Q1 约 1,700 亿美元（占股权市值的 FCF 收益率 2.0%）降至 2026Q2 约 350 亿美元（收益率 0.3%），一致预期于 2027Q3 触底至约 -2,650 亿美元并于 2030 年回升至近 5,050 亿美元。
- 2026-11-21 读取 Fabio Brina（2026-06-12，[Zenodo:20650537](https://zenodo.org/records/20650537)）《Which Stock Screens Actually Work?》全文，核对表 1 中基于 2010–2024 年逐年标普 500 成分名单的非金融基础样本（`n = 2,103` 个公司—年度观测）上净再投资率（截断于 `[0, 1]`）与 FCFROIC 筛选指标的横截面秩相关结果；未在本地复跑随附代码与数据集。
- 标为“本页推论”的内容是应用建议，不是来源已证实的投资效果。

## 适用条件

普通非金融企业，有可追溯的合并报表与业务、融资信息。银行、保险、证券等金融企业不直接套用；有金融子公司的集团也要先检查合并现金流是否受存贷款等影响。亏损、重组或经营模式变化时，历史净额不宜直接外推。

## 所需证据

同期间、同合并范围的利润表、现金流量表、资产负债表及附注；税率与税款、利息分类、有息债务与净借款、少数股东权益、非经营资产；资本开支与折旧摊销、营运资本变动、租赁及并购支出、扩产和更新改造计划。披露没有拆分维护性与增长性资本开支时，明确未知，不把折旧或某个固定比例冒充维护支出。

## 分析方法

### 1. 先给现金流命名，再估值

| 口径 | 定义或勾稽 | 对象与用途 |
|---|---|---|
| CFO − 资本开支 | 报表经营活动现金流净额减所定义的资本开支；注明是否仅含购建固定资产、无形资产和其他长期资产支付的现金，是否另列并购、租赁 | 现金剩余的描述性近似；未经利息、融资及范围调整，不自动等于 FCFF 或 FCFE |
| FCFF | EBIT × (1 − 经营税率) + 折旧摊销 − 资本开支 − 非现金经营营运资本增量 | 债权与股权等资本提供者共同享有的经营现金流，以 WACC 折现得经营资产价值 |
| FCFE | 对应股权范围的净利润 + 折旧摊销 − 资本开支 − 非现金经营营运资本增量 + 净借款 | 对应普通股股东可得现金流；优先股、少数股东等索取权及各项调整须与利润范围一致，以相应股权成本折现；不等于当期实际分红 |
| owner earnings（1986 股东信附录） | `(a)` 报告盈余 + `(b)` 折旧、损耗、摊销及特定其他非现金费用 − `(c)` 完全维持长期竞争地位和单位产销量所需的年均资本化支出及必要新增营运资本 | 经济性维持后的所有者现金能力估计；`(c)` 需结合业务估计，不是报表标准项目，也不天然等同于含全部扩张资本开支的 FCFE |

本页推论（FCFE 范围勾稽）：若净利润含少数股东损益，且再投资、净借款等也取合并数，得到的是合并股权范围的现金流，不能直接当归母普通股股东所得。可统一转换到归母现金流口径，或在合并股权估值中明确少数股东索取权的估值与扣除；不能机械扣一个少数股东权益账面数。反过来，只把净利润换成归母数、其余仍用合并数，也不能自动形成一致的归母 FCFE。若不同业务的风险显著不同，还需解释所用股权成本为何适合对应范围。

FCFF 到股权价值通常需加回未包含在经营估值中的超额现金、非经营资产，再减有息债务及其他非普通股索取权（包括与合并范围匹配的少数股东权益）。已经包含在现金流中的资产收益不能再加一次；若保留现金利息或非经营投资收益，又另外加回相应资产价值，就要核查是否重复计价。FCFE 已是股权口径，不能再机械减净债务。币种、名义/实际、税前/税后和时间点也要对应；不能用股权成本折 FCFF、用 WACC 折 FCFE。

### 2. 利息、税与营运资本不重算

- Damodaran 的 FCFF 是付债务前现金流：经营税负按未扣利息的经营利润考虑，债务税盾在税后债务成本中体现。若从已扣利息的利润或 CFO 出发，先辨明实际报表分类与可实现税盾，不能既保留税盾又重复加回。
- 本页推论：中国企业会计准则（会企 03 表）下，一般企业主表的经营活动现金流量净额（CFO）**尚未扣除债务利息现金支出**（利息与股利合并列于筹资活动“分配股利、利润或偿付利息支付的现金”），但经营活动所列的实际税款并不自动等于估值所需的无杠杆经营税负。因此，从中国报表 CFO 出发推导 FCFF 或 FCFE 时，必须先核对附注补充资料中的财务费用、利息支付与所得税口径：推导 FCFE 时不可漏减偿付利息支出，推导 FCFF 时不可在未扣利息的 CFO 上再重复加回利息，也不能在 CFO 已包含营运资本变化后再扣一次同一变动。报表实际税款不必等于估值假设的经营税负。
- 非现金经营营运资本通常围绕经营性应收、存货、应付等展开，排除现金和融资性债务；增量为正是占用现金，释放则增加现金。并购、汇率和重分类可能使余额差不等于现金流调整数（本页推论）。

### 3. 维护与增长必须和增长假设一起解释

全部资本开支是可观察起点；维护性支出是经济估计，不一定等于折旧。更新设备可能同时改善效率，名称“扩建”或“改造”也不足以精确划分。**拆不可靠就保留未知**；仅在有工程计划、产能或历史更新资料支撑时列有依据的情景，不倒推一个使估值好看的数字（本页推论）。

Damodaran 的稳定回报框架下：经营增长率 = 再投资率 × ROC，所需再投资 = 税后经营利润 × 增长率 / ROC。若用仅扣维护支出的 owner earnings，却又假设靠额外投资实现高增长，就必须另扣相应增长投入；不能一边不再投资、一边享受其全部增长。详见 [growth-reinvestment-and-return-on-capital](/concepts/company-analysis/growth-reinvestment-and-return-on-capital)。

### 3.1 股权激励（SBC）稀释与阶段性负 FCF 的估值边界

- **SBC 不得在现金流与股本两侧同时忽略**：用间接法从净利润推算 CFO 时，计入损益的权益结算 SBC 属非现金费用，通常被加回。Mauboussin（2023，《[Stock-Based Compensation](https://www.morganstanley.com/im/publication/insights/articles/article_stockbasedcompensation.pdf)》）指出两种自洽的处理方式必须二选一且前后一致：（1）将未来授予的 SBC 计入经营费用，从已加回该费用的现金流起算时扣回一次；（2）保留加回额，在估值中显式计入未来授予导致的稀释。两种方法都要另行核对估值日已授予、尚未体现在普通股股数中的权益索取权。此外，结合 Mauboussin（2024，《[Which One Is It?](https://www.morganstanley.com/im/en-us/individual-investor/insights/consilient-observer/which-one-is-it-equity-issuance-retirement.html)》），若企业用回购抵消 SBC 稀释，可将同期回购股数减去包括员工获股在内的新发行股数，核对实际净减少的股数。回购对剩余股东每股价值的影响还取决于成交价与内在价值。
- **区分“高回报再投资导致的负 FCF”与“造血恶化导致的负 FCF”**：Mauboussin（2026，《[To Free or Not to Free (Cash Flow)](https://www.morganstanley.com/content/dam/im/assets/publication/thought-leadership/consilient-observer/article_tofreeornottofree_ltr.pdf)》）强调 FCF 必须与 ROIC 联合解读——只要新增投资的预期回报（ROIIC）高于资本成本，扩张期出现阶段性负 FCF 仍可能创造价值；反之，若在低回报或产能过剩领域激进扩产，负 FCF 则是价值毁灭信号。Fabio Brina（2026，[Zenodo:20650537](https://zenodo.org/records/20650537)）的非金融样本中，截断于 `[0, 1]` 的净再投资率与未来超额回报的秩相关为 `-0.045`，以它构造的 FCFROIC 筛选指标为 `+0.084`，仍低于纯 ROIC（详见 [growth-reinvestment-and-return-on-capital](/concepts/company-analysis/growth-reinvestment-and-return-on-capital)）。实际 FCF 的正负应按未截断的现金流口径判断；对扩张期负 FCF，逐案核查边际回报。

本页推论：分析科技或重资本开支周期公司时，可并列展示 CFO 减资本开支及扣回其中已加回的权益结算 SBC 后的金额；采用稀释法时，另列预计股数变化与每股可分配现金流，并在 FCF 转负时强制回到 [growth-reinvestment-and-return-on-capital](/concepts/company-analysis/growth-reinvestment-and-return-on-capital) 核对增量资本回报与产能/订单兑现路径，避免单凭当期 FCF 收益率高估低成长股或误杀高回报扩张股。

### 4. 终值与安全边际

稳定增长 FCFF 终值 = 下一期 FCFF / (稳定期 WACC − 稳定增长率)。下一期现金流要与稳定期资本回报及再投资一致，且 WACC > g；FCFE 模型相应使用股权成本。高增长期的利润率、融资结构和超额回报不能无依据永久延续。终值在预测期末，还须折回估值日。

本页推论：并列有经济依据的增长、资本回报和资本成本情景，观察终值占比与价值区间；变量接近分母边界时小幅变化可能导致巨大估值变化。安全边际仅在现金流口径可辨、价值区间有证据、资产负债表和生存风险可评估时有意义；**不设通用折扣**，也不以低价格弥补不可识别的负债、持续亏损或虚假精确的终值。证据不足时可以“不足以定价”。结合 [price-implied-expectations-analysis](/concepts/company-analysis/price-implied-expectations-analysis) 检查价格要求，但不据本卡强制采用某种估值程序。

## 常见误判

- 把 CFO 减购建支出直接命名为 FCFF，或把归母利润与全集团 CFO 无说明配对。
- 把 CFO 已经扣过的营运资本再扣一次；忽略并购、租赁或利息分类。
- 把折旧等同维护性资本开支，或将未披露的维护支出填成零。
- 在科技或高 SBC 公司中直接采用加回 SBC 的报表 FCF 却忽略股本稀释，或把仅用于对冲 SBC 稀释的回购当成净股东回报。
- 脱离增量资本回报（ROIIC）单独用当期 FCF 正负或 FCF 收益率做买卖判决。
- 不为增长付再投资成本，或把非经营资产收益与资产价值重复计算。
- 用单一终值和资本成本制造确定性；把安全边际理解为任何公司的统一折价。

## 后续验证

事前保存现金流对象、报表勾稽、资本开支边界、再投资与增长假设、资本成本依据和敏感性。之后用新披露核对经营现金流、更新及扩产投入、营运资本和净借款；区分口径错误与经营预测错误。将估值结论接入投资组合时，按 [investment-risk-control-framework](/concepts/investment-risk-control-framework) 与 [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system) 明确其属于核心仓长期配置还是进攻仓交易，并绑定相应风控门禁；方法核对通过不证明投资有效。

## Relations

- related: [company-analysis-decision-map](/queries/company-analysis-decision-map), [earnings-quality-and-cash-conversion](/concepts/company-analysis/earnings-quality-and-cash-conversion), [balance-sheet-solvency-and-distress-risk](/concepts/company-analysis/balance-sheet-solvency-and-distress-risk), [growth-reinvestment-and-return-on-capital](/concepts/company-analysis/growth-reinvestment-and-return-on-capital), [competitive-advantage-period-and-capital-allocation](/concepts/company-analysis/competitive-advantage-period-and-capital-allocation), [cyclical-earnings-normalization](/concepts/company-analysis/cyclical-earnings-normalization), [price-implied-expectations-analysis](/concepts/company-analysis/price-implied-expectations-analysis), [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system), [investment-risk-control-framework](/concepts/investment-risk-control-framework)

