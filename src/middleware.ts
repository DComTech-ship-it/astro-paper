import { defineMiddleware } from "astro:middleware";
import { isAuthenticated } from "@/lib/admin/auth";

export const onRequest = defineMiddleware((context, next) => {
  const { url, cookies } = context;
  
  // Normalize the pathname to remove trailing slash
  const pathname = url.pathname.replace(/\/$/, "");
  
  // Debug logging
  console.log('Middleware called for URL:', pathname);
  console.log('Has admin_token cookie:', !!cookies.get("admin_token")?.value);
  
  // Check if this is an admin route
  if (pathname.startsWith("/admin")) {
    // Allow access to login page (handle both /admin/login and /admin/login/)
    if (pathname === "/admin/login") {
      // If already logged in, redirect to dashboard
      if (isAuthenticated(cookies)) {
        console.log('User is authenticated, redirecting to dashboard');
        return Response.redirect(new URL("/admin", url.origin));
      }
      console.log('Allowing access to login page');
      return next();
    }
    
    // Protect all other admin routes
    if (!isAuthenticated(cookies)) {
      console.log('User not authenticated, redirecting to login');
      return Response.redirect(new URL("/admin/login", url.origin));
    }
  }
  
  return next();
});
