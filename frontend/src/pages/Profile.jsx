import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { wishlistCount } = useCart();
  const { showToast } = useToast();
  const [form, setForm] = useState({});
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (user) setForm(user);
    api.get('/orders').then(({ data }) => setOrderCount(data.orders.length));
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/auth/me', form);
      updateUser(data.user);
      showToast('Profile updated successfully.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update profile', 'danger');
    }
  };

  if (!user) return null;

  return (
    <div className="container py-5">
      <h1 className="section-title" data-aos="fade-up">My <span>Profile</span></h1>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="glass-card p-4 text-center" data-aos="fade-right">
            <div className="mx-auto mb-3 rounded-circle bg-brand text-white d-flex align-items-center justify-content-center" style={{ width: 90, height: 90, fontSize: '2rem' }}>
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
            <h5 className="mb-0">{user.fullName}</h5>
            <p className="text-muted small">{user.email}</p>
            <hr />
            <div className="d-flex justify-content-around">
              <div><strong>{orderCount}</strong><div className="small text-muted">Orders</div></div>
              <div><strong>{wishlistCount}</strong><div className="small text-muted">Wishlist</div></div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="glass-card p-4" data-aos="fade-left">
            <h5 className="mb-3">Edit Profile & Address</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="fullName" className="form-control" value={form.fullName || ''} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email (read-only)</label>
                  <input type="email" className="form-control" value={form.email || ''} disabled />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" name="phone" className="form-control" value={form.phone || ''} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Postal Code</label>
                  <input type="text" name="postalCode" className="form-control" value={form.postalCode || ''} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label">Address Line 1</label>
                  <input type="text" name="addressLine1" className="form-control" value={form.addressLine1 || ''} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label">Address Line 2</label>
                  <input type="text" name="addressLine2" className="form-control" value={form.addressLine2 || ''} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">City</label>
                  <input type="text" name="city" className="form-control" value={form.city || ''} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">State</label>
                  <input type="text" name="state" className="form-control" value={form.state || ''} onChange={handleChange} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary-brand mt-4">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
