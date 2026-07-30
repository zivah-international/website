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
      ? 'bg-background/80 backdrop-blur-xl shadow-lg'
      : 'bg-transparent backdrop-blur-none'
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
            className='relative z-50 flex items-center transition-transform hover:scale-105'
            aria-label='Ir al inicio'
          >
            <img
              src='/assets/images/zivah-logo.svg'
              alt='ZIVAH International S.A.'
              width={120}
              height={40}
              style={{ width: '120px', height: '40px' }}
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
                  className='relative font-medium'
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
              variant='icon'
              size='icon'
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className='relative z-50 lg:hidden'
              aria-label={isMobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              suppressHydrationWarning
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 lg:hidden ${
          mounted && isMobileOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        suppressHydrationWarning
      >
        {/* Backdrop */}
        <div
          className='absolute inset-0 bg-black/40 backdrop-blur-sm'
          onClick={() => setIsMobileOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-sm bg-background shadow-2xl transition-transform duration-500 ease-out ${
            mounted && isMobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className='flex h-full flex-col overflow-y-auto px-6 pt-24 pb-8'>
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
