import type { ReactNode } from 'react';

import { Link } from '@/i18n/routing';

type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  action?: ReactNode;
};

export default function PageHeader({ eyebrow, title, lead, crumbs, action }: PageHeaderProps) {
  return (
    <header className='bg-background'>
      <div className='mx-auto w-full max-w-[1200px] px-4 pt-28 pb-14 sm:px-6 lg:px-8'>
        {crumbs && crumbs.length > 0 && (
          <nav
            aria-label='Breadcrumb'
            className='mb-6 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground'
          >
            {crumbs.map((crumb, index) => (
              <span
                key={`${crumb.label}-${index}`}
                className='flex items-center gap-2'
              >
                {index > 0 && <span aria-hidden='true'>/</span>}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className='transition-colors hover:text-accent'
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className='text-foreground'>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            {eyebrow && (
              <p className='text-[11px] font-semibold tracking-[0.18em] text-accent uppercase'>
                {eyebrow}
              </p>
            )}
            <h1 className='mt-3 max-w-[16ch] text-[clamp(2.5rem,5vw,4.5rem)] text-foreground'>
              {title}
            </h1>
            {lead && (
              <p className='mt-4 max-w-[62ch] text-[17px] leading-relaxed text-muted-foreground'>
                {lead}
              </p>
            )}
          </div>
          {action && <div className='shrink-0'>{action}</div>}
        </div>
      </div>
    </header>
  );
}
