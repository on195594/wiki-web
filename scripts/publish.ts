import { execSync } from "node:child_process";
import path from "node:path";
import { syncWiki } from "./sync-wiki.ts";

async function publish() {
  const rootDir = path.resolve(import.meta.dirname, "..");

  console.log("==========================================");
  console.log("🚀 Starting Wiki Sync & Auto-Publish Flow");
  console.log("==========================================\n");

  // Step 1: Run Markdown sync from wiki to src/content/docs
  console.log("📦 [1/4] Syncing documents from /home/lin/wiki...");
  await syncWiki();

  // Step 2: Check for file changes in docs
  console.log("\n🔍 [2/4] Checking for changes in src/content/docs...");
  const statusOutput = execSync("git status --porcelain src/content/docs", {
    cwd: rootDir,
    encoding: "utf-8",
  }).trim();

  if (!statusOutput) {
    console.log("✨ No document changes detected. Everything is already up to date!");
    console.log("🌐 Production URL: https://wiki.keyi.win/\n");
    return;
  }

  console.log("📝 Detected the following changes:");
  console.log(statusOutput);

  // Step 3: Git add and commit
  console.log("\n💾 [3/4] Staging and committing changes...");
  execSync("git add src/content/docs", { cwd: rootDir, stdio: "inherit" });

  const now = new Date();
  const timestamp = now.toISOString().replace("T", " ").slice(0, 19);
  const commitMessage = `docs: sync wiki updates (${timestamp})`;

  execSync(`git commit -m "${commitMessage}"`, { cwd: rootDir, stdio: "inherit" });

  // Step 4: Git push to origin/main
  console.log("\n🚀 [4/4] Pushing changes to GitHub (origin/main)...");
  execSync("git push origin main", { cwd: rootDir, stdio: "inherit" });

  console.log("\n==========================================");
  console.log("✅ Successfully published to GitHub!");
  console.log("⚡ Cloudflare Pages is building the update.");
  console.log("🌐 Live in ~1 minute at: https://wiki.keyi.win/");
  console.log("==========================================\n");
}

publish().catch((err) => {
  console.error("\n❌ Publish failed:", err);
  process.exit(1);
});
