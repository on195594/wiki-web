# Wiki Web (Powered by Cloudflare Nimbus)

这是针对 `/home/lin/wiki` 知识库的松耦合独立 Web 发布端，基于 **Cloudflare Nimbus** 和 **Astro** 构建。

## 设计原则

1. **零侵入**：完全保持 `/home/lin/wiki` 的纯净性与独立性，不向主知识库写入任何前端配置或 Node 依赖。
2. **人类与 Agent 双一等公民**：
   - 为人类提供带 Pagefind 全文检索、暗黑模式、响应式排版的现代文档 UI。
   - 为 AI Agent 提供 `/llms.txt`、`/llms-full.txt` 以及每页纯净 Markdown 端点（`/<slug>/index.md`）。
3. **双链自动解析**：在构建同步阶段，自动将 Obsidian 风格的 `[[wikilinks]]`、别名（Aliases）和锚点转换为标准 Web 相对链接。

## 常用命令

```bash
# 1. 增量同步 Wiki 内容并转换双链
npm run sync

# 2. 启动本地开发服务器（热重载预览）
npm run dev

# 3. 生产环境构建（预同步 -> 静态编译 -> Pagefind 索引生成）
npm run build

# 4. 本地预览生产构建产物
npm run preview

# 5. 部署到 Cloudflare Pages / Workers
npm run deploy
```

## 项目结构

```
wiki-web/
├── astro.config.ts        # Nimbus 与 Astro 配置
├── wrangler.jsonc         # Cloudflare 部署配置
├── scripts/
│   └── sync-wiki.ts       # Wiki 知识库同步与双链转换器
├── src/
│   ├── content.config.ts  # 文档集合与 Schema 校验（兼容 Wiki 元数据）
│   ├── content/docs/      # 经转换生成的文档源码
│   └── ...                # 页面、布局、Tailwind 样式
└── dist/                  # 构建产物（HTML + Markdown + Pagefind 索引）
```
