import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { Link } from '@/i18n/routing';
import { CONTACT_INFO } from '@/lib/contact-info';
import { getProductImage } from '@/lib/product-images';
import { getFichaTecnica } from '@/lib/product-specs';

import PrintButton from './PrintButton';

interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  origin: string;
  harvestSeason?: string;
  certifications?: string[];
  category?: { name: string; slug: string };
  isFeatured: boolean;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '');

async function getProductBySlug(slug: string, locale: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/products?locale=${locale}&isActive=true&pageSize=200`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const products: Product[] = json.data || [];
    return products.find(product => product.slug === slug) ?? null;
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const [product, t] = await Promise.all([
    getProductBySlug(slug, locale ?? 'es'),
    getTranslations({ locale: locale ?? 'es', namespace: 'productDetail' }),
  ]);

  if (!product) {
    return { title: `${t('notFound')} | ZIVAH International` };
  }

  return {
    title: `Ficha Técnica – ${product.name} | ZIVAH International`,
    description: `Especificaciones técnicas de exportación para ${product.name} de Ecuador.`,
    robots: { index: false },
  };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className='mt-8 break-inside-avoid first:mt-0'>
      <h2 className='border-b border-neutral-900 pb-2 text-[11px] font-semibold tracking-[0.18em] text-neutral-900 uppercase'>
        {title}
      </h2>
      <div className='pt-3'>{children}</div>
    </section>
  );
}

function Table({ rows }: { rows: Record<string, string> | undefined }) {
  if (!rows || Object.keys(rows).length === 0) return null;

  return (
    <dl>
      {Object.entries(rows).map(([key, value]) => (
        <div
          key={key}
          className='grid grid-cols-[minmax(0,9rem)_1fr] gap-4 border-b border-neutral-200 py-2 text-[13px] last:border-0 sm:grid-cols-[minmax(0,14rem)_1fr]'
        >
          <dt className='font-medium text-neutral-500'>{key}</dt>
          <dd className='text-neutral-900'>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function FichaTecnicaPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const currentLocale = locale ?? 'es';
  const [product, ficha] = await Promise.all([
    getProductBySlug(slug, currentLocale),
    Promise.resolve(getFichaTecnica(slug)),
  ]);

  if (!product || !ficha) notFound();

  const imageSrc = getProductImage(slug, product.category?.slug);
  const certifications = ficha.certificaciones ?? [];
  const today = new Date().toLocaleDateString(currentLocale === 'en' ? 'en-US' : 'es-EC', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className='bg-background pt-24 pb-16 print:bg-white print:p-0'>
      <div className='mx-auto w-full max-w-[800px] px-4 sm:px-6 print:max-w-none print:px-0'>
        <div className='no-print mb-6 flex items-center justify-between gap-4'>
          <Link
            href={`/products/${slug}`}
            className='text-[13px] font-semibold text-foreground transition-colors hover:text-accent'
          >
            ← {currentLocale === 'en' ? 'Back to product' : 'Volver al producto'}
          </Link>
          <PrintButton />
        </div>

        <article className='bg-white text-neutral-900 shadow-[0_1px_0_rgba(0,0,0,0.06),0_24px_60px_-40px_rgba(0,0,0,0.35)] print:shadow-none'>
          <header className='border-b-2 border-neutral-900 px-6 py-7 sm:px-10'>
            <div className='flex flex-wrap items-start justify-between gap-6'>
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src='/assets/images/zivah-logo.svg'
                  alt='ZIVAH International S.A.'
                  className='h-8 w-auto'
                />
                <h1 className='mt-5 font-serif text-[clamp(1.5rem,3vw,2rem)] leading-tight text-neutral-900'>
                  Ficha Técnica de Exportación
                </h1>
                <p className='mt-1 text-[15px] font-semibold text-neutral-700'>{product.name}</p>
              </div>

              <dl className='grid gap-1 text-[11px] text-neutral-600'>
                <div className='flex justify-end gap-2'>
                  <dt className='tracking-[0.12em] uppercase'>Fecha</dt>
                  <dd className='font-medium text-neutral-900'>{today}</dd>
                </div>
                {product.sku && (
                  <div className='flex justify-end gap-2'>
                    <dt className='tracking-[0.12em] uppercase'>SKU</dt>
                    <dd className='font-medium text-neutral-900'>{product.sku}</dd>
                  </div>
                )}
                <div className='flex justify-end gap-2'>
                  <dt className='tracking-[0.12em] uppercase'>Origen</dt>
                  <dd className='font-medium text-neutral-900'>Ecuador</dd>
                </div>
              </dl>
            </div>
          </header>

          <div className='px-6 py-8 sm:px-10'>
            <div className='mb-8 flex break-inside-avoid gap-6'>
              <div className='relative hidden aspect-[4/3] w-44 shrink-0 overflow-hidden border border-neutral-200 sm:block'>
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  sizes='176px'
                  className='object-cover'
                  priority
                />
              </div>
              <div className='flex-1'>
                {product.category && (
                  <p className='text-[11px] font-semibold tracking-[0.16em] text-neutral-500 uppercase'>
                    {product.category.name}
                  </p>
                )}
                {ficha.nombreCientifico && (
                  <p className='mt-2 text-[13px] text-neutral-600 italic'>
                    {ficha.nombreCientifico}
                  </p>
                )}
                {product.shortDescription && (
                  <p className='mt-3 text-[13px] leading-relaxed text-neutral-700'>
                    {product.shortDescription}
                  </p>
                )}
                {product.description && (
                  <p className='mt-2 text-[13px] leading-relaxed text-neutral-600'>
                    {product.description}
                  </p>
                )}
              </div>
            </div>

            <Section title='Identificación del producto'>
              <Table
                rows={{
                  Categoría: product.category?.name ?? '—',
                  ...(ficha.nombreCientifico
                    ? { 'Nombre científico': ficha.nombreCientifico }
                    : {}),
                  ...(ficha.familia ? { Familia: ficha.familia } : {}),
                  'Código HS': ficha.hsCode,
                  'País de origen': ficha.origen,
                  'Región de producción': ficha.regionProduccion,
                  'Puerto de exportación': ficha.puertoExportacion,
                  Disponibilidad: ficha.temporadaDisponible,
                }}
              />
            </Section>

            <Section title='Especificaciones técnicas'>
              <Table rows={ficha.especificaciones} />
            </Section>

            <Section title='Empaque y presentación'>
              <Table rows={ficha.empaque} />
            </Section>

            <Section title='Almacenamiento y transporte'>
              <Table rows={ficha.almacenamiento} />
            </Section>

            {ficha.infoNutricional && (
              <Section title='Información nutricional (por 100 g / según indicado)'>
                <dl className='grid grid-cols-1 gap-x-8 sm:grid-cols-2'>
                  {Object.entries(ficha.infoNutricional).map(([key, value]) => (
                    <div
                      key={key}
                      className='flex items-baseline justify-between gap-4 border-b border-neutral-200 py-2 text-[13px]'
                    >
                      <dt className='text-neutral-500'>{key}</dt>
                      <dd className='text-right font-medium text-neutral-900'>{value}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
            )}

            {ficha.observaciones && (
              <Section title='Observaciones'>
                <p className='text-[13px] leading-relaxed text-neutral-700'>
                  {ficha.observaciones}
                </p>
              </Section>
            )}

            <Section title='Certificaciones y cumplimiento'>
              <div className='grid grid-cols-2 gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-3'>
                {certifications.map(certification => (
                  <div
                    key={certification}
                    className='bg-white px-4 py-3 text-[13px] font-semibold text-neutral-900'
                  >
                    {certification}
                  </div>
                ))}
              </div>
            </Section>

            <Section title='Contacto comercial'>
              <dl className='grid grid-cols-1 gap-x-8 gap-y-2 text-[13px] sm:grid-cols-2'>
                <div className='flex justify-between gap-4 border-b border-neutral-200 py-1.5 sm:border-0 sm:py-0'>
                  <dt className='text-neutral-500'>Email</dt>
                  <dd className='font-medium text-neutral-900'>{CONTACT_INFO.email}</dd>
                </div>
                <div className='flex justify-between gap-4 border-b border-neutral-200 py-1.5 sm:border-0 sm:py-0'>
                  <dt className='text-neutral-500'>Teléfono</dt>
                  <dd className='font-medium text-neutral-900'>{CONTACT_INFO.phone}</dd>
                </div>
                <div className='flex justify-between gap-4 py-1.5 sm:border-0 sm:py-0'>
                  <dt className='text-neutral-500'>Oficina</dt>
                  <dd className='text-right font-medium text-neutral-900'>
                    {CONTACT_INFO.ecuador}, Ecuador
                  </dd>
                </div>
                <div className='flex justify-between gap-4 py-1.5 sm:border-0 sm:py-0'>
                  <dt className='text-neutral-500'>Web</dt>
                  <dd className='font-medium text-neutral-900'>www.zivahinternational.com</dd>
                </div>
              </dl>
            </Section>

            <footer className='mt-10 border-t border-neutral-300 pt-4 text-[11px] leading-relaxed text-neutral-500'>
              <p className='font-semibold text-neutral-700'>ZIVAH International S.A.</p>
              <p>
                Documento informativo. Las especificaciones pueden variar según lote y temporada.
                Datos sujetos a certificación por embarque.
              </p>
            </footer>
          </div>
        </article>
      </div>
    </div>
  );
}
