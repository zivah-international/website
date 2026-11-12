import type { Metadata } from 'next';

import { Link } from '@/i18n/routing';

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

const SECTIONS = [
  { id: 'que-son', label: '1. ¿Qué son las Cookies?' },
  { id: 'tipos', label: '2. Tipos de Cookies que Utilizamos' },
  { id: 'terceros', label: '3. Cookies de Terceros' },
  { id: 'gestion', label: '4. Gestión de Cookies' },
  { id: 'consentimiento', label: '5. Consentimiento' },
  { id: 'retencion', label: '6. Retención de Datos' },
  { id: 'actualizaciones', label: '7. Actualizaciones de esta Política' },
  { id: 'contacto', label: '8. Contacto' },
  { id: 'configuracion', label: '9. Configuración de Cookies' },
];

const sectionClass = 'scroll-mt-28 border-t border-border pt-8 first:border-t-0 first:pt-0';
const h2Class = 'mb-4 font-serif text-2xl leading-snug text-foreground';
const h3Class = 'mt-6 mb-3 text-[17px] font-semibold text-foreground';
const listClass = 'list-inside list-disc space-y-2';

export default function CookiePolicyPage() {
  return (
    <article>
      <div>
        <h1 className='font-serif text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.1] text-foreground'>
          Política de Cookies
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
          id='que-son'
          className={sectionClass}
        >
          <h2 className={h2Class}>1. ¿Qué son las Cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando
            visita nuestro sitio web. Estas cookies nos permiten recordar sus preferencias, mejorar
            su experiencia de navegación y proporcionarle contenido personalizado. También nos
            ayudan a analizar el uso del sitio web para mejorar nuestros servicios.
          </p>
        </section>

        <section
          id='tipos'
          className={sectionClass}
        >
          <h2 className={h2Class}>2. Tipos de Cookies que Utilizamos</h2>

          <h3 className={h3Class}>2.1 Cookies Esenciales</h3>
          <p className='mb-4'>
            Estas cookies son necesarias para el funcionamiento básico del sitio web y no pueden ser
            desactivadas. Incluyen:
          </p>
          <ul className={`${listClass} mb-4`}>
            <li>Cookies de sesión para mantener su sesión activa</li>
            <li>Cookies de seguridad para proteger contra ataques</li>
            <li>Cookies de preferencias de idioma y configuración regional</li>
          </ul>

          <h3 className={h3Class}>2.2 Cookies de Rendimiento</h3>
          <p className='mb-4'>
            Estas cookies nos ayudan a entender cómo los visitantes interactúan con nuestro sitio
            web, recopilando información de forma anónima:
          </p>
          <ul className={`${listClass} mb-4`}>
            <li>Páginas visitadas y tiempo de permanencia</li>
            <li>Errores encontrados durante la navegación</li>
            <li>Rendimiento del sitio web</li>
          </ul>

          <h3 className={h3Class}>2.3 Cookies de Funcionalidad</h3>
          <p className='mb-4'>
            Estas cookies permiten al sitio web recordar las elecciones que hace (como su nombre de
            usuario, idioma o región) y proporcionar características mejoradas y más personales:
          </p>
          <ul className={`${listClass} mb-4`}>
            <li>Recordar sus preferencias de tema (claro/oscuro)</li>
            <li>Recordar elementos de formularios parcialmente completados</li>
            <li>Personalizar la experiencia del usuario</li>
          </ul>

          <h3 className={h3Class}>2.4 Cookies de Marketing</h3>
          <p className='mb-4'>
            Estas cookies se utilizan para rastrear visitantes en diferentes sitios web con el fin
            de mostrar anuncios relevantes. Pueden ser establecidas por nosotros o por nuestros
            socios publicitarios:
          </p>
          <ul className={listClass}>
            <li>Seguimiento de conversiones de campañas publicitarias</li>
            <li>Medición de la efectividad de anuncios</li>
            <li>Remarketing y publicidad dirigida</li>
          </ul>
        </section>

        <section
          id='terceros'
          className={sectionClass}
        >
          <h2 className={h2Class}>3. Cookies de Terceros</h2>
          <p className='mb-4'>
            Podemos utilizar servicios de terceros que establezcan sus propias cookies. Estos
            incluyen:
          </p>
          <ul className={listClass}>
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

        <section
          id='gestion'
          className={sectionClass}
        >
          <h2 className={h2Class}>4. Gestión de Cookies</h2>

          <h3 className={h3Class}>4.1 Control de Cookies</h3>
          <p className='mb-4'>Puede controlar y gestionar las cookies de las siguientes maneras:</p>
          <ul className={`${listClass} mb-4`}>
            <li>Configuraciones del navegador para bloquear o eliminar cookies</li>
            <li>Herramientas de privacidad disponibles en nuestro sitio web</li>
            <li>Configuración de preferencias de publicidad</li>
          </ul>

          <h3 className={h3Class}>4.2 Configuración del Navegador</h3>
          <p className='mb-4'>
            La mayoría de los navegadores web permiten controlar las cookies a través de sus
            configuraciones. Puede:
          </p>
          <ul className={listClass}>
            <li>Ver qué cookies tiene y eliminarlas individualmente</li>
            <li>Bloquear cookies de terceros</li>
            <li>Bloquear cookies de un sitio específico</li>
            <li>Bloquear todas las cookies de todos los sitios</li>
            <li>Eliminar todas las cookies cuando cierra el navegador</li>
          </ul>
        </section>

        <section
          id='consentimiento'
          className={sectionClass}
        >
          <h2 className={h2Class}>5. Consentimiento</h2>
          <p className='mb-4'>
            Al continuar utilizando nuestro sitio web, usted acepta el uso de cookies de acuerdo con
            esta política. Si no está de acuerdo con el uso de cookies, puede modificar sus
            preferencias o dejar de utilizar nuestro sitio web.
          </p>
          <p>
            Para usuarios en la Unión Europea, cumplimos con los requisitos del RGPD y obtenemos su
            consentimiento antes de instalar cookies no esenciales.
          </p>
        </section>

        <section
          id='retencion'
          className={sectionClass}
        >
          <h2 className={h2Class}>6. Retención de Datos</h2>
          <p>Las cookies tienen diferentes períodos de retención dependiendo de su propósito:</p>
          <ul className={`${listClass} mt-4`}>
            <li>
              <strong>Cookies de sesión:</strong> Se eliminan automáticamente cuando cierra el
              navegador
            </li>
            <li>
              <strong>Cookies persistentes:</strong> Pueden durar desde unos días hasta varios años
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

        <section
          id='actualizaciones'
          className={sectionClass}
        >
          <h2 className={h2Class}>7. Actualizaciones de esta Política</h2>
          <p>
            Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en
            nuestras prácticas o en la legislación aplicable. Le recomendamos revisar esta política
            regularmente para mantenerse informado sobre cómo utilizamos las cookies.
          </p>
        </section>

        <section
          id='contacto'
          className={sectionClass}
        >
          <h2 className={h2Class}>8. Contacto</h2>
          <p className='mb-4'>
            Si tiene preguntas sobre esta Política de Cookies o desea modificar sus preferencias,
            puede contactarnos:
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
                  Email: privacy@zivahinternational.com
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
                  Email: privacy@zivahinternational.com
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id='configuracion'
          className={sectionClass}
        >
          <h2 className={h2Class}>9. Configuración de Cookies</h2>
          <p className='mb-4'>
            Puede gestionar sus preferencias de cookies en cualquier momento haciendo clic en el
            botón &quot;Configuración de Cookies&quot; en la parte inferior de nuestro sitio web.
          </p>
          <div className='rounded-[2px] border border-border bg-surface p-6'>
            <h3 className='mb-2 text-[15px] font-semibold text-foreground'>
              Configuración de Cookies
            </h3>
            <p className='mb-4'>
              Utilice esta herramienta para personalizar sus preferencias de cookies:
            </p>
            <button
              type='button'
              className='inline-flex h-11 items-center rounded-[2px] bg-accent px-6 text-[11.5px] font-semibold tracking-[0.1em] text-accent-foreground uppercase transition-colors hover:bg-[var(--accent-hover)]'
            >
              Gestionar Preferencias de Cookies
            </button>
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
