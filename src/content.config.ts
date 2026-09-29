import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { docsCollection, partialsCollection } from "@cloudflare/nimbus-docs/content";

const dateOrString = z.union([z.string(), z.date()]).transform((val) => {
  if (val instanceof Date) {
    return val.toISOString().split("T")[0];
  }
  return String(val);
}).optional();

export const collections = {
  docs: defineCollection(
    docsCollection({
      strictFrontmatter: false,
      schemaFields: {
        created: dateOrString,
        updated: dateOrString,
        verified_at: dateOrString,
        review_by: dateOrString,
        audience: z.literal("human").optional(),
        aiGenerated: z.boolean().optional(),
      },
    }),
  ),
  partials: defineCollection(partialsCollection()),
};
