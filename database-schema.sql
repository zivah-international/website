-- Database Schema Creation for Zivah International
-- MySQL compatible version
-- This script creates the database schema (tables, indexes, constraints)
-- Run this script to set up the database structure

-- Create database if it doesn't exist
-- CREATE DATABASE IF NOT EXISTS zivah_international CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE zivah_international;

-- Create tables
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS measure_families (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS currencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(3) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(5),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS measures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    short_name VARCHAR(20) NOT NULL,
    symbol VARCHAR(10),
    type ENUM('WEIGHT', 'VOLUME', 'LENGTH', 'AREA', 'QUANTITY', 'CONTAINER') NOT NULL,
    family_id INT,
    base_unit VARCHAR(20),
    conversion_factor DECIMAL(15,6),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES measure_families(id)
);

CREATE TABLE IF NOT EXISTS countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(3) UNIQUE NOT NULL,
    icon VARCHAR(10),
    continent VARCHAR(50) NOT NULL,
    currency_id INT,
    calling_code VARCHAR(10),
    phone_format VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (currency_id) REFERENCES currencies(id)
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    country_id INT,
    role ENUM('ADMIN', 'SALES_MANAGER', 'SALES_REP', 'CUSTOMER_SERVICE', 'VIEWER') DEFAULT 'VIEWER',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    login_count INT DEFAULT 0,
    avatar VARCHAR(500),
    phone VARCHAR(50),
    department VARCHAR(100),
    company VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id)
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id INT,
    description TEXT,
    short_description TEXT,
    sku VARCHAR(100) UNIQUE,
    specifications JSON,
    stock_quantity INT DEFAULT 0,
    min_order_qty INT DEFAULT 1,
    image_url VARCHAR(500),
    image_gallery JSON,
    origin VARCHAR(100) DEFAULT 'Ecuador',
    harvest_season VARCHAR(100),
    certifications JSON,
    nutritional_info JSON,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    seo_title VARCHAR(255),
    seo_description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    measure_id INT,
    code VARCHAR(50) UNIQUE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (measure_id) REFERENCES measures(id)
);

CREATE TABLE IF NOT EXISTS product_variants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(50) UNIQUE,
    price DECIMAL(10,2),
    stock_qty INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    attributes JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    company VARCHAR(255),
    country_id INT,
    shipping_address JSON,
    message TEXT,
    status ENUM('PENDING', 'REVIEWED', 'QUOTED', 'APPROVED', 'REJECTED', 'EXPIRED') DEFAULT 'PENDING',
    priority ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT') DEFAULT 'NORMAL',
    total_amount DECIMAL(12,2),
    currency_id INT,
    valid_until TIMESTAMP NULL,
    email_status VARCHAR(255) DEFAULT 'pending',
    email_sent_at TIMESTAMP NULL,
    admin_notes TEXT,
    internal_notes TEXT,
    user_id INT,
    assigned_to_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id),
    FOREIGN KEY (currency_id) REFERENCES currencies(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (assigned_to_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS quote_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    notes TEXT,
    specifications JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    measure_id INT,
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (measure_id) REFERENCES measures(id)
);

CREATE TABLE IF NOT EXISTS quote_communications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id INT NOT NULL,
    user_id INT,
    type ENUM('NOTE', 'EMAIL', 'PHONE_CALL', 'MEETING', 'DOCUMENT') DEFAULT 'NOTE',
    subject VARCHAR(255),
    message TEXT NOT NULL,
    attachments JSON,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('TEXT', 'NUMBER', 'BOOLEAN', 'JSON', 'FILE') DEFAULT 'TEXT',
    category VARCHAR(50),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    validation_rules JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT
);

CREATE TABLE IF NOT EXISTS pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt VARCHAR(500),
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    language VARCHAR(2) DEFAULT 'es',
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    template VARCHAR(50),
    featured_image VARCHAR(500),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    details JSON,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    country_id INT,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    type ENUM('GENERAL', 'SALES', 'SUPPORT', 'PARTNERSHIP', 'COMPLAINT') DEFAULT 'GENERAL',
    source VARCHAR(50),
    status ENUM('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') DEFAULT 'NEW',
    priority ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT') DEFAULT 'NORMAL',
    assigned_to INT,
    notes TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id)
);

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    language VARCHAR(2) DEFAULT 'es',
    interests JSON,
    is_active BOOLEAN DEFAULT TRUE,
    confirmed_at TIMESTAMP NULL,
    unsubscribed_at TIMESTAMP NULL,
    source VARCHAR(50),
    ip_address VARCHAR(45),
    preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id INT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INT,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    UNIQUE KEY unique_provider_account (provider, provider_account_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_token TEXT UNIQUE NOT NULL,
    user_id INT NOT NULL,
    expires TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMP NOT NULL,
    PRIMARY KEY (identifier(255), token(255))
);

CREATE TABLE IF NOT EXISTS product_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    measure_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    effective_date DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_product_measure (product_id, measure_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (measure_id) REFERENCES measures(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS measure_compatibility (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_measure_id INT NOT NULL,
    to_measure_id INT NOT NULL,
    conversion_factor DECIMAL(15,6),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_from_to_measure (from_measure_id, to_measure_id),
    FOREIGN KEY (from_measure_id) REFERENCES measures(id) ON DELETE CASCADE,
    FOREIGN KEY (to_measure_id) REFERENCES measures(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_categories_active_sort ON categories(is_active, sort_order);
CREATE INDEX idx_measure_families_active_sort ON measure_families(is_active, sort_order);
CREATE INDEX idx_currencies_active_sort ON currencies(is_active, sort_order);
CREATE INDEX idx_measures_type ON measures(type);
CREATE INDEX idx_measures_family ON measures(family_id);
CREATE INDEX idx_measures_active_sort ON measures(is_active, sort_order);
CREATE INDEX idx_countries_code ON countries(code);
CREATE INDEX idx_countries_name ON countries(name);
CREATE INDEX idx_countries_active ON countries(is_active);
CREATE INDEX idx_countries_currency ON countries(currency_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_country ON users(country_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_measure ON products(measure_id);
CREATE INDEX idx_products_active_featured ON products(is_active, is_featured);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_code ON products(code);
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_quotes_status_priority ON quotes(status, priority);
CREATE INDEX idx_quotes_customer_email ON quotes(customer_email);
CREATE INDEX idx_quotes_created ON quotes(created_at);
CREATE INDEX idx_quotes_country ON quotes(country_id);
CREATE INDEX idx_quotes_currency ON quotes(currency_id);
CREATE INDEX idx_quotes_email_status ON quotes(email_status);
CREATE INDEX idx_quote_items_quote ON quote_items(quote_id);
CREATE INDEX idx_quote_items_product ON quote_items(product_id);
CREATE INDEX idx_quote_items_measure ON quote_items(measure_id);
CREATE INDEX idx_quote_communications_quote ON quote_communications(quote_id);
CREATE INDEX idx_quote_communications_created ON quote_communications(created_at);
CREATE INDEX idx_site_settings_category ON site_settings(category);
CREATE INDEX idx_site_settings_public ON site_settings(is_public);
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_language ON pages(language);
CREATE INDEX idx_pages_published ON pages(is_published);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_type ON contact_submissions(type);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at);
CREATE INDEX idx_contact_submissions_country ON contact_submissions(country_id);
CREATE INDEX idx_newsletter_active ON newsletter_subscriptions(is_active);
CREATE INDEX idx_newsletter_language ON newsletter_subscriptions(language);
CREATE INDEX idx_product_prices_product_measure ON product_prices(product_id, measure_id);
CREATE INDEX idx_product_prices_active ON product_prices(is_active);
CREATE INDEX idx_measure_compatibility_from_to ON measure_compatibility(from_measure_id, to_measure_id);