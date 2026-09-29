---
title: First-edit Economy for Coding Agents
created: 2026-07-07
updated: 2026-07-07
type: concept
tags:
  - agent
  - ai-coding
  - workflow
  - optimization
  - evaluation
  - hermes
sources:
  - raw/articles/vscode-prompt-tuning-gpt55-coding-harness-2026-07-06.md
status: stable
source_policy: source_backed
aliases:
  - first-edit-economy
  - economical-search-and-edit
  - 少探索早验证
description: 把 VS Code GPT-5.5 prompt tuning 案例抽象成 coding agent
  的“首次编辑经济性”原则：有锚点时少做宽泛探索，尽早形成可证伪假设、小步编辑并立即验证。
---

# First-edit Economy for Coding Agents

## Summary

First-edit economy 是 coding agent 的一个轻量工作流控制模式：当任务已经有明确文件、符号、失败行为、失败命令、测试或附近实现面时，Agent 不应无限扩大搜索范围，而应收集刚好足够的局部证据，形成一个可证伪假设，做最小可回滚编辑，并立刻运行最便宜的验证。

这个概念来自 VS Code Team 对 GPT-5.5 coding harness 的线上 A/B 实验。它已进入 Hermes wiki，并作为 `coding-agent-workflow` 的 optional reference；它不是默认硬规则，也不授权 runtime 行为。

## Source-backed principle

VS Code Team 的实验问题是：如果在系统提示词中要求 GPT-5.5 “少探索、早验证”，能否让 coding agent 更快、更省 token，而不显著降低质量。

他们测试了两个 prompt 变体：

- `PRPT_SRCH`：在 prompt 中加入短的 `<economical_search_and_edit>` 提醒。
- `PRPT_LRG`：加入更大的 `<Before_the_first_edit>` / `<After_the_first_edit>` 结构，覆盖第一次编辑前的局部假设形成和第一次编辑后的验证顺序。

线上两周 scorecard 显示，`PRPT_LRG` 在 p50/p95 首次编辑时间、p95 token 和平均工具调用次数上改善更强，因此成为 VS Code 中 GPT-5.5 的默认系统提示词。

## Portable control pattern

可迁移到 Hermes 的不是 VS Code 的具体 prompt 标签或 GPT-5.5 特定结论，而是这个控制模式：

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

## Hermes mapping

### Suitable layer

- **Wiki**：保存外部案例、指标和原则边界。
- **Active skill/reference**：已作为 `coding-agent-workflow/references/first-edit-economy.md` 的 optional reference，用于低/中风险、可验证、可回滚的 coding/debug/refactor 任务。

### Not suitable layer

- **Memory**：这不是用户偏好或环境事实。
- **Cron / MCP / runtime / gateway / wrapper**：文章没有提出自动化能力或运行时变更需求。
- **Hard gate**：VS Code + GPT-5.5 的生产实验不能直接外推成 Hermes 全局强制规则。

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

## Active reference shape

落入 active skill/reference 的形态应保持轻量：一条 `coding-agent-workflow` 指针 + 一个 reference 文件，不新增默认硬 gate、不强制模板、不要求每个小任务额外记录。

当这个 guidance 实际影响执行时，closeout 可以简短记录：

- Task class：coding/debug/refactor/docs-only。
- Concrete anchor：文件、命令、错误、测试或符号。
- Reads/searches before first edit：第一次编辑前读文件/搜索次数。
- Hypothesis before first edit：一句可证伪局部假设。
- Cheap check：计划用什么命令或输出证伪。
- First edit size：触及文件数和编辑性质。
- Immediate validation：实际运行的命令和结果。
- Outcome：通过、返工、误改、blocked 或 no-action。
- Promotion note：是否值得进入 `coding-agent-workflow` reference。

## Evaluation metrics

从 VS Code 案例借用但不照搬的指标：

- Time/read steps to first edit：首次有效编辑前的等待和探索量。
- Tool calls before first edit：读/搜/检查工具调用数。
- Immediate validation availability：首次编辑后是否有真实验证。
- Rework signal：是否因为探索不足导致返工。
- Quality guardrail：编辑是否被测试、lint、typecheck、smoke 或 diff readback 支撑。

## Adoption boundary

当前成熟度：`OPTIONAL_REFERENCE`。

继续升级为默认 guidance 或 hard gate 前，需要真实 Hermes coding task 证据，且证据显示：

1. 任务有明确 trigger，不是所有 coding 请求都套用。
2. 该模式减少无效探索或延迟。
3. 没有因为过早编辑导致误改、返工或跳过必要上下文。
4. 默认化带来的收益大于额外 ceremony、token 和误跳过上下文的风险。

## Related

- `vscode-prompt-tuning-gpt55-coding-harness-2026-07-06`
- [loop-engineering-hermes-agent-workflow](/concepts/loop-engineering-hermes-agent-workflow)
- [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- [agent-context-engineering](/concepts/agent-context-engineering)
- [codex-agent-workflow-layering](/concepts/codex-agent-workflow-layering)
- [ai-coding-agent-workflow-types](/concepts/ai-coding-agent-workflow-types)
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- [index](/)
- `log`

