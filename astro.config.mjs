import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, basename } from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE, PILLARS } from './src/consts.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = resolve(HERE, 'src/content/posts');

// -------------------------------------------------------------
// sitemap 的 lastmod
//
// Google 已明確表示忽略 changefreq 與 priority，唯一會參考的是 lastmod。
// 但 lastmod 必須誠實：若每次部署都填「建置當下時間」，等於宣稱全站都更新了，
// Google 一旦發現與實際內容不符，就會整個忽略這個欄位，比不填更糟。
// 所以這裡讀每篇文章 frontmatter 真正的 updatedDate（沒有就用 pubDate）。
//
// astro.config 無法使用 astro:content，因此用 fs 自行解析最小必要欄位。
// -------------------------------------------------------------

/** 從 frontmatter 取出單一純量欄位 */
function field(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!m) return undefined;
  return m[1].replace(/\s+#.*$/, '').trim().replace(/^["']|["']$/g, '');
}

function readPosts() {
  let files;
  try {
    files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_'));
  } catch {
    return [];
  }

  const out = [];
  for (const file of files) {
    const raw = readFileSync(join(POSTS_DIR, file), 'utf8');
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) continue;
    const fm = m[1];

    if (String(field(fm, 'draft')).toLowerCase() === 'true') continue;

    const pub = field(fm, 'pubDate');
    const upd = field(fm, 'updatedDate');
    const date = new Date(upd ?? pub ?? '');
    if (Number.isNaN(date.valueOf())) continue;

    out.push({
      slug: field(fm, 'slug') ?? basename(file, '.md'),
      pillar: field(fm, 'pillar'),
      date,
    });
  }
  return out;
}

function buildLastmodMap() {
  const posts = readPosts();
  const map = new Map();
  if (posts.length === 0) return map;

  const newest = (list) =>
    list.reduce((a, b) => (a.date > b.date ? a : b)).date.toISOString();

  // 文章頁：各自的 updatedDate ?? pubDate
  for (const p of posts) {
    map.set(`${SITE.url}/${p.slug}/`, p.date.toISOString());
  }

  // 首頁：最新一篇文章的日期（新增文章確實會改變首頁內容）
  map.set(`${SITE.url}/`, newest(posts));

  // 分類頁：該分類最新一篇的日期。沒有文章的分類不設。
  for (const pillar of PILLARS) {
    const inPillar = posts.filter((p) => p.pillar === pillar.id);
    if (inPillar.length > 0) {
      map.set(`${SITE.url}/pillar/${pillar.slug}/`, newest(inPillar));
    }
  }

  // /about/ 這類靜態頁不設 lastmod —— 寧可留空，也不要給假日期。
  return map;
}

const LASTMOD = buildLastmodMap();

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // robots.txt 已 Disallow /search/，sitemap 就不該再列，否則兩邊訊號矛盾。
      filter: (page) => !page.includes('/search/'),
      serialize(item) {
        // 不設 changefreq 與 priority：Google 忽略它們，留著只是雜訊。
        const lastmod = LASTMOD.get(decodeURI(item.url));
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-light' }
  }
});
