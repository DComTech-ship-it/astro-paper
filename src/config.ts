export const SITE = {
  website: "https://simply-you-blog.pages.dev/", // replace this with your deployed domain
  author: "Dxmond Tecku",
  profile: "https://yourprofile.com",
  desc: "A modern blog focused on writing, monetization, and creator tools - built for writers and developers.",
  title: "Simply You Blog",
  ogImage: "simply-you-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/yourusername/simply-you-blog/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/New_York", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
