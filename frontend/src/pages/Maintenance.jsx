import { useEffect, useState } from "react";
import api from "../api/api";

export default function Maintenance() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      // 🔗 Backend API
      // const res = await api.get("/maintenance");

      // Dummy data WITH SCRAP
      const res = {
        data: [
          {
            id: 1,
            subject: "Oil Leakage",
            equipment: "Hydraulic Press",
            team: "Mechanical",
            technician: "Rahul",
            status: "New",
            scheduledDate: "2025-01-01",
          },
          {
            id: 2,
            subject: "Bearing Noise",
            equipment: "CNC Machine",
            team: "Production",
            technician: "Amit",
            status: "In Progress",
            scheduledDate: "2024-12-25",
          },
          {
            id: 3,
            subject: "Routine Check",
            equipment: "Air Compressor",
            team: "Utilities",
            technician: "Suresh",
            status: "Scrap", // 🔴 SCRAPPED
            scheduledDate: "2024-12-10",
          },
        ],
      };

      setRecords(res.data);
    } catch (err) {
      console.error("Failed to load maintenance", err);
    }
  };

  const openEditForm = (id) => {
    alert(`Open Maintenance Form for ID: ${id}`);
  };

  const statusBadge = (status) => {
    if (status === "Scrap") {
      return (
        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
          ⚠ Scrap
        </span>
      );
    }

    const colors = {
      New: "bg-blue-600",
      "In Progress": "bg-yellow-600",
      Repaired: "bg-green-600",
    };

    return (
      <span
        className={`text-xs px-2 py-1 rounded text-white ${colors[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-6">
        Maintenance Requests
      </h1>

      <div className="bg-[#1f1f1f] border border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#2a2a2a] text-gray-400 text-sm">
            <tr>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Equipment</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3">Technician</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Scheduled Date</th>
            </tr>
          </thead>

          <tbody>
            {records.map((row) => (
              <tr
                key={row.id}
                onClick={() => {
                  if (row.status !== "Scrap") openEditForm(row.id);
                }}
                className={`border-t border-gray-700
                  ${
                    row.status === "Scrap"
                      ? "bg-gray-900 text-gray-500 cursor-not-allowed"
                      : "cursor-pointer hover:bg-[#2a2a2a]"
                  }`}
              >
                <td className="px-4 py-3 text-white">
                  {row.subject}
                </td>
                <td className="px-4 py-3">
                  {row.equipment}
                </td>
                <td className="px-4 py-3">
                  {row.team}
                </td>
                <td className="px-4 py-3">
                  {row.technician}
                </td>
                <td className="px-4 py-3">
                  {statusBadge(row.status)}
                </td>
                <td className="px-4 py-3">
                  {row.scheduledDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
