import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const extensionDir = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(extensionDir, "..", "..");
const locales = ["en", "zh", "ja", "ko", "de", "nl", "fr"];
const chromeLocaleCodes = {
  en: "en",
  zh: "zh_CN",
  ja: "ja",
  ko: "ko",
  de: "de",
  nl: "nl",
  fr: "fr"
};

const appUi = JSON.parse(
  await fs.readFile(path.join(repoRoot, "apps/web/src/content/generated/app-ui.locales.json"), "utf8")
);
const siteUi = JSON.parse(
  await fs.readFile(path.join(repoRoot, "apps/web/src/content/generated/site-ui.locales.json"), "utf8")
);
const appExtraSource = await fs.readFile(path.join(repoRoot, "apps/web/src/appExtraContent.ts"), "utf8");
const compiledExtra = ts.transpileModule(appExtraSource, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020
  }
}).outputText;
const extraModule = { exports: {} };
vm.runInNewContext(compiledExtra, {
  module: extraModule,
  exports: extraModule.exports,
  require,
  console
});
const appExtra = extraModule.exports.appUiExtraByLocale;

const manualByLocale = {
  en: {
    meta: {
      manifestName: "LeadCue - AI Website Prospecting Assistant",
      manifestDescription:
        "Analyze the active company website, qualify the account, and save a source-backed Prospect Card to your LeadCue workspace.",
      actionTitle: "Open LeadCue side panel",
      tagline: "Website prospecting for real workspaces"
    },
    aria: {
      refreshSession: "Refresh workspace access",
      toggleSettings: "Toggle settings"
    },
    badges: {
      checking: "Checking",
      unavailable: "Unavailable",
      signIn: "Sign in",
      signedIn: "Signed in",
      billing: "Billing"
    },
    labels: {
      workspaceAccess: "Workspace access",
      setupNeeded: "Setup needed",
      connectedWorkspace: "Connected workspace",
      workspace: "Workspace",
      owner: "Owner",
      plan: "Plan",
      creditsLeft: "Credits left",
      advancedSettings: "Advanced settings",
      apiBaseUrl: "API base URL",
      dashboardUrl: "Dashboard URL",
      activeWebsite: "Active website",
      bestEmail: "Best email",
      noEmailFound: "No email found",
      salesCues: "Sales cues",
      homepage: "Homepage",
      unknown: "Unknown",
      readyToScan: "Ready to scan",
      workspaceFallback: "LeadCue workspace",
      signedInWorkspace: "Signed-in workspace",
      planUnknown: "Unknown",
      companyFallback: "Prospect ready",
      language: "Language"
    },
    buttons: {
      manageBilling: "Manage billing",
      signOut: "Sign out",
      saveSettings: "Save settings",
      useDefaults: "Use defaults",
      analyzeWebsite: "Analyze website",
      refreshPage: "Refresh page",
      openSavedLead: "Open saved lead",
      updateBilling: "Update billing",
      checkingAccess: "Checking access",
      signInToScan: "Sign in to scan",
      openPublicSite: "Open a public site",
      notEnoughCredits: "Not enough credits"
    },
    session: {
      checkingTitle: "Checking LeadCue access...",
      checkingCopy: "We are verifying whether this browser already has a LeadCue workspace session.",
      unavailableTitle: "LeadCue API is not ready for extension sign-in.",
      unavailableDatabaseCopy:
        "This environment cannot issue workspace sessions yet. Finish the API and database setup, then refresh access.",
      unavailableApiCopy:
        "LeadCue could not reach the configured API. Open settings and confirm the production API and dashboard URLs.",
      signInTitle: "Sign in to your LeadCue workspace.",
      signInCopy:
        "Use the LeadCue web app once in this browser. After that, the extension can scan websites with your real plan and credits.",
      billingTitle: "Billing needs attention before more scans."
    },
    notes: {
      permission: 'LeadCue only reads the active website after you click "Analyze website".',
      initialSignIn: "Sign in to a real LeadCue workspace before scanning from Chrome.",
      loading: "LeadCue is running a __MODE__ scan on the active website.",
      checking: "Checking workspace access before enabling scans.",
      apiUnavailable: "LeadCue API is not reachable. Open settings and confirm the production API URL.",
      signIn: "Sign in on the web once, then return here and refresh workspace access.",
      subscriptionInactive: "Your subscription status is __STATUS__. Open billing before scanning again.",
      openPublicSite: "Open a public company website with an http(s) address before scanning."
    },
    status: {
      initializing: "Checking LeadCue workspace access.",
      initFailed: "LeadCue could not initialize. Open settings and verify the API and dashboard URLs.",
      settingsSaved: "LeadCue settings saved. Refreshing workspace access...",
      settingsReset: "LeadCue settings reset to defaults.",
      connected: "Connected to __WORKSPACE__.",
      apiNotReady: "LeadCue API is not ready for extension sign-in on this environment.",
      signInReturn: "Sign in on the web, then return here to scan with your real workspace.",
      apiUnreachable: "LeadCue API is not reachable. Open settings and confirm the production API URL.",
      activeTabRefreshed: "Active tab refreshed.",
      openSiteBeforeScan: "Open a public company website before scanning.",
      signInBeforeScan: "Sign in to LeadCue before scanning from the Chrome extension.",
      billingNeedsAttention: "Billing needs attention before scanning again. Current status: __STATUS__.",
      insufficientCredits: "This __MODE__ scan needs __CREDITS__. Remaining: __REMAINING__.",
      analyzeFailed: "LeadCue could not analyze this page.",
      signedOut: "Signed out of LeadCue for this browser.",
      signOutFailed: "LeadCue could not sign out right now.",
      noFirstLine: "There is no first line available to copy from this Prospect Card.",
      firstLineCopied: "Best first line copied.",
      noPublicEmail: "No public email was found on the scanned website.",
      emailCopied: "Primary email copied.",
      scanBeforeOpenLead: "Scan a website first so LeadCue can save the lead.",
      finishSignIn: "Finish signing in on the web, then return here and refresh workspace access.",
      finishSignup: "Complete your LeadCue signup in the web tab, then return here to start scanning.",
      clipboardFailed: "LeadCue could not copy that value from the browser.",
      workspaceUnavailable: "Workspace access needs to be refreshed before scanning again."
    },
    result: {
      summaryFallback: "LeadCue generated a Prospect Card for this company website.",
      firstLineFallback: "No outreach opener was generated for this scan.",
      noSignals: "LeadCue did not find strong public website cues on this scan.",
      signalTitleFallback: "Website signal",
      signalReasonFallback: "LeadCue found a visible website cue worth reviewing."
    },
    scanModes: {
      basic: "basic"
    },
    formats: {
      workspaceReady: "__WORKSPACE__ is ready to scan.",
      workspaceReadyCopy: "__EMAIL__ can scan real websites and save qualified leads directly into this workspace.",
      billingCopy: "Current subscription status: __STATUS__. Open billing to reactivate scans or upgrade your plan.",
      creditsCharging: "__CREDITS__ will be charged when this __MODE__ scan completes.",
      scanSaved: "__COMPANY__ was saved to __WORKSPACE__.",
      apiResponse: "LeadCue API returned __STATUS__.",
      creditOne: "__COUNT__ credit",
      creditOther: "__COUNT__ credits"
    }
  },
  zh: {
    meta: {
      manifestName: "LeadCue - AI 网站潜在客户勘探助手",
      manifestDescription: "分析当前公司网站，完成账户判断，并将带来源依据的潜在客户卡片保存到你的 LeadCue 工作空间。",
      actionTitle: "打开 LeadCue 侧边栏",
      tagline: "面向真实工作空间的网站勘探"
    },
    aria: {
      refreshSession: "刷新工作空间访问状态",
      toggleSettings: "切换设置"
    },
    badges: {
      checking: "检查中",
      unavailable: "不可用",
      signIn: "登录",
      signedIn: "已登录",
      billing: "账单"
    },
    labels: {
      workspaceAccess: "工作空间访问",
      setupNeeded: "需要设置",
      connectedWorkspace: "已连接工作空间",
      workspace: "工作空间",
      owner: "所有者",
      plan: "套餐",
      creditsLeft: "剩余积分",
      advancedSettings: "高级设置",
      apiBaseUrl: "API 基础 URL",
      dashboardUrl: "仪表盘 URL",
      activeWebsite: "当前网站",
      bestEmail: "最佳邮箱",
      noEmailFound: "未找到邮箱",
      salesCues: "销售信号",
      homepage: "首页",
      unknown: "未知",
      readyToScan: "准备扫描",
      workspaceFallback: "LeadCue 工作空间",
      signedInWorkspace: "已登录工作空间",
      planUnknown: "未知",
      companyFallback: "潜在客户已就绪",
      language: "语言"
    },
    buttons: {
      manageBilling: "管理账单",
      signOut: "退出登录",
      saveSettings: "保存设置",
      useDefaults: "使用默认值",
      analyzeWebsite: "分析网站",
      refreshPage: "刷新页面",
      openSavedLead: "打开已保存线索",
      updateBilling: "更新账单",
      checkingAccess: "检查访问中",
      signInToScan: "登录后扫描",
      openPublicSite: "打开公开网站",
      notEnoughCredits: "积分不足"
    },
    session: {
      checkingTitle: "正在检查 LeadCue 访问状态...",
      checkingCopy: "我们正在确认此浏览器是否已有 LeadCue 工作空间会话。",
      unavailableTitle: "当前环境暂未就绪，无法供扩展登录 LeadCue。",
      unavailableDatabaseCopy: "此环境还不能签发工作空间会话。请先完成 API 和数据库设置，然后再刷新访问状态。",
      unavailableApiCopy: "LeadCue 无法连接到当前配置的 API。请打开设置并确认生产环境 API 与仪表盘 URL。",
      signInTitle: "登录你的 LeadCue 工作空间。",
      signInCopy: "在此浏览器中先打开一次 LeadCue 网页端。之后扩展就能使用你的真实套餐和积分扫描网站。",
      billingTitle: "在继续扫描之前需要处理账单。"
    },
    notes: {
      permission: "LeadCue 只会在你点击“分析网站”后读取当前网站。",
      initialSignIn: "请先登录真实的 LeadCue 工作空间，再从 Chrome 发起扫描。",
      loading: "LeadCue 正在以 __MODE__ 模式扫描当前网站。",
      checking: "检查工作空间访问状态后才会启用扫描。",
      apiUnavailable: "LeadCue API 当前不可达。请打开设置并确认生产环境 API URL。",
      signIn: "请先在网页端登录一次，然后回到这里刷新工作空间访问状态。",
      subscriptionInactive: "你的订阅状态为 __STATUS__。请先打开账单页，再继续扫描。",
      openPublicSite: "请先打开一个带有 http(s) 地址的公开公司网站再扫描。"
    },
    status: {
      initializing: "正在检查 LeadCue 工作空间访问状态。",
      initFailed: "LeadCue 初始化失败。请打开设置并检查 API 与仪表盘 URL。",
      settingsSaved: "LeadCue 设置已保存，正在刷新工作空间访问状态...",
      settingsReset: "LeadCue 设置已重置为默认值。",
      connected: "已连接到 __WORKSPACE__。",
      apiNotReady: "当前环境的 LeadCue API 还不能供扩展登录。",
      signInReturn: "请先在网页端登录，然后回到这里使用真实工作空间扫描。",
      apiUnreachable: "LeadCue API 当前不可达。请打开设置并确认生产环境 API URL。",
      activeTabRefreshed: "当前标签页已刷新。",
      openSiteBeforeScan: "请先打开一个公开的公司网站再扫描。",
      signInBeforeScan: "请先登录 LeadCue，再从 Chrome 扩展发起扫描。",
      billingNeedsAttention: "继续扫描前需要处理账单。当前状态：__STATUS__。",
      insufficientCredits: "此次 __MODE__ 扫描需要 __CREDITS__。剩余：__REMAINING__。",
      analyzeFailed: "LeadCue 无法分析此页面。",
      signedOut: "已在此浏览器中退出 LeadCue。",
      signOutFailed: "LeadCue 当前无法退出登录。",
      noFirstLine: "这张 Prospect Card 里没有可复制的破冰话术。",
      firstLineCopied: "最佳破冰话术已复制。",
      noPublicEmail: "扫描的网站上没有找到公开邮箱。",
      emailCopied: "主要邮箱已复制。",
      scanBeforeOpenLead: "请先扫描网站，让 LeadCue 保存这条线索。",
      finishSignIn: "请先在网页端完成登录，然后回到这里刷新工作空间访问状态。",
      finishSignup: "请在网页标签页完成 LeadCue 注册，然后回到这里开始扫描。",
      clipboardFailed: "LeadCue 无法从浏览器复制这段内容。",
      workspaceUnavailable: "再次扫描前需要先刷新工作空间访问状态。"
    },
    result: {
      summaryFallback: "LeadCue 已为这个公司网站生成 Prospect Card。",
      firstLineFallback: "本次扫描没有生成可用的外联开场语。",
      noSignals: "本次扫描没有发现足够强的公开网站信号。",
      signalTitleFallback: "网站信号",
      signalReasonFallback: "LeadCue 发现了一个值得复核的可见网站信号。"
    },
    scanModes: {
      basic: "基础"
    },
    formats: {
      workspaceReady: "__WORKSPACE__ 已可开始扫描。",
      workspaceReadyCopy: "__EMAIL__ 可以扫描真实网站，并将合格线索直接保存到这个工作空间。",
      billingCopy: "当前订阅状态：__STATUS__。请打开账单以重新启用扫描或升级套餐。",
      creditsCharging: "本次 __MODE__ 扫描完成后将扣除 __CREDITS__。",
      scanSaved: "__COMPANY__ 已保存到 __WORKSPACE__。",
      apiResponse: "LeadCue API 返回了 __STATUS__。",
      creditOne: "__COUNT__ 个积分",
      creditOther: "__COUNT__ 个积分"
    }
  },
  ja: {
    meta: {
      manifestName: "LeadCue - AI Website Prospecting Assistant",
      manifestDescription:
        "現在開いている企業サイトを分析し、アカウントを見極め、根拠付きの Prospect Card を LeadCue ワークスペースに保存します。",
      actionTitle: "LeadCue サイドパネルを開く",
      tagline: "実運用ワークスペース向けのサイト見込み客発掘"
    },
    aria: {
      refreshSession: "ワークスペースアクセスを更新",
      toggleSettings: "設定を切り替え"
    },
    badges: {
      checking: "確認中",
      unavailable: "利用不可",
      signIn: "ログイン",
      signedIn: "ログイン済み",
      billing: "請求"
    },
    labels: {
      workspaceAccess: "ワークスペースアクセス",
      setupNeeded: "設定が必要",
      connectedWorkspace: "接続中のワークスペース",
      workspace: "ワークスペース",
      owner: "所有者",
      plan: "プラン",
      creditsLeft: "残りクレジット",
      advancedSettings: "詳細設定",
      apiBaseUrl: "API ベース URL",
      dashboardUrl: "ダッシュボード URL",
      activeWebsite: "現在のサイト",
      bestEmail: "最適なメール",
      noEmailFound: "メール未検出",
      salesCues: "営業シグナル",
      homepage: "ホームページ",
      unknown: "不明",
      readyToScan: "スキャン準備完了",
      workspaceFallback: "LeadCue ワークスペース",
      signedInWorkspace: "ログイン中のワークスペース",
      planUnknown: "不明",
      companyFallback: "プロスペクト準備完了",
      language: "言語"
    },
    buttons: {
      manageBilling: "請求を管理",
      signOut: "ログアウト",
      saveSettings: "設定を保存",
      useDefaults: "デフォルトを使用",
      analyzeWebsite: "サイトを分析",
      refreshPage: "ページを更新",
      openSavedLead: "保存済みリードを開く",
      updateBilling: "請求を更新",
      checkingAccess: "アクセス確認中",
      signInToScan: "ログインしてスキャン",
      openPublicSite: "公開サイトを開く",
      notEnoughCredits: "クレジット不足"
    },
    session: {
      checkingTitle: "LeadCue へのアクセスを確認中...",
      checkingCopy: "このブラウザに LeadCue ワークスペースのセッションがあるか確認しています。",
      unavailableTitle: "LeadCue API は拡張機能のログインにまだ対応していません。",
      unavailableDatabaseCopy:
        "この環境ではまだワークスペースセッションを発行できません。API とデータベースの設定を完了してから、アクセスを再読み込みしてください。",
      unavailableApiCopy:
        "LeadCue が設定済み API に接続できませんでした。設定を開き、本番 API とダッシュボード URL を確認してください。",
      signInTitle: "LeadCue ワークスペースにログインしてください。",
      signInCopy:
        "このブラウザで一度 LeadCue のウェブアプリを開いてログインしてください。以後、拡張機能は実際のプランとクレジットでサイトをスキャンできます。",
      billingTitle: "これ以上スキャンする前に請求の確認が必要です。"
    },
    notes: {
      permission: "LeadCue は「サイトを分析」をクリックした後にのみ現在のサイトを読み取ります。",
      initialSignIn: "Chrome からスキャンする前に、実際の LeadCue ワークスペースにログインしてください。",
      loading: "LeadCue は現在のサイトを __MODE__ モードでスキャンしています。",
      checking: "スキャンを有効にする前にワークスペースアクセスを確認しています。",
      apiUnavailable: "LeadCue API に接続できません。設定を開き、本番 API URL を確認してください。",
      signIn: "ウェブで一度ログインしてから、ここに戻ってワークスペースアクセスを更新してください。",
      subscriptionInactive: "現在のサブスクリプション状態は __STATUS__ です。再度スキャンする前に請求を開いてください。",
      openPublicSite: "スキャンする前に、http(s) アドレスの公開企業サイトを開いてください。"
    },
    status: {
      initializing: "LeadCue ワークスペースアクセスを確認しています。",
      initFailed: "LeadCue を初期化できませんでした。設定を開き、API とダッシュボード URL を確認してください。",
      settingsSaved: "LeadCue の設定を保存しました。ワークスペースアクセスを更新しています...",
      settingsReset: "LeadCue の設定をデフォルトに戻しました。",
      connected: "__WORKSPACE__ に接続しました。",
      apiNotReady: "この環境の LeadCue API は、拡張機能ログインにまだ対応していません。",
      signInReturn: "ウェブでログインしてから、ここに戻って実際のワークスペースでスキャンしてください。",
      apiUnreachable: "LeadCue API に接続できません。設定を開き、本番 API URL を確認してください。",
      activeTabRefreshed: "現在のタブを更新しました。",
      openSiteBeforeScan: "スキャンする前に公開企業サイトを開いてください。",
      signInBeforeScan: "Chrome 拡張機能からスキャンする前に LeadCue にログインしてください。",
      billingNeedsAttention: "再度スキャンする前に請求の確認が必要です。現在の状態: __STATUS__。",
      insufficientCredits: "この __MODE__ スキャンには __CREDITS__ が必要です。残り: __REMAINING__。",
      analyzeFailed: "LeadCue はこのページを分析できませんでした。",
      signedOut: "このブラウザの LeadCue からログアウトしました。",
      signOutFailed: "現在 LeadCue からログアウトできません。",
      noFirstLine: "この Prospect Card にはコピーできるファーストラインがありません。",
      firstLineCopied: "最適なファーストラインをコピーしました。",
      noPublicEmail: "スキャンしたサイトで公開メールアドレスは見つかりませんでした。",
      emailCopied: "メインメールアドレスをコピーしました。",
      scanBeforeOpenLead: "LeadCue がリードを保存できるよう、先にサイトをスキャンしてください。",
      finishSignIn: "ウェブでログインを完了し、ここに戻ってワークスペースアクセスを更新してください。",
      finishSignup: "ウェブタブで LeadCue の登録を完了し、ここに戻ってスキャンを開始してください。",
      clipboardFailed: "ブラウザからその値をコピーできませんでした。",
      workspaceUnavailable: "再度スキャンする前にワークスペースアクセスを更新してください。"
    },
    result: {
      summaryFallback: "LeadCue がこの企業サイトの Prospect Card を生成しました。",
      firstLineFallback: "このスキャンではアウトリーチの書き出し文が生成されませんでした。",
      noSignals: "このスキャンでは強い公開サイトシグナルは見つかりませんでした。",
      signalTitleFallback: "サイトシグナル",
      signalReasonFallback: "LeadCue が確認する価値のある公開サイトシグナルを見つけました。"
    },
    scanModes: {
      basic: "基本"
    },
    formats: {
      workspaceReady: "__WORKSPACE__ はスキャン準備完了です。",
      workspaceReadyCopy: "__EMAIL__ は実際のサイトをスキャンし、適格なリードをこのワークスペースに直接保存できます。",
      billingCopy: "現在のサブスクリプション状態: __STATUS__。スキャンを再開するかプランをアップグレードするには請求を開いてください。",
      creditsCharging: "この __MODE__ スキャンが完了すると __CREDITS__ が請求されます。",
      scanSaved: "__COMPANY__ を __WORKSPACE__ に保存しました。",
      apiResponse: "LeadCue API が __STATUS__ を返しました。",
      creditOne: "__COUNT__ クレジット",
      creditOther: "__COUNT__ クレジット"
    }
  },
  ko: {
    meta: {
      manifestName: "LeadCue - AI Website Prospecting Assistant",
      manifestDescription:
        "현재 보고 있는 회사 웹사이트를 분석하고 계정을 판별한 뒤, 근거가 포함된 Prospect Card를 LeadCue 워크스페이스에 저장합니다.",
      actionTitle: "LeadCue 사이드 패널 열기",
      tagline: "실사용 워크스페이스를 위한 웹사이트 잠재 고객 탐색"
    },
    aria: {
      refreshSession: "워크스페이스 접근 새로고침",
      toggleSettings: "설정 전환"
    },
    badges: {
      checking: "확인 중",
      unavailable: "사용 불가",
      signIn: "로그인",
      signedIn: "로그인됨",
      billing: "결제"
    },
    labels: {
      workspaceAccess: "워크스페이스 접근",
      setupNeeded: "설정 필요",
      connectedWorkspace: "연결된 워크스페이스",
      workspace: "워크스페이스",
      owner: "소유자",
      plan: "요금제",
      creditsLeft: "남은 크레딧",
      advancedSettings: "고급 설정",
      apiBaseUrl: "API 기본 URL",
      dashboardUrl: "대시보드 URL",
      activeWebsite: "현재 웹사이트",
      bestEmail: "최적 이메일",
      noEmailFound: "이메일 없음",
      salesCues: "영업 신호",
      homepage: "홈페이지",
      unknown: "알 수 없음",
      readyToScan: "스캔 준비 완료",
      workspaceFallback: "LeadCue 워크스페이스",
      signedInWorkspace: "로그인된 워크스페이스",
      planUnknown: "알 수 없음",
      companyFallback: "잠재 고객 준비 완료",
      language: "언어"
    },
    buttons: {
      manageBilling: "결제 관리",
      signOut: "로그아웃",
      saveSettings: "설정 저장",
      useDefaults: "기본값 사용",
      analyzeWebsite: "웹사이트 분석",
      refreshPage: "페이지 새로고침",
      openSavedLead: "저장된 리드 열기",
      updateBilling: "결제 업데이트",
      checkingAccess: "접근 확인 중",
      signInToScan: "로그인 후 스캔",
      openPublicSite: "공개 사이트 열기",
      notEnoughCredits: "크레딧 부족"
    },
    session: {
      checkingTitle: "LeadCue 접근 상태를 확인하는 중...",
      checkingCopy: "이 브라우저에 LeadCue 워크스페이스 세션이 있는지 확인하고 있습니다.",
      unavailableTitle: "LeadCue API가 아직 확장 프로그램 로그인에 준비되지 않았습니다.",
      unavailableDatabaseCopy:
        "이 환경에서는 아직 워크스페이스 세션을 발급할 수 없습니다. API와 데이터베이스 설정을 완료한 뒤 다시 접근을 새로고침하세요.",
      unavailableApiCopy:
        "LeadCue가 설정된 API에 연결하지 못했습니다. 설정을 열고 운영 API와 대시보드 URL을 확인하세요.",
      signInTitle: "LeadCue 워크스페이스에 로그인하세요.",
      signInCopy:
        "이 브라우저에서 LeadCue 웹 앱에 한 번 로그인하세요. 이후 확장 프로그램이 실제 요금제와 크레딧으로 웹사이트를 스캔할 수 있습니다.",
      billingTitle: "추가 스캔 전에 결제 확인이 필요합니다."
    },
    notes: {
      permission: 'LeadCue는 "웹사이트 분석"을 클릭한 뒤에만 현재 웹사이트를 읽습니다.',
      initialSignIn: "Chrome에서 스캔하기 전에 실제 LeadCue 워크스페이스에 로그인하세요.",
      loading: "LeadCue가 현재 웹사이트를 __MODE__ 모드로 스캔하고 있습니다.",
      checking: "스캔을 활성화하기 전에 워크스페이스 접근을 확인하고 있습니다.",
      apiUnavailable: "LeadCue API에 연결할 수 없습니다. 설정을 열고 운영 API URL을 확인하세요.",
      signIn: "웹에서 한 번 로그인한 뒤 여기로 돌아와 워크스페이스 접근을 새로고침하세요.",
      subscriptionInactive: "현재 구독 상태는 __STATUS__ 입니다. 다시 스캔하기 전에 결제 페이지를 여세요.",
      openPublicSite: "스캔하기 전에 http(s) 주소가 있는 공개 회사 웹사이트를 여세요."
    },
    status: {
      initializing: "LeadCue 워크스페이스 접근을 확인하고 있습니다.",
      initFailed: "LeadCue를 초기화할 수 없습니다. 설정을 열고 API 및 대시보드 URL을 확인하세요.",
      settingsSaved: "LeadCue 설정이 저장되었습니다. 워크스페이스 접근을 새로고침하는 중...",
      settingsReset: "LeadCue 설정을 기본값으로 되돌렸습니다.",
      connected: "__WORKSPACE__에 연결되었습니다.",
      apiNotReady: "이 환경의 LeadCue API는 아직 확장 프로그램 로그인에 준비되지 않았습니다.",
      signInReturn: "웹에서 로그인한 뒤 여기로 돌아와 실제 워크스페이스로 스캔하세요.",
      apiUnreachable: "LeadCue API에 연결할 수 없습니다. 설정을 열고 운영 API URL을 확인하세요.",
      activeTabRefreshed: "현재 탭을 새로고침했습니다.",
      openSiteBeforeScan: "스캔하기 전에 공개 회사 웹사이트를 여세요.",
      signInBeforeScan: "Chrome 확장 프로그램에서 스캔하기 전에 LeadCue에 로그인하세요.",
      billingNeedsAttention: "다시 스캔하기 전에 결제 확인이 필요합니다. 현재 상태: __STATUS__.",
      insufficientCredits: "이번 __MODE__ 스캔에는 __CREDITS__가 필요합니다. 남은 수량: __REMAINING__.",
      analyzeFailed: "LeadCue가 이 페이지를 분석하지 못했습니다.",
      signedOut: "이 브라우저에서 LeadCue 로그아웃을 완료했습니다.",
      signOutFailed: "지금은 LeadCue에서 로그아웃할 수 없습니다.",
      noFirstLine: "이 Prospect Card에는 복사할 첫 문장이 없습니다.",
      firstLineCopied: "가장 좋은 첫 문장을 복사했습니다.",
      noPublicEmail: "스캔한 웹사이트에서 공개 이메일을 찾지 못했습니다.",
      emailCopied: "주요 이메일을 복사했습니다.",
      scanBeforeOpenLead: "LeadCue가 리드를 저장할 수 있도록 먼저 웹사이트를 스캔하세요.",
      finishSignIn: "웹에서 로그인을 완료한 뒤 여기로 돌아와 워크스페이스 접근을 새로고침하세요.",
      finishSignup: "웹 탭에서 LeadCue 가입을 완료한 뒤 여기로 돌아와 스캔을 시작하세요.",
      clipboardFailed: "브라우저에서 해당 값을 복사하지 못했습니다.",
      workspaceUnavailable: "다시 스캔하기 전에 워크스페이스 접근을 새로고침해야 합니다."
    },
    result: {
      summaryFallback: "LeadCue가 이 회사 웹사이트에 대한 Prospect Card를 생성했습니다.",
      firstLineFallback: "이번 스캔에서는 아웃리치 첫 문장이 생성되지 않았습니다.",
      noSignals: "이번 스캔에서 강한 공개 웹사이트 신호를 찾지 못했습니다.",
      signalTitleFallback: "웹사이트 신호",
      signalReasonFallback: "LeadCue가 검토할 가치가 있는 공개 웹사이트 신호를 찾았습니다."
    },
    scanModes: {
      basic: "기본"
    },
    formats: {
      workspaceReady: "__WORKSPACE__에서 스캔할 준비가 되었습니다.",
      workspaceReadyCopy: "__EMAIL__ 계정은 실제 웹사이트를 스캔하고 검증된 리드를 이 워크스페이스에 바로 저장할 수 있습니다.",
      billingCopy: "현재 구독 상태: __STATUS__. 스캔을 다시 활성화하거나 요금제를 업그레이드하려면 결제를 여세요.",
      creditsCharging: "이번 __MODE__ 스캔이 완료되면 __CREDITS__가 차감됩니다.",
      scanSaved: "__COMPANY__이(가) __WORKSPACE__에 저장되었습니다.",
      apiResponse: "LeadCue API가 __STATUS__을(를) 반환했습니다.",
      creditOne: "__COUNT__ 크레딧",
      creditOther: "__COUNT__ 크레딧"
    }
  },
  de: {
    meta: {
      manifestName: "LeadCue - KI-Assistant fuer Website-Prospecting",
      manifestDescription:
        "Analysieren Sie die aktive Unternehmenswebsite, qualifizieren Sie den Account und speichern Sie eine quellenbasierte Prospect Card in Ihrem LeadCue-Workspace.",
      actionTitle: "LeadCue-Seitenleiste oeffnen",
      tagline: "Website-Prospecting fuer echte Workspaces"
    },
    aria: {
      refreshSession: "Workspace-Zugriff aktualisieren",
      toggleSettings: "Einstellungen umschalten"
    },
    badges: {
      checking: "Wird geprueft",
      unavailable: "Nicht verfuegbar",
      signIn: "Anmelden",
      signedIn: "Angemeldet",
      billing: "Abrechnung"
    },
    labels: {
      workspaceAccess: "Workspace-Zugriff",
      setupNeeded: "Einrichtung noetig",
      connectedWorkspace: "Verbundener Workspace",
      workspace: "Workspace",
      owner: "Verantwortlich",
      plan: "Tarif",
      creditsLeft: "Verbleibende Credits",
      advancedSettings: "Erweiterte Einstellungen",
      apiBaseUrl: "API-Basis-URL",
      dashboardUrl: "Dashboard-URL",
      activeWebsite: "Aktive Website",
      bestEmail: "Beste E-Mail",
      noEmailFound: "Keine E-Mail gefunden",
      salesCues: "Vertriebssignale",
      homepage: "Startseite",
      unknown: "Unbekannt",
      readyToScan: "Bereit zum Scannen",
      workspaceFallback: "LeadCue-Workspace",
      signedInWorkspace: "Angemeldeter Workspace",
      planUnknown: "Unbekannt",
      companyFallback: "Prospect bereit",
      language: "Sprache"
    },
    buttons: {
      manageBilling: "Abrechnung verwalten",
      signOut: "Abmelden",
      saveSettings: "Einstellungen speichern",
      useDefaults: "Standardwerte nutzen",
      analyzeWebsite: "Website analysieren",
      refreshPage: "Seite aktualisieren",
      openSavedLead: "Gespeicherten Lead oeffnen",
      updateBilling: "Abrechnung aktualisieren",
      checkingAccess: "Zugriff wird geprueft",
      signInToScan: "Zum Scannen anmelden",
      openPublicSite: "Oeffentliche Website oeffnen",
      notEnoughCredits: "Nicht genug Credits"
    },
    session: {
      checkingTitle: "LeadCue-Zugriff wird geprueft...",
      checkingCopy: "Wir pruefen, ob dieser Browser bereits eine LeadCue-Workspace-Sitzung hat.",
      unavailableTitle: "Die LeadCue-API ist noch nicht fuer die Anmeldung in der Erweiterung bereit.",
      unavailableDatabaseCopy:
        "Diese Umgebung kann noch keine Workspace-Sitzungen ausstellen. Schliessen Sie zuerst API- und Datenbank-Setup ab und laden Sie dann den Zugriff neu.",
      unavailableApiCopy:
        "LeadCue konnte die konfigurierte API nicht erreichen. Oeffnen Sie die Einstellungen und pruefen Sie die Produktions-API und die Dashboard-URL.",
      signInTitle: "Melden Sie sich in Ihrem LeadCue-Workspace an.",
      signInCopy:
        "Verwenden Sie die LeadCue-Web-App in diesem Browser einmal. Danach kann die Erweiterung Websites mit Ihrem echten Tarif und Ihren Credits scannen.",
      billingTitle: "Vor weiteren Scans braucht die Abrechnung Aufmerksamkeit."
    },
    notes: {
      permission: 'LeadCue liest die aktive Website erst, nachdem Sie auf "Website analysieren" geklickt haben.',
      initialSignIn: "Melden Sie sich in einem echten LeadCue-Workspace an, bevor Sie aus Chrome scannen.",
      loading: "LeadCue fuehrt gerade einen __MODE__-Scan auf der aktiven Website aus.",
      checking: "Workspace-Zugriff wird geprueft, bevor Scans aktiviert werden.",
      apiUnavailable: "Die LeadCue-API ist nicht erreichbar. Oeffnen Sie die Einstellungen und pruefen Sie die Produktions-API-URL.",
      signIn: "Melden Sie sich einmal im Web an und kehren Sie dann hierher zurueck, um den Workspace-Zugriff zu aktualisieren.",
      subscriptionInactive: "Ihr Abo-Status ist __STATUS__. Oeffnen Sie die Abrechnung, bevor Sie erneut scannen.",
      openPublicSite: "Oeffnen Sie vor dem Scannen eine oeffentliche Unternehmenswebsite mit http(s)-Adresse."
    },
    status: {
      initializing: "LeadCue-Workspace-Zugriff wird geprueft.",
      initFailed: "LeadCue konnte nicht initialisiert werden. Oeffnen Sie die Einstellungen und pruefen Sie API- und Dashboard-URL.",
      settingsSaved: "LeadCue-Einstellungen gespeichert. Workspace-Zugriff wird aktualisiert...",
      settingsReset: "LeadCue-Einstellungen wurden auf die Standardwerte zurueckgesetzt.",
      connected: "Mit __WORKSPACE__ verbunden.",
      apiNotReady: "Die LeadCue-API dieser Umgebung ist noch nicht fuer die Anmeldung in der Erweiterung bereit.",
      signInReturn: "Melden Sie sich im Web an und kommen Sie dann hierher zurueck, um mit Ihrem echten Workspace zu scannen.",
      apiUnreachable: "Die LeadCue-API ist nicht erreichbar. Oeffnen Sie die Einstellungen und pruefen Sie die Produktions-API-URL.",
      activeTabRefreshed: "Aktiver Tab aktualisiert.",
      openSiteBeforeScan: "Oeffnen Sie vor dem Scannen eine oeffentliche Unternehmenswebsite.",
      signInBeforeScan: "Melden Sie sich bei LeadCue an, bevor Sie aus der Chrome-Erweiterung scannen.",
      billingNeedsAttention: "Vor dem naechsten Scan braucht die Abrechnung Aufmerksamkeit. Aktueller Status: __STATUS__.",
      insufficientCredits: "Dieser __MODE__-Scan benoetigt __CREDITS__. Verbleibend: __REMAINING__.",
      analyzeFailed: "LeadCue konnte diese Seite nicht analysieren.",
      signedOut: "In diesem Browser von LeadCue abgemeldet.",
      signOutFailed: "LeadCue konnte Sie gerade nicht abmelden.",
      noFirstLine: "In dieser Prospect Card ist keine erste Zeile zum Kopieren verfuegbar.",
      firstLineCopied: "Beste erste Zeile kopiert.",
      noPublicEmail: "Auf der gescannten Website wurde keine oeffentliche E-Mail gefunden.",
      emailCopied: "Primaere E-Mail kopiert.",
      scanBeforeOpenLead: "Scannen Sie zuerst eine Website, damit LeadCue den Lead speichern kann.",
      finishSignIn: "Schliessen Sie die Anmeldung im Web ab und kehren Sie dann hierher zurueck, um den Workspace-Zugriff zu aktualisieren.",
      finishSignup: "Schliessen Sie die LeadCue-Registrierung im Web-Tab ab und kehren Sie dann hierher zurueck, um mit dem Scannen zu beginnen.",
      clipboardFailed: "LeadCue konnte diesen Wert nicht aus dem Browser kopieren.",
      workspaceUnavailable: "Der Workspace-Zugriff muss vor dem naechsten Scan aktualisiert werden."
    },
    result: {
      summaryFallback: "LeadCue hat fuer diese Unternehmenswebsite eine Prospect Card erstellt.",
      firstLineFallback: "Fuer diesen Scan wurde kein Outreach-Einstieg erzeugt.",
      noSignals: "LeadCue hat in diesem Scan keine starken oeffentlichen Website-Signale gefunden.",
      signalTitleFallback: "Website-Signal",
      signalReasonFallback: "LeadCue hat ein sichtbares Website-Signal gefunden, das pruefenswert ist."
    },
    scanModes: {
      basic: "Basis"
    },
    formats: {
      workspaceReady: "__WORKSPACE__ ist scanbereit.",
      workspaceReadyCopy: "__EMAIL__ kann echte Websites scannen und qualifizierte Leads direkt in diesem Workspace speichern.",
      billingCopy: "Aktueller Abo-Status: __STATUS__. Oeffnen Sie die Abrechnung, um Scans wieder zu aktivieren oder Ihren Tarif zu erweitern.",
      creditsCharging: "Wenn dieser __MODE__-Scan abgeschlossen ist, werden __CREDITS__ berechnet.",
      scanSaved: "__COMPANY__ wurde in __WORKSPACE__ gespeichert.",
      apiResponse: "LeadCue API hat __STATUS__ zurueckgegeben.",
      creditOne: "__COUNT__ Credit",
      creditOther: "__COUNT__ Credits"
    }
  },
  nl: {
    meta: {
      manifestName: "LeadCue - AI Website Prospecting Assistant",
      manifestDescription:
        "Analyseer de actieve bedrijfswebsite, kwalificeer het account en sla een Prospect Card met bronverwijzingen op in je LeadCue-workspace.",
      actionTitle: "LeadCue-zijpaneel openen",
      tagline: "Website-prospecting voor echte workspaces"
    },
    aria: {
      refreshSession: "Workspace-toegang verversen",
      toggleSettings: "Instellingen wisselen"
    },
    badges: {
      checking: "Controleren",
      unavailable: "Niet beschikbaar",
      signIn: "Inloggen",
      signedIn: "Ingelogd",
      billing: "Facturatie"
    },
    labels: {
      workspaceAccess: "Workspace-toegang",
      setupNeeded: "Instelling nodig",
      connectedWorkspace: "Verbonden workspace",
      workspace: "Workspace",
      owner: "Eigenaar",
      plan: "Plan",
      creditsLeft: "Resterende credits",
      advancedSettings: "Geavanceerde instellingen",
      apiBaseUrl: "API-basis-URL",
      dashboardUrl: "Dashboard-URL",
      activeWebsite: "Actieve website",
      bestEmail: "Beste e-mail",
      noEmailFound: "Geen e-mail gevonden",
      salesCues: "Verkoopsignalen",
      homepage: "Startpagina",
      unknown: "Onbekend",
      readyToScan: "Klaar om te scannen",
      workspaceFallback: "LeadCue-workspace",
      signedInWorkspace: "Ingelogde workspace",
      planUnknown: "Onbekend",
      companyFallback: "Prospect klaar",
      language: "Taal"
    },
    buttons: {
      manageBilling: "Facturatie beheren",
      signOut: "Uitloggen",
      saveSettings: "Instellingen opslaan",
      useDefaults: "Standaardwaarden gebruiken",
      analyzeWebsite: "Website analyseren",
      refreshPage: "Pagina verversen",
      openSavedLead: "Opgeslagen lead openen",
      updateBilling: "Facturatie bijwerken",
      checkingAccess: "Toegang controleren",
      signInToScan: "Inloggen om te scannen",
      openPublicSite: "Openbare site openen",
      notEnoughCredits: "Niet genoeg credits"
    },
    session: {
      checkingTitle: "LeadCue-toegang wordt gecontroleerd...",
      checkingCopy: "We controleren of deze browser al een LeadCue-workspace-sessie heeft.",
      unavailableTitle: "De LeadCue-API is nog niet klaar voor inloggen via de extensie.",
      unavailableDatabaseCopy:
        "Deze omgeving kan nog geen workspace-sessies uitgeven. Rond eerst de API- en databaseconfiguratie af en ververs daarna de toegang.",
      unavailableApiCopy:
        "LeadCue kon de geconfigureerde API niet bereiken. Open de instellingen en controleer de productie-API en dashboard-URL.",
      signInTitle: "Log in op je LeadCue-workspace.",
      signInCopy:
        "Gebruik de LeadCue-webapp een keer in deze browser. Daarna kan de extensie websites scannen met je echte plan en credits.",
      billingTitle: "Facturatie heeft aandacht nodig voordat je verder scant."
    },
    notes: {
      permission: 'LeadCue leest de actieve website pas nadat je op "Website analyseren" hebt geklikt.',
      initialSignIn: "Log in op een echte LeadCue-workspace voordat je vanuit Chrome scant.",
      loading: "LeadCue voert nu een __MODE__-scan uit op de actieve website.",
      checking: "Workspace-toegang wordt gecontroleerd voordat scannen wordt ingeschakeld.",
      apiUnavailable: "De LeadCue-API is niet bereikbaar. Open de instellingen en controleer de productie-API-URL.",
      signIn: "Log een keer in op het web en kom hier terug om de workspace-toegang te verversen.",
      subscriptionInactive: "Je abonnementsstatus is __STATUS__. Open de facturatie voordat je opnieuw scant.",
      openPublicSite: "Open voor het scannen een openbare bedrijfswebsite met een http(s)-adres."
    },
    status: {
      initializing: "LeadCue-workspace-toegang wordt gecontroleerd.",
      initFailed: "LeadCue kon niet worden gestart. Open de instellingen en controleer de API- en dashboard-URL.",
      settingsSaved: "LeadCue-instellingen opgeslagen. Workspace-toegang wordt ververst...",
      settingsReset: "LeadCue-instellingen zijn teruggezet naar de standaardwaarden.",
      connected: "Verbonden met __WORKSPACE__.",
      apiNotReady: "De LeadCue-API in deze omgeving is nog niet klaar voor inloggen via de extensie.",
      signInReturn: "Log in op het web en kom dan hier terug om met je echte workspace te scannen.",
      apiUnreachable: "De LeadCue-API is niet bereikbaar. Open de instellingen en controleer de productie-API-URL.",
      activeTabRefreshed: "Actief tabblad ververst.",
      openSiteBeforeScan: "Open een openbare bedrijfswebsite voordat je scant.",
      signInBeforeScan: "Log in op LeadCue voordat je scant vanuit de Chrome-extensie.",
      billingNeedsAttention: "Facturatie heeft aandacht nodig voordat je opnieuw scant. Huidige status: __STATUS__.",
      insufficientCredits: "Deze __MODE__-scan vereist __CREDITS__. Over: __REMAINING__.",
      analyzeFailed: "LeadCue kon deze pagina niet analyseren.",
      signedOut: "Uitgelogd bij LeadCue in deze browser.",
      signOutFailed: "LeadCue kon je nu niet uitloggen.",
      noFirstLine: "Er is geen eerste regel beschikbaar om uit deze Prospect Card te kopieren.",
      firstLineCopied: "Beste eerste regel gekopieerd.",
      noPublicEmail: "Er is geen openbaar e-mailadres gevonden op de gescande website.",
      emailCopied: "Primair e-mailadres gekopieerd.",
      scanBeforeOpenLead: "Scan eerst een website zodat LeadCue de lead kan opslaan.",
      finishSignIn: "Rond het inloggen op het web af en kom dan hier terug om de workspace-toegang te verversen.",
      finishSignup: "Rond je LeadCue-aanmelding af in het webtabblad en kom dan hier terug om te scannen.",
      clipboardFailed: "LeadCue kon die waarde niet uit de browser kopieren.",
      workspaceUnavailable: "Workspace-toegang moet worden ververst voordat je opnieuw scant."
    },
    result: {
      summaryFallback: "LeadCue heeft voor deze bedrijfswebsite een Prospect Card gemaakt.",
      firstLineFallback: "Er is voor deze scan geen outreach-openingszin gegenereerd.",
      noSignals: "LeadCue heeft in deze scan geen sterke openbare websitesignalen gevonden.",
      signalTitleFallback: "Websitesignaal",
      signalReasonFallback: "LeadCue heeft een zichtbaar websitesignaal gevonden dat het bekijken waard is."
    },
    scanModes: {
      basic: "basis"
    },
    formats: {
      workspaceReady: "__WORKSPACE__ is klaar om te scannen.",
      workspaceReadyCopy: "__EMAIL__ kan echte websites scannen en gekwalificeerde leads direct in deze workspace opslaan.",
      billingCopy: "Huidige abonnementsstatus: __STATUS__. Open facturatie om scannen opnieuw te activeren of je plan te upgraden.",
      creditsCharging: "Wanneer deze __MODE__-scan is voltooid, worden __CREDITS__ verbruikt.",
      scanSaved: "__COMPANY__ is opgeslagen in __WORKSPACE__.",
      apiResponse: "LeadCue API gaf __STATUS__ terug.",
      creditOne: "__COUNT__ credit",
      creditOther: "__COUNT__ credits"
    }
  },
  fr: {
    meta: {
      manifestName: "LeadCue - Assistant IA de prospection de sites web",
      manifestDescription:
        "Analysez le site d'entreprise actif, qualifiez le compte et enregistrez une Prospect Card sourcee dans votre workspace LeadCue.",
      actionTitle: "Ouvrir le panneau lateral LeadCue",
      tagline: "Prospection de sites web pour de vrais workspaces"
    },
    aria: {
      refreshSession: "Rafraichir l'acces au workspace",
      toggleSettings: "Afficher ou masquer les parametres"
    },
    badges: {
      checking: "Verification",
      unavailable: "Indisponible",
      signIn: "Connexion",
      signedIn: "Connecte",
      billing: "Facturation"
    },
    labels: {
      workspaceAccess: "Acces au workspace",
      setupNeeded: "Configuration requise",
      connectedWorkspace: "Workspace connecte",
      workspace: "Workspace",
      owner: "Responsable",
      plan: "Plan",
      creditsLeft: "Credits restants",
      advancedSettings: "Parametres avances",
      apiBaseUrl: "URL de base de l'API",
      dashboardUrl: "URL du tableau de bord",
      activeWebsite: "Site actif",
      bestEmail: "Meilleur e-mail",
      noEmailFound: "Aucun e-mail trouve",
      salesCues: "Signaux commerciaux",
      homepage: "Page d'accueil",
      unknown: "Inconnu",
      readyToScan: "Pret a scanner",
      workspaceFallback: "Workspace LeadCue",
      signedInWorkspace: "Workspace connecte",
      planUnknown: "Inconnu",
      companyFallback: "Prospect pret",
      language: "Langue"
    },
    buttons: {
      manageBilling: "Gerer la facturation",
      signOut: "Se deconnecter",
      saveSettings: "Enregistrer les parametres",
      useDefaults: "Utiliser les valeurs par defaut",
      analyzeWebsite: "Analyser le site",
      refreshPage: "Rafraichir la page",
      openSavedLead: "Ouvrir le lead enregistre",
      updateBilling: "Mettre a jour la facturation",
      checkingAccess: "Verification de l'acces",
      signInToScan: "Se connecter pour scanner",
      openPublicSite: "Ouvrir un site public",
      notEnoughCredits: "Credits insuffisants"
    },
    session: {
      checkingTitle: "Verification de l'acces LeadCue...",
      checkingCopy: "Nous verifions si ce navigateur dispose deja d'une session workspace LeadCue.",
      unavailableTitle: "L'API LeadCue n'est pas encore prete pour la connexion via l'extension.",
      unavailableDatabaseCopy:
        "Cet environnement ne peut pas encore delivrer de sessions workspace. Terminez d'abord la configuration de l'API et de la base de donnees, puis rafraichissez l'acces.",
      unavailableApiCopy:
        "LeadCue n'a pas pu joindre l'API configuree. Ouvrez les parametres et verifiez l'API de production ainsi que l'URL du tableau de bord.",
      signInTitle: "Connectez-vous a votre workspace LeadCue.",
      signInCopy:
        "Utilisez l'application web LeadCue une fois dans ce navigateur. Ensuite, l'extension pourra scanner des sites avec votre vrai plan et vos credits.",
      billingTitle: "La facturation demande une action avant de nouveaux scans."
    },
    notes: {
      permission: "LeadCue ne lit le site actif qu'apres un clic sur \"Analyser le site\".",
      initialSignIn: "Connectez-vous a un vrai workspace LeadCue avant de scanner depuis Chrome.",
      loading: "LeadCue lance actuellement un scan __MODE__ sur le site actif.",
      checking: "Verification de l'acces au workspace avant d'activer les scans.",
      apiUnavailable: "L'API LeadCue est inaccessible. Ouvrez les parametres et verifiez l'URL de l'API de production.",
      signIn: "Connectez-vous une fois sur le web puis revenez ici pour rafraichir l'acces au workspace.",
      subscriptionInactive: "Votre statut d'abonnement est __STATUS__. Ouvrez la facturation avant de relancer un scan.",
      openPublicSite: "Avant de scanner, ouvrez un site d'entreprise public avec une adresse http(s)."
    },
    status: {
      initializing: "Verification de l'acces au workspace LeadCue.",
      initFailed: "LeadCue n'a pas pu s'initialiser. Ouvrez les parametres et verifiez l'API ainsi que l'URL du tableau de bord.",
      settingsSaved: "Parametres LeadCue enregistres. Rafraichissement de l'acces au workspace...",
      settingsReset: "Les parametres LeadCue ont ete remis aux valeurs par defaut.",
      connected: "Connecte a __WORKSPACE__.",
      apiNotReady: "L'API LeadCue de cet environnement n'est pas encore prete pour la connexion via l'extension.",
      signInReturn: "Connectez-vous sur le web puis revenez ici pour scanner avec votre vrai workspace.",
      apiUnreachable: "L'API LeadCue est inaccessible. Ouvrez les parametres et verifiez l'URL de l'API de production.",
      activeTabRefreshed: "Onglet actif rafraichi.",
      openSiteBeforeScan: "Ouvrez un site d'entreprise public avant de lancer un scan.",
      signInBeforeScan: "Connectez-vous a LeadCue avant de scanner depuis l'extension Chrome.",
      billingNeedsAttention: "La facturation demande une action avant un nouveau scan. Statut actuel : __STATUS__.",
      insufficientCredits: "Ce scan __MODE__ necessite __CREDITS__. Restant : __REMAINING__.",
      analyzeFailed: "LeadCue n'a pas pu analyser cette page.",
      signedOut: "Deconnecte de LeadCue dans ce navigateur.",
      signOutFailed: "LeadCue ne peut pas vous deconnecter pour le moment.",
      noFirstLine: "Aucune phrase d'ouverture n'est disponible a copier depuis cette Prospect Card.",
      firstLineCopied: "Meilleure phrase d'ouverture copiee.",
      noPublicEmail: "Aucun e-mail public n'a ete trouve sur le site scanne.",
      emailCopied: "E-mail principal copie.",
      scanBeforeOpenLead: "Scannez d'abord un site pour que LeadCue puisse enregistrer le lead.",
      finishSignIn: "Terminez la connexion sur le web puis revenez ici pour rafraichir l'acces au workspace.",
      finishSignup: "Terminez votre inscription LeadCue dans l'onglet web puis revenez ici pour commencer a scanner.",
      clipboardFailed: "LeadCue n'a pas pu copier cette valeur depuis le navigateur.",
      workspaceUnavailable: "L'acces au workspace doit etre rafraichi avant un nouveau scan."
    },
    result: {
      summaryFallback: "LeadCue a genere une Prospect Card pour ce site d'entreprise.",
      firstLineFallback: "Aucune accroche n'a ete generee pour ce scan.",
      noSignals: "LeadCue n'a pas trouve de signaux publics forts sur ce scan.",
      signalTitleFallback: "Signal du site",
      signalReasonFallback: "LeadCue a trouve un signal visible sur le site qui merite d'etre verifie."
    },
    scanModes: {
      basic: "standard"
    },
    formats: {
      workspaceReady: "__WORKSPACE__ est pret a scanner.",
      workspaceReadyCopy: "__EMAIL__ peut scanner de vrais sites et enregistrer directement des leads qualifies dans ce workspace.",
      billingCopy: "Statut d'abonnement actuel : __STATUS__. Ouvrez la facturation pour reactiver les scans ou changer de plan.",
      creditsCharging: "Une fois ce scan __MODE__ termine, __CREDITS__ seront deduits.",
      scanSaved: "__COMPANY__ a ete enregistre dans __WORKSPACE__.",
      apiResponse: "L'API LeadCue a renvoye __STATUS__.",
      creditOne: "__COUNT__ credit",
      creditOther: "__COUNT__ credits"
    }
  }
};

const settingsToggleCopyByLocale = {
  en: {
    aria: {
      show: "Choose language",
      hide: "Close language picker"
    },
    buttons: {
      show: "Language",
      hide: "Close"
    }
  },
  zh: {
    aria: {
      show: "展开语言选项",
      hide: "收起语言选项"
    },
    buttons: {
      show: "语言",
      hide: "收起"
    }
  },
  ja: {
    aria: {
      show: "言語を選ぶ",
      hide: "言語選択を閉じる"
    },
    buttons: {
      show: "言語",
      hide: "閉じる"
    }
  },
  ko: {
    aria: {
      show: "언어 선택 열기",
      hide: "언어 선택 닫기"
    },
    buttons: {
      show: "언어",
      hide: "닫기"
    }
  },
  de: {
    aria: {
      show: "Sprache auswählen",
      hide: "Sprachauswahl schliessen"
    },
    buttons: {
      show: "Sprache",
      hide: "Schliessen"
    }
  },
  nl: {
    aria: {
      show: "Taal kiezen",
      hide: "Taalkiezer sluiten"
    },
    buttons: {
      show: "Taal",
      hide: "Sluiten"
    }
  },
  fr: {
    aria: {
      show: "Choisir la langue",
      hide: "Fermer le choix de langue"
    },
    buttons: {
      show: "Langue",
      hide: "Fermer"
    }
  }
};

const languagePanelTitleByLocale = {
  en: "Interface language",
  zh: "界面语言",
  ja: "表示言語",
  ko: "표시 언어",
  de: "Anzeigesprache",
  nl: "Weergavetaal",
  fr: "Langue d'affichage"
};

function valueAt(target, pathParts) {
  return pathParts.reduce((current, key) => current?.[key], target);
}

function pickFirst(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function pickSeoTitle(site, fallback) {
  return pickFirst(valueAt(site, ["home", "seo", "title"]), fallback);
}

function buildRuntimeLocale(locale) {
  const manual = manualByLocale[locale];
  const settingsToggle = settingsToggleCopyByLocale[locale] || settingsToggleCopyByLocale.en;
  const languagePanelTitle = languagePanelTitleByLocale[locale] || languagePanelTitleByLocale.en;
  const site = siteUi[locale] || siteUi.en;
  const app = appUi[locale] || appUi.en;
  const extra = appExtra[locale] || appExtra.en;
  const accountSummary = valueAt(extra, ["account", "summary"]) || {};
  const dashboardMetrics = valueAt(extra, ["dashboard", "metrics"]) || {};
  const prospectCard = valueAt(extra, ["prospectCard"]) || {};
  const options = valueAt(extra, ["options"]) || {};
  const common = valueAt(extra, ["common"]) || {};
  const seoTitle = pickSeoTitle(site, manual.meta.manifestName);

  return {
    meta: {
      ...manual.meta,
      manifestName: seoTitle,
      sidePanelTitle: seoTitle
    },
    aria: {
      ...manual.aria,
      showSettings: settingsToggle.aria.show,
      hideSettings: settingsToggle.aria.hide
    },
    badges: manual.badges,
    localeNames: pickFirst(site.localeNames, siteUi.en.localeNames),
    labels: {
      workspaceAccess: manual.labels.workspaceAccess,
      setupNeeded: manual.labels.setupNeeded,
      connectedWorkspace: manual.labels.connectedWorkspace,
      workspace: pickFirst(accountSummary.workspace, manual.labels.workspace),
      owner: manual.labels.owner,
      plan: pickFirst(accountSummary.plan, manual.labels.plan),
      creditsLeft: pickFirst(dashboardMetrics.creditsLeft, manual.labels.creditsLeft),
      usedThisMonth: pickFirst(dashboardMetrics.usedThisMonth, "__COUNT__ used this month"),
      reset: pickFirst(common.reset, "Reset"),
      advancedSettings: manual.labels.advancedSettings,
      interfaceLanguage: languagePanelTitle,
      apiBaseUrl: manual.labels.apiBaseUrl,
      dashboardUrl: manual.labels.dashboardUrl,
      language: pickFirst(site.common?.languageLabel, manual.labels.language),
      activeWebsite: manual.labels.activeWebsite,
      deepScan: pickFirst(app.scan?.deepScan, "Deep scan"),
      deepScanHint: pickFirst(app.scan?.deepScanHint, "Uses 3 credits for richer context."),
      prospectCard: pickFirst(prospectCard.eyebrow, valueAt(extra, ["dashboard", "emptyProspect", "eyebrow"]), "Prospect Card"),
      fit: pickFirst(prospectCard.fitLabel, app.preview?.fit, "Fit"),
      bestEmail: manual.labels.bestEmail,
      noEmailFound: manual.labels.noEmailFound || "No email found",
      phones: pickFirst(prospectCard.contactLabels?.phones, "Phones"),
      contactPaths: pickFirst(prospectCard.contacts?.title, "Contact paths"),
      salesCues: manual.labels.salesCues,
      firstLine: pickFirst(prospectCard.copyLabels?.firstLine, app.preview?.firstLine, "First line"),
      source: pickFirst(prospectCard.copyLabels?.source, prospectCard.sources?.sourceLabel, "Source"),
      homepage: manual.labels.homepage,
      unknown: pickFirst(common.unknown, manual.labels.unknown),
      notSet: pickFirst(common.notSet, "Not set"),
      readyToScan: manual.labels.readyToScan,
      workspaceFallback: manual.labels.workspaceFallback,
      signedInWorkspace: manual.labels.signedInWorkspace,
      planUnknown: manual.labels.planUnknown,
      companyFallback: manual.labels.companyFallback
    },
    buttons: {
      signIn: pickFirst(site.common?.signIn, "Sign in"),
      startFree: pickFirst(site.common?.startFree, "Start free"),
      manageBilling: pickFirst(accountSummary.manageBilling, manual.buttons.manageBilling),
      signOut: pickFirst(accountSummary.signOut, manual.buttons.signOut),
      saveSettings: manual.buttons.saveSettings,
      useDefaults: manual.buttons.useDefaults,
      showSettings: settingsToggle.buttons.show,
      hideSettings: settingsToggle.buttons.hide,
      analyzeWebsite: manual.buttons.analyzeWebsite,
      refreshPage: manual.buttons.refreshPage,
      copyFirstLine: pickFirst(prospectCard.copyMenu?.firstLine, "Copy first line"),
      copyEmail: pickFirst(prospectCard.actions?.copyEmail, "Copy email"),
      openSavedLead: manual.buttons.openSavedLead,
      updateBilling: manual.buttons.updateBilling,
      checkingAccess: manual.buttons.checkingAccess,
      signInToScan: manual.buttons.signInToScan,
      openPublicSite: manual.buttons.openPublicSite,
      notEnoughCredits: manual.buttons.notEnoughCredits,
      scanning: pickFirst(app.scan?.scanning, "Scanning...")
    },
    session: manual.session,
    notes: manual.notes,
    status: {
      ...manual.status,
      subscriptionInactiveGeneric: pickFirst(common.messages?.subscriptionInactive, manual.status.billingNeedsAttention),
      insufficientCreditsGeneric: pickFirst(common.messages?.insufficientCredits, manual.status.insufficientCredits),
      billingPortalUnavailable: pickFirst(common.messages?.billingPortalUnavailable, "Billing portal is not available yet.")
    },
    result: manual.result,
    scanModes: {
      basic: manual.scanModes.basic,
      deep: pickFirst(app.scan?.deepScan, "Deep scan")
    },
    subscriptionStatuses: {
      active: pickFirst(options.subscriptionStatuses?.active, "Active"),
      trialing: pickFirst(options.subscriptionStatuses?.trialing, "Trialing"),
      pending_checkout: pickFirst(options.subscriptionStatuses?.pending_checkout, "Pending checkout"),
      configuration_required: pickFirst(options.subscriptionStatuses?.configuration_required, "Configuration required"),
      past_due: pickFirst(options.subscriptionStatuses?.past_due, "Past due"),
      canceled: pickFirst(options.subscriptionStatuses?.canceled, "Canceled")
    },
    signalCategories: {
      web_design: pickFirst(options.signalCategories?.web_design, "Web design"),
      seo: pickFirst(options.signalCategories?.seo, "SEO"),
      marketing: pickFirst(options.signalCategories?.marketing, "Marketing"),
      timing: pickFirst(options.signalCategories?.timing, "Timing")
    },
    formats: {
      ...manual.formats,
      usedThisMonth: pickFirst(dashboardMetrics.usedThisMonth, "__COUNT__ used this month"),
      sourcePrefix: "__LABEL__: __VALUE__"
    }
  };
}

const runtimeLocales = Object.fromEntries(locales.map((locale) => [locale, buildRuntimeLocale(locale)]));

const runtimeOutput = `// Generated by apps/extension/scripts/sync-locales.mjs\nwindow.LEADCUE_EXTENSION_SUPPORTED_LOCALES = ${JSON.stringify(locales, null, 2)};\nwindow.LEADCUE_EXTENSION_LOCALES = ${JSON.stringify(
  runtimeLocales,
  null,
  2
)};\n`;

await fs.mkdir(path.join(extensionDir, "_locales"), { recursive: true });
await fs.writeFile(path.join(extensionDir, "extension-locales.js"), runtimeOutput, "utf8");

for (const locale of locales) {
  const chromeLocale = chromeLocaleCodes[locale];
  const localeDir = path.join(extensionDir, "_locales", chromeLocale);
  await fs.mkdir(localeDir, { recursive: true });
  const localeBundle = runtimeLocales[locale];
  const manifestMessages = {
    extensionName: {
      message: localeBundle.meta.manifestName
    },
    extensionDescription: {
      message: localeBundle.meta.manifestDescription
    },
    actionTitle: {
      message: localeBundle.meta.actionTitle
    }
  };
  await fs.writeFile(path.join(localeDir, "messages.json"), `${JSON.stringify(manifestMessages, null, 2)}\n`, "utf8");
}
