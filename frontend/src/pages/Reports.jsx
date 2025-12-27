import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Reports() {
  // 🔧 Dummy aggregated data
  const requestsPerTeam = [
    { team: "Mechanical", count: 8 },
    { team: "Production", count: 5 },
    { team: "Utilities", count: 3 },
  ];

  const requestsPerEquipment = [
    { name: "Hydraulic Press", value: 6 },
    { name: "CNC Machine", value: 5 },
    { name: "Air Compressor", value: 5 },
  ];

  const COLORS = ["#3b82f6", "#22c55e", "#facc15", "#ef4444"];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold text-white">
        Maintenance Reports
      </h1>

      {/* 📊 Requests per Team */}
      <div className="bg-[#1f1f1f] border border-gray-700 rounded-lg p-6">
        <h2 className="text-lg text-white mb-4">
          Requests per Team
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={requestsPerTeam}>
              <XAxis dataKey="team" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🥧 Requests per Equipment */}
      <div className="bg-[#1f1f1f] border border-gray-700 rounded-lg p-6">
        <h2 className="text-lg text-white mb-4">
          Requests per Equipment
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={requestsPerEquipment}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {requestsPerEquipment.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
