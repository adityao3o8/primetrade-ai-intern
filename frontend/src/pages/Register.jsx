import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const { user, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await register(form);
      showToast('Account created successfully');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
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
        <h1>Create account</h1>
        <p className="muted">Get started with your task dashboard</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              placeholder="Your name"
            />
          </div>
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
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </PageShell>
  );
}
