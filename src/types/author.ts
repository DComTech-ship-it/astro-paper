export interface Author {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  isGuest?: boolean;
  postCount?: number;
  joinedAt?: Date;
}
