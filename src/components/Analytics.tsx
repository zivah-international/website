'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export function initGA() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production' || !GA_MEASUREMENT_ID)
    return;

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: false, // We'll handle page views manually
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    allow_ad_features: false,
  });

  // Set default consent to denied
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
  });
}

// Track page views
export function trackPageView(url: string) {
  if (typeof window === 'undefined' || !window.gtag || process.env.NODE_ENV !== 'production')
    return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

// Track events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window === 'undefined' || !window.gtag || process.env.NODE_ENV !== 'production')
    return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}

// Track conversions
export function trackConversion(conversionId: string, value?: number, currency: string = 'USD') {
  if (typeof window === 'undefined' || !window.gtag || process.env.NODE_ENV !== 'production')
    return;

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
  if (typeof window === 'undefined' || !window.gtag || process.env.NODE_ENV !== 'production')
    return;

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
  if (typeof window === 'undefined' || !window.gtag || process.env.NODE_ENV !== 'production')
    return;

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
  if (typeof window === 'undefined' || !window.gtag || process.env.NODE_ENV !== 'production')
    return;

  window.gtag('event', success ? 'form_submit_success' : 'form_submit_error', {
    event_category: 'form',
    event_label: formType,
  });
}

// Update consent settings
export function updateConsent(consent: {
  analytics?: boolean;
  marketing?: boolean;
  functional?: boolean;
}) {
  if (typeof window === 'undefined' || !window.gtag || process.env.NODE_ENV !== 'production')
    return;

  const consentUpdate: Record<string, string> = {};

  if (consent.analytics !== undefined) {
    consentUpdate.analytics_storage = consent.analytics ? 'granted' : 'denied';
  }

  if (consent.marketing !== undefined) {
    consentUpdate.ad_storage = consent.marketing ? 'granted' : 'denied';
  }

  if (consent.functional !== undefined) {
    consentUpdate.functionality_storage = consent.functional ? 'granted' : 'denied';
  }

  window.gtag('consent', 'update', consentUpdate);
}

// Analytics component
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize GA on first load
    if (!window.gtag) {
      initGA();
    }

    // Track page view
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
    updateConsent,
  };
}
