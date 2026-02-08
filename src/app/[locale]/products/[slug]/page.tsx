import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';

// This would typically come from your database/API
const getProduct = async (slug: string) => {
  // Mock data - replace with actual API call
  const mockProducts = {
    'camaron-vannamei': {
      id: 1,
      name: 'Camarón Vannamei Premium',
      slug: 'camaron-vannamei',
      description:
        'Camarón Vannamei de la más alta calidad, cultivado en aguas controladas de Ecuador. Con certificaciones internacionales BAP, HACCP y GlobalGAP.',
      shortDescription: 'Camarón blanco ecuatoriano premium con certificación internacional',
      specifications: {
        tamaño: '16/20, 21/25, 26/30, 31/35 por libra',
        presentación: 'Congelado IQF, cabeza on/off',
        origen: 'Ecuador - Provincia de Guayas',
        temporada: 'Todo el año',
      },
      basePrice: 8.5,
      priceUnit: 'USD/kg',
      stockQuantity: 50000,
      minOrderQty: 1000,
      certifications: ['BAP', 'HACCP', 'GlobalGAP', 'BRC'],
      harvestSeason: 'Todo el año',
      origin: 'Ecuador',
      nutritionalInfo: {
        proteína: '20.4g por 100g',
        grasa: '1.2g por 100g',
        calorías: '85 kcal por 100g',
      },
      imageUrl: '/assets/images/products/camaron-vannamei.jpg',
      category: {
        name: 'Productos del Mar',
        slug: 'productos-mar',
      },
      seoTitle: 'Camarón Vannamei Premium Ecuador | ZIVAH International',
      seoDescription:
        'Camarón Vannamei congelado premium de Ecuador. Certificado BAP, HACCP, GlobalGAP. Exportación directa desde Guayas.',
    },
    'cafe-arabica': {
      id: 2,
      name: 'Café Arábica de Altura',
      slug: 'cafe-arabica',
      description:
        'Café arábica premium cultivado en las alturas de Ecuador. Con notas florales y acidez balanceada, perfecto para el mercado internacional.',
      shortDescription: 'Café arábica ecuatoriano de altura premium',
      specifications: {
        tipo: 'Arábica 100%',
        altura: '1,200 - 1,800 metros sobre el nivel del mar',
        proceso: 'Lavado natural',
        tueste: 'Disponible en verde o tostado',
      },
      basePrice: 4.2,
      priceUnit: 'USD/kg',
      stockQuantity: 25000,
      minOrderQty: 500,
      certifications: ['Orgánico', 'Comercio Justo', 'Rainforest Alliance'],
      harvestSeason: 'Marzo - Agosto',
      origin: 'Ecuador - Sierra',
      nutritionalInfo: {
        cafeína: '95mg por taza (240ml)',
        antioxidantes: 'Alto contenido',
        origen: '100% Arábica',
      },
      imageUrl: '/assets/images/products/cafe-arabica.jpg',
      category: {
        name: 'Café',
        slug: 'cafe',
      },
      seoTitle: 'Café Arábica Ecuador Premium | ZIVAH International',
      seoDescription:
        'Café arábica de altura ecuatoriano premium. Certificado orgánico y Comercio Justo. Exportación directa desde Ecuador.',
    },
  };

  return mockProducts[slug as keyof typeof mockProducts] || null;
};

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Producto no encontrado | ZIVAH International',
    };
  }

  return {
    title: product.seoTitle || `${product.name} | ZIVAH International`,
    description: product.seoDescription || product.shortDescription,
    keywords: `${product.name}, ${product.category.name}, Ecuador, exportación, premium`,
    openGraph: {
      title: product.seoTitle || `${product.name} | ZIVAH International`,
      description: product.seoDescription || product.shortDescription,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-gray-50 py-16 dark:bg-gray-900'>
      <div className='container mx-auto max-w-6xl px-4'>
        {/* Breadcrumb */}
        <nav className='mb-8'>
          <ol className='flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400'>
            <li>
              <Link
                href='/'
                className='hover:text-accent dark:hover:text-accent'
              >
                Inicio
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href='/#products'
                className='hover:text-accent dark:hover:text-accent'
              >
                Productos
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/#${product.category.slug}`}
                className='hover:text-accent dark:hover:text-accent'
              >
                {product.category.name}
              </Link>
            </li>
            <li>/</li>
            <li className='font-medium text-gray-900 dark:text-white'>{product.name}</li>
          </ol>
        </nav>

        {/* Product Header */}
        <div className='mb-8 overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800'>
          <div className='grid gap-8 p-8 md:grid-cols-2'>
            {/* Product Image */}
            <div className='space-y-4'>
              <div className='aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700'>
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={500}
                    height={500}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-6xl'>📦</div>
                )}
              </div>

              {/* Certifications */}
              {product.certifications && product.certifications.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {product.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className='bg-accent/10 dark:bg-accent/20 dark:text-accent rounded-full px-3 py-1 text-sm font-medium text-gray-800'
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className='space-y-6'>
              <div>
                <h1 className='mb-2 text-3xl font-bold text-gray-900 dark:text-white'>
                  {product.name}
                </h1>
                <p className='text-lg text-gray-600 dark:text-gray-300'>
                  {product.shortDescription}
                </p>
              </div>

              {/* Price */}
              <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-sm text-gray-600 dark:text-gray-400'>Precio base:</span>
                  <span className='text-accent dark:text-accent text-2xl font-bold'>
                    ${product.basePrice.toFixed(2)} {product.priceUnit}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600 dark:text-gray-400'>Cantidad mínima:</span>
                  <span className='font-medium'>
                    {product.minOrderQty} {product.priceUnit.split('/')[1]}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600 dark:text-gray-400'>Stock disponible:</span>
                  <span className='font-medium'>
                    {product.stockQuantity.toLocaleString()} {product.priceUnit.split('/')[1]}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className='flex gap-4'>
                <Button
                  variant='cta-primary'
                  size='full-lg'
                  className='flex-1'
                >
                  Solicitar Cotización
                </Button>
                <Button
                  variant='cta-secondary'
                  size='lg'
                >
                  Contactar
                </Button>
              </div>

              {/* Origin & Season */}
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='font-medium text-gray-900 dark:text-white'>Origen:</span>
                  <p className='text-gray-600 dark:text-gray-400'>{product.origin}</p>
                </div>
                <div>
                  <span className='font-medium text-gray-900 dark:text-white'>Temporada:</span>
                  <p className='text-gray-600 dark:text-gray-400'>{product.harvestSeason}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-8 lg:col-span-2'>
            {/* Description */}
            <div className='rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                Descripción del Producto
              </h2>
              <p className='leading-relaxed text-gray-700 dark:text-gray-300'>
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className='rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  Especificaciones Técnicas
                </h2>
                <div className='grid gap-4 md:grid-cols-2'>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className='flex justify-between border-b border-gray-200 py-2 dark:border-gray-700'
                    >
                      <span className='font-medium text-gray-900 capitalize dark:text-white'>
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className='text-gray-600 dark:text-gray-400'>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutritional Info */}
            {product.nutritionalInfo && (
              <div className='rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  Información Nutricional
                </h2>
                <div className='grid gap-4 md:grid-cols-2'>
                  {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                    <div
                      key={key}
                      className='flex justify-between border-b border-gray-200 py-2 dark:border-gray-700'
                    >
                      <span className='font-medium text-gray-900 capitalize dark:text-white'>
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className='text-gray-600 dark:text-gray-400'>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className='space-y-8'>
            {/* Quick Quote Form */}
            <div className='rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800'>
              <h3 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>
                Cotización Rápida
              </h3>
              <form className='space-y-4'>
                <div>
                  <label
                    htmlFor='quantity-required'
                    className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    Cantidad requerida
                  </label>
                  <input
                    id='quantity-required'
                    type='number'
                    min={product.minOrderQty}
                    placeholder={`Mínimo ${product.minOrderQty}`}
                    className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  />
                </div>
                <div>
                  <label
                    htmlFor='destination-country'
                    className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    País de destino
                  </label>
                  <select
                    id='destination-country'
                    className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  >
                    <option>Estados Unidos</option>
                    <option>Unión Europea</option>
                    <option>Canadá</option>
                    <option>Otros</option>
                  </select>
                </div>
                <Button
                  type='submit'
                  variant='cta-primary'
                  size='full'
                >
                  Solicitar Cotización
                </Button>
              </form>
            </div>

            {/* Related Products */}
            <div className='rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800'>
              <h3 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>
                Productos Relacionados
              </h3>
              <div className='space-y-3'>
                <Link
                  href='/products/cafe-arabica'
                  className='block rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                >
                  <div className='font-medium text-gray-900 dark:text-white'>
                    Café Arábica Premium
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>Desde Ecuador</div>
                </Link>
                <Link
                  href='/products/camaron-vannamei'
                  className='block rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                >
                  <div className='font-medium text-gray-900 dark:text-white'>Camarón Vannamei</div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>Certificado BAP</div>
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className='bg-accent/5 dark:bg-accent/10 border-accent/20 dark:border-accent/30 rounded-lg border p-6'>
              <h3 className='text-accent dark:text-accent mb-4 text-lg font-semibold'>
                ¿Necesita más información?
              </h3>
              <div className='text-accent dark:text-accent space-y-2 text-sm'>
                <p>📧 sales@zivahinternational.com</p>
                <p>📱 +593999002893</p>
                <p>🏢 Samborondón, Guayas, Ecuador</p>
              </div>
              <Link
                href='/#contact'
                className='text-accent dark:text-accent mt-4 inline-block font-medium hover:underline'
              >
                Contactar ahora →
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Products */}
        <div className='mt-12 text-center'>
          <Link
            href='/#products'
            className='text-accent dark:text-accent hover:text-accent/90 dark:hover:text-accent/90 inline-flex items-center transition-colors'
          >
            ← Ver todos los productos
          </Link>
        </div>
      </div>
    </div>
  );
}
