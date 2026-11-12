import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import { CONTACT_INFO } from '@/lib/contact-info';

import { Facebook, Instagram, Linkedin } from './ui/icons';

const PRODUCT_LINKS = [
  ['whiteShrimp', '/products?category=camaron'],
  ['shrimpLarvae', '/products?category=larvas'],
  ['freshTuna', '/products?category=marinos-y-pesca'],
  ['viewCatalog', '/products'],
] as const;

const COMPANY_LINKS = [
  ['quality', '/quality'],
  ['markets', '/markets'],
  ['contact', '/contact'],
  ['quoteCta', '/quote'],
] as const;

const LEGAL_LINKS = [
  ['privacyPolicy', '/legal/privacy-policy'],
  ['termsConditions', '/legal/terms-of-service'],
  ['cookiePolicy', '/legal/cookie-policy'],
  ['dataProtection', '/legal/data-protection'],
] as const;

const SOCIAL_LINKS = [
  {
    href: 'https://www.linkedin.com/company/zivahinternational',
    label: 'LinkedIn',
    Icon: Linkedin,
  },
  {
    href: 'https://www.instagram.com/zivahinternational',
    label: 'Instagram',
    Icon: Instagram,
  },
  {
    href: 'https://www.facebook.com/zivahinternationalsa',
    label: 'Facebook',
    Icon: Facebook,
  },
] as const;

const linkClass = 'text-sm text-muted-foreground transition-colors hover:text-foreground';

export default async function Footer() {
  const t = await getTranslations('footer');

  return (
    <footer className='site-footer border-t border-border bg-surface py-14 text-foreground'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]'>
          {/* Brand */}
          <div>
            <div className='mb-4'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src='/assets/images/zivah-logo.svg'
                alt='ZIVAH International'
                className='h-9 w-auto'
              />
            </div>
            <p className='max-w-xs text-sm text-muted-foreground'>{t('brandLine')}</p>
            <div className='mt-6 flex items-center gap-1'>
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                  className='flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground'
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3 className='mb-4 text-[13px] font-semibold tracking-[0.12em] uppercase'>
              {t('productsHeading')}
            </h3>
            <ul className='space-y-2.5'>
              {PRODUCT_LINKS.map(([key, href]) => (
                <li key={key}>
                  <Link
                    href={href}
                    className={linkClass}
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
            <p className='mt-4 text-xs text-muted-foreground'>{t('agriculturalLine')}</p>
          </div>

          {/* Compañía */}
          <div>
            <h3 className='mb-4 text-[13px] font-semibold tracking-[0.12em] uppercase'>
              {t('companyHeading')}
            </h3>
            <ul className='space-y-2.5'>
              {COMPANY_LINKS.map(([key, href]) => (
                <li key={key}>
                  <Link
                    href={href}
                    className={linkClass}
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className='mb-4 text-[13px] font-semibold tracking-[0.12em] uppercase'>
              {t('contactHeading')}
            </h3>
            <ul className='space-y-2.5 text-sm text-muted-foreground'>
              <li>
                {CONTACT_INFO.ecuador} / {CONTACT_INFO.miami}
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className='transition-colors hover:text-foreground'
                  data-track='generate_lead'
                  data-track-source='email_footer'
                  data-track-currency='USD'
                  data-track-value='0'
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_INFO.phoneHref}
                  className='transition-colors hover:text-foreground'
                  data-track='generate_lead'
                  data-track-source='phone_footer'
                  data-track-currency='USD'
                  data-track-value='0'
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className='text-xs'>{t('hours')}</li>
            </ul>
          </div>
        </div>

        {/* Legal row */}
        <div className='mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row'>
          <p className='text-xs text-muted-foreground'>
            © {new Date().getFullYear()} ZIVAH International S.A.
          </p>
          <div className='flex flex-wrap items-center justify-center gap-x-5 gap-y-2'>
            {LEGAL_LINKS.map(([key, href]) => (
              <Link
                key={key}
                href={href}
                className='text-xs text-muted-foreground transition-colors hover:text-foreground'
              >
                {t(key)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
