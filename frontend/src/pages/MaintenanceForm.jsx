import { useEffect, useState } from "react";
import api from "../api/api";

export default function MaintenanceForm() {
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null); // 🟢 NEW
  const [form, setForm] = useState({
    subject: "",
    type: "Corrective",
    equipmentId: "",
    team: "",
    technician: "",
    scheduledDate: "",
    duration: "",
  });

  // Load equipment list
  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    try {
      // const res = await api.get("/equipments");
      // setEquipments(res.data);

      // 🔧 Dummy data WITH scrap flag
      setEquipments([
        { id: 1, name: "Hydraulic Press", scrapped: false },
        { id: 2, name: "CNC Machine", scrapped: true }, // 🔴 SCRAPPED
        { id: 3, name: "Air Compressor", scrapped: false },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-fill team & technician
  const handleEquipmentChange = async (e) => {
    const equipmentId = e.target.value;

    const eq = equipments.find((e) => e.id == equipmentId);
    setSelectedEquipment(eq); // 🟢 STORE SELECTED EQUIPMENT

    setForm((prev) => ({
      ...prev,
      equipmentId,
      team: "",
      technician: "",
    }));

    if (!equipmentId || eq?.scrapped) return;

    try {
      // const res = await api.get(`/equipments/${equipmentId}`);

      // Dummy response
      const res = {
        team: "Mechanical",
        technician: "Rahul",
      };

      setForm((prev) => ({
        ...prev,
        team: res.team,
        technician: res.technician,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedEquipment?.scrapped) return; // 🛑 FINAL BLOCK

    const payload = {
      subject: form.subject,
      type: form.type,
      equipmentId: form.equipmentId,
      team: form.team,
      technician: form.technician,
      scheduledDate: form.scheduledDate,
      duration: form.duration,
    };

    try {
      // await api.post("/maintenance", payload);
      console.log("Submitting maintenance request:", payload);
      alert("Maintenance request created!");
    } catch (err) {
      console.error(err);
      alert("Error creating request");
    }
  };

  // 🔴 IF SCRAPPED → BLOCK UI COMPLETELY
  if (selectedEquipment?.scrapped) {
    return (
      <div className="p-6 max-w-3xl bg-red-900/30 border border-red-700 rounded">
        <h2 className="text-red-400 text-xl font-semibold mb-2">
          ⚠ Equipment Scrapped
        </h2>
        <p className="text-red-300">
          Maintenance requests cannot be created for scrapped equipment.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold text-white mb-6">
        Create Maintenance Request
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#1f1f1f] border border-gray-700 rounded-lg p-6 space-y-4"
      >
        {/* Subject */}
        <Field label="Subject">
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="input"
          />
        </Field>

        {/* Request Type */}
        <Field label="Request Type">
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="input"
          >
            <option value="Corrective">Corrective</option>
            <option value="Preventive">Preventive</option>
          </select>
        </Field>

        {/* Equipment */}
        <Field label="Equipment">
          <select
            value={form.equipmentId}
            onChange={handleEquipmentChange}
            required
            className="input"
          >
            <option value="">Select Equipment</option>
            {equipments.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.name} {eq.scrapped ? "(Scrapped)" : ""}
              </option>
            ))}
          </select>
        </Field>

        {/* Auto-filled fields */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Maintenance Team">
            <input
              type="text"
              value={form.team}
              disabled
              className="input bg-gray-800"
            />
          </Field>

          <Field label="Technician">
            <input
              type="text"
              value={form.technician}
              disabled
              className="input bg-gray-800"
            />
          </Field>
        </div>

        {/* Scheduled Date */}
        <Field label="Scheduled Date">
          <input
            type="date"
            name="scheduledDate"
            value={form.scheduledDate}
            onChange={handleChange}
            className="input"
          />
        </Field>

        {/* Duration */}
        <Field label="Duration (hours)">
          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="input"
          />
        </Field>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            disabled={selectedEquipment?.scrapped}
            className={`px-6 py-2 rounded-md text-white
              ${
                selectedEquipment?.scrapped
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            Create Request
          </button>
        </div>
      </form>
    </div>
  );
}

/* 🔹 Small reusable components */

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  );
}
