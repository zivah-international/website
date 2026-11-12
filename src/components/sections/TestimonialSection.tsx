import { getTranslations } from 'next-intl/server';

export default async function TestimonialSection() {
  const t = await getTranslations('home.testimonial');

  return (
    <section
      aria-label={t('label')}
      className='bg-surface py-16 lg:py-24'
    >
      <div className='mx-auto w-full max-w-[900px] px-4 sm:px-6 lg:px-8'>
        <figure
          data-testid='testimonial'
          className='border-y border-border py-12'
        >
          <blockquote className='font-serif text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.3] text-foreground'>
            <p>“{t('quote')}”</p>
          </blockquote>
          <figcaption className='mt-6 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase'>
            {t('attribution')}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
