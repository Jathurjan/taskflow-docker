import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-extrabold tracking-tight text-teal-700">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-500">The page you are looking for does not exist or was moved.</p>
      <Link to="/dashboard" className="btn-primary mt-6">Go to dashboard</Link>
    </div>
  );
}
