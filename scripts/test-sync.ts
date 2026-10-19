import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { renderMarkdown } from "@cloudflare/nimbus-docs/markdown";
import { convertMarkdownLinks, convertWikilinksInProse } from "./sync-wiki.ts";

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
