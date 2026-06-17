import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."publications" ADD COLUMN "body" jsonb;
  ALTER TABLE "payload"."_publications_v" ADD COLUMN "version_body" jsonb;`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."publications" DROP COLUMN "body";
  ALTER TABLE "payload"."_publications_v" DROP COLUMN "version_body";`);
}
