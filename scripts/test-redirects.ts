import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const redirects = fs.readFileSync(path.join(root, "public/_redirects"), "utf8");
// Keep the historical contract independent of the rules so deleting a whole group fails.
const renamedPages = [
  ["queries/my-investment-pre-trade-checklist", "queries/pre-trade-risk-checklist"],
  ["queries/when-i-should-not-trade", "queries/when-not-to-trade"],
  ["queries/how-i-should-review-a-losing-position", "queries/losing-position-review-method"],
  ["queries/how-i-should-scale-into-and-out-of-a-position", "queries/position-scaling-method"],
  ["queries/how-i-should-size-a-position", "queries/position-sizing-method"],
  ["queries/how-i-should-handle-a-winning-position", "queries/winning-position-risk-management"],
  ["queries/how-i-should-decide-between-doing-nothing-and-taking-action", "queries/inaction-vs-action-decision-framework"],
  ["queries/how-i-should-build-a-post-trade-review-loop", "queries/post-trade-review-loop"],
  ["queries/how-i-should-detect-repeat-mistakes-in-my-trading", "queries/repeat-mistake-detection-in-trading"],
  ["queries/how-i-should-convert-trading-lessons-into-hard-rules", "queries/trading-lessons-to-hard-rules"],
  ["queries/how-i-should-keep-my-trading-system-small-and-executable", "queries/minimal-executable-trading-system"],
  ["queries/how-i-should-use-these-two-investment-frameworks", "queries/combining-two-investment-frameworks"],
  ["concepts/personal-investment-operating-rules", "concepts/investment-risk-control-framework"],
  ["concepts/personal-finance-and-education-fund-model", "concepts/household-fund-layering-model"],
];
const rules = new Map<string, string>();
for (const line of redirects.split(/\r?\n/).map((line) => line.trim())) {
  if (!line || line.startsWith("#")) continue;
  const fields = line.split(/\s+/);
  assert.equal(fields.length, 3, `Invalid rule: ${line}`);
  const [from, to, status] = fields;
  assert.match(from, /^\/[\w/.-]+$/, `Expected an exact local path: ${line}`);
  assert.match(to, /^\/[\w/.-]+$/, `Expected a local target: ${line}`);
  assert.equal(status, "301", `Expected a permanent redirect: ${line}`);
  assert.ok(!rules.has(from), `Duplicate source: ${from}`);
  rules.set(from, to);
}
for (const start of rules.keys()) {
  const visited = new Set<string>();
  let current = start;
  while (rules.has(current)) {
    assert.ok(!visited.has(current), `Redirect cycle from ${start}`);
    visited.add(current);
    current = rules.get(current)!;
  }
}
for (const [old, target] of renamedPages) {
  assert.ok(fs.existsSync(path.join(root, "src/content/docs", `${target}.md`)), `Missing page: ${target}`);
  for (const suffix of ["", "/", "/index.md"]) {
    assert.equal(rules.get(`/${old}${suffix}`), `/${target}${suffix}`, `Missing/wrong redirect: /${old}${suffix}`);
  }
}
console.log(`[test-redirects] ${renamedPages.length} rename mappings: HTML + Markdown rules, targets and cycles passed.`);

if (process.argv.includes("--built")) {
  assert.equal(fs.readFileSync(path.join(root, "dist/_redirects"), "utf8"), redirects, "Build dropped/changed redirects");
  const { unstable_dev } = await import("wrangler");
  const worker = await unstable_dev("", {
    config: path.join(root, "wrangler.jsonc"), local: true, ip: "127.0.0.1", port: 0,
    inspectorPort: 0, persist: false, logLevel: "error",
    experimental: { disableExperimentalWarning: true, disableDevRegistry: true, watch: false },
  });
  const origin = `http://${worker.address}:${worker.port}`;
  try {
    for (const [old, target] of renamedPages) {
      for (const suffix of ["", "/", "/index.md"]) {
        const destination = `/${target}${suffix}`;
        const response = await fetch(`${origin}/${old}${suffix}`, { redirect: "manual" });
        assert.equal(response.status, 301, `/${old}${suffix}`);
        assert.equal(response.headers.get("location"), destination);
        await response.arrayBuffer();
        const visited = new Set<string>();
        let url = new URL(destination, origin);
        while (true) {
          assert.equal(url.origin, origin, "Redirect escaped the local site");
          assert.ok(!visited.has(url.href) && visited.size < 5, `Redirect loop: ${url}`);
          visited.add(url.href);
          const result = await fetch(url, { redirect: "manual" });
          const body = await result.text();
          if ([301, 302, 303, 307, 308].includes(result.status)) {
            const location = result.headers.get("location");
            assert.ok(location, `Missing redirect location: ${url}`);
            url = new URL(location, url);
            continue;
          }
          assert.equal(result.status, 200, `${url}`);
          const markdown = suffix === "/index.md";
          assert.equal(url.pathname, `/${target}${markdown ? suffix : "/"}`);
          assert.match(result.headers.get("content-type") ?? "", markdown ? /^text\/markdown\b/ : /^text\/html\b/);
          assert.equal(body, fs.readFileSync(path.join(root, "dist", target, markdown ? "index.md" : "index.html"), "utf8"));
          break;
        }
      }
    }
    console.log(`[test-redirects] Cloudflare local assets: all ${renamedPages.length} groups redirect to the exact built HTML/Markdown content without loops.`);
  } finally {
    await worker.stop();
  }
} else {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "wiki-redirects-test-"));
  try {
    const fixture = path.join(temp, "web");
    const source = path.join(temp, "wiki");
    fs.mkdirSync(path.join(fixture, "scripts"), { recursive: true });
    fs.mkdirSync(path.join(fixture, "public"));
    fs.mkdirSync(path.join(fixture, "src/content/docs/queries"), { recursive: true });
    fs.mkdirSync(source);
    fs.writeFileSync(path.join(source, "index.md"), "---\ntitle: Sync fixture\n---\n\nFixture.\n");
    fs.writeFileSync(path.join(fixture, "src/content/docs/queries/stale.md"), "stale");
    fs.writeFileSync(path.join(fixture, "public/_redirects"), redirects);
    fs.writeFileSync(path.join(fixture, "package.json"), '{"type":"module"}\n');
    fs.copyFileSync(path.join(root, "scripts/sync-wiki.ts"), path.join(fixture, "scripts/sync-wiki.ts"));
    fs.symlinkSync(path.join(root, "node_modules"), path.join(fixture, "node_modules"), "dir");
    for (const wikiRoot of [source, source, path.join(temp, "missing-wiki")]) {
      execFileSync(process.execPath, ["--experimental-strip-types", "scripts/sync-wiki.ts"], {
        cwd: fixture, env: { ...process.env, WIKI_ROOT: wikiRoot }, stdio: "pipe",
      });
      assert.equal(fs.readFileSync(path.join(fixture, "public/_redirects"), "utf8"), redirects, "Wiki sync changed redirects");
      assert.match(fs.readFileSync(path.join(fixture, "src/content/docs/index.md"), "utf8"), /Fixture\./);
      assert.ok(!fs.existsSync(path.join(fixture, "src/content/docs/queries/stale.md")));
    }
    console.log("[test-redirects] Fresh sync, repeat sync and missing-Wiki fallback preserve compatibility rules.");
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}
