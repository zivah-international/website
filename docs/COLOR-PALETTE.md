# 🎨 Paleta de Colores ZIVAH International S.A.

## Descripción
Esta documentación describe la nueva paleta de colores oficial de ZIVAH International S.A., extraída y optimizada directamente del logo oficial de la empresa. Esta paleta está diseñada para mantener consistencia visual en todos los productos digitales y materiales de marketing.

## 🌈 Colores Principales del Logo

### Verdes (Naturaleza y Agricultura)
- **Verde Lima**: `#7CB342` - Para representar naturaleza, agricultura y productos frescos
- **Verde Medio**: `#2E7D32` - Vegetación, sostenibilidad y confianza
- **Verde Oscuro**: `#1B5E20` - Profundidad, estabilidad y productos premium

### Azules (Mar y Profesionalismo)
- **Azul Marino**: `#0D47A1` - Mar, exportación y profesionalismo
- **Azul Medio**: `#1976D2` - Agua, frescura y tecnología

### Naranjas (Energía y Productos Marinos)
- **Naranja Coral**: `#FF5722` - Productos marinos, energía y llamadas a la acción
- **Naranja Claro**: `#FF8A65` - Detalles, highlights y calidez

### Grises (Texto y Elegancia)
- **Gris Azulado**: `#37474F` - Texto principal y elegancia
- **Gris Carbón**: `#263238` - Headers y textos principales

### Neutros
- **Blanco**: `#FFFFFF` - Fondos principales
- **Gris Claro**: `#F5F5F5` - Fondos secundarios

## 🔧 Variables CSS

### Implementación en CSS
```css
:root {
  /* Colores principales del logo */
  --zivah-lime: #7CB342;
  --zivah-green: #2E7D32;
  --zivah-dark-green: #1B5E20;
  --zivah-navy: #0D47A1;
  --zivah-blue: #1976D2;
  --zivah-coral: #FF5722;
  --zivah-light-coral: #FF8A65;
  --zivah-blue-gray: #37474F;
  --zivah-charcoal: #263238;
  --zivah-light-gray: #F5F5F5;
  --zivah-white: #FFFFFF;
}
```

### Gradientes Oficiales
```css
/* Gradiente principal (hero sections) */
--hero-gradient: linear-gradient(135deg, var(--zivah-coral) 0%, var(--zivah-green) 100%);

/* Gradiente marino (productos del mar) */
--ocean-gradient: linear-gradient(135deg, var(--zivah-navy) 0%, var(--zivah-blue) 100%);

/* Gradiente natural (productos agrícolas) */
--forest-gradient: linear-gradient(135deg, var(--zivah-dark-green) 0%, var(--zivah-lime) 100%);

/* Gradiente completo de la naturaleza */
--nature-gradient: linear-gradient(135deg, var(--zivah-dark-green) 0%, var(--zivah-green) 50%, var(--zivah-lime) 100%);
```

## 🎯 Guía de Uso por Sectores

### 🌱 Productos Agrícolas
- **Primario**: Verde Medio (`#2E7D32`)
- **Secundario**: Verde Lima (`#7CB342`)
- **Acento**: Verde Oscuro (`#1B5E20`)

### 🦐 Productos Marinos
- **Primario**: Azul Marino (`#0D47A1`)
- **Secundario**: Naranja Coral (`#FF5722`)
- **Acento**: Azul Medio (`#1976D2`)

### ⚡ Llamadas a la Acción
- **Botones principales**: Naranja Coral (`#FF5722`)
- **Botones secundarios**: Verde Medio (`#2E7D32`)
- **Hover states**: Versiones más oscuras de los colores base

## 🔨 Clases Utilitarias Disponibles

### Colores de Texto
```css
.text-zivah-lime     /* Verde Lima */
.text-zivah-green    /* Verde Medio */
.text-zivah-coral    /* Naranja Coral */
.text-zivah-navy     /* Azul Marino */
```

### Colores de Fondo
```css
.bg-zivah-lime       /* Fondo Verde Lima */
.bg-zivah-green      /* Fondo Verde Medio */
.bg-zivah-coral      /* Fondo Naranja Coral */
.bg-zivah-navy       /* Fondo Azul Marino */
```

### Gradientes
```css
.bg-gradient-primary /* Gradiente principal */
.bg-gradient-marine  /* Gradiente marino */
.bg-gradient-nature  /* Gradiente natural */
```

### Botones Predefinidos
```css
.btn-zivah-primary   /* Botón verde principal */
.btn-zivah-secondary /* Botón coral secundario */
.btn-zivah-outline   /* Botón con borde */
```

## 🎨 Combinaciones Recomendadas

### Combinación Primaria
- **Fondo**: Blanco (`#FFFFFF`)
- **Texto**: Gris Carbón (`#263238`)
- **Acentos**: Verde Medio (`#2E7D32`)

### Combinación Marina
- **Fondo**: Azul Marino (`#0D47A1`)
- **Texto**: Blanco (`#FFFFFF`)
- **Acentos**: Azul Medio (`#1976D2`)

### Combinación Energética
- **Fondo**: Gris Claro (`#F5F5F5`)
- **Texto**: Gris Carbón (`#263238`)
- **Acentos**: Naranja Coral (`#FF5722`)

## 📱 Adaptación para Dark Mode

En modo oscuro, se mantienen los colores principales pero se ajustan los fondos y textos:

```css
[data-theme="dark"] {
  --bg-primary: #0f1419;
  --bg-secondary: var(--zivah-charcoal);
  --text-primary: #f7fafc;
  --text-secondary: #e2e8f0;
}
```

## 🔍 Accesibilidad

Todos los colores han sido probados para cumplir con las pautas WCAG 2.1:
- **Contraste mínimo AA**: 4.5:1 para texto normal
- **Contraste mejorado AAA**: 7:1 para texto importante
- **Estados de foco** claramente definidos para navegación por teclado

## 📊 Exportación para Diseñadores

### Adobe Creative Suite
1. Abrir `color-palette.html` en el navegador
2. Usar el botón "Copiar JSON" para obtener los códigos hex
3. Importar en Adobe Color o crear paletas personalizadas

### Figma/Sketch
```json
{
  "zivah-lime": "#7CB342",
  "zivah-green": "#2E7D32",
  "zivah-dark-green": "#1B5E20",
  "zivah-navy": "#0D47A1",
  "zivah-blue": "#1976D2",
  "zivah-coral": "#FF5722",
  "zivah-light-coral": "#FF8A65"
}
```

## 🚀 Implementación Rápida

Para implementar esta paleta en un nuevo proyecto:

1. **Incluir el CSS de la paleta**:
   ```html
   <link rel="stylesheet" href="css/zivah-palette.css" />
   ```

2. **Usar las variables en tu CSS**:
   ```css
   .mi-elemento {
     background-color: var(--zivah-green);
     color: var(--zivah-white);
   }
   ```

3. **Aplicar clases utilitarias directamente**:
   ```html
   <button class="btn-zivah-primary">Mi Botón</button>
   <div class="bg-zivah-lime text-white">Mi Contenido</div>
   ```

## 📞 Contacto y Soporte

Para preguntas sobre la implementación de esta paleta de colores o solicitudes de nuevos componentes, contacta al equipo de desarrollo de ZIVAH International S.A.

---

**© 2024 ZIVAH International S.A. - Paleta de Colores Oficial**
