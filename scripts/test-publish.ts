import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wiki-publish-test-"));
const gitEnv = {
  ...process.env,
  GIT_CONFIG_GLOBAL: "/dev/null",
  GIT_CONFIG_SYSTEM: "/dev/null",
  GIT_TERMINAL_PROMPT: "0",
};

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd, env: gitEnv, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function fixture(name: string) {
  const root = path.join(tempRoot, name);
  const remote = path.join(root, "remote.git");
  const repo = path.join(root, "publisher");
  const peer = path.join(root, "peer");
  const source = path.join(root, "wiki");
  fs.mkdirSync(root);
  git(root, "init", "--bare", "--initial-branch=main", remote);
  git(root, "clone", remote, repo);
  git(repo, "config", "user.name", "Publish Test");
  git(repo, "config", "user.email", "publish-test@example.invalid");
  fs.mkdirSync(path.join(repo, "scripts"));
  for (const script of ["publish.ts", "sync-wiki.ts"]) {
    fs.copyFileSync(path.join(projectRoot, "scripts", script), path.join(repo, "scripts", script));
  }
  fs.writeFileSync(path.join(repo, "package.json"), '{"type":"module"}\n');
  fs.writeFileSync(path.join(repo, ".gitignore"), "node_modules/\n");
  fs.symlinkSync(path.join(projectRoot, "node_modules"), path.join(repo, "node_modules"), "dir");
  fs.mkdirSync(source);
  fs.writeFileSync(path.join(source, "index.md"), "# Initial Wiki\n");
  const env = { ...gitEnv, WIKI_ROOT: source };
  execFileSync(process.execPath, ["--experimental-strip-types", "scripts/sync-wiki.ts"], { cwd: repo, env });
  git(repo, "add", ".");
  git(repo, "commit", "-m", "fixture baseline");
  git(repo, "push", "origin", "main");
  git(root, "clone", remote, peer);
  git(peer, "config", "user.name", "Remote Test");
  git(peer, "config", "user.email", "remote-test@example.invalid");
  return { repo, remote, peer, source, env };
}

type Fixture = ReturnType<typeof fixture>;

function publish(f: Fixture) {
  return spawnSync(process.execPath, ["--experimental-strip-types", "scripts/publish.ts"], {
    cwd: f.repo, env: f.env, encoding: "utf8",
  });
}

function success(f: Fixture) {
  const result = publish(f);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(git(f.remote, "rev-parse", "main"), git(f.repo, "rev-parse", "HEAD"), "Pending commit was not pushed");
  assert.equal(git(f.repo, "status", "--porcelain"), "");
}

function pendingDocs(f: Fixture) {
  fs.writeFileSync(path.join(f.source, "index.md"), "# Updated Wiki\n");
  execFileSync(process.execPath, ["--experimental-strip-types", "scripts/sync-wiki.ts"], { cwd: f.repo, env: f.env });
  git(f.repo, "add", "src/content/docs");
  git(f.repo, "commit", "-m", "previous attempt committed docs");
}

function remoteUpdate(f: Fixture, file: string, content: string) {
  fs.writeFileSync(path.join(f.peer, file), content);
  git(f.peer, "add", file);
  git(f.peer, "commit", "-m", "remote update");
  git(f.peer, "push", "origin", "main");
}

const cases: [string, (f: Fixture) => void][] = [
  ["fresh-sync-and-idempotent-rerun", (f) => {
    fs.writeFileSync(path.join(f.source, "index.md"), "# Updated Wiki\n");
    success(f);
    const head = git(f.repo, "rev-parse", "HEAD");
    success(f);
    assert.equal(git(f.repo, "rev-parse", "HEAD"), head, "Clean rerun created an extra commit");
  }],
  ["retry-already-committed-docs", (f) => {
    pendingDocs(f);
    success(f);
  }],
  ["remote-update-before-new-docs", (f) => {
    remoteUpdate(f, "dependency.txt", "remote dependency update\n");
    fs.writeFileSync(path.join(f.source, "index.md"), "# Updated Wiki\n");
    success(f);
    assert.equal(git(f.repo, "show", "HEAD:dependency.txt"), "remote dependency update");
  }],
  ["diverged-retry-preserves-remote-update", (f) => {
    pendingDocs(f);
    remoteUpdate(f, "dependency.txt", "remote dependency update\n");
    success(f);
    assert.equal(git(f.repo, "show", "HEAD:dependency.txt"), "remote dependency update");
    assert.match(git(f.remote, "show", "main:src/content/docs/index.md"), /# Updated Wiki/);
  }],
  ["nested-wiki-route-links-and-code", (f) => {
    const nestedDir = path.join(f.source, "concepts", "nested");
    fs.mkdirSync(nestedDir, { recursive: true });
    fs.writeFileSync(path.join(nestedDir, "target.md"), "---\ntitle: Nested Target\naliases: [nested-alias]\n---\n\nNested content.\n");
    fs.writeFileSync(path.join(f.source, "index.md"), "# Wiki\n\n[[target]] and [[nested-alias|Alias]] and [[target#Section Heading]].\n\n`[[target]]`\n\n```markdown\n[[target]]\n```\n");
    success(f);
    const index = git(f.remote, "show", "main:src/content/docs/index.md");
    assert.match(index, /\[target\]\(\/concepts\/nested\/target\)/);
    assert.match(index, /\[Alias\]\(\/concepts\/nested\/target\)/);
    assert.match(index, /\[target\]\(\/concepts\/nested\/target#section-heading\)/);
    assert.ok(index.includes("`[[target]]`"));
    assert.ok(index.includes("```markdown\n[[target]]\n```"));
    assert.match(git(f.remote, "show", "main:src/content/docs/concepts/nested/target.md"), /Nested content\./);
  }],
  ["content-conflict-fails-without-pushing", (f) => {
    pendingDocs(f);
    remoteUpdate(f, "src/content/docs/index.md", "---\ntitle: Remote Wiki\n---\n\n# Conflicting remote content\n");
    const remoteHead = git(f.remote, "rev-parse", "main");
    const result = publish(f);
    assert.notEqual(result.status, 0, "Conflicting content must fail, not silently skip or overwrite");
    assert.equal(git(f.remote, "rev-parse", "main"), remoteHead, "Conflict changed remote main");
  }],
];

let failures = 0;
try {
  for (const [name, check] of cases) {
    try {
      check(fixture(name));
      console.log(`✓ ${name}`);
    } catch (error) {
      failures++;
      console.error(`✗ ${name}:`, error);
    }
  }
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
assert.equal(failures, 0, `${failures} publish regression tests failed`);
console.log(`[test-publish] All ${cases.length} local-Git integration tests passed.`);
