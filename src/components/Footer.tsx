import { getLocale, getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import { Linkedin, Instagram, Facebook } from './ui/icons';

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations('footer');

  return (
    <footer className='border-t border-border/30 bg-foreground/[0.03] py-16 text-foreground dark:bg-white/[0.02]'>
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
            <p className='mb-4 text-sm text-muted-foreground'>{t('companyDescription')}</p>
            <p className='text-sm text-muted-foreground'>
              <strong className='text-foreground'>{t('specialists')}</strong> {t('specialistsList')}
            </p>
            <div className='mt-6 flex items-center gap-3'>
              <a
                href='https://www.linkedin.com/company/zivahinternational'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='LinkedIn'
                className='flex h-9 w-9 items-center justify-center rounded-lg border border-current/20 text-muted-foreground transition-colors hover:border-current/60 hover:text-primary'
              >
                <Linkedin size={16} />
              </a>
              <a
                href='https://www.instagram.com/zivahinternational'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Instagram'
                className='flex h-9 w-9 items-center justify-center rounded-lg border border-current/20 text-muted-foreground transition-colors hover:border-current/60 hover:text-accent'
              >
                <Instagram size={16} />
              </a>
              <a
                href='https://www.facebook.com/zivahinternationalsa'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Facebook'
                className='flex h-9 w-9 items-center justify-center rounded-lg border border-current/20 text-muted-foreground transition-colors hover:border-current/60 hover:text-primary'
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className='mb-4 text-lg font-semibold text-foreground'>{t('mainProducts')}</h4>
            <ul className='space-y-2 text-sm text-muted-foreground'>
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
                    className='transition-colors hover:text-accent'
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className='mb-4 text-lg font-semibold text-foreground'>{t('services')}</h4>
            <ul className='space-y-2 text-sm text-muted-foreground'>
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
                    className='transition-colors hover:text-accent'
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className='mb-4 text-lg font-semibold text-foreground'>{t('legal')}</h4>
            <ul className='space-y-2 text-sm text-muted-foreground'>
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
                    className='transition-colors hover:text-accent'
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='border-t border-border pt-8'>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            <p className='text-sm text-muted-foreground'>
              {t('copyright', { year: new Date().getFullYear() })}
            </p>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              <span className='text-xs text-muted-foreground'>
                Samborondón, Ecuador &amp; Miami, FL
              </span>
              <span className='text-muted-foreground/30'>·</span>
              <a
                href='mailto:sales@zivahinternational.com'
                className='text-xs text-muted-foreground transition-colors hover:text-accent'
                data-track='generate_lead'
                data-track-source='email_footer'
                data-track-currency='USD'
                data-track-value='0'
              >
                sales@zivahinternational.com
              </a>
              <span className='text-muted-foreground/30'>·</span>
              <a
                href='tel:+593999002893'
                className='text-xs text-muted-foreground transition-colors hover:text-accent'
                data-track='generate_lead'
                data-track-source='phone_footer'
                data-track-currency='USD'
                data-track-value='0'
              >
                +593 99 900 2893
              </a>
            </div>
            <p className='text-sm text-muted-foreground'>{t('tagline')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
