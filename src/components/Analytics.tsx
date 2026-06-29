'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Google Analytics Measurement ID — script loading is handled by next/script in the layout
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page views
export function trackPageView(url: string) {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag('event', 'page_view', {
    page_path: url,
    page_location: window.location.origin + url,
  });
}

// Track events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}

// Track conversions
export function trackConversion(conversionId: string, value?: number, currency: string = 'USD') {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag('event', 'conversion', {
    send_to: conversionId,
    value,
    currency,
  });
}

// Track product views
export function trackProductView(product: {
  id: string;
  name: string;
  category: string;
  price?: number;
  currency?: string;
}) {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag('event', 'view_item', {
    currency: product.currency || 'USD',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        category: product.category,
        price: product.price,
      },
    ],
  });
}

// Track quote requests
export function trackQuoteRequest(
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    price?: number;
  }>,
  totalValue?: number
) {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return;

  const items = products.map(product => ({
    item_id: product.id,
    item_name: product.name,
    quantity: product.quantity,
    price: product.price,
  }));

  window.gtag('event', 'begin_checkout', {
    currency: 'USD',
    value: totalValue,
    items,
  });
}

// Track form submissions
export function trackFormSubmission(formType: string, success: boolean = true) {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag('event', success ? 'form_submit_success' : 'form_submit_error', {
    event_category: 'form',
    event_label: formType,
  });
}

// GA4 recommended — Lead generation event (quote form, WhatsApp, email CTAs)
export function trackGenerateLead(params: {
  lead_source: string;
  currency?: string;
  value?: number;
}) {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag('event', 'generate_lead', {
    currency: params.currency ?? 'USD',
    value: params.value,
    lead_source: params.lead_source,
  });
}

// Update consent settings — Consent Mode v2 compliant.
// Covers all 4 required params: analytics_storage, ad_storage, ad_user_data, ad_personalization.
export function updateConsent(consent: {
  analytics?: boolean;
  marketing?: boolean;
  functional?: boolean;
}) {
  if (typeof window === 'undefined' || !window.gtag) return;

  const consentUpdate: Record<string, string> = {};

  if (consent.analytics !== undefined) {
    consentUpdate.analytics_storage = consent.analytics ? 'granted' : 'denied';
  }

  if (consent.marketing !== undefined) {
    // Consent Mode v2 requires ad_user_data and ad_personalization in addition to ad_storage
    const adState = consent.marketing ? 'granted' : 'denied';
    consentUpdate.ad_storage = adState;
    consentUpdate.ad_user_data = adState;
    consentUpdate.ad_personalization = adState;
  }

  if (consent.functional !== undefined) {
    consentUpdate.functionality_storage = consent.functional ? 'granted' : 'denied';
  }

  window.gtag('consent', 'update', consentUpdate);
}

// Analytics component — tracks SPA page view changes via history API.
// Skips the initial mount: gtag('config') already sends the first page_view.
// Only subsequent route changes (pathname or searchParams) fire a new page_view.
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return; // skip initial load — gtag config handles it
    }
    if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return;

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}

// Custom hook for analytics
export function useAnalytics() {
  return {
    trackEvent,
    trackConversion,
    trackProductView,
    trackQuoteRequest,
    trackFormSubmission,
    trackGenerateLead,
    updateConsent,
  };
}
