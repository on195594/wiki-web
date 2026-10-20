---
title: Flutter Open-Source UI Framework
created: 2026-09-21
updated: 2026-10-20
type: entity
tags:
  - product
  - architecture
  - tool
sources:
  - docs:https://docs.flutter.dev/resources/faq
  - docs:https://docs.flutter.dev/resources/architectural-overview
  - docs:https://docs.flutter.dev/reference/supported-platforms
  - docs:https://docs.flutter.dev/platform-integration/web/faq
  - docs:https://docs.flutter.dev/tools/hot-reload
  - docs:https://docs.flutter.dev/app-architecture/guide
  - docs:https://docs.flutter.dev/data-and-backend/state-mgmt/options
  - docs:https://docs.flutter.dev/packages-and-plugins/developing-packages
  - docs:https://docs.flutter.dev/platform-integration/platform-channels
  - docs:https://docs.flutter.dev/testing/overview
  - docs:https://docs.flutter.dev/ui/accessibility
  - docs:https://docs.flutter.dev/perf/impeller
  - docs:https://flutter.dev/blog/whats-new-in-flutter-3-47
  - docs:https://flutter.dev/blog/decoupling-material-cupertino
  - docs:https://docs.flutter.dev/packages-and-plugins/swift-package-manager/for-app-developers
  - docs:https://docs.flutter.dev/platform-integration/web/wasm
  - docs:https://docs.flutter.dev/platform-integration/bind-native-code
  - docs:https://flutter.dev/blog/desktop-windowing-apis
  - docs:https://flutter.dev/blog/announcing-genkit-dart-1-0
  - docs:https://flutter.dev/blog/new-updates-to-a2ui-and-flutters-genui-package
status: current
description: Flutter 的架构与采用边界、问题导向选型入口、真实纵切验收，以及设计系统、SwiftPM、Wasm、原生绑定和可选 AI 生态的版本边界。
aliases:
  - Flutter
  - Flutter SDK
  - Flutter framework
  - Google Flutter
volatility: high
verified_at: 2026-10-20
review_by: 2026-12-20
---

# Flutter Open-Source UI Framework

## Freshness scope

本页为高易变产品与架构知识：文中所涉 Flutter 的分层架构、Impeller 渲染器默认与回退矩阵、受支持平台版本边界（含 Flutter 3.47 起 iOS 15+ / macOS 12+、`UIScene` 生命周期与 Intel Mac 逐步退场）、独立设计包（`material_ui` / `cupertino_ui`）、SwiftPM 默认集成与 CocoaPods 2026-12-02 只读期限、Wasm 编译与 iOS WebKit 限制、原生 FFI 绑定、实验桌面多窗口，以及 Genkit Dart 1.0 / GenUI 0.9 生态边界，已于 2026-10-20 对照 Flutter 官方文档与官方博客全量 20 个来源重新核验（见各节 `[!volatile]` 块）；页面级 `verified_at` 覆盖官方文档与发布说明核对，不代表已在本地安装目标 SDK、执行迁移或完成真机基准测试。使用前按 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 检查关系及适用范围。

## Summary

Flutter 是 Google 管理、社区共同贡献的开源跨平台 UI 框架，使用 Dart 从一套代码库构建 Android、iOS、Web、Windows、macOS、Linux 与嵌入式界面；框架采用 BSD 3-Clause License。[1] 它的核心取舍是自行实现并渲染大部分控件，而不是把 UI 主要映射到系统控件或 WebView，因此能获得较一致、可定制的跨平台界面，但仍需为平台能力、交互习惯、打包与发布流程保留平台适配。[1][2]

选型时先判断产品形态、复用收益和最难的平台约束，再做真实业务纵切；“一套代码库”不是零平台工程。先读下方“选型决策入口”，查机制时再进入架构章节；涉及升级或新功能时查“影响开发选型的版本变化”。本页是知识依据，不是特定项目的采用决定或迁移授权。

## 核心架构

Flutter 是可替换的分层系统，典型运行栈由以下部分组成：[2]

1. **Dart 应用**：组合 Widget 并实现业务逻辑。[2]
2. **Flutter framework**：用 Dart 提供动画、手势、绘制、渲染与基础 Widget；传统 SDK 还内置 Material/Cupertino 设计库。Flutter 3.47 同时提供可选独立设计包，但该版本仍保留内置库，不能把架构解耦写成已完成删除。[2][13][14]
3. **Engine**：主要以 C++ 实现，通过 `dart:ui` 暴露图形、文本、I/O、Dart runtime 与编译工具链等低层能力。[2]
4. **Embedder**：连接操作系统的渲染表面、输入、无障碍、事件循环与生命周期。[2]
5. **Runner**：把上述组件组装为目标平台可运行的应用包。[2]

原生目标在开发态依赖 Dart VM 支持有状态 hot reload，并在发布时把 Dart AOT 编译为机器码；Web 开发使用支持增量编译的 `dartdevc`，生产发布则编译为 JavaScript 或 WebAssembly。[2] Flutter 当前以 Impeller 为主要现代渲染路径：它在引擎构建阶段预编译较小的 shader 集合，以提高帧性能的可预测性；具体平台启用与回退规则随版本变化，应以当前官方矩阵为准。[12]

> [!volatile]
> verified_at: 2026-10-20
> review_by: 2026-12-20
> source: docs:https://docs.flutter.dev/perf/impeller
>
> 所读 Flutter 3.47 官方文档说明：Impeller 在 iOS 上已无 Skia 回退；在 Android API 29+ 默认启用并在不支持 Vulkan 的旧设备上回退到 OpenGL Impeller 后端；自 Flutter 3.47 起在 macOS、Windows 与 Linux 默认启用（保留 `FLTEnableImpeller`、`ImpellerSwitch::Disabled`、`fl_dart_project_set_enable_impeller` 等临时关闭入口，未来版本将移除 Skia），而 Web 仍使用 Skia。[3][12] 同时，受支持平台矩阵自 Flutter 3.47 起将最低 Apple 系统要求上调至 iOS 15（15–27）与 macOS 12（12–27），提示 Intel（`x64`）Mac 逐步退场，并在 iOS 27 上要求迁移至 `UIScene` 生命周期（启动阶段 channel 注册需移入 `FlutterImplicitEngineDelegate` 的 `didInitializeImplicitFlutterEngine`）。[3][13]

## UI 与状态模型

Flutter 采用响应式、声明式模型：开发者描述 `UI = f(state)`，框架负责将状态变化传播到界面。[2] Widget 是不可变的 UI 配置，通过组合形成 Widget tree；Element 负责把配置与生命周期连接起来，RenderObject tree 负责布局、绘制、命中测试与无障碍。`build()` 应快速、无副作用，因为它可能频繁执行。[2]

局部、短生命周期状态可从 `StatefulWidget`、`State` 与 `setState()` 开始；`ValueNotifier`、`InheritedNotifier`、`InheritedWidget` 等内建机制可覆盖更广的树内传播。是否引入社区状态管理包，应由应用复杂度、团队偏好和具体问题决定，而不是把第三方方案当作 Flutter 的必选层。[7]

## 跨平台不等于零平台代码

官方支持范围覆盖移动、桌面和主流浏览器，但受支持的 OS、架构、浏览器版本与 CI 覆盖会随 Flutter 版本变化；部署前应重新核对官方支持矩阵，而不是只看“支持某个平台”的宽泛表述。[3]

平台能力的接入路径按复用范围递进：[8][9]

- 先复用 `pub.dev` 中已有 Dart package 或 plugin；[8]
- 单个应用的少量宿主能力可用异步 platform channel；需要类型安全协议时用 Pigeon 生成绑定；[9]
- 多应用复用时封装为 plugin，跨平台实现可拆成 federated plugin；[8]
- C ABI 原生库可通过 Dart FFI/FFI package 绑定；`package_ffi` 与需要 Flutter Plugin API 的 plugin 路径不能混为一谈，版本及构建边界见下方原生绑定说明。[8][17]

普通 platform channel 依赖两端对方法名和数据结构达成一致，本身不是类型安全边界。[9] [推论] 采用插件后仍需逐个平台验证实现、权限、生命周期与发布配置。

### Web 的明确边界

Flutter Web 更适合 PWA、SPA 和交互密集应用，或给现有 Flutter 应用增加浏览器目标。官方明确指出，文本密集、流式排版、静态内容和强 SEO 场景更适合传统 DOM/HTML；可以把 Flutter 交互体验与 HTML 营销、帮助或内容页面分开。[4]

## 应用架构与依赖选择

官方应用架构指南把 **separation of concerns** 作为首要原则，并建议大多数应用从 UI layer 与 data layer 开始：View 展示 UI，ViewModel 管理 UI state 和命令，Repository 作为应用数据的 source of truth，Service 封装外部 API 或平台插件；只有复杂业务逻辑确实需要时才增加 domain/use-case 层。[6]

[推论] 最小采用顺序应是：先用 Widget、`setState()`/内建 notifier 和直接 Repository 完成一条真实业务纵切，再根据重复状态传播、测试隔离或跨源编排的实际摩擦增加状态管理包或 domain layer。这样保留官方分层边界，又避免一开始复制完整 MVVM 脚手架。

## 开发、测试与质量

- **Hot reload**：只在 debug 模式可用，通常保留应用状态并重建现有 Widget；`main()`、`initState()`、原生代码和部分类型形状变化不会按预期重执行，需要 hot restart 或完整重启。[5]
- **测试分层**：单元测试验证函数或类，Widget test 验证组件生命周期与交互，integration test 验证完整应用或关键路径。官方建议以大量单元/Widget 测试为基础，再用足够的集成测试覆盖关键用例。[10]
- **性能**：不要在 `build()` 中做重复昂贵工作；缩小重建范围并用 DevTools/性能 trace 测量，而不是仅凭“原生编译”推断实际性能。[2][12]
- **无障碍**：上线前至少检查屏幕阅读器、对比度、触控目标、错误恢复、色觉模式和大字号/显示缩放；Flutter 提供框架级并与底层操作系统协同的无障碍支持，但可访问性仍需要设计与真机测试。[2][11]

## 适用与不适用

[推论] 以下适用性判断由官方能力与限制综合而来，不是 Flutter 官方的项目准入标准。

**适合：**

- 需要 Android、iOS、桌面或 Web 共享大量产品逻辑和品牌 UI；[1]
- 需要深度自定义动画、绘制与组件组合；[1][2]
- 团队愿意以 Dart/Flutter 为主栈，并能维护少量平台宿主代码；[2]
- 需要把 Flutter 作为模块嵌入现有 Android/iOS 应用。[1][2]

**谨慎采用：**

- 核心产品是文本密集、内容优先、SEO 优先的网站；[4]
- 关键能力依赖覆盖不完整或维护状态不明的插件；[8]
- 产品必须大量使用最新系统原生控件，并要求其行为随 OS 自动变化；[1][2]
- 团队无法承担多平台构建、签名、权限、商店发布和真机回归。[3][8]

[推论] “一套代码库”应理解为提高复用率，而不是消除平台工程。选型时应先做一个包含最难插件、启动性能、可访问性和发布链路的真实纵切，再决定是否扩展到更多平台。

## 选型决策入口

[推论] 以下问题综合了官方能力与限制，并复用 [software-engineering-laws-decisions](/concepts/software-engineering-laws/software-engineering-laws-decisions) 的问题优先、反证与未来成本视角；不是官方评分模型，也不预设 Flutter 优于其他方案。

1. **先限定产品形态。** 主体是文章、文档、营销或强 SEO 内容时，先考虑 DOM/HTML 路径；Flutter 可以仅承载其中的交互区域。主体是跨端交互应用时，才评估 Flutter 的 UI 复用价值。使用 Dart 编写 DOM 网站也不等于使用 Flutter Web。[4]
2. **写清复用收益。** 只列当前确实需要交付的平台，区分可共享的业务逻辑、品牌 UI 与必须适配的导航、输入、生命周期和发布流程；单平台项目不能只靠“未来可能跨端”论证引入成本。[1][2][3]
3. **把最难原生能力前置。** 列出不可替代的设备/系统 API、后台行为与第三方 SDK，逐个平台检查插件实现、维护状态、许可及最低 OS 要求；必要时确认团队能维护 channel、FFI 或 plugin，而不是用包名存在代替可用性验证。[3][8][9][17]
4. **计算持续维护成本。** 明确 Dart 与平台宿主代码、CI、构建签名、商店发布、真机回归和依赖升级的责任；同时考虑既有团队和可继续复用的技术栈，不只比较第一版 UI 编写速度。[3][8][15]
5. **先设否决条件，再验证。** 若必须支持的平台不在支持范围、核心插件无可行替代、必需的系统行为无法实现，或团队无法维护发布链路，则停止或缩小候选范围。性能、包体和无障碍不凭宣传判通过，应按项目预先定义的阈值验证。[3][4][8][10][11]
6. **用同一条真实纵切比较候选。** 固定业务路径、目标设备、网络条件、数据规模及发布构建模式，再比较最难原生能力、启动与首个可用界面、关键交互、失败恢复、包体、无障碍和构建发布。未经验证项写为未知，硬约束不能用综合分数抵消。[3][5][10][11]

选型交付物可以是一份项目 ADR：需求与硬约束、候选方案、版本/设备/测试条件、观察结果、未知项、采用或不采用理由，以及复评触发条件。阈值与私人项目数据属于项目文档；本 Wiki 只保存可公开复用的方法。出现真实横向比较需求时才建立场景化 comparison 页，产品事实继续由各自主页面维护，不预建框架排行榜。

## 最小采用清单

[推论] 以下是基于官方能力与边界整理的最小采用路径，不是 Flutter 官方强制流程。

1. 只选择当前确实需要的目标平台，并核对官方支持矩阵。[3]
2. 用 `flutter create` 建立最小应用，先完成一条端到端业务纵切。[9]
3. 优先复用内建 Widget、状态原语和已维护插件；不要预建状态管理、domain layer 或 federated plugin。[7][8]
4. 及早验证最难的原生能力、权限、后台行为、包体与商店构建。[3][8][9]
5. 为业务逻辑和关键 Widget 留下测试，再用少量 integration test 覆盖发布路径。[10]
6. 在真实低端设备和目标浏览器上用 profile/release 模式测量性能与无障碍；debug/hot reload 体验不能代表发布质量。[5][11]

## 影响开发选型的版本变化

下述内容于 2026-10-13 首次核对官方正文与文档，并于 2026-10-20 结合全页 20 个官方来源再次完整复核。公告日期、文档适用版本、读取日期和项目实际行为是不同证据；官方文档复核不代表已在本地执行项目迁移。

### 设计系统独立发布，不等于核心已删除

> [!volatile]
> verified_at: 2026-10-20
> review_by: 2026-12-20
> source: docs:https://flutter.dev/blog/whats-new-in-flutter-3-47
>
> Flutter 3.47 发布说明（2026-08-12）明确：`material_ui`、`cupertino_ui` 1.0 为可选独立包，核心 SDK 在该版本仍包含旧库。[13] 2026-09-09 解耦文章也把弃用与最终移除写为后续步骤，不是已发生事实。[14]

发布说明给出迁移入口 `dart fix --apply --code=migrate_design_widgets`，并说明依赖混用的兼容桥及 localization 调整；生态包的迁移应视为 major release。[13] [推论] 项目迁移前应固定依赖版本、保留可恢复基线，并回归主题、国际化与第三方组件；“独立发布”不保证无需回归，也不证明框架核心只剩渲染。完整迁移细节回读来源，命令只作为文档入口，不在知识维护时执行。

### Swift Package Manager 默认启用，保留插件回退边界

> [!volatile]
> verified_at: 2026-10-20
> review_by: 2026-12-20
> source: docs:https://docs.flutter.dev/packages-and-plugins/swift-package-manager/for-app-developers
>
> 所读文档标示适用于 Flutter 3.47，并说明从 3.44 起 SwiftPM 默认启用（因 CocoaPods 已进入维护模式且官方 trunk 仓库定于 2026-12-02 永久转为只读）；升级后运行应用会自动加入集成，但未支持 SwiftPM 的依赖仍回退到 CocoaPods。只有所有插件支持 SwiftPM，且手工 Podfile 依赖/逻辑已处理，才适合移除 CocoaPods 集成。[15]

文档提供项目级关闭配置与完整移除 SwiftPM 集成步骤；关闭开关不等于撤销 Xcode 项目改动。[15] [推论] Apple 平台选型与升级需检查插件、最低 OS、flavor/custom target 和真实构建路径；先验证迁移，再考虑删除旧依赖管理文件，不把默认行为当作所有项目已迁移完成。

### Wasm 是编译与部署条件，不是通用性能保证

> [!volatile]
> verified_at: 2026-10-20
> review_by: 2026-12-20
> source: docs:https://docs.flutter.dev/platform-integration/web/wasm
>
> 所读 Flutter 3.47 文档使用 `flutter build web --wasm` 启用 Wasm；旧 `dart:html`、`package:js` 等互操作需迁至 `package:web`、`dart:js_interop`。运行路径受浏览器 WasmGC 兼容性影响：未检测到 WasmGC 时自动回退至同时产出的 JavaScript，且因 iOS 上的浏览器均基于 WebKit，当前无法在 iOS 浏览器运行编译为 Wasm 的 Flutter Web 应用。多线程渲染另外要求 `Cross-Origin-Opener-Policy: same-origin` 与 `Cross-Origin-Embedder-Policy: credentialless`（或 `require-corp`）响应头；Wasm deferred loading 仍标为实验功能，文档限定在 `main` 通道通过 `--enable-wasm-deferred-loading` 启用。[16]

[推论] 应分别验证依赖编译、目标浏览器实际执行路径、HTTP 响应头与跨域资源兼容、首次加载和交互表现。开启 `--wasm` 不代表所有浏览器都运行 Wasm，也不保证多线程已启用，更不能把官方宣传倍率设成项目验收承诺；内容/SEO 边界仍按 Web FAQ 判断。[4][16]

### 原生绑定按 API 类型选路径

> [!volatile]
> verified_at: 2026-10-20
> review_by: 2026-12-20
> source: docs:https://docs.flutter.dev/platform-integration/bind-native-code
>
> 所读 Flutter 3.47 文档说明，从 3.38 起原生绑定推荐 `flutter create --template=package_ffi`，以 build hooks 和生成绑定管理原生构建；需要 Flutter Plugin API 或 Android Google Play services runtime 配置时，仍使用标准 plugin 模板。历史 `plugin_ffi` 路径有独立旧版文档。[17]

[推论] C ABI 绑定、平台消息和 Flutter 宿主插件职责不同，FFI 构建简化不等于消除所有平台配置。选型仍要检查架构/SDK 对应的二进制、完整性、许可、打包与真机调用；不要把一种互操作入口当作所有平台 API 的通用替代。[9][17]

### 桌面多窗口：保留实验状态与通道限制

2026-08-24 的官方文章把 Desktop Windowing API 明确限定为 `main` 通道、实验特性开关后可用，API 可能变化；其示例还引用内部实现。Flutter 3.47 发布说明同样将多窗口进展放在 experimental 范围。[13][18] 这是公告时的状态，不是对未来稳定通道的永久判断。[推论] 多窗口若为硬需求，应核查所选 SDK/通道上的支持，并验证焦点、关闭生命周期、共享状态与各目标 OS；不能用“Flutter 支持桌面”推导“所需窗口行为已稳定可用”。

## 可选 AI 生态，不改变基础选型

- **GenUI/A2UI 是界面协议与渲染接入，不是必选应用架构。** 2026-05-14 官方文章介绍 `genui` 0.7.0 → 0.9.0 与 A2UI v0.9 的迁移：拆分界面状态、transport 与 conversation，移除 `ContentGenerator`，应用接手模型连接、历史、重试和错误处理；不能照搬旧版接入代码。[20]
- **Genkit Dart 1.0 核心稳定，不代表所有扩展都稳定。** 2026-10-08 公告宣布稳定核心，但将更高层 stateful agent API 放在 `experimental.dart` 下，并介绍 A2UI 扩展。公告明确禁止把私有 API key 嵌入公开客户端；服务端模型入口仍需鉴权。[19]

[推论] 只有产品确实需要模型驱动的交互时才评估这些包；协议/包版本、消息校验、组件目录、客户端动作权限和失败回退需独立验证。生成 JSON、共享类型或客户端函数不自动证明语义正确或安全隔离；验证原则可复用 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)。不从生态文章推导 Flutter 已变成统一 Agent 运行时，也不把这些包、Skills 或 MCP 自动加入开发默认栈。

## 来源范围与限制

本页于 2026-09-21 核对 Flutter 官方文档；所读文档当时标示主要反映 Flutter 3.47.2。[1][3][12] 平台支持、渲染器启用、工具链和插件建议属于高波动信息，超过 `review_by` 或用于真实项目决策时必须重新核对。官方文档适合说明产品设计与支持政策，但不是独立性能基准；具体性能、包体、插件成熟度和维护成本必须在目标设备与真实业务纵切中验证。

2026-10-13 仅复核 Web 产品形态边界及新增版本/生态章节所引正文，所读 SwiftPM、Wasm 和 FFI 文档标示 Flutter 3.47；未重新认证整页的支持矩阵、渲染器或插件建议，所以页面级 `verified_at`、`review_by` 保留原值。来源直接来自官方文档和单篇博客正文，不以博客目录或生成摘要代替证据；发布时间见 Sources。网页会继续变化，历史公告不能代替目标 SDK 的当前文档。未安装 SDK、执行迁移、复现基准或完成真机/商店验证。

2026-10-19 再次核对设计系统独立包、SwiftPM、Wasm 和 FFI 四组断言及对应来源 [13]–[17]。2026-10-20 对照 `docs.flutter.dev` 与 `flutter.dev/blog` 重新核验本页全部 20 个官方来源（[1]–[20]），补充 Impeller 跨平台默认/回退与 Apple 最低系统/`UIScene` 边界标记块，并将页面级与标记块 `verified_at` 统一刷新为 `2026-10-20`（`review_by` 保持 `2026-12-20`）。

## Relations

- related: [software-engineering-laws-architecture](/concepts/software-engineering-laws/software-engineering-laws-architecture), [software-engineering-laws-quality](/concepts/software-engineering-laws/software-engineering-laws-quality), [software-engineering-laws-decisions](/concepts/software-engineering-laws/software-engineering-laws-decisions), [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [wiki-ingestion-workflow](/concepts/wiki-ingestion-workflow), [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)

## Sources

[1] https://docs.flutter.dev/resources/faq — Flutter FAQ
[2] https://docs.flutter.dev/resources/architectural-overview — Flutter architectural overview
[3] https://docs.flutter.dev/reference/supported-platforms — Supported deployment platforms
[4] https://docs.flutter.dev/platform-integration/web/faq — Flutter Web FAQ
[5] https://docs.flutter.dev/tools/hot-reload — Hot reload
[6] https://docs.flutter.dev/app-architecture/guide — Guide to app architecture
[7] https://docs.flutter.dev/data-and-backend/state-mgmt/options — Approaches to state management
[8] https://docs.flutter.dev/packages-and-plugins/developing-packages — Developing packages and plugins
[9] https://docs.flutter.dev/platform-integration/platform-channels — Writing custom platform-specific code
[10] https://docs.flutter.dev/testing/overview — Testing Flutter apps
[11] https://docs.flutter.dev/ui/accessibility — Accessibility
[12] https://docs.flutter.dev/perf/impeller — Impeller rendering engine
[13] https://flutter.dev/blog/whats-new-in-flutter-3-47 — Emma Twersky，2026-08-12，What’s new in Flutter 3.47；2026-10-20 复核设计包、Impeller 桌面默认、Apple 版本与 `UIScene`、Wasm 与实验多窗口段落。
[14] https://flutter.dev/blog/decoupling-material-cupertino — Craig Labenz，2026-09-09，Material and Cupertino decoupling are here；2026-10-20 复核独立包与未来移除的区别。
[15] https://docs.flutter.dev/packages-and-plugins/swift-package-manager/for-app-developers — Swift Package Manager for app developers；文档最后更新 2026-08-31，标示 Flutter 3.47，2026-10-20 复核。
[16] https://docs.flutter.dev/platform-integration/web/wasm — Support for WebAssembly (Wasm)；文档最后更新 2026-08-18，标示 Flutter 3.47，2026-10-20 复核。浏览器与实验能力使用前需重新核查。
[17] https://docs.flutter.dev/platform-integration/bind-native-code — Bind to native code using FFI；文档最后更新 2026-06-08，标示 Flutter 3.47，2026-10-20 复核。
[18] https://flutter.dev/blog/desktop-windowing-apis — Matthew Kosarek，2026-08-24，Introducing the Desktop Windowing API for Flutter；核对实验状态、通道和 API 设计边界。
[19] https://flutter.dev/blog/announcing-genkit-dart-1-0 — Chris Gill，2026-10-08，Announcing Genkit Dart 1.0；核对稳定核心、实验扩展及客户端凭证边界。
[20] https://flutter.dev/blog/new-updates-to-a2ui-and-flutters-genui-package — Andrew Brogdon，2026-05-14，New updates to A2UI and Flutter’s GenUI package；历史版本迁移说明，不认定 0.9.0 为当前最新版。

