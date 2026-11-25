---
title: Flutter 版本演进、平台编译与可选 AI 生态边界
created: 2026-11-05
updated: 2026-11-25
type: concept
tags:
  - product
  - architecture
  - tool
  - deployment
  - validation
sources:
  - docs:https://docs.flutter.dev/reference/supported-platforms
  - docs:https://docs.flutter.dev/platform-integration/web/faq
  - docs:https://docs.flutter.dev/packages-and-plugins/developing-packages
  - docs:https://docs.flutter.dev/platform-integration/platform-channels
  - docs:https://flutter.dev/blog/whats-new-in-flutter-3-47
  - docs:https://flutter.dev/blog/decoupling-material-cupertino
  - docs:https://docs.flutter.dev/packages-and-plugins/swift-package-manager/for-app-developers
  - docs:https://docs.flutter.dev/release/release-notes/release-notes-3.50.0
  - docs:https://blog.cocoapods.org/CocoaPods-Specs-Repo/
  - docs:https://docs.flutter.dev/platform-integration/web/wasm
  - docs:https://docs.flutter.dev/platform-integration/bind-native-code
  - docs:https://flutter.dev/blog/desktop-windowing-apis
  - docs:https://flutter.dev/blog/announcing-genkit-dart-1-0
  - docs:https://flutter.dev/blog/new-updates-to-a2ui-and-flutters-genui-package
  - docs:https://docs.flutter.dev/add-to-app/ios/project-setup
  - docs:https://docs.flutter.dev/add-to-app/ios/project-setup-legacy
  - https://firebase.google.com/docs/ios/cocoapods-deprecation
  - https://developers.google.com/ads/blog/posts/2026/11/prepare-for-cocoapods-read-only-mode
  - https://developers.google.com/admob/ios/quick-start
status: stable
description: 从 Flutter 实体页拆出独立设计系统包、SwiftPM 默认集成与 CocoaPods 只读期限、WebAssembly 编译与
  wasmAllowList 浏览器门控、原生 FFI 绑定、实验桌面多窗口，以及 GenUI/Genkit Dart 可选 AI 生态的版本与采用边界。
aliases:
  - flutter-version-boundaries
  - flutter-platform-compilation
  - flutter-3-47-migration-boundaries
volatility: high
verified_at: 2026-11-06
review_by: 2027-02-05
---

# Flutter 版本演进、平台编译与可选 AI 生态边界

## Freshness scope

本页为 [flutter](/entities/flutter) 的高易变子概念页：文中所涉独立设计包（`material_ui` / `cupertino_ui`）、SwiftPM 默认集成与 CocoaPods 计划于 2026-12-02 切换为只读、Wasm 编译与 `wasmAllowList` 浏览器门控（含 Flutter 3.50 文档更新）、原生 FFI 绑定（`package_ffi`）、实验桌面多窗口，以及 Genkit Dart 1.0 / GenUI 0.9 生态边界，已于 2026-11-06 对照 Flutter 官方文档与官方博客重新核验（见各节 `[!volatile]` 块）；页面级 `verified_at` 覆盖官方文档与发布说明核对，不代表已在本地安装目标 SDK、执行迁移或完成真机基准测试。使用前按 [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path) 检查关系及适用范围。

## Summary

本页从 [flutter](/entities/flutter) 拆出并专门维护**受版本演进与工具链变化直接影响的平台编译、依赖管理、原生互操作与可选 AI 生态边界**。核心判断是：官方默认启用、独立发包或编译参数可用，都不等于存量项目已完成零成本迁移或全平台性能/兼容性已自动成立；选型与升级仍须结合 [software-engineering-laws-decisions](/concepts/software-engineering-laws/software-engineering-laws-decisions) 的反证视角与 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries) 的边界验证原则，在目标设备和真实构建链路中逐项核验。

下述内容于 2026-10-13 首次核对官方正文与文档，并于 2026-10-20 与 2026-11-06 结合官方来源再次完整复核。公告日期、文档适用版本、读取日期和项目实际行为是不同证据；官方文档复核不代表已在本地执行项目迁移。

## 1. 设计系统独立发布，不等于核心已删除

> [!volatile]
> verified_at: 2026-11-06
> review_by: 2027-02-05
> source: docs:https://flutter.dev/blog/whats-new-in-flutter-3-47
>
> Flutter 3.47 发布说明（2026-08-12）明确：`material_ui`、`cupertino_ui` 1.0 为可选独立包，核心 SDK 在该版本仍包含旧库。[5] 2026-09-09 解耦文章也把弃用与最终移除写为后续步骤，不是已发生事实。[6]

发布说明给出迁移入口 `dart fix --apply --code=migrate_design_widgets`，并说明依赖混用的兼容桥及 localization 调整；生态包的迁移应视为 major release。[5] [推论] 项目迁移前应固定依赖版本、保留可恢复基线，并回归主题、国际化与第三方组件；“独立发布”不保证无需回归，也不证明框架核心只剩渲染。完整迁移细节回读来源，命令只作为文档入口，不在知识维护时执行。

## 2. Swift Package Manager 默认启用，保留插件回退边界

> [!volatile]
> verified_at: 2026-11-25
> review_by: 2026-12-02
> source: docs:https://docs.flutter.dev/packages-and-plugins/swift-package-manager/for-app-developers
>
> Flutter 3.44 起，iOS 和 macOS 默认启用 SwiftPM（截至 2026-11-11 发布的 Flutter 3.50.0 仍适用，并提示 CocoaPods 注册表将于 2026-12-02 永久转为只读）。升级后运行应用会自动加入集成，尚未支持 SwiftPM 的依赖仍回退到 CocoaPods。移除 CocoaPods 前，先确认所有插件支持 SwiftPM，并迁移手工添加的 Podfile 依赖或逻辑。官方文档分平台列出 `pod deintegrate`、清理旧文件和 Xcode 配置、重新构建的步骤；确认是否已启用 SwiftPM 可在 Xcode 核查 `Run Prepare Flutter Framework Script`（Pre-action）与 `FlutterGeneratedPluginSwiftPackage` 目标依赖；若 SwiftPM 插件要求更高最低 OS 版本，需在 Xcode 提高目标 `Minimum Deployments` 后运行 `flutter build ios --config-only`（macOS 用 `flutter build macos --config-only`）重建配置。当前仍可按项目或用户关闭 SwiftPM，但已写入 Xcode 的集成需另行移除；官方也提醒未来将不能关闭 SwiftPM（未指定移除版本号）。[7][18]

> [!volatile]
> verified_at: 2026-11-25
> review_by: 2026-12-02
> source: docs:https://docs.flutter.dev/add-to-app/ios/project-setup
>
> **iOS Add-to-App**：新版指南要求 Flutter 3.44+、Xcode 15.0+。已有 CocoaPods 或嵌入式 framework 集成时，先按指南移除原 Flutter 集成，再运行 `flutter build swift-package --platform ios` 生成 `FlutterNativeIntegration` 并接入宿主 Xcode 项目。Legacy 指南保留供参考，不再持续维护。[14][15]

> [!volatile]
> verified_at: 2026-11-25
> review_by: 2026-12-02
> source: docs:https://blog.cocoapods.org/CocoaPods-Specs-Repo/
>
> **CocoaPods 公布计划**：2026-11-02 至 2026-11-06 为计划中的只读演练窗口（截至 2026-11-25 官方博客未发布演练复盘公告）；2026-12-02 仍维持永久停止向公共 trunk 发布新 Pod 和新版本的计划日期（无提前执行或官方延期）。计划将 `CocoaPods/Specs` 归档并保留仓库与 jsDelivr CDN 供现有版本继续解析；未来补丁和新版本不能再经公共 trunk 发布，自建 Specs 仓库或已内置的依赖不受本次切换直接影响。2025 年 5 月公告另已禁止新 Pod 的 Podspec 使用 `prepare_command`（既有使用者豁免）。[13]

> [!volatile]
> verified_at: 2026-11-25
> review_by: 2026-12-02
> source: https://firebase.google.com/docs/ios/cocoapods-deprecation
>
> **Firebase for Apple platforms**：官方弃用页（最近更新于 2026-11-18 UTC）将 Firebase 12 列为最后一个发布至 CocoaPods 的主版本，正文仍沿用“将于 2026 年 10 月停止向 CocoaPods 发布新版本（`will stop publishing`）”的过渡表述而未改写为完成时通告；既有 v12 及更早版本在注册表只读后仍可安装。官方提醒，在同一 target 中混用 CocoaPods 与 SwiftPM 可能引发复杂的依赖循环和构建错误。[16]

> [!volatile]
> verified_at: 2026-11-25
> review_by: 2026-12-02
> source: https://developers.google.com/ads/blog/posts/2026/11/prepare-for-cocoapods-read-only-mode
>
> **Google Mobile Ads SDK**：官方公告（2026-11-06）及 2026-11-23 更新的 [iOS Quick Start 文档](https://developers.google.com/admob/ios/quick-start)确认，2026-12-02 后不再向 CocoaPods 发布 iOS SDK（`Google-Mobile-Ads-SDK`）、`GoogleUserMessagingPlatform` 新版本或中介适配器（11 月锁定前仍正常迭代了 13.12.0 / 13.13.0）；此前发布的版本仍可用，但在 Xcode 27 下继续用 CocoaPods 需额外配置 `post_install` 将 `IPHONEOS_DEPLOYMENT_TARGET` 设为 `15.0`。[17][19]

Apple 平台迁移验收需覆盖插件、最低 OS、flavor 或自定义 target，以及实际构建路径。

### Scoped verification note

2026-11-25（距计划切换日 7 天）在线复核了上述 5 份文档与公告：确认 CocoaPods 公共 Trunk 永久只读计划仍定于 `2026-12-02`（官方博客 10–11 月无新帖且未发布 11 月演练总结，顶部横幅 `2 months to go` 属静态模板未更新）、Flutter SwiftPM 与 Add-to-App 指南以 3.44+ 为起点且在 Flutter 3.50.0 下保持现行规则、Firebase 页面（2026-11-18 更新）仍保留 `will stop` 将来时措辞、Google Mobile Ads 文档（2026-11-23 更新）已同步 `2026-12-02` 只读警告与 Xcode 27 部署目标兼容提示。按 `SCHEMA.md` 未来事件纪律，“确认公布计划”不等于切换已发生，因此保留局部 `review_by: 2026-12-02` 不提前续期，待 `2026-12-02` 及之后复查服务端实际只读状态。[7][13][14][15][16][17][18][19]

## 3. Wasm 是编译与部署条件，不是通用性能保证

> [!volatile]
> verified_at: 2026-11-06
> review_by: 2027-02-05
> source: docs:https://docs.flutter.dev/platform-integration/web/wasm
>
> 2026-11-06 所读官方 Wasm 与 Web FAQ 文档（标示更新至 Flutter 3.50）说明：使用 `flutter build web --wasm` 同时产出 `dart2wasm`（`.wasm` + `skwasm`）与 `dart2js`（`.js` + `CanvasKit`）回退产物；旧 `dart:html`、`package:js` 等互操作需迁至 `package:web`、`dart:js_interop`（Flutter 3.50+ 可用 `--no-deprecated-js-interop` 在编译期拦截旧互操作，并用 `--web-content-hash` 为入口、脚本与 `build/web/assets/**` 生成 8 位 SHA-256 内容哈希及 `precache_manifest.json`）。运行时加载器结合特性探测（WasmGC、`wasm:js-string`、Phase 4 异常处理 `exnref`）与 `wasmAllowList` 决定执行路径：Chromium 137+ 默认运行 Wasm（`blink: true`）；Safari/iOS 26.2+（WebKit，含 iOS 上所有浏览器）与 Firefox 147+（Gecko）虽已支持所需 Wasm 特性，但默认仍回退至 JS（`webkit: false`、`gecko: false`），需在初始化配置中显式开启 `wasmAllowList` 才会运行 Wasm（Safari <= 26.1 自动回退）。多线程渲染另要求 `Cross-Origin-Opener-Policy: same-origin` 与 `Cross-Origin-Embedder-Policy: credentialless`（或 `require-corp`）响应头；Flutter 3.50+ 支持 `--enable-wasm-deferred-loading`（配合 `wasmDeferredModulesLoader`）按需加载延迟模块。[2][8]

[推论] 应分别验证依赖编译、目标浏览器实际执行路径、HTTP 响应头与跨域资源兼容、首次加载和交互表现。开启 `--wasm` 不代表所有浏览器都运行 Wasm，也不保证多线程已启用，更不能把官方宣传倍率设成项目验收承诺；内容/SEO 边界仍按 Web FAQ 判断。[2][8]

## 4. 原生绑定按 API 类型选路径

> [!volatile]
> verified_at: 2026-11-06
> review_by: 2027-02-05
> source: docs:https://docs.flutter.dev/platform-integration/bind-native-code
>
> 所读 Flutter 3.47 文档说明，从 3.38 起原生绑定推荐 `flutter create --template=package_ffi`，以 build hooks 和生成绑定管理原生构建；需要 Flutter Plugin API 或 Android Google Play services runtime 配置时，仍使用标准 plugin 模板。历史 `plugin_ffi` 路径有独立旧版文档。[9]

[推论] C ABI 绑定、平台消息和 Flutter 宿主插件职责不同，FFI 构建简化不等于消除所有平台配置。选型仍要检查架构/SDK 对应的二进制、完整性、许可、打包与真机调用；不要把一种互操作入口当作所有平台 API 的通用替代。[3][4][9]

## 5. 桌面多窗口：保留实验状态与通道限制

2026-08-24 的官方文章把 Desktop Windowing API 明确限定为 `main` 通道、实验特性开关后可用，API 可能变化；其示例还引用内部实现。Flutter 3.47 发布说明同样将多窗口进展放在 experimental 范围。[5][10] 这是公告时的状态，不是对未来稳定通道的永久判断。[推论] 多窗口若为硬需求，应核查所选 SDK/通道上的支持，并验证焦点、关闭生命周期、共享状态与各目标 OS；不能用“Flutter 支持桌面”推导“所需窗口行为已稳定可用”。

## 6. 可选 AI 生态，不改变基础选型

- **GenUI/A2UI 是界面协议与渲染接入，不是必选应用架构。** 2026-05-14 官方文章介绍 `genui` 0.7.0 → 0.9.0 与 A2UI v0.9 的迁移：拆分界面状态、transport 与 conversation，移除 `ContentGenerator`，应用接手模型连接、历史、重试和错误处理；不能照搬旧版接入代码。[12]
- **Genkit Dart 1.0 核心稳定，不代表所有扩展都稳定。** 2026-10-08 公告宣布稳定核心，但将更高层 stateful agent API 放在 `experimental.dart` 下，并介绍 A2UI 扩展。公告明确禁止把私有 API key 嵌入公开客户端；服务端模型入口仍需鉴权。[11]

[推论] 只有产品确实需要模型驱动的交互时才评估这些包；协议/包版本、消息校验、组件目录、客户端动作权限和失败回退需独立验证。生成 JSON、共享类型或客户端函数不自动证明语义正确或安全隔离；验证原则可复用 [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries)。不从生态文章推导 Flutter 已变成统一 Agent 运行时，也不把这些包、Skills 或 MCP 自动加入开发默认栈。

## 7. 来源范围与限制

SwiftPM 文档以 Flutter 3.44+ 为起点（页面未标注仅限 3.50，截至 2026-11-25 局部复核时对 Flutter 3.50.0 稳定版仍适用）；FFI 文档在 2026-11-06 复核时标示适用于 Flutter 3.47，Web FAQ 与 Wasm 文档在同日已更新至 Flutter 3.50。2026-10-19、2026-10-20 与 2026-11-06 对照 `docs.flutter.dev` 与 `flutter.dev/blog` 重新核验了设计系统独立包、SwiftPM、Wasm、FFI、桌面多窗口及 GenUI/Genkit Dart 段落及对应官方来源（[1]–[12]）。SwiftPM 局部 `review_by` 保持 `2026-12-02`，与 CocoaPods 计划永久只读日期一致。网页与实验特性会随版本继续演进，超过 `review_by` 或用于真实项目升级决策时必须回到目标 SDK 的当前文档重新核对；本页核验不代表已安装目标 SDK、执行迁移或完成真机/商店验证。基础分层架构与选型决策入口见主实体页 [flutter](/entities/flutter)。

## Relations

- refines: [flutter](/entities/flutter)
- depends_on: [typed-ai-agent-boundaries](/concepts/typed-ai-agent-boundaries), [hermes-retrieval-priority-and-answer-path](/concepts/hermes-retrieval-priority-and-answer-path)
- related: [software-engineering-laws-architecture](/concepts/software-engineering-laws/software-engineering-laws-architecture), [software-engineering-laws-quality](/concepts/software-engineering-laws/software-engineering-laws-quality), [software-engineering-laws-decisions](/concepts/software-engineering-laws/software-engineering-laws-decisions)

## Sources

[1] https://docs.flutter.dev/reference/supported-platforms — Supported deployment platforms
[2] https://docs.flutter.dev/platform-integration/web/faq — Flutter Web FAQ
[3] https://docs.flutter.dev/packages-and-plugins/developing-packages — Developing packages and plugins
[4] https://docs.flutter.dev/platform-integration/platform-channels — Writing custom platform-specific code
[5] https://flutter.dev/blog/whats-new-in-flutter-3-47 — Emma Twersky，2026-08-12，What’s new in Flutter 3.47；2026-10-20 复核设计包、Impeller 桌面默认、Apple 版本与 `UIScene`、Wasm 与实验多窗口段落。
[6] https://flutter.dev/blog/decoupling-material-cupertino — Craig Labenz，2026-09-09，Material and Cupertino decoupling are here；2026-10-20 复核独立包与未来移除的区别。
[7] https://docs.flutter.dev/packages-and-plugins/swift-package-manager/for-app-developers — Swift Package Manager for app developers；2026-11-25 核对 3.44+ 默认启用、回退与 iOS/macOS 迁移步骤。
[8] https://docs.flutter.dev/platform-integration/web/wasm — Support for WebAssembly (Wasm)；2026-11-06 复核时文档已更新至 Flutter 3.50（含 `wasmAllowList`、`--enable-wasm-deferred-loading` 与 `--no-deprecated-js-interop`）。浏览器与实验能力使用前需重新核查。
[9] https://docs.flutter.dev/platform-integration/bind-native-code — Bind to native code using FFI；文档标示 Flutter 3.47，2026-11-06 复核。
[10] https://flutter.dev/blog/desktop-windowing-apis — Matthew Kosarek，2026-08-24，Introducing the Desktop Windowing API for Flutter；核对实验状态、通道和 API 设计边界。
[11] https://flutter.dev/blog/announcing-genkit-dart-1-0 — Chris Gill，2026-10-08，Announcing Genkit Dart 1.0；核对稳定核心、实验扩展及客户端凭证边界。
[12] https://flutter.dev/blog/new-updates-to-a2ui-and-flutters-genui-package — Andrew Brogdon，2026-05-14，New updates to A2UI and Flutter’s GenUI package；历史版本迁移说明，不认定 0.9.0 为当前最新版。
[13] https://blog.cocoapods.org/CocoaPods-Specs-Repo/ — CocoaPods Trunk Read-only Plan；2026-11-25 复核公告时间表（2026-12-02 维持不变，10–11 月博客无新帖）与 2025 年 5 月 `prepare_command` 更新。
[14] https://docs.flutter.dev/add-to-app/ios/project-setup — Integrate a Flutter app into your iOS project；2026-11-25 复核 `flutter build swift-package --platform ios` 与 `FlutterNativeIntegration` 接入路径。
[15] https://docs.flutter.dev/add-to-app/ios/project-setup-legacy — Integrate a Flutter module into your iOS project (Legacy)；旧版 CocoaPods Add-to-App 操作参考；停止持续维护的说明见 [14]。
[16] https://firebase.google.com/docs/ios/cocoapods-deprecation — Migrate from CocoaPods (Firebase for Apple platforms)；2026-11-25 复核（页面更新于 2026-11-18 UTC，仍保留 `will stop` 表述）Firebase 12 最终主版本与同 target 混用风险。
[17] https://developers.google.com/ads/blog/posts/2026/11/prepare-for-cocoapods-read-only-mode — Prepare for CocoaPods read-only mode (Google Mobile Ads)；2026-11-25 复核 2026-12-02 后停止通过 CocoaPods 发布新 SDK 与中介适配器。
[18] https://docs.flutter.dev/release/release-notes/release-notes-3.50.0 — Flutter 3.50.0 release notes（2026-11-11 发布）。
[19] https://developers.google.com/admob/ios/quick-start — Set up Google Mobile Ads SDK for iOS（2026-11-23 UTC 更新，含 2026-12-02 CocoaPods 只读警告与 Xcode 27 部署目标配置）。

