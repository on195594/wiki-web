---
title: ACA 源码：有效参数与评估预算
created: 2026-11-04
updated: 2026-11-05
type: concept
tags:
  - optimization
  - evaluation
  - research
  - validation
sources:
  - docs:https://github.com/JQSakaJoo/Population-optimization-algorithms-MQL5/blob/2a8fb7522a76cc8afd215ec631258512a96b2bc2/MQL5/Include/Math/AOs/PopulationAO/AO_ACA_AndeanCondorAlgorithm.mqh
  - docs:https://github.com/JQSakaJoo/Population-optimization-algorithms-MQL5/blob/2a8fb7522a76cc8afd215ec631258512a96b2bc2/MQL5/Scripts/Testing%20AOs/Simple%20use%20of%20population%20optimization%20algorithms.mq5
status: stable
description: 依据固定 GitHub 提交解析 ACA 的参数校验、移动算子和调用示例，说明如何核对生效种群、实际评估预算与坐标尺度。
aliases:
  - aca-optimizer-case
  - andean-condor-algorithm
volatility: low
verified_at: 2026-11-04
---

# ACA 源码：有效参数与评估预算

## Summary

使用优化器时，应区分**构造默认值、请求参数和校验后的有效参数**，并按实际目标函数调用数核对预算。ACA 的参数校验和仓库调用示例展示了这一边界；单看输入参数或迭代次数，不足以确认实际计算成本。

本页仅以 [GitHub 仓库](https://github.com/JQSakaJoo/Population-optimization-algorithms-MQL5) 提交 `2a8fb7522a76cc8afd215ec631258512a96b2bc2` 为证据，来源限定为下列固定提交源码。`verified_at` 表示静态源码核对，不表示完成编译、性能测试或交易有效性验证；后续版本应重新核对。

## 参数：构造值不等于生效值

[ACA 类的构造函数与 SetParams()](https://github.com/JQSakaJoo/Population-optimization-algorithms-MQL5/blob/2a8fb7522a76cc8afd215ec631258512a96b2bc2/MQL5/Include/Math/AOs/PopulationAO/AO_ACA_AndeanCondorAlgorithm.mqh#L20-L46) 显示：

- 构造函数设 `popSize=1`、`DP=0.5`、`PC=0.2`，并据此初始化 `params[]`。
- `SetParams()` 从 `params[]` 读取请求值，将 `popSize<4` 的值设为 4，并将 DP、PC 各自限制在 `[0,1]`。
- 因此，调用 `SetParams()` 与直接使用构造状态不是同一参数路径。实验记录应同时保存请求值、生效值与实际代理数组大小，不能只记录输入栏。

## 预算：核对实际评估次数

[简单使用示例](https://github.com/JQSakaJoo/Population-optimization-algorithms-MQL5/blob/2a8fb7522a76cc8afd215ec631258512a96b2bc2/MQL5/Scripts/Testing%20AOs/Simple%20use%20of%20population%20optimization%20algorithms.mq5#L11-L56) 的调用顺序是：

1. 调用方按请求的 `popSize` 计算 `epochCount = numbTestFuncRuns / popSize`。
2. 将种群请求写入 `params[0].val`，再调用 `SetParams()` 与 `Init()`。
3. 每轮执行 `Moving()`，对实际代理数组逐个调用目标函数，最后执行 `Revision()`。

**[推论]** 若请求种群被校验逻辑修改，而迭代次数仍按请求值计算，实际目标函数调用数可能偏离名义预算。整数除法及初始化评估的计数口径也应明确。比较不同参数或优化器时，以实际调用计数为准；昂贵任务另外记录耗时，而不是仅对齐迭代轮数。

## 移动与接受机制

依据 [Moving()/Revision()](https://github.com/JQSakaJoo/Population-optimization-algorithms-MQL5/blob/2a8fb7522a76cc8afd215ec631258512a96b2bc2/MQL5/Include/Math/AOs/PopulationAO/AO_ACA_AndeanCondorAlgorithm.mqh#L113-L276)：

- **状态选择**：适应度按降序排名，以 `rank/N < DP` 分入强化组，再以 PC 概率翻转状态。
- **探索**：无放回选取约一半坐标，在各自上下界之间重新均匀采样；一维时至少选一个坐标。
- **强化**：只改一个坐标，等概率选择四种增量：`U(0.3×LB,0.3×UB)`、`U(0.1×LB,0.1×UB)`、`U(-1,1)`、`U(-0.05,0.05)`。前两项不是按区间宽度定义的对称步长。结果再交由 `SeInDiSp()` 处理。
- **接受**：按最大化比较，只有新适应度更差才回滚，等分位置可保留。代码记录个人与全局最优，但上述移动算子不使用最优位置引导搜索。

**[推论]** 固定绝对步长及依赖上下界位置的增量，使坐标单位、平移、缩放和离散步长可能改变搜索行为。上下界同号时，前两类增量也同号。迁移到新问题前，应检查坐标表示和步长，而不是只复制控制参数。

## Practical checklist

以下为基于源码的 **[推论]**，不是已经完成的实验或新增执行规则：

1. 固定提交、目标函数、优化方向、边界和离散步长。
2. 记录参数校验前后的值及实际代理数量，确保调用方的预算计算使用一致口径。
3. 对实际目标函数调用计数，并明确初始化、整数截断和停止条件的处理。
4. 若要判断性能，使用等预算基线、多随机种子及坐标尺度对照；静态源码不能替代实验结果。

本页与 [agent-harness-search-regularization](/concepts/agent-harness-search-regularization) 的连接仅在搜索过程的评估边界；与 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 的连接在效果与成本应共同衡量。这是跨域方法参考，不表示两类系统共享性能结论。

## Relations

- depends_on: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- related: [agent-harness-search-regularization](/concepts/agent-harness-search-regularization)

