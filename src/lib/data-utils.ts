import { getCollection, render, type CollectionEntry } from 'astro:content'
import { readingTime, calculateWordCountFromHtml } from '@/lib/utils'

export type ContentCollection = 'blog' | 'resources'

async function getAllEntries<T extends ContentCollection>(
  collection: T,
  includeSubposts: boolean,
): Promise<CollectionEntry<T>[]> {
  const posts = await getCollection(collection)
  return posts
    .filter(
      (post) => !post.data.draft && (includeSubposts || !isSubpost(post.id)),
    )
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export async function getAllPosts<T extends ContentCollection = 'blog'>(
  collection: T = 'blog' as T,
): Promise<CollectionEntry<T>[]> {
  return getAllEntries(collection, false)
}

export async function getAllPostsAndSubposts<
  T extends ContentCollection = 'blog',
>(collection: T = 'blog' as T): Promise<CollectionEntry<T>[]> {
  return getAllEntries(collection, true)
}

export async function getAllProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects')
  return projects.sort((a, b) => {
    const dateA = a.data.startDate?.getTime() || 0
    const dateB = b.data.startDate?.getTime() || 0
    return dateB - dateA
  })
}

export async function getAllResources(): Promise<
  CollectionEntry<'resources'>[]
> {
  return getAllPosts('resources')
}

export async function getAllResourcesAndSubposts(): Promise<
  CollectionEntry<'resources'>[]
> {
  return getAllPostsAndSubposts('resources')
}

export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getAllPosts()
  return posts.reduce((acc, post) => {
    post.data.tags?.forEach((tag) => {
      acc.set(tag, (acc.get(tag) || 0) + 1)
    })
    return acc
  }, new Map<string, number>())
}

export async function getAdjacentPosts<T extends ContentCollection = 'blog'>(
  currentId: string,
  collection: T = 'blog' as T,
): Promise<{
  newer: CollectionEntry<T> | null
  older: CollectionEntry<T> | null
  parent: CollectionEntry<T> | null
}> {
  const parentPosts = await getAllPosts(collection)

  if (isSubpost(currentId)) {
    const parentId = getParentId(currentId)
    const parent = parentPosts.find((post) => post.id === parentId) || null

    const posts = await getCollection(collection)
    const subposts = posts
      .filter(
        (post) =>
          isSubpost(post.id) &&
          getParentId(post.id) === parentId &&
          !post.data.draft,
      )
      .sort((a, b) => {
        const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
        if (dateDiff !== 0) return dateDiff

        const orderA = a.data.order ?? 0
        const orderB = b.data.order ?? 0
        return orderA - orderB
      })

    const currentIndex = subposts.findIndex((post) => post.id === currentId)
    if (currentIndex === -1) {
      return { newer: null, older: null, parent }
    }

    return {
      newer:
        currentIndex < subposts.length - 1
          ? subposts[currentIndex + 1] ?? null
          : null,
      older: currentIndex > 0 ? subposts[currentIndex - 1] ?? null : null,
      parent,
    }
  }

  const currentIndex = parentPosts.findIndex((post) => post.id === currentId)

  if (currentIndex === -1) {
    return { newer: null, older: null, parent: null }
  }

  return {
    newer: currentIndex > 0 ? parentPosts[currentIndex - 1] ?? null : null,
    older:
      currentIndex < parentPosts.length - 1
        ? parentPosts[currentIndex + 1] ?? null
        : null,
    parent: null,
  }
}

export async function getPostsByAuthor(
  authorId: string,
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.data.authors?.includes(authorId))
}

export async function getPostsByTag(
  tag: string,
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.data.tags?.includes(tag))
}

export async function getRecentPosts(
  count: number,
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getAllPosts()
  return posts.slice(0, count)
}

export async function getRecentProjects(
  count: number,
): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getAllProjects()
  return projects.slice(0, count)
}

export async function getSortedTags(): Promise<
  { tag: string; count: number }[]
> {
  const tagCounts = await getAllTags()
  return [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      const countDiff = b.count - a.count
      return countDiff !== 0 ? countDiff : a.tag.localeCompare(b.tag)
    })
}

export function getParentId(subpostId: string): string {
  return subpostId.split('/')[0]!
}

export async function getSubpostsForParent<
  T extends ContentCollection = 'blog',
>(parentId: string, collection: T = 'blog' as T): Promise<CollectionEntry<T>[]> {
  const posts = await getCollection(collection)
  return posts
    .filter(
      (post) =>
        !post.data.draft &&
        isSubpost(post.id) &&
        getParentId(post.id) === parentId,
    )
    .sort((a, b) => {
      const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
      if (dateDiff !== 0) return dateDiff

      const orderA = a.data.order ?? 0
      const orderB = b.data.order ?? 0
      return orderA - orderB
    })
}

export function groupPostsByYear(
  posts: CollectionEntry<'blog'>[],
): Record<string, CollectionEntry<'blog'>[]> {
  return posts.reduce(
    (acc: Record<string, CollectionEntry<'blog'>[]>, post) => {
      const year = post.data.date.getFullYear().toString()
      ;(acc[year] ??= []).push(post)
      return acc
    },
    {},
  )
}

export async function hasSubposts(
  postId: string,
  collection: ContentCollection = 'blog',
): Promise<boolean> {
  const subposts = await getSubpostsForParent(postId, collection)
  return subposts.length > 0
}

export function isSubpost(postId: string): boolean {
  return postId.includes('/')
}

export async function getParentPost<T extends ContentCollection = 'blog'>(
  subpostId: string,
  collection: T = 'blog' as T,
): Promise<CollectionEntry<T> | null> {
  if (!isSubpost(subpostId)) {
    return null
  }

  const parentId = getParentId(subpostId)
  const allPosts = await getAllPosts(collection)
  return allPosts.find((post) => post.id === parentId) || null
}

export function parseAuthors(authorIds: string[] = []) {
  if (!authorIds.length) return []

  return authorIds.map((name) => ({
    id: name,
    name: name,
    isRegistered: false,
  }))
}

export async function getPostById<T extends ContentCollection = 'blog'>(
  postId: string,
  collection: T = 'blog' as T,
): Promise<CollectionEntry<T> | null> {
  const allPosts = await getAllPostsAndSubposts(collection)
  return allPosts.find((post) => post.id === postId) || null
}

export async function getSubpostCount(
  parentId: string,
  collection: ContentCollection = 'blog',
): Promise<number> {
  const subposts = await getSubpostsForParent(parentId, collection)
  return subposts.length
}

export async function getCombinedReadingTime(
  postId: string,
  collection: ContentCollection = 'blog',
): Promise<string> {
  const post = await getPostById(postId, collection)
  if (!post) return readingTime(0)

  let totalWords = calculateWordCountFromHtml(post.body)

  if (!isSubpost(postId)) {
    const subposts = await getSubpostsForParent(postId, collection)
    for (const subpost of subposts) {
      totalWords += calculateWordCountFromHtml(subpost.body)
    }
  }

  return readingTime(totalWords)
}

export async function getPostReadingTime(
  postId: string,
  collection: ContentCollection = 'blog',
): Promise<string> {
  const post = await getPostById(postId, collection)
  if (!post) return readingTime(0)

  const wordCount = calculateWordCountFromHtml(post.body)
  return readingTime(wordCount)
}

export type TOCHeading = {
  slug: string
  text: string
  depth: number
  isSubpostTitle?: boolean
}

export type TOCSection = {
  type: 'parent' | 'subpost'
  title: string
  headings: TOCHeading[]
  subpostId?: string
  icon?: string
}

export async function getTOCSections(
  postId: string,
  collection: ContentCollection = 'blog',
): Promise<TOCSection[]> {
  const post = await getPostById(postId, collection)
  if (!post) return []

  const parentId = isSubpost(postId) ? getParentId(postId) : postId
  const parentPost = isSubpost(postId)
    ? await getPostById(parentId, collection)
    : post

  if (!parentPost) return []

  const sections: TOCSection[] = []

  const { headings: parentHeadings } = await render(parentPost)
  if (parentHeadings.length > 0) {
    sections.push({
      type: 'parent',
      title: 'Overview',
      headings: parentHeadings.map((heading) => ({
        slug: heading.slug,
        text: heading.text,
        depth: heading.depth,
      })),
    })
  }

  const subposts = await getSubpostsForParent(parentId, collection)
  for (const subpost of subposts) {
    const { headings: subpostHeadings } = await render(subpost)
    if (subpostHeadings.length > 0) {
      sections.push({
        type: 'subpost',
        title: subpost.data.title,
        headings: subpostHeadings.map((heading, index) => ({
          slug: heading.slug,
          text: heading.text,
          depth: heading.depth,
          isSubpostTitle: index === 0,
        })),
        subpostId: subpost.id,
        ...(subpost.data.icon ? { icon: subpost.data.icon } : {}),
      })
    }
  }

  return sections
}
