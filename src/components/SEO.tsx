'use client';

import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  canonical?: string;
  noindex?: boolean;
  structuredData?: object;
}

export default function SEO({
  title,
  description,
  keywords,
  image = 'https://zivahinternational.com/assets/images/zivah-og-image.jpg',
  url = 'https://zivahinternational.com/',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'ZIVAH International S.A.',
  section,
  tags,
  canonical,
  noindex = false,
  structuredData,
}: SEOProps) {
  const t = useTranslations('metadata');
  const tSeo = useTranslations('seo');

  // Use props or fallback to translations
  const seoTitle = title ?? t('title');
  const seoDescription = description ?? t('description');
  const seoKeywords = keywords ?? t('keywords').split(', ');

  useEffect(() => {
    // Update meta tags dynamically
    const updateMetaTags = () => {
      // Update title
      if (typeof document !== 'undefined') {
        document.title = seoTitle;

        // Update or create meta tags
        updateMetaTag('description', seoDescription);
        updateMetaTag('keywords', seoKeywords.join(', '));
        updateMetaTag('author', author);
        updateMetaTag(
          'robots',
          noindex
            ? 'noindex,nofollow'
            : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'
        );

        // Open Graph
        updateMetaTag('og:title', seoTitle, 'property');
        updateMetaTag('og:description', seoDescription, 'property');
        updateMetaTag('og:image', image, 'property');
        updateMetaTag('og:url', url, 'property');
        updateMetaTag('og:type', type, 'property');
        updateMetaTag('og:site_name', 'ZIVAH International S.A.', 'property');

        // Twitter Card
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', seoTitle);
        updateMetaTag('twitter:description', seoDescription);
        updateMetaTag('twitter:image', image);
        updateMetaTag('twitter:site', '@ZivahIntl');
        updateMetaTag('twitter:creator', '@ZivahIntl');

        // Article specific
        if (type === 'article' && publishedTime) {
          updateMetaTag('article:published_time', publishedTime, 'property');
          if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime, 'property');
          if (author) updateMetaTag('article:author', author, 'property');
          if (section) updateMetaTag('article:section', section, 'property');
          if (tags) tags.forEach(tag => updateMetaTag('article:tag', tag, 'property'));
        }

        // Canonical URL
        updateCanonicalUrl(canonical || url);
      }
    };

    updateMetaTags();
  }, [
    seoTitle,
    seoDescription,
    seoKeywords,
    image,
    url,
    type,
    publishedTime,
    modifiedTime,
    author,
    section,
    tags,
    canonical,
    noindex,
  ]);

  const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
    if (typeof document === 'undefined') return;

    let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    if (element) {
      element.content = content;
    } else {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      element.content = content;
      document.head.appendChild(element);
    }
  };

  const updateCanonicalUrl = (canonicalUrl: string) => {
    if (typeof document === 'undefined') return;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = canonicalUrl;
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = canonicalUrl;
      document.head.appendChild(canonical);
    }
  };

  // Generate structured data
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ZIVAH International S.A.',
      url: 'https://zivahinternational.com',
      logo: 'https://zivahinternational.com/assets/images/zivah-logo.svg',
      description: seoDescription,
      foundingDate: '2020',
      industry: tSeo('industry'),
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Casa Matriz Mz 10 S L 31',
        addressLocality: 'Samborondón',
        addressRegion: 'Guayas',
        postalCode: '092301',
        addressCountry: 'EC',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+593999002893',
        email: 'info@zivahinternational.com',
        contactType: 'customer service',
        areaServed: 'Worldwide',
        availableLanguage: ['Spanish', 'English'],
      },
      sameAs: [
        'https://www.linkedin.com/company/zivah-international',
        'https://twitter.com/ZivahIntl',
        'https://www.instagram.com/zivahintl',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: tSeo('catalogName'),
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: tSeo('tropicalFruits'),
              description: tSeo('tropicalFruitsDesc'),
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: tSeo('shrimp'),
              description: tSeo('shrimpDesc'),
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: tSeo('coffee'),
              description: tSeo('coffeeDesc'),
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: tSeo('aquacultureLarvae'),
              description: tSeo('aquacultureLarvaeDesc'),
            },
          },
        ],
      },
    };

    // Add article-specific structured data
    if (type === 'article') {
      return {
        ...baseData,
        '@type': 'Article',
        headline: seoTitle,
        image,
        author: {
          '@type': 'Organization',
          name: author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'ZIVAH International S.A.',
          logo: {
            '@type': 'ImageObject',
            url: 'https://zivahinternational.com/assets/images/zivah-logo.svg',
          },
        },
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
      };
    }

    // Add product-specific structured data
    if (type === 'product') {
      return {
        ...baseData,
        '@type': 'Product',
        name: seoTitle,
        image,
        description: seoDescription,
        brand: {
          '@type': 'Brand',
          name: 'ZIVAH International S.A.',
        },
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          priceCurrency: 'USD',
          seller: {
            '@type': 'Organization',
            name: 'ZIVAH International S.A.',
          },
        },
      };
    }

    return structuredData || baseData;
  };

  return (
    <Head>
      <title>{seoTitle}</title>
      <meta
        name='description'
        content={seoDescription}
      />
      <meta
        name='keywords'
        content={seoKeywords.join(', ')}
      />
      <meta
        name='author'
        content={author}
      />
      <meta
        name='robots'
        content={
          noindex
            ? 'noindex,nofollow'
            : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'
        }
      />

      {/* Open Graph */}
      <meta
        property='og:title'
        content={seoTitle}
      />
      <meta
        property='og:description'
        content={seoDescription}
      />
      <meta
        property='og:image'
        content={image}
      />
      <meta
        property='og:url'
        content={url}
      />
      <meta
        property='og:type'
        content={type}
      />
      <meta
        property='og:site_name'
        content='ZIVAH International S.A.'
      />

      {/* Twitter Card */}
      <meta
        name='twitter:card'
        content='summary_large_image'
      />
      <meta
        name='twitter:title'
        content={seoTitle}
      />
      <meta
        name='twitter:description'
        content={seoDescription}
      />
      <meta
        name='twitter:image'
        content={image}
      />
      <meta
        name='twitter:site'
        content='@ZivahIntl'
      />
      <meta
        name='twitter:creator'
        content='@ZivahIntl'
      />

      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <>
          <meta
            property='article:published_time'
            content={publishedTime}
          />
          {modifiedTime && (
            <meta
              property='article:modified_time'
              content={modifiedTime}
            />
          )}
          {author && (
            <meta
              property='article:author'
              content={author}
            />
          )}
          {section && (
            <meta
              property='article:section'
              content={section}
            />
          )}
          {tags &&
            tags.map((tag, index) => (
              <meta
                key={index}
                property='article:tag'
                content={tag}
              />
            ))}
        </>
      )}

      {/* Canonical URL */}
      <link
        rel='canonical'
        href={canonical || url}
      />

      {/* Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData()),
        }}
      />
    </Head>
  );
}

// SEO utilities
export const seoUtils = {
  // Generate meta description from content
  generateMetaDescription: (content: string, maxLength: number = 160): string => {
    const cleanContent = content
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleanContent.length <= maxLength) return cleanContent;

    const truncated = cleanContent.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  },

  // Generate keywords from content
  generateKeywords: (content: string, maxKeywords: number = 10): string[] => {
    const words = content
      .toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(
        word =>
          ![
            'that',
            'with',
            'have',
            'this',
            'will',
            'your',
            'from',
            'they',
            'know',
            'want',
            'been',
            'good',
            'much',
            'some',
            'time',
            'very',
            'when',
            'come',
            'here',
            'just',
            'like',
            'long',
            'make',
            'many',
            'over',
            'such',
            'take',
            'than',
            'them',
            'well',
            'were',
          ].includes(word)
      );

    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word);
  },

  // Generate slug from title
  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Validate SEO elements
  validateSEO: (props: SEOProps): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!props.title || props.title.length < 30 || props.title.length > 60) {
      errors.push('Title should be between 30-60 characters');
    }

    if (!props.description || props.description.length < 120 || props.description.length > 160) {
      errors.push('Description should be between 120-160 characters');
    }

    if (!props.keywords || props.keywords.length < 3) {
      errors.push('At least 3 keywords should be provided');
    }

    if (!props.image) {
      errors.push('Open Graph image is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};

// Hook for dynamic SEO updates
export function useSEO(seoProps: SEOProps) {
  useEffect(() => {
    // Update document title
    if (seoProps.title) {
      document.title = seoProps.title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDescription && seoProps.description) {
      metaDescription.content = seoProps.description;
    }

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical && seoProps.canonical) {
      canonical.href = seoProps.canonical;
    }
  }, [seoProps]);
}
