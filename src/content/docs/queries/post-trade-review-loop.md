---
title: Building a Post-Trade Review Loop
created: 2026-04-17
updated: 2026-11-09
type: query
tags:
  - investment
  - trading
  - validation
  - workflow
sources:
  - queries/pre-trade-risk-checklist.md
  - queries/losing-position-review-method.md
  - queries/winning-position-risk-management.md
  - queries/inaction-vs-action-decision-framework.md
  - concepts/investment-risk-control-framework.md
  - concepts/agent-closed-loop-learning-from-corrections-to-rules.md
  - docs:https://www.pnlledger.com/expectancy-r-multiples-the-plain-english-guide/
status: stable
description: 回答如何建立交易后复盘闭环，结合过程合规性、R 倍数期望值分布与单步规则修正提升系统执行力。
aliases:
  - how-i-should-build-a-post-trade-review-loop
volatility: low
---

# Building a Post-Trade Review Loop

## Summary
这页不是为了写漂亮复盘，而是为了防止两种常见自欺：赚了就以为自己对，亏了就以为市场错。目标是把每笔交易结束后的感受，压缩成可复用的规则修正输入，让下一笔不是在重复同样的情绪，而是在使用更清晰的系统。
Public boundary: this is educational risk-control material, not investment advice or a record of any real account, holding or trade.
First-person wording in checklists and questions is a reusable self-check script, not a record of any author's experience.


## Question
一笔交易结束后，我应该怎么复盘，才能真的帮助下一轮决策，而不是只是情绪总结？

## One-line rule
复盘先看过程是否合格，再看结果；先问自己有没有按系统做，再问盈亏是多少。

## Step 1: separate process review from outcome review
很多复盘会一上来就看：
- 赚了多少
- 少赚了多少
- 为什么没卖在最高
- 为什么没买在最低

这类复盘通常很快就滑向 hindsight。

更好的顺序是先分两层：

### 过程复盘
看的是：
- 有没有按既定规则执行
- 入场理由是否清晰
- 仓位是否合规
- 止损、减仓、等待是否按计划进行

### 结果复盘
看的是：
- 盈亏结果如何
- 风险回报是否匹配
- 是否存在结构性改进空间

先后顺序不能反过来。

因为好结果可能来自坏过程，坏结果也可能来自好过程。

### 用 R 倍数期望值（R-Expectancy）连接单笔过程与多笔结果

依据 [P&L Ledger 对 R 倍数与交易期望值的核算指南](https://www.pnlledger.com/expectancy-r-multiples-the-plain-english-guide/)，若所有交易均按 [position-sizing-method](/queries/position-sizing-method) 标准化为初始风险单位 $1R$，则多笔样本下的结果复盘不再受单笔绝对金额或标的波动率扭曲，可直接核算系统的**单笔 R 期望值（Expectancy in R）**：

$$\widehat{E[R]} = \frac{1}{n}\sum_{i=1}^{n}R_i = p_+\,\text{AvgWin}_R + p_-\,\text{AvgLoss}_R$$

其中 $n>0$，$p_+$、$p_-$ 分别为全部交易中盈利与亏损的比例，$\text{AvgWin}_R$ 为盈利交易的平均正 R 倍数，$\text{AvgLoss}_R$ 为亏损交易的平均负 R 倍数。净盈亏为零的交易仍计入 $n$，对分子贡献零；仅在没有零收益交易时才有 $p_-=1-p_+$。缺少盈利或亏损样本时优先直接计算样本均值，不计算空集合条件均值。所有 R 倍数均按扣除手续费及实际滑点后的盈亏核算；历史样本均值不保证未来期望为正。辅助指标包括**R 盈亏比** $\frac{\text{AvgWin}_R}{|\text{AvgLoss}_R|}$ 与**R 获利因子** $\frac{\sum R_{\text{win}}}{|\sum R_{\text{loss}}|}$（不是资金盈亏比/获利因子；初始风险金额不同时两者会不同）。所需样本缺失或分母为零时记为未定义，不强行输出有限比值。

**[推论]** 将过程复盘与 R 分布结合，可以快速定位系统漏损源：
- **合规损失与模型偏差**：按规则退出的亏损可能是正常波动，也可能揭示策略失效、成本低估或跳空风险；合规不等于系统必有正期望。不能因单笔亏损推翻规则，也不能因“合规”而忽略持续负期望或未建模风险。
- **执行偏差与风险模型缺口分开**：用当时可见信息、订单与预设规则判断是否存在拖延止损、越权补仓或漏检；$-2R$ 本身不能证明违规，事后曾到 $+3R$ 也不能证明在 $+0.5R$ 卖出错误。对可重复的执行偏差，进入 [repeat-mistake-detection-in-trading](/queries/repeat-mistake-detection-in-trading) 与 [trading-lessons-to-hard-rules](/queries/trading-lessons-to-hard-rules)；对合规仍发生的尾部损失，检查策略与风险模型。这里借用 [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules) 的证据治理顺序，不将跨领域类比当作策略有效性的证明。

## Step 2: ask the most important first question
每次复盘，先问：

这笔交易，是不是一笔“合格交易”？

所谓合格，不等于赚钱，而是：
- 下单前有清晰理由
- 资金层归类正确
- 仓位大小合理
- 动作没有被情绪驱动
- 退出和持有逻辑一致
- 没有临时改规则给自己开特例

如果一笔单子赚了钱，但过程不合格，它不该被当成成功样板。

## Step 3: review the trade in timeline order
复盘不要只看结果点，要按顺序重建：
1. 当时为什么想做
2. 当时看到的 setup 是什么
3. 为什么用这个仓位
4. 后续有没有按计划执行
5. 中间情绪在哪些地方开始干扰
6. 最终是如何退出或继续处理的

按时间顺序复盘的好处是：
- 容易看出是哪里开始偏
- 不容易被最终结果倒灌解释
- 更容易发现“本来是对的，后来被自己搞坏”这种问题

## Step 4: explicitly identify the main error type
每笔问题单最好只抓主错误，不要一次写十个模糊问题。

常见主错误类型包括：
- 入场过早
- 没等确认
- 仓位过大
- 情绪化加仓或减仓
- 止损执行差
- 把交易单抱成长期单
- 没有清晰退出计划
- 在不该动时硬动
- 在该动时拖着不动

一次只抓最影响结果的那个，后续规则修正才会更有力。

## Step 5: do not overlearn from a single trade
一笔单子结束后，很容易走向两个极端：
- 赚了就觉得这套方法真神
- 亏了就想把规则全改掉

都不对。

更合理的问法是：
- 这是偶然波动，还是重复模式？
- 这个问题之前出现过吗？
- 它属于单次执行失误，还是系统性漏洞？

不要因为一笔单子，就立刻重写整个系统。

## Step 6: turn review into one small rule adjustment
真正有用的复盘，最后最好落成一句可执行修正。

例如：
- 下次同类 setup 必须等确认，不再预判抄底
- 回撤期内单笔仓位自动缩小一级
- 任何减仓都必须先写清楚剩余仓位处理计划
- 连续两笔情绪化交易后，强制停手一天

重点不是写多，而是写得足够具体，下次能直接用。

如果复盘最后没有产出任何行为修正，那它大概率只是情绪整理，不是系统迭代。

## Step 7: treat winners and losers symmetrically
要避免只认真复盘亏损，不复盘盈利。

因为：
- 亏损单会暴露痛点
- 盈利单会暴露运气掩盖的问题

尤其要小心：
- 赚钱但过程很差的单子
- 亏钱但过程合格的单子

前者不能奖励，后者不能轻易否定。

否则系统会被结果导向慢慢带偏。

## Step 8: keep the review loop lightweight enough to repeat
复盘不能设计得太重，否则很快就停掉。

一个够用的最小复盘结构通常只要回答：
- 这笔交易合格吗
- 主错误或主优点是什么
- 下次要保留或修正哪一条

能稳定重复，比偶尔写一篇长文更重要。

## Simple post-trade template
每笔交易结束后，最少写这几项：
- 这笔是核心仓还是进攻仓？
- 这是合格交易吗？为什么？
- 最大的问题或最大优点是什么？
- 情绪在哪一步开始干扰？
- 下次我要保留或修改的一条规则是什么？

## Quick checklist
复盘时快速问自己：
- 我现在是在看过程，还是只盯结果？
- 这笔单子如果反过来盈亏，我还会做同样评价吗？
- 这次问题是偶发，还是重复出现？
- 我最后有没有提炼出一条下次能执行的修正规则？

只要最后一问答不出来，这次复盘就还没完成。

## Minimal version for immediate use
每笔交易结束后，先问自己三句：
1. 这是一笔合格交易吗？
2. 真正的问题或亮点只有哪一个？
3. 下次我要具体改哪一条？

三句都答清楚，复盘才算完成。

## Takeaway
复盘真正的价值，不是让你更会讲故事，而是让你少犯同一种错。

好的 post-trade review loop 应该做到：
- 不被单次结果绑架
- 不让情绪替代总结
- 不让复盘停在感受层
- 最终回到一条条可执行规则上

## Relations
- depends_on: [pre-trade-risk-checklist](/queries/pre-trade-risk-checklist), [losing-position-review-method](/queries/losing-position-review-method), [winning-position-risk-management](/queries/winning-position-risk-management), [inaction-vs-action-decision-framework](/queries/inaction-vs-action-decision-framework), [investment-risk-control-framework](/concepts/investment-risk-control-framework)
- related: [position-sizing-method](/queries/position-sizing-method), [repeat-mistake-detection-in-trading](/queries/repeat-mistake-detection-in-trading), [trading-lessons-to-hard-rules](/queries/trading-lessons-to-hard-rules), [minimal-executable-trading-system](/queries/minimal-executable-trading-system), [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules)

