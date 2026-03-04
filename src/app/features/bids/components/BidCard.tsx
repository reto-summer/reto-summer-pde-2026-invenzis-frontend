/**
 * Componente BidCard — Tarjeta de resumen de una licitación.
 *
 * Muestra el título, descripción, tipo de urgencia y fechas de una licitación.
 * La urgencia se calcula en tiempo real a partir de las horas restantes hasta
 * el cierre: ≤48h (rojo), ≤96h (naranja), >96h (verde).
 * El contador se actualiza automáticamente cada 60 segundos via `setInterval`.
 */

import { useState, useEffect } from "react";
import type { Bid } from "../types/Bid";

/** Props del componente BidCard. */
interface BidCardProps {
  /** Licitación a renderizar. */
  bid: Bid;
}

/**
 * Calcula las horas, minutos y minutos totales hasta el cierre de la licitación.
 * Normaliza fechas sin componente de hora para evitar desfases de zona horaria.
 */
function getTimeToClose(fechaCierre: string): { hours: number; minutes: number; totalMinutes: number } {
  const normalized = fechaCierre.includes("T") ? fechaCierre : `${fechaCierre}T00:00:00`;
  const diff = new Date(normalized).getTime() - Date.now();
  const totalMinutes = Math.max(0, Math.floor(diff / (1000 * 60)));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes, totalMinutes };
}

/**
 * Clases Tailwind para el badge de urgencia según horas restantes.
 * Umbrales: ≤48h → rojo, ≤96h → naranja, >96h → verde.
 */
function getUrgencyStyle(hours: number): string {
  if (hours <= 48) return "bg-red-500 text-white";
  if (hours <= 96) return "bg-orange-500 text-white";
  return "bg-emerald-500 text-white";
}

/** Etiqueta legible del tiempo restante: minutos si < 1h, horas si < 24h, días si >= 24h. */
function getUrgencyLabel(hours: number, minutes: number): string {
  if (hours === 0) return `${minutes}m restantes`;
  if (hours < 24) return `${hours}h restantes`;
  const days = Math.floor(hours / 24);
  return `${days}d restantes`;
}

/**
 * Formatea un string de fecha ISO para mostrar en la UI (locale `es-AR`).
 * Si la fecha viene sin componente de hora ("YYYY-MM-DD"), agrega `T00:00:00`
 * para forzar interpretación en hora local y evitar desfases de zona horaria.
 *
 * @param dateString - Fecha en formato ISO 8601 (con o sin hora).
 * @returns Fecha formateada o `"N/A"` si la entrada es inválida.
 */
function formatDate(dateString: string): string {
  if (!dateString) return "N/A";
  try {
    const normalized = dateString.includes("T") ? dateString : `${dateString}T00:00:00`;
    const date = new Date(normalized);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("es-AR");
  } catch {
    return "N/A";
  }
}

/**
 * Tarjeta que muestra el resumen de una licitación.
 * Actúa como enlace externo (`<a href>`) al sitio de la licitación.
 * El contador de tiempo restante se actualiza cada 60s automáticamente.
 */
export function BidCard({ bid }: BidCardProps) {
  const [time, setTime] = useState(() => getTimeToClose(bid.fecha_cierre));

  useEffect(() => {
    if (time.totalMinutes === 0) return;

    const interval = setInterval(() => {
      setTime(getTimeToClose(bid.fecha_cierre));
    }, 60_000);

    return () => clearInterval(interval);
  }, [time.totalMinutes === 0, bid.fecha_cierre]);

  const { hours, minutes } = time;

  return (
    <a
      href={bid.link}

      className="block bg-white border border-slate-200 rounded-lg p-4 transition-all hover:shadow-md hover:border-blue-300"
    >
      {/* Fila superior: badge de urgencia + familia */}
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyStyle(hours)}`}
        >
          ⏱ {getUrgencyLabel(hours, minutes)}
        </span>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          {bid.familia.nombre}
        </span>
      </div>

      {/* Título */}
      <p className="text-sm font-semibold text-slate-800 mb-2 line-clamp-2">
        {bid.title}
      </p>

      {/* Descripción */}
      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-3">
        {bid.description}
      </p>

      {/* Footer: fecha de cierre + publicación */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <p>
          <span className="font-semibold">Cierre:</span>{" "}
          {formatDate(bid.fecha_cierre)}
        </p>
        <p>
          <span className="font-semibold">Publicación:</span>{" "}
          {formatDate(bid.fecha_publicacion)}
        </p>
      </div>
    </a>
  );
}
