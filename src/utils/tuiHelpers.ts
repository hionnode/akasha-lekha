import { calculateReadingTime } from './readingTime';

export type ContentType = 'blog' | 'guides' | 'code';

export interface ContentItem {
    type: ContentType;
    slug: string;
    title: string;
    description: string;
    tags: string[];
    date?: string;
    language?: string;
    readingTime?: number;
    featured?: boolean;
    body?: string;
}

export interface TUIData {
    blog: ContentItem[];
    guides: ContentItem[];
    code: ContentItem[];
    allTags: Record<string, number>;
}

export function buildTagIndex(
    blog: any[],
    guides: any[],
    scripts: any[]
): Record<string, number> {
    const tagCounts: Record<string, number> = {};

    [...blog, ...guides, ...scripts].forEach((item) => {
        const tags = item.data.tags || [];
        tags.forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    return tagCounts;
}

export function transformContent(
    items: any[],
    type: ContentType
): ContentItem[] {
    return items
        .map((item) => {
            const readingTime = item.body
                ? calculateReadingTime(item.body)
                : undefined;

            // For guides, only include index files (those with 'parts' property)
            if (type === 'guides' && !('parts' in item.data)) {
                return null;
            }

            // Extract description - guides use 'description', blog uses 'excerpt'
            let description = item.data.description || item.data.excerpt || '';

            // If no description, try to extract first paragraph from body
            if (!description && item.body) {
                const firstPara = item.body
                    .replace(/^#+\s+.*$/m, '') // Remove headers
                    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
                    .trim()
                    .split('\n\n')[0]
                    .substring(0, 200);
                if (firstPara) {
                    description = firstPara + (firstPara.length >= 200 ? '...' : '');
                }
            }

            return {
                type,
                slug: item.slug,
                title: item.data.title,
                description,
                tags: item.data.tags || [],
                date: item.data.date,
                language: type === 'code' ? item.data.language : undefined,
                readingTime,
                featured: item.data.featured,
                body: item.body,
            };
        })
        .filter((item): item is ContentItem => item !== null);
}

export function filterContent(
    data: TUIData,
    contentType: ContentType | 'all',
    activeTags: string[],
    searchQuery: string
): ContentItem[] {
    let items: ContentItem[] = [];

    if (contentType === 'all') {
        items = [...data.blog, ...data.guides, ...data.code];
    } else {
        items = data[contentType];
    }

    // Filter by tags (AND logic - must match all selected tags)
    if (activeTags.length > 0) {
        items = items.filter((item) =>
            activeTags.every((tag) => item.tags.includes(tag))
        );
    }

    // Filter by search query
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        items = items.filter(
            (item) =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
                (item.body && item.body.toLowerCase().includes(query))
        );
    }

    return items;
}

export function getVimKey(key: string): string | null {
    const vimMap: Record<string, string> = {
        h: 'ArrowLeft',
        j: 'ArrowDown',
        k: 'ArrowUp',
        l: 'ArrowRight',
    };
    return vimMap[key.toLowerCase()] || null;
}

export function formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

