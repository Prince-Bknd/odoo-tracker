export default function Header() {
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-800">
        GearGuard – Maintenance Tracker
      </h1>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Technician</span>
        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
          T
        </div>
      </div>
    </header>
  );
}
