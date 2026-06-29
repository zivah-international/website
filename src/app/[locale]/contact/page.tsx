import { getTranslations } from 'next-intl/server';

import Navigation from '@/components/Navigation';
import { Link } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: `${t('title')} | ZIVAH International`,
    description: t('description'),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <div className='min-h-screen'>
      <Navigation />

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <section className='bg-linear-to-b from-background to-muted/40 pt-28 pb-14'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <nav
            className='mb-6 flex items-center gap-2 text-sm text-muted-foreground'
            aria-label='Breadcrumb'
          >
            <Link
              href='/'
              className='transition-colors hover:text-accent'
            >
              Inicio
            </Link>
            <span>/</span>
            <span className='font-medium text-foreground'>{t('title')}</span>
          </nav>
          <div className='flex items-center gap-4 border-l-4 border-primary/30 pl-5'>
            <div className='hidden shrink-0 rounded-xl bg-primary/10 p-3 text-primary sm:block'>
              <svg
                className='h-7 w-7'
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
            </div>
            <div>
              <p className='mb-1 text-xs font-semibold tracking-widest text-primary uppercase'>
                Contacto
              </p>
              <h1 className='text-3xl font-bold text-foreground sm:text-4xl'>{t('title')}</h1>
              <p className='mt-1 text-base text-muted-foreground'>{t('description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Grid ─────────────────────────────────────────────────── */}
      <section className='bg-background py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid gap-8 lg:grid-cols-2'>
            {/* Contact Channels */}
            <div className='space-y-5'>
              <h2 className='text-xl font-bold text-foreground'>{t('contactChannels')}</h2>

              {/* WhatsApp */}
              <a
                href='https://wa.me/593999002893?text=Hola%2C%20me%20pongo%20en%20contacto%20desde%20la%20web%20de%20ZIVAH%20International.'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-[#25D366]/40 hover:shadow-md'
                data-track='generate_lead'
                data-track-source='whatsapp_contact'
                data-track-currency='USD'
                data-track-value='0'
              >
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    className='h-6 w-6 fill-[#25D366]'
                  >
                    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
                  </svg>
                </div>
                <div>
                  <p className='font-semibold text-foreground'>WhatsApp Business</p>
                  <p className='text-sm text-muted-foreground'>
                    +593 99 900 2893 · Respuesta inmediata
                  </p>
                </div>
                <svg
                  className='ml-auto h-5 w-5 text-muted-foreground'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </a>

              {/* Email */}
              <a
                href='mailto:sales@zivahinternational.com'
                className='flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md'
                data-track='generate_lead'
                data-track-source='email_contact'
                data-track-currency='USD'
                data-track-value='0'
              >
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10'>
                  <svg
                    className='h-6 w-6 text-primary'
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
                </div>
                <div>
                  <p className='font-semibold text-foreground'>Email Comercial</p>
                  <p className='text-sm text-muted-foreground'>
                    sales@zivahinternational.com · 24h respuesta
                  </p>
                </div>
                <svg
                  className='ml-auto h-5 w-5 text-muted-foreground'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </a>

              {/* Phone */}
              <a
                href='tel:+593999002893'
                className='flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-secondary/30 hover:shadow-md'
              >
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10'>
                  <svg
                    className='h-6 w-6 text-secondary'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                    />
                  </svg>
                </div>
                <div>
                  <p className='font-semibold text-foreground'>Teléfono</p>
                  <p className='text-sm text-muted-foreground'>+593 99 900 2893</p>
                </div>
                <svg
                  className='ml-auto h-5 w-5 text-muted-foreground'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </a>

              {/* Offices */}
              <div className='rounded-2xl border border-border bg-card p-5 shadow-sm'>
                <p className='mb-3 font-semibold text-foreground'>📍 Oficinas</p>
                <div className='grid gap-3 sm:grid-cols-2'>
                  <div>
                    <p className='text-sm font-medium text-foreground'>🇪🇨 Ecuador</p>
                    <p className='text-xs text-muted-foreground'>Samborondón, Guayas</p>
                    <p className='text-xs text-muted-foreground'>Operación logística principal</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-foreground'>🇺🇸 Estados Unidos</p>
                    <p className='text-xs text-muted-foreground'>Miami, Florida</p>
                    <p className='text-xs text-muted-foreground'>Operación comercial</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div>
              <h2 className='mb-5 text-xl font-bold text-foreground'>{t('sendMessage')}</h2>
              <form
                action='mailto:sales@zivahinternational.com'
                method='post'
                encType='text/plain'
                className='space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm'
              >
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div>
                    <label className='mb-1.5 block text-sm font-medium text-foreground'>
                      {t('name')} *
                    </label>
                    <input
                      type='text'
                      name='name'
                      required
                      className='w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent/50 focus:outline-none'
                      placeholder='Tu nombre'
                    />
                  </div>
                  <div>
                    <label className='mb-1.5 block text-sm font-medium text-foreground'>
                      {t('company')}
                    </label>
                    <input
                      type='text'
                      name='company'
                      className='w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent/50 focus:outline-none'
                      placeholder='Tu empresa'
                    />
                  </div>
                </div>
                <div>
                  <label className='mb-1.5 block text-sm font-medium text-foreground'>
                    {t('email')} *
                  </label>
                  <input
                    type='email'
                    name='email'
                    required
                    className='w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent/50 focus:outline-none'
                    placeholder='tu@empresa.com'
                  />
                </div>
                <div>
                  <label className='mb-1.5 block text-sm font-medium text-foreground'>
                    {t('subject')}
                  </label>
                  <input
                    type='text'
                    name='subject'
                    className='w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent/50 focus:outline-none'
                    placeholder='¿En qué te podemos ayudar?'
                  />
                </div>
                <div>
                  <label className='mb-1.5 block text-sm font-medium text-foreground'>
                    {t('message')} *
                  </label>
                  <textarea
                    name='message'
                    required
                    rows={4}
                    className='w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent/50 focus:outline-none'
                    placeholder='Cuéntanos sobre tu proyecto de importación...'
                  />
                </div>
                <button
                  type='submit'
                  className='w-full rounded-xl bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary/90'
                >
                  {t('send')}
                </button>
                <p className='text-center text-xs text-muted-foreground'>
                  También podés ir directamente a{' '}
                  <Link
                    href='/quote'
                    className='text-accent hover:underline'
                    data-track='begin_checkout'
                    data-track-category='contact'
                    data-track-label='contact_inline_quote'
                  >
                    Solicitar Cotización
                  </Link>{' '}
                  para un proceso más completo.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
