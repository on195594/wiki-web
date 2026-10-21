import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import yaml from "yaml";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";
import type { Definition, Link, Nodes } from "mdast";

export const WIKI_ROOT = process.env.WIKI_ROOT || path.resolve("/home/lin/wiki");
export const OUTPUT_DIR = path.resolve(import.meta.dirname, "../src/content/docs");

export const CATEGORIES = [
  "concepts",
  "entities",
  "operations",
  "comparisons",
  "queries",
  "docs",
];

export const CORE_FILES = [
  { file: "index.md", targetRel: "index.md", route: "/" },
  { file: "SCHEMA.md", targetRel: "schema.md", route: "/schema" },
];

export interface PageMeta {
  sourcePath: string;
  stem: string;
  category: string;
  route: string;
  title: string;
  aliases: string[];
}

export function extractFrontmatterAndBody(content: string): { frontmatterText: string; body: string } {
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

export function slugifyAnchor(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * CommonMark-compliant code span scanner.
 * Matches code spans bounded within paragraphs (cannot cross blank lines \n\s*\n),
 * and handles any arbitrary opening/closing backtick sequence lengths (` vs `` vs ```).
 */
export function protectCodeSpans(text: string, placeholders: string[]): string {
  let result = "";
  let i = 0;
  while (i < text.length) {
    if (text[i] === "`") {
      const start = i;
      while (i < text.length && text[i] === "`") i++;
      const tickCount = i - start;
      const ticks = "`".repeat(tickCount);

      let end = -1;
      let j = i;
      while (j < text.length) {
        if (text[j] === "\n") {
          let k = j + 1;
          while (k < text.length && (text[k] === " " || text[k] === "\t")) k++;
          if (k < text.length && text[k] === "\n") {
            // Reached blank line boundary; CommonMark code spans cannot cross blank lines
            break;
          }
        }
        if (text[j] === "`") {
          const matchStart = j;
          while (j < text.length && text[j] === "`") j++;
          if (j - matchStart === tickCount) {
            end = j;
            break;
          }
          continue;
        }
        j++;
      }

      if (end !== -1) {
        const span = text.slice(start, end);
        const token = `___NIMBUS_INLINE_CODE_${placeholders.length}___`;
        placeholders.push(span);
        result += token;
        i = end;
        continue;
      } else {
        result += ticks;
        continue;
      }
    } else {
      result += text[i];
      i++;
    }
  }
  return result;
}

/**
 * CommonMark fence scanner: a closing fence uses the same character and is at least as long
 * as the opening one; an unclosed fence runs to the end of the content.
 * Indentation is not limited to 3 spaces so fences nested in list items stay protected.
 */
export function protectFencedCode(text: string, placeholders: string[]): string {
  const lines = text.split("\n");
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const open = /^[ \t]*(`{3,}|~{3,})([^]*)$/.exec(lines[i]);
    // A backtick fence's info string cannot contain backticks (otherwise it is an inline span).
    if (!open || (open[1][0] === "`" && open[2].includes("`"))) {
      out.push(lines[i]);
      continue;
    }
    const fenceChar = open[1][0];
    const closeRe = new RegExp(`^[ \\t]*${fenceChar}{${open[1].length},}[ \\t\\r]*$`);
    let end = i + 1;
    while (end < lines.length && !closeRe.test(lines[end])) end++;
    const last = Math.min(end, lines.length - 1);
    const token = `___NIMBUS_FENCED_CODE_${placeholders.length}___`;
    placeholders.push(lines.slice(i, last + 1).join("\n"));
    out.push(token);
    i = last;
  }
  return out.join("\n");
}

export function collectPublicRawSources(wikiRoot = WIKI_ROOT): Map<string, string> {
  const sources = new Map<string, string>();
  const git = (...args: string[]) => execFileSync("git", ["-C", wikiRoot, ...args], {
    encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
  }).trimEnd();
  try {
    if (fs.realpathSync(git("rev-parse", "--show-toplevel")) !== fs.realpathSync(wikiRoot)) return sources;
    const origin = git("config", "--get", "remote.origin.url");
    if (!["https://github.com/on195594/wiki.git", "https://github.com/on195594/wiki", "git@github.com:on195594/wiki.git", "ssh://git@github.com/on195594/wiki.git"].includes(origin)) return sources;
    // Use the published snapshot, never HEAD/the index: local-only sources must stay private.
    const commit = git("rev-parse", "--verify", "refs/remotes/origin/main^{commit}");
    const candidates = new Map<string, Set<string>>();
    for (const entry of git("ls-tree", "-rz", commit, "--", "raw/").split("\0")) {
      const match = /^(100644|100755) blob [a-f0-9]+\t([^]*)$/.exec(entry);
      if (!match) continue;
      const file = match[2];
      if (!file.startsWith("raw/") || !file.endsWith(".md")) continue;
      const keys = [file, file.slice(0, -3), path.posix.basename(file), path.posix.basename(file, ".md")];
      for (const key of keys) {
        const normalized = key.toLowerCase();
        if (!candidates.has(normalized)) candidates.set(normalized, new Set());
        candidates.get(normalized)!.add(file);
      }
    }
    for (const [key, files] of candidates) {
      // Detect ambiguity before filtering unavailable local files.
      if (files.size !== 1) continue;
      const file = [...files][0];
      const parts = file.split("/");
      let current = wikiRoot;
      let safe = true;
      for (const [i, part] of parts.entries()) {
        if (!part || part === "." || part === ".." || /[\\\u0000-\u001f\u007f]/.test(part)) { safe = false; break; }
        current = path.join(current, part);
        if (!fs.existsSync(current)) { safe = false; break; }
        const stat = fs.lstatSync(current);
        if (stat.isSymbolicLink() || (i === parts.length - 1 ? !stat.isFile() : !stat.isDirectory())) { safe = false; break; }
      }
      if (!safe) continue;
      const encoded = parts.map((part) => encodeURIComponent(part).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)).join("/");
      sources.set(key, `https://github.com/on195594/wiki/blob/${commit}/${encoded}`);
    }
  } catch {
    // Missing Git/provenance disables raw navigation, not formal-page synchronization.
    return new Map();
  }
  return sources;
}

export function convertWikilinksInProse(
  content: string,
  routeMap: Map<string, { route: string; title: string }>,
  onConverted?: () => void,
  publicSources: Map<string, string> = new Map(),
): string {
  const codePlaceholders: string[] = [];
  // Protect parser-recognized literals too (indented/quoted code and existing links).
  const literalRanges: { start: number; end: number }[] = [];
  function collectLiterals(node: Nodes) {
    // CommonMark may parse the inner [target] of [[target]] as a shortcut reference.
    if (node.type === "linkReference" && node.referenceType === "shortcut"
      && content[node.position!.start.offset! - 1] === "[" && content[node.position!.end.offset!] === "]") return;
    if (["code", "inlineCode", "link", "linkReference", "image", "imageReference", "definition", "html"].includes(node.type)) {
      literalRanges.push({ start: node.position!.start.offset!, end: node.position!.end.offset! });
    } else if ("children" in node) node.children.forEach(collectLiterals);
  }
  collectLiterals(fromMarkdown(content));
  let text = content;
  for (const { start, end } of literalRanges.sort((a, b) => b.start - a.start)) {
    const token = `___NIMBUS_FENCED_CODE_${codePlaceholders.length}___`;
    codePlaceholders.push(content.slice(start, end));
    text = text.slice(0, start) + token + text.slice(end);
  }

  // 1. Protect multi-line fenced code blocks (``` or ~~~)
  text = protectFencedCode(text, codePlaceholders);

  // 2. Protect inline code spans matching CommonMark block and delimiter rules
  text = protectCodeSpans(text, codePlaceholders);

  // 3. Convert [[wikilinks]] strictly in prose
  text = text.replace(/\[\[([^\]]+)\]\]/g, (_match, innerText: string) => {
    if (onConverted) onConverted();
    // A wikilink label can contain parser-recognized literals; serialize their text, not tokens.
    innerText = innerText.replace(/___NIMBUS_(?:INLINE|FENCED)_CODE_(\d+)___/g, (_, idx) => codePlaceholders[Number(idx)] ?? "");
    const [linkPart, labelPart] = innerText.split("|").map((s) => s.trim());
    const [targetName, anchor] = linkPart.split("#").map((s) => s.trim());

    if (!targetName && anchor) {
      const label = labelPart || anchor;
      return `[${label}](#${slugifyAnchor(anchor)})`;
    }

    const lookup = routeMap.get(targetName) || routeMap.get(targetName.toLowerCase());
    if (lookup) {
      const url = anchor ? `${lookup.route}#${slugifyAnchor(anchor)}` : lookup.route;
      const label = labelPart || targetName;
      return `[${label}](${url})`;
    }

    const sourceUrl = publicSources.get(targetName.toLowerCase());
    if (sourceUrl) {
      const url = anchor ? `${sourceUrl}#${slugifyAnchor(anchor)}` : sourceUrl;
      return toMarkdown({ type: "root", children: [{ type: "paragraph", children: [{
        type: "link", url, children: [{ type: "text", value: labelPart || targetName }],
      }] }] }, { unsafe: [{ character: "|" }] }).trimEnd();
    }

    // Unresolved/private/ambiguous sources remain non-navigable, even with Markdown in labels.
    return toMarkdown({ type: "root", children: [{ type: "paragraph", children: [{
      type: "inlineCode", value: labelPart || linkPart,
    }] }] }).trimEnd();
  });

  // 4. Restore inline code spans
  text = text.replace(/___NIMBUS_INLINE_CODE_(\d+)___/g, (_, idx) => {
    return codePlaceholders[Number(idx)] ?? "";
  });

  // 5. Restore fenced code blocks
  text = text.replace(/___NIMBUS_FENCED_CODE_(\d+)___/g, (_, idx) => {
    return codePlaceholders[Number(idx)] ?? "";
  });

  return text;
}

export function convertMarkdownLinks(
  content: string,
  sourcePath: string,
  sourceRoutes: Map<string, string>,
  wikiRoot = WIKI_ROOT,
): string {
  const tree = fromMarkdown(content);
  const definitions = new Map<string, Definition>();
  const edits: { start: number; end: number; text: string }[] = [];
  function collect(node: Nodes) {
    if (node.type === "definition" && !definitions.has(node.identifier)) definitions.set(node.identifier, node);
    if ("children" in node) node.children.forEach(collect);
  }
  collect(tree);
  function visit(node: Nodes) {
    const definition = node.type === "linkReference" ? definitions.get(node.identifier) : undefined;
    const link: Link | undefined = node.type === "link" ? node : definition && node.type === "linkReference"
      ? { type: "link", url: definition.url, title: definition.title, children: node.children } : undefined;
    if (link) {
      const url = link.url;
      if (/^(?:[a-z][a-z\d+.-]*:|[/#?])/i.test(url)) return;
      const [, encodedPath, suffix = ""] = /^([^?#]*)([?#].*)?$/.exec(url)!;
      let pathname: string;
      try { pathname = decodeURIComponent(encodedPath); } catch { return; }
      if (!pathname.endsWith(".md")) return;
      const target = path.resolve(path.dirname(sourcePath), pathname);
      const relative = path.relative(wikiRoot, target);
      if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) return;
      if (!fs.existsSync(target) || !fs.lstatSync(target).isFile()) return;
      const realRelative = path.relative(fs.realpathSync(wikiRoot), fs.realpathSync(target));
      if (realRelative === ".." || realRelative.startsWith(`..${path.sep}`) || path.isAbsolute(realRelative)) return;
      const destination = sourceRoutes.get(target)
        ?? `https://github.com/on195594/wiki/blob/main/${relative.split(path.sep).map(encodeURIComponent).join("/")}`;
      // Reify only changed link references; shared image definitions stay untouched.
      // Isolated link serialization must still escape table cell delimiters.
      const text = toMarkdown({ type: "root", children: [{ type: "paragraph", children: [{ ...link, url: destination + suffix }] }] }, { unsafe: [{ character: "|" }] }).trimEnd();
      edits.push({ start: node.position!.start.offset!, end: node.position!.end.offset!, text });
      return;
    }
    if ("children" in node) node.children.forEach(visit);
  }
  visit(tree);
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    content = content.slice(0, edit.start) + edit.text + content.slice(edit.end);
  }
  return content;
}

export async function syncWiki() {
  console.log(`[sync-wiki] Reading from Wiki root: ${WIKI_ROOT}`);
  console.log(`[sync-wiki] Output directory: ${OUTPUT_DIR}`);

  if (!fs.existsSync(WIKI_ROOT)) {
    console.log(`[sync-wiki] WIKI_ROOT not found at ${WIKI_ROOT}. Using committed content in ${OUTPUT_DIR}.`);
    return;
  }

  const pages: PageMeta[] = [];
  const routeMap = new Map<string, { route: string; title: string }>();
  const sourceRoutes = new Map<string, string>();

  // 1. Collect all pages
  for (const cat of CATEGORIES) {
    const dir = path.join(WIKI_ROOT, cat);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir, { recursive: true, encoding: "utf8" }).filter((f) => f.endsWith(".md"));
    for (const f of files) {
      const sourcePath = path.join(dir, f);
      const stem = path.basename(f, ".md");
      const route = `/${cat}/${f.replace(/\.md$/, "").split(path.sep).join("/")}`;
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
      sourceRoutes.set(sourcePath, route);

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
    sourceRoutes.set(sourcePath, core.route);
  }

  const publicSources = collectPublicRawSources();
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

    // Convert [[wikilinks]] strictly in prose, protecting inline code and code blocks
    const transformedBody = convertWikilinksInProse(convertMarkdownLinks(body, page.sourcePath, sourceRoutes), routeMap, () => {
      wikilinksConverted++;
    }, publicSources);

    // Reconstruct file
    const newFrontmatterStr = yaml.stringify(frontmatterObj).trim();
    const finalContent = `---\n${newFrontmatterStr}\n---\n\n${transformedBody}\n`;

    const destFile = path.join(OUTPUT_DIR, path.relative(WIKI_ROOT, page.sourcePath));
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
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

    const transformedBody = convertWikilinksInProse(convertMarkdownLinks(body, sourcePath, sourceRoutes), routeMap, () => {
      wikilinksConverted++;
    }, publicSources);

    const newFrontmatterStr = yaml.stringify(frontmatterObj).trim();
    const finalContent = `---\n${newFrontmatterStr}\n---\n\n${transformedBody}\n`;
    const destFile = path.join(OUTPUT_DIR, core.targetRel);
    fs.writeFileSync(destFile, finalContent, "utf-8");
  }

  console.log(`[sync-wiki] Done! Converted ${wikilinksConverted} wikilinks across ${pages.length} pages (exact code delimiter matching).`);
}

// Execute directly if run as main script
if (import.meta.filename === process.argv[1]) {
  syncWiki().catch((err) => {
    console.error("[sync-wiki] Fatal error:", err);
    process.exit(1);
  });
}
