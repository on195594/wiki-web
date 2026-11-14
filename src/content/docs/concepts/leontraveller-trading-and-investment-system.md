---
title: Trend-Following Trading System (Summary of Leontraveller Public Notes)
created: 2026-04-17
updated: 2026-11-13
type: concept
tags:
  - investment
  - trading
  - workflow
  - risk-control
sources:
  - raw/articles/leontraveller-investment-notes-1-2026-04-17.md
  - raw/articles/leontraveller-investment-notes-2-2026-04-17.md
  - https://www.bauer.uh.edu/tgeorge/papers/gh4-paper.pdf
  - http://depot.som.yale.edu/icf/papers/fileuploads/2533/original/00-71.pdf
  - https://ideas.repec.org/a/eee/jfinec/v78y2005i2p311-339.html
  - https://ideas.repec.org/a/eee/jimfin/v30y2011i1p180-204.html
  - https://buildingarks.files.wordpress.com/2014/06/dynamics-of-leveraged-etfs-bgi-2009.pdf
status: stable
description: 整理 Leontraveller 主动交易和投资系统中的仓位、纪律、风控和复盘规则，结合 52
  周高点锚定动量、未实现资本利得悬顶（Capital Gains Overhang）与杠杆 ETF 方差损耗说明其理论边界。
aliases:
  - leontraveller-investment-system
volatility: low
---

# Trend-Following Trading System (Summary of Leontraveller Public Notes)

## Summary
这两篇笔记可以压缩成一套很鲜明的交易框架：放弃抄底、预测和复杂花活，转向顺势、止损、控回撤、尊重价格行为，并把主动交易限制在自己真正能执行的系统内。

来源：leontraveller.com 公开投资笔记（[leontraveller-investment-notes-1-2026-04-17](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/leontraveller-investment-notes-1-2026-04-17.md)、[leontraveller-investment-notes-2-2026-04-17](https://github.com/on195594/wiki/blob/2669ae0ae21d05d5d45da777aa3c38f9553ca948/raw/articles/leontraveller-investment-notes-2-2026-04-17.md)，含原文 URL 与署名）。

证据边界：本页是对公开来源观点的教育性整理，不构成投资建议，也不包含 Wiki 作者的真实账户、持仓或交易记录。

## Core thesis
如果把作者观点压成一句话，就是：

不要和市场争辩，不要赌自己比市场更聪明；只在趋势和赔率对自己有利时出手，并用止损和仓位控制保证自己能一直留在牌桌上。

## What the author is really optimizing for
作者真正追求的不是“单笔赚最多”，而是：
- 低回撤
- 正期望
- 可重复执行
- 尽量避免大亏
- 让利润在少数正确交易上自然扩张

这意味着他的体系本质上偏交易系统，而不是价值发现系统。

## From cheapness to strength
作者前半段最核心的认知转向，是从“找便宜货”转向“买强不买弱”。

他反对的对象包括：
- 低价股
- 高分红陷阱
- 左侧抄底
- 下跌途中不断摊平
- 仅因估值低或现金多就认定安全

他更认可的对象则是：
- 趋势刚形成的股票
- 创新高后仍有持续动力的标的
- 价格和成交量已经证明市场愿意继续出价的方向

底层逻辑是：
便宜不等于安全，强势也不等于贵得不能买；决定风险收益的不是价格标签，而是趋势结构、卖压状态和仓位纪律。

## Stop arguing with the market
两篇文章里反复出现的一条纪律是：

不要和市场 argue。

这里反对的不是独立思考，而是以下行为：
- 因为自己觉得基本面好，就无视下跌趋势
- 因为觉得“市场定价错了”，就不断补仓
- 把“未来也许会涨回来”误当成当前持仓理由

作者的判断很现实：
- 市场价格先反映当下共识
- 交易的目的是赚钱，不是证明自己对
- 即便最后价格回来了，长期套牢的机会成本仍然很高

## Trend following as the practical answer
作者给出的实操解法是趋势跟随，而不是底部预测。

这套方法的关键动作包括：
- 等趋势先出来，再入场
- 尽量在趋势早期进入
- 用价格 stop 和移动 stop 管理持仓
- 没被 stop 之前尽量拿住
- 若入场后短时间内不按预期发展，就退出

作者尤其强调“时间止损”：
如果一个以日线节奏建立的仓位，在 3 到 5 天内都没有有效走出利润，应默认自己的判断大概率不对，尽快离场。

## Why new highs matter in this framework
作者非常强调一个和普通散户直觉相反的点：

创新高的股票，往往更容易继续上涨。

在他的框架里，这不是玄学，而是持仓结构与心理结构的结果：
- 过去买入的人大多浮盈
- 浮盈仓位更容易持有
- 卖压更轻
- 剩余主导力量更多来自买压

相反，低位反弹股上方常有大量套牢盘，一旦反弹就有人急于解套，导致走势反复受阻。

### 行为金融学与市场微观结构参照：52 周高点锚定与未实现资本利得悬顶

以下文献提供动量与参考点偏差的研究参照，但不直接证明作者关于“创新高卖压轻、反弹遇解套盘”的解释：

1. **52 周高点参考点锚定（52-Week High Anchoring）**：Thomas J. George 与 Chuan-Yang Hwang（2004，*Journal of Finance*，[*The 52-Week High and Momentum Investing*](https://www.bauer.uh.edu/tgeorge/papers/gh4-paper.pdf)）发现，当前股价相对过去 52 周最高价的接近度比率 $\text{PTH}_{i,t} = \frac{P_{i,t}}{\max_{s \in [t-252, t]} P_{i,s}}$ 对未来中短期动量收益的预测力显著强于传统过去涨跌幅本身。作者提出一种与结果一致的解释：交易者可能以 52 周高点作为评估基本面利好的心理锚点：当股价逼近历史/阶段高点时，锚定偏误使市场起初不愿出更高价（对利好反应不足 Underreaction）；一旦基本面或买盘持续推升并突破锚点，被压抑的估值修正随之释放，形成突破后的趋势延续。
2. **未实现资本利得悬顶（Capital Gains Overhang）**：Mark Grinblatt 与 Bing Han（2005，*Journal of Financial Economics*，[*Prospect Theory, Mental Accounting, and Momentum*](http://depot.som.yale.edu/icf/papers/fileuploads/2533/original/00-71.pdf)，[IDEAS/RePEc](https://ideas.repec.org/a/eee/jfinec/v78y2005i2p311-339.html)）结合前景理论与心理账户，将历史成交量加权参考成本价记为 $R_t$，定义未实现资本利得悬顶率：
   $$g_t = \frac{P_t - R_t}{P_t}$$
   这里 $R_t$ 是依据历史价格、换手率与持仓存续权重估计的参考成本代理量，不是所有投资者的真实成本。模型中，浮亏者惜售、浮盈者倾向卖出，使价格对消息反应不足，随后向基本价值收敛而形成动量；因此它并不推出“浮盈越多，卖压越轻”。$g_t>0$ 也不意味着所有持仓都盈利。**[推论]** “反弹接近成本时出现解套卖盘”可作为待检验的交易假设，不能直接作为该论文已证实的机制。

**[推论] 适用边界与反例约束**：上述文献解释的是横截面统计倾向，不保证单只创新高股票必然继续上涨。跨国市场检验（如 [Liu, Liu & Ma, 2011, *Journal of International Money and Finance*](https://ideas.repec.org/a/eee/jimfin/v30y2011i1p180-204.html)）表明，计入真实买卖价差与佣金后，纯机械买入 52 周高点策略在多个市场的净超额收益不再显著，该研究不能据此证明每次突破都能获利。**[推论]** 因此，“买强不买弱”必须与下文的预设止损、时间止损及 [position-sizing-method](/queries/position-sizing-method) 的单笔 `1R` 风险预算绑定使用。

## Risk control is the actual edge
作者几乎把所有长期优势都归到风险控制，而不是选股天赋。

这包括：
- 预先定义止损
- 盈利后尽快把止损提到保本附近
- 控制单笔仓位
- 关注最大回撤而非只看收益率
- 熊市优先保护资本，不强行抄底

作者对收益预期也相当克制：
他反对“每个月稳定赚几个点”的幻想，因为一旦用复利倒推，这样的目标本身就脱离现实。对他而言，真正重要的是让净值曲线尽量平滑，而不是偶尔爆发。

## Simplicity over complexity
作者对复杂策略有明显警惕，尤其是：
- 多腿 options 组合
- 2x / 3x 杠杆 ETF
- 伪分红衍生品
- 不熟悉条款的优先股

他的核心观点不是这些工具绝对不能赚钱，而是：
普通投资者很容易被“高收益外观”诱导，却没有真正理解收益来源、路径依赖和净值侵蚀机制。

因此作者偏向：
- 少碰结构复杂产品
- 少做看似精巧但本质仍在赌方向的交易
- 把系统建立在简单、明确、可复现的规则上

`[推论]` 对每日重置杠杆的 `2x / 3x` 杠杆 ETF，其长期净值侵蚀并非单纯因为管理费高，而是源于固定杠杆重平衡的**二次方方差损耗（Volatility Drag / Convexity Tax）**（Minder Cheng & Ananth Madhavan，2009，*Journal of Investment Management*，[*The Dynamics of Leveraged and Inverse Exchange-Traded Funds*](https://buildingarks.files.wordpress.com/2014/06/dynamics-of-leveraged-etfs-bgi-2009.pdf)）：在连续重平衡近似下，相对底层累计毛收益的 $k$ 次幂，其对数路径修正为 $-\frac{1}{2}k(k-1)\sigma^2 t$；这不是无条件的实际净值损失率，也不能与期望对数增长率中的方差项叠加（完整数学边界见 [investment-risk-control-framework](/concepts/investment-risk-control-framework)）。

## Market structure and the role of TA
作者后期几乎完全转向 TA，并给出两层理由：
- 个体投资者在基本面研究深度上很难胜过机构
- 所有参与者最终都要用真金白银把判断画在价格和成交量上

他还认为，现代市场中大量流动性由程序和算法提供，所以支撑位、阻力位、回撤比例之所以常显得很“精确”，并不神秘，而是机器交易共同强化了这些点位。

这使得 TA 在他的系统里不是装饰，而是主要决策接口。

## The author’s view of alpha
作者并不相信市场永远完全有效，但他也不认为 alpha 来自高深预测。

在他的语境里，alpha 更像来自：
- 情绪稳定
- 尊重价格行为
- 理解对手盘
- 识别强势结构
- 用纪律保住本金
- 在少数真正有优势的时刻才出手

也就是说，优势更多来自行为质量与执行框架，而不是“看得更远”。

## Practical rules distilled from the two essays
如果把两篇文章压缩成可执行规则，可以写成：
- 不抄底，不摊平，不和市场争辩
- 少碰低价股、高分红陷阱和复杂结构产品
- 趋势先出现，再入场
- 创新高和浅回调的强势结构，比低位反弹更值得关注
- 每笔交易先定义止损和仓位，再谈收益
- 盈利后主动上移止损，优先把亏损风险降到最低
- 对主账户先做 ETF / 大类资产配置，再用小部分资金做主动交易
- 看不懂收益来源的产品，一律不碰
- 接受错过，接受拿不住，不用 hindsight 神化历史机会
- 长期看回撤、稳定性和执行力，比看某次收益更重要

## Limits and caveats
这套体系很有实战味，但也有明显边界：
- 它高度依赖个人交易纪律，不适合只想被动长期持有的人直接照搬。
- 作者对 TA 的偏好非常强，对 FA、回测和指数的看法偏主观。
- 对资产配置的讨论相对简略，远不如对交易执行和风险控制讲得透。
- 它更像“经验浓缩后的交易哲学”，不是经严格统计验证的通用投资定理。

## Takeaway
这两篇文章最值得保留的核心，不是某个买点技巧，而是一个顺序：

先避免大亏，再追求盈利；先尊重市场，再表达观点；先建立可执行系统，再谈更高收益。

## Relations

- depends_on: [money-as-tool-and-investment-vs-consumption-framework](/concepts/money-as-tool-and-investment-vs-consumption-framework)
- related: [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system), [leontraveller-vs-ordinary-investor-investment-system](/comparisons/leontraveller-vs-ordinary-investor-investment-system), [investment-risk-control-framework](/concepts/investment-risk-control-framework), [combining-two-investment-frameworks](/queries/combining-two-investment-frameworks), [pre-trade-risk-checklist](/queries/pre-trade-risk-checklist), [when-not-to-trade](/queries/when-not-to-trade), [losing-position-review-method](/queries/losing-position-review-method), [position-scaling-method](/queries/position-scaling-method), [position-sizing-method](/queries/position-sizing-method), [winning-position-risk-management](/queries/winning-position-risk-management), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)

