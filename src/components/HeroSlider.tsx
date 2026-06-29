'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface Slide {
  image: string;
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
}

interface HeroSliderProps {
  slides: Slide[];
  locale: string;
}

export default function HeroSlider({ slides, locale }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setIsTransitioning(false);
      }, 300);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo, slides.length]);

  // Auto-advance every 6s
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className='relative h-[75vh] min-h-[520px] w-full overflow-hidden'>
      {/* Background Images */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current && !isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            priority={i === 0}
            className='object-cover object-center'
            sizes='100vw'
          />
        </div>
      ))}

      {/* Gradient overlay — blue-tinted for ocean feel */}
      <div className='absolute inset-0 bg-linear-to-r from-[#0a2744]/75 via-[#0a2744]/40 to-[#0a3d5c]/25' />
      <div className='absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#0a2744]/40' />

      {/* Content */}
      <div className='relative flex h-full items-center'>
        <div className='container mx-auto px-6 sm:px-10 lg:px-16'>
          <div className='max-w-3xl'>
            {/* Badge */}
            <div
              className={`mb-5 transition-all duration-500 ${isTransitioning ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}
            >
              <span className='inline-block rounded-full border border-white/30 bg-white/15 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm'>
                {slide.badge}
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`mb-4 text-4xl leading-tight font-black text-white drop-shadow-lg transition-all duration-500 sm:text-5xl lg:text-6xl ${isTransitioning ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}
            >
              {slide.title} <span className='text-[#7dd3fc]'>{slide.titleHighlight}</span>
            </h1>

            {/* Subtitle */}
            <p
              className={`mb-8 text-lg text-white/85 drop-shadow transition-all delay-75 duration-500 sm:text-xl lg:text-2xl ${isTransitioning ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}
            >
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-col gap-3 transition-all delay-100 duration-500 sm:flex-row ${isTransitioning ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}
            >
              <Link
                href={`/${locale}${slide.ctaHref}`}
                className='inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-black/30 transition-all hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-xl'
                data-track='view_item_list'
                data-track-category='hero'
                data-track-label={`hero_primary_${slide.ctaHref.replace(/\//g, '_')}`}
              >
                {slide.cta}
                <svg
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M17 8l4 4m0 0l-4 4m4-4H3'
                  />
                </svg>
              </Link>
              <Link
                href={`/${locale}${slide.ctaSecondaryHref}`}
                className='inline-flex items-center gap-2 rounded-xl border-2 border-white/50 px-7 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/15'
                data-track='begin_checkout'
                data-track-category='hero'
                data-track-label='hero_secondary_quote'
              >
                {slide.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Certification trust strip — bottom left */}
      <div className='absolute bottom-24 left-6 hidden items-center gap-2 sm:flex lg:left-16'>
        {['BAP', 'HACCP', 'BRC', 'GlobalGAP'].map(cert => (
          <span
            key={cert}
            className='rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm'
          >
            {cert}
          </span>
        ))}
      </div>

      {/* Dots navigation — bottom center */}
      <div className='absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3'>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir a slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'h-2.5 w-8 bg-white' : 'h-2.5 w-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Prev/Next arrows — sides */}
      <button
        onClick={prev}
        aria-label='Slide anterior'
        className='absolute top-1/2 left-4 -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/50 lg:left-8'
      >
        <svg
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2.5}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15 19l-7-7 7-7'
          />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label='Siguiente slide'
        className='absolute top-1/2 right-4 -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/50 lg:right-8'
      >
        <svg
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2.5}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M9 5l7 7-7 7'
          />
        </svg>
      </button>

      {/* Slide counter */}
      <div className='absolute right-6 bottom-8 text-xs font-medium text-white/60 lg:right-16'>
        {current + 1} / {slides.length}
      </div>
    </section>
  );
}
