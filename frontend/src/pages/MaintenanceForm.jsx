import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Save, AlertTriangle } from "lucide-react";
import { createRequest, getRequestById, updateRequest } from "../api/maintenanceApi";
import { getActiveEquipment, getEquipmentById } from "../api/equipmentApi";
import { getAllTeams } from "../api/teamsApi";

export default function MaintenanceForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: urlId } = useParams();                    // from /maintenance/:id
  const searchParams = new URLSearchParams(location.search);
  const preselectedEquipmentId = searchParams.get("equipmentId");
  const preselectedDate = searchParams.get("scheduledDate");
  const preselectedType = searchParams.get("type");
  // Support both /maintenance/:id URL and ?editId= query param
  const editId = urlId || searchParams.get("editId");

  const [equipments, setEquipments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [saving, setSaving] = useState(false);
  const [autoFilling, setAuto] = useState(false);
  const [scrappedWarning, setSW] = useState(false);

  const [form, setForm] = useState({
    subject: "", type: preselectedType || "CORRECTIVE", equipmentId: preselectedEquipmentId || "",
    teamId: "", technician: "", scheduledDate: preselectedDate || "", durationHours: "", notes: "",
  });

  useEffect(() => {
    Promise.all([getActiveEquipment(), getAllTeams()])
      .then(([eqs, tms]) => { setEquipments(eqs); setTeams(tms); });

    if (editId) {
      getRequestById(editId).then(r => setForm({
        subject: r.subject || "", type: r.type || "CORRECTIVE", equipmentId: r.equipmentId || "",
        teamId: r.teamId || "", technician: r.technician || "", scheduledDate: r.scheduledDate || "",
        durationHours: r.durationHours || "", notes: r.notes || "",
      }));
    } else if (preselectedEquipmentId) {
      autoFillFromEquipment(preselectedEquipmentId);
    }
  }, []);

  const autoFillFromEquipment = async (eqId) => {
    if (!eqId) { setSW(false); return; }
    setAuto(true);
    try {
      const eq = await getEquipmentById(eqId);
      setSW(Boolean(eq.isScrapped));
      setForm(p => ({
        ...p,
        teamId: (!p.teamId && eq.teamId) ? String(eq.teamId) : p.teamId,
        technician: (!p.technician && eq.technicianDefault) ? eq.technicianDefault : p.technician,
      }));
    } catch { } finally { setAuto(false); }
  };

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleEquipmentChange = (e) => {
    const val = e.target.value;
    setForm(p => ({ ...p, equipmentId: val, teamId: "", technician: "" }));
    if (val) autoFillFromEquipment(val);
    else setSW(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (scrappedWarning) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        equipmentId: form.equipmentId ? Number(form.equipmentId) : null,
        teamId: form.teamId ? Number(form.teamId) : null,
        durationHours: form.durationHours ? Number(form.durationHours) : null,
      };
      if (editId) await updateRequest(editId, payload);
      else await createRequest(payload);
      navigate("/maintenance");
    } catch (err) { alert(err.response?.data?.message || "Save failed."); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white"><ArrowLeft size={18} /></button>
        <h1 className="text-2xl font-bold text-white">{editId ? "Edit Request" : "New Maintenance Request"}</h1>
      </div>

      {scrappedWarning && (
        <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-300">
          <AlertTriangle size={16} /> <p className="text-sm">Selected equipment is <strong>scrapped</strong> — you cannot create a request for it.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Subject *</label>
            <input className="input" value={form.subject} onChange={set("subject")} required placeholder="e.g. Oil leak, Bearing noise…" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Type</label>
            <select className="input" value={form.type} onChange={set("type")}>
              <option value="CORRECTIVE">Corrective</option>
              <option value="PREVENTIVE">Preventive</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Equipment</label>
            <select className="input" value={form.equipmentId} onChange={handleEquipmentChange}>
              <option value="">None</option>
              {equipments.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            {autoFilling && <p className="text-xs text-blue-400">Auto-filling…</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Team</label>
            <select className="input" value={form.teamId} onChange={set("teamId")}>
              <option value="">No team</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Technician</label>
            <input className="input" value={form.technician} onChange={set("technician")} placeholder="username" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Scheduled Date</label>
            <input type="date" className="input" value={form.scheduledDate} onChange={set("scheduledDate")} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Duration (hours)</label>
            <input type="number" step="0.5" min="0" className="input" value={form.durationHours} onChange={set("durationHours")} />
          </div>
          <div className="col-span-2 space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Notes</label>
            <textarea rows={3} className="input" value={form.notes} onChange={set("notes")} placeholder="Additional details…" />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving || scrappedWarning}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm disabled:opacity-50 transition-colors">
            <Save size={14} /> {saving ? "Saving…" : editId ? "Save Changes" : "Create Request"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}
