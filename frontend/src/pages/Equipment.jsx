import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, ChevronDown, Settings, Wrench } from "lucide-react";
import { getAllEquipment, searchEquipment } from "../api/equipmentApi";

const GROUP_OPTIONS = ["None", "Department", "Employee"];

export default function Equipment() {
    const navigate = useNavigate();
    const [equipments, setEquipments] = useState([]);
    const [grouped, setGrouped] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [groupBy, setGroupBy] = useState("None");
    const [showGroupMenu, setShowGroupMenu] = useState(false);

    const fetchAll = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const data = await getAllEquipment();
            setEquipments(data);
            applyGroupBy(data, groupBy);
        } catch { setError("Failed to load equipment. Is the backend running?"); }
        finally { setLoading(false); }
    }, [groupBy]);

    useEffect(() => { fetchAll(); }, []);

    const applyGroupBy = (data, mode) => {
        if (mode === "None") { setGrouped({ All: data }); return; }
        const key = mode === "Department" ? "department" : "employeeName";
        const groups = {};
        data.forEach(eq => { const g = eq[key] || "Unassigned"; if (!groups[g]) groups[g] = []; groups[g].push(eq); });
        setGrouped(groups);
    };

    const handleSearch = async (q) => {
        setSearchQuery(q);
        if (!q.trim()) { fetchAll(); return; }
        try { const data = await searchEquipment(q); setEquipments(data); applyGroupBy(data, groupBy); } catch { }
    };

    const handleGroupChange = (mode) => {
        setGroupBy(mode); setShowGroupMenu(false);
        applyGroupBy(equipments, mode);
    };

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} onRetry={fetchAll} />;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Equipment</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{equipments.length} total assets</p>
                </div>
                <button onClick={() => navigate("/equipment/new")} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium text-sm">
                    <Plus size={15} /> Add Equipment
                </button>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search by name or serial…" value={searchQuery} onChange={e => handleSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                </div>
                <div className="relative">
                    <button onClick={() => setShowGroupMenu(p => !p)} className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-gray-500">
                        <Settings size={13} /> Group: {groupBy} <ChevronDown size={13} />
                    </button>
                    {showGroupMenu && (
                        <div className="absolute top-full mt-1 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 w-36">
                            {GROUP_OPTIONS.map(opt => (
                                <button key={opt} onClick={() => handleGroupChange(opt)}
                                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${opt === groupBy ? "text-blue-400" : "text-gray-300"}`}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {Object.entries(grouped).map(([groupName, rows]) => (
                <div key={groupName} className="rounded-lg overflow-hidden border border-gray-700">
                    {groupBy !== "None" && (
                        <div className="px-4 py-2 bg-gray-800/80 border-b border-gray-700">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{groupName}</span>
                            <span className="ml-2 text-xs text-gray-500">({rows.length})</span>
                        </div>
                    )}
                    <table className="min-w-full">
                        <thead className="bg-gray-800/50">
                            <tr>{["Name", "Serial", "Category", "Department", "Employee", "Location", "Team", "Status", ""].map(h =>
                                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                            )}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {rows.map(eq => (
                                <tr key={eq.id} onClick={() => navigate(`/equipment/${eq.id}`)} className="hover:bg-gray-800/60 cursor-pointer group transition-colors">
                                    <td className="px-4 py-3 font-medium text-white group-hover:text-blue-400 transition-colors">{eq.name}</td>
                                    <td className="px-4 py-3 text-gray-400 text-sm font-mono">{eq.serialNumber || "—"}</td>
                                    <td className="px-4 py-3 text-gray-300 text-sm">{eq.category || "—"}</td>
                                    <td className="px-4 py-3 text-gray-300 text-sm">{eq.department || "—"}</td>
                                    <td className="px-4 py-3 text-gray-300 text-sm">{eq.employeeName || "—"}</td>
                                    <td className="px-4 py-3 text-gray-300 text-sm">{eq.location || "—"}</td>
                                    <td className="px-4 py-3 text-sm">{eq.teamName
                                        ? <span className="px-2 py-0.5 rounded bg-blue-900/30 text-blue-300 text-xs border border-blue-800/50">{eq.teamName}</span>
                                        : <span className="text-gray-500">Unassigned</span>}</td>
                                    <td className="px-4 py-3">
                                        {eq.isScrapped
                                            ? <span className="px-2 py-0.5 rounded-full text-xs bg-red-900/40 text-red-400 border border-red-800">Scrapped</span>
                                            : <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-800">Active</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={e => { e.stopPropagation(); navigate(`/equipment/${eq.id}`); }}
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"><Wrench size={13} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {rows.length === 0 && <div className="px-4 py-8 text-center text-gray-500 text-sm">No equipment in this group.</div>}
                </div>
            ))}
            {equipments.length === 0 && !loading && (
                <div className="text-center py-16 text-gray-500"><Wrench size={40} className="mx-auto mb-3 opacity-30" /><p>No equipment found. Add your first asset!</p></div>
            )}
        </div>
    );
}

function LoadingState() {
    return <div className="p-6 space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-800 rounded-lg animate-pulse" />)}</div>;
}
function ErrorState({ message, onRetry }) {
    return (
        <div className="p-6 flex flex-col items-center gap-4 text-center">
            <div className="text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md">
                <p className="font-medium mb-2">⚠ Failed to load data</p>
                <p className="text-sm text-red-300">{message}</p>
                <button onClick={onRetry} className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-white text-sm">Retry</button>
            </div>
        </div>
    );
}
