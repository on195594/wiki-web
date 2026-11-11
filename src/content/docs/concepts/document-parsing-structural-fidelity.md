---
title: 文档解析的结构保真与中间表示
created: 2026-10-09
updated: 2026-11-09
type: concept
tags:
  - llm
  - architecture
  - content-engineering
  - verification
  - structured-output
sources:
  - raw/articles/llamaindex-markdown-is-all-you-need-2026-10-08.md
  - docs:https://www.llamaindex.ai/blog/introducing-the-document-parsing-protocol
  - docs:https://www.parseprotocol.com/
status: stable
description: 解释文档解析中内容与关系的保真边界、Markdown/HTML/JSON/视觉坐标的职责分工，以及 DPP 0.1 工作草案的 140 条裁决约定。
aliases:
  - document-parsing-fidelity
  - document-intermediate-representation
  - 文档结构保真
  - 文档中间表示
volatility: low
---

# 文档解析的结构保真与中间表示

## Summary

文档解析的可靠性不只取决于文字和数值是否提取正确，还取决于它们是否保留正确的章节、表头、单位、脚注及空间关系。**可读、可复用的中间表示有助于检查这些关系，但格式本身不保证语义正确。**

本页基于 LlamaIndex 的 [llamaindex-markdown-is-all-you-need-2026-10-08](https://github.com/on195594/wiki/blob/de3629683a9a95dfdb0601b614fcee7d7812aa4a/raw/articles/llamaindex-markdown-is-all-you-need-2026-10-08.md) 和 [Document Parsing Protocol（DPP）介绍](https://www.llamaindex.ai/blog/introducing-the-document-parsing-protocol)，适用于 PDF 入库、文档搜索、RAG 和字段抽取的表示选择与质量检查。Markdown 可作为正文的实用起点，复杂表格可补充 HTML，应用字段可用 JSON，视觉信息及溯源需求则按需保留图片、页码与坐标；这不是产品选型或统一格式的强制要求。

## 失败机制：内容留下了，关系丢失了

原文以两年度营收与利润率、按区域分组的表格为例：所有字词和数字都能保留，但普通 Markdown 管道表格无法原样表达跨行跨列。年份与两个指标之间的从属关系不再显式，第二层表头可能变成普通数据行，区域标签也可能只剩一个需要猜测的空行。

下游模型因此可能读对数值却归错年份、指标或区域。格式整齐、JSON 可解析或最终回答流畅，都不能替代对原始关系的核对。

这里的表格是说明性例子，不是准确率评测。该失败机制发生在“原始文档 → 解析表示”阶段，与 [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk) 所讲的多轮编辑失真是相邻但不同的风险。

## 格式按职责分工

- **Markdown：正文与简单结构。** 标题层级、段落、嵌套列表、简单表格和链接易于阅读与检查。标题可用于分块边界，并随切片保留章节上下文。相对复杂对象包装可能减少格式开销，但节省幅度取决于文档和对照表示。
- **展平表格：能可靠归一化的简单情况。** 例如把多层表头展成“FY2026 Revenue”，另设 Region 列；只有能明确保留原始关联时，展平才有意义。
- **HTML：复杂表格的结构补充。** 在 Markdown 中使用 `colspan`、`rowspan`、`<thead>` 保留合并单元格和多层表头。它提供表达关系的能力，不替解析器证明关系正确。
- **JSON：应用字段和元素元数据。** 适合返回有明确 Schema 的抽取记录，或保存文档元素及其属性。它与可读中间文本互补；类型正确不等于字段含义、单位或来源绑定正确（结构与语义边界见 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)）。
- **图片、页码与包围盒：视觉及溯源信息。** 图表可以结合数值和描述；空间关系图可能仍需原图。页码和坐标可关联解析元素，供引用、高亮及视觉对齐使用，不能把所有视觉信息默认压成文字。

## 何时需要独立中间层

原文支持的主要适用条件是：多个下游问题或抽取 Schema 共享同一份文档内容，并且需要可读的解析结果来检查或定位错误。这样可以复用表示，而不是为每个任务重新处理来源。

直接从文档抽取字段也可以奏效。单一、边界明确的任务不因这篇文章就必须增加 Markdown 转换步骤；中间层不是越多越可靠，也不能代替抽取结果的验证。

与 [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary) 的衔接是：本页关注计算之前的输入结构是否正确；该页关注语义判断与确定性计算的职责。确定性程序可以稳定地计算被错配的数据，却无法仅凭计算可复现证明输入关系正确。

## 最小质量检查

原文建议从熟悉的文档开始，检查每个数值的表头、单位和脚注，而不是只看输出整齐程度。可围绕以下关系阅读解析结果：

1. **章节与顺序**：标题层级、列表嵌套和内容归属是否保留；分块后是否仍带有必要的章节上下文。
2. **表格与数值**：合并表头、行列分组及展平字段是否对应原文；单位和脚注是否仍绑定正确数值。
3. **视觉与来源**：任务需要的图像信息是否被文字转换遗漏；需要引用或高亮时，页码与坐标是否关联相应内容。

**[推论]** 排查错误时，可先比较原始页面与解析中间态，再检查检索片段和最终答案，以避免用生成层的措辞修补上游结构丢失。将熟悉文档中的典型复杂表格保留为回归样例也是可选工程做法，文章未验证其效果或给出统一门槛。

## 解析裁决与评估参考：DPP

LlamaIndex 于 2026-10-28 发布的 [Document Parsing Protocol（DPP）介绍博客](https://www.llamaindex.ai/blog/introducing-the-document-parsing-protocol)（Gauthami Polasani、Pierre-Loic Doulcet）及 [DPP 0.1 规范站点](https://www.parseprotocol.com/)（2026-11-09 在线复核，共 13 章、140 条规则与 145 条说明笔记，源码 MIT 许可、协议与示例 CC BY 4.0，源摘要 `b63884001dbc`）将“页面应如何表示”写成可公开讨论的裁决规则（涵盖文档级约定、版面、标题、正文、列表、表格、表单、图表、图像与流程图等），可作为构造解析检查样例的参考，而不只是统计 OCR 字符是否正确：

- **关系正确**：多层表头、跨列归属、行层级及数值要对应原页面。DPP 博客的同店销售表例子中，年份与季度属于不同表头层级（2023 含 Q1–Q4 与 FY 五列，2024 含 Q1–Q3 三列）；将季度推入正文、丢弃年份或自行拼接原文未印刷的“2024 Q2”标签，在 DPP 下均判为错误。DPP 使用 HTML `<table>` 的 `colspan` 与行缩进 `data-level` 属性保留原印刷层级。
- **忠实表示与下游归一化分开**：DPP 示例用 HTML 保留原印刷表头层级；本页前述展平可用于后续业务处理，但应明确它是转换，并核对字段与原始表头的映射，不能冒充原样转录。
- **表单、图表、流程图与不可读状态区分**：DPP 规定表单空字段标为 `[blank]`（区分“原本留空”与“解析漏提”），复选框保留为 `[x]` 与 `[ ]`；图表（Charts）转换为每类别一行、每序列一列的数值表并原样复制已印刷数值；流程图与架构图（Diagrams）须按 [§12.2.2](https://www.parseprotocol.com/guide/diagrams-diagrams-and-flowcharts) 选择能忠实编码的语言，以 `diagram/<language>` 围栏输出，并保留标签、连接方向、分组及有意义的空间特征；不能仅因 Mermaid 不适合就降级为文字。仅当没有合适语言能忠实编码时，才允许用完整标签恰为 `description` 的围栏，按规定结构描述所有可读文字与可见关系；PDF 中从未在页面显示的隐藏文本直接忽略，可见但无法辨认的文本标为 `[illegible]`。标记本身不能证明解析器没有遗漏其他内容。
- **允许文档级一致的等价形式（`doc` / `2 forms`）**：评估不必只做字符串完全匹配；DPP 将部分规则标为单文档内统一即可接受的等价形式（例如整份文档一致地使用或不使用 `<thead>`、`<tbody>`，或单位行与空白分隔行的两种合规编码），因为两种形式保留相同信息。其他格式差异是否等价，仍需按具体规则判断。
- **原页核对与 Sidecar 坐标溯源**：按需通过可选 sidecar 保留页面及元素包围盒坐标以便回溯；例如在 Apple FY2024 利润表样例中检查两处重复出现的 `6,485` 单元格是否均保留、会计负数括号 `(565)` 是否保留。图表中已印刷的数值须准确复制，不应将此扩展为对所有视觉估计值的精确性保证。

这些是协议提出的表示与审查约定，不是解析器性能测试结果。针对具体任务，可以选取熟悉文档中的复杂表格、空字段或图表作为样例，比较原页、解析结果与下游使用结果；这是本页的工程建议，不是该来源验证过的效果。

## 证据与采用边界

- 来源一为 Murtaza Khomusi 于 2026-10-08 发布的 LlamaIndex 厂商文章（[llamaindex-markdown-is-all-you-need-2026-10-08](https://github.com/on195594/wiki/blob/de3629683a9a95dfdb0601b614fcee7d7812aa4a/raw/articles/llamaindex-markdown-is-all-you-need-2026-10-08.md)，选取式来源笔记）；来源二、三为 2026-10-28 发布的 [DPP 介绍博客](https://www.llamaindex.ai/blog/introducing-the-document-parsing-protocol) 与 [DPP 0.1 官方网站](https://www.parseprotocol.com/)（2026-11-09 核对博客、站点规则目录与部分条文；并非逐条合规审计）。未独立测试解析器，也未核验正文链接中的其他商业产品（如 OCRia-1、Extract V2.6）。
- 文章足以支持格式能力、失败机制与检查思路，不足以证明 LlamaParse 优于其他工具、Markdown 对所有任务最佳，或中间层一定降低端到端成本。
- HTML、JSON 和包围盒都不能单独保证解析或语义正确；纯 Markdown 也不能完整替代复杂表格及视觉信息。
- DPP 是 LlamaIndex 提出的 0.1 工作草案，源自 ParseBench 的标注约定，“settled”仅代表在该草案内部定稿，并非已独立认证或证明行业普遍采用的标准。官网明确说明其下载包中的 checker 是审查指导 skill，不是自动化合规测试套件；没有证据表明采用 DPP 必然提高特定工作流的准确率。
- 本页不规定默认解析器、性能阈值或生产门禁，不授权改动 Skill、运行配置或现有解析流程。

## Relations

- depends_on: [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk), [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)

## Related
- [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk) — 多轮编辑与委托式文档处理的内容失真风险。
- [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary) — 输入质量、概率性语义判断与可复现计算的区别。

