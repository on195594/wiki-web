# Nimbus 0.19.0 upgrade review

Reviewed the official `npx --no-install @cloudflare/nimbus-docs migrate --dry-run --diff`
plan from the committed `lastReviewedNimbusVersion: 0.18.1` on PR #27.
The tool's `migrate --yes` records completion in `nimbus.json`; the version was not
edited by hand. No runtime configuration or starter/component replacement is needed.

## Required review

- `changelog-release-notes`: not applicable. `src/content.config.ts` declares only
  `docs` and `partials`; there is no changelog collection, page, layout, component,
  or RSS route. There are no release entries or `?tag=` links to migrate. The
  official entry explicitly says sites without a changelog can skip it.

## Optional entries (all reviewed; none adopted)

- `agent-discovery-opt-out`: keep discovery enabled. This static site owns the
  `wiki.keyi.win` origin, has no Astro `base`, and has no owner `.well-known`
  files or suppression middleware. Both generated discovery JSON files remain
  byte-identical and point to the existing documentation index and Markdown home.
- `api-code-rail-lines`: no API code-rail or field-row components.
- `api-home`: no API reference collection, layout, version picker, or API route
  helpers. `src/pages/nimbus-api/coordinates.json.ts` is a Nimbus coordinates
  endpoint, not an OpenAPI documentation collection.
- `api-sidebar-alignment`: no API sidebar; retain existing docs sidebar styles.
- `branded-share-cards`: retain the existing `astro-og-canvas` cards and URLs;
  both OG route families build successfully. No new optional peers are needed.
- `card-links`: retain the current Card API and appearance; no new feature needed.
- `collection-urls-from-routes`: the primary docs collection remains served by
  `src/pages/[...slug].astro` at the site root with `getDocsStaticPaths` and
  `getDocsPage`. `partials` is not a page collection. No moved collection,
  dynamic locale folder, or sidebar prefix requires a redirect/configuration edit.
- `connect-mcp`: retain static output and existing agent endpoints; do not add a
  server adapter, remote `/mcp` service, or optional MCP dependency.
- `diagram-controls-height`: no diagram registry components.
- `favicons-and-asset-caching`: unrelated optional branding/cache changes omitted.
- `lighter-sidebar-rows`: retain the matching copied sidebar, layout, CSS, and
  selectors together; no partial component refresh.
- `og-font-path`: CI and local builds run from the project directory; existing
  font paths work. Building from an unrelated working directory is not required.
- `pnpm-sharp`: this project uses npm, which resolves Sharp through Astro.
- `redesigned-starter`: no redesign requested; retain the site's customized layout,
  source links, human-audience treatment, and styling.
- `route-files-follow-rendering`: `output: "static"`; the docs, Markdown/source,
  and section-index dynamic routes already export `getStaticPaths` and prerender.
  No server/request-rendered collection needs a rendering configuration change.
- `search-provider-slices`: whole-site build, no `NIMBUS_BUILD_ONLY` configuration.
  The existing provider loads `/pagefind/pagefind.js`; slice support is not needed.

## Compatibility evidence

Compared isolated builds of PR #27's parent `b32277c96f6333eb55d67b46383b9194d05e7ae4`
(Nimbus 0.18.1) and the reviewed PR (Nimbus 0.19.0), using each committed lockfile,
Node 22.23.4 / npm 10.9.9, the same production site origin, and an intentionally
missing `WIKI_ROOT` so prebuild uses committed content exactly as CI does.

- Same paths for all 122 `index.html`, 122 `index.md`, and 122 `index.mdx` files.
  Every HTML page retains the same ordered anchor URLs (including 352 GitHub
  source links), canonical URL, Markdown alternate links, discovery link elements,
  and Pagefind-body inclusion. HTML bytes differ because built assets changed.
- All Markdown and MDX outputs are byte-identical, including nested knowledge
  pages and the Markdown home; no `markdownFields` configuration is necessary.
- All seven root/section `llms.txt` files, `llms-full.txt`, both `.well-known`
  discovery files, three sitemap files, `robots.txt`, and `_redirects` are
  byte-identical. The custom home has no `rel=ard`/`rel=api-catalog` elements in
  either build; this is unchanged, not a new discovery promise.
- All 13 top-level Pagefind output files are byte-identical, with 121 indexed
  pages. A real browser opened the search dialog, searched `context`, and returned
  working knowledge-page result URLs including `/concepts/agent-context-engineering/`.

## Verification

All required commands succeeded in the isolated PR worktree:

```sh
npm ci
npx --no-install @cloudflare/nimbus-docs migrate --yes
npx --no-install @cloudflare/nimbus-docs migrate --dry-run --diff
npm run typecheck
npm test
npm run build
WRANGLER_SEND_METRICS=false npm run test:redirects:cf
npx --no-install @cloudflare/nimbus-docs check --json
```

- The original typecheck failed at `astro:config:done` with the exact
  `changelog-release-notes` review gate before consent; afterwards typecheck reports
  104 files, zero errors, warnings, or hints. The final migration preview reports
  no migrations or upgrade reviews.
- Sync/link/source regressions, all seven publish integration cases, and all 14
  HTML/Markdown rename groups pass. Cloudflare's local assets runtime follows all
  rename groups to the exact built content without loops.
- Nimbus `check` exits 0 with zero errors and no fixes, but reports `partial` /
  `unknown`: its static analyzer cannot resolve the existing computed `site`
  expression (also true on 0.18.1), and it does not lint the 122 `.md` pages.
  The production build evaluates the actual config successfully. A warning now
  identifies the intentional custom `src/pages/index.astro` shadowing the docs
  index; that home/source arrangement is unchanged. This is not a full lint pass.
- `npm audit` reports the same four advisories on both lockfiles (three moderate,
  one high). No unrelated dependency changes or `--force` installation were used.

Remote GitHub Actions and Cloudflare preview results must be checked against the
pushed PR head separately; local assets regression is not a Cloudflare preview
build or production deployment.
