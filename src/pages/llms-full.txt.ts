import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, DOCTORS, PILLAR_MAP, DISCLAIMER } from '../consts';

// llms-full.txt：全站內容的單檔純文字版，讓模型一次取得完整脈絡。
export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const out: string[] = [];
  out.push(`# ${SITE.name}｜${SITE.tagline}`, '', `> ${SITE.description}`, '');
  out.push(`作者：${Object.values(DOCTORS).map((d) => `${d.entityLine}（${d.jobTitle}，專長：${d.expertise.join('、')}）`).join('；')}`, '');
  out.push('---', '');

  for (const p of posts) {
    const d = p.data;
    out.push(`# ${d.title}`, '');
    out.push(`來源：${SITE.url}/${d.slug ?? p.id}/`);
    out.push(`作者：${DOCTORS[d.doctor].entityLine}（${DOCTORS[d.doctor].jobTitle}）`);
    out.push(`分類：${PILLAR_MAP[d.pillar].name}｜發布：${d.pubDate.toISOString().slice(0, 10)}`, '');
    out.push(`**一句話結論：** ${d.answer}`, '');
    out.push(p.body ?? '', '');
    out.push(`_${DISCLAIMER}_`, '', '---', '');
  }
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
