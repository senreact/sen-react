import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."empty_states_homepage_latest_news_fallback" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"excerpt" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."empty_states" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"news_title" varchar NOT NULL,
  	"news_description" varchar NOT NULL,
  	"publications_title" varchar NOT NULL,
  	"publications_description" varchar NOT NULL,
  	"videos_title" varchar NOT NULL,
  	"videos_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."empty_states_homepage_latest_news_fallback" ADD CONSTRAINT "empty_states_homepage_latest_news_fallback_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."empty_states"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "empty_states_homepage_latest_news_fallback_order_idx" ON "payload"."empty_states_homepage_latest_news_fallback" USING btree ("_order");
  CREATE INDEX "empty_states_homepage_latest_news_fallback_parent_id_idx" ON "payload"."empty_states_homepage_latest_news_fallback" USING btree ("_parent_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."empty_states_homepage_latest_news_fallback" CASCADE;
  DROP TABLE "payload"."empty_states" CASCADE;`);
}
