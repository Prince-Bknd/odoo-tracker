import { NavLink } from "react-router-dom";
import { Wrench, Calendar, BarChart2, Package, Users, Layout } from "lucide-react";

const navItems = [
  { section: "Assets", links: [{ to: "/equipment", label: "Equipment", icon: Package }, { to: "/teams", label: "Teams", icon: Users }] },
  { section: "Maintenance", links: [{ to: "/maintenance", label: "Requests", icon: Wrench, end: true }, { to: "/maintenance/board", label: "Board", icon: Layout }, { to: "/calendar", label: "Calendar", icon: Calendar }] },
  { section: "Analytics", links: [{ to: "/reports", label: "Reports", icon: BarChart2 }] },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Wrench size={16} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">GearGuard</p>
            <p className="text-gray-500 text-xs">Maintenance Tracker</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map(({ section, links }) => (
          <div key={section} className="mb-4">
            <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-widest text-gray-600">{section}</p>
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? "bg-blue-600/20 text-blue-400 font-medium" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
                <Icon size={15} />{label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-gray-800">
        <p className="text-xs text-gray-600">v1.0.0 · GearGuard</p>
      </div>
    </aside>
  );
}
