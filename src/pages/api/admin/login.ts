import type { APIRoute } from "astro";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In production, store these in environment variables
const ADMIN_EMAIL = 'admin@miawoezo.com';
const ADMIN_PASSWORD_HASH = '$2a$10$rOzJqQjQjQjQjQjQjQu'; // This is a hash of 'admin123'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password, remember } = await request.json();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400 }
      );
    }

    // Check credentials
    if (email !== ADMIN_EMAIL) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401 }
      );
    }

    // Verify password (in production, use proper password hashing)
    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        email, 
        role: 'admin',
        loginTime: new Date().toISOString()
      },
      JWT_SECRET,
      { 
        expiresIn: remember ? '7d' : '24h' 
      }
    );

    // Set secure cookie
    const maxAge = remember ? 7 * 24 * 60 * 60 : 24 * 60 * 60; // 7 days or 24 hours
    cookies.set("admin_token", token, {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "strict",
      maxAge
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Login successful",
        user: { email, role: 'admin' }
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};
