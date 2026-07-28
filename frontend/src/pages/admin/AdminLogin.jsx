import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #0b0b0f, #14267f)', minHeight: '100vh' }}>
      <div className="auth-wrapper" style={{ minHeight: '100vh' }}>
        <div className="glass-card auth-card" style={{ background: 'rgba(255,255,255,0.95)' }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold"><i className="fa-solid fa-shield-halved text-brand me-2"></i>Admin Panel</h2>
            <p className="text-muted">Sign in to manage ShopNex</p>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Admin Email</label>
              <input type="email" className="form-control" required autoFocus
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" required
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-dark-brand w-100 btn-lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Login to Dashboard'}
            </button>
          </form>
          <p className="text-center mt-4 mb-0 small"><Link to="/" className="text-muted"><i className="fa-solid fa-arrow-left me-1"></i>Back to Store</Link></p>
        </div>
      </div>
    </div>
  );
}
