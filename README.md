# Wiki Web (Powered by Cloudflare Nimbus)

这是针对 `/home/lin/wiki` 知识库的松耦合独立 Web 发布端，基于 **Cloudflare Nimbus** 和 **Astro** 构建。

## 设计原则

1. **零侵入**：完全保持 `/home/lin/wiki` 的纯净性与独立性，不向主知识库写入任何前端配置或 Node 依赖。
2. **人类与 Agent 双一等公民**：
   - 为人类提供带 Pagefind 全文检索、暗黑模式、响应式排版的现代文档 UI。
   - 为 AI Agent 提供 `/llms.txt`、`/llms-full.txt` 以及每页纯净 Markdown 端点（`/<slug>/index.md`）。
3. **双链智能解析与代码保护**：
   - 在构建同步阶段，自动将 Obsidian 风格的 `[[wikilinks]]`、别名（Aliases）和锚点转换为标准 Web 相对链接。
   - 严格跳过多行代码块（```）与行内代码（`），确保语法示例与 Schema 定义中的双链字面量原样保留。
4. **生命周期自动同步**：
   - `predev`、`prebuild` 和 `predeploy` 均已挂载 `npm run sync`，无论是本地开发还是执行发布，均保证编译最新的知识快照。

## 常用命令

```bash
# 1. 增量同步 Wiki 内容并转换双链（支持自动保护代码块中的字面量）
npm run sync

# 2. 启动本地开发服务器（热重载预览，自动触发 predev 预同步）
npm run dev

# 3. 生产环境构建（自动触发 prebuild -> 静态编译 -> Pagefind 索引生成）
npm run build

# 4. 本地预览生产构建产物
npm run preview

# 5. 部署到 Cloudflare Pages / Workers（自动触发 predeploy 预同步并验证检查）
npm run deploy

# 自定义生产域名构建（默认为 https://wiki-web.pages.dev）
SITE_URL="https://your-custom-wiki-domain.com" npm run build
```

## 环境变量配置

| 变量名 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `SITE_URL` | `https://wiki-web.pages.dev` | 生产环境站点根 URL，驱动 canonical、sitemap、OG 图片及 `llms.txt` 绝对路径。 |
| `WIKI_ROOT` | `/home/lin/wiki` | 源 Wiki 知识库根目录。 |

## 项目结构

```
wiki-web/
├── astro.config.ts        # Nimbus 与 Astro 配置（动态读取 SITE_URL）
├── wrangler.jsonc         # Cloudflare 部署配置
├── scripts/
│   └── sync-wiki.ts       # Wiki 知识库同步、代码保护与双链转换器
├── src/
│   ├── content.config.ts  # 文档集合与 Schema 校验（兼容 Wiki 元数据）
│   ├── content/docs/      # 经转换生成的文档源码
│   └── ...                # 页面、布局、Tailwind 样式
└── dist/                  # 构建产物（HTML + Markdown + Pagefind 索引）
```
