import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import KanbanColumn from "../components/kanban/KanbanColumn";
import api from "../api/api";

const STATUSES = ["New", "In Progress", "Repaired", "Scrap"];

export default function MaintenanceBoard() {
  const [tasks, setTasks] = useState([
    {
      id: "1",
      subject: "Oil Leakage",
      equipment: "Hydraulic Press",
      technician: "Rahul",
      scheduledDate: "2025-01-01",
      status: "New",
    },
    {
      id: "2",
      subject: "Bearing Noise",
      equipment: "CNC Machine",
      technician: "Amit",
      scheduledDate: "2024-12-25",
      status: "In Progress",
    },
    {
      id: "3",
      subject: "Routine Check",
      equipment: "Air Compressor",
      technician: "Suresh",
      scheduledDate: "2024-12-10",
      status: "Scrap",
    },
  ]);

  const onDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );

    try {
      // 🔗 Backend API
      // await api.patch(`/maintenance/${taskId}/status`, {
      //   status: newStatus,
      // });

      console.log(`Updated ${taskId} → ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-6">
        Maintenance Board
      </h1>

      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {STATUSES.map((status) => (
            <SortableContext
              key={status}
              items={tasks.filter((t) => t.status === status).map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                status={status}
                tasks={tasks.filter((t) => t.status === status)}
              />
            </SortableContext>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
