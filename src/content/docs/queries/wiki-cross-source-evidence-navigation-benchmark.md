---
title: Wiki 跨源证据导航离线评测方案与拓扑基线
created: 2026-11-02
updated: 2026-11-04
type: query
tags:
  - agent
  - knowledge-base
  - evaluation
  - verification
  - architecture
  - workflow
sources:
  - repository:_meta/catalog.json
  - concepts/hermes-knowledge-freshness-and-claim-evidence.md
  - concepts/production-agent-evaluation-baselines.md
  - concepts/production-ai-agent-evaluation-framework.md
  - raw/articles/langchain-agent-memory-openwiki-graphs-2026-10-28.md
  - raw/articles/langchain-self-correcting-memory-openwiki-2026-08-26.md
status: stable
volatility: medium
verified_at: 2026-11-02
review_by: 2027-03-02
description: 保存本仓库 8 组双入口跨源证据导航（locate →
  expand）离线评测方案、黄金正式页与原始证据清单，以及一跳双向关系可达性拓扑基线，区分静态图重合度与重复问答引用一致性。
aliases:
  - cross-source-evidence-benchmark
  - evidence-navigation-benchmark
  - wiki-evidence-navigation-eval
---

# Wiki 跨源证据导航离线评测方案与拓扑基线

## Summary

本页从 [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence) 拆出并独立维护本仓库面向 `locate` → `expand` 两步证据导航的 **8 组双入口跨源检索评测方案（Q1–Q8）** 及其一跳双向关系拓扑基线。核心边界是严格区分两类指标：

1. **静态图拓扑可达性（已按 `_meta/catalog.json` 实测基线）**：从两个不同种子入口沿 `## Relations` 一跳双向展开后，完整可达正式页集合与 `raw/` 原始证据集合的重合度（Jaccard）及对候选黄金集的召回率，用于检测断链、孤岛与候选膨胀。
2. **模型问答引用一致性（Citation Consistency，当前状态：NOT_RUN）**：对同一跨源问题重复运行端到端模型问答流程时，实际引用的支撑段落集合的平均成对 Jaccard 相似度（参考 [langchain-agent-memory-openwiki-graphs-2026-10-28](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/langchain-agent-memory-openwiki-graphs-2026-10-28.md) 与 [langchain-self-correcting-memory-openwiki-2026-08-26](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/langchain-self-correcting-memory-openwiki-2026-08-26.md)）。当前仓库尚未提交端到端多次问答的运行记录与逐题段落引用产物，因此模型层引用一致性保持 **NOT_RUN**，不将静态图拓扑重合度冒充为模型回答稳定性。

## 1. 评测口径与证据边界

- **黄金集独立性**：固定治理前后 commit 或内容哈希清单，提交机器可读的入口、黄金正式页和黄金原始来源集合；黄金集须独立复核，不按治理后遍历结果倒推。
- **遍历约束统一**：对照无类型关系展开与类型化展开时，统一跳数、边方向、来源提取范围、停止条件和候选预算；若分别测单向与双向遍历，逐项标明。多分支与冲突不能默认为全部适用；`A supersedes B` 必须沿入边从旧页 B 指向现行页 A（见 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)）。
- **完整可达集合重合度**：对每个入口保留完整可达正式页及来源集合，不先与黄金集求交再计算 Jaccard。**跨入口可达证据重合度**是图结构指标，不是模型回答的引用一致性；两端皆空时标记 N/A，并报告空结果数，不能记为完全一致。
- **召回率与精确率成对报告**：黄金证据召回率可用可达集合与黄金集的交集计算；另报精确率（或候选池规模），防止靠扩大全库候选虚增召回。空黄金集的指标标记 N/A。
- **真实问答引用一致性（Citation Consistency）**：必须对同一问题重复运行真实回答流程，保存实际引用的段落 ID，再计算完整引用集合的平均成对 Jaccard；同时独立评估引用正确性和答案正确性（见 [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) 与 [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)）。
- **上下文开销口径**：上下文开销应统计实际加载的全部跳数、正式页与原始证据；仅统计一跳页面字节数时只能称为一跳体积代理，不能推导完整问答的 Token、延迟或成本节省。

## 2. 8 组双入口候选问题（Q1–Q8）

| 编号与跨源问题域 | 双入口种子页（Seed A ↔ Seed B） | 拟用黄金正式页与原始证据 |
| --- | --- | --- |
| **Q1：上下文工程 × 状态契约 × 专用模型压缩** | [agent-context-engineering](/concepts/agent-context-engineering) ↔ [agent-context-history-state-and-bounded-processing](/concepts/agent-context-history-state-and-bounded-processing) | 正式页：上述两页 + [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)<br>原始源：[arxiv-2608-26263-skill-state](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/papers/arxiv-2608-26263-skill-state.md), [langchain-scaledown-deep-agents-2026-10-13](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/langchain-scaledown-deep-agents-2026-10-13.md), [machinelearningmastery-effective-context-engineering-ai-agents-2026-04-28](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/machinelearningmastery-effective-context-engineering-ai-agents-2026-04-28.md) |
| **Q2：知识新鲜度 × 两步证据导航 × 旧计划替代** | [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence) ↔ [hermes-wiki-knowledge-freshness-improvement-plan](/queries/hermes-wiki-knowledge-freshness-improvement-plan) | 正式页：上述两页 + [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)<br>原始源：[langchain-agent-memory-openwiki-graphs-2026-10-28](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/langchain-agent-memory-openwiki-graphs-2026-10-28.md), [langchain-self-correcting-memory-openwiki-2026-08-26](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/langchain-self-correcting-memory-openwiki-2026-08-26.md) |
| **Q3：生产级评测 × 统计功效 × Rubric 校准 × 成本基线** | [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) ↔ [repeated-measures-statistical-power-for-ai-evaluation](/concepts/repeated-measures-statistical-power-for-ai-evaluation) | 正式页：上述两页 + [agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration), [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines), [agent-self-validation-loops](/concepts/agent-self-validation-loops)<br>原始源：[towardsdatascience-statistical-power-more-problems-2026-08-04](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/towardsdatascience-statistical-power-more-problems-2026-08-04.md), [langchain-similarweb-long-form-agent-report-evaluation-2026-07-29](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/langchain-similarweb-long-form-agent-report-evaluation-2026-07-29.md), [kdnuggets-llm-latency-inference-cost-2026-07-18](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/kdnuggets-llm-latency-inference-cost-2026-07-18.md) |
| **Q4：形式化工作流 × 分层代码审查 × Python 工程清单** | [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles) ↔ [hermes-python-engineering-capability-checklist](/concepts/hermes-python-engineering-capability-checklist) | 正式页：上述两页 + [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence), [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [agent-self-validation-loops](/concepts/agent-self-validation-loops)<br>原始源：[claude-dev-solving-code-review-at-anthropic-2026-10-15](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/claude-dev-solving-code-review-at-anthropic-2026-10-15.md), [aymannadeem-plan-mode-is-dead-2026-09-24](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/aymannadeem-plan-mode-is-dead-2026-09-24.md), [realpython-python-performance-optimization-guide-2026-10-21](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/realpython-python-performance-optimization-guide-2026-10-21.md) |
| **Q5：子代理编排 × 生产拓扑取舍 × 资源路由与证据门** | [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns) ↔ [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs) | 正式页：上述两页 + [agent-resource-optimization](/concepts/agent-resource-optimization), [agent-research-evidence-gate](/concepts/agent-research-evidence-gate), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)<br>原始源：[philschmid-subagent-patterns-2026-05-05](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/philschmid-subagent-patterns-2026-05-05.md), [alphasignal-agent-orchestration-patterns-2026-05-05](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/alphasignal-agent-orchestration-patterns-2026-05-05.md), [langchain-model-router-in-harness-2026-10-01](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/langchain-model-router-in-harness-2026-10-01.md) |
| **Q6：静态工具上下文 × 工具选择架构 × 类型化边界** | [agent-context-prompt-tools-and-examples](/concepts/agent-context-prompt-tools-and-examples) ↔ [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) | 正式页：上述两页 + [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture), [agent-context-engineering](/concepts/agent-context-engineering)<br>原始源：[microsoft-developer-ai-coding-agents-use-technology-2026-05-27](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/microsoft-developer-ai-coding-agents-use-technology-2026-05-27.md), [machinelearningmastery-tool-selection-ai-agents-2026-07-06](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/machinelearningmastery-tool-selection-ai-agents-2026-07-06.md), [langchain-paid-media-agent-2026-09-13](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/langchain-paid-media-agent-2026-09-13.md) |
| **Q7：经验固化闭环 × Skill 可逆状态机 × 知识演化元技能** | [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) ↔ [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state) | 正式页：上述两页 + [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)<br>原始源：[arxiv-2608-27454-wikiskill](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/papers/arxiv-2608-27454-wikiskill.md), [microsoft-research-evolib-evolving-knowledge-2026-07-30](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/microsoft-research-evolib-evolving-knowledge-2026-07-30.md), [xudong-han-self-evolving-agent-alloomi-2026-08-13](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/xudong-han-self-evolving-agent-alloomi-2026-08-13.md) |
| **Q8：文档解析结构保真 × 文档失真风险 × 确定性计算边界** | [document-parsing-structural-fidelity](/concepts/document-parsing-structural-fidelity) ↔ [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk) | 正式页：上述两页 + [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)<br>原始源：[llamaindex-markdown-is-all-you-need-2026-10-08](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/llamaindex-markdown-is-all-you-need-2026-10-08.md), [venturebeat-frontier-ai-document-fidelity-risk-2026-05-13](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/venturebeat-frontier-ai-document-fidelity-risk-2026-05-13.md), [motherduck-jev-for-analytics-2026-09-29](https://github.com/on195594/wiki/blob/7c5a99e214130a6e8f66846b88ea3ed7fd0cc53e/raw/articles/motherduck-jev-for-analytics-2026-09-29.md) |

## 3. 静态图谱一跳双向可达性基线（2026-11-04 实测）

基于 `repository:_meta/catalog.json` 的显式 `## Relations` 边（含出边与 `wiki_reverse_lookup` 入边），对每个入口做 1 跳展开，**包含种子自身，并从图中排除本评测页及其关联边**，得到正式页集合 $P_A, P_B$，避免评测页的回链污染候选集合。$R_A, R_B$ 是这些正式页 frontmatter `sources` 中的直接 `raw/` 路径与非代码区原始源 wikilink 的并集，不递归扩展原始源。黄金集取第 2 节表格；集合指标按此口径重算如下。

有效输入（各正式页的 Relations 与上述直接原始源集合，排除本页）规范化后的 SHA256 为 `0b92952dac6ec689799e1162a7ae3aaa3a471587f002515815267cbcf90f6567`。该指纹固定测量输入，不代表模型问答评测通过。

| 题号 | $|P_A|$ / $|P_B|$（一跳正式页数） | 正式页跨入口重合度 $J(P_A, P_B)$ | 黄金正式页召回率（Seed A / Seed B） | 黄金原始源召回率（Seed A / Seed B） | 原始源跨入口重合度 $J(R_A, R_B)$ | 结构诊断结论 |
| --- | --- | --- | --- | --- | --- | --- |
| **Q1** | 26 / 8 | 0.259 | 1.00 / 1.00 | 1.00 / 1.00 | 0.322 | 双入口一跳均 100% 覆盖黄金正式页与原始源；Seed A 为高入度枢纽页，候选池较宽 |
| **Q2** | 14 / 8 | 0.571 | 1.00 / 1.00 | 1.00 / 1.00 | 0.273 | 补齐旧计划页与 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) 依赖边后，双入口一跳均 100% 覆盖黄金正式页与原始源 |
| **Q3** | 31 / 7 | 0.188 | 1.00 / 1.00 | 1.00 / 1.00 | 0.265 | 统计功效页补齐 [agent-self-validation-loops](/concepts/agent-self-validation-loops) 与 [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines) 关联后，双入口一跳均 100% 覆盖黄金集 |
| **Q4** | 29 / 12 | 0.171 | 1.00 / 1.00 | 1.00 / 1.00 | 0.291 | Python 清单页补齐 [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization) 与 [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence) 后，双入口一跳均 100% 覆盖黄金集 |
| **Q5** | 31 / 20 | 0.417 | 1.00 / 1.00 | 1.00 / 1.00 | 0.560 | 子代理编排页补齐 [agent-research-evidence-gate](/concepts/agent-research-evidence-gate) 关联后，双入口一跳均 100% 覆盖黄金正式页与原始源（原始源重合度 `0.560`） |
| **Q6** | 8 / 27 | 0.207 | 1.00 / 1.00 | 1.00 / 1.00 | 0.254 | 静态上下文子页与类型化边界页一跳均 100% 覆盖黄金正式页与原始源 |
| **Q7** | 18 / 9 | 0.286 | 1.00 / 1.00 | 1.00 / 1.00 | 0.306 | 经验固化主干页与两个子页（Skill 状态机、知识演化元技能）形成完整三角互链 |
| **Q8** | 4 / 9 | 0.444 | 1.00 / 1.00 | 1.00 / 1.00 | 0.303 | 文档解析页与文档保真风险页双向补齐 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 及 [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary) 后，全表 Q1–Q8 双入口一跳黄金正式页与原始源召回率全部达 `1.00 / 1.00` |

### 复算命令

在本仓库根目录运行；只读，不写目录或评测产物。输出依次为题号、正式页数、正式页 Jaccard、黄金正式页召回、黄金原始源召回、原始源 Jaccard。未来图谱变动时应重算指纹和表格；历史提交可通过 Git 回放。

```bash
python3 - <<'PY'
import hashlib
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path('_meta/scripts').resolve()))
from wiki_health_check import extract_frontmatter, strip_code
from wiki_reverse_lookup import markdown_pages, sources

root = Path.cwd()
benchmark = 'queries/wiki-cross-source-evidence-navigation-benchmark.md'
catalog = json.loads((root / '_meta/catalog.json').read_text())
pages = {Path(p['path']).stem: p for p in catalog['pages'] if p['path'] != benchmark}
raw = {p.stem: p.relative_to(root).as_posix() for p in markdown_pages(root)
       if p.relative_to(root).parts[0] == 'raw'}
graph = {slug: set() for slug in pages}
evidence, inputs = {}, {}
for slug, page in pages.items():
    text = (root / page['path']).read_text()
    refs = {s for s in sources(extract_frontmatter(text)) if s.startswith('raw/')}
    links = re.findall(r'\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]', strip_code(text))
    refs.update(raw[s] for s in links if s in raw)
    evidence[slug] = refs
    inputs[slug] = {'relations': page['relations'], 'raw': sorted(refs)}
    for targets in page['relations'].values():
        for target in targets:
            if target in pages:
                graph[slug].add(target)
                graph[target].add(slug)
encoded = json.dumps(inputs, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
print('input_sha256', hashlib.sha256(encoded.encode()).hexdigest())

def jaccard(a, b):
    return f'{len(a & b) / len(a | b):.3f}' if a | b else 'N/A'

def recall(a, gold):
    return f'{len(a & gold) / len(gold):.2f}' if gold else 'N/A'

for line in (root / benchmark).read_text().splitlines():
    match = re.match(r'^\| \*\*Q([1-8])：', line)
    if not match:
        continue
    cells = line.split('|')
    a, b = re.findall(r'\[\[([^\]]+)\]\]', cells[2])
    goldlinks = re.findall(r'\[\[([^\]]+)\]\]', cells[3])
    gold = {a, b, *[s for s in goldlinks if s in pages]}
    goldraw = {raw[s] for s in goldlinks if s in raw}
    A, B = {a} | graph[a], {b} | graph[b]
    RA = set().union(*(evidence[s] for s in A))
    RB = set().union(*(evidence[s] for s in B))
    print('Q' + match[1], f'{len(A)}/{len(B)}', jaccard(A, B),
          f'{recall(A, gold)}/{recall(B, gold)}',
          f'{recall(RA, goldraw)}/{recall(RB, goldraw)}', jaccard(RA, RB))
PY
```

## 4. 采用与晋升边界

- 上表仅证明本仓库 `## Relations` 与段落级 `[[raw-...]]` 锚定在 1–2 跳内具备确定性图可达性；**模型在真实多跳问答中的引用一致性（Citation Consistency）、精确率与成本节省仍为待执行（NOT_RUN）假设**。
- 在提交模型问答评测脚本、独立复核黄金集与多次问答轨迹产物前，不得将静态可达率宣称为端到端问答准确率或引用稳定性提升。

## Relations

- refines: [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence), [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)
- depends_on: [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path), [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- related: [agent-context-engineering](/concepts/agent-context-engineering), [agent-context-history-state-and-bounded-processing](/concepts/agent-context-history-state-and-bounded-processing), [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [hermes-wiki-knowledge-freshness-improvement-plan](/queries/hermes-wiki-knowledge-freshness-improvement-plan), [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards), [repeated-measures-statistical-power-for-ai-evaluation](/concepts/repeated-measures-statistical-power-for-ai-evaluation), [agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles), [hermes-python-engineering-capability-checklist](/concepts/hermes-python-engineering-capability-checklist), [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence), [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs), [agent-resource-optimization](/concepts/agent-resource-optimization), [agent-research-evidence-gate](/concepts/agent-research-evidence-gate), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [agent-context-prompt-tools-and-examples](/concepts/agent-context-prompt-tools-and-examples), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture), [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops), [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state), [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills), [document-parsing-structural-fidelity](/concepts/document-parsing-structural-fidelity), [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk), [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary)

