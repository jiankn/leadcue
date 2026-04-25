import type { SiteLocaleCode } from "./siteLocale";

type WidenStrings<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? WidenStrings<U>[]
    : T extends object
      ? { [K in keyof T]: WidenStrings<T[K]> }
      : T;

type DeepPartial<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepPartial<U>[]
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

const en = {
  common: {
    loading: "Loading",
    sample: "Sample",
    live: "Live",
    save: "Save",
    saving: "Saving...",
    saved: "Saved",
    reset: "Reset",
    search: "Search",
    sort: "Sort",
    filter: "Filter",
    clearFilters: "Clear filters",
    clearSelection: "Clear selection",
    clearVisible: "Clear visible",
    selectVisible: "Select visible",
    exportSelected: "Export selected",
    exporting: "Exporting...",
    copy: "Copy",
    copied: "Copied",
    failed: "Failed",
    downloaded: "Downloaded",
    close: "Close",
    open: "Open",
    hide: "Hide",
    details: "Details",
    previous: "Previous",
    current: "Current",
    editable: "Editable",
    enabled: "Enabled",
    updating: "Updating",
    updated: "Updated",
    notSet: "Not set",
    unknownTime: "Unknown time",
    unassigned: "Unassigned",
    empty: "Empty",
    none: "None",
    noneFound: "None found",
    noData: "No data",
    placeholders: {
      prospectUrl: "https://prospect.example.com",
      companyName: "Northstar Analytics",
      leadSearch: "Company, domain, or industry",
      assignTeammate: "Assign a teammate",
      nextAction: "Add the account angle, blocker, or next action."
    },
    messages: {
      demoPreviewIntro: "Demo preview. Create a workspace to save prospects and track credits with a secure session.",
      sampleWorkspaceData: "__ERROR__ Showing sample workspace data.",
      sampleWorkspaceDataPlain: "Showing sample workspace data.",
      billingActiveSetup: "Billing is active. Finish the first setup below.",
      workspaceCreatedSetup: "Workspace created. Finish the first setup below.",
      signedIn: "Signed in.",
      scanDeskLoaded: "__URL__ is loaded in the scan desk. Review the notes, then run the scan.",
      scanDeskMissingTarget: "Add a prospect website in the scan desk to create the first saved Prospect Card.",
      samePlan: "You are already on the __PLAN__ plan.",
      checkoutUnavailable: "Checkout is not available for that plan right now.",
      leadDetailUnavailable: "Unable to load lead detail.",
      scanInvalidUrl: "Enter a valid prospect website URL. No credit was used. Fix the URL and try again.",
      scanSaved: "__COMPANY__ saved as a Prospect Card. Credits used: __COUNT__.",
      scanComplete: "Scan complete. Review the Prospect Card before exporting or writing outreach.",
      scanFailed: "Scan failed. No credit was used. Fix the URL and try again.",
      onboardingDismissed: "Setup guide dismissed.",
      onboardingUpdateFailed: "Unable to update onboarding.",
      csvExportPrepared: "CSV export prepared with __LABEL__ fields.",
      csvExportFailed: "CSV export failed.",
      billingPortalUnavailable: "Billing portal is not available yet.",
      signedOutDemo: "Signed out. Showing the demo preview.",
      selectLeadBeforeExport: "Select at least one lead before exporting.",
      selectedLeadExported: "Exported __COUNT__ selected leads with __LABEL__ fields.",
      selectedLeadExportFailed: "Selected lead export failed.",
      signInRequired: "Sign in to continue.",
      workspaceNotFound: "Workspace not found.",
      subscriptionInactive: "Your subscription is not active. Update billing before scanning more websites.",
      insufficientCredits: "This workspace does not have enough scan credits for this request.",
      createFirstSavedCard:
        "Use the Chrome extension or POST /api/scans while signed in to create the first saved card."
    }
  },
  options: {
    leadSort: {
      newest: "Newest saved",
      fit_desc: "Fit score",
      confidence_desc: "Confidence",
      company_asc: "Company A-Z"
    },
    scanHistoryFilters: {
      all: "All",
      completed: "Completed",
      failed: "Failed",
      replayed: "Replayed",
      processing: "Processing"
    },
    historyDateFilters: {
      all: "All dates",
      today: "Today",
      "7d": "Last 7 days",
      "30d": "Last 30 days"
    },
    prospectCardTabs: {
      overview: "Overview",
      signals: "Signals",
      contacts: "Contacts",
      outreach: "Outreach",
      email: "Email",
      sources: "Sources",
      export: "Export"
    },
    pipelineStages: {
      researching: "Researching",
      qualified: "Qualified",
      outreach_queued: "Outreach queued",
      contacted: "Contacted",
      won: "Won",
      archived: "Archived"
    },
    activityFields: {
      all: "All",
      owner: "Owner",
      stage: "Stage",
      notes: "Notes"
    },
    serviceTypes: {
      web_design: "Web design / redesign",
      seo: "SEO agency",
      marketing: "Growth / marketing",
      founder: "Founder-led outbound",
      custom: "Custom",
      unknown: "Not set"
    },
    tones: {
      professional: "Professional",
      direct: "Direct",
      casual: "Casual",
      unknown: "Not set"
    },
    signalCategories: {
      web_design: "Web design",
      seo: "SEO",
      marketing: "Marketing",
      timing: "Timing"
    },
    subscriptionStatuses: {
      active: "Active",
      trialing: "Trialing",
      pending_checkout: "Checkout pending",
      configuration_required: "Billing setup required",
      past_due: "Past due",
      canceled: "Canceled"
    },
    historyReasons: {
      validation_failed: "validation failed",
      workspace_unavailable: "workspace unavailable",
      subscription_inactive: "subscription inactive",
      insufficient_credits: "insufficient credits",
      idempotency_conflict: "idempotency conflict",
      duplicate_in_progress: "duplicate in progress",
      generation_failed: "generation failed",
      persistence_failed: "persistence failed",
      replayed: "replayed",
      processing: "processing",
      unknown: "unknown reason"
    }
  },
  dashboard: {
    onboarding: {
      eyebrow: "First run",
      welcomeTitle: "Welcome, __NAME__.",
      workspaceReadyTitle: "Workspace ready, __NAME__.",
      intro:
        "LeadCue already has your plan and scoring defaults ready. Finish one scan to start saving Prospect Cards and export-ready notes.",
      progress: "__COUNT__/3 ready",
      markComplete: "Mark complete",
      checklistLabel: "Workspace onboarding checklist",
      setupSnapshot: "Setup snapshot",
      service: "Service",
      industries: "Industries",
      firstTarget: "First target",
      prepareFirstScan: "Prepare first scan",
      runFirstScan: "Run first scan",
      reviewIcp: "Review ICP",
      tasks: {
        profileSaved: "Targeting profile saved",
        firstWebsiteQueued: "First website queued",
        firstProspectCard: "First Prospect Card"
      },
      descriptions: {
        profileSaved: "Scoring is tuned for __INDUSTRIES__.",
        profileTodo: "Define the offer and industries you want LeadCue to score against.",
        websiteQueued: "Ready to scan: __URL__",
        agencySaved: "Agency site saved: __URL__",
        websiteTodo: "Add the first target website when your team is ready to scan.",
        firstCardDone: "__COUNT__ saved prospects already in the workspace.",
        firstCardTodo: "Run the first website scan to create a saved Prospect Card and export-ready notes."
      }
    },
    metrics: {
      ariaLabel: "Workspace metrics",
      savedProspects: "Saved prospects",
      currentPlan: "Current plan",
      creditsLeft: "Credits left",
      subscription: "Subscription",
      usedThisMonth: "__COUNT__ used this month"
    },
    leadsPanel: {
      eyebrow: "Lead list",
      title: "Saved prospects",
      company: "Company",
      industry: "Industry",
      fit: "Fit",
      confidence: "Confidence",
      emptyTitle: "No saved prospects yet.",
      emptyCopy: "Run a website scan from the extension or API, then saved Prospect Cards will appear here.",
      filterLabel: "Filter leads",
      tableLabel: "Saved leads"
    },
    emptyProspect: {
      eyebrow: "Prospect Card",
      title: "Your first saved card will appear here",
      copy:
        "LeadCue saves fit score, website evidence, outreach angles, first lines, and export notes after a completed scan.",
      cta: "Prepare first scan"
    },
    icpPanel: {
      eyebrow: "ICP settings",
      title: "Agency mode",
      serviceType: "Service type",
      targetIndustries: "Target industries",
      countries: "Countries",
      tone: "Tone",
      firstTarget: "First target"
    },
    signalPanel: {
      eyebrow: "Signals",
      title: "Current scan mix"
    }
  },
  leads: {
    eyebrow: "Saved accounts",
    title: "Prospect library",
    controlsLabel: "Prospect library controls",
    searchLabel: "Search",
    sortLabel: "Sort",
    minFit: "Min fit",
    minConfidence: "Min confidence",
    resultsSummary: "Showing __VISIBLE__ of __TOTAL__ prospects",
    selectedCount: "__COUNT__ selected",
    selectedReadyCopy: "Export only the accounts your team is ready to work.",
    selectedEmptyCopy: "Select prospects to export a focused CSV.",
    templateLabel: "Template",
    crmFieldsLabel: "CRM fields",
    tableLabel: "Saved prospects",
    selectAllVisible: "Select all visible prospects",
    clearAllVisible: "Clear all visible prospects",
    selectLead: "Select __COMPANY__",
    openProspectCard: "Open Prospect Card for __COMPANY__",
    noMatchingTitle: "No matching prospects.",
    noSavedTitle: "No saved prospects yet.",
    noMatchingCopy: "Relax the search or score filters to bring more accounts back into view.",
    noSavedCopy: "Run a website scan to create the first saved Prospect Card.",
    drawerLabel: "Selected lead Prospect Card",
    drawerEyebrow: "Selected lead",
    drawerTitle: "Full Prospect Card",
    drawerLoadingLabel: "Loading prospect card",
    drawerCloseLabel: "Close Prospect Card",
    drawerNoSelection: "No selection",
    drawerFitLabel: "__SCORE__ fit",
    errorShowingPreview: "Showing the list preview because full detail could not load.",
    detailEmptyTitle: "Select a lead",
    detailEmptyCopy:
      "Click any saved account to review the complete Prospect Card, including source-backed signals and email copy."
  },
  prospectCard: {
    eyebrow: "Prospect Card",
    summaryLabel: "Prospect summary",
    fitLabel: "Fit",
    website: "Website",
    industry: "Industry",
    confidence: "Confidence",
    status: "Status",
    owner: "Owner",
    stage: "Stage",
    sectionsLabel: "Prospect Card sections",
    mobileActionsLabel: "Mobile Prospect Card actions",
    contactLabels: {
      emails: "Emails",
      phones: "Phones",
      contactPages: "Contact pages",
      socialLinks: "Social links"
    },
    overview: {
      fitEvidence: "Fit evidence",
      confidence: "__COUNT__% confidence",
      topSignals: "Top website signals",
      shown: "__COUNT__ shown",
      bestFirstLine: "Best first line",
      highestLeverage: "Highest leverage",
      shortEmailPreview: "Short email preview",
      openEmail: "Open email"
    },
    signals: {
      title: "Website signals",
      findings: "__COUNT__ findings"
    },
    contacts: {
      title: "Contact paths",
      found: "__COUNT__ found"
    },
    outreach: {
      bestFirstLine: "Best first line",
      readyToPaste: "Ready to paste",
      angles: "Outreach angles",
      count: "__COUNT__ angles"
    },
    email: {
      title: "Short email"
    },
    sources: {
      title: "Source notes",
      count: "__COUNT__ sources",
      sourceLabel: "Source"
    },
    export: {
      panelLabel: "Export selected Prospect Card fields",
      title: "Export selected fields",
      selected: "__SELECTED__/__TOTAL__ selected",
      presetsLabel: "Export field presets",
      crmModesLabel: "CRM field naming mode",
      csvColumns: "CSV columns",
      columns: "__LABEL__ columns",
      copyCsvRow: "Copy CSV row",
      copySelected: "Copy selected fields",
      downloadCsv: "Download CSV",
      downloadFields: "Download fields",
      fields: {
        identity: "Company fields",
        fit: "Fit evidence",
        signals: "Website signals",
        contacts: "Contact paths",
        angles: "Outreach angles",
        firstLine: "First line",
        email: "Short email",
        sources: "Source notes"
      },
      presets: {
        crm: {
          label: "CRM export",
          description: "Company, fit, contacts, owner, stage, and source proof."
        },
        email: {
          label: "Email draft",
          description: "The first line, outreach angles, and short email only."
        },
        brief: {
          label: "Research brief",
          description: "A compact account brief with evidence, signals, and sources."
        }
      },
      crmModes: {
        hubspot: {
          label: "HubSpot",
          description: "Internal property names for company imports."
        },
        salesforce: {
          label: "Salesforce",
          description: "Account-style API field names with custom LeadCue fields."
        },
        pipedrive: {
          label: "Pipedrive",
          description: "Readable organization import labels."
        }
      }
    },
    pipeline: {
      panelLabel: "Prospect owner, stage, and notes",
      title: "Pipeline context",
      updated: "Updated __TIME__",
      notSavedYet: "Not saved yet",
      notes: "Notes",
      saveContext: "Save context",
      saveStateIdle: "Save changes to the workspace.",
      saveStateSaving: "Saving owner, stage, and notes...",
      saveStateSaved: "Owner, stage, and notes are saved.",
      saveStateError: "Could not save to workspace."
    },
    activity: {
      panelLabel: "Pipeline activity log",
      title: "Activity log",
      recent: "__COUNT__ recent",
      noChangesYet: "No changes yet",
      filterLabel: "Filter activity log by changed field",
      changed: "Changed __FIELDS__ · __TIME__",
      showDiff: "Show diff",
      hideDiff: "Hide diff",
      diffLabel: "Previous and current pipeline values",
      noMatch: "No activity matches this field filter.",
      empty: "Owner, stage, and notes changes will appear here after the first save."
    },
    copyMenu: {
      fullCard: "Copy full card",
      website: "Copy URL",
      cardLink: "Copy card link",
      firstLine: "Copy first line",
      signals: "Copy signals",
      contactPaths: "Copy contact paths",
      sourceNotes: "Copy source notes",
      selectedFields: "Copy selected fields"
    },
    actions: {
      copyEmail: "Copy email",
      export: "Export",
      copyLink: "Copy link",
      moreCopyActions: "More copy actions",
      save: "Save",
      saving: "Saving"
    },
    copyLabels: {
      company: "Company",
      fitScore: "Fit score",
      confidence: "Confidence",
      industry: "Industry",
      owner: "Owner",
      pipelineStage: "Pipeline stage",
      notes: "Notes",
      summary: "Summary",
      fitReason: "Fit reason",
      signals: "Signals",
      firstLine: "First line",
      shortEmail: "Short email",
      domain: "Domain",
      source: "Source",
      subjectLine: "Subject: Quick idea for __COMPANY__"
    }
  },
  icp: {
    editorEyebrow: "Scoring inputs",
    editorTitle: "Agency ICP",
    statusSaving: "Saving",
    statusSaved: "Saved",
    statusApplied: "Applied to new scans",
    fields: {
      serviceType: "Service type",
      tone: "Tone",
      targetIndustries: "Target industries",
      targetIndustriesHelp: "Comma separated. Used for fit scoring and outreach angle quality.",
      countries: "Countries",
      countriesHelp: "Comma separated. Leave broad if your team sells internationally.",
      offer: "Offer",
      firstTargetUrl: "First target URL"
    },
    serviceOptions: {
      web_design: "Web design",
      seo: "SEO",
      marketing: "Marketing",
      custom: "Custom"
    },
    toneOptions: {
      professional: "Professional",
      direct: "Direct",
      casual: "Casual"
    },
    actions: {
      save: "Save ICP",
      saving: "Saving ICP",
      reset: "Reset",
      test: "Test this ICP"
    },
    rules: {
      eyebrow: "How scoring works",
      title: "LeadCue ranks visible website evidence",
      items: {
        fit: {
          label: "Fit",
          copy: "Matches the agency focus, industry, country, and offer."
        },
        urgency: {
          label: "Urgency",
          copy: "Shows weak CTA paths, proof gaps, stale pages, or thin service positioning."
        },
        evidence: {
          label: "Evidence",
          copy: "Keeps source notes tied to the website observation."
        },
        actionability: {
          label: "Actionability",
          copy: "Produces a first line and angle a rep can actually use."
        }
      }
    },
    messages: {
      saved: "ICP saved. New scans will use this scoring profile.",
      saveFailed: "Unable to save ICP settings.",
      invalidFirstTargetUrl: "First target URL must be a valid http(s) URL."
    }
  },
  analytics: {
    overviewEyebrow: "Last 30 days",
    overviewTitle: "What the workspace is actually doing",
    kpis: {
      trackedEvents: "Tracked events",
      scansCompleted: "Scans completed",
      leadsSaved: "Leads saved",
      exportsCompleted: "Exports completed"
    },
    funnel: {
      eyebrow: "Research funnel",
      title: "From click to CRM handoff",
      ctaClicks: "CTA clicks",
      ctaClicksMeta: "Start free, tool CTA, pricing clicks",
      signups: "Signups",
      signupsMeta: "__PERCENT__ of CTA clicks",
      scans: "Scans",
      scansMeta: "__PERCENT__ of active users",
      exports: "Exports",
      exportsMeta: "__PERCENT__ of completed scans"
    },
    topPages: {
      eyebrow: "Top pages",
      title: "Where product-led traffic is concentrating",
      eventsSuffix: "__COUNT__ events"
    },
    topEvents: {
      eyebrow: "Top events",
      title: "What users are doing most",
      eventsSuffix: "__COUNT__ events"
    },
    recentEvents: {
      eyebrow: "Recent events",
      title: "Latest tracked activity",
      pageUnavailable: "page unavailable"
    },
    recommendations: {
      eyebrow: "What to do next",
      title: "Operator recommendations",
      toolPageCta:
        "Tool-page CTA clicks are healthy. Keep routing those users into signup with the same field template context.",
      exportsGap:
        "Exports are lower than scans, so the next bottleneck is likely qualification confidence or CRM handoff timing.",
      crmTemplateTraffic: "The CRM mapping template is pulling the most product-led traffic right now."
    },
    eventNames: {
      scan_completed: "Scan completed",
      product_tool_primary_click: "Product tool primary click",
      export_completed: "Export completed",
      auth_signup_completed: "Signup completed"
    },
    eventMetadata: {
      basicScanOneCredit: "basic scan, 1 credit",
      crmHubSpot: "CRM / HubSpot",
      hubSpotMappingCta: "HubSpot mapping CTA"
    }
  },
  account: {
    profile: {
      eyebrow: "Workspace profile",
      title: "Identity and ownership",
      statusSaving: "Saving",
      statusSaved: "Saved",
      statusEditable: "Editable",
      ownerName: "Owner name",
      ownerPlaceholder: "Alex Rivera",
      ownerHelp: "Shown in the workspace header and used for internal ownership context.",
      workspaceName: "Workspace name",
      workspacePlaceholder: "Northstar Outbound",
      workspaceHelp: "Used across the dashboard, billing, and account entry points.",
      save: "Save profile",
      saving: "Saving profile"
    },
    password: {
      eyebrow: "Password access",
      title: "Secure email sign-in",
      statusUpdating: "Updating",
      statusUpdated: "Updated",
      statusEnabled: "Enabled",
      currentPassword: "Current password",
      currentPlaceholder: "Required for existing passwords",
      currentHelp: "Leave blank only if this workspace has never set an email password before.",
      newPassword: "New password",
      newPlaceholder: "8+ characters",
      newHelp: "Use a workspace password your team can recover through the reset flow.",
      confirmPassword: "Confirm new password",
      confirmPlaceholder: "Repeat the new password",
      showFields: "Show password fields",
      showFieldsHelp: "Useful when the workspace owner is updating access for the first time.",
      update: "Update password",
      updating: "Updating password"
    },
    summary: {
      eyebrow: "Session summary",
      title: "What this workspace is using",
      signedInEmail: "Signed-in email",
      workspace: "Workspace",
      plan: "Plan",
      nextCreditReset: "Next credit reset",
      manageBilling: "Manage billing",
      signOut: "Sign out",
      demoPreview: "Demo preview"
    },
    messages: {
      signInProfile: "Sign in to update workspace profile details.",
      namesRequired: "Owner name and workspace name are both required.",
      profileSaved: "Workspace profile saved.",
      profileSaveFailed: "Unable to update workspace profile.",
      signInPassword: "Sign in to change the workspace password.",
      passwordMin: "Use at least 8 characters for the new password.",
      passwordMismatch: "The new password and confirmation need to match.",
      currentPasswordRequired: "Enter the current password before setting a new one.",
      currentPasswordIncorrect: "Current password is incorrect.",
      passwordUpdated: "Password updated.",
      passwordUpdateFailed: "Unable to update the password."
    }
  },
  billing: {
    usage: {
      eyebrow: "Credit balance",
      title: "__COUNT__ scans left",
      summary:
        "__USED__ credits used this month on the __PLAN__ plan. Credits are charged only when a scan creates and saves a usable Prospect Card."
    },
    kpis: {
      subscription: "Subscription",
      creditReset: "Credit reset",
      billingPeriodEnd: "Billing period end"
    },
    meterLabel: "Monthly credit usage",
    actions: {
      manageBilling: "Manage billing",
      exportCsv: "Export CSV",
      exportCurrentFields: "Export current fields",
      faq: "Billing FAQ"
    },
    plans: {
      eyebrow: "Plan path",
      title: "Scale credits without changing the workflow",
      currentPlan: "Current plan",
      choosePlan: "Choose __PLAN__",
      scansPerMonth: "__COUNT__ scans / month",
      useCases: {
        free: "Validate the workflow with real websites before a paid rollout.",
        starter: "Best for one operator building a weekly outbound habit.",
        pro: "Best for agencies turning prospect research into a repeatable pipeline.",
        agency: "Best for teams sharing scan credits across multiple client offers."
      }
    },
    policy: {
      eyebrow: "Credit policy",
      title: "No charge on failed scans",
      validation: "Validation errors use 0 credits.",
      access: "Website access or generation failures use 0 credits.",
      duplicate: "Duplicate retries use an idempotency key to prevent double charging.",
      basic: "Basic scans charge 1 credit only after a Prospect Card is saved.",
      deep: "Deep scans charge 3 credits only after a Prospect Card is saved."
    },
    status: {
      eyebrow: "Account status",
      title: "Know why the workspace can or cannot scan",
      workspaceStatus: "Workspace status",
      authenticated: "Authenticated",
      demoPreview: "Demo preview",
      subscriptionState: "Subscription state",
      remainingCredits: "Remaining credits",
      exportMode: "Export mode",
      nextStep: "Next step"
    },
    subscriptionDetails: {
      active: {
        summary: "Scans and exports are available on the current plan.",
        nextStep: "Keep qualifying accounts, then upgrade only when scan volume is the real bottleneck."
      },
      trialing: {
        summary: "The workspace has access right now, but the trial period will need a billing decision soon.",
        nextStep: "Use this window to validate scan quality, save rate, and export handoff."
      },
      pendingCheckout: {
        summary: "The plan change has started, but checkout still needs to be completed.",
        nextStep: "Finish the Stripe checkout to unlock the paid credit allowance."
      },
      configurationRequired: {
        summary: "The workspace selected a paid plan before billing was fully configured in this environment.",
        nextStep: "Contact support or finish the Stripe configuration before relying on paid-plan access."
      },
      pastDue: {
        summary: "Billing needs attention before the workspace can rely on uninterrupted paid access.",
        nextStep: "Open the billing portal and update the payment method or invoice status."
      },
      canceled: {
        summary: "The paid subscription is no longer active for future periods.",
        nextStep: "Restart checkout if the team still needs higher monthly scan volume."
      },
      fallbackSummary: "This subscription state needs review before rollout.",
      fallbackNextStep: "Open billing details or contact support if the status does not match the expected plan."
    },
    scanHistory: {
      eyebrow: "Scan audit",
      title: "History",
      records: "__COUNT__ records",
      filtersLabel: "Scan history filters",
      secondaryFiltersLabel: "Scan history secondary filters",
      dateRange: "Date range",
      failureReason: "Failure reason",
      allFailureReasons: "All failure reasons",
      clearSecondaryFilters: "Clear date/reason",
      matchingRecords: "__COUNT__ matching records",
      failureBreakdownLabel: "Failed scan reason breakdown",
      failedScans: "Failed scans",
      noFailedScans: "No failed scans in this audit window.",
      listLabel: "Scan history audit records",
      creditsCharged: "credits charged",
      hide: "Hide",
      details: "Details",
      scanId: "Scan ID",
      idempotencyKey: "Idempotency key",
      leadId: "Lead ID",
      completed: "Completed",
      prospectCard: "Prospect Card",
      openLeadDetail: "Open lead detail",
      notRecorded: "Not recorded",
      noLeadSaved: "No lead saved",
      notCompleted: "Not completed",
      failedNote: "No credit was used. Fix the URL and try again.",
      replayedNote: "Network retry returned the saved scan result without another credit charge.",
      successNote: "Credit was charged only after a usable Prospect Card was saved.",
      emptyFilteredTitle: "No matching scans.",
      emptyFilteredCopy: "Change the filter to review the rest of the audit trail.",
      emptyTitle: "No scan history yet.",
      emptyCopy: "Completed, failed, and replayed scan records will appear here as an audit trail.",
      scanTypes: {
        basic: "Basic",
        deep: "Deep"
      }
    }
  }
};

export type AppUiExtra = WidenStrings<typeof en>;
export type AppUiExtraOverride = DeepPartial<AppUiExtra>;

const zh: AppUiExtra = {
  common: {
    loading: "加载中",
    sample: "示例",
    live: "实时",
    save: "保存",
    saving: "保存中...",
    saved: "已保存",
    reset: "重置",
    search: "搜索",
    sort: "排序",
    filter: "筛选",
    clearFilters: "清空筛选",
    clearSelection: "清空选择",
    clearVisible: "清空当前可见项",
    selectVisible: "选择当前可见项",
    exportSelected: "导出所选",
    exporting: "导出中...",
    copy: "复制",
    copied: "已复制",
    failed: "失败",
    downloaded: "已下载",
    close: "关闭",
    open: "打开",
    hide: "收起",
    details: "详情",
    previous: "之前",
    current: "当前",
    editable: "可编辑",
    enabled: "已启用",
    updating: "更新中",
    updated: "已更新",
    notSet: "未设置",
    unknownTime: "时间未知",
    unassigned: "未分配",
    empty: "空",
    none: "无",
    noneFound: "未找到",
    noData: "无数据",
    placeholders: {
      prospectUrl: "https://prospect.example.com",
      companyName: "Northstar Analytics",
      leadSearch: "公司、域名或行业",
      assignTeammate: "分配给团队成员",
      nextAction: "添加客户角度、阻碍因素或下一步动作。"
    },
    messages: {
      demoPreviewIntro: "当前为演示预览。创建工作空间后即可保存潜客并跟踪积分使用。",
      sampleWorkspaceData: "__ERROR__ 当前显示示例工作空间数据。",
      sampleWorkspaceDataPlain: "当前显示示例工作空间数据。",
      billingActiveSetup: "订阅已生效。请先完成下面的首次设置。",
      workspaceCreatedSetup: "工作空间已创建。请先完成下面的首次设置。",
      signedIn: "已登录。",
      scanDeskLoaded: "__URL__ 已载入扫描台。检查备注后即可开始扫描。",
      scanDeskMissingTarget: "在扫描台中添加目标网站，即可创建第一张已保存的潜在客户卡片。",
      samePlan: "你当前已经在 __PLAN__ 套餐中。",
      checkoutUnavailable: "当前套餐暂时无法发起结账。",
      leadDetailUnavailable: "无法加载线索详情。",
      scanInvalidUrl: "请输入有效的潜在客户网站 URL。不会扣除积分，请修正后重试。",
      scanSaved: "__COMPANY__ 已保存为潜在客户卡片。本次使用积分：__COUNT__。",
      scanComplete: "扫描完成。请先查看潜在客户卡片，再决定导出或撰写外联内容。",
      scanFailed: "扫描失败。未扣除积分，请修正网址后重试。",
      onboardingDismissed: "已关闭设置引导。",
      onboardingUpdateFailed: "无法更新引导状态。",
      csvExportPrepared: "CSV 已准备完成，包含 __LABEL__ 字段。",
      csvExportFailed: "CSV 导出失败。",
      billingPortalUnavailable: "账单门户暂时不可用。",
      signedOutDemo: "已退出登录，当前显示演示预览。",
      selectLeadBeforeExport: "请先选择至少一条线索再导出。",
      selectedLeadExported: "已导出 __COUNT__ 条所选线索，包含 __LABEL__ 字段。",
      selectedLeadExportFailed: "所选线索导出失败。",
      signInRequired: "请先登录再继续。",
      workspaceNotFound: "未找到工作空间。",
      subscriptionInactive: "当前订阅未激活。请先更新账单后再继续扫描网站。",
      insufficientCredits: "当前工作空间的扫描积分不足，无法完成这个请求。",
      createFirstSavedCard: "登录后可通过 Chrome 扩展或 POST /api/scans 创建第一张已保存卡片。"
    }
  },
  options: {
    leadSort: {
      newest: "最新保存",
      fit_desc: "匹配度",
      confidence_desc: "置信度",
      company_asc: "公司 A-Z"
    },
    scanHistoryFilters: {
      all: "全部",
      completed: "已完成",
      failed: "失败",
      replayed: "重放",
      processing: "处理中"
    },
    historyDateFilters: {
      all: "全部日期",
      today: "今天",
      "7d": "最近 7 天",
      "30d": "最近 30 天"
    },
    prospectCardTabs: {
      overview: "概览",
      signals: "信号",
      contacts: "联系路径",
      outreach: "外联",
      email: "邮件",
      sources: "来源",
      export: "导出"
    },
    pipelineStages: {
      researching: "调研中",
      qualified: "已合格",
      outreach_queued: "待外联",
      contacted: "已联系",
      won: "已赢单",
      archived: "已归档"
    },
    activityFields: {
      all: "全部",
      owner: "负责人",
      stage: "阶段",
      notes: "备注"
    },
    serviceTypes: {
      web_design: "网站设计 / 改版",
      seo: "SEO 代理服务",
      marketing: "增长 / 营销",
      founder: "创始人主导外联",
      custom: "自定义",
      unknown: "未设置"
    },
    tones: {
      professional: "专业",
      direct: "直接",
      casual: "轻松",
      unknown: "未设置"
    },
    signalCategories: {
      web_design: "网站设计",
      seo: "SEO",
      marketing: "营销",
      timing: "时机"
    },
    subscriptionStatuses: {
      active: "已生效",
      trialing: "试用中",
      pending_checkout: "待完成结账",
      configuration_required: "需要配置账单",
      past_due: "已逾期",
      canceled: "已取消"
    },
    historyReasons: {
      validation_failed: "校验失败",
      workspace_unavailable: "工作空间不可用",
      subscription_inactive: "订阅未激活",
      insufficient_credits: "积分不足",
      idempotency_conflict: "幂等冲突",
      duplicate_in_progress: "重复请求处理中",
      generation_failed: "生成失败",
      persistence_failed: "保存失败",
      replayed: "重放",
      processing: "处理中",
      unknown: "未知原因"
    }
  },
  dashboard: {
    onboarding: {
      eyebrow: "初次设置",
      welcomeTitle: "欢迎，__NAME__。",
      workspaceReadyTitle: "工作空间已就绪，__NAME__。",
      intro: "LeadCue 已为你准备好套餐与评分默认值。完成一次扫描后，即可开始保存潜客卡片和可导出的备注。",
      progress: "__COUNT__/3 已完成",
      markComplete: "标记完成",
      checklistLabel: "工作空间引导清单",
      setupSnapshot: "设置概览",
      service: "服务",
      industries: "行业",
      firstTarget: "首个目标",
      prepareFirstScan: "准备首次扫描",
      runFirstScan: "执行首次扫描",
      reviewIcp: "查看 ICP",
      tasks: {
        profileSaved: "目标配置已保存",
        firstWebsiteQueued: "首个网站已排队",
        firstProspectCard: "首张潜在客户卡片"
      },
      descriptions: {
        profileSaved: "评分已针对 __INDUSTRIES__ 完成调优。",
        profileTodo: "请先定义 LeadCue 评分所依据的服务说明与目标行业。",
        websiteQueued: "准备扫描：__URL__",
        agencySaved: "已保存代理网站：__URL__",
        websiteTodo: "当团队准备开始扫描时，在这里添加首个目标网站。",
        firstCardDone: "工作空间中已存在 __COUNT__ 条已保存潜客。",
        firstCardTodo: "运行第一次网站扫描，即可生成已保存的潜在客户卡片和可导出备注。"
      }
    },
    metrics: {
      ariaLabel: "工作空间指标",
      savedProspects: "已保存的潜在客户",
      currentPlan: "当前套餐",
      creditsLeft: "剩余积分",
      subscription: "订阅状态",
      usedThisMonth: "本月已使用 __COUNT__"
    },
    leadsPanel: {
      eyebrow: "线索列表",
      title: "已保存的潜在客户",
      company: "公司",
      industry: "行业",
      fit: "匹配度",
      confidence: "置信度",
      emptyTitle: "暂无已保存的潜在客户。",
      emptyCopy: "通过扩展或 API 运行网站扫描后，已保存的潜在客户卡片会显示在这里。",
      filterLabel: "筛选线索",
      tableLabel: "已保存线索"
    },
    emptyProspect: {
      eyebrow: "潜在客户卡片",
      title: "你的第一张已保存卡片会显示在这里",
      copy: "扫描完成后，LeadCue 会保存匹配度、网站证据、外联角度、破冰话术以及导出备注。",
      cta: "准备首次扫描"
    },
    icpPanel: {
      eyebrow: "ICP 设置",
      title: "代理商模式",
      serviceType: "服务类型",
      targetIndustries: "目标行业",
      countries: "国家",
      tone: "话术风格",
      firstTarget: "首个目标"
    },
    signalPanel: {
      eyebrow: "信号",
      title: "当前扫描分布"
    }
  },
  leads: {
    eyebrow: "已保存账户",
    title: "潜在客户库",
    controlsLabel: "潜在客户库控制项",
    searchLabel: "搜索",
    sortLabel: "排序",
    minFit: "最低匹配度",
    minConfidence: "最低置信度",
    resultsSummary: "显示 __VISIBLE__ / __TOTAL__ 条潜在客户",
    selectedCount: "已选择 __COUNT__ 条",
    selectedReadyCopy: "只导出团队已准备跟进的账户。",
    selectedEmptyCopy: "选择潜在客户后可导出聚焦版 CSV。",
    templateLabel: "模板",
    crmFieldsLabel: "CRM 字段",
    tableLabel: "已保存的潜在客户",
    selectAllVisible: "选择当前可见的全部潜在客户",
    clearAllVisible: "取消当前可见的全部潜在客户",
    selectLead: "选择 __COMPANY__",
    openProspectCard: "打开 __COMPANY__ 的潜在客户卡片",
    noMatchingTitle: "没有匹配的潜在客户。",
    noSavedTitle: "暂无已保存的潜在客户。",
    noMatchingCopy: "放宽搜索条件或分数筛选，查看更多账户。",
    noSavedCopy: "运行网站扫描后即可创建第一张已保存的潜在客户卡片。",
    drawerLabel: "当前选中线索的潜在客户卡片",
    drawerEyebrow: "已选线索",
    drawerTitle: "完整潜在客户卡片",
    drawerLoadingLabel: "正在加载潜在客户卡片",
    drawerCloseLabel: "关闭潜在客户卡片",
    drawerNoSelection: "未选择",
    drawerFitLabel: "__SCORE__ 匹配度",
    errorShowingPreview: "完整详情加载失败，当前显示列表预览。",
    detailEmptyTitle: "选择一条线索",
    detailEmptyCopy: "点击任意已保存账户，即可查看完整潜在客户卡片，包括带来源的信号与邮件文案。"
  },
  prospectCard: {
    eyebrow: "潜在客户卡片",
    summaryLabel: "潜在客户摘要",
    fitLabel: "匹配度",
    website: "网站",
    industry: "行业",
    confidence: "置信度",
    status: "状态",
    owner: "负责人",
    stage: "阶段",
    sectionsLabel: "潜在客户卡片分区",
    mobileActionsLabel: "移动端潜在客户卡片操作",
    contactLabels: {
      emails: "邮箱",
      phones: "电话",
      contactPages: "联系页面",
      socialLinks: "社交链接"
    },
    overview: {
      fitEvidence: "匹配依据",
      confidence: "__COUNT__% 置信度",
      topSignals: "核心网站信号",
      shown: "显示 __COUNT__ 条",
      bestFirstLine: "最佳破冰话术",
      highestLeverage: "优先使用",
      shortEmailPreview: "短邮件预览",
      openEmail: "打开邮件"
    },
    signals: {
      title: "网站信号",
      findings: "__COUNT__ 条发现"
    },
    contacts: {
      title: "联系路径",
      found: "找到 __COUNT__ 项"
    },
    outreach: {
      bestFirstLine: "最佳破冰话术",
      readyToPaste: "可直接复制",
      angles: "外联角度",
      count: "__COUNT__ 个角度"
    },
    email: {
      title: "短邮件"
    },
    sources: {
      title: "来源备注",
      count: "__COUNT__ 条来源",
      sourceLabel: "来源"
    },
    export: {
      panelLabel: "导出所选潜在客户卡片字段",
      title: "导出所选字段",
      selected: "已选择 __SELECTED__/__TOTAL__",
      presetsLabel: "导出字段预设",
      crmModesLabel: "CRM 字段命名方式",
      csvColumns: "CSV 列",
      columns: "__LABEL__ 列",
      copyCsvRow: "复制 CSV 行",
      copySelected: "复制所选字段",
      downloadCsv: "下载 CSV",
      downloadFields: "下载字段",
      fields: {
        identity: "公司字段",
        fit: "匹配依据",
        signals: "网站信号",
        contacts: "联系路径",
        angles: "外联角度",
        firstLine: "破冰话术",
        email: "短邮件",
        sources: "来源备注"
      },
      presets: {
        crm: {
          label: "CRM 导出",
          description: "包含公司、匹配度、联系人、负责人、阶段与来源依据。"
        },
        email: {
          label: "邮件草稿",
          description: "仅包含破冰话术、外联角度和短邮件。"
        },
        brief: {
          label: "研究摘要",
          description: "紧凑展示账户摘要、证据、信号与来源。"
        }
      },
      crmModes: {
        hubspot: {
          label: "HubSpot",
          description: "适用于公司导入的内部属性名。"
        },
        salesforce: {
          label: "Salesforce",
          description: "账户风格 API 字段名，包含自定义 LeadCue 字段。"
        },
        pipedrive: {
          label: "Pipedrive",
          description: "适合组织导入的可读标签。"
        }
      }
    },
    pipeline: {
      panelLabel: "潜在客户负责人、阶段与备注",
      title: "流程上下文",
      updated: "__TIME__ 已更新",
      notSavedYet: "尚未保存",
      notes: "备注",
      saveContext: "保存上下文",
      saveStateIdle: "将修改保存到工作空间。",
      saveStateSaving: "正在保存负责人、阶段和备注...",
      saveStateSaved: "负责人、阶段和备注已保存。",
      saveStateError: "无法保存到工作空间。"
    },
    activity: {
      panelLabel: "流程活动日志",
      title: "活动日志",
      recent: "最近 __COUNT__ 条",
      noChangesYet: "暂无变更",
      filterLabel: "按变更字段筛选活动日志",
      changed: "变更项：__FIELDS__ · __TIME__",
      showDiff: "查看差异",
      hideDiff: "收起差异",
      diffLabel: "前后流程值对比",
      noMatch: "当前字段筛选下没有活动记录。",
      empty: "首次保存后，这里会显示负责人、阶段与备注的变更。"
    },
    copyMenu: {
      fullCard: "复制完整卡片",
      website: "复制网址",
      cardLink: "复制卡片链接",
      firstLine: "复制破冰话术",
      signals: "复制信号",
      contactPaths: "复制联系路径",
      sourceNotes: "复制来源备注",
      selectedFields: "复制所选字段"
    },
    actions: {
      copyEmail: "复制邮件",
      export: "导出",
      copyLink: "复制链接",
      moreCopyActions: "更多复制操作",
      save: "保存",
      saving: "保存中"
    },
    copyLabels: {
      company: "公司",
      fitScore: "匹配度",
      confidence: "置信度",
      industry: "行业",
      owner: "负责人",
      pipelineStage: "阶段",
      notes: "备注",
      summary: "摘要",
      fitReason: "匹配原因",
      signals: "信号",
      firstLine: "破冰话术",
      shortEmail: "短邮件",
      domain: "域名",
      source: "来源",
      subjectLine: "主题：给 __COMPANY__ 的一个想法"
    }
  },
  icp: {
    editorEyebrow: "评分输入",
    editorTitle: "代理商 ICP",
    statusSaving: "保存中",
    statusSaved: "已保存",
    statusApplied: "已应用到新扫描",
    fields: {
      serviceType: "服务类型",
      tone: "话术风格",
      targetIndustries: "目标行业",
      targetIndustriesHelp: "使用逗号分隔。用于匹配评分和外联角度质量。",
      countries: "国家",
      countriesHelp: "使用逗号分隔。如果团队面向国际销售，可保持宽泛。",
      offer: "服务说明",
      firstTargetUrl: "首个目标网址"
    },
    serviceOptions: {
      web_design: "网站设计",
      seo: "SEO",
      marketing: "营销",
      custom: "自定义"
    },
    toneOptions: {
      professional: "专业",
      direct: "直接",
      casual: "轻松"
    },
    actions: {
      save: "保存 ICP",
      saving: "正在保存 ICP",
      reset: "重置",
      test: "测试此 ICP"
    },
    rules: {
      eyebrow: "评分规则",
      title: "LeadCue 会根据可见的网站证据进行排序",
      items: {
        fit: {
          label: "匹配度",
          copy: "匹配代理方向、行业、国家和服务说明。"
        },
        urgency: {
          label: "紧迫度",
          copy: "识别 CTA 弱、证明不足、页面陈旧或服务定位薄弱的迹象。"
        },
        evidence: {
          label: "证据",
          copy: "让来源备注始终绑定到具体的网站观察。"
        },
        actionability: {
          label: "可执行性",
          copy: "产出销售能直接使用的破冰话术和外联角度。"
        }
      }
    },
    messages: {
      saved: "ICP 已保存。后续新扫描会使用这套评分配置。",
      saveFailed: "无法保存 ICP 设置。",
      invalidFirstTargetUrl: "首个目标网址必须是有效的 http(s) 链接。"
    }
  },
  analytics: {
    overviewEyebrow: "最近 30 天",
    overviewTitle: "工作空间的实际运行情况",
    kpis: {
      trackedEvents: "追踪事件",
      scansCompleted: "已完成扫描",
      leadsSaved: "已保存线索",
      exportsCompleted: "已完成导出"
    },
    funnel: {
      eyebrow: "研究漏斗",
      title: "从点击到 CRM 交接",
      ctaClicks: "CTA 点击",
      ctaClicksMeta: "开始免费、工具 CTA、价格点击",
      signups: "注册",
      signupsMeta: "占 CTA 点击的 __PERCENT__",
      scans: "扫描",
      scansMeta: "占活跃用户的 __PERCENT__",
      exports: "导出",
      exportsMeta: "占已完成扫描的 __PERCENT__"
    },
    topPages: {
      eyebrow: "热门页面",
      title: "产品驱动流量集中在哪些页面",
      eventsSuffix: "__COUNT__ 次事件"
    },
    topEvents: {
      eyebrow: "热门事件",
      title: "用户最常进行的动作",
      eventsSuffix: "__COUNT__ 次事件"
    },
    recentEvents: {
      eyebrow: "最近事件",
      title: "最新追踪活动",
      pageUnavailable: "页面不可用"
    },
    recommendations: {
      eyebrow: "下一步建议",
      title: "运营建议",
      toolPageCta: "工具页 CTA 点击表现不错，继续把这批用户以相同字段模板场景引导到注册流程。",
      exportsGap: "导出量低于扫描量，下一个瓶颈很可能是资格判断信心或 CRM 交接时机。",
      crmTemplateTraffic: "CRM 字段映射模板目前带来了最多的产品驱动流量。"
    },
    eventNames: {
      scan_completed: "扫描完成",
      product_tool_primary_click: "产品工具主按钮点击",
      export_completed: "导出完成",
      auth_signup_completed: "注册完成"
    },
    eventMetadata: {
      basicScanOneCredit: "基础扫描，1 积分",
      crmHubSpot: "CRM / HubSpot",
      hubSpotMappingCta: "HubSpot 映射 CTA"
    }
  },
  account: {
    profile: {
      eyebrow: "工作空间资料",
      title: "身份与归属",
      statusSaving: "保存中",
      statusSaved: "已保存",
      statusEditable: "可编辑",
      ownerName: "负责人姓名",
      ownerPlaceholder: "Alex Rivera",
      ownerHelp: "显示在工作空间头部，并用于内部负责人上下文。",
      workspaceName: "工作空间名称",
      workspacePlaceholder: "Northstar Outbound",
      workspaceHelp: "会用于仪表盘、账单和账户入口等位置。",
      save: "保存资料",
      saving: "保存资料中"
    },
    password: {
      eyebrow: "密码访问",
      title: "安全的邮箱登录",
      statusUpdating: "更新中",
      statusUpdated: "已更新",
      statusEnabled: "已启用",
      currentPassword: "当前密码",
      currentPlaceholder: "已有密码时必填",
      currentHelp: "只有当该工作空间从未设置过邮箱密码时，才可留空。",
      newPassword: "新密码",
      newPlaceholder: "至少 8 个字符",
      newHelp: "请使用团队可通过重置流程找回的工作空间密码。",
      confirmPassword: "确认新密码",
      confirmPlaceholder: "再次输入新密码",
      showFields: "显示密码字段",
      showFieldsHelp: "适合负责人首次为工作空间配置访问方式时使用。",
      update: "更新密码",
      updating: "更新密码中"
    },
    summary: {
      eyebrow: "会话概览",
      title: "当前工作空间的使用情况",
      signedInEmail: "当前登录邮箱",
      workspace: "工作空间",
      plan: "套餐",
      nextCreditReset: "下次积分重置",
      manageBilling: "管理账单",
      signOut: "退出登录",
      demoPreview: "演示预览"
    },
    messages: {
      signInProfile: "请先登录再更新工作空间资料。",
      namesRequired: "负责人姓名和工作空间名称都不能为空。",
      profileSaved: "工作空间资料已保存。",
      profileSaveFailed: "无法更新工作空间资料。",
      signInPassword: "请先登录再修改工作空间密码。",
      passwordMin: "新密码至少需要 8 个字符。",
      passwordMismatch: "新密码和确认密码必须一致。",
      currentPasswordRequired: "设置新密码前，请先输入当前密码。",
      currentPasswordIncorrect: "当前密码不正确。",
      passwordUpdated: "密码已更新。",
      passwordUpdateFailed: "无法更新密码。"
    }
  },
  billing: {
    usage: {
      eyebrow: "积分余额",
      title: "剩余 __COUNT__ 次扫描",
      summary: "__USED__ 积分已在本月 __PLAN__ 套餐中使用。只有当扫描生成并保存了可用的潜在客户卡片后才会扣费。"
    },
    kpis: {
      subscription: "订阅状态",
      creditReset: "积分重置时间",
      billingPeriodEnd: "账单周期结束"
    },
    meterLabel: "本月积分使用量",
    actions: {
      manageBilling: "管理账单",
      exportCsv: "导出 CSV",
      exportCurrentFields: "导出当前字段",
      faq: "账单常见问题"
    },
    plans: {
      eyebrow: "套餐路径",
      title: "在不改变流程的情况下扩展积分",
      currentPlan: "当前套餐",
      choosePlan: "选择 __PLAN__",
      scansPerMonth: "每月 __COUNT__ 次扫描",
      useCases: {
        free: "先用真实网站验证流程，再决定是否付费扩展。",
        starter: "适合单人运营者建立每周固定的外联节奏。",
        pro: "适合将潜客研究沉淀为可复用流程的代理商。",
        agency: "适合在多个客户服务之间共享扫描积分的团队。"
      }
    },
    policy: {
      eyebrow: "积分规则",
      title: "失败扫描不扣费",
      validation: "校验错误不会消耗积分。",
      access: "网站访问失败或生成失败不会消耗积分。",
      duplicate: "重复重试会通过幂等键防止重复扣费。",
      basic: "基础扫描只有在保存潜在客户卡片后才会扣 1 积分。",
      deep: "深度扫描只有在保存潜在客户卡片后才会扣 3 积分。"
    },
    status: {
      eyebrow: "账户状态",
      title: "了解工作空间当前能否继续扫描",
      workspaceStatus: "工作空间状态",
      authenticated: "已认证",
      demoPreview: "演示预览",
      subscriptionState: "订阅状态",
      remainingCredits: "剩余积分",
      exportMode: "导出模式",
      nextStep: "下一步"
    },
    subscriptionDetails: {
      active: {
        summary: "当前套餐已可正常进行扫描和导出。",
        nextStep: "继续筛选账户，只有在扫描量真正成为瓶颈时再升级。"
      },
      trialing: {
        summary: "工作空间当前可用，但试用期很快需要做出账单决策。",
        nextStep: "趁试用期验证扫描质量、保存率和导出交接效果。"
      },
      pendingCheckout: {
        summary: "套餐变更已发起，但仍需完成结账。",
        nextStep: "完成 Stripe 结账后即可解锁付费积分额度。"
      },
      configurationRequired: {
        summary: "该工作空间已选择付费套餐，但当前环境中的账单配置尚未完成。",
        nextStep: "在依赖付费套餐前，请联系支持或先完成 Stripe 配置。"
      },
      pastDue: {
        summary: "账单需要处理，否则工作空间无法稳定依赖付费访问。",
        nextStep: "打开账单门户，更新付款方式或处理发票状态。"
      },
      canceled: {
        summary: "付费订阅已不再覆盖未来周期。",
        nextStep: "如果团队仍需要更高的月扫描量，请重新发起结账。"
      },
      fallbackSummary: "这个订阅状态需要在正式使用前再确认一次。",
      fallbackNextStep: "如果状态与预期套餐不一致，请打开账单详情或联系支持。"
    },
    scanHistory: {
      eyebrow: "扫描审计",
      title: "历史记录",
      records: "__COUNT__ 条记录",
      filtersLabel: "扫描历史筛选",
      secondaryFiltersLabel: "扫描历史二级筛选",
      dateRange: "日期范围",
      failureReason: "失败原因",
      allFailureReasons: "全部失败原因",
      clearSecondaryFilters: "清除日期/原因",
      matchingRecords: "__COUNT__ 条匹配记录",
      failureBreakdownLabel: "失败扫描原因分布",
      failedScans: "失败扫描",
      noFailedScans: "当前审计窗口内没有失败扫描。",
      listLabel: "扫描历史审计记录",
      creditsCharged: "已扣积分",
      hide: "收起",
      details: "详情",
      scanId: "扫描 ID",
      idempotencyKey: "幂等键",
      leadId: "线索 ID",
      completed: "完成时间",
      prospectCard: "潜在客户卡片",
      openLeadDetail: "打开线索详情",
      notRecorded: "未记录",
      noLeadSaved: "未保存线索",
      notCompleted: "未完成",
      failedNote: "未扣除积分。修正网址后可再次尝试。",
      replayedNote: "网络重试直接返回了已保存的扫描结果，没有再次扣费。",
      successNote: "只有在保存了可用的潜在客户卡片后才会扣除积分。",
      emptyFilteredTitle: "没有匹配的扫描记录。",
      emptyFilteredCopy: "调整筛选条件即可查看其余审计记录。",
      emptyTitle: "暂无扫描历史。",
      emptyCopy: "已完成、失败和重放的扫描记录都会在这里作为审计轨迹出现。",
      scanTypes: {
        basic: "基础",
        deep: "深度"
      }
    }
  }
};

const ja: AppUiExtraOverride = {
  common: {
    loading: "読み込み中",
    sample: "サンプル",
    live: "ライブ",
    save: "保存",
    saving: "保存中...",
    saved: "保存済み",
    reset: "リセット",
    search: "検索",
    sort: "並び替え",
    filter: "絞り込み",
    clearFilters: "絞り込みをクリア",
    clearSelection: "選択をクリア",
    clearVisible: "表示中をクリア",
    selectVisible: "表示中を選択",
    exportSelected: "選択をエクスポート",
    exporting: "エクスポート中...",
    copy: "コピー",
    copied: "コピー済み",
    failed: "失敗",
    downloaded: "ダウンロード済み",
    close: "閉じる",
    open: "開く",
    hide: "非表示",
    details: "詳細",
    previous: "前回",
    current: "現在",
    editable: "編集可能",
    enabled: "有効",
    updating: "更新中",
    updated: "更新済み",
    notSet: "未設定",
    unknownTime: "時刻不明",
    unassigned: "未割り当て",
    empty: "空",
    none: "なし",
    noneFound: "見つかりません",
    noData: "データなし",
    messages: {
      demoPreviewIntro: "デモプレビューです。ワークスペースを作成すると、見込み客の保存とクレジット追跡ができます。",
      billingActiveSetup: "請求は有効です。下の初期設定を完了してください。",
      workspaceCreatedSetup: "ワークスペースが作成されました。下の初期設定を完了してください。",
      signedIn: "ログインしました。",
      samePlan: "現在すでに __PLAN__ プランです。",
      checkoutUnavailable: "現在このプランではチェックアウトを利用できません。",
      leadDetailUnavailable: "リード詳細を読み込めません。",
      scanInvalidUrl:
        "有効な見込み客サイト URL を入力してください。クレジットは消費されませんでした。URL を修正して再試行してください。",
      scanComplete: "スキャンが完了しました。エクスポートやメール作成の前に Prospect Card を確認してください。",
      scanFailed:
        "スキャンに失敗しました。クレジットは消費されませんでした。URL を修正して再試行してください。",
      csvExportFailed: "CSV エクスポートに失敗しました。",
      billingPortalUnavailable: "請求ポータルはまだ利用できません。",
      signedOutDemo: "ログアウトしました。デモプレビューを表示しています。",
      signInRequired: "続行するにはログインしてください。",
      workspaceNotFound: "ワークスペースが見つかりません。",
      subscriptionInactive: "サブスクリプションが有効ではありません。サイトをさらにスキャンする前に請求を更新してください。",
      insufficientCredits: "このリクエストに必要なスキャンクレジットがワークスペースにありません。"
    }
  },
  options: {
    leadSort: {
      newest: "新しい順",
      fit_desc: "適合度",
      confidence_desc: "信頼度",
      company_asc: "会社名 A-Z"
    },
    scanHistoryFilters: {
      all: "すべて",
      completed: "完了",
      failed: "失敗",
      replayed: "再取得",
      processing: "処理中"
    },
    historyDateFilters: {
      all: "すべての日付",
      today: "今日",
      "7d": "過去 7 日",
      "30d": "過去 30 日"
    },
    prospectCardTabs: {
      overview: "概要",
      signals: "シグナル",
      contacts: "連絡先",
      outreach: "アウトリーチ",
      email: "メール",
      sources: "ソース",
      export: "エクスポート"
    },
    pipelineStages: {
      researching: "調査中",
      qualified: "適格",
      outreach_queued: "連絡待ち",
      contacted: "連絡済み",
      won: "成約",
      archived: "アーカイブ"
    },
    activityFields: {
      all: "すべて",
      owner: "担当者",
      stage: "ステージ",
      notes: "メモ"
    },
    serviceTypes: {
      web_design: "ウェブデザイン / リニューアル",
      seo: "SEO エージェンシー",
      marketing: "グロース / マーケティング",
      founder: "創業者主導のアウトバウンド",
      custom: "カスタム",
      unknown: "未設定"
    },
    tones: {
      professional: "プロフェッショナル",
      direct: "率直",
      casual: "カジュアル",
      unknown: "未設定"
    },
    signalCategories: {
      web_design: "ウェブデザイン",
      seo: "SEO",
      marketing: "マーケティング",
      timing: "タイミング"
    },
    subscriptionStatuses: {
      active: "有効",
      trialing: "トライアル中",
      pending_checkout: "チェックアウト保留",
      configuration_required: "請求設定が必要",
      past_due: "支払い遅延",
      canceled: "キャンセル済み"
    },
    historyReasons: {
      validation_failed: "検証失敗",
      workspace_unavailable: "ワークスペース利用不可",
      subscription_inactive: "サブスクリプション無効",
      insufficient_credits: "クレジット不足",
      idempotency_conflict: "冪等性の競合",
      duplicate_in_progress: "重複処理中",
      generation_failed: "生成失敗",
      persistence_failed: "保存失敗",
      replayed: "再取得",
      processing: "処理中",
      unknown: "不明な理由"
    }
  },
  dashboard: {
    onboarding: {
      eyebrow: "初期設定",
      progress: "__COUNT__/3 完了",
      markComplete: "完了としてマーク",
      setupSnapshot: "設定概要",
      service: "サービス",
      industries: "業種",
      firstTarget: "最初の対象",
      prepareFirstScan: "最初のスキャンを準備",
      runFirstScan: "最初のスキャンを実行",
      reviewIcp: "ICP を確認"
    },
    metrics: {
      ariaLabel: "ワークスペース指標",
      savedProspects: "保存済み見込み客",
      currentPlan: "現在のプラン",
      creditsLeft: "残りクレジット",
      subscription: "サブスクリプション",
      usedThisMonth: "今月 __COUNT__ 使用"
    },
    leadsPanel: {
      eyebrow: "リード一覧",
      title: "保存済み見込み客",
      company: "会社",
      industry: "業界",
      fit: "適合",
      confidence: "信頼度",
      emptyTitle: "保存済み見込み客はまだありません。",
      emptyCopy: "拡張機能または API からサイトスキャンを実行すると、保存済み Prospect Cards がここに表示されます。",
      filterLabel: "リードを絞り込み",
      tableLabel: "保存済みリード"
    },
    emptyProspect: {
      eyebrow: "Prospect Card",
      title: "最初の保存済みカードはここに表示されます",
      cta: "最初のスキャンを準備"
    },
    icpPanel: {
      eyebrow: "ICP 設定",
      title: "エージェンシーモード",
      serviceType: "サービス種別",
      targetIndustries: "対象業界",
      countries: "国",
      tone: "トーン",
      firstTarget: "最初の対象"
    },
    signalPanel: {
      eyebrow: "シグナル",
      title: "現在のスキャン構成"
    }
  },
  leads: {
    eyebrow: "保存済みアカウント",
    title: "Prospect ライブラリ",
    controlsLabel: "Prospect ライブラリの操作",
    searchLabel: "検索",
    sortLabel: "並び替え",
    minFit: "最小適合度",
    minConfidence: "最小信頼度",
    resultsSummary: "__TOTAL__ 件中 __VISIBLE__ 件表示",
    selectedCount: "__COUNT__ 件選択",
    selectedReadyCopy: "対応準備ができたアカウントのみをエクスポートします。",
    selectedEmptyCopy: "見込み客を選択して絞り込んだ CSV をエクスポートします。",
    templateLabel: "テンプレート",
    crmFieldsLabel: "CRM フィールド",
    tableLabel: "保存済み見込み客",
    selectAllVisible: "表示中の見込み客をすべて選択",
    clearAllVisible: "表示中の見込み客をすべて解除",
    selectLead: "__COMPANY__ を選択",
    openProspectCard: "__COMPANY__ の Prospect Card を開く",
    noMatchingTitle: "一致する見込み客がありません。",
    noSavedTitle: "保存済み見込み客はまだありません。",
    noMatchingCopy: "検索またはスコア条件を緩めてください。",
    noSavedCopy: "サイトスキャンを実行して最初の保存済み Prospect Card を作成してください。",
    drawerLabel: "選択したリードの Prospect Card",
    drawerEyebrow: "選択中のリード",
    drawerTitle: "完全な Prospect Card",
    drawerLoadingLabel: "Prospect Card を読み込み中",
    drawerCloseLabel: "Prospect Card を閉じる",
    drawerNoSelection: "未選択",
    drawerFitLabel: "適合度 __SCORE__",
    errorShowingPreview: "詳細を読み込めなかったため一覧プレビューを表示しています。",
    detailEmptyTitle: "リードを選択",
    detailEmptyCopy: "保存済みアカウントをクリックすると完全な Prospect Card を確認できます。"
  },
  prospectCard: {
    eyebrow: "Prospect Card",
    summaryLabel: "見込み客サマリー",
    fitLabel: "適合",
    website: "ウェブサイト",
    industry: "業界",
    confidence: "信頼度",
    status: "ステータス",
    owner: "担当者",
    stage: "ステージ",
    sectionsLabel: "Prospect Card セクション",
    mobileActionsLabel: "モバイル Prospect Card 操作",
    contactLabels: {
      emails: "メール",
      phones: "電話番号",
      contactPages: "お問い合わせページ",
      socialLinks: "ソーシャルリンク"
    },
    overview: {
      fitEvidence: "適合の根拠",
      confidence: "信頼度 __COUNT__%",
      topSignals: "主要サイトシグナル",
      shown: "__COUNT__ 件表示",
      bestFirstLine: "最適な冒頭文",
      highestLeverage: "最も効果的",
      shortEmailPreview: "短いメールプレビュー",
      openEmail: "メールを開く"
    },
    signals: {
      title: "サイトシグナル",
      findings: "__COUNT__ 件の発見"
    },
    contacts: {
      title: "連絡経路",
      found: "__COUNT__ 件見つかりました"
    },
    outreach: {
      bestFirstLine: "最適な冒頭文",
      readyToPaste: "すぐ貼り付け可能",
      angles: "アウトリーチ案",
      count: "__COUNT__ 件の案"
    },
    email: {
      title: "短いメール"
    },
    sources: {
      title: "ソースメモ",
      count: "__COUNT__ 件のソース",
      sourceLabel: "ソース"
    },
    export: {
      panelLabel: "選択した Prospect Card フィールドをエクスポート",
      title: "選択したフィールドをエクスポート",
      selected: "__TOTAL__ 件中 __SELECTED__ 件選択",
      presetsLabel: "エクスポートプリセット",
      crmModesLabel: "CRM フィールド命名モード",
      csvColumns: "CSV 列",
      columns: "__LABEL__ 列",
      copyCsvRow: "CSV 行をコピー",
      copySelected: "選択したフィールドをコピー",
      downloadCsv: "CSV をダウンロード",
      downloadFields: "フィールドをダウンロード",
      fields: {
        identity: "会社フィールド",
        fit: "適合の根拠",
        signals: "サイトシグナル",
        contacts: "連絡経路",
        angles: "アウトリーチ案",
        firstLine: "冒頭文",
        email: "短いメール",
        sources: "ソースメモ"
      },
      presets: {
        crm: {
          label: "CRM エクスポート"
        },
        email: {
          label: "メール下書き"
        },
        brief: {
          label: "調査ブリーフ"
        }
      }
    },
    pipeline: {
      panelLabel: "担当者・ステージ・メモ",
      title: "パイプライン情報",
      updated: "__TIME__ に更新",
      notSavedYet: "まだ保存されていません",
      notes: "メモ",
      saveContext: "コンテキストを保存",
      saveStateIdle: "変更内容をワークスペースに保存します。",
      saveStateSaving: "担当者・ステージ・メモを保存中...",
      saveStateSaved: "担当者・ステージ・メモを保存しました。",
      saveStateError: "ワークスペースに保存できませんでした。"
    },
    activity: {
      panelLabel: "パイプライン活動ログ",
      title: "活動ログ",
      recent: "最近 __COUNT__ 件",
      noChangesYet: "まだ変更はありません",
      filterLabel: "変更フィールドで活動ログを絞り込み",
      changed: "__FIELDS__ を変更 · __TIME__",
      showDiff: "差分を表示",
      hideDiff: "差分を隠す",
      diffLabel: "前回と現在のパイプライン値",
      noMatch: "このフィルターに一致する活動はありません。",
      empty: "最初に保存すると、担当者・ステージ・メモの変更がここに表示されます。"
    },
    copyMenu: {
      fullCard: "カード全体をコピー",
      website: "URL をコピー",
      cardLink: "カードリンクをコピー",
      firstLine: "冒頭文をコピー",
      signals: "シグナルをコピー",
      contactPaths: "連絡経路をコピー",
      sourceNotes: "ソースメモをコピー",
      selectedFields: "選択フィールドをコピー"
    },
    actions: {
      copyEmail: "メールをコピー",
      export: "エクスポート",
      copyLink: "リンクをコピー",
      moreCopyActions: "その他のコピー操作",
      save: "保存",
      saving: "保存中"
    },
    copyLabels: {
      company: "会社",
      fitScore: "適合度",
      confidence: "信頼度",
      industry: "業界",
      owner: "担当者",
      pipelineStage: "パイプラインステージ",
      notes: "メモ",
      summary: "サマリー",
      fitReason: "適合理由",
      signals: "シグナル",
      firstLine: "冒頭文",
      shortEmail: "短いメール",
      domain: "ドメイン",
      source: "ソース",
      subjectLine: "__COMPANY__ 向けの簡単なアイデア"
    }
  }
};

const ko: AppUiExtraOverride = {
  common: {
    loading: "로딩 중",
    sample: "샘플",
    live: "실시간",
    save: "저장",
    saving: "저장 중...",
    saved: "저장됨",
    reset: "초기화",
    search: "검색",
    sort: "정렬",
    filter: "필터",
    clearFilters: "필터 지우기",
    clearSelection: "선택 해제",
    clearVisible: "보이는 항목 해제",
    selectVisible: "보이는 항목 선택",
    exportSelected: "선택 항목 내보내기",
    exporting: "내보내는 중...",
    copy: "복사",
    copied: "복사됨",
    failed: "실패",
    downloaded: "다운로드됨",
    close: "닫기",
    open: "열기",
    hide: "숨기기",
    details: "세부 정보",
    previous: "이전",
    current: "현재",
    editable: "편집 가능",
    enabled: "사용 가능",
    updating: "업데이트 중",
    updated: "업데이트됨",
    notSet: "설정 안 됨",
    unknownTime: "시간 알 수 없음",
    unassigned: "미할당",
    empty: "비어 있음",
    none: "없음",
    noneFound: "찾을 수 없음",
    noData: "데이터 없음",
    messages: {
      demoPreviewIntro: "데모 미리보기입니다. 워크스페이스를 만들면 잠재고객 저장과 크레딧 추적이 가능합니다.",
      billingActiveSetup: "결제가 활성화되었습니다. 아래 첫 설정을 완료하세요.",
      workspaceCreatedSetup: "워크스페이스가 생성되었습니다. 아래 첫 설정을 완료하세요.",
      signedIn: "로그인되었습니다.",
      samePlan: "이미 __PLAN__ 플랜을 사용 중입니다.",
      checkoutUnavailable: "현재 이 플랜은 체크아웃을 사용할 수 없습니다.",
      leadDetailUnavailable: "리드 상세 정보를 불러올 수 없습니다.",
      scanInvalidUrl:
        "유효한 잠재고객 사이트 URL을 입력하세요. 크레딧은 차감되지 않았습니다. URL을 수정한 뒤 다시 시도하세요.",
      scanComplete: "스캔이 완료되었습니다. 내보내기나 아웃리치 작성 전에 Prospect Card를 확인하세요.",
      scanFailed: "스캔에 실패했습니다. 크레딧은 차감되지 않았습니다. URL을 수정한 뒤 다시 시도하세요.",
      csvExportFailed: "CSV 내보내기에 실패했습니다.",
      billingPortalUnavailable: "결제 포털을 아직 사용할 수 없습니다.",
      signedOutDemo: "로그아웃되었습니다. 데모 미리보기를 표시합니다.",
      signInRequired: "계속하려면 로그인하세요.",
      workspaceNotFound: "워크스페이스를 찾을 수 없습니다.",
      subscriptionInactive: "구독이 활성화되어 있지 않습니다. 사이트를 더 스캔하기 전에 결제를 업데이트하세요.",
      insufficientCredits: "이 요청을 처리하기에 워크스페이스의 스캔 크레딧이 부족합니다."
    }
  },
  options: {
    leadSort: {
      newest: "최신 저장순",
      fit_desc: "적합도",
      confidence_desc: "신뢰도",
      company_asc: "회사명 A-Z"
    },
    scanHistoryFilters: {
      all: "전체",
      completed: "완료",
      failed: "실패",
      replayed: "재사용",
      processing: "처리 중"
    },
    historyDateFilters: {
      all: "전체 날짜",
      today: "오늘",
      "7d": "최근 7일",
      "30d": "최근 30일"
    },
    prospectCardTabs: {
      overview: "개요",
      signals: "시그널",
      contacts: "연락 경로",
      outreach: "아웃리치",
      email: "이메일",
      sources: "출처",
      export: "내보내기"
    },
    pipelineStages: {
      researching: "조사 중",
      qualified: "적격",
      outreach_queued: "아웃리치 대기",
      contacted: "연락 완료",
      won: "수주",
      archived: "보관됨"
    },
    activityFields: {
      all: "전체",
      owner: "담당자",
      stage: "단계",
      notes: "메모"
    },
    serviceTypes: {
      web_design: "웹 디자인 / 리디자인",
      seo: "SEO 에이전시",
      marketing: "성장 / 마케팅",
      founder: "창업자 주도 아웃바운드",
      custom: "맞춤",
      unknown: "설정 안 됨"
    },
    tones: {
      professional: "전문적",
      direct: "직설적",
      casual: "캐주얼",
      unknown: "설정 안 됨"
    },
    signalCategories: {
      web_design: "웹 디자인",
      seo: "SEO",
      marketing: "마케팅",
      timing: "타이밍"
    },
    subscriptionStatuses: {
      active: "활성",
      trialing: "체험 중",
      pending_checkout: "체크아웃 대기",
      configuration_required: "결제 설정 필요",
      past_due: "연체",
      canceled: "취소됨"
    },
    historyReasons: {
      validation_failed: "검증 실패",
      workspace_unavailable: "워크스페이스 사용 불가",
      subscription_inactive: "구독 비활성",
      insufficient_credits: "크레딧 부족",
      idempotency_conflict: "멱등성 충돌",
      duplicate_in_progress: "중복 처리 중",
      generation_failed: "생성 실패",
      persistence_failed: "저장 실패",
      replayed: "재사용",
      processing: "처리 중",
      unknown: "알 수 없는 이유"
    }
  },
  dashboard: {
    onboarding: {
      eyebrow: "첫 설정",
      progress: "__COUNT__/3 완료",
      markComplete: "완료로 표시",
      setupSnapshot: "설정 개요",
      service: "서비스",
      industries: "산업",
      firstTarget: "첫 대상",
      prepareFirstScan: "첫 스캔 준비",
      runFirstScan: "첫 스캔 실행",
      reviewIcp: "ICP 검토"
    },
    metrics: {
      ariaLabel: "워크스페이스 지표",
      savedProspects: "저장된 잠재고객",
      currentPlan: "현재 플랜",
      creditsLeft: "남은 크레딧",
      subscription: "구독 상태",
      usedThisMonth: "이번 달 __COUNT__ 사용"
    },
    leadsPanel: {
      eyebrow: "리드 목록",
      title: "저장된 잠재고객",
      company: "회사",
      industry: "산업",
      fit: "적합도",
      confidence: "신뢰도",
      emptyTitle: "저장된 잠재고객이 아직 없습니다.",
      emptyCopy: "확장 프로그램이나 API로 웹사이트를 스캔하면 저장된 Prospect Card가 여기에 표시됩니다.",
      filterLabel: "리드 필터",
      tableLabel: "저장된 리드"
    },
    emptyProspect: {
      eyebrow: "Prospect Card",
      title: "첫 저장 카드가 여기에 표시됩니다",
      cta: "첫 스캔 준비"
    },
    icpPanel: {
      eyebrow: "ICP 설정",
      title: "에이전시 모드",
      serviceType: "서비스 유형",
      targetIndustries: "대상 산업",
      countries: "국가",
      tone: "톤",
      firstTarget: "첫 대상"
    },
    signalPanel: {
      eyebrow: "시그널",
      title: "현재 스캔 구성"
    }
  },
  leads: {
    eyebrow: "저장된 계정",
    title: "Prospect 라이브러리",
    controlsLabel: "Prospect 라이브러리 컨트롤",
    searchLabel: "검색",
    sortLabel: "정렬",
    minFit: "최소 적합도",
    minConfidence: "최소 신뢰도",
    resultsSummary: "__TOTAL__개 중 __VISIBLE__개 표시",
    selectedCount: "__COUNT__개 선택됨",
    selectedReadyCopy: "팀이 바로 작업할 준비가 된 계정만 내보냅니다.",
    selectedEmptyCopy: "잠재고객을 선택해 집중형 CSV를 내보내세요.",
    templateLabel: "템플릿",
    crmFieldsLabel: "CRM 필드",
    tableLabel: "저장된 잠재고객",
    selectAllVisible: "보이는 잠재고객 모두 선택",
    clearAllVisible: "보이는 잠재고객 모두 해제",
    selectLead: "__COMPANY__ 선택",
    openProspectCard: "__COMPANY__의 Prospect Card 열기",
    noMatchingTitle: "일치하는 잠재고객이 없습니다.",
    noSavedTitle: "저장된 잠재고객이 아직 없습니다.",
    noMatchingCopy: "검색어나 점수 필터를 완화해 보세요.",
    noSavedCopy: "웹사이트 스캔을 실행해 첫 저장 Prospect Card를 만드세요.",
    drawerLabel: "선택한 리드의 Prospect Card",
    drawerEyebrow: "선택된 리드",
    drawerTitle: "전체 Prospect Card",
    drawerLoadingLabel: "Prospect Card 불러오는 중",
    drawerCloseLabel: "Prospect Card 닫기",
    drawerNoSelection: "선택 없음",
    drawerFitLabel: "적합도 __SCORE__",
    errorShowingPreview: "전체 상세를 불러오지 못해 목록 미리보기를 표시합니다.",
    detailEmptyTitle: "리드를 선택하세요",
    detailEmptyCopy: "저장된 계정을 클릭하면 전체 Prospect Card를 확인할 수 있습니다."
  },
  prospectCard: {
    eyebrow: "Prospect Card",
    summaryLabel: "잠재고객 요약",
    fitLabel: "적합도",
    website: "웹사이트",
    industry: "산업",
    confidence: "신뢰도",
    status: "상태",
    owner: "담당자",
    stage: "단계",
    sectionsLabel: "Prospect Card 섹션",
    mobileActionsLabel: "모바일 Prospect Card 작업",
    contactLabels: {
      emails: "이메일",
      phones: "전화번호",
      contactPages: "문의 페이지",
      socialLinks: "소셜 링크"
    },
    overview: {
      fitEvidence: "적합 근거",
      confidence: "신뢰도 __COUNT__%",
      topSignals: "주요 사이트 시그널",
      shown: "__COUNT__개 표시",
      bestFirstLine: "최적의 첫 문장",
      highestLeverage: "가장 효과적",
      shortEmailPreview: "짧은 이메일 미리보기",
      openEmail: "이메일 열기"
    },
    signals: {
      title: "사이트 시그널",
      findings: "__COUNT__개 발견"
    },
    contacts: {
      title: "연락 경로",
      found: "__COUNT__개 발견"
    },
    outreach: {
      bestFirstLine: "최적의 첫 문장",
      readyToPaste: "바로 붙여넣기 가능",
      angles: "아웃리치 각도",
      count: "__COUNT__개 아이디어"
    },
    email: {
      title: "짧은 이메일"
    },
    sources: {
      title: "소스 메모",
      count: "__COUNT__개 소스",
      sourceLabel: "소스"
    },
    export: {
      panelLabel: "선택한 Prospect Card 필드 내보내기",
      title: "선택한 필드 내보내기",
      selected: "__TOTAL__개 중 __SELECTED__개 선택됨",
      presetsLabel: "내보내기 프리셋",
      crmModesLabel: "CRM 필드 이름 모드",
      csvColumns: "CSV 열",
      columns: "__LABEL__ 열",
      copyCsvRow: "CSV 행 복사",
      copySelected: "선택한 필드 복사",
      downloadCsv: "CSV 다운로드",
      downloadFields: "필드 다운로드",
      fields: {
        identity: "회사 필드",
        fit: "적합 근거",
        signals: "사이트 시그널",
        contacts: "연락 경로",
        angles: "아웃리치 각도",
        firstLine: "첫 문장",
        email: "짧은 이메일",
        sources: "소스 메모"
      },
      presets: {
        crm: {
          label: "CRM 내보내기"
        },
        email: {
          label: "이메일 초안"
        },
        brief: {
          label: "리서치 브리프"
        }
      }
    },
    pipeline: {
      panelLabel: "담당자, 단계, 메모",
      title: "파이프라인 컨텍스트",
      updated: "__TIME__에 업데이트됨",
      notSavedYet: "아직 저장되지 않음",
      notes: "메모",
      saveContext: "컨텍스트 저장",
      saveStateIdle: "변경 내용을 워크스페이스에 저장합니다.",
      saveStateSaving: "담당자, 단계, 메모 저장 중...",
      saveStateSaved: "담당자, 단계, 메모가 저장되었습니다.",
      saveStateError: "워크스페이스에 저장할 수 없습니다."
    },
    activity: {
      panelLabel: "파이프라인 활동 로그",
      title: "활동 로그",
      recent: "최근 __COUNT__개",
      noChangesYet: "아직 변경 사항이 없습니다",
      filterLabel: "변경 필드로 활동 로그 필터링",
      changed: "__FIELDS__ 변경 · __TIME__",
      showDiff: "변경 내용 보기",
      hideDiff: "변경 내용 숨기기",
      diffLabel: "이전 값과 현재 파이프라인 값",
      noMatch: "이 필터와 일치하는 활동이 없습니다.",
      empty: "처음 저장하면 담당자, 단계, 메모 변경이 여기에 표시됩니다."
    },
    copyMenu: {
      fullCard: "전체 카드 복사",
      website: "URL 복사",
      cardLink: "카드 링크 복사",
      firstLine: "첫 문장 복사",
      signals: "시그널 복사",
      contactPaths: "연락 경로 복사",
      sourceNotes: "소스 메모 복사",
      selectedFields: "선택한 필드 복사"
    },
    actions: {
      copyEmail: "이메일 복사",
      export: "내보내기",
      copyLink: "링크 복사",
      moreCopyActions: "추가 복사 작업",
      save: "저장",
      saving: "저장 중"
    },
    copyLabels: {
      company: "회사",
      fitScore: "적합도",
      confidence: "신뢰도",
      industry: "산업",
      owner: "담당자",
      pipelineStage: "파이프라인 단계",
      notes: "메모",
      summary: "요약",
      fitReason: "적합 이유",
      signals: "시그널",
      firstLine: "첫 문장",
      shortEmail: "짧은 이메일",
      domain: "도메인",
      source: "소스",
      subjectLine: "__COMPANY__에 대한 간단한 아이디어"
    }
  }
};

const de: AppUiExtraOverride = {
  common: {
    loading: "Wird geladen",
    sample: "Beispiel",
    live: "Live",
    save: "Speichern",
    saving: "Wird gespeichert...",
    saved: "Gespeichert",
    reset: "Zurücksetzen",
    search: "Suchen",
    sort: "Sortieren",
    filter: "Filter",
    clearFilters: "Filter löschen",
    clearSelection: "Auswahl aufheben",
    clearVisible: "Sichtbare entfernen",
    selectVisible: "Sichtbare auswählen",
    exportSelected: "Ausgewählte exportieren",
    exporting: "Export wird erstellt...",
    copy: "Kopieren",
    copied: "Kopiert",
    failed: "Fehlgeschlagen",
    downloaded: "Heruntergeladen",
    close: "Schließen",
    open: "Öffnen",
    hide: "Ausblenden",
    details: "Details",
    previous: "Vorherig",
    current: "Aktuell",
    editable: "Bearbeitbar",
    enabled: "Aktiv",
    updating: "Wird aktualisiert",
    updated: "Aktualisiert",
    notSet: "Nicht gesetzt",
    unknownTime: "Unbekannte Zeit",
    unassigned: "Nicht zugewiesen",
    empty: "Leer",
    none: "Keine",
    noneFound: "Nichts gefunden",
    noData: "Keine Daten",
    messages: {
      demoPreviewIntro:
        "Demo-Vorschau. Erstellen Sie einen Workspace, um Prospects zu speichern und Credits zu verfolgen.",
      billingActiveSetup: "Abrechnung ist aktiv. Schließen Sie unten zuerst das Setup ab.",
      workspaceCreatedSetup: "Workspace erstellt. Schließen Sie unten zuerst das Setup ab.",
      signedIn: "Angemeldet.",
      samePlan: "Sie nutzen bereits den Tarif __PLAN__.",
      checkoutUnavailable: "Checkout ist für diesen Tarif derzeit nicht verfügbar.",
      leadDetailUnavailable: "Leaddetails konnten nicht geladen werden.",
      scanInvalidUrl:
        "Geben Sie eine gültige Prospect-URL ein. Es wurde kein Credit verbraucht. Korrigieren Sie die URL und versuchen Sie es erneut.",
      scanComplete:
        "Scan abgeschlossen. Prüfen Sie zuerst die Prospect Card, bevor Sie exportieren oder Outreach schreiben.",
      scanFailed:
        "Scan fehlgeschlagen. Es wurde kein Credit verbraucht. Korrigieren Sie die URL und versuchen Sie es erneut.",
      csvExportFailed: "CSV-Export fehlgeschlagen.",
      billingPortalUnavailable: "Das Billing-Portal ist noch nicht verfügbar.",
      signedOutDemo: "Abgemeldet. Die Demo-Vorschau wird angezeigt.",
      signInRequired: "Melden Sie sich an, um fortzufahren.",
      workspaceNotFound: "Workspace nicht gefunden.",
      subscriptionInactive:
        "Ihr Abonnement ist nicht aktiv. Aktualisieren Sie die Abrechnung, bevor Sie weitere Websites scannen.",
      insufficientCredits: "Dieser Workspace hat nicht genug Scan-Credits für diese Anfrage."
    }
  },
  options: {
    leadSort: {
      newest: "Neueste zuerst",
      fit_desc: "Fit-Score",
      confidence_desc: "Vertrauen",
      company_asc: "Firma A-Z"
    },
    scanHistoryFilters: {
      all: "Alle",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      replayed: "Wiederholt",
      processing: "In Bearbeitung"
    },
    historyDateFilters: {
      all: "Alle Daten",
      today: "Heute",
      "7d": "Letzte 7 Tage",
      "30d": "Letzte 30 Tage"
    },
    prospectCardTabs: {
      overview: "Übersicht",
      signals: "Signale",
      contacts: "Kontakte",
      outreach: "Outreach",
      email: "E-Mail",
      sources: "Quellen",
      export: "Export"
    },
    pipelineStages: {
      researching: "Recherche",
      qualified: "Qualifiziert",
      outreach_queued: "Outreach geplant",
      contacted: "Kontaktiert",
      won: "Gewonnen",
      archived: "Archiviert"
    },
    activityFields: {
      all: "Alle",
      owner: "Verantwortlich",
      stage: "Phase",
      notes: "Notizen"
    },
    serviceTypes: {
      web_design: "Webdesign / Relaunch",
      seo: "SEO-Agentur",
      marketing: "Wachstum / Marketing",
      founder: "Founder-led Outbound",
      custom: "Benutzerdefiniert",
      unknown: "Nicht gesetzt"
    },
    tones: {
      professional: "Professionell",
      direct: "Direkt",
      casual: "Locker",
      unknown: "Nicht gesetzt"
    },
    signalCategories: {
      web_design: "Webdesign",
      seo: "SEO",
      marketing: "Marketing",
      timing: "Timing"
    },
    subscriptionStatuses: {
      active: "Aktiv",
      trialing: "Testphase",
      pending_checkout: "Checkout ausstehend",
      configuration_required: "Billing-Einrichtung erforderlich",
      past_due: "Überfällig",
      canceled: "Gekündigt"
    },
    historyReasons: {
      validation_failed: "Validierung fehlgeschlagen",
      workspace_unavailable: "Workspace nicht verfügbar",
      subscription_inactive: "Abonnement inaktiv",
      insufficient_credits: "Zu wenig Credits",
      idempotency_conflict: "Idempotenzkonflikt",
      duplicate_in_progress: "Duplikat wird verarbeitet",
      generation_failed: "Generierung fehlgeschlagen",
      persistence_failed: "Speichern fehlgeschlagen",
      replayed: "Wiederholt",
      processing: "In Bearbeitung",
      unknown: "Unbekannter Grund"
    }
  },
  dashboard: {
    onboarding: {
      eyebrow: "Ersteinrichtung",
      progress: "__COUNT__/3 erledigt",
      markComplete: "Als erledigt markieren",
      setupSnapshot: "Setup-Übersicht",
      service: "Service",
      industries: "Branchen",
      firstTarget: "Erstes Ziel",
      prepareFirstScan: "Ersten Scan vorbereiten",
      runFirstScan: "Ersten Scan starten",
      reviewIcp: "ICP prüfen"
    },
    metrics: {
      ariaLabel: "Workspace-Kennzahlen",
      savedProspects: "Gespeicherte Prospects",
      currentPlan: "Aktueller Tarif",
      creditsLeft: "Verbleibende Credits",
      subscription: "Abonnement",
      usedThisMonth: "__COUNT__ in diesem Monat verwendet"
    },
    leadsPanel: {
      eyebrow: "Leadliste",
      title: "Gespeicherte Prospects",
      company: "Unternehmen",
      industry: "Branche",
      fit: "Fit",
      confidence: "Vertrauen",
      emptyTitle: "Noch keine gespeicherten Prospects.",
      emptyCopy: "Führen Sie einen Website-Scan über die Erweiterung oder API aus, dann erscheinen gespeicherte Prospect Cards hier.",
      filterLabel: "Leads filtern",
      tableLabel: "Gespeicherte Leads"
    },
    emptyProspect: {
      eyebrow: "Prospect Card",
      title: "Ihre erste gespeicherte Karte erscheint hier",
      cta: "Ersten Scan vorbereiten"
    },
    icpPanel: {
      eyebrow: "ICP-Einstellungen",
      title: "Agenturmodus",
      serviceType: "Servicetyp",
      targetIndustries: "Zielbranchen",
      countries: "Länder",
      tone: "Ton",
      firstTarget: "Erstes Ziel"
    },
    signalPanel: {
      eyebrow: "Signale",
      title: "Aktueller Scan-Mix"
    }
  },
  leads: {
    eyebrow: "Gespeicherte Accounts",
    title: "Prospect-Bibliothek",
    controlsLabel: "Steuerung der Prospect-Bibliothek",
    searchLabel: "Suchen",
    sortLabel: "Sortieren",
    minFit: "Mindest-Fit",
    minConfidence: "Mindest-Vertrauen",
    resultsSummary: "__VISIBLE__ von __TOTAL__ Prospects angezeigt",
    selectedCount: "__COUNT__ ausgewählt",
    selectedReadyCopy: "Exportieren Sie nur Accounts, mit denen Ihr Team arbeiten kann.",
    selectedEmptyCopy: "Wählen Sie Prospects aus, um ein fokussiertes CSV zu exportieren.",
    templateLabel: "Vorlage",
    crmFieldsLabel: "CRM-Felder",
    tableLabel: "Gespeicherte Prospects",
    selectAllVisible: "Alle sichtbaren Prospects auswählen",
    clearAllVisible: "Alle sichtbaren Prospects abwählen",
    selectLead: "__COMPANY__ auswählen",
    openProspectCard: "Prospect Card für __COMPANY__ öffnen",
    noMatchingTitle: "Keine passenden Prospects.",
    noSavedTitle: "Noch keine gespeicherten Prospects.",
    noMatchingCopy: "Lockern Sie Suche oder Score-Filter, um mehr Accounts anzuzeigen.",
    noSavedCopy: "Führen Sie einen Website-Scan aus, um die erste gespeicherte Prospect Card zu erstellen.",
    drawerLabel: "Prospect Card des ausgewählten Leads",
    drawerEyebrow: "Ausgewählter Lead",
    drawerTitle: "Vollständige Prospect Card",
    drawerLoadingLabel: "Prospect Card wird geladen",
    drawerCloseLabel: "Prospect Card schließen",
    drawerNoSelection: "Keine Auswahl",
    drawerFitLabel: "__SCORE__ Fit",
    errorShowingPreview: "Listen-Vorschau wird angezeigt, weil das vollständige Detail nicht geladen werden konnte.",
    detailEmptyTitle: "Lead auswählen",
    detailEmptyCopy: "Klicken Sie auf einen gespeicherten Account, um die vollständige Prospect Card zu prüfen."
  },
  prospectCard: {
    eyebrow: "Prospect Card",
    summaryLabel: "Prospect-Zusammenfassung",
    fitLabel: "Fit",
    website: "Website",
    industry: "Branche",
    confidence: "Vertrauen",
    status: "Status",
    owner: "Verantwortlich",
    stage: "Phase",
    sectionsLabel: "Abschnitte der Prospect Card",
    mobileActionsLabel: "Mobile Prospect-Card-Aktionen",
    contactLabels: {
      emails: "E-Mails",
      phones: "Telefonnummern",
      contactPages: "Kontaktseiten",
      socialLinks: "Social-Links"
    },
    overview: {
      fitEvidence: "Fit-Belege",
      confidence: "__COUNT__ % Vertrauen",
      topSignals: "Wichtigste Website-Signale",
      shown: "__COUNT__ angezeigt",
      bestFirstLine: "Beste Einstiegszeile",
      highestLeverage: "Höchster Hebel",
      shortEmailPreview: "Kurze E-Mail-Vorschau",
      openEmail: "E-Mail öffnen"
    },
    signals: {
      title: "Website-Signale",
      findings: "__COUNT__ Erkenntnisse"
    },
    contacts: {
      title: "Kontaktwege",
      found: "__COUNT__ gefunden"
    },
    outreach: {
      bestFirstLine: "Beste Einstiegszeile",
      readyToPaste: "Direkt einsetzbar",
      angles: "Outreach-Ansätze",
      count: "__COUNT__ Ansätze"
    },
    email: {
      title: "Kurze E-Mail"
    },
    sources: {
      title: "Quellnotizen",
      count: "__COUNT__ Quellen",
      sourceLabel: "Quelle"
    },
    export: {
      panelLabel: "Ausgewählte Prospect-Card-Felder exportieren",
      title: "Ausgewählte Felder exportieren",
      selected: "__SELECTED__ von __TOTAL__ ausgewählt",
      presetsLabel: "Export-Vorgaben",
      crmModesLabel: "CRM-Feldbenennung",
      csvColumns: "CSV-Spalten",
      columns: "__LABEL__ Spalten",
      copyCsvRow: "CSV-Zeile kopieren",
      copySelected: "Ausgewählte Felder kopieren",
      downloadCsv: "CSV herunterladen",
      downloadFields: "Felder herunterladen",
      fields: {
        identity: "Unternehmensfelder",
        fit: "Fit-Belege",
        signals: "Website-Signale",
        contacts: "Kontaktwege",
        angles: "Outreach-Ansätze",
        firstLine: "Einstiegszeile",
        email: "Kurze E-Mail",
        sources: "Quellnotizen"
      },
      presets: {
        crm: {
          label: "CRM-Export"
        },
        email: {
          label: "E-Mail-Entwurf"
        },
        brief: {
          label: "Recherche-Briefing"
        }
      }
    },
    pipeline: {
      panelLabel: "Verantwortlich, Phase und Notizen",
      title: "Pipeline-Kontext",
      updated: "Aktualisiert __TIME__",
      notSavedYet: "Noch nicht gespeichert",
      notes: "Notizen",
      saveContext: "Kontext speichern",
      saveStateIdle: "Änderungen im Workspace speichern.",
      saveStateSaving: "Verantwortlich, Phase und Notizen werden gespeichert...",
      saveStateSaved: "Verantwortlich, Phase und Notizen gespeichert.",
      saveStateError: "Im Workspace konnte nicht gespeichert werden."
    },
    activity: {
      panelLabel: "Aktivitätsprotokoll der Pipeline",
      title: "Aktivitätsprotokoll",
      recent: "Letzte __COUNT__",
      noChangesYet: "Noch keine Änderungen",
      filterLabel: "Aktivitätsprotokoll nach geändertem Feld filtern",
      changed: "__FIELDS__ geändert · __TIME__",
      showDiff: "Änderungen anzeigen",
      hideDiff: "Änderungen ausblenden",
      diffLabel: "Vorherige und aktuelle Pipeline-Werte",
      noMatch: "Keine Aktivitäten passen zu diesem Filter.",
      empty: "Nach dem ersten Speichern erscheinen Änderungen an Verantwortlich, Phase und Notizen hier."
    },
    copyMenu: {
      fullCard: "Gesamte Karte kopieren",
      website: "URL kopieren",
      cardLink: "Kartenlink kopieren",
      firstLine: "Einstiegszeile kopieren",
      signals: "Signale kopieren",
      contactPaths: "Kontaktwege kopieren",
      sourceNotes: "Quellnotizen kopieren",
      selectedFields: "Ausgewählte Felder kopieren"
    },
    actions: {
      copyEmail: "E-Mail kopieren",
      export: "Exportieren",
      copyLink: "Link kopieren",
      moreCopyActions: "Weitere Kopieraktionen",
      save: "Speichern",
      saving: "Speichert"
    },
    copyLabels: {
      company: "Unternehmen",
      fitScore: "Fit-Score",
      confidence: "Vertrauen",
      industry: "Branche",
      owner: "Verantwortlich",
      pipelineStage: "Pipeline-Phase",
      notes: "Notizen",
      summary: "Zusammenfassung",
      fitReason: "Fit-Grund",
      signals: "Signale",
      firstLine: "Einstiegszeile",
      shortEmail: "Kurze E-Mail",
      domain: "Domain",
      source: "Quelle",
      subjectLine: "Kurze Idee für __COMPANY__"
    }
  }
};

const nl: AppUiExtraOverride = {
  common: {
    loading: "Laden",
    sample: "Voorbeeld",
    live: "Live",
    save: "Opslaan",
    saving: "Bezig met opslaan...",
    saved: "Opgeslagen",
    reset: "Resetten",
    search: "Zoeken",
    sort: "Sorteren",
    filter: "Filter",
    clearFilters: "Filters wissen",
    clearSelection: "Selectie wissen",
    clearVisible: "Zichtbare wissen",
    selectVisible: "Zichtbare selecteren",
    exportSelected: "Geselecteerde exporteren",
    exporting: "Bezig met exporteren...",
    copy: "Kopiëren",
    copied: "Gekopieerd",
    failed: "Mislukt",
    downloaded: "Gedownload",
    close: "Sluiten",
    open: "Openen",
    hide: "Verbergen",
    details: "Details",
    previous: "Vorige",
    current: "Huidige",
    editable: "Bewerkbaar",
    enabled: "Ingeschakeld",
    updating: "Bezig met bijwerken",
    updated: "Bijgewerkt",
    notSet: "Niet ingesteld",
    unknownTime: "Onbekende tijd",
    unassigned: "Niet toegewezen",
    empty: "Leeg",
    none: "Geen",
    noneFound: "Niets gevonden",
    noData: "Geen gegevens",
    messages: {
      demoPreviewIntro:
        "Demo-preview. Maak een workspace aan om prospects op te slaan en credits te volgen.",
      billingActiveSetup: "Facturatie is actief. Rond eerst hieronder de eerste setup af.",
      workspaceCreatedSetup: "Workspace aangemaakt. Rond eerst hieronder de eerste setup af.",
      signedIn: "Ingelogd.",
      samePlan: "U gebruikt al het __PLAN__-abonnement.",
      checkoutUnavailable: "Checkout is momenteel niet beschikbaar voor dit abonnement.",
      leadDetailUnavailable: "Kan leaddetails niet laden.",
      scanInvalidUrl:
        "Voer een geldige prospectwebsite-URL in. Er zijn geen credits gebruikt. Corrigeer de URL en probeer het opnieuw.",
      scanComplete:
        "Scan voltooid. Bekijk eerst de Prospect Card voordat u exporteert of outreach schrijft.",
      scanFailed:
        "Scan mislukt. Er zijn geen credits gebruikt. Corrigeer de URL en probeer het opnieuw.",
      csvExportFailed: "CSV-export mislukt.",
      billingPortalUnavailable: "Het facturatieportaal is nog niet beschikbaar.",
      signedOutDemo: "Uitgelogd. De demo-preview wordt getoond.",
      signInRequired: "Log in om door te gaan.",
      workspaceNotFound: "Workspace niet gevonden.",
      subscriptionInactive:
        "Uw abonnement is niet actief. Werk de facturatie bij voordat u meer websites scant.",
      insufficientCredits: "Deze workspace heeft niet genoeg scancredits voor dit verzoek."
    }
  },
  options: {
    leadSort: {
      newest: "Nieuwst opgeslagen",
      fit_desc: "Fit-score",
      confidence_desc: "Vertrouwen",
      company_asc: "Bedrijf A-Z"
    },
    scanHistoryFilters: {
      all: "Alle",
      completed: "Voltooid",
      failed: "Mislukt",
      replayed: "Herhaald",
      processing: "Verwerken"
    },
    historyDateFilters: {
      all: "Alle datums",
      today: "Vandaag",
      "7d": "Laatste 7 dagen",
      "30d": "Laatste 30 dagen"
    },
    prospectCardTabs: {
      overview: "Overzicht",
      signals: "Signalen",
      contacts: "Contacten",
      outreach: "Outreach",
      email: "E-mail",
      sources: "Bronnen",
      export: "Exporteren"
    },
    pipelineStages: {
      researching: "Onderzoek",
      qualified: "Gekwalificeerd",
      outreach_queued: "Outreach ingepland",
      contacted: "Gecontacteerd",
      won: "Gewonnen",
      archived: "Gearchiveerd"
    },
    activityFields: {
      all: "Alle",
      owner: "Eigenaar",
      stage: "Fase",
      notes: "Notities"
    },
    serviceTypes: {
      web_design: "Webdesign / redesign",
      seo: "SEO-bureau",
      marketing: "Groei / marketing",
      founder: "Founder-led outbound",
      custom: "Aangepast",
      unknown: "Niet ingesteld"
    },
    tones: {
      professional: "Professioneel",
      direct: "Direct",
      casual: "Informeel",
      unknown: "Niet ingesteld"
    },
    signalCategories: {
      web_design: "Webdesign",
      seo: "SEO",
      marketing: "Marketing",
      timing: "Timing"
    },
    subscriptionStatuses: {
      active: "Actief",
      trialing: "Proefperiode",
      pending_checkout: "Checkout in behandeling",
      configuration_required: "Facturatie-instelling vereist",
      past_due: "Achterstallig",
      canceled: "Geannuleerd"
    },
    historyReasons: {
      validation_failed: "Validatie mislukt",
      workspace_unavailable: "Workspace niet beschikbaar",
      subscription_inactive: "Abonnement inactief",
      insufficient_credits: "Onvoldoende credits",
      idempotency_conflict: "Idempotentieconflict",
      duplicate_in_progress: "Dubbele aanvraag in behandeling",
      generation_failed: "Generatie mislukt",
      persistence_failed: "Opslaan mislukt",
      replayed: "Herhaald",
      processing: "Verwerken",
      unknown: "Onbekende reden"
    }
  },
  dashboard: {
    onboarding: {
      eyebrow: "Eerste setup",
      progress: "__COUNT__/3 klaar",
      markComplete: "Markeer als voltooid",
      setupSnapshot: "Setup-overzicht",
      service: "Service",
      industries: "Branches",
      firstTarget: "Eerste doel",
      prepareFirstScan: "Eerste scan voorbereiden",
      runFirstScan: "Eerste scan uitvoeren",
      reviewIcp: "ICP bekijken"
    },
    metrics: {
      ariaLabel: "Workspace-statistieken",
      savedProspects: "Opgeslagen prospects",
      currentPlan: "Huidig abonnement",
      creditsLeft: "Resterende credits",
      subscription: "Abonnement",
      usedThisMonth: "__COUNT__ deze maand gebruikt"
    },
    leadsPanel: {
      eyebrow: "Leadlijst",
      title: "Opgeslagen prospects",
      company: "Bedrijf",
      industry: "Branche",
      fit: "Fit",
      confidence: "Vertrouwen",
      emptyTitle: "Nog geen opgeslagen prospects.",
      emptyCopy: "Voer een websitescan uit via de extensie of API, dan verschijnen opgeslagen Prospect Cards hier.",
      filterLabel: "Leads filteren",
      tableLabel: "Opgeslagen leads"
    },
    emptyProspect: {
      eyebrow: "Prospect Card",
      title: "Je eerste opgeslagen kaart verschijnt hier",
      cta: "Eerste scan voorbereiden"
    },
    icpPanel: {
      eyebrow: "ICP-instellingen",
      title: "Bureaumodus",
      serviceType: "Servicetype",
      targetIndustries: "Doelbranches",
      countries: "Landen",
      tone: "Toon",
      firstTarget: "Eerste doel"
    },
    signalPanel: {
      eyebrow: "Signalen",
      title: "Huidige scanmix"
    }
  },
  leads: {
    eyebrow: "Opgeslagen accounts",
    title: "Prospect-bibliotheek",
    controlsLabel: "Besturing van de prospect-bibliotheek",
    searchLabel: "Zoeken",
    sortLabel: "Sorteren",
    minFit: "Min. fit",
    minConfidence: "Min. vertrouwen",
    resultsSummary: "__VISIBLE__ van __TOTAL__ prospects getoond",
    selectedCount: "__COUNT__ geselecteerd",
    selectedReadyCopy: "Exporteer alleen de accounts waar je team klaar voor is.",
    selectedEmptyCopy: "Selecteer prospects om een gericht CSV te exporteren.",
    templateLabel: "Sjabloon",
    crmFieldsLabel: "CRM-velden",
    tableLabel: "Opgeslagen prospects",
    selectAllVisible: "Alle zichtbare prospects selecteren",
    clearAllVisible: "Alle zichtbare prospects wissen",
    selectLead: "__COMPANY__ selecteren",
    openProspectCard: "Prospect Card voor __COMPANY__ openen",
    noMatchingTitle: "Geen overeenkomende prospects.",
    noSavedTitle: "Nog geen opgeslagen prospects.",
    noMatchingCopy: "Maak de zoek- of scorefilters ruimer om meer accounts te tonen.",
    noSavedCopy: "Voer een websitescan uit om de eerste opgeslagen Prospect Card te maken.",
    drawerLabel: "Prospect Card van geselecteerde lead",
    drawerEyebrow: "Geselecteerde lead",
    drawerTitle: "Volledige Prospect Card",
    drawerLoadingLabel: "Prospect Card laden",
    drawerCloseLabel: "Prospect Card sluiten",
    drawerNoSelection: "Geen selectie",
    drawerFitLabel: "__SCORE__ fit",
    errorShowingPreview: "De lijstpreview wordt getoond omdat de volledige details niet geladen konden worden.",
    detailEmptyTitle: "Selecteer een lead",
    detailEmptyCopy: "Klik op een opgeslagen account om de volledige Prospect Card te bekijken."
  },
  prospectCard: {
    eyebrow: "Prospect Card",
    summaryLabel: "Prospect-samenvatting",
    fitLabel: "Fit",
    website: "Website",
    industry: "Branche",
    confidence: "Vertrouwen",
    status: "Status",
    owner: "Eigenaar",
    stage: "Fase",
    sectionsLabel: "Prospect Card-secties",
    mobileActionsLabel: "Mobiele Prospect Card-acties",
    contactLabels: {
      emails: "E-mails",
      phones: "Telefoonnummers",
      contactPages: "Contactpagina's",
      socialLinks: "Social links"
    },
    overview: {
      fitEvidence: "Fit-onderbouwing",
      confidence: "__COUNT__% vertrouwen",
      topSignals: "Belangrijkste websitesignalen",
      shown: "__COUNT__ getoond",
      bestFirstLine: "Beste openingszin",
      highestLeverage: "Meeste hefboom",
      shortEmailPreview: "Korte e-mailpreview",
      openEmail: "E-mail openen"
    },
    signals: {
      title: "Websitesignalen",
      findings: "__COUNT__ bevindingen"
    },
    contacts: {
      title: "Contactpaden",
      found: "__COUNT__ gevonden"
    },
    outreach: {
      bestFirstLine: "Beste openingszin",
      readyToPaste: "Klaar om te plakken",
      angles: "Outreach-hoeken",
      count: "__COUNT__ invalshoeken"
    },
    email: {
      title: "Korte e-mail"
    },
    sources: {
      title: "Bronnotities",
      count: "__COUNT__ bronnen",
      sourceLabel: "Bron"
    },
    export: {
      panelLabel: "Geselecteerde Prospect Card-velden exporteren",
      title: "Geselecteerde velden exporteren",
      selected: "__SELECTED__ van __TOTAL__ geselecteerd",
      presetsLabel: "Exportpresets",
      crmModesLabel: "CRM-veldnaammodus",
      csvColumns: "CSV-kolommen",
      columns: "__LABEL__ kolommen",
      copyCsvRow: "CSV-rij kopiëren",
      copySelected: "Geselecteerde velden kopiëren",
      downloadCsv: "CSV downloaden",
      downloadFields: "Velden downloaden",
      fields: {
        identity: "Bedrijfsvelden",
        fit: "Fit-onderbouwing",
        signals: "Websitesignalen",
        contacts: "Contactpaden",
        angles: "Outreach-hoeken",
        firstLine: "Openingszin",
        email: "Korte e-mail",
        sources: "Bronnotities"
      },
      presets: {
        crm: {
          label: "CRM-export"
        },
        email: {
          label: "E-mailconcept"
        },
        brief: {
          label: "Onderzoeksbrief"
        }
      }
    },
    pipeline: {
      panelLabel: "Eigenaar, fase en notities",
      title: "Pipelinecontext",
      updated: "Bijgewerkt __TIME__",
      notSavedYet: "Nog niet opgeslagen",
      notes: "Notities",
      saveContext: "Context opslaan",
      saveStateIdle: "Wijzigingen opslaan in de workspace.",
      saveStateSaving: "Eigenaar, fase en notities worden opgeslagen...",
      saveStateSaved: "Eigenaar, fase en notities zijn opgeslagen.",
      saveStateError: "Kan niet opslaan in de workspace."
    },
    activity: {
      panelLabel: "Pipeline-activiteitslogboek",
      title: "Activiteitslogboek",
      recent: "Laatste __COUNT__",
      noChangesYet: "Nog geen wijzigingen",
      filterLabel: "Activiteitslogboek filteren op gewijzigd veld",
      changed: "__FIELDS__ gewijzigd · __TIME__",
      showDiff: "Wijzigingen tonen",
      hideDiff: "Wijzigingen verbergen",
      diffLabel: "Vorige en huidige pipelinewaarden",
      noMatch: "Geen activiteiten voor dit filter.",
      empty: "Na de eerste opslag verschijnen wijzigingen aan eigenaar, fase en notities hier."
    },
    copyMenu: {
      fullCard: "Volledige kaart kopiëren",
      website: "URL kopiëren",
      cardLink: "Kaartlink kopiëren",
      firstLine: "Openingszin kopiëren",
      signals: "Signalen kopiëren",
      contactPaths: "Contactpaden kopiëren",
      sourceNotes: "Bronnotities kopiëren",
      selectedFields: "Geselecteerde velden kopiëren"
    },
    actions: {
      copyEmail: "E-mail kopiëren",
      export: "Exporteren",
      copyLink: "Link kopiëren",
      moreCopyActions: "Meer kopieeracties",
      save: "Opslaan",
      saving: "Bezig met opslaan"
    },
    copyLabels: {
      company: "Bedrijf",
      fitScore: "Fit-score",
      confidence: "Vertrouwen",
      industry: "Branche",
      owner: "Eigenaar",
      pipelineStage: "Pipelinefase",
      notes: "Notities",
      summary: "Samenvatting",
      fitReason: "Fit-reden",
      signals: "Signalen",
      firstLine: "Openingszin",
      shortEmail: "Korte e-mail",
      domain: "Domein",
      source: "Bron",
      subjectLine: "Kort idee voor __COMPANY__"
    }
  }
};

const fr: AppUiExtraOverride = {
  common: {
    loading: "Chargement",
    sample: "Exemple",
    live: "Live",
    save: "Enregistrer",
    saving: "Enregistrement...",
    saved: "Enregistré",
    reset: "Réinitialiser",
    search: "Rechercher",
    sort: "Trier",
    filter: "Filtrer",
    clearFilters: "Effacer les filtres",
    clearSelection: "Effacer la sélection",
    clearVisible: "Effacer les visibles",
    selectVisible: "Sélectionner les visibles",
    exportSelected: "Exporter la sélection",
    exporting: "Export en cours...",
    copy: "Copier",
    copied: "Copié",
    failed: "Échec",
    downloaded: "Téléchargé",
    close: "Fermer",
    open: "Ouvrir",
    hide: "Masquer",
    details: "Détails",
    previous: "Précédent",
    current: "Actuel",
    editable: "Modifiable",
    enabled: "Activé",
    updating: "Mise à jour...",
    updated: "Mis à jour",
    notSet: "Non défini",
    unknownTime: "Heure inconnue",
    unassigned: "Non attribué",
    empty: "Vide",
    none: "Aucun",
    noneFound: "Aucun trouvé",
    noData: "Aucune donnée",
    messages: {
      demoPreviewIntro:
        "Aperçu démo. Créez un workspace pour enregistrer des prospects et suivre les crédits.",
      billingActiveSetup: "La facturation est active. Terminez d'abord la configuration ci-dessous.",
      workspaceCreatedSetup: "Workspace créé. Terminez d'abord la configuration ci-dessous.",
      signedIn: "Connecté.",
      samePlan: "Vous êtes déjà sur l'offre __PLAN__.",
      checkoutUnavailable: "Le paiement n'est pas disponible pour cette offre pour le moment.",
      leadDetailUnavailable: "Impossible de charger le détail du lead.",
      scanInvalidUrl:
        "Saisissez une URL de site prospect valide. Aucun crédit n'a été consommé. Corrigez l'URL puis réessayez.",
      scanComplete:
        "Scan terminé. Vérifiez d'abord la Prospect Card avant d'exporter ou de rédiger un message.",
      scanFailed:
        "Le scan a échoué. Aucun crédit n'a été consommé. Corrigez l'URL puis réessayez.",
      csvExportFailed: "L'export CSV a échoué.",
      billingPortalUnavailable: "Le portail de facturation n'est pas encore disponible.",
      signedOutDemo: "Déconnecté. L'aperçu démo est affiché.",
      signInRequired: "Connectez-vous pour continuer.",
      workspaceNotFound: "Workspace introuvable.",
      subscriptionInactive:
        "Votre abonnement n'est pas actif. Mettez à jour la facturation avant de scanner d'autres sites.",
      insufficientCredits: "Ce workspace n'a pas assez de crédits de scan pour cette demande."
    }
  },
  options: {
    leadSort: {
      newest: "Plus récents",
      fit_desc: "Score d'adéquation",
      confidence_desc: "Confiance",
      company_asc: "Entreprise A-Z"
    },
    scanHistoryFilters: {
      all: "Tous",
      completed: "Terminés",
      failed: "Échoués",
      replayed: "Rejoués",
      processing: "En cours"
    },
    historyDateFilters: {
      all: "Toutes les dates",
      today: "Aujourd'hui",
      "7d": "7 derniers jours",
      "30d": "30 derniers jours"
    },
    prospectCardTabs: {
      overview: "Vue d'ensemble",
      signals: "Signaux",
      contacts: "Contacts",
      outreach: "Outreach",
      email: "E-mail",
      sources: "Sources",
      export: "Exporter"
    },
    pipelineStages: {
      researching: "Recherche",
      qualified: "Qualifié",
      outreach_queued: "Outreach en attente",
      contacted: "Contacté",
      won: "Gagné",
      archived: "Archivé"
    },
    activityFields: {
      all: "Tous",
      owner: "Responsable",
      stage: "Étape",
      notes: "Notes"
    },
    serviceTypes: {
      web_design: "Web design / refonte",
      seo: "Agence SEO",
      marketing: "Croissance / marketing",
      founder: "Outbound piloté par le fondateur",
      custom: "Personnalisé",
      unknown: "Non défini"
    },
    tones: {
      professional: "Professionnel",
      direct: "Direct",
      casual: "Décontracté",
      unknown: "Non défini"
    },
    signalCategories: {
      web_design: "Web design",
      seo: "SEO",
      marketing: "Marketing",
      timing: "Timing"
    },
    subscriptionStatuses: {
      active: "Actif",
      trialing: "Essai en cours",
      pending_checkout: "Paiement en attente",
      configuration_required: "Configuration de facturation requise",
      past_due: "En retard",
      canceled: "Annulé"
    },
    historyReasons: {
      validation_failed: "Validation échouée",
      workspace_unavailable: "Workspace indisponible",
      subscription_inactive: "Abonnement inactif",
      insufficient_credits: "Crédits insuffisants",
      idempotency_conflict: "Conflit d'idempotence",
      duplicate_in_progress: "Doublon en cours",
      generation_failed: "Génération échouée",
      persistence_failed: "Enregistrement échoué",
      replayed: "Rejoué",
      processing: "En cours",
      unknown: "Raison inconnue"
    }
  },
  dashboard: {
    onboarding: {
      eyebrow: "Première configuration",
      progress: "__COUNT__/3 prêts",
      markComplete: "Marquer comme terminé",
      setupSnapshot: "Aperçu de la configuration",
      service: "Service",
      industries: "Secteurs",
      firstTarget: "Première cible",
      prepareFirstScan: "Préparer le premier scan",
      runFirstScan: "Lancer le premier scan",
      reviewIcp: "Vérifier l'ICP"
    },
    metrics: {
      ariaLabel: "Indicateurs du workspace",
      savedProspects: "Prospects enregistrés",
      currentPlan: "Offre actuelle",
      creditsLeft: "Crédits restants",
      subscription: "Abonnement",
      usedThisMonth: "__COUNT__ utilisés ce mois-ci"
    },
    leadsPanel: {
      eyebrow: "Liste de leads",
      title: "Prospects enregistrés",
      company: "Entreprise",
      industry: "Secteur",
      fit: "Adéquation",
      confidence: "Confiance",
      emptyTitle: "Aucun prospect enregistré pour le moment.",
      emptyCopy: "Lancez un scan de site depuis l'extension ou l'API, puis les Prospect Cards enregistrées apparaîtront ici.",
      filterLabel: "Filtrer les leads",
      tableLabel: "Leads enregistrés"
    },
    emptyProspect: {
      eyebrow: "Prospect Card",
      title: "Votre première carte enregistrée apparaîtra ici",
      cta: "Préparer le premier scan"
    },
    icpPanel: {
      eyebrow: "Paramètres ICP",
      title: "Mode agence",
      serviceType: "Type de service",
      targetIndustries: "Secteurs ciblés",
      countries: "Pays",
      tone: "Ton",
      firstTarget: "Première cible"
    },
    signalPanel: {
      eyebrow: "Signaux",
      title: "Répartition actuelle des scans"
    }
  },
  leads: {
    eyebrow: "Comptes enregistrés",
    title: "Bibliothèque de prospects",
    controlsLabel: "Contrôles de la bibliothèque de prospects",
    searchLabel: "Rechercher",
    sortLabel: "Trier",
    minFit: "Adéquation min.",
    minConfidence: "Confiance min.",
    resultsSummary: "__VISIBLE__ prospects affichés sur __TOTAL__",
    selectedCount: "__COUNT__ sélectionnés",
    selectedReadyCopy: "Exportez uniquement les comptes prêts à être traités par votre équipe.",
    selectedEmptyCopy: "Sélectionnez des prospects pour exporter un CSV ciblé.",
    templateLabel: "Modèle",
    crmFieldsLabel: "Champs CRM",
    tableLabel: "Prospects enregistrés",
    selectAllVisible: "Sélectionner tous les prospects visibles",
    clearAllVisible: "Effacer tous les prospects visibles",
    selectLead: "Sélectionner __COMPANY__",
    openProspectCard: "Ouvrir la Prospect Card de __COMPANY__",
    noMatchingTitle: "Aucun prospect correspondant.",
    noSavedTitle: "Aucun prospect enregistré pour le moment.",
    noMatchingCopy: "Assouplissez la recherche ou les filtres de score pour faire revenir plus de comptes.",
    noSavedCopy: "Lancez un scan de site pour créer la première Prospect Card enregistrée.",
    drawerLabel: "Prospect Card du lead sélectionné",
    drawerEyebrow: "Lead sélectionné",
    drawerTitle: "Prospect Card complète",
    drawerLoadingLabel: "Chargement de la Prospect Card",
    drawerCloseLabel: "Fermer la Prospect Card",
    drawerNoSelection: "Aucune sélection",
    drawerFitLabel: "__SCORE__ d'adéquation",
    errorShowingPreview: "L'aperçu de la liste est affiché car le détail complet n'a pas pu être chargé.",
    detailEmptyTitle: "Sélectionner un lead",
    detailEmptyCopy: "Cliquez sur un compte enregistré pour consulter la Prospect Card complète."
  },
  prospectCard: {
    eyebrow: "Prospect Card",
    summaryLabel: "Résumé du prospect",
    fitLabel: "Adéquation",
    website: "Site web",
    industry: "Secteur",
    confidence: "Confiance",
    status: "Statut",
    owner: "Responsable",
    stage: "Étape",
    sectionsLabel: "Sections de la Prospect Card",
    mobileActionsLabel: "Actions mobiles de la Prospect Card",
    contactLabels: {
      emails: "E-mails",
      phones: "Numéros de téléphone",
      contactPages: "Pages de contact",
      socialLinks: "Liens sociaux"
    },
    overview: {
      fitEvidence: "Justification d'adéquation",
      confidence: "__COUNT__ % de confiance",
      topSignals: "Principaux signaux du site",
      shown: "__COUNT__ affichés",
      bestFirstLine: "Meilleure phrase d'ouverture",
      highestLeverage: "Levier le plus fort",
      shortEmailPreview: "Aperçu du court e-mail",
      openEmail: "Ouvrir l'e-mail"
    },
    signals: {
      title: "Signaux du site",
      findings: "__COUNT__ éléments"
    },
    contacts: {
      title: "Canaux de contact",
      found: "__COUNT__ trouvés"
    },
    outreach: {
      bestFirstLine: "Meilleure phrase d'ouverture",
      readyToPaste: "Prêt à coller",
      angles: "Angles d'outreach",
      count: "__COUNT__ angles"
    },
    email: {
      title: "Court e-mail"
    },
    sources: {
      title: "Notes source",
      count: "__COUNT__ sources",
      sourceLabel: "Source"
    },
    export: {
      panelLabel: "Exporter les champs sélectionnés de la Prospect Card",
      title: "Exporter les champs sélectionnés",
      selected: "__SELECTED__ sélectionnés sur __TOTAL__",
      presetsLabel: "Préréglages d'export",
      crmModesLabel: "Mode de nommage des champs CRM",
      csvColumns: "Colonnes CSV",
      columns: "__LABEL__ colonnes",
      copyCsvRow: "Copier la ligne CSV",
      copySelected: "Copier les champs sélectionnés",
      downloadCsv: "Télécharger le CSV",
      downloadFields: "Télécharger les champs",
      fields: {
        identity: "Champs entreprise",
        fit: "Justification d'adéquation",
        signals: "Signaux du site",
        contacts: "Canaux de contact",
        angles: "Angles d'outreach",
        firstLine: "Phrase d'ouverture",
        email: "Court e-mail",
        sources: "Notes source"
      },
      presets: {
        crm: {
          label: "Export CRM"
        },
        email: {
          label: "Brouillon d'e-mail"
        },
        brief: {
          label: "Brief de recherche"
        }
      }
    },
    pipeline: {
      panelLabel: "Responsable, étape et notes",
      title: "Contexte pipeline",
      updated: "Mis à jour __TIME__",
      notSavedYet: "Pas encore enregistré",
      notes: "Notes",
      saveContext: "Enregistrer le contexte",
      saveStateIdle: "Enregistrer les modifications dans le workspace.",
      saveStateSaving: "Enregistrement du responsable, de l'étape et des notes...",
      saveStateSaved: "Responsable, étape et notes enregistrés.",
      saveStateError: "Impossible d'enregistrer dans le workspace."
    },
    activity: {
      panelLabel: "Journal d'activité du pipeline",
      title: "Journal d'activité",
      recent: "__COUNT__ récents",
      noChangesYet: "Aucun changement pour le moment",
      filterLabel: "Filtrer le journal d'activité par champ modifié",
      changed: "__FIELDS__ modifiés · __TIME__",
      showDiff: "Afficher les changements",
      hideDiff: "Masquer les changements",
      diffLabel: "Valeurs précédentes et actuelles du pipeline",
      noMatch: "Aucune activité ne correspond à ce filtre.",
      empty: "Après le premier enregistrement, les changements de responsable, d'étape et de notes apparaîtront ici."
    },
    copyMenu: {
      fullCard: "Copier la carte complète",
      website: "Copier l'URL",
      cardLink: "Copier le lien de la carte",
      firstLine: "Copier la phrase d'ouverture",
      signals: "Copier les signaux",
      contactPaths: "Copier les canaux de contact",
      sourceNotes: "Copier les notes source",
      selectedFields: "Copier les champs sélectionnés"
    },
    actions: {
      copyEmail: "Copier l'e-mail",
      export: "Exporter",
      copyLink: "Copier le lien",
      moreCopyActions: "Autres actions de copie",
      save: "Enregistrer",
      saving: "Enregistrement"
    },
    copyLabels: {
      company: "Entreprise",
      fitScore: "Score d'adéquation",
      confidence: "Confiance",
      industry: "Secteur",
      owner: "Responsable",
      pipelineStage: "Étape du pipeline",
      notes: "Notes",
      summary: "Résumé",
      fitReason: "Raison d'adéquation",
      signals: "Signaux",
      firstLine: "Phrase d'ouverture",
      shortEmail: "Court e-mail",
      domain: "Domaine",
      source: "Source",
      subjectLine: "Idée rapide pour __COMPANY__"
    }
  }
};

export const appUiExtraByLocale = {
  en,
  zh,
  ja,
  ko,
  de,
  nl,
  fr
} satisfies Record<SiteLocaleCode, AppUiExtraOverride>;
