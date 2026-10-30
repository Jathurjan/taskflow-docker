import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AlertTriangle, CheckCircle2, ClipboardList, Hourglass, Plus, PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getStats } from '../services/taskService.js';
import { getErrorMessage } from '../services/api.js';
import StatCard from '../components/StatCard.jsx';
import TaskModal from '../components/TaskModal.jsx';
import Spinner from '../components/Spinner.jsx';
import { PriorityBadge, StatusBadge } from '../components/Badges.jsx';
import { formatDate, isOverdue } from '../utils/helpers.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setData(await getStats());
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Spinner />;
  if (!data) return <p className="py-16 text-center text-slate-500">Could not load your dashboard. Refresh to try again.</p>;

  const { stats, recent } = data;
  const rate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Hello, {user.name.split(' ')[0]}</h1>
          <p className="mt-1 text-slate-500">
            {stats.pending + stats.inProgress === 0
              ? 'Nothing left to do. Add a task to get started.'
              : `You have ${stats.pending + stats.inProgress} open ${stats.pending + stats.inProgress === 1 ? 'task' : 'tasks'}.`}
            {stats.overdue > 0 && <span className="font-semibold text-red-600"> {stats.overdue} overdue.</span>}
          </p>
        </div>
        <button className="btn-primary self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> New task
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tasks" value={stats.total} icon={ClipboardList} tone="bg-slate-100 text-slate-700" to="/tasks" />
        <StatCard label="Pending" value={stats.pending} icon={Hourglass} tone="bg-amber-50 text-amber-600" to="/tasks?status=Pending" />
        <StatCard label="In progress" value={stats.inProgress} icon={PlayCircle} tone="bg-sky-50 text-sky-600" to="/tasks?status=In Progress" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-600" to="/tasks?status=Completed" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">Recent tasks</h2>
            <Link to="/tasks" className="text-sm font-semibold text-teal-700 hover:underline">View all</Link>
          </div>

          {recent.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="font-semibold text-slate-700">No tasks yet</p>
              <p className="mt-1 text-sm text-slate-500">Create your first task to see it here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((task) => (
                <li key={task._id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className={`truncate font-semibold ${task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</p>
                    <p className={`mt-0.5 text-xs font-medium ${isOverdue(task) ? 'text-red-600' : 'text-slate-500'}`}>
                      {isOverdue(task) ? 'Overdue: ' : 'Due: '}{formatDate(task.dueDate)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <h2 className="font-bold text-slate-900">Progress</h2>
          <p className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">{rate}%</p>
          <p className="mt-1 text-sm text-slate-500">of your tasks are completed</p>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={rate} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-teal-600 transition-all duration-500" style={{ width: `${rate}%` }} />
          </div>
          {stats.overdue > 0 && (
            <Link to="/tasks" className="mt-5 flex items-center gap-2 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-semibold text-red-700">
              <AlertTriangle className="h-4 w-4" /> {stats.overdue} overdue {stats.overdue === 1 ? 'task' : 'tasks'}
            </Link>
          )}
        </section>
      </div>

      <TaskModal
        open={modalOpen}
        task={null}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false);
          load();
        }}
      />
    </div>
  );
}
