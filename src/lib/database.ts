import Database from 'better-sqlite3';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const dbPath = join(process.cwd(), 'data', 'admin.db');

// Create database connection
export const db = new Database(dbPath);

// Initialize database tables
export function initDatabase() {
  // Create posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT DEFAULT '',
      tags TEXT DEFAULT '[]',
      status TEXT DEFAULT 'draft',
      publishDate TEXT NOT NULL,
      author TEXT NOT NULL,
      featured INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  // Create authors table
  db.exec(`
    CREATE TABLE IF NOT EXISTS authors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'guest',
      bio TEXT DEFAULT '',
      avatar TEXT DEFAULT '',
      socialLinks TEXT DEFAULT '{}',
      postCount INTEGER DEFAULT 0,
      joinDate TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  // Create submissions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT DEFAULT '',
      authorName TEXT NOT NULL,
      authorEmail TEXT NOT NULL,
      authorBio TEXT DEFAULT '',
      socialLinks TEXT DEFAULT '{}',
      category TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      attachments TEXT DEFAULT '[]',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  // Create media table
  db.exec(`
    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      size INTEGER NOT NULL,
      url TEXT NOT NULL,
      alt TEXT DEFAULT '',
      uploadedBy TEXT NOT NULL,
      uploadDate TEXT NOT NULL,
      dimensions TEXT DEFAULT '',
      tags TEXT DEFAULT '[]',
      createdAt TEXT NOT NULL
    )
  `);

  // Create settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  console.log('Database initialized successfully');
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
  let query = 'SELECT * FROM posts WHERE 1=1';
  const params: any[] = [];

  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.author) {
    query += ' AND author = ?';
    params.push(filters.author);
  }

  if (filters.search) {
    query += ' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
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

    query += ' AND publishDate >= ?';
    params.push(filterDate.toISOString().split('T')[0]);
  }

  query += ' ORDER BY createdAt DESC';

  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);
  }

  if (filters.offset) {
    query += ' OFFSET ?';
    params.push(filters.offset);
  }

  const posts = db.prepare(query).all(...params);
  const total = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;

  return {
    posts: posts.map(post => ({
      ...post,
      tags: JSON.parse(post.tags),
      featured: Boolean(post.featured)
    })),
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
  const now = new Date().toISOString();
  
  const stmt = db.prepare(`
    INSERT INTO posts (title, slug, content, excerpt, tags, status, publishDate, author, featured, views, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
  `);

  const result = stmt.run(
    data.title,
    data.slug,
    data.content,
    data.excerpt,
    JSON.stringify(data.tags),
    data.status,
    data.publishDate,
    data.author,
    data.featured ? 1 : 0,
    now,
    now
  );

  return getPostById(result.lastInsertRowid as number);
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
  const now = new Date().toISOString();
  const updates: string[] = [];
  const params: any[] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'tags' && value) {
      updates.push(`${key} = ?`);
      params.push(JSON.stringify(value));
    } else if (key === 'featured' && value !== undefined) {
      updates.push(`${key} = ?`);
      params.push(value ? 1 : 0);
    } else if (value !== undefined) {
      updates.push(`${key} = ?`);
      params.push(value);
    }
  });

  if (updates.length === 0) return null;

  updates.push('updatedAt = ?');
  params.push(now);
  params.push(id);

  const stmt = db.prepare(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`);
  stmt.run(...params);

  return getPostById(id);
}

export async function deletePost(id: number) {
  const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export async function getPostById(id: number) {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
  if (!post) return null;

  return {
    ...post,
    tags: JSON.parse(post.tags),
    featured: Boolean(post.featured)
  };
}

// Author functions
export async function getAuthors(filters: {
  status?: string;
  role?: string;
  search?: string;
} = {}) {
  let query = 'SELECT * FROM authors WHERE 1=1';
  const params: any[] = [];

  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.role) {
    query += ' AND role = ?';
    params.push(filters.role);
  }

  if (filters.search) {
    query += ' AND (name LIKE ? OR email LIKE ? OR bio LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ' ORDER BY createdAt DESC';

  const authors = db.prepare(query).all(...params);
  const total = db.prepare('SELECT COUNT(*) as count FROM authors').get().count;

  return {
    authors: authors.map(author => ({
      ...author,
      socialLinks: JSON.parse(author.socialLinks)
    })),
    total
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
  const now = new Date().toISOString();
  
  const stmt = db.prepare(`
    INSERT INTO authors (name, email, role, bio, avatar, socialLinks, postCount, joinDate, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.name,
    data.email,
    data.role,
    data.bio,
    data.avatar,
    JSON.stringify(data.socialLinks),
    now,
    data.status,
    now,
    now
  );

  return getAuthorById(result.lastInsertRowid as number);
}

export async function getAuthorById(id: number) {
  const author = db.prepare('SELECT * FROM authors WHERE id = ?').get(id);
  if (!author) return null;

  return {
    ...author,
    socialLinks: JSON.parse(author.socialLinks)
  };
}

// Initialize database on module load
initDatabase();
