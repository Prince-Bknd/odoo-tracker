import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid } from "recharts";
import { reportByTeam, reportByCategory } from "../api/maintenanceApi";
import { getAllRequests } from "../api/maintenanceApi";

const STATUS_COLORS_PIE = { NEW: "#3b82f6", IN_PROGRESS: "#f59e0b", REPAIRED: "#10b981", SCRAP: "#ef4444" };

export default function Reports() {
  const [teamData, setTeamData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([reportByTeam(), reportByCategory(), getAllRequests()])
      .then(([teams, cats, all]) => {
        setTeamData(Object.entries(teams).map(([name, count]) => ({ name, count })));
        setCategoryData(Object.entries(cats).map(([name, count]) => ({ name, count })));
        // Status pie
        const counts = {};
        all.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
        setStatusData(Object.entries(counts).map(([name, value]) => ({ name, value })));
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 grid grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-72 bg-gray-800 rounded-xl animate-pulse" />)}</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
        <p className="text-sm text-gray-400 mt-0.5">Maintenance KPIs and distribution charts</p>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <ChartCard title="Requests by Team">
          {teamData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={teamData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 10 }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </ChartCard>

        <ChartCard title="Requests by Category">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 10 }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }} />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </ChartCard>

        <ChartCard title="Status Distribution">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: "#6b7280" }}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS_PIE[entry.name] || "#6b7280"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
      <h3 className="font-semibold text-white text-sm mb-4">{title}</h3>
      {children}
    </div>
  );
}

function EmptyChart() {
  return <div className="h-[220px] flex items-center justify-center text-gray-500 text-sm">No data yet</div>;
}
