import { PlazoDropdown } from "./PlazoDropdown";

interface PopoverActionsProps {
  onClear: () => void;
  onApply: () => void;
  onSelectPlazo: (desde: string, hasta: string) => void;
}

export function PopoverActions({ onClear, onApply, onSelectPlazo }: PopoverActionsProps) {
  return (
    <div className="flex items-center justify-between py-3 border-t border-slate-100">
      <PlazoDropdown onSelect={onSelectPlazo} />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClear}
          className="py-1.5 px-3 rounded-md border border-red-500 bg-white text-red-500 text-xs font-semibold hover:bg-red-50 transition-all focus:outline-none"
        >
          Limpiar
        </button>
        <button
          type="button"
          onClick={onApply}
          className="py-1.5 px-3 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all focus:outline-none"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}
