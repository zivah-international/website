-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `icon` VARCHAR(50) NULL,
    `color` VARCHAR(7) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `categories_slug_key`(`slug`),
    INDEX `categories_is_active_sort_order_idx`(`is_active`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `category_id` INTEGER NULL,
    `description` TEXT NULL,
    `short_description` TEXT NULL,
    `sku` VARCHAR(100) NULL,
    `specifications` JSON NULL,
    `stock_quantity` INTEGER NOT NULL DEFAULT 0,
    `min_order_qty` INTEGER NULL DEFAULT 1,
    `image_url` VARCHAR(500) NULL,
    `image_gallery` JSON NULL,
    `origin` VARCHAR(100) NOT NULL DEFAULT 'Ecuador',
    `harvest_season` VARCHAR(100) NULL,
    `certifications` JSON NULL,
    `nutritional_info` JSON NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `seo_title` VARCHAR(255) NULL,
    `seo_description` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `measure_id` INTEGER NULL,
    `code` VARCHAR(50) NULL,

    UNIQUE INDEX `products_slug_key`(`slug`),
    UNIQUE INDEX `products_sku_key`(`sku`),
    UNIQUE INDEX `products_code_key`(`code`),
    INDEX `products_category_id_idx`(`category_id`),
    INDEX `products_measure_id_idx`(`measure_id`),
    INDEX `products_is_active_is_featured_idx`(`is_active`, `is_featured`),
    INDEX `products_slug_idx`(`slug`),
    INDEX `products_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_variants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `sku` VARCHAR(50) NULL,
    `price` DECIMAL(10, 2) NULL,
    `stock_qty` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `attributes` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `product_variants_sku_key`(`sku`),
    INDEX `product_variants_product_id_idx`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measure_families` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `description` TEXT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `measure_families_name_key`(`name`),
    UNIQUE INDEX `measure_families_code_key`(`code`),
    INDEX `measure_families_is_active_sort_order_idx`(`is_active`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `currencies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(3) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `symbol` VARCHAR(5) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `currencies_code_key`(`code`),
    INDEX `currencies_is_active_sort_order_idx`(`is_active`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `shortName` VARCHAR(20) NOT NULL,
    `symbol` VARCHAR(10) NULL,
    `type` ENUM('WEIGHT', 'VOLUME', 'LENGTH', 'AREA', 'QUANTITY', 'CONTAINER') NOT NULL,
    `family_id` INTEGER NULL,
    `baseUnit` VARCHAR(20) NULL,
    `conversionFactor` DECIMAL(15, 6) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `measures_name_key`(`name`),
    INDEX `measures_type_idx`(`type`),
    INDEX `measures_family_id_idx`(`family_id`),
    INDEX `measures_is_active_sort_order_idx`(`is_active`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quotes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quote_number` VARCHAR(20) NOT NULL,
    `customer_name` VARCHAR(255) NOT NULL,
    `customer_email` VARCHAR(255) NOT NULL,
    `customer_phone` VARCHAR(50) NULL,
    `company` VARCHAR(255) NULL,
    `country_id` INTEGER NULL,
    `shipping_address` JSON NULL,
    `message` TEXT NULL,
    `status` ENUM('PENDING', 'REVIEWED', 'QUOTED', 'APPROVED', 'REJECTED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    `priority` ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT') NOT NULL DEFAULT 'NORMAL',
    `total_amount` DECIMAL(12, 2) NULL,
    `currency_id` INTEGER NULL,
    `valid_until` DATETIME(3) NULL,
    `email_status` VARCHAR(191) NULL DEFAULT 'pending',
    `email_sent_at` DATETIME(3) NULL,
    `admin_notes` TEXT NULL,
    `internal_notes` TEXT NULL,
    `user_id` INTEGER NULL,
    `assigned_to_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `quotes_quote_number_key`(`quote_number`),
    INDEX `quotes_status_priority_idx`(`status`, `priority`),
    INDEX `quotes_customer_email_idx`(`customer_email`),
    INDEX `quotes_created_at_idx`(`created_at`),
    INDEX `quotes_country_id_idx`(`country_id`),
    INDEX `quotes_currency_id_idx`(`currency_id`),
    INDEX `quotes_email_status_idx`(`email_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quote_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quote_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `total_price` DECIMAL(12, 2) NOT NULL,
    `notes` TEXT NULL,
    `specifications` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `measure_id` INTEGER NULL,

    INDEX `quote_items_quote_id_idx`(`quote_id`),
    INDEX `quote_items_product_id_idx`(`product_id`),
    INDEX `quote_items_measure_id_idx`(`measure_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quote_communications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quote_id` INTEGER NOT NULL,
    `user_id` INTEGER NULL,
    `type` ENUM('NOTE', 'EMAIL', 'PHONE_CALL', 'MEETING', 'DOCUMENT') NOT NULL DEFAULT 'NOTE',
    `subject` VARCHAR(255) NULL,
    `message` TEXT NOT NULL,
    `attachments` JSON NULL,
    `is_internal` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `quote_communications_quote_id_idx`(`quote_id`),
    INDEX `quote_communications_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255) NULL,
    `country_id` INTEGER NULL,
    `role` ENUM('ADMIN', 'SALES_MANAGER', 'SALES_REP', 'CUSTOMER_SERVICE', 'VIEWER') NOT NULL DEFAULT 'VIEWER',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `last_login` DATETIME(3) NULL,
    `login_count` INTEGER NOT NULL DEFAULT 0,
    `avatar` VARCHAR(500) NULL,
    `phone` VARCHAR(50) NULL,
    `department` VARCHAR(100) NULL,
    `company` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_role_idx`(`role`),
    INDEX `users_is_active_idx`(`is_active`),
    INDEX `users_country_id_idx`(`country_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `countries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `code` VARCHAR(3) NOT NULL,
    `icon` VARCHAR(10) NULL,
    `continent` VARCHAR(50) NOT NULL,
    `currency_id` INTEGER NULL,
    `callingCode` VARCHAR(10) NULL,
    `phoneFormat` VARCHAR(50) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `countries_name_key`(`name`),
    UNIQUE INDEX `countries_code_key`(`code`),
    INDEX `countries_code_idx`(`code`),
    INDEX `countries_name_idx`(`name`),
    INDEX `countries_is_active_idx`(`is_active`),
    INDEX `countries_currency_id_idx`(`currency_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `setting_key` VARCHAR(100) NOT NULL,
    `setting_value` TEXT NULL,
    `setting_type` ENUM('TEXT', 'NUMBER', 'BOOLEAN', 'JSON', 'FILE') NOT NULL DEFAULT 'TEXT',
    `category` VARCHAR(50) NULL,
    `description` TEXT NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT false,
    `validation_rules` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `updated_by` INTEGER NULL,

    UNIQUE INDEX `site_settings_setting_key_key`(`setting_key`),
    INDEX `site_settings_category_idx`(`category`),
    INDEX `site_settings_is_public_idx`(`is_public`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `excerpt` VARCHAR(500) NULL,
    `meta_title` VARCHAR(255) NULL,
    `meta_description` VARCHAR(500) NULL,
    `language` VARCHAR(2) NOT NULL DEFAULT 'es',
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `published_at` DATETIME(3) NULL,
    `template` VARCHAR(50) NULL,
    `featured_image` VARCHAR(500) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `pages_slug_key`(`slug`),
    INDEX `pages_slug_idx`(`slug`),
    INDEX `pages_language_idx`(`language`),
    INDEX `pages_is_published_idx`(`is_published`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `action` VARCHAR(100) NOT NULL,
    `entity_type` VARCHAR(50) NULL,
    `entity_id` INTEGER NULL,
    `details` JSON NULL,
    `old_values` JSON NULL,
    `new_values` JSON NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `activity_logs_user_id_idx`(`user_id`),
    INDEX `activity_logs_entity_type_entity_id_idx`(`entity_type`, `entity_id`),
    INDEX `activity_logs_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_submissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) NULL,
    `company` VARCHAR(255) NULL,
    `country_id` INTEGER NULL,
    `subject` VARCHAR(255) NULL,
    `message` TEXT NOT NULL,
    `type` ENUM('GENERAL', 'SALES', 'SUPPORT', 'PARTNERSHIP', 'COMPLAINT') NOT NULL DEFAULT 'GENERAL',
    `source` VARCHAR(50) NULL,
    `status` ENUM('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'NEW',
    `priority` ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT') NOT NULL DEFAULT 'NORMAL',
    `assigned_to` INTEGER NULL,
    `notes` TEXT NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `contact_submissions_email_idx`(`email`),
    INDEX `contact_submissions_status_idx`(`status`),
    INDEX `contact_submissions_type_idx`(`type`),
    INDEX `contact_submissions_created_at_idx`(`created_at`),
    INDEX `contact_submissions_country_id_idx`(`country_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `newsletter_subscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,
    `language` VARCHAR(2) NOT NULL DEFAULT 'es',
    `interests` JSON NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `confirmed_at` DATETIME(3) NULL,
    `unsubscribed_at` DATETIME(3) NULL,
    `source` VARCHAR(50) NULL,
    `ip_address` VARCHAR(45) NULL,
    `preferences` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `newsletter_subscriptions_email_key`(`email`),
    INDEX `newsletter_subscriptions_is_active_idx`(`is_active`),
    INDEX `newsletter_subscriptions_language_idx`(`language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `provider_account_id` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `accounts_provider_provider_account_id_key`(`provider`, `provider_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `session_token` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sessions_session_token_key`(`session_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification_tokens` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `verification_tokens_token_key`(`token`),
    UNIQUE INDEX `verification_tokens_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_prices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `measure_id` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `effective_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `product_prices_product_id_measure_id_idx`(`product_id`, `measure_id`),
    INDEX `product_prices_is_active_idx`(`is_active`),
    UNIQUE INDEX `product_prices_product_id_measure_id_key`(`product_id`, `measure_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measure_compatibility` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `from_measure_id` INTEGER NOT NULL,
    `to_measure_id` INTEGER NOT NULL,
    `conversion_factor` DECIMAL(15, 6) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `measure_compatibility_from_measure_id_to_measure_id_idx`(`from_measure_id`, `to_measure_id`),
    UNIQUE INDEX `measure_compatibility_from_measure_id_to_measure_id_key`(`from_measure_id`, `to_measure_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_measure_id_fkey` FOREIGN KEY (`measure_id`) REFERENCES `measures`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measures` ADD CONSTRAINT `measures_family_id_fkey` FOREIGN KEY (`family_id`) REFERENCES `measure_families`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_assigned_to_id_fkey` FOREIGN KEY (`assigned_to_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quote_items` ADD CONSTRAINT `quote_items_measure_id_fkey` FOREIGN KEY (`measure_id`) REFERENCES `measures`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quote_items` ADD CONSTRAINT `quote_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quote_items` ADD CONSTRAINT `quote_items_quote_id_fkey` FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quote_communications` ADD CONSTRAINT `quote_communications_quote_id_fkey` FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quote_communications` ADD CONSTRAINT `quote_communications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `countries` ADD CONSTRAINT `countries_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact_submissions` ADD CONSTRAINT `contact_submissions_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_prices` ADD CONSTRAINT `product_prices_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_prices` ADD CONSTRAINT `product_prices_measure_id_fkey` FOREIGN KEY (`measure_id`) REFERENCES `measures`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measure_compatibility` ADD CONSTRAINT `measure_compatibility_from_measure_id_fkey` FOREIGN KEY (`from_measure_id`) REFERENCES `measures`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measure_compatibility` ADD CONSTRAINT `measure_compatibility_to_measure_id_fkey` FOREIGN KEY (`to_measure_id`) REFERENCES `measures`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
