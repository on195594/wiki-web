---
title: 公司基本面分析决策地图
created: 2026-11-19
updated: 2026-11-25
type: query
tags:
  - investment
  - research
  - decision
  - risk-control
sources:
  - concepts/company-analysis/earnings-quality-and-cash-conversion.md
  - concepts/company-analysis/balance-sheet-solvency-and-distress-risk.md
  - concepts/company-analysis/cyclical-earnings-normalization.md
  - concepts/company-analysis/growth-reinvestment-and-return-on-capital.md
  - concepts/company-analysis/competitive-advantage-period-and-capital-allocation.md
  - concepts/company-analysis/free-cash-flow-and-valuation-basis.md
  - concepts/company-analysis/price-implied-expectations-analysis.md
  - concepts/ordinary-investor-investment-system.md
  - concepts/investment-risk-control-framework.md
  - queries/pre-trade-risk-checklist.md
  - queries/tactical-trading-execution-decision-map.md
status: stable
description: 按真实研究问题与四步尽调顺序路由公司基本面分析方法卡，并衔接长期配置与交易风控门禁的总入口。
aliases:
  - company-analysis-index
  - fundamental-analysis-decision-map
  - 公司分析决策地图
volatility: low
---

# 公司基本面分析决策地图

## Summary

本页把 `concepts/company-analysis/` 下的公司分析方法卡组织为面向尽调与投资决策的检索总入口，回答两个问题：**面对一家具体公司时，应该按什么顺序核查基本面？遇到特定财务或估值疑问时，应该先调用哪张方法卡？**

所有方法卡都是证据核查框架，不是自动选股器或买卖信号；最终判断仍须回到公司原始披露、同口径数据与 [investment-risk-control-framework](/concepts/investment-risk-control-framework) 的仓位风控边界。

## 使用边界

- 本页适用于非金融类企业的公开基本面研究；银行、保险、券商等金融企业以及尚无稳定经营现金流的早期亏损企业不能机械套用常规现金流与 ROIC 比率。
- 方法卡之间是互补与递进关系，不以单一指标（如低 PE、高股息率、高报表 FCF 或单一 DCF 目标价）直接做出投资结论。
- 基本面研究通过不等于立即下单；进入组合前仍须经过 [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system) 的资金分层与 [pre-trade-risk-checklist](/queries/pre-trade-risk-checklist) 的交易前风控门禁。

## 四步标准尽调顺序

`[综合]` 评估一家新标的或复核已有持仓时，建议按以下四步推进，避免在利润质量或周期位置未核清前直接陷入估值计算：

| 阶段 | 核心问题 | 主调用方法卡 | 阻断或降级条件 |
| :--- | :--- | :--- | :--- |
| **第一步：质量与生存闸门** | 报告利润是否转化为经营现金流？资产负债表与债务到期结构能否承受下行冲击？ | [earnings-quality-and-cash-conversion](/concepts/company-analysis/earnings-quality-and-cash-conversion) · [balance-sheet-solvency-and-distress-risk](/concepts/company-analysis/balance-sheet-solvency-and-distress-risk) | 存在无法桥接的持续不回款、账龄/库龄恶化，或短期流动性无法覆盖到期债务/困境概率显著时，降级为“待核查”或直接规避。 |
| **第二步：商业模式、周期与护城河校准** | 盈利是否处于景气高位？ROIC/ROIIC 是否高于资本成本、护城河能维持多久（CAP）、管理层资本配置是否创造价值？ | [cyclical-earnings-normalization](/concepts/company-analysis/cyclical-earnings-normalization) · [growth-reinvestment-and-return-on-capital](/concepts/company-analysis/growth-reinvestment-and-return-on-capital) · [competitive-advantage-period-and-capital-allocation](/concepts/company-analysis/competitive-advantage-period-and-capital-allocation) | 周期高位利润未正常化、增长伴随低于资本成本的再投资、或管理层持续毁灭价值时，拒绝用当期低 PE 或名义增速外推。 |
| **第三步：现金流口径与预期差** | 估算企业还是股东的现金流？利息、再投资与股权激励如何计入？当前股价隐含了怎样的增速与利润率要求？ | [free-cash-flow-and-valuation-basis](/concepts/company-analysis/free-cash-flow-and-valuation-basis) · [price-implied-expectations-analysis](/concepts/company-analysis/price-implied-expectations-analysis) | 现金流对象与折现率错配、维护资本开支不可拆解且终值过于敏感时，结论保留“不足以定价”。 |
| **第四步：组合角色与风控接入** | 该标的属于核心仓长期配置还是进攻仓机会？仓位上限、失效条件与退出计划是什么？ | [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system) · [investment-risk-control-framework](/concepts/investment-risk-control-framework) · [pre-trade-risk-checklist](/queries/pre-trade-risk-checklist) | 先确定资金层。核心仓默认以分散的宽基配置为主；只有事前方案允许时才配置个股，并记录集中度上限和基本面失效退出条件。进攻仓按止损距离核算实际初始风险（`1R`），同时检查单笔预算与组合风险上限。未满足对应条件时暂缓操作。 |

## 按具体问题快速路由

`[综合]` 以下场景映射用于在研究或复盘中快速定位对应卡片，不替代原卡的完整适用条件：

| 真实研究问题 | 优先阅读卡片 | 关键检查项 |
| :--- | :--- | :--- |
| 利润增长很快，但经营现金流很弱或波动剧烈，是否可信？ | [earnings-quality-and-cash-conversion](/concepts/company-analysis/earnings-quality-and-cash-conversion) | 对齐期间与合并范围；按补充资料及 DISE / IFRS 18 费用拆解核对存货与薪酬；排查反向保理（IAS 7.44H / ASU 2022-04）粉饰 CFO。 |
| 公司负债较高、账面现金存疑或股价大跌后市净率很低，会不会有爆雷/违约风险？ | [balance-sheet-solvency-and-distress-risk](/concepts/company-analysis/balance-sheet-solvency-and-distress-risk) | 核对非受限现金与未来 12–24 个月债务到期墙（含超长账期反向保理隐性刚兑墙）；用下行情景算利息保障倍数；按企业类型核查 Z/Z'/Z'' 与困境出售折价。 |
| 周期股或资源股当前市盈率很低、股息率很高，是不是便宜？ | [cyclical-earnings-normalization](/concepts/company-analysis/cyclical-earnings-normalization) | 核对历史利润率中枢、分业务周期位置与下行情景下的可分配分红，防景气高位低 PE 陷阱。 |
| 高增速公司值不值得给高估值？研发或品牌组织费用高导致账面 ROIC 失真怎么看？ | [growth-reinvestment-and-return-on-capital](/concepts/company-analysis/growth-reinvestment-and-return-on-capital) | 用再投资率与新增资本回报估算经营利润增长；并列会计 ROIC 与研发 + `30%` 非研发 SG&A 组织资本调整口径（FCF 恒定不变），对齐 ASC 842 / IFRS 16 / CAS 21 租赁口径。 |
| 公司历史 ROIC 很高，但能持续多久？管理层并购、回购、分红是在创造还是毁灭价值？ | [competitive-advantage-period-and-capital-allocation](/concepts/company-analysis/competitive-advantage-period-and-capital-allocation) | 按行业结构与进入壁垒评估超额回报的衰减速度与持续年限；核对过去 3–5 年真实资金去向、并购商誉、净回购与高管激励指标。 |
| 报表自由现金流很高但总股本扩张、跨市场准则不一，或 AI/扩产期 FCF 转负，怎么估值？ | [free-cash-flow-and-valuation-basis](/concepts/company-analysis/free-cash-flow-and-valuation-basis) | 对照 US GAAP / CAS / 2027 年 IFRS 18 利息与租赁本金分类；统一 SBC 费用扣减或稀释口径；联合 ROIIC 区分高回报扩张与造血恶化。 |
| 市场共识很乐观或股价与基本面改善背离，怎么判断“是否已定价”？ | [price-implied-expectations-analysis](/concepts/company-analysis/price-implied-expectations-analysis) | 从当前股价反推隐含增速、利润率或预测期；写出最强反向假设；按“发布 → 导入 → 交付 → 收入”核对催化证据阶梯。 |
| 基本面看懂了，如何决定买不买、买多少、跌了怎么复盘？ | [tactical-trading-execution-decision-map](/queries/tactical-trading-execution-decision-map) · [pre-trade-risk-checklist](/queries/pre-trade-risk-checklist) · [combining-two-investment-frameworks](/queries/combining-two-investment-frameworks) · [losing-position-review-method](/queries/losing-position-review-method) | 明确核心仓与进攻仓防火墙；事前写明证伪证据与退出规则，避免亏损后把基本面理由临时改成长期持仓借口。 |

## 跨卡张力与联动核查

- `[综合]` **盈利质量 vs. 扩张再投资**：高增长期营运资本占用上升会导致短期现金转化偏弱，需结合 [earnings-quality-and-cash-conversion](/concepts/company-analysis/earnings-quality-and-cash-conversion)（核查账龄与期后回款）和 [growth-reinvestment-and-return-on-capital](/concepts/company-analysis/growth-reinvestment-and-return-on-capital)（核查再投资率与边际回报）共同判断，不能一刀切判定为劣质盈利。
- `[综合]` **短期 FCF 承压 vs. 高 ROIC 资本开支**：资本开支周期中报表 FCF 可能转负，需联合 [free-cash-flow-and-valuation-basis](/concepts/company-analysis/free-cash-flow-and-valuation-basis) 与 [growth-reinvestment-and-return-on-capital](/concepts/company-analysis/growth-reinvestment-and-return-on-capital) 检验增量投资的 ROIC/ROIIC 与资金链承受力，不能单看当期 FCF 收益率。
- `[综合]` **周期正常化 vs. 价格隐含预期**：对强周期企业直接套用单期利润做反向 DCF 会系统性失真，应先经 [cyclical-earnings-normalization](/concepts/company-analysis/cyclical-earnings-normalization) 确定跨周期盈利中枢与下行情景，并经 [balance-sheet-solvency-and-distress-risk](/concepts/company-analysis/balance-sheet-solvency-and-distress-risk) 检验低谷情景下的偿债能力，再输入 [price-implied-expectations-analysis](/concepts/company-analysis/price-implied-expectations-analysis) 反推市场定价。
- `[综合]` **市场隐含预测期 vs. 护城河持续期（CAP）**：反向估值给出的预测期不自动等于 CAP。须明确终值中新增资本回报何时降至 WACC、存量资产回报如何衰减，再按 [competitive-advantage-period-and-capital-allocation](/concepts/company-analysis/competitive-advantage-period-and-capital-allocation) 检验市场隐含的是新增投资的超额回报期，还是公司整体赚取超额回报的年限。
- `[综合]` **基本面研究 vs. 交易纪律**：基本面深度研究容易诱发确认偏误与回本效应；事前在 [price-implied-expectations-analysis](/concepts/company-analysis/price-implied-expectations-analysis) 中写明可核查的反向假设与验证时间点，事后用 [losing-position-review-method](/queries/losing-position-review-method) 区分正常波动与逻辑证伪。

## AI Agent 使用方式

- `[推论]` 当用户询问某家公司“贵不贵”“财报有没有问题”“能不能买”时，先按本页“按具体问题快速路由”检索 1–2 张最相关的方法卡，再要求以公司原始财报和披露数据逐项作答。
- `[推论]` 若原始披露缺少关键附注（如维护性资本开支拆分、分部利润、账龄明细或债务到期结构），应明确保留“未知”与缺口清单，不编造默认比例或补全假设。
- `[推论]` 本页仅沉淀研究与路由方法，不构成任何具体标的的投资建议，也不自动触发任何交易或组合变更。

## Relations

- depends_on: [earnings-quality-and-cash-conversion](/concepts/company-analysis/earnings-quality-and-cash-conversion), [balance-sheet-solvency-and-distress-risk](/concepts/company-analysis/balance-sheet-solvency-and-distress-risk), [cyclical-earnings-normalization](/concepts/company-analysis/cyclical-earnings-normalization), [growth-reinvestment-and-return-on-capital](/concepts/company-analysis/growth-reinvestment-and-return-on-capital), [competitive-advantage-period-and-capital-allocation](/concepts/company-analysis/competitive-advantage-period-and-capital-allocation), [free-cash-flow-and-valuation-basis](/concepts/company-analysis/free-cash-flow-and-valuation-basis), [price-implied-expectations-analysis](/concepts/company-analysis/price-implied-expectations-analysis)
- related: [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system), [investment-risk-control-framework](/concepts/investment-risk-control-framework), [tactical-trading-execution-decision-map](/queries/tactical-trading-execution-decision-map), [pre-trade-risk-checklist](/queries/pre-trade-risk-checklist), [when-not-to-trade](/queries/when-not-to-trade), [losing-position-review-method](/queries/losing-position-review-method), [combining-two-investment-frameworks](/queries/combining-two-investment-frameworks)

