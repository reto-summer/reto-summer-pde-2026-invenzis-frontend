import { useMemo } from "react";
import { useAppContext } from "./useAppContext";

export function useBids() {
  const { bids, loading, error, success, filters } = useAppContext();

  const filteredBids = useMemo(() => {
    return bids.filter((bid) => {
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
  }, [bids, filters]);

  return { bids, filteredBids, loading, error, success };
}
