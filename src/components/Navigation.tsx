'use client';

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
  const [activeSection, setActiveSection] = useState('home');
  const mounted = useMounted();
  const t = useTranslations('nav');

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

  // Handle section detection
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const sections = ['home', 'products', 'quote', 'quality', 'markets', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Set initial active section
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navigation height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigationItems = [
    { id: 'home', label: t('home'), icon: '🏠' },
    { id: 'products', label: t('products'), icon: '📦' },
    { id: 'quote', label: t('quote'), icon: '💰' },
    { id: 'quality', label: t('quality'), icon: '⭐' },
    { id: 'markets', label: t('markets'), icon: '🌍' },
    { id: 'contact', label: t('contact'), icon: '📞' },
  ];

  // Use consistent className order to prevent hydration mismatch
  const headerClassName = `fixed top-0 w-full z-50 transition-all duration-300 ${
    mounted && isScrolled
      ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
      : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm'
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
          {/* Logo - Using div to ensure consistent SSR/hydration */}
          <div
            className='flex cursor-pointer items-center space-x-2 transition-transform hover:scale-105'
            onClick={handleLogoClick}
            role='button'
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogoClick();
              }
            }}
            aria-label='Ir al inicio'
          >
            {/* Using regular img tag instead of Next.js Image for SVG to avoid optimization issues */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/assets/images/zivah-logo.svg'
              alt='ZIVAH International S.A.'
              width={120}
              height={40}
              style={{ width: '120px', height: '40px' }}
            />
          </div>

          {/* Desktop Navigation */}
          <div className='hidden items-center space-x-1 lg:flex'>
            {navigationItems.map(item => (
              <Button
                key={item.id}
                variant={mounted && activeSection === item.id ? 'nav-active' : 'nav'}
                size='nav'
                onClick={() => scrollToSection(item.id)}
                className='relative font-medium'
              >
                <span className='mr-2'>{item.icon}</span>
                {item.label}
                <div
                  className={`absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full ${
                    mounted && activeSection === item.id ? 'bg-accent' : 'bg-transparent'
                  }`}
                />
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
              onClick={() => scrollToSection('quote')}
              variant='accent'
              size='default'
              className='hidden items-center shadow-md hover:shadow-lg md:inline-flex'
            >
              <span className='mr-2'>💬</span>
              {t('quote')}
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
          className={`overflow-hidden transition-all duration-300 lg:hidden ${
            mounted && isMobileMenuOpen ? 'mt-4 max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          suppressHydrationWarning
        >
          <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800'>
            {/* Mobile Navigation Items */}
            <div className='space-y-2'>
              {navigationItems.map(item => (
                <Button
                  key={item.id}
                  variant={mounted && activeSection === item.id ? 'nav-active' : 'nav-mobile'}
                  size='nav-mobile'
                  onClick={() => scrollToSection(item.id)}
                  className='font-medium'
                >
                  <span className='mr-3'>{item.icon}</span>
                  {item.label}
                </Button>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className='mt-6 border-t border-gray-200 pt-4 dark:border-gray-700'>
              <div className='mb-4 flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {t('language')}
                </span>
                <LanguageSwitcher />
              </div>

              <Button
                onClick={() => scrollToSection('quote')}
                variant='accent'
                size='lg'
                className='w-full shadow-md'
              >
                <span className='mr-2'>💬</span>
                {t('quote')}
              </Button>
            </div>

            {/* Quick Links */}
            <div className='mt-6 border-t border-gray-200 pt-4 dark:border-gray-700'>
              <div className='grid grid-cols-2 gap-3'>
                <Link
                  href='/legal/privacy-policy'
                  className='text-sm text-gray-600 transition-colors hover:text-green-600 dark:text-gray-400'
                >
                  {t('privacy')}
                </Link>
                <Link
                  href='/legal/terms-of-service'
                  className='text-sm text-gray-600 transition-colors hover:text-green-600 dark:text-gray-400'
                >
                  {t('terms')}
                </Link>
                <Link
                  href='/legal/cookie-policy'
                  className='text-sm text-gray-600 transition-colors hover:text-green-600 dark:text-gray-400'
                >
                  {t('cookies')}
                </Link>
                <Link
                  href='/legal/data-protection'
                  className='text-sm text-gray-600 transition-colors hover:text-green-600 dark:text-gray-400'
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
