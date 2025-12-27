import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function EquipmentDetail() {
  const { id } = useParams();
  const equipmentId = id || 1; // Fallback to 1 for development/dummy data

  const [equipment, setEquipment] = useState(null);
  const [openCount, setOpenCount] = useState(0);

  useEffect(() => {
    if (equipmentId) {
      fetchEquipment();
      fetchMaintenanceCount();
    }
  }, [equipmentId]);

  const fetchEquipment = async () => {
    try {
      setEquipment({
        id: 1,
        name: "Hydraulic Press",
        serial: "HP-2024-01",
        department: "Manufacturing",
        owner: "Plant A",
        location: "Block 3",
        team: "Mechanical",
        technician: "Rahul",
        scrapped: false, // 🔴 IMPORTANT
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMaintenanceCount = async () => {
    try {
      setOpenCount(3);
    } catch (err) {
      console.error(err);
    }
  };

  const openMaintenanceList = () => {
    if (equipment.scrapped) return;
    alert("Open Maintenance list filtered by this equipment");
  };

  // ✅ SCRAP ACTION (MUST BE INSIDE COMPONENT)
  const scrapEquipment = async () => {
    if (!window.confirm("This will scrap the equipment permanently. Continue?"))
      return;

    try {
      // await api.patch(`/equipment/${equipment.id}/scrap`);

      setEquipment((prev) => ({
        ...prev,
        scrapped: true,
      }));
    } catch (err) {
      console.error("Scrap failed", err);
    }
  };

  if (!equipment) {
    return <div className="p-6 text-gray-400">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header + Buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">
          {equipment.name}
        </h1>

        <div className="flex gap-3">
          {/* 🔧 SMART BUTTON */}
          <button
            disabled={equipment.scrapped}
            onClick={openMaintenanceList}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border
              ${
                equipment.scrapped
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
              }`}
          >
            🔧 Maintenance
            <span className="bg-blue-600 text-white text-sm px-2 py-0.5 rounded-full">
              {openCount}
            </span>
          </button>

          {/* ⚠ SCRAP BUTTON */}
          {!equipment.scrapped && (
            <button
              onClick={scrapEquipment}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-md"
            >
              ⚠ Scrap Equipment
            </button>
          )}
        </div>
      </div>

      {/* 🔴 SCRAP WARNING */}
      {equipment.scrapped && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 p-4 rounded">
          ⚠ Equipment Scrapped — No further maintenance allowed
        </div>
      )}

      {/* Equipment Info */}
      <div className="bg-[#1f1f1f] border border-gray-700 rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4 text-gray-300">
          <Info label="Serial Number" value={equipment.serial} />
          <Info label="Department" value={equipment.department} />
          <Info label="Owner" value={equipment.owner} />
          <Info label="Location" value={equipment.location} />
          <Info label="Maintenance Team" value={equipment.team} />
          <Info label="Default Technician" value={equipment.technician} />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  );
}
