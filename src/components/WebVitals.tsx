'use client';

import { useEffect } from 'react';

export default function WebVitals() {
  useEffect(() => {
    // Only run in production and when web-vitals is available
    if (process.env.NODE_ENV !== 'production') return;

    // Dynamic import to avoid SSR issues
    const loadWebVitals = async () => {
      try {
        const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import('web-vitals');

        // Core Web Vitals
        onCLS(sendToAnalytics);
        onFCP(sendToAnalytics);
        onINP(sendToAnalytics);
        onLCP(sendToAnalytics);
        onTTFB(sendToAnalytics);
      } catch (error) {
        console.warn('Failed to load web-vitals:', error);
      }
    };

    loadWebVitals();
  }, []);

  return null;
}

function sendToAnalytics({ name, delta, value, id }: any) {
  // Send to Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      custom_map: { metric_value: value },
      non_interaction: true,
    });
  }

  // Metrics are sent to Google Analytics only

  // You can also send to other analytics services here
  // Example: Send to custom analytics endpoint
  /*
  fetch('/api/analytics/web-vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, delta, value, id }),
  }).catch(() => {
    // Ignore errors
  })
  */
}

// Performance monitoring utilities
export const performanceUtils = {
  // Measure function execution time
  measureExecutionTime<T>(fn: () => T, label: string): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    return result;
  },

  // Measure async function execution time
  async measureAsyncExecutionTime<T>(fn: () => Promise<T>, label: string): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    return result;
  },

  // Monitor Largest Contentful Paint (LCP)
  monitorLCP: (callback: (lcp: number) => void) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        callback(lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      return observer;
    }
    return null;
  },

  // Monitor First Input Delay (FID)
  monitorFID: (callback: (fid: number) => void) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          callback(entry.processingStart - entry.startTime);
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
      return observer;
    }
    return null;
  },

  // Monitor Cumulative Layout Shift (CLS)
  monitorCLS: (callback: (cls: number) => void) => {
    let clsValue = 0;
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        callback(clsValue);
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      return observer;
    }
    return null;
  },

  // Get navigation timing
  getNavigationTiming: () => {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      return {
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnect: navigation.connectEnd - navigation.connectStart,
        serverResponse: navigation.responseEnd - navigation.requestStart,
        pageLoad: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      };
    }
    return null;
  },

  // Monitor resource loading
  monitorResourceLoading: (callback: (resources: PerformanceResourceTiming[]) => void) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        callback(list.getEntries() as PerformanceResourceTiming[]);
      });
      observer.observe({ entryTypes: ['resource'] });
      return observer;
    }
    return null;
  },
};

// React hook for performance monitoring
export function usePerformanceMonitoring(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
    };
  }, [componentName]);
}

// Bundle size monitoring
export function logBundleSize() {
  // Bundle size monitoring handled by webpack/next.js
  return;
}
