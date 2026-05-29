import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
  category?: { name: string; slug: string; icon?: string };
  imageUrl?: string;
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
    return products.find(p => p.slug === slug) ?? null;
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug, locale ?? 'es');
  if (!product) return { title: 'Ficha Técnica | ZIVAH International' };
  return {
    title: `Ficha Técnica – ${product.name} | ZIVAH International`,
    description: `Especificaciones técnicas de exportación para ${product.name} de Ecuador.`,
    robots: { index: false },
  };
}

/* ─── helpers ─────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className='mb-6 break-inside-avoid overflow-hidden rounded-xl border border-gray-200'>
      <h2 className='bg-primary/10 border-b border-gray-200 px-5 py-2.5 text-sm font-bold tracking-wider text-gray-800 uppercase'>
        {title}
      </h2>
      <div className='px-5 py-4'>{children}</div>
    </section>
  );
}

function Table({ rows }: { rows: Record<string, string> | undefined }) {
  if (!rows) return null;
  return (
    <table className='w-full text-sm'>
      <tbody>
        {Object.entries(rows).map(([key, val]) => (
          <tr
            key={key}
            className='border-b border-gray-100 last:border-0'
          >
            <td className='w-1/2 py-1.5 pr-4 align-top font-semibold whitespace-nowrap text-gray-700'>
              {key}
            </td>
            <td className='py-1.5 align-top text-gray-600'>{val}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ─── page ─────────────────────────────────────────── */

export default async function FichaTecnicaPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const [product, ficha] = await Promise.all([
    getProductBySlug(slug, locale ?? 'es'),
    Promise.resolve(getFichaTecnica(slug)),
  ]);

  if (!product || !ficha) notFound();

  const imageUrl = getProductImage(slug, product.category?.slug, product.imageUrl);
  const certifications: string[] = ficha.certificaciones ?? [];
  const today = new Date().toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <PrintButton />

      <div className='min-h-screen bg-gray-100 py-8 print:bg-white print:py-0'>
        {/* Back link – hidden on print */}
        <div className='no-print mx-auto mb-4 max-w-4xl px-4'>
          <Link
            href={`/${locale ?? 'es'}/products/${slug}`}
            className='text-primary text-sm underline hover:opacity-80'
          >
            ← Volver al producto
          </Link>
        </div>

        {/* ── DOCUMENT ── */}
        <div className='mx-auto max-w-4xl bg-white shadow-lg print:shadow-none'>
          {/* Header band */}
          <header className='bg-primary text-primary-foreground flex items-center justify-between px-8 py-4'>
            <div>
              <p className='text-xs font-semibold tracking-widest uppercase opacity-80'>
                ZIVAH International S.A.
              </p>
              <h1 className='text-xl font-black'>Ficha Técnica de Exportación</h1>
            </div>
            <div className='text-right text-xs opacity-80'>
              <p>Fecha: {today}</p>
              {product.sku && <p>SKU: {product.sku}</p>}
              <p>Origen: 🇪🇨 Ecuador</p>
            </div>
          </header>

          <div className='p-6 sm:p-8'>
            {/* ── Product hero ── */}
            <div className='mb-6 flex break-inside-avoid gap-6 overflow-hidden rounded-xl border border-gray-200'>
              {/* Image */}
              <div className='relative hidden min-h-48 w-48 shrink-0 sm:block'>
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className='object-cover'
                  sizes='192px'
                  priority
                />
              </div>
              {/* Identity */}
              <div className='flex-1 p-5'>
                {product.category && (
                  <p className='text-primary mb-1 text-xs font-semibold tracking-widest uppercase'>
                    {product.category.icon} {product.category.name}
                  </p>
                )}
                <h2 className='mb-1 text-2xl font-black text-gray-900'>{product.name}</h2>
                {ficha.nombreCientifico && (
                  <p className='mb-2 text-sm text-gray-500 italic'>{ficha.nombreCientifico}</p>
                )}
                {product.shortDescription && (
                  <p className='mb-3 text-sm leading-relaxed text-gray-600'>
                    {product.shortDescription}
                  </p>
                )}

                {/* Cert badges */}
                <div className='flex flex-wrap gap-1.5'>
                  {certifications.map(cert => (
                    <span
                      key={cert}
                      className='bg-accent/15 text-accent-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold'
                    >
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Info general ── */}
            <Section title='📋 Información General'>
              <Table
                rows={{
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

            {/* ── Specs + Packaging (two-col on wide) ── */}
            <div className='grid gap-6 sm:grid-cols-2'>
              <Section title='🔬 Especificaciones Técnicas'>
                <Table rows={ficha.especificaciones} />
              </Section>

              <div className='space-y-6'>
                <Section title='📦 Empaque y Presentación'>
                  <Table rows={ficha.empaque} />
                </Section>

                <Section title='❄️ Almacenamiento y Transporte'>
                  <Table rows={ficha.almacenamiento} />
                </Section>
              </div>
            </div>

            {/* ── Nutritional info (optional) ── */}
            {ficha.infoNutricional && (
              <Section title='📊 Información Nutricional (por 100 g / según indicado)'>
                <div className='grid grid-cols-2 gap-x-8 sm:grid-cols-3'>
                  {Object.entries(ficha.infoNutricional).map(([k, v]) => (
                    <div
                      key={k}
                      className='flex items-center justify-between border-b border-gray-100 py-1.5 text-sm'
                    >
                      <span className='text-gray-600'>{k}</span>
                      <span className='font-semibold text-gray-800'>{v}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Description ── */}
            {product.description && (
              <Section title='📝 Descripción del Producto'>
                <p className='text-sm leading-relaxed text-gray-700'>{product.description}</p>
              </Section>
            )}

            {/* ── Observations ── */}
            {ficha.observaciones && (
              <Section title='ℹ️ Observaciones'>
                <p className='text-sm leading-relaxed text-gray-700'>{ficha.observaciones}</p>
              </Section>
            )}

            {/* ── Certifications block ── */}
            <Section title='🏅 Certificaciones y Cumplimiento Normativo'>
              <div className='flex flex-wrap gap-3'>
                {certifications.map(cert => (
                  <div
                    key={cert}
                    className='border-accent/30 bg-accent/5 rounded-lg border px-4 py-2 text-center'
                  >
                    <p className='text-accent text-sm font-bold'>{cert}</p>
                    <p className='text-xs text-gray-500'>Certificado vigente</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── Footer ── */}
            <footer className='mt-6 border-t border-gray-200 pt-5 text-xs text-gray-400'>
              <div className='flex flex-col gap-2 sm:flex-row sm:justify-between'>
                <div>
                  <p className='font-semibold text-gray-600'>ZIVAH International S.A.</p>
                  <p>Guayaquil, Ecuador · contacto@zivah.international</p>
                  <p>www.zivah.international</p>
                </div>
                <div className='text-right'>
                  <p>Este documento es de carácter informativo.</p>
                  <p>Las especificaciones pueden variar según lote y temporada.</p>
                  <p>Datos sujetos a certificación por embarque.</p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
