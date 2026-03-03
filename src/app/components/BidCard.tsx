import { useState, useEffect } from "react";
import type { Bid } from "../types/Bid";

interface BidCardProps {
  bid: Bid;
}

function getTimeToClose(fechaCierre: string): { hours: number; minutes: number; totalMinutes: number } {
  const normalized = fechaCierre.includes("T") ? fechaCierre : `${fechaCierre}T00:00:00`;
  const diff = new Date(normalized).getTime() - Date.now();
  const totalMinutes = Math.max(0, Math.floor(diff / (1000 * 60)));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes, totalMinutes };
}

function getUrgencyStyle(hours: number): string {
  if (hours <= 48) return "bg-red-500 text-white";
  if (hours <= 96) return "bg-orange-500 text-white";
  return "bg-emerald-500 text-white";
}

function getUrgencyLabel(hours: number, minutes: number): string {
  if (hours === 0) return `${minutes}m restantes`;
  if (hours < 24) return `${hours}h restantes`;
  const days = Math.floor(hours / 24);
  return `${days}d restantes`;
}

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
