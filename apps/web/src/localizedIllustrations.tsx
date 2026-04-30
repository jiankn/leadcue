import type { SiteLocaleCode } from "./siteLocale";

type HeroVisualCopy = {
  browserChip: string;
  browserTitle: string;
  browserSubtitle: string;
  fitLabel: string;
  fitValue: string;
  signalTitle: string;
  signalItems: string[];
  firstLineLabel: string;
  firstLineText: string;
  firstLineMeta: string;
  footerLeft: string;
  footerRight: string;
};

type ResearchVisualCopy = {
  headline: string;
  fitLabel: string;
  fitValue: string;
  cueLabel: string;
  cueValue: string;
  stackTitle: string;
  stackItems: string[];
};

type ResourceVisualCopy = {
  kicker: string;
  title: string;
  items: string[];
};

type LoginVisualCopy = {
  eyebrow: string;
  title: string;
  copy: string;
  proofItems: Array<{ label: string; value: string }>;
};

const loginVisualSources: Record<SiteLocaleCode, string> = {
  en: "/images/login-visuals/leadcue-login-en.png",
  zh: "/images/login-visuals/leadcue-login-zh.png",
  ja: "/images/login-visuals/leadcue-login-ja.png",
  ko: "/images/login-visuals/leadcue-login-ko.png",
  de: "/images/login-visuals/leadcue-login-de.png",
  nl: "/images/login-visuals/leadcue-login-nl.png",
  fr: "/images/login-visuals/leadcue-login-fr.png"
};

export function HeroVisualIllustration({ copy }: { copy: HeroVisualCopy }) {
  return (
    <div className="localized-visual localized-visual-hero" aria-hidden="true">
      <div className="visual-browser-frame">
        <div className="visual-browser-bar">
          <span>{copy.browserChip}</span>
          <strong>leadcue.app</strong>
        </div>
        <div className="visual-browser-body">
          <div className="visual-browser-copy">
            <small>{copy.browserTitle}</small>
            <strong>{copy.browserSubtitle}</strong>
          </div>
          <div className="visual-score-card">
            <span>{copy.fitLabel}</span>
            <strong>{copy.fitValue}</strong>
          </div>
        </div>
      </div>
      <div className="visual-signal-card">
        <span>{copy.signalTitle}</span>
        <ul>
          {copy.signalItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="visual-firstline-card">
        <span>✦ {copy.firstLineLabel}</span>
        <blockquote>{copy.firstLineText}</blockquote>
        <small>{copy.firstLineMeta}</small>
      </div>
      <div className="visual-footer-row">
        <span>{copy.footerLeft}</span>
        <strong>{copy.footerRight}</strong>
      </div>
    </div>
  );
}

export function ResearchDeskIllustration({ copy }: { copy: ResearchVisualCopy }) {
  return (
    <div className="localized-visual localized-visual-research" aria-hidden="true">
      <div className="visual-score-strip">
        <div>
          <span>{copy.fitLabel}</span>
          <strong>{copy.fitValue}</strong>
        </div>
        <div>
          <span>{copy.cueLabel}</span>
          <strong>{copy.cueValue}</strong>
        </div>
      </div>
      <div className="visual-stack-card">
        <small>{copy.headline}</small>
        <strong>{copy.stackTitle}</strong>
        <ul>
          {copy.stackItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ResourceIllustration({ copy }: { copy: ResourceVisualCopy }) {
  return (
    <div className="localized-visual localized-visual-resource" aria-hidden="true">
      <span>{copy.kicker}</span>
      <strong>{copy.title}</strong>
      <div className="resource-visual-list">
        {copy.items.map((item) => (
          <i key={item}>{item}</i>
        ))}
      </div>
    </div>
  );
}

export function LoginWorkspaceIllustration({ locale }: { copy: LoginVisualCopy; locale: SiteLocaleCode }) {
  return (
    <img className="localized-login-image" src={loginVisualSources[locale]} alt="" aria-hidden="true" loading="eager" decoding="async" />
  );
}
