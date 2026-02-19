import { defineMiddleware } from "astro:middleware";
import { isAuthenticated } from "@/lib/admin/auth";

export const onRequest = defineMiddleware((context, next) => {
  const { url, cookies } = context;
  
  // Check if this is an admin route
  if (url.pathname.startsWith("/admin")) {
    // Allow access to login page
    if (url.pathname === "/admin/login") {
      // If already logged in, redirect to dashboard
      if (isAuthenticated(cookies)) {
        return Response.redirect(new URL("/admin", url));
      }
      return next();
    }
    
    // Protect all other admin routes
    if (!isAuthenticated(cookies)) {
      return Response.redirect(new URL("/admin/login", url));
    }
  }
  
  return next();
});
