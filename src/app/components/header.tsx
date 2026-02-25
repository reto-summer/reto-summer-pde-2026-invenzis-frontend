import { useState, useRef, useEffect } from "react";
import { NotificationPanel } from "./NotificationPanel";
import { useNotificaciones } from "../hooks/useNotificaciones";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onSettingsClick?: () => void;
  sidebarOpen?: boolean;
}

export default function Header({
  title = "Radar de Licitaciones",
  subtitle = "Licitaciones disponibles",
  onSettingsClick,
  sidebarOpen = false,
}: HeaderProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const notifHook = useNotificaciones();
  const hasUnread = notifHook.unreadCount > 0;

  useEffect(() => {
    if (!panelOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelOpen]);

  return (
    <header
      className={`fixed top-0 right-0 z-40 flex h-20 items-stretch bg-white transition-all duration-300 ${
        sidebarOpen ? "left-[400px]" : "left-0"
      }`}
    >
      <div className="flex flex-1 items-center gap-4 px-4 md:px-6">

        {/* Gear — hidden when sidebar is open */}
        {!sidebarOpen && onSettingsClick && (
          <button
            onClick={onSettingsClick}
            className="shrink-0 p-1 text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Abrir configuraciones"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        )}

        {/* Logo */}
        <img
          src="/LogoInvenzis.jpg"
          alt="Logo Invenzis"
          className="h-10 w-30 shrink-0 rounded object-contain"
        />

        {/* Title + Subtitle + Bell pushed to far right */}
        <div className="ml-auto flex items-center gap-3 min-w-0">
          <div className="flex flex-col items-end min-w-0">
            <h1 className="text-sm sm:text-xl font-bold text-gray-900 truncate">{title}</h1>
            <p className="text-xs text-blue-500 truncate">{subtitle}</p>
          </div>

          {/* Bell with unread dot */}
          <div className="relative shrink-0" ref={panelRef}>
            <button
              type="button"
              onClick={() => setPanelOpen((v) => !v)}
              className="relative p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Ver notificaciones"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
              {hasUnread && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>

            {panelOpen && (
              <NotificationPanel
                hook={notifHook}
                onClose={() => setPanelOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
