import { satteri } from "@astrojs/markdown-satteri"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import { defineConfig } from "astro/config"
import { readdir, readFile } from "node:fs/promises"
import { basename, extname, join, relative } from "node:path"
import { calloutDirective } from "./src/lib/callout"
import { externalLinks } from "./src/lib/external-links"
import {
  blockExpressiveCode,
  inlineExpressiveCode,
} from "./src/lib/expressive-code"
import { headingAnchors } from "./src/lib/heading-anchors"
import { headingNamespace } from "./src/lib/heading-namespace"
import { linkFavicons } from "./src/lib/link-favicons"
import { temmlMath } from "./src/lib/math"

const contentProcessor = () =>
  satteri({
    features: { directive: true, math: true, smartPunctuation: true },
    mdastPlugins: [calloutDirective, inlineExpressiveCode, temmlMath],
    hastPlugins: [
      externalLinks,
      linkFavicons,
      blockExpressiveCode,
      headingNamespace,
      headingAnchors,
    ],
  })

const CONTENT_ROOT = "./src/content"

const getArticleLastmods = async () => {
  const lastmods = new Map<string, Date>()

  for (const collection of ["blog", "resources"]) {
    const root = join(CONTENT_ROOT, collection)
    const files = await readdir(root, { recursive: true })

    await Promise.all(
      files
        .filter(
          (file) =>
            typeof file === "string" && [".md", ".mdx"].includes(extname(file)),
        )
        .map(async (file) => {
          const path = join(root, file)
          const source = await readFile(path, "utf8")
          const date = source.match(
            /^date:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m,
          )?.[1]

          if (!date) return

          const id = relative(root, path).replace(extname(file), "")
          if (basename(id) !== "index") return

          const slug = id === "index" ? "" : `/${id.slice(0, -"/index".length)}`
          lastmods.set(`/${collection}${slug}/`, new Date(`${date}T00:00:00Z`))
        }),
    )
  }

  return lastmods
}

const articleLastmods = await getArticleLastmods()

export default defineConfig({
  site: "https://ryanbatubara.dev",
  compressHTML: true,
  prefetch: { prefetchAll: true },
  integrations: [
    // Satteri emits trusted HTML for Temml, callout icons, and Expressive Code.
    // Astro's static MDX optimization preserves those subtrees via `set:html`.
    mdx({ processor: contentProcessor(), optimize: true }),
    sitemap({
      filter: (page) =>
        !/\/(blog|resources)\/[^/]+\/[^/]+\/?$/.test(page) &&
        !/\/authors\/[^/]+\/?$/.test(page) &&
        !page.includes("/tags/"),
      serialize: (item) => {
        const lastmod = articleLastmods.get(new URL(item.url).pathname)
        return lastmod ? { ...item, lastmod: lastmod.toISOString() } : item
      },
    }),
  ],
  markdown: {
    syntaxHighlight: false,
    processor: contentProcessor(),
  },
  server: { port: 1234, host: true },
  devToolbar: { enabled: false },
})
