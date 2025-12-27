-- Migration SQL for Production Database
-- Execute these statements in order

-- ============================================
-- 1. Add is_banned column to users table
-- Migration: 2025_12_20_080615_add_is_banned_to_users_table.php
-- ============================================
ALTER TABLE `users` 
ADD COLUMN `is_banned` TINYINT(1) NOT NULL DEFAULT 0 
AFTER `email_verified_at`;

-- ============================================
-- 2. Add phone column to users table
-- Migration: 2025_12_20_091648_add_phone_to_users_table.php
-- ============================================
ALTER TABLE `users` 
ADD COLUMN `phone` VARCHAR(255) NULL 
AFTER `email`;

-- ============================================
-- 3. Make email nullable in users table
-- Migration: 2025_12_20_092110_make_email_nullable_in_users_table.php
-- ============================================
-- Step 1: Drop the unique index on email
ALTER TABLE `users` 
DROP INDEX `users_email_unique`;

-- Step 2: Make email nullable
ALTER TABLE `users` 
MODIFY COLUMN `email` VARCHAR(255) NULL;

-- Step 3: Re-add unique constraint (allows multiple NULLs in MySQL)
ALTER TABLE `users` 
ADD UNIQUE KEY `users_email_unique` (`email`);

-- ============================================
-- 4. Create permission tables
-- Migration: 2025_12_21_043050_create_permission_tables.php
-- ============================================

-- Create permissions table
CREATE TABLE `permissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `guard_name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`, `guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create roles table
CREATE TABLE `roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `guard_name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`, `guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create model_has_permissions table
CREATE TABLE `model_has_permissions` (
  `permission_id` BIGINT UNSIGNED NOT NULL,
  `model_type` VARCHAR(255) NOT NULL,
  `model_id` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`permission_id`, `model_id`, `model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`, `model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` 
    FOREIGN KEY (`permission_id`) 
    REFERENCES `permissions` (`id`) 
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create model_has_roles table
CREATE TABLE `model_has_roles` (
  `role_id` BIGINT UNSIGNED NOT NULL,
  `model_type` VARCHAR(255) NOT NULL,
  `model_id` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`role_id`, `model_id`, `model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`, `model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` 
    FOREIGN KEY (`role_id`) 
    REFERENCES `roles` (`id`) 
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create role_has_permissions table
CREATE TABLE `role_has_permissions` (
  `permission_id` BIGINT UNSIGNED NOT NULL,
  `role_id` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`permission_id`, `role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` 
    FOREIGN KEY (`permission_id`) 
    REFERENCES `permissions` (`id`) 
    ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` 
    FOREIGN KEY (`role_id`) 
    REFERENCES `roles` (`id`) 
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. Add location column to users table
-- Migration: 2025_12_22_055043_add_location_to_users_table.php
-- ============================================
ALTER TABLE `users` 
ADD COLUMN `location` VARCHAR(255) NULL 
AFTER `phone`;

