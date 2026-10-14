# Nimbus 0.17.0 upgrade review

Record of the Nimbus 0.17.0 upgrade reviews (`nimbus-docs migrate`), kept for audit.
`nimbus.json` `lastReviewedNimbusVersion` moves to `0.17.0` only after this review.

Site facts used for the review: `output: "static"`; collections are `docs` (`docsCollection()`)
and `partials` (`partialsCollection()`) only; no `api`, `version` or `rendering` config; no copied
`ApiBody`, `VersionSwitcher`, `api-layout` or `AgentDirective` components; `public/` and
`src/pages/` contain no `/.well-known/` files.

## Required reviews

| Review | Applies? | Evidence |
|---|---|---|
| api-body-request-example | No | No `src/components/ui/api-layout/`; no API families. |
| api-catalog-published-specs | No | No `api` collections, so no published specs. |
| api-version-id-format | No | No API families or version ids. |
| generated-agent-discovery-routes | Reviewed, no edit | No owner `/.well-known/ard.json` or `ai-catalog.json`. The build now generates both (`dist/.well-known/`); they describe the public wiki. |
| page-collections-from-helpers | No | Both collections use Nimbus helpers; no `_`-prefixed collection names; no `rendering` key. |
| version-switcher-keeps-query | No | No copied `VersionSwitcher`; no `versionMode: "query"`. |

## Optional items

Not adopted: `agent-discovery-content-signals`, `agent-files-follow-rendering` (static site, unchanged),
`api-query-version-mode`, `browser-documentation-search`, `homepage-renders-on-request`,
`lighter-sidebar-markup`, `publish-agent-skills`.

## Verification

- `llms.txt` and `robots.txt` output is byte-identical to the previous build.
- Nested pages have Markdown twins (`index.md`), e.g. `concepts/software-engineering-laws/*/index.md`.
- Pagefind indexes 117 pages with `data-pagefind-body` present.
- `npm test`, `npm run typecheck`, `npm run build` (with `WIKI_ROOT` pointing to a missing path, so content is the committed copy as in CI), `nimbus-docs check`, `nimbus-docs lint`: all pass.
