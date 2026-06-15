import { defineCollection, z } from "astro:content";

const workCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    cover: z.string().optional(),
    tech: z.array(z.string()).default([]),
    links: z
      .object({
        github: z.string().optional(),
        demo: z.string().optional(),
      })
      .optional(),
    lifeRef: z.string().optional(),
  }),
});

const lifeCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    images: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    workRef: z.string().optional(),
    layout: z.enum(["featured", "normal"]).default("normal"),
  }),
});

export const collections = {
  work: workCollection,
  life: lifeCollection,
};
