import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const items = posts.map((p) => `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${SITE.url}/${p.data.slug ?? p.id}/</link>
      <guid isPermaLink="true">${SITE.url}/${p.data.slug ?? p.id}/</guid>
      <description>${esc(p.data.answer)}</description>
      <pubDate>${p.data.pubDate.toUTCString()}</pubDate>
      <author>${esc(p.data.doctor)} 醫師</author>
    </item>`).join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${esc(SITE.name)}｜${esc(SITE.tagline)}</title>
  <link>${SITE.url}/</link>
  <description>${esc(SITE.description)}</description>
  <language>zh-tw</language>
${items}
</channel></rss>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
