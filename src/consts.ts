import Email from "@/assets/icons/email.svg"
import GitHub from "@/assets/icons/github.svg"
import GoogleScholar from "@/assets/icons/googlescholar.svg"
import LinkedIn from "@/assets/icons/linkedin.svg"
import RSS from "@/assets/icons/rss.svg"
import type { SvgComponent } from "astro/types"

export const SITE = {
  title: "Ryan Y. Batubara",
  description: "Ryan Batubara's website",
  locale: "en-US",
  dir: "ltr",
  defaultPageImage: "/static/1200x630.webp",
  defaultPostImage: "/static/1200x630.webp",
  featuredPostCount: 1,
  featuredProjectCount: 1,
} as const

export const NAVIGATION = [
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/talks", label: "Talks" },
  { href: "/resources", label: "Resources" },
]

export type SocialLink = {
  href: string
  label: string
  icon: SvgComponent
}

export const SOCIAL_LINKS = {
  github: {
    href: "https://github.com/rybplayer",
    label: "GitHub",
    icon: GitHub,
  },
  scholar: {
    href: "https://scholar.google.com/citations?user=CeLsaNIAAAAJ&hl=en&oi=ao",
    label: "Google Scholar",
    icon: GoogleScholar,
  },
  linkedin: {
    href: "https://linkedin.com/in/ryanbatubara",
    label: "LinkedIn",
    icon: LinkedIn,
  },
  email: {
    href: "mailto:ryan.y.batubara@gmail.com",
    label: "Email",
    icon: Email,
  },
  rss: { href: "/rss.xml", label: "RSS", icon: RSS },
} as const satisfies Record<string, SocialLink>

export type SocialKey = keyof typeof SOCIAL_LINKS

export const getSocialLinks = (keys: readonly SocialKey[]): SocialLink[] =>
  keys.map((key) => SOCIAL_LINKS[key])

export const SOCIALS = getSocialLinks([
  "github",
  "scholar",
  "linkedin",
  "email",
  "rss",
])
