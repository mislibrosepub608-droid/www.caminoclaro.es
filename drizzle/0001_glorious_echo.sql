CREATE TABLE `accommodations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('albergue','hostal','hotel','pension','otro') NOT NULL,
	`location` varchar(255) NOT NULL,
	`stage` varchar(255),
	`pricePerNight` int,
	`description` text,
	`services` text,
	`website` varchar(255),
	`phone` varchar(20),
	`email` varchar(255),
	`latitude` varchar(50),
	`longitude` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accommodations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blogArticles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`excerpt` varchar(500),
	`author` varchar(255),
	`stage` varchar(255),
	`accommodationType` varchar(100),
	`coverImage` varchar(255),
	`published` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blogArticles_id` PRIMARY KEY(`id`),
	CONSTRAINT `blogArticles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `stages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stageNumber` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`startPoint` varchar(255) NOT NULL,
	`endPoint` varchar(255) NOT NULL,
	`distanceKm` int NOT NULL,
	`difficulty` enum('1','2','3','4','5') NOT NULL,
	`elevation` int,
	`description` text,
	`region` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userConsultations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20),
	`serviceType` enum('orientation_consultation','stage_planning','accommodation_search','complete_management','general_inquiry') NOT NULL,
	`description` text,
	`status` enum('new','read','responded','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userConsultations_id` PRIMARY KEY(`id`)
);
