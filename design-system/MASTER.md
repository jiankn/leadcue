# LeadCue Design System

Generated from the `ui-ux-pro-max` skill rules after the local Python runner was unavailable.

## Product Shape

- Product type: B2B SaaS productivity tool for agency prospect research.
- Primary users: SEO agency founders, web design agency founders, marketing consultants, and B2B founders doing outbound.
- Interface priority: fast comparison, source-backed confidence, copy/export actions, and low-friction scanning.

## Visual Direction

- Style: crisp professional SaaS, restrained data density, light mode first.
- Avoid: purple-heavy gradients, decorative blobs, emoji icons, nested card stacks, marketing filler sections.
- Cards: max 8px radius, used for repeated records, product previews, modals, and framed tools only.
- Layout: full-width page bands with constrained inner content; no floating page sections.

## Color Tokens

- Ink: `#172033`
- Muted ink: `#526070`
- Surface: `#ffffff`
- Canvas: `#f7f4ed`
- Border: `#ded8cc`
- Primary: `#147d73`
- Primary dark: `#0f5f58`
- Accent amber: `#c77918`
- Accent coral: `#c4483a`
- Soft green: `#dff3ee`
- Soft amber: `#fff0d8`

## Typography

- Font stack: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif.
- Body size: 16px minimum.
- Line height: 1.5 for UI copy, 1.1-1.2 for large headings.
- Letter spacing: 0.
- Data: use tabular numbers for scores, credits, and counts.

## Components

- Buttons: one primary action per section. Use icon + text where action meaning benefits from it.
- Forms: visible labels, 44px minimum height, inline helper/error text.
- Tables/lists: sortable-ready structure, clear empty state, no horizontal scroll on small screens.
- Prospect card: show fit score, evidence, opportunity signals, first lines, source notes, copy action.
- Dashboard: lead list, recent scans, credits, ICP settings, CSV export entry point.

## Accessibility And UX

- Normal text contrast target: WCAG AA 4.5:1.
- All icon-only controls need `aria-label`.
- Focus states must be visible.
- Reduced motion should disable nonessential transitions.
- Mobile layout must work at 375px width without text overlap or horizontal scroll.
