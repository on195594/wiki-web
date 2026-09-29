---
title: AI Agent LifeOS Layer Boundary Contract
created: 2026-05-18
updated: 2026-09-29
type: concept
tags:
  - agent
  - lifeos
  - architecture
  - workflow
  - governance
sources:
  - concepts/hermes-lifeos-executable-architecture.md
  - concepts/hermes-context-layer-operating-rules.md
  - concepts/hermes-layer-routing-decision-checklist.md
  - concepts/hermes-memory-skills-wiki-boundaries.md
  - concepts/hermes-knowledge-architecture.md
status: stable
description: 规定 AI Agent LifeOS 各层之间的职责、准入和越界判断契约。
aliases:
  - lifeos-layer-boundary
  - agent-lifeos-layer-boundary-contract
---

# AI Agent LifeOS Layer Boundary Contract

## Summary

This page defines the LifeOS-specific boundary contract for AI Agent layers: `wiki`, `memory`, `skill`, `cron`, `MCP`, `profile`, and `session`.

It is not a generic context-routing checklist. The differentiator is the LifeOS topology decision: keep the main semantic layer in the main coordination context, then use the other primitives for knowledge, methods, automation, and tool access before introducing runtime-state isolation.

Use [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules) for context-window and project-state operating rules. Use this page when deciding whether a LifeOS capability belongs in the main coordination context, a durable knowledge/method layer, or a separate runtime profile.

## Capability boundary

`memory / skill / cron / MCP / profile` 在此是职责简称。可以分别由授权的偏好存储、SOP、系统调度器、API/CLI/连接器和独立运行环境承担；缺少某项原生能力时不必补齐。Profile 名称不证明凭证、权限或状态隔离，真实隔离必须由目标系统配置和测试证实。调度任务应自包含，但是否创建 fresh session 取决于调度器。

## Core contract

AI Agent LifeOS should stay unified by default.

```text
main coordination context
├── wiki      -> formal knowledge and domain models
├── memory    -> short stable facts and preferences
├── skills    -> reusable methods
├── cron      -> scheduling of stable methods
├── MCP       -> live external-system capabilities
└── sessions  -> temporary exploration and task state
```

Dedicated profiles are rare isolation boundaries, not domain folders.

## Layer map

### `wiki`

Role: formal LifeOS knowledge layer for concepts, domain models, decision records, comparisons, and durable query answers.

Allowed:

- LifeOS architecture, domain models, stable conclusions, public runbooks, and formal pages needing links and sources.

Forbidden:

- Temporary task state, raw chat as final page, private execution records, scheduling metadata, and secrets.

Judgment sentence: if it answers “what is this, why is it designed this way, and how does it relate to other knowledge,” prefer `wiki`.

### `memory`

Role: short, stable, high-value facts worth default injection.

Allowed:

- Long-term preferences, canonical paths, stable environment facts, verified tool quirks, and one-sentence constraints.

Forbidden:

- Long explanations, project progress, article summaries, temporary workarounds, and anything needing sections or examples.

Judgment sentence: if it cannot be compressed into one stable fact, do not put it in `memory`.

### `skill`

Role: repeatable method layer with triggers, workflow steps, pitfalls, and verification.

Allowed:

- Wiki ingestion, code review, governance cleanup, and other recurring processes once repeated and stable.

Forbidden:

- Broad conceptual essays, personal preference facts, pure tool availability notes, and one-off task decisions.

Judgment sentence: if it answers “how should this kind of work be done next time,” prefer `skill`.

### `cron`

Role: time-based scheduling layer for stable methods with self-contained inputs.

Allowed:

- Stable recurring summaries, periodic health checks, watchdogs, monitoring, and reminders with clear failure behavior.

Forbidden:

- Unproven workflows, business logic hidden inside prompts, jobs needing current-chat context, and silent-failure tasks.

Judgment sentence: `cron` answers “when should this run,” not “how does this method work.”

### `MCP`

Role: external live-system capability layer.

Allowed:

- Calendar, mail, docs, spreadsheets, maps, GitHub, monitoring, task systems, and other narrow tool access.

Forbidden:

- Long-term knowledge storage, method definitions, scheduling definitions, and static notes better represented elsewhere.

Judgment sentence: if the core problem is “AI Agent needs to read or operate a live external system,” consider `MCP`.

### `profile`

Role: runtime-state isolation layer for configuration, memory, sessions, skills, cron, gateway state, identity, or experimental behavior.

Allowed:

- Work/personal separation, public or multi-user bot identity, lab experiments, high-risk automation, or any case where state pollution has real cost.

Forbidden:

- One profile per life domain, topic folders, splitting the main LifeOS semantic layer, or creating a profile because a subject is important.

Hard rule:

- No new profile without explicit isolation benefit.
- Prefer `wiki / skill / cron / MCP` for domain and workflow separation.
- Keep the main LifeOS meaning layer in 主协调上下文 unless there is a concrete runtime-state conflict.

Judgment sentence: `profile` answers “does runtime state need isolation,” not “is this a new domain.”

### `session`

Role: temporary working context for exploration, in-flight reasoning, unverified hypotheses, and one-off intermediate state.

Allowed:

- Current-task assumptions, tool outputs while deciding, unverified ideas, and temporary clarifications.

Upgrade routes:

- Short stable fact -> `memory`.
- Repeatable method -> an existing SOP or `skill`.
- Formal knowledge -> `wiki`.
- Stable recurring execution -> a stable method (SOP or `skill`) + an authorized scheduler/`cron`.
- Live external capability -> an authorized API, CLI, connector, or suitable `MCP`.
- Runtime-state isolation need -> `profile`.

Judgment sentence: important does not mean persistent; unstable content stays in `session`.

## One-screen decision matrix

- External live capability -> an authorized API, CLI, connector, or suitable `MCP`
- Repeatable method -> an existing SOP or `skill`
- Stable time-based execution -> `cron`
- Short stable fact -> `memory`
- Formal knowledge asset -> `wiki`
- Runtime-state isolation -> `profile`
- Temporary exploration -> `session`

If multiple layers are involved, split by role instead of duplicating the same content everywhere.

Example: a weekly school-information review may have a domain model in `wiki`, a research method in `skill`, a schedule in `cron`, live school/calendar access via `MCP`, and stable user preferences in `memory`.

## LifeOS-specific anti-patterns

- Creating a `family`, `investment`, or `workout` profile just because the domain is important.
- Putting long family/finance/education strategy pages into `memory`.
- Encoding recurring review processes only as cron prompts.
- Mixing conceptual explanations with private execution state; public runbooks belong in `operations/`.
- Turning skills into architecture essays.
- Treating current-session exploration as already-governed durable knowledge.

## Relationship to adjacent pages

- [hermes-lifeos-executable-architecture](/concepts/hermes-lifeos-executable-architecture) is the hub: overall LifeOS topology and execution order.
- [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules) governs context-window hygiene, project state, subagents, and retrieval budgeting.
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist) is the generic quick routing checklist aligned to the target host’s actual capabilities.
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) is the narrower memory/skill/wiki boundary reference.
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture) describes the wiki and AI Agent knowledge stack as a whole.

This page should remain the LifeOS architecture contract, especially around `profile` as runtime-state isolation. If it drifts into a generic routing checklist, merge useful pieces back into adjacent pages instead of keeping a redundant page.

## Relations
- depends_on: [hermes-lifeos-executable-architecture](/concepts/hermes-lifeos-executable-architecture)
- depends_on: [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- depends_on: [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- depends_on: [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- depends_on: [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)

## Related

- [hermes-lifeos-executable-architecture](/concepts/hermes-lifeos-executable-architecture)
- [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture)
- [hermes-knowledge-base-operating-flow](/concepts/hermes-knowledge-base-operating-flow)
- [index](/)
- `log`

