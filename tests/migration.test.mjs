import assert from "node:assert/strict"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { extname, join, relative, resolve } from "node:path"
import test from "node:test"

const root = resolve(import.meta.dirname, "..")
const dist = join(root, "dist")

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })

const files = walk(dist)
const htmlFiles = files.filter((file) => extname(file) === ".html")

const routeFor = (file) => {
  const path = `/${relative(dist, file).replaceAll("\\", "/")}`
  return path.endsWith("/index.html")
    ? path.slice(0, -"index.html".length)
    : path === "/index.html"
      ? "/"
      : path
}

const outputForPath = (pathname) => {
  const clean = decodeURIComponent(pathname).replace(/^\/+/, "")
  if (!clean) return join(dist, "index.html")
  const direct = join(dist, clean)
  if (existsSync(direct)) return direct
  if (extname(clean)) return direct
  if (existsSync(`${direct}.html`)) return `${direct}.html`
  return join(direct, "index.html")
}

test("all preserved public routes are generated", () => {
  const expected = [
    "/",
    "/404.html",
    "/authors/",
    "/authors/ryan-batubara/",
    "/blog/",
    "/blog/functional-python/",
    "/blog/logic-grids-as-data-structures/",
    "/blog/power-of-notation/",
    "/blog/webdev_misadventures/",
    "/blog/webdev_misadventures/components/",
    "/blog/webdev_misadventures/styling-and-typography/",
    "/blog/webdev_misadventures/the-technicals/",
    "/projects/",
    "/resources/",
    "/resources/puzzle-reading/",
    "/resources/zx-reading/",
    "/tags/",
    "/talks/",
  ]
  const actual = new Set(htmlFiles.map(routeFor))
  for (const route of expected) assert.ok(actual.has(route), `missing ${route}`)
  for (const file of ["robots.txt", "rss.xml", "sitemap-index.xml"])
    assert.ok(existsSync(join(dist, file)), `missing /${file}`)
})

test("rendered pages have no broken internal links or assets", () => {
  const failures = []
  const attributePattern = /\b(?:href|src)=["']([^"']+)["']/g
  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8")
    const pageUrl = new URL(routeFor(file), "https://ryanbatubara.dev")
    for (const [, value] of html.matchAll(attributePattern)) {
      if (/^(?:https?:|mailto:|tel:|data:|javascript:)/.test(value)) continue
      const url = new URL(value, pageUrl)
      if (url.origin !== pageUrl.origin) continue
      const output = outputForPath(url.pathname)
      if (!existsSync(output)) failures.push(`${routeFor(file)} -> ${value}`)
      if (url.hash && existsSync(output) && extname(output) === ".html") {
        const target = readFileSync(output, "utf8")
        const id = decodeURIComponent(url.hash.slice(1))
        if (!target.includes(`id="${id}"`))
          failures.push(`${routeFor(file)} -> missing anchor ${value}`)
      }
    }
  }
  assert.deepEqual(failures, [])
})

test("v2 layout and Satteri output survive MDX rendering", () => {
  const post = readFileSync(
    join(dist, "blog/logic-grids-as-data-structures/index.html"),
    "utf8",
  )
  assert.match(post, /<page-nav/)
  assert.match(post, /<page-toc/)
  assert.match(post, /<details data-callout="puzzle"/)
  assert.match(post, /<summary><svg/)
  assert.match(post, /<math(?: |>|-display>)/)
  assert.match(post, /<logic-grid/)
  assert.match(post, /data-favicon-icon="simple-wikipedia\.svg"/)
  assert.match(post, /data-favicon-icon="custom-external-link\.svg"/)
  assert.doesNotMatch(post, /&lt;math(?: |&gt;)/)
  assert.doesNotMatch(post, /<summary>&lt;svg/)

  const webdev = readFileSync(
    join(dist, "blog/webdev_misadventures/index.html"),
    "utf8",
  )
  assert.match(webdev, /data-favicon-icon="custom-erudite\.svg"/)
  assert.match(webdev, /data-favicon-icon="custom-enscribe\.svg"/)
})

test("follow-up visual behavior remains wired into source and output", () => {
  const home = readFileSync(join(dist, "index.html"), "utf8")
  const blog = readFileSync(join(root, "src/pages/blog/[...id].astro"), "utf8")
  const resources = readFileSync(
    join(root, "src/pages/resources/[...id].astro"),
    "utf8",
  )
  const layout = readFileSync(join(root, "src/layouts/Layout.astro"), "utf8")
  const colors = readFileSync(join(root, "src/styles/color.css"), "utf8")
  const logicGrid = readFileSync(
    join(root, "src/components/LogicGrid.astro"),
    "utf8",
  )
  const colorSwatches = readFileSync(
    join(root, "src/components/ColorSwatches.astro"),
    "utf8",
  )

  assert.match(home, /class="document-link"[^>]*>CV<\/a>/)
  assert.match(home, /class="document-link"[^>]*>Resume<\/a>/)
  assert.match(
    home,
    /href="https:\/\/scholar\.google\.com\/citations\?user=CeLsaNIAAAAJ&amp;hl=en&amp;oi=ao"/,
  )
  assert.doesNotMatch(home, /data-favicon=/)
  assert.match(blog, /post-banner[\s\S]*background-color: var\(--accent\)/)
  assert.match(resources, /post-banner[\s\S]*background-color: var\(--accent\)/)
  assert.match(layout, /--grid-max-width/)
  assert.match(layout, /grid-column: 10 \/ 13/)
  assert.match(colors, /--ground-dark:\s+oklch\(0\.12 0 130\)/)
  assert.match(colors, /--ground-light:\s+oklch\(0\.9941 0\.01 130\)/)
  assert.match(colors, /--accent: var\(--site-accent\)/)
  assert.match(colors, /--site-code-background:/)
  assert.match(logicGrid, /width: var\(--logic-cell\)/)
  assert.match(logicGrid, /height: var\(--logic-cell\)/)
  assert.match(colorSwatches, /background-color: var\(--swatch-background\)/)
})

test("the removed v1 stack is absent from production dependencies", () => {
  const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
  const packages = { ...manifest.dependencies, ...manifest.devDependencies }
  for (const dependency of [
    "tailwindcss",
    "@tailwindcss/vite",
    "react",
    "react-dom",
    "@astrojs/react",
    "rehype-katex",
    "remark-math",
    "patch-package",
    "radix-ui",
  ]) {
    assert.equal(packages[dependency], undefined, dependency)
  }
  assert.equal(manifest.dependencies.temml, "0.13.3")
  assert.equal(manifest.dependencies.satteri, "0.9.5")
})
