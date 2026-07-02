CREATE TABLE `event_updates` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`status` text NOT NULL,
	`head` text NOT NULL,
	`body` text NOT NULL,
	`source_count_at_update` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `event_updates_event_created_idx` ON `event_updates` (`event_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`event_type` text NOT NULL,
	`category` text NOT NULL,
	`status` text NOT NULL,
	`confidence` real NOT NULL,
	`source_count` integer DEFAULT 1 NOT NULL,
	`location_label` text NOT NULL,
	`neighborhood` text DEFAULT '' NOT NULL,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`signal_trend` text DEFAULT 'steady' NOT NULL,
	`is_major` integer DEFAULT false NOT NULL,
	`first_seen_at` integer NOT NULL,
	`last_update_at` integer NOT NULL,
	`confidence_factors` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `events_category_last_update_idx` ON `events` (`category`,`last_update_at`);