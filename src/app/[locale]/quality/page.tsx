import { getTranslations } from 'next-intl/server';

import Navigation from '@/components/Navigation';
import { Link } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'quality' });
  return {
    title: `${t('title')} | ZIVAH International`,
    description: t('description'),
  };
}

const CERTS = [
  {
    code: 'BAP',
    name: 'Best Aquaculture Practices',
    descKey: 'bap' as const,
    color: 'border-secondary/30 bg-secondary/5',
    badge: 'bg-secondary text-secondary-foreground',
    icon: '🦐',
  },
  {
    code: 'HACCP',
    name: 'Hazard Analysis Critical Control Points',
    descKey: 'haccp' as const,
    color: 'border-accent/30 bg-accent/5',
    badge: 'bg-accent text-accent-foreground',
    icon: '🔬',
  },
  {
    code: 'BRC',
    name: 'British Retail Consortium',
    descKey: 'brc' as const,
    color: 'border-primary/30 bg-primary/5',
    badge: 'bg-primary text-primary-foreground',
    icon: '🏷️',
  },
  {
    code: 'GlobalGAP',
    name: 'Global Good Agricultural Practices',
    descKey: 'globalGap' as const,
    color: 'border-accent/20 bg-accent/8',
    badge: 'bg-accent/80 text-accent-foreground',
    icon: '🌱',
  },
];

const PROCESS_STEPS = [
  {
    icon: '🌊',
    title: 'Origen controlado',
    desc: 'Granjas auditadas en Guayas, Ecuador. Trazabilidad desde la larva hasta el empaque.',
  },
  {
    icon: '🧪',
    title: 'Control de calidad',
    desc: 'Análisis microbiológico y fisicoquímico en laboratorios certificados antes de cada despacho.',
  },
  {
    icon: '❄️',
    title: 'Cadena de frío',
    desc: 'Empaque IQF / congelado en temperatura controlada. Cumplimiento HACCP en toda la cadena.',
  },
  {
    icon: '📄',
    title: 'Documentación lista',
    desc: 'Certificados sanitarios, fitosanitarios, COO y phytosanitary listo para el embarque.',
  },
];

export default async function QualityPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'quality' });

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
            <span className='text-foreground font-medium'>Calidad y Certificaciones</span>
          </nav>

          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 text-primary rounded-full p-3'>
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
                  d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                />
              </svg>
            </div>
            <div>
              <h1 className='text-foreground text-3xl font-bold sm:text-4xl'>{t('title')}</h1>
              <p className='text-muted-foreground mt-1 max-w-2xl text-base'>{t('description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cert badges strip ─────────────────────────────────────────────── */}
      <div className='bg-card border-border/40 border-b'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-wrap items-center justify-center gap-4 py-5'>
            {CERTS.map(cert => (
              <span
                key={cert.code}
                className={`${cert.badge} rounded-full px-4 py-1.5 text-sm font-bold tracking-wide shadow-sm`}
              >
                {cert.icon} {cert.code}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Certifications detail ─────────────────────────────────────────── */}
      <section className='bg-background py-16'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <div className='bg-primary/10 text-primary mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold'>
              Estándares Internacionales
            </div>
            <h2 className='text-foreground text-3xl font-bold sm:text-4xl'>
              Nuestras Certificaciones
            </h2>
            <p className='text-muted-foreground mt-3 text-base'>
              Cada certificación nos permite acceder a mercados más exigentes y dar a nuestros
              clientes la garantía que necesitan.
            </p>
          </div>

          <div className='grid gap-6 sm:grid-cols-2'>
            {CERTS.map(cert => (
              <div
                key={cert.code}
                className={`rounded-2xl border-2 p-7 ${cert.color} transition-all hover:shadow-md`}
              >
                <div className='mb-4 flex items-start gap-4'>
                  <div className='text-4xl'>{cert.icon}</div>
                  <div>
                    <div
                      className={`${cert.badge} mb-1 inline-block rounded-full px-3 py-0.5 text-xs font-bold`}
                    >
                      {cert.code}
                    </div>
                    <h3 className='text-foreground text-lg font-bold'>{cert.name}</h3>
                  </div>
                </div>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  {t(`certifications.${cert.descKey}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quality Process ───────────────────────────────────────────────── */}
      <section className='bg-muted/30 py-16'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <h2 className='text-foreground mb-3 text-3xl font-bold sm:text-4xl'>
              Proceso de Control de Calidad
            </h2>
            <p className='text-muted-foreground text-base'>
              De la granja al contenedor, cada paso está documentado y auditado.
            </p>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={i}
                className='bg-card relative rounded-2xl border p-6 shadow-sm'
              >
                <div className='text-primary/15 mb-2 text-5xl font-black'>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className='mb-3 text-3xl'>{step.icon}</div>
                <h3 className='text-foreground mb-1 text-base font-bold'>{step.title}</h3>
                <p className='text-muted-foreground text-sm leading-relaxed'>{step.desc}</p>
                {i < PROCESS_STEPS.length - 1 && (
                  <div className='text-muted-foreground/30 absolute top-1/2 -right-4 hidden -translate-y-1/2 text-xl lg:block'>
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recognition ───────────────────────────────────────────────────── */}
      <section className='bg-background py-16'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-3xl'>
            <div className='bg-card border-primary/20 rounded-2xl border-2 p-8 text-center shadow-sm'>
              <div className='mb-4 text-4xl'>🏆</div>
              <h2 className='text-foreground mb-3 text-2xl font-bold'>{t('awards.title')}</h2>
              <p className='text-muted-foreground text-base leading-relaxed'>
                {t('awards.description')}
              </p>
              <div className='mt-8 grid gap-6 sm:grid-cols-3'>
                {[
                  { value: '5+', label: 'Países destino' },
                  { value: '4+', label: 'Años exportando' },
                  { value: '100%', label: 'Productos certificados' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className='text-primary text-3xl font-black'>{stat.value}</div>
                    <div className='text-muted-foreground text-sm'>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className='bg-primary py-14 text-white'>
        <div className='container mx-auto px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='mb-3 text-2xl font-bold'>¿Necesitás documentación específica?</h2>
          <p className='mb-6 text-white/80'>
            Te enviamos certificados, fichas técnicas y análisis de laboratorio antes del pedido.
          </p>
          <div className='flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
            <Link
              href='/quote'
              className='text-primary inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold shadow-md transition-all hover:bg-white/90'
              data-track='begin_checkout'
              data-track-label='solicitar_cotizacion_quality'
              data-track-category='cta'
            >
              Solicitar Cotización
            </Link>
            <a
              href='https://wa.me/593999002893?text=Hola%2C%20necesito%20documentación%20de%20certificaciones.'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-6 py-3 font-semibold text-white transition-all hover:border-white hover:bg-white/10'
              data-track='generate_lead'
              data-track-source='whatsapp_quality'
              data-track-currency='USD'
              data-track-value='0'
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
