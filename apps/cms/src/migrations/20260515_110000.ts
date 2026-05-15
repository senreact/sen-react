import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "payload"."enum_trainings_training_type" AS ENUM('tutorial', 'webinar', 'workshop', 'online-course');
    CREATE TYPE "payload"."enum_trainings_level" AS ENUM('debutant', 'intermediaire', 'avance');
    CREATE TYPE "payload"."enum_trainings_format" AS ENUM('online', 'in-person', 'hybrid');
    CREATE TYPE "payload"."enum_trainings_status" AS ENUM('draft', 'published');
    CREATE TYPE "payload"."enum__trainings_v_version_training_type" AS ENUM('tutorial', 'webinar', 'workshop', 'online-course');
    CREATE TYPE "payload"."enum__trainings_v_version_level" AS ENUM('debutant', 'intermediaire', 'avance');
    CREATE TYPE "payload"."enum__trainings_v_version_format" AS ENUM('online', 'in-person', 'hybrid');
    CREATE TYPE "payload"."enum__trainings_v_version_status" AS ENUM('draft', 'published');

    CREATE TABLE "payload"."trainings" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "summary" varchar,
      "body" jsonb,
      "training_type" "payload"."enum_trainings_training_type" NOT NULL DEFAULT 'tutorial',
      "level" "payload"."enum_trainings_level",
      "format" "payload"."enum_trainings_format" DEFAULT 'online',
      "topic" varchar,
      "sector" varchar,
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
      "version_sector" varchar,
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

    ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "trainings_id" integer;

    ALTER TABLE "payload"."trainings" ADD CONSTRAINT "trainings_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload"."_trainings_v" ADD CONSTRAINT "_trainings_v_parent_id_trainings_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."trainings"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload"."_trainings_v" ADD CONSTRAINT "_trainings_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_trainings_fk" FOREIGN KEY ("trainings_id") REFERENCES "payload"."trainings"("id") ON DELETE cascade ON UPDATE no action;

    CREATE UNIQUE INDEX "trainings_slug_idx" ON "payload"."trainings" USING btree ("slug");
    CREATE INDEX "trainings_image_idx" ON "payload"."trainings" USING btree ("image_id");
    CREATE INDEX "trainings_starts_at_idx" ON "payload"."trainings" USING btree ("starts_at");
    CREATE INDEX "trainings_updated_at_idx" ON "payload"."trainings" USING btree ("updated_at");
    CREATE INDEX "trainings_created_at_idx" ON "payload"."trainings" USING btree ("created_at");
    CREATE INDEX "_trainings_v_parent_idx" ON "payload"."_trainings_v" USING btree ("parent_id");
    CREATE INDEX "_trainings_v_version_updated_at_idx" ON "payload"."_trainings_v" USING btree ("version_updated_at");
    CREATE INDEX "_trainings_v_version_created_at_idx" ON "payload"."_trainings_v" USING btree ("version_created_at");
    CREATE INDEX "_trainings_v_latest_idx" ON "payload"."_trainings_v" USING btree ("latest");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_trainings_fk";
    ALTER TABLE "payload"."trainings" DROP CONSTRAINT IF EXISTS "trainings_image_id_media_id_fk";
    ALTER TABLE "payload"."_trainings_v" DROP CONSTRAINT IF EXISTS "_trainings_v_parent_id_trainings_id_fk";
    ALTER TABLE "payload"."_trainings_v" DROP CONSTRAINT IF EXISTS "_trainings_v_version_image_id_media_id_fk";
    ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "trainings_id";
    DROP TABLE IF EXISTS "payload"."_trainings_v";
    DROP TABLE IF EXISTS "payload"."trainings";
    DROP TYPE IF EXISTS "payload"."enum_trainings_training_type";
    DROP TYPE IF EXISTS "payload"."enum_trainings_level";
    DROP TYPE IF EXISTS "payload"."enum_trainings_format";
    DROP TYPE IF EXISTS "payload"."enum_trainings_status";
    DROP TYPE IF EXISTS "payload"."enum__trainings_v_version_training_type";
    DROP TYPE IF EXISTS "payload"."enum__trainings_v_version_level";
    DROP TYPE IF EXISTS "payload"."enum__trainings_v_version_format";
    DROP TYPE IF EXISTS "payload"."enum__trainings_v_version_status";
  `);
}
