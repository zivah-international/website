# Feature Specification: Cotización B2B fiable y correo de solicitud

**Feature Branch**: `[feat/public-site-redesign-integration]`

**Created**: 2026-11-16

**Status**: Original scope and US4 amendment approved; implementation completed and validated 2026-11-17

**Input**: User description: “revisemos el correo de cotizaciones y mejoremoslo based in latest approachs and redesigns and check form quote calculos and improve if will be necesary with equadorian units and pricing”; follow-up request to include the subscription welcome email in the same branch when recommended.

## Clarifications

### Session 2026-11-16

- Q: ¿Cómo mostramos precios en la cotización? → A: Precios activos del catálogo como estimados; total sujeto a confirmación.
- Q: ¿Cómo manejar cantidades fraccionarias y conversiones de unidad? → A: Permitir fracciones hasta tres decimales para magnitudes continuas (masa, volumen, longitud y área), conservar enteros para conteos, empaques y contenedores, y aplicar conversiones compatibles del catálogo.
- Aprobación de alcance 2026-11-17: Incluir y rediseñar por completo el correo bilingüe de bienvenida a suscripciones en la misma rama, conservando su asunto, contenido y comportamiento de entrega.

## User Scenarios & Testing

### User Story 1 - Preparar una solicitud con importes claros (Priority: P1)

Un comprador B2B busca productos, indica cantidades y elige una unidad compatible con cada producto. Cuando existe un precio activo del catálogo, puede revisar un estimado en USD por unidad y por línea antes de enviar. Si un producto no tiene un precio vigente, puede solicitarlo sin que el formulario invente un precio cero ni bloquee la solicitud.

**Why this priority**: La solicitud y sus cálculos son la fuente de los datos que verá el cliente y recibirá el equipo comercial.

**Independent Test**: Con datos de catálogo controlados, completar el formulario con unidades compatibles y no compatibles, con y sin precio; verificar importes, unidades y posibilidad de enviar cada solicitud permitida. Simular una respuesta de carga limitada y comprobar que el formulario ofrece recuperación sin mantener una espera infinita.

**Acceptance Scenarios**:

1. **Given** un precio activo de USD P por kilogramo y una tonelada equivalente a 1 000 kg, **When** el comprador solicita 1,5 t, **Then** ve un precio unitario de USD 1 000P/t y un subtotal equivalente a USD 1 500P, redondeado a centavos, con las unidades `t` y `USD`.
2. **Given** que un producto no tiene precio activo, **When** el comprador lo agrega con una unidad compatible, **Then** puede continuar la solicitud y ve “Por cotizar” en vez de un precio cero; no se muestra un total estimado incompleto.
3. **Given** un producto con unidades incompatibles, **When** el comprador revisa las unidades disponibles, **Then** esas unidades no se pueden seleccionar ni usar para calcular un importe.
4. **Given** una solicitud con varias líneas, **When** cambia una cantidad, unidad o producto, **Then** solo se actualizan las líneas afectadas y el total refleja exactamente las líneas con precio disponible.
5. **Given** que la carga de países o unidades falla o alcanza el límite de solicitudes, **When** termina el intento, **Then** desaparece el indicador de carga, el comprador ve un mensaje recuperable y las solicitudes no se repiten indefinidamente.
6. **Given** que el comprador no selecciona un país de destino, **When** intenta enviar la solicitud, **Then** el formulario muestra un error para ese campo y no envía la solicitud.
7. **Given** una unidad base de masa, volumen, longitud o área, **When** el comprador ingresa una cantidad positiva de hasta tres decimales, **Then** el formulario conserva esa precisión en el cálculo y la solicitud; unidades discretas de conteo, empaque o contenedor solo aceptan enteros.

### User Story 2 - Recibir una confirmación de solicitud coherente (Priority: P2)

Después de enviar la solicitud, el comprador recibe un correo en español o inglés que confirma la recepción y resume el número de solicitud, destino, datos de contacto y líneas de producto, incluidas las cantidades, unidades, notas y especificaciones indicadas. Los importes activos del catálogo se identifican como estimados; el total aparece solo cuando todos los productos tienen precio disponible. El mensaje explica que la propuesta comercial final se confirma después de revisar empaque, volumen, disponibilidad y destino.

**Why this priority**: El correo es la confirmación visible de la solicitud y debe representar los mismos datos que el formulario sin parecer una oferta firme.

**Independent Test**: Generar una solicitud con datos de prueba en ambos idiomas, inspeccionar el HTML y texto renderizados, comparar unidades e importes con el formulario, e incluir una solicitud con al menos una línea sin precio.

**Acceptance Scenarios**:

1. **Given** una solicitud con precio disponible para cada producto, **When** se envía, **Then** el correo muestra precio unitario, cantidad, unidad, notas y especificaciones, subtotal de cada línea y total estimado en USD.
2. **Given** una solicitud con una línea sin precio, **When** se envía, **Then** esa línea indica que el precio se confirmará y el correo no presenta un total parcial como total de la solicitud.
3. **Given** una solicitud enviada en inglés o español, **When** se genera el correo, **Then** asunto, encabezados, unidades explicativas y notas comerciales están en el idioma solicitado.
4. **Given** que el correo de confirmación no se puede entregar, **When** el formulario muestra el resultado, **Then** confirma que la solicitud quedó registrada y no afirma que el correo fue enviado.

### User Story 3 - Mantener una cotización íntegra para el equipo comercial (Priority: P3)

El equipo comercial recibe una copia del correo y encuentra en el registro la misma cantidad, unidad y cálculo que se presentó al comprador. El precio enviado por el navegador no puede reemplazar el precio activo del catálogo que el servidor confirma al guardar la solicitud.

**Why this priority**: La copia interna y el registro deben conservar datos confiables para que el equipo pueda preparar la propuesta final.

**Independent Test**: Enviar una solicitud de prueba con un precio manipulado en el navegador y verificar que el registro, el correo y la copia comercial usan el precio calculado desde el catálogo; verificar también un precio inactivo y una conversión no permitida.

**Acceptance Scenarios**:

1. **Given** un comprador altera el precio unitario enviado por el navegador, **When** el servidor registra la solicitud, **Then** guarda y comunica el importe basado en el precio activo del catálogo.
2. **Given** que el precio deja de estar activo antes del envío, **When** el servidor procesa la solicitud, **Then** no lo trata como precio vigente y conserva la línea como pendiente de cotizar.
3. **Given** una unidad sin conversión activa y compatible, **When** la solicitud llega al servidor, **Then** el servidor rechaza esa unidad con un error comprensible y no persiste un importe calculado con ella.

### User Story 4 - Recibir un correo de bienvenida alineado con la marca (Priority: P4)

Una persona que confirma su suscripción recibe un correo de bienvenida en español o inglés con la misma dirección institucional/editorial que el sitio y el correo de cotización. El mensaje conserva su asunto, contenido y entrega actuales; el nombre personalizado se presenta como texto seguro.

**Why this priority**: La continuidad visual entre correos de la misma empresa refuerza el reconocimiento de marca y evita que el correo de suscripción parezca provenir de otro producto.

**Independent Test**: Capturar el correo generado en ambos idiomas con transporte SMTP simulado, comprobar asunto, textos y nombre, revisar sus estilos en anchos de 320 y 600 px, y verificar que no contiene gradientes, sombras ni acentos laterales gruesos.

**Acceptance Scenarios**:

1. **Given** una suscripción confirmada en español o inglés, **When** se genera el correo, **Then** mantiene el asunto, la confirmación y los beneficios de ese idioma, y usa fondo cálido, superficie blanca, navy institucional, acento terracota discreto, titulares serif y texto sans-serif con alternativas seguras para correo.
2. **Given** que el nombre del suscriptor contiene caracteres HTML o está vacío, **When** el correo se genera, **Then** el nombre aparece como texto literal, con un saludo bien separado, y ningún HTML del nombre se interpreta como marcado.
3. **Given** una ventana de correo de 320 o 600 píxeles de ancho, **When** se muestra el correo, **Then** el contenido principal permanece legible sin desplazamiento horizontal, gradientes, sombras ni bordes laterales gruesos en bloques de contenido.

### Edge Cases

- El precio no existe, está inactivo o cambia entre la carga del producto y el envío.
- La unidad seleccionada pertenece a otra familia de medidas o no tiene una conversión activa.
- Un producto tiene precio directo para una unidad y un factor de conversión para otra; prevalece el precio directo activo.
- Una o varias líneas no tienen precio; se permite la solicitud y no se calcula un total que las omita silenciosamente.
- La carga de países, unidades o productos falla o recibe una respuesta de límite; el formulario informa el problema y no queda atrapado en carga ni reintenta sin control.
- El país de destino está marcado como obligatorio; su ausencia se valida tanto en el formulario como al recibir la solicitud.
- Una cantidad de una magnitud continua supera tres posiciones decimales, o una cantidad de conteo/empaque/contenedor incluye fracciones; el formulario informa el límite y no envía una cantidad alterada o redondeada silenciosamente.
- Una cantidad de línea supera 10 000 unidades; el formulario la rechaza antes del envío y comunica el límite.
- Una unidad convertida no tiene un factor activo, positivo y explícito; no se calcula ni presenta un precio convertido.
- Un precio unitario convertido contiene fracciones de centavo y la cantidad es alta; el subtotal usa el precio convertido sin redondeo prematuro y redondea la línea a centavos una sola vez.
- Un precio calculado termina en fracciones de centavo; los importes se redondean a dos decimales de USD de forma consistente entre línea, total, registro y correo.
- El servicio de correo falla después de guardar la solicitud; el resultado del formulario no afirma que el mensaje se entregó.
- Los datos dinámicos contienen caracteres HTML; el correo los muestra como texto y no como marcado ejecutable.
- El nombre del suscriptor está ausente o contiene caracteres HTML; el correo de bienvenida conserva un saludo comprensible y lo representa como texto literal.
- El correo de bienvenida se muestra en pantalla estrecha; su estructura no debe requerir desplazamiento horizontal.

## Requirements

### Functional Requirements

- **FR-001**: El formulario MUST mantener el flujo y el lenguaje visual aprobados para la página pública de cotización: superficie clara, titulares serif, texto legible, bordes discretos y una acción principal.
- **FR-002**: El formulario MUST ofrecer para cada producto solo su unidad base y las unidades que el catálogo declare convertibles con un factor activo y positivo. Compartir la misma familia de medidas, por sí solo, MUST NOT hacer que dos unidades sean convertibles. Si un producto no tiene unidad base, MUST ofrecer únicamente unidades con un precio directo activo para ese producto.
- **FR-003**: Para medidas de masa, el formulario MUST priorizar kilogramo (`kg`) y tonelada métrica, mostrar el símbolo SI correcto (`kg` o `t`) separado del valor por un espacio, y MUST NOT presentar `MT` como símbolo de tonelada. MUST conservar otras unidades solo cuando el catálogo las declare compatibles con el producto.
- **FR-004**: Los precios activos del catálogo MUST tratarse como estimados en dólares estadounidenses (USD); el país de destino MUST NOT convertir automáticamente la moneda.
- **FR-005**: El sistema MUST usar precios activos cuya fecha efectiva ya haya llegado al momento del envío. Un precio directo vigente para la unidad elegida MUST prevalecer; de lo contrario, el sistema MAY derivarlo solo del precio vigente de la unidad base mediante una conversión explícita, activa y positiva. MUST NOT elegir arbitrariamente otro precio disponible ni derivar entre unidades solo porque comparten familia. El factor normalizado MUST representar cuántas unidades de destino equivalen a una unidad de origen; el precio por unidad de destino MUST calcularse dividiendo el precio de origen por ese factor. Si el catálogo guarda la relación en sentido inverso, el sistema MUST invertir el factor antes de calcular.
- **FR-006**: Al recibir una solicitud, el sistema MUST volver a validar producto, unidad, compatibilidad, precio activo y cálculo. MUST NOT confiar en ningún precio unitario o total enviado junto con la solicitud.
- **FR-007**: Un producto sin precio activo MUST poder solicitarse con una unidad compatible; el comprador verá que el precio está pendiente de cotizar, nunca un valor cero inventado.
- **FR-008**: El total estimado MUST aparecer solo cuando todas las líneas tengan precio activo disponible. El subtotal de cada línea MUST calcularse usando el precio convertido con su precisión completa y la cantidad aceptada, y MUST redondearse a dos decimales de USD una sola vez al cerrar la línea; el total MUST sumar esos subtotales con aritmética decimal segura y redondearse a centavos.
- **FR-009**: El registro de una solicitud MUST conservar cantidad, unidad, precio unitario convertido con hasta seis posiciones decimales, y total de línea calculado con precisión completa y confirmado por el servidor. Si una línea no tiene precio activo, el registro MUST indicar que el importe está pendiente, nunca sustituirlo por cero. El total estimado de la solicitud MUST quedar pendiente si al menos una línea no tiene precio.
- **FR-010**: El asunto, título y contenido inicial del correo MUST identificarlo como acuse de recepción de una solicitud de cotización, no como cotización emitida ni oferta comercial formal. MUST distinguir un estimado del catálogo y MUST NOT afirmar una vigencia de precio no acordada.
- **FR-011**: El correo MUST incluir productos, cantidades, unidades, notas y especificaciones ingresadas, precios unitarios estimados con hasta seis posiciones decimales cuando sean convertidos, datos de contacto, destino y número de solicitud; MUST incluir un total solo si todas las líneas tienen precio. Los subtotales y total se muestran en USD con dos decimales.
- **FR-012**: El correo MUST tener versiones equivalentes en español e inglés, conservar la copia al equipo comercial y ofrecer una versión de texto simple. La versión visual MUST adaptarse a pantallas móviles y clientes de correo comunes, y alinearse con el rediseño público: fondo claro `#F6F4EF`, superficie blanca, azul institucional `#0B2239`, acento `#C0451F`, titulares Newsreader/Georgia y texto Inter/Arial. MUST NOT usar gradientes ni emojis decorativos.
- **FR-013**: El contenido proporcionado por el cliente MUST mostrarse como texto literal en el correo y no ejecutarse como marcado o enlaces no deseados.
- **FR-014**: La respuesta del formulario MUST distinguir entre solicitud registrada y correo efectivamente enviado.
- **FR-015**: Las cantidades MUST ser positivas y no superar 10 000 por línea. Las unidades de magnitudes continuas —masa, volumen, longitud y área— MUST admitir hasta tres posiciones decimales; las unidades discretas de conteo, empaque y contenedor MUST aceptar solo enteros. El formato decimal MUST respetar el idioma elegido. Las cantidades y conversiones MUST conservar la precisión aceptada durante el cálculo y en la solicitud, sin redondearlas silenciosamente.
- **FR-016**: Si no se pueden cargar países, unidades o productos, el formulario MUST terminar el estado de carga, informar el error y ofrecer una recuperación clara; MUST NOT repetir solicitudes sin límite ni dejar el formulario en carga indefinida.
- **FR-017**: El país de destino MUST ser obligatorio y validarse tanto antes del envío como al procesar la solicitud.
- **FR-018**: El correo de bienvenida a una suscripción MUST conservar su asunto, significado del contenido, idioma y comportamiento de entrega actuales. Su HTML MUST alinearse con el rediseño institucional vigente: fondo `#F6F4EF`, superficie blanca, navy `#0B2239`, acento `#C0451F` usado con moderación, titulares Newsreader/Georgia, texto Inter/Arial, divisores finos y esquinas de hasta 2 px; MUST NOT usar gradientes, sombras ni bordes laterales gruesos como acento.
- **FR-019**: El nombre opcional del suscriptor MUST insertarse como texto escapado y con separación legible en el saludo; si no existe, el correo MUST conservar un saludo genérico natural.

### Key Entities

- **Solicitud de cotización**: Identificador, datos de contacto, país de destino, idioma, importe total estimado en USD cuando todas las líneas tienen precio, y estado de envío del correo.
- **Línea de cotización**: Producto, cantidad, unidad, precio unitario estimado, subtotal, notas y especificaciones. Los importes son opcionales cuando no existe precio activo.
- **Producto**: Artículo exportable y su unidad base de medida.
- **Unidad de medida**: Nombre, símbolo, familia y factor de conversión.
- **Precio de catálogo**: Importe por producto y unidad, moneda USD, vigencia activa y fecha efectiva.

## Success Criteria

### Measurable Outcomes

- **SC-001**: En todos los casos de prueba con precio disponible, los importes presentados, guardados y enviados por correo coinciden con el cálculo del catálogo con una diferencia máxima de USD 0,01 por línea.
- **SC-002**: Ninguna prueba de precio ausente, inactivo o unidad incompatible produce un precio cero mostrado como cotización ni un total que excluya líneas sin explicarlo.
- **SC-003**: Las solicitudes de prueba en español e inglés muestran las mismas cantidades, unidades y valores, con etiquetas traducidas correctamente.
- **SC-004**: El formulario y el correo no afirman que se envió un correo cuando el servicio reporta fallo.
- **SC-005**: El correo de cotización se puede leer en vista móvil y de escritorio sin desplazamiento horizontal para sus datos principales.
- **SC-006**: Ante una respuesta fallida o limitada de los datos del formulario, el comprador recibe un estado visible de error y una opción de recuperación; no se generan solicitudes repetitivas durante la espera.
- **SC-007**: Una solicitud sin país de destino no se envía ni se guarda.
- **SC-008**: Con un precio de prueba de USD P/kg, una cantidad de 1,5 t y la conversión de 1 000 kg/t, el precio de unidad equivale a USD 1 000P/t y el subtotal a USD 1 500P antes del redondeo final; en español se muestra `1,5 t` y en inglés `1.5 t`, y una cantidad de empaque fraccionaria no se puede enviar.
- **SC-009**: Cuando no hay precio directo para la unidad solicitada y el importe se deriva de un mismo precio base, unidades compatibles equivalentes producen subtotales que difieren como máximo USD 0,01; una conversión inactiva o sin factor no produce un importe.
- **SC-010**: Un precio convertido con fracciones de centavo se multiplica por la cantidad antes de redondear el subtotal de línea a dos decimales de USD; el resultado coincide con el cálculo de precisión completa dentro de USD 0,01.
- **SC-011**: Las versiones en español e inglés del correo de bienvenida conservan sus asuntos y beneficios actuales y cumplen las reglas visuales de FR-018; ninguna contiene gradientes, sombras o bordes laterales gruesos.
- **SC-012**: El correo de bienvenida puede mostrarse a 320 y 600 px de ancho sin desplazamiento horizontal, y un nombre con caracteres HTML aparece como texto literal en ambos idiomas.

## Assumptions

- Los importes activos del catálogo representan precios unitarios de referencia en USD; solo un precio activo con fecha efectiva alcanzada se considera vigente. No se agregarán precios de mercado, tasas de cambio, impuestos, flete ni cargos sin datos aprobados.
- El equipo comercial confirma el precio final y sus condiciones después de revisar el producto, empaque, volumen, disponibilidad y destino.
- Las magnitudes continuas admiten hasta tres posiciones decimales; empaques, conteos y contenedores siguen siendo enteros. Esta precisión cubre gramos en kg y kilogramos en t, sin redondear silenciosamente lo ingresado.
- La página pública actual de cotización ya sigue el rediseño institucional de `docs/superpowers/specs/2026-10-20-public-site-redesign-design.md`; el alcance es corregir el flujo y mantener esa dirección visual, no rehacer las demás páginas.
- La ampliación añade solo la plantilla de bienvenida de suscripción; conserva el contenido y la entrega existentes y no cambia el flujo que la dispara.

## Out of Scope

- Definir o cargar tarifas comerciales reales para productos.
- Convertir precios a la moneda del país de destino.
- Calcular IVA, flete, seguro, aranceles u otros cargos de exportación.
- Emitir una oferta formal, factura, PDF comercial o precio con vigencia contractual.
- Rediseñar el resto del sitio o cualquier correo que no sea el de cotización o el de bienvenida de suscripción.
