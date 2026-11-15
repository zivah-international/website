'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Link, usePathname } from '@/i18n/routing';
import { useMounted } from '@/lib/hooks/use-mounted';

import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui/button';
import { Menu } from './ui/icons';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';

export default function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mounted = useMounted();
  const t = useTranslations('nav');
  const pathname = usePathname();

  const isHome = pathname === '/';
  const onQuotePage = pathname.startsWith('/quote');
  // Transparent over the home hero only; solid on every internal page.
  // `isHome` is known during SSR (usePathname), so the server already renders
  // the transparent hero state — no flash of a solid header on first paint.
  const isTransparent = isHome && !isScrolled;

  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const items = [
    { id: 'products', href: '/products', label: t('products') },
    { id: 'quality', href: '/quality', label: t('quality') },
    { id: 'markets', href: '/markets', label: t('markets') },
    { id: 'contact', href: '/contact', label: t('contact') },
  ];

  const legalLinks = [
    { href: '/legal/privacy-policy', label: t('privacy') },
    { href: '/legal/terms-of-service', label: t('terms') },
    { href: '/legal/cookie-policy', label: t('cookies') },
    { href: '/legal/data-protection', label: t('dataProtection') },
  ];

  const headerClass = `site-header fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
    isTransparent
      ? 'bg-transparent text-primary-foreground'
      : 'border-b border-border bg-background/95 text-foreground backdrop-blur'
  }`;

  return (
    <>
      {/* Skip link — first focusable element on the page */}
      <a
        href='#main'
        className='sr-only fixed top-2 left-2 z-[100] rounded-[2px] bg-accent px-4 py-3 text-sm font-medium text-accent-foreground focus:not-sr-only focus:outline-none'
      >
        {t('skipToContent')}
      </a>

      <header
        className={headerClass}
        suppressHydrationWarning
      >
        <nav
          aria-label={t('mainLabel')}
          className='mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[76px] lg:px-8'
        >
          {/* Logo */}
          <Link
            href='/'
            aria-label='ZIVAH International'
            className='flex shrink-0 items-center'
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/assets/images/zivah-logo.svg'
              alt='ZIVAH International S.A.'
              className={`h-9 w-auto transition-[filter] duration-300${isTransparent ? 'brightness-0 invert' : ''}`}
            />
          </Link>

          {/* Desktop links */}
          <div className='hidden items-center gap-7 lg:flex'>
            {items.map(item => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`border-b-2 py-1 text-[13px] font-medium tracking-[0.12em] uppercase transition-colors ${
                    isActive ? 'border-accent' : 'border-transparent hover:border-current/50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right cluster */}
          <div className='flex items-center gap-2 sm:gap-3'>
            <div className='hidden sm:block'>
              <LanguageSwitcher />
            </div>
            <ThemeToggle />
            {!onQuotePage && (
              <Button
                asChild
                variant='brand'
                size='brand'
                className='hidden md:inline-flex'
              >
                <Link
                  href='/quote'
                  data-track='begin_checkout'
                  data-track-category='nav'
                  data-track-label='nav_quote_desktop'
                >
                  {t('quoteCta')}
                </Link>
              </Button>
            )}

            {/* Mobile drawer trigger */}
            <Sheet
              open={isMobileOpen}
              onOpenChange={setIsMobileOpen}
            >
              <SheetTrigger asChild>
                <Button
                  type='button'
                  variant='icon'
                  size='icon'
                  aria-label={t('openMenu')}
                  className='lg:hidden'
                >
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side='right'
                className='w-full border-l border-border bg-background p-0 sm:max-w-sm'
              >
                <SheetTitle className='border-b border-border px-6 pt-6 pb-4 text-base font-semibold text-foreground'>
                  {t('menuTitle')}
                </SheetTitle>

                <div className='flex h-full flex-col overflow-y-auto px-6 pt-6 pb-10'>
                  <div className='flex flex-col gap-1'>
                    {items.map(item => {
                      const isActive = pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={`border-l-2 py-3 pl-4 text-base font-medium tracking-[0.08em] uppercase transition-colors ${
                            isActive
                              ? 'border-accent text-foreground'
                              : 'border-transparent text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>

                  <div className='mt-6 flex items-center justify-between border-t border-border pt-6'>
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>

                  {!onQuotePage && (
                    <Button
                      asChild
                      variant='brand'
                      size='brand'
                      className='mt-6 w-full'
                    >
                      <Link
                        href='/quote'
                        onClick={() => setIsMobileOpen(false)}
                        data-track='begin_checkout'
                        data-track-category='nav'
                        data-track-label='nav_quote_mobile'
                      >
                        {t('quoteCta')}
                      </Link>
                    </Button>
                  )}

                  <div className='mt-8 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-6'>
                    {legalLinks.map(legal => (
                      <Link
                        key={legal.href}
                        href={legal.href}
                        onClick={() => setIsMobileOpen(false)}
                        className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                      >
                        {legal.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    </>
  );
}
