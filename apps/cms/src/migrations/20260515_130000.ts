import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "payload"."enum_formalisation_steps_status" AS ENUM('draft', 'published');
    CREATE TYPE "payload"."enum__formalisation_steps_v_version_status" AS ENUM('draft', 'published');

    CREATE TABLE "payload"."formalisation_steps" (
      "id" serial PRIMARY KEY NOT NULL,
      "step_number" numeric NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "summary" varchar NOT NULL,
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

    CREATE TABLE "payload"."formalisation_steps_required_documents" (
      "id" serial PRIMARY KEY NOT NULL,
      "document" varchar NOT NULL,
      "_order" integer NOT NULL,
      "parent_id" integer NOT NULL
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

    CREATE TABLE "payload"."_formalisation_steps_v_version_required_documents" (
      "id" serial PRIMARY KEY NOT NULL,
      "document" varchar NOT NULL,
      "_order" integer NOT NULL,
      "parent_id" integer NOT NULL
    );

    ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "formalisation_steps_id" integer;

    ALTER TABLE "payload"."formalisation_steps_required_documents" ADD CONSTRAINT "formalisation_steps_required_documents_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."formalisation_steps"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload"."_formalisation_steps_v" ADD CONSTRAINT "_formalisation_steps_v_parent_id_formalisation_steps_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."formalisation_steps"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload"."_formalisation_steps_v_version_required_documents" ADD CONSTRAINT "_formalisation_steps_v_version_required_documents_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_formalisation_steps_v"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_formalisation_steps_fk" FOREIGN KEY ("formalisation_steps_id") REFERENCES "payload"."formalisation_steps"("id") ON DELETE cascade ON UPDATE no action;

    CREATE UNIQUE INDEX "formalisation_steps_slug_idx" ON "payload"."formalisation_steps" USING btree ("slug");
    CREATE INDEX "formalisation_steps_step_number_idx" ON "payload"."formalisation_steps" USING btree ("step_number");
    CREATE INDEX "formalisation_steps_updated_at_idx" ON "payload"."formalisation_steps" USING btree ("updated_at");
    CREATE INDEX "formalisation_steps_created_at_idx" ON "payload"."formalisation_steps" USING btree ("created_at");
    CREATE INDEX "formalisation_steps_required_docs_order_idx" ON "payload"."formalisation_steps_required_documents" USING btree ("_order");
    CREATE INDEX "formalisation_steps_required_docs_parent_idx" ON "payload"."formalisation_steps_required_documents" USING btree ("parent_id");
    CREATE INDEX "_formalisation_steps_v_parent_idx" ON "payload"."_formalisation_steps_v" USING btree ("parent_id");
    CREATE INDEX "_formalisation_steps_v_version_updated_at_idx" ON "payload"."_formalisation_steps_v" USING btree ("version_updated_at");
    CREATE INDEX "_formalisation_steps_v_version_created_at_idx" ON "payload"."_formalisation_steps_v" USING btree ("version_created_at");
    CREATE INDEX "_formalisation_steps_v_latest_idx" ON "payload"."_formalisation_steps_v" USING btree ("latest");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_formalisation_steps_fk";
    ALTER TABLE "payload"."formalisation_steps_required_documents" DROP CONSTRAINT IF EXISTS "formalisation_steps_required_documents_parent_id_fk";
    ALTER TABLE "payload"."_formalisation_steps_v" DROP CONSTRAINT IF EXISTS "_formalisation_steps_v_parent_id_formalisation_steps_id_fk";
    ALTER TABLE "payload"."_formalisation_steps_v_version_required_documents" DROP CONSTRAINT IF EXISTS "_formalisation_steps_v_version_required_documents_parent_id_fk";
    ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "formalisation_steps_id";
    DROP TABLE IF EXISTS "payload"."_formalisation_steps_v_version_required_documents";
    DROP TABLE IF EXISTS "payload"."_formalisation_steps_v";
    DROP TABLE IF EXISTS "payload"."formalisation_steps_required_documents";
    DROP TABLE IF EXISTS "payload"."formalisation_steps";
    DROP TYPE IF EXISTS "payload"."enum_formalisation_steps_status";
    DROP TYPE IF EXISTS "payload"."enum__formalisation_steps_v_version_status";
  `);
}
