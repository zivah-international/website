import { getTranslations } from 'next-intl/server';

import Navigation from '@/components/Navigation';
import QuoteForm from '@/components/QuoteForm';
import { Link } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'quote' });
  return {
    title: `${t('title')} | ZIVAH International`,
    description: t('description'),
  };
}

export default async function QuotePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'quote' });

  return (
    <div className='min-h-screen'>
      <Navigation />

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <section className='from-background to-muted/40 bg-linear-to-b pt-28 pb-14'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Breadcrumb */}
          <nav
            className='text-muted-foreground mb-6 flex items-center gap-2 text-sm'
            aria-label='Breadcrumb'
          >
            <Link
              href='/'
              className='hover:text-accent transition-colors'
            >
              Inicio
            </Link>
            <span>/</span>
            <span className='text-foreground font-medium'>{t('title')}</span>
          </nav>

          <div className='border-accent/30 flex items-center gap-4 border-l-4 pl-5'>
            <div className='bg-accent/10 text-accent hidden shrink-0 rounded-xl p-3 sm:block'>
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
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <div>
              <p className='text-accent mb-1 text-xs font-semibold tracking-widest uppercase'>
                Cotización B2B
              </p>
              <h1 className='text-foreground text-3xl font-bold sm:text-4xl'>{t('title')}</h1>
              <p className='text-muted-foreground mt-1 text-base'>{t('description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <div className='bg-card border-border/40 border-b'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-wrap items-center justify-center gap-6 py-4 text-sm'>
            {[
              { icon: '⏱️', text: 'Respuesta en 24h' },
              { icon: '🔒', text: 'Información confidencial' },
              { icon: '🌎', text: 'Exportamos a 5+ países' },
              { icon: '📋', text: 'Sin compromisos' },
            ].map(item => (
              <div
                key={item.text}
                className='text-muted-foreground flex items-center gap-2'
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form ─────────────────────────────────────────────────────────── */}
      <section className='bg-background py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-4xl'>
            <QuoteForm />
          </div>
        </div>
      </section>

      {/* ── Alternative contact ──────────────────────────────────────────── */}
      <section className='bg-muted/30 py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
            <p className='text-muted-foreground mb-6 text-base'>
              ¿Preferís contacto directo? Estamos disponibles por WhatsApp o email.
            </p>
            <div className='flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
              <a
                href='https://wa.me/593999002893?text=Hola%2C%20quisiera%20solicitar%20una%20cotización.'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-[#20bd5c]'
                data-track='generate_lead'
                data-track-source='whatsapp_quote'
                data-track-currency='USD'
                data-track-value='0'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  className='h-5 w-5 fill-white'
                >
                  <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
                </svg>
                WhatsApp
              </a>
              <a
                href='mailto:sales@zivahinternational.com?subject=Solicitud%20de%20Cotización'
                className='text-foreground border-border inline-flex items-center gap-2 rounded-xl border-2 px-6 py-3 font-semibold transition-all hover:border-current/60'
                data-track='generate_lead'
                data-track-source='email_quote'
                data-track-currency='USD'
                data-track-value='0'
              >
                sales@zivahinternational.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
