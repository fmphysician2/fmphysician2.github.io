// 從文章的 markdown 抽出「問句小標 + 其下第一段」，組成 FAQPage 結構化資料。
//
// 重點在「第一段」：一個 H2 底下常常還接著結尾呼籲或參考文獻，那些不是這一題的答案。
// 若整段全部吃進去，AI 抽取時會連雜訊一起搬走，反而稀釋可引用性。
// 因此這裡只取第一個段落；若第一段是引言而緊接著是清單，則把清單一併納入。

/** 結尾標記：遇到這些區塊就停止，它們不屬於任何一題的答案 */
const TERMINATOR = /^(參考文獻|參考資料|資料來源|延伸閱讀|相關閱讀|免責聲明|備註|註記|註：|Reference)/;

/** 清單項目：- / * / + / • / 1. / 1) */
const LIST_ITEM = /^\s*([-*+–—•‧]|\d+[.)])\s+/;

const stripMd = (s: string) =>
  s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s*\n\s*/g, ' ')
    .trim();

export interface Faq { question: string; answer: string }

/** 把連續的非空行歸成一個區塊，空行為分隔 */
function toBlocks(lines: string[]): string[][] {
  const blocks: string[][] = [];
  let cur: string[] = [];
  for (const line of lines) {
    if (line.trim() === '') {
      if (cur.length) { blocks.push(cur); cur = []; }
    } else {
      cur.push(line);
    }
  }
  if (cur.length) blocks.push(cur);
  return blocks;
}

const isList = (block: string[]) => block.length > 0 && block.every((l) => LIST_ITEM.test(l));

/** 清單轉成可讀的一句話。用全形分號隔開，避免與項目內部的頓號混淆。 */
function renderList(block: string[]): string {
  const items = block.map((l) => stripMd(l.replace(LIST_ITEM, ''))).filter(Boolean);
  return items.length ? items.join('；') + '。' : '';
}

/** 在句子邊界截斷，永遠不切在半句話中間 */
function truncateAtSentence(text: string, max: number): string {
  if (text.length <= max) return text;
  const head = text.slice(0, max);
  const cut = Math.max(head.lastIndexOf('。'), head.lastIndexOf('！'), head.lastIndexOf('？'));
  return cut > 0 ? head.slice(0, cut + 1) : head;
}

export function extractFaqs(body: string, maxAnswerLen = 500): Faq[] {
  const lines = body.split('\n');
  const out: Faq[] = [];
  let current: { q: string; buf: string[] } | null = null;

  const flush = () => {
    if (!current) return;

    // 切成區塊，遇到參考文獻等結尾標記就停止
    const blocks: string[][] = [];
    for (const b of toBlocks(current.buf)) {
      if (TERMINATOR.test(stripMd(b[0]))) break;
      blocks.push(b);
    }

    if (blocks.length > 0) {
      const first = blocks[0];
      const parts = [isList(first) ? renderList(first) : stripMd(first.join('\n'))];

      // 第一段是引言、下一塊是清單 → 清單一併帶上（例如「符合以下條件之一：」）
      if (!isList(first) && blocks[1] && isList(blocks[1])) {
        parts.push(renderList(blocks[1]));
      }

      const answer = truncateAtSentence(parts.filter(Boolean).join(''), maxAnswerLen);
      if (answer.length > 20) out.push({ question: current.q, answer });
    }
    current = null;
  };

  for (const raw of lines) {
    const h2 = raw.match(/^##\s+(.*)$/);
    const other = raw.match(/^#{1,6}\s+/);
    if (h2) {
      flush();
      current = { q: stripMd(h2[1]).replace(/[?？]\s*$/, '？'), buf: [] };
    } else if (other) {
      flush();
    } else if (current) {
      current.buf.push(raw);
    }
  }
  flush();
  return out;
}

// 只有結尾是問號的小標才會進結構化資料，其餘標題略過。
export const questionFaqs = (f: Faq[]) => f.filter((x) => /[？?]$/.test(x.question));
