import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, ClipboardList, LayoutGrid, Plus, Search, Table2 } from 'lucide-react';
import { deleteTask, getTasks, updateTaskStatus } from '../services/taskService.js';
import { getErrorMessage } from '../services/api.js';
import useDebounce from '../hooks/useDebounce.js';
import TaskCard from '../components/TaskCard.jsx';
import TaskTable from '../components/TaskTable.jsx';
import TaskModal from '../components/TaskModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Spinner from '../components/Spinner.jsx';
import { PRIORITIES, STATUSES } from '../utils/helpers.js';

const PAGE_SIZE = 9;

export default function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') || '';

  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [view, setView] = useState('grid');

  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({ open: false, task: null });
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTasks({
        search: debouncedSearch || undefined,
        status: status || undefined,
        priority: priority || undefined,
        sort,
        page,
        limit: PAGE_SIZE,
      });
      if (data.tasks.length === 0 && page > 1) {
        setPage((p) => p - 1); // last item on the page was removed
        return;
      }
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, priority, sort, page]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = (value) => {
    setSearchParams(value ? { status: value } : {});
    setPage(1);
  };

  const onFilter = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setPriority('');
    setSort('newest');
    setSearchParams({});
    setPage(1);
  };

  const toggleComplete = async (task) => {
    try {
      await updateTaskStatus(task._id, task.status === 'Completed' ? 'Pending' : 'Completed');
      toast.success(task.status === 'Completed' ? 'Task reopened' : 'Task completed');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(toDelete._id);
      toast.success('Task deleted');
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const filtersActive = Boolean(search || status || priority || sort !== 'newest');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">My tasks</h1>
          <p className="mt-1 text-slate-500">{pagination.total} {pagination.total === 1 ? 'task' : 'tasks'}{filtersActive ? ' match your filters' : ''}</p>
        </div>
        <button className="btn-primary self-start" onClick={() => setModal({ open: true, task: null })}>
          <Plus className="h-4 w-4" /> New task
        </button>
      </div>

      <div className="card flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={onFilter(setSearch)}
            className="input pl-10"
            placeholder="Search by title or description"
            aria-label="Search tasks"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input lg:w-40" aria-label="Filter by status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={priority} onChange={onFilter(setPriority)} className="input lg:w-40" aria-label="Filter by priority">
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select value={sort} onChange={onFilter(setSort)} className="input lg:w-40" aria-label="Sort tasks">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title A to Z</option>
        </select>
        <div className="flex rounded-lg border border-slate-300 p-0.5" role="group" aria-label="View">
          {[['grid', LayoutGrid, 'Card view'], ['table', Table2, 'Table view']].map(([key, Icon, label]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              aria-label={label}
              aria-pressed={view === key}
              className={`rounded-md p-2 ${view === key ? 'bg-teal-700 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : tasks.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <ClipboardList className="h-7 w-7" />
          </span>
          <h2 className="mt-4 font-bold text-slate-900">{filtersActive ? 'No tasks match your filters' : 'No tasks yet'}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {filtersActive ? 'Try a different search or clear the filters.' : 'Create your first task to start tracking your work.'}
          </p>
          {filtersActive ? (
            <button className="btn-secondary mt-5" onClick={clearFilters}>Clear filters</button>
          ) : (
            <button className="btn-primary mt-5" onClick={() => setModal({ open: true, task: null })}><Plus className="h-4 w-4" /> New task</button>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onToggle={toggleComplete} onEdit={(t) => setModal({ open: true, task: t })} onDelete={setToDelete} />
          ))}
        </div>
      ) : (
        <TaskTable tasks={tasks} onToggle={toggleComplete} onEdit={(t) => setModal({ open: true, task: t })} onDelete={setToDelete} />
      )}

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Page {pagination.page} of {pagination.pages}</p>
          <div className="flex gap-2">
            <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <button className="btn-secondary" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <TaskModal
        open={modal.open}
        task={modal.task}
        onClose={() => setModal({ open: false, task: null })}
        onSaved={() => {
          setModal({ open: false, task: null });
          load();
        }}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this task?"
        message={toDelete ? `"${toDelete.title}" will be permanently removed.` : ''}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
