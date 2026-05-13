import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 shrink-0 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Technician</span>
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center font-bold text-white text-sm">T</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden"><Outlet /></main>
      </div>
    </div>
  );
}
