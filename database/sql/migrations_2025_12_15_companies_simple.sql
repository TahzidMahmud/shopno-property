-- =====================================================
-- Migration 1: Create companies table
-- File: 2025_12_15_041313_create_companies_table.php
-- =====================================================

CREATE TABLE IF NOT EXISTS `companies` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `logo` VARCHAR(255) NULL,
  `owner_name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Migration 2: Change company_name to company_id in properties table
-- File: 2025_12_15_041343_change_company_name_to_company_id_in_properties_table.php
-- =====================================================

-- Step 1: Drop the old company_name column
-- Note: If column doesn't exist, this will show an error but won't break execution
ALTER TABLE `properties` DROP COLUMN `company_name`;

-- Step 2: Add the new company_id column after bathrooms
ALTER TABLE `properties` 
ADD COLUMN `company_id` BIGINT UNSIGNED NULL AFTER `bathrooms`;

-- Step 3: Add foreign key constraint
ALTER TABLE `properties`
ADD CONSTRAINT `properties_company_id_foreign`
FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
ON DELETE SET NULL
ON UPDATE CASCADE;

