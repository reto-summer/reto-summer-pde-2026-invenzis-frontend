import type { NotificacionDetalle } from "../../../../api/types";
import { StatusBadge } from "./StatusBadge";
import { formatNotificationDate } from "../../../shared/utils/dateHelpers";

interface NotificationDetailProps {
  detail: NotificacionDetalle;
  onBack: () => void;
}

export function NotificationDetail({
  detail,
  onBack,
}: NotificationDetailProps) {
  return (
    <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center p-1 -ml-2 text-slate-600 hover:text-slate-900 transition-colors"
          aria-label="Volver"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </button>

        <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">
          {detail.title}
        </h3>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {formatNotificationDate(detail.executionDate)}
        </span>
        <StatusBadge success={detail.success} />
      </div>

      <div className="w-full border-t border-slate-100" />

      {detail.detail && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Detalle
          </span>
          <p className="text-sm text-slate-700 leading-relaxed">
            {detail.detail}
          </p>
        </div>
      )}

      {detail.content && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Contenido
          </span>
          <div className="bg-slate-50 rounded-md border border-slate-200 p-3">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {detail.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
