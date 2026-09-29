---
title: Public Info Monitoring Automation Methodology
created: 2026-05-06
updated: 2026-09-29
type: concept
tags:
  - monitoring
  - automation
  - research
  - cron
  - tool
  - agent
  - workflow
sources:
  - concepts/agent-development-lifecycle.md
  - concepts/stateful-agent-environments-and-grounded-verification.md
  - concepts/deterministic-analytics-llm-reasoning-boundary.md
status: stable
description: 总结只读公共信息监控自动化项目的范围、边界、验证和推广方法。
---

# Public Info Monitoring Automation Methodology

## Summary

本页总结只读公共信息监控自动化从信号定义、采集、变化判断到通知、健康检查和知识推广的最小可审计流程。

## Decision card

Use this page when a monitoring idea needs to become a low-noise, auditable, read-only automation project.

Default route:

1. Define the exact user-approved signal before writing collection code.
2. Model the public source and capture normal/failure fixtures.
3. Keep parsing, diff/policy, storage, notification, and health checks as separate layers.
4. Run the worker without LLM judgment in daily operation; use AI Agent only for supported and authorized build-time assistance, scheduling, delivery, and knowledge capture.
5. Promote learning to wiki/skill/template only after real runs, failure fixtures, health checks, and a retrospective.

Hard stops:

- do not monitor private, logged-in, CAPTCHA-gated, or access-controlled targets by default;
- do not auto-buy, auto-trade, auto-submit forms, or otherwise change external state;
- do not alert on every observed difference; alert only on approved, actionable signals;
- do not promote project-specific business thresholds into memory, runtime, or reusable skills without a separate review.

Navigation:

- Signal definition: [§1](#1-先定义值得提醒的变化)
- Source modeling and fixtures: [§2](#2-信息源建模), [§3](#3-先-fixture后-live-scrape)
- Project architecture and state: [§4](#4-项目最小架构), [§5](#5-状态保存)
- Diff and notification policy: [§6](#6-变化判断), [§7](#7-通知设计)
- AI Agent runtime and health: [§8](#8-ai-agent-runtime-模式), [§9](#9-健康检查)
- Knowledge routing and promotion: [§10](#10-知识沉淀路径)
- Illustrative examples: [Web price monitoring](#网页价格监控示例的关键教训), [Higher-risk monitoring](#更高风险监控的边界)
- Startup checklist: [新监控项目启动 checklist](#新监控项目启动-checklist)

## 定位

这是一套面向公开信息的通用方法：定期观察无需登录的公开来源，只在发生有意义的变化时提醒，并保留可审计状态。

证据边界：本页综合仓库内的生命周期、有状态验证和确定性计算原则。价格监控等场景仅作合成示例，不表示某个站点、项目、通知渠道或 AI Agent Cron 已经部署；真实采用必须由目标项目的 fixture、测试、运行回读和权限审批证明。

## 适用场景

适合：

- 商品价格、库存、补货、优惠变化
- 学校、政策、社区、机构公告
- 竞品网页、定价页、功能页变化
- 内容站新增文章、索引、排名变化
- 投资产品公告、费率、规则变更
- 本地系统状态、证书、备份、磁盘、服务健康

不适合直接套用：

- 需要登录、cookie、账号态或个人隐私数据的页面
- 需要绕过 CAPTCHA、反爬或访问控制的目标
- 高频、大规模爬取
- 自动交易、自动购买、自动提交表单等外部状态变更

## 标准流程

```text
目标识别 → 信息源建模 → 采集 → 结构化快照 → 状态保存 → 变化判断 → 通知 → 健康检查 → 复盘 → 推广
```

## 1. 先定义“值得提醒”的变化

在写采集代码之前，先写清楚：

```text
监控对象：
信息源：
采集字段：
提醒条件：
不提醒条件：
异常提醒条件：
频率：
通知渠道：
人工处理动作：
```

合成的价格监控示例：

```text
监控对象：公开商品页
信息源：无需登录的公开详情页
采集字段：标题、价格、币种、可用性、抓取状态
提醒条件：当前价格低于上一次成功抓取价格
不提醒条件：价格不变、涨价
异常提醒条件：抓取失败、价格不可观测、健康检查异常
频率：每日低频
通知渠道：部署者批准的通知通道
人工处理动作：用户自行决定是否购买；系统不自动下单
```

## 2. 信息源建模

每个新监控源都先建模，不直接写选择器。

项目内推荐文件：

```text
docs/source-analysis/<source>.md
```

最低要回答：

- URL 是否稳定？
- 是否需要登录？
- 是否可能 CAPTCHA/block？
- 字段在 HTML、JS、API、RSS 还是页面渲染后出现？
- 哪个页面区域语义上拥有这个字段？
- 哪些附近文本/数字是误导项？
- 失败时返回什么状态？
- 需要哪些 fixture？

## 3. 先 fixture，后 live scrape

不要把一次 live scrape 成功当成稳定性证明。

推荐顺序：

1. 保存公开、非个人化的正常页面 fixture。
2. 保存缺字段、不可用、block/CAPTCHA 等异常 fixture。
3. 写 parser 测试。
4. parser 测试通过后再接 Playwright 或 HTTP adapter。
5. live 失败时保存 debug 证据到 ignored 本地目录。

关键规则：

- 不从整页随便取第一个数字。
- 不用全页关键词判断状态。
- 找不到可信区域时返回 `unknown` 或明确失败。
- 新 markup 变体要变成 fixture + regression test。

## 4. 项目最小架构

```text
monitoring-project/
  AGENTS.md
  README.md
  config/
    watchlist.example.json
    watchlist.json          # local only, ignored
  data/                     # local only, ignored
    snapshots.jsonl
    latest.json
    runs/
    debug/
  docs/
    plans/
    methodology/
    source-analysis/
  src/<package>/
    models.py
    config.py
    scraper.py              # or collector.py
    parser.py
    storage.py
    diff.py                 # or policy.py
    notify.py
    health.py
    cli.py
  tests/
    fixtures/
    test_parser.py
    test_storage.py
    test_diff.py
    test_notify.py
    test_health.py
```

分层原则：

- `parser`：纯解析，不访问网络。
- `scraper/collector`：外部采集 adapter。
- `diff/policy`：纯变化判断，不读写文件、不发通知。
- `notify`：只格式化确定性文本，不直接调用外部通知服务。
- `storage`：状态读写，JSONL 为审计历史，latest 为索引。
- `health`：判断运行是否可信。
- `cli`：stdout/exit-code 合约边界。

## 5. 状态保存

MVP 默认：

- `snapshots.jsonl`：append-only 历史，审计和恢复来源。
- `latest.json`：每个对象的最新状态索引。
- `runs/*.json`：每次运行报告。

规则：

- 金额等精确数值不要用 float，JSON 中保存字符串。
- `latest.json` 不能替代历史。
- 写 latest 要原子替换，避免中断造成半截 JSON。
- 缺失或损坏状态要显式 unhealthy，不要静默重置。
- 如果 latest 是失败快照，diff 仍应能从历史找回上一次成功基线。

## 6. 变化判断

变化判断独立于采集和通知。

价格类样板策略：

```text
if current.status != ok:
    operational alert
elif current.price < previous_successful.price:
    price drop alert
else:
    record only
```

通用策略可以是：

- 降价提醒
- 阈值提醒
- 新增内容提醒
- 删除/消失提醒
- 状态恢复提醒
- 连续失败提醒
- stale data 提醒

每个策略都要明确 repeat 行为，避免同一状态每天重复打扰。

## 7. 通知设计

通知是稀缺资源，默认低噪音。

规则：

- 只提醒用户批准的信号。
- record-only 返回空字符串。
- 业务提醒和运行异常提醒分开。
- 多条提醒保持稳定排序和稳定分隔符。
- 通知文本要能行动，但不要塞 debug 日志。

可由调度包装器实现的 stdout 合约（需验证，不是所有产品默认语义）：

```text
空 stdout：不通知
非空 stdout：可投递给已批准的通知通道
exit 0：本轮完成，包括有业务/运行提醒的完成
非 0 exit：运行失败，由调度层告警
```

## 8. AI Agent runtime 模式

AI Agent 在这个方法中承担三类角色：

- 构建期：用工具、浏览器、Playwright、测试帮助建模和修复。
- 运行期：在目标版本支持且已授权时，用调度器运行并向批准的通道投递。
- 沉淀期：用 skills/wiki/memory/session search 管理可复用知识。

日常运行不依赖 LLM 临场判断，应该由固定 worker 执行。

若目标 AI Agent 版本支持相应能力且部署者已授权，可采用 no-agent wrapper；以下仅是可配置示例：

```bash
cd /path/to/project
scripts/project-uv run <worker> run --config config/watchlist.json
scripts/project-uv run <worker> health --config config/watchlist.json --max-age-hours 30
```

注意：

- wrapper 可放在部署者选择的 AI Agent 脚本目录。
- 脚本路径按目标调度器要求注册，并核对工作目录。
- wrapper 先手动运行通过，再创建 cron job。
- 不在项目核心代码里绑定具体通知服务。
- 不在 wrapper 内递归创建 cron job。

## 9. 健康检查

每个监控项目必须有健康检查。

最低检查：

- config 存在且非空；
- latest state 存在；
- configured objects 都有 latest；
- latest successful observation 未过期；
- latest observation 不是 block/captcha/network_error/parse_error；
- 最近 run report 不是 all-failed；
- 状态 JSON/JSONL 可读。

健康时静默，异常时输出可行动文本。

## 10. 知识沉淀路径

按目标宿主能力和通用知识分层，分别沉淀：

- 项目 docs：保存具体事实、证据、source-analysis、复盘。
- wiki：保存人类可读的方法论、决策说明、样板案例索引。
- skill：保存未来 agent 可执行的流程、坑位、验证 gate。
- skill references/templates：保存长 checklist、案例、模板。
- memory：只保存稳定环境事实，不保存步骤。
- cron：只保存具体 schedule，不保存方法论。

推广 gate：

1. 真实场景跑通。
2. 至少有一次失败案例被 fixture/test 固化。
3. 有 run/health/stdout 合约。
4. 能区分通用方法和站点特例。
5. 项目 gate 通过。
6. 才考虑进入 wiki/skill/template。

## 网页价格监控示例的关键教训

- 页面上的价格必须限定语义区域，不能取页面第一个 `¥`。
- `Decimal("0.00")` 可能是合法值，fallback 用 `is None`。
- 失败快照不能抹掉上一次成功价格基线。
- health 不能静默通过缺状态。
- 项目自己的 runner 应隔离环境噪音，避免污染 stdout 合约。
- 项目核心不依赖 AI Agent；AI Agent 是 runtime 和知识层。

这些是对典型页面解析失败模式的设计推论；仓库未附带某个商业站点的公开 fixture，不能据此宣称站点适配已验证。

## 更高风险监控的边界

当监控输出可能影响投资、医疗、法律或其他高风险决策时，只读采集本身并不足以证明系统安全。应增加 typed contracts、read-only / warning-only 报告层、来源和时效检查、明确的 non-closure，以及人工决策边界。

可复用结论：

- 先把工作流收敛成项目，而不是把业务逻辑散落在 AI Agent runtime 或脚本目录。
- 对会影响决策理解的输出，先建立 structured / typed contract，再扩展报告。
- `read-only` 和 `warning-only` 不是措辞装饰，必须用测试、输出文案和 closeout 同时钉住边界。
- 项目验证完成不等于 runtime、cron、skill 或 memory 推广；推广必须单独批准。

不推广的内容：

- 不把任何私有项目的投资规则、基金配置、阈值、目标权重或风险判断推广为通用投资建议。
- 不把 risk guardrails、strategic rebalance、post-signal review 或 data lifecycle audit 直接变成自动动作。
- 不把项目 phase 日志、行情、持仓或一次性 smoke 结果写入 memory。

## 新监控项目启动 checklist

- [ ] 写清楚提醒条件和不提醒条件。
- [ ] 写 `docs/source-analysis/<source>.md`。
- [ ] 捕获正常和异常 fixture。
- [ ] 写 parser 测试。
- [ ] 写 typed snapshot model。
- [ ] 实现采集 adapter。
- [ ] 实现 append-only snapshots 和 latest。
- [ ] 实现 pure diff/policy。
- [ ] 实现 deterministic notify formatter。
- [ ] 实现 quiet-when-healthy health command。
- [ ] 跑 full gates。
- [ ] 手动 dry-run 和 real run。
- [ ] wrapper 手动通过后再 schedule。
- [ ] 完成 retrospective 后再推广到 wiki/skill/template。

## Related

- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)

