import { useState, useRef, useEffect } from "react";
import type { FiltersState } from "../types/filters";
import { TipoIcon, CheckIcon } from "../../../components/ui/icons";

interface TipoPillProps {
  value: FiltersState;
  onChange: (f: FiltersState) => void;
  availableTipos: string[];
}

export function TipoPill({ value, onChange, availableTipos }: TipoPillProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
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
          ${
            isActive
              ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          }`}
      >
        <TipoIcon
          className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`}
        />
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
                <span
                  className={
                    isSelected
                      ? "text-blue-600 font-semibold"
                      : "text-slate-700"
                  }
                >
                  {tipo}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
