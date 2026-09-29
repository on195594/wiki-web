---
title: Software Engineering Laws Decision Map
created: 2026-08-10
updated: 2026-08-10
type: query
tags:
  - research
  - architecture
  - decision
sources:
  - concepts/software-engineering-laws/software-engineering-laws-architecture.md
  - concepts/software-engineering-laws/software-engineering-laws-teams.md
  - concepts/software-engineering-laws/software-engineering-laws-planning.md
  - concepts/software-engineering-laws/software-engineering-laws-quality.md
  - concepts/software-engineering-laws/software-engineering-laws-scale.md
  - concepts/software-engineering-laws/software-engineering-laws-design.md
  - concepts/software-engineering-laws/software-engineering-laws-decisions.md
status: stable
description: 按真实工程问题检索软件工程法则、适用边界与评审问题的决策地图。
aliases:
  - software-engineering-laws-decision-map
---

# Software Engineering Laws Decision Map

## Summary

本页把七个类别中的 56 条软件工程法则组织为面向评审的检索入口，帮助从具体问题定位相关法则、检查问题与适用边界。所有法则都是评审启发式，不是自动裁决器；最终判断仍须依据当前需求、运行证据、故障模型和团队约束。

## 使用边界

- CAP 仅在网络分区发生时聚焦一致性与可用性的取舍，不能解释为系统在所有时刻只能保留三项属性中的两项。
- Postel's Law 对不可信输入不能解释成无条件宽容；容错必须具有确定、安全且一致的解释规则。
- Boy Scout Rule 只支持当前变更附近范围明确的小步改善，不授权无边界顺手重构。
- Linus's Law 不替代责任人、测试和验证；代码可见或参与者增多也不保证缺陷会被发现和修复。
- Price's Law、Dunbar's Number 与 Sturgeon's Law 中的数字不能成为人员、绩效或组织硬阈值。
- 含数字、绝对措辞或幽默表达的法则应按其机制与限制理解，不能直接转换为固定比例、估算系数或交付承诺。
- 所有法则都是评审启发式，不是自动裁决器；不得据此创建新的指标、评分、规则引擎或自动化。

## 快速决策入口

以下场景映射均为 `[综合]`，用于评审检索而非来源原文。

| 真实问题 | 推荐法则 | 为什么 | 检查问题 |
|---|---|---|---|
| API 或协议变更会不会破坏兼容性？ | `hyrums-law`、`principle-of-least-astonishment`、`postels-law` | 可观察行为可能形成隐性依赖，接口还需符合使用者预期；输入兼容不能越过安全边界。 | 哪些顺序、格式、时序、错误或旧缺陷可能已被依赖？输入偏差能否被安全且唯一地解释？ |
| 应该演化现有架构，还是整体重写？ | `galls-law`、`second-system-effect`、`sunk-cost-fallacy` | 简单可用核心支持增量演化，继任系统容易吸收未经验证的复杂性，但既有投入也不能成为继续旧方案的唯一理由。 | 能否先验证简单核心？重写范围是否来自已验证需求？忽略过去投入后哪条路径的未来收益更高？ |
| 分布式系统怎样设计故障与分区行为？ | `fallacies-of-distributed-computing`、`cap-theorem`、`murphys-law` | 远程交互存在延迟、丢失、安全和拓扑变化；网络分区时还须明确一致性与可用性的选择。 | 超时、重试、容量和安全边界是否明确？分区时哪些请求失败，哪些数据可能暂时陈旧？ |
| 排期为什么总在尾部失真？ | `hofstadters-law`、`ninety-ninety-rule`、`parkinsons-law` | 隐藏任务与收尾工作容易被低估，而过宽期限又可能被非必要工作填满。 | 是否估算了集成、边界情况、性能、修复与交付准备？期限是否清晰、现实并保留必要空间？ |
| 延期项目或大型团队是否应该继续增员？ | `brooks-law`、`ringelmann-effect`、`conways-law` | 新人上手和团队扩张会增加协调成本，沟通结构还可能固化为系统边界。 | 新增贡献何时超过培训与协调成本？能否先调整范围、时间、所有权或沟通路径？ |
| 团队扩大后怎样控制知识和协作风险？ | `bus-factor`、`dunbars-number`、`prices-law` | 规模扩大可能使职责关系模糊，知识与关键交付也可能集中于少数成员。 | 谁掌握不可替代的知识？成员是否知道该找谁？可见产出是否遗漏支持、文档、安全与可靠性工作？ |
| 指标或 KPI 是否正在扭曲行为？ | `gilbs-law`、`goodharts-law`、`pareto-principle` | 度量能提供反馈，但代理指标一旦成为目标就可能偏离真实结果；资源集中度也应由数据验证。 | 数字改善是否对应真实结果改善？是否结合上下文、多个信号与定性判断？ |
| 测试不足、测试失效或技术债如何处理？ | `testing-pyramid`、`pesticide-paradox`、`technical-debt`、`boy-scout-rule` | 测试需要兼顾反馈成本与真实协作，并随缺陷模式更新；债务可通过范围明确的小步改善偿还。 | 缺陷能否在较低成本层暴露？测试是否吸收生产反馈？本次可安全偿还哪一项局部债务？ |
| 功能范围和设计复杂度是否失控？ | `yagni`、`kiss-principle`、`zawinskis-law`、`teslers-law` | 未验证的扩展与功能蔓延会扩大维护成本，但固有复杂性只能被合理分配，不能假装消失。 | 删除扩展点后能否满足当前目标？新功能是否强化核心价值？复杂性由哪一层承担最合适？ |
| 性能优化或扩展投入会不会有效？ | `premature-optimization`、`amdahls-law`、`gustafsons-law` | 优化应由测量确认瓶颈；固定工作量受串行路径限制，可增长工作量则可能利用新增资源。 | 热点是否已被测量？串行路径在哪里？新增资源是在缩短固定任务，还是处理更多有效工作？ |
| 工程判断是否被信心、热度或既有投入带偏？ | `confirmation-bias`、`dunning-kruger-effect`、`hype-cycle-amaras-law`、`map-is-not-the-territory` | 初始信念、未经校准的信心、市场热度和抽象模型都可能遮蔽现实证据。 | 找过哪些反证？信心由什么验证支撑？运行现实是否与文档、模型或宣传相符？ |

## 完整 56 条入口

### Architecture

- lse-cap-theorem — `CAP Theorem` — 检查网络分区期间一致性与可用性的明确取舍。
- lse-fallacies-of-distributed-computing — `Fallacies of Distributed Computing` — 检查远程交互中的故障、延迟、容量、安全与拓扑假设。
- lse-galls-law — `Gall's Law` — 判断系统能否从可运行的简单核心逐步演化。
- lse-hyrums-law — `Hyrum's Law` — 识别正式契约之外的可观察兼容性依赖。
- lse-law-of-leaky-abstractions — `The Law of Leaky Abstractions` — 检查抽象在性能、故障和边界场景中的泄漏。
- lse-law-of-unintended-consequences — `Law of Unintended Consequences` — 评估复杂系统变更的间接影响与反向结果。
- lse-second-system-effect — `Second-System Effect` — 识别继任系统或重写中的功能膨胀与过度设计。
- lse-teslers-law — `Tesler's Law (Conservation of Complexity)` — 判断不可约复杂性应由用户、应用或其他层承担。
- lse-zawinskis-law — `Zawinski's Law` — 检查新增能力是否偏离产品核心价值并推动范围蔓延。

### Teams

- lse-brooks-law — `Brooks's Law` — 评估延期项目增员的培训、沟通与集成成本。
- lse-bus-factor — `Bus Factor` — 识别关键知识集中造成的人员单点风险。
- lse-conways-law — `Conway's Law` — 检查组织沟通边界与目标系统边界是否匹配。
- lse-dilbert-principle — `Dilbert Principle` — 检查管理晋升是否在回避绩效问题或忽略领导能力。
- lse-dunbars-number — `Dunbar's Number` — 识别组织扩大后关系认知与沟通渠道的压力。
- lse-peter-principle — `Peter Principle` — 检查晋升是否依据目标岗位能力而非旧岗位成绩。
- lse-prices-law — `Price's Law` — 识别关键贡献集中、成员过载与片面产出指标。
- lse-putts-law — `Putt's Law` — 检查管理决策与技术理解之间的语境鸿沟。
- lse-ringelmann-effect — `The Ringelmann Effect` — 评估团队扩张带来的人均投入下降与协调损耗。

### Planning

- lse-gilbs-law — `Gilb's Law` — 为重要但难量化的目标建立可解释、可修正的度量。
- lse-goodharts-law — `Goodhart's Law` — 检查代理指标成为目标后是否扭曲行为。
- lse-hofstadters-law — `Hofstadter's Law` — 提醒估算纳入隐藏任务、集成风险与未知因素。
- lse-ninety-ninety-rule — `The Ninety-Ninety Rule` — 防止以核心功能完成度低估项目尾部工作。
- lse-parkinsons-law — `Parkinson's Law` — 检查期限是否宽松到被拖延或非必要打磨填满。
- lse-premature-optimization — `Premature Optimization (Knuth's Optimization Principle)` — 要求性能复杂度由测量确认的瓶颈驱动。

### Quality

- lse-boy-scout-rule — `The Boy Scout Rule` — 在当前变更附近实施范围明确的小步质量改善。
- lse-broken-windows-theory — `Broken Windows Theory` — 识别长期可见缺陷对团队质量预期的侵蚀。
- lse-kernighans-law — `Kernighan's Law` — 检查实现是否清晰到足以被后续维护者调试。
- lse-lehmans-laws — `Lehman's Laws of Software Evolution` — 评估长期演化带来的复杂度与团队吸收能力。
- lse-linuss-law — `Linus's Law` — 检查关键代码是否获得有效审查以及受控修复渠道。
- lse-murphys-law — `Murphy's Law / Sod's Law` — 为可行失败路径配置相称的校验、处理与恢复。
- lse-pesticide-paradox — `Pesticide Paradox` — 要求测试随功能、缺陷模式和生产反馈更新。
- lse-postels-law — `Postel's Law` — 在严格输出与安全、确定的输入兼容之间取舍。
- lse-sturgeons-law — `Sturgeon's Law` — 用价值证据筛选低价值功能、代码路径或投入。
- lse-technical-debt — `Technical Debt` — 使捷径的即时收益、后续成本与重访条件可见。
- lse-testing-pyramid — `Testing Pyramid` — 平衡单元、集成与端到端验证的反馈成本和覆盖范围。

### Scale

- lse-amdahls-law — `Amdahl's Law` — 识别固定工作量扩展中的串行瓶颈与加速上限。
- lse-gustafsons-law — `Gustafson's Law` — 判断新增资源能否承载扩大后的有效并行工作。
- lse-metcalfes-law — `Metcalfe's Law` — 区分用户增长、潜在连接与实际网络价值。

### Design

- lse-dry-principle — `DRY (Don't Repeat Yourself)` — 识别同一知识或业务规则的重复表达。
- lse-kiss-principle — `KISS (Keep It Simple, Stupid)` — 优先选择满足当前需求的直接、可理解设计。
- lse-law-of-demeter — `Law of Demeter` — 减少调用方对远端对象内部结构的依赖。
- lse-principle-of-least-astonishment — `Principle of Least Astonishment` — 检查接口名称、默认值、行为与副作用是否符合预期。
- lse-solid-principles — `SOLID Principles` — 检查面向对象职责、替换、接口与依赖关系。
- lse-yagni — `YAGNI (You Aren't Gonna Need It)` — 阻止为尚未出现的需求预设功能和扩展点。

### Decisions

- lse-confirmation-bias — `Confirmation Bias` — 主动寻找反证与替代解释，避免只强化初始判断。
- lse-cunninghams-law — `Cunningham's Law` — 用明确标记的草稿或原型促成具体反馈。
- lse-dunning-kruger-effect — `Dunning-Kruger Effect` — 用经验、验证和同伴评审校准信心。
- lse-first-principles-thinking — `First Principles Thinking` — 从真实目标、基础组成与硬约束重新构造问题。
- lse-hanlons-razor — `Hanlon's Razor` — 在恶意归因前先检查错误、误解、疏忽与误配置。
- lse-hype-cycle-amaras-law — `The Hype Cycle & Amara's Law` — 区分技术热度、短期预期与经验证的长期价值。
- lse-inversion — `Inversion` — 从失败状态或相反结果反推风险与防御措施。
- lse-lindy-effect — `The Lindy Effect` — 把长期实际使用记录作为成熟度的启发式信号。
- lse-map-is-not-the-territory — `The Map Is Not the Territory` — 用运行证据修正文档、架构图和性能模型。
- lse-occams-razor — `Occam's Razor` — 在可行解释或方案中优先检查假设和组件更少者。
- lse-pareto-principle — `Pareto Principle (80/20 Rule)` — 用数据识别贡献主要影响的功能、缺陷或路径。
- lse-sunk-cost-fallacy — `Sunk Cost Fallacy` — 依据未来成本与收益复评方案，不让不可回收投入支配决定。

## 跨类别张力

- [综合] **兼容性与安全边界**：Hyrum's Law 提醒可观察行为可能成为依赖，Postel's Law 支持安全且确定的有限兼容，Murphy's Law 则要求畸形或危险输入具有明确失败处理；兼容不能演变为无条件接受。 supporting_ids: [lse-hyrums-law, lse-postels-law, lse-murphys-law]
- [综合] **简单演化与必要复杂性**：Gall's Law、KISS 与 YAGNI 支持从当前需要的简单方案开始，Tesler's Law 提醒固有复杂性仍须由合适层承担，Lehman's Laws 则提示长期演化会继续积累复杂度。 supporting_ids: [lse-galls-law, lse-kiss-principle, lse-yagni, lse-teslers-law, lse-lehmans-laws]
- [综合] **排期缓冲与范围膨胀**：Hofstadter's Law 和 The Ninety-Ninety Rule 要求为未知因素与收尾工作留下空间，Parkinson's Law、Second-System Effect 与 Zawinski's Law 则提醒宽松期限和继任计划可能吸收非必要工作。 supporting_ids: [lse-hofstadters-law, lse-ninety-ninety-rule, lse-parkinsons-law, lse-second-system-effect, lse-zawinskis-law]
- [综合] **增员速度与知识韧性**：Brooks's Law 和 Ringelmann Effect 警示短期增员的协调成本，Bus Factor 又要求避免关键知识长期集中；应区分即时追赶进度与持续分散知识。 supporting_ids: [lse-brooks-law, lse-ringelmann-effect, lse-bus-factor]
- [综合] **度量可见性与行为扭曲**：Gilb's Law 鼓励建立可解释的度量，Goodhart's Law 防止把代理指标直接目标化，Price's Law 与 Sturgeon's Law 的数字也不能用于人员、绩效或组织硬裁决。 supporting_ids: [lse-gilbs-law, lse-goodharts-law, lse-prices-law, lse-sturgeons-law]
- [综合] **审查广度与验证责任**：Linus's Law 支持通过多样化关注增加发现缺陷的机会，Testing Pyramid 与 Pesticide Paradox要求保留分层且持续更新的验证；更多目光不能替代负责人和测试。 supporting_ids: [lse-linuss-law, lse-testing-pyramid, lse-pesticide-paradox]
- [综合] **性能简单性与扩展模型**：Premature Optimization 要求先测量热点，Amdahl's Law 检查固定工作量的串行限制，Gustafson's Law 检查扩大工作量能否利用新增资源；三者不能脱离实际工作负载互相替代。 supporting_ids: [lse-premature-optimization, lse-amdahls-law, lse-gustafsons-law]
- [综合] **模型判断与运行现实**：First Principles Thinking、Inversion 与 Occam's Razor帮助形成和筛选方案，Confirmation Bias、Dunning-Kruger Effect 与 The Map Is Not the Territory 则要求持续用反证、验证和运行事实校准结论。 supporting_ids: [lse-first-principles-thinking, lse-inversion, lse-occams-razor, lse-confirmation-bias, lse-dunning-kruger-effect, lse-map-is-not-the-territory]

## Hermes 使用方式

- [推论] Hermes 可先按用户描述中的真实问题检索本页“快速决策入口”，再进入相应 wikilink 核对法则机制、适用问题和误用边界。
- [推论] 评审时可把表格中的“检查问题”改写为当前方案可回答的问题，并要求答案引用需求、运行证据、故障模型或团队事实。
- [推论] 当多个法则给出不同方向的提醒时，可检索“跨类别张力”，明确记录当前上下文中的取舍，不让法则名称直接充当结论。
- [推论] 对含数字、绝对措辞或幽默表达的条目，应继续检索类别页的“误用与限制”，不得据此形成硬阈值。
- [推论] 本次只沉淀 Wiki，不发生 active-layer promotion；Hermes 仅将本页用于 Wiki 检索与评审提问。

## Relations

- depends_on: `software-engineering-laws-architecture`
- depends_on: `software-engineering-laws-teams`
- depends_on: `software-engineering-laws-planning`
- depends_on: `software-engineering-laws-quality`
- depends_on: `software-engineering-laws-scale`
- depends_on: `software-engineering-laws-design`
- depends_on: `software-engineering-laws-decisions`
- related: [llm-engineering-knowledge-map](/concepts/llm-engineering-knowledge-map)
- related: [agentic-programming-system-engineering](/concepts/agentic-programming-system-engineering)

