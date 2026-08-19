import { SITE } from "@/consts"
import { isSubpost } from "@/lib/utils"
import { getCollection, type CollectionEntry } from "astro:content"

export type ArticleCollection = "blog" | "resources"

export const pageTitle = (title: string) => `${title} | ${SITE.title}`

export async function getArticles<C extends ArticleCollection>(
  collection: C,
): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(collection, ({ data }) => !data.draft)
  return entries
    .filter((entry) => !isSubpost(entry.id))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export const getPosts = () => getArticles("blog")
export const getResources = () => getArticles("resources")

export async function getSeries<C extends ArticleCollection>(
  collection: C,
): Promise<Map<string, CollectionEntry<C>[]>> {
  const entries = await getCollection(
    collection,
    ({ id, data }) => !data.draft && id.split("/").length === 2,
  )
  entries.sort(
    (a, b) =>
      (a.data.order ?? Number.POSITIVE_INFINITY) -
        (b.data.order ?? Number.POSITIVE_INFINITY) ||
      a.data.date.getTime() - b.data.date.getTime() ||
      a.id.localeCompare(b.id),
  )
  return Map.groupBy(entries, (entry) => entry.id.split("/")[0] ?? entry.id)
}

export const getSubposts = () => getSeries("blog")

export async function getTags(): Promise<
  Map<string, CollectionEntry<"blog">[]>
> {
  const posts = await getPosts()
  const series = await getSeries("blog")
  const tags = new Map<string, CollectionEntry<"blog">[]>()
  for (const post of posts) {
    const chain = [post, ...(series.get(post.id) ?? [])]
    for (const tag of new Set(
      chain.flatMap((entry) => entry.data.tags ?? []),
    )) {
      const tagged = tags.get(tag)
      if (tagged) tagged.push(post)
      else tags.set(tag, [post])
    }
  }
  return new Map(
    [...tags].sort(
      ([a, postsA], [b, postsB]) =>
        postsB.length - postsA.length || a.localeCompare(b),
    ),
  )
}

export async function getProjects() {
  const projects = await getCollection("projects")
  return projects.sort(
    (a, b) =>
      (a.data.order ?? Number.POSITIVE_INFINITY) -
        (b.data.order ?? Number.POSITIVE_INFINITY) ||
      (b.data.startDate?.getTime() ?? 0) - (a.data.startDate?.getTime() ?? 0),
  )
}

const words = (body: string | undefined) =>
  (body ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/[`*_#$>{}[\]()+|\\-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

export const readingTime = (
  entries: { body?: string } | { body?: string }[],
) => {
  const count = (Array.isArray(entries) ? entries : [entries]).reduce(
    (sum, entry) => sum + words(entry.body),
    0,
  )
  return `${Math.max(1, Math.ceil(count / 200))} min read`
}
