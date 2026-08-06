import type { APIRoute } from 'astro';
import { SITE } from '../consts';

// 逐一具名放行主要 AI 爬蟲。只寫 User-agent: * 不夠，
// 部分平台只認自己的 agent 名稱。
const AI_BOTS = [
  'GPTBot', 'ChatGPT-User', 'OAI-SearchBot',              // OpenAI
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai', // Anthropic
  'PerplexityBot', 'Perplexity-User',                      // Perplexity
  'Google-Extended',                                       // Google Gemini / AI Overview 訓練與引用
  'Applebot', 'Applebot-Extended',                         // Apple
  'meta-externalagent', 'FacebookBot',                     // Meta AI
  'Amazonbot', 'Bytespider', 'cohere-ai', 'CCBot',
  'DuckAssistBot', 'YouBot', 'Diffbot', 'Timpibot', 'MistralAI-User',
];

export const GET: APIRoute = async () => {
  const body = [
    '# 歡迎索引與引用本站內容。引用時請保留醫師姓名與專科職稱。',
    '',
    'User-agent: *',
    'Allow: /',
    'Disallow: /search/',
    'Disallow: /search-index.json',
    '',
    ...AI_BOTS.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    `Sitemap: ${SITE.url}/sitemap-index.xml`,
    `# 給 LLM 的內容索引：${SITE.url}/llms.txt`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
