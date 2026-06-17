import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."page_heroes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"accueil_id" integer,
  	"secteurs_id" integer,
  	"opportunites_id" integer,
  	"annuaire_id" integer,
  	"actualites_id" integer,
  	"publications_id" integer,
  	"evenements_id" integer,
  	"ressources_id" integer,
  	"formations_id" integer,
  	"partenaires_id" integer,
  	"videos_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."page_heroes" ADD CONSTRAINT "page_heroes_accueil_id_media_id_fk" FOREIGN KEY ("accueil_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."page_heroes" ADD CONSTRAINT "page_heroes_secteurs_id_media_id_fk" FOREIGN KEY ("secteurs_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."page_heroes" ADD CONSTRAINT "page_heroes_opportunites_id_media_id_fk" FOREIGN KEY ("opportunites_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."page_heroes" ADD CONSTRAINT "page_heroes_annuaire_id_media_id_fk" FOREIGN KEY ("annuaire_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."page_heroes" ADD CONSTRAINT "page_heroes_actualites_id_media_id_fk" FOREIGN KEY ("actualites_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."page_heroes" ADD CONSTRAINT "page_heroes_publications_id_media_id_fk" FOREIGN KEY ("publications_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."page_heroes" ADD CONSTRAINT "page_heroes_evenements_id_media_id_fk" FOREIGN KEY ("evenements_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."page_heroes" ADD CONSTRAINT "page_heroes_ressources_id_media_id_fk" FOREIGN KEY ("ressources_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."page_heroes" ADD CONSTRAINT "page_heroes_formations_id_media_id_fk" FOREIGN KEY ("formations_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."page_heroes" ADD CONSTRAINT "page_heroes_partenaires_id_media_id_fk" FOREIGN KEY ("partenaires_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."page_heroes" ADD CONSTRAINT "page_heroes_videos_id_media_id_fk" FOREIGN KEY ("videos_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "page_heroes_accueil_idx" ON "payload"."page_heroes" USING btree ("accueil_id");
  CREATE INDEX "page_heroes_secteurs_idx" ON "payload"."page_heroes" USING btree ("secteurs_id");
  CREATE INDEX "page_heroes_opportunites_idx" ON "payload"."page_heroes" USING btree ("opportunites_id");
  CREATE INDEX "page_heroes_annuaire_idx" ON "payload"."page_heroes" USING btree ("annuaire_id");
  CREATE INDEX "page_heroes_actualites_idx" ON "payload"."page_heroes" USING btree ("actualites_id");
  CREATE INDEX "page_heroes_publications_idx" ON "payload"."page_heroes" USING btree ("publications_id");
  CREATE INDEX "page_heroes_evenements_idx" ON "payload"."page_heroes" USING btree ("evenements_id");
  CREATE INDEX "page_heroes_ressources_idx" ON "payload"."page_heroes" USING btree ("ressources_id");
  CREATE INDEX "page_heroes_formations_idx" ON "payload"."page_heroes" USING btree ("formations_id");
  CREATE INDEX "page_heroes_partenaires_idx" ON "payload"."page_heroes" USING btree ("partenaires_id");
  CREATE INDEX "page_heroes_videos_idx" ON "payload"."page_heroes" USING btree ("videos_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."page_heroes" CASCADE;`);
}
