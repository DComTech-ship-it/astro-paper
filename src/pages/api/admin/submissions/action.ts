import type { APIRoute } from "astro";
import { getCurrentUser } from "@/lib/admin/auth";
import { getSubmissionById, updateSubmission, createPost, createAuthor } from "@/lib/filedb";

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
    const { submissionId, action } = data;

    if (!submissionId || !action) {
      return new Response(
        JSON.stringify({ error: "Submission ID and action are required" }),
        { status: 400 }
      );
    }

    // Get the submission
    const submission = await getSubmissionById(submissionId);
    if (!submission) {
      return new Response(
        JSON.stringify({ error: "Submission not found" }),
        { status: 404 }
      );
    }

    let result;

    switch (action) {
      case 'approve':
        // Create guest author if doesn't exist
        let guestAuthor = null;
        const { getAuthors } = await import("@/lib/filedb");
        const { authors } = await getAuthors({ search: submission.authorEmail });
        
        if (authors.length === 0) {
          guestAuthor = await createAuthor({
            name: submission.authorName,
            email: submission.authorEmail,
            role: 'guest',
            bio: submission.authorBio,
            avatar: '',
            socialLinks: submission.socialLinks,
            status: 'active'
          });
        } else {
          guestAuthor = authors[0];
        }

        // Create post from submission
        const newPost = await createPost({
          title: submission.title,
          slug: submission.title.toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim(),
          content: submission.content,
          excerpt: submission.excerpt,
          tags: [],
          status: 'published',
          publishDate: new Date().toISOString().split('T')[0],
          author: guestAuthor.name,
          featured: false
        });

        // Update submission status
        await updateSubmission(submissionId, { status: 'approved' });
        
        result = {
          success: true,
          message: "Submission approved and published as post",
          postId: newPost.id,
          authorId: guestAuthor.id
        };
        break;

      case 'reject':
        await updateSubmission(submissionId, { status: 'rejected' });
        result = {
          success: true,
          message: "Submission rejected"
        };
        break;

      case 'review':
        await updateSubmission(submissionId, { status: 'reviewing' });
        result = {
          success: true,
          message: "Submission marked for review"
        };
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400 }
        );
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Submission action error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};
