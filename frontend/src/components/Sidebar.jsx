import { NavLink } from 'react-router-dom';
import { CheckCheck, LayoutDashboard, ListChecks, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'My tasks', icon: ListChecks },
];

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth();

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-300 transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white">
              <CheckCheck className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white">TaskFlow</span>
          </div>
          <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 lg:hidden" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-teal-600/20 text-teal-300' : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
