-- Database Seed Data for Zivah International
-- MySQL compatible version
-- This script inserts initial data into the database
-- Run this script after creating the schema with database-schema.sql

-- Insert currencies
INSERT IGNORE INTO currencies (code, name, symbol, is_active, sort_order) VALUES
('USD', 'US Dollar', '$', true, 1),
('COP', 'Colombian Peso', '$', true, 2),
('PEN', 'Peruvian Sol', 'S/', true, 3),
('CLP', 'Chilean Peso', '$', true, 4),
('MXN', 'Mexican Peso', '$', true, 5),
('EUR', 'Euro', '€', true, 6),
('CNY', 'Chinese Yuan', '¥', true, 7),
('JPY', 'Japanese Yen', '¥', true, 8),
('GBP', 'British Pound', '£', true, 9),
('CAD', 'Canadian Dollar', 'C$', true, 10),
('BRL', 'Brazilian Real', 'R$', true, 11),
('ARS', 'Argentine Peso', '$', true, 12),
('KRW', 'South Korean Won', '₩', true, 13),
('AUD', 'Australian Dollar', 'A$', true, 14),
('CHF', 'Swiss Franc', 'CHF', true, 15);

-- Insert countries
INSERT IGNORE INTO countries (name, code, icon, continent, currency_id, calling_code, phone_format, is_active) VALUES
('Ecuador', 'EC', '🇪🇨', 'South America', (SELECT id FROM currencies WHERE code = 'USD'), '+593', '+593 XX XXX XXXX', true),
('United States', 'US', '🇺🇸', 'North America', (SELECT id FROM currencies WHERE code = 'USD'), '+1', '+1 (XXX) XXX-XXXX', true),
('Colombia', 'CO', '🇨🇴', 'South America', (SELECT id FROM currencies WHERE code = 'COP'), '+57', '+57 XXX XXX XXXX', true),
('Peru', 'PE', '🇵🇪', 'South America', (SELECT id FROM currencies WHERE code = 'PEN'), '+51', '+51 XXX XXX XXX', true),
('Chile', 'CL', '🇨🇱', 'South America', (SELECT id FROM currencies WHERE code = 'CLP'), '+56', '+56 X XXXX XXXX', true),
('Mexico', 'MX', '🇲🇽', 'North America', (SELECT id FROM currencies WHERE code = 'MXN'), '+52', '+52 XX XXXX XXXX', true),
('Spain', 'ES', '🇪🇸', 'Europe', (SELECT id FROM currencies WHERE code = 'EUR'), '+34', '+34 XXX XXX XXX', true),
('China', 'CN', '🇨🇳', 'Asia', (SELECT id FROM currencies WHERE code = 'CNY'), '+86', '+86 XXX XXXX XXXX', true),
('Japan', 'JP', '🇯🇵', 'Asia', (SELECT id FROM currencies WHERE code = 'JPY'), '+81', '+81 XX XXXX XXXX', true),
('Germany', 'DE', '🇩🇪', 'Europe', (SELECT id FROM currencies WHERE code = 'EUR'), '+49', '+49 XXX XXXXXXX', true),
('Italy', 'IT', '🇮🇹', 'Europe', (SELECT id FROM currencies WHERE code = 'EUR'), '+39', '+39 XXX XXX XXXX', true),
('France', 'FR', '🇫🇷', 'Europe', (SELECT id FROM currencies WHERE code = 'EUR'), '+33', '+33 X XX XX XX XX', true),
('United Kingdom', 'GB', '🇬🇧', 'Europe', (SELECT id FROM currencies WHERE code = 'GBP'), '+44', '+44 XXXX XXX XXX', true),
('Canada', 'CA', '🇨🇦', 'North America', (SELECT id FROM currencies WHERE code = 'CAD'), '+1', '+1 (XXX) XXX-XXXX', true);

-- Insert measure families
INSERT IGNORE INTO measure_families (name, code, description, is_active, sort_order) VALUES
('Weight', 'WEIGHT', 'Units for measuring weight/mass', true, 1),
('Volume', 'VOLUME', 'Units for measuring volume/capacity', true, 2),
('Count', 'COUNT', 'Units for counting items', true, 3),
('Area', 'AREA', 'Units for measuring area/surface', true, 4);

-- Insert measures
INSERT IGNORE INTO measures (name, short_name, symbol, type, family_id, base_unit, conversion_factor, is_active, sort_order, description) VALUES
('Kilogram', 'kg', 'kg', 'WEIGHT', (SELECT id FROM measure_families WHERE code = 'WEIGHT'), 'kg', 1.0, true, 1, 'Standard metric unit for weight'),
('Metric Ton', 'MT', 't', 'WEIGHT', (SELECT id FROM measure_families WHERE code = 'WEIGHT'), 'kg', 1000.0, true, 2, 'Metric ton - 1000 kilograms'),
('Pound', 'lb', 'lb', 'WEIGHT', (SELECT id FROM measure_families WHERE code = 'WEIGHT'), 'kg', 0.453592, true, 3, 'Imperial pound unit'),
('Liter', 'L', 'L', 'VOLUME', (SELECT id FROM measure_families WHERE code = 'VOLUME'), 'L', 1.0, true, 10, 'Standard metric unit for volume'),
('Cubic Meter', 'm³', 'm³', 'VOLUME', (SELECT id FROM measure_families WHERE code = 'VOLUME'), 'L', 1000.0, true, 11, 'Cubic meter - 1000 liters'),
('Gallon', 'gal', 'gal', 'VOLUME', (SELECT id FROM measure_families WHERE code = 'VOLUME'), 'L', 3.78541, true, 12, 'US gallon'),
('20ft Container', '20ft', '20"', 'CONTAINER', NULL, 'container', 1.0, true, 20, 'Standard 20-foot shipping container'),
('40ft Container', '40ft', '40"', 'CONTAINER', NULL, 'container', 1.0, true, 21, 'Standard 40-foot shipping container'),
('40ft High Cube Container', '40ft HC', '40"HC', 'CONTAINER', NULL, 'container', 1.0, true, 22, '40-foot high cube shipping container'),
('Unit', 'unit', 'u', 'QUANTITY', (SELECT id FROM measure_families WHERE code = 'COUNT'), 'unit', 1.0, true, 30, 'Single unit/item'),
('Box', 'box', 'box', 'QUANTITY', (SELECT id FROM measure_families WHERE code = 'COUNT'), 'box', 1.0, true, 31, 'Standard box packaging'),
('Case', 'case', 'case', 'QUANTITY', (SELECT id FROM measure_families WHERE code = 'COUNT'), 'case', 1.0, true, 32, 'Case packaging'),
('Pallet', 'pallet', 'plt', 'QUANTITY', (SELECT id FROM measure_families WHERE code = 'COUNT'), 'pallet', 1.0, true, 33, 'Pallet unit'),
('Hectare', 'ha', 'ha', 'AREA', (SELECT id FROM measure_families WHERE code = 'AREA'), 'ha', 1.0, true, 40, 'Hectare - 10,000 square meters'),
('Acre', 'acre', 'ac', 'AREA', (SELECT id FROM measure_families WHERE code = 'AREA'), 'ha', 0.404686, true, 41, 'Acre - imperial area unit');

-- Insert categories
INSERT IGNORE INTO categories (name, slug, description, icon, color, sort_order, is_active) VALUES
('Agrícolas', 'agricolas', 'Banano: Ecuador es uno de los mayores exportadores mundiales de banano. Cacao: El país es un importante exportador de cacao fino y de aroma, usado para la elaboración de chocolate de alta calidad. Flores: Ecuador es un gran productor de flores, especialmente rosas, y es uno de los principales exportadores mundiales de este producto. Café: El país cultiva diversas variedades de café, exportando un producto aromático y de alta demanda. Otras frutas: También se exportan otras frutas como la piña, el brócoli y los jugos y conservas de frutas.', '🌱', '#4CAF50', 1, true),
('Marinos y de la Pesca', 'marinos-y-pesca', 'Camarón: Ecuador es un líder mundial en la exportación de crustáceos, principalmente camarón y langostino. Pescado: Se exporta pescado, incluyendo atún, así como productos procesados y enlatados.', '🦐', '#2196F3', 2, true),
('Otros Productos', 'otros-productos', 'Manufacturas: Se exportan algunas manufacturas, como las de metales y los elaborados de banano. Madera: La madera es otro producto de exportación del país. Aceites y grasas: También se incluyen productos como el aceite de palma y aceites de pescado.', '📦', '#795548', 3, true);

-- Insert admin users (passwords are hashed with bcrypt, cost factor 12)
-- admin123! -> $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Le0UjL8CwFq1y0gq6
-- manager123! -> $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Le0UjL8CwFq1y0gq6
INSERT IGNORE INTO users (username, email, password, full_name, role, is_active, department, phone, company) VALUES
('admin', 'admin@zivahinternational.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Le0UjL8CwFq1y0gq6', 'Administrador ZIVAH', 'ADMIN', true, 'Administración', '+593-4-234-5678', 'ZIVAH International'),
('manager', 'manager@zivahinternational.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Le0UjL8CwFq1y0gq6', 'Gerente de Ventas', 'SALES_MANAGER', true, 'Ventas', '+593-4-234-5679', 'ZIVAH International');

-- Insert sample products
INSERT IGNORE INTO products (name, slug, code, category_id, measure_id, description, short_description, sku, specifications, stock_quantity, min_order_qty, image_url, origin, harvest_season, certifications, nutritional_info, is_active, is_featured, seo_title, seo_description) VALUES
('Banano Cavendish Premium', 'banano-cavendish-premium', 'AGR-BAN-001', (SELECT id FROM categories WHERE slug = 'agricolas'), (SELECT id FROM measures WHERE name = '40ft Container'), 'Banano Cavendish de exportación premium cultivado en la costa ecuatoriana. Ecuador es uno de los mayores exportadores mundiales de banano con excelente calidad y vida útil.', 'Banano premium de exportación con certificación internacional', 'BAN-CAV-001', '{"weight": "90-150g", "size": "16-22cm", "calibre": "38-48mm", "harvest": "Todo el año", "packaging": "Cajas de 18.14kg (11-16 manos)", "containerCapacity": "19-20 toneladas por contenedor 40ft", "features": ["Calibre: 38-48mm", "Peso promedio: 90-150g por unidad", "Longitud: 16-22cm", "Vida útil: 14-21 días", "Certificación GlobalGAP y Rainforest Alliance", "Capacidad: ~20,000kg por contenedor 40ft"]}', 150, 1, '/assets/images/products/banano-cavendish.jpg', 'Ecuador', 'Todo el año', '["GlobalGAP", "Rainforest Alliance", "HACCP", "Orgánico"]', '{"calories": 89, "protein": "1.1g", "carbs": "23g", "fiber": "2.6g", "potassium": "358mg", "vitaminC": "8.7mg"}', true, true, 'Banano Cavendish Premium Ecuador - Exportación', 'Banano premium certificado de Ecuador, líder mundial en exportación'),
('Cacao Fino de Aroma Nacional', 'cacao-fino-aroma', 'AGR-CAC-001', (SELECT id FROM categories WHERE slug = 'agricolas'), (SELECT id FROM measures WHERE name = '40ft Container'), 'Cacao Nacional ecuatoriano de fino aroma, reconocido mundialmente por su calidad superior para chocolate premium. Ecuador es líder en la exportación de cacao fino.', 'Cacao Nacional de aroma fino para chocolate premium', 'CAC-NAL-001', '{"variety": "Nacional Trinitario", "fermentation": "5-7 días", "humidity": "Máximo 7%", "grading": "Superior 85%", "packaging": "Sacos de jute 60kg", "containerCapacity": "15-16 toneladas por contenedor 40ft", "features": ["Variedad: Nacional Trinitario", "Fermentación: 5-7 días", "Humedad: Máximo 7%", "Grano superior: 85% mínimo", "Aroma floral y frutal característico", "Capacidad: ~15,000kg por contenedor 40ft"]}', 50, 1, '/assets/images/products/cacao-nacional.jpg', 'Ecuador', 'Enero - Mayo, Octubre - Diciembre', '["Orgánico", "Comercio Justo", "Rainforest Alliance", "UTZ"]', '{"calories": 228, "protein": "19.6g", "carbs": "13.9g", "fat": "13.7g", "fiber": "37g"}', true, true, 'Cacao Fino de Aroma Nacional Ecuador', 'Cacao Nacional ecuatoriano premium para chocolate fino');

-- Insert sample product prices
INSERT IGNORE INTO product_prices (product_id, measure_id, price, is_active) VALUES
((SELECT id FROM products WHERE slug = 'banano-cavendish-premium'), (SELECT id FROM measures WHERE name = 'Kilogram'), 0.85, true),
((SELECT id FROM products WHERE slug = 'banano-cavendish-premium'), (SELECT id FROM measures WHERE name = '40ft Container'), 17000.00, true),
((SELECT id FROM products WHERE slug = 'cacao-fino-aroma'), (SELECT id FROM measures WHERE name = 'Kilogram'), 4.50, true),
((SELECT id FROM products WHERE slug = 'cacao-fino-aroma'), (SELECT id FROM measures WHERE name = '40ft Container'), 67500.00, true);

-- Insert basic site settings
INSERT IGNORE INTO site_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
('site_name', 'ZIVAH International', 'TEXT', 'general', 'Nombre del sitio web', true),
('site_description', 'Exportación de productos ecuatorianos de alta calidad', 'TEXT', 'general', 'Descripción del sitio', true),
('contact_email', 'info@zivahinternational.com', 'TEXT', 'contact', 'Email de contacto principal', true),
('contact_phone', '+593-4-234-5678', 'TEXT', 'contact', 'Teléfono de contacto principal', true),
('company_address', 'Quito, Ecuador', 'TEXT', 'contact', 'Dirección de la empresa', true),
('default_currency', 'USD', 'TEXT', 'business', 'Moneda por defecto', false),
('min_order_value', '1000', 'NUMBER', 'business', 'Valor mínimo de pedido en USD', false);

-- Success message
SELECT CONCAT(
    '🌱 Database seeding completed successfully! ',
    'Created: ', (SELECT COUNT(*) FROM currencies), ' currencies, ',
    (SELECT COUNT(*) FROM countries), ' countries, ',
    (SELECT COUNT(*) FROM measure_families), ' measure families, ',
    (SELECT COUNT(*) FROM measures), ' measures, ',
    (SELECT COUNT(*) FROM categories), ' categories, ',
    (SELECT COUNT(*) FROM products), ' products, ',
    (SELECT COUNT(*) FROM users), ' users'
) AS completion_message;