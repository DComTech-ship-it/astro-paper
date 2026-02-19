import type { APIRoute } from "astro";
import { getCurrentUser } from "@/lib/admin/auth";

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
    const { id } = await request.json();
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Post ID is required" }),
        { status: 400 }
      );
    }

    // In a real app, this would delete from your blog posts
    console.log(`Deleting post ${id} by user ${user.email}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Post deleted successfully" 
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Delete post error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};
