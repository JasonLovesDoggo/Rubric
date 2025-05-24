CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`hackathon_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`hackathon_id`) REFERENCES `hackathons`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `hackathons` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`organizer_id` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`organizer_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `hackathons_slug_unique` ON `hackathons` (`slug`);--> statement-breakpoint
CREATE INDEX `hackathon_slug_idx` ON `hackathons` (`slug`);--> statement-breakpoint
CREATE TABLE `judge_category_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`judge_id` text NOT NULL,
	`category_id` text NOT NULL,
	FOREIGN KEY (`judge_id`) REFERENCES `judges`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `judge_category_idx` ON `judge_category_assignments` (`judge_id`,`category_id`);--> statement-breakpoint
CREATE TABLE `judges` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`hackathon_id` text NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`hackathon_id`) REFERENCES `hackathons`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `judge_user_hackathon_idx` ON `judges` (`user_id`,`hackathon_id`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`hackathon_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`team_name` text NOT NULL,
	`table_number` integer,
	`category_id` text NOT NULL,
	`metadata` text DEFAULT '{}',
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`hackathon_id`) REFERENCES `hackathons`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `project_hackathon_idx` ON `projects` (`hackathon_id`);--> statement-breakpoint
CREATE INDEX `project_table_number_idx` ON `projects` (`table_number`);--> statement-breakpoint
CREATE TABLE `scores` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`judge_id` text NOT NULL,
	`score` real NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`judge_id`) REFERENCES `judges`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `score_project_judge_idx` ON `scores` (`project_id`,`judge_id`);--> statement-breakpoint
DROP INDEX IF EXISTS "hackathons_slug_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "hackathon_slug_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "judge_category_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "judge_user_hackathon_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "project_hackathon_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "project_table_number_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "score_project_judge_idx";--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "email_verified" TO "email_verified" integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `user` ADD `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `created_at` integer DEFAULT (current_timestamp) NOT NULL;