import type { APIRoute } from "astro";
import { getCurrentUser } from "@/lib/admin/auth";
import { getPosts, createPost, updatePost, deletePost } from "@/lib/filedb";

export const GET: APIRoute = async ({ url, cookies }) => {
  // Check authentication
  const user = getCurrentUser(cookies);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    // Parse query parameters
    const searchParams = url.searchParams;
    const status = searchParams.get('status');
    const author = searchParams.get('author');
    const search = searchParams.get('search');
    const dateRange = searchParams.get('dateRange');

    // Get posts from database with filters
    const { posts, total } = await getPosts({
      status,
      author,
      search,
      dateRange
    });

    // Get stats
    const stats = await getPostStats();

    return new Response(
      JSON.stringify({
        posts,
        total,
        stats
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Get posts error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  // Check authentication
  const user = getCurrentUser(cookies);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.content) {
      return new Response(
        JSON.stringify({ error: "Title and content are required" }),
        { status: 400 }
      );
    }

    // Create post in database
    const newPost = await createPost({
      title: data.title,
      slug: data.slug || generateSlug(data.title),
      content: data.content,
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      status: data.status || 'draft',
      publishDate: data.publishDate || new Date().toISOString().split('T')[0],
      author: data.author || user.email,
      featured: data.featured || false
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Post created successfully",
        post: newPost
      }),
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Create post error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function getPostStats() {
  const posts = await getPosts({});
  return {
    total: posts.total,
    published: posts.posts.filter(p => p.status === 'published').length,
    drafts: posts.posts.filter(p => p.status === 'draft').length,
    scheduled: posts.posts.filter(p => p.status === 'scheduled').length
  };
}
