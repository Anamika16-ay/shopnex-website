import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password: form.password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'This link is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <div className="container py-5 text-center">Invalid reset link. <Link to="/forgot-password">Request a new one</Link>.</div>;

  return (
    <div className="auth-wrapper">
      <div className="glass-card auth-card" data-aos="zoom-in">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Reset Password</h2>
          <p className="text-muted">Choose a new password for your account</p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        {success ? (
          <>
            <div className="alert alert-success py-2">Your password has been reset successfully.</div>
            <button className="btn btn-primary-brand w-100 btn-lg" onClick={() => navigate('/login')}>Go to Login</button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input type="password" className="form-control" minLength={8} required autoFocus
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-control" minLength={8} required
                value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary-brand w-100 btn-lg" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
