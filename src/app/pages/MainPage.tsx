import { useState } from "react";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import { BidCard } from "../components/BidCard";
import type { Bid } from "../types/Bid";

const BID_TYPES = ["Licitación Pública", "Compra Directa", "Licitación Abreviada"];
const TIME_RANGES = ["< 7 días", "7-15 días", ">15 días"];

interface MainPageProps {
  bids?: Bid[];
}

export default function MainPage({ bids = [] }: MainPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) next.delete(filter);
      else next.add(filter);
      return next;
    });
  };

  const clearFilters = () => {
    setSearch("");
    setActiveFilters(new Set());
  };

  const filteredBids = bids.filter((bid) => {
    const matchesSearch =
      search === "" ||
      bid.title.toLowerCase().includes(search.toLowerCase()) ||
      bid.description.toLowerCase().includes(search.toLowerCase());

    const activeTypes = BID_TYPES.filter((t) => activeFilters.has(t));
    const matchesType =
      activeTypes.length === 0 || activeTypes.some((t) => bid.title.includes(t));

    const hours =
      (new Date(bid.fecha_cierre).getTime() - Date.now()) / (1000 * 60 * 60);
    const activeTimeRanges = TIME_RANGES.filter((t) => activeFilters.has(t));
    const matchesTime =
      activeTimeRanges.length === 0 ||
      (activeFilters.has("< 7 días") && hours <= 168) ||
      (activeFilters.has("7-15 días") && hours > 168 && hours <= 360) ||
      (activeFilters.has(">15 días") && hours > 360);

    return matchesSearch && matchesType && matchesTime;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar — fixed on the left, shown only when open */}
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

      {/* Main content — shifts right when sidebar is open */}
      <div className={`transition-[margin] duration-300 ${sidebarOpen ? "ml-80" : "ml-0"}`}>

        {/* Fixed header */}
        <Header
          subtitle={`${filteredBids.length} licitaciones disponibles`}
          sidebarOpen={sidebarOpen}
          onSettingsClick={() => setSidebarOpen(true)}
        />

        {/* Content area — starts below the fixed header (h-20 = 80px) */}
        <div className="pt-20">

          {/* Filter bar — sticks below the header while scrolling */}
          <div className="sticky top-20 z-30 bg-white border-b border-gray-200 px-4 py-3 flex flex-wrap items-center gap-2">

            {/* Search input */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
              <svg
                className="text-gray-400 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar licitaciones..."
                className="outline-none text-sm bg-transparent w-44"
              />
            </div>

            {/* Bid type filter chips */}
            {BID_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggleFilter(type)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm border transition-colors ${
                  activeFilters.has(type)
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-700 border-slate-300 hover:border-slate-500"
                }`}
              >
                <span className={`w-3 h-3 rounded-sm shrink-0 ${activeFilters.has(type) ? "bg-white" : "bg-slate-400"}`} />
                {type}
              </button>
            ))}

            {/* Time range filter chips */}
            {TIME_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => toggleFilter(range)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm border transition-colors ${
                  activeFilters.has(range)
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-700 border-slate-300 hover:border-slate-500"
                }`}
              >
                <span className={`w-3 h-3 rounded-sm shrink-0 ${activeFilters.has(range) ? "bg-white" : "bg-slate-400"}`} />
                {range}
              </button>
            ))}

            {/* Clear button */}
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Limpiar
            </button>
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
