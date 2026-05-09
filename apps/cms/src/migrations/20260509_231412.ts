import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_news_sector" AS ENUM('digitalisation-technologie', 'developpement-economique', 'entrepreneuriat-local', 'agroecologie', 'energies-renouvelables', 'multimedia', 'transformation', 'artisanat', 'elevage', 'saponification');
  CREATE TYPE "payload"."enum_news_write_path" AS ENUM('react-original', 'aggregated');
  CREATE TYPE "payload"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__news_v_version_sector" AS ENUM('digitalisation-technologie', 'developpement-economique', 'entrepreneuriat-local', 'agroecologie', 'energies-renouvelables', 'multimedia', 'transformation', 'artisanat', 'elevage', 'saponification');
  CREATE TYPE "payload"."enum__news_v_version_write_path" AS ENUM('react-original', 'aggregated');
  CREATE TYPE "payload"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_publications_sector" AS ENUM('digitalisation-technologie', 'developpement-economique', 'entrepreneuriat-local', 'agroecologie', 'energies-renouvelables', 'multimedia', 'transformation', 'artisanat', 'elevage', 'saponification');
  CREATE TYPE "payload"."enum_publications_language" AS ENUM('fr', 'en', 'wo');
  CREATE TYPE "payload"."enum_publications_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__publications_v_version_sector" AS ENUM('digitalisation-technologie', 'developpement-economique', 'entrepreneuriat-local', 'agroecologie', 'energies-renouvelables', 'multimedia', 'transformation', 'artisanat', 'elevage', 'saponification');
  CREATE TYPE "payload"."enum__publications_v_version_language" AS ENUM('fr', 'en', 'wo');
  CREATE TYPE "payload"."enum__publications_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_videos_video_type" AS ENUM('capsule', 'explanation', 'interview', 'vlog', 'testimonial');
  CREATE TYPE "payload"."enum_videos_origin" AS ENUM('react-original', 'curated');
  CREATE TYPE "payload"."enum_videos_sector" AS ENUM('digitalisation-technologie', 'developpement-economique', 'entrepreneuriat-local', 'agroecologie', 'energies-renouvelables', 'multimedia', 'transformation', 'artisanat', 'elevage', 'saponification');
  CREATE TYPE "payload"."enum_videos_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__videos_v_version_video_type" AS ENUM('capsule', 'explanation', 'interview', 'vlog', 'testimonial');
  CREATE TYPE "payload"."enum__videos_v_version_origin" AS ENUM('react-original', 'curated');
  CREATE TYPE "payload"."enum__videos_v_version_sector" AS ENUM('digitalisation-technologie', 'developpement-economique', 'entrepreneuriat-local', 'agroecologie', 'energies-renouvelables', 'multimedia', 'transformation', 'artisanat', 'elevage', 'saponification');
  CREATE TYPE "payload"."enum__videos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_site_footer_social_links_platform" AS ENUM('instagram', 'linkedin', 'youtube', 'whatsapp', 'facebook', 'x', 'tiktok');
  CREATE TABLE "payload"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload"."news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"sector" "payload"."enum_news_sector",
  	"write_path" "payload"."enum_news_write_path" DEFAULT 'react-original',
  	"source_url" varchar,
  	"published_at" timestamp(3) with time zone,
  	"cover_image_id" integer,
  	"comments_enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_sector" "payload"."enum__news_v_version_sector",
  	"version_write_path" "payload"."enum__news_v_version_write_path" DEFAULT 'react-original',
  	"version_source_url" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_cover_image_id" integer,
  	"version_comments_enabled" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."publications_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar
  );
  
  CREATE TABLE "payload"."publications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"file_id" integer,
  	"cover_image_id" integer,
  	"sector" "payload"."enum_publications_sector",
  	"published_at" timestamp(3) with time zone,
  	"language" "payload"."enum_publications_language" DEFAULT 'fr',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_publications_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_publications_v_version_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_publications_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_file_id" integer,
  	"version_cover_image_id" integer,
  	"version_sector" "payload"."enum__publications_v_version_sector",
  	"version_published_at" timestamp(3) with time zone,
  	"version_language" "payload"."enum__publications_v_version_language" DEFAULT 'fr',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__publications_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"youtube_id" varchar,
  	"video_type" "payload"."enum_videos_video_type",
  	"origin" "payload"."enum_videos_origin" DEFAULT 'react-original',
  	"sector" "payload"."enum_videos_sector",
  	"subtitles_fr_id" integer,
  	"subtitles_wo_id" integer,
  	"download_url" varchar,
  	"duration" numeric,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_videos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_videos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_youtube_id" varchar,
  	"version_video_type" "payload"."enum__videos_v_version_video_type",
  	"version_origin" "payload"."enum__videos_v_version_origin" DEFAULT 'react-original',
  	"version_sector" "payload"."enum__videos_v_version_sector",
  	"version_subtitles_fr_id" integer,
  	"version_subtitles_wo_id" integer,
  	"version_download_url" varchar,
  	"version_duration" numeric,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__videos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"news_id" integer,
  	"publications_id" integer,
  	"videos_id" integer
  );
  
  CREATE TABLE "payload"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."site_header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"label_en" varchar,
  	"href" varchar NOT NULL,
  	"external" boolean DEFAULT false
  );
  
  CREATE TABLE "payload"."site_header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_title" varchar DEFAULT 'Sen React' NOT NULL,
  	"tagline" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."site_footer_legal_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"label_en" varchar,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."site_footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "payload"."enum_site_footer_social_links_platform" NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."site_footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"copyright_text" varchar DEFAULT '© 2026 Sen React' NOT NULL,
  	"description" varchar,
  	"contact_email" varchar,
  	"contact_address" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."news" ADD CONSTRAINT "news_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_news_v" ADD CONSTRAINT "_news_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."publications_authors" ADD CONSTRAINT "publications_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."publications" ADD CONSTRAINT "publications_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."publications" ADD CONSTRAINT "publications_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_publications_v_version_authors" ADD CONSTRAINT "_publications_v_version_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_publications_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_publications_v" ADD CONSTRAINT "_publications_v_parent_id_publications_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."publications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_publications_v" ADD CONSTRAINT "_publications_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_publications_v" ADD CONSTRAINT "_publications_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."videos" ADD CONSTRAINT "videos_subtitles_fr_id_media_id_fk" FOREIGN KEY ("subtitles_fr_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."videos" ADD CONSTRAINT "videos_subtitles_wo_id_media_id_fk" FOREIGN KEY ("subtitles_wo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_videos_v" ADD CONSTRAINT "_videos_v_parent_id_videos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_videos_v" ADD CONSTRAINT "_videos_v_version_subtitles_fr_id_media_id_fk" FOREIGN KEY ("version_subtitles_fr_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_videos_v" ADD CONSTRAINT "_videos_v_version_subtitles_wo_id_media_id_fk" FOREIGN KEY ("version_subtitles_wo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "payload"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "payload"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "payload"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_header_nav_items" ADD CONSTRAINT "site_header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_footer_legal_nav_items" ADD CONSTRAINT "site_footer_legal_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_footer_social_links" ADD CONSTRAINT "site_footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "payload"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "payload"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "payload"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "payload"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "payload"."users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "payload"."media" USING btree ("filename");
  CREATE UNIQUE INDEX "news_slug_idx" ON "payload"."news" USING btree ("slug");
  CREATE INDEX "news_cover_image_idx" ON "payload"."news" USING btree ("cover_image_id");
  CREATE INDEX "news_updated_at_idx" ON "payload"."news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "payload"."news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "payload"."news" USING btree ("_status");
  CREATE INDEX "_news_v_parent_idx" ON "payload"."_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "payload"."_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_cover_image_idx" ON "payload"."_news_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "payload"."_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "payload"."_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "payload"."_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "payload"."_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "payload"."_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "payload"."_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_autosave_idx" ON "payload"."_news_v" USING btree ("autosave");
  CREATE INDEX "publications_authors_order_idx" ON "payload"."publications_authors" USING btree ("_order");
  CREATE INDEX "publications_authors_parent_id_idx" ON "payload"."publications_authors" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "publications_slug_idx" ON "payload"."publications" USING btree ("slug");
  CREATE INDEX "publications_file_idx" ON "payload"."publications" USING btree ("file_id");
  CREATE INDEX "publications_cover_image_idx" ON "payload"."publications" USING btree ("cover_image_id");
  CREATE INDEX "publications_updated_at_idx" ON "payload"."publications" USING btree ("updated_at");
  CREATE INDEX "publications_created_at_idx" ON "payload"."publications" USING btree ("created_at");
  CREATE INDEX "publications__status_idx" ON "payload"."publications" USING btree ("_status");
  CREATE INDEX "_publications_v_version_authors_order_idx" ON "payload"."_publications_v_version_authors" USING btree ("_order");
  CREATE INDEX "_publications_v_version_authors_parent_id_idx" ON "payload"."_publications_v_version_authors" USING btree ("_parent_id");
  CREATE INDEX "_publications_v_parent_idx" ON "payload"."_publications_v" USING btree ("parent_id");
  CREATE INDEX "_publications_v_version_version_slug_idx" ON "payload"."_publications_v" USING btree ("version_slug");
  CREATE INDEX "_publications_v_version_version_file_idx" ON "payload"."_publications_v" USING btree ("version_file_id");
  CREATE INDEX "_publications_v_version_version_cover_image_idx" ON "payload"."_publications_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_publications_v_version_version_updated_at_idx" ON "payload"."_publications_v" USING btree ("version_updated_at");
  CREATE INDEX "_publications_v_version_version_created_at_idx" ON "payload"."_publications_v" USING btree ("version_created_at");
  CREATE INDEX "_publications_v_version_version__status_idx" ON "payload"."_publications_v" USING btree ("version__status");
  CREATE INDEX "_publications_v_created_at_idx" ON "payload"."_publications_v" USING btree ("created_at");
  CREATE INDEX "_publications_v_updated_at_idx" ON "payload"."_publications_v" USING btree ("updated_at");
  CREATE INDEX "_publications_v_latest_idx" ON "payload"."_publications_v" USING btree ("latest");
  CREATE INDEX "_publications_v_autosave_idx" ON "payload"."_publications_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "videos_slug_idx" ON "payload"."videos" USING btree ("slug");
  CREATE INDEX "videos_subtitles_fr_idx" ON "payload"."videos" USING btree ("subtitles_fr_id");
  CREATE INDEX "videos_subtitles_wo_idx" ON "payload"."videos" USING btree ("subtitles_wo_id");
  CREATE INDEX "videos_updated_at_idx" ON "payload"."videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "payload"."videos" USING btree ("created_at");
  CREATE INDEX "videos__status_idx" ON "payload"."videos" USING btree ("_status");
  CREATE INDEX "_videos_v_parent_idx" ON "payload"."_videos_v" USING btree ("parent_id");
  CREATE INDEX "_videos_v_version_version_slug_idx" ON "payload"."_videos_v" USING btree ("version_slug");
  CREATE INDEX "_videos_v_version_version_subtitles_fr_idx" ON "payload"."_videos_v" USING btree ("version_subtitles_fr_id");
  CREATE INDEX "_videos_v_version_version_subtitles_wo_idx" ON "payload"."_videos_v" USING btree ("version_subtitles_wo_id");
  CREATE INDEX "_videos_v_version_version_updated_at_idx" ON "payload"."_videos_v" USING btree ("version_updated_at");
  CREATE INDEX "_videos_v_version_version_created_at_idx" ON "payload"."_videos_v" USING btree ("version_created_at");
  CREATE INDEX "_videos_v_version_version__status_idx" ON "payload"."_videos_v" USING btree ("version__status");
  CREATE INDEX "_videos_v_created_at_idx" ON "payload"."_videos_v" USING btree ("created_at");
  CREATE INDEX "_videos_v_updated_at_idx" ON "payload"."_videos_v" USING btree ("updated_at");
  CREATE INDEX "_videos_v_latest_idx" ON "payload"."_videos_v" USING btree ("latest");
  CREATE INDEX "_videos_v_autosave_idx" ON "payload"."_videos_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_publications_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("publications_id");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_header_nav_items_order_idx" ON "payload"."site_header_nav_items" USING btree ("_order");
  CREATE INDEX "site_header_nav_items_parent_id_idx" ON "payload"."site_header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "site_footer_legal_nav_items_order_idx" ON "payload"."site_footer_legal_nav_items" USING btree ("_order");
  CREATE INDEX "site_footer_legal_nav_items_parent_id_idx" ON "payload"."site_footer_legal_nav_items" USING btree ("_parent_id");
  CREATE INDEX "site_footer_social_links_order_idx" ON "payload"."site_footer_social_links" USING btree ("_order");
  CREATE INDEX "site_footer_social_links_parent_id_idx" ON "payload"."site_footer_social_links" USING btree ("_parent_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."users_sessions" CASCADE;
  DROP TABLE "payload"."users" CASCADE;
  DROP TABLE "payload"."media" CASCADE;
  DROP TABLE "payload"."news" CASCADE;
  DROP TABLE "payload"."_news_v" CASCADE;
  DROP TABLE "payload"."publications_authors" CASCADE;
  DROP TABLE "payload"."publications" CASCADE;
  DROP TABLE "payload"."_publications_v_version_authors" CASCADE;
  DROP TABLE "payload"."_publications_v" CASCADE;
  DROP TABLE "payload"."videos" CASCADE;
  DROP TABLE "payload"."_videos_v" CASCADE;
  DROP TABLE "payload"."payload_kv" CASCADE;
  DROP TABLE "payload"."payload_locked_documents" CASCADE;
  DROP TABLE "payload"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TABLE "payload"."site_header_nav_items" CASCADE;
  DROP TABLE "payload"."site_header" CASCADE;
  DROP TABLE "payload"."site_footer_legal_nav_items" CASCADE;
  DROP TABLE "payload"."site_footer_social_links" CASCADE;
  DROP TABLE "payload"."site_footer" CASCADE;
  DROP TYPE "payload"."enum_news_sector";
  DROP TYPE "payload"."enum_news_write_path";
  DROP TYPE "payload"."enum_news_status";
  DROP TYPE "payload"."enum__news_v_version_sector";
  DROP TYPE "payload"."enum__news_v_version_write_path";
  DROP TYPE "payload"."enum__news_v_version_status";
  DROP TYPE "payload"."enum_publications_sector";
  DROP TYPE "payload"."enum_publications_language";
  DROP TYPE "payload"."enum_publications_status";
  DROP TYPE "payload"."enum__publications_v_version_sector";
  DROP TYPE "payload"."enum__publications_v_version_language";
  DROP TYPE "payload"."enum__publications_v_version_status";
  DROP TYPE "payload"."enum_videos_video_type";
  DROP TYPE "payload"."enum_videos_origin";
  DROP TYPE "payload"."enum_videos_sector";
  DROP TYPE "payload"."enum_videos_status";
  DROP TYPE "payload"."enum__videos_v_version_video_type";
  DROP TYPE "payload"."enum__videos_v_version_origin";
  DROP TYPE "payload"."enum__videos_v_version_sector";
  DROP TYPE "payload"."enum__videos_v_version_status";
  DROP TYPE "payload"."enum_site_footer_social_links_platform";`);
}
