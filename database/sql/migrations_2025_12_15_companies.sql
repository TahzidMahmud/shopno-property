-- Migration 1: Create companies table
-- File: 2025_12_15_041313_create_companies_table.php

CREATE TABLE IF NOT EXISTS `companies` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `logo` VARCHAR(255) NULL,
  `owner_name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migration 2: Change company_name to company_id in properties table
-- File: 2025_12_15_041343_change_company_name_to_company_id_in_properties_table.php

-- Step 1: Drop the foreign key constraint if it exists (for safety)
-- Note: This step may fail if the foreign key doesn't exist, which is fine
SET @foreign_key_exists = (
  SELECT COUNT(*) 
  FROM information_schema.TABLE_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = DATABASE()
  AND TABLE_NAME = 'properties'
  AND CONSTRAINT_NAME = 'properties_company_id_foreign'
);

SET @sql = IF(@foreign_key_exists > 0,
  'ALTER TABLE `properties` DROP FOREIGN KEY `properties_company_id_foreign`',
  'SELECT "Foreign key does not exist, skipping drop" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 2: Drop the old company_name column
ALTER TABLE `properties` DROP COLUMN IF EXISTS `company_name`;

-- Step 3: Add the new company_id column after bathrooms
ALTER TABLE `properties` 
ADD COLUMN `company_id` BIGINT UNSIGNED NULL AFTER `bathrooms`;

-- Step 4: Add foreign key constraint
ALTER TABLE `properties`
ADD CONSTRAINT `properties_company_id_foreign`
FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
ON DELETE SET NULL
ON UPDATE CASCADE;

