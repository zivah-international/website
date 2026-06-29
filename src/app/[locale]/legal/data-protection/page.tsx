import type { Metadata } from 'next';
import Link from 'next/link';

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

export default function DataProtectionPage() {
  return (
    <div className='bg-background min-h-screen py-16'>
      <div className='container mx-auto max-w-4xl px-4'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='text-foreground mb-4 text-4xl font-bold'>
            Protección de Datos Personales
          </h1>
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
              1. Responsable del Tratamiento
            </h2>
            <div className='rounded-lg bg-gray-50 p-6 dark:bg-gray-700'>
              <h3 className='text-foreground mb-2 text-lg font-semibold'>
                ZIVAH International S.A.
              </h3>
              <p className='text-muted-foreground mb-2'>
                <strong>Domicilio:</strong> Casa Matriz Mz 10 S L 31, Samborondón, Guayas, Ecuador
              </p>
              <p className='text-muted-foreground mb-2'>
                <strong>RUC:</strong> [Número de RUC]
              </p>
              <p className='text-muted-foreground mb-2'>
                <strong>Email:</strong> privacy@zivahinternational.com
              </p>
              <p className='text-muted-foreground'>
                <strong>Delegado de Protección de Datos:</strong> dpo@zivahinternational.com
              </p>
            </div>
          </section>

          {/* Legal Framework */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>2. Marco Legal</h2>
            <p className='text-muted-foreground mb-4 leading-relaxed'>
              Esta política de protección de datos se basa en las siguientes normativas:
            </p>
            <ul className='text-muted-foreground list-inside list-disc space-y-2'>
              <li>
                <strong>Reglamento (UE) 2016/679 (RGPD):</strong> Para residentes de la Unión
                Europea
              </li>
              <li>
                <strong>Ley Orgánica de Protección de Datos Personales (LOPD):</strong> Ecuador
              </li>
              <li>
                <strong>California Consumer Privacy Act (CCPA):</strong> Para residentes de
                California
              </li>
              <li>
                <strong>Normativas sectoriales:</strong> Aplicables al comercio internacional de
                alimentos
              </li>
            </ul>
          </section>

          {/* Data Processing Principles */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>
              3. Principios de Tratamiento de Datos
            </h2>
            <p className='text-muted-foreground mb-4 leading-relaxed'>
              Tratamos sus datos personales de acuerdo con los siguientes principios:
            </p>
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='bg-accent/10 rounded-lg p-4'>
                <h4 className='text-dark-accent mb-2 font-semibold'>Transparencia Total</h4>
                <p className='text-accent text-sm'>
                  Tratamos sus datos de forma legal, leal y transparente
                </p>
              </div>
              <div className='rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20'>
                <h4 className='mb-2 font-semibold text-blue-900 dark:text-blue-100'>
                  Limitación de la Finalidad
                </h4>
                <p className='text-sm text-blue-800 dark:text-blue-200'>
                  Recopilamos datos para fines específicos y legítimos
                </p>
              </div>
              <div className='rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20'>
                <h4 className='mb-2 font-semibold text-purple-900 dark:text-purple-100'>
                  Minimización de Datos
                </h4>
                <p className='text-sm text-purple-800 dark:text-purple-200'>
                  Solo recopilamos los datos necesarios para nuestros fines
                </p>
              </div>
              <div className='rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20'>
                <h4 className='mb-2 font-semibold text-orange-900 dark:text-orange-100'>
                  Exactitud
                </h4>
                <p className='text-sm text-orange-800 dark:text-orange-200'>
                  Mantenemos sus datos precisos y actualizados
                </p>
              </div>
              <div className='rounded-lg bg-red-50 p-4 dark:bg-red-900/20'>
                <h4 className='mb-2 font-semibold text-red-900 dark:text-red-100'>
                  Limitación del Plazo de Conservación
                </h4>
                <p className='text-sm text-red-800 dark:text-red-200'>
                  Conservamos sus datos solo durante el tiempo necesario
                </p>
              </div>
              <div className='rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20'>
                <h4 className='mb-2 font-semibold text-indigo-900 dark:text-indigo-100'>
                  Integridad y Confidencialidad
                </h4>
                <p className='text-sm text-indigo-800 dark:text-indigo-200'>
                  Proteger sus datos contra el acceso no autorizado
                </p>
              </div>
            </div>
          </section>

          {/* Data Categories */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>
              4. Categorías de Datos Personales
            </h2>

            <h3 className='text-foreground mb-3 text-xl font-medium'>
              4.1 Datos de Identificación
            </h3>
            <ul className='text-muted-foreground mb-4 list-inside list-disc space-y-2'>
              <li>Nombre y apellidos</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Nombre de la empresa</li>
            </ul>

            <h3 className='text-foreground mb-3 text-xl font-medium'>
              4.2 Datos de Contacto y Ubicación
            </h3>
            <ul className='text-muted-foreground mb-4 list-inside list-disc space-y-2'>
              <li>Dirección postal</li>
              <li>País y ciudad de residencia</li>
              <li>Dirección IP</li>
            </ul>

            <h3 className='text-foreground mb-3 text-xl font-medium'>4.3 Datos de Navegación</h3>
            <ul className='text-muted-foreground list-inside list-disc space-y-2'>
              <li>Páginas visitadas</li>
              <li>Tiempo de permanencia</li>
              <li>Preferencias de idioma</li>
              <li>Dispositivo y navegador utilizado</li>
            </ul>
          </section>

          {/* Legal Basis */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>
              5. Base Legal para el Tratamiento
            </h2>
            <p className='text-muted-foreground mb-4 leading-relaxed'>
              Tratamos sus datos personales basándonos en las siguientes bases legales:
            </p>
            <ul className='text-muted-foreground list-inside list-disc space-y-2'>
              <li>
                <strong>Consentimiento:</strong> Para comunicaciones comerciales y cookies no
                esenciales
              </li>
              <li>
                <strong>Ejecución de contrato:</strong> Para procesar pedidos y cotizaciones
              </li>
              <li>
                <strong>Interés legítimo:</strong> Para mejorar nuestros servicios y prevenir
                fraudes
              </li>
              <li>
                <strong>Cumplimiento de obligaciones legales:</strong> Para cumplir con regulaciones
                aplicables
              </li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>
              6. Plazos de Conservación
            </h2>
            <p className='text-muted-foreground mb-4 leading-relaxed'>
              Conservamos sus datos personales durante los siguientes períodos:
            </p>
            <ul className='text-muted-foreground list-inside list-disc space-y-2'>
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

          {/* Your Rights */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>
              7. Sus Derechos como Titular de Datos
            </h2>

            <div className='grid gap-6 md:grid-cols-2'>
              <div className='space-y-4'>
                <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
                  <h4 className='text-foreground mb-2 font-semibold'>✅ Derecho de Acceso</h4>
                  <p className='text-muted-foreground text-sm'>
                    Solicitar copia de sus datos personales que tratamos
                  </p>
                </div>

                <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
                  <h4 className='text-foreground mb-2 font-semibold'>
                    ✏️ Derecho de Rectificación
                  </h4>
                  <p className='text-muted-foreground text-sm'>
                    Corregir datos inexactos o incompletos
                  </p>
                </div>

                <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
                  <h4 className='text-foreground mb-2 font-semibold'>🗑️ Derecho de Supresión</h4>
                  <p className='text-muted-foreground text-sm'>
                    Solicitar eliminación de sus datos (&quot;Derecho al olvido&quot;)
                  </p>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
                  <h4 className='text-foreground mb-2 font-semibold'>📤 Derecho de Portabilidad</h4>
                  <p className='text-muted-foreground text-sm'>
                    Obtener sus datos en formato estructurado
                  </p>
                </div>

                <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
                  <h4 className='text-foreground mb-2 font-semibold'>🚫 Derecho de Oposición</h4>
                  <p className='text-muted-foreground text-sm'>
                    Oponerse al tratamiento de sus datos
                  </p>
                </div>

                <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
                  <h4 className='text-foreground mb-2 font-semibold'>⏸️ Derecho de Limitación</h4>
                  <p className='text-muted-foreground text-sm'>
                    Limitar el tratamiento de sus datos
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Exercise Rights */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>
              8. Cómo Ejercer sus Derechos
            </h2>
            <p className='text-muted-foreground mb-4 leading-relaxed'>
              Para ejercer cualquiera de sus derechos, puede contactarnos a través de:
            </p>

            <div className='rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20'>
              <h4 className='mb-4 font-semibold text-blue-900 dark:text-blue-100'>
                Formas de Contacto
              </h4>
              <div className='grid gap-6 md:grid-cols-2'>
                <div>
                  <h5 className='mb-2 font-medium text-blue-900 dark:text-blue-100'>Por Email</h5>
                  <p className='mb-2 text-sm text-blue-800 dark:text-blue-200'>
                    privacy@zivahinternational.com
                  </p>
                  <p className='text-sm text-blue-800 dark:text-blue-200'>
                    Responderemos en un plazo máximo de 30 días
                  </p>
                </div>
                <div>
                  <h5 className='mb-2 font-medium text-blue-900 dark:text-blue-100'>
                    Por Correo Postal
                  </h5>
                  <p className='text-sm text-blue-800 dark:text-blue-200'>
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

            <p className='text-muted-foreground mt-4 leading-relaxed'>
              Para verificar su identidad, podremos solicitarle información adicional. Todos los
              derechos se ejercen de forma gratuita, salvo que las solicitudes sean manifiestamente
              infundadas o excesivas.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>9. Medidas de Seguridad</h2>
            <p className='text-muted-foreground mb-4 leading-relaxed'>
              Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos:
            </p>
            <ul className='text-muted-foreground list-inside list-disc space-y-2'>
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

          {/* International Data Transfers */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>
              10. Transferencias Internacionales
            </h2>
            <p className='text-muted-foreground leading-relaxed'>
              Sus datos pueden transferirse a países fuera del Espacio Económico Europeo (EEE). En
              estos casos, garantizamos que las transferencias cumplan con las garantías adecuadas
              establecidas por la legislación aplicable, incluyendo cláusulas contractuales tipo o
              decisiones de adecuación de la Comisión Europea.
            </p>
          </section>

          {/* Complaints */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>11. Reclamaciones</h2>
            <p className='text-muted-foreground mb-4 leading-relaxed'>
              Si considera que el tratamiento de sus datos personales no cumple con la normativa
              aplicable, tiene derecho a presentar una reclamación ante la autoridad de control
              competente:
            </p>
            <ul className='text-muted-foreground list-inside list-disc space-y-2'>
              <li>
                <strong>En Ecuador:</strong> Agencia de Regulación y Control de las
                Telecomunicaciones (ARCOTEL)
              </li>
              <li>
                <strong>En la UE:</strong> Autoridad de Protección de Datos de su país de residencia
              </li>
              <li>
                <strong>En España:</strong> Agencia Española de Protección de Datos (AEPD)
              </li>
            </ul>
          </section>

          {/* Updates */}
          <section>
            <h2 className='text-foreground mb-4 text-2xl font-semibold'>12. Actualizaciones</h2>
            <p className='text-muted-foreground leading-relaxed'>
              Esta política puede actualizarse para reflejar cambios en nuestras prácticas o en la
              legislación aplicable. Le informaremos sobre cambios significativos mediante un aviso
              destacado en nuestro sitio web o enviando una comunicación directa.
            </p>
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
