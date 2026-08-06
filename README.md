# 家醫科醫師x2

家醫科醫師夫妻檔的衛教網站。余貴華醫師 × 陳爰邑醫師。

網址：<https://fmphysician2.github.io>

用 [Astro](https://astro.build) 建置，部署在 GitHub Pages。

---

## 新增一篇文章

1. 複製 `src/content/posts/_範本.md`
2. 檔名改成你要的網址，用中文、不含問號
   例：`兒童塗氟補助幾歲免費.md` → 網址 `/兒童塗氟補助幾歲免費/`
3. 填上方欄位，寫內文
4. `draft: true` 改成 `draft: false`
5. 雙擊 `發布網站.bat`

## 本機預覽

雙擊 `預覽網站.bat`，或在這個資料夾開命令列執行：

```bash
npm install     # 只需要做一次
npm run dev     # 瀏覽器開 http://localhost:4321
```

## 檔案位置

```
src/
├── consts.ts              ← 網站設定、醫師資料、文章分類
├── content.config.ts      ← 文章欄位規則
├── content/posts/         ← 文章，一篇一個 .md
│   └── _範本.md           ← 複製這個開始寫
├── components/            ← 頁首、文章卡、醫師署名、側欄
├── layouts/Base.astro     ← 每頁共用的 head 與頁尾
└── pages/                 ← 首頁、文章頁、分類頁、關於、搜尋

public/images/             ← 圖片
```

## 環境需求

[Node.js](https://nodejs.org) LTS 版本。
