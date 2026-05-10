import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
  
  ALTER TABLE "payload"."sectors_page_detail_placeholder_blocks" ADD CONSTRAINT "sectors_page_detail_placeholder_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."sectors_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "sectors_page_detail_placeholder_blocks_order_idx" ON "payload"."sectors_page_detail_placeholder_blocks" USING btree ("_order");
  CREATE INDEX "sectors_page_detail_placeholder_blocks_parent_id_idx" ON "payload"."sectors_page_detail_placeholder_blocks" USING btree ("_parent_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."sectors_page_detail_placeholder_blocks" CASCADE;
  DROP TABLE "payload"."sectors_page" CASCADE;`);
}
