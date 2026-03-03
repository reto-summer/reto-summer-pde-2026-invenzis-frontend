import { useState, useRef, useEffect } from "react";
import type { FiltersState } from "../types/filters";
import { CalendarIcon } from "../../../components/ui/icons";
import { MiniCalendar } from "../../../components/ui/MiniCalendar";
import { PopoverActions } from "./PopoverActions";
import { buildDatetime, formatShort } from "../../../shared/utils/dateHelpers";

interface DatePillProps {
  value: FiltersState;
  onChange: (f: FiltersState) => void;
  type: "publicacion" | "cierre";
}

export function DatePill({ value, onChange, type }: DatePillProps) {
  const [open, setOpen] = useState(false);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [horaDesde, setHoraDesde] = useState("00:00");
  const [horaHasta, setHoraHasta] = useState("23:59");
  const ref = useRef<HTMLDivElement>(null);

  const isPublicacion = type === "publicacion";
  const fechaDesdeKey = isPublicacion
    ? "fechaPublicacionDesde"
    : "fechaCierreDesde";
  const fechaHastaKey = isPublicacion
    ? "fechaPublicacionHasta"
    : "fechaCierreHasta";

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function handleOpen() {
    setDesde(value[fechaDesdeKey]?.split("T")[0] ?? "");
    setHasta(value[fechaHastaKey]?.split("T")[0] ?? "");
    setHoraDesde(value[fechaDesdeKey]?.split("T")[1]?.slice(0, 5) ?? "00:00");
    setHoraHasta(value[fechaHastaKey]?.split("T")[1]?.slice(0, 5) ?? "23:59");
    setOpen(true);
  }

  function handleApply() {
    onChange({
      ...value,
      [fechaDesdeKey]: desde ? buildDatetime(desde, horaDesde) : "",
      [fechaHastaKey]: hasta ? buildDatetime(hasta, horaHasta, "59") : "",
    });
    setOpen(false);
  }

  function handleClear() {
    setDesde("");
    setHasta("");
    setHoraDesde("00:00");
    setHoraHasta("23:59");
    onChange({
      ...value,
      [fechaDesdeKey]: "",
      [fechaHastaKey]: "",
    });
    setOpen(false);
  }

  const isActive = !!value[fechaDesdeKey] || !!value[fechaHastaKey];
  let pillLabel = isPublicacion ? "Publicación" : "Cierre";

  if (isActive) {
    const f = formatShort(value[fechaDesdeKey] ?? "");
    const t = formatShort(value[fechaHastaKey] ?? "");
    const prefix = isPublicacion ? "Pub." : "Cierre";
    pillLabel =
      f && t
        ? `${prefix} ${f} → ${t}`
        : f
          ? `${prefix} desde ${f}`
          : `${prefix} hasta ${t}`;
  }

  const today = new Date();
  const desdeInit = desde ? new Date(desde + "T12:00:00") : today;
  const hastaInitRaw = hasta
    ? new Date(hasta + "T12:00:00")
    : new Date(desdeInit.getFullYear(), desdeInit.getMonth() + 1, 1);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleOpen}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-all
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
          ${
            isActive
              ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          }`}
      >
        <CalendarIcon
          className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`}
        />
        <span>{pillLabel}</span>
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-lg shadow-xl border border-slate-200 px-5 pt-5 pb-0 flex flex-col gap-4 w-auto">
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
          <div className="flex gap-4 border-t border-slate-100 pt-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-medium text-slate-500">
                Hora desde
              </label>
              <input
                type="time"
                value={horaDesde}
                onChange={(e) => setHoraDesde(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-medium text-slate-500">
                Hora hasta
              </label>
              <input
                type="time"
                value={horaHasta}
                onChange={(e) => setHoraHasta(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all"
              />
            </div>
          </div>
          <PopoverActions
            onClear={handleClear}
            onApply={handleApply}
            onSelectPlazo={(desde, hasta) => {
              onChange({
                ...value,
                [fechaDesdeKey]: desde,
                [fechaHastaKey]: hasta,
              });
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
