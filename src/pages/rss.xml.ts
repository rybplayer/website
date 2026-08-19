import { SITE } from "@/consts"
import { getPosts } from "@/lib/content"
import rss from "@astrojs/rss"
import type { APIContext } from "astro"

export async function GET(context: APIContext) {
  try {
    const posts = await getPosts()

    return rss({
      title: SITE.title,
      description: SITE.description,
      site: context.site ?? new URL("https://ryanbatubara.dev"),
      items: posts.map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/blog/${post.id}/`,
      })),
    })
  } catch (error) {
    console.error("Error generating RSS feed:", error)
    return new Response("Error generating RSS feed", { status: 500 })
  }
}
