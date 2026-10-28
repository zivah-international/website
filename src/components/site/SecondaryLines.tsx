import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';

export default async function SecondaryLines() {
  const t = await getTranslations('home');

  return (
    <p
      data-testid='secondary-lines'
      className='mt-10 border-t border-border pt-6 text-[15px] leading-relaxed text-muted-foreground'
    >
      {t.rich('secondary.text', {
        a: chunks => (
          <Link
            href='/products?category=agricolas'
            className='prose-link font-semibold text-foreground'
          >
            {chunks}
          </Link>
        ),
      })}
    </p>
  );
}
