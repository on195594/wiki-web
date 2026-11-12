---
title: First-edit Economy for Coding Agents
created: 2026-07-07
updated: 2026-11-11
type: concept
tags:
  - agent
  - ai-coding
  - workflow
  - optimization
  - evaluation
sources:
  - raw/articles/vscode-prompt-tuning-gpt55-coding-harness-2026-07-06.md
  - https://people.orie.cornell.edu/pfrazier/pub/frazier_dp_weor.pdf
  - https://www.inf.u-szeged.hu/~akiss/pub/fulltext/hodovan2016modernizing.pdf
  - https://userweb.cs.txstate.edu/~rp31/papersSQ/WeiserSlicing.pdf
status: stable
volatility: medium
review_by: 2027-03-02
aliases:
  - first-edit-economy
  - economical-search-and-edit
  - 少探索早验证
description: 结合样本信息期望价值（EVSI）最优停止判据与 Delta Debugging（ddmin）1-最小差分原则，把 VS Code
  GPT-5.5 案例抽象为 coding agent 的“首次编辑经济性”控制模式。
verified_at: 2026-11-02
---

# First-edit Economy for Coding Agents

## Summary

First-edit economy 是 coding agent 的一个轻量工作流控制模式：当任务已经有明确文件、符号、失败行为、失败命令、测试或附近实现面时，Agent 不应无限扩大搜索范围，而应收集刚好足够的局部证据，形成一个可证伪假设，做最小可回滚编辑，并立刻运行最便宜的验证。

这个概念来自 VS Code Team 对 GPT-5.5 coding harness 的线上 A/B 实验（[vscode-prompt-tuning-gpt55-coding-harness-2026-07-06](https://github.com/on195594/wiki/blob/3e4e451e6fce73edab27c6eb3cf737bcb810d162/raw/articles/vscode-prompt-tuning-gpt55-coding-harness-2026-07-06.md)）。本页将其沉淀为可选设计参考，不证明任何宿主已安装或采纳对应 Skill；它不是默认硬规则，也不授权 runtime 行为。

## Source-backed principle

VS Code Team 的实验问题是：如果在系统提示词中要求 GPT-5.5 “少探索、早验证”，能否让 coding agent 更快、更省 token，而不显著降低质量。

他们测试了两个 prompt 变体：

- `PRPT_SRCH`：在 prompt 中加入短的 `<economical_search_and_edit>` 提醒。
- `PRPT_LRG`：加入更大的 `<Before_the_first_edit>` / `<After_the_first_edit>` 结构，覆盖第一次编辑前的局部假设形成和第一次编辑后的验证顺序。

线上两周 scorecard 显示，`PRPT_LRG` 在 p50/p95 首次编辑时间、p95 token 和平均工具调用次数上改善更强，因此成为 VS Code 中 GPT-5.5 的默认系统提示词。

## Portable control pattern

可迁移到 AI Agent 的不是 VS Code 的具体 prompt 标签或 GPT-5.5 特定结论，而是这个控制模式：

```text
concrete anchor
→ nearby evidence only
→ one falsifiable local hypothesis
→ one cheap discriminating check
→ smallest grounded edit
→ immediate executable validation
```

中文执行口径：

```text
具体锚点
→ 只读必要附近证据
→ 一个可证伪局部假设
→ 一个最便宜区分性检查
→ 最小有根据编辑
→ 立即执行验证
```

### 形式化基础：样本信息期望价值（EVSI）最优停止与 1-Minimal 差分切片

为什么在已有明确锚点时，“立刻做最小可验证编辑”在数学上优于“先读遍整个仓库”？这一原则可由序贯决策论与软件故障定位的两大经典理论形式化：

1. **样本信息期望价值（EVSI）与探索停止边界（Howard 1966；Wald 1945；[Frazier 2011](https://people.orie.cornell.edu/pfrazier/pub/frazier_dp_weor.pdf)）**：
   设 Agent 在第 $t$ 步已收集的局部上下文证据为 $\mathcal{I}_t$（含具体报错锚点、目标文件与调用签名），当前对候选修复假设 $h \in \mathcal{H}$ 的后验信念为 $p_t(h)$。此时若继续执行一次只读搜索或文件读取动作 $a_{\text{read}}$（产生观测 $Y$，消耗 Token、延迟与上下文注意力稀释成本 $C_{\text{search}}(a_{\text{read}})$），其**净样本信息期望价值（Net Expected Value of Sample Information）**为：
   $$\text{NetEVSI}(a_{\text{read}} \mid \mathcal{I}_t) = \mathbb{E}_{Y \mid \mathcal{I}_t}\!\left[\max_{e \in \mathcal{E}} \mathbb{E}[U(e) \mid \mathcal{I}_t, Y]\right] - \max_{e \in \mathcal{E}} \mathbb{E}[U(e) \mid \mathcal{I}_t] - C_{\text{search}}(a_{\text{read}})$$
   当任务具备明确故障锚点（先验熵 $H(p_t)$ 已集中在少数局部假设上）且本地拥有低成本、高区分度的可执行验证器（单次测试或类型检查成本 $C_{\text{verify}}$ 极低，似然比区分度极高）时，继续做宽泛文本搜索的边际信息增益迅速趋近于零，使得 $\text{NetEVSI}(a_{\text{read}} \mid \mathcal{I}_t) \le 0$。此时最优停止规则（Optimal Stopping Rule）要求**立即停止前置宽泛读取，直接提交局部假设编辑并交由可执行验证器作序贯检验**。
2. **程序切片（Program Slicing）与 1-最小可证伪补丁（Weiser 1981；Zeller 1999）**：
   Mark Weiser（1984，*IEEE TSE* 10(4): 352–357，*Program Slicing*，初版见 ICSE 1981，见 [Program Slicing](https://userweb.cs.txstate.edu/~rp31/papersSQ/WeiserSlicing.pdf)）定义了相对特定准则 $(l, v)$（位置 $l$ 与变量集合 $v$）的最小行为保持程序子集（Slice）；Andreas Zeller（1999，*ESEC/FSE*，见 [Delta Debugging `ddmin`](https://www.inf.u-szeged.hu/~akiss/pub/fulltext/hodovan2016modernizing.pdf)）进一步定义了故障与修复的 **1-最小差分（1-Minimal Difference）**：设候选代码补丁拆分为基本改动单元集合 $\Delta = \{\delta_1, \dots, \delta_k\}$，验证测试谓词为 $\text{Pass}(\cdot) \in \{0, 1\}$，则满足首次编辑经济性的理想补丁 $\Delta^*$ 应满足 1-最小性：
   $$\text{Pass}(P \oplus \Delta^*) = 1 \quad \land \quad \forall \delta_i \in \Delta^*,\;\; \text{Pass}\!\left(P \oplus (\Delta^* \setminus \{\delta_i\})\right) = 0$$
   **[推论]** 若首次编辑顺带混入无关重构、格式美化或跨模块改名（即 $|\Delta| \gg |\Delta^*|$，违反 1-最小性），一旦验证失败（$\text{Pass}(P \oplus \Delta) = 0$），失败原因将在 $2^{|\Delta|}$ 个子集组合中发生归因混杂（Confounding），迫使后续修复循环退化。因此，首次编辑必须严格限制在局部程序切片内并逼近 $\Delta^*$（对应 [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow) 中的 `E_first` 指标）。

## AI Agent mapping

### Suitable layer

- **Wiki**：保存外部案例、指标和原则边界。
- **Skill/reference 候选**：可用于低/中风险、可验证、可回滚的 coding/debug/refactor 任务；是否采纳由目标项目评估，本页不证明任何私有 Skill 已晋升。

### Not suitable layer

- **Memory**：这不是用户偏好或环境事实。
- **Cron / MCP / runtime / gateway / wrapper**：文章没有提出自动化能力或运行时变更需求。
- **Hard gate**：VS Code + GPT-5.5 的生产实验不能直接外推成 AI Agent 全局强制规则。

## Trigger threshold

可以试用 first-edit economy 的任务通常满足：

- 用户请求本地 coding、debug、refactor 或小到中等行为修复。
- 已有具体锚点：文件、函数、失败测试、错误日志、复现命令、符号名或明确模块。
- 存在低成本验证：目标测试、lint/typecheck 子集、CLI smoke、行为输出、diff readback。
- 继续泛搜索的成本高于做一个小步、可回滚、可验证编辑。

## Skip conditions

不要用它压缩必要探索：

- 需求含糊，完成标准不清。
- 根因未知，且需要系统性调试先复现失败。
- 架构设计、跨模块重构、数据迁移、生产配置、凭证、安全、数据库、K8s、systemd、cron、runtime 或外部副作用。
- 缺少可执行验证，只能靠主观阅读判断。
- 任务需要先写 spec、计划或安全边界。

## Possible adoption shape

若目标项目采纳，可在已有开发流程或 SOP 中引用本页；只有现有载体不能清晰承载时才另建 reference。不假定存在同名 Skill，不新增默认硬 gate，也不要求每个小任务额外记录。

当这个 guidance 实际影响执行时，closeout 可以简短记录：

- Task class：coding/debug/refactor/docs-only。
- Concrete anchor：文件、命令、错误、测试或符号。
- Reads/searches before first edit：第一次编辑前读文件/搜索次数。
- Hypothesis before first edit：一句可证伪局部假设。
- Cheap check：计划用什么命令或输出证伪。
- First edit size：触及文件数和编辑性质。
- Immediate validation：实际运行的命令和结果。
- Outcome：通过、返工、误改、blocked 或 no-action。
- Promotion note：是否值得被目标项目已有开发流程或 SOP 引用。

## Evaluation metrics

从 VS Code 案例借用但不照搬的指标：

- Time/read steps to first edit：首次有效编辑前的等待和探索量。
- Tool calls before first edit：读/搜/检查工具调用数。
- Immediate validation availability：首次编辑后是否有真实验证。
- Rework signal：是否因为探索不足导致返工。
- Quality guardrail：编辑是否被测试、lint、typecheck、smoke 或 diff readback 支撑。

## Adoption boundary

本页仅作为 Wiki 概念与 reference 候选，不声明目标项目已采纳或完成晋升。

继续升级为默认 guidance 或 hard gate 前，需要真实 AI Agent coding task 证据，且证据显示：

1. 任务有明确 trigger，不是所有 coding 请求都套用。
2. 该模式减少无效探索或延迟。
3. 没有因为过早编辑导致误改、返工或跳过必要上下文。
4. 默认化带来的收益大于额外 ceremony、token 和误跳过上下文的风险。

## Relations

- refines: [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow), [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- depends_on: [agent-context-engineering](/concepts/agent-context-engineering)
- related: [ai-coding-agent-workflow-types](/concepts/ai-coding-agent-workflow-types), [codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)

