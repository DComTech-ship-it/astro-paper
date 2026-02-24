import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /search

# Allow search engines to crawl CSS and JS files
Allow: *.css
Allow: *.js
Allow: *.svg
Allow: *.png
Allow: *.jpg
Allow: *.jpeg
Allow: *.gif
Allow: *.webp

# Sitemap location
Sitemap: ${sitemapURL.href}

# Crawl delay (optional, be respectful)
Crawl-delay: 1
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL));
};
