import { useRef, useEffect, useState } from "react";
import { useFamilias } from "../hooks/useFamilias";
import { useAppContext } from "../context/AppContext";

interface FiltrosLicitacionesProps {
  onClose?: () => void;
}

export default function FiltrosLicitaciones({
  onClose,
}: FiltrosLicitacionesProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    familiaCod: ctxFamiliaCod,
    subfamiliaCod: ctxSubfamiliaCod,
    setFiltrosCascada,
  } = useAppContext();

  const {
    familias,
    subfamilias,
    familiaCod,
    subfamiliaCod,
    setFamiliaCod,
    setSubfamiliaCod,
    loadingFamilias,
    loadingSubfamilias,
    error: famError,
  } = useFamilias();

  // Refs inicializados desde el contexto (última selección confirmada)
  const initialFamiliaCod = useRef(ctxFamiliaCod);
  const initialSubfamiliaCod = useRef(ctxSubfamiliaCod);

  // Al montar, restaurar la selección guardada en el contexto
  const pendingSubfamilia = useRef<string | null>(ctxSubfamiliaCod);
  useEffect(() => {
    if (ctxFamiliaCod) {
      setFamiliaCod(ctxFamiliaCod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Una vez que cargaron las subfamilias, restaurar la subfamilia pendiente
  useEffect(() => {
    if (
      !loadingSubfamilias &&
      pendingSubfamilia.current &&
      subfamilias.length > 0
    ) {
      setSubfamiliaCod(pendingSubfamilia.current);
      pendingSubfamilia.current = null;
    }
  }, [loadingSubfamilias, subfamilias, setSubfamiliaCod]);

  const hasChanges =
    familiaCod !== initialFamiliaCod.current ||
    subfamiliaCod !== initialSubfamiliaCod.current;

  const handleConfirm = () => {
    if (!hasChanges) return;
    setFiltrosCascada(familiaCod, subfamiliaCod);
    initialFamiliaCod.current = familiaCod;
    initialSubfamiliaCod.current = subfamiliaCod;
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col">
      {/* Header clickeable para colapsar/expandir */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-start justify-between w-full text-left hover:bg-slate-50 rounded-lg transition-colors"
      >
        <div className="flex-1 min-w-0 mr-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Filtros de Licitaciones
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Selecciona una familia y subfamilia para filtrar las licitaciones
            que deseas monitorear
          </p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transform transition-transform shrink-0 mt-0.5 ${isExpanded ? "rotate-180" : "rotate-0"}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Contenido colapsable */}
      {isExpanded && (
        <div className="flex flex-col gap-4 mt-4">
          {/* Selectores */}
          <div className="flex flex-col gap-4">
            {/* Familia */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="familia"
                className="text-xs sm:text-sm font-medium text-slate-700"
              >
                Familia
              </label>
              <div className="relative">
                <select
                  id="familia"
                  value={familiaCod ?? ""}
                  onChange={(e) => setFamiliaCod(e.target.value || null)}
                  disabled={loadingFamilias}
                  className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingFamilias ? "Cargando..." : "Seleccionar familia..."}
                  </option>
                  {familias.map((f) => (
                    <option key={f.cod} value={String(f.cod)}>
                      {f.descripcion}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
              {famError && <p className="text-xs text-red-500">{famError}</p>}
            </div>

            {/* Subfamilia */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="subfamilia"
                className="text-xs sm:text-sm font-medium text-slate-700"
              >
                Subfamilia
              </label>
              <div className="relative">
                <select
                  id="subfamilia"
                  value={subfamiliaCod ?? ""}
                  onChange={(e) => setSubfamiliaCod(e.target.value || null)}
                  disabled={!familiaCod || loadingSubfamilias}
                  className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  <option value="">
                    {loadingSubfamilias
                      ? "Cargando..."
                      : "Seleccionar subfamilia..."}
                  </option>
                  {subfamilias.map((sf) => (
                    <option key={sf.cod} value={String(sf.cod)}>
                      {sf.descripcion}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Botón confirmar configuración */}
          <div className="mt-4">
            <button
              onClick={handleConfirm}
              disabled={!hasChanges}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${
                hasChanges
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Confirmar configuración
            </button>
          </div>

          {/* Aviso cambios pendientes */}
          {hasChanges && (
            <div className="flex gap-3 bg-amber-50 border border-amber-300 rounded-lg px-4 py-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-amber-500 mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-amber-700">
                  Cambios pendientes
                </p>
                <p className="text-xs text-amber-600 leading-relaxed">
                  Los cambios no se han aplicado aún. Presiona "Confirmar
                  configuración" para guardarlos.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
