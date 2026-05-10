import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."homepage_domaines_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."homepage_domaines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"headline" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."homepage_domaines_pillars" ADD CONSTRAINT "homepage_domaines_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."homepage_domaines"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "homepage_domaines_pillars_order_idx" ON "payload"."homepage_domaines_pillars" USING btree ("_order");
  CREATE INDEX "homepage_domaines_pillars_parent_id_idx" ON "payload"."homepage_domaines_pillars" USING btree ("_parent_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."homepage_domaines_pillars" CASCADE;
  DROP TABLE "payload"."homepage_domaines" CASCADE;`);
}
