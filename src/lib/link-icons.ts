import { existsSync } from "node:fs"
import { join } from "node:path"

export const DEFAULT_LINK_ICON = "custom-external-link.svg"

const LINK_ICONS_BY_DOMAIN: Record<string, string> = {
  "astro-erudite.vercel.app": "custom-erudite.svg",
  "enscribe.dev": "custom-enscribe.svg",
}

const LINK_ICONS_BY_HOST: Record<string, string> = {
  "archive.org": "simple-internetarchive.svg",
  "arxiv.org": "simple-arxiv.svg",
  "codepen.io": "phosphor-codepen-logo.svg",
  "commons.wikimedia.org": "simple-wikipedia.svg",
  "developer.mozilla.org": "simple-mdnwebdocs.svg",
  "en.wikipedia.org": "simple-wikipedia.svg",
  "figma.com": "phosphor-figma-logo.svg",
  "github.com": "simple-github.svg",
  "google.com": "custom-google-logo.svg",
  "scholar.google.com": "simple-googlescholar.svg",
  "instagram.com": "phosphor-instagram-logo.svg",
  "reddit.com": "phosphor-reddit-logo.svg",
  "softwareengineering.stackexchange.com": "simple-stackexchange.svg",
  "web.archive.org": "simple-internetarchive.svg",
  "youtube.com": "phosphor-youtube-logo.svg",
}

const LINK_ICONS_BY_GITHUB_REPOSITORY: Record<string, string> = {
  "/jktrn/astro-erudite": "custom-erudite.svg",
  "/jktrn/enscribe.dev": "custom-enscribe.svg",
}

const normalizeHost = (host: string) =>
  host
    .trim()
    .toLowerCase()
    .replace(/\.$/u, "")
    .replace(/^www\./u, "")

export const linkIconForUrl = (href: string | URL) => {
  const url = href instanceof URL ? href : new URL(href)
  const normalizedHost = normalizeHost(url.hostname)
  const normalizedPath = url.pathname.toLowerCase().replace(/\/+$/u, "")
  if (normalizedHost === "github.com") {
    const repositoryIcon = Object.entries(LINK_ICONS_BY_GITHUB_REPOSITORY).find(
      ([repository]) =>
        normalizedPath === repository ||
        normalizedPath.startsWith(`${repository}/`),
    )?.[1]
    if (repositoryIcon) return repositoryIcon
  }
  const domainIcon = Object.entries(LINK_ICONS_BY_DOMAIN).find(
    ([domain]) =>
      normalizedHost === domain || normalizedHost.endsWith(`.${domain}`),
  )?.[1]
  return LINK_ICONS_BY_HOST[normalizedHost] ?? domainIcon ?? DEFAULT_LINK_ICON
}

const assetDirectory = join(process.cwd(), "public/icons/favicons")

export const assertLinkIconAsset = (asset: string) => {
  if (!existsSync(join(assetDirectory, asset)))
    throw new Error(`link-favicons: missing public/icons/favicons/${asset}`)
  return `/icons/favicons/${asset}`
}
