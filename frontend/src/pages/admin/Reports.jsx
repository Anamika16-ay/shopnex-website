import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';

const rangeOptions = { 7: '7 Days', 30: '30 Days', 90: '90 Days', 365: '1 Year' };

export default function Reports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const range = searchParams.get('range') || '30';
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/reports', { params: { range } }).then(({ data }) => setData(data));
  }, [range]);

  if (!data) return <AdminLayout title="Reports"><Loader /></AdminLayout>;

  return (
    <AdminLayout title="Reports">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h6 className="mb-0">Showing data for the last {data.days} days</h6>
        <div className="btn-group">
          {Object.entries(rangeOptions).map(([val, label]) => (
            <button key={val} className={`btn btn-sm ${range === val ? 'btn-primary-brand' : 'btn-outline-brand'}`} onClick={() => setSearchParams({ range: val })}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          ['fa-indian-rupee-sign', 'Revenue', `₹${data.totalRevenue.toFixed(2)}`],
          ['fa-receipt', 'Orders', data.totalOrders],
          ['fa-chart-simple', 'Avg. Order Value', `₹${data.avgOrderValue.toFixed(2)}`],
          ['fa-user-plus', 'New Customers', data.newCustomers],
        ].map(([icon, label, val]) => (
          <div className="col-md-3" key={label}>
            <div className="stat-card">
              <div className="stat-icon"><i className={`fa-solid ${icon}`}></i></div>
              <div><div className="text-muted small">{label}</div><h5 className="mb-0">{val}</h5></div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="admin-table p-4 h-100">
            <h6 className="mb-3">Top Selling Products</h6>
            <table className="table table-sm mb-0">
              <thead><tr><th>Product</th><th>Units Sold</th><th>Revenue</th></tr></thead>
              <tbody>
                {data.topProducts.map((tp) => (
                  <tr key={tp._id}>
                    <td className="d-flex align-items-center gap-2">
                      <img src={tp.thumbnail} className="admin-thumb" alt="" />{tp.name}
                    </td>
                    <td>{tp.unitsSold}</td>
                    <td>₹{tp.revenue.toFixed(2)}</td>
                  </tr>
                ))}
                {data.topProducts.length === 0 && <tr><td colSpan="3" className="text-center text-muted py-3">No sales data for this period.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="admin-table p-4 h-100">
            <h6 className="mb-3">Order Status Breakdown</h6>
            <div className="d-flex flex-wrap gap-3">
              {data.statusBreakdown.map((sb) => (
                <div className="stat-card" style={{ minWidth: 180 }} key={sb._id}>
                  <div className="stat-icon"><i className="fa-solid fa-box-open"></i></div>
                  <div><div className="text-muted small text-capitalize">{sb._id.replace(/_/g, ' ')}</div><h5 className="mb-0">{sb.count}</h5></div>
                </div>
              ))}
              {data.statusBreakdown.length === 0 && <p className="text-muted mb-0">No orders in this period.</p>}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
