-- =====================================================
-- Production SQL Queries for Recent Migrations
-- =====================================================
-- Run these queries in order on your production database
-- =====================================================

-- =====================================================
-- Migration 1: Add demo_video_thumbnail to properties table
-- File: 2025_12_11_084754_add_demo_video_thumbnail_to_properties_table.php
-- =====================================================
ALTER TABLE `properties` 
ADD COLUMN `demo_video_thumbnail` VARCHAR(255) NULL 
AFTER `demo_video`;

-- =====================================================
-- Migration 2: Add video fields to why_choose_us_features table
-- File: 2025_12_11_101602_add_video_fields_to_why_choose_us_features_table.php
-- =====================================================
ALTER TABLE `why_choose_us_features` 
ADD COLUMN `video_url` VARCHAR(255) NULL 
AFTER `description`,
ADD COLUMN `video_thumbnail` VARCHAR(255) NULL 
AFTER `video_url`;

-- =====================================================
-- Migration 3: Add brochure and payment_schedule to properties table
-- File: 2025_12_11_221417_add_brochure_and_payment_schedule_to_properties_table.php
-- =====================================================
ALTER TABLE `properties` 
ADD COLUMN `brochure` VARCHAR(255) NULL 
AFTER `demo_video_thumbnail`,
ADD COLUMN `payment_schedule` VARCHAR(255) NULL 
AFTER `brochure`;

-- =====================================================
-- Migration 4: Create partner_submissions table
-- File: 2025_12_11_223236_create_partner_submissions_table.php
-- =====================================================
CREATE TABLE IF NOT EXISTS `partner_submissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(255) NOT NULL,
  `company_name` VARCHAR(255) NULL,
  `location` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL,
  `project_details` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- End of Migration Queries
-- =====================================================


