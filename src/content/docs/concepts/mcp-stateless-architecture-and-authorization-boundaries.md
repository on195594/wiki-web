---
title: MCP 无状态架构与授权安全边界
created: 2026-11-25
updated: 2026-11-25
type: concept
tags:
  - agent
  - mcp
  - tool
  - architecture
  - governance
  - risk-control
  - verification
sources:
  - https://modelcontextprotocol.io/specification/2026-07-28
  - https://blog.modelcontextprotocol.io/posts/2026-07-28/
  - https://modelcontextprotocol.io/specification/2026-07-28/changelog
  - https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http
  - https://modelcontextprotocol.io/specification/2026-07-28/server/tools
  - https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization
  - https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices
  - https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation
  - https://modelcontextprotocol.io/seps/2577-deprecate-roots-sampling-and-logging
  - https://modelcontextprotocol.io/seps/2663-tasks-extension
  - https://tasks.extensions.modelcontextprotocol.io/specification/2026-07-28/tasks
  - https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
  - https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/3398-release-cycle-updates.md
  - https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/3502
  - https://modelcontextprotocol.io/registry/about
  - concepts/hermes-agent-workflow-layering-and-adoption-order.md
  - concepts/typed-ai-agent-boundaries.md
  - concepts/agent-skill-provider-governance-boundary.md
  - concepts/agent-security-architecture-and-prompt-injection-defense.md
status: stable
volatility: medium
verified_at: 2026-11-25
review_by: 2027-03-25
description: 定义 MCP 2026-07-28 无状态逐请求架构、server/discover 双时代探测、MRTR 交互、不可信工具注解原则与
  OAuth 2.1（RFC 9728 / 8707 / 9207 / CIMD、严禁令牌透传与状态句柄主体绑定）安全边界。
aliases:
  - mcp-stateless-architecture
  - mcp-authorization-boundaries
  - model-context-protocol-2026
---

# MCP 无状态架构与授权安全边界

## Summary

本页作为知识库中 `mcp` 核心标签的主维护页，集中定义 Model Context Protocol（MCP）在**纵向“Agent ↔ 外部工具/资源”接入层**的传输模型、交互原语、元数据信任边界与多租户授权规范。它细化 [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order) 的实时外部能力层，并与 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)、[agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary)、[agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense) 及横向对比页 [agent-tool-and-interoperability-paradigms](/comparisons/agent-tool-and-interoperability-paradigms) 构成单点正交分工。

核心架构结论：
- **从有状态会话转向逐请求无状态执行**：[MCP 2026-07-28 正式规范](https://modelcontextprotocol.io/specification/2026-07-28)（及[官方发布说明](https://blog.modelcontextprotocol.io/posts/2026-07-28/)）移除了 `initialize` 握手、`Mcp-Session-Id` 会话头与 SSE `Last-Event-ID` 断点续传，将 [Streamable HTTP](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http) 收敛为仅接受 `POST` 的无状态请求流，新增必选探测端点 `server/discover` 与边缘路由校验头。
- **反向交互解耦与客户端重原语弃用**：服务端发起的二次确认由基于标准请求—响应周期的 **MRTR（Multi-Round Tool Execution，`InputRequiredResult`）** 替代，正式弃用 `Sampling`、`Roots` 与 `Logging`（[SEP-2577](https://modelcontextprotocol.io/seps/2577-deprecate-roots-sampling-and-logging)），并将长程异步任务拆分至独立扩展 [io.modelcontextprotocol/tasks（SEP-2663）](https://modelcontextprotocol.io/seps/2663-tasks-extension)。
- **零信任注解与 OAuth 2.1 强制边界**：来自未验证服务端的 `ToolAnnotations` 一律视为不可信提示并采取悲观默认值；远程多租户接入以 OAuth 2.1 + PKCE `S256` + [RFC 9728 PRM / RFC 8707 受众绑定 / RFC 9207 `iss` 校验 / CIMD](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) 为硬基线（弃用 DCR `RFC 7591`），严禁将客户端令牌直接透传给下游 API，且跨步工具状态句柄必须与已鉴权用户主体密码学绑定。

## 1. 从有状态握手到逐请求无状态架构（2025-11-25 vs. 2026-07-28）

早期 MCP HTTP 传输依赖服务端内存维护会话生命周期，在水平扩缩容网关、Serverless 冷启动与负载均衡转发下易产生会话粘滞失败与状态不同步。[2026-07-28 Changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog)（含 `SEP-2575`、`SEP-2567`、`SEP-2322`、`SEP-2243`）完成了向云原生无状态模型的切换：

| 协议维度 | 旧版握手期（2025-11-25） | 现代无状态规范（2026-07-28 稳定版） | 工程影响与兼容要点 |
| :--- | :--- | :--- | :--- |
| **能力发现与生命周期** | 有状态 `initialize` → `notifications/initialized` 握手；连接级状态协商 | 无握手、无会话对象；每次请求在 `_meta` 携带客户端能力，服务端必选实现无状态 `server/discover` | [双版本客户端按传输探测](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning)：stdio 先发 `server/discover`，遇到非现代错误或超时再回退；HTTP 可直接发送现代请求，遇到 `400` 先检查响应体。可识别的现代版本错误应改用双方支持的版本重试，而非回退至 `initialize` |
| **Streamable HTTP 传输** | 支持 `POST`、`GET`（独立 SSE 监听流）、`DELETE`（销毁 `Mcp-Session-Id`）及 `Last-Event-ID` 续传 | **仅接受 `POST`**（`GET` 与 `DELETE` 必须返回 `405 Method Not Allowed`）；移除会话头与断线流续传（[Streamable HTTP](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http)） | 任意网关实例可无粘滞转发请求；`POST` 响应按需返回 `application/json` 或单次请求作用域内的 `text/event-stream` |
| **网关级请求路由头** | 仅协议版本与会话标识，网关需解析 JSON-RPC 请求体才能按工具限流 | 请求携带 `MCP-Protocol-Version` 与 `Mcp-Method`；仅 `tools/call`、`resources/read`、`prompts/get` 必须携带 `Mcp-Name`；头与正文不一致返回 `-32020 HeaderMismatch` | 反向代理与安全网关无需反序列化大体积 JSON 即可按方法与工具名执行路由、审计与配额拦截 |
| **服务端反向交互** | 依赖持久双向流向客户端发起 `sampling` / `roots` / `elicitation` 请求 | 改为 **MRTR（`SEP-2322`）**：`tools/call` 返回 `InputRequiredResult` 挂起，客户端收集输入后再次 `POST` 恢复 | 消除服务端主动回调客户端的网络穿透与长连接保持开销 |
| **客户端原语与异步任务** | 核心规范内置 `Sampling`、`Roots`、`Logging` 与实验性 `Tasks` | [SEP-2577](https://modelcontextprotocol.io/seps/2577-deprecate-roots-sampling-and-logging) 正式弃用 `Sampling / Roots / Logging`；异步任务迁入扩展 [io.modelcontextprotocol/tasks](https://tasks.extensions.modelcontextprotocol.io/specification/2026-07-28/tasks) 且移除枚举端点 `tasks/list` | 缩小核心客户端攻击面；移除 `tasks/list` 防止多租户环境下跨调用方枚举未授权任务标识 |
| **工具列表缓存元数据** | 无标准缓存过期与凭据隔离声明 | [Tools 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) 为 `tools/list` 新增 [`ttlMs` 与 `cacheScope`](https://modelcontextprotocol.io/specification/2026-07-28/server/utilities/caching)（`public` 或 `private`） | 按用户权限动态裁剪工具集的服务端必须声明 `cacheScope: "private"`，缓存仅可在同一授权上下文内复用 |

在治理演进节奏上，[SEP-3398](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/3398-release-cycle-updates.md) 确立了每年 3 月与 9 月的固定半年发布周期（下一目标版本窗口为 2027 年 3 月底）；[Official MCP Registry](https://modelcontextprotocol.io/registry/about) 采用反向 DNS 命名空间（如 `io.github.<owner>/<server>`）作为公开元数据目录，仅存储指向外部软件包与服务端点的元数据指针而不直接托管可执行包；服务端暴露渐进式技能资产的扩展（[Skills WG Discussion #3502](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/3502)）于 2026-10-27 进入 Beta 阶段，核心规范仍保持工具、资源与提示三原语不变。

## 2. 反向交互、敏感输入隔离与不可信工具注解边界

### 2.1 Elicitation 双模式与敏感凭据隔离

当外部工具执行中途缺少非推断性业务参数或需用户授权时，[MCP Elicitation 规范](https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation)严格区分两类交互通道：
1. **Form Mode（结构化表单模式）**：仅限平铺原始类型的 JSON Schema，用于在宿主界面内向用户收集非敏感业务参数（如目标分支名、筛选日期范围）。规范**严禁通过 Form Mode 索取密码、API 密钥、个人身份敏感信息或支付凭据**，防止恶意或被劫持的 MCP Server 借宿主原生表单实施钓鱼窃密。
2. **URL Mode（带外浏览器跳转模式）**：凡涉及敏感凭据录入、第三方服务 OAuth 授权或支付确认，服务端必须返回跳转 URL，引导用户在宿主受控上下文之外的独立系统浏览器会话中直接与权威服务端交互，确保凭据永不经过模型上下文与客户端消息历史。

### 2.2 `ToolAnnotations` 的不可信假设与悲观默认值

[MCP Tool Annotations 指南](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/)与 [Tools 规范](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)定义了四项行为提示字段，同时明确规定：**除非服务端来自经过密码学签名或组织级白名单审计的受信任源，否则所有工具注解均视为不可信提示（Untrusted Hints）**。宿主在缺省或面对未验证源时必须采用悲观默认：

- `readOnlyHint`（默认 `false`）：即使外部工具自称 `readOnlyHint: true`，宿主也不得据此自动跳过首次外发审查或放宽出口域名限制；
- `destructiveHint`（默认 `true`）：只要非只读，未显式验证前默认按破坏性写操作实施人工确认或策略拦截；
- `idempotentHint`（默认 `false`）：默认不可安全盲目重试，超时异常须先回读远端权威状态（衔接 [agent-production-harness-and-cloud-runtime-boundaries](/concepts/agent-production-harness-and-cloud-runtime-boundaries) 的模糊结果先取证原则）；
- `openWorldHint`（默认 `true`）：默认工具输出受开放外部世界不可信输入影响，返回值进入主上下文前须纳入间接提示注入防御面（见 [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense)）。

同时，工具定义中的 `description`、`inputSchema` 与 `outputSchema` 仍面临描述投毒与批准后静默篡改（Rug Pull）威胁；宿主与网关须对已审工具的完整 Schema 计算内容指纹，发生漂移即冻结自动调用并触发重审（见 [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary)）。

## 3. OAuth 2.1 规范化鉴权、令牌防透传与状态句柄绑定

### 3.1 远程 MCP 强制授权链与 DCR 弃用

针对远程 HTTP MCP Server，[MCP Authorization 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) 以 OAuth 2.1 为基础收紧了发现、注册与令牌绑定闭环：

1. **受保护资源元数据发现（RFC 9728 PRM）**：未认证请求收到 `401 Unauthorized` 与 `WWW-Authenticate` 头后，若质询含 `resource_metadata`，客户端读取该参数指定的 URL；否则按资源 URI 进行 RFC 9728 well-known 发现。从资源元数据读取归属授权服务器（AS）列表；再经 RFC 8414 或 OpenID Connect Discovery 读取 AS 元数据。
2. **弃用动态客户端注册（DCR），转向客户端 ID 元数据文档（CIMD）**：由于传统 `RFC 7591` DCR 在开放生态中易导致垃圾客户端注册洪泛、孤儿凭据堆积与预注册门槛冲突，规范**正式弃用 DCR**，推荐以 HTTPS URL 形式的客户端元数据文档直接作为 `client_id`（CIMD），实现零预协商的去中心化客户端身份核验。
3. **PKCE `S256`、RFC 8707 受众绑定与 RFC 9207 防混淆**：所有授权码流程必须强制启用 PKCE（`code_challenge_method=S256`）；客户端在授权与换票请求中必须通过 RFC 8707 `resource` 参数显式绑定目标 MCP Server 的规范 URI，服务端逐请求严格校验访问令牌的 `aud`（Audience）声明仅指向自身；同时强制执行 RFC 9207 授权响应 `iss` 参数校验，阻断多授权服务器环境下的令牌混淆攻击（Mix-Up Attack）。

### 3.2 严禁令牌透传（No Token Passthrough）与跨步状态句柄绑定

[MCP Security Best Practices 2026-07-28](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) 明确划定了两条高频工程红线：

- **禁止令牌透传（Token Passthrough Anti-Pattern）**：MCP Server **绝对不得**接收客户端传入的上游服务令牌并直接原样转发给下游 API。透传会使下游系统将请求误判为客户端直连，绕过 MCP 层的独立速率限制、最小作用域收窄与审计归因，构成典型的困惑副手（Confused Deputy）漏洞（见 [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary)）。若 MCP Server 需代表用户访问下游受保护资源，必须凭自身客户端身份通过独立令牌或 OAuth 2.0 令牌交换（RFC 8693 OBO）获取专门面向下游受众的新令牌。
- **无状态模式下的状态句柄主体绑定**：移除 `Mcp-Session-Id` 后，多步工作流（如分页游标、草稿事务 ID、MRTR 恢复令牌或 `io.modelcontextprotocol/tasks` 任务句柄）改由显式工具参数传递。服务端**必须将状态句柄与当前已鉴权主体绑定**（例如存储校验映射 `<principal_id>:<high_entropy_handle>` 或签名绑定声明），在每次 `POST` 调用时核验调用方身份与句柄所有者一致，防止攻击者通过猜测或提示注入替换句柄实施越权读写（IDOR）。

## 4. `[推论]` MCP 接入与网关安全门禁清单

结合上述规范条款与 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)、[agent-execution-sandboxing-and-browser-isolation](/concepts/agent-execution-sandboxing-and-browser-isolation) 的隔离约束，生产环境接入外部或自建 MCP Server 时可按四项参数门禁逐条核验：

| 门禁参数 | 核验问题 | 最小工程通过条件 | 阻断或降级动作 |
| :--- | :--- | :--- | :--- |
| **`V_proto`**<br>传输与路由头一致性 | 网关与服务端是否对齐无状态传输与头部校验？ | 优先支持 `2026-07-28` 单 `POST` 模式与 `server/discover`；网关核对 `Mcp-Method`；仅对上述三个具名方法要求并核对 `Mcp-Name`。不得跨授权上下文复用 `cacheScope: "private"` 的响应 | 头与正文失配立即按 `-32020` 拦截；旧版 `2025-11-25` 服务纳入独立有状态连接池隔离 |
| **`A_aud`**<br>受众绑定与防透传 | 访问令牌是否专属于当前 MCP Server 且未透传？ | 强制 PKCE `S256`、RFC 8707 `aud` 精确匹配当前 Server URI 与 RFC 9207 `iss` 校验；下游调用采用代理层独立凭据或换票 | 发现缺失 `aud` 校验或直接转发上游 Bearer 令牌的服务端，禁止进入多租户生产环境 |
| **`H_bind`**<br>跨步句柄主体隔离 | 分页、MRTR 或异步任务句柄能否被跨用户冒用？ | 所有跨请求句柄采用高熵随机值并与已鉴权 `sub / user_id` 强绑定；禁止暴露全局 `tasks/list` 枚举接口 | 未绑定主体的裸自增 ID 或可预测游标一律拒绝上线 |
| **`T_trust`**<br>元数据冻结与参数门禁 | 工具描述、注解与高危调用参数是否经过独立校验？ | 锁定已审工具 Schema 指纹防 Rug Pull；未验证源忽略 `readOnlyHint: true` 豁免；高危写操作叠加 `ScopeGate` 带外参数值白名单 | Schema 哈希漂移或 Form Mode 索取凭据时立即熔断该 Server 并告警 |

## Anti-patterns

- 在 2026 无状态网关后继续假设所有请求共享同一进程内存会话，或允许负载均衡器跨授权上下文复用 `cacheScope: "private"` 的 `tools/list` 响应。
- 为省去后端换票逻辑，让宿主把用户的云平台或代码仓高权限令牌直接塞入 MCP 请求头透传给第三方 Server。
- 轻信外部 Server 自报的 `readOnlyHint: true` 而豁免沙箱出口限制、人工审批或参数级 `ScopeGate` 校验。
- 通过 Elicitation 的 Form Mode 弹窗收集 API Key、数据库口令或个人隐私凭据。
- 在移除 `Mcp-Session-Id` 后，用未绑定用户身份的顺序编号充当草稿句柄或异步任务 ID。

## 证据边界与不推广事项

- **核验范围与日期**：本页涉及的 MCP `2026-07-28` 传输、工具、鉴权、Elicitation、安全最佳实践及 `SEP-2577` / `SEP-2663` / `SEP-3398` 条款均于 `2026-11-25` 直接核对自 `modelcontextprotocol.io` 官方规范文档与 GitHub 规范仓库。
- **演进窗口边界**：`SEP-3398` 规划的 2027 年 3 月底下一发布窗口及 Skills WG（`Discussion #3502`）Beta 扩展仍处于演进中，后续版本合入情况需在 `review_by` 窗口复核，不能将 Beta 讨论稿等同于核心冻结规范。
- **非执行授权声明**：本页沉淀跨项目通用的协议架构与安全准入准则，不表示特定宿主环境已完成上述全部网关改造，也不构成修改线上认证服务、防火墙或外部 MCP 配置的执行授权。横向选型（何时用 CLI、Skills、Code Mode 或 A2A 替代直连 MCP）见 [agent-tool-and-interoperability-paradigms](/comparisons/agent-tool-and-interoperability-paradigms)。

## Relations

- refines: [hermes-agent-workflow-layering-and-adoption-order](/concepts/hermes-agent-workflow-layering-and-adoption-order)
- depends_on: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [agent-skill-provider-governance-boundary](/concepts/agent-skill-provider-governance-boundary)
- related: [agent-security-architecture-and-prompt-injection-defense](/concepts/agent-security-architecture-and-prompt-injection-defense), [ai-agent-tool-selection-architecture](/concepts/ai-agent-tool-selection-architecture), [agent-execution-sandboxing-and-browser-isolation](/concepts/agent-execution-sandboxing-and-browser-isolation), [agent-tool-and-interoperability-paradigms](/comparisons/agent-tool-and-interoperability-paradigms)

