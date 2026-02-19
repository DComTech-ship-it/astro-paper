import { join } from 'path';

// Simple file-based database for development
// In production, replace with a proper database like PostgreSQL or MySQL
const dataDir = join(process.cwd(), 'data');
const postsFile = join(dataDir, 'posts.json');
const authorsFile = join(dataDir, 'authors.json');
const submissionsFile = join(dataDir, 'submissions.json');
const mediaFile = join(dataDir, 'media.json');
const settingsFile = join(dataDir, 'settings.json');

import { promises as fs } from 'fs';

// Initialize data directory and files
async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

// Helper functions for file operations
async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return defaultValue;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Post functions
export async function getPosts(filters: {
  status?: string;
  author?: string;
  search?: string;
  dateRange?: string;
  limit?: number;
  offset?: number;
} = {}) {
  await ensureDataDir();
  const posts = await readJsonFile(postsFile, []);

  let filteredPosts = [...posts];

  // Apply filters
  if (filters.status) {
    filteredPosts = filteredPosts.filter(post => post.status === filters.status);
  }

  if (filters.author) {
    filteredPosts = filteredPosts.filter(post => post.author === filters.author);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower)
    );
  }

  if (filters.dateRange) {
    const now = new Date();
    let filterDate: Date;

    switch (filters.dateRange) {
      case 'today':
        filterDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        filterDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        filterDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        filterDate = new Date(0);
    }

    filteredPosts = filteredPosts.filter(post => 
      new Date(post.publishDate) >= filterDate
    );
  }

  // Sort by creation date (newest first)
  filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Apply pagination
  const total = filteredPosts.length;
  if (filters.offset) {
    filteredPosts = filteredPosts.slice(filters.offset);
  }
  if (filters.limit) {
    filteredPosts = filteredPosts.slice(0, filters.limit);
  }

  return {
    posts: filteredPosts,
    total
  };
}

export async function createPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  status: string;
  publishDate: string;
  author: string;
  featured: boolean;
}) {
  await ensureDataDir();
  const posts = await readJsonFile(postsFile, []);
  
  const newPost = {
    id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    ...data,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  posts.push(newPost);
  await writeJsonFile(postsFile, posts);

  return newPost;
}

export async function updatePost(id: number, data: Partial<{
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  status: string;
  publishDate: string;
  author: string;
  featured: boolean;
}>) {
  await ensureDataDir();
  const posts = await readJsonFile(postsFile, []);
  
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) return null;

  posts[postIndex] = {
    ...posts[postIndex],
    ...data,
    updatedAt: new Date().toISOString()
  };

  await writeJsonFile(postsFile, posts);
  return posts[postIndex];
}

export async function deletePost(id: number) {
  await ensureDataDir();
  const posts = await readJsonFile(postsFile, []);
  
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) return false;

  posts.splice(postIndex, 1);
  await writeJsonFile(postsFile, posts);
  return true;
}

export async function getPostById(id: number) {
  await ensureDataDir();
  const posts = await readJsonFile(postsFile, []);
  return posts.find(p => p.id === id) || null;
}

// Author functions
export async function getAuthors(filters: {
  status?: string;
  role?: string;
  search?: string;
} = {}) {
  await ensureDataDir();
  const authors = await readJsonFile(authorsFile, []);

  let filteredAuthors = [...authors];

  if (filters.status) {
    filteredAuthors = filteredAuthors.filter(author => author.status === filters.status);
  }

  if (filters.role) {
    filteredAuthors = filteredAuthors.filter(author => author.role === filters.role);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredAuthors = filteredAuthors.filter(author => 
      author.name.toLowerCase().includes(searchLower) ||
      author.email.toLowerCase().includes(searchLower) ||
      author.bio.toLowerCase().includes(searchLower)
    );
  }

  return {
    authors: filteredAuthors,
    total: filteredAuthors.length
  };
}

export async function createAuthor(data: {
  name: string;
  email: string;
  role: string;
  bio: string;
  avatar: string;
  socialLinks: Record<string, string>;
  status: string;
}) {
  await ensureDataDir();
  const authors = await readJsonFile(authorsFile, []);
  
  const newAuthor = {
    id: authors.length > 0 ? Math.max(...authors.map(a => a.id)) + 1 : 1,
    ...data,
    postCount: 0,
    joinDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  authors.push(newAuthor);
  await writeJsonFile(authorsFile, authors);

  return newAuthor;
}

export async function getAuthorById(id: number) {
  await ensureDataDir();
  const authors = await readJsonFile(authorsFile, []);
  return authors.find(a => a.id === id) || null;
}

// Submission functions
export async function getSubmissions(filters: {
  status?: string;
  category?: string;
  search?: string;
} = {}) {
  await ensureDataDir();
  const submissions = await readJsonFile(submissionsFile, []);

  let filteredSubmissions = [...submissions];

  if (filters.status) {
    filteredSubmissions = filteredSubmissions.filter(sub => sub.status === filters.status);
  }

  if (filters.category) {
    filteredSubmissions = filteredSubmissions.filter(sub => sub.category === filters.category);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredSubmissions = filteredSubmissions.filter(sub => 
      sub.title.toLowerCase().includes(searchLower) ||
      sub.content.toLowerCase().includes(searchLower) ||
      sub.authorName.toLowerCase().includes(searchLower) ||
      sub.authorEmail.toLowerCase().includes(searchLower)
    );
  }

  // Sort by creation date (newest first)
  filteredSubmissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    submissions: filteredSubmissions,
    total: filteredSubmissions.length
  };
}

export async function createSubmission(data: {
  title: string;
  content: string;
  excerpt: string;
  authorName: string;
  authorEmail: string;
  authorBio: string;
  socialLinks: Record<string, string>;
  category: string;
  status: string;
  attachments: string[];
}) {
  await ensureDataDir();
  const submissions = await readJsonFile(submissionsFile, []);
  
  const newSubmission = {
    id: submissions.length > 0 ? Math.max(...submissions.map(s => s.id)) + 1 : 1,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  submissions.push(newSubmission);
  await writeJsonFile(submissionsFile, submissions);

  return newSubmission;
}

export async function updateSubmission(id: number, data: Partial<{
  title: string;
  content: string;
  excerpt: string;
  authorName: string;
  authorEmail: string;
  authorBio: string;
  socialLinks: Record<string, string>;
  category: string;
  status: string;
  attachments: string[];
}>) {
  await ensureDataDir();
  const submissions = await readJsonFile(submissionsFile, []);
  
  const submissionIndex = submissions.findIndex(s => s.id === id);
  if (submissionIndex === -1) return null;

  submissions[submissionIndex] = {
    ...submissions[submissionIndex],
    ...data,
    updatedAt: new Date().toISOString()
  };

  await writeJsonFile(submissionsFile, submissions);
  return submissions[submissionIndex];
}

export async function deleteSubmission(id: number) {
  await ensureDataDir();
  const submissions = await readJsonFile(submissionsFile, []);
  
  const submissionIndex = submissions.findIndex(s => s.id === id);
  if (submissionIndex === -1) return false;

  submissions.splice(submissionIndex, 1);
  await writeJsonFile(submissionsFile, submissions);
  return true;
}

export async function getSubmissionById(id: number) {
  await ensureDataDir();
  const submissions = await readJsonFile(submissionsFile, []);
  return submissions.find(s => s.id === id) || null;
}

// Media functions
export async function getMediaFiles(filters: {
  type?: string;
  search?: string;
} = {}) {
  await ensureDataDir();
  const mediaFiles = await readJsonFile(mediaFile, []);

  let filteredMedia = [...mediaFiles];

  if (filters.type) {
    filteredMedia = filteredMedia.filter(file => file.type === filters.type);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredMedia = filteredMedia.filter(file => 
      file.name.toLowerCase().includes(searchLower) ||
      file.alt.toLowerCase().includes(searchLower)
    );
  }

  return {
    files: filteredMedia,
    total: filteredMedia.length
  };
}

export async function createMediaFile(data: {
  name: string;
  type: string;
  size: number;
  url: string;
  alt: string;
  uploadedBy: string;
  uploadDate: string;
  dimensions: string;
  tags: string[];
}) {
  await ensureDataDir();
  const mediaFiles = await readJsonFile(mediaFile, []);
  
  const newMediaFile = {
    id: mediaFiles.length > 0 ? Math.max(...mediaFiles.map(f => f.id)) + 1 : 1,
    ...data,
    createdAt: new Date().toISOString()
  };

  mediaFiles.push(newMediaFile);
  await writeJsonFile(mediaFile, mediaFiles);

  return newMediaFile;
}

// Initialize with sample data if empty
export async function initDatabase() {
  await ensureDataDir();
  
  // Check if posts file exists and has data
  const posts = await readJsonFile(postsFile, []);
  if (posts.length === 0) {
    // Create sample posts
    const samplePosts = [
      {
        id: 1,
        title: "Building Meaningful Connections",
        slug: "building-meaningful-connections",
        content: `# Building Meaningful Connections

In today's increasingly digital world, the art of building genuine connections has become both more challenging and more important than ever before.

## The Digital Paradox

We live in an age of unprecedented connectivity, yet many of us feel more isolated than ever. Social media platforms promise connection but often deliver superficial interactions.

## Authentic Connection Strategies

### 1. Be Present
When talking with someone, put away your phone. Make eye contact. Listen actively.

### 2. Share Vulnerability
Real connections happen when we're willing to be authentic and vulnerable.

### 3. Quality Over Quantity
Focus on deep relationships rather than accumulating hundreds of superficial connections.

## The Impact

Meaningful connections provide:
- Emotional support
- Personal growth
- Professional opportunities
- Increased happiness

*Building connections is a skill that improves with practice.*`,
        excerpt: "Discover how to forge genuine connections in an increasingly digital world through presence, vulnerability, and quality over quantity.",
        tags: ["Relationships", "Community", "Wellbeing"],
        status: "published",
        publishDate: "2024-07-25",
        author: "Dxmond Tecku",
        featured: true,
        views: 1234,
        createdAt: "2024-07-25T10:00:00Z",
        updatedAt: "2024-07-25T10:00:00Z"
      },
      {
        id: 2,
        title: "Creative Hobbies for Wellbeing",
        slug: "creative-hobbies-for-wellbeing",
        content: `# Creative Hobbies for Wellbeing

Engaging in creative activities is one of the most powerful ways to enhance your mental and emotional wellbeing...`,
        excerpt: "Explore how creative activities can boost your mental and emotional health...",
        tags: ["Creativity", "Wellbeing"],
        status: "published",
        publishDate: "2024-07-24",
        author: "Jane Smith",
        featured: false,
        views: 892,
        createdAt: "2024-07-24T15:30:00Z",
        updatedAt: "2024-07-24T15:30:00Z"
      }
    ];
    
    await writeJsonFile(postsFile, samplePosts);
  }

  // Initialize authors if empty
  const authors = await readJsonFile(authorsFile, []);
  if (authors.length === 0) {
    const sampleAuthors = [
      {
        id: 1,
        name: "Dxmond Tecku",
        email: "dxmond@biggerminds.com",
        role: "admin",
        bio: "Founder and main author of Bigger Minds. Passionate about exploring ideas that spark curiosity and creativity.",
        avatar: "/images/authors/dxmond-tecku.jpg",
        socialLinks: {
          twitter: "@dxmondtecku",
          linkedin: "dxmond-tecku",
          website: "dxmondtecku.com"
        },
        postCount: 42,
        joinDate: "2024-01-15",
        status: "active",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z"
      }
    ];
    
    await writeJsonFile(authorsFile, sampleAuthors);
  }

  // Initialize submissions if empty
  const submissions = await readJsonFile(submissionsFile, []);
  if (submissions.length === 0) {
    const sampleSubmissions = [
      {
        id: 1,
        title: "The Art of Mindful Living",
        content: `# The Art of Mindful Living

In our fast-paced world, finding moments of peace and clarity can feel like an impossible task. Yet, mindfulness offers a path to tranquility that's accessible to everyone.

## What is Mindfulness?

Mindfulness is the practice of being fully present and engaged in the current moment, without judgment. It's about noticing your thoughts, feelings, and surroundings with gentle awareness.

## Simple Mindfulness Exercises

### 1. Mindful Breathing
Take 5 minutes to focus solely on your breath. Notice the sensation of air entering and leaving your body.

### 2. Body Scan
Lie down and mentally scan your body from head to toe, noticing any sensations without judgment.

### 3. Mindful Walking
Pay attention to each step as you walk, feeling your feet connect with the ground.

## Benefits of Regular Practice

Regular mindfulness practice can reduce stress, improve focus, and enhance overall wellbeing. Even just 10 minutes a day can make a significant difference in how you experience life.

*Start small, be consistent, and watch as your relationship with yourself transforms.*`,
        excerpt: "Discover practical mindfulness techniques for everyday life and stress reduction.",
        authorName: "Emily Rodriguez",
        authorEmail: "emily.rodriguez@example.com",
        authorBio: "Wellness coach and mindfulness practitioner with over 10 years of experience helping people find balance in their daily lives.",
        socialLinks: {
          twitter: "@emilywellness",
          instagram: "@mindfulemily"
        },
        category: "Wellness",
        status: "pending",
        attachments: ["mindfulness-guide.pdf"],
        createdAt: "2024-07-25T10:00:00Z",
        updatedAt: "2024-07-25T10:00:00Z"
      },
      {
        id: 2,
        title: "Sustainable Fashion Choices",
        content: `# Sustainable Fashion Choices

The fashion industry has a significant environmental impact, but as consumers, we have the power to drive change through our choices.

## The Environmental Impact

Fast fashion contributes to water pollution, textile waste, and carbon emissions. By making conscious choices, we can reduce our fashion footprint.

## Sustainable Alternatives

### 1. Second-Hand Shopping
Thrift stores and online platforms offer quality clothing at a fraction of the environmental cost.

### 2. Quality Over Quantity
Invest in well-made pieces that last longer, reducing the need for frequent replacements.

### 3. Sustainable Brands
Support companies that prioritize ethical production and environmental responsibility.

## Small Changes, Big Impact

Even simple changes like washing clothes in cold water, air drying instead of using dryers, and repairing instead of replacing can make a significant difference.

*Every sustainable choice contributes to a healthier planet.*`,
        excerpt: "How to make eco-friendly fashion choices without breaking the bank.",
        authorName: "Michael Chen",
        authorEmail: "michael.chen@example.com",
        authorBio: "Environmental advocate and sustainable fashion blogger passionate about making eco-conscious living accessible to everyone.",
        socialLinks: {
          website: "michael-sustainable.com"
        },
        category: "Sustainability",
        status: "reviewing",
        attachments: [],
        createdAt: "2024-07-24T15:30:00Z",
        updatedAt: "2024-07-24T15:30:00Z"
      }
    ];
    
    await writeJsonFile(submissionsFile, sampleSubmissions);
  }

  // Initialize media if empty
  const mediaFiles = await readJsonFile(mediaFile, []);
  if (mediaFiles.length === 0) {
    const sampleMedia = [
      {
        id: 1,
        name: "blog-hero-image.jpg",
        type: "image",
        size: 245760,
        url: "/images/blog-hero-image.jpg",
        alt: "Blog hero image",
        uploadedBy: "Dxmond Tecku",
        uploadDate: "2024-07-25",
        dimensions: "1920x1080",
        tags: ["blog", "hero", "featured"],
        createdAt: "2024-07-25T10:00:00Z"
      }
    ];
    
    await writeJsonFile(mediaFile, sampleMedia);
  }

  console.log('Database initialized successfully');
}
