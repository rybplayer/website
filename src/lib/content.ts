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

const PROSE_WORDS_PER_MINUTE = 265
const CODE_SECONDS_PER_LINE = 1
const MAX_CODE_SECONDS_PER_BLOCK = 30

const readingSeconds = (body: string | undefined) => {
  let codeSeconds = 0
  const prose = (body ?? "")
    .replace(
      /^ {0,3}(`{3,}|~{3,})[^\n]*\n([\s\S]*?)^ {0,3}\1[ \t]*$/gm,
      (_, _fence: string, code: string) => {
        const lines = code.split("\n").filter((line) => line.trim()).length
        codeSeconds += Math.min(
          MAX_CODE_SECONDS_PER_BLOCK,
          lines * CODE_SECONDS_PER_LINE,
        )
        return " "
      },
    )
    .replace(/^import\s.+$/gm, " ")
    .replace(/<([A-Z][\w.]*)\b[\s\S]*?\/>/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\$\$[\s\S]*?\$\$/g, " equation ")
    .replace(/\$[^\n$]+\$/g, " equation ")
    .replace(/(`+)[\s\S]*?\1/g, " code ")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\{[^{}]*\}/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
  const proseWords =
    prose.match(/[\p{L}\p{N}]+(?:[’'\-.][\p{L}\p{N}]+)*/gu)?.length ?? 0
  return (proseWords / PROSE_WORDS_PER_MINUTE) * 60 + codeSeconds
}

export const readingTime = (
  entries: { body?: string } | { body?: string }[],
) => {
  const seconds = (Array.isArray(entries) ? entries : [entries]).reduce(
    (sum, entry) => sum + readingSeconds(entry.body),
    0,
  )
  return `${Math.max(1, Math.ceil(seconds / 60))} min read`
}
