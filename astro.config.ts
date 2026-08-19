import { satteri } from "@astrojs/markdown-satteri"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import { defineConfig } from "astro/config"
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
    }),
  ],
  markdown: {
    syntaxHighlight: false,
    processor: contentProcessor(),
  },
  server: { port: 1234, host: true },
  devToolbar: { enabled: false },
})
