import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Wrench, AlertTriangle } from "lucide-react";
import { getEquipmentById, scrapEquipment, deleteEquipment } from "../api/equipmentApi";
import { getRequestsByEquipment } from "../api/maintenanceApi";

const STATUS_COLORS = { NEW: "bg-blue-900/30 text-blue-400", IN_PROGRESS: "bg-yellow-900/30 text-yellow-400", REPAIRED: "bg-emerald-900/30 text-emerald-400", SCRAP: "bg-red-900/30 text-red-400" };

export default function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [requests, setRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrapping, setScrapping] = useState(false);
  const [scrapNote, setScrapNote] = useState("");
  const [showScrapModal, setShowScrapModal] = useState(false);

  useEffect(() => {
    Promise.all([getEquipmentById(id), getRequestsByEquipment(id)])
      .then(([eq, reqs]) => { setEquipment(eq); setRequests(reqs); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [id]);

  const handleScrap = async () => {
    setScrapping(true);
    try { const updated = await scrapEquipment(id, scrapNote); setEquipment(updated); setShowScrapModal(false); }
    catch (e) { alert(e.response?.data?.message || "Failed to scrap equipment."); }
    finally { setScrapping(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this equipment? This cannot be undone.")) return;
    try { await deleteEquipment(id); navigate("/equipment"); }
    catch (e) { alert(e.response?.data?.message || "Failed to delete."); }
  };

  if (loading) return <div className="p-6 space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-800 rounded-lg animate-pulse" />)}</div>;
  if (!equipment) return <div className="p-6 text-red-400">Equipment not found.</div>;

  const { openRequestCount = 0 } = equipment;

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/equipment")} className="text-gray-400 hover:text-white transition-colors"><ArrowLeft size={18} /></button>
          <div>
            <h1 className="text-2xl font-bold text-white">{equipment.name}</h1>
            <p className="text-sm text-gray-400">{equipment.serialNumber || "No serial number"}</p>
          </div>
          {equipment.isScrapped && <span className="px-2 py-0.5 rounded-full text-xs bg-red-900/40 text-red-400 border border-red-800">Scrapped</span>}
        </div>
        <div className="flex items-center gap-2">
          {!equipment.isScrapped && (
            <button onClick={() => setShowScrapModal(true)} className="flex items-center gap-1.5 px-3 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-800 rounded-lg text-sm transition-colors">
              <Trash2 size={13} /> Scrap
            </button>
          )}
          <Link to={`/equipment/${id}/edit`} className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-lg text-sm transition-colors">
            <Edit size={13} /> Edit
          </Link>
          <button onClick={() => navigate(`/maintenance/new?equipmentId=${id}`)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors">
            <Wrench size={13} /> New Request
          </button>
        </div>
      </div>

      {/* Smart Button */}
      <button onClick={() => setShowRequests(p => !p)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-xl text-white transition-colors group">
        <Wrench size={16} className="text-blue-400" />
        <span className="font-medium">Maintenance Requests</span>
        <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600">{openRequestCount}</span>
      </button>

      {equipment.isScrapped && (
        <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-300">
          <AlertTriangle size={18} /> <div><p className="font-medium">This equipment is scrapped</p><p className="text-sm text-red-400 mt-0.5">{equipment.scrapNote}</p></div>
        </div>
      )}

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          ["Category", equipment.category], ["Department", equipment.department],
          ["Employee", equipment.employeeName], ["Location", equipment.location],
          ["Maintenance Team", equipment.teamName], ["Default Technician", equipment.technicianDefault],
          ["Purchase Date", equipment.purchaseDate], ["Warranty Expiry", equipment.warrantyExpiry],
        ].map(([label, value]) => (
          <div key={label} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-white font-medium">{value || "—"}</p>
          </div>
        ))}
      </div>

      {/* Request list panel */}
      {showRequests && (
        <div className="border border-gray-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
            <span className="font-medium text-white">Linked Maintenance Requests</span>
            <Link to={`/maintenance/new?equipmentId=${id}`} className="text-xs text-blue-400 hover:text-blue-300">+ New</Link>
          </div>
          {requests.length === 0
            ? <div className="px-4 py-8 text-center text-gray-500 text-sm">No requests yet for this equipment.</div>
            : <table className="min-w-full">
              <thead className="bg-gray-800/50">
                <tr>{["Subject", "Type", "Status", "Technician", "Scheduled"].map(h => <th key={h} className="px-4 py-2 text-left text-xs text-gray-400 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {requests.map(r => (
                  <tr key={r.id} onClick={() => navigate(`/maintenance/${r.id}`)} className="hover:bg-gray-800/60 cursor-pointer">
                    <td className="px-4 py-2.5 text-sm text-white">{r.subject}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-400">{r.type}</td>
                    <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[r.status]}`}>{r.status}</span></td>
                    <td className="px-4 py-2.5 text-sm text-gray-400">{r.technician || "—"}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-400">{r.scheduledDate || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>}
        </div>
      )}

      {/* Scrap modal */}
      {showScrapModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-red-800/60 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-white text-lg mb-2">Confirm Scrap</h3>
            <p className="text-gray-400 text-sm mb-4">This will permanently mark <strong className="text-white">{equipment.name}</strong> as scrapped. This action cannot be undone.</p>
            <textarea value={scrapNote} onChange={e => setScrapNote(e.target.value)} placeholder="Reason for scrapping…" rows={3} className="input mb-4" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowScrapModal(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm">Cancel</button>
              <button onClick={handleScrap} disabled={scrapping} className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm disabled:opacity-50">
                {scrapping ? "Scrapping…" : "Confirm Scrap"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
