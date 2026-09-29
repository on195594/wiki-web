---
title: Agent Research Evidence Gate
type: concept
created: 2026-05-22
updated: 2026-05-22
tags:
  - agent
  - multi-agent
  - evaluation
  - workflow
  - research
  - governance
sources:
  - raw/articles/machinelearningmastery-multi-agent-research-assistant-2026-05-21.md
status: stable
description: 定义研究型 Agent 在最终综合前必须通过的证据收集和质量判断门。
aliases:
  - evidence-gated-research
---

# Agent Research Evidence Gate

## Summary

Research agents should not be designed as “search plus summarize” chatbots. A reliable research workflow separates orchestration, evidence collection, quality judgment, targeted evidence backfilling, and final synthesis: **Manager orchestrates, tools gather evidence, Judge decides whether evidence is sufficient, and Analyst writes only after the gate passes**.

This page compiles `[[machinelearningmastery-multi-agent-research-assistant-2026-05-21]]` into a reusable Hermes concept and connects it with `[[production-ai-agent-evaluation-framework]]`, `[[agent-orchestration-production-tradeoffs]]`, `[[agent-self-validation-loops]]`, and `[[llm-summary-identification-step]]`.

## Core pattern

The durable pattern is an evidence-gated research loop:

1. **Manager Agent** receives the question and owns the workflow, not the final factual answer.
2. **Search / scrape tools** gather live evidence and preserve source URLs.
3. **Judge Agent** scores whether the evidence is enough and outputs missing information.
4. **Manager** uses `missing_information` to run targeted follow-up searches or URL-level scrapes.
5. **Analyst Agent** produces the final report only when the evidence gate passes or when the system explicitly reports that evidence is insufficient.

The important move is that the loop has a *quality gate* before synthesis. Without that gate, a research assistant can quickly become a fluent summarizer of weak snippets, empty scrapes, stale pages, or model priors.

## What to preserve from the source

Preserve as reusable knowledge:

- Manager should act as an orchestrator, not as the source of truth.
- Judge should be independent from Analyst and return structured fields, not just prose criticism.
- `missing_information` is as important as the score because it tells the next search what to repair.
- Search/scrape tools should return source metadata and cleaned page content when possible.
- Analyst output should have a fixed report contract so the final document remains comparable across runs.
- Multi-step research needs trace IDs or equivalent run evidence to audit tool calls and decisions.

Preserve only as source-specific examples:

- The article's `0.85` Judge threshold is a useful example, not a Hermes default.
- The `gpt-5.4-mini`, OpenAI Agents SDK, Olostep, and Reflex choices are implementation details, not durable layer decisions.
- Olostep free-tier/account details are time-sensitive and should not become wiki operating rules.
- Reflex UI/PDF export claims are not strong enough to treat as an implementation pattern because the extracted source did not expose full implementation detail.

## Gate contract

A practical Judge contract should contain at least:

```text
is_good_enough: boolean
score: 0.0-1.0
reason: short explanation
missing_information: list of missing source, freshness, counterexample, or detail requirements
```

Recommended interpretation:

- High score means “enough evidence to synthesize,” not “the answer is certainly true.”
- Medium score should usually trigger targeted evidence backfilling instead of a full restart.
- Low score or repeated empty evidence should stop the workflow and disclose the extraction/search limitation.
- Numeric thresholds must be calibrated per task risk, source quality, and cost budget.

## Failure modes

### Fluent weak-evidence synthesis

If Analyst runs before Judge passes, the final report may sound complete while being grounded in snippets, duplicated sources, or stale pages.

Control: require source URLs and make unsupported claims visible as gaps or inference.

### Infinite evidence-backfilling loops

If Judge keeps returning “not enough” without budget limits, Manager may continue searching until max turns, timeout, or cost exhaustion.

Control: set hard limits for rounds, sources, scrape calls, latency, and cost; stop after repeated empty or duplicate results.

### Judge-as-style-reviewer

If Judge mainly critiques tone or formatting, it stops being a research quality gate.

Control: Judge should assess source sufficiency, freshness, relevance, conflict, and missing information.

### Tool/vendor coupling

If the workflow assumes one search/scrape provider is always available, external API failure can collapse the research loop.

Control: treat search and scrape as replaceable tool interfaces; record fallback reason and extraction limitations.

## Hermes mapping

### Wiki

This concept belongs in wiki as an architecture and workflow pattern for research agents. It explains how to structure evidence-gated research without prescribing a specific provider or active runtime change.

### Skills

Do not promote this directly into a Hermes skill. A future skill or reference may use it only after a local project validates concrete prompts, stop conditions, and evaluator checks.

### Memory

Do not store the article or threshold in memory. It is not a user preference or environment fact.

### Cron / MCP / runtime

Do not create cron jobs, MCP servers, wrappers, or runtime changes from this article alone. Those layers require a separate project-local validation and explicit approval.

## Relationship to existing concepts

- `[[production-ai-agent-evaluation-framework]]` defines what production agents should evaluate across retrieval, generation, behavior, and production layers; this page narrows that into a research-agent loop where the Judge decides whether evidence is sufficient before synthesis.
- `[[agent-orchestration-production-tradeoffs]]` explains when supervisor-worker or reflexive loops are worth the overhead; this page is a concrete supervisor/Judge pattern for research tasks.
- `[[agent-self-validation-loops]]` covers validation during iterative execution; this page emphasizes evidence sufficiency and source-grounding before final report generation.
- `[[llm-summary-identification-step]]` shares the same principle for summarization: identify what the source supports before generating claims.

## Operating rules

- Start with the smallest loop that can answer the research question; do not add agents for aesthetics.
- Make Judge output structured and machine-readable.
- Use `missing_information` to route the next search; do not blindly broaden the query.
- Stop on repeated empty results, duplicate sources, timeout, or budget exhaustion.
- Preserve source URLs and extraction limitations in the final report.
- Treat thresholds from articles as example magnitudes until calibrated locally.
- Keep active Hermes layer changes behind separate preflight and approval.

## Related

- `machinelearningmastery-multi-agent-research-assistant-2026-05-21`
- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs)
- [agent-self-validation-loops](/concepts/agent-self-validation-loops)
- [llm-summary-identification-step](/concepts/llm-summary-identification-step)
- [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)
- [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop)
- [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)
- [index](/)
- `log`

