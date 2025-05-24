import {
	type categories,
	type hackathons,
	type judges,
	type projects,
	type scores,
	type users
} from './server/database/schema';

import type { InferSelectModel } from 'drizzle-orm';

// Database types
export type User = InferSelectModel<typeof users>;
export type Hackathon = InferSelectModel<typeof hackathons>;
export type Category = InferSelectModel<typeof categories>;
export type Project = InferSelectModel<typeof projects>;
export type Judge = InferSelectModel<typeof judges>;
export type Score = InferSelectModel<typeof scores>;

// API types
export interface CreateHackathonInput {
	name: string;
	slug: string;
	startDate: Date;
	endDate: Date;
}

export interface CreateProjectInput {
	name: string;
	description?: string;
	teamName: string;
	tableNumber?: number;
	categoryId: string;
}

export interface CreateJudgeInput {
	email: string;
	name: string;
	categoryIds: string[];
}

export interface SubmitScoreInput {
	projectId: string;
	score: number;
	notes?: string;
}

// View types
export interface ProjectWithScores extends Project {
	scores: Score[];
	averageScore: number | null;
	totalJudges: number;
}

export interface JudgeWithCategories extends Judge {
	user: User;
	categories: Category[];
}

export interface HackathonStats {
	totalProjects: number;
	totalJudges: number;
	scoredProjects: number;
	completionPercentage: number;
}

export interface CategoryStats {
	category: Category;
	projectCount: number;
	judgedCount: number;
	averageScore: number | null;
}
