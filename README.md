# Bigger Minds 🌱

A modern, responsive blog platform focused on personal growth, mindfulness, and creative inspiration. Built with Astro and designed to spark curiosity and nurture meaningful connections.

![Bigger Minds](public/biggerminds-og-optimized.png)

## 🌟 About Bigger Minds

Bigger Minds is your digital sanctuary for exploring ideas that spark curiosity, creativity, and inspiration. We believe in the power of everyday moments to transform our lives and the world around us.

Our mission is to create a space where:
- **Curiosity flourishes** through thoughtful exploration
- **Creativity thrives** in supportive community
- **Inspiration strikes** in the ordinary and extraordinary
- **Growth happens** one mindful moment at a time

## ✨ Features

### 🎨 **Modern Design & Experience**
- **Responsive Design**: Beautiful on all devices, from mobile to desktop
- **Dark/Light Theme**: Eye-friendly themes with smooth transitions
- **Typography**: Optimized reading experience with Roboto fonts
- **Accessibility**: Screen reader friendly and keyboard navigable
- **Performance**: Lightning-fast with Astro's static generation

### 📝 **Content & Blogging**
- **Type-Safe Markdown**: Write with confidence using TypeScript
- **Dynamic OG Images**: Auto-generated social sharing images
- **Tag System**: Organize content with intuitive tagging
- **Search**: Built-in fuzzy search for discovering content
- **Pagination**: Smooth navigation through post collections
- **Draft Posts**: Write and preview before publishing

### 👥 **Community & Engagement**
- **Guest Posts**: Submit stories and insights from the community
- **Author Profiles**: Showcase contributors with social links
- **Social Sharing**: Share content across major platforms
- **Comments**: Engage in meaningful discussions
- **Edit Suggestions**: Community-driven content improvements

### 🔧 **Technical Excellence**
- **SEO Optimized**: Built-in sitemap, RSS feeds, and meta tags
- **Modern Stack**: Astro 5.17.2, TypeScript, TailwindCSS
- **Component Architecture**: Reusable, maintainable code structure
- **Performance Monitoring**: Lighthouse-optimized for speed
- **Security**: Protected forms and safe content handling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/DComTech-ship-it/astro-paper.git
cd astro-paper

# Install dependencies
pnpm install

# Start development
pnpm run dev
```

### Development Commands

```bash
pnpm run dev        # Start development server
pnpm run build      # Build for production
pnpm run preview    # Preview production build
pnpm run format     # Format code with Prettier
pnpm run lint       # Lint code with ESLint
```

## 📁 Project Structure

```
/
├── public/                 # Static assets
│   ├── images/            # Blog images and assets
│   └── biggerminds-*.png # OG images
├── src/
│   ├── assets/
│   │   └── icons/        # SVG icons
│   ├── components/        # Reusable UI components
│   ├── data/
│   │   ├── authors.json   # Author information
│   │   └── blog/         # Blog posts (.md files)
│   ├── layouts/          # Page layouts
│   ├── pages/            # Route pages
│   ├── styles/           # Global styles
│   ├── utils/            # Helper functions
│   └── config.ts         # Site configuration
├── astro.config.ts       # Astro configuration
└── package.json          # Dependencies and scripts
```

## ⚙️ Configuration

### Site Settings
Update `src/config.ts` to customize your site:

```typescript
export const SITE = {
  website: "https://your-domain.com",
  title: "Your Blog Name",
  author: "Your Name",
  desc: "Your blog description",
  ogImage: "/path/to/og-image.png",
  // ... more settings
};
```

### Author Management
Add authors in `src/data/authors.json`:

```json
{
  "author-id": {
    "name": "Author Name",
    "email": "author@example.com",
    "bio": "Author bio",
    "avatar": "/images/authors/avatar.jpg",
    "socialLinks": {
      "website": "https://example.com",
      "twitter": "https://twitter.com/username",
      "linkedin": "https://linkedin.com/in/username"
    }
  }
}
```

### Blog Posts
Create posts in `src/data/blog/` with frontmatter:

```yaml
---
author: Author Name
pubDatetime: 2024-03-15T14:20:34.000Z
title: Your Post Title
slug: your-post-slug
featured: true
draft: false
tags:
  - Tag1
  - Tag2
description: Post description for SEO
---

Your post content here...
```

## 🎨 Customization

### Colors & Themes
Modify colors in `src/styles/global.css`:

```css
:root {
  --background: #fdfdfd;
  --foreground: #282728;
  --accent: #006cac;
  --muted: #e6e6e6;
  --border: #ece9e9;
}
```

### Typography
Customize fonts in `astro.config.ts`:

```typescript
experimental: {
  fonts: [
    {
      name: "Your Font",
      provider: fontProviders.google(),
      // ... font settings
    }
  ]
}
```

## 📤 Guest Post Submissions

Community members can submit guest posts through the `/submit` page. Submissions are processed via:

- **Email notifications** to site administrators
- **Confirmation emails** to submitters
- **File uploads** for avatars and attachments
- **Content validation** and sanitization

## 🔍 SEO & Performance

### Built-in SEO Features
- **Dynamic OG Images**: Auto-generated for each post
- **Sitemap**: Automatically generated for search engines
- **RSS Feed**: For blog aggregators and readers
- **Meta Tags**: Optimized for social sharing
- **Structured Data**: Rich snippets for search results

### Performance Optimizations
- **Static Generation**: Pre-built pages for instant loading
- **Image Optimization**: Responsive images with lazy loading
- **Minimal JavaScript**: Only essential interactions
- **CDN Ready**: Optimized for content delivery networks

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Other Platforms
- **Netlify**: Drag and drop build output
- **Cloudflare Pages**: Git-based deployment
- **GitHub Pages**: Static hosting

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Content Contributions
1. **Submit Guest Posts**: Use the `/submit` form
2. **Suggest Edits**: Use the "Edit page" link on posts
3. **Share Ideas**: Engage with our community

### Technical Contributions
1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Astro**: For the amazing framework
- **TailwindCSS**: For the utility-first CSS framework
- **Sat Naing**: For the original AstroPaper theme
- **Our Contributors**: For making Bigger Minds possible

## 📞 Connect

- **Website**: [biggerminds.com](https://miawoezo.com)
- **Email**: admin@miawoezo.com
- **Social**: Follow us on [Twitter](https://twitter.com/dxmond) and [LinkedIn](https://linkedin.com/in/dxmond)

---

*Built with ❤️ for curious minds and creative souls*
