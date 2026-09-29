import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";

const WIKI_ROOT = process.env.WIKI_ROOT || path.resolve("/home/lin/wiki");
const OUTPUT_DIR = path.resolve(import.meta.dirname, "../src/content/docs");

const CATEGORIES = [
  "concepts",
  "entities",
  "operations",
  "comparisons",
  "queries",
  "docs",
];

const CORE_FILES = [
  { file: "index.md", targetRel: "index.md", route: "/" },
  { file: "SCHEMA.md", targetRel: "schema.md", route: "/schema" },
];

interface PageMeta {
  sourcePath: string;
  stem: string;
  category: string;
  route: string;
  title: string;
  aliases: string[];
}

function extractFrontmatterAndBody(content: string): { frontmatterText: string; body: string } {
  if (content.startsWith("---")) {
    const end = content.indexOf("\n---", 3);
    if (end !== -1) {
      return {
        frontmatterText: content.slice(3, end).trim(),
        body: content.slice(end + 4).trimStart(),
      };
    }
  }
  return { frontmatterText: "", body: content };
}

function slugifyAnchor(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-");
}

async function main() {
  console.log(`[sync-wiki] Reading from Wiki root: ${WIKI_ROOT}`);
  console.log(`[sync-wiki] Output directory: ${OUTPUT_DIR}`);

  if (!fs.existsSync(WIKI_ROOT)) {
    console.error(`Error: WIKI_ROOT does not exist at ${WIKI_ROOT}`);
    process.exit(1);
  }

  const pages: PageMeta[] = [];
  const routeMap = new Map<string, { route: string; title: string }>();

  // 1. Collect all pages
  for (const cat of CATEGORIES) {
    const dir = path.join(WIKI_ROOT, cat);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    for (const f of files) {
      const sourcePath = path.join(dir, f);
      const stem = f.replace(/\.md$/, "");
      const route = `/${cat}/${stem}`;
      const raw = fs.readFileSync(sourcePath, "utf-8");
      const { frontmatterText } = extractFrontmatterAndBody(raw);

      let title = stem;
      let aliases: string[] = [];

      if (frontmatterText) {
        try {
          const parsed = yaml.parse(frontmatterText);
          if (parsed && typeof parsed === "object") {
            if (parsed.title) title = String(parsed.title);
            if (Array.isArray(parsed.aliases)) {
              aliases = parsed.aliases.map(String);
            }
          }
        } catch {
          // ignore yaml parse errors for titles
        }
      }

      const meta: PageMeta = {
        sourcePath,
        stem,
        category: cat,
        route,
        title,
        aliases,
      };
      pages.push(meta);

      routeMap.set(stem, { route, title });
      routeMap.set(stem.toLowerCase(), { route, title });
      for (const a of aliases) {
        routeMap.set(a, { route, title });
        routeMap.set(a.toLowerCase(), { route, title });
      }
    }
  }

  // Add core files
  for (const core of CORE_FILES) {
    const sourcePath = path.join(WIKI_ROOT, core.file);
    if (!fs.existsSync(sourcePath)) continue;
    const stem = core.file.replace(/\.md$/, "").toLowerCase();
    const raw = fs.readFileSync(sourcePath, "utf-8");
    const { frontmatterText } = extractFrontmatterAndBody(raw);
    let title = core.file.replace(/\.md$/, "");
    if (frontmatterText) {
      try {
        const parsed = yaml.parse(frontmatterText);
        if (parsed?.title) title = String(parsed.title);
      } catch {}
    }
    routeMap.set(stem, { route: core.route, title });
    routeMap.set(core.file, { route: core.route, title });
  }

  console.log(`[sync-wiki] Indexed ${pages.length} formal wiki pages.`);

  // 2. Clear previous generated dirs in OUTPUT_DIR
  for (const cat of CATEGORIES) {
    const targetDir = path.join(OUTPUT_DIR, cat);
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 3. Process and write formal pages
  let wikilinksConverted = 0;

  for (const page of pages) {
    const raw = fs.readFileSync(page.sourcePath, "utf-8");
    const { frontmatterText, body } = extractFrontmatterAndBody(raw);

    let frontmatterObj: Record<string, any> = {};
    if (frontmatterText) {
      try {
        frontmatterObj = yaml.parse(frontmatterText) || {};
      } catch (e) {
        console.warn(`[sync-wiki] Warning: frontmatter parse error in ${page.stem}:`, e);
      }
    }

    if (!frontmatterObj.title) {
      frontmatterObj.title = page.title;
    }

    // Convert [[wikilinks]]
    const transformedBody = body.replace(/\[\[([^\]]+)\]\]/g, (match, innerText: string) => {
      wikilinksConverted++;
      const [linkPart, labelPart] = innerText.split("|").map((s) => s.trim());
      const [targetName, anchor] = linkPart.split("#").map((s) => s.trim());

      if (!targetName && anchor) {
        // [[#Section]]
        const label = labelPart || anchor;
        return `[${label}](#${slugifyAnchor(anchor)})`;
      }

      const lookup = routeMap.get(targetName) || routeMap.get(targetName.toLowerCase());
      if (lookup) {
        const url = anchor ? `${lookup.route}#${slugifyAnchor(anchor)}` : lookup.route;
        const label = labelPart || targetName;
        return `[${label}](${url})`;
      }

      // External or raw sources (e.g. [[raw/articles/...]], [[docs:...]])
      if (targetName.startsWith("raw/") || targetName.startsWith("docs:") || targetName.startsWith("http")) {
        return `\`${labelPart || linkPart}\``;
      }

      // Fallback: keep readable label as code or text
      return `\`${labelPart || linkPart}\``;
    });

    // Reconstruct file
    const newFrontmatterStr = yaml.stringify(frontmatterObj).trim();
    const finalContent = `---\n${newFrontmatterStr}\n---\n\n${transformedBody}\n`;

    const destFile = path.join(OUTPUT_DIR, page.category, `${page.stem}.md`);
    fs.writeFileSync(destFile, finalContent, "utf-8");
  }

  // 4. Process core files
  for (const core of CORE_FILES) {
    const sourcePath = path.join(WIKI_ROOT, core.file);
    if (!fs.existsSync(sourcePath)) continue;

    const raw = fs.readFileSync(sourcePath, "utf-8");
    const { frontmatterText, body } = extractFrontmatterAndBody(raw);
    let frontmatterObj: Record<string, any> = {};
    if (frontmatterText) {
      try {
        frontmatterObj = yaml.parse(frontmatterText) || {};
      } catch {}
    }
    if (!frontmatterObj.title) {
      frontmatterObj.title = core.file === "index.md" ? "Agent Shared Wiki" : "Wiki Schema";
    }

    const transformedBody = body.replace(/\[\[([^\]]+)\]\]/g, (match, innerText: string) => {
      const [linkPart, labelPart] = innerText.split("|").map((s) => s.trim());
      const [targetName, anchor] = linkPart.split("#").map((s) => s.trim());
      const lookup = routeMap.get(targetName) || routeMap.get(targetName.toLowerCase());
      if (lookup) {
        const url = anchor ? `${lookup.route}#${slugifyAnchor(anchor)}` : lookup.route;
        const label = labelPart || targetName;
        return `[${label}](${url})`;
      }
      return `\`${labelPart || linkPart}\``;
    });

    const newFrontmatterStr = yaml.stringify(frontmatterObj).trim();
    const finalContent = `---\n${newFrontmatterStr}\n---\n\n${transformedBody}\n`;
    const destFile = path.join(OUTPUT_DIR, core.targetRel);
    fs.writeFileSync(destFile, finalContent, "utf-8");
  }

  console.log(`[sync-wiki] Done! Converted ${wikilinksConverted} wikilinks across ${pages.length} pages.`);
}

main().catch((err) => {
  console.error("[sync-wiki] Fatal error:", err);
  process.exit(1);
});
