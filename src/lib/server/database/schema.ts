import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// Existing auth tables
export const users = sqliteTable('user', {
	id: text('id').notNull().primaryKey(),
	email: text('email').notNull(),
	name: text('name').notNull(),
	email_verified: integer('email_verified', { mode: 'boolean' }).default(false),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(current_timestamp)`)
});

export const sessionTable = sqliteTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires_at').notNull()
});

export const emailVerificationTokenTable = sqliteTable('email_verification_token', {
	id: text('id').notNull().primaryKey(),
	user_id: text('user_id').notNull(),
	email: text('email').notNull(),
	expires_at: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const signinTable = sqliteTable('signin', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	logged_in_at: integer('logged_in_at', { mode: 'timestamp' }).notNull(),
	ip_address: text('ip_address').notNull(),
	email: text('email').notNull()
});

// Hackathon tables
export const hackathons = sqliteTable(
	'hackathons',
	{
		id: text('id').notNull().primaryKey(),
		name: text('name').notNull(),
		slug: text('slug').notNull().unique(),
		organizer_id: text('organizer_id')
			.notNull()
			.references(() => users.id),
		start_date: integer('start_date', { mode: 'timestamp' }).notNull(),
		end_date: integer('end_date', { mode: 'timestamp' }).notNull(),
		created_at: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(current_timestamp)`),
		updated_at: integer('updated_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(current_timestamp)`)
	},
	(table) => ({
		slugIdx: index('hackathon_slug_idx').on(table.slug)
	})
);

export const categories = sqliteTable('categories', {
	id: text('id').notNull().primaryKey(),
	hackathon_id: text('hackathon_id')
		.notNull()
		.references(() => hackathons.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	description: text('description'),
	sort_order: integer('sort_order').default(0).notNull(),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(current_timestamp)`)
});

export const projects = sqliteTable(
	'projects',
	{
		id: text('id').notNull().primaryKey(),
		hackathon_id: text('hackathon_id')
			.notNull()
			.references(() => hackathons.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		description: text('description'),
		team_name: text('team_name').notNull(),
		table_number: integer('table_number'),
		category_id: text('category_id')
			.notNull()
			.references(() => categories.id),
		metadata: text('metadata', { mode: 'json' }).$type<Record<string, unknown>>().default({}),
		created_at: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(current_timestamp)`),
		updated_at: integer('updated_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(current_timestamp)`)
	},
	(table) => ({
		hackathonIdx: index('project_hackathon_idx').on(table.hackathon_id),
		tableNumberIdx: index('project_table_number_idx').on(table.table_number)
	})
);

export const judges = sqliteTable(
	'judges',
	{
		id: text('id').notNull().primaryKey(),
		user_id: text('user_id')
			.notNull()
			.references(() => users.id),
		hackathon_id: text('hackathon_id')
			.notNull()
			.references(() => hackathons.id, { onDelete: 'cascade' }),
		created_at: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(current_timestamp)`)
	},
	(table) => ({
		userHackathonIdx: index('judge_user_hackathon_idx').on(table.user_id, table.hackathon_id)
	})
);

export const judgeCategoryAssignments = sqliteTable(
	'judge_category_assignments',
	{
		id: text('id').notNull().primaryKey(),
		judge_id: text('judge_id')
			.notNull()
			.references(() => judges.id, { onDelete: 'cascade' }),
		category_id: text('category_id')
			.notNull()
			.references(() => categories.id, { onDelete: 'cascade' })
	},
	(table) => ({
		judgeCategoryIdx: index('judge_category_idx').on(table.judge_id, table.category_id)
	})
);

export const scores = sqliteTable(
	'scores',
	{
		id: text('id').notNull().primaryKey(),
		project_id: text('project_id')
			.notNull()
			.references(() => projects.id, { onDelete: 'cascade' }),
		judge_id: text('judge_id')
			.notNull()
			.references(() => judges.id, { onDelete: 'cascade' }),
		score: real('score').notNull(),
		notes: text('notes'),
		created_at: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(current_timestamp)`)
	},
	(table) => ({
		projectJudgeIdx: index('score_project_judge_idx').on(table.project_id, table.judge_id)
	})
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	hackathons: many(hackathons),
	judgeRoles: many(judges),
	sessions: many(sessionTable)
}));

export const hackathonsRelations = relations(hackathons, ({ one, many }) => ({
	organizer: one(users, {
		fields: [hackathons.organizer_id],
		references: [users.id]
	}),
	categories: many(categories),
	projects: many(projects),
	judges: many(judges)
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	hackathon: one(hackathons, {
		fields: [categories.hackathon_id],
		references: [hackathons.id]
	}),
	projects: many(projects),
	judgeAssignments: many(judgeCategoryAssignments)
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
	hackathon: one(hackathons, {
		fields: [projects.hackathon_id],
		references: [hackathons.id]
	}),
	category: one(categories, {
		fields: [projects.category_id],
		references: [categories.id]
	}),
	scores: many(scores)
}));

export const judgesRelations = relations(judges, ({ one, many }) => ({
	user: one(users, {
		fields: [judges.user_id],
		references: [users.id]
	}),
	hackathon: one(hackathons, {
		fields: [judges.hackathon_id],
		references: [hackathons.id]
	}),
	categoryAssignments: many(judgeCategoryAssignments),
	scores: many(scores)
}));

export const judgeCategoryAssignmentsRelations = relations(judgeCategoryAssignments, ({ one }) => ({
	judge: one(judges, {
		fields: [judgeCategoryAssignments.judge_id],
		references: [judges.id]
	}),
	category: one(categories, {
		fields: [judgeCategoryAssignments.category_id],
		references: [categories.id]
	})
}));

export const scoresRelations = relations(scores, ({ one }) => ({
	project: one(projects, {
		fields: [scores.project_id],
		references: [projects.id]
	}),
	judge: one(judges, {
		fields: [scores.judge_id],
		references: [judges.id]
	})
}));

export const sessionRelations = relations(sessionTable, ({ one }) => ({
	user: one(users, {
		fields: [sessionTable.userId],
		references: [users.id]
	})
}));
