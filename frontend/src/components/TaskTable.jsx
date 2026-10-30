import { CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';
import { PriorityBadge, StatusBadge } from './Badges.jsx';
import { formatDate, isOverdue } from '../utils/helpers.js';

export default function TaskTable({ tasks, onEdit, onDelete, onToggle }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
          <tr>
            <th className="w-12 px-4 py-3" />
            <th className="px-4 py-3 font-semibold">Task</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Priority</th>
            <th className="px-4 py-3 font-semibold">Due date</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => {
            const done = task.status === 'Completed';
            return (
              <tr key={task._id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <button
                    onClick={() => onToggle(task)}
                    className={done ? 'text-emerald-600' : 'text-slate-300 hover:text-teal-600'}
                    aria-label={done ? 'Mark as pending' : 'Mark as completed'}
                  >
                    {done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                  </button>
                </td>
                <td className="max-w-xs px-4 py-3">
                  <p className={`truncate font-semibold ${done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</p>
                  {task.description && <p className="truncate text-xs text-slate-500">{task.description}</p>}
                </td>
                <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                <td className="px-4 py-3"><PriorityBadge priority={task.priority} /></td>
                <td className={`px-4 py-3 font-medium ${isOverdue(task) ? 'text-red-600' : 'text-slate-600'}`}>{formatDate(task.dueDate)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button className="icon-btn" onClick={() => onEdit(task)} aria-label="Edit task"><Pencil className="h-4 w-4" /></button>
                    <button className="icon-btn hover:!bg-red-50 hover:!text-red-600" onClick={() => onDelete(task)} aria-label="Delete task"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
