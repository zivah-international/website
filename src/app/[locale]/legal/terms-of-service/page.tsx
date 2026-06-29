import type { Metadata } from 'next';
import Link from 'next/link';

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

export default function TermsOfServicePage() {
  return (
    <div className='bg-background min-h-screen py-16'>
      <div className='container mx-auto max-w-4xl px-4'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='text-foreground mb-4 text-4xl font-bold'>Términos y Condiciones</h1>
          <p className='text-muted-foreground text-lg'>
            Última actualización:{' '}
            {new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Content */}
        <div className='bg-card space-y-8 rounded-xl p-8 shadow-lg'>
          {/* Introduction */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>
              1. Aceptación de los Términos
            </h2>
            <p className='text-muted-foreground leading-relaxed'>
              Al acceder y utilizar el sitio web de ZIVAH International S.A. (&quot;nosotros&quot;,
              &quot;nuestro&quot; o &quot;ZIVAH&quot;), usted acepta estar sujeto a estos Términos y
              Condiciones de Uso. Si no está de acuerdo con estos términos, no debe utilizar este
              sitio web ni nuestros servicios.
            </p>
          </section>

          {/* Definitions */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>2. Definiciones</h2>
            <ul className='text-muted-foreground list-inside list-disc space-y-2'>
              <li>
                <strong>&quot;Sitio Web&quot;:</strong> El sitio web de ZIVAH International S.A.
                ubicado en zivahinternational.com
              </li>
              <li>
                <strong>&quot;Servicios&quot;:</strong> Todos los servicios ofrecidos por ZIVAH
                International S.A., incluyendo cotizaciones, información de productos, y soporte
              </li>
              <li>
                <strong>&quot;Usuario&quot;:</strong> Cualquier persona que accede o utiliza el
                Sitio Web
              </li>
              <li>
                <strong>&quot;Contenido&quot;:</strong> Toda la información, texto, gráficos,
                imágenes, y otros materiales disponibles en el Sitio Web
              </li>
            </ul>
          </section>

          {/* Use of Website */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>3. Uso del Sitio Web</h2>

            <h3 className='text-foreground mb-3 text-xl font-medium'>3.1 Uso Permitido</h3>
            <p className='text-muted-foreground mb-4'>
              Usted puede utilizar el Sitio Web únicamente para fines legales y de acuerdo con estos
              términos. Está autorizado para:
            </p>
            <ul className='text-muted-foreground mb-4 list-inside list-disc space-y-2'>
              <li>Acceder y navegar por el contenido informativo</li>
              <li>Solicitar cotizaciones de productos</li>
              <li>Contactar con nuestro equipo de ventas</li>
              <li>Descargar información pública disponible</li>
            </ul>

            <h3 className='text-foreground mb-3 text-xl font-medium'>3.2 Uso Prohibido</h3>
            <p className='text-muted-foreground mb-4'>Queda estrictamente prohibido:</p>
            <ul className='text-muted-foreground list-inside list-disc space-y-2'>
              <li>Utilizar el sitio web para fines ilegales o fraudulentos</li>
              <li>Intentar acceder a áreas restringidas sin autorización</li>
              <li>Interferir con el funcionamiento del sitio web</li>
              <li>Copiar, distribuir o modificar el contenido sin permiso</li>
              <li>Enviar spam o contenido malicioso</li>
              <li>Violar derechos de propiedad intelectual</li>
            </ul>
          </section>

          {/* Products and Services */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>
              4. Productos y Servicios
            </h2>

            <h3 className='text-foreground mb-3 text-xl font-medium'>
              4.1 Información de Productos
            </h3>
            <p className='text-muted-foreground mb-4'>
              Toda la información sobre productos en nuestro sitio web es de carácter general e
              informativo. Las especificaciones, precios y disponibilidad pueden cambiar sin previo
              aviso.
            </p>

            <h3 className='text-foreground mb-3 text-xl font-medium'>4.2 Cotizaciones</h3>
            <p className='text-muted-foreground mb-4'>
              Las cotizaciones proporcionadas son válidas por el período especificado en cada caso.
              No constituyen una oferta firme hasta que sean confirmadas por escrito por ZIVAH
              International S.A.
            </p>

            <h3 className='text-foreground mb-3 text-xl font-medium'>4.3 Disponibilidad</h3>
            <p className='text-muted-foreground'>
              Nos esforzamos por mantener la precisión de la información de productos, pero no
              garantizamos la disponibilidad de todos los productos en todo momento.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>
              5. Propiedad Intelectual
            </h2>
            <p className='text-muted-foreground mb-4 leading-relaxed'>
              Todo el contenido del Sitio Web, incluyendo pero no limitado a texto, gráficos,
              logotipos, imágenes, software y código fuente, está protegido por leyes de propiedad
              intelectual y es propiedad de ZIVAH International S.A. o sus licenciantes.
            </p>
            <p className='text-muted-foreground leading-relaxed'>
              Queda prohibida la reproducción, distribución, modificación o creación de obras
              derivadas sin el consentimiento expreso y por escrito de ZIVAH International S.A.
            </p>
          </section>

          {/* Privacy Policy */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>
              6. Política de Privacidad
            </h2>
            <p className='text-muted-foreground leading-relaxed'>
              El uso de nuestros servicios está sujeto a nuestra{' '}
              <Link
                href='/legal/privacy-policy'
                className='text-accent hover:underline'
              >
                Política de Privacidad
              </Link>
              , que forma parte integral de estos términos.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>
              7. Descargos de Responsabilidad
            </h2>

            <h3 className='text-foreground mb-3 text-xl font-medium'>7.1 Información General</h3>
            <p className='text-muted-foreground mb-4'>
              La información proporcionada en este sitio web es de carácter general y no constituye
              asesoramiento profesional específico. Siempre debe consultar con expertos calificados
              para decisiones comerciales.
            </p>

            <h3 className='text-foreground mb-3 text-xl font-medium'>7.2 No Garantías</h3>
            <p className='text-muted-foreground mb-4'>
              El sitio web y los servicios se proporcionan &quot;tal cual&quot; sin garantías de
              ningún tipo, expresas o implícitas, incluyendo pero no limitado a garantías de
              comerciabilidad, idoneidad para un propósito particular, o no infracción.
            </p>

            <h3 className='text-foreground mb-3 text-xl font-medium'>
              7.3 Limitación de Responsabilidad
            </h3>
            <p className='text-muted-foreground'>
              ZIVAH International S.A. no será responsable por daños directos, indirectos,
              incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de
              usar nuestros servicios.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>8. Terminación</h2>
            <p className='text-muted-foreground leading-relaxed'>
              Podemos terminar o suspender su acceso al sitio web inmediatamente, sin previo aviso,
              por cualquier motivo, incluyendo pero no limitado a la violación de estos términos.
              Tras la terminación, cesarán todos los derechos y licencias otorgados bajo estos
              términos.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>
              9. Ley Aplicable y Jurisdicción
            </h2>
            <p className='text-muted-foreground leading-relaxed'>
              Estos términos se regirán e interpretarán de acuerdo con las leyes de la República del
              Ecuador. Cualquier disputa que surja de estos términos estará sujeta a la jurisdicción
              exclusiva de los tribunales competentes de Guayas, Ecuador.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>10. Modificaciones</h2>
            <p className='text-muted-foreground leading-relaxed'>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los
              cambios entrarán en vigor inmediatamente después de su publicación en el sitio web. El
              uso continuado del sitio web después de dichos cambios constituye su aceptación de los
              términos modificados.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>11. Contacto</h2>
            <p className='text-muted-foreground mb-4 leading-relaxed'>
              Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos:
            </p>
            <div className='rounded-lg bg-gray-50 p-6 dark:bg-gray-700'>
              <div className='grid gap-6 md:grid-cols-2'>
                <div>
                  <h4 className='text-foreground mb-2 font-semibold'>Oficina Principal</h4>
                  <p className='text-muted-foreground'>
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
                  <h4 className='text-foreground mb-2 font-semibold'>Oficina de Distribución</h4>
                  <p className='text-muted-foreground'>
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

        {/* Back to Home */}
        <div className='mt-8 text-center'>
          <Link
            href='/'
            className='text-accent hover:text-dark-accent inline-flex items-center transition-colors'
          >
            ← Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
