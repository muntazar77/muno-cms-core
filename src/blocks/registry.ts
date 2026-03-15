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

export const BLOCK_REGISTRY: BlockRegistryItem[] = [
  {
    slug: 'hero',
    label: 'Hero',
    description: 'Full-width hero with heading, image & CTA',
    category: 'hero',
    icon: Layout,
    color: '#818cf8',
  },
  {
    slug: 'heroWithImage',
    label: 'Hero with Image',
    description: 'Side-by-side hero with large image',
    category: 'hero',
    icon: Layout,
    color: '#a78bfa',
  },
  {
    slug: 'features',
    label: 'Features Grid',
    description: 'Feature grid with icons & descriptions',
    category: 'features',
    icon: Grid3X3,
    color: '#f472b6',
  },
  {
    slug: 'servicesCards',
    label: 'Services Cards',
    description: 'Service offering cards with icons',
    category: 'features',
    icon: Building2,
    color: '#fb923c',
  },
  {
    slug: 'stepsTimeline',
    label: 'Steps Timeline',
    description: 'Step-by-step process timeline',
    category: 'process',
    icon: ArrowRight,
    color: '#34d399',
  },
  {
    slug: 'statistics',
    label: 'Statistics',
    description: 'Key numbers and metrics',
    category: 'data',
    icon: BarChart3,
    color: '#60a5fa',
  },
  {
    slug: 'testimonials',
    label: 'Testimonials',
    description: 'Customer testimonial cards',
    category: 'social-proof',
    icon: MessageSquareQuote,
    color: '#fbbf24',
  },
  {
    slug: 'logoCloud',
    label: 'Logo Cloud',
    description: 'Trusted-by logo strip',
    category: 'social-proof',
    icon: Award,
    color: '#94a3b8',
  },
  {
    slug: 'text',
    label: 'Rich Text',
    description: 'Lexical rich text content block',
    category: 'content',
    icon: Type,
    color: '#34d399',
  },
  {
    slug: 'pricingTable',
    label: 'Pricing Table',
    description: 'Pricing tiers with features',
    category: 'data',
    icon: CreditCard,
    color: '#c084fc',
  },
  {
    slug: 'faq',
    label: 'FAQ',
    description: 'Frequently asked questions accordion',
    category: 'content',
    icon: HelpCircle,
    color: '#fb7185',
  },
  {
    slug: 'gallery',
    label: 'Gallery',
    description: 'Image gallery with captions',
    category: 'media',
    icon: ImageIcon,
    color: '#fb923c',
  },
  {
    slug: 'form',
    label: 'Contact Form',
    description: 'Dynamic form with field types',
    category: 'forms',
    icon: FileText,
    color: '#a78bfa',
  },
  {
    slug: 'cta',
    label: 'CTA Banner',
    description: 'Conversion-focused call to action',
    category: 'cta',
    icon: MousePointerClick,
    color: '#60a5fa',
  },
]

export function getBlockMeta(slug: string): BlockRegistryItem | undefined {
  return BLOCK_REGISTRY.find((b) => b.slug === slug)
}
