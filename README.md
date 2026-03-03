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
  - [Componentes](#componentes)
- [Endpoints del backend](#endpoints-del-backend)
- [Despliegue](#despliegue)

---

## Descripción general

**Invenzis Radar de Licitaciones** es una SPA (Single Page Application) que funciona como interfaz principal para el sistema de monitoreo de licitaciones públicas de Invenzis.

Sus funcionalidades principales son:

- **Búsqueda y filtrado** de licitaciones por texto, tipo, fechas de publicación/cierre y urgencia.
- **Categorización** mediante selector en cascada de familia → subfamilia, con preferencias persistidas en el backend.
- **Notificaciones por email**: gestión de destinatarios para recibir resúmenes diarios de licitaciones.
- **Panel de notificaciones** en el header que muestra alertas recientes con estado de lectura persistido en `localStorage`.
- **Interfaz responsiva** con layout diferenciado para escritorio y móvil.

---

## Arquitectura del sistema

```
┌──────────────────────────────────────────────────────┐
│                   Cliente (Browser)                   │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │          React SPA (este repositorio)           │ │
│  │                                                 │ │
│  │   AppContext ──► Hooks ──► Capa API             │ │
│  │       │                      │                  │ │
│  │   Componentes            fetch / REST            │ │
│  └──────────────────────────┼──────────────────────┘ │
│                             │                         │
└─────────────────────────────┼─────────────────────────┘
                              │ HTTP / JSON
                              ▼
┌─────────────────────────────────────────────────────┐
│              Backend REST API (separado)             │
│         Desplegado en Google Cloud Run (QA)          │
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
| Contenedor | Docker + Nginx | - |
| CI/CD | Google Cloud Build | - |
| Hosting | Google Cloud Run | - |

**Fuentes tipográficas:** Outfit (cuerpo), Space Grotesk (títulos), importadas desde Google Fonts.

---

## Estructura del proyecto

```
reto-summer-pde-2026-invenzis-frontend/
├── public/
├── src/
│   ├── main.tsx                   # Punto de entrada
│   ├── vite-env.d.ts
│   ├── styles/
│   │   └── index.css              # Estilos globales + directivas Tailwind
│   ├── api/                       # Servicios de comunicación con el backend
│   │   ├── client.ts              # Cliente HTTP base (wrapper de fetch)
│   │   ├── config.ts              # Endpoints de configuración de usuario
│   │   ├── familias.ts            # Endpoints de familias y subfamilias
│   │   ├── licitaciones.ts        # Endpoints de licitaciones + mapeo de datos
│   │   ├── emailConfig.ts         # Endpoints de gestión de emails
│   │   ├── notificaciones.ts      # Endpoints de notificaciones
│   │   ├── types.ts               # Tipos de respuestas de la API
│   │   └── index.ts               # Re-exportaciones
│   └── app/
│       ├── App.tsx                # Raíz de la aplicación + AppProvider
│       ├── context/
│       │   └── AppContext.tsx     # Estado global (filtros, sidebar, familia)
│       ├── pages/
│       │   └── MainPage.tsx       # Página única: orquesta layout y lógica
│       ├── components/
│       │   ├── header.tsx         # Header fijo superior
│       │   ├── Sidebar.tsx        # Panel lateral / drawer en móvil
│       │   ├── Filters.tsx        # Barra de filtros (desktop) / panel (móvil)
│       │   ├── BidCard.tsx        # Tarjeta individual de licitación
│       │   ├── FiltrosLicitaciones.tsx  # Selector cascada familia/subfamilia
│       │   ├── NotificacionesEmail.tsx  # Gestión de emails para notificaciones
│       │   ├── NotificationPanel.tsx    # Panel flotante de notificaciones
│       │   └── ui/
│       │       ├── BidCardSkeleton.tsx  # Skeleton de carga
│       │       ├── EmptyState.tsx       # Estado vacío
│       │       └── ErrorMessage.tsx     # Componente de error
│       ├── hooks/
│       │   ├── useAppContext.ts    # Acceso al AppContext
│       │   ├── useLicitaciones.ts  # Carga y refresco de licitaciones
│       │   ├── useFamilias.ts      # Carga en cascada familia/subfamilia
│       │   ├── useEmailConfig.ts   # CRUD de emails
│       │   ├── useNotificaciones.ts # Carga de notificaciones + detalle
│       │   └── useFilters.ts       # (reservado para lógica de filtros)
│       └── types/
│           ├── Bid.ts             # Tipos Bid, Familia, Subfamilia
│           └── filters.ts         # Tipo FiltersState y constantes
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── nginx.conf                     # Configuración Nginx para SPA (fallback a index.html)
├── Dockerfile                     # Build multi-stage (Node → Nginx)
├── cloudbuild.yml                 # Pipeline de Cloud Build
└── .env                           # Variables de entorno locales (no commitear)
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
API_BASE_URL=https://<dominio-del-backend>
```

Esta variable es inyectada en el bundle en tiempo de build por Vite, disponible en el código fuente como `__API_BASE_URL__`.

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
cp .env.example .env   # Editar con la URL del backend

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` por defecto.

---

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Genera el bundle de producción en `dist/` |
| `npm run preview` | Sirve el build de producción localmente |

---

## Módulos principales

### Capa API

Ubicada en `src/api/`. Provee una abstracción sobre `fetch` para comunicarse con el backend.

**`client.ts`** — Cliente HTTP base. Expone métodos `get`, `post`, `put` y `del` que construyen la URL a partir de `__API_BASE_URL__` y retornan la respuesta parseada como JSON.

**`licitaciones.ts`** — Obtiene la lista de licitaciones filtradas por familia y subfamilia. Maneja dos formatos de respuesta del backend: array directo o envuelto en `{ licitaciones: [] }`.

**`familias.ts`** — Carga la lista de familias y, dado un código de familia, carga sus subfamilias.

**`config.ts`** — Lee y escribe la preferencia de familia/subfamilia del usuario en el backend (`GET /config` y `PUT /config`).

**`emailConfig.ts`** — Gestiona las direcciones de email registradas para notificaciones (listar, agregar, eliminar).

**`notificaciones.ts`** — Carga las notificaciones recientes y el detalle de una notificación específica.

---

### Context global

**`src/app/context/AppContext.tsx`**

Provee el estado compartido de la aplicación a través de React Context. Es consumido por todos los componentes y hooks mediante `useAppContext`.

| Estado | Tipo | Descripción |
|---|---|---|
| `filters` | `FiltersState` | Filtros activos (búsqueda, tipo, fechas, plazo) |
| `setFilters` | función | Actualizador de filtros |
| `sidebarOpen` | `boolean` | Estado del sidebar (mobile) |
| `setSidebarOpen` | función | Toggle del sidebar |
| `selectedFamilia` | `Familia \| null` | Familia seleccionada actualmente |
| `selectedSubfamilia` | `Subfamilia \| null` | Subfamilia seleccionada actualmente |
| `setSelectedFamilia` | función | Cambia familia y persiste en backend |
| `setSelectedSubfamilia` | función | Cambia subfamilia y persiste en backend |

Al montar, `AppContext` llama a `GET /config` para restaurar la preferencia guardada del usuario.

---

### Hooks

**`useLicitaciones`** — Realiza el fetch de licitaciones cuando cambia `selectedFamilia` o `selectedSubfamilia`. Retorna `{ licitaciones, loading, error }`.

**`useFamilias`** — Gestiona la carga en cascada: primero carga la lista de familias, luego carga subfamilias automáticamente cuando se selecciona una familia. Retorna `{ familias, subfamilias, loadingFamilias, loadingSubfamilias }`.

**`useEmailConfig`** — Provee `{ emails, loading, addEmail, removeEmail }` para gestionar los destinatarios de notificaciones.

**`useNotificaciones`** — Carga las notificaciones de la última semana. Gestiona el estado de lectura en `localStorage` y el fetch del detalle bajo demanda.

**`useAppContext`** — Acceso tipado al `AppContext`. Lanza error si se usa fuera del `AppProvider`.

---

### Componentes

#### `MainPage`
Componente raíz de la interfaz. Orquesta el layout completo: invoca `useLicitaciones`, deriva los tipos de licitación disponibles de los datos, aplica los filtros activos en el cliente y renderiza `Header`, `Sidebar`, `Filters` y la grilla de `BidCard`.

El filtrado es **client-side**: no se realiza una nueva petición al backend al cambiar filtros; se filtra el array en memoria.

#### `Header`
Barra superior fija. Muestra el logo de Invenzis, el título de la vista activa y el ícono de campana que abre el `NotificationPanel`.

#### `Sidebar`
Panel lateral en escritorio / drawer deslizante en móvil. Contiene `FiltrosLicitaciones` y `NotificacionesEmail`.

#### `Filters`
Barra de filtros. En escritorio se muestra como una fila de pills con popovers para fechas. En móvil se convierte en un panel full-screen. Gestiona: búsqueda por texto, tipo de licitación, fecha de publicación, fecha de cierre y plazo de urgencia.

#### `BidCard`
Tarjeta de licitación individual. Muestra: título, descripción, familia, fechas, tipo, badge de urgencia (rojo < 48 h, naranja < 96 h, verde ≥ 96 h) y enlace al sitio oficial.

#### `FiltrosLicitaciones`
Selector en cascada familia → subfamilia. Al cambiar la familia, limpia la subfamilia y lanza la carga de subfamilias correspondientes.

#### `NotificacionesEmail`
Formulario para agregar y lista con botón para eliminar emails registrados como destinatarios de notificaciones.

#### `NotificationPanel`
Panel flotante accionado desde la campana del header. Lista las notificaciones de la última semana. Al hacer click en una notificación carga su detalle mediante `GET /notificacion/{id}` y la marca como leída en `localStorage`.

---

## Endpoints del backend

La URL base se configura mediante la variable `API_BASE_URL`.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/familias` | Lista de familias disponibles |
| `GET` | `/subfamilias/familia/{fami_cod}` | Subfamilias de una familia |
| `GET` | `/licitaciones` | Licitaciones (params: `familia`, `subfamilia`) |
| `GET` | `/config` | Preferencia de familia/subfamilia del usuario |
| `PUT` | `/config` | Guardar preferencia de familia/subfamilia |
| `GET` | `/email` | Lista de emails registrados |
| `POST` | `/email` | Registrar un email |
| `DELETE` | `/email/{emailAddress}` | Eliminar un email |
| `GET` | `/notificacion` | Notificaciones recientes (últimos 7 días) |
| `GET` | `/notificacion/{id}` | Detalle de una notificación |

---

## Despliegue

### Con Docker (local)

```bash
docker build \
  --build-arg API_BASE_URL=https://<dominio-del-backend> \
  -t invenzis-frontend .

docker run -p 8080:8080 invenzis-frontend
```

### Cloud Build + Cloud Run (CI/CD automático)

El archivo `cloudbuild.yml` define el pipeline:

1. **Build** — Construye la imagen Docker pasando `API_BASE_URL` como build arg.
2. **Push** — Sube la imagen a Google Artifact Registry.
3. **Deploy** — Despliega en Cloud Run en la región `us-east1`.

El servidor web es **Nginx** con configuración para SPA: todas las rutas se redirigen a `index.html` para que React Router pueda manejarlas en el cliente.

---

*Proyecto desarrollado para Invenzis — Reto Summer PDE 2026.*
