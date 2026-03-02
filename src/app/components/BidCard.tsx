import type { Bid } from "../types/Bid";

interface BidCardProps {
  bid: Bid;
}

function getHoursToClose(fechaCierre: string): number {
  const diff = new Date(fechaCierre).getTime() - Date.now();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
}

function getUrgencyStyle(hours: number): string {
  if (hours <= 48) return "bg-red-500 text-white";
  if (hours <= 96) return "bg-orange-500 text-white";
  return "bg-emerald-500 text-white";
}

function getUrgencyLabel(hours: number): string {
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
  const hoursToClose = getHoursToClose(bid.fecha_cierre);

  return (
    <a
      href={bid.link}

      className="block bg-white border border-slate-200 rounded-lg p-4 transition-all hover:shadow-md hover:border-blue-300"
    >
      {/* Fila superior: badge de urgencia + familia */}
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyStyle(hoursToClose)}`}
        >
          ⏱ {getUrgencyLabel(hoursToClose)}
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
