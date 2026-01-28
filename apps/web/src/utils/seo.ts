/**
 * SEO utility functions
 */

export interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  author?: string;
}

export function generateSEO(props: SEOProps) {
  const {
    title,
    description,
    image = '/og-image.jpg',
    type = 'website',
    publishedTime,
    modifiedTime,
    tags = [],
    author = 'works-on-my.cloud',
  } = props;

  const siteName = 'works-on-my.cloud';
  const siteUrl = 'https://works-on-my.cloud';
  const fullTitle = `${title} | ${siteName}`;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const authorName = `${author}`;
  return {
    title: fullTitle,
    description: description || '',
    author: authorName,
    openGraph: {
      title: fullTitle,
      description: description || '',
      url: siteUrl,
      siteName,
      images: [{ url: fullImage }],
      locale: 'en_US',
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description || '',
      images: [fullImage],
      creator: '@worksonmycloud', // Update with actual handle
    },
  };
}
