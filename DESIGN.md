---
name: Executive Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#00201d'
  on-tertiary-container: '#0c9488'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Geist
    fontSize: 3.5rem
    fontWeight: '600'
    lineHeight: 4rem
    letterSpacing: -0.035em
  headline-lg:
    fontFamily: Geist
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Geist
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 1.25rem
    fontWeight: '500'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Geist
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Geist
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0em
  label-md:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: -0.005em
  label-sm:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.01em
  metric-mono:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.125rem
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system serves an enterprise-grade university operations platform orchestrating multi-million-dollar campus infrastructure, active dispatch units, and physical asset lifecycles. It merges high-density utility with the polished restraint found in premier developer tools and modern fintech platforms. 

The aesthetic marries Swiss modernist clarity with hyper-refined digital SaaS execution. Interfaces present an authoritative, calm demeanor: functional typography with optical kerning, precision 1px hairpins, subtle diffused shadows, and high-legibility tabular telemetry. Operational friction is eliminated through meticulous layout hierarchy, tactile state responses, and information density tailored to mission-critical situational awareness.

## Colors

The palette relies on high-contrast architectural surfaces combined with purposeful semantic signals:

- **Base Canvas & Cards**: Surface foundations utilize an editorial, low-glare off-white (`#F8F9FA`), elevating layered modules via crisp optical white (`#FFFFFF`) framed by slate borders (`#E2E8F0` or `rgba(15, 23, 42, 0.06)`).
- **Primary / Brand (`#0F172A`)**: Executive midnight navy commands primary typography, dense headers, persistent structural framing, and primary action triggers. Deep slate (`#1E293B`) serves as the elevated interactive hover tone.
- **Secondary Accent (`#2563EB`)**: Cobalt blue focuses attention strictly on active operational states, navigational selection markers, data visualizations, and primary focus outlines.
- **Tertiary Accent (`#0D9488`)**: Deep teal highlights building automation systems, HVAC performance metrics, and facilities engineering tasks.
- **Semantic Matrix**:
  - **Success / Completed**: Deep emerald (`#059669`) with soft mint tinted container (`#ECFDF5`).
  - **Warning / Inspection Due**: Radiant amber (`#D97706`) anchored on warm cream tint (`#FFFBEB`).
  - **Critical / Emergency Dispatch**: Crisp crimson (`#DC2626`) set against an alarm rose tint (`#FEF2F2`).

## Typography

Geist delivers geometric clarity, low vertical footprint, and disciplined proportions across operational workflows. JetBrains Mono is assigned strictly to tabular metrics, work order ticket identifiers, geolocation coordinates, SLA count-downs, and infrastructure codes.

- **Headline Kerning**: Apply negative letter-spacing (`-0.02em` to `-0.035em`) on all headings above 20px to produce an authoritative editorial cadence.
- **Tabular Numerics**: Data grids, work-order status boards, and operational metrics must enforce font feature settings (`"tnum" 1, "cv05" 1`) to ensure stable alignment during real-time data polling.
- **Line Length**: Limit descriptive analytical body copy to a maximum of 68 characters per line to preserve scan-speed during high-pressure dispatch.

## Layout & Spacing

The architecture utilizes an asymmetrical, high-density fluid grid system:
- **Desktop (>= 1280px)**: A 12-column dynamic layout anchored by an enclosed 260px administrative navigation sidebar. Primary work zones span 8 or 9 columns, reserving 3 or 4 columns for situational side-sheets, dispatch timelines, and facility telemetry. Gutters are locked to `1.5rem` (`24px`).
- **Tablet (768px - 1279px)**: An 8-column layout. The primary sidebar collapses into a floating icon rail (64px), collapsing secondary telemetry panels beneath primary lists. Gutters adjust to `1.25rem` (`20px`).
- **Mobile (< 768px)**: A single-column flow featuring full-width cards, pinned bottom utility controls, and off-canvas slide-out drawers. Margins scale down to `1rem` (`16px`).

Internal module spacing strictly enforces an 8pt rhythmic grid (with a 4pt micro-step scale reserved for badge insets and high-density tabular cell padding).

## Elevation & Depth

Depth is established primarily through clean tonal planes and razor-thin boundary layers rather than dramatic drops.

- **Boundary Layer (Level 0)**: Flat surfaces use a crisp 1px hairline border of `rgba(15, 23, 42, 0.08)` (or `#E2E8F0`) with zero drop shadow, delineating zones with clinical efficiency.
- **Elevation 1 (Card & Module Foundation)**: Applied to core content panels and modular blocks.
  `box-shadow: 0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.02);` bordered by a 1px perimeter outline of `rgba(15, 23, 42, 0.06)`.
- **Elevation 2 (Floating Navigational Shells & Popovers)**: Pill headers, pinned action bars, and dropdown menus utilize subtle multi-stop ambient light:
  `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05);` paired with a translucent backdrop blur (`backdrop-filter: blur(12px)` over `rgba(255, 255, 255, 0.85)`).
- **Elevation 3 (Dispatch Modals & Overlays)**: Emergency work drawers, detail modals, and critical dialogues:
  `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);` with an underlying scrim of `rgba(15, 23, 42, 0.40)`.

## Shapes

The interface balances functional discipline with soft modern curves:
- **Cards & Primary Work Panels**: Use `rounded-2xl` (`1rem` / `16px`) for standard cards, and `rounded-3xl` (`1.5rem` / `24px`) for standalone canvas regions, providing comfortable containment for complex tabular data.
- **Input Fields, Dropdowns & Buttons**: Locked to base `rounded` (`0.5rem` / `8px`) for immediate affordance and ergonomic balance.
- **Navigation Shells & Badges**: Utilize full-pill structures (`rounded-full` / `9999px`) to create distinction between ambient framing modules and content-bearing containers.
- **Tabular Line Items & Nested Rows**: Styled with minimal softening (`0.375rem` / `6px`) to maximize data scanability without visual clutter.

## Components

### Buttons
- **Primary**: Solid `#0F172A` background, optical white text, 1px subtle highlight rim (`inset 0 1px 0 rgba(255,255,255,0.15)`). Hover shifts to `#1E293B` with a subtle translate-y transition.
- **Secondary / Ghost**: White background, 1px border (`#E2E8F0`), `#0F172A` text. Hover state introduces `#F8F9FA` with border color transition to `#CBD5E1`.
- **Tertiary / Utility**: Transparent background, text `#475569`, hover to `#F1F5F9` with `#0F172A` text.
- **Destructive**: Deep crimson `#DC2626` background, crisp white typography, red-shifted glow on focus.

### Status Badges & Dot Indicators
- Engineered as compact pill containers (`height: 22px`, `padding: 0 8px`) displaying font size `0.75rem` with a weight of `500`.
- Integrated micro-dot: A 6px circular indicator preceding the label text.
  - Active / Completed: `#10B981` dot on `#ECFDF5` container with `#065F46` text.
  - Scheduled / In-Progress: `#2563EB` dot with a subtle pulse animation on `#EFF6FF` container with `#1E40AF` text.
  - Delayed / Overdue SLA: `#DC2626` dot on `#FEF2F2` container with `#991B1B` text.

### High-Density Data Tables
- Row heights pegged to 44px (compact) or 56px (standard). Header typography uses `label-sm` in uppercase (`#64748B`, tracking `0.05em`).
- Cell dividers rely on 1px borders in `#F1F5F9`. Alternating zebra striping is omitted in favor of a subtle hover reveal (`background-color: #F8FAFC`).
- Numerical IDs and timestamps must render using `metric-mono` (`JetBrains Mono`).

### Input Fields & Controls
- **Inputs & Selects**: Height fixed at 38px, base border `#CBD5E1`, background `#FFFFFF`. Focus transitions border to `#2563EB` with an ambient ring: `0 0 0 3px rgba(37, 99, 235, 0.15)`.
- **Checkboxes & Radios**: 16px footprint. Checked state fills with `#0F172A` framing an optical white icon checkmark.

### Pill Navigation Shells
- Floating persistent headers framed with `rounded-full`, a 1px border of `rgba(15, 23, 42, 0.08)`, frosted background (`rgba(255, 255, 255, 0.8)`), and integrated quick-search inputs (`JetBrains Mono` search shortcut badge `⌘K`).