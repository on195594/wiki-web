---
title: Agent Execution Sandboxing and Browser Isolation
created: 2026-11-24
updated: 2026-11-24
type: concept
tags:
  - agent
  - architecture
  - governance
  - risk-control
  - browser
  - linux
  - deployment
  - verification
sources:
  - https://builder.aws.com/content/3ADDWTtyI2gevtzY9d2vzULAxzS/secure-agent-sandboxes-on-eks
  - https://docs.docker.com/reference/cli/docker/checkpoint/
  - https://gvisor.dev/docs/user_guide/checkpoint_restore/
  - https://github.com/firecracker-microvm/firecracker/blob/main/docs/snapshotting/snapshot-support.md
  - https://arxiv.org/abs/2506.02456
  - https://arxiv.org/html/2512.12594v2
  - concepts/agent-security-architecture-and-prompt-injection-defense.md
  - concepts/agent-production-harness-and-cloud-runtime-boundaries.md
status: stable
volatility: medium
verified_at: 2026-11-24
review_by: 2027-03-24
description: 定义 AI Agent 代码执行隔离谱系（容器 / gVisor / Kata-Firecracker
  microVM、沙箱状态恢复、出口授权与代理层凭据注入）及浏览器/GUI Agent 视觉注入防御与 HTTP 语义沙箱边界。
aliases:
  - agent-execution-sandboxing
  - browser-agent-isolation
  - agent-sandbox-isolation
---

# Agent Execution Sandboxing and Browser Isolation

## Summary

本页是 [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense) 的架构子页，单点维护两类紧贴执行面与感知面的隔离边界：
1. **代码与脚本执行隔离（`ASI05`）**：当 Agent 在远程或共享节点执行不可信生成代码或外部 Skill 脚本时，标准容器共享宿主机内核，无法替代强隔离运行时；安全设计必须同时覆盖**内核隔离层级、沙箱状态恢复、出口授权与沙箱外代理层凭据注入**（对应主干页裁决矩阵中的 $I_{\text{iso}}$）。
2. **浏览器与 Computer-Use Agent 隔离**：截图感知型 CUA 与浏览器代理（BUA）将攻击面从纯文本扩展到视觉与已鉴权 Web 会话；仅按点击或键入授权难以判断实际副作用。应隔离高敏会话，并在能识别实际操作的协议或动作语义层授权；HTTP 中介只覆盖经其校验的站点操作（对应 $S_{\text{gui}}$）。

## 1. 代码执行隔离谱系与凭据代理边界（`ASI05`）

### 1.1 三类 Agent 部署形态与共享内核风险

参考 AWS Builder Center 的生产沙箱实践（Spirescu，2026-04，[*Secure Agent Sandboxes on EKS*](https://builder.aws.com/content/3ADDWTtyI2gevtzY9d2vzULAxzS/secure-agent-sandboxes-on-eks)），AI Agent 运行时存在三类典型形态，对应不同的隔离需求：
1. **纯 API 编排循环**：Agent 仅调用受控 API 而不执行任意代码，标准容器即可满足一般隔离要求；
2. **控制面与远程沙箱分离**：Agent 循环运行在常规容器内，将代码生成与命令执行派发至独立隔离沙箱（生产主流模式，衔接 [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries) 的控制面/执行面分离）；
3. **全栈沙箱内运行**：模型循环、编排与代码执行全部置于同一隔离沙箱内，会话结束即销毁。

对于后两类需要执行不可信代码的形态，标准 Linux 容器仅靠 namespaces 与 cgroups 提供进程与资源视图隔离，**所有容器仍共享同一宿主机内核**。例如 `CVE-2024-21626`（2024 年 `runc` 文件描述符泄漏容器逃逸漏洞）表明，容器内的内核级突破可波及同节点上的所有其他租户与工作负载。

### 1.2 隔离运行时选型对照：容器 vs. gVisor vs. Kata/Firecracker microVM

| 隔离层级 | 核心边界机制 | 性能与冷启动特征 | 检查点与恢复能力 | 适用场景与工程边界 |
| :--- | :--- | :--- | :--- | :--- |
| **标准容器（runc）** | Linux namespaces + cgroups（共享宿主机内核） | 极低开销、毫秒级启动 | 可借助 CRIU 做进程检查点与恢复（如 [Docker 的实验性支持](https://docs.docker.com/reference/cli/docker/checkpoint/)） | 仅限不执行任意代码的 API 编排循环，不得作为不可信代码安全沙箱 |
| **gVisor（用户态内核）** | 独立 `Sentry` 进程在用户态拦截并处理应用系统调用，阻断宿主机内核直接暴露 | I/O 密集负载约 **10–30%** 开销；LLM 等待占主导的 Agent 端到端开销 **`<5%`**；启动延迟极低 | [`runsc` 支持进程检查点与恢复](https://gvisor.dev/docs/user_guide/checkpoint_restore/)，不是整机快照 | 生产级通用代码沙箱起点（Modal 与 Claude Code 远程执行环境采用）；软件级而非硬件虚拟化边界 |
| **Kata Containers + Firecracker microVM** | 基于 KVM 与 Intel VT-x / AMD-V 的硬件虚拟化，每会话独立 Linux 访客内核（Firecracker VMM 约 **5 万行 Rust**，对比 QEMU 约 200 万行 C） | 通过 Kata 兼容层在 K8s/EKS 上冷启动约 **5 秒**（含 Pod 调度与 Kata 约 500ms–1s 转换层） | 上述 EKS 方案的 Kata 兼容层未暴露 Firecracker 原生快照 API | 高威胁多租户或强合规场景；EC2 `C8i/M8i/R8i` 嵌套虚拟化（2026-02 起）已免除裸金属刚性要求 |
| **直连 Firecracker 控制面** | 绕过 K8s Pod 语义转换层，直接编排 Firecracker microVM 与热池 | 托管平台（如 E2B、Vercel Sandbox）可实现 **`<1` 秒**创建 | [原生快照 API](https://github.com/firecracker-microvm/firecracker/blob/main/docs/snapshotting/snapshot-support.md)保存访客内存与 microVM 状态；磁盘文件需另外管理 | 需要频繁恢复沙箱、并行分叉或极低冷启的规模化 Agent 沙箱平台，但需自建或采购控制面 |

运行时支持检查点，不等于生产编排层对外提供该能力。恢复 microVM 快照也不会撤销已提交到外部 API 或数据库的写入；外部状态须由目标系统的事务或补偿机制处理。

### 1.3 隔离之外的两条硬边界：出口过滤与代理层凭据注入

单纯的内核隔离只限制“爆炸半径”，无法阻止沙箱内被注入的代码主动外泄数据或滥用凭据：
- **域名级出口过滤（Domain-Aware Egress）**：Agent 常需访问 LLM API、包仓库与代码托管服务，但标准 Kubernetes `NetworkPolicy` 无法按域名授权；生产沙箱可在出口侧默认拒绝，只放行必要的域名。域名白名单只约束目的地，不能阻止请求向获准服务发送私有数据；敏感数据外发还须在可信中介按端点、操作语义与请求字段授权。
- **沙箱外代理层凭据注入（Proxy-Level Credential Injection）**：任何在沙箱内可读的环境变量、文件或本地令牌，都会在提示注入下成为外泄目标。应将 API Key 与 OAuth 凭据保留在沙箱外部的受信任代理/网关层，由代理在核验请求目的地与策略后动态注入认证头（与 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 的 Code Mode 能力绑定及 [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary) 的 `ScopeGate` 互补）。注意代理注入虽大幅缩小明文密钥暴露面，但无法单独替代目的地白名单与参数授权。

## 2. 浏览器与 Computer-Use Agent 攻击面与 HTTP 语义沙箱

### 2.1 视觉提示注入（VPI）对纯文本防御的绕过

随着 Computer-Use Agents（CUA，通过屏幕截图控制桌面、终端与文件系统）与 Browser-Use Agents（BUA）的普及，仅依赖 HTML/DOM 解析的文本注入防御已不足以覆盖多模态感知面：
- **VPI-Bench 实证边界**：Cao、Lim 等（2025/2026-03 v2，[*VPI-Bench: Visual Prompt Injection Attacks for Computer-Use Agents*，arXiv:2506.02456](https://arxiv.org/abs/2506.02456)）构建了跨 5 个平台、包含 **306** 个动态交互用例的视觉提示注入基准，在网页中嵌入类似弹窗、聊天消息或系统通知的恶意视觉指令。实验表明，现有 CUA 与 BUA 均高度脆弱，攻击成功率（ASR）在 CUA 上最高达 **51%**、在 BUA 上高达 **100%**；即便是部分执行恶意子任务也足以造成文件删除或隐私外泄，且针对聊天越狱训练的守卫模型与现有截图级防护仍难以有效拦截。

### 2.2 语义鸿沟与 HTTP 层沙箱（ceLLMate）

在浏览器环境中，直接对底层 UI 原语（如点击坐标、键盘输入、滚动）编写安全策略极其脆弱——同一组点击在不同页面状态可能对应“浏览评论”或“创建全权限 Personal Access Token”。
- **ceLLMate 架构机制**：Meng 等（UC San Diego，[*ceLLMate: Sandboxing Browser AI Agents*，arXiv:2512.12594v2](https://arxiv.org/html/2512.12594v2)）将经 HTTP 请求传达的站点操作交由浏览器扩展按语义授权，包含三个阶段：
  1. **注册（Agent Sitemap）**：由站点开发者或受信任维护方提供 `Agent Sitemap`，将底层 HTTP 请求模式映射为高层语义动作（例如 `comment_issue` vs. `create_access_token`）；
  2. **策略实例化（Trusted-Context Policy Instantiation）**：仅基于可信上下文（用户原始任务 + 预定义策略描述，隔离不可信网页内容）自动挑选并绑定完成当前任务所需的最小站点权限子集；
  3. **HTTP 层强制中介**：在 Agent 专用会话内，由与具体 Agent 实现解耦的浏览器扩展校验 HTTP 请求，拒绝超出授权范围的站点操作。论文第 VII 节将 WebSocket 消息的通用语义校验留作未来工作；该机制也不覆盖本地文件等 GUI 副作用。
- **实证范围**：论文仅在 WASP 的两个 GitLab 任务上做了端到端防御验证。另行测得的网页导航延迟开销为 **7.25–15%**（100–300 条 sitemap 规则）；独立的策略选择基准上，前沿推理模型选择并实例化策略的总体准确率超过 **94%**。

## 3. `[推论]` 执行隔离与浏览器沙箱落地检查表

衔接 [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense) 的 $I_{\text{iso}}$ 与 $S_{\text{gui}}$ 门禁，在接入代码执行或浏览器自动化能力前按以下四项核对：

| 场景维度 | 核心风险 | 最小工程门禁 | 升级触发条件 |
| :--- | :--- | :--- | :--- |
| **本地 / 远程代码执行** | 容器逃逸（共享内核）、脚本越权访问宿主机文件 | 禁止在宿主机主进程或无限制 `subprocess` 中运行不可信代码；远程多租户起步采用 **gVisor** 等用户态内核隔离 | 需要硬件隔离或整机快照分叉时，评估 **Firecracker microVM** 与控制面的支持情况 |
| **沙箱凭据与网络出口** | 提示注入读取环境变量密钥或借网络出口外传私有数据 | 明文凭据留在沙箱外代理层注入；出口默认拒绝；对获准目的地的敏感请求另做操作与字段级授权 | 涉及高危资金/仓库写操作时叠加 `ScopeGate` 逐次参数白名单与人工审批 |
| **浏览器 / GUI 鉴权会话** | 视觉提示注入（VPI）或 DOM 注入劫持已登录 Cookie 执行高危写操作 | 为 Agent 分配独立浏览器 Profile，不复用人类日常全权限登录态；只读浏览与写操作分会话隔离 | 经 HTTP 的鉴权写操作按语义端点实施最小授权；其他有副作用的通道须单独授权，无法校验则不向 Agent 开放 |
| **状态恢复与取证** | 沙箱内失败后难以恢复现场；已提交的外部写入不会随沙箱恢复而撤销 | 沙箱状态从检查点恢复；高危外部写入由目标系统提供事务保证或补偿路径（见 [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification) 与 [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries)） | 需要高频并行试错时，再引入 microVM 快照分叉 |

## 证据边界与不推广事项

- 本文引用的 gVisor 开销（I/O 密集 10–30%、LLM 瓶颈型端到端 `<5%`）、Kata/Firecracker 冷启动（约 5 秒 vs. 直连 `<1` 秒）均来自 [AWS Builder Center（2026-04）](https://builder.aws.com/content/3ADDWTtyI2gevtzY9d2vzULAxzS/secure-agent-sandboxes-on-eks) 在 EKS 环境下的架构验证；实际延迟与资源成本取决于镜像体积、预热池规模与云平台实例类型，不作为跨环境固定阈值。
- [VPI-Bench](https://arxiv.org/abs/2506.02456) 核对范围为公开摘要与检索摘录。[ceLLMate v2](https://arxiv.org/html/2512.12594v2) 核对了第 V 节评估和第 VII 节限制（2026-11-24），未独立复现；`Agent Sitemap` 依赖站点方或第三方维护，不能默认任意公共网站都有可用规则。
- 本页提供沙箱与浏览器隔离架构选型参照，不授权自动修改现有本地容器、Kubernetes RuntimeClass、浏览器扩展或网络策略配置。

## Relations

- refines: [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense)
- depends_on: [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)
- related: [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary), [stateful-agent-environments-and-grounded-verification](/concepts/stateful-agent-environments-and-grounded-verification)
