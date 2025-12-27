import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./KanbanCard";

export default function KanbanColumn({ status, tasks }) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className="bg-[#1f1f1f] border border-gray-700 rounded-lg p-3 min-h-[500px]"
    >
      <h2 className="text-gray-300 font-semibold mb-3">{status}</h2>

      <div className="space-y-3">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
