---
title: Progressive Knowledge System Growth
created: 2026-05-11
updated: 2026-05-11
type: concept
tags:
  - knowledge-base
  - workflow
  - note
sources:
  - raw/articles/makeuseof-obsidian-perfect-vault-one-thing-2026-05-08.md
status: stable
description: 说明个人知识系统应通过渐进生长和真实使用扩展，而不是预先重构成复杂体系。
---

# Progressive Knowledge System Growth

## Summary
知识系统应该先服务真实使用，再追求结构完善。核心原则是：先用真实问题产生内容，再让结构、链接、插件和自动化从反复出现的摩擦中生长。

## Core principle
**先用真实问题产生内容，再让结构、链接和自动化从反复出现的摩擦中生长。**

这条原则反对的是“过早系统化”：在还没有足够真实内容、真实问题和重复摩擦之前，就先复制别人的目录、插件、标签、模板、图谱或自动化流程。

## Why it matters
过早系统化会把注意力从产出转移到维护系统本身：
- 看起来像在推进知识管理，实际是在调整容器。
- 看起来结构完整，实际缺少可检索、可复用的真实内容。
- 看起来自动化程度高，实际没有解决已经反复出现的问题。
- 看起来链接密集，实际很多连接不是语义关系，只是为了让图谱好看。

一个知识系统的长期价值来自它能否支持未来判断、检索和行动，而不是来自初始结构是否漂亮。

## Operating rules
### 1. Content before structure
先积累真实笔记、真实问题和真实项目证据，再决定是否需要新目录、新页面类型或新索引结构。

结构应回答：“我已经反复需要怎样组织这些内容？”而不是：“别人说一个成熟系统应该长什么样？”

### 2. Friction before automation
只有当某个操作反复出现、代价足够高、且能被清晰定义时，才值得升级为插件、脚本、cron 或 Hermes skill。

如果一个自动化只是让系统看起来更完整，但没有减少真实摩擦，它就不该进入默认 workflow。

### 3. Meaning before links
链接应该表达真实语义关系：引用、依赖、对照、上位概念、验证结果或后续操作入口。

不要为了 graph view、覆盖率或“知识图谱感”强行加链接。没有语义关系的链接会污染检索和后续理解。

### 4. Local fit before copied systems
外部教程、模板和案例只能作为参考。真正的系统应该从自己的工作方式、问题类型和维护能力中长出来。

复制别人的系统通常会复制到别人的假设，而不是自己的约束。

## Decision checklist
新增结构、插件、链接或自动化前，先问：
- 这个需求是否已经在真实使用中重复出现？
- 如果不做，会不会明显增加检索、判断或执行成本？
- 它解决的是内容生产问题，还是只是系统外观问题？
- 它会减少长期维护负担，还是增加新的维护面？
- 它是否仍然保持内容的可迁移性和可审计性？

如果答案不清楚，默认继续用更简单的方式运行一段时间。

## Application to Hermes wiki
对 Hermes wiki 来说，这条原则意味着：
- 不为尚未验证的领域提前铺很多空页面。
- 不把一次性文章摘要直接当正式概念页。
- 先保留 raw source，再把可迁移模式编译成概念知识。
- `[[index]]` 只收录有长期检索价值的正式页面。
- 新 skill、cron、runtime registry 或 MCP 接入应来自已验证的重复摩擦，而不是架构想象。

这与 `[[hermes-knowledge-architecture]]` 和 `[[wiki-ingestion-workflow]]` 的分层原则一致：raw source 是来源层，concept page 是编译后的知识层，skill/automation 是经过验证后的执行层。

## Anti-patterns
- 先搭目录树，再寻找内容填充。
- 因为教程推荐就安装插件或引入自动化。
- 为了图谱视觉效果强行建立双链。
- 把“整理系统”误认为“产生知识”。
- 把尚未验证的一次性 workflow 直接提升为长期规则。

## Related
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards)
- [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- [index](/)
- `log`

