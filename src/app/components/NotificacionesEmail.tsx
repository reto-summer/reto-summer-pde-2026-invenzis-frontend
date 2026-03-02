import { useState } from "react";
import { useEmailConfig } from "../hooks/useEmailConfig";

export default function NotificacionesEmail() {
  const [mailInput, setMailInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    emails,
    loading: loadingEmails,
    error: emailError,
    addEmail,
    removeEmail,
  } = useEmailConfig();

  const handleAddMail = async () => {
    const trimmed = mailInput.trim();
    if (!trimmed) return;
    await addEmail(trimmed);
    setMailInput("");
  };

  return (
    <div className="flex flex-col">
      {/* Header clickeable para colapsar/expandir */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-start justify-between w-full text-left hover:bg-slate-50 rounded-lg transition-colors"
      >
        <div className="flex-1 min-w-0 mr-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Notificaciones por Email
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Agrega direcciones de correo electrónico para recibir notificaciones
            cuando aparezcan nuevas licitaciones
          </p>
        </div>
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
          className={`transform transition-transform shrink-0 mt-0.5 ${isExpanded ? "rotate-180" : "rotate-0"}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Contenido colapsable */}
      {isExpanded && (
        <div className="flex flex-col gap-4 mt-4">
          {/* Input y botón agregar */}
          <div className="flex gap-2">
            <input
              id="mail"
              type="email"
              value={mailInput}
              onChange={(e) => setMailInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddMail();
              }}
              placeholder="correo@ejemplo.com"
              className="flex-1 min-w-0 pl-4 pr-3 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <button
              type="button"
              onClick={handleAddMail}
              className="px-4 py-3 rounded-lg text-xs sm:text-sm border border-slate-300 bg-white text-slate-700 font-medium hover:border-slate-400 hover:bg-slate-50 transition-all shrink-0"
            >
              Agregar
            </button>
          </div>

          {/* Estados de carga y error */}
          {loadingEmails && (
            <p className="text-sm text-slate-500">Cargando emails...</p>
          )}
          {emailError && (
            <p className="text-xs text-red-500 leading-snug">{emailError}</p>
          )}

          {/* Lista de emails guardados */}
          {emails.length > 0 && (
            <div className="mt-2">
              <ul className="flex flex-col gap-2">
                {emails.map((e) => (
                  <li
                    key={e.direccion}
                    className="flex items-center gap-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 text-slate-400"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span className="flex-1 break-all text-slate-800">
                      {e.direccion}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEmail(e.direccion)}
                      className="shrink-0 text-slate-400 hover:text-red-500 transition-colors p-1"
                      aria-label={`Eliminar ${e.direccion}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
