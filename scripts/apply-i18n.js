const fs = require('fs');

let appContent = fs.readFileSync('apps/web/src/App.tsx', 'utf8');

if (!appContent.includes('useTranslation')) {
  // Add import
  appContent = appContent.replace(
    'import { type ChangeEvent',
    'import { useTranslation } from "react-i18next";\nimport { type ChangeEvent'
  );

  // Add useTranslation to MarketingSite
  appContent = appContent.replace(
    'function MarketingSite() {',
    'function MarketingSite() {\n  const { t, i18n } = useTranslation();'
  );

  // Replace strings in MarketingSite
  const replacements = [
    ['<span>LeadCue</span>', '<span>{t("brand.name")}</span>'],
    ['<a href="#features">Features</a>', '<a href="#features">{t("nav.features")}</a>'],
    ['<a href="#how">How it works</a>', '<a href="#how">{t("nav.howItWorks")}</a>'],
    ['<a href="#card">Sample card</a>', '<a href="#card">{t("nav.sampleCard")}</a>'],
    ['<a href="#pricing">Pricing</a>', '<a href="#pricing">{t("nav.pricing")}</a>'],
    ['<a href="#resources">Resources</a>', '<a href="#resources">{t("nav.resources")}</a>'],
    ['Sign in\n          </a>', '{t("nav.signIn")}\n          </a>'],
    ['Start free\n        </a>', '{t("nav.startFree")}\n        </a>'],
    ['<p className="eyebrow glass-pill">LeadCue for agency outbound teams</p>', '<p className="eyebrow glass-pill">{t("hero.eyebrow")}</p>'],
    ['Turn websites into <span className="accent-text">qualified prospects</span>', '{t("hero.title1")} <span className="accent-text">{t("hero.title2")}</span>'],
    ['<p className="hero-subhead">\n              Score fit, capture website evidence, and write first lines before your team saves\n              another generic lead.\n            </p>', '<p className="hero-subhead">\n              {t("hero.subhead")}\n            </p>'],
    ['Start free scan\n              </a>', '{t("hero.startScan")}\n              </a>'],
    ['View sample card\n              </a>', '{t("hero.viewCard")}\n              </a>'],
    ['<p className="microcopy">\n              20 free scans. Google sign-in. No LinkedIn scraping or contact database dependency.\n            </p>', '<p className="microcopy">\n              {t("hero.microcopy")}\n            </p>'],
  ];

  for (const [search, replace] of replacements) {
    if (appContent.includes(search)) {
      appContent = appContent.replace(search, replace);
    } else {
      console.warn('Could not find:', search);
    }
  }

  // Add Language Switcher to topbar
  const langSwitcher = `
        <div className="lang-switcher" style={{display: 'flex', gap: '8px', marginLeft: 'auto', marginRight: '16px', alignItems: 'center'}}>
          <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)} style={{background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', padding: '4px', color: 'inherit'}}>
            <option value="en">English</option>
            <option value="zh">简体中文</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="de">Deutsch</option>
            <option value="nl">Nederlands</option>
            <option value="fr">Français</option>
          </select>
        </div>`;

  appContent = appContent.replace(
    '<div className="topbar-actions">',
    langSwitcher + '\\n        <div className="topbar-actions">'
  );

  fs.writeFileSync('apps/web/src/App.tsx', appContent);
  console.log('App.tsx updated!');
} else {
  console.log('App.tsx already has useTranslation.');
}
