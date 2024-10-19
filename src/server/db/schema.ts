import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `resume_${name}`);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

//easier
export const quizzes = createTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  questions: jsonb("questions").notNull(),
});

export const questions = createTable("questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .references(() => quizzes.id)
    .notNull(),
  questionText: text("question_text").notNull(),
  explanation: text("explanation").notNull(),
});

export const options = createTable("options", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id")
    .references(() => questions.id)
    .notNull(),
  optionText: text("option_text").notNull(),
});

export const correctAnswers = createTable("correct_answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id")
    .references(() => questions.id)
    .notNull(),
  optionId: integer("option_id")
    .references(() => options.id)
    .notNull(),
});

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id],
  }),
  options: many(options),
  correctAnswer: one(correctAnswers, {
    fields: [questions.id],
    references: [correctAnswers.questionId],
  }),
}));

export const optionsRelations = relations(options, ({ one }) => ({
  question: one(questions, {
    fields: [options.questionId],
    references: [questions.id],
  }),
}));

export const correctAnswersRelations = relations(correctAnswers, ({ one }) => ({
  question: one(questions, {
    fields: [correctAnswers.questionId],
    references: [questions.id],
  }),
  option: one(options, {
    fields: [correctAnswers.optionId],
    references: [options.id],
  }),
}));
