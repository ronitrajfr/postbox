CREATE TABLE IF NOT EXISTS "resume_correct_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"option_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resume_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"option_text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resume_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"quiz_id" integer NOT NULL,
	"question_text" text NOT NULL,
	"explanation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resume_quizzes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume_correct_answers" ADD CONSTRAINT "resume_correct_answers_question_id_resume_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."resume_questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume_correct_answers" ADD CONSTRAINT "resume_correct_answers_option_id_resume_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."resume_options"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume_options" ADD CONSTRAINT "resume_options_question_id_resume_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."resume_questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume_questions" ADD CONSTRAINT "resume_questions_quiz_id_resume_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."resume_quizzes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
