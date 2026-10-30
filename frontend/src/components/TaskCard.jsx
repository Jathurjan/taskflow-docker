import { Calendar, CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';
import { PriorityBadge, StatusBadge } from './Badges.jsx';
import { formatDate, isOverdue } from '../utils/helpers.js';

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const done = task.status === 'Completed';
  const overdue = isOverdue(task);

  return (
    <article className="card flex flex-col p-5">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task)}
          className={`mt-0.5 shrink-0 ${done ? 'text-emerald-600' : 'text-slate-300 hover:text-teal-600'}`}
          aria-label={done ? 'Mark as pending' : 'Mark as completed'}
          title={done ? 'Mark as pending' : 'Mark as completed'}
        >
          {done ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
        </button>
        <div className="min-w-0 flex-1">
          <h3 className={`font-bold leading-snug ${done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</h3>
          {task.description && <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{task.description}</p>}
        </div>
      </div>

      <div className="mb-5 mt-4 flex flex-wrap gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
        <span className={`flex items-center gap-1.5 text-xs font-semibold ${overdue ? 'text-red-600' : 'text-slate-500'}`}>
          <Calendar className="h-4 w-4" />
          {overdue ? `Overdue · ${formatDate(task.dueDate)}` : formatDate(task.dueDate)}
        </span>
        <div className="flex gap-1">
          <button className="icon-btn" onClick={() => onEdit(task)} aria-label="Edit task" title="Edit">
            <Pencil className="h-4 w-4" />
          </button>
          <button className="icon-btn hover:!bg-red-50 hover:!text-red-600" onClick={() => onDelete(task)} aria-label="Delete task" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
