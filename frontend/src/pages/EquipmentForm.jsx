import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { getEquipmentById, createEquipment, updateEquipment } from "../api/equipmentApi";
import { getAllTeams } from "../api/teamsApi";

export default function EquipmentForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [teams, setTeams] = useState([]);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: "", serialNumber: "", category: "", department: "", employeeName: "",
        location: "", purchaseDate: "", warrantyExpiry: "", teamId: "", technicianDefault: "",
    });

    useEffect(() => {
        getAllTeams().then(setTeams);
        if (isEdit) {
            getEquipmentById(id).then(eq => setForm({
                name: eq.name || "", serialNumber: eq.serialNumber || "", category: eq.category || "",
                department: eq.department || "", employeeName: eq.employeeName || "", location: eq.location || "",
                purchaseDate: eq.purchaseDate || "", warrantyExpiry: eq.warrantyExpiry || "",
                teamId: eq.teamId || "", technicianDefault: eq.technicianDefault || "",
            }));
        }
    }, [id]);

    const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const payload = { ...form, teamId: form.teamId ? Number(form.teamId) : null };
            if (isEdit) await updateEquipment(id, payload);
            else await createEquipment(payload);
            navigate("/equipment");
        } catch (err) { alert(err.response?.data?.message || "Save failed."); }
        finally { setSaving(false); }
    };

    const CATEGORIES = ["Machine", "Vehicle", "Computer", "Tool", "Other"];

    return (
        <div className="p-6 max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors"><ArrowLeft size={18} /></button>
                <h1 className="text-2xl font-bold text-white">{isEdit ? "Edit Equipment" : "New Equipment"}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Name *" required><input className="input" value={form.name} onChange={set("name")} required /></Field>
                    <Field label="Serial Number"><input className="input" value={form.serialNumber} onChange={set("serialNumber")} /></Field>
                    <Field label="Category">
                        <select className="input" value={form.category} onChange={set("category")}>
                            <option value="">Select…</option>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </Field>
                    <Field label="Department"><input className="input" value={form.department} onChange={set("department")} /></Field>
                    <Field label="Assigned Employee"><input className="input" value={form.employeeName} onChange={set("employeeName")} /></Field>
                    <Field label="Location"><input className="input" value={form.location} onChange={set("location")} /></Field>
                    <Field label="Purchase Date"><input type="date" className="input" value={form.purchaseDate} onChange={set("purchaseDate")} /></Field>
                    <Field label="Warranty Expiry"><input type="date" className="input" value={form.warrantyExpiry} onChange={set("warrantyExpiry")} /></Field>
                    <Field label="Maintenance Team">
                        <select className="input" value={form.teamId} onChange={set("teamId")}>
                            <option value="">No team</option>
                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </Field>
                    <Field label="Default Technician"><input className="input" value={form.technicianDefault} onChange={set("technicianDefault")} placeholder="username" /></Field>
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm disabled:opacity-50 transition-colors">
                        <Save size={14} /> {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Equipment"}
                    </button>
                    <button type="button" onClick={() => navigate(-1)} className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium text-sm transition-colors">Cancel</button>
                </div>
            </form>
        </div>
    );
}

function Field({ label, required, children }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>
            {children}
        </div>
    );
}
