import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: ReactNode;
  align?: 'left' | 'center';
};

export default function SectionHeader({
  eyebrow,
  title,
  lead,
  action,
  align = 'left',
}: SectionHeaderProps) {
  const centered = align === 'center';

  return (
    <div className={cn('max-w-2xl', centered && 'mx-auto text-center')}>
      {eyebrow && (
        <p className='mb-3 text-[11px] font-medium tracking-[0.18em] text-accent uppercase'>
          {eyebrow}
        </p>
      )}
      <h2 className='text-3xl text-foreground sm:text-4xl'>{title}</h2>
      {lead && (
        <p
          className={cn(
            'mt-4 max-w-[56ch] text-[17px] leading-relaxed text-muted-foreground',
            centered && 'mx-auto'
          )}
        >
          {lead}
        </p>
      )}
      {action && <div className='mt-6'>{action}</div>}
    </div>
  );
}
