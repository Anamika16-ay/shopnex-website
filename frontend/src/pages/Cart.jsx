import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { refreshCounts } = useCart();
  const [items, setItems] = useState(null);
  const [totals, setTotals] = useState({ subtotal: 0, shipping: 0, tax: 0, total: 0 });

  const load = () => api.get('/cart').then(({ data }) => { setItems(data.items); setTotals(data.totals); });
  useEffect(() => { load(); }, []);

  const updateQty = async (itemId, quantity) => {
    const { data } = await api.put(`/cart/${itemId}`, { quantity });
    setTotals(data.totals);
    setItems((prev) => prev.map((i) => (i._id === itemId ? { ...i, quantity } : i)));
    refreshCounts();
  };

  const removeItem = async (itemId) => {
    const { data } = await api.put(`/cart/${itemId}`, { action: 'remove' });
    setTotals(data.totals);
    setItems((prev) => prev.filter((i) => i._id !== itemId));
    refreshCounts();
  };

  if (!items) return <Loader />;

  return (
    <div className="container py-5">
      <h1 className="section-title" data-aos="fade-up">Shopping <span>Cart</span></h1>
      <p className="section-subtitle" data-aos="fade-up">{items.length} item(s) in your cart</p>

      {items.length === 0 ? (
        <div className="text-center py-5">
          <i className="fa-solid fa-cart-shopping fa-3x text-muted mb-3"></i>
          <h5>Your cart is empty</h5>
          <Link to="/products" className="btn btn-primary-brand mt-2">Start Shopping</Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            {items.map((item) => {
              const price = Math.round((item.product.price - (item.product.price * item.product.discountPercent) / 100) * 100) / 100;
              return (
                <div className="glass-card p-3 mb-3 d-flex align-items-center gap-3" key={item._id}>
                  <img src={item.product.thumbnail} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12 }} alt={item.product.name} />
                  <div className="flex-grow-1">
                    <Link to={`/product/${item.product.slug}`} className="fw-semibold text-reset">{item.product.name}</Link>
                    <div className="text-muted small">₹{price.toFixed(2)} each</div>
                    <div className="qty-control d-flex align-items-center border rounded-pill overflow-hidden mt-2" style={{ width: 'fit-content' }}>
                      <button className="btn px-3" onClick={() => updateQty(item._id, Math.max(1, item.quantity - 1))}>−</button>
                      <input type="number" className="form-control border-0 text-center" style={{ width: 55 }} value={item.quantity}
                        onChange={(e) => updateQty(item._id, Math.max(1, parseInt(e.target.value || 1, 10)))} />
                      <button className="btn px-3" onClick={() => updateQty(item._id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold">₹{(price * item.quantity).toFixed(2)}</div>
                    <button className="btn btn-sm btn-outline-danger mt-2" onClick={() => removeItem(item._id)}><i className="fa-solid fa-trash"></i></button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-lg-4">
            <div className="glass-card p-4" data-aos="fade-left">
              <h5 className="mb-3">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>₹{totals.subtotal.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between mb-2"><span>Shipping</span><span>{totals.shipping === 0 ? 'FREE' : `₹${totals.shipping.toFixed(2)}`}</span></div>
              <div className="d-flex justify-content-between mb-2"><span>Tax (5%)</span><span>₹{totals.tax.toFixed(2)}</span></div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5 mb-4"><span>Total</span><span>₹{totals.total.toFixed(2)}</span></div>
              <Link to="/checkout" className="btn btn-primary-brand w-100 btn-lg">Proceed to Checkout <i className="fa-solid fa-arrow-right ms-2"></i></Link>
              <Link to="/products" className="btn btn-outline-brand w-100 mt-2">Continue Shopping</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
