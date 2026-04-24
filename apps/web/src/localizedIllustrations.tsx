type HeroVisualCopy = {
  browserChip: string;
  browserTitle: string;
  browserSubtitle: string;
  fitLabel: string;
  fitValue: string;
  signalTitle: string;
  signalItems: string[];
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

export function LoginWorkspaceIllustration({ copy }: { copy: LoginVisualCopy }) {
  return (
    <div className="localized-visual localized-visual-login" aria-hidden="true">
      <div className="login-visual-copy">
        <small>{copy.eyebrow}</small>
        <strong>{copy.title}</strong>
        <p>{copy.copy}</p>
      </div>
      <div className="login-visual-proof">
        {copy.proofItems.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
