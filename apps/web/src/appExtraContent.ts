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
  nav: {
    today: "Today",
    queue: "Queue",
    qualified: "Qualified",
    exports: "Exports",
    settings: "Settings",
    dashboard: "Overview",
    import: "Import",
    leads: "Review queue",
    saved: "Saved accounts",
    icp: "ICP",
    credits: "Billing",
    analytics: "Workflow",
    account: "Account"
  },
  pages: {
    dashboard: {
      eyebrow: "Today",
      title: "Today",
      copy: "See the next action, current blockers, and workflow progress for this workspace."
    },
    queue: {
      eyebrow: "Queue",
      title: "Queue",
      copy: "Add websites, run scans, and move queued work through review without leaving the same workflow lane."
    },
    qualified: {
      eyebrow: "Qualified",
      title: "Qualified accounts",
      copy: "Review the accounts that already passed research and are ready for ownership, notes, and handoff."
    },
    exports: {
      eyebrow: "Exports",
      title: "Exports",
      copy: "Prepare CRM-ready handoff, choose an export preset, and move qualified accounts out of the workspace cleanly."
    },
    settings: {
      eyebrow: "Settings",
      title: "Settings",
      copy: "Configure ICP, workspace identity, and access without breaking the main operating flow."
    },
    leads: {
      eyebrow: "Review queue",
      title: "Review queue",
      copy: "Work through imported or researching accounts before they move into the saved handoff list."
    },
    icp: {
      eyebrow: "ICP",
      title: "ICP",
      copy: "Define how LeadCue should score fit, urgency, and actionability before the team scans more websites."
    },
    billing: {
      eyebrow: "Billing",
      title: "Billing",
      copy: "Monitor credits, subscription status, and export capacity without leaving the workspace."
    },
    import: {
      eyebrow: "Batch research",
      title: "Import websites",
      copy: "Paste domains or upload a CSV to build a website-first review queue for this workspace."
    },
    saved: {
      eyebrow: "Saved accounts",
      title: "Saved accounts",
      copy: "Export the accounts that already passed review and are ready for outreach or CRM handoff."
    },
    analytics: {
      eyebrow: "Workflow",
      title: "Workflow analytics",
      copy: "Track how websites enter the queue, turn into qualified accounts, and leave the workspace as exports."
    },
    account: {
      eyebrow: "Account",
      title: "Account",
      copy: "Update workspace identity and password access without breaking the workflow."
    }
  },
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
      demoPreviewIntro: "Current demo preview. Start free to save Prospect Cards, credits, and export history.",
      sampleWorkspaceData: "__ERROR__ Showing sample workspace data.",
      sampleWorkspaceDataPlain: "Showing sample workspace data.",
      workspaceDataUnavailable: "We couldn't load this workspace right now. Refresh and try again.",
      billingActiveSetup: "Billing is active. Finish the first website-first research run below.",
      workspaceCreatedSetup: "LeadCue is ready. Finish your first website-first research run below.",
      createWorkspaceRequired: "Signed in. Preparing LeadCue for your first research run.",
      workspaceCreateFailed: "Unable to prepare LeadCue right now.",
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
      workspaceNotFound: "LeadCue data space not found.",
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
      eyebrow: "First research run",
      welcomeTitle: "Welcome, __NAME__.",
      workspaceReadyTitle: "Start with one website, __NAME__.",
      intro:
        "LeadCue is set up for website-first outbound research. Finish one scan to create a Prospect Card with fit score, source-backed notes, first lines, and export-ready context.",
      progress: "__COUNT__/4 ready",
      markComplete: "Mark complete",
      checklistLabel: "First website-first research checklist",
      setupSnapshot: "Agency profile",
      service: "Offer",
      industries: "Best-fit segments",
      firstTarget: "First website",
      prepareFirstScan: "Prepare website research",
      runFirstScan: "Run first scan",
      reviewIcp: "Tune Agency Profile",
      tasks: {
        profileSaved: "Agency Profile tuned",
        firstWebsiteQueued: "First website selected",
        firstProspectCard: "First Prospect Card saved",
        exportReady: "Export-ready handoff"
      },
      descriptions: {
        profileSaved: "Fit scoring is tuned for __INDUSTRIES__.",
        profileTodo: "Set your offer and best-fit segments so fit score and opportunity signals stay relevant.",
        websiteQueued: "Ready for website-first research: __URL__",
        agencySaved: "Agency site saved as context: __URL__",
        websiteTodo: "Add the first prospect website to generate source-backed notes and outreach context.",
        firstCardDone: "__COUNT__ Prospect Cards already saved.",
        firstCardTodo: "Run the first website scan to save a Prospect Card with first lines and export-ready notes.",
        exportReadyDone: "Your first saved account is ready for CSV or CRM handoff.",
        exportReadyTodo: "After saving a Prospect Card, use exports to hand off qualified accounts to outreach."
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
    },
    workbench: {
      title: "Workflow lanes",
      import: {
        eyebrow: "Import",
        title: "Build the batch list",
        copy: "Paste domains or upload a CSV before the team starts reviewing accounts.",
        metricLabel: "Queued websites"
      },
      queue: {
        eyebrow: "Review",
        title: "Triage the next websites",
        copy: "See which accounts still need a scan and which already need a human qualification pass.",
        metricLabel: "Ready to review"
      },
      saved: {
        eyebrow: "Saved",
        title: "Hand off approved accounts",
        copy: "Only move accounts here after the website evidence and angle are strong enough for outreach.",
        metricLabel: "Ready for handoff"
      },
      scan: {
        eyebrow: "Scan desk",
        title: "Run the next website",
        copy: "Keep single-site research available, but make it a lane inside the batch workflow instead of the whole app.",
        metricLabel: "Researching now"
      }
    },
    queuePanel: {
      eyebrow: "Queue snapshot",
      title: "What needs review next",
      ready: "Ready",
      researching: "Researching",
      imported: "Imported",
      workspaceSource: "Workspace lead",
      openSite: "Open site",
      moveToScanDesk: "Move to scan desk",
      reviewCard: "Open card",
      emptyTitle: "No websites waiting in the queue.",
      emptyCopy: "Import a list or scan the first website to create work for the team."
    },
    savedPanel: {
      eyebrow: "Saved handoff",
      title: "What is already ready to export",
      qualified: "Qualified",
      outreachQueued: "Outreach queued",
      exported: "Exports",
      openCard: "Open card",
      emptyTitle: "No saved accounts are ready yet.",
      emptyCopy: "Move strong accounts out of the review queue once the owner, stage, and notes are ready."
    },
    nextAction: {
      startWorkspace: "Start free",
      createWorkspace: "Prepare LeadCue",
      setupRequired: "Preparing your account",
      createWorkspaceTitle: "Preparing LeadCue for your first research run",
      createWorkspaceCopy:
        "You are signed in. LeadCue is creating the default data space for your Agency Profile, credits, website queue, Prospect Cards, and exports.",
      importWebsites: "Import websites",
      openQueue: "Open review queue",
      manualScan: "Use manual scan instead",
      sampleTitle: "This is the demo workspace preview",
      sampleCopy:
        "Sign in to reopen your saved research, or start free before importing websites into the review queue.",
      loadErrorTitle: "We couldn't reopen your research data",
      loadErrorCopy:
        "Your saved queue and exported context are still protected. Refresh first, then sign back in if the issue keeps showing.",
      retryWorkspace: "Refresh data",
      manualEyebrow: "Manual lane",
      manualTitle: "Need to research one website instead?",
      manualCopy:
        "Keep single-site scanning available for one-off research, but treat it as the side lane instead of the default homepage flow.",
      openManual: "Open manual scan"
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
  reviewQueue: {
    eyebrow: "Review queue",
    title: "Review imported and researching accounts",
    controlsLabel: "Review queue filters",
    searchLabel: "Search queue",
    statusLabel: "Status",
    sourceLabel: "Source",
    sourceAll: "All sources",
    sourceImported: "Imported only",
    workspaceSource: "Workspace lead",
    statusAll: "All statuses",
    statusReady: "Ready",
    statusResearching: "Researching",
    resultsSummary: "Showing __VISIBLE__ of __TOTAL__ queue items",
    readySummary: "__COUNT__ ready right now",
    tableLabel: "Review queue",
    nextStepLabel: "Next step",
    openSite: "Open site",
    moveToScanDesk: "Move to scan desk",
    openCard: "Open card",
    emptyTitle: "No review queue yet.",
    emptyCopy: "Import websites or scan the first account to create a review queue.",
    emptyFilteredTitle: "No queue items match this filter.",
    emptyFilteredCopy: "Relax the filters to bring more imported or researching accounts back into view.",
    sideEyebrow: "Queue health",
    sideTitle: "Keep the queue moving every day",
    sideCopy: "The queue is where research becomes qualification. Focus on moving accounts from ready to researching, then into qualified handoff.",
    importedCountLabel: "Imported websites"
  },
  importer: {
    eyebrow: "Batch import",
    title: "Import websites into the queue",
    copy: "Add domains from Apollo, Clay, CSV exports, partner lists, or manual shortlist research.",
    openQueue: "Open review queue",
    sourceLabel: "Source",
    notesLabel: "Context note",
    textareaLabel: "Paste domains or URLs",
    textareaPlaceholder: "acme.com\nnorthstar.io\nhttps://example.org",
    submit: "Add to queue",
    upload: "Upload CSV or TXT",
    summaryEyebrow: "Queue summary",
    summaryTitle: "What this import lane is feeding",
    summaryImported: "Imported",
    summaryReady: "Ready",
    summaryResearching: "Researching",
    historyEyebrow: "Imported websites",
    historyTitle: "Queue history",
    historyCount: "__COUNT__ websites",
    statusLabel: "Status",
    nextStepLabel: "Next step",
    remove: "Remove",
    emptyTitle: "No imported websites yet.",
    emptyCopy: "Paste domains or upload a list to start building a review queue.",
    sourceOptions: {
      manual: "Manual shortlist",
      csv: "CSV export",
      apollo: "Apollo export",
      clay: "Clay table",
      directory: "Directory / list"
    },
    messages: {
      added: "__COUNT__ websites added. __SKIPPED__ duplicates or invalid entries skipped.",
      noWebsitesAdded: "No valid new websites were added. Check the domains and try again.",
      fileReadFailed: "We could not read that file. Try CSV, TXT, or TSV.",
      queueUpdated: "Import queue updated."
    }
  },
  savedAccounts: {
    eyebrow: "Saved accounts",
    title: "Approved accounts ready for handoff",
    tableLabel: "Saved accounts",
    statusQualified: "Qualified",
    resultsSummary: "Showing __VISIBLE__ of __TOTAL__ saved accounts",
    emptyTitle: "No saved accounts are ready yet.",
    emptyCopy: "Move an account out of researching once the fit, owner, and notes are ready for outreach.",
    emptyFilteredTitle: "No saved accounts match this view.",
    emptyFilteredCopy: "Relax the search or score filters to bring more saved accounts back into view."
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
    overviewTitle: "How the workflow is moving",
    emptyTitle: "No workflow data yet",
    emptyCopy:
      "Import websites first. Analytics will start filling in after the queue moves into research, qualification, and export.",
    kpis: {
      importedWebsites: "Imported websites",
      reviewQueueReady: "Queue ready",
      qualifiedAccounts: "Qualified accounts",
      exportsCompleted: "Exports completed"
    },
    workflowFunnel: {
      eyebrow: "Workflow funnel",
      title: "From import to outreach handoff",
      imported: "Imported",
      importedMeta: "Websites added into the workspace queue",
      reviewing: "Researching",
      reviewingMeta: "__PERCENT__ of imported websites",
      qualified: "Qualified",
      qualifiedMeta: "__PERCENT__ of the active review workload",
      exported: "Exported",
      exportedMeta: "__PERCENT__ of qualified accounts"
    },
    stageMix: {
      eyebrow: "Stage mix",
      title: "Where saved accounts sit right now",
      accountsSuffix: "__COUNT__ accounts"
    },
    queueSources: {
      eyebrow: "Import sources",
      title: "Where the queue is being filled from",
      accountsSuffix: "__COUNT__ websites"
    },
    scanOutcomes: {
      eyebrow: "Scan outcomes",
      title: "What happened after the queue hit the scan desk",
      completed: "Completed",
      failed: "Failed",
      processing: "Processing",
      failureSuffix: "__COUNT__ failures",
      noFailures: "No recent failures",
      noFailuresCopy: "Completed scans are flowing without a visible error cluster."
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
      reviewBacklog: "There are more ready websites than researching accounts, so the next move is assigning time to clear the review backlog.",
      qualificationGap: "Researching accounts outnumber qualified accounts, which suggests the bottleneck is human qualification or ownership follow-up.",
      exportGap: "Qualified accounts are building up faster than exports, so the handoff into CRM or outreach needs attention.",
      keepMoving: "The workflow is balanced right now. Keep importing, reviewing, and exporting at the current pace.",
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
    summary: {
      currentPlan: "Current plan",
      scansLeft: "Scans left",
      resetDate: "Reset date",
      workspaceStatus: "Workspace status"
    },
    usage: {
      eyebrow: "Usage overview",
      title: "__COUNT__ scans left",
      summary:
        "__USED__ credits used this month on the __PLAN__ plan. Credits are charged only when a scan creates and saves a usable Prospect Card.",
      usedLabel: "Used this month",
      remainingLabel: "Remaining now",
      totalLabel: "Monthly scan allowance",
      usagePercent: "__COUNT__% used"
    },
    kpis: {
      subscription: "Subscription",
      creditReset: "Credit reset",
      billingPeriodEnd: "Billing cycle",
      noPaidCycle: "No paid billing cycle yet"
    },
    meterLabel: "Monthly credit usage",
    actions: {
      manageBilling: "Manage billing",
      exportCsv: "Export CSV",
      exportCurrentFields: "Export current fields",
      faq: "Billing FAQ",
      comparePlans: "Compare plans"
    },
    plans: {
      eyebrow: "Recommended plan",
      title: "Scale credits without changing the workflow",
      compareEyebrow: "Plan comparison",
      compareTitle: "Compare plans by monthly scan volume",
      compareCopy: "Use the full comparison only when scan volume is the real bottleneck.",
      currentPlan: "Current plan",
      currentPlanBadge: "Current",
      recommendedBadge: "Recommended",
      manageCurrent: "Manage current plan",
      choosePlan: "Choose __PLAN__",
      scansPerMonth: "__COUNT__ scans / month",
      monthlyPrice: "$__PRICE__/month",
      includedCredits: "Monthly credits",
      creditLift: "Credit lift",
      additionalCredits: "+__COUNT__ scans vs current",
      highestVolume: "Highest volume",
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
      eyebrow: "Workspace access",
      title: "Know what is connected before you upgrade",
      workspaceStatus: "Workspace status",
      authenticated: "Authenticated",
      demoPreview: "Demo preview",
      subscriptionState: "Subscription state",
      remainingCredits: "Remaining credits",
      exportMode: "Export mode",
      nextStep: "Next step",
      unauthenticatedHint: "Use the sign-in bar above to connect a real workspace and sync billing state."
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
  nav: {
    today: "今日",
    queue: "队列",
    qualified: "已通过",
    exports: "导出",
    settings: "设置",
    dashboard: "总览",
    import: "导入",
    leads: "复核队列",
    saved: "已保存账户",
    icp: "ICP",
    credits: "账单",
    analytics: "流程分析",
    account: "账户"
  },
  pages: {
    dashboard: {
      eyebrow: "今日",
      title: "今日",
      copy: "直接看到当前下一步、主要阻断点，以及这个工作空间的流程进度。"
    },
    queue: {
      eyebrow: "队列",
      title: "队列",
      copy: "在同一条作业路径里完成加网站、发扫描、做复核，不再来回切页面。"
    },
    qualified: {
      eyebrow: "已通过",
      title: "已通过账户",
      copy: "这里集中处理已经通过研究判断、准备分配负责人、备注和交接的账户。"
    },
    exports: {
      eyebrow: "导出",
      title: "导出",
      copy: "选择导出模板，准备 CRM 交接，把已通过账户有序移出工作空间。"
    },
    settings: {
      eyebrow: "设置",
      title: "设置",
      copy: "集中配置 ICP、工作空间身份和访问方式，不打断主流程。"
    },
    leads: {
      eyebrow: "复核队列",
      title: "复核队列",
      copy: "先处理新导入和 researching 阶段的账户，再把真正可推进的账户移入已保存列表。"
    },
    icp: {
      eyebrow: "ICP",
      title: "ICP",
      copy: "先定义 LeadCue 如何判断匹配度、紧迫度和可执行性，再让团队继续扫描网站。"
    },
    billing: {
      eyebrow: "账单",
      title: "账单",
      copy: "在工作空间内直接查看积分、订阅状态和导出能力。"
    },
    import: {
      eyebrow: "批量导入",
      title: "导入目标网站",
      copy: "粘贴域名或上传 CSV，把要处理的网站先加入当前工作空间的复核队列。"
    },
    saved: {
      eyebrow: "已保存账户",
      title: "已保存账户",
      copy: "这里保留已经通过判断、准备交给外拓或 CRM 的账户。"
    },
    analytics: {
      eyebrow: "流程",
      title: "流程分析",
      copy: "看清网站如何进入队列、变成 qualified 账户，并最终从工作空间导出。"
    },
    account: {
      eyebrow: "账户",
      title: "账户",
      copy: "更新工作空间身份和密码访问，同时不打断当前 workflow。"
    }
  },
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
      demoPreviewIntro: "当前为演示预览。免费开始后即可保存潜在客户卡片、积分记录和导出历史。",
      sampleWorkspaceData: "__ERROR__ 当前显示示例工作空间数据。",
      sampleWorkspaceDataPlain: "当前显示示例工作空间数据。",
      workspaceDataUnavailable: "当前无法加载工作空间数据。请刷新后重试。",
      billingActiveSetup: "订阅已生效。请先完成下面的首次网站调研流程。",
      workspaceCreatedSetup: "LeadCue 已准备好。请先完成下面的首次网站调研流程。",
      createWorkspaceRequired: "已登录。正在为你的首次调研准备 LeadCue。",
      workspaceCreateFailed: "当前无法准备 LeadCue，请稍后重试。",
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
      workspaceNotFound: "未找到 LeadCue 数据空间。",
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
      workspaceReadyTitle: "从第一个网站开始，__NAME__。",
      intro: "LeadCue 已按 website-first outbound research 的流程准备好。完成一次扫描后，你会得到包含匹配度、来源证据、破冰话术和导出备注的潜在客户卡片。",
      progress: "__COUNT__/4 已完成",
      markComplete: "标记完成",
      checklistLabel: "首次网站调研清单",
      setupSnapshot: "Agency Profile",
      service: "服务定位",
      industries: "目标客群",
      firstTarget: "首个网站",
      prepareFirstScan: "准备网站调研",
      runFirstScan: "执行首次扫描",
      reviewIcp: "调整 Agency Profile",
      tasks: {
        profileSaved: "Agency Profile 已调好",
        firstWebsiteQueued: "已选择首个网站",
        firstProspectCard: "已保存首张潜在客户卡片",
        exportReady: "准备好导出交接"
      },
      descriptions: {
        profileSaved: "匹配度评分已围绕 __INDUSTRIES__ 调整。",
        profileTodo: "先设置你的服务定位和目标客群，后续匹配度和机会信号才会更准。",
        websiteQueued: "已准备进行 website-first 调研：__URL__",
        agencySaved: "已把你的 agency 网站作为上下文：__URL__",
        websiteTodo: "添加第一个潜在客户网站，用来生成来源证据和外联上下文。",
        firstCardDone: "已保存 __COUNT__ 张潜在客户卡片。",
        firstCardTodo: "运行第一次网站扫描，保存包含破冰话术和可导出备注的 Prospect Card。",
        exportReadyDone: "首个已保存账户已经可以导出到 CSV 或 CRM。",
        exportReadyTodo: "保存 Prospect Card 后，可在导出页把合格账户交接给外联流程。"
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
    },
    workbench: {
      title: "流程通道",
      import: {
        eyebrow: "导入",
        title: "先建立批量名单",
        copy: "粘贴域名或上传 CSV，再进入队列逐站判断。",
        metricLabel: "已排队网站"
      },
      queue: {
        eyebrow: "复核",
        title: "处理下一批网站",
        copy: "先分清哪些网站还没扫，哪些网站已经需要人工判断。",
        metricLabel: "待复核"
      },
      saved: {
        eyebrow: "已保存",
        title: "交接已通过判断的账户",
        copy: "只有当网站证据和联系角度都足够清晰时，才把账户推进到这里。",
        metricLabel: "可交接"
      },
      scan: {
        eyebrow: "扫描台",
        title: "执行下一次扫描",
        copy: "保留单站扫描，但让它成为批量流程中的一条通道，而不是整套后台的中心。",
        metricLabel: "正在研究"
      }
    },
    queuePanel: {
      eyebrow: "队列快照",
      title: "下一步该看什么",
      ready: "待扫描",
      researching: "研究中",
      imported: "已导入",
      workspaceSource: "工作空间线索",
      openSite: "打开网站",
      moveToScanDesk: "送去扫描台",
      reviewCard: "打开卡片",
      emptyTitle: "当前没有待处理的网站。",
      emptyCopy: "先导入名单，或完成第一次扫描，为团队建立复核工作。"
    },
    savedPanel: {
      eyebrow: "已保存交接",
      title: "哪些账户已经可以导出",
      qualified: "已通过判断",
      outreachQueued: "待外拓",
      exported: "已导出",
      openCard: "打开卡片",
      emptyTitle: "还没有可交接的已保存账户。",
      emptyCopy: "当账户的匹配度、负责人和备注都准备好后，再把它从复核队列移过来。"
    },
    nextAction: {
      startWorkspace: "免费开始",
      createWorkspace: "准备 LeadCue",
      setupRequired: "正在准备账户",
      createWorkspaceTitle: "正在为你的首次调研准备 LeadCue",
      createWorkspaceCopy:
        "你已经登录。LeadCue 正在自动准备 Agency Profile、积分、网站队列、Prospect Card 和导出所需的数据空间。",
      importWebsites: "导入网站名单",
      openQueue: "打开复核队列",
      manualScan: "改用手工扫描",
      sampleTitle: "当前显示的是演示工作台",
      sampleCopy: "登录后可回到已保存的调研数据；也可以先免费开始，再导入网站名单。",
      loadErrorTitle: "暂时无法打开你的调研数据",
      loadErrorCopy: "你之前的队列和导出内容仍受保护。请先刷新；如果问题持续，再重新登录。",
      retryWorkspace: "刷新数据",
      manualEyebrow: "手工通道",
      manualTitle: "如果只想研究一个网站",
      manualCopy: "把单站扫描保留下来做临时研究，但不要再让它占据首页主路径。",
      openManual: "打开手工扫描"
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
  reviewQueue: {
    eyebrow: "复核队列",
    title: "复核已导入和 researching 阶段的账户",
    controlsLabel: "复核队列筛选项",
    searchLabel: "搜索队列",
    statusLabel: "状态",
    sourceLabel: "来源",
    sourceAll: "全部来源",
    sourceImported: "仅导入名单",
    workspaceSource: "工作空间线索",
    statusAll: "全部状态",
    statusReady: "待扫描",
    statusResearching: "研究中",
    resultsSummary: "显示 __VISIBLE__ / __TOTAL__ 条队列项目",
    readySummary: "当前有 __COUNT__ 条待处理",
    tableLabel: "复核队列",
    nextStepLabel: "下一步",
    openSite: "打开网站",
    moveToScanDesk: "送去扫描台",
    openCard: "打开卡片",
    emptyTitle: "还没有复核队列。",
    emptyCopy: "先导入网站，或完成第一次扫描来建立复核队列。",
    emptyFilteredTitle: "当前筛选下没有匹配项。",
    emptyFilteredCopy: "放宽筛选条件，查看更多已导入或 researching 阶段的网站。",
    sideEyebrow: "队列健康度",
    sideTitle: "每天把队列向前推",
    sideCopy: "复核队列是 research 进入 qualification 的地方。优先把待扫描网站推进到 researching，再从那里推进到 qualified。",
    importedCountLabel: "已导入网站"
  },
  importer: {
    eyebrow: "批量导入",
    title: "把网站加入复核队列",
    copy: "支持从 Apollo、Clay、CSV 文件、目录名单，或手动整理的名单中导入。",
    openQueue: "打开复核队列",
    sourceLabel: "来源",
    notesLabel: "备注说明",
    textareaLabel: "粘贴域名或网址",
    textareaPlaceholder: "acme.com\nnorthstar.io\nhttps://example.org",
    submit: "加入队列",
    upload: "上传 CSV 或 TXT",
    summaryEyebrow: "队列概览",
    summaryTitle: "当前导入队列情况",
    summaryImported: "已导入",
    summaryReady: "待扫描",
    summaryResearching: "研究中",
    historyEyebrow: "已导入网站",
    historyTitle: "导入记录",
    historyCount: "共 __COUNT__ 个网站",
    statusLabel: "状态",
    nextStepLabel: "后续处理",
    remove: "移除",
    emptyTitle: "还没有导入网站。",
    emptyCopy: "先粘贴域名或上传文件，这里会显示导入记录。",
    sourceOptions: {
      manual: "手动整理名单",
      csv: "CSV 文件",
      apollo: "Apollo",
      clay: "Clay",
      directory: "目录名单"
    },
    messages: {
      added: "已加入 __COUNT__ 个网站，已跳过 __SKIPPED__ 条重复或无效内容。",
      noWebsitesAdded: "没有识别到可导入的网站，请检查域名格式后重试。",
      fileReadFailed: "文件读取失败，请上传 CSV、TXT 或 TSV 文件。",
      queueUpdated: "导入队列已更新。"
    }
  },
  savedAccounts: {
    eyebrow: "已保存账户",
    title: "已通过判断、可交接的账户",
    tableLabel: "已保存账户",
    statusQualified: "已通过判断",
    resultsSummary: "显示 __VISIBLE__ / __TOTAL__ 个已保存账户",
    emptyTitle: "还没有可交接的已保存账户。",
    emptyCopy: "当账户的匹配度、负责人和备注都准备好后，再把它从 researching 推进过来。",
    emptyFilteredTitle: "当前视图下没有匹配的已保存账户。",
    emptyFilteredCopy: "放宽搜索或分数筛选，查看更多已保存账户。"
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
    overviewTitle: "这条 research workflow 走得怎么样",
    emptyTitle: "还没有流程数据",
    emptyCopy: "先导入网站。等队列开始进入研究、判断和导出之后，这里的流程分析才会逐步出现。",
    kpis: {
      importedWebsites: "已导入网站",
      reviewQueueReady: "待复核",
      qualifiedAccounts: "已通过判断",
      exportsCompleted: "已完成导出"
    },
    workflowFunnel: {
      eyebrow: "流程漏斗",
      title: "从导入到外拓交接",
      imported: "已导入",
      importedMeta: "已进入工作空间队列的网站",
      reviewing: "研究中",
      reviewingMeta: "占已导入网站的 __PERCENT__",
      qualified: "已通过判断",
      qualifiedMeta: "占活跃复核量的 __PERCENT__",
      exported: "已导出",
      exportedMeta: "占已通过判断账户的 __PERCENT__"
    },
    stageMix: {
      eyebrow: "阶段分布",
      title: "已保存账户目前停在哪",
      accountsSuffix: "__COUNT__ 个账户"
    },
    queueSources: {
      eyebrow: "导入来源",
      title: "队列主要由哪些来源补充",
      accountsSuffix: "__COUNT__ 个网站"
    },
    scanOutcomes: {
      eyebrow: "扫描结果",
      title: "队列进入扫描台后发生了什么",
      completed: "已完成",
      failed: "失败",
      processing: "处理中",
      failureSuffix: "__COUNT__ 次失败",
      noFailures: "最近没有失败",
      noFailuresCopy: "完成扫描正在稳定流转，没有明显的错误聚集。"
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
      reviewBacklog: "待扫描的网站多于正在研究的账户，建议先集中清一轮队列。",
      qualificationGap: "正在研究的账户多于已通过判断的账户，当前更可能卡在人工判断或负责人跟进上。",
      exportGap: "已通过判断的账户增长快于导出量，说明 CRM 或外拓交接环节还有堵点。",
      keepMoving: "当前节奏正常，继续导入名单、推进处理并完成导出即可。",
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
    summary: {
      currentPlan: "当前套餐",
      scansLeft: "剩余扫描次数",
      resetDate: "重置日期",
      workspaceStatus: "工作空间状态"
    },

    usage: {
      eyebrow: "积分余额",
      title: "剩余 __COUNT__ 次扫描",
      summary: "__USED__ 积分已在本月 __PLAN__ 套餐中使用。只有当扫描生成并保存了可用的潜在客户卡片后才会扣费。",
      usedLabel: "本月已使用",
      remainingLabel: "当前剩余",
      totalLabel: "每月扫描额度",
      usagePercent: "已使用 __COUNT__%"
    },
    kpis: {
      subscription: "订阅状态",
      creditReset: "积分重置时间",
      billingPeriodEnd: "账单周期结束",
      noPaidCycle: "暂无付费账单周期"
    },
    meterLabel: "本月积分使用量",
    actions: {
      manageBilling: "管理账单",
      exportCsv: "导出 CSV",
      exportCurrentFields: "导出当前字段",
      faq: "账单常见问题",
      comparePlans: "对比套餐"
    },
    plans: {
      eyebrow: "套餐路径",
      title: "在不改变流程的情况下扩展积分",
      compareEyebrow: "套餐对比",
      compareTitle: "按每月扫描量对比套餐",
      compareCopy: "只有当扫描量成为真正瓶颈时，再使用完整对比来升级。",
      currentPlan: "当前套餐",
      currentPlanBadge: "当前",
      recommendedBadge: "推荐",
      manageCurrent: "管理当前套餐",
      choosePlan: "选择 __PLAN__",
      scansPerMonth: "每月 __COUNT__ 次扫描",
      monthlyPrice: "$__PRICE__/月",
      includedCredits: "每月积分",
      creditLift: "积分提升",
      additionalCredits: "比当前多 __COUNT__ 次扫描",
      highestVolume: "最高额度",
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
      nextStep: "下一步",
      unauthenticatedHint: "请使用上方登录入口连接真实工作空间，并同步账单状态。"
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
  nav: {
    today: "今日",
    queue: "キュー",
    qualified: "承認済み",
    exports: "エクスポート",
    settings: "設定",
    dashboard: "ダッシュボード",
    import: "インポート",
    leads: "レビューキュー",
    saved: "保存済みアカウント",
    icp: "ICP",
    credits: "請求",
    analytics: "ワークフロー",
    account: "アカウント"
  },
  pages: {
    dashboard: {
      eyebrow: "今日",
      title: "今日",
      copy: "このワークスペースで今やるべきこと、主なボトルネック、進捗をすぐに確認できます。"
    },
    queue: {
      eyebrow: "キュー",
      title: "キュー",
      copy: "サイト追加、スキャン実行、レビュー作業を同じワークフローレーンの中で進めます。"
    },
    qualified: {
      eyebrow: "承認済み",
      title: "承認済みアカウント",
      copy: "調査を通過し、担当・メモ・引き渡し準備に進めるアカウントをここで扱います。"
    },
    exports: {
      eyebrow: "エクスポート",
      title: "エクスポート",
      copy: "CRM 向けの引き渡しを整え、プリセットを選び、承認済みアカウントをきれいに外へ出します。"
    },
    settings: {
      eyebrow: "設定",
      title: "設定",
      copy: "ICP、ワークスペース情報、アクセスを主作業フローを崩さずまとめて管理します。"
    },
    leads: {
      eyebrow: "レビューキュー",
      title: "レビューキュー",
      copy: "インポート済みまたは調査中のアカウントを処理してから、保存済みの引き渡しリストに移動します。"
    },
    icp: {
      eyebrow: "ICP",
      title: "ICP",
      copy: "チームがさらにサイトをスキャンする前に、LeadCue が適合度・緊急度・実行可能性をどう評価するかを定義します。"
    },
    billing: {
      eyebrow: "請求",
      title: "請求",
      copy: "ワークスペースを離れずにクレジット・サブスクリプション状態・エクスポート容量を確認します。"
    },
    import: {
      eyebrow: "一括リサーチ",
      title: "サイトをインポート",
      copy: "ドメインを貼り付けるか CSV をアップロードして、このワークスペースのサイトファーストなレビューキューを作成します。"
    },
    saved: {
      eyebrow: "保存済みアカウント",
      title: "保存済みアカウント",
      copy: "レビューを通過し、アウトリーチまたは CRM 引き渡しの準備ができたアカウントをエクスポートします。"
    },
    analytics: {
      eyebrow: "ワークフロー",
      title: "ワークフロー分析",
      copy: "サイトがキューに入り、適格アカウントになり、エクスポートとしてワークスペースから出ていく流れを追跡します。"
    },
    account: {
      eyebrow: "アカウント",
      title: "アカウント",
      copy: "ワークフローを中断することなく、ワークスペースの ID・パスワードアクセスを更新します。"
    }
  },
  billing: {
    plans: {
      useCases: {
        free: "有料展開前に実際のウェブサイトでワークフローを検証します。",
        starter: "週次のアウトバウンド習慣を構築する1人のオペレーター向け。",
        pro: "見込み客調査を再現可能なパイプラインに変えるエージェンシー向け。",
        agency: "複数のクライアントオファー間でスキャンクレジットを共有するチーム向け。"
      }
    }
  },
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
      demoPreviewIntro: "デモプレビューです。無料で始めると Prospect Card、クレジット、エクスポート履歴を保存できます。",
      sampleWorkspaceData: "__ERROR__ サンプルのワークスペースデータを表示しています。",
      sampleWorkspaceDataPlain: "サンプルのワークスペースデータを表示しています。",
      workspaceDataUnavailable: "現在このワークスペースを読み込めません。更新して再試行してください。",
      billingActiveSetup: "請求は有効です。下の最初の website-first リサーチを完了してください。",
      workspaceCreatedSetup: "LeadCue の準備ができました。下の最初の website-first リサーチを完了してください。",
      createWorkspaceRequired: "ログインしました。最初のリサーチに向けて LeadCue を準備しています。",
      workspaceCreateFailed: "現在 LeadCue を準備できません。",
      signedIn: "ログインしました。",
      scanDeskLoaded: "__URL__ をスキャンデスクに読み込みました。メモを確認してからスキャンを実行してください。",
      scanDeskMissingTarget: "スキャンデスクに見込み客サイトを追加すると、最初の保存済みカードを作成できます。",
      samePlan: "現在すでに __PLAN__ プランです。",
      checkoutUnavailable: "現在このプランではチェックアウトを利用できません。",
      leadDetailUnavailable: "リード詳細を読み込めません。",
      scanInvalidUrl:
        "有効な見込み客サイト URL を入力してください。クレジットは消費されませんでした。URL を修正して再試行してください。",
      scanSaved: "__COMPANY__ を Prospect Card として保存しました。消費クレジット: __COUNT__。",
      scanComplete: "スキャンが完了しました。エクスポートやメール作成の前に Prospect Card を確認してください。",
      scanFailed:
        "スキャンに失敗しました。クレジットは消費されませんでした。URL を修正して再試行してください。",
      onboardingDismissed: "初期設定ガイドを閉じました。",
      onboardingUpdateFailed: "オンボーディングを更新できません。",
      csvExportPrepared: "__LABEL__ フィールドで CSV を準備しました。",
      csvExportFailed: "CSV エクスポートに失敗しました。",
      billingPortalUnavailable: "請求ポータルはまだ利用できません。",
      signedOutDemo: "ログアウトしました。デモプレビューを表示しています。",
      selectLeadBeforeExport: "エクスポートする前に少なくとも 1 件のリードを選択してください。",
      selectedLeadExported: "選択した __COUNT__ 件のリードを __LABEL__ フィールド付きでエクスポートしました。",
      selectedLeadExportFailed: "選択したリードのエクスポートに失敗しました。",
      signInRequired: "続行するにはログインしてください。",
      workspaceNotFound: "LeadCue のデータスペースが見つかりません。",
      subscriptionInactive: "サブスクリプションが有効ではありません。サイトをさらにスキャンする前に請求を更新してください。",
      insufficientCredits: "このリクエストに必要なスキャンクレジットがワークスペースにありません。",
      createFirstSavedCard: "ログインした状態で Chrome 拡張機能または POST /api/scans を使って最初の保存済みカードを作成してください。"
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
      welcomeTitle: "__NAME__ さん、ようこそ。",
      workspaceReadyTitle: "__NAME__ さん、まず 1 件のウェブサイトから始めましょう。",
      intro:
        "LeadCue は website-first outbound research 向けに準備済みです。1 回スキャンすると、適合度、根拠付きメモ、冒頭文、エクスポート用コンテキストを含む Prospect Card を作成できます。",
      progress: "__COUNT__/4 完了",
      markComplete: "完了としてマーク",
      checklistLabel: "最初の website-first リサーチチェックリスト",
      setupSnapshot: "Agency Profile",
      service: "オファー",
      industries: "最適なセグメント",
      firstTarget: "最初のウェブサイト",
      prepareFirstScan: "ウェブサイト調査を準備",
      runFirstScan: "最初のスキャンを実行",
      reviewIcp: "Agency Profile を調整",
      tasks: {
        profileSaved: "Agency Profile を調整済み",
        firstWebsiteQueued: "最初のウェブサイトを選択済み",
        firstProspectCard: "最初の Prospect Card を保存済み",
        exportReady: "エクスポート引き渡し準備"
      },
      descriptions: {
        profileSaved: "適合度スコアリングは __INDUSTRIES__ 向けに調整されています。",
        profileTodo: "オファーと最適なセグメントを設定すると、適合度と機会シグナルがぶれにくくなります。",
        websiteQueued: "website-first リサーチ準備完了: __URL__",
        agencySaved: "エージェンシーサイトを文脈として保存しました: __URL__",
        websiteTodo: "最初の見込み客サイトを追加して、根拠付きメモとアウトリーチ文脈を生成します。",
        firstCardDone: "__COUNT__ 件の Prospect Card が保存済みです。",
        firstCardTodo: "最初のウェブサイトスキャンを実行し、冒頭文とエクスポート用メモ付きの Prospect Card を保存してください。",
        exportReadyDone: "最初の保存済みアカウントは CSV または CRM へ引き渡せます。",
        exportReadyTodo: "Prospect Card を保存したら、エクスポートで適格アカウントをアウトリーチへ渡します。"
      }
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
      eyebrow: "見込み客カード",
      title: "最初の保存済みカードはここに表示されます",
      copy: "LeadCue はスキャン完了後に適合スコア、サイトの根拠、アウトリーチの切り口、冒頭文、エクスポート用メモを保存します。",
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
    },
    workbench: {
      title: "ワークフローレーン",
      import: {
        eyebrow: "インポート",
        title: "一括リストを作成",
        copy: "チームがアカウントのレビューを始める前に、ドメインを貼り付けるか CSV をアップロードします。",
        metricLabel: "キュー内のウェブサイト"
      },
      queue: {
        eyebrow: "レビュー",
        title: "次のウェブサイトを仕分け",
        copy: "まだスキャンが必要なアカウントと、すでに人手で適格性確認が必要なアカウントを確認します。",
        metricLabel: "レビュー待ち"
      },
      saved: {
        eyebrow: "保存済み",
        title: "承認済みアカウントを引き渡す",
        copy: "サイトの根拠とアウトリーチの切り口が十分に揃った場合のみ、ここへ移動してください。",
        metricLabel: "引き渡し準備完了"
      },
      scan: {
        eyebrow: "スキャンデスク",
        title: "次のウェブサイトをスキャン",
        copy: "単一サイトの調査は残しつつ、アプリ全体のホームフローではなく、一括ワークフロー内のレーンとして扱います。",
        metricLabel: "調査中"
      }
    },
    queuePanel: {
      eyebrow: "キューの概要",
      title: "次にレビューが必要なもの",
      ready: "準備完了",
      researching: "調査中",
      imported: "インポート済み",
      workspaceSource: "ワークスペースリード",
      openSite: "サイトを開く",
      moveToScanDesk: "スキャンデスクへ移動",
      reviewCard: "カードを開く",
      emptyTitle: "キューで待機中のウェブサイトはありません。",
      emptyCopy: "リストをインポートするか、最初のウェブサイトをスキャンしてチームの作業を作成してください。"
    },
    savedPanel: {
      eyebrow: "保存済み引き渡し",
      title: "すでにエクスポート可能なもの",
      qualified: "適格",
      outreachQueued: "アウトリーチ待ち",
      exported: "エクスポート済み",
      openCard: "カードを開く",
      emptyTitle: "準備ができた保存済みアカウントはまだありません。",
      emptyCopy: "担当者、ステージ、メモが揃ったら、強いアカウントをレビューキューから移してください。"
    },
    nextAction: {
      startWorkspace: "無料で始める",
      createWorkspace: "LeadCue を準備",
      setupRequired: "アカウントを準備中",
      createWorkspaceTitle: "最初のリサーチに向けて LeadCue を準備中",
      createWorkspaceCopy:
        "ログイン済みです。LeadCue は Agency Profile、クレジット、ウェブサイトキュー、Prospect Card、エクスポート用のデータスペースを自動で準備しています。",
      importWebsites: "ウェブサイトをインポート",
      openQueue: "レビューキューを開く",
      manualScan: "代わりに手動スキャンを使う",
      sampleTitle: "これはデモ用ワークスペースのプレビューです",
      sampleCopy:
        "ログインすると保存済みリサーチを再開できます。ウェブサイトをレビューキューに入れる前に無料で始めることもできます。",
      loadErrorTitle: "リサーチデータを再度開けませんでした",
      loadErrorCopy:
        "保存済みキューとエクスポート済みコンテキストは保護されています。まず更新し、問題が続く場合は再度ログインしてください。",
      retryWorkspace: "データを更新",
      manualEyebrow: "手動レーン",
      manualTitle: "代わりに 1 件のウェブサイトだけ調査しますか？",
      manualCopy: "単発の調査のために単一サイトのスキャンを残しつつ、ホームの標準フローではなく補助レーンとして扱います。",
      openManual: "手動スキャンを開く"
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
  billing: {
    plans: {
      useCases: {
        free: "유료 확장 전에 실제 웹사이트로 워크플로우를 검증하세요.",
        starter: "주간 아웃바운드 리듬을 구축하는 1인 운영자에게 적합합니다.",
        pro: "잠재 고객 조사를 재현 가능한 파이프라인으로 전환하는 에이전시에 적합합니다.",
        agency: "여러 클라이언트 오퍼 간에 스캔 크레딧을 공유하는 팀에 적합합니다."
      }
    }
  },
  nav: {
    today: "오늘",
    queue: "대기열",
    qualified: "검증됨",
    exports: "내보내기",
    settings: "설정",
    dashboard: "개요",
    import: "가져오기",
    leads: "검토 대기열",
    saved: "저장된 계정",
    icp: "ICP",
    credits: "결제",
    analytics: "워크플로우",
    account: "계정"
  },
  pages: {
    dashboard: {
      eyebrow: "오늘",
      title: "오늘",
      copy: "이 워크스페이스에서 지금 해야 할 일, 주요 막힘, 진행 상황을 바로 확인하세요."
    },
    queue: {
      eyebrow: "대기열",
      title: "대기열",
      copy: "같은 작업 흐름 안에서 웹사이트 추가, 스캔 실행, 검토 작업까지 이어서 처리하세요."
    },
    qualified: {
      eyebrow: "검증됨",
      title: "검증된 계정",
      copy: "리서치를 통과했고 담당자, 메모, 인계를 붙일 준비가 된 계정을 여기서 관리하세요."
    },
    exports: {
      eyebrow: "내보내기",
      title: "내보내기",
      copy: "CRM 인계를 준비하고, 프리셋을 고르고, 검증된 계정을 깔끔하게 워크스페이스 밖으로 내보내세요."
    },
    settings: {
      eyebrow: "설정",
      title: "설정",
      copy: "ICP, 워크스페이스 정보, 접근 권한을 한곳에서 관리하되 주 작업 흐름은 끊지 않습니다."
    },
    leads: {
      eyebrow: "검토 대기열",
      title: "검토 대기열",
      copy: "저장된 인계 목록으로 이동하기 전에 가져오거나 리서치 중인 계정을 먼저 검토하세요."
    },
    icp: {
      eyebrow: "ICP",
      title: "ICP",
      copy: "더 많은 웹사이트를 스캔하기 전에 LeadCue가 적합도, 긴급도, 실행 가능성을 어떻게 평가할지 정의하세요."
    },
    billing: {
      eyebrow: "결제",
      title: "결제",
      copy: "워크스페이스를 떠나지 않고 크레딧, 구독 상태, 내보내기 가능 여부를 확인하세요."
    },
    import: {
      eyebrow: "일괄 리서치",
      title: "웹사이트 가져오기",
      copy: "도메인을 붙여넣거나 CSV를 업로드하여 이 워크스페이스의 웹사이트 우선 검토 대기열을 만드세요."
    },
    saved: {
      eyebrow: "저장된 계정",
      title: "저장된 계정",
      copy: "이미 검토를 통과했고 아웃리치 또는 CRM 인계 준비가 된 계정을 내보내세요."
    },
    analytics: {
      eyebrow: "워크플로우",
      title: "워크플로우 분석",
      copy: "웹사이트가 대기열에 들어오고, 검증된 계정이 되며, 내보내기로 워크스페이스를 떠나는 흐름을 추적하세요."
    },
    account: {
      eyebrow: "계정",
      title: "계정",
      copy: "워크플로우를 중단하지 않고 워크스페이스 ID와 비밀번호 접근을 업데이트하세요."
    }
  },
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
      demoPreviewIntro: "데모 미리보기입니다. 무료로 시작하면 Prospect Card, 크레딧, 내보내기 기록을 저장할 수 있습니다.",
      sampleWorkspaceData: "__ERROR__ 샘플 워크스페이스 데이터를 표시합니다.",
      sampleWorkspaceDataPlain: "샘플 워크스페이스 데이터를 표시합니다.",
      workspaceDataUnavailable: "지금은 이 워크스페이스를 불러올 수 없습니다. 새로고침 후 다시 시도하세요.",
      billingActiveSetup: "결제가 활성화되었습니다. 아래 첫 website-first 리서치를 완료하세요.",
      workspaceCreatedSetup: "LeadCue가 준비되었습니다. 아래 첫 website-first 리서치를 완료하세요.",
      createWorkspaceRequired: "로그인되었습니다. 첫 리서치를 위해 LeadCue를 준비하고 있습니다.",
      workspaceCreateFailed: "지금은 LeadCue를 준비할 수 없습니다.",
      signedIn: "로그인되었습니다.",
      scanDeskLoaded: "__URL__ 가 스캔 데스크에 로드되었습니다. 메모를 검토한 뒤 스캔을 실행하세요.",
      scanDeskMissingTarget: "첫 저장 카드를 만들려면 스캔 데스크에 잠재 고객 웹사이트를 추가하세요.",
      samePlan: "이미 __PLAN__ 플랜을 사용 중입니다.",
      checkoutUnavailable: "현재 이 플랜은 체크아웃을 사용할 수 없습니다.",
      leadDetailUnavailable: "리드 상세 정보를 불러올 수 없습니다.",
      scanInvalidUrl:
        "유효한 잠재고객 사이트 URL을 입력하세요. 크레딧은 차감되지 않았습니다. URL을 수정한 뒤 다시 시도하세요.",
      scanSaved: "__COMPANY__ 가 Prospect Card로 저장되었습니다. 사용한 크레딧: __COUNT__.",
      scanComplete: "스캔이 완료되었습니다. 내보내기나 아웃리치 작성 전에 Prospect Card를 확인하세요.",
      scanFailed: "스캔에 실패했습니다. 크레딧은 차감되지 않았습니다. URL을 수정한 뒤 다시 시도하세요.",
      onboardingDismissed: "설정 가이드를 닫았습니다.",
      onboardingUpdateFailed: "온보딩을 업데이트할 수 없습니다.",
      csvExportPrepared: "__LABEL__ 필드로 CSV를 준비했습니다.",
      csvExportFailed: "CSV 내보내기에 실패했습니다.",
      billingPortalUnavailable: "결제 포털을 아직 사용할 수 없습니다.",
      signedOutDemo: "로그아웃되었습니다. 데모 미리보기를 표시합니다.",
      selectLeadBeforeExport: "내보내기 전에 최소 한 개의 리드를 선택하세요.",
      selectedLeadExported: "선택한 __COUNT__개 리드를 __LABEL__ 필드로 내보냈습니다.",
      selectedLeadExportFailed: "선택한 리드 내보내기에 실패했습니다.",
      signInRequired: "계속하려면 로그인하세요.",
      workspaceNotFound: "LeadCue 데이터 공간을 찾을 수 없습니다.",
      subscriptionInactive: "구독이 활성화되어 있지 않습니다. 사이트를 더 스캔하기 전에 결제를 업데이트하세요.",
      insufficientCredits: "이 요청을 처리하기에 워크스페이스의 스캔 크레딧이 부족합니다.",
      createFirstSavedCard: "로그인한 상태에서 Chrome 확장 프로그램이나 POST /api/scans 를 사용해 첫 저장 카드를 만드세요."
    }
  },
  dashboard: {
    onboarding: {
      eyebrow: "첫 실행",
      welcomeTitle: "환영합니다, __NAME__님.",
      workspaceReadyTitle: "__NAME__님, 첫 웹사이트부터 시작하세요.",
      intro:
        "LeadCue는 website-first outbound research 흐름에 맞게 준비되었습니다. 한 번 스캔하면 적합도, 근거 메모, 첫 문장, 내보내기용 컨텍스트가 담긴 Prospect Card를 만들 수 있습니다.",
      progress: "__COUNT__/4 준비됨",
      markComplete: "완료로 표시",
      checklistLabel: "첫 website-first 리서치 체크리스트",
      setupSnapshot: "Agency Profile",
      service: "오퍼",
      industries: "최적 세그먼트",
      firstTarget: "첫 웹사이트",
      prepareFirstScan: "웹사이트 리서치 준비",
      runFirstScan: "첫 스캔 실행",
      reviewIcp: "Agency Profile 조정",
      tasks: {
        profileSaved: "Agency Profile 조정 완료",
        firstWebsiteQueued: "첫 웹사이트 선택됨",
        firstProspectCard: "첫 Prospect Card 저장됨",
        exportReady: "내보내기 인계 준비"
      },
      descriptions: {
        profileSaved: "적합도 스코어링이 __INDUSTRIES__에 맞게 조정되었습니다.",
        profileTodo: "오퍼와 최적 세그먼트를 설정하면 적합도와 기회 신호가 더 정확해집니다.",
        websiteQueued: "website-first 리서치 준비 완료: __URL__",
        agencySaved: "에이전시 사이트를 컨텍스트로 저장했습니다: __URL__",
        websiteTodo: "첫 잠재 고객 웹사이트를 추가해 근거 메모와 아웃리치 컨텍스트를 생성하세요.",
        firstCardDone: "__COUNT__개의 Prospect Card가 이미 저장되었습니다.",
        firstCardTodo: "첫 웹사이트 스캔을 실행해 첫 문장과 내보내기 메모가 포함된 Prospect Card를 저장하세요.",
        exportReadyDone: "첫 저장 계정을 CSV 또는 CRM으로 인계할 수 있습니다.",
        exportReadyTodo: "Prospect Card를 저장한 뒤 내보내기에서 검증된 계정을 아웃리치로 넘기세요."
      }
    },
    metrics: {
      ariaLabel: "워크스페이스 지표",
      savedProspects: "저장된 잠재 고객",
      currentPlan: "현재 플랜",
      creditsLeft: "남은 크레딧",
      subscription: "구독",
      usedThisMonth: "이번 달 __COUNT__ 사용됨"
    },
    leadsPanel: {
      eyebrow: "리드 목록",
      title: "저장된 잠재 고객",
      company: "회사",
      industry: "업종",
      fit: "적합도",
      confidence: "신뢰도",
      emptyTitle: "아직 저장된 잠재 고객이 없습니다.",
      emptyCopy: "확장 프로그램이나 API에서 웹사이트 스캔을 실행하면 저장된 Prospect Card가 여기에 표시됩니다.",
      filterLabel: "리드 필터",
      tableLabel: "저장된 리드"
    },
    emptyProspect: {
      eyebrow: "잠재 고객 카드",
      title: "첫 저장 카드가 여기에 표시됩니다",
      copy: "LeadCue는 스캔이 완료되면 적합도 점수, 웹사이트 근거, 아웃리치 각도, 첫 문장, 내보내기 메모를 저장합니다.",
      cta: "첫 스캔 준비"
    },
    icpPanel: {
      eyebrow: "ICP 설정",
      title: "에이전시 모드",
      serviceType: "서비스 유형",
      targetIndustries: "대상 업종",
      countries: "국가",
      tone: "톤",
      firstTarget: "첫 대상"
    },
    signalPanel: {
      eyebrow: "시그널",
      title: "현재 스캔 구성"
    },
    workbench: {
      title: "워크플로우 레인",
      import: {
        eyebrow: "가져오기",
        title: "일괄 목록 만들기",
        copy: "팀이 계정 검토를 시작하기 전에 도메인을 붙여넣거나 CSV를 업로드하세요.",
        metricLabel: "대기 중인 웹사이트"
      },
      queue: {
        eyebrow: "검토",
        title: "다음 웹사이트 선별",
        copy: "아직 스캔이 필요한 계정과 사람이 검증해야 하는 계정을 확인하세요.",
        metricLabel: "검토 준비됨"
      },
      saved: {
        eyebrow: "저장됨",
        title: "승인된 계정 인계",
        copy: "웹사이트 근거와 각도가 아웃리치에 충분할 때만 계정을 이곳으로 이동하세요.",
        metricLabel: "인계 준비됨"
      },
      scan: {
        eyebrow: "스캔 데스크",
        title: "다음 웹사이트 실행",
        copy: "단일 사이트 리서치는 유지하되 전체 앱의 기본 흐름이 아니라 일괄 워크플로우 안의 보조 레인으로 사용하세요.",
        metricLabel: "현재 리서치 중"
      }
    },
    queuePanel: {
      eyebrow: "대기열 개요",
      title: "다음에 검토할 항목",
      ready: "준비됨",
      researching: "리서치 중",
      imported: "가져옴",
      workspaceSource: "워크스페이스 리드",
      openSite: "사이트 열기",
      moveToScanDesk: "스캔 데스크로 이동",
      reviewCard: "카드 열기",
      emptyTitle: "대기열에서 기다리는 웹사이트가 없습니다.",
      emptyCopy: "목록을 가져오거나 첫 번째 웹사이트를 스캔해 팀의 작업을 만드세요."
    },
    savedPanel: {
      eyebrow: "저장된 인계",
      title: "이미 내보낼 준비가 된 항목",
      qualified: "적격",
      outreachQueued: "아웃리치 대기",
      exported: "내보냄",
      openCard: "카드 열기",
      emptyTitle: "아직 준비된 저장 계정이 없습니다.",
      emptyCopy: "담당자, 단계, 메모가 준비되면 강한 계정을 검토 대기열에서 이동하세요."
    },
    nextAction: {
      startWorkspace: "무료로 시작",
      createWorkspace: "LeadCue 준비",
      setupRequired: "계정 준비 중",
      createWorkspaceTitle: "첫 리서치를 위해 LeadCue 준비 중",
      createWorkspaceCopy:
        "로그인되었습니다. LeadCue가 Agency Profile, 크레딧, 웹사이트 대기열, Prospect Card, 내보내기용 데이터 공간을 자동으로 준비하고 있습니다.",
      importWebsites: "웹사이트 가져오기",
      openQueue: "검토 대기열 열기",
      manualScan: "수동 스캔 사용",
      sampleTitle: "데모 워크스페이스 미리보기입니다",
      sampleCopy: "로그인하면 저장된 리서치를 다시 열 수 있습니다. 웹사이트를 검토 대기열에 넣기 전에 무료로 시작할 수도 있습니다.",
      loadErrorTitle: "리서치 데이터를 다시 열 수 없습니다",
      loadErrorCopy: "저장된 대기열과 내보낸 컨텍스트는 보호됩니다. 먼저 새로고침하고, 문제가 계속되면 다시 로그인하세요.",
      retryWorkspace: "데이터 새로고침",
      manualEyebrow: "수동 레인",
      manualTitle: "웹사이트 하나만 리서치해야 하나요?",
      manualCopy: "일회성 리서치를 위해 단일 사이트 스캔은 유지하되 기본 홈 흐름이 아닌 보조 레인으로 사용하세요.",
      openManual: "수동 스캔 열기"
    }
  },
  options: {
    scanHistoryFilters: {
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
  nav: {
    today: "Heute",
    queue: "Queue",
    qualified: "Qualifiziert",
    exports: "Exporte",
    settings: "Einstellungen",
    dashboard: "Übersicht",
    import: "Importe",
    leads: "Review-Warteschlange",
    saved: "Gespeicherte Accounts",
    icp: "ICP",
    credits: "Abrechnung",
    analytics: "Ablauf",
    account: "Konto"
  },
  pages: {
    dashboard: {
      eyebrow: "Heute",
      title: "Heute",
      copy: "Sehen Sie sofort den nächsten Schritt, aktuelle Blocker und den Fortschritt dieses Workspaces."
    },
    queue: {
      eyebrow: "Queue",
      title: "Queue",
      copy: "Websites hinzufügen, Scans starten und Review-Arbeit in derselben Workflow-Spur abarbeiten."
    },
    qualified: {
      eyebrow: "Qualifiziert",
      title: "Qualifizierte Accounts",
      copy: "Hier werden Accounts verwaltet, die die Recherche bestanden haben und für Ownership, Notizen und Übergabe bereit sind."
    },
    exports: {
      eyebrow: "Exporte",
      title: "Exporte",
      copy: "CRM-Übergaben vorbereiten, ein Export-Preset wählen und qualifizierte Accounts sauber aus dem Workspace herausgeben."
    },
    settings: {
      eyebrow: "Einstellungen",
      title: "Einstellungen",
      copy: "ICP, Workspace-Identität und Zugriff an einem Ort pflegen, ohne den Hauptablauf zu unterbrechen."
    },
    leads: {
      eyebrow: "Review-Warteschlange",
      title: "Review-Warteschlange",
      copy: "Importierte oder in Recherche befindliche Accounts bearbeiten, bevor sie in die gespeicherte Übergabeliste verschoben werden."
    },
    icp: {
      eyebrow: "ICP",
      title: "ICP",
      copy: "Definieren Sie, wie LeadCue Fit, Dringlichkeit und Umsetzbarkeit bewerten soll, bevor das Team weitere Websites scannt."
    },
    billing: {
      eyebrow: "Abrechnung",
      title: "Abrechnung",
      copy: "Credits, Abonnementstatus und Exportkapazität überwachen, ohne den Workspace zu verlassen."
    },
    import: {
      eyebrow: "Batch-Recherche",
      title: "Websites importieren",
      copy: "Domains einfügen oder CSV hochladen, um eine website-first Review-Warteschlange für diesen Workspace aufzubauen."
    },
    saved: {
      eyebrow: "Gespeicherte Accounts",
      title: "Gespeicherte Accounts",
      copy: "Accounts exportieren, die bereits geprüft wurden und für Outbound- oder CRM-Übergabe bereit sind."
    },
    analytics: {
      eyebrow: "Workflow",
      title: "Workflow-Analytik",
      copy: "Nachverfolgen, wie Websites in die Warteschlange gelangen, zu qualifizierten Accounts werden und als Exporte den Workspace verlassen."
    },
    account: {
      eyebrow: "Konto",
      title: "Konto",
      copy: "Workspace-Identität und Passwortzugang aktualisieren, ohne den Workflow zu unterbrechen."
    }
  },
  billing: {
    plans: {
      useCases: {
        free: "Validieren Sie den Workflow mit echten Websites, bevor Sie kostenpflichtig erweitern.",
        starter: "Für Einzelunternehmer, die einen wöchentlichen Outbound-Rhythmus aufbauen.",
        pro: "Für Agenturen, die Prospect-Research in eine reproduzierbare Pipeline verwandeln.",
        agency: "Für Teams, die Scan-Credits über mehrere Kundenangebote hinweg teilen."
      }
    }
  },
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
        "Demo-Vorschau. Starten Sie kostenlos, um Prospect Cards, Credits und Exportverlauf zu speichern.",
      sampleWorkspaceData: "__ERROR__ Beispieldaten des Workspaces werden angezeigt.",
      sampleWorkspaceDataPlain: "Beispieldaten des Workspaces werden angezeigt.",
      workspaceDataUnavailable: "Dieser Workspace kann gerade nicht geladen werden. Aktualisieren Sie die Seite und versuchen Sie es erneut.",
      billingActiveSetup: "Abrechnung ist aktiv. Schließen Sie unten den ersten website-first Research-Lauf ab.",
      workspaceCreatedSetup: "LeadCue ist bereit. Schließen Sie unten den ersten website-first Research-Lauf ab.",
      createWorkspaceRequired: "Sie sind angemeldet. LeadCue wird für Ihren ersten Research-Lauf vorbereitet.",
      workspaceCreateFailed: "LeadCue kann gerade nicht vorbereitet werden.",
      signedIn: "Angemeldet.",
      scanDeskLoaded: "__URL__ ist im Scan-Bereich geladen. Prüfen Sie die Notizen und starten Sie dann den Scan.",
      scanDeskMissingTarget: "Fügen Sie im Scan-Bereich eine Prospect-Website hinzu, um die erste gespeicherte Karte zu erstellen.",
      samePlan: "Sie nutzen bereits den Tarif __PLAN__.",
      checkoutUnavailable: "Checkout ist für diesen Tarif derzeit nicht verfügbar.",
      leadDetailUnavailable: "Leaddetails konnten nicht geladen werden.",
      scanInvalidUrl:
        "Geben Sie eine gültige Prospect-URL ein. Es wurde kein Credit verbraucht. Korrigieren Sie die URL und versuchen Sie es erneut.",
      scanSaved: "__COMPANY__ wurde als Prospect Card gespeichert. Verbrauchte Credits: __COUNT__.",
      scanComplete:
        "Scan abgeschlossen. Prüfen Sie zuerst die Prospect Card, bevor Sie exportieren oder Outreach schreiben.",
      scanFailed:
        "Scan fehlgeschlagen. Es wurde kein Credit verbraucht. Korrigieren Sie die URL und versuchen Sie es erneut.",
      onboardingDismissed: "Setup-Anleitung ausgeblendet.",
      onboardingUpdateFailed: "Onboarding konnte nicht aktualisiert werden.",
      csvExportPrepared: "CSV mit __LABEL__ Feldern vorbereitet.",
      csvExportFailed: "CSV-Export fehlgeschlagen.",
      billingPortalUnavailable: "Das Billing-Portal ist noch nicht verfügbar.",
      signedOutDemo: "Abgemeldet. Die Demo-Vorschau wird angezeigt.",
      selectLeadBeforeExport: "Wählen Sie vor dem Export mindestens einen Lead aus.",
      selectedLeadExported: "__COUNT__ ausgewählte Leads mit __LABEL__ Feldern exportiert.",
      selectedLeadExportFailed: "Export der ausgewählten Leads fehlgeschlagen.",
      signInRequired: "Melden Sie sich an, um fortzufahren.",
      workspaceNotFound: "LeadCue-Datenbereich nicht gefunden.",
      subscriptionInactive:
        "Ihr Abonnement ist nicht aktiv. Aktualisieren Sie die Abrechnung, bevor Sie weitere Websites scannen.",
      insufficientCredits: "Dieser Workspace hat nicht genug Scan-Credits für diese Anfrage.",
      createFirstSavedCard:
        "Melden Sie sich an und nutzen Sie die Chrome-Erweiterung oder POST /api/scans, um die erste gespeicherte Karte zu erstellen."
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
      welcomeTitle: "Willkommen, __NAME__.",
      workspaceReadyTitle: "Beginnen Sie mit einer Website, __NAME__.",
      intro:
        "LeadCue ist für website-first outbound research eingerichtet. Ein Scan erstellt eine Prospect Card mit Fit-Score, quellenbasierten Notizen, First Lines und exportbereitem Kontext.",
      progress: "__COUNT__/4 erledigt",
      markComplete: "Als erledigt markieren",
      checklistLabel: "Checkliste für den ersten website-first Research-Lauf",
      setupSnapshot: "Agency Profile",
      service: "Angebot",
      industries: "Best-Fit-Segmente",
      firstTarget: "Erste Website",
      prepareFirstScan: "Website-Recherche vorbereiten",
      runFirstScan: "Ersten Scan starten",
      reviewIcp: "Agency Profile feinjustieren",
      tasks: {
        profileSaved: "Agency Profile abgestimmt",
        firstWebsiteQueued: "Erste Website ausgewählt",
        firstProspectCard: "Erste Prospect Card gespeichert",
        exportReady: "Exportbereite Übergabe"
      },
      descriptions: {
        profileSaved: "Das Fit-Scoring ist auf __INDUSTRIES__ abgestimmt.",
        profileTodo: "Legen Sie Angebot und Best-Fit-Segmente fest, damit Fit-Score und Opportunity Signals relevant bleiben.",
        websiteQueued: "Bereit für website-first Research: __URL__",
        agencySaved: "Agentur-Website als Kontext gespeichert: __URL__",
        websiteTodo: "Fügen Sie die erste Prospect-Website hinzu, um quellenbasierte Notizen und Outreach-Kontext zu erzeugen.",
        firstCardDone: "__COUNT__ Prospect Cards sind bereits gespeichert.",
        firstCardTodo: "Starten Sie den ersten Website-Scan, um eine Prospect Card mit First Lines und exportbereiten Notizen zu speichern.",
        exportReadyDone: "Der erste gespeicherte Account ist bereit für CSV- oder CRM-Übergabe.",
        exportReadyTodo: "Nach dem Speichern einer Prospect Card übergeben Sie qualifizierte Accounts über Exporte an Outreach."
      }
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
      fit: "Passung",
      confidence: "Vertrauen",
      emptyTitle: "Noch keine gespeicherten Prospects.",
      emptyCopy: "Führen Sie einen Website-Scan über die Erweiterung oder API aus, dann erscheinen gespeicherte Prospect Cards hier.",
      filterLabel: "Leads filtern",
      tableLabel: "Gespeicherte Leads"
    },
    emptyProspect: {
      eyebrow: "Prospect-Karte",
      title: "Ihre erste gespeicherte Karte erscheint hier",
      copy: "LeadCue speichert nach einem abgeschlossenen Scan Passungs-Score, Website-Belege, Outreach-Ansätze, Einstiegszeilen und Exportnotizen.",
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
    },
    workbench: {
      title: "Workflow-Bereiche",
      import: {
        eyebrow: "Importe",
        title: "Batch-Liste aufbauen",
        copy: "Fügen Sie Domains ein oder laden Sie eine CSV hoch, bevor das Team mit der Prüfung der Accounts beginnt.",
        metricLabel: "Websites in der Warteschlange"
      },
      queue: {
        eyebrow: "Prüfung",
        title: "Die nächsten Websites priorisieren",
        copy: "Sehen Sie, welche Accounts noch einen Scan brauchen und welche bereits eine manuelle Qualifizierung erfordern.",
        metricLabel: "Bereit zur Prüfung"
      },
      saved: {
        eyebrow: "Gespeichert",
        title: "Freigegebene Accounts übergeben",
        copy: "Verschieben Sie Accounts erst hierher, wenn Website-Belege und Outreach-Ansatz stark genug sind.",
        metricLabel: "Bereit zur Übergabe"
      },
      scan: {
        eyebrow: "Scan-Bereich",
        title: "Die nächste Website scannen",
        copy: "Halten Sie die Recherche einzelner Websites verfügbar, aber nutzen Sie sie als Bereich innerhalb des Batch-Workflows statt als gesamte App-Ansicht.",
        metricLabel: "Gerade in Recherche"
      }
    },
    queuePanel: {
      eyebrow: "Warteschlangen-Überblick",
      title: "Was als Nächstes geprüft werden muss",
      ready: "Bereit",
      researching: "In Recherche",
      imported: "Importiert",
      workspaceSource: "Workspace-Lead",
      openSite: "Website öffnen",
      moveToScanDesk: "In Scan-Bereich verschieben",
      reviewCard: "Karte öffnen",
      emptyTitle: "Keine Websites warten in der Warteschlange.",
      emptyCopy: "Importieren Sie eine Liste oder scannen Sie die erste Website, um Arbeit für das Team zu erzeugen."
    },
    savedPanel: {
      eyebrow: "Gespeicherte Übergabe",
      title: "Was bereits exportbereit ist",
      qualified: "Qualifiziert",
      outreachQueued: "Outreach eingeplant",
      exported: "Exporte",
      openCard: "Karte öffnen",
      emptyTitle: "Noch keine gespeicherten Accounts sind bereit.",
      emptyCopy: "Verschieben Sie starke Accounts aus der Review-Warteschlange, sobald Verantwortliche, Phase und Notizen bereit sind."
    },
    nextAction: {
      startWorkspace: "Kostenlos starten",
      createWorkspace: "LeadCue vorbereiten",
      setupRequired: "Konto wird vorbereitet",
      createWorkspaceTitle: "LeadCue wird für Ihren ersten Research-Lauf vorbereitet",
      createWorkspaceCopy:
        "Sie sind angemeldet. LeadCue erstellt automatisch den Datenbereich für Agency Profile, Credits, Website-Queue, Prospect Cards und Exporte.",
      importWebsites: "Websites importieren",
      openQueue: "Review-Warteschlange öffnen",
      manualScan: "Stattdessen manuellen Scan nutzen",
      sampleTitle: "Dies ist die Demo-Vorschau des Workspaces",
      sampleCopy:
        "Melden Sie sich an, um gespeicherte Recherche erneut zu öffnen, oder starten Sie kostenlos, bevor Sie Websites in die Review-Warteschlange importieren.",
      loadErrorTitle: "Ihre Research-Daten konnten nicht erneut geöffnet werden",
      loadErrorCopy:
        "Ihre gespeicherte Warteschlange und exportierten Kontexte sind weiterhin geschützt. Aktualisieren Sie zuerst und melden Sie sich erneut an, wenn das Problem bleibt.",
      retryWorkspace: "Daten aktualisieren",
      manualEyebrow: "Manueller Bereich",
      manualTitle: "Möchten Sie stattdessen nur eine einzelne Website recherchieren?",
      manualCopy:
        "Behalten Sie den Scan einzelner Websites für punktuelle Recherche bei, aber behandeln Sie ihn als Nebenbereich statt als Standard-Workflow auf der Startseite.",
      openManual: "Manuellen Scan öffnen"
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
  nav: {
    today: "Vandaag",
    queue: "Wachtrij",
    qualified: "Gekwalificeerd",
    exports: "Exports",
    settings: "Instellingen",
    dashboard: "Overzicht",
    import: "Importeren",
    leads: "Reviewwachtrij",
    saved: "Opgeslagen accounts",
    icp: "ICP",
    credits: "Facturering",
    analytics: "Proces",
    account: "Profiel"
  },
  pages: {
    dashboard: {
      eyebrow: "Vandaag",
      title: "Vandaag",
      copy: "Zie direct de volgende stap, de huidige blokkades en de voortgang van deze werkruimte."
    },
    queue: {
      eyebrow: "Wachtrij",
      title: "Wachtrij",
      copy: "Voeg websites toe, start scans en werk reviewtaken af binnen dezelfde workflowbaan."
    },
    qualified: {
      eyebrow: "Gekwalificeerd",
      title: "Gekwalificeerde accounts",
      copy: "Beheer hier accounts die de research al hebben doorstaan en klaar zijn voor eigenaar, notities en overdracht."
    },
    exports: {
      eyebrow: "Exports",
      title: "Exports",
      copy: "Bereid CRM-overdracht voor, kies een exportpreset en verplaats gekwalificeerde accounts netjes uit de werkruimte."
    },
    settings: {
      eyebrow: "Instellingen",
      title: "Instellingen",
      copy: "Beheer ICP, werkruimte-identiteit en toegang op één plek zonder de hoofdworkflow te onderbreken."
    },
    leads: {
      eyebrow: "Reviewwachtrij",
      title: "Reviewwachtrij",
      copy: "Verwerk geïmporteerde of onderzochte accounts voordat ze naar de opgeslagen overdrachtslijst gaan."
    },
    icp: {
      eyebrow: "ICP",
      title: "ICP",
      copy: "Bepaal hoe LeadCue fit, urgentie en uitvoerbaarheid moet scoren voordat het team meer websites scant."
    },
    billing: {
      eyebrow: "Facturering",
      title: "Facturering",
      copy: "Credits, abonnementsstatus en exportcapaciteit volgen zonder de werkruimte te verlaten."
    },
    import: {
      eyebrow: "Batch-onderzoek",
      title: "Websites importeren",
      copy: "Plak domeinen of upload een CSV om een website-first reviewwachtrij voor deze werkruimte te bouwen."
    },
    saved: {
      eyebrow: "Opgeslagen accounts",
      title: "Opgeslagen accounts",
      copy: "Exporteer accounts die al zijn goedgekeurd en klaar voor outreach of CRM-overdracht."
    },
    analytics: {
      eyebrow: "Workflow",
      title: "Workflow-analyse",
      copy: "Volg hoe websites de wachtrij in gaan, gekwalificeerde accounts worden en de werkruimte verlaten als exports."
    },
    account: {
      eyebrow: "Account",
      title: "Account",
      copy: "Werkruimte-identiteit en wachtwoordtoegang bijwerken zonder de workflow te onderbreken."
    }
  },
  billing: {
    plans: {
      useCases: {
        free: "Valideer de workflow met echte websites voordat u betaald uitbreidt.",
        starter: "Voor solo-operators die een wekelijks outbound-ritme opbouwen.",
        pro: "Voor bureaus die prospect-onderzoek omzetten in een herhaalbare pipeline.",
        agency: "Voor teams die scan-credits delen over meerdere klantaanbiedingen."
      }
    }
  },
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
        "Demo-preview. Start gratis om Prospect Cards, credits en exportgeschiedenis op te slaan.",
      sampleWorkspaceData: "__ERROR__ Voorbeeldgegevens van de workspace worden getoond.",
      sampleWorkspaceDataPlain: "Voorbeeldgegevens van de workspace worden getoond.",
      workspaceDataUnavailable: "We kunnen deze workspace nu niet laden. Vernieuw en probeer opnieuw.",
      billingActiveSetup: "Facturatie is actief. Rond hieronder eerst de eerste website-first research run af.",
      workspaceCreatedSetup: "LeadCue is klaar. Rond hieronder eerst de eerste website-first research run af.",
      createWorkspaceRequired: "Je bent ingelogd. LeadCue wordt voorbereid voor je eerste research run.",
      workspaceCreateFailed: "LeadCue kan nu niet worden voorbereid.",
      signedIn: "Ingelogd.",
      scanDeskLoaded: "__URL__ staat in het scandesk klaar. Bekijk de notities en start daarna de scan.",
      scanDeskMissingTarget: "Voeg een prospectwebsite toe in het scandesk om de eerste opgeslagen kaart te maken.",
      samePlan: "U gebruikt al het __PLAN__-abonnement.",
      checkoutUnavailable: "Checkout is momenteel niet beschikbaar voor dit abonnement.",
      leadDetailUnavailable: "Kan leaddetails niet laden.",
      scanInvalidUrl:
        "Voer een geldige prospectwebsite-URL in. Er zijn geen credits gebruikt. Corrigeer de URL en probeer het opnieuw.",
      scanSaved: "__COMPANY__ opgeslagen als Prospect Card. Gebruikte credits: __COUNT__.",
      scanComplete:
        "Scan voltooid. Bekijk eerst de Prospect Card voordat u exporteert of outreach schrijft.",
      scanFailed:
        "Scan mislukt. Er zijn geen credits gebruikt. Corrigeer de URL en probeer het opnieuw.",
      onboardingDismissed: "Setupgids gesloten.",
      onboardingUpdateFailed: "Onboarding kon niet worden bijgewerkt.",
      csvExportPrepared: "CSV voorbereid met __LABEL__ velden.",
      csvExportFailed: "CSV-export mislukt.",
      billingPortalUnavailable: "Het facturatieportaal is nog niet beschikbaar.",
      signedOutDemo: "Uitgelogd. De demo-preview wordt getoond.",
      selectLeadBeforeExport: "Selecteer minstens één lead voordat u exporteert.",
      selectedLeadExported: "__COUNT__ geselecteerde leads geëxporteerd met __LABEL__ velden.",
      selectedLeadExportFailed: "Export van geselecteerde leads mislukt.",
      signInRequired: "Log in om door te gaan.",
      workspaceNotFound: "LeadCue-dataruimte niet gevonden.",
      subscriptionInactive:
        "Uw abonnement is niet actief. Werk de facturatie bij voordat u meer websites scant.",
      insufficientCredits: "Deze workspace heeft niet genoeg scancredits voor dit verzoek.",
      createFirstSavedCard:
        "Gebruik de Chrome-extensie of POST /api/scans terwijl u bent aangemeld om de eerste opgeslagen kaart te maken."
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
      welcomeTitle: "Welkom, __NAME__.",
      workspaceReadyTitle: "Begin met één website, __NAME__.",
      intro:
        "LeadCue is ingericht voor website-first outbound research. Eén scan maakt een Prospect Card met fit-score, bronnotities, first lines en exportklare context.",
      progress: "__COUNT__/4 klaar",
      markComplete: "Markeer als voltooid",
      checklistLabel: "Checklist voor de eerste website-first research run",
      setupSnapshot: "Agency Profile",
      service: "Aanbod",
      industries: "Best-fit segmenten",
      firstTarget: "Eerste website",
      prepareFirstScan: "Website-research voorbereiden",
      runFirstScan: "Eerste scan uitvoeren",
      reviewIcp: "Agency Profile verfijnen",
      tasks: {
        profileSaved: "Agency Profile afgestemd",
        firstWebsiteQueued: "Eerste website gekozen",
        firstProspectCard: "Eerste Prospect Card opgeslagen",
        exportReady: "Exportklare overdracht"
      },
      descriptions: {
        profileSaved: "De fit-score is afgestemd op __INDUSTRIES__.",
        profileTodo: "Leg je aanbod en best-fit segmenten vast, zodat fit-score en opportunity signals relevant blijven.",
        websiteQueued: "Klaar voor website-first research: __URL__",
        agencySaved: "Bureauwebsite opgeslagen als context: __URL__",
        websiteTodo: "Voeg de eerste prospectwebsite toe om bronnotities en outreach-context te genereren.",
        firstCardDone: "__COUNT__ Prospect Cards zijn al opgeslagen.",
        firstCardTodo: "Voer de eerste websitescan uit om een Prospect Card met first lines en exportklare notities op te slaan.",
        exportReadyDone: "Het eerste opgeslagen account is klaar voor CSV- of CRM-overdracht.",
        exportReadyTodo: "Na het opslaan van een Prospect Card kun je gekwalificeerde accounts via exports overdragen aan outreach."
      }
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
      fit: "Match",
      confidence: "Vertrouwen",
      emptyTitle: "Nog geen opgeslagen prospects.",
      emptyCopy: "Voer een websitescan uit via de extensie of API, dan verschijnen opgeslagen Prospect Cards hier.",
      filterLabel: "Leads filteren",
      tableLabel: "Opgeslagen leads"
    },
    emptyProspect: {
      eyebrow: "Prospectkaart",
      title: "Je eerste opgeslagen kaart verschijnt hier",
      copy: "LeadCue slaat na een voltooide scan fit-score, websitebewijs, outreach-hoeken, openingszinnen en exportnotities op.",
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
    },
    workbench: {
      title: "Workflowbanen",
      import: {
        eyebrow: "Importeren",
        title: "Batchlijst opbouwen",
        copy: "Plak domeinen of upload een CSV voordat het team accounts gaat beoordelen.",
        metricLabel: "Websites in de wachtrij"
      },
      queue: {
        eyebrow: "Beoordeling",
        title: "De volgende websites triëren",
        copy: "Zie welke accounts nog een scan nodig hebben en welke al handmatige kwalificatie vereisen.",
        metricLabel: "Klaar voor review"
      },
      saved: {
        eyebrow: "Opgeslagen",
        title: "Goedgekeurde accounts overdragen",
        copy: "Verplaats accounts hierheen zodra het websitebewijs en de invalshoek sterk genoeg zijn voor outreach.",
        metricLabel: "Klaar voor overdracht"
      },
      scan: {
        eyebrow: "Scandesk",
        title: "De volgende website scannen",
        copy: "Houd onderzoek per site beschikbaar, maar gebruik het als zijbaan binnen de batchworkflow in plaats van als standaard app-flow.",
        metricLabel: "Nu in onderzoek"
      }
    },
    queuePanel: {
      eyebrow: "Momentopname van de wachtrij",
      title: "Wat nu review nodig heeft",
      ready: "Klaar",
      researching: "In onderzoek",
      imported: "Geimporteerd",
      workspaceSource: "Workspace-lead",
      openSite: "Site openen",
      moveToScanDesk: "Naar scandesk verplaatsen",
      reviewCard: "Kaart openen",
      emptyTitle: "Er wachten geen websites in de wachtrij.",
      emptyCopy: "Importeer een lijst of scan de eerste website om werk voor het team te creëren."
    },
    savedPanel: {
      eyebrow: "Opgeslagen overdracht",
      title: "Wat al klaarstaat voor export",
      qualified: "Gekwalificeerd",
      outreachQueued: "Outreach ingepland",
      exported: "Geexporteerd",
      openCard: "Kaart openen",
      emptyTitle: "Nog geen opgeslagen accounts zijn klaar.",
      emptyCopy: "Verplaats sterke accounts uit de reviewwachtrij zodra eigenaar, fase en notities klaar zijn."
    },
    nextAction: {
      startWorkspace: "Gratis starten",
      createWorkspace: "LeadCue voorbereiden",
      setupRequired: "Account voorbereiden",
      createWorkspaceTitle: "LeadCue wordt voorbereid voor je eerste research run",
      createWorkspaceCopy:
        "Je bent ingelogd. LeadCue maakt automatisch de dataruimte voor Agency Profile, credits, websitewachtrij, Prospect Cards en exports.",
      importWebsites: "Websites importeren",
      openQueue: "Reviewwachtrij openen",
      manualScan: "In plaats daarvan handmatige scan gebruiken",
      sampleTitle: "Dit is de demo-preview van de workspace",
      sampleCopy:
        "Log in om je opgeslagen research te openen, of start gratis voordat je websites in de reviewwachtrij importeert.",
      loadErrorTitle: "We konden je researchdata niet opnieuw openen",
      loadErrorCopy:
        "Je opgeslagen wachtrij en geëxporteerde context blijven beschermd. Vernieuw eerst en meld je opnieuw aan als het probleem blijft bestaan.",
      retryWorkspace: "Data vernieuwen",
      manualEyebrow: "Handmatige baan",
      manualTitle: "Liever eerst één website onderzoeken?",
      manualCopy: "Houd single-site scans beschikbaar voor incidenteel onderzoek, maar behandel ze als zijbaan in plaats van als de standaard startflow.",
      openManual: "Handmatige scan openen"
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
  nav: {
    today: "Aujourd’hui",
    queue: "File",
    qualified: "Qualifiés",
    exports: "Exports",
    settings: "Réglages",
    dashboard: "Tableau de bord",
    import: "Importation",
    leads: "File de revue",
    saved: "Comptes enregistrés",
    icp: "ICP",
    credits: "Facturation",
    analytics: "Flux",
    account: "Compte"
  },
  pages: {
    dashboard: {
      eyebrow: "Aujourd’hui",
      title: "Aujourd’hui",
      copy: "Voyez immédiatement la prochaine action, les blocages actuels et la progression de cet espace de travail."
    },
    queue: {
      eyebrow: "File",
      title: "File",
      copy: "Ajoutez des sites, lancez des scans et faites avancer la revue dans une même voie de travail."
    },
    qualified: {
      eyebrow: "Qualifiés",
      title: "Comptes qualifiés",
      copy: "Gérez ici les comptes qui ont déjà passé la recherche et sont prêts pour propriétaire, notes et remise."
    },
    exports: {
      eyebrow: "Exports",
      title: "Exports",
      copy: "Préparez la remise CRM, choisissez un preset d’export et sortez proprement les comptes qualifiés du workspace."
    },
    settings: {
      eyebrow: "Réglages",
      title: "Réglages",
      copy: "Regroupez ICP, identité du workspace et accès sans casser le flux principal."
    },
    leads: {
      eyebrow: "File de revue",
      title: "File de revue",
      copy: "Traitez les comptes importés ou en cours de recherche avant de les déplacer dans la liste de remise enregistrée."
    },
    icp: {
      eyebrow: "ICP",
      title: "ICP",
      copy: "Définissez comment LeadCue doit évaluer l'adéquation, l'urgence et la faisabilité avant que l'équipe scanne d'autres sites."
    },
    billing: {
      eyebrow: "Facturation",
      title: "Facturation",
      copy: "Surveillez les crédits, l'état de l'abonnement et la capacité d'export sans quitter l'espace de travail."
    },
    import: {
      eyebrow: "Recherche groupée",
      title: "Importer des sites",
      copy: "Collez des domaines ou téléversez un CSV pour constituer une file de revue site-first pour cet espace de travail."
    },
    saved: {
      eyebrow: "Comptes enregistrés",
      title: "Comptes enregistrés",
      copy: "Exportez les comptes déjà approuvés et prêts pour l'outreach ou le transfert CRM."
    },
    analytics: {
      eyebrow: "Workflow",
      title: "Analyse du workflow",
      copy: "Suivez comment les sites entrent dans la file, deviennent des comptes qualifiés et quittent l'espace en tant qu'exports."
    },
    account: {
      eyebrow: "Compte",
      title: "Compte",
      copy: "Mettez à jour l'identité de l'espace et l'accès par mot de passe sans interrompre le workflow."
    }
  },
  billing: {
    plans: {
      useCases: {
        free: "Validez le workflow avec de vrais sites web avant de passer à une extension payante.",
        starter: "Pour les opérateurs solo qui construisent un rythme d'outbound hebdomadaire.",
        pro: "Pour les agences qui transforment la recherche de prospects en pipeline reproductible.",
        agency: "Pour les équipes qui partagent des crédits de scan entre plusieurs offres clients."
      }
    }
  },
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
        "Aperçu démo. Commencez gratuitement pour enregistrer des Prospect Cards, des crédits et l'historique d'export.",
      sampleWorkspaceData: "__ERROR__ Affichage des données d'exemple du workspace.",
      sampleWorkspaceDataPlain: "Affichage des données d'exemple du workspace.",
      workspaceDataUnavailable: "Nous ne pouvons pas charger ce workspace pour le moment. Actualisez puis réessayez.",
      billingActiveSetup: "La facturation est active. Terminez d'abord le premier run de recherche website-first ci-dessous.",
      workspaceCreatedSetup: "LeadCue est prêt. Terminez d'abord le premier run de recherche website-first ci-dessous.",
      createWorkspaceRequired: "Vous êtes connecté. LeadCue prépare votre premier run de recherche.",
      workspaceCreateFailed: "Impossible de préparer LeadCue pour le moment.",
      signedIn: "Connecté.",
      scanDeskLoaded: "__URL__ est chargé dans le bureau de scan. Vérifiez les notes puis lancez le scan.",
      scanDeskMissingTarget: "Ajoutez un site prospect dans le bureau de scan pour créer la première carte enregistrée.",
      samePlan: "Vous êtes déjà sur l'offre __PLAN__.",
      checkoutUnavailable: "Le paiement n'est pas disponible pour cette offre pour le moment.",
      leadDetailUnavailable: "Impossible de charger le détail du lead.",
      scanInvalidUrl:
        "Saisissez une URL de site prospect valide. Aucun crédit n'a été consommé. Corrigez l'URL puis réessayez.",
      scanSaved: "__COMPANY__ enregistré comme Prospect Card. Crédits utilisés : __COUNT__.",
      scanComplete:
        "Scan terminé. Vérifiez d'abord la Prospect Card avant d'exporter ou de rédiger un message.",
      scanFailed:
        "Le scan a échoué. Aucun crédit n'a été consommé. Corrigez l'URL puis réessayez.",
      onboardingDismissed: "Guide de configuration masqué.",
      onboardingUpdateFailed: "Impossible de mettre à jour l'onboarding.",
      csvExportPrepared: "CSV préparé avec les champs __LABEL__.",
      csvExportFailed: "L'export CSV a échoué.",
      billingPortalUnavailable: "Le portail de facturation n'est pas encore disponible.",
      signedOutDemo: "Déconnecté. L'aperçu démo est affiché.",
      selectLeadBeforeExport: "Sélectionnez au moins un lead avant d'exporter.",
      selectedLeadExported: "__COUNT__ leads sélectionnés exportés avec les champs __LABEL__.",
      selectedLeadExportFailed: "L'export des leads sélectionnés a échoué.",
      signInRequired: "Connectez-vous pour continuer.",
      workspaceNotFound: "Espace de données LeadCue introuvable.",
      subscriptionInactive:
        "Votre abonnement n'est pas actif. Mettez à jour la facturation avant de scanner d'autres sites.",
      insufficientCredits: "Ce workspace n'a pas assez de crédits de scan pour cette demande.",
      createFirstSavedCard:
        "Connectez-vous puis utilisez l'extension Chrome ou POST /api/scans pour créer la première carte enregistrée."
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
      welcomeTitle: "Bienvenue, __NAME__.",
      workspaceReadyTitle: "Commencez par un site, __NAME__.",
      intro:
        "LeadCue est prêt pour la recherche outbound website-first. Un scan crée une Prospect Card avec score d'adéquation, notes sourcées, premières phrases et contexte prêt à l'export.",
      progress: "__COUNT__/4 prêts",
      markComplete: "Marquer comme terminé",
      checklistLabel: "Checklist du premier run website-first",
      setupSnapshot: "Agency Profile",
      service: "Offre",
      industries: "Segments les plus pertinents",
      firstTarget: "Premier site",
      prepareFirstScan: "Préparer la recherche site",
      runFirstScan: "Lancer le premier scan",
      reviewIcp: "Ajuster l'Agency Profile",
      tasks: {
        profileSaved: "Agency Profile ajusté",
        firstWebsiteQueued: "Premier site sélectionné",
        firstProspectCard: "Première Prospect Card enregistrée",
        exportReady: "Remise prête à l'export"
      },
      descriptions: {
        profileSaved: "Le score d'adéquation est ajusté pour __INDUSTRIES__.",
        profileTodo: "Définissez votre offre et vos segments prioritaires pour garder le score d'adéquation et les signaux d'opportunité pertinents.",
        websiteQueued: "Prêt pour la recherche website-first : __URL__",
        agencySaved: "Site agence enregistré comme contexte : __URL__",
        websiteTodo: "Ajoutez le premier site prospect pour générer des notes sourcées et un contexte d'outreach.",
        firstCardDone: "__COUNT__ Prospect Cards sont déjà enregistrées.",
        firstCardTodo: "Lancez le premier scan de site pour enregistrer une Prospect Card avec premières phrases et notes prêtes à l'export.",
        exportReadyDone: "Le premier compte enregistré est prêt pour une remise CSV ou CRM.",
        exportReadyTodo: "Après avoir enregistré une Prospect Card, utilisez les exports pour remettre les comptes qualifiés à l'outreach."
      }
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
      eyebrow: "Fiche prospect",
      title: "Votre première carte enregistrée apparaîtra ici",
      copy: "Après un scan terminé, LeadCue enregistre le score d'adéquation, les preuves du site, les angles d'outreach, les premières phrases et les notes d'export.",
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
    },
    workbench: {
      title: "Voies du workflow",
      import: {
        eyebrow: "Importation",
        title: "Construire la liste batch",
        copy: "Collez des domaines ou téléversez un CSV avant que l'équipe commence la revue des comptes.",
        metricLabel: "Sites en file"
      },
      queue: {
        eyebrow: "Revue",
        title: "Trier les prochains sites",
        copy: "Voyez quels comptes ont encore besoin d'un scan et lesquels ont déjà besoin d'une qualification humaine.",
        metricLabel: "Prêt pour la revue"
      },
      saved: {
        eyebrow: "Enregistré",
        title: "Transmettre les comptes approuvés",
        copy: "Déplacez les comptes ici seulement quand les preuves du site et l'angle sont assez solides pour l'outreach.",
        metricLabel: "Prêt pour la remise"
      },
      scan: {
        eyebrow: "Bureau de scan",
        title: "Lancer le prochain site",
        copy: "Gardez la recherche site par site disponible, mais comme une voie latérale dans le workflow batch plutôt que comme le flux principal de l'app.",
        metricLabel: "En recherche"
      }
    },
    queuePanel: {
      eyebrow: "Aperçu de la file",
      title: "Ce qui doit être revu ensuite",
      ready: "Prêt",
      researching: "En recherche",
      imported: "Importé",
      workspaceSource: "Lead du workspace",
      openSite: "Ouvrir le site",
      moveToScanDesk: "Déplacer vers le bureau de scan",
      reviewCard: "Ouvrir la fiche",
      emptyTitle: "Aucun site n'attend dans la file.",
      emptyCopy: "Importez une liste ou scannez le premier site pour créer du travail pour l'équipe."
    },
    savedPanel: {
      eyebrow: "Remise enregistrée",
      title: "Ce qui est déjà prêt à l'export",
      qualified: "Qualifié",
      outreachQueued: "Outreach en attente",
      exported: "Exportations",
      openCard: "Ouvrir la fiche",
      emptyTitle: "Aucun compte enregistré n'est encore prêt.",
      emptyCopy: "Déplacez les comptes solides hors de la file de revue quand le responsable, l'étape et les notes sont prêts."
    },
    nextAction: {
      startWorkspace: "Commencer gratuitement",
      createWorkspace: "Préparer LeadCue",
      setupRequired: "Préparation du compte",
      createWorkspaceTitle: "LeadCue prépare votre premier run de recherche",
      createWorkspaceCopy:
        "Vous êtes connecté. LeadCue prépare automatiquement l'espace de données pour l'Agency Profile, les crédits, la file de sites, les Prospect Cards et les exports.",
      importWebsites: "Importer des sites",
      openQueue: "Ouvrir la file de revue",
      manualScan: "Utiliser plutôt le scan manuel",
      sampleTitle: "Ceci est l'aperçu du workspace démo",
      sampleCopy:
        "Connectez-vous pour rouvrir vos recherches enregistrées, ou commencez gratuitement avant d'importer des sites dans la file de revue.",
      loadErrorTitle: "Nous n'avons pas pu rouvrir vos données de recherche",
      loadErrorCopy:
        "Votre file enregistrée et le contexte exporté restent protégés. Actualisez d'abord, puis reconnectez-vous si le problème continue.",
      retryWorkspace: "Actualiser les données",
      manualEyebrow: "Voie manuelle",
      manualTitle: "Besoin de rechercher un seul site à la place ?",
      manualCopy: "Gardez le scan site par site pour les recherches ponctuelles, mais traitez-le comme une voie secondaire plutôt que comme le flux d'accueil par défaut.",
      openManual: "Ouvrir le scan manuel"
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
