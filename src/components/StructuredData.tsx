/**
 * StructuredData Component for Maximum SEO Optimization
 * Implements comprehensive JSON-LD structured data for global SEO
 */

import Script from 'next/script';

// Base URL for the website
const BASE_URL = 'https://zivahinternational.com';

// Organization Schema
export function OrganizationSchema({ locale = 'es' }: { locale?: string }) {
  const isSpanish = locale === 'es';

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'ZIVAH International S.A.',
    alternateName: ['ZIVAH', 'ZIVAH International', 'ZIVAH Ecuador'],
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${BASE_URL}/#logo`,
      url: `${BASE_URL}/assets/images/zivah-logo.svg`,
      contentUrl: `${BASE_URL}/assets/images/zivah-logo.svg`,
      width: 400,
      height: 100,
      caption: 'ZIVAH International S.A. Logo',
    },
    image: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/assets/images/zivah-og-image.jpg`,
      width: 1200,
      height: 630,
    },
    description: isSpanish
      ? 'Exportadores líderes de productos ecuatorianos premium desde Ecuador hacia el mundo. Especialistas en frutas tropicales, camarón, café arábica y larvas de acuicultura.'
      : 'Leading exporters of premium Ecuadorian products from Ecuador to the world. Specialists in tropical fruits, shrimp, arabica coffee, and aquaculture larvae.',
    foundingDate: '2020',
    foundingLocation: {
      '@type': 'Place',
      name: 'Samborondón, Guayas, Ecuador',
    },
    slogan: isSpanish ? 'Desde Ecuador hacia el Mundo' : 'From Ecuador to the World',
    legalName: 'ZIVAH International S.A.',
    taxID: 'RUC Ecuador',
    naics: '424480', // Fresh Fruit and Vegetable Merchant Wholesalers
    isicV4: '4630', // Wholesale of food, beverages and tobacco
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 10,
      maxValue: 50,
    },
    address: [
      {
        '@type': 'PostalAddress',
        '@id': `${BASE_URL}/#address-ecuador`,
        streetAddress: 'Casa Matriz Mz 10 S L 31',
        addressLocality: 'Samborondón',
        addressRegion: 'Guayas',
        postalCode: '092301',
        addressCountry: {
          '@type': 'Country',
          name: 'Ecuador',
          alternateName: 'EC',
        },
      },
      {
        '@type': 'PostalAddress',
        '@id': `${BASE_URL}/#address-usa`,
        addressLocality: 'Miami',
        addressRegion: 'FL',
        addressCountry: {
          '@type': 'Country',
          name: 'United States',
          alternateName: 'US',
        },
      },
    ],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -2.1057,
      longitude: -79.889,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+593999002893',
        contactType: 'sales',
        email: 'info@zivahinternational.com',
        areaServed: ['Worldwide', 'Global'],
        availableLanguage: ['Spanish', 'English'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '18:00',
        },
      },
      {
        '@type': 'ContactPoint',
        telephone: '+593999002893',
        contactType: 'customer service',
        email: 'info@zivahinternational.com',
        areaServed: ['Worldwide'],
        availableLanguage: ['Spanish', 'English'],
      },
    ],
    sameAs: [
      'https://www.linkedin.com/company/zivah-international',
      'https://twitter.com/ZivahIntl',
      'https://www.instagram.com/zivahintl',
      'https://www.facebook.com/zivahinternational',
    ],
    knowsAbout: [
      'Ecuadorian Product Export',
      'Tropical Fruits',
      'Shrimp Export',
      'Aquaculture Larvae',
      'Arabica Coffee',
      'International Trade',
      'Food Export',
      'B2B Export',
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'HACCP',
        description: 'Hazard Analysis Critical Control Point',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'BRC Food Safety',
        description: 'British Retail Consortium Food Safety Standard',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'BAP',
        description: 'Best Aquaculture Practices',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'GlobalG.A.P.',
        description: 'Good Agricultural Practices',
      },
    ],
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Canada' },
      { '@type': 'Country', name: 'Spain' },
      { '@type': 'Country', name: 'Germany' },
      { '@type': 'Country', name: 'France' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'Italy' },
      { '@type': 'Country', name: 'Netherlands' },
      { '@type': 'Country', name: 'Belgium' },
      { '@type': 'Country', name: 'China' },
      { '@type': 'Country', name: 'Japan' },
      { '@type': 'Country', name: 'South Korea' },
      { '@type': 'Country', name: 'Australia' },
      { '@type': 'Country', name: 'Chile' },
      { '@type': 'Country', name: 'Colombia' },
      { '@type': 'Country', name: 'Peru' },
      { '@type': 'Country', name: 'Mexico' },
      { '@type': 'Country', name: 'Brazil' },
      { '@type': 'Country', name: 'Argentina' },
      { '@type': 'GeoCircle', name: 'Worldwide' },
    ],
  };

  return (
    <Script
      id='organization-schema'
      type='application/ld+json'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
    />
  );
}

// Local Business Schema for both locations
export function LocalBusinessSchema({ locale = 'es' }: { locale?: string }) {
  const isSpanish = locale === 'es';

  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#localbusiness`,
    name: 'ZIVAH International S.A.',
    image: `${BASE_URL}/assets/images/zivah-og-image.jpg`,
    url: BASE_URL,
    telephone: '+593999002893',
    email: 'info@zivahinternational.com',
    priceRange: '$$$',
    description: isSpanish
      ? 'Exportadores de productos ecuatorianos premium: frutas tropicales, camarón, café y larvas de acuicultura.'
      : 'Premium Ecuadorian product exporters: tropical fruits, shrimp, coffee and aquaculture larvae.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Casa Matriz Mz 10 S L 31',
      addressLocality: 'Samborondón',
      addressRegion: 'Guayas',
      postalCode: '092301',
      addressCountry: 'EC',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -2.1057,
      longitude: -79.889,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    paymentAccepted: ['Cash', 'Credit Card', 'Wire Transfer', 'Letter of Credit'],
    currenciesAccepted: 'USD, EUR',
  };

  return (
    <Script
      id='local-business-schema'
      type='application/ld+json'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
    />
  );
}

// Website Schema
export function WebSiteSchema({ locale = 'es' }: { locale?: string }) {
  const isSpanish = locale === 'es';

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'ZIVAH International S.A.',
    description: isSpanish
      ? 'Portal oficial de ZIVAH International S.A. - Exportadores de productos ecuatorianos premium'
      : 'Official portal of ZIVAH International S.A. - Premium Ecuadorian product exporters',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: [
      { '@type': 'Language', name: 'Spanish', alternateName: 'es' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
      { '@type': 'Language', name: 'Portuguese', alternateName: 'pt' },
      { '@type': 'Language', name: 'French', alternateName: 'fr' },
      { '@type': 'Language', name: 'German', alternateName: 'de' },
      { '@type': 'Language', name: 'Chinese', alternateName: 'zh' },
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id='website-schema'
      type='application/ld+json'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
    />
  );
}

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id='breadcrumb-schema'
      type='application/ld+json'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
    />
  );
}

// Product Schema for individual products
interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  sku?: string;
  brand?: string;
  category?: string;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  rating?: number;
  reviewCount?: number;
  url: string;
}

export function ProductSchema({
  name,
  description,
  image,
  sku,
  brand = 'ZIVAH International',
  category,
  price,
  currency = 'USD',
  availability = 'InStock',
  rating,
  reviewCount,
  url,
}: ProductSchemaProps) {
  const productData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    url,
    sku,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    category,
    manufacturer: {
      '@type': 'Organization',
      name: 'ZIVAH International S.A.',
    },
    countryOfOrigin: {
      '@type': 'Country',
      name: 'Ecuador',
    },
  };

  if (price) {
    productData.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      seller: {
        '@type': 'Organization',
        name: 'ZIVAH International S.A.',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'Worldwide',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          },
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 5,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 7,
            maxValue: 30,
            unitCode: 'DAY',
          },
        },
      },
    };
  }

  if (rating && reviewCount) {
    productData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return (
    <Script
      id={`product-schema-${sku || name.replace(/\s+/g, '-').toLowerCase()}`}
      type='application/ld+json'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }}
    />
  );
}

// FAQ Schema
interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id='faq-schema'
      type='application/ld+json'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
}

// Service Schema for export services
interface ServiceSchemaProps {
  name: string;
  description: string;
  serviceType: string;
  areaServed?: string[];
  provider?: string;
}

export function ServiceSchema({
  name,
  description,
  serviceType,
  areaServed = ['Worldwide'],
  provider = 'ZIVAH International S.A.',
}: ServiceSchemaProps) {
  const serviceData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    provider: {
      '@type': 'Organization',
      name: provider,
      '@id': `${BASE_URL}/#organization`,
    },
    areaServed: areaServed.map(area => ({
      '@type': area === 'Worldwide' ? 'GeoCircle' : 'Country',
      name: area,
    })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: BASE_URL,
      servicePhone: '+593999002893',
      serviceSmsNumber: '+593999002893',
    },
  };

  return (
    <Script
      id={`service-schema-${serviceType.replace(/\s+/g, '-').toLowerCase()}`}
      type='application/ld+json'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
    />
  );
}

// How To Schema for processes
interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
}) {
  const howToData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
    })),
  };

  return (
    <Script
      id='howto-schema'
      type='application/ld+json'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(howToData) }}
    />
  );
}

// Offer Catalog Schema
export function OfferCatalogSchema({ locale = 'es' }: { locale?: string }) {
  const isSpanish = locale === 'es';

  const catalogData = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: isSpanish
      ? 'Catálogo de Productos Ecuatorianos Premium'
      : 'Premium Ecuadorian Products Catalog',
    description: isSpanish
      ? 'Catálogo completo de productos ecuatorianos para exportación mundial'
      : 'Complete catalog of Ecuadorian products for worldwide export',
    url: `${BASE_URL}/products`,
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: isSpanish ? 'Frutas Tropicales' : 'Tropical Fruits',
        description: isSpanish
          ? 'Mango, piña, banano, papaya y frutas exóticas ecuatorianas'
          : 'Mango, pineapple, banana, papaya and exotic Ecuadorian fruits',
        itemListElement: [
          { '@type': 'Product', name: 'Mango Ecuatoriano', category: 'Tropical Fruits' },
          { '@type': 'Product', name: 'Piña Ecuatoriana', category: 'Tropical Fruits' },
          { '@type': 'Product', name: 'Banano Ecuatoriano', category: 'Tropical Fruits' },
          { '@type': 'Product', name: 'Papaya Ecuatoriana', category: 'Tropical Fruits' },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: isSpanish ? 'Productos del Mar' : 'Seafood Products',
        description: isSpanish
          ? 'Camarón vannamei premium con certificación internacional'
          : 'Premium vannamei shrimp with international certification',
        itemListElement: [
          { '@type': 'Product', name: 'Camarón Vannamei', category: 'Seafood' },
          { '@type': 'Product', name: 'Camarón Premium', category: 'Seafood' },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: isSpanish ? 'Café Arábica' : 'Arabica Coffee',
        description: isSpanish
          ? 'Café de altura ecuatoriano premium'
          : 'Premium highland Ecuadorian coffee',
        itemListElement: [
          { '@type': 'Product', name: 'Café Arábica Ecuatoriano', category: 'Coffee' },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: isSpanish ? 'Acuicultura' : 'Aquaculture',
        description: isSpanish
          ? 'Larvas de alta calidad para proyectos acuícolas'
          : 'High-quality larvae for aquaculture projects',
        itemListElement: [
          { '@type': 'Product', name: 'Larvas de Camarón', category: 'Aquaculture' },
          { '@type': 'Product', name: 'Post-larvas', category: 'Aquaculture' },
        ],
      },
    ],
  };

  return (
    <Script
      id='offer-catalog-schema'
      type='application/ld+json'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogData) }}
    />
  );
}

// Contact Page Schema
export function ContactPageSchema({ locale = 'es' }: { locale?: string }) {
  const isSpanish = locale === 'es';

  const contactData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: isSpanish ? 'Contacto - ZIVAH International' : 'Contact - ZIVAH International',
    description: isSpanish
      ? 'Contáctenos para cotizaciones, información de productos y consultas comerciales'
      : 'Contact us for quotes, product information and business inquiries',
    url: `${BASE_URL}/contact`,
    mainEntity: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
    },
  };

  return (
    <Script
      id='contact-page-schema'
      type='application/ld+json'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(contactData) }}
    />
  );
}

// Combined default schemas for homepage
export default function StructuredData({ locale = 'es' }: { locale?: string }) {
  return (
    <>
      <OrganizationSchema locale={locale} />
      <LocalBusinessSchema locale={locale} />
      <WebSiteSchema locale={locale} />
      <OfferCatalogSchema locale={locale} />
    </>
  );
}
