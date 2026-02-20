import { useState } from 'react';

export default function Sidebar() {
    const [mail, setMail] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [familia, setFamilia] = useState('');
    const [subfamilia, setSubfamilia] = useState('');
    const [clase, setClase] = useState('');
    const [subclase, setSubclase] = useState('');

    const familias = ['Familia 1', 'Familia 2', 'Familia 3'];
    const subfamilias = ['Subfamilia 1', 'Subfamilia 2', 'Subfamilia 3'];
    const clases = ['Clase 1', 'Clase 2', 'Clase 3'];
    const subclases = ['Subclase 1', 'Subclase 2', 'Subclase 3'];

    const handleApply = () => {
        console.log('Configuración aplicada:', {
            familia,
            subfamilia,
            clase,
            subclase
        });
    };

    return (
        <aside className="w-80 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-8 flex flex-col fixed left-0 top-0 z-40 shadow-2xl border-r border-slate-700/50">
            <h2 className="text-3xl font-heading font-bold text-white mb-2 tracking-tight">
                Configuraciones
            </h2>

            <div className="flex-1 flex flex-col gap-0 overflow-y-auto pr-2">
                {/* Mail */}
                <div className="py-8 flex flex-col gap-3 border-b border-slate-700/50">
                    <label htmlFor="mail" className="text-xs font-bold text-slate-300 uppercase tracking-widest">Email</label>
                    <input
                        id="mail"
                        type="email"
                        value={mail}
                        onChange={e => setMail(e.target.value)}
                        placeholder="nombre@empresa.com"
                        className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm hover:bg-slate-700/70"
                    />
                </div>

                {/* Fecha Inicio */}
                <div className="py-8 flex flex-col gap-3 border-b border-slate-700/50">
                    <label htmlFor="fechaInicio" className="text-xs font-bold text-slate-300 uppercase tracking-widest">Inicio</label>
                    <input
                        id="fechaInicio"
                        type="date"
                        value={fechaInicio}
                        onChange={e => setFechaInicio(e.target.value)}
                        className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm hover:bg-slate-700/70"
                    />
                </div>

                {/* Fecha Fin */}
                <div className="py-8 flex flex-col gap-3 border-b border-slate-700/50">
                    <label htmlFor="fechaFin" className="text-xs font-bold text-slate-300 uppercase tracking-widest">Fin</label>
                    <input
                        id="fechaFin"
                        type="date"
                        value={fechaFin}
                        onChange={e => setFechaFin(e.target.value)}
                        className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm hover:bg-slate-700/70"
                    />
                </div>

                {/* Familia */}
                <div className="py-8 flex flex-col gap-3 border-b border-slate-700/50">
                    <label htmlFor="familia" className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                        Familia
                    </label>
                    <select
                        id="familia"
                        value={familia}
                        onChange={(e) => setFamilia(e.target.value)}
                        className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm hover:bg-slate-700/70"
                    >
                        <option value="">Seleccionar...</option>
                        {familias.map((f) => (
                            <option key={f} value={f}>
                                {f}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Subfamilia */}
                <div className="py-8 flex flex-col gap-3 border-b border-slate-700/50">
                    <label htmlFor="subfamilia" className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                        Subfamilia
                    </label>
                    <select
                        id="subfamilia"
                        value={subfamilia}
                        onChange={(e) => setSubfamilia(e.target.value)}
                        className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm hover:bg-slate-700/70"
                    >
                        <option value="">Seleccionar...</option>
                        {subfamilias.map((sf) => (
                            <option key={sf} value={sf}>
                                {sf}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Clase */}
                <div className="py-8 flex flex-col gap-3 border-b border-slate-700/50">
                    <label htmlFor="clase" className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                        Clase
                    </label>
                    <select
                        id="clase"
                        value={clase}
                        onChange={(e) => setClase(e.target.value)}
                        className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm hover:bg-slate-700/70"
                    >
                        <option value="">Seleccionar...</option>
                        {clases.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Subclase */}
                <div className="py-8 flex flex-col gap-3 border-b border-slate-700/50">
                    <label htmlFor="subclase" className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                        Subclase
                    </label>
                    <select
                        id="subclase"
                        value={subclase}
                        onChange={(e) => setSubclase(e.target.value)}
                        className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm hover:bg-slate-700/70"
                    >
                        <option value="">Seleccionar...</option>
                        {subclases.map((sc) => (
                            <option key={sc} value={sc}>
                                {sc}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Button */}
                <div className="flex-1 flex items-end">
                    <button
                        onClick={handleApply}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg hover:shadow-xl uppercase tracking-wide"
                    >
                        Filtrar
                    </button>
                </div>
            </div>
        </aside>
    );
}
