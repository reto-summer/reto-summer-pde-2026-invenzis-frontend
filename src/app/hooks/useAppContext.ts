import { useContext } from "react";
import { AppContext } from "../context/AppContext";

type ContextValue = NonNullable<React.ContextType<typeof AppContext>>;

export function useAppContext(): ContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext debe usarse dentro de AppProvider");
  return ctx;
}
