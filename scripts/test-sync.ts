import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { renderMarkdown } from "@cloudflare/nimbus-docs/markdown";
import { execFileSync } from "node:child_process";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";
import type { Nodes } from "mdast";
import { collectPublicRawSources, convertMarkdownLinks, convertWikilinksInProse } from "./sync-wiki.ts";

const routeMap = new Map([
  ["target", { route: "/concepts/target", title: "Target Concept" }],
  ["target2", { route: "/concepts/target2", title: "Target Two" }],
  ["schema", { route: "/schema", title: "Wiki Schema" }],
  ["page-name", { route: "/concepts/page-name", title: "Page Name" }],
]);

console.log("[test-sync] Running regression tests for wikilink conversion & code protection...");

// Test Case 1: Double backticks containing single backticks inside (CommonMark code span)
{
  const input = "Use ``a ` b`` and [[target]] then ``c ` d``.";
  const expected = "Use ``a ` b`` and [target](/concepts/target) then ``c ` d``.";
  const output = convertWikilinksInProse(input, routeMap);
  assert.strictEqual(output, expected, "Failed on double-backtick code span with inner backticks");
  console.log("✓ Test 1 Passed: Double backticks with inner backticks handled correctly.");
}

// Test Case 2: Unmatched backtick across paragraph / blank line boundary
{
  const input = "A lone ` marker.\n\nSee [[schema]].\n\nAnother ` marker.";
  const expected = "A lone ` marker.\n\nSee [schema](/schema).\n\nAnother ` marker.";
  const output = convertWikilinksInProse(input, routeMap);
  assert.strictEqual(output, expected, "Failed: unmatched backtick crossed blank line boundary");
  console.log("✓ Test 2 Passed: Code span matching does not cross blank lines/paragraphs.");
}

// Test Case 3: Fenced code block preserving literal wikilink syntax examples
{
  const input = "Prose before [[target]].\n\n```markdown\n## Relations\n- refines: [[page-name]]\n```\n\nProse after [[schema]].";
  const expected = "Prose before [target](/concepts/target).\n\n```markdown\n## Relations\n- refines: [[page-name]]\n```\n\nProse after [schema](/schema).";
  const output = convertWikilinksInProse(input, routeMap);
  assert.strictEqual(output, expected, "Failed: fenced code block wikilink syntax modified");
  console.log("✓ Test 3 Passed: Fenced code blocks preserve literal [[wikilink]] syntax.");
}

// Test Case 4: Single backtick inline code preserving literal wikilink syntax
{
  const input = "每个正式知识页至少包含 2 个 `[[wikilinks]]` 指向其他页面，例如 [[target]].";
  const expected = "每个正式知识页至少包含 2 个 `[[wikilinks]]` 指向其他页面，例如 [target](/concepts/target).";
  const output = convertWikilinksInProse(input, routeMap);
  assert.strictEqual(output, expected, "Failed: inline `[[wikilinks]]` was converted");
  console.log("✓ Test 4 Passed: Inline code `[[wikilinks]]` preserved verbatim.");
}

// Fence-length / delimiter / indentation / unclosed cases (CommonMark: closing fence may be longer)
{
  const cases: [string, string][] = [
    ["longer backtick closer", "Before [[target]].\n\n```markdown\nExample: [[target]]\n````\n\nAfter [[target]]."],
    ["longer tilde closer", "~~~\n[[target]]\n~~~~~\n\nAfter [[target]]."],
    ["indented fence (3 spaces)", "   ```\n   [[target]]\n   ```\n\nAfter [[target]]."],
    ["list-nested fence", "- item\n\n    ```\n    [[target]]\n    ```\n\nAfter [[target]]."],
    ["unclosed fence runs to end", "Before [[target]].\n\n```\n[[target]]\nstill code"],
    ["shorter closer does not close", "````\n[[target]]\n```\n[[target]]\n````\n\nAfter [[target]]."],
    ["other-char closer does not close", "```\n[[target]]\n~~~\n[[target]]\n```\n\nAfter [[target]]."],
    ["CRLF line endings", "```\r\n[[target]]\r\n````\r\n\r\nAfter [[target]]."],
  ];
  for (const [name, input] of cases) {
    const converted = "[target](/concepts/target)";
    const output = convertWikilinksInProse(input, routeMap);
    const expected = input.replace(/^(Before |After )\[\[target\]\]/gm, `$1${converted}`);
    assert.strictEqual(output, expected, `Failed fence case: ${name}`);
  }
  // A backtick fence with backticks in its info string is an inline span, not a fence.
  assert.strictEqual(convertWikilinksInProse("``` a`b [[target]]", routeMap), "``` a`b [target](/concepts/target)");
  console.log("✓ Test 5 Passed: CommonMark fence lengths, indentation, unclosed fences.");
}

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "wiki-markdown-links-"));
try {
  const root = path.join(temp, "wiki");
  const sources = ["index.md", "SCHEMA.md", "concepts/nested/target.md", "concepts/target.md", "raw/articles/source.md", "raw/articles/来源 空格.md"];
  for (const source of sources) {
    fs.mkdirSync(path.dirname(path.join(root, source)), { recursive: true });
    fs.writeFileSync(path.join(root, source), "Fixture.\n");
  }
  fs.writeFileSync(path.join(temp, "outside.md"), "Must not link outside the Wiki.\n");
  fs.symlinkSync(path.join(temp, "outside.md"), path.join(root, "raw/articles/linked.md"));
  fs.symlinkSync(temp, path.join(root, "raw/outside"), "dir");
  const routes = new Map([
    [path.join(root, "index.md"), "/"],
    [path.join(root, "SCHEMA.md"), "/schema"],
    [path.join(root, "concepts/nested/target.md"), "/concepts/nested/target"],
    [path.join(root, "concepts/target.md"), "/concepts/target"],
  ]);
  const raw = "https://github.com/on195594/wiki/blob/main/raw/articles/source.md";
  const cases: [string, string, string, string?][] = [
    ["home", "[Home](../index.md)", "[Home](/)"],
    ["schema-query-fragment", "[Schema](../SCHEMA.md?view=1#rules)", "[Schema](/schema?view=1#rules)"],
    ["raw-source", "[Source](../raw/articles/source.md)", `[Source](${raw})`],
    ["nested-source", "[Source](../../raw/articles/source.md)", `[Source](${raw})`, "concepts/nested/note.md"],
    ["exact-path-not-basename", "[Target](target.md)", "[Target](/concepts/nested/target)", "concepts/nested/note.md"],
    ["core-page-caller", "[Target](concepts/target.md)", "[Target](/concepts/target)", "index.md"],
    ["angle-and-title", '[Schema](<../SCHEMA.md> "Rules")', '[Schema](/schema "Rules")'],
    ["encoded-source", "[Source](../raw/articles/%E6%9D%A5%E6%BA%90%20%E7%A9%BA%E6%A0%BC.md#part)", "[Source](https://github.com/on195594/wiki/blob/main/raw/articles/%E6%9D%A5%E6%BA%90%20%E7%A9%BA%E6%A0%BC.md#part)"],
    ["shared-image-definition", "[Schema][s] ![Image][s]\n\n[s]: ../SCHEMA.md\n", "[Schema](/schema) ![Image][s]\n\n[s]: ../SCHEMA.md\n"],
    ["nested-label", "[**Schema** and `code`](../SCHEMA.md)", "[**Schema** and `code`](/schema)"],
    ["surrounding-bytes", "前文\r\n\r\n[Schema](../SCHEMA.md)\r\n\r\n后文", "前文\r\n\r\n[Schema](/schema)\r\n\r\n后文"],
    ["table-inline-link", "| Label | Next |\n| --- | --- |\n| [a\\|b](../SCHEMA.md) | next |\n", "| Label | Next |\n| --- | --- |\n| [a\\|b](/schema) | next |\n"],
    ["table-reference-link", "| Label | Next |\n| --- | --- |\n| [a\\|b][s] | next |\n\n[s]: ../SCHEMA.md\n", "| Label | Next |\n| --- | --- |\n| [a\\|b](/schema) | next |\n\n[s]: ../SCHEMA.md\n"],
    ["table-code-label", "| Label | Next |\n| --- | --- |\n| [`a\\|b`](../SCHEMA.md) | next |\n", "| Label | Next |\n| --- | --- |\n| [`a\\|b`](/schema) | next |\n"],
    ["table-link-title", '| Label | Next |\n| --- | --- |\n| [a\\|b](../SCHEMA.md "c\\|d") | next |\n', '| Label | Next |\n| --- | --- |\n| [a\\|b](/schema "c\\|d") | next |\n'],
  ];
  for (const unchanged of [
    "[External](https://example.org/SCHEMA.md)", "[External](//example.org/SCHEMA.md)",
    "[Root](/SCHEMA.md)", "[Anchor](#rules)", "[Query](?file=SCHEMA.md)",
    "![Image](../SCHEMA.md)", '`[Schema](../SCHEMA.md)`', "``a ` [Schema](../SCHEMA.md)``",
    "```md\n[Schema](../SCHEMA.md)\n```", "~~~md\n[Schema](../SCHEMA.md)\n~~~", "```md\n[Schema](../SCHEMA.md)",
    "    [Schema](../SCHEMA.md)\n", '<a href="../SCHEMA.md">Schema</a>', "\\[Schema](../SCHEMA.md)",
    "[Missing](../missing.md)", "[Malformed](../bad%ZZ.md)", "[Outside](../../outside.md)",
    "[Symlink](../raw/articles/linked.md)", "[Parent symlink](../raw/outside/outside.md)",
  ]) cases.push(["preserved", unchanged, unchanged]);
  for (const [name, input, expected, source = "queries/note.md"] of cases) {
    const output = convertMarkdownLinks(input, path.join(root, source), routes, root);
    assert.strictEqual(output, expected, name);
    if (name.startsWith("table-")) {
      assert.strictEqual(renderMarkdown(output), renderMarkdown(input.replaceAll("../SCHEMA.md", "/schema")), name);
    }
  }
  console.log(`[test-sync] All 4 original tests and ${cases.length} Markdown-link regression cases passed.`);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}

const rawTemp = fs.mkdtempSync(path.join(os.tmpdir(), "wiki-public-raw-"));
try {
  const root = path.join(rawTemp, "wiki");
  const env = { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_SYSTEM: "/dev/null", GIT_TERMINAL_PROMPT: "0" };
  const git = (...args: string[]) => execFileSync("git", ["-C", root, ...args], { env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  const write = (file: string, text = "Public source.\n") => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), text);
  };
  fs.mkdirSync(root);
  git("init", "--initial-branch=main");
  git("config", "user.name", "Raw Link Test");
  git("config", "user.email", "test@example.invalid");
  git("remote", "add", "origin", "https://github.com/on195594/wiki.git");
  for (const file of [
    "raw/articles/source.md", "raw/articles/target.md", "raw/articles/来源 空格 (v1)%_.md",
    "raw/articles/dup.md", "raw/books/dup.md", "raw/articles/Case.md", "raw/books/case.md",
    "raw/articles/gone.md", "raw/articles/replace.md", "raw/ancestor/inside.md", "raw/internal/inside-root.md",
    "raw/articles/unsafe\\name.md", "raw/articles/tab\tname.md",
  ]) write(file);
  write("private/secret.md");
  fs.symlinkSync(path.join(root, "private/secret.md"), path.join(root, "raw/articles/symlink.md"));
  for (const file of ["index.md", "SCHEMA.md", "concepts/note.md"]) write(file, "---\ntitle: Note\n---\n\n[[source]] and [[target]] and [[local-only]].\n");
  write("concepts/target.md", "---\ntitle: Target\naliases: [target-alias]\n---\n\nFormal page.\n");
  git("add", ".");
  git("commit", "-m", "published fixture");
  const commit = git("rev-parse", "HEAD");
  git("update-ref", "refs/remotes/origin/main", commit);
  write("raw/articles/local-only.md");
  git("add", ".");
  git("commit", "-m", "unpublished fixture");
  write("raw/articles/untracked.md");
  fs.rmSync(path.join(root, "raw/books/dup.md"));
  fs.rmSync(path.join(root, "raw/articles/gone.md"));
  fs.rmSync(path.join(root, "raw/articles/replace.md"));
  fs.symlinkSync(path.join(root, "private/secret.md"), path.join(root, "raw/articles/replace.md"));
  fs.rmSync(path.join(root, "raw/ancestor"), { recursive: true });
  fs.symlinkSync(rawTemp, path.join(root, "raw/ancestor"));
  fs.rmSync(path.join(root, "raw/internal"), { recursive: true });
  fs.symlinkSync(path.join(root, "private"), path.join(root, "raw/internal"));
  write("private/inside-root.md");
  const sources = collectPublicRawSources(root);
  const base = `https://github.com/on195594/wiki/blob/${commit}/`;
  const url = `${base}raw/articles/source.md`;
  const convert = (input: string) => convertWikilinksInProse(input, routeMap, undefined, sources);
  const cases: [string, string][] = [
    ["[[source]]", `[source](${url})`],
    ["[[SOURCE.md]]", `[SOURCE.md](${url})`],
    ["[[raw/articles/source]]", `[raw/articles/source](${url})`],
    ["[[raw/articles/source.md#Section Heading|来源]]", `[来源](${url}#section-heading)`],
    ["[[raw/articles/dup.md]]", `[raw/articles/dup.md](${base}raw/articles/dup.md)`],
    ["[[来源 空格 (v1)%_]]", `[来源 空格 (v1)%\\_](${base}raw/articles/%E6%9D%A5%E6%BA%90%20%E7%A9%BA%E6%A0%BC%20%28v1%29%25_.md)`],
    ["[[source|<img src=x onerror=alert(1)>]]", `[\\<img src=x onerror=alert(1)>](${url})`],
    ["[[target]]", "[target](/concepts/target)"],
    ["[[schema#Rules|Schema]]", "[Schema](/schema#rules)"],
    ["[[#Section Heading]]", "[Section Heading](#section-heading)"],
  ];
  for (const [name, resolved] of [["target", "[target](/concepts/target)"], ["source", `[source](${url})`], ["missing", "`missing`"], ["local-only", "`local-only`"]]) {
    const definition = `\n\n[${name}]: https://example.org/override`;
    cases.push([`[[${name}]]${definition}`, `${resolved}${definition}`]);
    cases.push([`[${name}]${definition}`, `[${name}]${definition}`]);
    cases.push([`[See [[${name}]]][ref]\n\n[ref]: https://example.org/`, `[See [[${name}]]][ref]\n\n[ref]: https://example.org/`]);
  }
  for (const missing of ["missing", "dup", "case", "gone", "replace", "symlink", "inside", "inside-root", "local-only", "untracked", "secret", "private/secret.md", "../private/secret", "raw/../private/secret.md", "raw/articles/unsafe\\name", "raw/articles/tab\tname", "docs:source", "https://example.org/source"]) {
    cases.push([`[[${missing}]]`, `\`${missing}\``]);
  }
  for (const literal of [
    "`[[source]]`", "``a ` [[source]]``", "```md\n[[source]]\n````", "~~~\n[[source]]\n~~~~",
    "```md\n[[source]]", "    [[source]]\n", "> ```\n> [[source]]\n> ```",
    "- item\n\n    ```\n    [[source]]\n    ```", "[See [[source]]](https://example.org)",
    "![See [[source]]](image.png)", '<a title="[[source]]">Literal</a>',
  ]) cases.push([literal, literal]);
  for (const [input, expected] of cases) assert.equal(convert(input), expected, input);
  const label = convert("[[source|*literal* <script>alert(1)</script>]]");
  const rendered = renderMarkdown(label);
  assert.ok(rendered.includes(`href="${url}"`));
  assert.ok(!rendered.includes("<script>") && !rendered.includes("<em>"));
  const fallback = convert("[[missing|a` <img src=x>]]");
  assert.ok(!renderMarkdown(fallback).includes("<img"));
  const markdown = toMarkdown(fromMarkdown(convert("[[source#Section Heading|来源]]")));
  assert.ok(markdown.includes(`[来源](${url}#section-heading)`), "Markdown round-trip lost public navigation");
  assert.equal(collectPublicRawSources(path.join(root, "raw")).size, 0, "Nested root must not inherit repository provenance");
  for (const origin of ["https://github.com/other/wiki.git", "https://github.com/on195594/wiki-private.git", "https://github.com@evil.invalid/on195594/wiki.git"]) {
    git("remote", "set-url", "origin", origin);
    assert.equal(collectPublicRawSources(root).size, 0, origin);
  }
  git("remote", "set-url", "origin", "git@github.com:on195594/wiki.git");
  assert.equal(collectPublicRawSources(root).get("source"), url);

  const project = path.join(rawTemp, "site");
  fs.mkdirSync(path.join(project, "scripts"), { recursive: true });
  fs.copyFileSync(path.join(import.meta.dirname, "sync-wiki.ts"), path.join(project, "scripts/sync-wiki.ts"));
  fs.writeFileSync(path.join(project, "package.json"), '{"type":"module"}\n');
  fs.symlinkSync(path.resolve(import.meta.dirname, "../node_modules"), path.join(project, "node_modules"));
  const sync = () => execFileSync(process.execPath, ["--experimental-strip-types", "scripts/sync-wiki.ts"], { cwd: project, env: { ...env, WIKI_ROOT: root } });
  sync();
  for (const file of ["index.md", "schema.md", "concepts/note.md"]) {
    const output = fs.readFileSync(path.join(project, "src/content/docs", file), "utf8");
    assert.ok(output.includes(`[source](${url})`), `Raw source missing from ${file}`);
    assert.ok(output.includes("[target](/concepts/target)"));
    assert.ok(output.includes("`local-only`"));
  }
  const note = fs.readFileSync(path.join(project, "src/content/docs/concepts/note.md"), "utf8");
  sync();
  assert.equal(fs.readFileSync(path.join(project, "src/content/docs/concepts/note.md"), "utf8"), note, "Repeated sync must be stable");
  assert.ok(!fs.existsSync(path.join(project, "src/content/docs/raw")), "Raw content must not be copied");
  git("update-ref", "-d", "refs/remotes/origin/main");
  assert.equal(collectPublicRawSources(root).size, 0, "Missing public snapshot must fail closed");
  sync();
  assert.ok(fs.readFileSync(path.join(project, "src/content/docs/concepts/note.md"), "utf8").includes("`source`"));
  fs.mkdirSync(path.join(rawTemp, "not-a-repo"));
  assert.equal(collectPublicRawSources(path.join(rawTemp, "not-a-repo")).size, 0);
  const oldPath = process.env.PATH;
  try {
    process.env.PATH = path.join(rawTemp, "no-git");
    assert.equal(collectPublicRawSources(root).size, 0, "Unavailable Git must fail closed");
  } finally { process.env.PATH = oldPath; }
  console.log(`[test-sync] ${cases.length} public-source cases plus provenance, rendering, Markdown round-trip and both sync callers passed.`);
} finally {
  fs.rmSync(rawTemp, { recursive: true, force: true });
}

// Run after the production build to exercise Nimbus's actual Markdown exporter.
if (process.argv.includes("--built")) {
  const project = path.resolve(import.meta.dirname, "..");
  const docs = path.join(project, "src/content/docs");
  let pages = 0, links = 0;
  for (const file of fs.readdirSync(docs, { recursive: true, encoding: "utf8" })) {
    if (!file.endsWith(".md") || file === "index.md") continue;
    const urls = new Set<string>();
    function collect(node: Nodes) {
      if (node.type === "link" && /^https:\/\/github\.com\/on195594\/wiki\/blob\/[a-f0-9]{40}\/raw\//.test(node.url)) urls.add(node.url);
      if ("children" in node) node.children.forEach(collect);
    }
    collect(fromMarkdown(fs.readFileSync(path.join(docs, file), "utf8")));
    if (!urls.size) continue;
    const route = file.slice(0, -3);
    const exported = fs.readFileSync(path.join(project, "dist", route, "index.md"), "utf8");
    const html = fs.readFileSync(path.join(project, "dist", route, "index.html"), "utf8");
    const exportedUrls = new Set<string>();
    function collectExport(node: Nodes) {
      if (node.type === "link") exportedUrls.add(node.url);
      if ("children" in node) node.children.forEach(collectExport);
    }
    collectExport(fromMarkdown(exported));
    for (const url of urls) {
      assert.ok(exportedUrls.has(url), `Agent Markdown lost ${url} in ${file}`);
      assert.ok(html.includes(`href="${url}"`), `Browser HTML lost ${url} in ${file}`);
      links++;
    }
    pages++;
  }
  assert.ok(pages > 0 && links > 0, "Build must contain public-source navigation");
  assert.ok(fs.readdirSync(path.join(project, "dist/pagefind")).some((file) => file.endsWith(".pf_meta")), "Pagefind index missing");
  assert.ok(!fs.existsSync(path.join(project, "dist/raw")), "Build must not publish raw documents");
  console.log(`[test-sync] Built browser HTML + Agent Markdown: ${links} public-source URLs across ${pages} pages; Pagefind present, no raw routes.`);
}
