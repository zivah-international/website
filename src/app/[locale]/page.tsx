'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import Navigation from '@/components/Navigation';
import QuoteForm from '@/components/QuoteForm';
import { Button } from '@/components/ui/button';

// Types for our data
interface Category {
  id: number; // Changed from string to number
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: number; // Changed from string to number
  name: string;
  slug: string;
  categoryId: number | null;
  description?: string;
  shortDescription?: string;
  sku?: string;
  specifications?: any;
  basePrice?: number;
  priceUnit?: string;
  stockQuantity: number;
  minOrderQty?: number;
  imageUrl?: string;
  imageGallery?: any;
  origin: string;
  harvestSeason?: string;
  certifications?: string[];
  nutritionalInfo?: any;
  isActive: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navigation height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // Handle logo click to reload page/scroll to top
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Optional: Also reload the page if you want
    // window.location.reload()
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, productsRes] = await Promise.all([
          fetch(`/api/categories?locale=${locale}`),
          fetch(`/api/products?locale=${locale}`),
        ]);

        if (categoriesRes.ok && productsRes.ok) {
          const categoriesData = await categoriesRes.json();
          const productsData = await productsRes.json();

          // Handle the API response structure
          const categories = categoriesData.data || categoriesData || [];
          const products = productsData.data || productsData || [];

          // Process products to ensure proper typing
          const processedProducts = products.map((product: any) => ({
            ...product,
            basePrice: product.basePrice ? parseFloat(product.basePrice) : null,
            certifications: Array.isArray(product.certifications) ? product.certifications : [],
          }));

          setCategories(Array.isArray(categories) ? categories : []);
          setProducts(Array.isArray(processedProducts) ? processedProducts : []);
          setFilteredProducts(Array.isArray(processedProducts) ? processedProducts : []);
        } else {
          // API responses failed
          setCategories([]);
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        // Error fetching data
        setCategories([]);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  // Filter products by category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products || []);
    } else {
      const filtered = (products || []).filter(
        product => product.category?.slug === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  return (
    <div className='min-h-screen'>
      {/* Enhanced Navigation */}
      <Navigation onScrollToSection={scrollToSection} />

      {/* Hero Section */}
      <section
        className='from-background via-background to-accent/5 dark:from-background dark:via-background dark:to-primary/5 relative overflow-hidden bg-gradient-to-br py-20 pt-28'
        id='home'
      >
        {/* Background Pattern */}
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,123,49,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,123,49,0.05),transparent_50%)]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(13,140,73,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(13,140,73,0.05),transparent_50%)]' />

        <div className='relative container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            <div className='space-y-8'>
              <div className='bg-accent/15 text-accent border-accent/20 mb-6 inline-block rounded-full border px-6 py-3 text-sm font-semibold shadow-sm backdrop-blur-sm'>
                {t('hero.badge')}
              </div>

              <h1 className='text-foreground mb-6 text-3xl leading-tight font-bold sm:text-4xl lg:text-6xl'>
                {t('hero.title')}{' '}
                <span className='from-accent to-primary bg-gradient-to-r bg-clip-text text-transparent'>
                  {t('hero.titleHighlight')}
                </span>{' '}
                {t('hero.titleEnd')}
              </h1>

              <p className='text-muted-foreground mb-8 max-w-2xl text-lg leading-relaxed sm:text-xl'>
                {t('hero.description')}
              </p>

              <div className='mb-12 flex flex-col gap-4 sm:flex-row'>
                <Button
                  onClick={() => scrollToSection('products')}
                  variant='accent'
                  size='xl'
                  className='shadow-lg transition-all duration-300 hover:shadow-xl'
                >
                  <span className='mr-2'>🌟</span>
                  {t('hero.exploreProducts')}
                </Button>
                <Button
                  onClick={() => scrollToSection('quote')}
                  variant='outline'
                  size='xl'
                  className='hover:bg-accent/5 border-2 transition-all duration-300'
                >
                  <span className='mr-2'>💬</span>
                  {t('hero.requestQuote')}
                </Button>
              </div>

              <div className='grid grid-cols-2 gap-6 lg:grid-cols-4'>
                <div className='group bg-card/50 border-border/50 hover:border-accent/30 rounded-xl border p-4 text-center backdrop-blur-sm transition-all duration-300'>
                  <div className='text-primary text-3xl font-bold transition-transform duration-300 group-hover:scale-110'>
                    1+
                  </div>
                  <div className='text-muted-foreground font-medium'>
                    {t('hero.stats.countriesServed')}
                  </div>
                </div>
                <div className='group bg-card/50 border-border/50 hover:border-secondary/30 rounded-xl border p-4 text-center backdrop-blur-sm transition-all duration-300'>
                  <div className='text-secondary text-3xl font-bold transition-transform duration-300 group-hover:scale-110'>
                    1+
                  </div>
                  <div className='text-muted-foreground font-medium'>
                    {t('hero.stats.containersYear')}
                  </div>
                </div>
                <div className='group bg-card/50 border-border/50 hover:border-accent/30 rounded-xl border p-4 text-center backdrop-blur-sm transition-all duration-300'>
                  <div className='text-accent text-3xl font-bold transition-transform duration-300 group-hover:scale-110'>
                    1+
                  </div>
                  <div className='text-muted-foreground font-medium'>
                    {t('hero.stats.yearsExperience')}
                  </div>
                </div>
                <div className='group bg-card/50 border-border/50 hover:border-primary/30 rounded-xl border p-4 text-center backdrop-blur-sm transition-all duration-300'>
                  <div className='text-primary text-3xl font-bold transition-transform duration-300 group-hover:scale-110'>
                    99.8%
                  </div>
                  <div className='text-muted-foreground font-medium'>
                    {t('hero.stats.qualityGuaranteed')}
                  </div>
                </div>
              </div>
            </div>

            <div className='lg:text-right'>
              <div className='bg-card/80 border-border/50 rounded-2xl border p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl'>
                <div className='text-foreground mb-4 flex items-center justify-center text-xl font-bold lg:justify-end'>
                  <span className='mr-2'>🌟</span>
                  {t('hero.premiumProducts')}
                </div>
                <div className='text-muted-foreground space-y-2 text-center lg:text-right'>
                  <div className='flex items-center justify-center lg:justify-end'>
                    <span className='text-accent mr-2'>🍍</span>
                    {t('hero.productTypes.tropicalFruits')}
                  </div>
                  <div className='flex items-center justify-center lg:justify-end'>
                    <span className='text-primary mr-2'>🦐</span>
                    {t('hero.productTypes.premiumSeafood')}
                  </div>
                  <div className='flex items-center justify-center lg:justify-end'>
                    <span className='text-secondary mr-2'>☕</span>
                    {t('hero.productTypes.highlandCoffee')}
                  </div>
                  <div className='flex items-center justify-center lg:justify-end'>
                    <span className='text-accent mr-2'>🌱</span>
                    {t('hero.productTypes.aquaculture')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        className='bg-background pt-20 pb-20'
        id='products'
      >
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Featured Categories */}
          <div className='mb-20'>
            <div className='mb-16 text-center'>
              <div className='bg-secondary/10 text-secondary mb-4 inline-block rounded-full px-4 py-2 text-sm font-medium'>
                {t('products.badge')}
              </div>
              <h2 className='text-foreground mb-6 text-4xl font-bold'>{t('products.title')}</h2>
              <p className='text-muted-foreground mx-auto max-w-4xl text-xl'>
                {loading ? t('products.loading') : t('products.description')}
              </p>
            </div>

            {loading ? (
              <div className='grid gap-8 lg:grid-cols-2'>
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className='border-border bg-card animate-pulse rounded-2xl border p-8'
                  >
                    <div className='bg-muted mb-6 h-16 w-16 rounded' />
                    <div className='bg-muted mb-4 h-6 rounded' />
                    <div className='bg-muted mb-6 h-4 rounded' />
                    <div className='mb-6 space-y-2'>
                      {[...Array(4)].map((_, idx) => (
                        <div
                          key={idx}
                          className='bg-muted h-4 rounded'
                        />
                      ))}
                    </div>
                    <div className='bg-muted h-10 w-40 rounded' />
                  </div>
                ))}
              </div>
            ) : (
              <div className='grid gap-6 sm:gap-8 lg:grid-cols-2'>
                {(categories || []).map((category, index) => {
                  const categoryProducts = (products || []).filter(
                    p => p.category?.slug === category.slug
                  );
                  const bgColors = [
                    'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:from-primary/10 hover:to-primary/15',
                    'bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 hover:from-secondary/10 hover:to-secondary/15',
                    'bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:from-accent/10 hover:to-accent/15',
                  ];

                  return (
                    <div
                      key={category.id}
                      className={`${bgColors[index % bgColors.length]} rounded-2xl border p-4 sm:p-6 lg:p-8`}
                    >
                      <div className='mb-4 text-4xl sm:mb-6 sm:text-6xl'>{category.icon}</div>
                      <h3 className='text-foreground mb-3 text-xl font-bold sm:mb-4 sm:text-2xl'>
                        {category.name}
                      </h3>
                      <p className='text-muted-foreground mb-4 text-sm leading-relaxed sm:mb-6 sm:text-base'>
                        {category.description}
                      </p>
                      <ul className='mb-4 space-y-2 sm:mb-6'>
                        {categoryProducts.slice(0, 4).map(product => (
                          <li
                            key={product.id}
                            className='text-muted-foreground flex items-start text-sm sm:items-center sm:text-base'
                          >
                            <span className='text-accent mt-0.5 mr-2 flex-shrink-0 sm:mt-0'>✓</span>
                            <span className='min-w-0 flex-1'>{product.name}</span>
                            {product.basePrice && (
                              <span className='text-accent ml-2 flex-shrink-0 text-xs font-medium sm:text-sm'>
                                ${product.basePrice.toFixed(2)}/{product.priceUnit}
                              </span>
                            )}
                          </li>
                        ))}
                        {categoryProducts.length > 4 && (
                          <li className='text-muted-foreground flex items-center text-sm sm:text-base'>
                            <span className='text-accent mr-2 flex-shrink-0'>✓</span>
                            <span>
                              {t('products.moreProducts', { count: categoryProducts.length - 4 })}
                            </span>
                          </li>
                        )}
                      </ul>
                      <div className='flex flex-col gap-2 sm:flex-row sm:gap-3'>
                        <Button
                          onClick={() => scrollToSection('quote')}
                          variant={index === 0 ? 'default' : index === 1 ? 'secondary' : 'accent'}
                          size='lg'
                          className='w-full text-sm sm:w-auto sm:text-base'
                        >
                          {t('products.requestQuote')}
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedCategory(category.slug);
                            // Scroll to the catalog section within the same products section
                            const catalogElement = document.querySelector(
                              '#products .products-catalog'
                            );
                            if (catalogElement) {
                              catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                          variant='outline'
                          size='lg'
                          className='w-full text-sm sm:w-auto sm:text-base'
                        >
                          {t('products.viewProducts', { count: categoryProducts.length })}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Complete Catalog */}
          <div className='products-catalog border-border/20 border-t pt-20'>
            <div className='mb-16 text-center'>
              <div className='bg-accent/10 text-accent mb-4 inline-block rounded-full px-4 py-2 text-sm font-medium'>
                {t('products.catalog.badge')}
              </div>
              <h2 className='text-foreground mb-6 text-3xl font-bold sm:text-4xl'>
                {t('products.catalog.title')}
              </h2>
              <p className='text-muted-foreground mx-auto mb-8 max-w-3xl text-lg sm:text-xl'>
                {loading
                  ? t('products.loading')
                  : t('products.catalog.description', { count: (filteredProducts || []).length })}
              </p>

              {/* Category Filter */}
              {!loading && (categories || []).length > 0 && (
                <div className='mb-8 flex flex-wrap justify-center gap-3'>
                  <Button
                    onClick={() => setSelectedCategory('all')}
                    variant={selectedCategory === 'all' ? 'accent' : 'outline'}
                    size='sm'
                    className='rounded-full'
                  >
                    {t('products.catalog.all')} ({(products || []).length})
                  </Button>
                  {(categories || []).map(category => {
                    const categoryProductCount = (products || []).filter(
                      p => p.category?.slug === category.slug
                    ).length;
                    return (
                      <Button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.slug)}
                        variant={selectedCategory === category.slug ? 'accent' : 'outline'}
                        size='sm'
                        className='rounded-full'
                      >
                        <span className='mr-2'>{category.icon}</span>
                        {category.name} ({categoryProductCount})
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
                {[...Array(12)].map((_, index) => (
                  <div
                    key={index}
                    className='border-border bg-card animate-pulse rounded-lg border p-4'
                  >
                    <div className='bg-muted mb-2 h-4 rounded' />
                    <div className='bg-muted h-3 rounded' />
                  </div>
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
                {(filteredProducts || []).map(product => (
                  <div
                    key={product.id}
                    className='group border-border bg-card hover:border-accent/30 focus:ring-accent/50 cursor-pointer rounded-lg border p-4 text-center transition-all duration-300 hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:outline-none'
                    onClick={() => {
                      // Scroll to quote section
                      document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    role='button'
                    tabIndex={0}
                    aria-label={`Cotizar ${product.name}`}
                  >
                    <div className='mb-2'>
                      <span className='text-2xl'>{product.category?.icon || '📦'}</span>
                    </div>
                    <h4 className='group-hover:text-accent text-foreground mb-1 text-sm font-semibold transition-colors'>
                      {product.name}
                    </h4>
                    <p className='text-muted-foreground mb-2 text-xs'>
                      {product.shortDescription || 'Premium quality'}
                    </p>
                    <div className='text-muted-foreground flex items-center justify-center gap-1 text-xs'>
                      <span className='text-accent'>✓</span>
                      <span>{product.origin}</span>
                    </div>
                    {product.basePrice && (
                      <div className='text-accent mt-2 text-xs font-medium'>
                        ${product.basePrice.toFixed(2)}/{product.priceUnit}
                      </div>
                    )}
                    {product.certifications && product.certifications.length > 0 && (
                      <div className='mt-2 flex flex-wrap justify-center gap-1'>
                        {product.certifications.slice(0, 2).map((cert, idx) => (
                          <span
                            key={idx}
                            className='bg-primary/10 text-primary rounded px-2 py-1 text-xs'
                          >
                            {cert}
                          </span>
                        ))}
                        {product.certifications.length > 2 && (
                          <span className='text-muted-foreground text-xs'>
                            +{product.certifications.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* No products found */}
            {!loading && (filteredProducts || []).length === 0 && (
              <div className='py-12 text-center'>
                <div className='mb-4 text-6xl'>🔍</div>
                <h3 className='text-foreground mb-2 text-xl font-semibold'>
                  {t('products.catalog.noProducts.title')}
                </h3>
                <p className='text-muted-foreground'>
                  {t('products.catalog.noProducts.description')}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section
        className='from-secondary via-primary to-accent bg-gradient-to-br pt-20 pb-20 text-white'
        id='quote'
      >
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-4xl'>
            <div className='mb-12 text-center'>
              <div className='mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium'>
                {t('quote.badge')}
              </div>
              <h2 className='mb-6 text-3xl font-bold sm:text-4xl'>{t('quote.title')}</h2>
              <p className='mb-8 text-lg opacity-90 sm:text-xl'>{t('quote.description')}</p>

              <div className='mb-12 grid gap-6 md:grid-cols-3'>
                <div className='rounded-xl bg-white/10 p-6 backdrop-blur-sm'>
                  <div className='mb-4 text-3xl'>🔍</div>
                  <h3 className='mb-2 text-lg font-semibold'>
                    {t('quote.features.smartSearch.title')}
                  </h3>
                  <p className='text-sm opacity-90'>
                    {t('quote.features.smartSearch.description')}
                  </p>
                </div>

                <div className='rounded-xl bg-white/10 p-6 backdrop-blur-sm'>
                  <div className='mb-4 text-3xl'>🛒</div>
                  <h3 className='mb-2 text-lg font-semibold'>
                    {t('quote.features.multipleSelection.title')}
                  </h3>
                  <p className='text-sm opacity-90'>
                    {t('quote.features.multipleSelection.description')}
                  </p>
                </div>

                <div className='rounded-xl bg-white/10 p-6 backdrop-blur-sm'>
                  <div className='mb-4 text-3xl'>📧</div>
                  <h3 className='mb-2 text-lg font-semibold'>
                    {t('quote.features.autoSend.title')}
                  </h3>
                  <p className='text-sm opacity-90'>{t('quote.features.autoSend.description')}</p>
                </div>
              </div>

              <QuoteForm initialProducts={products} />
            </div>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section
        className='bg-background pt-20 pb-20'
        id='quality'
      >
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            <div>
              <h2 className='text-foreground mb-6 text-4xl font-bold'>{t('quality.title')}</h2>
              <p className='text-muted-foreground mb-8 text-xl'>{t('quality.description')}</p>

              <div className='grid grid-cols-2 gap-6'>
                <div className='bg-muted rounded-lg p-4 text-center'>
                  <div className='text-accent mb-2 text-3xl font-bold'>HACCP</div>
                  <div className='text-muted-foreground'>{t('quality.certifications.haccp')}</div>
                </div>
                <div className='bg-muted rounded-lg p-4 text-center'>
                  <div className='text-accent mb-2 text-3xl font-bold'>BRC</div>
                  <div className='text-muted-foreground'>{t('quality.certifications.brc')}</div>
                </div>
                <div className='bg-muted rounded-lg p-4 text-center'>
                  <div className='text-accent mb-2 text-3xl font-bold'>BAP</div>
                  <div className='text-muted-foreground'>{t('quality.certifications.bap')}</div>
                </div>
                <div className='bg-muted rounded-lg p-4 text-center'>
                  <div className='text-accent mb-2 text-3xl font-bold'>GlobalGAP</div>
                  <div className='text-muted-foreground'>
                    {t('quality.certifications.globalGap')}
                  </div>
                </div>
              </div>
            </div>

            <div className='from-accent to-secondary rounded-2xl bg-gradient-to-br p-12 text-center text-white'>
              <div className='mb-6 text-6xl'>🏆</div>
              <h3 className='mb-4 text-2xl font-bold'>{t('quality.awards.title')}</h3>
              <p className='opacity-90'>{t('quality.awards.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section
        className='bg-muted/30 pt-20 pb-20'
        id='markets'
      >
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <div className='bg-accent/10 text-accent mb-4 inline-block rounded-full px-4 py-2 text-sm font-medium'>
              {t('markets.badge')}
            </div>
            <h2 className='text-foreground mb-6 text-4xl font-bold'>{t('markets.title')}</h2>
            <p className='text-muted-foreground mx-auto max-w-4xl text-xl'>
              {t('markets.description')}
            </p>
          </div>

          <div className='mb-16 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6'>
            <div className='text-center'>
              <div className='text-accent text-4xl font-bold'>2+</div>
              <div className='text-muted-foreground'>{t('markets.stats.countriesServed')}</div>
            </div>
            <div className='text-center'>
              <div className='text-accent text-4xl font-bold'>1+</div>
              <div className='text-muted-foreground'>{t('markets.stats.containersYear')}</div>
            </div>
            <div className='text-center'>
              <div className='text-accent text-4xl font-bold'>4+</div>
              <div className='text-muted-foreground'>{t('markets.stats.yearsExperience')}</div>
            </div>
            <div className='text-center'>
              <div className='text-accent text-4xl font-bold'>100%</div>
              <div className='text-muted-foreground'>{t('markets.stats.certifiedProducts')}</div>
            </div>
            <div className='text-center'>
              <div className='text-accent text-4xl font-bold'>99.8%</div>
              <div className='text-muted-foreground'>{t('markets.stats.customerSatisfaction')}</div>
            </div>
            <div className='text-center'>
              <div className='text-accent text-4xl font-bold'>24/7</div>
              <div className='text-muted-foreground'>{t('markets.stats.specializedSupport')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className='bg-background pt-20 pb-20'
        id='contact'
      >
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <div className='bg-accent/10 text-accent mb-4 inline-block rounded-full px-4 py-2 text-sm font-medium'>
              {t('contact.badge')}
            </div>
            <h2 className='text-foreground mb-6 text-4xl font-bold'>{t('contact.title')}</h2>
            <p className='text-muted-foreground mx-auto max-w-3xl text-xl'>
              {t('contact.description')}
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
            <div className='bg-muted rounded-xl p-6 text-center'>
              <div className='mb-4 text-4xl'>🏢</div>
              <h4 className='text-foreground mb-2 text-lg font-semibold'>
                {t('contact.mainOffice')}
              </h4>
              <p className='text-muted-foreground'>
                Samborondón, Guayas
                <br />
                Ecuador
              </p>
            </div>

            <div className='bg-muted rounded-xl p-6 text-center'>
              <div className='mb-4 text-4xl'>🏢</div>
              <h4 className='text-foreground mb-2 text-lg font-semibold'>
                {t('contact.distributionOffice')}
              </h4>
              <p className='text-muted-foreground'>
                Miami, Florida
                <br />
                {t('contact.unitedStates')}
              </p>
            </div>

            <div className='bg-muted rounded-xl p-6 text-center'>
              <div className='mb-4 text-4xl'>📧</div>
              <h4 className='text-foreground mb-2 text-lg font-semibold'>
                {t('contact.commercialEmail')}
              </h4>
              <p className='text-muted-foreground'>
                <a
                  href='mailto:sales@zivahinternational.com'
                  className='hover:text-accent transition-colors'
                >
                  sales@zivahinternational.com
                </a>
                <br />
                <a
                  href='mailto:info@zivahinternational.com'
                  className='hover:text-accent transition-colors'
                >
                  info@zivahinternational.com
                </a>
              </p>
            </div>

            <div className='bg-muted rounded-xl p-6 text-center'>
              <div className='mb-4 text-4xl'>📱</div>
              <h4 className='text-foreground mb-2 text-lg font-semibold'>{t('contact.phone')}</h4>
              <p className='text-muted-foreground'>
                <a
                  href='tel:+593999002893'
                  className='hover:text-accent transition-colors'
                >
                  +593 99 900 2893
                </a>
              </p>
            </div>
          </div>

          <div className='bg-muted mt-12 rounded-xl p-8 text-center'>
            <div className='mb-4 text-4xl'>⏰</div>
            <h4 className='text-foreground mb-4 text-lg font-semibold'>
              {t('contact.businessHours')}
            </h4>
            <div className='grid gap-6 md:grid-cols-2'>
              <div>
                <strong className='text-foreground'>{t('contact.mainHQ')}</strong>
                <br />
                <span className='text-muted-foreground'>
                  {t('contact.weekdays')}: 8:00 AM - 6:00 PM ECT
                </span>
              </div>
              <div>
                <strong className='text-foreground'>{t('contact.miamiOffice')}</strong>
                <br />
                <span className='text-muted-foreground'>
                  {t('contact.weekdays')}: 8:00 AM - 6:00 PM EST
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-muted/50 text-foreground py-16'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
            <div>
              <h4 className='text-foreground mb-4 text-lg font-semibold'>
                ZIVAH International S.A.
              </h4>
              <p className='text-muted-foreground mb-4 text-sm'>{t('footer.companyDescription')}</p>
              <p className='text-muted-foreground text-sm'>
                <strong className='text-foreground'>{t('footer.specialists')}</strong>{' '}
                {t('footer.specialistsList')}
              </p>
            </div>

            <div>
              <h4 className='text-foreground mb-4 text-lg font-semibold'>
                {t('footer.mainProducts')}
              </h4>
              <ul className='text-muted-foreground space-y-2'>
                <li>
                  <a
                    href='#products'
                    className='hover:text-accent transition-colors'
                  >
                    {t('footer.tropicalFruits')}
                  </a>
                </li>
                <li>
                  <a
                    href='#products'
                    className='hover:text-accent transition-colors'
                  >
                    {t('footer.seafood')}
                  </a>
                </li>
                <li>
                  <a
                    href='#products'
                    className='hover:text-accent transition-colors'
                  >
                    {t('footer.arabicaCoffee')}
                  </a>
                </li>
                <li>
                  <a
                    href='#products'
                    className='hover:text-accent transition-colors'
                  >
                    {t('footer.premiumShrimp')}
                  </a>
                </li>
                <li>
                  <a
                    href='#products'
                    className='hover:text-accent transition-colors'
                  >
                    {t('footer.shrimpLarvae')}
                  </a>
                </li>
                <li>
                  <a
                    href='#products'
                    className='hover:text-accent transition-colors'
                  >
                    {t('footer.viewFullCatalog')}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='text-foreground mb-4 text-lg font-semibold'>{t('footer.services')}</h4>
              <ul className='text-muted-foreground space-y-2'>
                <li>
                  <a
                    href='#quality'
                    className='hover:text-accent transition-colors'
                  >
                    {t('footer.certifications')}
                  </a>
                </li>
                <li>
                  <a
                    href='#quote'
                    className='hover:text-accent transition-colors'
                  >
                    {t('footer.quotes')}
                  </a>
                </li>
                <li>
                  <a
                    href='#markets'
                    className='hover:text-accent transition-colors'
                  >
                    {t('footer.globalDistribution')}
                  </a>
                </li>
                <li>
                  <a
                    href='#contact'
                    className='hover:text-accent transition-colors'
                  >
                    {t('footer.technicalAdvice')}
                  </a>
                </li>
                <li>
                  <a
                    href='#contact'
                    className='hover:text-accent transition-colors'
                  >
                    {t('footer.support247')}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='text-foreground mb-4 text-lg font-semibold'>{t('footer.legal')}</h4>
              <ul className='text-muted-foreground space-y-2'>
                <li>
                  <Link
                    href='/legal/privacy-policy'
                    className='hover:text-accent transition-colors'
                  >
                    {t('footer.privacyPolicy')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/legal/terms-of-service'
                    className='hover:text-accent transition-colors'
                  >
                    {t('footer.termsConditions')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/legal/cookie-policy'
                    className='hover:text-accent transition-colors'
                  >
                    {t('footer.cookiePolicy')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/legal/data-protection'
                    className='hover:text-accent transition-colors'
                  >
                    {t('footer.dataProtection')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-border border-t pt-8'>
            <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
              <p className='text-muted-foreground text-sm'>
                {t('footer.copyright', { year: new Date().getFullYear() })}
              </p>
              <div className='flex items-center gap-4'>
                <a
                  href='https://www.facebook.com/zivahinternationalsa'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-muted-foreground hover:text-accent transition-colors'
                  aria-label='Facebook'
                >
                  <svg
                    className='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                  >
                    <path
                      fillRule='evenodd'
                      d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                      clipRule='evenodd'
                    />
                  </svg>
                </a>
              </div>
              <p className='text-muted-foreground text-sm'>{t('footer.tagline')}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
