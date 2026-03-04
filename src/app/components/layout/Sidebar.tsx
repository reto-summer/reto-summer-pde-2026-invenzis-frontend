/**
 * Componente Sidebar — Panel lateral de configuración.
 *
 * Contiene dos secciones colapsables:
 * 1. `FiltrosLicitaciones`: selección de familia y subfamilia activa.
 * 2. `NotificacionesEmail`: gestión de emails para notificaciones diarias.
 *
 * En móvil muestra un overlay semitransparente que cierra el panel al tocarlo.
 * En desktop se fija a la izquierda desplazando el contenido principal.
 */

import FiltrosLicitaciones from "./FiltrosLicitaciones";
import NotificacionesEmail from "./NotificacionesEmail";

/** Props del componente Sidebar. */
interface SidebarProps {
  /** Callback invocado al cerrar el panel (botón "atrás" o tap en el overlay móvil). */
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps = {}) {
  return (
    <>
      {/* Overlay para móvil */}
      {onClose && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className="inset-x-0 sm:right-auto sm:w-[400px] h-screen bg-white px-6 py-6 flex flex-col fixed left-0 top-0 z-40 shadow-2xl border-r border-slate-200 text-slate-900">
        {/* Header - Título principal */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Cerrar menú"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Configuración
            </h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-8 overflow-y-auto no-scrollbar pb-4 px-1">
          {/* Sección 1: Filtros de Licitaciones */}
          <FiltrosLicitaciones onClose={onClose} />

          {/* Sección 2: Notificaciones por Email */}
          <NotificacionesEmail />
        </div>
      </aside>
    </>
  );
}
