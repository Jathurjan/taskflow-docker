import { useState } from 'react';
import { ChevronDown, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { initials } from '../utils/helpers.js';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button className="icon-btn lg:hidden" onClick={onMenuClick} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <p className="hidden text-sm font-medium text-slate-500 sm:block">{today}</p>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-100"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
            {initials(user?.name)}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold leading-tight text-slate-800">{user?.name}</span>
            <span className="block text-xs text-slate-500">{user?.email}</span>
          </span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
            <div role="menu" className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
              <div className="border-b border-slate-100 px-3 py-2.5 sm:hidden">
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                role="menuitem"
                onClick={logout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
