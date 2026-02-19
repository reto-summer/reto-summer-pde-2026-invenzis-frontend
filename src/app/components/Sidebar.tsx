import { useState } from 'react';

export default function Sidebar() {
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
        <aside className="w-80 h-screen bg-white border-r border-slate-200 px-6 py-4 flex flex-col">
            <h2 className="text-xl font-heading font-semibold text-slate-900 mb-6">
                Configuraciones
            </h2>

            <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="familia"
                        className="text-sm font-medium text-slate-700"
                    >
                        Familia
                    </label>
                    <select
                        id="familia"
                        value={familia}
                        onChange={(e) => setFamilia(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-base text-slate-900 cursor-pointer transition-all hover:border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    >
                        <option value="">Seleccionar familia</option>
                        {familias.map((f) => (
                            <option key={f} value={f}>
                                {f}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="subfamilia"
                        className="text-sm font-medium text-slate-700"
                    >
                        Subfamilia
                    </label>
                    <select
                        id="subfamilia"
                        value={subfamilia}
                        onChange={(e) => setSubfamilia(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-base text-slate-900 cursor-pointer transition-all hover:border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    >
                        <option value="">Seleccionar subfamilia</option>
                        {subfamilias.map((sf) => (
                            <option key={sf} value={sf}>
                                {sf}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="clase"
                        className="text-sm font-medium text-slate-700"
                    >
                        Clase
                    </label>
                    <select
                        id="clase"
                        value={clase}
                        onChange={(e) => setClase(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-base text-slate-900 cursor-pointer transition-all hover:border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    >
                        <option value="">Seleccionar clase</option>
                        {clases.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="subclase"
                        className="text-sm font-medium text-slate-700"
                    >
                        Subclase
                    </label>
                    <select
                        id="subclase"
                        value={subclase}
                        onChange={(e) => setSubclase(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-base text-slate-900 cursor-pointer transition-all hover:border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    >
                        <option value="">Seleccionar subclase</option>
                        {subclases.map((sc) => (
                            <option key={sc} value={sc}>
                                {sc}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleApply}
                    className="mt-4 px-4 py-2.5 bg-blue-600 text-white text-base font-medium rounded-lg transition-all hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                >
                    Aplicar
                </button>
            </div>
        </aside>
    );
}
