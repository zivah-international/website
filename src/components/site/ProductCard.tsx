import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

import { Link } from '@/i18n/routing';

type ProductCardProps = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  linkLabel: string;
  origin?: string;
  certifications?: string[];
  priority?: boolean;
  testId?: string;
};

export default function ProductCard({
  href,
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
  linkLabel,
  origin,
  certifications,
  priority = false,
  testId = 'product-card',
}: ProductCardProps) {
  return (
    <article
      data-testid={testId}
      className='group flex flex-col overflow-hidden rounded-[2px] border border-border bg-surface'
    >
      <div className='relative aspect-[4/3] overflow-hidden bg-muted'>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority={priority}
          sizes='(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
          className='object-cover'
        />
      </div>
      <div className='flex flex-1 flex-col p-5 sm:p-6'>
        <p className='text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase'>
          {eyebrow}
        </p>
        <h3 className='mt-2 text-xl text-foreground'>{title}</h3>
        <p className='mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground'>
          {description}
        </p>
        {origin && <p className='mt-3 text-[13px] text-muted-foreground'>{origin}</p>}
        {certifications && certifications.length > 0 && (
          <p className='mt-1 text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase'>
            {certifications.join(' · ')}
          </p>
        )}
        <Link
          href={href}
          className='mt-5 inline-flex items-center gap-1.5 self-start text-[11px] font-semibold tracking-[0.14em] text-foreground uppercase transition-colors hover:text-accent'
        >
          {linkLabel}
          <ArrowRight
            aria-hidden='true'
            className='size-3.5 transition-transform group-hover:translate-x-0.5'
          />
        </Link>
      </div>
    </article>
  );
}
