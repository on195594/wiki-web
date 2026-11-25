---
title: Agent Research Evidence Gate
type: concept
created: 2026-05-22
updated: 2026-11-24
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
  - https://arxiv.org/html/2409.12941v3
  - https://arxiv.org/html/2503.09516v2
  - https://arxiv.org/html/2505.17005v1
  - https://arxiv.org/html/2504.03160v4
  - https://arxiv.org/html/2504.12516v1
  - https://arxiv.org/html/2602.07549v1
  - https://arxiv.org/html/2602.19127v2
  - https://arxiv.org/html/2606.29718v3
  - https://arxiv.org/html/2609.10901v1
  - https://arxiv.org/html/2611.20034v1
status: stable
description: 结合 CRAG 三路纠偏、Self-RAG 批判维度、2025–2026 RL 搜索损失掩码与 LiveLedger /
  FoldAgent 过程停止门控，定义研究型 Agent 综合前的证据闸门及 I_ident / G_evid / F_rt / V_cov /
  L_ledger 裁决矩阵。
aliases:
  - evidence-gated-research
volatility: medium
review_by: 2027-03-02
verified_at: 2026-11-02
---

# Agent Research Evidence Gate

## Summary

Research agents should not be designed as “search plus summarize” chatbots. A reliable research workflow separates orchestration, evidence collection, quality judgment, targeted evidence backfilling, and final synthesis: **Manager orchestrates, tools gather evidence, Judge decides whether evidence is sufficient, and Analyst writes only after the gate passes**.

This page compiles [machinelearningmastery-multi-agent-research-assistant-2026-05-21](https://github.com/on195594/wiki/blob/e682ccaf64b2242a3000497c0d5a1c2e258af632/raw/articles/machinelearningmastery-multi-agent-research-assistant-2026-05-21.md) into a reusable AI Agent concept and connects it with [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework), [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs), [agent-self-validation-loops](/concepts/agent-self-validation-loops), and [llm-summary-identification-step](/concepts/llm-summary-identification-step).

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

### 2025–2026 Long-Horizon Agentic Search Boundaries and Process-Level Stopping Gates

Empirical studies on reinforcement-learned search agents and long-horizon web forensics from 2025–2026 expose critical failure modes that single-scalar Judge scores fail to intercept:

1. **RL Interleaved Search, Retrieved-Token Loss Masking, and Abstention Collapse**:
   - Bowen Jin et al. (2025, *Search-R1*, [arXiv:2503.09516v2](https://arxiv.org/html/2503.09516v2)) train LLMs via PPO/GRPO to interleave `<think>`, `<search>`, `<information>`, and `<answer>` spans, proving that **retrieved-token loss masking** (zeroing policy and KL gradients on external `<information>` tokens) is required to prevent optimization collapse: removing the mask drops LLaMA3.2-3B-Base 7-dataset mean Exact Match (EM) from `0.305` to `0.147`, whereas masked RL lifts Qwen2.5-7B-Instruct to `0.384` mean EM (exceeding prompted IRCoT `0.239`). Song et al. (2025, *R1-Searcher++*, [arXiv:2505.17005v1](https://arxiv.org/html/2505.17005v1)) incorporate internal-knowledge utilization incentives to cut search calls by `52.9%` relative to Search-R1, while Yuxiang Zheng et al. (2025, *DeepResearcher*, [arXiv:2504.03160v4](https://arxiv.org/html/2504.03160v4)) extend GRPO with tool-observation masking to live open-web browsing (`+28.9` points over prompted baselines and `+7.2` over local-corpus RL on OOD Bamboogle `72.8`).
   - **Outcome-reward blind spots**: Sparse terminal EM rewards suffer from step-level credit-assignment bias, erase model abstention capability within `100` RL steps when supporting evidence is absent, and amplify capitulation to repeated false web echoes—where `1` false echo overturns `29%–48%` of correct answers and `8` echoes overturn `58%–66%` (*EchoSpec*, 2026, [arXiv:2611.20034v1](https://arxiv.org/html/2611.20034v1)). On 4-hop diagnostic chains, Search-R1 reaches only `6.0%` EM (*AgenticRAGTracer*, 2026, [arXiv:2602.19127v2](https://arxiv.org/html/2602.19127v2)).
2. **Long-Horizon Planning Gains vs. Browsing Calibration Collapse (`FRAMES` & `BrowseComp`)**:
   - On the 824-question multi-hop benchmark *FRAMES* (Satyapriya Krishna et al., 2024/2025, [arXiv:2409.12941v3](https://arxiv.org/html/2409.12941v3)), multi-step planning with query deduplication lifts Gemini-Pro-1.5 accuracy from `0.408` (no retrieval) and `0.474` (single-step BM25, 4-document recall `0.15`) to `0.66` (Oracle upper bound `0.729`, with `~80%` of residual Oracle errors concentrated in numerical and tabular post-processing).
   - On the 1,266-question web forensics benchmark *BrowseComp* (Jason Wei et al., 2025, [arXiv:2504.12516v1](https://arxiv.org/html/2504.12516v1)), persistent browsing raises accuracy from `0.6%` (GPT-4o) and `9.9%` (o1) to `51.5%` (Deep Research), yet **enabling web browsing increases calibration error** (`69% → 82%` on GPT-4o; `91%` calibration error on Deep Research), showing that multi-turn retrieval without strict constraint verification inflates confidence on wrong entity bindings.
3. **Illusory Completion, Context-Rot Abandonment, and Verifiable Process Gates (`LiveLedger`, `FoldAgent`, `SearchAtlas`)**:
   - Process-level diagnostics identify two dominant termination failures beyond budget exhaustion: **Illusory Completion**—terminating while atomic query constraints remain `Unknown` or `Refuted` (`93.5%` Under-verified Answer Rate [UAR] on Search-R1 and `52.1%` UAR on TongyiDR across multi-constraint queries, with `19.1%` of ostensibly correct answers unverified; [arXiv:2602.07549v1](https://arxiv.org/html/2602.07549v1))—and **Inconclusive Search Failures (ISF)**, where accumulated dead-end traces induce premature give-up well before exhausting 200K+ context windows (`53.4%` ISF on Qwen3.5-397B ReAct and `58.2%` on GLM-4.7 on BrowseComp; [arXiv:2606.29718v3](https://arxiv.org/html/2606.29718v3)), while failed runs consume more steps than successful ones (GPT-5 4-hop mean `8.25` vs. `4.48` steps; [arXiv:2602.19127v2](https://arxiv.org/html/2602.19127v2)).
   - `[推论]` High-stakes multi-constraint research gates should pair scalar Judge thresholds with three structural stopping controls:
     - **Atomic Constraint Ledger (`LiveLedger`, [arXiv:2602.07549v1](https://arxiv.org/html/2602.07549v1))**: decompose the question into atomic verifiable constraints $\mathcal{C} = \{C_1, \dots, C_n\}$ and maintain an objective ledger $E(k, C_i) \in \{\texttt{Satisfied}, \texttt{Refuted}, \texttt{Unknown}\}$ backed by verbatim source quotes; allow synthesis for candidate $k$ only when $\forall C_i \in \mathcal{C},\, E(k, C_i) = \texttt{Satisfied}$ and prune $k$ upon any `Refuted` entry (lifting gpt-oss-120b ReAct accuracy `39.1% → 50.7%` and cutting UAR `76.3% → 49.8%`, `-26.5 pp`).
     - **Failed-Trace Folding (`FoldAgent`, [arXiv:2606.29718v3](https://arxiv.org/html/2606.29718v3))**: isolate exploration in subagents or fold failed search branches at turn/context/struggle thresholds rather than issuing naive "continue searching" prompts (lifting Qwen3.5-397B BrowseComp accuracy `35.0% → 54.0%` and cutting ISF `53.4% → 6.4%`).
     - **Query-Evidence DAG Auditing (`SearchAtlas`, [arXiv:2609.10901v1](https://arxiv.org/html/2609.10901v1))**: check sequential backbone concentration and parallel direct constraint coverage while penalizing unretrieved prior-knowledge shortcuts ($\text{PK} \to A$), reaching `0.840–0.856` macro ROC-AUC in separating grounded from drifted trajectories.

*(Scoped verification note: the 2024–2026 preprints in this subsection were checked against public arXiv HTML pages on 2026-11-24 without archiving full texts; page-level `verified_at: 2026-11-02` for earlier sources remains unchanged.)*

### `[推论]` Parameterized Evidence-Gate, Identifiability & Verification Decision Matrix (`I_ident / G_evid / F_rt / V_cov`)

To coordinate pre-synthesis evidence gating across [llm-summary-identification-step](/concepts/llm-summary-identification-step), [human-machine-scientific-discovery-verification-scarcity](/concepts/human-machine-scientific-discovery-verification-scarcity), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop), and [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence), define five auditable governance parameters (structural decision bounds, not hardcoded runtime constants):

| Parameter | Symbol & Definition | Primary Failure Intercepted | Hardening / Fallback Action |
|---|---|---|---|
| **Supported Template-Slot Ratio** | $I_{\text{ident}} = N_{\text{supported slots}} / N_{\text{template slots}}$; count a slot once only if its required factual claims pass the Observed or Inferred support checks; report N/A when the denominator is zero | Template-driven fabrication on thin sources ([llm-summary-identification-step](/concepts/llm-summary-identification-step)); this is an engineering proxy, not a causal-identification theorem | Remove unsupported claims or mark evidence insufficient; a recommendation is not a lower-grade factual claim |
| **Evidence Gate Margin** | $G_{\text{evid}} = s_r - \tau_{\text{gate}}$; synthesis requires $G_{\text{evid}} \ge 0$ and $\mathcal{M}_r^{\text{crit}} = \varnothing$, regardless of new-source gain | Fluent synthesis over weak snippets or infinite empty-scrape loops | Only a failed gate enters the bounded backfill branch above, including its round, cost and gain checks; otherwise disclose insufficiency |
| **Round-Trip Structural Fidelity** | $F_{\text{rt}} = \text{Sim}(\pi(D_0), \pi(U(T(D_0))))$ over domain parser $\pi$, where $U$ attempts reversal but is not a proven inverse | Silent semantic distortion or whole-file rewrite corruption across multi-step edits | Replace generic file rewrite with scoped atomic tools ([typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)) and enforce per-step AST/schema diff gates |
| **Verification Obligation Coverage** | $V_{\text{cov}} = (\text{det}, \text{formal}, \text{bridge}, \text{review})$ vector over target claim scope | Mistaking partial formal/code checks for full domain truth ([human-machine-scientific-discovery-verification-scarcity](/concepts/human-machine-scientific-discovery-verification-scarcity)) | Keep status at `candidate` or `partially-formalized`; log falsified regions $\mathcal{N}_k$ and unformalized bridges explicitly |
| **Atomic Constraint Ledger Gate** | $L_{\text{ledger}}(k) = \bigwedge_{i=1}^{n} \mathbb{I}[E(k, C_i) = \texttt{Satisfied}]$ with verbatim source span and independent origin check per $C_i \in \mathcal{C}$ | Illusory completion on partially verified multi-constraint queries ([LiveLedger](https://arxiv.org/html/2602.07549v1)), context-rot premature give-up ([FoldAgent](https://arxiv.org/html/2606.29718v3)), and repeated false-echo capitulation ([EchoSpec](https://arxiv.org/html/2611.20034v1)) | Prune any candidate with $E(k, C_i) = \texttt{Refuted}$, fold failed search traces before context saturation, and backfill or abstain when any $C_i$ remains `Unknown` |

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
- [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) and [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence) define upstream `locate` → `expand` routing, Freshness Gate qualification, and claim-level citation support (FActScore / ALCE) before candidate evidence reaches this synthesis gate.
- [agentic-graphrag-pattern-selection](/concepts/agentic-graphrag-pattern-selection) and [wiki-cross-source-evidence-navigation-benchmark](/queries/wiki-cross-source-evidence-navigation-benchmark) pair bounded multi-hop graph expansion with this gate to prevent `NULL`-query hallucination collapse and separate tool-execution authorization from research evidence sufficiency.

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
- depends_on: [agent-self-validation-loops](/concepts/agent-self-validation-loops), [llm-summary-identification-step](/concepts/llm-summary-identification-step), [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path), [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence)
- related: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [constrained-toolbox-evaluator-loop](/concepts/constrained-toolbox-evaluator-loop), [human-machine-scientific-discovery-verification-scarcity](/concepts/human-machine-scientific-discovery-verification-scarcity), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist), [agentic-graphrag-pattern-selection](/concepts/agentic-graphrag-pattern-selection), [wiki-cross-source-evidence-navigation-benchmark](/queries/wiki-cross-source-evidence-navigation-benchmark)

