import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getCalendarEvents } from "../api/maintenanceApi";

const STATUS_EVENT_COLORS = { NEW: "#3b82f6", IN_PROGRESS: "#f59e0b", REPAIRED: "#10b981", SCRAP: "#ef4444" };

export default function CalendarView() {
  const navigate = useNavigate();
  const calRef = useRef(null);
  const [events, setEvents] = useState([]);

  const loadEvents = async (start, end) => {
    try {
      const data = await getCalendarEvents(
        start.toISOString().split("T")[0],
        end.toISOString().split("T")[0]
      );
      setEvents(data.map(r => ({
        id: String(r.id),
        title: r.subject,
        date: r.scheduledDate,
        backgroundColor: STATUS_EVENT_COLORS[r.status] || "#6b7280",
        borderColor: "transparent",
        extendedProps: r,
      })));
    } catch { }
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Maintenance Calendar</h1>
        <p className="text-sm text-gray-400 mt-0.5">Preventive maintenance schedule</p>
      </div>

      <div className="calendar-wrapper bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <FullCalendar
          ref={calRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={events}
          datesSet={({ start, end }) => loadEvents(start, end)}
          dateClick={({ dateStr }) => navigate(`/maintenance/new?scheduledDate=${dateStr}&type=PREVENTIVE`)}
          eventClick={({ event }) => navigate(`/maintenance/${event.id}`)}
          headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,dayGridWeek" }}
          eventDisplay="block"
          dayMaxEvents={3}
        />
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400">
        {Object.entries(STATUS_EVENT_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            {status.replace("_", " ")}
          </div>
        ))}
      </div>
    </div>
  );
}
