# Muno CMS Core - Development Instructions

This is a **Payload CMS v3.79 + Next.js 15 + Tailwind CSS v4** headless CMS core designed for multi-site management with a custom SaaS-style admin dashboard.

**For Payload CMS patterns**, refer to [AGENTS.md](../AGENTS.md) (comprehensive Payload rules, collections, hooks, access control).

---

## Tech Stack

- **Payload CMS**: 3.79.0 (headless CMS with custom admin UI)
- **Next.js**: 15.4.11 (App Router)
- **React**: 19.2.1
- **TypeScript**: Strict mode enabled
- **Database**: PostgreSQL (`@payloadcms/db-postgres`)
- **Rich Text**: Lexical editor (`@payloadcms/richtext-lexical`)
- **CSS**: Tailwind CSS v4 (CSS-based configuration, no `tailwind.config.*`)
- **UI Libraries**:
  - Radix UI (tooltips, avatars, separators, etc.)
  - Framer Motion (animations)
  - cmdk (command palette)
  - Sonner (toast notifications)
  - Recharts (dashboard charts)
  - Lucide React (icons)

---

## Project Architecture

### Directory Structure

```
src/
├── app/
│   ├── (frontend)/              # Public frontend routes (minimal - CMS is primary)
│   ├── (payload)/               # Payload admin routes + layouts
│   │   ├── admin-tailwind.css  # Tailwind CSS config for admin (CRITICAL FILE)
│   │   ├── custom.scss         # Admin theme overrides
│   │   └── layout.tsx          # Auto-generated - imports CSS in order
│   └── my-route/               # Custom API routes
├── collections/                 # Payload collection configs (Users, Media)
├── components/
│   ├── admin/                  # Custom admin components (Sidebar, Dashboard)
│   │   ├── Sidebar.tsx         # Custom Nav (replaces Payload default)
│   │   ├── command-menu/       # ⌘K command palette
│   │   └── dashboard/          # Custom dashboard views
│   └── ui/                     # Reusable UI primitives (Radix-based)
├── lib/
│   └── utils.ts                # cn() helper (clsx + tailwind-merge)
├── payload.config.ts           # Payload configuration
└── payload-types.ts            # Auto-generated types (DO NOT EDIT)
```

### Key Architectural Decisions

1. **Single Dashboard**: Payload Admin (`/admin`) is the primary interface. Custom frontend dashboards have been removed.
2. **Server Components by Default**: All components are Server Components unless they need interactivity (use `'use client'` directive).
3. **Component Paths**: Payload components use file paths (not direct imports) — see `admin.components` in config.
4. **Light Mode Only**: Admin is locked to light theme via `custom.scss`.

---

## CSS Architecture (CRITICAL)

### Tailwind CSS v4 Setup

**Configuration file**: `src/app/(payload)/admin-tailwind.css`

```css
/* Explicit content sources for Tailwind v4 class scanning */
@source "../../components";
@source "../../app";

/* Theme variables (CSS custom properties) — no preflight reset */
@import 'tailwindcss/theme';

/* Animation utilities used by Radix UI (animate-in, fade-in-0, zoom-in-95, etc.) */
@import 'tw-animate-css';

/* Generate utility classes based on detected usage */
@import 'tailwindcss/utilities';
```

**⚠️ CRITICAL PATTERNS**:
- **ALWAYS include `@source` directives** — Without them, Tailwind may not detect component files during dev mode
- **ALWAYS import `tw-animate-css`** — Tooltip and other Radix components require these animation utilities
- **NO `tailwind.config.*` file** — Tailwind v4 uses CSS-based configuration only
- **PostCSS config**: `postcss.config.mjs` only contains `@tailwindcss/postcss` plugin

### CSS Import Order (in `layout.tsx`)

```tsx
import '@payloadcms/next/css'    // 1. Payload styles (base theme)
import './admin-tailwind.css'     // 2. Tailwind utilities
import './custom.scss'            // 3. Custom overrides
```

**Order matters** — Tailwind utilities must come after Payload styles to override them correctly.

### Common CSS Issues

**Problem**: Styles not appearing in dev mode
**Solution**:
```bash
rm -rf .next  # Clear stale cache
npm run dev   # Restart dev server
```

**Problem**: Tooltip animations not working
**Solution**: Ensure `@import 'tw-animate-css'` is in `admin-tailwind.css`

**Problem**: Tailwind utilities not generating
**Solution**: Add/verify `@source` directives in `admin-tailwind.css`

---

## Component Patterns

### Server vs Client Components

**Default**: Server Components (can use Local API directly)

```tsx
// Server Component (no 'use client')
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function MyComponent() {
  const payload = await getPayload({ config })
  const data = await payload.find({ collection: 'posts' })
  return <div>{data.totalDocs} posts</div>
}
```

**Client Components**: Only use when needed (state, effects, event handlers, browser APIs)

```tsx
'use client'
import { useState } from 'react'
import { useAuth } from '@payloadcms/ui'

export function MyClientComponent() {
  const [count, setCount] = useState(0)
  const { user } = useAuth()
  // ...
}
```

### Payload Admin Component Registration

Components are defined via **file paths** (relative to `src/`):

```typescript
// payload.config.ts
admin: {
  components: {
    Nav: '/components/admin/Sidebar',           // Custom sidebar
    views: {
      dashboard: {
        Component: '/components/admin/dashboard/DashboardView',
      },
    },
  },
}
```

**After creating/modifying components**:
```bash
npm run generate:importmap  # Regenerate import map
```

### UI Primitives Pattern

Reusable UI components in `src/components/ui/` follow Radix UI + Tailwind pattern:

```tsx
// src/components/ui/card.tsx
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-100 bg-white shadow-sm",
        className
      )}
      {...props}
    />
  )
}
```

**Key utilities**:
- `cn()` from `@/lib/utils` — Merges Tailwind classes (uses `clsx` + `tailwind-merge`)
- `@/` alias — Maps to `src/` (defined in `tsconfig.json`)

---

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env: Set DATABASE_URL (PostgreSQL) and PAYLOAD_SECRET

# Start development server
npm run dev
```

### Essential Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run devsafe      # Clear .next cache + restart dev

# Type safety
npm run generate:types      # Generate payload-types.ts
npm run generate:importmap  # Regenerate component import map
npx tsc --noEmit           # Validate TypeScript (no output)

# Testing
npm run test         # Run all tests
npm run test:int     # Integration tests (Vitest)
npm run test:e2e     # E2E tests (Playwright)
```

### After Making Changes

| Change Type | Required Actions |
|-------------|------------------|
| Collection schema | `npm run generate:types` |
| Admin components | `npm run generate:importmap` |
| CSS changes (admin) | `rm -rf .next && npm run dev` |
| Database schema | Apply migrations manually (PostgreSQL) |

---

## Environment Variables

```bash
# .env (required)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname  # PostgreSQL connection
PAYLOAD_SECRET=your-secret-key-min-32-chars                    # Encryption key

# Optional
NODE_ENV=development
```

**Note**: This project uses **PostgreSQL** (not MongoDB as shown in `.env.example`).

---

## Common Patterns

### Using Local API

```tsx
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

// Find documents
const posts = await payload.find({
  collection: 'posts',
  where: { status: { equals: 'published' } },
  limit: 10,
})

// Create document
await payload.create({
  collection: 'posts',
  data: { title: 'New Post', content: '...' },
})
```

### Import Path Aliases

```tsx
import { cn } from '@/lib/utils'                          // src/lib/utils.ts
import { Card } from '@/components/ui/card'               // src/components/ui/card.tsx
import config from '@payload-config'                      // src/payload.config.ts
import type { User } from '@/payload-types'               // src/payload-types.ts
```

### Dynamic Imports (Client Components)

```tsx
import dynamic from 'next/dynamic'

const CommandMenu = dynamic(() => import('./CommandMenu'), {
  ssr: false  // Disable SSR for client-only components
})
```

---

## Styling Conventions

### Tailwind Class Patterns

- **Spacing**: Use Tailwind scale (`gap-2`, `px-3`, `py-2.5`)
- **Colors**: 
  - Blue for primary actions: `bg-blue-600 text-white`
  - Gray scale for neutrals: `text-gray-500`, `bg-gray-100`
- **Borders**: `border border-gray-100` (subtle dividers)
- **Shadows**: `shadow-sm` (subtle elevation)
- **Rounded**: `rounded-xl` (cards), `rounded-lg` (buttons)

### Animation Classes (from tw-animate-css)

Used in Radix UI components:
- `animate-in` / `animate-out`
- `fade-in-0`, `fade-out-0`
- `zoom-in-95`, `zoom-out-95`
- `slide-in-from-top-2`, etc.
- `data-[state=open]:animate-in`

---

## Testing

- **Integration tests**: `tests/int/` (Vitest) — API endpoints, Payload operations
- **E2E tests**: `tests/e2e/` (Playwright) — Admin UI workflows, frontend
- **Test utilities**: `tests/helpers/` (login, seedUser)

Run tests before committing:
```bash
npm run test
```

---

## Troubleshooting

### TypeScript Errors

```bash
npx tsc --noEmit  # Check for type errors
npm run generate:types  # Regenerate Payload types
```

### Build Errors

```bash
rm -rf .next  # Clear Next.js cache
npm run build  # Rebuild
```

### Styles Not Applying

1. Check `src/app/(payload)/admin-tailwind.css` has `@source` directives
2. Verify `tw-animate-css` is imported
3. Clear cache: `rm -rf .next && npm run dev`
4. Check CSS import order in `layout.tsx`

### Component Not Found in Admin

```bash
npm run generate:importmap  # Regenerate import map
```

---

## Code Quality Rules

1. **Always use TypeScript** — No `any` types unless absolutely necessary
2. **Run type checks** — `npx tsc --noEmit` before committing
3. **Prefer Server Components** — Only use Client Components when needed
4. **Use `cn()` for class merging** — Never concatenate className strings directly
5. **Follow import conventions** — Use `@/` alias for src imports
6. **Document complex logic** — Add comments for non-obvious patterns
7. **Keep components small** — Extract reusable logic into separate functions/components

---

## Security Notes

- **Access Control**: See [AGENTS.md](../AGENTS.md#access-control) for Payload access patterns
- **Local API**: Access control is **bypassed by default** — always set `overrideAccess: false` when passing `user`
- **Environment Variables**: Never commit `.env` — use `.env.example` template
- **PostgreSQL**: Use parameterized queries (Payload handles this automatically)

---

## Additional Resources

- **Payload Docs**: https://payloadcms.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind v4 Docs**: https://v4.tailwindcss.com
- **Radix UI**: https://www.radix-ui.com/primitives

---

## Quick Reference

### File Naming
- Collections: PascalCase (`Users.ts`, `Media.ts`)
- Components: PascalCase (`Sidebar.tsx`, `DashboardView.tsx`)
- Utilities: camelCase (`utils.ts`)
- CSS: kebab-case (`admin-tailwind.css`)

### Import Order
1. React/Next.js imports
2. Third-party libraries
3. Payload imports
4. Local components/utilities
5. Types
6. CSS

### Component Structure
```tsx
'use client' // If needed

import { ... } from 'react'
import { ... } from 'third-party'
import { ... } from '@payloadcms/...'
import { ... } from '@/components/...'
import type { ... } from '@/payload-types'

export default function Component() {
  // Hooks
  // State
  // Handlers
  // Render
}
```
