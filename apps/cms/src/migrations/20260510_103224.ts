import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
  
  ALTER TABLE "payload"."contact_page_channel_guide" ADD CONSTRAINT "contact_page_channel_guide_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "contact_page_channel_guide_order_idx" ON "payload"."contact_page_channel_guide" USING btree ("_order");
  CREATE INDEX "contact_page_channel_guide_parent_id_idx" ON "payload"."contact_page_channel_guide" USING btree ("_parent_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."contact_page_channel_guide" CASCADE;
  DROP TABLE "payload"."contact_page" CASCADE;`);
}
