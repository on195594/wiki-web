import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import nimbus, {
  defineConfig as defineNimbusConfig,
} from "@cloudflare/nimbus-docs";
import { tableScroll } from "@cloudflare/nimbus-docs/markdown";

// Resolve production site origin: dynamic via env or fallback to custom domain
const siteUrl = process.env.SITE_URL || process.env.CF_PAGES_URL || "https://wiki.keyi.win";

const nimbusConfig = defineNimbusConfig({
  site: siteUrl,
  title: "Agent Shared Wiki",
  description: "Cross-agent reusable knowledge base and digital garden.",
  locale: "en",
  github: "https://github.com/on195594/wiki",
  socialImageAlt: "Agent Shared Wiki preview",
});

export default defineConfig({
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  integrations: [
    nimbus(nimbusConfig, {
      rules: {
        "nimbus/frontmatter-shape": "warn",
        "nimbus/internal-link": "warn",
      },
      markdown: {
        hastPlugins: [tableScroll()],
      },
    }),
  ],
});
