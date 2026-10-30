import { CheckCheck } from 'lucide-react';

// Shared two-column layout for the login and register pages
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600">
            <CheckCheck className="h-6 w-6" />
          </span>
          <span className="text-xl font-extrabold tracking-tight">TaskFlow</span>
        </div>
        <div>
          <h2 className="max-w-md text-4xl font-extrabold leading-tight tracking-tight">Know what needs doing today, and what can wait.</h2>
          <p className="mt-4 max-w-md text-slate-400">Create tasks, set priorities and due dates, and track each one from pending to done.</p>
        </div>
        <p className="text-sm text-slate-500">Your tasks are private to your account.</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white">
              <CheckCheck className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">TaskFlow</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-2 text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>
        </div>
      </div>
    </div>
  );
}
