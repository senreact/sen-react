import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
  
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "partners_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "programmes_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "team_members_id" integer;
  ALTER TABLE "payload"."partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_partners_v" ADD CONSTRAINT "_partners_v_parent_id_partners_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_partners_v" ADD CONSTRAINT "_partners_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_programmes_v" ADD CONSTRAINT "_programmes_v_parent_id_programmes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."programmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_team_members_v" ADD CONSTRAINT "_team_members_v_parent_id_team_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_team_members_v" ADD CONSTRAINT "_team_members_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."contact_info_address_lines" ADD CONSTRAINT "contact_info_address_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
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
  CREATE INDEX "contact_info_address_lines_order_idx" ON "payload"."contact_info_address_lines" USING btree ("_order");
  CREATE INDEX "contact_info_address_lines_parent_id_idx" ON "payload"."contact_info_address_lines" USING btree ("_parent_id");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "payload"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programmes_fk" FOREIGN KEY ("programmes_id") REFERENCES "payload"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "payload"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_programmes_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("programmes_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("team_members_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."partners" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_partners_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."programmes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_programmes_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."team_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_team_members_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."contact_info_address_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."contact_info" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."partners" CASCADE;
  DROP TABLE "payload"."_partners_v" CASCADE;
  DROP TABLE "payload"."programmes" CASCADE;
  DROP TABLE "payload"."_programmes_v" CASCADE;
  DROP TABLE "payload"."team_members" CASCADE;
  DROP TABLE "payload"."_team_members_v" CASCADE;
  DROP TABLE "payload"."contact_info_address_lines" CASCADE;
  DROP TABLE "payload"."contact_info" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_partners_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_programmes_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_team_members_fk";
  
  DROP INDEX "payload"."payload_locked_documents_rels_partners_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_programmes_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_team_members_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "partners_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "programmes_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "team_members_id";
  DROP TYPE "payload"."enum_partners_kind";
  DROP TYPE "payload"."enum_partners_status";
  DROP TYPE "payload"."enum__partners_v_version_kind";
  DROP TYPE "payload"."enum__partners_v_version_status";
  DROP TYPE "payload"."enum_programmes_variant";
  DROP TYPE "payload"."enum_programmes_status";
  DROP TYPE "payload"."enum__programmes_v_version_variant";
  DROP TYPE "payload"."enum__programmes_v_version_status";
  DROP TYPE "payload"."enum_team_members_status";
  DROP TYPE "payload"."enum__team_members_v_version_status";`);
}
