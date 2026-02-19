import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies }) => {
  // Clear the admin token cookie
  cookies.delete("admin_token", {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "strict"
  });

  return new Response(
    JSON.stringify({ success: true, message: "Logged out successfully" }),
    { 
      status: 200,
      headers: {
        'Location': '/admin/login',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    }
  );
};
