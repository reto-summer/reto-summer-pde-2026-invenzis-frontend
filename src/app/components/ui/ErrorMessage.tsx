interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-72 md:py-48 px-4 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
        <svg
          className="w-7 h-7 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
          <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </svg>
      </div>

      <h2 className="text-base font-semibold text-slate-800 mb-1">Ocurrió un error</h2>
      <p className="text-sm text-slate-500 mb-5 max-w-xs">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
