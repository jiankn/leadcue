import type {
  ContactPoints,
  ICPProfile,
  OpportunitySignal,
  PageSnapshot,
  ProspectCard,
  ScanLocale,
  ScanRequest
} from "./types";

export const DEFAULT_ICP: ICPProfile = {
  serviceType: "web_design",
  targetIndustries: ["B2B SaaS", "local services", "professional services"],
  targetCountries: ["United States", "United Kingdom", "Canada", "Australia"],
  targetCompanySize: "1-200 employees",
  offerDescription:
    "We help companies turn more website visitors into booked calls with clearer CTAs, proof sections, and conversion-focused page structure.",
  tone: "professional",
  avoidedIndustries: [],
  outputLocale: "en"
};

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    monthlyCredits: 20,
    description: "Test the workflow with a small batch of personal website research credits."
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    monthlyCredits: 500,
    description: "Personal prospecting for freelancers, consultants, and solo founders."
  },
  {
    id: "power",
    name: "Power",
    price: 79,
    monthlyCredits: 2000,
    description: "Higher-volume website research for individual outbound operators."
  }
] as const;

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_PATTERN =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/g;

type RuleBasedSignalCopy = {
  signal: string;
  reason: string;
  source: string;
};

type SampleLocaleContent = {
  workspaceName: string;
  targetIndustries: string[];
  targetCountries: string[];
  offerDescription: string;
  industryLabels: {
    northstar: string;
    beacon: string;
    lumen: string;
  };
  demoPages: Record<
    "northstar" | "beacon" | "lumen",
    {
      title: string;
      metaDescription: string;
      h1: string;
      text: string;
    }
  >;
  analytics: {
    eventMetadata: {
      basicScanOneCredit: string;
      crmHubSpot: string;
      hubSpotMappingCta: string;
    };
    recommendations: {
      toolPageCta: string;
      exportsGap: string;
      crmTemplateTraffic: string;
      ctaSignupGap: string;
      noScans: string;
      scanExportGap: string;
      topPage: string;
      steadyFunnel: string;
    };
  };
  pipelineOwner: string;
  pipelineActorName: string;
  pipelineNotes: string;
};

type RuleBasedProspectCopy = {
  unknownIndustry: string;
  serviceTypes: Record<ICPProfile["serviceType"], string>;
  fallbackSignal: string;
  summary: (companyName: string) => string;
  fitReason: (signalCount: number, serviceTypeLabel: string) => string;
  outreachAngle1: (signal: string) => string;
  outreachAngle2: string;
  outreachAngle3: string;
  firstLine1: (companyName: string, firstLine: string) => string;
  firstLine2: string;
  firstLine3: (domain: string) => string;
  shortEmail: (companyName: string, firstLine: string) => string;
  signals: {
    noCta: RuleBasedSignalCopy;
    metaDescriptionThin: RuleBasedSignalCopy;
    h1Weak: RuleBasedSignalCopy;
    noProof: RuleBasedSignalCopy;
    noBlog: RuleBasedSignalCopy;
    growthHiring: RuleBasedSignalCopy;
  };
};

const ruleBasedProspectCopy: Record<ScanLocale, RuleBasedProspectCopy> = {
  en: {
    unknownIndustry: "unknown",
    serviceTypes: {
      web_design: "web design",
      seo: "SEO",
      marketing: "marketing",
      custom: "custom"
    },
    fallbackSignal:
      "the path to the next step could be clearer for new visitors.",
    summary: (companyName) =>
      `${companyName} appears to be a company website with enough public information for website-based prospect research.`,
    fitReason: (signalCount, serviceTypeLabel) =>
      `The site shows ${signalCount || "some"} website signals that can support a ${serviceTypeLabel} outreach angle.`,
    outreachAngle1: (signal) =>
      `Open with a gentle observation around "${signal}" and offer one low-effort idea the owner can ignore if it is not useful.`,
    outreachAngle2: "Keep the note useful on its own: one observation, one possible impact, one easy reply.",
    outreachAngle3: "Avoid diagnosis language; frame the message as a quick outside perspective.",
    firstLine1: (companyName, firstLine) =>
      `I was looking at ${companyName} and noticed ${firstLine}`,
    firstLine2:
      "Your site already gives visitors a helpful starting point; one small improvement may be making the next step easier to spot.",
    firstLine3: (domain) =>
      `I was looking at ${domain} and had one small idea that might make the visitor journey easier to follow.`,
    shortEmail: (companyName, firstLine) =>
      `Hi there,\n\nI was looking at ${companyName} and noticed ${firstLine}\n\nOne small idea might be to make the next step easier to spot for someone comparing options quickly.\n\nWould it be useful if I sent over 2-3 specific ideas?`,
    signals: {
      noCta: {
        signal: "The next step could be easier to spot early on the page.",
        reason: "If the next step is not obvious, a first-time visitor may take longer to decide how to learn more or get in touch.",
        source: "homepage"
      },
      metaDescriptionThin: {
        signal: "Meta description is missing or thin.",
        reason: "The homepage metadata may not explain the offer strongly enough for search snippets.",
        source: "meta description"
      },
      h1Weak: {
        signal: "Homepage H1 is unclear or unavailable.",
        reason: "A weak H1 can make the page harder for visitors and search engines to understand quickly.",
        source: "homepage h1"
      },
      noProof: {
        signal: "Customer proof or case study paths could be easier to find.",
        reason: "First-time visitors often look for trust signals before reaching out.",
        source: "navigation check"
      },
      noBlog: {
        signal: "No obvious resources path was visible in the navigation.",
        reason: "Helpful resources can give visitors a reason to keep learning before they are ready to contact sales.",
        source: "navigation check"
      },
      growthHiring: {
        signal: "Hiring or growth language appears on the website.",
        reason: "Growth-related hiring can create timing for website, SEO, or conversion support.",
        source: "homepage/navigation check"
      }
    }
  },
  zh: {
    unknownIndustry: "未知",
    serviceTypes: {
      web_design: "网站设计",
      seo: "SEO",
      marketing: "营销",
      custom: "定制"
    },
    fallbackSignal: "新访客在网站上找到下一步行动的路径还可以更清晰。",
    summary: (companyName) =>
      `${companyName} 看起来是一家公司官网，公开信息足以支持基于网站的潜在客户研究。`,
    fitReason: (signalCount, serviceTypeLabel) =>
      `该网站展示了 ${signalCount || "若干"} 个网站信号，足以支撑以${serviceTypeLabel}为切入点的外联。`,
    outreachAngle1: (signal) => `可以围绕修复“${signal}”来定位服务，先提出一次简短的网站优化冲刺。`,
    outreachAngle2: "邮件本身先提供价值：一个观察、一个可能影响、一个容易回复的小提议。",
    outreachAngle3: "避免像诊断报告，用外部视角提出一个可选的小建议。",
    firstLine1: (companyName, firstLine) =>
      `我看了 ${companyName} 的网站，注意到${firstLine}`,
    firstLine2: "你们的网站已经能让访客了解业务；如果下一步动作再显眼一点，可能会减少犹豫。",
    firstLine3: (domain) =>
      `我看 ${domain} 时有一个小想法，也许能让第一次访问的人更快找到下一步。`,
    shortEmail: (companyName, firstLine) =>
      `你好，\n\n我看了 ${companyName} 的网站，注意到${firstLine}\n\n一个小想法是：可以让第一次访问的人更快看到下一步该怎么了解或联系你们，减少他们比较方案时的犹豫。\n\n如果你觉得有用，我可以发 2-3 个具体建议给你参考。`,
    signals: {
      noCta: {
        signal: "页面开头的下一步动作还可以更清楚。",
        reason: "访客刚进入页面时，如果下一步不够明显，可能需要多花时间判断该如何了解或联系。",
        source: "首页"
      },
      metaDescriptionThin: {
        signal: "Meta 描述缺失或内容偏弱。",
        reason: "首页元数据可能没有足够清楚地说明服务内容，难以支撑搜索摘要。",
        source: "meta 描述"
      },
      h1Weak: {
        signal: "首页主标题还可以更直接说明价值。",
        reason: "薄弱的 H1 会让访客和搜索引擎更难快速理解页面。",
        source: "首页 H1"
      },
      noProof: {
        signal: "案例、评价或客户成果入口还可以更容易被看到。",
        reason: "第一次访问的人通常会寻找可信依据；如果入口不明显，可能会降低继续了解的动力。",
        source: "导航检查"
      },
      noBlog: {
        signal: "导航里没有明显的资源或内容入口。",
        reason: "如果访客还没准备好联系，资源内容可以给他们一个继续了解品牌的理由。",
        source: "导航检查"
      },
      growthHiring: {
        signal: "网站上出现了招聘或增长相关信号。",
        reason: "与增长相关的招聘通常意味着他们正处于适合网站、SEO 或转化支持的时间窗口。",
        source: "首页/导航扫描"
      }
    }
  },
  ja: {
    unknownIndustry: "不明",
    serviceTypes: {
      web_design: "Web デザイン",
      seo: "SEO",
      marketing: "マーケティング",
      custom: "カスタム"
    },
    fallbackSignal: "新規訪問者にとって次の一歩がまだ少し分かりにくい状態です。",
    summary: (companyName) =>
      `${companyName} は、サイトベースの見込み客リサーチに十分な公開情報がある企業サイトのように見えます。`,
    fitReason: (signalCount, serviceTypeLabel) =>
      `このサイトには ${signalCount || "いくつかの"} サイトシグナルがあり、${serviceTypeLabel} を軸にしたアプローチにつなげられます。`,
    outreachAngle1: (signal) =>
      `「${signal}」について、相手が不要なら無視できる小さな改善案として切り出します。`,
    outreachAngle2: "メール単体で役立つように、観察・影響・返しやすい提案を 1 つずつ入れます。",
    outreachAngle3: "診断レポートのようにせず、外から見た小さな気づきとして伝えます。",
    firstLine1: (companyName, firstLine) =>
      `${companyName} のサイトを拝見して、${firstLine}と感じました`,
    firstLine2:
      "サイトは訪問者に出発点を示していますが、ホームページ上で次の一歩がもう少し見つけやすくなりそうです。",
    firstLine3: (domain) =>
      `${domain} を拝見して、初めて訪れる人が次の一歩を見つけやすくなる小さな余地がありそうだと感じました。`,
    shortEmail: (companyName, firstLine) =>
      `こんにちは。\n\n${companyName} のサイトを拝見して、${firstLine}と感じました。\n\n初めて訪れる人が次に何をすればよいか、もう少し早く分かると比較検討中の離脱を減らせるかもしれません。\n\nもし役立ちそうでしたら、具体的な改善案を 2〜3 個お送りします。`,
    signals: {
      noCta: {
        signal: "ページ序盤の次の一歩がもう少し分かりやすくなりそうです。",
        reason: "初めて訪れる人にとって次の行動が見つけやすいほど、問い合わせや比較検討に進みやすくなります。",
        source: "ホームページ"
      },
      metaDescriptionThin: {
        signal: "meta description が不足しているか弱い状態です。",
        reason: "ホームページのメタ情報だけでは、検索結果で提供価値が十分に伝わらない可能性があります。",
        source: "meta description"
      },
      h1Weak: {
        signal: "ホームページの H1 が不明確、または取得できませんでした。",
        reason: "弱い H1 は、訪問者や検索エンジンがページを素早く理解する妨げになります。",
        source: "ホームページ H1"
      },
      noProof: {
        signal: "明確な実績セクションや事例導線が見つかりませんでした。",
        reason: "社会的証明が少ない見込み客は、コンバージョン重視のサイト改善やコンテンツ支援と相性が良いことがあります。",
        source: "ナビゲーション確認"
      },
      noBlog: {
        signal: "確認したリンクにブログやリソース導線が見当たりませんでした。",
        reason: "コンテンツマーケティングの接点が少ない、またはナビゲーションに抜けがある可能性があります。",
        source: "ナビゲーション確認"
      },
      growthHiring: {
        signal: "採用や成長に関する表現がサイト上に見られます。",
        reason: "成長関連の採用は、サイト改善や SEO、コンバージョン支援のタイミングを示すことがあります。",
        source: "ホームページ/ナビゲーション確認"
      }
    }
  },
  ko: {
    unknownIndustry: "알 수 없음",
    serviceTypes: {
      web_design: "웹 디자인",
      seo: "SEO",
      marketing: "마케팅",
      custom: "맞춤"
    },
    fallbackSignal: "새 방문자가 다음 단계를 찾는 경로가 조금 더 명확해질 수 있습니다.",
    summary: (companyName) =>
      `${companyName} 는 웹사이트 기반 잠재고객 리서치를 진행하기에 충분한 공개 정보를 가진 회사 사이트로 보입니다.`,
    fitReason: (signalCount, serviceTypeLabel) =>
      `이 사이트에는 ${signalCount || "몇 가지"} 웹사이트 시그널이 보여 ${serviceTypeLabel} 중심의 아웃리치 각도를 만들 수 있습니다.`,
    outreachAngle1: (signal) =>
      `“${signal}”에 대해 상대가 필요 없으면 무시할 수 있는 작은 아이디어로 시작하세요.`,
    outreachAngle2: "메일 자체가 도움이 되도록 관찰, 가능한 영향, 답하기 쉬운 제안을 하나씩 담으세요.",
    outreachAngle3: "진단 보고서처럼 보이지 않게 외부 시선의 작은 제안으로 표현하세요.",
    firstLine1: (companyName, firstLine) =>
      `${companyName} 사이트에는 유용한 정보가 있지만, ${firstLine}`,
    firstLine2:
      "사이트가 방문자에게 출발점은 제공하지만, 홈페이지에서 다음 단계가 더 잘 보이도록 만들 여지가 있습니다.",
    firstLine3: (domain) =>
      `${domain} 을 보면서 처음 방문한 사람이 다음 단계를 조금 더 쉽게 찾을 수 있겠다는 작은 아이디어가 떠올랐습니다.`,
    shortEmail: (companyName, firstLine) =>
      `안녕하세요.\n\n${companyName} 사이트를 보다가 ${firstLine}\n\n처음 방문한 사람이 다음에 무엇을 하면 좋을지 더 빨리 보이면 비교 중인 방문자의 이탈을 줄이는 데 도움이 될 수 있을 것 같습니다.\n\n도움이 된다면 구체적인 아이디어 2~3가지를 보내드려도 될까요?`,
    signals: {
      noCta: {
        signal: "페이지 초반의 다음 단계가 조금 더 분명해질 수 있습니다.",
        reason: "처음 방문한 사람이 다음 행동을 빨리 이해할수록 문의나 비교 검토로 넘어가기 쉽습니다.",
        source: "홈페이지"
      },
      metaDescriptionThin: {
        signal: "메타 설명이 없거나 내용이 약합니다.",
        reason: "홈페이지 메타데이터만으로는 검색 스니펫에서 제안을 충분히 설명하지 못할 수 있습니다.",
        source: "메타 설명"
      },
      h1Weak: {
        signal: "홈페이지 H1이 불명확하거나 없습니다.",
        reason: "약한 H1은 방문자와 검색엔진이 페이지를 빠르게 이해하기 어렵게 만들 수 있습니다.",
        source: "홈페이지 H1"
      },
      noProof: {
        signal: "분명한 신뢰 요소 섹션이나 사례 연구 경로가 보이지 않습니다.",
        reason: "신뢰 요소가 부족한 잠재고객은 전환 중심 웹사이트나 콘텐츠 작업과 잘 맞을 수 있습니다.",
        source: "내비게이션 확인"
      },
      noBlog: {
        signal: "내비게이션에서 블로그나 리소스 경로가 잘 보이지 않습니다.",
        reason: "콘텐츠 마케팅 접점이 적거나 내비게이션에 공백이 있다는 신호일 수 있습니다.",
        source: "내비게이션 확인"
      },
      growthHiring: {
        signal: "사이트에 채용 또는 성장 관련 문구가 보입니다.",
        reason: "성장 관련 채용은 웹사이트, SEO 또는 전환 지원이 필요한 타이밍을 보여줄 수 있습니다.",
        source: "홈페이지/내비게이션 확인"
      }
    }
  },
  de: {
    unknownIndustry: "unbekannt",
    serviceTypes: {
      web_design: "Webdesign",
      seo: "SEO",
      marketing: "Marketing",
      custom: "individuelle"
    },
    fallbackSignal: "der Weg zum nächsten Schritt für neue Besucher noch klarer sein könnte.",
    summary: (companyName) =>
      `${companyName} wirkt wie eine Unternehmenswebsite mit genug öffentlichen Informationen für websitebasierte Prospect-Recherche.`,
    fitReason: (signalCount, serviceTypeLabel) =>
      `Die Website zeigt ${signalCount || "einige"} Website-Signale, die einen ${serviceTypeLabel}-Outreach-Winkel stützen können.`,
    outreachAngle1: (signal) =>
      `Beginnen Sie mit einer vorsichtigen Beobachtung zu „${signal}“ und bieten Sie eine kleine Idee an, die der Empfänger ignorieren kann, wenn sie nicht passt.`,
    outreachAngle2: "Die Nachricht sollte für sich nützlich sein: eine Beobachtung, eine mögliche Auswirkung, eine einfache Antwort.",
    outreachAngle3: "Nicht wie eine Diagnose formulieren, sondern als kurze Außenperspektive.",
    firstLine1: (companyName, firstLine) =>
      `Mir ist aufgefallen, dass ${companyName} nützliche Website-Inhalte hat, aber ${firstLine}`,
    firstLine2:
      "Ihre Website gibt Besuchern einen Startpunkt, aber der stärkste nächste Schritt könnte auf der Homepage leichter erkennbar sein.",
    firstLine3: (domain) =>
      `Beim Blick auf ${domain} hatte ich eine kleine Idee, wie neue Besucher den nächsten Schritt leichter finden könnten.`,
    shortEmail: (companyName, firstLine) =>
      `Hallo,\n\nmir ist beim Blick auf ${companyName} aufgefallen, dass ${firstLine}\n\nEine kleine Idee wäre, den nächsten Schritt für Besucher, die gerade Optionen vergleichen, etwas schneller sichtbar zu machen.\n\nWäre es hilfreich, wenn ich 2-3 konkrete Ideen schicke?`,
    signals: {
      noCta: {
        signal: "Der nächste Schritt könnte früh auf der Seite leichter erkennbar sein.",
        reason: "Wenn der nächste Schritt sofort klar ist, können neue Besucher schneller entscheiden, ob sie mehr erfahren oder Kontakt aufnehmen möchten.",
        source: "Homepage"
      },
      metaDescriptionThin: {
        signal: "Die Meta-Beschreibung fehlt oder ist zu dünn.",
        reason: "Die Homepage-Metadaten erklären das Angebot für Such-Snippets möglicherweise nicht deutlich genug.",
        source: "Meta-Beschreibung"
      },
      h1Weak: {
        signal: "Die H1 der Homepage ist unklar oder nicht verfügbar.",
        reason: "Eine schwache H1 erschwert es Besuchern und Suchmaschinen, die Seite schnell zu verstehen.",
        source: "Homepage-H1"
      },
      noProof: {
        signal: "Es wurde kein klarer Proof-Bereich oder Case-Study-Pfad gefunden.",
        reason: "Prospects mit wenig sozialem Beweis passen oft gut zu conversion-orientierter Website- oder Content-Arbeit.",
        source: "Navigationsprüfung"
      },
      noBlog: {
        signal: "In der Navigation war kein klarer Blog- oder Ressourcenpfad sichtbar.",
        reason: "Das kann auf wenig Content-Marketing-Fläche oder eine Lücke in der Navigation hindeuten.",
        source: "Navigationsprüfung"
      },
      growthHiring: {
        signal: "Auf der Website erscheinen Hiring- oder Wachstums-Signale.",
        reason: "Wachstumsbezogene Hiring-Signale können auf Timing für Website-, SEO- oder Conversion-Unterstützung hinweisen.",
        source: "Homepage/Navigationsprüfung"
      }
    }
  },
  nl: {
    unknownIndustry: "onbekend",
    serviceTypes: {
      web_design: "webdesign",
      seo: "SEO",
      marketing: "marketing",
      custom: "maatwerk"
    },
    fallbackSignal: "het pad naar de volgende stap voor nieuwe bezoekers duidelijker kan zijn.",
    summary: (companyName) =>
      `${companyName} lijkt een bedrijfswebsite te zijn met genoeg openbare informatie voor websitegebaseerd prospectonderzoek.`,
    fitReason: (signalCount, serviceTypeLabel) =>
      `De site laat ${signalCount || "enkele"} websitesignalen zien die een ${serviceTypeLabel}-outreachhoek kunnen ondersteunen.`,
    outreachAngle1: (signal) =>
      `Begin met een rustige observatie over “${signal}” en bied één klein idee aan dat de ontvanger makkelijk kan negeren als het niet past.`,
    outreachAngle2: "Maak de mail op zichzelf nuttig: één observatie, één mogelijke impact en één eenvoudige reactie.",
    outreachAngle3: "Vermijd diagnosetaal; breng het als een korte blik van buitenaf.",
    firstLine1: (companyName, firstLine) =>
      `Ik zag dat ${companyName} nuttige website-inhoud heeft, maar ${firstLine}`,
    firstLine2:
      "De site geeft bezoekers een startpunt, maar de sterkste volgende stap kan vanaf de homepage makkelijker zichtbaar worden.",
    firstLine3: (domain) =>
      `Ik keek naar ${domain} en had een klein idee waardoor nieuwe bezoekers de volgende stap misschien makkelijker vinden.`,
    shortEmail: (companyName, firstLine) =>
      `Hallo,\n\nik keek naar ${companyName} en zag dat ${firstLine}\n\nEen klein idee is om de volgende stap sneller zichtbaar te maken voor mensen die opties vergelijken.\n\nZou het nuttig zijn als ik 2-3 concrete ideeën stuur?`,
    signals: {
      noCta: {
        signal: "De volgende stap kan vroeg op de pagina duidelijker zichtbaar zijn.",
        reason: "Als de volgende stap direct duidelijk is, kunnen nieuwe bezoekers sneller beslissen of ze meer willen weten of contact opnemen.",
        source: "homepage"
      },
      metaDescriptionThin: {
        signal: "De meta description ontbreekt of is zwak.",
        reason: "De homepage-metadata legt het aanbod mogelijk niet sterk genoeg uit voor zoekresultaten.",
        source: "meta description"
      },
      h1Weak: {
        signal: "De homepage-H1 is onduidelijk of niet beschikbaar.",
        reason: "Een zwakke H1 maakt het voor bezoekers en zoekmachines lastiger om de pagina snel te begrijpen.",
        source: "homepage-H1"
      },
      noProof: {
        signal: "Er is geen duidelijk bewijsblok of case-study-pad gevonden.",
        reason: "Prospects met weinig bewijs passen vaak goed bij conversiegerichte website- of contentverbetering.",
        source: "navigatiecheck"
      },
      noBlog: {
        signal: "Er was geen duidelijk blog- of resourcepad zichtbaar in de navigatie.",
        reason: "Dit kan wijzen op weinig contentmarketing-oppervlak of een gat in de navigatie.",
        source: "navigatiecheck"
      },
      growthHiring: {
        signal: "Er verschijnt hiring- of groeitaal op de website.",
        reason: "Groeigerelateerde hiring kan wijzen op timing voor website-, SEO- of conversieondersteuning.",
        source: "homepage/navigatiecheck"
      }
    }
  },
  fr: {
    unknownIndustry: "inconnu",
    serviceTypes: {
      web_design: "web design",
      seo: "SEO",
      marketing: "marketing",
      custom: "personnalisée"
    },
    fallbackSignal:
      "le passage vers l'étape suivante pourrait être plus clair pour les nouveaux visiteurs.",
    summary: (companyName) =>
      `${companyName} semble être un site d'entreprise avec assez d'informations publiques pour une recherche de prospects basée sur le site web.`,
    fitReason: (signalCount, serviceTypeLabel) =>
      `Le site montre ${signalCount || "quelques"} signaux web qui peuvent soutenir un angle d'approche ${serviceTypeLabel}.`,
    outreachAngle1: (signal) =>
      `Commencez par une observation douce autour de « ${signal} » et proposez une petite idée que la personne peut ignorer si elle n'est pas utile.`,
    outreachAngle2: "Le message doit être utile en lui-même : une observation, un impact possible, une réponse facile.",
    outreachAngle3: "Évitez le ton diagnostic ; présentez cela comme un regard extérieur rapide.",
    firstLine1: (companyName, firstLine) =>
      `J'ai remarqué que ${companyName} a un site utile, mais ${firstLine}`,
    firstLine2:
      "Le site donne déjà un point de départ aux visiteurs, mais l'étape suivante la plus forte pourrait être plus visible dès la page d'accueil.",
    firstLine3: (domain) =>
      `En regardant ${domain}, j'ai eu une petite idée qui pourrait aider les nouveaux visiteurs à trouver plus vite l'étape suivante.`,
    shortEmail: (companyName, firstLine) =>
      `Bonjour,\n\nj'ai regardé le site de ${companyName} et j'ai remarqué que ${firstLine}\n\nUne petite idée serait de rendre l'étape suivante plus visible pour les personnes qui comparent plusieurs options.\n\nSerait-il utile que j'envoie 2 ou 3 idées concrètes ?`,
    signals: {
      noCta: {
        signal: "L'étape suivante pourrait être plus visible en haut de page.",
        reason: "Quand l'étape suivante est claire, un nouveau visiteur peut décider plus vite s'il veut en savoir plus ou prendre contact.",
        source: "page d'accueil"
      },
      metaDescriptionThin: {
        signal: "La meta description est absente ou trop faible.",
        reason: "Les métadonnées de la page d'accueil n'expliquent peut-être pas assez clairement l'offre pour les extraits de recherche.",
        source: "meta description"
      },
      h1Weak: {
        signal: "Le H1 de la page d'accueil est flou ou indisponible.",
        reason: "Un H1 faible peut rendre la page plus difficile à comprendre rapidement pour les visiteurs comme pour les moteurs de recherche.",
        source: "H1 de la page d'accueil"
      },
      noProof: {
        signal: "Aucune section de preuve claire ni parcours vers des études de cas n'a été trouvé.",
        reason: "Les prospects avec peu de preuve sociale peuvent bien correspondre à un travail de site ou de contenu orienté conversion.",
        source: "vérification de navigation"
      },
      noBlog: {
        signal: "Aucun accès blog ou ressources n'était clairement visible dans la navigation.",
        reason: "Cela peut indiquer peu de surface de content marketing ou une lacune dans la navigation.",
        source: "vérification de navigation"
      },
      growthHiring: {
        signal: "Le site montre des signaux de recrutement ou de croissance.",
        reason: "Le recrutement lié à la croissance peut indiquer un bon timing pour un accompagnement site, SEO ou conversion.",
        source: "page d'accueil/vérification de navigation"
      }
    }
  }
};

const sampleLocaleContentByLocale: Record<ScanLocale, SampleLocaleContent> = {
  en: {
    workspaceName: "LeadCue Demo Profile",
    targetIndustries: ["B2B SaaS", "local services", "professional services"],
    targetCountries: ["United States", "United Kingdom", "Canada", "Australia"],
    offerDescription:
      "We help companies turn more website visitors into booked calls with clearer CTAs, proof sections, and conversion-focused page structure.",
    industryLabels: {
      northstar: "B2B SaaS",
      beacon: "Local healthcare",
      lumen: "B2B services"
    },
    demoPages: {
      northstar: {
        title: "Northstar Analytics | Reporting software for small finance leaders",
        metaDescription:
          "Northstar Analytics gives finance leaders clearer reporting, monthly board packs, and faster KPI visibility without replacing the tools they already use.",
        h1: "Northstar Analytics gives fast-moving finance leaders reporting without spreadsheet cleanup",
        text:
          "Northstar Analytics helps finance leaders build weekly reporting, board updates, and KPI visibility without replacing their current stack. The homepage explains the product, integrations, dashboards, and finance workflows. Visitors can explore product pages, pricing, and company updates. Northstar is hiring across customer success and revenue operations this quarter."
      },
      beacon: {
        title: "Beacon Dental Group | Family and cosmetic dentistry",
        metaDescription:
          "Beacon Dental Group helps local families book preventive, cosmetic, and restorative dental care with a clean, mobile-friendly clinic experience.",
        h1: "Beacon Dental Group provides family and cosmetic dentistry for busy neighborhoods",
        text:
          "Beacon Dental Group serves local families with preventive cleanings, whitening, implants, and emergency visits. The website covers treatments, insurance support, office hours, and staff bios. Patients can read reviews, compare services, and meet the practice staff. Beacon is hiring a front-desk coordinator and dental hygienist this season."
      },
      lumen: {
        title: "Lumen Logistics | Freight coordination for fast-moving operators",
        metaDescription:
          "Lumen Logistics helps operations leaders coordinate freight, carrier updates, and exception handling with clearer visibility across every shipment.",
        h1: "Lumen Logistics gives operations leaders freight coordination without spreadsheet chaos",
        text:
          "Lumen Logistics supports operations leaders with routing visibility, carrier coordination, and exception handling for every shipment. The site explains service coverage, shipment workflows, and operational reporting. Visitors can review service regions, platform updates, and hiring information for implementation and support roles."
      }
    },
    analytics: {
      eventMetadata: {
        basicScanOneCredit: "basic scan, 1 credit",
        crmHubSpot: "CSV / HubSpot",
        hubSpotMappingCta: "HubSpot mapping CTA"
      },
      recommendations: {
        toolPageCta:
          "Tool-page CTA clicks are healthy. Keep routing those users into signup with the same field template context.",
        exportsGap:
          "Exports are lower than scans, so the next bottleneck is likely qualification confidence or CSV handoff timing.",
        crmTemplateTraffic: "The CSV mapping template is pulling the most product-led traffic right now.",
        ctaSignupGap:
          "CTA clicks are happening, but signups are not. Recheck signup copy, friction, and plan fit on the highest-intent pages.",
        noScans:
          "Prospects are entering the dashboard but scans have not started yet. Make the first scan path even more obvious in onboarding.",
        scanExportGap:
          "Scans are landing, but exports are not. The next bottleneck is likely qualification confidence or CSV handoff clarity.",
        topPage:
          "The strongest page right now is __PAGE__. Keep testing a sharper CTA and internal links from that page.",
        steadyFunnel:
          "The funnel is moving. Keep comparing CTA clicks, signups, scans, and exports week over week."
      }
    },
    pipelineOwner: "Avery",
    pipelineActorName: "Demo user",
    pipelineNotes: "Prioritize the homepage CTA angle before export."
  },
  zh: {
    workspaceName: "LeadCue 示例档案",
    targetIndustries: ["B2B SaaS", "本地服务", "专业服务"],
    targetCountries: ["美国", "英国", "加拿大", "澳大利亚"],
    offerDescription:
      "我们通过更清晰的 CTA、证明版块和以转化为导向的页面结构，帮助企业把更多网站访客转化为预约通话。",
    industryLabels: {
      northstar: "B2B SaaS",
      beacon: "本地医疗",
      lumen: "B2B 服务"
    },
    demoPages: {
      northstar: {
        title: "Northstar Analytics | 面向小型财务团队的报表软件",
        metaDescription:
          "Northstar Analytics 帮助财务团队获得更清晰的报表、月度董事会材料和更快的 KPI 可见性，同时无需替换现有工具。",
        h1: "Northstar Analytics 帮助快速发展的财务团队摆脱表格清理，完成报表工作",
        text:
          "Northstar Analytics 帮助财务团队搭建周报、董事会更新和 KPI 可视化，而无需替换现有技术栈。首页介绍产品、集成、仪表盘和财务工作流。访客可以查看产品页、价格和团队动态。Northstar 本季度正在招聘客户成功和收入运营岗位。"
      },
      beacon: {
        title: "Beacon Dental Group | 家庭与美容牙科",
        metaDescription:
          "Beacon Dental Group 为本地家庭提供预防、医美和修复牙科预约，并呈现清晰、移动端友好的诊所体验。",
        h1: "Beacon Dental Group 为繁忙社区提供家庭与美容牙科服务",
        text:
          "Beacon Dental Group 为本地家庭提供洗牙、美白、种植和急诊服务。网站介绍治疗项目、保险支持、营业时间和团队简介。患者可以阅读评价、比较服务并了解诊所团队。Beacon 本季正在招聘前台协调员和牙科洁治师。"
      },
      lumen: {
        title: "Lumen Logistics | 面向快节奏团队的货运协调",
        metaDescription:
          "Lumen Logistics 帮助运营团队协调货运、承运商更新和异常处理，让每票货运更清晰可见。",
        h1: "Lumen Logistics 让运营团队摆脱表格混乱完成货运协调",
        text:
          "Lumen Logistics 为运营团队提供路线可视化、承运商协调和每票货运的异常处理。网站说明服务覆盖范围、发运流程和运营报告。访客可以查看服务地区、平台更新，以及实施和支持岗位招聘信息。"
      }
    },
    analytics: {
      eventMetadata: {
        basicScanOneCredit: "基础扫描，1 积分",
        crmHubSpot: "CSV / HubSpot",
        hubSpotMappingCta: "HubSpot 映射 CTA"
      },
      recommendations: {
        toolPageCta: "工具页 CTA 点击表现不错，继续把这批用户以相同字段模板场景引导到注册流程。",
        exportsGap: "导出量低于扫描量，下一个瓶颈很可能是资格判断信心或 CSV 交接时机。",
        crmTemplateTraffic: "CSV 字段映射模板目前带来了最多的产品驱动流量。",
        ctaSignupGap: "CTA 点击已经发生，但注册还没有跟上。请重新检查高意图页面的注册文案、摩擦点和套餐匹配。",
        noScans: "潜在客户已经进入看板，但还没有开始扫描。请让 onboarding 中的首次扫描路径更加明显。",
        scanExportGap: "扫描已经发生，但导出还没有跟上。下一个瓶颈很可能是资格判断信心或 CSV 交接清晰度。",
        topPage: "当前表现最强的页面是 __PAGE__。继续测试更清晰的 CTA，并从该页面加强内部链接。",
        steadyFunnel: "漏斗正在运转。继续按周比较 CTA 点击、注册、扫描和导出。"
      }
    },
    pipelineOwner: "Avery",
    pipelineActorName: "示例用户",
    pipelineNotes: "导出前优先处理首页 CTA 这个角度。"
  },
  ja: {
    workspaceName: "LeadCue デモプロフィール",
    targetIndustries: ["B2B SaaS", "地域サービス", "専門サービス"],
    targetCountries: ["アメリカ", "イギリス", "カナダ", "オーストラリア"],
    offerDescription:
      "より明確な CTA、実績セクション、コンバージョン重視のページ構成によって、サイト訪問者を商談につなげやすくします。",
    industryLabels: {
      northstar: "B2B SaaS",
      beacon: "地域医療",
      lumen: "B2B サービス"
    },
    demoPages: {
      northstar: {
        title: "Northstar Analytics | 小規模財務チーム向けレポートソフトウェア",
        metaDescription:
          "Northstar Analytics は、既存ツールを置き換えずに、財務チームへ明確なレポート、月次取締役会資料、迅速な KPI 可視化を提供します。",
        h1: "Northstar Analytics は成長中の財務チームにスプレッドシート整理なしのレポートを提供",
        text:
          "Northstar Analytics は、財務チームが既存スタックを置き換えずに週次レポート、取締役会向け更新、KPI 可視化を作れるよう支援します。ホームページでは製品、連携、ダッシュボード、財務ワークフローを説明しています。訪問者は製品ページ、料金、チーム更新を確認できます。Northstar は今四半期、カスタマーサクセスとレベニューオペレーション職を採用中です。"
      },
      beacon: {
        title: "Beacon Dental Group | ファミリー歯科・審美歯科",
        metaDescription:
          "Beacon Dental Group は、地域の家族が予防歯科、審美歯科、修復治療を予約しやすい、モバイル対応のわかりやすいクリニック体験を提供します。",
        h1: "Beacon Dental Group は忙しい地域の家族にファミリー歯科と審美歯科を提供",
        text:
          "Beacon Dental Group は地域の家族に、定期クリーニング、ホワイトニング、インプラント、緊急診療を提供しています。サイトでは治療内容、保険サポート、診療時間、チーム紹介を掲載しています。患者はレビューを読み、サービスを比較し、医院チームを確認できます。Beacon は今季、受付コーディネーターと歯科衛生士を採用中です。"
      },
      lumen: {
        title: "Lumen Logistics | 速く動くチーム向け貨物調整",
        metaDescription:
          "Lumen Logistics は、運用チームが貨物、配送会社の更新、例外対応を調整し、各配送の可視性を高めるのを支援します。",
        h1: "Lumen Logistics は運用チームにスプレッドシート混乱のない貨物調整を提供",
        text:
          "Lumen Logistics は、運用チームにルート可視化、配送会社との調整、各配送の例外対応を提供します。サイトではサービス範囲、出荷ワークフロー、運用レポートを説明しています。訪問者は対応地域、プラットフォーム更新、導入・サポート職の採用情報を確認できます。"
      }
    },
    analytics: {
      eventMetadata: {
        basicScanOneCredit: "基本スキャン、1クレジット",
        crmHubSpot: "CSV / HubSpot",
        hubSpotMappingCta: "HubSpot マッピング CTA"
      },
      recommendations: {
        toolPageCta:
          "ツールページの CTA クリックは健全です。同じフィールドテンプレート文脈でサインアップへ誘導し続けてください。",
        exportsGap:
          "エクスポート数がスキャン数を下回っています。次のボトルネックは、適格性への確信または CSV 引き渡しのタイミングである可能性があります。",
        crmTemplateTraffic: "CSV マッピングテンプレートが現在もっとも多くのプロダクト起点トラフィックを集めています。",
        ctaSignupGap:
          "CTAクリックは発生していますが、サインアップにつながっていません。高意図ページの登録コピー、摩擦、プラン適合を見直してください。",
        noScans:
          "アカウントはダッシュボードに入っていますが、まだスキャンを実行していません。オンボーディングで最初のスキャン導線をさらに目立たせてください。",
        scanExportGap:
          "スキャンは発生していますが、エクスポートにつながっていません。次のボトルネックは適格性への確信または CSV 引き渡しの明確さである可能性があります。",
        topPage:
          "現在もっとも強いページは __PAGE__ です。そのページから、より鋭い CTA と内部リンクを引き続きテストしてください。",
        steadyFunnel:
          "ファネルは動いています。CTAクリック、サインアップ、スキャン、エクスポートを週次で比較し続けてください。"
      }
    },
    pipelineOwner: "Avery",
    pipelineActorName: "デモユーザー",
    pipelineNotes: "エクスポート前にホームページ CTA の角度を優先して確認します。"
  },
  ko: {
    workspaceName: "LeadCue 데모 프로필",
    targetIndustries: ["B2B SaaS", "로컬 서비스", "전문 서비스"],
    targetCountries: ["미국", "영국", "캐나다", "호주"],
    offerDescription:
      "더 명확한 CTA, 신뢰 요소 섹션, 전환 중심 페이지 구조로 더 많은 웹사이트 방문자를 상담으로 전환하도록 돕습니다.",
    industryLabels: {
      northstar: "B2B SaaS",
      beacon: "지역 의료",
      lumen: "B2B 서비스"
    },
    demoPages: {
      northstar: {
        title: "Northstar Analytics | 소규모 재무팀을 위한 리포팅 소프트웨어",
        metaDescription:
          "Northstar Analytics는 기존 도구를 교체하지 않고도 재무팀에 더 명확한 리포트, 월간 이사회 자료, 빠른 KPI 가시성을 제공합니다.",
        h1: "Northstar Analytics는 빠르게 움직이는 재무팀에 스프레드시트 정리 없는 리포팅을 제공합니다",
        text:
          "Northstar Analytics는 재무팀이 현재 스택을 교체하지 않고 주간 리포트, 이사회 업데이트, KPI 가시성을 구축하도록 돕습니다. 홈페이지는 제품, 연동, 대시보드, 재무 워크플로를 설명합니다. 방문자는 제품 페이지, 가격, 팀 업데이트를 살펴볼 수 있습니다. Northstar는 이번 분기에 고객 성공 및 수익 운영 직무를 채용 중입니다."
      },
      beacon: {
        title: "Beacon Dental Group | 가족 및 미용 치과",
        metaDescription:
          "Beacon Dental Group은 지역 가족이 예방, 미용, 회복 치과 진료를 예약할 수 있도록 깔끔하고 모바일 친화적인 클리닉 경험을 제공합니다.",
        h1: "Beacon Dental Group은 바쁜 지역 사회를 위한 가족 및 미용 치과 서비스를 제공합니다",
        text:
          "Beacon Dental Group은 지역 가족에게 정기 검진, 미백, 임플란트, 응급 진료를 제공합니다. 웹사이트는 치료 항목, 보험 지원, 진료 시간, 팀 소개를 다룹니다. 환자는 리뷰를 읽고, 서비스를 비교하고, 진료팀을 확인할 수 있습니다. Beacon은 이번 시즌 프런트 데스크 코디네이터와 치과 위생사를 채용 중입니다."
      },
      lumen: {
        title: "Lumen Logistics | 빠르게 움직이는 팀을 위한 화물 조율",
        metaDescription:
          "Lumen Logistics는 운영팀이 화물, 운송사 업데이트, 예외 처리를 조율하고 모든 배송의 가시성을 높이도록 돕습니다.",
        h1: "Lumen Logistics는 운영팀에 스프레드시트 혼란 없는 화물 조율을 제공합니다",
        text:
          "Lumen Logistics는 운영팀에 경로 가시성, 운송사 조율, 각 배송의 예외 처리를 지원합니다. 사이트는 서비스 범위, 배송 워크플로, 운영 리포팅을 설명합니다. 방문자는 서비스 지역, 플랫폼 업데이트, 구현 및 지원 직무 채용 정보를 확인할 수 있습니다."
      }
    },
    analytics: {
      eventMetadata: {
        basicScanOneCredit: "기본 스캔, 1 크레딧",
        crmHubSpot: "CSV / HubSpot",
        hubSpotMappingCta: "HubSpot 매핑 CTA"
      },
      recommendations: {
        toolPageCta:
          "도구 페이지 CTA 클릭이 건강합니다. 같은 필드 템플릿 맥락으로 사용자를 가입 흐름에 계속 연결하세요.",
        exportsGap:
          "내보내기가 스캔보다 적습니다. 다음 병목은 자격 판단 신뢰도 또는 CSV 핸드오프 타이밍일 가능성이 큽니다.",
        crmTemplateTraffic: "CSV 매핑 템플릿이 현재 가장 많은 제품 주도 트래픽을 끌어오고 있습니다.",
        ctaSignupGap:
          "CTA 클릭은 발생하지만 가입으로 이어지지 않습니다. 고의도 페이지의 가입 문구, 마찰, 플랜 적합성을 다시 확인하세요.",
        noScans:
          "계정은 대시보드에 들어오고 있지만 아직 스캔을 실행하지 않았습니다. 온보딩에서 첫 스캔 경로를 더 분명하게 만드세요.",
        scanExportGap:
          "스캔은 발생하지만 내보내기로 이어지지 않습니다. 다음 병목은 자격 판단 신뢰도 또는 CSV 핸드오프 명확성일 가능성이 큽니다.",
        topPage:
          "현재 가장 강한 페이지는 __PAGE__ 입니다. 해당 페이지에서 더 날카로운 CTA와 내부 링크를 계속 테스트하세요.",
        steadyFunnel:
          "퍼널은 움직이고 있습니다. CTA 클릭, 가입, 스캔, 내보내기를 매주 비교하세요."
      }
    },
    pipelineOwner: "Avery",
    pipelineActorName: "데모 사용자",
    pipelineNotes: "내보내기 전에 홈페이지 CTA 각도를 우선 검토하세요."
  },
  de: {
    workspaceName: "LeadCue Demo-dashboard",
    targetIndustries: ["B2B SaaS", "lokale Dienstleistungen", "professionelle Dienstleistungen"],
    targetCountries: ["Vereinigte Staaten", "Vereinigtes Königreich", "Kanada", "Australien"],
    offerDescription:
      "Wir helfen Unternehmen, mehr Website-Besucher mit klareren CTAs, Proof-Sektionen und conversion-orientierter Seitenstruktur in gebuchte Gespräche zu verwandeln.",
    industryLabels: {
      northstar: "B2B SaaS",
      beacon: "Lokale Gesundheitsdienste",
      lumen: "B2B-Dienstleistungen"
    },
    demoPages: {
      northstar: {
        title: "Northstar Analytics | Reporting-Software für kleine Finanzstaffs",
        metaDescription:
          "Northstar Analytics bietet Finanzstaffs klarere Reports, monatliche Board-Pakete und schnellere KPI-Sichtbarkeit, ohne bestehende Tools zu ersetzen.",
        h1: "Northstar Analytics liefert schnellen Finanzstaffs Reporting ohne Spreadsheet-Aufräumen",
        text:
          "Northstar Analytics hilft Finanzstaffs, Wochenreports, Board-Updates und KPI-Sichtbarkeit aufzubauen, ohne den bestehenden Stack zu ersetzen. Die Homepage erklärt Produkt, Integrationen, Dashboards und Finanz-Workflows. Besucher können Produktseiten, Preise und Unternehmensupdates ansehen. Northstar stellt in diesem Quartal Rollen in Customer Success und Revenue Operations ein."
      },
      beacon: {
        title: "Beacon Dental Group | Familien- und ästhetische Zahnmedizin",
        metaDescription:
          "Beacon Dental Group hilft lokalen Familien, präventive, ästhetische und restaurative Zahnbehandlungen über ein klares, mobilfreundliches Praxiserlebnis zu buchen.",
        h1: "Beacon Dental Group bietet Familien- und ästhetische Zahnmedizin für lebendige Stadtteile",
        text:
          "Beacon Dental Group betreut lokale Familien mit Prophylaxe, Bleaching, Implantaten und Notfallterminen. Die Website erklärt Behandlungen, Versicherungsunterstützung, Öffnungszeiten und Praxisprofile. Patienten können Bewertungen lesen, Leistungen vergleichen und das Praxisstaff kennenlernen. Beacon stellt in dieser Saison eine Empfangskoordination und Dentalhygiene ein."
      },
      lumen: {
        title: "Lumen Logistics | Frachtkoordination für schnell arbeitende Betreiber",
        metaDescription:
          "Lumen Logistics hilft Operations-Verantwortlichen, Fracht, Carrier-Updates und Ausnahmefälle zu koordinieren und jede Sendung transparenter zu verfolgen.",
        h1: "Lumen Logistics gibt Operations-Verantwortlichen Frachtkoordination ohne Tabellenchaos",
        text:
          "Lumen Logistics unterstützt Operations-Verantwortliche mit Routing-Transparenz, Carrier-Koordination und Ausnahmebehandlung für jede Sendung. Die Website erklärt Serviceabdeckung, Versand-Workflows und operatives Reporting. Besucher können Servicegebiete, Plattform-Updates sowie Stellen für Implementierung und Support ansehen."
      }
    },
    analytics: {
      eventMetadata: {
        basicScanOneCredit: "Basis-Scan, 1 Credit",
        crmHubSpot: "CSV / HubSpot",
        hubSpotMappingCta: "HubSpot-Mapping-CTA"
      },
      recommendations: {
        toolPageCta:
          "CTA-Klicks auf Tool-Seiten sind gesund. Leiten Sie diese Nutzer mit demselben Feldtemplate-Kontext weiter in die Registrierung.",
        exportsGap:
          "Exporte liegen unter den Scans. Der nächste Engpass ist wahrscheinlich Qualifizierungsvertrauen oder CSV-Übergabezeitpunkt.",
        crmTemplateTraffic: "Das CSV-Mapping-Template bringt derzeit den meisten produktgetriebenen Traffic.",
        ctaSignupGap:
          "CTA-Klicks finden statt, aber Registrierungen bleiben aus. Prüfen Sie Signup-Copy, Reibung und Plan-Fit auf den Seiten mit höchster Absicht.",
        noScans:
          "Accounts gelangen in den dashboard, führen aber noch keine Scans aus. Machen Sie den ersten Scan-Pfad im Onboarding noch deutlicher.",
        scanExportGap:
          "Scans kommen an, aber Exporte nicht. Der nächste Engpass ist wahrscheinlich Qualifizierungsvertrauen oder Klarheit bei der CSV-Übergabe.",
        topPage:
          "Die stärkste Seite ist derzeit __PAGE__. Testen Sie dort weiter eine schärfere CTA und interne Links.",
        steadyFunnel:
          "Der Funnel bewegt sich. Vergleichen Sie CTA-Klicks, Registrierungen, Scans und Exporte weiter Woche für Woche."
      }
    },
    pipelineOwner: "Avery",
    pipelineActorName: "Demo-Nutzer",
    pipelineNotes: "Vor dem Export zuerst den CTA-Winkel der Homepage priorisieren."
  },
  nl: {
    workspaceName: "LeadCue demo-dashboard",
    targetIndustries: ["B2B SaaS", "lokale diensten", "professionele diensten"],
    targetCountries: ["Verenigde Staten", "Verenigd Koninkrijk", "Canada", "Australië"],
    offerDescription:
      "We helpen bedrijven meer websitebezoekers om te zetten in geboekte gesprekken met duidelijkere CTA's, bewijsblokken en een conversiegerichte paginastructuur.",
    industryLabels: {
      northstar: "B2B SaaS",
      beacon: "Lokale zorg",
      lumen: "B2B-diensten"
    },
    demoPages: {
      northstar: {
        title: "Northstar Analytics | Rapportagesoftware voor kleine finance-staffs",
        metaDescription:
          "Northstar Analytics geeft finance-staffs duidelijkere rapportages, maandelijkse board packs en snellere KPI-zichtbaarheid zonder bestaande tools te vervangen.",
        h1: "Northstar Analytics geeft snelle finance-staffs rapportage zonder spreadsheet-opruimwerk",
        text:
          "Northstar Analytics helpt finance-staffs wekelijkse rapportages, board updates en KPI-zichtbaarheid te bouwen zonder hun huidige stack te vervangen. De homepage legt het product, integraties, dashboards en finance-workflows uit. Bezoekers kunnen productpagina's, prijzen en staffupdates bekijken. Northstar werft dit kwartaal voor customer success en revenue operations."
      },
      beacon: {
        title: "Beacon Dental Group | Familie- en cosmetische tandzorg",
        metaDescription:
          "Beacon Dental Group helpt lokale gezinnen preventieve, cosmetische en herstellende tandzorg te boeken via een heldere, mobielvriendelijke praktijkervaring.",
        h1: "Beacon Dental Group biedt familie- en cosmetische tandzorg voor drukke buurten",
        text:
          "Beacon Dental Group bedient lokale gezinnen met controles, whitening, implantaten en spoedafspraken. De website behandelt behandelingen, verzekeringshulp, openingstijden en staffprofielen. Patiënten kunnen reviews lezen, diensten vergelijken en het praktijkstaff leren kennen. Beacon werft dit seizoen een frontdeskcoördinator en mondhygiënist."
      },
      lumen: {
        title: "Lumen Logistics | Vrachtcoördinatie voor snel bewegende staffs",
        metaDescription:
          "Lumen Logistics helpt operations-staffs vracht, carrier-updates en uitzonderingen coördineren met duidelijkere zichtbaarheid per zending.",
        h1: "Lumen Logistics geeft operations-staffs vrachtcoördinatie zonder spreadsheetchaos",
        text:
          "Lumen Logistics ondersteunt operations-staffs met routezichtbaarheid, carriercoördinatie en uitzonderingsafhandeling voor elke zending. De site legt servicedekking, verzendworkflows en operationele rapportage uit. Bezoekers kunnen regio's, platformupdates en vacatures voor implementatie en support bekijken."
      }
    },
    analytics: {
      eventMetadata: {
        basicScanOneCredit: "basisscan, 1 credit",
        crmHubSpot: "CSV / HubSpot",
        hubSpotMappingCta: "HubSpot-mapping CTA"
      },
      recommendations: {
        toolPageCta:
          "CTA-klikken op toolpagina's zijn gezond. Blijf deze gebruikers met dezelfde veldtemplate-context naar signup leiden.",
        exportsGap:
          "Exports blijven achter bij scans. De volgende bottleneck is waarschijnlijk kwalificatievertrouwen of timing van CSV-overdracht.",
        crmTemplateTraffic: "De CSV-mappingtemplate trekt momenteel het meeste productgedreven verkeer.",
        ctaSignupGap:
          "CTA-klikken gebeuren, maar signups blijven achter. Controleer signupcopy, frictie en planfit op de pagina's met de hoogste intentie.",
        noScans:
          "Accounts komen de werkruimte binnen, maar voeren nog geen scans uit. Maak het eerste scanpad in onboarding nog duidelijker.",
        scanExportGap:
          "Scans komen binnen, maar exports niet. De volgende bottleneck is waarschijnlijk kwalificatievertrouwen of duidelijkheid bij CSV-overdracht.",
        topPage:
          "De sterkste pagina is nu __PAGE__. Blijf op die pagina een scherpere CTA en interne links testen.",
        steadyFunnel:
          "De funnel beweegt. Blijf CTA-klikken, signups, scans en exports week op week vergelijken."
      }
    },
    pipelineOwner: "Avery",
    pipelineActorName: "Demo-gebruiker",
    pipelineNotes: "Geef de homepage-CTA-hoek prioriteit voordat je exporteert."
  },
  fr: {
    workspaceName: "dashboard démo LeadCue",
    targetIndustries: ["B2B SaaS", "services locaux", "services professionnels"],
    targetCountries: ["États-Unis", "Royaume-Uni", "Canada", "Australie"],
    offerDescription:
      "Nous aidons les entreprises à convertir davantage de visiteurs du site en rendez-vous grâce à des CTA plus clairs, des sections de preuve et une structure de page orientée conversion.",
    industryLabels: {
      northstar: "B2B SaaS",
      beacon: "Santé locale",
      lumen: "Services B2B"
    },
    demoPages: {
      northstar: {
        title: "Northstar Analytics | Logiciel de reporting pour petites équipes finance",
        metaDescription:
          "Northstar Analytics offre aux équipes finance des rapports plus clairs, des packs board mensuels et une visibilité KPI plus rapide sans remplacer leurs outils.",
        h1: "Northstar Analytics aide les équipes finance rapides à produire des rapports sans nettoyer des tableurs",
        text:
          "Northstar Analytics aide les équipes finance à créer des rapports hebdomadaires, des mises à jour board et une visibilité KPI sans remplacer leur stack actuel. La page d'accueil explique le produit, les intégrations, les tableaux de bord et les workflows finance. Les visiteurs peuvent explorer les pages produit, les tarifs et les actualités d'équipe. Northstar recrute ce trimestre en customer success et revenue operations."
      },
      beacon: {
        title: "Beacon Dental Group | Dentisterie familiale et esthétique",
        metaDescription:
          "Beacon Dental Group aide les familles locales à réserver des soins dentaires préventifs, esthétiques et restaurateurs avec une expérience claire et mobile.",
        h1: "Beacon Dental Group propose une dentisterie familiale et esthétique pour les quartiers actifs",
        text:
          "Beacon Dental Group accompagne les familles locales avec des nettoyages préventifs, du blanchiment, des implants et des urgences. Le site couvre les soins, l'aide à l'assurance, les horaires et les biographies de l'équipe. Les patients peuvent lire les avis, comparer les services et découvrir l'équipe. Beacon recrute cette saison un coordinateur d'accueil et un hygiéniste dentaire."
      },
      lumen: {
        title: "Lumen Logistics | Coordination fret pour équipes rapides",
        metaDescription:
          "Lumen Logistics aide les équipes opérations à coordonner le fret, les mises à jour transporteurs et les exceptions avec une meilleure visibilité sur chaque expédition.",
        h1: "Lumen Logistics donne aux équipes opérations une coordination fret sans chaos de tableurs",
        text:
          "Lumen Logistics soutient les équipes opérations avec visibilité de routage, coordination transporteurs et gestion des exceptions pour chaque expédition. Le site explique la couverture de service, les workflows d'expédition et le reporting opérationnel. Les visiteurs peuvent consulter les régions couvertes, les mises à jour plateforme et les postes d'implémentation et support."
      }
    },
    analytics: {
      eventMetadata: {
        basicScanOneCredit: "scan basique, 1 crédit",
        crmHubSpot: "CSV / HubSpot",
        hubSpotMappingCta: "CTA mapping HubSpot"
      },
      recommendations: {
        toolPageCta:
          "Les clics CTA des pages outil sont sains. Continuez à guider ces utilisateurs vers l'inscription avec le même contexte de modèle de champs.",
        exportsGap:
          "Les exports sont inférieurs aux scans. Le prochain blocage concerne probablement la confiance de qualification ou le timing du transfert CSV.",
        crmTemplateTraffic: "Le modèle de mapping CSV génère actuellement le plus de trafic product-led.",
        ctaSignupGap:
          "Les clics CTA arrivent, mais pas les inscriptions. Revoyez le texte d'inscription, la friction et l'adéquation du plan sur les pages les plus intentionnelles.",
        noScans:
          "Des comptes entrent dans le dashboard mais ne lancent pas encore de scans. Rendez le chemin du premier scan encore plus évident dans l'onboarding.",
        scanExportGap:
          "Les scans arrivent, mais pas les exports. Le prochain blocage concerne probablement la confiance de qualification ou la clarté du transfert CSV.",
        topPage:
          "La page la plus forte en ce moment est __PAGE__. Continuez à tester un CTA plus précis et des liens internes depuis cette page.",
        steadyFunnel:
          "Le funnel avance. Continuez à comparer les clics CTA, inscriptions, scans et exports semaine après semaine."
      }
    },
    pipelineOwner: "Avery",
    pipelineActorName: "Utilisateur démo",
    pipelineNotes: "Priorisez l'angle CTA de la page d'accueil avant l'export."
  }
};

function resolveRuleBasedCopy(locale?: ScanLocale): RuleBasedProspectCopy {
  return locale ? ruleBasedProspectCopy[locale] ?? ruleBasedProspectCopy.en : ruleBasedProspectCopy.en;
}

export function getSampleLocaleContent(locale: ScanLocale = "en"): SampleLocaleContent {
  return sampleLocaleContentByLocale[locale] ?? sampleLocaleContentByLocale.en;
}

function lowerSentenceStart(value: string): string {
  if (!value) {
    return value;
  }

  return `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
}

export function unique<T>(items: T[]): T[] {
  return [...new Set(items.filter(Boolean))];
}

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] ?? url;
  }
}

export function sameDomainLinks(links: string[], baseUrl: string): string[] {
  const domain = extractDomain(baseUrl);
  return unique(
    links
      .map((link) => {
        try {
          return new URL(link, baseUrl).toString();
        } catch {
          return "";
        }
      })
      .filter((link) => link && extractDomain(link) === domain)
  );
}

export function extractEmails(text: string): string[] {
  return unique(text.match(EMAIL_PATTERN) ?? []).slice(0, 8);
}

export function extractPhones(text: string): string[] {
  return unique(text.match(PHONE_PATTERN) ?? []).slice(0, 8);
}

export function classifyContactPoints(page: PageSnapshot): ContactPoints {
  const links = sameDomainLinks(page.links, page.url);
  const socialLinks = unique(
    page.links.filter((link) =>
      /(linkedin\.com|twitter\.com|x\.com|facebook\.com|instagram\.com|youtube\.com)/i.test(link)
    )
  ).slice(0, 8);
  const contactPages = links
    .filter((link) => /(contact|support|book|demo|schedule|consultation)/i.test(link))
    .slice(0, 5);

  return {
    emails: unique([...(page.emails ?? []), ...extractEmails(page.text)]),
    phones: unique([...(page.phones ?? []), ...extractPhones(page.text)]),
    contactPages,
    socialLinks
  };
}

export function discoverRelevantPages(page: PageSnapshot): string[] {
  const links = sameDomainLinks(page.links, page.url);
  const preferred = /(about|contact|pricing|blog|case|customers|careers|services|solutions)/i;
  return links.filter((link) => preferred.test(link)).slice(0, 12);
}

export function inferCompanyName(page: PageSnapshot): string {
  const title = page.title.split(/[|-]/)[0]?.trim();
  const h1 = page.h1?.trim();
  return h1 && h1.length < 60 ? h1 : title || extractDomain(page.url);
}

export function detectOpportunitySignals(
  page: PageSnapshot,
  icp: ICPProfile = DEFAULT_ICP,
  locale: ScanLocale = "en"
): OpportunitySignal[] {
  const copy = resolveRuleBasedCopy(locale);
  const text = normalizeWhitespace(`${page.title} ${page.metaDescription ?? ""} ${page.h1 ?? ""} ${page.text}`);
  const lower = text.toLowerCase();
  const links = page.links.join(" ").toLowerCase();
  const signals: OpportunitySignal[] = [];

  if (!/(book|demo|contact|call|quote|get started|schedule|consultation)/i.test(page.text.slice(0, 2200))) {
    signals.push({
      category: "web_design",
      ...copy.signals.noCta
    });
  }

  if (!page.metaDescription || page.metaDescription.length < 70) {
    signals.push({
      category: "seo",
      ...copy.signals.metaDescriptionThin
    });
  }

  if (!page.h1 || page.h1.length < 8) {
    signals.push({
      category: "seo",
      ...copy.signals.h1Weak
    });
  }

  if (!/(case stud|customer|testimonial|review|proof|results)/i.test(text + links)) {
    signals.push({
      category: "marketing",
      ...copy.signals.noProof
    });
  }

  if (!/(blog|resources|insights)/i.test(links)) {
    signals.push({
      category: "seo",
      ...copy.signals.noBlog
    });
  }

  if (/(hiring|careers|growth|marketing manager|sales manager|demand generation)/i.test(lower + links)) {
    signals.push({
      category: "timing",
      ...copy.signals.growthHiring
    });
  }

  const priority = icp.serviceType;
  return signals
    .sort((a, b) => Number(b.category === priority) - Number(a.category === priority))
    .slice(0, 5);
}

export function buildRuleBasedProspectCard(request: ScanRequest): ProspectCard {
  const icp = { ...DEFAULT_ICP, ...request.icp };
  const page = request.page;
  const copy = resolveRuleBasedCopy(request.locale);
  const domain = extractDomain(page.url);
  const contactPoints = classifyContactPoints(page);
  const signals = detectOpportunitySignals(page, icp, request.locale);
  const companyName = inferCompanyName(page);
  const topSignal = signals[0];
  const firstLine = topSignal?.signal ?? copy.fallbackSignal;
  const normalizedFirstLine = lowerSentenceStart(firstLine);
  const serviceTypeLabel = copy.serviceTypes[icp.serviceType] ?? icp.serviceType.replace("_", " ");

  const fitScore = Math.min(92, Math.max(58, 72 + signals.length * 4));

  return {
    companyName,
    website: page.url,
    domain,
    industry: copy.unknownIndustry,
    summary: copy.summary(companyName),
    fitScore,
    fitReason: copy.fitReason(signals.length, serviceTypeLabel),
    contactPoints,
    opportunitySignals: signals,
    outreachAngles: [
      copy.outreachAngle1(topSignal?.signal ?? copy.fallbackSignal),
      copy.outreachAngle2,
      copy.outreachAngle3
    ],
    firstLines: [
      copy.firstLine1(companyName, normalizedFirstLine),
      copy.firstLine2,
      copy.firstLine3(domain)
    ],
    shortEmail: copy.shortEmail(companyName, normalizedFirstLine),
    sourceNotes: signals.map((signal) => ({
      claim: signal.signal,
      source: signal.source
    })),
    confidenceScore: signals.length >= 3 ? 0.78 : 0.62,
    savedStatus: "saved",
    exportStatus: "not_exported"
  };
}

export function buildSampleProspectCard(locale: ScanLocale = "en"): ProspectCard {
  const sampleContent = getSampleLocaleContent(locale);
  const samplePage = sampleContent.demoPages.northstar;
  const base = buildRuleBasedProspectCard({
    source: "web",
    locale,
    page: {
      url: "https://northstaranalytics.example",
      title: samplePage.title,
      metaDescription: samplePage.metaDescription,
      h1: samplePage.h1,
      text: samplePage.text,
      links: [
        "https://northstaranalytics.example",
        "https://northstaranalytics.example/product",
        "https://northstaranalytics.example/pricing",
        "https://northstaranalytics.example/blog",
        "https://northstaranalytics.example/careers",
        "https://northstaranalytics.example/contact",
        "https://www.linkedin.com/company/northstar-analytics"
      ],
      emails: ["hello@northstaranalytics.example"],
      phones: []
    },
    icp: {
      serviceType: "web_design",
      targetIndustries: sampleContent.targetIndustries,
      targetCountries: sampleContent.targetCountries,
      offerDescription: sampleContent.offerDescription,
      tone: "professional"
    }
  });

  return {
    ...base,
    companyName: "Northstar Analytics",
    website: "https://northstaranalytics.example",
    domain: "northstaranalytics.example",
    industry: sampleContent.industryLabels.northstar,
    contactPoints: {
      emails: ["hello@northstaranalytics.example"],
      phones: [],
      contactPages: ["https://northstaranalytics.example/contact"],
      socialLinks: ["https://www.linkedin.com/company/northstar-analytics"]
    },
    fitScore: 86,
    confidenceScore: 0.82,
    savedStatus: "saved",
    exportStatus: "not_exported"
  };
}

export const SAMPLE_PROSPECT_CARD: ProspectCard = buildSampleProspectCard("en");
