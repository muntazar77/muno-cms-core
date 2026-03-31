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
  Sparkles,
  LayoutGrid,
  SplitSquareVertical,
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
      subheading:
        'We offer a comprehensive range of solutions to help your business grow and thrive.',
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
      heading: 'Voice of success, told with confidence.',
      style: 'featured',
      testimonials: [
        {
          id: id(),
          quote:
            'The path into my nursing Ausbildung in Hamburg felt impossible at first. They turned it into a sequence of clear tasks, and that changed everything.',
          author: 'Ahmed Mansour',
          role: 'Nursing Apprentice, Hamburg',
        },
        {
          id: id(),
          quote:
            'They did not just improve my admission file. They made the whole move to Germany feel possible.',
          author: 'Sara Khan',
          role: 'M.Sc. Data Science, Munich',
        },
        {
          id: id(),
          quote:
            'Professional, calm, and detail-focused. I always knew what the next step was, and that gave me confidence before the embassy interview.',
          author: 'Javier Lopez',
          role: 'IT Specialist, Berlin',
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
      logos: [
        { id: id(), name: 'Partner One' },
        { id: id(), name: 'Partner Two' },
        { id: id(), name: 'Partner Three' },
        { id: id(), name: 'Partner Four' },
      ],
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
      heading: 'Questions students usually ask before making a move.',
      description:
        'This section feels stronger with context and visual weight, not just plain accordion rows.',
      style: 'sidebar',
      items: [
        {
          id: id(),
          question: 'What is the Dual Ausbildung system?',
          answer:
            'The Dual Ausbildung system combines school-based learning with paid company training. It is a strong route for practical experience and structured career growth.',
        },
        {
          id: id(),
          question: 'Do I need German fluency before applying?',
          answer:
            'For many Ausbildung and undergraduate paths, B1 or B2 German is important. Some postgraduate programs are available in English, depending on institution requirements.',
        },
        {
          id: id(),
          question: 'How long does visa processing usually take?',
          answer:
            'Depending on embassy and country, a realistic planning window is often 4 to 12 weeks after complete file submission. Starting early matters.',
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
      images: [
        { id: id(), caption: 'Campus mentorship session' },
        { id: id(), caption: 'Visa file preparation' },
        { id: id(), caption: 'Student success story' },
      ],
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
      style: 'split',
      heading: 'Start your journey with a clearer first step.',
      description:
        'Tell us about your background, target path, and current stage. We will guide you toward the most realistic next move.',
      leftPanelHeading: 'Start your journey with a clearer first step.',
      leftPanelDescription:
        'Tell us about your background, target path, and current stage. We will guide you toward the most realistic next move.',
      contactItems: [
        { id: id(), icon: '✉', label: 'hello@academiccurator.de' },
        { id: id(), icon: '☎', label: '+49 (0) 30 1234567' },
      ],
      submitLabel: 'Send My Inquiry',
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
  {
    slug: 'heroEditorial',
    label: 'Hero Editorial',
    description: 'Two-column hero with stats, side images, and overlay cards',
    category: 'hero',
    icon: Sparkles,
    color: '#818cf8',
    defaultData: {
      eyebrow: 'Precision support for Germany-bound students',
      badgeLabel: 'Precision support for Germany-bound students',
      heading: 'Build your path to education, work, and life in Germany.',
      highlightedWord: 'education',
      subheading:
        'From Ausbildung placement and university admissions to visa strategy and relocation guidance, Academic Curator turns a stressful process into a clear, human journey.',
      primaryCtaLabel: 'Explore Services',
      primaryCtaLink: '#services',
      secondaryCtaLabel: 'Get a Consultation',
      secondaryCtaLink: '#contact',
      stats: [
        {
          id: id(),
          value: '100+',
          label: 'Successful placements',
          description: 'Admissions and placement journeys guided end-to-end.',
          color: 'blue',
        },
        {
          id: id(),
          value: '98%',
          label: 'Visa support success',
          description: 'Approval support rate with detail-first document checks.',
          color: 'amber',
        },
        {
          id: id(),
          value: '1:1',
          label: 'Hands-on guidance',
          description: 'Personal guidance for admissions, embassy, and arrival.',
          color: 'green',
        },
      ],
      topOverlayCard: {
        cardLabel: 'Current focus',
        cardText: 'Admission + Visa + Arrival',
      },
      bottomOverlayCard: {
        cardLabel: 'What clients value',
        itemTitle: 'Clear next steps',
        itemDescription: 'No confusion around paperwork, timeline, or eligibility.',
      },
      sideImages: [{ id: id() }],
      featureHighlights: [
        { id: id(), title: 'Application strategy' },
        { id: id(), title: 'Document review' },
        { id: id(), title: 'Embassy prep' },
        { id: id(), title: 'Arrival guidance' },
      ],
    },
  },
  {
    slug: 'servicesBento',
    label: 'Services Bento',
    description: 'Bento grid layout with featured and themed service cards',
    category: 'features',
    icon: LayoutGrid,
    color: '#34d399',
    defaultData: {
      eyebrow: 'Core Services',
      heading: 'Precision-driven support, shaped around real student goals.',
      description:
        'Each service is packaged around a real outcome: an admission offer, an Ausbildung contract, a complete visa file, or a stronger long-term plan.',
      items: [
        {
          id: id(),
          icon: '🎓',
          title: 'Ausbildung Placement Support',
          description:
            'Find strong vocational opportunities, prepare applications, and move through interviews with confidence.',
          badge: 'Featured service',
          ctaLabel: 'Featured service',
          ctaLink: '#',
          isFeatured: true,
          theme: 'light',
          iconStyle: 'primarySoft',
        },
        {
          id: id(),
          icon: '🏛',
          title: 'University Admission Strategy',
          description:
            'Bachelor and Master admissions planning with clearer targeting and stronger documentation.',
          theme: 'dark',
          iconStyle: 'darkGlass',
          details: [
            { id: id(), detail: 'Program matching' },
            { id: id(), detail: 'SOP guidance' },
            { id: id(), detail: 'Application review' },
            { id: id(), detail: 'Deadline planning' },
          ],
        },
        {
          id: id(),
          icon: '📄',
          title: 'Visa & Documents',
          description:
            'Blocked account setup, document review, and embassy preparation with disciplined detail.',
          theme: 'light',
          iconStyle: 'secondarySoft',
        },
        {
          id: id(),
          icon: '🧠',
          title: '1:1 Consultation',
          description: 'Evaluate documents, language level, and best practical route into Germany.',
          theme: 'light',
          iconStyle: 'primarySoft',
        },
        {
          id: id(),
          icon: '💼',
          title: 'Career Guidance',
          description:
            'Long-term planning and labor-market orientation for post-study opportunities.',
          theme: 'light',
          iconStyle: 'surfaceHigh',
        },
      ],
    },
  },
  {
    slug: 'splitContent',
    label: 'Split Content',
    description: 'Two-column split layout with features and images',
    category: 'content',
    icon: SplitSquareVertical,
    color: '#f472b6',
    defaultData: {
      eyebrow: 'Why students trust us',
      heading: 'A premium service feel, without losing empathy.',
      description:
        'Students trust Academic Curator because the process feels organized, honest, and deeply human.',
      theme: 'brand',
      imagePosition: 'right',
      calloutText: 'Editorial clarity, practical action, and less noise.',
      showSkewAccent: true,
      features: [
        {
          id: id(),
          icon: '🏆',
          title: 'Uncompromising precision',
          description:
            'Documents, timelines, and requirements are handled carefully so mistakes do not cost months.',
        },
        {
          id: id(),
          icon: '⚡',
          title: 'Faster, clearer execution',
          description:
            'Students always know the next step, what is missing, and which path is realistic.',
        },
        {
          id: id(),
          icon: '🤝',
          title: 'Warm human guidance',
          description: 'Premium experience without cold or robotic communication.',
        },
      ],
      images: [{ id: id() }, { id: id() }, { id: id() }],
    },
  },
]

export function getBlockMeta(slug: string): BlockRegistryItem | undefined {
  return BLOCK_REGISTRY.find((b) => b.slug === slug)
}
