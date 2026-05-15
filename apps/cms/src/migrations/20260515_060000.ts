import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_announcements_category" AS ENUM('general', 'urgent', 'platform-update', 'partnership');
  CREATE TYPE "payload"."enum_announcements_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__announcements_v_version_category" AS ENUM('general', 'urgent', 'platform-update', 'partnership');
  CREATE TYPE "payload"."enum__announcements_v_version_status" AS ENUM('draft', 'published');

  CREATE TABLE "payload"."announcements" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "slug" varchar NOT NULL,
    "category" "payload"."enum_announcements_category" NOT NULL DEFAULT 'general',
    "body" jsonb NOT NULL,
    "published_at" timestamp(3) with time zone NOT NULL,
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

  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "announcements_id" integer;

  ALTER TABLE "payload"."_announcements_v" ADD CONSTRAINT "_announcements_v_parent_id_announcements_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."announcements"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_announcements_fk" FOREIGN KEY ("announcements_id") REFERENCES "payload"."announcements"("id") ON DELETE cascade ON UPDATE no action;

  CREATE UNIQUE INDEX "announcements_slug_idx" ON "payload"."announcements" USING btree ("slug");
  CREATE INDEX "announcements_published_at_idx" ON "payload"."announcements" USING btree ("published_at");
  CREATE INDEX "announcements_updated_at_idx" ON "payload"."announcements" USING btree ("updated_at");
  CREATE INDEX "announcements_created_at_idx" ON "payload"."announcements" USING btree ("created_at");
  CREATE INDEX "announcements__status_idx" ON "payload"."announcements" USING btree ("_status");
  CREATE INDEX "_announcements_v_parent_idx" ON "payload"."_announcements_v" USING btree ("parent_id");
  CREATE INDEX "_announcements_v_version_version_slug_idx" ON "payload"."_announcements_v" USING btree ("version_slug");
  CREATE INDEX "_announcements_v_version_version_published_at_idx" ON "payload"."_announcements_v" USING btree ("version_published_at");
  CREATE INDEX "_announcements_v_version_version__status_idx" ON "payload"."_announcements_v" USING btree ("version__status");
  CREATE INDEX "_announcements_v_created_at_idx" ON "payload"."_announcements_v" USING btree ("created_at");
  CREATE INDEX "_announcements_v_updated_at_idx" ON "payload"."_announcements_v" USING btree ("updated_at");
  CREATE INDEX "_announcements_v_latest_idx" ON "payload"."_announcements_v" USING btree ("latest");
  CREATE INDEX "_announcements_v_autosave_idx" ON "payload"."_announcements_v" USING btree ("autosave");
  CREATE INDEX "payload_locked_documents_rels_announcements_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("announcements_id");
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_announcements_fk";
  ALTER TABLE "payload"."_announcements_v" DROP CONSTRAINT "_announcements_v_parent_id_announcements_id_fk";
  DROP INDEX "payload"."payload_locked_documents_rels_announcements_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "announcements_id";
  DROP TABLE "payload"."announcements" CASCADE;
  DROP TABLE "payload"."_announcements_v" CASCADE;
  DROP TYPE "payload"."enum_announcements_category";
  DROP TYPE "payload"."enum_announcements_status";
  DROP TYPE "payload"."enum__announcements_v_version_category";
  DROP TYPE "payload"."enum__announcements_v_version_status";
  `);
}
