---
title: Local-First 同步中的确认镜像、Outbox 与冲突政策
created: 2026-09-06
updated: 2026-09-06
type: concept
tags:
  - architecture
  - workflow
  - research
  - verification
sources:
  - raw/articles/reverse-linear-sync-engine-2026-09-06.md
status: stable
description: 用确认镜像、持久化待提交事务、乐观内存视图和单调游标组织可恢复客户端同步，并显式选择幂等与冲突政策。
aliases:
  - local-first-sync-recoverable-transactions
---

# Local-First 同步中的确认镜像、Outbox 与冲突政策

## Summary

对需要离线操作、即时反馈和崩溃恢复的中心化客户端，可把状态拆成三层：服务端确认状态的本地镜像、持久化的未确认操作队列（outbox），以及由两者投影出的乐观内存视图。单调游标用于发现缺失增量；服务端确认或广播到达后，客户端推进确认状态并清理待提交操作。该模式降低了未确认写入污染本地确认镜像的风险，但会引入重放、幂等、变基、回滚和过期处理成本，不应成为普通 CLI 或短生命周期任务的默认设计。

## 来源事实：Linear 个案

以下只描述 wzhudev 对 Linear 前端的独立逆向研究，不是 Linear 官方接口或稳定实现合同：

- 客户端使用服务端分配的单调递增同步 ID 判断是否遗漏增量，并通过同步组限制可见数据范围。
- 本地持久层区分已确认模型数据与未确认事务；内存模型先做乐观更新，事务随后排队、批量发送。
- 客户端重启后可恢复持久化事务；服务端拒绝时回滚内存变化，服务端增量到达后更新确认镜像。
- 远端增量与本地未决字段修改冲突时，研究观察到字段级 LWW 变基；撤销和重做也作为普通事务进入同步管线。
- 部分数据通过局部索引和批量水合按需加载，而不是把全部数据实例化到内存。

来源中的内部类名、表名、请求形状、模型数量、索引深度和操作码可能随版本漂移，不属于本文可迁移合同。

## 可迁移模型 [推论]

### 1. 三层状态

```text
confirmed mirror + pending operations -> optimistic view
```

- **确认镜像**：只保存服务端已经确认、可从权威源重建的状态。
- **待提交操作**：在 durable acceptance 后持久化，记录操作 ID、目标、预期基线、状态和重试信息。
- **乐观视图**：把未确认操作叠加到确认镜像上，为 UI 或调用方提供即时反馈；它不是权威状态。

这三层只有在断网、重启恢复或多端并发是明确需求时才值得存在。否则一次原子写入或简单请求—响应更便宜。

### 2. 游标与确认边界

单调游标适合回答“客户端已确认到哪个增量”。游标只有在对应工作已被持久接受或应用后才能推进；否则崩溃可能永久跳过事件。重连时客户端应比较本地和远端游标，补取缺失区间，并在应用增量时保持确定顺序。

游标作用域必须按真实隔离边界选择：全局、租户、用户、会话或资源流。Linear 个案中的全局全序 ID 不证明多租户 Hermes 系统也应采用全局热点。

### 3. 重放、去重与幂等

持久化 outbox 只能防止客户端丢失意图，不能自动实现 exactly-once。请求可能已在服务端生效但客户端尚未收到回执，此时重启重放会产生重复副作用。因此每个可重试写操作都应明确：

- 稳定操作 ID 或幂等键；
- 服务端去重窗口和回读方式；
- 重复创建、删除、发送、发布或工具调用的行为；
- 无法安全重放时的失败关闭或人工确认路径。

### 4. 冲突政策

LWW 是一种业务选择，不是通用正确答案。它可能适用于标题、描述、负责人等离散字段，但不应默认用于金额、权限、计数器、删除、消息发送、外部发布、工具执行或富文本共同编辑。

每类操作应显式选择覆盖、拒绝、合并、补偿或人工确认；同时定义冲突粒度、时钟/顺序来源和用户可见反馈。先证明字段级 LWW 足够，再考虑 OT/CRDT；也不要因为 CRDT 更通用就提前引入它。

### 5. 惰性水合

Local-First 不等于全部数据常驻内存。大数据集可按当前访问范围保存局部索引并批量水合，但必须记录“已查询且为空”和“尚未查询”的区别，避免把缓存未命中误认为业务上不存在。

### 6. Undo/Redo

如果撤销需要跨设备一致和可审计，应把撤销表示为新的反向事务，通过同一持久化、同步、授权和冲突管线执行，而不是直接恢复某个本地旧值。对不可逆外部副作用，应采用补偿操作或明确禁止撤销。

## Hermes 映射 [建议]

- 聊天到 Agent 的可恢复路由可以覆盖 durable enqueue、offset、去重、幂等和重启验证；本文补充“确认状态 + pending operations + optimistic view”的概念解释，不授权修改任何 active skill。
- 可恢复任务流应保持 `接收 update -> 授权/解析 -> durable enqueue -> 推进 offset -> 执行 -> 回读副作用 -> 完成` 的边界；没有真实恢复需求时不增加独立同步引擎。
- 若未来出现多设备、离线消息或多窗口并发需求，再在目标项目 spec/ADR 中定义权威源、操作 ID、游标作用域、冲突矩阵、拒绝回滚和过期策略。
- 长时间运行的 Agent 工作流可复用“pending intent 与 confirmed artifact 分离”的原则；checkpoint 仍不能替代外部结果回读。这与 [agent-development-lifecycle](/concepts/agent-development-lifecycle) 的权威状态和恢复边界一致。
- 生产侧副作用仍应按 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 的幂等、恢复和验证要求设计；客户端同步个案不自动变成生产数据迁移规范。

## 采用检查

仅当以下问题多数为“是”时，才在项目中采用该模式：

1. 客户端必须在断网时接受写操作吗？
2. 进程或设备重启后必须恢复未完成操作吗？
3. 多端可能并发修改同一业务对象吗？
4. 服务端能提供权威确认、增量补发和幂等去重吗？
5. 团队愿意承担回滚、变基、过期、迁移和观测成本吗？

若需求只是短生命周期 CLI、一次性脚本或线性请求—响应，优先不用该模式。

## 非采用边界

本文不授权：

- 修改 Hermes runtime、配置、Cron、MCP、Gateway、插件或默认同步行为；
- 新建通用同步框架或 `linear-sync` Skill；
- 把 LWW、全局游标、IndexedDB、MobX、装饰器、GraphQL 或 WebSocket 设为默认技术栈；
- 把来源中的性能、可靠性、安全性或权限推测升级为 Hermes 保证。

## Evidence boundary

来源作者明确表示未与 Linear 团队联合校对，研究基于混淆前端代码和公开演讲；README 还记录了写作期间实现持续变化。Tuomas Artman 的正面评价提高了案例可信度，但不把逆向观察变成官方、稳定或普遍适用的设计合同。任何项目采用都应以自身 fixture、故障注入、重启重放、重复提交和权威回读测试为准。

## Relations

- refines: [agent-development-lifecycle](/concepts/agent-development-lifecycle)
- related: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework), [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification)
- conflicts_with: []
- supersedes: []
- depends_on: []

## Related

- [agent-development-lifecycle](/concepts/agent-development-lifecycle)
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification)
- `reverse-linear-sync-engine-2026-09-06`

