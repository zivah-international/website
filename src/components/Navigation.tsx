'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Link } from '@/i18n/routing';
import { useMounted } from '@/lib/hooks/use-mounted';

import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui/button';
import {
  Home,
  Package,
  QuoteIcon as Quote,
  Shield,
  Globe,
  Mail,
  Menu,
  X,
  ArrowRight,
} from './ui/icons';

const NAV_ICONS = {
  home: Home,
  products: Package,
  quote: Quote,
  quality: Shield,
  markets: Globe,
  contact: Mail,
} as const;

export default function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mounted = useMounted();
  const t = useTranslations('nav');
  const pathname = usePathname();

  const getActiveSection = () => {
    if (pathname.match(/\/products/)) return 'products';
    if (pathname.match(/\/quote/)) return 'quote';
    if (pathname.match(/\/quality/)) return 'quality';
    if (pathname.match(/\/markets/)) return 'markets';
    if (pathname.match(/\/contact/)) return 'contact';
    return 'home';
  };
  const activeSection = getActiveSection();

  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen, mounted]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  const items = [
    { id: 'home', href: '/', label: t('home'), icon: NAV_ICONS.home },
    { id: 'products', href: '/products', label: t('products'), icon: NAV_ICONS.products },
    { id: 'quote', href: '/quote', label: t('quote'), icon: NAV_ICONS.quote },
    { id: 'quality', href: '/quality', label: t('quality'), icon: NAV_ICONS.quality },
    { id: 'markets', href: '/markets', label: t('markets'), icon: NAV_ICONS.markets },
    { id: 'contact', href: '/contact', label: t('contact'), icon: NAV_ICONS.contact },
  ];

  const headerClass = `fixed top-0 w-full z-50 transition-all duration-500 ${
    mounted && isScrolled
      ? 'border-b border-border/70 bg-background/90 shadow-sm backdrop-blur-xl'
      : 'border-b border-white/10 bg-[#061927]/55 backdrop-blur-md'
  }`;

  const isActive = (id: string) => activeSection === id;

  return (
    <header
      className={headerClass}
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
            className='relative z-50 flex items-center overflow-hidden rounded-lg bg-white/90 px-2 py-1 shadow-sm transition-transform hover:scale-[1.02]'
            aria-label='Ir al inicio'
          >
            <img
              src='/assets/images/zivah-logo.svg'
              alt='ZIVAH International S.A.'
              width={136}
              height={46}
              className='h-10 w-28 object-cover sm:h-11 sm:w-32'
            />
          </Link>

          {/* Desktop nav */}
          <div className='hidden items-center space-x-1 lg:flex'>
            {items.map(item => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  asChild
                  variant={isActive(item.id) ? 'nav-active' : 'nav'}
                  size='nav'
                  className={`relative font-medium ${
                    mounted && !isScrolled && !isActive(item.id)
                      ? 'text-white/78 hover:bg-white/10 hover:text-white'
                      : ''
                  }`}
                >
                  <Link href={item.href}>
                    <span className='mr-1.5 opacity-70'>
                      <Icon size={16} />
                    </span>
                    {item.label}
                    <div
                      className={`absolute bottom-0 left-1/2 h-0.5 w-4/5 -translate-x-1/2 transform rounded-full transition-all duration-300 ${
                        isActive(item.id) ? 'bg-primary' : 'bg-transparent'
                      }`}
                    />
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Desktop actions */}
          <div className='flex items-center space-x-3'>
            <div className='hidden md:block'>
              <LanguageSwitcher />
            </div>
            <ThemeToggle />
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
                <Quote size={16} />
                {t('quote')}
              </Link>
            </Button>

            {/* Mobile toggle */}
            <Button
              type='button'
              variant='icon'
              size='icon'
              onClick={() => setIsMobileOpen(open => !open)}
              className={`relative z-50 lg:hidden ${
                mounted && !isScrolled ? 'text-white hover:bg-white/10 hover:text-white' : ''
              }`}
              aria-label={isMobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMobileOpen}
              aria-controls='mobile-navigation'
              suppressHydrationWarning
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        id='mobile-navigation'
        className={`fixed inset-0 z-[80] h-dvh transition-all duration-300 lg:hidden ${
          isMobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        suppressHydrationWarning
      >
        {/* Backdrop */}
        <div
          className='absolute inset-0 bg-black/40 backdrop-blur-sm'
          aria-hidden='true'
          onClick={() => setIsMobileOpen(false)}
        />

        {/* Drawer panel */}
        <div
          role='dialog'
          aria-modal='true'
          aria-label='Menú de navegación'
          className={`absolute top-0 right-0 h-dvh w-full max-w-sm border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out ${
            isMobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className='flex h-full flex-col overflow-y-auto px-6 pt-24 pb-8'>
            <button
              type='button'
              onClick={() => setIsMobileOpen(false)}
              className='absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800'
              aria-label='Cerrar panel de navegación'
            >
              <X size={20} />
            </button>

            <div className='space-y-1'>
              {items.map(item => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    asChild
                    variant={isActive(item.id) ? 'nav-active' : 'nav-mobile'}
                    size='nav-mobile'
                    className='w-full font-medium'
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <span className='mr-3 opacity-70'>
                        <Icon size={18} />
                      </span>
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </div>

            <div className='mt-8 border-t border-border pt-6'>
              <div className='mb-6 flex items-center justify-between'>
                <span className='text-sm font-medium text-foreground'>{t('language')}</span>
                <LanguageSwitcher />
              </div>

              <Button
                asChild
                variant='accent'
                size='lg'
                className='w-full shadow-md'
                onClick={() => setIsMobileOpen(false)}
              >
                <Link
                  href='/quote'
                  data-track='begin_checkout'
                  data-track-category='nav'
                  data-track-label='nav_quote_mobile'
                >
                  {t('quote')}
                  <ArrowRight
                    size={16}
                    className='ml-2'
                  />
                </Link>
              </Button>
            </div>

            <div className='mt-8 border-t border-border pt-6'>
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
      </div>
    </header>
  );
}
