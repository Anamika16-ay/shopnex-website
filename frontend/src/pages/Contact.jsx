import { useState } from 'react';
import api from '../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(false); setLoading(true);
    try {
      await api.post('/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Please fill in all required fields with a valid email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5" data-aos="fade-up">
        <h1 className="section-title">Get in <span>Touch</span></h1>
        <p className="section-subtitle">We'd love to hear from you. Send us a message!</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          {[['fa-location-dot', 'Address', 'Lucknow, Uttar Pradesh, India'], ['fa-phone', 'Phone', '+91 98765 43210'], ['fa-envelope', 'Email', 'support@shopnex.com']].map(([icon, label, val]) => (
            <div className="glass-card p-4 mb-3 d-flex align-items-center gap-3" key={label} data-aos="fade-right">
              <div className="stat-icon"><i className={`fa-solid ${icon}`}></i></div>
              <div><strong>{label}</strong><div className="text-muted small">{val}</div></div>
            </div>
          ))}
        </div>

        <div className="col-lg-8">
          <div className="glass-card p-4" data-aos="fade-left">
            {success && <div className="alert alert-success">Thanks for reaching out! Our team will get back to you within 24 hours.</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Your Name</label>
                  <input type="text" className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Your Email</label>
                  <input type="email" className="form-control" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label">Subject</label>
                  <input type="text" className="form-control" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label">Message</label>
                  <textarea rows="5" className="form-control" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}></textarea>
                </div>
              </div>
              <button type="submit" className="btn btn-primary-brand btn-lg mt-4" disabled={loading}>
                {loading ? 'Sending...' : <>Send Message <i className="fa-solid fa-paper-plane ms-2"></i></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
