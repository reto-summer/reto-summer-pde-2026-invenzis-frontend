/**
 * Filtros del Radar de Licitaciones.
 * Desktop: barra con pills. "Fecha" abre un popover con dos mini-calendarios.
 * Móvil: botón "Filtrar" que abre un panel full-screen con date inputs nativos.
 */

import { useState, useRef, useEffect } from "react";
import type { ChangeEvent } from "react";
import type { FiltersState, DateRangeKey } from "../types/filters";
import { DATE_RANGE_LABELS, DEFAULT_FILTERS } from "../types/filters";

interface FiltersProps {
  value: FiltersState;
  onChange: (filters: FiltersState) => void;
  /** Tipos de licitación disponibles, derivados dinámicamente del backend */
  availableTipos?: string[];
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
    </svg>
  );
}

function CalendarIcon({ className = "w-4 h-4 shrink-0" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatShort(iso: string): string {
  const date = iso.split("T")[0];
  const parts = date.split("-");
  if (parts.length < 3) return "";
  return `${parts[2]}/${parts[1]}`;
}

function buildDatetime(date: string, time: string): string {
  if (!date) return "";
  return `${date}T${time}:00`;
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS_ES   = ["L","M","X","J","V","S","D"];

// ─── MiniCalendar ─────────────────────────────────────────────────────────────

function MiniCalendar({
  label,
  selected,
  rangeStart,
  rangeEnd,
  onSelect,
  initYear,
  initMonth,
}: {
  label: string;
  selected: string;
  rangeStart: string;
  rangeEnd: string;
  onSelect: (date: string) => void;
  initYear: number;
  initMonth: number;
}) {
  const [viewYear, setViewYear] = useState(initYear);
  const [viewMonth, setViewMonth] = useState(initMonth);

  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const daysInMonth   = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayRaw   = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const firstDayMon   = (firstDayRaw + 6) % 7; // 0=Mon

  const cells: (number | null)[] = [
    ...Array(firstDayMon).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  return (
    <div className="flex flex-col gap-2 w-[200px]">
      {/* Label */}
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</span>

      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={prevMonth} className="p-1 rounded-md hover:bg-slate-100 text-slate-500 transition-all focus:outline-none">
          <ChevronLeft />
        </button>
        <span className="text-sm font-semibold text-slate-900 select-none">
          {MONTHS_ES[viewMonth]} {viewYear}
        </span>
        <button type="button" onClick={nextMonth} className="p-1 rounded-md hover:bg-slate-100 text-slate-500 transition-all focus:outline-none">
          <ChevronRight />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7">
        {DAYS_ES.map((d, i) => (
          <div key={i} className="h-7 flex items-center justify-center text-xs font-medium text-slate-400 select-none">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="h-8" />;
          const dateStr = toDateStr(viewYear, viewMonth, day);
          const isSelected   = selected === dateStr;
          const isToday      = dateStr === todayStr;
          const inRange      = rangeStart && rangeEnd && dateStr > rangeStart && dateStr < rangeEnd;
          const isRangeStart = rangeStart && dateStr === rangeStart && rangeEnd;
          const isRangeEnd   = rangeEnd   && dateStr === rangeEnd   && rangeStart;

          return (
            <div key={i} className={`h-8 flex items-center justify-center
              ${inRange      ? "bg-blue-50" : ""}
              ${isRangeStart ? "bg-blue-50 rounded-l-full" : ""}
              ${isRangeEnd   ? "bg-blue-50 rounded-r-full" : ""}
            `}>
              <button
                type="button"
                onClick={() => onSelect(dateStr)}
                className={`w-8 h-8 flex items-center justify-center text-sm rounded-full transition-all focus:outline-none
                  ${isSelected
                    ? "bg-blue-600 text-white font-semibold"
                    : isToday
                    ? "border border-blue-400 text-blue-600 font-medium hover:bg-blue-50"
                    : "text-slate-700 hover:bg-slate-100"
                  }`}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function CheckIcon({ checked }: { checked: boolean }) {
  if (!checked) return <span className="w-4 h-4 rounded border border-slate-300 bg-white shrink-0" />;
  return (
    <span className="w-4 h-4 rounded border-2 border-blue-600 bg-blue-600 flex items-center justify-center shrink-0">
      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
        <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
      </svg>
    </span>
  );
}

function FilterChip({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-all
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
        ${checked
          ? "bg-slate-100 border-slate-200 text-slate-900"
          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
        }`}
    >
      <CheckIcon checked={checked} />
      <span>{label}</span>
    </button>
  );
}

const inputClass    = "w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all";
const labelClass    = "text-xs font-medium text-slate-500";

// ─── PlazoPill — single-select dropdown: Hoy / <7 / 7-15 / >15 ──────────────

function PlazoPill({ value, onChange }: { value: FiltersState; onChange: (f: FiltersState) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function selectRange(key: DateRangeKey) {
    // single-select: toggle off if already selected, otherwise select only this one
    const next = value.dateRanges.includes(key) ? [] : [key];
    onChange({ ...value, dateRanges: next });
    setOpen(false);
  }

  const isActive   = value.dateRanges.length > 0;
  const pillLabel  = value.dateRanges.length === 1 ? DATE_RANGE_LABELS[value.dateRanges[0]] : "Hoy";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-all
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
          ${isActive
            ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          }`}
      >
        <CalendarIcon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
        <span>{pillLabel}</span>
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-xl border border-slate-200 py-1 min-w-[140px]">
          {(Object.keys(DATE_RANGE_LABELS) as DateRangeKey[]).map((key) => {
            const isSelected = value.dateRanges.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => selectRange(key)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-all hover:bg-slate-50 focus:outline-none
                  ${isSelected ? "text-blue-600 font-semibold" : "text-slate-700"}`}
              >
                <span>{DATE_RANGE_LABELS[key]}</span>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Shared popover actions ───────────────────────────────────────────────────

function PopoverActions({ onClear, onApply }: { onClear: () => void; onApply: () => void }) {
  return (
    <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
      <button
        type="button"
        onClick={onClear}
        className="py-1.5 px-3 rounded-md border border-red-500 bg-white text-red-500 text-xs font-semibold hover:bg-red-50 transition-all focus:outline-none"
      >
        Limpiar
      </button>
      <button
        type="button"
        onClick={onApply}
        className="py-1.5 px-3 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all focus:outline-none"
      >
        Aplicar
      </button>
    </div>
  );
}

// ─── PublicacionPill ──────────────────────────────────────────────────────────

function PublicacionPill({ value, onChange }: { value: FiltersState; onChange: (f: FiltersState) => void }) {
  const [open, setOpen] = useState(false);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function handleOpen() {
    setDesde(value.fechaPublicacionDesde ?? "");
    setHasta(value.fechaPublicacionHasta ?? "");
    setOpen(true);
  }

  function handleApply() {
    onChange({ ...value, fechaPublicacionDesde: desde, fechaPublicacionHasta: hasta });
    setOpen(false);
  }

  function handleClear() {
    setDesde(""); setHasta("");
    onChange({ ...value, fechaPublicacionDesde: "", fechaPublicacionHasta: "" });
    setOpen(false);
  }

  const isActive = !!value.fechaPublicacionDesde || !!value.fechaPublicacionHasta;
  let pillLabel = "Publicación";
  if (isActive) {
    const f = formatShort(value.fechaPublicacionDesde ?? "");
    const t = formatShort(value.fechaPublicacionHasta ?? "");
    pillLabel = f && t ? `Pub. ${f} → ${t}` : f ? `Pub. desde ${f}` : `Pub. hasta ${t}`;
  }

  const today = new Date();
  const desdeInit    = desde ? new Date(desde + "T12:00:00") : today;
  const hastaInitRaw = hasta ? new Date(hasta + "T12:00:00") : new Date(desdeInit.getFullYear(), desdeInit.getMonth() + 1, 1);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleOpen}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-all
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
          ${isActive
            ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          }`}
      >
        <CalendarIcon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
        <span>{pillLabel}</span>
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-lg shadow-xl border border-slate-200 p-5 flex flex-col gap-4 w-auto">
          <div className="flex gap-6">
            <MiniCalendar
              label="Desde"
              selected={desde}
              rangeStart={desde}
              rangeEnd={hasta}
              onSelect={setDesde}
              initYear={desdeInit.getFullYear()}
              initMonth={desdeInit.getMonth()}
            />
            <div className="w-px bg-slate-200 self-stretch" />
            <MiniCalendar
              label="Hasta"
              selected={hasta}
              rangeStart={desde}
              rangeEnd={hasta}
              onSelect={setHasta}
              initYear={hastaInitRaw.getFullYear()}
              initMonth={hastaInitRaw.getMonth()}
            />
          </div>
          <PopoverActions onClear={handleClear} onApply={handleApply} />
        </div>
      )}
    </div>
  );
}

// ─── CierrePill ───────────────────────────────────────────────────────────────

function CierrePill({ value, onChange }: { value: FiltersState; onChange: (f: FiltersState) => void }) {
  const [open, setOpen]         = useState(false);
  const [desde, setDesde]       = useState("");
  const [hasta, setHasta]       = useState("");
  const [horaDesde, setHoraDesde] = useState("00:00");
  const [horaHasta, setHoraHasta] = useState("23:59");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function handleOpen() {
    setDesde(value.fechaCierreDesde?.split("T")[0] ?? "");
    setHasta(value.fechaCierreHasta?.split("T")[0] ?? "");
    setHoraDesde(value.fechaCierreDesde?.split("T")[1]?.slice(0, 5) ?? "00:00");
    setHoraHasta(value.fechaCierreHasta?.split("T")[1]?.slice(0, 5) ?? "23:59");
    setOpen(true);
  }

  function handleApply() {
    onChange({
      ...value,
      fechaCierreDesde: desde ? buildDatetime(desde, horaDesde) : "",
      fechaCierreHasta: hasta ? buildDatetime(hasta, horaHasta) : "",
    });
    setOpen(false);
  }

  function handleClear() {
    setDesde(""); setHasta("");
    setHoraDesde("00:00"); setHoraHasta("23:59");
    onChange({ ...value, fechaCierreDesde: "", fechaCierreHasta: "" });
    setOpen(false);
  }

  const isActive = !!value.fechaCierreDesde || !!value.fechaCierreHasta;
  let pillLabel = "Cierre";
  if (isActive) {
    const f = formatShort(value.fechaCierreDesde ?? "");
    const t = formatShort(value.fechaCierreHasta ?? "");
    pillLabel = f && t ? `Cierre ${f} → ${t}` : f ? `Cierre desde ${f}` : `Cierre hasta ${t}`;
  }

  const today = new Date();
  const desdeInit    = desde ? new Date(desde + "T12:00:00") : today;
  const hastaInitRaw = hasta ? new Date(hasta + "T12:00:00") : new Date(desdeInit.getFullYear(), desdeInit.getMonth() + 1, 1);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleOpen}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-all
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
          ${isActive
            ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          }`}
      >
        <CalendarIcon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
        <span>{pillLabel}</span>
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-lg shadow-xl border border-slate-200 p-5 flex flex-col gap-4 w-auto">
          <div className="flex gap-6">
            <MiniCalendar
              label="Desde"
              selected={desde}
              rangeStart={desde}
              rangeEnd={hasta}
              onSelect={setDesde}
              initYear={desdeInit.getFullYear()}
              initMonth={desdeInit.getMonth()}
            />
            <div className="w-px bg-slate-200 self-stretch" />
            <MiniCalendar
              label="Hasta"
              selected={hasta}
              rangeStart={desde}
              rangeEnd={hasta}
              onSelect={setHasta}
              initYear={hastaInitRaw.getFullYear()}
              initMonth={hastaInitRaw.getMonth()}
            />
          </div>
          <div className="flex gap-4 pt-1 border-t border-slate-100">
            <div className="flex flex-col gap-1 flex-1">
              <label className={labelClass}>Hora desde</label>
              <input type="time" value={horaDesde} onChange={(e) => setHoraDesde(e.target.value)} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className={labelClass}>Hora hasta</label>
              <input type="time" value={horaHasta} onChange={(e) => setHoraHasta(e.target.value)} className={inputClass} />
            </div>
          </div>
          <PopoverActions onClear={handleClear} onApply={handleApply} />
        </div>
      )}
    </div>
  );
}

// ─── TipoPill — multi-select dropdown de tipos de licitación ─────────────────

function TipoIcon({ className = "w-4 h-4 shrink-0" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function TipoPill({
  value,
  onChange,
  availableTipos,
}: {
  value: FiltersState;
  onChange: (f: FiltersState) => void;
  availableTipos: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function toggleTipo(tipo: string) {
    const next = value.tenderTypes.includes(tipo)
      ? value.tenderTypes.filter((t) => t !== tipo)
      : [...value.tenderTypes, tipo];
    onChange({ ...value, tenderTypes: next });
  }

  const isActive = value.tenderTypes.length > 0;
  const pillLabel =
    value.tenderTypes.length === 1
      ? value.tenderTypes[0]
      : value.tenderTypes.length > 1
      ? `Tipo (${value.tenderTypes.length})`
      : "Tipo";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-all
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
          ${isActive
            ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          }`}
      >
        <TipoIcon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
        <span>{pillLabel}</span>
      </button>

      {open && availableTipos.length > 0 && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-xl border border-slate-200 py-1 w-[240px]">
          {availableTipos.map((tipo) => {
            const isSelected = value.tenderTypes.includes(tipo);
            return (
              <button
                key={tipo}
                type="button"
                onClick={() => toggleTipo(tipo)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all hover:bg-slate-50 focus:outline-none text-left"
              >
                <CheckIcon checked={isSelected} />
                <span className={isSelected ? "text-blue-600 font-semibold" : "text-slate-700"}>{tipo}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Filters component ───────────────────────────────────────────────────

export function Filters({ value, onChange, availableTipos = [] }: FiltersProps) {
  const [mobileOpen, setMobileOpen]           = useState(false);
  const [mobileFechaMode, setMobileFechaMode] = useState<"publicacion" | "cierre">("publicacion");

  // Local state for mobile panel — only applied when user presses "Aplicar"
  const [mobileFilters, setMobileFilters] = useState<FiltersState>(value);
  const mobileOriginal                    = useRef<FiltersState>(value);

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

  const mobileToggleDateRange = (key: DateRangeKey) =>
    setMobileFilters((f) => {
      const next = f.dateRanges.includes(key)
        ? f.dateRanges.filter((d) => d !== key)
        : [...f.dateRanges, key];
      return { ...f, dateRanges: next };
    });

  // ── Desktop derived ──
  const hasActiveDateFilter =
    !!value.fechaPublicacionDesde || !!value.fechaPublicacionHasta ||
    !!value.fechaCierreDesde      || !!value.fechaCierreHasta;

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

  const mobileInputClass = "w-full px-3 py-2.5 rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all";

  return (
    <>
      {/* ── MOBILE: botón "Filtrar" ── */}
      <section className="md:hidden w-full border-y border-slate-200 bg-white" aria-label="Filtros de licitaciones">
        <div className="px-4 py-3 flex items-center gap-3">
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
        </div>
      </section>

      {/* ── MOBILE: panel full-screen ── */}
      {mobileOpen && (
        <div className="fixed top-20 left-0 right-0 bottom-0 z-50 bg-white flex flex-col md:hidden border-t border-slate-200">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 shrink-0">
            <button type="button" onClick={() => setMobileOpen(false)} className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all rounded-md" aria-label="Volver">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-slate-900">Filtros</h2>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
            {/* Búsqueda */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Búsqueda</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center"><SearchIcon /></span>
                <input type="search" value={mobileFilters.search} onChange={(e: ChangeEvent<HTMLInputElement>) => mobileHandleSearch(e.target.value)} placeholder="Buscar licitaciones..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-md border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all"
                  aria-label="Buscar licitaciones" />
              </div>
            </div>

            {/* Tipo de licitación */}
            {availableTipos.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Tipo de licitación</label>
                <div className="flex flex-col gap-2">
                  {availableTipos.map((tipo) => (
                    <FilterChip key={tipo} label={tipo} checked={mobileFilters.tenderTypes.includes(tipo)} onToggle={() => mobileToggleTenderType(tipo)} />
                  ))}
                </div>
              </div>
            )}

            {/* Plazo de cierre */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Plazo de cierre</label>
              <div className="flex flex-col gap-2">
                {(Object.keys(DATE_RANGE_LABELS) as DateRangeKey[]).map((key) => (
                  <FilterChip key={key} label={DATE_RANGE_LABELS[key]} checked={mobileFilters.dateRanges.includes(key)} onToggle={() => mobileToggleDateRange(key)} />
                ))}
              </div>
            </div>

            {/* Fecha — toggle + date inputs nativos */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Fecha</label>
              <div className="flex rounded-md border border-slate-200 overflow-hidden text-sm font-medium">
                {(["publicacion", "cierre"] as const).map((m) => (
                  <button key={m} type="button" onClick={() => setMobileFechaMode(m)}
                    className={`flex-1 py-2 transition-all focus:outline-none ${mobileFechaMode === m ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                    {m === "publicacion" ? "Publicación" : "Cierre"}
                  </button>
                ))}
              </div>

              {mobileFechaMode === "publicacion" && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Desde</label>
                    <input type="date" value={mobileFilters.fechaPublicacionDesde ?? ""} onChange={(e) => setMobileFilters((f) => ({ ...f, fechaPublicacionDesde: e.target.value }))} className={mobileInputClass} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Hasta</label>
                    <input type="date" value={mobileFilters.fechaPublicacionHasta ?? ""} onChange={(e) => setMobileFilters((f) => ({ ...f, fechaPublicacionHasta: e.target.value }))} className={mobileInputClass} />
                  </div>
                </div>
              )}

              {mobileFechaMode === "cierre" && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Desde</label>
                    <input type="date" value={mobileFilters.fechaCierreDesde?.split("T")[0] ?? ""} onChange={(e) => setMobileFilters((f) => ({ ...f, fechaCierreDesde: buildDatetime(e.target.value, f.fechaCierreDesde?.split("T")[1]?.slice(0, 5) ?? "00:00") }))} className={mobileInputClass} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Hasta</label>
                    <input type="date" value={mobileFilters.fechaCierreHasta?.split("T")[0] ?? ""} onChange={(e) => setMobileFilters((f) => ({ ...f, fechaCierreHasta: buildDatetime(e.target.value, f.fechaCierreHasta?.split("T")[1]?.slice(0, 5) ?? "23:59") }))} className={mobileInputClass} />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className={labelClass}>Hora desde</label>
                      <input type="time" value={mobileFilters.fechaCierreDesde?.split("T")[1]?.slice(0, 5) ?? "00:00"} onChange={(e) => setMobileFilters((f) => ({ ...f, fechaCierreDesde: buildDatetime(f.fechaCierreDesde?.split("T")[0] ?? "", e.target.value) }))} className={mobileInputClass} />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <label className={labelClass}>Hora hasta</label>
                      <input type="time" value={mobileFilters.fechaCierreHasta?.split("T")[1]?.slice(0, 5) ?? "23:59"} onChange={(e) => setMobileFilters((f) => ({ ...f, fechaCierreHasta: buildDatetime(f.fechaCierreHasta?.split("T")[0] ?? "", e.target.value) }))} className={mobileInputClass} />
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
                onClick={() => { onChange(mobileFilters); setMobileOpen(false); }}
                className="flex-1 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all"
              >
                Aplicar
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── DESKTOP: barra completa ── */}
      <section className="hidden md:block w-full border-y border-slate-200 bg-white" aria-label="Filtros de licitaciones">
        <div className="px-6 py-3">
          <div className="flex flex-row flex-wrap items-center gap-3">
            {/* Búsqueda */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center"><SearchIcon /></span>
              <input type="search" value={value.search} onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)} placeholder="Buscar licitaciones..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all"
                aria-label="Buscar licitaciones" />
            </div>

            {/* Tipo de licitación */}
            <TipoPill value={value} onChange={onChange} availableTipos={availableTipos} />

            {/* Plazo de cierre — pill desplegable */}
            <PlazoPill value={value} onChange={onChange} />

            {/* Fecha publicación y cierre — pills independientes */}
            <PublicacionPill value={value} onChange={onChange} />
            <CierrePill value={value} onChange={onChange} />

            {/* Limpiar filtros */}
            <button
              type="button"
              onClick={handleClear}
              disabled={!hasActiveFilters}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-all shrink-0
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
                ${hasActiveFilters
                  ? "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
                  : "bg-white border-slate-100 text-slate-300 cursor-not-allowed"
                }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l5 5m0-5l-5 5" />
              </svg>
              Limpiar filtros
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
