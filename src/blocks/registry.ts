import {
  Layout,
  Type,
  Grid3X3,
  Image as ImageIcon,
  MousePointerClick,
  FileText,
  BarChart3,
  Award,
  HelpCircle,
  CreditCard,
  MessageSquareQuote,
  Building2,
  ArrowRight,
  Star,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type BlockCategory =
  | 'hero'
  | 'features'
  | 'content'
  | 'data'
  | 'process'
  | 'social-proof'
  | 'forms'
  | 'media'
  | 'cta'

export interface BlockRegistryItem {
  slug: string
  label: string
  description: string
  category: BlockCategory
  icon: LucideIcon
  color: string
  defaultData: Record<string, unknown>
}

export const BLOCK_CATEGORIES: { id: BlockCategory; label: string }[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'features', label: 'Features' },
  { id: 'content', label: 'Content' },
  { id: 'data', label: 'Data' },
  { id: 'process', label: 'Process' },
  { id: 'social-proof', label: 'Social Proof' },
  { id: 'forms', label: 'Forms' },
  { id: 'media', label: 'Media' },
  { id: 'cta', label: 'CTA' },
]

function id() {
  return Math.random().toString(36).substring(2, 10)
}

export const BLOCK_REGISTRY: BlockRegistryItem[] = [
  {
    slug: 'hero',
    label: 'Hero',
    description: 'Full-width hero with heading, image & CTA',
    category: 'hero',
    icon: Layout,
    color: '#818cf8',
    defaultData: {
      heading: 'Build something amazing today',
      subheading:
        'Create stunning websites with our powerful visual builder. No coding required — just drag, drop, and publish.',
      ctaLabel: 'Get Started',
      ctaLink: '#',
      style: 'gradient',
    },
  },
  {
    slug: 'heroWithImage',
    label: 'Hero with Image',
    description: 'Side-by-side hero with large image',
    category: 'hero',
    icon: Layout,
    color: '#a78bfa',
    defaultData: {
      eyebrow: 'Welcome',
      heading: 'The modern way to build websites',
      subheading:
        'A powerful platform that gives you everything you need to create, launch, and grow your online presence.',
      primaryCtaLabel: 'Start Free Trial',
      primaryCtaLink: '#',
      secondaryCtaLabel: 'Learn More',
      alignment: 'left',
    },
  },
  {
    slug: 'features',
    label: 'Features Grid',
    description: 'Feature grid with icons & descriptions',
    category: 'features',
    icon: Grid3X3,
    color: '#f472b6',
    defaultData: {
      heading: 'Everything you need to succeed',
      style: 'cards',
      features: [
        {
          id: id(),
          title: 'Lightning Fast',
          description:
            'Optimized for speed with built-in performance features that keep your site loading in milliseconds.',
          icon: '⚡',
        },
        {
          id: id(),
          title: 'Secure by Default',
          description:
            'Enterprise-grade security with automatic SSL, DDoS protection, and regular security audits.',
          icon: '🛡️',
        },
        {
          id: id(),
          title: 'Advanced Analytics',
          description:
            'Understand your audience with real-time analytics, conversion tracking, and custom reports.',
          icon: '📊',
        },
      ],
    },
  },
  {
    slug: 'servicesCards',
    label: 'Services Cards',
    description: 'Service offering cards with icons',
    category: 'features',
    icon: Building2,
    color: '#fb923c',
    defaultData: {
      heading: 'Our services',
      subheading: 'We offer a comprehensive range of solutions to help your business grow and thrive.',
      style: 'cards',
      services: [
        {
          id: id(),
          title: 'Web Development',
          description:
            'Custom websites and web applications built with modern technologies and best practices.',
          icon: '🌐',
          link: '#',
        },
        {
          id: id(),
          title: 'UI/UX Design',
          description:
            'Beautiful, intuitive interfaces designed to delight users and drive engagement.',
          icon: '🎨',
          link: '#',
        },
        {
          id: id(),
          title: 'Digital Marketing',
          description:
            'Data-driven strategies to increase visibility, traffic, and conversions for your brand.',
          icon: '📈',
          link: '#',
        },
      ],
    },
  },
  {
    slug: 'stepsTimeline',
    label: 'Steps Timeline',
    description: 'Step-by-step process timeline',
    category: 'process',
    icon: ArrowRight,
    color: '#34d399',
    defaultData: {
      heading: 'How it works',
      subheading: 'Get started in three simple steps. No technical knowledge required.',
      style: 'timeline',
      steps: [
        {
          id: id(),
          title: 'Create your account',
          description:
            'Sign up in seconds with your email. No credit card required to get started.',
        },
        {
          id: id(),
          title: 'Design your site',
          description:
            'Use our visual builder to create beautiful pages with drag-and-drop blocks.',
        },
        {
          id: id(),
          title: 'Publish and grow',
          description:
            'Go live with one click and start reaching your audience. Scale as you grow.',
        },
      ],
    },
  },
  {
    slug: 'statistics',
    label: 'Statistics',
    description: 'Key numbers and metrics',
    category: 'data',
    icon: BarChart3,
    color: '#60a5fa',
    defaultData: {
      heading: 'Trusted by thousands',
      style: 'dark',
      stats: [
        { id: id(), value: '10K+', label: 'Active Users' },
        { id: id(), value: '99.9%', label: 'Uptime' },
        { id: id(), value: '150+', label: 'Countries' },
        { id: id(), value: '24/7', label: 'Support' },
      ],
    },
  },
  {
    slug: 'testimonials',
    label: 'Testimonials',
    description: 'Customer testimonial cards',
    category: 'social-proof',
    icon: MessageSquareQuote,
    color: '#fbbf24',
    defaultData: {
      heading: 'What our customers say',
      style: 'cards',
      testimonials: [
        {
          id: id(),
          quote:
            'This platform completely transformed our online presence. The visual builder is incredibly intuitive and powerful.',
          author: 'Sarah Johnson',
          role: 'CEO, TechStart',
        },
        {
          id: id(),
          quote:
            'We switched from our old CMS and the difference is night and day. Our team loves how easy it is to make changes.',
          author: 'Michael Chen',
          role: 'Marketing Director, GrowthCo',
        },
        {
          id: id(),
          quote:
            'The best investment we made this year. Our site looks professional and our conversion rates have doubled.',
          author: 'Emily Rodriguez',
          role: 'Founder, DesignLab',
        },
      ],
    },
  },
  {
    slug: 'logoCloud',
    label: 'Logo Cloud',
    description: 'Trusted-by logo strip',
    category: 'social-proof',
    icon: Award,
    color: '#94a3b8',
    defaultData: {
      heading: 'Trusted by leading companies',
    },
  },
  {
    slug: 'text',
    label: 'Rich Text',
    description: 'Lexical rich text content block',
    category: 'content',
    icon: Type,
    color: '#34d399',
    defaultData: {
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              tag: 'h2',
              children: [{ type: 'text', text: 'Welcome to your new page' }],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'This is a rich text block. You can edit this content in the Payload CMS admin panel. Use headings, paragraphs, links, lists, and more to create compelling content for your visitors.',
                },
              ],
            },
          ],
        },
      },
    },
  },
  {
    slug: 'pricingTable',
    label: 'Pricing Table',
    description: 'Pricing tiers with features',
    category: 'data',
    icon: CreditCard,
    color: '#c084fc',
    defaultData: {
      heading: 'Simple, transparent pricing',
      subheading: 'Choose the plan that works best for you. All plans include a 14-day free trial.',
      plans: [
        {
          id: id(),
          name: 'Starter',
          price: '$9/mo',
          description: 'Perfect for personal projects and small sites.',
          features: 'Up to 5 pages\nCustom domain\nBasic analytics\nEmail support',
          ctaLabel: 'Start Free Trial',
          ctaLink: '#',
          highlighted: false,
        },
        {
          id: id(),
          name: 'Pro',
          price: '$29/mo',
          description: 'For growing businesses that need more power.',
          features:
            'Unlimited pages\nCustom domain\nAdvanced analytics\nPriority support\nTeam collaboration\nCustom code',
          ctaLabel: 'Start Free Trial',
          ctaLink: '#',
          highlighted: true,
        },
        {
          id: id(),
          name: 'Enterprise',
          price: '$99/mo',
          description: 'For large teams with advanced requirements.',
          features:
            'Everything in Pro\nDedicated support\nCustom integrations\nSLA guarantee\nAdvanced security\nAPI access',
          ctaLabel: 'Contact Sales',
          ctaLink: '#',
          highlighted: false,
        },
      ],
    },
  },
  {
    slug: 'faq',
    label: 'FAQ',
    description: 'Frequently asked questions accordion',
    category: 'content',
    icon: HelpCircle,
    color: '#fb7185',
    defaultData: {
      heading: 'Frequently asked questions',
      style: 'accordion',
      items: [
        {
          id: id(),
          question: 'How do I get started?',
          answer:
            'Simply create an account and you can start building your website immediately. Our visual builder makes it easy to create beautiful pages without any coding knowledge.',
        },
        {
          id: id(),
          question: 'Can I use my own domain?',
          answer:
            'Yes! All plans include custom domain support. You can connect your existing domain or purchase a new one directly through our platform.',
        },
        {
          id: id(),
          question: 'Is there a free trial?',
          answer:
            'Absolutely! We offer a 14-day free trial on all plans. No credit card required. You can explore all features before deciding which plan works best for you.',
        },
      ],
    },
  },
  {
    slug: 'gallery',
    label: 'Gallery',
    description: 'Image gallery with captions',
    category: 'media',
    icon: ImageIcon,
    color: '#fb923c',
    defaultData: {
      heading: 'Our work',
    },
  },
  {
    slug: 'form',
    label: 'Contact Form',
    description: 'Dynamic form with field types',
    category: 'forms',
    icon: FileText,
    color: '#a78bfa',
    defaultData: {
      heading: 'Get in touch',
      description: 'Have a question or want to work together? Fill out the form below and we will get back to you as soon as possible.',
    },
  },
  {
    slug: 'cta',
    label: 'CTA Banner',
    description: 'Conversion-focused call to action',
    category: 'cta',
    icon: MousePointerClick,
    color: '#60a5fa',
    defaultData: {
      heading: 'Ready to get started?',
      description:
        'Join thousands of satisfied customers and transform your online presence today.',
      buttonLabel: 'Start Free Trial',
      buttonLink: '#',
      style: 'withBackground',
    },
  },
]

export function getBlockMeta(slug: string): BlockRegistryItem | undefined {
  return BLOCK_REGISTRY.find((b) => b.slug === slug)
}
