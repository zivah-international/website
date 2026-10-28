import { getTranslations } from 'next-intl/server';

import ProductCard from '@/components/site/ProductCard';
import SecondaryLines from '@/components/site/SecondaryLines';
import SectionHeader from '@/components/site/SectionHeader';

export default async function SeafoodLinesSection() {
  const t = await getTranslations('home');

  // Static, translation-driven plates: the home page never queries the catalog.
  const plates = [
    {
      href: '/products/camaron-blanco-premium',
      imageSrc: '/assets/images/photos/product-camaron.jpg',
      eyebrow: t('seafood.cards.camaron.eyebrow'),
      title: t('seafood.cards.camaron.title'),
      description: t('seafood.cards.camaron.description'),
    },
    {
      href: '/products/larvas-camaron-postlarva',
      imageSrc: '/assets/images/photos/product-larvas.jpg',
      eyebrow: t('seafood.cards.larvas.eyebrow'),
      title: t('seafood.cards.larvas.title'),
      description: t('seafood.cards.larvas.description'),
    },
    {
      href: '/products/atun-fresco-pacifico',
      imageSrc: '/assets/images/photos/product-atun.jpg',
      eyebrow: t('seafood.cards.atun.eyebrow'),
      title: t('seafood.cards.atun.title'),
      description: t('seafood.cards.atun.description'),
    },
  ];

  return (
    <section
      id='productos-del-mar'
      className='scroll-mt-24 bg-background py-16 lg:py-24'
    >
      <div className='mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'>
        <SectionHeader
          title={t('seafood.title')}
          lead={t('seafood.lead')}
        />

        <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {plates.map(plate => (
            <ProductCard
              key={plate.href}
              href={plate.href}
              imageSrc={plate.imageSrc}
              imageAlt={plate.title}
              eyebrow={plate.eyebrow}
              title={plate.title}
              description={plate.description}
              linkLabel={t('seafood.viewSheet')}
              testId='seafood-card'
            />
          ))}
        </div>

        <SecondaryLines />
      </div>
    </section>
  );
}
