---
title: 增长、再投资与资本回报
created: 2026-11-14
updated: 2026-11-25
type: concept
tags:
  - investment
  - research
sources:
  - https://pages.stern.nyu.edu/~adamodar/pdfiles/papers/returnmeasures.pdf
  - https://pages.stern.nyu.edu/~adamodar/podcasts/valspr20/session9slides.pdf
  - https://pages.stern.nyu.edu/~adamodar/pdfiles/papers/R_D.pdf
  - https://aswathdamodaran.blogspot.com/2019/02/january-2019-data-update-7-debt-neither.html
  - https://gaapio.com/blog/asc-842-vs-ifrs-16-lease-accounting-differences
  - https://www.legal500.com/intelligence/china/accounting-and-audit/cas-21-compliance-impacting-key-growth-sectors
  - https://ideas.repec.org/a/eee/jfinec/v123y2017i2p251-272.html
  - https://www.nber.org/system/files/working_papers/w28988/w28988.pdf
  - https://www.morganstanley.com/im/publication/insights/articles/article_returnoninvestedcapital.pdf
  - https://www.morganstanley.com/im/publication/insights/articles/article_roicandintangibleassets_us.pdf
  - https://www.morganstanley.com/im/en-us/individual-investor/insights/consilient-observer/to-free-or-not-to-free.html
  - docs:https://zenodo.org/records/20650537
status: stable
description: 公司分析方法卡：增长需要多少再投资、资本回报是否高于资本成本，以及 ROIC 的口径、研发与非研发 SG&A
  组织资本调整、后租赁并表时代跨准则校准与“可持续增长悖论”实证边界。
aliases:
  - 增长与再投资
  - 投入资本回报率
volatility: low
verified_at: 2026-11-14
review_by: 2027-11-14
---

# 增长、再投资与资本回报

## Summary

关键词：ROIC、ROC、ROE、资本回报、投入资本回报率、再投资率、增长质量、增长创造价值、超额回报、资本开支、营运资本、留存比例、边际回报、商誉、研发资本化、可持续增长悖论、FCFROIC、因子敞口。

增长本身不等于价值。本卡回答两个问题：公司要实现预期的增长需要投入多少资本，以及这些资本赚到的回报是否高于其成本。它把“增长率”拆成“再投资率 × 资本回报”，并列出资本回报在会计口径上常见的失真。

方法卡是分析线索，不是任何具体公司的事实；公司的数字仍要回到它自己的披露和可追溯数据。

## 来源与核对范围

- Aswath Damodaran，《Return on Capital (ROC), Return on Invested Capital (ROIC) and Return on Equity (ROE): Measurement and Implications》，2007 年 7 月。2026-11-14 读取定义、计量问题各节标题、边际回报与结论段；租赁的具体算例未逐项核对。
- Aswath Damodaran 估值课程 2020 年春季第 9 讲课件（增长的基本面估计）。2026-11-14 读取增长公式相关页。
- Aswath Damodaran，《Research and Development Expenses: Implications for Profitability Measurement and Valuation》（[R_D.pdf](https://pages.stern.nyu.edu/~adamodar/pdfiles/papers/R_D.pdf)）。2026-11-19 核对将研发支出作为可抵税资本性支出重分类、对营业利润与投入资本的影响方向；未逐项复算原文行业摊销年限表与公司算例。
- Michael J. Mauboussin & Dan Callahan，《To Free or Not to Free (Cash Flow)》（Morgan Stanley Counterpoint Global，2026-09-17，[页面摘要](https://www.morganstanley.com/im/en-us/individual-investor/insights/consilient-observer/to-free-or-not-to-free.html)）。2026-11-19 核对关于增量投入资本回报率（ROIIC）与“当新增投资的预期回报高于资本成本时阶段性负 FCF 可合理存在”的核心论点；未逐项复算全文公司模型。
- Fabio Brina，《Which Stock Screens Actually Work? A Survivorship-Free Audit of 16 Fundamental Metrics — ROIC, Value, Momentum, and Quality — on the S&P 500 (2010–2024)》（Zyberno Research，Working Paper v1.0，2026-06-12，[Zenodo 记录页](https://zenodo.org/records/20650537)，[全文 PDF](https://zenodo.org/records/20650537/files/Which_Stock_Screens_Actually_Work_v1.0.pdf?download=1)，DOI `10.5281/zenodo.20650537`）。2026-11-21 读取全文并核对 16 项指标秩相关、五分位收益差、Fama-MacBeth/Newey-West 检验与 FF5+动量回归截距表；未在本地复跑随附代码与数据集。
- Ryan H. Peters & Lucian A. Taylor，《Intangible Capital and the Investment-q Relation》（*Journal of Financial Economics* 123(2)，251–272，2017，[IDEAS/RePEc 摘要页](https://ideas.repec.org/a/eee/jfinec/v123y2017i2p251-272.html)；永续盘存法参数参见 [NBER w28988](https://www.nber.org/system/files/working_papers/w28988/w28988.pdf)），以及 Michael J. Mauboussin & Dan Callahan，《[Return on Invested Capital](https://www.morganstanley.com/im/publication/insights/articles/article_returnoninvestedcapital.pdf)》（2022-10-06）与《[ROIC and Intangible Assets](https://www.morganstanley.com/im/publication/insights/articles/article_roicandintangibleassets_us.pdf)》（2022-11-09）。2026-11-25 核对知识资本与组织资本（`30%` 非研发 SG&A）资本化约定，以及无形资产重分类不改变自由现金流、压缩极端 ROIC 离散度的勾稽性质；对照 [Damodaran 2019 年租赁并表更新](https://aswathdamodaran.blogspot.com/2019/02/january-2019-data-update-7-debt-neither.html)、[ASC 842 vs. IFRS 16 租赁差异](https://gaapio.com/blog/asc-842-vs-ifrs-16-lease-accounting-differences) 与 [中国 CAS 21 准则](https://www.legal500.com/intelligence/china/accounting-and-audit/cas-21-compliance-impacting-key-growth-sectors) 校准后并表时代口径。

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

**五（续）、非研发 SG&A 组织资本调整与后并表时代租赁校准。**
- **组织资本（Organization Capital）重分类与两条严格财务恒等边界**：Peters & Taylor（2017，[*Journal of Financial Economics* 123(2), 251–272](https://ideas.repec.org/a/eee/jfinec/v123y2017i2p251-272.html)；永续盘存法参数亦见 [NBER w28988](https://www.nber.org/system/files/working_papers/w28988/w28988.pdf)）将企业内部积累的无形资本拆为两块：`100%` 的研发支出计入知识资本（按行业寿命摊销），并将**先剔除内含研发费用后的非研发销售、一般及行政费用（non-R&D SG&A，注意美股 Compustat 标准字段 `XSGA` 常合并研发，须先剥离 `XRD` 防止重复资本化）**中 **`30%` 视为建立品牌、客户关系、人力与组织流程的长期组织资本投资**（其余 `70%` 维持当期运营费用，学术实证常取 `20%` 年摊销率即约 5 年寿命）。Mauboussin & Callahan 在《[Return on Invested Capital](https://www.morganstanley.com/im/publication/insights/articles/article_returnoninvestedcapital.pdf)》（2022-10）与《[ROIC and Intangible Assets](https://www.morganstanley.com/im/publication/insights/articles/article_roicandintangibleassets_us.pdf)》（2022-11，附录及尾注 3）中既指出了 Peters-Taylor 固定比例未区分维护性研发与分行业差异的两项局限（实务可改按分行业资本化率与摊销年限校准），又证明无形资本化遵循两条核心性质：（1）**自由现金流严格不变性（$\text{FCF}_{\text{adj}} \equiv \text{FCF}_{\text{unadj}}$）**——同一年份对 NOPAT 与净投资（$\text{Net Investment}$）加上的净无形投资额（当期资本化支出减当期摊销）完全相等，在 $\text{FCF} = \text{NOPAT} - \text{Net Investment}$ 中精确抵消；（2）**ROIC 横截面离散度向均值收敛（介值不等式充要条件）**——设重分类对分子与累计平均投入资本的增量分别为 $\Delta_{\text{NOPAT}}$ 与 $\Delta_{\text{IC}} > 0$，则 $\text{ROIC}_{\text{adj}} = \frac{\text{NOPAT} + \Delta_{\text{NOPAT}}}{\text{IC} + \Delta_{\text{IC}}}$：当且仅当无形增量的隐含回报比率 $\frac{\Delta_{\text{NOPAT}}}{\Delta_{\text{IC}}} < \text{ROIC}_{\text{trad}}$（高账面 ROIC 成熟轻资产龙头普遍满足，如原文 2022 财年微软由 `49%` 降至 `34%`）时调整压低 ROIC；反之对传统口径深度亏损或低回报的高投入成长期公司（$\frac{\Delta_{\text{NOPAT}}}{\Delta_{\text{IC}}} > \text{ROIC}_{\text{trad}}$，如原文 Snowflake 由 `-416%` 升至 `+3%`）则抬升 ROIC。实务分析应先核查非研发 SG&A 是否确实形成跨期客户留存或渠道壁垒，避免把低效行政开支包装成无形投资（本页推论）。
- **2019–2021 年租赁准则并表后的跨准则口径对齐**：Damodaran 2007 年原文撰写时，各国准则普遍将经营租赁列在表外费用化；但自 **IFRS 16**（2019 年生效）、**US GAAP ASC 842**（2019 年对公众公司生效）与 **中国 CAS 21**（2021 年全面施行）落地后，承租人超过 12 个月的经营租赁通常须上表；IFRS 16 与中国 CAS 21 允许对低价值资产租赁选择豁免，不因租期超过一年而失效。先查会计政策与附注，确认哪些租赁已列为资产负债表上的“使用权资产（ROU Asset）”与“租赁负债（Lease Liability）”（参见 [Damodaran 2019 年租赁债务处理更新](https://aswathdamodaran.blogspot.com/2019/02/january-2019-data-update-7-debt-neither.html)、[ASC 842 vs. IFRS 16 差异](https://gaapio.com/blog/asc-842-vs-ifrs-16-lease-accounting-differences) 与 [中国 CAS 21 实务](https://www.legal500.com/intelligence/china/accounting-and-audit/cas-21-compliance-impacting-key-growth-sectors)）。当前计算 ROIC 时无须再对已上表租赁重复手工折现，但须消除损益表非对称偏差：IFRS 16 与中国 CAS 21 将租赁成本拆分为使用权资产折旧（计入营业利润 EBIT）和租赁负债利息（计入财务费用，在 EBIT 之下），其报表 EBIT 天然是付息前口径；而 **US GAAP ASC 842 下的经营租赁仍在营业利润（EBIT）内扣除单一综合直线租金费用（隐含了利息成分）**。因此，若将美股公司的经营租赁负债纳入投入资本（IC），必须在分子 EBIT 中加回经营租赁负债对应的隐含利息费用（即在税后 NOPAT 中加回**税后隐含租赁利息** $\text{Interest}_{\text{lease}} \times (1 - t)$，避免税前与税后口径错配），否则美股重租赁企业的 NOPAT 与 ROIC 会相对 IFRS / A 股同行被系统性低估（现金流量表侧的租赁本金错配见 [free-cash-flow-and-valuation-basis](/concepts/company-analysis/free-cash-flow-and-valuation-basis)）。

**六、大盘股实证审计中的“可持续增长悖论”与因子敞口边界。** Fabio Brina（2026，[Zenodo:20650537](https://zenodo.org/records/20650537)）逐年重建 2010–2024 年标普 500 成分名单，完整成分股总体按公司去重后为 771 家；筛选指标审计使用其中的非金融样本，基础样本为 2,103 个公司—年度观测值，部分指标另用下列子样本。论文以财年末后 90 天为建仓时点，追踪未来 5 年相对 SPY 的年化超额总回报，采用横截面 Spearman 秩相关与五分位收益差（规避因约 72% 成分股跑输市值加权指数造成的单边胜率虚高），审计 16 项常用筛选指标：

- **ROIC 的跨期稳健性与对 ROE 的压倒性优势**：ROIC（$\text{NOPAT}/\text{IC}$）是全部 16 项指标中最具预测力的单一指标（池化秩相关 `+0.112`，Fama-MacBeth/Newey-West $t = +5.94$，五分位多空年化收益差 `+3.0 pp/yr`），在样本前半段（`<= 2014`，`+0.142`）与后半段（`>= 2015`，`+0.100`）均保持稳健。在完全相同的 1,843 个子样本上，ROIC（`+0.102`）的池化秩相关约为 ROE（`+0.006`，Q5−Q1 年化收益差 `-1.1 pp/yr`）的 17 倍，主因是高净杠杆（`-0.086`，Q5−Q1 `-3.1 pp/yr`）在该时期拖累回报，而 ROE 混入了杠杆污染；资产增长（`+0.015`，全样本）以及跑在各自标注子样本上的毛利资产比（`+0.023`，`n = 1,644`）、Sloan 应计（`-0.012`，`n = 1,906`）与 Piotroski F-score（`+0.006`，`n = 946`）在大盘股中均衰减至接近零。
- **可持续增长悖论（Sustainable-Growth Paradox）**：教科书与两阶段 DCF 常用的可持续增长率公式 $g = \text{ROIC} \times \text{RR}$（论文将净再投资率 $\text{RR} = \text{净再投资}/\text{NOPAT}$ 截断于 `[0, 1]` 区间）在作为排序因子时几乎失效（池化秩相关 `+0.012`，FM $t = -0.07$）。原因在于它把正向盈利因子 ROIC 与负向再投资率因子 RR（池化秩相关 `-0.045`，FM $t = -3.64$；多元 Fama-MacBeth 回归中每增加 1 个标准差对应年化超额收益 `-0.91 pp/yr`，NW $t = -3.09$）相乘，两者符号相反且近似独立（秩相关 `-0.07`），信号相互抵消。
- **FCFROIC 筛选指标与实际现金流比率**：论文以 $\text{ROIC} \times (1 - \text{RR}_{\text{clip}})$ 构造 FCFROIC 筛选指标，$\text{RR}_{\text{clip}}$ 为截断于 `[0, 1]` 的净再投资率。该指标的池化秩相关为 `+0.084`（FM $t = +6.11$，Q5−Q1 `+2.9 pp/yr`），仍低于纯 ROIC；等权复合 `FCFROIC + 盈利收益率 + 12 个月动量`（`+0.040`）及 Magic Formula（`ROIC + 盈利收益率`，`+0.057`）也低于纯 ROIC。财务勾稽使用未截断的净再投资率：按相同经营口径，实际经营自由现金流比率为 $(\text{NOPAT} - \text{净再投资}) / \text{IC}$。例如 NOPAT 为 20、净再投资为 30、投入资本为 100 时，筛选指标为 `0%`，实际比率为 `−10%`。
- **因子敞口而非超额 Alpha**：将 171 个月的五分位等权多空组合对 Fama-French 五因子 + 动量回归后，全部 10 个测试组合的截距项均不显著（每个 $|t(\alpha)| < 1$，ROIC 年化 $\alpha = +0.6\%$，$t = +0.25$）；论文同时提示大盘股子集（约 450 只股票）下等权多空回归的统计功效有限，但点估计在经济量级上仍偏小，说明这些指标主要提供盈利/质量等已知因子敞口，而非“免费午餐”。同时作者将“收益率预测筛选”与“评估价格隐含预期的估值原则”明确区分，对应 [price-implied-expectations-analysis](/concepts/company-analysis/price-implied-expectations-analysis) 的定位。

本页推论（实证边界与 A 股制度适配）：
- 该审计覆盖单一市场与单一“质量占优、价值承压”的制度期（2010–2024 年，不含典型价值牛市），且未计交易成本；因此 Book/Market 垫底（`-0.126`）不能外推为价值因子永久失效，也不能把美股大盘股中的 ROIC 溢价当作跨市场保证。
- 在 A 股使用 $\text{FCFROIC}$ 或再投资率检验时，须结合中国《企业会计准则第 31 号》核对筹资活动中的“偿付利息支付的现金”与票据/保理影响，并对照研发资本化与在建工程转固节奏，避免直接用未调整报表口径机械排序。
- 公式层面的增长分解 $g = \text{ROIC} \times \text{RR}$ 适合做内部财务勾稽与再投资合理性校验，但不宜直接当作机械选股排序指标；遇到高再投资率公司时，须回到边际 ROIIC 与现金流口径逐案核查。

## 常见误判

- 把净资产收益率当作资本回报。论文区分了两者：净资产收益率只衡量股东权益部分，分子是扣除债务成本后的净利润，且不剔除现金。负债水平不同的公司之间，不能直接用它比较经营质量（后一句为本页推论）。
- 忽略会计处理造成的失真。Damodaran（2007）指出的失真源包括：研发与品牌/组织建设支出被全部当期费用化（对 2019/2021 年之前历史财报还包含表外经营租赁；现行 IFRS 16 / ASC 842 / CAS 21 已将长期租赁并表，但美股 ASC 842 经营租赁在投入资本含租赁负债时若不加回隐含利息仍会扭曲分子）；一次性和重组费用扭曲利润；资产减记会缩小投入资本，使回报平平的公司显得回报很高；并购商誉抬高投入资本；交叉持股。
- 用最近一年的利润代表存量资产的正常盈利，而该年并不典型。
- 假设高回报可以无限期维持，不考虑竞争和规模带来的回落。
- 把净利润增长等同于可分配现金增加（本页推论）。
- 把可持续增长公式 $g = \text{ROIC} \times \text{RR}$ 直接当作选股排序因子，忽略高再投资率在统计平均意义上对股东回报的拖累；或用“跑赢市值加权指数的胜率”高估单边筛选策略的真实信息含量。

## 结论如何验证

事前记录所用的资本回报口径、再投资率、增长假设和它们之间的勾稽关系。之后用新披露核对实际资本开支、营运资本和利润增量，计算边际回报是否与事前假设一致。口径调整（如是否剔除商誉、现金）要写明，换口径后的结论变化也应一并呈现。

## Relations

- depends_on: [earnings-quality-and-cash-conversion](/concepts/company-analysis/earnings-quality-and-cash-conversion)
- related: [company-analysis-decision-map](/queries/company-analysis-decision-map), [competitive-advantage-period-and-capital-allocation](/concepts/company-analysis/competitive-advantage-period-and-capital-allocation), [free-cash-flow-and-valuation-basis](/concepts/company-analysis/free-cash-flow-and-valuation-basis), [price-implied-expectations-analysis](/concepts/company-analysis/price-implied-expectations-analysis)

