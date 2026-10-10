---
title: Entropy and Entropy Increase
created: 2026-09-21
updated: 2026-09-21
type: concept
tags:
  - research
sources:
  - docs:https://ocw.mit.edu/courses/res-8-010-introduction-to-statistical-physics-summer-2018/mitres_8_010su18_lec3.pdf
  - docs:https://openstax.org/books/chemistry-2e/pages/16-3-the-second-and-third-laws-of-thermodynamics
  - docs:https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf
  - docs:https://www.nist.gov/publications/remarks-irreversible-processes-and-entropy-increase
  - raw/articles/laws-of-software-engineering/broken-windows-theory.md
status: stable
description: 区分热力学熵、统计熵与信息熵，说明熵增成立的系统边界以及软件和组织类比的使用限制。
aliases:
  - 熵
  - 熵增
  - entropy
  - entropy increase
volatility: low
verified_at: 2026-09-21
---

# Entropy and Entropy Increase

## Summary

“熵”不是一个脱离模型即可通用解释的“混乱度”。热力学熵是物理状态函数，统计熵把宏观状态连接到微观状态的数量或概率分布，信息熵衡量随机变量结果的不确定性。三者具有相近的数学形式，但对象、单位和适用条件不同。所谓“熵增”首先必须说明系统边界；热力学第二定律约束孤立系统或系统与环境的总熵，不要求每个开放子系统都变得更无序。[1][2]

## 快速结论

- **热力学熵**：对可逆热交换，熵变由 `dS = δQ_rev / T` 联系热量与绝对温度；熵是状态函数，而不是某条具体过程路径的标签。[1]
- **第二定律**：孤立系统的熵不减少；不可逆过程使总熵增加，平衡或理想可逆极限对应总熵不变。[1][2]
- **局部有序不违背第二定律**：一个子系统可以通过与环境交换能量而降低自身熵，只要系统与环境合计的熵变满足第二定律。[2]
- **统计解释**：等概率微观状态下 `S = k_B ln Ω`；更一般地，Gibbs 熵写作 `S = -k_B Σ p_i ln p_i`。[1]
- **信息熵**：Shannon 熵写作 `H(X) = -Σ p_i log p_i`，衡量结果选择或不确定性的平均量；对数底为 2 时单位是 bit，底为 `e` 时得到自然单位（natural unit）。[3]

## 三种语境

### 热力学熵

热力学关注热、功、温度和宏观状态之间的约束。[1] 第二定律更准确的表述不是“任何东西都会越来越乱”，而是：为系统画出边界后，孤立整体的熵不能自发减少。[1][2] OpenStax 将总熵写成：[2]

`ΔS_total = ΔS_system + ΔS_surroundings`

自发过程要求总熵增加；单独的系统项可以为负，只要环境的增加更大。[2]

### 统计熵

统计力学通过微观状态解释宏观熵。[1] `Ω` 是给定宏观条件下可访问微观状态的数量；当状态概率不等时，需要使用完整的概率分布。[1] 把熵简称为“无序度”只能作为直觉：如果没有说明状态空间、概率和约束，“无序”并不是可计算定义。[1]

### 信息熵

Shannon 的定义处理通信源可能产生的符号及其概率。[3] 结果越确定，熵越低；在固定结果数量下，概率越均匀，熵越高。[3] Shannon 明确把通信的工程问题与消息语义分开，因此高信息熵不等于内容更真实、更有意义或质量更高。[3]

## 数学联系与边界

Gibbs 熵与 Shannon 熵都使用 `-Σ p_i log p_i` 的形式，但不能只凭公式相似就把二者视为同一个物理量：

- 上述 Boltzmann/Gibbs 统计熵公式包含 Boltzmann 常数 `k_B`，使 `S` 具有与热力学熵一致的物理单位；[1]
- 信息熵的单位由对数底决定，描述给定概率模型中的不确定性；[3]
- 二者可以在统计物理和信息热力学中建立严格联系，但联系需要明确的物理状态、概率分布和动力学，不能靠“混乱”一词自动完成。[1][3]

经典热力学的熵增陈述通常比较平衡态。NIST 指出，对孤立系统的不可逆过程，初末熵增加并不自动证明某个非平衡熵表达式在过程中的每一瞬间都必须单调增加。[4]

## 软件与组织中的“熵增”

现有 Wiki 的 [software-engineering-laws-quality](/concepts/software-engineering-laws/software-engineering-laws-quality) 收录了 Broken Windows Theory；其原始条目 `broken-windows-theory` 把代码随时间退化和失序称为 “software entropy”。这里的“熵”是工程类比，不是从热力学第二定律推导出的物理定律。

[综合] 更稳妥的使用方式是把“软件熵增”拆回可观察机制：重复知识源、失效测试、过时文档、隐藏状态和无人负责的临时绕行会提高修改成本并诱发更多退化。相应措施应针对这些具体机制，而不是把“系统必然变乱”当作无需验证的结论。相关评审入口见 [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)；信息熵及交叉熵在机器学习中的位置可继续从 [llm-engineering-knowledge-map](/concepts/llm-engineering-knowledge-map) 检索。

## 常见误用

- **把熵等同于日常“乱”**：日常秩序感没有指定状态空间和概率，不能代替熵的定义。[1]
- **忽略物理系统边界**：一个子系统的熵可以下降，只要环境的熵增加更多；局部有序本身不反驳第二定律。[2]
- **[综合] 把物理定律直接搬到管理学或软件工程**：若没有可测状态、交换项和模型，“组织熵”或“软件熵”只是提醒持续维护成本的比喻。
- **把信息熵当成意义或真值**：Shannon 熵描述概率不确定性，不评价语义、事实性或价值。[3]
- **把初末熵增误写成任意瞬间单调**：非平衡过程需要额外定义和模型，不能从经典平衡态陈述直接外推。[4]

## Source quality and limitations

- MIT OpenCourseWare 讲义用于热力学、Boltzmann/Gibbs 熵及其信息解释的教学性综合。[1]
- OpenStax `Chemistry 2e` 用于系统、环境与总熵边界；它是大学教材而非原始研究。[2]
- Shannon 1948 年论文是信息熵定义及通信语义边界的一手来源。[3]
- NIST 页面仅支持非平衡过程“未必逐时单调”的窄限定，不用于替代完整的非平衡热力学理论。[4]
- 软件熵部分是基于现有软件工程条目的明确类比；本页不声称存在从物理熵到代码质量的定量等价。

## Relations

- related: [software-engineering-laws-quality](/concepts/software-engineering-laws/software-engineering-laws-quality), [llm-engineering-knowledge-map](/concepts/llm-engineering-knowledge-map)
- refines: [software-engineering-laws-decision-map](/queries/software-engineering-laws-decision-map)

## Sources

[1] https://ocw.mit.edu/courses/res-8-010-introduction-to-statistical-physics-summer-2018/mitres_8_010su18_lec3.pdf

[2] https://openstax.org/books/chemistry-2e/pages/16-3-the-second-and-third-laws-of-thermodynamics

[3] https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf

[4] https://www.nist.gov/publications/remarks-irreversible-processes-and-entropy-increase

