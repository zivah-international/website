'use client';

import Link from 'next/link';
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
          fetch('/api/categories'),
          fetch('/api/products'),
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
          console.error('API responses not ok:', {
            categoriesRes: categoriesRes.status,
            productsRes: productsRes.status,
          });
          setCategories([]);
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories([]);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
                🇪🇨 Desde Ecuador Hacia el Mundo - Samborondón, Guayas
              </div>

              <h1 className='text-foreground mb-6 text-3xl leading-tight font-bold sm:text-4xl lg:text-6xl'>
                Los Mejores Productos{' '}
                <span className='from-accent to-primary bg-gradient-to-r bg-clip-text text-transparent'>
                  Ecuatorianos
                </span>{' '}
                para Mercados Internacionales
              </h1>

              <p className='text-muted-foreground mb-8 max-w-2xl text-lg leading-relaxed sm:text-xl'>
                Desde Ecuador hacia el mundo, conectamos la excelencia ecuatoriana con compradores
                globales. Con sede principal en Samborondón, Guayas y oficina de distribución en
                Miami, somos especialistas en acuicultura, larvas de camarón, cultivo de árboles
                frutales y productos premium ecuatorianos.
              </p>

              <div className='mb-12 flex flex-col gap-4 sm:flex-row'>
                <Button
                  onClick={() => scrollToSection('products')}
                  variant='accent'
                  size='xl'
                  className='shadow-lg transition-all duration-300 hover:shadow-xl'
                >
                  <span className='mr-2'>🌟</span>
                  Explorar Productos
                </Button>
                <Button
                  onClick={() => scrollToSection('quote')}
                  variant='outline'
                  size='xl'
                  className='hover:bg-accent/5 border-2 transition-all duration-300'
                >
                  <span className='mr-2'>💬</span>
                  Solicitar Cotización
                </Button>
              </div>

              <div className='grid grid-cols-2 gap-6 lg:grid-cols-4'>
                <div className='group bg-card/50 border-border/50 hover:border-accent/30 rounded-xl border p-4 text-center backdrop-blur-sm transition-all duration-300'>
                  <div className='text-primary text-3xl font-bold transition-transform duration-300 group-hover:scale-110'>
                    1+
                  </div>
                  <div className='text-muted-foreground font-medium'>Países Atendidos</div>
                </div>
                <div className='group bg-card/50 border-border/50 hover:border-secondary/30 rounded-xl border p-4 text-center backdrop-blur-sm transition-all duration-300'>
                  <div className='text-secondary text-3xl font-bold transition-transform duration-300 group-hover:scale-110'>
                    1+
                  </div>
                  <div className='text-muted-foreground font-medium'>Contenedores/Año</div>
                </div>
                <div className='group bg-card/50 border-border/50 hover:border-accent/30 rounded-xl border p-4 text-center backdrop-blur-sm transition-all duration-300'>
                  <div className='text-accent text-3xl font-bold transition-transform duration-300 group-hover:scale-110'>
                    1+
                  </div>
                  <div className='text-muted-foreground font-medium'>Años de Experiencia</div>
                </div>
                <div className='group bg-card/50 border-border/50 hover:border-primary/30 rounded-xl border p-4 text-center backdrop-blur-sm transition-all duration-300'>
                  <div className='text-primary text-3xl font-bold transition-transform duration-300 group-hover:scale-110'>
                    99.8%
                  </div>
                  <div className='text-muted-foreground font-medium'>Calidad Garantizada</div>
                </div>
              </div>
            </div>

            <div className='lg:text-right'>
              <div className='bg-card/80 border-border/50 rounded-2xl border p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl'>
                <div className='text-foreground mb-4 flex items-center justify-center text-xl font-bold lg:justify-end'>
                  <span className='mr-2'>🌟</span>
                  Productos Ecuatorianos Premium
                </div>
                <div className='text-muted-foreground space-y-2 text-center lg:text-right'>
                  <div className='flex items-center justify-center lg:justify-end'>
                    <span className='text-accent mr-2'>🍍</span>
                    Frutas Tropicales
                  </div>
                  <div className='flex items-center justify-center lg:justify-end'>
                    <span className='text-primary mr-2'>🦐</span>
                    Mariscos Premium
                  </div>
                  <div className='flex items-center justify-center lg:justify-end'>
                    <span className='text-secondary mr-2'>☕</span>
                    Café de Altura
                  </div>
                  <div className='flex items-center justify-center lg:justify-end'>
                    <span className='text-accent mr-2'>🌱</span>
                    Acuicultura
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
                Nuestros Productos Principales
              </div>
              <h2 className='text-foreground mb-6 text-4xl font-bold'>
                Excelencia Ecuatoriana en Cada Envío
              </h2>
              <p className='text-muted-foreground mx-auto max-w-4xl text-xl'>
                {loading
                  ? 'Cargando productos...'
                  : 'Desde frutas tropicales hasta productos marinos premium y larvas de acuicultura, llevamos lo mejor de Ecuador a mesas de todo el mundo con la más alta calidad y trazabilidad.'}
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
                            <span>+{categoryProducts.length - 4} productos más</span>
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
                          Solicitar Cotización
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
                          Ver {categoryProducts.length} productos
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
                Catálogo Completo
              </div>
              <h2 className='text-foreground mb-6 text-3xl font-bold sm:text-4xl'>
                Todos Nuestros Productos Ecuatorianos
              </h2>
              <p className='text-muted-foreground mx-auto mb-8 max-w-3xl text-lg sm:text-xl'>
                {loading
                  ? 'Cargando productos...'
                  : `${(filteredProducts || []).length} variedades de productos premium ecuatorianos disponibles para exportación mundial`}
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
                    Todos ({(products || []).length})
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
                  No se encontraron productos
                </h3>
                <p className='text-muted-foreground'>Intenta seleccionar una categoría diferente</p>
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
                Sistema Avanzado de Cotizaciones
              </div>
              <h2 className='mb-6 text-3xl font-bold sm:text-4xl'>
                Cotizaciones Interactivas y Personalizadas
              </h2>
              <p className='mb-8 text-lg opacity-90 sm:text-xl'>
                Nuestro nuevo sistema de cotizaciones te permite seleccionar productos específicos,
                calcular precios en tiempo real y recibir propuestas personalizadas por email
                automáticamente.
              </p>

              <div className='mb-12 grid gap-6 md:grid-cols-3'>
                <div className='rounded-xl bg-white/10 p-6 backdrop-blur-sm'>
                  <div className='mb-4 text-3xl'>🔍</div>
                  <h3 className='mb-2 text-lg font-semibold'>Búsqueda Inteligente</h3>
                  <p className='text-sm opacity-90'>
                    Encuentra productos rápidamente con nuestro sistema de búsqueda avanzado
                  </p>
                </div>

                <div className='rounded-xl bg-white/10 p-6 backdrop-blur-sm'>
                  <div className='mb-4 text-3xl'>🛒</div>
                  <h3 className='mb-2 text-lg font-semibold'>Selección Múltiple</h3>
                  <p className='text-sm opacity-90'>
                    Combina múltiples productos en una sola cotización con cantidades personalizadas
                  </p>
                </div>

                <div className='rounded-xl bg-white/10 p-6 backdrop-blur-sm'>
                  <div className='mb-4 text-3xl'>📧</div>
                  <h3 className='mb-2 text-lg font-semibold'>Envío Automático</h3>
                  <p className='text-sm opacity-90'>
                    Recibe cotizaciones profesionales por email con seguimiento automático
                  </p>
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
              <h2 className='text-foreground mb-6 text-4xl font-bold'>
                Calidad Mundial, Origen Ecuatoriano
              </h2>
              <p className='text-muted-foreground mb-8 text-xl'>
                Nuestros productos cumplen con los más altos estándares internacionales de calidad y
                seguridad alimentaria. Cada envío está respaldado por certificaciones reconocidas
                mundialmente y procesos de trazabilidad completos desde la finca hasta el destino
                final.
              </p>

              <div className='grid grid-cols-2 gap-6'>
                <div className='bg-muted rounded-lg p-4 text-center'>
                  <div className='text-accent mb-2 text-3xl font-bold'>HACCP</div>
                  <div className='text-muted-foreground'>Análisis de Peligros</div>
                </div>
                <div className='bg-muted rounded-lg p-4 text-center'>
                  <div className='text-accent mb-2 text-3xl font-bold'>BRC</div>
                  <div className='text-muted-foreground'>Seguridad Alimentaria</div>
                </div>
                <div className='bg-muted rounded-lg p-4 text-center'>
                  <div className='text-accent mb-2 text-3xl font-bold'>BAP</div>
                  <div className='text-muted-foreground'>Acuicultura Responsable</div>
                </div>
                <div className='bg-muted rounded-lg p-4 text-center'>
                  <div className='text-accent mb-2 text-3xl font-bold'>GlobalGAP</div>
                  <div className='text-muted-foreground'>Buenas Prácticas</div>
                </div>
              </div>
            </div>

            <div className='from-accent to-secondary rounded-2xl bg-gradient-to-br p-12 text-center text-white'>
              <div className='mb-6 text-6xl'>🏆</div>
              <h3 className='mb-4 text-2xl font-bold'>Reconocimientos Internacionales</h3>
              <p className='opacity-90'>
                Premiados por la excelencia en exportación y compromiso con la calidad en múltiples
                mercados internacionales. Más de 4 años de experiencia.
              </p>
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
              Alcance Global
            </div>
            <h2 className='text-foreground mb-6 text-4xl font-bold'>
              Desde Ecuador Hacia el Mundo
            </h2>
            <p className='text-muted-foreground mx-auto max-w-4xl text-xl'>
              Desde Ecuador hacia el mundo, nuestra red logística con oficina de distribución en
              Miami nos permite llegar a los principales mercados mundiales con la eficiencia y
              calidad que nuestros clientes demandan
            </p>
          </div>

          <div className='mb-16 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6'>
            <div className='text-center'>
              <div className='text-accent text-4xl font-bold'>2+</div>
              <div className='text-muted-foreground'>Países Atendidos</div>
            </div>
            <div className='text-center'>
              <div className='text-accent text-4xl font-bold'>1+</div>
              <div className='text-muted-foreground'>Contenedores por Año</div>
            </div>
            <div className='text-center'>
              <div className='text-accent text-4xl font-bold'>4+</div>
              <div className='text-muted-foreground'>Años de Experiencia</div>
            </div>
            <div className='text-center'>
              <div className='text-accent text-4xl font-bold'>100%</div>
              <div className='text-muted-foreground'>Productos Certificados</div>
            </div>
            <div className='text-center'>
              <div className='text-accent text-4xl font-bold'>99.8%</div>
              <div className='text-muted-foreground'>Satisfacción del Cliente</div>
            </div>
            <div className='text-center'>
              <div className='text-accent text-4xl font-bold'>24/7</div>
              <div className='text-muted-foreground'>Soporte Especializado</div>
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
              Contacto
            </div>
            <h2 className='text-foreground mb-6 text-4xl font-bold'>Conecta con Nuestro Equipo</h2>
            <p className='text-muted-foreground mx-auto max-w-3xl text-xl'>
              Estamos aquí para ayudarte con todas tus necesidades de importación de productos
              ecuatorianos
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
            <div className='bg-muted rounded-xl p-6 text-center'>
              <div className='mb-4 text-4xl'>🏢</div>
              <h4 className='text-foreground mb-2 text-lg font-semibold'>Oficina Principal</h4>
              <p className='text-muted-foreground'>
                Samborondón, Guayas
                <br />
                Ecuador
              </p>
            </div>

            <div className='bg-muted rounded-xl p-6 text-center'>
              <div className='mb-4 text-4xl'>🏢</div>
              <h4 className='text-foreground mb-2 text-lg font-semibold'>
                Oficina de Distribución
              </h4>
              <p className='text-muted-foreground'>
                Miami, Florida
                <br />
                Estados Unidos
              </p>
            </div>

            <div className='bg-muted rounded-xl p-6 text-center'>
              <div className='mb-4 text-4xl'>📧</div>
              <h4 className='text-foreground mb-2 text-lg font-semibold'>Email Comercial</h4>
              <p className='text-muted-foreground'>
                sales@zivahinternational.com
                <br />
                info@zivahinternational.com
              </p>
            </div>

            <div className='bg-muted rounded-xl p-6 text-center'>
              <div className='mb-4 text-4xl'>📱</div>
              <h4 className='text-foreground mb-2 text-lg font-semibold'>Teléfono</h4>
              <p className='text-muted-foreground'>+593999002893</p>
            </div>
          </div>

          <div className='bg-muted mt-12 rounded-xl p-8 text-center'>
            <div className='mb-4 text-4xl'>⏰</div>
            <h4 className='text-foreground mb-4 text-lg font-semibold'>Horario de Atención</h4>
            <div className='grid gap-6 md:grid-cols-2'>
              <div>
                <strong className='text-foreground'>Sede Principal (Ecuador):</strong>
                <br />
                <span className='text-muted-foreground'>
                  Lunes - Viernes: 8:00 AM - 6:00 PM ECT
                </span>
              </div>
              <div>
                <strong className='text-foreground'>Oficina Miami:</strong>
                <br />
                <span className='text-muted-foreground'>
                  Lunes - Viernes: 8:00 AM - 6:00 PM EST
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
              <p className='text-muted-foreground mb-4 text-sm'>
                Exportadores premium de productos ecuatorianos con más de 4 años conectando Ecuador
                con el mundo desde nuestra sede principal en Samborondón, Guayas.
              </p>
              <p className='text-muted-foreground text-sm'>
                <strong className='text-foreground'>Especialistas en:</strong> Acuicultura, Larvas
                de Camarón, Frutas Tropicales, Productos del Mar y Café de Altura.
              </p>
            </div>

            <div>
              <h4 className='text-foreground mb-4 text-lg font-semibold'>Productos Principales</h4>
              <ul className='text-muted-foreground space-y-2'>
                <li>
                  <a
                    href='#products'
                    className='hover:text-accent transition-colors'
                  >
                    Frutas Tropicales
                  </a>
                </li>
                <li>
                  <a
                    href='#products'
                    className='hover:text-accent transition-colors'
                  >
                    Productos del Mar
                  </a>
                </li>
                <li>
                  <a
                    href='#products'
                    className='hover:text-accent transition-colors'
                  >
                    Café Arábica
                  </a>
                </li>
                <li>
                  <a
                    href='#products'
                    className='hover:text-accent transition-colors'
                  >
                    Camarón Premium
                  </a>
                </li>
                <li>
                  <a
                    href='#products'
                    className='hover:text-accent transition-colors'
                  >
                    Larvas de Camarón
                  </a>
                </li>
                <li>
                  <a
                    href='#products'
                    className='hover:text-accent transition-colors'
                  >
                    Ver Catálogo Completo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='text-foreground mb-4 text-lg font-semibold'>Servicios</h4>
              <ul className='text-muted-foreground space-y-2'>
                <li>
                  <a
                    href='#quality'
                    className='hover:text-accent transition-colors'
                  >
                    Certificaciones
                  </a>
                </li>
                <li>
                  <a
                    href='#quote'
                    className='hover:text-accent transition-colors'
                  >
                    Cotizaciones
                  </a>
                </li>
                <li>
                  <a
                    href='#markets'
                    className='hover:text-accent transition-colors'
                  >
                    Distribución Global
                  </a>
                </li>
                <li>
                  <a
                    href='#contact'
                    className='hover:text-accent transition-colors'
                  >
                    Asesoría Técnica
                  </a>
                </li>
                <li>
                  <a
                    href='#contact'
                    className='hover:text-accent transition-colors'
                  >
                    Soporte 24/7
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='text-foreground mb-4 text-lg font-semibold'>Legal</h4>
              <ul className='text-muted-foreground space-y-2'>
                <li>
                  <Link
                    href='/legal/privacy-policy'
                    className='hover:text-accent transition-colors'
                  >
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link
                    href='/legal/terms-of-service'
                    className='hover:text-accent transition-colors'
                  >
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link
                    href='/legal/cookie-policy'
                    className='hover:text-accent transition-colors'
                  >
                    Política de Cookies
                  </Link>
                </li>
                <li>
                  <Link
                    href='/legal/data-protection'
                    className='hover:text-accent transition-colors'
                  >
                    Protección de Datos
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-border border-t pt-8'>
            <div className='flex flex-col items-center justify-between md:flex-row'>
              <p className='text-muted-foreground text-sm'>
                &copy; 2025 ZIVAH International S.A. Todos los derechos reservados.
              </p>
              <p className='text-muted-foreground mt-2 text-sm md:mt-0'>
                Exportadores Premium de Productos Ecuatorianos
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
