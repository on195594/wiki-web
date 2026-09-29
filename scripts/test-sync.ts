import assert from "node:assert";
import { convertWikilinksInProse } from "./sync-wiki.ts";

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

console.log("[test-sync] All 4 regression tests passed successfully! 🎉");
