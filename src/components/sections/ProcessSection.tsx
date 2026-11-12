import { getTranslations } from 'next-intl/server';

import ProcessStep from '@/components/site/ProcessStep';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

type Step = { title: string; description: string };

export default async function ProcessSection() {
  const t = await getTranslations('home.process');
  const steps = t.raw('steps') as Step[];

  return (
    <section
      aria-labelledby='process-title'
      className='bg-surface py-16 lg:py-24'
    >
      <div className='mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'>
        <h2
          id='process-title'
          className='max-w-[20ch] text-[clamp(2rem,3.6vw,2.75rem)] text-foreground'
        >
          {t('title')}
        </h2>

        <ol className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4'>
          {steps.map((step, index) => (
            <ProcessStep
              key={step.title}
              index={String(index + 1).padStart(2, '0')}
              title={step.title}
              description={step.description}
            />
          ))}
        </ol>

        <div className='mt-12'>
          <Button
            asChild
            variant='brand-outline'
            size='brand'
          >
            <Link
              href='/quote'
              data-track='begin_checkout'
              data-track-category='cta'
              data-track-label='home_process_quote'
            >
              {t('cta')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
