import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import Equipment from "./pages/Equipment";
import EquipmentDetail from "./pages/EquipmentDetail";
import EquipmentForm from "./pages/EquipmentForm";
import Teams from "./pages/Teams";
import Maintenance from "./pages/Maintenance";
import MaintenanceForm from "./pages/MaintenanceForm";
import MaintenanceBoard from "./pages/MaintenanceBoard";
import CalendarView from "./pages/CalendarView";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/equipment" replace />} />

          {/* Equipment — specific before wildcard */}
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/equipment/new" element={<EquipmentForm />} />
          <Route path="/equipment/:id/edit" element={<EquipmentForm />} />
          <Route path="/equipment/:id" element={<EquipmentDetail />} />

          {/* Teams */}
          <Route path="/teams" element={<Teams />} />

          {/* Maintenance — board and new BEFORE /:id */}
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/maintenance/board" element={<MaintenanceBoard />} />
          <Route path="/maintenance/new" element={<MaintenanceForm />} />
          <Route path="/maintenance/:id" element={<MaintenanceForm />} />

          {/* Calendar & Reports */}
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
