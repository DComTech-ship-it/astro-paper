import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AdminUser {
  email: string;
  role: string;
  loginTime: string;
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function createToken(user: AdminUser, expiresIn: string = '24h'): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn });
}

export function isAuthenticated(cookies: any): boolean {
  const token = cookies.get("admin_token")?.value;
  if (!token) return false;
  
  const user = verifyToken(token);
  return user !== null;
}

export function getCurrentUser(cookies: any): AdminUser | null {
  const token = cookies.get("admin_token")?.value;
  if (!token) return null;
  
  return verifyToken(token);
}
