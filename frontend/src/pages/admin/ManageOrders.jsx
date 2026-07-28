import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';
import { useToast } from '../../context/ToastContext';

const allStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

export default function ManageOrders() {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const statusFilter = searchParams.get('status') || '';
  const viewId = searchParams.get('id');

  const loadOrders = () => api.get('/admin/orders', { params: { status: statusFilter } }).then(({ data }) => setOrders(data.orders));

  useEffect(() => { loadOrders(); }, [statusFilter]);

  useEffect(() => {
    if (viewId) {
      api.get(`/admin/orders/${viewId}`).then(({ data }) => { setSelectedOrder(data.order); setNewStatus(data.order.orderStatus); });
    } else {
      setSelectedOrder(null);
    }
  }, [viewId]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/orders/${viewId}/status`, { orderStatus: newStatus });
      showToast('Order status updated.', 'success');
      const { data } = await api.get(`/admin/orders/${viewId}`);
      setSelectedOrder(data.order);
      loadOrders();
    } catch {
      showToast('Could not update status.', 'danger');
    }
  };

  if (viewId && selectedOrder) {
    const order = selectedOrder;
    return (
      <AdminLayout title={`Order #${order.orderNumber}`}>
        <button className="btn btn-sm btn-outline-brand mb-3" onClick={() => setSearchParams({})}>
          <i className="fa-solid fa-arrow-left me-1"></i>Back to Orders
        </button>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="admin-table p-4 mb-4">
              <h5 className="mb-3">Order #{order.orderNumber}</h5>
              <table className="table table-sm mb-0">
                <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th></tr></thead>
                <tbody>
                  {order.items.map((oi, i) => (
                    <tr key={i}>
                      <td className="d-flex align-items-center gap-2">
                        <img src={oi.productImage} className="admin-thumb" alt="" />{oi.productName}
                      </td>
                      <td>₹{oi.unitPrice.toFixed(2)}</td>
                      <td>{oi.quantity}</td>
                      <td>₹{oi.lineTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr />
              <div className="d-flex justify-content-between"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between"><span>Shipping</span><span>₹{order.shippingFee.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between"><span>Tax</span><span>₹{order.taxAmount.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between fw-bold fs-5"><span>Total</span><span>₹{order.totalAmount.toFixed(2)}</span></div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="admin-table p-4 mb-4">
              <h6 className="mb-3">Customer</h6>
              <p className="mb-1"><strong>{order.user?.fullName}</strong></p>
              <p className="mb-1 text-muted small">{order.user?.email}</p>
              <p className="mb-0 text-muted small">{order.user?.phone}</p>
            </div>
            <div className="admin-table p-4 mb-4">
              <h6 className="mb-3">Shipping Address</h6>
              <p className="mb-1">{order.shippingName} — {order.shippingPhone}</p>
              <p className="mb-0 text-muted small">{order.shippingAddress}, {order.shippingCity}, {order.shippingState} - {order.shippingPostalCode}</p>
            </div>
            <div className="admin-table p-4">
              <h6 className="mb-3">Update Status</h6>
              <form onSubmit={handleStatusUpdate}>
                <select className="form-select mb-3" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  {allStatuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}</option>)}
                </select>
                <button type="submit" className="btn btn-primary-brand w-100">Update Status</button>
              </form>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manage Orders">
      <div className="d-flex flex-wrap gap-2 mb-3">
        <button className={`btn btn-sm ${!statusFilter ? 'btn-primary-brand' : 'btn-outline-brand'}`} onClick={() => setSearchParams({})}>All</button>
        {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary-brand' : 'btn-outline-brand'}`} onClick={() => setSearchParams({ status: s })}>
            {s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {!orders ? <Loader /> : (
        <div className="admin-table">
          <div className="table-responsive">
            <table className="table mb-0">
              <thead><tr><th>Order #</th><th>Customer</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td>{o.orderNumber}</td>
                    <td>{o.user?.fullName}</td>
                    <td>₹{o.totalAmount.toFixed(2)}</td>
                    <td className="text-uppercase small">{o.paymentMethod}</td>
                    <td><span className={`status-pill status-${o.orderStatus}`}>{o.orderStatus.replace(/_/g, ' ')}</span></td>
                    <td>{new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td><button className="btn btn-sm btn-outline-brand" onClick={() => setSearchParams({ id: o._id })}>View</button></td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-4">No orders found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
