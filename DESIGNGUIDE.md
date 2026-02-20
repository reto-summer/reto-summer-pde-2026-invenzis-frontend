# Guías de diseño

---

# General

* Preferir **flexbox** y **CSS Grid** para layouts. Usar posicionamiento absoluto solo cuando sea necesario (overlays, tooltips).
* Refactorizar al avanzar: archivos pequeños, helpers y componentes en archivos propios.
* Mantener **alta densidad de información** típica de dashboards: contenido compacto pero legible (padding `p-3`–`p-6`, `text-sm`/`text-xs` donde aplique).

---

# Sistema de diseño

## Tipografía

* **Base:** `font-size: 16px` (variable `--font-size` en `theme.css`).
* **Cuerpo:** fuente **Outfit** (300, 400, 500, 600). Fallback: system fonts.
* **Títulos (h1–h4):** fuente **Space Grotesk** (400, 500, 600, 700).
* Escala: `text-2xl` (h1), `text-xl` (h2), `text-lg` (h3), `text-base` (h4). Labels y botones: `text-base`; contenido secundario: `text-sm` / `text-xs`.
* Line-height consistente: `1.5` para texto y títulos.

## Colores

* **Fondo general:** `bg-slate-50` (páginas) y `bg-white` (cards, headers, sidebars).
* **Texto principal:** `text-slate-900`; secundario: `text-slate-600` / `text-slate-500`; muted: `text-slate-400`.
* **Bordes:** `border-slate-200`.
* **Primario/CTA:** azul — `bg-blue-600` / `hover:bg-blue-700`; texto en botones: `text-white`. Enlaces: `text-blue-600 hover:underline`.
* **Urgencia:** rojo `text-red-600`/`bg-red-500`, naranja `bg-orange-500`, verde `bg-emerald-500` para estados (ej. plazos).
* **Destructivo:** usar variables del tema `--destructive` / clases del design system.
* **Acentos suaves:** `from-blue-50 to-indigo-50`, `bg-blue-50`, `border-blue-200` para bloques destacados (resumen IA, CTA).

## Espaciado y bordes

* **Radius:** variable `--radius: 0.625rem`; en componentes `rounded-lg` para cards y contenedores, `rounded-md` para botones/inputs.
* **Padding de página:** `px-6 py-4` (headers), `px-6 py-3` o `py-6` (contenido).
* **Cards:** `p-3` (compactas, ej. BidCard) o `p-6` (detalle, paneles).

## Componentes

* **Botones:** usar variantes del design system (`default`, `outline`, `secondary`, `ghost`, `link`, `destructive`) y tamaños `sm`, `default`, `lg`, `icon`. Un CTA principal por sección; el resto secundarios (`outline`).
* **Badges:** para estados/etiquetas (urgencia, tipo de licitación). Combinar con iconos (lucide-react) cuando ayude.
* **Inputs:** `bg-slate-50` o `bg-input-background`, `border-slate-200`; con icono usar `pl-10` y posición absoluta del icono.
* **Tablas:** `thead` con `bg-slate-50`, celdas `px-4 py-3`, `divide-y divide-slate-100`; en móvil considerar scroll horizontal o layout en lista.

---

# Diseño responsive

## Breakpoints (Tailwind)

* **Mobile:** &lt; 768px (coincide con `useIsMobile`: `MOBILE_BREAKPOINT = 768`).
* **Tablet/Desktop:** `md:` (768px) y superiores; `lg:` (1024px) para layouts de 2–3 columnas.

## Patrones de layout

* **Contenedor principal:** ancho máximo `max-w-7xl mx-auto` con `px-6` para no pegar contenido a los bordes.
* **Páginas con sidebar:** estructura `flex`; sidebar fija (ej. `w-80`) en desktop. En móvil: ocultar sidebar fija y usar Sheet/Drawer (ej. menú hamburguesa o panel de filtros).
* **Grid de cards:** `grid grid-cols-1` en móvil; en desktop `md:grid-cols-2` o `lg:grid-cols-3` según densidad deseada. Gap: `gap-2` (compacto) o `gap-4`/`gap-6`.
* **Columnas de detalle:** `grid grid-cols-1 lg:grid-cols-3 gap-6`; columna principal `lg:col-span-2`, sidebar `lg:col-span-1`.
* **Áreas scrollables:** `flex-1 overflow-y-auto` en el contenido para que el header quede fijo y solo el cuerpo haga scroll.

## Componentes overlay

* **Sheet/Drawer:** en móvil `w-3/4`; en desktop `sm:max-w-sm` (o ancho fijo razonable). Siempre considerar `max-w-[calc(100%-2rem)]` en viewports pequeños.
* **Dialog/Modal:** `max-w-[calc(100%-2rem)]` en móvil, `sm:max-w-lg` en pantallas mayores. Botones: `flex-col-reverse sm:flex-row sm:justify-end` para apilar en móvil.
* **Paneles laterales (detalle):** en móvil mostrarlos a pantalla completa o como Sheet; en desktop ancho fijo (ej. `w-[520px]`).

## Contenido adaptable

* **Texto largo:** `line-clamp-2` (o similar) en cards para evitar alturas variables excesivas.
* **Flex con wrap:** `flex-wrap` en headers o grupos de badges cuando puedan saltar línea en pantallas pequeñas (ej. `flex items-center gap-4 flex-wrap`).
* **Tablas:** en móvil priorizar scroll horizontal (`overflow-x-auto`) o sustituir por lista de cards/accordion si mejora la usabilidad.

---

# Resumen de buenas prácticas

* Usar **variables CSS del tema** (`theme.css`) para colores y radius; en componentes Tailwind usar las clases que mapean a esas variables cuando existan.
* Mantener **headers fijos** con `sticky top-0 z-10` y contenido con `overflow-y-auto`.
* Transiciones suaves en hover/focus: `transition-all`, `hover:shadow-md`, `hover:border-blue-300` en cards interactivas.
* Iconos: **lucide-react** con tamaños coherentes (`w-4 h-4` para inline, `w-5 h-5` en bloques).
* Fechas y números: formato local (ej. español) y `toLocaleString('es')` cuando aplique.