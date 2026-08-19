import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { ElementContent } from "hast"
import type {} from "mdast-util-to-hast"
import { toHtml } from "hast-util-to-html"
import { h } from "hastscript"
import GithubSlugger from "github-slugger"
import { defineMdastPlugin } from "satteri"
import { CALLOUTS } from "./callout-config"

const ICONS_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "../assets/icons/callouts",
)

const loadIcon = (name: string) =>
  readFileSync(join(ICONS_DIR, `${name}.svg`), "utf8")
    .replace("<svg", '<svg aria-hidden="true"')
    .replace(/\s+/g, " ")
    .trim()

const icons: Record<string, string> = {}
for (const name of [
  ...new Set(Object.values(CALLOUTS).map(({ icon }) => icon)),
  "alt-arrow-down",
]) {
  icons[name] = loadIcon(name)
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const raw = (value: string): ElementContent =>
  ({ type: "raw", value }) as unknown as ElementContent

export function calloutDirective() {
  const slugger = new GithubSlugger()
  return defineMdastPlugin({
    name: "callout-directive",
    containerDirective(node, ctx) {
      const config = CALLOUTS[node.name as keyof typeof CALLOUTS]
      if (!config) return

      const first = node.children?.[0]
      const isLabel =
        first?.type === "paragraph" &&
        (first.data as { directiveLabel?: boolean })?.directiveLabel === true

      const title = capitalize(node.name)
      const label = isLabel && first ? ctx.textContent(first) : ""
      const icon = icons[config.icon]
      const chevron = icons["alt-arrow-down"]

      if (isLabel) {
        ctx.setProperty(first, "data", { hName: "summary" })
        ctx.prependChild(first, {
          type: "html",
          value: `${icon}<span>${title}<span> (`,
        })
        ctx.appendChild(first, {
          type: "html",
          value: `)</span></span>${chevron}`,
        })
      } else {
        const summary = toHtml(
          h("summary", [raw(icon), h("span", title), raw(chevron)]),
          { allowDangerousHtml: true },
        )
        ctx.prependChild(node, { type: "html", value: summary })
      }

      const attributes = (node.attributes ?? {}) as Record<string, unknown>
      const closed = "closed" in attributes
      const explicitId = typeof attributes.id === "string" ? attributes.id : ""
      const id = explicitId || (label ? slugger.slug(label) : undefined)

      ctx.setProperty(node, "data", {
        hName: "details",
        hProperties: {
          dataCallout: node.name,
          open: !closed,
          id,
        },
      })
    },
  })
}
