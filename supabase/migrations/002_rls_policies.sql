-- =============================================
-- ZIVAH International - RLS Policies for App Tables
-- Run after 001_auth_profiles_rbac.sql
-- =============================================

-- =============================================
-- Enable RLS on all tables
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
-- Categories Policies
-- =============================================

-- Anyone can view active categories (public data)
CREATE POLICY "Public can view active categories"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Authenticated users with permission can manage categories
CREATE POLICY "Authorized users can manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.authorize('categories.view'))
  WITH CHECK (public.authorize('categories.edit'));

-- =============================================
-- Products Policies
-- =============================================

-- Anyone can view active products (public data)
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Authorized users can manage products
CREATE POLICY "Authorized users can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.authorize('products.view'))
  WITH CHECK (public.authorize('products.edit'));

-- =============================================
-- Product Variants Policies
-- =============================================

-- Anyone can view active product variants
CREATE POLICY "Public can view active product variants"
  ON public.product_variants FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Authorized users can manage variants
CREATE POLICY "Authorized users can manage product variants"
  ON public.product_variants FOR ALL
  TO authenticated
  USING (public.authorize('products.view'))
  WITH CHECK (public.authorize('products.edit'));

-- =============================================
-- Product Prices Policies
-- =============================================

-- Authorized users can view prices
CREATE POLICY "Authorized users can view prices"
  ON public.product_prices FOR SELECT
  TO authenticated
  USING (public.authorize('pricing.view'));

-- Authorized users can manage prices
CREATE POLICY "Authorized users can manage prices"
  ON public.product_prices FOR ALL
  TO authenticated
  USING (public.authorize('pricing.view'))
  WITH CHECK (public.authorize('pricing.edit'));

-- =============================================
-- Measure Families Policies
-- =============================================

-- Anyone can view measure families (public reference data)
CREATE POLICY "Public can view measure families"
  ON public.measure_families FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins can manage measure families
CREATE POLICY "Admins can manage measure families"
  ON public.measure_families FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');

-- =============================================
-- Measures Policies
-- =============================================

-- Anyone can view measures (public reference data)
CREATE POLICY "Public can view measures"
  ON public.measures FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins can manage measures
CREATE POLICY "Admins can manage measures"
  ON public.measures FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');

-- =============================================
-- Measure Compatibility Policies
-- =============================================

-- Anyone can view compatibility (public reference data)
CREATE POLICY "Public can view measure compatibility"
  ON public.measure_compatibility FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins can manage compatibility
CREATE POLICY "Admins can manage measure compatibility"
  ON public.measure_compatibility FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');

-- =============================================
-- Currencies Policies
-- =============================================

-- Anyone can view currencies (public reference data)
CREATE POLICY "Public can view currencies"
  ON public.currencies FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins can manage currencies
CREATE POLICY "Admins can manage currencies"
  ON public.currencies FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');

-- =============================================
-- Countries Policies
-- =============================================

-- Anyone can view active countries (public reference data)
CREATE POLICY "Public can view active countries"
  ON public.countries FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins can manage countries
CREATE POLICY "Admins can manage countries"
  ON public.countries FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');

-- =============================================
-- Quotes Policies
-- =============================================

-- Users with quotes.view permission can see all quotes
CREATE POLICY "Authorized users can view quotes"
  ON public.quotes FOR SELECT
  TO authenticated
  USING (
    public.authorize('quotes.view') OR
    -- Sales reps can only see their assigned quotes
    (auth_user_id = auth.uid()) OR
    (assigned_to_id = auth.uid())
  );

-- Anyone can create a quote (customer-facing)
CREATE POLICY "Anyone can create quotes"
  ON public.quotes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authorized users can update quotes
CREATE POLICY "Authorized users can update quotes"
  ON public.quotes FOR UPDATE
  TO authenticated
  USING (
    public.authorize('quotes.edit') OR
    (assigned_to_id = auth.uid())
  )
  WITH CHECK (
    public.authorize('quotes.edit') OR
    (assigned_to_id = auth.uid())
  );

-- Only users with delete permission can delete quotes
CREATE POLICY "Authorized users can delete quotes"
  ON public.quotes FOR DELETE
  TO authenticated
  USING (public.authorize('quotes.delete'));

-- =============================================
-- Quote Items Policies
-- =============================================

-- Users who can view quotes can view items
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

-- Anyone can create quote items (with quote)
CREATE POLICY "Anyone can create quote items"
  ON public.quote_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authorized users can update items
CREATE POLICY "Authorized users can update quote items"
  ON public.quote_items FOR UPDATE
  TO authenticated
  USING (public.authorize('quotes.edit'))
  WITH CHECK (public.authorize('quotes.edit'));

-- Authorized users can delete items
CREATE POLICY "Authorized users can delete quote items"
  ON public.quote_items FOR DELETE
  TO authenticated
  USING (public.authorize('quotes.edit'));

-- =============================================
-- Quote Communications Policies
-- =============================================

-- Users who can view quotes can view communications
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

-- Authorized users can add communications
CREATE POLICY "Authorized users can add communications"
  ON public.quote_communications FOR INSERT
  TO authenticated
  WITH CHECK (public.authorize('quotes.edit'));

-- =============================================
-- Contact Submissions Policies
-- =============================================

-- Anyone can create contact submissions
CREATE POLICY "Anyone can create contact submissions"
  ON public.contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authorized users can view contacts
CREATE POLICY "Authorized users can view contacts"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING (public.authorize('contacts.view'));

-- Authorized users can update contacts
CREATE POLICY "Authorized users can update contacts"
  ON public.contact_submissions FOR UPDATE
  TO authenticated
  USING (public.authorize('contacts.edit'))
  WITH CHECK (public.authorize('contacts.edit'));

-- Authorized users can delete contacts
CREATE POLICY "Authorized users can delete contacts"
  ON public.contact_submissions FOR DELETE
  TO authenticated
  USING (public.authorize('contacts.delete'));

-- =============================================
-- Newsletter Subscriptions Policies
-- =============================================

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscriptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authorized users can view subscriptions
CREATE POLICY "Authorized users can view newsletter"
  ON public.newsletter_subscriptions FOR SELECT
  TO authenticated
  USING (public.authorize('contacts.view'));

-- Authorized users can manage subscriptions
CREATE POLICY "Authorized users can manage newsletter"
  ON public.newsletter_subscriptions FOR UPDATE
  TO authenticated
  USING (public.authorize('contacts.edit'))
  WITH CHECK (public.authorize('contacts.edit'));

-- =============================================
-- Site Settings Policies
-- =============================================

-- Anyone can view public settings
CREATE POLICY "Public can view public settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

-- Authorized users can view all settings
CREATE POLICY "Authorized users can view all settings"
  ON public.site_settings FOR SELECT
  TO authenticated
  USING (public.authorize('settings.view'));

-- Authorized users can manage settings
CREATE POLICY "Authorized users can manage settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.authorize('settings.view'))
  WITH CHECK (public.authorize('settings.edit'));

-- =============================================
-- Pages Policies
-- =============================================

-- Anyone can view published pages
CREATE POLICY "Public can view published pages"
  ON public.pages FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Admins can manage pages
CREATE POLICY "Admins can manage pages"
  ON public.pages FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');

-- =============================================
-- Activity Logs Policies
-- =============================================

-- Authorized users can view activity
CREATE POLICY "Authorized users can view activity"
  ON public.activity_logs FOR SELECT
  TO authenticated
  USING (public.authorize('activity.view'));

-- System can insert activity logs
CREATE POLICY "System can create activity logs"
  ON public.activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =============================================
-- Grant API access (for Supabase auto-generated API)
-- =============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant select on public tables to anon (for public data)
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.product_variants TO anon;
GRANT SELECT ON public.measure_families TO anon;
GRANT SELECT ON public.measures TO anon;
GRANT SELECT ON public.measure_compatibility TO anon;
GRANT SELECT ON public.currencies TO anon;
GRANT SELECT ON public.countries TO anon;
GRANT SELECT ON public.pages TO anon;
GRANT SELECT ON public.site_settings TO anon;

-- Grant insert on forms tables to anon (for public forms)
GRANT INSERT ON public.quotes TO anon;
GRANT INSERT ON public.quote_items TO anon;
GRANT INSERT ON public.contact_submissions TO anon;
GRANT INSERT ON public.newsletter_subscriptions TO anon;

-- Grant all on all tables to authenticated users (RLS will restrict)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
