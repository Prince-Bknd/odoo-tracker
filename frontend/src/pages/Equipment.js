import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api"; // your api.js

export default function Equipment() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    try {
      // 🔗 Backend API
      // const res = await api.get("/equipments");
      // setEquipments(res.data);

      // 🔧 Dummy data (remove when backend ready)
      setEquipments([
        {
          id: 1,
          name: "Hydraulic Press",
          serial: "HP-2024-01",
          department: "Manufacturing",
          owner: "Plant A",
          location: "Block 3",
          team: "Mechanical",
        },
        {
          id: 2,
          name: "CNC Machine",
          serial: "CNC-8892",
          department: "Production",
          owner: "Plant B",
          location: "Block 1",
          team: "Automation",
        },
        {
          id: 3,
          name: "Air Compressor",
          serial: "AC-5521",
          department: "Utilities",
          owner: "Plant A",
          location: "Utility Room",
          team: "Maintenance",
        },
      ]);
    } catch (error) {
      console.error("Error fetching equipments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (equipment) => {
    // 🔜 Future: navigate to detail page
    console.log("Clicked equipment:", equipment);
  };

  if (loading) {
    return <div className="p-6 text-gray-400">Loading equipments...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Equipment</h1>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
          + Add Equipment
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#1f1f1f] rounded-lg shadow">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#2a2a2a]">
            <tr>
              <th className="px-4 py-3 text-left text-sm text-gray-400">Name</th>
              <th className="px-4 py-3 text-left text-sm text-gray-400">Serial</th>
              <th className="px-4 py-3 text-left text-sm text-gray-400">Department</th>
              <th className="px-4 py-3 text-left text-sm text-gray-400">Owner</th>
              <th className="px-4 py-3 text-left text-sm text-gray-400">Location</th>
              <th className="px-4 py-3 text-left text-sm text-gray-400">Team</th>
            </tr>
          </thead>

          <tbody>
            {equipments.map((eq) => (
              <tr
                key={eq.id}
                onClick={() => handleRowClick(eq)}
                className="border-t border-gray-700 hover:bg-[#2a2a2a] cursor-pointer transition"
              >
                <td className="px-4 py-3 text-white">{eq.name}</td>
                <td className="px-4 py-3 text-gray-300">{eq.serial}</td>
                <td className="px-4 py-3 text-gray-300">{eq.department}</td>
                <td className="px-4 py-3 text-gray-300">{eq.owner}</td>
                <td className="px-4 py-3 text-gray-300">{eq.location}</td>
                <td className="px-4 py-3 text-gray-300">{eq.team}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
