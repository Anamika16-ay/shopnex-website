import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${orderNumber}`).then(({ data }) => setOrder(data.order)).catch(() => setOrder(false));
  }, [orderNumber]);

  if (order === null) return <Loader />;
  if (order === false) return <div className="container py-5 text-center">Order not found.</div>;

  return (
    <div className="container py-5 text-center">
      <div className="glass-card p-5 mx-auto" style={{ maxWidth: 560 }} data-aos="zoom-in">
        <div className="mb-3"><i className="fa-solid fa-circle-check text-success" style={{ fontSize: '4.5rem' }}></i></div>
        <h2 className="mb-2">Order Placed Successfully!</h2>
        <p className="text-muted">Thank you for shopping with ShopNex. Your order is being processed.</p>

        <div className="text-start bg-light rounded-md p-3 my-4">
          <div className="d-flex justify-content-between mb-2"><span className="text-muted">Order Number</span><strong>{order.orderNumber}</strong></div>
          <div className="d-flex justify-content-between mb-2"><span className="text-muted">Total Amount</span><strong>₹{order.totalAmount.toFixed(2)}</strong></div>
          <div className="d-flex justify-content-between mb-2"><span className="text-muted">Payment Method</span><strong className="text-uppercase">{order.paymentMethod}</strong></div>
          <div className="d-flex justify-content-between"><span className="text-muted">Delivery Address</span><strong className="text-end">{order.shippingCity}, {order.shippingState}</strong></div>
        </div>

        <div className="d-flex gap-3 justify-content-center">
          <Link to="/orders" className="btn btn-primary-brand">View Orders</Link>
          <Link to="/products" className="btn btn-outline-brand">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
