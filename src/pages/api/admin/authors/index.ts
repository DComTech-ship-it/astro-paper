import type { APIRoute } from "astro";
import { getCurrentUser } from "@/lib/admin/auth";
import { getAuthors, createAuthor } from "@/lib/filedb";

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
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    // Get authors from database with filters
    const { authors, total } = await getAuthors({
      status,
      role,
      search
    });

    // Get stats
    const stats = {
      total: authors.length,
      active: authors.filter(a => a.status === 'active').length,
      pending: authors.filter(a => a.status === 'pending').length,
      guest: authors.filter(a => a.role === 'guest').length
    };

    return new Response(
      JSON.stringify({
        authors,
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
    console.error('Get authors error:', error);
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
    if (!data.name || !data.email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        { status: 400 }
      );
    }

    // Create author in database
    const newAuthor = await createAuthor({
      name: data.name,
      email: data.email,
      role: data.role || 'guest',
      bio: data.bio || '',
      avatar: data.avatar || '',
      socialLinks: data.socialLinks || {},
      status: data.status || 'active'
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Author created successfully",
        author: newAuthor
      }),
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Create author error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};
