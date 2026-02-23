import { useState } from 'react';

interface SidebarProps {
    onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps = {}) {
    const [mail, setMail] = useState('');
    const [mails, setMails] = useState<string[]>([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [familia, setFamilia] = useState('');
    const [subfamilia, setSubfamilia] = useState('');
    const [clase, setClase] = useState('');
    const [subclase, setSubclase] = useState('');

    const familias = ['Familia 1', 'Familia 2', 'Familia 3'];
    const subfamilias = ['Subfamilia 1', 'Subfamilia 2', 'Subfamilia 3'];

    const handleApply = () => {
        console.log('Configuración aplicada:', {
            familia,
            subfamilia
        });
        if (onClose) onClose();
    };

    const handleAddMail = () => {
        if (mail && !mails.includes(mail)) {
            setMails([...mails, mail]);
            setMail('');
        }
    };

    return (
        <aside className="w-[400px] h-screen bg-white px-8 py-8 flex flex-col fixed left-0 top-0 z-40 shadow-2xl border-r border-gray-200 text-gray-900">
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

            <div className="flex-1 flex flex-col gap-0 overflow-y-auto pr-6 pb-8">
                {/* Mail */}
                <div className="py-8 flex flex-col gap-3 border-b border-gray-200">
                    <label htmlFor="mail" className="text-xs font-bold text-gray-900 uppercase tracking-widest">Email</label>
                    <div className="flex flex-wrap gap-2">
                        <input
                            id="mail"
                            type="email"
                            value={mail}
                            onChange={e => setMail(e.target.value)}
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
                    {mails.length > 0 && (
                        <ul className="mt-2 space-y-1">
                            {mails.map((m, idx) => (
                                <li key={idx} className="text-sm text-gray-700 bg-gray-100 rounded px-2 py-1 break-all">{m}</li>
                            ))}
                        </ul>
                    )}
                </div>

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
                            value={familia}
                            onChange={(e) => setFamilia(e.target.value)}
                            className="w-full appearance-none pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        >
                            <option value="">Seleccionar...</option>
                            {familias.map((f) => (
                                <option key={f} value={f}>
                                    {f}
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

                {/* Subfamilia */}
                <div className="py-8 flex flex-col gap-3 border-b border-gray-200">
                    <label htmlFor="subfamilia" className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                        Subfamilia
                    </label>
                    <div className="relative">
                        <select
                            id="subfamilia"
                            value={subfamilia}
                            onChange={(e) => setSubfamilia(e.target.value)}
                            className="w-full appearance-none pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        >
                            <option value="">Seleccionar...</option>
                            {subfamilias.map((sf) => (
                                <option key={sf} value={sf}>
                                    {sf}
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
