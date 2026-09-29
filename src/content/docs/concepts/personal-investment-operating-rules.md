---
title: Investment Risk Control Framework
created: 2026-04-17
updated: 2026-09-20
type: concept
tags:
  - investment
  - governance
  - risk-control
sources:
  - concepts/leontraveller-trading-and-investment-system.md
  - concepts/ordinary-investor-investment-system.md
status: stable
description: 汇总可参数化的长期配置、主动交易、风控和行为纪律运行规则。
aliases:
  - investment-operating-rules
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
- 不抄底，不摊平亏损仓位
- 不碰看不懂收益来源的结构化产品
- 不因为“觉得便宜”就买弱势标的
- 不在没有预设止损和仓位的情况下开仓
- 不把主账户变成高波动试验田

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
1. 我买的是配置资产，还是交易标的？
2. 现在的理由是基于趋势/系统，还是基于情绪/想象？
3. 如果错了，我在哪个价格或哪个时间点认错？
4. 这笔交易亏损后，会不会影响我后续继续执行系统？

只要有一个问题答不上来，就不下单。

## Exit rules
卖出不靠感觉，靠预先定义的情形：
- 核心仓：到再平衡点、配置逻辑失效、或资产属性发生变化
- 进攻仓：止损触发、时间止损触发、趋势结构破坏、或达到既定退出计划

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

## Risk framework
风险管理优先级：
1. 避免致命亏损
2. 控制年度回撤
3. 控制单笔仓位
4. 控制连续错误时的净值损伤
5. 最后才是提高收益率

这意味着：
- 大亏一次，往往会抹掉很多次小赚
- 好系统首先要能连续活下去
- 收益率高但回撤失控，不算真正可用系统

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
真正适合长期执行的个人投资系统，不是“最聪明”的系统，而是：
- 能保护本金
- 能穿越情绪波动
- 能在工作与家庭节奏下长期坚持
- 能把配置和交易分开处理

## Relations
- depends_on: [leontraveller-trading-and-investment-system](/concepts/leontraveller-trading-and-investment-system)
- depends_on: [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system)

## Related
- [leontraveller-trading-and-investment-system](/concepts/leontraveller-trading-and-investment-system)
- [ordinary-investor-investment-system](/concepts/ordinary-investor-investment-system)
- [money-as-tool-and-investment-vs-consumption-framework](/concepts/money-as-tool-and-investment-vs-consumption-framework)
- [index](/)
- `log`
- [how-i-should-keep-my-trading-system-small-and-executable](/queries/how-i-should-keep-my-trading-system-small-and-executable)

