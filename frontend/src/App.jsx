import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Equipment from "./pages/Equipment";
import EquipmentDetail from "./pages/EquipmentDetail";
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
          <Route path="/" element={<Equipment />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/equipment/:id" element={<EquipmentDetail />} />

          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/maintenance/new" element={<MaintenanceForm />} />
          <Route path="/maintenance/board" element={<MaintenanceBoard />} />

          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
