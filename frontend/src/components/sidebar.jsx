import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Wrench, Calendar, BarChart2, Package, Users,
  Layout, PanelLeftClose, PanelLeftOpen, MoreHorizontal
} from "lucide-react";

const navSections = [
  {
    section: "Assets",
    links: [
      { to: "/equipment", label: "Equipment", icon: Package, badge: "8", badgeColor: "blue" },
      { to: "/teams", label: "Teams", icon: Users },
    ],
  },
  {
    section: "Maintenance",
    links: [
      { to: "/maintenance", label: "Requests", icon: Wrench, end: true, badge: "3", badgeColor: "red" },
      { to: "/maintenance/board", label: "Board", icon: Layout },
      { to: "/calendar", label: "Calendar", icon: Calendar },
    ],
  },
  {
    section: "Analytics",
    links: [
      { to: "/reports", label: "Reports", icon: BarChart2 },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="shrink-0 bg-[#0d1117] border-r border-gray-800 flex flex-col h-full transition-all duration-250 ease-in-out"
      style={{ width: collapsed ? "56px" : "220px" }}
    >
      
      <div className="flex items-center border-b border-gray-800"
        style={{ height: "60px", padding: collapsed ? "0 12px" : "0 16px", justifyContent: collapsed ? "center" : "space-between" }}>
        
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Wrench size={15} className="text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-medium text-white text-[13px] leading-tight whitespace-nowrap">GearGuard</p>
              <p className="text-gray-500 text-[11px] whitespace-nowrap">Maintenance Tracker</p>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
            className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-800 text-gray-600 hover:text-gray-300 hover:bg-gray-800 transition-colors shrink-0 ml-2"
          >
            <PanelLeftClose size={14} />
          </button>
        )}
      </div>

      
      <nav className="flex-1 overflow-y-auto" style={{ padding: "12px 8px" }}>

        
        {collapsed && (
          <div className="flex justify-center mb-3">
            <button
              onClick={() => setCollapsed(false)}
              title="Expand sidebar"
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-800 text-gray-600 hover:text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <PanelLeftOpen size={14} />
            </button>
          </div>
        )}

        {navSections.map(({ section, links }) => (
          <div key={section} style={{ marginBottom: "20px" }}>

            
            {!collapsed && (
              <p style={{
                padding: "0 8px",
                marginBottom: "4px",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#374151",
                whiteSpace: "nowrap",
              }}>
                {section}
              </p>
            )}

            {collapsed && (
              <div style={{ height: "1px", background: "#1f2937", margin: "0 4px 8px" }} />
            )}

            {links.map(({ to, label, icon: Icon, end, badge, badgeColor }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  `flex items-center rounded-lg transition-colors mb-0.5
                  ${isActive
                    ? "bg-blue-600/10 text-blue-400"
                    : "text-gray-500 hover:bg-gray-800/80 hover:text-gray-200"
                  }`
                }
                style={{
                  padding: collapsed ? "9px 0" : "8px 10px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  gap: collapsed ? 0 : "10px",
                }}
              >
                <Icon size={16} className="shrink-0" />
                {!collapsed && (
                  <>
                    <span style={{ fontSize: "13px", flex: 1, whiteSpace: "nowrap" }}>{label}</span>
                    {badge && (
                      <span style={{
                        fontSize: "11px",
                        padding: "1px 7px",
                        borderRadius: "20px",
                        background: badgeColor === "red" ? "rgba(239,68,68,0.1)" : "rgba(37,99,235,0.12)",
                        color: badgeColor === "red" ? "#f87171" : "#93c5fd",
                        border: `0.5px solid ${badgeColor === "red" ? "rgba(248,113,113,0.2)" : "rgba(96,165,250,0.2)"}`,
                      }}>
                        {badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div style={{ padding: "8px", borderTop: "0.5px solid #1f2937" }}>
        <div
          className="flex items-center rounded-lg bg-gray-900"
          style={{
            padding: collapsed ? "8px 0" : "8px 10px",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: collapsed ? 0 : "10px",
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "#1d4ed8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: 500, color: "#bfdbfe",
            flexShrink: 0,
          }}>T</div>

          {!collapsed && (
            <>
              <div className="overflow-hidden flex-1">
                <p style={{ fontSize: "12px", fontWeight: 500, color: "#e5e7eb", margin: 0, whiteSpace: "nowrap" }}>Technician</p>
                <p style={{ fontSize: "11px", color: "#4b5563", margin: 0, whiteSpace: "nowrap" }}>v1.0.0 · GearGuard</p>
              </div>
              <MoreHorizontal size={14} className="text-gray-600 shrink-0" />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}