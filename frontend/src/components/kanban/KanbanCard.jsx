import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function KanbanCard({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
    disabled: task.status === "Scrap", // 🛑 DISABLE DRAG FOR SCRAP
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue =
    new Date(task.scheduledDate) < new Date() &&
    task.status !== "Repaired" &&
    task.status !== "Scrap";

  const statusColor = {
    New: "border-blue-500",
    "In Progress": "border-yellow-500",
    Repaired: "border-green-500",
    Scrap: "border-gray-600",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(task.status !== "Scrap" ? listeners : {})}
      className={`p-3 rounded-md border-l-4
        ${statusColor[task.status]}
        ${task.status === "Scrap" ? "opacity-50 cursor-not-allowed" : "cursor-grab"}
        ${isOverdue ? "border-red-600" : ""}
        bg-[#2a2a2a]`}
    >
      {/* 🔴 SCRAP WARNING */}
      {task.status === "Scrap" && (
        <div className="text-red-400 text-xs mb-1">
          ⚠ Equipment Scrapped
        </div>
      )}

      <h3 className="text-white font-medium">{task.subject}</h3>

      <p className="text-sm text-gray-400">{task.equipment}</p>

      <div className="flex items-center justify-between mt-3">
        {/* Technician Avatar */}
        <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
          {task.technician[0]}
        </div>

        <span className="text-xs text-gray-400">
          {task.scheduledDate}
        </span>
      </div>
    </div>
  );
}
