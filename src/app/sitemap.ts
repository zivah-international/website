import { MetadataRoute } from 'next';

// Generate sitemap for the website
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zivahinternational.com';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/legal/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/data-protection`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quotes`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Product pages (these would typically come from your database)
  const productPages = [
    'tropical-fruits',
    'shrimp',
    'coffee',
    'aquaculture-larvae',
    'nuts',
    'marine-products',
  ].map(slug => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Category pages
  const categoryPages = ['fruits', 'seafood', 'coffee-beans', 'aquaculture'].map(slug => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}

// Utility functions for sitemap management
export const sitemapUtils = {
  // Generate sitemap XML string
  generateSitemapXML: (urls: MetadataRoute.Sitemap): string => {
    const urlElements = urls
      .map(url => {
        const lastMod = url.lastModified
          ? new Date(url.lastModified).toISOString()
          : new Date().toISOString();
        return `
    <url>
      <loc>${url.url}</loc>
      <lastmod>${lastMod}</lastmod>
      <changefreq>${url.changeFrequency}</changefreq>
      <priority>${url.priority}</priority>
    </url>`;
      })
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${urlElements}
</urlset>`;
  },

  // Generate robots.txt content
  generateRobotsTxt: (baseUrl: string): string => {
    return `User-agent: *
Allow: /

# Block access to sensitive areas
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;
  },

  // Submit sitemap to search engines
  submitSitemapToSearchEngines: async (sitemapUrl: string): Promise<void> => {
    const searchEngines = [
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    ];

    const results = await Promise.allSettled(
      searchEngines.map(async url => {
        const response = await fetch(url);
        return response.ok;
      })
    );

    const successful = results.filter(
      result => result.status === 'fulfilled' && result.value
    ).length;
  },

  // Validate sitemap URLs
  validateSitemapUrls: async (
    urls: MetadataRoute.Sitemap
  ): Promise<{
    valid: string[];
    invalid: string[];
  }> => {
    const results = await Promise.allSettled(
      urls.map(async url => {
        try {
          const response = await fetch(url.url, { method: 'HEAD' });
          return { url: url.url, valid: response.ok };
        } catch {
          return { url: url.url, valid: false };
        }
      })
    );

    const valid: string[] = [];
    const invalid: string[] = [];

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        if (result.value.valid) {
          valid.push(result.value.url);
        } else {
          invalid.push(result.value.url);
        }
      } else {
        // For rejected promises, URL validation failed
      }
    });

    return { valid, invalid };
  },

  // Generate sitemap index for large sites
  generateSitemapIndex: (sitemaps: { url: string; lastModified: Date }[]): string => {
    const sitemapElements = sitemaps
      .map(
        sitemap => `
    <sitemap>
      <loc>${sitemap.url}</loc>
      <lastmod>${sitemap.lastModified.toISOString()}</lastmod>
    </sitemap>`
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapElements}
</sitemapindex>`;
  },

  // Monitor sitemap changes
  monitorSitemapChanges: (
    currentUrls: MetadataRoute.Sitemap,
    previousUrls: MetadataRoute.Sitemap
  ) => {
    const currentUrlSet = new Set(currentUrls.map(u => u.url));
    const previousUrlSet = new Set(previousUrls.map(u => u.url));

    const added = currentUrls.filter(u => !previousUrlSet.has(u.url));
    const removed = previousUrls.filter(u => !currentUrlSet.has(u.url));
    const modified = currentUrls.filter(u => {
      const prev = previousUrls.find(p => p.url === u.url);
      if (!prev || !prev.lastModified || !u.lastModified) return false;

      const prevTime = new Date(prev.lastModified).getTime();
      const currentTime = new Date(u.lastModified).getTime();
      return prevTime !== currentTime;
    });

    return { added, removed, modified };
  },
};

// Dynamic sitemap generation for large datasets
export async function generateDynamicSitemap(
  baseUrl: string,
  getProducts: () => Promise<Array<{ slug: string; updatedAt: Date }>>,
  getCategories: () => Promise<Array<{ slug: string; updatedAt: Date }>>
): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const productUrls = products.map(product => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map(category => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    ...productUrls,
    ...categoryUrls,
  ];
}
