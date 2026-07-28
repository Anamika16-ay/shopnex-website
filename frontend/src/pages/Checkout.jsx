import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function Checkout() {
  const { user } = useAuth();
  const { refreshCounts } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const buyNowId = searchParams.get('buyNow');

  const [items, setItems] = useState(null);
  const [totals, setTotals] = useState({ subtotal: 0, shipping: 0, tax: 0, total: 0 });
  const [form, setForm] = useState({
    shippingName: user?.fullName || '', shippingPhone: user?.phone || '',
    shippingAddress: user?.addressLine1 || '', shippingCity: user?.city || '',
    shippingState: user?.state || '', shippingPostalCode: user?.postalCode || '',
    paymentMethod: 'cod',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (buyNowId) return; // buy-now skips cart fetch entirely; totals are computed server-side on order placement
    api.get('/cart').then(({ data }) => { setItems(data.items); setTotals(data.totals); });
  }, [buyNowId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (buyNowId) payload.buyNowProductId = buyNowId;
      const { data } = await api.post('/orders', payload);
      refreshCounts();
      navigate(`/order-success/${data.order.orderNumber}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not place order', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  if (!buyNowId && !items) return <Loader />;

  return (
    <div className="container py-5">
      <h1 className="section-title" data-aos="fade-up">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="glass-card p-4 mb-4" data-aos="fade-up">
              <h5 className="mb-3"><i className="fa-solid fa-location-dot me-2 text-brand"></i>Shipping Address</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="shippingName" className="form-control" value={form.shippingName} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" name="shippingPhone" className="form-control" value={form.shippingPhone} onChange={handleChange} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Address Line 1</label>
                  <input type="text" name="shippingAddress" className="form-control" value={form.shippingAddress} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">City</label>
                  <input type="text" name="shippingCity" className="form-control" value={form.shippingCity} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">State</label>
                  <input type="text" name="shippingState" className="form-control" value={form.shippingState} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Postal Code</label>
                  <input type="text" name="shippingPostalCode" className="form-control" value={form.shippingPostalCode} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="glass-card p-4" data-aos="fade-up">
              <h5 className="mb-3"><i className="fa-solid fa-credit-card me-2 text-brand"></i>Payment Method</h5>
              {[['cod', 'Cash on Delivery', 'fa-money-bill-wave'], ['card', 'Credit / Debit Card', 'fa-credit-card'], ['upi', 'UPI', 'fa-mobile-screen']].map(([val, label, icon]) => (
                <div className="form-check mb-2 p-3 border rounded-md" key={val}>
                  <input className="form-check-input" type="radio" name="paymentMethod" value={val} id={`pm-${val}`}
                    checked={form.paymentMethod === val} onChange={handleChange} />
                  <label className="form-check-label w-100" htmlFor={`pm-${val}`}><i className={`fa-solid ${icon} me-2`}></i>{label}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="glass-card p-4" data-aos="fade-left">
              <h5 className="mb-3">Order Summary</h5>
              {!buyNowId && items?.map((item) => {
                const price = Math.round((item.product.price - (item.product.price * item.product.discountPercent) / 100) * 100) / 100;
                return (
                  <div className="d-flex justify-content-between small mb-2" key={item._id}>
                    <span>{item.product.name} x{item.quantity}</span>
                    <span>₹{(price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
              {!buyNowId && (
                <>
                  <hr />
                  <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>₹{totals.subtotal.toFixed(2)}</span></div>
                  <div className="d-flex justify-content-between mb-2"><span>Shipping</span><span>{totals.shipping === 0 ? 'FREE' : `₹${totals.shipping.toFixed(2)}`}</span></div>
                  <div className="d-flex justify-content-between mb-2"><span>Tax</span><span>₹{totals.tax.toFixed(2)}</span></div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold fs-5 mb-4"><span>Total</span><span>₹{totals.total.toFixed(2)}</span></div>
                </>
              )}
              {buyNowId && <p className="text-muted small">Order total will be calculated at checkout confirmation.</p>}
              <button type="submit" className="btn btn-primary-brand w-100 btn-lg" disabled={submitting}>
                {submitting ? 'Placing Order...' : <>Place Order <i className="fa-solid fa-check ms-2"></i></>}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
