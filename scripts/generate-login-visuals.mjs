import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const outputDir = path.join(repoRoot, "apps", "web", "public", "images", "login-visuals");
const baseImage = path.join(outputDir, "leadcue-login-base-ai.png");
const baseImageBytes = await readFile(baseImage);
const baseImageUrl = `data:image/png;base64,${baseImageBytes.toString("base64")}`;

const visuals = [
  {
    locale: "en",
    lang: "en",
    eyebrow: "AI prospect research",
    title: ["Turn website research", "into ranked accounts."],
    copy: "Source-backed signals, fit scores, and outreach context in one workspace.",
    cards: [
      ["Qualified fit", "92"],
      ["Website cues", "3+"],
      ["CRM ready", "CSV"]
    ]
  },
  {
    locale: "zh",
    lang: "zh-CN",
    eyebrow: "AI 客户研究",
    title: ["把网站线索", "转化为高优先级客户"],
    copy: "来源证据、匹配评分和外联上下文，集中在一个工作区。",
    cards: [
      ["匹配评分", "92"],
      ["网站信号", "3+"],
      ["CRM 就绪", "CSV"]
    ]
  },
  {
    locale: "ja",
    lang: "ja",
    eyebrow: "AI 見込み客リサーチ",
    title: ["サイト調査を", "優先顧客リストへ"],
    copy: "根拠あるシグナル、適合スコア、営業文脈を一か所に。",
    cards: [
      ["適合スコア", "92"],
      ["サイトシグナル", "3+"],
      ["CRM 連携", "CSV"]
    ]
  },
  {
    locale: "ko",
    lang: "ko",
    eyebrow: "AI 잠재고객 리서치",
    title: ["웹사이트 조사를", "우선순위 고객으로"],
    copy: "출처 기반 신호, 적합도 점수, 아웃리치 맥락을 한곳에 모읍니다.",
    cards: [
      ["적합도 점수", "92"],
      ["웹사이트 신호", "3+"],
      ["CRM 준비", "CSV"]
    ]
  },
  {
    locale: "de",
    lang: "de",
    eyebrow: "KI-Prospect-Recherche",
    title: ["Website-Recherche in", "priorisierte Accounts"],
    copy: "Quellenbasierte Signale, Fit-Scores und Outreach-Kontext in einem Arbeitsbereich.",
    cards: [
      ["Fit-Score", "92"],
      ["Website-Signale", "3+"],
      ["CRM-bereit", "CSV"]
    ]
  },
  {
    locale: "nl",
    lang: "nl",
    eyebrow: "AI-prospectonderzoek",
    title: ["Websiteonderzoek naar", "geprioriteerde accounts"],
    copy: "Bronnen, fitscores en outreach-context samen in één werkruimte.",
    cards: [
      ["Fitscore", "92"],
      ["Websitesignalen", "3+"],
      ["CRM-klaar", "CSV"]
    ]
  },
  {
    locale: "fr",
    lang: "fr",
    eyebrow: "Recherche de prospects IA",
    title: ["Recherches web", "en comptes", "prioritaires"],
    copy: "Signaux sourcés, scores d'adéquation et contexte d'approche au même endroit.",
    cards: [
      ["Score d'adéquation", "92"],
      ["Signaux web", "3+"],
      ["Prêt CRM", "CSV"]
    ]
  }
];

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function visualHtml(visual) {
  const isCjk = ["zh", "ja", "ko"].includes(visual.locale);
  const title = visual.title.map((line) => `<span>${escapeHtml(line)}</span>`).join("");
  const cards = visual.cards
    .map(
      ([label, value]) => `
        <div class="metric-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `
    )
    .join("");

  return `<!doctype html>
  <html lang="${visual.lang}">
    <head>
      <meta charset="utf-8" />
      <style>
        * { box-sizing: border-box; }
        body {
          margin: 0;
          background: #062f28;
        }
        #visual {
          position: relative;
          width: 1200px;
          height: 1080px;
          overflow: hidden;
          color: #f7fff2;
          font-family: ${
            visual.locale === "zh"
              ? '"Microsoft YaHei", "Noto Sans SC", sans-serif'
              : visual.locale === "ja"
                ? '"Yu Gothic", "Noto Sans JP", sans-serif'
                : visual.locale === "ko"
                  ? '"Malgun Gothic", "Noto Sans KR", sans-serif'
                  : '"Inter", "Segoe UI", sans-serif'
          };
          background: #062f28;
        }
        .bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.86;
          filter: saturate(1.08) contrast(1.04);
        }
        .scrim {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 12%, rgba(156, 255, 120, 0.18), transparent 25%),
            linear-gradient(115deg, rgba(1, 37, 32, 0.86) 0%, rgba(2, 47, 41, 0.74) 45%, rgba(2, 47, 41, 0.18) 100%);
        }
        .copy-panel {
          position: absolute;
          left: 56px;
          top: 76px;
          width: 760px;
          padding: 48px 52px;
          border: 1px solid rgba(156, 255, 120, 0.22);
          background: linear-gradient(180deg, rgba(3, 45, 39, 0.86), rgba(1, 35, 31, 0.74));
          box-shadow: 0 28px 90px rgba(0, 18, 16, 0.36);
        }
        .eyebrow {
          margin: 0 0 22px;
          color: #9cff78;
          font-size: ${isCjk ? 27 : 25}px;
          font-weight: 900;
          letter-spacing: ${isCjk ? "0" : "0.055em"};
          text-transform: ${isCjk ? "none" : "uppercase"};
        }
        h1 {
          display: grid;
          gap: 6px;
          margin: 0;
          color: #fff;
          font-size: ${visual.locale === "de" || visual.locale === "nl" || visual.locale === "fr" ? 52 : isCjk ? 60 : 58}px;
          font-weight: 950;
          line-height: ${isCjk ? "1.13" : "1.04"};
          letter-spacing: 0;
          text-wrap: balance;
        }
        h1 span {
          white-space: nowrap;
        }
        .copy {
          max-width: 650px;
          margin: 30px 0 0;
          color: rgba(247, 255, 242, 0.86);
          font-size: ${isCjk ? 25 : 23}px;
          font-weight: 650;
          line-height: ${isCjk ? "1.55" : "1.48"};
          overflow-wrap: anywhere;
        }
        .metric-row {
          position: absolute;
          left: 56px;
          right: 56px;
          bottom: 104px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }
        .metric-card {
          min-height: 156px;
          display: grid;
          align-content: center;
          gap: 14px;
          padding: 26px 30px;
          border: 1px solid rgba(156, 255, 120, 0.2);
          background: rgba(238, 255, 235, 0.93);
          box-shadow: 0 24px 64px rgba(0, 18, 16, 0.18);
        }
        .metric-card span {
          color: #006252;
          font-size: ${isCjk ? 24 : 22}px;
          font-weight: 900;
          letter-spacing: ${isCjk ? "0" : "0.04em"};
          text-transform: ${isCjk ? "none" : "uppercase"};
        }
        .metric-card strong {
          color: #032f29;
          font-size: 68px;
          font-weight: 950;
          line-height: 0.95;
          letter-spacing: 0;
        }
      </style>
    </head>
    <body>
      <div id="visual">
        <img class="bg" src="${baseImageUrl}" alt="" />
        <div class="scrim"></div>
        <section class="copy-panel">
          <p class="eyebrow">${escapeHtml(visual.eyebrow)}</p>
          <h1>${title}</h1>
          <p class="copy">${escapeHtml(visual.copy)}</p>
        </section>
        <section class="metric-row">${cards}</section>
      </div>
    </body>
  </html>`;
}

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 1080 }, deviceScaleFactor: 1 });

for (const visual of visuals) {
  await page.setContent(visualHtml(visual), { waitUntil: "networkidle" });
  await page.locator("#visual").screenshot({
    path: path.join(outputDir, `leadcue-login-${visual.locale}.png`)
  });
}

await browser.close();

console.log(`Generated ${visuals.length} localized login visuals in ${outputDir}`);
