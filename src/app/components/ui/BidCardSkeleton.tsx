export function BidCardSkeleton() {
  return (
    <div className="block bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
      {/* Fila superior: badge de urgencia + familia */}
      <div className="flex items-center gap-3 mb-3">
        <div className="h-6 w-24 bg-slate-200 rounded-full" />
        <div className="h-5 w-20 bg-slate-200 rounded-md" />
      </div>

      {/* Título (2 líneas) */}
      <div className="mb-2 space-y-1.5">
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-4/5" />
      </div>

      {/* Descripción (3 líneas) */}
      <div className="mb-3 space-y-1.5">
        <div className="h-3.5 bg-slate-200 rounded w-full" />
        <div className="h-3.5 bg-slate-200 rounded w-5/6" />
        <div className="h-3.5 bg-slate-200 rounded w-3/5" />
      </div>

      {/* Separador */}
      <div className="border-t border-slate-100 pt-3">
        {/* Footer: fechas */}
        <div className="flex items-center justify-between">
          <div className="h-3.5 bg-slate-200 rounded w-28" />
          <div className="h-3.5 bg-slate-200 rounded w-28" />
        </div>
      </div>
    </div>
  );
}
