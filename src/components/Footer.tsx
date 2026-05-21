import { getLocale, getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations('footer');

  return (
    <footer className='bg-muted/50 text-foreground py-16'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {/* Brand */}
          <div>
            <div className='mb-4 flex items-center gap-2'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src='/assets/images/zivah-logo.svg'
                alt='ZIVAH International'
                width={100}
                height={34}
                style={{ width: '100px', height: '34px' }}
              />
            </div>
            <p className='text-muted-foreground mb-4 text-sm'>{t('companyDescription')}</p>
            <p className='text-muted-foreground text-sm'>
              <strong className='text-foreground'>{t('specialists')}</strong> {t('specialistsList')}
            </p>
            <div className='mt-6 flex items-center gap-3'>
              <a
                href='https://www.linkedin.com/company/zivahinternational'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='LinkedIn'
                className='text-muted-foreground hover:text-primary flex h-9 w-9 items-center justify-center rounded-lg border border-current/20 transition-colors hover:border-current/60'
              >
                <svg
                  className='h-4 w-4'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                </svg>
              </a>
              <a
                href='https://www.instagram.com/zivahinternational'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Instagram'
                className='text-muted-foreground hover:text-accent flex h-9 w-9 items-center justify-center rounded-lg border border-current/20 transition-colors hover:border-current/60'
              >
                <svg
                  className='h-4 w-4'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' />
                </svg>
              </a>
              <a
                href='https://www.facebook.com/zivahinternationalsa'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Facebook'
                className='text-muted-foreground hover:text-primary flex h-9 w-9 items-center justify-center rounded-lg border border-current/20 transition-colors hover:border-current/60'
              >
                <svg
                  className='h-4 w-4'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    fillRule='evenodd'
                    d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                    clipRule='evenodd'
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className='text-foreground mb-4 text-lg font-semibold'>{t('mainProducts')}</h4>
            <ul className='text-muted-foreground space-y-2 text-sm'>
              {(
                [
                  ['tropicalFruits', '/products?category=frutas-tropicales'],
                  ['seafood', '/products?category=productos-mar'],
                  ['arabicaCoffee', '/products?category=cafe'],
                  ['premiumShrimp', '/products?category=camaron'],
                  ['shrimpLarvae', '/products?category=larvas'],
                  ['viewFullCatalog', '/products'],
                ] as [string, string][]
              ).map(([key, href]) => (
                <li key={key}>
                  <Link
                    href={href as '/products'}
                    locale={locale as 'es' | 'en'}
                    className='hover:text-accent transition-colors'
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className='text-foreground mb-4 text-lg font-semibold'>{t('services')}</h4>
            <ul className='text-muted-foreground space-y-2 text-sm'>
              {(
                [
                  ['certifications', '/quality'],
                  ['quotes', '/quote'],
                  ['globalDistribution', '/markets'],
                  ['technicalAdvice', '/contact'],
                  ['support247', '/contact'],
                ] as [string, string][]
              ).map(([key, href]) => (
                <li key={key}>
                  <Link
                    href={href as '/quality'}
                    locale={locale as 'es' | 'en'}
                    className='hover:text-accent transition-colors'
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className='text-foreground mb-4 text-lg font-semibold'>{t('legal')}</h4>
            <ul className='text-muted-foreground space-y-2 text-sm'>
              {(
                [
                  ['privacyPolicy', '/legal/privacy-policy'],
                  ['termsConditions', '/legal/terms-of-service'],
                  ['cookiePolicy', '/legal/cookie-policy'],
                  ['dataProtection', '/legal/data-protection'],
                ] as [string, string][]
              ).map(([key, href]) => (
                <li key={key}>
                  <Link
                    href={href as '/legal/privacy-policy'}
                    locale={locale as 'es' | 'en'}
                    className='hover:text-accent transition-colors'
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='border-border border-t pt-8'>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            <p className='text-muted-foreground text-sm'>
              {t('copyright', { year: new Date().getFullYear() })}
            </p>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              <span className='text-muted-foreground text-xs'>
                Samborondón, Ecuador &amp; Miami, FL
              </span>
              <span className='text-muted-foreground/30'>·</span>
              <a
                href='mailto:sales@zivahinternational.com'
                className='text-muted-foreground hover:text-accent text-xs transition-colors'
              >
                sales@zivahinternational.com
              </a>
              <span className='text-muted-foreground/30'>·</span>
              <a
                href='tel:+593999002893'
                className='text-muted-foreground hover:text-accent text-xs transition-colors'
              >
                +593 99 900 2893
              </a>
            </div>
            <p className='text-muted-foreground text-sm'>{t('tagline')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
