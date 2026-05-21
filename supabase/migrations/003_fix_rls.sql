-- =============================================
-- ZIVAH International - Fix RLS (re-enable after cleanup)
-- Run this in Supabase SQL Editor to resolve Security Advisor errors
-- =============================================

-- =============================================
-- Re-enable RLS on all tables from 002_rls_policies.sql
-- =============================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measure_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measure_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Enable RLS on tables missing from 002
-- =============================================

-- category_translations: readable by public, managed by admins
ALTER TABLE public.category_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view category translations"
  ON public.category_translations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authorized users can manage category translations"
  ON public.category_translations FOR ALL
  TO authenticated
  USING (public.authorize('categories.edit'))
  WITH CHECK (public.authorize('categories.edit'));

-- _prisma_migrations: internal table, only service_role should access it
ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;

-- Deny all access via anon/authenticated roles (service_role bypasses RLS)
CREATE POLICY "No public access to prisma migrations"
  ON public._prisma_migrations FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- =============================================
-- Re-create policies from 002 (skip if they already exist)
-- Drop and recreate to ensure clean state
-- =============================================

-- Categories
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Authorized users can manage categories" ON public.categories;
CREATE POLICY "Public can view active categories"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);
CREATE POLICY "Authorized users can manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.authorize('categories.view'))
  WITH CHECK (public.authorize('categories.edit'));

-- Products
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
DROP POLICY IF EXISTS "Authorized users can manage products" ON public.products;
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);
CREATE POLICY "Authorized users can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.authorize('products.view'))
  WITH CHECK (public.authorize('products.edit'));

-- Product Variants
DROP POLICY IF EXISTS "Public can view active product variants" ON public.product_variants;
DROP POLICY IF EXISTS "Authorized users can manage product variants" ON public.product_variants;
CREATE POLICY "Public can view active product variants"
  ON public.product_variants FOR SELECT
  TO anon, authenticated
  USING (is_active = true);
CREATE POLICY "Authorized users can manage product variants"
  ON public.product_variants FOR ALL
  TO authenticated
  USING (public.authorize('products.view'))
  WITH CHECK (public.authorize('products.edit'));

-- Product Prices
DROP POLICY IF EXISTS "Authorized users can view prices" ON public.product_prices;
DROP POLICY IF EXISTS "Authorized users can manage prices" ON public.product_prices;
CREATE POLICY "Authorized users can view prices"
  ON public.product_prices FOR SELECT
  TO authenticated
  USING (public.authorize('pricing.view'));
CREATE POLICY "Authorized users can manage prices"
  ON public.product_prices FOR ALL
  TO authenticated
  USING (public.authorize('pricing.view'))
  WITH CHECK (public.authorize('pricing.edit'));

-- Measure Families
DROP POLICY IF EXISTS "Public can view measure families" ON public.measure_families;
DROP POLICY IF EXISTS "Admins can manage measure families" ON public.measure_families;
CREATE POLICY "Public can view measure families"
  ON public.measure_families FOR SELECT
  TO anon, authenticated
  USING (is_active = true);
CREATE POLICY "Admins can manage measure families"
  ON public.measure_families FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');

-- Measures
DROP POLICY IF EXISTS "Public can view measures" ON public.measures;
DROP POLICY IF EXISTS "Admins can manage measures" ON public.measures;
CREATE POLICY "Public can view measures"
  ON public.measures FOR SELECT
  TO anon, authenticated
  USING (is_active = true);
CREATE POLICY "Admins can manage measures"
  ON public.measures FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');

-- Measure Compatibility
DROP POLICY IF EXISTS "Public can view measure compatibility" ON public.measure_compatibility;
DROP POLICY IF EXISTS "Admins can manage measure compatibility" ON public.measure_compatibility;
CREATE POLICY "Public can view measure compatibility"
  ON public.measure_compatibility FOR SELECT
  TO anon, authenticated
  USING (is_active = true);
CREATE POLICY "Admins can manage measure compatibility"
  ON public.measure_compatibility FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');

-- Currencies
DROP POLICY IF EXISTS "Public can view currencies" ON public.currencies;
DROP POLICY IF EXISTS "Admins can manage currencies" ON public.currencies;
CREATE POLICY "Public can view currencies"
  ON public.currencies FOR SELECT
  TO anon, authenticated
  USING (is_active = true);
CREATE POLICY "Admins can manage currencies"
  ON public.currencies FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');

-- Countries
DROP POLICY IF EXISTS "Public can view active countries" ON public.countries;
DROP POLICY IF EXISTS "Admins can manage countries" ON public.countries;
CREATE POLICY "Public can view active countries"
  ON public.countries FOR SELECT
  TO anon, authenticated
  USING (is_active = true);
CREATE POLICY "Admins can manage countries"
  ON public.countries FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');

-- Quotes
DROP POLICY IF EXISTS "Authorized users can view quotes" ON public.quotes;
DROP POLICY IF EXISTS "Anyone can create quotes" ON public.quotes;
DROP POLICY IF EXISTS "Authorized users can update quotes" ON public.quotes;
DROP POLICY IF EXISTS "Authorized users can delete quotes" ON public.quotes;
CREATE POLICY "Authorized users can view quotes"
  ON public.quotes FOR SELECT
  TO authenticated
  USING (
    public.authorize('quotes.view') OR
    auth_user_id = auth.uid() OR
    assigned_to_id = auth.uid()
  );
CREATE POLICY "Anyone can create quotes"
  ON public.quotes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "Authorized users can update quotes"
  ON public.quotes FOR UPDATE
  TO authenticated
  USING (public.authorize('quotes.edit') OR (assigned_to_id = auth.uid()))
  WITH CHECK (public.authorize('quotes.edit') OR (assigned_to_id = auth.uid()));
CREATE POLICY "Authorized users can delete quotes"
  ON public.quotes FOR DELETE
  TO authenticated
  USING (public.authorize('quotes.delete'));

-- Quote Items
DROP POLICY IF EXISTS "Users can view quote items" ON public.quote_items;
DROP POLICY IF EXISTS "Anyone can create quote items" ON public.quote_items;
DROP POLICY IF EXISTS "Authorized users can update quote items" ON public.quote_items;
DROP POLICY IF EXISTS "Authorized users can delete quote items" ON public.quote_items;
CREATE POLICY "Users can view quote items"
  ON public.quote_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes q
      WHERE q.id = quote_id AND (
        public.authorize('quotes.view') OR
        q.auth_user_id = auth.uid() OR
        q.assigned_to_id = auth.uid()
      )
    )
  );
CREATE POLICY "Anyone can create quote items"
  ON public.quote_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "Authorized users can update quote items"
  ON public.quote_items FOR UPDATE
  TO authenticated
  USING (public.authorize('quotes.edit'))
  WITH CHECK (public.authorize('quotes.edit'));
CREATE POLICY "Authorized users can delete quote items"
  ON public.quote_items FOR DELETE
  TO authenticated
  USING (public.authorize('quotes.edit'));

-- Quote Communications
DROP POLICY IF EXISTS "Users can view quote communications" ON public.quote_communications;
DROP POLICY IF EXISTS "Authorized users can add communications" ON public.quote_communications;
CREATE POLICY "Users can view quote communications"
  ON public.quote_communications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes q
      WHERE q.id = quote_id AND (
        public.authorize('quotes.view') OR
        q.auth_user_id = auth.uid() OR
        q.assigned_to_id = auth.uid()
      )
    )
  );
CREATE POLICY "Authorized users can add communications"
  ON public.quote_communications FOR INSERT
  TO authenticated
  WITH CHECK (public.authorize('quotes.edit'));

-- Contact Submissions
DROP POLICY IF EXISTS "Anyone can create contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authorized users can view contacts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authorized users can update contacts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authorized users can delete contacts" ON public.contact_submissions;
CREATE POLICY "Anyone can create contact submissions"
  ON public.contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "Authorized users can view contacts"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING (public.authorize('contacts.view'));
CREATE POLICY "Authorized users can update contacts"
  ON public.contact_submissions FOR UPDATE
  TO authenticated
  USING (public.authorize('contacts.edit'))
  WITH CHECK (public.authorize('contacts.edit'));
CREATE POLICY "Authorized users can delete contacts"
  ON public.contact_submissions FOR DELETE
  TO authenticated
  USING (public.authorize('contacts.delete'));

-- Newsletter Subscriptions
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Authorized users can view newsletter" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Authorized users can manage newsletter" ON public.newsletter_subscriptions;
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscriptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "Authorized users can view newsletter"
  ON public.newsletter_subscriptions FOR SELECT
  TO authenticated
  USING (public.authorize('contacts.view'));
CREATE POLICY "Authorized users can manage newsletter"
  ON public.newsletter_subscriptions FOR UPDATE
  TO authenticated
  USING (public.authorize('contacts.edit'))
  WITH CHECK (public.authorize('contacts.edit'));

-- Site Settings
DROP POLICY IF EXISTS "Public can view public settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authorized users can view all settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authorized users can manage settings" ON public.site_settings;
CREATE POLICY "Public can view public settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (is_public = true);
CREATE POLICY "Authorized users can view all settings"
  ON public.site_settings FOR SELECT
  TO authenticated
  USING (public.authorize('settings.view'));
CREATE POLICY "Authorized users can manage settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.authorize('settings.view'))
  WITH CHECK (public.authorize('settings.edit'));

-- Pages
DROP POLICY IF EXISTS "Public can view published pages" ON public.pages;
DROP POLICY IF EXISTS "Admins can manage pages" ON public.pages;
CREATE POLICY "Public can view published pages"
  ON public.pages FOR SELECT
  TO anon, authenticated
  USING (is_published = true);
CREATE POLICY "Admins can manage pages"
  ON public.pages FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');

-- Activity Logs
DROP POLICY IF EXISTS "Authorized users can view activity" ON public.activity_logs;
DROP POLICY IF EXISTS "System can create activity logs" ON public.activity_logs;
CREATE POLICY "Authorized users can view activity"
  ON public.activity_logs FOR SELECT
  TO authenticated
  USING (public.authorize('activity.view'));
CREATE POLICY "System can create activity logs"
  ON public.activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =============================================
-- Verify: list all tables with RLS status
-- =============================================
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
