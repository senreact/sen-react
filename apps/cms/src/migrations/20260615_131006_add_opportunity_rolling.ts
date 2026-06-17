import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."opportunities" ADD COLUMN "rolling" boolean DEFAULT false;
  ALTER TABLE "payload"."_opportunities_v" ADD COLUMN "version_rolling" boolean DEFAULT false;`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."opportunities" DROP COLUMN "rolling";
  ALTER TABLE "payload"."_opportunities_v" DROP COLUMN "version_rolling";`);
}
