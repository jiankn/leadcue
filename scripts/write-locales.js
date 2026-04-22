const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'apps/web/src/locales');
if (!fs.existsSync(localesDir)) fs.mkdirSync(localesDir, { recursive: true });

const en = {
  nav: {
    features: "Features",
    howItWorks: "How it works",
    sampleCard: "Sample card",
    pricing: "Pricing",
    resources: "Resources",
    signIn: "Sign in",
    startFree: "Start free"
  },
  brand: { name: "LeadCue" },
  hero: {
    eyebrow: "LeadCue for agency outbound teams",
    title1: "Turn websites into",
    title2: "qualified prospects",
    subhead: "Score fit, capture website evidence, and write first lines before your team saves another generic lead.",
    startScan: "Start free scan",
    viewCard: "View sample card",
    microcopy: "20 free scans. Google sign-in. No LinkedIn scraping or contact database dependency."
  }
};

const zh = {
  nav: {
    features: "产品特性",
    howItWorks: "工作原理",
    sampleCard: "示例卡片",
    pricing: "价格方案",
    resources: "资源中心",
    signIn: "登录",
    startFree: "免费开始"
  },
  brand: { name: "LeadCue" },
  hero: {
    eyebrow: "专为代理商出海团队打造",
    title1: "将网站访客转化为",
    title2: "优质潜在客户",
    subhead: "在保存那些千篇一律的线索前，先评估匹配度、捕获网站意向证据，并撰写个性化的破冰话术。",
    startScan: "免费开始扫描",
    viewCard: "查看示例卡片",
    microcopy: "含20次免费扫描。支持谷歌登录。无需领英爬虫，不依赖联系人数据库。"
  }
};

const ja = {
  nav: {
    features: "機能",
    howItWorks: "仕組み",
    sampleCard: "サンプル",
    pricing: "料金プラン",
    resources: "リソース",
    signIn: "ログイン",
    startFree: "無料で始める"
  },
  brand: { name: "LeadCue" },
  hero: {
    eyebrow: "エージェンシーのアウトバウンド営業向け",
    title1: "ウェブサイトを",
    title2: "有望な見込み客に",
    subhead: "一般的なリストを保存する前に、適合度をスコアリングし、サイト内の証拠を捉え、最初のアプローチ文を作成します。",
    startScan: "無料スキャンを開始",
    viewCard: "サンプルを確認",
    microcopy: "20回の無料スキャン。Googleログイン対応。LinkedInのスクレイピングや外部データベースは不要。"
  }
};

const ko = {
  nav: {
    features: "기능",
    howItWorks: "작동 원리",
    sampleCard: "샘플 카드",
    pricing: "요금제",
    resources: "리소스",
    signIn: "로그인",
    startFree: "무료 시작"
  },
  brand: { name: "LeadCue" },
  hero: {
    eyebrow: "에이전시 아웃바운드 팀을 위한 LeadCue",
    title1: "웹사이트를",
    title2: "검증된 잠재 고객으로",
    subhead: "일반적인 리드를 저장하기 전에 적합도를 평가하고, 웹사이트에서 단서를 포착하여 맞춤형 첫 메시지를 작성하세요.",
    startScan: "무료 스캔 시작",
    viewCard: "샘플 카드 보기",
    microcopy: "20회 무료 스캔. Google 로그인 지원. LinkedIn 크롤링이나 연락처 DB에 의존하지 않습니다."
  }
};

const de = {
  nav: {
    features: "Funktionen",
    howItWorks: "So funktioniert's",
    sampleCard: "Beispielkarte",
    pricing: "Preise",
    resources: "Ressourcen",
    signIn: "Anmelden",
    startFree: "Kostenlos starten"
  },
  brand: { name: "LeadCue" },
  hero: {
    eyebrow: "LeadCue für Agentur-Outbound-Teams",
    title1: "Verwandeln Sie Websites in",
    title2: "qualifizierte Leads",
    subhead: "Bewerten Sie den Fit, erfassen Sie Website-Beweise und schreiben Sie erste Zeilen, bevor Ihr Team einen weiteren generischen Lead speichert.",
    startScan: "Kostenloser Scan",
    viewCard: "Beispiel ansehen",
    microcopy: "20 kostenlose Scans. Google-Login. Kein LinkedIn-Scraping oder Abhängigkeit von Kontaktdatenbanken."
  }
};

const nl = {
  nav: {
    features: "Functies",
    howItWorks: "Hoe het werkt",
    sampleCard: "Voorbeeldkaart",
    pricing: "Prijzen",
    resources: "Kennisbank",
    signIn: "Inloggen",
    startFree: "Gratis beginnen"
  },
  brand: { name: "LeadCue" },
  hero: {
    eyebrow: "LeadCue voor outbound bureaus",
    title1: "Verander websites in",
    title2: "gekwalificeerde prospects",
    subhead: "Beoordeel de match, verzamel website-bewijs en schrijf openingszinnen voordat uw team weer een generieke lead opslaat.",
    startScan: "Start gratis scan",
    viewCard: "Bekijk voorbeeld",
    microcopy: "20 gratis scans. Inloggen met Google. Geen LinkedIn-scraping of afhankelijkheid van contactendatabases."
  }
};

const fr = {
  nav: {
    features: "Fonctionnalités",
    howItWorks: "Comment ça marche",
    sampleCard: "Exemple",
    pricing: "Tarifs",
    resources: "Ressources",
    signIn: "Se connecter",
    startFree: "Démarrer"
  },
  brand: { name: "LeadCue" },
  hero: {
    eyebrow: "LeadCue pour les équipes d'outbound",
    title1: "Transformez les sites web en",
    title2: "prospects qualifiés",
    subhead: "Évaluez l'adéquation, capturez les preuves du site et rédigez vos phrases d'accroche avant d'enregistrer un énième lead générique.",
    startScan: "Scan gratuit",
    viewCard: "Voir un exemple",
    microcopy: "20 scans gratuits. Connexion Google. Pas de scraping LinkedIn ni de dépendance à une base de données de contacts."
  }
};

const writeJson = (filename, data) => fs.writeFileSync(path.join(localesDir, filename), JSON.stringify(data, null, 2));

writeJson('en.json', en);
writeJson('zh.json', zh);
writeJson('ja.json', ja);
writeJson('ko.json', ko);
writeJson('de.json', de);
writeJson('nl.json', nl);
writeJson('fr.json', fr);

console.log("Locales written!");
