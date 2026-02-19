import type { Bid } from "../types/Bid";

interface BidCardProps {
  bid: Bid;
  onClick?: () => void;
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

export function BidCard({ bid, onClick }: BidCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:border-blue-300"
    >
      {/* Fila superior: badge de urgencia + tipo y número */}
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyStyle(bid.timeToClose)}`}
        >
          ⏱ {getUrgencyLabel(bid.timeToClose)}
        </span>
        <span className="text-sm font-semibold text-slate-800">
          {bid.type} {bid.number}
        </span>
      </div>

      {/* Institución */}
      <p className="text-sm text-blue-600 mb-2">
        {bid.institution}
        {bid.department && ` | ${bid.department}`}
      </p>

      {/* Descripción */}
      <p className="text-sm text-slate-700 leading-relaxed line-clamp-3 mb-3">
        {bid.description}
      </p>

      {/* Footer: fecha de cierre + apertura electrónica */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-600">
          <span className="font-semibold">Cierre:</span> {bid.deadline}
        </p>
        {bid.aperturaElectronica && (
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
            Apertura Electrónica
          </span>
        )}
      </div>
    </div>
  );
}
