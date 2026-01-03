/**
 * Utility functions for tag-based navigation and organization
 */

export interface TagInfo {
  tag: string;
  count: number;
  posts: Array<{
    slug: string;
    title: string;
    date: string;
    excerpt: string;
  }>;
}

export interface TagNavigationData {
  allTags: TagInfo[];
  sortedByFrequency: TagInfo[];
  sortedAlphabetically: TagInfo[];
}

/**
 * Extract all unique tags from blog posts with counts and associated posts
 */
export function extractTagsWithCounts(
  posts: Array<{
    slug: string;
    data: {
      title: string;
      tags: string[];
      date: string;
      excerpt: string;
    };
  }>
): TagNavigationData {
  const tagMap = new Map<string, TagInfo>();

  // Build tag map with post information
  posts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      const existing = tagMap.get(tag);
      const postInfo = {
        slug: post.slug,
        title: post.data.title,
        date: post.data.date,
        excerpt: post.data.excerpt,
      };

      if (existing) {
        existing.count++;
        existing.posts.push(postInfo);
      } else {
        tagMap.set(tag, {
          tag,
          count: 1,
          posts: [postInfo],
        });
      }
    });
  });

  const allTags = Array.from(tagMap.values());

  // Sort posts within each tag by date (newest first)
  allTags.forEach((tagInfo) => {
    tagInfo.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  return {
    allTags,
    sortedByFrequency: [...allTags].sort((a, b) => b.count - a.count),
    sortedAlphabetically: [...allTags].sort((a, b) => a.tag.localeCompare(b.tag)),
  };
}

/**
 * Get tags for a specific post
 */
export function getPostTags(
  posts: Array<{
    slug: string;
    data: {
      tags: string[];
    };
  }>,
  currentSlug: string
): string[] {
  const post = posts.find((p) => p.slug === currentSlug);
  return post?.data.tags || [];
}

/**
 * Get related posts by shared tags
 */
export function getRelatedPostsByTags(
  posts: Array<{
    slug: string;
    data: {
      title: string;
      tags: string[];
      date: string;
      excerpt: string;
      draft?: boolean;
      series?: string;
    };
  }>,
  currentSlug: string,
  currentTags: string[],
  limit: number = 5
): Array<{
  slug: string;
  title: string;
  tags: string[];
  date: string;
  excerpt: string;
  sharedTagCount: number;
}> {
  return posts
    .filter((p) => p.slug !== currentSlug && !p.data.draft)
    .map((p) => {
      const sharedTags = p.data.tags.filter((tag) => currentTags.includes(tag));
      return {
        slug: p.slug,
        title: p.data.title,
        tags: p.data.tags,
        date: p.data.date,
        excerpt: p.data.excerpt,
        sharedTagCount: sharedTags.length,
      };
    })
    .filter((item) => item.sharedTagCount > 0)
    .sort((a, b) => b.sharedTagCount - a.sharedTagCount)
    .slice(0, limit);
}

/**
 * Filter posts by selected tag
 */
export function filterPostsByTag(
  posts: Array<{
    slug: string;
    data: {
      tags: string[];
      draft?: boolean;
    };
  }>,
  selectedTag: string | null
): typeof posts {
  if (!selectedTag) return posts;

  return posts.filter((post) => !post.data.draft && post.data.tags.includes(selectedTag));
}
