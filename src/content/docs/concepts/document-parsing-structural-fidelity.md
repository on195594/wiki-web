---
title: 文档解析的结构保真与中间表示
created: 2026-10-09
updated: 2026-10-09
type: concept
tags:
  - llm
  - architecture
  - content-engineering
  - verification
  - structured-output
sources:
  - raw/articles/llamaindex-markdown-is-all-you-need-2026-10-08.md
status: stable
description: 解释文档解析中内容与关系的保真边界，以及 Markdown、HTML、JSON、图片和版面元数据的职责分工。
aliases:
  - document-parsing-structural-fidelity
  - 文档结构保真
  - 文档中间表示
volatility: low
---

# 文档解析的结构保真与中间表示

## Summary

文档解析的可靠性不只取决于文字和数值是否提取正确，还取决于它们是否保留正确的章节、表头、单位、脚注及空间关系。**可读、可复用的中间表示有助于检查这些关系，但格式本身不保证语义正确。**

本页基于 LlamaIndex 的 `llamaindex-markdown-is-all-you-need-2026-10-08`，适用于 PDF 入库、文档搜索、RAG 和字段抽取的表示选择与质量检查。Markdown 可作为正文的实用起点，复杂表格可补充 HTML，应用字段可用 JSON，视觉信息及溯源需求则按需保留图片、页码与坐标；这不是产品选型或统一格式的强制要求。

## 失败机制：内容留下了，关系丢失了

原文以两年度营收与利润率、按区域分组的表格为例：所有字词和数字都能保留，但普通 Markdown 管道表格无法原样表达跨行跨列。年份与两个指标之间的从属关系不再显式，第二层表头可能变成普通数据行，区域标签也可能只剩一个需要猜测的空行。

下游模型因此可能读对数值却归错年份、指标或区域。格式整齐、JSON 可解析或最终回答流畅，都不能替代对原始关系的核对。

这里的表格是说明性例子，不是准确率评测。该失败机制发生在“原始文档 → 解析表示”阶段，与 [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk) 所讲的多轮编辑失真是相邻但不同的风险。

## 格式按职责分工

- **Markdown：正文与简单结构。** 标题层级、段落、嵌套列表、简单表格和链接易于阅读与检查。标题可用于分块边界，并随切片保留章节上下文。相对复杂对象包装可能减少格式开销，但节省幅度取决于文档和对照表示。
- **展平表格：能可靠归一化的简单情况。** 例如把多层表头展成“FY2026 Revenue”，另设 Region 列；只有能明确保留原始关联时，展平才有意义。
- **HTML：复杂表格的结构补充。** 在 Markdown 中使用 `colspan`、`rowspan`、`<thead>` 保留合并单元格和多层表头。它提供表达关系的能力，不替解析器证明关系正确。
- **JSON：应用字段和元素元数据。** 适合返回有明确 Schema 的抽取记录，或保存文档元素及其属性。它与可读中间文本互补；类型正确不等于字段含义、单位或来源绑定正确。
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

## 证据与采用边界

- 来源为 Murtaza Khomusi 于 2026-10-08 发布的 LlamaIndex 厂商文章。保存的是根据完整可读正文制作的选取式来源笔记，不是全文镜像；未独立测试解析器，也未核验正文链接中的其他产品文档。
- 文章足以支持格式能力、失败机制与检查思路，不足以证明 LlamaParse 优于其他工具、Markdown 对所有任务最佳，或中间层一定降低端到端成本。
- HTML、JSON 和包围盒都不能单独保证解析或语义正确；纯 Markdown 也不能完整替代复杂表格及视觉信息。
- 本页不规定默认解析器、性能阈值或生产门禁，不授权改动 Skill、运行配置或现有解析流程。

## Relations

- related: [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk), [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary)

## Related

- `llamaindex-markdown-is-all-you-need-2026-10-08` — 原文出处、保存范围和保留的参考链接。
- [ai-agent-document-fidelity-risk](/concepts/ai-agent-document-fidelity-risk) — 多轮编辑与委托式文档处理的内容失真风险。
- [deterministic-analytics-llm-reasoning-boundary](/concepts/deterministic-analytics-llm-reasoning-boundary) — 输入质量、概率性语义判断与可复现计算的区别。
- [index](/)

