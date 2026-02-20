/**
 * Filtros del Radar de Licitaciones: búsqueda por texto, tipo de licitación
 * y rango de días hasta el cierre. Componente controlado (value/onChange).
 * Responsive: en móvil 3 filas compactas; en desktop una fila con wrap.
 */

import type { ChangeEvent } from "react";
import type { FiltersState, TenderTypeKey, DateRangeKey } from "../types/filters";
import {
  TENDER_TYPE_LABELS,
  DATE_RANGE_LABELS,
  DEFAULT_FILTERS,
} from "../types/filters";

/** Props: estado actual de filtros y callback para actualizarlo */
interface FiltersProps {
  value: FiltersState;
  onChange: (filters: FiltersState) => void;
}

/** Icono de lupa para el input de búsqueda (tamaño responsive) */
function SearchIcon() {
  return (
    <svg
      className="size-3.5 md:size-4 text-slate-400 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

/** Checkbox visual: vacío o marcado (azul), tamaño responsive */
function CheckIcon({ checked }: { checked: boolean }) {
  const baseClass = "size-3.5 md:size-4 rounded border md:border-2 shrink-0";
  if (!checked) {
    return (
      <span className={`${baseClass} border-slate-300 bg-white`} />
    );
  }
  return (
    <span className={`${baseClass} border-blue-600 bg-blue-600 flex items-center justify-center`}>
      <svg className="size-2 md:size-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
        <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
      </svg>
    </span>
  );
}

/** Chip tipo checkbox: etiqueta + estado marcado/no marcado; en móvil texto puede wrap */
function FilterChip({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2.5 rounded-md border text-sm md:text-base font-medium
        transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
        min-w-0 text-left
        ${checked
          ? "bg-slate-100 border-slate-200 text-slate-900"
          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
        }
      `}
    >
      <CheckIcon checked={checked} />
      <span className="whitespace-normal md:truncate">{label}</span>
    </button>
  );
}

/** Barra de filtros: búsqueda, tipos de licitación, plazos y botón Limpiar */
export function Filters({ value, onChange }: FiltersProps) {
  const handleSearchChange = (search: string) => {
    onChange({ ...value, search });
  };

  const toggleTenderType = (key: TenderTypeKey) => {
    const next = value.tenderTypes.includes(key)
      ? value.tenderTypes.filter((t) => t !== key)
      : [...value.tenderTypes, key];
    onChange({ ...value, tenderTypes: next });
  };

  const toggleDateRange = (key: DateRangeKey) => {
    const next = value.dateRanges.includes(key)
      ? value.dateRanges.filter((d) => d !== key)
      : [...value.dateRanges, key];
    onChange({ ...value, dateRanges: next });
  };

  const handleClear = () => {
    onChange(DEFAULT_FILTERS);
  };

  const hasActiveFilters =
    value.search !== "" ||
    value.tenderTypes.length !== 3 ||
    value.dateRanges.length > 0;

  return (
    <section
      className="w-full border-y border-slate-200 bg-white py-2 md:py-4"
      aria-label="Filtros de licitaciones"
    >
      {/* Móvil: 3 filas compactas. Desktop: una fila con tamaño normal */}
      <div className="w-full px-4 py-2 md:px-6 md:py-4">
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-4">
          {/* Fila 1 móvil: búsqueda a ancho completo */}
          <div className="relative w-full min-w-0 md:flex-1 md:min-w-[200px] md:max-w-md">
            <span className="pointer-events-none absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={value.search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
              placeholder="Buscar licitaciones..."
              className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-2.5 rounded-md border border-slate-200 bg-white shadow-sm
                text-slate-900 placeholder:text-slate-400 text-sm md:text-base
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 focus:border-blue-300
                transition-all md:bg-slate-50 md:shadow-none"
              aria-label="Buscar licitaciones"
            />
          </div>

          {/* Fila 2 móvil: filtros por tipo de licitación */}
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
            {(Object.keys(TENDER_TYPE_LABELS) as TenderTypeKey[]).map(
              (tenderTypeKey) => (
                <FilterChip
                  key={tenderTypeKey}
                  label={TENDER_TYPE_LABELS[tenderTypeKey]}
                  checked={value.tenderTypes.includes(tenderTypeKey)}
                  onToggle={() => toggleTenderType(tenderTypeKey)}
                />
              )
            )}
          </div>

          {/* Fila 3 móvil: plazos + botón Limpiar */}
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
            {(Object.keys(DATE_RANGE_LABELS) as DateRangeKey[]).map((dateRangeKey) => (
              <FilterChip
                key={dateRangeKey}
                label={DATE_RANGE_LABELS[dateRangeKey]}
                checked={value.dateRanges.includes(dateRangeKey)}
                onToggle={() => toggleDateRange(dateRangeKey)}
              />
            ))}
            <button
              type="button"
              onClick={handleClear}
              disabled={!hasActiveFilters}
              className="px-3 py-1.5 md:px-4 md:py-2.5 rounded-md border border-slate-200 bg-white text-slate-600
                text-sm md:text-base font-semibold hover:bg-slate-50 hover:border-slate-300
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200
                transition-all shrink-0"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
