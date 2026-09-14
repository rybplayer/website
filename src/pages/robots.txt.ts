import type { APIRoute } from "astro"

const robotsTxt = `
User-agent: *
Allow: /

Sitemap: https://ryanbatubara.dev/sitemap-index.xml
`

export const GET: APIRoute = () => new Response(robotsTxt)
