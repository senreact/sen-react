import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
  
  ALTER TABLE "payload"."about_page_values_items" ADD CONSTRAINT "about_page_values_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_page_values_items_order_idx" ON "payload"."about_page_values_items" USING btree ("_order");
  CREATE INDEX "about_page_values_items_parent_id_idx" ON "payload"."about_page_values_items" USING btree ("_parent_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."about_page_values_items" CASCADE;
  DROP TABLE "payload"."about_page" CASCADE;`);
}
