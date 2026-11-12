import { getTranslations } from 'next-intl/server';

type WhyRow = { title: string; description: string };

export default async function WhyZivahSection() {
  const t = await getTranslations('home.whyZivah');
  const rows = t.raw('rows') as WhyRow[];

  return (
    <section
      aria-labelledby='why-zivah-title'
      className='bg-background py-16 lg:py-24'
    >
      <div className='mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'>
        <h2
          id='why-zivah-title'
          className='max-w-[18ch] text-[clamp(2rem,3.6vw,2.75rem)] text-foreground'
        >
          {t('title')}
        </h2>

        <div className='mt-10'>
          {rows.map((row, index) => (
            <div
              key={row.title}
              className='grid grid-cols-12 gap-x-6 gap-y-2 border-t border-border py-7'
            >
              <p className='col-span-12 text-[11px] font-semibold tracking-[0.18em] text-accent uppercase sm:col-span-2'>
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className='col-span-12 text-[clamp(1.25rem,2vw,1.6rem)] leading-snug text-foreground sm:col-span-5'>
                {row.title}
              </h3>
              <p className='col-span-12 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground sm:col-span-5'>
                {row.description}
              </p>
            </div>
          ))}
          <div className='border-t border-border' />
        </div>
      </div>
    </section>
  );
}
