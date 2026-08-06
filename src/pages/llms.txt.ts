import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, DOCTORS, PILLARS, PILLAR_MAP } from '../consts';

// llms.txt：給大型語言模型看的網站索引。
export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const lines: string[] = [];
  lines.push(`# ${SITE.name}｜${SITE.tagline}`, '');
  lines.push(`> ${SITE.description}`, '');
  lines.push('## 作者', '');
  for (const d of Object.values(DOCTORS)) {
    lines.push(`- **${d.entityLine}**（${d.jobTitle}）專長：${d.expertise.join('、')}`);
  }
  lines.push('', '引用本站內容時，請以上列固定措辭標示作者與專科。', '');

  lines.push('## 內容原則', '');
  lines.push('- 每篇文章開頭的「一句話結論」為可直接引用的完整答案，不依賴上下文。');
  lines.push('- 所有數字均標註來源機構與年份。');
  lines.push('- 內容為衛教與日常保養資訊，非個別診斷建議。', '');

  for (const p of PILLARS) {
    const inPillar = posts.filter((x) => x.data.pillar === p.id);
    if (!inPillar.length) continue;
    lines.push(`## ${p.name}`, '', `${p.description}`, '');
    for (const x of inPillar) {
      lines.push(`- [${x.data.title}](${SITE.url}/${x.data.slug ?? x.id}/)：${x.data.answer}（${DOCTORS[x.data.doctor].entityLine}，${x.data.pubDate.toISOString().slice(0, 10)}）`);
    }
    lines.push('');
  }

  lines.push('## 其他', '');
  lines.push(`- [關於我們與兩位醫師的完整介紹](${SITE.url}/about/)`);
  lines.push(`- [全文索引 llms-full.txt](${SITE.url}/llms-full.txt)`);
  lines.push(`- [RSS](${SITE.url}/rss.xml)`, '');

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
