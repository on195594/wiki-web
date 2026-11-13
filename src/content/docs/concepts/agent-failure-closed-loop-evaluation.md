---
title: Agent 失败闭环评估
created: 2026-05-20
updated: 2026-11-13
type: concept
tags:
  - agent
  - evaluation
  - monitoring
  - closeout
  - workflow
sources:
  - docs:https://venturebeat.com/orchestration/langsmith-engine-closes-the-agent-debugging-loop-automatically-but-multi-model-enterprises-still-need-a-neutral-layer
  - docs:https://arxiv.org/abs/2406.12952
  - docs:https://arxiv.org/html/2610.12289v1
  - concepts/agent-pre-deploy-regression-and-trace-debugging.md
  - concepts/agent-evaluation-rubric-calibration.md
  - concepts/agent-closed-loop-learning-from-corrections-to-rules.md
status: stable
description: 说明如何把可复发 Agent 失败转化为 evaluator、fixture 或防回归工件。
aliases:
  - failure-loop-evaluation
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Agent 失败闭环评估

## Summary

本页定义如何把可复发的 Agent 失败从线上/会话故障信号转化为中立审计证据、三路根因分流（执行缺陷 vs. 规约缺口 vs. 评测器失准）、最小修复以及**成对差分防回归评估工件**（`Fail-to-Pass` 复现用例 + `Pass-to-Pass` 邻近反例）。

## 定义与成对差分回归编译器（Failure-to-Regression Compiler）

Agent 失败闭环评估是指：当 AI Agent 工作流出现可复发失败或高严重度事故时，不只修补当前输出，还要将失败模式编译为可机械执行的 regression artifact（evaluator、fixture、smoke check 或 skill 负向约束）。

结合软件测试生成与验证的一手基准研究，单靠“补丁修好后跑通一个用例”不足以构成可靠回归防线：
1. **`Fail-to-Pass`（$F \to P$）故障复现前置条件**：Niels Mündler 等（2024/2025，NeurIPS 2024，[*SWT-Bench: Testing and Validating Real-World Bug-Fixes with Code Agents*](https://arxiv.org/abs/2406.12952)）基于真实 Python Issue–PR 构造 SWT-Bench（当前论文 §3.2 报告筛选后 1,983 个实例），将有效复现测试定义为先在修复前代码 $\pi_{\text{old}}$ 上确定性失败（Fail），并在修复后代码 $\pi_{\text{new}}$ 上通过（Pass），论文在其受测配置中报告，以生成测试过滤候选修复可将 SWE-Agent 精确率翻倍，不是对任意修复任务的普遍保证。
2. **单参考评估盲区与多候选/邻近反例判别（Joint Success Function）**：[*TestPrism: Rethinking Test Evaluation Beyond a Single Reference*](https://arxiv.org/html/2610.12289v1)（2026）对 6 个模型家族 286 条失败测试生成轨迹的实证归因表明，仅用单个参考修复检验测试（Single-Reference Evaluation）的成功率，是该研究扩大候选实现面板后联合成功率的上界，而非测试质量的普遍上界；测试失灵分布在三类根因：**覆盖缺口（Coverage Gaps，`34.6%`）**、**错误或过弱断言（Faulty Checks，`50.0%`）**与**测试执行逻辑错误（Execution Logic Errors，`15.4%`）**（例如只断言返回条数而漏检结构合法性，导致测试虽满足旧版失败、参考版通过，却放过了丢弃合法分组的错误补丁）。
3. **成对差分回归工件判据（`[推论]` 工程门禁）**：结合上述研究，可为可复发失败 $e_k$ 约定回归工件 $\mathcal{A}_k = (x_{\text{fail}}, x_{\text{neg}}, \mathcal{V}_k)$，要求同时包含**原失败复现样本** $x_{\text{fail}}$ 与至少一个**不应被误拦截的邻近合法反例** $x_{\text{neg}}$：
   $$\text{ValidArtifact}(\mathcal{A}_k) \iff \underbrace{\mathcal{V}_k(\pi_{\text{old}}(x_{\text{fail}})) = 0 \;\land\; \mathcal{V}_k(\pi_{\text{new}}(x_{\text{fail}})) = 1}_{F \to P\text{ 真实复现与修复验证}} \;\land\; \underbrace{\mathcal{V}_k(\pi_{\text{old}}(x_{\text{neg}})) = 1 \;\land\; \mathcal{V}_k(\pi_{\text{new}}(x_{\text{neg}})) = 1}_{\text{邻近反例 }P \to P\text{ 防过拟合}} \;\land\; \underbrace{\forall \pi_{\text{inv}} \in \mathcal{P}_{\text{invalid}},\, \mathcal{V}_k(\pi_{\text{inv}}(x_{\text{fail}})) = 0}_{\text{拒绝规约投机与过弱断言}}$$

其中 $\mathcal{P}_{\text{invalid}}$ 是已构造的有限无效候选集合。该门禁只验证所选样本和候选，不能证明拒绝所有可能的错误实现；没有可运行旧版本时，应明确标记复现证据缺失，而不是声称已满足 $F \to P$ / $P \to P$。

## 背景与三路根因分流

源自 [LangSmith Engine 工程闭环讨论](https://venturebeat.com/orchestration/langsmith-engine-closes-the-agent-debugging-loop-automatically-but-multi-model-enterprises-still-need-a-neutral-layer)：失败信号 → 中立证据 → 根因分类 → 候选修复 → 防回归 evaluator → 人类审批。文章里的生产准确率和产品能力主张应保留为厂商发布语境下的未独立验证信息；AI Agent 只迁移方法论，不迁移产品依赖。

多模型/多工具工作流还需要可复验的审计链：证据不能只停留在某一个模型或厂商后台，否则跨模型失败会形成审计断层（单次工具调用六步调试证据链与部署前七类结构回归探针见 [agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging)）。

在进入修复前，必须先按中立证据将失败信号分流至三类可并存的处置轨道（同一事件可能需要同时修复执行逻辑与评测器），避免用同一种动作掩盖不同性质的缺陷：
- **轨道 A：执行或边界缺陷（Process / Execution Bug）**——规约与验收标准清楚，但 Agent 在解析、工具调用、上下文裁剪或状态传递中违背契约 → 执行最小修复，并按上式沉淀成对差分回归工件 $\mathcal{A}_k = (x_{\text{fail}}, x_{\text{neg}}, \mathcal{V}_k)$。
- **轨道 B：规约缺口或重复用户纠错（Specification Gap / Recurring Correction）**——模型输出在字面提示词下自洽，但未满足隐含业务标准或反复触发用户手动修改 → 先回写形式化规约，并按 [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules) 的记忆固化与影子实验门禁评估是否升级为默认规则。
- **轨道 C：评测器或 Rubric 失准（Evaluator / Rubric Miscalibration）**——人工复核发现 Agent 实际输出正确，而自动验证器因断言过严、位置/冗长偏差或测试逻辑错误误报失败（或漏报真实失败）→ 路由至 [agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration) 校准评测器灵敏度/特异度（$\hat{q}_1, \hat{q}_0$）并更新 Rubric 锚点案例，严禁为了迎合错误评测器而改坏 Agent 逻辑。

## AI Agent 适配原则

- 使用本地中立证据层，不依赖单一模型厂商后台。
- 修复必须判断是否需要 regression artifact。
- active-layer 修改必须经用户批准。
- 不自动生成并合并 PR。
- 不把 workflow 规则写入 memory。

## AI Agent 层级映射

- session：每次复盘使用 closeout 模板。
- skill：把 closeout 和 regression artifact 判断制度化。
- wiki：保存概念、背景和架构原则。
- memory：不保存 workflow 规则。
- cron：仅在规则稳定后做低频只读检查。
- MCP：仅在需要接外部 live trace/source 时考虑。
- profile：仅在 eval-only runtime 隔离明确时考虑。
- runtime config：不因该原则直接修改。

## 失败信号类型

- 显式错误
- evaluator failure
- trace/log anomaly
- negative user feedback
- out-of-scope behavior
- unverifiable artifact
- active-layer boundary violation

## 根因分类

- extraction
- routing
- prompt
- tool
- model/provider
- context compression
- cache
- permission
- delivery
- governance

## Closeout 模板与参数化闭环裁决矩阵

```text
失败信号：
中立证据（Trace / 输入输出快照 / 6 步工具归因阶段）：
根因轨道（A 执行缺陷 | B 规约缺口/重复纠错 | C 评测器失准）：
最小修复：
成对防回归工件（x_fail [F->P] + x_neg [P->P] + 断言强度检查）：
影响层级：
是否需要 active-layer 修改：
是否需要用户审批：
```

`[推论]` 为统一衔接前置形式化规约、运行时自我验证（[agent-self-validation-loops](/concepts/agent-self-validation-loops)）、失败转回归与用户纠错升级（[agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules)），在工程审查中可按以下四个参数化门禁裁决闭环动作（各参数阈值依具体项目风险设定，不作为未校准的全局硬编码常数）：

| 参数符号 | 门禁维度 | 形式化判据与定义 | 达标时允许动作 | 未达标时强制降级/阻断动作 |
| --- | --- | --- | --- | --- |
| `S_f2p` | **成对差分回归复现度** | 满足上文 $\text{ValidArtifact}(\mathcal{A}_k)$：失败样本旧版失败/新版通过，合法邻近样本旧版/新版均通过，并拒绝有限无效候选集 | 将 $(x_{\text{fail}}, x_{\text{neg}}, \mathcal{V}_k)$ 纳入持续回归集并放行修复 | 拒绝仅靠单点 $P \to P$ 或过弱断言声称“已防回归”；补齐复现与邻近反例 |
| `F_ext` | **交付验证证据锚定** | 有可回读测试/编译器/解释器/DOM 证据，并评估其覆盖与误判边界，而非只靠内生自评 | 允许在重试预算内执行修复循环（[agent-self-validation-loops](/concepts/agent-self-validation-loops)）；通过对应验收后再声明完成 | 可将自省结果作为待验候选，但不能据此声称完成外部验证；补齐证据或报告限制 |
| `G_shadow` | **纠错规则影子晋升门禁** | 满足 [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules) 的项目级 $\text{Promote}(\pi_{\text{cand}})$ 门禁（配对差值置信下界、受保护回归集与成本预算），不以独立置信区间不重叠替代配对检验 | 允许在获批后将高频纠错蒸馏为默认规则（[agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules)） | 纠错仅保留在当次会话或局部结构化记忆，禁止直接改写全局默认指令 |
| `B_retry` | **有界重试与停滞熔断** | 下一轮仍在预设重试预算内，验证器可用，且未触发项目定义的停滞/循环判据；不要求随机指标每轮严格下降 | 继续有证据驱动的修复/验证，验收通过即停止 | 预算耗尽、持续同类失败且无新证据、工具不可用或需要权限裁决时停止，上交逐轮诊断包 |

## 边界

本页是概念页，不授权修改 active skills、memory、cron、MCP、profile、runtime config 或 AI Agent core。

## Relations

- refines: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- related: [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops), [agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration), [agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging)

## Related

- [agent-closed-loop-learning-from-corrections-to-rules](/concepts/agent-closed-loop-learning-from-corrections-to-rules)：相邻但不同；该页关注“用户纠错 → 规则沉淀”，本页关注“失败 → regression artifact”。

