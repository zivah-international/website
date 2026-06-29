'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Link } from '@/i18n/routing';
import { useMounted } from '@/lib/hooks/use-mounted';

import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui/button';

interface NavigationProps {
  onScrollToSection?: (sectionId: string) => void;
}

export default function Navigation({ onScrollToSection: _onScrollToSection }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mounted = useMounted();
  const t = useTranslations('nav');
  const pathname = usePathname();

  // Derive active section from current pathname
  const getActiveSection = () => {
    if (pathname.match(/\/products/)) return 'products';
    if (pathname.match(/\/quote/)) return 'quote';
    if (pathname.match(/\/quality/)) return 'quality';
    if (pathname.match(/\/markets/)) return 'markets';
    if (pathname.match(/\/contact/)) return 'contact';
    return 'home';
  };
  const activeSection = getActiveSection();

  // Handle scroll effect
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Set initial scroll state
    setIsScrolled(window.scrollY > 50);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  const NavIcons = {
    home: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-4 w-4'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
        />
      </svg>
    ),
    products: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-4 w-4'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
        />
      </svg>
    ),
    quote: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-4 w-4'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        />
      </svg>
    ),
    quality: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-4 w-4'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
        />
      </svg>
    ),
    markets: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-4 w-4'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    ),
    contact: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-4 w-4'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
        />
      </svg>
    ),
  };

  const navigationItems = [
    { id: 'home', href: '/', label: t('home'), icon: NavIcons.home },
    { id: 'products', href: '/products', label: t('products'), icon: NavIcons.products },
    { id: 'quote', href: '/quote', label: t('quote'), icon: NavIcons.quote },
    { id: 'quality', href: '/quality', label: t('quality'), icon: NavIcons.quality },
    { id: 'markets', href: '/markets', label: t('markets'), icon: NavIcons.markets },
    { id: 'contact', href: '/contact', label: t('contact'), icon: NavIcons.contact },
  ];

  // Use consistent className order to prevent hydration mismatch
  const headerClassName = `fixed top-0 w-full z-50 transition-all duration-300 ${
    mounted && isScrolled
      ? 'bg-background/95 backdrop-blur-md shadow-lg'
      : 'bg-background/90 backdrop-blur-sm'
  }`;

  return (
    <header
      className={headerClassName}
      suppressHydrationWarning
    >
      <nav
        className='container mx-auto px-4 py-3'
        suppressHydrationWarning
      >
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <Link
            href='/'
            className='flex items-center space-x-2 transition-transform hover:scale-105'
            aria-label='Ir al inicio'
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/assets/images/zivah-logo.svg'
              alt='ZIVAH International S.A.'
              width={120}
              height={40}
              style={{ width: '120px', height: '40px' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden items-center space-x-1 lg:flex'>
            {navigationItems.map(item => (
              <Button
                key={item.id}
                asChild
                variant={activeSection === item.id ? 'nav-active' : 'nav'}
                size='nav'
                className='relative font-medium'
              >
                <Link href={item.href}>
                  <span className='mr-1.5 opacity-70'>{item.icon}</span>
                  {item.label}
                  <div
                    className={`absolute bottom-0 left-1/2 h-0.5 w-4/5 -translate-x-1/2 transform rounded-full transition-all duration-300 ${
                      activeSection === item.id ? 'bg-primary' : 'bg-transparent'
                    }`}
                  />
                </Link>
              </Button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className='flex items-center space-x-3'>
            {/* Language Selector */}
            <div className='hidden md:block'>
              <LanguageSwitcher />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* CTA Button */}
            <Button
              asChild
              variant='default'
              size='default'
              className='hidden items-center gap-2 shadow-md hover:shadow-lg md:inline-flex'
            >
              <Link
                href='/quote'
                data-track='begin_checkout'
                data-track-category='nav'
                data-track-label='nav_quote_desktop'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
                {t('quote')}
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant='icon'
              size='icon'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='lg:hidden'
              aria-label='Toggle mobile menu'
              suppressHydrationWarning
            >
              <div className='flex h-6 w-6 flex-col items-center justify-center'>
                <span
                  className={`block h-0.5 w-5 bg-current transition-all duration-300 ${
                    mounted && isMobileMenuOpen ? 'translate-y-1 rotate-45' : '-translate-y-1'
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-current transition-all duration-300 ${
                    mounted && isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-current transition-all duration-300 ${
                    mounted && isMobileMenuOpen ? '-translate-y-1 -rotate-45' : 'translate-y-1'
                  }`}
                />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`transition-all duration-300 lg:hidden ${
            mounted && isMobileMenuOpen
              ? 'mt-4 max-h-[80vh] opacity-100'
              : 'max-h-0 overflow-hidden opacity-0'
          }`}
          suppressHydrationWarning
        >
          <div className='max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-background p-4 shadow-xl'>
            {/* Mobile Navigation Items */}
            <div className='space-y-2'>
              {navigationItems.map(item => (
                <Button
                  key={item.id}
                  asChild
                  variant={activeSection === item.id ? 'nav-active' : 'nav-mobile'}
                  size='nav-mobile'
                  className='font-medium'
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className='mr-3 opacity-70'>{item.icon}</span>
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className='mt-6 border-t border-border pt-4'>
              <div className='mb-4 flex items-center justify-between'>
                <span className='text-sm font-medium text-foreground'>{t('language')}</span>
                <LanguageSwitcher />
              </div>

              <Button
                asChild
                variant='accent'
                size='lg'
                className='w-full shadow-md'
              >
                <Link
                  href='/quote'
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-track='begin_checkout'
                  data-track-category='nav'
                  data-track-label='nav_quote_mobile'
                >
                  {t('quote')}
                </Link>
              </Button>
            </div>

            {/* Quick Links */}
            <div className='mt-6 border-t border-border pt-4'>
              <div className='grid grid-cols-2 gap-3'>
                <Link
                  href='/legal/privacy-policy'
                  className='text-sm text-muted-foreground transition-colors hover:text-accent'
                >
                  {t('privacy')}
                </Link>
                <Link
                  href='/legal/terms-of-service'
                  className='text-sm text-muted-foreground transition-colors hover:text-accent'
                >
                  {t('terms')}
                </Link>
                <Link
                  href='/legal/cookie-policy'
                  className='text-sm text-muted-foreground transition-colors hover:text-accent'
                >
                  {t('cookies')}
                </Link>
                <Link
                  href='/legal/data-protection'
                  className='text-sm text-muted-foreground transition-colors hover:text-accent'
                >
                  {t('dataProtection')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
