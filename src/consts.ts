// =============================================================
// 網站設定與醫師基本資料。這裡的內容全站共用，
// 修改任何一項都會同時影響網頁顯示與結構化資料。
// =============================================================

export const SITE = {
  url: 'https://fmphysician2.github.io',
  base: '/',
  name: '家醫科醫師x2',
  tagline: '健康和日常 都有意思',
  bio: '家醫科醫師夫妻檔',
  byline: '余貴華 醫師 × 陳爰邑 醫師',
  pitch: '減重控糖｜家庭醫學｜居家醫療｜教養日常',
  description:
    '家醫科醫師夫妻檔余貴華醫師與陳爰邑醫師，用門診看得到的實例談慢性病、代謝管理、全家防疫日常、疫苗與兒童常見疾病。每篇文章開頭直接回答問題，數字都標明出處。',
  lang: 'zh-Hant-TW',
  locale: 'zh_TW',
} as const;

// Facebook 粉專正式網址（2026-08-04 已由用戶確認）
export const FACEBOOK_URL = 'https://www.facebook.com/fmphysician2';

export const LINKS = {
  facebook: FACEBOOK_URL,
  instagram: 'https://www.instagram.com/fmphysician2/',
  threads: 'https://www.threads.com/@fmphysician2',
  linkgoods: 'https://linkgoods.com/fmphysician2',
} as const;

// sameAs：餵給 schema.org 的實體連結清單
export const SAME_AS = [
  LINKS.facebook,
  LINKS.instagram,
  LINKS.threads,
  LINKS.linkgoods,
];

// -------------------------------------------------------------
// 醫師資料。entityLine 是署名區與結構化資料共用的固定字串，
// 全站一致，不要在個別文章裡改寫。
// -------------------------------------------------------------
export type DoctorKey = '余貴華' | '陳爰邑';

export interface Doctor {
  key: DoctorKey;
  name: string;
  entityLine: string;      // 署名用的完整稱謂
  specialty: string;       // schema.org medicalSpecialty
  jobTitle: string;
  expertise: string[];     // 專長
  training: string;        // 專科訓練醫院，schema.org alumniOf
  alumniOf: string;        // 畢業學校，schema.org alumniOf
  award: string;           // 專業獎項，schema.org award
  avatar: string;          // 個人頭像路徑，署名區與 schema.org image 共用
  mainPillars: string[];   // 主要撰寫分類
  subPillars: string[];    // 次要撰寫分類
}

export const DOCTORS: Record<DoctorKey, Doctor> = {
  余貴華: {
    key: '余貴華',
    name: '余貴華',
    entityLine: '家醫科余貴華醫師',
    specialty: '家庭醫學科',
    jobTitle: '家庭醫學專科醫師',
    expertise: ['慢性病與代謝管理', '心血管風險評估', '預防醫學'],
    training: '台北榮總家庭醫學專科醫師',
    alumniOf: '國立陽明大學（今國立陽明交通大學）',
    award: '糖尿病品質卓越獎醫師',
    avatar: '/images/doctors/余貴華.webp',
    mainPillars: ['P1', 'P5'],
    subPillars: ['P2'],
  },
  陳爰邑: {
    key: '陳爰邑',
    name: '陳爰邑',
    entityLine: '家醫科陳爰邑醫師',
    specialty: '家庭醫學科',
    jobTitle: '家庭醫學專科醫師',
    expertise: ['家庭感染防護', '兒童常見疾病', '婦女健康'],
    training: '台北榮總家庭醫學專科醫師',
    alumniOf: '國立陽明大學（今國立陽明交通大學）',
    award: '糖尿病品質卓越獎醫師',
    avatar: '/images/doctors/陳爰邑.webp',
    mainPillars: ['P3', 'P6'],
    subPillars: ['P2', 'P4'],
  },
};

// 每篇文章發布前都由另一位醫師審閱過，所以 reviewedBy 交叉指向撰寫者以外的那位醫師。
// 目前固定兩位醫師互審，若未來人數變動，這裡要跟著改成明確指定審閱人。
export function otherDoctor(writer: DoctorKey): Doctor {
  const other = (Object.keys(DOCTORS) as DoctorKey[]).find((k) => k !== writer);
  return DOCTORS[other!];
}

// -------------------------------------------------------------
// 文章分類。每篇文章歸在一個分類下，同分類的文章會自動互相連結。
// -------------------------------------------------------------
export interface Pillar {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export const PILLARS: Pillar[] = [
  { id: 'P1', slug: '慢性病與代謝管理', name: '慢性病與代謝管理',
    description: '糖尿病、高血壓、高血脂、體重與代謝指標的長期管理，以及門診最常被問的用藥與數值判讀。' },
  { id: 'P2', slug: '預防與篩檢', name: '預防與篩檢',
    description: '成人健檢、癌症篩檢、疫苗與各項政府補助資源，什麼年紀該做什麼、哪些是免費的。' },
  { id: 'P3', slug: '全家防疫日常', name: '全家防疫日常',
    description: '流感、腸病毒、新冠與各種家庭常見傳染病的判斷、照護與隔離原則。' },
  { id: 'P4', slug: '藥物與保健常識', name: '藥物與保健常識',
    description: '常用藥、指示用藥與保健食品的正確使用方式，以及常見的交互作用與迷思。' },
  { id: 'P5', slug: '新知解碼', name: '新知解碼',
    description: '把新的研究、指引與治療進展翻成病人聽得懂的話，說明它到底改變了什麼。' },
  { id: 'P6', slug: '婦女健康', name: '婦女健康',
    description: '婦科常見問題、孕期與更年期照護，以及女性特有的篩檢與風險評估。' },
];

export const PILLAR_MAP = Object.fromEntries(PILLARS.map((p) => [p.id, p]));

// 免責聲明：沿用主流程既有句，不可更動
export const DISCLAIMER =
  '此為日常保養與衛教分享，若有身體不適，仍須尋求專業醫師門診協助。';
