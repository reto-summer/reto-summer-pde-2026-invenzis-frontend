import { useState } from "react";
import { BidCard } from "../components/bid-card";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useBids } from "../hooks/useBids";
import { BidType } from "../types/bid.types";

export function NewOpportunities() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Estados de filtros
  const [typeLicitacionPublica, setTypeLicitacionPublica] = useState(true);
  const [typeCompraDirecta, setTypeCompraDirecta] = useState(true);
  const [typeLicitacionAbreviada, setTypeLicitacionAbreviada] = useState(true);
  
  const [daysLessThan7, setDaysLessThan7] = useState(false);
  const [days7to15, setDays7to15] = useState(false);
  const [daysMoreThan15, setDaysMoreThan15] = useState(false);

  // Construir filtros para el hook
  const selectedTypes: string[] = [];
  if (typeLicitacionPublica) selectedTypes.push("Licitación Pública");
  if (typeCompraDirecta) selectedTypes.push("Compra Directa");
  if (typeLicitacionAbreviada) selectedTypes.push("Licitación Abreviada");

  // Calcular maxTimeToClose basado en los filtros de días
  let maxTimeToClose: number | undefined = undefined;
  if (daysLessThan7 && !days7to15 && !daysMoreThan15) {
    maxTimeToClose = 7 * 24; // menos de 7 días = 168 horas
  } else if (!daysLessThan7 && days7to15 && !daysMoreThan15) {
    maxTimeToClose = 15 * 24; // entre 7 y 15 días
  }

  const { bids: allBids, loading } = useBids({ 
    searchQuery, 
    types: selectedTypes.length > 0 ? selectedTypes : undefined,
    maxTimeToClose,
    sortBy: "timeToClose" 
  });

  // Filtro adicional para días (para rangos específicos)
  let filteredBids = allBids;
  
  if (daysLessThan7 || days7to15 || daysMoreThan15) {
    filteredBids = allBids.filter(bid => {
      const hoursToClose = bid.timeToClose;
      const daysToClose = hoursToClose / 24;
      
      if (daysLessThan7 && daysToClose < 7) return true;
      if (days7to15 && daysToClose >= 7 && daysToClose <= 15) return true;
      if (daysMoreThan15 && daysToClose > 15) return true;
      return false;
    });
  }

  const handleClearFilters = () => {
    setSearchQuery("");
    setTypeLicitacionPublica(false);
    setTypeCompraDirecta(false);
    setTypeLicitacionAbreviada(false);
    setDaysLessThan7(false);
    setDays7to15(false);
    setDaysMoreThan15(false);
  };

  return (
    <div className="h-full flex bg-slate-50">
      {/* Left Sidebar - Search & Filters */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo Header */}
        <div className="border-b border-slate-200 px-6 py-4 h-[74px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white border-2 border-slate-200 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-slate-400">LOGO</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Invenzis</h1>
              <p className="text-xs text-slate-500">Radar de Licitaciones</p>
            </div>
          </div>
        </div>

        {/* Search & Filters Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Búsqueda
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Buscar licitaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            {/* Filters Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-700">Filtros</h3>
              </div>
              
              {/* Filter Options */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-2 block">
                    Tipo de Compra
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300" 
                        checked={typeLicitacionPublica}
                        onChange={(e) => setTypeLicitacionPublica(e.target.checked)}
                      />
                      <span className="text-sm text-slate-700">Licitación Pública</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300" 
                        checked={typeCompraDirecta}
                        onChange={(e) => setTypeCompraDirecta(e.target.checked)}
                      />
                      <span className="text-sm text-slate-700">Compra Directa</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300" 
                        checked={typeLicitacionAbreviada}
                        onChange={(e) => setTypeLicitacionAbreviada(e.target.checked)}
                      />
                      <span className="text-sm text-slate-700">Licitación Abreviada</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 mb-2 block">
                    Días para cierre
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300"
                        checked={daysLessThan7}
                        onChange={(e) => setDaysLessThan7(e.target.checked)}
                      />
                      <span className="text-sm text-slate-700">Menos de 7 días</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300"
                        checked={days7to15}
                        onChange={(e) => setDays7to15(e.target.checked)}
                      />
                      <span className="text-sm text-slate-700">7-15 días</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300"
                        checked={daysMoreThan15}
                        onChange={(e) => setDaysMoreThan15(e.target.checked)}
                      />
                      <span className="text-sm text-slate-700">Más de 15 días</span>
                    </label>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-6" 
                size="sm"
                onClick={handleClearFilters}
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 h-[74px]">
          <h2 className="text-xl font-bold text-slate-900">Nuevas Oportunidades</h2>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? "Cargando..." : `${filteredBids.length} licitaciones disponibles`}
          </p>
        </div>

        {/* Bid Feed */}
        <div className="flex-1 overflow-y-auto px-6 py-3">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-600">Cargando licitaciones...</p>
            </div>
          ) : filteredBids.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-slate-600 mb-2">No se encontraron licitaciones</p>
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  Limpiar filtros
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 pb-4">
              {filteredBids.map((bid) => (
                <BidCard key={bid.id} bid={bid} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}