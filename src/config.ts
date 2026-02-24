export const SITE = {
  website: "https://astro-paper-bice-pi.vercel.app/", // replace this with your deployed domain
  author: "Dxmond Tecku",
  profile: "https://yourprofile.com",
  desc: "Bigger Minds is your go-to space for everything that sparks curiosity, creativity, and inspiration. From lifestyle and personal stories to tips, ideas, and everyday musings, we explore it all with a fresh perspective and a focus on what makes life uniquely yours.",
  title: "Bigger Minds",
  ogImage: "https://astro-paper-bice-pi.vercel.app/biggerminds-og.png",
  keywords: "bigger minds, curiosity, creativity, inspiration, lifestyle, personal growth, wellness, mindfulness, happiness, self-improvement, everyday life, personal development",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/DComTech-ship-it/astro-paper/edit/main/",
  },
  authorProfiles: {
    enabled: true,
    showOnPosts: true,
    defaultAvatar: "/images/authors/favicon-32x32.png",
    socialLinks: {
      showOnProfiles: true,
      showOnPosts: true
    }
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/New_York", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
