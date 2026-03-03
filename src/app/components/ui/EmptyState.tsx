interface EmptyStateProps {
  title?: string;
  description?: string;
  onClear?: () => void;
}

export function EmptyState({
  title = "Sin resultados",
  description = "No se encontraron licitaciones con los filtros aplicados.",
  onClear,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-72 md:py-48 px-4 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 mb-4">
        <svg
          className="w-7 h-7 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={1.5} />
          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      </div>

      <h2 className="text-base font-semibold text-slate-700 mb-1">{title}</h2>
      <p className="text-sm text-slate-500 mb-5 max-w-xs">{description}</p>

      {onClear && (
        <button
          onClick={onClear}
          className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
