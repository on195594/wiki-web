---
title: Detecting Repeat Trading Mistakes
created: 2026-04-17
updated: 2026-09-20
type: query
tags:
  - investment
  - trading
  - validation
  - debugging
sources:
  - queries/how-i-should-build-a-post-trade-review-loop.md
  - queries/my-investment-pre-trade-checklist.md
  - queries/when-i-should-not-trade.md
  - queries/how-i-should-review-a-losing-position.md
  - concepts/personal-investment-operating-rules.md
status: stable
description: 回答如何从多笔交易中识别重复错误，并决定是否升级为规则修正。
---

# Detecting Repeat Trading Mistakes

## Summary
这页不是复盘单笔交易，而是往上一层看：哪些错误不是偶发，而是在反复出现。目标是把“我最近老出同一种问题”的模糊感觉，压缩成可识别的重复模式，再决定哪些该升成硬规则，哪些还只是一次性失误。
Public boundary: this is educational risk-control material, not investment advice or a record of any real account, holding or trade.


## Question
我怎么从多笔交易里识别重复性错误，并把它们变成真正有效的规则修正？

## One-line rule
单笔交易暴露的是事件，多笔相似失误暴露的才是模式；只有模式，才值得升级成硬规则。

## Step 1: stop looking at trades as isolated stories
如果每笔交易都被当成独立故事，你会很难发现：
- 同样的问题已经出现好几次
- 只是换了标的和市场背景
- 错误外观不同，但底层机制一样

所以先换一个视角：
不要问“这笔怎么了”，先问“这类事是不是最近一直在发生”。

## Step 2: group mistakes by mechanism, not by ticker
识别重复错误时，不要按股票代码、日期、盈亏金额分组，而要按错误机制分组。

比如可以分成：
- 太早入场 / 没等确认
- 亏损后补仓
- 仓位过大
- 盈利仓过早卖飞
- 止损拖延
- 回撤期还在高频硬做
- 用核心仓的钱做进攻仓动作
- 情绪明显不稳时仍然下单
- 没有退出计划就入场

这样才能看清真正重复的，是行为，而不是表面行情。

## Step 3: define what counts as a repeat mistake
不是某个问题出现两次就一定要大改系统。

更合理的判断是：
- 同一类错误在短期内反复出现
- 它已经明显影响结果分布
- 它不是偶发失误，而是稳定在相似情境下重现

也就是说，重复性错误通常有三个特征：
- 可命名
- 可复现
- 可归因

不能稳定命名的错误，往往还不够成熟；
不能稳定复现的错误，往往还不够构成模式。

## Step 4: look for the trigger context, not just the error itself
真正要抓的，不只是“我犯了什么错”，还包括：

我通常在什么情境下犯这个错？

比如：
- 连续亏损后更容易超仓
- 市场大涨时更容易追高
- 浮盈出现后更容易过早卖飞
- 很忙很累时更容易跳过检查清单
- 看到别人赚钱时更容易手痒开仓

这一步很重要，因为规则修正真正要针对的是“触发环境”，而不只是表面动作。

## Step 5: separate process bugs from system bugs
很多重复错误其实分两类：

### Process bug
意思是：
- 系统规则本身没问题
- 但你执行不到位
- 问题主要在纪律、状态、流程漏检

例如：
- 明明有止损规则，但总拖
- 明明有仓位规则，但总在激动时放大
- 明明不该交易，但情绪上来还是硬动

### System bug
意思是：
- 规则本身就不够清晰
- 某类情境没有被系统覆盖
- 你每次到类似局面都靠临场发挥

例如：
- 对“什么时候减仓”一直没有清楚规则
- 对“回撤期要不要缩仓”没有制度
- 对“什么时候是再平衡而不是补仓”定义不清

先分清是 process bug 还是 system bug，后面的修正才会有效。

## Step 6: only promote repeat mistakes into rules when the rule is actionable
不是每个重复问题都适合写成规则。

只有当它能被压成明确动作时，才值得升级。

好的规则通常长这样：
- 连续两笔情绪化交易后，强制停手一天
- 回撤期内，进攻仓单笔仓位自动缩小一级
- 任何补仓想法都必须先写明：这是再平衡还是情绪补仓
- 没有退出计划的仓位，一律不得开仓

坏规则通常长这样：
- 要更冷静
- 不要冲动
- 尽量别贪心

后者只是愿望，不是规则。

## Step 7: do not confuse one painful trade with a repeat pattern
有时一笔特别疼的单子，会让人误以为它代表一切。

但痛感不等于频率。

所以要反过来问：
- 这问题之前真的多次出现了吗？
- 还是只是这次亏得特别让人记住？
- 我是因为模式在调整规则，还是因为情绪在找出口？

如果只是单次重伤，不等于它自动值得升成高优先级硬规则。

## Step 8: keep a short list of live repeat mistakes
最实用的做法，不是维护一份很长的问题大全，而是始终只盯当前最活跃的 2-3 个重复错误。

例如当前 live mistakes 可能是：
- 入场过早
- 回撤期仓位不收
- 盈利仓过早减仓

只盯少数几个，才更有机会真的改掉。

一次想修十个问题，通常最后一个都修不动。

## Simple repeat-mistake template
当你怀疑某问题在重复时，最少记录这几项：
- 这个错误叫什么？
- 它最近出现了几次？
- 它通常在什么情境下出现？
- 它属于 process bug 还是 system bug？
- 我准备把它压成哪一条具体规则？

## Quick checklist
判断一个问题值不值得升成规则时，快速问自己：
- 这是偶发，还是最近反复出现？
- 我能不能给它一个稳定名字？
- 我能不能说出它通常在什么情境下触发？
- 我最后能不能把它压成一句可执行动作？

只要最后两问答不出来，就先别急着升规则。

## Minimal version for immediate use
怀疑自己在重复犯错时，先问三句：
1. 这真的是重复模式，还是我只是被这次亏痛了？
2. 这个错误通常在什么情境下出现？
3. 我能把它改写成一条具体规则吗？

三句都答清楚，再升级成规则。

## Takeaway
单笔复盘解决的是“这次哪里错了”；
重复错误识别解决的是“我为什么总在类似地方出错”。

真正有价值的模式识别，不是为了多写总结，而是为了把反复流血的地方，尽快堵成硬规则。

## Relations
- depends_on: [how-i-should-build-a-post-trade-review-loop](/queries/how-i-should-build-a-post-trade-review-loop)
- depends_on: [my-investment-pre-trade-checklist](/queries/my-investment-pre-trade-checklist)
- depends_on: [when-i-should-not-trade](/queries/when-i-should-not-trade)
- depends_on: [how-i-should-review-a-losing-position](/queries/how-i-should-review-a-losing-position)
- depends_on: [personal-investment-operating-rules](/concepts/personal-investment-operating-rules)

## Related
- [how-i-should-build-a-post-trade-review-loop](/queries/how-i-should-build-a-post-trade-review-loop)
- [my-investment-pre-trade-checklist](/queries/my-investment-pre-trade-checklist)
- [when-i-should-not-trade](/queries/when-i-should-not-trade)
- [how-i-should-review-a-losing-position](/queries/how-i-should-review-a-losing-position)
- [index](/)
- `log`

