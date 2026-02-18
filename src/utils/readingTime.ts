/**
 * Calculate reading time for blog posts
 * @param content - The blog post content
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200;
  
  // Remove HTML tags and get plain text
  const plainText = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
  
  // Count words
  const words = plainText.split(' ').length;
  
  // Calculate reading time
  const readingTime = Math.ceil(words / wordsPerMinute);
  
  return readingTime;
}
