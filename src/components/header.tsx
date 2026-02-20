import React from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({
  title = "Nuevas Oportunidades",
  subtitle = "8 licitaciones disponibles",
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-20 w-full items-stretch bg-white border-b border-gray-200">

      {/* Left section */}
      <div className="flex w-[260px] shrink-0 items-center gap-3 border-r border-gray-200 px-4">

        {/* Logo placeholder */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-gray-300 text-[10px] font-medium text-gray-400">
          LOGO
        </div>

        {/* Brand text */}
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-gray-900">Invenzis</span>
          <span className="text-xs text-gray-500">Radar de Licitaciones</span>
        </div>

      </div>

      {/* Right section */}
      <div className="flex flex-1 flex-col justify-center px-6">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>

    </header>
  );
}
