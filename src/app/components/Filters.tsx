/**
 * Filtros del Radar de Licitaciones.
 * Desktop: barra con pills. "Fecha" abre un popover con dos mini-calendarios.
 * Móvil: botón "Filtrar" que abre un panel full-screen con date inputs nativos.
 */

import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import type { FiltersState } from "../types/filters";
import { DEFAULT_FILTERS } from "../types/filters";
import { SearchIcon, FilterIcon } from "./ui/icons";
import { FilterChip } from "./ui/FilterChip";
import { DatePill } from "./filters/DatePill";
import { TipoPill } from "./filters/TipoPill";
import { buildDatetime } from "../utils/dateHelpers";

interface FiltersProps {
  value: FiltersState;
  onChange: (filters: FiltersState) => void;
  /** Tipos de licitación disponibles, derivados dinámicamente del backend */
  availableTipos?: string[];
  expiredCount?: number;
  showExpired?: boolean;
  onToggleExpired?: () => void;
}

export function Filters({
  value,
  onChange,
  availableTipos = [],
  expiredCount = 0,
  showExpired = false,
  onToggleExpired,
}: FiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileFechaMode, setMobileFechaMode] = useState<
    "publicacion" | "cierre"
  >("publicacion");

  // Local state for mobile panel — only applied when user presses "Aplicar"
  const [mobileFilters, setMobileFilters] = useState<FiltersState>(value);
  const mobileOriginal = useRef<FiltersState>(value);

  function openMobilePanel() {
    mobileOriginal.current = value;
    setMobileFilters(value);
    setMobileOpen(true);
  }

  // ── Desktop handlers (apply immediately to parent) ──
  const handleSearchChange = (search: string) => onChange({ ...value, search });
  const handleClear = () => onChange(DEFAULT_FILTERS);

  // ── Mobile handlers (update local state only) ──
  const mobileHandleSearch = (search: string) =>
    setMobileFilters((f) => ({ ...f, search }));

  const mobileToggleTenderType = (key: string) =>
    setMobileFilters((f) => {
      const next = f.tenderTypes.includes(key)
        ? f.tenderTypes.filter((t) => t !== key)
        : [...f.tenderTypes, key];
      return { ...f, tenderTypes: next };
    });

  // ── Desktop derived ──
  const hasActiveDateFilter =
    !!value.fechaPublicacionDesde ||
    !!value.fechaPublicacionHasta ||
    !!value.fechaCierreDesde ||
    !!value.fechaCierreHasta;

  const hasActiveFilters =
    value.search !== "" ||
    value.tenderTypes.length > 0 ||
    value.dateRanges.length > 0 ||
    hasActiveDateFilter;

  const activeCount =
    (value.search !== "" ? 1 : 0) +
    value.tenderTypes.length +
    value.dateRanges.length +
    (hasActiveDateFilter ? 1 : 0);

  // ── Mobile derived ──
  const mobileHasChanges =
    JSON.stringify(mobileFilters) !== JSON.stringify(mobileOriginal.current);

  const mobileInputClass =
    "w-full px-3 py-2.5 rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all";

  return (
    <>
      {/* ── MOBILE: botón "Filtrar" ── */}
      <section
        className="md:hidden w-full border-y border-slate-200 bg-white"
        aria-label="Filtros de licitaciones"
      >
        <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={openMobilePanel}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
          >
            <FilterIcon />
            Filtrar
            {activeCount > 0 && (
              <span className="bg-white text-blue-600 rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold leading-none">
                {activeCount}
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 rounded-md border border-red-500 bg-white text-red-500 text-sm font-semibold hover:bg-red-50 transition-all focus:outline-none"
            >
              Limpiar
            </button>
          )}
          {onToggleExpired && (
            <button
              type="button"
              onClick={onToggleExpired}
              disabled={expiredCount === 0 && !showExpired}
              className={`ml-auto text-sm font-medium rounded-md px-3 py-1.5 border transition-colors ${
                expiredCount > 0
                  ? "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                  : "text-slate-400 bg-slate-50 border-slate-200 cursor-not-allowed"
              }`}
            >
              {showExpired ? "Ver vigentes" : "Ver solo vencidas"} (
              {expiredCount})
            </button>
          )}
        </div>
      </section>

      {/* ── MOBILE: panel full-screen ── */}
      {mobileOpen && (
        <div className="fixed top-20 left-0 right-0 bottom-0 z-50 bg-white flex flex-col md:hidden border-t border-slate-200">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all rounded-md"
              aria-label="Volver"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-slate-900">Filtros</h2>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
            {/* Búsqueda */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Búsqueda
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  value={mobileFilters.search}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    mobileHandleSearch(e.target.value)
                  }
                  placeholder="Buscar licitaciones..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-md border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all"
                  aria-label="Buscar licitaciones"
                />
              </div>
            </div>

            {/* Tipo de licitación */}
            {availableTipos.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Tipo de licitación
                </label>
                <div className="flex flex-col gap-2">
                  {availableTipos.map((tipo) => (
                    <FilterChip
                      key={tipo}
                      label={tipo}
                      checked={mobileFilters.tenderTypes.includes(tipo)}
                      onToggle={() => mobileToggleTenderType(tipo)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Fecha — toggle + date inputs nativos */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Fecha
              </label>
              <div className="flex rounded-md border border-slate-200 overflow-hidden text-sm font-medium">
                {(["publicacion", "cierre"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMobileFechaMode(m)}
                    className={`flex-1 py-2 transition-all focus:outline-none ${mobileFechaMode === m ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                  >
                    {m === "publicacion" ? "Publicación" : "Cierre"}
                  </button>
                ))}
              </div>

              {mobileFechaMode === "publicacion" && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500">
                      Desde
                    </label>
                    <input
                      type="date"
                      value={
                        mobileFilters.fechaPublicacionDesde?.split("T")[0] ?? ""
                      }
                      onChange={(e) =>
                        setMobileFilters((f) => ({
                          ...f,
                          fechaPublicacionDesde: buildDatetime(
                            e.target.value,
                            "00:00",
                          ),
                        }))
                      }
                      className={mobileInputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500">
                      Hasta
                    </label>
                    <input
                      type="date"
                      value={
                        mobileFilters.fechaPublicacionHasta?.split("T")[0] ?? ""
                      }
                      onChange={(e) =>
                        setMobileFilters((f) => ({
                          ...f,
                          fechaPublicacionHasta: buildDatetime(
                            e.target.value,
                            "23:59",
                            "59",
                          ),
                        }))
                      }
                      className={mobileInputClass}
                    />
                  </div>
                </div>
              )}

              {mobileFechaMode === "cierre" && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500">
                      Desde
                    </label>
                    <input
                      type="date"
                      value={
                        mobileFilters.fechaCierreDesde?.split("T")[0] ?? ""
                      }
                      onChange={(e) =>
                        setMobileFilters((f) => ({
                          ...f,
                          fechaCierreDesde: buildDatetime(
                            e.target.value,
                            f.fechaCierreDesde?.split("T")[1]?.slice(0, 5) ??
                              "00:00",
                          ),
                        }))
                      }
                      className={mobileInputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500">
                      Hasta
                    </label>
                    <input
                      type="date"
                      value={
                        mobileFilters.fechaCierreHasta?.split("T")[0] ?? ""
                      }
                      onChange={(e) =>
                        setMobileFilters((f) => ({
                          ...f,
                          fechaCierreHasta: buildDatetime(
                            e.target.value,
                            f.fechaCierreHasta?.split("T")[1]?.slice(0, 5) ??
                              "23:59",
                            "59",
                          ),
                        }))
                      }
                      className={mobileInputClass}
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-xs font-medium text-slate-500">
                        Hora desde
                      </label>
                      <input
                        type="time"
                        value={
                          mobileFilters.fechaCierreDesde
                            ?.split("T")[1]
                            ?.slice(0, 5) ?? "00:00"
                        }
                        onChange={(e) =>
                          setMobileFilters((f) => ({
                            ...f,
                            fechaCierreDesde: buildDatetime(
                              f.fechaCierreDesde?.split("T")[0] ?? "",
                              e.target.value,
                            ),
                          }))
                        }
                        className={mobileInputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-xs font-medium text-slate-500">
                        Hora hasta
                      </label>
                      <input
                        type="time"
                        value={
                          mobileFilters.fechaCierreHasta
                            ?.split("T")[1]
                            ?.slice(0, 5) ?? "23:59"
                        }
                        onChange={(e) =>
                          setMobileFilters((f) => ({
                            ...f,
                            fechaCierreHasta: buildDatetime(
                              f.fechaCierreHasta?.split("T")[0] ?? "",
                              e.target.value,
                              "59",
                            ),
                          }))
                        }
                        className={mobileInputClass}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer: solo visible cuando hay cambios */}
          {mobileHasChanges && (
            <div className="px-6 py-4 border-t border-slate-200 flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setMobileFilters(DEFAULT_FILTERS)}
                className="flex-1 py-2.5 rounded-md border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(mobileFilters);
                  setMobileOpen(false);
                }}
                className="flex-1 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all"
              >
                Aplicar
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── DESKTOP: barra completa ── */}
      <section
        className="hidden md:block w-full border-y border-slate-200 bg-white"
        aria-label="Filtros de licitaciones"
      >
        <div className="px-6 py-3">
          <div className="flex flex-row flex-wrap items-center gap-3">
            {/* Búsqueda */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <SearchIcon />
              </span>
              <input
                type="search"
                value={value.search}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleSearchChange(e.target.value)
                }
                placeholder="Buscar licitaciones..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all"
                aria-label="Buscar licitaciones"
              />
            </div>

            {/* Tipo de licitación */}
            <TipoPill
              value={value}
              onChange={onChange}
              availableTipos={availableTipos}
            />

            {/* Fecha publicación y cierre — pills independientes */}
            <DatePill value={value} onChange={onChange} type="publicacion" />
            <DatePill value={value} onChange={onChange} type="cierre" />

            {/* Limpiar filtros */}
            <button
              type="button"
              onClick={handleClear}
              disabled={!hasActiveFilters}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-all shrink-0
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
                ${
                  hasActiveFilters
                    ? "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
                    : "bg-white border-slate-100 text-slate-300 cursor-not-allowed"
                }`}
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 15l5 5m0-5l-5 5"
                />
              </svg>
              Limpiar filtros
            </button>

            {onToggleExpired && (
              <button
                type="button"
                onClick={onToggleExpired}
                disabled={expiredCount === 0 && !showExpired}
                className={`ml-auto text-sm font-medium rounded-md px-3 py-1.5 border transition-colors ${
                  expiredCount > 0
                    ? "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                    : "text-slate-400 bg-slate-50 border-slate-200 cursor-not-allowed"
                }`}
              >
                {showExpired ? "Ver vigentes" : "Ver solo vencidas"} (
                {expiredCount})
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
