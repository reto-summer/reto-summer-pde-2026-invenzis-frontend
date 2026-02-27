import { useMemo } from "react";
import { useAppContext } from "./useAppContext";

export function useBids() {
  const { bids, loading, error, success, filters } = useAppContext();

  const filteredBids = useMemo(() => {
    return Object.values(bids).filter((bid) => {
      const title = bid.title ?? "";
      const description = bid.description ?? "";
      const matchesSearch =
        filters.search === "" ||
        title.toLowerCase().includes(filters.search.toLowerCase()) ||
        description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesType =
        filters.tenderTypes.length === 0 ||
        filters.tenderTypes.includes(bid.tipoLicitacion ?? "");

      const hours =
        (new Date(bid.fecha_cierre).getTime() - Date.now()) / (1000 * 60 * 60);
      const matchesTime =
        filters.dateRanges.length === 0 ||
        filters.dateRanges.some((range) => {
          switch (range) {
            case "today":
              return hours >= 0 && hours < 24;
            case "under_7":
              return hours >= 0 && hours <= 168;
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
  }, [bids, filters]);

  return { bids, filteredBids, loading, error, success };
}
