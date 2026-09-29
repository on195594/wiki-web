---
title: AI Agent Retrieval Priority and Answer Path
created: 2026-04-16
updated: 2026-09-29
type: concept
tags:
  - agent
  - knowledge-base
  - workflow
  - tool
  - configuration
sources:
  - repository:SCHEMA.md
  - concepts/hermes-knowledge-architecture.md
  - concepts/hermes-context-layer-operating-rules.md
status: stable
description: 定义 AI Agent 回答问题时 wiki、memory、skills、sessions、raw 和外部检索的优先级。
aliases:
  - retrieval-priority
  - answer-path
  - agent-retrieval-priority-and-answer-path
---

# AI Agent Retrieval Priority and Answer Path

## Summary
人类与 AI Agent 查阅知识时，应从可追溯证据形成结论。模型内部记忆不能替代来源；下面给出按问题类型调整的检索路径。
核心原则是 freshness-qualified wiki first：先检查知识是否适用于当前问题，再复用；实时事实优先当前证据，有写入授权才回写。

以下 memory、skills 和历史检索只在宿主实际提供且与问题相关时使用；缺少能力直接跳过。顺序是知识检索参考，不覆盖用户请求、项目规则或工具权限。人类可通过编辑器的搜索与反向链接检查来源和关系；Agent 可使用下述只读脚本，核验范围相同。

## Priority order
默认优先级如下：
1. freshness-qualified `wiki`
2. `memory`
3. `skills`
4. `sessions / session_search`
5. `raw` sources
6. external search / extract
7. write-back to `wiki` only when authorized, public-suitable and reusable

这个顺序适用于稳定知识。实时核验、项目权威性及下面的 Freshness Gate 优先于默认顺序。

## Why this order
### 1. freshness-qualified wiki first
- wiki 是正式知识层
- 内容经过整理、结构化、可交叉链接
- 最适合作为稳定回答依据

### 2. memory second
- memory 提供用户偏好、稳定事实、环境约束
- 它负责修正回答方式和操作边界
- 但它不是长篇知识库

### 3. skills third
- skills 提供执行方法
- 当问题是“怎么做”而不是“是什么”时尤其重要
- 适合补充步骤、命令、验证方式

### 4. sessions fourth
- sessions 适合回忆过去做过什么
- 用于补历史上下文，而不是替代正式知识

### 5. raw fifth
- raw 是原始材料层
- 适合在 wiki 缺内容时回溯来源
- 不能直接替代整理后的知识页

### 6. external when required
- 外部检索用于补足当前知识缺口
- 不应成为每次都从零开始的默认路径
- 否则知识无法累积

## Answer path
标准回答路径如下：
1. 识别问题类型：知识解释、执行方法、历史回忆、实时事实
2. 查相关 wiki 页面并执行 Freshness Gate，包括关系出边与入边
3. 用 `memory` 修正回答约束与用户偏好
4. 若涉及具体操作，再加载相关 `skills`
5. 若用户引用“上次做过的事”，再查 `sessions / session_search`
6. 若 Wiki 不足、YELLOW/RED 或需要实时事实，回读 `raw` 或权威/live 证据
7. 给出答案
8. 如果答案具有长期价值、适合公开且有写入授权，做最小 Wiki 补丁

## Freshness Gate（canonical Agent 契约）

各类读者在消费 Wiki 结论前执行。GREEN/YELLOW/RED 是运行时判断，不写入页面 `status`；`stable` 不是 current truth，`updated` 不是 verified。

1. 先限定问题的时间、版本、产品、环境和具体 claim/section。历史问题只评价当时适用范围，不自动偏爱最新来源；当前问题中的稳定方法也单独判断。
2. 读取候选页 path、title、status、updated、sources、可选 volatility/verified_at/review_by、Relations 和相关局部标记。缺失 volatility 不等于 low；日期非法或未来 verified_at 不构成验证证据。来源须支持同一范围。
3. 检查关系出边和正式页入边；人类可使用编辑器的反向链接，Agent 可在仓库根运行 `python3 _meta/scripts/wiki_reverse_lookup.py --root "$WIKI_ROOT" --page <页面相对路径>` 查询入边；`WIKI_ROOT` 由部署者配置。把替代页、冲突页加入候选，即使搜索只命中旧页。查询出错时报告缺口，不把失败当成空关系集，不直接宣称 GREEN。
4. 同一范围内按 `RED > YELLOW > GREEN` 判定；跨范围不机械传播。需要实时核验的版本、配置、进程、市场、政策、最新行为等优先使用当前项目/live/官方证据，日期未到期也不能豁免。下表 GREEN 表示 Wiki 范围内证据资格，不替代强制实时验证。

| 状态 | 条件（限定当前范围后） | 回答行为 |
|---|---|---|
| RED | 当前范围存在生效的 inbound supersedes；无法消解的双向 conflicts_with；来源明确撤回；版本不兼容；closed 历史结论被用于当前规则；高波动明显超窗且无法验证 | 不作为当前确定性事实。找替代或 live evidence；仍不足则 fail closed，明确无法确定；可用作历史背景 |
| YELLOW | review_by 早于今天；高波动缺有效 verified_at/review_by；日期非法/未来；当前外部事实无元数据；旧 medium/high 页当前适用性未知；环境版本未知；新来源触发待重审；来源范围可能变化 | Wiki 只作背景/线索，先核对 raw/官方/当前项目/live；未验证不写成当前事实 |
| GREEN | 无适用替代/未解冲突的稳定原理、方法或时间范围内历史知识；或 medium/high 易变结论具备匹配来源及 verified_at <= today <= review_by；或只依赖一个具备完整局部日期与来源的 claim | 使用合格范围，保留来源边界。当前事实仍服从实时核验要求 |

日期统一以 UTC 日历日为准；review_by 当天仍在窗口内，次日到期。没有固定“几天自动 stale”的阈值。年龄很旧或仅 Wiki 内缺少证据，初判仍是 YELLOW；“无法验证”要求实际核验失败或已确认权威/实时证据不可取得，不能仅凭未尝试核验就升为 RED。局部 volatile block 仅覆盖 block 内明确断言；`As of` 单独标记不足以让高波动 claim GREEN；复核一个 claim 不能提升整页，其余易变 claim 保持待验证。页面到期不自动阻塞与易变内容无关的稳定方法。

### 关系约束

- A supersedes B：读取 A 的范围、版本和生效日期。对问题生效时 B 为 RED，A 独立过门禁；A 到期为 YELLOW 不恢复 B 资格。历史查询可使用替代生效前的 B。
- conflicts_with 按双向约束处理，检查出边和入边。按 scope → applicable version → effective date → source authority → supersession → live evidence 消解；仍未解决为 RED，禁止模型自行拼出折中事实。
- 当前结论依赖的页面为 RED 时，本页至少 YELLOW；只有证据证明该依赖与问题无关才可豁免。入边 depends_on 用于发现受影响的其他页，不把所有依赖者一律判错。
- 关系 scope/理由写在声明页正文，Relations 值仍只用规范 wikilinks。脚本只发现边，读者负责适用性，不把 related/refines 当成替代。

### 答案与写回

回答区分 Wiki 直接结论、本地推论、实时核验结果及未解决缺口。只有当前任务已有写入授权且内容适合公开时才做最小 patch；真实复核后才更新验证日期。未授权只报告到期、冲突或待验证，不静默改 Wiki。

## Path by question type
### A. 概念 / 架构 / 方法论问题
默认路径：
- `wiki` → Freshness Gate → `memory` → `external if needed` → `write-back if authorized and public-suitable`

### B. 怎么做 / 怎么配置 / 怎么排障
默认路径：
- `wiki` → Freshness Gate + version match → `skills` → `memory` → `sessions if relevant` → `external if needed`

### C. “上次我们怎么做的”
默认路径：
- `sessions / session_search` → `wiki` → `skills`

### D. 当前事实 / 实时信息
默认路径：
- live tools / external search → `wiki` write-back if durable, authorized and public-suitable

## Relationship with boundaries
这条路径依赖 `[[hermes-memory-skills-wiki-boundaries]]` 的分工：
- `wiki` 负责正式知识
- `memory` 负责约束和稳定事实
- `skills` 负责执行流程
- `sessions` 负责历史回忆

如果边界混乱，检索顺序也会混乱。

## Write-back rule
先确认写入授权与公开准入，再在满足以下任一条件时考虑回写 `wiki`：
- 以后高概率还会再问
- 需要跨来源综合
- 对系统设计或工作流有长期价值
- 回答中形成了清晰的结构化结论

以下内容通常不回写：
- 一次性临时结果
- 纯执行日志
- 短期状态
- 没有复用价值的即时问答

## Anti-patterns
- 每次都直接外部搜索，绕过 wiki
- 把 memory 当成知识页来用
- 有 skill 却不用，导致重复解释步骤
- 把 session 历史当作唯一可信来源
- 已授权维护且符合公共准入的可复用结论未并入现有知识页

## Practical checklist
回答前快速过一遍：
1. 这个问题能否先从 `wiki` 找到？
2. 有没有相关 `memory` 会影响答案格式或边界？
3. 有没有相关 `skills` 能直接给出稳定做法？
4. 需不需要查 `session_search` 回忆过去？
5. 有到期、冲突、当前适用性缺口或实时核验要求时，先补证据
6. 这次答案值不值得回写 `wiki`？

## Canonical loop
一句话概括：
先限定范围并执行 Freshness Gate；按 memory 校准，用 skills 执行，用 sessions 回忆，必要时实时核验，有授权再回写。

## Related
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [hermes-wiki-lint-and-health-check-standards](/concepts/hermes-wiki-lint-and-health-check-standards)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`

