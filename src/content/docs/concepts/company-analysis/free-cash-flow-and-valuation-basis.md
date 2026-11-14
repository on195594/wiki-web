---
title: 自由现金流与估值口径
created: 2026-11-14
updated: 2026-11-14
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
  - https://kjs.mof.gov.cn/zt/kjzzss/qiyehuijizhunze/
status: draft
description: 公司分析方法卡：区分 CFO 减资本开支、FCFF、FCFE 与 owner
  earnings，匹配现金流对象、折现率和价值口径；保留维护性资本开支与原文核验缺口。
aliases:
  - 现金流估值口径
  - 自由现金流
  - 所有者盈余
volatility: low
---

# 自由现金流与估值口径

## Summary

关键词：CFO、经营现金流、资本开支、FCFF、FCFE、owner earnings、所有者盈余、维护性资本开支、增长性资本开支、营运资本、税盾、WACC、股权成本、企业价值、股权价值、终值、安全边际。

## 问题

公司产生的现金究竟属于谁？增长消耗多少现金？估值结果是经营资产价值还是股东权益价值？本卡避免把利润、现金流量表的净额和可分配现金混为一谈；方法不是公司事实，也不是新的计算或交易规则。

## 来源与实际核对范围

- 2026-11-14 读取 Damodaran《Financial Measures and Ratios》中的现金流、再投资与资本成本定义，以及《Investment Valuation》第 15 章开头 FCFF 定义、稳定增长、终值和企业价值到股权价值的相关段落；第 14 章取得正文并核对 FCFE 定义段。未逐项复算书中公司算例。
- Buffett 1986 年股东信（owner earnings）与 1992 年股东信（估值、不确定性与安全边际）为优先原始资料；官网本次返回 403，**未读到原文**。下述 owner earnings 仅为待复核的通行定义线索，不声称完成两封信的核验，不引用未读的句子。
- 财政部《企业会计准则第31号——现金流量表》尚未取得可读正文；尝试旧站链接仅返回导航壳，`sources` 留准则专题入口而非把空页面当准则。下述中国报表分类提醒是待逐条对照准则及报表附注的应用检查，不冒充已核对条文。
- 因上述缺口保留 **draft**；结构检查或离线读取不替代原文核对。标为“本页推论”的内容是应用建议，不是来源已证实的投资效果。

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
| FCFE | 净利润 + 折旧摊销 − 资本开支 − 非现金经营营运资本增量 + 净借款 | 普通股股东可得现金流；优先股等其他索取权须一致处理，以股权成本折现得相应股权价值；不等于当期实际分红 |
| owner earnings（待原信复核） | 通行表述为报告盈余加适当非现金费用，再减维持长期竞争地位和业务规模所需的平均资本支出；维持业务所需新增营运资本也不能漏掉 | 经济性维持后的所有者现金能力估计，不是报表标准项目，也不天然等同于含全部增长投资的 FCFE |

FCFF 到股权价值通常需加回未包含在经营估值中的超额现金、非经营资产，再减有息债务及其他非普通股索取权（包括与合并范围匹配的少数股东权益）。已经包含在现金流中的资产收益不能再加一次。FCFE 已是股权口径，不能再机械减净债务。币种、名义/实际、税前/税后和时间点也要对应；不能用股权成本折 FCFF、用 WACC 折 FCFE。

### 2. 利息、税与营运资本不重算

- Damodaran 的 FCFF 是付债务前现金流：经营税负按未扣利息的经营利润考虑，债务税盾在税后债务成本中体现。若从已扣利息的利润或 CFO 出发，先辨明实际报表分类与可实现税盾，不能既保留税盾又重复加回。
- 本页推论：中国报表先核利息支付、所得税及补充资料的具体分类，再作估值勾稽；不能照搬他国 CFO 分类，也不能在 CFO 已包含营运资本变化后再扣一次同一变动。报表实际税款不必等于估值假设的经营税负。
- 非现金经营营运资本通常围绕经营性应收、存货、应付等展开，排除现金和融资性债务；增量为正是占用现金，释放则增加现金。并购、汇率和重分类可能使余额差不等于现金流调整数（本页推论）。

### 3. 维护与增长必须和增长假设一起解释

全部资本开支是可观察起点；维护性支出是经济估计，不一定等于折旧。更新设备可能同时改善效率，名称“扩建”或“改造”也不足以精确划分。**拆不可靠就保留未知**；仅在有工程计划、产能或历史更新资料支撑时列有依据的情景，不倒推一个使估值好看的数字（本页推论）。

Damodaran 的稳定回报框架下：经营增长率 = 再投资率 × ROC，所需再投资 = 税后经营利润 × 增长率 / ROC。若用仅扣维护支出的 owner earnings，却又假设靠额外投资实现高增长，就必须另扣相应增长投入；不能一边不再投资、一边享受其全部增长。详见 [growth-reinvestment-and-return-on-capital](/concepts/company-analysis/growth-reinvestment-and-return-on-capital)。

### 4. 终值与安全边际

稳定增长 FCFF 终值 = 下一期 FCFF / (稳定期 WACC − 稳定增长率)。下一期现金流要与稳定期资本回报及再投资一致，且 WACC > g；FCFE 模型相应使用股权成本。高增长期的利润率、融资结构和超额回报不能无依据永久延续。终值在预测期末，还须折回估值日。

本页推论：并列有经济依据的增长、资本回报和资本成本情景，观察终值占比与价值区间；变量接近分母边界时小幅变化可能导致巨大估值变化。安全边际仅在现金流口径可辨、价值区间有证据、资产负债表和生存风险可评估时有意义；**不设通用折扣**，也不以低价格弥补不可识别的负债、持续亏损或虚假精确的终值。证据不足时可以“不足以定价”。结合 [price-implied-expectations-analysis](/concepts/company-analysis/price-implied-expectations-analysis) 检查价格要求，但不据本卡强制采用某种估值程序。

## 常见误判

- 把 CFO 减购建支出直接命名为 FCFF，或把归母利润与全集团 CFO 无说明配对。
- 把 CFO 已经扣过的营运资本再扣一次；忽略并购、租赁或利息分类。
- 把折旧等同维护性资本开支，或将未披露的维护支出填成零。
- 不为增长付再投资成本，或把非经营资产收益与资产价值重复计算。
- 用单一终值和资本成本制造确定性；把安全边际理解为任何公司的统一折价。

## 后续验证

事前保存现金流对象、报表勾稽、资本开支边界、再投资与增长假设、资本成本依据和敏感性。之后用新披露核对经营现金流、更新及扩产投入、营运资本和净借款；区分口径错误与经营预测错误。完成两封原信及第31号准则的实质核对后，再评估是否可转 stable；离线格式通过不证明投资有效。

## Relations

- related: [earnings-quality-and-cash-conversion](/concepts/company-analysis/earnings-quality-and-cash-conversion), [growth-reinvestment-and-return-on-capital](/concepts/company-analysis/growth-reinvestment-and-return-on-capital), [cyclical-earnings-normalization](/concepts/company-analysis/cyclical-earnings-normalization), [price-implied-expectations-analysis](/concepts/company-analysis/price-implied-expectations-analysis)

