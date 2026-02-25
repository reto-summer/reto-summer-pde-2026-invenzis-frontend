import { useMemo } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { useLicitaciones } from "../hooks/useLicitaciones";
import { DEFAULT_FILTERS } from "../types/filters";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import { BidCard } from "../components/BidCard";
import { Filters } from "../components/Filters";
import { BidCardSkeleton } from "../components/ui/BidCardSkeleton";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { EmptyState } from "../components/ui/EmptyState";

export default function MainPage() {
  const { sidebarOpen, setSidebarOpen, filters, setFilters, familiaCod, subfamiliaCod } = useAppContext();
  const { licitaciones, loading, error } = useLicitaciones({
    familia: familiaCod ? Number(familiaCod) : undefined,
    subfamilia: subfamiliaCod ? Number(subfamiliaCod) : undefined,
  });

  const filteredBids = useMemo(() => {
    return licitaciones.filter((bid) => {
      const title = bid.title ?? "";
      const description = bid.description ?? "";
      const matchesSearch =
        filters.search === "" ||
        title.toLowerCase().includes(filters.search.toLowerCase()) ||
        description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesType =
        filters.tenderTypes.length === 0 ||
        filters.tenderTypes.some((type) => {
          switch (type) {
            case "licitacion_publica":
              return title.includes("Licitación Pública");
            case "compra_directa":
              return title.includes("Compra Directa");
            case "licitacion_abreviada":
              return title.includes("Licitación Abreviada");
            default:
              return false;
          }
        });

      const hours =
        (new Date(bid.fecha_cierre).getTime() - Date.now()) / (1000 * 60 * 60);
      const matchesTime =
        filters.dateRanges.length === 0 ||
        filters.dateRanges.some((range) => {
          switch (range) {
            case "under_7":
              return hours <= 168;
            case "7_15":
              return hours > 168 && hours <= 360;
            case "over_15":
              return hours > 360;
            default:
              return false;
          }
        });

      return matchesSearch && matchesType && matchesTime;
    });
  }, [licitaciones, filters]);

  function handleClearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar — fixed on the left, shown only when open */}
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

      {/* Main content — shifts right when sidebar is open */}
      <div
        className={`transition-[margin] duration-300 ${sidebarOpen ? "sm:ml-[400px]" : "ml-0"}`}
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
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <BidCardSkeleton key={i} />
              ))
            ) : error ? (
              <ErrorMessage message={error} />
            ) : filteredBids.length === 0 ? (
              <EmptyState
                title="No hay licitaciones disponibles"
                description="No se encontraron licitaciones en este momento."
                onClear={handleClearFilters}
              />
            ) : (
              filteredBids.map((bid) => (
                <BidCard key={bid.id_licitacion} bid={bid} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
