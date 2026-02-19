import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, cookies }) => {
  // Import here to avoid module resolution issues
  const { getCurrentUser } = await import("@/lib/admin/auth");
  const { getPostById } = await import("@/lib/filedb");
  
  // Check authentication
  const user = getCurrentUser(cookies);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }

  // Get post ID from params
  const postId = parseInt(params.id);
  if (isNaN(postId)) {
    return new Response(
      JSON.stringify({ error: "Invalid post ID" }),
      { status: 400 }
    );
  }

  // Find post
  const post = await getPostById(postId);
  if (!post) {
    return new Response(
      JSON.stringify({ error: "Post not found" }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({ post }),
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  // Import here to avoid module resolution issues
  const { getCurrentUser } = await import("@/lib/admin/auth");
  const { updatePost } = await import("@/lib/filedb");
  
  // Check authentication
  const user = getCurrentUser(cookies);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    const postId = parseInt(params.id);
    if (isNaN(postId)) {
      return new Response(
        JSON.stringify({ error: "Invalid post ID" }),
        { status: 400 }
      );
    }

    const data = await request.json();

    // Update post
    const updatedPost = await updatePost(postId, data);
    if (!updatedPost) {
      return new Response(
        JSON.stringify({ error: "Post not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Post updated successfully",
        post: updatedPost
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Update post error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  // Import here to avoid module resolution issues
  const { getCurrentUser } = await import("@/lib/admin/auth");
  const { deletePost } = await import("@/lib/filedb");
  
  // Check authentication
  const user = getCurrentUser(cookies);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    const postId = parseInt(params.id);
    if (isNaN(postId)) {
      return new Response(
        JSON.stringify({ error: "Invalid post ID" }),
        { status: 400 }
      );
    }

    // Delete post
    const success = await deletePost(postId);
    if (!success) {
      return new Response(
        JSON.stringify({ error: "Post not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Post deleted successfully"
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Delete post error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};
