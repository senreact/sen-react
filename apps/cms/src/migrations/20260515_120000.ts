import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "payload"."enum_resources_resource_type" AS ENUM('guide', 'fiche-technique', 'modele', 'checklist', 'rapport');
    CREATE TYPE "payload"."enum_resources_status" AS ENUM('draft', 'published');
    CREATE TYPE "payload"."enum__resources_v_version_resource_type" AS ENUM('guide', 'fiche-technique', 'modele', 'checklist', 'rapport');
    CREATE TYPE "payload"."enum__resources_v_version_status" AS ENUM('draft', 'published');

    CREATE TABLE "payload"."resources" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "summary" varchar NOT NULL,
      "body" jsonb,
      "resource_type" "payload"."enum_resources_resource_type" NOT NULL DEFAULT 'guide',
      "sector" varchar,
      "file_id" integer,
      "cover_image_id" integer,
      "published_at" timestamp(3) with time zone NOT NULL,
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
      "version_sector" varchar,
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

    ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "resources_id" integer;

    ALTER TABLE "payload"."resources" ADD CONSTRAINT "resources_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload"."resources" ADD CONSTRAINT "resources_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload"."_resources_v" ADD CONSTRAINT "_resources_v_parent_id_resources_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."resources"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload"."_resources_v" ADD CONSTRAINT "_resources_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload"."_resources_v" ADD CONSTRAINT "_resources_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "payload"."resources"("id") ON DELETE cascade ON UPDATE no action;

    CREATE UNIQUE INDEX "resources_slug_idx" ON "payload"."resources" USING btree ("slug");
    CREATE INDEX "resources_file_idx" ON "payload"."resources" USING btree ("file_id");
    CREATE INDEX "resources_cover_image_idx" ON "payload"."resources" USING btree ("cover_image_id");
    CREATE INDEX "resources_published_at_idx" ON "payload"."resources" USING btree ("published_at");
    CREATE INDEX "resources_updated_at_idx" ON "payload"."resources" USING btree ("updated_at");
    CREATE INDEX "resources_created_at_idx" ON "payload"."resources" USING btree ("created_at");
    CREATE INDEX "_resources_v_parent_idx" ON "payload"."_resources_v" USING btree ("parent_id");
    CREATE INDEX "_resources_v_version_updated_at_idx" ON "payload"."_resources_v" USING btree ("version_updated_at");
    CREATE INDEX "_resources_v_version_created_at_idx" ON "payload"."_resources_v" USING btree ("version_created_at");
    CREATE INDEX "_resources_v_latest_idx" ON "payload"."_resources_v" USING btree ("latest");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_resources_fk";
    ALTER TABLE "payload"."resources" DROP CONSTRAINT IF EXISTS "resources_file_id_media_id_fk";
    ALTER TABLE "payload"."resources" DROP CONSTRAINT IF EXISTS "resources_cover_image_id_media_id_fk";
    ALTER TABLE "payload"."_resources_v" DROP CONSTRAINT IF EXISTS "_resources_v_parent_id_resources_id_fk";
    ALTER TABLE "payload"."_resources_v" DROP CONSTRAINT IF EXISTS "_resources_v_version_file_id_media_id_fk";
    ALTER TABLE "payload"."_resources_v" DROP CONSTRAINT IF EXISTS "_resources_v_version_cover_image_id_media_id_fk";
    ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "resources_id";
    DROP TABLE IF EXISTS "payload"."_resources_v";
    DROP TABLE IF EXISTS "payload"."resources";
    DROP TYPE IF EXISTS "payload"."enum_resources_resource_type";
    DROP TYPE IF EXISTS "payload"."enum_resources_status";
    DROP TYPE IF EXISTS "payload"."enum__resources_v_version_resource_type";
    DROP TYPE IF EXISTS "payload"."enum__resources_v_version_status";
  `);
}
