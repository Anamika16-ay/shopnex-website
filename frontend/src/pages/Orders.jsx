import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
const statusLabels = {
  pending: 'Order Placed', confirmed: 'Confirmed', processing: 'Processing',
  shipped: 'Shipped', out_for_delivery: 'Out for Delivery', delivered: 'Delivered',
  cancelled: 'Cancelled', returned: 'Returned',
};

export default function Orders() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data.orders));
  }, []);

  if (!orders) return <Loader />;

  return (
    <div className="container py-5">
      <h1 className="section-title" data-aos="fade-up">My <span>Orders</span></h1>
      <p className="section-subtitle" data-aos="fade-up">Track and manage your orders</p>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="fa-solid fa-box fa-3x text-muted mb-3"></i>
          <h5>No orders yet</h5>
          <Link to="/products" className="btn btn-primary-brand mt-2">Start Shopping</Link>
        </div>
      ) : (
        orders.map((order) => {
          const stepIndex = statusSteps.indexOf(order.orderStatus);
          return (
            <div className="glass-card p-4 mb-4" key={order._id} data-aos="fade-up">
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <div>
                  <strong>Order #{order.orderNumber}</strong>
                  <span className="text-muted small d-block">{new Date(order.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <span className={`badge px-3 py-2 ${['cancelled', 'returned'].includes(order.orderStatus) ? 'text-bg-danger' : 'text-bg-primary'}`}>
                  {statusLabels[order.orderStatus] || order.orderStatus}
                </span>
              </div>

              {stepIndex !== -1 && (
                <div className="progress mb-3" style={{ height: 6 }}>
                  <div className="progress-bar bg-brand" style={{ width: `${((stepIndex + 1) / statusSteps.length) * 100}%` }}></div>
                </div>
              )}

              <div className="row g-2 mb-3">
                {order.items.map((item, i) => (
                  <div className="col-md-6 d-flex align-items-center gap-2" key={i}>
                    <img src={item.productImage} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} alt="" />
                    <div className="small">
                      <div className="fw-semibold">{item.productName}</div>
                      <div className="text-muted">Qty: {item.quantity} × ₹{item.unitPrice.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Total: ₹{order.totalAmount.toFixed(2)}</span>
                <span className="text-muted small">Delivering to {order.shippingCity}, {order.shippingState}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
