import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get("admin_token")?.value;
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  
  return new Response(
    JSON.stringify({ 
      message: "Authentication Check",
      hasToken: !!token,
      jwtSecretSet: !!jwtSecret,
      tokenValue: token ? `${token.substring(0, 10)}...` : null,
      cookieName: "admin_token",
      cookieDomain: cookies.get("admin_token")?.domain || "unknown",
      timestamp: new Date().toISOString()
    }),
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};
