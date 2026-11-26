---
title: Agent Skill Provider Governance Boundary
created: 2026-05-25
updated: 2026-11-26
type: concept
tags:
  - agent
  - skills
  - governance
  - architecture
sources:
  - raw/articles/microsoft-devblogs-agent-skills-python-provider-2026-05-24.md
  - docs:https://devblogs.microsoft.com/agent-framework/agent-skills-for-python-file-code-and-class-composed-in-one-provider/
  - docs:https://agentskills.io/specification
  - https://cosmonic.com/docs/platform-concepts/principle-of-least-authority/
  - https://arxiv.org/html/2606.28679v1
  - https://invariantlabs.ai/blog/mcp-security-notification
  - https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices
  - concepts/mcp-stateless-architecture-and-authorization-boundaries.md
status: stable
volatility: medium
review_by: 2027-03-02
description: 结合多源组合代数、命名空间遮蔽防御、Saltzer–Schroeder 最小权限/完全中介原则与 Confused
  Deputy（ScopeGate 逐次参数授权）边界，定义多形态 Agent skill 进入统一 provider 的治理契约。
aliases:
  - skill-provider-boundary
  - agent-skill-provider
verified_at: 2026-11-02
---

# Agent Skill Provider Governance Boundary

## Summary

Agent skill 系统的长期价值不在于把所有技能塞进同一个目录，而在于把多种物理形态统一到一个可治理的 provider 抽象下。文件技能（file-based）、类封装技能（class-based）和运行时内联技能（inline/code-defined）可以共享发现、组合、过滤、去重与执行入口；但进入统一注册池前，必须先定义**命名空间优先级、最小暴露白名单、静态门控与动态逐次参数授权分离、沙箱隔离和审计边界**。

这页把 Microsoft Dev Blogs 的 Agent Framework Python Skills 文章 [microsoft-devblogs-agent-skills-python-provider-2026-05-24](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/microsoft-devblogs-agent-skills-python-provider-2026-05-24.md) 与 [Agent Skills 开放规范](https://agentskills.io/specification)、系统安全中的**最小权限/最小权威原则（PoLP / PoLA）**及**困惑副手（Confused Deputy）**实证研究（[Cosmonic PoLA](https://cosmonic.com/docs/platform-concepts/principle-of-least-authority/)、[Mellafe Zuvic 2026 (`arXiv:2606.28679v1`)](https://arxiv.org/html/2606.28679v1)）编译为 AI Agent 可复用的治理原则。它连接 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)、[hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)、[hermes-skill-refactoring-methodology](/concepts/hermes-skill-refactoring-methodology) 和 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)。

## Durable principle

先统一 skill 抽象，再分层治理 skill 来源与执行授权。

一个 Agent 可以同时消费三种典型 skill 物理形态（[microsoft-devblogs-agent-skills-python-provider-2026-05-24](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/microsoft-devblogs-agent-skills-python-provider-2026-05-24.md)）：
- **File-based skill**：包含 `SKILL.md`（符合 [Agent Skills 规范](https://agentskills.io/specification) 的 YAML frontmatter 与指令正文）、`scripts/`、`references/` 等磁盘文件资产，由宿主注入 `script_runner` 执行脚本；
- **Class-based skill**：由可安装的 Python 包或类（如子类化 `ClassSkill`）将元数据、指令、`@ClassSkill.resource` 与 `@ClassSkill.script` 封装为单一分布单元（混用 `@property` 描述符时须将 `@property` 置于最外层）；
- **Inline / code-defined skill**：在运行时通过代码或闭包（如 `InlineSkill`）动态构造临时桥接能力，或按当前会话上下文动态生成只读资源。

这些形态可以通过 provider/source 组合向 Agent 暴露同一类接口。但**“接口可组合”只解决工程接入问题，不自动解决名称冲突、上下文污染与越权执行问题**。

## 理论与安全根基：多源组合代数、最小权威原则（PoLA）与困惑副手防御

### 1. 多源组合算子与“先入为主”命名空间遮蔽风险

[microsoft-devblogs-agent-skills-python-provider-2026-05-24](https://github.com/on195594/wiki/blob/c16da0521633b13e5af0adef137bd7fd889c4f13/raw/articles/microsoft-devblogs-agent-skills-python-provider-2026-05-24.md) 展示了可嵌套组合的**聚合（Aggregating）**、**去重（Deduplicating）**与**过滤（Filtering）**算子，并未规定唯一顺序。**[本页建模]** 对多技能源序列 $\mathcal{S} = (S_1, S_2, \dots, S_m)$，若选择先聚合、再去重、最后过滤，可将向目标 Agent 实例 $a$ 暴露的集合写为：

$$\mathcal{P}_{\text{exposed}}(a) = \operatorname{Filter}_{P_{\text{allow}}(\cdot, a)}\!\Big(\operatorname{Deduplicate}_{\text{first}}\!\big(\operatorname{Aggregate}(S_1, S_2, \dots, S_m)\big)\Big)$$

其中 $\operatorname{Deduplicate}_{\text{first}}$ 采用**首次注册优先（First-Wins Left-Biased Override，$S_1 \triangleright S_2$）**规则：

$$(S_1 \triangleright S_2)(n) = \begin{cases} S_1(n), & \text{if } n \in \operatorname{dom}(S_1) \\ S_2(n), & \text{if } n \notin \operatorname{dom}(S_1) \land n \in \operatorname{dom}(S_2) \end{cases}$$

**[推论] 这一非交换算子直接带来两项架构治理约束：**
1. **命名空间遮蔽攻击面（Namespace Shadowing）**：由于 $S_1 \triangleright S_2 \ne S_2 \triangleright S_1$，若把低信任度源（如临时 `InlineSkill`、项目本地未审目录或第三方外部包）排在受治理的核心 Active 源之前，同名技能将在无报错情况下静默遮蔽核心技能（类似 Unix `PATH` 顺序劫持或 Python 导入遮蔽）。因此，生产级 Provider 不应将静默 `DeduplicatingSkillsSource` 当作治理机制，而必须实施**独立来源标识、重名冲突显式告警或按信任等级锁定的优先序**。若使用 `system:` / `user:` / `pkg:`，它们只能是 provider 内部限定标识，不能直接作为 Agent Skills 的 `name` 或目录名（规范不允许冒号）；需要编码进名称时应采用合法形式如 `system-review` 并检测编码后的冲突。来源信任过滤宜在去重前完成，避免不可信同名项先占位后被过滤，反而使可信技能消失。
2. **过滤层兼具权限收敛与认知降噪双重职责**：若省略显式谓词过滤 $P_{\text{allow}}(s, a)$ 而将全组织技能池直接暴露给单个 Agent，不仅扩大能力暴露面，还可能加剧候选干扰。[agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state) 汇总的特定实验中，候选从 5 扩至 100 时实际使用 precision 从 `29.6%` 降至 `3.3%`，但任务成功率相对稳定；不能将该实验比例当作任意 provider 的通用选择精度或越权率。因此 `FilteringSkillsSource` 必须按任务域与 Agent 角色白名单裁剪可见集合（上下文预算约束见 [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules)）。
3. **外部 MCP 工具元数据投毒、Rug Pull 与跨服务器遮蔽**：上述信任边界失效同样发生在 MCP 工具接入层。[Invariant Labs](https://invariantlabs.ai/blog/mcp-security-notification) 披露了工具描述投毒（Tool Poisoning，在 `description` 中隐藏恶意指令）、批准后静默篡改（Rug Pull）与跨服务器遮蔽（Cross-Server Shadowing）；[MCP 官方安全最佳实践（2026-07-28）](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) 要求一键配置本地服务前展示完整命令并取得同意、以最小权限沙箱运行本地进程，并严禁令牌透传与信任未验证工具注解。`[推论]` 客户端或网关应按来源固定已审工具的元数据，变更即暂停并重审；固定元数据不能证明远端实现未变（MCP 无状态授权门禁与完整对抗性威胁模型分别主维护于 [mcp-stateless-architecture-and-authorization-boundaries](/concepts/mcp-stateless-architecture-and-authorization-boundaries) 与 [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense)）。

### 2. 最小权限/最小权威原则（PoLP / PoLA）与困惑副手（Confused Deputy）

Jerome H. Saltzer 与 Michael D. Schroeder（1975，*Proceedings of the IEEE* 63(9): 1278–1308，*The Protection of Information in Computer Systems*）确立了安全系统的两项核心设计公理：**最小权限（Least Privilege，每个程序与主体仅使用完成当前任务所需的最小权限集合）**与**完全中介（Complete Mediation，对受保护权威的每一次访问都必须经过策略核验，而非仅在初始化时检查一次）**。Norm Hardy（1988，*ACM SIGOPS Operating Systems Review* 22(4): 36–38，*The Confused Deputy*）与 Mark S. Miller（2006，见 [Principle of Least Authority (PoLA)](https://cosmonic.com/docs/platform-concepts/principle-of-least-authority/)）进一步指出：当一个拥有广泛**环境权威（Ambient Authority）**的受信任中介被不可信输入诱导，代表缺乏权限的调用方滥用其自身权限时，即发生**困惑副手（Confused Deputy）**失效。

David Mellafe Zuvic（2026，[*Capability Gates Are Not Authorization: Confused-Deputy Failures in LLM Agent Frameworks*](https://arxiv.org/html/2606.28679v1)）对主流 Agent 框架（LangChain/LangGraph、LlamaIndex、Stripe Agent Toolkit 固定公开提交）的源码审计与 27 模型基准测试将这一经典安全边界精确映射到 LLM 工具与技能调用层：

- **静态能力门控（Capability Gating）$\ne$ 动态逐次调用授权（Per-Call Value Authorization）**：
  - **静态能力门控**（如 `FilteringSkillsSource` 或工具菜单白名单）只在构建或会话初始化时决定“Agent 能看见哪些技能/工具”；
  - **接口类型校验**（如 JSON Schema 或 Pydantic，见 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)）只能拒绝格式损坏的参数，但无法判断一个**类型完全合法**的参数值（如攻击者通过间接提示注入诱导生成的 `account="acct_ATTACKER_999"` 或危险脚本参数）是否在当前会话的业务授权范围内；
  - 当运行时仅检查“技能/工具名在白名单内 + 参数符合 Schema 类型”就直接放行副作用时，不可信的 LLM 实际上同时充当了“动作提议者”与“授权裁决者”，使宿主沦为**默认困惑副手（Confused Deputy by Default）**。
- **模型暴露度与五阶段确定性拦截（ScopeGate）**：在配套的 27 模型任务对齐提示注入（Task-Aligned Prompt Injection）测试中，成本优化的部署层模型（Deployment-tier，12 个模型）发起未授权工具调用的平均尝试率高达 $\mathrm{ASR}_{\text{task}} = 0.603$（旗舰模型平均为 $0.189$，相差约 `3.2×`；该指标为沙箱内未授权调用尝试率，非生产突破率，且分层均值为跨模型汇总而非配对置信区间）。为在动作层实现完全中介，论文提出位于模型下游、副作用工具上游的确定性策略决策与执行点 **ScopeGate（PDP/PEP）**，按五阶段顺序执行**默认拒绝（Fail-Closed）**裁决：
  1. `Scope`（工具/技能受控检查：未列入带外策略的技能默认拒绝）；
  2. `Authz`（具体参数值白名单：核验目标账户、路径、URL 等受限参数是否属于带外可信集合 $A_k$）；
  3. `Money Ceiling`（金额上限：对数值参数做有限非负实数区间核验 $0 \le a \le \text{ceiling}$，显式拒绝 `NaN`、`Inf` 或类型混淆）；
  4. `Idempotency`（幂等键检查：策略标记为有副作用且要求幂等的调用，须携带可信上下文幂等键 $\Gamma.\text{idempotencyKey} \ne \bot$；该检查只保证键存在，实际去重仍须由工具或后端持久化与原子执行机制实现）；
  5. `Default Deny`（任一阶段未通过或发生异常即返回 `Deny`）。
  **至关重要的前提是带外策略不变性（Out-of-Band Policy Invariance）**：所有允许集 $A_k$、上限与白名单必须来自模型上下文窗口与写路径之外的操作员可信配置；若允许 LLM 在会话中自行生成、扩展或刷新授权范围，同一提示注入将同时污染调用与策略（在论文受控测试集中，ScopeGate 实现了 `0/48` 静态绕过、`0/29` 40 轮自适应攻击绕过与 `0/10` 良性误拒；作者同时声明这是测试集有界遏制而非消除提示注入本身）。

## Governance boundary

### 1. Skill source composition is not skill promotion

聚合多个 skill source 只能说明它们能被同一个 provider 读取，不说明它们都应该进入 active 层。对 AI Agent 来说，project-local skill、实验 skill、一次性 `InlineSkill` 桥接逻辑和 active skill 应继续分层（层间归属边界见 [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)），不能因为技术上可合并就混成一个默认注册池。

### 2. Filtering is the explicit capability-gating layer

过滤层应回答“这个 Agent 当前允许看见哪些 skill”。白名单、任务域过滤和 profile/project 边界，比单纯依赖自然语言描述更可靠。没有过滤层时，skill 数量越多，候选扇出干扰（Fan Effect）、误路由和越权调用的风险越高。

### 3. Deduplication is a convenience, not a governance model

微软示例里的 `DeduplicatingSkillsSource` 说明重名 skill 可以按注册顺序遮蔽（$S_1 \triangleright S_2$），但这只是工程便利。AI Agent 不应把“先注册者优先”当成治理规则；更稳妥的做法是显式命名空间、冲突检测、来源记录和审查。

### 4. Separate instruction loading from script execution and enforce per-call mediation

文章展示了脚本执行前审批能力，并提醒示例 runner 仍需沙箱、资源限制、输入验证和日志。结合完全中介原则，对 AI Agent 的映射是**按风险平面分层授权**：
- **指令与参考读取平面（`load_skill` / `read_skill_resource`）**：主要风险是上下文膨胀与不可信外部技能包带来的间接提示注入；应通过来源信任分级、规范化后的路径归属校验（拒绝绝对路径与目录遍历，处理符号链接逃逸及检查后替换竞态；文档单跳引用本身不是安全边界）与按需披露控制；
- **代码与副作用执行平面（`run_skill_script` / 外部写入工具）**：主要风险是任意代码执行与困惑副手越权修改；必须置于独立安全边界内，结合**带外参数白名单校验（Per-Call Value Authorization）**、子进程沙箱、超时与资源配额、幂等键以及必要的人类审批（Human-in-the-Loop），绝不能仅凭模型生成了符合 Schema 的参数就用简单 `subprocess.run` 直接放行。

## What to preserve from the source

- Microsoft Agent Framework Python Skills 支持 file-based、class-based、inline/code-defined 三种技能形态，并可通过 `AggregatingSkillsSource`、`DeduplicatingSkillsSource`、`FilteringSkillsSource` 组合为统一 `SkillsProvider`。
- 历史 `raw/` 快照（2026-05-24 提取）中的 `require_script_approval=True` 是显式开启脚本执行审批的开关，不能据此推断 `load_skill`、`read_skill_resource` 也受该开关保护。
- 2026-11-02 核对的当前官方文章则说明：`load_skill`、`read_skill_resource`、`run_skill_script` 全部默认需要宿主审批；该段已不使用旧的 `require_script_approval` 参数。接入时应按实际 SDK 版本核对工具审批接口，不混用历史开关与当前默认行为。
- 官方示例仍明确提示：生产执行器不能只用简单 `subprocess.run(timeout=30)`，必须补沙箱（sandboxing）、资源限制（resource limits）、输入验证（input validation）和日志记录（logging）。

## What not to promote

- 不把 Microsoft Agent Framework 的具体 API、类名、装饰器顺序沉淀为 AI Agent 默认实现规范。
- 不把微软的 `require_script_approval` 或 `ScopeGate` 具体代码等价为当前 AI Agent 已部署的运行时机制；它们是架构设计与安全边界的外部参照。
- 不把示例脚本 runner 当作生产实践。
- 不从这些外部文献直接推广 active skill、runtime、MCP、cron、wrapper 或 AI Agent core 改动。

## `[推论]` Skill Provider 接入与安全治理四步检查表

在设计或审查多源 Skill 加载器与执行器时，可按以下四步逐层核对（重构方法见 [hermes-skill-refactoring-methodology](/concepts/hermes-skill-refactoring-methodology)）：

| 检查阶段 | 核心治理问题 | 常见配置缺陷 | 最小加固要求 |
| :--- | :--- | :--- | :--- |
| **1. 来源分级与命名空间** | 各 Skill 源的信任等级（核心内置 / 内部包 / 临时内联 / 外部仓库）是否显式区分？ | 用无告警的 `DeduplicatingSkillsSource` 直接拼接多源，导致低信任源静默遮蔽核心 Skill | 记录来源限定标识并检查重名冲突，不将带冒号前缀写入规范 `name`；临时 `InlineSkill` 明确生命周期并在正式包就绪后退役 |
| **2. 静态能力暴露过滤** | 当前 Agent 是否仅能看见完成本任务域所需的最小 Skill 子集？ | 把全库上百个 Skill 一次性注入同一 Agent 提示词 | 用显式白名单谓词 $P_{\text{allow}}(s, a)$ 裁剪可见池，降低上下文开销与扇出误路由 |
| **3. 动态逐次参数中介** | 技能触发脚本或外部写入时，是否校验具体参数值而非仅校验 JSON 类型？ | 认为通过 Pydantic / JSON Schema 校验就等于已获业务授权（Confused Deputy） | 对路径、目标账户、URL、金额/配额与幂等键执行带外策略（Out-of-Band Policy）校验与默认拒绝 |
| **4. 执行沙箱与人类审批** | `run_skill_script` 是否与纯文档读取隔离并具备回滚/审计能力？ | 在宿主机主进程或无限制 `subprocess.run` 中直接跑技能脚本 | 最小环境变量、文件系统只读/受限挂载、超时熔断、高风险动作前人类审批与完整执行轨迹记录 |

## Relations

- refines: [hermes-skill-refactoring-methodology](/concepts/hermes-skill-refactoring-methodology)
- depends_on: [hermes-context-layer-operating-rules](/concepts/hermes-context-layer-operating-rules), [hermes-memory-skills-wiki-boundaries](/concepts/hermes-memory-skills-wiki-boundaries)
- related: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense), [mcp-stateless-architecture-and-authorization-boundaries](/concepts/mcp-stateless-architecture-and-authorization-boundaries), [agent-skill-governance-and-reversible-state](/concepts/agent-skill-governance-and-reversible-state)

