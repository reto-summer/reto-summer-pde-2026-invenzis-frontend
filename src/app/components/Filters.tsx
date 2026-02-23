/**
 * Filtros del Radar de Licitaciones: búsqueda por texto, tipo de licitación
 * y rango de días hasta el cierre. Componente controlado (value/onChange).
 * Móvil: botón "Filtrar" que abre un panel full-screen.
 * Desktop: barra completa con todos los filtros visibles.
 */

import { useState } from "react";
import type { ChangeEvent } from "react";
import type { FiltersState, TenderTypeKey, DateRangeKey } from "../types/filters";
import {
  TENDER_TYPE_LABELS,
  DATE_RANGE_LABELS,
  DEFAULT_FILTERS,
} from "../types/filters";

interface FiltersProps {
  value: FiltersState;
  onChange: (filters: FiltersState) => void;
}

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

function FilterIcon() {
  return (
    <svg
      className="size-4 shrink-0"
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
    </svg>
  );
}

function CheckIcon({ checked }: { checked: boolean }) {
  const baseClass = "size-3.5 md:size-4 rounded border md:border-2 shrink-0";
  if (!checked) {
    return <span className={`${baseClass} border-slate-300 bg-white`} />;
  }
  return (
    <span className={`${baseClass} border-blue-600 bg-blue-600 flex items-center justify-center`}>
      <svg className="size-2 md:size-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
        <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
      </svg>
    </span>
  );
}

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

export function Filters({ value, onChange }: FiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const activeCount =
    (value.search !== "" ? 1 : 0) +
    (3 - value.tenderTypes.length) +
    value.dateRanges.length;

  return (
    <>
      {/* ── MOBILE: botón "Filtrar" ── */}
      <section
        className="md:hidden w-full border-y border-slate-200 bg-white"
        aria-label="Filtros de licitaciones"
      >
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
              transition-all"
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
              className="px-4 py-2 rounded-md border border-red-500 bg-white text-red-500 text-sm font-semibold
                hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1
                transition-all"
            >
              Limpiar
            </button>
          )}
        </div>
      </section>

      {/* ── MOBILE: panel full-screen ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col md:hidden">
          {/* Header del panel */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 shrink-0">
            <h2 className="text-lg font-bold text-slate-900">Filtros</h2>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Cerrar filtros"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          {/* Contenido del panel */}
          <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6">
            {/* Búsqueda */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Búsqueda</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  value={value.search}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
                  placeholder="Buscar licitaciones..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-md border border-slate-200 bg-white text-slate-900
                    placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
                    focus:border-blue-300 transition-all"
                  aria-label="Buscar licitaciones"
                />
              </div>
            </div>

            {/* Tipo de licitación */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tipo de licitación</label>
              <div className="flex flex-col gap-2">
                {(Object.keys(TENDER_TYPE_LABELS) as TenderTypeKey[]).map((key) => (
                  <FilterChip
                    key={key}
                    label={TENDER_TYPE_LABELS[key]}
                    checked={value.tenderTypes.includes(key)}
                    onToggle={() => toggleTenderType(key)}
                  />
                ))}
              </div>
            </div>

            {/* Plazo de cierre */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Plazo de cierre</label>
              <div className="flex flex-col gap-2">
                {(Object.keys(DATE_RANGE_LABELS) as DateRangeKey[]).map((key) => (
                  <FilterChip
                    key={key}
                    label={DATE_RANGE_LABELS[key]}
                    checked={value.dateRanges.includes(key)}
                    onToggle={() => toggleDateRange(key)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer del panel */}
          <div className="px-4 py-4 border-t border-slate-200 flex gap-3 shrink-0">
            <button
              type="button"
              onClick={handleClear}
              disabled={!hasActiveFilters}
              className="flex-1 py-2.5 rounded-md border border-red-500 bg-white text-red-500 text-sm font-semibold
                hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex-1 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold
                hover:bg-blue-700 transition-all"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      {/* ── DESKTOP: barra completa ── */}
      <section
        className="hidden md:block w-full border-y border-slate-200 bg-white py-4"
        aria-label="Filtros de licitaciones"
      >
        <div className="w-full px-6 py-4">
          <div className="flex flex-row flex-wrap items-center gap-4">
            {/* Búsqueda */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </span>
              <input
                type="search"
                value={value.search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
                placeholder="Buscar licitaciones..."
                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-slate-200 bg-slate-50 text-slate-900
                  placeholder:text-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-400
                  focus:border-blue-300 transition-all"
                aria-label="Buscar licitaciones"
              />
            </div>

            {/* Tipo de licitación */}
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(TENDER_TYPE_LABELS) as TenderTypeKey[]).map((key) => (
                <FilterChip
                  key={key}
                  label={TENDER_TYPE_LABELS[key]}
                  checked={value.tenderTypes.includes(key)}
                  onToggle={() => toggleTenderType(key)}
                />
              ))}
            </div>

            {/* Plazo de cierre */}
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(DATE_RANGE_LABELS) as DateRangeKey[]).map((key) => (
                <FilterChip
                  key={key}
                  label={DATE_RANGE_LABELS[key]}
                  checked={value.dateRanges.includes(key)}
                  onToggle={() => toggleDateRange(key)}
                />
              ))}
            </div>

            {/* Limpiar */}
            <button
              type="button"
              onClick={handleClear}
              disabled={!hasActiveFilters}
              className="w-auto px-4 py-2.5 rounded-md border border-red-500 bg-white text-red-500
                text-base font-semibold hover:bg-red-50
                focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1
                disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
            >
              Limpiar
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
