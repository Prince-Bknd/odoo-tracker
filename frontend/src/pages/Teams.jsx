import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Trash2, ChevronDown, ChevronRight, X, Save } from "lucide-react";
import { getAllTeams, createTeam, updateTeam, deleteTeam } from "../api/teamsApi";

export default function Teams() {
    const [teams, setTeams] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: "", description: "", members: "" });

    const load = () => getAllTeams().then(setTeams);
    useEffect(() => { load(); }, []);

    const openCreate = () => { setEditing(null); setForm({ name: "", description: "", members: "" }); setShowModal(true); };
    const openEdit = (t) => { setEditing(t); setForm({ name: t.name, description: t.description || "", members: (t.members || []).join(", ") }); setShowModal(true); };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = { ...form, members: form.members.split(",").map(s => s.trim()).filter(Boolean) };
            if (editing) await updateTeam(editing.id, payload);
            else await createTeam(payload);
            setShowModal(false); await load();
        } catch (e) { alert(e.response?.data?.message || "Save failed."); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete team "${name}"?`)) return;
        try { await deleteTeam(id); await load(); }
        catch (e) { alert(e.response?.data?.message || "Delete failed."); }
    };

    const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-white">Maintenance Teams</h1><p className="text-sm text-gray-400 mt-0.5">{teams.length} teams</p></div>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
                    <Plus size={15} /> Add Team
                </button>
            </div>

            <div className="grid gap-4">
                {teams.map(team => (
                    <div key={team.id} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4">
                            <button onClick={() => toggle(team.id)} className="flex items-center gap-3 flex-1 text-left group">
                                <div className="w-9 h-9 rounded-lg bg-blue-700/30 border border-blue-700/50 flex items-center justify-center">
                                    <Users size={15} className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white group-hover:text-blue-300 transition-colors">{team.name}</p>
                                    <p className="text-xs text-gray-400">{team.description || "No description"}</p>
                                </div>
                                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-700 text-gray-300">{(team.members || []).length} members</span>
                                {expanded[team.id] ? <ChevronDown size={14} className="text-gray-500 ml-1" /> : <ChevronRight size={14} className="text-gray-500 ml-1" />}
                            </button>
                            <div className="flex items-center gap-2">
                                <button onClick={() => openEdit(team)} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-xs transition-colors">Edit</button>
                                <button onClick={() => handleDelete(team.id, team.name)} className="px-3 py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-800/60 rounded-lg text-xs transition-colors">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                        {expanded[team.id] && (
                            <div className="px-5 pb-4 border-t border-gray-700 pt-3 flex flex-wrap gap-2">
                                {(team.members || []).length === 0
                                    ? <span className="text-gray-500 text-sm">No members</span>
                                    : (team.members || []).map(m => (
                                        <div key={m} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-700 border border-gray-600">
                                            <div className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold text-white">{m.charAt(0).toUpperCase()}</div>
                                            <span className="text-gray-300 text-sm">{m}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>
                ))}
                {teams.length === 0 && (
                    <div className="text-center py-16 text-gray-500">
                        <Users size={40} className="mx-auto mb-3 opacity-30" />
                        <p>No teams yet. Create your first maintenance team!</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-white text-lg">{editing ? "Edit Team" : "New Team"}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
                        </div>
                        <div className="space-y-3">
                            <div><label className="text-xs text-gray-400 uppercase tracking-wider">Name *</label>
                                <input className="input mt-1" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                            <div><label className="text-xs text-gray-400 uppercase tracking-wider">Description</label>
                                <input className="input mt-1" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
                            <div><label className="text-xs text-gray-400 uppercase tracking-wider">Members (comma-separated)</label>
                                <textarea rows={3} className="input mt-1" value={form.members} onChange={e => setForm(p => ({ ...p, members: e.target.value }))} placeholder="username1, username2…" /></div>
                        </div>
                        <div className="flex gap-3 justify-end pt-2">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm disabled:opacity-50">
                                <Save size={13} /> {saving ? "Saving…" : editing ? "Save Changes" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
