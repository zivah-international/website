import { getTranslations } from 'next-intl/server';

import Navigation from '@/components/Navigation';
import { Link } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'markets' });
  return {
    title: `${t('title')} | ZIVAH International`,
    description: t('description'),
  };
}

const MARKETS = [
  {
    flag: '🇺🇸',
    country: 'Estados Unidos',
    city: 'Miami, Florida',
    desc: 'Oficina comercial propia. Hub de distribución para toda Norteamérica. Tiempo de tránsito: 3-5 días desde Guayaquil.',
    active: true,
  },
  {
    flag: '🇳🇱',
    country: 'Países Bajos',
    city: 'Rotterdam (gateway Europa)',
    desc: 'Acceso a toda la Unión Europea a través del puerto de Rotterdam. Certificación BRC requerida.',
    active: true,
  },
  {
    flag: '🇯🇵',
    country: 'Japón',
    city: 'Tokio · Osaka',
    desc: 'Mercado premium para camarón vannamei IQF de alta calidad. Estándares HACCP estrictos.',
    active: true,
  },
  {
    flag: '🇨🇳',
    country: 'China',
    city: 'Shanghai · Guangzhou',
    desc: 'Volúmenes grandes de camarón y frutas tropicales. Documentación sanitaria completa.',
    active: true,
  },
  {
    flag: '🇨🇦',
    country: 'Canadá',
    city: 'Toronto · Vancouver',
    desc: 'Acceso desde nuestra oficina en Miami. Mercado orgánico en crecimiento para café arábica.',
    active: false,
  },
  {
    flag: '🇦🇪',
    country: 'Emiratos Árabes',
    city: 'Dubái',
    desc: 'Hub de redistribución hacia Medio Oriente y África. Alta demanda de mariscos premium.',
    active: false,
  },
];

const ADVANTAGES = [
  {
    icon: '🏢',
    title: 'Doble presencia',
    desc: 'Sede en Samborondón, Ecuador + oficina comercial en Miami, FL. Negociamos en tu zona horaria.',
  },
  {
    icon: '📋',
    title: 'Documentación completa',
    desc: 'Certificados sanitarios, fitosanitarios, origen, HACCP y BRC listos antes del embarque.',
  },
  {
    icon: '🚢',
    title: 'Logística FOB',
    desc: 'Embarque desde Puerto de Guayaquil. Coordinamos transporte, seguro y aduana.',
  },
  {
    icon: '💬',
    title: 'Soporte 24/7',
    desc: 'Atención comercial disponible en español e inglés. Respuesta garantizada en 24h.',
  },
];

export default async function MarketsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'markets' });

  return (
    <div className='min-h-screen'>
      <Navigation />

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <section className='from-background to-muted/30 bg-linear-to-b pt-28 pb-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
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
            <span className='text-foreground font-medium'>Mercados</span>
          </nav>

          <div className='flex items-center gap-3'>
            <div className='bg-secondary/10 text-secondary rounded-full p-3'>
              <svg
                className='h-6 w-6'
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
            </div>
            <div>
              <div className='bg-secondary/10 text-secondary mb-1 inline-block rounded-full px-3 py-0.5 text-xs font-semibold'>
                {t('badge')}
              </div>
              <h1 className='text-foreground text-3xl font-bold sm:text-4xl'>{t('title')}</h1>
              <p className='text-muted-foreground mt-1 max-w-2xl text-base'>{t('description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────────────────── */}
      <div className='bg-card border-border/40 border-b'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='divide-border/30 grid grid-cols-3 divide-x py-1'>
            {[
              { value: t('statValues.countriesServed'), label: t('stats.countriesServed') },
              { value: t('statValues.yearsExperience'), label: t('stats.yearsExperience') },
              { value: t('statValues.specializedSupport'), label: t('stats.specializedSupport') },
            ].map((stat, i) => (
              <div
                key={i}
                className='py-5 text-center'
              >
                <div className='text-accent text-2xl font-black sm:text-3xl'>{stat.value}</div>
                <div className='text-muted-foreground mt-1 text-xs font-medium'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Markets grid ──────────────────────────────────────────────────── */}
      <section className='bg-background py-16'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <h2 className='text-foreground mb-3 text-3xl font-bold sm:text-4xl'>
              Destinos de Exportación
            </h2>
            <p className='text-muted-foreground text-base'>
              Exportamos activamente a 5+ países y expandiéndonos continuamente.
            </p>
          </div>

          <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {MARKETS.map(market => (
              <div
                key={market.country}
                className={`bg-card rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md ${
                  market.active
                    ? 'border-primary/20 hover:border-primary/40'
                    : 'border-border/50 opacity-75'
                }`}
              >
                <div className='mb-3 flex items-start justify-between'>
                  <span className='text-4xl'>{market.flag}</span>
                  {market.active ? (
                    <span className='rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400'>
                      Activo
                    </span>
                  ) : (
                    <span className='text-muted-foreground bg-muted rounded-full px-2.5 py-0.5 text-xs font-semibold'>
                      Expansión
                    </span>
                  )}
                </div>
                <h3 className='text-foreground mb-0.5 text-lg font-bold'>{market.country}</h3>
                <p className='text-accent mb-3 text-xs font-medium'>{market.city}</p>
                <p className='text-muted-foreground text-sm leading-relaxed'>{market.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why us ────────────────────────────────────────────────────────── */}
      <section className='bg-muted/30 py-16'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <h2 className='text-foreground mb-3 text-3xl font-bold sm:text-4xl'>
              ¿Por qué elegir ZIVAH?
            </h2>
            <p className='text-muted-foreground text-base'>
              Ventajas competitivas para importadores exigentes.
            </p>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {ADVANTAGES.map((adv, i) => (
              <div
                key={i}
                className='bg-card rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md'
              >
                <div className='mb-4 text-3xl'>{adv.icon}</div>
                <h3 className='text-foreground mb-2 text-base font-bold'>{adv.title}</h3>
                <p className='text-muted-foreground text-sm leading-relaxed'>{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className='bg-primary py-14 text-white'>
        <div className='container mx-auto px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='mb-3 text-2xl font-bold'>¿Estás en alguno de estos mercados?</h2>
          <p className='mb-6 text-white/80'>
            Hablemos sobre cómo podemos abastecer tu operación con productos certificados de
            Ecuador.
          </p>
          <div className='flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
            <Link
              href='/quote'
              className='text-primary inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold shadow-md transition-all hover:bg-white/90'
            >
              Solicitar Cotización
            </Link>
            <Link
              href='/contact'
              className='inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-6 py-3 font-semibold text-white transition-all hover:border-white hover:bg-white/10'
            >
              Contactar asesor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
