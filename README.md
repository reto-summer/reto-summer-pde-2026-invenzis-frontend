# Invenzis — Radar de Licitaciones

Dashboard web para el monitoreo, búsqueda y notificación de licitaciones públicas. Permite categorizar licitaciones por familia/subfamilia, aplicar filtros avanzados y recibir alertas por email con las novedades del día.

---

## Índice

- [Descripción general](#descripción-general)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y desarrollo local](#instalación-y-desarrollo-local)
- [Scripts disponibles](#scripts-disponibles)
- [Endpoints del backend](#endpoints-del-backend)

---

## Descripción general

**Invenzis Radar de Licitaciones** es una SPA (Single Page Application) que funciona como interfaz principal para el sistema de monitoreo de licitaciones públicas de Invenzis.

Sus funcionalidades principales son:

- **Búsqueda y filtrado** de licitaciones por texto, tipo, fechas de publicación/cierre y plazo de urgencia.
- **Categorización** mediante selector en cascada de familia → subfamilia, con preferencias persistidas en el backend.
- **Toggle de licitaciones vencidas**: permite alternar entre ver solo las vigentes o solo las vencidas.
- **Notificaciones por email**: gestión de destinatarios para recibir resúmenes diarios de licitaciones.
- **Panel de notificaciones** en el header que muestra alertas recientes con estado de lectura persistido en `localStorage`.
- **Interfaz responsiva** con layout diferenciado para escritorio y móvil.

---

## Stack tecnológico

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework UI | React | 19.x |
| Lenguaje | TypeScript | 5.x |
| Bundler | Vite | 7.x |
| Estilos | Tailwind CSS | 4.x |
| Enrutamiento | React Router | 7.x |

**Fuentes tipográficas:** Outfit (cuerpo), Space Grotesk (títulos), importadas desde Google Fonts.

---

## Estructura del proyecto

```
src/
├── main.tsx                          # Punto de entrada
├── vite-env.d.ts                     # Declaración de la global __API_BASE_URL__
├── styles/
│   └── index.css                     # Estilos globales + directivas Tailwind
├── api/                              # Cliente HTTP y servicios del backend
│   ├── index.ts                      # Barrel — re-exporta todos los servicios y tipos
│   ├── client.ts                     # Cliente HTTP base (wrapper de fetch)
│   ├── types.ts                      # Tipos de respuestas del backend
│   ├── licitaciones.ts               # Licitaciones + mapeo de datos
│   ├── familias.ts                   # Familias y subfamilias
│   ├── config.ts                     # Preferencias del usuario (FamiliaConfig)
│   ├── emailConfig.ts                # Gestión de emails
│   └── notificaciones.ts             # Notificaciones (resumen y detalle)
└── app/
    ├── App.tsx                       # Raíz de la aplicación + AppProvider
    ├── index.ts                      # Barrel del módulo app
    ├── pages/
    │   └── MainPage.tsx              # Página principal: orquesta layout y lógica
    ├── components/
    │   ├── layout/                   # Componentes de estructura
    │   │   ├── Header.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── FiltrosLicitaciones.tsx
    │   │   ├── NotificacionesEmail.tsx
    │   │   └── index.ts
    │   └── ui/                       # Componentes reutilizables de UI
    │       ├── BidCardSkeleton.tsx
    │       ├── EmptyState.tsx
    │       ├── ErrorMessage.tsx
    │       ├── MiniCalendar.tsx
    │       ├── icons/index.tsx        # Iconos SVG como componentes React
    │       ├── inputs/FilterChip.tsx   # Chip togglable para filtros
    │       └── index.ts
    ├── features/                      # Módulos organizados por dominio
    │   ├── bids/
    │   │   ├── components/BidCard.tsx  # Tarjeta individual de licitación
    │   │   ├── types/Bid.ts           # Tipos Bid, BidFamilia, BidSubfamilia
    │   │   └── index.ts
    │   ├── filters/
    │   │   ├── components/
    │   │   │   ├── Filters.tsx         # Barra de filtros principal
    │   │   │   ├── DatePill.tsx        # Pill de fecha con popover
    │   │   │   ├── TipoPill.tsx        # Pill de tipo de licitación
    │   │   │   ├── PlazoDropdown.tsx   # Dropdown de plazo de urgencia
    │   │   │   └── PopoverActions.tsx  # Acciones de popover (limpiar/aplicar)
    │   │   ├── types/filters.ts       # FiltersState y constantes
    │   │   └── index.ts
    │   └── notifications/
    │       ├── components/
    │       │   ├── NotificationPanel.tsx
    │       │   ├── NotificationHeader.tsx
    │       │   ├── NotificationList.tsx
    │       │   ├── NotificationItem.tsx
    │       │   ├── NotificationDetail.tsx
    │       │   └── StatusBadge.tsx
    │       ├── hooks/useNotificaciones.ts  # Hook de notificaciones + lectura
    │       └── index.ts
    └── shared/                        # Código compartido entre features
        ├── context/AppContext.tsx      # Estado global (filtros, sidebar, familia)
        ├── hooks/
        │   ├── useLicitaciones.ts
        │   ├── useFamilias.ts
        │   ├── useEmailConfig.ts
        │   └── index.ts
        ├── types/index.ts
        ├── utils/dateHelpers.ts        # Helpers de formateo de fechas
        └── index.ts
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
API_BASE_URL=https://<dominio-del-backend>
```

Esta variable se define en `vite.config.ts` mediante `define`:

```ts
define: {
  __API_BASE_URL__: JSON.stringify(env.API_BASE_URL || ""),
}
```

En el código fuente se accede como la variable global `__API_BASE_URL__` (declarada en `vite-env.d.ts`).

> **Nota de seguridad:** No commitear el archivo `.env`. El valor de `API_BASE_URL` se expone en el bundle del cliente; no incluir credenciales en la URL.

---

## Instalación y desarrollo local

**Requisitos previos:**
- Node.js 20 o superior
- npm 10 o superior

**Pasos:**

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd reto-summer-pde-2026-invenzis-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
#    Crear un archivo .env en la raíz con:
#    API_BASE_URL=https://<dominio-del-backend>
echo "API_BASE_URL=https://<dominio-del-backend>" > .env

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` por defecto.

---

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Compila TypeScript y genera el bundle de producción en `dist/` |
| `npm run preview` | Sirve el build de producción localmente |

---

## Endpoints del backend

La URL base se configura mediante la variable `API_BASE_URL`.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/familias` | Lista de familias disponibles |
| `GET` | `/subfamilias/familia/{fami_cod}` | Subfamilias de una familia |
| `GET` | `/licitaciones` | Licitaciones (query params: `familiaCod`, `subfamiliaCod`, `fechaPublicacionDesde`, `fechaPublicacionHasta`, `fechaCierreDesde`, `fechaCierreHasta`) |
| `GET` | `/licitaciones/{id}` | Detalle de una licitación |
| `GET` | `/config` | Preferencia de familia/subfamilia del usuario |
| `PUT` | `/config` | Guardar preferencia de familia/subfamilia |
| `GET` | `/email` | Lista de emails registrados |
| `POST` | `/email` | Registrar un email |
| `DELETE` | `/email/{emailAddress}` | Eliminar un email |
| `GET` | `/notificacion` | Notificaciones recientes (query param: `fechaEjecucion`) |
| `GET` | `/notificacion/{id}` | Detalle de una notificación |


