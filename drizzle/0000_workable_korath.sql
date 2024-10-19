CREATE TABLE IF NOT EXISTS "resume_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "resume_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resume_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resume_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resume_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resume_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "resume_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume_account" ADD CONSTRAINT "resume_account_user_id_resume_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."resume_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume_post" ADD CONSTRAINT "resume_post_created_by_resume_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."resume_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume_session" ADD CONSTRAINT "resume_session_user_id_resume_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."resume_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "resume_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_by_idx" ON "resume_post" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "resume_post" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "resume_session" USING btree ("user_id");