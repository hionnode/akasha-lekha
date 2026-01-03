/**
 * Calculate reading time for content
 * Average reading speed: 200-250 words per minute
 * Code blocks count as ~50% of word count
 */
export function calculateReadingTime(content: string): number {
  // Count words in regular text
  const textWords = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Count code blocks (count as ~50% of word count)
  const codeBlockMatches = content.match(/```[\s\S]*?```/g) || [];
  const codeWords = codeBlockMatches
    .join(' ')
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Total words (code counts as 50%)
  const totalWords = textWords + Math.floor(codeWords * 0.5);

  // Reading time in minutes (using 225 words per minute average)
  const readingTime = Math.ceil(totalWords / 225);

  // Minimum 1 minute
  return Math.max(1, readingTime);
}
