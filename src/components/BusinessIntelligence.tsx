'use client';

import { useEffect } from 'react';

import { useAnalytics } from './Analytics';

// Business Intelligence tracking for ZIVAH International
export function useBusinessTracking() {
  const {
    trackEvent,
    trackConversion,
    trackProductView,
    trackQuoteRequest,
    trackFormSubmission,
    trackGenerateLead,
  } = useAnalytics();

  // Track business-specific events
  const trackBusinessEvent = (eventName: string, properties?: Record<string, any>) => {
    trackEvent(eventName, 'business', JSON.stringify(properties));
  };

  // Track product category views
  const trackCategoryView = (category: string) => {
    trackEvent('category_view', 'ecommerce', category);
  };

  // Track search queries
  const trackSearch = (query: string, resultsCount?: number) => {
    trackEvent('search', 'engagement', query, resultsCount);
  };

  // Track contact form submissions
  const trackContactSubmission = (formData: {
    name: string;
    email: string;
    company?: string;
    message: string;
  }) => {
    trackFormSubmission('contact', true);
    trackBusinessEvent('contact_form_submit', {
      has_company: !!formData.company,
      message_length: formData.message.length,
    });
  };

  // Track newsletter subscriptions
  const trackNewsletterSignup = (email: string, source?: string) => {
    trackEvent('newsletter_signup', 'engagement', source || 'website');
    trackBusinessEvent('newsletter_subscription', { source });
  };

  // Track quote form interactions
  const trackQuoteFormStart = () => {
    trackEvent('quote_form_start', 'conversion');
  };

  const trackQuoteFormComplete = (quoteData: {
    products: Array<{ id: string; name: string; quantity: number }>;
    contactInfo: { name: string; email: string; company?: string };
    deliveryInfo?: { country: string; port?: string };
  }) => {
    trackQuoteRequest(
      quoteData.products.map(p => ({
        id: p.id,
        name: p.name,
        quantity: p.quantity,
      }))
    );

    // GA4 recommended: generate_lead fires on successful quote submission
    trackGenerateLead({
      lead_source: 'quote_form',
      currency: 'USD',
    });

    trackBusinessEvent('quote_request_complete', {
      product_count: quoteData.products.length,
      has_company: !!quoteData.contactInfo.company,
      destination_country: quoteData.deliveryInfo?.country,
      total_quantity: quoteData.products.reduce((sum, p) => sum + p.quantity, 0),
    });
  };

  // Track document downloads
  const trackDocumentDownload = (documentName: string, documentType: string) => {
    trackEvent('download', 'engagement', `${documentType}:${documentName}`);
  };

  // Track language changes
  const trackLanguageChange = (from: string, to: string) => {
    trackEvent('language_change', 'engagement', `${from}_to_${to}`);
  };

  // Track business conversions
  const trackBusinessConversion = (
    conversionType: 'quote_request' | 'contact' | 'newsletter' | 'download',
    value?: number
  ) => {
    const conversionIds: Record<string, string> = {
      quote_request: 'AW-XXXXXXXXX/XXXXXXXXXXX', // Replace with actual conversion ID
      contact: 'AW-XXXXXXXXX/YYYYYYYYYYY',
      newsletter: 'AW-XXXXXXXXX/ZZZZZZZZZZZ',
      download: 'AW-XXXXXXXXX/WWWWWWWWWWW',
    };

    trackConversion(conversionIds[conversionType], value);
  };

  // Track user engagement metrics
  const trackEngagement = (action: string, details?: Record<string, any>) => {
    trackBusinessEvent('user_engagement', { action, ...details });
  };

  // Track page scroll depth
  const trackScrollDepth = (depth: number) => {
    if (depth >= 25 && depth % 25 === 0) {
      trackEvent('scroll_depth', 'engagement', `${depth}%`);
    }
  };

  // Track time on page
  const trackTimeOnPage = (page: string, timeSpent: number) => {
    trackEvent('time_on_page', 'engagement', page, Math.round(timeSpent));
  };

  return {
    trackBusinessEvent,
    trackCategoryView,
    trackSearch,
    trackContactSubmission,
    trackNewsletterSignup,
    trackQuoteFormStart,
    trackQuoteFormComplete,
    trackDocumentDownload,
    trackLanguageChange,
    trackBusinessConversion,
    trackEngagement,
    trackScrollDepth,
    trackTimeOnPage,
  };
}

// Business Intelligence Component
export default function BusinessIntelligence() {
  const tracking = useBusinessTracking();

  useEffect(() => {
    // Track initial page load
    tracking.trackEngagement('page_load');

    // Track scroll depth
    let maxScrollDepth = 0;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        tracking.trackScrollDepth(maxScrollDepth);
      }
    };

    // Track time on page
    const startTime = Date.now();
    const handleBeforeUnload = () => {
      const timeSpent = (Date.now() - startTime) / 1000;
      tracking.trackTimeOnPage(window.location.pathname, timeSpent);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload(); // Track time when component unmounts
    };
  }, [tracking]);

  return null;
}
