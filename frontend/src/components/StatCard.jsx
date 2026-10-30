import { Link } from 'react-router-dom';

export default function StatCard({ label, value, icon: Icon, tone, to }) {
  const content = (
    <div className="card flex items-center gap-4 p-5 transition-colors hover:border-slate-300">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone}`}>
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="text-3xl font-extrabold leading-none tracking-tight text-slate-900">{value}</p>
        <p className="mt-1.5 text-sm font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}
