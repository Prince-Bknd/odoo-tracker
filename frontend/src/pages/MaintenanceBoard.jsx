import { useEffect, useState, useCallback } from "react";
import { getAllRequests, updateRequestStatus } from "../api/maintenanceApi";
import { useNavigate } from "react-router-dom";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCenter, useDroppable, useDraggable,
} from "@dnd-kit/core";
import { Plus } from "lucide-react";

const COLUMNS = [
  { id: "NEW", label: "New", color: "border-t-blue-500" },
  { id: "IN_PROGRESS", label: "In Progress", color: "border-t-yellow-500" },
  { id: "REPAIRED", label: "Repaired", color: "border-t-emerald-500" },
  { id: "SCRAP", label: "Scrap", color: "border-t-red-500" },
];

export default function MaintenanceBoard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActive] = useState(null);
  const [dragError, setError] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try { setTasks(await getAllRequests()); }
    catch { setError("Failed to load tasks."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const onDragStart = ({ active }) => setActive(tasks.find(t => String(t.id) === String(active.id)) || null);
  const onDragEnd = async ({ active, over }) => {
    setActive(null);
    if (!over) return;
    const taskId = active.id;
    const colId = over.id;
    const newStat = COLUMNS.find(c => c.id === colId)?.id;
    if (!newStat) return;
    const task = tasks.find(t => String(t.id) === String(taskId));
    if (!task || task.status === newStat) return;
    setTasks(p => p.map(t => String(t.id) === String(taskId) ? { ...t, status: newStat } : t));
    try { await updateRequestStatus(taskId, newStat); }
    catch (err) {
      setTasks(p => p.map(t => String(t.id) === String(taskId) ? { ...t, status: task.status } : t));
      setError(err.response?.data?.message || "Failed to update status.");
    }
  };

  if (loading) return (
    <div className="p-6 grid grid-cols-4 gap-4">
      {COLUMNS.map(c => <div key={c.id} className="h-96 bg-gray-800 rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Maintenance Board</h1>
          <p className="text-sm text-gray-400 mt-0.5">{tasks.length} requests</p></div>
        <button onClick={() => navigate("/maintenance/new")} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium">
          <Plus size={15} /> New Request
        </button>
      </div>
      {dragError && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 text-sm px-4 py-2 rounded-lg flex items-center justify-between">
          {dragError} <button onClick={() => setError(null)} className="ml-4 text-red-300 hover:text-white">✕</button>
        </div>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-4 gap-4 items-start">
          {COLUMNS.map(col => (
            <DroppableColumn key={col.id} col={col} tasks={tasks.filter(t => t.status === col.id)} navigate={navigate} />
          ))}
        </div>
        <DragOverlay>{activeTask ? <KanbanCard task={activeTask} isDragging /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}

function DroppableColumn({ col, tasks, navigate }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });
  return (
    <div ref={setNodeRef} className={`rounded-xl border border-gray-700 border-t-4 ${col.color} min-h-[400px] transition-colors ${isOver ? "bg-gray-800/80" : "bg-gray-800/40"}`}>
      <div className="px-4 py-3 border-b border-gray-700/60 flex items-center justify-between">
        <span className="font-semibold text-white text-sm">{col.label}</span>
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{tasks.length}</span>
      </div>
      <div className="p-3 space-y-2">
        {tasks.map(task => <DraggableCard key={task.id} task={task} navigate={navigate} />)}
        {tasks.length === 0 && <div className="text-center py-8 text-gray-600 text-sm">Drop here</div>}
      </div>
    </div>
  );
}

function DraggableCard({ task, navigate }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: String(task.id) });
  const style = transform ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)`, zIndex: 50, opacity: 0.3 } : {};
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <KanbanCard task={task} navigate={navigate} />
    </div>
  );
}

function KanbanCard({ task, navigate, isDragging }) {
  return (
    <div onClick={e => { e.stopPropagation(); navigate && navigate(`/maintenance/${task.id}`); }}
      className={`rounded-lg border p-3 cursor-pointer select-none transition-all ${isDragging ? "shadow-2xl scale-105" : "shadow-sm hover:shadow-md hover:-translate-y-0.5"} ${task.isOverdue ? "bg-red-900/20 border-red-700 hover:border-red-500" : "bg-gray-900 border-gray-700 hover:border-gray-500"}`}>
      {task.isOverdue && <div className="text-xs text-red-400 font-semibold mb-1.5">⏰ Overdue</div>}
      <p className="text-sm font-medium text-white leading-snug">{task.subject}</p>
      {task.equipmentName && <p className="text-xs text-gray-400 mt-1 truncate">📦 {task.equipmentName}</p>}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500 truncate max-w-[120px]">{task.teamName || "No team"}</span>
        {task.technician && (
          <div title={task.technician} className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {task.technician.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      {task.scheduledDate && <p className="text-xs text-gray-500 mt-1.5">📅 {task.scheduledDate}</p>}
    </div>
  );
}
