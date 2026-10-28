import { getTranslations } from 'next-intl/server';

import { CERTIFICATIONS, METRICS } from '@/lib/public-data';

// Hairline dividers: 2×2 on mobile, four columns from md up.
function dividerClass(index: number) {
  const vertical = index % 2 === 1 ? 'border-l' : '';
  const stacked = index >= 2 ? 'border-t md:border-t-0' : '';
  const desktop = index >= 1 ? 'md:border-l' : '';
  return `${vertical} ${stacked} ${desktop}`.trim();
}

export default async function EvidenceBar() {
  const t = await getTranslations('metrics');
  const te = await getTranslations('home');

  const items = [
    {
      value: t('markets', { count: METRICS.totalMarkets }),
      label: t('activeMarkets', { count: METRICS.activeMarkets }),
    },
    { value: t('response'), label: te('evidence.response') },
    {
      value: t('certifications', { count: METRICS.certifications }),
      label: CERTIFICATIONS.map(certification => certification.code).join(' · '),
    },
    { value: t('traceability'), label: te('evidence.traceability') },
  ];

  return (
    <dl
      data-testid='evidence-bar'
      className='border-y border-border bg-surface'
    >
      <div className='mx-auto grid max-w-[1200px] grid-cols-2 px-4 sm:px-6 md:grid-cols-4 lg:px-8'>
        {items.map((item, index) => (
          <div
            key={item.label}
            className={`flex flex-col justify-center gap-1.5 border-border px-4 py-7 sm:px-6 ${dividerClass(index)}`}
          >
            <dt className='font-serif text-[32px] leading-none text-foreground lg:text-[40px]'>
              {item.value}
            </dt>
            <dd className='text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase'>
              {item.label}
            </dd>
          </div>
        ))}
      </div>
    </dl>
  );
}
