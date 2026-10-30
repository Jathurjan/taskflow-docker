import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../services/api.js';
import AuthShell from './AuthShell.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) return setError('Enter your email and password');
    setLoading(true);
    setError('');
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Log in"
      subtitle="Welcome back. Pick up where you left off."
      footer={<>New to TaskFlow? <Link to="/register" className="font-semibold text-teal-700 hover:underline">Create an account</Link></>}
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">{error}</p>}
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={change} className="input" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={change} className="input" placeholder="Your password" />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Log in
        </button>
      </form>
    </AuthShell>
  );
}
