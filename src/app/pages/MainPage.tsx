import { useAppContext } from "../hooks/useAppContext";
import { useBids } from "../hooks/useBids";
import { DEFAULT_FILTERS } from "../types/filters";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import { BidCard } from "../components/BidCard";
import { Filters } from "../components/Filters";
import { BidCardSkeleton } from "../components/ui/BidCardSkeleton";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { EmptyState } from "../components/ui/EmptyState";

export default function MainPage() {
  const { sidebarOpen, setSidebarOpen, filters, setFilters } = useAppContext();
  const { filteredBids, loading, error } = useBids();

  function handleClearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar — fixed on the left, shown only when open */}
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

      {/* Main content — shifts right when sidebar is open */}
      <div
        className={`transition-[margin] duration-300 ${sidebarOpen ? "ml-[400px]" : "ml-0"}`}
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
              <EmptyState onClear={handleClearFilters} />
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
