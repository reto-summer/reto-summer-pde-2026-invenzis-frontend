/**
 * Página principal del Radar de Licitaciones.
 *
 * Orquesta la carga de licitaciones, la aplicación de filtros en el cliente
 * y la separación entre licitaciones vigentes y vencidas. También gestiona
 * la visibilidad del sidebar de configuración.
 *
 * Pipeline de filtrado (client-side sobre el array completo de licitaciones):
 *   1. Búsqueda libre en título y descripción.
 *   2. Filtro por tipo de licitación.
 *   3. Rango de fecha de publicación (inclusive en ambos extremos).
 *   4. Rango de fecha de cierre (inclusive en ambos extremos).
 *   5. Separación vigentes / vencidas según `fecha_cierre` vs. `Date.now()`.
 */

import { useMemo, useState } from "react";
import type { Bid } from "../features/bids/types/Bid";
import { default as Header } from "../components/layout/Header";
import { default as Sidebar } from "../components/layout/Sidebar";
import { BidCardSkeleton, ErrorMessage, EmptyState } from "../components/ui";
import { useAppContext, useLicitaciones, BidCard, Filters } from "../";

/**
 * Normaliza el tipo de licitación eliminando dígitos y caracteres especiales
 * para agrupar variantes bajo un mismo nombre.
 * Ej: `"Licitación Pública 001"` → `"Licitación Pública"`
 */
function normalizeTipo(tipo: string): string {
  return tipo
    .replace(/\d+/g, "")
    .replace(/\//g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function MainPage() {
  const {
    sidebarOpen,
    setSidebarOpen,
    filters,
    setFilters,
    familiaCod,
    subfamiliaCod,
    configLoaded,
  } = useAppContext();
  const { licitaciones, loading, error } = useLicitaciones(
    {
      familiaCod: familiaCod ? Number(familiaCod) : undefined,
      subfamiliaCod: subfamiliaCod ? Number(subfamiliaCod) : undefined,
    },
    configLoaded,
  );
  const [showExpired, setShowExpired] = useState(false);

  const availableTipos = useMemo(() => {
    const set = new Set<string>();
    for (const bid of licitaciones) {
      if (bid.tipoLicitacion) set.add(normalizeTipo(bid.tipoLicitacion));
    }
    return Array.from(set).sort();
  }, [licitaciones]);

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
        filters.tenderTypes.includes(normalizeTipo(bid.tipoLicitacion ?? ""));

      // Normalize fecha_publicacion: backend may return "YYYY-MM-DD" without time,
      // which compares as less-than "YYYY-MM-DDT..." strings, excluding the start day.
      const pubDateNorm = bid.fecha_publicacion?.includes("T")
        ? bid.fecha_publicacion
        : `${bid.fecha_publicacion}T00:00:00`;

      const matchesFechaPublicacion =
        (!filters.fechaPublicacionDesde ||
          pubDateNorm >= filters.fechaPublicacionDesde) &&
        (!filters.fechaPublicacionHasta ||
          pubDateNorm <= filters.fechaPublicacionHasta);

      const matchesFechaCierre =
        (!filters.fechaCierreDesde ||
          bid.fecha_cierre >= filters.fechaCierreDesde) &&
        (!filters.fechaCierreHasta ||
          bid.fecha_cierre <= filters.fechaCierreHasta);

      return (
        matchesSearch &&
        matchesType &&
        matchesFechaPublicacion &&
        matchesFechaCierre
      );
    });
  }, [licitaciones, filters]);

  const { visibleBids, expiredCount } = useMemo(() => {
    const now = Date.now();
    const isExpired = (bid: Bid) => {
      const closeTs = new Date(bid.fecha_cierre).getTime();
      if (Number.isNaN(closeTs)) return false;
      return closeTs < now;
    };

    const expired = filteredBids.filter(isExpired);
    if (showExpired) {
      return {
        visibleBids: expired,
        expiredCount: expired.length,
      };
    }

    return {
      visibleBids: filteredBids.filter((bid) => !isExpired(bid)),
      expiredCount: expired.length,
    };
  }, [filteredBids, showExpired]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar — fixed on the left, shown only when open */}
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

      {/* Main content — shifts right when sidebar is open */}
      <div
        className={`transition-[margin] duration-300 ${sidebarOpen ? "`sm:ml-100" : "ml-0"}`}
      >
        {/* Fixed header */}
        <Header
          subtitle={`${visibleBids.length} licitaciones disponibles`}
          sidebarOpen={sidebarOpen}
          onSettingsClick={() => setSidebarOpen(true)}
        />

        {/* Content area — starts below the fixed header (h-20 = 80px) */}
        <div className="pt-20">
          {/* Filter bar — sticks below the header while scrolling */}
          <div className="sticky top-20 z-30">
            <Filters
              value={filters}
              onChange={setFilters}
              availableTipos={availableTipos}
              expiredCount={expiredCount}
              showExpired={showExpired}
              onToggleExpired={() => setShowExpired((prev) => !prev)}
            />
          </div>

          {/* Bid cards list */}
          <div className="p-4 flex flex-col gap-3">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <BidCardSkeleton key={i} />
              ))
            ) : error ? (
              <ErrorMessage message={error} />
            ) : visibleBids.length === 0 ? (
              <EmptyState
                title="No hay licitaciones disponibles"
                description="No se encontraron licitaciones en este momento."
              />
            ) : (
              visibleBids.map((bid: Bid) => (
                <BidCard key={bid.id_licitacion} bid={bid} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
