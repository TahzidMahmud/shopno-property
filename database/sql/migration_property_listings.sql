-- Migration SQL for Production Database
-- Create property_listings table
-- Migration: 2025_12_27_062610_create_property_listings_table.php

-- ============================================
-- Create property_listings table
-- ============================================
CREATE TABLE `property_listings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `property_name` VARCHAR(255) NOT NULL,
  `property_type` VARCHAR(255) NULL,
  `property_status` VARCHAR(255) NULL,
  `location` VARCHAR(255) NOT NULL,
  `size` VARCHAR(255) NULL,
  `images` JSON NULL,
  `brochure` VARCHAR(255) NULL,
  `handover_date` DATE NULL,
  `price` DECIMAL(15, 2) NULL,
  `user_id` BIGINT UNSIGNED NULL,
  `status` VARCHAR(255) NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `property_listings_user_id_foreign` (`user_id`),
  CONSTRAINT `property_listings_user_id_foreign` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

