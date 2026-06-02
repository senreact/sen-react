import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

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
  CREATE TYPE "payload"."enum_partners_kind" AS ENUM('institution', 'ngo');
  CREATE TYPE "payload"."enum_partners_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__partners_v_version_kind" AS ENUM('institution', 'ngo');
  CREATE TYPE "payload"."enum__partners_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_programmes_variant" AS ENUM('headline', 'active');
  CREATE TYPE "payload"."enum_programmes_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__programmes_v_version_variant" AS ENUM('headline', 'active');
  CREATE TYPE "payload"."enum__programmes_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_team_members_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__team_members_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_opportunities_sector" AS ENUM('digitalisation-technologie', 'developpement-economique', 'entrepreneuriat-local', 'agroecologie', 'energies-renouvelables', 'multimedia', 'transformation', 'artisanat', 'elevage', 'saponification');
  CREATE TYPE "payload"."enum_opportunities_opportunity_type" AS ENUM('financement', 'formation', 'appel-a-projets', 'partenariat', 'concours', 'autre');
  CREATE TYPE "payload"."enum_opportunities_area" AS ENUM('senegal', 'senegal-dakar', 'senegal-regions', 'afrique-ouest', 'afrique', 'international');
  CREATE TYPE "payload"."enum_opportunities_amount_currency" AS ENUM('XOF', 'EUR', 'USD');
  CREATE TYPE "payload"."enum_opportunities_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__opportunities_v_version_sector" AS ENUM('digitalisation-technologie', 'developpement-economique', 'entrepreneuriat-local', 'agroecologie', 'energies-renouvelables', 'multimedia', 'transformation', 'artisanat', 'elevage', 'saponification');
  CREATE TYPE "payload"."enum__opportunities_v_version_opportunity_type" AS ENUM('financement', 'formation', 'appel-a-projets', 'partenariat', 'concours', 'autre');
  CREATE TYPE "payload"."enum__opportunities_v_version_area" AS ENUM('senegal', 'senegal-dakar', 'senegal-regions', 'afrique-ouest', 'afrique', 'international');
  CREATE TYPE "payload"."enum__opportunities_v_version_amount_currency" AS ENUM('XOF', 'EUR', 'USD');
  CREATE TYPE "payload"."enum__opportunities_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_events_event_type" AS ENUM('in-person', 'online', 'webinar');
  CREATE TYPE "payload"."enum_events_sector" AS ENUM('digitalisation-technologie', 'developpement-economique', 'entrepreneuriat-local', 'agroecologie', 'energies-renouvelables', 'multimedia', 'transformation', 'artisanat', 'elevage', 'saponification');
  CREATE TYPE "payload"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__events_v_version_event_type" AS ENUM('in-person', 'online', 'webinar');
  CREATE TYPE "payload"."enum__events_v_version_sector" AS ENUM('digitalisation-technologie', 'developpement-economique', 'entrepreneuriat-local', 'agroecologie', 'energies-renouvelables', 'multimedia', 'transformation', 'artisanat', 'elevage', 'saponification');
  CREATE TYPE "payload"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_announcements_category" AS ENUM('general', 'urgent', 'platform-update', 'partnership');
  CREATE TYPE "payload"."enum_announcements_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__announcements_v_version_category" AS ENUM('general', 'urgent', 'platform-update', 'partnership');
  CREATE TYPE "payload"."enum__announcements_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_trainings_training_type" AS ENUM('tutorial', 'webinar', 'workshop', 'online-course');
  CREATE TYPE "payload"."enum_trainings_level" AS ENUM('debutant', 'intermediaire', 'avance');
  CREATE TYPE "payload"."enum_trainings_format" AS ENUM('online', 'in-person', 'hybrid');
  CREATE TYPE "payload"."enum_trainings_sector" AS ENUM('digitalisation-technologie', 'developpement-economique', 'entrepreneuriat-local', 'agroecologie', 'energies-renouvelables', 'multimedia', 'transformation', 'artisanat', 'elevage', 'saponification');
  CREATE TYPE "payload"."enum_trainings_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__trainings_v_version_training_type" AS ENUM('tutorial', 'webinar', 'workshop', 'online-course');
  CREATE TYPE "payload"."enum__trainings_v_version_level" AS ENUM('debutant', 'intermediaire', 'avance');
  CREATE TYPE "payload"."enum__trainings_v_version_format" AS ENUM('online', 'in-person', 'hybrid');
  CREATE TYPE "payload"."enum__trainings_v_version_sector" AS ENUM('digitalisation-technologie', 'developpement-economique', 'entrepreneuriat-local', 'agroecologie', 'energies-renouvelables', 'multimedia', 'transformation', 'artisanat', 'elevage', 'saponification');
  CREATE TYPE "payload"."enum__trainings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_resources_resource_type" AS ENUM('guide', 'fiche-technique', 'modele', 'checklist', 'rapport');
  CREATE TYPE "payload"."enum_resources_sector" AS ENUM('digitalisation-technologie', 'developpement-economique', 'entrepreneuriat-local', 'agroecologie', 'energies-renouvelables', 'multimedia', 'transformation', 'artisanat', 'elevage', 'saponification');
  CREATE TYPE "payload"."enum_resources_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__resources_v_version_resource_type" AS ENUM('guide', 'fiche-technique', 'modele', 'checklist', 'rapport');
  CREATE TYPE "payload"."enum__resources_v_version_sector" AS ENUM('digitalisation-technologie', 'developpement-economique', 'entrepreneuriat-local', 'agroecologie', 'energies-renouvelables', 'multimedia', 'transformation', 'artisanat', 'elevage', 'saponification');
  CREATE TYPE "payload"."enum__resources_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_formalisation_steps_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__formalisation_steps_v_version_status" AS ENUM('draft', 'published');
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
  
  CREATE TABLE "payload"."partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"name" varchar,
  	"kind" "payload"."enum_partners_kind",
  	"description" varchar,
  	"order" numeric DEFAULT 0,
  	"logo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_partners_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_partners_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_name" varchar,
  	"version_kind" "payload"."enum__partners_v_version_kind",
  	"version_description" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_logo_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__partners_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."programmes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"eyebrow" varchar,
  	"description" varchar,
  	"variant" "payload"."enum_programmes_variant" DEFAULT 'active',
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_programmes_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_programmes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_eyebrow" varchar,
  	"version_description" varchar,
  	"version_variant" "payload"."enum__programmes_v_version_variant" DEFAULT 'active',
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__programmes_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"name" varchar,
  	"role" varchar,
  	"order" numeric DEFAULT 0,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_team_members_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_team_members_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_name" varchar,
  	"version_role" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_photo_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__team_members_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."opportunities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"sector" "payload"."enum_opportunities_sector",
  	"opportunity_type" "payload"."enum_opportunities_opportunity_type",
  	"area" "payload"."enum_opportunities_area",
  	"deadline" timestamp(3) with time zone,
  	"amount_value" numeric,
  	"amount_currency" "payload"."enum_opportunities_amount_currency" DEFAULT 'XOF',
  	"amount_display" varchar,
  	"source" varchar,
  	"source_url" varchar,
  	"contact_email" varchar,
  	"published_at" timestamp(3) with time zone,
  	"react_curated" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_opportunities_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_opportunities_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_sector" "payload"."enum__opportunities_v_version_sector",
  	"version_opportunity_type" "payload"."enum__opportunities_v_version_opportunity_type",
  	"version_area" "payload"."enum__opportunities_v_version_area",
  	"version_deadline" timestamp(3) with time zone,
  	"version_amount_value" numeric,
  	"version_amount_currency" "payload"."enum__opportunities_v_version_amount_currency" DEFAULT 'XOF',
  	"version_amount_display" varchar,
  	"version_source" varchar,
  	"version_source_url" varchar,
  	"version_contact_email" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_react_curated" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__opportunities_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"location" varchar,
  	"event_type" "payload"."enum_events_event_type" DEFAULT 'in-person',
  	"sector" "payload"."enum_events_sector",
  	"registration_url" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_location" varchar,
  	"version_event_type" "payload"."enum__events_v_version_event_type" DEFAULT 'in-person',
  	"version_sector" "payload"."enum__events_v_version_sector",
  	"version_registration_url" varchar,
  	"version_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."announcements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"category" "payload"."enum_announcements_category" DEFAULT 'general',
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_announcements_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_announcements_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_category" "payload"."enum__announcements_v_version_category" DEFAULT 'general',
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__announcements_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."trainings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"training_type" "payload"."enum_trainings_training_type" DEFAULT 'tutorial',
  	"level" "payload"."enum_trainings_level",
  	"format" "payload"."enum_trainings_format" DEFAULT 'online',
  	"topic" varchar,
  	"sector" "payload"."enum_trainings_sector",
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"location" varchar,
  	"registration_url" varchar,
  	"video_url" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_trainings_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_trainings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_training_type" "payload"."enum__trainings_v_version_training_type" DEFAULT 'tutorial',
  	"version_level" "payload"."enum__trainings_v_version_level",
  	"version_format" "payload"."enum__trainings_v_version_format" DEFAULT 'online',
  	"version_topic" varchar,
  	"version_sector" "payload"."enum__trainings_v_version_sector",
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_location" varchar,
  	"version_registration_url" varchar,
  	"version_video_url" varchar,
  	"version_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__trainings_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"resource_type" "payload"."enum_resources_resource_type" DEFAULT 'guide',
  	"sector" "payload"."enum_resources_sector",
  	"file_id" integer,
  	"cover_image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_resources_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_resources_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_resource_type" "payload"."enum__resources_v_version_resource_type" DEFAULT 'guide',
  	"version_sector" "payload"."enum__resources_v_version_sector",
  	"version_file_id" integer,
  	"version_cover_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__resources_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."formalisation_steps_required_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"document" varchar
  );
  
  CREATE TABLE "payload"."formalisation_steps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"step_number" numeric,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"agency_name" varchar,
  	"external_url" varchar,
  	"external_label" varchar,
  	"estimated_duration" varchar,
  	"estimated_cost" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_formalisation_steps_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_formalisation_steps_v_version_required_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"document" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_formalisation_steps_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_step_number" numeric,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_agency_name" varchar,
  	"version_external_url" varchar,
  	"version_external_label" varchar,
  	"version_estimated_duration" varchar,
  	"version_estimated_cost" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__formalisation_steps_v_version_status" DEFAULT 'draft',
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
  	"videos_id" integer,
  	"partners_id" integer,
  	"programmes_id" integer,
  	"team_members_id" integer,
  	"opportunities_id" integer,
  	"events_id" integer,
  	"announcements_id" integer,
  	"trainings_id" integer,
  	"resources_id" integer,
  	"formalisation_steps_id" integer
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
  
  CREATE TABLE "payload"."contact_info_address_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."contact_info" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"phone_e164" varchar NOT NULL,
  	"phone_display" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."homepage_hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"headline" varchar NOT NULL,
  	"lead_paragraph" varchar NOT NULL,
  	"primary_cta_label" varchar NOT NULL,
  	"primary_cta_href" varchar NOT NULL,
  	"secondary_cta_label" varchar NOT NULL,
  	"secondary_cta_href" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."homepage_domaines_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."homepage_domaines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"headline" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."empty_states_homepage_latest_news_fallback" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"excerpt" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."empty_states" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"news_title" varchar NOT NULL,
  	"news_description" varchar NOT NULL,
  	"publications_title" varchar NOT NULL,
  	"publications_description" varchar NOT NULL,
  	"videos_title" varchar NOT NULL,
  	"videos_description" varchar NOT NULL,
  	"opportunities_title" varchar NOT NULL,
  	"opportunities_description" varchar NOT NULL,
  	"opportunities_no_match_title" varchar NOT NULL,
  	"opportunities_no_match_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."contact_page_channel_guide" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"channel" varchar NOT NULL,
  	"guidance" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"headline" varchar NOT NULL,
  	"lead_paragraph" varchar NOT NULL,
  	"channel_hints_whatsapp" varchar NOT NULL,
  	"channel_hints_email" varchar NOT NULL,
  	"channel_hints_phone" varchar NOT NULL,
  	"channel_guide_heading" varchar DEFAULT 'Quel canal pour quoi ?' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."about_page_values_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar NOT NULL,
  	"hero_headline" varchar NOT NULL,
  	"hero_lead_paragraph" varchar NOT NULL,
  	"mission_eyebrow" varchar DEFAULT 'Mission' NOT NULL,
  	"mission_section_title" varchar NOT NULL,
  	"mission_body" varchar NOT NULL,
  	"vision_eyebrow" varchar DEFAULT 'Vision' NOT NULL,
  	"vision_section_title" varchar NOT NULL,
  	"vision_body" varchar NOT NULL,
  	"values_eyebrow" varchar NOT NULL,
  	"values_headline" varchar NOT NULL,
  	"founding_eyebrow" varchar NOT NULL,
  	"founding_headline" varchar NOT NULL,
  	"founding_body" jsonb NOT NULL,
  	"legal_label" varchar DEFAULT 'Statut juridique' NOT NULL,
  	"legal_body" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."sectors_page_detail_placeholder_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."sectors_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"index_eyebrow" varchar NOT NULL,
  	"index_headline" varchar NOT NULL,
  	"index_lead_paragraph" varchar NOT NULL,
  	"detail_back_link_label" varchar NOT NULL,
  	"detail_eyebrow" varchar NOT NULL,
  	"detail_placeholder_header_eyebrow" varchar NOT NULL,
  	"detail_placeholder_header_headline" varchar NOT NULL,
  	"detail_placeholder_header_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."auth_strings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"signin_page_title" varchar NOT NULL,
  	"signin_lead_paragraph" varchar NOT NULL,
  	"signin_submit_label" varchar NOT NULL,
  	"signin_signup_prompt" varchar NOT NULL,
  	"signin_signup_link" varchar NOT NULL,
  	"signup_page_title" varchar NOT NULL,
  	"signup_lead_paragraph" varchar NOT NULL,
  	"signup_submit_label" varchar NOT NULL,
  	"signup_password_hint" varchar NOT NULL,
  	"signup_signin_prompt" varchar NOT NULL,
  	"signup_signin_link" varchar NOT NULL,
  	"form_email_label" varchar NOT NULL,
  	"form_password_label" varchar NOT NULL,
  	"form_pending_label" varchar NOT NULL,
  	"errors_signin_failed" varchar NOT NULL,
  	"errors_signup_failed" varchar NOT NULL,
  	"errors_signup_success" varchar NOT NULL,
  	"errors_validation_failed" varchar NOT NULL,
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
  ALTER TABLE "payload"."partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_partners_v" ADD CONSTRAINT "_partners_v_parent_id_partners_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_partners_v" ADD CONSTRAINT "_partners_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_programmes_v" ADD CONSTRAINT "_programmes_v_parent_id_programmes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."programmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_team_members_v" ADD CONSTRAINT "_team_members_v_parent_id_team_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_team_members_v" ADD CONSTRAINT "_team_members_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_opportunities_v" ADD CONSTRAINT "_opportunities_v_parent_id_opportunities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."opportunities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_announcements_v" ADD CONSTRAINT "_announcements_v_parent_id_announcements_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."announcements"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."trainings" ADD CONSTRAINT "trainings_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_trainings_v" ADD CONSTRAINT "_trainings_v_parent_id_trainings_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."trainings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_trainings_v" ADD CONSTRAINT "_trainings_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."resources" ADD CONSTRAINT "resources_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."resources" ADD CONSTRAINT "resources_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_resources_v" ADD CONSTRAINT "_resources_v_parent_id_resources_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_resources_v" ADD CONSTRAINT "_resources_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_resources_v" ADD CONSTRAINT "_resources_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."formalisation_steps_required_documents" ADD CONSTRAINT "formalisation_steps_required_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."formalisation_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_formalisation_steps_v_version_required_documents" ADD CONSTRAINT "_formalisation_steps_v_version_required_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_formalisation_steps_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_formalisation_steps_v" ADD CONSTRAINT "_formalisation_steps_v_parent_id_formalisation_steps_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."formalisation_steps"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "payload"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "payload"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "payload"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "payload"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programmes_fk" FOREIGN KEY ("programmes_id") REFERENCES "payload"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "payload"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_opportunities_fk" FOREIGN KEY ("opportunities_id") REFERENCES "payload"."opportunities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_announcements_fk" FOREIGN KEY ("announcements_id") REFERENCES "payload"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_trainings_fk" FOREIGN KEY ("trainings_id") REFERENCES "payload"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "payload"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_formalisation_steps_fk" FOREIGN KEY ("formalisation_steps_id") REFERENCES "payload"."formalisation_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_header_nav_items" ADD CONSTRAINT "site_header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_footer_legal_nav_items" ADD CONSTRAINT "site_footer_legal_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_footer_social_links" ADD CONSTRAINT "site_footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."contact_info_address_lines" ADD CONSTRAINT "contact_info_address_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."homepage_domaines_pillars" ADD CONSTRAINT "homepage_domaines_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."homepage_domaines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."empty_states_homepage_latest_news_fallback" ADD CONSTRAINT "empty_states_homepage_latest_news_fallback_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."empty_states"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."contact_page_channel_guide" ADD CONSTRAINT "contact_page_channel_guide_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about_page_values_items" ADD CONSTRAINT "about_page_values_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."sectors_page_detail_placeholder_blocks" ADD CONSTRAINT "sectors_page_detail_placeholder_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."sectors_page"("id") ON DELETE cascade ON UPDATE no action;
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
  CREATE UNIQUE INDEX "partners_slug_idx" ON "payload"."partners" USING btree ("slug");
  CREATE INDEX "partners_logo_idx" ON "payload"."partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "payload"."partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "payload"."partners" USING btree ("created_at");
  CREATE INDEX "partners__status_idx" ON "payload"."partners" USING btree ("_status");
  CREATE INDEX "_partners_v_parent_idx" ON "payload"."_partners_v" USING btree ("parent_id");
  CREATE INDEX "_partners_v_version_version_slug_idx" ON "payload"."_partners_v" USING btree ("version_slug");
  CREATE INDEX "_partners_v_version_version_logo_idx" ON "payload"."_partners_v" USING btree ("version_logo_id");
  CREATE INDEX "_partners_v_version_version_updated_at_idx" ON "payload"."_partners_v" USING btree ("version_updated_at");
  CREATE INDEX "_partners_v_version_version_created_at_idx" ON "payload"."_partners_v" USING btree ("version_created_at");
  CREATE INDEX "_partners_v_version_version__status_idx" ON "payload"."_partners_v" USING btree ("version__status");
  CREATE INDEX "_partners_v_created_at_idx" ON "payload"."_partners_v" USING btree ("created_at");
  CREATE INDEX "_partners_v_updated_at_idx" ON "payload"."_partners_v" USING btree ("updated_at");
  CREATE INDEX "_partners_v_latest_idx" ON "payload"."_partners_v" USING btree ("latest");
  CREATE INDEX "_partners_v_autosave_idx" ON "payload"."_partners_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "programmes_slug_idx" ON "payload"."programmes" USING btree ("slug");
  CREATE INDEX "programmes_updated_at_idx" ON "payload"."programmes" USING btree ("updated_at");
  CREATE INDEX "programmes_created_at_idx" ON "payload"."programmes" USING btree ("created_at");
  CREATE INDEX "programmes__status_idx" ON "payload"."programmes" USING btree ("_status");
  CREATE INDEX "_programmes_v_parent_idx" ON "payload"."_programmes_v" USING btree ("parent_id");
  CREATE INDEX "_programmes_v_version_version_slug_idx" ON "payload"."_programmes_v" USING btree ("version_slug");
  CREATE INDEX "_programmes_v_version_version_updated_at_idx" ON "payload"."_programmes_v" USING btree ("version_updated_at");
  CREATE INDEX "_programmes_v_version_version_created_at_idx" ON "payload"."_programmes_v" USING btree ("version_created_at");
  CREATE INDEX "_programmes_v_version_version__status_idx" ON "payload"."_programmes_v" USING btree ("version__status");
  CREATE INDEX "_programmes_v_created_at_idx" ON "payload"."_programmes_v" USING btree ("created_at");
  CREATE INDEX "_programmes_v_updated_at_idx" ON "payload"."_programmes_v" USING btree ("updated_at");
  CREATE INDEX "_programmes_v_latest_idx" ON "payload"."_programmes_v" USING btree ("latest");
  CREATE INDEX "_programmes_v_autosave_idx" ON "payload"."_programmes_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "team_members_slug_idx" ON "payload"."team_members" USING btree ("slug");
  CREATE INDEX "team_members_photo_idx" ON "payload"."team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_updated_at_idx" ON "payload"."team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "payload"."team_members" USING btree ("created_at");
  CREATE INDEX "team_members__status_idx" ON "payload"."team_members" USING btree ("_status");
  CREATE INDEX "_team_members_v_parent_idx" ON "payload"."_team_members_v" USING btree ("parent_id");
  CREATE INDEX "_team_members_v_version_version_slug_idx" ON "payload"."_team_members_v" USING btree ("version_slug");
  CREATE INDEX "_team_members_v_version_version_photo_idx" ON "payload"."_team_members_v" USING btree ("version_photo_id");
  CREATE INDEX "_team_members_v_version_version_updated_at_idx" ON "payload"."_team_members_v" USING btree ("version_updated_at");
  CREATE INDEX "_team_members_v_version_version_created_at_idx" ON "payload"."_team_members_v" USING btree ("version_created_at");
  CREATE INDEX "_team_members_v_version_version__status_idx" ON "payload"."_team_members_v" USING btree ("version__status");
  CREATE INDEX "_team_members_v_created_at_idx" ON "payload"."_team_members_v" USING btree ("created_at");
  CREATE INDEX "_team_members_v_updated_at_idx" ON "payload"."_team_members_v" USING btree ("updated_at");
  CREATE INDEX "_team_members_v_latest_idx" ON "payload"."_team_members_v" USING btree ("latest");
  CREATE INDEX "_team_members_v_autosave_idx" ON "payload"."_team_members_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "opportunities_slug_idx" ON "payload"."opportunities" USING btree ("slug");
  CREATE INDEX "opportunities_updated_at_idx" ON "payload"."opportunities" USING btree ("updated_at");
  CREATE INDEX "opportunities_created_at_idx" ON "payload"."opportunities" USING btree ("created_at");
  CREATE INDEX "opportunities__status_idx" ON "payload"."opportunities" USING btree ("_status");
  CREATE INDEX "_opportunities_v_parent_idx" ON "payload"."_opportunities_v" USING btree ("parent_id");
  CREATE INDEX "_opportunities_v_version_version_slug_idx" ON "payload"."_opportunities_v" USING btree ("version_slug");
  CREATE INDEX "_opportunities_v_version_version_updated_at_idx" ON "payload"."_opportunities_v" USING btree ("version_updated_at");
  CREATE INDEX "_opportunities_v_version_version_created_at_idx" ON "payload"."_opportunities_v" USING btree ("version_created_at");
  CREATE INDEX "_opportunities_v_version_version__status_idx" ON "payload"."_opportunities_v" USING btree ("version__status");
  CREATE INDEX "_opportunities_v_created_at_idx" ON "payload"."_opportunities_v" USING btree ("created_at");
  CREATE INDEX "_opportunities_v_updated_at_idx" ON "payload"."_opportunities_v" USING btree ("updated_at");
  CREATE INDEX "_opportunities_v_latest_idx" ON "payload"."_opportunities_v" USING btree ("latest");
  CREATE INDEX "_opportunities_v_autosave_idx" ON "payload"."_opportunities_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "events_slug_idx" ON "payload"."events" USING btree ("slug");
  CREATE INDEX "events_image_idx" ON "payload"."events" USING btree ("image_id");
  CREATE INDEX "events_updated_at_idx" ON "payload"."events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "payload"."events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "payload"."events" USING btree ("_status");
  CREATE INDEX "_events_v_parent_idx" ON "payload"."_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "payload"."_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_image_idx" ON "payload"."_events_v" USING btree ("version_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "payload"."_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "payload"."_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "payload"."_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "payload"."_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "payload"."_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "payload"."_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_autosave_idx" ON "payload"."_events_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "announcements_slug_idx" ON "payload"."announcements" USING btree ("slug");
  CREATE INDEX "announcements_updated_at_idx" ON "payload"."announcements" USING btree ("updated_at");
  CREATE INDEX "announcements_created_at_idx" ON "payload"."announcements" USING btree ("created_at");
  CREATE INDEX "announcements__status_idx" ON "payload"."announcements" USING btree ("_status");
  CREATE INDEX "_announcements_v_parent_idx" ON "payload"."_announcements_v" USING btree ("parent_id");
  CREATE INDEX "_announcements_v_version_version_slug_idx" ON "payload"."_announcements_v" USING btree ("version_slug");
  CREATE INDEX "_announcements_v_version_version_updated_at_idx" ON "payload"."_announcements_v" USING btree ("version_updated_at");
  CREATE INDEX "_announcements_v_version_version_created_at_idx" ON "payload"."_announcements_v" USING btree ("version_created_at");
  CREATE INDEX "_announcements_v_version_version__status_idx" ON "payload"."_announcements_v" USING btree ("version__status");
  CREATE INDEX "_announcements_v_created_at_idx" ON "payload"."_announcements_v" USING btree ("created_at");
  CREATE INDEX "_announcements_v_updated_at_idx" ON "payload"."_announcements_v" USING btree ("updated_at");
  CREATE INDEX "_announcements_v_latest_idx" ON "payload"."_announcements_v" USING btree ("latest");
  CREATE INDEX "_announcements_v_autosave_idx" ON "payload"."_announcements_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "trainings_slug_idx" ON "payload"."trainings" USING btree ("slug");
  CREATE INDEX "trainings_image_idx" ON "payload"."trainings" USING btree ("image_id");
  CREATE INDEX "trainings_updated_at_idx" ON "payload"."trainings" USING btree ("updated_at");
  CREATE INDEX "trainings_created_at_idx" ON "payload"."trainings" USING btree ("created_at");
  CREATE INDEX "trainings__status_idx" ON "payload"."trainings" USING btree ("_status");
  CREATE INDEX "_trainings_v_parent_idx" ON "payload"."_trainings_v" USING btree ("parent_id");
  CREATE INDEX "_trainings_v_version_version_slug_idx" ON "payload"."_trainings_v" USING btree ("version_slug");
  CREATE INDEX "_trainings_v_version_version_image_idx" ON "payload"."_trainings_v" USING btree ("version_image_id");
  CREATE INDEX "_trainings_v_version_version_updated_at_idx" ON "payload"."_trainings_v" USING btree ("version_updated_at");
  CREATE INDEX "_trainings_v_version_version_created_at_idx" ON "payload"."_trainings_v" USING btree ("version_created_at");
  CREATE INDEX "_trainings_v_version_version__status_idx" ON "payload"."_trainings_v" USING btree ("version__status");
  CREATE INDEX "_trainings_v_created_at_idx" ON "payload"."_trainings_v" USING btree ("created_at");
  CREATE INDEX "_trainings_v_updated_at_idx" ON "payload"."_trainings_v" USING btree ("updated_at");
  CREATE INDEX "_trainings_v_latest_idx" ON "payload"."_trainings_v" USING btree ("latest");
  CREATE INDEX "_trainings_v_autosave_idx" ON "payload"."_trainings_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "resources_slug_idx" ON "payload"."resources" USING btree ("slug");
  CREATE INDEX "resources_file_idx" ON "payload"."resources" USING btree ("file_id");
  CREATE INDEX "resources_cover_image_idx" ON "payload"."resources" USING btree ("cover_image_id");
  CREATE INDEX "resources_updated_at_idx" ON "payload"."resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "payload"."resources" USING btree ("created_at");
  CREATE INDEX "resources__status_idx" ON "payload"."resources" USING btree ("_status");
  CREATE INDEX "_resources_v_parent_idx" ON "payload"."_resources_v" USING btree ("parent_id");
  CREATE INDEX "_resources_v_version_version_slug_idx" ON "payload"."_resources_v" USING btree ("version_slug");
  CREATE INDEX "_resources_v_version_version_file_idx" ON "payload"."_resources_v" USING btree ("version_file_id");
  CREATE INDEX "_resources_v_version_version_cover_image_idx" ON "payload"."_resources_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_resources_v_version_version_updated_at_idx" ON "payload"."_resources_v" USING btree ("version_updated_at");
  CREATE INDEX "_resources_v_version_version_created_at_idx" ON "payload"."_resources_v" USING btree ("version_created_at");
  CREATE INDEX "_resources_v_version_version__status_idx" ON "payload"."_resources_v" USING btree ("version__status");
  CREATE INDEX "_resources_v_created_at_idx" ON "payload"."_resources_v" USING btree ("created_at");
  CREATE INDEX "_resources_v_updated_at_idx" ON "payload"."_resources_v" USING btree ("updated_at");
  CREATE INDEX "_resources_v_latest_idx" ON "payload"."_resources_v" USING btree ("latest");
  CREATE INDEX "_resources_v_autosave_idx" ON "payload"."_resources_v" USING btree ("autosave");
  CREATE INDEX "formalisation_steps_required_documents_order_idx" ON "payload"."formalisation_steps_required_documents" USING btree ("_order");
  CREATE INDEX "formalisation_steps_required_documents_parent_id_idx" ON "payload"."formalisation_steps_required_documents" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "formalisation_steps_slug_idx" ON "payload"."formalisation_steps" USING btree ("slug");
  CREATE INDEX "formalisation_steps_updated_at_idx" ON "payload"."formalisation_steps" USING btree ("updated_at");
  CREATE INDEX "formalisation_steps_created_at_idx" ON "payload"."formalisation_steps" USING btree ("created_at");
  CREATE INDEX "formalisation_steps__status_idx" ON "payload"."formalisation_steps" USING btree ("_status");
  CREATE INDEX "_formalisation_steps_v_version_required_documents_order_idx" ON "payload"."_formalisation_steps_v_version_required_documents" USING btree ("_order");
  CREATE INDEX "_formalisation_steps_v_version_required_documents_parent_id_idx" ON "payload"."_formalisation_steps_v_version_required_documents" USING btree ("_parent_id");
  CREATE INDEX "_formalisation_steps_v_parent_idx" ON "payload"."_formalisation_steps_v" USING btree ("parent_id");
  CREATE INDEX "_formalisation_steps_v_version_version_slug_idx" ON "payload"."_formalisation_steps_v" USING btree ("version_slug");
  CREATE INDEX "_formalisation_steps_v_version_version_updated_at_idx" ON "payload"."_formalisation_steps_v" USING btree ("version_updated_at");
  CREATE INDEX "_formalisation_steps_v_version_version_created_at_idx" ON "payload"."_formalisation_steps_v" USING btree ("version_created_at");
  CREATE INDEX "_formalisation_steps_v_version_version__status_idx" ON "payload"."_formalisation_steps_v" USING btree ("version__status");
  CREATE INDEX "_formalisation_steps_v_created_at_idx" ON "payload"."_formalisation_steps_v" USING btree ("created_at");
  CREATE INDEX "_formalisation_steps_v_updated_at_idx" ON "payload"."_formalisation_steps_v" USING btree ("updated_at");
  CREATE INDEX "_formalisation_steps_v_latest_idx" ON "payload"."_formalisation_steps_v" USING btree ("latest");
  CREATE INDEX "_formalisation_steps_v_autosave_idx" ON "payload"."_formalisation_steps_v" USING btree ("autosave");
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
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_programmes_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("programmes_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_opportunities_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("opportunities_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_announcements_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("announcements_id");
  CREATE INDEX "payload_locked_documents_rels_trainings_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("trainings_id");
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("resources_id");
  CREATE INDEX "payload_locked_documents_rels_formalisation_steps_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("formalisation_steps_id");
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
  CREATE INDEX "site_footer_social_links_parent_id_idx" ON "payload"."site_footer_social_links" USING btree ("_parent_id");
  CREATE INDEX "contact_info_address_lines_order_idx" ON "payload"."contact_info_address_lines" USING btree ("_order");
  CREATE INDEX "contact_info_address_lines_parent_id_idx" ON "payload"."contact_info_address_lines" USING btree ("_parent_id");
  CREATE INDEX "homepage_domaines_pillars_order_idx" ON "payload"."homepage_domaines_pillars" USING btree ("_order");
  CREATE INDEX "homepage_domaines_pillars_parent_id_idx" ON "payload"."homepage_domaines_pillars" USING btree ("_parent_id");
  CREATE INDEX "empty_states_homepage_latest_news_fallback_order_idx" ON "payload"."empty_states_homepage_latest_news_fallback" USING btree ("_order");
  CREATE INDEX "empty_states_homepage_latest_news_fallback_parent_id_idx" ON "payload"."empty_states_homepage_latest_news_fallback" USING btree ("_parent_id");
  CREATE INDEX "contact_page_channel_guide_order_idx" ON "payload"."contact_page_channel_guide" USING btree ("_order");
  CREATE INDEX "contact_page_channel_guide_parent_id_idx" ON "payload"."contact_page_channel_guide" USING btree ("_parent_id");
  CREATE INDEX "about_page_values_items_order_idx" ON "payload"."about_page_values_items" USING btree ("_order");
  CREATE INDEX "about_page_values_items_parent_id_idx" ON "payload"."about_page_values_items" USING btree ("_parent_id");
  CREATE INDEX "sectors_page_detail_placeholder_blocks_order_idx" ON "payload"."sectors_page_detail_placeholder_blocks" USING btree ("_order");
  CREATE INDEX "sectors_page_detail_placeholder_blocks_parent_id_idx" ON "payload"."sectors_page_detail_placeholder_blocks" USING btree ("_parent_id");`)
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
  DROP TABLE "payload"."partners" CASCADE;
  DROP TABLE "payload"."_partners_v" CASCADE;
  DROP TABLE "payload"."programmes" CASCADE;
  DROP TABLE "payload"."_programmes_v" CASCADE;
  DROP TABLE "payload"."team_members" CASCADE;
  DROP TABLE "payload"."_team_members_v" CASCADE;
  DROP TABLE "payload"."opportunities" CASCADE;
  DROP TABLE "payload"."_opportunities_v" CASCADE;
  DROP TABLE "payload"."events" CASCADE;
  DROP TABLE "payload"."_events_v" CASCADE;
  DROP TABLE "payload"."announcements" CASCADE;
  DROP TABLE "payload"."_announcements_v" CASCADE;
  DROP TABLE "payload"."trainings" CASCADE;
  DROP TABLE "payload"."_trainings_v" CASCADE;
  DROP TABLE "payload"."resources" CASCADE;
  DROP TABLE "payload"."_resources_v" CASCADE;
  DROP TABLE "payload"."formalisation_steps_required_documents" CASCADE;
  DROP TABLE "payload"."formalisation_steps" CASCADE;
  DROP TABLE "payload"."_formalisation_steps_v_version_required_documents" CASCADE;
  DROP TABLE "payload"."_formalisation_steps_v" CASCADE;
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
  DROP TABLE "payload"."contact_info_address_lines" CASCADE;
  DROP TABLE "payload"."contact_info" CASCADE;
  DROP TABLE "payload"."homepage_hero" CASCADE;
  DROP TABLE "payload"."homepage_domaines_pillars" CASCADE;
  DROP TABLE "payload"."homepage_domaines" CASCADE;
  DROP TABLE "payload"."empty_states_homepage_latest_news_fallback" CASCADE;
  DROP TABLE "payload"."empty_states" CASCADE;
  DROP TABLE "payload"."contact_page_channel_guide" CASCADE;
  DROP TABLE "payload"."contact_page" CASCADE;
  DROP TABLE "payload"."about_page_values_items" CASCADE;
  DROP TABLE "payload"."about_page" CASCADE;
  DROP TABLE "payload"."sectors_page_detail_placeholder_blocks" CASCADE;
  DROP TABLE "payload"."sectors_page" CASCADE;
  DROP TABLE "payload"."auth_strings" CASCADE;
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
  DROP TYPE "payload"."enum_partners_kind";
  DROP TYPE "payload"."enum_partners_status";
  DROP TYPE "payload"."enum__partners_v_version_kind";
  DROP TYPE "payload"."enum__partners_v_version_status";
  DROP TYPE "payload"."enum_programmes_variant";
  DROP TYPE "payload"."enum_programmes_status";
  DROP TYPE "payload"."enum__programmes_v_version_variant";
  DROP TYPE "payload"."enum__programmes_v_version_status";
  DROP TYPE "payload"."enum_team_members_status";
  DROP TYPE "payload"."enum__team_members_v_version_status";
  DROP TYPE "payload"."enum_opportunities_sector";
  DROP TYPE "payload"."enum_opportunities_opportunity_type";
  DROP TYPE "payload"."enum_opportunities_area";
  DROP TYPE "payload"."enum_opportunities_amount_currency";
  DROP TYPE "payload"."enum_opportunities_status";
  DROP TYPE "payload"."enum__opportunities_v_version_sector";
  DROP TYPE "payload"."enum__opportunities_v_version_opportunity_type";
  DROP TYPE "payload"."enum__opportunities_v_version_area";
  DROP TYPE "payload"."enum__opportunities_v_version_amount_currency";
  DROP TYPE "payload"."enum__opportunities_v_version_status";
  DROP TYPE "payload"."enum_events_event_type";
  DROP TYPE "payload"."enum_events_sector";
  DROP TYPE "payload"."enum_events_status";
  DROP TYPE "payload"."enum__events_v_version_event_type";
  DROP TYPE "payload"."enum__events_v_version_sector";
  DROP TYPE "payload"."enum__events_v_version_status";
  DROP TYPE "payload"."enum_announcements_category";
  DROP TYPE "payload"."enum_announcements_status";
  DROP TYPE "payload"."enum__announcements_v_version_category";
  DROP TYPE "payload"."enum__announcements_v_version_status";
  DROP TYPE "payload"."enum_trainings_training_type";
  DROP TYPE "payload"."enum_trainings_level";
  DROP TYPE "payload"."enum_trainings_format";
  DROP TYPE "payload"."enum_trainings_sector";
  DROP TYPE "payload"."enum_trainings_status";
  DROP TYPE "payload"."enum__trainings_v_version_training_type";
  DROP TYPE "payload"."enum__trainings_v_version_level";
  DROP TYPE "payload"."enum__trainings_v_version_format";
  DROP TYPE "payload"."enum__trainings_v_version_sector";
  DROP TYPE "payload"."enum__trainings_v_version_status";
  DROP TYPE "payload"."enum_resources_resource_type";
  DROP TYPE "payload"."enum_resources_sector";
  DROP TYPE "payload"."enum_resources_status";
  DROP TYPE "payload"."enum__resources_v_version_resource_type";
  DROP TYPE "payload"."enum__resources_v_version_sector";
  DROP TYPE "payload"."enum__resources_v_version_status";
  DROP TYPE "payload"."enum_formalisation_steps_status";
  DROP TYPE "payload"."enum__formalisation_steps_v_version_status";
  DROP TYPE "payload"."enum_site_footer_social_links_platform";`)
}
