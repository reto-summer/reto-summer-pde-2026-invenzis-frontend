import { useState } from "react";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import { BidCard } from "../components/BidCard";
import { Filters } from "../components/Filters";
import type { Bid } from "../types/Bid";
import type { FiltersState } from "../types/filters";
import { DEFAULT_FILTERS } from "../types/filters";

interface MainPageProps {
  bids?: Bid[];
}

export default function MainPage({ bids = [] }: MainPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);

  const filteredBids = bids.filter((bid) => {
    // Filtro por búsqueda de texto
    const matchesSearch =
      filters.search === "" ||
      bid.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      bid.description.toLowerCase().includes(filters.search.toLowerCase());

    // Filtro por tipo de licitación
    const matchesType =
      filters.tenderTypes.length === 0 ||
      filters.tenderTypes.some((type) => {
        switch (type) {
          case "licitacion_publica":
            return bid.title.includes("Licitación Pública");
          case "compra_directa":
            return bid.title.includes("Compra Directa");
          case "licitacion_abreviada":
            return bid.title.includes("Licitación Abreviada");
          default:
            return false;
        }
      });

    // Filtro por rango de tiempo
    const hours =
      (new Date(bid.fecha_cierre).getTime() - Date.now()) / (1000 * 60 * 60);
    const matchesTime =
      filters.dateRanges.length === 0 ||
      filters.dateRanges.some((range) => {
        switch (range) {
          case "under_7":
            return hours <= 168; // 7 días
          case "7_15":
            return hours > 168 && hours <= 360; // 7-15 días
          case "over_15":
            return hours > 360; // >15 días
          default:
            return false;
        }
      });

    return matchesSearch && matchesType && matchesTime;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar — fixed on the left, shown only when open */}
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

      {/* Main content — shifts right when sidebar is open */}
      <div
        className={`transition-[margin] duration-300 ${sidebarOpen ? "ml-80" : "ml-0"}`}
      >
        {/* Fixed header */}
        <Header
          subtitle={`${filteredBids.length} licitaciones disponibles`}
          sidebarOpen={sidebarOpen}
          onSettingsClick={() => setSidebarOpen(true)}
        />

        {/* Content area — starts below the fixed header (h-20 = 80px) */}
        <div className="pt-20">
          {/* Filter bar — sticks below the header while scrolling */}
          <div className="sticky top-20 z-30">
            <Filters value={filters} onChange={setFilters} />
          </div>

          {/* Bid cards list */}
          <div className="p-4 flex flex-col gap-3">
            {filteredBids.map((bid) => (
              <BidCard key={bid.id_licitacion} bid={bid} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
