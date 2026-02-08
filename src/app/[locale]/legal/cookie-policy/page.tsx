import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Cookies | ZIVAH International S.A.',
  description:
    'Política de cookies de ZIVAH International S.A. - Cómo utilizamos las cookies y tecnologías similares en nuestro sitio web.',
  keywords: 'política cookies, cookies sitio web, privacidad cookies, ZIVAH International',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://zivahinternational.com/legal/cookie-policy',
  },
  openGraph: {
    title: 'Política de Cookies | ZIVAH International S.A.',
    description: 'Cómo utilizamos las cookies para mejorar su experiencia en nuestro sitio web.',
    url: 'https://zivahinternational.com/legal/cookie-policy',
    siteName: 'ZIVAH International S.A.',
    type: 'website',
  },
};

export default function CookiePolicyPage() {
  return (
    <div className='min-h-screen bg-gray-50 py-16 dark:bg-gray-900'>
      <div className='container mx-auto max-w-4xl px-4'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900 dark:text-white'>
            Política de Cookies
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            Última actualización:{' '}
            {new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Content */}
        <div className='space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800'>
          {/* Introduction */}
          <section>
            <h2 className='mb-4 text-2xl font-semibold text-gray-900 dark:text-white'>
              1. ¿Qué son las Cookies?
            </h2>
            <p className='leading-relaxed text-gray-700 dark:text-gray-300'>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando
              visita nuestro sitio web. Estas cookies nos permiten recordar sus preferencias,
              mejorar su experiencia de navegación y proporcionarle contenido personalizado. También
              nos ayudan a analizar el uso del sitio web para mejorar nuestros servicios.
            </p>
          </section>

          {/* Types of Cookies */}
          <section>
            <h2 className='mb-4 text-2xl font-semibold text-gray-900 dark:text-white'>
              2. Tipos de Cookies que Utilizamos
            </h2>

            <h3 className='mb-3 text-xl font-medium text-gray-900 dark:text-white'>
              2.1 Cookies Esenciales
            </h3>
            <p className='mb-4 text-gray-700 dark:text-gray-300'>
              Estas cookies son necesarias para el funcionamiento básico del sitio web y no pueden
              ser desactivadas. Incluyen:
            </p>
            <ul className='mb-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300'>
              <li>Cookies de sesión para mantener su sesión activa</li>
              <li>Cookies de seguridad para proteger contra ataques</li>
              <li>Cookies de preferencias de idioma y configuración regional</li>
            </ul>

            <h3 className='mb-3 text-xl font-medium text-gray-900 dark:text-white'>
              2.2 Cookies de Rendimiento
            </h3>
            <p className='mb-4 text-gray-700 dark:text-gray-300'>
              Estas cookies nos ayudan a entender cómo los visitantes interactúan con nuestro sitio
              web, recopilando información de forma anónima:
            </p>
            <ul className='mb-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300'>
              <li>Páginas visitadas y tiempo de permanencia</li>
              <li>Errores encontrados durante la navegación</li>
              <li>Rendimiento del sitio web</li>
            </ul>

            <h3 className='mb-3 text-xl font-medium text-gray-900 dark:text-white'>
              2.3 Cookies de Funcionalidad
            </h3>
            <p className='mb-4 text-gray-700 dark:text-gray-300'>
              Estas cookies permiten al sitio web recordar las elecciones que hace (como su nombre
              de usuario, idioma o región) y proporcionar características mejoradas y más
              personales:
            </p>
            <ul className='mb-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300'>
              <li>Recordar sus preferencias de tema (claro/oscuro)</li>
              <li>Recordar elementos de formularios parcialmente completados</li>
              <li>Personalizar la experiencia del usuario</li>
            </ul>

            <h3 className='mb-3 text-xl font-medium text-gray-900 dark:text-white'>
              2.4 Cookies de Marketing
            </h3>
            <p className='mb-4 text-gray-700 dark:text-gray-300'>
              Estas cookies se utilizan para rastrear visitantes en diferentes sitios web con el fin
              de mostrar anuncios relevantes. Pueden ser establecidas por nosotros o por nuestros
              socios publicitarios:
            </p>
            <ul className='list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300'>
              <li>Seguimiento de conversiones de campañas publicitarias</li>
              <li>Medición de la efectividad de anuncios</li>
              <li>Remarketing y publicidad dirigida</li>
            </ul>
          </section>

          {/* Third Party Cookies */}
          <section>
            <h2 className='mb-4 text-2xl font-semibold text-gray-900 dark:text-white'>
              3. Cookies de Terceros
            </h2>
            <p className='mb-4 leading-relaxed text-gray-700 dark:text-gray-300'>
              Podemos utilizar servicios de terceros que establezcan sus propias cookies. Estos
              incluyen:
            </p>
            <ul className='list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300'>
              <li>
                <strong>Google Analytics:</strong> Para análisis de tráfico web
              </li>
              <li>
                <strong>Google Tag Manager:</strong> Para gestión de etiquetas y scripts
              </li>
              <li>
                <strong>Servicios de redes sociales:</strong> Para compartir contenido
              </li>
              <li>
                <strong>Servicios de chat en vivo:</strong> Para soporte al cliente
              </li>
            </ul>
          </section>

          {/* Cookie Management */}
          <section>
            <h2 className='mb-4 text-2xl font-semibold text-gray-900 dark:text-white'>
              4. Gestión de Cookies
            </h2>

            <h3 className='mb-3 text-xl font-medium text-gray-900 dark:text-white'>
              4.1 Control de Cookies
            </h3>
            <p className='mb-4 text-gray-700 dark:text-gray-300'>
              Puede controlar y gestionar las cookies de las siguientes maneras:
            </p>
            <ul className='mb-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300'>
              <li>Configuraciones del navegador para bloquear o eliminar cookies</li>
              <li>Herramientas de privacidad disponibles en nuestro sitio web</li>
              <li>Configuración de preferencias de publicidad</li>
            </ul>

            <h3 className='mb-3 text-xl font-medium text-gray-900 dark:text-white'>
              4.2 Configuración del Navegador
            </h3>
            <p className='mb-4 text-gray-700 dark:text-gray-300'>
              La mayoría de los navegadores web permiten controlar las cookies a través de sus
              configuraciones. Puede:
            </p>
            <ul className='list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300'>
              <li>Ver qué cookies tiene y eliminarlas individualmente</li>
              <li>Bloquear cookies de terceros</li>
              <li>Bloquear cookies de un sitio específico</li>
              <li>Bloquear todas las cookies de todos los sitios</li>
              <li>Eliminar todas las cookies cuando cierra el navegador</li>
            </ul>
          </section>

          {/* Consent */}
          <section>
            <h2 className='mb-4 text-2xl font-semibold text-gray-900 dark:text-white'>
              5. Consentimiento
            </h2>
            <p className='mb-4 leading-relaxed text-gray-700 dark:text-gray-300'>
              Al continuar utilizando nuestro sitio web, usted acepta el uso de cookies de acuerdo
              con esta política. Si no está de acuerdo con el uso de cookies, puede modificar sus
              preferencias o dejar de utilizar nuestro sitio web.
            </p>
            <p className='leading-relaxed text-gray-700 dark:text-gray-300'>
              Para usuarios en la Unión Europea, cumplimos con los requisitos del RGPD y obtenemos
              su consentimiento antes de instalar cookies no esenciales.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className='mb-4 text-2xl font-semibold text-gray-900 dark:text-white'>
              6. Retención de Datos
            </h2>
            <p className='leading-relaxed text-gray-700 dark:text-gray-300'>
              Las cookies tienen diferentes períodos de retención dependiendo de su propósito:
            </p>
            <ul className='mt-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300'>
              <li>
                <strong>Cookies de sesión:</strong> Se eliminan automáticamente cuando cierra el
                navegador
              </li>
              <li>
                <strong>Cookies persistentes:</strong> Pueden durar desde unos días hasta varios
                años
              </li>
              <li>
                <strong>Cookies de rendimiento:</strong> Generalmente se eliminan después de 2 años
              </li>
              <li>
                <strong>Cookies de marketing:</strong> Pueden durar hasta 2 años o hasta que las
                elimine
              </li>
            </ul>
          </section>

          {/* Updates */}
          <section>
            <h2 className='mb-4 text-2xl font-semibold text-gray-900 dark:text-white'>
              7. Actualizaciones de esta Política
            </h2>
            <p className='leading-relaxed text-gray-700 dark:text-gray-300'>
              Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en
              nuestras prácticas o en la legislación aplicable. Le recomendamos revisar esta
              política regularmente para mantenerse informado sobre cómo utilizamos las cookies.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className='mb-4 text-2xl font-semibold text-gray-900 dark:text-white'>
              8. Contacto
            </h2>
            <p className='mb-4 leading-relaxed text-gray-700 dark:text-gray-300'>
              Si tiene preguntas sobre esta Política de Cookies o desea modificar sus preferencias,
              puede contactarnos:
            </p>
            <div className='rounded-lg bg-gray-50 p-6 dark:bg-gray-700'>
              <div className='grid gap-6 md:grid-cols-2'>
                <div>
                  <h4 className='mb-2 font-semibold text-gray-900 dark:text-white'>
                    Oficina Principal
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300'>
                    ZIVAH International S.A.
                    <br />
                    Casa Matriz Mz 10 S L 31
                    <br />
                    Samborondón, Guayas, Ecuador
                    <br />
                    Teléfono: +593999002893
                    <br />
                    Email: privacy@zivahinternational.com
                  </p>
                </div>
                <div>
                  <h4 className='mb-2 font-semibold text-gray-900 dark:text-white'>
                    Oficina de Distribución
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300'>
                    ZIVAH International
                    <br />
                    Miami, Florida, Estados Unidos
                    <br />
                    Email: privacy@zivahinternational.com
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookie Settings */}
          <section>
            <h2 className='mb-4 text-2xl font-semibold text-gray-900 dark:text-white'>
              9. Configuración de Cookies
            </h2>
            <p className='mb-4 leading-relaxed text-gray-700 dark:text-gray-300'>
              Puede gestionar sus preferencias de cookies en cualquier momento haciendo clic en el
              botón &quot;Configuración de Cookies&quot; en la parte inferior de nuestro sitio web.
            </p>
            <div className='bg-secondary/10 border-secondary/20 rounded-lg border p-6'>
              <h4 className='text-dark-accent mb-2 font-semibold'>Configuración de Cookies</h4>
              <p className='mb-4 text-blue-800 dark:text-blue-200'>
                Utilice esta herramienta para personalizar sus preferencias de cookies:
              </p>
              <button className='rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700'>
                Gestionar Preferencias de Cookies
              </button>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className='mt-8 text-center'>
          <Link
            href='/'
            className='text-accent dark:text-accent hover:text-accent/90 dark:hover:text-accent/90 inline-flex items-center transition-colors'
          >
            ← Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
