// 为 site-ui.locales.json 添加 app 命名空间（dashboard 国际化）
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = resolve(__dirname, "../apps/web/src/content/generated/site-ui.locales.json");

const data = JSON.parse(readFileSync(jsonPath, "utf-8"));

const appNamespace = {
  en: {
    nav: {
      dashboard: "Dashboard",
      leads: "Leads",
      icp: "ICP",
      credits: "Credits",
      analytics: "Analytics",
      account: "Account"
    },
    pages: {
      dashboard: {
        eyebrow: "dashboard",
        title: "Prospect research dashboard",
        copy: "Run website scans, review Prospect Cards, and keep outbound research connected to credits."
      },
      leads: {
        eyebrow: "Lead library",
        title: "Saved prospects",
        copy: "Review qualified accounts, fit scores, confidence, and the Prospect Card your solo user can export."
      },
      icp: {
        eyebrow: "ICP settings",
        title: "Scoring profile",
        copy: "Tune the solo professional offer, industries, countries, and tone LeadCue uses when ranking websites."
      },
      billing: {
        eyebrow: "Credits and billing",
        title: "Plan usage",
        copy: "Track remaining scan credits, subscription state, and the plan path for your outbound volume."
      },
      analytics: {
        eyebrow: "Analytics",
        title: "Research funnel",
        copy: "See which actions actually move from product interest to saved scans, exports, and CSV handoff."
      },
      account: {
        eyebrow: "Account",
        title: "Profile and access",
        copy: "Manage dashboard identity, password access, and the secure session your solo user uses to enter LeadCue."
      }
    },
    actions: {
      newScan: "New scan",
      exportCsv: "Export CSV",
      manageBilling: "Manage billing",
      signOut: "Sign out",
      signIn: "Continue with Google"
    },
    scan: {
      eyebrow: "Scan desk",
      title: "Turn one website into a saved Prospect Card",
      copy: "Enter a real prospect URL, add what your solo user already noticed, and LeadCue will create fit scoring, evidence, first lines, and export-ready notes in the same dashboard.",
      prospectWebsite: "Prospect website",
      companyName: "Company name",
      websiteNotes: "Website notes",
      deepScan: "Deep scan",
      deepScanHint: "Uses 3 credits for richer context.",
      runScan: "Run scan",
      scanning: "Scanning website...",
      retryScan: "Retry scan",
      noCredit: "No credit was used. Fix the URL and try again.",
      steps: ["Website", "Evidence", "Prospect Card"]
    },
    status: {
      signedIn: "Signed in",
      demoPreview: "Demo preview",
      loading: "Loading dashboard data...",
      plan: "plan"
    },
    userMenu: {
      accountSettings: "Account settings",
      manageBilling: "Manage billing",
      signOut: "Sign out"
    }
  },
  zh: {
    nav: {
      dashboard: "仪表盘",
      leads: "线索库",
      icp: "客户画像",
      credits: "积分",
      analytics: "数据分析",
      account: "账户"
    },
    pages: {
      dashboard: {
        eyebrow: "工作空间",
        title: "潜在客户调研面板",
        copy: "运行网站扫描、查看潜在客户卡片，让外拓研究与积分保持同步。"
      },
      leads: {
        eyebrow: "线索库",
        title: "已保存的潜在客户",
        copy: "查看合格客户、匹配度评分、置信度以及可导出的潜在客户卡片。"
      },
      icp: {
        eyebrow: "ICP 设置",
        title: "评分配置",
        copy: "调整代理商服务、行业、国家和话术风格，以优化 LeadCue 对网站的排名评估。"
      },
      billing: {
        eyebrow: "积分与账单",
        title: "套餐用量",
        copy: "查看剩余扫描积分、订阅状态以及适配你外拓量的套餐路径。"
      },
      analytics: {
        eyebrow: "数据分析",
        title: "研究漏斗",
        copy: "了解哪些操作真正推动了从产品兴趣到保存扫描、导出和 CSV 交接的转化。"
      },
      account: {
        eyebrow: "账户",
        title: "个人资料与权限",
        copy: "管理工作空间身份、密码访问以及个人用户登录 LeadCue 的安全会话。"
      }
    },
    actions: {
      newScan: "新建扫描",
      exportCsv: "导出 CSV",
      manageBilling: "管理订阅",
      signOut: "退出登录",
      signIn: "使用 Google 继续"
    },
    scan: {
      eyebrow: "扫描台",
      title: "将一个网站转化为已保存的潜在客户卡片",
      copy: "输入真实的潜在客户网址，添加你个人用户已注意到的信息，LeadCue 将在同一工作空间中生成匹配度评分、证据、破冰话术和可导出的备注。",
      prospectWebsite: "目标网站",
      companyName: "公司名称",
      websiteNotes: "网站备注",
      deepScan: "深度扫描",
      deepScanHint: "使用 3 个积分获取更丰富的内容。",
      runScan: "开始扫描",
      scanning: "正在扫描网站...",
      retryScan: "重试扫描",
      noCredit: "未使用积分。请修正网址后重试。",
      steps: ["网站", "证据", "潜在客户卡片"]
    },
    status: {
      signedIn: "已登录",
      demoPreview: "演示预览",
      loading: "正在加载工作空间数据...",
      plan: "套餐"
    },
    userMenu: {
      accountSettings: "账户设置",
      manageBilling: "管理订阅",
      signOut: "退出登录"
    }
  },
  ja: {
    nav: {
      dashboard: "ダッシュボード",
      leads: "リード",
      icp: "ICP",
      credits: "クレジット",
      analytics: "分析",
      account: "アカウント"
    },
    pages: {
      dashboard: {
        eyebrow: "ダッシュボード",
        title: "見込み客リサーチダッシュボード",
        copy: "ウェブサイトスキャンの実行、プロスペクトカードの確認、アウトバウンドリサーチとクレジットの連携。"
      },
      leads: {
        eyebrow: "リードライブラリ",
        title: "保存済みプロスペクト",
        copy: "適格なアカウント、フィットスコア、確信度、個人ユーザーがエクスポートできるプロスペクトカードを確認。"
      },
      icp: {
        eyebrow: "ICP設定",
        title: "スコアリングプロファイル",
        copy: "個人プロフェッショナルのオファー、業界、国、トーンを調整し、LeadCueのウェブサイト評価を最適化。"
      },
      billing: {
        eyebrow: "クレジットと請求",
        title: "プラン利用状況",
        copy: "残りのスキャンクレジット、サブスクリプション状態、アウトバウンド量に合ったプランパスを確認。"
      },
      analytics: {
        eyebrow: "分析",
        title: "リサーチファネル",
        copy: "製品関心からスキャン保存、エクスポート、CSV連携への実際の推進力を確認。"
      },
      account: {
        eyebrow: "アカウント",
        title: "プロフィールとアクセス",
        copy: "ダッシュボードID、パスワードアクセス、個人ユーザーがLeadCueにログインするセキュアセッションを管理。"
      }
    },
    actions: {
      newScan: "新規スキャン",
      exportCsv: "CSVエクスポート",
      manageBilling: "請求管理",
      signOut: "ログアウト",
      signIn: "Googleで続ける"
    },
    scan: {
      eyebrow: "スキャンデスク",
      title: "1つのウェブサイトを保存済みプロスペクトカードに変換",
      copy: "実際の見込み客URLを入力し、個人ユーザーが気付いた点を追加すると、LeadCueが同じダッシュボードでフィットスコア、エビデンス、ファーストライン、エクスポート対応ノートを作成します。",
      prospectWebsite: "見込み客ウェブサイト",
      companyName: "会社名",
      websiteNotes: "ウェブサイトメモ",
      deepScan: "ディープスキャン",
      deepScanHint: "より豊富なコンテキストに3クレジットを使用。",
      runScan: "スキャン実行",
      scanning: "ウェブサイトをスキャン中...",
      retryScan: "スキャン再試行",
      noCredit: "クレジットは使用されませんでした。URLを修正して再試行してください。",
      steps: ["ウェブサイト", "エビデンス", "プロスペクトカード"]
    },
    status: {
      signedIn: "ログイン済み",
      demoPreview: "デモプレビュー",
      loading: "ダッシュボードデータを読み込み中...",
      plan: "プラン"
    },
    userMenu: {
      accountSettings: "アカウント設定",
      manageBilling: "請求管理",
      signOut: "ログアウト"
    }
  },
  ko: {
    nav: {
      dashboard: "대시보드",
      leads: "리드",
      icp: "ICP",
      credits: "크레딧",
      analytics: "분석",
      account: "계정"
    },
    pages: {
      dashboard: {
        eyebrow: "대시보드",
        title: "잠재 고객 리서치 대시보드",
        copy: "웹사이트 스캔 실행, 잠재 고객 카드 검토, 아웃바운드 리서치와 크레딧 연동."
      },
      leads: {
        eyebrow: "리드 라이브러리",
        title: "저장된 잠재 고객",
        copy: "적격 계정, 적합도 점수, 신뢰도 및 개인 사용자이 내보낼 수 있는 잠재 고객 카드를 검토하세요."
      },
      icp: {
        eyebrow: "ICP 설정",
        title: "스코어링 프로필",
        copy: "개인 전문가 오퍼, 산업, 국가 및 톤을 조정하여 LeadCue의 웹사이트 순위 평가를 최적화하세요."
      },
      billing: {
        eyebrow: "크레딧 및 결제",
        title: "플랜 사용량",
        copy: "남은 스캔 크레딧, 구독 상태 및 아웃바운드 볼륨에 맞는 플랜 경로를 확인하세요."
      },
      analytics: {
        eyebrow: "분석",
        title: "리서치 퍼널",
        copy: "제품 관심에서 저장된 스캔, 내보내기 및 CSV 핸드오프로의 실제 전환을 확인하세요."
      },
      account: {
        eyebrow: "계정",
        title: "프로필 및 액세스",
        copy: "대시보드 ID, 비밀번호 액세스 및 개인 사용자이 LeadCue에 접속하는 보안 세션을 관리하세요."
      }
    },
    actions: {
      newScan: "새 스캔",
      exportCsv: "CSV 내보내기",
      manageBilling: "결제 관리",
      signOut: "로그아웃",
      signIn: "Google로 계속"
    },
    scan: {
      eyebrow: "스캔 데스크",
      title: "하나의 웹사이트를 저장된 잠재 고객 카드로 변환",
      copy: "실제 잠재 고객 URL을 입력하고 개인 사용자이 이미 발견한 내용을 추가하면, LeadCue가 동일 대시보드에서 적합도 점수, 증거, 첫 번째 라인 및 내보내기용 노트를 생성합니다.",
      prospectWebsite: "잠재 고객 웹사이트",
      companyName: "회사명",
      websiteNotes: "웹사이트 메모",
      deepScan: "딥 스캔",
      deepScanHint: "더 풍부한 컨텍스트를 위해 3크레딧을 사용합니다.",
      runScan: "스캔 실행",
      scanning: "웹사이트 스캔 중...",
      retryScan: "스캔 재시도",
      noCredit: "크레딧이 사용되지 않았습니다. URL을 수정한 후 다시 시도하세요.",
      steps: ["웹사이트", "증거", "잠재 고객 카드"]
    },
    status: {
      signedIn: "로그인됨",
      demoPreview: "데모 미리보기",
      loading: "대시보드 데이터 로드 중...",
      plan: "플랜"
    },
    userMenu: {
      accountSettings: "계정 설정",
      manageBilling: "결제 관리",
      signOut: "로그아웃"
    }
  },
  de: {
    nav: {
      dashboard: "Dashboard",
      leads: "Leads",
      icp: "ICP",
      credits: "Credits",
      analytics: "Analysen",
      account: "Konto"
    },
    pages: {
      dashboard: {
        eyebrow: "Arbeitsbereich",
        title: "Prospect-Research-Dashboard",
        copy: "Website-Scans durchführen, Prospect Cards prüfen und Outbound-Research mit Credits verknüpfen."
      },
      leads: {
        eyebrow: "Lead-Bibliothek",
        title: "Gespeicherte Prospects",
        copy: "Qualifizierte Accounts, Fit-Scores, Konfidenz und exportierbare Prospect Cards prüfen."
      },
      icp: {
        eyebrow: "ICP-Einstellungen",
        title: "Scoring-Profil",
        copy: "Solo-Profi-Angebot, Branchen, Länder und Tonfall anpassen, um LeadCues Website-Ranking zu optimieren."
      },
      billing: {
        eyebrow: "Credits und Abrechnung",
        title: "Plan-Nutzung",
        copy: "Verbleibende Scan-Credits, Abonnementstatus und den Plan-Pfad für Ihr Outbound-Volumen verfolgen."
      },
      analytics: {
        eyebrow: "Analysen",
        title: "Research-Funnel",
        copy: "Sehen Sie, welche Aktionen tatsächlich von Produktinteresse zu gespeicherten Scans, Exporten und CSV-Übergabe führen."
      },
      account: {
        eyebrow: "Konto",
        title: "Profil und Zugang",
        copy: "dashboard-Identität, Passwortzugang und die sichere Sitzung Ihres solo users für LeadCue verwalten."
      }
    },
    actions: {
      newScan: "Neuer Scan",
      exportCsv: "CSV exportieren",
      manageBilling: "Abrechnung verwalten",
      signOut: "Abmelden",
      signIn: "Mit Google fortfahren"
    },
    scan: {
      eyebrow: "Scan-Desk",
      title: "Eine Website in eine gespeicherte Prospect Card verwandeln",
      copy: "Geben Sie eine echte Prospect-URL ein, ergänzen Sie, was Ihr solo user bereits bemerkt hat, und LeadCue erstellt im selben dashboard Fit-Scoring, Evidenz, erste Zeilen und exportfertige Notizen.",
      prospectWebsite: "Prospect-Website",
      companyName: "Firmenname",
      websiteNotes: "Website-Notizen",
      deepScan: "Deep Scan",
      deepScanHint: "Verwendet 3 Credits für reichhaltigeren Kontext.",
      runScan: "Scan starten",
      scanning: "Website wird gescannt...",
      retryScan: "Scan wiederholen",
      noCredit: "Es wurde kein Credit verbraucht. Korrigieren Sie die URL und versuchen Sie es erneut.",
      steps: ["Website", "Evidenz", "Prospect Card"]
    },
    status: {
      signedIn: "Angemeldet",
      demoPreview: "Demo-Vorschau",
      loading: "dashboard-Daten werden geladen...",
      plan: "Plan"
    },
    userMenu: {
      accountSettings: "Kontoeinstellungen",
      manageBilling: "Abrechnung verwalten",
      signOut: "Abmelden"
    }
  },
  nl: {
    nav: {
      dashboard: "Dashboard",
      leads: "Leads",
      icp: "ICP",
      credits: "Credits",
      analytics: "Analyse",
      account: "Account"
    },
    pages: {
      dashboard: {
        eyebrow: "Werkruimte",
        title: "Prospect-onderzoekdashboard",
        copy: "Website-scans uitvoeren, Prospect Cards beoordelen en outbound-onderzoek aan credits koppelen."
      },
      leads: {
        eyebrow: "Leadbibliotheek",
        title: "Opgeslagen prospects",
        copy: "Gekwalificeerde accounts, fit-scores, betrouwbaarheid en exporteerbare Prospect Cards bekijken."
      },
      icp: {
        eyebrow: "ICP-instellingen",
        title: "Scoringsprofiel",
        copy: "solo professional-aanbod, sectoren, landen en toon afstemmen om de website-ranking van LeadCue te optimaliseren."
      },
      billing: {
        eyebrow: "Credits en facturering",
        title: "Plangebruik",
        copy: "Resterende scankredieten, abonnementsstatus en het planpad voor uw outbound-volume volgen."
      },
      analytics: {
        eyebrow: "Analyse",
        title: "Onderzoekstrechter",
        copy: "Bekijk welke acties daadwerkelijk leiden van productinteresse naar opgeslagen scans, exports en CSV-overdracht."
      },
      account: {
        eyebrow: "Account",
        title: "Profiel en toegang",
        copy: "Werkruimte-identiteit, wachtwoordtoegang en de beveiligde sessie van uw solo user voor LeadCue beheren."
      }
    },
    actions: {
      newScan: "Nieuwe scan",
      exportCsv: "CSV exporteren",
      manageBilling: "Facturering beheren",
      signOut: "Uitloggen",
      signIn: "Doorgaan met Google"
    },
    scan: {
      eyebrow: "Scanzelfstandige",
      title: "Eén website omzetten in een opgeslagen Prospect Card",
      copy: "Voer een echte prospect-URL in, voeg toe wat uw solo user al heeft opgemerkt, en LeadCue maakt fit-scoring, bewijs, eerste regels en exportklare notities in dezelfde werkruimte.",
      prospectWebsite: "Prospect-website",
      companyName: "Bedrijfsnaam",
      websiteNotes: "Websitenotities",
      deepScan: "Diepe scan",
      deepScanHint: "Gebruikt 3 credits voor rijkere context.",
      runScan: "Scan starten",
      scanning: "Website wordt gescand...",
      retryScan: "Scan opnieuw proberen",
      noCredit: "Er is geen credit gebruikt. Corrigeer de URL en probeer het opnieuw.",
      steps: ["Website", "Bewijs", "Prospect Card"]
    },
    status: {
      signedIn: "Ingelogd",
      demoPreview: "Demo-voorbeeld",
      loading: "Werkruimtegegevens laden...",
      plan: "plan"
    },
    userMenu: {
      accountSettings: "Accountinstellingen",
      manageBilling: "Facturering beheren",
      signOut: "Uitloggen"
    }
  },
  fr: {
    nav: {
      dashboard: "Tableau de bord",
      leads: "Leads",
      icp: "ICP",
      credits: "Crédits",
      analytics: "Analyse",
      account: "Compte"
    },
    pages: {
      dashboard: {
        eyebrow: "Espace de travail",
        title: "Tableau de bord de recherche prospect",
        copy: "Exécutez des scans de sites, examinez les fiches prospect et reliez la recherche outbound aux crédits."
      },
      leads: {
        eyebrow: "Bibliothèque de leads",
        title: "Prospects enregistrés",
        copy: "Examinez les comptes qualifiés, les scores d'adéquation, la confiance et les fiches exportables."
      },
      icp: {
        eyebrow: "Paramètres ICP",
        title: "Profil de scoring",
        copy: "Ajustez l'offre indépendant, les secteurs, les pays et le ton utilisés par LeadCue pour évaluer les sites."
      },
      billing: {
        eyebrow: "Crédits et facturation",
        title: "Utilisation du plan",
        copy: "Suivez les crédits de scan restants, l'état de l'abonnement et le parcours adapté à votre volume outbound."
      },
      analytics: {
        eyebrow: "Analyse",
        title: "Entonnoir de recherche",
        copy: "Identifiez les actions qui convertissent de l'intérêt produit en scans enregistrés, exports et transfert CSV."
      },
      account: {
        eyebrow: "Compte",
        title: "Profil et accès",
        copy: "Gérez l'identité de l'espace de travail, l'accès par mot de passe et la session sécurisée de votre équipe."
      }
    },
    actions: {
      newScan: "Nouveau scan",
      exportCsv: "Exporter CSV",
      manageBilling: "Gérer la facturation",
      signOut: "Déconnexion",
      signIn: "Continuer avec Google"
    },
    scan: {
      eyebrow: "Bureau de scan",
      title: "Transformer un site web en fiche prospect enregistrée",
      copy: "Saisissez l'URL d'un vrai prospect, ajoutez ce que votre équipe a déjà remarqué, et LeadCue créera le scoring, les preuves, les accroches et les notes exportables dans le même espace.",
      prospectWebsite: "Site prospect",
      companyName: "Nom de l'entreprise",
      websiteNotes: "Notes sur le site",
      deepScan: "Scan approfondi",
      deepScanHint: "Utilise 3 crédits pour un contexte plus riche.",
      runScan: "Lancer le scan",
      scanning: "Scan du site en cours...",
      retryScan: "Relancer le scan",
      noCredit: "Aucun crédit n'a été utilisé. Corrigez l'URL et réessayez.",
      steps: ["Site web", "Preuves", "Fiche prospect"]
    },
    status: {
      signedIn: "Connecté",
      demoPreview: "Aperçu démo",
      loading: "Chargement des données de l'espace de travail...",
      plan: "plan"
    },
    userMenu: {
      accountSettings: "Paramètres du compte",
      manageBilling: "Gérer la facturation",
      signOut: "Déconnexion"
    }
  }
};

// 将 app 命名空间添加到每个 locale
for (const [locale, appData] of Object.entries(appNamespace)) {
  if (data[locale]) {
    data[locale].app = appData;
  }
}

writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf-8");
console.log("✅ app 命名空间已添加到 site-ui.locales.json（7 种语言）");
