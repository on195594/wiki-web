---
title: 增长、再投资与资本回报
created: 2026-11-14
updated: 2026-11-19
type: concept
tags:
  - investment
  - research
sources:
  - https://pages.stern.nyu.edu/~adamodar/pdfiles/papers/returnmeasures.pdf
  - https://pages.stern.nyu.edu/~adamodar/podcasts/valspr20/session9slides.pdf
  - https://pages.stern.nyu.edu/~adamodar/pdfiles/papers/R_D.pdf
  - https://www.morganstanley.com/im/en-us/individual-investor/insights/consilient-observer/to-free-or-not-to-free.html
status: stable
description: 公司分析方法卡：增长需要多少再投资、资本回报是否高于资本成本，以及投入资本回报率（ROIC）的口径、研发资本化调整与常见失真。
aliases:
  - 增长与再投资
  - 投入资本回报率
volatility: low
verified_at: 2026-11-14
review_by: 2027-11-14
---

# 增长、再投资与资本回报

## Summary

关键词：ROIC、ROC、ROE、资本回报、投入资本回报率、再投资率、增长质量、增长创造价值、超额回报、资本开支、营运资本、留存比例、边际回报、商誉、研发资本化。

增长本身不等于价值。本卡回答两个问题：公司要实现预期的增长需要投入多少资本，以及这些资本赚到的回报是否高于其成本。它把“增长率”拆成“再投资率 × 资本回报”，并列出资本回报在会计口径上常见的失真。

方法卡是分析线索，不是任何具体公司的事实；公司的数字仍要回到它自己的披露和可追溯数据。

## 来源与核对范围

- Aswath Damodaran，《Return on Capital (ROC), Return on Invested Capital (ROIC) and Return on Equity (ROE): Measurement and Implications》，2007 年 7 月。2026-11-14 读取定义、计量问题各节标题、边际回报与结论段；租赁的具体算例未逐项核对。
- Aswath Damodaran 估值课程 2020 年春季第 9 讲课件（增长的基本面估计）。2026-11-14 读取增长公式相关页。
- Aswath Damodaran，《Research and Development Expenses: Implications for Profitability Measurement and Valuation》（[R_D.pdf](https://pages.stern.nyu.edu/~adamodar/pdfiles/papers/R_D.pdf)）。2026-11-19 核对将研发支出作为可抵税资本性支出重分类、对营业利润与投入资本的影响方向；未逐项复算原文行业摊销年限表与公司算例。
- Michael J. Mauboussin & Dan Callahan，《To Free or Not to Free (Cash Flow)》（Morgan Stanley Counterpoint Global，2026-09-17，[页面摘要](https://www.morganstanley.com/im/en-us/individual-investor/insights/consilient-observer/to-free-or-not-to-free.html)）。2026-11-19 核对关于增量投入资本回报率（ROIIC）与“当新增投资的预期回报高于资本成本时阶段性负 FCF 可合理存在”的核心论点；未逐项复算全文公司模型。

标为“本页推论”的内容是应用建议，原文没有。

## 适用条件

- 需要判断增长是否值得为之付出溢价，或比较不同公司的增长质量。
- 公司有可用的多期经营利润、资本开支、营运资本和资产负债表数据。
- 金融类公司、利润为负或投入资本接近零的公司，不能直接套用下列比率。

## 所需证据

多期息税前利润与税率、净资本开支（资本开支减折旧）、非现金营运资本变化、有息负债与股东权益的账面值、现金、商誉及并购记录、一次性损益与资产减值、分红与留存。口径要统一期间、主体和单位。

## 怎么分析

**一、资本回报的定义。** 论文给出的常用定义是：当年税后经营利润除以上年末投入资本的账面值。四个要点：分子用经营利润而不是净利润；税按经营利润假设计算；分母用账面值；分母取期初（上年末）数，也有人用期初期末平均。投入资本可以从资产侧算（固定资产加非现金营运资本），也可以从资本侧算（有息负债加股东权益减现金）；有少数股权投资或未计为债务的长期负债时，两种算法结果不同。

论文提醒的一个常见错误：用实际缴纳的税额计算税后经营利润，会把债务的抵税好处算两次。

**二、增长与再投资的关系。** 课件给出：在资本回报不变时，

- 经营利润增长率 = 再投资率 × 资本回报，其中再投资率 =（净资本开支 + 非现金营运资本变化）÷ 税后经营利润；
- 每股收益增长率 = 留存比例 × 净资产收益率。

课件第 175 页在“当前 ROE 预期不变”的特殊情形下给出 `gEPS = b × ROE`，其中 b 为留存利润占净利润的比例，并由此提出长期利润增长率不超过 ROE；第 174 页另列非现金净利润、股权再投资率与非现金 ROE 的口径。2026-11-14 复核这两页。不能把有条件的 EPS 增长关系扩成任意公司的利润增长上限。

本页推论（公式适用边界）：当 ROE 稳定且为正、股本口径可比、增长由留存收益支持、留存比例在 0–1 内时，才可由 `b × ROE` 得出该上限。外部股权融资会增加权益与股数，不能把总净利润增长直接当作每股增长；若净借款、杠杆、资本结构或回报改变，须另行解释再投资和 ROE 的变化。存量效率改善、一次性损益、回购及亏损/极小权益也可能破坏简单对应，不能用超过当期 ROE 就断言预测不可能。课件原文没有逐项列出这些融资与口径限制，本段是对公式边界的应用推导。

课件还提出：在给定增长率下，公司所需的净资本开支与其投资质量成反比。资本回报本身提高时增长会更快，课件用回报从 12% 升到 13% 的算例说明，但这部分增长来自存量资产效率改善，不能长期持续（后半句为本页推论）。

**三、增长是否创造价值。** 论文的核心表述是：没有超额回报相伴的增长不创造价值；回报低于资金成本的公司，越增长越损害价值。超额回报最终来自竞争优势或进入壁垒，并会随公司变大和竞争加剧而下降。

**四、看边际而不只看平均。** 论文指出按总量算出的是历史全部投资的平均回报，并给出一个不完美的边际回报算法：税后经营利润的增量除以上一期投入资本的增量。公司通常先做最好的项目，边际回报多数情况下低于平均回报。

本页推论：把“预测的增长率”除以“近年的资本回报”，可以反推这一增长隐含的再投资率，再与公司实际的资本开支计划、现金流和融资能力对照；对不上时，要么增长预测偏高，要么隐含了资本回报提升的假设，需要单独给出依据。

**五、研发资本化与轻资产无形投资口径。** Damodaran 在《[Research and Development Expenses](https://pages.stern.nyu.edu/~adamodar/pdfiles/papers/R_D.pdf)》中提出：在估值与盈利能力度量时，应将研发支出（R&D）重分类为可抵税的资本性支出而非当期费用。重分类会同时改变分子与分母。仅对报表已费用化、预期跨期受益的研发支出做调整：将当期对应费用加回营业利润，扣除重构研发资产的当期摊销，并将未摊余额计入相同计量时点的投入资本。已入账的开发支出沿用账面口径，避免重复资本化。保留原有的研发税收抵扣：在税后经营利润和再投资两端都加上同一金额（被资本化的当期研发支出减对应摊销），使单纯重分类不改变当期自由现金流。因此，对研发密集型企业（如医药、半导体、软件与 AI 公司），未调整的会计 ROIC 可能因分母过小而被系统性高估，或因当期高研发费用拉低利润而被扭曲。

本页推论（研发资本化与 ROIIC 核对边界）：
- 跨公司比较研发密集型企业与重资产企业时，应并列报告“会计口径 ROIC”与“研发资本化调整后 ROIC”，并写明所选摊销年限及敏感性（不同行业产品周期差异大，不套用统一摊销年限）。
- 结合 Mauboussin《[To Free or Not to Free (Cash Flow)](https://www.morganstanley.com/im/en-us/individual-investor/insights/consilient-observer/to-free-or-not-to-free.html)》的增量投入资本回报率（ROIIC）视角：当企业处于高资本开支或高研发扩张期时，应重点追踪边际新增资本的回报（ROIIC）是否高于资本成本，而不是仅凭当期自由现金流转负或会计利润承压就否定其再投资价值；详见 [free-cash-flow-and-valuation-basis](/concepts/company-analysis/free-cash-flow-and-valuation-basis)。

## 常见误判

- 把净资产收益率当作资本回报。论文区分了两者：净资产收益率只衡量股东权益部分，分子是扣除债务成本后的净利润，且不剔除现金。负债水平不同的公司之间，不能直接用它比较经营质量（后一句为本页推论）。
- 忽略会计处理造成的失真。论文列出的主要来源：研发和经营租赁被当作当期费用；一次性和重组费用扭曲利润；资产减记会缩小投入资本，使回报平平的公司显得回报很高；并购商誉抬高投入资本；交叉持股。
- 用最近一年的利润代表存量资产的正常盈利，而该年并不典型。
- 假设高回报可以无限期维持，不考虑竞争和规模带来的回落。
- 把净利润增长等同于可分配现金增加（本页推论）。

## 结论如何验证

事前记录所用的资本回报口径、再投资率、增长假设和它们之间的勾稽关系。之后用新披露核对实际资本开支、营运资本和利润增量，计算边际回报是否与事前假设一致。口径调整（如是否剔除商誉、现金）要写明，换口径后的结论变化也应一并呈现。

## Relations

- related: [company-analysis-decision-map](/queries/company-analysis-decision-map), [competitive-advantage-period-and-capital-allocation](/concepts/company-analysis/competitive-advantage-period-and-capital-allocation), [balance-sheet-solvency-and-distress-risk](/concepts/company-analysis/balance-sheet-solvency-and-distress-risk), [cyclical-earnings-normalization](/concepts/company-analysis/cyclical-earnings-normalization), [price-implied-expectations-analysis](/concepts/company-analysis/price-implied-expectations-analysis), [free-cash-flow-and-valuation-basis](/concepts/company-analysis/free-cash-flow-and-valuation-basis), [earnings-quality-and-cash-conversion](/concepts/company-analysis/earnings-quality-and-cash-conversion), [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system), [investment-risk-control-framework](/concepts/investment-risk-control-framework)

