import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { Bid } from "../types/Bid";
import type { FiltersState } from "../types/filters";
import { DEFAULT_FILTERS } from "../types/filters";

interface AppState {
  bids: Bid[];
  loading: boolean;
  error: string | null;
  success: boolean;
  filters: FiltersState;
  sidebarOpen: boolean;
}

interface AppContextType extends AppState {
  setBids: (bids: Bid[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: boolean) => void;
  setFilters: (filters: FiltersState) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{
        bids,
        loading,
        error,
        success,
        filters,
        sidebarOpen,
        setBids,
        setLoading,
        setError,
        setSuccess,
        setFilters,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
