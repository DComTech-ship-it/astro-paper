export function calculateReadingTime(content: string): number {
  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200;
  
  // Remove HTML tags and count words
  const plainText = content.replace(/<[^>]*>/g, '');
  const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
  
  // Calculate reading time
  const readingTime = Math.ceil(words.length / wordsPerMinute);
  
  // Minimum 1 minute
  return Math.max(1, readingTime);
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}
