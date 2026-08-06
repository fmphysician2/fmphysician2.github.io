import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 文章欄位規則。底線開頭的檔案（例如範本）不會被讀取。
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/[!_]*.md' }),
  schema: z.object({
    title: z.string().min(6),

    // 文章開頭的摘要，同時用於頁面摘要區、meta description 與分享卡片。
    answer: z.string()
      .min(35, '摘要太短，請寫 40–60 字')
      .max(75, '摘要太長，請控制在 40–60 字'),

    doctor: z.enum(['余貴華', '陳爰邑']),
    pillar: z.enum(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7']),

    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),

    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),

    // 自訂網址（預設用 title）。中文問句，不含問號與標點。
    slug: z.string().optional(),

    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
