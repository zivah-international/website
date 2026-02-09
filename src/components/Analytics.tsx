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
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Google Analytics
export function initGA() {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID || !isProduction) return;

  // Skip if already initialized (check if gtag has been called)
  if (window.dataLayer && window.dataLayer.length > 0) return;

  // Initialize dataLayer and gtag BEFORE loading script
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };

  // Set consent BEFORE any tracking (GDPR compliance)
  // Default: allow basic analytics, deny ads/personalization
  window.gtag('consent', 'default', {
    analytics_storage: 'granted', // Allow basic page view tracking
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
  });

  window.gtag('js', new Date());

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Configure GA4
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true, // Send initial page view
    anonymize_ip: true, // Privacy: anonymize IP addresses
  });
}

// Track page views
export function trackPageView(url: string) {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID || !isProduction) return;

  window.gtag('event', 'page_view', {
    page_path: url,
    page_location: window.location.origin + url,
  });
}

// Track events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window === 'undefined' || !window.gtag || !isProduction) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}

// Track conversions
export function trackConversion(conversionId: string, value?: number, currency: string = 'USD') {
  if (typeof window === 'undefined' || !window.gtag || !isProduction) return;

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
  if (typeof window === 'undefined' || !window.gtag || !isProduction) return;

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
  if (typeof window === 'undefined' || !window.gtag || !isProduction) return;

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
  if (typeof window === 'undefined' || !window.gtag || !isProduction) return;

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
  if (typeof window === 'undefined' || !window.gtag || !isProduction) return;

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
