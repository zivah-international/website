import type { Metadata } from 'next';

import { Link } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'Protección de Datos | ZIVAH International S.A.',
  description:
    'Información sobre protección de datos personales según RGPD y leyes aplicables - ZIVAH International S.A.',
  keywords: 'protección datos, RGPD, GDPR, derechos datos, privacidad, ZIVAH International',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://zivahinternational.com/legal/data-protection',
  },
  openGraph: {
    title: 'Protección de Datos | ZIVAH International S.A.',
    description: 'Sus derechos de protección de datos y cómo ejercitarlos.',
    url: 'https://zivahinternational.com/legal/data-protection',
    siteName: 'ZIVAH International S.A.',
    type: 'website',
  },
};

const SECTIONS = [
  { id: 'responsable', label: '1. Responsable del Tratamiento' },
  { id: 'marco-legal', label: '2. Marco Legal' },
  { id: 'principios', label: '3. Principios de Tratamiento de Datos' },
  { id: 'categorias', label: '4. Categorías de Datos Personales' },
  { id: 'base-legal', label: '5. Base Legal para el Tratamiento' },
  { id: 'conservacion', label: '6. Plazos de Conservación' },
  { id: 'derechos', label: '7. Sus Derechos como Titular de Datos' },
  { id: 'ejercer-derechos', label: '8. Cómo Ejercer sus Derechos' },
  { id: 'seguridad', label: '9. Medidas de Seguridad' },
  { id: 'transferencias', label: '10. Transferencias Internacionales' },
  { id: 'reclamaciones', label: '11. Reclamaciones' },
  { id: 'actualizaciones', label: '12. Actualizaciones' },
];

const sectionClass = 'scroll-mt-28 border-t border-border pt-8 first:border-t-0 first:pt-0';
const h2Class = 'mb-4 font-serif text-2xl leading-snug text-foreground';
const h3Class = 'mt-6 mb-3 text-[17px] font-semibold text-foreground';
const h4Class = 'mb-2 text-[15px] font-semibold text-foreground';
const listClass = 'list-inside list-disc space-y-2';
const cardClass = 'rounded-[2px] border border-border bg-surface p-4';

const PRINCIPLES = [
  {
    title: 'Transparencia Total',
    description: 'Tratamos sus datos de forma legal, leal y transparente',
  },
  {
    title: 'Limitación de la Finalidad',
    description: 'Recopilamos datos para fines específicos y legítimos',
  },
  {
    title: 'Minimización de Datos',
    description: 'Solo recopilamos los datos necesarios para nuestros fines',
  },
  {
    title: 'Exactitud',
    description: 'Mantenemos sus datos precisos y actualizados',
  },
  {
    title: 'Limitación del Plazo de Conservación',
    description: 'Conservamos sus datos solo durante el tiempo necesario',
  },
  {
    title: 'Integridad y Confidencialidad',
    description: 'Proteger sus datos contra el acceso no autorizado',
  },
];

const RIGHTS = [
  {
    title: 'Derecho de Acceso',
    description: 'Solicitar copia de sus datos personales que tratamos',
  },
  {
    title: 'Derecho de Rectificación',
    description: 'Corregir datos inexactos o incompletos',
  },
  {
    title: 'Derecho de Supresión',
    description: 'Solicitar eliminación de sus datos ("Derecho al olvido")',
  },
  {
    title: 'Derecho de Portabilidad',
    description: 'Obtener sus datos en formato estructurado',
  },
  {
    title: 'Derecho de Oposición',
    description: 'Oponerse al tratamiento de sus datos',
  },
  {
    title: 'Derecho de Limitación',
    description: 'Limitar el tratamiento de sus datos',
  },
];

export default function DataProtectionPage() {
  return (
    <article>
      <div>
        <h1 className='font-serif text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.1] text-foreground'>
          Protección de Datos Personales
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
          id='responsable'
          className={sectionClass}
        >
          <h2 className={h2Class}>1. Responsable del Tratamiento</h2>
          <div className='rounded-[2px] border border-border bg-surface p-6'>
            <h3 className='mb-2 text-[17px] font-semibold text-foreground'>
              ZIVAH International S.A.
            </h3>
            <p className='mb-2'>
              <strong>Domicilio:</strong> Casa Matriz Mz 10 S L 31, Samborondón, Guayas, Ecuador
            </p>
            <p className='mb-2'>
              <strong>RUC:</strong> [Número de RUC]
            </p>
            <p className='mb-2'>
              <strong>Email:</strong> privacy@zivahinternational.com
            </p>
            <p>
              <strong>Delegado de Protección de Datos:</strong> dpo@zivahinternational.com
            </p>
          </div>
        </section>

        <section
          id='marco-legal'
          className={sectionClass}
        >
          <h2 className={h2Class}>2. Marco Legal</h2>
          <p className='mb-4'>
            Esta política de protección de datos se basa en las siguientes normativas:
          </p>
          <ul className={listClass}>
            <li>
              <strong>Reglamento (UE) 2016/679 (RGPD):</strong> Para residentes de la Unión Europea
            </li>
            <li>
              <strong>Ley Orgánica de Protección de Datos Personales (LOPD):</strong> Ecuador
            </li>
            <li>
              <strong>California Consumer Privacy Act (CCPA):</strong> Para residentes de California
            </li>
            <li>
              <strong>Normativas sectoriales:</strong> Aplicables al comercio internacional de
              alimentos
            </li>
          </ul>
        </section>

        <section
          id='principios'
          className={sectionClass}
        >
          <h2 className={h2Class}>3. Principios de Tratamiento de Datos</h2>
          <p className='mb-4'>
            Tratamos sus datos personales de acuerdo con los siguientes principios:
          </p>
          <div className='grid gap-4 sm:grid-cols-2'>
            {PRINCIPLES.map(principle => (
              <div
                key={principle.title}
                className={cardClass}
              >
                <h3 className={h4Class}>{principle.title}</h3>
                <p className='text-[14px]'>{principle.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id='categorias'
          className={sectionClass}
        >
          <h2 className={h2Class}>4. Categorías de Datos Personales</h2>

          <h3 className={h3Class}>4.1 Datos de Identificación</h3>
          <ul className={`${listClass} mb-4`}>
            <li>Nombre y apellidos</li>
            <li>Dirección de correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Nombre de la empresa</li>
          </ul>

          <h3 className={h3Class}>4.2 Datos de Contacto y Ubicación</h3>
          <ul className={`${listClass} mb-4`}>
            <li>Dirección postal</li>
            <li>País y ciudad de residencia</li>
            <li>Dirección IP</li>
          </ul>

          <h3 className={h3Class}>4.3 Datos de Navegación</h3>
          <ul className={listClass}>
            <li>Páginas visitadas</li>
            <li>Tiempo de permanencia</li>
            <li>Preferencias de idioma</li>
            <li>Dispositivo y navegador utilizado</li>
          </ul>
        </section>

        <section
          id='base-legal'
          className={sectionClass}
        >
          <h2 className={h2Class}>5. Base Legal para el Tratamiento</h2>
          <p className='mb-4'>
            Tratamos sus datos personales basándonos en las siguientes bases legales:
          </p>
          <ul className={listClass}>
            <li>
              <strong>Consentimiento:</strong> Para comunicaciones comerciales y cookies no
              esenciales
            </li>
            <li>
              <strong>Ejecución de contrato:</strong> Para procesar pedidos y cotizaciones
            </li>
            <li>
              <strong>Interés legítimo:</strong> Para mejorar nuestros servicios y prevenir fraudes
            </li>
            <li>
              <strong>Cumplimiento de obligaciones legales:</strong> Para cumplir con regulaciones
              aplicables
            </li>
          </ul>
        </section>

        <section
          id='conservacion'
          className={sectionClass}
        >
          <h2 className={h2Class}>6. Plazos de Conservación</h2>
          <p className='mb-4'>Conservamos sus datos personales durante los siguientes períodos:</p>
          <ul className={listClass}>
            <li>
              <strong>Datos de clientes activos:</strong> Durante la relación comercial y 5 años
              después
            </li>
            <li>
              <strong>Datos de cotizaciones:</strong> 3 años desde la última actividad
            </li>
            <li>
              <strong>Datos de marketing:</strong> Hasta que retire su consentimiento
            </li>
            <li>
              <strong>Datos de navegación:</strong> 2 años para análisis estadísticos
            </li>
          </ul>
        </section>

        <section
          id='derechos'
          className={sectionClass}
        >
          <h2 className={h2Class}>7. Sus Derechos como Titular de Datos</h2>
          <div className='grid gap-4 sm:grid-cols-2'>
            {RIGHTS.map(right => (
              <div
                key={right.title}
                className={cardClass}
              >
                <h3 className={h4Class}>{right.title}</h3>
                <p className='text-[14px]'>{right.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id='ejercer-derechos'
          className={sectionClass}
        >
          <h2 className={h2Class}>8. Cómo Ejercer sus Derechos</h2>
          <p className='mb-4'>
            Para ejercer cualquiera de sus derechos, puede contactarnos a través de:
          </p>

          <div className='rounded-[2px] border border-border bg-surface p-6'>
            <h3 className='mb-4 text-[17px] font-semibold text-foreground'>Formas de Contacto</h3>
            <div className='grid gap-6 sm:grid-cols-2'>
              <div>
                <h4 className={h4Class}>Por Email</h4>
                <p className='mb-2 text-[14px]'>privacy@zivahinternational.com</p>
                <p className='text-[14px]'>Responderemos en un plazo máximo de 30 días</p>
              </div>
              <div>
                <h4 className={h4Class}>Por Correo Postal</h4>
                <p className='text-[14px]'>
                  ZIVAH International S.A.
                  <br />
                  Casa Matriz Mz 10 S L 31
                  <br />
                  Samborondón, Guayas, Ecuador
                  <br />
                  Teléfono: +593999002893
                </p>
              </div>
            </div>
          </div>

          <p className='mt-4'>
            Para verificar su identidad, podremos solicitarle información adicional. Todos los
            derechos se ejercen de forma gratuita, salvo que las solicitudes sean manifiestamente
            infundadas o excesivas.
          </p>
        </section>

        <section
          id='seguridad'
          className={sectionClass}
        >
          <h2 className={h2Class}>9. Medidas de Seguridad</h2>
          <p className='mb-4'>
            Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos:
          </p>
          <ul className={listClass}>
            <li>
              <strong>Encriptación:</strong> Datos en tránsito y en reposo
            </li>
            <li>
              <strong>Control de acceso:</strong> Principio de mínimo privilegio
            </li>
            <li>
              <strong>Monitoreo continuo:</strong> Detección de amenazas y vulnerabilidades
            </li>
            <li>
              <strong>Copias de seguridad:</strong> Regulares y seguras
            </li>
            <li>
              <strong>Capacitación:</strong> Personal formado en protección de datos
            </li>
          </ul>
        </section>

        <section
          id='transferencias'
          className={sectionClass}
        >
          <h2 className={h2Class}>10. Transferencias Internacionales</h2>
          <p>
            Sus datos pueden transferirse a países fuera del Espacio Económico Europeo (EEE). En
            estos casos, garantizamos que las transferencias cumplan con las garantías adecuadas
            establecidas por la legislación aplicable, incluyendo cláusulas contractuales tipo o
            decisiones de adecuación de la Comisión Europea.
          </p>
        </section>

        <section
          id='reclamaciones'
          className={sectionClass}
        >
          <h2 className={h2Class}>11. Reclamaciones</h2>
          <p className='mb-4'>
            Si considera que el tratamiento de sus datos personales no cumple con la normativa
            aplicable, tiene derecho a presentar una reclamación ante la autoridad de control
            competente:
          </p>
          <ul className={listClass}>
            <li>
              <strong>En Ecuador:</strong> Agencia de Regulación y Control de las Telecomunicaciones
              (ARCOTEL)
            </li>
            <li>
              <strong>En la UE:</strong> Autoridad de Protección de Datos de su país de residencia
            </li>
            <li>
              <strong>En España:</strong> Agencia Española de Protección de Datos (AEPD)
            </li>
          </ul>
        </section>

        <section
          id='actualizaciones'
          className={sectionClass}
        >
          <h2 className={h2Class}>12. Actualizaciones</h2>
          <p>
            Esta política puede actualizarse para reflejar cambios en nuestras prácticas o en la
            legislación aplicable. Le informaremos sobre cambios significativos mediante un aviso
            destacado en nuestro sitio web o enviando una comunicación directa.
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
