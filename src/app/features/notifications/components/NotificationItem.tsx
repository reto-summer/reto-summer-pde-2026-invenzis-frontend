import type { NotificacionResumen } from "../../../../api/types";
import { StatusBadge } from "./StatusBadge";
import { formatNotificationDate } from "../../../shared/utils/dateHelpers";

interface NotificationItemProps {
  notif: NotificacionResumen;
  read: boolean;
  onClick: () => void;
}

export function NotificationItem({
  notif,
  read,
  onClick,
}: NotificationItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-start gap-3"
    >
      {/* Unread dot */}
      <span
        className="mt-1.5 shrink-0 w-2 h-2 rounded-full transition-colors"
        style={{ background: read ? "transparent" : "#3b82f6" }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span
            className={`text-sm line-clamp-1 flex-1 ${read ? "font-normal text-slate-600" : "font-semibold text-slate-900"}`}
          >
            {notif.title}
          </span>
          <StatusBadge success={notif.success} />
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400">
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
          {formatNotificationDate(notif.executionDate)}
        </div>
      </div>
    </button>
  );
}
