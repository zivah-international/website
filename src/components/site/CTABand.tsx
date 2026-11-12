import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

type CTABandProps = {
  title: string;
  body: string;
  action: { label: string; href: string };
  secondary?: ReactNode;
  tone?: 'navy' | 'paper';
};

export default function CTABand({ title, body, action, secondary, tone = 'navy' }: CTABandProps) {
  const navy = tone === 'navy';

  return (
    <section
      className={cn(
        'py-16 lg:py-24',
        navy
          ? 'bg-primary text-primary-foreground'
          : 'border-y border-border bg-surface text-foreground'
      )}
    >
      <div className='mx-auto grid w-full max-w-[1200px] gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:items-end lg:gap-12 lg:px-8'>
        <div className='lg:col-span-8'>
          <h2
            className={cn(
              'max-w-[22ch] text-[clamp(2rem,3.6vw,2.75rem)]',
              navy ? 'text-primary-foreground' : 'text-foreground'
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              'mt-4 max-w-[56ch] text-[17px] leading-relaxed',
              navy ? 'text-primary-foreground/75' : 'text-muted-foreground'
            )}
          >
            {body}
          </p>
        </div>

        <div className='flex flex-col items-start gap-5 lg:col-span-4 lg:items-end'>
          <Button
            asChild
            variant='brand'
            size='brand'
          >
            <Link
              href={action.href}
              data-track='begin_checkout'
              data-track-category='cta'
              data-track-label='cta_band_quote'
            >
              {action.label}
            </Link>
          </Button>
          {secondary && (
            <div
              className={cn(
                'text-sm leading-relaxed',
                navy ? 'text-primary-foreground/75' : 'text-muted-foreground'
              )}
            >
              {secondary}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
