import { useState, useRef, useEffect } from 'react';
import { useEmailConfig } from '../hooks/useEmailConfig';
import { useFamilias } from '../hooks/useFamilias';

interface SidebarProps {
    onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps = {}) {
    const [mailInput, setMailInput] = useState('');

    const {
        emails,
        loading: loadingEmails,
        error: emailError,
        addEmail,
        removeEmail,
    } = useEmailConfig();

    const {
        familias,
        subfamilias,
        familiaCod,
        subfamiliaCod,
        setFamiliaCod,
        setSubfamiliaCod,
        loadingFamilias,
        loadingSubfamilias,
        error: famError,
    } = useFamilias();

    const initialFamiliaCod = useRef(familiaCod);
    const initialSubfamiliaCod = useRef(subfamiliaCod);
    const initialized = useRef(false);

    useEffect(() => {
        if (!loadingFamilias && !initialized.current) {
            initialFamiliaCod.current = familiaCod;
            initialSubfamiliaCod.current = subfamiliaCod;
            initialized.current = true;
        }
    }, [loadingFamilias, familiaCod, subfamiliaCod]);

    const hasChanges =
        familiaCod !== initialFamiliaCod.current ||
        subfamiliaCod !== initialSubfamiliaCod.current;

    const handleConfirm = () => {
        if (!hasChanges) return;
        initialFamiliaCod.current = familiaCod;
        initialSubfamiliaCod.current = subfamiliaCod;
        if (onClose) onClose();
    };

    const handleAddMail = async () => {
        const trimmed = mailInput.trim();
        if (!trimmed) return;
        await addEmail(trimmed);
        setMailInput('');
    };

    return (
        <aside className="w-full sm:w-[400px] h-screen bg-white px-6 py-6 flex flex-col fixed left-0 top-0 z-40 shadow-2xl border-r border-gray-200 text-gray-900">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-900 transition-colors"
                        aria-label="Cerrar configuraciones"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m12 19-7-7 7-7" />
                            <path d="M19 12H5" />
                        </svg>
                    </button>
                )}
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Configuraciones
                </h2>
            </div>

            <div className="flex-1 flex flex-col gap-5 overflow-y-auto no-scrollbar pb-4">
                {/* Familia */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="familia" className="text-sm font-semibold text-gray-700">
                        Familia
                    </label>
                    <div className="relative">
                        <select
                            id="familia"
                            value={familiaCod ?? ''}
                            onChange={(e) => setFamiliaCod(e.target.value || null)}
                            disabled={loadingFamilias}
                            className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {loadingFamilias ? 'Cargando...' : 'Seleccionar familia...'}
                            </option>
                            {familias.map((f) => (
                                <option key={f.cod} value={f.cod}>
                                    {f.descripcion}
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m6 9 6 6 6-6"/>
                            </svg>
                        </span>
                    </div>
                    {famError && (
                        <p className="text-xs text-red-500">{famError}</p>
                    )}
                </div>

                {/* Subfamilia */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="subfamilia" className="text-sm font-semibold text-gray-700">
                        Subfamilia
                    </label>
                    <div className="relative">
                        <select
                            id="subfamilia"
                            value={subfamiliaCod ?? ''}
                            onChange={(e) => setSubfamiliaCod(e.target.value || null)}
                            disabled={!familiaCod || loadingSubfamilias}
                            className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-sm cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:text-gray-400"
                        >
                            <option value="">
                                {loadingSubfamilias ? 'Cargando...' : 'Seleccionar...'}
                            </option>
                            {subfamilias.map((sf) => (
                                <option key={sf.cod} value={sf.cod}>
                                    {sf.nombre}
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m6 9 6 6 6-6"/>
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Notificaciones por Email */}
                <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                            <rect width="20" height="16" x="2" y="4" rx="2"/>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                        Notificaciones por Email
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="mail"
                            type="email"
                            value={mailInput}
                            onChange={e => setMailInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleAddMail(); }}
                            placeholder="correo@ejemplo.com"
                            className="flex-1 min-w-0 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        <button
                            type="button"
                            onClick={handleAddMail}
                            className="px-4 py-2.5 rounded-lg text-sm border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:border-gray-500 transition-colors shrink-0"
                        >
                            Agregar
                        </button>
                    </div>
                    {loadingEmails && (
                        <p className="text-xs text-gray-400">Cargando emails...</p>
                    )}
                    {emailError && (
                        <p className="text-xs text-red-500">{emailError}</p>
                    )}
                    {emails.length > 0 && (
                        <ul className="flex flex-col gap-1.5">
                            {emails.map((e) => (
                                <li key={e.direccion} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gray-400">
                                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                    </svg>
                                    <span className="flex-1 break-all">{e.direccion}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeEmail(e.direccion)}
                                        className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                                        aria-label={`Eliminar ${e.direccion}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Aviso cambios pendientes */}
                {hasChanges && (
                    <div className="flex gap-3 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber-500 mt-0.5">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" x2="12" y1="8" y2="12"/>
                            <line x1="12" x2="12.01" y1="16" y2="16"/>
                        </svg>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-bold text-amber-700">Cambios pendientes</p>
                            <p className="text-sm text-amber-600 leading-snug">
                                Tus modificaciones no se han aplicado aun. Presiona confirmar para guardar y activar las nuevas configuraciones.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Boton confirmar */}
            <div className="pt-4">
                <button
                    onClick={handleConfirm}
                    disabled={!hasChanges}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        hasChanges
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    Confirmar configuraciones
                </button>
            </div>
        </aside>
    );
}
