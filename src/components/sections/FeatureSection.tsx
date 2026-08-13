'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Check, ArrowRight } from '@/components/ui/icons';
import { getAnimationClasses, useScrollAnimation } from '@/lib/hooks/use-scroll-animation';

interface FeatureSectionProps {
  eyebrow: string;
  eyebrowColor: 'primary' | 'secondary';
  title: string;
  titleHighlight: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  image: { src: string; alt: string };
  badge?: string;
  imagePosition?: 'left' | 'right';
  bgClassName?: string;
  children?: ReactNode;
  trackLabels?: { primary?: string; secondary?: string };
}

export default function FeatureSection({
  eyebrow,
  eyebrowColor,
  title,
  titleHighlight,
  description,
  features,
  cta,
  ctaSecondary,
  image,
  badge,
  imagePosition = 'left',
  bgClassName = '',
  trackLabels,
}: FeatureSectionProps) {
  const { ref, isVisible } = useScrollAnimation();
  const colorClasses = {
    primary: {
      text: 'text-primary',
      bg: 'bg-primary',
      bgHover: 'hover:bg-primary/90',
      border: 'border-primary',
      btnText: 'text-white',
    },
    secondary: {
      text: 'text-secondary',
      bg: 'bg-secondary',
      bgHover: 'hover:bg-secondary/90',
      border: 'border-secondary',
      btnText: 'text-white',
    },
  };
  const c = colorClasses[eyebrowColor];

  const content = (
    <div className={imagePosition === 'right' ? 'order-2 lg:order-1' : 'order-2'}>
      <span
        className={`mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-widest ${c.text} uppercase`}
      >
        <span className='h-px w-5 bg-current' />
        {eyebrow}
      </span>
      <h2 className='mb-4 text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl'>
        {title} <span className={c.text}>{titleHighlight}</span>
      </h2>
      <p className='mb-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base'>
        {description}
      </p>
      <ul className='mb-7 space-y-2.5'>
        {features.map((feat, i) => (
          <li
            key={i}
            className='flex items-start gap-2.5 text-sm'
          >
            <Check
              className={`mt-0.5 h-4 w-4 shrink-0 ${c.text}`}
              size={16}
              strokeWidth={2.5}
            />
            <span className='text-foreground/80'>{feat}</span>
          </li>
        ))}
      </ul>
      <div className='flex flex-wrap gap-3'>
        <Link
          href={cta.href}
          className={`inline-flex items-center gap-2 rounded-lg ${c.bg} ${c.btnText} px-5 py-2.5 text-sm font-bold shadow-md transition-all hover:-translate-y-0.5 ${c.bgHover}`}
          data-track='begin_checkout'
          data-track-category='feature'
          data-track-label={trackLabels?.primary}
        >
          {cta.label}
          <ArrowRight
            size={16}
            strokeWidth={2.5}
          />
        </Link>
        <Link
          href={ctaSecondary.href}
          className={`inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-all ${badge ? `hover:${c.border} hover:${c.text}` : `hover:${c.border} hover:${c.text}`}`}
          data-track='begin_checkout'
          data-track-category='feature'
          data-track-label={trackLabels?.secondary}
        >
          {ctaSecondary.label}
        </Link>
      </div>
    </div>
  );

  const imageSection = (
    <div className={imagePosition === 'right' ? 'order-1 lg:order-2' : ''}>
      <div className='relative overflow-hidden rounded-lg border border-border/50 bg-card shadow-xl shadow-primary/10'>
        <Image
          src={image.src}
          alt={image.alt}
          width={900}
          height={600}
          className='h-72 w-full object-cover lg:h-[430px]'
        />
        {badge && (
          <div className='absolute top-3 right-3 left-3 flex justify-end'>
            <span className='max-w-full rounded-full bg-white/92 px-3 py-1.5 text-xs font-bold text-primary shadow-sm'>
              {badge}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section className={bgClassName || 'bg-background py-16 lg:py-24'}>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div
          ref={ref}
          className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${getAnimationClasses('fade-up', isVisible)}`}
        >
          {imagePosition === 'left' ? (
            <>
              {imageSection}
              {content}
            </>
          ) : (
            <>
              {content}
              {imageSection}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
