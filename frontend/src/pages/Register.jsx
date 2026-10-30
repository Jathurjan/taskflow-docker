import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../services/api.js';
import AuthShell from './AuthShell.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Enter a valid email address';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirm) return 'Passwords do not match';
    return '';
  };

  const submit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) return setError(problem);

    setLoading(true);
    setError('');
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      toast.success('Account created');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes less than a minute."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-teal-700 hover:underline">Log in</Link></>}
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">{error}</p>}
        <div>
          <label htmlFor="name" className="label">Full name</label>
          <input id="name" name="name" autoComplete="name" value={form.name} onChange={change} className="input" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={change} className="input" placeholder="you@example.com" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="label">Password</label>
            <input id="password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={change} className="input" placeholder="At least 6 characters" />
          </div>
          <div>
            <label htmlFor="confirm" className="label">Confirm password</label>
            <input id="confirm" name="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={change} className="input" placeholder="Repeat password" />
          </div>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
        </button>
      </form>
    </AuthShell>
  );
}
