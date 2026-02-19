import type { APIRoute } from "astro";
import bcrypt from 'bcryptjs';

export const GET: APIRoute = async () => {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  
  return new Response(
    JSON.stringify({ 
      password,
      hash,
      message: "Use this hash in your login.ts file"
    }),
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};
