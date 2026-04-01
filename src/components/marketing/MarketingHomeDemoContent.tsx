import React from 'react'
import Link from 'next/link'
import {
  Globe,
  LayoutTemplate,
  FileText,
  Image as ImageIcon,
  FormInput,
  Settings2,
  Layers,
  ChevronRight,
  Users,
  Zap,
  Shield,
  BarChart3,
  Code2,
  CheckCircle2,
  ArrowRight,
  Building2,
  Puzzle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-(--fe-primary)/25 bg-(--fe-primary)/8 px-3 py-1 text-xs font-semibold text-(--fe-primary)',
        className,
      )}
    >
      {children}
    </span>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <Badge>{children}</Badge>
}

function SectionHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        'text-3xl font-extrabold tracking-tight text-(--fe-text-primary) sm:text-4xl lg:text-5xl',
        className,
      )}
    >
      {children}
    </h2>
  )
}

function SectionSubheading({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p className={cn('text-lg text-(--fe-text-secondary) leading-relaxed', className)}>
      {children}
    </p>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Background gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in srgb, var(--fe-primary) 12%, transparent), transparent),
            var(--fe-surface-primary)
          `,
        }}
      />

      {/* Grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: `linear-gradient(var(--fe-border) 1px, transparent 1px), linear-gradient(90deg, var(--fe-border) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 40%, transparent 100%)',
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <Badge>
            <Zap className="h-3 w-3" />
            The multi-site CMS built for agencies
          </Badge>
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight text-(--fe-text-primary) sm:text-6xl lg:text-7xl leading-[1.08]">
          Build & manage{' '}
          <span
            style={{
              background: `linear-gradient(135deg, var(--fe-primary) 0%, color-mix(in srgb, var(--fe-primary) 70%, #8b5cf6) 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            multiple websites
          </span>{' '}
          from one dashboard
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-xl text-(--fe-text-secondary) leading-relaxed">
          MonoCMS is a powerful headless CMS and website builder designed for agencies, freelancers,
          and multi-site operators. One platform. Unlimited client sites.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ background: 'var(--fe-primary)' }}
          >
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-(--fe-text-primary) border border-(--fe-border) hover:bg-(--fe-surface-secondary) transition-colors"
          >
            See features
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Hero visual: dashboard mockup */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div
            className="relative rounded-2xl border border-(--fe-border) shadow-2xl overflow-hidden"
            style={{ background: 'var(--fe-surface-secondary)' }}
          >
            {/* Browser chrome */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-b border-(--fe-border)"
              style={{ background: 'var(--fe-surface-primary)' }}
            >
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/70" />
                <div className="h-3 w-3 rounded-full bg-amber-400/70" />
                <div className="h-3 w-3 rounded-full bg-emerald-400/70" />
              </div>
              <div
                className="flex-1 mx-3 h-6 rounded-md flex items-center px-3 text-xs text-(--fe-text-muted)"
                style={{ background: 'var(--fe-surface-tertiary, var(--fe-surface-secondary))' }}
              >
                app.monocms.app/admin
              </div>
            </div>

            {/* Dashboard layout mockup */}
            <div className="flex min-h-90">
              {/* Sidebar */}
              <div
                className="hidden sm:flex w-50 flex-col gap-1 p-4 border-r border-(--fe-border) shrink-0"
                style={{ background: 'var(--fe-surface-primary)' }}
              >
                {['Dashboard', 'Sites', 'Pages', 'Media', 'Forms', 'Services'].map((item) => (
                  <div
                    key={item}
                    className={cn(
                      'h-8 rounded-md px-3 flex items-center text-xs font-medium',
                      item === 'Dashboard'
                        ? 'bg-(--fe-primary)/10 text-(--fe-primary)'
                        : 'text-(--fe-text-muted)',
                    )}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Main area */}
              <div className="flex-1 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div
                    className="h-5 w-32 rounded bg-(--fe-border)"
                    style={{ opacity: 0.6 }}
                  />
                  <div
                    className="h-7 w-24 rounded-lg"
                    style={{ background: 'var(--fe-primary)', opacity: 0.8 }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Sites', value: '12' },
                    { label: 'Pages', value: '94' },
                    { label: 'Submissions', value: '243' },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-xl border border-(--fe-border) p-4"
                      style={{ background: 'var(--fe-surface-primary)' }}
                    >
                      <p className="text-xs text-(--fe-text-muted) mb-1">{label}</p>
                      <p className="text-2xl font-bold text-(--fe-text-primary)">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 rounded-xl border border-(--fe-border)"
                      style={{
                        background: 'var(--fe-surface-primary)',
                        opacity: 1 - i * 0.12,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Reflection */}
          <div
            className="mx-6 h-6 rounded-b-2xl blur-lg opacity-20"
            style={{ background: 'var(--fe-primary)' }}
          />
        </div>
      </div>
    </section>
  )
}

// ─── Trust Bar ────────────────────────────────────────────────────────────────

function TrustBar() {
  const stats = [
    { value: '1,000+', label: 'Websites built' },
    { value: '50+', label: 'Agency customers' },
    { value: '17', label: 'Block types' },
    { value: '99.9%', label: 'Uptime SLA' },
  ]

  return (
    <section className="border-y border-(--fe-border) py-12" style={{ background: 'var(--fe-surface-secondary)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-(--fe-text-muted) mb-8">
          Trusted by agencies and multi-site operators
        </p>
        <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <dt className="text-3xl font-black text-(--fe-text-primary)">{value}</dt>
              <dd className="mt-1 text-sm text-(--fe-text-secondary)">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

// ─── Value Props ──────────────────────────────────────────────────────────────

const VALUE_PROPS = [
  {
    icon: Globe,
    title: 'One CMS, unlimited sites',
    description:
      'Manage all your client websites from a single installation. No more fragmented setups or context switching.',
    color: '#6366f1',
  },
  {
    icon: Layers,
    title: 'Visual page builder',
    description:
      'Drag-and-drop 17 pre-made content blocks. Build complete pages in minutes, no coding required.',
    color: '#0ea5e9',
  },
  {
    icon: Users,
    title: 'Client-ready permissions',
    description:
      'Role-based access control keeps each client isolated to their own site. Super-admin sees everything.',
    color: '#10b981',
  },
  {
    icon: Zap,
    title: 'Fast by default',
    description:
      'Built on Next.js 15 with ISR. Marketing and client sites are server-rendered and edge-cached out of the box.',
    color: '#f59e0b',
  },
]

function ValuePropsSection() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionLabel>Why MonoCMS</SectionLabel>
          <SectionHeading className="mt-4">
            Everything you need,
            <br />
            nothing you don&apos;t
          </SectionHeading>
          <SectionSubheading className="mt-5 max-w-2xl mx-auto">
            We stripped CMS down to what agencies actually need and wrapped it in a clean,
            modern interface.
          </SectionSubheading>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-(--fe-border) p-6 hover:border-(--fe-primary)/40 transition-all duration-300 hover:shadow-lg"
              style={{ background: 'var(--fe-surface-primary)' }}
            >
              <div
                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: `${color}15`, color }}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-(--fe-text-primary) mb-2">{title}</h3>
              <p className="text-sm text-(--fe-text-secondary) leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Features Bento Grid ──────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: LayoutTemplate,
    title: 'Page Builder',
    description: '17 content blocks including Hero, Features, Pricing, FAQ, Gallery, and more.',
    size: 'large',
  },
  {
    icon: FileText,
    title: 'Pages & Content',
    description: 'Full page management with drafts, publish states, and slug routing.',
    size: 'regular',
  },
  {
    icon: ImageIcon,
    title: 'Media Library',
    description: 'Centralised file uploads with image optimisation built in.',
    size: 'regular',
  },
  {
    icon: FormInput,
    title: 'Forms',
    description: 'Create contact forms, lead capture forms, and view submissions in the admin.',
    size: 'regular',
  },
  {
    icon: Settings2,
    title: 'Site Settings',
    description: 'Per-site branding, nav, footer, SEO, and domain configuration.',
    size: 'regular',
  },
  {
    icon: Code2,
    title: 'Headless API',
    description: 'Full REST API with typed responses. Build custom frontends on any stack.',
    size: 'regular',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Super-admin and client roles. Each client sees only their own site.',
    size: 'regular',
  },
  {
    icon: BarChart3,
    title: 'Dashboard',
    description: 'Clean overview of all sites, pages, and submissions at a glance.',
    size: 'large',
  },
]

function FeaturesGrid() {
  return (
    <section
      className="py-24"
      style={{ background: 'var(--fe-surface-secondary)' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionLabel>Full Feature Set</SectionLabel>
          <SectionHeading className="mt-4">All the tools in one place</SectionHeading>
          <SectionSubheading className="mt-5 max-w-2xl mx-auto">
            No integrations, no plugins maze. Everything ships out of the box.
          </SectionSubheading>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description, size }) => (
            <div
              key={title}
              className={cn(
                'group rounded-2xl border border-(--fe-border) p-7 hover:border-(--fe-primary)/40 transition-all duration-300 hover:shadow-md',
                size === 'large' && 'sm:col-span-2 lg:col-span-1',
              )}
              style={{ background: 'var(--fe-surface-primary)' }}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-(--fe-primary)/10 text-(--fe-primary)">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-(--fe-text-primary) mb-2">{title}</h3>
              <p className="text-sm text-(--fe-text-secondary) leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    step: '01',
    title: 'Create your sites',
    description:
      'Add each client site in the Sites panel. Assign a subdomain or custom domain. Invite your client as an owner.',
    icon: Building2,
  },
  {
    step: '02',
    title: 'Build pages with blocks',
    description:
      'Open the visual page builder. Drag-and-drop content blocks to compose full pages. No code needed.',
    icon: Puzzle,
  },
  {
    step: '03',
    title: 'Publish & manage',
    description:
      'Set pages to Published. Your client can edit their own content independently. You stay in control.',
    icon: Zap,
  },
]

function HowItWorksSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionLabel>How it works</SectionLabel>
          <SectionHeading className="mt-4">Up and running in minutes</SectionHeading>
          <SectionSubheading className="mt-5 max-w-xl mx-auto">
            Three steps from zero to a live, editable client website.
          </SectionSubheading>
        </div>

        <div className="relative grid gap-8 lg:grid-cols-3">
          {/* Connecting line (desktop) */}
          <div
            aria-hidden
            className="absolute top-10 left-0 right-0 hidden lg:block h-px"
            style={{
              background: `linear-gradient(90deg, transparent 5%, var(--fe-border) 20%, var(--fe-border) 80%, transparent 95%)`,
            }}
          />

          {STEPS.map(({ step, title, description, icon: Icon }) => (
            <div key={step} className="relative flex flex-col items-center text-center">
              {/* Step circle */}
              <div
                className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-(--fe-primary)/30 shadow-lg"
                style={{ background: 'var(--fe-surface-primary)' }}
              >
                <Icon className="h-8 w-8 text-(--fe-primary)" />
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black text-white" style={{ background: 'var(--fe-primary)' }}>
                  {step.replace('0', '')}
                </span>
              </div>
              <h3 className="text-lg font-bold text-(--fe-text-primary) mb-3">{title}</h3>
              <p className="text-sm text-(--fe-text-secondary) leading-relaxed max-w-xs">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Multi-Site Explainer ─────────────────────────────────────────────────────

function MultiSiteSection() {
  return (
    <section
      className="py-24"
      style={{ background: 'var(--fe-surface-secondary)' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text */}
          <div>
            <SectionLabel>Multi-Site Architecture</SectionLabel>
            <SectionHeading className="mt-4">
              One CMS dashboard.
              <br />
              Infinite websites.
            </SectionHeading>
            <SectionSubheading className="mt-5">
              Traditional CMS platforms give you one site per installation. MonoCMS is built
              differently — every client site lives in the same system, isolated by role-based
              permissions.
            </SectionSubheading>
            <ul className="mt-7 flex flex-col gap-4">
              {[
                'Each client only sees their own site and data',
                'Super-admin has a bird-eye view of everything',
                'Custom domains and subdomains per client',
                'Separate branding, nav, and footer per site',
                'One codebase, one deploy, one billing',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-500" />
                  <span className="text-sm text-(--fe-text-secondary)">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="grid gap-3">
              {/* Central node */}
              <div
                className="mx-auto flex items-center gap-3 rounded-2xl border-2 border-(--fe-primary)/40 px-6 py-4 shadow-lg w-fit"
                style={{ background: 'var(--fe-surface-primary)' }}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-black"
                  style={{ background: 'var(--fe-primary)' }}
                >
                  M
                </span>
                <div>
                  <p className="text-xs font-bold text-(--fe-text-primary)">MonoCMS Admin</p>
                  <p className="text-xs text-(--fe-text-muted)">app.monocms.app</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <svg width="2" height="32" className="text-(--fe-border)">
                  <line x1="1" y1="0" x2="1" y2="32" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
                </svg>
              </div>

              {/* Client sites */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'ali.monocms.app', color: '#6366f1' },
                  { name: 'restaurant.monocms.app', color: '#0ea5e9' },
                  { name: 'acme.com', color: '#10b981' },
                ].map(({ name, color }) => (
                  <div
                    key={name}
                    className="rounded-xl border border-(--fe-border) p-3 text-center hover:border-(--fe-primary)/40 transition-colors"
                    style={{ background: 'var(--fe-surface-primary)' }}
                  >
                    <div
                      className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-lg"
                      style={{ background: `${color}15`, color }}
                    >
                      <Globe className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-[10px] font-medium text-(--fe-text-secondary) leading-tight break-all">
                      {name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Why MonoCMS ──────────────────────────────────────────────────────────────

const COMPARISON = [
  { feature: 'Multi-site from one install', mono: true, others: false },
  { feature: 'Visual page builder (17 blocks)', mono: true, others: false },
  { feature: 'Client permission isolation', mono: true, others: false },
  { feature: 'Custom domain per site', mono: true, others: true },
  { feature: 'Headless API included', mono: true, others: true },
  { feature: 'No plugin marketplace chaos', mono: true, others: false },
  { feature: 'Next.js 15 + Tailwind stack', mono: true, others: false },
  { feature: 'PostgreSQL + type-safe schema', mono: true, others: false },
]

function WhyMonoCMSSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <SectionLabel>Why MonoCMS</SectionLabel>
          <SectionHeading className="mt-4">Built for agencies, not bloggers</SectionHeading>
          <SectionSubheading className="mt-5 max-w-2xl mx-auto">
            Most CMS are designed around a single website. MonoCMS was designed from day one for
            managing portfolios of sites.
          </SectionSubheading>
        </div>

        <div
          className="overflow-hidden rounded-2xl border border-(--fe-border) shadow-sm"
          style={{ background: 'var(--fe-surface-primary)' }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-[1fr_100px_100px] items-center px-6 py-4 border-b border-(--fe-border)"
            style={{ background: 'var(--fe-surface-secondary)' }}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-(--fe-text-muted)">
              Feature
            </span>
            <span className="text-center text-xs font-bold text-(--fe-primary)">MonoCMS</span>
            <span className="text-center text-xs font-bold text-(--fe-text-muted)">Others</span>
          </div>

          {COMPARISON.map(({ feature, mono, others }, i) => (
            <div
              key={feature}
              className={cn(
                'grid grid-cols-[1fr_100px_100px] items-center px-6 py-4',
                i !== COMPARISON.length - 1 && 'border-b border-(--fe-border)',
              )}
            >
              <span className="text-sm text-(--fe-text-secondary)">{feature}</span>
              <div className="flex justify-center">
                {mono ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <span className="text-(--fe-text-muted)">—</span>
                )}
              </div>
              <div className="flex justify-center">
                {others ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500/50" />
                ) : (
                  <span className="text-(--fe-text-muted)">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA Section ─────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="py-24" style={{ background: 'var(--fe-surface-secondary)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-20 text-center shadow-2xl"
          style={{
            background: `linear-gradient(135deg, var(--fe-primary) 0%, color-mix(in srgb, var(--fe-primary) 60%, #8b5cf6) 100%)`,
          }}
        >
          {/* Background pattern */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 50%, white 0%, transparent 50%), radial-gradient(circle at 70% 50%, white 0%, transparent 50%)`,
            }}
          />

          <div className="relative">
            <Badge className="border-white/30 bg-white/15 text-white mb-6">
              <Zap className="h-3 w-3" />
              Get started today — it&apos;s free
            </Badge>

            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Ready to manage all your
              <br />
              sites from one place?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/80 leading-relaxed">
              Set up MonoCMS in minutes. No credit card required. Start with one site and scale as
              your agency grows.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold transition-all duration-200 hover:bg-white/90 shadow-lg hover:shadow-xl"
                style={{ color: 'var(--fe-primary)' }}
              >
                Open the dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white hover:bg-white/20 transition-colors"
              >
                View on GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function MarketingHomeDemoContent() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <TrustBar />
      <ValuePropsSection />
      <FeaturesGrid />
      <HowItWorksSection />
      <MultiSiteSection />
      <WhyMonoCMSSection />
      <CTASection />
    </div>
  )
}
