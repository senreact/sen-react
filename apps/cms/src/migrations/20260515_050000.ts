import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_events_event_type" AS ENUM('in-person', 'online', 'webinar');
  CREATE TYPE "payload"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__events_v_version_event_type" AS ENUM('in-person', 'online', 'webinar');
  CREATE TYPE "payload"."enum__events_v_version_status" AS ENUM('draft', 'published');

  CREATE TABLE "payload"."events" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "slug" varchar NOT NULL,
    "summary" varchar,
    "body" jsonb,
    "starts_at" timestamp(3) with time zone NOT NULL,
    "ends_at" timestamp(3) with time zone,
    "location" varchar,
    "event_type" "payload"."enum_events_event_type" NOT NULL DEFAULT 'in-person',
    "sector" varchar,
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
    "version_sector" varchar,
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

  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "events_id" integer;

  ALTER TABLE "payload"."events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;

  CREATE UNIQUE INDEX "events_slug_idx" ON "payload"."events" USING btree ("slug");
  CREATE INDEX "events_image_idx" ON "payload"."events" USING btree ("image_id");
  CREATE INDEX "events_starts_at_idx" ON "payload"."events" USING btree ("starts_at");
  CREATE INDEX "events_updated_at_idx" ON "payload"."events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "payload"."events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "payload"."events" USING btree ("_status");
  CREATE INDEX "_events_v_parent_idx" ON "payload"."_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "payload"."_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_starts_at_idx" ON "payload"."_events_v" USING btree ("version_starts_at");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "payload"."_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "payload"."_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "payload"."_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "payload"."_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "payload"."_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "payload"."_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_autosave_idx" ON "payload"."_events_v" USING btree ("autosave");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("events_id");
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_events_fk";
  ALTER TABLE "payload"."events" DROP CONSTRAINT "events_image_id_media_id_fk";
  ALTER TABLE "payload"."_events_v" DROP CONSTRAINT "_events_v_parent_id_events_id_fk";
  ALTER TABLE "payload"."_events_v" DROP CONSTRAINT "_events_v_version_image_id_media_id_fk";
  DROP INDEX "payload"."payload_locked_documents_rels_events_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "events_id";
  DROP TABLE "payload"."events" CASCADE;
  DROP TABLE "payload"."_events_v" CASCADE;
  DROP TYPE "payload"."enum_events_event_type";
  DROP TYPE "payload"."enum_events_status";
  DROP TYPE "payload"."enum__events_v_version_event_type";
  DROP TYPE "payload"."enum__events_v_version_status";
  `);
}
