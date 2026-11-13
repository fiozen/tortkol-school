CREATE TYPE "public"."contact_status" AS ENUM('new', 'read', 'archived');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."locale" AS ENUM('qq', 'ru', 'en');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."post_type" AS ENUM('news', 'education');--> statement-breakpoint
CREATE TABLE "admin_account" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_account_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "albums" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(150) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"cover_image" varchar(500),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "albums_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(150) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"phone" varchar(30) NOT NULL,
	"subject" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"status" "contact_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "direction_subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"direction_id" integer NOT NULL,
	"subject_id" integer NOT NULL,
	"is_specialized" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "directions" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(150) NOT NULL,
	"description" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "directions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "leaders" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"role" varchar(150) NOT NULL,
	"photo_url" varchar(500) NOT NULL,
	"bio" text,
	"reception_days" varchar(255) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"album_id" integer,
	"type" "media_type" DEFAULT 'image' NOT NULL,
	"url" varchar(500) NOT NULL,
	"title" varchar(200),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(200) NOT NULL,
	"type" "post_type" DEFAULT 'news' NOT NULL,
	"category_id" integer,
	"title" varchar(255) NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"cover_image" varchar(500),
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" integer NOT NULL,
	"token_hash" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"description" varchar(255),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"icon" varchar(50),
	CONSTRAINT "subjects_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "teacher_subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"teacher_id" integer NOT NULL,
	"subject_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"photo_url" varchar(500) NOT NULL,
	"category" varchar(100) NOT NULL,
	"bio" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translation_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" integer NOT NULL,
	"field_name" varchar(50) NOT NULL,
	"source_text" text NOT NULL,
	"source_locale" varchar(10) DEFAULT 'uz' NOT NULL,
	"status" "job_status" DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" integer NOT NULL,
	"field_name" varchar(50) NOT NULL,
	"locale" "locale" NOT NULL,
	"translated_text" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "type_status_idx" ON "posts" USING btree ("type","status");--> statement-breakpoint
CREATE INDEX "published_at_idx" ON "posts" USING btree ("published_at");--> statement-breakpoint
CREATE UNIQUE INDEX "teacher_subject_idx" ON "teacher_subjects" USING btree ("teacher_id","subject_id");--> statement-breakpoint
CREATE INDEX "job_status_idx" ON "translation_jobs" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "entity_field_locale_idx" ON "translations" USING btree ("entity_type","entity_id","field_name","locale");