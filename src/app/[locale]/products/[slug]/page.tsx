import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { getFichaTecnica } from '@/lib/product-specs';

interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  specifications?: Record<string, string>;
  basePrice?: number;
  priceUnit?: string;
  stockQuantity: number;
  minOrderQty?: number;
  imageUrl?: string;
  origin: string;
  harvestSeason?: string;
  certifications?: string[];
  nutritionalInfo?: Record<string, string>;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  category?: { name: string; slug: string; icon?: string };
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '');

async function getProductBySlug(slug: string, locale: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/products?search=${encodeURIComponent(slug)}&locale=${locale}&isActive=true`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const products: Product[] = json.data || [];
    return products.find(p => p.slug === slug) ?? null;
  } catch {
    return null;
  }
}

interface ProductPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug, locale ?? 'es');

  if (!product) {
    return { title: 'Producto no encontrado | ZIVAH International' };
  }

  return {
    title: product.seoTitle || `${product.name} | ZIVAH International`,
    description: product.seoDescription || product.shortDescription,
    keywords: `${product.name}, ${product.category?.name ?? ''}, Ecuador, exportación, premium`,
    openGraph: {
      title: product.seoTitle || `${product.name} | ZIVAH International`,
      description: product.seoDescription || product.shortDescription,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug, locale ?? 'es');

  if (!product) {
    notFound();
  }

  const ficha = getFichaTecnica(product.slug);

  const certBadgeColors: Record<string, string> = {
    HACCP: 'bg-secondary/10 text-secondary',
    BRC: 'bg-accent/10 text-accent',
    BAP: 'bg-secondary/15 text-secondary',
    GlobalGAP: 'bg-accent/15 text-accent',
    Orgánico: 'bg-accent/20 text-accent',
    'Comercio Justo': 'bg-primary/10 text-primary',
  };

  const quoteUrl = `/${locale ?? 'es'}/#quote`;

  return (
    <div className='min-h-screen bg-background'>
      {/* Sticky CTA bar for mobile */}
      <div className='fixed right-0 bottom-0 left-0 z-40 border-t border-border bg-background p-3 shadow-lg sm:hidden'>
        <Link
          href={quoteUrl}
          data-track='begin_checkout'
          data-track-label='solicitar_cotizacion_mobile'
          data-track-category='cta'
        >
          <Button
            variant='accent'
            size='full'
            className='w-full font-semibold'
          >
            📋 Solicitar Cotización
          </Button>
        </Link>
      </div>

      <div className='container mx-auto max-w-6xl px-4 py-16 pb-24 sm:pb-16'>
        {/* Breadcrumb */}
        <nav
          className='mb-8'
          aria-label='Breadcrumb'
        >
          <ol className='flex flex-wrap items-center gap-1 text-sm text-muted-foreground'>
            <li>
              <Link
                href={`/${locale ?? 'es'}`}
                className='transition-colors hover:text-accent'
              >
                Inicio
              </Link>
            </li>
            <li aria-hidden='true'>/</li>
            <li>
              <Link
                href={`/${locale ?? 'es'}/#products`}
                className='transition-colors hover:text-accent'
              >
                Productos
              </Link>
            </li>
            {product.category && (
              <>
                <li aria-hidden='true'>/</li>
                <li>
                  <Link
                    href={`/${locale ?? 'es'}/#${product.category.slug}`}
                    className='transition-colors hover:text-accent'
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden='true'>/</li>
            <li className='font-medium text-foreground'>{product.name}</li>
          </ol>
        </nav>

        {/* Product Header */}
        <div className='mb-8 overflow-hidden rounded-2xl bg-card shadow-lg'>
          <div className='grid gap-0 md:grid-cols-2'>
            {/* Product Image */}
            <div className='relative flex min-h-64 items-center justify-center bg-muted/30 p-8 md:min-h-80'>
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={480}
                  height={480}
                  className='max-h-80 w-auto rounded-xl object-cover shadow-md'
                  priority
                />
              ) : (
                <div className='flex flex-col items-center gap-3'>
                  <span className='text-8xl'>{product.category?.icon ?? '📦'}</span>
                  <span className='text-sm text-muted-foreground'>Imagen no disponible</span>
                </div>
              )}
              {product.isFeatured && (
                <div className='absolute top-4 left-4 rounded-full bg-primary/80 px-3 py-1 text-xs font-bold text-primary-foreground shadow'>
                  ⭐ Destacado
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className='flex flex-col gap-6 p-8'>
              {/* Category + Name */}
              <div>
                {product.category && (
                  <p className='mb-2 text-sm font-semibold tracking-wider text-accent uppercase'>
                    {product.category.name}
                  </p>
                )}
                <h1 className='mb-3 text-2xl font-bold text-foreground sm:text-3xl'>
                  {product.name}
                </h1>
                {product.shortDescription && (
                  <p className='text-base leading-relaxed text-muted-foreground'>
                    {product.shortDescription}
                  </p>
                )}
              </div>

              {/* Certifications */}
              {product.certifications && product.certifications.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {product.certifications.map((cert, i) => (
                    <span
                      key={i}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${certBadgeColors[cert] ?? 'bg-muted text-muted-foreground'}`}
                    >
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              )}

              {/* Commercial Info */}
              <div className='rounded-xl bg-muted/50 p-5'>
                <div className='mb-3 flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Precio base FOB:</span>
                  {product.basePrice ? (
                    <span className='text-2xl font-bold text-accent'>
                      ${product.basePrice.toFixed(2)}{' '}
                      <span className='text-sm font-normal text-muted-foreground'>
                        {product.priceUnit}
                      </span>
                    </span>
                  ) : (
                    <span className='text-sm font-medium text-muted-foreground'>
                      Consultar cotización
                    </span>
                  )}
                </div>
                <div className='grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <span className='block text-muted-foreground'>Pedido mínimo:</span>
                    <span className='font-semibold text-foreground'>
                      {product.minOrderQty
                        ? `${product.minOrderQty.toLocaleString()} ${product.priceUnit?.split('/')[1] ?? ''}`
                        : 'A convenir'}
                    </span>
                  </div>
                  <div>
                    <span className='block text-muted-foreground'>Origen:</span>
                    <span className='font-semibold text-foreground'>🇪🇨 {product.origin}</span>
                  </div>
                  {product.harvestSeason && (
                    <div>
                      <span className='block text-muted-foreground'>Temporada:</span>
                      <span className='font-semibold text-foreground'>{product.harvestSeason}</span>
                    </div>
                  )}
                  {product.sku && (
                    <div>
                      <span className='block text-muted-foreground'>SKU:</span>
                      <span className='font-mono text-xs font-semibold text-foreground'>
                        {product.sku}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Primary CTAs */}
              <div className='hidden flex-col gap-3 sm:flex sm:flex-row'>
                <Link
                  href={quoteUrl}
                  className='flex-1'
                  data-track='begin_checkout'
                  data-track-label='solicitar_cotizacion_product'
                  data-track-category='cta'
                >
                  <Button
                    variant='accent'
                    size='lg'
                    className='w-full font-semibold shadow-md hover:shadow-lg'
                  >
                    📋 Solicitar Cotización
                  </Button>
                </Link>
                <Link
                  href={`/${locale ?? 'es'}/#contact`}
                  data-track='cta_click'
                  data-track-label='contactar_product'
                  data-track-category='cta'
                >
                  <Button
                    variant='outline'
                    size='lg'
                    className='w-full border-2 font-medium hover:bg-muted'
                  >
                    💬 Contactar
                  </Button>
                </Link>
              </div>

              {/* Ficha Técnica link */}
              {ficha && (
                <Link
                  href={`/${locale ?? 'es'}/products/${product.slug}/ficha-tecnica`}
                  className='hidden items-center gap-2 text-sm font-medium text-primary hover:underline sm:flex'
                  target='_blank'
                  rel='noopener'
                >
                  📄 Ver Ficha Técnica de Exportación →
                </Link>
              )}

              <p className='text-xs text-muted-foreground/60'>
                * Precio referencial FOB Ecuador. El precio final puede variar según Incoterms,
                volumen y destino.
              </p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-8 lg:col-span-2'>
            {/* Full Description */}
            {product.description && (
              <div className='rounded-2xl bg-card p-8 shadow-sm'>
                <h2 className='mb-4 text-xl font-bold text-foreground'>Descripción del Producto</h2>
                <p className='leading-relaxed text-muted-foreground'>{product.description}</p>
              </div>
            )}

            {/* Technical Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className='rounded-2xl bg-card p-8 shadow-sm'>
                <h2 className='mb-6 text-xl font-bold text-foreground'>
                  🔬 Especificaciones Técnicas
                </h2>
                <div className='divide-y divide-border'>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className='flex items-start justify-between gap-4 py-3'
                    >
                      <span className='min-w-0 shrink-0 font-medium text-foreground capitalize'>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className='text-right text-muted-foreground'>{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutritional / Additional Info */}
            {product.nutritionalInfo && Object.keys(product.nutritionalInfo).length > 0 && (
              <div className='rounded-2xl bg-card p-8 shadow-sm'>
                <h2 className='mb-6 text-xl font-bold text-foreground'>
                  📊 Información Nutricional
                </h2>
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                  {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                    <div
                      key={key}
                      className='rounded-xl bg-muted/40 p-3 text-center'
                    >
                      <div className='text-sm font-bold text-accent'>{value as string}</div>
                      <div className='mt-1 text-xs text-muted-foreground capitalize'>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Signals */}
            <div className='rounded-2xl border border-accent/20 bg-accent/5 p-8'>
              <h2 className='mb-4 text-xl font-bold text-accent'>✅ Por qué comprar con ZIVAH</h2>
              <ul className='space-y-3 text-sm text-accent/80'>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 shrink-0'>🏆</span>
                  <span>Certificaciones HACCP, BRC, BAP y GlobalGAP vigentes en cada embarque</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 shrink-0'>📄</span>
                  <span>
                    Documentación de exportación completa: Certificados de Origen, Sanitario e
                    Inspección
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 shrink-0'>🌎</span>
                  <span>Logística coordinada desde Guayas, Ecuador y Miami, Florida</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 shrink-0'>⚡</span>
                  <span>Respuesta comercial en menos de 24 horas hábiles</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 shrink-0'>🔍</span>
                  <span>Trazabilidad completa desde origen hasta destino final</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Quote CTA Card */}
            <div className='rounded-2xl bg-card p-6 shadow-sm'>
              <h3 className='mb-1 text-lg font-bold text-foreground'>
                ¿Interesado en este producto?
              </h3>
              <p className='mb-5 text-sm text-muted-foreground'>
                Recibe una cotización FOB con especificaciones técnicas y documentación de
                exportación en menos de 24 horas.
              </p>
              <Link
                href={quoteUrl}
                data-track='begin_checkout'
                data-track-label='solicitar_cotizacion_sidebar'
                data-track-category='cta'
              >
                <Button
                  variant='accent'
                  size='full'
                  className='mb-3 w-full font-semibold shadow-md hover:shadow-lg'
                >
                  📋 Solicitar Cotización Ahora
                </Button>
              </Link>
              <Link
                href={`/${locale ?? 'es'}/#contact`}
                data-track='cta_click'
                data-track-label='hablar_asesor_sidebar'
                data-track-category='cta'
              >
                <Button
                  variant='outline'
                  size='full'
                  className='w-full border-2 font-medium hover:bg-muted'
                >
                  💬 Hablar con un Asesor
                </Button>
              </Link>
              {ficha && (
                <Link
                  href={`/${locale ?? 'es'}/products/${product.slug}/ficha-tecnica`}
                  target='_blank'
                  rel='noopener'
                  className='mt-3 flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline'
                >
                  📄 Ver Ficha Técnica de Exportación
                </Link>
              )}
            </div>

            {/* Quick Contact */}
            <div className='rounded-2xl border border-accent/20 bg-accent/5 p-6 dark:border-accent/30 dark:bg-accent/10'>
              <h3 className='mb-4 text-base font-semibold text-accent'>Contacto Directo</h3>
              <div className='space-y-2 text-sm'>
                <a
                  href='mailto:sales@zivahinternational.com'
                  className='flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent'
                  data-track='generate_lead'
                  data-track-source='email_product'
                  data-track-currency='USD'
                  data-track-value='0'
                >
                  <span>📧</span>
                  <span>sales@zivahinternational.com</span>
                </a>
                <a
                  href='tel:+593999002893'
                  className='flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent'
                >
                  <span>📱</span>
                  <span>+593 99 900 2893</span>
                </a>
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <span>🏢</span>
                  <span>Samborondón, Guayas · Miami, FL</span>
                </div>
              </div>
            </div>

            {/* Certifications display */}
            {product.certifications && product.certifications.length > 0 && (
              <div className='rounded-2xl bg-card p-6 shadow-sm'>
                <h3 className='mb-4 text-base font-bold text-foreground'>Certificaciones</h3>
                <div className='flex flex-wrap gap-2'>
                  {product.certifications.map((cert, i) => (
                    <span
                      key={i}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${certBadgeColors[cert] ?? 'bg-muted text-muted-foreground'}`}
                    >
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to Products */}
        <div className='mt-12 text-center'>
          <Link
            href={`/${locale ?? 'es'}/#products`}
            className='inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/80'
          >
            ← Ver todos los productos
          </Link>
        </div>
      </div>
    </div>
  );
}
