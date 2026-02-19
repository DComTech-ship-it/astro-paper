import type { APIRoute } from "astro";
import { getCurrentUser } from "@/lib/admin/auth";
import { getSubmissions, updateSubmission, createSubmission, deleteSubmission, createPost, createAuthor } from "@/lib/filedb";

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
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Get submissions from database with filters
    const { submissions, total } = await getSubmissions({
      status,
      category,
      search
    });

    // Get stats
    const stats = {
      total: submissions.length,
      pending: submissions.filter(s => s.status === 'pending').length,
      reviewing: submissions.filter(s => s.status === 'reviewing').length,
      approved: submissions.filter(s => s.status === 'approved').length,
      rejected: submissions.filter(s => s.status === 'rejected').length
    };

    return new Response(
      JSON.stringify({
        submissions,
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
    console.error('Get submissions error:', error);
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
    if (!data.title || !data.content || !data.authorName || !data.authorEmail) {
      return new Response(
        JSON.stringify({ error: "Title, content, author name, and email are required" }),
        { status: 400 }
      );
    }

    // Create submission in database
    const newSubmission = await createSubmission({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || '',
      authorName: data.authorName,
      authorEmail: data.authorEmail,
      authorBio: data.authorBio || '',
      socialLinks: data.socialLinks || {},
      category: data.category || '',
      status: 'pending',
      attachments: data.attachments || []
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Submission created successfully",
        submission: newSubmission
      }),
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Create submission error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};
