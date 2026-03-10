# Admin UI Customization Guide

Everything in this file is specific to this project: **Payload CMS v3 + Next.js 15 + Tailwind CSS v4**.

---

## Table of Contents

1. [Key Files](#key-files)
2. [How the Payload Admin Layout Works](#how-the-payload-admin-layout-works)
3. [Header Customization](#header-customization)
4. [Sidebar Customization](#sidebar-customization)
5. [Dashboard Customization](#dashboard-customization)
6. [Styling (CSS/Tailwind)](#styling-csstailwind)
7. [Dark Mode](#dark-mode)
8. [Adding / Changing UI Components](#adding--changing-ui-components)
9. [Registering Payload Components](#registering-payload-components)
10. [Common Gotchas](#common-gotchas)
11. [Workflow Checklist](#workflow-checklist)

---

## Key Files

| File | Purpose |
|------|---------|
| `src/payload.config.ts` | Register custom components (header, nav, dashboard, graphics) |
| `src/app/(payload)/custom.scss` | Global admin style overrides (Payload class targets) |
| `src/app/(payload)/admin-tailwind.css` | Tailwind v4 config for admin utilities + dark variant |
| `src/components/admin/AdminHeader.tsx` | **Custom header** (search + bell + theme toggle + avatar) |
| `src/components/admin/Sidebar.tsx` | **Custom sidebar** nav (replaces Payload's default Nav) |
| `src/components/admin/ThemeToggle.tsx` | Sun/moon toggle using Payload's `useTheme()` |
| `src/components/admin/GlobalProvider.tsx` | Root wrapper — TooltipProvider, CommandMenu, Toaster |
| `src/components/admin/graphics/NullGraphic.tsx` | Returns `null` — suppresses Payload's default Logo/Icon |
| `src/components/admin/dashboard/DashboardView.tsx` | Custom dashboard page |
| `src/components/ui/` | Reusable primitives: card, badge, table, input, avatar… |

---

## How the Payload Admin Layout Works

```
Browser window
└── .template-default            ← Payload's top-level layout shell
    ├── .nav                     ← Sidebar slot  → custom: Sidebar.tsx
    └── .template-default__wrap
        ├── .app-header          ← Header slot   → custom: AdminHeader.tsx
        └── main content
            └── custom views / collection views
```

### Critical: `admin.components.header` is NOT a full header replacement

`admin.components.header` injects components into the **right side** of the existing Payload header bar (`.app-header__actions`). Your component is **appended**, not a wholesale replacement.

To make it look like your component owns the entire header:
1. **Null graphics** — set `graphics.Logo` and `graphics.Icon` to `NullGraphic` in `payload.config.ts`
2. **CSS** — hide `.app-header__content` (the logo/hamburger left area) and expand `.app-header__actions` to `flex: 1`
3. **No fixed/absolute positioning** in your component — Payload already positions the header correctly

---

## Header Customization

### File: `src/components/admin/AdminHeader.tsx`

**Do NOT use `fixed`, `absolute`, or `left-[var(--nav-width)]`** in this component.
The component renders inside `.app-header__actions` which is already positioned correctly by Payload.

```tsx
// ✅ Correct — fills the injected container
export default function AdminHeader() {
  return (
    <div className="flex h-full flex-1 items-center justify-between px-5">
      {/* content */}
    </div>
  )
}

// ❌ Wrong — creates a floating second header above the Payload header
export default function AdminHeader() {
  return (
    <div className="fixed top-0 right-0 left-[var(--nav-width)] z-[100] h-16 ...">
      {/* content */}
    </div>
  )
}
```

### Register in `payload.config.ts`

```ts
admin: {
  components: {
    header: ['/components/admin/AdminHeader'],
    graphics: {
      Logo: '/components/admin/graphics/NullGraphic',  // hides Payload's logo
      Icon: '/components/admin/graphics/NullGraphic',  // hides Payload's icon
    },
  },
}
```

### CSS that makes the header slot fill full width

In `custom.scss`:
```scss
/* Hide the native left section (logo + hamburger) */
.app-header__content { display: none !important; }

/* Expand the actions slot to fill the whole header */
.app-header__actions { flex: 1 1 auto !important; padding-inline: 0 !important; }
.app-header__actions > * { flex: 1 !important; height: 100% !important; }

/* Hide Payload's built-in account nav (sidebar already shows user info) */
.app-header [class*='account'] { display: none !important; }
```

---

## Sidebar Customization

### File: `src/components/admin/Sidebar.tsx`

Registered as `Nav` in `payload.config.ts` — this replaces Payload's default sidebar entirely.

The sidebar uses Payload's CSS variable `--nav-width` for its width. The collapse state is persisted in `localStorage` and reflected via `document.documentElement.dataset.navCollapsed`.

```scss
/* collapsed width (custom.scss) */
:root[data-nav-collapsed='true'] { --nav-width: 72px; }
```

**Do NOT** add `TooltipProvider`, `Toaster`, or `CommandMenu` to Sidebar — these live in `GlobalProvider.tsx`.

To add navigation items:
```tsx
const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/collections/your-slug', label: 'Your Collection', icon: SomeIcon },
]
```

---

## Dashboard Customization

### File: `src/components/admin/dashboard/DashboardView.tsx`

This is a Server Component (no `'use client'`). It uses Payload's Local API directly:

```ts
const payload = await getPayload({ config })
const { totalDocs } = await payload.find({ collection: 'users', limit: 0, depth: 0 })
```

Sub-components:
- `StatsGrid.tsx` — the top row of metric cards
- `DashboardCharts.tsx` — Recharts-based charts
- `ActivityFeed.tsx` — recent changes feed

---

## Styling (CSS/Tailwind)

### Tailwind v4 — `src/app/(payload)/admin-tailwind.css`

```css
@source "../../components";   /* scan these for utility classes */
@source "../../app";

@custom-variant dark (&:where([data-theme='dark'] *));  /* maps dark: to Payload's theme */

@import 'tailwindcss/theme';
@import 'tw-animate-css';     /* required for Radix UI animations */
@import 'tailwindcss/utilities';
```

**Never add a `tailwind.config.*` file** — Tailwind v4 is configured via CSS only.

### SCSS overrides — `src/app/(payload)/custom.scss`

Use Payload's CSS custom properties for theme-aware values:

| Variable | Usage |
|----------|-------|
| `var(--theme-bg)` | Background (white in light, dark in dark) |
| `var(--theme-elevation-50)` | Subtle backgrounds |
| `var(--theme-elevation-100)` | Borders, dividers |
| `var(--theme-elevation-400)` | Muted/secondary text |
| `var(--theme-elevation-900)` | Primary text |
| `var(--theme-text)` | Body text |

Key overrides already in `custom.scss`:
- `html { font-size: 14px }` — fixes tiny text (Payload default is 13px)
- `.table` — rounded/bordered table with spacious cells
- `.field-type input` — 40px height, 8px radius, blue focus ring
- `.rs__control` — react-select matching the design
- `.btn` — 8px radius, 36px height

### If styles don't appear

```bash
rm -rf .next
npm run dev
```

---

## Dark Mode

Payload v3 uses `html[data-theme='dark']` to control theme. Our Tailwind setup maps this to `dark:` utility classes:

```css
@custom-variant dark (&:where([data-theme='dark'] *));
```

**Do NOT** set `theme: 'light'` in `payload.config.ts` — this disables the dark mode toggle.

To toggle programmatically:
```tsx
'use client'
import { useTheme } from '@payloadcms/ui'

const { theme, setTheme } = useTheme()
setTheme(theme === 'dark' ? 'light' : 'dark')
```

---

## Adding / Changing UI Components

UI primitives live in `src/components/ui/`. Always use:
- `cn()` from `@/lib/utils` for class merging
- `dark:` variants for every color-related class

```tsx
import { cn } from '@/lib/utils'

function MyCard({ className }: { className?: string }) {
  return (
    <div className={cn(
      'rounded-xl border border-gray-100 bg-white shadow-sm',
      'dark:border-gray-800 dark:bg-gray-900',
      className,
    )} />
  )
}
```

Available primitives: `card`, `badge`, `table`, `input`, `avatar`, `tooltip`, `separator`.

---

## Registering Payload Components

All components are registered using **file paths** (not imports) in `payload.config.ts`.
Paths are relative to `src/` (set by `importMap.baseDir`).

```ts
admin: {
  components: {
    Nav: '/components/admin/Sidebar',           // replaces sidebar
    header: ['/components/admin/AdminHeader'],  // injected into header actions
    providers: ['/components/admin/GlobalProvider'], // root wrapper
    graphics: {
      Logo: '/components/admin/graphics/NullGraphic',
      Icon: '/components/admin/graphics/NullGraphic',
    },
    views: {
      dashboard: { Component: '/components/admin/dashboard/DashboardView' },
    },
  },
}
```

Named exports use `#ExportName` suffix:
```ts
'/components/admin/MyComponent#MyNamedExport'
```

**After any change to component paths, run:**
```bash
npm run generate:importmap
```

---

## Common Gotchas

### "My custom header appears as a separate floating bar above the admin"

Cause: `fixed`/`absolute` positioning in the header component.
Fix: Remove all positioning — use `flex h-full flex-1 items-center` only.

### "The Payload logo still shows next to my header"

Fix: Register null graphics in `payload.config.ts`:
```ts
graphics: {
  Logo: '/components/admin/graphics/NullGraphic',
  Icon: '/components/admin/graphics/NullGraphic',
}
```
Also hide via CSS: `.app-header__content { display: none !important; }`

### "Dark mode toggle doesn't work"

Causes:
1. `theme: 'light'` in `payload.config.ts` — remove it
2. Missing `@custom-variant dark` in `admin-tailwind.css`
3. CSS in `custom.scss` forcing `:root { --theme: light }` — remove it

### "Component not shown in admin"

1. Wrong path in `payload.config.ts` (check `src/` prefix not needed — paths are relative to `baseDir`)
2. Forgot `npm run generate:importmap`
3. Stale `.next` cache — run `rm -rf .next && npm run dev`

### "My Tailwind classes don't apply"

1. Missing `@source` directive in `admin-tailwind.css`
2. Stale cache — `rm -rf .next`

### "There are two hamburger buttons"

The `Sidebar.tsx` has its own collapse toggle in the header area. Payload's native `NavHamburger` is hidden via CSS:
```scss
.hamburger, .app-header .hamburger, [class*='nav__hamburger'] { display: none !important; }
```

---

## Workflow Checklist

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| After changing component paths in config | `npm run generate:importmap` |
| After changing Payload schemas | `npm run generate:types` |
| Validate TypeScript | `npx tsc --noEmit` |
| Clear stale cache | `rm -rf .next && npm run dev` |
| Production build | `npm run build` |
