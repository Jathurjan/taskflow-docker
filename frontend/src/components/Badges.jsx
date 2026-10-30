const statusStyles = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'In Progress': 'bg-sky-50 text-sky-700 ring-sky-600/20',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
};

const priorityStyles = {
  Low: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  Medium: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  High: 'bg-red-50 text-red-700 ring-red-600/20',
};

const base = 'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset';

export const StatusBadge = ({ status }) => <span className={`${base} ${statusStyles[status]}`}>{status}</span>;
export const PriorityBadge = ({ priority }) => <span className={`${base} ${priorityStyles[priority]}`}>{priority} priority</span>;
