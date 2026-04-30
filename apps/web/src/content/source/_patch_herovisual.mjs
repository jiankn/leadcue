import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const enPath = resolve(__dirname, 'site-ui.en.json');
const localesPath = resolve(__dirname, '..', 'generated', 'site-ui.locales.json');

const signalItemsEn = [
  'Demo CTA appears after the first scroll',
  'Social proof sits below the hero',
  'No finance case study is visible in navigation'
];

const patches = {
  en: {
    signalItems: signalItemsEn,
    firstLineLabel: 'Best outreach opener',
    firstLineText:
      'Noticed your demo CTA sits below the first scroll — that may hide conversion intent from high-fit visitors. Worth testing a clearer above-the-fold CTA for finance traffic?',
    firstLineMeta: 'Generated from homepage evidence',
    footerLeft: 'Website evidence captured',
    footerRight: 'Prospect card ready'
  },
  zh: {
    firstLineLabel: '最佳外联开场',
    firstLineText:
      '注意到你们的演示 CTA 位于首屏下方，这可能会让高意向访客错过转化入口。是否值得测试一个更靠上的首屏 CTA，尤其面向金融流量？',
    firstLineMeta: '基于首页证据生成'
  },
  ja: {
    firstLineLabel: '最適な最初の一文',
    firstLineText:
      'デモ CTA が最初のスクロールの下にあるため、高い意図を持つ訪問者が転換導線を見逃している可能性があります。特に金融系トラフィック向けに、ファーストビュー内でより明確な CTA を試す価値はありそうです。',
    firstLineMeta: 'ホームページの証拠から生成'
  },
  ko: {
    firstLineLabel: '최적의 아웃리치 오프너',
    firstLineText:
      '데모 CTA가 첫 스크롤 아래에 있어 의도가 높은 방문자가 전환 경로를 놓칠 수 있어 보입니다. 특히 금융 트래픽에 대해 첫 화면 안에 더 선명한 CTA를 테스트해볼 만합니다.',
    firstLineMeta: '홈페이지 근거 기반 생성'
  },
  de: {
    firstLineLabel: 'Bester Outreach-Einstieg',
    firstLineText:
      'Mir ist aufgefallen, dass euer Demo-CTA unter dem ersten Scroll liegt. Dadurch könnten Besucher mit hoher Kaufabsicht den Conversion-Pfad übersehen. Lohnt es sich, insbesondere für Finance-Traffic, einen klareren CTA oberhalb des Folds zu testen?',
    firstLineMeta: 'Aus Homepage-Signalen generiert'
  },
  nl: {
    firstLineLabel: 'Beste outreach-opener',
    firstLineText:
      'Jullie demo-CTA staat onder de eerste scroll, waardoor bezoekers met hoge intentie het conversiepad mogelijk missen. Het is waarschijnlijk de moeite waard om, zeker voor finance-verkeer, een duidelijkere above-the-fold CTA te testen.',
    firstLineMeta: 'Gegenereerd uit homepage-bewijs'
  },
  fr: {
    firstLineLabel: 'Meilleure accroche de prospection',
    firstLineText:
      'Votre CTA de démo se trouve sous le premier scroll, ce qui peut faire manquer le chemin de conversion aux visiteurs les plus qualifiés. Cela vaut sans doute le coup de tester un CTA plus visible au-dessus de la ligne de flottaison, surtout pour le trafic finance.',
    firstLineMeta: 'Généré à partir des preuves de la page d\'accueil'
  }
};

const en = JSON.parse(readFileSync(enPath, 'utf-8'));
en.home.heroVisual = {
  ...en.home.heroVisual,
  ...patches.en
};
writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n', 'utf-8');
console.log('✓ en source patched');

const locales = JSON.parse(readFileSync(localesPath, 'utf-8'));

for (const [lang, fields] of Object.entries(patches)) {
  if (locales[lang]?.home?.heroVisual) {
    locales[lang].home.heroVisual = {
      ...locales[lang].home.heroVisual,
      ...fields
    };
    console.log(`✓ ${lang} locales patched`);
  } else {
    console.log(`✗ ${lang} heroVisual not found`);
  }
}

writeFileSync(localesPath, JSON.stringify(locales, null, 2) + '\n', 'utf-8');
console.log('✓ locales file saved');

