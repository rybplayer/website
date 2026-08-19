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

export const SOCIALS: { href: string; label: string; icon: SvgComponent }[] = [
  { href: "https://github.com/rybplayer", label: "GitHub", icon: GitHub },
  {
    href: "https://scholar.google.com/citations?user=CeLsaNIAAAAJ&hl=en&oi=ao",
    label: "Google Scholar",
    icon: GoogleScholar,
  },
  {
    href: "https://linkedin.com/in/ryanbatubara",
    label: "LinkedIn",
    icon: LinkedIn,
  },
  {
    href: "mailto:ryan.y.batubara@gmail.com",
    label: "Email",
    icon: Email,
  },
  { href: "/rss.xml", label: "RSS", icon: RSS },
]
