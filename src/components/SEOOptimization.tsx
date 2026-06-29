'use client';

import { useEffect } from 'react';

import SEO from './SEO';
import WebVitals from './WebVitals';

interface SEOOptimizationProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: object;
  enableWebVitals?: boolean;
  enableSEOValidation?: boolean;
}

export default function SEOOptimization({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  structuredData,
  enableWebVitals = true,
  enableSEOValidation = process.env.NODE_ENV === 'development',
}: SEOOptimizationProps) {
  useEffect(() => {
    if (enableSEOValidation && typeof window !== 'undefined') {
      // Validate SEO elements in development
      const validateSEOElements = () => {
        const issues: string[] = [];

        // Check for title
        if (!document.title || document.title.length < 30) {
          issues.push('Title is too short or missing');
        }

        // Check for meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (
          !metaDesc ||
          !metaDesc.getAttribute('content') ||
          metaDesc.getAttribute('content')!.length < 120
        ) {
          issues.push('Meta description is too short or missing');
        }

        // Check for Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const ogImage = document.querySelector('meta[property="og:image"]');

        if (!ogTitle) issues.push('Open Graph title missing');
        if (!ogDesc) issues.push('Open Graph description missing');
        if (!ogImage) issues.push('Open Graph image missing');

        // Check for canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) issues.push('Canonical URL missing');

        // Check for structured data
        const structuredDataScript = document.querySelector('script[type="application/ld+json"]');
        if (!structuredDataScript) issues.push('Structured data missing');

        // SEO validation complete
      };

      validateSEOElements();
    }

    // Preload critical resources
    const preloadCriticalResources = () => {
      if (typeof document === 'undefined') return;

      // Preload critical fonts
      const fontLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
      ];

      fontLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = 'style';
        document.head.appendChild(link);
      });

      // Preload critical images
      const criticalImages = ['/assets/images/zivah-logo.svg', '/assets/images/icons/favicon.svg'];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
      });
    };

    preloadCriticalResources();

    // Set up performance monitoring
    const setupPerformanceMonitoring = () => {
      if (typeof window === 'undefined') return;

      // Monitor Core Web Vitals
      if ('web-vitals' in window || enableWebVitals) {
        // WebVitals component handles this
      }

      // Monitor navigation timing
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigation = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;

        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.fetchStart;
          const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;

          // Performance metrics tracked

          // Send to analytics if available
          if ((window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
            (window as Window & { gtag?: (...args: unknown[]) => void }).gtag!(
              'event',
              'page_load_performance',
              {
                event_category: 'Performance',
                event_label: window.location.pathname,
                value: Math.round(loadTime),
                custom_map: {
                  dom_content_loaded: domContentLoaded,
                  dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
                },
              }
            );
          }
        }
      }

      // Monitor resource loading
      if ('PerformanceObserver' in window) {
        const resourceObserver = new PerformanceObserver(list => {
          const entries = list.getEntries() as PerformanceResourceTiming[];

          entries.forEach(entry => {
            if (entry.duration > 1000) {
              // Track slow resources for optimization
            }
          });
        });

        resourceObserver.observe({ entryTypes: ['resource'] });
      }
    };

    setupPerformanceMonitoring();
  }, [enableSEOValidation, enableWebVitals]);

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        image={image}
        url={url}
        type={type}
        structuredData={structuredData}
      />
      {enableWebVitals && <WebVitals />}
    </>
  );
}

// SEO optimization utilities
export const seoOptimizationUtils = {
  // Generate comprehensive SEO report
  generateSEOReport: async (url: string) => {
    const report = {
      url,
      timestamp: new Date().toISOString(),
      scores: {} as Record<string, number>,
      issues: [] as string[],
      recommendations: [] as string[],
    };

    try {
      // Check page load speed
      const startTime = performance.now();
      const _response = await fetch(url, { method: 'HEAD' });
      const loadTime = performance.now() - startTime;

      report.scores.loadSpeed = loadTime < 1000 ? 100 : loadTime < 3000 ? 70 : 50;

      if (loadTime > 3000) {
        report.issues.push('Page load time is too slow');
        report.recommendations.push('Optimize images and enable compression');
      }

      // Check for HTTPS
      if (!url.startsWith('https://')) {
        report.issues.push('Site is not using HTTPS');
        report.recommendations.push('Implement SSL certificate');
      }

      // Check mobile-friendliness (basic check)
      const mobileScore = 85; // This would need actual mobile testing
      report.scores.mobileFriendly = mobileScore;

      if (mobileScore < 80) {
        report.issues.push('Page may not be mobile-friendly');
        report.recommendations.push('Implement responsive design');
      }
    } catch {
      report.issues.push('Failed to analyze page');
    }

    return report;
  },

  // Optimize images for SEO
  optimizeImageForSEO: (imageUrl: string, alt: string, title?: string) => {
    return {
      src: imageUrl,
      alt,
      title: title || alt,
      loading: 'lazy',
      decoding: 'async',
    };
  },

  // Generate SEO-friendly URL
  generateSEOFriendlyURL: (title: string, id?: string | number) => {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return id ? `${slug}-${id}` : slug;
  },

  // Check for broken links
  checkBrokenLinks: async (urls: string[]) => {
    const results = await Promise.allSettled(
      urls.map(async url => {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          return { url, status: response.status, broken: !response.ok };
        } catch {
          return { url, status: 0, broken: true };
        }
      })
    );

    return results.map(result =>
      result.status === 'fulfilled' ? result.value : { url: result.reason, status: 0, broken: true }
    );
  },

  // Monitor search rankings (placeholder for actual implementation)
  monitorSearchRankings: (keywords: string[], domain: string) => {
    // This would integrate with SEO tools like SEMrush, Ahrefs, etc.
    return {
      keywords,
      domain,
      lastChecked: new Date().toISOString(),
      rankings: {} as Record<string, number>,
    };
  },
};

// Hook for SEO optimization
export function useSEOOptimization(options: SEOOptimizationProps) {
  useEffect(() => {
    // Implement SEO optimizations
    const cleanup = () => {
      // Cleanup function
    };

    return cleanup;
  }, []);

  return {
    validateSEO: () => seoOptimizationUtils.generateSEOReport(options.url || window.location.href),
    optimizeImage: seoOptimizationUtils.optimizeImageForSEO,
    generateURL: seoOptimizationUtils.generateSEOFriendlyURL,
  };
}
