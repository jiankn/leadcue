const fs = require('fs');
const path = require('path');

// ── 1. Patch EN source ──
const enPath = path.resolve(__dirname, 'site-ui.en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const hv = en.home.heroVisual;
// 重建 heroVisual 保证字段顺序
en.home.heroVisual = {
  browserChip: hv.browserChip,
  browserTitle: hv.browserTitle,
  browserSubtitle: hv.browserSubtitle,
  fitLabel: hv.fitLabel,
  fitValue: hv.fitValue,
  signalTitle: hv.signalTitle,
  signalItems: hv.signalItems,
  firstLineLabel: "First line ready",
  firstLineText: "I noticed Northstar explains the product clearly, but the demo path starts after the first scroll.",
  firstLineMeta: "Copy-ready \u00b7 Based on 3 website signals",
  footerLeft: hv.footerLeft,
  footerRight: hv.footerRight
};
fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n', 'utf-8');
console.log('EN source patched');

// ── 2. Patch generated locales ──
const locPath = path.resolve(__dirname, '..', 'generated', 'site-ui.locales.json');
const locales = JSON.parse(fs.readFileSync(locPath, 'utf-8'));

const t = {
  en: { firstLineLabel: "First line ready", firstLineText: "I noticed Northstar explains the product clearly, but the demo path starts after the first scroll.", firstLineMeta: "Copy-ready \u00b7 Based on 3 website signals" },
  zh: { firstLineLabel: "\u5f00\u573a\u767d\u5df2\u5c31\u7eea", firstLineText: "\u6211\u6ce8\u610f\u5230 Northstar \u7684\u4ea7\u54c1\u4ecb\u7ecd\u5f88\u6e05\u6670\uff0c\u4f46\u6f14\u793a\u5165\u53e3\u9700\u8981\u6eda\u52a8\u624d\u80fd\u770b\u5230\u3002", firstLineMeta: "\u53ef\u76f4\u63a5\u4f7f\u7528 \u00b7 \u57fa\u4e8e 3 \u6761\u7f51\u7ad9\u4fe1\u53f7" },
  ja: { firstLineLabel: "\u30d5\u30a1\u30fc\u30b9\u30c8\u30e9\u30a4\u30f3\u5b8c\u6210", firstLineText: "Northstar\u306e\u88fd\u54c1\u8aac\u660e\u306f\u660e\u78ba\u3067\u3059\u304c\u3001\u30c7\u30e2\u3078\u306e\u5c0e\u7dda\u304c\u6700\u521d\u306e\u30b9\u30af\u30ed\u30fc\u30eb\u306e\u5f8c\u306b\u914d\u7f6e\u3055\u308c\u3066\u3044\u308b\u3053\u3068\u306b\u6c17\u3065\u304d\u307e\u3057\u305f\u3002", firstLineMeta: "\u30b3\u30d4\u30fc\u53ef\u80fd \u00b7 3\u3064\u306eWeb\u30b5\u30a4\u30c8\u30b7\u30b0\u30ca\u30eb\u306b\u57fa\u3065\u304f" },
  ko: { firstLineLabel: "\ucca8 \uc904 \uc900\ube44 \uc644\ub8cc", firstLineText: "Northstar\uc758 \uc81c\ud488 \uc124\uba85\uc740 \uba85\ud655\ud558\uc9c0\ub9cc, \ub370\ubaa8 \uacbd\ub85c\uac00 \ucca8 \ubc88\uc9f8 \uc2a4\ud06c\ub864 \uc774\ud6c4\uc5d0 \uc2dc\uc791\ub418\ub294 \uac83\uc744 \ubc1c\uacac\ud588\uc2b5\ub2c8\ub2e4.", firstLineMeta: "\ubc14\ub85c \uc0ac\uc6a9 \uac00\ub2a5 \u00b7 3\uac1c\uc758 \uc6f9\uc0ac\uc774\ud2b8 \uc2e0\ud638 \uae30\ubc18" },
  de: { firstLineLabel: "Erste Zeile bereit", firstLineText: "Mir ist aufgefallen, dass Northstar das Produkt klar erkl\u00e4rt, aber der Demo-Pfad erst nach dem ersten Scrollen beginnt.", firstLineMeta: "Kopierfertig \u00b7 Basierend auf 3 Website-Signalen" },
  nl: { firstLineLabel: "Eerste regel klaar", firstLineText: "Ik merkte op dat Northstar het product helder uitlegt, maar het demopad pas na de eerste scroll begint.", firstLineMeta: "Kopieerklaar \u00b7 Gebaseerd op 3 websitesignalen" },
  fr: { firstLineLabel: "Premi\u00e8re ligne pr\u00eate", firstLineText: "J\u2019ai remarqu\u00e9 que Northstar explique clairement le produit, mais le chemin vers la d\u00e9mo ne commence qu\u2019apr\u00e8s le premier d\u00e9filement.", firstLineMeta: "Pr\u00eat \u00e0 copier \u00b7 Bas\u00e9 sur 3 signaux du site" }
};

for (const [lang, fields] of Object.entries(t)) {
  if (locales[lang] && locales[lang].home && locales[lang].home.heroVisual) {
    const old = locales[lang].home.heroVisual;
    locales[lang].home.heroVisual = {
      browserChip: old.browserChip,
      browserTitle: old.browserTitle,
      browserSubtitle: old.browserSubtitle,
      fitLabel: old.fitLabel,
      fitValue: old.fitValue,
      signalTitle: old.signalTitle,
      signalItems: old.signalItems,
      firstLineLabel: fields.firstLineLabel,
      firstLineText: fields.firstLineText,
      firstLineMeta: fields.firstLineMeta,
      footerLeft: old.footerLeft,
      footerRight: old.footerRight
    };
    console.log(lang + ' patched');
  }
}

fs.writeFileSync(locPath, JSON.stringify(locales, null, 2) + '\n', 'utf-8');
console.log('All done');
