import { useState, useRef, useEffect } from "react";
import { CalendarIcon } from "../ui/icons";
import { buildDatetime, dateOffset } from "../../utils/dateHelpers";

const PLAZO_OPTIONS = [
  { label: "Hoy", desde: 0, hasta: 0 },
  { label: "< 7", desde: 0, hasta: 6 },
  { label: "7-15", desde: 7, hasta: 15 },
  { label: "> 15", desde: 16, hasta: -1 },
] as const;

interface PlazoDropdownProps {
  onSelect: (desde: string, hasta: string) => void;
}

export function PlazoDropdown({ onSelect }: PlazoDropdownProps) {
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

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all focus:outline-none"
      >
        <CalendarIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
        Plazo
        <svg
          className="w-3 h-3 text-slate-400 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full mb-1 left-0 z-[60] bg-white rounded-lg shadow-xl border border-slate-200 py-1 min-w-[110px]">
          {PLAZO_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => {
                const desde = buildDatetime(dateOffset(opt.desde), "00:00");
                const hasta =
                  opt.hasta >= 0
                    ? buildDatetime(dateOffset(opt.hasta), "23:59", "59")
                    : "";
                onSelect(desde, hasta);
                setOpen(false);
              }}
              className="w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-all focus:outline-none text-left"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
