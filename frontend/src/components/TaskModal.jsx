import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, X } from 'lucide-react';
import { createTask, updateTask } from '../services/taskService.js';
import { getErrorMessage } from '../services/api.js';
import { PRIORITIES, STATUSES, toDateInput } from '../utils/helpers.js';

const emptyForm = { title: '', description: '', status: 'Pending', priority: 'Medium', dueDate: '' };

export default function TaskModal({ open, task, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const editing = Boolean(task);

  useEffect(() => {
    if (!open) return;
    setError('');
    setForm(
      task
        ? {
            title: task.title,
            description: task.description || '',
            status: task.status,
            priority: task.priority,
            dueDate: toDateInput(task.dueDate),
          }
        : emptyForm
    );
  }, [open, task]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required');

    setSaving(true);
    setError('');
    try {
      const payload = { ...form, title: form.title.trim(), dueDate: form.dueDate || null };
      const saved = editing ? await updateTask(task._id, payload) : await createTask(payload);
      toast.success(editing ? 'Task updated' : 'Task created');
      onSaved(saved);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:max-w-lg sm:rounded-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 id="task-modal-title" className="text-lg font-bold text-slate-900">{editing ? 'Edit task' : 'New task'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={submit} className="space-y-4 px-6 py-5">
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">{error}</p>}

          <div>
            <label htmlFor="title" className="label">Title</label>
            <input id="title" name="title" value={form.title} onChange={change} maxLength={120} className="input" placeholder="e.g. Finish project report" autoFocus />
          </div>

          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea id="description" name="description" value={form.description} onChange={change} maxLength={1000} rows={3} className="input resize-none" placeholder="Add any details you need" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="status" className="label">Status</label>
              <select id="status" name="status" value={form.status} onChange={change} className="input">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="label">Priority</label>
              <select id="priority" name="priority" value={form.priority} onChange={change} className="input">
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className="label">Due date</label>
            <input id="dueDate" type="date" name="dueDate" value={form.dueDate} onChange={change} className="input" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
