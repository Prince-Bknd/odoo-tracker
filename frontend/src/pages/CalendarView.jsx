import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import api from "../api/api";

export default function CalendarView() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      // 🔗 Backend API
      // const res = await api.get("/maintenance/calendar");

      // Dummy Preventive data
      const res = {
        data: [
          {
            id: 1,
            subject: "Monthly Lubrication",
            date: "2025-01-05",
            equipment: "Hydraulic Press",
          },
          {
            id: 2,
            subject: "Quarterly Inspection",
            date: "2025-01-12",
            equipment: "CNC Machine",
          },
        ],
      };

      setEvents(
        res.data.map((item) => ({
          id: item.id,
          title: `${item.subject} • ${item.equipment}`,
          date: item.date,
        }))
      );
    } catch (err) {
      console.error("Calendar fetch failed", err);
    }
  };

  const handleDateClick = (info) => {
    // Navigate to Maintenance Form
    alert(`Create Preventive Maintenance on ${info.dateStr}`);
  };

  const handleEventClick = (info) => {
    alert(`Open Maintenance ID: ${info.event.id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-6">
        Preventive Maintenance Calendar
      </h1>

      <div className="bg-[#1f1f1f] border border-gray-700 rounded-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
        />
      </div>
    </div>
  );
}
