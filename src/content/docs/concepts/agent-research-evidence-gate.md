---
title: Agent Research Evidence Gate
type: concept
created: 2026-05-22
updated: 2026-11-12
tags:
  - agent
  - multi-agent
  - evaluation
  - workflow
  - research
  - governance
sources:
  - raw/articles/machinelearningmastery-multi-agent-research-assistant-2026-05-21.md
  - https://arxiv.org/html/2401.15884v2
  - https://arxiv.org/abs/2310.11511
status: stable
description: 结合 CRAG 三路纠偏检索、Self-RAG 反思批判令牌与有界回填停止状态机，定义研究型 Agent
  在最终综合前必须通过的证据闸门及 I_ident / G_evid / F_rt / V_cov 裁决矩阵。
aliases:
  - evidence-gated-research
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Agent Research Evidence Gate

## Summary

Research agents should not be designed as “search plus summarize” chatbots. A reliable research workflow separates orchestration, evidence collection, quality judgment, targeted evidence backfilling, and final synthesis: **Manager orchestrates, tools gather evidence, Judge decides whether evidence is sufficient, and Analyst writes only after the gate passes**.

This page compiles [machinelearningmastery-multi-agent-research-assistant-2026-05-21](https://github.com/on195594/wiki/blob/5e7fe178b6f14ce677190aa82f4cd46509f71645/raw/articles/machinelearningmastery-multi-agent-research-assistant-2026-05-21.md) into a reusable AI Agent concept and connects it with [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework), [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs), [agent-self-validation-loops](/concepts/agent-self-validation-loops), and [llm-summary-identification-step](/concepts/llm-summary-identification-step).

**Source implementation boundary:** the article's Manager instructions stop calling Judge after a weak second judgment, gather more evidence, and then require Analyst to write the report without a final passing judgment. The source therefore does not implement a strict final evidence gate. **[推论]** The recheck-and-stop contract below is this page's hardening recommendation, not a safeguard already demonstrated by the tutorial; it has not been executed or validated here.

## Core pattern

The durable pattern is an evidence-gated research loop:

1. **Manager Agent** receives the question and owns the workflow, not the final factual answer.
2. **Search / scrape tools** gather live evidence and preserve source URLs.
3. **Judge Agent** scores whether the evidence is enough and outputs missing information.
4. **Manager** uses `missing_information` to run targeted follow-up searches or URL-level scrapes, then submits the updated evidence to Judge again within the configured round and cost limits.
5. **Analyst Agent** produces the research report only after the final evidence gate passes. If evidence remains insufficient or a limit is reached, the workflow stops and returns an explicit insufficiency status with known gaps, not a report presented as gate-approved synthesis.

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

- The article's `0.85` Judge threshold is a useful example, not a AI Agent default.
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

### Theoretical Grounding: Corrective RAG, Self-Reflective Critique, and Bounded Stopping

1. **Corrective Retrieval Routing (CRAG)**: Shi-Qi Yan et al. (2024, *Corrective Retrieval Augmented Generation*, [arXiv:2401.15884v2](https://arxiv.org/html/2401.15884v2)) motivate corrective retrieval because generation can be misled by irrelevant or inaccurate retrieved passages. CRAG scores each retrieved document individually: `Correct` applies if at least one document exceeds the upper threshold, `Incorrect` if every document is below the lower threshold, and `Ambiguous` otherwise. For a non-empty retrieval, this can be summarized using the maximum document score $s_r$ and thresholds $(\tau_{\text{high}}, \tau_{\text{low}})$; empty retrieval requires an explicit fallback:
   - `Correct` ($s_r > \tau_{\text{high}}$): decompose retrieved documents into fine-grained knowledge strips, filter irrelevant spans, and recompose before synthesis.
   - `Incorrect` ($s_r < \tau_{\text{low}}$): discard ungrounded initial retrieval and route targeted corrective queries to external web search.
   - `Ambiguous` ($\tau_{\text{low}} \le s_r \le \tau_{\text{high}}$): combine filtered internal evidence with targeted web backfilling.
2. **Self-Reflective Critique Dimensions (Self-RAG)**: Akari Asai et al. (2023/2024, ICLR, *Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection*, [arXiv:2310.11511](https://arxiv.org/abs/2310.11511)) decompose generation quality into distinct critique dimensions: retrieval necessity (`Retrieve`), passage relevance (`IsRel`), factual entailment support (`IsSup`: fully supported, partially supported, or no support), and overall utility (`IsUse`). `[推论]` In this workflow, an evidence gate should evaluate relevance and support independently of overall usefulness or surface fluency, preventing a fluent Analyst from masking `IsSup = No Support`; `IsUse` is a usefulness rating, not merely a style score.
3. **Bounded Sequential Backfilling State Machine**: `[推论]` To prevent an unsafe bypass (forcing report synthesis after a failed or missing final Judge check) while preventing infinite search loops under `max_turns`, let round $r \in \{1, \dots, R_{\max}\}$ produce evidence set $\mathcal{E}_r$, Judge score $s_r \in [0, 1]$, critical gap set $\mathcal{M}_r^{\text{crit}}$, cumulative cost $C_r$, and marginal non-empty source gain $\Delta G_r = |\text{ValidDocs}(\mathcal{E}_r) \setminus \text{ValidDocs}(\mathcal{E}_{r-1})|$ with $\mathcal{E}_0 = \varnothing$. `ValidDocs` must check source identity/version, relevant non-empty content and task-specific freshness; length alone does not establish validity. Its deduplication rule must allow a corrected or updated source to count as new evidence. A conservative transition policy is:
   $$\text{GateDecision}(\mathcal{E}_r, r) = \begin{cases} \texttt{SYNTHESIZE}(\mathcal{E}_r) & \text{if } s_r \ge \tau_{\text{gate}} \land \mathcal{M}_r^{\text{crit}} = \varnothing \\ \texttt{BACKFILL}(\mathcal{Q}(\text{reason}_r, \mathcal{M}_r^{\text{crit}})) & \text{if } (s_r < \tau_{\text{gate}} \lor \mathcal{M}_r^{\text{crit}} \ne \varnothing) \land r < R_{\max} \land C_r < B_{\text{cost}} \land \Delta G_r > 0 \\ \texttt{ABSTAIN\_WITH\_GAPS}(\mathcal{E}_r, \mathcal{M}_r^{\text{crit}}) & \text{otherwise} \end{cases}$$

Judge errors, malformed output or a non-actionable failure reason must stop with an explicit gap/error status, never pass by default. Zero source gain stops a failed gate under this conservative policy; it does not prove that further search could not help. A passing gate may synthesize with zero gain, because already sufficient evidence need not be new. Round and spend checks below constrain whether another retrieval round may start; hard monetary limits additionally require reserving the next call's maximum cost before dispatch.

### `[推论]` Parameterized Evidence-Gate, Identifiability & Verification Decision Matrix (`I_ident / G_evid / F_rt / V_cov`)

To coordinate pre-synthesis evidence gating across [llm-summary-identification-step](/concepts/llm-summary-identification-step), [human-machine-scientific-discovery-verification-scarcity](/concepts/human-machine-scientific-discovery-verification-scarcity), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), and [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop), define four auditable governance parameters (structural decision bounds, not hardcoded runtime constants):

| Parameter | Symbol & Definition | Primary Failure Intercepted | Hardening / Fallback Action |
|---|---|---|---|
| **Supported Template-Slot Ratio** | $I_{\text{ident}} = N_{\text{supported slots}} / N_{\text{template slots}}$; count a slot once only if its required factual claims pass the Observed or Inferred support checks; report N/A when the denominator is zero | Template-driven fabrication on thin sources ([llm-summary-identification-step](/concepts/llm-summary-identification-step)); this is an engineering proxy, not a causal-identification theorem | Remove unsupported claims or mark evidence insufficient; a recommendation is not a lower-grade factual claim |
| **Evidence Gate Margin** | $G_{\text{evid}} = s_r - \tau_{\text{gate}}$; synthesis requires $G_{\text{evid}} \ge 0$ and $\mathcal{M}_r^{\text{crit}} = \varnothing$, regardless of new-source gain | Fluent synthesis over weak snippets or infinite empty-scrape loops | Only a failed gate enters the bounded backfill branch above, including its round, cost and gain checks; otherwise disclose insufficiency |
| **Round-Trip Structural Fidelity** | $F_{\text{rt}} = \text{Sim}(\pi(D_0), \pi(U(T(D_0))))$ over domain parser $\pi$, where $U$ attempts reversal but is not a proven inverse | Silent semantic distortion or whole-file rewrite corruption across multi-step edits | Replace generic file rewrite with scoped atomic tools ([typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)) and enforce per-step AST/schema diff gates |
| **Verification Obligation Coverage** | $V_{\text{cov}} = (\text{det}, \text{formal}, \text{bridge}, \text{review})$ vector over target claim scope | Mistaking partial formal/code checks for full domain truth ([human-machine-scientific-discovery-verification-scarcity](/concepts/human-machine-scientific-discovery-verification-scarcity)) | Keep status at `candidate` or `partially-formalized`; log falsified regions $\mathcal{N}_k$ and unformalized bridges explicitly |

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

## AI Agent mapping

### Wiki

This concept belongs in wiki as an architecture and workflow pattern for research agents. It explains how to structure evidence-gated research without prescribing a specific provider or active runtime change.

### Skills

Do not promote this directly into a AI Agent skill. A future skill or reference may use it only after a local project validates concrete prompts, stop conditions, and evaluator checks.

### Memory

Do not store the article or threshold in memory. It is not a user preference or environment fact.

### Cron / MCP / runtime

Do not create cron jobs, MCP servers, wrappers, or runtime changes from this article alone. Those layers require a separate project-local validation and explicit approval.

## Relationship to existing concepts

- [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) defines what production agents should evaluate across retrieval, generation, behavior, and production layers; this page narrows that into a research-agent loop where the Judge decides whether evidence is sufficient before synthesis.
- [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs) explains when supervisor-worker or reflexive loops are worth the overhead; this page is a concrete supervisor/Judge pattern for research tasks.
- [agent-self-validation-loops](/concepts/agent-self-validation-loops) covers validation during iterative execution; this page emphasizes evidence sufficiency and source-grounding before final report generation.
- [llm-summary-identification-step](/concepts/llm-summary-identification-step) shares the same principle for summarization: identify what the source supports before generating claims.

## Operating rules

- Start with the smallest loop that can answer the research question; do not add agents for aesthetics.
- Make Judge output structured and machine-readable.
- Use `missing_information` to route the next search; do not blindly broaden the query.
- Stop on repeated empty results, duplicate sources, timeout, or budget exhaustion.
- Preserve source URLs and extraction limitations in the final report.
- Treat thresholds from articles as example magnitudes until calibrated locally.
- Keep active AI Agent layer changes behind separate preflight and approval.

## Relations

- refines: [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework), [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs)
- depends_on: [agent-self-validation-loops](/concepts/agent-self-validation-loops), [llm-summary-identification-step](/concepts/llm-summary-identification-step)
- related: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop), [human-machine-scientific-discovery-verification-scarcity](/concepts/human-machine-scientific-discovery-verification-scarcity), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist)

