import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminLayout({ title, children }) {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin/dashboard', icon: 'fa-gauge-high', label: 'Dashboard' },
    { path: '/admin/products', icon: 'fa-box', label: 'Products' },
    { path: '/admin/orders', icon: 'fa-receipt', label: 'Orders' },
    { path: '/admin/customers', icon: 'fa-users', label: 'Customers' },
    { path: '/admin/reports', icon: 'fa-chart-line', label: 'Reports' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">Shop<span>Nex</span> <small style={{ display: 'block', fontWeight: 400, fontSize: '.7rem', color: '#8b8fa3', letterSpacing: 1, textTransform: 'uppercase' }}>Admin</small></div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={location.pathname === item.path ? 'active' : ''}>
              <i className={`fa-solid ${item.icon}`}></i> {item.label}
            </Link>
          ))}
          <a href="/" target="_blank" rel="noreferrer"><i className="fa-solid fa-store"></i> View Store</a>
          <button onClick={() => { logout(); navigate('/admin/login'); }} style={{ color: '#e11d48' }}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <h5 className="mb-0">{title}</h5>
          <div className="ms-auto d-flex align-items-center gap-3">
            <span className="small text-muted">Hi, {admin?.name || 'Admin'}</span>
            <div className="rounded-circle bg-brand text-white d-flex align-items-center justify-content-center" style={{ width: 38, height: 38, fontWeight: 700 }}>
              {(admin?.name || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
