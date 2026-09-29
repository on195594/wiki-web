---
title: Subagent Orchestration Patterns
created: 2026-05-07
updated: 2026-09-29
type: concept
tags:
  - agent
  - subagent
  - multi-agent
  - orchestration
  - workflow
  - governance
sources:
  - raw/articles/philschmid-subagent-patterns-2026-05-05.md
  - raw/articles/alphasignal-agent-orchestration-patterns-2026-05-05.md
  - raw/articles/gptcentral-ultimate-guide-building-ai-agents-2026-06-05.md
  - raw/articles/nature-capable-language-models-can-outgrow-the-benefits-of-collaboration-2026.md
  - raw/articles/langchain-paid-media-agent-2026-09-13.md
  - raw/articles/langchain-organizing-context-multi-agent-harness-2026-09-08.md
status: stable
description: 分类 subagent 编排中的顺序、并行、路由、评审和层级协作模式。
aliases:
  - subagent-patterns
---

# Subagent Orchestration Patterns

## Summary

Subagent orchestration should be chosen by lifecycle complexity, not by how impressive the architecture sounds. The useful ladder is: one-shot subagent calls, parallel fan-out, persistent agent pools, and direct agent teams. AI Agent should default to the simplest mode that gives isolation and verifiable output, then only move up the ladder when the task has real concurrency or stateful-collaboration needs.

This page synthesizes Phil Schmid's 2026 article `[[philschmid-subagent-patterns-2026-05-05]]` into AI Agent operating knowledge, and is complemented by AlphaSignal's benchmark-oriented trade-off page `[[agent-orchestration-production-tradeoffs]]`. It complements `[[hermes-context-layer-operating-rules]]`, which says when to use subagents, and `[[ai-coding-agent-workflow-types]]`, which classifies external coding-agent interaction modes.

## Core pattern

The core question is: **how much lifecycle control does the main agent need over its subagents?**

- If the subtask is independent and returns one result, use an inline subagent call.
- If several independent subtasks can run at once, use fan-out and gather results.
- If a specialist needs memory across multiple exchanges, use a persistent agent pool.
- If coordination itself exceeds what the main agent can manage, only then consider an agent team with direct inter-agent messaging.

Each step increases infrastructure burden, context risk, observability difficulty, and required model capability.

## Single-agent first escalation rule

GPT Central's 2026 guide `[[gptcentral-ultimate-guide-building-ai-agents-2026-06-05]]` adds a useful pre-orchestration rule: before adding subagents, first decide whether the task needs an agent at all, then maximize the simplest single-agent design.

AI Agent interpretation:

```text
rules/script/workflow automation
→ single agent with clear model, tools, instructions, stop conditions
→ inline or fan-out subagents
→ persistent pools or teams only after project-local validation
```

Use deterministic automation when fixed rules, SQL, scripts, or API workflows can cover the task. Use an agent when the task requires ambiguity handling, context-sensitive judgment, multi-step decisions, or dynamic tool use. Escalate from one agent to subagents only when the single agent shows real instruction overload, unstable tool choice, domain-role conflict, or measurable need for independent parallel work.

This rule complements `[[agent-context-engineering]]` on tool/instruction/context boundaries and `[[agent-closed-loop-learning-from-corrections-to-rules]]` on evidence-backed rule escalation: do not upgrade a useful rule of thumb into default behavior without local validation.

This source is a general tutorial rather than production evidence, so it strengthens the page's conservative adoption rule but does not by itself justify new active skills, runtime config, cron jobs, MCP tools, or default multi-agent behavior.

### Single-agent baseline before multi-agent escalation

`[[nature-capable-language-models-can-outgrow-the-benefits-of-collaboration-2026]]` provides a stronger precondition for escalation: choose multi-agent collaboration by task decomposability and measured single-agent need, not by task complexity or nominal team size. Weakly coupled, independently verifiable subtasks may justify fan-out; strongly sequential or shared-state tasks usually do not. A stronger single-agent baseline raises the burden of proof for adding coordination.

[推论] AI Agent rule: establish the single-agent baseline, identify a real bottleneck, confirm genuine parallelism, define merge and verification criteria, then run a small comparison. Agreement among similar agents is not independent evidence; parent-level evidence review remains mandatory.

The paper's numerical threshold, benchmark deltas, and coordination multipliers are source-specific observations, not AI Agent defaults. [推论] This update is a slimming rule: do not create a multi-agent workflow, pool, team, or router without local evidence that the gain exceeds communication, context, latency, and error-propagation costs.

## Four orchestration modes

### 1. Inline tool: subagent as one function call

The main agent calls a subagent the same way it calls a normal tool. The subagent receives a bounded task, runs in its own context, and returns one result.

Use for:
- code review
- source extraction
- file analysis
- focused research
- test generation
- independent verification

AI Agent mapping:
- A host-supported one-shot delegation call belongs here; the tool name and lifecycle depend on the host.
- The parent agent keeps the goal, constraints, decision authority, and verification responsibility.
- The subagent should return conclusions, evidence, paths/URLs/commands, and risks — not a full transcript.

Failure mode:
- No mid-task correction. If the subagent misunderstands, the parent only learns when the result returns.

### Context handoff by role

The lifecycle mode and the context-handoff mode are separate decisions. `[[langchain-organizing-context-multi-agent-harness-2026-09-08]]` proposes full-context forks for workers that continue a supervisor's diagnosis and isolated contexts for reviewers and self-contained researchers. Without assuming that AI Agent exposes a literal fork mode, preserve the useful distinction with the smallest existing mechanism:

- **Continuation worker / fixer**: include a bounded evidence packet containing the verified diagnosis, exact paths or SHAs, prior decisions, failing check, constraints and expected artifact. Do not make it rediscover facts the parent has already verified.
- **Independent reviewer / verifier**: provide the frozen diff or artifact, acceptance criteria and necessary project rules, but omit the parent's reasoning and expected conclusion.
- **Self-contained researcher**: provide the question, source standard and output contract only; this keeps parallel fan-out from duplicating irrelevant history.
- **Memory-oriented child**: use only when the conversation itself is necessary evidence, and retain AI Agent's existing privacy, layer-routing and explicit write-authorization boundaries.

Prompt-cache savings are a possible property of LangChain's full fork, not a AI Agent default. Add a fork-like runtime only after a real workload shows repeated rediscovery that bounded evidence packets cannot solve and a comparison measures quality, latency and token cost.

### 2. Fan-out: spawn independent agents and wait for results

The main agent separates dispatch from collection. It spawns multiple independent workers, continues other work if useful, then gathers results.

Use for:
- parallel source collection
- independent code review angles
- comparing alternatives
- sharded audits
- multi-file or multi-module inspections with low coupling

AI Agent mapping:
- Batch delegation is an option only when the host supports bounded parallel tasks.
- The parent must synthesize and verify results instead of forwarding subagent self-reports as facts.
- This is useful only when tasks are genuinely independent enough to justify coordination overhead.

Failure mode:
- Premature fan-out creates duplicate work and inconsistent assumptions. The parent must pass enough shared context to each worker.

#### Context isolation is not execution isolation

`[[langchain-paid-media-agent-2026-09-13]]` reports two concrete parent-worker failures. Two platform workers had separate context windows but wrote to the same report path and shared one `done` flag; the first completion could make the second stop without an artifact. Another worker could not determine whether PDF rendering had succeeded, repeatedly inspected files and eventually tried to rebuild the PDF.

The narrow fix was per-worker output paths and completion state, a three-tool child surface（read context、compute、render）, and one mechanical stop condition: successful render means done. The reusable rule is broader than context separation: each child needs isolated writable state, a bounded tool set, an exact return artifact, explicit failure semantics and a completion condition the parent can verify. Shared paths or lifecycle flags turn nominally parallel work into hidden coupling.

### 3. Agent pool: persistent workers with messages

The main agent keeps long-lived specialist agents and sends multiple messages over time. Workers retain conversation state and can be asked to revise, fact-check, or continue from prior context.

Use only when:
- the specialist's accumulated context materially improves the result
- the task spans multiple rounds
- restarting a fresh subagent would repeatedly lose important state

AI Agent mapping:
- Treat this as an optional design, not an assumed default.
- If implemented, it needs explicit lifecycle controls: list, status, max turns, timeout, kill, saved state, and cleanup.
- It should be validated in a project-local workflow before becoming a skill or cron pattern.

Failure mode:
- Resource leaks, stale context, forgotten cleanup, and confusing multiple worker histories.

### 4. Teams: agents talk directly to each other

The main agent defines roles and lets agents coordinate with each other through direct messages or a shared mailbox. The main agent becomes a supervisor instead of a step-by-step coordinator.

Use only when:
- coordination logic is too large for one parent agent
- subteams need to negotiate or exchange discoveries directly
- the system has strong observability and conflict controls

AI Agent mapping:
- This should remain experimental for AI Agent unless there is a validated project proving value.
- It requires cycle detection, deadlock timeouts, conflict handling, and clear reporting contracts.
- It is not appropriate as a default Telegram workflow because the user needs concise, verifiable results.

Failure mode:
- Agents can deadlock, talk past each other, edit the same files, or hide important state inside inter-agent conversations.

## Production trade-off layer

AlphaSignal's `[[agent-orchestration-production-tradeoffs]]` adds a second axis to this page. The Phil Schmid taxonomy asks how much lifecycle control the parent needs over subagents; the AlphaSignal taxonomy asks which production constraint dominates: cost/scale, latency, balanced control, or high-stakes accuracy.

Combined rule:
- Pick lifecycle mode from this page: inline, fan-out, pool, or team.
- Pick production topology from `[[agent-orchestration-production-tradeoffs]]`: sequential, fan-out, supervisor-worker, or reflexive loop.
- Only adopt the more complex option when the workload has measured need for parallelism, routing/escalation, persistent state, or verification.

## AI Agent adoption order

AI Agent should use this adoption order:

1. **Inline subagent by default** for bounded independent work.
2. **Fan-out** only when parallelism or independent perspectives are real.
3. **Agent pool** only after a project-local validation proves persistent context improves outcomes more than it adds risk.
4. **Teams** only as a deliberate experiment with observability, timeout, conflict, and rollback controls.

This matches the existing AI Agent bias: prefer narrow skills, project-local validation, visible artifacts, and verifiable outputs before promoting a workflow into default behavior.

## Operating rules

- Start with the smallest orchestration mode that can work.
- Do not use persistent agents when a fresh subagent can return a verifiable result.
- Do not use fan-out for dependent tasks; split dependencies first or keep the parent in sequence control.
- Treat subagent outputs as claims until the parent verifies paths, URLs, command results, or tests.
- Match handoff context to role: continuation workers receive bounded verified evidence; independent reviewers and researchers receive clean task contracts without the parent's conclusion.
- Require explicit cleanup for anything persistent.
- Do not promote agent-pool or team patterns into cron or default skills without a real validation project.
- Keep direct agent-to-agent communication out of core workflows until deadlock, conflict, and audit controls exist.

## What uncertainty this solves

This page reduces one specific uncertainty: when a task feels complex, should AI Agent add more agents or improve decomposition?

The answer is usually decomposition first. More agents help only when they isolate context, run independent work in parallel, or preserve specialist state that would otherwise be expensive to rebuild.

It does not solve:
- correctness of subagent findings
- prompt quality
- tool permission safety
- file conflict resolution
- latency and cost control
- model capability limits

Those still require verification gates, project-local tests, and parent-agent synthesis.

## What this adds to the existing wiki

- Extends `[[hermes-context-layer-operating-rules]]` from “when to use subagents” to “which subagent lifecycle mode to use”.
- Complements `[[ai-coding-agent-workflow-types]]` by describing internal orchestration topology rather than external user interaction mode.
- Gives a conservative design rule: prefer one-shot delegation; use fan-out only for independent tasks, and validate pools or teams before adoption.

## Evidence boundary for adoption

An earlier version cited a private search-workflow trial as validation. No publicly reproducible experiment supports that claim here, so it is not evidence for a universal default. Treat inline review, fan-out and persistent teams as design candidates: select them only when task independence, source risk and measurable coordination benefit justify the cost. Runtime or messaging changes still require the applicable authorization and target-system verification.

## Related

- `philschmid-subagent-patterns-2026-05-05`
- `alphasignal-agent-orchestration-patterns-2026-05-05`
- `gptcentral-ultimate-guide-building-ai-agents-2026-06-05`
- `langchain-organizing-context-multi-agent-harness-2026-09-08`
- [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs)
- [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)
- [ai-assumption-challenger-before-execution](/concepts/ai-assumption-challenger-before-execution)
- [ai-coding-agent-workflow-types](/concepts/ai-coding-agent-workflow-types)
- [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)
- [index](/)
- `log`
- [ai-task-delegation-patterns-from-local-cloud-hybrid-llms](/concepts/ai-task-delegation-patterns-from-local-cloud-hybrid-llms)

