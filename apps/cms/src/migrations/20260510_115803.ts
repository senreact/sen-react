import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."auth_strings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"signin_page_title" varchar NOT NULL,
  	"signin_lead_paragraph" varchar NOT NULL,
  	"signin_submit_label" varchar NOT NULL,
  	"signin_signup_prompt" varchar NOT NULL,
  	"signin_signup_link" varchar NOT NULL,
  	"signup_page_title" varchar NOT NULL,
  	"signup_lead_paragraph" varchar NOT NULL,
  	"signup_submit_label" varchar NOT NULL,
  	"signup_password_hint" varchar NOT NULL,
  	"signup_signin_prompt" varchar NOT NULL,
  	"signup_signin_link" varchar NOT NULL,
  	"form_email_label" varchar NOT NULL,
  	"form_password_label" varchar NOT NULL,
  	"form_pending_label" varchar NOT NULL,
  	"errors_signin_failed" varchar NOT NULL,
  	"errors_signup_failed" varchar NOT NULL,
  	"errors_signup_success" varchar NOT NULL,
  	"errors_validation_failed" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."auth_strings" CASCADE;`);
}
