import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, Clock } from "lucide-react";
import { getAllRequests, getOverdueRequests } from "../api/maintenanceApi";

const STATUS_COLORS = { NEW: "bg-blue-900/30 text-blue-400 border-blue-800", IN_PROGRESS: "bg-yellow-900/30 text-yellow-400 border-yellow-800", REPAIRED: "bg-emerald-900/30 text-emerald-400 border-emerald-800", SCRAP: "bg-red-900/30 text-red-400 border-red-800" };
const ALL_STATUSES = ["", "NEW", "IN_PROGRESS", "REPAIRED", "SCRAP"];
const ALL_TYPES = ["", "CORRECTIVE", "PREVENTIVE"];

export default function Maintenance() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [overdueOnly, setOverdueOnly] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetch = overdueOnly ? getOverdueRequests() : getAllRequests({ status: statusFilter || undefined, type: typeFilter || undefined });
    fetch.then(setRequests).catch(() => { }).finally(() => setLoading(false));
  }, [statusFilter, typeFilter, overdueOnly]);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Maintenance Requests</h1><p className="text-sm text-gray-400 mt-0.5">{requests.length} items</p></div>
        <button onClick={() => navigate("/maintenance/new")} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={15} /> New Request
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter size={14} className="text-gray-500" />
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setOverdueOnly(false); }} className="bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-sm px-3 py-1.5 focus:outline-none focus:border-blue-500">
          {ALL_STATUSES.map(s => <option key={s} value={s}>{s || "All Status"}</option>)}
        </select>
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setOverdueOnly(false); }} className="bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-sm px-3 py-1.5 focus:outline-none focus:border-blue-500">
          {ALL_TYPES.map(t => <option key={t} value={t}>{t || "All Types"}</option>)}
        </select>
        <button onClick={() => { setOverdueOnly(p => !p); setStatusFilter(""); setTypeFilter(""); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${overdueOnly ? "bg-red-900/30 text-red-400 border-red-700" : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500"}`}>
          <Clock size={13} /> Overdue Only
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-800 rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="rounded-xl border border-gray-700 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-800/60">
              <tr>{["Subject", "Type", "Status", "Equipment", "Team", "Technician", "Scheduled", ""].map(h =>
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
              )}</tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {requests.map(r => (
                <tr key={r.id} onClick={() => navigate(`/maintenance/${r.id}`)}
                  className={`cursor-pointer hover:bg-gray-800/60 transition-colors ${r.isOverdue ? "bg-red-900/10" : ""}`}>
                  <td className="px-4 py-3 text-sm text-white font-medium">
                    {r.isOverdue && <span className="text-red-400 mr-1.5">⏰</span>}{r.subject}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{r.type}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs border ${STATUS_COLORS[r.status]}`}>{r.status}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-300">{r.equipmentName || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{r.teamName || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{r.technician || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{r.scheduledDate || "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 hover:text-blue-400">Edit</td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && <div className="px-4 py-12 text-center text-gray-500">No requests found.</div>}
        </div>
      )}
    </div>
  );
}
