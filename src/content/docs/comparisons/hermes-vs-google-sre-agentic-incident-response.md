---
title: Agent 事故响应接入：职责与安全边界
created: 2026-04-16
updated: 2026-11-27
type: comparison
tags:
  - agent
  - mcp
  - workflow
  - tool
  - comparison
  - devops
  - evaluation
  - risk-control
sources:
  - concepts/google-sre-gemini-cli-incident-response.md
  - concepts/agent-production-harness-and-cloud-runtime-boundaries.md
  - concepts/agent-autonomy-ladder-for-hermes-workflows.md
  - concepts/agent-security-architecture-and-prompt-injection-defense.md
  - concepts/typed-ai-agent-boundaries.md
  - concepts/agent-skill-provider-governance-boundary.md
  - concepts/stateful-agent-environments-and-grounded-verification.md
  - concepts/agent-pre-deploy-regression-and-trace-debugging.md
  - concepts/public-info-monitoring-automation-methodology.md
  - concepts/agent-failure-closed-loop-evaluation.md
  - concepts/hermes-knowledge-architecture.md
  - concepts/hermes-knowledge-base-operating-flow.md
  - https://openreview.net/pdf?id=3EXBLwGxtq
  - https://icml.cc/virtual/2025/poster/44303
  - https://huggingface.co/blog/ibm-research/itbench-aa
  - https://arxiv.org/html/2606.27154v2
  - https://arxiv.org/html/2506.02009v2
  - https://arxiv.org/html/2605.07161v2
  - https://arxiv.org/html/2607.04623v1
  - https://arxiv.org/html/2609.33023v1
  - https://arxiv.org/html/2610.00648v1
  - https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection
  - https://github.com/advisories/GHSA-wvxp-jp4w-w8wg
  - https://grafana.com/security/security-advisories/cve-2026-15583/
  - https://github.com/advisories/GHSA-wmg3-h8mf-wgvr
status: stable
volatility: medium
review_by: 2027-03-02
description: 结合 2025–2026 有状态 SRE 实证基准断崖、基础设施 MCP
  真实漏洞（I_log）、事务性不退化回退（R_undo）与持续浸泡门禁（G_soak），评估任意 Agent 接入生产事故响应的职责与安全边界。
aliases:
  - agent-incident-response-adoption
  - sre-agent-benchmarks-and-safety
verified_at: 2026-11-02
---

# Agent 事故响应接入：职责与安全边界

## Summary

评估任意 AI Agent 是否适合接入生产事故响应，不能看品牌宣传、接入的 MCP 工具数量或单次静态问答得分，而必须逐层核验**有界遥测取证、诊断到动作的有效性转换、不可信日志污点隔离、失败动作事务回退与持续负载浸泡验收**五项硬职责。本页对照 [google-sre-gemini-cli-incident-response](/concepts/google-sre-gemini-cli-incident-response) 的设计模式、2025–2026 年实时云运维基准（AIOpsLab、ITBench、OpenRCA 2.0、SREGym、R2Act、STRATUS、SRE-Marathon、Incident-Arena）及真实基础设施 MCP 安全公告，沉淀与特定产品解耦的准入裁决框架。

本页源于 2026-04-16 的产品对照讨论；文中产品与基准名称仅作证据溯源，不构成任何当前产品的生产能力背书或执行授权。

## 1. 证据范围与历史断言清理

- **来源案例与仓库边界**：[google-sre-gemini-cli-incident-response](/concepts/google-sre-gemini-cli-incident-response) 提炼受控 CLI 副驾模式；[Human and AI Agent Shared Knowledge Architecture](/concepts/hermes-knowledge-architecture) 与 [Shared Wiki Operating Flow](/concepts/hermes-knowledge-base-operating-flow) 定义本 Wiki 的公开知识分层。二者均不证明某一特定 Agent 实例已具备线上排障能力。
- **撤回无基准支撑的产品优劣判断**：早期版本曾将“工具更多”“缺少专用事故层”写成特定产品的静态事实，因缺乏同任务、同集群与同判分器下的可复验证据，已予撤回；以下工程门禁对所有自研或商用 Agent 一视同仁。

## 2. 2025–2026 有状态 SRE 基准揭示的两道能力断崖

为什么绝不能因为模型“看日志答对了故障题”就直接放开线上修复权限？2025–2026 年从静态问答转向实时 Kubernetes 集群评测的一手基准，定量揭示了前沿模型从**检测 → 因果定位 → 安全止血**的显著衰减：

| 评测基准（年份/会议） | 环境与任务规模 | 评测机制与判分标准 | 关键实证通过率与阶段断崖 |
| :--- | :--- | :--- | :--- |
| **[AIOpsLab](https://openreview.net/pdf?id=3EXBLwGxtq)**（MLSys 2025） | 实时 K8s 微服务（DeathStarBench / OTel Demo / TiDB），论文评测 48 题 | 四阶段精确匹配 + 集群健康工作负载终态验证 | `FLASH`（GPT-4-Turbo）：检测 **`100%`** → 定位@3 `61.54%` → RCA **`36.36%`** → 缓解 `54.55%`；`ReAct` 缓解仅 `36.36%` |
| **[ITBench](https://icml.cc/virtual/2025/poster/44303)** & **[ITBench-AA](https://huggingface.co/blog/ibm-research/itbench-aa)**（ICML 2025 / 2026） | 实时 K8s（42 项 SRE）及离线快照版 `ITBench-AA`（59 项 K8s SRE） | 拓扑感知匹配与告警清除；`ITBench-AA` 采用全召回门槛下的平均精度 | ICML 2025 实时 SRE 最高解决率仅 **`11.4%`**；2026 年 `ITBench-AA` 前沿模型约 `46%–56.2%`（过度探索至 83 轮反而因拉入伴随症状跌至 `30%`） |
| **[OpenRCA 2.0](https://arxiv.org/html/2606.27154v2)**（2026-06） | 500 个多模态故障实例（27 类混沌，均含 7.5 条因果传播边） | 结果指标（EM / `AnySvc`）+ **PAVE 因果过程监督**（路径可达率 / 边 F1） | 11 个前沿模型均值：`AnySvc` 命中 **`76.0%`**，但因果路径可达率降至 **`61.5%`**（`14.5` pp 无根据诊断缺口），全图精确匹配仅 **`20.7%`** |
| **[STRATUS](https://arxiv.org/html/2506.02009v2)**（NeurIPS 2025 / 2026） | 面向 AIOpsLab（$n=13$ 项缓解）与 ITBench（$n=18$ 项缓解）的多代理系统 | 基于严重度单调不增（$\mu(s_{\text{post}}) \le \mu(s_{\text{pre}})$）与 `A-Lock` 的**事务性不退化（TNR）撤销重试** | AIOpsLab（$n=13$）：无重试 `15.4%`（`2/13`）→ **无回退重试 `23.1%`（`3/13`）** → **TNR 先撤销再重试 `69.2%`（`9/13`）**；拦截 `10.5%` 永久挂起的交互式命令 |
| **[SREGym](https://arxiv.org/html/2605.07161v2)**（NeurIPS 2026） | 实时 K8s + MCP 工具栈，90 道高保真题（含 eBPF 底层磁盘错误与亚稳态故障） | 9 项清单诊断裁判（$\kappa=0.90$）+ 编程式集群状态缓解验证器；代理隔离混沌注入面防作弊 | 常规单故障端到端 `53.3%–60.7%`（加背景噪声降至 `40.2%–53.7%`）；**13 道底层/复合新故障暴跌至 `15.4%–28.2%`**（磁盘扇区错误特征识别 `0/9`） |
| **[R2Act](https://arxiv.org/html/2607.04623v1)**（2026-07） | Online Boutique K8s 集群 302 起经质量审计的故障（含 604 份无效方案标注） | 根因服务/类型准确率 vs. 受动作空间约束的**恢复方案有效率**与实时回放 | RAG 大模型 RCA 服务/类型准确率达 **`91.4%–100%`**，但恢复有效率仅 **`36.8%–60.3%`**；**即使 RCA 全对，仍有 `39.5%–62.0%` 选出无效操作**（DNS 故障回放恢复率 `0.0%`） |
| **[SRE-Marathon](https://arxiv.org/html/2609.33023v1)**（2026-09） | 90 分钟连续注入约 60 个重叠代码/配置/混沌故障（峰值 10–11 并发），19 个 MCP 工具 | `Marathon-Score`（关联 → 定位 → 修复，触犯禁令得分减半）与服务劣化率 | 最优方法告警关联 `77.5%`、定位 `49.1%`，但**故障活跃期修复率仅 `1.7%`**（全方法 $\le 2.4\%$）；多款代理劣化率达 **`124.3%–150.5%`**（越修越坏） |
| **[Incident-Arena](https://arxiv.org/html/2610.00648v1)**（2026-09） | 一次性 `k3s` 生产开源栈（Saleor / FrappeERP / 45 服务 Slack-spine），3,000 次试验 | 零 LLM 确定性 **Outcome Gate**（持续流量 SLI 浸泡）+ **Safety Gate**（重启持久性与允许配置白名单） | 最优池化 `Pass@1` 达 `59.0%`（单配置最高 `64.3%–65%`）；`1,948` 次失败互斥主因：**`21.9%`（`427` 例）越界修改白名单外配置项**、**`23.9%`（`466` 例）过早报捷**、**`26.5%`（`516` 例）重启后复发** |

上述实证确立了三条不可违背的接入前提：

1. **止血与完整 RCA 非对称解耦**：[SREGym](https://arxiv.org/html/2605.07161v2) 显示初始诊断错误时 Agent 仍有 `35.1%–58.8%` 概率靠通用状态恢复止血（诊断正确则升至 `69.0%–88.0%`）；反之 [R2Act](https://arxiv.org/html/2607.04623v1) 证明 `100%` 正确的粗粒度 RCA 标签仍因缺失前置条件、依赖端点与资源配额而在近半数情况下导出错误动作（`67.9%` 选错操作原语）。
2. **无回退重试会导致状态不可逆腐化（且须防范非持久化故障假阳性）**：[STRATUS](https://arxiv.org/html/2506.02009v2) 证实，失败的缓解尝试（如创建带错误不可变 `provisioner` 的 K8s `StorageClass`）会污染集群状态并锁死后续修复，自动重试必须以忠实逆操作（`Faithful Undo`）与资源互斥锁（`A-Lock`）为前提；同时其附录 C 披露在 `ITBench`（$n=18$）上有无回退均为 `50.0%`（`9/18`），原因是其中 `8/18` 例仅靠重启 Pod 即抹除了非持久化的混沌注入——这也反证终态验收必须核查重启持久性。
3. **调高推理预算无法替代终态浸泡校验**：[Incident-Arena](https://arxiv.org/html/2610.00648v1) 对 2,400 次运行的消融表明，将模型推理档位从 `low` 拉满至 `max` 仅使池化 `Pass@1` 变动 `+4.6` 个百分点（`39.2% → 43.8%`，跨 20 题 95% 任务自助法置信区间 `[-4.8, +13.8]` pp 横跨零点、无统计显著性），却使单次成本升至 `2.3x`；在具备有效动作记录的 `2,967` 次运行中，`1,638` 次（`55%`）写出了完整修复，但其中高达 `41%`（`672/1,638`）最终失败——`340` 例仅倒在未等队列排空便提前退出（Outcome Gate），`329` 例倒在修好后继续改动导致**自我推翻（Self-Undo）**或越界写入（在全部 `439` 次越界修改记录中，`261` 次误改无关子系统、`70` 次误改邻近键、`57` 次推超安全阈值、`51` 次触碰受保护的 PostgreSQL 服务端配置）。此外，早期基准若把混沌注入 Pod 暴露在同一集群内，还会诱发删除注入器的奖励黑客捷径（[SREGym 附录 B](https://arxiv.org/html/2605.07161v2)；防篡改验证总则见 [agent-self-validation-loops](/concepts/agent-self-validation-loops) 关联的 [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification)）。

## 3. 运维遥测流的间接提示注入与 MCP 困惑副手攻击面（`I_log`）

事故响应 Agent 天然处于 [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense) 所定义的**“致命三角”高危交汇点**：它同时读取高权限内部监控/集群配置（私有数据）、摄取外部用户流量产生的访问日志与异常堆栈（不可信外部输入），并连接运维控制面或工单外发工具（高危动作/外发通道）。[英国国家网络安全中心（NCSC，2025-12）](https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection)明确指出，LLM 因缺乏指令与数据的底层分离而属于**天生易混淆副手（Inherently Confusable Deputy）**，无法靠输入黑名单根治，必须在模型外实施权限降级与确定性拦截。

2025–2026 年披露的三起真实可观测性与 Kubernetes MCP 安全漏洞直接印证了这一威胁：

- **恶意 Pod 日志间接提示注入与字符串 Shell 拼接（[CVE-2025-66404 / GHSA-wvxp-jp4w-w8wg](https://github.com/advisories/GHSA-wvxp-jp4w-w8wg)，CVSS 6.4）**：npm 包 `mcp-server-kubernetes`（`<= 2.9.7`，`2.9.8` 修复）的 `exec_in_pod` 同时接受字符串与数组参数，**当传入字符串时**直接用 `/bin/sh -c` 包装引发 Shell 元字符命令注入；同时官方公告 PoC 证明，攻击者可控容器只需向标准输出打印伪装成排障指引的恶意日志，即可诱导缺乏人工确认门禁的 MCP 客户端调用 `exec_in_pod` 在目标容器内执行任意命令（注：属跨 Pod 容器内命令执行，非 MCP 宿主机代码执行）。
- **监控网关请求头困惑副手 SSRF 与凭据外泄（[CVE-2026-15583](https://grafana.com/security/security-advisories/cve-2026-15583/)，CVSS 8.6）**：`mcp-grafana`（`< 0.17.1`）信任未鉴权请求传入的 `X-Grafana-URL` HTTP 头覆盖目标实例地址，并自动附带服务端环境变量配置的 Grafana 服务账户令牌发起请求，导致高权限令牌向攻击者服务器外泄并可探测内网与云元数据服务（IMDS）。
- **诊断与删除工具前导短横线参数注入（[CVE-2026-61459 / GHSA-wmg3-h8mf-wgvr](https://github.com/advisories/GHSA-wmg3-h8mf-wgvr)，CVSS 9.3）**：Python/pip 包 `mcp-server-kubernetes`（`< 3.9.0`，与上述 npm 包分属不同发行包）在 `kubectl_get`、`kubectl_describe` 与 `kubectl_delete` 中未拦截 `resourceType` 或 `name` 以 `-` 开头的参数，绕过 `assertNoDangerousFlags` 黑名单注入 `--server=https://attacker.com`，直接将宿主机 `kubeconfig` 的集群 Bearer Token 发送给外部恶意端点。

## 4. 按设计职责对照与四阶段参数化准入矩阵

| 职责维度 | Google 来源案例描述 | 任意 Agent 接入生产前必须验证的工程契约 `[推论]` |
| :--- | :--- | :--- |
| **目标与停止条件** | 优先缓解用户受损（缩短 MTTM），再追根因与复盘 | 区分止血原语与完整 RCA；修复后强制执行持续流量浸泡校验（`G_soak`），达标即冻结写权限防自我推翻 |
| **遥测与上下文边界** | 以结构化分析工具串联指标、日志与告警上下文 | 强制算子下推（`Q_push`）与异常摘要句柄；禁止将 GB 级原始日志或裸 SQL/PromQL 直接暴露给规划模型 |
| **动作空间与可逆性** | 将重启、回滚、切流、扩容收敛为有限通用缓解集 | 禁用自由 Shell、管道与交互式 `-it` 标志；可逆动作绑定前置快照与 `R_undo` 事务不退化回退 |
| **注入隔离与参数授权** | 确定性工具、风险分级、策略拦截、人工批准与审计 | 将日志/异常文本视为低完整性污点源（`I_log`）；宿主侧执行 `ScopeGate` 参数白名单、禁止前导 `-` 注入与动态 URL 覆盖 |
| **外部连接与控制面** | 通过 MCP 接入监控栈，用自定义命令固化团队流程 | 优先复用最小权限只读凭据，跨进程追踪走 `params._meta` 带外传播（[agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging)），控制面与待修集群故障域解耦 |
| **复盘与知识沉淀** | 自动辅助生成修复代码、无责复盘与后续事项 | 私有事故时间线、监控快照与集群拓扑留在内部系统；仅脱离实例仍成立的通用模式经 [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow) 入库 |

### `[推论]` 事故响应四阶段控制流与安全裁决矩阵（`Q_push / I_log / R_undo / G_soak`）

结合 [agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows) 的阶段非对称授权（LOA）、[agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries) 的柔性长事务枢轴边界（$T_{\text{pivot}}$）与代际令牌隔离、[agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary) 的 `ScopeGate` 逐次参数校验、[agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense) 的污点隔离及 [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification) 的权威终态回读，先显式锁定四个门禁参数的类型化前置条件与命名空间边界：

- **`Q_push`（确定性遥测下推不变量）**：$\text{Bytes}(\text{obs}_{\text{model}}) \le B_{\text{obs}} \land \text{RawQueryExposed} = \texttt{false}$，即模型仅接收聚合异常表与快照句柄，不直接接触 GB 级原始日志流或无界 SQL/PromQL。
- **`I_log`（运维遥测污点隔离标签）**：将日志、异常堆栈与外部请求载荷统一标定为不可信输入 $\text{int}(x) = \texttt{untrusted}$（作为 [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense) 与 [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops) 中通用防洗白污点不变量 $I_{\text{taint}}$ 在运维遥测域的具象实例），未经宿主侧 `ScopeGate` 白名单校验，严禁流入工具命令字、前导 `-` 标志或目标服务端点。
- **`R_undo`（有界事务性不退化回退契约）**：仅对具备忠实逆操作 $U(s_{\text{post}}) = s_{\text{pre}}$ 且满足写入资源互斥锁 $\mathcal{R}(a_k) \cap \mathcal{R}_{\text{locked}} = \emptyset$（`A-Lock`）与步数上限 $1 \le k \le K$ 的可逆缓解动作定义自动重试——当 $s_{\text{post}} \ne \bot \land \mu(s_{\text{post}}) \le \mu(s_{\text{pre}})$（严重度单调不增，允许中间准备步维持 $\mu$ 不变）时保留该步并由独立健康预言机判定是否止血完成；若确认本次写入已生效且严重度上升，则执行 $U$，回读确认恢复前态后再切换候选。超时或报错不等于写入失败：后态未知时须持锁核对操作终态与资源状态。确认操作已终止且未写入则跳过撤销；确认已生效则按上述严重度规则处理；仍无法确认则停止自动写入并转人工。**不存在忠实逆操作的动作属于不可逆枢轴事务 $T_{\text{pivot}}$，严禁进入自动重试回路。**
- **`G_soak`（持续流量浸泡与重启持久性门禁）**：$\forall t \in [t_{\text{done}}, t_{\text{done}} + \Delta_{\text{soak}}],\; \text{SLI}(t) \in \mathcal{S}_{\text{ok}} \land \text{PersistAfterRestart} = \texttt{true}$，两项确定性门禁同时通过后立即吊销当前排障会话的写令牌（防止画蛇添足触发 `Self-Undo`）。

任意 Agent 接入生产事故响应须逐阶段通过以下四道门禁：

| 事故响应阶段 | 允许的控制流自主度（LOA） | 形式化安全契约与工具边界（`Q_push / I_log / R_undo / G_soak`） | 拦截的典型生产故障与实证对应 |
| :--- | :--- | :--- | :--- |
| **1. 告警触发与有界取证（Paging & Triage）** | 信息获取与分析高只读自主度（$L_{\text{acq}}, L_{\text{anal}} \in \{7,8,9\}$） | 由 SLO 多窗口燃烧率或高 $\text{PPV}$ 监控门禁（[public-info-monitoring-automation-methodology](/concepts/public-info-monitoring-automation-methodology)）触发；执行 **`Q_push` 遥测下推**与 **`I_log` 污点隔离**：仅暴露无 Shell 拼接、禁前导 `-` 参数（防 `CVE-2026-61459`）与固定服务端点的只读摘要工具 | 告警风暴耗尽算力、`71.2%` 原始遥测解释幻觉、HTTP 200 静默截断编造（[agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging)）或只读诊断泄露集群 Token |
| **2. 缓解方案收敛（Playbook Selection）** | 决策收窄（$L_{\text{dec}} \in \{3,4\}$，输出闭集候选） | 按 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 将动作约束在预定义闭集枚举与强类型参数 Schema 内；隔离日志解析器与特权动作选择器，阻断日志文本直接填充命令实参（防 `CVE-2025-66404`） | `R2Act` 中正确 RCA 仍选出 `39.5%–62.0%` 无效操作、`STRATUS` 中 `10.5%` 交互式挂起命令，或恶意 Pod 日志诱导跨容器命令执行 |
| **3. 枢轴审批与不退化执行（Approval & TNR Exec）** | 人工/策略门批准后执行（$L_{\text{act}} = 5$） | 无忠实逆操作的不可逆枢轴事务 $T_{\text{pivot}}$ 强制人工审批与 `ScopeGate` 作用域白名单校验；可逆操作在 `A-Lock` 下执行 **`R_undo` 事务不退化契约**（提交条件 $\mu(s_{\text{post}}) \le \mu(s_{\text{pre}})$，仅对已生效且使严重度恶化的写入回退；结果未知则持锁回读，无法确认时停止自动写入并转人工）及代际令牌隔离（$g_{\text{req}} \ge g_{\max}$） | 推送期盲目回滚引发级联故障、无回退重试污染不可变资源（AIOpsLab $n=13$ 上 `23.1%` vs `69.2%`），或 `Incident-Arena` 中 `21.9%` 越界修改白名单外配置项 |
| **4. 浸泡回读与复盘闭环（Soak Readback & Postmortem）** | 确定性双门禁校验 + 人工复盘审查 | 执行 **`G_soak` 持续流量浸泡与重启持久性门禁**：验证持续负载窗口 $\Delta_{\text{soak}}$ 内短窗燃烧率复位、队列排空与组件重启后不复发，达标即刻收回写令牌；复发失效按 [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation) 转为确定性回归工件 | 将命令返回 `exit 0` 等同于业务恢复、`Incident-Arena` 中实时 SLI 仍越界时过早报捷（`23.9%`）、重启后复发（`26.5%`）、修好后继续改动自我推翻（`329/672`），或将私有生产状态写入公共 Wiki |

## 5. 接入前最小核对步骤

1. **隔离只读演练**：先在影子或只读副本上验证 `Q_push` 遥测工具在 2 GB+ 故障窗口下的上下文消耗与 HTTP 200 截断报错行为，禁止直接绑定集群写凭据。
2. **审计工具参数与网络出口**：逐一检查所有运维 MCP/CLI 封装是否硬编码目标服务端点（防 `CVE-2026-15583`）、使用参数数组并拒绝前导 `-` 标志（防 `CVE-2026-61459`）、剔除 `/bin/sh -c` 与交互式阻塞参数（防 `CVE-2025-66404`）。
3. **验证回退与浸泡验证器**：在预发混沌环境中注入单点与并发故障，确认每类闭集动作均具备可验证的逆操作（`R_undo`）以及零 LLM 参与的 SLI 浸泡与重启持久性判分器（`G_soak`）。
4. **守住公私知识边界**：真实事故时间线、监控原始快照、受影响客户与内部拓扑留在获授权的内部事故系统；仅脱敏后的通用工程原则按 [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow) 沉淀入库。

## 证据边界与不推广事项

- 表中各基准通过率受其微服务规模（多为 9–64 个服务，远小于超大规模生产网格）、故障注入方式与判分器约束，代表能力上界而非生产 SLA 承诺；2026-11-27 在线核对了上述论文公开页面与官方安全公告，不代表已在本地复跑集群基准，亦不刷新本页既有页面级 `verified_at`（`2026-11-02`）。
- 本页不提供任何产品的当前命令语法或自动放行授权；任何线上写操作均须服从目标系统的现行变更管理与值班审批制度。

## Relations

- depends_on: [google-sre-gemini-cli-incident-response](/concepts/google-sre-gemini-cli-incident-response), [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries), [agent-autonomy-ladder-for-hermes-workflows](/concepts/agent-autonomy-ladder-for-hermes-workflows), [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense)
- related: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary), [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification), [agent-pre-deploy-regression-and-trace-debugging](/concepts/agent-pre-deploy-regression-and-trace-debugging), [public-info-monitoring-automation-methodology](/concepts/public-info-monitoring-automation-methodology), [agent-failure-closed-loop-evaluation](/concepts/agent-failure-closed-loop-evaluation), [agent-self-validation-loops](/concepts/agent-self-validation-loops), [agent-experience-consolidation-loops](/concepts/agent-experience-consolidation-loops), [hermes-knowledge-architecture](/concepts/hermes-knowledge-architecture), [hermes-knowledge-base-operating-flow](/concepts/hermes-knowledge-base-operating-flow), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow)

