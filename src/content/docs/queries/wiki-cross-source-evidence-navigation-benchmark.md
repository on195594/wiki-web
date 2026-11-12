---
title: Wiki 跨源证据导航离线评测方案与拓扑基线
created: 2026-11-02
updated: 2026-11-09
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
  - repository:_meta/retrieval-benchmark.json
  - repository:_meta/retrieval-benchmark-q5-q8.json
  - concepts/hermes-knowledge-freshness-and-claim-evidence.md
  - concepts/production-agent-evaluation-baselines.md
  - concepts/production-ai-agent-evaluation-framework.md
  - raw/articles/langchain-agent-memory-openwiki-graphs-2026-10-28.md
  - raw/articles/langchain-self-correcting-memory-openwiki-2026-08-26.md
  - raw/articles/nature-capable-language-models-can-outgrow-the-benefits-of-collaboration-2026.md
  - raw/articles/machinelearningmastery-multi-agent-research-assistant-2026-05-21.md
  - raw/articles/langchain-model-router-in-harness-2026-10-01.md
  - raw/articles/llamaindex-markdown-is-all-you-need-2026-10-08.md
  - raw/articles/motherduck-jev-for-analytics-2026-09-29.md
  - raw/articles/venturebeat-frontier-ai-document-fidelity-risk-2026-05-13.md
  - raw/articles/towardsdatascience-hybrid-ai-deterministic-analytics-2026-05-22.md
status: stable
volatility: medium
verified_at: 2026-11-06
review_by: 2027-03-02
description: 保存 Q1–Q8 检索基线及 Q5/Q8 公开证据包与评分纠正，区分候选召回、引用支持、事实核验和仍未执行的自由检索端到端评测。
aliases:
  - cross-source-evidence-benchmark
  - evidence-navigation-benchmark
  - wiki-evidence-navigation-eval
---

# Wiki 跨源证据导航离线评测方案与拓扑基线

## Summary

本页从 [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence) 拆出并独立维护本仓库面向 `locate` → `expand` 两步证据导航的 **8 组双入口跨源检索评测方案（Q1–Q8）** 及其一跳双向关系拓扑基线。核心边界是严格区分两类指标：

1. **静态图拓扑可达性（已按 `_meta/catalog.json` 实测基线）**：从两个不同种子入口沿 `## Relations` 一跳双向展开后，完整可达正式页集合与 `raw/` 原始证据集合的重合度（Jaccard）及对候选黄金集的召回率，用于检测断链、孤岛与候选膨胀。
2. **模型问答引用一致性**：第 5 节记录已执行的三策略固定证据包重复回答试验（8 题 × 3 策略 × 2 次）。这是受控输入下的真实回答与引用集合比较，不是完整 Agent 自由检索端到端评测；后者仍为 **NOT_RUN**。引用一致性概念参考 [langchain-agent-memory-openwiki-graphs-2026-10-28](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/langchain-agent-memory-openwiki-graphs-2026-10-28.md) 与 [langchain-self-correcting-memory-openwiki-2026-08-26](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/langchain-self-correcting-memory-openwiki-2026-08-26.md)。

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
| **Q1：上下文工程 × 状态契约 × 专用模型压缩** | [agent-context-engineering](/concepts/agent-context-engineering) ↔ [agent-context-history-state-and-bounded-processing](/concepts/agent-context-history-state-and-bounded-processing) | 正式页：上述两页 + [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)<br>原始源：[arxiv-2608-26263-skill-state](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/papers/arxiv-2608-26263-skill-state.md), [langchain-scaledown-deep-agents-2026-10-13](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/langchain-scaledown-deep-agents-2026-10-13.md), [machinelearningmastery-effective-context-engineering-ai-agents-2026-04-28](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/machinelearningmastery-effective-context-engineering-ai-agents-2026-04-28.md) |
| **Q2：知识新鲜度 × 两步证据导航 × 旧计划替代** | [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence) ↔ [hermes-wiki-knowledge-freshness-improvement-plan](/queries/hermes-wiki-knowledge-freshness-improvement-plan) | 正式页：上述两页 + [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)<br>原始源：[langchain-agent-memory-openwiki-graphs-2026-10-28](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/langchain-agent-memory-openwiki-graphs-2026-10-28.md), [langchain-self-correcting-memory-openwiki-2026-08-26](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/langchain-self-correcting-memory-openwiki-2026-08-26.md) |
| **Q3：生产级评测 × 统计功效 × Rubric 校准 × 成本基线** | [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) ↔ [repeated-measures-statistical-power-for-ai-evaluation](/concepts/repeated-measures-statistical-power-for-ai-evaluation) | 正式页：上述两页 + [agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration), [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines), [agent-self-validation-loops](/concepts/agent-self-validation-loops)<br>原始源：[towardsdatascience-statistical-power-more-problems-2026-08-04](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/towardsdatascience-statistical-power-more-problems-2026-08-04.md), [langchain-similarweb-long-form-agent-report-evaluation-2026-07-29](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/langchain-similarweb-long-form-agent-report-evaluation-2026-07-29.md), [kdnuggets-llm-latency-inference-cost-2026-07-18](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/kdnuggets-llm-latency-inference-cost-2026-07-18.md) |
| **Q4：形式化工作流 × 分层代码审查 × Python 工程清单** | [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles) ↔ [hermes-python-engineering-capability-checklist](/concepts/hermes-python-engineering-capability-checklist) | 正式页：上述两页 + [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence), [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [agent-self-validation-loops](/concepts/agent-self-validation-loops)<br>原始源：[claude-dev-solving-code-review-at-anthropic-2026-10-15](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/claude-dev-solving-code-review-at-anthropic-2026-10-15.md), [aymannadeem-plan-mode-is-dead-2026-09-24](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/aymannadeem-plan-mode-is-dead-2026-09-24.md), [realpython-python-performance-optimization-guide-2026-10-21](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/realpython-python-performance-optimization-guide-2026-10-21.md) |
| **Q5：子代理编排 × 生产拓扑取舍 × 资源路由与证据门** | [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns) ↔ [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs) | 正式页：上述两页 + [agent-resource-optimization](/concepts/agent-resource-optimization), [agent-research-evidence-gate](/concepts/agent-research-evidence-gate), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)<br>原始源：[philschmid-subagent-patterns-2026-05-05](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/philschmid-subagent-patterns-2026-05-05.md), [alphasignal-agent-orchestration-patterns-2026-05-05](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/alphasignal-agent-orchestration-patterns-2026-05-05.md), [langchain-model-router-in-harness-2026-10-01](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/langchain-model-router-in-harness-2026-10-01.md) |
| **Q6：静态工具上下文 × 工具选择架构 × 类型化边界** | [agent-context-prompt-tools-and-examples](/concepts/agent-context-prompt-tools-and-examples) ↔ [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) | 正式页：上述两页 + [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture), [agent-context-engineering](/concepts/agent-context-engineering)<br>原始源：[microsoft-developer-ai-coding-agents-use-technology-2026-05-27](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/microsoft-developer-ai-coding-agents-use-technology-2026-05-27.md), [machinelearningmastery-tool-selection-ai-agents-2026-07-06](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/machinelearningmastery-tool-selection-ai-agents-2026-07-06.md), [langchain-paid-media-agent-2026-09-13](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/langchain-paid-media-agent-2026-09-13.md) |
| **Q7：经验固化闭环 × Skill 可逆状态机 × 知识演化元技能** | [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) ↔ [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state) | 正式页：上述两页 + [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)<br>原始源：[arxiv-2608-27454-wikiskill](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/papers/arxiv-2608-27454-wikiskill.md), [microsoft-research-evolib-evolving-knowledge-2026-07-30](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/microsoft-research-evolib-evolving-knowledge-2026-07-30.md), [xudong-han-self-evolving-agent-alloomi-2026-08-13](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/xudong-han-self-evolving-agent-alloomi-2026-08-13.md) |
| **Q8：文档解析结构保真 × 文档失真风险 × 确定性计算边界** | [document-parsing-structural-fidelity](/concepts/document-parsing-structural-fidelity) ↔ [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk) | 正式页：上述两页 + [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)<br>原始源：[llamaindex-markdown-is-all-you-need-2026-10-08](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/llamaindex-markdown-is-all-you-need-2026-10-08.md), [venturebeat-frontier-ai-document-fidelity-risk-2026-05-13](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/venturebeat-frontier-ai-document-fidelity-risk-2026-05-13.md), [motherduck-jev-for-analytics-2026-09-29](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/motherduck-jev-for-analytics-2026-09-29.md) |

## 3. 静态图谱一跳双向可达性基线（2026-11-06 实测）

基于 `repository:_meta/catalog.json` 的显式 `## Relations` 边（含出边与 `wiki_reverse_lookup` 入边），对每个入口做 1 跳展开，**包含种子自身，并从图中排除本评测页及其关联边**，得到正式页集合 $P_A, P_B$，避免评测页的回链污染候选集合。$R_A, R_B$ 是这些正式页 frontmatter `sources` 中的直接 `raw/` 路径与非代码区原始源 wikilink 的并集，不递归扩展原始源。黄金集取第 2 节表格；集合指标（含召回率 $R$、精确率 $P$ 与一跳正式页 UTF-8 字节体积代理）按此口径重算如下。

有效输入（各正式页的 Relations 与上述直接原始源集合，排除本页）规范化后的 SHA256 为 `d644e62fff8102efcbaf1ed3b9d2d00eddaf9ea858a446e6150680876f7bbbb8`。该指纹仅固定拓扑与直接原始源集合，不覆盖正文体积；新增 `size_input_sha256: 5d93018d315c79c7367ab5012e0081f8caa3e179c119a6d99f3ec469ec5e5dbf` 单独对正式页 UTF-8 字节数映射做指纹。正文或元数据变化后须重算体积及其指纹；两者均不代表模型问答评测通过。

| 题号 | $|P_A|$ / $|P_B|$ | 正式页重合度 $J(P_A, P_B)$ | 黄金正式页召回 $R(P_A)/R(P_B)$ | 黄金正式页精确率 $P(P_A)/P(P_B)$ | $|R_A|$ / $|R_B|$ | 黄金原始源召回 $R(R_A)/R(R_B)$ | 黄金原始源精确率 $P(R_A)/P(R_B)$ | 原始源重合度 $J(R_A, R_B)$ | 一跳正式页体积代理（Seed A / B KiB） | 结构诊断结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Q1** | 26 / 8 | 0.259 | 1.00 / 1.00 | 0.15 / 0.50 | 55 / 23 | 1.00 / 1.00 | 0.05 / 0.13 | 0.322 | 252.9 / 80.3 | 双入口一跳均 100% 覆盖黄金集；Seed B（状态子页）精确率显著高于高入度枢纽 Seed A（`0.50` vs `0.15`） |
| **Q2** | 14 / 8 | 0.571 | 1.00 / 1.00 | 0.36 / 0.62 | 21 / 5 | 1.00 / 1.00 | 0.10 / 0.40 | 0.238 | 127.2 / 68.7 | 消除 `index` 同名原始源碰撞后，双入口一跳均 100% 覆盖黄金集，且历史计划入口（Seed B）原始源精确率达 `0.40` |
| **Q3** | 32 / 7 | 0.182 | 1.00 / 1.00 | 0.16 / 0.71 | 68 / 20 | 1.00 / 1.00 | 0.04 / 0.15 | 0.275 | 300.6 / 63.0 | 统计功效页（Seed B）一跳黄金正式页精确率达 `0.71`（体积仅 `63.0 KiB`），而评估总框架（Seed A）因汇聚全库评估子页使候选池达 `300.6 KiB` |
| **Q4** | 29 / 12 | 0.171 | 1.00 / 1.00 | 0.21 / 0.50 | 63 / 48 | 1.00 / 1.00 | 0.05 / 0.06 | 0.291 | 295.1 / 134.7 | Python 工程清单页（Seed B）一跳正式页精确率（`0.50`）与体积代理（`134.7 KiB`）均优于形式化总原则枢纽页（Seed A） |
| **Q5** | 31 / 20 | 0.417 | 1.00 / 1.00 | 0.16 / 0.25 | 70 / 61 | 1.00 / 1.00 | 0.04 / 0.05 | 0.560 | 306.1 / 221.4 | 双入口均为高连接度编排核心页，一跳原始源重合度最高（`0.560`），但需靠 `locate` 二次筛选裁剪候选体积 |
| **Q6** | 8 / 28 | 0.200 | 1.00 / 1.00 | 0.50 / 0.14 | 23 / 66 | 1.00 / 1.00 | 0.13 / 0.05 | 0.254 | 77.9 / 291.8 | 静态上下文子页（Seed A，`77.9 KiB`）比类型化边界枢纽页（Seed B，`291.8 KiB`）具有更高的一跳信噪比（`P(P)=0.50`） |
| **Q7** | 18 / 9 | 0.286 | 1.00 / 1.00 | 0.22 / 0.44 | 34 / 13 | 1.00 / 1.00 | 0.09 / 0.23 | 0.306 | 168.8 / 76.4 | 经验固化主干页与两个子页形成完整三角互链；从子页（Seed B）进入可将一跳体积控制在 `76.4 KiB` |
| **Q8** | 4 / 9 | 0.444 | 1.00 / 1.00 | 1.00 / 0.44 | 10 / 33 | 1.00 / 1.00 | 0.30 / 0.09 | 0.303 | 41.9 / 101.5 | 文档解析页（Seed A）一跳 4 页恰好全为黄金正式页（`P(P)=1.00`，`41.9 KiB`），全表 Q1–Q8 双入口一跳黄金召回率均为 `1.00 / 1.00` |

### 复算命令

在本仓库根目录运行；只读，不写目录或评测产物。输出依次为题号、正式页数、正式页 Jaccard、黄金正式页召回、黄金正式页精确率、原始源数、黄金原始源召回、黄金原始源精确率、原始源 Jaccard 与一跳正式页体积代理（KiB）。未来图谱变动时应重算指纹和表格；历史提交可通过 Git 回放。

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
       if p.relative_to(root).parts[0] == 'raw' and p.stem != 'index'}
graph = {slug: set() for slug in pages}
evidence, sizes, inputs = {}, {}, {}
for slug, page in pages.items():
    raw_bytes = (root / page['path']).read_bytes()
    sizes[slug] = len(raw_bytes)
    text = raw_bytes.decode('utf-8')
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
size_encoded = json.dumps(sizes, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
print('size_input_sha256', hashlib.sha256(size_encoded.encode()).hexdigest())

def jaccard(a, b):
    return f'{len(a & b) / len(a | b):.3f}' if a | b else 'N/A'

def recall(a, gold):
    return f'{len(a & gold) / len(gold):.2f}' if gold else 'N/A'

def precision(a, gold):
    return f'{len(a & gold) / len(a):.2f}' if a else 'N/A'

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
    kib_a = sum(sizes[s] for s in A) / 1024.0
    kib_b = sum(sizes[s] for s in B) / 1024.0
    print('Q' + match[1], f'{len(A)}/{len(B)}', jaccard(A, B),
          f'{recall(A, gold)}/{recall(B, gold)}',
          f'{precision(A, gold)}/{precision(B, gold)}',
          f'{len(RA)}/{len(RB)}',
          f'{recall(RA, goldraw)}/{recall(RB, goldraw)}',
          f'{precision(RA, goldraw)}/{precision(RB, goldraw)}',
          jaccard(RA, RB), f'{kib_a:.1f}/{kib_b:.1f}')
PY
```

## 4. 黄金断言与章节级证据映射表（Q1–Q8 Claim-to-Section Grounding Map）

为支持后续离线或端到端模型问答评测按章节核对引用正确性（Citation Precision / Recall）与 Answer Faithfulness，下表将 Q1–Q8 的核心跨源综合断言固定映射到黄金正式页的具体章节与底层 `raw/` 证据锚点（固定证据包重复问答见第 5 节；自由检索端到端评测仍为 **NOT_RUN**）：

| 题号 | 跨源核心综合断言（Target Synthesis Claim） | 黄金正式页章节锚点（Formal Section Anchors） | 底层原始证据锚点（Primary Raw Evidence Anchors） |
| --- | --- | --- | --- |
| **Q1** | 上下文工程应优先隔离静态契约与动态观察：长程程序性状态通过确定性校验的 `SKILL.state` 投影维护，工具大输出与历史膨胀分别用转储与有界专用模型加工处理，并保留原始证据回读路径 | [agent-context-engineering](/concepts/agent-context-engineering) `## Context rot and JIT defense`；[agent-context-history-state-and-bounded-processing](/concepts/agent-context-history-state-and-bounded-processing) `### SKILL.state：状态成为执行真相源，而不是历史摘要`、`## 专用模型承担有界上下文加工`；[hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities) `## Improvement priorities when a gap is observed`；[hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) `## Boundary rule` | [arxiv-2608-26263-skill-state](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/papers/arxiv-2608-26263-skill-state.md), [langchain-scaledown-deep-agents-2026-10-13](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/langchain-scaledown-deep-agents-2026-10-13.md), [machinelearningmastery-effective-context-engineering-ai-agents-2026-04-28](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/machinelearningmastery-effective-context-engineering-ai-agents-2026-04-28.md) |
| **Q2** | 编译型知识库通过显式 `## Relations` 与段落级来源绑定支持 `locate` → `expand` 两步证据导航；现行规范已由 `supersedes` 替代旧改造计划，且必须区分静态图可达重合度与多次问答的段落引用一致性 | [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence) `### 在本 Wiki 中的可迁移映射`；[hermes-wiki-knowledge-freshness-improvement-plan](/queries/hermes-wiki-knowledge-freshness-improvement-plan) `## Decision`；[hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture) `## Architecture at a glance`；[hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards) `## Wikilinks and relations`；[hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) `## What belongs in wiki` | [langchain-agent-memory-openwiki-graphs-2026-10-28](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/langchain-agent-memory-openwiki-graphs-2026-10-28.md), [langchain-self-correcting-memory-openwiki-2026-08-26](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/langchain-self-correcting-memory-openwiki-2026-08-26.md) |
| **Q3** | 生产级 Agent 评估须分层覆盖检索、生成、行为与成本/延迟分位数基线；少样本对照须识别同一题目重复采样的伪重复与方差结构，并用带理由的专家反馈校准开放式 Rubric | [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework) `## Evaluation layers`；[repeated-measures-statistical-power-for-ai-evaluation](/concepts/repeated-measures-statistical-power-for-ai-evaluation) `## 核心问题：更多数据点是否真的增加证据`；[agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration) `## Turn expert review into reusable evaluation data`；[production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines) `## Latency and cost baseline`；[agent-self-validation-loops](/concepts/agent-self-validation-loops) `## Core pattern` | [towardsdatascience-statistical-power-more-problems-2026-08-04](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/towardsdatascience-statistical-power-more-problems-2026-08-04.md), [langchain-similarweb-long-form-agent-report-evaluation-2026-07-29](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/langchain-similarweb-long-form-agent-report-evaluation-2026-07-29.md), [kdnuggets-llm-latency-inference-cost-2026-07-18](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/kdnuggets-llm-latency-inference-cost-2026-07-18.md) |
| **Q4** | AI 编程不能用自然语言生成替代形式化规约：编码前先收敛可验证契约与类型边界，Python 实现遵守流式/资源/并发与测量驱动优化清单，审查阶段按风险分级收敛并验证测试断言 | [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles) `## Principle 2.6: specification is an agreement, not an eight-field ritual`；[hermes-python-engineering-capability-checklist](/concepts/hermes-python-engineering-capability-checklist) `## Durable units from the article`；[ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence) `## 3. 分层防线、风险分级审批与审查收敛：以回滚率约束人类注意力`；[dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization) `## Core thesis`；[typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) `## Core pattern`；[agent-self-validation-loops](/concepts/agent-self-validation-loops) `## Core pattern` | [claude-dev-solving-code-review-at-anthropic-2026-10-15](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/claude-dev-solving-code-review-at-anthropic-2026-10-15.md), [aymannadeem-plan-mode-is-dead-2026-09-24](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/aymannadeem-plan-mode-is-dead-2026-09-24.md), [realpython-python-performance-optimization-guide-2026-10-21](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/realpython-python-performance-optimization-guide-2026-10-21.md) |
| **Q5** | 子代理编排应先验证单 Agent 基线与任务可分解性，按协调成本和错误相关性选择最小拓扑；主代理保留目标与证据门裁决，子任务通过有界上下文交接并结合任务上下文做资源/模型路由 | [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns) `## Single-agent first escalation rule`；[agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs) `### Additive value must beat coordination cost`；[agent-resource-optimization](/concepts/agent-resource-optimization) `## 任务上下文驱动的模型分层：Open SWE 案例`；[agent-research-evidence-gate](/concepts/agent-research-evidence-gate) `## Gate contract`；[hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules) `### 7. Subagent` | [philschmid-subagent-patterns-2026-05-05](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/philschmid-subagent-patterns-2026-05-05.md), [alphasignal-agent-orchestration-patterns-2026-05-05](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/alphasignal-agent-orchestration-patterns-2026-05-05.md), [langchain-model-router-in-harness-2026-10-01](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/langchain-model-router-in-harness-2026-10-01.md) |
| **Q6** | 工具表面应保持窄接口与强类型契约：区分资源发现、工具可用性、候选集缩减与逐步选择，避免因暴露过多同名或宽泛工具导致选择准确率下降，并以行为示例引导调用 | [agent-context-prompt-tools-and-examples](/concepts/agent-context-prompt-tools-and-examples) `## Tools: narrow action surface with negative boundaries`；[typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) `### 3. Tool functions define a narrow action surface`；[ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture) `## Four distinct decisions`；[agent-context-engineering](/concepts/agent-context-engineering) `## Summary` | [microsoft-developer-ai-coding-agents-use-technology-2026-05-27](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/microsoft-developer-ai-coding-agents-use-technology-2026-05-27.md), [machinelearningmastery-tool-selection-ai-agents-2026-07-06](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/machinelearningmastery-tool-selection-ai-agents-2026-07-06.md), [langchain-paid-media-agent-2026-09-13](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/langchain-paid-media-agent-2026-09-13.md) |
| **Q7** | 经验固化闭环必须区分不可变执行轨迹、可回滚的候选 Skill 状态机与持久编译知识：新经验经整合/加权/拒绝后按层职责路由，且指导 Target 的任务技能与指导 Builder 的元技能须分别评估 | [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) `## Core pattern`；[agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state) `## Separate persistent knowledge from reversible Skill state`；[agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills) `## Evolve knowledge instead of only appending experience`、`## Distinguish task skills from support-design meta-skills`；[hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries) `## Boundary rule` | [arxiv-2608-27454-wikiskill](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/papers/arxiv-2608-27454-wikiskill.md), [microsoft-research-evolib-evolving-knowledge-2026-07-30](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/microsoft-research-evolib-evolving-knowledge-2026-07-30.md), [xudong-han-self-evolving-agent-alloomi-2026-08-13](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/xudong-han-self-evolving-agent-alloomi-2026-08-13.md) |
| **Q8** | 文档处理与分析应将结构保真解析、概率性语义判断与确定性计算分层：Markdown/HTML/JSON 各司其职，多轮处理核对表头/单位/脚注防失真，不把 LLM 分类标签当作已验证的确定性事实 | [document-parsing-structural-fidelity](/concepts/document-parsing-structural-fidelity) `## 格式按职责分工`；[ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk) `## Reusable pattern`；[deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary) `## 自由文本的有界语义分类：概率性加工，确定性聚合`；[typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) `### 1.1 Stage scope selection before nested extraction` | [llamaindex-markdown-is-all-you-need-2026-10-08](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/llamaindex-markdown-is-all-you-need-2026-10-08.md), [venturebeat-frontier-ai-document-fidelity-risk-2026-05-13](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/venturebeat-frontier-ai-document-fidelity-risk-2026-05-13.md), [motherduck-jev-for-analytics-2026-09-29](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/motherduck-jev-for-analytics-2026-09-29.md) |

## 5. 固定证据包真实问答基线（2026-11-06）

### 方法与复现入口

固定用例在 `_meta/retrieval-benchmark.json`，脚本在 `_meta/scripts/wiki_retrieval_benchmark.py`，操作命令见 `wiki-health-check-runbook` 的 Bounded retrieval benchmark。问题与候选黄金集在策略运行前固定，未依据结果调整。黄金集沿用第 2 节，尚未经独立人工裁决；黄金集外页面也可能提供有效证据。2026-11-09 仅为 Q5/Q8 追加事后 `claim_checks`，按断言补可接受来源与章节定位；历史问题、`gold_pages`、`gold_raw` 和指标分母均不变。这些检查项不参与检索，不提供给盲答任务，不构成新的模型实验（见第 6 节）。

三策略统一限制为每题最多 4 个正式候选页、9,000 UTF-8 evidence bytes。关键词策略按全文词项匹配，catalog 策略按标题、摘要、别名和标签匹配；中文使用双字切分，按语料词项稀有度加权。关系策略从 catalog 前 2 个候选展开一跳 `depends_on` / `refines` / `conflicts_with` 出边及 `supersedes` / `conflicts_with` 入边，再按全文匹配取前 4 页，默认不展开 `related`。这里比较的是完整检索配方：关系组同时改变候选池与正文重排，catalog 组只按 metadata 排序，因此存在混杂变量，不能把差异单独归因于关系边。若要判断关系展开的独立收益，需另做同一评分函数与预算下的消融对照。这个实验性候选裁剪不保证保留所有冲突/替代边，不是完整 Freshness Gate，不能直接用于操作授权或当前事实判断。

每页最多取 2 个 12 行证据窗口，再从候选页声明的 raw 来源取最多 3 个窗口，统一按相关性排序并按完整窗口装入字节预算；不在窗口中途截断。证据 ID 使用路径及行范围，由输入哈希约束，行号不作为跨版本永久标识。正文候选召回与实际送入模型的证据覆盖是不同指标。

每策略由两个隔离回答任务分别作答，每个任务仅收到题目与其证据包，不看黄金集、检索指标或另一回答；总计 48 个实际答案。执行工具为当前 Codex 协作 Agent，底层模型版本、采样参数及 API token/cost 未暴露，不能据此建立跨模型或成本优势结论。回答须逐结论引用证据，缺证据明确留白。完整输入包、实际回答和评分保存在外部归档；公开仓库另保留脱敏的 Q5/Q8 子集（第 6 节），不含运行对话。同一代码与固定输入包可复算指标，当前工作树重新检索的输入哈希可能不同。

### 历史首轮指标（依赖外部运行包）

下表均为 8 题宏平均；候选精确率/召回率针对候选黄金正式页，引用 Jaccard 比较同一题两个回答实际使用的证据 ID 集合。48 个回答的引用 ID 均通过包内存在性检查，**不代表每条引用都支持结论**。

| 策略 | 正式候选精确率 | 正式候选召回率 | 实际送入证据的黄金 raw 召回率 | 平均证据字节 | 固定包两次引用 Jaccard |
|---|---:|---:|---:|---:|---:|
| 全文关键词 | 0.500 | 0.448 | 0.083 | 8,469 | 0.896 |
| catalog metadata | 0.562 | 0.510 | 0.125 | 8,765 | 0.721 |
| catalog + 有界类型关系 | 0.656 | 0.588 | 0.083 | 8,659 | 0.835 |

两次引用皆空时按 N/A 处理，本轮为空的题对数为 0。历史运行级来源指纹（全体正式语料与各题读取 raw 来源的并集；不是单题、问题文本或完整协议的指纹，不同策略读取的来源可能不同）：关键词 `b6384d879a7899c5b7bd1dd6a6e5f6aa12e16b97a36b39af2a9c41ec107857a3`；catalog `d607d5c1c14378edb16de01c350498425e2a9dd3cd8565ab8c8ea14b386f0b45`；关系 `25ffad7a7442bdb7dd3fe470cce98f2ef2e65715cb3eac56f9be6e331849d06e`。

**复算前提：** 上表和上述指纹对应治理编辑前留存的运行包，不能仅凭当前 Git 检出重新生成。外部归档文件名为 `wiki-retrieval-baseline-2026-11-06.tar.gz`，SHA-256 为 `a89aea51f7f8b73535eea0e26b9c497e1bd632d1a82f27e0d63c6785821dca60`；归档包含原始证据包、48 个回答、评分与当时的校验脚本，可据此重算固定包引用指标。归档不包含全部检索语料，不能重放原始检索过程；没有该归档的读者可复核第 6 节公开的 Q5/Q8 子集，不能据此独立复算全体 8 题宏平均。当前脚本重检索得到新指纹属于新运行，不得用它覆盖旧回答的指纹或冒充旧回答已重新执行。公开仓库不保存运行对话；归档持有者负责留存，Git 历史不能替代完整运行包。

每个 8 题回答任务墙钟约 38–47 秒（包括工具与调度开销）；不是单题 API latency，不以此比较策略效率。字节数只包含序列化证据记录，不包括题目、提示词与输出，也不等于模型 token。每题仅两次回答，未估计统计显著性。

### 独立 AI 支持性与覆盖评分（历史原评分，纠正见第 6 节）

另一个未参与回答的审查 Agent 逐条对照 48 个回答及各自证据包，按 0–2 分评估：支持性 0 为重要断言无支撑或矛盾、1 为轻微推断/过宽表述、2 为实质断言有对应证据或明确留白；覆盖 0 为未回答主旨、1 为缺至少一项关键部分、2 为覆盖题目各关键部分。评分尺在审查前固定，未使用候选黄金集重合度替代回答评分。

| 策略 | 支持性均分 / 2 | 问题覆盖均分 / 2 |
|---|---:|---:|
| 全文关键词 | 1.875 | 1.500 |
| catalog metadata | 2.000 | 1.500 |
| catalog + 有界类型关系 | 2.000 | 1.563 |

共 23 个回答至少一个维度未满分。主要缺口为各策略 Q3 的成本基线口径、Q4 的 Python 工程验证；部分 Q2/Q5/Q6/Q8 缺少问题要求的具体机制。关键词重复回答 Q3 将“一次分数”与“缺少成本/轨迹维度”混为一谈，Q4 将需保留验证的例子收窄成必要条件，因此支持性各扣 1 分。诚实留白降低覆盖分，不等于编造。

一次局部评分纠正：含明确结论的导航摘要可以支撑其写出的结论，不能按纯标题/关系列表判成无证据。这说明评分仍需回读原文；本表是 AI 对包内证据的支持性与完整性判断，**不是外部事实准确率或人类黄金答案**。黄金集独立人工复核、真实任务代表性和跨模型稳定性仍未验证。

### 采用边界与失败案例

- 混合的关系展开加正文重排配方本轮提高了候选黄金页召回，但没有改善黄金 raw 证据召回，也没有超过关键词策略的固定包引用一致性。三个指标不能互相替代，暂不更改默认检索策略。
- catalog 的 Q1/Q2 候选混入投资页，Q4 缺少 Python 工程验证页；问题词项与摘要之间的词面相似会产生误召回。关键词 Q5 未召回候选黄金正式页，但部分其他页仍能支撑有限回答，不能机械将黄金集外引用判为错误。
- 回答 Q3/Q4/Q6 出现具体职责或测量口径留白：候选页命中不代表必要段落已经送入。下一次改动应首先针对失败问题的词项匹配和完整证据窗口，使用新保留题验证，避免只调到这 8 题通过。
- 本轮固定证据包 Jaccard 是模型回答层的诊断值，不能外推为自由检索稳定性、事实正确率或生产收益；完整多跳 Agent 端到端评测仍为 **NOT_RUN**。保留现有 Freshness Gate 与逐段核证。

## 6. Q5/Q8 有界核验、评分纠正与补证路径（2026-11-09）

本节是复用历史包的 **AI 来源与断言抽查**，不是独立人工裁决，也不是重新回答实验。结论：Q8 的 catalog/relations 包为确定性执行职责提供了更直接的证据；Q5 未显示 relations 的稳定优势。保留现有默认策略，自由检索端到端仍为 **NOT_RUN**。

### 公开最小证据附件

[Q5/Q8 历史证据与回答 JSON](../_meta/retrieval-benchmark-q5-q8.json) 保存 3 策略 × 2 题的原始片段、候选页、来源指纹与 12 个回答、12 条历史评分；另列两条评分纠正。所复制的证据、回答、原评分未改写。附件只保留公开知识片段和实验结果，不含执行日志、凭据或私有身份标识。

附件内每个 `input_sha256` 仍是原始全轮来源并集指纹；`input_hashes` 只保留所选片段所属来源，不能由此重建原指纹或完整检索语料。片段及其 ID 以附件快照为准，不把同一行号当作当前页面的永久定位。维护测试可离线复核 12 个回答的引用 ID、证据预算、重复引用 Jaccard、纠正对应关系和章节存在性，不调用模型：

```bash
python3 -m unittest discover -s _meta/scripts -p 'test_wiki_retrieval_benchmark.py' -v
```

### 分开记录覆盖、引用与事实

| 题目 | keyword：正式页 / 实际入包黄金 raw | catalog：正式页 / 实际入包黄金 raw | relations：正式页 / 实际入包黄金 raw |
|---|---|---|---|
| Q5 | 0/5、0/3 | 1/5、0/3 | 0/5、0/3 |
| Q8 | 2/4、0/3 | 3/4、1/3 | 3/4、1/3 |

这里是历史黄金集合交集，不是相关性或正确率的完整真值。Q5 keyword 的黄金页命中虽为零，`production-ai-agent-evaluation-framework.md:L63-L74` 和 `agent-production-harness-and-cloud-runtime-boundaries.md:L27-L38` 等包内片段仍支持单 Agent 基线、协调成本、父级责任等有限断言。黄金页命中也不证明必要段落已经入包。

12 个回答的引用 ID 均存在于各自证据包；这是身份校验。回读引用可以判断其是否支持具体断言，但不能由 ID 有效或两次 Jaccard 高推出外部事实正确。抽查原站只覆盖本节列出的主张，不形成全体答案事实准确率。

### Q5：纠正覆盖满分，补齐证据门与资源路由定位

- **历史覆盖分纠正：** keyword 的 `first`、`repeat` 两个 Q5 回答均由覆盖 **2 改为 1**，支持性仍为 2。回答虽有基线、协调成本及宿主/Worker 边界，却没有说明任务上下文驱动的模型/资源选择机制，也没有研究证据充分性裁决。**Tool Gate 的执行授权不等于研究证据门。** 纠正另记在附件 `review.coverage_corrections`，不覆盖历史评分，不据局部纠正发布新的全库排行榜。
- **可接受替代证据：** 历史黄金 raw 漏列的 [nature-capable-language-models-can-outgrow-the-benefits-of-collaboration-2026](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/nature-capable-language-models-can-outgrow-the-benefits-of-collaboration-2026.md) 可支持协作适用条件；[machinelearningmastery-multi-agent-research-assistant-2026-05-21](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/machinelearningmastery-multi-agent-research-assistant-2026-05-21.md) 是研究证据门的直接来源。它们记录在 `claim_checks`，不反向修改历史召回分母。
- **来源与本地推论分开：** 教程第二次 Judge 仍弱时补抓来源后直接写报告，没有最后一次通过判定。[agent-research-evidence-gate](/concepts/agent-research-evidence-gate) 的补证后复判、仍不足则停止是本地加固建议，不冒充教程已经验证的能力。[langchain-model-router-in-harness-2026-10-01](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/langchain-model-router-in-harness-2026-10-01.md) 的 64% 是案例相对最强模型基线的会话 LLM 中位成本下降；合并率差异不显著不证明质量等价，不能外推跨项目收益。

### Q8：已有证据漏用与概率性标签仍须分开核对

- catalog/relations 包含 `deterministic-analytics-llm-reasoning-boundary.md:L39-L50`，回答说明确定性执行器的过滤、聚合、计算和显式失败，构成有限的回答覆盖改善。
- keyword 包其实已有 `ai-agent-document-fidelity-risk.md:L99-L110` 的职责导航摘要，但两个回答未使用其执行职责。该缺口含生成阶段漏用，不能全部归因为检索不到。应先核对已给证据，而不是先增加图展开。
- Q8 第 4 节目标还包含概率性语义分类。历史回答最多说明数值归属或输入标签可能出错，没有完整说明置信度分流、抽样核验与标签追溯；包中也未送入 MotherDuck 分类段落。**保留历史问题覆盖评分，但不将其满分解释为完整综合断言已通过。** [motherduck-jev-for-analytics-2026-09-29](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/motherduck-jev-for-analytics-2026-09-29.md) 的 96.9% 是筛选子集的模型一致率，不是全量人工验证准确率。确定性执行器的直接来源也可回读 [towardsdatascience-hybrid-ai-deterministic-analytics-2026-05-22](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/towardsdatascience-hybrid-ai-deterministic-analytics-2026-05-22.md)。
- [llamaindex-markdown-is-all-you-need-2026-10-08](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/llamaindex-markdown-is-all-you-need-2026-10-08.md) 支持按职责保留格式、表格关系和溯源；[venturebeat-frontier-ai-document-fidelity-risk-2026-05-13](https://github.com/on195594/wiki/blob/c2d401e29ec9e2ad4ce847cedcd09cf34964d3c7/raw/articles/venturebeat-frontier-ai-document-fidelity-risk-2026-05-13.md) 所述多轮编辑失真不能代替 PDF 解析器或真实财报准确率测试。当前结果不证明跨财报年份、单位、币种和口径已正确绑定。

### 有界补证，而不是给历史实验加答案

`_meta/retrieval-benchmark.json` 的 Q5/Q8 `claim_checks` 按断言给出当前正式页章节、可接受 raw 和解释边界。它们是复核/非盲补证清单，不是检索种子、强制黄金命中或答题提示；不注入 `prepare()`，不改 4 页/9,000 字节默认预算，不在历史包内补片段，不改写旧回答。

- Q5 缺资源机制时定点回读 [agent-resource-optimization](/concepts/agent-resource-optimization) 的模型分层章节；缺研究证据门时回读 [agent-research-evidence-gate](/concepts/agent-research-evidence-gate) 的 `## Gate contract`，并确认原教程与本地加固边界。
- Q8 先检查包中已有执行职责是否被回答使用；仍缺语义可靠性时回读 [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary) 的概率性分类章节及 MotherDuck 原始段落，再对实际表格逐值核对。必要信息仍缺则明确留白。
- 任何后续补证回答均须作为新结果单独保存，不计入 2026-11-06 的 48 个回答。无需新增平台、调度器、常驻审查或付费模型运行。

## Relations

- refines: [hermes-knowledge-freshness-and-claim-evidence](/concepts/hermes-knowledge-freshness-and-claim-evidence), [production-agent-evaluation-baselines](/concepts/production-agent-evaluation-baselines)
- depends_on: [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path), [production-ai-agent-evaluation-framework](/concepts/production-ai-agent-evaluation-framework)
- related: [agent-context-engineering](/concepts/agent-context-engineering), [agent-context-history-state-and-bounded-processing](/concepts/agent-context-history-state-and-bounded-processing), [hermes-context-engineering-design-priorities](/concepts/hermes-context-engineering-design-priorities), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [hermes-wiki-knowledge-freshness-improvement-plan](/queries/hermes-wiki-knowledge-freshness-improvement-plan), [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [hermes-wiki-page-writing-standards](/concepts/hermes-wiki-page-writing-standards), [repeated-measures-statistical-power-for-ai-evaluation](/concepts/repeated-measures-statistical-power-for-ai-evaluation), [agent-evaluation-rubric-calibration](/concepts/agent-evaluation-rubric-calibration), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [hermes-ai-workflow-formalization-principles](/concepts/hermes-ai-workflow-formalization-principles), [hermes-python-engineering-capability-checklist](/concepts/hermes-python-engineering-capability-checklist), [ai-code-review-governance-and-convergence](/concepts/ai-code-review-governance-and-convergence), [dijkstra-ai-programming-formalization](/concepts/dijkstra-ai-programming-formalization), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns), [agent-orchestration-production-tradeoffs](/concepts/agent-orchestration-production-tradeoffs), [agent-resource-optimization](/concepts/agent-resource-optimization), [agent-research-evidence-gate](/concepts/agent-research-evidence-gate), [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [agent-context-prompt-tools-and-examples](/concepts/agent-context-prompt-tools-and-examples), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture), [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops), [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state), [agent-knowledge-evolution-and-meta-skills](/concepts/agent-knowledge-evolution-and-meta-skills), [document-parsing-structural-fidelity](/concepts/document-parsing-structural-fidelity), [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk), [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary)

