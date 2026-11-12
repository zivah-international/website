import type { Metadata } from 'next';

import { Link } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'Política de Privacidad | ZIVAH International S.A.',
  description:
    'Política de privacidad de ZIVAH International S.A. - Cómo recopilamos, usamos y protegemos su información personal.',
  keywords:
    'política privacidad, protección datos, GDPR, RGPD, datos personales, ZIVAH International',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://zivahinternational.com/legal/privacy-policy',
  },
  openGraph: {
    title: 'Política de Privacidad | ZIVAH International S.A.',
    description:
      'Cómo protegemos su información personal y cumplimos con las normativas de privacidad.',
    url: 'https://zivahinternational.com/legal/privacy-policy',
    siteName: 'ZIVAH International S.A.',
    type: 'website',
  },
};

const SECTIONS = [
  { id: 'introduccion', label: '1. Introducción' },
  { id: 'informacion-recopilamos', label: '2. Información que Recopilamos' },
  { id: 'uso-informacion', label: '3. Cómo Utilizamos su Información' },
  { id: 'compartir-informacion', label: '4. Compartir su Información' },
  { id: 'seguridad-datos', label: '5. Seguridad de los Datos' },
  { id: 'cookies', label: '6. Cookies y Tecnologías Similares' },
  { id: 'derechos', label: '7. Sus Derechos' },
  { id: 'contacto', label: '8. Contacto' },
  { id: 'actualizaciones', label: '9. Actualizaciones de esta Política' },
];

const sectionClass = 'scroll-mt-28 border-t border-border pt-8 first:border-t-0 first:pt-0';
const h2Class = 'mb-4 font-serif text-2xl leading-snug text-foreground';
const h3Class = 'mt-6 mb-3 text-[17px] font-semibold text-foreground';
const listClass = 'list-inside list-disc space-y-2';

export default function PrivacyPolicyPage() {
  return (
    <article>
      <div>
        <h1 className='font-serif text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.1] text-foreground'>
          Política de Privacidad
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
          id='introduccion'
          className={sectionClass}
        >
          <h2 className={h2Class}>1. Introducción</h2>
          <p>
            ZIVAH International S.A. (&quot;nosotros&quot;, &quot;nuestro&quot; o &quot;ZIVAH&quot;)
            se compromete a proteger su privacidad y sus datos personales. Esta Política de
            Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información
            cuando utiliza nuestro sitio web y nuestros servicios.
          </p>
        </section>

        <section
          id='informacion-recopilamos'
          className={sectionClass}
        >
          <h2 className={h2Class}>2. Información que Recopilamos</h2>

          <h3 className={h3Class}>2.1 Información que Usted Nos Proporciona</h3>
          <ul className={`${listClass} mb-4`}>
            <li>Nombre y apellidos</li>
            <li>Dirección de correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Nombre de la empresa</li>
            <li>Dirección de envío y facturación</li>
            <li>Información de productos de interés</li>
            <li>Cualquier otra información que nos proporcione voluntariamente</li>
          </ul>

          <h3 className={h3Class}>2.2 Información Recopilada Automáticamente</h3>
          <ul className={listClass}>
            <li>Dirección IP y ubicación geográfica</li>
            <li>Tipo de navegador y versión</li>
            <li>Sistema operativo</li>
            <li>Páginas visitadas y tiempo de permanencia</li>
            <li>Referencias de origen</li>
            <li>Cookies y tecnologías similares</li>
          </ul>
        </section>

        <section
          id='uso-informacion'
          className={sectionClass}
        >
          <h2 className={h2Class}>3. Cómo Utilizamos su Información</h2>
          <p className='mb-4'>
            Utilizamos la información recopilada para los siguientes propósitos:
          </p>
          <ul className={listClass}>
            <li>Procesar y gestionar sus solicitudes de cotización</li>
            <li>Proporcionar información sobre nuestros productos y servicios</li>
            <li>Mejorar nuestro sitio web y servicios</li>
            <li>Cumplir con obligaciones legales y regulatorias</li>
            <li>Enviar comunicaciones comerciales (con su consentimiento)</li>
            <li>Prevenir fraudes y mantener la seguridad</li>
          </ul>
        </section>

        <section
          id='compartir-informacion'
          className={sectionClass}
        >
          <h2 className={h2Class}>4. Compartir su Información</h2>
          <p className='mb-4'>
            No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en
            las siguientes situaciones:
          </p>
          <ul className={listClass}>
            <li>Con su consentimiento expreso</li>
            <li>
              Con proveedores de servicios que nos ayudan a operar (bajo acuerdos de
              confidencialidad)
            </li>
            <li>Cuando sea requerido por ley o para proteger nuestros derechos</li>
            <li>En caso de fusión, adquisición o venta de activos</li>
          </ul>
        </section>

        <section
          id='seguridad-datos'
          className={sectionClass}
        >
          <h2 className={h2Class}>5. Seguridad de los Datos</h2>
          <p>
            Implementamos medidas de seguridad técnicas, administrativas y físicas apropiadas para
            proteger su información personal contra acceso no autorizado, alteración, divulgación o
            destrucción. Estas medidas incluyen:
          </p>
          <ul className={`${listClass} mt-4`}>
            <li>Encriptación SSL/TLS para transmisiones de datos</li>
            <li>Almacenamiento seguro de datos con acceso restringido</li>
            <li>Monitoreo continuo de sistemas y redes</li>
            <li>Actualizaciones regulares de seguridad</li>
            <li>Capacitación del personal en seguridad de datos</li>
          </ul>
        </section>

        <section
          id='cookies'
          className={sectionClass}
        >
          <h2 className={h2Class}>6. Cookies y Tecnologías Similares</h2>
          <p>
            Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio
            web. Para más información sobre cómo utilizamos las cookies, consulte nuestra{' '}
            <Link
              href='/legal/cookie-policy'
              className='text-accent underline underline-offset-4'
            >
              Política de Cookies
            </Link>
            .
          </p>
        </section>

        <section
          id='derechos'
          className={sectionClass}
        >
          <h2 className={h2Class}>7. Sus Derechos</h2>
          <p className='mb-4'>
            De acuerdo con las leyes aplicables de protección de datos, usted tiene los siguientes
            derechos:
          </p>
          <ul className={listClass}>
            <li>
              <strong>Derecho de acceso:</strong> Solicitar una copia de sus datos personales
            </li>
            <li>
              <strong>Derecho de rectificación:</strong> Corregir información inexacta
            </li>
            <li>
              <strong>Derecho de supresión:</strong> Solicitar la eliminación de sus datos
            </li>
            <li>
              <strong>Derecho a la portabilidad:</strong> Obtener sus datos en formato estructurado
            </li>
            <li>
              <strong>Derecho de oposición:</strong> Oponerse al procesamiento de sus datos
            </li>
            <li>
              <strong>Derecho a la limitación:</strong> Limitar el procesamiento de sus datos
            </li>
          </ul>
        </section>

        <section
          id='contacto'
          className={sectionClass}
        >
          <h2 className={h2Class}>8. Contacto</h2>
          <p className='mb-4'>
            Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, puede
            contactarnos a través de:
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
          id='actualizaciones'
          className={sectionClass}
        >
          <h2 className={h2Class}>9. Actualizaciones de esta Política</h2>
          <p>
            Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre
            cambios significativos mediante un aviso destacado en nuestro sitio web o enviando un
            correo electrónico. El uso continuado de nuestros servicios después de dichos cambios
            constituye su aceptación de la política actualizada.
          </p>
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
