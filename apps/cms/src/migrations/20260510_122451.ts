import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
  
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "opportunities_id" integer;
  ALTER TABLE "payload"."_opportunities_v" ADD CONSTRAINT "_opportunities_v_parent_id_opportunities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."opportunities"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_opportunities_fk" FOREIGN KEY ("opportunities_id") REFERENCES "payload"."opportunities"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_opportunities_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("opportunities_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."opportunities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_opportunities_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."opportunities" CASCADE;
  DROP TABLE "payload"."_opportunities_v" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_opportunities_fk";
  
  DROP INDEX "payload"."payload_locked_documents_rels_opportunities_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "opportunities_id";
  DROP TYPE "payload"."enum_opportunities_sector";
  DROP TYPE "payload"."enum_opportunities_opportunity_type";
  DROP TYPE "payload"."enum_opportunities_area";
  DROP TYPE "payload"."enum_opportunities_amount_currency";
  DROP TYPE "payload"."enum_opportunities_status";
  DROP TYPE "payload"."enum__opportunities_v_version_sector";
  DROP TYPE "payload"."enum__opportunities_v_version_opportunity_type";
  DROP TYPE "payload"."enum__opportunities_v_version_area";
  DROP TYPE "payload"."enum__opportunities_v_version_amount_currency";
  DROP TYPE "payload"."enum__opportunities_v_version_status";`);
}
