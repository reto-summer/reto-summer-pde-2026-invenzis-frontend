interface HeaderProps {
  title?: string;
  subtitle?: string;
  onSettingsClick?: () => void;
  sidebarOpen?: boolean;
}

export default function Header({
  title = "Radar de Licitaciones",
  subtitle = "8 licitaciones disponibles",
  onSettingsClick,
  sidebarOpen = false,
}: HeaderProps) {
  return (
    <header
      className={`fixed top-0 right-0 z-40 flex h-20 items-stretch bg-white border-b border-gray-200 transition-all duration-300 ${
        sidebarOpen ? "left-80" : "left-0"
      }`}
    >
      {/* Left section */}
      <div className="flex w-[55px] shrink-0 items-center justify-center border-r border-gray-200 px-3">

        {/* Settings button — only visible when sidebar is closed */}
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
      </div>

      {/* Right section */}
      <div className="flex flex-1 items-center px-6">

        {/* Logo */}
        <img
          src="/LogoInvenzis.jpg"
          alt="Logo Invenzis"
          className="h-12 w-15 shrink-0 rounded object-contain"
        />

        {/* Title + Subtitle pushed to far right */}
        <div className="ml-auto flex flex-col items-end">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}
