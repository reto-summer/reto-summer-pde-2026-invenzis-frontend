import { BidCard } from "../components/bid-card";
import { Clock } from "lucide-react";
import { useBids } from "../hooks/useBids";

export function Deadlines() {
  const { bids, loading } = useBids({ sortBy: "timeToClose" });

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Plazos Urgentes</h1>
              <p className="text-xs text-slate-500">
                {loading ? "Cargando..." : `${bids.length} licitaciones ordenadas por urgencia`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Feed */}
      <div className="flex-1 overflow-y-auto px-6 py-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-600">Cargando licitaciones...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 pb-4">
            {bids.map((bid) => (
              <BidCard key={bid.id} bid={bid} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}