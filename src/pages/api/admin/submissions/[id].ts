import type { APIRoute } from "astro";
import { getCurrentUser } from "@/lib/admin/auth";
import { getSubmissionById, updateSubmission, deleteSubmission, createPost, createAuthor } from "@/lib/filedb";

export const GET: APIRoute = async ({ params, cookies }) => {
  // Import here to avoid module resolution issues
  const { getCurrentUser } = await import("@/lib/admin/auth");
  const { getSubmissionById } = await import("@/lib/filedb");
  
  // Check authentication
  const user = getCurrentUser(cookies);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }

  // Get submission ID from params
  const submissionId = parseInt(params.id);
  if (isNaN(submissionId)) {
    return new Response(
      JSON.stringify({ error: "Invalid submission ID" }),
      { status: 400 }
    );
  }

  // Find submission
  const submission = await getSubmissionById(submissionId);
  if (!submission) {
    return new Response(
      JSON.stringify({ error: "Submission not found" }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({ submission }),
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
  const { updateSubmission, getSubmissionById } = await import("@/lib/filedb");
  
  // Check authentication
  const user = getCurrentUser(cookies);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    const submissionId = parseInt(params.id);
    if (isNaN(submissionId)) {
      return new Response(
        JSON.stringify({ error: "Invalid submission ID" }),
        { status: 400 }
      );
    }

    const data = await request.json();
    
    // Update submission
    const updatedSubmission = await updateSubmission(submissionId, data);
    if (!updatedSubmission) {
      return new Response(
        JSON.stringify({ error: "Submission not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Submission updated successfully",
        submission: updatedSubmission
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Update submission error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  // Import here to avoid module resolution issues
  const { getCurrentUser } = await import("@/lib/admin/auth");
  const { deleteSubmission } = await import("@/lib/filedb");
  
  // Check authentication
  const user = getCurrentUser(cookies);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    const submissionId = parseInt(params.id);
    if (isNaN(submissionId)) {
      return new Response(
        JSON.stringify({ error: "Invalid submission ID" }),
        { status: 400 }
      );
    }

    // Delete submission
    const success = await deleteSubmission(submissionId);
    if (!success) {
      return new Response(
        JSON.stringify({ error: "Submission not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Submission deleted successfully"
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Delete submission error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};
