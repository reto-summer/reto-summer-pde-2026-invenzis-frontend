# Invenzis — Radar de Licitaciones

Dashboard web para el monitoreo, búsqueda y notificación de licitaciones públicas. Permite categorizar licitaciones por familia/subfamilia, aplicar filtros avanzados y recibir alertas por email con las novedades del día.

---

## Índice

- [Descripción general](#descripción-general)
- [Arquitectura del sistema](#arquitectura-del-sistema)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y desarrollo local](#instalación-y-desarrollo-local)
- [Scripts disponibles](#scripts-disponibles)
- [Módulos principales](#módulos-principales)
  - [Capa API](#capa-api)
  - [Context global](#context-global)
  - [Hooks](#hooks)
  - [Features](#features)
  - [Componentes de layout](#componentes-de-layout)
  - [Componentes UI](#componentes-ui)
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

## Arquitectura del sistema

```
┌───────────────────────────────────────────────────────────────┐
│                      Cliente (Browser)                        │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              React SPA (este repositorio)               │  │
│  │                                                         │  │
│  │   MainPage ──► Header / Sidebar / Filters / BidCard     │  │
│  │       │              │                                  │  │
│  │       ▼              ▼                                  │  │
│  │   AppContext ──► Hooks (useLicitaciones,                │  │
│  │       │          useFamilias, useNotificaciones, etc.)  │  │
│  │       │              │                                  │  │
│  │       │              ▼                                  │  │
│  │       └────────► Capa API (client.ts + servicios)       │  │
│  │                      │                                  │  │
│  └──────────────────────┼──────────────────────────────────┘  │
│                         │                                     │
└─────────────────────────┼─────────────────────────────────────┘
                          │ HTTP / JSON (fetch)
                          ▼
┌─────────────────────────────────────────────────────┐
│              Backend REST API (separado)             │
│                                                      │
│  /familias  /subfamilias  /licitaciones              │
│  /config    /email        /notificacion              │
└─────────────────────────────────────────────────────┘
```

El frontend y el backend son proyectos independientes. Este repositorio contiene únicamente el cliente. La comunicación se realiza mediante peticiones HTTP REST usando `fetch`.

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
reto-summer-pde-2026-invenzis-frontend/
├── public/
├── src/
│   ├── main.tsx                        # Punto de entrada
│   ├── vite-env.d.ts
│   ├── styles/
│   │   └── index.css                   # Estilos globales + directivas Tailwind
│   ├── api/                            # Servicios de comunicación con el backend
│   │   ├── client.ts                   # Cliente HTTP base (wrapper de fetch)
│   │   ├── config.ts                   # Endpoints de configuración de usuario
│   │   ├── familias.ts                 # Endpoints de familias y subfamilias
│   │   ├── licitaciones.ts             # Endpoints de licitaciones + mapeo de datos
│   │   ├── emailConfig.ts              # Endpoints de gestión de emails
│   │   ├── notificaciones.ts           # Endpoints de notificaciones
│   │   ├── types.ts                    # Tipos de respuestas de la API
│   │   └── index.ts                    # Re-exportaciones
│   └── app/
│       ├── App.tsx                     # Raíz de la aplicación + AppProvider
│       ├── index.ts                    # Re-exportaciones del módulo app
│       ├── pages/
│       │   └── MainPage.tsx            # Página principal: orquesta layout y lógica
│       ├── components/
│       │   ├── layout/                 # Componentes de estructura/layout
│       │   │   ├── Header.tsx          # Header fijo superior
│       │   │   ├── Sidebar.tsx         # Panel lateral / drawer en móvil
│       │   │   ├── FiltrosLicitaciones.tsx  # Selector cascada familia/subfamilia
│       │   │   ├── NotificacionesEmail.tsx  # Gestión de emails para notificaciones
│       │   │   └── index.ts
│       │   └── ui/                     # Componentes reutilizables de UI
│       │       ├── BidCardSkeleton.tsx  # Skeleton de carga
│       │       ├── EmptyState.tsx       # Estado vacío
│       │       ├── ErrorMessage.tsx     # Componente de error
│       │       ├── MiniCalendar.tsx     # Calendario para filtros de fecha
│       │       ├── icons/
│       │       │   └── index.tsx        # Iconos SVG reutilizables
│       │       ├── inputs/
│       │       │   ├── FilterChip.tsx   # Chip togglable para filtros
│       │       │   └── index.ts
│       │       └── index.ts
│       ├── features/                    # Módulos por dominio
│       │   ├── bids/
│       │   │   ├── components/
│       │   │   │   └── BidCard.tsx      # Tarjeta individual de licitación
│       │   │   ├── types/
│       │   │   │   └── Bid.ts           # Tipos Bid, Familia, Subfamilia
│       │   │   └── index.ts
│       │   ├── filters/
│       │   │   ├── components/
│       │   │   │   ├── Filters.tsx      # Barra de filtros principal
│       │   │   │   ├── DatePill.tsx     # Pill de fecha con popover
│       │   │   │   ├── TipoPill.tsx     # Pill de tipo de licitación
│       │   │   │   ├── PlazoDropdown.tsx # Dropdown de plazo de urgencia
│       │   │   │   └── PopoverActions.tsx # Acciones de popover (limpiar/aplicar)
│       │   │   ├── types/
│       │   │   │   └── filters.ts       # Tipo FiltersState y constantes
│       │   │   └── index.ts
│       │   └── notifications/
│       │       ├── components/
│       │       │   ├── NotificationPanel.tsx   # Panel flotante de notificaciones
│       │       │   ├── NotificationHeader.tsx  # Cabecera del panel
│       │       │   ├── NotificationList.tsx    # Lista de notificaciones
│       │       │   ├── NotificationItem.tsx    # Item individual de notificación
│       │       │   ├── NotificationDetail.tsx  # Vista detalle de notificación
│       │       │   └── StatusBadge.tsx         # Badge de estado (éxito/error)
│       │       ├── hooks/
│       │       │   └── useNotificaciones.ts    # Hook de notificaciones + lectura
│       │       └── index.ts
│       └── shared/                      # Código compartido entre features
│           ├── context/
│           │   └── AppContext.tsx        # Estado global (filtros, sidebar, familia)
│           ├── hooks/
│           │   ├── useLicitaciones.ts    # Carga y refresco de licitaciones
│           │   ├── useFamilias.ts        # Carga en cascada familia/subfamilia
│           │   ├── useEmailConfig.ts     # CRUD de emails
│           │   └── index.ts
│           ├── types/
│           │   └── index.ts
│           ├── utils/
│           │   ├── dateHelpers.ts        # Helpers de formateo de fechas
│           │   └── index.ts
│           └── index.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── nginx.conf
├── Dockerfile
├── cloudbuild.yml
└── .env                                 # Variables de entorno locales (no commitear)
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

## Módulos principales

### Capa API

Ubicada en `src/api/`. Provee una abstracción sobre `fetch` para comunicarse con el backend.

**`client.ts`** — Cliente HTTP base. Expone métodos `get`, `post`, `put` y `del` que construyen la URL a partir de `__API_BASE_URL__` y retornan la respuesta parseada como JSON.

**`licitaciones.ts`** — Obtiene la lista de licitaciones filtradas por familia y subfamilia. Incluye `filtersToQuery()` que convierte el estado de filtros UI a query params de la API, y `mapBackendToBid()` que normaliza la respuesta del backend al tipo `Bid` del frontend.

**`familias.ts`** — Carga la lista de familias y, dado un código de familia, carga sus subfamilias.

**`config.ts`** — Lee y escribe la preferencia de familia/subfamilia del usuario en el backend (`GET /config` y `PUT /config`).

**`emailConfig.ts`** — Gestiona las direcciones de email registradas para notificaciones (listar, agregar, eliminar).

**`notificaciones.ts`** — Carga las notificaciones de la última semana (filtradas por `fechaEjecucion`) y el detalle de una notificación específica. Mapea los campos del backend (`titulo`, `exito`, `fechaEjecucion`) a los tipos del frontend.

**`types.ts`** — Tipos TypeScript para las respuestas del backend: `LicitacionBackendResponse`, `NotificacionBackendResumen`, `NotificacionBackendDetalle`, `Familia`, `Subfamilia`, `EmailConfig`, y los tipos mapeados `NotificacionResumen` y `NotificacionDetalle`.

---

### Context global

**`src/app/shared/context/AppContext.tsx`**

Provee el estado compartido de la aplicación a través de React Context.

| Estado | Tipo | Descripción |
|---|---|---|
| `filters` | `FiltersState` | Filtros activos (búsqueda, tipo, fechas, plazo) |
| `setFilters` | función | Actualizador de filtros |
| `sidebarOpen` | `boolean` | Estado del sidebar (mobile) |
| `setSidebarOpen` | función | Toggle del sidebar |
| `familiaCod` | `string \| null` | Código de familia seleccionada |
| `subfamiliaCod` | `string \| null` | Código de subfamilia seleccionada |
| `configLoaded` | `boolean` | `true` una vez que `GET /config` resolvió (evita fetch prematuro de licitaciones) |
| `setFiltrosCascada` | función | Cambia familia y subfamilia, persiste en backend |

Al montar, `AppContext` llama a `GET /config` para restaurar la preferencia guardada del usuario. Hasta que `configLoaded` sea `true`, los hooks de licitaciones no disparan el fetch inicial.

---

### Hooks

Ubicados en `src/app/shared/hooks/` (compartidos) y en cada feature (específicos).

**`useLicitaciones`** (`shared/hooks/`) — Realiza el fetch de licitaciones cuando cambian `familiaCod` o `subfamiliaCod`. Solo se activa cuando `configLoaded` es `true`. Retorna `{ licitaciones, loading, error, refetchLicitaciones }`.

**`useFamilias`** (`shared/hooks/`) — Gestiona la carga en cascada: primero carga la lista de familias, luego carga subfamilias automáticamente cuando se selecciona una familia. Retorna `{ familias, subfamilias, loadingFamilias, loadingSubfamilias }`.

**`useEmailConfig`** (`shared/hooks/`) — Provee `{ emails, loading, addEmail, removeEmail }` para gestionar los destinatarios de notificaciones.

**`useNotificaciones`** (`features/notifications/hooks/`) — Carga las notificaciones de la última semana. Gestiona el estado de lectura en `localStorage` y el fetch del detalle bajo demanda. Retorna `{ notificaciones, detalleActual, loading, unreadCount, markAsRead, markAllAsRead, fetchDetalle, clearDetalle, refetch }`.

---

### Features

El proyecto organiza la lógica de dominio en `src/app/features/`, cada una con sus propios componentes, tipos y hooks.

#### `features/bids`

**`BidCard`** — Tarjeta de licitación individual. Muestra: título, descripción, familia, fechas, tipo, badge de urgencia (rojo < 48 h, naranja < 96 h, verde ≥ 96 h) y enlace al sitio oficial.

**`Bid.ts`** — Define los tipos `Bid`, `Familia` y `Subfamilia`.

#### `features/filters`

**`Filters`** — Barra de filtros principal. En escritorio se muestra como una fila de pills con popovers para fechas. En móvil se convierte en un panel full-screen. Incluye toggle para alternar entre licitaciones vigentes y vencidas.

**`DatePill`** — Pill de fecha (publicación o cierre) que abre un popover con `MiniCalendar` para seleccionar rango.

**`TipoPill`** — Pill desplegable para filtrar por tipo de licitación.

**`PlazoDropdown`** — Dropdown para filtrar por plazo de urgencia (hoy, < 7 días, 7–15 días, > 15 días).

**`PopoverActions`** — Botones de acción (limpiar/aplicar) reutilizados en los popovers de filtros.

**`filters.ts`** — Define `FiltersState` (search, tenderTypes, dateRanges, familia, subfamilia, fechas) y `DEFAULT_FILTERS`.

#### `features/notifications`

**`NotificationPanel`** — Panel flotante accionado desde la campana del header. Orquesta los subcomponentes de notificaciones.

**`NotificationHeader`** — Cabecera del panel: título, contador de no leídas y botón para marcar todas como vistas.

**`NotificationList`** — Lista scrollable de notificaciones.

**`NotificationItem`** — Item individual: título, fecha de ejecución y estado de lectura.

**`NotificationDetail`** — Vista de detalle: contenido completo de la notificación, fechas y estado.

**`StatusBadge`** — Badge que indica si la ejecución fue exitosa o fallida.

---

### Componentes de layout

Ubicados en `src/app/components/layout/`.

**`Header`** — Barra superior fija. Muestra el logo de Invenzis, el título de la vista activa (cantidad de licitaciones disponibles) y el ícono de campana que abre el `NotificationPanel`.

**`Sidebar`** — Panel lateral en escritorio / drawer deslizante en móvil. Contiene `FiltrosLicitaciones` y `NotificacionesEmail`.

**`FiltrosLicitaciones`** — Selector en cascada familia → subfamilia. Al cambiar la familia, limpia la subfamilia y lanza la carga de subfamilias correspondientes.

**`NotificacionesEmail`** — Formulario para agregar y lista con botón para eliminar emails registrados como destinatarios de notificaciones.

---

### Componentes UI

Ubicados en `src/app/components/ui/`. Componentes visuales reutilizables sin lógica de negocio.

**`BidCardSkeleton`** — Placeholder animado mientras se cargan las licitaciones.

**`EmptyState`** — Mensaje de estado vacío (sin licitaciones encontradas).

**`ErrorMessage`** — Componente de error con mensaje descriptivo.

**`MiniCalendar`** — Calendario compacto para selección de fecha en los popovers de filtros.

**`FilterChip`** (`inputs/`) — Chip togglable reutilizado en los filtros de tipo de licitación.

**`icons/`** — Iconos SVG reutilizables como componentes React.

---

### Página principal: `MainPage`

`src/app/pages/MainPage.tsx` es el componente raíz de la interfaz. Orquesta el layout completo:

1. Consume `AppContext` para obtener filtros, estado del sidebar y selección de familia/subfamilia.
2. Invoca `useLicitaciones` con los códigos de familia/subfamilia y espera a que `configLoaded` sea `true`.
3. Deriva los tipos de licitación disponibles de los datos (`availableTipos`).
4. Aplica filtros **client-side**: búsqueda por texto, tipo, plazo, fecha de publicación y fecha de cierre.
5. Separa las licitaciones en vigentes y vencidas; muestra unas u otras según el toggle (`showExpired`).
6. Renderiza `Header`, `Sidebar`, `Filters` y la grilla de `BidCard`.

---

## Endpoints del backend

La URL base se configura mediante la variable `API_BASE_URL`.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/familias` | Lista de familias disponibles |
| `GET` | `/subfamilias/familia/{fami_cod}` | Subfamilias de una familia |
| `GET` | `/licitaciones` | Licitaciones (query params: `familiaCod`, `subfamiliaCod`) |
| `GET` | `/licitaciones/{id}` | Detalle de una licitación |
| `GET` | `/config` | Preferencia de familia/subfamilia del usuario |
| `PUT` | `/config` | Guardar preferencia de familia/subfamilia |
| `GET` | `/email` | Lista de emails registrados |
| `POST` | `/email` | Registrar un email |
| `DELETE` | `/email/{emailAddress}` | Eliminar un email |
| `GET` | `/notificacion` | Notificaciones recientes (query param: `fechaEjecucion`) |
| `GET` | `/notificacion/{id}` | Detalle de una notificación |
