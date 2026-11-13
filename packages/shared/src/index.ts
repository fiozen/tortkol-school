import { z } from 'zod';

export type SupportedLocale = 'uz' | 'qq' | 'ru' | 'en';
export const SUPPORTED_LOCALES: SupportedLocale[] = ['uz', 'qq', 'ru', 'en'];
export const DEFAULT_LOCALE: SupportedLocale = 'uz';

// Contact Form Schema
export const ContactMessageSchema = z.object({
  fullName: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  phone: z.string().min(9, "Telefon raqami to'liq kiritilishi shart"),
  email: z.string().email("Email formati noto'g'ri").optional().or(z.literal('')),
  message: z.string().min(5, "Murojaat matni kamida 5 ta belgidan iborat bo'lishi kerak"),
});

export type ContactMessageInput = z.infer<typeof ContactMessageSchema>;

// Post Status & Types
export type PostType = 'news' | 'education';
export type PostStatus = 'draft' | 'published' | 'archived';

export interface PostItem {
  id: number;
  slug: string;
  type: PostType;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Teacher & Staff
export interface TeacherItem {
  id: number;
  fullName: string;
  photoUrl: string;
  category: string; // e.g. "Oliy toifali", "Birinchi toifali"
  subjects: string[];
  bio?: string;
  sortOrder: number;
}

export interface LeaderItem {
  id: number;
  fullName: string;
  role: string;
  receptionDays: string;
  photoUrl: string;
  bio?: string;
  sortOrder: number;
}

// Direction
export type DirectionType = 'exact' | 'natural';

export interface DirectionItem {
  slug: string;
  title: string;
  description: string;
  subjects: string[];
  features: string[];
}
