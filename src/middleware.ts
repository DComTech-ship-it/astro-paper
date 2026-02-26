import { defineMiddleware } from "astro:middleware";
import { isAuthenticated } from "@/lib/admin/auth";

export const onRequest = defineMiddleware((context, next) => {
  const { url, cookies, request } = context;
  
  // Add security headers
  const response = next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Prevent source code disclosure
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'");
  
  // Normalize the pathname to remove trailing slash
  const pathname = url.pathname.replace(/\/$/, "");
  
  // Check if this is an admin route
  if (pathname.startsWith("/admin")) {
    // Allow access to login page (handle both /admin/login and /admin/login/)
    if (pathname === "/admin/login") {
      // If already logged in, redirect to dashboard
      if (isAuthenticated(cookies)) {
        return Response.redirect(new URL("/admin", url.origin));
      }
      return next();
    }
    
    // Protect all other admin routes
    if (!isAuthenticated(cookies)) {
      return Response.redirect(new URL("/admin/login", url.origin));
    }
  }
  
  return response;
});
