import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';
import { useToast } from '../../context/ToastContext';

export default function ManageCustomers() {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState(null);
  const [search, setSearch] = useState('');

  const loadCustomers = () => api.get('/admin/customers', { params: { search } }).then(({ data }) => setCustomers(data.customers));

  useEffect(() => { loadCustomers(); }, [search]);

  const toggleStatus = async (id) => {
    try {
      await api.put(`/admin/customers/${id}/toggle-status`);
      showToast('Customer status updated.', 'success');
      loadCustomers();
    } catch {
      showToast('Could not update customer status.', 'danger');
    }
  };

  return (
    <AdminLayout title="Manage Customers">
      <input type="text" className="form-control mb-3" style={{ maxWidth: 400 }} placeholder="Search by name or email"
        value={search} onChange={(e) => setSearch(e.target.value)} />

      {!customers ? <Loader /> : (
        <div className="admin-table">
          <div className="table-responsive">
            <table className="table mb-0">
              <thead><tr><th>Customer</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Spent</th><th>Status</th><th>Joined</th><th>Action</th></tr></thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id}>
                    <td>{c.fullName}</td>
                    <td>{c.email}</td>
                    <td>{c.phone || '—'}</td>
                    <td>{c.orderCount}</td>
                    <td>₹{c.totalSpent.toFixed(2)}</td>
                    <td><span className={`status-pill status-${c.status}`}>{c.status}</span></td>
                    <td>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <button className={`btn btn-sm ${c.status === 'active' ? 'btn-outline-danger' : 'btn-outline-brand'}`} onClick={() => toggleStatus(c._id)}>
                        {c.status === 'active' ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && <tr><td colSpan="8" className="text-center text-muted py-4">No customers found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
