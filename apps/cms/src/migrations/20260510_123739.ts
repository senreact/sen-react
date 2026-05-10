import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."empty_states" ADD COLUMN "opportunities_title" varchar NOT NULL;
  ALTER TABLE "payload"."empty_states" ADD COLUMN "opportunities_description" varchar NOT NULL;
  ALTER TABLE "payload"."empty_states" ADD COLUMN "opportunities_no_match_title" varchar NOT NULL;
  ALTER TABLE "payload"."empty_states" ADD COLUMN "opportunities_no_match_description" varchar NOT NULL;`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."empty_states" DROP COLUMN "opportunities_title";
  ALTER TABLE "payload"."empty_states" DROP COLUMN "opportunities_description";
  ALTER TABLE "payload"."empty_states" DROP COLUMN "opportunities_no_match_title";
  ALTER TABLE "payload"."empty_states" DROP COLUMN "opportunities_no_match_description";`);
}
