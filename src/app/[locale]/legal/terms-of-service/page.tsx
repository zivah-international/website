import type { Metadata } from 'next';

import { Link } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | ZIVAH International S.A.',
  description:
    'Términos y condiciones de uso del sitio web de ZIVAH International S.A. - Condiciones para el uso de nuestros servicios.',
  keywords: 'términos condiciones, términos uso, condiciones servicio, ZIVAH International',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://zivahinternational.com/legal/terms-of-service',
  },
  openGraph: {
    title: 'Términos y Condiciones | ZIVAH International S.A.',
    description: 'Condiciones para el uso de nuestros servicios y sitio web.',
    url: 'https://zivahinternational.com/legal/terms-of-service',
    siteName: 'ZIVAH International S.A.',
    type: 'website',
  },
};

const SECTIONS = [
  { id: 'aceptacion', label: '1. Aceptación de los Términos' },
  { id: 'definiciones', label: '2. Definiciones' },
  { id: 'uso-sitio', label: '3. Uso del Sitio Web' },
  { id: 'productos-servicios', label: '4. Productos y Servicios' },
  { id: 'propiedad-intelectual', label: '5. Propiedad Intelectual' },
  { id: 'privacidad', label: '6. Política de Privacidad' },
  { id: 'descargos', label: '7. Descargos de Responsabilidad' },
  { id: 'terminacion', label: '8. Terminación' },
  { id: 'ley-aplicable', label: '9. Ley Aplicable y Jurisdicción' },
  { id: 'modificaciones', label: '10. Modificaciones' },
  { id: 'contacto', label: '11. Contacto' },
];

const sectionClass = 'scroll-mt-28 border-t border-border pt-8 first:border-t-0 first:pt-0';
const h2Class = 'mb-4 font-serif text-2xl leading-snug text-foreground';
const h3Class = 'mt-6 mb-3 text-[17px] font-semibold text-foreground';
const listClass = 'list-inside list-disc space-y-2';

export default function TermsOfServicePage() {
  return (
    <article>
      <div>
        <h1 className='font-serif text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.1] text-foreground'>
          Términos y Condiciones
        </h1>
        <p className='mt-4 text-[14px] text-muted-foreground'>
          Última actualización: 21 de octubre de 2026
        </p>

        <nav
          aria-label='Índice de secciones'
          className='mt-8 border-y border-border py-5'
        >
          <p className='text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase'>
            Contenido
          </p>
          <ol className='mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2'>
            {SECTIONS.map(section => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className='text-[14px] leading-relaxed text-muted-foreground transition-colors hover:text-accent'
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className='mt-10 space-y-10 text-[16px] leading-[1.7] text-muted-foreground'>
        <section
          id='aceptacion'
          className={sectionClass}
        >
          <h2 className={h2Class}>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar el sitio web de ZIVAH International S.A. (&quot;nosotros&quot;,
            &quot;nuestro&quot; o &quot;ZIVAH&quot;), usted acepta estar sujeto a estos Términos y
            Condiciones de Uso. Si no está de acuerdo con estos términos, no debe utilizar este
            sitio web ni nuestros servicios.
          </p>
        </section>

        <section
          id='definiciones'
          className={sectionClass}
        >
          <h2 className={h2Class}>2. Definiciones</h2>
          <ul className={listClass}>
            <li>
              <strong>&quot;Sitio Web&quot;:</strong> El sitio web de ZIVAH International S.A.
              ubicado en zivahinternational.com
            </li>
            <li>
              <strong>&quot;Servicios&quot;:</strong> Todos los servicios ofrecidos por ZIVAH
              International S.A., incluyendo cotizaciones, información de productos, y soporte
            </li>
            <li>
              <strong>&quot;Usuario&quot;:</strong> Cualquier persona que accede o utiliza el Sitio
              Web
            </li>
            <li>
              <strong>&quot;Contenido&quot;:</strong> Toda la información, texto, gráficos,
              imágenes, y otros materiales disponibles en el Sitio Web
            </li>
          </ul>
        </section>

        <section
          id='uso-sitio'
          className={sectionClass}
        >
          <h2 className={h2Class}>3. Uso del Sitio Web</h2>

          <h3 className={h3Class}>3.1 Uso Permitido</h3>
          <p className='mb-4'>
            Usted puede utilizar el Sitio Web únicamente para fines legales y de acuerdo con estos
            términos. Está autorizado para:
          </p>
          <ul className={`${listClass} mb-4`}>
            <li>Acceder y navegar por el contenido informativo</li>
            <li>Solicitar cotizaciones de productos</li>
            <li>Contactar con nuestro equipo de ventas</li>
            <li>Descargar información pública disponible</li>
          </ul>

          <h3 className={h3Class}>3.2 Uso Prohibido</h3>
          <p className='mb-4'>Queda estrictamente prohibido:</p>
          <ul className={listClass}>
            <li>Utilizar el sitio web para fines ilegales o fraudulentos</li>
            <li>Intentar acceder a áreas restringidas sin autorización</li>
            <li>Interferir con el funcionamiento del sitio web</li>
            <li>Copiar, distribuir o modificar el contenido sin permiso</li>
            <li>Enviar spam o contenido malicioso</li>
            <li>Violar derechos de propiedad intelectual</li>
          </ul>
        </section>

        <section
          id='productos-servicios'
          className={sectionClass}
        >
          <h2 className={h2Class}>4. Productos y Servicios</h2>

          <h3 className={h3Class}>4.1 Información de Productos</h3>
          <p className='mb-4'>
            Toda la información sobre productos en nuestro sitio web es de carácter general e
            informativo. Las especificaciones, precios y disponibilidad pueden cambiar sin previo
            aviso.
          </p>

          <h3 className={h3Class}>4.2 Cotizaciones</h3>
          <p className='mb-4'>
            Las cotizaciones proporcionadas son válidas por el período especificado en cada caso. No
            constituyen una oferta firme hasta que sean confirmadas por escrito por ZIVAH
            International S.A.
          </p>

          <h3 className={h3Class}>4.3 Disponibilidad</h3>
          <p>
            Nos esforzamos por mantener la precisión de la información de productos, pero no
            garantizamos la disponibilidad de todos los productos en todo momento.
          </p>
        </section>

        <section
          id='propiedad-intelectual'
          className={sectionClass}
        >
          <h2 className={h2Class}>5. Propiedad Intelectual</h2>
          <p className='mb-4'>
            Todo el contenido del Sitio Web, incluyendo pero no limitado a texto, gráficos,
            logotipos, imágenes, software y código fuente, está protegido por leyes de propiedad
            intelectual y es propiedad de ZIVAH International S.A. o sus licenciantes.
          </p>
          <p>
            Queda prohibida la reproducción, distribución, modificación o creación de obras
            derivadas sin el consentimiento expreso y por escrito de ZIVAH International S.A.
          </p>
        </section>

        <section
          id='privacidad'
          className={sectionClass}
        >
          <h2 className={h2Class}>6. Política de Privacidad</h2>
          <p>
            El uso de nuestros servicios está sujeto a nuestra{' '}
            <Link
              href='/legal/privacy-policy'
              className='text-accent underline underline-offset-4'
            >
              Política de Privacidad
            </Link>
            , que forma parte integral de estos términos.
          </p>
        </section>

        <section
          id='descargos'
          className={sectionClass}
        >
          <h2 className={h2Class}>7. Descargos de Responsabilidad</h2>

          <h3 className={h3Class}>7.1 Información General</h3>
          <p className='mb-4'>
            La información proporcionada en este sitio web es de carácter general y no constituye
            asesoramiento profesional específico. Siempre debe consultar con expertos calificados
            para decisiones comerciales.
          </p>

          <h3 className={h3Class}>7.2 No Garantías</h3>
          <p className='mb-4'>
            El sitio web y los servicios se proporcionan &quot;tal cual&quot; sin garantías de
            ningún tipo, expresas o implícitas, incluyendo pero no limitado a garantías de
            comerciabilidad, idoneidad para un propósito particular, o no infracción.
          </p>

          <h3 className={h3Class}>7.3 Limitación de Responsabilidad</h3>
          <p>
            ZIVAH International S.A. no será responsable por daños directos, indirectos,
            incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar
            nuestros servicios.
          </p>
        </section>

        <section
          id='terminacion'
          className={sectionClass}
        >
          <h2 className={h2Class}>8. Terminación</h2>
          <p>
            Podemos terminar o suspender su acceso al sitio web inmediatamente, sin previo aviso,
            por cualquier motivo, incluyendo pero no limitado a la violación de estos términos. Tras
            la terminación, cesarán todos los derechos y licencias otorgados bajo estos términos.
          </p>
        </section>

        <section
          id='ley-aplicable'
          className={sectionClass}
        >
          <h2 className={h2Class}>9. Ley Aplicable y Jurisdicción</h2>
          <p>
            Estos términos se regirán e interpretarán de acuerdo con las leyes de la República del
            Ecuador. Cualquier disputa que surja de estos términos estará sujeta a la jurisdicción
            exclusiva de los tribunales competentes de Guayas, Ecuador.
          </p>
        </section>

        <section
          id='modificaciones'
          className={sectionClass}
        >
          <h2 className={h2Class}>10. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios
            entrarán en vigor inmediatamente después de su publicación en el sitio web. El uso
            continuado del sitio web después de dichos cambios constituye su aceptación de los
            términos modificados.
          </p>
        </section>

        <section
          id='contacto'
          className={sectionClass}
        >
          <h2 className={h2Class}>11. Contacto</h2>
          <p className='mb-4'>
            Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos:
          </p>
          <div className='rounded-[2px] border border-border bg-surface p-6'>
            <div className='grid gap-6 sm:grid-cols-2'>
              <div>
                <h3 className='mb-2 text-[15px] font-semibold text-foreground'>
                  Oficina Principal
                </h3>
                <p>
                  ZIVAH International S.A.
                  <br />
                  Casa Matriz Mz 10 S L 31
                  <br />
                  Samborondón, Guayas, Ecuador
                  <br />
                  Teléfono: +593999002893
                  <br />
                  Email: legal@zivahinternational.com
                </p>
              </div>
              <div>
                <h3 className='mb-2 text-[15px] font-semibold text-foreground'>
                  Oficina de Distribución
                </h3>
                <p>
                  ZIVAH International
                  <br />
                  Miami, Florida, Estados Unidos
                  <br />
                  Email: legal@zivahinternational.com
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className='mt-12 border-t border-border pt-6'>
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-[14px] font-medium text-foreground underline-offset-4 transition-colors hover:text-accent hover:underline'
        >
          ← Volver al Inicio
        </Link>
      </footer>
    </article>
  );
}
