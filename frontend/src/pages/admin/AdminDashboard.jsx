import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data));
  }, []);

  useEffect(() => {
    if (!stats || !chartRef.current || !window.Chart) return;
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new window.Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: stats.chartLabels,
        datasets: [{
          label: 'Revenue (₹)',
          data: stats.chartValues,
          borderColor: '#1f3fd6',
          backgroundColor: 'rgba(31,63,214,0.1)',
          tension: 0.4,
          fill: true,
        }],
      },
      options: { responsive: true, plugins: { legend: { display: false } } },
    });
  }, [stats]);

  if (!stats) return <AdminLayout title="Dashboard"><Loader /></AdminLayout>;

  const statCards = [
    { icon: 'fa-indian-rupee-sign', label: 'Total Sales', value: `₹${stats.totalSales.toFixed(2)}` },
    { icon: 'fa-receipt', label: 'Orders', value: stats.totalOrders },
    { icon: 'fa-users', label: 'Customers', value: stats.totalCustomers },
    { icon: 'fa-box', label: 'Products', value: stats.totalProducts },
    { icon: 'fa-hourglass-half', label: 'Pending Orders', value: stats.pendingOrders, bg: 'linear-gradient(135deg,#f59e0b,#f97316)' },
    { icon: 'fa-triangle-exclamation', label: 'Low Stock', value: stats.lowStock, bg: 'linear-gradient(135deg,#e11d48,#f43f5e)' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="row g-3 mb-4">
        {statCards.map((s) => (
          <div className="col-md-4 col-xl-2" key={s.label}>
            <div className="stat-card">
              <div className="stat-icon" style={s.bg ? { background: s.bg } : {}}><i className={`fa-solid ${s.icon}`}></i></div>
              <div><div className="text-muted small">{s.label}</div><h5 className="mb-0">{s.value}</h5></div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="admin-table p-4">
            <h6 className="mb-3">Revenue — Last 7 Days</h6>
            <canvas ref={chartRef} height="90"></canvas>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="admin-table p-4 h-100">
            <h6 className="mb-3">Quick Actions</h6>
            <Link to="/admin/products" className="btn btn-primary-brand w-100 mb-2"><i className="fa-solid fa-plus me-2"></i>Add Product</Link>
            <Link to="/admin/orders" className="btn btn-outline-brand w-100 mb-2"><i className="fa-solid fa-receipt me-2"></i>Manage Orders</Link>
            <Link to="/admin/reports" className="btn btn-outline-brand w-100"><i className="fa-solid fa-chart-line me-2"></i>View Reports</Link>
          </div>
        </div>
      </div>

      <div className="admin-table mt-4">
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Recent Orders</h6>
          <Link to="/admin/orders" className="small">View All</Link>
        </div>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead><tr><th>Order #</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {stats.recentOrders.map((o) => (
                <tr key={o._id}>
                  <td>{o.orderNumber}</td>
                  <td>{o.user?.fullName}</td>
                  <td>₹{o.totalAmount.toFixed(2)}</td>
                  <td><span className={`status-pill status-${o.orderStatus}`}>{o.orderStatus.replace(/_/g, ' ')}</span></td>
                  <td>{new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
