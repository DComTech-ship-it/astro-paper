/**
 * Get description from blog post content
 * @param content - The blog post content
 * @returns A description string
 */
export function getDescription(content: string): string {
  // Remove markdown syntax and get first paragraph
  const cleanContent = content
    .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*[^*]*\*/g, '') // Remove bold
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // Remove links but keep text
    .replace(/!\[([^\]]+)\]\([^)]*\)/g, '$1') // Remove images but keep alt text
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  // Get first paragraph or first sentence
  const firstParagraph = cleanContent.split('.')[0] || cleanContent;
  
  return firstParagraph.length > 150 
    ? firstParagraph.substring(0, 147) + '...'
    : firstParagraph;
}
