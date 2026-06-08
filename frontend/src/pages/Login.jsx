import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      showToast('Logged in successfully');
      navigate(from, { replace: true });
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell className="auth-page">
      <div className="auth-card glass-card">
        <div className="auth-brand">
          <span className="brand-dot" />
          <span className="brand-label">Primetrade</span>
        </div>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to manage your tasks</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="auth-footer">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </PageShell>
  );
}
