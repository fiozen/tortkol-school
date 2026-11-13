import {
  pgTable,
  serial,
  varchar,
  text,
  pgEnum,
  timestamp,
  integer,
  boolean,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// Enums
export const postTypeEnum = pgEnum('post_type', ['news', 'education']);
export const postStatusEnum = pgEnum('post_status', ['draft', 'published', 'archived']);
export const mediaTypeEnum = pgEnum('media_type', ['image', 'video']);
export const contactStatusEnum = pgEnum('contact_status', ['new', 'read', 'archived']);
export const localeEnum = pgEnum('locale', ['qq', 'ru', 'en']);
export const jobStatusEnum = pgEnum('job_status', ['pending', 'processing', 'completed', 'failed']);

// 1. Admin Akkaunti (Faqat bitta admin)
export const adminAccount = pgTable('admin_account', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Refresh Tokens
export const refreshTokens = pgTable('refresh_tokens', {
  id: serial('id').primaryKey(),
  adminId: integer('admin_id').notNull(),
  tokenHash: varchar('token_hash', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Kategoriyalar
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 120 }).notNull().unique(),
  name: varchar('name', { length: 150 }).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Postlar (Yangiliklar va Ta'lim materiallari)
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  type: postTypeEnum('type').default('news').notNull(),
  categoryId: integer('category_id'),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  coverImage: varchar('cover_image', { length: 500 }),
  status: postStatusEnum('status').default('draft').notNull(),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => [
  index('type_status_idx').on(table.type, table.status),
  index('published_at_idx').on(table.publishedAt),
]);

// 4. Rahbariyat
export const leaders = pgTable('leaders', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 150 }).notNull(),
  role: varchar('role', { length: 150 }).notNull(),
  photoUrl: varchar('photo_url', { length: 500 }).notNull(),
  bio: text('bio'),
  receptionDays: varchar('reception_days', { length: 255 }).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5. O'qituvchilar
export const teachers = pgTable('teachers', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 150 }).notNull(),
  photoUrl: varchar('photo_url', { length: 500 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  bio: text('bio'),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 6. Fanlar
export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  icon: varchar('icon', { length: 50 }),
});

// O'qituvchi - Fan bog'lanishi (Many-to-many)
export const teacherSubjects = pgTable('teacher_subjects', {
  id: serial('id').primaryKey(),
  teacherId: integer('teacher_id').notNull(),
  subjectId: integer('subject_id').notNull(),
}, (table) => [
  uniqueIndex('teacher_subject_idx').on(table.teacherId, table.subjectId),
]);

// 7. Yo'nalishlar (Aniq fanlar, Tabiiy fanlar)
export const directions = pgTable('directions', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 150 }).notNull(),
  description: text('description').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
});

export const directionSubjects = pgTable('direction_subjects', {
  id: serial('id').primaryKey(),
  directionId: integer('direction_id').notNull(),
  subjectId: integer('subject_id').notNull(),
  isSpecialized: boolean('is_specialized').default(true).notNull(),
});

// 8. Fotoalbomlar va Media
export const albums = pgTable('albums', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 150 }).notNull().unique(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  coverImage: varchar('cover_image', { length: 500 }),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  albumId: integer('album_id'),
  type: mediaTypeEnum('type').default('image').notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  title: varchar('title', { length: 200 }),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 9. Aloqa xabarlari (Contact messages)
export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 150 }).notNull(),
  phone: varchar('phone', { length: 30 }).notNull(),
  subject: varchar('subject', { length: 200 }).notNull(),
  message: text('message').notNull(),
  status: contactStatusEnum('status').default('new').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 10. Tarjimalar (O'zbekchadan boshqa tillar uchun: qq, ru, en)
export const translations = pgTable('translations', {
  id: serial('id').primaryKey(),
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: integer('entity_id').notNull(),
  fieldName: varchar('field_name', { length: 50 }).notNull(),
  locale: localeEnum('locale').notNull(),
  translatedText: text('translated_text').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('entity_field_locale_idx').on(table.entityType, table.entityId, table.fieldName, table.locale),
]);

// 11. Tarjima topshiriqlari navbati (Translation Jobs Queue)
export const translationJobs = pgTable('translation_jobs', {
  id: serial('id').primaryKey(),
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: integer('entity_id').notNull(),
  fieldName: varchar('field_name', { length: 50 }).notNull(),
  sourceText: text('source_text').notNull(),
  sourceLocale: varchar('source_locale', { length: 10 }).default('uz').notNull(),
  status: jobStatusEnum('status').default('pending').notNull(),
  errorMessage: text('error_message'),
  retryCount: integer('retry_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('job_status_idx').on(table.status),
]);

// 12. Sayt umumiy sozlamalari (Settings)
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  description: varchar('description', { length: 255 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
