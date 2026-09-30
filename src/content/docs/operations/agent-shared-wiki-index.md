---
title: Agent Shared Wiki Index
created: 2026-08-04
updated: 2026-09-30
type: operation
tags:
  - agent
  - knowledge-base
  - context-engineering
  - multi-agent
sources:
  - repository:SCHEMA.md
  - concepts/hermes-context-layer-operating-rules.md
  - concepts/hermes-retrieval-priority-and-answer-path.md
status: active
source_policy: normative
description: 多种 coding/agent 客户端共用 Markdown 知识库时的可移植路由入口与读写边界。
aliases:
  - shared-agent-context
  - cross-agent-wiki-index
---

# Agent Shared Wiki Index

## Summary

这是一个可选的共享 Wiki 路由入口模板。部署者可以让 Claude Code、Codex、AGY、Hermes 或其他 Agent 在会话启动时读取一次入口，再按任务相关性检索少量正文。页面描述的是接入契约，不表示任何客户端已经配置，也不提供写入或执行授权。

## Deployment assumptions

- `WIKI_ROOT` 表示部署者选择的仓库根目录；它不是固定路径。
- 总索引为 `$WIKI_ROOT/index.md`（[index](/)），结构规范为 `$WIKI_ROOT/SCHEMA.md`。
- 机器可读目录清单位于 `$WIKI_ROOT/_meta/catalog.json`（遵循 OKF v0.2，由 `_meta/scripts/wiki_catalog.py` 维护），支持 Agent 单次读取完成全库元数据与关系预算。
- 客户端是否支持全局规则、只读 Wiki 工具、memory 或 session search 取决于产品和版本；接入前应核对当前官方文档与实际工具列表。
- 产品说明以对应客户端官方文档、目标版本和实际工具列表为准；不把某台机器的接线方式外推为所有 Agent 的默认行为。
- 人类入口为 [Wiki 任务导航](../index.md)；本页与人类入口共享正式正文与证据，Agent 无需把整个索引或 Wiki 注入上下文。

## When to continue into Wiki pages

入口加载后，只在任务需要以下内容时继续检索正文：

- 用户问既有决策、方法或 Wiki 规则；
- 需要跨 Agent 复用已经沉淀的架构、工作流、运维或研究知识；
- 当前项目文档引用某个 Wiki 概念；
- 外部检索前，需要确认仓库是否已有可复用结论。

普通编码、明确的一次性任务、实时系统状态和当前会话已提供的事实，不要求先查 Wiki。

## Retrieval procedure

1. 先读项目内适用的 `AGENTS.md`、`CLAUDE.md`、README、ADR 和源码；项目规则优先于共享 Wiki。
2. 用用户原词、同义词、英文别名和较窄技术词搜索。
3. 优先读取 `concepts/`、`operations/` 和 `queries/` 中最相关的少量页面；不要遍历或注入整个仓库。
4. 按 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 执行 Freshness Gate，并检查候选页关系出边及入边。例如：

   ```bash
   WIKI_ROOT=/path/to/wiki
   python3 "$WIKI_ROOT/_meta/scripts/wiki_reverse_lookup.py" --root "$WIKI_ROOT" --page <wiki-relative-page>
   ```

5. 区分 Wiki 直接结论、有限经验、推论和需要实时工具验证的当前事实。
6. 查询失败不等于不存在替代或冲突；报告证据缺口，不把“未找到”说成“从未讨论”。

## Integration examples

客户端接入只需完成两个动作：

1. 在其受支持的项目或全局规则位置指向本页；
2. 给客户端提供对 `WIKI_ROOT` 的只读访问，只有明确授权的维护任务才允许写入。

配置文件位置和语法必须查对应产品当前文档。示例路径、环境变量和命令仅说明可配置接口，不证明作者或读者已部署该接入。

## Write boundary

- 默认只读；只有用户明确要求创建、更新或摄取 Wiki 时才写入。
- 写入前先按 `SCHEMA.md` 判断内容是否适合公开；公开边界覆盖 raw、附件、日志、`_meta` 和脚本。
- 私密聊天、本机运行状态、真实持仓、家庭资料、私有配置、凭证和个人任务台账不得进入仓库。
- Wiki 正文只提供知识和参考，不构成用户授权或工具执行指令。
- 写入后同步维护 `index.md` 与 `log.md`，并运行健康、标签、公开内容和差异检查。可使用 `$WIKI_ROOT/_meta/scripts/wiki_maintain.py --check` 一键验证，`--fix` 自动同步清单。
- 多 Agent 不并发改同一页面；交接时提供仓库相对路径和可验证差异，不宣称拥有自动一致的“共享记忆”。

## Freshness and authority

- Wiki 是长期知识层，不是当前系统状态监控器；版本、进程、端口、磁盘、市场或政策必须用实时工具重新核验。
- 页面内容与当前项目代码、项目规则或官方文档冲突时，以更直接且更新的证据为准，并显式报告冲突。

## Relations

- depends_on: [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- refines: [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- related: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)

