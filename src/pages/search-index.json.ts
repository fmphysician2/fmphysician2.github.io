import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { PILLAR_MAP } from '../consts';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const items = posts
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((p) => ({
      t: p.data.title,
      a: p.data.answer,
      u: `/${p.data.slug ?? p.id}/`,
      d: p.data.doctor,
      p: PILLAR_MAP[p.data.pillar].name,
      g: p.data.tags,
      c: p.data.cover ?? null,
      y: p.data.pubDate.toISOString().slice(0, 10),
      b: (p.body ?? '').replace(/[#*`>\[\]()]/g, ' ').replace(/\s+/g, ' ').slice(0, 1200),
    }));
  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
