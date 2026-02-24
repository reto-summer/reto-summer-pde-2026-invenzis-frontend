import { useState } from 'react';
import { useEmailConfig } from '../hooks/useEmailConfig';
import { useFamilias } from '../hooks/useFamilias';

interface SidebarProps {
    onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps = {}) {
    const [mailInput, setMailInput] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

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

    const handleApply = () => {
        if (onClose) onClose();
    };

    const handleAddMail = async () => {
        const trimmed = mailInput.trim();
        if (!trimmed) return;
        await addEmail(trimmed);
        setMailInput('');
    };

    return (
        <aside className="w-full sm:w-[400px] h-screen bg-white px-8 py-8 flex flex-col fixed left-0 top-0 z-40 shadow-2xl border-r border-gray-200 text-gray-900">
            <div className="flex items-center gap-3 mb-2">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-900 hover:text-slate-300 transition-colors"
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

            <div className="flex-1 flex flex-col gap-0 overflow-y-auto no-scrollbar pb-8">
                {/* Fecha Inicio */}
                <div className="py-8 flex flex-col gap-3 border-b border-gray-200">
                    <label htmlFor="fechaInicio" className="text-xs font-bold text-gray-900 uppercase tracking-widest">Fecha de Publicación</label>
                    <input
                        id="fechaInicio"
                        type="date"
                        value={fechaInicio}
                        onChange={e => setFechaInicio(e.target.value)}
                        className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>

                {/* Fecha Fin */}
                <div className="py-8 flex flex-col gap-3 border-b border-gray-200">
                    <label htmlFor="fechaFin" className="text-xs font-bold text-gray-900 uppercase tracking-widest">Fecha de Cierre</label>
                    <input
                        id="fechaFin"
                        type="date"
                        value={fechaFin}
                        onChange={e => setFechaFin(e.target.value)}
                        className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>

                {/* Familia */}
                <div className="py-8 flex flex-col gap-3 border-b border-gray-200">
                    <label htmlFor="familia" className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                        Familia
                    </label>
                    <div className="relative">
                        <select
                            id="familia"
                            value={familiaCod ?? ''}
                            onChange={(e) => setFamiliaCod(e.target.value || null)}
                            disabled={loadingFamilias}
                            className="w-full appearance-none pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {loadingFamilias ? 'Cargando...' : 'Seleccionar...'}
                            </option>
                            {familias.map((f) => (
                                <option key={f.cod} value={f.cod}>
                                    {f.descripcion}
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m6 9 6 6 6-6"/>
                            </svg>
                        </span>
                    </div>
                    {famError && (
                        <p className="text-xs text-red-500 mt-1">{famError}</p>
                    )}
                </div>

                {/* Subfamilia */}
                <div className="py-8 flex flex-col gap-3 border-b border-gray-200">
                    <label htmlFor="subfamilia" className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                        Subfamilia
                    </label>
                    <div className="relative">
                        <select
                            id="subfamilia"
                            value={subfamiliaCod ?? ''}
                            onChange={(e) => setSubfamiliaCod(e.target.value || null)}
                            disabled={!familiaCod || loadingSubfamilias}
                            className="w-full appearance-none pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m6 9 6 6 6-6"/>
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Mail */}
                <div className="py-8 flex flex-col gap-3">
                    <label htmlFor="mail" className="text-xs font-bold text-gray-900 uppercase tracking-widest">Email</label>
                    <div className="flex flex-wrap gap-2">
                        <input
                            id="mail"
                            type="email"
                            value={mailInput}
                            onChange={e => setMailInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleAddMail(); }}
                            placeholder="nombre@empresa.com"
                            className="flex-1 min-w-0 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        <button
                            type="button"
                            onClick={handleAddMail}
                            className="px-3 py-2 rounded text-sm border border-slate-300 bg-white text-slate-700 font-bold hover:border-slate-500 transition-colors"
                        >
                            Agregar
                        </button>
                    </div>
                    {loadingEmails && (
                        <p className="text-xs text-gray-400 mt-1">Cargando emails...</p>
                    )}
                    {emailError && (
                        <p className="text-xs text-red-500 mt-1">{emailError}</p>
                    )}
                    {emails.length > 0 && (
                        <ul className="mt-2 space-y-1">
                            {emails.map((e) => (
                                <li key={e.direccion} className="flex items-center justify-between gap-2 text-sm text-gray-700 bg-gray-100 rounded px-2 py-1">
                                    <span className="break-all">{e.direccion}</span>
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

            </div>
            {/* Botón debajo del contenido */}
            <div className="mt-4">
                <button
                    onClick={handleApply}
                    className="w-full px-3 py-2 rounded text-sm border border-slate-300 bg-white text-slate-700 font-bold hover:border-slate-500 transition-colors"
                >
                    Filtrar
                </button>
            </div>
        </aside>
    );
}
