---
title: Agent 工具与跨边界互操作范式对照
created: 2026-11-25
updated: 2026-11-26
type: comparison
tags:
  - agent
  - mcp
  - tool
  - skills
  - comparison
  - orchestration
  - architecture
  - decision
sources:
  - https://modelcontextprotocol.io/specification/2026-07-28
  - https://agentskills.io/specification
  - https://www.linuxfoundation.org/press/agentic-ai-foundation-announces-four-new-projects-agent-skills-open-responses-openenv-and-opensandbox
  - https://lfaidata.foundation/communityblog/2025/08/29/acp-joins-forces-with-a2a-under-the-linux-foundations-lf-ai-data/
  - https://a2a-protocol.org/latest/whats-new-v1/
  - https://a2a-protocol.org/latest/topics/a2a-and-mcp/
  - https://a2a-protocol.org/latest/topics/key-concepts/
  - https://a2a-protocol.org/latest/topics/streaming-and-async/
  - https://github.com/a2aproject/A2A/releases
  - https://agent2agent.info/docs/reference/interoperability/
  - https://agent2agent.info/docs/guides/task-runtime/
  - https://arxiv.org/html/2609.10871v1
  - https://arxiv.org/html/2610.23449v1
  - https://arxiv.org/html/2610.23707v1
  - https://arxiv.org/html/2610.41905v1
  - https://arxiv.org/html/2602.14878v1
  - https://arxiv.org/html/2602.12670v4
  - https://arxiv.org/pdf/2610.30157
  - https://www.scalekit.com/blog/mcp-vs-cli-use
  - https://stacklok.com/blog/mcp-vs-cli-tools-why-security-changes-the-answer/
  - https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling
  - https://blog.cloudflare.com/code-mode-mcp/
  - https://www.infoq.com/news/2026/11/claude-code-mode/
  - https://arxiv.org/html/2602.00933v1
  - https://arxiv.org/html/2512.24565v5
  - concepts/mcp-stateless-architecture-and-authorization-boundaries.md
  - concepts/ai-agent-tool-selection-architecture.md
  - concepts/agent-skill-governance-and-reversible-state.md
  - concepts/subagent-orchestration-patterns.md
status: stable
volatility: medium
verified_at: 2026-11-25
review_by: 2027-03-25
description: 横向比较 CLI/Bash、Agent Skills、扁平与分层网关无状态 MCP、Code Mode / PTC 沙箱编排及 A2A
  v1.0.1 跨代理协议的上下文经济学、实证可靠性与安全边界，沉淀六参数选型裁决矩阵。
aliases:
  - cli-skills-mcp-a2a-comparison
  - agent-interoperability-paradigms
---

# Agent 工具与跨边界互操作范式对照

## Summary

随着 Linux 基金会 [Agentic AI Foundation（AAIF）](https://www.linuxfoundation.org/press/agentic-ai-foundation-announces-four-new-projects-agent-skills-open-responses-openenv-and-opensandbox) 将 **MCP**、**Agent Skills**（[agentskills.io](https://agentskills.io/specification)）与 **A2A**（吸收原 IBM ACP，见 [LF AI & Data 合并公告](https://lfaidata.foundation/communityblog/2025/08/29/acp-joins-forces-with-a2a-under-the-linux-foundations-lf-ai-data/)）纳入统一开放治理，工程选型的核心已不再是“某种协议能否淘汰其余方案”，而是按**信任边界、上下文缓存经济学、中间输出体积与不透明代理委托需求**组合六类能力范式。本页承接 [mcp-stateless-architecture-and-authorization-boundaries](/concepts/mcp-stateless-architecture-and-authorization-boundaries)、[ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture)、[agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state) 与 [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)，集中维护跨范式实证对照与参数化选型门禁。

三条经 2025–2026 基准验证的核心判断：
- **前缀缓存改写工具搜索的经济拐点**：静态工具列表享有 `85%–87%` 的前缀缓存命中率，使动态工具检索在 **`25–28` 个工具以下**反而不如静态预载经济（[Arcade，arXiv:2610.23707](https://arxiv.org/html/2610.23707v1)）；真正无法被前缀缓存抵消的是每轮新增的大体积工具输出，需由 **Code Mode / PTC 沙箱编排**在沙箱内先行过滤（[Anthropic PTC](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling)）。
- **精编紧凑 Skill 显著提分，但运行时自生成 Skill 产生负迁移**：大规模受控实验表明 `1–3` 个精编紧凑 Skill 模块可将任务通过率提升 `+19.0~21.5` 个百分点，而模型在运行时自行生成并直接激活的 Skill 反而使通过率倒退 `-8.1~-11.5` 个百分点（[SkillsBench，arXiv:2602.12670v4](https://arxiv.org/html/2602.12670v4)）。
- **多租户与跨组织边界决定协议下限**：单人本地受控环境下 **CLI + 精编 Skills** 延迟与成本最低，但超过 **`5` 名用户或触及受监管数据**时，具备逐请求 OAuth 2.1 与受众绑定的无状态 MCP 在总拥有成本（TCO）与安全审计上全面占优（[arXiv:2610.30157](https://arxiv.org/pdf/2610.30157)、[Stacklok](https://stacklok.com/blog/mcp-vs-cli-tools-why-security-changes-the-answer/)）；跨团队或异构框架委托不透明代理时应采用 **A2A v1.0.1**，并在网关层强制补齐 `contextId` 主体绑定与 RFC 8693 换票以修补规范级漏洞（[A2ABreak，arXiv:2609.10871](https://arxiv.org/html/2609.10871v1)）。

## 1. 六类能力与跨边界互操作范式全维对照

| 能力范式 | 抽象方向与暴露原语 | 静态与缓存后成本特征 | 实证可靠性与退化边界 | 凭据隔离、合规与适用域 |
| :--- | :--- | :--- | :--- | :--- |
| **CLI / Bash 原生调用** | 纵向本地进程调用；复用命令行 `--help`、管道与退出码 | 静态开销约 `0–600` tok；单用户理想路径最低（GitHub 读任务 `1.4k–9.4k` tok，[Scalekit](https://www.scalekit.com/blog/mcp-vs-cli-use)），但自治长跑因非结构化文本重试可隐性膨胀 `3–8×`（[arXiv:2610.30157](https://arxiv.org/pdf/2610.30157)） | Scalekit 读任务 `25/25` 通过；跨操作系统或 CLI 版本升级时文本解析脆弱，易发生静默截断 | **共享环境权威负债**：子进程默认继承宿主机本地密钥与 CLI 登录态；仅限 `≤5` 人本地开发或单租户强隔离容器 |
| **CLI / 工具 + 精编 Agent Skills** | 程序性方法层（[Agent Skills 规范](https://agentskills.io/specification)）；三层渐进披露 `SKILL.md` + 脚本/参考 | 目录索引约 `100` tok/项，按需激活约 `1.2k` tok；800-token `gh` Skill 可减少约 `1/3` CLI 试探调用与延迟（[Scalekit](https://www.scalekit.com/blog/mcp-vs-cli-use)） | `1–3` 个紧凑模块提分 `+19.0~21.5` pp；同时挂载 `≥4` 个稀释至 `+10.1` pp；长篇百科文档仅 `+0.7` pp；**运行时自生成 Skill 反降 `-8.1~-11.5` pp**（[SkillsBench](https://arxiv.org/html/2602.12670v4)） | 不独立持有权限，完全继承底层工具边界；外部社区技能包存在指令投毒风险，须走版本锁定与审查门禁（见 [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary)） |
| **扁平直连 MCP（全量预载）** | 纵向标准化 JSON Schema 工具/资源调用（[MCP 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28)） | 静态预载 `2k–55k+` tok；`≤25–28` 个工具且高前缀缓存命中时实付成本低；扩至 `1,500` 噪声工具时飙升至 `233.3k` tok/轮、延迟 `64.1s`（[GatewayBench](https://arxiv.org/html/2610.23449v1)） | [MCP-Atlas](https://arxiv.org/html/2602.00933v1) 最高通过率 `62.3%`（`36.0%` 失败源于漏调工具）；部分模型在 [MCPAgentBench](https://arxiv.org/html/2512.24565v5) 双并行调用题有效分跌至 `0` | **多租户企业基线**：服务端隔离凭据、OAuth 2.1 + PKCE + RFC 8707 受众绑定与结构化审计（`>5` 名用户或受监管数据首选） |
| **无状态 MCP + 分层检索网关** | 纵向网关聚合与按需发现（`search` → 按需加载目标 Schema） | 静态入口约 `170–1,000` tok；输入 Token 削减 `17.2%–94.6%`，扣除 `85%–87%` 前缀缓存后**实付美元净省 `13.6%`**（范围 `5.5%–21.8%`，[Arcade](https://arxiv.org/html/2610.23707v1)） | 强推理模型（GPT-5.4）在 `1,500` 工具下稳守 `85.6%` 成功率并将间接注入 ASR 从 `47.2%` 压至 `30.9%`；但较弱模型（GPT-5.1）易跳过发现捏造工具名而暴跌 `37.6` pp（[GatewayBench](https://arxiv.org/html/2610.23449v1)） | 实测检索净节省为正且模型能可靠完成工具发现的企业多源集成；须配集合完备检索以防漏召回前置生产者工具（[arXiv:2610.41905](https://arxiv.org/html/2610.41905v1)） |
| **Code Mode / PTC 沙箱编排** | 模型生成类型化代码在受控沙箱内循环调用 MCP / API 并过滤中间载荷 | 暴露 `search() + execute()` 仅占约 `1,000` tok（[Cloudflare Code Mode](https://blog.cloudflare.com/code-mode-mcp/)）；多工具大输出过滤省 `24%–38%` 输入 Token，但 `1–2` 步简单顺序交互反增约 `+8%` 开销（[Anthropic PTC](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling)） | BrowseComp 准确率提升 `+11%`；将多轮分页、连接与聚合从概率性上下文搬运收敛为确定性代码执行 | 服务端 V8 Isolate 隔离度高；部分云端托管容器暂不满足零数据保留（ZDR）或 HIPAA 合规；本地脚本执行须解析复合命令防绕过前置 Hook（[InfoQ](https://www.infoq.com/news/2026/11/claude-code-mode/)） |
| **A2A v1.0.1 跨代理任务委托** | 横向“客户端 Agent ↔ 远端不透明 Agent”长程协作（[A2A v1.0](https://a2a-protocol.org/latest/whats-new-v1/) / [A2A and MCP](https://a2a-protocol.org/latest/topics/a2a-and-mcp/)） | 主上下文仅感知 `/.well-known/agent-card.json` 摘要与最终 `Artifact`，彻底免除暴露远端内部百级工具 Schema 与推理轨迹；网络与状态机往返开销最高 | 原生 9 态 `TASK_STATE_*`、SSE 流与带 JWT+JWKS 防伪的异步推送（[Streaming & Async](https://a2a-protocol.org/latest/topics/streaming-and-async/)）；漏传 `A2A-Version: 1.0` 头会静默回退至 `v0.3`（[A2A Interop](https://agent2agent.info/docs/reference/interoperability/)） | 跨组织、跨云或异构框架不透明边界；须在网关强制拦截未绑定 `contextId` 注入、执行 RFC 8693 OBO 换票并将返回 `Artifact` 视为不可信输入（[A2ABreak](https://arxiv.org/html/2609.10871v1)） |

## 2. 关键实证边界与反直觉权衡（2025–2026 基准对账）

### 2.1 前缀缓存折算定律与未缓存输出瓶颈

直觉上“按需动态搜索工具能按削减的 Schema Token 比例等额省钱”，但 [Arcade 工具推荐研究（arXiv:2610.23707v1）](https://arxiv.org/html/2610.23707v1) 对真实企业编码工作流的计费审计推翻了这一线性假设：
- **前缀缓存折扣效应**：固定在系统提示前缀中的静态工具列表拥有 `85%–87%` 的 KV 前缀缓存命中率（缓存命中部分按基础输入单价约 `10%` 计费），而动态按轮替换工具子集可能打破前缀连续性或引入额外检索轮次。因此，`17.2%–39.6%` 的账面输入 Token 降幅折算为真实账单后仅净省 **`5.5%–21.8%`（池化均值 `13.6%`）**；在该实验计费模型下，工具数低于约 `25–28` 个，或平均每次工具调用的搜索次数超过约 `0.63` 时，静态预载反而更便宜（衔接 [agent-resource-optimization](/concepts/agent-resource-optimization) 的 $K_{\text{cache}}$ 前缀经济学）。
- **真正昂贵的是未缓存的工具输出载荷**：每轮新追加到消息历史末尾的大体积 JSON 返回值在首次进入上下文时完全无法命中前缀缓存，且在后续每轮持续累加。[Anthropic Programmatic Tool Calling (PTC)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling) 通过在沙箱内过滤中间返回，在多步检索聚合场景节省 `24%–38%` 输入 Token，但在仅需 `1–2` 次顺序调用且每步依赖语义判断的 $\tau^2$-Bench 上，因容器初始化与代码生成开销反而净增约 **`8%`** Token 成本（详见 [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management) 与 [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)）。

### 2.2 多工具集合完备召回、分层网关门槛与描述异味

当工具池规模突破百级进入动态检索或网关路由区间时，瓶颈从“单工具匹配”转向**依赖链完备性**与**元数据信噪比**（补充 [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture)）：
- **前置生产者工具漏召回瓶颈**：[Multi-Tool Retrieval Structures（arXiv:2610.41905v1）](https://arxiv.org/html/2610.41905v1) 横评 6 类检索架构发现，传统单步 Top-$K$ 稠密检索在 AppWorld（$k=16$）上的完整工具集召回率不超过 **`9.6%`**（MCP-Bench 上不超过 `35.9%`）。`162/241` 的漏检案例并非漏掉最终执行动作的消费者工具，而是漏掉了用户查询未显式提及、用于获取前置 ID 或句柄的**生产者工具（Producer APIs）**；一旦检索集合完备，下游端到端任务 `21/21` 成功，缺失任一前置工具时仅 `2/39` 成功。引入集合级协同检索器（如 COLT）可在零额外 LLM 调用下将完备率提升至 `32.8%`（AppWorld）与 `58.3%`（MCP-Bench）。
- **分层网关的模型能力门槛**：[GatewayBench（arXiv:2610.23449v1）](https://arxiv.org/html/2610.23449v1) 在 251 个真实服务与最高 `11,118` 个噪声工具下证实，两级分层发现网关（服务发现 → 工具加载）在强推理模型上兼顾高成功率与抗间接提示注入收益，但较弱模型会频繁跳过前置发现动作直接幻觉工具名，导致成功率暴跌 `37.6` 个百分点。
- **工具描述的信噪比悖论**：[MCP 工具描述异味审计（arXiv:2602.14878v1）](https://arxiv.org/html/2602.14878v1) 检验 103 个 Server 的 856 个工具后发现 **`97.1%`** 存在描述异味（用途模糊、参数约束缺失或隐含前置依赖）。实验表明补齐清晰的**用途与调用边界（Purpose + Guidelines）**能显著提升任务成功率，但**删去冗长的 Few-shot `Examples` 未引起统计显著退化（$p > 0.20$）**，而不加裁剪地堆砌六维全量长描述反而使模型中位执行步数膨胀 **`+67.46%`**。

### 2.3 紧凑精编 Skill 增益 vs. 运行时自生成负迁移

[SkillsBench（arXiv:2602.12670v4）](https://arxiv.org/html/2602.12670v4) 在 87 个真实任务上执行 9,396 次受控试验，量化了程序性技能层（[agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state)）的收益边界：
- **最佳粒度为 `1–3` 个聚焦模块**：人工精编 Skill 使全样本平均通过率从 `33.9%` 升至 `50.5%`（`+16.6` pp），其中包含具体操作规程与验证检查点的 `1–3` 个紧凑模块增益最高（`+19.0~21.5` pp），而铺陈背景概念的百科全书式长文档几乎无增益（`+0.7` pp），且有 `13/87` 个任务因指令过度死板触发负迁移。
- **禁止未经验证的运行时自生成 Skill 闭环**：让模型在任务执行前自行编写并挂载新 Skill，平均通过率相对无 Skill 基线反而下降 **`-8.1~-11.5` 个百分点**——模型容易将未经环境验证的错误前置假设固化为刚性步骤。新沉淀的 Skill 必须经过离线回归门禁复验后方可晋升激活（衔接 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)）。

### 2.4 A2A v1.0.1 跨代理契约与 `A2ABreak` 形式化安全缺口

当协作跨越组织、云环境或异构框架边界时，[A2A v1.0](https://a2a-protocol.org/latest/whats-new-v1/)（及 [v1.0.1 补丁版](https://github.com/a2aproject/A2A/releases)）将 `spec/a2a.proto` 确立为唯一规范事实源，合并单一多模态 `Part`（`text / raw / url / data`），标准化 `/.well-known/agent-card.json`（支持 RFC 8785 JCS 规范化与 RFC 7515 JWS 签名）及 9 个 `TASK_STATE_*` 生命周期状态（含 `TASK_STATE_INPUT_REQUIRED` 与 `TASK_STATE_AUTH_REQUIRED`）。工程联调须注意两处互操作细节：请求漏传 `A2A-Version: 1.0` 头时服务端会静默回退至不兼容的 `v0.3` 语义（[A2A Interop](https://agent2agent.info/docs/reference/interoperability/)），且断线重订阅接口 `SubscribeToTask` 在 `a2a.proto` 中定义为 `GET` 而在部分说明文档中误写为 `POST`（[Task Runtime](https://agent2agent.info/docs/guides/task-runtime/)）。

更重要的是，ACSAC '26 录用的形式化安全审计 [A2ABreak（arXiv:2609.10871v1）](https://arxiv.org/html/2609.10871v1) 对 A2A 37 态有限状态机进行模型检验后，揭示了 **11 类完全符合协议规范却可被利用的设计级漏洞**，要求在网关层额外实施三条防御门禁（深化 [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns) 与 [multiagent-systemic-failure-modes](/concepts/multiagent-systemic-failure-modes)）：
1. **`contextId` 归属主体强制绑定**：协议未规定 `contextId` 与发起方身份的强绑定，攻击者若获知或枚举 `contextId` 可向他人活跃多轮上下文注入恶意消息；网关必须维护 `<authenticated_principal, contextId>` 映射并拒绝跨主体复用。
2. **多跳委托链的 RFC 8693 OBO 令牌交换**：`Agent A → Agent B → Agent C` 级联调用时，传输层点对点令牌会丢失原始人类主体身份，导致 `B` 滥用自身全量权限充当困惑副手；跨跳委托必须采用 RFC 8693 On-Behalf-Of 令牌交换，同时保留原始主体 `sub` 与嵌套代理链 `act` 声明，按交集收紧权限。
3. **区分身份签名与能力真实性**：`AgentCard` 的 JWS 签名仅证明“该卡片由对应域名私钥签发”，绝不证明其自报的技能描述无夸大或无投毒；远端返回的 `Message` 与 `Artifact` 必须一律打上外部不可信污点标签。

## 3. `[推论]` 六参数范式选型裁决矩阵

综合上述协议规范与实证阈值，在架构评审时按以下六个可观测参数决定单任务或平台的能力接入栈（与 [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist) 的五维职责路由互补）：

| 参数符号 | 物理定义与度量口径 | 关键判断阈值 | 架构选型动作 |
| :--- | :--- | :--- | :--- |
| **`N_tools`** | 当前角色需暴露的候选工具 Schema 总数 | 实验中约 `25–28` 个工具，仅作启动对比测量的参考 | 用同一批任务比较静态预载和动态检索；结合实际搜索频率、缓存价格及下一行的 `ΔC_net` 决定是否切换，不按数量自动切换 |
| **`ΔC_net`** | 扣除前缀缓存命中率 $K_{\text{hit}}$ 后的动态检索净节省：$\Delta C_{\text{schema}}[1 - K_{\text{hit}}(1 - \alpha_r)] - C_{\text{search}}$ | `ΔC_net > 0` | 仅当净节省显著为正且不破坏系统提示静态前缀块时启用逐轮动态工具替换 |
| **`\|O_uncached\|`** | 多步确定性转换（分页、过滤、聚合）产生的未缓存中间工具输出规模 | $\sum_{m=1}^{M-1}(M-m)\|O_m\| > \|P_{\text{code}}\| + \|O_{\text{final}}\| + C_{\text{sandbox}}$ | 满足不等式且无需逐步开放语义判断、亦无 ZDR/HIPAA 托管禁忌时，下沉至 **Code Mode / PTC 沙箱编排** |
| **`R_set`** | 多步任务对“前置生产者工具 → 下游消费者工具”隐式依赖链的集合完备召回要求 | 存在跨工具 ID/句柄前置依赖 | 禁止仅靠单步扁平 Top-$K$ 相似度截断；须在网关侧声明前置工具依赖边或采用集合级协同检索 |
| **`B_trust`** | 执行环境的租户隔离级别与受监管数据触达范围 | 单人受控环境（`≤ 5` 人且无合规敏感数据）vs. 多租户/受监管环境 | 前者优先采用 **CLI + `1–3` 个精编紧凑 Skill**；后者强制采用 **无状态 MCP（OAuth 2.1 + RFC 8707 + 沙箱外凭据代理）** |
| **`D_opaque`** | 协作对象是否跨团队、跨组织或必须隐藏内部提示词、私有记忆与工具拓扑 | 同信任域同 Harness vs. 跨信任域不透明代理 | 同域优先用内建受控 Subagent（见 [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)）；跨域采用 **A2A v1.0.1** 并前置 `contextId` 绑定与 RFC 8693 OBO 网关 |

## 4. 证据边界与不推广事项

- **基准条件绑定**：本页引用的定量读数（Arcade 的 `25–28` 工具拐点与 `13.6%` 净账单节省、GatewayBench 的 `233.3k → 12.6k` tok/轮与 `-37.6` pp 弱模型退化、SkillsBench 的 `+16.6` pp 精编增益与 `-8.1~-11.5` pp 自生成负迁移、Anthropic PTC 的 `24%–38%` 节省与 `+8%` 顺序溢价、微软/Scalekit 的 `5` 用户 TCO 分界）均受各自评测模型、提示词缓存定价与任务分布约束，用作方向性工程门禁而非跨厂商精确常数。
- **核验范围与时效**：所有外部协议规范（MCP `2026-07-28`、A2A `v1.0.1`、Agent Skills、AAIF 公告）及 2025–2026 预印本论文均于 `2026-11-25` 核对自公开官方文档或 arXiv HTML/PDF 原文，未进行本地复现实验；`SubscribeToTask` 的文档/proto 差异随上游补丁可能收敛，需在 `review_by` 周期内复查。
- **非执行授权声明**：本对照页仅提供架构选型依据，不自动改变任何现有项目的 CLI 权限、Skill 启用列表、MCP 网关配置或跨代理网络策略。

## Relations

- depends_on: [mcp-stateless-architecture-and-authorization-boundaries](/concepts/mcp-stateless-architecture-and-authorization-boundaries), [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture), [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state), [subagent-orchestration-patterns](/concepts/subagent-orchestration-patterns)
- related: [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order), [agent-resource-optimization](/concepts/agent-resource-optimization), [hermes-layer-routing-decision-checklist](/concepts/hermes-layer-routing-decision-checklist), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries), [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary), [ai-coding-assistant-context-budget-management](/concepts/ai-coding-assistant-context-budget-management), [multiagent-systemic-failure-modes](/concepts/multiagent-systemic-failure-modes)

